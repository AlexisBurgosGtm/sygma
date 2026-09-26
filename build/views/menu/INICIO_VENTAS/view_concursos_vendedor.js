'use strict';

var ven_conc_cache = [];

function ven_conc_esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function ven_conc_mon(v) {
    return typeof F.setMoneda === 'function' ? F.setMoneda(v, 'Q') : v;
}

function ven_conc_pct(real, obj) {
    const o = Number(obj) || 0;
    const r = Number(real) || 0;
    if (o <= 0) return r > 0 ? 100 : 0;
    return Math.round((r / o) * 1000) / 10;
}

function ven_conc_pctClass(pct) {
    if (pct >= 100) return 'conc-ok';
    if (pct >= 80) return 'conc-warn';
    return 'conc-bad';
}

function ven_conc_faltanCob(real, obj) {
    const o = Number(obj) || 0;
    const r = Number(real) || 0;
    if (o <= 0) return 0;
    return Math.max(0, Math.ceil(o - r));
}

function ven_conc_codemp() {
    return Number(GlobalCodUsuario) || 0;
}

function ven_conc_filtros() {
    const suc = typeof ventas_getSucursal === 'function'
        ? ventas_getSucursal()
        : (GlobalEmpnit || '');
    const mes = typeof ventas_getMes === 'function' ? ventas_getMes() : F.get_mes_curso();
    const anio = typeof ventas_getAnio === 'function' ? ventas_getAnio() : F.get_anio_curso();
    return { sucursal: suc, mes, anio, codemp: ven_conc_codemp() };
}

function ven_conc_cargar() {
    const box = document.getElementById('tblDataVenConcursos');
    const cod = ven_conc_codemp();
    if (!cod) {
        if (box) box.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No se identificó al vendedor en sesión.</td></tr>';
        return;
    }
    if (box) {
        box.innerHTML = `<tr><td colspan="9" class="text-center">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</td></tr>`;
    }
    axios.post(GlobalUrlCalls + '/concursos/vendedor_resumen', { token: TOKEN, ...ven_conc_filtros() })
        .then((res) => {
            if (!res.data || res.data.ok === false) throw new Error((res.data && res.data.error) || 'error');
            ven_conc_cache = res.data.recordset || [];
            ven_conc_pintar();
        })
        .catch((e) => {
            ven_conc_cache = [];
            if (box) {
                box.innerHTML = `<tr><td colspan="9" class="text-center text-muted">${ven_conc_esc((e && e.message && e.message !== 'error') ? e.message : 'No se pudieron cargar los concursos.')}</td></tr>`;
            }
        });
}

function ven_conc_pintar() {
    const box = document.getElementById('tblDataVenConcursos');
    const lb = document.getElementById('lbVenConcTotal');
    if (lb) lb.textContent = ven_conc_cache.length + (ven_conc_cache.length === 1 ? ' concurso' : ' concursos');
    if (!box) return;
    const q = String(document.getElementById('txtVenConcursoBuscar')?.value || '').toLowerCase().trim();
    const rows = ven_conc_cache.filter((r) => {
        if (!q) return true;
        const t = `${r.NOMBRE || ''} ${r.DESMARCA || ''}`.toLowerCase();
        return t.indexOf(q) >= 0;
    });
    if (!rows.length) {
        box.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No tiene concursos asignados en este mes.</td></tr>';
        return;
    }
    box.innerHTML = rows.map((r) => {
        const idObj = Number(r.ID_OBJETIVO) || 0;
        const objCob = Number(r.OBJ_COBERTURA) || 0;
        const objImp = Number(r.OBJ_IMPORTE) || 0;
        const realCob = Number(r.REAL_COBERTURA) || 0;
        const realImp = Number(r.REAL_IMPORTE) || 0;
        const pctCob = ven_conc_pct(realCob, objCob);
        const pctImp = ven_conc_pct(realImp, objImp);
        const faltan = ven_conc_faltanCob(realCob, objCob);
        const on = String(r.ACTIVO || 'NO').toUpperCase() === 'SI';
        const faltanCls = faltan > 0 ? 'text-danger negrita' : 'text-success';
        return `
            <tr class="hand" onclick="ven_conc_detalle(${idObj})" title="Ver productos del concurso">
                <td>
                    <div class="negrita text-primary">${ven_conc_esc(r.NOMBRE)}</div>
                    <small class="text-muted">${ven_conc_esc(r.DESMARCA || '—')}${on ? '' : ' · Inactivo'}</small>
                </td>
                <td class="text-right">${objCob}</td>
                <td class="text-right negrita">${realCob}</td>
                <td class="text-right ${faltanCls}">${faltan}</td>
                <td class="text-right"><span class="ven-conc-pct ${ven_conc_pctClass(pctCob)}">${pctCob}%</span></td>
                <td class="text-right">${ven_conc_mon(objImp)}</td>
                <td class="text-right negrita">${ven_conc_mon(realImp)}</td>
                <td class="text-right"><span class="ven-conc-pct ${ven_conc_pctClass(pctImp)}">${pctImp}%</span></td>
                <td class="text-center"><i class="fal fa-chevron-right text-muted"></i></td>
            </tr>`;
    }).join('');
}

