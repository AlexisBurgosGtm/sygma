'use strict';

let ofertasSelectedCod = 0;
let ofertasSelectedNom = '';
let ofertasEditando = 0;
let ofertasCache = [];
let ofertasEmpresasCache = [];
let ofertasBuscarTimer = null;

function ofertas_esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function ofertas_fmtFecha(s) {
    const x = String(s || '').slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(x)) return '';
    const p = x.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
}

function ofertas_fmtNum(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return '0';
    return String(v);
}

function ofertas_vigenciaTxt(r) {
    if (String(r.TIPO_VIGENCIA || '').toUpperCase() === 'VENCIMIENTO') {
        const del = ofertas_fmtFecha(r.FECHA_DEL);
        const al = ofertas_fmtFecha(r.FECHA_AL);
        return (del && al) ? (del + ' al ' + al) : 'Con vencimiento';
    }
    return 'Vigente';
}

function ofertas_sedesTxt(r) {
    const n = Number(r.NSEDES) || 0;
    if (!n) return 'Todas las sedes';
    const names = String(r.SEDES || '').trim();
    if (names) return names;
    return n + (n === 1 ? ' sede' : ' sedes');
}

function ofertas_cargarEmpresas() {
    if (ofertasEmpresasCache.length) return Promise.resolve(ofertasEmpresasCache);
    return axios.post(GlobalUrlCalls + '/general/empresas_listado', { TOKEN: TOKEN })
        .then((res) => {
            const data = res && res.data ? res.data : {};
            ofertasEmpresasCache = data.recordset || [];
            return ofertasEmpresasCache;
        })
        .catch(() => {
            ofertasEmpresasCache = [];
            return [];
        });
}

function ofertas_pintarSedes(selected) {
    const box = document.getElementById('ofertasSedesBox');
    if (!box) return;
    const rows = ofertasEmpresasCache || [];
    if (!rows.length) {
        box.innerHTML = '<div class="text-muted small py-1">No se cargaron las sedes.</div>';
        return;
    }
    const set = {};
    (selected || []).forEach((v) => {
        const emp = String(v && v.EMPNIT != null ? v.EMPNIT : v || '').trim();
        if (emp) set[emp] = true;
    });
    const checkAll = !selected || !selected.length;
    box.innerHTML = rows.map((r) => {
        const emp = String(r.EMPNIT || '').trim();
        const on = checkAll || !!set[emp];
        return `
            <label class="ofertas-sede-item">
                <input type="checkbox" class="oferta-sede-chk" value="${ofertas_esc(emp)}" ${on ? 'checked' : ''}>
                <span>${ofertas_esc(r.NOMBRE || emp)}</span>
                <span class="text-muted small">(${ofertas_esc(emp)})</span>
            </label>`;
    }).join('');
}

function ofertas_marcarSedes(todas) {
    document.querySelectorAll('.oferta-sede-chk').forEach((el) => {
        el.checked = !!todas;
    });
}

function ofertas_sedesSeleccionadas() {
    return Array.from(document.querySelectorAll('.oferta-sede-chk'))
        .filter((el) => el.checked)
        .map((el) => String(el.value || '').trim())
        .filter(Boolean);
}

