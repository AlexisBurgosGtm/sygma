/**
 * Inventario físico — menú general (Inventarios).
 * Misma UX que INICIO_BODEGA/view_inventario.js, con selector de sucursal y Exportar Excel.
 */
var inv_fisico_cache = [];
var inv_fisico_modo_existencia = 'TODOS'; // TODOS | SIN_EXISTENCIA

function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab"></div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab"></div>
                    </div>

                    <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active negrita text-success" id="tab-uno" data-toggle="tab" href="#uno" role="tab" aria-controls="profile" aria-selected="false">
                                <i class="fal fa-list"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-dos" data-toggle="tab" href="#dos" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-tres" data-toggle="tab" href="#tres" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>
                    </ul>
                </div>
            `
        },
        vista_listado:()=>{
            return `
            <div class="card card-rounded shadow bodega-inv-card" id="invFisicoCard">
                <div class="card-body p-3">
                    <div class="bodega-inv-header mb-3">
                        <div class="bodega-inv-header__top">
                            <div class="bodega-inv-header__title-block">
                                <h4 class="negrita text-danger mb-1">Inventario actual</h4>
                                <small class="text-muted d-block mb-2">Reporte de existencias por sucursal</small>
                                <label class="bodega-inv-filters__label negrita text-secondary mb-1" for="cmbSucursal">Sucursal</label>
                                <select class="form-control form-control-sm negrita text-base bodega-inv-filters__control bodega-inv-sucursal" id="cmbSucursal"></select>
                            </div>
                            <div class="bodega-inv-header__actions">
                                <button type="button" class="btn btn-sm hand shadow bodega-inv-existencia-toggle is-todos"
                                    id="btnInvFisicoExistenciaToggle" title="Alternar todos / sin existencia" aria-pressed="false">
                                    <i class="fal fa-boxes mr-1"></i>
                                    <span class="bodega-inv-existencia-toggle__label">TODOS</span>
                                </button>
                                <button type="button" class="btn btn-success btn-sm hand shadow bodega-inv-export-btn" id="btnExportarInventario">
                                    <i class="fal fa-file-excel mr-1"></i> Exportar Excel
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="bodega-inv-filters bodega-inv-filters--bar mb-3">
                        <div class="bodega-inv-filters__item">
                            <label class="bodega-inv-filters__label negrita text-secondary mb-1" for="cmbSt">Estado</label>
                            <select class="form-control form-control-sm negrita text-danger bodega-inv-filters__control" id="cmbSt">
                                <option value="SI">HABILITADOS</option>
                                <option value="NO">DESHABILITADOS</option>
                            </select>
                        </div>
                        <div class="bodega-inv-filters__item">
                            <label class="bodega-inv-filters__label negrita text-secondary mb-1" for="cmbInvFisicoMarca">Marca</label>
                            <select class="form-control form-control-sm negrita bodega-inv-filters__control" id="cmbInvFisicoMarca">
                                <option value="">TODAS LAS MARCAS</option>
                            </select>
                        </div>
                        <div class="bodega-inv-filters__item bodega-inv-filters__item--grow">
                            <label class="bodega-inv-filters__label negrita text-secondary mb-1" for="txtInvFisicoBuscar">Buscar</label>
                            <div class="bodega-inv-search">
                                <i class="fal fa-search bodega-inv-search__icon"></i>
                                <input type="text" class="form-control form-control-sm bodega-inv-filters__control bodega-inv-search__input" id="txtInvFisicoBuscar"
                                    placeholder="Código, producto o marca...">
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive bodega-inv-table-wrap">
                        <table class="table table-hover table-sm col-12 mb-0 bodega-inv-table" id="tblInventario">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>CODIGO</td>
                                    <td>CODIGO_DUN</td>
                                    <td>PRODUCTO</td>
                                    <td>MARCA</td>
                                    <td>EXISTENCIA(UNS)</td>
                                    <td>FARDOS</td>
                                    <td>TOTALCOSTO</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataInventario"></tbody>
                        </table>
                    </div>
                    <div class="bodega-inv-total" id="lbInvFisicoTotalCosto">
                        <span class="bodega-inv-total__label">TOTAL COSTO</span>
                        <span class="bodega-inv-total__value">Q0.00</span>
                    </div>
                </div>
            </div>
            `
        }
    }

    root.innerHTML = view.body();
};

function inv_fisico_sync_toggle_ui() {
    const btn = document.getElementById('btnInvFisicoExistenciaToggle');
    if (!btn) return;
    const sinExistencia = inv_fisico_modo_existencia === 'SIN_EXISTENCIA';
    btn.classList.toggle('is-todos', !sinExistencia);
    btn.classList.toggle('is-sin-existencia', sinExistencia);
    btn.setAttribute('aria-pressed', sinExistencia ? 'true' : 'false');
    const label = btn.querySelector('.bodega-inv-existencia-toggle__label');
    const icon = btn.querySelector('i');
    if (label) label.textContent = sinExistencia ? 'SIN EXISTENCIA' : 'TODOS';
    if (icon) {
        icon.className = sinExistencia
            ? 'fal fa-exclamation-triangle mr-1'
            : 'fal fa-boxes mr-1';
    }
}

function inv_fisico_toggle_existencia() {
    inv_fisico_modo_existencia = inv_fisico_modo_existencia === 'TODOS'
        ? 'SIN_EXISTENCIA'
        : 'TODOS';
    inv_fisico_sync_toggle_ui();
    inv_fisico_aplicar_filtros();
}

function inv_fisico_llenar_marcas(rows) {
    const cmb = document.getElementById('cmbInvFisicoMarca');
    if (!cmb) return;
    const prev = cmb.value;
    const marcas = Array.from(new Set(
        (rows || [])
            .map((r) => String(r.DESMARCA || '').trim())
            .filter(Boolean)
    )).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

    let str = `<option value="">TODAS LAS MARCAS</option>`;
    marcas.forEach((m) => {
        str += `<option value="${String(m).replace(/"/g, '&quot;')}">${m}</option>`;
    });
    cmb.innerHTML = str;
    if (prev && marcas.includes(prev)) cmb.value = prev;
}

