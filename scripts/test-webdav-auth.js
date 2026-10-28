'use strict';

const path = require('path');
try {
    process.loadEnvFile(path.join(__dirname, '..', '.env'));
} catch (e) { /* ignore */ }

const axios = require('axios');

async function req(label, config) {
    try {
        const res = await axios({
            validateStatus: () => true,
            timeout: 25000,
            ...config,
        });
        const www = res.headers && (res.headers['www-authenticate'] || res.headers['WWW-Authenticate']);
        console.log(label, '->', res.status, www ? `WWW-Authenticate: ${www}` : '');
        const body = typeof res.data === 'string' ? res.data : '';
        if (body.includes('401') || body.includes('404') || body.includes('DAV')) {
            console.log('  body head:', body.slice(0, 120).replace(/\s+/g, ' '));
        }
    } catch (e) {
        console.log(label, 'ERR', e.message);
    }
}

async function main() {
    const base = 'https://webdav.pcloud.com';
    const user = process.env.STORAGE_USER;
    const pass = process.env.STORAGE_PASS;
    const pf =
        '<?xml version="1.0"?><d:propfind xmlns:d="DAV:"><d:prop><d:displayname/></d:prop></d:propfind>';

    await req('PROPFIND / no auth', {
        method: 'PROPFIND',
        url: `${base}/`,
        data: pf,
        headers: { Depth: '1', 'Content-Type': 'application/xml' },
    });

    await req('PROPFIND / with auth', {
        method: 'PROPFIND',
        url: `${base}/`,
        auth: { username: user, password: pass },
        data: pf,
        headers: { Depth: '1', 'Content-Type': 'application/xml' },
    });

    await req('PROPFIND /XELASOL/ with auth', {
        method: 'PROPFIND',
        url: `${base}/XELASOL/`,
        auth: { username: user, password: pass },
        data: pf,
        headers: { Depth: '1', 'Content-Type': 'application/xml' },
    });

    await req('PUT /XELASOL/t.txt with auth', {
        method: 'PUT',
        url: `${base}/XELASOL/t.txt`,
        auth: { username: user, password: pass },
        data: 'test',
        headers: { 'Content-Type': 'text/plain' },
    });

    await req('wrong pass PROPFIND /', {
        method: 'PROPFIND',
        url: `${base}/`,
        auth: { username: user, password: 'wrong-password-xyz' },
        data: pf,
        headers: { Depth: '1', 'Content-Type': 'application/xml' },
    });
}

main().catch(console.error);
