var supervisor_embedDestroy = null;
var supervisor_currentPane = 'uno';
var supervisor_dashboardCharts = {};

function supervisor_getSucursal() {
    return GlobalEmpnit || document.getElementById('cmbSucursalHeader')?.value || '%';
}

function supervisor_getMes() {
    return document.getElementById('cmbMesHeader')?.value || F.get_mes_curso();
}

function supervisor_getAnio() {
    return document.getElementById('cmbAnioHeader')?.value || F.get_anio_curso();
}

function supervisor_getModoVentas() {
    return document.getElementById('cmbSupervisorModoVentas')?.value || 'bruta';
}

function supervisor_labelModoVentas() {
    return supervisor_getModoVentas() === 'neta' ? 'Ventas netas' : 'Ventas brutas';
}

function supervisor_setupSucursalHeader() {
    const cmb = document.getElementById('cmbSucursalHeader');
    if (!cmb) return;
    const emp = GlobalEmpnit || '%';
    const nom = GlobalNomEmpresa || 'Sede';
    cmb.innerHTML = `<option value="${emp}">${nom}</option>`;
    cmb.value = emp;
    cmb.disabled = true;
}

function supervisor_onHeaderFiltersChange() {
    if (supervisor_currentPane === 'uno') {
        supervisor_initDashboard();
    }
}

function supervisor_initDashboard() {
    supervisor_loadDashboard();
}

var SUPERVISOR_EMBED_BASE = '../views/menu/INICIO_SUPERVISOR/';
var SUPERVISOR_EMBED_SCRIPTS = {
    btnMenuClientes: SUPERVISOR_EMBED_BASE + 'view_clientes.js',
    btnMenuObjetivos: SUPERVISOR_EMBED_BASE + 'view_avance_procter_vendedor.js',
    btnMenuCoberturaMunicipio: SUPERVISOR_EMBED_BASE + 'view_cobertura_municipios_mapa.js',
    btnMenuRptVisitasMapa: SUPERVISOR_EMBED_BASE + 'view_visitas_vendedores_gps.js',
};

function supervisor_bindEmbedMenu(cardId) {
    const scriptUrl = SUPERVISOR_EMBED_SCRIPTS[cardId];
    if (!scriptUrl) return;
    document.getElementById(cardId)?.addEventListener('click', () => {
        supervisor_loadEmbed(scriptUrl, cardId);
    });
}

function supervisor_setActiveCard(cardId) {
    document.querySelectorAll('.proveedor-menu-card').forEach(el => {
        el.classList.toggle('proveedor-menu-card--active', !!cardId && el.id === cardId);
    });
}

function supervisor_toggleSidebar(forceOpen) {
    const sidebar = document.getElementById('supervisorSidebar');
    const backdrop = document.getElementById('supervisorSidebarBackdrop');
    if (!sidebar) return;
    const open = typeof forceOpen === 'boolean' ? forceOpen : !sidebar.classList.contains('proveedor-sidebar--open');
    sidebar.classList.toggle('proveedor-sidebar--open', open);
    backdrop?.classList.toggle('proveedor-sidebar-backdrop--visible', open);
    document.body.classList.toggle('proveedor-sidebar-open', open);
}

function supervisor_closeSidebarMobile() {
    if (window.innerWidth < 768) supervisor_toggleSidebar(false);
}

function supervisor_showPanel(paneId, cardId, afterShow) {
    supervisor_currentPane = paneId;
    supervisor_closeSidebarMobile();
    supervisor_teardownEmbed();
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
    supervisor_setActiveCard(cardId);
    if (typeof afterShow === 'function') afterShow();
}

function supervisor_showHome() {
    supervisor_showPanel('uno', 'btnMenuDashboard', () => supervisor_initDashboard());
}

function supervisor_teardownEmbed() {
    if (supervisor_embedDestroy) {
        try { supervisor_embedDestroy(); } catch (e) { /* vista embebida sin teardown */ }
        supervisor_embedDestroy = null;
    }
    document.querySelector('script[data-supervisor-embed]')?.remove();
    const embed = document.getElementById('supervisorPanelEmbed');
    if (embed) {
        embed.classList.add('d-none');
        embed.innerHTML = '';
    }
    document.getElementById('myTabHomeContent')?.classList.remove('d-none');
    if (window._supervisorCore) {
        window.initView = window._supervisorCore.initView;
        window.destroyView = window._supervisorCore.destroyView;
    }
}

function supervisor_rewireEmbedActions(container) {
    if (!container) return;
    container.querySelectorAll('[data-spa-action="inicio"]').forEach(btn => btn.remove());
    container.querySelectorAll('button.btn-bottom-l').forEach(btn => {
        if (!btn.hasAttribute('data-dismiss') && !btn.hasAttribute('data-supervisor-keep')) btn.remove();
    });
}

