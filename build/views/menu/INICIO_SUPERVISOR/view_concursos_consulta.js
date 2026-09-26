'use strict';

var sup_conc_cache = [];
var sup_conc_sel = 0;
var sup_conc_sel_nom = '';
var sup_conc_view = 'listado';
var sup_conc_seg_cache = [];

function sup_conc_esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function sup_conc_mon(v) {
    return typeof F.setMoneda === 'function' ? F.setMoneda(v, 'Q') : v;
}

function sup_conc_pct(real, obj) {
    const o = Number(obj) || 0;
    const r = Number(real) || 0;
    if (o <= 0) return r > 0 ? 100 : 0;
    return Math.round((r / o) * 1000) / 10;
}

function sup_conc_pctClass(pct) {
    if (pct >= 100) return 'conc-ok';
    if (pct >= 80) return 'conc-warn';
    return 'conc-bad';
}

function sup_conc_filtros() {
    const suc = typeof supervisor_getSucursal === 'function'
        ? supervisor_getSucursal()
        : (GlobalEmpnit || '');
    const mes = typeof supervisor_getMes === 'function' ? supervisor_getMes() : F.get_mes_curso();
    const anio = typeof supervisor_getAnio === 'function' ? supervisor_getAnio() : F.get_anio_curso();
    return { sucursal: suc, mes, anio };
}

function sup_conc_getRow(id) {
    return sup_conc_cache.find((x) => Number(x.IDCONCURSO) === Number(id));
}

function sup_conc_setView(v) {
    sup_conc_view = v;
    document.getElementById('supConcPanelListado')?.classList.toggle('d-none', v !== 'listado');
    document.getElementById('supConcPanelSeguimiento')?.classList.toggle('d-none', v !== 'seguimiento');
}

function sup_conc_volver_listado() {
    sup_conc_setView('listado');
}

function sup_conc_limpiar_sel() {
    sup_conc_sel = 0;
    sup_conc_sel_nom = '';
}

function sup_conc_subtitulo(r) {
    if (!r) return sup_conc_sel_nom || '—';
    const marca = r.DESMARCA || 'Sin marca';
    const prods = Number(r.NPROD) || 0;
    return `${r.NOMBRE || sup_conc_sel_nom} · ${marca} · ${prods} producto${prods === 1 ? '' : 's'}`;
}

function sup_conc_seleccionar(id) {
    const r = sup_conc_getRow(id);
    if (!r) return null;
    sup_conc_sel = Number(id);
    sup_conc_sel_nom = r.NOMBRE || ('Concurso ' + id);
    return r;
}

function sup_conc_cargar() {
    const box = document.getElementById('tblDataSupConcursos');
    if (box) {
        box.innerHTML = `<tr><td colspan="5" class="text-center">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</td></tr>`;
    }
    const f = sup_conc_filtros();
    axios.post(GlobalUrlCalls + '/concursos/listado', { token: TOKEN, ...f })
        .then((res) => {
            if (!res.data || res.data === 'error') throw new Error('error');
            sup_conc_cache = res.data.recordset || [];
            if (sup_conc_sel && !sup_conc_getRow(sup_conc_sel)) sup_conc_limpiar_sel();
            if (sup_conc_view === 'seguimiento' && sup_conc_sel) {
                document.getElementById('lbSupConcursoSelSeg').textContent = sup_conc_subtitulo(sup_conc_getRow(sup_conc_sel));
                sup_conc_cargar_seg();
            }
            sup_conc_pintar();
        })
        .catch(() => {
            sup_conc_cache = [];
            if (box) box.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se pudieron cargar los concursos.</td></tr>';
        });
}

