
let proveedor_embedDestroy = null;
let proveedor_dashboardCharts = {};
let proveedor_marcasVendedorChart = null;
let proveedor_vendedorMarcasChart = null;
let proveedor_vendedorSeleccionado = '';

function proveedor_getModoVentas() {
    return document.getElementById('cmbProveedorModoVentas')?.value || 'bruta';
}

function proveedor_labelModoVentas() {
    return proveedor_getModoVentas() === 'neta' ? 'Ventas netas' : 'Ventas brutas';
}

const PROVEEDOR_EMBED_BASE = '../views/menu/INICIO_PROVEEDOR/';

function proveedor_getSucursal() {
    return document.getElementById('cmbSucursalHeader')?.value || '%';
}

function proveedor_getMes() {
    return document.getElementById('cmbMesHeader')?.value || F.get_mes_curso();
}

function proveedor_getAnio() {
    return document.getElementById('cmbAnioHeader')?.value || F.get_anio_curso();
}

function proveedor_onHeaderFiltersChange() {
    get_grid_tab();
    if (!selected_tab) proveedor_loadDashboard();
    if (typeof window.proveedor_embedRefresh === 'function') {
        window.proveedor_embedRefresh();
    }
}
const PROVEEDOR_EMBED_SCRIPTS = {
    btnMenuObjetivosLogro: PROVEEDOR_EMBED_BASE + 'view_avance_procter_vendedor.js',
    btnMenuRptVisitasMapa: PROVEEDOR_EMBED_BASE + 'view_visitas_vendedores_gps.js',
    btnMenuInventarioRetroactivo: PROVEEDOR_EMBED_BASE + 'view_inv_retroactivo.js',
    btnMenuCoberturaMunicipios: PROVEEDOR_EMBED_BASE + 'view_cobertura_municipios_mapa.js',
    btnMenuCoberturaClientes: PROVEEDOR_EMBED_BASE + 'view_objetivo_cobertura.js',
    btnMenuCoberturaMarcas: PROVEEDOR_EMBED_BASE + 'view_cobertura_marcas.js',
};

const PROVEEDOR_MODERN_EMBEDS = new Set([
    'btnMenuObjetivosLogro',
    'btnMenuInventarioRetroactivo',
    'btnMenuCoberturaMunicipios',
    'btnMenuCoberturaClientes',
    'btnMenuCoberturaMarcas',
]);

function proveedor_toggleSidebar(forceOpen) {
    const sidebar = document.getElementById('proveedorSidebar');
    const backdrop = document.getElementById('proveedorSidebarBackdrop');
    if (!sidebar) return;
    const open = typeof forceOpen === 'boolean' ? forceOpen : !sidebar.classList.contains('proveedor-sidebar--open');
    sidebar.classList.toggle('proveedor-sidebar--open', open);
    backdrop?.classList.toggle('proveedor-sidebar-backdrop--visible', open);
    document.body.classList.toggle('proveedor-sidebar-open', open);
}

function proveedor_closeSidebarMobile() {
    if (window.innerWidth < 768) proveedor_toggleSidebar(false);
}

function proveedor_setActiveCard(cardId) {
    document.querySelectorAll('.proveedor-menu-card').forEach(el => {
        el.classList.toggle('proveedor-menu-card--active', !!cardId && el.id === cardId);
    });
}

function proveedor_showHome() {
    selected_tab = '';
    proveedor_showPanel('uno', 'btnMenuDashboard', () => proveedor_loadDashboard());
}

function proveedor_teardownEmbed() {
    if (proveedor_embedDestroy) {
        try { proveedor_embedDestroy(); } catch (e) { /* vista embebida sin teardown */ }
        proveedor_embedDestroy = null;
    }
    document.querySelector('script[data-proveedor-embed]')?.remove();
    const embed = document.getElementById('proveedorPanelEmbed');
    if (embed) {
        embed.classList.add('d-none');
        embed.classList.remove('proveedor-view-modern');
        embed.innerHTML = '';
    }
    document.getElementById('myTabHomeContent')?.classList.remove('d-none');
    window.proveedor_embedRefresh = null;
    if (window._proveedorCore) {
        window.initView = window._proveedorCore.initView;
        window.destroyView = window._proveedorCore.destroyView;
    }
}

function proveedor_showPanel(paneId, cardId, afterShow) {
    proveedor_closeSidebarMobile();
    proveedor_teardownEmbed();
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
    proveedor_setActiveCard(cardId);
    if (typeof afterShow === 'function') afterShow();
}

function proveedor_rewireEmbedActions(container) {
    if (!container) return;
    container.querySelectorAll('[data-spa-action="inicio"]').forEach(btn => btn.remove());
    container.querySelectorAll('button.btn-bottom-l').forEach(btn => {
        if (!btn.hasAttribute('data-dismiss')) btn.remove();
    });
}

function proveedor_loadEmbed(scriptUrl, cardId) {
    proveedor_closeSidebarMobile();
    proveedor_teardownEmbed();
    document.getElementById('myTabHomeContent')?.classList.add('d-none');
    const embed = document.getElementById('proveedorPanelEmbed');
    embed.classList.remove('d-none');
    embed.classList.toggle('proveedor-view-modern', PROVEEDOR_MODERN_EMBEDS.has(cardId));
    embed.innerHTML = GlobalLoader;
    proveedor_setActiveCard(cardId);

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = scriptUrl + (scriptUrl.includes('?') ? '&' : '?') + '_pe=' + Date.now();
        script.setAttribute('data-proveedor-embed', 'true');
        script.onload = () => {
            const embedRoot = embed;
            const savedRoot = root;
            root = embedRoot;
            if (typeof initView === 'function') {
                initView();
                proveedor_embedDestroy = typeof destroyView === 'function' ? destroyView : null;
            }
            root = savedRoot;
            if (window._proveedorCore) {
                window.initView = window._proveedorCore.initView;
                window.destroyView = window._proveedorCore.destroyView;
            }
            proveedor_rewireEmbedActions(embedRoot);
            resolve();
        };
        script.onerror = () => reject(new Error('No se pudo cargar: ' + scriptUrl));
        document.getElementById('root').appendChild(script);
    });
}

