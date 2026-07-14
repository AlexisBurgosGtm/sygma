var digitador_rutas_cache = [];
var digitador_rutas_tipo = 'clientes';
var digitador_rutas_listeners_ready = false;
var digitador_rutas_edit_codruta = null;

var DIGITADOR_RUTAS_CONFIG = {
    clientes: {
        label: 'Rutas Clientes',
        empleadoLabel: 'Vendedor',
        empleadoTipo: 3,
        selectUrl: '/clientes/select_rutas',
        insertUrl: '/clientes/insert_ruta',
        updateUrl: '/clientes/update_ruta',
        deleteUrl: '/clientes/delete_ruta',
        deleteMsg: 'Verifique que no tenga clientes o empleados asignados.',
    },
    mercaderistas: {
        label: 'Rutas Mercaderistas',
        empleadoLabel: 'Mercaderista',
        empleadoTipo: 9,
        selectUrl: '/clientes/select_rutas_mercaderistas',
        insertUrl: '/clientes/insert_ruta_mercaderista',
        updateUrl: '/clientes/update_ruta_mercaderista',
        deleteUrl: '/clientes/delete_ruta_mercaderista',
        deleteMsg: 'Verifique que no tenga mercaderistas asignados a esta ruta.',
    },
};

function digitador_rutas_sucursal() {
    const s = (typeof digitador_getSucursal === 'function')
        ? digitador_getSucursal()
        : (document.getElementById('cmbSucursalHeader')?.value || GlobalEmpnit);
    if (!s || s === '%' || String(s).toUpperCase() === 'TODAS') {
        return GlobalEmpnit || '';
    }
    return s;
}

function digitador_rutas_cfg() {
    return DIGITADOR_RUTAS_CONFIG[digitador_rutas_tipo] || DIGITADOR_RUTAS_CONFIG.clientes;
}

function digitador_rutas_api_select() {
    const cfg = digitador_rutas_cfg();
    return axios.post(cfg.selectUrl, {
        token: TOKEN,
        sucursal: digitador_rutas_sucursal(),
    }).then((res) => {
        if (res.status.toString() === '200' && res.data && res.data.toString() !== 'error') {
            return res.data.recordset || [];
        }
        throw new Error('error');
    });
}

