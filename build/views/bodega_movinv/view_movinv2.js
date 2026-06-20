'use strict';

var movinv2_listaCache = [];
var movinv2_tipoDoc = 'ENT';

function movinv2_set_tipo(tipodoc) {
    movinv2_tipoDoc = (tipodoc === 'SAL') ? 'SAL' : 'ENT';
    window.movinv2_tipoDoc = movinv2_tipoDoc;
}

function movinv2_get_titulos() {
    if (movinv2_tipoDoc === 'SAL') {
        return {
            corto: 'Salida de inventario',
            largo: 'AJUSTE DE SALIDA DE INVENTARIO',
            listado: 'Salidas registradas (SAL)',
            nuevo: 'Nueva salida de inventario'
        };
    }
    return {
        corto: 'Entrada de inventario',
        largo: 'AJUSTE DE ENTRADA DE INVENTARIO',
        listado: 'Entradas registradas (ENT)',
        nuevo: 'Nueva entrada de inventario'
    };
}

function movinv2_tpl_modals() {
    const sm = GlobalSignoMoneda || 'Q';
    return `
    <div class="modal fade sygma-doc-detalle-modal sygma-embarque-select-modal compras2-modal-productos" id="modal_lista_precios" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable" role="document">
            <div class="modal-content sygma-doc-detalle-modal__content">
                <div class="sygma-doc-detalle-modal__header sygma-embarque-select-modal__header">
                    <div class="sygma-doc-detalle-modal__header-top mb-0">
                        <div>
                            <h4 class="sygma-doc-detalle-modal__title">Buscar producto</h4>
                            <p class="sygma-doc-detalle-modal__doc-ref mb-0">Seleccione un producto para agregar al movimiento</p>
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
    </div>`;
}

function movinv2_tpl_card_documento() {
    return `
    <div class="pos2-panel-card pos2-doc-compact compras2-card-documento-compact mb-2">
        <div class="pos2-panel-head"><span class="negrita mb-0"><i class="fal fa-file-invoice mr-1"></i> Datos del documento</span></div>
        <div class="card-body">
            <div class="form-group mb-2">
                <label class="small text-secondary">Serie / correlativo</label>
                <div class="input-group input-group-sm">
                    <select class="form-control" id="cmbCoddoc"></select>
                    <input type="number" id="txtCorrelativo" class="form-control negrita" disabled value="0">
                </div>
            </div>
            <div class="row mx-0">
                <div class="col-6 pl-0 pr-1 form-group mb-2 d-none">
                    <label class="small text-secondary">Caja</label>
                    <select class="form-control form-control-sm" id="cmbCaja"></select>
                </div>
                <div class="col-12 pl-0 pr-0 form-group mb-2">
                    <label class="small text-secondary">Fecha</label>
                    <input type="date" id="txtFecha" class="form-control form-control-sm negrita border-base">
                </div>
            </div>
            <div class="form-group mb-2">
                <label class="small text-secondary">Empleado</label>
                <select class="form-control form-control-sm" id="cmbVendedor"></select>
            </div>
            <div class="form-group mb-0">
                <label class="small text-secondary">Observaciones</label>
                <textarea class="form-control form-control-sm negrita" rows="2" id="txtObs"></textarea>
            </div>
            <div class="d-none">
                <select class="form-control form-control-sm" id="cmbTipoDocumento" disabled="true">
                    <option value="ENT">AJUST.ENTRADA INV</option>
                    <option value="SAL">AJUST.SALIDA INV</option>
                </select>
                <select class="form-control form-control-sm negrita" id="cmbConCre">
                    <option value="CON">CONTADO</option>
                    <option value="CRE">CREDITO</option>
                </select>
                <input type="date" class="form-control form-control-sm negrita" id="txtFechaPago">
                <input type="text" class="form-control negrita" id="txtSerieFac" placeholder="Serie">
                <input type="text" class="form-control negrita" id="txtNumeroFac" placeholder="Número">
                <input type="text" class="form-control negrita" id="txtCoddocOrigen" placeholder="Serie origen">
                <input type="text" class="form-control negrita" id="txtCorrelativoOrigen" placeholder="Número origen">
            </div>
        </div>
    </div>
    <div class="pos2-panel-card pos2-doc-compact compras2-card-documento-compact mb-2">
        <div class="pos2-panel-head"><span class="negrita mb-0"><i class="fal fa-truck mr-1"></i> Datos del destino</span></div>
        <div class="card-body">
            <div class="form-group mb-2">
                <label class="small text-secondary negrita">Sucursal de destino</label>
                <select class="negrita form-control form-control-sm" id="cmbEmpresas"></select>
            </div>
            <div class="form-group mb-0">
                <label class="small text-secondary negrita">Prioridad</label>
                <select class="form-control form-control-sm negrita text-base" id="cmbPrioridad"></select>
            </div>
        </div>
    </div>
    <div class="pos2-sidebar-save">
        <div class="text-center mb-2">
            <div class="pos2-sidebar-total-label">Total movimiento</div>
            <div class="pos2-sidebar-total-value" id="lbPosCobroTotalPagar">Q 0.00</div>
        </div>
        <button type="button" class="btn btn-base btn-block pos2-btn-guardar shadow hand" id="btnGuardarFactura"><i class="fal fa-save mr-1"></i> Guardar movimiento</button>
    </div>`;
}

