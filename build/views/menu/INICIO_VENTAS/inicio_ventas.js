var ventas_currentPane = 'uno';
var ventas_embedDestroy = null;

var VENTAS_EMBED_BASE = '../views/menu/INICIO_VENTAS/';
var VENTAS_EMBED_SCRIPTS = {
    btnMenuAvancePG: VENTAS_EMBED_BASE + 'view_avance_procter_vendedor.js',
    btnMenuNuevoPedido: VENTAS_EMBED_BASE + 'view_pedidos.js',
    btnMenuCenso: VENTAS_EMBED_BASE + 'view_censo.js',
};

function ventas_getMes() {
    return document.getElementById('cmbMesHeader')?.value || F.get_mes_curso();
}

function ventas_getAnio() {
    return document.getElementById('cmbAnioHeader')?.value || F.get_anio_curso();
}

function ventas_onHeaderFiltersChange() {
    if (selected_tab) cargar_grid();
    if (ventas_currentPane === 'uno') ventas_loadDashboard();
    if (typeof window.proveedor_embedRefresh === 'function') window.proveedor_embedRefresh();
    if (ventas_currentPane === 'ocho' && typeof ventas_cxc_cargar_listado === 'function') {
        const alcance = document.getElementById('ventasCxcAlcance')?.value || 'MES';
        if (alcance !== 'TODAS') ventas_cxc_cargar_listado();
    }
}

function ventas_getSucursal() {
    return GlobalEmpnit || document.getElementById('cmbSucursalHeader')?.value || '%';
}

function proveedor_getSucursal() {
    return ventas_getSucursal();
}

function proveedor_getMes() {
    return ventas_getMes();
}

function proveedor_getAnio() {
    return ventas_getAnio();
}

var ventas_dashboardCharts = {};

function ventas_setupSucursalHeader() {
    const cmb = document.getElementById('cmbSucursalHeader');
    if (!cmb) return;
    const emp = GlobalEmpnit || '%';
    const nom = GlobalNomEmpresa || 'Sede';
    cmb.innerHTML = `<option value="${emp}">${nom}</option>`;
    cmb.value = emp;
    cmb.disabled = true;
}

function ventas_setActiveCard(cardId) {
    document.querySelectorAll('.proveedor-menu-card').forEach(el => {
        el.classList.toggle('proveedor-menu-card--active', !!cardId && el.id === cardId);
    });
}

function ventas_toggleSidebar(forceOpen) {
    const sidebar = document.getElementById('ventasSidebar');
    const backdrop = document.getElementById('ventasSidebarBackdrop');
    if (!sidebar) return;
    const open = typeof forceOpen === 'boolean' ? forceOpen : !sidebar.classList.contains('proveedor-sidebar--open');
    sidebar.classList.toggle('proveedor-sidebar--open', open);
    backdrop?.classList.toggle('proveedor-sidebar-backdrop--visible', open);
    document.body.classList.toggle('proveedor-sidebar-open', open);
}

function ventas_closeSidebarMobile() {
    if (window.innerWidth < 768) ventas_toggleSidebar(false);
}

function ventas_showPanel(paneId, cardId, afterShow) {
    ventas_currentPane = paneId;
    ventas_closeSidebarMobile();
    ventas_teardownEmbed();
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
    ventas_setActiveCard(cardId);
    if (typeof afterShow === 'function') afterShow();
}

function ventas_showHome() {
    ventas_showPanel('uno', 'btnMenuHome');
    ventas_loadDashboard(false);
}

function ventas_teardownEmbed() {
    if (ventas_embedDestroy) {
        try { ventas_embedDestroy(); } catch (e) { /* vista embebida sin teardown */ }
        ventas_embedDestroy = null;
    }
    document.querySelector('script[data-ventas-embed]')?.remove();
    const embed = document.getElementById('ventasPanelEmbed');
    if (embed) {
        embed.classList.add('d-none');
        embed.innerHTML = '';
    }
    document.getElementById('myTabHomeContent')?.classList.remove('d-none');
    if (window._ventasCore) {
        window.initView = window._ventasCore.initView;
        window.destroyView = window._ventasCore.destroyView;
    }
}

function ventas_rewireEmbedActions(container) {
    if (!container) return;
    container.querySelectorAll('[data-spa-action="inicio"]').forEach(btn => btn.remove());
    container.querySelectorAll('button.btn-bottom-l').forEach(btn => {
        if (!btn.hasAttribute('data-dismiss') && !btn.hasAttribute('data-ventas-keep')) btn.remove();
    });
}

function ventas_loadEmbed(scriptUrl, cardId) {
    ventas_closeSidebarMobile();
    ventas_teardownEmbed();
    document.getElementById('myTabHomeContent')?.classList.add('d-none');
    ventas_setActiveCard(cardId || null);
    const embed = document.getElementById('ventasPanelEmbed');
    embed.classList.remove('d-none');
    embed.innerHTML = GlobalLoader;

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = scriptUrl + (scriptUrl.includes('?') ? '&' : '?') + '_ve=' + Date.now();
        script.setAttribute('data-ventas-embed', 'true');
        script.onload = () => {
            const embedRoot = embed;
            const savedRoot = root;
            root = embedRoot;
            if (typeof initView === 'function') {
                initView();
                ventas_embedDestroy = typeof destroyView === 'function' ? destroyView : null;
            }
            root = savedRoot;
            if (window._ventasCore) {
                window.initView = window._ventasCore.initView;
                window.destroyView = window._ventasCore.destroyView;
            }
            ventas_rewireEmbedActions(embedRoot);
            resolve();
        };
        script.onerror = () => reject(new Error('No se pudo cargar: ' + scriptUrl));
        document.getElementById('root').appendChild(script);
    });
}

function ventas_bindEmbedMenu(cardId) {
    const scriptUrl = VENTAS_EMBED_SCRIPTS[cardId];
    if (!scriptUrl) return;
    document.getElementById(cardId)?.addEventListener('click', () => {
        ventas_loadEmbed(scriptUrl, cardId);
    });
}

