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
    readFile,
    deleteFile,
    getMimeType,
    isImageMime,
    sanitizeRemotePath,
    parseHexToBuffer,
    getWebdavClient,
    resetWebdavClient,
};
