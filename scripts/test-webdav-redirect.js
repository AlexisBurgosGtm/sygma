'use strict';

const path = require('path');
try {
    process.loadEnvFile(path.join(__dirname, '..', '.env'));
} catch (e) { /* ignore */ }

const axios = require('axios');

async function main() {
    const auth = { username: process.env.STORAGE_USER, password: process.env.STORAGE_PASS };
    const pf =
        '<?xml version="1.0"?><d:propfind xmlns:d="DAV:"><d:prop><d:displayname/></d:prop></d:propfind>';

    for (const maxRedirects of [0, 5]) {
        const res = await axios({
            method: 'PROPFIND',
            url: 'https://webdav.pcloud.com/XELASOL',
            auth,
            data: pf,
            headers: { Depth: '1', 'Content-Type': 'application/xml' },
            validateStatus: () => true,
            maxRedirects,
            timeout: 25000,
        });
        console.log('maxRedirects', maxRedirects, 'status', res.status, 'final', res.request && res.request.path);
        console.log('  location', res.headers.location || '-');
    }

    const res2 = await axios({
        method: 'GET',
        url: 'https://webdav.pcloud.com/',
        auth,
        validateStatus: () => true,
        maxRedirects: 5,
    });
    console.log('GET / status', res2.status, 'type', res2.headers['content-type']);
    console.log(String(res2.data).slice(0, 300));
}

main().catch(console.error);
