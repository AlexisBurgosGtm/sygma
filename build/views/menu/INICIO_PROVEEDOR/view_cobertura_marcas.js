
function getView() {
    const view = {
        body: () => `
            <div class="proveedor-cobertura-marcas proveedor-cobertura-clientes proveedor-rpt-marcas">
                <div class="proveedor-rpt-marcas__hero card shadow-sm mb-3">
                    <div class="card-body py-3 px-4 d-flex align-items-center justify-content-between flex-wrap">
                        <div>
                            <h5 class="negrita text-info mb-1">Cobertura marcas</h5>
                            <small class="text-muted d-block">Facturas FAC activas (sin anuladas) · clientes únicos por vendedor</small>
                            <small class="text-muted">Universo disponible: <span class="negrita text-base" id="lbCoberturaMarcasUniverso">--</span> clientes habilitados</small>
                        </div>
                        <span class="proveedor-rpt-marcas__total-badge negrita" id="lbCoberturaMarcasTotalImporte">--</span>
                    </div>
                </div>

                <div class="proveedor-rpt-marcas__panel card shadow-sm">
                    <div class="proveedor-rpt-marcas__panel-header">
                        <span class="negrita text-primary">Resumen por vendedor</span>
                    </div>
                    <div class="card-body p-3">
                        <div class="form-group mb-2">
                            <label class="small text-muted mb-1" for="cmbCoberturaMarca">Marca</label>
                            <select class="form-control form-control-sm" id="cmbCoberturaMarca">
                                <option value="TODAS">TODAS LAS MARCAS</option>
                            </select>
                        </div>

                        <input type="text"
                            class="form-control form-control-sm mb-2"
                            id="txtBuscarCoberturaMarcas"
                            placeholder="Buscar vendedor..."
                            oninput="F.FiltrarTabla('tblCoberturaMarcas','txtBuscarCoberturaMarcas')">

                        <small class="proveedor-tabla-clic-hint"><i class="fal fa-hand-pointer mr-1"></i>Clic para ver detalles</small>
                        <div class="table-responsive proveedor-rpt-marcas__scroll">
                            <table class="table table-sm table-bordered table-hover proveedor-rpt-marcas__table mb-0" id="tblCoberturaMarcas">
                                <thead class="bg-primary text-white">
                                    <tr>
                                        <td>VENDEDOR</td>
                                        <td class="text-right">CLIENTES ALCANZADOS</td>
                                        <td class="text-right">%</td>
                                        <td class="text-right">FALTAN</td>
                                        <td class="text-right">IMPORTE</td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataCoberturaMarcas"></tbody>
                                <tfoot class="bg-primary text-white negrita">
                                    <tr>
                                        <td>TOTAL</td>
                                        <td class="text-right" id="lbFootCoberturaMarcasClientes">--</td>
                                        <td class="text-right" id="lbFootCoberturaMarcasPct">--</td>
                                        <td class="text-right" id="lbFootCoberturaMarcasFaltan">--</td>
                                        <td class="text-right" id="lbFootCoberturaMarcasImporte">--</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            ${view.modal_marcas_vendedor()}
        `,
        modal_marcas_vendedor: () => `
            <div id="modal_cobertura_vendedor_marcas"
                class="modal fade proveedor-cobertura-marca-modal"
                tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content border-0 shadow-none">
                        <div class="proveedor-cobertura-marca-modal__header">
                            <div>
                                <h5 class="negrita mb-0" id="lbCoberturaVendedorModalTitulo">Vendedor</h5>
                                <small class="text-muted">Cobertura por marca · clientes contados una sola vez</small>
                            </div>
                            <button type="button" class="btn btn-sm btn-circle proveedor-cobertura-marca-modal__close hand" data-dismiss="modal" aria-label="Cerrar">
                                <i class="fal fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-body p-0">
                            <div class="proveedor-cobertura-marca-modal__body">
                                <div class="table-responsive proveedor-rpt-marcas__scroll proveedor-cobertura-marca-modal__scroll">
                                    <table class="table table-sm table-bordered table-hover proveedor-rpt-marcas__table mb-0" id="tblCoberturaVendedorMarcas">
                                        <thead class="bg-primary text-white">
                                            <tr>
                                                <td>MARCA</td>
                                                <td class="text-right">ALCANZADOS</td>
                                                <td class="text-right">%</td>
                                                <td class="text-right">FALTAN</td>
                                                <td class="text-right">IMPORTE</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataCoberturaVendedorMarcas"></tbody>
                                        <tfoot class="bg-primary text-white negrita">
                                            <tr>
                                                <td>TOTAL</td>
                                                <td class="text-right" id="lbFootVendMarcaAlcanzados">--</td>
                                                <td class="text-right" id="lbFootVendMarcaPct">--</td>
                                                <td class="text-right" id="lbFootVendMarcaFaltan">--</td>
                                                <td class="text-right" id="lbFootVendMarcaImporte">--</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    root.innerHTML = view.body();
}

function cobertura_marcas_resolveData(data) {
    if (!data || data.toString() === 'error') return [];
    if (Array.isArray(data.recordset)) return data.recordset;
    if (Array.isArray(data)) return data;
    return [];
}

function cobertura_marcas_formatPct(alcanzados, universo) {
    const u = Number(universo) || 0;
    const a = Number(alcanzados) || 0;
    if (u <= 0) return '--';
    return F.getParticipacion(a, u);
}

function cobertura_marcas_fillSelector(marcas) {
    const cmb = document.getElementById('cmbCoberturaMarca');
    if (!cmb) return;

    const selected = cmb.value || 'TODAS';
    let str = `<option value="TODAS">TODAS LAS MARCAS</option>`;
    marcas.forEach((r) => {
        const desmarca = String(r.DESMARCA || '').replace(/"/g, '&quot;');
        str += `<option value="${r.CODMARCA}">${desmarca}</option>`;
    });
    cmb.innerHTML = str;
    if ([...cmb.options].some((opt) => opt.value === selected)) {
        cmb.value = selected;
    } else {
        cmb.value = 'TODAS';
    }
}

function cobertura_marcas_renderVendedores(items) {
    const container = document.getElementById('tblDataCoberturaMarcas');
    if (!container) return;

    let totalClientesUnicos = 0;
    let totalFaltan = 0;
    let totalImporte = 0;
    let str = '';

    items.forEach((r) => {
        if (r.TOTAL_CLIENTES_MARCA != null) {
            totalClientesUnicos = Number(r.TOTAL_CLIENTES_MARCA) || totalClientesUnicos;
        } else if (r.TOTAL_CLIENTES != null) {
            totalClientesUnicos = Number(r.TOTAL_CLIENTES) || totalClientesUnicos;
        }
        const clientes = Number(r.CLIENTES) || 0;
        const universo = Number(r.UNIVERSO_EMP) || 0;
        const importe = Number(r.IMPORTE) || 0;
        const faltan = Math.max(0, universo - clientes);
        const nomempAttr = String(r.NOMEMPLEADO || '').replace(/"/g, '&quot;');
        totalFaltan += faltan;
        totalImporte += importe;
        str += `
            <tr class="proveedor-rpt-marcas__row hand"
                data-codemp="${r.CODEMP}"
                data-nomemp="${nomempAttr}">
                <td>${r.NOMEMPLEADO || ''}</td>
                <td class="text-right">${clientes}</td>
                <td class="text-right">${cobertura_marcas_formatPct(clientes, universo)}</td>
                <td class="text-right">${faltan}</td>
                <td class="text-right">${F.setMoneda(importe, 'Q')}</td>
            </tr>
        `;
    });

    container.innerHTML = str || '<tr><td colspan="5" class="text-center text-muted">Sin datos</td></tr>';

    const footClientes = document.getElementById('lbFootCoberturaMarcasClientes');
    const footPct = document.getElementById('lbFootCoberturaMarcasPct');
    const footFaltan = document.getElementById('lbFootCoberturaMarcasFaltan');
    const footImporte = document.getElementById('lbFootCoberturaMarcasImporte');
    const badgeTotal = document.getElementById('lbCoberturaMarcasTotalImporte');

    if (footClientes) footClientes.innerText = String(totalClientesUnicos);
    if (footPct) footPct.innerText = '--';
    if (footFaltan) footFaltan.innerText = String(totalFaltan);
    if (footImporte) footImporte.innerText = F.setMoneda(totalImporte, 'Q');
    if (badgeTotal) badgeTotal.innerText = F.setMoneda(totalImporte, 'Q');
}

function cobertura_marcas_openMarcas(codemp, nomemp) {
    const container = document.getElementById('tblDataCoberturaVendedorMarcas');
    if (!container) return;

    document.getElementById('lbCoberturaVendedorModalTitulo').innerText = nomemp || 'Vendedor';
    container.innerHTML = `<tr><td colspan="5" class="text-center">${GlobalLoader}</td></tr>`;
    $('#modal_cobertura_vendedor_marcas').modal({ backdrop: true, keyboard: true, show: true });

    const sucursal = proveedor_getSucursal();
    const mes = proveedor_getMes();
    const anio = proveedor_getAnio();

    axios.post('/objetivos/get_cobertura_marcas_por_vendedor', {
        token: typeof TOKEN !== 'undefined' ? TOKEN : '',
        sucursal,
        mes,
        anio,
        codemp: Number(codemp)
    })
    .then((res) => {
        const items = cobertura_marcas_resolveData(res.data);
        let universo = 0;
        let totalClientes = 0;
        let totalFaltan = 0;
        let totalImporte = 0;
        let str = '';

        items.forEach((r) => {
            if (!universo && r.UNIVERSO != null) universo = Number(r.UNIVERSO) || 0;
            const clientes = Number(r.CLIENTES) || 0;
            const importe = Number(r.IMPORTE) || 0;
            const faltan = Math.max(0, universo - clientes);
            totalClientes += clientes;
            totalFaltan += faltan;
            totalImporte += importe;
            str += `
                <tr>
                    <td>${r.DESMARCA || ''}</td>
                    <td class="text-right">${clientes}</td>
                    <td class="text-right">${cobertura_marcas_formatPct(clientes, universo)}</td>
                    <td class="text-right">${faltan}</td>
                    <td class="text-right">${F.setMoneda(importe, 'Q')}</td>
                </tr>
            `;
        });

        container.innerHTML = str || '<tr><td colspan="5" class="text-center text-muted">Sin datos</td></tr>';

        document.getElementById('lbFootVendMarcaAlcanzados').innerText = String(totalClientes);
        document.getElementById('lbFootVendMarcaPct').innerText = '--';
        document.getElementById('lbFootVendMarcaFaltan').innerText = String(totalFaltan);
        document.getElementById('lbFootVendMarcaImporte').innerText = F.setMoneda(totalImporte, 'Q');
    })
    .catch(() => {
        container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se cargaron datos</td></tr>';
        ['lbFootVendMarcaAlcanzados', 'lbFootVendMarcaPct', 'lbFootVendMarcaFaltan', 'lbFootVendMarcaImporte']
            .forEach((id) => {
                const el = document.getElementById(id);
                if (el) el.innerText = '--';
            });
    });
}

function rpt_cobertura_vendedores() {
    const container = document.getElementById('tblDataCoberturaMarcas');
    if (!container) return;

    container.innerHTML = `<tr><td colspan="5" class="text-center">${GlobalLoader}</td></tr>`;

    const sucursal = proveedor_getSucursal();
    const mes = proveedor_getMes();
    const anio = proveedor_getAnio();
    const cmb = document.getElementById('cmbCoberturaMarca');
    const marca = cmb ? cmb.value : 'TODAS';
    const esTodas = !marca || marca === 'TODAS';
    const url = esTodas
        ? '/objetivos/get_cobertura_vendedores'
        : '/objetivos/get_cobertura_marcas_vendedores';
    const payload = {
        token: typeof TOKEN !== 'undefined' ? TOKEN : '',
        sucursal,
        mes,
        anio
    };
    if (!esTodas) payload.codmarca = Number(marca);

    axios.post(url, payload)
    .then((res) => {
        cobertura_marcas_renderVendedores(cobertura_marcas_resolveData(res.data));
    })
    .catch(() => {
        container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se cargaron datos</td></tr>';
        ['lbFootCoberturaMarcasClientes', 'lbFootCoberturaMarcasPct',
            'lbFootCoberturaMarcasFaltan', 'lbFootCoberturaMarcasImporte', 'lbCoberturaMarcasTotalImporte']
            .forEach((id) => {
                const el = document.getElementById(id);
                if (el) el.innerText = '--';
            });
    });
}

function rpt_cobertura_marcas() {
    const container = document.getElementById('tblDataCoberturaMarcas');
    if (container) {
        container.innerHTML = `<tr><td colspan="5" class="text-center">${GlobalLoader}</td></tr>`;
    }

    const sucursal = proveedor_getSucursal();
    const mes = proveedor_getMes();
    const anio = proveedor_getAnio();

    axios.post('/objetivos/get_cobertura_marcas', {
        token: typeof TOKEN !== 'undefined' ? TOKEN : '',
        sucursal,
        mes,
        anio
    })
    .then((res) => {
        const items = cobertura_marcas_resolveData(res.data);
        let universo = 0;
        items.forEach((r) => {
            if (!universo && r.UNIVERSO != null) universo = Number(r.UNIVERSO) || 0;
        });
        const lbUniverso = document.getElementById('lbCoberturaMarcasUniverso');
        if (lbUniverso) lbUniverso.innerText = String(universo);
        cobertura_marcas_fillSelector(items);
        rpt_cobertura_vendedores();
    })
    .catch(() => {
        cobertura_marcas_fillSelector([]);
        if (container) {
            container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se cargaron datos</td></tr>';
        }
        ['lbCoberturaMarcasUniverso', 'lbFootCoberturaMarcasClientes', 'lbFootCoberturaMarcasPct',
            'lbFootCoberturaMarcasFaltan', 'lbFootCoberturaMarcasImporte', 'lbCoberturaMarcasTotalImporte']
            .forEach((id) => {
                const el = document.getElementById(id);
                if (el) el.innerText = '--';
            });
    });
}

function addListeners() {
    document.getElementById('tblCoberturaMarcas')?.addEventListener('click', (e) => {
        const row = e.target.closest('tr[data-codemp]');
        if (!row) return;
        cobertura_marcas_openMarcas(row.dataset.codemp, row.dataset.nomemp);
    });

    document.getElementById('cmbCoberturaMarca')?.addEventListener('change', () => {
        rpt_cobertura_vendedores();
    });

    rpt_cobertura_marcas();
    window.proveedor_embedRefresh = rpt_cobertura_marcas;
}

function initView() {
    getView();
    addListeners();
}
