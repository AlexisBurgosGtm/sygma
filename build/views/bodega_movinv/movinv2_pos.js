'use strict';

/** Movimientos de Inventario v2 — flujo POS: documento en BD primero, líneas en DOCPRODUCTOS después */

var movinv2_tipoDoc = 'ENT';
var movinv2_ingresoListenersReady = false;
var movinv2_docActivo = null;
var movinv2_syncTimer = null;
var movinv2_modoEdicion = false;

function movinv2_reset_sesion() {
    movinv2_docActivo = null;
    movinv2_modoEdicion = false;
    if (movinv2_syncTimer) {
        clearTimeout(movinv2_syncTimer);
        movinv2_syncTimer = null;
    }
}

function movinv2_get_doc_activo() {
    if (!movinv2_docActivo) {
        F.AvisoError('No hay documento activo');
        return null;
    }
    return movinv2_docActivo;
}

function movinv2_actualizar_ref_doc() {
    const lb = document.getElementById('lbMovinv2DocRef');
    if (!lb) return;
    if (movinv2_docActivo) {
        lb.innerText = `${movinv2_docActivo.coddoc}-${movinv2_docActivo.correlativo}`;
    } else {
        lb.innerText = '';
    }
}

function movinv2_bloquear_serie_doc(bloquear) {
    ['cmbTipoDocumento', 'cmbCoddoc'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.disabled = !!bloquear;
    });
}

function movinv2_calcular_descuento(idDescuento, idTotalPrecio, idTotalPrecioDescuento) {
    try {
        const descuento = Number(document.getElementById(idDescuento)?.value || 0);
        const totalprecio = Number(document.getElementById(idTotalPrecio)?.value || 0);
        document.getElementById(idTotalPrecioDescuento).value = totalprecio - descuento;
    } catch (e) {
        const totalprecio = Number(document.getElementById(idTotalPrecio)?.value || 0);
        document.getElementById(idTotalPrecioDescuento).value = totalprecio;
    }
}

function movinv2_CalcularTotalPrecio() {
    const cantidad = document.getElementById('txtMCCantidad')?.value || 1;
    const precio = document.getElementById('txtMCPrecio')?.value;
    const el = document.getElementById('txtMCTotalPrecio');
    if (el) el.value = (Number(cantidad) * Number(precio)).toFixed(2);
}

function movinv2_CalcularTotalPrecioEditar() {
    const cantidad = document.getElementById('txtMCCantidadE')?.value || 1;
    const precio = document.getElementById('txtMCPrecioE')?.value;
    const el = document.getElementById('txtMCTotalPrecioE');
    if (el) el.value = (Number(cantidad) * Number(precio)).toFixed(2);
}