function ven_conc_detalle(idObjetivo) {
    const row = ven_conc_cache.find((x) => Number(x.ID_OBJETIVO) === Number(idObjetivo));
    if (!row) return;
    const box = document.getElementById('tblDataVenConcDet');
    document.getElementById('lbVenConcDetTitulo').textContent = row.NOMBRE || 'Concurso';
    document.getElementById('lbVenConcDetSub').textContent = `Marca: ${row.DESMARCA || '—'} · Sus ventas del período`;
    if (box) box.innerHTML = `<tr><td colspan="3" class="text-center">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</td></tr>`;
    $('#modal_ven_conc_det').modal('show');
    axios.post(GlobalUrlCalls + '/concursos/seguimiento_detalle', {
        token: TOKEN,
        id_objetivo: idObjetivo,
        codemp: ven_conc_codemp()
    })
        .then((res) => {
            if (!res.data || res.data.ok === false) throw new Error((res.data && res.data.error) || 'error');
            const cob = Number(res.data.cobertura_marca) || 0;
            document.getElementById('lbVenConcDetSub').textContent =
                `Marca: ${row.DESMARCA || '—'} · Clientes (cobertura): ${cob} · Importe por producto del listado`;
            ven_conc_det_pintar(res.data.recordset || [], cob, row);
        })
        .catch((e) => {
            if (box) {
                box.innerHTML = `<tr><td colspan="3" class="text-center text-muted">${ven_conc_esc((e && e.message && e.message !== 'error') ? e.message : 'No se pudo cargar el detalle.')}</td></tr>`;
            }
        });
}

function ven_conc_det_pintar(rows, coberturaMarca, hdr) {
    const box = document.getElementById('tblDataVenConcDet');
    if (!box) return;
    if (hdr && !(Number(hdr.NPROD) > 0)) {
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
                <td class="negrita">${ven_conc_esc(r.CODPROD)}</td>
                <td>${ven_conc_esc(r.DESPROD)}</td>
                <td class="text-right">${ven_conc_mon(imp)}</td>
            </tr>`;
    }).join('');
    box.innerHTML = body + `
        <tr class="bg-light negrita">
            <td colspan="2" class="text-right">TOTAL IMPORTE</td>
            <td class="text-right">${ven_conc_mon(totImp)}</td>
        </tr>
        <tr class="bg-light negrita">
            <td colspan="2" class="text-right">COBERTURA (clientes únicos)</td>
            <td class="text-right">${Number(coberturaMarca) || 0}</td>
        </tr>`;
}

function ven_conc_injectStyles() {
    if (document.getElementById('ven-conc-styles')) return;
    const st = document.createElement('style');
    st.id = 'ven-conc-styles';
    st.textContent = `
        .ven-conc-root .ven-conc-pct { font-size:0.72rem; font-weight:800; padding:0.1rem 0.35rem; border-radius:999px; white-space:nowrap; }
        .ven-conc-root .ven-conc-pct.conc-ok { background:#dcfce7; color:#166534; }
        .ven-conc-root .ven-conc-pct.conc-warn { background:#fef9c3; color:#854d0e; }
        .ven-conc-root .ven-conc-pct.conc-bad { background:#fee2e2; color:#b91c1c; }
        .ven-conc-root .table-sm th, .ven-conc-root .table-sm td { font-size:0.78rem; }
    `;
    document.head.appendChild(st);
}

function getView() {
    const html = `
        <div class="col-12 p-0 ven-conc-root">
            <div class="card card-rounded shadow border-0 ventas-ofertas-sec mb-2">
                <div class="card-body p-3">
                    <div class="d-flex flex-wrap align-items-center justify-content-between mb-2">
                        <div>
                            <h5 class="negrita text-danger mb-0">Mis concursos</h5>
                            <small class="text-muted">Mes y sede según el encabezado. Solo sus ventas.</small>
                        </div>
                        <small class="text-muted" id="lbVenConcTotal">—</small>
                    </div>
                    <input type="search" class="form-control form-control-sm mb-2" id="txtVenConcursoBuscar" placeholder="Buscar concurso o marca...">
                    <div class="table-responsive">
                        <table class="table table-sm table-hover mb-0">
                            <thead class="bg-base text-white">
                                <tr>
                                    <th rowspan="2">CONCURSO</th>
                                    <th colspan="4" class="text-center border-left">COBERTURA (clientes)</th>
                                    <th colspan="3" class="text-center border-left">IMPORTE</th>
                                    <th rowspan="2" style="width:1.5rem;"></th>
                                </tr>
                                <tr>
                                    <th class="text-right border-left">OBJ.</th>
                                    <th class="text-right">REAL</th>
                                    <th class="text-right">FALTAN</th>
                                    <th class="text-right">%</th>
                                    <th class="text-right border-left">OBJ.</th>
                                    <th class="text-right">REAL</th>
                                    <th class="text-right">%</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataVenConcursos">
                                <tr><td colspan="9" class="text-center text-muted">Cargando...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="modal fade" tabindex="-1" role="dialog" id="modal_ven_conc_det">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-base text-white py-2">
                            <h5 class="modal-title negrita mb-0" id="lbVenConcDetTitulo">Concurso</h5>
                        </div>
                        <div class="modal-body p-3">
                            <p class="small text-muted mb-2" id="lbVenConcDetSub">—</p>
                            <div class="table-responsive">
                                <table class="table table-sm table-hover mb-0">
                                    <thead class="bg-secondary text-white">
                                        <tr>
                                            <th>CODPROD</th>
                                            <th>PRODUCTO</th>
                                            <th class="text-right">IMPORTE</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataVenConcDet">
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

function initView() {
    ven_conc_injectStyles();
    getView();
    document.getElementById('txtVenConcursoBuscar')?.addEventListener('input', ven_conc_pintar);
    window.proveedor_embedRefresh = ven_conc_cargar;
    ven_conc_cargar();
}

function destroyView() {
    ven_conc_cache = [];
    try { $('#modal_ven_conc_det').modal('hide'); } catch (e) { /* noop */ }
    if (window.proveedor_embedRefresh === ven_conc_cargar) {
        window.proveedor_embedRefresh = null;
    }
}
