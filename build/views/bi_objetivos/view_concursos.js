function getView() {
    const view = {
        body: () => `
            <div class="col-12 p-0 conc-root">
                <div class="card card-rounded shadow border-0 mb-2 conc-header">
                    <div class="card-body py-2 px-3">
                        <div class="d-flex flex-wrap align-items-center justify-content-between mb-2">
                            <h5 class="negrita text-danger mb-0">CONCURSOS</h5>
                            <button type="button" class="btn btn-success btn-sm hand negrita" id="btnConcursoNuevo">
                                <i class="fal fa-plus mr-1"></i> Nuevo
                            </button>
                        </div>
                        <div class="row no-gutters conc-filtros">
                            <div class="col-12 col-md-4 pr-md-2 mb-1 mb-md-0">
                                <select class="form-control form-control-sm negrita" id="cmbConcursoSucursal" title="Sucursal"></select>
                            </div>
                            <div class="col-6 col-md-4 px-md-1 mb-1 mb-md-0">
                                <select class="form-control form-control-sm negrita" id="cmbConcursoMes" title="Mes"></select>
                            </div>
                            <div class="col-6 col-md-4 pl-md-2">
                                <select class="form-control form-control-sm negrita" id="cmbConcursoAnio" title="Año"></select>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="concPanelListado">
                    <div class="card card-rounded shadow border-0">
                        <div class="card-body p-3">
                            <input type="search" class="form-control form-control-sm mb-2" id="txtConcursoBuscar" placeholder="Buscar concurso...">
                            <div class="table-responsive">
                                <table class="table table-sm table-hover mb-0" id="tblConcursos">
                                    <thead class="bg-base text-white">
                                        <tr>
                                            <th>CONCURSO</th>
                                            <th class="text-center">ACTIVO</th>
                                            <th class="text-center">OBJ.</th>
                                            <th class="text-right">ACCIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataConcursos">
                                        <tr><td colspan="4" class="text-center text-muted">Cargando...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="concPanelObjetivos" class="d-none">
                    <div class="card card-rounded shadow border-0">
                        <div class="card-body p-3">
                            <div class="d-flex flex-wrap align-items-center justify-content-between mb-2">
                                <div class="d-flex align-items-center flex-wrap">
                                    <button type="button" class="btn btn-outline-secondary btn-sm hand negrita mr-2 mb-1" id="btnConcVolverObj">
                                        <i class="fal fa-arrow-left mr-1"></i> Atrás
                                    </button>
                                    <div>
                                        <h5 class="negrita text-base mb-0">Objetivos por vendedor</h5>
                                        <small class="text-muted" id="lbConcursoSelObj">—</small>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-info btn-sm hand negrita mb-1" id="btnObjNuevo">
                                    <i class="fal fa-plus mr-1"></i> Agregar
                                </button>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-sm table-hover mb-0">
                                    <thead class="bg-secondary text-white">
                                        <tr>
                                            <th>VENDEDOR</th>
                                            <th>MARCA</th>
                                            <th class="text-right">COBERTURA</th>
                                            <th class="text-right">IMPORTE</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataConcursoObj">
                                        <tr><td colspan="5" class="text-center text-muted">Cargando...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="concPanelSeguimiento" class="d-none">
                    <div class="card card-rounded shadow border-0">
                        <div class="card-body p-3">
                            <div class="d-flex flex-wrap align-items-center mb-2">
                                <button type="button" class="btn btn-outline-secondary btn-sm hand negrita mr-2 mb-1" id="btnConcVolverSeg">
                                    <i class="fal fa-arrow-left mr-1"></i> Atrás
                                </button>
                                <div>
                                    <h5 class="negrita text-base mb-0">Seguimiento vs ventas</h5>
                                    <small class="text-muted" id="lbConcursoSelSeg">—</small>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-sm table-hover mb-0">
                                    <thead class="bg-base text-white">
                                        <tr>
                                            <th>VENDEDOR</th>
                                            <th>MARCA</th>
                                            <th class="text-right">OBJ. COB.</th>
                                            <th class="text-right">REAL COB.</th>
                                            <th class="text-right">% COB.</th>
                                            <th class="text-right">OBJ. IMP.</th>
                                            <th class="text-right">REAL IMP.</th>
                                            <th class="text-right">% IMP.</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataConcursoSeg">
                                        <tr><td colspan="8" class="text-center text-muted">Cargando...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" tabindex="-1" role="dialog" id="modal_concurso">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header bg-base text-white py-2">
                                <h5 class="modal-title negrita mb-0" id="lbConcursoTitulo">Nuevo concurso</h5>
                            </div>
                            <div class="modal-body">
                                <input type="hidden" id="txtConcursoId" value="0">
                                <label class="negrita small mb-1">Nombre</label>
                                <input type="text" class="form-control form-control-sm" id="txtConcursoNombre" maxlength="500" placeholder="Nombre del concurso">
                                <div class="row mt-2">
                                    <div class="col-6">
                                        <label class="negrita small mb-1">Mes</label>
                                        <select class="form-control form-control-sm" id="cmbConcursoMesModal"></select>
                                    </div>
                                    <div class="col-6">
                                        <label class="negrita small mb-1">Año</label>
                                        <select class="form-control form-control-sm" id="cmbConcursoAnioModal"></select>
                                    </div>
                                </div>
                                <label class="negrita small mb-1 mt-3">Activo</label>
                                <input type="hidden" id="txtConcursoActivo" value="SI">
                                <div class="d-flex">
                                    <button type="button" class="btn btn-sm negrita mr-2 conc-badge is-si is-on" id="btnConcSI">SI</button>
                                    <button type="button" class="btn btn-sm negrita conc-badge is-no" id="btnConcNO">NO</button>
                                </div>
                            </div>
                            <div class="modal-footer py-2">
                                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-success btn-sm negrita" id="btnConcursoGuardar">
                                    <i class="fal fa-save mr-1"></i> Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" tabindex="-1" role="dialog" id="modal_concurso_copiar">
                    <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
                        <div class="modal-content">
                            <div class="modal-header bg-warning py-2">
                                <h5 class="modal-title negrita mb-0">Copiar concurso</h5>
                            </div>
                            <div class="modal-body">
                                <input type="hidden" id="txtCopiarId" value="0">
                                <p class="small mb-2 text-muted" id="lbCopiarNombre">—</p>
                                <label class="negrita small mb-1">Mes destino</label>
                                <select class="form-control form-control-sm mb-2" id="cmbCopiarMes"></select>
                                <label class="negrita small mb-1">Año destino</label>
                                <select class="form-control form-control-sm" id="cmbCopiarAnio"></select>
                            </div>
                            <div class="modal-footer py-2">
                                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-warning btn-sm negrita" id="btnCopiarGuardar">
                                    <i class="fal fa-copy mr-1"></i> Copiar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" tabindex="-1" role="dialog" id="modal_concurso_obj">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header bg-info text-white py-2">
                                <h5 class="modal-title negrita mb-0">Objetivo del vendedor</h5>
                            </div>
                            <div class="modal-body">
                                <input type="hidden" id="txtObjId" value="0">
                                <label class="negrita small mb-1">Vendedor</label>
                                <select class="form-control form-control-sm" id="cmbObjVendedor"></select>
                                <label class="negrita small mb-1 mt-2">Marca</label>
                                <select class="form-control form-control-sm" id="cmbObjMarca"></select>
                                <div class="row mt-2">
                                    <div class="col-6">
                                        <label class="negrita small mb-1">Cobertura</label>
                                        <input type="number" class="form-control form-control-sm" id="txtObjCobertura" min="0" step="0.01" value="0">
                                    </div>
                                    <div class="col-6">
                                        <label class="negrita small mb-1">Importe ventas</label>
                                        <input type="number" class="form-control form-control-sm" id="txtObjImporte" min="0" step="0.01" value="0">
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer py-2">
                                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-info btn-sm negrita" id="btnObjGuardar">
                                    <i class="fal fa-save mr-1"></i> Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    };
    const root = document.getElementById('root');
    if (root) root.innerHTML = view.body();
}

var concursos_cache = [];
var concursos_sel = 0;
var concursos_sel_nom = '';
var conc_view = 'listado';

function conc_esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function conc_mon(v) {
    return typeof F.setMoneda === 'function' ? F.setMoneda(v, 'Q') : v;
}

function conc_pct(real, obj) {
    const o = Number(obj) || 0;
    const r = Number(real) || 0;
    if (o <= 0) return r > 0 ? 100 : 0;
    return Math.round((r / o) * 1000) / 10;
}

function conc_pctClass(pct) {
    if (pct >= 100) return 'conc-ok';
    if (pct >= 80) return 'conc-warn';
    return 'conc-bad';
}

function conc_getActivo() {
    return String(document.getElementById('txtConcursoActivo')?.value || 'SI').toUpperCase() === 'NO' ? 'NO' : 'SI';
}

function conc_setActivoUI(v) {
    const ctrl = String(v || 'SI').toUpperCase() === 'NO' ? 'NO' : 'SI';
    const hid = document.getElementById('txtConcursoActivo');
    if (hid) hid.value = ctrl;
    document.getElementById('btnConcSI')?.classList.toggle('is-on', ctrl === 'SI');
    document.getElementById('btnConcNO')?.classList.toggle('is-on', ctrl === 'NO');
}

function conc_filtros() {
    return {
        sucursal: document.getElementById('cmbConcursoSucursal')?.value || GlobalEmpnit,
        mes: document.getElementById('cmbConcursoMes')?.value || F.get_mes_curso(),
        anio: document.getElementById('cmbConcursoAnio')?.value || F.get_anio_curso()
    };
}

function conc_getRow(id) {
    return concursos_cache.find((x) => Number(x.IDCONCURSO) === Number(id));
}

function conc_setView(v) {
    conc_view = v;
    document.getElementById('concPanelListado')?.classList.toggle('d-none', v !== 'listado');
    document.getElementById('concPanelObjetivos')?.classList.toggle('d-none', v !== 'objetivos');
    document.getElementById('concPanelSeguimiento')?.classList.toggle('d-none', v !== 'seguimiento');
}

function conc_volver_listado() {
    conc_setView('listado');
}

function conc_limpiar_sel() {
    concursos_sel = 0;
    concursos_sel_nom = '';
}

function conc_cargar() {
    const box = document.getElementById('tblDataConcursos');
    if (box) box.innerHTML = `<tr><td colspan="4" class="text-center">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</td></tr>`;
    const f = conc_filtros();
    axios.post(GlobalUrlCalls + '/concursos/listado', { token: TOKEN, ...f })
        .then((res) => {
            if (!res.data || res.data === 'error') throw new Error('error');
            concursos_cache = res.data.recordset || [];
            if (concursos_sel && !conc_getRow(concursos_sel)) conc_limpiar_sel();
            conc_pintar();
        })
        .catch(() => {
            concursos_cache = [];
            if (box) box.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No se pudieron cargar los concursos.</td></tr>';
        });
}

function conc_pintar() {
    const box = document.getElementById('tblDataConcursos');
    if (!box) return;
    const q = String(document.getElementById('txtConcursoBuscar')?.value || '').toLowerCase().trim();
    const rows = concursos_cache.filter((r) => !q || String(r.NOMBRE || '').toLowerCase().indexOf(q) >= 0);
    if (!rows.length) {
        box.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay concursos en este período.</td></tr>';
        return;
    }
    box.innerHTML = rows.map((r) => {
        const id = Number(r.IDCONCURSO) || 0;
        const on = String(r.ACTIVO || 'NO').toUpperCase() === 'SI';
        return `
            <tr>
                <td class="negrita">${conc_esc(r.NOMBRE)}</td>
                <td class="text-center"><span class="conc-pill ${on ? 'is-on' : 'is-off'}">${on ? 'SI' : 'NO'}</span></td>
                <td class="text-center">${Number(r.NOBJ) || 0}</td>
                <td class="text-right conc-actions">
                    <button type="button" class="btn btn-xs btn-warning hand negrita" onclick="conc_copiar_abrir(${id})">COPIAR</button>
                    <button type="button" class="btn btn-xs btn-info hand negrita" onclick="conc_ir_objetivos(${id})">OBJETIVOS</button>
                    <button type="button" class="btn btn-xs btn-success hand negrita" onclick="conc_ir_seguimiento(${id})">SEGUIMIENTO</button>
                    <button type="button" class="btn btn-xs btn-outline-secondary hand" title="Editar" onclick="conc_editar(${id})"><i class="fal fa-edit"></i></button>
                    <button type="button" class="btn btn-xs btn-outline-danger hand" title="Eliminar" onclick="conc_eliminar(${id})"><i class="fal fa-trash"></i></button>
                </td>
            </tr>`;
    }).join('');
}

function conc_sel(id) {
    const r = conc_getRow(id);
    if (!r) return null;
    concursos_sel = Number(id);
    concursos_sel_nom = r.NOMBRE || ('Concurso ' + id);
    return r;
}

function conc_ir_objetivos(id) {
    if (!conc_sel(id)) return;
    document.getElementById('lbConcursoSelObj').textContent = concursos_sel_nom;
    conc_setView('objetivos');
    conc_cargar_obj();
}

function conc_ir_seguimiento(id) {
    if (!conc_sel(id)) return;
    document.getElementById('lbConcursoSelSeg').textContent = concursos_sel_nom;
    conc_setView('seguimiento');
    conc_cargar_seg();
}

function conc_copiar_abrir(id) {
    const r = conc_getRow(id);
    if (!r) return;
    document.getElementById('txtCopiarId').value = String(id);
    document.getElementById('lbCopiarNombre').textContent = 'Copiar «' + (r.NOMBRE || '') + '» y sus objetivos a:';
    document.getElementById('cmbCopiarMes').innerHTML = F.ComboMeses();
    document.getElementById('cmbCopiarAnio').innerHTML = F.ComboAnio();
    let mes = Number(r.MES) + 1;
    let anio = Number(r.ANIO);
    if (mes > 12) { mes = 1; anio += 1; }
    document.getElementById('cmbCopiarMes').value = String(mes);
    document.getElementById('cmbCopiarAnio').value = String(anio);
    $('#modal_concurso_copiar').modal('show');
}

function conc_copiar_guardar() {
    const id = Number(document.getElementById('txtCopiarId').value) || 0;
    const mes = document.getElementById('cmbCopiarMes').value;
    const anio = document.getElementById('cmbCopiarAnio').value;
    const btn = document.getElementById('btnCopiarGuardar');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-copy fa-spin mr-1"></i> Copiando';
    }
    axios.post(GlobalUrlCalls + '/concursos/copiar', { token: TOKEN, idconcurso: id, mes, anio })
        .then((res) => {
            if (!res.data || res.data.ok === false) throw new Error((res.data && res.data.error) || 'error');
            $('#modal_concurso_copiar').modal('hide');
            F.Aviso('Concurso copiado');
            document.getElementById('cmbConcursoMes').value = String(res.data.mes);
            document.getElementById('cmbConcursoAnio').value = String(res.data.anio);
            conc_volver_listado();
            conc_cargar();
        })
        .catch((e) => F.AvisoError((e && e.message && e.message !== 'error') ? e.message : 'No se pudo copiar'))
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fal fa-copy mr-1"></i> Copiar';
            }
        });
}

function conc_cargar_obj() {
    const box = document.getElementById('tblDataConcursoObj');
    if (!concursos_sel) {
        conc_pintar_obj([]);
        return;
    }
    if (box) box.innerHTML = `<tr><td colspan="5" class="text-center">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</td></tr>`;
    axios.post(GlobalUrlCalls + '/concursos/objetivos', { token: TOKEN, idconcurso: concursos_sel })
        .then((res) => {
            if (!res.data || res.data === 'error') throw new Error('error');
            conc_pintar_obj(res.data.recordset || []);
        })
        .catch(() => {
            if (box) box.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se pudieron cargar los objetivos.</td></tr>';
        });
}

function conc_pintar_obj(rows) {
    const box = document.getElementById('tblDataConcursoObj');
    if (!box) return;
    if (!rows.length) {
        box.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Sin objetivos. Agregue vendedores.</td></tr>';
        return;
    }
    box.innerHTML = rows.map((r) => `
        <tr>
            <td>${conc_esc(r.NOMEMPLEADO || r.CODEMP)}</td>
            <td>${conc_esc(r.DESMARCA || 'TODAS')}</td>
            <td class="text-right">${Number(r.COBERTURA) || 0}</td>
            <td class="text-right">${conc_mon(r.IMPORTE)}</td>
            <td class="text-right">
                <button type="button" class="btn btn-xs btn-info hand" title="Editar" onclick='conc_obj_editar(${JSON.stringify({
                    ID: Number(r.ID) || 0,
                    CODEMP: Number(r.CODEMP) || 0,
                    CODMARCA: Number(r.CODMARCA) || 0,
                    COBERTURA: Number(r.COBERTURA) || 0,
                    IMPORTE: Number(r.IMPORTE) || 0
                })})'><i class="fal fa-edit"></i></button>
                <button type="button" class="btn btn-xs btn-danger hand" title="Eliminar" onclick="conc_obj_eliminar(${Number(r.ID) || 0})"><i class="fal fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function conc_cargar_seg() {
    const box = document.getElementById('tblDataConcursoSeg');
    if (!concursos_sel) return;
    if (box) box.innerHTML = `<tr><td colspan="8" class="text-center">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</td></tr>`;
    axios.post(GlobalUrlCalls + '/concursos/seguimiento', { token: TOKEN, idconcurso: concursos_sel })
        .then((res) => {
            if (!res.data || res.data.ok === false) throw new Error((res.data && res.data.error) || 'error');
            conc_pintar_seg(res.data.recordset || []);
        })
        .catch((e) => {
            if (box) box.innerHTML = `<tr><td colspan="8" class="text-center text-muted">${conc_esc((e && e.message && e.message !== 'error') ? e.message : 'No se pudo cargar el seguimiento.')}</td></tr>`;
        });
}

