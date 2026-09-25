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

async function replaceObjetivoProductos(idObjetivo, codprods, token) {
    const id = sqlInt(idObjetivo);
    await execute.get_data_qry(`DELETE FROM CONCURSOS_OBJETIVOS_PRODUCTOS WHERE ID_OBJETIVO=${id}`, token);
    if (!codprods.length) return;
    const chunkSize = 80;
    for (let i = 0; i < codprods.length; i += chunkSize) {
        const slice = codprods.slice(i, i + chunkSize);
        const values = slice.map((c) => `(${id}, '${sqlEsc(c)}')`).join(',');
        await execute.get_data_qry(
            `INSERT INTO CONCURSOS_OBJETIVOS_PRODUCTOS (ID_OBJETIVO, CODPROD) VALUES ${values}`,
            token
        );
    }
}

async function deleteProductosObjetivosConcurso(idConcurso, token) {
    const id = sqlInt(idConcurso);
    await execute.get_data_qry(`
        DELETE FROM CONCURSOS_OBJETIVOS_PRODUCTOS
        WHERE ID_OBJETIVO IN (SELECT ID FROM CONCURSOS_OBJETIVOS WHERE IDCONCURSO=${id})
    `, token);
}

const RPT_TIPOS_VENTA = `('FAC','FEF','FEC','FCP','FES','FPC')`;

function sqlVentasLineasObjetivo(emp, mes, anio, idObjetivo) {
    const empSql = sqlEsc(String(emp || '').trim());
    const m = sqlInt(mes);
    const a = sqlInt(anio);
    const objFilter = idObjetivo ? `AND OP.ID_OBJETIVO = ${sqlInt(idObjetivo)}` : '';
    return `
        SELECT
            OP.ID_OBJETIVO,
            D.CODCLIENTE,
            DP.TOTALPRECIO
        FROM CONCURSOS_OBJETIVOS_PRODUCTOS OP
        INNER JOIN CONCURSOS_OBJETIVOS OX ON OX.ID = OP.ID_OBJETIVO
        INNER JOIN CONCURSOS CX ON CX.IDCONCURSO = OX.IDCONCURSO
        INNER JOIN DOCPRODUCTOS DP ON DP.CODPROD = OP.CODPROD AND DP.EMPNIT = CX.EMPNIT
        INNER JOIN DOCUMENTOS D
            ON D.EMPNIT = DP.EMPNIT
            AND D.CODDOC = DP.CODDOC
            AND D.CORRELATIVO = DP.CORRELATIVO
            AND D.CODEMP = OX.CODEMP
        INNER JOIN TIPODOCUMENTOS TD ON D.CODDOC = TD.CODDOC AND D.EMPNIT = TD.EMPNIT
        WHERE CX.EMPNIT = '${empSql}'
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
            (SELECT COUNT(*) FROM CONCURSOS_OBJETIVOS O WHERE O.IDCONCURSO = C.IDCONCURSO) AS NOBJ
        FROM CONCURSOS C
        WHERE C.EMPNIT = '${emp}'
          AND C.MES = ${m}
          AND C.ANIO = ${a}
        ORDER BY C.IDCONCURSO DESC
    `;
    execute.QueryToken(res, qry, token);
});

router.post('/insert', async (req, res) => {
    const { token, sucursal, nombre, mes, anio, activo } = req.body || {};
    const emp = sqlEsc(String(sucursal || '').trim());
    const nom = sqlEsc(String(nombre || '').trim());
    if (!emp || !nom) {
        res.send({ ok: false, error: 'Indique sucursal y nombre del concurso' });
        return;
    }
    const qry = `
        INSERT INTO CONCURSOS (EMPNIT, NOMBRE, MES, ANIO, ACTIVO)
        OUTPUT INSERTED.IDCONCURSO
        VALUES ('${emp}', '${nom}', ${sqlInt(mes)}, ${sqlInt(anio)}, '${activoOk(activo)}')
    `;
    execute.QueryToken(res, qry, token);
});

router.post('/update', async (req, res) => {
    const { token, idconcurso, sucursal, nombre, mes, anio, activo } = req.body || {};
    const id = sqlInt(idconcurso);
    const nom = sqlEsc(String(nombre || '').trim());
    if (!id || !nom) {
        res.send({ ok: false, error: 'Datos incompletos' });
        return;
    }
    const qry = `
        UPDATE CONCURSOS SET
            EMPNIT='${sqlEsc(String(sucursal || '').trim())}',
            NOMBRE='${nom}',
            MES=${sqlInt(mes)},
            ANIO=${sqlInt(anio)},
            ACTIVO='${activoOk(activo)}'
        WHERE IDCONCURSO=${id}
    `;
    execute.QueryToken(res, qry, token);
});