function sup_conc_pintar() {
    const box = document.getElementById('tblDataSupConcursos');
    if (!box) return;
    const q = String(document.getElementById('txtSupConcursoBuscar')?.value || '').toLowerCase().trim();
    const rows = sup_conc_cache.filter((r) => !q || String(r.NOMBRE || '').toLowerCase().indexOf(q) >= 0);
    if (!rows.length) {
        box.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay concursos en este período.</td></tr>';
        return;
    }
    box.innerHTML = rows.map((r) => {
        const id = Number(r.IDCONCURSO) || 0;
        const on = String(r.ACTIVO || 'NO').toUpperCase() === 'SI';
        return `
            <tr class="hand" onclick="sup_conc_ir_seguimiento(${id})" title="Ver seguimiento">
                <td class="negrita text-primary">${sup_conc_esc(r.NOMBRE)}</td>
                <td>${sup_conc_esc(r.DESMARCA || '—')}</td>
                <td class="text-center">${Number(r.NPROD) || 0}</td>
                <td class="text-center"><span class="conc-pill ${on ? 'is-on' : 'is-off'}">${on ? 'SI' : 'NO'}</span></td>
                <td class="text-center">${Number(r.NOBJ) || 0}</td>
            </tr>`;
    }).join('');
}

function sup_conc_ir_seguimiento(id) {
    const r = sup_conc_seleccionar(id);
    if (!r) return;
    document.getElementById('lbSupConcursoSelSeg').textContent = sup_conc_subtitulo(r);
    sup_conc_setView('seguimiento');
    sup_conc_cargar_seg();
}

function sup_conc_cargar_seg() {
    const box = document.getElementById('tblDataSupConcursoSeg');
    if (!sup_conc_sel) return;
    if (box) box.innerHTML = `<tr><td colspan="8" class="text-center">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</td></tr>`;
    axios.post(GlobalUrlCalls + '/concursos/seguimiento', { token: TOKEN, idconcurso: sup_conc_sel })
        .then((res) => {
            if (!res.data || res.data.ok === false) throw new Error((res.data && res.data.error) || 'error');
            sup_conc_seg_cache = res.data.recordset || [];
            sup_conc_pintar_seg(sup_conc_seg_cache);
        })
        .catch((e) => {
            sup_conc_seg_cache = [];
            if (box) {
                box.innerHTML = `<tr><td colspan="8" class="text-center text-muted">${sup_conc_esc((e && e.message && e.message !== 'error') ? e.message : 'No se pudo cargar el seguimiento.')}</td></tr>`;
            }
        });
}

