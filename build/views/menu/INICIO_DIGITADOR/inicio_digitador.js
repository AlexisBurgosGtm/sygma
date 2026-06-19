var digitador_currentPane = 'uno';
var digitador_dashboardCharts = {};

function digitador_getSucursal() {
    return GlobalEmpnit || document.getElementById('cmbSucursalHeader')?.value || '%';
}

function digitador_setupSucursalHeader() {
    const cmb = document.getElementById('cmbSucursalHeader');
    if (!cmb) return;
    const emp = GlobalEmpnit || '%';
    const nom = GlobalNomEmpresa || 'Sede';
    cmb.innerHTML = `<option value="${emp}">${nom}</option>`;
    cmb.value = emp;
    cmb.disabled = true;
}

function digitador_getMes() {
    return document.getElementById('cmbMesHeader')?.value || F.get_mes_curso();
}

function digitador_getAnio() {
    return document.getElementById('cmbAnioHeader')?.value || F.get_anio_curso();
}

function digitador_getModoVentas() {
    return document.getElementById('cmbProveedorModoVentas')?.value || 'bruta';
}

function digitador_labelModoVentas() {
    return digitador_getModoVentas() === 'neta' ? 'Ventas netas' : 'Ventas brutas';
}

function digitador_onHeaderFiltersChange() {
    if (digitador_currentPane === 'uno') {
        digitador_initDashboard();
    }
    if (digitador_currentPane === 'siete') {
        tbl_rpt_sellout();
    }
}

function digitador_setActiveCard(cardId) {
    document.querySelectorAll('.proveedor-menu-card').forEach(el => {
        el.classList.toggle('proveedor-menu-card--active', !!cardId && el.id === cardId);
    });
}

function digitador_toggleSidebar(forceOpen) {
    const sidebar = document.getElementById('digitadorSidebar');
    const backdrop = document.getElementById('digitadorSidebarBackdrop');
    if (!sidebar) return;
    const open = typeof forceOpen === 'boolean' ? forceOpen : !sidebar.classList.contains('proveedor-sidebar--open');
    sidebar.classList.toggle('proveedor-sidebar--open', open);
    backdrop?.classList.toggle('proveedor-sidebar-backdrop--visible', open);
    document.body.classList.toggle('proveedor-sidebar-open', open);
}

function digitador_closeSidebarMobile() {
    if (window.innerWidth < 768) digitador_toggleSidebar(false);
}

function digitador_initDashboard() {
    digitador_loadDashboard();
}

function digitador_showHome() {
    digitador_showPanel('uno', 'btnMenuDashboard', () => digitador_initDashboard());
}

function digitador_showPanel(paneId, cardId, afterShow) {
    digitador_currentPane = paneId;
    digitador_closeSidebarMobile();
    document.querySelectorAll('#myTabHomeContent .tab-pane').forEach(p => {
        p.classList.remove('show', 'active');
    });
    const pane = document.getElementById(paneId);
    if (pane) {
        pane.classList.add('show', 'active');
    }
    document.querySelectorAll('#myTabHome .nav-link').forEach(l => {
        l.classList.remove('active');
        l.setAttribute('aria-selected', 'false');
    });
    const tabLink = document.querySelector(`#myTabHome a[href="#${paneId}"]`);
    if (tabLink) {
        tabLink.classList.add('active');
        tabLink.setAttribute('aria-selected', 'true');
    }
    digitador_setActiveCard(cardId);
    if (typeof afterShow === 'function') afterShow();
}

