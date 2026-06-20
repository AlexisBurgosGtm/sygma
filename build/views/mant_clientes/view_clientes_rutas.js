
var _cacheRutas = [];

function getView() {
    spa_inyectarEstilosPos2();

    let view = {
        body: () => `
            <div class="pos2-wrap">
                <div class="pos2-totals-bar">
                    <div class="row align-items-center no-gutters">
                        <div class="col-md-8 col-7">
                            <div class="d-flex align-items-center">
                                <img src="./favicon.png" width="36" height="36" alt="" class="mr-2">
                                <div>
                                    <div class="negrita mb-0 pos2-bar-title" style="font-size:0.95rem">Rutas de Cliente</div>
                                    <div class="small" style="opacity:0.9" id="lbTotalRutas">0 rutas</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-5">
                            <label class="small mb-1" style="opacity:0.9">Buscar</label>
                            <input type="text" class="form-control form-control-sm pos2-search-input"
                                id="txtBuscarRuta" placeholder="Código o nombre..."
                                oninput="F.FiltrarTabla('tblRutas','txtBuscarRuta')">
                        </div>
                    </div>
                </div>
                <div class="pos2-panel-card">
                    <div class="pos2-panel-head">
                        <span class="negrita mb-0"><i class="fal fa-route mr-1"></i> Catálogo de rutas</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="pos2-table-scroll table-responsive">
                            <table class="table table-sm table-hover mb-0 pos2-table-compact" id="tblRutas">
                                <thead class="bg-base text-white">
                                    <tr>
                                        <th>CÓDIGO</th>
                                        <th>RUTA</th>
                                        <th>EMPLEADO</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="tblDataRutas"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                ${view.modal_datos()}
            </div>
            <button type="button" class="btn sygma-fab-nuevo btn-success btn-xl btn-circle shadow hand" id="btnNuevo">
                <i class="fal fa-plus"></i>
            </button>
        `,
        modal_datos: () => `
            <div id="modal_datos" class="modal fade modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-base text-white py-2">
                            <h5 class="modal-title mb-0">Datos de la Ruta</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-4 pos2-doc-compact">
                            <div class="form-group">
                                <label>Código</label>
                                <input type="number" class="form-control negrita" id="txtCodRuta">
                            </div>
                            <div class="form-group">
                                <label>Ruta</label>
                                <input type="text" class="form-control negrita" id="txtDesRuta">
                            </div>
                            <div class="form-group">
                                <label>Vendedor</label>
                                <select class="form-control" id="cmbEmpleado"></select>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    <button type="button" class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                        <i class="fal fa-arrow-left"></i>
                                    </button>
                                </div>
                                <div class="col-6 text-right">
                                    <button type="button" class="btn btn-base btn-circle btn-xl hand shadow" id="btnGuardar">
                                        <i class="fal fa-save"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    root.innerHTML = view.body();
}

function limpiar_form_ruta() {
    document.getElementById('txtCodRuta').value = '';
    document.getElementById('txtCodRuta').disabled = false;
    document.getElementById('txtDesRuta').value = '';
}

function cargar_form_ruta(r) {
    document.getElementById('txtCodRuta').value = r.CODRUTA;
    document.getElementById('txtCodRuta').disabled = true;
    document.getElementById('txtDesRuta').value = r.RUTA || '';
    document.getElementById('cmbEmpleado').value = r.CODEMP || '0';
}

function rutas_bindTablaAcciones() {
    const table = document.getElementById('tblRutas');
    if (!table || table.dataset.rutaActionsBound === '1') return;
    table.dataset.rutaActionsBound = '1';

    table.addEventListener('click', (e) => {
        const btnDel = e.target.closest('[data-ruta-del]');
        if (btnDel) {
            e.preventDefault();
            e.stopPropagation();
            eliminar_ruta(Number(btnDel.dataset.codruta), btnDel.id);
            return;
        }
        const btnEdit = e.target.closest('[data-ruta-edit]');
        if (btnEdit) {
            e.preventDefault();
            editar_ruta(Number(btnEdit.dataset.codruta));
        }
    });
}

function editar_ruta(codruta) {
    let r = (_cacheRutas || []).find((x) => Number(x.CODRUTA) === Number(codruta));
    if (!r) return;
    cargar_form_ruta(r);
    $('#modal_datos').modal('show');
}

function eliminar_ruta(codruta, idbtn) {
    let btn = document.getElementById(idbtn);
    if (!btn) return;

    let r = (_cacheRutas || []).find((x) => Number(x.CODRUTA) === Number(codruta));
    let nombre = r ? (r.RUTA || 'seleccionada') : 'seleccionada';

    F.Confirmacion(`¿Está seguro que desea eliminar la ruta ${nombre}?`)
        .then((value) => {
            if (value != true) return;

            btn.disabled = true;
            btn.innerHTML = '<i class="fal fa-trash fa-spin"></i>';

            axios.post('/clientes/delete_ruta', {
                token: TOKEN,
                sucursal: GlobalEmpnit,
                codigo: codruta
            })
                .then((response) => {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fal fa-trash"></i>';
                    if (response.status.toString() === '200' && response.data.toString() !== 'error' && Number(response.data.rowsAffected[0]) > 0) {
                        F.Aviso('Ruta eliminada correctamente.');
                        tbl_rutas();
                    } else {
                        F.AvisoError('No se pudo eliminar. Verifique que no tenga clientes o empleados asignados.');
                    }
                })
                .catch(() => {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fal fa-trash"></i>';
                    F.AvisoError('Error al eliminar la ruta.');
                });
        });
}

function addListeners() {
    document.title = 'Rutas de Cliente';
    rutas_bindTablaAcciones();

    document.getElementById('btnNuevo').addEventListener('click', () => {
        limpiar_form_ruta();
        $('#modal_datos').modal('show');
    });

    GF.get_data_empleados_tipo(3)
        .then((data) => {
            let str = '';
            data.recordset.map((r) => {
                str += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>`;
            });
            document.getElementById('cmbEmpleado').innerHTML = str;
        })
        .catch(() => {
            F.AvisoError('No se cargaron los vendedores');
            document.getElementById('cmbEmpleado').innerHTML = '<option value="0">SIN VENDEDOR</option>';
        });

    document.getElementById('btnGuardar').addEventListener('click', guardar_ruta);
    tbl_rutas();
}

