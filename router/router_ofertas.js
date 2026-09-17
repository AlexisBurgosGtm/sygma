'use strict';

const express = require('express');
const router = express.Router();
const execute = require('../connection');

let tablesReady = false;

function sqlEsc(v) {
    return String(v == null ? '' : v).replace(/'/g, "''");
}

function sqlDec(v) {
    const n = Number(String(v == null ? '0' : v).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
}

function sqlDateOrNull(v) {
    const s = String(v || '').trim().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return 'NULL';
    return `'${s}'`;
}

function tipoVigencia(v) {
    return String(v || '').toUpperCase() === 'VENCIMIENTO' ? 'VENCIMIENTO' : 'VIGENTE';
}

const DDL_CREATE = `
IF OBJECT_ID('dbo.OFERTAS', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.OFERTAS (
        CODOFERTA INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OFERTAS PRIMARY KEY,
        DESOFERTA VARCHAR(200) NOT NULL,
        UNIDADES DECIMAL(18,4) NOT NULL CONSTRAINT DF_OFERTAS_UNIDADES DEFAULT (0),
        CANTIDAD_BONIF DECIMAL(18,4) NOT NULL CONSTRAINT DF_OFERTAS_CANTIDAD_BONIF DEFAULT (0),
        TIPO_VIGENCIA VARCHAR(20) NOT NULL CONSTRAINT DF_OFERTAS_TIPO DEFAULT ('VIGENTE'),
        FECHA_DEL DATE NULL,
        FECHA_AL DATE NULL,
        LASTUPDATE DATETIME NOT NULL CONSTRAINT DF_OFERTAS_LU DEFAULT (GETDATE())
    );
END
`;

const DDL_CANTIDAD_BONIF = `
IF COL_LENGTH('dbo.OFERTAS', 'CANTIDAD_BONIF') IS NULL
BEGIN
    EXEC('ALTER TABLE dbo.OFERTAS ADD CANTIDAD_BONIF DECIMAL(18,4) NOT NULL CONSTRAINT DF_OFERTAS_CANTIDAD_BONIF DEFAULT (0)');
END
`;

const DDL_DROP_BONIF = `
IF OBJECT_ID('dbo.OFERTAS_BONIF', 'U') IS NOT NULL
BEGIN
    EXEC('DROP TABLE dbo.OFERTAS_BONIF');
END
`;

const DDL_CREATE_PRODUCTOS = `
IF OBJECT_ID('dbo.OFERTAS_PRODUCTOS', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.OFERTAS_PRODUCTOS (
        ID INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OFERTAS_PRODUCTOS PRIMARY KEY,
        CODOFERTA INT NOT NULL,
        CODPROD VARCHAR(100) NOT NULL
    );
    CREATE NONCLUSTERED INDEX IX_OFERTAS_PRODUCTOS_OFERTA ON dbo.OFERTAS_PRODUCTOS (CODOFERTA);
END
`;

const DDL_PRODUCTOS_TIPO = `
IF COL_LENGTH('dbo.OFERTAS_PRODUCTOS', 'TIPO') IS NULL
BEGIN
    EXEC('ALTER TABLE dbo.OFERTAS_PRODUCTOS ADD TIPO VARCHAR(10) NOT NULL CONSTRAINT DF_OFERTAS_PRODUCTOS_TIPO DEFAULT (''PROD'')');
END
`;

const DDL_CREATE_SEDES = `
IF OBJECT_ID('dbo.OFERTAS_SEDES', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.OFERTAS_SEDES (
        CODOFERTA INT NOT NULL,
        EMPNIT VARCHAR(50) NOT NULL,
        CONSTRAINT PK_OFERTAS_SEDES PRIMARY KEY (CODOFERTA, EMPNIT)
    );
    CREATE NONCLUSTERED INDEX IX_OFERTAS_SEDES_EMP ON dbo.OFERTAS_SEDES (EMPNIT);
END
`;

function parseSedes(sedes) {
    const src = Array.isArray(sedes)
        ? sedes
        : String(sedes == null ? '' : sedes).split(',');
    const seen = {};
    const out = [];
    src.forEach((v) => {
        const emp = String(v == null ? '' : v).trim();
        if (!emp || seen[emp]) return;
        seen[emp] = true;
        out.push(emp);
    });
    return out;
}

async function replaceSedes(token, codoferta, sedes) {
    const id = Number(codoferta) || 0;
    if (!id) return;
    const list = parseSedes(sedes);
    await execute.get_data_qry(`DELETE FROM OFERTAS_SEDES WHERE CODOFERTA=${id}`, token);
    if (!list.length) return;
    const values = list.map((emp) => `(${id}, '${sqlEsc(emp)}')`).join(',');
    await execute.get_data_qry(`INSERT INTO OFERTAS_SEDES (CODOFERTA, EMPNIT) VALUES ${values}`, token);
}

function tipoProductoOferta(v) {
    return String(v || '').toUpperCase() === 'BONI' ? 'BONI' : 'PROD';
}

async function ensureTables(token) {
    if (tablesReady) return;
    await execute.get_data_qry(DDL_CREATE, token);
    await execute.get_data_qry(DDL_CANTIDAD_BONIF, token);
    await execute.get_data_qry(DDL_DROP_BONIF, token);
    await execute.get_data_qry(DDL_CREATE_PRODUCTOS, token);
    await execute.get_data_qry(DDL_PRODUCTOS_TIPO, token);
    await execute.get_data_qry(DDL_CREATE_SEDES, token);
    tablesReady = true;
}

router.post('/ensure', async (req, res) => {
    const { token } = req.body || {};
    try {
        await ensureTables(token);
        res.send({ ok: true });
    } catch (e) {
        console.error('[ofertas/ensure]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudieron crear las tablas de ofertas' });
    }
});

router.post('/listado', async (req, res) => {
    const { token } = req.body || {};
    try {
        await ensureTables(token);
        const qry = `
            SELECT
                O.CODOFERTA,
                O.DESOFERTA,
                O.UNIDADES,
                O.CANTIDAD_BONIF,
                O.TIPO_VIGENCIA,
                CONVERT(varchar(10), O.FECHA_DEL, 23) AS FECHA_DEL,
                CONVERT(varchar(10), O.FECHA_AL, 23) AS FECHA_AL,
                (SELECT COUNT(*) FROM OFERTAS_PRODUCTOS P WHERE P.CODOFERTA = O.CODOFERTA AND UPPER(ISNULL(NULLIF(LTRIM(RTRIM(P.TIPO)), ''), 'PROD')) = 'PROD') AS NPROD,
                (SELECT COUNT(*) FROM OFERTAS_PRODUCTOS P WHERE P.CODOFERTA = O.CODOFERTA AND UPPER(ISNULL(P.TIPO, '')) = 'BONI') AS NBONI,
                (SELECT COUNT(*) FROM OFERTAS_SEDES S WHERE S.CODOFERTA = O.CODOFERTA) AS NSEDES,
                ISNULL((
                    SELECT STUFF((
                        SELECT ', ' + ISNULL(E.NOMBRE, S.EMPNIT)
                        FROM OFERTAS_SEDES S
                        LEFT JOIN EMPRESAS E ON E.EMPNIT = S.EMPNIT
                        WHERE S.CODOFERTA = O.CODOFERTA
                        ORDER BY ISNULL(E.NOMBRE, S.EMPNIT)
                        FOR XML PATH(''), TYPE
                    ).value('.', 'nvarchar(max)'), 1, 2, '')
                ), '') AS SEDES
            FROM OFERTAS O
            ORDER BY O.CODOFERTA DESC
        `;
        const data = await execute.get_data_qry(qry, token);
        res.send({
            ok: true,
            recordset: (data && data.recordset) ? data.recordset : [],
            rowsAffected: (data && data.rowsAffected) ? data.rowsAffected : [0]
        });
    } catch (e) {
        console.error('[ofertas/listado]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo cargar el listado de ofertas' });
    }
});

