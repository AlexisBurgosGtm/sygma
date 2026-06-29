var despacho_currentPane = 'uno';
var despacho_backTarget = 'uno';
var despacho_mapInstance = null;
var despacho_facturas_docs = [];

function despacho_showPanel(paneId, opts) {
    opts = opts || {};
    despacho_currentPane = paneId;
    if (opts.backTo) {
        despacho_backTarget = opts.backTo;
    } else if (paneId === 'uno') {
        despacho_backTarget = 'uno';
    }
    document.querySelectorAll('#myTabHomeContent .tab-pane').forEach((p) => {
        p.classList.remove('show', 'active');
    });
    const pane = document.getElementById(paneId);
    if (pane) {
        pane.classList.add('show', 'active');
    }
    document.querySelectorAll('#myTabHome .nav-link').forEach((l) => {
        l.classList.remove('active');
        l.setAttribute('aria-selected', 'false');
    });
    const tabLink = document.querySelector(`#myTabHome a[href="#${paneId}"]`);
    if (tabLink) {
        tabLink.classList.add('active');
        tabLink.setAttribute('aria-selected', 'true');
    }
    const backBtn = document.getElementById('despachoBtnVolver');
    if (backBtn) {
        backBtn.classList.toggle('d-none', paneId === 'uno');
    }
    const sub = document.getElementById('despachoHeaderSub');
    if (sub) {
        sub.textContent = opts.subtitle || '';
    }
    if (typeof opts.afterShow === 'function') {
        opts.afterShow();
    }
}

function despacho_goBack() {
    despacho_showPanel(despacho_backTarget || 'uno');
}

function despacho_goHome() {
    despacho_showPanel('uno');
}

function despacho_setupHeader() {
    const lbUser = document.getElementById('lbDespachoUsuario');
    const lbEmp = document.getElementById('lbDespachoEmpresa');
    if (lbUser) lbUser.textContent = GlobalUsuario || 'Repartidor';
    if (lbEmp) lbEmp.textContent = GlobalNomEmpresa || GlobalEmpnit || '';
    document.getElementById('despachoBtnVolver')?.addEventListener('click', despacho_goBack);
}

