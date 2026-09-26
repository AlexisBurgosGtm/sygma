'use strict';

const execute = require('../connection');
const express = require('express');
const router = express.Router();

function sqlEsc(v) {
    return String(v == null ? '' : v).replace(/'/g, "''");
}

function sqlInt(v) {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
}

function sqlDec(v) {
    const n = Number(String(v == null ? '0' : v).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
}

function activoOk(v) {
    return String(v || '').trim().toUpperCase() === 'NO' ? 'NO' : 'SI';
}

function parseCodprods(raw) {
    if (!Array.isArray(raw)) return [];
    const out = [];
    const seen = new Set();
    raw.forEach((x) => {
        const c = String(x == null ? '' : x).trim();
        if (!c || seen.has(c)) return;
        seen.add(c);
        out.push(c);
    });
    return out;
}

async function replaceConcursoProductos(idConcurso, codprods, token) {
    const id = sqlInt(idConcurso);
    await execute.get_data_qry(`DELETE FROM CONCURSOS_PRODUCTOS WHERE IDCONCURSO=${id}`, token);
    if (!codprods.length) return;
    const chunkSize = 80;
    for (let i = 0; i < codprods.length; i += chunkSize) {
        const slice = codprods.slice(i, i + chunkSize);
        const values = slice.map((c) => `(${id}, '${sqlEsc(c)}')`).join(',');
        await execute.get_data_qry(
            `INSERT INTO CONCURSOS_PRODUCTOS (IDCONCURSO, CODPROD) VALUES ${values}`,
            token
        );
    }
}

async function deleteProductosConcurso(idConcurso, token) {
    await execute.get_data_qry(`DELETE FROM CONCURSOS_PRODUCTOS WHERE IDCONCURSO=${sqlInt(idConcurso)}`, token);
}

const RPT_TIPOS_VENTA = `('FAC','FEF','FEC','FCP','FES','FPC')`;

function sqlVentasLineasConcurso(emp, mes, anio, idConcurso, idObjetivo) {
    const empSql = sqlEsc(String(emp || '').trim());
    const m = sqlInt(mes);
    const a = sqlInt(anio);
    const conc = sqlInt(idConcurso);
    const objFilter = idObjetivo ? `AND O.ID = ${sqlInt(idObjetivo)}` : '';
    return `
        SELECT
            O.ID AS ID_OBJETIVO,
            D.CODCLIENTE,
            DP.TOTALPRECIO
        FROM CONCURSOS_OBJETIVOS O
        INNER JOIN CONCURSOS CX ON CX.IDCONCURSO = O.IDCONCURSO
        INNER JOIN CONCURSOS_PRODUCTOS CP ON CP.IDCONCURSO = CX.IDCONCURSO
        INNER JOIN DOCPRODUCTOS DP ON DP.CODPROD = CP.CODPROD AND DP.EMPNIT = CX.EMPNIT
        INNER JOIN DOCUMENTOS D
            ON D.EMPNIT = DP.EMPNIT
            AND D.CODDOC = DP.CODDOC
            AND D.CORRELATIVO = DP.CORRELATIVO
            AND D.CODEMP = O.CODEMP
        INNER JOIN TIPODOCUMENTOS TD ON D.CODDOC = TD.CODDOC AND D.EMPNIT = TD.EMPNIT
        WHERE CX.IDCONCURSO = ${conc}
            AND CX.EMPNIT = '${empSql}'
            AND CX.MES = ${m}
            AND CX.ANIO = ${a}
            AND D.MES = ${m}
            AND D.ANIO = ${a}
            AND D.STATUS <> 'A'
            AND TD.TIPODOC IN ${RPT_TIPOS_VENTA}
            AND D.CODCLIENTE IS NOT NULL
            AND D.CODCLIENTE > 0
            ${objFilter}
    `;
}

function sqlVentasLineasConcursoVendedor(emp, mes, anio, codemp, idConcurso, idObjetivo) {
    const empSql = sqlEsc(String(emp || '').trim());
    const m = sqlInt(mes);
    const a = sqlInt(anio);
    const ven = sqlInt(codemp);
    const concFilter = idConcurso ? `AND CX.IDCONCURSO = ${sqlInt(idConcurso)}` : '';
    const objFilter = idObjetivo ? `AND O.ID = ${sqlInt(idObjetivo)}` : '';
    return `
        SELECT
            O.ID AS ID_OBJETIVO,
            D.CODCLIENTE,
            DP.TOTALPRECIO
        FROM CONCURSOS_OBJETIVOS O
        INNER JOIN CONCURSOS CX ON CX.IDCONCURSO = O.IDCONCURSO
        INNER JOIN CONCURSOS_PRODUCTOS CP ON CP.IDCONCURSO = CX.IDCONCURSO
        INNER JOIN DOCPRODUCTOS DP ON DP.CODPROD = CP.CODPROD AND DP.EMPNIT = CX.EMPNIT
        INNER JOIN DOCUMENTOS D
            ON D.EMPNIT = DP.EMPNIT
            AND D.CODDOC = DP.CODDOC
            AND D.CORRELATIVO = DP.CORRELATIVO
            AND D.CODEMP = O.CODEMP
        INNER JOIN TIPODOCUMENTOS TD ON D.CODDOC = TD.CODDOC AND D.EMPNIT = TD.EMPNIT
        WHERE CX.EMPNIT = '${empSql}'
            AND CX.MES = ${m}
            AND CX.ANIO = ${a}
            AND O.CODEMP = ${ven}
            AND D.MES = ${m}
            AND D.ANIO = ${a}
            AND D.STATUS <> 'A'
            AND TD.TIPODOC IN ${RPT_TIPOS_VENTA}
            AND D.CODCLIENTE IS NOT NULL
            AND D.CODCLIENTE > 0
            ${concFilter}
            ${objFilter}
    `;
}

router.post('/listado', async (req, res) => {
    const { token, sucursal, mes, anio } = req.body || {};
    const emp = sqlEsc(String(sucursal || '').trim());
    const m = sqlInt(mes);
    const a = sqlInt(anio);
    const qry = `
        SELECT
            C.IDCONCURSO,
            C.EMPNIT,
            ISNULL(C.NOMBRE, '') AS NOMBRE,
            C.MES,
            C.ANIO,
            ISNULL(C.ACTIVO, 'NO') AS ACTIVO,
            ISNULL(C.CODMARCA, 0) AS CODMARCA,
            ISNULL(M.DESMARCA, '') AS DESMARCA,
            (SELECT COUNT(*) FROM CONCURSOS_OBJETIVOS O WHERE O.IDCONCURSO = C.IDCONCURSO) AS NOBJ,
            (SELECT COUNT(*) FROM CONCURSOS_PRODUCTOS P WHERE P.IDCONCURSO = C.IDCONCURSO) AS NPROD
        FROM CONCURSOS C
        LEFT JOIN MARCAS M ON M.CODMARCA = C.CODMARCA
        WHERE C.EMPNIT = '${emp}'
          AND C.MES = ${m}
          AND C.ANIO = ${a}
        ORDER BY C.IDCONCURSO DESC
    `;
    execute.QueryToken(res, qry, token);
});

router.post('/concurso_productos', async (req, res) => {
    const { token, idconcurso } = req.body || {};
    const id = sqlInt(idconcurso);
    const qry = `
        SELECT CODPROD
        FROM CONCURSOS_PRODUCTOS
        WHERE IDCONCURSO = ${id}
        ORDER BY CODPROD
    `;
    execute.QueryToken(res, qry, token);
});

router.post('/productos_marca', async (req, res) => {
    const { token, codmarca } = req.body || {};
    const marca = sqlInt(codmarca);
    if (!marca) {
        res.send({ ok: true, recordset: [] });
        return;
    }
    const qry = `
        SELECT CODPROD, ISNULL(DESPROD, '') AS DESPROD
        FROM PRODUCTOS
        WHERE CODMARCA = ${marca}
          AND ISNULL(HABILITADO, 'SI') = 'SI'
        ORDER BY DESPROD, CODPROD
    `;
    execute.QueryToken(res, qry, token);
});

router.post('/insert', async (req, res) => {
    const { token, sucursal, nombre, mes, anio, activo, codmarca, productos } = req.body || {};
    const emp = sqlEsc(String(sucursal || '').trim());
    const nom = sqlEsc(String(nombre || '').trim());
    const marca = sqlInt(codmarca);
    const prods = parseCodprods(productos);
    if (!emp || !nom) {
        res.send({ ok: false, error: 'Indique sucursal y nombre del concurso' });
        return;
    }
    if (!marca) {
        res.send({ ok: false, error: 'Seleccione la marca del concurso' });
        return;
    }
    if (!prods.length) {
        res.send({ ok: false, error: 'Seleccione al menos un producto' });
        return;
    }
    try {
        const ins = await execute.get_data_qry(`
            INSERT INTO CONCURSOS (EMPNIT, NOMBRE, MES, ANIO, ACTIVO, CODMARCA)
            OUTPUT INSERTED.IDCONCURSO
            VALUES ('${emp}', '${nom}', ${sqlInt(mes)}, ${sqlInt(anio)}, '${activoOk(activo)}', ${marca})
        `, token);
        const newId = ins && ins.recordset && ins.recordset[0] && ins.recordset[0].IDCONCURSO;
        if (!newId) {
            res.send({ ok: false, error: 'No se pudo crear el concurso' });
            return;
        }
        await replaceConcursoProductos(newId, prods, token);
        res.send({ ok: true, idconcurso: Number(newId) });
    } catch (e) {
        console.error('[concursos/insert]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo guardar el concurso' });
    }
});

router.post('/update', async (req, res) => {
    const { token, idconcurso, sucursal, nombre, mes, anio, activo, codmarca, productos } = req.body || {};
    const id = sqlInt(idconcurso);
    const nom = sqlEsc(String(nombre || '').trim());
    const marca = sqlInt(codmarca);
    const prods = parseCodprods(productos);
    if (!id || !nom) {
        res.send({ ok: false, error: 'Datos incompletos' });
        return;
    }
    if (!marca) {
        res.send({ ok: false, error: 'Seleccione la marca del concurso' });
        return;
    }
    if (!prods.length) {
        res.send({ ok: false, error: 'Seleccione al menos un producto' });
        return;
    }
    try {
        await execute.get_data_qry(`
            UPDATE CONCURSOS SET
                EMPNIT='${sqlEsc(String(sucursal || '').trim())}',
                NOMBRE='${nom}',
                MES=${sqlInt(mes)},
                ANIO=${sqlInt(anio)},
                ACTIVO='${activoOk(activo)}',
                CODMARCA=${marca}
            WHERE IDCONCURSO=${id}
        `, token);
        await replaceConcursoProductos(id, prods, token);
        res.send({ ok: true });
    } catch (e) {
        console.error('[concursos/update]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo actualizar el concurso' });
    }
});