function getView(){
    let view = {
        body:()=>{
            return `
            <div class="proveedor-layout">
            <button type="button" class="btn proveedor-menu-toggle d-md-none" id="btnProveedorMenuToggle" title="Menú de opciones">
                <i class="fal fa-bars"></i><span>Menú</span>
            </button>
            <div class="proveedor-sidebar-backdrop d-md-none" id="proveedorSidebarBackdrop"></div>

            <div class="proveedor-header-card card shadow-sm">
                <div class="card-body py-2 px-3">
                    <div class="row align-items-center no-gutters">
                        <div class="col-auto pr-2">
                            <img src="./img/logopg.png" width="50" height="50" alt="P&G">
                        </div>
                        <div class="col-auto pr-3">
                            <h5 class="negrita text-white mb-0">INICIO PROCTER</h5>
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

            <div class="row proveedor-main-row">
                <div class="col-12 col-md-2 proveedor-sidebar" id="proveedorSidebar">
                    <div class="proveedor-sidebar__scroll">
                        ${view.menu()}
                    </div>
                </div>
                <div class="col-12 col-md-10 proveedor-content-col">
                    <div class="proveedor-tab-area">
                    <div id="proveedorPanelContent">
                        <div id="proveedorPanelEmbed" class="d-none"></div>
                        <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            <div id="proveedorMainContent">
                                ${view.vista_dashboard()}
                            </div>
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           ${view.vista_vendedores()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_marcas()}
                        </div>
                        <div class="tab-pane fade proveedor-view-modern" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_sellout()}
                        </div>
                        <div class="tab-pane fade proveedor-view-modern" id="cinco" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_inventarios() + view.modal_sellout_config()}
                        </div>
                        <div class="tab-pane fade proveedor-view-modern" id="seis" role="tabpanel" aria-labelledby="home-tab">
                            ${view.objetivos()}
                        </div>
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
                    </ul>
            </div>
            `
        },
        menu:()=>{
            const items = [
                { id: 'btnMenuDashboard',          label: 'Dashboard',                 icon: 'fa-chart-line', color: 'primary' },
                { id: 'btnMenuVentasVendedor',   label: 'Ventas por vendedor',       icon: 'fa-users',      color: 'info' },
                { id: 'btnMenuVentasMarcas',     label: 'Ventas por marca',          icon: 'fa-box',        color: 'secondary' },
                { id: 'btnMenuVentasSellout',    label: 'Sell out',                  icon: 'fa-chart-pie',  color: 'success' },
                { id: 'btnMenuRptInventario',    label: 'Inventario',                icon: 'fa-warehouse',  color: 'secondary' },
                { id: 'btnMenuObjetivosLogro',   label: 'Logro P&G',                 icon: 'fa-chart-pie',  color: 'danger' },
                { id: 'btnMenuCoberturaMunicipios', label: 'Cobertura municipios',   icon: 'fa-globe',      color: 'primary' },
                { id: 'btnMenuCoberturaClientes', label: 'Cobertura clientes',       icon: 'fa-users',      color: 'secondary' },
                { id: 'btnMenuCoberturaMarcas',   label: 'Cobertura marcas',         icon: 'fa-tags',       color: 'info' },
                { id: 'btnMenuRptVisitasMapa',   label: 'Visitas vendedor mapa',     icon: 'fa-map-signs',  color: 'secondary' },
                { id: 'btnMenuObjetivos',        label: 'Objetivos',                 icon: 'fa-list',       color: 'base' },
                { id: 'btnMenuInventarioRetroactivo', label: 'Inventario retroactivo', icon: 'fa-box',     color: 'secondary' },
            ];
            return items.map(item => `
                <div class="card proveedor-menu-card hand" id="${item.id}">
                    <div class="card-body d-flex align-items-center">
                        <i class="fal ${item.icon} text-${item.color} mr-2 proveedor-menu-icon"></i>
                        <span class="negrita proveedor-menu-label">${item.label}</span>
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
                                    <canvas id="chartDashInventario"></canvas>
                                </div>
                                <div class="table-responsive proveedor-dashboard-scroll">
                                    <table class="table table-sm table-bordered h-full col-12" id="tblDashInventarioCategoria">
                                        <thead class="bg-secondary text-white negrita">
                                            <tr>
                                                <td>CATEGORIA</td>
                                                <td>CAJAS</td>
                                                <td>COSTO</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataDashInventarioCategoria"></tbody>
                                        <tfoot class="bg-secondary text-white negrita">
                                            <tr>
                                                <td>TOTALES</td>
                                                <td id="lbFootDashInvCajas">--</td>
                                                <td id="lbFootDashInvCosto">--</td>
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
                                    <canvas id="chartDashVentasVendedor"></canvas>
                                </div>
                                <div class="table-responsive proveedor-dashboard-scroll">
                                    <table class="table table-sm table-bordered h-full col-12" id="tblDashVentasVendedor">
                                        <thead class="bg-info text-white negrita">
                                            <tr>
                                                <td>VENDEDOR</td>
                                                <td>PEDIDOS</td>
                                                <td>IMPORTE</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataDashVentasVendedor"></tbody>
                                        <tfoot class="bg-info text-white negrita">
                                            <tr>
                                                <td>TOTALES</td>
                                                <td id="lbFootDashVendedorPedidos">--</td>
                                                <td id="lbFootDashVendedorImporte">--</td>
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
                                    <canvas id="chartDashVentasMarca"></canvas>
                                </div>
                                <div class="table-responsive proveedor-dashboard-scroll">
                                    <table class="table table-sm table-bordered h-full col-12" id="tblDashVentasMarca">
                                        <thead class="bg-secondary text-white negrita">
                                            <tr>
                                                <td>MARCA</td>
                                                <td>IMPORTE</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataDashVentasMarca"></tbody>
                                        <tfoot class="bg-secondary text-white negrita">
                                            <tr>
                                                <td>TOTAL</td>
                                                <td id="lbFootDashMarcaImporte">--</td>
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
        vista_vendedores:()=>{
            return `
            <div class="proveedor-rpt-marcas">
                <div class="proveedor-rpt-marcas__hero card shadow-sm mb-3">
                    <div class="card-body py-3 px-4 d-flex align-items-center justify-content-between flex-wrap">
                        <div>
                            <h5 class="negrita text-info mb-1">VENTAS POR VENDEDOR</h5>
                            <small class="text-muted">Seleccione un vendedor para ver ventas por marca</small>
                        </div>
                        <div class="proveedor-rpt-marcas__total-badge negrita" id="lbTotalVImporte">--</div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 col-lg-5 mb-3 mb-lg-0">
                        <div class="proveedor-rpt-marcas__panel card shadow-sm h-100">
                            <div class="proveedor-rpt-marcas__panel-header">
                                <span class="negrita text-secondary">Vendedores</span>
                            </div>
                            <div class="card-body p-3">
                                <input type="text" class="form-control form-control-sm mb-2"
                                    placeholder="Buscar vendedor..."
                                    id="txtVendedoresBuscar"
                                    oninput="F.FiltrarTabla('tblVendedores','txtVendedoresBuscar')">
                                <div class="table-responsive proveedor-rpt-marcas__scroll">
                                    <table class="table table-hover h-full col-12 mb-0" id="tblVendedores">
                                        <thead class="bg-info text-white negrita">
                                            <tr>
                                                <td>VENDEDOR</td>
                                                <td>TEL</td>
                                                <td class="text-right">PEDIDOS</td>
                                                <td class="text-right">IMPORTE</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataVendedores"></tbody>
                                        <tfoot class="bg-info text-white negrita">
                                            <tr>
                                                <td colspan="2">TOTALES</td>
                                                <td class="text-right" id="lbFootTotalPedidos"></td>
                                                <td class="text-right" id="lbFootTotalPrecio"></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-lg-7">
                        <div class="proveedor-rpt-marcas__panel card shadow-sm h-100">
                            <div class="proveedor-rpt-marcas__panel-header d-flex align-items-center justify-content-between flex-wrap">
                                <span class="negrita text-info" id="lbVendedorMarcas">Ventas por marca</span>
                            </div>
                            <div class="card-body p-3">
                                <div class="proveedor-rpt-marcas__chart mb-2">
                                    <canvas id="chartVendedorMarcas"></canvas>
                                </div>
                                <input type="text" class="form-control form-control-sm mb-2"
                                    placeholder="Buscar marca..."
                                    id="txtBuscarMarca"
                                    oninput="F.FiltrarTabla('tblVendedorMarcas','txtBuscarMarca')">
                                <div class="table-responsive proveedor-rpt-marcas__scroll">
                                    <table class="table table-hover h-full col-12 mb-0" id="tblVendedorMarcas">
                                        <thead class="bg-secondary text-white negrita">
                                            <tr>
                                                <td>MARCA</td>
                                                <td class="text-right">IMPORTE</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataVendedorMarcas"></tbody>
                                        <tfoot class="bg-secondary text-white negrita">
                                            <tr>
                                                <td>TOTAL</td>
                                                <td class="text-right" id="lbFootVendedorMarcasImporte">--</td>
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
        },
        vista_marcas:()=>{
            return `
            <div class="proveedor-rpt-marcas">
                <div class="proveedor-rpt-marcas__hero card shadow-sm mb-3">
                    <div class="card-body py-3 px-4 d-flex align-items-center justify-content-between flex-wrap">
                        <div>
                            <h5 class="negrita text-secondary mb-1">VENTAS POR MARCAS</h5>
                            <small class="text-muted">Seleccione una marca para ver ventas por vendedor</small>
                        </div>
                        <div class="proveedor-rpt-marcas__total-badge negrita" id="lbTotalMImporte">--</div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 col-lg-5 mb-3 mb-lg-0">
                        <div class="proveedor-rpt-marcas__panel card shadow-sm h-100">
                            <div class="proveedor-rpt-marcas__panel-header">
                                <span class="negrita text-secondary">Marcas</span>
                            </div>
                            <div class="card-body p-3">
                                <input type="text" class="form-control form-control-sm mb-2"
                                    placeholder="Buscar marca..."
                                    id="txtMarcasBuscar"
                                    oninput="F.FiltrarTabla('tblMarcas','txtMarcasBuscar')">
                                <div class="table-responsive proveedor-rpt-marcas__scroll">
                                    <table class="table table-hover h-full col-12 mb-0" id="tblMarcas">
                                        <thead class="bg-secondary text-white negrita">
                                            <tr>
                                                <td>MARCA</td>
                                                <td class="text-right">IMPORTE</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataMarcas"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-lg-7">
                        <div class="proveedor-rpt-marcas__panel card shadow-sm h-100">
                            <div class="proveedor-rpt-marcas__panel-header d-flex align-items-center justify-content-between flex-wrap">
                                <span class="negrita text-info" id="lbMarcasVendedor">Ventas por vendedor</span>
                            </div>
                            <div class="card-body p-3">
                                <div class="proveedor-rpt-marcas__chart mb-2">
                                    <canvas id="chartMarcasVendedor"></canvas>
                                </div>
                                <input type="text" class="form-control form-control-sm mb-2"
                                    placeholder="Buscar vendedor..."
                                    id="txtMarcasBuscarVendedor"
                                    oninput="F.FiltrarTabla('tblMarcasVendedor','txtMarcasBuscarVendedor')">
                                <div class="table-responsive proveedor-rpt-marcas__scroll">
                                    <table class="table table-hover h-full col-12 mb-0" id="tblMarcasVendedor">
                                        <thead class="bg-info text-white negrita">
                                            <tr>
                                                <td>VENDEDOR</td>
                                                <td class="text-right">IMPORTE</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataMarcasVendedor"></tbody>
                                        <tfoot class="bg-info text-white negrita">
                                            <tr>
                                                <td>TOTAL</td>
                                                <td class="text-right" id="lbFootMarcasVendedorImporte">--</td>
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
        rpt_inventarios:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-4">
                    
                    <h5 class="negrita text-danger mb-3">INVENTARIO ACTUAL</h5>

                    <div class="row">
                        <div class="col-sm-6 col-md-8 col-lg-8 col-xl-8">
                            <div class="input-group">
                                <select class="form-control negrita text-base" id="cmbSt">
                                    <option value="SI">PRODUCTOS HABILITADOS</option>
                                    <option value="NO">PRODUCTOS NO HABILITADOS</option>
                                </select>
                                <input type="text" class="form-control" placeholder="Escriba para buscar..." id="txtBuscarProductoInventario" oninput="F.FiltrarTabla('tblInventario','txtBuscarProductoInventario')">

                            </div>

                            
                        </div>
                        
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <button class="btn btn-success btn-md hand shadow" id="btnExportarInventario">
                                <i class="fal fa-share"></i> Exportar Excel
                            </button>
                        </div>
                    </div>

                    <br>

                    <div class="table-responsive col-12">
                        <table class="table h-full table-hover col-12" id="tblInventario">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>CODIGO</td>
                                    <td>CODIGO 2</td>
                                    <td>CODIGO 3</td>
                                    <td>PRODUCTO</td>
                                    <td>MARCA</td>
                                    <td>TOTALCOSTO</td>
                                    <td>EXISTENCIA (CAJAS)</td>
                                    <td>SELLOUT</td>
                                    <td>MESES_INV</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataInventario">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <button class="btn btn-warning btn-xl btn-circle hand shadow btn-bottom-r" id="btnSOConfigModal">
                <i class="fal fa-cog"></i>
            </button>

            `
        },
        modal_sellout_config:()=>{
            return `
              <div id="modal_sellout_config" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Configuracion de Promedio SellOut
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                        <div class="form-group">
                                            <label class="text-secondary">Seleccione el Año</label>
                                            <select class="form-control negrita" id="cmbSOAnio">
                                            </select>
                                        </div>

                                        <div class="form-group">
                                            <label class="text-secondary">Seleccione el Mes Inicial</label>
                                            <select class="form-control negrita" id="cmbSOMesInicial">
                                            </select>
                                        </div>

                                        <div class="form-group">
                                            <label class="text-secondary">Seleccione el Mes Final</label>
                                            <select class="form-control negrita" id="cmbSOMesFinal">
                                            </select>
                                        </div>

                                        <div class="form-group">
                                            <label class="text-secondary">Ultimo SellOut generado</label>
                                            <input type="text" class="form-control negrita" id="txtSOObs" disabled="true">
                                        </div>

                                        <br>
                                        <div class="row">
                                            <div class="col-6">
                                                <button class="btn btn-secondary btn-xl btn-circle hand shadow" id="" data-dismiss="modal">
                                                    <i class="fal fa-arrow-left"></i>
                                                </button>
                                            </div>
                                            <div class="col-6">
                                                <button class="btn btn-xl btn-info btn-circle hand shadow" id="btnConfigSellout">
                                                    <i class="fal fa-save"></i>
                                                </button>
                                            </div>
                                        </div>

                                </div>
                            </div>

                                
                    

                        </div>
                    
                    </div>
                </div>
            </div>
            `
        },
        objetivos:()=>{
           return `
            <div class="proveedor-objetivos">
                <div class="card card-rounded shadow mb-3">
                    <div class="card-body py-3 px-3 proveedor-section-hero">
                        <h5 class="negrita text-danger mb-0">Logro de objetivos</h5>
                        <small class="text-muted">Mes y sede según filtros del encabezado</small>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-xl-6 mb-3 mb-xl-0">
                        ${view.frag_marcas()}
                    </div>
                    <div class="col-12 col-xl-6">
                        ${view.frag_vendedores()}
                    </div>
                </div>
            </div>
            ${view.modal_categorias_marca()}
            ${view.modal_categorias_vendedor()}
            `
        },
        frag_marcas:()=>{
            return `
            <div class="card card-rounded shadow h-100 proveedor-rpt-marcas__panel">
                <div class="card-body p-3">
                    <h5 class="negrita text-base text-center mb-3">Logro de marcas</h5>
                    <div class="table-responsive proveedor-rpt-marcas__scroll">
                        <table class="table table-sm table-bordered proveedor-rpt-marcas__table mb-0" id="tblObjetivosMarcas">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>MARCA</td>
                                    <td class="text-right">IMPORTE</td>
                                    <td class="text-right">OBJETIVO</td>
                                    <td class="text-right">FALTA</td>
                                    <td class="text-right">ALCANCE</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataMarcas2"></tbody>
                            <tfoot class="bg-base text-white negrita">
                                <tr>
                                    <td>TOTALES</td>
                                    <td class="text-right" id="lbTotalMarcasImporte"></td>
                                    <td class="text-right" id="lbTotalMarcasObjetivo"></td>
                                    <td class="text-right" id="lbTotalMarcasFalta"></td>
                                    <td class="text-right" id="lbTotalMarcasLogro"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            `
        },
        frag_vendedores:()=>{
            return `
            <div class="card card-rounded shadow h-100 proveedor-rpt-marcas__panel">
                <div class="card-body p-3">
                    <h5 class="negrita text-secondary text-center mb-3">Logro de vendedores</h5>
                    <div class="table-responsive proveedor-rpt-marcas__scroll">
                        <table class="table table-sm table-bordered proveedor-rpt-marcas__table mb-0" id="tblObjetivosVendedores">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <td>VENDEDOR</td>
                                    <td class="text-right">IMPORTE</td>
                                    <td class="text-right">OBJETIVO</td>
                                    <td class="text-right">FALTA</td>
                                    <td class="text-right">ALCANCE</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataVendedores2"></tbody>
                            <tfoot class="bg-secondary text-white negrita">
                                <tr>
                                    <td>TOTALES</td>
                                    <td class="text-right" id="lbTotalVendedoresImporte"></td>
                                    <td class="text-right" id="lbTotalVendedoresObjetivo"></td>
                                    <td class="text-right" id="lbTotalVendedoresFalta"></td>
                                    <td class="text-right" id="lbTotalVendedoresLogro"></td>
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

                                    <div class="table-responsive proveedor-rpt-marcas__scroll">
                                        <table class="table table-sm table-bordered proveedor-rpt-marcas__table mb-0">
                                            <thead class="bg-base text-white"> 
                                                <tr>
                                                    <td>CATEGORIA</td>
                                                    <td class="text-right">OBJETIVO</td>
                                                    <td class="text-right">LOGRO</td>
                                                    <td class="text-right">FALTAN</td>
                                                    <td class="text-right">ALCANCE</td>
                                                </tr>
                                            </thead>
                                            <tbody id="tblDataCategoriasMarca"></tbody>
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
        modal_categorias_vendedor:()=>{
            return `
              <div id="modal_categorias_vendedor" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="lbVendedorCategorias"></h4>
                        </div>
                        <div class="modal-body p-4">
                            <div class="card card-rounded">
                                <div class="card-body p-4">
                                    <div class="table-responsive proveedor-rpt-marcas__scroll">
                                        <table class="table table-sm table-bordered proveedor-rpt-marcas__table mb-0">
                                            <thead class="bg-secondary text-white"> 
                                                <tr>
                                                    <td>CATEGORIA</td>
                                                    <td class="text-right">VENTA</td>
                                                    <td class="text-right">OBJETIVO</td>
                                                    <td class="text-right">FALTAN</td>
                                                    <td class="text-right">ALCANCE</td>
                                                </tr>
                                            </thead>
                                            <tbody id="tblDataVendedorCategorias"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-3">
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
    }

    root.innerHTML = view.body();

};

function addListeners(){


    F.slideAnimationTabs();
    
    document.title = `Proveedor - ${GlobalNomEmpresa}`;

  
    selected_tab = ''; //VENTAS_VENDEDOR,VENTAS_MARCAS,SELLOUT,INVENTARIOS,OBJETIVOS

    let cmbSucursalHeader = document.getElementById('cmbSucursalHeader');

    //bloqueo los controles para que no cargue nada
    document.getElementById('btnMenuVentasVendedor').disbled = true;
    document.getElementById('btnMenuVentasMarcas').disabled = true;
    document.getElementById('btnMenuVentasSellout').disabled = true;


    GF.get_data_empresas()
        .then((data)=>{
            let str = '<option value="%">TODAS LAS SEDES</option>';
            data.recordset.map((r)=>{
                str += `
                    <option value="${r.EMPNIT}">${r.NOMBRE}</option>
                `
            })
            cmbSucursalHeader.innerHTML = str;
            document.getElementById('btnMenuVentasVendedor').disbled = false;
            document.getElementById('btnMenuVentasMarcas').disabled = false;
            document.getElementById('btnMenuVentasSellout').disabled = false;
            
            proveedor_loadDashboard();
            proveedor_setActiveCard('btnMenuDashboard');
        })
        .catch(()=>{
            cmbSucursalHeader.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
        })

    const cmbMesHeader = document.getElementById('cmbMesHeader');
    const cmbAnioHeader = document.getElementById('cmbAnioHeader');
    cmbMesHeader.innerHTML = F.ComboMeses();
    cmbAnioHeader.innerHTML = F.ComboAnio();
    cmbMesHeader.value = F.get_mes_curso();
    cmbAnioHeader.value = F.get_anio_curso();

    cmbSucursalHeader.addEventListener('change', proveedor_onHeaderFiltersChange);
    cmbMesHeader.addEventListener('change', proveedor_onHeaderFiltersChange);
    cmbAnioHeader.addEventListener('change', proveedor_onHeaderFiltersChange);
    document.getElementById('cmbProveedorModoVentas')?.addEventListener('change', proveedor_onHeaderFiltersChange);

    document.getElementById('txtSFechaInicial').value = F.getFecha();
    document.getElementById('txtSFechaFinal').value = F.getFecha();
    

    document.getElementById('cmbSOMesInicial').innerHTML = F.ComboMeses();document.getElementById('cmbSOMesInicial').value=F.get_mes_curso();
    document.getElementById('cmbSOMesFinal').innerHTML = F.ComboMeses();document.getElementById('cmbSOMesFinal').value=F.get_mes_curso();
    document.getElementById('cmbSOAnio').innerHTML = F.ComboAnio(); document.getElementById('cmbSOAnio').value = F.get_anio_curso();


    // inciales
    //----------------------------------


    

    document.getElementById('btnProveedorMenuToggle')?.addEventListener('click', () => {
        proveedor_toggleSidebar();
    });
    document.getElementById('proveedorSidebarBackdrop')?.addEventListener('click', () => {
        proveedor_toggleSidebar(false);
    });

    document.getElementById('btnMenuDashboard')?.addEventListener('click', () => {
        proveedor_showHome();
    });

    document.getElementById('btnMenuVentasVendedor').addEventListener('click',()=>{
        proveedor_showPanel('dos', 'btnMenuVentasVendedor', ()=>{
            selected_tab = 'VENTAS_VENDEDOR';
            tbl_rpt_vendedores();
        });
    });

    document.getElementById('btnMenuVentasMarcas').addEventListener('click',()=>{
        proveedor_showPanel('tres', 'btnMenuVentasMarcas', ()=>{
            selected_tab = 'VENTAS_MARCAS';
            tbl_rpt_marcas();
        });
    });

    document.getElementById('tblMarcas')?.addEventListener('click', (e) => {
        const row = e.target.closest('tr[data-codmarca]');
        if (!row) return;
        tbl_rpt_marcas_vendedores(
            row.dataset.codmarca,
            row.dataset.desmarca || '',
            proveedor_getMes(),
            proveedor_getAnio()
        );
    });

    document.getElementById('tblVendedores')?.addEventListener('click', (e) => {
        const row = e.target.closest('tr[data-codemp]');
        if (!row) return;
        tbl_rpt_vendedor_marcas(
            row.dataset.codemp,
            row.dataset.nombre || '',
            proveedor_getMes(),
            proveedor_getAnio()
        );
    });


    // marcas
    


    //sell out
    document.getElementById('btnMenuVentasSellout').addEventListener('click',()=>{
        proveedor_showPanel('cuatro', 'btnMenuVentasSellout', ()=>{
            selected_tab = 'SELLOUT';
            tbl_rpt_sellout();
        });
    });


    document.getElementById('txtSFechaInicial').addEventListener('change',()=>{
        tbl_rpt_sellout();
    })
    document.getElementById('txtSFechaFinal').addEventListener('change',()=>{
        tbl_rpt_sellout();
    })

    document.getElementById('btnExportarSellOut')?.addEventListener('click', () => {
        const btn = document.getElementById('btnExportarSellOut');
        const fi = F.devuelveFecha('txtSFechaInicial');
        const ff = F.devuelveFecha('txtSFechaFinal');
        const sucursal = proveedor_getSucursal();

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

    // inventarios

    document.getElementById('btnExportarInventario').addEventListener('click',()=>{
        F.exportTableToExcel('tblInventario','Inventario');
    });

    document.getElementById('btnMenuRptInventario').addEventListener('click',()=>{
        proveedor_showPanel('cinco', 'btnMenuRptInventario', ()=>{
            selected_tab = 'INVENTARIOS';
            tbl_inventario();
        });
    });


    document.getElementById('cmbSt').addEventListener('change',()=>{
        tbl_inventario();
    });


    document.getElementById('cmbSOAnio').addEventListener('change',()=>{
        get_config_obs_sellout();
    });
    document.getElementById('cmbSOMesInicial').addEventListener('change',()=>{
        get_config_obs_sellout();
    });
    document.getElementById('cmbSOMesFinal').addEventListener('change',()=>{
        get_config_obs_sellout();
    });


    document.getElementById('btnSOConfigModal').addEventListener('click',()=>{

        let sucursal = proveedor_getSucursal();
        if(sucursal=='%'){F.AvisoError('Seleccione una sede para configurar SELLOUT');return;}

        $('#modal_sellout_config').modal('show');
        
        document.getElementById('txtSOObs').value = data_config_general[2].OBS;

    })

    let btnConfigSellout = document.getElementById('btnConfigSellout');
    btnConfigSellout.addEventListener('click',()=>{

        F.Confirmacion('¿Esta seguro que desea GENERAR el SellOut con estos parametros?')
        .then((value)=>{
            if(value==true){

                let sucursalSO = proveedor_getSucursal();
                let mi = document.getElementById('cmbSOMesInicial').value;
                let mf = document.getElementById('cmbSOMesFinal').value;
                let anio = document.getElementById('cmbSOAnio').value;
                let obs = document.getElementById('txtSOObs').value;
                

                    btnConfigSellout.disabled = true;
                    btnConfigSellout.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                    GF.get_data_inventarios_sellout_config(sucursalSO,mi,mf,anio,obs)
                    .then(()=>{
                        
                        F.Aviso('SellOut establecido exitosamente!!');
                        
                        tbl_inventario();

                        btnConfigSellout.disabled = false;
                        btnConfigSellout.innerHTML = `<i class="fal fa-save"></i>`;
                    
                    })
                    .catch(()=>{
                      
                        btnConfigSellout.disabled = false;
                        btnConfigSellout.innerHTML = `<i class="fal fa-save"></i>`;

                    })




            }
        })
        
     





        



    });

     // inventarios

     document.getElementById('btnMenuObjetivosLogro').addEventListener('click',()=>{
        proveedor_loadEmbed(PROVEEDOR_EMBED_SCRIPTS.btnMenuObjetivosLogro, 'btnMenuObjetivosLogro');
     });

     document.getElementById('btnMenuInventarioRetroactivo').addEventListener('click',()=>{
        proveedor_loadEmbed(PROVEEDOR_EMBED_SCRIPTS.btnMenuInventarioRetroactivo, 'btnMenuInventarioRetroactivo');
     });

     document.getElementById('btnMenuRptVisitasMapa').addEventListener('click',()=>{
        proveedor_loadEmbed(PROVEEDOR_EMBED_SCRIPTS.btnMenuRptVisitasMapa, 'btnMenuRptVisitasMapa');
     });

     document.getElementById('btnMenuCoberturaMunicipios').addEventListener('click',()=>{
        proveedor_loadEmbed(PROVEEDOR_EMBED_SCRIPTS.btnMenuCoberturaMunicipios, 'btnMenuCoberturaMunicipios');
     });

      document.getElementById('btnMenuCoberturaClientes').addEventListener('click',()=>{
        proveedor_loadEmbed(PROVEEDOR_EMBED_SCRIPTS.btnMenuCoberturaClientes, 'btnMenuCoberturaClientes');
     });

     document.getElementById('btnMenuCoberturaMarcas').addEventListener('click',()=>{
        proveedor_loadEmbed(PROVEEDOR_EMBED_SCRIPTS.btnMenuCoberturaMarcas, 'btnMenuCoberturaMarcas');
     });

     listeners_objetivos();

};

function get_grid_tab(){
  
        //selected_tab = ''; 
        //VENTAS_MARCAS,SELLOUT,INVENTARIOS,OBJETIVOS

    switch (selected_tab) {
      
        case 'VENTAS_VENDEDOR':
            tbl_rpt_vendedores();
            break;
        case 'VENTAS_MARCAS':
            tbl_rpt_marcas();

            break;
        case 'SELLOUT':
            tbl_rpt_sellout();

            break;
        case 'INVENTARIOS':
            tbl_inventario();

            break;
        case 'OBJETIVOS':
            get_reportes();

            break;

    }

};

function get_config_obs_sellout(){

    let mes_inicial = document.getElementById('cmbSOMesInicial').value;
    let mes_final = document.getElementById('cmbSOMesFinal').value;
    let anio = document.getElementById('cmbSOAnio').value;
    

    document.getElementById('txtSOObs').value = `Sellout del mes ${mes_inicial} al mes ${mes_final} del año ${anio}`;


};



function proveedor_destroyDashboardChart(chartKey) {
    if (proveedor_dashboardCharts[chartKey]) {
        proveedor_dashboardCharts[chartKey].destroy();
        delete proveedor_dashboardCharts[chartKey];
    }
}

function proveedor_renderDashboardChart(chartKey, canvasId, labels, values, title) {
    proveedor_destroyDashboardChart(chartKey);

    const canvas = document.getElementById(canvasId);
    if (!canvas || !labels.length || !values.length) return;

    const total = values.reduce((sum, value) => sum + Number(value), 0);
    if (total <= 0) return;

    const bgColor = labels.map(() => getRandomColor());
    const chartWrap = canvas.closest('.proveedor-dashboard-chart');
    if (chartWrap) {
        chartWrap.style.height = `${Math.max(200, labels.length * 30)}px`;
    }

    proveedor_dashboardCharts[chartKey] = new Chart(canvas.getContext('2d'), {
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
}

function proveedor_resetDashboardFooters() {
    const footers = [
        'lbFootDashInvCajas',
        'lbFootDashInvCosto',
        'lbFootDashVendedorPedidos',
        'lbFootDashVendedorImporte',
        'lbFootDashMarcaImporte'
    ];
    footers.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.innerText = '--';
    });
}

function proveedor_loadDashboard() {
    proveedor_resetDashboardFooters();
    tbl_dashboard_inventario_categoria();
    tbl_dashboard_ventas_vendedor();
    tbl_dashboard_ventas_marca();
}

function tbl_dashboard_inventario_categoria() {
    const container = document.getElementById('tblDataDashInventarioCategoria');
    if (!container) return;

    container.innerHTML = GlobalLoader;
    proveedor_destroyDashboardChart('inventario');
    const sucursal = proveedor_getSucursal();

    GF.get_data_inventarios_general(sucursal, 'SI')
        .then((data) => {
            const resumen = {};
            data.recordset.forEach((r) => {
                const categoria = r.DESMARCA || 'SIN CATEGORIA';
                const cajas = F.get_existencia(Number(r.TOTALUNIDADES), Number(r.UXC));
                const costo = Number(r.TOTALUNIDADES) * Number(r.COSTO);
                if (!resumen[categoria]) {
                    resumen[categoria] = { cajas: 0, costo: 0 };
                }
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
            document.getElementById('lbFootDashInvCajas').innerText = totalCajas.toFixed(2);
            document.getElementById('lbFootDashInvCosto').innerText = F.setMoneda(totalCosto, 'Q');

            proveedor_renderDashboardChart(
                'inventario',
                'chartDashInventario',
                items.map((item) => item.categoria),
                items.map((item) => item.costo),
                `Costo por categoria: ${F.setMoneda(totalCosto, 'Q')}`
            );
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No se cargaron datos</td></tr>';
            proveedor_destroyDashboardChart('inventario');
        });
}

function tbl_dashboard_ventas_vendedor() {
    const container = document.getElementById('tblDataDashVentasVendedor');
    if (!container) return;

    container.innerHTML = GlobalLoader;
    proveedor_destroyDashboardChart('vendedor');
    const sucursal = proveedor_getSucursal();
    const mes = proveedor_getMes();
    const anio = proveedor_getAnio();
    const modo = proveedor_getModoVentas();
    const tituloModo = `${proveedor_labelModoVentas()} por vendedor`;

    RPT.data_dashboard_ventas_vendedor(sucursal, mes, anio, modo)
        .then((data) => {
            const items = [...data.recordset].sort((a, b) => Number(b.TOTALPRECIO) - Number(a.TOTALPRECIO));
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
            document.getElementById('lbFootDashVendedorPedidos').innerText = `${totalPedidos}`;
            document.getElementById('lbFootDashVendedorImporte').innerText = F.setMoneda(totalImporte, 'Q');

            proveedor_renderDashboardChart(
                'vendedor',
                'chartDashVentasVendedor',
                items.map((r) => r.EMPLEADO),
                items.map((r) => Number(r.TOTALPRECIO)),
                `${tituloModo}: ${F.setMoneda(totalImporte, 'Q')}`
            );
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No se cargaron datos</td></tr>';
            document.getElementById('lbFootDashVendedorPedidos').innerText = '--';
            document.getElementById('lbFootDashVendedorImporte').innerText = '--';
            proveedor_destroyDashboardChart('vendedor');
        });
}

function tbl_dashboard_ventas_marca() {
    const container = document.getElementById('tblDataDashVentasMarca');
    if (!container) return;

    container.innerHTML = GlobalLoader;
    proveedor_destroyDashboardChart('marca');
    const sucursal = proveedor_getSucursal();
    const mes = proveedor_getMes();
    const anio = proveedor_getAnio();
    const modo = proveedor_getModoVentas();
    const tituloModo = `${proveedor_labelModoVentas()} por marca`;

    RPT.data_marcas(sucursal, mes, anio, modo)
        .then((data) => {
            const items = [...data.recordset].sort((a, b) => Number(b.TOTALPRECIO) - Number(a.TOTALPRECIO));
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
            document.getElementById('lbFootDashMarcaImporte').innerText = F.setMoneda(totalImporte, 'Q');

            proveedor_renderDashboardChart(
                'marca',
                'chartDashVentasMarca',
                items.map((r) => r.DESMARCA),
                items.map((r) => r.TOTALPRECIO),
                `${tituloModo}: ${F.setMoneda(totalImporte, 'Q')}`
            );
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="2" class="text-center text-muted">No se cargaron datos</td></tr>';
            proveedor_destroyDashboardChart('marca');
        });
}

function initView(){
    document.getElementById('js-page-content')?.classList.add('proveedor-page');
    getView();
    addListeners();
}

function destroyView(){
    Object.keys(proveedor_dashboardCharts).forEach(proveedor_destroyDashboardChart);
    proveedor_destroyMarcasVendedorChart();
    proveedor_destroyVendedorMarcasChart();
    proveedor_teardownEmbed();
    document.getElementById('js-page-content')?.classList.remove('proveedor-page');
}

window._proveedorCore = { initView, destroyView, getView, addListeners };

function proveedor_destroyVendedorMarcasChart() {
    if (proveedor_vendedorMarcasChart) {
        proveedor_vendedorMarcasChart.destroy();
        proveedor_vendedorMarcasChart = null;
    }
}

function proveedor_resetVendedorDetalle() {
    proveedor_vendedorSeleccionado = '';
    proveedor_destroyVendedorMarcasChart();
    const lbMarcas = document.getElementById('lbVendedorMarcas');
    const detalle = document.getElementById('tblDataVendedorMarcas');
    const foot = document.getElementById('lbFootVendedorMarcasImporte');
    if (lbMarcas) lbMarcas.innerText = 'Ventas por marca';
    if (detalle) detalle.innerHTML = '<tr><td colspan="2" class="text-center text-muted py-4">Seleccione un vendedor</td></tr>';
    if (foot) foot.innerText = '--';
}

function proveedor_setVendedorActivo(codemp) {
    proveedor_vendedorSeleccionado = String(codemp);
    document.querySelectorAll('#tblDataVendedores tr[data-codemp]').forEach((row) => {
        row.classList.toggle('proveedor-rpt-marcas__row--active', row.dataset.codemp === proveedor_vendedorSeleccionado);
    });
}

function proveedor_renderVendedorMarcasChart(items, nombre) {
    proveedor_destroyVendedorMarcasChart();

    const canvas = document.getElementById('chartVendedorMarcas');
    if (!canvas || !items.length || typeof Chart === 'undefined') return;

    const labels = items.map((r) => r.DESMARCA);
    const values = items.map((r) => Number(r.TOTALPRECIO));
    const bgColor = labels.map(() => getRandomColor());

    proveedor_vendedorMarcasChart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Importe',
                data: values,
                backgroundColor: bgColor,
                borderRadius: 6,
                maxBarThickness: 42
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: `${proveedor_labelModoVentas()} por marca — ${nombre}`,
                    font: { size: 12 }
                }
            },
            scales: {
                x: {
                    ticks: { maxRotation: 45, minRotation: 0, font: { size: 10 } }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => F.setMoneda(value, 'Q')
                    }
                }
            }
        }
    });
}

