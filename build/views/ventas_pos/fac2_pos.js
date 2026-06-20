'use strict';

/** ventas 2 — flujo POS: documento en BD primero, líneas en DOCPRODUCTOS después */

var fac2_ingresoListenersReady = false;
var fac2_docActivo = null;
var fac2_syncTimer = null;
var fac2_modoEdicion = false;
var fac2_clientesCache = [];
var fac2_productosBusqueda = [];

function fac2_getModalEl(id) {
    const nodes = document.querySelectorAll('#' + id);
    return nodes.length ? nodes[nodes.length - 1] : null;
}

function fac2_$(id) {
    const el = fac2_getModalEl(id);
    return el ? $(el) : $();
}

function fac2_reset_modal_bindings() {
    const lista = fac2_getModalEl('modal_pos2_lista_precios');
    if (lista && lista._fac2PickHandler) {
        lista.removeEventListener('click', lista._fac2PickHandler);
        delete lista._fac2PickHandler;
    }
    delete document.body.dataset.fac2PickBound;
}

function fac2_get_tipo_precio_empresa() {
    return (typeof data_empresa_config !== 'undefined' && data_empresa_config && data_empresa_config.TIPO_PRECIO)
        ? data_empresa_config.TIPO_PRECIO
        : 'PRECIO';
}

function fac2_leer_precio_catalogo(r, tipoprecio) {
    const tp = tipoprecio || fac2_get_tipo_precio_empresa();
    if (r && r[tp] != null && r[tp] !== '') return Number(r[tp]);
    if (r && r.PRECIO != null && r.PRECIO !== '') return Number(r.PRECIO);
    return 0;
}

function fac2_fetch_precio_medida(codprod, codmedida) {
    return axios.post('/pos/productos_precio', {
        sucursal: GlobalEmpnit,
        token: TOKEN,
        codprod: codprod,
        codmedida: codmedida
    }).then((response) => {
        if (response.data === 'error' || !Number(response.data?.rowsAffected?.[0])) {
            throw new Error('sin precio');
        }
        return response.data.recordset[0];
    });
}

function fac2_aplicar_precio_en_modal(modal, r, opts) {
    opts = opts || {};
    const tipoprecio = fac2_get_tipo_precio_empresa();
    const precio = fac2_leer_precio_catalogo(r, tipoprecio);
    const costo = Number(r.COSTO) || 0;
    const equivale = Number(r.EQUIVALE) || 1;
    const prefix = opts.edit ? 'E' : '';

    Selected_codmedida = r.CODMEDIDA || Selected_codmedida;
    Selected_equivale = equivale;
    Selected_costo = costo;
    Selected_precio = precio;
    if (r.EXISTENCIA != null) Selected_existencia = Number(r.EXISTENCIA) || 0;
    if (r.BONO != null) Selected_bono = Number(r.BONO) || 0;

    const txtPrecio = modal.querySelector('#txtMCPrecio' + prefix);
    const info = modal.querySelector('#fac2MedidaInfo' + prefix);
    if (txtPrecio) txtPrecio.value = precio;
    if (info) {
        info.textContent = `Precio: ${F.setMoneda(precio, 'Q')} · Costo: ${F.setMoneda(costo, 'Q')} · Eq: ${equivale}`;
    }
    if (opts.edit) fac2_CalcularTotalPrecioEditar();
    else fac2_CalcularTotalPrecio();
}

function fac2_cargar_selector_medidas(modal, r, opts) {
    opts = opts || {};
    const containerId = opts.edit ? 'container_precio_editar' : 'container_precio';
    const cmbId = opts.edit ? 'cmbFac2MedidaE' : 'cmbFac2Medida';
    const infoId = opts.edit ? 'fac2MedidaInfoE' : 'fac2MedidaInfo';
    const container = modal.querySelector('#' + containerId);
    if (!container) return Promise.resolve();

    const codprod = r.CODPROD;
    const codmedidaDefault = r.CODMEDIDA || '';
    container.innerHTML = GlobalLoader;

    return GF.get_data_precios_producto(codprod)
        .then((data) => {
            const rows = (data.recordset || []).filter((x) => (x.HABILITADO || 'SI') !== 'NO');
            if (!rows.length) {
                container.innerHTML = `<div class="small text-muted">${codmedidaDefault} · Eq: ${r.EQUIVALE || 1}</div>`;
                return fac2_fetch_precio_medida(codprod, codmedidaDefault)
                    .then((row) => fac2_aplicar_precio_en_modal(modal, { ...r, ...row }, opts))
                    .catch(() => fac2_aplicar_precio_en_modal(modal, r, opts));
            }

            let optsHtml = '';
            rows.forEach((row) => {
                const sel = row.CODMEDIDA === codmedidaDefault ? ' selected' : '';
                optsHtml += `<option value="${row.CODMEDIDA}"${sel}>${row.CODMEDIDA} (Eq: ${row.EQUIVALE})</option>`;
            });

            container.innerHTML = `
                <label class="small negrita text-secondary d-block mb-1">Medida</label>
                <select class="form-control form-control-sm negrita border-base" id="${cmbId}">${optsHtml}</select>
                <div class="small text-muted mt-1" id="${infoId}"></div>`;

            const cmb = container.querySelector('#' + cmbId);
            const aplicarMedida = () => {
                const med = cmb.value;
                const rowMed = rows.find((x) => x.CODMEDIDA === med) || rows[0];
                return fac2_fetch_precio_medida(codprod, med)
                    .then((precioRow) => fac2_aplicar_precio_en_modal(modal, { ...r, ...rowMed, ...precioRow, CODMEDIDA: med }, opts))
                    .catch(() => fac2_aplicar_precio_en_modal(modal, { ...r, ...rowMed, CODMEDIDA: med }, opts));
            };
            cmb.addEventListener('change', () => { aplicarMedida().catch(() => {}); });
            return aplicarMedida();
        })
        .catch(() => {
            container.innerHTML = `<div class="small text-muted">${codmedidaDefault} (Eq: ${r.EQUIVALE || 1})</div>`;
            fac2_aplicar_precio_en_modal(modal, r, opts);
        });
}

function fac2_llenarModalCantidad(r, opts) {
    opts = opts || {};
    const modalId = opts.edit ? 'modal_pos2_editar_cantidad' : 'modal_pos2_cantidad';
    const modal = fac2_getModalEl(modalId);
    if (!modal) return false;

    const prefix = opts.edit ? 'E' : '';
    const lb = modal.querySelector('#lbCantidadDesprod' + prefix);
    const txtCant = modal.querySelector('#txtMCCantidad' + prefix);
    const txtPrecio = modal.querySelector('#txtMCPrecio' + prefix);
    const btnGuardar = modal.querySelector(opts.edit ? '#btnMCGuardarE' : '#btnMCGuardar');

    if (!txtCant || !txtPrecio) return false;

    Selected_codprod = r.CODPROD;
    Selected_desprod = r.DESPROD || '';
    Selected_desprod2 = r.DESPROD2 || '';
    Selected_tipoprod = r.TIPOPROD || '';
    Selected_exento = Number(r.EXENTO) || 0;
    Selected_existencia = Number(r.EXISTENCIA) || 0;
    Selected_bono = Number(r.BONO) || 0;
    if (!opts.edit) Selected_descuento = 0;

    const desprod = Selected_desprod;
    const codmedida = r.CODMEDIDA || '';
    const equivale = Number(r.EQUIVALE) || 1;
    if (lb) lb.textContent = `${desprod} (${codmedida} · Eq: ${equivale})`;

    txtCant.value = opts.edit ? (r.CANTIDAD || '1') : '1';
    txtPrecio.value = Number(r.PRECIO) || 0;
    if (btnGuardar) btnGuardar.disabled = false;

    if (opts.edit) fac2_CalcularTotalPrecioEditar();
    else fac2_CalcularTotalPrecio();

    fac2_cargar_selector_medidas(modal, r, opts).catch(() => {});
    return true;
}