function conc_pintar_seg(rows) {
    const box = document.getElementById('tblDataConcursoSeg');
    if (!box) return;
    if (!rows.length) {
        box.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Sin objetivos para comparar.</td></tr>';
        return;
    }
    box.innerHTML = rows.map((r) => {
        const pctCob = conc_pct(r.REAL_COBERTURA, r.OBJ_COBERTURA);
        const pctImp = conc_pct(r.REAL_IMPORTE, r.OBJ_IMPORTE);
        return `
        <tr>
            <td>${conc_esc(r.NOMEMPLEADO || r.CODEMP)}</td>
            <td>${conc_esc(r.DESMARCA || 'TODAS')}</td>
            <td class="text-right">${Number(r.OBJ_COBERTURA) || 0}</td>
            <td class="text-right negrita">${Number(r.REAL_COBERTURA) || 0}</td>
            <td class="text-right"><span class="conc-pct ${conc_pctClass(pctCob)}">${pctCob}%</span></td>
            <td class="text-right">${conc_mon(r.OBJ_IMPORTE)}</td>
            <td class="text-right negrita">${conc_mon(r.REAL_IMPORTE)}</td>
            <td class="text-right"><span class="conc-pct ${conc_pctClass(pctImp)}">${pctImp}%</span></td>
        </tr>`;
    }).join('');
}

