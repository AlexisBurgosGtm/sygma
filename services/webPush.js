'use strict';

const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

const KEYS_PATH = path.join(__dirname, '..', 'data', 'vapid-keys.json');

let cachedKeys = null;

function loadOrCreateKeys() {
    if (cachedKeys) return cachedKeys;

    const envPub = process.env.VAPID_PUBLIC_KEY;
    const envPriv = process.env.VAPID_PRIVATE_KEY;
    if (envPub && envPriv) {
        cachedKeys = {
            publicKey: envPub,
            privateKey: envPriv,
            subject: process.env.VAPID_SUBJECT || 'mailto:pym.notificaciones@gmail.com',
        };
        return cachedKeys;
    }

    try {
        if (fs.existsSync(KEYS_PATH)) {
            const parsed = JSON.parse(fs.readFileSync(KEYS_PATH, 'utf8'));
            if (parsed && parsed.publicKey && parsed.privateKey) {
                cachedKeys = {
                    publicKey: parsed.publicKey,
                    privateKey: parsed.privateKey,
                    subject: parsed.subject || 'mailto:pym.notificaciones@gmail.com',
                };
                return cachedKeys;
            }
        }
    } catch (e) {
        console.error('[web-push] no se pudo leer vapid-keys.json', e && e.message ? e.message : e);
    }

    const generated = webpush.generateVAPIDKeys();
    cachedKeys = {
        publicKey: generated.publicKey,
        privateKey: generated.privateKey,
        subject: 'mailto:pym.notificaciones@gmail.com',
    };
    try {
        const dir = path.dirname(KEYS_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(KEYS_PATH, JSON.stringify(cachedKeys, null, 2), 'utf8');
    } catch (e) {
        console.error('[web-push] no se pudo guardar vapid-keys.json', e && e.message ? e.message : e);
    }
    return cachedKeys;
}

function getPublicKey() {
    return loadOrCreateKeys().publicKey;
}

function configure() {
    const keys = loadOrCreateKeys();
    webpush.setVapidDetails(keys.subject, keys.publicKey, keys.privateKey);
}

async function sendToSubscription(sub, payload) {
    configure();
    const subscription = {
        endpoint: sub.ENDPOINT || sub.endpoint,
        keys: {
            p256dh: sub.P256DH || (sub.keys && sub.keys.p256dh),
            auth: sub.AUTH || (sub.keys && sub.keys.auth),
        },
    };
    const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return webpush.sendNotification(subscription, body, { TTL: 60 * 60 * 12 });
}

module.exports = {
    getPublicKey,
    sendToSubscription,
};
