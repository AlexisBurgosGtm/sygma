var cxc_rows_data = [];
var cxc_factura_sel = null;

function getView() {
    let view = {
        body: () => {
            return `
            <div class="col-12 p-0">
                ${view.vista_listado()}
                ${view.vista_modales()}
            </div>`;
        },
        vista_listado: () => {
            return `
            <div class="sygma-embarque-rpt card card-rounded shadow-sm col-12 border-0" id="rpt_cuentas_cobrar">
                <div id="cxcLoaderOverlay" class="cxc-loader-overlay d-none">
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
                                <h4 class="sygma-embarque-rpt__title mb-0">Cuentas por Cobrar</h4>
                                <span class="sygma-embarque-rpt__embarque-date">Facturas al crédito con saldo pendiente</span>
                            </div>
                        </div>
                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                            <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbCxcTotalDocs">Docs: 0</span>
                            <button type="button" class="btn btn-info btn-md btn-circle hand shadow sygma-embarque-rpt__print-btn" title="Imprimir" onclick="F.imprimirSelec('rpt_cuentas_cobrar')">
                                <i class="fal fa-print"></i>
                            </button>
                        </div>
                    </header>

                    <div class="sygma-embarque-rpt__toolbar sygma-embarques-filtros oculto-impresion">
                        <div class="sygma-embarques-filtros__row">
                            <div class="sygma-embarques-filtros__field">
                                <label class="sygma-embarques-filtros__label" for="cmbCxcMes">Mes</label>
                                <select class="form-control sygma-embarques-filtros__select" id="cmbCxcMes"></select>
                            </div>
                            <div class="sygma-embarques-filtros__field">
                                <label class="sygma-embarques-filtros__label" for="cmbCxcAnio">Año</label>
                                <select class="form-control sygma-embarques-filtros__select" id="cmbCxcAnio"></select>
                            </div>
                            <div class="sygma-embarques-filtros__field">
                                <label class="sygma-embarques-filtros__label" for="cmbCxcAlcance">Alcance</label>
                                <select class="form-control sygma-embarques-filtros__select" id="cmbCxcAlcance">
                                    <option value="MES">POR MES</option>
                                    <option value="TODAS">TODAS</option>
                                </select>
                            </div>
                            <div class="sygma-embarques-filtros__field d-flex align-items-end">
                                <button type="button" class="btn btn-base btn-sm hand" id="btnCxcRecargar">
                                    <i class="fal fa-sync mr-1"></i> Actualizar
                                </button>
                            </div>
                            <div class="sygma-embarques-filtros__field d-flex align-items-end">
                                <button type="button" class="btn btn-warning btn-sm hand" id="btnCxcCorregirSaldos">
                                    <i class="fal fa-wrench mr-1"></i> Corregir saldos
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="sygma-embarque-rpt__toolbar oculto-impresion mb-2">
                        <input type="search" class="form-control sygma-embarque-rpt__search"
                            placeholder="Buscar documento, cliente, NIT..."
                            oninput="F.FiltrarTabla('tblCxcDocumentos','txtBuscarCxc')"
                            id="txtBuscarCxc">
                    </div>

                    <div class="table-responsive sygma-embarque-rpt__table-wrap">
                        <table class="table sygma-embarque-rpt__table mb-0" id="tblCxcDocumentos">
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
                            <tbody id="tblDataCxcDocumentos"></tbody>
                        </table>
                    </div>
                    <div class="sygma-embarque-rpt__total-block" id="lbCxcTotalBlock"></div>
                </div>
            </div>`;
        },
        vista_modales: () => {
            return `
            <div class="modal fade" id="modalCxcOpciones" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2">
                            <h5 class="modal-title text-white negrita mb-0" id="lbCxcModalTitulo">Factura</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body p-3">
                            <p class="mb-3 text-muted text-center" id="lbCxcModalSubtitulo"></p>
                            <div class="row cxc-opciones-grid">
                                <div class="col-6 mb-3">
                                    <button type="button" class="cxc-opcion-card hand w-100" id="btnCxcHistorial">
                                        <i class="fal fa-history cxc-opcion-card__icon text-info"></i>
                                        <span class="cxc-opcion-card__label">HISTORIAL</span>
                                    </button>
                                </div>
                                <div class="col-6 mb-3">
                                    <button type="button" class="cxc-opcion-card hand w-100" id="btnCxcEstadoCuenta">
                                        <i class="fal fa-file-alt cxc-opcion-card__icon text-secondary"></i>
                                        <span class="cxc-opcion-card__label">ESTADO DE CUENTA</span>
                                    </button>
                                </div>
                                <div class="col-6 mb-3">
                                    <button type="button" class="cxc-opcion-card hand w-100" id="btnCxcCambiarContado">
                                        <i class="fal fa-dollar-sign cxc-opcion-card__icon text-primary"></i>
                                        <span class="cxc-opcion-card__label">CAMBIAR A CONTADO</span>
                                    </button>
                                </div>
                                <div class="col-6 mb-3">
                                    <button type="button" class="cxc-opcion-card hand w-100" id="btnCxcAbono">
                                        <i class="fal fa-dollar-sign cxc-opcion-card__icon text-success"></i>
                                        <span class="cxc-opcion-card__label">ABONO</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="modalCxcHistorial" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2">
                            <h5 class="modal-title text-white negrita mb-0" id="lbCxcHistorialTitulo">Historial de abonos</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body p-3">
                            <div class="table-responsive">
                                <table class="table table-sm table-striped mb-0">
                                    <thead>
                                        <tr>
                                            <th>FECHA</th>
                                            <th>TIPO</th>
                                            <th>DOCUMENTO</th>
                                            <th class="text-right">MONTO</th>
                                            <th>FORMA PAGO</th>
                                            <th>USUARIO</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tblCxcHistorialBody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="modalCxcAbono" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2">
                            <h5 class="modal-title text-white negrita mb-0">Registrar abono</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body p-3">
                            <div class="row">
                                <div class="col-md-4 form-group">
                                    <label class="negrita" for="cmbCxcAbonoCoddoc">CODDOC (RCC)</label>
                                    <select class="form-control" id="cmbCxcAbonoCoddoc"></select>
                                </div>
                                <div class="col-md-4 form-group">
                                    <label class="negrita" for="txtCxcAbonoCorrelativo">Correlativo</label>
                                    <input type="text" class="form-control" id="txtCxcAbonoCorrelativo" readonly>
                                </div>
                                <div class="col-md-4 form-group">
                                    <label class="negrita" for="txtCxcAbonoFecha">Fecha</label>
                                    <input type="date" class="form-control" id="txtCxcAbonoFecha">
                                </div>
                            </div>
                            <div class="alert alert-light border mb-3">
                                <div class="negrita mb-1">Factura a abonar</div>
                                <div id="lbCxcAbonoFactura">—</div>
                                <div class="row mt-2">
                                    <div class="col-4"><small class="text-muted">Total factura</small><div class="negrita" id="lbCxcAbonoTotalFac">Q 0.00</div></div>
                                    <div class="col-4"><small class="text-muted">Total abonos</small><div class="negrita" id="lbCxcAbonoTotalAbonos">Q 0.00</div></div>
                                    <div class="col-4"><small class="text-muted">Total saldo</small><div class="negrita text-danger" id="lbCxcAbonoTotalSaldo">Q 0.00</div></div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 form-group">
                                    <label class="negrita" for="cmbCxcFpagoTipo">Forma de pago</label>
                                    <select class="form-control" id="cmbCxcFpagoTipo">
                                        <option value="EFECTIVO">EFECTIVO</option>
                                        <option value="DEPOSITO">DEPOSITO</option>
                                        <option value="CHEQUE">CHEQUE</option>
                                        <option value="OTROS">OTROS</option>
                                    </select>
                                </div>
                                <div class="col-md-6 form-group">
                                    <label class="negrita" for="txtCxcFpagoDetalle">Detalle forma de pago</label>
                                    <input type="text" class="form-control" id="txtCxcFpagoDetalle" placeholder="Banco, boleta o no. de cheque">
                                </div>
                            </div>
                            <div class="form-group mb-0">
                                <label class="negrita" for="txtCxcAbonoMonto">Monto a abonar</label>
                                <input type="number" class="form-control negrita text-danger cxc-abono-monto-input" id="txtCxcAbonoMonto" min="0" step="0.01" placeholder="0.00">
                            </div>
                        </div>
                        <div class="modal-footer py-2 px-3">
                            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-success btn-sm hand" id="btnCxcGuardarAbono">
                                <i class="fal fa-save mr-1"></i> Guardar abono
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="modalCxcEstadoCuenta" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2 oculto-impresion">
                            <h5 class="modal-title text-white negrita mb-0">${GlobalRptEstadoCuentaCliente}</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body p-2 p-md-3">
                            <div class="sygma-embarque-rpt card card-rounded border-0" id="rpt_estado_cuenta_cliente">
                                <div class="card-body sygma-embarque-rpt__body p-2 p-md-3">
                                    <header class="sygma-embarque-rpt__header">
                                        <div class="sygma-embarque-rpt__brand">
                                            <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="44" height="44" alt="Logo">
                                            <div class="sygma-embarque-rpt__brand-text">
                                                <h4 class="sygma-embarque-rpt__title mb-0">${GlobalRptEstadoCuentaCliente}</h4>
                                                <span class="sygma-embarque-rpt__embarque-date" id="lbCxcEdoCuentaCliente">—</span>
                                            </div>
                                        </div>
                                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                                            <button type="button" class="btn btn-info btn-md btn-circle hand shadow sygma-embarque-rpt__print-btn" title="Imprimir" onclick="cxc_imprimir_estado_cuenta()">
                                                <i class="fal fa-print"></i>
                                            </button>
                                        </div>
                                    </header>
                                    <div class="table-responsive sygma-embarque-rpt__table-wrap mt-2">
                                        <table class="table sygma-embarque-rpt__table mb-0" id="tblCxcEstadoCuenta">
                                            <thead>
                                                <tr>
                                                    <th>FECHA</th>
                                                    <th>TIPO</th>
                                                    <th>DOCUMENTO</th>
                                                    <th>REF. FACTURA</th>
                                                    <th class="text-right">CARGO</th>
                                                    <th class="text-right">ABONO</th>
                                                    <th class="text-right">SALDO</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tblCxcEstadoCuentaBody"></tbody>
                                        </table>
                                    </div>
                                    <div class="sygma-embarque-rpt__total-block" id="lbCxcEdoCuentaTotales"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }
    };
    return view;
}

function initView() {
    root = document.getElementById('root');
    if (!root) return;
    const view = getView();
    root.innerHTML = view.body();
    addListeners();
    cargar_cuentas_cobrar();
}

function addListeners() {
    document.getElementById('cmbCxcMes').innerHTML = `<option value="TODOS">TODOS</option>` + F.ComboMeses();
    document.getElementById('cmbCxcAnio').innerHTML = F.ComboAnio();

    const mesActual = new Date().getMonth() + 1;
    const anioActual = new Date().getFullYear();
    document.getElementById('cmbCxcMes').value = String(mesActual);
    document.getElementById('cmbCxcAnio').value = String(anioActual);

    document.getElementById('btnCxcRecargar')?.addEventListener('click', cargar_cuentas_cobrar);
    document.getElementById('btnCxcCorregirSaldos')?.addEventListener('click', cxc_corregir_saldos);
    document.getElementById('cmbCxcMes')?.addEventListener('change', cargar_cuentas_cobrar);
    document.getElementById('cmbCxcAnio')?.addEventListener('change', cargar_cuentas_cobrar);
    document.getElementById('cmbCxcAlcance')?.addEventListener('change', cxc_on_alcance_change);

    document.getElementById('btnCxcHistorial')?.addEventListener('click', cxc_mostrar_historial);
    document.getElementById('btnCxcEstadoCuenta')?.addEventListener('click', cxc_mostrar_estado_cuenta);
    document.getElementById('btnCxcCambiarContado')?.addEventListener('click', cxc_cambiar_a_contado);
    document.getElementById('btnCxcAbono')?.addEventListener('click', cxc_abrir_modal_abono);
    document.getElementById('btnCxcGuardarAbono')?.addEventListener('click', cxc_guardar_abono);
    document.getElementById('cmbCxcAbonoCoddoc')?.addEventListener('change', cxc_cargar_correlativo_rcc);
}

function cxc_show_loader(mensaje) {
    const overlay = document.getElementById('cxcLoaderOverlay');
    if (!overlay) return;
    const txt = overlay.querySelector('.cxc-loader-overlay__text');
    if (txt) txt.innerText = mensaje || 'Procesando...';
    overlay.classList.remove('d-none');
}

function cxc_hide_loader() {
    document.getElementById('cxcLoaderOverlay')?.classList.add('d-none');
}

function cxc_corregir_saldos() {
    F.Confirmacion('¿Está seguro que desea corregir los saldos de todas las facturas al crédito según sus abonos y devoluciones?')
        .then((value) => {
            if (value !== true) return;
            const btn = document.getElementById('btnCxcCorregirSaldos');
            if (btn) btn.disabled = true;
            cxc_show_loader('Corrigiendo saldos...');
            GF.corregir_saldos_cxc()
                .then(() => {
                    F.Aviso('Saldos corregidos correctamente');
                    cargar_cuentas_cobrar();
                })
                .catch(() => {
                    F.AvisoError('No se pudo corregir los saldos');
                })
                .finally(() => {
                    cxc_hide_loader();
                    if (btn) btn.disabled = false;
                });
        });
}

function cxc_calc_dias_vencido(fechaVenc) {
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

function cxc_format_vencimiento_cell(fechaVenc) {
    const vencimiento = fechaVenc ? F.convertDateNormal(fechaVenc) : '—';
    const diasVencido = cxc_calc_dias_vencido(fechaVenc);
    const badgeClass = diasVencido > 0 ? 'badge-danger' : 'badge-success';
    return `<span class="cxc-vencimiento-cell"><span>${vencimiento}</span><span class="badge ${badgeClass} cxc-vencido-badge">${diasVencido}</span></span>`;
}

function cxc_get_factura_importe(r) {
    return Number(r.TOTALVENTA || r.TOTALPRECIO || 0);
}

function cxc_abrir_opciones(idx) {
    const r = cxc_rows_data[idx];
    if (!r) return;
    cxc_factura_sel = r;

    document.getElementById('lbCxcModalTitulo').innerText = `${r.CODDOC}-${r.CORRELATIVO}`;
    document.getElementById('lbCxcModalSubtitulo').innerText = `${r.NOMBRE || ''} · Saldo ${F.setMoneda(Number(r.DOC_SALDO || 0), 'Q')}`;
    $('#modalCxcOpciones').modal('show');
}

function cxc_mostrar_historial() {
    if (!cxc_factura_sel) return;
    const r = cxc_factura_sel;
    $('#modalCxcOpciones').modal('hide');

    document.getElementById('lbCxcHistorialTitulo').innerText = `Historial · ${r.CODDOC}-${r.CORRELATIVO}`;
    const body = document.getElementById('tblCxcHistorialBody');
    body.innerHTML = `<tr><td colspan="6" class="text-center py-3">${GlobalLoader}</td></tr>`;
    $('#modalCxcHistorial').modal('show');

    GF.get_historial_abonos_cxc(r.CODDOC, r.CORRELATIVO)
        .then((data) => {
            let str = '';
            (data.recordset || []).forEach((h) => {
                const tipo = h.TIPODOC || 'RCC';
                const tipoLabel = tipo === 'DEV' ? 'DEVOLUCIÓN' : 'ABONO';
                const fpago = [h.FPAGO_TIPO, h.FPAGO_DETALLE].filter(Boolean).join(' · ');
                str += `
                <tr>
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

function cxc_mostrar_estado_cuenta() {
    if (!cxc_factura_sel) return;
    const r = cxc_factura_sel;
    const codcliente = r.CODCLIENTE || 0;
    if (!codcliente) {
        F.AvisoError('La factura no tiene código de cliente');
        return;
    }

    $('#modalCxcOpciones').modal('hide');

    const body = document.getElementById('tblCxcEstadoCuentaBody');
    const lbCliente = document.getElementById('lbCxcEdoCuentaCliente');
    const lbTotales = document.getElementById('lbCxcEdoCuentaTotales');
    if (lbCliente) {
        lbCliente.innerText = `${r.NOMBRE || ''} · NIT ${r.NIT || ''} · Cód. ${codcliente}`;
    }
    if (body) body.innerHTML = `<tr><td colspan="7" class="text-center py-3">${GlobalLoader}</td></tr>`;
    if (lbTotales) lbTotales.innerHTML = '';
    $('#modalCxcEstadoCuenta').modal('show');

    GF.get_estado_cuenta_cliente(codcliente)
        .then((data) => {
            cxc_render_estado_cuenta(data.recordset || [], r);
        })
        .catch(() => {
            if (body) body.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">No se cargó el estado de cuenta</td></tr>`;
        });
}

function cxc_imprimir_estado_cuenta() {
    document.body.classList.add('sygma-print-edo-cuenta-active');
    const cleanup = () => {
        document.body.classList.remove('sygma-print-edo-cuenta-active');
        window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    setTimeout(cleanup, 3000);
    window.print();
}

function cxc_render_estado_cuenta(rows, clienteRef) {
    const body = document.getElementById('tblCxcEstadoCuentaBody');
    const lbTotales = document.getElementById('lbCxcEdoCuentaTotales');
    if (!body) return;

    let str = '';
    let saldoAcum = 0;
    let totalCargos = 0;
    let totalAbonos = 0;

    rows.forEach((m) => {
        const monto = Number(m.MONTO || 0);
        const esCargo = m.MOV_TIPO === 'CARGO';
        const cargo = esCargo ? monto : 0;
        const abono = esCargo ? 0 : monto;
        if (esCargo) {
            saldoAcum += monto;
            totalCargos += monto;
        } else {
            saldoAcum -= monto;
            totalAbonos += monto;
        }
        const tipoLabel = m.TIPODOC === 'DEV' ? 'DEVOLUCIÓN' : (m.TIPODOC === 'RCC' ? 'ABONO' : 'FACTURA');
        const badgeClass = esCargo ? 'danger' : (m.TIPODOC === 'DEV' ? 'warning' : 'success');

        str += `
        <tr>
            <td>${F.convertDateNormal(m.FECHA)}</td>
            <td><span class="badge badge-${badgeClass}">${tipoLabel}</span></td>
            <td class="negrita">${m.CODDOC}-${m.CORRELATIVO}</td>
            <td>${m.REFERENCIA || '—'}</td>
            <td class="text-right">${cargo ? F.setMoneda(cargo, 'Q') : '—'}</td>
            <td class="text-right">${abono ? F.setMoneda(abono, 'Q') : '—'}</td>
            <td class="text-right negrita">${F.setMoneda(saldoAcum, 'Q')}</td>
        </tr>`;
    });

    body.innerHTML = str || `<tr><td colspan="7" class="text-center text-muted py-3">Sin movimientos para este cliente</td></tr>`;

    if (lbTotales) {
        lbTotales.innerHTML = rows.length ? `
            <div class="sygma-embarque-rpt__total-inner">
                <span class="sygma-embarque-rpt__foot-label">CLIENTE</span>
                <span class="sygma-embarque-rpt__foot-total">${clienteRef?.NOMBRE || ''}</span>
                <span class="sygma-embarque-rpt__foot-label">TOTAL CARGOS</span>
                <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(totalCargos, 'Q')}</span>
                <span class="sygma-embarque-rpt__foot-label">TOTAL ABONOS</span>
                <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(totalAbonos, 'Q')}</span>
                <span class="sygma-embarque-rpt__foot-label">SALDO</span>
                <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(saldoAcum, 'Q')}</span>
            </div>` : '';
    }
}

function cxc_cambiar_a_contado() {
    if (!cxc_factura_sel) return;
    const r = cxc_factura_sel;
    const docLabel = `${r.CODDOC}-${r.CORRELATIVO}`;

    $('#modalCxcOpciones').modal('hide');

    F.Confirmacion(`¿Está seguro que desea cambiar la factura ${docLabel} a CONTADO?`)
        .then((value) => {
            if (value !== true) return;
            F.solicitarClave()
                .then((clave) => {
                    if (clave !== GlobalPassUsuario) {
                        F.AvisoError('Contraseña incorrecta');
                        return;
                    }
                    GF.documento_update_concre(GlobalEmpnit, r.CODDOC, r.CORRELATIVO, 'CON')
                        .then(() => {
                            F.Aviso('Factura actualizada a CONTADO');
                            cargar_cuentas_cobrar();
                        })
                        .catch(() => {
                            F.AvisoError('No se pudo actualizar la factura');
                        });
                })
                .catch(() => {});
        });
}

function cxc_cargar_correlativo_rcc() {
    const coddoc = document.getElementById('cmbCxcAbonoCoddoc')?.value;
    if (!coddoc) return;
    GF.get_data_coddoc_correlativo(coddoc)
        .then((correlativo) => {
            document.getElementById('txtCxcAbonoCorrelativo').value = correlativo;
        })
        .catch(() => {
            document.getElementById('txtCxcAbonoCorrelativo').value = '0';
        });
}

function cxc_abrir_modal_abono() {
    if (!cxc_factura_sel) return;
    const r = cxc_factura_sel;
    $('#modalCxcOpciones').modal('hide');

    const importe = cxc_get_factura_importe(r);
    const abonos = Number(r.DOC_ABONOS || 0);
    const saldo = Number(r.DOC_SALDO || 0);

    document.getElementById('lbCxcAbonoFactura').innerText = `${r.CODDOC}-${r.CORRELATIVO} · ${r.NOMBRE || ''}`;
    document.getElementById('lbCxcAbonoTotalFac').innerText = F.setMoneda(importe, 'Q');
    document.getElementById('lbCxcAbonoTotalAbonos').innerText = F.setMoneda(abonos, 'Q');
    document.getElementById('lbCxcAbonoTotalSaldo').innerText = F.setMoneda(saldo, 'Q');
    document.getElementById('txtCxcAbonoMonto').value = '';
    document.getElementById('cmbCxcFpagoTipo').value = 'EFECTIVO';
    document.getElementById('txtCxcFpagoDetalle').value = '';
    document.getElementById('txtCxcAbonoFecha').value = F.getFecha();

    const cmbCoddoc = document.getElementById('cmbCxcAbonoCoddoc');
    cmbCoddoc.innerHTML = `<option value="">Cargando...</option>`;

    GF.get_data_tipodoc_coddoc('RCC')
        .then((data) => {
            let str = '';
            (data.recordset || []).forEach((td) => {
                str += `<option value="${td.CODDOC}">${td.CODDOC}</option>`;
            });
            cmbCoddoc.innerHTML = str || `<option value="">Sin tipo RCC</option>`;
            cxc_cargar_correlativo_rcc();
        })
        .catch(() => {
            cmbCoddoc.innerHTML = `<option value="">Sin tipo RCC</option>`;
            document.getElementById('txtCxcAbonoCorrelativo').value = '0';
        });

    $('#modalCxcAbono').modal('show');
}

function cxc_guardar_abono() {
    if (!cxc_factura_sel) return;
    const r = cxc_factura_sel;

    const coddoc = document.getElementById('cmbCxcAbonoCoddoc')?.value;
    const correlativo = document.getElementById('txtCxcAbonoCorrelativo')?.value;
    const fecha = document.getElementById('txtCxcAbonoFecha')?.value;
    const monto = Number(document.getElementById('txtCxcAbonoMonto')?.value || 0);
    const saldo = Number(r.DOC_SALDO || 0);
    const fpago_tipo = document.getElementById('cmbCxcFpagoTipo')?.value || 'EFECTIVO';
    const fpago_detalle = F.limpiarTexto(document.getElementById('txtCxcFpagoDetalle')?.value || '');

    if (!coddoc) { F.AvisoError('Seleccione un tipo de documento RCC'); return; }
    if (!correlativo || correlativo === '0') { F.AvisoError('No hay correlativo disponible'); return; }
    if (!fecha) { F.AvisoError('Indique la fecha del abono'); return; }
    if (!monto || monto <= 0) { F.AvisoError('Indique un monto válido'); return; }
    if (monto > saldo) { F.AvisoError('El monto no puede ser mayor al saldo'); return; }
    if ((fpago_tipo === 'DEPOSITO' || fpago_tipo === 'CHEQUE' || fpago_tipo === 'OTROS') && !fpago_detalle) {
        F.AvisoError('Indique el detalle de la forma de pago');
        return;
    }

    const btn = document.getElementById('btnCxcGuardarAbono');
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
                    $('#modalCxcAbono').modal('hide');
                    cargar_cuentas_cobrar();
                })
                .catch(() => {
                    F.AvisoError('No se pudo registrar el abono');
                })
                .finally(() => {
                    btn.disabled = false;
                });
        })
        .catch(() => {
            btn.disabled = false;
        });
}