function getView(){
    root = document.getElementById('root');
    if (!root) return;
    let view = {
        body:()=>{
            return `
            <div class="despacho-layout proveedor-layout col-12 p-0">
                <div class="despacho-header proveedor-header-card card shadow-sm mb-2 mb-md-3">
                    <div class="card-body py-2 px-3">
                        <div class="row align-items-center no-gutters">
                            <div class="col-auto pr-2">
                                <img src="./favicon.png" width="44" height="44" alt="Logo" class="despacho-header__logo">
                            </div>
                            <div class="col min-width-0">
                                <h5 class="negrita text-white mb-0 despacho-header__title">Inicio repartidor</h5>
                                <small class="text-white-50 d-block text-truncate" id="lbDespachoEmpresa"></small>
                                <small class="text-white d-block text-truncate negrita" id="lbDespachoUsuario"></small>
                            </div>
                            <div class="col-auto pl-2">
                                <button type="button" class="btn btn-light btn-sm despacho-btn-volver d-none" id="despachoBtnVolver" title="Volver al listado">
                                    <i class="fal fa-arrow-left mr-1"></i><span class="d-none d-sm-inline">Volver</span>
                                </button>
                            </div>
                        </div>
                        <div class="despacho-header-sub text-white-50 small mt-1" id="despachoHeaderSub"></div>
                    </div>
                </div>
                <div class="despacho-content">
                    <div class="tab-content" id="myTabHomeContent">
                     
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           ${view.vista_documentos()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_detalle()}
                        </div>  
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_mapa()}
                        </div>  
                        <div class="tab-pane fade" id="cinco" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_devolucion() + view.modal_editar_cantidad()}
                        </div>
                        <div class="tab-pane fade" id="seis" role="tabpanel" aria-labelledby="home-tab">
                           ${view.vista_documentos_devoluciones()}
                        </div>
                        <div class="tab-pane fade" id="siete" role="tabpanel" aria-labelledby="home-tab">
                           ${view.vista_devoluciones_productos()}
                        </div>
                        <div class="tab-pane fade" id="ocho" role="tabpanel" aria-labelledby="home-tab">
                           ${view.vista_productos_embarque()}
                        </div>    
                    </div>

                    <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                       
                        <li class="nav-item">
                            <a class="nav-link active negrita text-success" id="tab-uno" data-toggle="tab" href="#uno" role="tab" aria-controls="profile" aria-selected="true">
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
                </div>
                </div>
            ${view.modal_concre_credito()}
            </div>
            `
        },
        vista_listado:()=>{
            return `
            <div class="despacho-pane despacho-pane--listado" id="despachoPaneListado">
                <div class="despacho-hero despacho-glass-panel mb-3">
                    <h2 class="despacho-hero__title negrita mb-1">Pickings asignados</h2>
                    <p class="despacho-hero__hint text-muted mb-0 small">Seleccione un embarque para ver facturas, devoluciones, productos o mapa.</p>
                </div>
                <div class="despacho-embarques-grid" id="tblEmbarques"></div>
            </div>
            `
        },
        despacho_panel_toolbar:(title, metaId)=>{
            return `
            <div class="despacho-panel-head mb-3">
                <div class="despacho-panel-head__main">
                    <h2 class="despacho-panel-head__title negrita text-base mb-1">${title}</h2>
                    <div class="despacho-panel-head__meta text-danger negrita" id="${metaId}"></div>
                </div>
            </div>`;
        },
        despacho_table_shell:(tableId, theadHtml, tbodyId)=>{
            return `
            <div class="table-responsive despacho-table-wrap">
                <table class="table table-sm table-bordered despacho-table mb-0" id="${tableId}">
                    <thead class="bg-base text-white">${theadHtml}</thead>
                    <tbody id="${tbodyId}"></tbody>
                </table>
            </div>`;
        },
        vista_documentos:()=>{
            return `
            <div class="despacho-pane card border-0 shadow-sm">
                <div class="card-body p-2 p-md-3">
                    ${view.despacho_panel_toolbar('Facturas del embarque', 'lbEmbarque')}
                    <div class="despacho-stat-pill mb-2" id="lbTotalEmbarque"></div>
                    <div class="form-group despacho-field mb-2">
                        <label class="despacho-label negrita text-secondary mb-1">Vendedor</label>
                        <select class="form-control form-control-sm negrita" id="cmbEmpleadosFac"></select>
                    </div>
                    <div class="form-group despacho-field mb-2">
                        <div class="despacho-facturas-filters">
                            <input type="search" class="form-control form-control-sm negrita border-base despacho-facturas-filters__search"
                                placeholder="Buscar factura, cliente, dirección..."
                                oninput="despacho_aplicar_filtros_facturas()" id="txtBuscarDocumento">
                            <select class="form-control form-control-sm negrita despacho-facturas-filters__concre" id="cmbFiltroConcreFac"
                                onchange="despacho_aplicar_filtros_facturas()">
                                <option value="TODAS">TODAS</option>
                                <option value="CON">CONTADO</option>
                                <option value="CRE">CRÉDITO</option>
                            </select>
                        </div>
                    </div>
                    ${view.despacho_table_shell('tblDocumentos', '<tr><th>Factura / cliente</th><th class="text-right">Importe</th></tr>', 'tblDataDocumentos')}
                </div>
            </div>
            `
        },
        modal_concre_credito:()=>{
            return `
            <div class="modal fade" id="modalDespachoConcreCredito" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-md" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2">
                            <h5 class="modal-title text-white negrita mb-0">Cambiar a crédito</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span aria-hidden="true">&times;</span></button>
                        </div>
                        <div class="modal-body p-3">
                            <p class="text-muted text-center mb-3">Factura <span class="negrita text-info" id="lbDespachoConcreCreditoDoc">—</span></p>
                            <div class="form-group mb-2">
                                <label class="negrita text-secondary mb-1" for="cmbDespachoDiasCredito">Días de crédito</label>
                                <select class="form-control form-control-sm negrita" id="cmbDespachoDiasCredito">
                                    <option value="7">7</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="25">25</option>
                                    <option value="30">30</option>
                                    <option value="40">40</option>
                                    <option value="60">60</option>
                                    <option value="90">90</option>
                                </select>
                            </div>
                            <div class="form-group mb-2">
                                <label class="negrita text-secondary mb-1" for="txtDespachoVencimientoCredito">Fecha de vencimiento</label>
                                <input type="date" class="form-control form-control-sm negrita" id="txtDespachoVencimientoCredito">
                            </div>
                            <div class="form-group mb-2">
                                <label class="negrita text-secondary mb-1" for="txtDespachoCreditoImporte">Importe</label>
                                <input type="text" class="form-control form-control-sm negrita text-right" id="txtDespachoCreditoImporte" readonly>
                            </div>
                            <div class="form-group mb-2">
                                <label class="negrita text-secondary mb-1" for="txtDespachoDescuentoCredito">Descuento</label>
                                <input type="number" class="form-control form-control-sm negrita text-right" id="txtDespachoDescuentoCredito" min="0" step="0.01" value="0">
                            </div>
                            <div class="form-group mb-0">
                                <label class="negrita text-secondary mb-1" for="txtDespachoCreditoAPagar">A pagar</label>
                                <input type="text" class="form-control form-control-sm negrita text-danger text-right" id="txtDespachoCreditoAPagar" readonly>
                            </div>
                        </div>
                        <div class="modal-footer py-2 px-3 justify-content-between">
                            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal"><i class="fal fa-times mr-1"></i> Cancelar</button>
                            <button type="button" class="btn btn-base btn-sm" id="btnDespachoConfirmarCredito"><i class="fal fa-check mr-1"></i> Aplicar</button>
                        </div>
                    </div>
                </div>
            </div>`;
        },
        vista_documentos_devoluciones:()=>{
            return `
            <div class="despacho-pane card border-0 shadow-sm">
                <div class="card-body p-2 p-md-3">
                    ${view.despacho_panel_toolbar('Devoluciones del embarque', 'lbEmbarqueDev')}
                    <div class="despacho-stat-pill mb-2" id="lbTotalEmbarqueDev"></div>
                    <div class="table-responsive despacho-table-wrap mb-3">
                        <table class="table table-sm table-bordered despacho-table mb-0">
                            <thead class="bg-secondary text-white"><tr><th>Vendedor</th><th>Dev</th><th class="text-right">Importe</th></tr></thead>
                            <tbody id="tblDataResumenDevoluciones"></tbody>
                        </table>
                    </div>
                    <div class="form-group despacho-field mb-2">
                        <input type="search" class="form-control form-control-sm negrita border-base"
                            placeholder="Buscar devolución..."
                            oninput="F.FiltrarTabla('tblDocumentosDev','txtBuscarDocumentoDev')" id="txtBuscarDocumentoDev">
                    </div>
                    ${view.despacho_table_shell('tblDocumentosDev', '<tr><th>Devolución</th><th class="text-right">Importe</th></tr>', 'tblDataDocumentosDev')}
                </div>
            </div>
            `
        },
        vista_detalle:()=>{
            return `
            <div class="despacho-pane card border-0 shadow-sm">
                <div class="card-body p-2 p-md-3">
                    <h2 class="despacho-panel-head__title negrita text-base mb-2">Detalle de documento</h2>
                    <div class="table-responsive despacho-table-wrap">
                        <table class="table table-sm table-bordered table-hover despacho-table mb-0">
                            <thead class="bg-secondary text-white">
                                <tr><th>Producto</th><th>Medida</th><th class="text-center">Cant.</th><th class="text-right">Precio</th><th class="text-right">Importe</th></tr>
                            </thead>
                            <tbody id="tblDataDetalle"></tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="4" class="text-right negrita">Total</td>
                                    <td class="text-right negrita text-danger"><span id="lbDetalleTotal"></span></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <button type="button" class="d-none" id="btn_atras_facturas" onclick="despacho_showPanel('dos')"></button>
            <button type="button" class="d-none" id="btn_atras_devoluciones" onclick="despacho_showPanel('seis')"></button>
            `
        },
        vista_mapa:()=>{
            return `
            <div class="despacho-pane card border-0 shadow-sm">
                <div class="card-body p-0 p-md-2">
                    <div class="px-2 pt-2 pb-1 negrita text-danger" id="lbEmbarqueMapa"></div>
                    <div class="despacho-map-host" id="container_mapa"></div>
                </div>
            </div>
            `
        },
        vista_devolucion:()=>{
            return `
            <div class="despacho-pane">
                <div class="card border-0 shadow-sm mb-2">
                    <div class="card-body p-2 p-md-3">
                        <div class="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2">
                            <h2 class="despacho-panel-head__title negrita text-base mb-0">Productos devueltos</h2>
                            <div class="despacho-stat-pill mb-0" id="lbTotal"></div>
                        </div>
                        <div class="table-responsive despacho-table-wrap">
                            <table class="table table-sm table-bordered despacho-table mb-0">
                                <thead class="bg-base text-white">
                                    <tr>
                                        <th>Producto</th><th>Medida</th><th class="text-center">Cant.</th>
                                        <th class="text-right">Precio</th><th class="text-right">Importe</th>
                                        <th class="despacho-col-action"></th><th class="despacho-col-action"></th>
                                        <th class="text-center">Cant. orig.</th>
                                    </tr>
                                </thead>
                                <tbody id="tblDataProductos"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                ${view.frag_encabezado()}
                <div class="despacho-fab-bar oculto-impresion">
                    <button type="button" class="btn btn-base btn-lg despacho-fab-save shadow hand" id="btnGuardar">
                        <i class="fal fa-save mr-1"></i> Guardar devolución
                    </button>
                </div>
            </div>
            `
        },
        modal_editar_cantidad:()=>{
            return `
            <div class="modal fade despacho-modal-cantidad" id="modal_editar_cantidad" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-md" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2">
                            <h5 class="modal-title text-white negrita mb-0" id="lbCantidadDesprodE">Cantidad de producto</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span aria-hidden="true">&times;</span></button>
                        </div>
                        <div class="modal-body p-3">
                            <div class="form-group despacho-field mb-2">
                                <label class="despacho-label negrita text-secondary mb-1">Cantidad</label>
                                <input type="number" class="form-control form-control-sm negrita text-info border-base" id="txtMCCantidadE">
                            </div>
                            <div class="form-group despacho-field mb-2">
                                <label class="despacho-label negrita text-secondary mb-1">Precio ${GlobalSignoMoneda}</label>
                                <input disabled type="number" class="form-control form-control-sm negrita border-base" id="txtMCPrecioE">
                            </div>
                            <div class="form-group despacho-field mb-0">
                                <label class="despacho-label negrita text-secondary mb-1">Subtotal ${GlobalSignoMoneda}</label>
                                <input type="number" class="form-control form-control-sm negrita text-danger border-base" id="txtMCTotalPrecioE" disabled>
                            </div>
                            <input type="number" class="hidden" id="txtMCDescuentoE" oninput="calcular_descuento('txtMCDescuentoE','txtMCTotalPrecioE','txtMCTotalPrecioDescuentoE')">
                            <input type="number" class="hidden" id="txtMCTotalPrecioDescuentoE" disabled>
                        </div>
                        <div class="modal-footer py-2 px-3 justify-content-between">
                            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal"><i class="fal fa-times mr-1"></i> Cancelar</button>
                            <button type="button" class="btn btn-base btn-sm" id="btnMCGuardarE"><i class="fal fa-check mr-1"></i> Aplicar</button>
                        </div>
                    </div>
                </div>
            </div>`
        },
        frag_encabezado:()=>{
            return `
            <div class="card border-0 shadow-sm">
                <div class="card-body p-2 p-md-3">
                    <div class="form-group despacho-field mb-2">
                        <label class="despacho-label negrita text-secondary mb-1">Cliente</label>
                        <div class="negrita text-danger" id="lbNomclie"></div>
                        <small class="negrita text-danger d-block" id="lbNegocio"></small>
                        <small class="negrita text-secondary d-block" id="lbDirclie"></small>
                    </div>
                    <div class="row mx-0">
                        <div class="col-md-6 pl-0 pr-md-2 pr-0">
                            <div class="form-group despacho-field mb-2">
                                <label class="despacho-label negrita text-secondary mb-1">Motivo</label>
                                <select class="form-control form-control-sm negrita" id="cmbObs"></select>
                            </div>
                        </div>
                        <div class="col-md-6 pl-md-2 pl-0 pr-0">
                            <div class="form-group despacho-field mb-2">
                                <label class="despacho-label negrita text-secondary mb-1">Vendedor</label>
                                <select class="form-control form-control-sm negrita" id="cmbEmpleados" disabled="true"></select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group despacho-field mb-2">
                        <label class="despacho-label negrita text-secondary mb-1">Documento devolución</label>
                        <div class="input-group input-group-sm">
                            <select class="form-control negrita" id="cmbCoddoc" disabled="true"></select>
                            <input type="number" id="txtCorrelativo" class="form-control negrita" disabled="true">
                            <input type="date" id="txtFecha" class="form-control negrita">
                        </div>
                    </div>
                    <div class="row mx-0">
                        <div class="col-md-6 pl-0 pr-md-2 pr-0">
                            <div class="form-group despacho-field mb-2">
                                <label class="despacho-label negrita text-secondary mb-1">Caja</label>
                                <select class="form-control form-control-sm negrita" id="cmbCaja"></select>
                            </div>
                        </div>
                        <div class="col-md-6 pl-md-2 pl-0 pr-0">
                            <div class="form-group despacho-field mb-2">
                                <label class="despacho-label negrita text-secondary mb-1">Factura origen</label>
                                <div class="input-group input-group-sm">
                                    <input type="text" class="form-control" id="cmbCoddocFac" disabled="true">
                                    <input type="text" class="form-control" id="cmbCorrelativoFac" disabled="true">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group despacho-field mb-0">
                        <label class="despacho-label negrita text-secondary mb-1">Embarque / picking</label>
                        <input type="text" class="form-control form-control-sm negrita" id="txtCodembarque" disabled="true">
                    </div>
                    <input class="hidden" type="number" id="txtCodclie" disabled="true">
                    <input class="hidden" type="text" id="txtNit" disabled="true">
                </div>
            </div>
            `
        },
        vista_devoluciones_productos:()=>{
            return `
            <div class="despacho-pane card border-0 shadow-sm">
                <div class="card-body p-2 p-md-3">
                    ${view.despacho_panel_toolbar('Productos devueltos', 'lbEmbarqueDeProd')}
                    <div class="despacho-stat-pill mb-2" id="lbTotalDevProd"></div>
                    <div class="form-group despacho-field mb-2">
                        <input type="search" class="form-control form-control-sm negrita border-base"
                            placeholder="Buscar producto..."
                            oninput="F.FiltrarTabla('tblDocumentosDevProd','txtBuscarDocumentoDevProd')" id="txtBuscarDocumentoDevProd">
                    </div>
                    <div class="table-responsive despacho-table-wrap">
                        <table class="table table-sm table-bordered despacho-table mb-0" id="tblDocumentosDevProd">
                            <thead class="bg-primary text-white">
                                <tr><th>Producto</th><th class="text-center">UXC</th><th class="text-center">Cajas</th><th class="text-center">Unidades</th><th class="text-right">Importe</th><th></th></tr>
                            </thead>
                            <tbody id="tblDataDocumentosDevProd"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            `
        },
        vista_productos_embarque:()=>{
            return `
            <div class="despacho-pane card border-0 shadow-sm">
                <div class="card-body p-2 p-md-3">
                    ${view.despacho_panel_toolbar(GlobalRptPicking, 'lbEmbarqueProd')}
                    <div class="d-flex flex-wrap gap-2 mb-2">
                        <div class="despacho-stat-pill mb-0" id="lbEmbProdItems"></div>
                        <div class="despacho-stat-pill mb-0" id="lbEmbProdTotal"></div>
                    </div>
                    <div class="form-group despacho-field mb-2">
                        <input type="search" class="form-control form-control-sm negrita border-base"
                            placeholder="Buscar código o producto..."
                            oninput="F.FiltrarTabla('tblEmbarqueProductos','txtBuscarEmbarqueProductos')" id="txtBuscarEmbarqueProductos">
                    </div>
                    <div class="table-responsive despacho-table-wrap despacho-table-wrap--emb-prod mb-3">
                        <table class="table table-sm table-bordered despacho-table despacho-table--emb-prod mb-0" id="tblEmbarqueProductos">
                            <thead class="bg-base text-white">
                                <tr>
                                    <th class="despacho-emb-prod__th-product">Producto</th>
                                    <th class="text-center despacho-emb-prod__th-num"><span class="despacho-th-long">UXC</span><span class="despacho-th-short">UXC</span></th>
                                    <th class="text-center despacho-emb-prod__th-num"><span class="despacho-th-long">Cajas</span><span class="despacho-th-short">Cj</span></th>
                                    <th class="text-center despacho-emb-prod__th-num"><span class="despacho-th-long">Unid.</span><span class="despacho-th-short">Ud</span></th>
                                    <th class="text-center despacho-emb-prod__th-num"><span class="despacho-th-long">Boni</span><span class="despacho-th-short">B</span></th>
                                    <th class="text-right despacho-emb-prod__th-importe"><span class="despacho-th-long">Importe</span><span class="despacho-th-short">$</span></th>
                                </tr>
                            </thead>
                            <tbody id="tblDataEmbarqueProductos"></tbody>
                        </table>
                    </div>
                    <h3 class="despacho-panel-head__title negrita text-base mb-2">Resumen por vendedor</h3>
                    <div class="table-responsive despacho-table-wrap despacho-table-wrap--emb-resumen">
                        <table class="table table-sm table-bordered despacho-table despacho-table--emb-resumen mb-0" id="tblEmbarqueResumenVendedor">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <th>Vendedor</th>
                                    <th class="text-center">Pedidos</th>
                                    <th class="text-right">Importe</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataEmbarqueResumenVendedor"></tbody>
                        </table>
                    </div>
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

            <button type="button" class="btn btn-success btn-lg btn-circle hand shadow sygma-embarques-fab sygma-fab-nuevo oculto-impresion" id="btnEmbarquesNuevo" title="Nuevo embarque">
                <i class="fal fa-plus"></i>
            </button>

            <div id="sygma_embarque_print_host" class="sygma-embarque-print-host" aria-hidden="true"></div>
            `
        },
    }

    root.innerHTML = view.body();

};