function movinv2_tpl_sidebar_datos() {
    return movinv2_tpl_card_documento();
}

function movinv2_tpl_ingreso() {
    return `
    <div id="movinv2Ingreso" class="d-none">
        <div id="movinv2IngresoLoader" class="compras2-ingreso-loader d-none" aria-live="polite" aria-busy="true" aria-hidden="true">
            <div class="compras2-ingreso-loader__panel" id="movinv2IngresoLoaderInner"></div>
        </div>
        <input type="hidden" id="txtPosCobroNitclie" value="0">
        <input type="hidden" id="txtPosCobroNit" value="CF">
        <input type="hidden" id="txtPosCobroNombre" value="PROVEEDORES VARIOS">
        <input type="hidden" id="txtPosCobroDireccion" value="CIUDAD">
        <div class="px-2 pt-2 pb-1 compras2-ingreso-toolbar d-flex align-items-center flex-wrap">
            <button type="button" class="btn btn-outline-secondary btn-sm hand shadow-sm mb-2 mb-md-0" id="btnMovinv2VolverListado">
                <i class="fal fa-arrow-left mr-1"></i> Volver al listado
            </button>
            <span class="small negrita text-danger mb-2 mb-md-0 ml-auto" id="lbMovinv2DocRef"></span>
        </div>
        <div class="row pos2-pedido-layout mx-0">
            <div class="col-lg-8 col-md-7 col-12 pos2-pedido-main">
                <div class="sygma-embarque-rpt card card-rounded shadow-sm border-0" id="rpt_movinv2_detalle">
                    <div class="card-body sygma-embarque-rpt__body p-2">
                        <header class="sygma-embarque-rpt__header">
                            <div class="sygma-embarque-rpt__brand">
                                <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="40" height="40" alt="Logo">
                                <div class="sygma-embarque-rpt__brand-text">
                                    <h4 class="sygma-embarque-rpt__title mb-0">Detalle de movimiento</h4>
                                    <span class="sygma-embarque-rpt__embarque-date" id="lbMovinv2DetalleSub">Agregue productos al movimiento</span>
                                </div>
                            </div>
                            <div class="sygma-embarque-rpt__detail">
                                <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbMovinv2DetalleItems">0 items</span>
                            </div>
                        </header>
                        <div class="sygma-embarque-rpt__toolbar compras2-detalle-toolbar">
                            <div class="input-group compras2-detalle-search-wrap">
                                <input type="text" autocomplete="off" class="form-control sygma-embarque-rpt__search border-base negrita" placeholder="Código o nombre de producto..." id="txtPosCodprod">
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-base hand" id="btnBuscarProd"><i class="fal fa-search"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive sygma-embarque-rpt__table-wrap">
                            <table class="table sygma-embarque-rpt__table mb-0" id="tblMovinv2Detalle">
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
                        <div class="sygma-embarque-rpt__total-block" id="lbMovinv2DetalleTotal"></div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-5 col-12 pos2-pedido-side">
                <div class="pos2-sidebar">${movinv2_tpl_sidebar_datos()}</div>
            </div>
        </div>
        ${movinv2_tpl_modals()}
    </div>`;
}