function getView(){
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
                            <h5 class="negrita text-white mb-0">INICIO VENTAS</h5>
                            <small class="text-white-50 negrita d-block" id="lbVentasEmpresa"></small>
                        </div>
                        <div class="col">
                            <select class="form-control form-control-sm negrita" id="cmbSucursalHeader"></select>
                        </div>
                        <div class="col-12 col-md-auto pl-md-2 ventas-header-periodo">
                            <div class="d-flex ventas-header-periodo__row">
                                <select class="form-control form-control-sm negrita mr-1" id="cmbMesHeader"></select>
                                <select class="form-control form-control-sm negrita" id="cmbAnioHeader"></select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="btn proveedor-menu-toggle d-md-none" id="btnVentasMenuToggle" title="Menú de opciones">
                <i class="fal fa-bars"></i><span>Menú</span>
            </button>
            <div class="proveedor-sidebar-backdrop d-md-none" id="ventasSidebarBackdrop"></div>

            <div class="row proveedor-main-row">
                <div class="col-12 col-md-2 proveedor-sidebar" id="ventasSidebar">
                    <div class="proveedor-sidebar__scroll">
                        ${view.menu()}
                    </div>
                </div>
                <div class="col-12 col-md-10 proveedor-tab-area">
                    <div id="ventasPanelContent">
                    <div id="ventasPanelEmbed" class="d-none"></div>
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_inicio()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_ventas()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_productos()}
                        </div>
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_marcas()}
                        </div>
                        <div class="tab-pane fade" id="cinco" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_categorias() + view.modal_categorias_marca()}
                        </div>
                        <div class="tab-pane fade" id="seis" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_goles()}
                        </div>
                        <div class="tab-pane fade" id="siete" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_cobertura()}
                        </div>
                        <div class="tab-pane fade" id="ocho" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_creditos_pendientes()}
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
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-ocho" data-toggle="tab" href="#ocho" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>
                    </ul>

                ${view.vista_creditos_modales()}
                ${view.modal_detalle_documento()}
            </div>
            `
        },
        vista_inicio:()=>{
            return `
            <div class="ventas-dashboard mb-2">
                <div class="d-flex flex-wrap align-items-center justify-content-between mb-1 ventas-dashboard-toolbar">
                    <h6 class="negrita text-base mb-0 ventas-dashboard-toolbar__title">Resumen del mes</h6>
                    <div class="d-flex align-items-center ventas-dashboard-toolbar__actions">
                        <small class="text-muted mr-2 d-none d-sm-inline ventas-dashboard-toolbar__cache" id="lbVentasDashCacheInfo"></small>
                        <button type="button" class="btn btn-outline-secondary btn-sm hand shadow py-0 px-2" id="btnActualizarDashboard" title="Actualizar datos del dashboard">
                            <i class="fal fa-sync"></i> Actualizar
                        </button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-lg-6 mb-2">
                        <div class="card card-rounded shadow h-100 ventas-dashboard-card">
                            <div class="card-body py-2 px-2">
                                <h6 class="negrita text-base mb-2 ventas-dashboard-card__title">Ventas FAC y devoluciones DEV por día</h6>
                                <div class="ventas-dashboard-chart ventas-dashboard-chart--line mb-2">
                                    <canvas id="chartVentasDia"></canvas>
                                </div>
                                <small class="negrita text-danger d-block" id="lbVentasDashDiaTotal">Total mes: --</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 mb-2">
                        <div class="card card-rounded shadow h-100 ventas-dashboard-card">
                            <div class="card-body py-2 px-2">
                                <h6 class="negrita text-secondary mb-2 ventas-dashboard-card__title">Ventas por marca (FAC)</h6>
                                <div class="ventas-dashboard-chart ventas-dashboard-chart--bar mb-2">
                                    <canvas id="chartVentasMarcas"></canvas>
                                </div>
                                <small class="negrita text-danger d-block" id="lbVentasDashMarcasTotal">Total mes: --</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card card-rounded shadow col-12 bg-base mb-2 ventas-welcome-card">
                <div class="card-body py-2 px-3 text-center">
                    <h6 class="text-white mb-1">Bienvenido</h6>
                    <h5 class="text-white negrita mb-1">${GlobalUsuario}</h5>
                    <div id="ventasCheckInStatus" class="ventas-checkin-status">
                        <span class="badge badge-light ventas-checkin-status__badge" id="lbVentasCheckInStatus">
                            <i class="fal fa-spinner fa-spin"></i> Verificando check-in...
                        </span>
                    </div>
                </div>
            </div>
            <button class="btn btn-outline-danger btn-circle btn-xl hand shadow btn-bottom-l" id="btnIniciarCheckIn">
                <i class="fal fa-street-view"></i>
            </button>
            <button class="btn btn-outline-info btn-circle btn-xl hand shadow btn-bottom-ml" id="btnFinalizarCheckIn">
                <i class="fal fa-upload"></i>
            </button>
            `
        },
        menu:()=>{
            const items = [
                { id: 'btnMenuHome', label: 'Inicio', icon: 'fa-home', color: 'primary' },
                { id: 'btnMenuAvancePG', label: 'Avance P&G', icon: 'fa-folder-open', color: 'danger' },
                { id: 'btnMenuNuevoPedido', label: 'Nuevo pedido', icon: 'fa-shopping-cart', color: 'info' },
                { id: 'btnMenuCenso', label: 'Crear clientes (censo)', icon: 'fa-users', color: 'info' },
                { id: 'btnMenuRptMarcas', label: 'Reporte marcas', icon: 'fa-list', color: 'secondary' },
                { id: 'btnMenuRptCategorias', label: 'Objetivos categorías', icon: 'fa-chart-bar', color: 'secondary' },
                { id: 'btnMenuRptDocumentos', label: 'Reporte facturas', icon: 'fa-chart-pie', color: 'secondary' },
                { id: 'btnMenuRptProductos', label: 'Reporte productos', icon: 'fa-box', color: 'secondary' },
                { id: 'btnMenuRptGoles', label: 'Goles y cobertura', icon: 'fa-futbol', color: 'secondary' },
                { id: 'btnMenuRptHistorial', label: 'Historial clientes', icon: 'fa-user', color: 'secondary' },
                { id: 'btnMenuCreditosPendientes', label: 'Creditos pendientes', icon: 'fa-dollar-sign', color: 'warning' },
            ];
            return items.map(item => `
                <div class="card proveedor-menu-card hand" id="${item.id}">
                    <div class="card-body d-flex align-items-center flex-wrap">
                        <i class="fal ${item.icon} text-${item.color} mr-2 proveedor-menu-icon"></i>
                        <span class="negrita proveedor-menu-label">${item.label}</span>
                    </div>
                </div>
            `).join('');
        },
        vista_creditos_pendientes:()=>{
            return `
            <div class="sygma-embarque-rpt card card-rounded shadow-sm col-12 border-0" id="rpt_ventas_cuentas_cobrar">
                <div id="ventasCxcLoaderOverlay" class="cxc-loader-overlay d-none">
                    <div class="cxc-loader-overlay__box">
                        ${GlobalLoader}
                        <div class="cxc-loader-overlay__text">Procesando...</div>
                    </div>
                </div>
                <div class="card-body sygma-embarque-rpt__body p-2 p-md-3">
                    <header class="sygma-embarque-rpt__header">
                        <div class="sygma-embarque-rpt__brand">
                            <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="44" height="44" alt="Logo">
                            <div class="sygma-embarque-rpt__brand-text">
                                <h4 class="sygma-embarque-rpt__title mb-0">Créditos pendientes</h4>
                                <span class="sygma-embarque-rpt__embarque-date">Mis facturas al crédito con saldo pendiente</span>
                            </div>
                        </div>
                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                            <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbVentasCxcTotalDocs">Docs: 0</span>
                            <button type="button" class="btn btn-info btn-md btn-circle hand shadow sygma-embarque-rpt__print-btn" title="Imprimir" onclick="F.imprimirSelec('rpt_ventas_cuentas_cobrar')">
                                <i class="fal fa-print"></i>
                            </button>
                        </div>
                    </header>
                    <div class="sygma-embarque-rpt__toolbar sygma-embarques-filtros oculto-impresion">
                        <div class="sygma-embarques-filtros__row">
                            <div class="sygma-embarques-filtros__field">
                                <label class="sygma-embarques-filtros__label" for="ventasCxcAlcance">Alcance</label>
                                <select class="form-control sygma-embarques-filtros__select" id="ventasCxcAlcance">
                                    <option value="MES">POR MES</option>
                                    <option value="TODAS">TODAS</option>
                                </select>
                            </div>
                            <div class="sygma-embarques-filtros__field d-flex align-items-end">
                                <button type="button" class="btn btn-base btn-sm hand" id="btnVentasCxcRecargar">
                                    <i class="fal fa-sync mr-1"></i> Actualizar
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="sygma-embarque-rpt__toolbar oculto-impresion mb-2">
                        <input type="search" class="form-control sygma-embarque-rpt__search"
                            placeholder="Buscar documento, cliente, NIT..."
                            oninput="F.FiltrarTabla('tblVentasCxcDocumentos','txtVentasCxcBuscar')"
                            id="txtVentasCxcBuscar">
                    </div>
                    <div class="table-responsive sygma-embarque-rpt__table-wrap cxc-ventas-table-wrap">
                        <table class="table sygma-embarque-rpt__table cxc-ventas-table mb-0" id="tblVentasCxcDocumentos">
                            <thead>
                                <tr>
                                    <th>FECHA</th>
                                    <th>DOCUMENTO</th>
                                    <th>NIT</th>
                                    <th>CLIENTE</th>
                                    <th>VENCIMIENTO</th>
                                    <th class="text-right">IMPORTE</th>
                                    <th class="text-right">DESCUENTO</th>
                                    <th class="text-right">A PAGAR</th>
                                    <th class="text-right">ABONOS</th>
                                    <th class="text-right">SALDO</th>
                                    <th class="text-center">DIAS CREDITO</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataVentasCxcDocumentos"></tbody>
                        </table>
                    </div>
                    <div class="sygma-embarque-rpt__total-block" id="lbVentasCxcTotalBlock"></div>
                </div>
            </div>`;
        },
        vista_creditos_modales:()=>{
            return `
            <div class="modal fade" id="modalVentasCxcHistorial" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2">
                            <h5 class="modal-title text-white negrita mb-0" id="lbVentasCxcHistorialTitulo">Historial de abonos</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span aria-hidden="true">&times;</span></button>
                        </div>
                        <div class="modal-body p-2 p-md-3">
                            <div class="table-responsive">
                                <table class="table table-sm table-striped mb-0">
                                    <thead><tr><th>FECHA</th><th>TIPO</th><th>DOCUMENTO</th><th class="text-right">MONTO</th><th>FORMA PAGO</th><th>USUARIO</th></tr></thead>
                                    <tbody id="tblVentasCxcHistorialBody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        },
        rpt_ventas: ()=>{
            return `
            <div class="card card-rounded shadow mb-2 ventas-facturas-toolbar">
                <div class="card-body py-2 px-2">
                    <div class="row align-items-end no-gutters">
                        <div class="col-12 col-lg-7">
                            <h6 class="negrita text-base mb-1 ventas-facturas-toolbar__title">Listado de Facturas</h6>
                            <div class="row no-gutters">
                                <div class="col-6 col-sm-4 col-md-3 pr-1">
                                    <div class="form-group mb-0 ventas-facturas-toolbar__field">
                                        <label class="negrita text-secondary mb-0 ventas-facturas-toolbar__label">Fecha inicio</label>
                                        <input type="date" class="form-control form-control-sm negrita text-danger" id="txtDocFechaInicial">
                                    </div>
                                </div>
                                <div class="col-6 col-sm-4 col-md-3 pl-1">
                                    <div class="form-group mb-0 ventas-facturas-toolbar__field">
                                        <label class="negrita text-secondary mb-0 ventas-facturas-toolbar__label">Fecha final</label>
                                        <input type="date" class="form-control form-control-sm negrita text-danger" id="txtDocFechaFinal">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-lg-5 mt-1 mt-lg-0">
                            <div class="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-end ventas-facturas-resumen">
                                <div class="mr-lg-2 mb-1 mb-lg-0 ventas-facturas-toolbar__totales">
                                    <small class="d-block negrita text-info" id="lbFacTotalPedidos">Pedidos:</small>
                                    <small class="negrita text-danger d-block" id="lbFacTotalImporte">Importe:</small>
                                </div>
                                <button type="button" class="btn btn-outline-secondary btn-sm hand shadow py-0 px-2" id="btnRecargarListaFacturas" title="Recargar lista">
                                    <i class="fal fa-sync"></i> Recargar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="table-responsive sygma-ventas-facturas-table">
                <table class="table table-sm table-bordered mb-0" id="tblFFacturas">
                    <thead class="bg-secondary text-white negrita">
                        <tr>
                            <td>DOCUMENTO</td>
                            <td>FECHA</td>
                            <td>CLIENTE</td>
                            <td class="d-none d-md-table-cell">MUNICIPIO</td>
                            <td class="text-right">IMPORTE</td>
                            <td class="text-center sygma-facturas-acciones-col">ACCIONES</td>
                        </tr>
                    </thead>
                    <tbody id="tblDataFFacturas"></tbody>
                </table>
            </div>
            `
        },
        modal_detalle_documento:()=>{
            return `
            <div id="modal_detalle_pedido" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-base d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white">Detalle del Documento</h4>
                        </div>
                        <div class="modal-body p-4">
                            <div class="card card-rounded">
                                <div class="card-body p-2">
                                    <h4 class="negrita text-base" id="lbDetalleTomarDatosNombre"></h4>
                                    <br>
                                    <div class="table-responsive col-12">
                                        <table class="table table-bordered table-hover table-sm">
                                            <thead class="bg-verde text-white">
                                                <tr>
                                                    <td>CODIGO</td>
                                                    <td>PRODUCTO</td>
                                                    <td>TIPOP</td>
                                                    <td>MEDIDA</td>
                                                    <td>CANTIDAD</td>
                                                    <td>PRECIO</td>
                                                    <td>IMPORTE</td>
                                                </tr>
                                            </thead>
                                            <tbody id="tblDataDetallePedido"></tbody>
                                            <tfoot class="bg-secondary negrita text-white">
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td id="lbFtotalCantidad"></td>
                                                    <td></td>
                                                    <td id="lbFtotalImporte"></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                        <div class="form-group mb-0">
                                            <label class="negrita text-base">Observaciones</label>
                                            <textarea class="form-control negrita" id="txtDetallePedidoObs" rows="3"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <button type="button" class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                    <i class="fal fa-arrow-left"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        },
        rpt_marcas:()=>{

            return `
            <div class="card card-rounded shadow mb-2 ventas-marcas-toolbar">
                <div class="card-body py-2 px-2">
                    <div class="row align-items-end no-gutters">
                        <div class="col-12 col-md-9 col-lg-10">
                            <h6 class="negrita text-base mb-1 ventas-marcas-toolbar__title">Reporte de Marcas</h6>
                            <div class="row no-gutters ventas-marcas-toolbar__fechas">
                                <div class="col-6 col-sm-5 col-md-4 pr-1">
                                    <div class="form-group mb-0 ventas-marcas-toolbar__field">
                                        <label class="negrita text-secondary mb-0 ventas-marcas-toolbar__label">Fecha inicio</label>
                                        <input type="date" class="form-control form-control-sm negrita text-danger" id="txtMarcaFechaInicial">
                                    </div>
                                </div>
                                <div class="col-6 col-sm-5 col-md-4 pl-1">
                                    <div class="form-group mb-0 ventas-marcas-toolbar__field">
                                        <label class="negrita text-secondary mb-0 ventas-marcas-toolbar__label">Fecha final</label>
                                        <input type="date" class="form-control form-control-sm negrita text-danger" id="txtMarcaFechaFinal">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-3 col-lg-2 mt-1 mt-md-0 text-md-right ventas-marcas-toolbar__total">
                            <small class="negrita text-danger d-block" id="lbMarcaTotalImporte">Importe:</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="table-responsive sygma-ventas-marcas-table">
                <table class="table table-sm table-bordered mb-0 h-full col-12" id="tblMarcas">
                    <thead class="bg-success text-white negrita">
                        <tr>
                            <td>MARCA</td>
                            <td>IMPORTE</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody id="tblDataMarcas"></tbody>
                </table>
            </div>
            `

        },
        rpt_categorias:()=>{

            return `
            <div class="card card-rounded col-12 ventas-categorias-panel mb-2">
                <div class="card-body py-2 px-2">
                    <div class="row align-items-start no-gutters mb-1 ventas-categorias-header">
                        <div class="col-12 col-md-auto pr-md-2">
                            <h6 class="negrita text-base mb-1 ventas-categorias-toolbar__title">Logro por Categoria</h6>
                        </div>
                        <div class="col-12 col-md">
                            <small class="negrita text-info d-block mb-1">Objetivos</small>
                            <div class="ventas-categorias-objetivos">
                                <div class="ventas-categorias-objetivos__item">
                                    <small class="negrita text-secondary ventas-categorias-objetivos__label">Logrado:</small>
                                    <div class="ventas-categorias-progress" id="lbObjLogrado"></div>
                                </div>
                                <div class="ventas-categorias-objetivos__item">
                                    <small class="negrita text-secondary ventas-categorias-objetivos__label">Faltan:</small>
                                    <div class="ventas-categorias-progress" id="lbObjLogradoFalta"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive sygma-ventas-categorias-table">
                        <table class="table table-sm table-bordered mb-0 h-full col-12">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>MARCA</td>
                                    <td>IMPORTE</td>
                                    <td>OBJETIVO</td>
                                    <td>FALTA</td>
                                    <td>ALCANCE</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataMarcas2">
                            </tbody>
                            <tfoot class="bg-base text-white negrita">
                                <tr>
                                    <td></td>
                                    <td id="lbTotalMarcasImporte"></td>
                                    <td id="lbTotalMarcasObjetivo"></td>
                                    <td id="lbTotalMarcasFalta"></td>
                                    <td id="lbTotalMarcasLogro"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            `

        },
        modal_categorias_marca:()=>{
            return `
              <div id="modal_categorias_marca" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="lbMarcasDescategoria">
                                
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                    <div class="table-responsive">
                                        <table class="table table-bordered h-full col-12">
                                            <thead class="bg-base text-white"> 
                                                <tr>
                                                    <td>CATEGORIA</td>
                                                    <td>LOGRO</td>
                                                    <td>OBJETIVO</td>
                                                    <td>FALTAN</td>
                                                    <td></td>
                                                </tr>
                                            </thead>
                                            
                                            <tbody id="tblDataCategoriasMarca">
                                            </tbody>
                                            
                                            <tfoot class="bg-base text-white"> 
                                                <tr>
                                                    <td></td>
                                                    <td id="lbTotalMarcaLogro"></td>
                                                    <td id="lbTotalMarcaObjetivo"></td>
                                                    <td  id="lbTotalMarcaFaltan"></td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>

                                        </table>
                                    </div>

                                </div>
                            </div>

                                
                            <div class="row">
                                <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                    <i class="fal fa-arrow-left"></i>
                                </button>
                            </div>

                        </div>
                    
                    </div>
                </div>
            </div>
            `
        },
        rpt_productos:()=>{
            return `
            <div class="card card-rounded shadow mb-2 ventas-productos-toolbar">
                <div class="card-body py-2 px-2">
                    <div class="row align-items-end no-gutters">
                        <div class="col-12 col-md-9 col-lg-10">
                            <h6 class="negrita text-base mb-1 ventas-productos-toolbar__title">Productos vendidos</h6>
                            <div class="row no-gutters ventas-productos-toolbar__fechas">
                                <div class="col-6 col-sm-5 col-md-4 pr-1">
                                    <div class="form-group mb-0 ventas-productos-toolbar__field">
                                        <label class="negrita text-secondary mb-0 ventas-productos-toolbar__label">Fecha inicio</label>
                                        <input type="date" class="form-control form-control-sm negrita text-danger" id="txtProdFechaInicial">
                                    </div>
                                </div>
                                <div class="col-6 col-sm-5 col-md-4 pl-1">
                                    <div class="form-group mb-0 ventas-productos-toolbar__field">
                                        <label class="negrita text-secondary mb-0 ventas-productos-toolbar__label">Fecha final</label>
                                        <input type="date" class="form-control form-control-sm negrita text-danger" id="txtProdFechaFinal">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-3 col-lg-2 mt-1 mt-md-0 text-md-right ventas-productos-toolbar__total">
                            <small class="d-block negrita text-info" id="lbProdTotalPedidos">Pedidos:</small>
                            <small class="negrita text-danger d-block" id="lbProdTotalImporte">Importe:</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group mb-1 px-1">
                <input type="text"
                id="txtBuscarProductos"
                class="form-control form-control-sm border-info"
                placeholder="Buscar producto..."
                oninput="F.FiltrarTabla('tblFProductos','txtBuscarProductos')">
            </div>
            <div class="table-responsive sygma-ventas-productos-table">
                <table class="table table-sm table-bordered mb-0 h-full col-12" id="tblFProductos">
                    <thead class="bg-secondary text-white negrita">
                        <tr>
                            <td>CODIGO</td>
                            <td>PRODUCTO</td>
                            <td class="d-none d-md-table-cell">UXC</td>
                            <td>CAJAS</td>
                            <td>UNIDADES</td>
                            <td class="text-right">IMPORTE</td>
                        </tr>
                    </thead>
                    <tbody id="tblDataFProductos"></tbody>
                </table>
            </div>
            `
        },
        rpt_goles:()=>{
            return `
            <div class="card card-rounded col-12 ventas-goles-panel mb-2">
                <div class="card-body py-2 px-2">
                    <div class="d-flex flex-wrap align-items-center justify-content-between mb-2 ventas-goles-header">
                        <h6 class="negrita text-base mb-0 ventas-goles-toolbar__title">LOGRO DE GOLES Y COBERTURA DEL MES</h6>
                        <div class="ventas-goles-total text-right">
                            <small class="d-block text-secondary mb-0">Total Goles:</small>
                            <span class="negrita text-danger ventas-goles-total__value" id="lbTotalGoles"></span>
                        </div>
                    </div>

                    <div class="row no-gutters ventas-goles-tables">
                        <div class="col-12 col-lg-6 pr-lg-1 mb-2 mb-lg-0">
                            <div class="table-responsive sygma-ventas-goles-table sygma-ventas-goles-table--marcas">
                                <table class="table table-sm table-bordered mb-0 h-full col-12">
                                    <thead class="bg-primary text-white">
                                        <tr>
                                            <td>MARCA</td>
                                            <td>VISIT.</td>
                                            <td>GOLES</td>
                                            <td>IMPORTE</td>
                                            <td>SKU</td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataMarcasEmpleadoCobertura">
                                    </tbody>
                                    <tfoot class="bg-primary text-white">
                                        <tr>
                                            <td></td>
                                            <td id="lbTotalMarcaVisitadosEmpleado"></td>
                                            <td id="lbTotalMarcaGolesEmpleado"></td>
                                            <td id="lbTotalMarcaImporteEmpleado"></td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        <div class="col-12 col-lg-6 pl-lg-1">
                            <div class="form-group mb-1">
                                <input type="text" class="form-control form-control-sm border-info text-info"
                                id="txtBuscarGoles"
                                placeholder="Buscar producto..."
                                oninput="F.FiltrarTabla('tblGoles','txtBuscarGoles')">
                            </div>
                            <div class="table-responsive sygma-ventas-goles-table sygma-ventas-goles-table--productos">
                                <table class="table table-sm table-hover table-bordered mb-0" id="tblGoles">
                                    <thead class="bg-primary text-white">
                                        <tr>
                                            <td>PRODUCTO</td>
                                            <td class="text-right">GOLES</td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataGoles">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        },
        modal:()=>{
            return `
              <div id="modal_" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                TITULO
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-2">

                                </div>
                            </div>

                                
                            <div class="row">
                                <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                    <i class="fal fa-arrow-left"></i>
                                </button>
                            </div>

                        </div>
                    
                    </div>
                </div>
            </div>
            `
        },
        rpt_cobertura:()=>{
            return `
            <div class="ventas-historial-panel">
                <div class="d-flex flex-wrap align-items-center justify-content-between mb-1 ventas-historial-toolbar">
                    <h6 class="negrita text-base mb-0 ventas-historial-toolbar__title">Historial de clientes visitados</h6>
                    <small class="negrita text-danger mb-0" id="lbEmpleadoTotal"></small>
                    <h3 class="hidden negrita text-base mb-0" id="lbEmpleadox"></h3>
                </div>
                <div class="card card-rounded ventas-historial-card mb-0">
                    <div class="card-body py-2 px-2">
                        <div class="form-group mb-1">
                            <input type="text"
                            id="txtBuscarEmpleado"
                            class="form-control form-control-sm border-info"
                            placeholder="Buscar cliente..."
                            oninput="F.FiltrarTabla('tblEmpleado','txtBuscarEmpleado')">
                        </div>
                        <div class="table-responsive sygma-ventas-historial-table">
                            <table class="table table-sm table-bordered mb-0 h-full col-12" id="tblEmpleado">
                                <thead class="bg-base text-white">
                                    <tr>
                                        <td class="sygma-historial-col-visita d-none d-sm-table-cell">VIS.</td>
                                        <td class="sygma-historial-col-cliente">CLIENTE</td>
                                        <td class="d-none d-sm-table-cell sygma-historial-col-dir">DIRECCION</td>
                                        <td class="d-none d-md-table-cell">ULTIMA_V</td>
                                        <td class="sygma-historial-col-acc text-center">MAP</td>
                                        <td class="sygma-historial-col-acc text-center">TEL</td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataEmpleado"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            `
        }
    }

    root = document.getElementById('root');
    if (!root) {
        console.error('[inicio_ventas] Contenedor #root no encontrado');
        return;
    }
    root.innerHTML = view.body();

};

