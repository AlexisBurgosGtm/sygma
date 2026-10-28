const path = require('path');
const axios = require('axios');
const { createClient } = require('webdav');

let clientInstance = null;

const MIME_BY_EXT = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
};

const DEFAULT_FOLDER = '/sygma';
const TRUSTED_STORAGE_FOLDERS = ['/XELASOL', '/OFERTAS', DEFAULT_FOLDER];

function normalizeStorageServerUrl(server) {
    return String(server || '').trim().replace(/\/+$/, '');
}

function getStorageConfig() {
    const server = normalizeStorageServerUrl(process.env.STORAGE_SERVER);
    const username = String(process.env.STORAGE_USER || '').trim();
    const password = String(process.env.STORAGE_PASS || '').trim();

    if (!server || !username || !password) {
        const err = new Error('Credenciales de almacenamiento no configuradas (STORAGE_SERVER, STORAGE_USER, STORAGE_PASS)');
        err.code = 'STORAGE_CONFIG';
        throw err;
    }

    return { server, username, password };
}

function getWebdavClient() {
    if (!clientInstance) {
        const { server, username, password } = getStorageConfig();
        clientInstance = createClient(server, {
            username,
            password,
            maxRedirects: 0,
        });
    }
    return clientInstance;
}

function isPcloudServer(server) {
    return /pcloud\.com/i.test(String(server || ''));
}

function getTrustedStorageFolders() {
    const fromEnv = String(process.env.STORAGE_TRUST_FOLDERS || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => sanitizeRemotePath(s));
    return new Set([...TRUSTED_STORAGE_FOLDERS.map(sanitizeRemotePath), ...fromEnv]);
}

/** pCloud: PROPFIND a colecciones con barra final; Depth 0 en stat/exists suele fallar. */
function collectionPathForPropfind(dirPath) {
    const p = sanitizeRemotePath(dirPath);
    return p.endsWith('/') ? p : `${p}/`;
}

function resetWebdavClient() {
    clientInstance = null;
}

function sanitizeRemotePath(remotePath) {
    if (!remotePath || typeof remotePath !== 'string') {
        const err = new Error('Ruta remota invalida');
        err.code = 'INVALID_PATH';
        throw err;
    }

    let normalized = remotePath.replace(/\\/g, '/').trim();
    if (!normalized.startsWith('/')) {
        normalized = `/${normalized}`;
    }

    const parts = normalized.split('/').filter((segment) => segment && segment !== '.' && segment !== '..');
    return `/${parts.join('/')}`;
}

function sanitizeFilename(filename) {
    const safeName = String(filename || '')
        .replace(/[/\\]/g, '_')
        .replace(/\s+/g, '_')
        .trim();

    if (!safeName) {
        const err = new Error('Nombre de archivo invalido');
        err.code = 'INVALID_FILENAME';
        throw err;
    }

    return safeName;
}

function parseHexToBuffer(hex) {
    if (!hex || typeof hex !== 'string') {
        const err = new Error('Contenido hexadecimal invalido');
        err.code = 'INVALID_HEX';
        throw err;
    }

    const clean = hex.trim().replace(/^0x/i, '').replace(/\s+/g, '');
    if (!clean.length || clean.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(clean)) {
        const err = new Error('Cadena hexadecimal invalida');
        err.code = 'INVALID_HEX';
        throw err;
    }

    return Buffer.from(clean, 'hex');
}

function buildRemotePath(folder, filename) {
    const base = sanitizeRemotePath(folder || DEFAULT_FOLDER);
    const safeName = sanitizeFilename(filename);
    return `${base}/${safeName}`;
}

function getMimeType(remotePath) {
    const ext = path.extname(remotePath || '').toLowerCase();
    return MIME_BY_EXT[ext] || 'application/octet-stream';
}

function isImageMime(mimeType) {
    return String(mimeType || '').startsWith('image/');
}

const PROPFIND_BODY =
    '<?xml version="1.0"?><d:propfind xmlns:d="DAV:"><d:prop><d:displayname/></d:prop></d:propfind>';