function tbl_rpt_vendedores() {
    const mes = proveedor_getMes();
    const anio = proveedor_getAnio();
    const container = document.getElementById('tblDataVendedores');
    if (!container) return;

    container.innerHTML = GlobalLoader;
    proveedor_resetVendedorDetalle();

    const footPrecio = document.getElementById('lbFootTotalPrecio');
    const footPedidos = document.getElementById('lbFootTotalPedidos');
    if (footPrecio) footPrecio.innerText = '';
    if (footPedidos) footPedidos.innerText = '';

    const sucursal = proveedor_getSucursal();

    const modo = proveedor_getModoVentas();

    RPT.data_ventas_vendedor(sucursal, mes, anio, modo)
        .then((data) => {
            const items = [...data.recordset].sort((a, b) => Number(b.TOTALPRECIO) - Number(a.TOTALPRECIO));
            let varTotal = 0;
            let varPedidos = 0;
            let str = '';

            items.forEach((r) => {
                varTotal += Number(r.TOTALPRECIO);
                varPedidos += Number(r.CONTEO);
                const nombreAttr = String(r.EMPLEADO || '').replace(/"/g, '&quot;');
                str += `
                    <tr class="proveedor-rpt-marcas__row hand" data-codemp="${r.CODEMP}" data-nombre="${nombreAttr}">
                        <td>${r.EMPLEADO}</td>
                        <td><small class="text-muted">${r.TELEFONO || ''}</small></td>
                        <td class="text-right">${r.CONTEO}</td>
                        <td class="text-right">${F.setMoneda(r.TOTALPRECIO, 'Q')}</td>
                    </tr>
                `;
            });

            container.innerHTML = str || '<tr><td colspan="4" class="text-center text-muted">Sin datos</td></tr>';
            document.getElementById('lbTotalVImporte').innerText = `Total: ${F.setMoneda(varTotal, 'Q')}`;
            if (footPrecio) footPrecio.innerText = F.setMoneda(varTotal, 'Q');
            if (footPedidos) footPedidos.innerText = String(varPedidos);
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No se cargaron datos</td></tr>';
            document.getElementById('lbTotalVImporte').innerText = '';
            if (footPrecio) footPrecio.innerText = '';
            if (footPedidos) footPedidos.innerText = '';
        });
}

function tbl_rpt_vendedor_marcas(codemp, nombre, mes, anio) {
    const container = document.getElementById('tblDataVendedorMarcas');
    const foot = document.getElementById('lbFootVendedorMarcasImporte');
    if (!container || !foot) return;

    proveedor_setVendedorActivo(codemp);
    document.getElementById('lbVendedorMarcas').innerText = `Ventas por marca — ${nombre}`;

    container.innerHTML = `<tr><td colspan="2" class="text-center">${GlobalLoader}</td></tr>`;
    foot.innerText = '--';
    proveedor_destroyVendedorMarcasChart();

    const sucursal = proveedor_getSucursal();
    const mesVal = mes || proveedor_getMes();
    const anioVal = anio || proveedor_getAnio();
    const modo = proveedor_getModoVentas();

    RPT.data_ventas_vendedor_marcas(sucursal, codemp, mesVal, anioVal, modo)
        .then((data) => {
            const items = [...data.recordset].sort((a, b) => Number(b.TOTALPRECIO) - Number(a.TOTALPRECIO));
            let varTotal = 0;
            let str = '';

            items.forEach((r) => {
                varTotal += Number(r.TOTALPRECIO);
                str += `
                    <tr>
                        <td>${r.DESMARCA}</td>
                        <td class="text-right">${F.setMoneda(r.TOTALPRECIO, 'Q')}</td>
                    </tr>
                `;
            });

            container.innerHTML = str || '<tr><td colspan="2" class="text-center text-muted">Sin datos</td></tr>';
            foot.innerText = F.setMoneda(varTotal, 'Q');
            proveedor_renderVendedorMarcasChart(items, nombre);
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="2" class="text-center text-muted">No se cargaron datos</td></tr>';
            foot.innerText = '--';
            proveedor_destroyVendedorMarcasChart();
        });
}

let proveedor_marcaSeleccionada = '';

function proveedor_destroyMarcasVendedorChart() {
    if (proveedor_marcasVendedorChart) {
        proveedor_marcasVendedorChart.destroy();
        proveedor_marcasVendedorChart = null;
    }
}

function proveedor_renderMarcasVendedorChart(items, desmarca) {
    proveedor_destroyMarcasVendedorChart();

    const canvas = document.getElementById('chartMarcasVendedor');
    if (!canvas || !items.length || typeof Chart === 'undefined') return;

    const labels = items.map((r) => r.EMPLEADO);
    const values = items.map((r) => Number(r.TOTALPRECIO));
    const bgColor = labels.map(() => getRandomColor());

    proveedor_marcasVendedorChart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Importe',
                data: values,
                backgroundColor: bgColor,
                borderRadius: 6,
                maxBarThickness: 42
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: `${proveedor_labelModoVentas()} por vendedor — ${desmarca}`,
                    font: { size: 12 }
                }
            },
            scales: {
                x: {
                    ticks: { maxRotation: 45, minRotation: 0, font: { size: 10 } }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => F.setMoneda(value, 'Q')
                    }
                }
            }
        }
    });
}