router.post('/delete', async (req, res) => {
    const { token, idconcurso } = req.body || {};
    const id = sqlInt(idconcurso);
    if (!id) {
        res.send({ ok: false, error: 'Concurso inválido' });
        return;
    }
    try {
        await deleteProductosConcurso(id, token);
        await execute.get_data_qry(`DELETE FROM CONCURSOS_OBJETIVOS WHERE IDCONCURSO=${id}`, token);
        const data = await execute.get_data_qry(`DELETE FROM CONCURSOS WHERE IDCONCURSO=${id}`, token);
        res.send(data);
    } catch (e) {
        console.error('[concursos/delete]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo eliminar el concurso' });
    }
});

router.post('/objetivos', async (req, res) => {
    const { token, idconcurso } = req.body || {};
    const id = sqlInt(idconcurso);
    const qry = `
        SELECT
            O.ID,
            O.IDCONCURSO,
            O.CODEMP,
            ISNULL(E.NOMEMPLEADO, '') AS NOMEMPLEADO,
            ISNULL(O.COBERTURA, 0) AS COBERTURA,
            ISNULL(O.IMPORTE, 0) AS IMPORTE
        FROM CONCURSOS_OBJETIVOS O
        LEFT JOIN CONCURSOS C ON C.IDCONCURSO = O.IDCONCURSO
        LEFT JOIN EMPLEADOS E ON E.CODEMPLEADO = O.CODEMP AND E.EMPNIT = C.EMPNIT
        WHERE O.IDCONCURSO = ${id}
        ORDER BY E.NOMEMPLEADO
    `;
    execute.QueryToken(res, qry, token);
});

