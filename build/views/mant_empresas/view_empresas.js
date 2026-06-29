
var _cacheEmpresas = [];

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
                                    <div class="negrita mb-0 pos2-bar-title" style="font-size:0.95rem">Empresas / Sucursales</div>
                                    <div class="small" style="opacity:0.9" id="lbTotalEmpresas">0</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-5">
                            <label class="small mb-1" style="opacity:0.9">Buscar</label>
                            <input type="text" class="form-control form-control-sm pos2-search-input"
                                id="txtBuscarEmp"
                                placeholder="Nombre o código..."
                                oninput="F.FiltrarTabla('tblEmpresas','txtBuscarEmp')">
                        </div>
                    </div>
                </div>
                <div class="pos2-panel-card">
                    <div class="pos2-panel-head">
                        <span class="negrita mb-0"><i class="fal fa-building mr-1"></i> Catálogo</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="pos2-table-scroll table-responsive">
                            <table class="table table-sm table-hover mb-0 pos2-table-compact" id="tblEmpresas">
                                <thead class="bg-base text-white">
                                    <tr>
                                        <th>CÓDIGO</th>
                                        <th>NOMBRE</th>
                                        <th>DIRECCIÓN</th>
                                        <th>TIPO PRECIO</th>
                                        <th>OBJ. VENTAS</th>
                                        <th>OBJ. RENT.</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="tblDataEmpresas"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                ${view.modal_empresa()}
            </div>
        `,
        modal_empresa: () => `
            <div id="modal_empresa" class="modal fade modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-base text-white py-2">
                            <h5 class="modal-title mb-0">Datos de la Empresa</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-4 pos2-doc-compact">
                            <div class="form-group">
                                <label>Código (EMPNIT)</label>
                                <input type="text" class="form-control negrita text-danger" id="txtEmpNit" disabled>
                            </div>
                            <div class="form-group">
                                <label>Nombre</label>
                                <input type="text" class="form-control negrita" id="txtEmpNombre">
                            </div>
                            <div class="form-group">
                                <label>Dirección</label>
                                <input type="text" class="form-control" id="txtEmpDireccion">
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group mb-2">
                                        <label>Tipo precio</label>
                                        <input type="text" class="form-control" id="txtEmpTipoPrecio" placeholder="A, B, C...">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group mb-2">
                                        <label>Clave</label>
                                        <input type="text" class="form-control negrita" id="txtEmpClave" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group mb-2">
                                        <label>Objetivo ventas</label>
                                        <input type="number" step="0.01" class="form-control" id="txtEmpObjVentas">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group mb-2">
                                        <label>Objetivo rentabilidad</label>
                                        <input type="number" step="0.01" class="form-control" id="txtEmpObjRent">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    <button type="button" class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                        <i class="fal fa-arrow-left"></i>
                                    </button>
                                </div>
                                <div class="col-6 text-right">
                                    <button type="button" class="btn btn-base btn-circle btn-xl hand shadow" id="btnGuardarEmp">
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

function cargar_form_empresa(r) {
    document.getElementById('txtEmpNit').value = r.EMPNIT || '';
    document.getElementById('txtEmpNombre').value = r.NOMBRE || '';
    document.getElementById('txtEmpDireccion').value = r.DIRECCION || '';
    document.getElementById('txtEmpTipoPrecio').value = r.TIPO_PRECIO || '';
    document.getElementById('txtEmpClave').value = r.CLAVE || '';
    document.getElementById('txtEmpObjVentas').value = r.OBJETIVO_VENTAS || 0;
    document.getElementById('txtEmpObjRent').value = r.OBJETIVO_RENTABILIDAD || 0;
}

function empresas_bindTablaAcciones() {
    const table = document.getElementById('tblEmpresas');
    if (!table || table.dataset.empActionsBound === '1') return;
    table.dataset.empActionsBound = '1';

    table.addEventListener('click', (e) => {
        const btnDel = e.target.closest('[data-emp-del]');
        if (btnDel) {
            e.preventDefault();
            e.stopPropagation();
            eliminar_empresa(String(btnDel.dataset.empnit), btnDel.id);
            return;
        }
        const btnEdit = e.target.closest('[data-emp-edit]');
        if (btnEdit) {
            e.preventDefault();
            editar_empresa(String(btnEdit.dataset.empnit));
        }
    });
}