function movinv2_actualizar_titulos_ui() {
    const t = movinv2_get_titulos();
    const lbTitulo = document.getElementById('lbMovinv2Titulo');
    const lbListado = document.getElementById('lbMovinv2ListadoTitulo');
    const cmbTipo = document.getElementById('cmbTipoDocumento');
    if (lbTitulo) lbTitulo.innerText = t.corto;
    if (lbListado) lbListado.innerText = t.listado;
    if (cmbTipo) cmbTipo.value = movinv2_tipoDoc;
}

function getView() {
    if (typeof spa_inyectarEstilosPos2 === 'function') spa_inyectarEstilosPos2();

    root = document.getElementById('root');
    if (!root) return;

    const t = movinv2_get_titulos();

    root.innerHTML = `
    <div class="pos2-wrap">
        <div class="pos2-totals-bar">
            <div class="row align-items-center no-gutters">
                <div class="col-md-5 col-7">
                    <div class="d-flex align-items-center">
                        <img src="./favicon.png" width="36" height="36" alt="" class="mr-2">
                        <div>
                            <div class="negrita mb-0 pos2-bar-title" style="font-size:0.95rem" id="lbMovinv2Titulo">${t.corto}</div>
                            <div class="small" style="opacity:0.9" id="lbMovinv2Resumen">0 documentos</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-7 col-5 text-right">
                    <div class="small mb-0" style="opacity:0.85" id="lbMovinv2BarLabel">Total del día</div>
                    <div class="negrita pos2-total-main" id="lbMovinv2TotalBar">Q 0.00</div>
                    <div class="d-none" id="movinv2BarIngreso">
                        <div class="small" id="lbTotalItems">0 items</div>
                        <div class="negrita" id="lbTotalVentaDescuento">Q 0.00</div>
                    </div>
                </div>
            </div>
        </div>

        <div id="movinv2Listado">
            <div class="pos2-panel-card mx-2 mt-2">
                <div class="pos2-panel-head d-flex justify-content-between align-items-center flex-wrap">
                    <span class="negrita mb-0"><i class="fal fa-boxes mr-1"></i> <span id="lbMovinv2ListadoTitulo">${t.listado}</span></span>
                </div>
                <div class="card-body">
                    <div class="compras2-listado-filtros mb-3">
                        <input type="date" class="form-control negrita compras2-listado-filtros__fecha" id="txtMovinv2Fecha" title="Fecha">
                        <select class="form-control negrita compras2-listado-filtros__coddoc" id="cmbMovinv2CoddocNuevo" title="Serie del documento a crear"></select>
                        <input type="search" class="form-control negrita compras2-listado-filtros__buscar" id="txtMovinv2Buscar" placeholder="Buscar documento, destino, hora..." autocomplete="off">
                    </div>
                    <div class="pos2-table-scroll table-responsive">
                        <table class="table table-sm table-hover table-bordered mb-0" id="tblMovinv2">
                            <thead class="bg-base text-white"><tr><th>HORA</th><th>DOCUMENTO</th><th>DESTINO</th><th class="text-right">IMPORTE</th><th class="text-center">ST</th><th class="text-center">OPCIONES</th></tr></thead>
                            <tbody id="tblDataMovinv2"><tr><td colspan="6" class="text-center text-muted py-4">Cargando...</td></tr></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        ${movinv2_tpl_ingreso()}

        <span class="d-none" id="lbTotalVenta"></span><span class="d-none" id="lbTotalDescuento"></span>

        <button type="button" class="btn btn-success btn-xl btn-circle shadow hand sygma-fab-nuevo oculto-impresion" id="btnMovinv2Nuevo" title="Nuevo movimiento">
            <i class="fal fa-plus"></i>
        </button>
        <div id="movinv2_print_host" class="sygma-embarque-print-host" aria-hidden="true"></div>
    </div>`;
}

function movinv2_toggle_fab_nuevo(visible) {
    document.body.classList.toggle('movinv2-en-ingreso', !visible);
    const btn = document.getElementById('btnMovinv2Nuevo');
    if (!btn) return;
    if (visible) {
        btn.classList.remove('d-none');
    } else {
        btn.classList.add('d-none');
    }
}