router.post('/objetivo_insert', async (req, res) => {
    const { token, idconcurso, codemp, cobertura, importe } = req.body || {};
    const id = sqlInt(idconcurso);
    const emp = sqlInt(codemp);
    if (!id || !emp) {
        res.send({ ok: false, error: 'Seleccione concurso y vendedor' });
        return;
    }
    try {
        const dup = await execute.get_data_qry(`
            SELECT TOP 1 ID FROM CONCURSOS_OBJETIVOS
            WHERE IDCONCURSO=${id} AND CODEMP=${emp}
        `, token);
        if (dup && dup.recordset && dup.recordset[0]) {
            res.send({ ok: false, error: 'Este vendedor ya tiene objetivo en el concurso' });
            return;
        }
        const ins = await execute.get_data_qry(`
            INSERT INTO CONCURSOS_OBJETIVOS (IDCONCURSO, CODEMP, COBERTURA, IMPORTE)
            OUTPUT INSERTED.ID
            VALUES (${id}, ${emp}, ${sqlDec(cobertura)}, ${sqlDec(importe)})
        `, token);
        const newId = ins && ins.recordset && ins.recordset[0] && ins.recordset[0].ID;
        res.send({ ok: true, id: Number(newId) || 0 });
    } catch (e) {
        console.error('[concursos/objetivo_insert]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo guardar el objetivo' });
    }
});

