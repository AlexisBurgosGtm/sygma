var embarque_print_codembarque = '';
var embarque_print_fecha = '';
var compras_currentPane = 'uno';

function compras_getMes() {
    return document.getElementById('cmbMesHeader')?.value || document.getElementById('cmbMes')?.value || F.get_mes_curso();
}

function compras_getAnio() {
    return document.getElementById('cmbAnioHeader')?.value || document.getElementById('cmbAnio')?.value || F.get_anio_curso();
}

function compras_setupSucursalHeader() {
    const cmb = document.getElementById('cmbSucursalHeader');
    if (!cmb) return;
    const emp = GlobalEmpnit || '';
    const nom = GlobalNomEmpresa || 'Sede';
    cmb.innerHTML = `<option value="${emp}">${nom}</option>`;
    cmb.value = emp;
    cmb.disabled = true;
}

function compras_hideGeneralMenu() {
    document.body.classList.add('spa-nav-hidden');
    const sidebar = document.getElementById('root_navbar');
    const nav = document.getElementById('js-primary-nav');
    if (sidebar) sidebar.style.display = 'none';
    if (nav) {
        nav.innerHTML = '';
        nav.style.visibility = 'hidden';
    }
}

function compras_setActiveCard(cardId) {
    document.querySelectorAll('#comprasSidebar .proveedor-menu-card').forEach(el => {
        el.classList.toggle('proveedor-menu-card--active', !!cardId && el.id === cardId);
    });
}

function compras_toggleSidebar(forceOpen) {
    const sidebar = document.getElementById('comprasSidebar');
    const backdrop = document.getElementById('comprasSidebarBackdrop');
    if (!sidebar) return;
    const open = typeof forceOpen === 'boolean' ? forceOpen : !sidebar.classList.contains('proveedor-sidebar--open');
    sidebar.classList.toggle('proveedor-sidebar--open', open);
    backdrop?.classList.toggle('proveedor-sidebar-backdrop--visible', open);
    document.body.classList.toggle('proveedor-sidebar-open', open);
}

function compras_closeSidebarMobile() {
    if (window.innerWidth < 768) compras_toggleSidebar(false);
}

function compras_showPanel(paneId, cardId, afterShow) {
    compras_currentPane = paneId;
    compras_closeSidebarMobile();
    document.querySelectorAll('#myTabHomeContent .tab-pane').forEach(p => {
        p.classList.remove('show', 'active');
    });
    const pane = document.getElementById(paneId);
    if (pane) pane.classList.add('show', 'active');
    document.querySelectorAll('#myTabHome .nav-link').forEach(l => {
        l.classList.remove('active');
        l.setAttribute('aria-selected', 'false');
    });
    const tabLink = document.querySelector(`#myTabHome a[href="#${paneId}"]`);
    if (tabLink) {
        tabLink.classList.add('active');
        tabLink.setAttribute('aria-selected', 'true');
    }
    compras_setActiveCard(cardId);
    if (typeof afterShow === 'function') afterShow();
}

function compras_showHome() {
    compras_showPanel('uno', 'btnMenuEmbarques', () => cargar_grid_embarques());
}

function compras_onHeaderFiltersChange() {
    if (compras_currentPane === 'uno') cargar_grid_embarques();
    if (compras_currentPane === 'dos' && typeof compras_cxc_cargar_listado === 'function') {
        const alcance = document.getElementById('comprasCxcAlcance')?.value || 'MES';
        if (alcance !== 'TODAS') compras_cxc_cargar_listado();
    }
}

function compras_init_inventario() {
    get_tbl_surtido(GlobalEmpnit);
}

function compras_setupMenuListeners() {
    document.getElementById('btnMenuEmbarques')?.addEventListener('click', () => {
        compras_showPanel('uno', 'btnMenuEmbarques', () => cargar_grid_embarques());
    });
    document.getElementById('btnMenuCreditos')?.addEventListener('click', () => {
        compras_showPanel('dos', 'btnMenuCreditos', () => compras_init_creditos());
    });
    document.getElementById('btnMenuInventarios')?.addEventListener('click', () => {
        compras_showPanel('tres', 'btnMenuInventarios', () => compras_init_inventario());
    });
    document.getElementById('btnComprasMenuToggle')?.addEventListener('click', () => compras_toggleSidebar());
    document.getElementById('comprasSidebarBackdrop')?.addEventListener('click', () => compras_toggleSidebar(false));
}