function fac2_abrirModalSecundario(modalListaId, modalCantidadId) {
    const listaEl = fac2_getModalEl(modalListaId);
    const cantidadEl = fac2_getModalEl(modalCantidadId);
    if (!cantidadEl) {
        F.AvisoError('Modal de cantidad no disponible');
        return;
    }

    const enfocarCantidad = () => {
        const inp = cantidadEl.querySelector('#txtMCCantidad') || cantidadEl.querySelector('#txtMCCantidadE');
        if (inp) { inp.focus(); inp.select(); }
    };

    let opened = false;
    const abrirCantidad = () => {
        if (opened) return;
        opened = true;
        const $cantidad = $(cantidadEl);
        $cantidad.off('shown.bs.modal.fac2cant').one('shown.bs.modal.fac2cant', enfocarCantidad);
        $cantidad.modal('show');
        setTimeout(enfocarCantidad, 80);
    };

    const listaVisible = listaEl && (listaEl.classList.contains('show') || listaEl.classList.contains('in'));
    if (listaVisible) {
        $(listaEl).one('hidden.bs.modal.fac2pick', abrirCantidad);
        $(listaEl).modal('hide');
        setTimeout(abrirCantidad, 200);
    } else {
        abrirCantidad();
    }
}

function fac2_abrirModalCantidadDesdeBusqueda(r) {
    if (!fac2_get_doc_activo()) return;
    if (!fac2_llenarModalCantidad(r, { edit: false })) {
        F.AvisoError('No se pudo cargar el producto en el modal');
        return;
    }
    const txtCod = document.getElementById('txtPosCodprod');
    if (txtCod) txtCod.value = '';
    fac2_abrirModalSecundario('modal_pos2_lista_precios', 'modal_pos2_cantidad');
}

function fac2_abrirModalEditarDesdeLinea(r) {
    if (!fac2_llenarModalCantidad(r, { edit: true })) {
        F.AvisoError('No se pudo cargar el producto para editar');
        return;
    }
    fac2_$('modal_pos2_editar_cantidad').modal('show');
    const inp = fac2_getModalEl('modal_pos2_editar_cantidad')?.querySelector('#txtMCCantidadE');
    if (inp) inp.focus();
}

function fac2_onProductRowClick(e) {
    const row = e.target.closest('tr[data-fac2-pick]');
    if (!row) return;
    e.preventDefault();
    e.stopPropagation();
    const idx = Number(row.getAttribute('data-fac2-pick'));
    if (Number.isNaN(idx)) return;
    const r = fac2_productosBusqueda[idx];
    if (r) fac2_abrirModalCantidadDesdeBusqueda(r);
}

function fac2_bind_product_pick() {
    const modal = fac2_getModalEl('modal_pos2_lista_precios');
    if (!modal) return;
    if (modal._fac2PickHandler) {
        modal.removeEventListener('click', modal._fac2PickHandler);
    }
    modal._fac2PickHandler = fac2_onProductRowClick;
    modal.addEventListener('click', modal._fac2PickHandler);
}

function fac2_get_tipo_venta() {
    const radios = document.getElementsByName('inlineRadioOptions');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) return radios[i].value;
    }
    return 'mostrador';
}

function fac2_reset_sesion() {
    fac2_docActivo = null;
    fac2_modoEdicion = false;
    if (fac2_syncTimer) {
        clearTimeout(fac2_syncTimer);
        fac2_syncTimer = null;
    }
}

function fac2_get_doc_activo() {
    if (!fac2_docActivo) {
        F.AvisoError('No hay documento activo');
        return null;
    }
    return fac2_docActivo;
}

function fac2_actualizar_ref_doc() {
    const lb = document.getElementById('lbFac2DocRef');
    if (!lb) return;
    if (fac2_docActivo) {
        lb.innerText = `${fac2_docActivo.coddoc}-${fac2_docActivo.correlativo}`;
    } else {
        lb.innerText = '';
    }
}

function fac2_bloquear_serie_doc(bloquear) {
    ['cmbTipoDocumento', 'cmbCoddoc'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.disabled = !!bloquear;
    });
}

function fac2_calcular_descuento(idDescuento, idTotalPrecio, idTotalPrecioDescuento) {
    try {
        const descuento = Number(document.getElementById(idDescuento)?.value || 0);
        const totalprecio = Number(document.getElementById(idTotalPrecio)?.value || 0);
        document.getElementById(idTotalPrecioDescuento).value = totalprecio - descuento;
    } catch (e) {
        const totalprecio = Number(document.getElementById(idTotalPrecio)?.value || 0);
        document.getElementById(idTotalPrecioDescuento).value = totalprecio;
    }
}

function fac2_CalcularTotalPrecio() {
    const modal = fac2_getModalEl('modal_pos2_cantidad');
    const cantidad = modal?.querySelector('#txtMCCantidad')?.value || 1;
    const precio = modal?.querySelector('#txtMCPrecio')?.value;
    const el = modal?.querySelector('#txtMCTotalPrecio');
    if (el) el.value = (Number(cantidad) * Number(precio)).toFixed(2);
}

function fac2_CalcularTotalPrecioEditar() {
    const modal = fac2_getModalEl('modal_pos2_editar_cantidad');
    const cantidad = modal?.querySelector('#txtMCCantidadE')?.value || 1;
    const precio = modal?.querySelector('#txtMCPrecioE')?.value;
    const el = modal?.querySelector('#txtMCTotalPrecioE');
    if (el) el.value = (Number(cantidad) * Number(precio)).toFixed(2);
}

function fac2_get_correlativo(coddoc) {
    return new Promise((resolve, reject) => {
        axios.post('/tipodocumentos/correlativo', {
            sucursal: GlobalEmpnit,
            coddoc: coddoc,
            token: TOKEN
        }).then((response) => {
            const data = response.data;
            if (Number(data.rowsAffected[0]) > 0) {
                let correlativo = '0';
                data.recordset.map((r) => { correlativo = r.CORRELATIVO; });
                resolve(correlativo);
            } else {
                reject('0');
            }
        }, () => reject('0'));
    });
}

function fac2_get_coddoc(tipo, containerId) {
    const container = document.getElementById(containerId || 'cmbCoddoc');
    if (!container) return Promise.resolve();
    const prev = container.value || '';
    container.innerHTML = '';
    return axios.post('/tipodocumentos/coddoc', {
        sucursal: GlobalEmpnit,
        tipo: tipo,
        token: TOKEN
    }).then((response) => {
        const data = response.data;
        if (Number(data.rowsAffected[0]) > 0) {
            let coddoc = '';
            data.recordset.map((r) => { coddoc += `<option value="${r.CODDOC}">${r.CODDOC}</option>`; });
            container.innerHTML = coddoc;
            if (prev && Array.from(container.options).some((o) => o.value === prev)) {
                container.value = prev;
            }
        }
    }, () => { container.innerHTML = ''; });
}

function fac2_cargar_select_coddoc_nuevo() {
    const cmbTipo = document.getElementById('cmbTipoDocumento')?.value || 'FAC';
    return fac2_get_coddoc(cmbTipo, 'cmbFac2CoddocNuevo');
}

function fac2_aplicar_coddoc_desde_listado() {
    const preferido = document.getElementById('cmbFac2CoddocNuevo')?.value || '';
    const cmbCoddoc = document.getElementById('cmbCoddoc');
    if (!preferido || !cmbCoddoc) return;
    const found = Array.from(cmbCoddoc.options).some((o) => o.value === preferido);
    if (found) cmbCoddoc.value = preferido;
}

window.fac2_cargar_select_coddoc_nuevo = fac2_cargar_select_coddoc_nuevo;

function fac2_listener_coddoc() {
    const cmbTipoDocumento = document.getElementById('cmbTipoDocumento');
    cmbTipoDocumento?.addEventListener('change', () => {
        if (fac2_docActivo) return;
        fac2_get_coddoc(cmbTipoDocumento.value);
    });
}

function fac2_validar_cliente_seleccionado() {
    const cod = document.getElementById('txtPosCobroNitclie')?.value || '';
    const nit = document.getElementById('txtPosCobroNit')?.value || '';
    const nombre = document.getElementById('txtPosCobroNombre')?.value || '';
    if ((!cod || cod === '0') && !nit && !nombre) {
        F.AvisoError('Seleccione o ingrese un cliente');
        document.getElementById('txtPosCobroNit')?.focus();
        return false;
    }
    return true;
}

