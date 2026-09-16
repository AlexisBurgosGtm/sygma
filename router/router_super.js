'use strict';

const express = require('express');
const router = express.Router();
const execute = require('../connection');
const superUser = require('../services/superUser');

function sqlNum(v) {
    if (v == null || v === '') return 0;
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'bigint') return Number(v);
    if (typeof v === 'object') {
        if (typeof v.valueOf === 'function') {
            const inner = v.valueOf();
            if (typeof inner === 'number' && Number.isFinite(inner)) return inner;
        }
        const asText = String(v.toString ? v.toString() : v).replace(/\s/g, '').replace(',', '.');
        const n = parseFloat(asText);
        return Number.isFinite(n) ? n : 0;
    }
    const n = parseFloat(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
}

function pagesToMb(pages) {
    return Number(((sqlNum(pages) * 8) / 1024).toFixed(2));
}

function labelToMb(label) {
    const s = String(label == null ? '' : label).trim();
    if (!s) return 0;
    const n = parseFloat(s.replace(/,/g, '').replace(/[^\d.-]/g, ''));
    if (!Number.isFinite(n)) return 0;
    if (/\btb\b/i.test(s)) return Number((n * 1024 * 1024).toFixed(2));
    if (/\bgb\b/i.test(s)) return Number((n * 1024).toFixed(2));
    if (/\bkb\b/i.test(s)) return Number((n / 1024).toFixed(2));
    return Number(n.toFixed(2));
}

async function readFromDatabaseFiles(token) {
    const qry = `
        SELECT
            DB_NAME() AS DB_NAME,
            type_desc AS FILE_TYPE_DESC,
            CAST(size AS BIGINT) AS SIZE_PAGES,
            CAST(ISNULL(FILEPROPERTY(name, 'SpaceUsed'), 0) AS BIGINT) AS USED_PAGES
        FROM sys.database_files
    `;
    const data = await execute.get_data_qry(qry, token);
    const files = (data && data.recordset) ? data.recordset : [];
    if (!files.length) return null;

    let totalPages = 0;
    let usedPages = 0;
    files.forEach((f) => {
        totalPages += sqlNum(f.SIZE_PAGES);
        usedPages += sqlNum(f.USED_PAGES);
    });

    return {
        db_name: (files[0] && files[0].DB_NAME) || '',
        total_mb: pagesToMb(totalPages),
        used_mb: pagesToMb(usedPages),
    };
}

async function readFromSpaceused(token) {
    const data = await execute.get_data_qry('EXEC sp_spaceused', token);
    const row = data && data.recordset && data.recordset[0];
    if (!row) return null;

    const total = labelToMb(row.database_size || row.DATABASE_SIZE);
    const unallocated = labelToMb(row['unallocated space'] || row.unallocated_space || row.UNALLOCATED_SPACE);
    if (!(total > 0)) return null;

    return {
        db_name: row.database_name || row.DATABASE_NAME || '',
        total_mb: total,
        used_mb: Number(Math.max(0, total - unallocated).toFixed(2)),
    };
}

router.post('/db-size', async (req, res) => {
    if (!superUser.requireSuper(req, res)) return;

    const token = req.body && req.body.token;
    let filesInfo = null;
    let spaceInfo = null;

    try {
        filesInfo = await readFromDatabaseFiles(token);
    } catch (err) {
        console.error('[super/db-size] database_files', err && err.message ? err.message : err);
    }

    try {
        spaceInfo = await readFromSpaceused(token);
    } catch (err) {
        console.error('[super/db-size] sp_spaceused', err && err.message ? err.message : err);
    }

    if (!filesInfo && !spaceInfo) {
        return res.send({ ok: false, error: 'No se pudo leer el espacio de la base de datos' });
    }

    const total = Math.max(
        filesInfo ? sqlNum(filesInfo.total_mb) : 0,
        spaceInfo ? sqlNum(spaceInfo.total_mb) : 0
    );
    const used = filesInfo && filesInfo.used_mb > 0
        ? sqlNum(filesInfo.used_mb)
        : (spaceInfo ? sqlNum(spaceInfo.used_mb) : 0);
    const available = Number(Math.max(0, total - used).toFixed(2));

    res.send({
        ok: true,
        db_name: (filesInfo && filesInfo.db_name) || (spaceInfo && spaceInfo.db_name) || '',
        total_mb: Number(total.toFixed(2)),
        used_mb: Number(used.toFixed(2)),
        available_mb: available,
    });
});

module.exports = router;