function addListeners(){

    document.getElementById('btnVentasMenuToggle')?.addEventListener('click', () => {
        ventas_toggleSidebar();
    });
    document.getElementById('ventasSidebarBackdrop')?.addEventListener('click', () => {
        ventas_toggleSidebar(false);
    });
    document.getElementById('ventasSidebar')?.addEventListener('click', (e) => {
        if (e.target.closest('.proveedor-menu-card')) ventas_closeSidebarMobile();
    });

    F.slideAnimationTabs();

    selected_tab = '';

    document.title = `Vendedor - ${GlobalNomEmpresa}`;

    const lbEmpresa = document.getElementById('lbVentasEmpresa');
    if (lbEmpresa) lbEmpresa.innerText = GlobalNomEmpresa || '';

    const cmbMesHeader = document.getElementById('cmbMesHeader');
    const cmbAnioHeader = document.getElementById('cmbAnioHeader');
    if (cmbMesHeader) {
        cmbMesHeader.innerHTML = F.ComboMeses();
        cmbMesHeader.value = F.get_mes_curso();
        cmbMesHeader.addEventListener('change', ventas_onHeaderFiltersChange);
    }
    if (cmbAnioHeader) {
        cmbAnioHeader.innerHTML = F.ComboAnio();
        cmbAnioHeader.value = F.get_anio_curso();
        cmbAnioHeader.addEventListener('change', ventas_onHeaderFiltersChange);
    }
    ventas_setupSucursalHeader();
    ventas_setActiveCard('btnMenuHome');

    document.getElementById('btnMenuHome')?.addEventListener('click', () => {
        ventas_showHome();
    });
    Object.keys(VENTAS_EMBED_SCRIPTS).forEach(ventas_bindEmbedMenu);

    document.getElementById('btnMenuRptProductos')?.addEventListener('click', () => {
        ventas_showPanel('tres', 'btnMenuRptProductos', () => {
            selected_tab = 'PRODUCTOS';
            cargar_grid();
        });
    });

    document.getElementById('btnMenuRptDocumentos')?.addEventListener('click', () => {
        ventas_showPanel('dos', 'btnMenuRptDocumentos', () => {
            selected_tab = 'DOCUMENTOS';
            cargar_grid();
        });
    });

    document.getElementById('btnMenuRptMarcas')?.addEventListener('click', () => {
        ventas_showPanel('cuatro', 'btnMenuRptMarcas', () => {
            selected_tab = 'MARCAS';
            cargar_grid();
        });
    });

    document.getElementById('btnMenuRptCategorias')?.addEventListener('click', () => {
        ventas_showPanel('cinco', 'btnMenuRptCategorias', () => {
            selected_tab = 'CATEGORIAS';
            cargar_grid();
        });
    });

    document.getElementById('btnMenuRptHistorial')?.addEventListener('click', () => {
        ventas_showPanel('siete', 'btnMenuRptHistorial', () => {
            selected_tab = 'HISTORIAL';
            cargar_grid();
        });
    });

    document.getElementById('btnMenuRptGoles')?.addEventListener('click', () => {
        ventas_showPanel('seis', 'btnMenuRptGoles', () => {
            selected_tab = 'GOLES-COBERTURA';
            cargar_grid();
        });
    });

    document.getElementById('btnMenuCreditosPendientes')?.addEventListener('click', () => {
        ventas_showPanel('ocho', 'btnMenuCreditosPendientes', () => {
            if (typeof ventas_init_creditos === 'function') ventas_init_creditos();
        });
    });
    
    //------------------------------
    // CHECK IN -----------------
    //------------------------------

    document.getElementById('btnActualizarDashboard')?.addEventListener('click', () => {
        ventas_loadDashboard(true);
    });

    ventas_bindCheckInActions();
    ventas_refreshCheckInStatus();


    const txtProdFechaInicial = document.getElementById('txtProdFechaInicial');
    const txtProdFechaFinal = document.getElementById('txtProdFechaFinal');
    if (txtProdFechaInicial) txtProdFechaInicial.value = F.getFecha();
    if (txtProdFechaFinal) txtProdFechaFinal.value = F.getFecha();


    
    
    document.getElementById('txtProdFechaInicial')?.addEventListener('change', () => {
        rpt_tbl_productos_embarque();
    });

    document.getElementById('txtProdFechaFinal')?.addEventListener('change', () => {
        rpt_tbl_productos_embarque();
    });

    const txtDocFechaInicial = document.getElementById('txtDocFechaInicial');
    const txtDocFechaFinal = document.getElementById('txtDocFechaFinal');
    if (txtDocFechaInicial) txtDocFechaInicial.value = F.getFecha();
    if (txtDocFechaFinal) txtDocFechaFinal.value = F.getFecha();

    document.getElementById('btnRecargarListaFacturas')?.addEventListener('click', () => {
        rpt_tbl_documentos_embarque();
    });

    txtDocFechaInicial?.addEventListener('change', () => {
        rpt_tbl_documentos_embarque();
    });

    txtDocFechaFinal?.addEventListener('change', () => {
        rpt_tbl_documentos_embarque();
    });

    const txtMarcaFechaInicial = document.getElementById('txtMarcaFechaInicial');
    const txtMarcaFechaFinal = document.getElementById('txtMarcaFechaFinal');
    if (txtMarcaFechaInicial) txtMarcaFechaInicial.value = F.getFecha();
    if (txtMarcaFechaFinal) txtMarcaFechaFinal.value = F.getFecha();

    txtMarcaFechaInicial?.addEventListener('change', () => {
        rpt_tbl_marcas();
    });

    txtMarcaFechaFinal?.addEventListener('change', () => {
        rpt_tbl_marcas();
    });

    ventas_loadDashboard();
};