function fac2_get_vendedores() {
    GF.get_data_empleados_tipo(3)
        .then((data) => {
            let str = '';
            data.recordset.map((r) => { str += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>`; });
            document.getElementById('cmbVendedor').innerHTML = str;
        })
        .catch(() => {
            document.getElementById('cmbVendedor').innerHTML = '<option value="1">SIN VENDEDOR</option>';
        });
}

function fac2_get_cajas() {
    GF.get_data_cajas()
        .then((data) => {
            let str = '';
            data.recordset.map((r) => { str += `<option value="${r.CODCAJA}">${r.DESCAJA}</option>`; });
            document.getElementById('cmbCaja').innerHTML = str;
        })
        .catch(() => {
            document.getElementById('cmbCaja').innerHTML = '<option value="1">SIN CAJA</option>';
        });
}

function fac2_leer_encabezado_form() {
    const txtFecha = new Date(document.getElementById('txtFecha').value);
    return {
        codcliente: document.getElementById('txtPosCobroNitclie')?.value || '0',
        nitclie: document.getElementById('txtPosCobroNit')?.value || '',
        nomclie: document.getElementById('txtPosCobroNombre')?.value || '',
        dirclie: document.getElementById('txtPosCobroDireccion')?.value || '',
        obs: F.limpiarTexto(document.getElementById('txtObs')?.value || ''),
        codven: document.getElementById('cmbVendedor')?.value || '0',
        tipo_pago: 'CON',
        codcaja: document.getElementById('cmbCaja')?.value || '0',
        fecha: F.devuelveFecha('txtFecha'),
        fechaentrega: F.devuelveFecha('txtFecha'),
        anio: txtFecha.getFullYear(),
        mes: txtFecha.getUTCMonth() + 1,
        hora: F.getHora(),
        etiqueta: 'MEDIA',
        coddoc: document.getElementById('cmbCoddoc')?.value || '',
        correlativo: document.getElementById('txtCorrelativo')?.value || '0',
        tipo_doc: fac2_get_tipo_venta(),
        direntrega: document.getElementById('txtPosCobroDireccion')?.value || ''
    };
}

function fac2_sync_encabezado() {
    const doc = fac2_get_doc_activo();
    if (!doc) return Promise.resolve();
    const h = fac2_leer_encabezado_form();
    return axios.post('/pos/update_encabezado_venta', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        coddoc: doc.coddoc,
        correlativo: doc.correlativo,
        codcliente: h.codcliente,
        nomclie: h.nomclie,
        nitclie: h.nitclie,
        dirclie: h.dirclie,
        obs: h.obs,
        codven: h.codven,
        tipo_pago: h.tipo_pago,
        codcaja: h.codcaja,
        fecha: h.fecha,
        fechaentrega: h.fechaentrega,
        etiqueta: h.etiqueta,
        tipo_doc: h.tipo_doc,
        direntrega: h.direntrega
    });
}

function fac2_programar_sync_encabezado() {
    if (fac2_syncTimer) clearTimeout(fac2_syncTimer);
    fac2_syncTimer = setTimeout(() => {
        fac2_sync_encabezado().catch(() => {});
    }, 600);
}

function fac2_reset_campos_form() {
    GlobalTotalDocumento = 0;
    GlobalTotalDescuento = 0;
    GlobalTotalCostoDocumento = 0;

    const txtFechaPago = document.getElementById('txtFechaPago');
    if (txtFechaPago) txtFechaPago.value = F.getFecha();
    document.getElementById('txtFecha').value = F.getFecha();
    document.getElementById('txtPosCobroNit').value = 'CF';
    document.getElementById('txtPosCobroNitclie').value = '0';
    document.getElementById('txtPosCobroNombre').value = 'CONSUMIDOR FINAL';
    document.getElementById('txtPosCobroDireccion').value = 'CIUDAD';
    const txtTel = document.getElementById('txtPosCobroTelefono');
    if (txtTel) txtTel.value = '';
    document.getElementById('txtObs').value = '';

    fac2_bloquear_serie_doc(false);
    fac2_actualizar_ref_doc();
    const btnGuardar = document.getElementById('btnGuardarFactura');
    if (btnGuardar) btnGuardar.innerHTML = '<i class="fal fa-save mr-1"></i> Guardar venta';
}

function fac2_crear_documento_api(h) {
    return axios.post('/pos/insert_documento_abierto', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        coddoc: h.coddoc,
        correlativo: h.correlativo,
        serie_fac: h.serie_fac,
        numero_fac: h.numero_fac,
        coddoc_origen: h.coddoc_origen,
        correlativo_origen: h.correlativo_origen,
        anio: h.anio,
        mes: h.mes,
        fecha: h.fecha,
        fechaentrega: h.fechaentrega,
        codbodega: GlobalCodBodega,
        codcliente: 0,
        nomclie: '',
        nitclie: '',
        dirclie: '',
        obs: '',
        usuario: GlobalUsuario,
        codven: h.codven,
        hora: h.hora,
        tipo_pago: h.tipo_pago,
        codcaja: h.codcaja,
        iva: GlobalConfigIVA,
        etiqueta: h.etiqueta,
        tipo_doc: h.tipo_doc,
        lat: '0',
        long: '0',
        direntrega: h.direntrega
    }).then((response) => {
        if (response.data === 'error' || Number(response.data?.rowsAffected?.[0] || 0) === 0) {
            throw new Error('insert');
        }
        fac2_docActivo = { coddoc: h.coddoc, correlativo: h.correlativo };
        fac2_bloquear_serie_doc(true);
        fac2_actualizar_ref_doc();
        fac2_get_tbl_pedido();
    });
}

function fac2_iniciar_documento_nuevo() {
    if (typeof fac2_show_ingreso_loader === 'function') {
        fac2_show_ingreso_loader('Creando documento');
    }
    fac2_reset_campos_form();
    const cmbTipo = document.getElementById('cmbTipoDocumento')?.value || 'FAC';
    const lbRef = document.getElementById('lbFac2DocRef');
    if (lbRef) lbRef.innerText = 'Creando documento...';

    fac2_get_coddoc(cmbTipo)
        .then(() => {
            fac2_aplicar_coddoc_desde_listado();
            const cmbCoddoc = document.getElementById('cmbCoddoc');
            if (!cmbCoddoc?.value) {
                F.AvisoError('No hay serie de documento configurada');
                return Promise.reject();
            }
            return fac2_get_correlativo(cmbCoddoc.value)
                .then((correlativo) => {
                    document.getElementById('txtCorrelativo').value = correlativo;
                    const h = fac2_leer_encabezado_form();
                    return fac2_crear_documento_api(h);
                });
        })
        .then(() => {
            F.showToast('Documento creado — agregue productos');
            document.getElementById('txtPosCodprod')?.focus();
        })
        .catch(() => {
            F.AvisoError('No se pudo crear el documento de venta');
            if (lbRef) lbRef.innerText = '';
        })
        .finally(() => {
            if (typeof fac2_hide_ingreso_loader === 'function') fac2_hide_ingreso_loader();
        });
}

function fac2_insert_item_api(coddoc, correlativo, codprod, desprod, codmedida, cantidad, equivale, costo, precio, descuento, tipoprod, tipoprecio, existencia, bono, exento) {
    const totalunidades = Number(cantidad) * Number(equivale);
    const totalcosto = Number(costo) * Number(cantidad);
    const totalprecio = Number(precio) * Number(cantidad);
    return axios.post('/pos/insert_item_venta', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        coddoc: coddoc,
        correlativo: correlativo,
        codbodega: GlobalCodBodega,
        codprod: codprod,
        desprod: F.limpiarTexto(desprod),
        codmedida: codmedida,
        cantidad: cantidad,
        equivale: equivale,
        totalunidades: totalunidades,
        costo: costo,
        precio: precio,
        totalcosto: totalcosto,
        totalprecio: totalprecio,
        descuento: descuento,
        tipoprod: tipoprod,
        tipoprecio: tipoprecio,
        lastupdate: F.getFecha(),
        por_iva: GlobalConfigIVA,
        existencia: existencia,
        bono: bono,
        exento: exento
    }).then((response) => {
        if (response.data === 'error' || Number(response.data?.rowsAffected?.[0] || 0) === 0) {
            throw new Error('item');
        }
    });
}

function fac2_get_tbl_pedido() {
    const doc = fac2_docActivo;
    const container = document.getElementById('tblPosPedido');
    if (!container) return;

    if (!doc) {
        container.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-3">Sin documento activo</td></tr>';
        return;
    }

    container.innerHTML = GlobalLoader;

    let varTotalItems = 0;
    let varTotalVenta = 0;
    let varTotalCosto = 0;
    let varTotalDescuento = 0;

    GF.get_data_detalle_documento(GlobalEmpnit, doc.coddoc, doc.correlativo)
        .then((data) => {
            const rows = data.recordset || [];
            const html = rows.map((r) => {
                varTotalItems += 1;
                varTotalVenta += Number(r.TOTALPRECIO);
                varTotalCosto += Number(r.TOTALCOSTO);
                varTotalDescuento += Number(r.DESCUENTO);
                const imp = Number(r.TOTALPRECIO) - Number(r.DESCUENTO);
                return `
            <tr class="border-base border-left-0 border-right-0 border-top-0">
                <td class="text-left">
                    ${r.DESPROD}
                    <br>
                    <div class="row"><div class="col-6"><small class="negrita"><b>${r.CODPROD}</b></small></div></div>
                </td>
                <td>${r.DESPROD2 || ''}</td>
                <td>${r.CODMEDIDA} (eq: ${r.EQUIVALE})</td>
                <td><b class="text-info" style="font-size:140%">${r.CANTIDAD}</b></td>
                <td class="negrita">${F.setMoneda(r.PRECIO, 'Q')}</td>
                <td class="negrita h4">${F.setMoneda(r.TOTALPRECIO, 'Q')}</td>
                <td class="negrita" style="color:var(--pos2-muted)">${F.setMoneda(r.DESCUENTO, 'Q')}</td>
                <td class="negrita pos2-field-accent">${F.setMoneda(imp, 'Q')}</td>
                <td>
                    <button type="button" class="btn btn-md btn-circle btn-info shadow hand" onclick="fac2_edit_item_pedido('${r.ID}','${r.CODPROD}','${F.limpiarTexto(r.DESPROD)}','${r.CODMEDIDA}','${r.EQUIVALE}','${r.CANTIDAD}','${r.COSTO}','${r.PRECIO}','${r.TIPOPROD}','${r.EXENTO}','${r.EXISTENCIA || 0}','${r.BONO || 0}','${r.DESCUENTO}')"><i class="fal fa-edit"></i></button>
                </td>
                <td>
                    <button type="button" class="btn btn-md btn-circle btn-danger shadow hand" onclick="fac2_delete_item_pedido('${r.ID}')"><i class="fal fa-trash"></i></button>
                </td>
            </tr>`;
            }).join('\n');

            const totalNeto = varTotalVenta - varTotalDescuento;
            container.innerHTML = html || '<tr><td colspan="10" class="text-center text-muted py-3">Agregue productos con el buscador</td></tr>';

            GlobalTotalCostoDocumento = varTotalCosto;
            GlobalTotalDocumento = varTotalVenta;
            GlobalTotalDescuento = varTotalDescuento;

            document.getElementById('lbTotalItems').innerText = varTotalItems + ' items';
            document.getElementById('lbTotalVenta').innerText = F.setMoneda(varTotalVenta, 'Q');
            document.getElementById('lbTotalDescuento').innerText = `- ${F.setMoneda(varTotalDescuento, 'Q')}`;
            document.getElementById('lbTotalVentaDescuento').innerText = F.setMoneda(totalNeto, 'Q');
            document.getElementById('lbPosCobroTotalPagar').innerText = F.setMoneda(totalNeto, 'Q');

            const lbDetItems = document.getElementById('lbFac2DetalleItems');
            if (lbDetItems) lbDetItems.innerText = `${varTotalItems} item${varTotalItems === 1 ? '' : 's'}`;

            const totalBlock = document.getElementById('lbFac2DetalleTotal');
            if (totalBlock) {
                totalBlock.innerHTML = varTotalItems > 0 ? `
                    <div class="sygma-embarque-rpt__total-inner">
                        <span class="sygma-embarque-rpt__foot-label">TOTAL venta</span>
                        <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(totalNeto, 'Q')}</span>
                    </div>` : '';
            }

            GF.get_documento_update_totales(doc.coddoc, doc.correlativo, varTotalCosto, varTotalDescuento, varTotalVenta)
                .catch(() => {});
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="10" class="text-center text-muted py-3">Agregue productos con el buscador</td></tr>';
            GlobalTotalCostoDocumento = 0;
            GlobalTotalDocumento = 0;
            GlobalTotalDescuento = 0;
            document.getElementById('lbTotalItems').innerText = '0 items';
            document.getElementById('lbTotalVentaDescuento').innerText = F.setMoneda(0, 'Q');
            document.getElementById('lbPosCobroTotalPagar').innerText = F.setMoneda(0, 'Q');
            const lbDetItems = document.getElementById('lbFac2DetalleItems');
            if (lbDetItems) lbDetItems.innerText = '0 items';
            const totalBlock = document.getElementById('lbFac2DetalleTotal');
            if (totalBlock) totalBlock.innerHTML = '';
        });
}

function fac2_get_buscar_producto(filtro) {
    const doc = fac2_get_doc_activo();
    if (!doc) return;
    if (!fac2_validar_cliente_seleccionado()) return;

    fac2_$('modal_pos2_lista_precios').modal('show');
    const modalLista = fac2_getModalEl('modal_pos2_lista_precios');
    const container = modalLista?.querySelector('#tblDataProductos') || document.getElementById('tblDataProductos');
    container.innerHTML = GlobalLoader;
    const btn = document.getElementById('btnBuscarProd');
    btn.innerHTML = '<i class="fal fa-sync fa-spin"></i>';
    btn.disabled = true;

    const tipoprecio = (typeof data_empresa_config !== 'undefined' && data_empresa_config) ? data_empresa_config.TIPO_PRECIO : '';

    axios.post('/pos/productos_filtro', {
        sucursal: GlobalEmpnit,
        token: TOKEN,
        filtro: filtro,
        tipoprecio: tipoprecio
    }).then((response) => {
        let str = '';
        if (response !== 'error' && response.data?.recordset) {
            fac2_productosBusqueda = response.data.recordset;
            fac2_productosBusqueda.forEach((r, idx) => {
                const clsExist = Number(r.EXISTENCIA) <= 0 ? 'text-danger' : '';
                str += `<tr class="hand" data-fac2-pick="${idx}">
                    <td class="sygma-embarque-rpt__cod">
                        <span class="sygma-embarque-rpt__cod-main">${r.CODPROD}</span>
                        <span class="sygma-embarque-rpt__cod-sub">${r.TIPOPROD || ''}</span>
                    </td>
                    <td class="sygma-embarque-rpt__prod">
                        <span class="sygma-embarque-rpt__prod-main" style="color:${r.COLOR || 'inherit'}">${r.DESPROD}</span>
                        <span class="sygma-embarque-rpt__prod-sub">${r.DESMARCA || ''}${r.DESPROD2 ? ` · ${r.DESPROD2}` : ''}</span>
                    </td>
                    <td class="text-center">${r.CODMEDIDA}<br><small class="text-muted">Eq ${r.EQUIVALE}</small></td>
                    <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(r.PRECIO, 'Q')}</td>
                    <td class="text-right ${clsExist}"><b>${r.EXISTENCIA}</b></td>
                    <td>${r.TIPOPROD}</td>
                </tr>`;
            });
        } else {
            fac2_productosBusqueda = [];
        }
        container.innerHTML = str || '<tr><td colspan="6" class="text-center text-muted py-3">Sin resultados</td></tr>';
        btn.innerHTML = '<i class="fal fa-search"></i>';
        btn.disabled = false;
    }, () => {
        container.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">Error al buscar productos</td></tr>';
        btn.innerHTML = '<i class="fal fa-search"></i>';
        btn.disabled = false;
    });
}

function fac2_get_producto(codprod, desprod, desprod2, codmedida, equivale, costo, precio, tipoprod, exento, existencia, bono) {
    fac2_abrirModalCantidadDesdeBusqueda({
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
    });
}

function fac2_edit_item_pedido(id, codprod, desprod, codmedida, equivale, cantidad, costo, precio, tipoprod, exento, existencia, bono, descuento) {
    Selected_id = id;
    Selected_descuento = Number(descuento) || 0;
    fac2_abrirModalEditarDesdeLinea({
        CODPROD: codprod,
        DESPROD: desprod,
        CODMEDIDA: codmedida,
        EQUIVALE: equivale,
        CANTIDAD: cantidad,
        COSTO: costo,
        PRECIO: precio,
        TIPOPROD: tipoprod,
        EXENTO: exento,
        EXISTENCIA: existencia,
        BONO: bono
    });
}

function fac2_delete_item_pedido(id) {
    const doc = fac2_get_doc_activo();
    if (!doc) return;

    F.Confirmacion('¿Está seguro que desea quitar este item?').then((value) => {
        if (value !== true) return;
        GF.get_documento_eliminar_item(id)
            .then(() => {
                F.showToast('Item eliminado');
                fac2_get_tbl_pedido();
            })
            .catch(() => F.AvisoError('No se pudo quitar este item'));
    });
}

function fac2_get_datos_cliente(nitclie, nit, nomclie, dirclie, telefono) {
    fac2_$('modal_pos2_lista_clientes').modal('hide');
    document.getElementById('txtPosCobroNit').value = nit;
    document.getElementById('txtPosCobroNitclie').value = nitclie;
    document.getElementById('txtPosCobroNombre').value = nomclie;
    document.getElementById('txtPosCobroDireccion').value = dirclie;
    document.getElementById('txtPosCobroTelefono').value = telefono || '';
    fac2_programar_sync_encabezado();
}

function fac2_render_clientes_tabla(data) {
    const container = document.getElementById('tblDataClientes');
    if (!container) return;
    if (!data || !data.length) {
        container.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">No hay clientes registrados</td></tr>';
        return;
    }
    let str = '';
    data.forEach((r) => {
        const cod = r.CODCLIENTE || r.CODPROV;
        const nombre = r.NOMBRE || r.EMPRESA || '';
        const dir = r.DIRECCION || '';
        const tel = r.TELEFONO || r.TELEMPRESA || '';
        str += `<tr class="hand" onclick="fac2_get_datos_cliente('${cod}','${r.NIT}','${F.limpiarTexto(nombre)}','${F.limpiarTexto(dir)}','${tel}')">
            <td>${r.NIT} / ${cod}</td><td>${nombre}<br><small class="text-muted">${dir}</small></td>
            <td>${tel}</td><td class="text-right">${F.setMoneda(r.SALDO, 'Q')}</td></tr>`;
    });
    container.innerHTML = str;
}

function fac2_cargar_lista_clientes() {
    const container = document.getElementById('tblDataClientes');
    if (container) container.innerHTML = GlobalLoader;
    return axios.post('/clientes/listado', { token: TOKEN })
        .then((response) => {
            if (response.data === 'error') throw new Error('error');
            fac2_render_clientes_tabla(response.data.recordset || []);
        })
        .catch(() => {
            fac2_render_clientes_tabla([]);
            F.AvisoError('No se pudo cargar la lista de clientes');
        });
}

function fac2_tbl_clientes(filtro) {
    if (!filtro) {
        F.AvisoError('Escriba un nombre o nit válidos');
        document.getElementById('txtBuscarClie')?.focus();
        return;
    }
    const container = document.getElementById('tblDataClientes');
    container.innerHTML = GlobalLoader;
    axios.post('/clientes/buscar_cliente', { token: TOKEN, sucursal: GlobalEmpnit, filtro: filtro })
        .then((response) => {
            let str = '';
            if (response.data !== 'error') {
                response.data.recordset.map((r) => {
                    str += `<tr class="hand" onclick="fac2_get_datos_cliente('${r.CODCLIENTE}','${r.NIT}','${F.limpiarTexto(r.NOMBRE)}','${F.limpiarTexto(r.DIRECCION)}','${r.TELEFONO}')">
                        <td>${r.NIT} / ${r.CODCLIENTE}</td><td>${r.NOMBRE}<br><small class="text-muted">${r.DIRECCION}</small></td>
                        <td>${r.TELEFONO}</td><td class="text-right">${F.setMoneda(r.SALDO, 'Q')}</td></tr>`;
                });
            }
            container.innerHTML = str || '<tr><td colspan="4" class="text-center">Sin resultados</td></tr>';
        }, () => { container.innerHTML = '<tr><td colspan="4" class="text-center">Error</td></tr>'; });
}

function fac2_fcn_buscar_cliente(nit) {
    return new Promise((resolve, reject) => {
        if (!nit) { F.AvisoError('Escriba un nombre o nit válidos'); reject(); return; }
        axios.post('/clientes/buscar_cliente_nit', { sucursal: GlobalEmpnit, nit: nit, token: TOKEN })
            .then((response) => {
                if (response === 'error' || Number(response.data.rowsAffected[0]) === 0) { reject(); return; }
                response.data.recordset.map((r) => {
                    document.getElementById('txtPosCobroNit').value = r.NIT;
                    document.getElementById('txtPosCobroNitclie').value = r.CODCLIENTE;
                    document.getElementById('txtPosCobroNombre').value = r.NOMBRE;
                    document.getElementById('txtPosCobroDireccion').value = r.DIRECCION;
                });
                fac2_programar_sync_encabezado();
                resolve();
            }, () => reject());
    });
}

function fac2_insert_cliente(nit, nombre, direccion, telefono) {
    return axios.post('/clientes/insert_cliente', {
        fecha: F.getFecha(),
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
    }).then((response) => {
        if (Number(response.data.rowsAffected[0]) > 0) return response.data;
        throw new Error('no insert');
    });
}

function fac2_guardar_venta_click() {
    const btnGuardarFactura = document.getElementById('btnGuardarFactura');
    if (btnGuardarFactura?.disabled) return;
    if (!fac2_validar_cliente_seleccionado()) return;
    if (Number(GlobalTotalDocumento || 0) === 0) {
        F.AvisoError('No hay productos agregados');
        return;
    }
    btnGuardarFactura.disabled = true;
    F.Confirmacion('¿Está seguro que desea guardar esta venta?').then((value) => {
        if (value === true) {
            fac2_finalizar_venta();
        } else if (btnGuardarFactura) {
            btnGuardarFactura.disabled = false;
        }
    });
}

function fac2_finalizar_venta() {
    const btnGuardarFactura = document.getElementById('btnGuardarFactura');
    const doc = fac2_get_doc_activo();
    if (!doc) {
        if (btnGuardarFactura) btnGuardarFactura.disabled = false;
        return;
    }
    if (!fac2_validar_cliente_seleccionado()) {
        if (btnGuardarFactura) btnGuardarFactura.disabled = false;
        return;
    }

    fac2_get_tbl_pedido();

    if (Number(GlobalTotalDocumento) === 0) {
        F.AvisoError('No hay productos agregados');
        if (btnGuardarFactura) btnGuardarFactura.disabled = false;
        return;
    }

    if (btnGuardarFactura) {
        btnGuardarFactura.disabled = true;
        btnGuardarFactura.innerHTML = '<i class="fal fa-save fa-spin mr-1"></i> Guardando...';
    }

    fac2_sync_encabezado()
        .then(() => {
            F.Aviso(fac2_modoEdicion ? 'Cambios guardados exitosamente' : 'Venta guardada exitosamente');
            fac2_reset_sesion();
            if (btnGuardarFactura) btnGuardarFactura.innerHTML = '<i class="fal fa-save mr-1"></i> Guardar venta';
            if (typeof fac2_on_guardado_exitoso === 'function') fac2_on_guardado_exitoso();
        })
        .catch(() => F.AvisoError('No se pudo guardar la venta'))
        .finally(() => {
            if (btnGuardarFactura) {
                btnGuardarFactura.disabled = false;
                btnGuardarFactura.innerHTML = '<i class="fal fa-save mr-1"></i> Guardar venta';
            }
        });
}

function fac2_abandonar_documento() {
    const doc = fac2_docActivo;
    if (!doc) {
        fac2_reset_sesion();
        return Promise.resolve();
    }

    if (fac2_modoEdicion) {
        return fac2_sync_encabezado().finally(() => fac2_reset_sesion());
    }

    const sincliente = !(document.getElementById('txtPosCobroNitclie')?.value);
    const sinProductos = Number(GlobalTotalDocumento || 0) === 0;

    if (sincliente && sinProductos) {
        return axios.post('/documentos/eliminar_documento', {
            token: TOKEN,
            sucursal: GlobalEmpnit,
            coddoc: doc.coddoc,
            correlativo: doc.correlativo
        }).catch(() => {}).finally(() => fac2_reset_sesion());
    }

    return fac2_sync_encabezado().finally(() => fac2_reset_sesion());
}

function fac2_fecha_para_input(val) {
    if (!val) return '';
    try {
        return val.toString().replace('T00:00:00.000Z', '').substring(0, 10);
    } catch (e) {
        return '';
    }
}

function fac2_aplicar_encabezado_form(r) {
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val ?? '';
    };

    setVal('txtPosCobroNit', r.NIT);
    setVal('txtPosCobroNitclie', r.CODCLIENTE);
    setVal('txtPosCobroNombre', r.NOMCLIE);
    setVal('txtPosCobroDireccion', r.DIRCLIE);
    setVal('txtObs', r.OBS);
    setVal('txtSerieFac', r.SERIEFAC);
    setVal('txtNumeroFac', r.NUMERO_FAC);
    setVal('txtCoddocOrigen', r.CODDOC_ORIGEN);
    setVal('txtCorrelativoOrigen', r.CORRELATIVO_ORIGEN);
    setVal('cmbConCre', r.CONCRE || 'CON');
    setVal('cmbCaja', r.CODCAJA);
    setVal('cmbVendedor', r.CODEMP);
    setVal('cmbPrioridad', r.ETIQUETA || 'MEDIA');

    if (r.FECHA) setVal('txtFecha', fac2_fecha_para_input(r.FECHA));
    if (r.FECHAENTREGA) setVal('txtFechaPago', fac2_fecha_para_input(r.FECHAENTREGA));

    const cmbTipo = document.getElementById('cmbTipoDocumento');
    if (cmbTipo && r.TIPODOC) cmbTipo.value = r.TIPODOC;

    const cmbCoddoc = document.getElementById('cmbCoddoc');
    if (cmbCoddoc && r.CODDOC) {
        let found = false;
        Array.from(cmbCoddoc.options).forEach((o) => {
            if (o.value === r.CODDOC) found = true;
        });
        if (!found) {
            cmbCoddoc.innerHTML += `<option value="${r.CODDOC}">${r.CODDOC}</option>`;
        }
        cmbCoddoc.value = r.CODDOC;
    }
    setVal('txtCorrelativo', r.CORRELATIVO);
}

function fac2_cargar_encabezado_documento(coddoc, correlativo) {
    return axios.post('/compras/encabezado_documento', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        coddoc: coddoc,
        correlativo: correlativo
    }).then((response) => {
        if (response.data === 'error' || Number(response.data?.rowsAffected?.[0] || 0) === 0) {
            throw new Error('sin datos');
        }
        const r = response.data.recordset[0];
        fac2_aplicar_encabezado_form(r);
        return r;
    });
}

function fac2_abrir_documento_edicion(coddoc, correlativo, idbtn) {
    const btn = idbtn ? document.getElementById(idbtn) : null;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-sync fa-spin"></i>';
    }

    fac2_reset_sesion();
    fac2_modoEdicion = true;

    if (typeof fac2_show_ingreso === 'function') {
        fac2_show_ingreso({ skipNuevo: true, skipClientes: true, titulo: 'Editar venta' });
    }
    if (typeof fac2_show_ingreso_loader === 'function') {
        fac2_show_ingreso_loader('Cargando documento');
    }

    const loadExtra = Promise.resolve();

    return loadExtra
        .then(() => fac2_cargar_encabezado_documento(coddoc, correlativo))
        .then((r) => fac2_get_coddoc(r.TIPODOC || 'FAC').then(() => r))
        .then((r) => {
            fac2_aplicar_encabezado_form(r);
            fac2_docActivo = { coddoc: coddoc, correlativo: correlativo };
            fac2_bloquear_serie_doc(true);
            fac2_actualizar_ref_doc();
            const btnGuardar = document.getElementById('btnGuardarFactura');
            if (btnGuardar) btnGuardar.innerHTML = '<i class="fal fa-save mr-1"></i> Guardar cambios';
            fac2_get_tbl_pedido();
            document.getElementById('txtPosCodprod')?.focus();
            F.showToast('Documento listo para editar');
        })
        .catch(() => {
            fac2_reset_sesion();
            if (typeof fac2_show_listado === 'function') fac2_show_listado();
            F.AvisoError('No se pudo cargar el documento');
        })
        .finally(() => {
            if (typeof fac2_hide_ingreso_loader === 'function') fac2_hide_ingreso_loader();
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fal fa-edit"></i>';
            }
        });
}

function fac2_editar_documento(coddoc, correlativo, st, idbtn) {
    if (st === 'A') {
        F.AvisoError('No se puede editar un documento anulado');
        return;
    }

    F.Confirmacion('¿Está seguro que desea EDITAR este documento?')
        .then((value) => {
            if (value !== true) return;
            fac2_abrir_documento_edicion(coddoc, correlativo, idbtn);
        });
}

function fac2_format_pago(concre) {
    if (concre === 'CRE') return 'CREDITO';
    if (concre === 'CON') return 'CONTADO';
    return concre || '—';
}

function fac2_format_direccion_ticket(doc) {
    const dir = (doc.DIRCLIE || '').trim();
    return dir || '—';
}

function fac2_build_ticket_html(doc, lineas) {
    const head = lineas[0] || {};
    const nomclie = (head.NOMCLIE || doc.NOMCLIE || '').trim();
    const direccion = fac2_format_direccion_ticket({ DIRCLIE: head.DIRCLIE || doc.DIRCLIE });
    const obs = (doc.OBS || head.DOCOBS || '').trim();
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
        total = Number(doc.TOTALPRECIO) || Number(doc.TOTALVENTA) || 0;
        rowsHtml = `<tr><td colspan="6" class="text-center text-muted">Sin lineas de producto</td></tr>`;
    }

    return `
        <div class="sygma-embarque-doc-ticket">
            <div class="sygma-embarque-doc-ticket__head">
                <div class="sygma-embarque-doc-ticket__doc">${doc.CODDOC}-${doc.CORRELATIVO}</div>
                <div class="sygma-embarque-doc-ticket__meta">${F.convertDateNormal(doc.FECHA)} · Hora: ${doc.HORA || ''}</div>
                <div class="sygma-embarque-doc-ticket__meta">Vendedor: ${doc.NOMEMPLEADO || ''}</div>
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

function fac2_ejecutar_impresion() {
    document.body.classList.add('sygma-print-embarque-active');
    window.print();
    setTimeout(() => {
        document.body.classList.remove('sygma-print-embarque-active');
        const host = document.getElementById('fac2_print_host');
        if (host) host.innerHTML = '';
    }, 600);
}

function fac2_imprimir_documento(coddoc, correlativo, idbtn) {
    const btn = idbtn ? document.getElementById(idbtn) : null;
    const host = document.getElementById('fac2_print_host');
    if (!host) return;

    if (btn) {
        btn.innerHTML = '<i class="fal fa-print fa-spin"></i>';
        btn.disabled = true;
    }

    F.showToast('Generando imprimible...');

    Promise.all([
        fac2_cargar_encabezado_documento(coddoc, correlativo),
        GF.get_data_detalle_documento(GlobalEmpnit, coddoc, correlativo)
            .then((data) => data.recordset || [])
            .catch(() => [])
    ])
        .then(([enc, lineas]) => {
            host.innerHTML = `<div class="sygma-embarque-print-tickets">${fac2_build_ticket_html(enc, lineas)}</div>`;
            fac2_ejecutar_impresion();
        })
        .catch(() => {
            F.AvisoError('No se pudo generar el imprimible');
            host.innerHTML = '';
        })
        .finally(() => {
            if (btn) {
                btn.innerHTML = '<i class="fal fa-print"></i>';
                btn.disabled = false;
            }
        });
}

function fac2_eliminar_documento_listado(coddoc, correlativo, st, idbtn) {
    if (st === 'A') {
        F.AvisoError('El documento ya está anulado');
        return;
    }

    F.Confirmacion('¿Está seguro que desea ELIMINAR este documento? Esta acción no se puede deshacer.')
        .then((value) => {
            if (value !== true) return;

            const btn = idbtn ? document.getElementById(idbtn) : null;
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fal fa-trash fa-spin"></i>';
            }

            axios.post('/documentos/eliminar_documento', {
                token: TOKEN,
                sucursal: GlobalEmpnit,
                coddoc: coddoc,
                correlativo: correlativo
            }).then((response) => {
                if (response.data === 'error' || Number(response.data?.rowsAffected?.[0] || 0) === 0) {
                    F.AvisoError('No se pudo eliminar el documento');
                    return;
                }
                F.Aviso('Documento eliminado');
                if (typeof fac2_cargar_listado === 'function') fac2_cargar_listado();
            }).catch(() => {
                F.AvisoError('No se pudo eliminar el documento');
            }).finally(() => {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fal fa-trash"></i>';
                }
            });
        });
}

function fac2_setup_ingreso_listeners() {
    if (typeof pos2_moverModalesABody === 'function') pos2_moverModalesABody();
    if (typeof pos2_prepararModalesSinAnimacion === 'function') pos2_prepararModalesSinAnimacion();
    fac2_bind_product_pick();

    if (fac2_ingresoListenersReady) return;
    fac2_ingresoListenersReady = true;

    const cmbPrioridad = document.getElementById('cmbPrioridad');
    if (cmbPrioridad) cmbPrioridad.innerHTML = F.get_prioridades();

    fac2_get_vendedores();
    fac2_get_cajas();
    fac2_listener_coddoc();

    document.getElementById('btnFac2VolverListado')?.addEventListener('click', () => {
        if (typeof fac2_volver_listado === 'function') fac2_volver_listado();
    });

    document.getElementById('btnGuardarFactura')?.addEventListener('click', fac2_guardar_venta_click);

    ['txtObs', 'txtPosCobroNit', 'txtPosCobroNombre', 'txtPosCobroDireccion', 'txtPosCobroTelefono'].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', fac2_programar_sync_encabezado);
    });
    ['cmbCaja', 'cmbVendedor', 'txtFecha', 'cmbTipoDocumento'].forEach((id) => {
        document.getElementById(id)?.addEventListener('change', fac2_programar_sync_encabezado);
    });
    document.getElementsByName('inlineRadioOptions').forEach((el) => {
        el.addEventListener('change', fac2_programar_sync_encabezado);
    });

    const txtPosCodprod = document.getElementById('txtPosCodprod');
    txtPosCodprod?.addEventListener('keyup', (e) => {
        txtPosCodprod.value = txtPosCodprod.value.toUpperCase();
        if (e.code === 'Enter' || e.keyCode === 13) document.getElementById('btnBuscarProd')?.click();
    });
    document.getElementById('btnBuscarProd')?.addEventListener('click', () => {
        txtPosCodprod.value = txtPosCodprod.value.toUpperCase();
        const filtro = txtPosCodprod.value || '';
        if (filtro) fac2_get_buscar_producto(filtro);
    });

    document.getElementById('btnMCGuardar')?.addEventListener('click', () => {
        const modal = fac2_getModalEl('modal_pos2_cantidad');
        const btn = modal?.querySelector('#btnMCGuardar') || document.getElementById('btnMCGuardar');
        if (btn?.disabled) return;

        const doc = fac2_get_doc_activo();
        if (!doc) return;
        if (!fac2_validar_cliente_seleccionado()) return;

        const cantidad = Number(modal?.querySelector('#txtMCCantidad')?.value || 1);
        const preciounitario = Number(modal?.querySelector('#txtMCPrecio')?.value || 0);
        const descuento = 0;
        if (preciounitario === 0) { F.AvisoError('Precio inválido'); return; }
        if (preciounitario < Number(Selected_costo)) { F.AvisoError('Precio menor al costo'); return; }
        const tipoprecio = data_empresa_config?.TIPO_PRECIO || '';

        const btnHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-sync fa-spin mr-1"></i> Agregando...';

        fac2_insert_item_api(doc.coddoc, doc.correlativo, Selected_codprod, Selected_desprod, Selected_codmedida,
            cantidad, Selected_equivale, Selected_costo, preciounitario, descuento, Selected_tipoprod, tipoprecio,
            Selected_existencia, Selected_bono, Selected_exento)
            .then(() => {
                fac2_$('modal_pos2_cantidad').modal('hide');
                F.showToast('Producto agregado ' + Selected_desprod);
                fac2_get_tbl_pedido();
                txtPosCodprod.focus();
            })
            .catch(() => F.AvisoError('No se pudo agregar'))
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = btnHtml;
            });
    });

    document.getElementById('txtMCCantidad')?.addEventListener('input', fac2_CalcularTotalPrecio);
    document.getElementById('txtMCPrecio')?.addEventListener('input', fac2_CalcularTotalPrecio);

    document.getElementById('btnMCGuardarE')?.addEventListener('click', () => {
        const modal = fac2_getModalEl('modal_pos2_editar_cantidad');
        const btn = modal?.querySelector('#btnMCGuardarE') || document.getElementById('btnMCGuardarE');
        if (btn?.disabled) return;

        const doc = fac2_get_doc_activo();
        if (!doc) return;

        const cantidad = Number(modal?.querySelector('#txtMCCantidadE')?.value || 1);
        const preciounitario = Number(modal?.querySelector('#txtMCPrecioE')?.value || 0);
        const descuento = Number(typeof Selected_descuento !== 'undefined' ? Selected_descuento : 0) || 0;
        if (preciounitario === 0) { F.AvisoError('Precio inválido'); return; }
        if (preciounitario < Number(Selected_costo)) { F.AvisoError('Precio menor al costo'); return; }
        const tipoprecio = data_empresa_config?.TIPO_PRECIO || '';

        const btnHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-sync fa-spin mr-1"></i> Guardando...';

        GF.get_documento_eliminar_item(Selected_id)
            .then(() => fac2_insert_item_api(doc.coddoc, doc.correlativo, Selected_codprod, Selected_desprod,
                Selected_codmedida, cantidad, Selected_equivale, Selected_costo, preciounitario, descuento,
                Selected_tipoprod, tipoprecio, Selected_existencia, Selected_bono, Selected_exento))
            .then(() => {
                fac2_$('modal_pos2_editar_cantidad').modal('hide');
                fac2_get_tbl_pedido();
                txtPosCodprod?.focus();
            })
            .catch(() => F.AvisoError('No se pudo actualizar'))
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = btnHtml;
            });
    });
    document.getElementById('txtMCCantidadE')?.addEventListener('input', fac2_CalcularTotalPrecioEditar);
    document.getElementById('txtMCPrecioE')?.addEventListener('input', fac2_CalcularTotalPrecioEditar);

    fac2_listener_cliente();
    fac2_listener_teclado();

    const btnPosDocumentoAtras = document.getElementById('btnPosDocumentoAtras');
    btnPosDocumentoAtras?.addEventListener('click', () => {
        document.getElementById('tab-pedido')?.click();
    });

    const btnPosEscanearBarcode = document.getElementById('btnPosEscanearBarcode');
    if (btnPosEscanearBarcode && btnPosEscanearBarcode.dataset.fac2Bound !== '1') {
        btnPosEscanearBarcode.dataset.fac2Bound = '1';
        btnPosEscanearBarcode.addEventListener('click', () => {
            fac2_$('modal_pos2_barcode').modal('show');
            if (typeof pos2_iniciarBarcode === 'function') pos2_iniciarBarcode();
        });
    }
    const modalBarcode = document.getElementById('modal_pos2_barcode');
    if (modalBarcode && modalBarcode.dataset.fac2BarcodeBound !== '1') {
        modalBarcode.dataset.fac2BarcodeBound = '1';
        $(modalBarcode).on('hidden.bs.modal', () => {
            if (typeof pos2_detenerBarcode === 'function') pos2_detenerBarcode();
        });
    }

    if (typeof F.slideAnimationTabs === 'function') F.slideAnimationTabs();
    document.getElementById('txtFecha').value = F.getFecha();
    document.getElementById('txtPosCodprod')?.focus();
}