function conc_nuevo() {
    document.getElementById('txtConcursoId').value = '0';
    document.getElementById('txtConcursoNombre').value = '';
    document.getElementById('cmbConcursoMesModal').value = document.getElementById('cmbConcursoMes').value;
    document.getElementById('cmbConcursoAnioModal').value = document.getElementById('cmbConcursoAnio').value;
    document.getElementById('lbConcursoTitulo').textContent = 'Nuevo concurso';
    conc_setActivoUI('SI');
    $('#modal_concurso').modal('show');
}

function conc_editar(id) {
    const r = conc_getRow(id);
    if (!r) return;
    document.getElementById('txtConcursoId').value = String(id);
    document.getElementById('txtConcursoNombre').value = r.NOMBRE || '';
    document.getElementById('cmbConcursoMesModal').value = String(r.MES);
    document.getElementById('cmbConcursoAnioModal').value = String(r.ANIO);
    document.getElementById('lbConcursoTitulo').textContent = 'Editar concurso';
    conc_setActivoUI(r.ACTIVO);
    $('#modal_concurso').modal('show');
}

function conc_guardar() {
    const nombre = String(document.getElementById('txtConcursoNombre').value || '').trim();
    if (!nombre) {
        F.AvisoError('Escriba el nombre del concurso');
        return;
    }
    const id = Number(document.getElementById('txtConcursoId').value) || 0;
    const btn = document.getElementById('btnConcursoGuardar');
    const payload = {
        token: TOKEN,
        sucursal: document.getElementById('cmbConcursoSucursal').value,
        nombre,
        mes: document.getElementById('cmbConcursoMesModal').value,
        anio: document.getElementById('cmbConcursoAnioModal').value,
        activo: conc_getActivo()
    };
    if (id) payload.idconcurso = id;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-save fa-spin mr-1"></i> Guardando';
    }
    axios.post(GlobalUrlCalls + (id ? '/concursos/update' : '/concursos/insert'), payload)
        .then((res) => {
            if (!res.data || res.data === 'error' || res.data.ok === false) {
                throw new Error((res.data && res.data.error) || 'error');
            }
            $('#modal_concurso').modal('hide');
            F.Aviso('Concurso guardado');
            if (!id) {
                document.getElementById('cmbConcursoMes').value = payload.mes;
                document.getElementById('cmbConcursoAnio').value = payload.anio;
            }
            conc_volver_listado();
            conc_cargar();
        })
        .catch((e) => F.AvisoError((e && e.message && e.message !== 'error') ? e.message : 'No se pudo guardar'))
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fal fa-save mr-1"></i> Guardar';
            }
        });
}