function getView(){
    root = document.getElementById('root');
    if (!root) {
        console.error('[inicio_digitador] Contenedor #root no encontrado');
        return;
    }
    let view = {
        body:()=>{
            return `
            <div class="proveedor-layout">
            <div class="proveedor-header-card card shadow-sm mb-3">
                <div class="card-body py-2 px-3">
                    <div class="row align-items-center no-gutters">
                        <div class="col-auto pr-2">
                            <img src="./favicon.png" width="50" height="50" alt="Logo">
                        </div>
                        <div class="col-auto pr-3">
                            <h5 class="negrita text-white mb-0">INICIO DIGITADOR</h5>
                            <small class="text-white-50 negrita d-block" id="lbDigitadorEmpresa"></small>
                        </div>
                        <div class="col">
                            <select class="form-control form-control-sm negrita" id="cmbSucursalHeader"></select>
                        </div>
                        <div class="col-auto pl-2">
                            <select class="form-control form-control-sm negrita" id="cmbMesHeader"></select>
                        </div>
                        <div class="col-auto pl-2">
                            <select class="form-control form-control-sm negrita" id="cmbAnioHeader"></select>
                        </div>
                        <div class="col pl-2">
                            <select class="form-control form-control-sm negrita" id="cmbProveedorModoVentas" title="Tipo de ventas">
                                <option value="neta">Ventas netas (venta - devolución)</option>
                                <option value="bruta" selected>Ventas brutas (solo ventas)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <button type="button" class="btn proveedor-menu-toggle d-md-none" id="btnDigitadorMenuToggle" title="Menú de opciones">
                <i class="fal fa-bars"></i><span>Menú</span>
            </button>
            <div class="proveedor-sidebar-backdrop d-md-none" id="digitadorSidebarBackdrop"></div>

            <div class="row proveedor-main-row">
                <div class="col-12 col-md-2 proveedor-sidebar" id="digitadorSidebar">
                    <div class="proveedor-sidebar__scroll">
                        ${view.menu()}
                    </div>
                </div>
                <div class="col-12 col-md-10 proveedor-tab-area">
                    <div id="proveedorPanelContent">
                        <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            <div id="digitadorMainContent">
                                ${view.vista_dashboard()}
                            </div>
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">


                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_relleno()}
                        </div>
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_embarques() + view.vista_embarques_modal_datos() + view.vista_embarques_modal_imprimir() + view.vista_embarques_modal_finalizar()}
                        </div>
                        <div class="tab-pane fade" id="cinco" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_revision_inventario_embarque()}
                        </div>
                        <div class="tab-pane fade" id="seis" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_facturacion()}
                        </div>
                        <div class="tab-pane fade" id="siete" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_sellout()}
                        </div>
                    </div>
                    </div>
                </div>
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
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-cuatro" data-toggle="tab" href="#cuatro" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>  
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-cinco" data-toggle="tab" href="#cinco" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>  
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-seis" data-toggle="tab" href="#seis" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-siete" data-toggle="tab" href="#siete" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>         
                    </ul>
            </div>

                ${view.modal_detalle_documento()}
               
            `
        },
        menu:()=>{
            const items = [
                { id: 'btnMenuDashboard', label: 'Dashboard', icon: 'fa-chart-line', color: 'primary' },
                { id: 'btnMenuFacturacion', label: 'Asignación de facturas', icon: 'fa-box', color: 'info' },
                { id: 'btnMenuRelleno', label: 'Relleno de inventario', icon: 'fa-warehouse', color: 'secondary', badge: 'lbTotalMR' },
                { id: 'btnMenuEmbarques', label: 'Embarques', icon: 'fa-truck', color: 'secondary', badge: 'lbTotalEmb' },
                { id: 'btnMenuSellout', label: 'Sell out', icon: 'fa-chart-pie', color: 'success' },
            ];
            return items.map(item => `
                <div class="card proveedor-menu-card hand" id="${item.id}">
                    <div class="card-body d-flex align-items-center flex-wrap">
                        <i class="fal ${item.icon} text-${item.color} mr-2 proveedor-menu-icon"></i>
                        <span class="negrita proveedor-menu-label">${item.label}</span>
                        ${item.badge ? `<small class="ml-auto text-danger negrita" id="${item.badge}"></small>` : ''}
                    </div>
                </div>
            `).join('');
        },
        vista_dashboard:()=>{
            return `
            <div class="proveedor-dashboard">
                <div class="row">
                    <div class="col-12 col-lg-4 mb-3 mb-lg-0">
                        <div class="card card-rounded shadow h-100 proveedor-dashboard-card">
                            <div class="card-body p-3">
                                <h5 class="negrita text-secondary mb-3">Resumen de inventario por categoria</h5>
                                <div class="proveedor-dashboard-chart mb-3">
                                    <canvas id="chartDigDashInventario"></canvas>
                                </div>
                                <div class="table-responsive proveedor-dashboard-scroll">
                                    <table class="table table-sm table-bordered h-full col-12" id="tblDigDashInventarioCategoria">
                                        <thead class="bg-secondary text-white negrita">
                                            <tr>
                                                <td>CATEGORIA</td>
                                                <td>CAJAS</td>
                                                <td>COSTO</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataDigDashInventarioCategoria"></tbody>
                                        <tfoot class="bg-secondary text-white negrita">
                                            <tr>
                                                <td>TOTALES</td>
                                                <td id="lbDigFootDashInvCajas">--</td>
                                                <td id="lbDigFootDashInvCosto">--</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-4 mb-3 mb-lg-0">
                        <div class="card card-rounded shadow h-100 proveedor-dashboard-card">
                            <div class="card-body p-3">
                                <h5 class="negrita text-info mb-3">Ventas por vendedor</h5>
                                <div class="proveedor-dashboard-chart mb-3">
                                    <canvas id="chartDigDashVentasVendedor"></canvas>
                                </div>
                                <div class="table-responsive proveedor-dashboard-scroll">
                                    <table class="table table-sm table-bordered h-full col-12" id="tblDigDashVentasVendedor">
                                        <thead class="bg-info text-white negrita">
                                            <tr>
                                                <td>VENDEDOR</td>
                                                <td>PEDIDOS</td>
                                                <td>IMPORTE</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataDigDashVentasVendedor"></tbody>
                                        <tfoot class="bg-info text-white negrita">
                                            <tr>
                                                <td>TOTALES</td>
                                                <td id="lbDigFootDashVendedorPedidos">--</td>
                                                <td id="lbDigFootDashVendedorImporte">--</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-4">
                        <div class="card card-rounded shadow h-100 proveedor-dashboard-card">
                            <div class="card-body p-3">
                                <h5 class="negrita text-secondary mb-3">Ventas por marca</h5>
                                <div class="proveedor-dashboard-chart mb-3">
                                    <canvas id="chartDigDashVentasMarca"></canvas>
                                </div>
                                <div class="table-responsive proveedor-dashboard-scroll">
                                    <table class="table table-sm table-bordered h-full col-12" id="tblDigDashVentasMarca">
                                        <thead class="bg-secondary text-white negrita">
                                            <tr>
                                                <td>MARCA</td>
                                                <td>IMPORTE</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataDigDashVentasMarca"></tbody>
                                        <tfoot class="bg-secondary text-white negrita">
                                            <tr>
                                                <td>TOTAL</td>
                                                <td id="lbDigFootDashMarcaImporte">--</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        },
        vista_pedidos_pendientes:()=>{
            return `
            <div class="sygma-embarque-rpt card card-rounded shadow-sm col-12 border-0" id="rpt_facturas_pendientes">
                <div class="card-body sygma-embarque-rpt__body p-2">
                    <header class="sygma-embarque-rpt__header">
                        <div class="sygma-embarque-rpt__brand">
                            <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="40" height="40" alt="Logo">
                            <div class="sygma-embarque-rpt__brand-text">
                                <h4 class="sygma-embarque-rpt__title mb-0">Facturas Pendientes</h4>
                                <span class="sygma-embarque-rpt__embarque-date">Pedidos sin embarque asignado</span>
                            </div>
                        </div>
                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                            <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbPendTotalPedidos"></span>
                            <button type="button" class="btn btn-info btn-md btn-circle hand shadow sygma-embarque-rpt__print-btn" title="Imprimir" onclick="F.imprimirSelec('rpt_facturas_pendientes')">
                                <i class="fal fa-print"></i>
                            </button>
                        </div>
                    </header>

                    <div class="sygma-embarque-rpt__toolbar sygma-pendientes-filtros oculto-impresion">
                        <div class="sygma-pendientes-filtros__row">
                            <input type="text" class="form-control sygma-embarque-rpt__search sygma-pendientes-filtros__search" id="txtFPBuscar"
                                placeholder="Escriba para buscar..."
                                oninput="F.FiltrarTabla('tblPedidos','txtFPBuscar')">
                            <div class="sygma-pendientes-filtros__fecha-wrap">
                                <label class="sygma-pendientes-filtros__label" for="txtFPFechaPend">Fecha</label>
                                <input type="date" class="form-control sygma-pendientes-filtros__fecha" id="txtFPFechaPend" title="Filtrar por fecha del pedido">
                                <button type="button" class="btn btn-outline-secondary btn-sm sygma-pendientes-filtros__btn-clear" id="btnFPQuitarFechaPend" title="Quitar filtro de fecha">
                                    <i class="fal fa-times"></i>
                                </button>
                                <button type="button" class="btn btn-outline-primary btn-sm sygma-pendientes-filtros__btn-today d-none" id="btnFPRestaurarFechaPend" title="Filtrar por fecha de hoy">
                                    Hoy
                                </button>
                            </div>
                            <div class="sygma-pendientes-filtros__vendedor-wrap">
                                <label class="sygma-pendientes-filtros__label" for="cmbFPVendedorPend">Vendedor</label>
                                <select class="form-control sygma-pendientes-filtros__vendedor" id="cmbFPVendedorPend">
                                    <option value="">Todos</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive sygma-embarque-rpt__table-wrap">
                        <table class="table sygma-embarque-rpt__table mb-0" id="tblPedidos">
                            <thead>
                                <tr>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion"></th>
                                    <th>VENDEDOR</th>
                                    <th>FECHA</th>
                                    <th>CLIENTE</th>
                                    <th>MUNICIPIO</th>
                                    <th class="text-right">IMPORTE</th>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion text-center">ST</th>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion"></th>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion"></th>
                                </tr>
                            </thead>
                            <tbody id="tblDataPedidos"></tbody>
                        </table>
                    </div>
                    <div class="sygma-embarque-rpt__total-block" id="lbPendTotalBlock"></div>
                </div>
            </div>
            `
        },
        vista_pedidos_pendientes_anulados:()=>{
            return `
            <div class="sygma-embarque-rpt card card-rounded shadow-sm col-12 border-0" id="rpt_facturas_anuladas">
                <div class="card-body sygma-embarque-rpt__body p-3">
                    <header class="sygma-embarque-rpt__header">
                        <div class="sygma-embarque-rpt__brand">
                            <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="44" height="44" alt="Logo">
                            <div class="sygma-embarque-rpt__brand-text">
                                <h4 class="sygma-embarque-rpt__title mb-0">Facturas Anuladas</h4>
                                <div class="sygma-embarque-rpt__embarque-info">
                                    <span class="sygma-embarque-rpt__embarque-code" id="lbAnulCodembarque"></span>
                                    <span class="sygma-embarque-rpt__embarque-date" id="lbAnulFechaEmbarque"></span>
                                </div>
                            </div>
                        </div>
                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                            <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbAnulTotalPedidos"></span>
                            <button type="button" class="btn btn-info btn-md btn-circle hand shadow sygma-embarque-rpt__print-btn" title="Imprimir" onclick="F.imprimirSelec('rpt_facturas_anuladas')">
                                <i class="fal fa-print"></i>
                            </button>
                        </div>
                    </header>

                    <div class="sygma-embarque-rpt__toolbar oculto-impresion">
                        <input type="text" class="form-control sygma-embarque-rpt__search" id="txtFPBuscarAnuladas"
                            placeholder="Escriba para buscar..."
                            oninput="F.FiltrarTabla('tblPedidosAnulados','txtFPBuscarAnuladas')">
                    </div>

                    <div class="table-responsive sygma-embarque-rpt__table-wrap">
                        <table class="table sygma-embarque-rpt__table mb-0" id="tblPedidosAnulados">
                            <thead>
                                <tr>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion"></th>
                                    <th>VENDEDOR</th>
                                    <th>FECHA</th>
                                    <th>CLIENTE</th>
                                    <th>MUNICIPIO</th>
                                    <th class="text-right">IMPORTE</th>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion text-center">ST</th>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion"></th>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion"></th>
                                </tr>
                            </thead>
                            <tbody id="tblDataPedidosAnulados"></tbody>
                        </table>
                    </div>
                    <div class="sygma-embarque-rpt__total-block" id="lbAnulTotalBlock"></div>
                </div>
            </div>
            `
        },
        modal_detalle_documento:()=>{
            return `
            <div id="modal_detalle_pedido" class="modal fade sygma-doc-detalle-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
                    <div class="modal-content sygma-doc-detalle-modal__content">
                        <div class="sygma-doc-detalle-modal__header">
                            <div class="sygma-doc-detalle-modal__header-top">
                                <div>
                                    <h4 class="sygma-doc-detalle-modal__title">Detalle del documento</h4>
                                    <p class="sygma-doc-detalle-modal__doc-ref mb-0" id="lbDetalleDocRef"></p>
                                </div>
                                <button type="button" class="sygma-doc-detalle-modal__close" data-dismiss="modal" aria-label="Cerrar">
                                    <i class="fal fa-times"></i>
                                </button>
                            </div>
                            <div class="sygma-doc-detalle-modal__meta">
                                <div class="sygma-doc-detalle-modal__meta-row">
                                    <span class="sygma-doc-detalle-modal__label-inline">Embarque:</span>
                                    <span class="sygma-doc-detalle-modal__embarque" id="lbDetalleCodembarque">—</span>
                                </div>
                                <div class="sygma-doc-detalle-modal__meta-row">
                                    <span class="sygma-doc-detalle-modal__label-inline">Cliente:</span>
                                    <span class="sygma-doc-detalle-modal__value" id="lbDetalleNomclie">—</span>
                                </div>
                                <div class="sygma-doc-detalle-modal__meta-row">
                                    <span class="sygma-doc-detalle-modal__label-inline">Dirección:</span>
                                    <span class="sygma-doc-detalle-modal__value" id="lbDetalleDirclie">—</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-body sygma-doc-detalle-modal__body">
                            <div class="sygma-doc-detalle-modal__table-wrap">
                                <table class="table sygma-doc-detalle-modal__table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Producto</th>
                                            <th>Tipo P.</th>
                                            <th>Medida</th>
                                            <th class="text-right">Cant.</th>
                                            <th class="text-right">Precio</th>
                                            <th class="text-right">Importe</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataDetallePedido"></tbody>
                                </table>
                            </div>
                            <div class="sygma-doc-detalle-modal__total-block">
                                <div class="sygma-doc-detalle-modal__total-inner">
                                    <span class="sygma-doc-detalle-modal__total-label">Total líneas</span>
                                    <span class="sygma-doc-detalle-modal__total-qty" id="lbFtotalCantidad">0</span>
                                    <span class="sygma-doc-detalle-modal__total-label">Importe total</span>
                                    <span class="sygma-doc-detalle-modal__total-amount" id="lbFtotalImporte">Q 0.00</span>
                                </div>
                            </div>
                            <div class="sygma-doc-detalle-modal__obs">
                                <label class="sygma-doc-detalle-modal__label" for="txtDetallePedidoObs">Observaciones</label>
                                <textarea class="form-control sygma-doc-detalle-modal__obs-input" id="txtDetallePedidoObs" rows="3" readonly></textarea>
                            </div>
                        </div>
                        <div class="modal-footer sygma-doc-detalle-modal__footer">
                            <button type="button" class="btn btn-secondary sygma-doc-detalle-modal__btn-close" data-dismiss="modal">
                                <i class="fal fa-times mr-1"></i> Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `
        },
        vista_pedidos_modal_embarques:()=>{
            return `
                <div id="modal_embarques_pendientes" class="modal fade sygma-doc-detalle-modal sygma-embarque-select-modal" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                        <div class="modal-content sygma-doc-detalle-modal__content">
                            <div class="sygma-doc-detalle-modal__header sygma-embarque-select-modal__header">
                                <div class="sygma-doc-detalle-modal__header-top mb-0">
                                    <div>
                                        <h4 class="sygma-doc-detalle-modal__title">Asignar embarque</h4>
                                        <p class="sygma-doc-detalle-modal__doc-ref mb-0" id="lbModalEmbDocRef"></p>
                                    </div>
                                    <button type="button" class="sygma-doc-detalle-modal__close" data-dismiss="modal" aria-label="Cerrar">
                                        <i class="fal fa-times"></i>
                                    </button>
                                </div>
                                <div class="sygma-embarque-select-modal__hint">
                                    Seleccione el embarque activo para vincular este pedido.
                                </div>
                            </div>
                            <div class="modal-body sygma-embarque-select-modal__body">
                                <div class="sygma-embarque-rpt__toolbar">
                                    <input type="text" class="form-control sygma-embarque-rpt__search" id="txtBuscarModalEmbarques"
                                        placeholder="Buscar por embarque, repartidor o descripción..."
                                        oninput="F.FiltrarTabla('tblMEmbarques','txtBuscarModalEmbarques')">
                                </div>
                                <div class="table-responsive sygma-embarque-rpt__table-wrap sygma-embarque-select-modal__table-wrap">
                                    <table class="table sygma-embarque-rpt__table mb-0" id="tblMEmbarques">
                                        <thead>
                                            <tr>
                                                <th>FECHA</th>
                                                <th>EMBARQUE</th>
                                                <th>REPARTIDOR</th>
                                                <th class="sygma-embarque-rpt__col-action text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataMEmbarques"></tbody>
                                    </table>
                                </div>
                                <div class="sygma-embarque-rpt__total-block sygma-embarque-select-modal__total-block">
                                    <div class="sygma-embarque-rpt__total-inner">
                                        <span class="sygma-embarque-rpt__foot-label">EMBARQUES ACTIVOS</span>
                                        <span class="sygma-embarque-rpt__foot-total" id="lbModalEmbTotal">0</span>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer sygma-doc-detalle-modal__footer">
                                <button type="button" class="btn btn-secondary sygma-doc-detalle-modal__btn-close" data-dismiss="modal">
                                    <i class="fal fa-times mr-1"></i> Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        vista_relleno:()=>{
            return `
            <div class="sygma-embarque-rpt card card-rounded shadow-sm col-12 border-0" id="rpt_relleno_inventario">
                <div class="card-body sygma-embarque-rpt__body p-2">
                    <header class="sygma-embarque-rpt__header">
                        <div class="sygma-embarque-rpt__brand">
                            <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="40" height="40" alt="Logo">
                            <div class="sygma-embarque-rpt__brand-text">
                                <h4 class="sygma-embarque-rpt__title mb-0">Relleno de Inventario</h4>
                                <span class="sygma-embarque-rpt__embarque-date">Productos bajo mínimo que requieren surtido</span>
                            </div>
                        </div>
                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                            <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbRellenoTotalItems"></span>
                            <button type="button" class="btn btn-info btn-md btn-circle hand shadow sygma-embarque-rpt__print-btn" title="Imprimir" onclick="F.imprimirSelec('rpt_relleno_inventario')">
                                <i class="fal fa-print"></i>
                            </button>
                        </div>
                    </header>

                    <div class="sygma-embarque-rpt__toolbar oculto-impresion">
                        <input type="text" class="form-control sygma-embarque-rpt__search" id="txtBuscarRelleno"
                            placeholder="Buscar por producto, código o marca..."
                            oninput="F.FiltrarTabla('tblRellenoInventario','txtBuscarRelleno')">
                    </div>

                    <div class="table-responsive sygma-embarque-rpt__table-wrap">
                        <table class="table sygma-embarque-rpt__table mb-0" id="tblRellenoInventario">
                            <thead>
                                <tr>
                                    <th>PRODUCTO</th>
                                    <th>MARCA</th>
                                    <th class="text-right">EXIST.</th>
                                    <th class="text-right">MÍN.</th>
                                    <th class="text-right">MÁX.</th>
                                    <th class="text-right">RELLENO</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataRelleno"></tbody>
                        </table>
                    </div>
                    <div class="sygma-embarque-rpt__total-block" id="lbRellenoTotalBlock"></div>
                </div>
            </div>
            `
        },
        vista_embarques:()=>{
            return `
            <div class="sygma-embarque-rpt card card-rounded shadow-sm col-12 border-0" id="rpt_embarques_picking">
                <div class="card-body sygma-embarque-rpt__body p-2">
                    <header class="sygma-embarque-rpt__header">
                        <div class="sygma-embarque-rpt__brand">
                            <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="40" height="40" alt="Logo">
                            <div class="sygma-embarque-rpt__brand-text">
                                <h4 class="sygma-embarque-rpt__title mb-0">Embarques</h4>
                                <span class="sygma-embarque-rpt__embarque-date">Gestión de picking</span>
                            </div>
                        </div>
                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                            <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbEmbGridTotal"></span>
                            <span class="d-none" id="lbTotalEmb"></span>
                        </div>
                    </header>

                    <div class="sygma-embarque-rpt__toolbar sygma-embarques-filtros oculto-impresion">
                        <div class="sygma-embarques-filtros__row">
                            <input type="text" class="form-control sygma-embarque-rpt__search sygma-embarques-filtros__search" id="txtBuscarEmbarques"
                                placeholder="Buscar embarque, repartidor o descripción..."
                                oninput="F.FiltrarTabla('tblEmbarques','txtBuscarEmbarques')">
                            <div class="sygma-embarques-filtros__field">
                                <label class="sygma-embarques-filtros__label" for="cmbMes">Mes</label>
                                <select class="form-control sygma-embarques-filtros__select" id="cmbMes"></select>
                            </div>
                            <div class="sygma-embarques-filtros__field">
                                <label class="sygma-embarques-filtros__label" for="cmbAnio">Año</label>
                                <select class="form-control sygma-embarques-filtros__select" id="cmbAnio"></select>
                            </div>
                            <div class="sygma-embarques-filtros__field">
                                <label class="sygma-embarques-filtros__label" for="cmbStatus">Estado</label>
                                <select class="form-control sygma-embarques-filtros__select" id="cmbStatus">
                                    <option value="NO">Pendientes</option>
                                    <option value="SI">Finalizados</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive sygma-embarque-rpt__table-wrap">
                        <table class="table sygma-embarque-rpt__table mb-0" id="tblEmbarques">
                            <thead>
                                <tr>
                                    <th>FECHA</th>
                                    <th>EMBARQUE</th>
                                    <th>REPARTIDOR</th>
                                    <th class="text-right">IMPORTE</th>
                                    <th class="text-right">DEVOL.</th>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion text-center" title="Finalizar / Activar"></th>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion text-center" title="Editar"></th>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion text-center" title="Imprimir"></th>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion text-center" title="Eliminar"></th>
                                </tr>
                            </thead>
                            <tbody id="tblDatalEmbarques"></tbody>
                        </table>
                    </div>
                    <div class="sygma-embarque-rpt__total-block" id="lbEmbGridTotalBlock"></div>
                </div>
            </div>

            <button type="button" class="btn btn-success btn-lg btn-circle hand shadow sygma-embarques-fab oculto-impresion" id="btnEmbarquesNuevo" title="Nuevo embarque">
                <i class="fal fa-plus"></i>
            </button>

            <div id="sygma_embarque_print_host" class="sygma-embarque-print-host" aria-hidden="true"></div>
            `
        },
        vista_embarques_modal_imprimir:()=>{
            return `
            <div id="modal_embarque_imprimir" class="modal fade sygma-doc-detalle-modal sygma-embarque-print-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-sm">
                    <div class="modal-content sygma-doc-detalle-modal__content">
                        <div class="sygma-doc-detalle-modal__header sygma-embarque-print-modal__header">
                            <div class="sygma-doc-detalle-modal__header-top mb-0">
                                <div>
                                    <h4 class="sygma-doc-detalle-modal__title sygma-embarque-print-modal__title">Imprimir</h4>
                                    <p class="sygma-doc-detalle-modal__doc-ref mb-0"><span id="lbEmbPrintCodembarque"></span></p>
                                </div>
                                <button type="button" class="sygma-doc-detalle-modal__close" data-dismiss="modal" aria-label="Cerrar">
                                    <i class="fal fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div class="modal-body sygma-embarque-print-modal__body p-0">
                            <div id="embPrintLoader" class="sygma-embarque-print-modal__loader d-none">
                                <div class="sygma-embarque-print-modal__loader-spinner"></div>
                                <p class="sygma-embarque-print-modal__loader-text mb-0">Generando imprimible...</p>
                            </div>
                            <div id="embPrintActions" class="sygma-embarque-print-modal__actions">
                                <button type="button" class="btn btn-outline-primary btn-sm btn-block sygma-embarque-print-modal__btn hand" id="btnEmbPrintProductos">
                                    <span class="sygma-embarque-print-modal__btn-icon"><i class="fal fa-boxes"></i></span>
                                    <span class="sygma-embarque-print-modal__btn-text">Imprimir embarque</span>
                                </button>
                                <button type="button" class="btn btn-outline-primary btn-sm btn-block sygma-embarque-print-modal__btn hand" id="btnEmbPrintFacturas">
                                    <span class="sygma-embarque-print-modal__btn-icon"><i class="fal fa-list"></i></span>
                                    <span class="sygma-embarque-print-modal__btn-text">Lista facturas</span>
                                </button>
                                <button type="button" class="btn btn-outline-primary btn-sm btn-block sygma-embarque-print-modal__btn hand mb-0" id="btnEmbPrintDocumentos">
                                    <span class="sygma-embarque-print-modal__btn-icon"><i class="fal fa-print"></i></span>
                                    <span class="sygma-embarque-print-modal__btn-text">Documentos (tickets)</span>
                                </button>
                            </div>
                        </div>
                        <div class="modal-footer sygma-doc-detalle-modal__footer sygma-embarque-print-modal__footer" id="embPrintFooter">
                            <button type="button" class="btn btn-secondary btn-sm sygma-doc-detalle-modal__btn-close" data-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
            `
        },
        vista_embarques_modal_datos:()=>{
            return `
                <div id="modal_embarques_nuevo" class="modal fade sygma-doc-detalle-modal sygma-embarque-form-modal" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-md">
                        <div class="modal-content sygma-doc-detalle-modal__content">
                            <div class="sygma-doc-detalle-modal__header sygma-embarque-form-modal__header">
                                <div class="sygma-doc-detalle-modal__header-top mb-0">
                                    <div>
                                        <h4 class="sygma-doc-detalle-modal__title" id="lbEmbFormTitle">Nuevo embarque</h4>
                                        <p class="sygma-doc-detalle-modal__doc-ref mb-0" id="lbEmbFormRef">Complete los datos del embarque</p>
                                    </div>
                                    <button type="button" class="sygma-doc-detalle-modal__close" data-dismiss="modal" aria-label="Cerrar">
                                        <i class="fal fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="modal-body sygma-embarque-form-modal__body">
                                <div class="sygma-embarque-form-modal__grid">
                                    <div class="sygma-embarque-form-modal__field">
                                        <label class="sygma-embarque-form-modal__label" for="txtEmbarqueFecha">Fecha</label>
                                        <input type="date" class="form-control form-control-sm sygma-embarque-form-modal__input" id="txtEmbarqueFecha">
                                    </div>
                                    <div class="sygma-embarque-form-modal__field">
                                        <label class="sygma-embarque-form-modal__label" for="txtEmbarqueCodigo">Código embarque</label>
                                        <input type="text" class="form-control form-control-sm sygma-embarque-form-modal__input" id="txtEmbarqueCodigo">
                                    </div>
                                    <div class="sygma-embarque-form-modal__field sygma-embarque-form-modal__field--full">
                                        <label class="sygma-embarque-form-modal__label" for="txtEmbarqueDescripcion">Descripción</label>
                                        <input type="text" class="form-control form-control-sm sygma-embarque-form-modal__input" id="txtEmbarqueDescripcion">
                                    </div>
                                    <div class="sygma-embarque-form-modal__field">
                                        <label class="sygma-embarque-form-modal__label" for="txtEmbarqueRuteo">Ruteo</label>
                                        <input type="text" class="form-control form-control-sm sygma-embarque-form-modal__input" id="txtEmbarqueRuteo">
                                    </div>
                                    <div class="sygma-embarque-form-modal__field">
                                        <label class="sygma-embarque-form-modal__label" for="cmbEmbarqueEmpleado">Repartidor</label>
                                        <select class="form-control form-control-sm sygma-embarque-form-modal__input" id="cmbEmbarqueEmpleado"></select>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer sygma-doc-detalle-modal__footer sygma-embarque-form-modal__footer">
                                <button type="button" class="btn btn-secondary btn-sm sygma-doc-detalle-modal__btn-close" data-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary btn-sm sygma-embarque-form-modal__btn-save hand" id="btnEmbarqueGuardar">
                                    <i class="fal fa-save mr-1"></i> Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        vista_embarques_modal_finalizar:()=>{
            return `
                <div id="modal_embarque_finalizar" class="modal fade sygma-doc-detalle-modal sygma-embarque-finalizar-modal" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-md">
                        <div class="modal-content sygma-doc-detalle-modal__content">
                            <div class="sygma-doc-detalle-modal__header sygma-embarque-finalizar-modal__header">
                                <div class="sygma-doc-detalle-modal__header-top mb-0">
                                    <div>
                                        <h4 class="sygma-doc-detalle-modal__title">Finalizar embarque</h4>
                                        <p class="sygma-doc-detalle-modal__doc-ref mb-0" id="lbEmbFinalizarCodembarque"></p>
                                    </div>
                                    <button type="button" class="sygma-doc-detalle-modal__close" data-dismiss="modal" aria-label="Cerrar">
                                        <i class="fal fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="modal-body sygma-embarque-finalizar-modal__body p-0">
                                <div id="embFinalizarLoader" class="sygma-embarque-finalizar-modal__loader d-none">
                                    <div class="sygma-embarque-print-modal__loader-spinner"></div>
                                    <p class="sygma-embarque-finalizar-modal__loader-text mb-0">Calculando totales...</p>
                                </div>
                                <div id="embFinalizarForm" class="sygma-embarque-finalizar-modal__form">
                                    <div class="sygma-embarque-finalizar-modal__row sygma-embarque-finalizar-modal__row--fecha">
                                        <label class="sygma-embarque-finalizar-modal__label" for="txtEmbFinalizarFecha">Fecha finalización</label>
                                        <input type="date" class="form-control form-control-sm sygma-embarque-finalizar-modal__fecha" id="txtEmbFinalizarFecha">
                                    </div>
                                    <div class="sygma-embarque-finalizar-modal__row">
                                        <span class="sygma-embarque-finalizar-modal__label">Total facturas</span>
                                        <span class="sygma-embarque-finalizar-modal__value" id="lbEmbFinalizarFacturas">Q 0.00</span>
                                    </div>
                                    <div class="sygma-embarque-finalizar-modal__row">
                                        <span class="sygma-embarque-finalizar-modal__label">Total devoluciones</span>
                                        <span class="sygma-embarque-finalizar-modal__value sygma-embarque-finalizar-modal__value--dev" id="lbEmbFinalizarDevoluciones">Q 0.00</span>
                                    </div>
                                    <div class="sygma-embarque-finalizar-modal__row sygma-embarque-finalizar-modal__row--liquidar">
                                        <span class="sygma-embarque-finalizar-modal__label">Total a liquidar</span>
                                        <span class="sygma-embarque-finalizar-modal__value sygma-embarque-finalizar-modal__value--liquidar" id="lbEmbFinalizarLiquidar">Q 0.00</span>
                                    </div>
                                    <div class="sygma-embarque-finalizar-modal__row sygma-embarque-finalizar-modal__row--input">
                                        <label class="sygma-embarque-finalizar-modal__label" for="txtEmbFinalizarReportado">Total reportado</label>
                                        <div class="input-group sygma-embarque-finalizar-modal__input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text sygma-embarque-finalizar-modal__input-prefix">Q</span>
                                            </div>
                                            <input type="number" step="0.01" min="0" class="form-control sygma-embarque-finalizar-modal__input" id="txtEmbFinalizarReportado" placeholder="0.00">
                                        </div>
                                    </div>
                                    <p class="sygma-embarque-finalizar-modal__hint mb-0">Ingrese el monto reportado por el repartidor.</p>
                                </div>
                            </div>
                            <div class="modal-footer sygma-doc-detalle-modal__footer sygma-embarque-finalizar-modal__footer" id="embFinalizarFooter">
                                <button type="button" class="btn btn-secondary btn-sm sygma-doc-detalle-modal__btn-close" data-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-success btn-sm sygma-embarque-finalizar-modal__btn-save hand" id="btnEmbFinalizarGuardar">
                                    <i class="fal fa-check mr-1"></i> Finalizar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        vista_revision_inventario_embarque:()=>{
            return `
                <div class="card card-rounded shadow col-12">
                    <div class="card-body p-4 table-responsive">
                        
                            
                            <div class="row">
                                <div class="col-6">
                                    <h4>AJUSTE DE EXISTENCIAS EN EMBARQUE</h4>
                                </div>
                                <div class="col-6">
                                    <label class="negrita text-danger" id=""></label>
                                </div>
                            </div>
                            

                             <div class="row">
                                <div class="col-8">
                                    
                                    <table class="table h-full table-bordered col-12" id="tblPedidosExistencia">
                                        <thead class="bg-base text-white negrita">
                                            <tr>
                                                <td>PRODUCTO</td>
                                                <td>CODMEDIDA</td>
                                                <td>CANTIDAD</td>
                                                <td>TOTAL UNIDADES</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataPedidosExistencia"></tbody>

                                    </table>

                                </div>
                                <div class="col-4">
                                    <label class="negrita text-danger" id="">Facturas Producto</label>
                                
                                    <table class="table h-full table-bordered col-12" id="">
                                        <thead class="bg-secondary text-white negrita">
                                            <tr>
                                                <td>DOCUMENTO</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataFacturasProducto"></tbody>

                                    </table>
                                
                                </div>
                            </div>

                           
                        

                        </div>
                    </div>

            `
        },
        vista_facturacion:()=>{
            return `
             <div class="card card-rounded shadow col-12 oculto-impresion">
                <div class="card-body p-4">
                        
                    <div class="form-group">
                        <label class="negrita text-base">Pedidos asignados al Embarque</label>
                        <div class="input-group">
                            <select class="form-control negrita text-secondary" id="cmbFEmbarques">
                        
                            </select>
                            <input type="date" class="form-control negrita text-secondary" id="txtFFecha">
                            
                            <select class="form-control border-danger negrita text-danger" id="cmbFTipo">
                                <option value='PENDIENTES'>FACTURAS PENDIENTES</option>
                                <option value='FACTURAS'>FACTURAS EMBARQUE</option>
                                <option value='PRODUCTOS'>PRODUCTOS EMBARQUE</option>
                                <option value='BONIFICACIONES'>PRODUCTOS BONIFICADOS EMBARQUE</option>
                                <option value='VENDEDORES'>RESUMEN VENDEDOR</option>
                                <option value='ANULADAS'>FACTURAS ANULADAS</option>
                                <option value='TIPOPRECIO'>PRODUCTOS CON PRECIOS ESPECIALES</option>
                            </select>

                        </div>
                    </div>

                </div>
             </div>
             <div class="col-12 p-0">
                    <div class="tab-content" id="myTabHomeContent2">
                        <div class="tab-pane fade show active" id="Funo" role="tabpanel" aria-labelledby="receta-tab">
                          ${view.vista_pedidos_pendientes() + view.vista_pedidos_modal_embarques() }    
                            
                        </div>
                        <div class="tab-pane fade" id="Fdos" role="tabpanel" aria-labelledby="home-tab">
                            ${view.facturacion_embarque_facturas()}
                     
                        </div>
                        <div class="tab-pane fade" id="Ftres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.facturacion_embarque_productos()}
                        </div>
                        <div class="tab-pane fade" id="Fcuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.facturacion_vendedores()}
                        </div>
                        <div class="tab-pane fade" id="Fcinco" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_pedidos_pendientes_anulados()}
                        </div>
                        <div class="tab-pane fade" id="Fseis" role="tabpanel" aria-labelledby="home-tab">
                            ${view.facturacion_embarque_productos_bonif()}
                        </div>   
                        <div class="tab-pane fade" id="Fsiete" role="tabpanel" aria-labelledby="home-tab">
                            ${view.facturacion_tipo_precios()}
                        </div>    
                    </div>

                    <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active negrita text-success" id="tab-Funo" data-toggle="tab" href="#Funo" role="tab" aria-controls="profile" aria-selected="false">
                                <i class="fal fa-list"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-Fdos" data-toggle="tab" href="#Fdos" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>  
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-Ftres" data-toggle="tab" href="#Ftres" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>  
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-Fcuatro" data-toggle="tab" href="#Fcuatro" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-Fcinco" data-toggle="tab" href="#Fcinco" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>  
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-Fseis" data-toggle="tab" href="#Fseis" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-Fsiete" data-toggle="tab" href="#Fsiete" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>           
                    </ul>

                </div>

            
            `
        },
        facturacion_crear_facturas:()=>{
            return `
            <br>
            
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">


                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Facturar Pedidos Pendientes</h4>
                            
                            <div class="form-group">
                                <label class="negrita text-secondary">Serie y Fecha de la Factura</label>
                                <div class="input-group">
                                    <select class="negrita text-info form-control" id="cmbFacCoddoc">
                                    </select>
                                    <input class="form-control negrita text-info" type="date" id="txtFacFecha">
                                </div>    
                            </div>
                            <br>
                        </div>
                        <div class="col-6">
                            <label class="negrita text-info" id="lbFTotalPedidos">Pedidos:</label>
                            <br>
                            <label class="negrita text-danger" id="lbFTotalImporte">Importe:</label>
                        </div>
                    </div>
                    

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblFPedidos">
                                <thead class="bg-base text-white negrita">
                                    <tr>
                                        <td>EMBARQUE</td>
                                        <td>VENDEDOR</td>
                                        <td>FECHA</td>
                                        <td>CLIENTE</td>
                                        <td>MUNICIPIO</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataFPedidos"></tbody>

                            </table>

                    </div>
                    
                </div>
            </div>



           

            `
        },
        facturacion_embarque_facturas:()=>{
            return `
            <div class="sygma-embarque-rpt card card-rounded shadow-sm col-12 border-0" id="rpt_facturas_embarque">
                <div class="card-body sygma-embarque-rpt__body p-3">
                    <header class="sygma-embarque-rpt__header">
                        <div class="sygma-embarque-rpt__brand">
                            <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="44" height="44" alt="Logo">
                            <div class="sygma-embarque-rpt__brand-text">
                                <h4 class="sygma-embarque-rpt__title mb-0">Facturas del Embarque</h4>
                                <div class="sygma-embarque-rpt__embarque-info">
                                    <span class="sygma-embarque-rpt__embarque-code" id="lbFacCodembarque"></span>
                                    <span class="sygma-embarque-rpt__embarque-date" id="lbFacFechaEmbarque"></span>
                                </div>
                            </div>
                        </div>
                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                            <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbFacTotalPedidos"></span>
                            <button type="button" class="btn btn-info btn-md btn-circle hand shadow sygma-embarque-rpt__print-btn" title="Imprimir" onclick="F.imprimirSelec('rpt_facturas_embarque')">
                                <i class="fal fa-print"></i>
                            </button>
                        </div>
                    </header>

                    <div class="sygma-embarque-rpt__toolbar oculto-impresion">
                        <input type="text" class="form-control sygma-embarque-rpt__search"
                            id="txt_buscar_facturas_embarque"
                            oninput="F.FiltrarTabla('tblFFacturas','txt_buscar_facturas_embarque')"
                            placeholder="Escriba para buscar...">
                    </div>

                    <div class="table-responsive sygma-embarque-rpt__table-wrap">
                        <table class="table sygma-embarque-rpt__table mb-0" id="tblFFacturas">
                            <thead>
                                <tr>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion"></th>
                                    <th>VENDEDOR</th>
                                    <th>FECHA</th>
                                    <th>CLIENTE</th>
                                    <th>MUNICIPIO</th>
                                    <th class="text-right">IMPORTE</th>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion"></th>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion"></th>
                                </tr>
                            </thead>
                            <tbody id="tblDataFFacturas"></tbody>
                        </table>
                    </div>
                    <div class="sygma-embarque-rpt__total-block" id="lbFacTotalBlock"></div>
                </div>
            </div>
            `
        },
        facturacion_embarque_productos:()=>{
            return `
            <div class="sygma-embarque-rpt card card-rounded shadow-sm col-12 border-0" id="rpt_productos_embarque">
                <div class="card-body sygma-embarque-rpt__body p-3">
                    <header class="sygma-embarque-rpt__header">
                        <div class="sygma-embarque-rpt__brand">
                            <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="44" height="44" alt="Logo">
                            <div class="sygma-embarque-rpt__brand-text">
                                <h4 class="sygma-embarque-rpt__title mb-0">Productos del Embarque</h4>
                                <div class="sygma-embarque-rpt__embarque-info">
                                    <span class="sygma-embarque-rpt__embarque-code" id="lbProdCodembarque"></span>
                                    <span class="sygma-embarque-rpt__embarque-date" id="lbProdFechaEmbarque"></span>
                                </div>
                            </div>
                        </div>
                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                            <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbProdTotalPedidos"></span>
                            <button type="button" class="btn btn-info btn-md btn-circle hand shadow sygma-embarque-rpt__print-btn" title="Imprimir" onclick="F.imprimirSelec('rpt_productos_embarque')">
                                <i class="fal fa-print"></i>
                            </button>
                        </div>
                    </header>

                    <div class="table-responsive sygma-embarque-rpt__table-wrap">
                        <table class="table sygma-embarque-rpt__table mb-0" id="tblFProductos">
                            <thead>
                                <tr>
                                    <th>CODIGO</th>
                                    <th>PRODUCTO</th>
                                    <th class="text-center">UXC</th>
                                    <th class="text-center">CAJAS</th>
                                    <th class="text-center">UNIDADES</th>
                                    <th class="text-right">IMPORTE</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataFProductos"></tbody>
                        </table>
                    </div>
                    <div class="sygma-embarque-rpt__total-block" id="lbProdTotalBlock"></div>
                </div>
            </div>
            `
        },
        facturacion_embarque_productos_bonif:()=>{
            return `
            <div class="sygma-embarque-rpt card card-rounded shadow-sm col-12 border-0" id="rpt_productos_embarqueB">
                <div class="card-body sygma-embarque-rpt__body p-3">
                    <header class="sygma-embarque-rpt__header">
                        <div class="sygma-embarque-rpt__brand">
                            <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="44" height="44" alt="Logo">
                            <div class="sygma-embarque-rpt__brand-text">
                                <h4 class="sygma-embarque-rpt__title mb-0">Productos Bonificados del Embarque</h4>
                                <div class="sygma-embarque-rpt__embarque-info">
                                    <span class="sygma-embarque-rpt__embarque-code" id="lbProdCodembarqueB"></span>
                                    <span class="sygma-embarque-rpt__embarque-date" id="lbProdFechaEmbarqueB"></span>
                                </div>
                            </div>
                        </div>
                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                            <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbProdTotalPedidosB"></span>
                            <button type="button" class="btn btn-info btn-md btn-circle hand shadow sygma-embarque-rpt__print-btn" title="Imprimir" onclick="F.imprimirSelec('rpt_productos_embarqueB')">
                                <i class="fal fa-print"></i>
                            </button>
                        </div>
                    </header>

                    <div class="table-responsive sygma-embarque-rpt__table-wrap">
                        <table class="table sygma-embarque-rpt__table mb-0" id="tblFProductosB">
                            <thead>
                                <tr>
                                    <th>CODIGO</th>
                                    <th>PRODUCTO</th>
                                    <th class="text-center">UXC</th>
                                    <th class="text-center">CAJAS</th>
                                    <th class="text-center">UNIDADES</th>
                                    <th class="text-right">IMPORTE</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataFProductosB"></tbody>
                        </table>
                    </div>
                    <div class="sygma-embarque-rpt__total-block" id="lbProdTotalBlockB"></div>
                </div>
            </div>
            `
        },
        facturacion_tipo_precios:()=>{
            return `
            <div class="sygma-embarque-rpt card card-rounded shadow-sm col-12 border-0" id="rpt_tipo_precio">
                <div class="card-body sygma-embarque-rpt__body p-3">
                    <header class="sygma-embarque-rpt__header">
                        <div class="sygma-embarque-rpt__brand">
                            <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="44" height="44" alt="Logo">
                            <div class="sygma-embarque-rpt__brand-text">
                                <h4 class="sygma-embarque-rpt__title mb-0">Productos con Precios Especiales</h4>
                                <div class="sygma-embarque-rpt__embarque-info">
                                    <span class="sygma-embarque-rpt__embarque-code" id="lbTpCodembarque"></span>
                                    <span class="sygma-embarque-rpt__embarque-date" id="lbTpFechaEmbarque"></span>
                                </div>
                            </div>
                        </div>
                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                            <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbTpTotalItems"></span>
                            <button type="button" class="btn btn-info btn-md btn-circle hand shadow sygma-embarque-rpt__print-btn" title="Imprimir" onclick="F.imprimirSelec('rpt_tipo_precio')">
                                <i class="fal fa-print"></i>
                            </button>
                        </div>
                    </header>

                    <div class="sygma-embarque-rpt__toolbar oculto-impresion">
                        <input type="text" class="form-control sygma-embarque-rpt__search" id="txtFBuscarTipoPrecio"
                            placeholder="Escriba para buscar..."
                            oninput="F.FiltrarTabla('tblFTipoPrecio','txtFBuscarTipoPrecio')">
                    </div>

                    <div class="table-responsive sygma-embarque-rpt__table-wrap">
                        <table class="table sygma-embarque-rpt__table mb-0" id="tblFTipoPrecio">
                            <thead>
                                <tr>
                                    <th>VENDEDOR</th>
                                    <th>DOCUMENTO</th>
                                    <th>CLIENTE</th>
                                    <th>PRODUCTO</th>
                                    <th class="text-center">CANTIDAD</th>
                                    <th class="text-right">PRECIO</th>
                                    <th class="text-center">TIPOPRE</th>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion"></th>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion"></th>
                                </tr>
                            </thead>
                            <tbody id="data_tblFTipoPrecio"></tbody>
                        </table>
                    </div>
                    <div class="sygma-embarque-rpt__total-block" id="lbTpTotalBlock"></div>
                </div>
            </div>
            `
        },
        facturacion_vendedores:()=>{
            return `
            <div class="sygma-embarque-rpt card card-rounded shadow-sm col-12 border-0" id="rpt_resumen_vendedor">
                <div class="card-body sygma-embarque-rpt__body p-3">
                    <header class="sygma-embarque-rpt__header">
                        <div class="sygma-embarque-rpt__brand">
                            <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="44" height="44" alt="Logo">
                            <div class="sygma-embarque-rpt__brand-text">
                                <h4 class="sygma-embarque-rpt__title mb-0">Resumen por Vendedor</h4>
                                <div class="sygma-embarque-rpt__embarque-info">
                                    <span class="sygma-embarque-rpt__embarque-code" id="lbVenCodembarque"></span>
                                    <span class="sygma-embarque-rpt__embarque-date" id="lbVenFechaEmbarque"></span>
                                </div>
                            </div>
                        </div>
                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                            <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbVenTotalVendedores"></span>
                            <button type="button" class="btn btn-info btn-md btn-circle hand shadow sygma-embarque-rpt__print-btn" title="Imprimir" onclick="F.imprimirSelec('rpt_resumen_vendedor')">
                                <i class="fal fa-print"></i>
                            </button>
                        </div>
                    </header>

                    <div class="table-responsive sygma-embarque-rpt__table-wrap">
                        <table class="table sygma-embarque-rpt__table mb-0" id="tblVendedores">
                            <thead>
                                <tr>
                                    <th>VENDEDOR</th>
                                    <th class="text-center">PEDIDOS</th>
                                    <th class="text-right">IMPORTE</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataVendedores"></tbody>
                        </table>
                    </div>
                    <div class="sygma-embarque-rpt__total-block" id="lbVenTotalBlock"></div>
                </div>
            </div>
            `
        },
        vista_sellout:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                    <div class="row align-items-end">
                        <div class="col-12 col-md-2 col-lg-2 mb-3 mb-md-0">
                            <h5 class="negrita text-success mb-0">SELL OUT</h5>
                        </div>
                        <div class="col-sm-6 col-md-3 col-lg-3">
                            <div class="form-group mb-0">
                                <label class="negrita text-secondary">Fecha Inicial</label>
                                <input type="date" class="negrita form-control" id="txtSFechaInicial">
                            </div>
                        </div>
                        <div class="col-sm-6 col-md-3 col-lg-3">
                            <div class="form-group mb-0">
                                <label class="negrita text-secondary">Fecha Final</label>
                                <input type="date" class="negrita form-control" id="txtSFechaFinal">
                            </div>
                        </div>
                        <div class="col-12 col-md-4 col-lg-4 text-md-right mb-2 mb-md-0">
                            <button class="btn btn-success btn-md hand shadow" id="btnExportarSellOut">
                                <i class="fal fa-share"></i> Exportar Excel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <br>
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                        <div class="table-responsive sygma-sellout-table">
                            <table class="table h-full table-bordered col-12" id="tblSellout">
                                <thead class="bg-success text-white negrita">
                                    <tr>
                                        <td>RELOP</td>
                                        <td>TRANSACCION</td>
                                        <td>FECHA</td>
                                        <td>CODIGO CLIENTE</td>
                                        <td>CLIENTE</td>
                                        <td>TIPO CLIENTE</td>
                                        <td>CODIGO VENDEDOR</td>
                                        <td>VENDEDOR</td>
                                        <td>CATEGORIA</td>
                                        <td>MARCA</td>
                                        <td>CODIGO RUTA</td>
                                        <td>GEO1-PAIS</td>
                                        <td>GEO2-DEPARTAMENTO</td>
                                        <td>GEO3-MUNICIPIO</td>
                                        <td>CEO4-ALDEA-CASERIO</td>
                                        <td>PRODUCTO</td>
                                        <td>CODIGO DUN</td>
                                        <td>CODIGO EAN</td>
                                        <td>DESCRIPCION</td>
                                        <td>VENTA EN CANTIDAD</td>
                                        <td>FACTOR</td>
                                        <td>UNIDADES POR CAJA</td>
                                        <td>MEDIDA</td>
                                        <td>VENTA EN QUETZALES</td>
                                        <td>FACTURA SAT</td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataSellout"></tbody>
                            </table>
                        </div>
                        
                </div>
            </div>
           

            

            
            `
        },
    }

    root.innerHTML = view.body();

};

function addListeners(){

    document.getElementById('btnDigitadorMenuToggle')?.addEventListener('click', () => {
        digitador_toggleSidebar();
    });
    document.getElementById('digitadorSidebarBackdrop')?.addEventListener('click', () => {
        digitador_toggleSidebar(false);
    });

    document.title = `Digitador - ${GlobalNomEmpresa}`;

    const lbEmpresa = document.getElementById('lbDigitadorEmpresa');
    if (lbEmpresa) lbEmpresa.innerText = GlobalNomEmpresa || '';

    const cmbSucursalHeader = document.getElementById('cmbSucursalHeader');
    const cmbMesHeader = document.getElementById('cmbMesHeader');
    const cmbAnioHeader = document.getElementById('cmbAnioHeader');

    if (cmbMesHeader) {
        cmbMesHeader.innerHTML = F.ComboMeses();
        cmbMesHeader.value = F.get_mes_curso();
    }
    if (cmbAnioHeader) {
        cmbAnioHeader.innerHTML = F.ComboAnio();
        cmbAnioHeader.value = F.get_anio_curso();
    }

    digitador_setupSucursalHeader();

    digitador_initDashboard();
    digitador_setActiveCard('btnMenuDashboard');
    cmbMesHeader?.addEventListener('change', digitador_onHeaderFiltersChange);
    cmbAnioHeader?.addEventListener('change', digitador_onHeaderFiltersChange);
    document.getElementById('cmbProveedorModoVentas')?.addEventListener('change', digitador_onHeaderFiltersChange);

    document.getElementById('btnMenuDashboard')?.addEventListener('click', () => {
        digitador_showHome();
    });

    F.slideAnimationTabs();

    if (document.getElementById('tblDataRelleno')) {
        tbl_relleno_inventario('tblDataRelleno');
    }

    try { listeners_pedidos_pendientes(); } catch (e) {
        console.error('[inicio_digitador] listeners_pedidos_pendientes:', e);
    }

    try { listeners_embarques(); } catch (e) {
        console.error('[inicio_digitador] listeners_embarques:', e);
    }

    //SELLOUT
    const txtSFechaInicial = document.getElementById('txtSFechaInicial');
    const txtSFechaFinal = document.getElementById('txtSFechaFinal');
    const btnMenuSellout = document.getElementById('btnMenuSellout');
    const btnMenuRelleno = document.getElementById('btnMenuRelleno');
    const btnMenuEmbarques = document.getElementById('btnMenuEmbarques');
    const btnExportarSellOut = document.getElementById('btnExportarSellOut');

    if (txtSFechaInicial) txtSFechaInicial.value = F.getFecha();
    if (txtSFechaFinal) txtSFechaFinal.value = F.getFecha();

    txtSFechaInicial?.addEventListener('change', () => {
        tbl_rpt_sellout();
    });

    txtSFechaFinal?.addEventListener('change', () => {
        tbl_rpt_sellout();
    });

    btnMenuSellout?.addEventListener('click', () => {
        digitador_showPanel('siete', 'btnMenuSellout', () => {
            tbl_rpt_sellout();
        });
    });

    btnMenuRelleno?.addEventListener('click', () => {
        digitador_showPanel('tres', 'btnMenuRelleno');
    });

    btnMenuEmbarques?.addEventListener('click', () => {
        digitador_showPanel('cuatro', 'btnMenuEmbarques');
    });

    btnExportarSellOut?.addEventListener('click', () => {
        const btn = document.getElementById('btnExportarSellOut');
        const fi = F.devuelveFecha('txtSFechaInicial');
        const ff = F.devuelveFecha('txtSFechaFinal');
        const sucursal = digitador_getSucursal();

        F.showToast('Cargando datos...');
        btn.disabled = true;
        btn.innerHTML = `<i class="fal fa-share fa-spin"></i>`;

        RPT.data_sellout_export(sucursal, fi, ff)
            .then((data) => {
                F.export_json_to_xlsx(data.recordset, 'SellOut');
                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-share"></i> Exportar Excel`;
            })
            .catch(() => {
                F.AvisoError('No se pudo exportar');
                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-share"></i> Exportar Excel`;
            });
    });




};