function supervisor_loadEmbed(scriptUrl, cardId) {
    supervisor_closeSidebarMobile();
    supervisor_teardownEmbed();
    document.getElementById('myTabHomeContent')?.classList.add('d-none');
    supervisor_setActiveCard(cardId || null);
    const embed = document.getElementById('supervisorPanelEmbed');
    embed.classList.remove('d-none');
    embed.innerHTML = GlobalLoader;

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = scriptUrl + (scriptUrl.includes('?') ? '&' : '?') + '_se=' + Date.now();
        script.setAttribute('data-supervisor-embed', 'true');
        script.onload = () => {
            const embedRoot = embed;
            const savedRoot = root;
            root = embedRoot;
            if (typeof initView === 'function') {
                initView();
                supervisor_embedDestroy = typeof destroyView === 'function' ? destroyView : null;
            }
            root = savedRoot;
            if (window._supervisorCore) {
                window.initView = window._supervisorCore.initView;
                window.destroyView = window._supervisorCore.destroyView;
            }
            supervisor_rewireEmbedActions(embedRoot);
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
            <div class="proveedor-header-card card shadow-sm mb-3">
                <div class="card-body py-2 px-3">
                    <div class="row align-items-center no-gutters">
                        <div class="col-auto pr-2">
                            <img src="./favicon.png" width="50" height="50" alt="Logo">
                        </div>
                        <div class="col-auto pr-3">
                            <h5 class="negrita text-white mb-0">INICIO SUPERVISOR</h5>
                            <small class="text-white-50 negrita d-block">${GlobalUsuario}</small>
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
                            <select class="form-control form-control-sm negrita" id="cmbSupervisorModoVentas" title="Tipo de ventas">
                                <option value="neta">Ventas netas (venta - devolución)</option>
                                <option value="bruta" selected>Ventas brutas (solo ventas)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <button type="button" class="btn proveedor-menu-toggle d-md-none" id="btnSupervisorMenuToggle" title="Menú de opciones">
                <i class="fal fa-bars"></i><span>Menú</span>
            </button>
            <div class="proveedor-sidebar-backdrop d-md-none" id="supervisorSidebarBackdrop"></div>

            <div class="row proveedor-main-row">
                <div class="col-12 col-md-2 proveedor-sidebar" id="supervisorSidebar">
                    <div class="proveedor-sidebar__scroll">
                        ${view.menu()}
                    </div>
                </div>
                <div class="col-12 col-md-10 proveedor-tab-area">
                    <div id="supervisorPanelContent">
                    <div id="supervisorPanelEmbed" class="d-none"></div>
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            <div id="supervisorMainContent">
                                ${view.vista_dashboard()}
                            </div>
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_marcas()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_facturas() + view.modal_detalle_documento()}
                        </div>
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_productos()}
                        </div>
                        <div class="tab-pane fade" id="cinco" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_vendedores()}
                        </div>
                        <div class="tab-pane fade" id="seis" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_inventarios()}
                        </div>
                        <div class="tab-pane fade" id="siete" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_clientes()}
                        </div>
                        <div class="tab-pane fade" id="ocho" role="tabpanel" aria-labelledby="home-tab">
                            ${view.objetivos() + view.modal_categorias_marca() + view.modal_categorias_vendedor()}
                        </div>
                        <div class="tab-pane fade" id="nueve" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_gestion_rutas()}
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
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-nueve" data-toggle="tab" href="#nueve" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>         
                    </ul>
            </div>
            `
        },
        menu:()=>{
            const items = [
                { id: 'btnMenuDashboard', label: 'Dashboard', icon: 'fa-chart-line', color: 'primary' },
                { id: 'btnMenuClientes', label: 'Gestión Clientes', icon: 'fa-user', color: 'info' },
                { id: 'btnMenuObjetivos', label: 'Logro objetivos P&G', icon: 'fa-chart-pie', color: 'danger' },
                { id: 'btnMenuCoberturaMunicipio', label: 'Cobertura municipios', icon: 'fa-globe', color: 'primary' },
                { id: 'btnMenuRptVisitasMapa', label: 'Visitas vendedor mapa', icon: 'fa-map-signs', color: 'secondary' },
                { id: 'btnMenuRptInventario', label: 'Inventario', icon: 'fa-warehouse', color: 'secondary' },
                { id: 'btnMenuRptVendedores', label: 'Ventas vendedores', icon: 'fa-chart-bar', color: 'secondary' },
                { id: 'btnMenuRptMarcas', label: 'Reporte marcas', icon: 'fa-list', color: 'secondary' },
                { id: 'btnMenuRptDocumentos', label: 'Reporte facturas', icon: 'fa-chart-pie', color: 'secondary' },
                { id: 'btnMenuRptProductos', label: 'Reporte productos', icon: 'fa-box', color: 'secondary' },
                { id: 'btnMenuRptClientesVendedor', label: 'Clientes por vendedor', icon: 'fa-map', color: 'secondary' },
                { id: 'btnMenuGestionRutas', label: 'Gestion de Rutas', icon: 'fa-road', color: 'warning' },
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
        vista_dashboard:()=>{
            return `
            <div class="proveedor-dashboard">
                <div class="row">
                    <div class="col-12 col-lg-6 mb-3 mb-lg-0">
                        <div class="card card-rounded shadow h-100 proveedor-dashboard-card">
                            <div class="card-body p-3">
                                <h5 class="negrita text-info mb-3">Ventas por vendedor</h5>
                                <div class="proveedor-dashboard-chart mb-3">
                                    <canvas id="chartSupDashVentasVendedor"></canvas>
                                </div>
                                <div class="table-responsive proveedor-dashboard-scroll">
                                    <table class="table table-sm table-bordered h-full col-12" id="tblSupDashVentasVendedor">
                                        <thead class="bg-info text-white negrita">
                                            <tr>
                                                <td>VENDEDOR</td>
                                                <td>PEDIDOS</td>
                                                <td>IMPORTE</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataSupDashVentasVendedor"></tbody>
                                        <tfoot class="bg-info text-white negrita">
                                            <tr>
                                                <td>TOTALES</td>
                                                <td id="lbSupFootDashVendedorPedidos">--</td>
                                                <td id="lbSupFootDashVendedorImporte">--</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6">
                        <div class="card card-rounded shadow h-100 proveedor-dashboard-card">
                            <div class="card-body p-3">
                                <h5 class="negrita text-secondary mb-3">Ventas por marca</h5>
                                <div class="proveedor-dashboard-chart mb-3">
                                    <canvas id="chartSupDashVentasMarca"></canvas>
                                </div>
                                <div class="table-responsive proveedor-dashboard-scroll">
                                    <table class="table table-sm table-bordered h-full col-12" id="tblSupDashVentasMarca">
                                        <thead class="bg-secondary text-white negrita">
                                            <tr>
                                                <td>MARCA</td>
                                                <td>IMPORTE</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataSupDashVentasMarca"></tbody>
                                        <tfoot class="bg-secondary text-white negrita">
                                            <tr>
                                                <td>TOTAL</td>
                                                <td id="lbSupFootDashMarcaImporte">--</td>
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
        vista_listado:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">
                    <div class="table-responsive col-12">
                        <table class="table table-responsive  col-12">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblPedidos">
                            </tbody>
                        </table>
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
        rpt_marcas:()=>{
            return `

                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Reporte de Marcas</h4>
                            
                        </div>
                        <div class="col-6">
                         
                            <label class="negrita text-danger" id="lbMarcaTotalImporte">Importe:</label>
                        </div>
                    </div>

                    <br>

                    <div class="row">
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Fecha inicio</label>
                                        <input type="date" class="form-control negrita text-danger" id="txtMarcaFechaInicial">
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Fecha Final</label>
                                        <input type="date" class="form-control negrita text-danger" id="txtMarcaFechaFinal">
                                    </div>
                                </div>

                    </div>

                    <br>
                    

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblMarcas">
                                <thead class="bg-success text-white negrita">
                                    <tr>
                                        <td>MARCA</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataMarcas"></tbody>

                            </table>

                    </div>

            
            `
        },
        rpt_facturas:()=>{
            return `
            
            <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4 table-responsive">
                        
                            
                            <div class="row">
                                <div class="col-6">
                                    <h4>LISTADO DE FACTURAS (VENTAS)</h4>
                                  
                                </div>
                                <div class="col-6">
                                    <h3 class="negrita text-danger" id="lbTotalFacturasImporte"></h3>
                                    <h4 class="negrita text-info" id="lbTotalFacturasConteo"></h3>
                                    
                                </div>
                            </div>
                            <br>
                            <div class="row">
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="text-secondary">Fecha Inicial</label>
                                                <input type="date" class="form-control negrita" id='txtRptFacturasFechaInicial'>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="text-secondary">Fecha Final</label>
                                                <input type="date" class="form-control negrita" id='txtRptFacturasFechaFinal'>
                                            </div>
                                        </div>
                            </div>
                            <br>

                            <table class="table h-full table-bordered col-12" id="tblPedidos">
                                <thead class="bg-base text-white negrita">
                                    <tr>
                                        <td class="text-left">EMBARQUE</td>
                                        <td>VENDEDOR</td>
                                        <td>CLIENTE</td>
                                        <td>MUNICIPIO</td>
                                        <td>IMPORTE</td>
                                        <td>ST</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataPedidos"></tbody>

                            </table>
                        

                        </div>
                    </div>
            
            `
        },
        modal_detalle_documento:()=>{
            return `
            <div id="modal_detalle_pedido" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-base d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Detalle del Documento
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-2">

                                        <h4 class="negrita text-base" id="lbDetalleTomarDatosNombre"></h4>
                                        <br>

                                        <div class="table-responsive col-12">
                                            <table class="table table-responsive table-bordered ">
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

                                            <div class="form-group">
                                                <label class="negrita text-base">Observaciones</label>
                                                <textarea class="form-control negrita" id="txtDetallePedidoObs" rows="4"></textarea>
                                            </div>

                                        
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
            <div class="card card-rounded shadow col-12" id="rpt_productos_embarque">
                <div class="card-body p-4">
            
                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Productos Vendidos</h4>
                            <h5 id="lbProdCodembarque"></h5>
                            <br>
                        </div>
                        <div class="col-6">
                            <label class="negrita text-info" id="lbProdTotalPedidos">Pedidos:</label>
                            <br>
                            <label class="negrita text-danger" id="lbProdTotalImporte">Importe:</label>
                        </div>
                    </div>

                    <br>
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label class="text-secondary">Fecha Inicial</label>
                                    <input type="date" class="form-control negrita" id='txtRptProdFechaInicial'>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label class="text-secondary">Fecha Final</label>
                                    <input type="date" class="form-control negrita" id='txtRptProdFechaFinal'>
                                </div>
                            </div>
                        </div>
                        <br>

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblFProductos">
                                <thead class="bg-secondary text-white negrita">
                                    <tr>
                                        <td>CODIGO</td>
                                        <td>PRODUCTO</td>
                                        <td>UXC</td>
                                        <td>CAJAS</td>
                                        <td>UNIDADES</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataFProductos"></tbody>

                            </table>

                    </div>
            

                </div>
            </div>

            <button class="btn btn-info btn-xl btn-circle hand shadow btn-bottom-r" onclick="F.imprimirSelec('rpt_productos_embarque')">
                <i class="fal fa-print"></i>
            </button>
            
            
            
            `
        },
        rpt_vendedores:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
            
                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Ventas por Vendedor</h4>
                            
                            <br>
                        </div>
                        <div class="col-6">
                            <br>
                            <label class="negrita text-info h5" id="lbVenTotalPedidos">Pedidos:</label>
                            
                            <br>
                            <label class="negrita text-danger h4" id="lbVenTotalImporte">Importe:</label>
                        </div>
                    </div>

                    <br>
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label class="text-secondary">Fecha Inicial</label>
                                    <input type="date" class="form-control negrita" id='txtRptVenFechaInicial'>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label class="text-secondary">Fecha Final</label>
                                    <input type="date" class="form-control negrita" id='txtRptVenFechaFinal'>
                                </div>
                            </div>
                        </div>
                        <br>

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblVendedores">
                                <thead class="bg-base text-white negrita">
                                    <tr>
                                        <td>VENDEDOR</td>
                                        <td>PEDIDOS</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataVendedores"></tbody>
                                <t>

                            </table>

                    </div>
            

                </div>
            </div>

            
            
            `
        },
        rpt_inventarios:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">
                    
                    <h3 class="negrita text-danger">INVENTARIO ACTUAL</h3>

                    <div class="row">
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                             <div class="input-group">
                                <select class="form-control negrita text-base" id="cmbSt">
                                    <option value="SI">PRODUCTOS HABILITADOS</option>
                                    <option value="NO">PRODUCTOS NO HABILITADOS</option>
                                </select>
                                <input type="text" class="form-control" placeholder="Escriba para buscar..." id="txtBuscarProductoInventario" oninput="F.FiltrarTabla('tblInventario','txtBuscarProductoInventario')">

                            </div>
                        </div>
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <h5 id="lbTotalItems"></h5>
                        </div>
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <button class="btn btn-success btn-md hand shadow" id="btnExportarInventario">
                                <i class="fal fa-share"></i> Exportar Excel
                            </button>
                        </div>
                    </div>

                    <div class="table-responsive col-12">
                        <table class="table h-full  col-12" id="tblInventario">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>CODIGO</td>
                                    <td>CODIGO 2</td>
                                    <td>CODIGO 3</td>
                                    <td>PRODUCTO</td>
                                    <td>MARCA</td>
                                    <td>TOTALCOSTO</td>
                                    <td>EXISTENCIA</td>
                                    <td>FARDOS</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataInventario">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            `
        },
        rpt_clientes:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                    
                    <h3 class="negrita text-secondary">CLIENTES POR VENDEDOR</h3>
                    <h3 class="negrita text-danger" id="lbTotalClientesVendedores"></h3>
                    

                    <div class="table-responsive col-12">
                        <table class="table h-full  col-12" id="">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <td>VENDEDOR</td>
                                    <td>LUNES</td>
                                    <td>MARTES</td>
                                   <td>MIERCOLES</td>
                                   <td>JUEVES</td>
                                   <td>VIERNES</td>
                                   <td>SABADO</td>
                                   <td>DOMINGO</td>
                                    <td>TOTAL</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataClientesVendedor">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            `
        },
        vista_gestion_rutas:()=>{
            return `
            <div class="card card-rounded shadow col-12 border-0 sygma-gestion-rutas">
                <div class="card-body p-3 p-md-4">
                    <div class="row align-items-end mb-3">
                        <div class="col-12 col-md-4 mb-2 mb-md-0">
                            <label class="negrita text-secondary mb-1" for="cmbSupervisorGestionRutasTipo">Tipo de rutas</label>
                            <select class="form-control negrita" id="cmbSupervisorGestionRutasTipo">
                                <option value="clientes">Rutas Clientes</option>
                                <option value="mercaderistas">Rutas Mercaderistas</option>
                            </select>
                        </div>
                        <div class="col-12 col-md-8 text-md-right">
                            <h5 class="negrita text-base mb-1" id="lbSupervisorGestionRutasTitulo">Rutas Clientes</h5>
                            <small class="text-muted" id="lbSupervisorGestionRutasTotal">0 rutas</small>
                        </div>
                    </div>
                    <div class="mb-2">
                        <input type="search" class="form-control"
                            id="txtSupervisorGestionRutasBuscar"
                            placeholder="Buscar código, ruta o empleado..."
                            oninput="F.FiltrarTabla('tblSupervisorGestionRutas','txtSupervisorGestionRutasBuscar')">
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm table-hover table-bordered mb-0" id="tblSupervisorGestionRutas">
                            <thead class="bg-base text-white">
                                <tr>
                                    <th>CÓDIGO</th>
                                    <th>RUTA</th>
                                    <th id="thSupervisorRutaEmpleado">VENDEDOR</th>
                                    <th class="text-center">EDITAR</th>
                                    <th class="text-center">ELIMINAR</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataSupervisorGestionRutas"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <button type="button" class="btn sygma-fab-nuevo btn-success btn-xl btn-circle shadow hand" id="btnSupervisorRutaNuevo" title="Nueva ruta">
                <i class="fal fa-plus"></i>
            </button>
            <div class="modal fade" id="modalSupervisorGestionRuta" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2">
                            <h5 class="modal-title text-white negrita mb-0">Datos de la ruta</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-4">
                            <div class="form-group">
                                <label class="negrita" for="txtSupervisorRutaNombre">Ruta</label>
                                <input type="text" class="form-control negrita" id="txtSupervisorRutaNombre">
                            </div>
                            <div class="form-group mb-0">
                                <label class="negrita" for="cmbSupervisorRutaEmpleado" id="lbSupervisorRutaEmpleadoModal">Vendedor</label>
                                <select class="form-control" id="cmbSupervisorRutaEmpleado"></select>
                            </div>
                        </div>
                        <div class="modal-footer py-2 px-3">
                            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-success btn-sm hand" id="btnSupervisorRutaGuardar">
                                <i class="fal fa-save mr-1"></i> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        },
        objetivos:()=>{
           return `
           ${view.frag_parametros()}
            <div class="row">
                <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                    ${view.frag_marcas()}
                </div>
                <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                    ${view.frag_vendedores()}
                </div>
            </div>

         

            `
        },
        frag_parametros: ()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                    
                    <h3 class="negrita text-danger">Logro de Objetivos</h3>

                    <div class="row">
                        <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                            <div class="form-group">
                                <label class="negrita text-secondary">Sucursal</label>
                                <select class="form-control negrita" id="cmbSucursal">
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="negrita text-secondary">Seleccione mes y año</label>
                                <div class="input-group">
                                    <select class="form-control negrita" id="cmbMes">
                                    </select>
                                    <select class="form-control negrita" id="cmbAnio">
                                    </select>
                                </div>
                                    
                            </div>
                        </div>
                        <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                            <h5 class="text-info negrita">Objetivos</h5>
                            <small class="negrita text-secondary">Logrado:</small>
                            <div class="input-group" id="lbObjLogrado"></div>
                            <br>
                            <small class="negrita text-secondary">Faltan:</small>
                            <div class="input-group" id="lbObjLogradoFalta"></div>
                               
                        </div>
                    </div>
                
                </div>
            </div>
            <br>
            `
        },
        frag_marcas:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">

                    <h4 class="negrita text-base text-center">LOGRO DE MARCAS</h4>

                    <div class="form-group">
                        <select class="form-control negrita text-danger" id="cmb_objetivos_vendedores">
                        </select>
                    </div>

                    <div class="table-responsive col-12">
                        <table class="table h-full  col-12">
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
        frag_vendedores:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">

                    <h4 class="negrita text-secondary text-center">LOGRO DE VENDEDORES</h4>

                    <div class="table-responsive col-12">
                        <table class="table h-full  col-12">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <td>VENDEDOR</td>
                                    <td>IMPORTE</td>
                                    <td>OBJETIVO</td>
                                    <td>FALTA</td>
                                    <td>ALCANCE</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataVendedores2">
                            </tbody>
                            <tfoot class="bg-secondary text-white negrita">
                                <tr>
                                    <td></td>
                                    <td id="lbTotalVendedoresImporte"></td>
                                    <td id="lbTotalVendedoresObjetivo"></td>
                                    <td id="lbTotalVendedoresFalta"></td>
                                    <td id="lbTotalVendedoresLogro"></td>
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
        modal_categorias_vendedor:()=>{
            return `
              <div id="modal_categorias_vendedor" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="lbVendedorCategorias">
                                
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                    <div class="table-responsive">
                                        <table class="table table-bordered h-full col-12">
                                            <thead class="bg-secondary text-white"> 
                                                <tr>
                                                    <td>CATEGORIA</td>
                                                     <td>VENTA</td>
                                                    <td>OBJETIVO</td>
                                                    <td>FALTAN</td>
                                                    <td></td>
                                                </tr>
                                            </thead>
                                            <tbody id="tblDataVendedorCategorias"></tbody>
                                            <tfoot class="bg-secondary text-white"> 
                                                <tr>
                                                    <td></td>
                                                    <td  id="lbTotalCategoriaVendedorLogro"></td>
                                                    <td id="lbTotalCategoriaVendedorObjetivo"></td>
                                                    <td  id="lbTotalCategoriaVendedorFaltan"></td>
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
    }

    root.innerHTML = view.body();

};

function addListeners(){

    document.getElementById('btnSupervisorMenuToggle')?.addEventListener('click', () => {
        supervisor_toggleSidebar();
    });
    document.getElementById('supervisorSidebarBackdrop')?.addEventListener('click', () => {
        supervisor_toggleSidebar(false);
    });
    document.getElementById('supervisorSidebar')?.addEventListener('click', (e) => {
        if (e.target.closest('.proveedor-menu-card')) supervisor_closeSidebarMobile();
    });

    F.slideAnimationTabs();

    document.title = `Supervisor - ${GlobalNomEmpresa}`;

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
    supervisor_setupSucursalHeader();
    supervisor_initDashboard();
    supervisor_setActiveCard('btnMenuDashboard');

    cmbMesHeader?.addEventListener('change', supervisor_onHeaderFiltersChange);
    cmbAnioHeader?.addEventListener('change', supervisor_onHeaderFiltersChange);
    document.getElementById('cmbSupervisorModoVentas')?.addEventListener('change', supervisor_onHeaderFiltersChange);

    document.getElementById('btnMenuDashboard')?.addEventListener('click', () => {
        supervisor_showHome();
    });

    Object.keys(SUPERVISOR_EMBED_SCRIPTS).forEach(supervisor_bindEmbedMenu);

    document.getElementById('btnMenuRptDocumentos').addEventListener('click',()=>{
        supervisor_showPanel('tres', 'btnMenuRptDocumentos', () => {
            rpt_facturas('tblDataPedidos');
        });
    });

    document.getElementById('btnMenuRptMarcas').addEventListener('click',()=>{
        supervisor_showPanel('dos', 'btnMenuRptMarcas', () => {
            rpt_tbl_marcas();
        });
    });

    document.getElementById('btnMenuRptProductos').addEventListener('click',()=>{
        supervisor_showPanel('cuatro', 'btnMenuRptProductos', () => {
            rpt_tbl_productos();
        });
    });



    //MENU




    document.getElementById('txtRptFacturasFechaInicial').value = F.getFecha();
    document.getElementById('txtRptFacturasFechaFinal').value = F.getFecha();

    document.getElementById('txtRptFacturasFechaInicial').addEventListener('change',()=>{

        rpt_facturas('tblDataPedidos');

    });

    document.getElementById('txtRptFacturasFechaFinal').addEventListener('change',()=>{

        rpt_facturas('tblDataPedidos');

    });


    



    document.getElementById('txtMarcaFechaInicial').value = F.getFecha();

    document.getElementById('txtMarcaFechaInicial').addEventListener('change',()=>{
        rpt_tbl_marcas();
    });

    document.getElementById('txtMarcaFechaFinal').value = F.getFecha();

    document.getElementById('txtMarcaFechaFinal').addEventListener('change',()=>{
        rpt_tbl_marcas();
    });



    

    document.getElementById('txtRptProdFechaInicial').value = F.getFecha();

    document.getElementById('txtRptProdFechaInicial').addEventListener('change',()=>{
        rpt_tbl_productos();
    });

    document.getElementById('txtRptProdFechaFinal').value = F.getFecha();

    document.getElementById('txtRptProdFechaFinal').addEventListener('change',()=>{
        rpt_tbl_productos();
    });



    
    document.getElementById('btnMenuRptInventario').addEventListener('click',()=>{
        supervisor_showPanel('seis', 'btnMenuRptInventario', () => {
            tbl_inventario();
        });
    });

    document.getElementById('btnMenuRptVendedores').addEventListener('click',()=>{
        supervisor_showPanel('cinco', 'btnMenuRptVendedores', () => {
            rpt_tbl_vendedores();
        });
    });

    document.getElementById('txtRptVenFechaInicial').value = F.getFecha();

    document.getElementById('txtRptVenFechaInicial').addEventListener('change',()=>{
        rpt_tbl_vendedores();
    });

    document.getElementById('txtRptVenFechaFinal').value = F.getFecha();

    document.getElementById('txtRptVenFechaFinal').addEventListener('change',()=>{
        rpt_tbl_vendedores();
    });




    document.getElementById('btnMenuRptClientesVendedor').addEventListener('click',()=>{
        supervisor_showPanel('siete', 'btnMenuRptClientesVendedor', () => {
            rpt_tbl_clientes_vendedores();
        });
    });

    document.getElementById('btnMenuGestionRutas')?.addEventListener('click', () => {
        supervisor_showPanel('nueve', 'btnMenuGestionRutas', () => {
            if (typeof supervisor_init_gestion_rutas === 'function') {
                supervisor_init_gestion_rutas();
            }
        });
    });




    // OBJETIVOS

    listeners_objetivos();

    // OBJETIVOS


};

function supervisor_destroyDashboardChart(chartKey) {
    if (supervisor_dashboardCharts[chartKey]) {
        supervisor_dashboardCharts[chartKey].destroy();
        delete supervisor_dashboardCharts[chartKey];
    }
}

function supervisor_renderDashboardChart(chartKey, canvasId, labels, values, title) {
    supervisor_destroyDashboardChart(chartKey);
    const canvas = document.getElementById(canvasId);
    if (!canvas || !labels.length || !values.length || typeof Chart === 'undefined') return;
    const total = values.reduce((sum, value) => sum + Number(value), 0);
    if (total <= 0) return;
    const bgColor = labels.map(() => getRandomColor());
    const chartWrap = canvas.closest('.proveedor-dashboard-chart');
    if (chartWrap) chartWrap.style.height = `${Math.max(200, labels.length * 30)}px`;
    try {
        supervisor_dashboardCharts[chartKey] = new Chart(canvas.getContext('2d'), {
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
                    title: { display: true, text: title, font: { size: 12 } }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 68, 163, 0.08)' },
                        ticks: { font: { size: 10 }, callback: (value) => F.setMoneda(value, 'Q') }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 10 }, autoSkip: false }
                    }
                }
            }
        });
    } catch (e) {
        console.error('[inicio_supervisor] chart:', e);
    }
}

function supervisor_resetDashboardFooters() {
    [
        'lbSupFootDashVendedorPedidos', 'lbSupFootDashVendedorImporte',
        'lbSupFootDashMarcaImporte'
    ].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.innerText = '--';
    });
}

function supervisor_loadDashboard() {
    supervisor_resetDashboardFooters();
    supervisor_tbl_dashboard_ventas_vendedor();
    supervisor_tbl_dashboard_ventas_marca();
}

function supervisor_tbl_dashboard_ventas_vendedor() {
    const container = document.getElementById('tblDataSupDashVentasVendedor');
    if (!container) return;
    container.innerHTML = GlobalLoader;
    supervisor_destroyDashboardChart('vendedor');
    const tituloModo = `${supervisor_labelModoVentas()} por vendedor`;
    RPT.data_dashboard_ventas_vendedor(supervisor_getSucursal(), supervisor_getMes(), supervisor_getAnio(), supervisor_getModoVentas())
        .then((data) => {
            const items = [...(data.recordset || [])].sort((a, b) => Number(b.TOTALPRECIO) - Number(a.TOTALPRECIO));
            let totalPedidos = 0, totalImporte = 0, str = '';
            items.forEach((r) => {
                totalPedidos += Number(r.CONTEO);
                totalImporte += Number(r.TOTALPRECIO);
                str += `<tr><td>${r.EMPLEADO}</td><td>${r.CONTEO}</td><td>${F.setMoneda(r.TOTALPRECIO, 'Q')}</td></tr>`;
            });
            container.innerHTML = str || '<tr><td colspan="3" class="text-center text-muted">Sin datos</td></tr>';
            const lbPed = document.getElementById('lbSupFootDashVendedorPedidos');
            const lbImp = document.getElementById('lbSupFootDashVendedorImporte');
            if (lbPed) lbPed.innerText = `${totalPedidos}`;
            if (lbImp) lbImp.innerText = F.setMoneda(totalImporte, 'Q');
            supervisor_renderDashboardChart('vendedor', 'chartSupDashVentasVendedor',
                items.map((r) => r.EMPLEADO), items.map((r) => Number(r.TOTALPRECIO)),
                `${tituloModo}: ${F.setMoneda(totalImporte, 'Q')}`);
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No se cargaron datos</td></tr>';
            supervisor_destroyDashboardChart('vendedor');
        });
}

function supervisor_tbl_dashboard_ventas_marca() {
    const container = document.getElementById('tblDataSupDashVentasMarca');
    if (!container) return;
    container.innerHTML = GlobalLoader;
    supervisor_destroyDashboardChart('marca');
    const tituloModo = `${supervisor_labelModoVentas()} por marca`;
    RPT.data_marcas(supervisor_getSucursal(), supervisor_getMes(), supervisor_getAnio(), supervisor_getModoVentas())
        .then((data) => {
            const items = [...(data.recordset || [])].sort((a, b) => Number(b.TOTALPRECIO) - Number(a.TOTALPRECIO));
            let totalImporte = 0, str = '';
            items.forEach((r) => {
                totalImporte += Number(r.TOTALPRECIO);
                str += `<tr><td>${r.DESMARCA}</td><td>${F.setMoneda(r.TOTALPRECIO, 'Q')}</td></tr>`;
            });
            container.innerHTML = str || '<tr><td colspan="2" class="text-center text-muted">Sin datos</td></tr>';
            const lbMarca = document.getElementById('lbSupFootDashMarcaImporte');
            if (lbMarca) lbMarca.innerText = F.setMoneda(totalImporte, 'Q');
            supervisor_renderDashboardChart('marca', 'chartSupDashVentasMarca',
                items.map((r) => r.DESMARCA), items.map((r) => r.TOTALPRECIO),
                `${tituloModo}: ${F.setMoneda(totalImporte, 'Q')}`);
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="2" class="text-center text-muted">No se cargaron datos</td></tr>';
            supervisor_destroyDashboardChart('marca');
        });
}

function initView(){
    document.getElementById('js-page-content')?.classList.add('proveedor-page');
    if (typeof supervisor_rutas_listeners_ready !== 'undefined') supervisor_rutas_listeners_ready = false;
    getView();
    addListeners();
    supervisor_showHome();
}

function destroyView(){
    Object.keys(supervisor_dashboardCharts).forEach(supervisor_destroyDashboardChart);
    supervisor_teardownEmbed();
    supervisor_toggleSidebar(false);
    document.body.classList.remove('proveedor-sidebar-open');
    document.getElementById('js-page-content')?.classList.remove('proveedor-page');
}

window._supervisorCore = { initView, destroyView, getView, addListeners };

(function () {
    window.__spaViewHooks = window.__spaViewHooks || {};
    window.__spaViewHooks['inicio/supervisor'] = {
        initView: window._supervisorCore.initView,
        destroyView: window._supervisorCore.destroyView
    };
    window.supervisor_showHome = supervisor_showHome;
})();

function rpt_facturas(idContainer){

    let container = document.getElementById(idContainer);

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;

    let fi = F.devuelveFecha('txtRptFacturasFechaInicial');
    let ff = F.devuelveFecha('txtRptFacturasFechaFinal');
    

    GF.get_data_pedidos_pendientes_vendedores_fechas(fi,ff)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
            let idRowPedido = `idRowPedido${r.CODDOC}-${r.CORRELATIVO}`;
            contador +=1;
            varTotal += Number(r.IMPORTE);

            let importe = 0;
            if(r.STATUS=='A'){importe = 0}else{importe = r.IMPORTE};

            let strClassSt = 'info'; if(r.STATUS.toString()=='A'){strClassSt='danger'};
            let idbtnAnular = `btnAnular${r.CODDOC}-${r.CORRELATIVO}`
            str += `
                <tr>
                    <td class="text-left">
                        <b class="negrita">${r.CODDOC}-${r.CORRELATIVO}</b>
                        <br>
                        ${F.convertDateNormal(r.FECHA)}
                        <br>
                        <small>Hora:${r.HORA}</small>
                    </td>
                    <td>${r.NOMEMPLEADO}
                        <button class="btn btn-info btn-circle btn-sm hand shadow"
                        onclick="F.gotoGoogleMaps('${r.LAT}','${r.LONG}')">
                            <i class="fal fa-map"></i>
                        </button>
                        
                    </td>
                    <td>${r.NOMCLIE}
                        <br>
                        <small>${r.DIRCLIE}</small>
                    </td>
                    <td>
                        ${r.DESMUN}
                    </td>
                    <td class="negrita text-danger text-right">${F.setMoneda(importe,'Q')}</td>
                    <td>
                        <button class="btn btn-${strClassSt} btn-md btn-circle hand shadow" id="${idbtnAnular}"
                            onclick="anular_pedido('${r.CODDOC}','${r.CORRELATIVO}','${r.STATUS}','${idbtnAnular}')">
                            ${r.STATUS}        
                        </button>
                        
                    </td>                    
                    <td>
                        <button class="btn btn-warning btn-md btn-circle hand shadow"
                            onclick="get_detalle_pedido('${r.CODDOC}','${r.CORRELATIVO}')">
                                <i class="fal fa-list"></i>
                        </button>
                    </td>
                  
                </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalFacturasImporte').innerText = `Total: ${F.setMoneda(varTotal,'Q')}`
        document.getElementById('lbTotalFacturasConteo').innerText =`${contador} pedidos`


        F.initit_datatable('tblPedidos',true);

    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....'
        document.getElementById('lbTotalFacturasImporte').innerText = '---'
        document.getElementById('lbTotalFacturasConteo').innerText = '---'
    })




};

