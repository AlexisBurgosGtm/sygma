'use strict';

/** Compras 2 — flujo POS: documento en BD primero, líneas en DOCPRODUCTOS después */

var compras2_ingresoListenersReady = false;
var compras2_docActivo = null;
var compras2_syncTimer = null;
var compras2_modoEdicion = false;
var compras2_proveedoresCache = [];
var compras2_costosPreviewCache = [];

function compras2_reset_sesion() {
    compras2_docActivo = null;
    compras2_modoEdicion = false;
    if (compras2_syncTimer) {
        clearTimeout(compras2_syncTimer);
        compras2_syncTimer = null;
    }
}

function compras2_get_doc_activo() {
    if (!compras2_docActivo) {
        F.AvisoError('No hay documento activo');
        return null;
    }
    return compras2_docActivo;
}

function compras2_actualizar_ref_doc() {
    const lb = document.getElementById('lbCompras2DocRef');
    if (!lb) return;
    if (compras2_docActivo) {
        lb.innerText = `${compras2_docActivo.coddoc}-${compras2_docActivo.correlativo}`;
    } else {
        lb.innerText = '';
    }
}

function compras2_bloquear_serie_doc(bloquear) {
    ['cmbTipoDocumento', 'cmbCoddoc'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.disabled = !!bloquear;
    });
}

function compras2_calcular_descuento(idDescuento, idTotalPrecio, idTotalPrecioDescuento) {
    try {
        const descuento = Number(document.getElementById(idDescuento)?.value || 0);
        const totalprecio = Number(document.getElementById(idTotalPrecio)?.value || 0);
        document.getElementById(idTotalPrecioDescuento).value = totalprecio - descuento;
    } catch (e) {
        const totalprecio = Number(document.getElementById(idTotalPrecio)?.value || 0);
        document.getElementById(idTotalPrecioDescuento).value = totalprecio;
    }
}

function compras2_CalcularTotalPrecio() {
    const cantidad = document.getElementById('txtMCCantidad')?.value || 1;
    const precio = document.getElementById('txtMCPrecio')?.value;
    const el = document.getElementById('txtMCTotalPrecio');
    if (el) el.value = (Number(cantidad) * Number(precio)).toFixed(2);
}

function compras2_CalcularTotalPrecioEditar() {
    const cantidad = document.getElementById('txtMCCantidadE')?.value || 1;
    const precio = document.getElementById('txtMCPrecioE')?.value;
    const el = document.getElementById('txtMCTotalPrecioE');
    if (el) el.value = (Number(cantidad) * Number(precio)).toFixed(2);
}