function initView(){
    root = document.getElementById('root');
    document.getElementById('js-page-content')?.classList.add('proveedor-page');
    if (typeof ventas_cxc_listeners_ready !== 'undefined') ventas_cxc_listeners_ready = false;
    try {
        getView();
        addListeners();
        ventas_showHome();
        if (typeof cargar_ruta_vendedor_sesion === 'function') {
            cargar_ruta_vendedor_sesion();
        }
    } catch (err) {
        console.error('[inicio_ventas] initView:', err);
        F.AvisoError('Error al inicializar ventas: ' + (err.message || err));
    }
}

function destroyView(){
    ventas_teardownEmbed();
    if (typeof ventas_cxc_listeners_ready !== 'undefined') ventas_cxc_listeners_ready = false;
    ventas_currentPane = 'uno';
    ventas_toggleSidebar(false);
    document.body.classList.remove('proveedor-sidebar-open');
    Object.keys(ventas_dashboardCharts).forEach(ventas_destroyDashboardChart);
    document.getElementById('js-page-content')?.classList.remove('proveedor-page');
}

function ventas_destroyDashboardChart(chartKey) {
    if (ventas_dashboardCharts[chartKey]) {
        ventas_dashboardCharts[chartKey].destroy();
        delete ventas_dashboardCharts[chartKey];
    }
}