function conc_eliminar(id) {
    F.Confirmacion('¿Eliminar este concurso y sus objetivos?')
        .then((ok) => {
            if (!ok) return;
            axios.post(GlobalUrlCalls + '/concursos/delete', { token: TOKEN, idconcurso: id })
                .then((res) => {
                    if (!res.data || res.data === 'error' || res.data.ok === false) throw new Error('error');
                    F.showToast('Concurso eliminado');
                    if (Number(concursos_sel) === Number(id)) {
                        conc_limpiar_sel();
                        conc_volver_listado();
                    }
                    conc_cargar();
                })
                .catch(() => F.AvisoError('No se pudo eliminar'));
        });
}

function conc_obj_nuevo() {
    if (!concursos_sel) {
        F.AvisoError('Seleccione un concurso');
        return;
    }
    document.getElementById('txtObjId').value = '0';
    document.getElementById('txtObjCobertura').value = '0';
    document.getElementById('txtObjImporte').value = '0';
    const cmbVen = document.getElementById('cmbObjVendedor');
    const cmbMarca = document.getElementById('cmbObjMarca');
    if (cmbVen) cmbVen.disabled = false;
    if (cmbMarca) cmbMarca.value = '0';
    $('#modal_concurso_obj').modal('show');
}

function conc_obj_editar(row) {
    if (!row || !row.ID) return;
    document.getElementById('txtObjId').value = String(row.ID);
    document.getElementById('cmbObjVendedor').value = String(row.CODEMP);
    document.getElementById('cmbObjVendedor').disabled = true;
    document.getElementById('cmbObjMarca').value = String(row.CODMARCA || 0);
    document.getElementById('txtObjCobertura').value = String(row.COBERTURA || 0);
    document.getElementById('txtObjImporte').value = String(row.IMPORTE || 0);
    $('#modal_concurso_obj').modal('show');
}

