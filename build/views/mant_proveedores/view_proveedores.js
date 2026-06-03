
function getView() {
    let view = {
        body: () => `
            <div class="col-12 p-0 bg-white">
                <div class="tab-content" id="myTabHomeContent">
                    <div class="tab-pane fade show active" id="uno" role="tabpanel">
                        ${view.vista_listado()}
                    </div>
                </div>
                <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="tab-uno" data-toggle="tab" href="#uno" role="tab"></a>
                    </li>
                </ul>
            </div>
            ${view.modal_proveedor()}
        `,
        vista_listado: () => `
            <div class="card card-rounded shadow">
                <div class="card-body p-4">
                    <div class="row">
                        <div class="col-md-8">
                            <h3 class="negrita text-base">Catálogo de Proveedores</h3>
                            <h4 class="negrita text-danger" id="lbTotalProveedores">0</h4>
                        </div>
                        <div class="col-md-4">
                            <label class="negrita text-secondary">Buscar</label>
                            <input type="text" class="form-control negrita text-info"
                                id="txtBuscarProv"
                                placeholder="Nombre o NIT..."
                                oninput="F.FiltrarTabla('tblProveedores','txtBuscarProv')">
                        </div>
                    </div>
                    <br>
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover" id="tblProveedores">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>NIT</td>
                                    <td>EMPRESA</td>
                                    <td>RAZÓN SOCIAL</td>
                                    <td>DIRECCIÓN</td>
                                    <td>TELÉFONO</td>
                                    <td>SALDO</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblDataProveedores"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-bottom-r btn-success btn-xl btn-circle shadow hand" id="btnNuevoProv">
                <i class="fal fa-plus"></i>
            </button>
        `,
        modal_proveedor: () => `
            <div id="modal_proveedor" class="modal fade modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-lg">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white">Datos del Proveedor</h4>
                        </div>
                        <div class="modal-body p-4">
                            <div class="card card-rounded">
                                <div class="card-body p-4">
                                    <input type="hidden" id="txtCodProv" disabled>
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Empresa / Nombre comercial</label>
                                        <input type="text" class="form-control negrita" id="txtProvEmpresa">
                                    </div>
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Razón social</label>
                                        <input type="text" class="form-control" id="txtProvRazon">
                                    </div>
                                    <div class="row">
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="negrita text-secondary">NIT</label>
                                                <input type="text" class="form-control" id="txtProvNit">
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="negrita text-secondary">Saldo</label>
                                                <input type="number" step="0.01" class="form-control" id="txtProvSaldo" value="0">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Dirección</label>
                                        <input type="text" class="form-control" id="txtProvDireccion">
                                    </div>
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Teléfono empresa</label>
                                        <input type="text" class="form-control" id="txtProvTelefono">
                                    </div>
                                    <div class="row">
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="negrita text-secondary">Contacto</label>
                                                <input type="text" class="form-control" id="txtProvContacto">
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="negrita text-secondary">Tel. contacto</label>
                                                <input type="text" class="form-control" id="txtProvTelContacto">
                                            </div>
                                        </div>
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
                                    <button type="button" class="btn btn-base btn-circle btn-xl hand shadow" id="btnGuardarProv">
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

function limpiar_form_proveedor() {
    document.getElementById('txtCodProv').value = '';
    document.getElementById('txtProvEmpresa').value = '';
    document.getElementById('txtProvRazon').value = '';
    document.getElementById('txtProvNit').value = '';
    document.getElementById('txtProvDireccion').value = '';
    document.getElementById('txtProvTelefono').value = '';
    document.getElementById('txtProvContacto').value = 'SN';
    document.getElementById('txtProvTelContacto').value = '';
    document.getElementById('txtProvSaldo').value = '0';
}

function cargar_form_proveedor(r) {
    document.getElementById('txtCodProv').value = r.CODPROV;
    document.getElementById('txtProvEmpresa').value = r.EMPRESA || '';
    document.getElementById('txtProvRazon').value = r.RAZONSOCIAL || '';
    document.getElementById('txtProvNit').value = r.NIT || '';
    document.getElementById('txtProvDireccion').value = r.DIRECCION || '';
    document.getElementById('txtProvTelefono').value = r.TELEMPRESA || '';
    document.getElementById('txtProvContacto').value = r.CONTACTO || '';
    document.getElementById('txtProvTelContacto').value = r.TELCONTACTO || '';
    document.getElementById('txtProvSaldo').value = r.SALDO || 0;
}

function tbl_proveedores() {
    let container = document.getElementById('tblDataProveedores');
    container.innerHTML = GlobalLoader;

    axios.post(GlobalUrlCalls + '/proveedores/listado', { token: TOKEN })
        .then((response) => {
            if (response.status.toString() !== '200') {
                container.innerHTML = 'No se cargaron datos...';
                return;
            }
            let data = response.data;
            if (data.toString() === 'error' || Number(data.rowsAffected[0]) === 0) {
                document.getElementById('lbTotalProveedores').innerText = '0';
                container.innerHTML = 'No hay proveedores registrados.';
                return;
            }

            let str = '';
            data.recordset.forEach((r) => {
                let btnE = `btnEProv${r.CODPROV}`;
                str += `
                <tr>
                    <td>${r.NIT || ''}</td>
                    <td>${r.EMPRESA || ''}</td>
                    <td>${r.RAZONSOCIAL || ''}</td>
                    <td>${r.DIRECCION || ''}</td>
                    <td>${r.TELEMPRESA || ''}</td>
                    <td>${F.setMoneda(r.SALDO, 'Q')}</td>
                    <td>
                        <button type="button" title="Editar proveedor"
                            class="btn btn-md btn-circle btn-info hand shadow"
                            data-prov-edit data-codprov="${r.CODPROV}">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <button type="button" title="Eliminar proveedor"
                            class="btn btn-md btn-circle btn-danger hand shadow"
                            id="${btnE}" data-prov-del data-codprov="${r.CODPROV}">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            });
            container.innerHTML = str;
            document.getElementById('lbTotalProveedores').innerText = data.recordset.length;
            window._cacheProveedores = data.recordset;
        })
        .catch(() => {
            container.innerHTML = 'Error al cargar proveedores...';
        });
}