function inv_fisico_actualizar_total() {
    const tbody = document.getElementById('tblDataInventario');
    const lb = document.getElementById('lbInvFisicoTotalCosto');
    if (!lb) return;
    let total = 0;
    if (tbody) {
        Array.from(tbody.querySelectorAll('tr')).forEach((tr) => {
            if (tr.dataset.invFisicoEmpty === '1') return;
            if (tr.style.display === 'none') return;
            total += Number(tr.dataset.totalcosto) || 0;
        });
    }
    const value = lb.querySelector('.bodega-inv-total__value');
    if (value) value.textContent = F.setMoneda(total, 'Q');
}

function inv_fisico_aplicar_filtros() {
    const tbody = document.getElementById('tblDataInventario');
    if (!tbody) return;
    const marca = String(document.getElementById('cmbInvFisicoMarca')?.value || '').trim().toLowerCase();
    const texto = String(document.getElementById('txtInvFisicoBuscar')?.value || '').trim().toLowerCase();
    const soloSinExistencia = inv_fisico_modo_existencia === 'SIN_EXISTENCIA';

    Array.from(tbody.querySelectorAll('tr')).forEach((tr) => {
        if (tr.dataset.invFisicoEmpty === '1') {
            tr.style.display = '';
            return;
        }
        const marcaRow = String(tr.dataset.marca || '').toLowerCase();
        const existencia = Number(tr.dataset.existencia);
        const marcaOk = !marca || marcaRow === marca;
        const textoOk = !texto || String(tr.textContent || '').toLowerCase().includes(texto);
        const existenciaOk = !soloSinExistencia || (!Number.isNaN(existencia) && existencia <= 0);
        tr.style.display = (marcaOk && textoOk && existenciaOk) ? '' : 'none';
    });
    inv_fisico_actualizar_total();
}

function inv_fisico_render_rows(rows) {
    const container = document.getElementById('tblDataInventario');
    if (!container) return;

    if (!rows || !rows.length) {
        container.innerHTML = `<tr data-inv-fisico-empty="1"><td colspan="7" class="text-center text-muted py-3">No se cargaron datos...</td></tr>`;
        inv_fisico_actualizar_total();
        return;
    }

    let str = '';
    rows.forEach((r) => {
        const totalunidades = Number(r.TOTALUNIDADES) || 0;
        const uxc = Number(r.UXC) || 1;
        const cajas = uxc ? (totalunidades / uxc) : 0;
        const marca = String(r.DESMARCA || '').trim();
        const totalCosto = Number(r.COSTO || 0) * totalunidades;
        str += `
            <tr data-marca="${marca.replace(/"/g, '&quot;')}"
                data-existencia="${totalunidades}"
                data-codigodun="${String(r.CODPROD2 || '').replace(/"/g, '&quot;')}"
                data-codigo3="${String(r.DESPROD3 || '').replace(/"/g, '&quot;')}"
                data-totalcosto="${totalCosto}">
                <td>${r.CODPROD || ''}</td>
                <td>${r.CODPROD2 || ''}</td>
                <td>${r.DESPROD || ''}</td>
                <td>${marca}</td>
                <td>${r.TOTALUNIDADES}</td>
                <td>${F.setMoneda(cajas, '')}</td>
                <td class="text-right">${F.setMoneda(totalCosto, 'Q')}</td>
            </tr>
        `;
    });
    container.innerHTML = str;
    inv_fisico_aplicar_filtros();
}

