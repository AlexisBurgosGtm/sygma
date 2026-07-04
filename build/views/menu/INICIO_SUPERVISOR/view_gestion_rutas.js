var supervisor_rutas_cache = [];
var supervisor_rutas_tipo = 'clientes';
var supervisor_rutas_listeners_ready = false;
var supervisor_rutas_edit_codruta = null;

var SUPERVISOR_RUTAS_CONFIG = {
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

function supervisor_rutas_cfg() {
    return SUPERVISOR_RUTAS_CONFIG[supervisor_rutas_tipo] || SUPERVISOR_RUTAS_CONFIG.clientes;
}

function supervisor_rutas_api_select() {
    const cfg = supervisor_rutas_cfg();
    return axios.post(cfg.selectUrl, {
        token: TOKEN,
        sucursal: GlobalEmpnit,
    }).then((res) => {
        if (res.status.toString() === '200' && res.data && res.data.toString() !== 'error') {
            return res.data.recordset || [];
        }
        throw new Error('error');
    });
}

function supervisor_rutas_cargar_empleados() {
    const cfg = supervisor_rutas_cfg();
    const cmb = document.getElementById('cmbSupervisorRutaEmpleado');
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

function supervisor_rutas_limpiar_form() {
    supervisor_rutas_edit_codruta = null;
    document.getElementById('txtSupervisorRutaNombre').value = '';
    const cmb = document.getElementById('cmbSupervisorRutaEmpleado');
    if (cmb && cmb.options.length) cmb.selectedIndex = 0;
}

function supervisor_rutas_cargar_form(r) {
    supervisor_rutas_edit_codruta = Number(r.CODRUTA);
    document.getElementById('txtSupervisorRutaNombre').value = r.RUTA || '';
    document.getElementById('cmbSupervisorRutaEmpleado').value = r.CODEMP || '0';
}

function supervisor_rutas_bind_tabla() {
    const table = document.getElementById('tblSupervisorGestionRutas');
    if (!table || table.dataset.rutasBound === '1') return;
    table.dataset.rutasBound = '1';

    table.addEventListener('click', (e) => {
        const btnDel = e.target.closest('[data-supervisor-ruta-del]');
        if (btnDel) {
            e.preventDefault();
            supervisor_rutas_eliminar(Number(btnDel.dataset.codruta), btnDel.id);
            return;
        }
        const btnEdit = e.target.closest('[data-supervisor-ruta-edit]');
        if (btnEdit) {
            e.preventDefault();
            supervisor_rutas_editar(Number(btnEdit.dataset.codruta));
        }
    });
}

function supervisor_rutas_editar(codruta) {
    const r = (supervisor_rutas_cache || []).find((x) => Number(x.CODRUTA) === Number(codruta));
    if (!r) return;
    supervisor_rutas_cargar_form(r);
    $('#modalSupervisorGestionRuta').modal('show');
}

function supervisor_rutas_eliminar(codruta, idbtn) {
    const btn = document.getElementById(idbtn);
    const cfg = supervisor_rutas_cfg();
    const r = (supervisor_rutas_cache || []).find((x) => Number(x.CODRUTA) === Number(codruta));
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
                sucursal: GlobalEmpnit,
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
                        supervisor_rutas_cargar_tabla();
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

function supervisor_rutas_guardar() {
    const cfg = supervisor_rutas_cfg();
    const nombre = document.getElementById('txtSupervisorRutaNombre').value || '';
    const codemp = document.getElementById('cmbSupervisorRutaEmpleado').value;
    const esEdicion = supervisor_rutas_edit_codruta != null && Number(supervisor_rutas_edit_codruta) > 0;

    if (!nombre.trim()) {
        F.AvisoError('Escriba un nombre para la ruta');
        return;
    }

    const msg = esEdicion ? '¿Guardar los cambios de esta ruta?' : '¿Está seguro que desea CREAR esta ruta?';
    const btnGuardar = document.getElementById('btnSupervisorRutaGuardar');

    F.Confirmacion(msg)
        .then((value) => {
            if (value !== true) return;

            btnGuardar.disabled = true;
            btnGuardar.innerHTML = '<i class="fal fa-spin fa-save"></i>';

            const payload = {
                token: TOKEN,
                sucursal: GlobalEmpnit,
                descripcion: nombre,
                codemp,
            };
            if (esEdicion) payload.codigo = supervisor_rutas_edit_codruta;

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
                        $('#modalSupervisorGestionRuta').modal('hide');
                        supervisor_rutas_cargar_tabla();
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

function supervisor_rutas_actualizar_ui_tipo() {
    const cfg = supervisor_rutas_cfg();
    const lbTitulo = document.getElementById('lbSupervisorGestionRutasTitulo');
    const lbEmpleado = document.getElementById('lbSupervisorRutaEmpleadoModal');
    const thEmpleado = document.getElementById('thSupervisorRutaEmpleado');

    if (lbTitulo) lbTitulo.innerText = cfg.label;
    if (lbEmpleado) lbEmpleado.innerText = cfg.empleadoLabel;
    if (thEmpleado) thEmpleado.innerText = cfg.empleadoLabel.toUpperCase();
}

function supervisor_rutas_cargar_tabla() {
    const container = document.getElementById('tblDataSupervisorGestionRutas');
    if (!container) return;

    container.innerHTML = `<tr><td colspan="5" class="text-center py-3">${GlobalLoader}</td></tr>`;

    supervisor_rutas_api_select()
        .then((rows) => {
            let str = '';
            supervisor_rutas_cache = rows || [];
            supervisor_rutas_cache.forEach((r) => {
                const btnId = `btnSupDelRuta${supervisor_rutas_tipo}${r.CODRUTA}`;
                str += `
                <tr>
                    <td>${r.CODRUTA}</td>
                    <td>${r.RUTA || ''}</td>
                    <td>${r.EMPLEADO || ''}</td>
                    <td class="text-center">
                        <button type="button" title="Editar ruta"
                            class="btn btn-sm btn-circle btn-info hand shadow"
                            data-supervisor-ruta-edit data-codruta="${r.CODRUTA}">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" title="Eliminar ruta"
                            class="btn btn-sm btn-circle btn-danger hand shadow"
                            id="${btnId}" data-supervisor-ruta-del data-codruta="${r.CODRUTA}">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            });

            container.innerHTML = str || '<tr><td colspan="5" class="text-center text-muted py-4">No hay rutas registradas.</td></tr>';
            const lbTotal = document.getElementById('lbSupervisorGestionRutasTotal');
            if (lbTotal) lbTotal.innerText = `${supervisor_rutas_cache.length} rutas`;
        })
        .catch(() => {
            supervisor_rutas_cache = [];
            container.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No se cargaron datos...</td></tr>';
            const lbTotal = document.getElementById('lbSupervisorGestionRutasTotal');
            if (lbTotal) lbTotal.innerText = '0 rutas';
        });
}

function supervisor_rutas_on_tipo_change() {
    const cmb = document.getElementById('cmbSupervisorGestionRutasTipo');
    supervisor_rutas_tipo = cmb?.value === 'mercaderistas' ? 'mercaderistas' : 'clientes';
    supervisor_rutas_actualizar_ui_tipo();
    supervisor_rutas_cargar_empleados().then(() => supervisor_rutas_cargar_tabla());
}

function supervisor_init_gestion_rutas() {
    supervisor_rutas_bind_tabla();

    if (!supervisor_rutas_listeners_ready) {
        supervisor_rutas_listeners_ready = true;

        document.getElementById('cmbSupervisorGestionRutasTipo')?.addEventListener('change', supervisor_rutas_on_tipo_change);
        document.getElementById('btnSupervisorRutaNuevo')?.addEventListener('click', () => {
            supervisor_rutas_limpiar_form();
            $('#modalSupervisorGestionRuta').modal('show');
        });
        document.getElementById('btnSupervisorRutaGuardar')?.addEventListener('click', supervisor_rutas_guardar);
    }

    const cmbTipo = document.getElementById('cmbSupervisorGestionRutasTipo');
    if (cmbTipo) supervisor_rutas_tipo = cmbTipo.value === 'mercaderistas' ? 'mercaderistas' : 'clientes';

    supervisor_rutas_actualizar_ui_tipo();
    supervisor_rutas_cargar_empleados().then(() => supervisor_rutas_cargar_tabla());
}
