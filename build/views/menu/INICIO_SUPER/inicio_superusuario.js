'use strict';

var super_fotoMonths = [];
var super_conectadosTimer = null;
var super_conectadosHandler = null;

function super_mesNombre(mes) {
    const nombres = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return nombres[Number(mes)] || String(mes);
}

function super_fmtMb(n) {
    const v = Number(n) || 0;
    return v.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MB';
}

function super_perfilTxt(r) {
    if (r && r.super) return 'Super usuario';
    switch (Number(r && r.nivel)) {
        case 1: return 'Gerencia';
        case 2: return 'Supervisor';
        case 3: return 'Vendedor';
        case 4: return 'Despacho';
        case 5: return 'Digitador';
        case 6: return 'Compras';
        case 7: return 'Proveedor';
        case 8: return 'Vendedor';
        case 9: return 'Mercaderista';
        default: return 'Usuario';
    }
}

function super_fmtHace(ts) {
    const s = Math.max(0, Math.floor((Date.now() - Number(ts || 0)) / 1000));
    if (s < 45) return 'ahora';
    if (s < 3600) return Math.floor(s / 60) + ' min';
    const h = Math.floor(s / 3600);
    return h + (h === 1 ? ' h' : ' h');
}

function super_esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function super_renderConectados(data) {
    const box = document.getElementById('superOnlineLista');
    const lbU = document.getElementById('lbSuperOnlineUsers');
    const lbS = document.getElementById('lbSuperOnlineSes');
    const lbL = document.getElementById('lbSuperOnlineLogin');
    const snap = data || {};
    if (lbU) lbU.textContent = String(Number(snap.total_usuarios) || 0);
    if (lbS) lbS.textContent = String(Number(snap.total_sesiones) || 0);
    if (lbL) lbL.textContent = String(Number(snap.en_login) || 0);
    if (!box) return;
    const rows = snap.usuarios || [];
    if (!rows.length) {
        box.innerHTML = '<div class="text-muted small">Nadie con sesión iniciada. Si hay números en “En login”, están en la pantalla de acceso.</div>';
        return;
    }
    box.innerHTML = rows.map((r) => `
        <div class="super-online-row">
            <span class="super-online-dot"></span>
            <div class="flex-grow-1 min-width-0">
                <div class="negrita">${super_esc(r.usuario)}</div>
                <small class="text-muted">${super_esc(super_perfilTxt(r))} · ${super_esc(r.empresa || r.empnit || '—')}</small>
            </div>
            <div class="text-right small">
                <div class="negrita">${Number(r.sesiones) || 1} ses.</div>
                <span class="text-muted">${super_esc(super_fmtHace(r.desde))}</span>
            </div>
        </div>
    `).join('');
}

function super_cargarConectados() {
    if (!GlobalSuperUsuario) return;
    axios.post('/super/conectados', { super_key: GlobalSuperKey, token: typeof TOKEN !== 'undefined' ? TOKEN : '' })
        .then((res) => {
            const data = res.data || {};
            if (!data.ok) throw new Error(data.error || 'error');
            super_renderConectados(data);
        })
        .catch(() => {
            const box = document.getElementById('superOnlineLista');
            if (box) box.innerHTML = '<div class="text-muted small">No se pudieron leer las conexiones.</div>';
        });
}

function super_startConectados() {
    super_stopConectados();
    super_cargarConectados();
    super_conectadosTimer = setInterval(super_cargarConectados, 8000);
    if (typeof socket !== 'undefined' && socket && typeof socket.on === 'function') {
        super_conectadosHandler = (snap) => super_renderConectados(snap);
        socket.on('usuarios_conectados', super_conectadosHandler);
    }
}

function super_stopConectados() {
    if (super_conectadosTimer) {
        clearInterval(super_conectadosTimer);
        super_conectadosTimer = null;
    }
    if (super_conectadosHandler && typeof socket !== 'undefined' && socket && typeof socket.off === 'function') {
        socket.off('usuarios_conectados', super_conectadosHandler);
    }
    super_conectadosHandler = null;
}