function digitador_rutas_cargar_empleados() {
    const cfg = digitador_rutas_cfg();
    const cmb = document.getElementById('cmbDigitadorRutaEmpleado');
    if (!cmb) return Promise.resolve();

    cmb.innerHTML = '<option value="">Cargando...</option>';

    return GF.get_data_empleados_tipo(cfg.empleadoTipo)
        .then((data) => {
            let str = '';
            (data.recordset || []).forEach((r) => {
                str += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>`;
            });
            cmb.innerHTML = str || '<option value="0">SIN ASIGNAR</option>';
        })
        .catch(() => {
            cmb.innerHTML = '<option value="0">SIN ASIGNAR</option>';
        });
}

function digitador_rutas_limpiar_form() {
    digitador_rutas_edit_codruta = null;
    const txt = document.getElementById('txtDigitadorRutaNombre');
    if (txt) txt.value = '';
    const cmb = document.getElementById('cmbDigitadorRutaEmpleado');
    if (cmb && cmb.options.length) cmb.selectedIndex = 0;
}

function digitador_rutas_cargar_form(r) {
    digitador_rutas_edit_codruta = Number(r.CODRUTA);
    document.getElementById('txtDigitadorRutaNombre').value = r.RUTA || '';
    document.getElementById('cmbDigitadorRutaEmpleado').value = r.CODEMP || '0';
}

function digitador_rutas_bind_tabla() {
    const table = document.getElementById('tblDigitadorGestionRutas');
    if (!table || table.dataset.rutasBound === '1') return;
    table.dataset.rutasBound = '1';

    table.addEventListener('click', (e) => {
        const btnDel = e.target.closest('[data-digitador-ruta-del]');
        if (btnDel) {
            e.preventDefault();
            digitador_rutas_eliminar(Number(btnDel.dataset.codruta), btnDel.id);
            return;
        }
        const btnEdit = e.target.closest('[data-digitador-ruta-edit]');
        if (btnEdit) {
            e.preventDefault();
            digitador_rutas_editar(Number(btnEdit.dataset.codruta));
        }
    });
}

function digitador_rutas_editar(codruta) {
    const r = (digitador_rutas_cache || []).find((x) => Number(x.CODRUTA) === Number(codruta));
    if (!r) return;
    digitador_rutas_cargar_form(r);
    $('#modalDigitadorGestionRuta').modal('show');
}

function digitador_rutas_eliminar(codruta, idbtn) {
    const btn = document.getElementById(idbtn);
    const cfg = digitador_rutas_cfg();
    const r = (digitador_rutas_cache || []).find((x) => Number(x.CODRUTA) === Number(codruta));
    const nombre = r ? (r.RUTA || 'seleccionada') : 'seleccionada';

    F.Confirmacion(`¿Está seguro que desea eliminar la ruta ${nombre}?`)
        .then((value) => {
            if (value !== true) return;

            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fal fa-trash fa-spin"></i>';
            }

            axios.post(cfg.deleteUrl, {
                token: TOKEN,
                sucursal: digitador_rutas_sucursal(),
                codigo: codruta,
            })
                .then((response) => {
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = '<i class="fal fa-trash"></i>';
                    }
                    if (response.status.toString() === '200'
                        && response.data.toString() !== 'error'
                        && Number(response.data.rowsAffected[0]) > 0) {
                        F.Aviso('Ruta eliminada correctamente.');
                        digitador_rutas_cargar_tabla();
                    } else {
                        F.AvisoError(`No se pudo eliminar. ${cfg.deleteMsg}`);
                    }
                })
                .catch(() => {
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = '<i class="fal fa-trash"></i>';
                    }
                    F.AvisoError('Error al eliminar la ruta.');
                });
        });
}

function digitador_rutas_guardar() {
    const cfg = digitador_rutas_cfg();
    const nombre = document.getElementById('txtDigitadorRutaNombre').value || '';
    const codemp = document.getElementById('cmbDigitadorRutaEmpleado').value;
    const esEdicion = digitador_rutas_edit_codruta != null && Number(digitador_rutas_edit_codruta) > 0;

    if (!nombre.trim()) {
        F.AvisoError('Escriba un nombre para la ruta');
        return;
    }

    const msg = esEdicion ? '¿Guardar los cambios de esta ruta?' : '¿Está seguro que desea CREAR esta ruta?';
    const btnGuardar = document.getElementById('btnDigitadorRutaGuardar');

    F.Confirmacion(msg)
        .then((value) => {
            if (value !== true) return;

            btnGuardar.disabled = true;
            btnGuardar.innerHTML = '<i class="fal fa-spin fa-save"></i>';

            const payload = {
                token: TOKEN,
                sucursal: digitador_rutas_sucursal(),
                descripcion: nombre,
                codemp,
            };
            if (esEdicion) payload.codigo = digitador_rutas_edit_codruta;

            const url = esEdicion ? cfg.updateUrl : cfg.insertUrl;
            axios.post(url, payload)
                .then((response) => {
                    const ok = response.status.toString() === '200'
                        && response.data.toString() !== 'error'
                        && Number(response.data.rowsAffected[0]) > 0;

                    btnGuardar.disabled = false;
                    btnGuardar.innerHTML = '<i class="fal fa-save"></i>';

                    if (ok) {
                        F.Aviso(esEdicion ? 'Ruta actualizada correctamente.' : 'Ruta creada exitosamente.');
                        $('#modalDigitadorGestionRuta').modal('hide');
                        digitador_rutas_cargar_tabla();
                    } else {
                        F.AvisoError('No se pudo guardar la ruta.');
                    }
                })
                .catch(() => {
                    btnGuardar.disabled = false;
                    btnGuardar.innerHTML = '<i class="fal fa-save"></i>';
                    F.AvisoError(esEdicion
                        ? 'No se pudo actualizar la ruta.'
                        : 'No se pudo crear la ruta.');
                });
        });
}

function digitador_rutas_actualizar_ui_tipo() {
    const cfg = digitador_rutas_cfg();
    const lbTitulo = document.getElementById('lbDigitadorGestionRutasTitulo');
    const lbEmpleado = document.getElementById('lbDigitadorRutaEmpleadoModal');
    const thEmpleado = document.getElementById('thDigitadorRutaEmpleado');

    if (lbTitulo) lbTitulo.innerText = cfg.label;
    if (lbEmpleado) lbEmpleado.innerText = cfg.empleadoLabel;
    if (thEmpleado) thEmpleado.innerText = cfg.empleadoLabel.toUpperCase();
}

function digitador_rutas_cargar_tabla() {
    const container = document.getElementById('tblDataDigitadorGestionRutas');
    if (!container) return;

    container.innerHTML = `<tr><td colspan="5" class="text-center py-3">${GlobalLoader}</td></tr>`;

    digitador_rutas_api_select()
        .then((rows) => {
            let str = '';
            digitador_rutas_cache = rows || [];
            digitador_rutas_cache.forEach((r) => {
                const btnId = `btnDigDelRuta${digitador_rutas_tipo}${r.CODRUTA}`;
                str += `
                <tr>
                    <td>${r.CODRUTA}</td>
                    <td>${r.RUTA || ''}</td>
                    <td>${r.EMPLEADO || ''}</td>
                    <td class="text-center">
                        <button type="button" title="Editar ruta"
                            class="btn btn-sm btn-circle btn-info hand shadow"
                            data-digitador-ruta-edit data-codruta="${r.CODRUTA}">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" title="Eliminar ruta"
                            class="btn btn-sm btn-circle btn-danger hand shadow"
                            id="${btnId}" data-digitador-ruta-del data-codruta="${r.CODRUTA}">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            });

            container.innerHTML = str || '<tr><td colspan="5" class="text-center text-muted py-4">No hay rutas registradas.</td></tr>';
            const lbTotal = document.getElementById('lbDigitadorGestionRutasTotal');
            if (lbTotal) lbTotal.innerText = `${digitador_rutas_cache.length} rutas`;
        })
        .catch(() => {
            digitador_rutas_cache = [];
            container.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No se cargaron datos...</td></tr>';
            const lbTotal = document.getElementById('lbDigitadorGestionRutasTotal');
            if (lbTotal) lbTotal.innerText = '0 rutas';
        });
}

