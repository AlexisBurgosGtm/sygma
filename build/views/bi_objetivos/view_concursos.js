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
                                            <th>MARCA</th>
                                            <th class="text-center">PRODS</th>
                                            <th class="text-center">ACTIVO</th>
                                            <th class="text-center">OBJ.</th>
                                            <th class="text-right">ACCIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataConcursos">
                                        <tr><td colspan="6" class="text-center text-muted">Cargando...</td></tr>
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
                                            <th class="text-right">COBERTURA</th>
                                            <th class="text-right">IMPORTE</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                        <tbody id="tblDataConcursoObj">
                                            <tr><td colspan="4" class="text-center text-muted">Cargando...</td></tr>
                                        </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="concPanelSeguimiento" class="d-none">
                    <div class="card card-rounded shadow border-0">
                        <div class="card-body p-3">
                            <div class="d-flex flex-wrap align-items-center justify-content-between mb-2">
                                <div class="d-flex flex-wrap align-items-center">
                                    <button type="button" class="btn btn-outline-secondary btn-sm hand negrita mr-2 mb-1" id="btnConcVolverSeg">
                                        <i class="fal fa-arrow-left mr-1"></i> Atrás
                                    </button>
                                    <div class="mb-1">
                                        <h5 class="negrita text-base mb-0">Seguimiento vs ventas</h5>
                                        <small class="text-muted" id="lbConcursoSelSeg">—</small>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-success btn-sm hand negrita mb-1" id="btnConcSegExcel">
                                    <i class="fal fa-file-excel mr-1"></i> Exportar Excel
                                </button>
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
                    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
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
                                <label class="negrita small mb-1 mt-2">Marca a medir</label>
                                <select class="form-control form-control-sm" id="cmbConcMarca"></select>
                                <div id="concConcProdBox" class="mt-2">
                                    <div class="d-flex flex-wrap align-items-center justify-content-between mb-1">
                                        <label class="negrita small mb-0">Productos</label>
                                        <span class="small text-muted" id="lbConcProdCount">0 seleccionados</span>
                                    </div>
                                    <div class="d-flex flex-wrap mb-1">
                                        <button type="button" class="btn btn-xs btn-outline-success hand mr-1" id="btnConcProdAll">Todos</button>
                                        <button type="button" class="btn btn-xs btn-outline-secondary hand mr-2" id="btnConcProdNone">Ninguno</button>
                                        <input type="search" class="form-control form-control-sm flex-grow-1" id="txtConcProdBuscar" placeholder="Buscar producto...">
                                    </div>
                                    <div class="conc-obj-prod-list border rounded p-2" id="concConcProdList">
                                        <span class="text-muted small">Seleccione una marca</span>
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

                <div class="modal fade" tabindex="-1" role="dialog" id="modal_concurso_seg_det">
                    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header bg-base text-white py-2">
                                <h5 class="modal-title negrita mb-0" id="lbSegDetTitulo">Ventas por producto</h5>
                            </div>
                            <div class="modal-body p-3">
                                <p class="small text-muted mb-2" id="lbSegDetSub">—</p>
                                <div class="table-responsive">
                                    <table class="table table-sm table-hover mb-0">
                                        <thead class="bg-secondary text-white">
                                            <tr>
                                                <th>CODPROD</th>
                                                <th>PRODUCTO</th>
                                                <th class="text-right">IMPORTE</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataSegDet">
                                            <tr><td colspan="3" class="text-center text-muted">—</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="modal-footer py-2">
                                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
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
var conc_con_prod_cache = [];
var conc_con_prod_selected = null;
var conc_seg_cache = [];

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
    if (box) box.innerHTML = `<tr><td colspan="6" class="text-center">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</td></tr>`;
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
            if (box) box.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No se pudieron cargar los concursos.</td></tr>';
        });
}