function tbl_empresas() {
    let container = document.getElementById('tblDataEmpresas');
    container.innerHTML = GlobalLoader;

    axios.post(GlobalUrlCalls + '/general/empresas_listado', { TOKEN: TOKEN })
        .then((response) => {
            if (response.status.toString() !== '200') {
                container.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No se cargaron datos...</td></tr>';
                return;
            }
            let data = response.data;
            if (data.toString() === 'error' || Number(data.rowsAffected[0]) === 0) {
                document.getElementById('lbTotalEmpresas').innerText = '0';
                _cacheEmpresas = [];
                container.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No hay empresas registradas.</td></tr>';
                return;
            }

            let str = '';
            _cacheEmpresas = data.recordset || [];
            _cacheEmpresas.forEach((r) => {
                let btnE = `btnEEmp${String(r.EMPNIT).replace(/[^a-zA-Z0-9]/g, '')}`;
                str += `
                <tr>
                    <td>${r.EMPNIT}</td>
                    <td>${r.NOMBRE || ''}</td>
                    <td>${r.DIRECCION || ''}</td>
                    <td>${r.TIPO_PRECIO || ''}</td>
                    <td>${F.setMoneda(r.OBJETIVO_VENTAS, 'Q')}</td>
                    <td>${F.setMoneda(r.OBJETIVO_RENTABILIDAD, 'Q')}</td>
                    <td>
                        <button type="button" title="Editar empresa"
                            class="btn btn-md btn-circle btn-info hand shadow"
                            data-emp-edit data-empnit="${r.EMPNIT}">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <button type="button" title="Eliminar empresa"
                            class="btn btn-md btn-circle btn-danger hand shadow"
                            id="${btnE}" data-emp-del data-empnit="${r.EMPNIT}">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            });
            container.innerHTML = str;
            document.getElementById('lbTotalEmpresas').innerText = _cacheEmpresas.length;
        })
        .catch(() => {
            _cacheEmpresas = [];
            container.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Error al cargar empresas...</td></tr>';
        });
}

function editar_empresa(empnit) {
    let r = (_cacheEmpresas || []).find((x) => String(x.EMPNIT) === String(empnit));
    if (!r) return;
    cargar_form_empresa(r);
    $('#modal_empresa').modal('show');
}

function guardar_empresa() {
    let payload = {
        TOKEN: TOKEN,
        empnit: document.getElementById('txtEmpNit').value,
        nombre: document.getElementById('txtEmpNombre').value.trim(),
        direccion: document.getElementById('txtEmpDireccion').value.trim(),
        tipo_precio: document.getElementById('txtEmpTipoPrecio').value.trim(),
        clave: document.getElementById('txtEmpClave').value,
        objetivo_ventas: document.getElementById('txtEmpObjVentas').value,
        objetivo_rentabilidad: document.getElementById('txtEmpObjRent').value
    };

    if (!payload.nombre) {
        F.AvisoError('Escriba el nombre de la empresa.');
        return;
    }

    document.getElementById('btnGuardarEmp').disabled = true;

    axios.post(GlobalUrlCalls + '/general/empresa_update', payload)
        .then((response) => {
            document.getElementById('btnGuardarEmp').disabled = false;
            if (response.status.toString() === '200' && response.data.toString() !== 'error' && Number(response.data.rowsAffected[0]) > 0) {
                F.Aviso('Empresa actualizada correctamente.');
                $('#modal_empresa').modal('hide');
                tbl_empresas();
            } else {
                F.AvisoError('No se pudo actualizar la empresa.');
            }
        })
        .catch(() => {
            document.getElementById('btnGuardarEmp').disabled = false;
            F.AvisoError('Error al guardar la empresa.');
        });
}

function eliminar_empresa(empnit, idbtn) {
    let btn = document.getElementById(idbtn);
    if (!btn) return;

    let r = (_cacheEmpresas || []).find((x) => String(x.EMPNIT) === String(empnit));
    let nombre = r ? (r.NOMBRE || empnit) : empnit;

    F.Confirmacion(`¿Está seguro que desea eliminar la empresa ${nombre}?`)
        .then((value) => {
            if (value != true) return;

            btn.disabled = true;
            btn.innerHTML = '<i class="fal fa-trash fa-spin"></i>';

            axios.post(GlobalUrlCalls + '/general/empresa_delete', { TOKEN: TOKEN, empnit: empnit })
                .then((response) => {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fal fa-trash"></i>';
                    if (response.status.toString() === '200' && response.data.toString() !== 'error' && Number(response.data.rowsAffected[0]) > 0) {
                        F.Aviso('Empresa eliminada correctamente.');
                        tbl_empresas();
                    } else {
                        F.AvisoError('No se puede eliminar: existen documentos, empleados o clientes asociados a esta empresa.');
                    }
                })
                .catch(() => {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fal fa-trash"></i>';
                    F.AvisoError('Error al eliminar la empresa.');
                });
        });
}

function addListeners() {
    document.title = 'Empresas';
    empresas_bindTablaAcciones();
    document.getElementById('btnGuardarEmp').addEventListener('click', guardar_empresa);
    tbl_empresas();
}

function initView() {
    getView();
    addListeners();
}

(function registerEmpresasSpaHooks() {
    window.__spaViewHooks = window.__spaViewHooks || {};
    window.__spaViewHooks['mant/empresas'] = {
        initView: initView,
        destroyView: function () {}
    };
})();