function compras2_get_correlativo(coddoc) {
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

function compras2_get_coddoc(tipo, containerId) {
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

function compras2_cargar_select_coddoc_nuevo() {
    const cmbTipo = document.getElementById('cmbTipoDocumento')?.value || 'COM';
    return compras2_get_coddoc(cmbTipo, 'cmbCompras2CoddocNuevo');
}

function compras2_aplicar_coddoc_desde_listado() {
    const preferido = document.getElementById('cmbCompras2CoddocNuevo')?.value || '';
    const cmbCoddoc = document.getElementById('cmbCoddoc');
    if (!preferido || !cmbCoddoc) return;
    const found = Array.from(cmbCoddoc.options).some((o) => o.value === preferido);
    if (found) cmbCoddoc.value = preferido;
}

window.compras2_cargar_select_coddoc_nuevo = compras2_cargar_select_coddoc_nuevo;

function compras2_listener_coddoc() {
    const cmbTipoDocumento = document.getElementById('cmbTipoDocumento');
    cmbTipoDocumento?.addEventListener('change', () => {
        if (compras2_docActivo) return;
        compras2_get_coddoc(cmbTipoDocumento.value);
    });
}

function compras2_validar_proveedor_seleccionado() {
    const cod = document.getElementById('txtPosCobroNitclie')?.value || '';
    if (!cod || cod === '0') {
        F.AvisoError('Seleccione un proveedor');
        document.getElementById('cmbCompras2Proveedor')?.focus();
        return false;
    }
    return true;
}

function compras2_on_proveedor_select_change() {
    const sel = document.getElementById('cmbCompras2Proveedor');
    if (!sel) return;
    const opt = sel.options[sel.selectedIndex];
    if (!sel.value) {
        document.getElementById('txtPosCobroNitclie').value = '';
        document.getElementById('txtPosCobroNit').value = '';
        document.getElementById('txtPosCobroNombre').value = '';
        document.getElementById('txtPosCobroDireccion').value = '';
        compras2_programar_sync_encabezado();
        return;
    }
    document.getElementById('txtPosCobroNitclie').value = sel.value;
    document.getElementById('txtPosCobroNit').value = opt?.dataset?.nit || '';
    document.getElementById('txtPosCobroNombre').value = opt?.dataset?.nombre || '';
    document.getElementById('txtPosCobroDireccion').value = opt?.dataset?.dir || 'CIUDAD';
    compras2_programar_sync_encabezado();
}

function compras2_sync_proveedor_select(codcliente) {
    const sel = document.getElementById('cmbCompras2Proveedor');
    if (!sel) return;
    const cod = codcliente ? String(codcliente) : '';
    if (!cod || cod === '0') {
        sel.value = '';
        return;
    }
    sel.value = cod;
    if (sel.value !== cod) {
        const nom = document.getElementById('txtPosCobroNombre')?.value || `Proveedor ${cod}`;
        const nit = document.getElementById('txtPosCobroNit')?.value || '';
        const dir = document.getElementById('txtPosCobroDireccion')?.value || 'CIUDAD';
        const opt = document.createElement('option');
        opt.value = cod;
        opt.dataset.nit = nit;
        opt.dataset.nombre = nom;
        opt.dataset.dir = dir;
        opt.textContent = `${nit ? nit + ' — ' : ''}${nom}`;
        sel.appendChild(opt);
        sel.value = cod;
    }
    compras2_on_proveedor_select_change();
}

function compras2_cargar_select_proveedores() {
    const sel = document.getElementById('cmbCompras2Proveedor');
    if (!sel) return Promise.resolve();
    sel.innerHTML = '<option value="">-- seleccione un proveedor --</option>';
    return axios.post('/proveedores/listado', { token: TOKEN })
        .then((response) => {
            if (response.data === 'error') throw new Error('error');
            compras2_proveedoresCache = response.data.recordset || [];
            let opts = '<option value="">-- seleccione un proveedor --</option>';
            compras2_proveedoresCache.forEach((r) => {
                const cod = r.CODPROV;
                const nombre = (r.EMPRESA || r.RAZONSOCIAL || '').trim();
                const nit = (r.NIT || '').trim();
                const dir = (r.DIRECCION || 'CIUDAD').trim();
                const label = `${nit ? nit + ' — ' : ''}${nombre || cod}`;
                opts += `<option value="${cod}" data-nit="${F.limpiarTexto(nit)}" data-nombre="${F.limpiarTexto(nombre)}" data-dir="${F.limpiarTexto(dir)}">${label}</option>`;
            });
            sel.innerHTML = opts;
        })
        .catch(() => {
            compras2_proveedoresCache = [];
            F.AvisoError('No se pudo cargar la lista de proveedores');
        });
}

window.compras2_cargar_select_proveedores = compras2_cargar_select_proveedores;
window.compras2_sync_proveedor_select = compras2_sync_proveedor_select;

function compras2_get_vendedores() {
    GF.get_data_empleados_tipo(5)
        .then((data) => {
            let str = '';
            data.recordset.map((r) => { str += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>`; });
            document.getElementById('cmbVendedor').innerHTML = str;
        })
        .catch(() => {
            document.getElementById('cmbVendedor').innerHTML = '<option value="1">SIN VENDEDOR</option>';
        });
}

function compras2_get_cajas() {
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

function compras2_leer_encabezado_form() {
    const txtFecha = new Date(document.getElementById('txtFecha').value);
    return {
        codcliente: document.getElementById('txtPosCobroNitclie')?.value || '0',
        nitclie: document.getElementById('txtPosCobroNit')?.value || '',
        nomclie: document.getElementById('txtPosCobroNombre')?.value || '',
        dirclie: document.getElementById('txtPosCobroDireccion')?.value || '',
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
        etiqueta: document.getElementById('cmbPrioridad')?.value || 'MEDIA',
        coddoc_origen: document.getElementById('txtCoddocOrigen')?.value || '',
        correlativo_origen: document.getElementById('txtCorrelativoOrigen')?.value || '0',
        coddoc: document.getElementById('cmbCoddoc')?.value || '',
        correlativo: document.getElementById('txtCorrelativo')?.value || '0'
    };
}

function compras2_sync_encabezado() {
    const doc = compras2_get_doc_activo();
    if (!doc) return Promise.resolve();
    const h = compras2_leer_encabezado_form();
    return axios.post('/compras/update_encabezado_compra', {
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
        serie_fac: h.serie_fac,
        numero_fac: h.numero_fac,
        etiqueta: h.etiqueta,
        coddoc_origen: h.coddoc_origen,
        correlativo_origen: h.correlativo_origen
    });
}

function compras2_programar_sync_encabezado() {
    if (compras2_syncTimer) clearTimeout(compras2_syncTimer);
    compras2_syncTimer = setTimeout(() => {
        compras2_sync_encabezado().catch(() => {});
    }, 600);
}

function compras2_reset_campos_form() {
    GlobalTotalDocumento = 0;
    GlobalTotalDescuento = 0;
    GlobalTotalCostoDocumento = 0;

    document.getElementById('txtFechaPago').value = F.getFecha();
    document.getElementById('txtFecha').value = F.getFecha();
    document.getElementById('txtPosCobroNit').value = '';
    document.getElementById('txtPosCobroNitclie').value = '';
    document.getElementById('txtPosCobroNombre').value = '';
    document.getElementById('txtPosCobroDireccion').value = '';
    const selProv = document.getElementById('cmbCompras2Proveedor');
    if (selProv) selProv.value = '';
    document.getElementById('txtSerieFac').value = '';
    document.getElementById('txtNumeroFac').value = '';
    document.getElementById('txtCoddocOrigen').value = '';
    document.getElementById('txtCorrelativoOrigen').value = '';
    document.getElementById('txtObs').value = '';

    compras2_bloquear_serie_doc(false);
    compras2_actualizar_ref_doc();
}

function compras2_crear_documento_api(h) {
    return axios.post('/compras/insert_documento_abierto', {
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
        etiqueta: h.etiqueta
    }).then((response) => {
        if (response.data === 'error' || Number(response.data?.rowsAffected?.[0] || 0) === 0) {
            throw new Error('insert');
        }
        compras2_docActivo = { coddoc: h.coddoc, correlativo: h.correlativo };
        compras2_bloquear_serie_doc(true);
        compras2_actualizar_ref_doc();
        compras2_get_tbl_pedido();
    });
}

function compras2_iniciar_documento_nuevo() {
    if (typeof compras2_show_ingreso_loader === 'function') {
        compras2_show_ingreso_loader('Creando documento');
    }
    compras2_reset_campos_form();
    const cmbTipo = document.getElementById('cmbTipoDocumento')?.value || 'COM';
    const lbRef = document.getElementById('lbCompras2DocRef');
    if (lbRef) lbRef.innerText = 'Creando documento...';

    compras2_get_coddoc(cmbTipo)
        .then(() => {
            compras2_aplicar_coddoc_desde_listado();
            const cmbCoddoc = document.getElementById('cmbCoddoc');
            if (!cmbCoddoc?.value) {
                F.AvisoError('No hay serie de documento configurada');
                return Promise.reject();
            }
            return compras2_get_correlativo(cmbCoddoc.value)
                .then((correlativo) => {
                    document.getElementById('txtCorrelativo').value = correlativo;
                    const h = compras2_leer_encabezado_form();
                    return compras2_crear_documento_api(h);
                });
        })
        .then(() => {
            F.showToast('Documento creado — agregue productos');
            document.getElementById('txtPosCodprod')?.focus();
        })
        .catch(() => {
            F.AvisoError('No se pudo crear el documento de compra');
            if (lbRef) lbRef.innerText = '';
        })
        .finally(() => {
            if (typeof compras2_hide_ingreso_loader === 'function') compras2_hide_ingreso_loader();
        });
}

function compras2_insert_item_api(coddoc, correlativo, codprod, desprod, codmedida, cantidad, equivale, costo, precio, descuento, tipoprod, tipoprecio, existencia, bono, exento) {
    const totalunidades = Number(cantidad) * Number(equivale);
    const totalcosto = Number(costo) * Number(cantidad);
    const totalprecio = Number(precio) * Number(cantidad);
    return axios.post('/compras/insert_item_compra', {
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

function compras2_get_tbl_pedido() {
    const doc = compras2_docActivo;
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
                <td class="text-right">${F.setMoneda(r.PRECIO, 'Q')}</td>
                <td class="text-right text-danger">${descTxt}</td>
                <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(imp, 'Q')}</td>
                <td class="text-center text-nowrap sygma-embarque-rpt__col-action">
                    <button type="button" class="btn btn-sm btn-circle btn-info shadow hand mr-1" title="Editar" onclick="compras2_edit_item_pedido('${r.ID}','${r.CODPROD}','${F.limpiarTexto(r.DESPROD)}','${r.CODMEDIDA}','${r.EQUIVALE}','${r.CANTIDAD}','${r.COSTO}','${r.PRECIO}','${r.TIPOPROD}','${r.EXENTO}','${r.EXISTENCIA || 0}','${r.BONO || 0}','${r.DESCUENTO}')"><i class="fal fa-edit"></i></button>
                    <button type="button" class="btn btn-sm btn-circle btn-danger shadow hand" title="Quitar" onclick="compras2_delete_item_pedido('${r.ID}')"><i class="fal fa-trash"></i></button>
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

            const lbDetItems = document.getElementById('lbCompras2DetalleItems');
            if (lbDetItems) lbDetItems.innerText = `${varTotalItems} item${varTotalItems === 1 ? '' : 's'}`;

            const totalBlock = document.getElementById('lbCompras2DetalleTotal');
            if (totalBlock) {
                totalBlock.innerHTML = varTotalItems > 0 ? `
                    <div class="sygma-embarque-rpt__total-inner">
                        <span class="sygma-embarque-rpt__foot-label">TOTAL COMPRA</span>
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
            const lbDetItems = document.getElementById('lbCompras2DetalleItems');
            if (lbDetItems) lbDetItems.innerText = '0 items';
            const totalBlock = document.getElementById('lbCompras2DetalleTotal');
            if (totalBlock) totalBlock.innerHTML = '';
        });
}

function compras2_get_buscar_producto(filtro) {
    const doc = compras2_get_doc_activo();
    if (!doc) return;
    if (!compras2_validar_proveedor_seleccionado()) return;

    $('#modal_lista_precios').modal('show');
    const container = document.getElementById('tblDataProductos');
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
            response.data.recordset.map((r) => {
                const clsExist = Number(r.EXISTENCIA) <= 0 ? 'text-danger' : '';
                str += `<tr class="hand" onclick="compras2_get_producto('${r.CODPROD}','${F.limpiarTexto(r.DESPROD)}','${F.limpiarTexto(r.DESPROD2)}','${r.CODMEDIDA}','${r.EQUIVALE}','${r.COSTO}','${r.COSTO}','${r.TIPOPROD}','${r.EXENTO}','${r.EXISTENCIA}','${r.BONO}')">
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

function compras2_llenar_medida_container(containerId, codmedida, equivale) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
        <label class="negrita text-secondary d-block mb-1">Medida</label>
        <div class="form-control negrita border-base bg-white">${codmedida || '—'}</div>
        <div class="small text-muted mt-1">Eq: ${equivale || 1}</div>`;
}

function compras2_get_producto(codprod, desprod, desprod2, codmedida, equivale, costo, precio, tipoprod, exento, existencia, bono) {
    if (!compras2_get_doc_activo()) return;

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
    compras2_llenar_medida_container('container_precio', codmedida, equivale);
    document.getElementById('txtMCCantidad').value = '';
    document.getElementById('txtMCPrecio').value = precio;
    compras2_CalcularTotalPrecio();
    document.getElementById('txtPosCodprod').value = '';
    document.getElementById('txtMCCantidad').focus();
}

function compras2_edit_item_pedido(id, codprod, desprod, codmedida, equivale, cantidad, costo, precio, tipoprod, exento, existencia, bono, descuento) {
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
    compras2_llenar_medida_container('container_precio_editar', codmedida, equivale);
    document.getElementById('txtMCCantidadE').value = cantidad;
    document.getElementById('txtMCPrecioE').value = precio;
    compras2_CalcularTotalPrecioEditar();
    document.getElementById('txtMCCantidadE').focus();
}

function compras2_delete_item_pedido(id) {
    const doc = compras2_get_doc_activo();
    if (!doc) return;

    F.Confirmacion('¿Está seguro que desea quitar este item?').then((value) => {
        if (value !== true) return;
        GF.get_documento_eliminar_item(id)
            .then(() => {
                F.showToast('Item eliminado');
                compras2_get_tbl_pedido();
            })
            .catch(() => F.AvisoError('No se pudo quitar este item'));
    });
}

function compras2_get_datos_cliente(nitclie, nit, nomclie, dirclie, telefono) {
    $('#modal_lista_clientes').modal('hide');
    document.getElementById('txtPosCobroNit').value = nit;
    document.getElementById('txtPosCobroNitclie').value = nitclie;
    document.getElementById('txtPosCobroNombre').value = nomclie;
    document.getElementById('txtPosCobroDireccion').value = dirclie;
    document.getElementById('txtPosCobroTelefono').value = telefono || '';
    compras2_programar_sync_encabezado();
}

function compras2_render_proveedores_tabla(data) {
    const container = document.getElementById('tblDataClientes');
    if (!container) return;
    if (!data || !data.length) {
        container.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">No hay proveedores registrados</td></tr>';
        return;
    }
    let str = '';
    data.forEach((r) => {
        const cod = r.CODCLIENTE || r.CODPROV;
        const nombre = r.NOMBRE || r.EMPRESA || '';
        const dir = r.DIRECCION || '';
        const tel = r.TELEFONO || r.TELEMPRESA || '';
        str += `<tr class="hand" onclick="compras2_get_datos_cliente('${cod}','${r.NIT}','${F.limpiarTexto(nombre)}','${F.limpiarTexto(dir)}','${tel}')">
            <td>${r.NIT} / ${cod}</td><td>${nombre}<br><small>${dir}</small></td>
            <td>${tel}</td><td>${F.setMoneda(r.SALDO, 'Q')}</td></tr>`;
    });
    container.innerHTML = str;
}

function compras2_cargar_lista_proveedores() {
    const container = document.getElementById('tblDataClientes');
    if (container) container.innerHTML = GlobalLoader;
    return axios.post('/proveedores/listado', { token: TOKEN })
        .then((response) => {
            if (response.data === 'error') throw new Error('error');
            compras2_render_proveedores_tabla(response.data.recordset || []);
        })
        .catch(() => {
            compras2_render_proveedores_tabla([]);
            F.AvisoError('No se pudo cargar la lista de proveedores');
        });
}

function compras2_tbl_clientes(filtro) {
    if (!filtro) {
        F.AvisoError('Escriba un nombre o nit válidos');
        document.getElementById('txtBuscarClie')?.focus();
        return;
    }
    const container = document.getElementById('tblDataClientes');
    container.innerHTML = GlobalLoader;
    axios.post('/proveedores/buscar_proveedor', { token: TOKEN, sucursal: GlobalEmpnit, filtro: filtro })
        .then((response) => {
            let str = '';
            if (response.data !== 'error') {
                response.data.recordset.map((r) => {
                    str += `<tr class="hand" onclick="compras2_get_datos_cliente('${r.CODCLIENTE}','${r.NIT}','${F.limpiarTexto(r.NOMBRE)}','${F.limpiarTexto(r.DIRECCION)}','${r.TELEFONO}')">
                        <td>${r.NIT} / ${r.CODCLIENTE}</td><td>${r.NOMBRE}<br><small>${r.DIRECCION}</small></td>
                        <td>${r.TELEFONO}</td><td>${F.setMoneda(r.SALDO, 'Q')}</td></tr>`;
                });
            }
            container.innerHTML = str || '<tr><td colspan="4" class="text-center">Sin resultados</td></tr>';
        }, () => { container.innerHTML = '<tr><td colspan="4" class="text-center">Error</td></tr>'; });
}

function compras2_fcn_buscar_cliente(nit) {
    return new Promise((resolve, reject) => {
        if (!nit) { F.AvisoError('Escriba un nombre o nit válidos'); reject(); return; }
        axios.post('/proveedores/buscar_proveedor_nit', { sucursal: GlobalEmpnit, nit: nit, token: TOKEN })
            .then((response) => {
                if (response === 'error' || Number(response.data.rowsAffected[0]) === 0) { reject(); return; }
                response.data.recordset.map((r) => {
                    document.getElementById('txtPosCobroNit').value = r.NIT;
                    document.getElementById('txtPosCobroNitclie').value = r.CODCLIENTE;
                    document.getElementById('txtPosCobroNombre').value = r.NOMBRE;
                    document.getElementById('txtPosCobroDireccion').value = r.DIRECCION;
                });
                compras2_programar_sync_encabezado();
                resolve();
            }, () => reject());
    });
}

function compras2_insert_cliente(nit, nombre, direccion, telefono) {
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

function compras2_toggle_finalizar_fecha_pago() {
    const concre = document.getElementById('cmbCompras2FinalizarPago')?.value || 'CON';
    const wrap = document.getElementById('wrapCompras2FinalizarFechaPago');
    if (!wrap) return;
    if (concre === 'CRE') {
        wrap.classList.remove('d-none');
    } else {
        wrap.classList.add('d-none');
    }
}

function compras2_abrir_modal_finalizar() {
    if (!compras2_validar_proveedor_seleccionado()) return;
    if (Number(GlobalTotalDocumento || 0) === 0) {
        F.AvisoError('No hay productos agregados');
        return;
    }

    const cmbPago = document.getElementById('cmbCompras2FinalizarPago');
    const txtFechaPagoFin = document.getElementById('txtCompras2FinalizarFechaPago');
    const concreActual = document.getElementById('cmbConCre')?.value || 'CON';
    if (cmbPago) cmbPago.value = concreActual;
    if (txtFechaPagoFin) {
        txtFechaPagoFin.value = document.getElementById('txtFechaPago')?.value
            || document.getElementById('txtFecha')?.value
            || F.getFecha();
    }
    compras2_toggle_finalizar_fecha_pago();
    $('#modal_compras2_finalizar').modal('show');
}

function compras2_aplicar_pago_finalizar() {
    const concre = document.getElementById('cmbCompras2FinalizarPago')?.value || 'CON';
    const fechaDoc = document.getElementById('txtFecha')?.value || F.getFecha();
    let vencimiento = fechaDoc;

    if (concre === 'CRE') {
        vencimiento = document.getElementById('txtCompras2FinalizarFechaPago')?.value || '';
        if (!vencimiento) {
            F.AvisoError('Seleccione la fecha de pago');
            return false;
        }
    }

    const cmbConCre = document.getElementById('cmbConCre');
    const txtFechaPago = document.getElementById('txtFechaPago');
    if (cmbConCre) cmbConCre.value = concre;
    if (txtFechaPago) txtFechaPago.value = vencimiento;
    return true;
}

function compras2_confirmar_finalizar_compra() {
    const btnConfirm = document.getElementById('btnCompras2FinalizarConfirmar');
    if (btnConfirm?.disabled) return;
    if (!compras2_aplicar_pago_finalizar()) return;

    const btnHtml = btnConfirm.innerHTML;
    btnConfirm.disabled = true;
    btnConfirm.innerHTML = '<i class="fal fa-sync fa-spin mr-1"></i> Guardando...';
    $('#modal_compras2_finalizar').modal('hide');

    Promise.resolve(compras2_finalizar_compra()).finally(() => {
        btnConfirm.disabled = false;
        btnConfirm.innerHTML = btnHtml;
    });
}

function compras2_render_preview_costos(rows) {
    const container = document.getElementById('tblDataCompras2Costos');
    if (!container) return;
    if (!rows.length) {
        container.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">No hay costos para actualizar</td></tr>';
        return;
    }
    container.innerHTML = rows.map((r) => {
        const costoActual = Number(r.COSTO_ACTUAL || 0);
        const costoNuevo = Number(r.COSTO_NUEVO || 0);
        const changed = Math.abs(costoActual - costoNuevo) > 0.0001;
        const clsNuevo = changed ? 'text-verde negrita' : '';
        return `<tr>
            <td class="text-nowrap">${r.CODPROD}</td>
            <td>${r.DESPROD || ''}</td>
            <td class="text-nowrap">${r.CODMEDIDA}</td>
            <td class="text-center">${r.EQUIVALE}</td>
            <td class="text-right text-nowrap">${F.setMoneda(costoActual, 'Q')}</td>
            <td class="text-right text-nowrap ${clsNuevo}">${F.setMoneda(costoNuevo, 'Q')}</td>
        </tr>`;
    }).join('\n');
}

function compras2_abrir_modal_cargar_costos() {
    const doc = compras2_get_doc_activo();
    if (!doc) return;
    if (Number(GlobalTotalDocumento || 0) === 0) {
        F.AvisoError('Agregue productos a la compra');
        return;
    }

    const container = document.getElementById('tblDataCompras2Costos');
    if (container) container.innerHTML = GlobalLoader;
    compras2_costosPreviewCache = [];
    $('#modal_compras2_cargar_costos').modal('show');

    axios.post('/compras/preview_costos_catalogo', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        coddoc: doc.coddoc,
        correlativo: doc.correlativo
    }).then((response) => {
        if (response.data === 'error') throw new Error('error');
        compras2_costosPreviewCache = response.data.recordset || [];
        compras2_render_preview_costos(compras2_costosPreviewCache);
    }).catch(() => {
        compras2_render_preview_costos([]);
        F.AvisoError('No se pudo cargar la vista previa de costos');
    });
}

function compras2_aplicar_costos_catalogo() {
    const doc = compras2_get_doc_activo();
    if (!doc || !compras2_costosPreviewCache.length) {
        F.AvisoError('No hay costos para cargar');
        return;
    }

    const btn = document.getElementById('btnCompras2CostosCargar');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-sync fa-spin mr-1"></i> Cargando...';
    }

    const payload = compras2_costosPreviewCache.map((r) => ({
        id: r.ID,
        codprod: r.CODPROD,
        codmedida: r.CODMEDIDA,
        costo_nuevo: r.COSTO_NUEVO
    }));

    axios.post('/compras/aplicar_costos_catalogo', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        json_costos: JSON.stringify(payload)
    }).then((response) => {
        if (response.data === 'error') throw new Error('error');
        const affected = (response.data?.rowsAffected || []).reduce((sum, n) => sum + Number(n || 0), 0);
        if (affected === 0) throw new Error('error');
        F.Aviso('Costos actualizados en el catálogo');
        $('#modal_compras2_cargar_costos').modal('hide');
    }).catch(() => {
        F.AvisoError('No se pudieron actualizar los costos');
    }).finally(() => {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fal fa-sync mr-1"></i> Cargar';
        }
    });
}

function compras2_finalizar_compra() {
    const doc = compras2_get_doc_activo();
    if (!doc) return Promise.resolve();

    const codcliente = document.getElementById('txtPosCobroNitclie')?.value || '';
    if (!codcliente || codcliente === '0') {
        F.AvisoError('Seleccione un proveedor');
        return Promise.resolve();
    }

    const serie_fac = document.getElementById('txtSerieFac').value || '';
    const numero_fac = document.getElementById('txtNumeroFac').value || '';
    const btnGuardarFactura = document.getElementById('btnGuardarFactura');

    compras2_get_tbl_pedido();

    return GF.verify_serie_compra_fel(serie_fac, numero_fac)
        .then(() => {
            F.AvisoError('Este documento serie FEL ya existe, por favor verifique');
        })
        .catch(() => {
            if (Number(GlobalTotalDocumento) === 0) {
                F.AvisoError('No hay productos agregados');
                return;
            }

            if (btnGuardarFactura) {
                btnGuardarFactura.disabled = true;
                btnGuardarFactura.innerHTML = '<i class="fal fa-save fa-spin mr-1"></i> Guardando...';
            }

            return compras2_sync_encabezado()
                .then(() => GF.update_costos_documento(doc.coddoc, doc.correlativo))
                .then(() => {
                    F.Aviso(compras2_modoEdicion ? 'Cambios guardados exitosamente' : 'Compra finalizada exitosamente');
                    compras2_reset_sesion();
                    if (btnGuardarFactura) btnGuardarFactura.innerHTML = '<i class="fal fa-save mr-1"></i> Finalizar compra';
                    if (typeof compras2_on_guardado_exitoso === 'function') {
                        compras2_on_guardado_exitoso();
                    }
                })
                .catch(() => F.AvisoError('No se pudo finalizar la compra'))
                .finally(() => {
                    if (btnGuardarFactura) {
                        btnGuardarFactura.disabled = false;
                        btnGuardarFactura.innerHTML = '<i class="fal fa-save mr-1"></i> Finalizar compra';
                    }
                });
        });
}

function compras2_abandonar_documento() {
    const doc = compras2_docActivo;
    if (!doc) {
        compras2_reset_sesion();
        return Promise.resolve();
    }

    if (compras2_modoEdicion) {
        return compras2_sync_encabezado().finally(() => compras2_reset_sesion());
    }

    const sinProveedor = !(document.getElementById('txtPosCobroNitclie')?.value);
    const sinProductos = Number(GlobalTotalDocumento || 0) === 0;

    if (sinProveedor && sinProductos) {
        return axios.post('/documentos/eliminar_documento', {
            token: TOKEN,
            sucursal: GlobalEmpnit,
            coddoc: doc.coddoc,
            correlativo: doc.correlativo
        }).catch(() => {}).finally(() => compras2_reset_sesion());
    }

    return compras2_sync_encabezado().finally(() => compras2_reset_sesion());
}

function compras2_fecha_para_input(val) {
    if (!val) return '';
    try {
        return val.toString().replace('T00:00:00.000Z', '').substring(0, 10);
    } catch (e) {
        return '';
    }
}

function compras2_aplicar_encabezado_form(r) {
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

    if (r.FECHA) setVal('txtFecha', compras2_fecha_para_input(r.FECHA));
    if (r.FECHAENTREGA) setVal('txtFechaPago', compras2_fecha_para_input(r.FECHAENTREGA));

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
    compras2_sync_proveedor_select(r.CODCLIENTE);
}

function compras2_cargar_encabezado_documento(coddoc, correlativo) {
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
        compras2_aplicar_encabezado_form(r);
        return r;
    });
}

function compras2_abrir_documento_edicion(coddoc, correlativo, idbtn) {
    const btn = idbtn ? document.getElementById(idbtn) : null;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-sync fa-spin"></i>';
    }

    compras2_reset_sesion();
    compras2_modoEdicion = true;

    if (typeof compras2_show_ingreso === 'function') {
        compras2_show_ingreso({ skipNuevo: true, skipProveedores: true, titulo: 'Editar compra' });
    }
    if (typeof compras2_show_ingreso_loader === 'function') {
        compras2_show_ingreso_loader('Cargando documento');
    }

    const loadProv = (typeof compras2_cargar_select_proveedores === 'function')
        ? compras2_cargar_select_proveedores()
        : Promise.resolve();

    return loadProv
        .then(() => compras2_cargar_encabezado_documento(coddoc, correlativo))
        .then((r) => compras2_get_coddoc(r.TIPODOC || 'COM').then(() => r))
        .then((r) => {
            compras2_aplicar_encabezado_form(r);
            compras2_docActivo = { coddoc: coddoc, correlativo: correlativo };
            compras2_bloquear_serie_doc(true);
            compras2_actualizar_ref_doc();
            const btnGuardar = document.getElementById('btnGuardarFactura');
            if (btnGuardar) btnGuardar.innerHTML = '<i class="fal fa-save mr-1"></i> Guardar cambios';
            compras2_get_tbl_pedido();
            document.getElementById('txtPosCodprod')?.focus();
            F.showToast('Documento listo para editar');
        })
        .catch(() => {
            compras2_reset_sesion();
            if (typeof compras2_show_listado === 'function') compras2_show_listado();
            F.AvisoError('No se pudo cargar el documento');
        })
        .finally(() => {
            if (typeof compras2_hide_ingreso_loader === 'function') compras2_hide_ingreso_loader();
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fal fa-edit"></i>';
            }
        });
}

