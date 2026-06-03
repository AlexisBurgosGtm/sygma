'use strict';

/** Estado de edición (var: el SPA recarga el script al reentrar a la vista) */
var Pos2ModoEdicion = { activo: false, coddoc: '', correlativo: '' };
/** Resultados de búsqueda de productos (evita onclick con texto escapado) */
var Pos2ProductosBusqueda = [];
/** Stream y loop de escaneo (var: recarga SPA) */
var Pos2BarcodeStream = null;
var Pos2BarcodeAnimId = null;

function pos2_inyectarEstilos() {
    if (typeof spa_inyectarEstilosPos2 === 'function') {
        spa_inyectarEstilosPos2();
    }
}

function pos2_mostrarBannerEdicion() {
    const el = document.getElementById('pos2EditBanner');
    const txt = document.getElementById('pos2EditBannerText');
    if (!el || !txt) return;
    if (Pos2ModoEdicion.activo) {
        txt.textContent = `Reemplazo de ${Pos2ModoEdicion.coddoc}-${Pos2ModoEdicion.correlativo}: el original quedó anulado; guarde para emitir el documento nuevo.`;
        el.classList.add('active');
    } else {
        el.classList.remove('active');
    }
}

function pos2_salirModoEdicion() {
    Pos2ModoEdicion = { activo: false, coddoc: '', correlativo: '' };
    pos2_mostrarBannerEdicion();
    const cmbCoddoc = document.getElementById('cmbCoddoc');
    const txtCorrelativo = document.getElementById('txtCorrelativo');
    if (cmbCoddoc) cmbCoddoc.disabled = false;
    if (txtCorrelativo) txtCorrelativo.disabled = true;
}

/** Modales fuera de #root para que Bootstrap los muestre correctamente (SPA/tabs). */
function pos2_moverModalesABody() {
    const ids = [
        'modal_pos2_cantidad',
        'modal_pos2_editar_cantidad',
        'modal_pos2_lista_precios',
        'modal_pos2_lista_documentos',
        'modal_pos2_lista_clientes',
        'modal_pos2_barcode'
    ];
    ids.forEach((id) => {
        const nodes = document.querySelectorAll('#' + id);
        if (!nodes.length) return;
        const el = nodes[nodes.length - 1];
        nodes.forEach((n, i) => {
            if (n !== el) n.remove();
        });
        if (el.parentElement !== document.body) {
            const $el = $(el);
            if ($el.data('bs.modal')) {
                $el.modal('dispose');
            }
            document.body.appendChild(el);
        }
    });
}

function pos2_detenerBarcode() {
    if (Pos2BarcodeAnimId != null) {
        cancelAnimationFrame(Pos2BarcodeAnimId);
        Pos2BarcodeAnimId = null;
    }
    if (Pos2BarcodeStream) {
        Pos2BarcodeStream.getTracks().forEach((t) => t.stop());
        Pos2BarcodeStream = null;
    }
    const video = document.getElementById('pos2_barcode_video');
    if (video) {
        video.srcObject = null;
    }
    const root = document.getElementById('root_pos2_barcode');
    if (root) {
        root.innerHTML = '';
    }
}

async function pos2_iniciarBarcode() {
    const root = document.getElementById('root_pos2_barcode');
    if (!root) return;

    pos2_detenerBarcode();
    root.innerHTML = '';

    if (!('BarcodeDetector' in window)) {
        root.innerHTML = '<p class="text-danger mb-0">Este navegador no soporta lectura de códigos. Use Chrome o Edge actualizado.</p>';
        return;
    }

    const barcodeDetector = new BarcodeDetector({
        formats: ['code_39', 'codabar', 'ean_13', 'ean_8', 'code_128', 'qr_code', 'upc_a', 'upc_e']
    });

    let mediaStream;
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });
    } catch (err) {
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (err2) {
            root.innerHTML = '<p class="text-danger mb-0">No se pudo acceder a la cámara. Verifique permisos del navegador.</p>';
            return;
        }
    }

    Pos2BarcodeStream = mediaStream;

    const video = document.createElement('video');
    video.srcObject = mediaStream;
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    video.id = 'pos2_barcode_video';
    root.appendChild(video);

    let leido = false;

    function render() {
        if (leido) return;
        barcodeDetector
            .detect(video)
            .then((barcodes) => {
                if (leido || !barcodes.length) return;
                leido = true;
                const codigo = (barcodes[0].rawValue || '').trim();
                pos2_detenerBarcode();
                $('#modal_pos2_barcode').modal('hide');
                const txt = document.getElementById('txtPosCodprod');
                const btn = document.getElementById('btnBuscarProd');
                if (txt) {
                    txt.value = codigo.toUpperCase();
                }
                if (btn) {
                    btn.click();
                }
            })
            .catch(() => { /* frame sin código */ });
    }

    function renderLoop() {
        Pos2BarcodeAnimId = requestAnimationFrame(renderLoop);
        render();
    }
    renderLoop();
}

/** Sin clase fade ni transiciones: evita congelamiento al encadenar modales. */
function pos2_prepararModalesSinAnimacion() {
    const ids = [
        'modal_pos2_cantidad',
        'modal_pos2_editar_cantidad',
        'modal_pos2_lista_precios',
        'modal_pos2_lista_documentos',
        'modal_pos2_lista_clientes',
        'modal_pos2_barcode'
    ];
    ids.forEach((id) => {
        document.querySelectorAll('#' + id).forEach((el) => {
            el.classList.remove('fade');
            el.classList.add('pos2-modal');
        });
    });
}

function pos2_onProductRowClick(e) {
    const row = e.target.closest('tr[data-pos2-pick]');
    if (!row) return;
    e.preventDefault();
    e.stopPropagation();
    const idx = Number(row.getAttribute('data-pos2-pick'));
    if (Number.isNaN(idx)) return;
    pos2_abrirModalCantidadDesdeBusqueda(idx);
}

function pos2_bindProductPickClicks() {
    const modal = document.getElementById('modal_pos2_lista_precios');
    if (!modal || modal.dataset.pos2PickBound === '1') return;
    modal.dataset.pos2PickBound = '1';
    modal.addEventListener('click', pos2_onProductRowClick);
}

/** Eliminar ítem del pedido (delegación; evita onclick roto en SPA). */
function pos2_bindPedidoTableActions() {
    const tbl = document.getElementById('tblPosPedido');
    if (!tbl || tbl.dataset.pos2ActionsBound === '1') return;
    tbl.dataset.pos2ActionsBound = '1';
    tbl.addEventListener('click', (e) => {
        const btnDel = e.target.closest('[data-pos2-del-id]');
        if (!btnDel) return;
        e.preventDefault();
        e.stopPropagation();
        delete_item_pedido(btnDel.getAttribute('data-pos2-del-id'));
    });
}

