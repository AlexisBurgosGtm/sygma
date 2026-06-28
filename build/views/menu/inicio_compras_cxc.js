var compras_cxc_rows_data = [];
var compras_cxc_factura_sel = null;
var compras_cxc_listeners_ready = false;
var compras_cxc_vendedores_ready = false;

function compras_cxc_show_loader(mensaje) {
    const overlay = document.getElementById('comprasCxcLoaderOverlay');
    if (!overlay) return;
    const txt = overlay.querySelector('.cxc-loader-overlay__text');
    if (txt) txt.innerText = mensaje || 'Procesando...';
    overlay.classList.remove('d-none');
}

function compras_cxc_hide_loader() {
    document.getElementById('comprasCxcLoaderOverlay')?.classList.add('d-none');
}

function compras_cxc_calc_dias(fecha) {
    try {
        const raw = String(fecha || '').replace('T00:00:00.000Z', '').substring(0, 10);
        const [yy, mm, dd] = raw.split('-').map(Number);
        const fDoc = new Date(yy, mm - 1, dd);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        fDoc.setHours(0, 0, 0, 0);
        const diff = Math.floor((hoy - fDoc) / (1000 * 60 * 60 * 24));
        return diff >= 0 ? diff : 0;
    } catch (e) {
        return 0;
    }
}

function compras_cxc_get_factura_importe(r) {
    return Number(r.TOTALVENTA || r.TOTALPRECIO || 0);
}

function compras_cxc_get_mes() {
    if (typeof compras_getMes === 'function') return compras_getMes();
    return String(new Date().getMonth() + 1);
}

function compras_cxc_get_anio() {
    if (typeof compras_getAnio === 'function') return compras_getAnio();
    return String(new Date().getFullYear());
}

function compras_cxc_get_periodo_filtro() {
    const alcance = document.getElementById('comprasCxcAlcance')?.value || 'MES';
    if (alcance === 'TODAS') return { mes: 'TODOS', anio: 'TODOS' };
    return { mes: compras_cxc_get_mes(), anio: compras_cxc_get_anio() };
}