function digitador_destroyDashboardChart(chartKey) {
    if (digitador_dashboardCharts[chartKey]) {
        digitador_dashboardCharts[chartKey].destroy();
        delete digitador_dashboardCharts[chartKey];
    }
}

function digitador_renderDashboardChart(chartKey, canvasId, labels, values, title) {
    digitador_destroyDashboardChart(chartKey);

    const canvas = document.getElementById(canvasId);
    if (!canvas || !labels.length || !values.length || typeof Chart === 'undefined') return;

    const total = values.reduce((sum, value) => sum + Number(value), 0);
    if (total <= 0) return;

    const bgColor = labels.map(() => getRandomColor());
    const chartWrap = canvas.closest('.proveedor-dashboard-chart');
    if (chartWrap) {
        chartWrap.style.height = `${Math.max(200, labels.length * 30)}px`;
    }

    try {
        digitador_dashboardCharts[chartKey] = new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: title,
                    data: values.map((v) => Number(v)),
                    backgroundColor: bgColor,
                    borderRadius: 5,
                    maxBarThickness: 24
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: title,
                        font: { size: 12 }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 68, 163, 0.08)' },
                        ticks: {
                            font: { size: 10 },
                            callback: (value) => F.setMoneda(value, 'Q')
                        }
                    },
                    y: {
                        grid: { display: false },
                        ticks: {
                            font: { size: 10 },
                            autoSkip: false
                        }
                    }
                }
            }
        });
    } catch (e) {
        console.error('[inicio_digitador] chart:', e);
    }
}