function conc_obj_guardar() {
    const id = Number(document.getElementById('txtObjId').value) || 0;
    const codemp = Number(document.getElementById('cmbObjVendedor').value) || 0;
    if (!codemp) {
        F.AvisoError('Seleccione un vendedor');
        return;
    }
    const btn = document.getElementById('btnObjGuardar');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-save fa-spin mr-1"></i> Guardando';
    }
    const payload = id
        ? {
            token: TOKEN,
            id,
            cobertura: document.getElementById('txtObjCobertura').value || 0,
            importe: document.getElementById('txtObjImporte').value || 0,
            codmarca: document.getElementById('cmbObjMarca').value || 0
        }
        : {
            token: TOKEN,
            idconcurso: concursos_sel,
            codemp,
            codmarca: document.getElementById('cmbObjMarca').value || 0,
            cobertura: document.getElementById('txtObjCobertura').value || 0,
            importe: document.getElementById('txtObjImporte').value || 0
        };
    axios.post(GlobalUrlCalls + (id ? '/concursos/objetivo_update' : '/concursos/objetivo_insert'), payload)
        .then((res) => {
            if (!res.data || res.data === 'error' || res.data.ok === false) {
                throw new Error((res.data && res.data.error) || 'error');
            }
            $('#modal_concurso_obj').modal('hide');
            F.Aviso(id ? 'Objetivo actualizado' : 'Objetivo agregado');
            conc_cargar();
            conc_cargar_obj();
        })
        .catch((e) => F.AvisoError((e && e.message && e.message !== 'error') ? e.message : 'No se pudo guardar el objetivo'))
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fal fa-save mr-1"></i> Guardar';
            }
        });
}

