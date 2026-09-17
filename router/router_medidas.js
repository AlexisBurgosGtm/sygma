'use strict';

const express = require('express');
const router = express.Router();
const execute = require('../connection');

const CODIGO_FIJO = 'BONI';
const DESC_FIJA = 'BONIFICACION';

function sqlEsc(v) {
    return String(v == null ? '' : v).replace(/'/g, "''");
}

function normCod(v) {
    return String(v == null ? '' : v).trim().toUpperCase();
}

function isFija(v) {
    return normCod(v) === CODIGO_FIJO;
}

function sendOk(res, data) {
    res.send({
        ok: true,
        recordset: (data && data.recordset) ? data.recordset : [],
        rowsAffected: (data && data.rowsAffected) ? data.rowsAffected : [0]
    });
}

function sendErr(res, msg) {
    res.send({ ok: false, error: msg || 'Error', recordset: [], rowsAffected: [0] });
}

async function ensureBoni(token) {
    const qry = `
        IF NOT EXISTS (
            SELECT 1 FROM MEDIDAS
            WHERE UPPER(LTRIM(RTRIM(CODMEDIDA))) = '${CODIGO_FIJO}'
        )
        BEGIN
            INSERT INTO MEDIDAS (CODMEDIDA, DESMEDIDA)
            VALUES ('${CODIGO_FIJO}', '${DESC_FIJA}');
        END
    `;
    await execute.get_data_qry(qry, token);
}

router.post('/listado', async (req, res) => {
    const { token } = req.body || {};
    try {
        await ensureBoni(token);
        const qry = `
            SELECT
                CODMEDIDA,
                DESMEDIDA,
                CASE WHEN UPPER(LTRIM(RTRIM(CODMEDIDA))) = '${CODIGO_FIJO}' THEN 1 ELSE 0 END AS FIJA
            FROM MEDIDAS
            ORDER BY
                CASE WHEN UPPER(LTRIM(RTRIM(CODMEDIDA))) = '${CODIGO_FIJO}' THEN 0 ELSE 1 END,
                CODMEDIDA
        `;
        const data = await execute.get_data_qry(qry, token);
        sendOk(res, data);
    } catch (e) {
        console.error('[medidas/listado]', e && e.message ? e.message : e);
        sendErr(res, 'No se pudo cargar el listado de medidas');
    }
});

router.post('/insert', async (req, res) => {
    const { token, codigo, descripcion } = req.body || {};
    const cod = normCod(codigo);
    const des = String(descripcion == null ? '' : descripcion).trim() || cod;
    if (!cod) return sendErr(res, 'Indique el código de la medida');
    if (isFija(cod)) return sendErr(res, 'La medida BONI es fija y no se puede crear ni modificar');
    try {
        await ensureBoni(token);
        const exists = await execute.get_data_qry(
            `SELECT CODMEDIDA FROM MEDIDAS WHERE UPPER(LTRIM(RTRIM(CODMEDIDA))) = '${sqlEsc(cod)}'`,
            token
        );
        if (exists && exists.recordset && exists.recordset.length) {
            return sendErr(res, 'Ya existe una medida con ese código');
        }
        const data = await execute.get_data_qry(
            `INSERT INTO MEDIDAS (CODMEDIDA, DESMEDIDA) VALUES ('${sqlEsc(cod)}', '${sqlEsc(des)}');`,
            token
        );
        sendOk(res, data);
    } catch (e) {
        console.error('[medidas/insert]', e && e.message ? e.message : e);
        sendErr(res, 'No se pudo crear la medida');
    }
});

router.post('/update', async (req, res) => {
    const { token, codigo, descripcion } = req.body || {};
    const cod = normCod(codigo);
    const des = String(descripcion == null ? '' : descripcion).trim();
    if (!cod) return sendErr(res, 'Indique el código de la medida');
    if (isFija(cod)) return sendErr(res, 'La medida BONI es fija y no se puede editar');
    if (!des) return sendErr(res, 'Indique la descripción de la medida');
    try {
        await ensureBoni(token);
        const data = await execute.get_data_qry(
            `UPDATE MEDIDAS
             SET DESMEDIDA = '${sqlEsc(des)}'
             WHERE UPPER(LTRIM(RTRIM(CODMEDIDA))) = '${sqlEsc(cod)}'
               AND UPPER(LTRIM(RTRIM(CODMEDIDA))) <> '${CODIGO_FIJO}';`,
            token
        );
        const n = data && data.rowsAffected ? Number(data.rowsAffected[0]) : 0;
        if (!n) return sendErr(res, 'No se pudo actualizar la medida');
        sendOk(res, data);
    } catch (e) {
        console.error('[medidas/update]', e && e.message ? e.message : e);
        sendErr(res, 'No se pudo actualizar la medida');
    }
});

router.post('/delete', async (req, res) => {
    const { token, codigo } = req.body || {};
    const cod = normCod(codigo);
    if (!cod) return sendErr(res, 'Indique el código de la medida');
    if (isFija(cod)) return sendErr(res, 'La medida BONI es fija y no se puede eliminar');
    try {
        await ensureBoni(token);
        const data = await execute.get_data_qry(
            `DELETE FROM MEDIDAS
             WHERE UPPER(LTRIM(RTRIM(CODMEDIDA))) = '${sqlEsc(cod)}'
               AND UPPER(LTRIM(RTRIM(CODMEDIDA))) <> '${CODIGO_FIJO}';`,
            token
        );
        const n = data && data.rowsAffected ? Number(data.rowsAffected[0]) : 0;
        if (!n) return sendErr(res, 'No se pudo eliminar la medida');
        sendOk(res, data);
    } catch (e) {
        console.error('[medidas/delete]', e && e.message ? e.message : e);
        sendErr(res, 'No se pudo eliminar la medida');
    }
});

module.exports = router;
