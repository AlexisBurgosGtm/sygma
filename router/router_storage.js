const express = require('express');
const router = express.Router();
const storage = require('../services/webdavStorage');

function sendError(res, err, fallbackMessage) {
    const status = err.code === 'NOT_FOUND'
        ? 404
        : (err.code === 'INVALID_HEX' || err.code === 'INVALID_PATH' || err.code === 'INVALID_FILENAME' ? 400 : 500);

    res.status(status).send({
        ok: false,
        error: err.message || fallbackMessage || 'error',
        code: err.code || 'ERROR',
    });
}

router.post('/upload', async (req, res) => {
    try {
        const { hex, filename, folder, remote_path, overwrite } = req.body || {};

        if (!hex) {
            return res.status(400).send({ ok: false, error: 'hex requerido', code: 'INVALID_HEX' });
        }

        if (!filename && !remote_path) {
            return res.status(400).send({ ok: false, error: 'filename o remote_path requerido', code: 'INVALID_FILENAME' });
        }

        const result = await storage.uploadFromHex({
            hex,
            filename,
            folder,
            remote_path,
            overwrite,
        });

        res.send({
            ok: true,
            ...result,
        });
    } catch (err) {
        console.error('[storage/upload]', err.message);
        sendError(res, err, 'No se pudo subir el archivo');
    }
});

router.get('/file', async (req, res) => {
    try {
        const remotePath = req.query.path || req.query.remote_path;
        if (!remotePath) {
            return res.status(400).send('path requerido');
        }

        const { buffer, mime_type, remote_path } = await storage.readFile(remotePath);

        res.setHeader('Content-Type', mime_type);
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Cache-Control', 'private, max-age=300');
        res.setHeader('Content-Disposition', `inline; filename="${remote_path.split('/').pop()}"`);
        res.send(buffer);
    } catch (err) {
        console.error('[storage/file GET]', err.message);
        if (err.code === 'NOT_FOUND') {
            return res.status(404).send('Archivo no encontrado');
        }
        res.status(500).send('error');
    }
});

router.post('/file', async (req, res) => {
    try {
        const { remote_path, as_base64 } = req.body || {};
        if (!remote_path) {
            return res.status(400).send({ ok: false, error: 'remote_path requerido', code: 'INVALID_PATH' });
        }

        const file = await storage.readFile(remote_path);

        if (as_base64) {
            return res.send({
                ok: true,
                remote_path: file.remote_path,
                mime_type: file.mime_type,
                size: file.size,
                is_image: file.is_image,
                data_base64: file.buffer.toString('base64'),
            });
        }

        res.send({
            ok: true,
            remote_path: file.remote_path,
            mime_type: file.mime_type,
            size: file.size,
            is_image: file.is_image,
            view_url: `/storage/file?path=${encodeURIComponent(file.remote_path)}`,
        });
    } catch (err) {
        console.error('[storage/file POST]', err.message);
        sendError(res, err, 'No se pudo leer el archivo');
    }
});

router.post('/status', async (req, res) => {
    try {
        const client = storage.getWebdavClient();
        const rootExists = await client.exists('/');

        res.send({
            ok: true,
            connected: !!rootExists,
            default_folder: storage.DEFAULT_FOLDER,
        });
    } catch (err) {
        console.error('[storage/status]', err.message);
        sendError(res, err, 'Almacenamiento no disponible');
    }
});

module.exports = router;
