/**
 * STOCK2 — inventario materializado en INV_STOCK (paralelo a STOCK1 = view_invsaldo).
 *
 * Signo: CONFIG_TIPODOCUMENTOS.INV (1 entrada, -1 salida, 0 no afecta).
 * Solo documentos STATUS <> 'A'.
 */
'use strict';

const sql = require('mssql');

function getDbConfig(token) {
    return {
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        server: process.env.DB_HOST,
        database: process.env.DB_DB,
        pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
        options: {
            encrypt: false,
            trustServerCertificate: true,
            requestTimeout: 600000,
        },
    };
}

async function withPool(token, workFn) {
    const config = getDbConfig(token);
    const pool = new sql.ConnectionPool(config);
    try {
        await pool.connect();
        return await workFn(pool);
    } finally {
        try { await pool.close(); } catch (e) { /* ignore */ }
    }
}

async function exec(pool, text) {
    const req = new sql.Request(pool);
    req.timeout = 600000;
    return req.query(text);
}

const DDL_TABLE = `
IF OBJECT_ID('dbo.INV_STOCK', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.INV_STOCK (
        EMPNIT      VARCHAR(50)  NOT NULL,
        CODPROD     VARCHAR(50)  NOT NULL,
        EXISTENCIA  DECIMAL(18, 4) NOT NULL CONSTRAINT DF_INV_STOCK_EXISTENCIA DEFAULT (0),
        LASTUPDATE  DATETIME     NULL,
        CONSTRAINT PK_INV_STOCK PRIMARY KEY CLUSTERED (EMPNIT, CODPROD)
    );
END
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_INV_STOCK_CODPROD' AND object_id = OBJECT_ID('dbo.INV_STOCK')
)
BEGIN
    CREATE NONCLUSTERED INDEX IX_INV_STOCK_CODPROD ON dbo.INV_STOCK (CODPROD);
END
`;

const DROP_TRG_DOCPRODUCTOS = `
IF OBJECT_ID('dbo.trg_STOCK2_DOCPRODUCTOS', 'TR') IS NOT NULL
    DROP TRIGGER dbo.trg_STOCK2_DOCPRODUCTOS;
`;

const DROP_TRG_DOCUMENTOS = `
IF OBJECT_ID('dbo.trg_STOCK2_DOCUMENTOS_STATUS', 'TR') IS NOT NULL
    DROP TRIGGER dbo.trg_STOCK2_DOCUMENTOS_STATUS;
`;

const DROP_TRG_PRODUCTOS_INS = `
IF OBJECT_ID('dbo.trg_STOCK2_PRODUCTOS_INS', 'TR') IS NOT NULL
    DROP TRIGGER dbo.trg_STOCK2_PRODUCTOS_INS;
`;

const DROP_TRG_PRODUCTOS_DEL = `
IF OBJECT_ID('dbo.trg_STOCK2_PRODUCTOS_DEL', 'TR') IS NOT NULL
    DROP TRIGGER dbo.trg_STOCK2_PRODUCTOS_DEL;
`;

const CREATE_TRG_PRODUCTOS_INS = `
CREATE TRIGGER dbo.trg_STOCK2_PRODUCTOS_INS
ON dbo.PRODUCTOS
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    IF OBJECT_ID('dbo.INV_STOCK', 'U') IS NULL RETURN;

    INSERT INTO dbo.INV_STOCK (EMPNIT, CODPROD, EXISTENCIA, LASTUPDATE)
    SELECT E.EMPNIT, i.CODPROD, 0, GETDATE()
    FROM inserted i
    CROSS JOIN EMPRESAS E
    WHERE ISNULL(i.CODPROD, '') <> ''
      AND NOT EXISTS (
            SELECT 1
            FROM dbo.INV_STOCK S
            WHERE S.EMPNIT = E.EMPNIT AND S.CODPROD = i.CODPROD
      );
END
`;