router.post('/objetivo_update', async (req, res) => {
    const { token, id, cobertura, importe } = req.body || {};
    const rowId = sqlInt(id);
    if (!rowId) {
        res.send({ ok: false, error: 'Registro inválido' });
        return;
    }
    const qry = `
        UPDATE CONCURSOS_OBJETIVOS SET
            COBERTURA=${sqlDec(cobertura)},
            IMPORTE=${sqlDec(importe)}
        WHERE ID=${rowId}
    `;
    execute.QueryToken(res, qry, token);
});

router.post('/objetivo_delete', async (req, res) => {
    const { token, id } = req.body || {};
    const rowId = sqlInt(id);
    const qry = `DELETE FROM CONCURSOS_OBJETIVOS WHERE ID=${rowId}`;
    execute.QueryToken(res, qry, token);
});

router.post('/copiar', async (req, res) => {
    const { token, idconcurso, mes, anio } = req.body || {};
    const id = sqlInt(idconcurso);
    const m = sqlInt(mes);
    const a = sqlInt(anio);
    if (!id || !m || !a) {
        res.send({ ok: false, error: 'Indique concurso, mes y año destino' });
        return;
    }
    try {
        const src = await execute.get_data_qry(`
            SELECT TOP 1 IDCONCURSO, EMPNIT, NOMBRE, MES, ANIO, ACTIVO, ISNULL(CODMARCA,0) AS CODMARCA
            FROM CONCURSOS WHERE IDCONCURSO=${id}
        `, token);
        const row = src && src.recordset && src.recordset[0];
        if (!row) {
            res.send({ ok: false, error: 'Concurso no encontrado' });
            return;
        }
        if (Number(row.MES) === m && Number(row.ANIO) === a) {
            res.send({ ok: false, error: 'El mes y año destino deben ser distintos al concurso origen' });
            return;
        }
        const emp = sqlEsc(String(row.EMPNIT || '').trim());
        const nom = sqlEsc(String(row.NOMBRE || '').trim());
        const activo = activoOk(row.ACTIVO);
        const marca = sqlInt(row.CODMARCA);
        const ins = await execute.get_data_qry(`
            INSERT INTO CONCURSOS (EMPNIT, NOMBRE, MES, ANIO, ACTIVO, CODMARCA)
            OUTPUT INSERTED.IDCONCURSO
            VALUES ('${emp}', '${nom}', ${m}, ${a}, '${activo}', ${marca})
        `, token);
        const newId = ins && ins.recordset && ins.recordset[0] && ins.recordset[0].IDCONCURSO;
        if (!newId) {
            res.send({ ok: false, error: 'No se pudo crear la copia del concurso' });
            return;
        }
        const prods = await execute.get_data_qry(`
            SELECT CODPROD FROM CONCURSOS_PRODUCTOS WHERE IDCONCURSO=${id}
        `, token);
        const codprods = ((prods && prods.recordset) || []).map((p) => p.CODPROD);
        if (codprods.length) await replaceConcursoProductos(newId, codprods, token);
        const objs = await execute.get_data_qry(`
            SELECT CODEMP, COBERTURA, IMPORTE FROM CONCURSOS_OBJETIVOS WHERE IDCONCURSO=${id}
        `, token);
        const list = (objs && objs.recordset) || [];
        for (const o of list) {
            await execute.get_data_qry(`
                INSERT INTO CONCURSOS_OBJETIVOS (IDCONCURSO, CODEMP, COBERTURA, IMPORTE)
                VALUES (${Number(newId)}, ${sqlInt(o.CODEMP)}, ${sqlDec(o.COBERTURA)}, ${sqlDec(o.IMPORTE)})
            `, token);
        }
        res.send({ ok: true, idconcurso: Number(newId), mes: m, anio: a });
    } catch (e) {
        console.error('[concursos/copiar]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo copiar el concurso' });
    }
});