function editar_proveedor(codprov) {
    let r = (window._cacheProveedores || []).find((x) => Number(x.CODPROV) === Number(codprov));
    if (!r) return;
    cargar_form_proveedor(r);
    $('#modal_proveedor').modal('show');
}

function guardar_proveedor() {
    let codprov = document.getElementById('txtCodProv').value;
    let payload = {
        token: TOKEN,
        empresa: document.getElementById('txtProvEmpresa').value.trim(),
        razonsocial: document.getElementById('txtProvRazon').value.trim(),
        nit: document.getElementById('txtProvNit').value.trim(),
        direccion: document.getElementById('txtProvDireccion').value.trim(),
        telempresa: document.getElementById('txtProvTelefono').value.trim(),
        contacto: document.getElementById('txtProvContacto').value.trim(),
        telcontacto: document.getElementById('txtProvTelContacto').value.trim(),
        saldo: document.getElementById('txtProvSaldo').value
    };

    if (!payload.empresa) {
        F.AvisoError('Escriba el nombre del proveedor.');
        return;
    }

    let url = GlobalUrlCalls + '/proveedores/insert';
    if (codprov) {
        url = GlobalUrlCalls + '/proveedores/update';
        payload.codprov = codprov;
    }

    document.getElementById('btnGuardarProv').disabled = true;

    axios.post(url, payload)
        .then((response) => {
            document.getElementById('btnGuardarProv').disabled = false;
            if (response.status.toString() === '200' && response.data.toString() !== 'error' && Number(response.data.rowsAffected[0]) > 0) {
                F.Aviso('Proveedor guardado correctamente.');
                $('#modal_proveedor').modal('hide');
                tbl_proveedores();
            } else {
                F.AvisoError('No se pudo guardar el proveedor.');
            }
        })
        .catch(() => {
            document.getElementById('btnGuardarProv').disabled = false;
            F.AvisoError('Error al guardar el proveedor.');
        });
}

function eliminar_proveedor(codprov, idbtn) {
    let btn = document.getElementById(idbtn);
    if (!btn) return;

    let r = (window._cacheProveedores || []).find((x) => Number(x.CODPROV) === Number(codprov));
    let nombre = r ? (r.EMPRESA || r.RAZONSOCIAL || 'seleccionado') : 'seleccionado';

    F.Confirmacion(`¿Está seguro que desea eliminar al proveedor ${nombre}?`)
        .then((value) => {
            if (value != true) return;

            btn.disabled = true;
            btn.innerHTML = '<i class="fal fa-trash fa-spin"></i>';

            axios.post(GlobalUrlCalls + '/proveedores/delete', { token: TOKEN, codprov: codprov })
                .then((response) => {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fal fa-trash"></i>';
                    if (response.status.toString() === '200' && response.data.toString() !== 'error' && Number(response.data.rowsAffected[0]) > 0) {
                        F.Aviso('Proveedor eliminado correctamente.');
                        tbl_proveedores();
                    } else {
                        F.AvisoError('No se pudo eliminar el proveedor.');
                    }
                })
                .catch(() => {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fal fa-trash"></i>';
                    F.AvisoError('Error al eliminar el proveedor.');
                });
        });
}

function proveedores_bindTablaAcciones() {
    const table = document.getElementById('tblProveedores');
    if (!table || table.dataset.provActionsBound === '1') return;
    table.dataset.provActionsBound = '1';

    table.addEventListener('click', (e) => {
        const btnDel = e.target.closest('[data-prov-del]');
        if (btnDel) {
            e.preventDefault();
            e.stopPropagation();
            eliminar_proveedor(Number(btnDel.dataset.codprov), btnDel.id);
            return;
        }
        const btnEdit = e.target.closest('[data-prov-edit]');
        if (btnEdit) {
            e.preventDefault();
            editar_proveedor(Number(btnEdit.dataset.codprov));
        }
    });
}

function addListeners() {
    document.title = 'Proveedores';

    proveedores_bindTablaAcciones();

    document.getElementById('btnNuevoProv').addEventListener('click', () => {
        limpiar_form_proveedor();
        $('#modal_proveedor').modal('show');
    });

    document.getElementById('btnGuardarProv').addEventListener('click', guardar_proveedor);

    tbl_proveedores();
}

function initView() {
    getView();
    addListeners();
}
