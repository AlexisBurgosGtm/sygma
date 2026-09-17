'use strict';

function sygma_push_urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (String(base64String).length % 4)) % 4);
    const base64 = (String(base64String) + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = window.atob(base64);
    const output = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
    return output;
}

function sygma_push_enabled() {
    if (window.SYGMA_IS_TAB_FRAME) return false;
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return false;
    if (Number(typeof GlobalNivelUsuario !== 'undefined' ? GlobalNivelUsuario : 0) === 0) return false;
    if (!GlobalEmpnit) return false;
    return true;
}

function sygma_push_subscribe() {
    if (!sygma_push_enabled()) return Promise.resolve(false);

    return navigator.serviceWorker.register('./sw.js')
        .then(() => navigator.serviceWorker.ready)
        .then((reg) => {
            const ask = (Notification.permission === 'granted')
                ? Promise.resolve('granted')
                : Notification.requestPermission();
            return ask.then((perm) => {
                if (perm !== 'granted') return null;
                return axios.post(GlobalUrlCalls + '/boletin/vapid', { token: TOKEN })
                    .then((res) => {
                        const key = res.data && res.data.publicKey;
                        if (!key) throw new Error('sin clave');
                        return { reg, key };
                    });
            });
        })
        .then((ctx) => {
            if (!ctx) return false;
            return ctx.reg.pushManager.getSubscription()
                .then((existing) => existing || ctx.reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: sygma_push_urlBase64ToUint8Array(ctx.key),
                }));
        })
        .then((sub) => {
            if (!sub) return false;
            const json = sub.toJSON();
            return axios.post(GlobalUrlCalls + '/boletin/subscribe', {
                token: TOKEN,
                sucursal: GlobalEmpnit,
                codemp: Number(GlobalCodUsuario) || 0,
                endpoint: json.endpoint,
                keys: json.keys || {},
            }).then((res) => !!(res.data && res.data.ok));
        })
        .catch((err) => {
            console.log('[push] no se pudo suscribir', err && err.message ? err.message : err);
            return false;
        });
}