function digitador_rutas_on_tipo_change() {
    const cmb = document.getElementById('cmbDigitadorGestionRutasTipo');
    digitador_rutas_tipo = cmb?.value === 'mercaderistas' ? 'mercaderistas' : 'clientes';
    digitador_rutas_actualizar_ui_tipo();
    digitador_rutas_cargar_empleados().then(() => digitador_rutas_cargar_tabla());
}

function digitador_init_gestion_rutas() {
    digitador_rutas_bind_tabla();

    if (!digitador_rutas_listeners_ready) {
        digitador_rutas_listeners_ready = true;

        document.getElementById('cmbDigitadorGestionRutasTipo')?.addEventListener('change', digitador_rutas_on_tipo_change);
        document.getElementById('btnDigitadorRutaNuevo')?.addEventListener('click', () => {
            digitador_rutas_limpiar_form();
            $('#modalDigitadorGestionRuta').modal('show');
        });
        document.getElementById('btnDigitadorRutaGuardar')?.addEventListener('click', digitador_rutas_guardar);
    }

    const cmbTipo = document.getElementById('cmbDigitadorGestionRutasTipo');
    if (cmbTipo) digitador_rutas_tipo = cmbTipo.value === 'mercaderistas' ? 'mercaderistas' : 'clientes';

    digitador_rutas_actualizar_ui_tipo();
    digitador_rutas_cargar_empleados().then(() => digitador_rutas_cargar_tabla());
}