function movinv2_show_ingreso_loader(mensaje) {
    const el = document.getElementById('movinv2IngresoLoader');
    const inner = document.getElementById('movinv2IngresoLoaderInner');
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

function movinv2_hide_ingreso_loader() {
    const el = document.getElementById('movinv2IngresoLoader');
    if (!el) return;
    el.classList.add('d-none');
    el.setAttribute('aria-hidden', 'true');
}

window.movinv2_show_ingreso_loader = movinv2_show_ingreso_loader;
window.movinv2_hide_ingreso_loader = movinv2_hide_ingreso_loader;
window.movinv2_set_tipo = movinv2_set_tipo;

function movinv2_show_listado() {
    movinv2_hide_ingreso_loader();
    document.getElementById('movinv2Listado')?.classList.remove('d-none');
    document.getElementById('movinv2Ingreso')?.classList.add('d-none');
    movinv2_actualizar_titulos_ui();
    document.getElementById('lbMovinv2BarLabel')?.classList.remove('d-none');
    document.getElementById('lbMovinv2TotalBar')?.classList.remove('d-none');
    document.getElementById('movinv2BarIngreso')?.classList.add('d-none');
    movinv2_toggle_fab_nuevo(true);
    movinv2_cargar_listado();
}

function movinv2_show_ingreso(opts) {
    opts = opts || {};
    const t = movinv2_get_titulos();
    document.getElementById('movinv2Listado')?.classList.add('d-none');
    document.getElementById('movinv2Ingreso')?.classList.remove('d-none');
    document.getElementById('lbMovinv2Titulo').innerText = opts.titulo || t.nuevo;
    document.getElementById('lbMovinv2BarLabel')?.classList.add('d-none');
    document.getElementById('lbMovinv2TotalBar')?.classList.add('d-none');
    document.getElementById('movinv2BarIngreso')?.classList.remove('d-none');
    movinv2_toggle_fab_nuevo(false);

    const nitclie = document.getElementById('txtPosCobroNitclie');
    const nit = document.getElementById('txtPosCobroNit');
    const nombre = document.getElementById('txtPosCobroNombre');
    const direccion = document.getElementById('txtPosCobroDireccion');
    if (nitclie) nitclie.value = '0';
    if (nit) nit.value = 'CF';
    if (nombre) nombre.value = 'PROVEEDORES VARIOS';
    if (direccion) direccion.value = 'CIUDAD';

    const cmbTipo = document.getElementById('cmbTipoDocumento');
    if (cmbTipo) cmbTipo.value = movinv2_tipoDoc;

    if (typeof movinv2_setup_ingreso_listeners === 'function') movinv2_setup_ingreso_listeners();
    if (!opts.skipNuevo && typeof movinv2_iniciar_documento_nuevo === 'function') {
        movinv2_iniciar_documento_nuevo();
    }
}

function movinv2_volver_listado() {
    if (typeof movinv2_abandonar_documento === 'function') {
        movinv2_abandonar_documento().finally(() => movinv2_show_listado());
    } else {
        movinv2_show_listado();
    }
}

function movinv2_iniciar_nuevo() {
    if (typeof movinv2_reset_sesion === 'function') movinv2_reset_sesion();
    movinv2_show_ingreso();
}

window.movinv2_on_guardado_exitoso = movinv2_volver_listado;
window.movinv2_volver_listado = movinv2_volver_listado;

function movinv2_render_tabla(records) {
    const container = document.getElementById('tblDataMovinv2');
    const lbResumen = document.getElementById('lbMovinv2Resumen');
    const lbTotal = document.getElementById('lbMovinv2TotalBar');
    if (!container) return;

    if (!records.length) {
        container.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No hay movimientos para la fecha seleccionada.</td></tr>';
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
        const idBtnEdit = `btnM2Edit${docKey}`;
        const idBtnPrint = `btnM2Print${docKey}`;
        const idBtnDel = `btnM2Del${docKey}`;
        const st = rows.ST || 'O';
        total += Number(rows.TOTALPRECIO || 0);
        str += `<tr>
            <td>${rows.HORA || ''}</td>
            <td><b class="text-danger">${docKey}</b></td>
            <td>${rows.NOMCLIE || ''}</td>
            <td class="text-right negrita ${clsAnul}">${F.setMoneda(rows.TOTALPRECIO, 'Q')}</td>
            <td class="text-center negrita ${clsAnul}">${st}</td>
            <td class="text-center text-nowrap">
                <button type="button" class="btn btn-circle btn-info btn-sm hand shadow mr-1" id="${idBtnEdit}" title="Editar"
                    onclick="movinv2_editar_documento('${rows.CODDOC}','${rows.CORRELATIVO}','${st}','${idBtnEdit}')" ${anulado ? 'disabled' : ''}>
                    <i class="fal fa-edit"></i>
                </button>
                <button type="button" class="btn btn-circle btn-verde btn-sm hand shadow mr-1" id="${idBtnPrint}" title="Imprimir"
                    onclick="movinv2_imprimir_documento('${rows.CODDOC}','${rows.CORRELATIVO}','${idBtnPrint}')">
                    <i class="fal fa-print"></i>
                </button>
                <button type="button" class="btn btn-circle btn-danger btn-sm hand shadow" id="${idBtnDel}" title="Eliminar"
                    onclick="movinv2_eliminar_documento_listado('${rows.CODDOC}','${rows.CORRELATIVO}','${st}','${idBtnDel}')" ${anulado ? 'disabled' : ''}>
                    <i class="fal fa-trash"></i>
                </button>
            </td>
        </tr>`;
    });
    container.innerHTML = str;
    if (lbResumen) lbResumen.innerText = records.length + ' documento' + (records.length === 1 ? '' : 's');
    if (lbTotal) lbTotal.innerText = F.setMoneda(total, 'Q');
    const txtBuscar = document.getElementById('txtMovinv2Buscar');
    if (txtBuscar?.value) F.crearBusquedaTabla('tblMovinv2', 'txtMovinv2Buscar');
}