function addListeners(){

    document.getElementById('cmbObs').innerHTML = F.ComboMotivosDevolucion();
      
    get_tbl_embarques_pendientes();

    listeners_devolucion();
    despacho_setup_concre_credito_listeners();

    F.slideAnimationTabs();
    
};

var despacho_concre_pendiente = null;

function despacho_sumar_dias_fecha(dias) {
    const base = F.getFecha();
    const [yy, mm, dd] = base.split('-').map(Number);
    const d = new Date(yy, mm - 1, dd);
    d.setDate(d.getDate() + Number(dias || 0));
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function despacho_calc_vencimiento_credito() {
    const dias = document.getElementById('cmbDespachoDiasCredito')?.value || '7';
    const txt = document.getElementById('txtDespachoVencimientoCredito');
    if (txt) txt.value = despacho_sumar_dias_fecha(dias);
}

function despacho_calc_credito_totales() {
    const importe = Number(despacho_concre_pendiente?.importe || 0);
    const descuento = Number(document.getElementById('txtDespachoDescuentoCredito')?.value || 0);
    const descuentoOk = descuento > importe ? importe : descuento;
    const txtDesc = document.getElementById('txtDespachoDescuentoCredito');
    if (txtDesc && descuento !== descuentoOk) txtDesc.value = descuentoOk;
    const aPagar = Math.max(0, importe - descuentoOk);
    const txtAPagar = document.getElementById('txtDespachoCreditoAPagar');
    if (txtAPagar) txtAPagar.value = F.setMoneda(aPagar, 'Q');
}

function despacho_abrir_modal_credito(coddoc, correlativo, idbtn) {
    const doc = despacho_facturas_docs.find((d) =>
        d.CODDOC === coddoc && String(d.CORRELATIVO) === String(correlativo)
    );
    const importe = Number(doc?.IMPORTE || 0);
    const descuento = Number(doc?.TOTALDESCUENTO || 0);
    despacho_concre_pendiente = { coddoc, correlativo, idbtn, importe };
    const lb = document.getElementById('lbDespachoConcreCreditoDoc');
    if (lb) lb.innerText = `${coddoc}-${correlativo}`;
    const cmb = document.getElementById('cmbDespachoDiasCredito');
    if (cmb) cmb.value = '7';
    const txtImporte = document.getElementById('txtDespachoCreditoImporte');
    if (txtImporte) txtImporte.value = F.setMoneda(importe, 'Q');
    const txtDesc = document.getElementById('txtDespachoDescuentoCredito');
    if (txtDesc) txtDesc.value = descuento > 0 ? descuento : 0;
    despacho_calc_vencimiento_credito();
    despacho_calc_credito_totales();
    $('#modalDespachoConcreCredito').modal('show');
}

function despacho_setup_concre_credito_listeners() {
    document.getElementById('cmbDespachoDiasCredito')?.addEventListener('change', despacho_calc_vencimiento_credito);
    document.getElementById('txtDespachoDescuentoCredito')?.addEventListener('input', despacho_calc_credito_totales);
    document.getElementById('btnDespachoConfirmarCredito')?.addEventListener('click', despacho_confirmar_credito);
    $('#modalDespachoConcreCredito')?.on('hidden.bs.modal', () => {
        const btn = despacho_concre_pendiente?.idbtn ? document.getElementById(despacho_concre_pendiente.idbtn) : null;
        if (btn) btn.disabled = false;
        despacho_concre_pendiente = null;
    });
}

function despacho_confirmar_credito() {
    const p = despacho_concre_pendiente;
    if (!p) return;

    const diascredito = Number(document.getElementById('cmbDespachoDiasCredito')?.value || 7);
    const vencimiento = document.getElementById('txtDespachoVencimientoCredito')?.value;
    const importe = Number(p.importe || 0);
    const descuento = Number(document.getElementById('txtDespachoDescuentoCredito')?.value || 0);
    if (!vencimiento) {
        F.AvisoError('Indique la fecha de vencimiento');
        return;
    }
    if (descuento < 0) {
        F.AvisoError('El descuento no puede ser negativo');
        return;
    }
    if (descuento > importe) {
        F.AvisoError('El descuento no puede ser mayor al importe');
        return;
    }

    const btnConfirm = document.getElementById('btnDespachoConfirmarCredito');
    if (btnConfirm) btnConfirm.disabled = true;

    GF.documento_update_concre(GlobalEmpnit, p.coddoc, p.correlativo, 'CRE', diascredito, vencimiento, descuento)
        .then(() => {
            F.Aviso('Forma de pago actualizada a CRÉDITO');
            $('#modalDespachoConcreCredito').modal('hide');
            despacho_update_concre_fila(p.coddoc, p.correlativo, 'CRE');
        })
        .catch(() => {
            F.AvisoError('No se pudo actualizar la forma de pago');
            const btnRow = p.idbtn ? document.getElementById(p.idbtn) : null;
            if (btnRow) btnRow.disabled = false;
        })
        .finally(() => {
            if (btnConfirm) btnConfirm.disabled = false;
        });
}

function despacho_hideGeneralMenu() {
    document.body.classList.add('spa-nav-hidden');
    const sidebar = document.getElementById('root_navbar');
    const nav = document.getElementById('js-primary-nav');
    if (sidebar) sidebar.style.display = 'none';
    if (nav) {
        nav.innerHTML = '';
        nav.style.visibility = 'hidden';
    }
}

function initView(){
    despacho_hideGeneralMenu();
    document.getElementById('js-page-content')?.classList.add('proveedor-page');
    getView();
    despacho_setupHeader();
    despacho_showPanel('uno');
    addListeners();
}

function destroyView() {
    document.getElementById('js-page-content')?.classList.remove('proveedor-page');
    despacho_teardownMap();
    try {
        $('#modal_editar_cantidad').modal('hide');
        $('#modalDespachoConcreCredito').modal('hide');
    } catch (e) { /* sin modal activo */ }
}

function listeners_devolucion(){



    GF.get_data_tipodoc_coddoc_sucursal(GlobalEmpnit,'DEV')
    .then((data)=>{

        let strCoddoc = ''
        data.recordset.map((r)=>{
            strCoddoc += `<option value="${r.CODDOC}">${r.CODDOC}</option>`
        })        
        document.getElementById('cmbCoddoc').innerHTML = strCoddoc;
        document.getElementById('cmbCoddoc').value = Selected_coddoc_env;

        GF.get_data_coddoc_correlativo_sucursal(GlobalEmpnit,document.getElementById('cmbCoddoc').value)
        .then((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
        .catch((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})


    })
    .catch(()=>{

        document.getElementById('cmbCoddoc').innerHTML = `<option value=''></option>`;
        document.getElementById('txtCorrelativo').value = '0'
    
    })


    document.getElementById('cmbCoddoc').addEventListener('change',()=>{
        GF.get_data_coddoc_correlativo_sucursal(sucursal,document.getElementById('cmbCoddoc').value)
        .then((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
        .catch((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
    })

    
    //carga cajas
     GF.get_data_cajas_sucursal(GlobalEmpnit)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `<option value="${r.CODCAJA}">${r.DESCAJA}</option>`
        });
        document.getElementById('cmbCaja').innerHTML = str;
    })
    .catch(()=>{
        F.AvisoError('No se cargaron las cajas');
        document.getElementById('cmbCaja').innerHTML ='<option value="1">SIN CAJA</option>';
    })

    //carga empleados
     GF.get_data_empleados_tipo_emp(3,GlobalEmpnit)
    .then((data)=>{
            let str = '';
            data.recordset.map((r)=>{
                str += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>`
            });
            document.getElementById('cmbEmpleados').innerHTML = str;
            document.getElementById('cmbEmpleadosFac').innerHTML = `<option value='TODOS'>TODOS</OPTION>`;
                
                document.getElementById('cmbEmpleadosFac').addEventListener('change',()=>{
                    get_tbl_documentos_embarque(selected_codembarque);
                })
        })
    .catch(()=>{
            F.AvisoError('No se cargaron los vendedores');
            document.getElementById('cmbEmpleados').innerHTML ='<option value="1">SIN VENDEDOR</option>';
    })

 


    document.getElementById('txtFecha').value = F.getFecha();


   
  

     //--------------------------------
    //modal editar cantidad
    //---------------------------
    let btnMCGuardarE = document.getElementById('btnMCGuardarE');
    btnMCGuardarE.addEventListener('click',()=>{

        let cantidad = Number(document.getElementById('txtMCCantidadE').value || 1);
        let preciounitario = Number(document.getElementById('txtMCPrecioE').value||0);
        let descuento =Number(document.getElementById('txtMCDescuentoE').value||0);

            


        let nuevacantidad = Number(cantidad);
        db_devoluciones.update_row(Number(Selected_id),nuevacantidad,preciounitario,descuento)
        .then(()=>{
            $("#modal_editar_cantidad").modal('hide');

            F.showToast('Producto agregado ' + Selected_desprod);
            get_grid_productos();

            
        })
        .catch(()=>{
            F.AvisoError('No se pudo agregar');
        })



    });
    document.getElementById('txtMCCantidadE').addEventListener('input',()=>{
        
        let cantidad = Number(document.getElementById('txtMCCantidadE').value || 0);
        if(cantidad>Number(Selected_cantidad_original)){document.getElementById('txtMCCantidadE').value=Selected_cantidad_original};

        CalcularTotalPrecioEditar();  
    });
    document.getElementById('txtMCCantidadE').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            //document.getElementById('txtMCPrecioE').focus();
            document.getElementById('btnMCGuardarE').focus();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            //document.getElementById('txtMCPrecioE').focus();
            document.getElementById('btnMCGuardarE').focus();
        };  
    });
    document.getElementById('txtMCPrecioE').addEventListener('input',()=>{
        CalcularTotalPrecioEditar();  
    });
    document.getElementById('txtMCPrecioE').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            document.getElementById('btnMCGuardarE').focus();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            document.getElementById('btnMCGuardarE').focus();
        };  
    });
    document.getElementById('txtMCDescuentoE').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            document.getElementById('btnMCGuardarE').focus();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            document.getElementById('btnMCGuardarE').focus();
        };  
    });

    //--------------------------------
    //modal editar cantidad
    //--------------------------------


    let btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click',()=>{

            get_grid_productos();
          

            F.Confirmacion('¿Está seguro que desea GUARDAR este Documento?')
            .then((value)=>{
                if(value==true){
                    
                    if(global_var_total_precio==0){F.AvisoError('Agregue productos al documento');return;};
                    let codclie = document.getElementById('txtCodclie').value || '';
                    if(codclie.toString()==''){F.AvisoError('No se selecciono una Factura');return;}

                    let sucursal = GlobalEmpnit;  //document.getElementById('cmbSucursal').value;
                    let coddoc = document.getElementById('cmbCoddoc').value;

                    btnGuardar.disabled = true;
                    btnGuardar.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                    F.showToast('Obteniendo el correlativo del documento a generar');

                    GF.get_data_coddoc_correlativo_sucursal(sucursal,coddoc)
                    .then((correlativo)=>{
        
                                document.getElementById('txtCorrelativo').value = correlativo;
                    
                                console.log('aqui 1');

                                insert_documento()
                                .then(()=>{

                                    F.Aviso('Documento Creado Exitosamente!!');

                                    btnGuardar.disabled = false;
                                    btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;

                                    
                                    let codemp = document.getElementById('cmbEmpleados').value;
                                    let nomclie = document.getElementById('lbNomclie').innerText;
                                    let total = document.getElementById('lbTotal').innerText;
                                    
                                    socket.emit('nueva_devolucion_reparto', codemp,nomclie,total)

                                    clean_data();

                                    
                                    get_grid_productos();

                                    despacho_showPanel('dos', { subtitle: 'Embarque: ' + selected_codembarque, backTo: 'uno' });

                                    get_tbl_documentos_embarque(selected_codembarque);


                                })
                                .catch((error)=>{
                                    
                                    console.log(error);

                                    F.AvisoError('No se pudo crear el documento');

                                    btnGuardar.disabled = false;
                                    btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;

                                })
                    })
                    .catch((correlativo)=>{

                        document.getElementById('txtCorrelativo').value = correlativo;
                        F.AvisoError('No se logro obtener el correlativo');

                        btnGuardar.disabled = false;
                        btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;

                    })

                  
                   
                   


                }
            })




    });


};


function get_data_embarques_pendientes(){


     return new Promise((resolve,reject)=>{

        console.log('intenta cargar...')

        axios.post(GlobalUrlCalls + '/repartidor/embarques_repartidor',{
            sucursal:GlobalEmpnit,
            codrep:GlobalCodUsuario
         })      
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

function get_tbl_embarques_pendientes(){

    let container = document.getElementById('tblEmbarques');
    container.innerHTML = GlobalLoader;

    get_data_embarques_pendientes()
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `
            <article class="despacho-embarque-card">
                <div class="despacho-embarque-card__glass">
                    <header class="despacho-embarque-card__head">
                        <span class="despacho-embarque-card__route negrita">${r.RUTA}</span>
                        <span class="despacho-embarque-card__code">${r.CODEMBARQUE}</span>
                    </header>
                    <div class="despacho-embarque-card__fecha">Fecha: ${F.convertDateNormal(r.FECHA)}</div>
                    <div class="despacho-embarque-actions">
                        <button type="button" class="despacho-embarque-btn despacho-embarque-btn--primary hand" onclick="get_data_embarque_devoluciones('${r.CODEMBARQUE}')">
                            <i class="fal fa-flag"></i><span>Devoluciones</span>
                        </button>
                        <button type="button" class="despacho-embarque-btn despacho-embarque-btn--info hand" onclick="get_data_embarque('${r.CODEMBARQUE}')">
                            <i class="fal fa-list"></i><span>Facturas</span>
                        </button>
                        <button type="button" class="despacho-embarque-btn despacho-embarque-btn--outline hand" onclick="get_data_embarque_devoluciones_productos('${r.CODEMBARQUE}')">
                            <i class="fal fa-box"></i><span>Prod. devueltos</span>
                        </button>
                        <button type="button" class="despacho-embarque-btn despacho-embarque-btn--secondary hand" onclick="get_mapa_embarque('${r.CODEMBARQUE}')">
                            <i class="fal fa-map"></i><span>Mapa</span>
                        </button>
                    </div>
                    <button type="button" class="despacho-embarque-card__report hand" onclick="get_reporte_productos_embarque('${r.CODEMBARQUE}')">
                        <i class="fal fa-boxes"></i><span>${GlobalRptPicking}</span>
                    </button>
                </div>
            </article>`;
        });
        container.innerHTML = str || '<div class="despacho-empty text-center text-muted py-4">No hay pickings asignados.</div>';
    })
    .catch(()=>{
        container.innerHTML = '<div class="despacho-empty text-center text-muted py-4">No hay pickings asignados.</div>';
    });

}


function get_data_embarque(codembarque){

    despacho_showPanel('dos', { subtitle: 'Embarque: ' + codembarque, backTo: 'uno' });

    document.getElementById('lbEmbarque').innerText = codembarque;

    selected_codembarque = codembarque;

    document.getElementById('cmbEmpleadosFac').innerHTML = `<option value='TODOS'>TODOS</option>`;
    document.getElementById('cmbEmpleadosFac').value = 'TODOS';

    const cmbFiltroConcre = document.getElementById('cmbFiltroConcreFac');
    if (cmbFiltroConcre) cmbFiltroConcre.value = 'TODAS';
    const txtBuscar = document.getElementById('txtBuscarDocumento');
    if (txtBuscar) txtBuscar.value = '';

    get_tbl_documentos_embarque(selected_codembarque);


};
function get_data_embarque_devoluciones(codembarque){

    despacho_showPanel('seis', { subtitle: 'Embarque: ' + codembarque, backTo: 'uno' });

    document.getElementById('lbEmbarqueDev').innerText = codembarque;

    selected_codembarque = codembarque;

    get_tbl_documentos_embarque_devoluciones(selected_codembarque);

    get_tbl_documentos_embarque_devoluciones_resumen(selected_codembarque);

};

//FACTURAS
function get_data_documentos_embarque(codembarque,codemp){

    return new Promise((resolve,reject)=>{
       

        axios.post('/repartidor/embarque_documentos',{
            sucursal:GlobalEmpnit,
            codembarque:codembarque,
            codemp:codemp
         })
         .then((response) => {
             console.log('pasa por aqui...')
             let data = response.data;
             /*
             if(Number(data.rowsAffected[0])>0){
                 resolve(data);             
             }else{
                 reject();
             } */            
             if(response=='error'){reject()}else{resolve(data)}
         }, (error) => {
            console.log('error en solicitud')
            console.log(error);
             reject();
         });


    })

};
function despacho_label_concre(concre) {
    if (concre === 'CRE') return 'CRÉDITO';
    if (concre === 'CON') return 'CONTADO';
    return concre || 'CONTADO';
}

function despacho_concre_btn_class(concre) {
    if (concre === 'CRE') return 'despacho-action-btn--credito';
    return 'despacho-action-btn--concre';
}

function despacho_build_factura_row(r, codembarque) {
    let strBtnDevuelto = Number(r.DEVUELTO) === 0 ? '' : 'hidden';
    const concreVal = (r.CONCRE === 'CRE') ? 'CRE' : 'CON';
    const concreLabel = despacho_label_concre(concreVal);
    const concreBtnClass = despacho_concre_btn_class(concreVal);

    return `
            <tr class="despacho-doc-row" data-concre="${concreVal}" data-importe="${Number(r.IMPORTE) || 0}">
                <td class="despacho-doc-cell">
                    <div class="despacho-doc-card">
                        <div class="despacho-doc-card__tags">${r.TIPONEGOCIO} ${r.NEGOCIO}</div>
                        <div class="despacho-doc-card__client negrita text-info">${r.CLIENTE}</div>
                        <div class="despacho-doc-card__addr small">${F.limpiarTexto(r.DIRECCION)}, ${r.MUNICIPIO}</div>
                        <div class="despacho-doc-card__meta">
                            <span class="despacho-doc-card__doc">Doc: ${r.CODDOC}-${r.CORRELATIVO}</span>
                            <span class="despacho-doc-card__seller text-danger negrita">${r.VENDEDOR.toUpperCase()}</span>
                        </div>
                        <div class="despacho-doc-actions despacho-doc-actions--triple">
                            <button type="button" class="despacho-action-btn despacho-action-btn--base hand"
                            onclick="get_detalle_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.TIPONEGOCIO}','${r.NEGOCIO}','${r.CLIENTE}','FAC')">
                                <i class="fal fa-list"></i><span>Detalle</span>
                            </button>
                            <button type="button" class="${strBtnDevuelto} despacho-action-btn despacho-action-btn--primary hand"
                            onclick="get_devolucion_factura('${codembarque}','${r.CODDOC}','${r.CORRELATIVO}','${r.CODVEN}','${r.CODCLIENTE}','${r.NIT}','${r.TIPONEGOCIO}','${r.NEGOCIO}','${r.CLIENTE}','${F.limpiarTexto(r.DIRECCION)}','${r.FECHA.replace('T00:00:00.000Z','')}')">
                                <i class="fal fa-download"></i><span>Devolución</span>
                            </button>
                            <button type="button" class="despacho-action-btn ${concreBtnClass} hand" id="btnConCre${r.CODDOC}-${r.CORRELATIVO}"
                            onclick="despacho_toggle_concre_factura('${r.CODDOC}','${r.CORRELATIVO}','${concreVal}','btnConCre${r.CODDOC}-${r.CORRELATIVO}')">
                                <i class="fal fa-money-bill-wave"></i><span>${concreLabel}</span>
                            </button>
                        </div>
                    </div>
                </td>
                <td class="despacho-doc-amount">
                    <div class="despacho-doc-amount__value negrita">${F.setMoneda(r.IMPORTE,'Q')}</div>
                    <button type="button" class="despacho-doc-map-btn hand" title="Abrir en mapa"
                    onclick="F.gotoGoogleMaps('${r.LAT}','${r.LONG}')">
                        <i class="fal fa-map-marker"></i>
                    </button>
                    <div class="despacho-doc-amount__dev small text-danger negrita">Dev: ${F.setMoneda(r.DEVUELTO,'Q')}</div>
                </td>
            </tr>`;
}

function despacho_aplicar_filtros_facturas() {
    const table = document.getElementById('tblDocumentos');
    const lbTotal = document.getElementById('lbTotalEmbarque');
    if (!table || !lbTotal) return;

    const filtroConcre = document.getElementById('cmbFiltroConcreFac')?.value || 'TODAS';
    const texto = (document.getElementById('txtBuscarDocumento')?.value || '').toLowerCase();
    let total = 0;

    for (let i = 1; i < table.rows.length; i++) {
        const tr = table.rows[i];
        const concre = tr.getAttribute('data-concre') || 'CON';
        const matchConcre = filtroConcre === 'TODAS' || concre === filtroConcre;

        const cells = tr.getElementsByTagName('td');
        let matchText = texto.length === 0;
        if (!matchText) {
            for (let j = 0; j < cells.length && !matchText; j++) {
                if (cells[j].innerHTML.toLowerCase().indexOf(texto) > -1) {
                    matchText = true;
                }
            }
        }

        const visible = matchConcre && matchText;
        tr.style.display = visible ? '' : 'none';
        if (visible) {
            total += Number(tr.getAttribute('data-importe') || 0);
        }
    }

    lbTotal.innerText = `Total: ${F.setMoneda(total,'Q')}`;
}

function despacho_render_facturas_embarque(codembarque, records) {
    const container = document.getElementById('tblDataDocumentos');
    if (!container) return;

    let str = '';
    records.forEach((r) => {
        str += despacho_build_factura_row(r, codembarque);
    });

    container.innerHTML = str || '<tr><td colspan="2" class="text-center text-muted py-3">No hay datos...</td></tr>';
    despacho_aplicar_filtros_facturas();
}

function despacho_update_concre_fila(coddoc, correlativo, nuevoConcre) {
    const doc = despacho_facturas_docs.find((d) =>
        d.CODDOC === coddoc && String(d.CORRELATIVO) === String(correlativo)
    );
    if (doc) doc.CONCRE = nuevoConcre;

    const btn = document.getElementById(`btnConCre${coddoc}-${correlativo}`);
    const tr = btn ? btn.closest('tr') : null;

    if (btn) {
        btn.disabled = false;
        btn.className = `despacho-action-btn ${despacho_concre_btn_class(nuevoConcre)} hand`;
        const span = btn.querySelector('span');
        if (span) span.textContent = despacho_label_concre(nuevoConcre);
        btn.setAttribute('onclick', `despacho_toggle_concre_factura('${coddoc}','${correlativo}','${nuevoConcre}','btnConCre${coddoc}-${correlativo}')`);
    }
    if (tr) tr.setAttribute('data-concre', nuevoConcre);

    despacho_aplicar_filtros_facturas();
}

function get_tbl_documentos_embarque(codembarque){

    let container = document.getElementById('tblDataDocumentos');
    container.innerHTML = GlobalLoader;

    let codemp = document.getElementById('cmbEmpleadosFac').value;

    let empleados = [];


    get_data_documentos_embarque(codembarque,codemp)
    .then((data)=>{
        despacho_facturas_docs = data.recordset || [];
        empleados = despacho_facturas_docs.map((r) => ({ codemp: r.CODVEN, nombre: r.VENDEDOR }));

        despacho_render_facturas_embarque(codembarque, despacho_facturas_docs);

        //OBTENER LA LISTA UNICA DE EMPLEADOS DEL PICKING
        let strComboEmpleados = `<option value='TODOS'>TODOS</option>`;
        
        let empleados_lista = [];
        empleados_lista = obtener_lista_no_duplicada(empleados);

        empleados_lista.map((r)=>{
            strComboEmpleados += `<option value='${r.codemp}'>${r.nombre}</option>`
        });
        document.getElementById('cmbEmpleadosFac').innerHTML = strComboEmpleados;
        document.getElementById('cmbEmpleadosFac').value = codemp;
       
        
                
    })
    .catch(()=>{
        despacho_facturas_docs = [];
        container.innerHTML = 'No hay datos...';
        document.getElementById('lbTotalEmbarque').innerText = '';
    })
};

function despacho_toggle_concre_factura(coddoc, correlativo, concreActual, idbtn) {
    const nuevoConcre = (concreActual === 'CRE') ? 'CON' : 'CRE';
    const labelActual = despacho_label_concre(concreActual);
    const labelNuevo = despacho_label_concre(nuevoConcre);
    const btn = document.getElementById(idbtn);

    if (btn) btn.disabled = true;

    if (nuevoConcre === 'CRE') {
        despacho_abrir_modal_credito(coddoc, correlativo, idbtn);
        return;
    }

    F.Confirmacion(`¿Está seguro que desea cambiar de ${labelActual} a ${labelNuevo} en ${coddoc}-${correlativo}?`)
        .then((value) => {
            if (value !== true) {
                if (btn) btn.disabled = false;
                return;
            }

            F.showToast(`Cambiando de ${labelActual} a ${labelNuevo}...`);

            GF.documento_update_concre(GlobalEmpnit, coddoc, correlativo, nuevoConcre)
                .then(() => {
                    F.Aviso('Forma de pago actualizada');
                    despacho_update_concre_fila(coddoc, correlativo, nuevoConcre);
                })
                .catch(() => {
                    if (btn) btn.disabled = false;
                    F.AvisoError('No se pudo actualizar la forma de pago');
                });
        });
}

function obtener_lista_no_duplicada(json_original){

        let personasNoDuplicadas = [];

        // Vamos iterando por las personas
        json_original.forEach(p => {
            if(personasNoDuplicadas.findIndex(pd => pd.codemp === p.codemp) === -1) {
                // No existe; al detectar que no existe el mismo nombre, "la copiamos"
                personasNoDuplicadas.push(p);
            }
        });

        return personasNoDuplicadas;

};


//DEVOLUCIONES
function get_data_documentos_embarque_devoluciones(codembarque){

    return new Promise((resolve,reject)=>{
        
        axios.post('/repartidor/embarque_documentos_devoluciones',{
            sucursal:GlobalEmpnit,
            codembarque:codembarque
         })
         .then((response) => {
             let data = response.data;
             /*
             if(Number(data.rowsAffected[0])>0){
                 resolve(data);             
             }else{
                 reject();
             } */            
             if(response=='error'){reject()}else{resolve(data)}
         }, (error) => {
            console.log('error en solicitud')
            console.log(error);
             reject();
         });


    })

};
function get_tbl_documentos_embarque_devoluciones(codembarque){

    let container = document.getElementById('tblDataDocumentosDev');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;

    get_data_documentos_embarque_devoluciones(codembarque)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            varTotal+= Number(r.IMPORTE);
            let idbtnEliminar = `btnEliminar${r.CODDOC}-${r.CORRELATIVO}`;
            str += `
            <tr class="despacho-doc-row">
                <td class="despacho-doc-cell">
                    <div class="despacho-doc-card">
                        <div class="despacho-doc-card__tags">${r.TIPONEGOCIO} ${r.NEGOCIO}</div>
                        <div class="despacho-doc-card__client negrita text-info">${r.CLIENTE}</div>
                        <div class="despacho-doc-card__addr small">${F.limpiarTexto(r.DIRECCION)}, ${r.MUNICIPIO}</div>
                        <div class="despacho-doc-card__meta">
                            <span class="despacho-doc-card__doc">Doc: ${r.CODDOC}-${r.CORRELATIVO}</span>
                            <span class="despacho-doc-card__seller text-danger negrita">${r.VENDEDOR.toUpperCase()}</span>
                        </div>
                        <div class="despacho-doc-actions">
                            <button type="button" class="despacho-action-btn despacho-action-btn--base hand"
                            onclick="get_detalle_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.TIPONEGOCIO}','${r.NEGOCIO}','${r.CLIENTE}','DEV')">
                                <i class="fal fa-list"></i><span>Detalle</span>
                            </button>
                            <button type="button" class="despacho-action-btn despacho-action-btn--danger hand"
                            id="${idbtnEliminar}"
                            onclick="eliminar_devolucion('${r.CODDOC}','${r.CORRELATIVO}','${idbtnEliminar}')">
                                <i class="fal fa-trash"></i><span>Eliminar</span>
                            </button>
                        </div>
                    </div>
                </td>
                <td class="despacho-doc-amount">
                    <div class="despacho-doc-amount__value negrita">${F.setMoneda(r.IMPORTE,'Q')}</div>
                </td>
            </tr>`;
        })
        container.innerHTML = str;
        document.getElementById('lbTotalEmbarqueDev').innerText = `Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch(()=>{
        container.innerHTML = 'No hay datos...';
        document.getElementById('lbTotalEmbarqueDev').innerText = '';
    })
};
function get_data_documentos_embarque_devoluciones_resumen(codembarque){

    return new Promise((resolve,reject)=>{
        
        axios.post('/repartidor/embarque_documentos_devoluciones_resumen',{
            sucursal:GlobalEmpnit,
            codembarque:codembarque
         })
         .then((response) => {
             let data = response.data;
             /*
             if(Number(data.rowsAffected[0])>0){
                 resolve(data);             
             }else{
                 reject();
             } */            
             if(response=='error'){reject()}else{resolve(data)}
         }, (error) => {
            console.log('error en solicitud')
            console.log(error);
             reject();
         });


    })

};
function get_tbl_documentos_embarque_devoluciones_resumen(codembarque){

    let container = document.getElementById('tblDataResumenDevoluciones');
    container.innerHTML = GlobalLoader;

   

    get_data_documentos_embarque_devoluciones_resumen(codembarque)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `
            <tr>
                <td>${r.EMPLEADO}</td>
                <td>${r.CONTEO}</td>
                <td>${F.setMoneda(r.IMPORTE,'Q')}</td>
            </tr>
            `
        })
        container.innerHTML = str;
    
    })
    .catch(()=>{
        container.innerHTML = 'No hay datos...';
    })
};


function eliminar_devolucion(coddoc,correlativo,idbtn){

    let btn = document.getElementById(idbtn);

    F.Confirmacion('¿Está seguro que desea ELIMINAR esta Devolución?')
    .then((value)=>{
        if(value==true){

            btn.disabled = true;
            F.showToast('Eliminado documento...');

            GF.get_data_eliminar_documento(GlobalEmpnit,coddoc,correlativo)
            .then(()=>{
                
                btn.disabled = false;
                F.showToast('Documento eliminado exitosamente!!');
                get_tbl_documentos_embarque_devoluciones(selected_codembarque);
                
            })
            .catch(()=>{
                btn.disabled = false;
                F.AvisoError('No se pudo Eliminar');
            })


        }
    })

};

function get_detalle_factura(coddoc,correlativo,tiponegocio,negocio,cliente,fac_dev){

    if(fac_dev=='FAC'){
        despacho_showPanel('tres', { subtitle: coddoc + '-' + correlativo, backTo: 'dos' });
    }else{
        despacho_showPanel('tres', { subtitle: coddoc + '-' + correlativo, backTo: 'seis' });
    }


    let container = document.getElementById('tblDataDetalle');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;

    GF.get_data_detalle_documento(GlobalEmpnit,coddoc,correlativo)
    .then((data)=>{
        let str = "";

        data.recordset.map((r)=>{
            varTotal += Number(r.TOTALPRECIO);
            str += `
            <tr>
                <td>${r.DESPROD}
                    <br>
                    <small class="negrita text-danger">${r.CODPROD}</small>
                </td>
                <td>${r.CODMEDIDA}</td>
                <td>${r.CANTIDAD}</td>
                <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbDetalleTotal').innerHTML = F.setMoneda(varTotal,'Q');

    })
    .catch(()=>{
        container.innerHTML = 'No hay datos...';
        document.getElementById('lbDetalleTotal').innerHTML = '';

    })



};


//----------------------------------
//boton productos devueltos
//----------------------------------
function get_data_embarque_devoluciones_productos(codembarque){

    despacho_showPanel('siete', { subtitle: 'Embarque: ' + codembarque, backTo: 'uno' });

    document.getElementById('lbEmbarqueDeProd').innerText = codembarque;
    selected_codembarque = codembarque;

    get_tbl_productos_embarque_devueltos(codembarque);

};
function get_tbl_productos_embarque_devueltos(codembarque){

    let container = document.getElementById('tblDataDocumentosDevProd');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

    GF.get_data_embarque_productos_devueltos(GlobalEmpnit,codembarque)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
         
            contador +=1;
            varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td>${r.DESPROD}
                        <br>
                        <small class="text-danger negrita">${r.CODPROD}</small>
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
        document.getElementById('lbTotalDevProd').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbTotalDevProd').innerText = '';
    })

};

//----------------------------------
// reporte Picking (misma data que digitador / compras)
//----------------------------------
function get_reporte_productos_embarque(codembarque){

    despacho_showPanel('ocho', { subtitle: 'Embarque: ' + codembarque, backTo: 'uno' });

    document.getElementById('lbEmbarqueProd').innerText = codembarque;
    selected_codembarque = codembarque;

    get_tbl_productos_embarque_reporte(codembarque);
    get_tbl_resumen_vendedor_embarque(codembarque);

}

function get_tbl_productos_embarque_reporte(codembarque){

    let container = document.getElementById('tblDataEmbarqueProductos');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

    GF.get_data_embarque_productos(GlobalEmpnit, codembarque)
    .then((data)=>{
        let str = '';
        (data.recordset || []).map((r)=>{
            contador += 1;
            varTotal += Number(r.IMPORTE) || 0;
            str += `
                <tr class="despacho-emb-prod-row">
                    <td class="despacho-emb-prod__product">
                        <div class="despacho-emb-prod__name">${r.DESPROD}</div>
                        <div class="despacho-emb-prod__code">${r.CODPROD}</div>
                    </td>
                    <td class="text-center despacho-emb-prod__num">${r.UXC}</td>
                    <td class="text-center despacho-emb-prod__num">${r.CAJAS}</td>
                    <td class="text-center despacho-emb-prod__num">${r.UNIDADES}</td>
                    <td class="text-center despacho-emb-prod__num">${Number(r.BONI || 0)}</td>
                    <td class="text-right despacho-emb-prod__importe negrita">${F.setMoneda(r.IMPORTE, 'Q')}</td>
                </tr>`;
        });
        container.innerHTML = str || '<tr><td colspan="6" class="text-center text-muted py-3">Sin productos en el embarque</td></tr>';
        document.getElementById('lbEmbProdItems').innerText = 'Items: ' + contador;
        document.getElementById('lbEmbProdTotal').innerText = 'Total: ' + F.setMoneda(varTotal, 'Q');
    })
    .catch(()=>{
        container.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">No se cargaron datos</td></tr>';
        document.getElementById('lbEmbProdItems').innerText = '';
        document.getElementById('lbEmbProdTotal').innerText = '';
    });

}

function get_tbl_resumen_vendedor_embarque(codembarque){

    let container = document.getElementById('tblDataEmbarqueResumenVendedor');
    container.innerHTML = GlobalLoader;

    GF.get_data_embarque_resumen_vendedores(GlobalEmpnit, codembarque)
    .then((data)=>{
        let str = '';
        (data.recordset || []).map((r)=>{
            str += `
                <tr>
                    <td>${r.EMPLEADO || ''}</td>
                    <td class="text-center">${r.CONTEO || 0}</td>
                    <td class="text-right negrita">${F.setMoneda(r.IMPORTE, 'Q')}</td>
                </tr>`;
        });
        container.innerHTML = str || '<tr><td colspan="3" class="text-center text-muted py-3">Sin datos de vendedores</td></tr>';
    })
    .catch(()=>{
        container.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-3">No se cargó el resumen</td></tr>';
    });

}

function get_mapa_embarque(codembarque){

    despacho_showPanel('cuatro', { subtitle: 'Embarque: ' + codembarque, backTo: 'uno' });

    document.getElementById('lbEmbarqueMapa').innerText = 'Embarque: ' + codembarque;
    selected_codembarque = codembarque;

    cargarMapaClientes(codembarque);

}

function despacho_teardownMap() {
    if (despacho_mapInstance) {
        try {
            despacho_mapInstance.remove();
        } catch (e) { /* mapa ya destruido */ }
        despacho_mapInstance = null;
    }
    if (typeof map !== 'undefined') {
        map = null;
    }
}

function despacho_parseCoord(value) {
    const n = Number(value);
    if (!Number.isFinite(n) || n === 0) {
        return null;
    }
    return n;
}

function despacho_mapPopupHtml(row) {
    const cliente = F.limpiarTexto(row.CLIENTE || '');
    const doc = `${row.CODDOC || ''}-${row.CORRELATIVO || ''}`;
    const total = F.setMoneda(row.IMPORTE, 'Q');
    return `<div class="despacho-map-popup">
        <div class="despacho-map-popup__client negrita">${cliente}</div>
        <div class="despacho-map-popup__doc">${doc}</div>
        <div class="despacho-map-popup__total negrita text-danger">${total}</div>
    </div>`;
}

function despacho_initLeafletMap(containerId, centerLat, centerLng, zoom) {
    despacho_teardownMap();
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileLayer = L.tileLayer(osmUrl, { maxZoom: 20, attribution: osmAttrib });
    despacho_mapInstance = L.map(containerId).setView([centerLat, centerLng], zoom);
    map = despacho_mapInstance;
    tileLayer.addTo(despacho_mapInstance);
    return despacho_mapInstance;
}

function cargarMapaClientes(codembarque) {

    const container = document.getElementById('container_mapa');
    if (!container) {
        return;
    }
    container.innerHTML = GlobalLoader;

    get_data_documentos_embarque(codembarque, 'TODOS')
    .then((data) => {
        container.innerHTML = '<div class="mapcontainer5 despacho-map-canvas" id="mapcontainer"></div>';

        const rows = data.recordset || [];
        const points = [];

        rows.forEach((row) => {
            const lat = despacho_parseCoord(row.LAT);
            const lng = despacho_parseCoord(row.LONG);
            if (lat != null && lng != null) {
                points.push({ lat, lng, row });
            }
        });

        let centerLat = 14.6349;
        let centerLng = -90.5069;
        let zoom = 11;
        if (points.length === 1) {
            centerLat = points[0].lat;
            centerLng = points[0].lng;
            zoom = 14;
        } else if (points.length > 1) {
            centerLat = points[0].lat;
            centerLng = points[0].lng;
        }

        const mapInstance = despacho_initLeafletMap('mapcontainer', centerLat, centerLng, zoom);
        const bounds = L.latLngBounds([]);
        const clientIcon = (typeof blueIcon !== 'undefined') ? blueIcon : null;

        points.forEach(({ lat, lng, row }) => {
            const markerOpts = clientIcon ? { icon: clientIcon } : {};
            L.marker([lat, lng], markerOpts)
                .addTo(mapInstance)
                .bindPopup(despacho_mapPopupHtml(row), { closeOnClick: true, autoClose: true });
            bounds.extend([lat, lng]);
        });

        const fitClientBounds = () => {
            if (points.length) {
                mapInstance.fitBounds(bounds.pad(0.15));
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((location) => {
                const uLat = location.coords.latitude;
                const uLng = location.coords.longitude;
                const userMarkerIcon = (typeof userIcon !== 'undefined') ? userIcon : null;
                const uOpts = userMarkerIcon ? { icon: userMarkerIcon } : {};
                L.marker([uLat, uLng], uOpts)
                    .addTo(mapInstance)
                    .bindPopup('Mi ubicación', { closeOnClick: true, autoClose: false });
                bounds.extend([uLat, uLng]);
                if (points.length) {
                    mapInstance.fitBounds(bounds.pad(0.12));
                } else {
                    mapInstance.setView([uLat, uLng], 13);
                }
            }, fitClientBounds, { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 });
        } else {
            fitClientBounds();
        }

        if (!points.length) {
            container.insertAdjacentHTML(
                'beforeend',
                '<div class="despacho-map-empty alert alert-warning m-2 mb-0 small text-center">No hay clientes con ubicación GPS en este embarque.</div>'
            );
        }

        setTimeout(() => {
            try {
                mapInstance.invalidateSize();
            } catch (e) { /* sin mapa */ }
        }, 450);
    })
    .catch(() => {
        container.innerHTML = '<div class="text-center text-muted py-4 small">No se pudo cargar el mapa del embarque.</div>';
        F.AvisoError('Error al cargar ubicaciones del embarque');
    });

}



function get_devolucion_factura(codembarque,coddoc,correlativo,codven,codclie,nitclie,tiponegocio,negocio,cliente,dirclie,fecha){

    despacho_showPanel('cinco', { subtitle: 'Devolución ' + coddoc + '-' + correlativo, backTo: 'dos' });

    document.getElementById('txtCodembarque').value = codembarque;
    document.getElementById('cmbCoddocFac').value = coddoc;
    document.getElementById('cmbCorrelativoFac').value = correlativo;

    
    document.getElementById('txtCodclie').value = codclie;
    document.getElementById('txtNit').value = nitclie;
    document.getElementById('lbNomclie').innerText = cliente;
    document.getElementById('lbDirclie').innerText = dirclie;
    document.getElementById('lbNegocio').innerText = `${tiponegocio} ${negocio}`;
       
    document.getElementById('cmbEmpleados').value = codven;

    document.getElementById('txtFecha').value = fecha;



    load_grid_productos(GlobalEmpnit,coddoc,correlativo)


};

function load_grid_productos(sucursal,codoc,correlativo){


    F.showToast('Eliminando datos anteriores');

    db_devoluciones.deleteTempVenta_pos()
    .then(()=>{

        GF.get_data_detalle_documento(sucursal,codoc,correlativo)
        .then((data)=>{
            
            F.showToast('Cargando datos...')

            data.recordset.map((r)=>{

                    let datos = 
                    {
                        CODSUCURSAL: sucursal.toString(),
                        EMPNIT: sucursal.toString(),
                        USUARIO:'',
                        CODPROD: r.CODPROD.toString(),
                        DESPROD: r.DESPROD.toString(),
                        CODMEDIDA: r.CODMEDIDA.toString(),
                        EQUIVALE: Number(r.EQUIVALE),
                        COSTO: Number(r.COSTO),
                        TOTALCOSTO: Number(r.TOTALCOSTO),
                        PRECIO: Number(r.PRECIO),
                        CANTIDAD: Number(r.CANTIDAD),
                        TOTALUNIDADES: Number(r.TOTALUNIDADES),
                        TOTALPRECIO: Number(r.TOTALPRECIO),
                        EXENTO: Number(0),
                        TIPOPROD: r.TIPOPROD,
                        TIPOPRECIO: r.TIPOPRECIO,
                        EXISTENCIA: Number(r.EXISTENCIA),
                        BONO: Number(0),
                        DESCUENTO: Number(r.DESCUENTO),
                        CANTIDADORIGINAL: Number(r.CANTIDAD)
                    };


                    db_devoluciones.insertTempVentasPOS(datos);

            })

            get_grid_productos();

        })
        .catch(()=>{
            F.AvisoError('No se cargaron datos');
        })


    })

        


};

function get_grid_productos(){


    let container = document.getElementById('tblDataProductos');
    container.innerHTML = GlobalLoader;

    document.getElementById('lbTotal').innerText = '---';
    let varTotal = 0;
    let varTotalCosto = 0;

    db_devoluciones.selectTempVentasPOS()
    .then((datos)=>{

        let str = '';
        datos.map((r)=>{

            varTotal += Number(r.TOTALPRECIO);
            varTotalCosto += Number(r.TOTALCOSTO);
            str += `
            <tr>
                <td>${r.DESPROD}
                    <br>
                    <small class="negrita text-danger">${r.CODPROD}</small>
                </td>
                <td>${r.CODMEDIDA}</td>
                <td>${r.CANTIDAD}</td>
                <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td>
                    <button class="btn btn-info btn-md btn-circle hand shadow"
                    onclick="edit_item('${r.ID}','${r.CODPROD}','${r.DESPROD}','${r.CODMEDIDA}','${r.EQUIVALE}','${r.CANTIDAD}','${r.COSTO}','${r.PRECIO}','${r.TIPOPROD}','${r.EXENTO}','${r.EXISTENCIA}','${r.BONO}','${r.DESCUENTO}','${r.CANTIDADORIGINAL}')">
                        <i class="fal fa-edit"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-danger btn-md btn-circle hand shadow"
                    onclick="delete_item('${r.ID}')">
                        <i class="fal fa-trash"></i>
                    </button>
                </td>
                <td class="text-center negrita text-success">${r.CANTIDADORIGINAL}</td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotal').innerText = F.setMoneda(varTotal,'Q');
        global_var_total_costo = Number(varTotalCosto);
        global_var_total_precio = Number(varTotal);
    })

};
function delete_item(id){

    F.Confirmacion('¿Está seguro que desea Quitar este item?')
    .then((value)=>{
        if(value==true){

            db_devoluciones.deleteItemVentaPOS(id)
            .then(()=>{
                get_grid_productos();
            })

        }
    })

};
function edit_item(id,codprod,desprod,codmedida,equivale,cantidad,costo,precio,tipoprod,exento,existencia,bono,descuento,cantidadoriginal){

    $("#modal_editar_cantidad").modal('show');

    Selected_id = id;
    Selected_codprod = codprod;
    Selected_desprod = desprod;
    Selected_codmedida = codmedida;
    Selected_equivale = Number(equivale);
    Selected_costo = Number(costo);
    Selected_precio = Number(precio);
    Selected_tipoprod = tipoprod;
    Selected_exento = Number(exento);
    Selected_existencia = Number(existencia);
    Selected_bono = Number(bono);
    Selected_cantidad_original = Number(cantidadoriginal);

    document.getElementById('lbCantidadDesprodE').innerText = `${desprod} (${codmedida} - Eq: ${equivale})`;

    document.getElementById('txtMCCantidadE').value = cantidad;
    document.getElementById('txtMCPrecioE').value = precio;
    document.getElementById('txtMCDescuentoE').value = descuento;

    CalcularTotalPrecioEditar();

    document.getElementById('txtMCCantidadE').focus();
};
function CalcularTotalPrecioEditar(){

    let cantidad = document.getElementById('txtMCCantidadE').value || 1;
    let precio = document.getElementById('txtMCPrecioE').value;
    
    document.getElementById('txtMCTotalPrecioE').value = (Number(cantidad)*Number(precio));

};


function insert_documento(){


        let sucursal = GlobalEmpnit; //document.getElementById('cmbSucursal').value;
        let coddoc = document.getElementById('cmbCoddoc').value;
        let correlativo = document.getElementById('txtCorrelativo').value;
        let codemp = document.getElementById('cmbEmpleados').value;
        let caja = document.getElementById('cmbCaja').value;


        let codembarque = document.getElementById('txtCodembarque').value;
    
        let codclie = document.getElementById('txtCodclie').value || '';
        let nomclie = document.getElementById('lbNomclie').innerText;
        let nit = document.getElementById('txtNit').value;
        let dirclie = document.getElementById('lbDirclie').innerText;
        let obs = document.getElementById('cmbObs').value;


        let coddoc_origen = document.getElementById('cmbCoddocFac').value || '';
        let correlativo_origen = document.getElementById('cmbCorrelativoFac').value;

    
        let anio = 0;
        let mes = 0;
        let fecha = F.devuelveFecha('txtFecha');
        let hora = F.getHora();

        return new Promise((resolve, reject)=>{


                db_devoluciones.gettempDocproductos_pos(GlobalUsuario)
                .then((response)=>{
              
                        axios.post('/documentos/insert_devolucion', {
                                jsondocproductos:JSON.stringify(response),
                                sucursal:sucursal,
                                codembarque:codembarque,
                                coddoc:coddoc,
                                correlativo: correlativo,
                                serie_fac:coddoc,
                                numero_fac:correlativo,
                                coddoc_origen:coddoc_origen,
                                correlativo_origen:correlativo_origen,
                                anio:anio,
                                mes:mes,
                                fecha:fecha,
                                fechaentrega:fecha,
                                formaentrega:'',
                                codbodega:'0',
                                codcaja:caja,
                                codcliente: codclie, 
                                nomclie:nomclie,
                                totalcosto:global_var_total_costo,
                                totalprecio:global_var_total_precio,
                                totaldescuento:0,
                                nitclie:nit,
                                dirclie:dirclie,
                                obs:F.limpiarTexto(obs),
                                direntrega:'',
                                usuario:GlobalUsuario,
                                codven:codemp,
                                lat:'0',
                                long:'0',
                                hora:hora,
                                tipo_pago:'CON',
                                tipo_doc:'DEV',
                                entrega_contacto:'',
                                entrega_telefono:'',
                                entrega_direccion:'',
                                entrega_referencia:'',
                                entrega_lat:'0',
                                entrega_long:'0',
                                iva:GlobalConfigIVA,
                                etiqueta:'BAJA'
                        })
                        .then((response) => {

                                if(response.status.toString()=='200'){
                                    let data = response.data;
                                    if(data.toString()=="error"){
                                        reject('error');
                                    }else{
                                    
                                        if(data.rowsAffected[0].toString()=='0'){
                                            reject('sin filas');           
                                        }else{
                                            resolve();  
                                        } 
                                    }       
                                }else{
                                    reject('error');
                                }          
                                
                        }, (error) => {
                            reject(error);
                        });  
                })
            
        })

        




};
function clean_data(){


        let sucursal = GlobalEmpnit; //document.getElementById('cmbSucursal').value;
        
        GF.get_data_coddoc_correlativo_sucursal(sucursal,document.getElementById('cmbCoddoc').value)
        .then((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
        .catch((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})


        db_devoluciones.deleteTempVenta_pos()
        .then(()=>{
            get_grid_productos();
        })

        document.getElementById('txtCodembarque').value='';
    
        document.getElementById('txtCodclie').value='';
        document.getElementById('lbNomclie').innerText='';
        document.getElementById('lbNegocio').innerText = '';
        document.getElementById('txtNit').value='';
        document.getElementById('lbDirclie').innerText='';
        
        document.getElementById('cmbCoddocFac').value='';
        document.getElementById('cmbCorrelativoFac').value='';



};

(function () {
    window.__spaViewHooks = window.__spaViewHooks || {};
    window.__spaViewHooks['inicio/despacho'] = {
        initView: initView,
        destroyView: destroyView
    };
})();