router.post('/combo', async (req, res) => {
    const { token } = req.body || {};
    try {
        await ensureTables(token);
        const qry = `
            SELECT
                O.CODOFERTA,
                O.DESOFERTA,
                O.UNIDADES,
                O.TIPO_VIGENCIA,
                CONVERT(varchar(10), O.FECHA_DEL, 23) AS FECHA_DEL,
                CONVERT(varchar(10), O.FECHA_AL, 23) AS FECHA_AL
            FROM OFERTAS O
            ORDER BY O.DESOFERTA
        `;
        const data = await execute.get_data_qry(qry, token);
        res.send({
            ok: true,
            recordset: (data && data.recordset) ? data.recordset : [],
            rowsAffected: (data && data.rowsAffected) ? data.rowsAffected : [0]
        });
    } catch (e) {
        console.error('[ofertas/combo]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo cargar el combo de ofertas' });
    }
});

router.post('/get', async (req, res) => {
    const { token, codoferta } = req.body || {};
    const id = Number(codoferta) || 0;
    if (!id) {
        res.send({ ok: false, error: 'Código de oferta inválido' });
        return;
    }
    try {
        await ensureTables(token);
        const data = await execute.get_data_qry(`
            SELECT
                CODOFERTA, DESOFERTA, UNIDADES, CANTIDAD_BONIF, TIPO_VIGENCIA,
                CONVERT(varchar(10), FECHA_DEL, 23) AS FECHA_DEL,
                CONVERT(varchar(10), FECHA_AL, 23) AS FECHA_AL
            FROM OFERTAS
            WHERE CODOFERTA=${id}
        `, token);
        const row = (data && data.recordset && data.recordset[0]) ? data.recordset[0] : null;
        if (!row) {
            res.send({ ok: false, error: 'Oferta no encontrada' });
            return;
        }
        const sedesData = await execute.get_data_qry(`
            SELECT S.EMPNIT, ISNULL(E.NOMBRE, S.EMPNIT) AS NOMBRE
            FROM OFERTAS_SEDES S
            LEFT JOIN EMPRESAS E ON E.EMPNIT = S.EMPNIT
            WHERE S.CODOFERTA=${id}
            ORDER BY ISNULL(E.NOMBRE, S.EMPNIT)
        `, token);
        row.SEDES = (sedesData && sedesData.recordset) ? sedesData.recordset : [];
        res.send({
            ok: true,
            recordset: [row]
        });
    } catch (e) {
        console.error('[ofertas/get]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo leer la oferta' });
    }
});