function digitador_resetDashboardFooters() {
    [
        'lbDigFootDashInvCajas',
        'lbDigFootDashInvCosto',
        'lbDigFootDashVendedorPedidos',
        'lbDigFootDashVendedorImporte',
        'lbDigFootDashMarcaImporte'
    ].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.innerText = '--';
    });
}

function digitador_loadDashboard() {
    digitador_resetDashboardFooters();
    digitador_tbl_dashboard_inventario_categoria();
    digitador_tbl_dashboard_ventas_vendedor();
    digitador_tbl_dashboard_ventas_marca();
}

function digitador_tbl_dashboard_inventario_categoria() {
    const container = document.getElementById('tblDataDigDashInventarioCategoria');
    if (!container) return;

    container.innerHTML = GlobalLoader;
    digitador_destroyDashboardChart('inventario');
    const sucursal = digitador_getSucursal();

    GF.get_data_inventarios_general(sucursal, 'SI')
        .then((data) => {
            const resumen = {};
            (data.recordset || []).forEach((r) => {
                const categoria = r.DESMARCA || 'SIN CATEGORIA';
                const cajas = F.get_existencia(Number(r.TOTALUNIDADES), Number(r.UXC));
                const costo = Number(r.TOTALUNIDADES) * Number(r.COSTO);
                if (!resumen[categoria]) resumen[categoria] = { cajas: 0, costo: 0 };
                resumen[categoria].cajas += Number(cajas);
                resumen[categoria].costo += costo;
            });

            const items = Object.keys(resumen)
                .map((categoria) => ({ categoria, ...resumen[categoria] }))
                .sort((a, b) => b.costo - a.costo);

            let totalCajas = 0;
            let totalCosto = 0;
            let str = '';

            items.forEach((item) => {
                totalCajas += item.cajas;
                totalCosto += item.costo;
                str += `
                    <tr>
                        <td>${item.categoria}</td>
                        <td>${item.cajas.toFixed(2)}</td>
                        <td>${F.setMoneda(item.costo, 'Q')}</td>
                    </tr>
                `;
            });

            container.innerHTML = str || '<tr><td colspan="3" class="text-center text-muted">Sin datos</td></tr>';
            const lbCajas = document.getElementById('lbDigFootDashInvCajas');
            const lbCosto = document.getElementById('lbDigFootDashInvCosto');
            if (lbCajas) lbCajas.innerText = totalCajas.toFixed(2);
            if (lbCosto) lbCosto.innerText = F.setMoneda(totalCosto, 'Q');

            digitador_renderDashboardChart(
                'inventario',
                'chartDigDashInventario',
                items.map((item) => item.categoria),
                items.map((item) => item.costo),
                `Costo por categoria: ${F.setMoneda(totalCosto, 'Q')}`
            );
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No se cargaron datos</td></tr>';
            digitador_destroyDashboardChart('inventario');
        });
}

function digitador_tbl_dashboard_ventas_vendedor() {
    const container = document.getElementById('tblDataDigDashVentasVendedor');
    if (!container) return;

    container.innerHTML = GlobalLoader;
    digitador_destroyDashboardChart('vendedor');
    const sucursal = digitador_getSucursal();
    const mes = digitador_getMes();
    const anio = digitador_getAnio();
    const modo = digitador_getModoVentas();
    const tituloModo = `${digitador_labelModoVentas()} por vendedor`;

    RPT.data_dashboard_ventas_vendedor(sucursal, mes, anio, modo)
        .then((data) => {
            const items = [...(data.recordset || [])].sort((a, b) => Number(b.TOTALPRECIO) - Number(a.TOTALPRECIO));
            let totalPedidos = 0;
            let totalImporte = 0;
            let str = '';

            items.forEach((r) => {
                totalPedidos += Number(r.CONTEO);
                totalImporte += Number(r.TOTALPRECIO);
                str += `
                    <tr>
                        <td>${r.EMPLEADO}</td>
                        <td>${r.CONTEO}</td>
                        <td>${F.setMoneda(r.TOTALPRECIO, 'Q')}</td>
                    </tr>
                `;
            });

            container.innerHTML = str || '<tr><td colspan="3" class="text-center text-muted">Sin datos</td></tr>';
            const lbPed = document.getElementById('lbDigFootDashVendedorPedidos');
            const lbImp = document.getElementById('lbDigFootDashVendedorImporte');
            if (lbPed) lbPed.innerText = `${totalPedidos}`;
            if (lbImp) lbImp.innerText = F.setMoneda(totalImporte, 'Q');

            digitador_renderDashboardChart(
                'vendedor',
                'chartDigDashVentasVendedor',
                items.map((r) => r.EMPLEADO),
                items.map((r) => Number(r.TOTALPRECIO)),
                `${tituloModo}: ${F.setMoneda(totalImporte, 'Q')}`
            );
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No se cargaron datos</td></tr>';
            digitador_destroyDashboardChart('vendedor');
        });
}

function digitador_tbl_dashboard_ventas_marca() {
    const container = document.getElementById('tblDataDigDashVentasMarca');
    if (!container) return;

    container.innerHTML = GlobalLoader;
    digitador_destroyDashboardChart('marca');
    const sucursal = digitador_getSucursal();
    const mes = digitador_getMes();
    const anio = digitador_getAnio();
    const modo = digitador_getModoVentas();
    const tituloModo = `${digitador_labelModoVentas()} por marca`;

    RPT.data_marcas(sucursal, mes, anio, modo)
        .then((data) => {
            const items = [...(data.recordset || [])].sort((a, b) => Number(b.TOTALPRECIO) - Number(a.TOTALPRECIO));
            let totalImporte = 0;
            let str = '';

            items.forEach((r) => {
                totalImporte += Number(r.TOTALPRECIO);
                str += `
                    <tr>
                        <td>${r.DESMARCA}</td>
                        <td>${F.setMoneda(r.TOTALPRECIO, 'Q')}</td>
                    </tr>
                `;
            });

            container.innerHTML = str || '<tr><td colspan="2" class="text-center text-muted">Sin datos</td></tr>';
            const lbMarca = document.getElementById('lbDigFootDashMarcaImporte');
            if (lbMarca) lbMarca.innerText = F.setMoneda(totalImporte, 'Q');

            digitador_renderDashboardChart(
                'marca',
                'chartDigDashVentasMarca',
                items.map((r) => r.DESMARCA),
                items.map((r) => r.TOTALPRECIO),
                `${tituloModo}: ${F.setMoneda(totalImporte, 'Q')}`
            );
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="2" class="text-center text-muted">No se cargaron datos</td></tr>';
            digitador_destroyDashboardChart('marca');
        });
}

function initView(){
    root = document.getElementById('root');
    document.getElementById('js-page-content')?.classList.add('proveedor-page');
    getView();
    try {
        addListeners();
    } catch (err) {
        console.error('[inicio_digitador] addListeners:', err);
        F.AvisoError('Error al inicializar digitador: ' + (err.message || err));
    }
    digitador_showHome();
}

function destroyView(){
    Object.keys(digitador_dashboardCharts).forEach(digitador_destroyDashboardChart);
    digitador_toggleSidebar(false);
    document.body.classList.remove('proveedor-sidebar-open');
    document.getElementById('js-page-content')?.classList.remove('proveedor-page');
}

(function () {
    window.__spaViewHooks = window.__spaViewHooks || {};
    window.__spaViewHooks['inicio/digitador'] = {
        initView: initView,
        destroyView: destroyView
    };
    window.digitador_showHome = digitador_showHome;
})();

//------------------------
// PEDIDOS PENDIENTES
//------------------------

let pendientesPedidosCache = [];
let pendientesFiltroFechaActivo = true;

function listeners_pedidos_pendientes(){


    tbl_modal_embarques();

    
    selected_ped_coddoc = '';
    selected_ped_correlativo = '';
    selected_ped_codembarque = '';

    pendientes_init_filtros_listeners();

    const btnMenuFacturacion = document.getElementById('btnMenuFacturacion');
    const txtFFecha = document.getElementById('txtFFecha');
    const cmbFEmbarques = document.getElementById('cmbFEmbarques');

    btnMenuFacturacion?.addEventListener('click', () => {
        digitador_showPanel('seis', 'btnMenuFacturacion', () => {
            get_combo_embarques();
            document.getElementById('tab-Funo')?.click();
            tbl_pedidos_pendientes('tblDataPedidos');
        });
    });

    if (txtFFecha) txtFFecha.value = F.getFecha();

    txtFFecha?.addEventListener('change', () => {
        get_combo_embarques();
        if (document.getElementById('cmbFTipo')?.value === 'PRODUCTOS') {
            embarque_rpt_syncEncabezado(document.getElementById('cmbFEmbarques')?.value || '', 'lbProdCodembarque', 'lbProdFechaEmbarque');
        }
        if (document.getElementById('cmbFTipo')?.value === 'FACTURAS') {
            embarque_rpt_syncEncabezado(document.getElementById('cmbFEmbarques')?.value || '', 'lbFacCodembarque', 'lbFacFechaEmbarque');
        }
        if (document.getElementById('cmbFTipo')?.value === 'BONIFICACIONES') {
            embarque_rpt_syncEncabezado(document.getElementById('cmbFEmbarques')?.value || '', 'lbProdCodembarqueB', 'lbProdFechaEmbarqueB');
        }
        if (document.getElementById('cmbFTipo')?.value === 'VENDEDORES') {
            embarque_rpt_syncEncabezado(document.getElementById('cmbFEmbarques')?.value || '', 'lbVenCodembarque', 'lbVenFechaEmbarque');
        }
        if (document.getElementById('cmbFTipo')?.value === 'ANULADAS') {
            embarque_rpt_syncEncabezado(document.getElementById('cmbFEmbarques')?.value || '', 'lbAnulCodembarque', 'lbAnulFechaEmbarque');
        }
        if (document.getElementById('cmbFTipo')?.value === 'TIPOPRECIO') {
            embarque_rpt_syncEncabezado(document.getElementById('cmbFEmbarques')?.value || '', 'lbTpCodembarque', 'lbTpFechaEmbarque');
        }
    });

    cmbFEmbarques?.addEventListener('change', () => {

        let tipo = document.getElementById('cmbFTipo').value;

        let codembarque = document.getElementById('cmbFEmbarques').value;

        switch (tipo) {
            
            case 'FACTURAS':
                document.getElementById('tab-Fdos').click();

                tbl_facturas_embarque(codembarque);

                break;
        
            case 'PRODUCTOS':
                document.getElementById('tab-Ftres').click();

                tbl_productos_embarque(codembarque);


                break;
            case 'BONIFICACIONES':
                document.getElementById('tab-Fseis').click();

                tbl_productos_embarque_bonif(codembarque);


                break;
                
            case 'VENDEDORES':

                document.getElementById('tab-Fcuatro').click();

                tbl_resumen_embarque(codembarque);

                break;

            case 'TIPOPRECIO':
                document.getElementById('tab-Fsiete').click();

                tbl_facturas_tipo_precio();
                

                break;
           
        
        };
        
    });



    const cmbFTipo = document.getElementById('cmbFTipo');
    cmbFTipo?.addEventListener('change', () => {
        let tipo = cmbFTipo.value;
        let codembarque = document.getElementById('cmbFEmbarques')?.value || '';

        switch (tipo) {
          
            case 'PENDIENTES':
                document.getElementById('tab-Funo').click();
                tbl_pedidos_pendientes('tblDataPedidos');

              
                break;

            case 'FACTURAS':
                document.getElementById('tab-Fdos').click();

                tbl_facturas_embarque(codembarque);

                break;
        
            case 'PRODUCTOS':
                document.getElementById('tab-Ftres').click();

                tbl_productos_embarque(codembarque);


                break;
            case 'BONIFICACIONES':
                document.getElementById('tab-Fseis').click();

                tbl_productos_embarque_bonif(codembarque);


                break;
            case 'VENDEDORES':
                    document.getElementById('tab-Fcuatro').click();
    
                    tbl_resumen_embarque(codembarque);
                    
                    break;
        
            case 'ANULADAS':
                document.getElementById('tab-Fcinco').click();
                tbl_pedidos_pendientes_anulados('tblDataPedidosAnulados');

                break;
            case 'TIPOPRECIO':
                document.getElementById('tab-Fsiete').click();

                tbl_facturas_tipo_precio();
                

                break;
           
        }

    });

    


};

function pendientes_normalizar_fecha(fecha){
    if (!fecha) return '';
    if (fecha instanceof Date) {
        return `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`;
    }
    const s = String(fecha).replace('T00:00:00.000Z', '').split('T')[0];
    const parts = s.split('-');
    if (parts.length >= 3) {
        return `${Number(parts[0])}-${Number(parts[1])}-${Number(parts[2])}`;
    }
    return s;
}

function pendientes_fecha_input_valor(idInput){
    const el = document.getElementById(idInput);
    if (!el?.value) return '';
    const parts = el.value.split('-');
    if (parts.length < 3) return '';
    return `${Number(parts[0])}-${Number(parts[1])}-${Number(parts[2])}`;
}

function pendientes_init_filtros_fecha(){
    const inp = document.getElementById('txtFPFechaPend');
    const btnQuitar = document.getElementById('btnFPQuitarFechaPend');
    const btnHoy = document.getElementById('btnFPRestaurarFechaPend');
    if (!inp) return;

    pendientesFiltroFechaActivo = true;
    inp.disabled = false;
    inp.value = F.getFecha();
    inp.classList.remove('sygma-pendientes-filtros__fecha-off');
    btnQuitar?.classList.remove('d-none');
    btnHoy?.classList.add('d-none');
}

function pendientes_quitar_filtro_fecha(){
    pendientesFiltroFechaActivo = false;
    const inp = document.getElementById('txtFPFechaPend');
    const btnQuitar = document.getElementById('btnFPQuitarFechaPend');
    const btnHoy = document.getElementById('btnFPRestaurarFechaPend');
    if (inp) {
        inp.value = '';
        inp.disabled = true;
        inp.classList.add('sygma-pendientes-filtros__fecha-off');
    }
    btnQuitar?.classList.add('d-none');
    btnHoy?.classList.remove('d-none');
    pendientes_aplicar_filtros();
}

function pendientes_restaurar_filtro_fecha(){
    pendientes_init_filtros_fecha();
    pendientes_aplicar_filtros();
}