function ventas_renderLineChart(chartKey, canvasId, labels, valuesFac, title, valuesDev) {
    ventas_destroyDashboardChart(chartKey);
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;

    const chartWrap = canvas.closest('.ventas-dashboard-chart');
    if (chartWrap) chartWrap.style.height = '220px';

    const datasets = [{
        label: 'Ventas FAC',
        data: valuesFac.map((v) => Number(v)),
        borderColor: '#0044a3',
        backgroundColor: 'rgba(0, 68, 163, 0.12)',
        fill: true,
        tension: 0.25,
        pointRadius: 3,
        pointHoverRadius: 5
    }];

    if (Array.isArray(valuesDev)) {
        datasets.push({
            label: 'Devoluciones DEV',
            data: valuesDev.map((v) => Number(v)),
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.08)',
            fill: false,
            tension: 0.25,
            pointRadius: 3,
            pointHoverRadius: 5,
            borderWidth: 2
        });
    }

    ventas_dashboardCharts[chartKey] = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: Array.isArray(valuesDev),
                    position: 'bottom',
                    labels: { font: { size: 10 }, boxWidth: 12, padding: 8 }
                },
                title: { display: true, text: title, font: { size: 12 } }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 68, 163, 0.08)' },
                    ticks: {
                        font: { size: 10 },
                        callback: (value) => F.setMoneda(value, 'Q')
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 16 }
                }
            }
        }
    });
}

function ventas_renderBarChart(chartKey, canvasId, labels, values, title) {
    ventas_destroyDashboardChart(chartKey);
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;

    const chartWrap = canvas.closest('.ventas-dashboard-chart');
    if (chartWrap) {
        chartWrap.style.height = `${Math.max(220, Math.min(labels.length * 28, 360))}px`;
    }

    const bgColor = labels.map(() => getRandomColor());
    ventas_dashboardCharts[chartKey] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: title,
                data: values.map((v) => Number(v)),
                backgroundColor: bgColor,
                borderRadius: 4,
                maxBarThickness: 28
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: title, font: { size: 12 } }
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
                    ticks: { font: { size: 10 }, autoSkip: false }
                }
            }
        }
    });
}

function ventas_buildDiasMesSeries(mes, anio, rows) {
    const mesNum = Number(mes);
    const anioNum = Number(anio);
    const diasMes = new Date(anioNum, mesNum, 0).getDate();
    const map = {};
    (rows || []).forEach((r) => {
        let dia = Number(r.DIA);
        if ((!dia || Number.isNaN(dia)) && r.FECHA) {
            const raw = String(r.FECHA).trim().split(/[T\s]/)[0];
            const parts = raw.split('-');
            if (parts.length >= 3) {
                dia = Number(parts[2]);
            } else {
                const f = new Date(r.FECHA);
                if (!Number.isNaN(f.getTime())) dia = f.getDate();
            }
        }
        if (!dia || Number.isNaN(dia)) return;
        map[dia] = (map[dia] || 0) + (Number(r.TOTALPRECIO) || 0);
    });
    const labels = [];
    const values = [];
    for (let d = 1; d <= diasMes; d += 1) {
        labels.push(String(d));
        values.push(map[d] || 0);
    }
    return { labels, values };
}

function ventas_setDashboardCacheInfo(fromCache, updatedAt) {
    const el = document.getElementById('lbVentasDashCacheInfo');
    if (!el) return;
    if (fromCache && updatedAt) {
        el.textContent = `Datos guardados hoy (${updatedAt})`;
    } else if (!fromCache && updatedAt) {
        el.textContent = `Actualizado ${updatedAt}`;
    } else {
        el.textContent = '';
    }
}

function ventas_resizeDashboardCharts() {
    Object.keys(ventas_dashboardCharts).forEach((key) => {
        try {
            ventas_dashboardCharts[key]?.resize();
        } catch (e) { /* chart no inicializado */ }
    });
}

function ventas_applyDashboardFromRows(rowsDia, rowsMarcas, rowsDev, mes, anio) {
    const lbDia = document.getElementById('lbVentasDashDiaTotal');
    const lbMarcas = document.getElementById('lbVentasDashMarcasTotal');

    const seriesFac = ventas_buildDiasMesSeries(mes, anio, rowsDia || []);
    const seriesDev = ventas_buildDiasMesSeries(mes, anio, rowsDev || []);
    const totalFac = seriesFac.values.reduce((sum, v) => sum + Number(v), 0);
    const totalDev = seriesDev.values.reduce((sum, v) => sum + Number(v), 0);
    if (lbDia) {
        lbDia.innerHTML = `FAC: <span class="text-base">${F.setMoneda(totalFac, 'Q')}</span> &nbsp;|&nbsp; DEV: <span class="text-danger">${F.setMoneda(totalDev, 'Q')}</span>`;
    }
    ventas_renderLineChart(
        'ventasDia',
        'chartVentasDia',
        seriesFac.labels,
        seriesFac.values,
        `Ventas FAC y devoluciones DEV (${mes}/${anio})`,
        seriesDev.values
    );

    const items = [...(rowsMarcas || [])].sort((a, b) => Number(b.TOTALPRECIO) - Number(a.TOTALPRECIO));
    const totalMarcas = items.reduce((sum, r) => sum + Number(r.TOTALPRECIO), 0);
    if (lbMarcas) lbMarcas.innerText = `Total mes: ${F.setMoneda(totalMarcas, 'Q')}`;
    ventas_renderBarChart(
        'ventasMarcas',
        'chartVentasMarcas',
        items.map((r) => r.DESMARCA),
        items.map((r) => r.TOTALPRECIO),
        `Marcas FAC (${mes}/${anio})`
    );
    requestAnimationFrame(() => ventas_resizeDashboardCharts());
}

function ventas_applyDashboardCache(cached, mes, anio) {
    try {
        const rowsDia = JSON.parse(cached.VENTAS_DIA || '[]');
        const rowsMarcas = JSON.parse(cached.MARCAS_FAC || '[]');
        const rowsDev = JSON.parse(cached.DEVOLUCIONES_DIA || '[]');
        ventas_applyDashboardFromRows(rowsDia, rowsMarcas, rowsDev, mes, anio);
        ventas_setDashboardCacheInfo(true, cached.UPDATED_AT);
        return true;
    } catch (err) {
        console.warn('[inicio_ventas] dashboard cache parse:', err);
        return false;
    }
}

function ventas_fetchDashboardRemote(sucursal, mes, anio, codemp, fecha) {
    return Promise.all([
        RPT.data_dashboard_vendedor_ventas_dia(sucursal, mes, anio, codemp),
        RPT.data_dashboard_vendedor_devoluciones_dia(sucursal, mes, anio, codemp),
        RPT.data_dashboard_vendedor_marcas_fac(sucursal, mes, anio, codemp)
    ]).then(([dataDia, dataDev, dataMarcas]) => {
        const rowsDia = dataDia.recordset || [];
        const rowsDev = dataDev.recordset || [];
        const rowsMarcas = dataMarcas.recordset || [];
        ventas_applyDashboardFromRows(rowsDia, rowsMarcas, rowsDev, mes, anio);
        ventas_setDashboardCacheInfo(false, F.getHora());
        if (typeof db_ventas_dashboard !== 'undefined') {
            return db_ventas_dashboard.save(sucursal, codemp, mes, anio, fecha, rowsDia, rowsMarcas, rowsDev)
                .catch((err) => console.warn('[inicio_ventas] dashboard cache save:', err));
        }
    });
}

function ventas_loadDashboard(forceRefresh) {
    const lbDia = document.getElementById('lbVentasDashDiaTotal');
    const lbMarcas = document.getElementById('lbVentasDashMarcasTotal');
    if (!lbDia && !lbMarcas) return Promise.resolve();

    const sucursal = ventas_getSucursal();
    const mes = ventas_getMes();
    const anio = ventas_getAnio();
    const codemp = GlobalCodUsuario;
    const fecha = F.getFecha();
    const btnRefresh = document.getElementById('btnActualizarDashboard');
    const iconRefresh = btnRefresh?.querySelector('i');

    const finishRefresh = () => {
        if (btnRefresh) btnRefresh.disabled = false;
        iconRefresh?.classList.remove('fa-spin');
    };

    const handleFetchError = (err) => {
        console.error('[inicio_ventas] dashboard:', err);
        if (lbDia) lbDia.innerText = 'Total mes: --';
        if (lbMarcas) lbMarcas.innerText = 'Total mes: --';
        ventas_destroyDashboardChart('ventasDia');
        ventas_destroyDashboardChart('ventasMarcas');
        if (forceRefresh) F.AvisoError('No se pudieron actualizar los datos del dashboard');
    };

    const runLoad = () => {
        if (forceRefresh) {
            if (btnRefresh) btnRefresh.disabled = true;
            iconRefresh?.classList.add('fa-spin');
            return ventas_fetchDashboardRemote(sucursal, mes, anio, codemp, fecha)
                .catch(handleFetchError)
                .finally(finishRefresh);
        }

        if (typeof db_ventas_dashboard === 'undefined') {
            return ventas_fetchDashboardRemote(sucursal, mes, anio, codemp, fecha).catch(handleFetchError);
        }

        return db_ventas_dashboard.get(sucursal, codemp, mes, anio, fecha)
            .then((cached) => {
                if (ventas_applyDashboardCache(cached, mes, anio)) return;
                return ventas_fetchDashboardRemote(sucursal, mes, anio, codemp, fecha);
            })
            .catch(() => ventas_fetchDashboardRemote(sucursal, mes, anio, codemp, fecha))
            .catch(handleFetchError);
    };

    if (lbDia) lbDia.innerText = 'Cargando...';
    if (lbMarcas) lbMarcas.innerText = 'Cargando...';

    const dbReady = window._sygmaDbReady || Promise.resolve();
    return dbReady.then(runLoad);
}

function ventas_checkInIsClosed(finValue) {
    if (!finValue || finValue === 'NO') return false;
    return true;
}

function ventas_buildCheckInState(horaInicio, horaFin) {
    const closed = ventas_checkInIsClosed(horaFin);
    if (closed) {
        const finLabel = horaFin && horaFin !== 'SI' ? horaFin : '';
        return { status: 'closed', horaInicio, horaFin: finLabel };
    }
    if (horaInicio) {
        return { status: 'active', horaInicio, horaFin: 'NO' };
    }
    return { status: 'none' };
}

