'use strict';

var compras2_listaCache = [];

function compras2_tpl_modals() {
    const sm = GlobalSignoMoneda || 'Q';
    return `
    <div class="modal fade sygma-doc-detalle-modal sygma-embarque-select-modal compras2-modal-productos" id="modal_lista_precios" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable" role="document">
            <div class="modal-content sygma-doc-detalle-modal__content">
                <div class="sygma-doc-detalle-modal__header sygma-embarque-select-modal__header">
                    <div class="sygma-doc-detalle-modal__header-top mb-0">
                        <div>
                            <h4 class="sygma-doc-detalle-modal__title">Buscar producto</h4>
                            <p class="sygma-doc-detalle-modal__doc-ref mb-0">Seleccione un producto para agregar a la compra</p>
                        </div>
                        <button type="button" class="sygma-doc-detalle-modal__close" data-dismiss="modal" aria-label="Cerrar">
                            <i class="fal fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="modal-body sygma-embarque-select-modal__body">
                    <div class="sygma-embarque-rpt__toolbar">
                        <input type="text" autocomplete="off" class="form-control sygma-embarque-rpt__search" placeholder="Buscar por código, nombre o marca..." id="txtBuscarProd" oninput="F.crearBusquedaTabla('tblProductos','txtBuscarProd')">
                    </div>
                    <div class="table-responsive sygma-embarque-rpt__table-wrap sygma-embarque-select-modal__table-wrap">
                        <table class="table sygma-embarque-rpt__table mb-0" id="tblProductos">
                            <thead>
                                <tr>
                                    <th>CÓDIGO</th>
                                    <th>PRODUCTO</th>
                                    <th>MEDIDA</th>
                                    <th class="text-right">COSTO</th>
                                    <th class="text-right">EXIST.</th>
                                    <th>TIPO</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataProductos"></tbody>
                        </table>
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
    <div class="modal fade sygma-doc-detalle-modal compras2-modal-cantidad pos2-modal-cantidad" id="modal_cantidad" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content sygma-doc-detalle-modal__content">
                <div class="sygma-doc-detalle-modal__header compras2-modal-cantidad__header">
                    <div class="sygma-doc-detalle-modal__header-top mb-0">
                        <h4 class="sygma-doc-detalle-modal__title mb-0">Agregar producto</h4>
                        <button type="button" class="sygma-doc-detalle-modal__close" data-dismiss="modal" aria-label="Cerrar">
                            <i class="fal fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="modal-body compras2-modal-cantidad__body">
                    <p class="compras2-modal-cantidad__prod mb-0" id="lbCantidadDesprod">Producto</p>
                    <div class="pos2-modal-cantidad__fields mt-2">
                        <div id="container_precio" class="pos2-modal-producto pos2-modal-cantidad__medida"></div>
                        <div class="form-group mb-0 pos2-modal-cantidad__cant">
                            <label class="negrita text-secondary">Cantidad</label>
                            <input type="number" min="0" step="any" class="form-control negrita text-info border-base" id="txtMCCantidad">
                        </div>
                        <div class="form-group mb-0 pos2-modal-cantidad__precio">
                            <label class="negrita text-secondary">Costo ${sm}</label>
                            <input type="number" min="0" step="any" class="form-control negrita text-info border-base" id="txtMCPrecio">
                        </div>
                        <div class="form-group mb-0 pos2-modal-cantidad__subtotal">
                            <label class="negrita text-secondary">Subtotal ${sm}</label>
                            <input type="number" class="form-control negrita text-danger border-base" id="txtMCTotalPrecio" disabled>
                        </div>
                    </div>
                </div>
                <div class="modal-footer sygma-doc-detalle-modal__footer compras2-modal-cantidad__footer">
                    <button type="button" class="btn btn-secondary btn-sm sygma-doc-detalle-modal__btn-close" data-dismiss="modal">
                        <i class="fal fa-times mr-1"></i> Cancelar
                    </button>
                    <button type="button" class="btn btn-base btn-sm hand" id="btnMCGuardar">
                        <i class="fal fa-check mr-1"></i> Agregar
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade sygma-doc-detalle-modal compras2-modal-cantidad pos2-modal-cantidad" id="modal_editar_cantidad" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content sygma-doc-detalle-modal__content">
                <div class="sygma-doc-detalle-modal__header compras2-modal-cantidad__header">
                    <div class="sygma-doc-detalle-modal__header-top mb-0">
                        <h4 class="sygma-doc-detalle-modal__title mb-0">Editar producto</h4>
                        <button type="button" class="sygma-doc-detalle-modal__close" data-dismiss="modal" aria-label="Cerrar">
                            <i class="fal fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="modal-body compras2-modal-cantidad__body">
                    <p class="compras2-modal-cantidad__prod mb-0" id="lbCantidadDesprodE">Producto</p>
                    <div class="pos2-modal-cantidad__fields mt-2">
                        <div id="container_precio_editar" class="pos2-modal-producto pos2-modal-cantidad__medida"></div>
                        <div class="form-group mb-0 pos2-modal-cantidad__cant">
                            <label class="negrita text-secondary">Cantidad</label>
                            <input type="number" min="0" step="any" class="form-control negrita border-base" id="txtMCCantidadE">
                        </div>
                        <div class="form-group mb-0 pos2-modal-cantidad__precio">
                            <label class="negrita text-secondary">Costo ${sm}</label>
                            <input type="number" min="0" step="any" class="form-control negrita border-base" id="txtMCPrecioE">
                        </div>
                        <div class="form-group mb-0 pos2-modal-cantidad__subtotal">
                            <label class="negrita text-secondary">Subtotal ${sm}</label>
                            <input type="number" class="form-control negrita border-base" id="txtMCTotalPrecioE" disabled>
                        </div>
                    </div>
                </div>
                <div class="modal-footer sygma-doc-detalle-modal__footer compras2-modal-cantidad__footer">
                    <button type="button" class="btn btn-secondary btn-sm sygma-doc-detalle-modal__btn-close" data-dismiss="modal">
                        <i class="fal fa-times mr-1"></i> Cancelar
                    </button>
                    <button type="button" class="btn btn-base btn-sm hand" id="btnMCGuardarE">
                        <i class="fal fa-check mr-1"></i> Guardar
                    </button>
                </div>
            </div>
        </div>
    </div>
    ${compras2_tpl_modals_extra()}`;
}

