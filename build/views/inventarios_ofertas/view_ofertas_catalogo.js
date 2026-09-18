'use strict';

let ofertasCatCache = [];

function ofertas_cat_esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function ofertas_cat_fmtNum(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return '0';
    return String(v);
}

function ofertas_cat_fmtFecha(s) {
    const x = String(s || '').slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(x)) return '';
    const p = x.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
}

function ofertas_cat_vigencia(r) {
    if (String(r.TIPO_VIGENCIA || '').toUpperCase() === 'VENCIMIENTO') {
        const del = ofertas_cat_fmtFecha(r.FECHA_DEL);
        const al = ofertas_cat_fmtFecha(r.FECHA_AL);
        return (del && al) ? (del + ' al ' + al) : 'Con vencimiento';
    }
    return 'Vigente';
}

function ofertas_cat_sucursal() {
    if (typeof supervisor_getSucursal === 'function') {
        const s = supervisor_getSucursal();
        if (s) return s;
    }
    if (typeof proveedor_getSucursal === 'function') {
        const s = proveedor_getSucursal();
        if (s) return s;
    }
    if (typeof ventas_getSucursal === 'function') {
        const s = ventas_getSucursal();
        if (s) return s;
    }
    return GlobalEmpnit || '';
}

function ofertas_cat_img(r) {
    if (r && r.IMAGEN_URL) return r.IMAGEN_URL;
    const n = String(r && r.IMAGEN ? r.IMAGEN : '').trim();
    if (!n) return '';
    const path = n.indexOf('/') === 0 ? n : ('/OFERTAS/' + n);
    return '/storage/file?path=' + encodeURIComponent(path);
}