function addListeners(){
    const cmbSucursal = document.getElementById('cmbSucursal');

    GF.get_data_empresas()
        .then((data) => {
            let str = `<option value="%">TODAS</option>`;
            data.recordset.map((r) => {
                str += `<option value="${r.EMPNIT}">${r.NOMBRE}</option>`;
            });
            cmbSucursal.innerHTML = str;

            if (Number(GlobalNivelUsuario) != 1) {
                cmbSucursal.value = GlobalEmpnit;
                if (Number(GlobalNivelUsuario) != 5) {
                    cmbSucursal.disabled = true;
                }
            }

            tbl_inventario();
        })
        .catch(() => {
            cmbSucursal.innerHTML = `<option value="%">No se cargaron las sedes</option>`;
        });

    cmbSucursal?.addEventListener('change', () => tbl_inventario());
    document.getElementById('cmbSt')?.addEventListener('change', () => tbl_inventario());
    document.getElementById('cmbInvFisicoMarca')?.addEventListener('change', () => inv_fisico_aplicar_filtros());
    document.getElementById('txtInvFisicoBuscar')?.addEventListener('input', () => inv_fisico_aplicar_filtros());
    document.getElementById('btnInvFisicoExistenciaToggle')?.addEventListener('click', () => inv_fisico_toggle_existencia());

    const btnExportarInventario = document.getElementById('btnExportarInventario');
    btnExportarInventario?.addEventListener('click', () => {
        const st = document.getElementById('cmbSt')?.value || 'SI';
        const sucursal = document.getElementById('cmbSucursal')?.value || '%';

        btnExportarInventario.disabled = true;
        btnExportarInventario.innerHTML = `<i class="fal fa-share fa-spin"></i>`;

        GF.data_inventarios_general_export(sucursal, st)
            .then((data) => {
                let datos = data.recordset || [];
                if (inv_fisico_modo_existencia === 'SIN_EXISTENCIA') {
                    datos = datos.filter((r) => Number(r.TOTALUNIDADES) <= 0);
                }
                const marca = String(document.getElementById('cmbInvFisicoMarca')?.value || '').trim().toLowerCase();
                const texto = String(document.getElementById('txtInvFisicoBuscar')?.value || '').trim().toLowerCase();
                if (marca) {
                    datos = datos.filter((r) => String(r.DESMARCA || '').trim().toLowerCase() === marca);
                }
                if (texto) {
                    datos = datos.filter((r) => {
                        const blob = `${r.CODPROD || ''} ${r.DESPROD || ''} ${r.DESMARCA || ''}`.toLowerCase();
                        return blob.includes(texto);
                    });
                }
                F.export_json_to_xlsx(datos, `Inventario ${F.getFecha().replace('/', '.')}`);
            })
            .catch(() => {
                F.AvisoError('No se pudo exportar');
            })
            .finally(() => {
                btnExportarInventario.disabled = false;
                btnExportarInventario.innerHTML = `<i class="fal fa-share"></i> Exportar Excel`;
            });
    });

    inv_fisico_sync_toggle_ui();
};

function initView(){
    inv_fisico_cache = [];
    inv_fisico_modo_existencia = 'TODOS';
    getView();
    addListeners();
};

function tbl_inventario(){
    const container = document.getElementById('tblDataInventario');
    if (!container) return;

    container.innerHTML = GlobalLoader;
    inv_fisico_cache = [];

    const sucursal = document.getElementById('cmbSucursal')?.value || '%';
    const st = document.getElementById('cmbSt')?.value || 'SI';

    GF.get_data_inventarios_general(sucursal, st)
        .then((data) => {
            inv_fisico_cache = data.recordset || [];
            inv_fisico_llenar_marcas(inv_fisico_cache);
            inv_fisico_render_rows(inv_fisico_cache);
            inv_fisico_sync_toggle_ui();
        })
        .catch(() => {
            inv_fisico_cache = [];
            inv_fisico_llenar_marcas([]);
            container.innerHTML = `<tr data-inv-fisico-empty="1"><td colspan="7" class="text-center text-muted py-3">No se cargaron datos...</td></tr>`;
            inv_fisico_actualizar_total();
            inv_fisico_sync_toggle_ui();
        });
};