function proveedor_resetMarcasDetalle() {
    proveedor_marcaSeleccionada = '';
    proveedor_destroyMarcasVendedorChart();
    const lbVendedor = document.getElementById('lbMarcasVendedor');
    const detalle = document.getElementById('tblDataMarcasVendedor');
    const foot = document.getElementById('lbFootMarcasVendedorImporte');
    if (lbVendedor) lbVendedor.innerText = 'Ventas por vendedor';
    if (detalle) detalle.innerHTML = '<tr><td colspan="2" class="text-center text-muted py-4">Seleccione una marca</td></tr>';
    if (foot) foot.innerText = '--';
}

function proveedor_setMarcaActiva(codmarca) {
    proveedor_marcaSeleccionada = String(codmarca);
    document.querySelectorAll('#tblDataMarcas tr[data-codmarca]').forEach((row) => {
        row.classList.toggle('proveedor-rpt-marcas__row--active', row.dataset.codmarca === proveedor_marcaSeleccionada);
    });
}

function tbl_rpt_marcas() {
    const mes = proveedor_getMes();
    const anio = proveedor_getAnio();
    const container = document.getElementById('tblDataMarcas');
    if (!container) return;

    container.innerHTML = GlobalLoader;
    proveedor_resetMarcasDetalle();

    const sucursal = proveedor_getSucursal();
    const modo = proveedor_getModoVentas();

    RPT.data_marcas(sucursal, mes, anio, modo)
        .then((data) => {
            const items = [...data.recordset].sort((a, b) => Number(b.TOTALPRECIO) - Number(a.TOTALPRECIO));
            let varTotal = 0;
            let str = '';

            items.forEach((r) => {
                varTotal += Number(r.TOTALPRECIO);
                const desmarcaAttr = String(r.DESMARCA || '').replace(/"/g, '&quot;');
                str += `
                    <tr class="proveedor-rpt-marcas__row hand" data-codmarca="${r.CODMARCA}" data-desmarca="${desmarcaAttr}">
                        <td>${r.DESMARCA}</td>
                        <td class="text-right">${F.setMoneda(r.TOTALPRECIO, 'Q')}</td>
                    </tr>
                `;
            });

            container.innerHTML = str || '<tr><td colspan="2" class="text-center text-muted">Sin datos</td></tr>';
            document.getElementById('lbTotalMImporte').innerText = `Total: ${F.setMoneda(varTotal, 'Q')}`;
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="2" class="text-center text-muted">No se cargaron datos</td></tr>';
            document.getElementById('lbTotalMImporte').innerText = '';
        });
}

function tbl_rpt_marcas_vendedores(codmarca, desmarca, mes, anio) {
    const container = document.getElementById('tblDataMarcasVendedor');
    const foot = document.getElementById('lbFootMarcasVendedorImporte');
    if (!container || !foot) return;

    proveedor_setMarcaActiva(codmarca);
    document.getElementById('lbMarcasVendedor').innerText = `Ventas por vendedor — ${desmarca}`;

    container.innerHTML = `<tr><td colspan="2" class="text-center">${GlobalLoader}</td></tr>`;
    foot.innerText = '--';
    proveedor_destroyMarcasVendedorChart();

    const sucursal = proveedor_getSucursal();
    const mesVal = mes || proveedor_getMes();
    const anioVal = anio || proveedor_getAnio();
    const modo = proveedor_getModoVentas();

    RPT.data_marcas_vendedores(sucursal, codmarca, mesVal, anioVal, modo)
        .then((data) => {
            const items = [...data.recordset].sort((a, b) => Number(b.TOTALPRECIO) - Number(a.TOTALPRECIO));
            let varTotal = 0;
            let str = '';

            items.forEach((r) => {
                varTotal += Number(r.TOTALPRECIO);
                str += `
                    <tr>
                        <td>
                            ${r.EMPLEADO}
                            <br><small class="text-muted">${r.EMPRESA || ''}</small>
                        </td>
                        <td class="text-right">${F.setMoneda(r.TOTALPRECIO, 'Q')}</td>
                    </tr>
                `;
            });

            container.innerHTML = str || '<tr><td colspan="2" class="text-center text-muted">Sin datos</td></tr>';
            foot.innerText = F.setMoneda(varTotal, 'Q');
            proveedor_renderMarcasVendedorChart(items, desmarca);
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="2" class="text-center text-muted">No se cargaron datos</td></tr>';
            foot.innerText = '--';
            proveedor_destroyMarcasVendedorChart();
        });
}


function tbl_rpt_sellout(){

    let fi = F.devuelveFecha('txtSFechaInicial');
    let ff = F.devuelveFecha('txtSFechaFinal');


    let container = document.getElementById('tblDataSellout');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

    let sucursal = proveedor_getSucursal();

   
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




function tbl_inventario(){

    let container = document.getElementById('tblDataInventario');
    container.innerHTML = GlobalLoader;

    let st = document.getElementById('cmbSt').value;

    let sucursal = proveedor_getSucursal();


    GF.get_data_inventarios_general(sucursal,st)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{

            let SELLOUT = F.get_existencia(Number(r.SELLOUT),Number(r.UXC)).toFixed(2);
            let CAJAS = F.get_existencia(Number(r.TOTALUNIDADES),Number(r.UXC)).toFixed(2);

            str += `
            <tr>
                <td>${r.CODPROD}</td>
                <td>${r.CODPROD2}</td>
                <td>${r.DESPROD3}</td>
                <td>${r.DESPROD}</td>
                <td>${r.DESMARCA}</td>
                <td>${F.setMoneda((Number(r.TOTALUNIDADES)*Number(r.COSTO)),'Q')}</td>
                <td>${CAJAS}</td>

                <td>${SELLOUT}</td>
                <td>${F.get_existencia(Number(CAJAS),Number(SELLOUT)).toFixed(2)}</td>
            </tr>
            `
        })
        container.innerHTML = str;

        //F.initit_datatable('tblInventario', true);

    })
    .catch(()=>{

        container.innerHTML = 'No se cargaron datos...';
    })


    

};