router.post('/delete', async (req, res) => {
    const { token, idconcurso } = req.body || {};
    const id = sqlInt(idconcurso);
    if (!id) {
        res.send({ ok: false, error: 'Concurso inválido' });
        return;
    }
    try {
        await deleteProductosObjetivosConcurso(id, token);
        await execute.get_data_qry(`DELETE FROM CONCURSOS_OBJETIVOS WHERE IDCONCURSO=${id}`, token);
        const data = await execute.get_data_qry(`DELETE FROM CONCURSOS WHERE IDCONCURSO=${id}`, token);
        res.send(data);
    } catch (e) {
        console.error('[concursos/delete]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo eliminar el concurso' });
    }
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

router.post('/objetivo_productos', async (req, res) => {
    const { token, id } = req.body || {};
    const rowId = sqlInt(id);
    const qry = `
        SELECT CODPROD
        FROM CONCURSOS_OBJETIVOS_PRODUCTOS
        WHERE ID_OBJETIVO = ${rowId}
        ORDER BY CODPROD
    `;
    execute.QueryToken(res, qry, token);
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
            ISNULL(O.CODMARCA, 0) AS CODMARCA,
            ISNULL(M.DESMARCA, CASE WHEN ISNULL(O.CODMARCA, 0) = 0 THEN 'TODAS' ELSE '' END) AS DESMARCA,
            ISNULL(O.COBERTURA, 0) AS COBERTURA,
            ISNULL(O.IMPORTE, 0) AS IMPORTE,
            (SELECT COUNT(*) FROM CONCURSOS_OBJETIVOS_PRODUCTOS P WHERE P.ID_OBJETIVO = O.ID) AS NPROD
        FROM CONCURSOS_OBJETIVOS O
        LEFT JOIN CONCURSOS C ON C.IDCONCURSO = O.IDCONCURSO
        LEFT JOIN EMPLEADOS E ON E.CODEMPLEADO = O.CODEMP AND E.EMPNIT = C.EMPNIT
        LEFT JOIN MARCAS M ON M.CODMARCA = O.CODMARCA
        WHERE O.IDCONCURSO = ${id}
        ORDER BY E.NOMEMPLEADO, M.DESMARCA
    `;
    execute.QueryToken(res, qry, token);
});

router.post('/objetivo_insert', async (req, res) => {
    const { token, idconcurso, codemp, codmarca, cobertura, importe, productos } = req.body || {};
    const id = sqlInt(idconcurso);
    const emp = sqlInt(codemp);
    const marca = sqlInt(codmarca);
    const prods = parseCodprods(productos);
    if (!id || !emp) {
        res.send({ ok: false, error: 'Seleccione concurso y vendedor' });
        return;
    }
    if (marca > 0 && !prods.length) {
        res.send({ ok: false, error: 'Seleccione al menos un producto de la marca' });
        return;
    }
    try {
        const dup = await execute.get_data_qry(`
            SELECT TOP 1 ID FROM CONCURSOS_OBJETIVOS
            WHERE IDCONCURSO=${id} AND CODEMP=${emp} AND ISNULL(CODMARCA,0)=${marca}
        `, token);
        if (dup && dup.recordset && dup.recordset[0]) {
            res.send({ ok: false, error: 'Este vendedor ya tiene objetivo en esa marca' });
            return;
        }
        const ins = await execute.get_data_qry(`
            INSERT INTO CONCURSOS_OBJETIVOS (IDCONCURSO, CODEMP, CODMARCA, COBERTURA, IMPORTE)
            OUTPUT INSERTED.ID
            VALUES (${id}, ${emp}, ${marca}, ${sqlDec(cobertura)}, ${sqlDec(importe)})
        `, token);
        const newId = ins && ins.recordset && ins.recordset[0] && ins.recordset[0].ID;
        if (!newId) {
            res.send({ ok: false, error: 'No se pudo guardar el objetivo' });
            return;
        }
        if (marca > 0) await replaceObjetivoProductos(newId, prods, token);
        res.send({ ok: true, id: Number(newId) });
    } catch (e) {
        console.error('[concursos/objetivo_insert]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo guardar el objetivo' });
    }
});

router.post('/objetivo_update', async (req, res) => {
    const { token, id, cobertura, importe, codmarca, productos } = req.body || {};
    const rowId = sqlInt(id);
    const marca = sqlInt(codmarca);
    const prods = parseCodprods(productos);
    if (!rowId) {
        res.send({ ok: false, error: 'Registro inválido' });
        return;
    }
    if (marca > 0 && !prods.length) {
        res.send({ ok: false, error: 'Seleccione al menos un producto de la marca' });
        return;
    }
    try {
        await execute.get_data_qry(`
            UPDATE CONCURSOS_OBJETIVOS SET
                COBERTURA=${sqlDec(cobertura)},
                IMPORTE=${sqlDec(importe)},
                CODMARCA=${marca}
            WHERE ID=${rowId}
        `, token);
        if (marca > 0) {
            await replaceObjetivoProductos(rowId, prods, token);
        } else {
            await execute.get_data_qry(`DELETE FROM CONCURSOS_OBJETIVOS_PRODUCTOS WHERE ID_OBJETIVO=${rowId}`, token);
        }
        res.send({ ok: true });
    } catch (e) {
        console.error('[concursos/objetivo_update]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo actualizar el objetivo' });
    }
});

router.post('/objetivo_delete', async (req, res) => {
    const { token, id } = req.body || {};
    const rowId = sqlInt(id);
    try {
        await execute.get_data_qry(`DELETE FROM CONCURSOS_OBJETIVOS_PRODUCTOS WHERE ID_OBJETIVO=${rowId}`, token);
        const data = await execute.get_data_qry(`DELETE FROM CONCURSOS_OBJETIVOS WHERE ID=${rowId}`, token);
        res.send(data);
    } catch (e) {
        console.error('[concursos/objetivo_delete]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo eliminar' });
    }
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
            SELECT TOP 1 IDCONCURSO, EMPNIT, NOMBRE, MES, ANIO, ACTIVO
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
        const ins = await execute.get_data_qry(`
            INSERT INTO CONCURSOS (EMPNIT, NOMBRE, MES, ANIO, ACTIVO)
            OUTPUT INSERTED.IDCONCURSO
            VALUES ('${emp}', '${nom}', ${m}, ${a}, '${activo}')
        `, token);
        const newId = ins && ins.recordset && ins.recordset[0] && ins.recordset[0].IDCONCURSO;
        if (!newId) {
            res.send({ ok: false, error: 'No se pudo crear la copia del concurso' });
            return;
        }
        const objs = await execute.get_data_qry(`
            SELECT ID, CODEMP, CODMARCA, COBERTURA, IMPORTE
            FROM CONCURSOS_OBJETIVOS WHERE IDCONCURSO=${id}
        `, token);
        const list = (objs && objs.recordset) || [];
        for (const o of list) {
            const oIns = await execute.get_data_qry(`
                INSERT INTO CONCURSOS_OBJETIVOS (IDCONCURSO, CODEMP, CODMARCA, COBERTURA, IMPORTE)
                OUTPUT INSERTED.ID
                VALUES (${Number(newId)}, ${sqlInt(o.CODEMP)}, ${sqlInt(o.CODMARCA)}, ${sqlDec(o.COBERTURA)}, ${sqlDec(o.IMPORTE)})
            `, token);
            const newObjId = oIns && oIns.recordset && oIns.recordset[0] && oIns.recordset[0].ID;
            if (!newObjId) continue;
            const prods = await execute.get_data_qry(`
                SELECT CODPROD FROM CONCURSOS_OBJETIVOS_PRODUCTOS WHERE ID_OBJETIVO=${sqlInt(o.ID)}
            `, token);
            const codprods = ((prods && prods.recordset) || []).map((p) => p.CODPROD);
            if (codprods.length) await replaceObjetivoProductos(newObjId, codprods, token);
        }
        res.send({ ok: true, idconcurso: Number(newId), mes: m, anio: a });
    } catch (e) {
        console.error('[concursos/copiar]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo copiar el concurso' });
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
            SELECT TOP 1 IDCONCURSO, EMPNIT, NOMBRE, MES, ANIO
            FROM CONCURSOS WHERE IDCONCURSO=${id}
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
                ISNULL(O.CODMARCA, 0) AS CODMARCA,
                ISNULL(M.DESMARCA, CASE WHEN ISNULL(O.CODMARCA, 0) = 0 THEN 'TODAS' ELSE '' END) AS DESMARCA,
                ISNULL(O.COBERTURA, 0) AS OBJ_COBERTURA,
                ISNULL(O.IMPORTE, 0) AS OBJ_IMPORTE,
                CASE
                    WHEN ISNULL(O.CODMARCA, 0) = 0 THEN ISNULL(VV.CLIENTES, 0)
                    ELSE ISNULL(VP.CLIENTES, 0)
                END AS REAL_COBERTURA,
                CASE
                    WHEN ISNULL(O.CODMARCA, 0) = 0 THEN ISNULL(VV.TOTALPRECIO, 0)
                    ELSE ISNULL(VP.TOTALPRECIO, 0)
                END AS REAL_IMPORTE,
                ISNULL(NP.NPROD, 0) AS NPROD
            FROM CONCURSOS_OBJETIVOS O
            INNER JOIN CONCURSOS C ON C.IDCONCURSO = O.IDCONCURSO
            LEFT JOIN EMPLEADOS E ON E.CODEMPLEADO = O.CODEMP AND E.EMPNIT = C.EMPNIT
            LEFT JOIN MARCAS M ON M.CODMARCA = O.CODMARCA
            LEFT JOIN (
                SELECT ID_OBJETIVO, COUNT(*) AS NPROD
                FROM CONCURSOS_OBJETIVOS_PRODUCTOS
                GROUP BY ID_OBJETIVO
            ) NP ON NP.ID_OBJETIVO = O.ID
            LEFT JOIN (
                SELECT
                    D.CODEMP,
                    COUNT(DISTINCT D.CODCLIENTE) AS CLIENTES,
                    SUM(ISNULL(D.TOTALPRECIO, 0)) AS TOTALPRECIO
                FROM DOCUMENTOS D
                INNER JOIN TIPODOCUMENTOS TD ON D.CODDOC = TD.CODDOC AND D.EMPNIT = TD.EMPNIT
                WHERE D.EMPNIT = '${emp}'
                    AND D.MES = ${mes}
                    AND D.ANIO = ${anio}
                    AND D.STATUS <> 'A'
                    AND TD.TIPODOC IN ${RPT_TIPOS_VENTA}
                    AND D.CODCLIENTE IS NOT NULL
                    AND D.CODCLIENTE > 0
                GROUP BY D.CODEMP
            ) VV ON VV.CODEMP = O.CODEMP
            LEFT JOIN (
                SELECT
                    U.ID_OBJETIVO,
                    COUNT(*) AS CLIENTES,
                    ISNULL(I.TOTALPRECIO, 0) AS TOTALPRECIO
                FROM (
                    SELECT DISTINCT VO.ID_OBJETIVO, VO.CODCLIENTE
                    FROM (${sqlVentasLineasObjetivo(emp, mes, anio, 0)}) VO
                ) U
                LEFT JOIN (
                    SELECT VO2.ID_OBJETIVO, SUM(ISNULL(VO2.TOTALPRECIO, 0)) AS TOTALPRECIO
                    FROM (${sqlVentasLineasObjetivo(emp, mes, anio, 0)}) VO2
                    GROUP BY VO2.ID_OBJETIVO
                ) I ON I.ID_OBJETIVO = U.ID_OBJETIVO
                GROUP BY U.ID_OBJETIVO, I.TOTALPRECIO
            ) VP ON VP.ID_OBJETIVO = O.ID
            WHERE O.IDCONCURSO = ${id}
            ORDER BY E.NOMEMPLEADO, M.DESMARCA
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
    const { token, id_objetivo } = req.body || {};
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
                ISNULL(O.CODMARCA, 0) AS CODMARCA,
                ISNULL(E.NOMEMPLEADO, '') AS NOMEMPLEADO,
                C.EMPNIT,
                C.MES,
                C.ANIO
            FROM CONCURSOS_OBJETIVOS O
            INNER JOIN CONCURSOS C ON C.IDCONCURSO = O.IDCONCURSO
            LEFT JOIN EMPLEADOS E ON E.CODEMPLEADO = O.CODEMP AND E.EMPNIT = C.EMPNIT
            WHERE O.ID = ${objId}
        `, token);
        const o = hdr && hdr.recordset && hdr.recordset[0];
        if (!o) {
            res.send({ ok: false, error: 'Objetivo no encontrado' });
            return;
        }
        const emp = sqlEsc(String(o.EMPNIT || '').trim());
        const mes = sqlInt(o.MES);
        const anio = sqlInt(o.ANIO);
        const codemp = sqlInt(o.CODEMP);
        const marca = sqlInt(o.CODMARCA);
        let qry = '';
        let coberturaMarca = 0;
        if (marca > 0) {
            qry = `
                SELECT
                    P.CODPROD,
                    ISNULL(P.DESPROD, '') AS DESPROD,
                    ISNULL(V.IMPORTE, 0) AS IMPORTE
                FROM CONCURSOS_OBJETIVOS_PRODUCTOS OP
                INNER JOIN PRODUCTOS P ON P.CODPROD = OP.CODPROD
                LEFT JOIN (
                    SELECT
                        DP.CODPROD,
                        SUM(ISNULL(DP.TOTALPRECIO, 0)) AS IMPORTE
                    FROM CONCURSOS_OBJETIVOS_PRODUCTOS OPF
                    INNER JOIN DOCPRODUCTOS DP ON DP.CODPROD = OPF.CODPROD AND DP.EMPNIT = '${emp}'
                    INNER JOIN DOCUMENTOS D
                        ON D.EMPNIT = DP.EMPNIT
                        AND D.CODDOC = DP.CODDOC
                        AND D.CORRELATIVO = DP.CORRELATIVO
                    INNER JOIN TIPODOCUMENTOS TD
                        ON D.CODDOC = TD.CODDOC AND D.EMPNIT = TD.EMPNIT
                    WHERE OPF.ID_OBJETIVO = ${objId}
                        AND D.EMPNIT = '${emp}'
                        AND D.MES = ${mes}
                        AND D.ANIO = ${anio}
                        AND D.CODEMP = ${codemp}
                        AND D.STATUS <> 'A'
                        AND TD.TIPODOC IN ${RPT_TIPOS_VENTA}
                    GROUP BY DP.CODPROD
                ) V ON V.CODPROD = OP.CODPROD
                WHERE OP.ID_OBJETIVO = ${objId}
                ORDER BY P.DESPROD, P.CODPROD
            `;
            const cobRes = await execute.get_data_qry(`
                SELECT COUNT(*) AS N
                FROM (
                    SELECT DISTINCT VO.CODCLIENTE
                    FROM (${sqlVentasLineasObjetivo(emp, mes, anio, objId)}) VO
                ) X
            `, token);
            coberturaMarca = cobRes && cobRes.recordset && cobRes.recordset[0]
                ? Number(cobRes.recordset[0].N) || 0
                : 0;
        } else {
            qry = `
                SELECT
                    P.CODPROD,
                    ISNULL(P.DESPROD, '') AS DESPROD,
                    COUNT(DISTINCT CASE WHEN D.CODCLIENTE IS NOT NULL AND D.CODCLIENTE > 0 THEN D.CODCLIENTE END) AS COBERTURA,
                    SUM(ISNULL(DP.TOTALPRECIO, 0)) AS IMPORTE
                FROM DOCPRODUCTOS DP
                INNER JOIN DOCUMENTOS D
                    ON D.EMPNIT = DP.EMPNIT
                    AND D.CODDOC = DP.CODDOC
                    AND D.CORRELATIVO = DP.CORRELATIVO
                INNER JOIN TIPODOCUMENTOS TD
                    ON D.CODDOC = TD.CODDOC AND D.EMPNIT = TD.EMPNIT
                INNER JOIN PRODUCTOS P ON P.CODPROD = DP.CODPROD
                WHERE D.EMPNIT = '${emp}'
                    AND D.MES = ${mes}
                    AND D.ANIO = ${anio}
                    AND D.CODEMP = ${codemp}
                    AND D.STATUS <> 'A'
                    AND TD.TIPODOC IN ${RPT_TIPOS_VENTA}
                GROUP BY P.CODPROD, P.DESPROD
                HAVING SUM(ISNULL(DP.TOTALPRECIO, 0)) <> 0
                    OR COUNT(DISTINCT CASE WHEN D.CODCLIENTE IS NOT NULL AND D.CODCLIENTE > 0 THEN D.CODCLIENTE END) > 0
                ORDER BY P.DESPROD, P.CODPROD
            `;
            const cobRes = await execute.get_data_qry(`
                SELECT COUNT(DISTINCT D.CODCLIENTE) AS N
                FROM DOCUMENTOS D
                INNER JOIN TIPODOCUMENTOS TD ON D.CODDOC = TD.CODDOC AND D.EMPNIT = TD.EMPNIT
                WHERE D.EMPNIT = '${emp}'
                    AND D.MES = ${mes}
                    AND D.ANIO = ${anio}
                    AND D.CODEMP = ${codemp}
                    AND D.STATUS <> 'A'
                    AND TD.TIPODOC IN ${RPT_TIPOS_VENTA}
                    AND D.CODCLIENTE IS NOT NULL
                    AND D.CODCLIENTE > 0
            `, token);
            coberturaMarca = cobRes && cobRes.recordset && cobRes.recordset[0]
                ? Number(cobRes.recordset[0].N) || 0
                : 0;
        }
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
