'use strict';

const path = require('path');
try {
    process.loadEnvFile(path.join(__dirname, '..', '.env'));
} catch (e) {
    /* ignore */
}

const storage = require('../services/webdavStorage');

async function main() {
    const { checks, resultado } = await storage.runWebdavSelfTest();
    (checks || []).forEach((c) => {
        const mark = c.ok ? 'OK' : 'FAIL';
        console.log(`${mark.padEnd(4)} ${c.name}${c.detail ? ` — ${c.detail}` : ''}`);
    });
    console.log(`\nRESULTADO: ${resultado || 'UNKNOWN'}`);
}

main().catch((e) => {
    console.error('ERROR', e.message || e);
    process.exit(1);
});
