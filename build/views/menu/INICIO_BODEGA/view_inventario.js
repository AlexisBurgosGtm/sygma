/**
 * Inventario físico — perfil Bodega (inicio_compras).
 * Copia adaptada de bodega_inv_fisico/view_inv_fisico.js:
 * - Sin selector de sucursal (usa encabezado / GlobalEmpnit)
 * - Columnas CODIGO_DUN, CODIGO 3 y TOTALCOSTO ocultas en UI (siguen en consulta)
 * - Filtro por marca + búsqueda de texto
 * - Toggle TODOS / SIN EXISTENCIA
 */
var bodega_inv_cache = [];
var bodega_inv_listeners_bound = false;
var bodega_inv_modo_existencia = 'TODOS'; // TODOS | SIN_EXISTENCIA

function bodega_inv_getSucursal() {
    return document.getElementById('cmbSucursalHeader')?.value || GlobalEmpnit || '';
}

function bodega_inv_html() {
    return `
    <div class="card card-rounded shadow col-12 bodega-inv-card" id="bodegaInvCard">
        <div class="card-body p-3">
            <div class="bodega-inv-header mb-3">
                <div class="bodega-inv-header__top">
                    <div class="bodega-inv-header__title-block">
                        <h4 class="negrita text-danger mb-1">Inventario actual</h4>
                        <small class="text-muted d-block">Existencias de la sucursal del encabezado</small>
                    </div>
                    <div class="bodega-inv-header__actions">
                        <button type="button" class="btn btn-sm hand shadow bodega-inv-existencia-toggle is-todos"
                            id="btnBodegaInvExistenciaToggle" title="Alternar todos / sin existencia" aria-pressed="false">
                            <i class="fal fa-boxes mr-1"></i>
                            <span class="bodega-inv-existencia-toggle__label">TODOS</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="bodega-inv-filters bodega-inv-filters--bar mb-3">
                <div class="bodega-inv-filters__item">
                    <label class="bodega-inv-filters__label negrita text-secondary mb-1" for="cmbBodegaInvSt">Estado</label>
                    <select class="form-control form-control-sm negrita text-danger bodega-inv-filters__control" id="cmbBodegaInvSt">
                        <option value="SI">HABILITADOS</option>
                        <option value="NO">DESHABILITADOS</option>
                    </select>
                </div>
                <div class="bodega-inv-filters__item">
                    <label class="bodega-inv-filters__label negrita text-secondary mb-1" for="cmbBodegaInvMarca">Marca</label>
                    <select class="form-control form-control-sm negrita bodega-inv-filters__control" id="cmbBodegaInvMarca">
                        <option value="">TODAS LAS MARCAS</option>
                    </select>
                </div>
                <div class="bodega-inv-filters__item bodega-inv-filters__item--grow">
                    <label class="bodega-inv-filters__label negrita text-secondary mb-1" for="txtBodegaInvBuscar">Buscar</label>
                    <div class="bodega-inv-search">
                        <i class="fal fa-search bodega-inv-search__icon"></i>
                        <input type="text" class="form-control form-control-sm bodega-inv-filters__control bodega-inv-search__input" id="txtBodegaInvBuscar"
                            placeholder="Código, producto o marca...">
                    </div>
                </div>
            </div>

            <div class="table-responsive bodega-inv-table-wrap">
                <table class="table table-hover table-sm col-12 mb-0 bodega-inv-table" id="tblBodegaInventario">
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
                    <tbody id="tblDataBodegaInventario"></tbody>
                </table>
            </div>
            <div class="bodega-inv-total" id="lbBodegaInvTotalCosto">
                <span class="bodega-inv-total__label">TOTAL COSTO</span>
                <span class="bodega-inv-total__value">Q0.00</span>
            </div>
        </div>
    </div>
    `;
}