router.post('/vendedor_resumen', async (req, res) => {
    const { token, sucursal, mes, anio, codemp } = req.body || {};
    const emp = sqlEsc(String(sucursal || '').trim());
    const m = sqlInt(mes);
    const a = sqlInt(anio);
    const ven = sqlInt(codemp);
    if (!emp || !ven) {
        res.send({ ok: false, error: 'Datos incompletos' });
        return;
    }
    try {
        const qry = `
            SELECT
                C.IDCONCURSO,
                C.NOMBRE,
                ISNULL(C.ACTIVO, 'NO') AS ACTIVO,
                ISNULL(C.CODMARCA, 0) AS CODMARCA,
                ISNULL(M.DESMARCA, '') AS DESMARCA,
                O.ID AS ID_OBJETIVO,
                ISNULL(O.COBERTURA, 0) AS OBJ_COBERTURA,
                ISNULL(O.IMPORTE, 0) AS OBJ_IMPORTE,
                ISNULL(VP.CLIENTES, 0) AS REAL_COBERTURA,
                ISNULL(VP.TOTALPRECIO, 0) AS REAL_IMPORTE,
                ISNULL(NP.NPROD, 0) AS NPROD
            FROM CONCURSOS C
            INNER JOIN CONCURSOS_OBJETIVOS O ON O.IDCONCURSO = C.IDCONCURSO AND O.CODEMP = ${ven}
            LEFT JOIN MARCAS M ON M.CODMARCA = C.CODMARCA
            LEFT JOIN (
                SELECT IDCONCURSO, COUNT(*) AS NPROD
                FROM CONCURSOS_PRODUCTOS
                GROUP BY IDCONCURSO
            ) NP ON NP.IDCONCURSO = C.IDCONCURSO
            LEFT JOIN (
                SELECT
                    U.ID_OBJETIVO,
                    COUNT(*) AS CLIENTES,
                    ISNULL(I.TOTALPRECIO, 0) AS TOTALPRECIO
                FROM (
                    SELECT DISTINCT VO.ID_OBJETIVO, VO.CODCLIENTE
                    FROM (${sqlVentasLineasConcursoVendedor(emp, m, a, ven, 0, 0)}) VO
                ) U
                LEFT JOIN (
                    SELECT VO2.ID_OBJETIVO, SUM(ISNULL(VO2.TOTALPRECIO, 0)) AS TOTALPRECIO
                    FROM (${sqlVentasLineasConcursoVendedor(emp, m, a, ven, 0, 0)}) VO2
                    GROUP BY VO2.ID_OBJETIVO
                ) I ON I.ID_OBJETIVO = U.ID_OBJETIVO
                GROUP BY U.ID_OBJETIVO, I.TOTALPRECIO
            ) VP ON VP.ID_OBJETIVO = O.ID
            WHERE C.EMPNIT = '${emp}'
              AND C.MES = ${m}
              AND C.ANIO = ${a}
            ORDER BY C.NOMBRE
        `;
        const data = await execute.get_data_qry(qry, token);
        res.send({ ok: true, recordset: (data && data.recordset) || [] });
    } catch (e) {
        console.error('[concursos/vendedor_resumen]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo cargar sus concursos' });
    }
});