async function httpPropfind(remotePath, depth) {
    const { server, username, password } = getStorageConfig();
    const pathPart = remotePath.startsWith('/') ? remotePath : `/${remotePath}`;
    const res = await axios({
        method: 'PROPFIND',
        url: `${normalizeStorageServerUrl(server)}${pathPart}`,
        auth: { username, password },
        data: PROPFIND_BODY,
        headers: { Depth: String(depth), 'Content-Type': 'application/xml' },
        validateStatus: () => true,
        timeout: 25000,
        maxRedirects: 0,
    });
    const body = typeof res.data === 'string' ? res.data : '';
    return {
        status: res.status,
        isDav: /multistatus/i.test(body),
    };
}

async function remoteCollectionVisible(dirPath) {
    const safeDir = sanitizeRemotePath(dirPath);
    const { server } = getStorageConfig();
    if (isPcloudServer(server)) {
        const r = await httpPropfind(collectionPathForPropfind(safeDir), '1');
        return {
            visible: r.isDav,
            status: r.status,
            method: 'propfind-depth-1',
        };
    }
    const client = getWebdavClient();
    try {
        const ex = await client.exists(safeDir);
        return { visible: !!ex, status: ex ? 200 : 404, method: 'webdav-exists' };
    } catch (e) {
        return { visible: false, status: 0, method: 'webdav-exists', error: e.message };
    }
}

async function diagnoseStorageFolder(folder) {
    const target = sanitizeRemotePath(folder || '/XELASOL');
    const publicCheck = await remoteCollectionVisible('/Public');
    const targetCheck = await remoteCollectionVisible(target);
    let libraryExists = false;
    try {
        libraryExists = await getWebdavClient().exists(target);
    } catch (e) {
        libraryExists = false;
    }

    let summary;
    let situation = 'UNKNOWN';
    let next_steps = [];

    if (targetCheck.visible) {
        situation = 'OK';
        summary = `WebDAV ve la carpeta ${target} correctamente.`;
    } else if (publicCheck.visible) {
        situation = 'FOLDER_NOT_VISIBLE';
        summary = `WebDAV responde pero no encuentra ${target}. Verifique el nombre exacto en my.pcloud.com (mayusculas y sin espacios).`;
        next_steps = [
            'En my.pcloud.com confirme que la carpeta se llama exactamente XELASOL (raiz, no dentro de otra).',
            'Vuelva a ejecutar node scripts/test-webdav-upload.js.',
        ];
    } else if (targetCheck.status === 401 || publicCheck.status === 401) {
        situation = 'AUTH_FAILED';
        summary = 'WebDAV rechazo las credenciales (401). Revise STORAGE_USER y STORAGE_PASS.';
        next_steps = [
            'STORAGE_USER debe ser su correo completo de pCloud.',
            'STORAGE_PASS debe ser la contraseña de pCloud (no la de SQL ni otra).',
            'Pruebe iniciar sesion en https://my.pcloud.com con las mismas credenciales.',
        ];
    } else if (publicCheck.status === 404 && targetCheck.status === 404) {
        situation = 'WEBDAV_NO_VOLUME';
        summary = [
            'La contraseña parece aceptada (no hay 401), pero pCloud no expone ninguna carpeta por WebDAV',
            '(ni /Public/ ni /XELASOL/). XELASOL puede existir en la web; el fallo es del canal WebDAV, no del nombre de carpeta.',
        ].join(' ');
        next_steps = [
            'Abra https://webdav.pcloud.com en el navegador con el mismo usuario y contraseña del .env.',
            'Revise el correo "New login attempt" de pCloud y pulse Yes, it\'s me (tambien tras desplegar en Render).',
            'Confirme en my.pcloud.com que su plan tiene WebDAV activo (cuentas sin WebDAV dan este patron).',
            'Cuando funcione, propfind_public.visible debe pasar a true; luego propfind_target para XELASOL.',
        ];
    } else {
        situation = 'WEBDAV_ERROR';
        summary = [
            `WebDAV no lista carpetas (exists()=${libraryExists}, PROPFIND ${target}=${targetCheck.status}).`,
            'Eso no implica que XELASOL falte en la app web de pCloud.',
        ].join(' ');
        next_steps = [
            'Apruebe el correo "New login attempt" de pCloud.',
            'Confirme STORAGE_SERVER=https://webdav.pcloud.com (region US).',
            'Ejecute node scripts/test-webdav-auth.js y compare 401 vs 404.',
        ];
    }

    return {
        folder: target,
        library_exists: libraryExists,
        situation,
        next_steps,
        propfind_public: publicCheck,
        propfind_target: targetCheck,
        summary,
    };
}