function bodega_inv_sync_toggle_ui() {
    const btn = document.getElementById('btnBodegaInvExistenciaToggle');
    if (!btn) return;
    const sinExistencia = bodega_inv_modo_existencia === 'SIN_EXISTENCIA';
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

function bodega_inv_toggle_existencia() {
    bodega_inv_modo_existencia = bodega_inv_modo_existencia === 'TODOS'
        ? 'SIN_EXISTENCIA'
        : 'TODOS';
    bodega_inv_sync_toggle_ui();
    bodega_inv_aplicar_filtros();
}

function bodega_inv_llenar_marcas(rows) {
    const cmb = document.getElementById('cmbBodegaInvMarca');
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

function bodega_inv_actualizar_total() {
    const tbody = document.getElementById('tblDataBodegaInventario');
    const lb = document.getElementById('lbBodegaInvTotalCosto');
    if (!lb) return;
    let total = 0;
    if (tbody) {
        Array.from(tbody.querySelectorAll('tr')).forEach((tr) => {
            if (tr.dataset.bodegaInvEmpty === '1') return;
            if (tr.style.display === 'none') return;
            total += Number(tr.dataset.totalcosto) || 0;
        });
    }
    const value = lb.querySelector('.bodega-inv-total__value');
    if (value) value.textContent = F.setMoneda(total, 'Q');
}

function bodega_inv_aplicar_filtros() {
    const tbody = document.getElementById('tblDataBodegaInventario');
    if (!tbody) return;
    const marca = String(document.getElementById('cmbBodegaInvMarca')?.value || '').trim().toLowerCase();
    const texto = String(document.getElementById('txtBodegaInvBuscar')?.value || '').trim().toLowerCase();
    const soloSinExistencia = bodega_inv_modo_existencia === 'SIN_EXISTENCIA';

    Array.from(tbody.querySelectorAll('tr')).forEach((tr) => {
        if (tr.dataset.bodegaInvEmpty === '1') {
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
    bodega_inv_actualizar_total();
}

function bodega_inv_render_rows(rows) {
    const container = document.getElementById('tblDataBodegaInventario');
    if (!container) return;

    if (!rows || !rows.length) {
        container.innerHTML = `<tr data-bodega-inv-empty="1"><td colspan="7" class="text-center text-muted py-3">No se cargaron datos...</td></tr>`;
        bodega_inv_actualizar_total();
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
    bodega_inv_aplicar_filtros();
}

function bodega_inv_cargar() {
    const container = document.getElementById('tblDataBodegaInventario');
    if (!container) return;

    const sucursal = bodega_inv_getSucursal();
    const st = document.getElementById('cmbBodegaInvSt')?.value || 'SI';
    container.innerHTML = GlobalLoader;
    bodega_inv_cache = [];

    GF.get_data_inventarios_general(sucursal, st)
        .then((data) => {
            bodega_inv_cache = data.recordset || [];
            bodega_inv_llenar_marcas(bodega_inv_cache);
            bodega_inv_render_rows(bodega_inv_cache);
            bodega_inv_sync_toggle_ui();
        })
        .catch(() => {
            bodega_inv_cache = [];
            bodega_inv_llenar_marcas([]);
            container.innerHTML = `<tr data-bodega-inv-empty="1"><td colspan="7" class="text-center text-muted py-3">No se cargaron datos...</td></tr>`;
            bodega_inv_actualizar_total();
            bodega_inv_sync_toggle_ui();
        });
}

function bodega_inv_bind_listeners() {
    if (bodega_inv_listeners_bound) return;
    const root = document.getElementById('bodegaInvCard');
    if (!root) return;

    document.getElementById('cmbBodegaInvSt')?.addEventListener('change', () => bodega_inv_cargar());
    document.getElementById('cmbBodegaInvMarca')?.addEventListener('change', () => bodega_inv_aplicar_filtros());
    document.getElementById('txtBodegaInvBuscar')?.addEventListener('input', () => bodega_inv_aplicar_filtros());
    document.getElementById('btnBodegaInvExistenciaToggle')?.addEventListener('click', () => bodega_inv_toggle_existencia());
    bodega_inv_listeners_bound = true;
}

function bodega_inv_init() {
    bodega_inv_bind_listeners();
    bodega_inv_sync_toggle_ui();
    bodega_inv_cargar();
}

window.bodega_inv_html = bodega_inv_html;
window.bodega_inv_init = bodega_inv_init;
window.bodega_inv_cargar = bodega_inv_cargar;
