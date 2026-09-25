'use strict';

const path = require('path');
const sql = require('mssql');

process.loadEnvFile(path.join(__dirname, '..', '.env'));

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    server: process.env.DB_HOST,
    database: process.env.DB_DB,
    options: { encrypt: false, trustServerCertificate: true }
};

async function colExists(pool, table, col) {
    const r = await pool.request().query(`
        SELECT 1 AS X FROM sys.columns
        WHERE object_id = OBJECT_ID(N'dbo.${table}') AND name = '${col.replace(/'/g, "''")}'
    `);
    return !!(r.recordset && r.recordset.length);
}

async function tableExists(pool, name) {
    const r = await pool.request().query(`
        SELECT 1 AS X FROM sys.tables WHERE name = '${name.replace(/'/g, "''")}' AND schema_id = SCHEMA_ID('dbo')
    `);
    return !!(r.recordset && r.recordset.length);
}

async function runStep(pool, label, q) {
    await pool.request().query(q);
    console.log('OK:', label);
}

async function main() {
    const pool = await sql.connect(config);

    if (!(await colExists(pool, 'CONCURSOS', 'CODMARCA'))) {
        await runStep(
            pool,
            'CONCURSOS.CODMARCA',
            `ALTER TABLE dbo.CONCURSOS ADD CODMARCA INT NOT NULL
             CONSTRAINT DF_CONCURSOS_CODMARCA DEFAULT 0`
        );
    } else {
        console.log('SKIP: CONCURSOS.CODMARCA ya existe');
    }

    if (!(await tableExists(pool, 'CONCURSOS_PRODUCTOS'))) {
        await runStep(
            pool,
            'CONCURSOS_PRODUCTOS tabla',
            `CREATE TABLE dbo.CONCURSOS_PRODUCTOS (
                ID INT IDENTITY(1,1) NOT NULL,
                IDCONCURSO INT NOT NULL,
                CODPROD VARCHAR(50) NOT NULL,
                CONSTRAINT PK_CONCURSOS_PRODUCTOS PRIMARY KEY CLUSTERED (ID),
                CONSTRAINT UQ_CONCURSOS_PROD UNIQUE (IDCONCURSO, CODPROD)
            );
            CREATE NONCLUSTERED INDEX IX_CONCURSOS_PROD_CONC ON dbo.CONCURSOS_PRODUCTOS (IDCONCURSO)`
        );
    } else {
        console.log('SKIP: CONCURSOS_PRODUCTOS ya existe');
    }

    if (await tableExists(pool, 'CONCURSOS_OBJETIVOS_PRODUCTOS')) {
        await runStep(
            pool,
            'Migrar CONCURSOS_OBJETIVOS_PRODUCTOS',
            `INSERT INTO dbo.CONCURSOS_PRODUCTOS (IDCONCURSO, CODPROD)
            SELECT DISTINCT O.IDCONCURSO, OP.CODPROD
            FROM dbo.CONCURSOS_OBJETIVOS_PRODUCTOS OP
            INNER JOIN dbo.CONCURSOS_OBJETIVOS O ON O.ID = OP.ID_OBJETIVO
            WHERE NOT EXISTS (
                SELECT 1 FROM dbo.CONCURSOS_PRODUCTOS CP
                WHERE CP.IDCONCURSO = O.IDCONCURSO AND CP.CODPROD = OP.CODPROD
            )`
        );
    }

    if (await colExists(pool, 'CONCURSOS_OBJETIVOS', 'CODPROD')) {
        await runStep(
            pool,
            'Migrar CODPROD en CONCURSOS_OBJETIVOS',
            `INSERT INTO dbo.CONCURSOS_PRODUCTOS (IDCONCURSO, CODPROD)
            SELECT DISTINCT O.IDCONCURSO, LTRIM(RTRIM(O.CODPROD))
            FROM dbo.CONCURSOS_OBJETIVOS O
            WHERE O.CODPROD IS NOT NULL AND LTRIM(RTRIM(O.CODPROD)) <> ''
            AND NOT EXISTS (
                SELECT 1 FROM dbo.CONCURSOS_PRODUCTOS CP
                WHERE CP.IDCONCURSO = O.IDCONCURSO AND CP.CODPROD = LTRIM(RTRIM(O.CODPROD))
            )`
        );
    }

    if (await colExists(pool, 'CONCURSOS_OBJETIVOS', 'CODMARCA')) {
        await runStep(
            pool,
            'CONCURSOS.CODMARCA desde objetivos',
            `UPDATE C SET C.CODMARCA = ISNULL(X.CODMARCA, 0)
            FROM dbo.CONCURSOS C
            INNER JOIN (
                SELECT O.IDCONCURSO, MAX(ISNULL(O.CODMARCA, 0)) AS CODMARCA
                FROM dbo.CONCURSOS_OBJETIVOS O
                GROUP BY O.IDCONCURSO
            ) X ON X.IDCONCURSO = C.IDCONCURSO
            WHERE ISNULL(C.CODMARCA, 0) = 0 AND ISNULL(X.CODMARCA, 0) > 0`
        );
    }

    await runStep(
        pool,
        'Unificar objetivos duplicados (IDCONCURSO + CODEMP)',
        `;WITH Agg AS (
            SELECT IDCONCURSO, CODEMP,
                MAX(ISNULL(COBERTURA, 0)) AS COBERTURA,
                MAX(ISNULL(IMPORTE, 0)) AS IMPORTE,
                MIN(ID) AS KEEP_ID
            FROM dbo.CONCURSOS_OBJETIVOS
            GROUP BY IDCONCURSO, CODEMP
        )
        UPDATE O SET
            O.COBERTURA = A.COBERTURA,
            O.IMPORTE = A.IMPORTE
        FROM dbo.CONCURSOS_OBJETIVOS O
        INNER JOIN Agg A ON A.KEEP_ID = O.ID;
        ;WITH DupObj AS (
            SELECT ID, ROW_NUMBER() OVER (PARTITION BY IDCONCURSO, CODEMP ORDER BY ID) AS RN
            FROM dbo.CONCURSOS_OBJETIVOS
        )
        DELETE FROM dbo.CONCURSOS_OBJETIVOS
        WHERE ID IN (SELECT ID FROM DupObj WHERE RN > 1)`
    );

    if (await tableExists(pool, 'CONCURSOS_OBJETIVOS_PRODUCTOS')) {
        await runStep(pool, 'DROP CONCURSOS_OBJETIVOS_PRODUCTOS', `DROP TABLE dbo.CONCURSOS_OBJETIVOS_PRODUCTOS`);
    }

    if (await colExists(pool, 'CONCURSOS_OBJETIVOS', 'CODMARCA')) {
        await runStep(pool, 'DROP CONCURSOS_OBJETIVOS.CODMARCA', `ALTER TABLE dbo.CONCURSOS_OBJETIVOS DROP COLUMN CODMARCA`);
    }

    if (await colExists(pool, 'CONCURSOS_OBJETIVOS', 'CODPROD')) {
        await runStep(pool, 'DROP CONCURSOS_OBJETIVOS.CODPROD', `ALTER TABLE dbo.CONCURSOS_OBJETIVOS DROP COLUMN CODPROD`);
    }

    console.log('CONCURSOS_REORG completado');
    process.exit(0);
}

main().catch((e) => {
    console.error(e && e.message ? e.message : e);
    process.exit(1);
});