function ventas_setCheckInLoading() {
    const lbStatus = document.getElementById('lbVentasCheckInStatus');
    if (!lbStatus) return;
    lbStatus.className = 'badge badge-light ventas-checkin-status__badge';
    lbStatus.innerHTML = '<i class="fal fa-spinner fa-spin"></i> Verificando check-in...';
}

function ventas_updateCheckInUI(state) {
    const btnIniciar = document.getElementById('btnIniciarCheckIn');
    const btnFinalizar = document.getElementById('btnFinalizarCheckIn');
    const lbStatus = document.getElementById('lbVentasCheckInStatus');
    if (!btnIniciar || !btnFinalizar) return;

    btnIniciar.style.visibility = 'hidden';
    btnFinalizar.style.visibility = 'hidden';
    btnIniciar.disabled = false;
    btnFinalizar.disabled = false;
    btnIniciar.innerHTML = '<i class="fal fa-street-view"></i>';
    btnFinalizar.innerHTML = '<i class="fal fa-upload"></i>';

    if (state.status === 'none') {
        btnIniciar.style.visibility = 'visible';
        if (lbStatus) {
            lbStatus.className = 'badge badge-warning ventas-checkin-status__badge';
            lbStatus.innerHTML = '<i class="fal fa-street-view"></i> Sin check-in hoy';
        }
        return;
    }

    if (state.status === 'active') {
        btnFinalizar.style.visibility = 'visible';
        if (lbStatus) {
            lbStatus.className = 'badge badge-success ventas-checkin-status__badge';
            lbStatus.innerHTML = `<i class="fal fa-check-circle"></i> Check-in desde ${state.horaInicio || '--:--'}`;
        }
        return;
    }

    if (lbStatus) {
        lbStatus.className = 'badge badge-info ventas-checkin-status__badge';
        lbStatus.innerHTML = state.horaFin
            ? `<i class="fal fa-flag-checkered"></i> Jornada cerrada (${state.horaFin})`
            : '<i class="fal fa-flag-checkered"></i> Jornada cerrada hoy';
    }
}

function ventas_syncCheckInLocalFromServer(horaInicio, horaFin) {
    const closed = ventas_checkInIsClosed(horaFin);
    const codemp = GlobalCodUsuario;
    const fecha = F.getFecha().toString();
    return db_checkin.verify(codemp, fecha)
        .then((rows) => {
            const row = rows[0] || {};
            if (closed && row.HFIN === 'NO') {
                return db_checkin.finalizar(codemp, fecha);
            }
        })
        .catch(() => db_checkin.insert({
            CODEMP: Number(codemp),
            FECHA: fecha,
            HINICIO: horaInicio || F.getHora(),
            HFIN: closed ? 'SI' : 'NO'
        }));
}

function ventas_applyCheckInFromServer() {
    return CHECKIN.verificar()
        .then((data) => {
            const row = (data.recordset && data.recordset[0]) || {};
            const state = ventas_buildCheckInState(row.HORA_INICIO, row.HORA_FIN);
            ventas_syncCheckInLocalFromServer(row.HORA_INICIO, row.HORA_FIN).catch(() => {});
            ventas_updateCheckInUI(state);
        })
        .catch(() => {
            ventas_updateCheckInUI({ status: 'none' });
        });
}

function ventas_refreshCheckInStatus() {
    ventas_setCheckInLoading();
    const codemp = GlobalCodUsuario;
    const fecha = F.getFecha();

    db_checkin.verify(codemp, fecha)
        .then((rows) => {
            const row = rows[0] || {};
            const finValue = row.HFIN === 'SI' ? 'SI' : 'NO';
            ventas_updateCheckInUI(ventas_buildCheckInState(row.HINICIO, finValue));
            CHECKIN.verificar()
                .then((data) => {
                    const srow = (data.recordset && data.recordset[0]) || {};
                    const state = ventas_buildCheckInState(srow.HORA_INICIO, srow.HORA_FIN);
                    ventas_syncCheckInLocalFromServer(srow.HORA_INICIO, srow.HORA_FIN).catch(() => {});
                    ventas_updateCheckInUI(state);
                })
                .catch(() => {});
        })
        .catch(() => ventas_applyCheckInFromServer());
}

function ventas_bindCheckInActions() {
    const btnIniciar = document.getElementById('btnIniciarCheckIn');
    const btnFinalizar = document.getElementById('btnFinalizarCheckIn');
    if (!btnIniciar || !btnFinalizar) return;

    btnIniciar.style.visibility = 'hidden';
    btnFinalizar.style.visibility = 'hidden';

    btnIniciar.addEventListener('click', () => {
        F.showToastNew('Realizando Check In...');
        btnIniciar.disabled = true;
        btnIniciar.innerHTML = '<i class="fal fa-street-view fa-spin"></i>';

        CHECKIN.iniciar()
            .then(() => {
                const horaInicio = F.getHora();
                F.showToastNew('Check In realizado con exito');
                const datosCheckin = {
                    CODEMP: Number(GlobalCodUsuario),
                    FECHA: F.getFecha().toString(),
                    HINICIO: horaInicio,
                    HFIN: 'NO'
                };
                db_checkin.insert(datosCheckin)
                    .catch((err) => console.error('Error inserting checkin:', err));
                ventas_updateCheckInUI({ status: 'active', horaInicio, horaFin: 'NO' });
            })
            .catch(() => {
                F.AvisoError('Error al realizar Check In, intentelo de nuevo');
                ventas_refreshCheckInStatus();
            });
    });

    btnFinalizar.addEventListener('click', () => {
        F.Confirmacion('¿Esta seguro que desea realizar el cierre del dia?')
            .then((value) => {
                if (value !== true) return;

                F.showToastNew('Realizando Check Out...');
                btnFinalizar.disabled = true;
                btnFinalizar.innerHTML = '<i class="fal fa-upload fa-spin"></i>';

                CHECKIN.finalizar()
                    .then(() => {
                        const horaFin = F.getHora();
                        F.showToastNew('Check Out realizado con exito');
                        db_checkin.finalizar(GlobalCodUsuario, F.getFecha().toString())
                            .catch((err) => console.error('Error finalizando checkin:', err));
                        ventas_updateCheckInUI({ status: 'closed', horaFin });
                    })
                    .catch(() => {
                        F.AvisoError('Error al realizar Check Out, intentelo de nuevo');
                        ventas_refreshCheckInStatus();
                    });
            });
    });
}

window._ventasCore = { initView, destroyView, getView, addListeners };

(function () {
    window.__spaViewHooks = window.__spaViewHooks || {};
    window.__spaViewHooks['inicio/ventas'] = {
        initView: window._ventasCore.initView,
        destroyView: window._ventasCore.destroyView
    };
})();

function cargar_grid(){

    switch (selected_tab) {
        case 'MARCAS':
            rpt_tbl_marcas();
            
            break;
        case 'CATEGORIAS':
             tbl_logro_marcas(GlobalEmpnit);
            
             break;
        case 'DOCUMENTOS':
            rpt_tbl_documentos_embarque();
            
            break;
        case 'PRODUCTOS':
            rpt_tbl_productos_embarque();
            
            break;
        case 'GOLES-COBERTURA':
            rpt_goles_resumen();
            rpt_cobertura_marcas_empleado(GlobalCodUsuario);

            break;
        case 'HISTORIAL':
            get_logro_empleado(GlobalCodUsuario,GlobalUsuario);

            break;
        default:
            ventas_showHome();
            break;
    }
};