function getView(){
    pos2_inyectarEstilos();
   
    
    let view = {
        body:()=>{
            return `
                <div class="pos2-wrap">
                    <div class="pos2-totals-bar">
                        <div class="row align-items-center no-gutters">
                            <div class="col-md-5 col-7">
                                <div class="d-flex align-items-center">
                                    <img src="./favicon.png" width="36" height="36" alt="" class="mr-2">
                                    <div>
                                        <div class="negrita mb-0 pos2-bar-title" style="font-size:0.95rem">Punto de Venta</div>
                                        <div class="small" style="opacity:0.9" id="lbTotalItems">0 items</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-7 col-5 text-right">
                                <div class="negrita mb-0" id="lbTotalVenta">Q 0.00</div>
                                <div id="lbTotalDescuento">Q 0.00</div>
                                <div class="negrita pos2-total-main" id="lbTotalVentaDescuento">Q 0.00</div>
                            </div>
                        </div>
                    </div>

                    <div id="pos2EditBanner" class="pos2-edit-banner">
                        <span id="pos2EditBannerText"></span>
                        <button type="button" class="btn btn-sm btn-outline-base" id="btnPos2CancelarEdicion">
                            <i class="fal fa-times"></i> Cancelar edición
                        </button>
                    </div>

                    <ul class="nav nav-tabs pos2-step-tabs mb-2" id="myTabHome" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="tab-pedido" data-toggle="tab" href="#pedido" role="tab">
                                <i class="fal fa-shopping-cart mr-1"></i> Pedido
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="tab-documento" data-toggle="tab" href="#documento" role="tab">
                                <i class="fal fa-file-invoice mr-1"></i> Datos del Documento
                            </a>
                        </li>
                    </ul>

                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="pedido" role="tabpanel">
                            ${view.pedido()}
                        </div>
                        <div class="tab-pane fade" id="documento" role="tabpanel">
                            ${view.documento()}
                        </div>
                    </div>
                    ${view.modal_cantidad() + view.modal_editar_cantidad() + view.modal_lista_precios() + view.modal_lista_documentos() + view.modal_lista_clientes() + view.modal_barcode()}
                </div>
            `
        },
        pedido:()=>{
            return `
            <div class="row pos2-pedido-layout">
                <div class="col-lg-8 col-md-7 col-12 pos2-pedido-main">
                    <div class="pos2-panel-card">
                        <div class="pos2-panel-head d-flex justify-content-between align-items-center flex-wrap">
                            <span class="negrita mb-0"><i class="fal fa-shopping-cart mr-1"></i> Productos agregados</span>
                            <small class="mb-0">F2: pedido · Ctrl+→: documento · Ctrl+G: guardar</small>
                        </div>
                        <div class="card-body">
                            <label class="mb-1 small" style="color:var(--pos2-muted);font-weight:600">Buscar producto</label>
                            <div class="input-group mb-2">
                                <input type="text" autocomplete="off" class="form-control negrita pos2-search-input" placeholder="Código o nombre..." id="txtPosCodprod">
                                <div class="input-group-append">
                                    <button class="btn btn-base hand px-3" id="btnBuscarProd" type="button">
                                        <i class="fal fa-search"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="pos2-table-scroll table-responsive">
                                <table class="table table-sm table-hover mb-0 pos2-table-compact">
                                    <thead class="bg-base text-white">
                                        <tr>
                                            <th>Producto</th>
                                            <th>Desc. 2</th>
                                            <th>Medida</th>
                                            <th class="text-center">Cant.</th>
                                            <th class="text-right">Precio</th>
                                            <th class="text-right">Subtotal</th>
                                            <th class="text-right">Desc.</th>
                                            <th class="text-right">Importe</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tblPosPedido"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-5 col-12 pos2-pedido-side">
                    <div class="pos2-sidebar">
                        ${view.documento_card_cliente()}
                        <div class="pos2-sidebar-save">
                            <div class="text-center mb-1">
                                <div class="pos2-sidebar-total-label">Total a pagar</div>
                                <div class="pos2-sidebar-total-value" id="lbPosCobroTotalPagar">Q 0.00</div>
                            </div>
                            <button type="button" class="btn btn-base btn-block pos2-btn-guardar shadow hand" id="btnGuardarFactura" title="Guardar venta (Ctrl+G)">
                                <i class="fal fa-save mr-1"></i> Guardar venta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-base btn-xl btn-bottom-l btn-circle shadow hand" id="btnListadoDocumentos" title="Documentos del día">
                <i class="fal fa-folder"></i>
            </button>
            <button type="button" class="btn btn-base btn-xl btn-bottom-middle btn-circle shadow hand" id="btnPosEscanearBarcode" title="Escanear código de barras">
                <i class="fal fa-barcode-read"></i>
            </button>
            `
        },
        modal_barcode: () => {
            return `
            <div class="modal pos2-modal" id="modal_pos2_barcode" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-base text-white py-2">
                            <h5 class="modal-title mb-0"><i class="fal fa-barcode-read mr-1"></i> Escanear código</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span aria-hidden="true">&times;</span></button>
                        </div>
                        <div class="modal-body p-3 text-center">
                            <div id="root_pos2_barcode"></div>
                            <p class="small text-muted mt-2 mb-0">Apunte la cámara al código de barras del producto</p>
                        </div>
                    </div>
                </div>
            </div>
            `
        },
        modal_lista_precios:()=>{
            return `
            <div class="modal modal-with-scroll pos2-modal" id="modal_pos2_lista_precios" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl" role="document">
                    <div class="modal-content">
            
                        <div class="modal-body p-4">
                            <label class="modal-title text-base h3" id="">Buscar producto</label>

                                    <div class="form-group">
                                        <label class="negrita text-secondary">Escriba para buscar...</label>
                                        <input type="text" class="form-control" id="txtBusquedaProducto" placeholder="Escriba para buscar..."
                                        oninput="F.FiltrarTabla('tblProductos','txtBusquedaProducto')">
                                    </div>

                                    <table class="table table-responsive  table-hover table-bordered h-full" id="tblProductos">
                                        <thead class="bg-base text-white">
                                            <tr>
                                                <td>MARCA</td>
                                                <td>PRODUCTO</td>
                                                <td>DESCRIPCION 2</td>
                                                <td>MEDIDA</td>
                                                <td>PRECIO</td>
                                                <td>EXISTENCIA</td>
                                                <td>IPs</td>
                                                <td>TIPO</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataProductos"></tbody>
                                    </table>

                            <br>

                            <div class="row">
                                    <div class="text-left">
                                        <button class="btn btn-secondary btn-xl btn-circle hand shadow waves-effect waves-themed" data-dismiss="modal" id="">
                                            <i class="fal fa-arrow-left"></i>
                                        </button>                                
                                    </div>
        
                                   
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        },
        modal_cantidad:()=>{
            return `
            <div class="modal pos2-modal-cantidad pos2-modal" id="modal_pos2_cantidad" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header pos2-panel-head py-2">
                            <h5 class="modal-title negrita text-base mb-0" id="lbCantidadDesprod">Cantidad de producto</h5>
                            <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-3">
                            <div id="container_precio" class="pos2-modal-producto"></div>
                            <div class="row">
                                <div class="col-md-6 col-12">
                                    <div class="form-group mb-2">
                                        <label class="negrita text-secondary small">Cantidad</label>
                                        <input type="number" min="0" step="any" class="form-control negrita text-info border-base" id="txtMCCantidad">
                                    </div>
                                    <div class="form-group mb-2">
                                        <label class="negrita text-secondary small">Precio ${GlobalSignoMoneda}</label>
                                        <input type="number" min="0" step="any" class="form-control negrita text-info border-base" id="txtMCPrecio">
                                    </div>
                                    <div class="form-group mb-2">
                                        <label class="negrita text-secondary small">Subtotal ${GlobalSignoMoneda}</label>
                                        <input type="number" class="form-control negrita text-danger border-base" id="txtMCTotalPrecio" disabled>
                                    </div>
                                </div>
                                <div class="col-md-6 col-12">
                                    <div class="form-group mb-2">
                                        <label class="negrita text-secondary small">Descuento ${GlobalSignoMoneda}</label>
                                        <input type="number" min="0" step="any" class="form-control negrita text-info border-base" id="txtMCDescuento" value="0">
                                    </div>
                                    <div class="form-group mb-2">
                                        <label class="negrita text-secondary small">Importe ${GlobalSignoMoneda}</label>
                                        <input type="number" class="form-control negrita text-danger border-base" id="txtMCTotalPrecioDescuento" disabled>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between mt-2">
                                <button type="button" class="btn btn-secondary btn-xl btn-circle hand shadow" data-dismiss="modal">
                                    <i class="fal fa-arrow-left"></i>
                                </button>
                                <button type="button" class="btn btn-base btn-xl btn-circle hand shadow" id="btnMCGuardar">
                                    <i class="fal fa-check"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        },
        modal_editar_cantidad:()=>{
            return `
            <div class="modal pos2-modal-cantidad pos2-modal" id="modal_pos2_editar_cantidad" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header pos2-panel-head py-2">
                            <h5 class="modal-title negrita text-base mb-0" id="lbCantidadDesprodE">Editar cantidad</h5>
                            <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-3">
                            <div id="container_precio_editar" class="pos2-modal-producto"></div>
                            <div class="row">
                                <div class="col-md-6 col-12">
                                    <div class="form-group mb-2">
                                        <label class="negrita text-secondary small">Cantidad</label>
                                        <input type="number" min="0" step="any" class="form-control negrita text-info border-base" id="txtMCCantidadE">
                                    </div>
                                    <div class="form-group mb-2">
                                        <label class="negrita text-secondary small">Precio ${GlobalSignoMoneda}</label>
                                        <input type="number" min="0" step="any" class="form-control negrita text-info border-base" id="txtMCPrecioE">
                                    </div>
                                    <div class="form-group mb-2">
                                        <label class="negrita text-secondary small">Subtotal ${GlobalSignoMoneda}</label>
                                        <input type="number" class="form-control negrita text-danger border-base" id="txtMCTotalPrecioE" disabled>
                                    </div>
                                </div>
                                <div class="col-md-6 col-12">
                                    <div class="form-group mb-2">
                                        <label class="negrita text-secondary small">Descuento ${GlobalSignoMoneda}</label>
                                        <input type="number" min="0" step="any" class="form-control negrita text-info border-base" id="txtMCDescuentoE" value="0">
                                    </div>
                                    <div class="form-group mb-2">
                                        <label class="negrita text-secondary small">Importe ${GlobalSignoMoneda}</label>
                                        <input type="number" class="form-control negrita text-danger border-base" id="txtMCTotalPrecioDescuentoE" disabled>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between mt-2">
                                <button type="button" class="btn btn-secondary btn-xl btn-circle hand shadow" data-dismiss="modal">
                                    <i class="fal fa-arrow-left"></i>
                                </button>
                                <button type="button" class="btn btn-base btn-xl btn-circle hand shadow" id="btnMCGuardarE">
                                    <i class="fal fa-check"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        },
        documento:()=>{
            return `
            <div class="pos2-doc-tab-pane">
                <div class="pos2-panel-card">
                    <div class="pos2-panel-head">
                        <span class="negrita mb-0"><i class="fal fa-file-invoice mr-1"></i> Configuración del documento</span>
                    </div>
                    <div class="card-body">
                        <div class="pos2-doc-grid">
                            <label class="pos2-doc-cell-lbl">Tipo documento</label>
                            <div class="pos2-doc-cell-val">
                                <select class="form-control" id="cmbTipoDocumento">
                                    <option value="FAC">FACTURAS NORMALES</option>
                                    <option value="FEF">FACTURAS IVA (CONTADO)</option>
                                    <option value="FEC">FACTURAS CAMBIARIAS IVA (CREDITO)</option>
                                </select>
                            </div>
                            <label class="pos2-doc-cell-lbl">Serie / correlativo</label>
                            <div class="pos2-doc-cell-val">
                                <div class="input-group input-group-sm">
                                    <select class="form-control" id="cmbCoddoc"></select>
                                    <input type="number" id="txtCorrelativo" class="form-control negrita" disabled value="0">
                                </div>
                            </div>
                            <label class="pos2-doc-cell-lbl">Caja</label>
                            <div class="pos2-doc-cell-val">
                                <select class="form-control" id="cmbCaja"></select>
                            </div>
                            <label class="pos2-doc-cell-lbl">Vehículo</label>
                            <div class="pos2-doc-cell-val">
                                <select class="form-control" id="cmbVehiculo"></select>
                            </div>
                            <label class="pos2-doc-cell-lbl pos2-doc-span-lbl">Canal venta</label>
                            <div class="pos2-doc-cell-val pos2-doc-span-val">
                                <div class="form-check form-check-inline mb-0">
                                    <input class="form-check-input hand" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="mostrador" checked>
                                    <label class="form-check-label hand text-base" for="inlineRadio1">Mostrador</label>
                                </div>
                                <div class="form-check form-check-inline mb-0">
                                    <input class="form-check-input hand" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="domicilio">
                                    <label class="form-check-label hand text-base" for="inlineRadio2">Domicilio</label>
                                </div>
                                <div class="form-check form-check-inline mb-0">
                                    <input class="form-check-input hand" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="callcenter">
                                    <label class="form-check-label hand text-base" for="inlineRadio3">Call Center</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-base btn-xl btn-bottom-l btn-circle shadow hand" id="btnPosDocumentoAtras" title="Volver al pedido (Ctrl+←)">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        documento_card_cliente:()=>{
            return `
            <div class="pos2-panel-card pos2-doc-compact pos2-card-cliente">
                <div class="pos2-panel-head">
                    <span class="negrita mb-0"><i class="fal fa-user mr-1"></i> Cliente</span>
                </div>
                <div class="card-body">
                            <div class="row mb-2">
                                <div class="col-7 form-group mb-0">
                                    <label>Vendedor</label>
                                    <select class="form-control" id="cmbVendedor"></select>
                                </div>
                                <div class="col-5 form-group mb-0">
                                    <label>Fecha</label>
                                    <input type="date" id="txtFecha" class="form-control negrita">
                                </div>
                            </div>
                            <div class="form-group mb-2">
                                <label>NIT / DPI</label>
                                <div class="input-group">
                                    <input type="text" class="form-control negrita pos2-field-accent" id="txtPosCobroNit">
                                    <div class="input-group-append">
                                        <button type="button" class="btn btn-base text-white hand" id="btnBuscarCliente">
                                            <i class="fal fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group mb-2">
                                <label>Cliente</label>
                                <input type="text" class="form-control negrita pos2-field-accent" id="txtPosCobroNombre">
                            </div>
                            <div class="form-group mb-2">
                                <label>Dirección</label>
                                <input type="text" class="form-control negrita" id="txtPosCobroDireccion">
                            </div>
                            <div class="row align-items-end mb-1">
                                <div class="col-7 form-group mb-0">
                                    <label>Teléfono/s</label>
                                    <input type="text" class="form-control negrita" id="txtPosCobroTelefono">
                                </div>
                                <div class="col-5 form-group mb-0">
                                    <button type="button" class="btn btn-outline-base btn-sm btn-block hand py-1" id="btnNuevoCliente">
                                        <i class="fal fa-plus"></i> Crear
                                    </button>
                                </div>
                            </div>
                            <div class="form-group mb-0">
                                <label>Observaciones</label>
                                <textarea class="form-control negrita" rows="2" id="txtObs" placeholder="Notas..."></textarea>
                            </div>
                            <div class="hidden mb-0">
                                <input disabled type="text" class="" id="txtPosCobroNitclie" autocomplete="off">
                            </div>

                          

                                       


                        </div>
                    </div>
            `   
        },
        modal_lista_clientes:()=>{
            return `
            <div class="modal pos2-modal" id="modal_pos2_lista_clientes" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-left" role="document">
                    <div class="modal-content">
                    
                        <div class="modal-header bg-base">
                        </div>
                        
                        <div class="modal-body p-4">
                            <div class="row">
                                <div class="form-group col-12">
                                    <label class="text-secondary">Búsqueda de Clientes</label>
                                    <div class="input-group">
                                        <input type="search" autocomplete="off" class="form-control border-base negrita" id="txtBuscarClie">
                                        <button class="btn btn-base hand text-white" id="btnBuscarClie">
                                            <i class="fal fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <br>
                            <div class="row">
                                <table class="col-12 table table-responsive table-hover table-border">
                                    <thead class="bg-base text-white">
                                        <tr>
                                            <td>NIT / CÓDIGO</td>
                                            <td>CLIENTE</td>
                                            <td>TELÉFONO</td>
                                            <td>SALDO</td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataClientes"></tbody>
                                </table>
                            </div>
                          
                        </div>
                    </div>
                </div>
            </div>`
        },
        modal_lista_documentos:()=>{
            return `
            <div class="modal pos2-modal" id="modal_pos2_lista_documentos" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-xl modal-dialog-scrollable" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-base text-white">
                            <h5 class="modal-title"><i class="fal fa-folder-open mr-2"></i>Documentos guardados</h5>
                            <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-3">
                            <div class="form-group mb-3">
                                <label class="negrita text-secondary">Filtrar por fecha y tipo</label>
                                <div class="input-group">
                                    <input type="date" class="form-control negrita" id="txtFechaDoc">
                                    <select class="form-control negrita" id="cmbTipoDoc">
                                        <option value="FAC">FACTURAS NORMALES</option>
                                        <option value="FEF">FACTURAS IVA (CONTADO)</option>
                                        <option value="FEC">FACTURAS CAMBIARIAS IVA (CREDITO)</option>
                                    </select>
                                    <div class="input-group-append">
                                        <button type="button" class="btn btn-base" id="btnPos2RefrescarDocs"><i class="fal fa-sync"></i></button>
                                    </div>
                                </div>
                            </div>
                            <p class="small text-secondary mb-2">
                                Use <strong>Editar</strong> para cargar un documento vigente al pedido (se anula el original al confirmar la edición).
                            </p>
                            <div id="tblDocumentos"></div>
                        </div>
                    </div>
                </div>
            </div>`
        }
    }

    root.innerHTML = view.body();

};

