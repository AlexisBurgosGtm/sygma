/**
 * Diagnóstico de latencia post-login digitador.
 * No imprime credenciales ni datos sensibles.
 */
try { process.loadEnvFile(); } catch (e) { /* ignore */ }

const sql = require('mssql');

function cfg() {
    return {
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        server: process.env.DB_HOST,
        database: process.env.DB_DB,
        pool: { max: 5, min: 0, idleTimeoutMillis: 30000 },
        options: { encrypt: false, trustServerCertificate: true, requestTimeout: 120000 }
    };
}

async function timeQuery(pool, label, qry) {
    const t0 = Date.now();
    try {
        const r = await pool.request().query(qry);
        const rows = r.recordset ? r.recordset.length : 0;
        const affected = (r.rowsAffected && r.rowsAffected[0]) || rows;
        console.log(`${String(Date.now() - t0).padStart(6)} ms | ${String(rows).padStart(7)} rows | ${label}`);
        return { ms: Date.now() - t0, rows, ok: true };
    } catch (err) {
        console.log(`${String(Date.now() - t0).padStart(6)} ms | ERROR | ${label} :: ${err.message}`);
        return { ms: Date.now() - t0, rows: 0, ok: false, err: err.message };
    }
}

(async () => {
    const config = cfg();
    if (!config.server || !config.database) {
        console.error('Faltan DB_HOST/DB_DB en el entorno');
        process.exit(1);
    }
    console.log(`DB ${config.server} / ${config.database}`);
    console.log('--- Conexión (nuevo pool, como QueryToken) ---');
    const tConn = Date.now();
    const pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log(`${String(Date.now() - tConn).padStart(6)} ms | connect`);

    const mes = new Date().getMonth() + 1;
    const anio = new Date().getFullYear();

    const emp = await pool.request().query(`
        SELECT TOP 1 EMPLEADOS.EMPNIT
        FROM EMPLEADOS
        WHERE CODPUESTO = 5 AND ACTIVO = 'SI'
        ORDER BY CODEMPLEADO
    `);
    const sucursal = emp.recordset[0] ? emp.recordset[0].EMPNIT : null;
    console.log(`Digitador sucursal de prueba: ${sucursal ? '[ok]' : '[ninguna]'}`);

    console.log('--- Consultas del login (bloquean Navegar.inicio) ---');
    await timeQuery(pool, 'LOGIN empleados+empresas (sin filtro clave, TOP 1)', `
        SELECT TOP 1 EMPLEADOS.EMPNIT, EMPLEADOS.CODEMPLEADO, EMPLEADOS.CODPUESTO, EMPRESAS.NOMBRE
        FROM EMPLEADOS LEFT OUTER JOIN EMPRESAS ON EMPLEADOS.EMPNIT = EMPRESAS.EMPNIT
        WHERE EMPLEADOS.CODPUESTO = 5
    `);
    await timeQuery(pool, 'data_empresa_config (EMPRESAS WHERE EMPNIT)', sucursal ? `
        SELECT EMPNIT, NOMBRE, DIRECCION, TIPO_PRECIO, CODTIPOEMPRESA, DISTRITO,
            OBJETIVO_VENTAS, OBJETIVO_RENTABILIDAD, ISNULL(OBJETIVO_SKUS, 0) AS OBJETIVO_SKUS
        FROM EMPRESAS WHERE EMPNIT='${String(sucursal).replace(/'/g, "''")}'
    ` : 'SELECT 1');
    await timeQuery(pool, 'get_data_empresas / SKUs (SELECT EMPRESAS completo)', `
        SELECT EMPNIT,NOMBRE,CODTIPOEMPRESA,TIPO_PRECIO,OBJETIVO_VENTAS,OBJETIVO_RENTABILIDAD,
            ISNULL(OBJETIVO_SKUS, 0) AS OBJETIVO_SKUS
        FROM EMPRESAS
    `);

    console.log('--- Conteo tablas / vista ---');
    await timeQuery(pool, 'COUNT EMPRESAS', `SELECT COUNT(*) AS N FROM EMPRESAS`);
    await timeQuery(pool, 'COUNT PRODUCTOS', `SELECT COUNT(*) AS N FROM PRODUCTOS`);
    await timeQuery(pool, 'COUNT view_invsaldo', `SELECT COUNT(*) AS N FROM view_invsaldo`);
    if (sucursal) {
        const s = String(sucursal).replace(/'/g, "''");
        await timeQuery(pool, 'COUNT view_invsaldo sucursal digitador', `SELECT COUNT(*) AS N FROM view_invsaldo WHERE EMPNIT='${s}'`);
    }

    console.log('--- Consultas que dispara inicio_digitador al montar (addListeners) ---');
    if (sucursal) {
        const s = String(sucursal).replace(/'/g, "''");
        await timeQuery(pool, 'inventario general dashboard (view_invsaldo + productos + marcas)', `
        SELECT view_invsaldo.CODPROD, view_invsaldo.CODPROD2, view_invsaldo.DESPROD3,
                view_invsaldo.DESPROD, view_invsaldo.TOTALUNIDADES, view_invsaldo.TOTALCOSTO,
                view_invsaldo.MINIMO, view_invsaldo.MAXIMO, view_invsaldo.EXISTENCIA,
                view_invsaldo.HABILITADO, view_invsaldo.COSTO_ULTIMO,
                PRODUCTOS.COSTO_ULTIMO AS COSTO, view_invsaldo.COSTO_ANTERIOR, view_invsaldo.COSTO_PROMEDIO,
                PRODUCTOS.CODMARCA, MARCAS.DESMARCA, PRODUCTOS.UXC, ISNULL(view_invsaldo.SELLOUT,0) AS SELLOUT
        FROM PRODUCTOS RIGHT OUTER JOIN view_invsaldo ON PRODUCTOS.CODPROD = view_invsaldo.CODPROD
        LEFT OUTER JOIN MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA
        WHERE (view_invsaldo.EMPNIT = '${s}') AND (view_invsaldo.HABILITADO='SI')
        ORDER BY view_invsaldo.CODPROD
        `);
        await timeQuery(pool, 'surtido/relleno (se llama aunque no se ve el panel)', `
        SELECT view_invsaldo.EMPNIT, view_invsaldo.CODPROD, PRODUCTOS.DESPROD, PRODUCTOS.TIPOPROD,
            view_invsaldo.MINIMO, view_invsaldo.MAXIMO, view_invsaldo.EXISTENCIA, MARCAS.DESMARCA,
            (view_invsaldo.MAXIMO - view_invsaldo.EXISTENCIA) AS RELLENO
        FROM view_invsaldo
        LEFT OUTER JOIN PRODUCTOS ON view_invsaldo.CODPROD = PRODUCTOS.CODPROD
        LEFT OUTER JOIN MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA
        WHERE (view_invsaldo.EMPNIT = '${s}') AND (PRODUCTOS.TIPOPROD = 'B')
            AND (view_invsaldo.HABILITADO='SI') AND (view_invsaldo.EXISTENCIA<=view_invsaldo.MINIMO)
        `);
        await timeQuery(pool, 'embarques activos (modal pedidos, al iniciar)', `
        SELECT EMBARQUES.ID, EMBARQUES.FECHA, EMBARQUES.CODEMBARQUE
        FROM EMBARQUES
        LEFT OUTER JOIN EMPLEADOS ON EMBARQUES.EMPNIT = EMPLEADOS.EMPNIT AND EMBARQUES.CODEMPLEADO = EMPLEADOS.CODEMPLEADO
        WHERE (EMBARQUES.FINALIZADO = 'NO') AND (EMBARQUES.EMPNIT = '${s}')
        `);
        await timeQuery(pool, `dashboard ventas vendedor mes=${mes} anio=${anio}`, `
        SELECT E.CODEMPLEADO AS CODEMP, E.NOMEMPLEADO AS EMPLEADO, E.TELEFONO,
            COUNT(D.CODDOC) AS CONTEO, SUM(D.TOTALPRECIO) AS TOTALPRECIO
        FROM DOCUMENTOS D
        INNER JOIN TIPODOCUMENTOS TD ON D.CODDOC = TD.CODDOC AND D.EMPNIT = TD.EMPNIT
        INNER JOIN EMPLEADOS E ON D.CODEMP = E.CODEMPLEADO AND D.EMPNIT = E.EMPNIT
        WHERE D.EMPNIT LIKE '${s}' AND D.MES = ${mes} AND D.ANIO = ${anio}
            AND D.STATUS <> 'A' AND TD.TIPODOC IN ('FAC','FEF','FEC','FCP','FES','FPC')
        GROUP BY E.CODEMPLEADO, E.NOMEMPLEADO, E.TELEFONO
        ORDER BY TOTALPRECIO DESC
        `);
        await timeQuery(pool, `dashboard ventas marca mes=${mes} anio=${anio}`, `
        SELECT PRODUCTOS.CODMARCA, ISNULL(MARCAS.DESMARCA,'') AS DESMARCA,
            SUM(ISNULL(DOCPRODUCTOS.TOTALUNIDADES,0)) AS TOTALUNIDADES,
            SUM(ISNULL(DOCPRODUCTOS.TOTALCOSTO,0)) AS TOTALCOSTO,
            SUM(ISNULL(DOCPRODUCTOS.TOTALPRECIO,0)) AS TOTALPRECIO
        FROM DOCUMENTOS
        LEFT OUTER JOIN TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
        LEFT OUTER JOIN DOCPRODUCTOS ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO AND DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT
        LEFT OUTER JOIN PRODUCTOS LEFT OUTER JOIN MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA ON DOCPRODUCTOS.CODPROD = PRODUCTOS.CODPROD
        WHERE (DOCUMENTOS.EMPNIT LIKE '${s}') AND (DOCUMENTOS.MES = ${mes}) AND (DOCUMENTOS.ANIO = ${anio})
            AND (DOCUMENTOS.STATUS <> 'A') AND (TIPODOCUMENTOS.TIPODOC IN ('FAC','FEF','FEC','FCP','FES','FPC'))
            AND (MARCAS.DESMARCA IS NOT NULL)
        GROUP BY PRODUCTOS.CODMARCA, MARCAS.DESMARCA
        ORDER BY TOTALPRECIO DESC
        `);
    }

    console.log('--- Costo de abrir 3 pools seguidos (patrón actual QueryToken) ---');
    for (let i = 1; i <= 3; i++) {
        const t0 = Date.now();
        const p = new sql.ConnectionPool(config);
        await p.connect();
        await p.request().query('SELECT 1 AS X');
        await p.close();
        console.log(`${String(Date.now() - t0).padStart(6)} ms | pool ${i} connect+SELECT 1+close`);
    }

    await pool.close();
    console.log('OK');
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