function conc_obj_eliminar(id) {
    F.Confirmacion('¿Quitar este objetivo?')
        .then((ok) => {
            if (!ok) return;
            axios.post(GlobalUrlCalls + '/concursos/objetivo_delete', { token: TOKEN, id })
                .then((res) => {
                    if (!res.data || res.data === 'error') throw new Error('error');
                    F.showToast('Objetivo eliminado');
                    conc_cargar();
                    conc_cargar_obj();
                })
                .catch(() => F.AvisoError('No se pudo eliminar'));
        });
}

function conc_cargar_combos() {
    document.getElementById('cmbConcursoMes').innerHTML = F.ComboMeses();
    document.getElementById('cmbConcursoAnio').innerHTML = F.ComboAnio();
    document.getElementById('cmbConcursoMesModal').innerHTML = F.ComboMeses();
    document.getElementById('cmbConcursoAnioModal').innerHTML = F.ComboAnio();
    document.getElementById('cmbConcursoMes').value = F.get_mes_curso();
    document.getElementById('cmbConcursoAnio').value = F.get_anio_curso();

    GF.get_data_empresas()
        .then((data) => {
            const cmb = document.getElementById('cmbConcursoSucursal');
            cmb.innerHTML = (data.recordset || []).map((r) => `<option value="${r.EMPNIT}">${conc_esc(r.NOMBRE)}</option>`).join('');
            cmb.value = GlobalEmpnit;
            conc_cargar_vendedores();
            conc_cargar();
        })
        .catch(() => {
            document.getElementById('cmbConcursoSucursal').innerHTML = `<option value="${GlobalEmpnit}">${GlobalNomEmpresa || GlobalEmpnit}</option>`;
            conc_cargar_vendedores();
            conc_cargar();
        });

    GF.get_data_marcas()
        .then((data) => {
            const cmb = document.getElementById('cmbObjMarca');
            cmb.innerHTML = ['<option value="0">TODAS</option>']
                .concat((data.recordset || []).map((r) => `<option value="${r.CODMARCA}">${conc_esc(r.DESMARCA)}</option>`))
                .join('');
        })
        .catch(() => {
            document.getElementById('cmbObjMarca').innerHTML = '<option value="0">TODAS</option>';
        });
}