function fac2_listener_cliente() {
    const txtDir = document.getElementById('txtPosCobroDireccion');
    if (txtDir && !txtDir.value) txtDir.value = 'CIUDAD';

    const txtNit = document.getElementById('txtPosCobroNit');
    txtNit?.addEventListener('keyup', (e) => {
        const nitRaw = txtNit.value.toUpperCase();
        if (e.code !== 'Enter' && e.keyCode !== 13) return;
        fac2_fcn_buscar_cliente(nitRaw)
            .catch(() => {
                const nit = txtNit.value.replace('-', '').replace(' ', '');
                F.GetDataNit(nit).then((json) => {
                    document.getElementById('txtPosCobroNitclie').value = '';
                    document.getElementById('txtPosCobroNombre').value = json;
                    document.getElementById('txtPosCobroDireccion').value = 'CIUDAD';
                    document.getElementById('txtPosCobroNombre')?.focus();
                    fac2_programar_sync_encabezado();
                });
            });
    });

    document.getElementById('btnBuscarCliente')?.addEventListener('click', () => {
        fac2_$('modal_pos2_lista_clientes').modal('show');
        document.getElementById('tblDataClientes').innerHTML = '';
        document.getElementById('txtBuscarClie').value = '';
        document.getElementById('txtBuscarClie')?.focus();
    });

    document.getElementById('txtBuscarClie')?.addEventListener('keyup', (e) => {
        if (e.code === 'Enter' || (e.keyCode === 13 && !e.shiftKey)) {
            document.getElementById('btnBuscarClie')?.click();
        }
    });

    document.getElementById('btnBuscarClie')?.addEventListener('click', () => {
        const filtro = document.getElementById('txtBuscarClie')?.value || '';
        fac2_tbl_clientes(filtro);
    });

    document.getElementById('btnNuevoCliente')?.addEventListener('click', () => {
        const nit = document.getElementById('txtPosCobroNit')?.value || 'CF';
        const nombre = document.getElementById('txtPosCobroNombre')?.value || 'SN';
        const direccion = document.getElementById('txtPosCobroDireccion')?.value || 'CIUDAD';
        const telefono = document.getElementById('txtPosCobroTelefono')?.value || '';
        const btn = document.getElementById('btnNuevoCliente');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fal fa-sync fa-spin"></i>';
        }
        fac2_insert_cliente(nit, nombre, direccion, telefono)
            .then((data) => {
                const codcli = data.recordset?.[0]?.CODCLIENTE || '';
                document.getElementById('txtPosCobroNitclie').value = codcli;
                F.Aviso('Cliente creado exitosamente');
                fac2_programar_sync_encabezado();
            })
            .catch(() => F.AvisoError('No se pudo crear el cliente'))
            .finally(() => {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fal fa-user-plus"></i> Nuevo';
                }
            });
    });
}