function cxc_get_periodo_filtro() {
    const alcance = document.getElementById('cmbCxcAlcance')?.value || 'MES';
    if (alcance === 'TODAS') return { mes: 'TODOS', anio: 'TODOS' };
    return {
        mes: document.getElementById('cmbCxcMes')?.value || 'TODOS',
        anio: document.getElementById('cmbCxcAnio')?.value || String(new Date().getFullYear())
    };
}

function cxc_on_alcance_change() {
    const todas = document.getElementById('cmbCxcAlcance')?.value === 'TODAS';
    const mesEl = document.getElementById('cmbCxcMes');
    const anioEl = document.getElementById('cmbCxcAnio');
    if (mesEl) mesEl.disabled = todas;
    if (anioEl) anioEl.disabled = todas;
    cargar_cuentas_cobrar();
}

function cargar_cuentas_cobrar() {
    const container = document.getElementById('tblDataCxcDocumentos');
    if (!container) return;

    const { mes, anio } = cxc_get_periodo_filtro();

    container.innerHTML = `<tr><td colspan="9" class="text-center py-3">${GlobalLoader}</td></tr>`;

    GF.get_data_cuentas_cobrar(mes, anio)
        .then((data) => {
            cxc_rows_data = data.recordset || [];
            let str = '';
            let contador = 0;
            let totalSaldo = 0;
            let totalImporte = 0;
            let totalAbonos = 0;

            cxc_rows_data.forEach((r, idx) => {
                contador += 1;
                const importe = cxc_get_factura_importe(r);
                const abonos = Number(r.DOC_ABONOS || 0);
                const saldo = Number(r.DOC_SALDO || 0);
                const diasCredito = Number(r.DIASCREDITO || 0);
                totalImporte += importe;
                totalAbonos += abonos;
                totalSaldo += saldo;

                str += `
                <tr class="hand" onclick="cxc_abrir_opciones(${idx})" title="Ver opciones">
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
                    <td>${cxc_format_vencimiento_cell(r.VENCIMIENTO)}</td>
                    <td class="text-right">${F.setMoneda(importe, 'Q')}</td>
                    <td class="text-right">${F.setMoneda(abonos, 'Q')}</td>
                    <td class="text-right negrita text-danger">${F.setMoneda(saldo, 'Q')}</td>
                    <td class="text-center"><span class="badge badge-secondary cxc-dias-badge">${diasCredito}</span></td>
                </tr>`;
            });

            container.innerHTML = str || `<tr><td colspan="9" class="text-center text-muted py-4">No hay facturas al crédito con saldo pendiente</td></tr>`;

            const lbDocs = document.getElementById('lbCxcTotalDocs');
            if (lbDocs) lbDocs.innerText = `Docs: ${contador}`;

            const totalBlock = document.getElementById('lbCxcTotalBlock');
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

            const txtBuscar = document.getElementById('txtBuscarCxc');
            if (txtBuscar?.value) F.FiltrarTabla('tblCxcDocumentos', 'txtBuscarCxc');
        })
        .catch(() => {
            cxc_rows_data = [];
            container.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">No se cargaron datos</td></tr>`;
            const lbDocs = document.getElementById('lbCxcTotalDocs');
            if (lbDocs) lbDocs.innerText = 'Docs: 0';
            const totalBlock = document.getElementById('lbCxcTotalBlock');
            if (totalBlock) totalBlock.innerHTML = '';
        });
}