function guardar_ruta() {
    let codigo = document.getElementById('txtCodRuta').value || '0';
    let ruta = document.getElementById('txtDesRuta').value || '';
    let codemp = document.getElementById('cmbEmpleado').value;
    let esEdicion = document.getElementById('txtCodRuta').disabled;

    if (!esEdicion && (codigo === '' || codigo === '0')) {
        F.AvisoError('Indique un código de ruta');
        return;
    }
    if (ruta === '') {
        F.AvisoError('Escriba un nombre para la Ruta');
        return;
    }

    let msg = esEdicion ? '¿Guardar los cambios de esta ruta?' : '¿Está seguro que desea CREAR esta ruta?';
    let btnGuardar = document.getElementById('btnGuardar');

    F.Confirmacion(msg)
        .then((value) => {
            if (value != true) return;

            btnGuardar.disabled = true;
            btnGuardar.innerHTML = '<i class="fal fa-spin fa-save"></i>';

            let req;
            if (esEdicion) {
                req = axios.post('/clientes/update_ruta', {
                    token: TOKEN,
                    sucursal: GlobalEmpnit,
                    codigo: codigo,
                    descripcion: ruta,
                    codemp: codemp
                });
            } else {
                req = GF.get_data_rutas_insert(GlobalEmpnit, codigo, ruta, codemp);
            }

            req
                .then((response) => {
                    let ok = esEdicion
                        ? (response.status.toString() === '200' && response.data.toString() !== 'error' && Number(response.data.rowsAffected[0]) > 0)
                        : true;
                    btnGuardar.disabled = false;
                    btnGuardar.innerHTML = '<i class="fal fa-save"></i>';
                    if (ok) {
                        F.Aviso(esEdicion ? 'Ruta actualizada correctamente.' : 'Ruta creada exitosamente.');
                        $('#modal_datos').modal('hide');
                        tbl_rutas();
                    } else {
                        F.AvisoError('No se pudo guardar la ruta.');
                    }
                })
                .catch(() => {
                    btnGuardar.disabled = false;
                    btnGuardar.innerHTML = '<i class="fal fa-save"></i>';
                    F.AvisoError(esEdicion ? 'No se pudo actualizar la ruta.' : 'No se pudo crear. Verifique si no está usando un código repetido.');
                });
        });
}

function initView() {
    getView();
    addListeners();
}

function tbl_rutas() {
    let container = document.getElementById('tblDataRutas');
    container.innerHTML = GlobalLoader;

    GF.get_data_rutas_select(GlobalEmpnit)
        .then((data) => {
            let str = '';
            _cacheRutas = data.recordset || [];
            _cacheRutas.forEach((r) => {
                let btnE = `btnERuta${r.CODRUTA}`;
                str += `
                <tr>
                    <td>${r.CODRUTA}</td>
                    <td>${r.RUTA || ''}</td>
                    <td>${r.EMPLEADO || ''}</td>
                    <td>
                        <button type="button" title="Editar ruta"
                            class="btn btn-md btn-circle btn-info hand shadow"
                            data-ruta-edit data-codruta="${r.CODRUTA}">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <button type="button" title="Eliminar ruta"
                            class="btn btn-md btn-circle btn-danger hand shadow"
                            id="${btnE}" data-ruta-del data-codruta="${r.CODRUTA}">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            });
            container.innerHTML = str || '<tr><td colspan="5" class="text-center text-muted">No hay rutas registradas.</td></tr>';
            document.getElementById('lbTotalRutas').innerText = `${_cacheRutas.length} rutas`;
        })
        .catch(() => {
            _cacheRutas = [];
            container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se cargaron datos...</td></tr>';
            document.getElementById('lbTotalRutas').innerText = '0 rutas';
        });
}