function movinv2_get_correlativo(coddoc) {
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

function movinv2_get_coddoc(tipo, containerId) {
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

function movinv2_cargar_select_coddoc_nuevo() {
    return movinv2_get_coddoc(movinv2_tipoDoc, 'cmbMovinv2CoddocNuevo');
}

function movinv2_aplicar_coddoc_desde_listado() {
    const preferido = document.getElementById('cmbMovinv2CoddocNuevo')?.value || '';
    const cmbCoddoc = document.getElementById('cmbCoddoc');
    if (!preferido || !cmbCoddoc) return;
    const found = Array.from(cmbCoddoc.options).some((o) => o.value === preferido);
    if (found) cmbCoddoc.value = preferido;
}

window.movinv2_cargar_select_coddoc_nuevo = movinv2_cargar_select_coddoc_nuevo;

function movinv2_listener_coddoc() {
    const cmbTipoDocumento = document.getElementById('cmbTipoDocumento');
    cmbTipoDocumento?.addEventListener('change', () => {
        if (movinv2_docActivo) return;
        movinv2_get_coddoc(cmbTipoDocumento.value);
    });
}

function movinv2_get_vendedores() {
    GF.get_data_empleados_tipo(2)
        .then((data) => {
            let str = '';
            data.recordset.map((r) => { str += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>`; });
            document.getElementById('cmbVendedor').innerHTML = str;
        })
        .catch(() => {
            document.getElementById('cmbVendedor').innerHTML = '<option value="1">SIN VENDEDOR</option>';
        });
}

function movinv2_get_cajas() {
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

function movinv2_cargar_select_empresas() {
    const sel = document.getElementById('cmbEmpresas');
    if (!sel) return Promise.resolve();
    return GF.get_data_empresas()
        .then((data) => {
            let str = '<option value="SN">NO SELECCIONADO</option>';
            (data.recordset || []).forEach((r) => {
                str += `<option value="${r.EMPNIT}">${r.NOMBRE}</option>`;
            });
            sel.innerHTML = str;
        })
        .catch(() => {
            sel.innerHTML = '<option value="SN">NO SELECCIONADO</option>';
        });
}

function movinv2_leer_encabezado_form() {
    const txtFecha = new Date(document.getElementById('txtFecha').value);
    return {
        codcliente: 0,
        nitclie: 'CF',
        nomclie: 'PROVEEDORES VARIOS',
        dirclie: 'CIUDAD',
        sucursal_destino: document.getElementById('cmbEmpresas')?.value || 'SN',
        tipo_doc: 'TRAS',
        obs: F.limpiarTexto(document.getElementById('txtObs')?.value || ''),
        codven: document.getElementById('cmbVendedor')?.value || '0',
        tipo_pago: document.getElementById('cmbConCre')?.value || 'CON',
        codcaja: document.getElementById('cmbCaja')?.value || '0',
        fecha: F.devuelveFecha('txtFecha'),
        fechaentrega: F.devuelveFecha('txtFechaPago'),
        anio: txtFecha.getFullYear(),
        mes: txtFecha.getUTCMonth() + 1,
        hora: F.getHora(),
        serie_fac: document.getElementById('txtSerieFac')?.value || '',
        numero_fac: document.getElementById('txtNumeroFac')?.value || '',
        etiqueta: document.getElementById('cmbPrioridad')?.value || 'BAJA',
        coddoc_origen: document.getElementById('txtCoddocOrigen')?.value || '',
        correlativo_origen: document.getElementById('txtCorrelativoOrigen')?.value || '0',
        coddoc: document.getElementById('cmbCoddoc')?.value || '',
        correlativo: document.getElementById('txtCorrelativo')?.value || '0'
    };
}

function movinv2_sync_encabezado() {
    const doc = movinv2_get_doc_activo();
    if (!doc) return Promise.resolve();
    const h = movinv2_leer_encabezado_form();
    return axios.post('/inventarios/update_encabezado_movinv', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        coddoc: doc.coddoc,
        correlativo: doc.correlativo,
        codcliente: h.codcliente,
        nomclie: h.nomclie,
        nitclie: h.nitclie,
        dirclie: h.dirclie,
        sucursal_destino: h.sucursal_destino,
        obs: h.obs,
        codven: h.codven,
        tipo_pago: h.tipo_pago,
        codcaja: h.codcaja,
        fecha: h.fecha,
        fechaentrega: h.fechaentrega,
        serie_fac: h.serie_fac,
        numero_fac: h.numero_fac,
        etiqueta: h.etiqueta,
        coddoc_origen: h.coddoc_origen,
        correlativo_origen: h.correlativo_origen
    });
}

function movinv2_programar_sync_encabezado() {
    if (movinv2_syncTimer) clearTimeout(movinv2_syncTimer);
    movinv2_syncTimer = setTimeout(() => {
        movinv2_sync_encabezado().catch(() => {});
    }, 600);
}

function movinv2_reset_campos_form() {
    GlobalTotalDocumento = 0;
    GlobalTotalDescuento = 0;
    GlobalTotalCostoDocumento = 0;

    document.getElementById('txtFechaPago').value = F.getFecha();
    document.getElementById('txtFecha').value = F.getFecha();
    document.getElementById('txtPosCobroNit').value = 'CF';
    document.getElementById('txtPosCobroNitclie').value = '0';
    document.getElementById('txtPosCobroNombre').value = 'PROVEEDORES VARIOS';
    document.getElementById('txtPosCobroDireccion').value = 'CIUDAD';
    const selEmp = document.getElementById('cmbEmpresas');
    if (selEmp) selEmp.value = 'SN';
    document.getElementById('txtSerieFac').value = '';
    document.getElementById('txtNumeroFac').value = '';
    document.getElementById('txtCoddocOrigen').value = '';
    document.getElementById('txtCorrelativoOrigen').value = '';
    document.getElementById('txtObs').value = '';

    movinv2_bloquear_serie_doc(false);
    movinv2_actualizar_ref_doc();
}

function movinv2_crear_documento_api(h) {
    return axios.post('/inventarios/insert_documento_abierto', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        coddoc: h.coddoc,
        correlativo: h.correlativo,
        serie_fac: h.serie_fac,
        numero_fac: h.numero_fac,
        coddoc_origen: h.coddoc_origen,
        correlativo_origen: h.correlativo_origen,
        sucursal_destino: h.sucursal_destino,
        anio: h.anio,
        mes: h.mes,
        fecha: h.fecha,
        fechaentrega: h.fechaentrega,
        codbodega: GlobalCodBodega,
        codcliente: 0,
        nomclie: 'PROVEEDORES VARIOS',
        nitclie: 'CF',
        dirclie: 'CIUDAD',
        tipo_doc: 'TRAS',
        obs: '',
        usuario: GlobalUsuario,
        codven: h.codven,
        hora: h.hora,
        tipo_pago: h.tipo_pago,
        codcaja: h.codcaja,
        iva: GlobalConfigIVA,
        etiqueta: h.etiqueta
    }).then((response) => {
        if (response.data === 'error' || Number(response.data?.rowsAffected?.[0] || 0) === 0) {
            throw new Error('insert');
        }
        movinv2_docActivo = { coddoc: h.coddoc, correlativo: h.correlativo };
        movinv2_bloquear_serie_doc(true);
        movinv2_actualizar_ref_doc();
        movinv2_get_tbl_pedido();
    });
}

function movinv2_iniciar_documento_nuevo() {
    if (typeof movinv2_show_ingreso_loader === 'function') {
        movinv2_show_ingreso_loader('Creando documento');
    }
    movinv2_reset_campos_form();
    const lbRef = document.getElementById('lbMovinv2DocRef');
    if (lbRef) lbRef.innerText = 'Creando documento...';

    movinv2_get_coddoc(movinv2_tipoDoc)
        .then(() => {
            movinv2_aplicar_coddoc_desde_listado();
            const cmbCoddoc = document.getElementById('cmbCoddoc');
            if (!cmbCoddoc?.value) {
                F.AvisoError('No hay serie de documento configurada');
                return Promise.reject();
            }
            return movinv2_get_correlativo(cmbCoddoc.value)
                .then((correlativo) => {
                    document.getElementById('txtCorrelativo').value = correlativo;
                    const h = movinv2_leer_encabezado_form();
                    return movinv2_crear_documento_api(h);
                });
        })
        .then(() => {
            F.showToast('Documento creado — agregue productos');
            document.getElementById('txtPosCodprod')?.focus();
        })
        .catch(() => {
            F.AvisoError('No se pudo crear el documento de movimiento');
            if (lbRef) lbRef.innerText = '';
        })
        .finally(() => {
            if (typeof movinv2_hide_ingreso_loader === 'function') movinv2_hide_ingreso_loader();
        });
}

function movinv2_insert_item_api(coddoc, correlativo, codprod, desprod, codmedida, cantidad, equivale, costo, precio, descuento, tipoprod, tipoprecio, existencia, bono, exento) {
    const totalunidades = Number(cantidad) * Number(equivale);
    const totalcosto = Number(costo) * Number(cantidad);
    const totalprecio = Number(precio) * Number(cantidad);
    return axios.post('/inventarios/insert_item_movinv', {
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

function movinv2_get_tbl_pedido() {
    const doc = movinv2_docActivo;
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
                const descTxt = Number(r.DESCUENTO) > 0 ? F.setMoneda(r.DESCUENTO, 'Q') : '—';
                return `
            <tr>
                <td class="sygma-embarque-rpt__cod">
                    <span class="sygma-embarque-rpt__cod-main">${r.CODPROD}</span>
                    <span class="sygma-embarque-rpt__cod-sub">${r.CODMEDIDA} · eq ${r.EQUIVALE}</span>
                </td>
                <td class="sygma-embarque-rpt__prod">
                    <span class="sygma-embarque-rpt__prod-main">${r.DESPROD}</span>
                    <span class="sygma-embarque-rpt__prod-sub">${r.DESMARCA || ''}</span>
                </td>
                <td class="text-center"><b class="text-info">${r.CANTIDAD}</b></td>
                <td class="text-center">${r.CODMEDIDA}</td>
                <td class="text-right">${F.setMoneda(r.COSTO, 'Q')}</td>
                <td class="text-right text-danger">${descTxt}</td>
                <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(imp, 'Q')}</td>
                <td class="text-center text-nowrap sygma-embarque-rpt__col-action">
                    <button type="button" class="btn btn-sm btn-circle btn-info shadow hand mr-1" title="Editar" onclick="movinv2_edit_item_pedido('${r.ID}','${r.CODPROD}','${F.limpiarTexto(r.DESPROD)}','${r.CODMEDIDA}','${r.EQUIVALE}','${r.CANTIDAD}','${r.COSTO}','${r.COSTO}','${r.TIPOPROD}','${r.EXENTO}','${r.EXISTENCIA || 0}','${r.BONO || 0}','${r.DESCUENTO}')"><i class="fal fa-edit"></i></button>
                    <button type="button" class="btn btn-sm btn-circle btn-danger shadow hand" title="Quitar" onclick="movinv2_delete_item_pedido('${r.ID}')"><i class="fal fa-trash"></i></button>
                </td>
            </tr>`;
            }).join('\n');

            const totalNeto = varTotalVenta - varTotalDescuento;
            container.innerHTML = html || '<tr><td colspan="8" class="text-center text-muted py-3">Agregue productos con el buscador</td></tr>';

            GlobalTotalCostoDocumento = varTotalCosto;
            GlobalTotalDocumento = varTotalVenta;
            GlobalTotalDescuento = varTotalDescuento;

            document.getElementById('lbTotalItems').innerText = varTotalItems + ' items';
            document.getElementById('lbTotalVenta').innerText = F.setMoneda(varTotalVenta, 'Q');
            document.getElementById('lbTotalDescuento').innerText = `- ${F.setMoneda(varTotalDescuento, 'Q')}`;
            document.getElementById('lbTotalVentaDescuento').innerText = F.setMoneda(totalNeto, 'Q');
            document.getElementById('lbPosCobroTotalPagar').innerText = F.setMoneda(totalNeto, 'Q');

            const lbDetItems = document.getElementById('lbMovinv2DetalleItems');
            if (lbDetItems) lbDetItems.innerText = `${varTotalItems} item${varTotalItems === 1 ? '' : 's'}`;

            const totalBlock = document.getElementById('lbMovinv2DetalleTotal');
            if (totalBlock) {
                totalBlock.innerHTML = varTotalItems > 0 ? `
                    <div class="sygma-embarque-rpt__total-inner">
                        <span class="sygma-embarque-rpt__foot-label">TOTAL MOVIMIENTO</span>
                        <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(totalNeto, 'Q')}</span>
                    </div>` : '';
            }

            GF.get_documento_update_totales(doc.coddoc, doc.correlativo, varTotalCosto, varTotalDescuento, varTotalVenta)
                .catch(() => {});
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-3">Agregue productos con el buscador</td></tr>';
            GlobalTotalCostoDocumento = 0;
            GlobalTotalDocumento = 0;
            GlobalTotalDescuento = 0;
            document.getElementById('lbTotalItems').innerText = '0 items';
            document.getElementById('lbTotalVentaDescuento').innerText = F.setMoneda(0, 'Q');
            document.getElementById('lbPosCobroTotalPagar').innerText = F.setMoneda(0, 'Q');
            const lbDetItems = document.getElementById('lbMovinv2DetalleItems');
            if (lbDetItems) lbDetItems.innerText = '0 items';
            const totalBlock = document.getElementById('lbMovinv2DetalleTotal');
            if (totalBlock) totalBlock.innerHTML = '';
        });
}

function movinv2_get_buscar_producto(filtro) {
    const doc = movinv2_get_doc_activo();
    if (!doc) return;

    $('#modal_lista_precios').modal('show');
    const container = document.getElementById('tblDataProductos');
    container.innerHTML = GlobalLoader;
    const btn = document.getElementById('btnBuscarProd');
    btn.innerHTML = '<i class="fal fa-sync fa-spin"></i>';
    btn.disabled = true;

    const tipoprecio = (typeof data_empresa_config !== 'undefined' && data_empresa_config) ? data_empresa_config.TIPO_PRECIO : '';

    axios.post('/pos/productos_filtro_movinv', {
        sucursal: GlobalEmpnit,
        token: TOKEN,
        filtro: filtro,
        tipoprecio: tipoprecio
    }).then((response) => {
        let str = '';
        if (response !== 'error' && response.data?.recordset) {
            response.data.recordset.map((r) => {
                const clsExist = Number(r.EXISTENCIA) <= 0 ? 'text-danger' : '';
                str += `<tr class="hand" onclick="movinv2_get_producto('${r.CODPROD}','${F.limpiarTexto(r.DESPROD)}','${F.limpiarTexto(r.DESPROD2)}','${r.CODMEDIDA}','${r.EQUIVALE}','${r.COSTO}','${r.COSTO}','${r.TIPOPROD}','${r.EXENTO}','${r.EXISTENCIA}','${r.BONO}')">
                    <td class="sygma-embarque-rpt__cod">
                        <span class="sygma-embarque-rpt__cod-main">${r.CODPROD}</span>
                        <span class="sygma-embarque-rpt__cod-sub">${r.TIPOPROD || ''}</span>
                    </td>
                    <td class="sygma-embarque-rpt__prod">
                        <span class="sygma-embarque-rpt__prod-main" style="color:${r.COLOR || 'inherit'}">${r.DESPROD}</span>
                        <span class="sygma-embarque-rpt__prod-sub">${r.DESMARCA || ''}${r.DESPROD2 ? ` · ${r.DESPROD2}` : ''}</span>
                    </td>
                    <td class="text-center">${r.CODMEDIDA}<br><small class="text-muted">Eq ${r.EQUIVALE}</small></td>
                    <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(r.COSTO, 'Q')}</td>
                    <td class="text-right ${clsExist}"><b>${r.EXISTENCIA}</b></td>
                    <td>${r.TIPOPROD}</td>
                </tr>`;
            });
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

function movinv2_llenar_medida_container(containerId, codmedida, equivale) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
        <label class="negrita text-secondary d-block mb-1">Medida</label>
        <div class="form-control negrita border-base bg-white">${codmedida || '—'}</div>
        <div class="small text-muted mt-1">Eq: ${equivale || 1}</div>`;
}

function movinv2_get_producto(codprod, desprod, desprod2, codmedida, equivale, costo, precio, tipoprod, exento, existencia, bono) {
    if (!movinv2_get_doc_activo()) return;

    $('#modal_lista_precios').modal('hide');
    $('#modal_cantidad').modal('show');

    Selected_codprod = codprod;
    Selected_desprod = desprod;
    Selected_desprod2 = desprod2;
    Selected_codmedida = codmedida;
    Selected_equivale = Number(equivale);
    Selected_costo = Number(costo);
    Selected_precio = Number(precio);
    Selected_tipoprod = tipoprod;
    Selected_exento = Number(exento);
    Selected_existencia = Number(existencia);
    Selected_bono = Number(bono);
    Selected_descuento = 0;

    document.getElementById('lbCantidadDesprod').innerText = desprod;
    movinv2_llenar_medida_container('container_precio', codmedida, equivale);
    document.getElementById('txtMCCantidad').value = '';
    document.getElementById('txtMCPrecio').value = costo;
    movinv2_CalcularTotalPrecio();
    document.getElementById('txtPosCodprod').value = '';
    document.getElementById('txtMCCantidad').focus();
}

function movinv2_edit_item_pedido(id, codprod, desprod, codmedida, equivale, cantidad, costo, precio, tipoprod, exento, existencia, bono, descuento) {
    $('#modal_editar_cantidad').modal('show');
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
    Selected_descuento = Number(descuento) || 0;
    document.getElementById('lbCantidadDesprodE').innerText = desprod;
    movinv2_llenar_medida_container('container_precio_editar', codmedida, equivale);
    document.getElementById('txtMCCantidadE').value = cantidad;
    document.getElementById('txtMCPrecioE').value = costo;
    movinv2_CalcularTotalPrecioEditar();
    document.getElementById('txtMCCantidadE').focus();
}

function movinv2_delete_item_pedido(id) {
    const doc = movinv2_get_doc_activo();
    if (!doc) return;

    F.Confirmacion('¿Está seguro que desea quitar este item?').then((value) => {
        if (value !== true) return;
        GF.get_documento_eliminar_item(id)
            .then(() => {
                F.showToast('Item eliminado');
                movinv2_get_tbl_pedido();
            })
            .catch(() => F.AvisoError('No se pudo quitar este item'));
    });
}

function movinv2_guardar_click() {
    const btn = document.getElementById('btnGuardarFactura');
    if (btn?.disabled) return;
    F.Confirmacion('¿Está seguro que desea guardar este movimiento de inventario?')
        .then((value) => {
            if (value !== true) return;
            movinv2_finalizar_movinv();
        });
}

function movinv2_finalizar_movinv() {
    const doc = movinv2_get_doc_activo();
    if (!doc) return Promise.resolve();

    if (Number(GlobalTotalDocumento || 0) === 0) {
        F.AvisoError('No hay productos agregados');
        return Promise.resolve();
    }

    const btnGuardarFactura = document.getElementById('btnGuardarFactura');
    const btnHtml = btnGuardarFactura ? btnGuardarFactura.innerHTML : '';

    if (btnGuardarFactura) {
        btnGuardarFactura.disabled = true;
        btnGuardarFactura.innerHTML = '<i class="fal fa-save fa-spin mr-1"></i> Guardando...';
    }

    return movinv2_sync_encabezado()
        .then(() => {
            F.Aviso(movinv2_modoEdicion ? 'Cambios guardados exitosamente' : 'Movimiento guardado exitosamente');
            movinv2_reset_sesion();
            movinv2_reset_campos_form();
            if (typeof movinv2_on_guardado_exitoso === 'function') {
                movinv2_on_guardado_exitoso();
            }
        })
        .catch(() => F.AvisoError('No se pudo guardar el movimiento'))
        .finally(() => {
            if (btnGuardarFactura) {
                btnGuardarFactura.disabled = false;
                btnGuardarFactura.innerHTML = btnHtml || '<i class="fal fa-save mr-1"></i> Guardar movimiento';
            }
        });
}

function movinv2_abandonar_documento() {
    const doc = movinv2_docActivo;
    if (!doc) {
        movinv2_reset_sesion();
        return Promise.resolve();
    }

    if (movinv2_modoEdicion) {
        return movinv2_sync_encabezado().finally(() => movinv2_reset_sesion());
    }

    const sinProductos = Number(GlobalTotalDocumento || 0) === 0;

    if (sinProductos) {
        return axios.post('/documentos/eliminar_documento', {
            token: TOKEN,
            sucursal: GlobalEmpnit,
            coddoc: doc.coddoc,
            correlativo: doc.correlativo
        }).catch(() => {}).finally(() => movinv2_reset_sesion());
    }

    return movinv2_sync_encabezado().finally(() => movinv2_reset_sesion());
}

function movinv2_fecha_para_input(val) {
    if (!val) return '';
    try {
        return val.toString().replace('T00:00:00.000Z', '').substring(0, 10);
    } catch (e) {
        return '';
    }
}

function movinv2_aplicar_encabezado_form(r) {
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val ?? '';
    };

    setVal('txtPosCobroNit', r.NIT || 'CF');
    setVal('txtPosCobroNitclie', r.CODCLIENTE || '0');
    setVal('txtPosCobroNombre', r.NOMCLIE || 'PROVEEDORES VARIOS');
    setVal('txtPosCobroDireccion', r.DIRCLIE || 'CIUDAD');
    setVal('txtObs', r.OBS);
    setVal('txtSerieFac', r.SERIEFAC);
    setVal('txtNumeroFac', r.NUMERO_FAC);
    setVal('txtCoddocOrigen', r.CODDOC_ORIGEN);
    setVal('txtCorrelativoOrigen', r.CORRELATIVO_ORIGEN);
    setVal('cmbConCre', r.CONCRE || 'CON');
    setVal('cmbCaja', r.CODCAJA);
    setVal('cmbVendedor', r.CODEMP);
    setVal('cmbPrioridad', r.ETIQUETA || 'BAJA');

    if (r.FECHA) setVal('txtFecha', movinv2_fecha_para_input(r.FECHA));
    if (r.FECHAENTREGA) setVal('txtFechaPago', movinv2_fecha_para_input(r.FECHAENTREGA));

    const cmbEmp = document.getElementById('cmbEmpresas');
    if (cmbEmp && r.EMPNIT_DESTINO) {
        const dest = String(r.EMPNIT_DESTINO);
        if (!Array.from(cmbEmp.options).some((o) => o.value === dest)) {
            const opt = document.createElement('option');
            opt.value = dest;
            opt.textContent = dest;
            cmbEmp.appendChild(opt);
        }
        cmbEmp.value = dest;
    }

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

function movinv2_cargar_encabezado_documento(coddoc, correlativo) {
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
        movinv2_aplicar_encabezado_form(r);
        return r;
    });
}

function movinv2_abrir_documento_edicion(coddoc, correlativo, idbtn) {
    const btn = idbtn ? document.getElementById(idbtn) : null;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-sync fa-spin"></i>';
    }

    movinv2_reset_sesion();
    movinv2_modoEdicion = true;

    if (typeof movinv2_show_ingreso === 'function') {
        movinv2_show_ingreso({ skipNuevo: true, titulo: 'Editar movimiento' });
    }
    if (typeof movinv2_show_ingreso_loader === 'function') {
        movinv2_show_ingreso_loader('Cargando documento');
    }

    return movinv2_cargar_encabezado_documento(coddoc, correlativo)
        .then((r) => movinv2_get_coddoc(r.TIPODOC || movinv2_tipoDoc).then(() => r))
        .then((r) => {
            movinv2_aplicar_encabezado_form(r);
            movinv2_docActivo = { coddoc: coddoc, correlativo: correlativo };
            movinv2_bloquear_serie_doc(true);
            movinv2_actualizar_ref_doc();
            const btnGuardar = document.getElementById('btnGuardarFactura');
            if (btnGuardar) btnGuardar.innerHTML = '<i class="fal fa-save mr-1"></i> Guardar cambios';
            movinv2_get_tbl_pedido();
            document.getElementById('txtPosCodprod')?.focus();
            F.showToast('Documento listo para editar');
        })
        .catch(() => {
            movinv2_reset_sesion();
            if (typeof movinv2_show_listado === 'function') movinv2_show_listado();
            F.AvisoError('No se pudo cargar el documento');
        })
        .finally(() => {
            if (typeof movinv2_hide_ingreso_loader === 'function') movinv2_hide_ingreso_loader();
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fal fa-edit"></i>';
            }
        });
}