function addListeners(){

    document.title = "Punto de Venta";

    F.slideAnimationTabs();

    //REINICIA EL HANDLE DE LA EMPRESA
    //cmbEmpresa.removeEventListener('change', handle_empresa_change)
    //cmbEmpresa.addEventListener('change', handle_empresa_change)



    // LISTENER DE LA VENTANA DE PEDIDOS
    listener_vista_pedido();

    listener_vista_cobro();

    listener_teclado();

    listener_listado_documentos();

    const btnCancelarEdicion = document.getElementById('btnPos2CancelarEdicion');
    if (btnCancelarEdicion) {
        btnCancelarEdicion.addEventListener('click', () => {
            F.Confirmacion('¿Cancelar la edición y limpiar el pedido? (El documento original ya fue anulado.)')
                .then((ok) => {
                    if (ok) {
                        deleteTempVenta_pos(GlobalUsuario)
                            .then(() => {
                                pos2_salirModoEdicion();
                                fcnNuevoPedido();
                                F.showToast('Edición cancelada');
                            })
                            .catch(() => F.AvisoError('No se pudo limpiar el pedido'));
                    }
                });
        });
    }
    
    fcnNuevoPedido();

    //get_tbl_pedido();


    document.getElementById('txtFecha').value = F.getFecha();
    
   
    
    //carga el código vendedor
    get_vendedores();


    //carga las cajas
    get_cajas();
    
    listener_coddoc();

   

    const btnPosDocumentoAtras = document.getElementById('btnPosDocumentoAtras');
    if (btnPosDocumentoAtras) {
        btnPosDocumentoAtras.addEventListener('click', () => {
            document.getElementById('tab-pedido').click();
        });
    }

    const btnPosEscanearBarcode = document.getElementById('btnPosEscanearBarcode');
    if (btnPosEscanearBarcode) {
        btnPosEscanearBarcode.addEventListener('click', () => {
            $('#modal_pos2_barcode').modal('show');
            pos2_iniciarBarcode();
        });
    }
    const modalBarcode = document.getElementById('modal_pos2_barcode');
    if (modalBarcode && modalBarcode.dataset.pos2BarcodeBound !== '1') {
        modalBarcode.dataset.pos2BarcodeBound = '1';
        $(modalBarcode).on('hidden.bs.modal', pos2_detenerBarcode);
    }

    const btnGuardarFactura = document.getElementById('btnGuardarFactura');
    if (btnGuardarFactura) {
        btnGuardarFactura.addEventListener('click', () => {
            F.Confirmacion('¿Está seguro que desea guardar esta venta?')
                .then((value) => {
                    if (value == true) {
                        finalizar_pedido();
                    }
                });
        });
    }


    document.getElementById('txtPosCodprod').focus();

};



function listener_coddoc(){

    let cmbTipoDocumento = document.getElementById('cmbTipoDocumento')
    cmbTipoDocumento.addEventListener('change',()=>{
        get_coddoc(cmbTipoDocumento.value);
    })

    function get_coddoc(tipo){
        let container = document.getElementById('cmbCoddoc');
        container.innerHTML = '';

        axios.post('/tipodocumentos/coddoc',{
            sucursal:GlobalEmpnit,
            tipo:tipo,
            token:TOKEN
        })
        .then((response) => {
            let data = response.data;
            if(Number(data.rowsAffected[0])>0){
                let coddoc = ''
                data.recordset.map((r)=>{
                    coddoc += `<option value="${r.CODDOC}">${r.CODDOC}</option>`
                })        
                container.innerHTML = coddoc;
                get_correlativo(container.value)
                .then((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
                .catch((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})  
            }else{
                container.innerHTML = '';
            }                     
        }, (error) => {
            container.innerHTML = '';
        });
    };

    let cmbCoddoc = document.getElementById('cmbCoddoc');
    cmbCoddoc.addEventListener('change',()=>{
        get_correlativo(cmbCoddoc.value)
        .then((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
        .catch((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
    })

    get_coddoc(cmbTipoDocumento.value);
};

function get_correlativo(coddoc){
      
    return new Promise((resolve,reject)=>{
        axios.post('/tipodocumentos/correlativo',{
            sucursal:GlobalEmpnit,
            coddoc:coddoc,
            token:TOKEN
        })
        .then((response) => {
            let data = response.data;
            if(Number(data.rowsAffected[0])>0){
                let correlativo = '';
                data.recordset.map((r)=>{
                    correlativo = r.CORRELATIVO
                })
                resolve(correlativo);             
            }else{
                reject('0');
            }                     
        }, (error) => {
            reject('0');
        });
    })

};


function listener_teclado(){
    //evitando errores
    Mousetrap.bind('f5', function(e) { e.preventDefault(); });
    Mousetrap.bind('f7', function(e) { e.preventDefault(); });

    Mousetrap.bind('f10', function(e) { e.preventDefault(); });
    Mousetrap.bind('f11', function(e) { e.preventDefault(); });
    Mousetrap.bind('f12', function(e) { e.preventDefault(); });
    
    //evitando errores

    Mousetrap.bind('ctrl+right', function() { document.getElementById('tab-documento').click(); });
    Mousetrap.bind('ctrl+left', function() { document.getElementById('tab-pedido').click(); });
    Mousetrap.bind('ctrl+g', function(e) {
        e.preventDefault();
        const btn = document.getElementById('btnGuardarFactura');
        if (btn) btn.click();
    });

    Mousetrap.bind('f2', function() {
        document.getElementById('tab-pedido').click();
        const inp = document.getElementById('txtPosCodprod');
        if (inp) {
            inp.value = '';
            inp.focus();
        }
    });

    Mousetrap.bind('f3', function(e) {
        e.preventDefault();
        const btn = document.getElementById('btnBuscarCliente');
        if (btn) btn.click();
    });

    Mousetrap.bind('f7', function(e) {
        e.preventDefault(); 
        document.getElementById('btnCobrarFel').click();
    });

    Mousetrap.bind('f8', function(e) {
        e.preventDefault(); 
        document.getElementById('btnCobrarFactura').click();
    });

    Mousetrap.bind('f9', function(e) {
        e.preventDefault(); 
        document.getElementById('btnCobrarCotizacion').click(); 
    });


};

function listener_vista_pedido(){


    document.getElementById('txtFechaDoc').value = F.getFecha();


    let txtPosCodprod = document.getElementById('txtPosCodprod');
    txtPosCodprod.addEventListener('keyup',(e)=>{

        txtPosCodprod.value = txtPosCodprod.value.toUpperCase();
        let filtro = txtPosCodprod.value || '';
        

        if(filtro==''){return;}

        if (e.code === 'Enter') { 
            document.getElementById('btnBuscarProd').click();
            //get_buscar_producto(filtro);
        };

        if (e.code === 13) { 
            document.getElementById('btnBuscarProd').click();
            //get_buscar_producto(filtro);
        };

        //if (e.keyCode === 13 && !e.shiftKey) {
            //get_buscar_producto(filtro);
        //};

    });

    document.getElementById('btnBuscarProd').addEventListener('click',()=>{
        txtPosCodprod.value = txtPosCodprod.value.toUpperCase();
        let filtro = txtPosCodprod.value || '';

        if(filtro==''){return;}

        get_buscar_producto(filtro);
        
    });
    


    //modal cantidad
    let btnMCGuardar = document.getElementById('btnMCGuardar');
    if (!btnMCGuardar) {
        console.error('[POS2] btnMCGuardar no encontrado');
        return;
    }
    btnMCGuardar.addEventListener('click',()=>{

        let cantidad = Number(document.getElementById('txtMCCantidad').value || 1);
        let preciounitario = Number(document.getElementById('txtMCPrecio').value||0);
        let descuento = Number(document.getElementById('txtMCDescuento').value||0);

        if(preciounitario==0){
            F.AvisoError('Precio inválido');
            return;
        };

        if(Number(preciounitario)<Number(Selected_costo)){
            F.AvisoError('Precio menor al costo');
            return;
        };


        const tipoprecio = (data_empresa_config && data_empresa_config.TIPO_PRECIO) ? data_empresa_config.TIPO_PRECIO : '';
        insert_producto_pedido(Selected_codprod,Selected_desprod,Selected_desprod2,Selected_codmedida,Selected_equivale,Selected_costo,preciounitario,cantidad, Selected_exento, Selected_tipoprod, tipoprecio, Selected_existencia,Selected_bono,descuento)
        .then(()=>{
            
            $("#modal_pos2_cantidad").modal('hide');
            $("#modal_pos2_lista_precios").modal('hide');

            F.showToast('Producto agregado ' + Selected_desprod);
            get_tbl_pedido();
            
            document.getElementById('txtPosCodprod').focus();

        })
        .catch(()=>{
            F.AvisoError('No se pudo agregar');
        })

    });

    document.getElementById('txtMCCantidad').addEventListener('input',()=>{
        CalcularTotalPrecio();  
    });
    document.getElementById('txtMCCantidad').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            document.getElementById('txtMCPrecio').focus();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            document.getElementById('txtMCPrecio').focus();
        };  
    });
    document.getElementById('txtMCPrecio').addEventListener('input',()=>{
        CalcularTotalPrecio();  
    });
    document.getElementById('txtMCPrecio').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            document.getElementById('btnMCGuardar').focus();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            document.getElementById('btnMCGuardar').focus();
        };  
    });
    document.getElementById('txtMCDescuento').addEventListener('input', () => {
        CalcularTotalPrecio();
    });

    pos2_bindProductPickClicks();
    pos2_bindPedidoTableActions();

    //modal editar cantidad
    let btnMCGuardarE = document.getElementById('btnMCGuardarE');
    btnMCGuardarE.addEventListener('click',()=>{

        let cantidad = Number(document.getElementById('txtMCCantidadE').value || 1);
        let preciounitario = Number(document.getElementById('txtMCPrecioE').value||0);
        let descuento =Number(document.getElementById('txtMCDescuentoE').value||0);

        if(preciounitario==0){
            F.AvisoError('Precio inválido');
            return;
        };

        if(Number(preciounitario)<Number(Selected_costo)){
            F.AvisoError('Precio menor al costo');
            return;
        };


        let nuevacantidad = Number(cantidad);
        selectDataRowVentaPOS(Number(Selected_id),nuevacantidad,preciounitario,descuento)
        .then(()=>{
            $("#modal_pos2_editar_cantidad").modal('hide');

            F.showToast('Producto agregado ' + Selected_desprod);
            get_tbl_pedido();
            document.getElementById('txtPosCodprod').focus();
        })
        .catch(()=>{
            F.AvisoError('No se pudo agregar');
        })



    });

    document.getElementById('txtMCCantidadE').addEventListener('input',()=>{
        CalcularTotalPrecioEditar();  
    });
    document.getElementById('txtMCCantidadE').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            document.getElementById('txtMCPrecioE').focus();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            document.getElementById('txtMCPrecioE').focus();
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

    document.getElementById('txtMCDescuentoE').addEventListener('input', () => {
        CalcularTotalPrecioEditar();
    });
    document.getElementById('txtMCDescuentoE').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            document.getElementById('btnMCGuardarE').focus();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            document.getElementById('btnMCGuardarE').focus();
        };  
    });



   
    
};