function conc_pintar() {
    const box = document.getElementById('tblDataConcursos');
    if (!box) return;
    const q = String(document.getElementById('txtConcursoBuscar')?.value || '').toLowerCase().trim();
    const rows = concursos_cache.filter((r) => !q || String(r.NOMBRE || '').toLowerCase().indexOf(q) >= 0);
    if (!rows.length) {
        box.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay concursos en este período.</td></tr>';
        return;
    }
    box.innerHTML = rows.map((r) => {
        const id = Number(r.IDCONCURSO) || 0;
        const on = String(r.ACTIVO || 'NO').toUpperCase() === 'SI';
        return `
            <tr>
                <td class="negrita">${conc_esc(r.NOMBRE)}</td>
                <td>${conc_esc(r.DESMARCA || '—')}</td>
                <td class="text-center">${Number(r.NPROD) || 0}</td>
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

function conc_subtitulo_concurso(r) {
    if (!r) return concursos_sel_nom || '—';
    const marca = r.DESMARCA || 'Sin marca';
    const prods = Number(r.NPROD) || 0;
    return `${r.NOMBRE || concursos_sel_nom} · ${marca} · ${prods} producto${prods === 1 ? '' : 's'}`;
}

function conc_ir_objetivos(id) {
    const r = conc_sel(id);
    if (!r) return;
    document.getElementById('lbConcursoSelObj').textContent = conc_subtitulo_concurso(r);
    conc_setView('objetivos');
    conc_cargar_obj();
}

function conc_ir_seguimiento(id) {
    const r = conc_sel(id);
    if (!r) return;
    document.getElementById('lbConcursoSelSeg').textContent = conc_subtitulo_concurso(r);
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
    if (box) box.innerHTML = `<tr><td colspan="4" class="text-center">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</td></tr>`;
    axios.post(GlobalUrlCalls + '/concursos/objetivos', { token: TOKEN, idconcurso: concursos_sel })
        .then((res) => {
            if (!res.data || res.data === 'error') throw new Error('error');
            conc_pintar_obj(res.data.recordset || []);
        })
        .catch(() => {
            if (box) box.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No se pudieron cargar los objetivos.</td></tr>';
        });
}

function conc_pintar_obj(rows) {
    const box = document.getElementById('tblDataConcursoObj');
    if (!box) return;
    if (!rows.length) {
        box.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Sin objetivos. Agregue vendedores.</td></tr>';
        return;
    }
    box.innerHTML = rows.map((r) => `
        <tr>
            <td>${conc_esc(r.NOMEMPLEADO || r.CODEMP)}</td>
            <td class="text-right">${Number(r.COBERTURA) || 0}</td>
            <td class="text-right">${conc_mon(r.IMPORTE)}</td>
            <td class="text-right">
                <button type="button" class="btn btn-xs btn-info hand" title="Editar" onclick='conc_obj_editar(${JSON.stringify({
                    ID: Number(r.ID) || 0,
                    CODEMP: Number(r.CODEMP) || 0,
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
            conc_seg_cache = res.data.recordset || [];
            conc_pintar_seg(conc_seg_cache);
        })
        .catch((e) => {
            conc_seg_cache = [];
            if (box) box.innerHTML = `<tr><td colspan="8" class="text-center text-muted">${conc_esc((e && e.message && e.message !== 'error') ? e.message : 'No se pudo cargar el seguimiento.')}</td></tr>`;
        });
}