async function ensureParentDirectory(remotePath) {
    const lastSlash = remotePath.lastIndexOf('/');
    const dir = lastSlash > 0 ? remotePath.substring(0, lastSlash) : '';
    if (!dir) return;

    const safeDir = sanitizeRemotePath(dir);
    const visible = await remoteCollectionVisible(safeDir);
    if (visible.visible) return;

    if (getTrustedStorageFolders().has(safeDir)) {
        const diag = await diagnoseStorageFolder(safeDir);
        const err = new Error(diag.summary);
        err.code = 'STORAGE_UNAVAILABLE';
        err.diagnose = diag;
        throw err;
    }

    const client = getWebdavClient();
    try {
        await client.createDirectory(safeDir, { recursive: true });
    } catch (nestedErr) {
        const after = await remoteCollectionVisible(safeDir);
        if (!after.visible) {
            throw nestedErr;
        }
    }
}

function parseOverwriteFlag(overwrite) {
    if (overwrite === false || overwrite === 0) return false;
    if (overwrite === true || overwrite === 1) return true;
    const s = String(overwrite == null ? '' : overwrite).trim().toLowerCase();
    if (s === 'false' || s === '0' || s === 'no') return false;
    if (s === 'true' || s === '1' || s === 'yes' || s === 'si') return true;
    return true;
}

function isWebdavConflictError(err) {
    const msg = String(err && err.message ? err.message : err);
    return /409|Conflict/i.test(msg);
}

function enrichWebdavError(err) {
    const msg = String(err && err.message ? err.message : err);
    if (/401|Unauthorized/i.test(msg)) {
        const e = new Error(
            'WebDAV rechazó las credenciales. Confirme STORAGE_USER/STORAGE_PASS, la región (webdav.pcloud.com US vs ewebdav.pcloud.com EU) y el correo de aprobacion si tiene 2FA.'
        );
        e.code = 'STORAGE_AUTH';
        return e;
    }
    if (/404|Not Found/i.test(msg)) {
        const e = new Error(
            'WebDAV no responde en la raiz (404). Revise STORAGE_SERVER segun la region de su cuenta pCloud, que su plan tenga WebDAV y ejecute scripts/test-webdav-upload.js en el servidor.'
        );
        e.code = 'STORAGE_UNAVAILABLE';
        return e;
    }
    if (/409|Conflict/i.test(msg)) {
        const e = new Error(
            'WebDAV devolvio 409 al subir: el servidor no ve la carpeta padre (coleccion). Si XELASOL ya existe en my.pcloud.com, apruebe el acceso WebDAV en el correo de pCloud y ejecute scripts/test-webdav-upload.js.'
        );
        e.code = 'STORAGE_CONFLICT';
        return e;
    }
    return err;
}

/** Diagnostico HTTP (pCloud: Depth 1 y /Public/ o /XELASOL/ con barra final). */
const WEBDAV_SELF_TEST_FOLDER = '/XELASOL';

function maskStorageUser(user) {
    const s = String(user || '');
    if (s.length <= 4) return '****';
    return s.slice(0, 3) + '***' + s.slice(-2);
}

async function authHintForSelfTest() {
    const { server, username, password } = getStorageConfig();
    const base = normalizeStorageServerUrl(server);
    const opts = {
        method: 'PROPFIND',
        url: `${base}/`,
        data: PROPFIND_BODY,
        headers: { Depth: '1', 'Content-Type': 'application/xml' },
        validateStatus: () => true,
        timeout: 20000,
        maxRedirects: 0,
    };
    const bad = await axios({
        ...opts,
        auth: { username, password: '__invalid__' },
    });
    const good = await axios({
        ...opts,
        auth: { username, password },
    });
    if (good.status === 401) return 'credenciales rechazadas (401)';
    if (bad.status === 401 && good.status !== 401) return 'credenciales aceptadas';
    return `http ${good.status}`;
}