function super_busy(on, label) {
    const el = document.getElementById('superBusy');
    if (!el) return;
    const text = el.querySelector('.sygma-loader__label');
    if (text) text.textContent = label || 'Cargando';
    el.classList.toggle('hidden', !on);
    el.setAttribute('aria-hidden', on ? 'false' : 'true');
}

function getView() {
    const view = {
        body: () => `
            <div class="super-page">
                <div class="proveedor-header-card card shadow-sm mb-3">
                    <div class="card-body py-2 px-3 d-flex align-items-center flex-wrap">
                        <div class="col-auto pr-2">
                            <img src="./favicon.png" width="44" height="44" alt="Logo">
                        </div>
                        <div class="flex-grow-1">
                            <h5 class="negrita text-white mb-0">INICIO SUPER USUARIO</h5>
                            <small class="text-white-50 negrita d-block">Administrador · no figura en listas</small>
                        </div>
                        <button type="button" class="btn btn-sm btn-light negrita" id="btnSuperSalir">
                            <i class="fal fa-sign-out mr-1"></i> Cerrar sesión
                        </button>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 col-lg-7 mb-3">
                        ${view.card_fotos()}
                    </div>
                    <div class="col-12 col-lg-5 mb-3">
                        ${view.card_db()}
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 mb-3">
                        ${view.card_conectados()}
                    </div>
                </div>
            </div>
            <div id="superBusy" class="calculos-cargas-overlay hidden" aria-hidden="true">
                ${typeof GlobalLoader !== 'undefined' ? GlobalLoader : '<div class="text-center text-white">Cargando...</div>'}
            </div>
        `,
        card_fotos: () => `
            <div class="card card-rounded shadow super-card h-100">
                <div class="card-body">
                    <div class="d-flex align-items-start mb-3">
                        <span class="super-card__icon"><i class="fal fa-images"></i></span>
                        <div>
                            <h5 class="negrita mb-0">Fotos WebDAV</h5>
                            <small class="text-muted">Lee todas las fotos y elimina por bloque de mes</small>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6 col-md-4">
                            <div class="form-group mb-2">
                                <label class="text-secondary small mb-1">Mes</label>
                                <select class="form-control form-control-sm negrita" id="cmbSuperMes"></select>
                            </div>
                        </div>
                        <div class="col-6 col-md-4">
                            <div class="form-group mb-2">
                                <label class="text-secondary small mb-1">Año</label>
                                <select class="form-control form-control-sm negrita" id="cmbSuperAnio"></select>
                            </div>
                        </div>
                        <div class="col-12 col-md-4 d-flex align-items-end">
                            <button type="button" class="btn btn-info btn-sm negrita mb-2 w-100" id="btnSuperLeerFotos">
                                <i class="fal fa-search mr-1"></i> Leer fotos
                            </button>
                        </div>
                    </div>
                    <div id="superFotosResumen" class="small text-muted mb-2">Seleccione mes/año y pulse Leer fotos.</div>
                    <div id="superFotosLista" class="super-fotos-lista"></div>
                </div>
            </div>
        `,
        card_db: () => `
            <div class="card card-rounded shadow super-card h-100">
                <div class="card-body">
                    <div class="d-flex align-items-start mb-3">
                        <span class="super-card__icon super-card__icon--db"><i class="fal fa-database"></i></span>
                        <div>
                            <h5 class="negrita mb-0">Espacio de base de datos</h5>
                            <small class="text-muted" id="lbSuperDbNombre">SQL Server</small>
                        </div>
                    </div>
                    <div class="super-db-row mb-3">
                        <div class="d-flex justify-content-between small mb-1">
                            <span class="negrita">Tamaño total</span>
                            <span id="lbSuperDbTotal">-- MB</span>
                        </div>
                        <div class="super-db-bar">
                            <div class="super-db-bar__fill super-db-bar__fill--total" id="barSuperDbTotal"></div>
                        </div>
                    </div>
                    <div class="super-db-row mb-3">
                        <div class="d-flex justify-content-between small mb-1">
                            <span class="negrita">Espacio usado</span>
                            <span id="lbSuperDbUsed">-- MB</span>
                        </div>
                        <div class="super-db-bar">
                            <div class="super-db-bar__fill super-db-bar__fill--used" id="barSuperDbUsed"></div>
                        </div>
                    </div>
                    <div class="super-db-available">
                        Disponible: <strong id="lbSuperDbFree">-- MB</strong>
                    </div>
                </div>
            </div>
        `,
        card_conectados: () => `
            <div class="card card-rounded shadow super-card">
                <div class="card-body">
                    <div class="d-flex align-items-start justify-content-between flex-wrap mb-3">
                        <div class="d-flex align-items-start">
                            <span class="super-card__icon super-card__icon--online"><i class="fal fa-wifi"></i></span>
                            <div>
                                <h5 class="negrita mb-0">Usuarios conectados</h5>
                                <small class="text-muted">Sesiones en vivo en la aplicación</small>
                            </div>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-info negrita" id="btnSuperConectados">
                            <i class="fal fa-sync mr-1"></i> Actualizar
                        </button>
                    </div>
                    <div class="d-flex flex-wrap super-online-kpis mb-3">
                        <div class="super-online-kpi">
                            <div class="super-online-kpi__n" id="lbSuperOnlineUsers">0</div>
                            <div class="super-online-kpi__l">Usuarios</div>
                        </div>
                        <div class="super-online-kpi">
                            <div class="super-online-kpi__n" id="lbSuperOnlineSes">0</div>
                            <div class="super-online-kpi__l">Sesiones</div>
                        </div>
                        <div class="super-online-kpi">
                            <div class="super-online-kpi__n" id="lbSuperOnlineLogin">0</div>
                            <div class="super-online-kpi__l">En login</div>
                        </div>
                    </div>
                    <div id="superOnlineLista" class="super-online-lista">
                        <div class="text-muted small">Cargando conexiones...</div>
                    </div>
                </div>
            </div>
        `,
    };

    root.innerHTML = view.body();
}