const CREATE_TRG_PRODUCTOS_DEL = `
CREATE TRIGGER dbo.trg_STOCK2_PRODUCTOS_DEL
ON dbo.PRODUCTOS
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    IF OBJECT_ID('dbo.INV_STOCK', 'U') IS NULL RETURN;

    DELETE S
    FROM dbo.INV_STOCK S
    INNER JOIN deleted d ON d.CODPROD = S.CODPROD;
END
`;

const CREATE_TRG_DOCPRODUCTOS = `
CREATE TRIGGER dbo.trg_STOCK2_DOCPRODUCTOS
ON dbo.DOCPRODUCTOS
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH deltas AS (
        SELECT i.EMPNIT,
               i.CODPROD,
               ISNULL(i.TOTALUNIDADES, 0) * CAST(ISNULL(CT.INV, 0) AS DECIMAL(18, 4)) AS DELTA
        FROM inserted i
        INNER JOIN DOCUMENTOS D
            ON D.EMPNIT = i.EMPNIT AND D.CODDOC = i.CODDOC AND D.CORRELATIVO = i.CORRELATIVO
        INNER JOIN TIPODOCUMENTOS TD
            ON TD.EMPNIT = D.EMPNIT AND TD.CODDOC = D.CODDOC
        INNER JOIN CONFIG_TIPODOCUMENTOS CT
            ON CT.TIPODOC = TD.TIPODOC
        WHERE ISNULL(D.STATUS, '') <> 'A'
          AND CT.INV IN (1, -1)

        UNION ALL

        SELECT d.EMPNIT,
               d.CODPROD,
               -ISNULL(d.TOTALUNIDADES, 0) * CAST(ISNULL(CT.INV, 0) AS DECIMAL(18, 4)) AS DELTA
        FROM deleted d
        INNER JOIN DOCUMENTOS D
            ON D.EMPNIT = d.EMPNIT AND D.CODDOC = d.CODDOC AND D.CORRELATIVO = d.CORRELATIVO
        INNER JOIN TIPODOCUMENTOS TD
            ON TD.EMPNIT = D.EMPNIT AND TD.CODDOC = D.CODDOC
        INNER JOIN CONFIG_TIPODOCUMENTOS CT
            ON CT.TIPODOC = TD.TIPODOC
        WHERE ISNULL(D.STATUS, '') <> 'A'
          AND CT.INV IN (1, -1)
    ),
    agg AS (
        SELECT EMPNIT, CODPROD, SUM(DELTA) AS DELTA
        FROM deltas
        GROUP BY EMPNIT, CODPROD
        HAVING SUM(DELTA) <> 0
    )
    MERGE dbo.INV_STOCK AS T
    USING agg AS S
       ON T.EMPNIT = S.EMPNIT AND T.CODPROD = S.CODPROD
    WHEN MATCHED THEN
        UPDATE SET EXISTENCIA = ISNULL(T.EXISTENCIA, 0) + S.DELTA,
                   LASTUPDATE = GETDATE()
    WHEN NOT MATCHED THEN
        INSERT (EMPNIT, CODPROD, EXISTENCIA, LASTUPDATE)
        VALUES (S.EMPNIT, S.CODPROD, S.DELTA, GETDATE());
END
`;