router.post('/seguimiento', async (req, res) => {
    const { token, idconcurso } = req.body || {};
    const id = sqlInt(idconcurso);
    if (!id) {
        res.send({ ok: false, error: 'Concurso inválido' });
        return;
    }
    try {
        const hdr = await execute.get_data_qry(`
            SELECT TOP 1 C.IDCONCURSO, C.EMPNIT, C.NOMBRE, C.MES, C.ANIO,
                ISNULL(C.CODMARCA, 0) AS CODMARCA,
                ISNULL(M.DESMARCA, '') AS DESMARCA
            FROM CONCURSOS C
            LEFT JOIN MARCAS M ON M.CODMARCA = C.CODMARCA
            WHERE C.IDCONCURSO=${id}
        `, token);
        const c = hdr && hdr.recordset && hdr.recordset[0];
        if (!c) {
            res.send({ ok: false, error: 'Concurso no encontrado' });
            return;
        }
        const emp = sqlEsc(String(c.EMPNIT || '').trim());
        const mes = sqlInt(c.MES);
        const anio = sqlInt(c.ANIO);
        const qry = `
            SELECT
                O.ID,
                O.CODEMP,
                ISNULL(E.NOMEMPLEADO, '') AS NOMEMPLEADO,
                ISNULL(C.CODMARCA, 0) AS CODMARCA,
                ISNULL(M.DESMARCA, '') AS DESMARCA,
                ISNULL(O.COBERTURA, 0) AS OBJ_COBERTURA,
                ISNULL(O.IMPORTE, 0) AS OBJ_IMPORTE,
                ISNULL(VP.CLIENTES, 0) AS REAL_COBERTURA,
                ISNULL(VP.TOTALPRECIO, 0) AS REAL_IMPORTE,
                ISNULL(NP.NPROD, 0) AS NPROD
            FROM CONCURSOS_OBJETIVOS O
            INNER JOIN CONCURSOS C ON C.IDCONCURSO = O.IDCONCURSO
            LEFT JOIN EMPLEADOS E ON E.CODEMPLEADO = O.CODEMP AND E.EMPNIT = C.EMPNIT
            LEFT JOIN MARCAS M ON M.CODMARCA = C.CODMARCA
            LEFT JOIN (
                SELECT IDCONCURSO, COUNT(*) AS NPROD
                FROM CONCURSOS_PRODUCTOS
                GROUP BY IDCONCURSO
            ) NP ON NP.IDCONCURSO = C.IDCONCURSO
            LEFT JOIN (
                SELECT
                    U.ID_OBJETIVO,
                    COUNT(*) AS CLIENTES,
                    ISNULL(I.TOTALPRECIO, 0) AS TOTALPRECIO
                FROM (
                    SELECT DISTINCT VO.ID_OBJETIVO, VO.CODCLIENTE
                    FROM (${sqlVentasLineasConcurso(emp, mes, anio, id, 0)}) VO
                ) U
                LEFT JOIN (
                    SELECT VO2.ID_OBJETIVO, SUM(ISNULL(VO2.TOTALPRECIO, 0)) AS TOTALPRECIO
                    FROM (${sqlVentasLineasConcurso(emp, mes, anio, id, 0)}) VO2
                    GROUP BY VO2.ID_OBJETIVO
                ) I ON I.ID_OBJETIVO = U.ID_OBJETIVO
                GROUP BY U.ID_OBJETIVO, I.TOTALPRECIO
            ) VP ON VP.ID_OBJETIVO = O.ID
            WHERE O.IDCONCURSO = ${id}
            ORDER BY E.NOMEMPLEADO
        `;
        const data = await execute.get_data_qry(qry, token);
        res.send({
            ok: true,
            concurso: c,
            recordset: (data && data.recordset) || []
        });
    } catch (e) {
        console.error('[concursos/seguimiento]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo cargar el seguimiento' });
    }
});