function rpt_tbl_documentos_embarque(){
   

        let container = document.getElementById('tblDataFFacturas');
        container.innerHTML = GlobalLoader;

        let contador = 0;
        let varTotal = 0;
    
        let fi = F.devuelveFecha('txtDocFechaInicial');
        let ff = F.devuelveFecha('txtDocFechaFinal');

        GF.get_data_embarque_facturas_vendedor(GlobalEmpnit,fi,ff,GlobalCodUsuario)
        .then((data)=>{
    
       
            let str = '';
    
            data.recordset.map((r)=>{
            
                contador +=1;
                varTotal += Number(r.IMPORTE);
                const importeDoc = Number(r.IMPORTE);
                const sumaDetalle = Number(r.SUMA_DOCPRODUCTOS);
                const cuadra = Math.abs(importeDoc - sumaDetalle) < 0.05;
                const rowClass = cuadra ? '' : 'sygma-factura-descuadre';
                const idBtnFix = `idBtnFixFac${r.CODDOC}-${r.CORRELATIVO}`;
                const btnReparar = cuadra ? '' : `
                            <br>
                            <button class="btn btn-danger btn-sm hand shadow" id="${idBtnFix}"
                                onclick="get_fix_pedido('${r.CODDOC}','${r.CORRELATIVO}','${idBtnFix}')">
                                <i class="fal fa-wrench"></i>&nbsp Reparar
                            </button>`;
                str += `
                    <tr${rowClass ? ` class="${rowClass}"` : ''}>
                        <td>${r.CODDOC}-${r.CORRELATIVO}
                            <small>Status: <b>${r.STATUS}</b></small>
                        </td>
                        <td>${F.convertDateNormal(r.FECHA)}
                            <br>
                            <small>Hora:${r.HORA}</small>
                        </td>
                        <td>${r.NOMCLIE}
                            <br>
                            <small>${r.DIRCLIE}</small>
                        </td>
                        <td class="d-none d-md-table-cell">
                            ${r.DESMUN}
                        </td>
                        <td class="negrita text-danger text-right">
                            ${F.setMoneda(r.IMPORTE,'Q')}
                            <br>
                            <small class="text-secondary">Suma detalle: ${F.setMoneda(r.SUMA_DOCPRODUCTOS,'Q')}</small>
                            ${btnReparar}
                        </td>
                        <td class="text-center text-nowrap sygma-facturas-acciones">
                            <button type="button" class="btn btn-warning btn-sm btn-circle hand shadow mr-1"
                            onclick="get_detalle_pedido('${r.CODDOC}','${r.CORRELATIVO}')"
                            title="Ver detalle de productos">
                                <i class="fal fa-list"></i>
                            </button>
                            <button type="button" class="btn btn-info btn-sm btn-circle hand shadow"
                            onclick="fcn_editar_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.NOMCLIE}','${r.DIRCLIE}','${r.STATUS}')"
                            title="Editar factura">
                                <i class="fal fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `
            })
            container.innerHTML = str;
            document.getElementById('lbFacTotalPedidos').innerText = `Facturas: ${contador}`;
            document.getElementById('lbFacTotalImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;
    
        })
        .catch((err)=>{
            console.log('error:')
            console.log(err)

            container.innerHTML = 'No se cargaron datos....';
            document.getElementById('lbFacTotalPedidos').innerText = '';
            document.getElementById('lbFacTotalImporte').innerText = '';
        })
    
    
    


}


function get_detalle_pedido(coddoc, correlativo) {
    $('#modal_detalle_pedido').modal('show');

    const container = document.getElementById('tblDataDetallePedido');
    if (!container) return;
    container.innerHTML = GlobalLoader;

    GF.get_data_detalle_documento(GlobalEmpnit, coddoc, correlativo)
        .then((data) => {
            let str = '';
            let contador = 0;
            let varImporte = 0;

            data.recordset.map((r) => {
                contador += 1;
                varImporte += Number(r.TOTALPRECIO);
                str += `
            <tr>
                <td>${r.CODPROD}</td>
                <td>${r.DESPROD}</td>
                <td>${r.TIPOPRECIO}</td>
                <td>${r.CODMEDIDA}</td>
                <td>${r.CANTIDAD}</td>
                <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
            </tr>
            `;
            });
            container.innerHTML = str;
            document.getElementById('lbFtotalCantidad').innerHTML = contador;
            document.getElementById('lbFtotalImporte').innerHTML = F.setMoneda(varImporte, 'Q');
            document.getElementById('txtDetallePedidoObs').value = '';
        })
        .catch(() => {
            container.innerHTML = 'No hay datos...';
            document.getElementById('lbFtotalCantidad').innerHTML = '';
            document.getElementById('lbFtotalImporte').innerHTML = '';
            document.getElementById('txtDetallePedidoObs').value = '';
        });
}


function get_fix_pedido(coddoc, correlativo, idbtn) {
    const btn = document.getElementById(idbtn);
    if (!btn) return;

    btn.disabled = true;
    btn.innerHTML = `<i class="fal fa-spin fa-wrench"></i>`;

    GF.update_fix_documento(coddoc, correlativo)
        .then(() => {
            F.Aviso('Documento corregido exitosamente!!');
            btn.disabled = false;
            btn.innerHTML = `<i class="fal fa-wrench"></i>&nbsp Reparar`;
            rpt_tbl_documentos_embarque();
        })
        .catch(() => {
            F.AvisoError('No se pudo corregir el documento');
            btn.disabled = false;
            btn.innerHTML = `<i class="fal fa-wrench"></i>&nbsp Reparar`;
        });
}


function rpt_tbl_productos_embarque(){

    let container = document.getElementById('tblDataFProductos');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;


    let fi = F.devuelveFecha('txtProdFechaInicial');
    let ff = F.devuelveFecha('txtProdFechaFinal');

    

    GF.get_data_embarque_productos_vendedor(GlobalEmpnit,fi,ff,GlobalCodUsuario)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
         
            contador +=1;
            varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td>${r.CODPROD}
                        <br>
                        <small class="hidden">${r.TOTALUNIDADES}</small>
                    </td>
                    <td>${r.DESPROD}
                        <br>
                        <small>${r.DESMARCA}</small>
                    </td>
                    <td class="d-none d-md-table-cell">${r.UXC}</td>
                    <td>${r.CAJAS}</td>
                    <td>${r.UNIDADES}</td>
                    <td class="text-right negrita text-danger">${F.setMoneda(r.IMPORTE,'Q')}</td>
                </tr>
                `
        })
        container.innerHTML = str;
        document.getElementById('lbProdTotalPedidos').innerText = `Pedidos: ${contador}`;
        document.getElementById('lbProdTotalImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbProdTotalPedidos').innerText = '';
        document.getElementById('lbProdTotalImporte').innerText = '';
    })


};


function rpt_tbl_marcas(){

    let container = document.getElementById('tblDataMarcas');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

    let fi = F.devuelveFecha('txtMarcaFechaInicial');
    let ff = F.devuelveFecha('txtMarcaFechaFinal');

 
    GF.get_data_marcas_vendedor(GlobalEmpnit,fi,ff,GlobalCodUsuario)
    .then((data)=>{

   
        let str = '';

        data.recordset.map((r)=>{
        
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            str += `
                <tr>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                </tr>
            `
        })
        container.innerHTML = str;
       
        document.getElementById('lbMarcaTotalImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((err)=>{
        console.log('error:')
        console.log(err)

        container.innerHTML = 'No se cargaron datos....';
       
        document.getElementById('lbMarcaTotalImporte').innerText = '';
    })


    /*
    str += `
                <tr>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                    <td>${F.setMoneda((Number(r.OBJETIVO)-Number(r.TOTALPRECIO)),'Q')}</td>
                    <td class="negrita">${F.setMoneda((Number(r.OBJETIVO)/Number(r.TOTALPRECIO)) * 100,'')}%</td>
                </tr>
            `
    */


};



function get_data_vendedor(codemp,mes,anio){

    return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + '/objetivos/select_logro_vendedores_categorias', {
                    token:TOKEN,
                    codemp:codemp,
                    mes:mes,
                    anio:anio})
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
    }) 
    


};
function tbl_detalle_vendedor(codemp){

    let container = document.getElementById('tblDataVendedorCategorias');
    container.innerHTML = GlobalLoader;

    let mes = ventas_getMes();
    let anio = ventas_getAnio();

    let varTObjetivo = 0; let varTLogro = 0; let varTFaltan = 0;

    get_data_vendedor(codemp,mes,anio)
    .then((data)=>{
        let str = '';

        data.recordset.map((r)=>{
            
            let logrado = F.get_logrado(Number(r.LOGRO),Number(r.OBJETIVO));
            let faltan = Number(r.OBJETIVO)-Number(r.LOGRO);

            let strLogro = get_color_logro(Number(logrado));
          
            varTObjetivo += Number(r.OBJETIVO);
            varTLogro += Number(r.LOGRO);
            varTFaltan += Number(faltan);

            str += `
            <tr class="${strLogro}">
                <td>${r.CATEGORIA}</td>
                <td>${F.setMoneda(r.LOGRO,'Q')}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>${F.setMoneda(faltan,'Q')}</td>
                <td>
                    <div class="input-group"><progress value="${logrado}" max="100"></progress>${logrado}%</div>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalCategoriaVendedorObjetivo').innerText = F.setMoneda(varTObjetivo,'Q');
        document.getElementById('lbTotalCategoriaVendedorLogro').innerText = F.setMoneda(varTLogro,'Q');
        document.getElementById('lbTotalCategoriaVendedorFaltan').innerText = F.setMoneda(varTFaltan,'Q');
        

    })
    .catch((error)=>{

        console.log(error);

        container.innerHTML = 'No se cargaron datos...';
        
        document.getElementById('lbTotalCategoriaVendedorObjetivo').innerText = '';
        document.getElementById('lbTotalCategoriaVendedorLogro').innerText = '';
        document.getElementById('lbTotalCategoriaVendedorFaltan').innerText = '';
        
    })


}



