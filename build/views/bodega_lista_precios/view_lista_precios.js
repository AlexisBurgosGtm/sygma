var lpCache = [];

function lp_esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function getView(){
    if (typeof spa_inyectarEstilosPos2 === 'function') spa_inyectarEstilosPos2();
    let st = document.getElementById('lista-precios-styles');
    if (!st) {
        st = document.createElement('style');
        st.id = 'lista-precios-styles';
        document.head.appendChild(st);
    }
    st.textContent = `
        .lp-wrap { max-width: 100%; }
        .lp-wrap .pos2-table-scroll { max-height: min(72vh, 680px); }
        .lp-table,
        .pos2-table-scroll .lp-table.pos2-table-compact {
            width: 100%;
            table-layout: fixed;
            font-size: 0.72rem;
            margin: 0;
        }
        .pos2-table-scroll .lp-table.pos2-table-compact thead th {
            font-size: 0.66rem;
            font-weight: 800;
            letter-spacing: 0.01em;
            padding: 0.32rem 0.28rem !important;
            white-space: nowrap;
            vertical-align: middle;
        }
        .pos2-table-scroll .lp-table.pos2-table-compact tbody td {
            font-size: 0.72rem;
            padding: 0.26rem 0.28rem !important;
            vertical-align: middle;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .lp-col-cod { width: 8%; }
        .lp-col-cod2 { width: 7%; }
        .lp-col-desprod { width: 34%; }
        .lp-col-hab { width: 4%; text-align: center; }
        .lp-col-marca, .lp-col-clasif { width: 9%; }
        .lp-col-med { width: 6%; }
        .lp-col-eq { width: 4%; text-align: right; }
        .lp-col-money { width: 6.3%; text-align: right; }
        .lp-table td.lp-col-desprod {
            white-space: normal !important;
            overflow: visible !important;
            text-overflow: unset !important;
            word-break: break-word;
            font-weight: 700;
            line-height: 1.25;
        }
        .lp-row { cursor: pointer; }
        .lp-row:hover .lp-money { color: #0044a3; }
        #modal_lp_precio .modal-content { border-radius: 16px; overflow: hidden; }
        #modal_lp_precio .form-control { font-weight: 700; text-align: right; }
        body.sygma-dark #modal_lp_precio .modal-content { background: #152033; color: #e2e8f0; }
        body.sygma-dark #modal_lp_precio .form-control {
            background: #0f172a; color: #f1f5f9; border-color: #334155;
        }
        .lp-hab {
            display: inline-block;
            min-width: 1.8rem;
            padding: 0.08rem 0.35rem;
            border-radius: 999px;
            font-size: 0.65rem;
            font-weight: 800;
            line-height: 1.2;
        }
        .lp-hab--si { background: #dcfce7; color: #15803d; }
        .lp-hab--no { background: #fee2e2; color: #b91c1c; }
        .lp-money { font-weight: 700; white-space: nowrap; }
        body.sygma-dark .lp-hab--si { background: #14532d; color: #86efac; }
        body.sygma-dark .lp-hab--no { background: #7f1d1d; color: #fecaca; }
        body.sygma-dark .lp-table tbody td { color: #e2e8f0; }
    `;

    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 lp-wrap">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel">
                            ${view.vista_listado() + view.modal_precio()}
                        </div>
                    </div>
                </div>
            `
        },
        vista_listado:()=>{
            return `
            <div class="pos2-wrap">
                <div class="pos2-totals-bar">
                    <div class="row align-items-center no-gutters">
                        <div class="col-12 col-lg-4 mb-2 mb-lg-0">
                            <div class="d-flex align-items-center">
                                <img src="./favicon.png" width="36" height="36" alt="" class="mr-2">
                                <div>
                                    <div class="negrita mb-0 pos2-bar-title" style="font-size:0.95rem">Lista de precios</div>
                                    <div class="small" style="opacity:0.9" id="lbListaPreciosTotal">0 productos</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6 col-lg-3 pr-lg-2">
                            <label class="small mb-1" style="opacity:0.9">Buscar</label>
                            <input type="text" class="form-control form-control-sm pos2-search-input"
                                placeholder="Código, producto o marca..."
                                oninput="lp_filtrar()" id="txtBuscar">
                        </div>
                        <div class="col-6 col-sm-3 col-lg-3 pr-lg-2">
                            <label class="small mb-1" style="opacity:0.9">Estado</label>
                            <select class="form-control form-control-sm pos2-search-input" id="cmbLpHab" onchange="lp_filtrar()">
                                <option value="TODOS">TODOS</option>
                                <option value="SI">HABILITADOS (SI)</option>
                                <option value="NO">DESHABILITADOS (NO)</option>
                            </select>
                        </div>
                        <div class="col-6 col-sm-3 col-lg-2 mt-2 mt-sm-0">
                            <button class="btn btn-success btn-sm btn-block hand shadow" id="btnExportarInventario">
                                <i class="fal fa-share mr-1"></i> Excel
                            </button>
                        </div>
                    </div>
                </div>

                <div class="pos2-panel-card">
                    <div class="pos2-panel-head">
                        <span class="negrita mb-0"><i class="fal fa-tags mr-1"></i> Catálogo de precios</span>
                    </div>
                    <div class="table-responsive pos2-table-scroll">
                        <table class="table table-sm table-hover mb-0 pos2-table-compact lp-table" id="tblListaPrecios">
                            <thead class="bg-base text-white">
                                <tr>
                                    <th class="lp-col-cod">CODIGO</th>
                                    <th class="lp-col-cod2">COD2</th>
                                    <th class="lp-col-desprod">DESPROD</th>
                                    <th class="lp-col-hab">HAB</th>
                                    <th class="lp-col-marca">MARCA</th>
                                    <th class="lp-col-clasif">CLASIF</th>
                                    <th class="lp-col-med">MEDIDA</th>
                                    <th class="lp-col-eq">EQ</th>
                                    <th class="lp-col-money">COSTO</th>
                                    <th class="lp-col-money">PRECIO</th>
                                    <th class="lp-col-money">PRECIO_A</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataListaPrecios"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            `
        },
        modal_precio:()=>{
            return `
            <div class="modal fade" tabindex="-1" role="dialog" id="modal_lp_precio">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-base text-white">
                            <div>
                                <h5 class="modal-title negrita mb-0">Editar precios</h5>
                                <small id="lbLpModalProd" style="opacity:0.9"></small>
                            </div>
                            <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                        </div>
                        <div class="modal-body">
                            <input type="hidden" id="txtLpCodprod">
                            <input type="hidden" id="txtLpMedida">
                            <div class="form-group mb-2">
                                <label class="small negrita text-secondary mb-1">Costo</label>
                                <input type="text" class="form-control form-control-sm" id="txtLpCosto" disabled>
                            </div>
                            <div class="form-group mb-2">
                                <label class="small negrita text-secondary mb-1">Público</label>
                                <input type="number" min="0" step="0.01" class="form-control form-control-sm" id="txtLpPrecio">
                            </div>
                            <div class="form-group mb-2">
                                <label class="small negrita text-secondary mb-1">PRECIO_A</label>
                                <input type="number" min="0" step="0.01" class="form-control form-control-sm" id="txtLpPrecioA">
                            </div>
                            <div class="form-group mb-0">
                                <label class="small negrita text-secondary mb-1">PRECIO_B</label>
                                <input type="number" min="0" step="0.01" class="form-control form-control-sm" id="txtLpPrecioB">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-info negrita" id="btnLpGuardar">
                                <i class="fal fa-save mr-1"></i> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        }
    }

    root.innerHTML = view.body();

};

function addListeners(){

    document.getElementById('btnExportarInventario').addEventListener('click', lp_exportar_excel);

    document.getElementById('tblDataListaPrecios')?.addEventListener('click', (e) => {
        const tr = e.target.closest('tr[data-lp-cod]');
        if (!tr) return;
        lp_abrir_modal(tr.getAttribute('data-lp-cod'), tr.getAttribute('data-lp-med'));
    });

    document.getElementById('btnLpGuardar')?.addEventListener('click', lp_guardar_precios);

    tbl_lista_precios();

};

function initView(){

    getView();
    addListeners();

};



function tbl_lista_precios(){


    let container = document.getElementById('tblDataListaPrecios');
    container.innerHTML = GlobalLoader;


    GF.get_data_lista_precios(GlobalEmpnit)
    .then((data)=>{

        let str = '';
        const rows = (data && data.recordset) ? data.recordset : [];

        lpCache = rows;
        rows.forEach((r)=>{
            const hab = String(r.HABILITADO || '').toUpperCase();
            const habCls = hab === 'SI' ? 'lp-hab lp-hab--si' : 'lp-hab lp-hab--no';
            str += `
            <tr class="lp-row" data-lp-cod="${lp_esc(r.CODIGO)}" data-lp-med="${lp_esc(r.MEDIDA)}" data-lp-hab="${lp_esc(hab)}">
                <td class="lp-col-cod" title="${lp_esc(r.CODIGO)}">${lp_esc(r.CODIGO)}</td>
                <td class="lp-col-cod2" title="${lp_esc(r.CODIGO2)}">${lp_esc(r.CODIGO2)}</td>
                <td class="lp-col-desprod">${lp_esc(r.PRODUCTO)}</td>
                <td class="lp-col-hab"><span class="${habCls}">${lp_esc(hab || r.HABILITADO)}</span></td>
                <td class="lp-col-marca" title="${lp_esc(r.MARCA)}">${lp_esc(r.MARCA)}</td>
                <td class="lp-col-clasif" title="${lp_esc(r.CLASIFICACION_TIPO)}">${lp_esc(r.CLASIFICACION_TIPO)}</td>
                <td class="lp-col-med" title="${lp_esc(r.MEDIDA)}">${lp_esc(r.MEDIDA)}</td>
                <td class="lp-col-eq">${lp_esc(r.EQUIVALE)}</td>
                <td class="lp-col-money lp-money">${F.setMoneda(r.COSTO,'Q')}</td>
                <td class="lp-col-money lp-money">${F.setMoneda(r.PRECIO,'Q')}</td>
                <td class="lp-col-money lp-money">${F.setMoneda(r.PRECIO_A,'Q')}</td>
            </tr>
            `
        })
        container.innerHTML = str || '<tr><td colspan="11" class="text-center text-muted py-3">No hay filas para mostrar</td></tr>';
        lp_filtrar();


    })
    .catch(()=>{
        
        lpCache = [];
        container.innerHTML = '<tr><td colspan="11" class="text-center text-muted py-3">No se cargaron datos</td></tr>';


    })




};

function lp_filtrar() {
    const q = String(document.getElementById('txtBuscar')?.value || '').toLowerCase().trim();
    const hab = String(document.getElementById('cmbLpHab')?.value || 'TODOS').toUpperCase();
    const rows = document.querySelectorAll('#tblDataListaPrecios tr.lp-row');
    let visible = 0;
    rows.forEach((tr) => {
        const rowHab = String(tr.getAttribute('data-lp-hab') || '').toUpperCase();
        const text = String(tr.textContent || '').toLowerCase();
        const okHab = hab === 'TODOS' || rowHab === hab;
        const okTxt = !q || text.indexOf(q) >= 0;
        const show = okHab && okTxt;
        tr.style.display = show ? '' : 'none';
        if (show) visible += 1;
    });
    const lb = document.getElementById('lbListaPreciosTotal');
    if (lb) {
        const suf = hab === 'SI' ? ' habilitados' : (hab === 'NO' ? ' deshabilitados' : '');
        lb.textContent = `${visible} producto${visible === 1 ? '' : 's'}${suf}`;
    }
}

function lp_exportar_excel() {
    const src = document.getElementById('tblListaPrecios');
    if (!src) return;
    const hab = String(document.getElementById('cmbLpHab')?.value || 'TODOS').toUpperCase();
    const clone = src.cloneNode(true);
    clone.id = 'tblListaPreciosExport';
    clone.querySelectorAll('tbody tr').forEach((tr) => {
        if (tr.style.display === 'none' || !tr.classList.contains('lp-row')) tr.remove();
    });
    clone.style.position = 'fixed';
    clone.style.left = '-9999px';
    document.body.appendChild(clone);
    const name = hab === 'SI'
        ? 'Listado de Precios Habilitados'
        : (hab === 'NO' ? 'Listado de Precios Deshabilitados' : 'Listado de Precios General');
    F.exportTableToExcel('tblListaPreciosExport', name);
    clone.remove();
}

function lp_num(v) {
    const n = Number(v);
    if (!isFinite(n)) return '0';
    return String(Math.round(n * 10000) / 10000);
}

function lp_abrir_modal(codprod, medida) {
    const r = lpCache.find((x) => String(x.CODIGO) === String(codprod) && String(x.MEDIDA) === String(medida));
    if (!r) {
        F.AvisoError('No se encontró el precio');
        return;
    }
    document.getElementById('txtLpCodprod').value = r.CODIGO || '';
    document.getElementById('txtLpMedida').value = r.MEDIDA || '';
    document.getElementById('lbLpModalProd').textContent = `${r.CODIGO || ''} · ${r.MEDIDA || ''} · ${r.PRODUCTO || ''}`;
    document.getElementById('txtLpCosto').value = F.setMoneda(r.COSTO, 'Q');
    document.getElementById('txtLpPrecio').value = lp_num(r.PRECIO);
    document.getElementById('txtLpPrecioA').value = lp_num(r.PRECIO_A);
    document.getElementById('txtLpPrecioB').value = lp_num(r.PRECIO_B);
    $('#modal_lp_precio').modal('show');
}

function lp_guardar_precios() {
    const codprod = String(document.getElementById('txtLpCodprod')?.value || '').trim();
    const codmedida = String(document.getElementById('txtLpMedida')?.value || '').trim();
    const precio = Number(document.getElementById('txtLpPrecio')?.value);
    const precioA = Number(document.getElementById('txtLpPrecioA')?.value);
    const precioB = Number(document.getElementById('txtLpPrecioB')?.value);
    if (!codprod || !codmedida || !isFinite(precio) || !isFinite(precioA) || !isFinite(precioB) || precio < 0 || precioA < 0 || precioB < 0) {
        F.AvisoError('Revise los precios');
        return;
    }
    const btn = document.getElementById('btnLpGuardar');
    const html = btn ? btn.innerHTML : '';
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-save fa-spin mr-1"></i> Guardar';
    }
    axios.post(GlobalUrlCalls + '/productos/update_precios_fila', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        codprod,
        codmedida,
        precio,
        precio_a: precioA,
        precio_b: precioB
    })
        .then((response) => {
            if (response.status.toString() !== '200') throw new Error('error');
            const data = response.data;
            if (data && data.toString() === 'error') throw new Error('error');
            if (!(Number(data && data.rowsAffected && data.rowsAffected[0]) > 0)) throw new Error('error');
            $('#modal_lp_precio').modal('hide');
            F.Aviso('Precios actualizados');
            tbl_lista_precios();
        })
        .catch(() => {
            F.AvisoError('No se pudieron guardar los precios');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = html || '<i class="fal fa-save mr-1"></i> Guardar';
            }
        });
}