function get_detalle_pedido(coddoc,correlativo){


    $("#modal_detalle_pedido").modal('show');


    let container = document.getElementById('tblDataDetallePedido');
    container.innerHTML = GlobalLoader;


    GF.get_data_detalle_documento(GlobalEmpnit,coddoc,correlativo)
    .then((data)=>{
        let str = "";
        
        
        //let json = JSON.parse(data.recordset[0].JSONDOCPRODUCTOS);
        let obs = '';//data.recordset[0].OBS;


        let contador = 0; let varImporte = 0;

        
        data.recordset.map((r)=>{
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
            `
        })
        container.innerHTML = str;
        document.getElementById('lbFtotalCantidad').innerHTML = contador;
        document.getElementById('lbFtotalImporte').innerHTML = F.setMoneda(varImporte,'Q');
       
        document.getElementById('txtDetallePedidoObs').value = obs;
       


    })
    .catch(()=>{
        container.innerHTML = 'No hay datos...';
       
        document.getElementById('lbFtotalCantidad').innerHTML = '';
        document.getElementById('lbFtotalImporte').innerHTML = '';
       
        document.getElementById('txtDetallePedidoObs').value = '';

    })




};



function rpt_tbl_marcas(){

    let container = document.getElementById('tblDataMarcas');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

    let fi = F.devuelveFecha('txtMarcaFechaInicial');
    let ff = F.devuelveFecha('txtMarcaFechaFinal');

 
    GF.get_data_marcas_vendedor_todas(GlobalEmpnit,fi,ff)
    .then((data)=>{

   
        let str = '';

        data.recordset.map((r)=>{
        
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            str += `

                <tr>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    <td>
                        <button class="btn btn-secondary btn-md btn-circle hand shadow"
                        onclick="">
                                <i class="fal fa-list"></i>
                        </button>
                    </td>
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



};



function tbl_inventario(){

    let container = document.getElementById('tblDataInventario');
    container.innerHTML = GlobalLoader;

    let st = document.getElementById('cmbSt').value;

    GF.get_data_inventarios_general(GlobalEmpnit,st)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            let cajas = Number(r.TOTALUNIDADES)/Number(r.UXC);
            str += `
            <tr>
                <td>${r.CODPROD}</td>
                <td>${r.CODPROD2}</td>
                <td>${r.DESPROD3}</td>
                <td>${r.DESPROD}</td>
                <td>${r.DESMARCA}</td>
                <td>${F.setMoneda(r.TOTALCOSTO,'Q')}</td>
                <td>${r.TOTALUNIDADES}</td>
                <td>${F.setMoneda(cajas,'')}</td>
            </tr>
            `
        })
        container.innerHTML = str;

        F.initit_datatable('tblInventario', true);

    })
    .catch(()=>{

        container.innerHTML = 'No se cargaron datos...';
    })


    

};