function getView() {
    let st = document.getElementById('ofertas-cat-styles');
    if (!st) {
        st = document.createElement('style');
        st.id = 'ofertas-cat-styles';
        document.head.appendChild(st);
    }
    st.textContent = `
        .ofc-list { padding: 0.75rem; }
        .ofc-card {
            display:flex; gap:0.75rem; align-items:center;
            padding:0.85rem 1rem; margin-bottom:0.65rem;
            border:1px solid rgba(15,23,42,.08); border-radius:14px;
            background:#fff; box-shadow:0 4px 14px rgba(15,23,42,.04);
            cursor:pointer;
        }
        .ofc-card:hover { border-color: rgba(124,58,237,.35); }
        .ofc-thumb {
            flex:0 0 4.2rem; width:4.2rem; height:4.2rem; border-radius:12px;
            overflow:hidden; background:#ede9fe; color:#6d28d9;
            display:flex; align-items:center; justify-content:center; font-weight:800;
        }
        .ofc-thumb img { width:100%; height:100%; object-fit:cover; }
        .ofc-title { font-weight:800; margin:0 0 0.15rem; color:#0f172a; }
        .ofc-meta { margin:0; color:#64748b; font-size:0.78rem; }
        .ofc-foto-wrap img { max-width:100%; max-height:16rem; border-radius:12px; display:block; margin:0 auto; }
        .ofc-foto-full img { max-width:100%; max-height:80vh; display:block; margin:0 auto; }
        body.sygma-dark .ofc-card { background:#152033; border-color:#243044; }
        body.sygma-dark .ofc-title { color:#e2e8f0; }
        body.sygma-dark .ofc-meta { color:#94a3b8; }
        body.sygma-dark .ofc-thumb { background:#312e81; color:#e9d5ff; }
    `;

    const view = {
        body: () => `
            <div class="pos2-wrap">
                <div class="pos2-totals-bar">
                    <div class="d-flex align-items-center">
                        <img src="./favicon.png" width="36" height="36" alt="" class="mr-2">
                        <div>
                            <div class="negrita mb-0 pos2-bar-title" style="font-size:0.95rem">Ofertas vigentes</div>
                            <div class="small" style="opacity:0.9" id="lbOfertasCatTotal">0 ofertas</div>
                        </div>
                    </div>
                </div>
                <div class="pos2-panel-card">
                    <div class="pos2-panel-head d-flex justify-content-between align-items-center">
                        <span class="negrita mb-0"><i class="fal fa-tags mr-1"></i> Catálogo</span>
                        <input type="text" class="form-control form-control-sm pos2-search-input"
                            style="max-width:220px" id="txtBuscarOfertaCat" placeholder="Buscar oferta...">
                    </div>
                    <div id="ofertasCatLista" class="ofc-list">
                        <div class="text-center text-muted py-3">Cargando ofertas...</div>
                    </div>
                </div>
            </div>

            <div class="modal fade" tabindex="-1" role="dialog" id="modal_oferta_cat">
                <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-base text-white">
                            <h5 class="modal-title negrita mb-0" id="lbOfertaCatTitulo">Oferta</h5>
                            <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-2" id="lbOfertaCatMeta"></div>
                            <div class="mb-3" id="ofcFotoBox"></div>
                            <div class="row">
                                <div class="col-12 col-md-6 mb-3 mb-md-0">
                                    <div class="negrita mb-2"><i class="fal fa-boxes mr-1"></i> Productos de venta</div>
                                    <div class="table-responsive">
                                        <table class="table table-sm table-hover mb-0">
                                            <thead class="bg-base text-white">
                                                <tr><th>CODPROD</th><th>DESPROD</th><th>MARCA</th></tr>
                                            </thead>
                                            <tbody id="tblOfertaCatProd"></tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6">
                                    <div class="negrita mb-2"><i class="fal fa-gift mr-1"></i> Productos BONI</div>
                                    <div class="table-responsive">
                                        <table class="table table-sm table-hover mb-0">
                                            <thead class="bg-base text-white">
                                                <tr><th>CODPROD</th><th>DESPROD</th><th>MARCA</th></tr>
                                            </thead>
                                            <tbody id="tblOfertaCatBoni"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" tabindex="-1" role="dialog" id="modal_oferta_cat_foto">
                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-base text-white">
                            <h5 class="modal-title negrita mb-0">Foto de la oferta</h5>
                            <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                        </div>
                        <div class="modal-body ofc-foto-full">
                            <img id="imgOfertaCatFull" alt="Foto oferta">
                        </div>
                        <div class="modal-footer">
                            <a class="btn btn-info negrita" id="btnOfertaCatDescargar" href="#" download>
                                <i class="fal fa-download mr-1"></i> Descargar
                            </a>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    const host = (typeof root !== 'undefined' && root && root.nodeType === 1)
        ? root
        : document.getElementById('root');
    if (host) host.innerHTML = view.body();
}

function ofertas_cat_render(rows) {
    const box = document.getElementById('ofertasCatLista');
    const lb = document.getElementById('lbOfertasCatTotal');
    if (lb) lb.textContent = rows.length + (rows.length === 1 ? ' oferta' : ' ofertas');
    if (!box) return;
    if (!rows.length) {
        box.innerHTML = '<div class="text-center text-muted py-3">No hay ofertas vigentes para esta sede.</div>';
        return;
    }
    box.innerHTML = rows.map((r) => {
        const img = ofertas_cat_img(r);
        return `
            <div class="ofc-card" onclick="ofertas_cat_abrir(${Number(r.CODOFERTA) || 0})">
                <div class="ofc-thumb">${img ? `<img src="${ofertas_cat_esc(img)}" alt="">` : (r.CODOFERTA || '')}</div>
                <div class="flex-grow-1 min-width-0">
                    <div class="ofc-title">${ofertas_cat_esc(r.DESOFERTA)}</div>
                    <p class="ofc-meta mb-0">${ofertas_cat_esc(ofertas_cat_vigencia(r))}
                        · Unid. ${ofertas_cat_fmtNum(r.UNIDADES)}
                        · Bonif. ${ofertas_cat_fmtNum(r.CANTIDAD_BONIF)}
                        · ${Number(r.NPROD) || 0} venta · ${Number(r.NBONI) || 0} BONI</p>
                </div>
            </div>`;
    }).join('');
}

function ofertas_cat_filtrar() {
    const q = String((document.getElementById('txtBuscarOfertaCat') || {}).value || '').toLowerCase().trim();
    if (!q) {
        ofertas_cat_render(ofertasCatCache);
        return;
    }
    ofertas_cat_render(ofertasCatCache.filter((r) => {
        return String(r.DESOFERTA || '').toLowerCase().indexOf(q) >= 0
            || String(r.CODOFERTA || '').indexOf(q) >= 0;
    }));
}

function ofertas_cat_cargar() {
    const box = document.getElementById('ofertasCatLista');
    if (box) box.innerHTML = `<div class="text-center py-3">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</div>`;
    axios.post(GlobalUrlCalls + '/ofertas/catalogo', {
        token: TOKEN,
        sucursal: ofertas_cat_sucursal()
    })
        .then((res) => {
            if (!res.data || res.data.ok === false) throw new Error('error');
            ofertasCatCache = res.data.recordset || [];
            ofertas_cat_filtrar();
        })
        .catch(() => {
            ofertasCatCache = [];
            if (box) box.innerHTML = '<div class="text-center text-muted py-3">No se pudieron cargar las ofertas.</div>';
        });
}

function ofertas_cat_filas(rows, empty) {
    if (!rows.length) return `<tr><td colspan="3" class="text-center text-muted">${empty}</td></tr>`;
    return rows.map((r) => `
        <tr>
            <td>${ofertas_cat_esc(r.CODPROD)}</td>
            <td>${ofertas_cat_esc(r.DESPROD)}</td>
            <td>${ofertas_cat_esc(r.DESMARCA)}</td>
        </tr>
    `).join('');
}

function ofertas_cat_abrir(codoferta) {
    const id = Number(codoferta) || 0;
    const r = ofertasCatCache.find((x) => Number(x.CODOFERTA) === id);
    if (!r) {
        F.AvisoError('No se encontró la oferta');
        return;
    }
    document.getElementById('lbOfertaCatTitulo').textContent = r.DESOFERTA || ('Oferta ' + id);
    document.getElementById('lbOfertaCatMeta').innerHTML =
        `<small class="text-muted">Código ${id} · Unidades ${ofertas_cat_fmtNum(r.UNIDADES)} · Bonif. ${ofertas_cat_fmtNum(r.CANTIDAD_BONIF)} · ${ofertas_cat_esc(ofertas_cat_vigencia(r))}</small>`;
    const img = ofertas_cat_img(r);
    const foto = document.getElementById('ofcFotoBox');
    if (foto) {
        foto.innerHTML = img ? `
            <div class="ofc-foto-wrap text-center">
                <button type="button" class="btn btn-sm btn-info negrita mr-1" onclick="ofertas_cat_ver_foto('${ofertas_cat_esc(img)}','${ofertas_cat_esc(r.IMAGEN || ('oferta_' + id + '.jpg'))}')">
                    <i class="fal fa-image mr-1"></i> Ver foto
                </button>
                <button type="button" class="btn btn-sm btn-outline-secondary negrita" onclick="ofertas_cat_expandir('${ofertas_cat_esc(img)}')">
                    <i class="fal fa-expand mr-1"></i> Expandir
                </button>
                <a class="btn btn-sm btn-outline-info negrita ml-1" href="${ofertas_cat_esc(img)}&download=1" download="${ofertas_cat_esc(r.IMAGEN || 'oferta.jpg')}">
                    <i class="fal fa-download mr-1"></i> Descargar
                </a>
            </div>` : '<div class="text-muted small">Esta oferta no tiene foto.</div>';
    }
    const tProd = document.getElementById('tblOfertaCatProd');
    const tBoni = document.getElementById('tblOfertaCatBoni');
    if (tProd) tProd.innerHTML = `<tr><td colspan="3" class="text-center">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</td></tr>`;
    if (tBoni) tBoni.innerHTML = `<tr><td colspan="3" class="text-center">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</td></tr>`;
    $('#modal_oferta_cat').modal('show');
    axios.post(GlobalUrlCalls + '/ofertas/productos', { token: TOKEN, sucursal: ofertas_cat_sucursal(), codoferta: id })
        .then((res) => {
            const rows = (res.data && res.data.recordset) ? res.data.recordset : [];
            const prod = rows.filter((x) => String(x.TIPO || 'PROD').toUpperCase() !== 'BONI');
            const boni = rows.filter((x) => String(x.TIPO || '').toUpperCase() === 'BONI');
            if (tProd) tProd.innerHTML = ofertas_cat_filas(prod, 'Sin productos de venta.');
            if (tBoni) tBoni.innerHTML = ofertas_cat_filas(boni, 'Sin productos BONI.');
        })
        .catch(() => {
            if (tProd) tProd.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No se pudieron cargar.</td></tr>';
            if (tBoni) tBoni.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No se pudieron cargar.</td></tr>';
        });
}

function ofertas_cat_ver_foto(url, nombre) {
    const img = document.getElementById('imgOfertaCatFull');
    const a = document.getElementById('btnOfertaCatDescargar');
    if (img) img.src = url;
    if (a) {
        a.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'download=1';
        a.setAttribute('download', nombre || 'oferta.jpg');
    }
    $('#modal_oferta_cat_foto').modal('show');
}

function ofertas_cat_expandir(url) {
    window.open(url, '_blank');
}

function addListeners() {
    document.title = 'Ofertas vigentes';
    document.getElementById('txtBuscarOfertaCat')?.addEventListener('input', ofertas_cat_filtrar);
    ofertas_cat_cargar();
}

function initView() {
    getView();
    addListeners();
}

function destroyView() {
    ofertasCatCache = [];
    try { $('#modal_oferta_cat').modal('hide'); } catch (e) {}
    try { $('#modal_oferta_cat_foto').modal('hide'); } catch (e) {}
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
}
