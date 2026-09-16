'use strict';

var super_fotoMonths = [];

function super_mesNombre(mes) {
    const nombres = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return nombres[Number(mes)] || String(mes);
}

function super_fmtMb(n) {
    const v = Number(n) || 0;
    return v.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MB';
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
}

function initView() {
    getView();
    addListeners();
}

function destroyView() {
    super_fotoMonths = [];
    super_busy(false);
}
