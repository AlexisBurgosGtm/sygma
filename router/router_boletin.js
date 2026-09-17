'use strict';

const express = require('express');
const router = express.Router();
const execute = require('../connection');
const webPush = require('../services/webPush');

let tablesReady = false;

function sqlEsc(v) {
    return String(v == null ? '' : v).replace(/'/g, "''");
}

function iconoOk(v) {
    const x = String(v || '').trim().toLowerCase();
    if (x === 'success' || x === 'warning' || x === 'danger' || x === 'info') return x;
    return 'info';
}

const DDL = `
IF OBJECT_ID('dbo.BOLETIN', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.BOLETIN (
        ID INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_BOLETIN PRIMARY KEY,
        EMPNIT VARCHAR(50) NOT NULL,
        CODEMP INT NOT NULL CONSTRAINT DF_BOLETIN_CODEMP DEFAULT (0),
        TITULO VARCHAR(200) NOT NULL,
        MENSAJE VARCHAR(MAX) NOT NULL,
        ICONO VARCHAR(20) NOT NULL CONSTRAINT DF_BOLETIN_ICONO DEFAULT ('info'),
        FECHA VARCHAR(10) NULL,
        HORA VARCHAR(8) NULL,
        FECHA_HORA DATETIME NOT NULL CONSTRAINT DF_BOLETIN_FECHA_HORA DEFAULT (GETDATE())
    );
    CREATE NONCLUSTERED INDEX IX_BOLETIN_EMPNIT ON dbo.BOLETIN (EMPNIT, CODEMP, ID DESC);
END
IF OBJECT_ID('dbo.PUSH_SUSCRIPCIONES', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PUSH_SUSCRIPCIONES (
        ID INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_PUSH_SUSCRIPCIONES PRIMARY KEY,
        EMPNIT VARCHAR(50) NOT NULL,
        CODEMP INT NOT NULL CONSTRAINT DF_PUSH_CODEMP DEFAULT (0),
        ENDPOINT VARCHAR(MAX) NOT NULL,
        P256DH VARCHAR(255) NOT NULL,
        AUTH VARCHAR(255) NOT NULL,
        FECHA_HORA DATETIME NOT NULL CONSTRAINT DF_PUSH_FECHA_HORA DEFAULT (GETDATE())
    );
END
`;

async function ensureTables(token) {
    if (tablesReady) return;
    await execute.get_data_qry(DDL, token);
    tablesReady = true;
}

async function sendBoletinPush(token, empnit, codemp, payload) {
    const emp = sqlEsc(empnit);
    const cod = Number(codemp) || 0;
    let qry;
    if (cod > 0) {
        qry = `
            SELECT ENDPOINT, P256DH, AUTH
            FROM PUSH_SUSCRIPCIONES
            WHERE EMPNIT='${emp}' AND CODEMP=${cod}
        `;
    } else {
        qry = `
            SELECT ENDPOINT, P256DH, AUTH
            FROM PUSH_SUSCRIPCIONES
            WHERE EMPNIT='${emp}'
        `;
    }
    let rows = [];
    try {
        const data = await execute.get_data_qry(qry, token);
        rows = (data && data.recordset) ? data.recordset : [];
    } catch (e) {
        console.error('[boletin] leer suscripciones', e && e.message ? e.message : e);
        return;
    }
    for (const row of rows) {
        try {
            await webPush.sendToSubscription(row, payload);
        } catch (err) {
            const status = err && (err.statusCode || err.status);
            if (status === 404 || status === 410) {
                try {
                    await execute.get_data_qry(
                        `DELETE FROM PUSH_SUSCRIPCIONES WHERE ENDPOINT='${sqlEsc(row.ENDPOINT)}'`,
                        token
                    );
                } catch (e2) {}
            } else {
                console.error('[boletin] push', err && err.message ? err.message : err);
            }
        }
    }
}

router.post('/vapid', async (req, res) => {
    try {
        res.send({ ok: true, publicKey: webPush.getPublicKey() });
    } catch (e) {
        res.send({ ok: false, error: 'No se pudo leer la clave Push' });
    }
});

router.post('/ensure', async (req, res) => {
    const { token } = req.body || {};
    try {
        await ensureTables(token);
        res.send({ ok: true });
    } catch (e) {
        console.error('[boletin/ensure]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudieron crear las tablas del boletín' });
    }
});