function getView(){
    root = document.getElementById('root');
    if (!root) return;
    let view = {
        body:()=>{
            return `
            <div id="compras_main_content" class="proveedor-layout">
                ${view.menu_superior()}

                <button type="button" class="btn proveedor-menu-toggle d-md-none" id="btnComprasMenuToggle" title="Menú de opciones">
                    <i class="fal fa-bars"></i><span>Menú</span>
                </button>
                <div class="proveedor-sidebar-backdrop d-md-none" id="comprasSidebarBackdrop"></div>

                <div class="row proveedor-main-row">
                    <div class="col-12 col-md-2 proveedor-sidebar" id="comprasSidebar">
                        <div class="proveedor-sidebar__scroll">
                            ${view.menu()}
                        </div>
                    </div>
                    <div class="col-12 col-md-10 proveedor-tab-area">
                        <div id="comprasPanelContent">
                            <div class="tab-content" id="myTabHomeContent">
                                <div class="tab-pane fade show active" id="uno" role="tabpanel">
                                    ${view.vista_embarques()}
                                </div>
                                <div class="tab-pane fade" id="dos" role="tabpanel">
                                    ${view.vista_creditos_vendedores()}
                                </div>
                                <div class="tab-pane fade" id="tres" role="tabpanel">
                                    ${view.productos_relleno() + view.modal_existencia_sucursales()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                    <li class="nav-item"><a class="nav-link active" id="tab-uno" data-toggle="tab" href="#uno" role="tab"></a></li>
                    <li class="nav-item"><a class="nav-link" id="tab-dos" data-toggle="tab" href="#dos" role="tab"></a></li>
                    <li class="nav-item"><a class="nav-link" id="tab-tres" data-toggle="tab" href="#tres" role="tab"></a></li>
                </ul>
            </div>

            ${view.vista_creditos_modales()}

            <div id="sygma_embarque_print_host" class="sygma-embarque-print-host" aria-hidden="true"></div>
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
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion text-center" title="Imprimir"></th>
                                </tr>
                            </thead>
                            <tbody id="tblDatalEmbarques"></tbody>
                        </table>
                    </div>
                    <div class="sygma-embarque-rpt__total-block" id="lbEmbGridTotalBlock"></div>
                </div>
            </div>

            <button type="button" class="btn btn-success btn-lg btn-circle hand shadow sygma-embarques-fab sygma-fab-nuevo oculto-impresion" id="btnEmbarquesNuevo" title="Nuevo embarque">
                <i class="fal fa-plus"></i>
            </button>
            `
        },
        menu_superior:()=>{
            return `
            <div class="proveedor-header-card card shadow-sm mb-2 compras-bodega-header">
                <div class="card-body py-2 px-3">
                    <div class="row align-items-center no-gutters">
                        <div class="col-auto pr-2">
                            <img src="./favicon.png" width="40" height="40" alt="Logo">
                        </div>
                        <div class="col-auto pr-3">
                            <h5 class="negrita text-white mb-0">Inicio Bodega</h5>
                            <small class="text-white-50 negrita d-block" id="lbComprasEmpresa">${GlobalNomEmpresa || ''}</small>
                        </div>
                        <div class="col">
                            <select class="form-control form-control-sm negrita" id="cmbSucursalHeader" title="Sucursal"></select>
                        </div>
                        <div class="col-auto pl-2">
                            <select class="form-control form-control-sm negrita" id="cmbMesHeader"></select>
                        </div>
                        <div class="col-auto pl-2">
                            <select class="form-control form-control-sm negrita" id="cmbAnioHeader"></select>
                        </div>
                    </div>
                </div>
            </div>
            `;
        },
        menu:()=>{
            const items = [
                { id: 'btnMenuEmbarques', label: 'Embarques', icon: 'fa-truck', color: 'info' },
                { id: 'btnMenuCreditos', label: 'Créditos vendedores', icon: 'fa-dollar-sign', color: 'success' },
                { id: 'btnMenuInventarios', label: 'Inventarios', icon: 'fa-warehouse', color: 'secondary' },
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
        vista_creditos_vendedores:()=>{
            return `
            <div class="sygma-embarque-rpt card card-rounded shadow-sm col-12 border-0" id="rpt_compras_cuentas_cobrar">
                <div id="comprasCxcLoaderOverlay" class="cxc-loader-overlay d-none">
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
                                <h4 class="sygma-embarque-rpt__title mb-0">Créditos vendedores</h4>
                                <span class="sygma-embarque-rpt__embarque-date">Facturas al crédito con saldo pendiente</span>
                            </div>
                        </div>
                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                            <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbComprasCxcTotalDocs">Docs: 0</span>
                            <button type="button" class="btn btn-info btn-md btn-circle hand shadow sygma-embarque-rpt__print-btn" title="Imprimir" onclick="F.imprimirSelec('rpt_compras_cuentas_cobrar')">
                                <i class="fal fa-print"></i>
                            </button>
                        </div>
                    </header>
                    <div class="sygma-embarque-rpt__toolbar sygma-embarques-filtros oculto-impresion">
                        <div class="sygma-embarques-filtros__row">
                            <div class="sygma-embarques-filtros__field">
                                <label class="sygma-embarques-filtros__label" for="comprasCxcVendedor">Vendedor</label>
                                <select class="form-control sygma-embarques-filtros__select" id="comprasCxcVendedor">
                                    <option value="TODOS">TODOS</option>
                                </select>
                            </div>
                            <div class="sygma-embarques-filtros__field">
                                <label class="sygma-embarques-filtros__label" for="comprasCxcAlcance">Alcance</label>
                                <select class="form-control sygma-embarques-filtros__select" id="comprasCxcAlcance">
                                    <option value="MES">POR MES</option>
                                    <option value="TODAS">TODAS</option>
                                </select>
                            </div>
                            <div class="sygma-embarques-filtros__field d-flex align-items-end">
                                <button type="button" class="btn btn-base btn-sm hand" id="btnComprasCxcRecargar">
                                    <i class="fal fa-sync mr-1"></i> Actualizar
                                </button>
                            </div>
                            <div class="sygma-embarques-filtros__field d-flex align-items-end">
                                <button type="button" class="btn btn-warning btn-sm hand" id="btnComprasCxcCorregirSaldos">
                                    <i class="fal fa-wrench mr-1"></i> Corregir saldos
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="sygma-embarque-rpt__toolbar oculto-impresion mb-2">
                        <input type="search" class="form-control sygma-embarque-rpt__search"
                            placeholder="Buscar documento, cliente, NIT..."
                            oninput="F.FiltrarTabla('tblComprasCxcDocumentos','txtComprasCxcBuscar')"
                            id="txtComprasCxcBuscar">
                    </div>
                    <div class="table-responsive sygma-embarque-rpt__table-wrap">
                        <table class="table sygma-embarque-rpt__table mb-0" id="tblComprasCxcDocumentos">
                            <thead>
                                <tr>
                                    <th>FECHA</th>
                                    <th>DOCUMENTO</th>
                                    <th>NIT</th>
                                    <th>CLIENTE</th>
                                    <th>VENCIMIENTO</th>
                                    <th class="text-right">IMPORTE</th>
                                    <th class="text-right">ABONOS</th>
                                    <th class="text-right">SALDO</th>
                                    <th class="text-center">DIAS CREDITO</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataComprasCxcDocumentos"></tbody>
                        </table>
                    </div>
                    <div class="sygma-embarque-rpt__total-block" id="lbComprasCxcTotalBlock"></div>
                </div>
            </div>`;
        },
        vista_creditos_modales:()=>{
            return `
            <div class="modal fade" id="modalComprasCxcOpciones" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2">
                            <h5 class="modal-title text-white negrita mb-0" id="lbComprasCxcModalTitulo">Factura</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span aria-hidden="true">&times;</span></button>
                        </div>
                        <div class="modal-body p-3">
                            <p class="mb-3 text-muted text-center" id="lbComprasCxcModalSubtitulo"></p>
                            <div class="row cxc-opciones-grid">
                                <div class="col-6 mb-3"><button type="button" class="cxc-opcion-card hand w-100" id="btnComprasCxcHistorial"><i class="fal fa-history cxc-opcion-card__icon text-info"></i><span class="cxc-opcion-card__label">HISTORIAL</span></button></div>
                                <div class="col-6 mb-3"><button type="button" class="cxc-opcion-card hand w-100" id="btnComprasCxcAbono"><i class="fal fa-dollar-sign cxc-opcion-card__icon text-success"></i><span class="cxc-opcion-card__label">ABONO</span></button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="modalComprasCxcHistorial" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2">
                            <h5 class="modal-title text-white negrita mb-0" id="lbComprasCxcHistorialTitulo">Historial de abonos</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span aria-hidden="true">&times;</span></button>
                        </div>
                        <div class="modal-body p-3">
                            <div class="table-responsive">
                                <table class="table table-sm table-striped mb-0">
                                    <thead><tr><th>FECHA</th><th>TIPO</th><th>DOCUMENTO</th><th class="text-right">MONTO</th><th>FORMA PAGO</th><th>USUARIO</th></tr></thead>
                                    <tbody id="tblComprasCxcHistorialBody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="modalComprasCxcAbono" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2">
                            <h5 class="modal-title text-white negrita mb-0">Registrar abono</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span aria-hidden="true">&times;</span></button>
                        </div>
                        <div class="modal-body p-3">
                            <div class="row">
                                <div class="col-md-4 form-group"><label class="negrita" for="comprasCxcAbonoCoddoc">CODDOC (RCC)</label><select class="form-control" id="comprasCxcAbonoCoddoc"></select></div>
                                <div class="col-md-4 form-group"><label class="negrita" for="txtComprasCxcAbonoCorrelativo">Correlativo</label><input type="text" class="form-control" id="txtComprasCxcAbonoCorrelativo" readonly></div>
                                <div class="col-md-4 form-group"><label class="negrita" for="txtComprasCxcAbonoFecha">Fecha</label><input type="date" class="form-control" id="txtComprasCxcAbonoFecha"></div>
                            </div>
                            <div class="alert alert-light border mb-3">
                                <div class="negrita mb-1">Factura a abonar</div>
                                <div id="lbComprasCxcAbonoFactura">—</div>
                                <div class="row mt-2">
                                    <div class="col-4"><small class="text-muted">Total factura</small><div class="negrita" id="lbComprasCxcAbonoTotalFac">Q 0.00</div></div>
                                    <div class="col-4"><small class="text-muted">Total abonos</small><div class="negrita" id="lbComprasCxcAbonoTotalAbonos">Q 0.00</div></div>
                                    <div class="col-4"><small class="text-muted">Total saldo</small><div class="negrita text-danger" id="lbComprasCxcAbonoTotalSaldo">Q 0.00</div></div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 form-group"><label class="negrita" for="comprasCxcFpagoTipo">Forma de pago</label><select class="form-control" id="comprasCxcFpagoTipo"><option value="EFECTIVO">EFECTIVO</option><option value="DEPOSITO">DEPOSITO</option><option value="CHEQUE">CHEQUE</option><option value="OTROS">OTROS</option></select></div>
                                <div class="col-md-6 form-group"><label class="negrita" for="txtComprasCxcFpagoDetalle">Detalle forma de pago</label><input type="text" class="form-control" id="txtComprasCxcFpagoDetalle" placeholder="Banco, boleta o no. de cheque"></div>
                            </div>
                            <div class="form-group mb-0"><label class="negrita" for="txtComprasCxcAbonoMonto">Monto a abonar</label><input type="number" class="form-control negrita text-danger cxc-abono-monto-input" id="txtComprasCxcAbonoMonto" min="0" step="0.01" placeholder="0.00"></div>
                        </div>
                        <div class="modal-footer py-2 px-3">
                            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-success btn-sm hand" id="btnComprasCxcGuardarAbono"><i class="fal fa-save mr-1"></i> Guardar abono</button>
                        </div>
                    </div>
                </div>
            </div>`;
        },
        panel_inicio:()=>{
            return `
            <div class="row p-4">
                <div class="col-4">

                    <div class="hand shadow p-3 bg-danger-300 rounded overflow-hidden position-relative text-white mb-g" onclick="document.getElementById('tab-dos').click()">
                        <div class="">
                            <h3 class="display-4 d-block l-h-n m-0 fw-500" id="lbTotalRelleno">
                                0
                                <small class="m-0 l-h-n">Productos en mínimo</small>
                            </h3>
                        </div>
                        <i class="fal fa-box position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" style="font-size:6rem"></i>
                    </div>

                </div>

                <div class="col-4">

                    <div class="hand shadow p-3 bg-info-300 rounded overflow-hidden position-relative text-white mb-g" onclick="document.getElementById('tab-tres').click()">
                        <div class="">
                            <h3 class="display-4 d-block l-h-n m-0 fw-500" id="lbTotalDocumentosPendientes">
                                0
                                <small class="m-0 l-h-n">Documentos pendientes</small>
                            </h3>
                        </div>
                        <i class="fal fa-list position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" style="font-size:6rem"></i>
                    </div>
                  
                </div>

                <div class="col-4">

                    
                    
                </div>
            </div>



             <div class="row hidden">
                <div class="col-4">

                    <div class="card border-base card-rounded shadow col-12">
                        <div class="card-body p-4">
                        </div>
                    </div>

                </div>

                <div class="col-4">

                    <div class="card border-base card-rounded shadow col-12">
                        <div class="card-body p-4">
                        </div>
                    </div>

                </div>

                <div class="col-4">

                    <div class="card border-base card-rounded shadow col-12">
                        <div class="card-body p-4">
                        </div>
                    </div>
                    
                </div>
            </div>
            `
        },
        productos_relleno:()=>{
            return `                   
                    <div class="card border-base card-rounded shadow col-12">
                        <div class="card-body p-2">
                               <h3 class="negrita text-base">Surtido pendiente por Sucursal</h3>
                               <div class="text-right">
                                    <h4 class="negrita text-danger" id="lbTotalPendientes"></h4>
                               </div>
                               <div class="form-group">
                                    <label class="negrita text-secondary">Clasificación de productos</label>
                                    <div class="input-group">
                                        <select class="form-control negrita text-base border-base" id="cmbTipoRentabilidad">
                                        </select>
                                    </div>
                               </div>
                               
                               <div class="table-responsive">
                                    
                                    <div class="form-group">
                                        <label class="negrita text-base">Escriba para filtrar</label>
                                        <input type="text" id="txtBuscarSurtido" class="form-control negrita text-verde" oninput="F.FiltrarTabla('tblSurtido','txtBuscarSurtido')">
                                    </div>

                                    <table class="table h-full table-hove table-bordered h-full" id="tblSurtido">
                                        <thead class="bg-base text-white">
                                            <tr>
                                                <td>PRODUCTO</td>
                                                <td>MARCA</td>
                                                <td>MIN</td>
                                                <td>MAX</td>
                                                <td>EXISTENCIA</td>
                                                <td>RELLENO</td>
                                                <td>ULTIMO</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataSurtido"></tbody>
                                    </table>
                               </div>
                                        
                        </div>
                    </div>
            `;
        },
        modal_existencia_sucursales:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" id="modal_existencia_sucursales">
                <div class="modal-dialog modal-dialog-center modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-base d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Existencias en todas las sucursales
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="row">
                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    
                                    <div class="card card-rounded">
                                        <div class="card-body p-4">

                                            <h3 class="negrita text-verde" id="lbDesprodSucursales"></h3>
                                            <h5 class="negrita text-secondary" id="lbDesmarcaSucursales"></h5>
                                        
                                            <table class="table table-responsive h-full f-med" id="">
                                                <thead class="negrita bg-base text-white">
                                                    <tr>
                                                        <td>SUCURSAL</td>
                                                        <td>MINIMO</td>
                                                        <td>MAXIMO</td>
                                                        <td>EXISTENCIA</td>
                                                        <td>RELLENO</td>
                                                    </tr>
                                                </thead>
                                                <tbody id="tblDataSucursales">
                                                            
                                                </tbody>
                                                <tfoot id="tblFooterSucursales" class="border-base text-base negrita">
                                                
                                                </tfoot>
                                            </table>


                                        </div>
                                    </div>

                                </div>

                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    
                                    <div class="card card-rounded">
                                        <div class="card-body p-4">

                                            <h5 class="negrita text-ver">Documentos pendientes del producto</h5>
                                        
                                            <table class="table table-responsive h-full f-med" id="">
                                                <thead class="negrita bg-verde text-white">
                                                    <tr>
                                                        <td>FECHA</td>
                                                        <td>DOCUMENTO</td>
                                                        <td>CANTIDAD SOLICITADA</td>
                                                    </tr>
                                                </thead>
                                                <tbody id="tblDataDocumentosProducto">
                                                            
                                                </tbody>
                                               
                                            </table>

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
    }

    root.innerHTML = view.body();

};


function addListeners(){

    document.title = 'Inicio Compras';

    compras_setupSucursalHeader();

    const cmbMesHeader = document.getElementById('cmbMesHeader');
    const cmbAnioHeader = document.getElementById('cmbAnioHeader');
    if (cmbMesHeader) {
        cmbMesHeader.innerHTML = F.ComboMeses();
        cmbMesHeader.value = F.get_mes_curso();
        cmbMesHeader.addEventListener('change', compras_onHeaderFiltersChange);
    }
    if (cmbAnioHeader) {
        cmbAnioHeader.innerHTML = F.ComboAnio();
        cmbAnioHeader.value = F.get_anio_curso();
        cmbAnioHeader.addEventListener('change', compras_onHeaderFiltersChange);
    }

    compras_setupMenuListeners();

    document.getElementById('cmbStatus')?.addEventListener('change', () => cargar_grid_embarques());

    GF.get_clasificaciones_listado('BI')
        .then((data) => {
            let str = "<option value='0'>TODAS</option>";
            data.recordset.map((r) => {
                str += `<option value='${r.CODIGO}'>${r.DESCRIPCION}</option>`;
            });
            const cmbTipo = document.getElementById('cmbTipoRentabilidad');
            if (cmbTipo) cmbTipo.innerHTML = str;
        })
        .catch(() => {
            const cmbTipo = document.getElementById('cmbTipoRentabilidad');
            if (cmbTipo) cmbTipo.innerHTML = '';
        });

    document.getElementById('cmbTipoRentabilidad')?.addEventListener('change', () => {
        get_tbl_surtido(GlobalEmpnit);
    });
};

function initView(){
    compras_hideGeneralMenu();
    document.getElementById('js-page-content')?.classList.add('proveedor-page');
    if (typeof compras_cxc_listeners_ready !== 'undefined') compras_cxc_listeners_ready = false;
    if (typeof compras_cxc_vendedores_ready !== 'undefined') compras_cxc_vendedores_ready = false;
    getView();
    addListeners();
    compras_showHome();
}

function destroyView() {
    compras_toggleSidebar(false);
    document.body.classList.remove('proveedor-sidebar-open');
    document.getElementById('js-page-content')?.classList.remove('proveedor-page');
}





function cargar_grid_embarques(){

    let statusEmbarque = document.getElementById('cmbStatus').value;
    let mes = compras_getMes();
    let anio = compras_getAnio();

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
                        <button type="button" class="btn btn-outline-info btn-md btn-circle hand shadow sygma-embarques-btn-action"
                            onclick="embarque_imprimir_productos('${r.CODEMBARQUE}','${F.convertDateNormal(r.FECHA)}')" title="Imprimir ${GlobalRptPicking}">
                            <i class="fal fa-print"></i>
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

function embarque_imprimir_productos(embarque, fechaLabel){
    const codembarque = embarque;
    if (!codembarque) return;
    const host = document.getElementById('sygma_embarque_print_host');
    if (!host) return;
    embarque_print_codembarque = codembarque;
    embarque_print_fecha = fechaLabel || '';
    embarque_print_show_loader(`Generando ${GlobalRptPicking}...`);
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
                    <td><span class="sygma-embarque-rpt__prod-main">${r.DESPROD}</span></td>
                    <td class="text-center">${r.UXC}</td>
                    <td class="text-center">${r.CAJAS}</td>
                    <td class="text-center">${r.UNIDADES}</td>
                    <td class="text-center">${Number(r.BONI || 0)}</td>
                    <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(r.IMPORTE, 'Q')}</td>
                </tr>`;
        });
        if (!strRows) strRows = `<tr><td colspan="7" class="text-center text-muted py-2">Sin productos</td></tr>`;
        host.innerHTML = embarque_print_sheet_open(GlobalRptPicking) + `
            <div class="table-responsive sygma-embarque-rpt__table-wrap">
                <table class="table sygma-embarque-rpt__table mb-0">
                    <thead><tr>
                        <th>CODIGO</th><th>PRODUCTO</th>
                        <th class="text-center">UXC</th><th class="text-center">CAJAS</th><th class="text-center">UNIDADES</th>
                        <th class="text-center">BONI</th>
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
    .catch((error) => {
        console.log(error);
        embarque_print_hide_loader(true);
        F.AvisoError(`No se pudo generar el reporte ${GlobalRptPicking}`);
        host.innerHTML = '';
    });
};

function embarque_fetch_resumen_vendedor(codembarque){
    return GF.get_data_embarque_resumen_vendedores(GlobalEmpnit, codembarque)
        .then((data) => data.recordset || [])
        .catch(() => []);
};

function embarque_print_show_loader(mensaje){
    const loader = document.getElementById('embPrintLoader');
    const actions = document.getElementById('embPrintActions');
    const footer = document.getElementById('embPrintFooter');
    const txt = loader?.querySelector('.sygma-embarque-print-modal__loader-text');
    if (txt) txt.textContent = mensaje || 'Generando imprimible...';
    loader?.classList.remove('d-none');
    actions?.classList.add('d-none');
    footer?.classList.add('d-none');
};
function embarque_print_hide_loader(keepModalOpen){
    document.getElementById('embPrintLoader')?.classList.add('d-none');
    document.getElementById('embPrintActions')?.classList.remove('d-none');
    document.getElementById('embPrintFooter')?.classList.remove('d-none');
    if (!keepModalOpen) $('#modal_embarque_imprimir').modal('hide');
};
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
};
function embarque_ejecutar_impresion(){
    document.body.classList.add('sygma-print-embarque-active');
    window.print();
    setTimeout(() => {
        document.body.classList.remove('sygma-print-embarque-active');
    }, 600);
};
function embarque_print_sheet_close(){
    return `</div></div>`;
};
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
};