const CREATE_TRG_DOCUMENTOS = `
CREATE TRIGGER dbo.trg_STOCK2_DOCUMENTOS_STATUS
ON dbo.DOCUMENTOS
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT UPDATE(STATUS) RETURN;

    ;WITH cambios AS (
        SELECT i.EMPNIT, i.CODDOC, i.CORRELATIVO,
               CASE
                 WHEN ISNULL(d.STATUS, '') <> 'A' AND ISNULL(i.STATUS, '') = 'A' THEN -1
                 WHEN ISNULL(d.STATUS, '') = 'A' AND ISNULL(i.STATUS, '') <> 'A' THEN 1
                 ELSE 0
               END AS SIGN_APPLY
        FROM inserted i
        INNER JOIN deleted d
            ON d.EMPNIT = i.EMPNIT AND d.CODDOC = i.CODDOC AND d.CORRELATIVO = i.CORRELATIVO
        WHERE ISNULL(d.STATUS, '') <> ISNULL(i.STATUS, '')
    ),
    deltas AS (
        SELECT DP.EMPNIT,
               DP.CODPROD,
               ISNULL(DP.TOTALUNIDADES, 0)
                 * CAST(ISNULL(CT.INV, 0) AS DECIMAL(18, 4))
                 * CAST(C.SIGN_APPLY AS DECIMAL(18, 4)) AS DELTA
        FROM cambios C
        INNER JOIN DOCPRODUCTOS DP
            ON DP.EMPNIT = C.EMPNIT AND DP.CODDOC = C.CODDOC AND DP.CORRELATIVO = C.CORRELATIVO
        INNER JOIN TIPODOCUMENTOS TD
            ON TD.EMPNIT = C.EMPNIT AND TD.CODDOC = C.CODDOC
        INNER JOIN CONFIG_TIPODOCUMENTOS CT
            ON CT.TIPODOC = TD.TIPODOC
        WHERE C.SIGN_APPLY <> 0
          AND CT.INV IN (1, -1)
    ),
    agg AS (
        SELECT EMPNIT, CODPROD, SUM(DELTA) AS DELTA
        FROM deltas
        GROUP BY EMPNIT, CODPROD
        HAVING SUM(DELTA) <> 0
    )
    MERGE dbo.INV_STOCK AS T
    USING agg AS S
       ON T.EMPNIT = S.EMPNIT AND T.CODPROD = S.CODPROD
    WHEN MATCHED THEN
        UPDATE SET EXISTENCIA = ISNULL(T.EXISTENCIA, 0) + S.DELTA,
                   LASTUPDATE = GETDATE()
    WHEN NOT MATCHED THEN
        INSERT (EMPNIT, CODPROD, EXISTENCIA, LASTUPDATE)
        VALUES (S.EMPNIT, S.CODPROD, S.DELTA, GETDATE());
END
`;

const QRY_REBUILD = `
DELETE FROM dbo.INV_STOCK;

-- Semilla: todo producto x toda empresa en cero (como INVSALDO al crear producto)
INSERT INTO dbo.INV_STOCK (EMPNIT, CODPROD, EXISTENCIA, LASTUPDATE)
SELECT E.EMPNIT, P.CODPROD, 0, GETDATE()
FROM PRODUCTOS P
CROSS JOIN EMPRESAS E
WHERE ISNULL(P.CODPROD, '') <> '';

-- Aplicar existencia calculada desde movimientos
;WITH calc AS (
    SELECT D.EMPNIT,
           DP.CODPROD,
           SUM(ISNULL(DP.TOTALUNIDADES, 0) * CAST(ISNULL(CT.INV, 0) AS DECIMAL(18, 4))) AS EXISTENCIA
    FROM DOCPRODUCTOS DP
    INNER JOIN DOCUMENTOS D
        ON D.EMPNIT = DP.EMPNIT AND D.CODDOC = DP.CODDOC AND D.CORRELATIVO = DP.CORRELATIVO
    INNER JOIN TIPODOCUMENTOS TD
        ON TD.EMPNIT = D.EMPNIT AND TD.CODDOC = D.CODDOC
    INNER JOIN CONFIG_TIPODOCUMENTOS CT
        ON CT.TIPODOC = TD.TIPODOC
    WHERE ISNULL(D.STATUS, '') <> 'A'
      AND CT.INV IN (1, -1)
      AND ISNULL(DP.CODPROD, '') <> ''
    GROUP BY D.EMPNIT, DP.CODPROD
)
UPDATE S
SET S.EXISTENCIA = C.EXISTENCIA,
    S.LASTUPDATE = GETDATE()
FROM dbo.INV_STOCK S
INNER JOIN calc C ON C.EMPNIT = S.EMPNIT AND C.CODPROD = S.CODPROD;

-- Productos que aparecen en movimientos pero ya no están en PRODUCTOS
INSERT INTO dbo.INV_STOCK (EMPNIT, CODPROD, EXISTENCIA, LASTUPDATE)
SELECT C.EMPNIT, C.CODPROD, C.EXISTENCIA, GETDATE()
FROM (
    SELECT D.EMPNIT,
           DP.CODPROD,
           SUM(ISNULL(DP.TOTALUNIDADES, 0) * CAST(ISNULL(CT.INV, 0) AS DECIMAL(18, 4))) AS EXISTENCIA
    FROM DOCPRODUCTOS DP
    INNER JOIN DOCUMENTOS D
        ON D.EMPNIT = DP.EMPNIT AND D.CODDOC = DP.CODDOC AND D.CORRELATIVO = DP.CORRELATIVO
    INNER JOIN TIPODOCUMENTOS TD
        ON TD.EMPNIT = D.EMPNIT AND TD.CODDOC = D.CODDOC
    INNER JOIN CONFIG_TIPODOCUMENTOS CT
        ON CT.TIPODOC = TD.TIPODOC
    WHERE ISNULL(D.STATUS, '') <> 'A'
      AND CT.INV IN (1, -1)
      AND ISNULL(DP.CODPROD, '') <> ''
    GROUP BY D.EMPNIT, DP.CODPROD
) C
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.INV_STOCK S
    WHERE S.EMPNIT = C.EMPNIT AND S.CODPROD = C.CODPROD
);

SELECT COUNT(*) AS TOTAL_ROWS,
       ISNULL(SUM(EXISTENCIA), 0) AS SUMA_EXISTENCIA
FROM dbo.INV_STOCK;
`;