router.post('/list', async (req, res) => {
    const { token, sucursal, codemp } = req.body || {};
    try {
        await ensureTables(token);
        const emp = sqlEsc(sucursal);
        const cod = Number(codemp) || 0;
        const qry = `
            SELECT ID, EMPNIT, TITULO, MENSAJE, ICONO, FECHA, HORA, FECHA_HORA
            FROM BOLETIN
            WHERE EMPNIT='${emp}'
              AND (CODEMP=0 OR CODEMP=${cod})
            ORDER BY ID DESC
        `;
        execute.QueryToken(res, qry, token);
    } catch (e) {
        console.error('[boletin/list]', e && e.message ? e.message : e);
        res.send('error');
    }
});

router.post('/insert', async (req, res) => {
    const { token, sucursal, codemp, titulo, mensaje, icono } = req.body || {};
    const emp = sqlEsc(sucursal);
    const tit = sqlEsc(String(titulo || '').trim()).slice(0, 200);
    const msg = sqlEsc(String(mensaje || '').trim());
    const ic = iconoOk(icono);
    const cod = Number(codemp) || 0;
    if (!emp || !tit || !msg) {
        res.send({ ok: false, error: 'Título y mensaje son obligatorios' });
        return;
    }
    try {
        await ensureTables(token);
        const qry = `
            INSERT INTO BOLETIN (EMPNIT, CODEMP, TITULO, MENSAJE, ICONO, FECHA, HORA, FECHA_HORA)
            OUTPUT INSERTED.ID
            VALUES (
                '${emp}',
                ${cod},
                '${tit}',
                '${msg}',
                '${ic}',
                CONVERT(VARCHAR(10), GETDATE(), 103),
                CONVERT(VARCHAR(5), GETDATE(), 108),
                GETDATE()
            );
        `;
        const data = await execute.get_data_qry(qry, token);
        const id = data && data.recordset && data.recordset[0] && data.recordset[0].ID;
        sendBoletinPush(token, sucursal, cod, {
            title: String(titulo || '').trim(),
            body: String(mensaje || '').trim(),
            icono: ic,
            id: id || 0,
        }).catch(() => {});
        res.send({ ok: true, id: id || 0 });
    } catch (e) {
        console.error('[boletin/insert]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo guardar el boletín' });
    }
});

router.post('/delete', async (req, res) => {
    const { token, sucursal, id } = req.body || {};
    const emp = sqlEsc(sucursal);
    const idNum = Number(id) || 0;
    if (!emp || !idNum) {
        res.send('error');
        return;
    }
    try {
        await ensureTables(token);
        const qry = `DELETE FROM BOLETIN WHERE ID=${idNum} AND EMPNIT='${emp}'`;
        execute.QueryToken(res, qry, token);
    } catch (e) {
        res.send('error');
    }
});

router.post('/subscribe', async (req, res) => {
    const { token, sucursal, codemp, endpoint, keys } = req.body || {};
    const emp = sqlEsc(sucursal);
    const ep = sqlEsc(endpoint);
    const p256 = sqlEsc(keys && keys.p256dh);
    const auth = sqlEsc(keys && keys.auth);
    const cod = Number(codemp) || 0;
    if (!emp || !ep || !p256 || !auth) {
        res.send({ ok: false, error: 'Suscripción incompleta' });
        return;
    }
    try {
        await ensureTables(token);
        const qry = `
            DELETE FROM PUSH_SUSCRIPCIONES WHERE ENDPOINT='${ep}';
            INSERT INTO PUSH_SUSCRIPCIONES (EMPNIT, CODEMP, ENDPOINT, P256DH, AUTH, FECHA_HORA)
            VALUES ('${emp}', ${cod}, '${ep}', '${p256}', '${auth}', GETDATE());
        `;
        await execute.get_data_qry(qry, token);
        res.send({ ok: true });
    } catch (e) {
        console.error('[boletin/subscribe]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo guardar la suscripción' });
    }
});

router.post('/unsubscribe', async (req, res) => {
    const { token, endpoint } = req.body || {};
    const ep = sqlEsc(endpoint);
    if (!ep) {
        res.send({ ok: false });
        return;
    }
    try {
        await ensureTables(token);
        await execute.get_data_qry(`DELETE FROM PUSH_SUSCRIPCIONES WHERE ENDPOINT='${ep}'`, token);
        res.send({ ok: true });
    } catch (e) {
        res.send({ ok: false });
    }
});

module.exports = router;