/** Mismas comprobaciones que scripts/test-webdav-upload.js */
async function runWebdavSelfTest() {
    const checks = [];
    const push = (name, ok, detail) => {
        checks.push({ name, ok: !!ok, detail: detail == null ? '' : String(detail) });
    };

    let server;
    let username;
    try {
        const cfg = getStorageConfig();
        server = cfg.server;
        username = cfg.username;
        push('env STORAGE_SERVER', !!server, server || 'falta');
        push('env STORAGE_USER', !!cfg.username);
        push('env STORAGE_PASS', !!cfg.password);
    } catch (err) {
        push('env STORAGE', false, err.message || 'STORAGE_CONFIG');
        return {
            ok: false,
            resultado: 'STORAGE_CONFIG',
            checks,
            server: null,
            user_masked: '',
        };
    }

    try {
        const auth = await authHintForSelfTest();
        push('auth', auth.indexOf('aceptadas') >= 0, auth);
    } catch (err) {
        push('auth', false, err.message || 'error');
    }

    for (const folderPath of ['/Public/', '/XELASOL/']) {
        try {
            const r = await httpPropfind(folderPath, '1');
            push(`PROPFIND ${folderPath}`, r.isDav, r.isDav ? 'DAV' : `HTTP ${r.status}`);
        } catch (err) {
            push(`PROPFIND ${folderPath}`, false, err.message || 'error');
        }
    }

    const probePath = `${WEBDAV_SELF_TEST_FOLDER}/_xelasol_probe_${Date.now()}.txt`;
    const client = getWebdavClient();
    try {
        await client.putFileContents(probePath, Buffer.from('probe', 'utf8'), { overwrite: true });
        push('PUT archivo prueba', true, probePath);
    } catch (err) {
        const msg = String(err && err.message ? err.message : err);
        push(
            'PUT archivo prueba',
            false,
            /409|401|404/i.test(msg) ? msg.replace(/Invalid response: /i, '') : msg
        );
    }

    try {
        await uploadFromBuffer({
            buffer: Buffer.from('probe-module', 'utf8'),
            filename: `_xelasol_module_${Date.now()}.txt`,
            folder: WEBDAV_SELF_TEST_FOLDER,
            overwrite: true,
        });
        push('uploadFromBuffer (app)', true);
    } catch (err) {
        push('uploadFromBuffer (app)', false, err.code || err.message || 'error');
    }

    let resultado = 'UNKNOWN';
    try {
        const probe = await probeWebdavConnection();
        resultado = (probe.diagnose && probe.diagnose.situation) || 'UNKNOWN';
    } catch (err) {
        resultado = 'ERROR';
    }

    const allOk = checks.every((c) => c.ok) && resultado === 'OK';
    return {
        ok: allOk,
        resultado,
        checks,
        server,
        user_masked: maskStorageUser(username),
    };
}

async function probeWebdavConnection() {
    const { server } = getStorageConfig();
    const endpoint = normalizeStorageServerUrl(server);
    const folders = ['/Public/', '/XELASOL/'];
    const checks = [];

    for (const folderPath of folders) {
        try {
            const r = await httpPropfind(folderPath, '1');
            checks.push({
                path: folderPath,
                status: r.status,
                ok: r.isDav,
            });
        } catch (nestedErr) {
            checks.push({
                path: folderPath,
                status: 0,
                ok: false,
                error: nestedErr.message,
            });
        }
    }

    const xelasol = checks.find((c) => c.path === '/XELASOL/');
    const working = checks.find((c) => c.ok);
    return {
        ok: !!(xelasol && xelasol.ok),
        webdav_active: !!working,
        recommended_server: working ? endpoint : null,
        checks,
        diagnose: await diagnoseStorageFolder('/XELASOL'),
    };
}

async function removeRemoteFileIfExists(client, remotePath) {
    try {
        const exists = await client.exists(remotePath);
        if (exists) {
            await client.deleteFile(remotePath);
        }
    } catch (e) {
        /* intentar PUT de todas formas */
    }
}

function remotePathParts(remotePath) {
    const p = sanitizeRemotePath(remotePath);
    const slash = p.lastIndexOf('/');
    const file = slash >= 0 ? p.slice(slash + 1) : p;
    const dir = slash >= 0 ? p.slice(0, slash) : '';
    const ext = path.extname(file);
    const stem = ext ? file.slice(0, -ext.length) : file;
    return { dir, stem, ext, file };
}