function compras2_editar_documento(coddoc, correlativo, st, idbtn) {
    if (st === 'A') {
        F.AvisoError('No se puede editar un documento anulado');
        return;
    }

    F.Confirmacion('¿Está seguro que desea EDITAR este documento?')
        .then((value) => {
            if (value !== true) return;
            compras2_abrir_documento_edicion(coddoc, correlativo, idbtn);
        });
}

function compras2_format_pago(concre) {
    if (concre === 'CRE') return 'CREDITO';
    if (concre === 'CON') return 'CONTADO';
    return concre || '—';
}

function compras2_build_ticket_html(enc, lineas) {
    const head = lineas[0] || {};
    const nomProveedor = (enc.NOMCLIE || head.NOMCLIE || '').trim();
    const nit = (enc.NIT || '').trim();
    const direccion = (enc.DIRCLIE || head.DIRCLIE || '').trim();
    const obs = (enc.OBS || head.DOCOBS || '').trim();
    const nomEmpresa = (typeof GlobalNomEmpresa !== 'undefined' && GlobalNomEmpresa) ? GlobalNomEmpresa : 'SYGMA';
    const serieFac = (enc.SERIEFAC || '').trim();
    const numeroFac = (enc.NUMERO_FAC || '').trim();
    const facCompra = serieFac || numeroFac ? `${serieFac}${serieFac && numeroFac ? ' - ' : ''}${numeroFac}` : '—';
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
            <td class="text-right">${F.setMoneda(l.PRECIO || l.COSTO, 'Q')}</td>
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
            <h4>DOCUMENTO DE COMPRA</h4>
            <p>${nomEmpresa}</p>
        </div>
        <div class="sygma-embarque-doc-ticket">
            <div class="sygma-embarque-doc-ticket__head">
                <div class="sygma-embarque-doc-ticket__doc">${enc.CODDOC}-${enc.CORRELATIVO}</div>
                <div class="sygma-embarque-doc-ticket__meta">${F.convertDateNormal(enc.FECHA)} · Hora: ${enc.HORA || ''}</div>
                <div class="sygma-embarque-doc-ticket__meta">Empleado: ${enc.NOMEMPLEADO || ''}</div>
                <div class="sygma-embarque-doc-ticket__meta">Forma de pago: ${compras2_format_pago(enc.CONCRE)}</div>
                <div class="sygma-embarque-doc-ticket__meta">Factura compra: ${facCompra}</div>
                <div class="sygma-embarque-doc-ticket__cliente"><strong>Proveedor:</strong> ${nomProveedor || '—'}</div>
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

function compras2_ejecutar_impresion() {
    document.body.classList.add('sygma-print-embarque-active');
    window.print();
    setTimeout(() => {
        document.body.classList.remove('sygma-print-embarque-active');
        const host = document.getElementById('compras2_print_host');
        if (host) host.innerHTML = '';
    }, 600);
}

function compras2_imprimir_documento(coddoc, correlativo, idbtn) {
    const btn = idbtn ? document.getElementById(idbtn) : null;
    const host = document.getElementById('compras2_print_host');
    if (!host) return;

    if (btn) {
        btn.innerHTML = '<i class="fal fa-print fa-spin"></i>';
        btn.disabled = true;
    }

    F.showToast('Generando imprimible...');

    Promise.all([
        compras2_cargar_encabezado_documento(coddoc, correlativo),
        GF.get_data_detalle_documento(GlobalEmpnit, coddoc, correlativo)
            .then((data) => data.recordset || [])
            .catch(() => [])
    ])
        .then(([enc, lineas]) => {
            host.innerHTML = `<div class="sygma-embarque-print-tickets">${compras2_build_ticket_html(enc, lineas)}</div>`;
            compras2_ejecutar_impresion();
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

function compras2_eliminar_documento_listado(coddoc, correlativo, st, idbtn) {
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
                if (typeof compras2_cargar_listado === 'function') compras2_cargar_listado();
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

function compras2_setup_ingreso_listeners() {
    if (compras2_ingresoListenersReady) return;
    compras2_ingresoListenersReady = true;

    const cmbPrioridad = document.getElementById('cmbPrioridad');
    if (cmbPrioridad) cmbPrioridad.innerHTML = F.get_prioridades();

    compras2_get_vendedores();
    compras2_get_cajas();
    compras2_listener_coddoc();

    document.getElementById('btnCompras2VolverListado')?.addEventListener('click', () => {
        if (typeof compras2_volver_listado === 'function') compras2_volver_listado();
    });

    document.getElementById('btnGuardarFactura')?.addEventListener('click', () => {
        const btn = document.getElementById('btnGuardarFactura');
        if (btn?.disabled) return;
        compras2_abrir_modal_finalizar();
    });

    document.getElementById('cmbCompras2FinalizarPago')?.addEventListener('change', compras2_toggle_finalizar_fecha_pago);
    document.getElementById('btnCompras2FinalizarConfirmar')?.addEventListener('click', compras2_confirmar_finalizar_compra);
    document.getElementById('btnCompras2CargarCostos')?.addEventListener('click', compras2_abrir_modal_cargar_costos);
    document.getElementById('btnCompras2CostosCargar')?.addEventListener('click', compras2_aplicar_costos_catalogo);

    ['txtObs', 'txtSerieFac', 'txtNumeroFac', 'txtCoddocOrigen', 'txtCorrelativoOrigen'].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', compras2_programar_sync_encabezado);
    });
    ['cmbConCre', 'cmbCaja', 'cmbVendedor', 'cmbPrioridad', 'txtFecha', 'txtFechaPago', 'cmbCompras2Proveedor'].forEach((id) => {
        document.getElementById(id)?.addEventListener('change', () => {
            if (id === 'cmbCompras2Proveedor') compras2_on_proveedor_select_change();
            else compras2_programar_sync_encabezado();
        });
    });

    const txtPosCodprod = document.getElementById('txtPosCodprod');
    txtPosCodprod?.addEventListener('keyup', (e) => {
        txtPosCodprod.value = txtPosCodprod.value.toUpperCase();
        if (e.code === 'Enter' || e.keyCode === 13) document.getElementById('btnBuscarProd')?.click();
    });
    document.getElementById('btnBuscarProd')?.addEventListener('click', () => {
        txtPosCodprod.value = txtPosCodprod.value.toUpperCase();
        const filtro = txtPosCodprod.value || '';
        if (filtro) compras2_get_buscar_producto(filtro);
    });

    document.getElementById('btnMCGuardar')?.addEventListener('click', () => {
        const btn = document.getElementById('btnMCGuardar');
        if (btn?.disabled) return;

        const doc = compras2_get_doc_activo();
        if (!doc) return;
        if (!compras2_validar_proveedor_seleccionado()) return;

        const cantidad = Number(document.getElementById('txtMCCantidad').value || 1);
        const preciounitario = Number(document.getElementById('txtMCPrecio').value || 0);
        const descuento = 0;
        if (preciounitario === 0) { F.AvisoError('Precio inválido'); return; }
        if (preciounitario < Number(Selected_costo)) { F.AvisoError('Precio menor al costo'); return; }
        const tipoprecio = data_empresa_config?.TIPO_PRECIO || '';

        const btnHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-sync fa-spin mr-1"></i> Agregando...';

        compras2_insert_item_api(doc.coddoc, doc.correlativo, Selected_codprod, Selected_desprod, Selected_codmedida,
            cantidad, Selected_equivale, Selected_costo, preciounitario, descuento, Selected_tipoprod, tipoprecio,
            Selected_existencia, Selected_bono, Selected_exento)
            .then(() => {
                $('#modal_cantidad').modal('hide');
                F.showToast('Producto agregado ' + Selected_desprod);
                compras2_get_tbl_pedido();
                txtPosCodprod.focus();
            })
            .catch(() => F.AvisoError('No se pudo agregar'))
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = btnHtml;
            });
    });

    document.getElementById('txtMCCantidad')?.addEventListener('input', compras2_CalcularTotalPrecio);
    document.getElementById('txtMCPrecio')?.addEventListener('input', compras2_CalcularTotalPrecio);

    document.getElementById('btnMCGuardarE')?.addEventListener('click', () => {
        const btn = document.getElementById('btnMCGuardarE');
        if (btn?.disabled) return;

        const doc = compras2_get_doc_activo();
        if (!doc) return;

        const cantidad = Number(document.getElementById('txtMCCantidadE').value || 1);
        const preciounitario = Number(document.getElementById('txtMCPrecioE').value || 0);
        const descuento = Number(typeof Selected_descuento !== 'undefined' ? Selected_descuento : 0) || 0;
        if (preciounitario === 0) { F.AvisoError('Precio inválido'); return; }
        if (preciounitario < Number(Selected_costo)) { F.AvisoError('Precio menor al costo'); return; }
        const tipoprecio = data_empresa_config?.TIPO_PRECIO || '';

        const btnHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-sync fa-spin mr-1"></i> Guardando...';

        GF.get_documento_eliminar_item(Selected_id)
            .then(() => compras2_insert_item_api(doc.coddoc, doc.correlativo, Selected_codprod, Selected_desprod,
                Selected_codmedida, cantidad, Selected_equivale, Selected_costo, preciounitario, descuento,
                Selected_tipoprod, tipoprecio, Selected_existencia, Selected_bono, Selected_exento))
            .then(() => {
                $('#modal_editar_cantidad').modal('hide');
                compras2_get_tbl_pedido();
                txtPosCodprod?.focus();
            })
            .catch(() => F.AvisoError('No se pudo actualizar'))
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = btnHtml;
            });
    });
    document.getElementById('txtMCCantidadE')?.addEventListener('input', compras2_CalcularTotalPrecioEditar);
    document.getElementById('txtMCPrecioE')?.addEventListener('input', compras2_CalcularTotalPrecioEditar);
}

window.compras2_calcular_descuento = compras2_calcular_descuento;
window.compras2_get_producto = compras2_get_producto;
window.compras2_edit_item_pedido = compras2_edit_item_pedido;
window.compras2_delete_item_pedido = compras2_delete_item_pedido;
window.compras2_editar_documento = compras2_editar_documento;
window.compras2_imprimir_documento = compras2_imprimir_documento;
window.compras2_eliminar_documento_listado = compras2_eliminar_documento_listado;
