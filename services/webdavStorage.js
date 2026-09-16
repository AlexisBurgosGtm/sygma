const path = require('path');
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

function getStorageConfig() {
    const server = String(process.env.STORAGE_SERVER || '').trim();
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
        });
    }
    return clientInstance;
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

async function ensureParentDirectory(remotePath) {
    const client = getWebdavClient();
    const lastSlash = remotePath.lastIndexOf('/');
    const dir = lastSlash > 0 ? remotePath.substring(0, lastSlash) : '';

    if (!dir) return;

    try {
        const exists = await client.exists(dir);
        if (!exists) {
            await client.createDirectory(dir, { recursive: true });
        }
    } catch (err) {
        try {
            await client.createDirectory(dir, { recursive: true });
        } catch (nestedErr) {
            const existsAfter = await client.exists(dir);
            if (!existsAfter) {
                throw nestedErr;
            }
        }
    }
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
    await client.putFileContents(remotePath, buffer, { overwrite: overwrite !== false });

    const mimeType = getMimeType(remotePath);

    return {
        remote_path: remotePath,
        size: buffer.length,
        mime_type: mimeType,
        is_image: isImageMime(mimeType),
        view_url: `/storage/file?path=${encodeURIComponent(remotePath)}`,
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
        try {
            const exists = await client.exists(dir);
            if (!exists) return;
            items = await client.getDirectoryContents(dir);
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
};
