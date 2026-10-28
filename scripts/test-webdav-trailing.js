'use strict';

const path = require('path');
try {
    process.loadEnvFile(path.join(__dirname, '..', '.env'));
} catch (e) { /* ignore */ }

const { createClient } = require('webdav');

async function testServer(serverUrl) {
    console.log('\n---', serverUrl, '---');
    const client = createClient(serverUrl, {
        username: process.env.STORAGE_USER,
        password: process.env.STORAGE_PASS,
    });

    for (const dir of ['/', '/XELASOL/', '/XELASOL']) {
        try {
            const items = await client.getDirectoryContents(dir);
            console.log('list', JSON.stringify(dir), 'count', items.length);
            console.log(items.slice(0, 8).map((i) => `${i.type}:${i.basename}`).join(', '));
        } catch (e) {
            console.log('list', JSON.stringify(dir), 'FAIL', e.message);
        }
    }

    const buf = Buffer.from('trail test', 'utf8');
    for (const p of ['/XELASOL/probe_trailing.txt', '/XELASOL/probe_trailing2.txt']) {
        try {
            await client.createDirectory('/XELASOL/', { recursive: true });
        } catch (e) {
            /* ignore */
        }
        try {
            await client.putFileContents(p, buf, { overwrite: true });
            console.log('PUT OK', p);
        } catch (e) {
            console.log('PUT FAIL', p, e.message);
        }
    }
}

async function main() {
    await testServer('https://webdav.pcloud.com/');
    await testServer('https://ewebdav.pcloud.com/');
}

main().catch(console.error);
