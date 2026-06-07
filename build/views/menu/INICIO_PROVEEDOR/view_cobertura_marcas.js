
function getView() {
    const view = {
        body: () => `
            <div class="proveedor-cobertura-marcas proveedor-cobertura-clientes proveedor-rpt-marcas">
                <div class="proveedor-rpt-marcas__hero card shadow-sm mb-3">
                    <div class="card-body py-3 px-4 d-flex align-items-center justify-content-between flex-wrap">
                        <div>
                            <h5 class="negrita text-info mb-1">Cobertura marcas</h5>
                            <small class="text-muted d-block">Facturas FAC activas (sin anuladas) · clientes únicos por marca</small>
                            <small class="text-muted">Universo disponible: <span class="negrita text-base" id="lbCoberturaMarcasUniverso">--</span> clientes habilitados</small>
                        </div>
                        <span class="proveedor-rpt-marcas__total-badge negrita" id="lbCoberturaMarcasTotalImporte">--</span>
                    </div>
                </div>

                <div class="proveedor-rpt-marcas__panel card shadow-sm">
                    <div class="proveedor-rpt-marcas__panel-header">
                        <span class="negrita text-primary">Resumen por marca</span>
                        <small class="text-muted ml-2">Clic en una fila para ver vendedores</small>
                    </div>
                    <div class="card-body p-3">
                        <input type="text"
                            class="form-control form-control-sm mb-2"
                            id="txtBuscarCoberturaMarcas"
                            placeholder="Buscar marca..."
                            oninput="F.FiltrarTabla('tblCoberturaMarcas','txtBuscarCoberturaMarcas')">

                        <div class="table-responsive proveedor-rpt-marcas__scroll">
                            <table class="table table-sm table-bordered table-hover proveedor-rpt-marcas__table mb-0" id="tblCoberturaMarcas">
                                <thead class="bg-primary text-white">
                                    <tr>
                                        <td>MARCA</td>
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
            ${view.modal_vendedores_marca()}
        `,
        modal_vendedores_marca: () => `
            <div id="modal_cobertura_marca_vendedores"
                class="modal fade proveedor-cobertura-marca-modal"
                tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content border-0 shadow-none">
                        <div class="proveedor-cobertura-marca-modal__header">
                            <div>
                                <h5 class="negrita mb-0" id="lbCoberturaMarcaModalTitulo">Marca</h5>
                                <small class="text-muted">Cobertura por vendedor · clientes contados una sola vez</small>
                            </div>
                            <button type="button" class="btn btn-sm btn-circle proveedor-cobertura-marca-modal__close hand" data-dismiss="modal" aria-label="Cerrar">
                                <i class="fal fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-body p-0">
                            <div class="proveedor-cobertura-marca-modal__body">
                                <div class="table-responsive proveedor-rpt-marcas__scroll proveedor-cobertura-marca-modal__scroll">
                                    <table class="table table-sm table-bordered table-hover proveedor-rpt-marcas__table mb-0" id="tblCoberturaMarcaVendedores">
                                        <thead class="bg-primary text-white">
                                            <tr>
                                                <td>VENDEDOR</td>
                                                <td class="text-right">ALCANZADOS</td>
                                                <td class="text-right">UNIVERSO</td>
                                                <td class="text-right">%</td>
                                                <td class="text-right">IMPORTE</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataCoberturaMarcaVendedores"></tbody>
                                        <tfoot class="bg-primary text-white negrita">
                                            <tr>
                                                <td>TOTAL</td>
                                                <td class="text-right" id="lbFootMarcaVendAlcanzados">--</td>
                                                <td class="text-right" id="lbFootMarcaVendUniverso">--</td>
                                                <td class="text-right" id="lbFootMarcaVendPct">--</td>
                                                <td class="text-right" id="lbFootMarcaVendImporte">--</td>
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

function cobertura_marcas_openVendedores(codmarca, desmarca, clientesMarca) {
    const container = document.getElementById('tblDataCoberturaMarcaVendedores');
    if (!container) return;

    document.getElementById('lbCoberturaMarcaModalTitulo').innerText = desmarca || 'Marca';
    container.innerHTML = `<tr><td colspan="5" class="text-center">${GlobalLoader}</td></tr>`;
    $('#modal_cobertura_marca_vendedores').modal({ backdrop: true, keyboard: true, show: true });

    const sucursal = proveedor_getSucursal();
    const mes = proveedor_getMes();
    const anio = proveedor_getAnio();

    axios.post('/objetivos/get_cobertura_marcas_vendedores', {
        token: typeof TOKEN !== 'undefined' ? TOKEN : '',
        sucursal,
        mes,
        anio,
        codmarca: Number(codmarca)
    })
    .then((res) => {
        const items = cobertura_marcas_resolveData(res.data);
        let totalUniverso = 0;
        let totalImporte = 0;
        let totalClientesMarca = Number(clientesMarca) || 0;
        let str = '';

        items.forEach((r) => {
            if (!totalClientesMarca && r.TOTAL_CLIENTES_MARCA != null) {
                totalClientesMarca = Number(r.TOTAL_CLIENTES_MARCA) || 0;
            }
            const alcanzados = Number(r.CLIENTES) || 0;
            const universo = Number(r.UNIVERSO_EMP) || 0;
            const importe = Number(r.IMPORTE) || 0;
            totalUniverso += universo;
            totalImporte += importe;
            str += `
                <tr>
                    <td>${r.NOMEMPLEADO || ''}</td>
                    <td class="text-right">${alcanzados}</td>
                    <td class="text-right">${universo}</td>
                    <td class="text-right">${cobertura_marcas_formatPct(alcanzados, universo)}</td>
                    <td class="text-right">${F.setMoneda(importe, 'Q')}</td>
                </tr>
            `;
        });

        container.innerHTML = str || '<tr><td colspan="5" class="text-center text-muted">Sin datos</td></tr>';

        document.getElementById('lbFootMarcaVendAlcanzados').innerText = String(totalClientesMarca);
        document.getElementById('lbFootMarcaVendUniverso').innerText = String(totalUniverso);
        document.getElementById('lbFootMarcaVendPct').innerText = '--';
        document.getElementById('lbFootMarcaVendImporte').innerText = F.setMoneda(totalImporte, 'Q');
    })
    .catch(() => {
        container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se cargaron datos</td></tr>';
        ['lbFootMarcaVendAlcanzados', 'lbFootMarcaVendUniverso', 'lbFootMarcaVendPct', 'lbFootMarcaVendImporte']
            .forEach((id) => {
                const el = document.getElementById(id);
                if (el) el.innerText = '--';
            });
    });
}

function rpt_cobertura_marcas() {
    const container = document.getElementById('tblDataCoberturaMarcas');
    if (!container) return;

    container.innerHTML = `<tr><td colspan="5" class="text-center">${GlobalLoader}</td></tr>`;

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
        let totalClientes = 0;
        let totalFaltan = 0;
        let totalImporte = 0;
        let str = '';

        items.forEach((r) => {
            if (!universo && r.UNIVERSO != null) universo = Number(r.UNIVERSO) || 0;
            const clientes = Number(r.CLIENTES) || 0;
            const importe = Number(r.IMPORTE) || 0;
            const faltan = Math.max(0, universo - clientes);
            const desmarcaAttr = String(r.DESMARCA || '').replace(/"/g, '&quot;');
            totalClientes += clientes;
            totalFaltan += faltan;
            totalImporte += importe;
            str += `
                <tr class="proveedor-rpt-marcas__row hand"
                    data-codmarca="${r.CODMARCA}"
                    data-desmarca="${desmarcaAttr}"
                    data-clientes="${clientes}">
                    <td>${r.DESMARCA || ''}</td>
                    <td class="text-right">${clientes}</td>
                    <td class="text-right">${cobertura_marcas_formatPct(clientes, universo)}</td>
                    <td class="text-right">${faltan}</td>
                    <td class="text-right">${F.setMoneda(importe, 'Q')}</td>
                </tr>
            `;
        });

        container.innerHTML = str || '<tr><td colspan="5" class="text-center text-muted">Sin datos</td></tr>';

        const lbUniverso = document.getElementById('lbCoberturaMarcasUniverso');
        const footClientes = document.getElementById('lbFootCoberturaMarcasClientes');
        const footPct = document.getElementById('lbFootCoberturaMarcasPct');
        const footFaltan = document.getElementById('lbFootCoberturaMarcasFaltan');
        const footImporte = document.getElementById('lbFootCoberturaMarcasImporte');
        const badgeTotal = document.getElementById('lbCoberturaMarcasTotalImporte');

        if (lbUniverso) lbUniverso.innerText = String(universo);
        if (footClientes) footClientes.innerText = String(totalClientes);
        if (footPct) footPct.innerText = '--';
        if (footFaltan) footFaltan.innerText = String(totalFaltan);
        if (footImporte) footImporte.innerText = F.setMoneda(totalImporte, 'Q');
        if (badgeTotal) badgeTotal.innerText = F.setMoneda(totalImporte, 'Q');
    })
    .catch(() => {
        container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se cargaron datos</td></tr>';
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
        const row = e.target.closest('tr[data-codmarca]');
        if (!row) return;
        cobertura_marcas_openVendedores(row.dataset.codmarca, row.dataset.desmarca, row.dataset.clientes);
    });

    rpt_cobertura_marcas();
    window.proveedor_embedRefresh = rpt_cobertura_marcas;
}

function initView() {
    getView();
    addListeners();
}