function compras2_tpl_modals_extra() {
    return `
    <div class="modal fade sygma-doc-detalle-modal sygma-embarque-finalizar-modal compras2-modal-finalizar" id="modal_compras2_finalizar" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content sygma-doc-detalle-modal__content">
                <div class="sygma-doc-detalle-modal__header sygma-embarque-finalizar-modal__header">
                    <div class="sygma-doc-detalle-modal__header-top mb-0">
                        <div>
                            <h4 class="sygma-doc-detalle-modal__title mb-0">Finalizar compra</h4>
                            <p class="sygma-doc-detalle-modal__doc-ref mb-0">Confirme la forma de pago del documento</p>
                        </div>
                        <button type="button" class="sygma-doc-detalle-modal__close" data-dismiss="modal" aria-label="Cerrar">
                            <i class="fal fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="modal-body sygma-embarque-finalizar-modal__body compras2-modal-finalizar__body">
                    <div class="sygma-embarque-finalizar-modal__row sygma-embarque-finalizar-modal__row--input">
                        <label class="sygma-embarque-finalizar-modal__label" for="cmbCompras2FinalizarPago">Forma de pago</label>
                        <select class="form-control form-control-sm negrita" id="cmbCompras2FinalizarPago">
                            <option value="CON">CONTADO</option>
                            <option value="CRE">CRÉDITO</option>
                        </select>
                    </div>
                    <div class="sygma-embarque-finalizar-modal__row sygma-embarque-finalizar-modal__row--fecha d-none" id="wrapCompras2FinalizarFechaPago">
                        <label class="sygma-embarque-finalizar-modal__label" for="txtCompras2FinalizarFechaPago">Fecha de pago</label>
                        <input type="date" class="form-control form-control-sm sygma-embarque-finalizar-modal__fecha" id="txtCompras2FinalizarFechaPago">
                    </div>
                    <p class="sygma-embarque-finalizar-modal__hint mb-0">Se actualizarán CONCRE y VENCIMIENTO en el documento.</p>
                </div>
                <div class="modal-footer sygma-doc-detalle-modal__footer sygma-embarque-finalizar-modal__footer">
                    <button type="button" class="btn btn-secondary btn-sm sygma-doc-detalle-modal__btn-close" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-success btn-sm sygma-embarque-finalizar-modal__btn-save hand" id="btnCompras2FinalizarConfirmar">
                        <i class="fal fa-check mr-1"></i> Finalizar
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade sygma-doc-detalle-modal compras2-modal-cargar-costos" id="modal_compras2_cargar_costos" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content sygma-doc-detalle-modal__content">
                <div class="sygma-doc-detalle-modal__header">
                    <div class="sygma-doc-detalle-modal__header-top mb-0">
                        <div>
                            <h4 class="sygma-doc-detalle-modal__title mb-0">Cargar costos al catálogo</h4>
                            <p class="sygma-doc-detalle-modal__doc-ref mb-0">Revise los costos antes de actualizar precios</p>
                        </div>
                        <button type="button" class="sygma-doc-detalle-modal__close" data-dismiss="modal" aria-label="Cerrar">
                            <i class="fal fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="modal-body compras2-modal-cargar-costos__body p-0">
                    <div class="compras2-modal-cargar-costos__table-wrap">
                        <table class="table mb-0 compras2-modal-cargar-costos__table" id="tblCompras2Costos">
                            <thead>
                                <tr>
                                    <th>CÓDIGO</th>
                                    <th>PRODUCTO</th>
                                    <th>MEDIDA</th>
                                    <th class="text-center">EQUIV</th>
                                    <th class="text-right">COSTO ACTUAL</th>
                                    <th class="text-right">COSTO NUEVO</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataCompras2Costos"></tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer sygma-doc-detalle-modal__footer compras2-modal-cargar-costos__footer">
                    <button type="button" class="btn btn-secondary btn-sm sygma-doc-detalle-modal__btn-close" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-base btn-sm hand" id="btnCompras2CostosCargar">
                        <i class="fal fa-sync mr-1"></i> Cargar
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}

function compras2_tpl_card_documento() {
    return `
    <div class="pos2-panel-card pos2-doc-compact compras2-card-documento-compact mb-2">
        <div class="pos2-panel-head"><span class="negrita mb-0"><i class="fal fa-file-invoice mr-1"></i> Documento</span></div>
        <div class="card-body">
            <div class="d-none"><select id="cmbTipoDocumento"><option value="COM" selected>COMPRAS IVA</option><option value="COP">COMPRA PEQUEÑO CONTRIBUYENTE</option></select></div>
            <div class="form-group mb-2"><label class="small text-secondary">Serie / correlativo</label><div class="input-group input-group-sm"><select class="form-control" id="cmbCoddoc"></select><input type="number" id="txtCorrelativo" class="form-control negrita" disabled value="0"></div></div>
            <div class="row mx-0">
                <div class="col-6 pl-0 pr-1 form-group mb-2"><label class="small text-secondary">Caja</label><select class="form-control form-control-sm" id="cmbCaja"></select></div>
                <div class="col-6 pr-0 pl-1 form-group mb-2"><label class="small text-secondary">Fecha</label><input type="date" id="txtFecha" class="form-control form-control-sm negrita border-base"></div>
            </div>
            <div class="row mx-0 d-none">
                <div class="col-6 pl-0 pr-1 form-group mb-2"><label class="small text-secondary">Forma de pago</label><select class="form-control form-control-sm negrita" id="cmbConCre"><option value="CON">CONTADO</option><option value="CRE">CREDITO</option></select></div>
                <div class="col-6 pr-0 pl-1 form-group mb-2"><label class="small text-secondary">Fecha pago</label><input type="date" class="form-control form-control-sm negrita" id="txtFechaPago"></div>
            </div>
            <div class="row mx-0">
                <div class="col-6 pl-0 pr-1 form-group mb-2"><label class="small text-secondary">Empleado</label><select class="form-control form-control-sm" id="cmbVendedor"></select></div>
                <div class="col-6 pr-0 pl-1 form-group mb-2"><label class="small text-secondary">Prioridad</label><select class="form-control form-control-sm negrita" id="cmbPrioridad"></select></div>
            </div>
            <div class="form-group mb-2"><label class="small text-secondary">Serie / número factura compra</label><div class="input-group input-group-sm"><input type="text" class="form-control negrita" id="txtSerieFac" placeholder="Serie"><input type="text" class="form-control negrita" id="txtNumeroFac" placeholder="Número"></div></div>
            <div class="form-group mb-2"><label class="small text-secondary">No. orden de compra</label><div class="input-group input-group-sm"><input type="text" class="form-control negrita" id="txtCoddocOrigen" placeholder="Serie"><input type="text" class="form-control negrita" id="txtCorrelativoOrigen" placeholder="Número"></div></div>
            <div class="form-group mb-0"><label class="small text-secondary">Observaciones</label><textarea class="form-control form-control-sm negrita" rows="2" id="txtObs"></textarea></div>
        </div>
    </div>
    <div class="pos2-sidebar-save">
        <div class="text-center mb-2">
            <div class="pos2-sidebar-total-label">Total compra</div>
            <div class="pos2-sidebar-total-value" id="lbPosCobroTotalPagar">Q 0.00</div>
        </div>
        <button type="button" class="btn btn-base btn-block pos2-btn-guardar shadow hand" id="btnGuardarFactura"><i class="fal fa-save mr-1"></i> Finalizar compra</button>
    </div>`;
}

function compras2_tpl_sidebar_datos() {
    return compras2_tpl_card_documento();
}

function compras2_tpl_ingreso() {
    return `
    <div id="compras2Ingreso" class="d-none">
        <div id="compras2IngresoLoader" class="compras2-ingreso-loader d-none" aria-live="polite" aria-busy="true" aria-hidden="true">
            <div class="compras2-ingreso-loader__panel" id="compras2IngresoLoaderInner"></div>
        </div>
        <input type="hidden" id="txtPosCobroNitclie">
        <input type="hidden" id="txtPosCobroNit">
        <input type="hidden" id="txtPosCobroNombre">
        <input type="hidden" id="txtPosCobroDireccion">
        <div class="px-2 pt-2 pb-1 compras2-ingreso-toolbar d-flex align-items-end flex-wrap">
            <button type="button" class="btn btn-outline-secondary btn-sm hand shadow-sm mb-2 mb-md-0" id="btnCompras2VolverListado">
                <i class="fal fa-arrow-left mr-1"></i> Volver al listado
            </button>
            <div class="compras2-proveedor-select-wrap ml-md-3 mb-2 mb-md-0 flex-grow-1">
                <label class="negrita small mb-1 d-block" for="cmbCompras2Proveedor">Proveedor</label>
                <select class="form-control form-control-sm negrita border-base" id="cmbCompras2Proveedor">
                    <option value="">-- seleccione un proveedor --</option>
                </select>
            </div>
            <span class="small negrita text-danger mb-2 mb-md-0 ml-md-auto" id="lbCompras2DocRef"></span>
        </div>
        <div class="row pos2-pedido-layout mx-0">
            <div class="col-lg-8 col-md-7 col-12 pos2-pedido-main">
                <div class="sygma-embarque-rpt card card-rounded shadow-sm border-0" id="rpt_compras2_detalle">
                    <div class="card-body sygma-embarque-rpt__body p-2">
                        <header class="sygma-embarque-rpt__header">
                            <div class="sygma-embarque-rpt__brand">
                                <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="40" height="40" alt="Logo">
                                <div class="sygma-embarque-rpt__brand-text">
                                    <h4 class="sygma-embarque-rpt__title mb-0">Detalle de compra</h4>
                                    <span class="sygma-embarque-rpt__embarque-date" id="lbCompras2DetalleSub">Agregue productos a la compra</span>
                                </div>
                            </div>
                            <div class="sygma-embarque-rpt__detail">
                                <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbCompras2DetalleItems">0 items</span>
                            </div>
                        </header>
                        <div class="sygma-embarque-rpt__toolbar compras2-detalle-toolbar">
                            <div class="input-group compras2-detalle-search-wrap">
                                <input type="text" autocomplete="off" class="form-control sygma-embarque-rpt__search border-base negrita" placeholder="Código o nombre de producto..." id="txtPosCodprod">
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-base hand" id="btnBuscarProd"><i class="fal fa-search"></i></button>
                                </div>
                            </div>
                            <button type="button" class="btn hand compras2-btn-cargar-costos" id="btnCompras2CargarCostos" title="Actualizar costos en catálogo">
                                <span class="compras2-btn-cargar-costos__icon"><i class="fal fa-coins"></i></span>
                                <span class="compras2-btn-cargar-costos__text">Cargar costos</span>
                            </button>
                        </div>
                        <div class="table-responsive sygma-embarque-rpt__table-wrap">
                            <table class="table sygma-embarque-rpt__table mb-0" id="tblCompras2Detalle">
                                <thead>
                                    <tr>
                                        <th>CÓDIGO</th>
                                        <th>PRODUCTO</th>
                                        <th class="text-center">CANT</th>
                                        <th class="text-center">MED</th>
                                        <th class="text-right">COSTO</th>
                                        <th class="text-right">DESC</th>
                                        <th class="text-right">IMPORTE</th>
                                        <th class="sygma-embarque-rpt__col-action text-center"></th>
                                    </tr>
                                </thead>
                                <tbody id="tblPosPedido"></tbody>
                            </table>
                        </div>
                        <div class="sygma-embarque-rpt__total-block" id="lbCompras2DetalleTotal"></div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-5 col-12 pos2-pedido-side">
                <div class="pos2-sidebar">${compras2_tpl_sidebar_datos()}</div>
            </div>
        </div>
        ${compras2_tpl_modals()}
    </div>`;
}

function getView() {
    if (typeof spa_inyectarEstilosPos2 === 'function') spa_inyectarEstilosPos2();

    root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = `
    <div class="pos2-wrap">
        <div class="pos2-totals-bar">
            <div class="row align-items-center no-gutters">
                <div class="col-md-5 col-7">
                    <div class="d-flex align-items-center">
                        <img src="./favicon.png" width="36" height="36" alt="" class="mr-2">
                        <div>
                            <div class="negrita mb-0 pos2-bar-title" style="font-size:0.95rem" id="lbCompras2Titulo">Compras</div>
                            <div class="small" style="opacity:0.9" id="lbCompras2Resumen">0 documentos</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-7 col-5 text-right">
                    <div class="small mb-0" style="opacity:0.85" id="lbCompras2BarLabel">Total del día</div>
                    <div class="negrita pos2-total-main" id="lbCompras2TotalBar">Q 0.00</div>
                    <div class="d-none" id="compras2BarIngreso">
                        <div class="small" id="lbTotalItems">0 items</div>
                        <div class="negrita" id="lbTotalVentaDescuento">Q 0.00</div>
                    </div>
                </div>
            </div>
        </div>

        <div id="compras2Listado">
            <div class="pos2-panel-card mx-2 mt-2">
                <div class="pos2-panel-head d-flex justify-content-between align-items-center flex-wrap">
                    <span class="negrita mb-0"><i class="fal fa-file-invoice mr-1"></i> Compras registradas (COM)</span>
                </div>
                <div class="card-body">
                    <div class="compras2-listado-filtros mb-3">
                        <input type="date" class="form-control negrita compras2-listado-filtros__fecha" id="txtCompras2Fecha" title="Fecha">
                        <select class="form-control negrita compras2-listado-filtros__coddoc" id="cmbCompras2CoddocNuevo" title="Serie del documento a crear"></select>
                        <input type="search" class="form-control negrita compras2-listado-filtros__buscar" id="txtCompras2Buscar" placeholder="Buscar documento, proveedor, hora..." autocomplete="off">
                    </div>
                    <div class="pos2-table-scroll table-responsive">
                        <table class="table table-sm table-hover table-bordered mb-0" id="tblCompras2">
                            <thead class="bg-base text-white"><tr><th>HORA</th><th>DOCUMENTO</th><th>PROVEEDOR</th><th class="text-right">IMPORTE</th><th class="text-center">ST</th><th class="text-center">PAGO</th><th class="text-center">OPCIONES</th></tr></thead>
                            <tbody id="tblDataCompras2"><tr><td colspan="7" class="text-center text-muted py-4">Cargando...</td></tr></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        ${compras2_tpl_ingreso()}

        <span class="d-none" id="lbTotalVenta"></span><span class="d-none" id="lbTotalDescuento"></span>

        <button type="button" class="btn btn-success btn-xl btn-circle shadow hand sygma-fab-nuevo oculto-impresion" id="btnCompras2Nuevo" title="Nueva compra">
            <i class="fal fa-plus"></i>
        </button>
        <div id="compras2_print_host" class="sygma-embarque-print-host" aria-hidden="true"></div>
    </div>`;
}

function compras2_toggle_fab_nuevo(visible) {
    document.body.classList.toggle('compras2-en-ingreso', !visible);
    const btn = document.getElementById('btnCompras2Nuevo');
    if (!btn) return;
    if (visible) {
        btn.classList.remove('d-none');
    } else {
        btn.classList.add('d-none');
    }
}

function compras2_show_ingreso_loader(mensaje) {
    const el = document.getElementById('compras2IngresoLoader');
    const inner = document.getElementById('compras2IngresoLoaderInner');
    if (!el) return;
    if (inner) {
        inner.innerHTML = typeof GlobalLoader !== 'undefined' ? GlobalLoader : '<div class="text-center py-3">Cargando...</div>';
        if (mensaje) {
            const label = inner.querySelector('.sygma-loader__label');
            if (label) label.textContent = mensaje;
        }
    }
    el.classList.remove('d-none');
    el.setAttribute('aria-hidden', 'false');
}

function compras2_hide_ingreso_loader() {
    const el = document.getElementById('compras2IngresoLoader');
    if (!el) return;
    el.classList.add('d-none');
    el.setAttribute('aria-hidden', 'true');
}

window.compras2_show_ingreso_loader = compras2_show_ingreso_loader;
window.compras2_hide_ingreso_loader = compras2_hide_ingreso_loader;

function compras2_show_listado() {
    compras2_hide_ingreso_loader();
    document.getElementById('compras2Listado')?.classList.remove('d-none');
    document.getElementById('compras2Ingreso')?.classList.add('d-none');
    document.getElementById('lbCompras2Titulo').innerText = 'Compras';
    document.getElementById('lbCompras2BarLabel')?.classList.remove('d-none');
    document.getElementById('lbCompras2TotalBar')?.classList.remove('d-none');
    document.getElementById('compras2BarIngreso')?.classList.add('d-none');
    compras2_toggle_fab_nuevo(true);
    compras2_cargar_listado();
}

function compras2_show_ingreso(opts) {
    opts = opts || {};
    document.getElementById('compras2Listado')?.classList.add('d-none');
    document.getElementById('compras2Ingreso')?.classList.remove('d-none');
    document.getElementById('lbCompras2Titulo').innerText = opts.titulo || 'Nueva compra';
    document.getElementById('lbCompras2BarLabel')?.classList.add('d-none');
    document.getElementById('lbCompras2TotalBar')?.classList.add('d-none');
    document.getElementById('compras2BarIngreso')?.classList.remove('d-none');
    compras2_toggle_fab_nuevo(false);
    if (typeof compras2_setup_ingreso_listeners === 'function') compras2_setup_ingreso_listeners();
    if (opts.skipProveedores) {
        if (!opts.skipNuevo && typeof compras2_iniciar_documento_nuevo === 'function') {
            compras2_iniciar_documento_nuevo();
        }
        return;
    }
    if (!opts.skipNuevo && typeof compras2_iniciar_documento_nuevo === 'function') {
        const loadProv = (typeof compras2_cargar_select_proveedores === 'function')
            ? compras2_cargar_select_proveedores()
            : Promise.resolve();
        loadProv.finally(() => compras2_iniciar_documento_nuevo());
    } else if (typeof compras2_cargar_select_proveedores === 'function') {
        compras2_cargar_select_proveedores();
    }
}

function compras2_volver_listado() {
    if (typeof compras2_abandonar_documento === 'function') {
        compras2_abandonar_documento().finally(() => compras2_show_listado());
    } else {
        compras2_show_listado();
    }
}

function compras2_iniciar_nuevo() {
    if (typeof compras2_reset_sesion === 'function') compras2_reset_sesion();
    compras2_show_ingreso();
}

window.compras2_on_guardado_exitoso = compras2_volver_listado;
window.compras2_volver_listado = compras2_volver_listado;

function compras2_label_pago(concre) {
    if (concre === 'CRE') return 'CRÉDITO';
    if (concre === 'CON') return 'CONTADO';
    return concre || '—';
}

function compras2_render_tabla(records) {
    const container = document.getElementById('tblDataCompras2');
    const lbResumen = document.getElementById('lbCompras2Resumen');
    const lbTotal = document.getElementById('lbCompras2TotalBar');
    if (!container) return;

    if (!records.length) {
        container.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No hay compras para la fecha seleccionada.</td></tr>';
        if (lbResumen) lbResumen.innerText = '0 documentos';
        if (lbTotal) lbTotal.innerText = F.setMoneda(0, 'Q');
        return;
    }

    let str = '';
    let total = 0;
    records.forEach((rows) => {
        const anulado = rows.ST && rows.ST.toString() === 'A';
        const clsAnul = anulado ? 'text-danger' : '';
        const docKey = `${rows.CODDOC}-${rows.CORRELATIVO}`;
        const idBtnEdit = `btnC2Edit${docKey}`;
        const idBtnPrint = `btnC2Print${docKey}`;
        const idBtnDel = `btnC2Del${docKey}`;
        const st = rows.ST || 'O';
        const pago = compras2_label_pago(rows.CONCRE);
        total += Number(rows.TOTALPRECIO || 0);
        str += `<tr>
            <td>${rows.HORA || ''}</td>
            <td><b class="text-danger">${docKey}</b></td>
            <td>${rows.NOMCLIE || ''}</td>
            <td class="text-right negrita ${clsAnul}">${F.setMoneda(rows.TOTALPRECIO, 'Q')}</td>
            <td class="text-center negrita ${clsAnul}">${st}</td>
            <td class="text-center negrita ${clsAnul}">${pago}</td>
            <td class="text-center text-nowrap">
                <button type="button" class="btn btn-circle btn-info btn-sm hand shadow mr-1" id="${idBtnEdit}" title="Editar"
                    onclick="compras2_editar_documento('${rows.CODDOC}','${rows.CORRELATIVO}','${st}','${idBtnEdit}')" ${anulado ? 'disabled' : ''}>
                    <i class="fal fa-edit"></i>
                </button>
                <button type="button" class="btn btn-circle btn-verde btn-sm hand shadow mr-1" id="${idBtnPrint}" title="Imprimir"
                    onclick="compras2_imprimir_documento('${rows.CODDOC}','${rows.CORRELATIVO}','${idBtnPrint}')">
                    <i class="fal fa-print"></i>
                </button>
                <button type="button" class="btn btn-circle btn-danger btn-sm hand shadow" id="${idBtnDel}" title="Eliminar"
                    onclick="compras2_eliminar_documento_listado('${rows.CODDOC}','${rows.CORRELATIVO}','${st}','${idBtnDel}')" ${anulado ? 'disabled' : ''}>
                    <i class="fal fa-trash"></i>
                </button>
            </td>
        </tr>`;
    });
    container.innerHTML = str;
    if (lbResumen) lbResumen.innerText = records.length + ' documento' + (records.length === 1 ? '' : 's');
    if (lbTotal) lbTotal.innerText = F.setMoneda(total, 'Q');
    const txtBuscar = document.getElementById('txtCompras2Buscar');
    if (txtBuscar?.value) F.crearBusquedaTabla('tblCompras2', 'txtCompras2Buscar');
}

function compras2_cargar_listado() {
    const container = document.getElementById('tblDataCompras2');
    if (container) container.innerHTML = GlobalLoader;
    axios.post('/pos/lista_documentos', {
        sucursal: GlobalEmpnit,
        tipo: 'COM',
        fecha: F.devuelveFecha('txtCompras2Fecha')
    }).then((response) => {
        compras2_listaCache = response.data.recordset || [];
        compras2_render_tabla(compras2_listaCache);
    }).catch(() => {
        compras2_listaCache = [];
        compras2_render_tabla([]);
        F.AvisoError('No se pudo cargar el listado de compras');
    });
}

function addListeners() {
    document.title = 'Compras';
    const txtFecha = document.getElementById('txtCompras2Fecha');
    if (txtFecha) {
        txtFecha.value = F.getFecha();
        txtFecha.addEventListener('change', compras2_cargar_listado);
    }
    document.getElementById('txtCompras2Buscar')?.addEventListener('input', () => {
        F.crearBusquedaTabla('tblCompras2', 'txtCompras2Buscar');
    });
    document.getElementById('btnCompras2Nuevo')?.addEventListener('click', compras2_iniciar_nuevo);
    if (typeof compras2_cargar_select_coddoc_nuevo === 'function') {
        compras2_cargar_select_coddoc_nuevo();
    }
    compras2_cargar_listado();
}

function initView() {
    compras2_ingresoListenersReady = false;
    document.body.classList.remove('compras2-en-ingreso');
    if (typeof compras2_reset_sesion === 'function') compras2_reset_sesion();
    getView();
    addListeners();
}