function conc_seg_export_excel() {
    if (!conc_seg_cache.length) {
        F.AvisoError('No hay datos de seguimiento para exportar');
        return;
    }
    const datos = conc_seg_cache.map((r) => {
        const pctCob = conc_pct(r.REAL_COBERTURA, r.OBJ_COBERTURA);
        const pctImp = conc_pct(r.REAL_IMPORTE, r.OBJ_IMPORTE);
        return {
            VENDEDOR: r.NOMEMPLEADO || r.CODEMP,
            MARCA: r.DESMARCA || 'TODAS',
            'OBJ. COBERTURA': Number(r.OBJ_COBERTURA) || 0,
            'REAL COBERTURA': Number(r.REAL_COBERTURA) || 0,
            '% COBERTURA': pctCob,
            'OBJ. IMPORTE': Number(r.OBJ_IMPORTE) || 0,
            'REAL IMPORTE': Number(r.REAL_IMPORTE) || 0,
            '% IMPORTE': pctImp
        };
    });
    const nom = String(concursos_sel_nom || 'Concurso').replace(/[\\/:*?"<>|]/g, '_').slice(0, 80);
    F.export_json_to_xlsx(datos, `Seguimiento ${nom}`);
}

function conc_seg_det_abrir(idObjetivo) {
    const row = conc_seg_cache.find((x) => Number(x.ID) === Number(idObjetivo));
    if (!row) return;
    const box = document.getElementById('tblDataSegDet');
    document.getElementById('lbSegDetTitulo').textContent = `Ventas — ${row.NOMEMPLEADO || row.CODEMP}`;
    document.getElementById('lbSegDetSub').textContent = `Marca: ${row.DESMARCA || 'TODAS'} · Solo ventas del período (sin comparar objetivo)`;
    if (box) box.innerHTML = `<tr><td colspan="3" class="text-center">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</td></tr>`;
    $('#modal_concurso_seg_det').modal('show');
    axios.post(GlobalUrlCalls + '/concursos/seguimiento_detalle', { token: TOKEN, id_objetivo: idObjetivo })
        .then((res) => {
            if (!res.data || res.data.ok === false) throw new Error((res.data && res.data.error) || 'error');
            const cob = Number(res.data.cobertura_marca) || 0;
            document.getElementById('lbSegDetSub').textContent =
                `Marca: ${row.DESMARCA || 'TODAS'} · Cobertura (clientes únicos): ${cob} · Importe por producto del listado`;
            conc_seg_det_pintar(res.data.recordset || [], row, cob);
        })
        .catch((e) => {
            if (box) {
                box.innerHTML = `<tr><td colspan="3" class="text-center text-muted">${conc_esc((e && e.message && e.message !== 'error') ? e.message : 'No se pudo cargar el detalle.')}</td></tr>`;
            }
        });
}

function conc_seg_det_pintar(rows, hdr, coberturaMarca) {
    const box = document.getElementById('tblDataSegDet');
    if (!box) return;
    const concRow = conc_getRow(concursos_sel);
    if (concRow && !(Number(concRow.NPROD) > 0)) {
        box.innerHTML = '<tr><td colspan="3" class="text-center text-muted">El concurso no tiene productos configurados. Edítelo en el listado.</td></tr>';
        return;
    }
    if (!rows.length) {
        box.innerHTML = `<tr><td colspan="3" class="text-center text-muted">Sin ventas de productos del listado. Cobertura: ${Number(coberturaMarca) || 0}</td></tr>`;
        return;
    }
    let totImp = 0;
    const body = rows.map((r) => {
        const imp = Number(r.IMPORTE) || 0;
        totImp += imp;
        return `
            <tr>
                <td class="negrita">${conc_esc(r.CODPROD)}</td>
                <td>${conc_esc(r.DESPROD)}</td>
                <td class="text-right">${conc_mon(imp)}</td>
            </tr>`;
    }).join('');
    box.innerHTML = body + `
        <tr class="bg-light negrita">
            <td colspan="2" class="text-right">TOTAL IMPORTE</td>
            <td class="text-right">${conc_mon(totImp)}</td>
        </tr>
        <tr class="bg-light negrita">
            <td colspan="2" class="text-right">COBERTURA (clientes únicos)</td>
            <td class="text-right">${Number(coberturaMarca) || 0}</td>
        </tr>`;
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
        const sinProd = !(Number(r.NPROD) > 0);
        const idObj = Number(r.ID) || 0;
        return `
        <tr${sinProd ? ' class="table-warning"' : ''}>
            <td>
                <span class="text-primary hand negrita conc-vend-link" onclick="conc_seg_det_abrir(${idObj})" title="Ver productos vendidos">${conc_esc(r.NOMEMPLEADO || r.CODEMP)}</span>${sinProd ? ' <span class="small text-muted">(sin productos — edite concurso)</span>' : ''}
            </td>
            <td>${conc_esc(r.DESMARCA || '—')}</td>
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
    document.getElementById('txtConcProdBuscar').value = '';
    document.getElementById('cmbConcMarca').value = '0';
    document.getElementById('lbConcursoTitulo').textContent = 'Nuevo concurso';
    conc_setActivoUI('SI');
    conc_con_cargar_productos(0, 0).then(() => $('#modal_concurso').modal('show'));
}

function conc_editar(id) {
    const r = conc_getRow(id);
    if (!r) return;
    document.getElementById('txtConcursoId').value = String(id);
    document.getElementById('txtConcursoNombre').value = r.NOMBRE || '';
    document.getElementById('cmbConcursoMesModal').value = String(r.MES);
    document.getElementById('cmbConcursoAnioModal').value = String(r.ANIO);
    document.getElementById('cmbConcMarca').value = String(r.CODMARCA || 0);
    document.getElementById('txtConcProdBuscar').value = '';
    document.getElementById('lbConcursoTitulo').textContent = 'Editar concurso';
    conc_setActivoUI(r.ACTIVO);
    conc_con_cargar_productos(r.CODMARCA || 0, id).then(() => $('#modal_concurso').modal('show'));
}

function conc_guardar() {
    const nombre = String(document.getElementById('txtConcursoNombre').value || '').trim();
    if (!nombre) {
        F.AvisoError('Escriba el nombre del concurso');
        return;
    }
    const id = Number(document.getElementById('txtConcursoId').value) || 0;
    const btn = document.getElementById('btnConcursoGuardar');
    const codmarca = Number(document.getElementById('cmbConcMarca').value) || 0;
    const productos = conc_con_prod_get_checked();
    if (!codmarca) {
        F.AvisoError('Seleccione la marca del concurso');
        return;
    }
    if (!productos.length) {
        F.AvisoError('Seleccione al menos un producto');
        return;
    }
    const payload = {
        token: TOKEN,
        sucursal: document.getElementById('cmbConcursoSucursal').value,
        nombre,
        mes: document.getElementById('cmbConcursoMesModal').value,
        anio: document.getElementById('cmbConcursoAnioModal').value,
        activo: conc_getActivo(),
        codmarca,
        productos
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

function conc_con_prod_sync_from_dom() {
    if (!conc_con_prod_selected) conc_con_prod_selected = new Set();
    document.querySelectorAll('#concConcProdList input.conc-con-prod-chk').forEach((el) => {
        if (el.checked) conc_con_prod_selected.add(el.value);
        else conc_con_prod_selected.delete(el.value);
    });
}

function conc_con_prod_sel_count() {
    return conc_con_prod_selected ? conc_con_prod_selected.size : 0;
}

function conc_con_prod_update_count() {
    const lb = document.getElementById('lbConcProdCount');
    if (lb) lb.textContent = `${conc_con_prod_sel_count()} seleccionados`;
}

function conc_con_prod_get_checked() {
    conc_con_prod_sync_from_dom();
    return Array.from(conc_con_prod_selected || []);
}

function conc_con_prod_pintar(selectedSet) {
    const box = document.getElementById('concConcProdList');
    if (!box) return;
    if (selectedSet) conc_con_prod_selected = new Set(selectedSet);
    else conc_con_prod_sync_from_dom();
    const q = String(document.getElementById('txtConcProdBuscar')?.value || '').toLowerCase().trim();
    const rows = conc_con_prod_cache.filter((r) => {
        if (!q) return true;
        const t = `${r.CODPROD} ${r.DESPROD}`.toLowerCase();
        return t.indexOf(q) >= 0;
    });
    if (!(Number(document.getElementById('cmbConcMarca')?.value) > 0)) {
        box.innerHTML = '<span class="text-muted small">Seleccione una marca</span>';
        conc_con_prod_update_count();
        return;
    }
    if (!conc_con_prod_cache.length) {
        box.innerHTML = '<span class="text-muted small">No hay productos habilitados en esta marca.</span>';
        conc_con_prod_update_count();
        return;
    }
    if (!rows.length) {
        box.innerHTML = '<span class="text-muted small">Sin coincidencias.</span>';
        conc_con_prod_update_count();
        return;
    }
    const sel = conc_con_prod_selected || new Set();
    box.innerHTML = rows.map((r) => {
        const cod = String(r.CODPROD);
        const on = sel.has(cod);
        return `
            <label class="conc-obj-prod-item d-flex align-items-start hand mb-1">
                <input type="checkbox" class="conc-con-prod-chk mr-2 mt-1" value="${conc_esc(cod)}" ${on ? 'checked' : ''}>
                <span><span class="negrita">${conc_esc(cod)}</span> — ${conc_esc(r.DESPROD)}</span>
            </label>`;
    }).join('');
    box.querySelectorAll('.conc-con-prod-chk').forEach((el) => {
        el.addEventListener('change', () => {
            if (!conc_con_prod_selected) conc_con_prod_selected = new Set();
            if (el.checked) conc_con_prod_selected.add(el.value);
            else conc_con_prod_selected.delete(el.value);
            conc_con_prod_update_count();
        });
    });
    conc_con_prod_update_count();
}

function conc_con_cargar_productos(marca, idConcurso) {
    conc_con_prod_cache = [];
    conc_con_prod_selected = null;
    const list = document.getElementById('concConcProdList');
    if (!(Number(marca) > 0)) {
        if (list) list.innerHTML = '<span class="text-muted small">Seleccione una marca</span>';
        conc_con_prod_update_count();
        return Promise.resolve();
    }
    if (list) list.innerHTML = `<span class="text-muted small">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando productos...'}</span>`;
    const loadProds = axios.post(GlobalUrlCalls + '/concursos/productos_marca', { token: TOKEN, codmarca: marca })
        .then((res) => {
            if (!res.data || res.data === 'error') throw new Error('error');
            conc_con_prod_cache = res.data.recordset || [];
        });
    const loadSel = (Number(idConcurso) > 0)
        ? axios.post(GlobalUrlCalls + '/concursos/concurso_productos', { token: TOKEN, idconcurso: idConcurso })
            .then((res) => {
                if (!res.data || res.data === 'error') throw new Error('error');
                return new Set((res.data.recordset || []).map((r) => String(r.CODPROD)));
            })
        : Promise.resolve(null);
    return Promise.all([loadProds, loadSel])
        .then(([, selSet]) => {
            const all = new Set(conc_con_prod_cache.map((r) => String(r.CODPROD)));
            const selected = selSet && selSet.size ? selSet : all;
            conc_con_prod_pintar(selected);
        })
        .catch(() => {
            conc_con_prod_cache = [];
            if (list) list.innerHTML = '<span class="text-danger small">No se pudieron cargar los productos.</span>';
            conc_con_prod_update_count();
        });
}

function conc_obj_nuevo() {
    if (!concursos_sel) {
        F.AvisoError('Seleccione un concurso');
        return;
    }
    const c = conc_getRow(concursos_sel);
    if (c && !(Number(c.NPROD) > 0)) {
        F.AvisoError('Configure marca y productos en el concurso antes de agregar objetivos');
        return;
    }
    document.getElementById('txtObjId').value = '0';
    document.getElementById('txtObjCobertura').value = '0';
    document.getElementById('txtObjImporte').value = '0';
    const cmbVen = document.getElementById('cmbObjVendedor');
    if (cmbVen) cmbVen.disabled = false;
    $('#modal_concurso_obj').modal('show');
}

function conc_obj_editar(row) {
    if (!row || !row.ID) return;
    document.getElementById('txtObjId').value = String(row.ID);
    document.getElementById('cmbObjVendedor').value = String(row.CODEMP);
    document.getElementById('cmbObjVendedor').disabled = true;
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
            importe: document.getElementById('txtObjImporte').value || 0
        }
        : {
            token: TOKEN,
            idconcurso: concursos_sel,
            codemp,
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
            const opts = (data.recordset || []).map((r) => `<option value="${r.CODMARCA}">${conc_esc(r.DESMARCA)}</option>`);
            const cmb = document.getElementById('cmbConcMarca');
            if (cmb) cmb.innerHTML = ['<option value="0">Seleccione marca...</option>'].concat(opts).join('');
        })
        .catch(() => {
            const cmb = document.getElementById('cmbConcMarca');
            if (cmb) cmb.innerHTML = '<option value="0">Seleccione marca...</option>';
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
            .conc-obj-prod-list { max-height: 220px; overflow-y: auto; background: rgba(0,0,0,0.02); }
            body.sygma-dark .conc-obj-prod-list { background: rgba(255,255,255,0.04); }
            .conc-obj-prod-item { font-size: 0.82rem; line-height: 1.25; }
            .conc-vend-link { text-decoration: underline; text-underline-offset: 2px; }
            .conc-vend-link:hover { opacity: 0.85; }
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
    document.getElementById('btnConcSegExcel')?.addEventListener('click', conc_seg_export_excel);
    document.getElementById('btnCopiarGuardar')?.addEventListener('click', conc_copiar_guardar);
    document.getElementById('cmbConcMarca')?.addEventListener('change', (e) => {
        document.getElementById('txtConcProdBuscar').value = '';
        const idConc = Number(document.getElementById('txtConcursoId').value) || 0;
        conc_con_cargar_productos(e.target.value, idConc);
    });
    document.getElementById('txtConcProdBuscar')?.addEventListener('input', () => {
        conc_con_prod_pintar();
    });
    document.getElementById('btnConcProdAll')?.addEventListener('click', () => {
        conc_con_prod_pintar(new Set(conc_con_prod_cache.map((r) => String(r.CODPROD))));
    });
    document.getElementById('btnConcProdNone')?.addEventListener('click', () => {
        conc_con_prod_pintar(new Set());
    });
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
    try { $('#modal_concurso_seg_det').modal('hide'); } catch (e) {}
    conc_seg_cache = [];
}