function super_renderFotos(months) {
    const box = document.getElementById('superFotosLista');
    const resumen = document.getElementById('superFotosResumen');
    super_fotoMonths = months || [];

    const selMes = Number(document.getElementById('cmbSuperMes')?.value);
    const selAnio = Number(document.getElementById('cmbSuperAnio')?.value);
    const totalFotos = super_fotoMonths.reduce((a, m) => a + (m.count || 0), 0);
    const totalMb = super_fotoMonths.reduce((a, m) => a + (Number(m.size_mb) || 0), 0);

    if (!super_fotoMonths.length) {
        if (resumen) resumen.textContent = 'No se encontraron fotos en WebDAV.';
        if (box) box.innerHTML = '<div class="text-muted small">Sin bloques para mostrar.</div>';
        return;
    }

    if (resumen) {
        resumen.textContent = `${totalFotos} foto(s) · ${super_fmtMb(totalMb)} en ${super_fotoMonths.length} bloque(s) de mes.`;
    }

    if (!box) return;
    box.innerHTML = super_fotoMonths.map((m) => {
        const selected = Number(m.month) === selMes && Number(m.year) === selAnio;
        const unknown = !m.year || !m.month;
        const titulo = unknown ? 'Sin fecha' : `${super_mesNombre(m.month)} ${m.year}`;
        return `
            <div class="super-foto-block ${selected ? 'is-selected' : ''}">
                <div>
                    <div class="negrita">${titulo}</div>
                    <small class="text-muted">${m.count} foto(s) · ${super_fmtMb(m.size_mb)}</small>
                </div>
                <button type="button" class="btn btn-sm btn-danger negrita" data-super-del-mes="${m.month}" data-super-del-anio="${m.year}" ${unknown ? 'disabled' : ''}>
                    <i class="fal fa-trash-alt mr-1"></i> Eliminar mes
                </button>
            </div>
        `;
    }).join('');
}

function super_leerFotos() {
    if (!GlobalSuperUsuario) return;
    super_busy(true, 'Leyendo fotos de WebDAV');
    axios.post('/storage/list-photos', { super_key: GlobalSuperKey })
        .then((res) => {
            const data = res.data || {};
            if (!data.ok) throw new Error(data.error || 'error');
            super_renderFotos(data.months || []);
        })
        .catch((err) => {
            F.AvisoError((err && err.message) || 'No se pudieron leer las fotos');
            super_renderFotos([]);
        })
        .then(() => super_busy(false));
}