//OBJETIVOS

function proveedor_resolveObjetivosData(data) {
    if (!data || data.toString() === 'error') return Promise.reject();
    if (Array.isArray(data.recordset)) return Promise.resolve(data);
    if (Number(data.rowsAffected?.[0]) > 0) return Promise.resolve(data);
    return Promise.reject();
}

function proveedor_pctLogro(importe, objetivo) {
    const obj = Number(objetivo);
    if (!obj) return 0;
    return (Number(importe) / obj) * 100;
}

function listeners_objetivos(){
    document.getElementById('btnMenuObjetivos').addEventListener('click',()=>{
        proveedor_showPanel('seis', 'btnMenuObjetivos', ()=>{
            selected_tab = 'OBJETIVOS';
            get_reportes();
        });
    });

    document.getElementById('tblObjetivosMarcas')?.addEventListener('click', (e) => {
        const row = e.target.closest('tr[data-codmarca]');
        if (!row) return;
        get_detalle_marca(row.dataset.codmarca, row.dataset.desmarca || '');
    });

    document.getElementById('tblObjetivosVendedores')?.addEventListener('click', (e) => {
        const row = e.target.closest('tr[data-codemp]');
        if (!row) return;
        get_detalle_vendedor(row.dataset.codemp, row.dataset.nombre || '');
    });
};

