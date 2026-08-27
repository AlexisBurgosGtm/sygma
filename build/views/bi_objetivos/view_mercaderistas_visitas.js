function puedeCambiarSucursalMerc() {
    const n = Number(GlobalNivelUsuario);
    return n === 1 || n === 5;
}

function getSucursalMercMenu() {
    return document.getElementById('cmbSucursalMercMenu')?.value || GlobalEmpnit || '%';
}

function ensureMercVisitasCore() {
    if (window.MercVisitasCore) return Promise.resolve();
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = '../views/shared/view_mercaderistas_visitas_core.js?_se=' + Date.now();
        s.onload = resolve;
        s.onerror = () => reject(new Error('core'));
        document.head.appendChild(s);
    });
}

function getView() {
    const view = {
        body: () => {
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="card card-rounded shadow mb-2">
                        <div class="card-body p-2 p-md-3">
                            <div class="row align-items-end">
                                <div class="col-12 col-md-5 mb-2 mb-md-0">
                                    <label class="negrita text-secondary small mb-1" for="cmbSucursalMercMenu">Sucursal</label>
                                    <select class="form-control negrita" id="cmbSucursalMercMenu"></select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="mercMenuHost"></div>
                    <button type="button" class="btn btn-circle btn-xl btn-secondary btn-bottom-l hand shadow" data-spa-action="inicio">
                        <i class="fal fa-home"></i>
                    </button>
                </div>
            `;
        },
    };
    root.innerHTML = view.body();
}

function cargarSucursalesMercMenu() {
    const cmb = document.getElementById('cmbSucursalMercMenu');
    if (!cmb) return Promise.resolve();
    const puedeCambiar = puedeCambiarSucursalMerc();

    return GF.get_data_empresas()
        .then((data) => {
            let str = puedeCambiar ? '<option value="%">TODAS LAS SEDES</option>' : '';
            (data.recordset || []).forEach((r) => {
                str += `<option value="${r.EMPNIT}">${r.NOMBRE}</option>`;
            });
            cmb.innerHTML = str || `<option value="${GlobalEmpnit || '%'}">${GlobalNomEmpresa || 'Sede'}</option>`;
            cmb.value = GlobalEmpnit || '%';
            cmb.disabled = !puedeCambiar;
        })
        .catch(() => {
            cmb.innerHTML = `<option value="${GlobalEmpnit || '%'}">${GlobalNomEmpresa || 'Sede'}</option>`;
            cmb.value = GlobalEmpnit || '%';
            cmb.disabled = !puedeCambiar;
        });
}

function mountMercVisitasCore() {
    const host = document.getElementById('mercMenuHost');
    if (!host || !window.MercVisitasCore) return;
    const savedRoot = root;
    root = host;
    MercVisitasCore.init({
        prefix: 'MenuMerc',
        getSucursal: getSucursalMercMenu,
        registerRefresh: (fn) => {
            window._menuMercRefresh = fn;
        },
    });
    root = savedRoot;
}

function addListeners() {
    document.getElementById('cmbSucursalMercMenu')?.addEventListener('change', () => {
        if (typeof window._menuMercRefresh === 'function') window._menuMercRefresh();
    });
}

function initView() {
    if (window.MercVisitasCore) {
        try { MercVisitasCore.destroy(); } catch (e) { /* ignore */ }
    }
    window._menuMercRefresh = null;
    getView();
    ensureMercVisitasCore()
        .then(() => cargarSucursalesMercMenu())
        .then(() => {
            mountMercVisitasCore();
            addListeners();
        })
        .catch(() => {
            const host = document.getElementById('mercMenuHost');
            if (host) {
                host.innerHTML = '<div class="text-center text-danger py-4">No se pudo cargar visitas de mercaderistas</div>';
            }
        });
}

function destroyView() {
    window._menuMercRefresh = null;
    if (window.MercVisitasCore) {
        try { MercVisitasCore.destroy(); } catch (e) { /* ignore */ }
    }
}
