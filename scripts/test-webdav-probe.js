'use strict';

const path = require('path');
try {
    process.loadEnvFile(path.join(__dirname, '..', '.env'));
} catch (e) { /* ignore */ }

const { createClient } = require('webdav');

async function probe(label, fn) {
    try {
        const r = await fn();
        console.log(`[OK] ${label}`, typeof r === 'object' ? JSON.stringify(r).slice(0, 500) : r);
    } catch (e) {
        console.log(`[FAIL] ${label}`, e.message || e);
    }
}

async function main() {
    const server = process.env.STORAGE_SERVER;
    const user = process.env.STORAGE_USER;
    const pass = process.env.STORAGE_PASS;
    const client = createClient(server, { username: user, password: pass });

    for (const dir of ['/', '', '/XELASOL', 'XELASOL']) {
        await probe(`getDirectoryContents ${JSON.stringify(dir)}`, () =>
            client.getDirectoryContents(dir).then((items) =>
                items.slice(0, 15).map((i) => ({
                    type: i.type,
                    basename: i.basename,
                    filename: i.filename,
                }))
            )
        );
    }

    await probe('stat /', () => client.stat('/'));
    await probe('stat /XELASOL', () => client.stat('/XELASOL'));

    const buf = Buffer.from('probe', 'utf8');
    for (const p of [
        '/test_probe_root.txt',
        '/Public/test_probe.txt',
        '/My Music/test_probe.txt',
    ]) {
        await probe(`PUT ${p}`, () =>
            client.putFileContents(p, buf, { overwrite: true }).then(() => 'uploaded')
        );
    }

    await probe('MKCOL /XELASOL_TEST_DIR', () =>
        client.createDirectory('/XELASOL_TEST_DIR').then(() => 'created')
    );
    await probe('PUT in /XELASOL_TEST_DIR/a.txt', () =>
        client.putFileContents('/XELASOL_TEST_DIR/a.txt', buf, { overwrite: true })
    );
}

main().catch(console.error);