function conc_cargar_vendedores() {
    const suc = document.getElementById('cmbConcursoSucursal')?.value || GlobalEmpnit;
    GF.get_data_empleados_tipo_emp(300, suc)
        .then((data) => {
            document.getElementById('cmbObjVendedor').innerHTML = (data.recordset || [])
                .map((r) => `<option value="${r.CODEMPLEADO}">${conc_esc(r.NOMEMPLEADO)}</option>`)
                .join('');
        })
        .catch(() => {
            document.getElementById('cmbObjVendedor').innerHTML = '';
        });
}

function addListeners() {
    if (!document.getElementById('concursos-styles')) {
        const st = document.createElement('style');
        st.id = 'concursos-styles';
        st.textContent = `
            .conc-header .card-body { min-height: 0; }
            .conc-filtros .form-control-sm { height: calc(1.5em + 0.5rem + 2px); padding-top: 0.15rem; padding-bottom: 0.15rem; }
            .conc-actions { white-space: nowrap; }
            .conc-actions .btn-xs { font-size: 0.68rem; padding: 0.15rem 0.35rem; margin-left: 0.15rem; vertical-align: middle; }
            .conc-badge { border-radius:999px; min-width:3.2rem; font-weight:800; }
            .conc-badge.is-si { background:#dcfce7; color:#166534; }
            .conc-badge.is-no { background:#fee2e2; color:#b91c1c; }
            .conc-badge:not(.is-on) { opacity:0.38; }
            .conc-badge.is-on { box-shadow:0 0 0 2px currentColor; }
            .conc-pill { font-size:0.7rem; font-weight:800; padding:0.1rem 0.5rem; border-radius:999px; }
            .conc-pill.is-on { background:#dcfce7; color:#166534; }
            .conc-pill.is-off { background:#fee2e2; color:#b91c1c; }
            .conc-pct { font-size:0.75rem; font-weight:800; padding:0.1rem 0.4rem; border-radius:999px; }
            .conc-pct.conc-ok { background:#dcfce7; color:#166534; }
            .conc-pct.conc-warn { background:#fef9c3; color:#854d0e; }
            .conc-pct.conc-bad { background:#fee2e2; color:#b91c1c; }
            body.sygma-dark .conc-badge.is-si, body.sygma-dark .conc-pill.is-on, body.sygma-dark .conc-pct.conc-ok { background:#14532d; color:#86efac; }
            body.sygma-dark .conc-badge.is-no, body.sygma-dark .conc-pill.is-off, body.sygma-dark .conc-pct.conc-bad { background:#7f1d1d; color:#fecaca; }
            body.sygma-dark .conc-pct.conc-warn { background:#713f12; color:#fde047; }
        `;
        document.head.appendChild(st);
    }

    conc_cargar_combos();

    document.getElementById('cmbConcursoSucursal')?.addEventListener('change', () => {
        conc_limpiar_sel();
        conc_volver_listado();
        conc_cargar_vendedores();
        conc_cargar();
    });
    document.getElementById('cmbConcursoMes')?.addEventListener('change', () => {
        conc_limpiar_sel();
        conc_volver_listado();
        conc_cargar();
    });
    document.getElementById('cmbConcursoAnio')?.addEventListener('change', () => {
        conc_limpiar_sel();
        conc_volver_listado();
        conc_cargar();
    });
    document.getElementById('txtConcursoBuscar')?.addEventListener('input', conc_pintar);
    document.getElementById('btnConcursoNuevo')?.addEventListener('click', conc_nuevo);
    document.getElementById('btnConcursoGuardar')?.addEventListener('click', conc_guardar);
    document.getElementById('btnConcSI')?.addEventListener('click', () => conc_setActivoUI('SI'));
    document.getElementById('btnConcNO')?.addEventListener('click', () => conc_setActivoUI('NO'));
    document.getElementById('btnObjNuevo')?.addEventListener('click', conc_obj_nuevo);
    document.getElementById('btnObjGuardar')?.addEventListener('click', conc_obj_guardar);
    document.getElementById('btnConcVolverObj')?.addEventListener('click', conc_volver_listado);
    document.getElementById('btnConcVolverSeg')?.addEventListener('click', conc_volver_listado);
    document.getElementById('btnCopiarGuardar')?.addEventListener('click', conc_copiar_guardar);
    $('#modal_concurso_obj').on('hidden.bs.modal', () => {
        const cmbVen = document.getElementById('cmbObjVendedor');
        if (cmbVen) cmbVen.disabled = false;
    });
}

function initView() {
    getView();
    addListeners();
}

function destroyView() {
    concursos_cache = [];
    concursos_sel = 0;
    conc_view = 'listado';
    try { $('#modal_concurso').modal('hide'); } catch (e) {}
    try { $('#modal_concurso_obj').modal('hide'); } catch (e) {}
    try { $('#modal_concurso_copiar').modal('hide'); } catch (e) {}
}