function rpt_tbl_productos(){



    let container = document.getElementById('tblDataFProductos');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;


    let fi = F.devuelveFecha('txtRptProdFechaInicial');
    let ff = F.devuelveFecha('txtRptProdFechaFinal');

    GF.get_data_embarque_productos_vendedor_todos(GlobalEmpnit,fi,ff)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
         
            contador +=1;
            varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td>${r.CODPROD}
                    <br>
                        <small>${r.TOTALUNIDADES}</small>
                    </td>
                    <td>${r.DESPROD}
                        <br>
                        <small>${r.DESMARCA}</small>
                    </td>
                    <td>${r.UXC}</td>
                    <td>${r.CAJAS}</td>
                    <td>${r.UNIDADES}</td>
                    <td>${F.setMoneda(r.IMPORTE,'Q')}</td>
                    <td></td>
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



function rpt_tbl_vendedores(){


    
    let container = document.getElementById('tblDataVendedores');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;
    let varTotalPedidos = 0;


    let fi = F.devuelveFecha('txtRptVenFechaInicial');
    let ff = F.devuelveFecha('txtRptVenFechaFinal');

    GF.get_data_ventas_vendedores_todos(GlobalEmpnit,fi,ff)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
         
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            varTotalPedidos += Number(r.PEDIDOS);
            str += `
                <tr>
                    <td>${r.EMPLEADO}
                        <br>
                        <small class="negrita text-info">Usuario: ${r.USUARIO}</small>
                        <br>
                        <small class="negrita text-danger">Clave: ${r.CLAVE}</small>
                    </td>
                    <td>${r.PEDIDOS}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    <td></td>
                </tr>
                `
        })
        container.innerHTML = str;
        document.getElementById('lbVenTotalImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;
        document.getElementById('lbVenTotalPedidos').innerText = `Pedidos: ${varTotalPedidos}`;
    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbVenTotalImporte').innerText = '';
        document.getElementById('lbVenTotalPedidos').innerText = ``
    })


};