function sup_conc_seg_export_excel() {
    if (!sup_conc_seg_cache.length) {
        F.AvisoError('No hay datos de seguimiento para exportar');
        return;
    }
    const datos = sup_conc_seg_cache.map((r) => {
        const pctCob = sup_conc_pct(r.REAL_COBERTURA, r.OBJ_COBERTURA);
        const pctImp = sup_conc_pct(r.REAL_IMPORTE, r.OBJ_IMPORTE);
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
    const nom = String(sup_conc_sel_nom || 'Concurso').replace(/[\\/:*?"<>|]/g, '_').slice(0, 80);
    F.export_json_to_xlsx(datos, `Seguimiento ${nom}`);
}

function sup_conc_seg_det_abrir(idObjetivo) {
    const row = sup_conc_seg_cache.find((x) => Number(x.ID) === Number(idObjetivo));
    if (!row) return;
    const box = document.getElementById('tblDataSupSegDet');
    document.getElementById('lbSupSegDetTitulo').textContent = `Ventas — ${row.NOMEMPLEADO || row.CODEMP}`;
    document.getElementById('lbSupSegDetSub').textContent = `Marca: ${row.DESMARCA || 'TODAS'}`;
    if (box) box.innerHTML = `<tr><td colspan="3" class="text-center">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</td></tr>`;
    $('#modal_sup_conc_seg_det').modal('show');
    axios.post(GlobalUrlCalls + '/concursos/seguimiento_detalle', { token: TOKEN, id_objetivo: idObjetivo })
        .then((res) => {
            if (!res.data || res.data.ok === false) throw new Error((res.data && res.data.error) || 'error');
            const cob = Number(res.data.cobertura_marca) || 0;
            document.getElementById('lbSupSegDetSub').textContent =
                `Marca: ${row.DESMARCA || 'TODAS'} · Cobertura (clientes únicos): ${cob} · Importe por producto del listado`;
            sup_conc_seg_det_pintar(res.data.recordset || [], cob);
        })
        .catch((e) => {
            if (box) {
                box.innerHTML = `<tr><td colspan="3" class="text-center text-muted">${sup_conc_esc((e && e.message && e.message !== 'error') ? e.message : 'No se pudo cargar el detalle.')}</td></tr>`;
            }
        });
}

function sup_conc_seg_det_pintar(rows, coberturaMarca) {
    const box = document.getElementById('tblDataSupSegDet');
    if (!box) return;
    const concRow = sup_conc_getRow(sup_conc_sel);
    if (concRow && !(Number(concRow.NPROD) > 0)) {
        box.innerHTML = '<tr><td colspan="3" class="text-center text-muted">El concurso no tiene productos configurados.</td></tr>';
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
                <td class="negrita">${sup_conc_esc(r.CODPROD)}</td>
                <td>${sup_conc_esc(r.DESPROD)}</td>
                <td class="text-right">${sup_conc_mon(imp)}</td>
            </tr>`;
    }).join('');
    box.innerHTML = body + `
        <tr class="bg-light negrita">
            <td colspan="2" class="text-right">TOTAL IMPORTE</td>
            <td class="text-right">${sup_conc_mon(totImp)}</td>
        </tr>
        <tr class="bg-light negrita">
            <td colspan="2" class="text-right">COBERTURA (clientes únicos)</td>
            <td class="text-right">${Number(coberturaMarca) || 0}</td>
        </tr>`;
}

function sup_conc_pintar_seg(rows) {
    const box = document.getElementById('tblDataSupConcursoSeg');
    if (!box) return;
    if (!rows.length) {
        box.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Sin objetivos para comparar.</td></tr>';
        return;
    }
    box.innerHTML = rows.map((r) => {
        const pctCob = sup_conc_pct(r.REAL_COBERTURA, r.OBJ_COBERTURA);
        const pctImp = sup_conc_pct(r.REAL_IMPORTE, r.OBJ_IMPORTE);
        const sinProd = !(Number(r.NPROD) > 0);
        const idObj = Number(r.ID) || 0;
        return `
        <tr${sinProd ? ' class="table-warning"' : ''}>
            <td>
                <span class="text-primary hand negrita conc-vend-link" onclick="event.stopPropagation(); sup_conc_seg_det_abrir(${idObj})" title="Ver productos vendidos">${sup_conc_esc(r.NOMEMPLEADO || r.CODEMP)}</span>${sinProd ? ' <span class="small text-muted">(sin productos)</span>' : ''}
            </td>
            <td>${sup_conc_esc(r.DESMARCA || '—')}</td>
            <td class="text-right">${Number(r.OBJ_COBERTURA) || 0}</td>
            <td class="text-right negrita">${Number(r.REAL_COBERTURA) || 0}</td>
            <td class="text-right"><span class="conc-pct ${sup_conc_pctClass(pctCob)}">${pctCob}%</span></td>
            <td class="text-right">${sup_conc_mon(r.OBJ_IMPORTE)}</td>
            <td class="text-right negrita">${sup_conc_mon(r.REAL_IMPORTE)}</td>
            <td class="text-right"><span class="conc-pct ${sup_conc_pctClass(pctImp)}">${pctImp}%</span></td>
        </tr>`;
    }).join('');
}

function sup_conc_injectStyles() {
    if (document.getElementById('sup-concursos-styles')) return;
    const st = document.createElement('style');
    st.id = 'sup-concursos-styles';
    st.textContent = `
        .sup-conc-root .conc-pill { font-size:0.7rem; font-weight:800; padding:0.1rem 0.5rem; border-radius:999px; }
        .sup-conc-root .conc-pill.is-on { background:#dcfce7; color:#166534; }
        .sup-conc-root .conc-pill.is-off { background:#fee2e2; color:#b91c1c; }
        .sup-conc-root .conc-pct { font-size:0.75rem; font-weight:800; padding:0.1rem 0.4rem; border-radius:999px; }
        .sup-conc-root .conc-pct.conc-ok { background:#dcfce7; color:#166534; }
        .sup-conc-root .conc-pct.conc-warn { background:#fef9c3; color:#854d0e; }
        .sup-conc-root .conc-pct.conc-bad { background:#fee2e2; color:#b91c1c; }
        .sup-conc-root .conc-vend-link { text-decoration: underline; text-underline-offset: 2px; }
    `;
    document.head.appendChild(st);
}

function getView() {
    const html = `
        <div class="col-12 p-0 sup-conc-root proveedor-rpt-marcas">
            <div class="proveedor-rpt-marcas__hero card shadow-sm mb-3">
                <div class="card-body py-3 px-4">
                    <h5 class="negrita text-danger mb-1">Concursos</h5>
                    <small class="text-muted d-block">Sede fija al iniciar sesión. Mes y año según el encabezado. Clic en un concurso para ver el seguimiento.</small>
                </div>
            </div>

            <div id="supConcPanelListado">
                <div class="card card-rounded shadow border-0">
                    <div class="card-body p-3">
                        <input type="search" class="form-control form-control-sm mb-2" id="txtSupConcursoBuscar" placeholder="Buscar concurso...">
                        <div class="table-responsive">
                            <table class="table table-sm table-hover mb-0" id="tblSupConcursos">
                                <thead class="bg-base text-white">
                                    <tr>
                                        <th>CONCURSO</th>
                                        <th>MARCA</th>
                                        <th class="text-center">PRODS</th>
                                        <th class="text-center">ACTIVO</th>
                                        <th class="text-center">OBJ.</th>
                                    </tr>
                                </thead>
                                <tbody id="tblDataSupConcursos">
                                    <tr><td colspan="5" class="text-center text-muted">Cargando...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div id="supConcPanelSeguimiento" class="d-none">
                <div class="card card-rounded shadow border-0">
                    <div class="card-body p-3">
                        <div class="d-flex flex-wrap align-items-center justify-content-between mb-2">
                            <div class="d-flex flex-wrap align-items-center">
                                <button type="button" class="btn btn-outline-secondary btn-sm hand negrita mr-2 mb-1" id="btnSupConcVolverSeg" data-supervisor-keep="true">
                                    <i class="fal fa-arrow-left mr-1"></i> Atrás
                                </button>
                                <div class="mb-1">
                                    <h5 class="negrita text-base mb-0">Seguimiento vs ventas</h5>
                                    <small class="text-muted" id="lbSupConcursoSelSeg">—</small>
                                </div>
                            </div>
                            <button type="button" class="btn btn-success btn-sm hand negrita mb-1" id="btnSupConcSegExcel">
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
                                <tbody id="tblDataSupConcursoSeg">
                                    <tr><td colspan="8" class="text-center text-muted">Cargando...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" tabindex="-1" role="dialog" id="modal_sup_conc_seg_det">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-base text-white py-2">
                            <h5 class="modal-title negrita mb-0" id="lbSupSegDetTitulo">Ventas por producto</h5>
                        </div>
                        <div class="modal-body p-3">
                            <p class="small text-muted mb-2" id="lbSupSegDetSub">—</p>
                            <div class="table-responsive">
                                <table class="table table-sm table-hover mb-0">
                                    <thead class="bg-secondary text-white">
                                        <tr>
                                            <th>CODPROD</th>
                                            <th>PRODUCTO</th>
                                            <th class="text-right">IMPORTE</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataSupSegDet">
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
        </div>`;
    const el = typeof root !== 'undefined' && root ? root : document.getElementById('root');
    if (el) el.innerHTML = html;
}

function sup_conc_addListeners() {
    document.getElementById('txtSupConcursoBuscar')?.addEventListener('input', sup_conc_pintar);
    document.getElementById('btnSupConcVolverSeg')?.addEventListener('click', sup_conc_volver_listado);
    document.getElementById('btnSupConcSegExcel')?.addEventListener('click', sup_conc_seg_export_excel);
}

function initView() {
    sup_conc_injectStyles();
    getView();
    sup_conc_addListeners();
    sup_conc_view = 'listado';
    sup_conc_limpiar_sel();
    window.supervisor_concursos_refresh = sup_conc_cargar;
    sup_conc_cargar();
}

function destroyView() {
    sup_conc_cache = [];
    sup_conc_sel = 0;
    sup_conc_seg_cache = [];
    sup_conc_view = 'listado';
    try { $('#modal_sup_conc_seg_det').modal('hide'); } catch (e) { /* noop */ }
    window.supervisor_concursos_refresh = null;
}