function fac2_listener_teclado() {
    if (typeof Mousetrap === 'undefined') return;
    Mousetrap.bind('f5', (e) => { e.preventDefault(); });
    Mousetrap.bind('f7', (e) => { e.preventDefault(); });
    Mousetrap.bind('f10', (e) => { e.preventDefault(); });
    Mousetrap.bind('f11', (e) => { e.preventDefault(); });
    Mousetrap.bind('f12', (e) => { e.preventDefault(); });
    Mousetrap.bind('ctrl+right', () => { document.getElementById('tab-documento')?.click(); });
    Mousetrap.bind('ctrl+left', () => { document.getElementById('tab-pedido')?.click(); });
    Mousetrap.bind('ctrl+g', (e) => {
        e.preventDefault();
        document.getElementById('btnGuardarFactura')?.click();
    });
    Mousetrap.bind('f2', () => {
        document.getElementById('tab-pedido')?.click();
        const inp = document.getElementById('txtPosCodprod');
        if (inp) { inp.value = ''; inp.focus(); }
    });
    Mousetrap.bind('f3', (e) => {
        e.preventDefault();
        document.getElementById('btnBuscarCliente')?.click();
    });
}

var fac2_listaCache = [];

function fac2_toggle_fab_nuevo(visible) {
    document.body.classList.toggle('fac2-en-ingreso', !visible);
    const btn = document.getElementById('btnFac2Nuevo');
    if (!btn) return;
    btn.classList.toggle('d-none', !visible);
}