function get_reportes(){

    let sucursal = proveedor_getSucursal();
    let mes = proveedor_getMes();
    let anio = proveedor_getAnio();

    tbl_logro_marcas(sucursal,mes,anio);
    
    tbl_logro_vendedores(sucursal,mes,anio);


};


function get_data_logro_marcas(sucursal,mes,anio){
     return new Promise((resolve,reject)=>{
            axios.post(GlobalUrlCalls + '/objetivos/select_logro_marcas', {
                    token:TOKEN,
                    sucursal:sucursal,
                    mes:mes,
                    anio:anio})
            .then((response) => {
                if (response.status.toString() === '200') {
                    proveedor_resolveObjetivosData(response.data).then(resolve).catch(reject);
                } else {
                    reject();
                }
            }, () => reject());
        });
};

function tbl_logro_marcas(sucursal,mes,anio){
    const container = document.getElementById('tblDataMarcas2');
    if (!container) return;

    container.innerHTML = `<tr><td colspan="5" class="text-center">${GlobalLoader}</td></tr>`;

    let conteo = 0;
    let varTotalObjetivo = 0;
    let varTotalImporte = 0;
    let varTotalFaltan = 0;
    let varTotalLogro = 0;

    get_data_logro_marcas(sucursal,mes,anio)
    .then((data)=>{
        const items = data.recordset || [];
        let str = '';

        items.forEach((r) => {
            conteo += 1;
            const varFaltan = Number(r.OBJETIVO) - Number(r.TOTALPRECIO);
            const varLOGRO = proveedor_pctLogro(r.TOTALPRECIO, r.OBJETIVO);
            varTotalObjetivo += Number(r.OBJETIVO);
            varTotalImporte += Number(r.TOTALPRECIO);
            varTotalFaltan += varFaltan;
            varTotalLogro += varLOGRO;

            const desmarcaAttr = String(r.MARCA || '').replace(/"/g, '&quot;');
            const strLogro = get_color_logro(Number(varLOGRO));
            str += `
            <tr class="${strLogro} hand" data-codmarca="${r.CODIGO_MARCA}" data-desmarca="${desmarcaAttr}">
                <td>${r.MARCA}</td>
                <td class="text-right">${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td class="text-right">${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td class="text-right">${F.setMoneda(varFaltan,'Q')}</td>
                <td class="text-right">${varLOGRO.toFixed(2)}%</td>
            </tr>`;
        });

        container.innerHTML = str || '<tr><td colspan="5" class="text-center text-muted">Sin datos</td></tr>';
        document.getElementById('lbTotalMarcasImporte').innerText = F.setMoneda(varTotalImporte,'Q');
        document.getElementById('lbTotalMarcasObjetivo').innerText = F.setMoneda(varTotalObjetivo,'Q');
        document.getElementById('lbTotalMarcasFalta').innerText = F.setMoneda(varTotalFaltan,'Q');
        document.getElementById('lbTotalMarcasLogro').innerText = conteo ? `${(varTotalLogro / conteo).toFixed(2)}%` : '--';
    })
    .catch(()=>{
        container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se cargaron datos</td></tr>';
        document.getElementById('lbTotalMarcasImporte').innerText = '';
        document.getElementById('lbTotalMarcasObjetivo').innerText = '';
        document.getElementById('lbTotalMarcasFalta').innerText = '';
        document.getElementById('lbTotalMarcasLogro').innerText = '';
    });
};



function get_data_logro_vendedores(sucursal,mes,anio){
     return new Promise((resolve,reject)=>{
            axios.post(GlobalUrlCalls + '/objetivos/select_logro_vendedores', {
                    token:TOKEN,
                    sucursal:sucursal,
                    mes:mes,
                    anio:anio})
            .then((response) => {
                if (response.status.toString() === '200') {
                    proveedor_resolveObjetivosData(response.data).then(resolve).catch(reject);
                } else {
                    reject();
                }
            }, () => reject());
        });
};

function tbl_logro_vendedores(sucursal,mes,anio){
    const container = document.getElementById('tblDataVendedores2');
    if (!container) return;

    container.innerHTML = `<tr><td colspan="5" class="text-center">${GlobalLoader}</td></tr>`;

    let conteo = 0;
    let varTotalObjetivo = 0;
    let varTotalImporte = 0;
    let varTotalFaltan = 0;
    let varTotalLogro = 0;

    get_data_logro_vendedores(sucursal,mes,anio)
    .then((data)=>{
        const items = data.recordset || [];
        let str = '';

        items.forEach((r) => {
            conteo += 1;
            const varFaltan = Number(r.OBJETIVO) - Number(r.TOTALPRECIO);
            const varLOGRO = proveedor_pctLogro(r.TOTALPRECIO, r.OBJETIVO);
            varTotalObjetivo += Number(r.OBJETIVO);
            varTotalImporte += Number(r.TOTALPRECIO);
            varTotalFaltan += varFaltan;
            varTotalLogro += varLOGRO;

            const nombreAttr = String(r.VENDEDOR || '').replace(/"/g, '&quot;');
            const strLogro = get_color_logro(Number(varLOGRO));
            str += `
            <tr class="${strLogro} hand" data-codemp="${r.CODIGO_VENDEDOR}" data-nombre="${nombreAttr}">
                <td>${r.VENDEDOR}<br><small class="text-muted">${r.EMPRESA || ''}</small></td>
                <td class="text-right">${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td class="text-right">${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td class="text-right">${F.setMoneda(varFaltan,'Q')}</td>
                <td class="text-right">${varLOGRO.toFixed(2)}%</td>
            </tr>`;
        });

        container.innerHTML = str || '<tr><td colspan="5" class="text-center text-muted">Sin datos</td></tr>';
        document.getElementById('lbTotalVendedoresImporte').innerText = F.setMoneda(varTotalImporte,'Q');
        document.getElementById('lbTotalVendedoresObjetivo').innerText = F.setMoneda(varTotalObjetivo,'Q');
        document.getElementById('lbTotalVendedoresFalta').innerText = F.setMoneda(varTotalFaltan,'Q');
        document.getElementById('lbTotalVendedoresLogro').innerText = conteo ? `${(varTotalLogro / conteo).toFixed(2)}%` : '--';
    })
    .catch(()=>{
        container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se cargaron datos</td></tr>';
        document.getElementById('lbTotalVendedoresImporte').innerText = '';
        document.getElementById('lbTotalVendedoresObjetivo').innerText = '';
        document.getElementById('lbTotalVendedoresFalta').innerText = '';
        document.getElementById('lbTotalVendedoresLogro').innerText = '';
    });
};

//OBJETIVOS


function get_detalle_marca(codmarca, desmarca){
    $("#modal_categorias_marca").modal('show');
    document.getElementById('lbMarcasDescategoria').innerText = desmarca;
    tbl_logro_categorias_marca(codmarca);
}

function get_detalle_vendedor(codemp, nombre){
    $("#modal_categorias_vendedor").modal('show');
    document.getElementById('lbVendedorCategorias').innerText = nombre;
    tbl_detalle_vendedor(codemp);
}


function get_data_logro_categorias_marcas(sucursal,codmarca,mes,anio){
     return new Promise((resolve,reject)=>{
            axios.post(GlobalUrlCalls + '/objetivos/select_logro_marcas_categorias', {
                    token:TOKEN,
                    sucursal:sucursal,
                    codmarca:codmarca,
                    mes:mes,
                    anio:anio})
            .then((response) => {
                if (response.status.toString() === '200') {
                    proveedor_resolveObjetivosData(response.data).then(resolve).catch(reject);
                } else {
                    reject();
                }
            }, () => reject());
        });
};

function get_data_vendedor_categorias(codemp, mes, anio){
    return new Promise((resolve, reject) => {
        axios.post(GlobalUrlCalls + '/objetivos/select_logro_vendedores_categorias_todas', {
            token: TOKEN,
            codemp: codemp,
            mes: mes,
            anio: anio,
            sucursal: proveedor_getSucursal()
        })
        .then((response) => {
            if (response.status.toString() === '200') {
                proveedor_resolveObjetivosData(response.data).then(resolve).catch(reject);
            } else {
                reject();
            }
        }, () => reject());
    });
}

function tbl_logro_categorias_marca(codmarca){
    const container = document.getElementById('tblDataCategoriasMarca');
    if (!container) return;

    container.innerHTML = `<tr><td colspan="5" class="text-center">${GlobalLoader}</td></tr>`;

    const sucursal = proveedor_getSucursal();
    const mes = proveedor_getMes();
    const anio = proveedor_getAnio();

    get_data_logro_categorias_marcas(sucursal, codmarca, mes, anio)
    .then((data)=>{
        let str = '';
        (data.recordset || []).forEach((r) => {
            const varLOGRO = proveedor_pctLogro(r.TOTALPRECIO, r.OBJETIVO);
            const strLogro = get_color_logro(Number(varLOGRO));
            str += `
            <tr class="${strLogro}">
                <td>${r.CATEGORIA}</td>
                <td class="text-right">${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td class="text-right">${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td class="text-right">${F.setMoneda(Number(r.OBJETIVO) - Number(r.TOTALPRECIO),'Q')}</td>
                <td class="text-right">${varLOGRO.toFixed(2)}%</td>
            </tr>`;
        });
        container.innerHTML = str || '<tr><td colspan="5" class="text-center text-muted">Sin datos</td></tr>';
    })
    .catch(()=>{
        container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se cargaron datos</td></tr>';
    });
};

function tbl_detalle_vendedor(codemp){
    const container = document.getElementById('tblDataVendedorCategorias');
    if (!container) return;

    container.innerHTML = `<tr><td colspan="5" class="text-center">${GlobalLoader}</td></tr>`;

    const mes = proveedor_getMes();
    const anio = proveedor_getAnio();

    get_data_vendedor_categorias(codemp, mes, anio)
    .then((data) => {
        let str = '';
        (data.recordset || []).forEach((r) => {
            const logro = Number(r.LOGRO ?? r.TOTALPRECIO ?? 0);
            const varLOGRO = proveedor_pctLogro(logro, r.OBJETIVO);
            const strLogro = get_color_logro(Number(varLOGRO));
            str += `
            <tr class="${strLogro}">
                <td>${r.CATEGORIA}</td>
                <td class="text-right">${F.setMoneda(logro,'Q')}</td>
                <td class="text-right">${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td class="text-right">${F.setMoneda(Number(r.OBJETIVO) - logro,'Q')}</td>
                <td class="text-right">${varLOGRO.toFixed(2)}%</td>
            </tr>`;
        });
        container.innerHTML = str || '<tr><td colspan="5" class="text-center text-muted">Sin datos</td></tr>';
    })
    .catch(() => {
        container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se cargaron datos</td></tr>';
    });
};

window.get_detalle_marca = get_detalle_marca;
window.get_detalle_vendedor = get_detalle_vendedor;
window.get_reportes = get_reportes;