function pendientes_cargar_vendedores(records){
    const sel = document.getElementById('cmbFPVendedorPend');
    if (!sel) return;
    const actual = sel.value;
    const vendedores = [...new Set(records.map(r => (r.NOMEMPLEADO || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
    sel.innerHTML = '<option value="">Todos</option>' + vendedores.map(v => `<option value="${v}">${v}</option>`).join('');
    if (actual && vendedores.includes(actual)) sel.value = actual;
}

function pendientes_init_filtros_listeners(){
    document.getElementById('txtFPFechaPend')?.addEventListener('change', () => {
        pendientesFiltroFechaActivo = true;
        document.getElementById('txtFPFechaPend')?.classList.remove('sygma-pendientes-filtros__fecha-off');
        pendientes_aplicar_filtros();
    });
    document.getElementById('cmbFPVendedorPend')?.addEventListener('change', pendientes_aplicar_filtros);
    document.getElementById('btnFPQuitarFechaPend')?.addEventListener('click', pendientes_quitar_filtro_fecha);
    document.getElementById('btnFPRestaurarFechaPend')?.addEventListener('click', pendientes_restaurar_filtro_fecha);
}

function pendientes_aplicar_filtros(){
    const vendedor = document.getElementById('cmbFPVendedorPend')?.value || '';
    const fechaFiltro = pendientesFiltroFechaActivo ? pendientes_fecha_input_valor('txtFPFechaPend') : '';

    const filtrados = pendientesPedidosCache.filter((r) => {
        if (fechaFiltro && pendientes_normalizar_fecha(r.FECHA) !== fechaFiltro) return false;
        if (vendedor && (r.NOMEMPLEADO || '') !== vendedor) return false;
        return true;
    });

    pendientes_render_tabla('tblDataPedidos', filtrados);

    const txtBuscar = document.getElementById('txtFPBuscar');
    if (txtBuscar) F.FiltrarTabla('tblPedidos', 'txtFPBuscar');
}

function pendientes_render_tabla(idContainer, records){
    const container = document.getElementById(idContainer);
    if (!container) return;

    let str = '';
    let contador = 0;
    let varTotal = 0;

    records.map((r)=>{
        let idRowPedido = `idRowPedido${r.CODDOC}-${r.CORRELATIVO}`;
        let idBtnEmbarque = `idBtnEmbarque${r.CODDOC}-${r.CORRELATIVO}`;
        let idBtnFix = `idBtnFix${r.CODDOC}-${r.CORRELATIVO}`;
        contador +=1;
        varTotal += Number(r.IMPORTE);
        let strClassSt = 'success'; if(r.STATUS.toString()=='A'){strClassSt='danger'};
        let idbtnAnular = `btnAnular${r.CODDOC}-${r.CORRELATIVO}`

        let strClassBtnFixEmb = ''; 
        if(r.TOTALPRECIOPROD.toFixed(2).toString()==r.IMPORTE.toFixed(2).toString()){
            strClassBtnFixEmb= ` `;
        }else{
            strClassBtnFixEmb=`
                    <button class="btn btn-danger btn-sm hand shadow oculto-impresion" id="${idBtnFix}"
                        onclick="get_fix_pedido('${r.CODDOC}','${r.CORRELATIVO}','${idBtnFix}')">
                            <i class="fal fa-wrench"></i>&nbsp Reparar
                    </button>
            `;
        }

        str += `
            <tr>
                <td class="sygma-embarque-rpt__col-action oculto-impresion">
                    <button class="btn btn-base btn-md btn-circle hand shadow" id="${idBtnEmbarque}"
                    onclick="get_embarques_pedido('${r.CODDOC}','${r.CORRELATIVO}','${idRowPedido}')">
                            <i class="fal fa-plus"></i>
                    </button>
                </td>
                <td class="sygma-embarque-rpt__cell-stack">
                    <span class="sygma-embarque-rpt__cell-main">${r.NOMEMPLEADO}</span>
                    <span class="sygma-embarque-rpt__cell-sub">${r.CODDOC}-${r.CORRELATIVO}</span>
                    <span class="sygma-embarque-rpt__cell-sub text-danger" id="${idRowPedido}">Embarque: ${r.CODEMBARQUE || ''}</span>
                    <button class="btn btn-outline-info btn-circle btn-sm hand shadow oculto-impresion mt-1"
                    onclick="F.gotoGoogleMaps('${r.LAT}','${r.LONG}')">
                        <i class="fal fa-map"></i>
                    </button>
                </td>
                <td class="sygma-embarque-rpt__cell-stack">
                    <span class="sygma-embarque-rpt__cell-main">${F.convertDateNormal(r.FECHA)}</span>
                    <span class="sygma-embarque-rpt__cell-sub">Hora: ${r.HORA}</span>
                    ${strClassBtnFixEmb}
                </td>
                <td class="sygma-embarque-rpt__cell-stack">
                    <span class="sygma-embarque-rpt__cell-main">${r.NOMCLIE}</span>
                    <span class="sygma-embarque-rpt__cell-sub">${r.DIRCLIE || ''}</span>
                </td>
                <td>${r.DESMUN}</td>
                <td class="text-right sygma-embarque-rpt__importe">
                    <span class="sygma-embarque-rpt__cell-main">${F.setMoneda(r.IMPORTE,'Q')}</span>
                    <span class="sygma-embarque-rpt__cell-sub">Det: ${F.setMoneda(r.TOTALPRECIOPROD,'Q')}</span>
                </td>
                <td class="sygma-embarque-rpt__col-action oculto-impresion text-center">
                    <button class="btn btn-${strClassSt} btn-md btn-circle hand shadow" id="${idbtnAnular}"
                        onclick="anular_pedido('${r.CODDOC}','${r.CORRELATIVO}','${r.STATUS}','${idbtnAnular}')">
                        ${r.STATUS}        
                    </button>
                </td>
                <td class="sygma-embarque-rpt__col-action oculto-impresion">
                    <button class="btn btn-warning btn-md btn-circle hand shadow"
                        onclick="get_detalle_pedido('${r.CODDOC}','${r.CORRELATIVO}')">
                            <i class="fal fa-list"></i>
                    </button>
                </td>
                <td class="sygma-embarque-rpt__col-action oculto-impresion">
                    <button class="btn btn-info btn-md btn-circle hand shadow"
                        onclick="fcn_editar_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.NOMCLIE}','${r.DIRCLIE}')">
                            <i class="fal fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    container.innerHTML = str || `<tr><td colspan="9" class="text-center text-muted py-3">No hay pedidos con los filtros seleccionados</td></tr>`;

    const lbItems = document.getElementById('lbPendTotalPedidos');
    if (lbItems) lbItems.innerText = `Pendientes: ${contador}`;

    const totalBlock = document.getElementById('lbPendTotalBlock');
    if (totalBlock) {
        totalBlock.innerHTML = contador ? `
            <div class="sygma-embarque-rpt__total-inner">
                <span class="sygma-embarque-rpt__foot-label">TOTAL IMPORTE</span>
                <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(varTotal, 'Q')}</span>
            </div>` : '';
    }
}

function tbl_pedidos_pendientes(idContainer){

    let container = document.getElementById(idContainer);
    if (!container) return;

    container.innerHTML = GlobalLoader;

    GF.get_data_pedidos_pendientes_vendedores()
    .then((data)=>{
        pendientesPedidosCache = data.recordset || [];
        pendientes_cargar_vendedores(pendientesPedidosCache);
        if (document.getElementById('txtFPFechaPend') && !document.getElementById('txtFPFechaPend').disabled && !document.getElementById('txtFPFechaPend').value) {
            pendientes_init_filtros_fecha();
        }
        pendientes_aplicar_filtros();
    })
    .catch((error)=>{
        pendientesPedidosCache = [];
        container.innerHTML = '<tr><td colspan="9" class="text-center text-muted py-3">No se cargaron datos.</td></tr>';
        const lbItems = document.getElementById('lbPendTotalPedidos');
        if (lbItems) lbItems.innerText = '---';
        const totalBlock = document.getElementById('lbPendTotalBlock');
        if (totalBlock) totalBlock.innerHTML = '';
        pendientes_cargar_vendedores([]);
    })




};

function tbl_pedidos_pendientes_anulados(idContainer){

    let container = document.getElementById(idContainer);

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;

    embarque_rpt_syncEncabezado(document.getElementById('cmbFEmbarques')?.value || '', 'lbAnulCodembarque', 'lbAnulFechaEmbarque');

    GF.get_data_pedidos_pendientes_vendedores_anulados()
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
            let idRowPedido = `idRowPedido${r.CODDOC}-${r.CORRELATIVO}`;
            let idBtnEmbarque = `idBtnEmbarque${r.CODDOC}-${r.CORRELATIVO}`;
            let idBtnFix = `idBtnFix${r.CODDOC}-${r.CORRELATIVO}`;
            contador +=1;
            varTotal += Number(r.IMPORTE);
            let strClassSt = 'success'; if(r.STATUS.toString()=='A'){strClassSt='danger'};
            let idbtnAnular = `btnAnular${r.CODDOC}-${r.CORRELATIVO}`

            let strClassBtnFixEmb = ''; 
            if(r.TOTALPRECIOPROD.toFixed(2).toString()==r.IMPORTE.toFixed(2).toString()){
                strClassBtnFixEmb= ` `;
            }else{
                strClassBtnFixEmb=`
                        <button class="btn btn-danger btn-sm hand shadow oculto-impresion" id="${idBtnFix}"
                            onclick="get_fix_pedido('${r.CODDOC}','${r.CORRELATIVO}','${idBtnFix}')">
                                <i class="fal fa-wrench"></i>&nbsp Reparar
                        </button>
                `;
            }

            str += `
                <tr>
                    <td class="sygma-embarque-rpt__col-action oculto-impresion">
                        <button class="btn btn-base btn-md btn-circle hand shadow" id="${idBtnEmbarque}"
                        onclick="get_embarques_pedido('${r.CODDOC}','${r.CORRELATIVO}','${idRowPedido}')">
                                <i class="fal fa-plus"></i>
                        </button>
                    </td>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${r.NOMEMPLEADO}</span>
                        <span class="sygma-embarque-rpt__cell-sub">${r.CODDOC}-${r.CORRELATIVO}</span>
                        <span class="sygma-embarque-rpt__cell-sub text-danger" id="${idRowPedido}">Embarque: ${r.CODEMBARQUE || ''}</span>
                        <button class="btn btn-outline-info btn-circle btn-sm hand shadow oculto-impresion mt-1"
                        onclick="F.gotoGoogleMaps('${r.LAT}','${r.LONG}')">
                            <i class="fal fa-map"></i>
                        </button>
                    </td>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${F.convertDateNormal(r.FECHA)}</span>
                        <span class="sygma-embarque-rpt__cell-sub">Hora: ${r.HORA}</span>
                        ${strClassBtnFixEmb}
                    </td>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${r.NOMCLIE}</span>
                        <span class="sygma-embarque-rpt__cell-sub">${r.DIRCLIE || ''}</span>
                    </td>
                    <td>${r.DESMUN}</td>
                    <td class="text-right sygma-embarque-rpt__importe">
                        <span class="sygma-embarque-rpt__cell-main">${F.setMoneda(r.IMPORTE,'Q')}</span>
                        <span class="sygma-embarque-rpt__cell-sub">Det: ${F.setMoneda(r.TOTALPRECIOPROD,'Q')}</span>
                    </td>
                    <td class="sygma-embarque-rpt__col-action oculto-impresion text-center">
                        <button class="btn btn-${strClassSt} btn-md btn-circle hand shadow" id="${idbtnAnular}"
                            onclick="anular_pedido('${r.CODDOC}','${r.CORRELATIVO}','${r.STATUS}','${idbtnAnular}')">
                            ${r.STATUS}        
                        </button>
                    </td>
                    <td class="sygma-embarque-rpt__col-action oculto-impresion">
                        <button class="btn btn-warning btn-md btn-circle hand shadow"
                            onclick="get_detalle_pedido('${r.CODDOC}','${r.CORRELATIVO}')">
                                <i class="fal fa-list"></i>
                        </button>
                    </td>
                    <td class="sygma-embarque-rpt__col-action oculto-impresion">
                        <button class="btn btn-info btn-md btn-circle hand shadow"
                            onclick="fcn_editar_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.NOMCLIE}','${r.DIRCLIE}')">
                                <i class="fal fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
        const lbItems = document.getElementById('lbAnulTotalPedidos');
        if (lbItems) lbItems.innerText = `Pedidos: ${contador}`;

        const totalBlock = document.getElementById('lbAnulTotalBlock');
        if (totalBlock) {
            totalBlock.innerHTML = `
                <div class="sygma-embarque-rpt__total-inner">
                    <span class="sygma-embarque-rpt__foot-label">TOTAL IMPORTE</span>
                    <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(varTotal, 'Q')}</span>
                </div>`;
        }

    })
    .catch((error)=>{
        container.innerHTML = '<tr><td colspan="9" class="text-center text-muted py-3">No se cargaron datos.</td></tr>';
        const lbItems = document.getElementById('lbAnulTotalPedidos');
        if (lbItems) lbItems.innerText = '';
        const totalBlock = document.getElementById('lbAnulTotalBlock');
        if (totalBlock) totalBlock.innerHTML = '';
    })




};


function get_fix_pedido(coddoc,correlativo,idbtn){

    let btn = document.getElementById(idbtn);
    
    btn.disabled = true;
    btn.innerHTML = `<i class="fal fa-spin fa-wrench"></i>`

    GF.update_fix_documento(coddoc,correlativo)
    .then((data)=>{
        F.Aviso('Documento corregido exitosamente!!');
        btn.disabled = false;
        btn.innerHTML = `<i class="fal fa-wrench"></i>&nbsp Reparar`
        tbl_pedidos_pendientes('tblDataPedidos');
        
    })
    .catch(()=>{
        F.AvisoError('No se pudo corregir el documento');
         btn.disabled = false;
        btn.innerHTML = `<i class="fal fa-wrench"></i>&nbsp Reparar`
    })

};


function anular_pedido(coddoc,correlativo,statusActual,idbtn){


    let btn = document.getElementById(idbtn);

    let newst = '';
    let msn = '';

    if(statusActual=='A'){
        newst = 'O';
        msn = 'RE-ACTIVAR';
    }else{
        newst = 'A';
        msn = 'ANULAR';
    }


    F.Confirmacion(`¿Está seguro que desea ${msn} este pedido?`)
    .then((value)=>{
        if(value==true){

            btn.disabled = true;
            btn.innerHTML = `<i class="fal fa-spin"></i>${statusActual}`;

            GF.get_data_pedidos_anular(GlobalEmpnit,coddoc,correlativo,newst)
            .then(()=>{
                
                tbl_pedidos_pendientes('tblDataPedidos');
                
            })
            .catch(()=>{
                F.AvisoError('No se pudo actualizar');
                btn.disabled = false;
                btn.innerHTML = statusActual;
            })


        }
    })

};


function get_embarques_pedido(coddoc,correlativo,idUpdate){

    selected_id_element = idUpdate;
    selected_ped_coddoc = coddoc;
    selected_ped_correlativo = correlativo.toString();

    const lbDocRef = document.getElementById('lbModalEmbDocRef');
    if (lbDocRef) lbDocRef.textContent = `Pedido ${coddoc}-${correlativo}`;

    tbl_modal_embarques();
    $("#modal_embarques_pendientes").modal('show');
};

function tbl_modal_embarques(){

    let container = document.getElementById('tblDataMEmbarques');
    if (!container) return;
    container.innerHTML = GlobalLoader;

    let str = '';
    let contador = 0;

    GF.get_data_embarques_listado_activos(GlobalEmpnit)
    .then((data)=>{

        data.recordset.map((r)=>{
            contador += 1;
            let idbtnF = `btnMF${r.CODEMBARQUE}`;
            str += `
                <tr>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${F.convertDateNormal(r.FECHA)}</span>
                    </td>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main text-danger">${r.CODEMBARQUE}</span>
                        <span class="sygma-embarque-rpt__cell-sub">${r.DESCRIPCION || ''}</span>
                    </td>
                    <td>${r.NOMEMPLEADO || ''}</td>
                    <td class="sygma-embarque-rpt__col-action text-center">
                        <button id="${idbtnF}" type="button" class="btn btn-success btn-md btn-circle hand shadow"
                        onclick="seleccionar_embarque('${r.CODEMBARQUE}')" title="Asignar embarque">
                            <i class="fal fa-check"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        container.innerHTML = str || `<tr><td colspan="4" class="text-center text-muted py-3">No hay embarques activos</td></tr>`;

        const lbTotal = document.getElementById('lbModalEmbTotal');
        if (lbTotal) lbTotal.textContent = contador;

        const txtBuscar = document.getElementById('txtBuscarModalEmbarques');
        if (txtBuscar) txtBuscar.value = '';

    })
    .catch(()=>{
        container.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">No se cargaron datos</td></tr>`;
        const lbTotal = document.getElementById('lbModalEmbTotal');
        if (lbTotal) lbTotal.textContent = '0';
    })

};

function seleccionar_embarque(codembarque){


    
    selected_ped_codembarque = codembarque;

    $("#modal_embarques_pendientes").modal('hide');


    let valorAnterior = '';
    let valor = document.getElementById(selected_id_element);
    valorAnterior = valor.textContent;
    valor.textContent = 'Actualizando....';

    console.log('por aqui....')

    GF.get_data_pedidos_update_embarque(GlobalEmpnit,selected_ped_coddoc,selected_ped_correlativo,codembarque)
    .then((data)=>{

        valor.textContent = `Embarque: ${codembarque}`;
    })
    .catch(()=>{
        F.AvisoError('No se pudo actualizar el Embarque en el pedido')
        valor.textContent = valorAnterior;
    })


};

function get_detalle_pedido(coddoc,correlativo){

    $("#modal_detalle_pedido").modal('show');

    let container = document.getElementById('tblDataDetallePedido');
    container.innerHTML = GlobalLoader;

    document.getElementById('lbDetalleDocRef').textContent = `${coddoc}-${correlativo}`;
    document.getElementById('lbDetalleNomclie').textContent = '—';
    document.getElementById('lbDetalleDirclie').textContent = '—';
    document.getElementById('lbDetalleCodembarque').textContent = '—';
    document.getElementById('lbFtotalCantidad').textContent = '0';
    document.getElementById('lbFtotalImporte').textContent = F.setMoneda(0,'Q');
    document.getElementById('txtDetallePedidoObs').value = '';

    GF.get_data_detalle_documento(GlobalEmpnit,coddoc,correlativo)
    .then((data)=>{
        let str = "";
        let contador = 0;
        let varImporte = 0;
        let obs = '';
        let nomclie = '—';
        let dirclie = '—';
        let codembarque = '—';

        data.recordset.map((r)=>{
            if (contador === 0) {
                nomclie = (r.NOMCLIE || '').trim() || '—';
                dirclie = (r.DIRCLIE || '').trim() || '—';
                codembarque = (r.CODEMBARQUE || '').trim() || '—';
                obs = (r.DOCOBS || '').trim();
            }
            contador += 1;
            varImporte += Number(r.TOTALPRECIO);
            str += `
            <tr>
                <td><span class="sygma-doc-detalle-modal__cod">${r.CODPROD}</span></td>
                <td>${r.DESPROD}</td>
                <td>${r.TIPOPRECIO || ''}</td>
                <td>${r.CODMEDIDA || ''}</td>
                <td class="text-right">${r.CANTIDAD}</td>
                <td class="text-right">${F.setMoneda(r.PRECIO,'Q')}</td>
                <td class="text-right sygma-doc-detalle-modal__importe">${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
            </tr>
            `;
        });

        container.innerHTML = str || `<tr><td colspan="7" class="text-center text-muted py-4">Sin productos en este documento</td></tr>`;
        document.getElementById('lbDetalleNomclie').textContent = nomclie;
        document.getElementById('lbDetalleDirclie').textContent = dirclie;
        document.getElementById('lbDetalleCodembarque').textContent = codembarque;
        document.getElementById('lbFtotalCantidad').textContent = contador;
        document.getElementById('lbFtotalImporte').textContent = F.setMoneda(varImporte,'Q');
        document.getElementById('txtDetallePedidoObs').value = obs;
    })
    .catch(()=>{
        container.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No se pudo cargar el detalle</td></tr>`;
        document.getElementById('lbFtotalCantidad').textContent = '0';
        document.getElementById('lbFtotalImporte').textContent = F.setMoneda(0,'Q');
        document.getElementById('txtDetallePedidoObs').value = '';
    });
};


function get_combo_embarques(){

    let container = document.getElementById('cmbFEmbarques');
    let fecha = F.devuelveFecha('txtFFecha');

    let str = ``;

    GF.get_data_embarques_listado_activos_fecha(GlobalEmpnit, fecha)
    .then((data)=>{

        data.recordset.map((r)=>{
            str += `
                <option value='${r.CODEMBARQUE}'>${r.CODEMBARQUE}<small>(${r.NOMEMPLEADO})</small></option>
            `
        })
        container.innerHTML = str;
    })
    .catch((error)=>{
        
        console.log(error);

        container.innerHTML = `<option value='SN'>NO HAY EMBARQUES CON ESA FECHA</option>`;

    })



};

function tbl_pedidos_embarque_facturar(codembarque){

        let container = document.getElementById('tblDataFPedidos');

        container.innerHTML = GlobalLoader;
        let contador = 0;
        let varTotal = 0;

        GF.get_data_pedidos_pendientes_vendedores_embarque(codembarque)
        .then((data)=>{

            let str = '';

            data.recordset.map((r)=>{
                let idRowPedido = `idRowPedidoF${r.CODDOC}-${r.CORRELATIVO}`;
                let idbtnFacturar = `btnFacturar${r.CODDOC}-${r.CORRELATIVO}`;
                contador +=1;
                varTotal += Number(r.IMPORTE);
                str += `
                    <tr>
                        <td class="text-left">
                          
                            <b class="text-danger" id="${idRowPedido}">${r.CODEMBARQUE}</b>
                        </td>
                        <td>${r.NOMEMPLEADO}
                            <br>
                            <small class="negrita">${r.CODDOC}-${r.CORRELATIVO}</small>
                        </td>
                        <td>${F.convertDateNormal(r.FECHA)}
                            <br>
                            <small>Hora:${r.HORA}</small>
                        </td>
                        <td>${r.NOMCLIE}
                            <br>
                            <small>${r.DIRCLIE}</small>
                        </td>
                        <td>
                            ${r.DESMUN}
                        </td>
                        <td class="negrita text-danger text-right">${F.setMoneda(r.IMPORTE,'Q')}</td>
                        <td>
                            <button class="btn btn-base btn-md hand shadow" id="${idbtnFacturar}"
                            onclick="facturar_pedido('${r.CODDOC}','${r.CORRELATIVO}','${idbtnFacturar}')">
                                    <i class="fal fa-dollar-sign"></i>&nbsp FACTURAR
                            </button>
                        </td>
                    </tr>
                `
            })
            container.innerHTML = str;
            document.getElementById('lbFTotalPedidos').innerText = `Pedidos: ${contador}`;
            document.getElementById('lbFTotalImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

        })
        .catch((error)=>{
            container.innerHTML = 'No se cargaron datos....';
            document.getElementById('lbFTotalPedidos').innerText = '';
            document.getElementById('lbFTotalImporte').innerText = '';
        })



};

function facturar_pedido(coddoc,correlativo,idbtn){


    let btn = document.getElementById(idbtn);

    let coddoc_fac = document.getElementById('cmbFacCoddoc').value;
    if(coddoc_fac=='SN'){F.AvisoError('No se cargaron las series de facturacion');return;}
    let correlativo_fac = '0';    

    let fecha_fac = new Date(document.getElementById('txtFacFecha').value);

    let fFAC = new Date(fecha_fac);

    let mes_fac = fFAC.getUTCMonth()+1;
    let anio_fac = fFAC.getUTCFullYear();


    F.Confirmacion('¿Está seguro que desea FACTURAR este pedido?')
    .then((value)=>{
        if(value==true){

            btn.disabled = true;
            btn.innerHTML = `Cargando Correlativo ...`;

            GF.get_data_coddoc_correlativo(coddoc_fac)
            .then((correlativoFac)=>{
              
                    correlativo_fac = correlativoFac;

                    btn.disabled = true;
                    btn.innerHTML = `Facturando ...`;
        


                    GF.get_data_pedidos_facturar_pedido(GlobalEmpnit,coddoc,correlativo,coddoc_fac,correlativo_fac,fecha_fac,mes_fac,anio_fac)
                    .then(()=>{
                        
                        F.Aviso('Pedido Facturado Exitosamente!!');

                        let codembarque = document.getElementById('cmbFEmbarques').value;
                        tbl_pedidos_embarque_facturar(codembarque);
                    
                    })
                    .catch(()=>{
                    
                        F.AvisoError('No se pudo generar la Factura');
                        
                        btn.disabled = false;
                        btn.innerHTML = `<i class="fal fa-dollar-sign"></i>&nbsp FACTURAR`;
                        
                    })
            })
            .catch(()=>{

                F.AvisoError('No se pudo obtener el correlativo de la factura a crear, intentelo de nuevo');
                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-dollar-sign"></i>&nbsp FACTURAR`;

            })


           






        }
    })


};


function tbl_resumen_embarque(codembarque){

    let container = document.getElementById('tblDataVendedores');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;
    let totalPedidos = 0;

    embarque_rpt_syncEncabezado(codembarque, 'lbVenCodembarque', 'lbVenFechaEmbarque');

    GF.get_data_embarque_resumen_vendedores(GlobalEmpnit,codembarque)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{

            contador += 1;
            totalPedidos += Number(r.CONTEO);
            varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td class="sygma-embarque-rpt__cell-main">${r.EMPLEADO}</td>
                    <td class="text-center">${r.CONTEO}</td>
                    <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(r.IMPORTE,'Q')}</td>
                </tr>
            `
        })
        container.innerHTML = str;
        const lbVen = document.getElementById('lbVenTotalVendedores');
        if (lbVen) lbVen.innerText = `Vendedores: ${contador} · Pedidos: ${totalPedidos}`;

        const totalBlock = document.getElementById('lbVenTotalBlock');
        if (totalBlock) {
            totalBlock.innerHTML = `
                <div class="sygma-embarque-rpt__total-inner">
                    <span class="sygma-embarque-rpt__foot-label">TOTAL IMPORTE</span>
                    <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(varTotal, 'Q')}</span>
                </div>`;
        }

    })
    .catch((error)=>{
        container.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-3">No se cargaron datos.</td></tr>';
        const lbVen = document.getElementById('lbVenTotalVendedores');
        if (lbVen) lbVen.innerText = '';
        const totalBlock = document.getElementById('lbVenTotalBlock');
        if (totalBlock) totalBlock.innerHTML = '';
    })


};

function tbl_facturas_embarque(codembarque){

    let container = document.getElementById('tblDataFFacturas');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;

    embarque_rpt_syncEncabezado(codembarque, 'lbFacCodembarque', 'lbFacFechaEmbarque');

    GF.get_data_embarque_facturas(GlobalEmpnit,codembarque)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{

            let idBtnEmbarque = `btnDeleteEmbarque${r.CODDOC}-${r.CORRELATIVO}`;
            
            contador +=1;
            varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td class="sygma-embarque-rpt__col-action oculto-impresion">
                        <button class="btn btn-danger btn-md btn-circle hand shadow" id="${idBtnEmbarque}"
                        onclick="quitar_embarque_factura('${r.CODDOC}','${r.CORRELATIVO}','${idBtnEmbarque}')">
                                <i class="fal fa-unlink"></i>
                        </button>
                    </td>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${r.NOMEMPLEADO}</span>
                        <span class="sygma-embarque-rpt__cell-sub">${r.CODDOC}-${r.CORRELATIVO}</span>
                    </td>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${F.convertDateNormal(r.FECHA)}</span>
                        <span class="sygma-embarque-rpt__cell-sub">Hora: ${r.HORA}</span>
                    </td>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${r.NOMCLIE}</span>
                        <span class="sygma-embarque-rpt__cell-sub">${r.DIRCLIE || ''}</span>
                    </td>
                    <td>${r.DESMUN}</td>
                    <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(r.IMPORTE,'Q')}</td>
                    <td class="sygma-embarque-rpt__col-action oculto-impresion">
                        <button class="btn btn-warning btn-md btn-circle hand shadow"
                            onclick="get_detalle_pedido('${r.CODDOC}','${r.CORRELATIVO}')">
                                <i class="fal fa-list"></i>
                        </button>
                    </td>
                    <td class="sygma-embarque-rpt__col-action oculto-impresion">
                        <button class="btn btn-info btn-md btn-circle hand shadow"
                            onclick="fcn_editar_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.NOMCLIE}','${r.DIRCLIE}')">
                                <i class="fal fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbFacTotalPedidos').innerText = `Pedidos: ${contador}`;

        const totalBlock = document.getElementById('lbFacTotalBlock');
        if (totalBlock) {
            totalBlock.innerHTML = `
                <div class="sygma-embarque-rpt__total-inner">
                    <span class="sygma-embarque-rpt__foot-label">TOTAL IMPORTE</span>
                    <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(varTotal, 'Q')}</span>
                </div>`;
        }

    })
    .catch((error)=>{
        container.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-3">No se cargaron datos.</td></tr>';
        document.getElementById('lbFacTotalPedidos').innerText = '';
        const totalBlock = document.getElementById('lbFacTotalBlock');
        if (totalBlock) totalBlock.innerHTML = '';
    })


};




function quitar_embarque_factura(coddoc,correlativo,idbtn){

    let btn = document.getElementById(idbtn);


    F.Confirmacion("¿Está seguro que desea Quitar este Embarque?")
    .then((value)=>{
        if(value==true){

                btn.disabled = true;
                btn.innerHTML = `<i class="fal fa-unlink fa-spin"></i>`;

                GF.get_data_pedidos_update_embarque(GlobalEmpnit,coddoc,correlativo,'')
                .then((data)=>{

                    btn.disabled = false;
                    btn.innerHTML = `<i class="fal fa-unlink"></i>`;

                    let codembarque = document.getElementById('cmbFEmbarques').value;
                    tbl_facturas_embarque(codembarque);

                    tbl_pedidos_pendientes('tblDataPedidos');


                })
                .catch(()=>{

                    F.AvisoError('No se pudo actualizar el Embarque')
                    btn.disabled = false;
                    btn.innerHTML = `<i class="fal fa-unlink"></i>`;
                })


        }
    })


    



};



function embarque_rpt_syncEncabezado(codembarque, codeId, dateId) {
    const lbCode = document.getElementById(codeId || 'lbProdCodembarque');
    const lbFecha = document.getElementById(dateId || 'lbProdFechaEmbarque');
    if (lbCode) {
        lbCode.textContent = codembarque ? 'Embarque: ' + codembarque : '';
    }
    if (lbFecha) {
        const raw = document.getElementById('txtFFecha')?.value || '';
        lbFecha.textContent = raw ? 'Fecha: ' + F.convertDateNormal(raw) : '';
    }
}

function tbl_productos_embarque(codembarque){

    let container = document.getElementById('tblDataFProductos');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;

    embarque_rpt_syncEncabezado(codembarque, 'lbProdCodembarque', 'lbProdFechaEmbarque');

    GF.get_data_embarque_productos(GlobalEmpnit,codembarque)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
         
            contador +=1;
            varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td class="sygma-embarque-rpt__cod">
                        <span class="sygma-embarque-rpt__cod-main">${r.CODPROD}</span>
                        <span class="sygma-embarque-rpt__cod-sub">${r.TOTALUNIDADES} uds.</span>
                    </td>
                    <td class="sygma-embarque-rpt__prod">
                        <span class="sygma-embarque-rpt__prod-main">${r.DESPROD}</span>
                        <span class="sygma-embarque-rpt__prod-sub">${r.DESMARCA || ''}</span>
                    </td>
                    <td class="text-center">${r.UXC}</td>
                    <td class="text-center">${r.CAJAS}</td>
                    <td class="text-center">${r.UNIDADES}</td>
                    <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(r.IMPORTE,'Q')}</td>
                </tr>
                `
        })
        container.innerHTML = str;
        document.getElementById('lbProdTotalPedidos').innerText = `Items: ${contador}`;

        const totalBlock = document.getElementById('lbProdTotalBlock');
        if (totalBlock) {
            totalBlock.innerHTML = `
                <div class="sygma-embarque-rpt__total-inner">
                    <span class="sygma-embarque-rpt__foot-label">TOTAL IMPORTE</span>
                    <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(varTotal, 'Q')}</span>
                </div>`;
        }

    })
    .catch((error)=>{
        container.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">No se cargaron datos.</td></tr>';
        document.getElementById('lbProdTotalPedidos').innerText = '';
        const totalBlock = document.getElementById('lbProdTotalBlock');
        if (totalBlock) totalBlock.innerHTML = '';
    })


};
function tbl_productos_embarque_bonif(codembarque){

    let container = document.getElementById('tblDataFProductosB');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;

    embarque_rpt_syncEncabezado(codembarque, 'lbProdCodembarqueB', 'lbProdFechaEmbarqueB');

    GF.get_data_embarque_productos_bonif(GlobalEmpnit,codembarque)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
         
            contador +=1;
            varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td class="sygma-embarque-rpt__cod">
                        <span class="sygma-embarque-rpt__cod-main">${r.CODPROD}</span>
                        <span class="sygma-embarque-rpt__cod-sub">${r.TOTALUNIDADES} uds.</span>
                    </td>
                    <td class="sygma-embarque-rpt__prod">
                        <span class="sygma-embarque-rpt__prod-main">${r.DESPROD}</span>
                        <span class="sygma-embarque-rpt__prod-sub">${r.DESMARCA || ''}</span>
                    </td>
                    <td class="text-center">${r.UXC}</td>
                    <td class="text-center">${r.CAJAS}</td>
                    <td class="text-center">${r.UNIDADES}</td>
                    <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(r.IMPORTE,'Q')}</td>
                </tr>
                `
        })
        container.innerHTML = str;
        document.getElementById('lbProdTotalPedidosB').innerText = `Items: ${contador}`;

        const totalBlock = document.getElementById('lbProdTotalBlockB');
        if (totalBlock) {
            totalBlock.innerHTML = `
                <div class="sygma-embarque-rpt__total-inner">
                    <span class="sygma-embarque-rpt__foot-label">TOTAL IMPORTE</span>
                    <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(varTotal, 'Q')}</span>
                </div>`;
        }

    })
    .catch((error)=>{
        container.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">No se cargaron datos.</td></tr>';
        document.getElementById('lbProdTotalPedidosB').innerText = '';
        const totalBlock = document.getElementById('lbProdTotalBlockB');
        if (totalBlock) totalBlock.innerHTML = '';
    })


};

//------------------------
// PEDIDOS PENDIENTES
//------------------------




//------------------------
// RELLENO
//------------------------


function tbl_relleno_inventario(idContainer){

    let container = document.getElementById(idContainer);
    if (!container) return;

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let totalRelleno = 0;

    GF.get_data_surtido(GlobalEmpnit)
    .then((data)=>{
        
        let str = '';
        data.recordset.map((r)=>{
            contador +=1;
            totalRelleno += Number(r.RELLENO) || 0;
          
            str +=`
                <tr>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${r.DESPROD}</span>
                        <span class="sygma-embarque-rpt__cell-sub">${r.CODPROD}</span>
                    </td>
                    <td>${r.DESMARCA || ''}</td>
                    <td class="text-right">${r.EXISTENCIA}</td>
                    <td class="text-right">${r.MINIMO}</td>
                    <td class="text-right">${r.MAXIMO}</td>
                    <td class="text-right sygma-embarque-rpt__importe text-danger">${r.RELLENO}</td>
                </tr>
            `;
        });
        container.innerHTML = str || `<tr><td colspan="6" class="text-center text-muted py-3">No hay productos pendientes de relleno</td></tr>`;

        const lbItems = document.getElementById('lbRellenoTotalItems');
        if (lbItems) lbItems.innerText = `Pendientes surtir: ${contador}`;

        const lbBadge = document.getElementById('lbTotalMR');
        if (lbBadge) lbBadge.innerText = `${contador} productos`;

        const totalBlock = document.getElementById('lbRellenoTotalBlock');
        if (totalBlock) {
            totalBlock.innerHTML = `
                <div class="sygma-embarque-rpt__total-inner">
                    <span class="sygma-embarque-rpt__foot-label">TOTAL UNIDADES A RELLENAR</span>
                    <span class="sygma-embarque-rpt__foot-total">${totalRelleno}</span>
                </div>`;
        }
        
    })
    .catch((error)=>{
        console.log(error);
        container.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No se cargaron datos</td></tr>`;
        const lbItems = document.getElementById('lbRellenoTotalItems');
        if (lbItems) lbItems.innerText = '---';
        const lbBadge = document.getElementById('lbTotalMR');
        if (lbBadge) lbBadge.innerText = '---';
        const totalBlock = document.getElementById('lbRellenoTotalBlock');
        if (totalBlock) totalBlock.innerHTML = '';
    })




};