router.post('/insert', async (req, res) => {
    const { token, desoferta, unidades, cantidad_bonif, tipo_vigencia, fecha_del, fecha_al, sedes } = req.body || {};
    const nombre = String(desoferta || '').trim();
    if (!nombre) {
        res.send({ ok: false, error: 'Escriba el nombre de la oferta' });
        return;
    }
    const listaSedes = parseSedes(sedes);
    if (!listaSedes.length) {
        res.send({ ok: false, error: 'Seleccione al menos una sede' });
        return;
    }
    const tipo = tipoVigencia(tipo_vigencia);
    const del = tipo === 'VENCIMIENTO' ? sqlDateOrNull(fecha_del) : 'NULL';
    const al = tipo === 'VENCIMIENTO' ? sqlDateOrNull(fecha_al) : 'NULL';
    if (tipo === 'VENCIMIENTO' && (del === 'NULL' || al === 'NULL')) {
        res.send({ ok: false, error: 'Indique las fechas Del y Al' });
        return;
    }
    try {
        await ensureTables(token);
        const ins = await execute.get_data_qry(`
            INSERT INTO OFERTAS (DESOFERTA, UNIDADES, CANTIDAD_BONIF, TIPO_VIGENCIA, FECHA_DEL, FECHA_AL, LASTUPDATE)
            OUTPUT INSERTED.CODOFERTA
            VALUES ('${sqlEsc(nombre)}', ${sqlDec(unidades)}, ${sqlDec(cantidad_bonif)}, '${tipo}', ${del}, ${al}, GETDATE());
        `, token);
        const id = Number(ins && ins.recordset && ins.recordset[0] && ins.recordset[0].CODOFERTA) || 0;
        if (!id) {
            res.send({ ok: false, error: 'No se pudo crear la oferta' });
            return;
        }
        await replaceSedes(token, id, listaSedes);
        res.send({ ok: true, recordset: [{ CODOFERTA: id }], rowsAffected: [1] });
    } catch (e) {
        console.error('[ofertas/insert]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo guardar la oferta' });
    }
});

