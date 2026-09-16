'use strict';

const SUPER_USER = 'ALEXIS BURGOS';
const SUPER_PASS = '2410201415082017';
const SUPER_KEY = 'sygma-root-key-2026';

function norm(v) {
    return String(v == null ? '' : v).trim();
}

function matchCredentials(usuario, clave) {
    return norm(usuario).toLowerCase() === SUPER_USER.toLowerCase()
        && String(clave) === SUPER_PASS;
}

function matchKey(key) {
    return String(key || '') === SUPER_KEY;
}

function requireSuper(req, res) {
    const key = req.body && req.body.super_key;
    if (matchKey(key)) return true;
    res.status(403).send({ ok: false, error: 'No autorizado' });
    return false;
}

module.exports = {
    SUPER_USER,
    SUPER_PASS,
    SUPER_KEY,
    matchCredentials,
    matchKey,
    requireSuper,
};