router.post('/seguimiento_detalle', async (req, res) => {
    const { token, id_objetivo, codemp } = req.body || {};
    const objId = sqlInt(id_objetivo);
    if (!objId) {
        res.send({ ok: false, error: 'Objetivo inválido' });
        return;
    }
    try {
        const hdr = await execute.get_data_qry(`
            SELECT TOP 1
                O.ID,
                O.CODEMP,
                O.IDCONCURSO,
                ISNULL(E.NOMEMPLEADO, '') AS NOMEMPLEADO,
                C.EMPNIT,
                C.MES,
                C.ANIO,
                ISNULL(C.CODMARCA, 0) AS CODMARCA,
                ISNULL(M.DESMARCA, '') AS DESMARCA
            FROM CONCURSOS_OBJETIVOS O
            INNER JOIN CONCURSOS C ON C.IDCONCURSO = O.IDCONCURSO
            LEFT JOIN EMPLEADOS E ON E.CODEMPLEADO = O.CODEMP AND E.EMPNIT = C.EMPNIT
            LEFT JOIN MARCAS M ON M.CODMARCA = C.CODMARCA
            WHERE O.ID = ${objId}
        `, token);
        const o = hdr && hdr.recordset && hdr.recordset[0];
        if (!o) {
            res.send({ ok: false, error: 'Objetivo no encontrado' });
            return;
        }
        const venReq = sqlInt(codemp);
        if (venReq && sqlInt(o.CODEMP) !== venReq) {
            res.send({ ok: false, error: 'No autorizado' });
            return;
        }
        const emp = sqlEsc(String(o.EMPNIT || '').trim());
        const mes = sqlInt(o.MES);
        const anio = sqlInt(o.ANIO);
        const codemp = sqlInt(o.CODEMP);
        const idConcurso = sqlInt(o.IDCONCURSO);
        const qry = `
            SELECT
                P.CODPROD,
                ISNULL(P.DESPROD, '') AS DESPROD,
                ISNULL(V.IMPORTE, 0) AS IMPORTE
            FROM CONCURSOS_PRODUCTOS CP
            INNER JOIN PRODUCTOS P ON P.CODPROD = CP.CODPROD
            LEFT JOIN (
                SELECT
                    DP.CODPROD,
                    SUM(ISNULL(DP.TOTALPRECIO, 0)) AS IMPORTE
                FROM CONCURSOS_PRODUCTOS CPF
                INNER JOIN DOCPRODUCTOS DP ON DP.CODPROD = CPF.CODPROD AND DP.EMPNIT = '${emp}'
                INNER JOIN DOCUMENTOS D
                    ON D.EMPNIT = DP.EMPNIT
                    AND D.CODDOC = DP.CODDOC
                    AND D.CORRELATIVO = DP.CORRELATIVO
                INNER JOIN TIPODOCUMENTOS TD
                    ON D.CODDOC = TD.CODDOC AND D.EMPNIT = TD.EMPNIT
                WHERE CPF.IDCONCURSO = ${idConcurso}
                    AND D.EMPNIT = '${emp}'
                    AND D.MES = ${mes}
                    AND D.ANIO = ${anio}
                    AND D.CODEMP = ${codemp}
                    AND D.STATUS <> 'A'
                    AND TD.TIPODOC IN ${RPT_TIPOS_VENTA}
                GROUP BY DP.CODPROD
            ) V ON V.CODPROD = CP.CODPROD
            WHERE CP.IDCONCURSO = ${idConcurso}
            ORDER BY P.DESPROD, P.CODPROD
        `;
        const cobRes = await execute.get_data_qry(`
            SELECT COUNT(*) AS N
            FROM (
                SELECT DISTINCT VO.CODCLIENTE
                FROM (${sqlVentasLineasConcurso(emp, mes, anio, idConcurso, objId)}) VO
            ) X
        `, token);
        const coberturaMarca = cobRes && cobRes.recordset && cobRes.recordset[0]
            ? Number(cobRes.recordset[0].N) || 0
            : 0;
        const data = await execute.get_data_qry(qry, token);
        res.send({
            ok: true,
            objetivo: o,
            cobertura_marca: coberturaMarca,
            recordset: (data && data.recordset) || []
        });
    } catch (e) {
        console.error('[concursos/seguimiento_detalle]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo cargar el detalle' });
    }
});

module.exports = router;
