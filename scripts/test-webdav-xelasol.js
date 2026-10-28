'use strict';

const path = require('path');
try {
    process.loadEnvFile(path.join(__dirname, '..', '.env'));
} catch (e) { /* ignore */ }

const axios = require('axios');
const { createClient } = require('webdav');

const PROPFIND_BODY =
    '<?xml version="1.0"?><d:propfind xmlns:d="DAV:"><d:prop><d:displayname/><d:resourcetype/></d:prop></d:propfind>';

async function propfind(base, remotePath, depth) {
    const auth = {
        username: process.env.STORAGE_USER,
        password: process.env.STORAGE_PASS,
    };
    const urlPath = remotePath.endsWith('/') ? remotePath : `${remotePath}/`;
    const res = await axios({
        method: 'PROPFIND',
        url: base.replace(/\/$/, '') + urlPath,
        auth,
        data: PROPFIND_BODY,
        headers: { Depth: String(depth), 'Content-Type': 'application/xml' },
        validateStatus: () => true,
        timeout: 30000,
    });
    const body = typeof res.data === 'string' ? res.data : '';
    return { status: res.status, snippet: body.slice(0, 600) };
}

async function main() {
    const base = (process.env.STORAGE_SERVER || 'https://webdav.pcloud.com').replace(/\/$/, '');
    const client = createClient(base, {
        username: process.env.STORAGE_USER,
        password: process.env.STORAGE_PASS,
    });

    const paths = ['/', '/XELASOL', '/XELASOL/', 'XELASOL', 'XELASOL/'];
    console.log('=== axios PROPFIND Depth 1 ===');
    for (const p of paths) {
        const r = await propfind(base, p.startsWith('/') ? p : `/${p}`, 1);
        console.log(p, '->', r.status);
        if (r.status >= 200 && r.status < 300) {
            console.log(r.snippet);
        }
    }

    console.log('\n=== PROPFIND /XELASOL/ Depth 0 ===');
    console.log(await propfind(base, '/XELASOL', 0));

    console.log('\n=== webdav client ===');
    for (const p of paths) {
        try {
            const ex = await client.exists(p);
            console.log('exists', JSON.stringify(p), ex);
        } catch (e) {
            console.log('exists', JSON.stringify(p), 'ERR', e.message);
        }
    }

    const buf = Buffer.from('xelasol-xelasol-test', 'utf8');
    for (const p of [
        '/XELASOL/direct_put.txt',
        '/XELASOL/direct_put2.txt',
    ]) {
        try {
            await client.putFileContents(p, buf, { overwrite: true });
            console.log('PUT OK', p);
        } catch (e) {
            console.log('PUT FAIL', p, e.message);
        }
    }
}

main().catch(console.error);