function movinv2_editar_documento(coddoc, correlativo, st, idbtn) {
    if (st === 'A') {
        F.AvisoError('No se puede editar un documento anulado');
        return;
    }

    F.Confirmacion('¿Está seguro que desea EDITAR este documento?')
        .then((value) => {
            if (value !== true) return;
            movinv2_abrir_documento_edicion(coddoc, correlativo, idbtn);
        });
}

function movinv2_format_pago(concre) {
    if (concre === 'CRE') return 'CREDITO';
    if (concre === 'CON') return 'CONTADO';
    return concre || '—';
}

function movinv2_build_ticket_html(enc, lineas) {
    const head = lineas[0] || {};
    const nomDestino = (enc.NOMCLIE || head.NOMCLIE || '').trim();
    const nit = (enc.NIT || '').trim();
    const direccion = (enc.DIRCLIE || head.DIRCLIE || '').trim();
    const obs = (enc.OBS || head.DOCOBS || '').trim();
    const nomEmpresa = (typeof GlobalNomEmpresa !== 'undefined' && GlobalNomEmpresa) ? GlobalNomEmpresa : 'SYGMA';
    const destino = (enc.EMPNIT_DESTINO || '').trim();
    let total = 0;
    let totalDesc = 0;
    let lineCount = 0;
    let rowsHtml = '';

    lineas.forEach((l) => {
        lineCount += 1;
        const importe = Number(l.TOTALPRECIO) - Number(l.DESCUENTO || 0);
        total += Number(l.TOTALPRECIO) || 0;
        totalDesc += Number(l.DESCUENTO) || 0;
        rowsHtml += `<tr>
            <td>${l.CODPROD || ''}</td><td>${l.DESPROD || ''}</td>
            <td class="text-center">${l.CODMEDIDA || ''}</td>
            <td class="text-center">${l.CANTIDAD || 0}</td>
            <td class="text-right">${F.setMoneda(l.COSTO, 'Q')}</td>
            <td class="text-right">${F.setMoneda(importe, 'Q')}</td>
        </tr>`;
    });

    if (!rowsHtml) {
        total = Number(enc.TOTALPRECIO) || Number(enc.TOTALVENTA) || 0;
        totalDesc = Number(enc.TOTALDESCUENTO) || 0;
        rowsHtml = `<tr><td colspan="6" class="text-center text-muted">Sin lineas de producto</td></tr>`;
    }

    const totalNeto = total - totalDesc;

    return `
        <div class="sygma-embarque-print-tickets__header">
            <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="48" height="48" alt="Logo">
            <h4>MOVIMIENTO DE INVENTARIO</h4>
            <p>${nomEmpresa}</p>
        </div>
        <div class="sygma-embarque-doc-ticket">
            <div class="sygma-embarque-doc-ticket__head">
                <div class="sygma-embarque-doc-ticket__doc">${enc.CODDOC}-${enc.CORRELATIVO}</div>
                <div class="sygma-embarque-doc-ticket__meta">${F.convertDateNormal(enc.FECHA)} · Hora: ${enc.HORA || ''}</div>
                <div class="sygma-embarque-doc-ticket__meta">Empleado: ${enc.NOMEMPLEADO || ''}</div>
                <div class="sygma-embarque-doc-ticket__meta">Destino: ${destino || '—'}</div>
                <div class="sygma-embarque-doc-ticket__cliente"><strong>Referencia:</strong> ${nomDestino || '—'}</div>
                <div class="sygma-embarque-doc-ticket__cliente"><strong>NIT:</strong> ${nit || '—'}</div>
                <div class="sygma-embarque-doc-ticket__cliente"><strong>Direccion:</strong> ${direccion || '—'}</div>
            </div>
            <table class="sygma-embarque-doc-ticket__table">
                <thead><tr><th>Cod.</th><th>Producto</th><th>Med.</th><th>Cant.</th><th>Costo</th><th>Importe</th></tr></thead>
                <tbody>${rowsHtml}</tbody>
            </table>
            <div class="sygma-embarque-doc-ticket__total">
                <span>Lineas: ${lineCount}</span>
                <span>Total: ${F.setMoneda(totalNeto, 'Q')}</span>
            </div>
            ${totalDesc > 0 ? `<div class="sygma-embarque-doc-ticket__obs"><strong>Descuento:</strong> ${F.setMoneda(totalDesc, 'Q')}</div>` : ''}
            ${obs ? `<div class="sygma-embarque-doc-ticket__obs"><strong>Obs:</strong> ${obs}</div>` : ''}
        </div>`;
}