function rpt_goles_resumen(){

    let mes = ventas_getMes();
    let anio = ventas_getAnio();

    let container = document.getElementById('tblDataGoles');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;


    GF.get_data_goles_resumen_mes(GlobalEmpnit,GlobalCodUsuario,mes,anio)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            varTotal += Number(r.CONTEO);
            str+= `
            <tr>
                <td>${r.DESPROD}
                    <br>
                    <small>${r.CODPROD}</small>
                </td>
                <td>${r.CONTEO}</td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalGoles').innerText = varTotal;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbTotalGoles').innerText = '';
    })




};







// ------------------------ logro marcas

function get_data_logro_marcas(sucursal,mes,anio,codemp){

     return new Promise((resolve,reject)=>{

            let url = '';
                url = '/objetivos/select_logro_marcas_vendedor'
            
            axios.post(GlobalUrlCalls + url, {
                    token:TOKEN,
                    sucursal:sucursal,
                    mes:mes,
                    anio:anio,
                    codemp:codemp})
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        }) 
    

};
function tbl_logro_marcas(sucursal){

    let empleado = GlobalCodUsuario;//document.getElementById('cmb_objetivos_vendedores').value;

    let container = document.getElementById('tblDataMarcas2');
    container.innerHTML = GlobalLoader;

    let mes = ventas_getMes();
    let anio = ventas_getAnio();


    let conteo = 0;
    let varTotalObjetivo =0; let varTotalImporte = 0; 
    let varTotalFaltan = 0; let varTotalLogro = 0;


  
           get_data_logro_marcas(sucursal,mes,anio,empleado)
            .then((data)=>{

                let str = '';
                data.recordset.map((r)=>{
                    conteo += 1;
                    let varFaltan = (Number(r.OBJETIVO) - Number(r.TOTALPRECIO));
                    let varLOGRO = ((Number(r.TOTALPRECIO)/Number(r.OBJETIVO))*100);

                    let strLogro = get_color_logro(Number(varLOGRO));

                    varTotalObjetivo += Number(r.OBJETIVO);
                    varTotalImporte += Number(r.TOTALPRECIO);
                    varTotalFaltan += Number(varFaltan);
                    varTotalLogro += Number(varLOGRO);

                    str += `
                    <tr class="${strLogro} hand" onclick="get_detalle_marca('${r.CODIGO_MARCA}','${r.MARCA}')">
                        <td>${r.MARCA}</td>
                        <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                        <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                        <td>${F.setMoneda(varFaltan,'Q')}</td>
                        <td>${varLOGRO.toFixed(2)} %</td>
                    </tr>
                    `
                })
                container.innerHTML = str;


                document.getElementById('lbTotalMarcasImporte').innerHTML = F.setMoneda(varTotalImporte,'Q');
                document.getElementById('lbTotalMarcasObjetivo').innerHTML = F.setMoneda(varTotalObjetivo,'Q');
                document.getElementById('lbTotalMarcasFalta').innerHTML = F.setMoneda(varTotalFaltan,'Q');
                document.getElementById('lbTotalMarcasLogro').innerHTML = `${F.setMoneda(varTotalLogro / conteo,'')} %`

                let logrado = 0; let faltaLogro = 0;
                try {
                logrado = (Number(varTotalImporte)/Number(varTotalObjetivo))*100;
                faltaLogro = 100-Number(logrado);
                } catch (error) {
                    logrado=0;
                    faltaLogro=0;   
                }
                document.getElementById('lbObjLogrado').innerHTML = `<progress value="${logrado}" max="100"></progress><b class="text-success">${logrado.toFixed(2)}%</b>`;
                document.getElementById('lbObjLogradoFalta').innerHTML = `<progress class="progress-falta" value="${faltaLogro}" max="100"></progress><b class="text-danger">${faltaLogro.toFixed(2)}%</b>`;
            })
            .catch(()=>{

                container.innerHTML = 'No se cargaron datos...';

                document.getElementById('lbTotalMarcasImporte').innerHTML = '';
                document.getElementById('lbTotalMarcasObjetivo').innerHTML =''; 
                document.getElementById('lbTotalMarcasFalta').innerHTML = '';
                document.getElementById('lbTotalMarcasLogro').innerHTML = '';

                document.getElementById('lbObjLogrado').innerHTML = `<progress value="0" max="100"></progress>`;
                document.getElementById('lbObjLogradoFalta').innerHTML = `<progress class="progress-falta" value="0" max="100"></progress>`;
            
            })
   
   



};
// ------------------------ logro marcas



// ------------------------------------------------
// ------------------------------------------------
//OBTIENE EL DETALLE DE CATEGORIAS DE LA MARCA

function get_detalle_marca(codmarca,desmarca){


    $("#modal_categorias_marca").modal('show');

    document.getElementById('lbMarcasDescategoria').innerText = desmarca;
    
    tbl_logro_categorias_marca(codmarca);



};
function get_data_logro_categorias_marcas(sucursal,codmarca,mes,anio){

    return new Promise((resolve,reject)=>{


        let url = '';
        let empleado = GlobalCodUsuario; //document.getElementById('cmb_objetivos_vendedores').value;
        
            url = '/objetivos/select_logro_vendedores_categorias';
        

            axios.post(GlobalUrlCalls + url, {
                    token:TOKEN,
                    sucursal:sucursal,
                    codmarca:codmarca,
                    mes:mes,
                    anio:anio,
                    codemp:empleado})
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });


    }) 
    

};
function tbl_logro_categorias_marca(codmarca){

    let container = document.getElementById('tblDataCategoriasMarca');
    container.innerHTML = GlobalLoader;


    let sucursal = GlobalEmpnit; //document.getElementById('cmbSucursal').value;
    let mes = ventas_getMes();
    let anio = ventas_getAnio();


    let varTotalObjetivo = 0; let varTotalLogro = 0; let varTotalFaltan = 0;

  
    get_data_logro_categorias_marcas(sucursal,codmarca,mes,anio)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
      
            let varLOGRO = ((Number(r.TOTALPRECIO)/Number(r.OBJETIVO))*100);
          
            varTotalObjetivo += Number(r.OBJETIVO);
            varTotalLogro += Number(r.TOTALPRECIO);
            let faltan = (Number(r.OBJETIVO)-Number(r.TOTALPRECIO))
            varTotalFaltan += Number(faltan);

            let strLogro = get_color_logro(Number(varLOGRO));

         
            str += `
            <tr class="${strLogro}">
                <td>${r.CATEGORIA}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>${F.setMoneda(faltan,'Q')}</td>
                <td>${varLOGRO.toFixed(2)}%</td>
            </tr>
            `
        })
        container.innerHTML = str;

        document.getElementById('lbTotalMarcaObjetivo').innerHTML = F.setMoneda(varTotalObjetivo,'Q');
        document.getElementById('lbTotalMarcaLogro').innerHTML = F.setMoneda(varTotalLogro,'Q');
        document.getElementById('lbTotalMarcaFaltan').innerHTML = F.setMoneda(varTotalFaltan,'Q');
    })
    .catch((err)=>{

        console.log(err);

        container.innerHTML = 'No se cargaron datos...';

        document.getElementById('lbTotalMarcaObjetivo').innerHTML = '';
        document.getElementById('lbTotalMarcaLogro').innerHTML = '';
        document.getElementById('lbTotalMarcaFaltan').innerHTML = '';
    })


};

//OBTIENE EL DETALLE DE CATEGORIAS DE LA MARCA
// ------------------------------------------------
// ------------------------------------------------





function get_logro_empleado(codemp,nombre){


   
    tbl_clientes_empleado(codemp);
    


};
function tbl_clientes_empleado(codemp){

    let container = document.getElementById('tblDataEmpleado');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;

    GF.data_clientes_no_visitados_empleado('',codemp)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            varTotal+=1;
            str += `
                <tr>
                    <td class="text-nowrap sygma-historial-col-visita d-none d-sm-table-cell">${r.VISITA}</td>
                    <td class="sygma-historial-col-cliente">
                        <span class="d-inline-block d-sm-none badge badge-secondary sygma-historial-visita-inline mb-1">${r.VISITA}</span>
                        ${r.TIPONEGOCIO}-${r.NEGOCIO}
                        <br>
                        <span class="sygma-historial-cliente-nombre">${r.NOMBRE}</span>
                        <span class="d-sm-none sygma-historial-cliente-dir">
                            <br><small>${r.DIRECCION}</small>
                            <br><small>${r.MUNICIPIO}${r.ALDEA ? ' · ' + r.ALDEA : ''}</small>
                        </span>
                    </td>
                    <td class="d-none d-sm-table-cell sygma-historial-col-dir">${r.DIRECCION}
                        <br>
                        <small>${r.MUNICIPIO}</small>
                        <br>
                        <small>${r.ALDEA}</small>
                    </td>
                    <td class="d-none d-md-table-cell text-nowrap">${F.convertDateNormal(r.LASTSALE)}</td>
                    <td class="text-center p-1 sygma-historial-col-acc">
                        <button class="btn btn-sm btn-circle btn-info hand shadow sygma-historial-acc-btn"
                        onclick="F.gotoGoogleMaps('${r.LATITUD}','${r.LONGITUD}')">
                            <i class="fal fa-map"></i>
                        </button>
                    </td>
                    <td class="text-center p-1 sygma-historial-col-acc">
                        <button class="btn btn-sm btn-circle btn-secondary hand shadow sygma-historial-acc-btn"
                        onclick="F.phone_call('${r.TELEFONO}')">
                            <i class="fal fa-phone"></i>
                        </button>
                    </td>
                </tr>
            `
        })
         container.innerHTML = str;
        document.getElementById('lbEmpleadoTotal').innerText = `Visitados: ${varTotal}`;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
        document.getElementById('lbEmpleadoTotal').innerText = '';
    })




};
function rpt_cobertura_marcas_empleado(codemp){

    let sucursal = GlobalEmpnit;
    let mes = ventas_getMes();
    let anio = ventas_getAnio();


    let container = document.getElementById('tblDataMarcasEmpleadoCobertura');
    container.innerHTML = GlobalLoader;

        let varTotalConteo = 0;
        let varTotalImporte = 0;
        let varTotalGoles = 0;

            GF.data_cobertura_goles_marcas_empleado(sucursal,mes,anio,codemp)
            .then((data)=>{

                let str = '';
                data.recordset.map((r)=>{
                    varTotalConteo += Number(r.COBERTURA);
                    varTotalGoles += Number(r.GOLES);
                    varTotalImporte += Number(r.COBERTURA_IMPORTE);
                    str+=`
                    <tr>
                        <td>${r.DESMARCA}</td>
                        <td>${r.COBERTURA}</td>
                        <td>${r.GOLES}</td>
                        <td>${F.setMoneda(r.COBERTURA_IMPORTE,'Q')}</td>
                        <td>${get_sku_goles(r.GOLES, r.COBERTURA)}</td>
                    </tr>
                    `
                })
                container.innerHTML = str;
                document.getElementById('lbTotalMarcaVisitadosEmpleado').innerText = varTotalConteo;
                
                document.getElementById('lbTotalMarcaGolesEmpleado').innerText = varTotalGoles;
                
                document.getElementById('lbTotalMarcaImporteEmpleado').innerText = F.setMoneda(varTotalImporte,'Q');
                
            })
            .catch((err)=>{
                console.log(err);
                container.innerHTML = 'No se cargaron datos...';
                document.getElementById('lbTotalMarcaVisitadosEmpleado').innerText = '';
                document.getElementById('lbTotalMarcaGolesEmpleado').innerText = '';
                document.getElementById('lbTotalMarcaImporteEmpleado').innerText = '';
            })

  
   

};

function get_sku_goles(goles,visitados){
    
    let div_goles = goles || 0;
    let div_visitados = visitados || 0;

    let resultado = 0;

    try {
        resultado = (Number(div_goles) / Number(div_visitados));
    } catch (error) {
        resultado = 0;
    }

    return F.setMoneda(resultado,'');

}