function compras_cxc_cargar_vendedores() {
    const cmb = document.getElementById('comprasCxcVendedor');
    if (!cmb || compras_cxc_vendedores_ready) return Promise.resolve();

    const valorActual = cmb.value || 'TODOS';
    cmb.innerHTML = '<option value="TODOS">TODOS</option>';

    return GF.get_data_empleados_tipo(3)
        .then((data) => {
            let str = '<option value="TODOS">TODOS</option>';
            (data.recordset || []).forEach((r) => {
                str += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>`;
            });
            cmb.innerHTML = str;
            if ([...cmb.options].some((o) => o.value === valorActual)) {
                cmb.value = valorActual;
            } else {
                cmb.value = 'TODOS';
            }
            compras_cxc_vendedores_ready = true;
        })
        .catch(() => {
            cmb.innerHTML = '<option value="TODOS">TODOS</option>';
        });
}

function compras_cxc_setup_listeners() {
    if (compras_cxc_listeners_ready) return;
    compras_cxc_listeners_ready = true;

    document.getElementById('comprasCxcVendedor')?.addEventListener('change', compras_cxc_cargar_listado);
    document.getElementById('comprasCxcAlcance')?.addEventListener('change', compras_cxc_cargar_listado);
    document.getElementById('btnComprasCxcRecargar')?.addEventListener('click', compras_cxc_cargar_listado);
    document.getElementById('btnComprasCxcCorregirSaldos')?.addEventListener('click', compras_cxc_corregir_saldos);
    document.getElementById('btnComprasCxcHistorial')?.addEventListener('click', compras_cxc_mostrar_historial);
    document.getElementById('btnComprasCxcAbono')?.addEventListener('click', compras_cxc_abrir_modal_abono);
    document.getElementById('btnComprasCxcGuardarAbono')?.addEventListener('click', compras_cxc_guardar_abono);
    document.getElementById('comprasCxcAbonoCoddoc')?.addEventListener('change', compras_cxc_cargar_correlativo_rcc);
}

function compras_init_creditos() {
    compras_cxc_setup_listeners();
    compras_cxc_cargar_vendedores().finally(() => compras_cxc_cargar_listado());
}

function compras_cxc_abrir_opciones(idx) {
    const r = compras_cxc_rows_data[idx];
    if (!r) return;
    compras_cxc_factura_sel = r;
    document.getElementById('lbComprasCxcModalTitulo').innerText = `${r.CODDOC}-${r.CORRELATIVO}`;
    document.getElementById('lbComprasCxcModalSubtitulo').innerText = `${r.NOMBRE || ''} · Saldo ${F.setMoneda(Number(r.DOC_SALDO || 0), 'Q')}`;
    $('#modalComprasCxcOpciones').modal('show');
}

function compras_cxc_mostrar_historial() {
    if (!compras_cxc_factura_sel) return;
    const r = compras_cxc_factura_sel;
    $('#modalComprasCxcOpciones').modal('hide');
    document.getElementById('lbComprasCxcHistorialTitulo').innerText = `Historial · ${r.CODDOC}-${r.CORRELATIVO}`;
    const body = document.getElementById('tblComprasCxcHistorialBody');
    body.innerHTML = `<tr><td colspan="6" class="text-center py-3">${GlobalLoader}</td></tr>`;
    $('#modalComprasCxcHistorial').modal('show');

    GF.get_historial_abonos_cxc(r.CODDOC, r.CORRELATIVO)
        .then((data) => {
            let str = '';
            (data.recordset || []).forEach((h) => {
                const tipo = h.TIPODOC || 'RCC';
                const tipoLabel = tipo === 'DEV' ? 'DEVOLUCIÓN' : 'ABONO';
                const fpago = [h.FPAGO_TIPO, h.FPAGO_DETALLE].filter(Boolean).join(' · ');
                str += `<tr>
                    <td>${F.convertDateNormal(h.FECHA)}</td>
                    <td><span class="badge badge-${tipo === 'DEV' ? 'warning' : 'success'}">${tipoLabel}</span></td>
                    <td class="negrita">${h.CODDOC}-${h.CORRELATIVO}</td>
                    <td class="text-right">${F.setMoneda(Number(h.TOTALPRECIO || 0), 'Q')}</td>
                    <td>${fpago || '—'}</td>
                    <td>${h.USUARIO || ''}</td>
                </tr>`;
            });
            body.innerHTML = str || `<tr><td colspan="6" class="text-center text-muted py-3">Sin abonos ni devoluciones registrados</td></tr>`;
        })
        .catch(() => {
            body.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No se cargó el historial</td></tr>`;
        });
}

function compras_cxc_cargar_correlativo_rcc() {
    const coddoc = document.getElementById('comprasCxcAbonoCoddoc')?.value;
    if (!coddoc) return;
    GF.get_data_coddoc_correlativo(coddoc)
        .then((correlativo) => {
            document.getElementById('txtComprasCxcAbonoCorrelativo').value = correlativo;
        })
        .catch(() => {
            document.getElementById('txtComprasCxcAbonoCorrelativo').value = '0';
        });
}

function compras_cxc_abrir_modal_abono() {
    if (!compras_cxc_factura_sel) return;
    const r = compras_cxc_factura_sel;
    $('#modalComprasCxcOpciones').modal('hide');

    const importe = compras_cxc_get_factura_importe(r);
    const abonos = Number(r.DOC_ABONOS || 0);
    const saldo = Number(r.DOC_SALDO || 0);

    document.getElementById('lbComprasCxcAbonoFactura').innerText = `${r.CODDOC}-${r.CORRELATIVO} · ${r.NOMBRE || ''}`;
    document.getElementById('lbComprasCxcAbonoTotalFac').innerText = F.setMoneda(importe, 'Q');
    document.getElementById('lbComprasCxcAbonoTotalAbonos').innerText = F.setMoneda(abonos, 'Q');
    document.getElementById('lbComprasCxcAbonoTotalSaldo').innerText = F.setMoneda(saldo, 'Q');
    document.getElementById('txtComprasCxcAbonoMonto').value = '';
    document.getElementById('comprasCxcFpagoTipo').value = 'EFECTIVO';
    document.getElementById('txtComprasCxcFpagoDetalle').value = '';
    document.getElementById('txtComprasCxcAbonoFecha').value = F.getFecha();

    const cmbCoddoc = document.getElementById('comprasCxcAbonoCoddoc');
    cmbCoddoc.innerHTML = `<option value="">Cargando...</option>`;

    GF.get_data_tipodoc_coddoc('RCC')
        .then((data) => {
            let str = '';
            (data.recordset || []).forEach((td) => {
                str += `<option value="${td.CODDOC}">${td.CODDOC}</option>`;
            });
            cmbCoddoc.innerHTML = str || `<option value="">Sin tipo RCC</option>`;
            compras_cxc_cargar_correlativo_rcc();
        })
        .catch(() => {
            cmbCoddoc.innerHTML = `<option value="">Sin tipo RCC</option>`;
            document.getElementById('txtComprasCxcAbonoCorrelativo').value = '0';
        });

    $('#modalComprasCxcAbono').modal('show');
}

function compras_cxc_guardar_abono() {
    if (!compras_cxc_factura_sel) return;
    const r = compras_cxc_factura_sel;

    const coddoc = document.getElementById('comprasCxcAbonoCoddoc')?.value;
    const correlativo = document.getElementById('txtComprasCxcAbonoCorrelativo')?.value;
    const fecha = document.getElementById('txtComprasCxcAbonoFecha')?.value;
    const monto = Number(document.getElementById('txtComprasCxcAbonoMonto')?.value || 0);
    const saldo = Number(r.DOC_SALDO || 0);
    const fpago_tipo = document.getElementById('comprasCxcFpagoTipo')?.value || 'EFECTIVO';
    const fpago_detalle = F.limpiarTexto(document.getElementById('txtComprasCxcFpagoDetalle')?.value || '');

    if (!coddoc) { F.AvisoError('Seleccione un tipo de documento RCC'); return; }
    if (!correlativo || correlativo === '0') { F.AvisoError('No hay correlativo disponible'); return; }
    if (!fecha) { F.AvisoError('Indique la fecha del abono'); return; }
    if (!monto || monto <= 0) { F.AvisoError('Indique un monto válido'); return; }
    if (monto > saldo) { F.AvisoError('El monto no puede ser mayor al saldo'); return; }
    if ((fpago_tipo === 'DEPOSITO' || fpago_tipo === 'CHEQUE' || fpago_tipo === 'OTROS') && !fpago_detalle) {
        F.AvisoError('Indique el detalle de la forma de pago');
        return;
    }

    const btn = document.getElementById('btnComprasCxcGuardarAbono');
    btn.disabled = true;

    F.Confirmacion(`¿Registrar abono de ${F.setMoneda(monto, 'Q')} a la factura ${r.CODDOC}-${r.CORRELATIVO}?`)
        .then((value) => {
            if (value !== true) {
                btn.disabled = false;
                return;
            }
            GF.insert_abono_cxc({
                coddoc,
                correlativo,
                fecha,
                monto,
                fac_coddoc: r.CODDOC,
                fac_correlativo: r.CORRELATIVO,
                codcliente: r.CODCLIENTE || 0,
                nitclie: r.NIT || '',
                nomclie: F.limpiarTexto(r.NOMBRE || ''),
                dirclie: F.limpiarTexto(r.DIRECCION || ''),
                codven: r.CODEMP || 0,
                usuario: GlobalUsuario,
                hora: F.getHora(),
                codcaja: 1,
                iva: GlobalConfigIVA,
                fpago_tipo,
                fpago_detalle
            })
                .then(() => {
                    F.Aviso('Abono registrado correctamente');
                    $('#modalComprasCxcAbono').modal('hide');
                    compras_cxc_cargar_listado();
                })
                .catch(() => F.AvisoError('No se pudo registrar el abono'))
                .finally(() => { btn.disabled = false; });
        })
        .catch(() => { btn.disabled = false; });
}

function compras_cxc_corregir_saldos() {
    F.Confirmacion('¿Está seguro que desea corregir los saldos de todas las facturas al crédito según sus abonos y devoluciones?')
        .then((value) => {
            if (value !== true) return;
            const btn = document.getElementById('btnComprasCxcCorregirSaldos');
            if (btn) btn.disabled = true;
            compras_cxc_show_loader('Corrigiendo saldos...');
            GF.corregir_saldos_cxc()
                .then(() => {
                    F.Aviso('Saldos corregidos correctamente');
                    compras_cxc_cargar_listado();
                })
                .catch(() => F.AvisoError('No se pudo corregir los saldos'))
                .finally(() => {
                    compras_cxc_hide_loader();
                    if (btn) btn.disabled = false;
                });
        });
}

function compras_cxc_render_filas(rows) {
    const container = document.getElementById('tblDataComprasCxcDocumentos');
    if (!container) return;

    let str = '';
    let contador = 0;
    let totalSaldo = 0;
    let totalImporte = 0;
    let totalAbonos = 0;

    compras_cxc_rows_data = rows || [];
    compras_cxc_rows_data.forEach((r, idx) => {
        contador += 1;
        const importe = compras_cxc_get_factura_importe(r);
        const abonos = Number(r.DOC_ABONOS || 0);
        const saldo = Number(r.DOC_SALDO || 0);
        const dias = compras_cxc_calc_dias(r.FECHA);
        totalImporte += importe;
        totalAbonos += abonos;
        totalSaldo += saldo;
        const vencimiento = r.VENCIMIENTO ? F.convertDateNormal(r.VENCIMIENTO) : '—';
        str += `<tr class="hand" onclick="compras_cxc_abrir_opciones(${idx})" title="Ver opciones">
            <td class="sygma-embarque-rpt__cell-stack">
                <span class="sygma-embarque-rpt__cell-main">${F.convertDateNormal(r.FECHA)}</span>
                <span class="sygma-embarque-rpt__cell-sub">${r.EMPLEADO || ''}</span>
            </td>
            <td class="negrita text-info">${r.CODDOC}-${r.CORRELATIVO}</td>
            <td>${r.NIT || ''}</td>
            <td class="sygma-embarque-rpt__cell-stack">
                <span class="sygma-embarque-rpt__cell-main">${r.NOMBRE || ''}</span>
                <span class="sygma-embarque-rpt__cell-sub">${F.limpiarTexto(r.DIRECCION || '')}</span>
            </td>
            <td>${vencimiento}</td>
            <td class="text-right">${F.setMoneda(importe, 'Q')}</td>
            <td class="text-right">${F.setMoneda(abonos, 'Q')}</td>
            <td class="text-right negrita text-danger">${F.setMoneda(saldo, 'Q')}</td>
            <td class="text-center"><span class="badge badge-success cxc-dias-badge">${dias}</span></td>
        </tr>`;
    });

    container.innerHTML = str || `<tr><td colspan="9" class="text-center text-muted py-4">No hay facturas al crédito con saldo pendiente</td></tr>`;

    const lbDocs = document.getElementById('lbComprasCxcTotalDocs');
    if (lbDocs) lbDocs.innerText = `Docs: ${contador}`;

    const totalBlock = document.getElementById('lbComprasCxcTotalBlock');
    if (totalBlock) {
        totalBlock.innerHTML = contador ? `
            <div class="sygma-embarque-rpt__total-inner">
                <span class="sygma-embarque-rpt__foot-label">DOCUMENTOS</span>
                <span class="sygma-embarque-rpt__foot-total">${contador}</span>
                <span class="sygma-embarque-rpt__foot-label">IMPORTE</span>
                <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(totalImporte, 'Q')}</span>
                <span class="sygma-embarque-rpt__foot-label">ABONOS</span>
                <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(totalAbonos, 'Q')}</span>
                <span class="sygma-embarque-rpt__foot-label">SALDO</span>
                <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(totalSaldo, 'Q')}</span>
            </div>` : '';
    }

    const txtBuscar = document.getElementById('txtComprasCxcBuscar');
    if (txtBuscar?.value) F.FiltrarTabla('tblComprasCxcDocumentos', 'txtComprasCxcBuscar');
}

function compras_cxc_cargar_listado() {
    const container = document.getElementById('tblDataComprasCxcDocumentos');
    if (!container) return;

    const { mes, anio } = compras_cxc_get_periodo_filtro();
    const codven = document.getElementById('comprasCxcVendedor')?.value || 'TODOS';

    container.innerHTML = `<tr><td colspan="9" class="text-center py-3">${GlobalLoader}</td></tr>`;

    GF.get_data_cuentas_cobrar(mes, anio)
        .then((data) => {
            let rows = data.recordset || [];
            if (codven !== 'TODOS') {
                rows = rows.filter((r) => String(r.CODEMP) === String(codven));
            }
            compras_cxc_render_filas(rows);
        })
        .catch(() => {
            compras_cxc_rows_data = [];
            container.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">No se cargaron datos</td></tr>`;
            const lbDocs = document.getElementById('lbComprasCxcTotalDocs');
            if (lbDocs) lbDocs.innerText = 'Docs: 0';
            const totalBlock = document.getElementById('lbComprasCxcTotalBlock');
            if (totalBlock) totalBlock.innerHTML = '';
        });
}

window.compras_cxc_abrir_opciones = compras_cxc_abrir_opciones;