//------------------------
// RELLENO
//------------------------


//------------------------
// EMBARQUES
//------------------------

function listeners_embarques(){
    const cmbMes = document.getElementById('cmbMes');
    const cmbAnio = document.getElementById('cmbAnio');
    const txtEmbarqueFecha = document.getElementById('txtEmbarqueFecha');
    const btnEmbarquesNuevo = document.getElementById('btnEmbarquesNuevo');
    if (!cmbMes || !cmbAnio || !txtEmbarqueFecha || !btnEmbarquesNuevo) return;

    //carga la lista de empleados
    GF.get_data_empleados_tipo(4)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>`
        });
        document.getElementById('cmbEmbarqueEmpleado').innerHTML = str;
    })
    .catch(()=>{
        F.AvisoError('No se cargaron los Repartidores');
        document.getElementById('cmbEmbarqueEmpleado').innerHTML ='<option value="1">SIN REPARTIDOR</option>';
    })



    //listeners
    cmbMes.innerHTML = F.ComboMeses();
    cmbAnio.innerHTML = F.ComboAnio();
    cmbMes.value = F.get_mes_curso();
    cmbAnio.value = F.get_anio_curso();
    txtEmbarqueFecha.value = F.getFecha();

    btnEmbarquesNuevo.addEventListener('click',()=>{
            
        clean_data_embarque();
        $("#modal_embarques_nuevo").modal('show');

    })


    cargar_grid_embarques();



    let btnEmbarqueGuardar = document.getElementById('btnEmbarqueGuardar');
    btnEmbarqueGuardar.addEventListener('click',()=>{


        let MesAnio = F.get_mes_anio_fecha('txtEmbarqueFecha');

        let fecha = F.devuelveFecha('txtEmbarqueFecha');
        let anio = MesAnio[1];
        let mes = MesAnio[0];
        
        let codembarque = F.limpiarTexto(document.getElementById('txtEmbarqueCodigo').value) || ''; 
        let descripcion = F.limpiarTexto(document.getElementById('txtEmbarqueDescripcion').value) || '';    
        let ruteo  = F.limpiarTexto(document.getElementById('txtEmbarqueRuteo').value) || '';
        let codempleado = document.getElementById('cmbEmbarqueEmpleado').value; 


        if(codembarque==''){F.AvisoError('Debe indicar un código de Embarque');return;}


        let statusEmbarque = document.getElementById('cmbStatus').value;

            //let boleditar = document.getElementById('txtEmbarqueCodigo').disabled 
            //if(boleditar.toString() == 'false'){
            if(document.getElementById('txtEmbarqueCodigo').disabled==false){
                //si esta habilitado, es nuevo

             
                
                F.Confirmacion('¿Está seguro que desea CREAR este embarque?')
                .then((value)=>{
                    if(value==true){

                        btnEmbarqueGuardar.disabled=true;
                        btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save fa-spin mr-1"></i> Guardando...`;

                        GF.get_data_embarques_insert(GlobalEmpnit,fecha,mes,anio,codembarque,descripcion,ruteo,codempleado)
                        .then((data)=>{

                            btnEmbarqueGuardar.disabled=false;
                            btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar`;
                            
                            F.Aviso('Embarque creado exitosamente!!');

                            $("#modal_embarques_nuevo").modal('hide');

                            tbl_embarques('tblDatalEmbarques',statusEmbarque,mes,anio);

                        })
                        .catch((error)=>{
                            console.log('error al crear embarque')
                            console.log(error);

                            F.AvisoError('No se pudo Guardar')
                            btnEmbarqueGuardar.disabled=false;
                            btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar`;

                        })

                    }
                })

            }else{
                //si esta deshabilitado, es edicion
               
                F.Confirmacion('¿Está seguro que desea EDITAR este embarque?')
                .then((value)=>{
                    if(value==true){

                        btnEmbarqueGuardar.disabled=true;
                        btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save fa-spin mr-1"></i> Guardando...`;
    

                        GF.get_data_embarques_edit(GlobalEmpnit,fecha,mes,anio,codembarque,descripcion,ruteo,codempleado)
                        .then((data)=>{

                            btnEmbarqueGuardar.disabled=false;
                            btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar`;

                            F.Aviso('Embarque editado exitosamente!!');

                            
                            $("#modal_embarques_nuevo").modal('hide');

                            

                            tbl_embarques('tblDatalEmbarques',statusEmbarque,mes,anio);

                        })
                        .catch(()=>{
                                F.AvisoError('No se pudo Editar este embarque')
                                btnEmbarqueGuardar.disabled=false;
                                btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar`;
                            
                        })


                    }
                })

            }

        




    })

    document.getElementById('cmbMes').addEventListener('change',()=>{

        cargar_grid_embarques();

    });

    
    document.getElementById('cmbAnio').addEventListener('change',()=>{

        cargar_grid_embarques();

    });

    
    document.getElementById('cmbStatus').addEventListener('change',()=>{

        cargar_grid_embarques();

    });

    document.getElementById('btnEmbPrintProductos')?.addEventListener('click', embarque_imprimir_productos);
    document.getElementById('btnEmbPrintFacturas')?.addEventListener('click', embarque_imprimir_lista_facturas);
    document.getElementById('btnEmbPrintDocumentos')?.addEventListener('click', embarque_imprimir_documentos_tickets);
    document.getElementById('btnEmbFinalizarGuardar')?.addEventListener('click', embarque_guardar_finalizar);

};

