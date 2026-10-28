'use strict';

const path = require('path');
try {
    process.loadEnvFile(path.join(__dirname, '..', '.env'));
} catch (e) { /* ignore */ }

const axios = require('axios');

async function tryServer(baseUrl, label) {
    const user = process.env.STORAGE_USER;
    const pass = process.env.STORAGE_PASS;
    const auth = { username: user, password: pass };

    console.log(`\n=== ${label} ${baseUrl} ===`);

    const propfindBody =
        '<?xml version="1.0"?><d:propfind xmlns:d="DAV:"><d:prop><d:displayname/></d:prop></d:propfind>';

    for (const [method, urlPath, data, depth] of [
        ['OPTIONS', '/', null, null],
        ['PROPFIND', '/', propfindBody, '0'],
        ['PROPFIND', '/', propfindBody, '1'],
        ['PROPFIND', '/', propfindBody, '1'],
        ['GET', '/', null, null],
    ]) {
        try {
            const pathWithSlash = urlPath.endsWith('/') ? urlPath : `${urlPath}/`;
            const usePath = method === 'PROPFIND' ? pathWithSlash : urlPath;
            const res = await axios({
                method,
                url: baseUrl.replace(/\/$/, '') + usePath,
                auth,
                data,
                headers: method === 'PROPFIND'
                    ? { Depth: depth || '1', 'Content-Type': 'application/xml' }
                    : undefined,
                validateStatus: () => true,
                maxRedirects: 0,
                timeout: 30000,
            });
            console.log(method, urlPath, '->', res.status, String(res.statusText || '').slice(0, 40));
            if (res.data && typeof res.data === 'string' && res.data.length < 800) {
                console.log('  body:', res.data.slice(0, 400));
            }
        } catch (e) {
            console.log(method, urlPath, '-> ERR', e.message);
        }
    }
}

async function main() {
    await tryServer(process.env.STORAGE_SERVER || 'https://webdav.pcloud.com', 'env STORAGE_SERVER');
    await tryServer('https://ewebdav.pcloud.com', 'EU ewebdav');
}

main().catch(console.error);