function uniqueRemotePathToken() {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Siempre un nombre nuevo (sin intentar sobrescribir el base). */
function uniqueRemotePathFromBase(basePath) {
    const { dir, stem, ext } = remotePathParts(basePath);
    return `${dir}/${stem}__${uniqueRemotePathToken()}${ext}`;
}

function candidateRemotePathByAttempt(initialPath, attempt) {
    if (attempt <= 1) {
        return initialPath;
    }
    const { dir, stem, ext } = remotePathParts(initialPath);
    if (attempt <= 100) {
        return `${dir}/${stem}-${attempt}${ext}`;
    }
    return `${dir}/${stem}-${Date.now()}${ext}`;
}

/** PUT con reintentos: pCloud/WebDAV a veces responde 409 aunque exists() diga lo contrario. */
async function putRemoteFileContentsResilient(client, initialPath, buffer, doOverwrite) {
    if (doOverwrite) {
        await removeRemoteFileIfExists(client, initialPath);
        try {
            await client.putFileContents(initialPath, buffer, { overwrite: true });
            return initialPath;
        } catch (err) {
            if (!isWebdavConflictError(err)) {
                throw err;
            }
        }
    }

    const maxAttempts = 120;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        const targetPath = candidateRemotePathByAttempt(initialPath, attempt);
        try {
            if (attempt > 1 || doOverwrite) {
                await removeRemoteFileIfExists(client, targetPath);
            }
            await client.putFileContents(targetPath, buffer, { overwrite: true });
            return targetPath;
        } catch (err) {
            if (isWebdavConflictError(err) && attempt < maxAttempts) {
                continue;
            }
            throw err;
        }
    }

    const fallback = candidateRemotePathByAttempt(initialPath, 999);
    await removeRemoteFileIfExists(client, fallback);
    await client.putFileContents(fallback, buffer, { overwrite: true });
    return fallback;
}

async function uploadFromHex({ hex, filename, folder, remote_path, overwrite = true }) {
    const buffer = parseHexToBuffer(hex);
    return uploadFromBuffer({ buffer, filename, folder, remote_path, overwrite });
}

async function uploadFromBuffer({ buffer, filename, folder, remote_path, overwrite = true }) {
    if (!Buffer.isBuffer(buffer) || !buffer.length) {
        const err = new Error('Contenido de archivo invalido');
        err.code = 'INVALID_FILE';
        throw err;
    }

    const remotePath = remote_path
        ? sanitizeRemotePath(remote_path)
        : buildRemotePath(folder, filename);

    await ensureParentDirectory(remotePath);

    const client = getWebdavClient();
    const doOverwrite = parseOverwriteFlag(overwrite);
    const pathForUpload = doOverwrite
        ? remotePath
        : uniqueRemotePathFromBase(remotePath);
    let targetPath;
    try {
        targetPath = await putRemoteFileContentsResilient(
            client,
            pathForUpload,
            buffer,
            doOverwrite
        );
    } catch (uploadErr) {
        throw enrichWebdavError(uploadErr);
    }

    const mimeType = getMimeType(targetPath);
    const storedFilename = targetPath.split('/').pop() || filename;

    return {
        remote_path: targetPath,
        filename: storedFilename,
        size: buffer.length,
        mime_type: mimeType,
        is_image: isImageMime(mimeType),
        view_url: `/storage/file?path=${encodeURIComponent(targetPath)}`,
    };
}

async function readFile(remotePath) {
    const safePath = sanitizeRemotePath(remotePath);
    const client = getWebdavClient();
    const exists = await client.exists(safePath);

    if (!exists) {
        const err = new Error('Archivo no encontrado');
        err.code = 'NOT_FOUND';
        throw err;
    }

    const contents = await client.getFileContents(safePath);
    const buffer = Buffer.isBuffer(contents) ? contents : Buffer.from(contents);
    const mimeType = getMimeType(safePath);

    return {
        buffer,
        mime_type: mimeType,
        remote_path: safePath,
        size: buffer.length,
        is_image: isImageMime(mimeType),
    };
}

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

function isImagePath(remotePath) {
    const ext = path.extname(String(remotePath || '')).toLowerCase();
    return IMAGE_EXTS.includes(ext);
}