router.post('/update', async (req, res) => {
    const { token, codoferta, desoferta, unidades, cantidad_bonif, tipo_vigencia, fecha_del, fecha_al, sedes } = req.body || {};
    const id = Number(codoferta) || 0;
    const nombre = String(desoferta || '').trim();
    if (!id) {
        res.send({ ok: false, error: 'Código de oferta inválido' });
        return;
    }
    if (!nombre) {
        res.send({ ok: false, error: 'Escriba el nombre de la oferta' });
        return;
    }
    const listaSedes = parseSedes(sedes);
    if (!listaSedes.length) {
        res.send({ ok: false, error: 'Seleccione al menos una sede' });
        return;
    }
    const tipo = tipoVigencia(tipo_vigencia);
    const del = tipo === 'VENCIMIENTO' ? sqlDateOrNull(fecha_del) : 'NULL';
    const al = tipo === 'VENCIMIENTO' ? sqlDateOrNull(fecha_al) : 'NULL';
    if (tipo === 'VENCIMIENTO' && (del === 'NULL' || al === 'NULL')) {
        res.send({ ok: false, error: 'Indique las fechas Del y Al' });
        return;
    }
    try {
        await ensureTables(token);
        await execute.get_data_qry(`
            UPDATE OFERTAS SET
                DESOFERTA='${sqlEsc(nombre)}',
                UNIDADES=${sqlDec(unidades)},
                CANTIDAD_BONIF=${sqlDec(cantidad_bonif)},
                TIPO_VIGENCIA='${tipo}',
                FECHA_DEL=${del},
                FECHA_AL=${al},
                LASTUPDATE=GETDATE()
            WHERE CODOFERTA=${id};
        `, token);
        await replaceSedes(token, id, listaSedes);
        res.send({ ok: true, recordset: [{ CODOFERTA: id }], rowsAffected: [1] });
    } catch (e) {
        console.error('[ofertas/update]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo actualizar la oferta' });
    }
});

router.post('/delete', async (req, res) => {
    const { token, codoferta } = req.body || {};
    const id = Number(codoferta) || 0;
    if (!id) {
        res.send({ ok: false, error: 'Código de oferta inválido' });
        return;
    }
    try {
        await ensureTables(token);
        await execute.get_data_qry(`
            IF OBJECT_ID('dbo.OFERTAS_PRODUCTOS', 'U') IS NOT NULL
                DELETE FROM OFERTAS_PRODUCTOS WHERE CODOFERTA=${id};
            IF OBJECT_ID('dbo.OFERTAS_SEDES', 'U') IS NOT NULL
                DELETE FROM OFERTAS_SEDES WHERE CODOFERTA=${id};
            IF OBJECT_ID('dbo.OFERTAS_BONIF', 'U') IS NOT NULL
                DELETE FROM OFERTAS_BONIF WHERE CODOFERTA=${id};
            DELETE FROM OFERTAS WHERE CODOFERTA=${id};
        `, token);
        res.send({ ok: true, rowsAffected: [1] });
    } catch (e) {
        console.error('[ofertas/delete]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo eliminar la oferta' });
    }
});