function fac2_show_ingreso_loader(mensaje) {
    const el = document.getElementById('fac2IngresoLoader');
    const inner = document.getElementById('fac2IngresoLoaderInner');
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

function fac2_hide_ingreso_loader() {
    const el = document.getElementById('fac2IngresoLoader');
    if (!el) return;
    el.classList.add('d-none');
    el.setAttribute('aria-hidden', 'true');
}

function fac2_show_listado() {
    fac2_hide_ingreso_loader();
    document.getElementById('fac2Listado')?.classList.remove('d-none');
    document.getElementById('fac2Ingreso')?.classList.add('d-none');
    document.getElementById('lbFac2Titulo').innerText = 'Facturación';
    document.getElementById('lbFac2BarLabel')?.classList.remove('d-none');
    document.getElementById('lbFac2TotalBar')?.classList.remove('d-none');
    document.getElementById('fac2BarIngreso')?.classList.add('d-none');
    fac2_toggle_fab_nuevo(true);
    fac2_cargar_listado();
}

function fac2_show_ingreso(opts) {
    opts = opts || {};
    document.getElementById('fac2Listado')?.classList.add('d-none');
    document.getElementById('fac2Ingreso')?.classList.remove('d-none');
    document.getElementById('lbFac2Titulo').innerText = opts.titulo || 'Nueva factura';
    document.getElementById('lbFac2BarLabel')?.classList.add('d-none');
    document.getElementById('lbFac2TotalBar')?.classList.add('d-none');
    document.getElementById('fac2BarIngreso')?.classList.remove('d-none');
    fac2_toggle_fab_nuevo(false);
    fac2_setup_ingreso_listeners();
    if (opts.skipClientes) {
        if (!opts.skipNuevo && typeof fac2_iniciar_documento_nuevo === 'function') {
            fac2_iniciar_documento_nuevo();
        }
        return;
    }
    if (!opts.skipNuevo && typeof fac2_iniciar_documento_nuevo === 'function') {
        fac2_iniciar_documento_nuevo();
    }
}

function fac2_volver_listado() {
    if (typeof fac2_abandonar_documento === 'function') {
        fac2_abandonar_documento().finally(() => fac2_show_listado());
    } else {
        fac2_show_listado();
    }
}

function fac2_iniciar_nuevo() {
    if (typeof fac2_reset_sesion === 'function') fac2_reset_sesion();
    fac2_show_ingreso({ titulo: 'Nueva factura' });
}

function fac2_label_pago(concre) {
    if (concre === 'CRE') return 'CRÉDITO';
    if (concre === 'CON') return 'CONTADO';
    return concre || '—';
}

function fac2_render_tabla(records) {
    const container = document.getElementById('tblDataFac2');
    const lbResumen = document.getElementById('lbFac2Resumen');
    const lbTotal = document.getElementById('lbFac2TotalBar');
    if (!container) return;

    if (!records.length) {
        container.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No hay facturas para la fecha seleccionada.</td></tr>';
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
        const idBtnEdit = `btnF2Edit${docKey.replace(/[^a-zA-Z0-9]/g, '')}`;
        const idBtnPrint = `btnF2Print${docKey.replace(/[^a-zA-Z0-9]/g, '')}`;
        const idBtnDel = `btnF2Del${docKey.replace(/[^a-zA-Z0-9]/g, '')}`;
        const st = rows.ST || 'O';
        const pago = fac2_label_pago(rows.CONCRE);
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
                    onclick="fac2_editar_documento('${rows.CODDOC}','${rows.CORRELATIVO}','${st}','${idBtnEdit}')" ${anulado ? 'disabled' : ''}>
                    <i class="fal fa-edit"></i>
                </button>
                <button type="button" class="btn btn-circle btn-verde btn-sm hand shadow mr-1" id="${idBtnPrint}" title="Imprimir"
                    onclick="fac2_imprimir_documento('${rows.CODDOC}','${rows.CORRELATIVO}','${idBtnPrint}')">
                    <i class="fal fa-print"></i>
                </button>
                <button type="button" class="btn btn-circle btn-danger btn-sm hand shadow" id="${idBtnDel}" title="Eliminar"
                    onclick="fac2_eliminar_documento_listado('${rows.CODDOC}','${rows.CORRELATIVO}','${st}','${idBtnDel}')" ${anulado ? 'disabled' : ''}>
                    <i class="fal fa-trash"></i>
                </button>
            </td>
        </tr>`;
    });
    container.innerHTML = str;
    if (lbResumen) lbResumen.innerText = records.length + ' documento' + (records.length === 1 ? '' : 's');
    if (lbTotal) lbTotal.innerText = F.setMoneda(total, 'Q');
    const txtBuscar = document.getElementById('txtFac2Buscar');
    if (txtBuscar?.value) F.crearBusquedaTabla('tblFac2', 'txtFac2Buscar');
}

function fac2_cargar_listado() {
    const container = document.getElementById('tblDataFac2');
    if (container) container.innerHTML = GlobalLoader;
    axios.post('/pos/lista_documentos', {
        sucursal: GlobalEmpnit,
        tipo: 'FAC',
        fecha: F.devuelveFecha('txtFac2Fecha')
    }).then((response) => {
        fac2_listaCache = response.data.recordset || [];
        fac2_render_tabla(fac2_listaCache);
    }).catch(() => {
        fac2_listaCache = [];
        fac2_render_tabla([]);
        F.AvisoError('No se pudo cargar el listado de facturas');
    });
}

window.fac2_show_ingreso_loader = fac2_show_ingreso_loader;
window.fac2_hide_ingreso_loader = fac2_hide_ingreso_loader;
window.fac2_reset_modal_bindings = fac2_reset_modal_bindings;
window.fac2_show_listado = fac2_show_listado;
window.fac2_show_ingreso = fac2_show_ingreso;
window.fac2_volver_listado = fac2_volver_listado;
window.fac2_on_guardado_exitoso = fac2_volver_listado;

window.fac2_calcular_descuento = fac2_calcular_descuento;
window.sygma_build_fac_ticket_html = fac2_build_ticket_html;
window.fac2_get_producto = fac2_get_producto;
window.fac2_edit_item_pedido = fac2_edit_item_pedido;
window.fac2_delete_item_pedido = fac2_delete_item_pedido;
window.fac2_editar_documento = fac2_editar_documento;
window.fac2_imprimir_documento = fac2_imprimir_documento;
window.fac2_eliminar_documento_listado = fac2_eliminar_documento_listado;