function get_data_surtido(empnit,tipobi){
    return new Promise((resolve, reject)=>{
        
        let data = {
            token:TOKEN,
            sucursal:empnit,
            tipobi:tipobi
        };

        axios.post(`/compras/surtido_sucursales`, data)
        .then(res => {
            
            if(res.status.toString()=='200'){
                let data = res.data;
                if(Number(data.rowsAffected[0])>0){
                    resolve(data);             
                }else{
                    reject();
                }            
            }else{
                reject();
            } 
        })
        .catch(()=>{
            reject();
        })

    })
};

function get_tbl_surtido(empnit){


    let container = document.getElementById('tblDataSurtido');
    container.innerHTML = GlobalLoader;
    let lbTotal = document.getElementById('lbTotalPendientes');
    lbTotal.innerText = '---'


    let tipobi = document.getElementById('cmbTipoRentabilidad').value;

    let contador = 0;

   

    get_data_surtido(empnit,tipobi)
    .then((data)=>{
        
        let str = '';
        data.recordset.map((r)=>{
            contador +=1;
          
            str +=`
                <tr>
                    <td>${r.DESPROD}
                        <br>
                        <small class="negrita text-base">${r.CODPROD}</small>
                    </td>
                    <td>${r.DESMARCA}</td>
                    <td>${r.MINIMO}</td>
                    <td>${r.MAXIMO}</td>
                    <td class="negrita">${r.EXISTENCIA}</td>
                    <td class="negrita text-danger">${r.RELLENO}</td>
                    <td>${F.convertDateNormal(r.LASTUPDATE)}</td>
                    <td>
                        <button class="btn btn-base btn-circle btn-md hand shadow" onclick="get_existencia_sucursales('${r.CODPROD}','${r.DESPROD}','${r.DESMARCA}')">
                            <i class="fal fa-box"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
        lbTotal.innerText = `Pendientes surtir ${contador}`;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...'
        lbTotal.innerText = '---'
    })


}







function get_total_rellenos(){

    return new Promise((resolve, reject)=>{
        
        let data = {
            token:TOKEN
        };

        axios.post(`/compras/total_rellenos`, data)
        .then(res => {
            if(res.status.toString()=='200'){
                let data = res.data;
                if(Number(data.rowsAffected[0])>0){
                    resolve(data);             
                }else{
                    reject();
                }            
            }else{
                reject();
            } 
        })
        .catch(()=>{
            reject();
        })

    })
};



function get_existencia_sucursales(codprod,desprod,desmarca){

    $("#modal_existencia_sucursales").modal('show');

    document.getElementById('lbDesprodSucursales').innerText = desprod;
    document.getElementById('lbDesmarcaSucursales').innerText = desmarca;

    let container = document.getElementById('tblDataSucursales');
    container.innerHTML = GlobalLoader;

    GF.get_data_sucursales_existencia(codprod)
    .then((data)=>{
        let str = '';
        let strClassExist ='';
        let varMinimo =0; let varMaximo=0; let varExistencia =0; let varRelleno =0;
     
        data.recordset.map((r)=>{
            varMinimo += Number(r.MINIMO); 
            varMaximo += Number(r.MAXIMO); 
            varExistencia += Number(r.EXISTENCIA); 
            varRelleno += Number(r.RELLENO);
            if(Number(r.RELLENO)<0){strClassExist='text-success negrita'}else{strClassExist='text-danger negrita'}
            str += `
             <tr>
                <td>${r.NOMEMPRESA}</td>
                <td>${r.MINIMO}</td>
                <td>${r.MAXIMO}</td>
                <td>${r.EXISTENCIA}</td>
                <td class='${strClassExist}'>${r.RELLENO}</td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('tblFooterSucursales').innerHTML = ` <tr>
                                                                        <td></td>
                                                                        <td>${varMinimo}</td>
                                                                        <td>${varMaximo}</td>
                                                                        <td>${varExistencia}</td>
                                                                        <td>${varRelleno}</td>
                                                                    </tr>`
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('tblFooterSucursales').innerHTML = ` <tr>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                    </tr>`
    })


    let container2 = document.getElementById('tblDataDocumentosProducto');
    container2.innerHTML = GlobalLoader;

    GF.get_data_documentos_pendientes_producto(codprod)
    .then((data)=>{
        let str = '';
     
        data.recordset.map((r)=>{
            str += `
            <tr>
                <td>${F.convertDateNormal(r.FECHA)}
                    <br>
                    <small class="negrita text-danger">H:${r.HORA}</small>
                </td>
                <td>${r.CODDOC}-${r.CORRELATIVO}</td>
                <td>${r.CODMEDIDA} - ${r.CANTIDAD}</td>
            </tr>
            `
        })
        container2.innerHTML = str;
      
    })
    .catch(()=>{
        container2.innerHTML = 'No se cargaron datos....';
    })



}


(function () {
    window.__spaViewHooks = window.__spaViewHooks || {};
    window.__spaViewHooks['inicio/compras'] = {
        initView: initView,
        destroyView: destroyView
    };
})();