router.post('/buscar_producto', async (req, res) => {
    const { token, filtro } = req.body || {};
    const f = sqlEsc(String(filtro || '').trim());
    if (!f) {
        res.send({ ok: true, recordset: [] });
        return;
    }
    try {
        const data = await execute.get_data_qry(`
            SELECT TOP (40)
                PRODUCTOS.CODPROD,
                PRODUCTOS.DESPROD,
                ISNULL(MARCAS.DESMARCA,'') AS DESMARCA
            FROM PRODUCTOS
            LEFT JOIN MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA
            WHERE PRODUCTOS.HABILITADO='SI'
              AND (
                    PRODUCTOS.CODPROD LIKE '%${f}%'
                    OR ISNULL(PRODUCTOS.CODPROD2,'') LIKE '%${f}%'
                    OR PRODUCTOS.DESPROD LIKE '%${f}%'
              )
            ORDER BY PRODUCTOS.DESPROD
        `, token);
        res.send({
            ok: true,
            recordset: (data && data.recordset) ? data.recordset : []
        });
    } catch (e) {
        console.error('[ofertas/buscar_producto]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo buscar productos' });
    }
});

router.post('/productos', async (req, res) => {
    const { token, codoferta } = req.body || {};
    const id = Number(codoferta) || 0;
    if (!id) {
        res.send({ ok: false, error: 'Seleccione una oferta' });
        return;
    }
    try {
        await ensureTables(token);
        const data = await execute.get_data_qry(`
            SELECT
                OP.ID,
                OP.CODOFERTA,
                OP.CODPROD,
                UPPER(ISNULL(NULLIF(LTRIM(RTRIM(OP.TIPO)), ''), 'PROD')) AS TIPO,
                ISNULL(P.DESPROD,'') AS DESPROD,
                ISNULL(M.DESMARCA,'') AS DESMARCA
            FROM OFERTAS_PRODUCTOS OP
            LEFT JOIN PRODUCTOS P ON P.CODPROD = OP.CODPROD
            LEFT JOIN MARCAS M ON P.CODMARCA = M.CODMARCA
            WHERE OP.CODOFERTA=${id}
            ORDER BY CASE WHEN UPPER(ISNULL(OP.TIPO,'')) = 'BONI' THEN 2 ELSE 1 END, P.DESPROD
        `, token);
        res.send({
            ok: true,
            recordset: (data && data.recordset) ? data.recordset : [],
            rowsAffected: (data && data.rowsAffected) ? data.rowsAffected : [0]
        });
    } catch (e) {
        console.error('[ofertas/productos]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudieron cargar los productos de la oferta' });
    }
});

router.post('/producto_insert', async (req, res) => {
    const { token, codoferta, codprod, tipo } = req.body || {};
    const id = Number(codoferta) || 0;
    const prod = String(codprod || '').trim();
    const tipoProd = tipoProductoOferta(tipo);
    if (!id) {
        res.send({ ok: false, error: 'Seleccione una oferta' });
        return;
    }
    if (!prod) {
        res.send({ ok: false, error: 'Escriba un código de producto' });
        return;
    }
    try {
        await ensureTables(token);
        const exists = await execute.get_data_qry(`
            SELECT TOP 1 CODPROD FROM PRODUCTOS WHERE CODPROD='${sqlEsc(prod)}'
        `, token);
        if (!(exists && exists.recordset && exists.recordset[0])) {
            res.send({ ok: false, error: 'No se encontró el producto' });
            return;
        }
        const realCod = String(exists.recordset[0].CODPROD);
        const dup = await execute.get_data_qry(`
            SELECT TOP 1 ID
            FROM OFERTAS_PRODUCTOS
            WHERE CODOFERTA=${id}
              AND CODPROD='${sqlEsc(realCod)}'
              AND UPPER(ISNULL(NULLIF(LTRIM(RTRIM(TIPO)), ''), 'PROD')) = '${tipoProd}'
        `, token);
        if (dup && dup.recordset && dup.recordset[0]) {
            res.send({ ok: false, error: tipoProd === 'BONI' ? 'Este producto ya está en BONI' : 'Este producto ya está en venta' });
            return;
        }
        await execute.get_data_qry(`
            INSERT INTO OFERTAS_PRODUCTOS (CODOFERTA, CODPROD, TIPO)
            VALUES (${id}, '${sqlEsc(realCod)}', '${tipoProd}');
        `, token);
        res.send({ ok: true, rowsAffected: [1] });
    } catch (e) {
        console.error('[ofertas/producto_insert]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo agregar el producto' });
    }
});

