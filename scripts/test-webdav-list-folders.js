'use strict';

const path = require('path');
try {
    process.loadEnvFile(path.join(__dirname, '..', '.env'));
} catch (e) { /* ignore */ }

const axios = require('axios');

const PROPFIND_BODY =
    '<?xml version="1.0"?><d:propfind xmlns:d="DAV:"><d:prop><d:displayname/></d:prop></d:propfind>';

async function tryPath(base, folderPath) {
    const auth = { username: process.env.STORAGE_USER, password: process.env.STORAGE_PASS };
    const urlPath = folderPath.startsWith('/') ? folderPath : `/${folderPath}`;
    const withSlash = urlPath.endsWith('/') ? urlPath : `${urlPath}/`;
    const res = await axios({
        method: 'PROPFIND',
        url: base.replace(/\/$/, '') + withSlash,
        auth,
        data: PROPFIND_BODY,
        headers: { Depth: '1', 'Content-Type': 'application/xml' },
        validateStatus: () => true,
        timeout: 25000,
    });
    const body = typeof res.data === 'string' ? res.data : '';
    const dav = body.includes('multistatus') || body.includes('Multistatus');
    return { path: withSlash, status: res.status, dav, len: body.length };
}

async function main() {
    const base = process.env.STORAGE_SERVER || 'https://webdav.pcloud.com';
    const names = [
        'XELASOL',
        'xelasol',
        'Xelasol',
        'OFERTAS',
        'Public',
        'My Music',
        'My Pictures',
        'My Videos',
        'Documents',
        'sygma',
        'SYGMA',
    ];
    for (const n of names) {
        const enc = encodeURIComponent(n).replace(/%20/g, '%20');
        const r = await tryPath(base, `/${n}`);
        console.log(r.status, r.dav ? 'DAV' : 'html?', n, '->', r.path);
    }
}

main().catch(console.error);
