'use strict';

const sessions = new Map();

function clean(v, max) {
    return String(v == null ? '' : v).trim().slice(0, max || 120);
}

function upsert(socketId, data) {
    const id = String(socketId || '');
    if (!id) return;
    const prev = sessions.get(id) || {};
    const usuario = clean(data && data.usuario, 80);
    const identificado = !!usuario;
    sessions.set(id, {
        id,
        usuario,
        codigo: Number(data && data.codigo) || 0,
        nivel: Number(data && data.nivel) || 0,
        empresa: clean(data && data.empresa, 80),
        empnit: clean(data && data.empnit, 50),
        super: !!(data && data.super),
        identificado,
        desde: prev.desde || Date.now(),
        visto: Date.now()
    });
}

function markAnonymous(socketId) {
    const id = String(socketId || '');
    if (!id) return;
    const prev = sessions.get(id) || { id, desde: Date.now() };
    sessions.set(id, {
        id,
        usuario: '',
        codigo: 0,
        nivel: 0,
        empresa: '',
        empnit: '',
        super: false,
        identificado: false,
        desde: prev.desde || Date.now(),
        visto: Date.now()
    });
}

function remove(socketId) {
    sessions.delete(String(socketId || ''));
}

function snapshot() {
    const rows = Array.from(sessions.values());
    const grouped = {};
    let enLogin = 0;
    rows.forEach((s) => {
        if (!s.identificado) {
            enLogin += 1;
            return;
        }
        const key = s.super
            ? 'super'
            : (String(s.codigo || '') + '|' + String(s.empnit || '') + '|' + String(s.usuario || ''));
        if (!grouped[key]) {
            grouped[key] = {
                usuario: s.usuario,
                codigo: s.codigo,
                nivel: s.nivel,
                empresa: s.empresa,
                empnit: s.empnit,
                super: s.super,
                sesiones: 0,
                desde: s.desde
            };
        }
        grouped[key].sesiones += 1;
        if (s.desde < grouped[key].desde) grouped[key].desde = s.desde;
    });
    const usuarios = Object.keys(grouped).map((k) => grouped[k])
        .sort((a, b) => String(a.usuario).localeCompare(String(b.usuario), 'es'));
    return {
        total_sesiones: rows.length,
        total_usuarios: usuarios.length,
        en_login: enLogin,
        usuarios
    };
}

function socketIdsSuper() {
    const ids = [];
    sessions.forEach((s, id) => {
        if (s && s.super) ids.push(id);
    });
    return ids;
}

module.exports = {
    upsert,
    markAnonymous,
    remove,
    snapshot,
    socketIdsSuper
};
