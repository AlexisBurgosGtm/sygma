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

const RPT_TIPOS_VENTA = `('FAC','FEF','FEC','FCP','FES','FPC')`;

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
            ISNULL(O.CODMARCA, 0) AS CODMARCA,
            ISNULL(M.DESMARCA, CASE WHEN ISNULL(O.CODMARCA, 0) = 0 THEN 'TODAS' ELSE '' END) AS DESMARCA,
            ISNULL(O.COBERTURA, 0) AS COBERTURA,
            ISNULL(O.IMPORTE, 0) AS IMPORTE
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
    const { token, idconcurso, codemp, codmarca, cobertura, importe } = req.body || {};
    const id = sqlInt(idconcurso);
    const emp = sqlInt(codemp);
    const marca = sqlInt(codmarca);
    if (!id || !emp) {
        res.send({ ok: false, error: 'Seleccione concurso y vendedor' });
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
        const data = await execute.get_data_qry(`
            INSERT INTO CONCURSOS_OBJETIVOS (IDCONCURSO, CODEMP, CODMARCA, COBERTURA, IMPORTE)
            VALUES (${id}, ${emp}, ${marca}, ${sqlDec(cobertura)}, ${sqlDec(importe)})
        `, token);
        res.send(data);
    } catch (e) {
        console.error('[concursos/objetivo_insert]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo guardar el objetivo' });
    }
});

router.post('/objetivo_update', async (req, res) => {
    const { token, id, cobertura, importe, codmarca } = req.body || {};
    const rowId = sqlInt(id);
    if (!rowId) {
        res.send({ ok: false, error: 'Registro inválido' });
        return;
    }
    const qry = `
        UPDATE CONCURSOS_OBJETIVOS SET
            COBERTURA=${sqlDec(cobertura)},
            IMPORTE=${sqlDec(importe)},
            CODMARCA=${sqlInt(codmarca)}
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
        await execute.get_data_qry(`
            INSERT INTO CONCURSOS_OBJETIVOS (IDCONCURSO, CODEMP, CODMARCA, COBERTURA, IMPORTE)
            SELECT ${Number(newId)}, CODEMP, CODMARCA, COBERTURA, IMPORTE
            FROM CONCURSOS_OBJETIVOS
            WHERE IDCONCURSO=${id}
        `, token);
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
                    ELSE ISNULL(VM.CONTEO, 0)
                END AS REAL_COBERTURA,
                CASE
                    WHEN ISNULL(O.CODMARCA, 0) = 0 THEN ISNULL(VV.TOTALPRECIO, 0)
                    ELSE ISNULL(VM.TOTALPRECIO, 0)
                END AS REAL_IMPORTE
            FROM CONCURSOS_OBJETIVOS O
            INNER JOIN CONCURSOS C ON C.IDCONCURSO = O.IDCONCURSO
            LEFT JOIN EMPLEADOS E ON E.CODEMPLEADO = O.CODEMP AND E.EMPNIT = C.EMPNIT
            LEFT JOIN MARCAS M ON M.CODMARCA = O.CODMARCA
            LEFT JOIN (
                SELECT
                    D.CODEMP,
                    COUNT(DISTINCT CASE WHEN D.CODCLIENTE IS NOT NULL AND D.CODCLIENTE > 0 THEN D.CODCLIENTE END) AS CLIENTES,
                    SUM(ISNULL(D.TOTALPRECIO, 0)) AS TOTALPRECIO
                FROM DOCUMENTOS D
                INNER JOIN TIPODOCUMENTOS TD ON D.CODDOC = TD.CODDOC AND D.EMPNIT = TD.EMPNIT
                WHERE D.EMPNIT = '${emp}'
                    AND D.MES = ${mes}
                    AND D.ANIO = ${anio}
                    AND D.STATUS <> 'A'
                    AND TD.TIPODOC IN ${RPT_TIPOS_VENTA}
                GROUP BY D.CODEMP
            ) VV ON VV.CODEMP = O.CODEMP
            LEFT JOIN (
                SELECT
                    CODEMP,
                    CODMARCA,
                    COUNT(DISTINCT CODCLIENTE) AS CONTEO,
                    SUM(ISNULL(TOTALPRECIO, 0)) AS TOTALPRECIO
                FROM view_rpt_cobertura_marcas_empleado
                WHERE EMPNIT = '${emp}'
                    AND MES = ${mes}
                    AND ANIO = ${anio}
                    AND DESMARCA IS NOT NULL
                GROUP BY CODEMP, CODMARCA
            ) VM ON VM.CODEMP = O.CODEMP AND VM.CODMARCA = O.CODMARCA
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

module.exports = router;