function getView() {
    return `
        <div class="card card-rounded shadow col-12 border-0 sygma-gestion-rutas">
            <div class="card-body p-3 p-md-4">
                <div class="row align-items-end mb-3">
                    <div class="col-12 col-md-4 mb-2 mb-md-0">
                        <label class="negrita text-secondary mb-1" for="cmbDigitadorGestionRutasTipo">Tipo de rutas</label>
                        <select class="form-control negrita" id="cmbDigitadorGestionRutasTipo">
                            <option value="clientes">Rutas Clientes</option>
                            <option value="mercaderistas">Rutas Mercaderistas</option>
                        </select>
                    </div>
                    <div class="col-12 col-md-8 text-md-right">
                        <h5 class="negrita text-base mb-1" id="lbDigitadorGestionRutasTitulo">Rutas Clientes</h5>
                        <small class="text-muted" id="lbDigitadorGestionRutasTotal">0 rutas</small>
                    </div>
                </div>
                <div class="mb-2">
                    <input type="search" class="form-control"
                        id="txtDigitadorGestionRutasBuscar"
                        placeholder="Buscar código, ruta o empleado..."
                        oninput="F.FiltrarTabla('tblDigitadorGestionRutas','txtDigitadorGestionRutasBuscar')">
                </div>
                <div class="table-responsive">
                    <table class="table table-sm table-hover table-bordered mb-0" id="tblDigitadorGestionRutas">
                        <thead class="bg-base text-white">
                            <tr>
                                <th>CÓDIGO</th>
                                <th>RUTA</th>
                                <th id="thDigitadorRutaEmpleado">VENDEDOR</th>
                                <th class="text-center">EDITAR</th>
                                <th class="text-center">ELIMINAR</th>
                            </tr>
                        </thead>
                        <tbody id="tblDataDigitadorGestionRutas"></tbody>
                    </table>
                </div>
            </div>
        </div>
        <button type="button" class="btn sygma-fab-nuevo btn-success btn-xl btn-circle shadow hand"
            id="btnDigitadorRutaNuevo" title="Nueva ruta">
            <i class="fal fa-plus"></i>
        </button>
        <div class="modal fade" id="modalDigitadorGestionRuta" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-base py-2">
                        <h5 class="modal-title text-white negrita mb-0">Datos de la ruta</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="form-group">
                            <label class="negrita" for="txtDigitadorRutaNombre">Ruta</label>
                            <input type="text" class="form-control negrita" id="txtDigitadorRutaNombre">
                        </div>
                        <div class="form-group mb-0">
                            <label class="negrita" for="cmbDigitadorRutaEmpleado" id="lbDigitadorRutaEmpleadoModal">Vendedor</label>
                            <select class="form-control" id="cmbDigitadorRutaEmpleado"></select>
                        </div>
                    </div>
                    <div class="modal-footer py-2 px-3">
                        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success btn-sm hand" id="btnDigitadorRutaGuardar">
                            <i class="fal fa-save mr-1"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initView() {
    digitador_rutas_cache = [];
    digitador_rutas_tipo = 'clientes';
    digitador_rutas_listeners_ready = false;
    digitador_rutas_edit_codruta = null;
    root.innerHTML = getView();
    digitador_init_gestion_rutas();
    window.digitador_embedRefresh = () => digitador_init_gestion_rutas();
}

function destroyView() {
    $('#modalDigitadorGestionRuta').modal('hide');
    digitador_rutas_cache = [];
    digitador_rutas_listeners_ready = false;
    digitador_rutas_edit_codruta = null;
    window.digitador_embedRefresh = null;
}
