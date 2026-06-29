var ventas_cxc_rows_data = [];
var ventas_cxc_listeners_ready = false;

function ventas_cxc_calc_dias_vencido(fechaVenc) {
    if (!fechaVenc) return 0;
    try {
        const raw = String(fechaVenc).replace('T00:00:00.000Z', '').substring(0, 10);
        const [yy, mm, dd] = raw.split('-').map(Number);
        const fVenc = new Date(yy, mm - 1, dd);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        fVenc.setHours(0, 0, 0, 0);
        const diff = Math.floor((hoy - fVenc) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    } catch (e) {
        return 0;
    }
}

function ventas_cxc_format_vencimiento_cell(fechaVenc) {
    const vencimiento = fechaVenc ? F.convertDateNormal(fechaVenc) : '—';
    const diasVencido = ventas_cxc_calc_dias_vencido(fechaVenc);
    const badgeClass = diasVencido > 0 ? 'badge-danger' : 'badge-success';
    return `<span class="cxc-vencimiento-cell"><span>${vencimiento}</span><span class="badge ${badgeClass} cxc-vencido-badge">${diasVencido}</span></span>`;
}

function ventas_cxc_get_factura_importe(r) {
    return Number(r.TOTALPRECIO || r.TOTALVENTA || 0);
}

function ventas_cxc_get_factura_descuento(r) {
    return Number(r.TOTALDESCUENTO || 0);
}

function ventas_cxc_get_factura_a_pagar(r) {
    return Math.max(0, ventas_cxc_get_factura_importe(r) - ventas_cxc_get_factura_descuento(r));
}

function ventas_cxc_get_saldo_pendiente(r) {
    const abonos = Number(r.DOC_ABONOS || 0);
    return Math.max(0, ventas_cxc_get_factura_a_pagar(r) - abonos);
}

function ventas_cxc_get_mes() {
    if (typeof ventas_getMes === 'function') return ventas_getMes();
    return String(new Date().getMonth() + 1);
}

function ventas_cxc_get_anio() {
    if (typeof ventas_getAnio === 'function') return ventas_getAnio();
    return String(new Date().getFullYear());
}

function ventas_cxc_get_codven() {
    return String(GlobalCodUsuario || '0');
}

function ventas_cxc_get_periodo_filtro() {
    const alcance = document.getElementById('ventasCxcAlcance')?.value || 'MES';
    if (alcance === 'TODAS') return { mes: 'TODOS', anio: 'TODOS' };
    return { mes: ventas_cxc_get_mes(), anio: ventas_cxc_get_anio() };
}

function ventas_cxc_setup_listeners() {
    if (ventas_cxc_listeners_ready) return;
    ventas_cxc_listeners_ready = true;

    document.getElementById('ventasCxcAlcance')?.addEventListener('change', ventas_cxc_cargar_listado);
    document.getElementById('btnVentasCxcRecargar')?.addEventListener('click', ventas_cxc_cargar_listado);
}

function ventas_init_creditos() {
    ventas_cxc_setup_listeners();
    ventas_cxc_cargar_listado();
}

function ventas_cxc_mostrar_historial(idx) {
    const r = ventas_cxc_rows_data[idx];
    if (!r) return;

    document.getElementById('lbVentasCxcHistorialTitulo').innerText = `Historial · ${r.CODDOC}-${r.CORRELATIVO}`;
    const body = document.getElementById('tblVentasCxcHistorialBody');
    body.innerHTML = `<tr><td colspan="6" class="text-center py-3">${GlobalLoader}</td></tr>`;
    $('#modalVentasCxcHistorial').modal('show');

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

function ventas_cxc_render_filas(rows) {
    const container = document.getElementById('tblDataVentasCxcDocumentos');
    if (!container) return;

    let str = '';
    let contador = 0;
    let totalSaldo = 0;
    let totalImporte = 0;
    let totalDescuento = 0;
    let totalAPagar = 0;
    let totalAbonos = 0;

    ventas_cxc_rows_data = rows || [];
    ventas_cxc_rows_data.forEach((r, idx) => {
        contador += 1;
        const importe = ventas_cxc_get_factura_importe(r);
        const descuento = ventas_cxc_get_factura_descuento(r);
        const aPagar = ventas_cxc_get_factura_a_pagar(r);
        const abonos = Number(r.DOC_ABONOS || 0);
        const saldo = ventas_cxc_get_saldo_pendiente(r);
        const diasCredito = Number(r.DIASCREDITO || 0);
        totalImporte += importe;
        totalDescuento += descuento;
        totalAPagar += aPagar;
        totalAbonos += abonos;
        totalSaldo += saldo;
        str += `<tr class="hand cxc-ventas-row" onclick="ventas_cxc_mostrar_historial(${idx})" title="Ver historial de abonos">
            <td data-label="FECHA">${F.convertDateNormal(r.FECHA)}</td>
            <td data-label="DOCUMENTO" class="negrita text-info">${r.CODDOC}-${r.CORRELATIVO}</td>
            <td data-label="NIT" class="d-none d-md-table-cell">${r.NIT || ''}</td>
            <td data-label="CLIENTE" class="sygma-embarque-rpt__cell-stack">
                <span class="sygma-embarque-rpt__cell-main">${r.NOMBRE || ''}</span>
                <span class="sygma-embarque-rpt__cell-sub d-md-none">${r.NIT || ''}</span>
                <span class="sygma-embarque-rpt__cell-sub">${F.limpiarTexto(r.DIRECCION || '')}</span>
            </td>
            <td data-label="VENCIMIENTO">${ventas_cxc_format_vencimiento_cell(r.VENCIMIENTO)}</td>
            <td data-label="IMPORTE" class="text-right">${F.setMoneda(importe, 'Q')}</td>
            <td data-label="DESCUENTO" class="text-right d-none d-lg-table-cell">${F.setMoneda(descuento, 'Q')}</td>
            <td data-label="A PAGAR" class="text-right negrita text-info">${F.setMoneda(aPagar, 'Q')}</td>
            <td data-label="ABONOS" class="text-right d-none d-sm-table-cell">${F.setMoneda(abonos, 'Q')}</td>
            <td data-label="SALDO" class="text-right negrita text-danger">${F.setMoneda(saldo, 'Q')}</td>
            <td data-label="DIAS CREDITO" class="text-center d-none d-lg-table-cell"><span class="badge badge-secondary cxc-dias-badge">${diasCredito}</span></td>
        </tr>`;
    });

    container.innerHTML = str || `<tr><td colspan="11" class="text-center text-muted py-4">No hay facturas al crédito con saldo pendiente</td></tr>`;

    const lbDocs = document.getElementById('lbVentasCxcTotalDocs');
    if (lbDocs) lbDocs.innerText = `Docs: ${contador}`;

    const totalBlock = document.getElementById('lbVentasCxcTotalBlock');
    if (totalBlock) {
        totalBlock.innerHTML = contador ? `
            <div class="sygma-embarque-rpt__total-inner cxc-ventas-totals">
                <span class="sygma-embarque-rpt__foot-label">DOCUMENTOS</span>
                <span class="sygma-embarque-rpt__foot-total">${contador}</span>
                <span class="sygma-embarque-rpt__foot-label">A PAGAR</span>
                <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(totalAPagar, 'Q')}</span>
                <span class="sygma-embarque-rpt__foot-label">SALDO</span>
                <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(totalSaldo, 'Q')}</span>
            </div>` : '';
    }

    const txtBuscar = document.getElementById('txtVentasCxcBuscar');
    if (txtBuscar?.value) F.FiltrarTabla('tblVentasCxcDocumentos', 'txtVentasCxcBuscar');
}

function ventas_cxc_cargar_listado() {
    const container = document.getElementById('tblDataVentasCxcDocumentos');
    if (!container) return;

    const { mes, anio } = ventas_cxc_get_periodo_filtro();
    const codven = ventas_cxc_get_codven();

    container.innerHTML = `<tr><td colspan="11" class="text-center py-3">${GlobalLoader}</td></tr>`;

    GF.get_data_cuentas_cobrar(mes, anio)
        .then((data) => {
            let rows = (data.recordset || []).filter((r) => String(r.CODEMP) === String(codven));
            ventas_cxc_render_filas(rows);
        })
        .catch(() => {
            ventas_cxc_rows_data = [];
            container.innerHTML = `<tr><td colspan="11" class="text-center text-muted py-4">No se cargaron datos</td></tr>`;
            const lbDocs = document.getElementById('lbVentasCxcTotalDocs');
            if (lbDocs) lbDocs.innerText = 'Docs: 0';
            const totalBlock = document.getElementById('lbVentasCxcTotalBlock');
            if (totalBlock) totalBlock.innerHTML = '';
        });
}

window.ventas_cxc_mostrar_historial = ventas_cxc_mostrar_historial;