function parsePhotoMonth(item) {
    const name = String(item.basename || item.path || '');
    const fromName = name.match(/(?:^|[^\d])(\d{1,2})[-_](\d{1,2})[-_](\d{2}|\d{4})(?:[^\d]|$)/);
    if (fromName) {
        const dd = Number(fromName[1]);
        const mm = Number(fromName[2]);
        let yy = Number(fromName[3]);
        if (yy < 100) yy += 2000;
        if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
            return { year: yy, month: mm, source: 'filename' };
        }
    }

    if (item.lastmod) {
        const d = new Date(item.lastmod);
        if (!Number.isNaN(d.getTime())) {
            return { year: d.getFullYear(), month: d.getMonth() + 1, source: 'lastmod' };
        }
    }

    return { year: 0, month: 0, source: 'unknown' };
}

async function listDirectoryRecursive(folder) {
    const client = getWebdavClient();
    const base = sanitizeRemotePath(folder || DEFAULT_FOLDER);
    const results = [];

    async function walk(dir) {
        let items = [];
        const listPath = isPcloudServer(getStorageConfig().server)
            ? collectionPathForPropfind(dir)
            : dir;
        try {
            if (!isPcloudServer(getStorageConfig().server)) {
                const exists = await client.exists(dir);
                if (!exists) return;
            }
            items = await client.getDirectoryContents(listPath);
        } catch (err) {
            return;
        }

        for (const item of items) {
            const filename = item.filename || item.basename;
            if (item.type === 'directory') {
                await walk(filename);
                continue;
            }
            results.push({
                path: filename,
                basename: item.basename || String(filename).split('/').pop(),
                size: Number(item.size) || 0,
                lastmod: item.lastmod || '',
                mime: item.mime || getMimeType(filename),
            });
        }
    }

    await walk(base);
    return results;
}

async function listPhotos({ folders }) {
    const dirs = Array.isArray(folders) && folders.length
        ? folders
        : [DEFAULT_FOLDER, '/XELASOL'];
    const seen = new Set();
    const photos = [];

    for (const folder of dirs) {
        const items = await listDirectoryRecursive(folder);
        items.forEach((item) => {
            if (!isImagePath(item.path) || seen.has(item.path)) return;
            seen.add(item.path);
            const when = parsePhotoMonth(item);
            photos.push({
                ...item,
                year: when.year,
                month: when.month,
            });
        });
    }

    return photos;
}

function groupPhotosByMonth(photos) {
    const map = {};
    (photos || []).forEach((p) => {
        const key = `${p.year}-${String(p.month).padStart(2, '0')}`;
        if (!map[key]) {
            map[key] = {
                year: p.year,
                month: p.month,
                key,
                count: 0,
                size: 0,
                files: [],
            };
        }
        map[key].count += 1;
        map[key].size += Number(p.size) || 0;
        map[key].files.push(p.path);
    });

    return Object.values(map).sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.month - a.month;
    });
}

async function deleteMany(remotePaths) {
    const paths = Array.isArray(remotePaths) ? remotePaths : [];
    let deleted = 0;
    let failed = 0;
    const errors = [];

    for (const remotePath of paths) {
        try {
            const result = await deleteFile({ remote_path: remotePath });
            if (result.deleted) deleted += 1;
            else failed += 1;
        } catch (err) {
            failed += 1;
            errors.push({ path: remotePath, error: err.message });
        }
    }

    return { deleted, failed, errors };
}

async function deleteFile({ filename, folder, remote_path }) {
    const remotePath = remote_path
        ? sanitizeRemotePath(remote_path)
        : buildRemotePath(folder, filename);

    const client = getWebdavClient();
    const exists = await client.exists(remotePath);

    if (!exists) {
        return {
            ok: true,
            deleted: false,
            remote_path: remotePath,
            reason: 'NOT_FOUND',
        };
    }

    await client.deleteFile(remotePath);

    return {
        ok: true,
        deleted: true,
        remote_path: remotePath,
    };
}

module.exports = {
    DEFAULT_FOLDER,
    parseOverwriteFlag,
    uploadFromHex,
    uploadFromBuffer,
    readFile,
    deleteFile,
    deleteMany,
    listPhotos,
    groupPhotosByMonth,
    getMimeType,
    isImageMime,
    sanitizeRemotePath,
    parseHexToBuffer,
    getWebdavClient,
    resetWebdavClient,
    probeWebdavConnection,
    runWebdavSelfTest,
    diagnoseStorageFolder,
    remoteCollectionVisible,
    enrichWebdavError,
};