function super_eliminarMes(year, month) {
    if (!GlobalSuperUsuario) return;
    const titulo = `${super_mesNombre(month)} ${year}`;
    F.Confirmacion(`¿Eliminar todas las fotos de ${titulo} en WebDAV? Esta acción no se puede deshacer.`)
        .then((ok) => {
            if (ok !== true) return;
            super_busy(true, `Eliminando fotos de ${titulo}`);
            axios.post('/storage/delete-photos-month', {
                super_key: GlobalSuperKey,
                year,
                month,
            })
                .then((res) => {
                    const data = res.data || {};
                    if (!data.ok) throw new Error(data.error || 'error');
                    F.Aviso(`Eliminadas: ${data.deleted || 0}. Fallidas: ${data.failed || 0}.`);
                    super_leerFotos();
                })
                .catch((err) => {
                    F.AvisoError((err && err.message) || 'No se pudieron eliminar las fotos');
                    super_busy(false);
                });
        });
}

function super_cargarDb() {
    if (!GlobalSuperUsuario) return;
    axios.post('/super/db-size', { super_key: GlobalSuperKey, token: typeof TOKEN !== 'undefined' ? TOKEN : '' })
        .then((res) => {
            const data = res.data || {};
            if (!data.ok) throw new Error(data.error || 'error');
            const total = Number(data.total_mb) || 0;
            const used = Number(data.used_mb) || 0;
            const free = Number(data.available_mb) || 0;
            const usedPct = total > 0 ? Math.min(100, Math.max(0, (used / total) * 100)) : 0;

            const nom = document.getElementById('lbSuperDbNombre');
            if (nom) nom.textContent = data.db_name || 'SQL Server';
            const lbT = document.getElementById('lbSuperDbTotal');
            const lbU = document.getElementById('lbSuperDbUsed');
            const lbF = document.getElementById('lbSuperDbFree');
            if (lbT) lbT.textContent = super_fmtMb(total);
            if (lbU) lbU.textContent = super_fmtMb(used);
            if (lbF) lbF.textContent = super_fmtMb(free);

            const barT = document.getElementById('barSuperDbTotal');
            const barU = document.getElementById('barSuperDbUsed');
            if (barT) barT.style.width = '100%';
            if (barU) barU.style.width = usedPct.toFixed(1) + '%';
        })
        .catch((err) => {
            const msg = (err && err.response && err.response.data && err.response.data.error)
                || (err && err.message)
                || 'No disponible';
            const lbF = document.getElementById('lbSuperDbFree');
            if (lbF) lbF.textContent = msg;
        });
}

function addListeners() {
    document.title = 'Super usuario';

    const cmbMes = document.getElementById('cmbSuperMes');
    const cmbAnio = document.getElementById('cmbSuperAnio');
    if (cmbMes) {
        cmbMes.innerHTML = F.ComboMeses();
        cmbMes.value = String(F.get_mes_curso());
    }
    if (cmbAnio) {
        cmbAnio.innerHTML = F.ComboAnio();
        cmbAnio.value = String(F.get_anio_curso());
    }

    document.getElementById('btnSuperSalir')?.addEventListener('click', () => Navegar.salir());
    document.getElementById('btnSuperLeerFotos')?.addEventListener('click', super_leerFotos);
    document.getElementById('btnSuperConectados')?.addEventListener('click', super_cargarConectados);
    document.getElementById('superFotosLista')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-super-del-mes]');
        if (!btn || btn.disabled) return;
        super_eliminarMes(Number(btn.getAttribute('data-super-del-anio')), Number(btn.getAttribute('data-super-del-mes')));
    });

    const refreshSel = () => {
        if (super_fotoMonths.length) super_renderFotos(super_fotoMonths);
    };
    cmbMes?.addEventListener('change', refreshSel);
    cmbAnio?.addEventListener('change', refreshSel);

    super_cargarDb();
    super_startConectados();
}

function initView() {
    getView();
    addListeners();
}

function destroyView() {
    super_fotoMonths = [];
    super_busy(false);
    super_stopConectados();
}