function listener_vista_cobro(){
    
    document.getElementById('txtPosCobroDireccion').value = "CIUDAD";

    document.getElementById('txtPosCobroNit').addEventListener('keyup',(e)=>{
       
        let nit = document.getElementById('txtPosCobroNit').value.toUpperCase();

            if (e.code === 'Enter') {
                fcn_buscar_cliente(nit)
                .then(()=>{
                        
                })
                .catch(()=>{
                    nit = document.getElementById('txtPosCobroNit').value.replace('-','').replace(" ","");
                    F.GetDataNit(nit)
                    .then((json)=>{

                        document.getElementById('txtPosCobroNitclie').value = '';
                        document.getElementById('txtPosCobroNombre').value = json;
                        document.getElementById('txtPosCobroDireccion').value = "CIUDAD";
                        document.getElementById('txtPosCobroNombre').focus();
                    })
                })
            };
            if (e.keyCode === 13 && !e.shiftKey) {
                fcn_buscar_cliente(nit)
                .then(()=>{
                        
                })
                .catch(()=>{
                    nit = document.getElementById('txtPosCobroNit').value.replace('-','').replace(" ","");
                    F.GetDataNit(nit)
                    .then((json)=>{
                        document.getElementById('txtPosCobroNitclie').value = '';
                        document.getElementById('txtPosCobroNombre').value = json;
                        document.getElementById('txtPosCobroDireccion').value = "CIUDAD";
                        document.getElementById('txtPosCobroNombre').focus();
                    })
                })
            };
     

    });



    //busqueda de cliente
    document.getElementById('btnBuscarCliente').addEventListener('click',()=>{
        
        $("#modal_pos2_lista_clientes").modal('show');
        
        document.getElementById('tblDataClientes').innerHTML = '';
        document.getElementById('txtBuscarClie').value = '';
        document.getElementById('txtBuscarClie').focus();

    });

    document.getElementById('txtBuscarClie').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            document.getElementById('btnBuscarClie').click();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            document.getElementById('btnBuscarClie').click();
        };  
    });

    document.getElementById('btnBuscarClie').addEventListener('click',(e)=>{  
        let filtro = document.getElementById('txtBuscarClie').value || '';
        tbl_clientes(filtro);
    });


    let btnNuevoCliente = document.getElementById('btnNuevoCliente');
    btnNuevoCliente.addEventListener('click',()=>{

            let nit = document.getElementById('txtPosCobroNit').value || 'CF';
            let nombre = document.getElementById('txtPosCobroNombre').value || 'SN';
            let direccion = document.getElementById('txtPosCobroDireccion').value || 'CIUDAD';
            let telefono = document.getElementById('txtPosCobroTelefono').value || '';

            if(nombre=='SN'){
                F.AvisoError('Nombre de cliente no es válido');
                return;
            }

            F.Confirmacion('¿Está seguro que desea crear este nuevo cliente?')
            .then((value)=>{
                if(value==true){
                    btnNuevoCliente.disabled = true;
                    btnNuevoCliente.innerHTML = get_button_loader('Creando cliente nuevo')

                    insert_cliente(nit,nombre,direccion, telefono)
                    .then((data)=>{

                        let codcli = ''
                        data.recordset.map((r)=>{
                            codcli = r.Current_Identity.toString();
                        })
                        document.getElementById('txtPosCobroNitclie').value = codcli;

                        F.Aviso('Cliente creado exitosamente!!');
                        btnNuevoCliente.disabled = false;
                        btnNuevoCliente.innerHTML = `<i class="fal fa-plus"></i> Crear Nuevo cliente`;
                    })
                    .catch(()=>{
                        F.AvisoError('No se pudo crear el cliente nuevo');
                        btnNuevoCliente.disabled = false;
                        btnNuevoCliente.innerHTML = `<i class="fal fa-plus"></i> Crear Nuevo cliente`;
                    })
        
                }
            })
   


    })


    let cmbVehiculo = document.getElementById('cmbVehiculo');
    GF.data_vehiculos(GlobalEmpnit)
    .then((data)=>{
        let str = `<option value='0'>NINGUNO</option>`;


    })
    .catch(()=>{

    })

};



function listener_listado_documentos(){

    let btnListadoDocumentos = document.getElementById('btnListadoDocumentos');
    btnListadoDocumentos.addEventListener('click',()=>{
        $("#modal_pos2_lista_documentos").modal('show');
        tbl_lista_documentos();
    });

    document.getElementById('txtFechaDoc').addEventListener('change',()=>{
        tbl_lista_documentos();
    });
    document.getElementById('cmbTipoDoc').addEventListener('change',()=>{
        tbl_lista_documentos();
    });

    const btnRefrescar = document.getElementById('btnPos2RefrescarDocs');
    if (btnRefrescar) {
        btnRefrescar.addEventListener('click', () => tbl_lista_documentos());
    }

    const tblDocs = document.getElementById('tblDocumentos');
    if (tblDocs) {
        tblDocs.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-pos2-edit]');
            if (!btn) return;
            cargarPedidoEdicion(
                btn.dataset.codclie,
                btn.dataset.nit,
                btn.dataset.nombre,
                btn.dataset.direccion,
                btn.dataset.coddoc,
                btn.dataset.correlativo
            );
        });
    }

};

function destroyView() {
    pos2_detenerBarcode();
    try {
        $('#modal_pos2_cantidad, #modal_pos2_editar_cantidad, #modal_pos2_lista_precios, #modal_pos2_lista_documentos, #modal_pos2_lista_clientes, #modal_pos2_barcode').modal('hide');
    } catch (e) { /* sin modal activo */ }
    ['modal_pos2_cantidad', 'modal_pos2_editar_cantidad', 'modal_pos2_lista_precios', 'modal_pos2_lista_documentos', 'modal_pos2_lista_clientes', 'modal_pos2_barcode'].forEach((id) => {
        document.querySelectorAll('#' + id).forEach((el) => {
            const $el = $(el);
            if ($el.data('bs.modal')) {
                $el.modal('dispose');
            }
            el.remove();
        });
    });
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
    if (typeof Mousetrap !== 'undefined' && typeof Mousetrap.reset === 'function') {
        Mousetrap.reset();
    }
    Pos2ModoEdicion = { activo: false, coddoc: '', correlativo: '' };
    Pos2ProductosBusqueda = [];
}