function movinv2_ejecutar_impresion() {
    document.body.classList.add('sygma-print-embarque-active');
    window.print();
    setTimeout(() => {
        document.body.classList.remove('sygma-print-embarque-active');
        const host = document.getElementById('movinv2_print_host');
        if (host) host.innerHTML = '';
    }, 600);
}

function movinv2_imprimir_documento(coddoc, correlativo, idbtn) {
    const btn = idbtn ? document.getElementById(idbtn) : null;
    const host = document.getElementById('movinv2_print_host');
    if (!host) return;

    if (btn) {
        btn.innerHTML = '<i class="fal fa-print fa-spin"></i>';
        btn.disabled = true;
    }

    F.showToast('Generando imprimible...');

    Promise.all([
        movinv2_cargar_encabezado_documento(coddoc, correlativo),
        GF.get_data_detalle_documento(GlobalEmpnit, coddoc, correlativo)
            .then((data) => data.recordset || [])
            .catch(() => [])
    ])
        .then(([enc, lineas]) => {
            host.innerHTML = `<div class="sygma-embarque-print-tickets">${movinv2_build_ticket_html(enc, lineas)}</div>`;
            movinv2_ejecutar_impresion();
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

function movinv2_eliminar_documento_listado(coddoc, correlativo, st, idbtn) {
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
                if (typeof movinv2_cargar_listado === 'function') movinv2_cargar_listado();
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

function movinv2_reset_modal_bindings() {
    movinv2_ingresoListenersReady = false;
}

function movinv2_loader_progress(mensaje) {
    const label = document.querySelector('#movinv2IngresoLoaderInner .sygma-loader__label');
    if (label) {
        label.textContent = mensaje;
    } else if (typeof movinv2_show_ingreso_loader === 'function') {
        movinv2_show_ingreso_loader(mensaje);
    }
}

function movinv2_inv_cero() {
    const doc = movinv2_get_doc_activo();
    if (!doc) return;

    F.Confirmacion('¿Desea dejar TODO el inventario en CERO? Se agregará una línea por cada producto con existencia.')
        .then((v1) => {
            if (v1 !== true) return;
            F.Confirmacion('SEGUNDA CONFIRMACIÓN: este proceso agregará ajustes negativos/positivos para llevar el inventario a cero. ¿Está TOTALMENTE seguro de iniciar?')
                .then((v2) => {
                    if (v2 !== true) return;
                    movinv2_inv_cero_ejecutar(doc);
                });
        });
}

function movinv2_inv_cero_ejecutar(doc) {
    movinv2_show_ingreso_loader('Cargando inventario...');

    axios.post('/inventarios/inventario_saldos_unidades', {
        token: TOKEN,
        sucursal: GlobalEmpnit
    })
        .then((response) => {
            if (response.data === 'error') throw new Error('error');
            const rows = (response.data.recordset || []).filter((r) => Number(r.EXISTENCIA) !== 0);
            if (!rows.length) {
                movinv2_hide_ingreso_loader();
                F.Aviso('No hay productos con existencia distinta de cero.');
                return;
            }

            const tipoprecio = data_empresa_config?.TIPO_PRECIO || '';
            const total = rows.length;
            let agregados = 0;

            const procesar = (idx) => {
                if (idx >= total) {
                    // Observaciones y cierre del proceso
                    const txtObs = document.getElementById('txtObs');
                    if (txtObs) txtObs.value = 'INVENTARIO A CERO';
                    return movinv2_sync_encabezado()
                        .catch(() => {})
                        .then(() => {
                            movinv2_hide_ingreso_loader();
                            movinv2_get_tbl_pedido();
                            F.Aviso(`Proceso terminado: se agregaron ${agregados} de ${total} productos al documento. Ahora debe FINALIZAR el documento con el botón "Guardar movimiento".`);
                        });
                }

                const r = rows[idx];
                const existencia = Number(r.EXISTENCIA) || 0;
                const cantidad = -existencia; // >0 inventario → negativo; <0 inventario → positivo
                const costo = Number(r.COSTO_UNIDAD) || 0;

                movinv2_loader_progress(`Agregando línea ${idx + 1} de ${total}...`);

                return movinv2_insert_item_api(doc.coddoc, doc.correlativo, r.CODPROD, r.DESPROD || r.CODPROD,
                    'UNIDAD', cantidad, 1, costo, costo, 0, r.TIPOPROD || '', tipoprecio,
                    existencia, 0, Number(r.EXENTO) || 0)
                    .then(() => { agregados += 1; })
                    .catch(() => { /* continuar con el siguiente producto */ })
                    .then(() => procesar(idx + 1));
            };

            return procesar(0);
        })
        .catch(() => {
            movinv2_hide_ingreso_loader();
            F.AvisoError('No se pudo cargar el inventario para el proceso');
        });
}

function movinv2_quitar_todos_items() {
    const doc = movinv2_get_doc_activo();
    if (!doc) return;

    F.Confirmacion('¿Está seguro que desea QUITAR TODOS los items del documento?')
        .then((value) => {
            if (value !== true) return;

            movinv2_show_ingreso_loader('Cargando items...');

            GF.get_data_detalle_documento(GlobalEmpnit, doc.coddoc, doc.correlativo)
                .then((data) => {
                    const rows = data.recordset || [];
                    if (!rows.length) {
                        movinv2_hide_ingreso_loader();
                        F.Aviso('El documento no tiene items.');
                        return;
                    }

                    const total = rows.length;
                    let quitados = 0;

                    const procesar = (idx) => {
                        if (idx >= total) {
                            movinv2_hide_ingreso_loader();
                            movinv2_get_tbl_pedido();
                            F.Aviso(`Se quitaron ${quitados} de ${total} items del documento.`);
                            return Promise.resolve();
                        }
                        movinv2_loader_progress(`Quitando item ${idx + 1} de ${total}...`);
                        return GF.get_documento_eliminar_item(rows[idx].ID)
                            .then(() => { quitados += 1; })
                            .catch(() => { /* continuar con el siguiente item */ })
                            .then(() => procesar(idx + 1));
                    };

                    return procesar(0);
                })
                .catch(() => {
                    movinv2_hide_ingreso_loader();
                    F.AvisoError('No se pudieron cargar los items del documento');
                });
        });
}

window.movinv2_inv_cero = movinv2_inv_cero;
window.movinv2_quitar_todos_items = movinv2_quitar_todos_items;

function movinv2_setup_ingreso_listeners() {
    if (movinv2_ingresoListenersReady) return;
    movinv2_ingresoListenersReady = true;

    const cmbPrioridad = document.getElementById('cmbPrioridad');
    if (cmbPrioridad) {
        cmbPrioridad.innerHTML = F.get_prioridades();
        cmbPrioridad.value = 'BAJA';
    }

    document.getElementById('btnMovinv2QuitarTodos')?.addEventListener('click', movinv2_quitar_todos_items);
    document.getElementById('btnMovinv2InvCero')?.addEventListener('click', movinv2_inv_cero);

    movinv2_get_vendedores();
    movinv2_get_cajas();
    movinv2_cargar_select_empresas();
    movinv2_listener_coddoc();

    document.getElementById('btnMovinv2VolverListado')?.addEventListener('click', () => {
        if (typeof movinv2_volver_listado === 'function') movinv2_volver_listado();
    });

    document.getElementById('btnGuardarFactura')?.addEventListener('click', movinv2_guardar_click);

    ['txtObs', 'txtSerieFac', 'txtNumeroFac', 'txtCoddocOrigen', 'txtCorrelativoOrigen'].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', movinv2_programar_sync_encabezado);
    });
    ['cmbConCre', 'cmbCaja', 'cmbVendedor', 'cmbPrioridad', 'txtFecha', 'txtFechaPago', 'cmbEmpresas'].forEach((id) => {
        document.getElementById(id)?.addEventListener('change', movinv2_programar_sync_encabezado);
    });

    const txtPosCodprod = document.getElementById('txtPosCodprod');
    txtPosCodprod?.addEventListener('keyup', (e) => {
        txtPosCodprod.value = txtPosCodprod.value.toUpperCase();
        if (e.code === 'Enter' || e.keyCode === 13) document.getElementById('btnBuscarProd')?.click();
    });
    document.getElementById('btnBuscarProd')?.addEventListener('click', () => {
        txtPosCodprod.value = txtPosCodprod.value.toUpperCase();
        const filtro = txtPosCodprod.value || '';
        if (filtro) movinv2_get_buscar_producto(filtro);
    });

    document.getElementById('btnMCGuardar')?.addEventListener('click', () => {
        const btn = document.getElementById('btnMCGuardar');
        if (btn?.disabled) return;

        const doc = movinv2_get_doc_activo();
        if (!doc) return;

        const cantidad = Number(document.getElementById('txtMCCantidad').value || 1);
        const preciounitario = Number(document.getElementById('txtMCPrecio').value || 0);
        const descuento = 0;
        if (preciounitario === 0) { F.AvisoError('Costo inválido'); return; }
        const tipoprecio = data_empresa_config?.TIPO_PRECIO || '';

        const btnHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-sync fa-spin mr-1"></i> Agregando...';

        movinv2_insert_item_api(doc.coddoc, doc.correlativo, Selected_codprod, Selected_desprod, Selected_codmedida,
            cantidad, Selected_equivale, Selected_costo, preciounitario, descuento, Selected_tipoprod, tipoprecio,
            Selected_existencia, Selected_bono, Selected_exento)
            .then(() => {
                $('#modal_cantidad').modal('hide');
                F.showToast('Producto agregado ' + Selected_desprod);
                movinv2_get_tbl_pedido();
                txtPosCodprod.focus();
            })
            .catch(() => F.AvisoError('No se pudo agregar'))
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = btnHtml;
            });
    });

    document.getElementById('txtMCCantidad')?.addEventListener('input', movinv2_CalcularTotalPrecio);
    document.getElementById('txtMCPrecio')?.addEventListener('input', movinv2_CalcularTotalPrecio);

    document.getElementById('btnMCGuardarE')?.addEventListener('click', () => {
        const btn = document.getElementById('btnMCGuardarE');
        if (btn?.disabled) return;

        const doc = movinv2_get_doc_activo();
        if (!doc) return;

        const cantidad = Number(document.getElementById('txtMCCantidadE').value || 1);
        const preciounitario = Number(document.getElementById('txtMCPrecioE').value || 0);
        const descuento = Number(typeof Selected_descuento !== 'undefined' ? Selected_descuento : 0) || 0;
        if (preciounitario === 0) { F.AvisoError('Costo inválido'); return; }
        const tipoprecio = data_empresa_config?.TIPO_PRECIO || '';

        const btnHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-sync fa-spin mr-1"></i> Guardando...';

        GF.get_documento_eliminar_item(Selected_id)
            .then(() => movinv2_insert_item_api(doc.coddoc, doc.correlativo, Selected_codprod, Selected_desprod,
                Selected_codmedida, cantidad, Selected_equivale, Selected_costo, preciounitario, descuento,
                Selected_tipoprod, tipoprecio, Selected_existencia, Selected_bono, Selected_exento))
            .then(() => {
                $('#modal_editar_cantidad').modal('hide');
                movinv2_get_tbl_pedido();
                txtPosCodprod?.focus();
            })
            .catch(() => F.AvisoError('No se pudo actualizar'))
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = btnHtml;
            });
    });
    document.getElementById('txtMCCantidadE')?.addEventListener('input', movinv2_CalcularTotalPrecioEditar);
    document.getElementById('txtMCPrecioE')?.addEventListener('input', movinv2_CalcularTotalPrecioEditar);
}

window.movinv2_reset_sesion = movinv2_reset_sesion;
window.movinv2_abandonar_documento = movinv2_abandonar_documento;
window.movinv2_reset_modal_bindings = movinv2_reset_modal_bindings;
window.movinv2_setup_ingreso_listeners = movinv2_setup_ingreso_listeners;
window.movinv2_calcular_descuento = movinv2_calcular_descuento;
window.movinv2_get_producto = movinv2_get_producto;
window.movinv2_edit_item_pedido = movinv2_edit_item_pedido;
window.movinv2_delete_item_pedido = movinv2_delete_item_pedido;
window.movinv2_editar_documento = movinv2_editar_documento;
window.movinv2_imprimir_documento = movinv2_imprimir_documento;
window.movinv2_eliminar_documento_listado = movinv2_eliminar_documento_listado;
