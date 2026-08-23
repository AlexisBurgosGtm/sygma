function getView() {
    const view = {
        body: () => `
            <div class="col-12 p-0">
                <div class="card card-rounded shadow border-0">
                    <div class="card-body p-2 p-md-4">
                        <div class="row align-items-end mb-3">
                            <div class="col-12 col-md-7 mb-2 mb-md-0">
                                <h4 class="negrita text-base mb-1">Cambios de datos Clientes</h4>
                                <small class="text-muted">Solicitudes tipo CAMBIO DATOS CLIENTE</small>
                            </div>
                            <div class="col-12 col-md-5">
                                <label class="negrita text-secondary small mb-1" for="cmbSolCambioRealizada">Estado</label>
                                <select class="form-control negrita text-base" id="cmbSolCambioRealizada">
                                    <option value="NO" selected>PENDIENTES (NO)</option>
                                    <option value="SI">REALIZADAS (SI)</option>
                                </select>
                            </div>
                        </div>
                        <div id="tblSolicitudesCambioCliente"></div>
                    </div>
                </div>
            </div>
        `,
    };
    root.innerHTML = view.body();
}

function supervisor_sol_cambio_get_empnit() {
    if (typeof supervisor_getSucursal === 'function') {
        const s = supervisor_getSucursal();
        if (s && s !== '%') return s;
    }
    return GlobalEmpnit || '';
}

function supervisor_sol_cambio_parse_detalles(raw) {
    if (!raw) return {};
    if (typeof raw === 'object') return raw;
    try {
        return JSON.parse(String(raw));
    } catch (e) {
        return {};
    }
}

function supervisor_sol_cambio_esc_html(v) {
    return String(v ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function supervisor_sol_cambio_cargar() {
    const container = document.getElementById('tblSolicitudesCambioCliente');
    if (!container) return;

    const realizada = document.getElementById('cmbSolCambioRealizada')?.value || 'NO';
    const empnit = supervisor_sol_cambio_get_empnit();
    container.innerHTML = GlobalLoader;

    axios.post('/clientes/solicitudes_cambio_cliente_list', {
        token: TOKEN,
        empnit,
        realizada,
    })
        .then((response) => {
            if (response.data === 'error') {
                container.innerHTML = '<div class="text-center text-muted py-4">Error al cargar solicitudes</div>';
                return;
            }
            const rows = response.data.recordset || [];
            if (!rows.length) {
                container.innerHTML = '<div class="text-center text-muted py-4">No hay solicitudes para mostrar</div>';
                return;
            }

            let str = '';
            rows.forEach((r) => {
                const det = supervisor_sol_cambio_parse_detalles(r.DETALLES);
                const id = r.ID;
                const puedeAceptar = String(r.REALIZADA || '').toUpperCase() !== 'SI';
                const fechaTxt = r.FECHA
                    ? (typeof F.convertDateNormal === 'function' ? F.convertDateNormal(r.FECHA) : String(r.FECHA).replace('T00:00:00.000Z', ''))
                    : '';

                str += `
                <div class="card shadow-sm mb-2 border">
                    <div class="card-body p-2 p-md-3">
                        <div class="d-flex justify-content-between align-items-start flex-wrap">
                            <div class="pr-2 mb-2">
                                <div class="negrita text-base">${supervisor_sol_cambio_esc_html(det.nombre || 'Sin nombre')}</div>
                                <small class="text-muted d-block">Cód. ${supervisor_sol_cambio_esc_html(det.codcliente || '')} · NIT ${supervisor_sol_cambio_esc_html(det.nit || '')}</small>
                                <small class="d-block">Negocio: ${supervisor_sol_cambio_esc_html(det.negocio || '')}</small>
                                <small class="d-block">${supervisor_sol_cambio_esc_html(det.direccion || '')}</small>
                                <small class="d-block text-muted">Ref: ${supervisor_sol_cambio_esc_html(det.referencia || '')}</small>
                                <small class="d-block">${supervisor_sol_cambio_esc_html(det.municipio || '')}, ${supervisor_sol_cambio_esc_html(det.departamento || '')}</small>
                                <small class="d-block text-info negrita mt-1">Solicitó: ${supervisor_sol_cambio_esc_html(r.USUARIO || '')} · ${fechaTxt}</small>
                                <small class="d-block">Estado: <span class="negrita ${puedeAceptar ? 'text-danger' : 'text-success'}">${supervisor_sol_cambio_esc_html(r.REALIZADA || '')}</span></small>
                            </div>
                            <div class="mb-1">
                                ${puedeAceptar ? `
                                <button type="button" class="btn btn-success hand shadow negrita"
                                    id="btnAceptarSolCambio${id}"
                                    onclick="supervisor_sol_cambio_aceptar(${Number(id)}, this)">
                                    <i class="fal fa-check mr-1"></i> Aceptar cambio
                                </button>` : `
                                <span class="badge badge-success p-2">Realizada</span>`}
                            </div>
                        </div>
                    </div>
                </div>`;
            });
            container.innerHTML = str;
        })
        .catch(() => {
            container.innerHTML = '<div class="text-center text-muted py-4">No se cargaron las solicitudes</div>';
        });
}

function supervisor_sol_cambio_aceptar(id, btnEl) {
    const btn = btnEl || document.getElementById(`btnAceptarSolCambio${id}`);
    const htmlOriginal = btn ? btn.innerHTML : '';

    F.Confirmacion('¿Desea ACEPTAR esta solicitud y actualizar los datos del cliente?')
        .then((ok) => {
            if (!ok) return;

            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fal fa-spinner fa-spin mr-1"></i> Procesando...';
            }
            const cmb = document.getElementById('cmbSolCambioRealizada');
            if (cmb) cmb.disabled = true;
            document.getElementById('tblSolicitudesCambioCliente')?.classList.add('opacity-50');
            document.body.style.pointerEvents = 'none';

            axios.post('/clientes/solicitudes_cambio_cliente_aceptar', {
                token: TOKEN,
                id,
                empnit: supervisor_sol_cambio_get_empnit(),
            })
                .then((response) => {
                    if (response.data === 'error') throw new Error('error');
                    const rs = response.data?.recordset?.[0];
                    if (rs && String(rs.RESULT || '').toLowerCase() === 'error') {
                        throw new Error(rs.MSG || 'error');
                    }
                    F.Aviso('Cambio aplicado correctamente');
                    supervisor_sol_cambio_cargar();
                })
                .catch((err) => {
                    F.AvisoError(err?.message && err.message !== 'error'
                        ? err.message
                        : 'No se pudo aceptar la solicitud');
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = htmlOriginal || '<i class="fal fa-check mr-1"></i> Aceptar cambio';
                    }
                })
                .finally(() => {
                    document.body.style.pointerEvents = '';
                    if (cmb) cmb.disabled = false;
                    document.getElementById('tblSolicitudesCambioCliente')?.classList.remove('opacity-50');
                });
        });
}

function addListeners() {
    document.getElementById('cmbSolCambioRealizada')?.addEventListener('change', supervisor_sol_cambio_cargar);
    window.supervisor_solicitudes_cambio_refresh = supervisor_sol_cambio_cargar;
}

function initView() {
    getView();
    addListeners();
    supervisor_sol_cambio_cargar();
}

function destroyView() {
    window.supervisor_solicitudes_cambio_refresh = null;
}