async function ensureSchema(token) {
    return withPool(token, async (pool) => {
        await exec(pool, DDL_TABLE);
        await recreateTriggers(pool);
        return { ok: true };
    });
}

async function recreateTriggers(pool) {
    await exec(pool, DROP_TRG_DOCPRODUCTOS);
    await exec(pool, DROP_TRG_DOCUMENTOS);
    await exec(pool, DROP_TRG_PRODUCTOS_INS);
    await exec(pool, DROP_TRG_PRODUCTOS_DEL);
    await exec(pool, CREATE_TRG_DOCPRODUCTOS);
    await exec(pool, CREATE_TRG_DOCUMENTOS);
    await exec(pool, CREATE_TRG_PRODUCTOS_INS);
    await exec(pool, CREATE_TRG_PRODUCTOS_DEL);
}

async function rebuildFromDocumentos(token) {
    return withPool(token, async (pool) => {
        await exec(pool, DDL_TABLE);

        // Quitar triggers para no interferir con el recálculo masivo
        await exec(pool, DROP_TRG_DOCPRODUCTOS);
        await exec(pool, DROP_TRG_DOCUMENTOS);

        let row = {};
        try {
            const result = await exec(pool, QRY_REBUILD);
            const recordsets = result.recordsets || [];
            const lastRs = recordsets.length
                ? recordsets[recordsets.length - 1]
                : (result.recordset || []);
            row = lastRs[0] || {};
        } finally {
            // Siempre restaurar triggers (aunque el rebuild falle)
            try {
                await recreateTriggers(pool);
            } catch (trgErr) {
                console.error('[stock2_rebuild] no se pudieron recrear triggers:', trgErr.message || trgErr);
            }
        }

        return {
            ok: true,
            filas: Number(row.TOTAL_ROWS) || 0,
            suma_existencia: Number(row.SUMA_EXISTENCIA) || 0,
            proceso: 'STOCK2',
            mensaje: 'INV_STOCK recalculado desde movimientos de documentos (STATUS<>A, INV IN 1/-1)',
        };
    });
}

module.exports = {
    ensureSchema,
    rebuildFromDocumentos,
    PROCESO: 'STOCK2',
};