function rpt_tbl_clientes_vendedores(){



    let container = document.getElementById('tblDataClientesVendedor');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;


    GF.get_data_ventas_vendedores_clientes_resumen(GlobalEmpnit)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
            
            contador +=Number(r.TOTAL);
            //varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td>${r.NOMEMP}
                    <td>${r.LUNES}</td>
                    <td>${r.MARTES}</td>
                    <td>${r.MIERCOLES}</td>
                    <td>${r.JUEVES}</td>
                    <td>${r.VIERNES}</td>
                    <td>${r.SABADO}</td>
                    <td>${r.DOMINGO}</td>
                    <td class="negrita text-danger">${r.TOTAL}</td>
                </tr>
                `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalClientesVendedores').innerText = `Total: ${contador}`;
      
    })
    .catch((error)=>{
        console.log(error);
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbTotalClientesVendedores').innerText = '';
       
    })


};






//OBJETIVOS

function listeners_objetivos(){
    let cmbSucursal = document.getElementById('cmbSucursal');
    if (!cmbSucursal) return;

    GF.get_data_empresas()
    .then((data)=>{

        let str = `<option value="%">TODAS</option>`;

        data.recordset.map((r)=>{
            str += `<option value="${r.EMPNIT}">${r.NOMBRE}</option>`;
        })
        cmbSucursal.innerHTML = str; 
        
        if(Number(GlobalNivelUsuario)==1){

        }else{
            cmbSucursal.value = GlobalEmpnit;
            cmbSucursal.disabled = true;
        };

        get_combo_vendedores();

        get_reportes();

    })
    .catch(()=>{
        cmbSucursal.innerHTML = `<option value="%">No se cargaron las sedes</option>`
    })


    document.getElementById('cmb_objetivos_vendedores').addEventListener('change',()=>{
            let sucursal = document.getElementById('cmbSucursal').value;
            let mes = document.getElementById('cmbMes').value;
            let anio = document.getElementById('cmbAnio').value;
            tbl_logro_marcas(sucursal,mes,anio);
    });

    document.getElementById('cmbMes').innerHTML = F.ComboMeses();
    document.getElementById('cmbMes').value = F.get_mes_curso();

    document.getElementById('cmbAnio').innerHTML = F.ComboAnio();
    document.getElementById('cmbAnio').value = F.get_anio_curso();



    cmbSucursal.addEventListener('change',()=>{ get_reportes(); });
    document.getElementById('cmbMes').addEventListener('change',()=>{ get_reportes(); });
    document.getElementById('cmbAnio').addEventListener('change',()=>{ get_reportes(); });



};
function get_combo_vendedores(){

    let sucursal = document.getElementById('cmbSucursal').value;


    return new Promise((resolve,reject)=>{

         GF.get_data_empleados_tipo_emp(3,sucursal)
        .then((data)=>{

            let str = `<option value="TODOS">TODOS</option>`;
            
            data.recordset.map((r)=>{
                str += `
                <option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>
                `
            })
            document.getElementById('cmb_objetivos_vendedores').innerHTML = str;
            resolve();
        })
        .catch(()=>{
            document.getElementById('cmb_objetivos_vendedores').innerHTML = `<option value="">NO SE CARGARON</option>`;
            resolve();
        })
        
    })

   


}

function get_reportes(){

    let sucursal = document.getElementById('cmbSucursal').value;
    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;

    get_combo_vendedores()
    .then(()=>{

        tbl_logro_marcas(sucursal,mes,anio);
    
    })
    .catch(()=>{
        
    })

 
    tbl_logro_vendedores(sucursal,mes,anio);


};


// ------------------------ logro marcas

function get_data_logro_marcas(sucursal,mes,anio,codemp){

     return new Promise((resolve,reject)=>{

            let url = '';
            if(codemp=='TODOS'){
                url = '/objetivos/select_logro_marcas';
            }else{
                url = '/objetivos/select_logro_marcas_vendedor'
            }

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
function tbl_logro_marcas(sucursal,mes,anio){

    let empleado = document.getElementById('cmb_objetivos_vendedores').value;
    //document.getElementById('cmb_objetivos_vendedores').value;

    let container = document.getElementById('tblDataMarcas2');
    container.innerHTML = GlobalLoader;

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
                document.getElementById('lbObjLogrado').innerHTML = `<progress class="form-control" value="${logrado}" max="100"></progress><b class="text-success">${logrado.toFixed(2)}%</b>`;
                document.getElementById('lbObjLogradoFalta').innerHTML = `<progress class="form-control progress-falta" value="${faltaLogro}" max="100"></progress><b class="text-danger">${faltaLogro.toFixed(2)}%</b>`;
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
        let empleado = document.getElementById('cmb_objetivos_vendedores').value;
        
        if(empleado=='TODOS'){
            url = '/objetivos/select_logro_marcas_categorias';
        }else{
            url = '/objetivos/select_logro_vendedores_categorias';
        }


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


    let sucursal = document.getElementById('cmbSucursal').value;
    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;


    let varTotalObjetivo = 0; let varTotalLogro = 0; let varTotalFaltan = 0;

  console.log('por aqui 0');
    get_data_logro_categorias_marcas(sucursal,codmarca,mes,anio)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
      
            console.log('por aqui 1');
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


function get_data_logro_vendedores(sucursal,mes,anio){

    return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + '/objetivos/select_logro_vendedores', {
                    token:TOKEN,
                    sucursal:sucursal,
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
function tbl_logro_vendedores(sucursal,mes,anio){


    let container = document.getElementById('tblDataVendedores2');
    container.innerHTML = GlobalLoader;

    let conteo = 0;
    let varTotalObjetivo =0; let varTotalImporte = 0; 
    let varTotalFaltan = 0; let varTotalLogro = 0;

    get_data_logro_vendedores(sucursal,mes,anio)
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
            <tr class="${strLogro} hand" onclick="get_detalle_vendedor('${r.CODIGO_VENDEDOR}','${r.VENDEDOR}')">
                <td>${r.VENDEDOR}
                    <br>
                    <small class="negrita text-info">${r.EMPRESA}</small>
                </td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>${F.setMoneda(varFaltan,'Q')}</td>
                <td>${varLOGRO.toFixed(2)} %</td>
            </tr>
            `
        })
        container.innerHTML = str;


        document.getElementById('lbTotalVendedoresImporte').innerHTML = F.setMoneda(varTotalImporte,'Q');
        document.getElementById('lbTotalVendedoresObjetivo').innerHTML = F.setMoneda(varTotalObjetivo,'Q');
        document.getElementById('lbTotalVendedoresFalta').innerHTML = F.setMoneda(varTotalFaltan,'Q');
        document.getElementById('lbTotalVendedoresLogro').innerHTML = `${F.setMoneda(varTotalLogro / conteo,'')} %`

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
        
        document.getElementById('lbTotalVendedoresImporte').innerHTML = '';
        document.getElementById('lbTotalVendedoresObjetivo').innerHTML =''; 
        document.getElementById('lbTotalVendedoresFalta').innerHTML = '';
        document.getElementById('lbTotalVendedoresLogro').innerHTML = '';
    })



};


function get_detalle_vendedor(codemp,nombre){


        $("#modal_categorias_vendedor").modal('show');

        document.getElementById('lbVendedorCategorias').innerText = nombre;

        tbl_detalle_vendedor(codemp);

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

    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;

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

//OBJETIVOS