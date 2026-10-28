'use strict';

const path = require('path');
try {
    process.loadEnvFile(path.join(__dirname, '..', '.env'));
} catch (e) { /* ignore */ }

const axios = require('axios');

const body =
    '<?xml version="1.0"?><d:propfind xmlns:d="DAV:"><d:prop><d:displayname/></d:prop></d:propfind>';

async function main() {
    const auth = { username: process.env.STORAGE_USER, password: process.env.STORAGE_PASS };
    for (const depth of ['0', '1', 'infinity']) {
        const r = await axios({
            method: 'PROPFIND',
            url: 'https://webdav.pcloud.com/XELASOL/',
            auth,
            data: body,
            headers: { Depth: depth, 'Content-Type': 'application/xml' },
            validateStatus: () => true,
        });
        const t = typeof r.data === 'string' ? r.data : '';
        console.log('depth', depth, 'status', r.status, 'dav', /multistatus/i.test(t));
    }
}

main().catch(console.error);