let embarque_print_codembarque = '';
let embarque_print_fecha = '';
let embarque_finalizar_codembarque = '';
let embarque_finalizar_btn_id = '';
let embarque_finalizar_total_facturas = 0;
let embarque_finalizar_total_devoluciones = 0;

function embarque_finalizar_show_loader(mensaje){
    const loader = document.getElementById('embFinalizarLoader');
    const form = document.getElementById('embFinalizarForm');
    const footer = document.getElementById('embFinalizarFooter');
    const txt = loader?.querySelector('.sygma-embarque-finalizar-modal__loader-text');
    if (txt) txt.textContent = mensaje || 'Calculando totales...';
    loader?.classList.remove('d-none');
    form?.classList.add('d-none');
    footer?.classList.add('d-none');
}

function embarque_finalizar_hide_loader(){
    document.getElementById('embFinalizarLoader')?.classList.add('d-none');
    document.getElementById('embFinalizarForm')?.classList.remove('d-none');
    document.getElementById('embFinalizarFooter')?.classList.remove('d-none');
}

function embarque_abrir_modal_finalizar(codembarque, idbtn){
    embarque_finalizar_codembarque = codembarque || '';
    embarque_finalizar_btn_id = idbtn || '';
    embarque_finalizar_total_facturas = 0;
    embarque_finalizar_total_devoluciones = 0;
    const lbCod = document.getElementById('lbEmbFinalizarCodembarque');
    const lbFac = document.getElementById('lbEmbFinalizarFacturas');
    const lbDev = document.getElementById('lbEmbFinalizarDevoluciones');
    const lbLiq = document.getElementById('lbEmbFinalizarLiquidar');
    const txtFecha = document.getElementById('txtEmbFinalizarFecha');
    const txtRep = document.getElementById('txtEmbFinalizarReportado');
    const btnSave = document.getElementById('btnEmbFinalizarGuardar');
    if (lbCod) lbCod.textContent = codembarque ? `Embarque: ${codembarque}` : '';
    if (lbFac) lbFac.textContent = 'Q 0.00';
    if (lbDev) lbDev.textContent = 'Q 0.00';
    if (lbLiq) lbLiq.textContent = 'Q 0.00';
    if (txtFecha) txtFecha.value = F.getFecha();
    if (txtRep) txtRep.value = '';
    if (btnSave) {
        btnSave.disabled = false;
        btnSave.innerHTML = `<i class="fal fa-check mr-1"></i> Finalizar`;
    }
    embarque_finalizar_show_loader('Calculando totales del embarque...');
    $('#modal_embarque_finalizar').modal('show');
    GF.get_data_embarques_totales_finalizar(GlobalEmpnit, codembarque)
    .then((data) => {
        const row = (data.recordset || [])[0] || {};
        embarque_finalizar_total_facturas = Number(row.TOTAL_FACTURAS) || 0;
        embarque_finalizar_total_devoluciones = Number(row.TOTAL_DEVOLUCIONES) || 0;
        const totalLiquidar = embarque_finalizar_total_facturas - embarque_finalizar_total_devoluciones;
        if (lbFac) lbFac.textContent = F.setMoneda(embarque_finalizar_total_facturas, 'Q');
        if (lbDev) lbDev.textContent = F.setMoneda(embarque_finalizar_total_devoluciones, 'Q');
        if (lbLiq) lbLiq.textContent = F.setMoneda(totalLiquidar, 'Q');
        embarque_finalizar_hide_loader();
        txtRep?.focus();
    })
    .catch(() => {
        $('#modal_embarque_finalizar').modal('hide');
        F.AvisoError('No se pudieron calcular los totales del embarque');
    });
}

function embarque_guardar_finalizar(){
    const codembarque = embarque_finalizar_codembarque;
    if (!codembarque) return;
    const txtFecha = document.getElementById('txtEmbFinalizarFecha');
    const txtRep = document.getElementById('txtEmbFinalizarReportado');
    const btnSave = document.getElementById('btnEmbFinalizarGuardar');
    const fechaFinalizado = F.devuelveFecha('txtEmbFinalizarFecha');
    if (!fechaFinalizado) {
        F.AvisoError('Debe indicar la fecha de finalización');
        txtFecha?.focus();
        return;
    }
    const reportadoRaw = (txtRep?.value || '').trim();
    if (reportadoRaw === '') {
        F.AvisoError('Debe ingresar el total reportado');
        txtRep?.focus();
        return;
    }
    const reportado = Number(reportadoRaw);
    if (Number.isNaN(reportado) || reportado < 0) {
        F.AvisoError('El total reportado debe ser un monto válido');
        txtRep?.focus();
        return;
    }
    F.Confirmacion('¿Está seguro que desea FINALIZAR este embarque?')
    .then((value) => {
        if (!value) return;
        if (btnSave) {
            btnSave.disabled = true;
            btnSave.innerHTML = `<i class="fal fa-check fa-spin mr-1"></i> Guardando...`;
        }
        GF.get_data_embarques_finalizar_reporte(
            GlobalEmpnit,
            codembarque,
            embarque_finalizar_total_facturas,
            embarque_finalizar_total_devoluciones,
            reportado,
            fechaFinalizado
        )
        .then(() => {
            $('#modal_embarque_finalizar').modal('hide');
            F.Aviso('Embarque finalizado exitosamente');
            cargar_grid_embarques();
        })
        .catch(() => {
            F.AvisoError('No se pudo finalizar el embarque');
            if (btnSave) {
                btnSave.disabled = false;
                btnSave.innerHTML = `<i class="fal fa-check mr-1"></i> Finalizar`;
            }
        });
    });
}

function embarque_abrir_opciones_imprimir(codembarque, fechaLabel){
    embarque_print_codembarque = codembarque || '';
    embarque_print_fecha = fechaLabel || '';
    const lb = document.getElementById('lbEmbPrintCodembarque');
    if (lb) lb.textContent = embarque_print_codembarque ? `Embarque: ${embarque_print_codembarque}` : '';
    embarque_print_hide_loader(true);
    $('#modal_embarque_imprimir').modal('show');
}

function embarque_print_show_loader(mensaje){
    const loader = document.getElementById('embPrintLoader');
    const actions = document.getElementById('embPrintActions');
    const footer = document.getElementById('embPrintFooter');
    const txt = loader?.querySelector('.sygma-embarque-print-modal__loader-text');
    if (txt) txt.textContent = mensaje || 'Generando imprimible...';
    loader?.classList.remove('d-none');
    actions?.classList.add('d-none');
    footer?.classList.add('d-none');
}

function embarque_print_hide_loader(keepModalOpen){
    document.getElementById('embPrintLoader')?.classList.add('d-none');
    document.getElementById('embPrintActions')?.classList.remove('d-none');
    document.getElementById('embPrintFooter')?.classList.remove('d-none');
    if (!keepModalOpen) $('#modal_embarque_imprimir').modal('hide');
}

function embarque_format_direccion_ticket(doc){
    return [
        (doc.DIRCLIE || '').trim(),
        (doc.DESMUN || '').trim(),
        (doc.DESDEPTO || '').trim()
    ].filter(Boolean).join(', ') || '—';
}

function embarque_print_sheet_open(titulo){
    return `
    <div class="sygma-embarque-rpt sygma-embarque-print-sheet">
        <div class="sygma-embarque-rpt__body p-2">
            <header class="sygma-embarque-rpt__header">
                <div class="sygma-embarque-rpt__brand">
                    <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="40" height="40" alt="Logo">
                    <div class="sygma-embarque-rpt__brand-text">
                        <h4 class="sygma-embarque-rpt__title mb-0">${titulo}</h4>
                        <div class="sygma-embarque-rpt__embarque-info">
                            <span class="sygma-embarque-rpt__embarque-code">Embarque: ${embarque_print_codembarque}</span>
                            <span class="sygma-embarque-rpt__embarque-date">Fecha: ${embarque_print_fecha || '—'}</span>
                        </div>
                    </div>
                </div>
            </header>`;
}

function embarque_print_sheet_close(){
    return `</div></div>`;
}

function embarque_fetch_resumen_vendedor(codembarque){
    return GF.get_data_embarque_resumen_vendedores(GlobalEmpnit, codembarque)
        .then((data) => data.recordset || [])
        .catch(() => []);
}

function embarque_build_resumen_vendedor_html(rows){
    let varTotal = 0;
    let totalPedidos = 0;
    let strRows = '';
    rows.forEach((r) => {
        totalPedidos += Number(r.CONTEO) || 0;
        varTotal += Number(r.IMPORTE) || 0;
        strRows += `
            <tr>
                <td>${r.EMPLEADO || ''}</td>
                <td class="text-center">${r.CONTEO || 0}</td>
                <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(r.IMPORTE, 'Q')}</td>
            </tr>`;
    });
    if (!strRows) {
        strRows = `<tr><td colspan="3" class="text-center text-muted py-2">Sin datos de vendedores</td></tr>`;
    }
    return `
        <div class="sygma-embarque-print-section">
            <h5 class="sygma-embarque-print-section__title">Resumen por Vendedor</h5>
            <div class="table-responsive sygma-embarque-rpt__table-wrap">
                <table class="table sygma-embarque-rpt__table mb-0">
                    <thead>
                        <tr>
                            <th>VENDEDOR</th>
                            <th class="text-center">PEDIDOS</th>
                            <th class="text-right">IMPORTE</th>
                        </tr>
                    </thead>
                    <tbody>${strRows}</tbody>
                </table>
            </div>
            <div class="sygma-embarque-rpt__total-block">
                <div class="sygma-embarque-rpt__total-inner">
                    <span class="sygma-embarque-rpt__foot-label">PEDIDOS</span>
                    <span class="sygma-embarque-rpt__foot-total">${totalPedidos}</span>
                    <span class="sygma-embarque-rpt__foot-label">TOTAL IMPORTE</span>
                    <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(varTotal, 'Q')}</span>
                </div>
            </div>
        </div>`;
}

function embarque_ejecutar_impresion(){
    document.body.classList.add('sygma-print-embarque-active');
    window.print();
    setTimeout(() => {
        document.body.classList.remove('sygma-print-embarque-active');
    }, 600);
}

function embarque_imprimir_productos(){
    const codembarque = embarque_print_codembarque;
    if (!codembarque) return;
    const host = document.getElementById('sygma_embarque_print_host');
    if (!host) return;
    embarque_print_show_loader('Generando reporte de productos...');
    Promise.all([
        GF.get_data_embarque_productos(GlobalEmpnit, codembarque),
        embarque_fetch_resumen_vendedor(codembarque)
    ])
    .then(([prodData, resumenRows]) => {
        let contador = 0;
        let varTotal = 0;
        let strRows = '';
        (prodData.recordset || []).forEach((r) => {
            contador += 1;
            varTotal += Number(r.IMPORTE) || 0;
            strRows += `
                <tr>
                    <td><span class="sygma-embarque-rpt__cod-main">${r.CODPROD}</span></td>
                    <td><span class="sygma-embarque-rpt__prod-main">${r.DESPROD}</span><span class="sygma-embarque-rpt__prod-sub">${r.DESMARCA || ''}</span></td>
                    <td class="text-center">${r.UXC}</td>
                    <td class="text-center">${r.CAJAS}</td>
                    <td class="text-center">${r.UNIDADES}</td>
                    <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(r.IMPORTE, 'Q')}</td>
                </tr>`;
        });
        if (!strRows) strRows = `<tr><td colspan="6" class="text-center text-muted py-2">Sin productos</td></tr>`;
        host.innerHTML = embarque_print_sheet_open('Productos del Embarque') + `
            <div class="table-responsive sygma-embarque-rpt__table-wrap">
                <table class="table sygma-embarque-rpt__table mb-0">
                    <thead><tr>
                        <th>CODIGO</th><th>PRODUCTO</th>
                        <th class="text-center">UXC</th><th class="text-center">CAJAS</th><th class="text-center">UNIDADES</th>
                        <th class="text-right">IMPORTE</th>
                    </tr></thead>
                    <tbody>${strRows}</tbody>
                </table>
            </div>
            <div class="sygma-embarque-rpt__total-block"><div class="sygma-embarque-rpt__total-inner">
                <span class="sygma-embarque-rpt__foot-label">ITEMS</span><span class="sygma-embarque-rpt__foot-total">${contador}</span>
                <span class="sygma-embarque-rpt__foot-label">TOTAL IMPORTE</span><span class="sygma-embarque-rpt__foot-total">${F.setMoneda(varTotal, 'Q')}</span>
            </div></div>
            ${embarque_build_resumen_vendedor_html(resumenRows)}
            ${embarque_print_sheet_close()}`;
        embarque_ejecutar_impresion();
        embarque_print_hide_loader(false);
    })
    .catch(() => {
        embarque_print_hide_loader(true);
        F.AvisoError('No se pudo generar el reporte de productos');
        host.innerHTML = '';
    });
}

function embarque_imprimir_lista_facturas(){
    const codembarque = embarque_print_codembarque;
    if (!codembarque) return;
    const host = document.getElementById('sygma_embarque_print_host');
    if (!host) return;
    embarque_print_show_loader('Generando lista de facturas...');
    Promise.all([
        GF.get_data_embarque_facturas(GlobalEmpnit, codembarque),
        embarque_fetch_resumen_vendedor(codembarque)
    ])
    .then(([facData, resumenRows]) => {
        let contador = 0;
        let varTotal = 0;
        let strRows = '';
        (facData.recordset || []).forEach((r) => {
            contador += 1;
            varTotal += Number(r.IMPORTE) || 0;
            strRows += `
                <tr>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${r.NOMEMPLEADO || ''}</span>
                        <span class="sygma-embarque-rpt__cell-sub">${r.CODDOC}-${r.CORRELATIVO}</span>
                    </td>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${F.convertDateNormal(r.FECHA)}</span>
                        <span class="sygma-embarque-rpt__cell-sub">Hora: ${r.HORA || ''}</span>
                    </td>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${r.NOMCLIE || ''}</span>
                        <span class="sygma-embarque-rpt__cell-sub">${r.DIRCLIE || ''}</span>
                    </td>
                    <td>${r.DESMUN || ''}</td>
                    <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(r.IMPORTE, 'Q')}</td>
                </tr>`;
        });
        if (!strRows) strRows = `<tr><td colspan="5" class="text-center text-muted py-2">Sin facturas</td></tr>`;
        host.innerHTML = embarque_print_sheet_open('Facturas del Embarque') + `
            <div class="table-responsive sygma-embarque-rpt__table-wrap">
                <table class="table sygma-embarque-rpt__table mb-0">
                    <thead><tr>
                        <th>VENDEDOR</th><th>FECHA</th><th>CLIENTE</th><th>MUNICIPIO</th><th class="text-right">IMPORTE</th>
                    </tr></thead>
                    <tbody>${strRows}</tbody>
                </table>
            </div>
            <div class="sygma-embarque-rpt__total-block"><div class="sygma-embarque-rpt__total-inner">
                <span class="sygma-embarque-rpt__foot-label">PEDIDOS</span><span class="sygma-embarque-rpt__foot-total">${contador}</span>
                <span class="sygma-embarque-rpt__foot-label">TOTAL IMPORTE</span><span class="sygma-embarque-rpt__foot-total">${F.setMoneda(varTotal, 'Q')}</span>
            </div></div>
            ${embarque_build_resumen_vendedor_html(resumenRows)}
            ${embarque_print_sheet_close()}`;
        embarque_ejecutar_impresion();
        embarque_print_hide_loader(false);
    })
    .catch(() => {
        embarque_print_hide_loader(true);
        F.AvisoError('No se pudo generar la lista de facturas');
        host.innerHTML = '';
    });
}