function getView() {
    if (typeof spa_inyectarEstilosPos2 === 'function') spa_inyectarEstilosPos2();
    let st = document.getElementById('ofertas-styles');
    if (!st) {
        st = document.createElement('style');
        st.id = 'ofertas-styles';
        document.head.appendChild(st);
    }
    st.textContent = `
        .ofertas-chip-row { display:flex; flex-wrap:wrap; gap:0.45rem; }
        .ofertas-chip {
            display:inline-flex; align-items:center; gap:0.35rem;
            margin:0; padding:0.38rem 0.7rem; border-radius:999px;
            border:1px solid rgba(15,23,42,.12); background:#fff;
            font-size:0.78rem; font-weight:700; cursor:pointer; color:#334155;
        }
        .ofertas-chip input { margin:0; }
        .ofertas-chip.is-on { border-color:#7c3aed; background:#f5f3ff; color:#6d28d9; }
        .ofertas-actions .btn { width:30px; height:30px; padding:0; }
        #modal_oferta .modal-content { border-radius:16px; overflow:hidden; }
        #modal_oferta .modal-header { border:0; padding:0.85rem 1rem; }
        #modal_oferta .modal-footer { border-top:1px solid rgba(15,23,42,.06); }
        .ofertas-list { padding: 0.75rem; }
        .ofertas-card {
            display:flex; gap:0.75rem; align-items:flex-start;
            padding:0.9rem 1rem; margin-bottom:0.65rem;
            border:1px solid rgba(15,23,42,.08); border-radius:14px;
            background:#fff; box-shadow:0 4px 14px rgba(15,23,42,.04);
            cursor:pointer; transition: transform .12s ease, box-shadow .12s ease;
        }
        .ofertas-card:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 22px rgba(15,23,42,.08);
            border-color: rgba(124,58,237,.35);
        }
        .ofertas-card__code {
            flex:0 0 2.6rem; min-width:2.6rem; height:2.6rem; border-radius:12px;
            display:flex; align-items:center; justify-content:center;
            background:#ede9fe; color:#6d28d9; font-weight:800; font-size:0.82rem;
        }
        .ofertas-card__body { flex:1; min-width:0; }
        .ofertas-card__title { font-weight:800; margin:0 0 0.2rem; font-size:0.95rem; color:#0f172a; }
        .ofertas-card__meta { margin:0; color:#64748b; font-size:0.78rem; }
        .ofertas-card__pills { display:flex; flex-wrap:wrap; gap:0.3rem; margin-top:0.4rem; }
        .ofertas-pill {
            font-size:0.68rem; font-weight:700; padding:0.12rem 0.45rem;
            border-radius:999px; background:#f1f5f9; color:#475569;
        }
        .ofertas-pill.is-on { background:#dcfce7; color:#166534; }
        .ofertas-pill.is-off { background:#fee2e2; color:#b91c1c; }
        .ofertas-search-hits {
            max-height: 22rem;
            overflow-y: auto;
            border-top: 1px solid rgba(15,23,42,.06);
        }
        .ofertas-search-hit {
            display:flex; gap:0.65rem; align-items:center;
            padding:0.65rem 0.75rem; border-bottom:1px solid rgba(15,23,42,.06);
            cursor:pointer; background:#fff;
        }
        .ofertas-search-hit.is-added { opacity: 0.55; }
        #modal_oferta_buscar .modal-content { border-radius:16px; overflow:hidden; }
        #modal_oferta_buscar .modal-header { border:0; padding:0.85rem 1rem; }
        #modal_oferta_buscar .modal-footer { border-top:1px solid rgba(15,23,42,.06); }
        .ofertas-search-hit:hover { background:#f5f3ff; }
        .ofertas-search-hit__cod { font-weight:800; color:#7c3aed; min-width:5.5rem; font-size:0.78rem; }
        .ofertas-search-hit__nom { font-weight:700; font-size:0.82rem; color:#0f172a; }
        .ofertas-search-hit__marca { font-size:0.72rem; color:#64748b; }
        .ofertas-back {
            border-radius:10px; font-weight:700; min-width:5.6rem;
        }
        body.sygma-dark .ofertas-card { background:#152033; border-color:#243044; }
        body.sygma-dark .ofertas-card__title { color:#e2e8f0; }
        body.sygma-dark .ofertas-search-hit { background:#152033; border-color:#243044; }
        body.sygma-dark .ofertas-search-hit__nom { color:#e2e8f0; }
        body.sygma-dark label.ofertas-chip {
            background:#1e293b;
            border-color:rgba(148,163,184,.35);
            color:#e2e8f0 !important;
        }
        body.sygma-dark label.ofertas-chip.is-on {
            background:#312e81;
            border-color:#a78bfa;
            color:#f5f3ff !important;
        }
        .ofertas-sedes-box {
            max-height: 11rem;
            overflow-y: auto;
            border: 1px solid rgba(15,23,42,.1);
            border-radius: 12px;
            padding: 0.35rem 0.55rem;
            background: #f8fafc;
        }
        .ofertas-sede-item {
            display:flex; align-items:center; gap:0.45rem;
            margin:0; padding:0.28rem 0.1rem;
            font-size:0.82rem; font-weight:700; color:#334155;
            cursor:pointer;
        }
        .ofertas-sede-item input { margin:0; }
        .ofertas-pill.is-sede {
            max-width: 14rem;
            overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
        }
        body.sygma-dark .ofertas-sedes-box {
            background:#1e293b;
            border-color:#334155;
        }
        body.sygma-dark label.ofertas-sede-item {
            color:#e2e8f0 !important;
        }
    `;

    const view = {
        body: () => `
            <div class="pos2-wrap">
                <div id="ofertasPantallaLista">
                    <div class="pos2-totals-bar">
                        <div class="row align-items-center no-gutters">
                            <div class="col-12 col-md-6 mb-2 mb-md-0">
                                <div class="d-flex align-items-center">
                                    <img src="./favicon.png" width="36" height="36" alt="" class="mr-2">
                                    <div>
                                        <div class="negrita mb-0 pos2-bar-title" style="font-size:0.95rem">Gestión de ofertas</div>
                                        <div class="small" style="opacity:0.9" id="lbOfertasTotal">0 ofertas</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-md-6 text-md-right">
                                <button type="button" class="btn btn-light btn-sm negrita" id="btnOfertaNueva">
                                    <i class="fal fa-plus mr-1"></i> Nueva oferta
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="pos2-panel-card">
                        <div class="pos2-panel-head d-flex justify-content-between align-items-center">
                            <span class="negrita mb-0"><i class="fal fa-tags mr-1"></i> Ofertas</span>
                            <input type="text" class="form-control form-control-sm pos2-search-input"
                                style="max-width:220px" id="txtBuscarOfertaCab"
                                placeholder="Buscar oferta...">
                        </div>
                        <div id="ofertasListaCards" class="ofertas-list">
                            <div class="text-center text-muted py-3">Cargando ofertas...</div>
                        </div>
                    </div>
                </div>

                <div id="ofertasPantallaProductos" style="display:none">
                    <div class="pos2-totals-bar">
                        <div class="d-flex align-items-center">
                            <button type="button" class="btn btn-light btn-sm ofertas-back mr-2" id="btnOfertaAtras">
                                <i class="fal fa-arrow-left mr-1"></i> Atrás
                            </button>
                            <div class="min-width-0">
                                <div class="negrita mb-0 pos2-bar-title" style="font-size:0.95rem" id="lbOfertaProdTitulo">Productos de la oferta</div>
                                <div class="small" style="opacity:0.9" id="lbOfertaProdSub">Seleccione una oferta</div>
                            </div>
                        </div>
                    </div>

                    <div class="pos2-panel-card">
                        <div class="pos2-panel-head d-flex justify-content-between align-items-center flex-wrap">
                            <span class="negrita mb-0 mr-2"><i class="fal fa-boxes mr-1"></i> Productos de esta oferta</span>
                            <div class="d-flex align-items-center">
                                <input type="text" class="form-control form-control-sm pos2-search-input mr-2"
                                    style="max-width:180px" id="txtBuscarOferta"
                                    placeholder="Filtrar agregados..."
                                    oninput="F.FiltrarTabla('tblOfertas','txtBuscarOferta')">
                                <button type="button" class="btn btn-sm btn-base negrita" id="btnOfertaAbrirBuscar">
                                    <i class="fal fa-search mr-1"></i> Buscar producto
                                </button>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="pos2-table-scroll table-responsive">
                                <table class="table table-sm table-hover mb-0 pos2-table-compact" id="tblOfertas">
                                    <thead class="bg-base text-white">
                                        <tr>
                                            <th>CODPROD</th>
                                            <th>DESPROD</th>
                                            <th>DESMARCA</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataOfertas">
                                        <tr><td colspan="4" class="text-center text-muted">Sin productos.</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" tabindex="-1" role="dialog" id="modal_oferta">
                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-base text-white">
                            <h5 class="modal-title negrita mb-0" id="lbOfertaModalTitulo">Nueva oferta</h5>
                        </div>
                        <div class="modal-body">
                            <input type="hidden" id="txtOfertaCod" value="0">
                            <label class="negrita small mb-1">Nombre de la oferta</label>
                            <input type="text" class="form-control" id="txtOfertaNombre" maxlength="200" placeholder="Ej. Combo verano">
                            <div class="row mt-2">
                                <div class="col-12 col-md-6">
                                    <label class="negrita small mb-1">Unidades de producto</label>
                                    <input type="number" class="form-control" id="txtOfertaUnidades" min="0" step="0.01" value="0">
                                </div>
                                <div class="col-12 col-md-6">
                                    <label class="negrita small mb-1">Cantidad a bonificar</label>
                                    <input type="number" class="form-control" id="txtOfertaCantBonif" min="0" step="0.01" value="0">
                                </div>
                            </div>
                            <label class="negrita small mb-1 mt-3">Vigencia</label>
                            <div class="ofertas-chip-row mb-2">
                                <label class="ofertas-chip is-on" id="chipVigente">
                                    <input type="radio" name="ofertasVigencia" value="VIGENTE" checked>
                                    Vigente
                                </label>
                                <label class="ofertas-chip" id="chipVencimiento">
                                    <input type="radio" name="ofertasVigencia" value="VENCIMIENTO">
                                    Con fecha de vencimiento
                                </label>
                            </div>
                            <div class="row" id="ofertasFechasWrap" style="display:none">
                                <div class="col-12 col-md-6">
                                    <label class="negrita small mb-1">Del</label>
                                    <input type="date" class="form-control" id="txtOfertaDel">
                                </div>
                                <div class="col-12 col-md-6">
                                    <label class="negrita small mb-1">Al</label>
                                    <input type="date" class="form-control" id="txtOfertaAl">
                                </div>
                            </div>
                            <div class="d-flex align-items-center justify-content-between mt-3 mb-1">
                                <label class="negrita small mb-0">Sedes donde aplica</label>
                                <div>
                                    <button type="button" class="btn btn-sm btn-outline-secondary" id="btnOfertaSedesTodas">Todas</button>
                                    <button type="button" class="btn btn-sm btn-outline-secondary ml-1" id="btnOfertaSedesNinguna">Ninguna</button>
                                </div>
                            </div>
                            <div id="ofertasSedesBox" class="ofertas-sedes-box">
                                <div class="text-muted small py-1">Cargando sedes...</div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-success" id="btnOfertaGuardar">
                                <i class="fal fa-save mr-1"></i> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" tabindex="-1" role="dialog" id="modal_oferta_buscar" data-backdrop="true">
                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-base text-white">
                            <h5 class="modal-title negrita mb-0">Buscar producto</h5>
                        </div>
                        <div class="modal-body p-0">
                            <div class="p-3">
                                <input type="text" class="form-control" id="txtOfertaBuscarProd"
                                    placeholder="Escriba nombre o código del producto...">
                            </div>
                            <div id="ofertasBuscarHits" class="ofertas-search-hits"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    root = document.getElementById('root');
    root.innerHTML = view.body();
}

function ofertas_mostrarLista() {
    const lista = document.getElementById('ofertasPantallaLista');
    const prod = document.getElementById('ofertasPantallaProductos');
    if (lista) lista.style.display = '';
    if (prod) prod.style.display = 'none';
    ofertasSelectedCod = 0;
    ofertasSelectedNom = '';
    const hits = document.getElementById('ofertasBuscarHits');
    const txt = document.getElementById('txtOfertaBuscarProd');
    if (hits) hits.innerHTML = '';
    if (txt) txt.value = '';
    $('#modal_oferta_buscar').modal('hide');
}

function ofertas_mostrarProductos(r) {
    ofertasSelectedCod = Number(r && r.CODOFERTA) || 0;
    ofertasSelectedNom = (r && r.DESOFERTA) || ('Oferta ' + ofertasSelectedCod);
    const lista = document.getElementById('ofertasPantallaLista');
    const prod = document.getElementById('ofertasPantallaProductos');
    if (lista) lista.style.display = 'none';
    if (prod) prod.style.display = '';
    const tit = document.getElementById('lbOfertaProdTitulo');
    const sub = document.getElementById('lbOfertaProdSub');
    if (tit) tit.textContent = ofertasSelectedNom;
    if (sub) {
        sub.textContent = 'Código ' + ofertasSelectedCod
            + ' · Unidades ' + ofertas_fmtNum(r.UNIDADES)
            + ' · Bonif. ' + ofertas_fmtNum(r.CANTIDAD_BONIF)
            + ' · ' + ofertas_vigenciaTxt(r);
    }
    const hits = document.getElementById('ofertasBuscarHits');
    const txt = document.getElementById('txtOfertaBuscarProd');
    if (hits) hits.innerHTML = '';
    if (txt) txt.value = '';
    ofertas_cargarProductos(ofertasSelectedCod);
}

function ofertas_setVigenciaUI(tipo) {
    const vigente = String(tipo || 'VIGENTE').toUpperCase() !== 'VENCIMIENTO';
    const rV = document.querySelector('input[name="ofertasVigencia"][value="VIGENTE"]');
    const rC = document.querySelector('input[name="ofertasVigencia"][value="VENCIMIENTO"]');
    if (rV) rV.checked = vigente;
    if (rC) rC.checked = !vigente;
    document.getElementById('chipVigente')?.classList.toggle('is-on', vigente);
    document.getElementById('chipVencimiento')?.classList.toggle('is-on', !vigente);
    const wrap = document.getElementById('ofertasFechasWrap');
    if (wrap) wrap.style.display = vigente ? 'none' : '';
}

function ofertas_limpiarModal() {
    ofertasEditando = 0;
    document.getElementById('txtOfertaCod').value = '0';
    document.getElementById('txtOfertaNombre').value = '';
    document.getElementById('txtOfertaUnidades').value = '0';
    document.getElementById('txtOfertaCantBonif').value = '0';
    document.getElementById('txtOfertaDel').value = '';
    document.getElementById('txtOfertaAl').value = '';
    document.getElementById('lbOfertaModalTitulo').textContent = 'Nueva oferta';
    ofertas_setVigenciaUI('VIGENTE');
    ofertas_pintarSedes([]);
}

function ofertas_abrirNueva() {
    ofertas_limpiarModal();
    ofertas_cargarEmpresas().then(() => {
        ofertas_pintarSedes([]);
        $('#modal_oferta').modal('show');
    });
}

function ofertas_abrirEditar(codoferta) {
    const id = Number(codoferta) || 0;
    if (!id) return;
    Promise.all([
        axios.post(GlobalUrlCalls + '/ofertas/get', { token: TOKEN, codoferta: id }),
        ofertas_cargarEmpresas()
    ])
        .then((arr) => {
            const res = arr[0];
            if (!res.data || res.data.ok === false) {
                F.AvisoError((res.data && res.data.error) || 'No se pudo leer la oferta');
                return;
            }
            const r = res.data.recordset[0];
            ofertasEditando = Number(r.CODOFERTA) || 0;
            document.getElementById('txtOfertaCod').value = String(ofertasEditando);
            document.getElementById('txtOfertaNombre').value = r.DESOFERTA || '';
            document.getElementById('txtOfertaUnidades').value = ofertas_fmtNum(r.UNIDADES);
            document.getElementById('txtOfertaCantBonif').value = ofertas_fmtNum(r.CANTIDAD_BONIF);
            document.getElementById('txtOfertaDel').value = String(r.FECHA_DEL || '').slice(0, 10);
            document.getElementById('txtOfertaAl').value = String(r.FECHA_AL || '').slice(0, 10);
            document.getElementById('lbOfertaModalTitulo').textContent = 'Editar oferta ' + ofertasEditando;
            ofertas_setVigenciaUI(r.TIPO_VIGENCIA);
            ofertas_pintarSedes(r.SEDES || []);
            $('#modal_oferta').modal('show');
        })
        .catch(() => F.AvisoError('No se pudo leer la oferta'));
}

function ofertas_guardar() {
    const btn = document.getElementById('btnOfertaGuardar');
    const desoferta = String(document.getElementById('txtOfertaNombre').value || '').trim();
    const unidades = document.getElementById('txtOfertaUnidades').value;
    const cantidad_bonif = document.getElementById('txtOfertaCantBonif').value;
    const tipo = (document.querySelector('input[name="ofertasVigencia"]:checked') || {}).value || 'VIGENTE';
    const fecha_del = document.getElementById('txtOfertaDel').value;
    const fecha_al = document.getElementById('txtOfertaAl').value;
    const codoferta = Number(document.getElementById('txtOfertaCod').value) || 0;
    const sedes = ofertas_sedesSeleccionadas();
    if (!desoferta) {
        F.AvisoError('Escriba el nombre de la oferta');
        return;
    }
    if (tipo === 'VENCIMIENTO' && (!fecha_del || !fecha_al)) {
        F.AvisoError('Indique las fechas Del y Al');
        return;
    }
    if (!sedes.length) {
        F.AvisoError('Seleccione al menos una sede');
        return;
    }
    const payload = {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        desoferta,
        unidades,
        cantidad_bonif,
        tipo_vigencia: tipo,
        fecha_del,
        fecha_al,
        sedes
    };
    const url = codoferta ? '/ofertas/update' : '/ofertas/insert';
    if (codoferta) payload.codoferta = codoferta;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-save fa-spin mr-1"></i> Guardando';
    }
    axios.post(GlobalUrlCalls + url, payload)
        .then((res) => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fal fa-save mr-1"></i> Guardar';
            }
            if (!res.data || res.data.ok === false) {
                F.AvisoError((res.data && res.data.error) || 'No se pudo guardar');
                return;
            }
            F.Aviso('Oferta guardada');
            $('#modal_oferta').modal('hide');
            ofertas_mostrarLista();
            ofertas_cargarListado();
        })
        .catch(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fal fa-save mr-1"></i> Guardar';
            }
            F.AvisoError('No se pudo guardar la oferta');
        });
}

function ofertas_eliminar(codoferta) {
    F.Confirmacion('¿Eliminar la oferta ' + codoferta + '? Se quitarán sus productos.')
        .then((ok) => {
            if (!ok) return;
            axios.post(GlobalUrlCalls + '/ofertas/delete', { token: TOKEN, codoferta })
                .then((res) => {
                    if (!res.data || res.data.ok === false) {
                        F.AvisoError((res.data && res.data.error) || 'No se pudo eliminar');
                        return;
                    }
                    F.Aviso('Oferta eliminada');
                    ofertas_mostrarLista();
                    ofertas_cargarListado();
                })
                .catch(() => F.AvisoError('No se pudo eliminar la oferta'));
        });
}

function ofertas_renderCards(rows) {
    const box = document.getElementById('ofertasListaCards');
    if (!box) return;
    if (!rows.length) {
        box.innerHTML = '<div class="text-center text-muted py-3">No hay ofertas. Pulse Nueva oferta.</div>';
        return;
    }
    box.innerHTML = rows.map((r) => {
        const nprod = Number(r.NPROD) || 0;
        const vigente = String(r.TIPO_VIGENCIA || '').toUpperCase() !== 'VENCIMIENTO';
        return `
            <div class="ofertas-card" onclick="ofertas_abrirProductos(${r.CODOFERTA})">
                <div class="ofertas-card__code">${r.CODOFERTA}</div>
                <div class="ofertas-card__body">
                    <div class="ofertas-card__title">${ofertas_esc(r.DESOFERTA)}</div>
                    <p class="ofertas-card__meta mb-0">${nprod} producto${nprod === 1 ? '' : 's'}</p>
                    <div class="ofertas-card__pills">
                        <span class="ofertas-pill ${vigente ? 'is-on' : 'is-off'}">${ofertas_esc(ofertas_vigenciaTxt(r))}</span>
                        <span class="ofertas-pill">Unid. ${ofertas_fmtNum(r.UNIDADES)}</span>
                        <span class="ofertas-pill">Bonif. ${ofertas_fmtNum(r.CANTIDAD_BONIF)}</span>
                        <span class="ofertas-pill is-sede" title="${ofertas_esc(ofertas_sedesTxt(r))}">${ofertas_esc(ofertas_sedesTxt(r))}</span>
                    </div>
                </div>
                <div class="ofertas-actions" onclick="event.stopPropagation()">
                    <button type="button" class="btn btn-sm btn-outline-info" title="Editar" onclick="ofertas_abrirEditar(${r.CODOFERTA})">
                        <i class="fal fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger" title="Eliminar" onclick="ofertas_eliminar(${r.CODOFERTA})">
                        <i class="fal fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function ofertas_filtrarCards() {
    const q = String((document.getElementById('txtBuscarOfertaCab') || {}).value || '').toLowerCase().trim();
    if (!q) {
        ofertas_renderCards(ofertasCache);
        return;
    }
    const rows = ofertasCache.filter((r) => {
        const nom = String(r.DESOFERTA || '').toLowerCase();
        const cod = String(r.CODOFERTA || '');
        const sedes = String(r.SEDES || '').toLowerCase();
        return nom.indexOf(q) >= 0 || cod.indexOf(q) >= 0 || sedes.indexOf(q) >= 0;
    });
    ofertas_renderCards(rows);
}

function ofertas_cargarListado() {
    const box = document.getElementById('ofertasListaCards');
    const lb = document.getElementById('lbOfertasTotal');
    if (box) box.innerHTML = `<div class="text-center py-3">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</div>`;
    axios.post(GlobalUrlCalls + '/ofertas/listado', { token: TOKEN })
        .then((res) => {
            if (!res.data || res.data.ok === false) throw new Error('error');
            ofertasCache = res.data.recordset || [];
            if (lb) lb.textContent = ofertasCache.length + (ofertasCache.length === 1 ? ' oferta' : ' ofertas');
            ofertas_filtrarCards();
        })
        .catch(() => {
            ofertasCache = [];
            if (lb) lb.textContent = '0 ofertas';
            if (box) box.innerHTML = '<div class="text-center text-muted py-3">No se pudieron cargar las ofertas.</div>';
        });
}

function ofertas_abrirProductos(codoferta) {
    const id = Number(codoferta) || 0;
    const r = ofertasCache.find((x) => Number(x.CODOFERTA) === id);
    if (!r) {
        F.AvisoError('No se encontró la oferta');
        return;
    }
    ofertas_mostrarProductos(r);
}

function ofertas_cargarProductos(clasif) {
    const container = document.getElementById('tblDataOfertas');
    const buscar = document.getElementById('txtBuscarOferta');
    if (buscar) buscar.value = '';
    const id = Number(clasif) || 0;
    if (!id) {
        if (container) {
            container.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Sin productos.</td></tr>';
        }
        return;
    }
    container.innerHTML = `<tr><td colspan="4" class="text-center">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</td></tr>`;
    axios.post(GlobalUrlCalls + '/ofertas/productos', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        codoferta: id
    })
        .then((res) => {
            if (!res.data || res.data.ok === false) throw new Error('error');
            const rows = res.data.recordset || [];
            if (!rows.length) {
                container.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay productos en esta oferta.</td></tr>';
                return;
            }
            container.innerHTML = rows.map((r) => `
                <tr>
                    <td>${ofertas_esc(r.CODPROD)}</td>
                    <td>${ofertas_esc(r.DESPROD)}</td>
                    <td>${ofertas_esc(r.DESMARCA)}</td>
                    <td class="text-right">
                        <button type="button" class="btn btn-sm btn-outline-danger" title="Quitar" onclick="ofertas_quitarProducto(${Number(r.ID) || 0})">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No se pudieron cargar los productos.</td></tr>';
        });
}

function ofertas_buscarProducto() {
    const txt = document.getElementById('txtOfertaBuscarProd');
    const box = document.getElementById('ofertasBuscarHits');
    const filtro = String(txt && txt.value ? txt.value : '').trim();
    if (!box) return;
    if (filtro.length < 1) {
        box.innerHTML = '';
        return;
    }
    box.innerHTML = `<div class="text-center text-muted py-2">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Buscando...'}</div>`;
    axios.post(GlobalUrlCalls + '/ofertas/buscar_producto', {
        token: TOKEN,
        filtro
    })
        .then((res) => {
            if (!res.data || res.data.ok === false) throw new Error('error');
            const rows = res.data.recordset || [];
            if (!rows.length) {
                box.innerHTML = '<div class="text-center text-muted py-2">Sin coincidencias.</div>';
                return;
            }
            box.innerHTML = rows.map((r) => {
                const payload = JSON.stringify(String(r.CODPROD || ''));
                return `
                <div class="ofertas-search-hit" data-codprod="${ofertas_esc(r.CODPROD)}" onclick='ofertas_agregarProducto(${payload}, this)'>
                    <div class="ofertas-search-hit__cod">${ofertas_esc(r.CODPROD)}</div>
                    <div>
                        <div class="ofertas-search-hit__nom">${ofertas_esc(r.DESPROD)}</div>
                        <div class="ofertas-search-hit__marca">${ofertas_esc(r.DESMARCA)}</div>
                    </div>
                </div>`;
            }).join('');
        })
        .catch(() => {
            box.innerHTML = '<div class="text-center text-muted py-2">No se pudo buscar.</div>';
        });
}

function ofertas_agregarProducto(codprod, el) {
    const id = Number(ofertasSelectedCod) || 0;
    const prod = String(codprod || '').trim();
    if (!id) {
        F.AvisoError('Seleccione una oferta');
        return;
    }
    if (!prod) {
        F.AvisoError('Producto inválido');
        return;
    }
    if (el) el.classList.add('is-added');
    axios.post(GlobalUrlCalls + '/ofertas/producto_insert', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        codoferta: id,
        codprod: prod
    })
        .then((res) => {
            if (!res.data || res.data.ok === false) {
                if (el) el.classList.remove('is-added');
                F.AvisoError((res.data && res.data.error) || 'No se pudo agregar');
                return;
            }
            F.Aviso('Producto agregado');
            ofertas_cargarProductos(id);
            const item = ofertasCache.find((x) => Number(x.CODOFERTA) === id);
            if (item) item.NPROD = (Number(item.NPROD) || 0) + 1;
            const txt = document.getElementById('txtOfertaBuscarProd');
            if (txt) txt.focus();
        })
        .catch(() => {
            if (el) el.classList.remove('is-added');
            F.AvisoError('No se pudo agregar el producto');
        });
}

function ofertas_quitarProducto(rowId) {
    const id = Number(rowId) || 0;
    if (!id) return;
    F.Confirmacion('¿Quitar este producto de la oferta?')
        .then((ok) => {
            if (!ok) return;
            axios.post(GlobalUrlCalls + '/ofertas/producto_delete', { token: TOKEN, id })
                .then((res) => {
                    if (!res.data || res.data.ok === false) {
                        F.AvisoError((res.data && res.data.error) || 'No se pudo quitar');
                        return;
                    }
                    ofertas_cargarProductos(ofertasSelectedCod);
                    const item = ofertasCache.find((x) => Number(x.CODOFERTA) === Number(ofertasSelectedCod));
                    if (item && Number(item.NPROD) > 0) item.NPROD = Number(item.NPROD) - 1;
                })
                .catch(() => F.AvisoError('No se pudo quitar el producto'));
        });
}

function addListeners() {
    document.title = 'Gestión de ofertas';
    document.getElementById('btnOfertaNueva')?.addEventListener('click', ofertas_abrirNueva);
    document.getElementById('btnOfertaGuardar')?.addEventListener('click', ofertas_guardar);
    document.getElementById('btnOfertaAtras')?.addEventListener('click', () => {
        ofertas_mostrarLista();
        ofertas_cargarListado();
    });
    document.getElementById('txtBuscarOfertaCab')?.addEventListener('input', ofertas_filtrarCards);
    document.getElementById('btnOfertaAbrirBuscar')?.addEventListener('click', () => {
        const hits = document.getElementById('ofertasBuscarHits');
        const txt = document.getElementById('txtOfertaBuscarProd');
        if (hits) hits.innerHTML = '';
        if (txt) txt.value = '';
        $('#modal_oferta_buscar').modal('show');
    });
    $('#modal_oferta_buscar').on('shown.bs.modal', function(){
        const txt = document.getElementById('txtOfertaBuscarProd');
        if (txt) txt.focus();
    });
    document.getElementById('txtOfertaBuscarProd')?.addEventListener('input', () => {
        clearTimeout(ofertasBuscarTimer);
        ofertasBuscarTimer = setTimeout(ofertas_buscarProducto, 280);
    });
    document.querySelectorAll('input[name="ofertasVigencia"]').forEach((el) => {
        el.addEventListener('change', () => ofertas_setVigenciaUI(el.value));
    });
    document.getElementById('btnOfertaSedesTodas')?.addEventListener('click', () => ofertas_marcarSedes(true));
    document.getElementById('btnOfertaSedesNinguna')?.addEventListener('click', () => ofertas_marcarSedes(false));
    ofertas_mostrarLista();
    ofertas_cargarEmpresas();
    ofertas_cargarListado();
}

function initView() {
    getView();
    addListeners();
}