function movinv2_cargar_listado() {
    const container = document.getElementById('tblDataMovinv2');
    if (container) container.innerHTML = GlobalLoader;
    axios.post('/pos/lista_documentos', {
        sucursal: GlobalEmpnit,
        tipo: movinv2_tipoDoc,
        fecha: F.devuelveFecha('txtMovinv2Fecha')
    }).then((response) => {
        movinv2_listaCache = response.data.recordset || [];
        movinv2_render_tabla(movinv2_listaCache);
    }).catch(() => {
        movinv2_listaCache = [];
        movinv2_render_tabla([]);
        F.AvisoError('No se pudo cargar el listado de movimientos');
    });
}

function addListeners(tipodoc) {
    movinv2_set_tipo(tipodoc);
    const t = movinv2_get_titulos();
    document.title = t.largo;
    movinv2_actualizar_titulos_ui();

    const txtFecha = document.getElementById('txtMovinv2Fecha');
    if (txtFecha) {
        txtFecha.value = F.getFecha();
        txtFecha.addEventListener('change', movinv2_cargar_listado);
    }
    document.getElementById('txtMovinv2Buscar')?.addEventListener('input', () => {
        F.crearBusquedaTabla('tblMovinv2', 'txtMovinv2Buscar');
    });
    document.getElementById('btnMovinv2Nuevo')?.addEventListener('click', movinv2_iniciar_nuevo);
    if (typeof movinv2_cargar_select_coddoc_nuevo === 'function') {
        movinv2_cargar_select_coddoc_nuevo();
    }
    movinv2_cargar_listado();
}

function destroyView() {
    try {
        $('#modal_lista_precios, #modal_cantidad, #modal_editar_cantidad').modal('hide');
    } catch (e) { /* sin modal activo */ }
    ['modal_lista_precios', 'modal_cantidad', 'modal_editar_cantidad'].forEach((id) => {
        document.querySelectorAll('#' + id).forEach((el) => {
            const $el = $(el);
            if ($el.data('bs.modal')) {
                $el.modal('dispose');
            }
            el.remove();
        });
    });
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    document.body.classList.remove('modal-open', 'movinv2-en-ingreso');
    document.body.style.removeProperty('padding-right');
    if (typeof Mousetrap !== 'undefined' && typeof Mousetrap.reset === 'function') {
        Mousetrap.reset();
    }
    if (typeof movinv2_reset_sesion === 'function') movinv2_reset_sesion();
    if (typeof movinv2_reset_modal_bindings === 'function') movinv2_reset_modal_bindings();
    if (typeof movinv2_ingresoListenersReady !== 'undefined') movinv2_ingresoListenersReady = false;
}

function initView(tipodoc) {
    movinv2_set_tipo(tipodoc);
    if (typeof movinv2_ingresoListenersReady !== 'undefined') movinv2_ingresoListenersReady = false;
    document.body.classList.remove('movinv2-en-ingreso');
    if (typeof movinv2_reset_sesion === 'function') movinv2_reset_sesion();
    getView();
    addListeners(tipodoc);
}