function embarque_fetch_detalle_documento(coddoc, correlativo){
    return GF.get_data_detalle_documento(GlobalEmpnit, coddoc, correlativo)
        .then((data) => data.recordset || [])
        .catch(() => []);
}

function embarque_build_doc_ticket_html(doc, lineas){
    const head = lineas[0] || {};
    const nomclie = (head.NOMCLIE || doc.NOMCLIE || '').trim();
    const direccion = embarque_format_direccion_ticket({
        DIRCLIE: head.DIRCLIE || doc.DIRCLIE,
        DESMUN: doc.DESMUN,
        DESDEPTO: doc.DESDEPTO
    });
    const telefono = (doc.TELEFONOVENDEDOR || '').trim();
    const obs = (head.DOCOBS || '').trim();
    let total = 0;
    let lineCount = 0;
    let rowsHtml = '';
    lineas.forEach((l) => {
        lineCount += 1;
        total += Number(l.TOTALPRECIO) || 0;
        rowsHtml += `<tr>
            <td>${l.CODPROD || ''}</td><td>${l.DESPROD || ''}</td>
            <td class="text-center">${l.CODMEDIDA || ''}</td>
            <td class="text-center">${l.CANTIDAD || 0}</td>
            <td class="text-right">${F.setMoneda(l.PRECIO, 'Q')}</td>
            <td class="text-right">${F.setMoneda(l.TOTALPRECIO, 'Q')}</td>
        </tr>`;
    });
    if (!rowsHtml) {
        total = Number(doc.IMPORTE) || 0;
        rowsHtml = `<tr><td colspan="6" class="text-center text-muted">Sin lineas de producto</td></tr>`;
    }
    return `
        <div class="sygma-embarque-doc-ticket">
            <div class="sygma-embarque-doc-ticket__head">
                <div class="sygma-embarque-doc-ticket__doc">${doc.CODDOC}-${doc.CORRELATIVO}</div>
                <div class="sygma-embarque-doc-ticket__meta">Embarque: ${embarque_print_codembarque}</div>
                <div class="sygma-embarque-doc-ticket__meta">${F.convertDateNormal(doc.FECHA)} · Hora: ${doc.HORA || ''}</div>
                <div class="sygma-embarque-doc-ticket__meta">Vendedor: ${doc.NOMEMPLEADO || ''}</div>
                <div class="sygma-embarque-doc-ticket__meta"><strong>No. Telefono:</strong> ${telefono || '—'}</div>
                <div class="sygma-embarque-doc-ticket__cliente"><strong>Cliente:</strong> ${nomclie || '—'}</div>
                <div class="sygma-embarque-doc-ticket__cliente"><strong>Direccion:</strong> ${direccion}</div>
            </div>
            <table class="sygma-embarque-doc-ticket__table">
                <thead><tr><th>Cod.</th><th>Producto</th><th>Med.</th><th>Cant.</th><th>Precio</th><th>Importe</th></tr></thead>
                <tbody>${rowsHtml}</tbody>
            </table>
            <div class="sygma-embarque-doc-ticket__total">
                <span>Lineas: ${lineCount}</span><span>Total: ${F.setMoneda(total, 'Q')}</span>
            </div>
            ${obs ? `<div class="sygma-embarque-doc-ticket__obs"><strong>Obs:</strong> ${obs}</div>` : ''}
        </div>`;
}

function embarque_imprimir_documentos_tickets(){
    const codembarque = embarque_print_codembarque;
    if (!codembarque) return;
    const host = document.getElementById('sygma_embarque_print_host');
    if (!host) return;
    embarque_print_show_loader('Generando documentos, espere...');
    GF.get_data_embarque_facturas(GlobalEmpnit, codembarque)
    .then((facData) => {
        const docs = facData.recordset || [];
        if (!docs.length) {
            embarque_print_hide_loader(true);
            F.AvisoError('No hay documentos en este embarque');
            return null;
        }
        return Promise.all(docs.map((doc) =>
            embarque_fetch_detalle_documento(doc.CODDOC, doc.CORRELATIVO)
                .then((lineas) => ({ doc, lineas }))
        ));
    })
    .then((items) => {
        if (!items) return;
        const ticketsHtml = items.map(({ doc, lineas }) => embarque_build_doc_ticket_html(doc, lineas)).join('');
        host.innerHTML = `<div class="sygma-embarque-print-tickets">${ticketsHtml}</div>`;
        embarque_ejecutar_impresion();
        embarque_print_hide_loader(false);
    })
    .catch(() => {
        embarque_print_hide_loader(true);
        F.AvisoError('No se pudieron generar los documentos');
        host.innerHTML = '';
    });
}

function cargar_grid_embarques(){

    let statusEmbarque = document.getElementById('cmbStatus').value;
    let mes =document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;

    tbl_embarques('tblDatalEmbarques',statusEmbarque,mes,anio);

};


function tbl_embarques(idContainer,status,mes,anio){

    let container = document.getElementById(idContainer);
    if (!container) return;
    container.innerHTML = GlobalLoader;

    let str = '';
    let conteo = 0;
    let totalImporte = 0;
    let totalDevol = 0;
    
    GF.get_data_embarques_listado(GlobalEmpnit,status,mes,anio)
    .then((data)=>{
        

        data.recordset.map((r)=>{
            conteo +=1;
            totalImporte += Number(r.IMPORTE) || 0;
            totalDevol += Number(r.DEVOLUCIONES) || 0;
            let idbtnE = `btnE${r.CODEMBARQUE}`;
            let idbtnF = `btnF${r.CODEMBARQUE}`;
            const btnFinalizarClass = status === 'NO' ? 'btn-success' : 'btn-warning';
            const btnFinalizarTitle = status === 'NO' ? 'Finalizar embarque' : 'Reactivar embarque';
            const btnFinalizarIcon = status === 'NO' ? 'fa-check' : 'fa-undo';
            str += `
                <tr>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${F.convertDateNormal(r.FECHA)}</span>
                    </td>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main text-danger">${r.CODEMBARQUE}</span>
                        <span class="sygma-embarque-rpt__cell-sub">${r.DESCRIPCION || ''}</span>
                        <span class="sygma-embarque-rpt__cell-sub">${r.RUTEO || ''}</span>
                    </td>
                    <td>${r.NOMEMPLEADO || ''}</td>
                    <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(r.IMPORTE,'Q')}</td>
                    <td class="text-right">${F.setMoneda(r.DEVOLUCIONES,'Q')}</td>
                    <td class="sygma-embarque-rpt__col-action oculto-impresion text-center">
                        <button type="button" id="${idbtnF}" class="btn ${btnFinalizarClass} btn-md btn-circle hand shadow sygma-embarques-btn-action"
                        onclick="finalizar_embarque('${r.CODEMBARQUE}','${idbtnF}')" title="${btnFinalizarTitle}">
                            <i class="fal ${btnFinalizarIcon}"></i>
                        </button>
                    </td>
                    <td class="sygma-embarque-rpt__col-action oculto-impresion text-center">
                        <button type="button" class="btn btn-info btn-md btn-circle hand shadow sygma-embarques-btn-action"
                            onclick="get_data_embarque('${r.FECHA}','${r.CODEMBARQUE}','${r.DESCRIPCION}','${r.RUTEO}','${r.CODEMPLEADO}')" title="Editar embarque">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td class="sygma-embarque-rpt__col-action oculto-impresion text-center">
                        <button type="button" class="btn btn-outline-info btn-md btn-circle hand shadow sygma-embarques-btn-action"
                            onclick="embarque_abrir_opciones_imprimir('${r.CODEMBARQUE}','${F.convertDateNormal(r.FECHA)}')" title="Imprimir embarque">
                            <i class="fal fa-print"></i>
                        </button>
                    </td>
                    <td class="sygma-embarque-rpt__col-action oculto-impresion text-center">
                        <button type="button" id="${idbtnE}" class="btn btn-danger btn-md btn-circle hand shadow sygma-embarques-btn-action"
                        onclick="eliminar_embarque('${r.CODEMBARQUE}','${idbtnE}')" title="Eliminar embarque">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });


        container.innerHTML = str || `<tr><td colspan="9" class="text-center text-muted py-3">No hay embarques en este periodo</td></tr>`;

        const lbGrid = document.getElementById('lbEmbGridTotal');
        const lbBadge = document.getElementById('lbTotalEmb');
        const estadoLabel = status === 'NO' ? 'Pendientes' : 'Finalizados';
        if (lbGrid) lbGrid.innerText = `${estadoLabel}: ${conteo}`;
        if (lbBadge) {
            lbBadge.innerText = status === 'NO' ? `Pendientes ${conteo}` : `${conteo}`;
        }

        const totalBlock = document.getElementById('lbEmbGridTotalBlock');
        if (totalBlock) {
            totalBlock.innerHTML = conteo ? `
                <div class="sygma-embarque-rpt__total-inner">
                    <span class="sygma-embarque-rpt__foot-label">TOTAL IMPORTE</span>
                    <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(totalImporte, 'Q')}</span>
                    <span class="sygma-embarque-rpt__foot-label">DEVOLUCIONES</span>
                    <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(totalDevol, 'Q')}</span>
                </div>` : '';
        }

        const txtBuscar = document.getElementById('txtBuscarEmbarques');
        if (txtBuscar?.value) F.FiltrarTabla('tblEmbarques', 'txtBuscarEmbarques');

        
    })
    .catch(()=>{
        const lbBadge = document.getElementById('lbTotalEmb');
        if (lbBadge) lbBadge.innerText = '---';
        const lbGrid = document.getElementById('lbEmbGridTotal');
        if (lbGrid) lbGrid.innerText = '---';
        const totalBlock = document.getElementById('lbEmbGridTotalBlock');
        if (totalBlock) totalBlock.innerHTML = '';
        container.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-3">No se cargaron datos</td></tr>`;
    })

};



function clean_data_embarque(){
    document.getElementById('txtEmbarqueCodigo').disabled = false;
    document.getElementById('txtEmbarqueFecha').value = F.getFecha();
    document.getElementById('txtEmbarqueCodigo').value = '';
    document.getElementById('txtEmbarqueDescripcion').value ='';
    document.getElementById('txtEmbarqueRuteo').value ='';
    const title = document.getElementById('lbEmbFormTitle');
    const ref = document.getElementById('lbEmbFormRef');
    if (title) title.textContent = 'Nuevo embarque';
    if (ref) ref.textContent = 'Complete los datos del embarque';
}

function get_data_embarque(fecha,codembarque,descripcion,ruteo,codempleado){
    document.getElementById('txtEmbarqueCodigo').disabled = true;
    document.getElementById('txtEmbarqueCodigo').value = codembarque;
    document.getElementById('txtEmbarqueDescripcion').value =descripcion;
    document.getElementById('txtEmbarqueRuteo').value =ruteo;
    document.getElementById('cmbEmbarqueEmpleado').value = codempleado;
    document.getElementById('txtEmbarqueFecha').value = fecha.replace("T00:00:00.000Z","");
    const title = document.getElementById('lbEmbFormTitle');
    const ref = document.getElementById('lbEmbFormRef');
    if (title) title.textContent = 'Editar embarque';
    if (ref) ref.textContent = `Embarque: ${codembarque}`;
    $("#modal_embarques_nuevo").modal('show');
};

function eliminar_embarque(codembarque,idbtn){

        F.Confirmacion('¿Está seguro que desea ELIMINAR este Embarque?')
        .then((value)=>{
            if(value==true){

                let btn = document.getElementById(idbtn);

                btn.innerHTML = `<i class="fal fa-trash fa-spin"></i>`;
                btn.disabled = true;

                GF.get_data_embarques_delete(codembarque,GlobalEmpnit)
                .then((datos)=>{
                    F.Aviso('Embarque eliminado exitosamente!!');

                    cargar_grid_embarques();
            
            
                })
                .catch(()=>{
                    F.AvisoError('No se pudo ELIMINAR');

                    btn.innerHTML = `<i class="fal fa-trash"></i>`;
                    btn.disabled = true;
    
                })



            }
        })


};

function finalizar_embarque(codembarque,idbtn){
    const statusActual = document.getElementById('cmbStatus').value;
    if (statusActual === 'NO') {
        embarque_abrir_modal_finalizar(codembarque, idbtn);
        return;
    }

    const btn = document.getElementById(idbtn);
    const st = 'NO';
    const strMsg = '¿Está seguro que desea VOLVER A ACTIVAR este Embarque?';

    F.Confirmacion(strMsg)
    .then((value)=>{
        if(value==true){
            btn.disabled = true;
            btn.innerHTML = `<i class="fal fa-spin fa-check"></i>`;
            GF.get_data_embarques_finalizar(codembarque,GlobalEmpnit,st)
            .then(()=>{
                F.Aviso('Embarque cambiado exitosamente!!');
                cargar_grid_embarques();
            })
            .catch(()=>{
                F.AvisoError('No se pudo actualizar');
                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-check"></i>`;
            });
        }
    });
};


//------------------------
// EMBARQUES
//------------------------



//------------
// SELL OUT
//------------


function tbl_rpt_sellout(){

    let fi = F.devuelveFecha('txtSFechaInicial');
    let ff = F.devuelveFecha('txtSFechaFinal');


    let container = document.getElementById('tblDataSellout');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

    let sucursal = GlobalEmpnit; //document.getElementById('cmbSucursal').value;

   
    RPT.data_sellout(sucursal,fi,ff)
    .then((data)=>{

   
        let str = '';

        data.recordset.map((r)=>{
        
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            str += `
                                    <tr>
                                        <td>${r.RELOP}</td>
                                        <td>${r.TRANSACCION}</td>
                                        <td>${F.convertDateNormal(r.FECHA)}</td>
                                        <td>${r.CODIGO_CLIENTE}</td>
                                        <td>${r.TIPONEGOCIO} ${F.limpiarTextoExport(r.NEGOCIO)} - ${F.limpiarTextoExport(r.CLIENTE)}</td>
                                        <td>DETALLE</td>
                                        <td>${r.CODIGO_VENDEDOR}</td>
                                        <td>${r.VENDEDOR}</td>
                                        <td>${r.CATEGORIA}</td>
                                        <td>${r.MARCA}</td>
                                        <td>${r.CODIGO_RUTA}</td>
                                        <td>GUATEMALA</td>
                                        <td>${r.GEO2_DEPARTAMENTO}</td>
                                        <td>${r.GEO3_MUNICIPIO}</td>
                                        <td>${r.GEO4_ALDEA_CASERIO}</td>
                                        <td>${F.limpiarTextoExport(r.PRODUCTO)}</td>
                                        <td>${r.CODIGO_DUN}</td>
                                        <td>${r.CODIGO_BARRA_EAN}</td>
                                        <td>${F.limpiarTextoExport(r.DESCRIPCION_PRODUCTO)}</td>
                                        <td>${r.VENTA_EN_CANTIDAD}</td>
                                        <td>${r.FACTOR}</td>
                                        <td>${r.UNIDADES_POR_CAJA}</td>
                                        <td>${r.MEDIDA}</td>
                                        <td>${F.setMoneda(r.VENTA_EN_QUETZALES,'Q')}</td>
                                        <td>${r.FACTURA_SAT_SERIE} - ${r.FACTURA_SAT_NUMERO}</td>
                                    </tr>
            `
        })
        container.innerHTML = str;
       
        //document.getElementById('lbTotalMImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((err)=>{
       

        container.innerHTML = 'No se cargaron datos....';
       
        //document.getElementById('lbTotalMImporte').innerText = '';
    })



};

//------------
// SELL OUT
//------------





//----------------------
//  TIPO PRECIO PICKING
//----------------------



function tbl_facturas_tipo_precio(){

    let container = document.getElementById('data_tblFTipoPrecio');
    container.innerHTML = GlobalLoader;

    let codembarque = document.getElementById('cmbFEmbarques').value;
    let contador = 0;
    let varTotal = 0;

    embarque_rpt_syncEncabezado(codembarque, 'lbTpCodembarque', 'lbTpFechaEmbarque');
    
    GF.get_data_embarque_tipo_precios(GlobalEmpnit,codembarque)
    .then((data)=>{
        let str = '';

        data.recordset.map((r)=>{
            contador += 1;
            varTotal += Number(r.PRECIO) * Number(r.CANTIDAD);
            str += `
                <tr>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${r.NOMEMPLEADO}</span>
                    </td>
                    <td class="sygma-embarque-rpt__cell-sub">${r.CODDOC}-${r.CORRELATIVO}</td>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${r.NOMCLIE}</span>
                    </td>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${r.DESPROD}</span>
                    </td>
                    <td class="text-center">${r.CANTIDAD} ${r.CODMEDIDA}</td>
                    <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(r.PRECIO,'Q')}</td>
                    <td class="text-center sygma-embarque-rpt__cell-main text-danger">${r.TIPOPRECIO}</td>
                    <td class="sygma-embarque-rpt__col-action oculto-impresion">
                        <button class="btn btn-md btn-circle btn-warning hand shadow"
                        onclick="get_detalle_pedido('${r.CODDOC}','${r.CORRELATIVO}')">
                            <i class="fal fa-list"></i>
                        </button>
                    </td>
                    <td class="sygma-embarque-rpt__col-action oculto-impresion">
                        <button class="btn btn-md btn-circle btn-info hand shadow"
                        onclick="fcn_editar_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.NOMCLIE}','${r.DIRCLIE}')">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                </tr>
                    `
        })
        container.innerHTML = str;

        const lbItems = document.getElementById('lbTpTotalItems');
        if (lbItems) lbItems.innerText = `Items: ${contador}`;

        const totalBlock = document.getElementById('lbTpTotalBlock');
        if (totalBlock) {
            totalBlock.innerHTML = `
                <div class="sygma-embarque-rpt__total-inner">
                    <span class="sygma-embarque-rpt__foot-label">TOTAL IMPORTE</span>
                    <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(varTotal, 'Q')}</span>
                </div>`;
        }

    })
    .catch(()=>{
        container.innerHTML = '<tr><td colspan="9" class="text-center text-muted py-3">No se cargaron datos.</td></tr>';
        const lbItems = document.getElementById('lbTpTotalItems');
        if (lbItems) lbItems.innerText = '';
        const totalBlock = document.getElementById('lbTpTotalBlock');
        if (totalBlock) totalBlock.innerHTML = '';
    })




};





//----------------------
//  TIPO PRECIO PICKING
//----------------------