function initView(){
    Pos2ModoEdicion = { activo: false, coddoc: '', correlativo: '' };
    Pos2ProductosBusqueda = [];
    getView();
    pos2_moverModalesABody();
    pos2_prepararModalesSinAnimacion();
    pos2_bindProductPickClicks();
    pos2_bindPedidoTableActions();
    addListeners();
};

function get_vendedores(){
    GF.get_data_empleados_tipo(3)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>`
        });
        document.getElementById('cmbVendedor').innerHTML = str;
    })
    .catch(()=>{
        F.AvisoError('No se cargaron los vendedores');
        document.getElementById('cmbVendedor').innerHTML ='<option value="1">SIN VENDEDOR</option>';
    })
};

function get_cajas(){

    GF.get_data_cajas()
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

};


function tbl_clientes(filtro){
   
    if(filtro==''){
        F.AvisoError('Escriba un nombre o nit válidos');
        document.getElementById('txtBuscarClie').focus(); 
        return;
    };


    let container = document.getElementById('tblDataClientes');
    container.innerHTML = GlobalLoader;

    let str = '';

    axios.post('/clientes/buscar_cliente', {
        token:TOKEN,
        sucursal: GlobalEmpnit,
        filtro:filtro
    })
    .then((response) => {        
        if(response.data=='error'){
            F.AvisoError('Error en la solicitud');
            container.innerHTML = 'No day datos....';
        }else{
            const data = response.data.recordset;
            data.map((r)=>{
                str += `
                <tr class="hand" onclick="get_datos_cliente('${r.CODCLIENTE}','${r.NIT}','${r.NOMBRE}','${r.DIRECCION}','${r.TELEFONO}')">    
                    <td>
                        ${r.NIT} / ${r.CODCLIENTE}
                    </td>
                    <td>
                        ${r.NOMBRE}
                        <br>
                        <small>${r.DIRECCION}</small>
                    </td>
                     <td>${r.TELEFONO}</td>
                    <td>${F.setMoneda(r.SALDO,'Q')}</td>
                </tr>
                `
            })
            container.innerHTML = str;
        }
    }, (error) => {
        F.AvisoError('Error en la solicitud');
        container.innerHTML = 'No day datos....';
    });



};

function insert_cliente(nit,nombre,direccion,telefono){

    return new Promise((resolve,reject)=>{
        axios.post('/clientes/insert_cliente',{
            fecha:F.getFecha(),
            sucursal: GlobalEmpnit,
            nit: nit,
            nombre: nombre,
            direccion: direccion,
            coddepto: '1',
            codmunicipio: '1',
            telefono: telefono,
            email: 'SN',
            lat: '0',
            long: '0'
        })
        .then((response) => {
            let data = response.data;
            if(Number(data.rowsAffected[0])>0){
                resolve(data);             
            }else{
                reject();
            }                     
        }, (error) => {
            reject();
        });
    })

};

function fcn_buscar_cliente(nit){
   
    return new Promise((resolve, reject)=>{
        if(nit==''){
            F.AvisoError('Escriba un nombre o nit válidos');
            reject();
            return;
        };
    
        axios.post('/pos/buscar_cliente_nit', {
            sucursal: GlobalEmpnit,
            nit:nit
        })
        .then((response) => {        
            if(response=='error'){
                F.AvisoError('Error en la solicitud');
                reject();
            }else{
                const data = response.data.recordset;
                if(response.data.rowsAffected[0].toString()=='0'){
                    reject();
                    return;
                }
                data.map((r)=>{
                    document.getElementById('txtPosCobroNit').value = r.NIT;
                    document.getElementById('txtPosCobroNitclie').value = r.NITCLIE;
                    document.getElementById('txtPosCobroNombre').value = r.NOMCLIE;
                    document.getElementById('txtPosCobroDireccion').value = r.DIRCLIE;
                })
                resolve();
            }
        }, (error) => {
            F.AvisoError('Error en la solicitud');
            reject();
        });
    
    })
    


};

function get_datos_cliente(nitclie,nit,nomclie,dirclie,telefono){

    $("#modal_pos2_lista_clientes").modal('hide');

    document.getElementById('txtPosCobroNit').value = nit;
    document.getElementById('txtPosCobroNitclie').value = nitclie;
    document.getElementById('txtPosCobroNombre').value = nomclie;
    document.getElementById('txtPosCobroDireccion').value = dirclie;
    document.getElementById('txtPosCobroTelefono').value = telefono;
    

};

function CalcularTotalPrecio(){
    const modal = document.getElementById('modal_pos2_cantidad');
    if (!modal) return;
    const txtCant = modal.querySelector('#txtMCCantidad');
    const txtPrecio = modal.querySelector('#txtMCPrecio');
    const txtSub = modal.querySelector('#txtMCTotalPrecio');
    if (!txtCant || !txtPrecio || !txtSub) return;
    let cantidad = txtCant.value || 1;
    let precio = txtPrecio.value;
    let subtotal = Number(cantidad) * Number(precio);
    txtSub.value = subtotal;
    calcular_descuento('txtMCDescuento', 'txtMCTotalPrecio', 'txtMCTotalPrecioDescuento');
};

function CalcularTotalPrecioEditar(){
    const txtCant = document.getElementById('txtMCCantidadE');
    const txtPrecio = document.getElementById('txtMCPrecioE');
    const txtSub = document.getElementById('txtMCTotalPrecioE');
    if (!txtCant || !txtPrecio || !txtSub) return;
    const cantidad = txtCant.value || 1;
    const precio = txtPrecio.value;
    txtSub.value = Number(cantidad) * Number(precio);
    calcular_descuento('txtMCDescuentoE', 'txtMCTotalPrecioE', 'txtMCTotalPrecioDescuentoE');
};

function get_buscar_producto(filtro){

    try {
    const tblProductos = document.getElementById('tblDataProductos');
    if (!tblProductos) {
        F.AvisoError('Tabla de productos no disponible');
        return;
    }

    const tipoprecio = (data_empresa_config && data_empresa_config.TIPO_PRECIO) ? data_empresa_config.TIPO_PRECIO : '';

    $('#modal_pos2_cantidad, #modal_pos2_editar_cantidad').modal('hide');

    tblProductos.innerHTML = GlobalLoader;

    const btnBuscar = document.getElementById('btnBuscarProd');
    if (btnBuscar) {
        btnBuscar.innerHTML = '<i class="fal fa-sync fa-spin"></i>';
        btnBuscar.disabled = true;
    }

    let str = '';

    $('#modal_pos2_lista_precios').modal('show');

    axios.post('/pos/productos_filtro', {
        sucursal: GlobalEmpnit,
        token:TOKEN,
        filtro:filtro,
        tipoprecio:tipoprecio
    })
    .then((response) => {        
        if(response=='error'){
            F.AvisoError('Error en la solicitud');
            tblProductos.innerHTML = 'No day datos....';
        }else{
            const data = response.data.recordset;
            Pos2ProductosBusqueda = data;
            data.map((r, idx)=>{
                let strClassIps = '';
                if(String(r.BONO || 0) !== '0'){ strClassIps = 'negrita text-base'; }
                let strClassExistencia = '';
                let existencia = Number(r.EXISTENCIA);
                if(existencia<=0){strClassExistencia='bg-danger text-white'};

                str += `
                    <tr class="hand" data-pos2-pick="${idx}">
                        <td>${r.DESMARCA}</td>
                        <td><b style="color:${r.COLOR}">${r.DESPROD}</b>
                            <br>
                            <small class="negrita text-danger">Cód:${r.CODPROD}</small>
                        </td>
                        <td>${r.DESPROD2}</td>
                        <td>${r.CODMEDIDA} (Eq:${r.EQUIVALE})</td>
                        <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                        <td class="${strClassExistencia}">${r.EXISTENCIA}</td>
                        <td class='${strClassIps}'>${F.setMoneda(r.BONO,'Q')}</td>
                        <td>${r.TIPOPROD}</td>
                    </tr>
                `
            })
            tblProductos.innerHTML = str;
            
            if (btnBuscar) {
                btnBuscar.innerHTML = '<i class="fal fa-search"></i>';
                btnBuscar.disabled = false;
            }

            //getMoveTable();
        }
    }, (error) => {
        F.AvisoError('Error en la solicitud');
        tblProductos.innerHTML = 'No day datos....';
        if (btnBuscar) {
            btnBuscar.innerHTML = '<i class="fal fa-search"></i>';
            btnBuscar.disabled = false;
        }
    });

    } catch (err) {
        console.error('[POS2] get_buscar_producto', err);
        F.AvisoError('Error al buscar producto');
        const btnBuscar = document.getElementById('btnBuscarProd');
        if (btnBuscar) {
            btnBuscar.innerHTML = '<i class="fal fa-search"></i>';
            btnBuscar.disabled = false;
        }
    }

};





function getMoveTable(){

    return;

        let start = document.getElementById('first-element');
        start.focus();
        start.style.backgroundColor = '#50b988';
        start.style.color = 'white';

        const changeStyle = (sibling) => {
            if (sibling !== null) {
                start.focus();
                start.style.backgroundColor = '';
                start.style.color = '';
                sibling.focus();
                sibling.style.backgroundColor = '#50b988';
                sibling.style.color = 'white';
                start = sibling;
            }
        };

        const checkKey = (event) => {
            event = event || window.event;
            const idx = start.cellIndex;

            if (event.keyCode === 38) {
                // up arrow
                const previousSibling = start.previousElementSibling;
                changeStyle(previousSibling);
                
                //const previousRow = start.parentElement.previousElementSibling;
                //if (previousRow !== null) {
                //const previousSibling = previousRow.cells[idx];
                //changeStyle(previousSibling);
                //}

            } else if (event.keyCode === 40) {
                // down arrow
                const nextsibling = start.nextElementSibling;
                changeStyle(nextsibling);
                
                //const nextRow = start.parentElement.nextElementSibling;
                //if (nextRow !== null) {
                //const nextSibling = nextRow.cells[idx];
                //changeStyle(nextSibling); 
                //}

            } else if (event.keyCode === 37) {
                // left arrow
                //const previousSibling = start.previousElementSibling;
                //changeStyle(previousSibling);
            } else if (event.keyCode === 39) {
                // right arrow
                
                //const nextsibling = start.nextElementSibling;
                //changeStyle(nextsibling);
                
                
                console.log(start.onclick());

            }
        };

        document.onkeydown = checkKey;

};

function get_tbl_productos_clasificacion(codigo){

    let container = document.getElementById('tblPosProductosCategoria');
    container.innerHTML = GlobalLoader;

    let str = '';

    axios.post('/pos/productos_categoria', {
        sucursal: GlobalEmpnit,
        codigo:codigo
    })
    .then((response) => {        
        if(response=='error'){
            F.AvisoError('Error en la solicitud');
            container.innerHTML = 'No day datos....';
        }else{
            const data = response.data.recordset;
            data.map((r)=>{
                str += `
                <tr class="hand border-secondary border-top-0 border-left-0 border-right-0" onclick="get_data_producto_categoria('${r.CODPROD}','${r.DESPROD}','${r.CODMEDIDA}','${r.EQUIVALE}','${r.COSTO}','${r.PRECIO}')">
                    <td>
                        ${F.limpiarTexto(r.DESPROD)}
                        <br>
                        <small>Código: <b class="text-danger">${r.CODPROD}</b></small>
                        <br>
                        <small>Marca: <b class="text-secondary">${r.DESMARCA}</b></small>
                    </td>
                    <td>
                        ${r.CODMEDIDA} 
                        <br>
                        <small>Equivale: <b class="text-danger">${r.EQUIVALE}</b></small>
                    </td>
                    <td><b class="h4">${F.setMoneda(r.PRECIO ||0,'Q')}</b></td>
                </tr>
                `
            })
            container.innerHTML = str;
        }
    }, (error) => {
        F.AvisoError('Error en la solicitud');
        container.innerHTML = 'No day datos....';
    });


};


function pos2_llenarModalCantidad(r) {
    const modal = document.getElementById('modal_pos2_cantidad');
    if (!modal) {
        console.error('[POS2] modal_pos2_cantidad no existe en el DOM');
        return false;
    }

    const codprod = r.CODPROD;
    const desprod = r.DESPROD || '';
    const desprod2 = r.DESPROD2 || '';
    const codmedida = r.CODMEDIDA || '';
    const equivale = Number(r.EQUIVALE) || 1;
    const costo = Number(r.COSTO) || 0;
    const precio = Number(r.PRECIO) || 0;
    const tipoprod = r.TIPOPROD || '';
    const exento = Number(r.EXENTO) || 0;
    const existencia = Number(r.EXISTENCIA) || 0;
    const bono = Number(r.BONO) || 0;

    Selected_codprod = codprod;
    Selected_desprod = desprod;
    Selected_desprod2 = desprod2;
    Selected_codmedida = codmedida;
    Selected_equivale = equivale;
    Selected_costo = costo;
    Selected_precio = precio;
    Selected_tipoprod = tipoprod;
    Selected_exento = exento;
    Selected_existencia = existencia;
    Selected_bono = bono;

    const lb = modal.querySelector('#lbCantidadDesprod');
    const container = modal.querySelector('#container_precio');
    const txtCant = modal.querySelector('#txtMCCantidad');
    const txtPrecio = modal.querySelector('#txtMCPrecio');
    const txtDesc = modal.querySelector('#txtMCDescuento');
    const btnGuardar = modal.querySelector('#btnMCGuardar');

    if (!txtCant || !txtPrecio || !btnGuardar) {
        console.error('[POS2] Campos del modal de cantidad no encontrados');
        return false;
    }

    if (lb) lb.textContent = `${desprod} (${codmedida} · Eq: ${equivale})`;

    if (container) {
        container.innerHTML = `
            <div><b class="text-danger">${codprod}</b> · ${F.limpiarTexto(desprod)}</div>
            <div class="text-secondary small">${F.limpiarTexto(desprod2)} · ${codmedida}</div>
            <div class="mt-1">Precio lista: <b>${F.setMoneda(precio, 'Q')}</b> · Existencia: <b>${existencia}</b> · Costo: ${F.setMoneda(costo, 'Q')}</div>
        `;
    }

    txtCant.value = '1';
    txtPrecio.value = precio;
    if (txtDesc) txtDesc.value = '0';
    const txtCod = document.getElementById('txtPosCodprod');
    if (txtCod) txtCod.value = '';
    btnGuardar.disabled = false;

    CalcularTotalPrecio();
    return true;
}

function pos2_abrirModalCantidadDesdeBusqueda(idx) {
    const r = Pos2ProductosBusqueda[idx];
    if (!r) {
        F.AvisoError('Producto no encontrado');
        return;
    }

    if (!pos2_llenarModalCantidad(r)) {
        F.AvisoError('No se pudo cargar el producto en el modal');
        return;
    }

    const listaEl = document.getElementById('modal_pos2_lista_precios');
    const cantidadEl = document.getElementById('modal_pos2_cantidad');
    if (!cantidadEl) {
        F.AvisoError('Modal de cantidad no disponible');
        return;
    }

    const $cantidad = $(cantidadEl);
    const enfocarCantidad = () => {
        const inp = cantidadEl.querySelector('#txtMCCantidad');
        if (inp) {
            inp.focus();
            inp.select();
        }
    };

    const abrirCantidad = () => {
        $cantidad.off('shown.bs.modal.pos2cant').one('shown.bs.modal.pos2cant', enfocarCantidad);
        $cantidad.modal('show');
        if (cantidadEl.classList.contains('show')) {
            setTimeout(enfocarCantidad, 0);
        }
    };

    if (listaEl && listaEl.classList.contains('show')) {
        $(listaEl).one('hidden.bs.modal.pos2pick', abrirCantidad);
        $(listaEl).modal('hide');
        setTimeout(() => {
            if (!cantidadEl.classList.contains('show')) {
                $(listaEl).off('hidden.bs.modal.pos2pick');
                abrirCantidad();
            }
        }, 120);
    } else {
        abrirCantidad();
    }
}

/** Compatibilidad con onclick legacy */
function get_producto(codprod, desprod, desprod2, codmedida, equivale, costo, precio, tipoprod, exento, existencia, bono) {
    const r = {
        CODPROD: codprod,
        DESPROD: desprod,
        DESPROD2: desprod2,
        CODMEDIDA: codmedida,
        EQUIVALE: equivale,
        COSTO: costo,
        PRECIO: precio,
        TIPOPROD: tipoprod,
        EXENTO: exento,
        EXISTENCIA: existencia,
        BONO: bono
    };
    if (!pos2_llenarModalCantidad(r)) return;
    $('#modal_pos2_cantidad').modal('show');
}

function get_datos_precio(codprod,codmedida){

    return new Promise((resolve,reject)=>{

        axios.post('/pos/productos_precio', {
            sucursal: GlobalEmpnit,
            token:TOKEN,
            codprod:codprod,
            codmedida:codmedida
        })
        .then((response) => {
            if(response=='error'){
                F.AvisoError('Error en la solicitud');
            }else{
                const data = response.data;
                resolve(data);
            }
        }, (error) => {
            F.AvisoError('Error en la solicitud');
        });

    })

};


function calcular_descuento(idDescuento,idTotalPrecio,idTotalPrecioDescuento){

    try {
        let descuento = Number(document.getElementById(idDescuento).value || 0) ;
        let totalprecio = Number(document.getElementById(idTotalPrecio).value || 0);
        document.getElementById(idTotalPrecioDescuento).value = (totalprecio - descuento) 

    } catch (error) {
        document.getElementById(idTotalPrecioDescuento).value = totalprecio;
    }

};


function insert_producto_pedido(codprod,desprod,desprod2,codmedida,equivale,costo,precio,cantidad,exento,tipoprod,tipoprecio,existencia,bono,descuento){
    
    let datos = 
        {
            CODSUCURSAL:GlobalEmpnit.toString(),
            EMPNIT:GlobalEmpnit.toString(),
            USUARIO:'',
            CODPROD:codprod.toString(),
            DESPROD:desprod.toString(),
            DESPROD2:desprod2.toString(),
            CODMEDIDA:codmedida.toString(),
            EQUIVALE:Number(equivale),
            COSTO:Number(costo),
            TOTALCOSTO:Number(costo)*Number(cantidad),
            PRECIO:Number(precio),
            CANTIDAD:Number(cantidad),
            TOTALUNIDADES:Number(cantidad * equivale),
            TOTALPRECIO:Number(precio)*Number(cantidad),
            EXENTO:Number(exento),
            TIPOPROD:tipoprod,
            TIPOPRECIO:tipoprecio,
            EXISTENCIA:Number(existencia),
            BONO:Number(bono),
            DESCUENTO:Number(descuento)
        };

    

    return new Promise((resolve,reject)=>{
        insertTempVentasPOS(datos)
        .then(()=>{
            resolve();
        }) 
        .catch(()=>{
            reject();
        }) 
    });

};

function get_tbl_pedido(){

    let container = document.getElementById('tblPosPedido');
    container.innerHTML = GlobalLoader;

    let str = '';
    let varTotalItems = 0;
    let varTotalVenta = 0;
    let varTotalCosto = 0;
    let varTotalDescuento = 0;

    selectTempVentasPOS(GlobalEmpnit)
    .then((data)=>{
        let datos = data.map((rows)=>{
            varTotalItems += 1;
            varTotalVenta = varTotalVenta + Number(rows.TOTALPRECIO);
            varTotalCosto = varTotalCosto + Number(rows.TOTALCOSTO);
            varTotalDescuento += Number(rows.DESCUENTO);
            return `
            <tr class="border-base border-left-0 border-right-0 border-top-0">
                <td class="text-left">
                    ${rows.DESPROD}
                    <br>
                    <div class="row">
                        <div class="col-6">
                            <small class="negrita"><b>${rows.CODPROD}</b></small>
                        </div>
                    </div>
                </td>
                <td>${rows.DESPROD2}</td>
                <td>
                    ${rows.CODMEDIDA} (eq: ${rows.EQUIVALE})
                </td>
                <td>
                    <b class="text-info" style="font-size:140%">${rows.CANTIDAD}</b>
                </td>
                <td class="negrita">${F.setMoneda(rows.PRECIO,'Q')}</td>
                <td class="negrita h4">${F.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                <td class="negrita" style="color:var(--pos2-muted)">${F.setMoneda(rows.DESCUENTO,'Q')}</td>
                <td class="negrita pos2-field-accent">${F.setMoneda((Number(rows.TOTALPRECIO)-Number(rows.DESCUENTO)),'Q')}</td>

                <td>
                    <button class="btn btn-md btn-circle btn-info shadow hand" onclick="edit_item_pedido('${rows.ID}','${rows.CODPROD}','${rows.DESPROD}','${rows.CODMEDIDA}','${rows.EQUIVALE}','${rows.CANTIDAD}','${rows.COSTO}','${rows.PRECIO}','${rows.TIPOPROD}','${rows.EXENTO}','${rows.EXISTENCIA}','${rows.BONO}','${rows.DESCUENTO}')">
                        <i class="fal fa-edit"></i>
                    </button>
                </td> 
                <td>
                    <button type="button" class="btn btn-md btn-circle btn-danger shadow hand" data-pos2-del-id="${rows.ID}">
                        <i class="fal fa-trash"></i>
                    </button>
                </td>                            
            </tr>`
       }).join('\n');
        container.innerHTML = datos;

        GlobalTotalCostoDocumento = varTotalCosto;
        GlobalTotalDocumento = varTotalVenta;
        GlobalTotalDescuento = varTotalDescuento;

        document.getElementById('lbTotalItems').innerText = varTotalItems.toString() + ' items';
        document.getElementById('lbTotalVenta').innerText = F.setMoneda(varTotalVenta,'Q');
        document.getElementById('lbTotalDescuento').innerText = `- ${F.setMoneda(varTotalDescuento,'Q')}` ;
        document.getElementById('lbTotalVentaDescuento').innerText = F.setMoneda((varTotalVenta-varTotalDescuento),'Q');
        
        document.getElementById('lbPosCobroTotalPagar').innerText = F.setMoneda((varTotalVenta-varTotalDescuento),'Q');
    })
    .catch((error)=>{
        
        console.log(error)
        container.innerHTML = 'No hay datos...';
        GlobalTotalCostoDocumento = 0;
        GlobalTotalDocumento = 0;
        GlobalTotalDescuento = 0;

        document.getElementById('lbTotalItems').innerText = '---';
        document.getElementById('lbTotalVenta').innerText = 
        document.getElementById('lbTotalDescuento').innerText = '---';
        document.getElementById('lbTotalVentaDescuento').innerText = '---';
        document.getElementById('lbPosCobroTotalPagar').innerText = '---';
    })


};

function edit_item_pedido(id,codprod,desprod,codmedida,equivale,cantidad,costo,precio,tipoprod,exento,existencia,bono,descuento){

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

    const lb = document.getElementById('lbCantidadDesprodE');
    if (lb) lb.textContent = `${desprod} (${codmedida} · Eq: ${equivale})`;

    const container = document.getElementById('container_precio_editar');
    if (container) {
        container.innerHTML = `
            <div><b class="text-danger">${codprod}</b> · ${F.limpiarTexto(desprod)}</div>
            <div class="text-secondary small">${codmedida} (Eq: ${equivale})</div>
            <div class="mt-1">Precio: <b>${F.setMoneda(precio, 'Q')}</b> · Existencia: <b>${existencia}</b> · Costo: ${F.setMoneda(costo, 'Q')}</div>
        `;
    }

    document.getElementById('txtMCCantidadE').value = cantidad;
    document.getElementById('txtMCPrecioE').value = precio;
    document.getElementById('txtMCDescuentoE').value = descuento;

    CalcularTotalPrecioEditar();

    $("#modal_pos2_editar_cantidad").modal('show');

    document.getElementById('txtMCCantidadE').focus();
};

function delete_item_pedido(id){

    const itemId = Number(id);
    if (!id || Number.isNaN(itemId)) {
        F.AvisoError('No se identificó el ítem a eliminar');
        return;
    }

    try {
        $('#modal_pos2_cantidad, #modal_pos2_editar_cantidad, #modal_pos2_lista_precios').modal('hide');
    } catch (e) { /* sin modal abierto */ }

    F.Confirmacion('¿Está seguro que desea quitar este item?')
    .then((value)=>{
        if (value !== true) return;

        deleteItemVentaPOS(itemId)
            .then(()=>{
                F.showToast('Item eliminado');
                get_tbl_pedido();
            })
            .catch(()=>{
                F.AvisoError('No se pudo quitar este item');
            });
    });
    
}

window.delete_item_pedido = delete_item_pedido;
window.edit_item_pedido = edit_item_pedido;

function get_coddoc(tipo){
    return new Promise((resolve, reject)=>{
        axios.post('/tipodocumentos/series_doc', {
            sucursal: GlobalEmpnit,
            tipo:tipo
        })
        .then((response) => {
            if(response=='error'){
                F.AvisoError('Error en la solicitud');
            }else{
                const data = response.data;
                resolve(data);
            }
        }, (error) => {
            F.AvisoError('Error en la solicitud');
        });
    })
};

function get_correlativo_coddoc(coddoc){
    return new Promise((resolve, reject)=>{
        axios.post('/tipodocumentos/correlativo_doc', {
            sucursal: GlobalEmpnit,
            coddoc:coddoc
        })
        .then((response) => {
            if(response=='error'){
                resolve('         0')
            }else{
                let correlativo = '';
                const data = response.data;
                data.recordset.map((r)=>{
                    correlativo = r.CORRELATIVO;
                })
                resolve(correlativo);
            }
        }, (error) => {
            resolve('         0')
        });
    })
};



function finalizar_pedido(){

    
    let codcliente = document.getElementById('txtPosCobroNitclie').value || ''; //GlobalSelectedCodCliente;
    if(codcliente==''){
        F.AvisoError('Seleccione un cliente');
        return;
    };

    let nit = document.getElementById('txtPosCobroNit').value || 'CF';
    let ClienteNombre = document.getElementById('txtPosCobroNombre').value;
    GlobalSelectedNomCliente = ClienteNombre;
    let dirclie = document.getElementById('txtPosCobroDireccion').value;
    GlobalSelectedDirCliente = dirclie;
    let obsEl = document.getElementById('txtObs');
    let obs = obsEl && obsEl.value.trim() ? obsEl.value.trim() : 'SN';
    let direntrega = "SN"; 
    let codbodega = GlobalCodBodega;
    let cmbTipoEntrega = ''; 
    
    let txtFecha = new Date(document.getElementById('txtFecha').value);
    let anio = txtFecha.getFullYear();
    let mes = txtFecha.getUTCMonth()+1;
    let dia = txtFecha.getUTCDate() 
    let fecha = F.devuelveFecha('txtFecha'); //F.getFecha() //anio + '-' + mes + '-' + d; 
    
    let hora = F.getHora();

    let coddoc = document.getElementById('cmbCoddoc').value;
    let correlativoDoc = document.getElementById('txtCorrelativo').value;

    let cmbCaja = document.getElementById('cmbCaja');
    let cmbVendedor = document.getElementById('cmbVendedor');

    let latdoc = '0';
    let longdoc = '0';

    let tipo_pago = 'CON'; 
    let tipo_doc = '';
    
    let var_mostrador = document.getElementById('inlineRadio1').checked.toString();
    let var_domicilio = document.getElementById('inlineRadio2').checked.toString();
    let var_callcenter = document.getElementById('inlineRadio3').checked.toString();
    if(var_mostrador=="true"){tipo_doc='MOSTRADOR'};
    if(var_domicilio=="true"){tipo_doc='DOMICILIO'};
    if(var_callcenter=="true"){tipo_doc='CALLCENTER'};


    let entrega_contacto = ClienteNombre;
    let entrega_telefono = ''; 
    let entrega_direccion = ''; 
    let entrega_referencia = ''; 
    let entrega_lat = '0';
    let entrega_long = '0';

    let btnGuardarFactura = document.getElementById('btnGuardarFactura');
    
    get_tbl_pedido();

        //VERIFICACIONES
    if(Number(GlobalTotalDocumento)==0){F.AvisoError('No hay productos agregados');return;}
    
    btnGuardarFactura.disabled = true;
                    btnGuardarFactura.innerHTML = `<i class="fal fa-save fa-spin mr-1"></i> Guardando...`;

        gettempDocproductos_pos(GlobalUsuario)
        .then((response)=>{
            axios.post('/pos/insertventa', {
                jsondocproductos:JSON.stringify(response),
                sucursal:GlobalEmpnit,
                coddoc:coddoc,
                correlativo: correlativoDoc,
                anio:anio,
                mes:mes,
                fecha:fecha,
                fechaentrega:fecha,
                formaentrega:cmbTipoEntrega,
                codbodega:codbodega,
                codcaja:cmbCaja.value,
                codcliente: codcliente, //x
                nomclie:ClienteNombre,
                totalcosto:GlobalTotalCostoDocumento,
                totalprecio:GlobalTotalDocumento,
                totaldescuento:GlobalTotalDescuento,
                nitclie:nit,
                dirclie:dirclie,
                obs: obs,
                direntrega:direntrega,
                usuario:GlobalUsuario,
                codven:cmbVendedor.value,
                lat:latdoc,
                long:longdoc,
                hora:hora,
                tipo_pago:tipo_pago,
                tipo_doc:tipo_doc,
                entrega_contacto:entrega_contacto,
                entrega_telefono:entrega_telefono,
                entrega_direccion:entrega_direccion,
                entrega_referencia:entrega_referencia,
                entrega_lat:entrega_lat,
                entrega_long:entrega_long,
                iva:GlobalConfigIVA
            })
            .then((response) => {
                const data = response.data;
                if (data=='error'){
                    F.AvisoError('No se pudo guardar');
                    btnGuardarFactura.disabled = false;
                    btnGuardarFactura.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar venta`;
                }else{
                    const msg = Pos2ModoEdicion.activo
                        ? `Venta reemplazada. Documento anterior ${Pos2ModoEdicion.coddoc}-${Pos2ModoEdicion.correlativo} anulado.`
                        : 'Generado exitosamente';
                    F.Aviso(msg);
                    btnGuardarFactura.disabled = false;
                    btnGuardarFactura.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar venta`;

                    deleteTempVenta_pos(GlobalUsuario);

                    fcnNuevoPedido();
                }
            }, (error) => {
                console.log(error);
                F.AvisoError('No se pudo guardar');
                btnGuardarFactura.disabled = false;
                btnGuardarFactura.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar venta`;
            });        
        })
        .catch((error)=>{
            console.log(error);
            F.AvisoError('No se pudo guardar');
            btnGuardarFactura.disabled = false;
            btnGuardarFactura.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar venta`;
        })

            
};



function fcnNuevoPedido(){
  
        GlobalTotalDocumento =0;
        GlobalTotalDescuento =0;
        GlobalTotalCostoDocumento=0;

        pos2_salirModoEdicion();
        
        document.getElementById('inlineRadio1').checked = true;

        document.getElementById('txtPosCobroNit').value = 'CF';
        document.getElementById('txtPosCobroNitclie').value = 0;
        document.getElementById('txtPosCobroNombre').value = 'CONSUMIDOR FINAL';
        document.getElementById('txtPosCobroDireccion').value = 'CIUDAD';
        const txtObs = document.getElementById('txtObs');
        if (txtObs) txtObs.value = '';

        document.getElementById('tab-pedido').click();
        get_tbl_pedido();

        let cmbCoddoc = document.getElementById('cmbCoddoc');
        if (cmbCoddoc && cmbCoddoc.value) {
            get_correlativo(cmbCoddoc.value)
            .then((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
            .catch((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo});
        }

};


//---------------------------
//editar pedido
//---------------------------
function tbl_lista_documentos(){

    let tipo = document.getElementById('cmbTipoDoc').value;
    let fecha = F.devuelveFecha('txtFechaDoc');

    let container = document.getElementById('tblDocumentos');
    container.innerHTML = GlobalLoader;
    

    let coddoc = document.getElementById('cmbCoddoc').value;
  
   
    let tableheader = `<table class="table table-sm table-hover table-striped table-bordered mb-0">
                        <thead class="bg-base text-white">
                            <tr>
                                <th>Hora</th>
                                <th>Documento</th>
                                <th>Cliente</th>
                                <th class="text-right">Importe</th>
                                <th>ST</th>
                                <th>FEL</th>
                                <th class="text-center">Editar</th>
                                <th class="text-center">Imprimir</th>
                                <th class="text-center">PDF</th>
                                <th class="text-center">Anular</th>
                            </tr>
                        </thead>
                        <tbody id="tblListaPedidos">`;
    let tablefoooter ='</tbody></table>';

    let strdata = '';
    let totalpedidos = 0;
    
    axios.post('/pos/lista_documentos', {
        sucursal: GlobalEmpnit,
        tipo:tipo,
        fecha:fecha,
        coddoc:coddoc   
    })
    .then((response) => {
        const data = response.data.recordset;
        let total =0;
        data.map((rows)=>{
                let strClassAnulado = ''; if(rows.ST.toString()=='A'){strClassAnulado='text-danger'};
                let idBtnDownload = `btnDownload${rows.CODDOC + '-' + rows.CORRELATIVO}`
                let idBtnAnular = `btnAnular${rows.CODDOC + '-' + rows.CORRELATIVO}`
                const puedeEditar = rows.ST.toString() !== 'A' && !(rows.FEL_UUDI || '').toString().trim();
                const codclie = (rows.CODCLIENTE != null) ? rows.CODCLIENTE : '';
                const nit = (rows.DOC_NIT || '').toString().replace(/"/g, '&quot;');
                const nomclie = (rows.NOMCLIE || '').toString().replace(/"/g, '&quot;');
                const dirclie = (rows.DIRCLIE || 'CIUDAD').toString().replace(/"/g, '&quot;');
                total = total + Number(rows.TOTALPRECIO);
                totalpedidos = totalpedidos + 1;
                strdata = strdata + `
                        <tr>
                            <td>${rows.HORA}</td>
                            <td><b class="text-danger">${rows.CODDOC + '-' + rows.CORRELATIVO}</b></td>
                            <td>${rows.NOMCLIE}</td>
                            <td class="${strClassAnulado} text-right"><b>${F.setMoneda(rows.TOTALPRECIO,'Q')}</b></td>
                            <td class="negrita ${strClassAnulado}">${rows.ST}</td>
                            <td class="small">${rows.FEL_UUDI || '—'}</td>
                            <td class="text-center">
                                ${puedeEditar ? `<button type="button" class="btn btn-circle btn-warning btn-md hand shadow" title="Editar documento"
                                    data-pos2-edit="1"
                                    data-codclie="${codclie}"
                                    data-nit="${nit}"
                                    data-nombre="${nomclie}"
                                    data-direccion="${dirclie}"
                                    data-coddoc="${rows.CODDOC}"
                                    data-correlativo="${rows.CORRELATIVO}">
                                    <i class="fal fa-edit"></i>
                                </button>` : '<span class="text-muted small">—</span>'}
                            </td>
                            <td class="text-center">
                                <button class="btn btn-circle btn-primary btn-md hand shadow" onclick="PRINT.factura_normal('${GlobalEmpnit}','${rows.CODDOC}','${rows.CORRELATIVO}')">
                                    <i class="fal fa-print"></i>
                                </button>
                            </td>
                            <td class="text-center">
                                <button class="btn btn-circle btn-verde btn-md hand shadow" id="${idBtnDownload}" onclick="get_pdf('${rows.CODDOC}','${rows.CORRELATIVO}','${idBtnDownload}')">
                                    <i class="fal fa-download"></i>
                                </button>
                            </td>
                            <td class="text-center">
                                <button class="btn btn-circle btn-danger btn-md hand shadow" id="${idBtnAnular}" onclick="anular_factura('${rows.CODDOC}','${rows.CORRELATIVO}','${rows.ST}','${idBtnAnular}')">
                                    <i class="fal fa-sync"></i>
                                </button>
                            </td>
                        </tr>`
        })
        container.innerHTML = tableheader + strdata + tablefoooter;
    }, (error) => {
        F.AvisoError('Error en la solicitud');
        strdata = '';
        container.innerHTML = '';
    });
    


};

function get_pdf(coddoc, correlativo, idbtn){

    let btn = document.getElementById(idbtn);
    
    btn.innerHTML = '<i class="fal fa-download fa-spin"></i>';
    btn.disabled = true;

    axios.post('/pdf',{
        sucursal:GlobalEmpnit,
        coddoc:coddoc,
        correlativo:correlativo
     })
     .then((response) => {
        let base = response.data;
        base = base.replace('data:application/pdf;base64,','');
        var link = document.createElement('a');
        link.innerHTML = 'Download PDF file';
        link.download ='DOCUMENTO_' + coddoc.toString() + correlativo.toString() + '.pdf';
        link.href = 'data:application/octet-stream;base64,' + base;
        //document.body.appendChild(link);
        link.click();
        link.remove();
        //desbloquea el botón para que deje de dar vueltas
        btn.innerHTML = '<i class="fal fa-download"></i>';
        btn.disabled = false;
        
     }, (error) => {
        console.log(error);
        
        btn.innerHTML = '<i class="fal fa-download"></i>';
        btn.disabled = false;

        F.AvisoError('No se logró crear el pdf')
     });     

};

function anular_documento_para_edicion(coddoc, correlativo) {
    return GF.get_anulacion_documento(coddoc, correlativo, 'O');
}

function cargarPedidoEdicion(codclie, nit, nombre, direccion, coddoc, correlativo) {

    $("#modal_pos2_lista_documentos").modal('hide');

    F.Confirmacion('¿Cargar este documento para editarlo? El documento original se anulará al confirmar la edición.')
    .then((value) => {
        if (value !== true) return;

        F.solicitarClave()
            .then((clave) => {
                if (clave !== GlobalPassUsuario) {
                    F.AvisoError('Clave incorrecta');
                    return;
                }

                F.showToast('Cargando documento...');

                document.getElementById('txtPosCobroNit').value = nit || 'CF';
                document.getElementById('txtPosCobroNitclie').value = codclie || '';
                document.getElementById('txtPosCobroNombre').value = nombre || '';
                document.getElementById('txtPosCobroDireccion').value = direccion || 'CIUDAD';

                Pos2ModoEdicion = { activo: true, coddoc, correlativo };
                pos2_mostrarBannerEdicion();

                const cmbCoddoc = document.getElementById('cmbCoddoc');
                if (cmbCoddoc) {
                    const opts = Array.from(cmbCoddoc.options);
                    const match = opts.find((o) => o.value === coddoc);
                    if (match) cmbCoddoc.value = coddoc;
                }
                document.getElementById('txtCorrelativo').value = correlativo;

                deleteTempVenta_pos(GlobalUsuario)
                    .then(() => loadDetallePedido(coddoc, correlativo))
                    .then(() => {
                        F.showToast('Documento cargado en el pedido');
                        get_tbl_pedido();
                        document.getElementById('tab-pedido').click();
                        document.getElementById('txtPosCodprod').focus();

                        return anular_documento_para_edicion(coddoc, correlativo);
                    })
                    .then(() => {
                        F.showToast('Documento original anulado; al guardar se creará uno nuevo');
                    })
                    .catch((error) => {
                        const det = (typeof error === 'string') ? error : 'revise conexión o permisos';
                        F.AvisoError('No se pudo completar la edición: ' + det);
                        pos2_salirModoEdicion();
                    });
            });
    });
}

/** Carga líneas del documento guardado al carrito temporal (IndexedDB) */
function loadDetallePedido(coddoc, correlativo) {

    return new Promise((resolve, reject) => {
        GF.get_data_detalle_documento(GlobalEmpnit, coddoc, correlativo)
            .then((data) => {
                const lineas = data.recordset || [];
                if (!lineas.length) {
                    reject('Sin detalle');
                    return;
                }
                const inserts = lineas.map((r) => {
                    const cantidad = Number(r.CANTIDAD) || 0;
                    const precio = Number(r.PRECIO) || 0;
                    const equivale = Number(r.EQUIVALE) || 1;
                    const costo = Number(r.COSTO) || 0;
                    return insertTempVentasPOS({
                        CODSUCURSAL: GlobalEmpnit.toString(),
                        EMPNIT: GlobalEmpnit.toString(),
                        USUARIO: '',
                        CODPROD: (r.CODPROD || '').toString(),
                        DESPROD: (r.DESPROD || '').toString(),
                        DESPROD2: (r.DESMARCA || r.OBS || '').toString(),
                        CODMEDIDA: (r.CODMEDIDA || '').toString(),
                        EQUIVALE: equivale,
                        COSTO: costo,
                        TOTALCOSTO: costo * cantidad,
                        PRECIO: precio,
                        CANTIDAD: cantidad,
                        TOTALUNIDADES: cantidad * equivale,
                        TOTALPRECIO: Number(r.TOTALPRECIO) || precio * cantidad,
                        EXENTO: Number(r.EXENTO) || 0,
                        TIPOPROD: (r.TIPOPROD || '').toString(),
                        TIPOPRECIO: (r.TIPOPRECIO || data_empresa_config.TIPO_PRECIO || '').toString(),
                        EXISTENCIA: Number(r.EXISTENCIA) || 0,
                        BONO: Number(r.CANTIDADBONIF) || 0,
                        DESCUENTO: Number(r.DESCUENTO) || 0
                    });
                });
                return Promise.all(inserts);
            })
            .then(() => resolve())
            .catch(() => reject('Error al cargar detalle'));
    });
}



//---------------------------
//editar pedido
//---------------------------



//OPCIONES DEL DOCUMENTO
function anular_factura(coddoc,correlativo,status,idbtn){


    F.Confirmacion("¿Está seguro que desea ANULAR/DESANULAR este documento?")
    
    .then((value)=>{
        if(value==true){

            GF.get_anulacion_documento(coddoc,correlativo,status)
            .then(()=>{
                F.Aviso('Documento anulado exitosamente!!');
                socket.emit('ANULACION',`Se ha anulado el documento: ${coddoc}-${correlativo} en la sede ${GlobalEmpnit}`);
                tbl_lista_documentos();
            })
            .catch(()=>{
                F.AvisoError('No se pudo anular')
            })

        }
    })
   

};