router.post('/producto_delete', async (req, res) => {
    const { token, id } = req.body || {};
    const rowId = Number(id) || 0;
    if (!rowId) {
        res.send({ ok: false, error: 'Registro inválido' });
        return;
    }
    try {
        await ensureTables(token);
        await execute.get_data_qry(`DELETE FROM OFERTAS_PRODUCTOS WHERE ID=${rowId}`, token);
        res.send({ ok: true, rowsAffected: [1] });
    } catch (e) {
        console.error('[ofertas/producto_delete]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo quitar el producto' });
    }
});

router.post('/vendedor_disponibles', async (req, res) => {
    const { token, sucursal } = req.body || {};
    const emp = sqlEsc(String(sucursal || '').trim());
    try {
        await ensureTables(token);
        const data = await execute.get_data_qry(`
            SELECT
                O.CODOFERTA,
                O.DESOFERTA,
                O.UNIDADES,
                O.CANTIDAD_BONIF,
                O.TIPO_VIGENCIA,
                CONVERT(varchar(10), O.FECHA_DEL, 23) AS FECHA_DEL,
                CONVERT(varchar(10), O.FECHA_AL, 23) AS FECHA_AL,
                OP.CODPROD,
                UPPER(ISNULL(NULLIF(LTRIM(RTRIM(OP.TIPO)), ''), 'PROD')) AS TIPO,
                ISNULL(P.DESPROD, '') AS DESPROD,
                ISNULL(P.TIPOPROD, 'B') AS TIPOPROD,
                ISNULL(P.EXENTO, 0) AS EXENTO,
                CASE WHEN PR.CODMEDIDA IS NULL THEN 0 ELSE 1 END AS TIENE_BONI,
                ISNULL(PR.EQUIVALE, 1) AS EQUIVALE,
                ISNULL(PR.COSTO, 0) AS COSTO,
                ISNULL(PR.PRECIO, 0) AS PRECIO,
                ISNULL(PR.PRECIO_A, 0) AS PRECIO_A,
                ISNULL(PR.PRECIO_B, 0) AS PRECIO_B,
                ISNULL(PR.BONO_PRECIO, 0) AS BONO,
                ISNULL(INV.TOTALUNIDADES, 0) AS EXISTENCIA
            FROM OFERTAS O
            INNER JOIN OFERTAS_PRODUCTOS OP ON OP.CODOFERTA = O.CODOFERTA
            LEFT JOIN PRODUCTOS P ON P.CODPROD = OP.CODPROD
            LEFT JOIN PRECIOS PR ON PR.CODPROD = OP.CODPROD
                AND UPPER(LTRIM(RTRIM(PR.CODMEDIDA))) = 'BONI'
            LEFT JOIN view_invsaldo INV ON INV.CODPROD = OP.CODPROD
                AND INV.EMPNIT = '${emp}'
            WHERE
                (
                    UPPER(ISNULL(O.TIPO_VIGENCIA, 'VIGENTE')) <> 'VENCIMIENTO'
                    OR (
                        O.FECHA_DEL IS NOT NULL
                        AND O.FECHA_AL IS NOT NULL
                        AND CAST(GETDATE() AS DATE) BETWEEN O.FECHA_DEL AND O.FECHA_AL
                    )
                )
                AND (
                    NOT EXISTS (SELECT 1 FROM OFERTAS_SEDES S WHERE S.CODOFERTA = O.CODOFERTA)
                    OR EXISTS (
                        SELECT 1 FROM OFERTAS_SEDES S
                        WHERE S.CODOFERTA = O.CODOFERTA
                          AND S.EMPNIT = '${emp}'
                    )
                )
            ORDER BY O.CODOFERTA, P.DESPROD
        `, token);
        res.send({
            ok: true,
            recordset: (data && data.recordset) ? data.recordset : [],
            rowsAffected: (data && data.rowsAffected) ? data.rowsAffected : [0]
        });
    } catch (e) {
        console.error('[ofertas/vendedor_disponibles]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudieron cargar las ofertas disponibles' });
    }
});

module.exports = router;
