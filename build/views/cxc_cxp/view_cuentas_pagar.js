var cxp_rows_data = [];
var cxp_doc_sel = null;

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
            <div class="sygma-embarque-rpt card card-rounded shadow-sm col-12 border-0" id="rpt_cuentas_pagar">
                <div id="cxpLoaderOverlay" class="cxc-loader-overlay d-none">
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
                                <h4 class="sygma-embarque-rpt__title mb-0">Cuentas por Pagar</h4>
                                <span class="sygma-embarque-rpt__embarque-date">Compras al crédito con saldo pendiente</span>
                            </div>
                        </div>
                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                            <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbCxpTotalDocs">Docs: 0</span>
                            <button type="button" class="btn btn-info btn-md btn-circle hand shadow sygma-embarque-rpt__print-btn" title="Imprimir" onclick="F.imprimirSelec('rpt_cuentas_pagar')">
                                <i class="fal fa-print"></i>
                            </button>
                        </div>
                    </header>

                    <div class="sygma-embarque-rpt__toolbar sygma-embarques-filtros oculto-impresion">
                        <div class="sygma-embarques-filtros__row">
                            <div class="sygma-embarques-filtros__field">
                                <label class="sygma-embarques-filtros__label" for="cmbCxpMes">Mes</label>
                                <select class="form-control sygma-embarques-filtros__select" id="cmbCxpMes"></select>
                            </div>
                            <div class="sygma-embarques-filtros__field">
                                <label class="sygma-embarques-filtros__label" for="cmbCxpAnio">Año</label>
                                <select class="form-control sygma-embarques-filtros__select" id="cmbCxpAnio"></select>
                            </div>
                            <div class="sygma-embarques-filtros__field d-flex align-items-end">
                                <button type="button" class="btn btn-base btn-sm hand" id="btnCxpRecargar">
                                    <i class="fal fa-sync mr-1"></i> Actualizar
                                </button>
                            </div>
                            <div class="sygma-embarques-filtros__field d-flex align-items-end">
                                <button type="button" class="btn btn-warning btn-sm hand" id="btnCxpCorregirSaldos">
                                    <i class="fal fa-wrench mr-1"></i> Corregir saldos
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="sygma-embarque-rpt__toolbar oculto-impresion mb-2">
                        <input type="search" class="form-control sygma-embarque-rpt__search"
                            placeholder="Buscar documento, proveedor, NIT..."
                            oninput="F.FiltrarTabla('tblCxpDocumentos','txtBuscarCxp')"
                            id="txtBuscarCxp">
                    </div>

                    <div class="table-responsive sygma-embarque-rpt__table-wrap">
                        <table class="table sygma-embarque-rpt__table mb-0" id="tblCxpDocumentos">
                            <thead>
                                <tr>
                                    <th>FECHA</th>
                                    <th>DOCUMENTO</th>
                                    <th>NIT</th>
                                    <th>PROVEEDOR</th>
                                    <th>VENCIMIENTO</th>
                                    <th class="text-right">IMPORTE</th>
                                    <th class="text-right">ABONOS</th>
                                    <th class="text-right">SALDO</th>
                                    <th class="text-center">DIAS</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataCxpDocumentos"></tbody>
                        </table>
                    </div>
                    <div class="sygma-embarque-rpt__total-block" id="lbCxpTotalBlock"></div>
                </div>
            </div>`;
        },
        vista_modales: () => {
            return `
            <div class="modal fade" id="modalCxpOpciones" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2">
                            <h5 class="modal-title text-white negrita mb-0" id="lbCxpModalTitulo">Compra</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body p-3">
                            <p class="mb-3 text-muted text-center" id="lbCxpModalSubtitulo"></p>
                            <div class="row cxc-opciones-grid">
                                <div class="col-6 mb-3">
                                    <button type="button" class="cxc-opcion-card hand w-100" id="btnCxpHistorial">
                                        <i class="fal fa-history cxc-opcion-card__icon text-info"></i>
                                        <span class="cxc-opcion-card__label">HISTORIAL</span>
                                    </button>
                                </div>
                                <div class="col-6 mb-3">
                                    <button type="button" class="cxc-opcion-card hand w-100" id="btnCxpEstadoCuenta">
                                        <i class="fal fa-file-alt cxc-opcion-card__icon text-secondary"></i>
                                        <span class="cxc-opcion-card__label">ESTADO DE CUENTA</span>
                                    </button>
                                </div>
                                <div class="col-6 mb-3">
                                    <button type="button" class="cxc-opcion-card hand w-100" id="btnCxpCambiarContado">
                                        <i class="fal fa-dollar-sign cxc-opcion-card__icon text-primary"></i>
                                        <span class="cxc-opcion-card__label">CAMBIAR A CONTADO</span>
                                    </button>
                                </div>
                                <div class="col-6 mb-3">
                                    <button type="button" class="cxc-opcion-card hand w-100" id="btnCxpAbono">
                                        <i class="fal fa-dollar-sign cxc-opcion-card__icon text-success"></i>
                                        <span class="cxc-opcion-card__label">ABONO</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="modalCxpHistorial" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2">
                            <h5 class="modal-title text-white negrita mb-0" id="lbCxpHistorialTitulo">Historial de abonos</h5>
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
                                    <tbody id="tblCxpHistorialBody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="modalCxpAbono" tabindex="-1" role="dialog" aria-hidden="true">
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
                                    <label class="negrita" for="cmbCxpAbonoCoddoc">CODDOC (RCP)</label>
                                    <select class="form-control" id="cmbCxpAbonoCoddoc"></select>
                                </div>
                                <div class="col-md-4 form-group">
                                    <label class="negrita" for="txtCxpAbonoCorrelativo">Correlativo</label>
                                    <input type="text" class="form-control" id="txtCxpAbonoCorrelativo" readonly>
                                </div>
                                <div class="col-md-4 form-group">
                                    <label class="negrita" for="txtCxpAbonoFecha">Fecha</label>
                                    <input type="date" class="form-control" id="txtCxpAbonoFecha">
                                </div>
                            </div>
                            <div class="alert alert-light border mb-3">
                                <div class="negrita mb-1">Compra a abonar</div>
                                <div id="lbCxpAbonoCompra">—</div>
                                <div class="row mt-2">
                                    <div class="col-4"><small class="text-muted">Total compra</small><div class="negrita" id="lbCxpAbonoTotalCompra">Q 0.00</div></div>
                                    <div class="col-4"><small class="text-muted">Total abonos</small><div class="negrita" id="lbCxpAbonoTotalAbonos">Q 0.00</div></div>
                                    <div class="col-4"><small class="text-muted">Total saldo</small><div class="negrita text-danger" id="lbCxpAbonoTotalSaldo">Q 0.00</div></div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 form-group">
                                    <label class="negrita" for="cmbCxpFpagoTipo">Forma de pago</label>
                                    <select class="form-control" id="cmbCxpFpagoTipo">
                                        <option value="EFECTIVO">EFECTIVO</option>
                                        <option value="DEPOSITO">DEPOSITO</option>
                                        <option value="CHEQUE">CHEQUE</option>
                                        <option value="OTROS">OTROS</option>
                                    </select>
                                </div>
                                <div class="col-md-6 form-group">
                                    <label class="negrita" for="txtCxpFpagoDetalle">Detalle forma de pago</label>
                                    <input type="text" class="form-control" id="txtCxpFpagoDetalle" placeholder="Banco, boleta o no. de cheque">
                                </div>
                            </div>
                            <div class="form-group mb-0">
                                <label class="negrita" for="txtCxpAbonoMonto">Monto a abonar</label>
                                <input type="number" class="form-control negrita text-danger cxc-abono-monto-input" id="txtCxpAbonoMonto" min="0" step="0.01" placeholder="0.00">
                            </div>
                        </div>
                        <div class="modal-footer py-2 px-3">
                            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-success btn-sm hand" id="btnCxpGuardarAbono">
                                <i class="fal fa-save mr-1"></i> Guardar abono
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="modalCxpEstadoCuenta" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2 oculto-impresion">
                            <h5 class="modal-title text-white negrita mb-0">${GlobalRptEstadoCuentaProveedor}</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body p-2 p-md-3">
                            <div class="sygma-embarque-rpt card card-rounded border-0" id="rpt_estado_cuenta_proveedor">
                                <div class="card-body sygma-embarque-rpt__body p-2 p-md-3">
                                    <header class="sygma-embarque-rpt__header">
                                        <div class="sygma-embarque-rpt__brand">
                                            <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="44" height="44" alt="Logo">
                                            <div class="sygma-embarque-rpt__brand-text">
                                                <h4 class="sygma-embarque-rpt__title mb-0">${GlobalRptEstadoCuentaProveedor}</h4>
                                                <span class="sygma-embarque-rpt__embarque-date" id="lbCxpEdoCuentaProveedor">—</span>
                                            </div>
                                        </div>
                                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                                            <button type="button" class="btn btn-info btn-md btn-circle hand shadow sygma-embarque-rpt__print-btn" title="Imprimir" onclick="cxp_imprimir_estado_cuenta()">
                                                <i class="fal fa-print"></i>
                                            </button>
                                        </div>
                                    </header>
                                    <div class="table-responsive sygma-embarque-rpt__table-wrap mt-2">
                                        <table class="table sygma-embarque-rpt__table mb-0" id="tblCxpEstadoCuenta">
                                            <thead>
                                                <tr>
                                                    <th>FECHA</th>
                                                    <th>TIPO</th>
                                                    <th>DOCUMENTO</th>
                                                    <th>REF. COMPRA</th>
                                                    <th class="text-right">CARGO</th>
                                                    <th class="text-right">ABONO</th>
                                                    <th class="text-right">SALDO</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tblCxpEstadoCuentaBody"></tbody>
                                        </table>
                                    </div>
                                    <div class="sygma-embarque-rpt__total-block" id="lbCxpEdoCuentaTotales"></div>
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
    cargar_cuentas_pagar();
}

function addListeners() {
    document.getElementById('cmbCxpMes').innerHTML = `<option value="TODOS">TODOS</option>` + F.ComboMeses();
    document.getElementById('cmbCxpAnio').innerHTML = F.ComboAnio();

    const mesActual = new Date().getMonth() + 1;
    const anioActual = new Date().getFullYear();
    document.getElementById('cmbCxpMes').value = String(mesActual);
    document.getElementById('cmbCxpAnio').value = String(anioActual);

    document.getElementById('btnCxpRecargar')?.addEventListener('click', cargar_cuentas_pagar);
    document.getElementById('btnCxpCorregirSaldos')?.addEventListener('click', cxp_corregir_saldos);
    document.getElementById('cmbCxpMes')?.addEventListener('change', cargar_cuentas_pagar);
    document.getElementById('cmbCxpAnio')?.addEventListener('change', cargar_cuentas_pagar);

    document.getElementById('btnCxpHistorial')?.addEventListener('click', cxp_mostrar_historial);
    document.getElementById('btnCxpEstadoCuenta')?.addEventListener('click', cxp_mostrar_estado_cuenta);
    document.getElementById('btnCxpCambiarContado')?.addEventListener('click', cxp_cambiar_a_contado);
    document.getElementById('btnCxpAbono')?.addEventListener('click', cxp_abrir_modal_abono);
    document.getElementById('btnCxpGuardarAbono')?.addEventListener('click', cxp_guardar_abono);
    document.getElementById('cmbCxpAbonoCoddoc')?.addEventListener('change', cxp_cargar_correlativo_rcp);
}

function cxp_show_loader(mensaje) {
    const overlay = document.getElementById('cxpLoaderOverlay');
    if (!overlay) return;
    const txt = overlay.querySelector('.cxc-loader-overlay__text');
    if (txt) txt.innerText = mensaje || 'Procesando...';
    overlay.classList.remove('d-none');
}

function cxp_hide_loader() {
    document.getElementById('cxpLoaderOverlay')?.classList.add('d-none');
}

function cxp_corregir_saldos() {
    F.Confirmacion('¿Está seguro que desea corregir los saldos de todas las compras al crédito según sus abonos y devoluciones?')
        .then((value) => {
            if (value !== true) return;
            const btn = document.getElementById('btnCxpCorregirSaldos');
            if (btn) btn.disabled = true;
            cxp_show_loader('Corrigiendo saldos...');
            GF.corregir_saldos_cxp()
                .then(() => {
                    F.Aviso('Saldos corregidos correctamente');
                    cargar_cuentas_pagar();
                })
                .catch(() => {
                    F.AvisoError('No se pudo corregir los saldos');
                })
                .finally(() => {
                    cxp_hide_loader();
                    if (btn) btn.disabled = false;
                });
        });
}

function cxp_calc_dias(fecha) {
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

function cxp_get_compra_importe(r) {
    return Number(r.TOTALVENTA || r.TOTALPRECIO || 0);
}

function cxp_abrir_opciones(idx) {
    const r = cxp_rows_data[idx];
    if (!r) return;
    cxp_doc_sel = r;

    document.getElementById('lbCxpModalTitulo').innerText = `${r.CODDOC}-${r.CORRELATIVO}`;
    document.getElementById('lbCxpModalSubtitulo').innerText = `${r.NOMBRE || ''} · Saldo ${F.setMoneda(Number(r.DOC_SALDO || 0), 'Q')}`;
    $('#modalCxpOpciones').modal('show');
}

function cxp_mostrar_historial() {
    if (!cxp_doc_sel) return;
    const r = cxp_doc_sel;
    $('#modalCxpOpciones').modal('hide');

    document.getElementById('lbCxpHistorialTitulo').innerText = `Historial · ${r.CODDOC}-${r.CORRELATIVO}`;
    const body = document.getElementById('tblCxpHistorialBody');
    body.innerHTML = `<tr><td colspan="6" class="text-center py-3">${GlobalLoader}</td></tr>`;
    $('#modalCxpHistorial').modal('show');

    GF.get_historial_abonos_cxp(r.CODDOC, r.CORRELATIVO)
        .then((data) => {
            let str = '';
            (data.recordset || []).forEach((h) => {
                const tipo = h.TIPODOC || 'RCP';
                const tipoLabel = tipo === 'DVP' ? 'DEVOLUCIÓN' : 'ABONO';
                const fpago = [h.FPAGO_TIPO, h.FPAGO_DETALLE].filter(Boolean).join(' · ');
                str += `
                <tr>
                    <td>${F.convertDateNormal(h.FECHA)}</td>
                    <td><span class="badge badge-${tipo === 'DVP' ? 'warning' : 'success'}">${tipoLabel}</span></td>
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

function cxp_mostrar_estado_cuenta() {
    if (!cxp_doc_sel) return;
    const r = cxp_doc_sel;
    const codcliente = r.CODCLIENTE || 0;
    if (!codcliente) {
        F.AvisoError('La compra no tiene código de proveedor');
        return;
    }

    $('#modalCxpOpciones').modal('hide');

    const body = document.getElementById('tblCxpEstadoCuentaBody');
    const lbProveedor = document.getElementById('lbCxpEdoCuentaProveedor');
    const lbTotales = document.getElementById('lbCxpEdoCuentaTotales');
    if (lbProveedor) {
        lbProveedor.innerText = `${r.NOMBRE || ''} · NIT ${r.NIT || ''} · Cód. ${codcliente}`;
    }
    if (body) body.innerHTML = `<tr><td colspan="7" class="text-center py-3">${GlobalLoader}</td></tr>`;
    if (lbTotales) lbTotales.innerHTML = '';
    $('#modalCxpEstadoCuenta').modal('show');

    GF.get_estado_cuenta_proveedor(codcliente)
        .then((data) => {
            cxp_render_estado_cuenta(data.recordset || [], r);
        })
        .catch(() => {
            if (body) body.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">No se cargó el estado de cuenta</td></tr>`;
        });
}

function cxp_imprimir_estado_cuenta() {
    document.body.classList.add('sygma-print-edo-cuenta-proveedor-active');
    const cleanup = () => {
        document.body.classList.remove('sygma-print-edo-cuenta-proveedor-active');
        window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    setTimeout(cleanup, 3000);
    window.print();
}

function cxp_render_estado_cuenta(rows, proveedorRef) {
    const body = document.getElementById('tblCxpEstadoCuentaBody');
    const lbTotales = document.getElementById('lbCxpEdoCuentaTotales');
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
        const tipoLabel = m.TIPODOC === 'DVP' ? 'DEVOLUCIÓN' : (m.TIPODOC === 'RCP' ? 'ABONO' : 'COMPRA');
        const badgeClass = esCargo ? 'danger' : (m.TIPODOC === 'DVP' ? 'warning' : 'success');

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

    body.innerHTML = str || `<tr><td colspan="7" class="text-center text-muted py-3">Sin movimientos para este proveedor</td></tr>`;

    if (lbTotales) {
        lbTotales.innerHTML = rows.length ? `
            <div class="sygma-embarque-rpt__total-inner">
                <span class="sygma-embarque-rpt__foot-label">PROVEEDOR</span>
                <span class="sygma-embarque-rpt__foot-total">${proveedorRef?.NOMBRE || ''}</span>
                <span class="sygma-embarque-rpt__foot-label">TOTAL CARGOS</span>
                <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(totalCargos, 'Q')}</span>
                <span class="sygma-embarque-rpt__foot-label">TOTAL ABONOS</span>
                <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(totalAbonos, 'Q')}</span>
                <span class="sygma-embarque-rpt__foot-label">SALDO</span>
                <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(saldoAcum, 'Q')}</span>
            </div>` : '';
    }
}

function cxp_cambiar_a_contado() {
    if (!cxp_doc_sel) return;
    const r = cxp_doc_sel;
    const docLabel = `${r.CODDOC}-${r.CORRELATIVO}`;

    $('#modalCxpOpciones').modal('hide');

    F.Confirmacion(`¿Está seguro que desea cambiar la compra ${docLabel} a CONTADO?`)
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
                            F.Aviso('Compra actualizada a CONTADO');
                            cargar_cuentas_pagar();
                        })
                        .catch(() => {
                            F.AvisoError('No se pudo actualizar la Compra');
                        });
                })
                .catch(() => {});
        });
}

function cxp_cargar_correlativo_rcp() {
    const coddoc = document.getElementById('cmbCxpAbonoCoddoc')?.value;
    if (!coddoc) return;
    GF.get_data_coddoc_correlativo(coddoc)
        .then((correlativo) => {
            document.getElementById('txtCxpAbonoCorrelativo').value = correlativo;
        })
        .catch(() => {
            document.getElementById('txtCxpAbonoCorrelativo').value = '0';
        });
}

function cxp_abrir_modal_abono() {
    if (!cxp_doc_sel) return;
    const r = cxp_doc_sel;
    $('#modalCxpOpciones').modal('hide');

    const importe = cxp_get_compra_importe(r);
    const abonos = Number(r.DOC_ABONOS || 0);
    const saldo = Number(r.DOC_SALDO || 0);

    document.getElementById('lbCxpAbonoCompra').innerText = `${r.CODDOC}-${r.CORRELATIVO} · ${r.NOMBRE || ''}`;
    document.getElementById('lbCxpAbonoTotalCompra').innerText = F.setMoneda(importe, 'Q');
    document.getElementById('lbCxpAbonoTotalAbonos').innerText = F.setMoneda(abonos, 'Q');
    document.getElementById('lbCxpAbonoTotalSaldo').innerText = F.setMoneda(saldo, 'Q');
    document.getElementById('txtCxpAbonoMonto').value = '';
    document.getElementById('cmbCxpFpagoTipo').value = 'EFECTIVO';
    document.getElementById('txtCxpFpagoDetalle').value = '';
    document.getElementById('txtCxpAbonoFecha').value = F.getFecha();

    const cmbCoddoc = document.getElementById('cmbCxpAbonoCoddoc');
    cmbCoddoc.innerHTML = `<option value="">Cargando...</option>`;

    GF.get_data_tipodoc_coddoc('RCP')
        .then((data) => {
            let str = '';
            (data.recordset || []).forEach((td) => {
                str += `<option value="${td.CODDOC}">${td.CODDOC}</option>`;
            });
            cmbCoddoc.innerHTML = str || `<option value="">Sin tipo RCP</option>`;
            cxp_cargar_correlativo_rcp();
        })
        .catch(() => {
            cmbCoddoc.innerHTML = `<option value="">Sin tipo RCP</option>`;
            document.getElementById('txtCxpAbonoCorrelativo').value = '0';
        });

    $('#modalCxpAbono').modal('show');
}

function cxp_guardar_abono() {
    if (!cxp_doc_sel) return;
    const r = cxp_doc_sel;

    const coddoc = document.getElementById('cmbCxpAbonoCoddoc')?.value;
    const correlativo = document.getElementById('txtCxpAbonoCorrelativo')?.value;
    const fecha = document.getElementById('txtCxpAbonoFecha')?.value;
    const monto = Number(document.getElementById('txtCxpAbonoMonto')?.value || 0);
    const saldo = Number(r.DOC_SALDO || 0);
    const fpago_tipo = document.getElementById('cmbCxpFpagoTipo')?.value || 'EFECTIVO';
    const fpago_detalle = F.limpiarTexto(document.getElementById('txtCxpFpagoDetalle')?.value || '');

    if (!coddoc) { F.AvisoError('Seleccione un tipo de documento RCP'); return; }
    if (!correlativo || correlativo === '0') { F.AvisoError('No hay correlativo disponible'); return; }
    if (!fecha) { F.AvisoError('Indique la fecha del abono'); return; }
    if (!monto || monto <= 0) { F.AvisoError('Indique un monto válido'); return; }
    if (monto > saldo) { F.AvisoError('El monto no puede ser mayor al saldo'); return; }
    if ((fpago_tipo === 'DEPOSITO' || fpago_tipo === 'CHEQUE' || fpago_tipo === 'OTROS') && !fpago_detalle) {
        F.AvisoError('Indique el detalle de la forma de pago');
        return;
    }

    const btn = document.getElementById('btnCxpGuardarAbono');
    btn.disabled = true;

    F.Confirmacion(`¿Registrar abono de ${F.setMoneda(monto, 'Q')} a la compra ${r.CODDOC}-${r.CORRELATIVO}?`)
        .then((value) => {
            if (value !== true) {
                btn.disabled = false;
                return;
            }

            GF.insert_abono_cxp({
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
                    $('#modalCxpAbono').modal('hide');
                    cargar_cuentas_pagar();
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

function cargar_cuentas_pagar() {
    const container = document.getElementById('tblDataCxpDocumentos');
    if (!container) return;

    const mes = document.getElementById('cmbCxpMes')?.value || 'TODOS';
    const anio = document.getElementById('cmbCxpAnio')?.value || String(new Date().getFullYear());

    container.innerHTML = `<tr><td colspan="9" class="text-center py-3">${GlobalLoader}</td></tr>`;

    GF.get_data_cuentas_pagar(mes, anio)
        .then((data) => {
            cxp_rows_data = data.recordset || [];
            let str = '';
            let contador = 0;
            let totalSaldo = 0;
            let totalImporte = 0;
            let totalAbonos = 0;

            cxp_rows_data.forEach((r, idx) => {
                contador += 1;
                const importe = cxp_get_compra_importe(r);
                const abonos = Number(r.DOC_ABONOS || 0);
                const saldo = Number(r.DOC_SALDO || 0);
                const dias = cxp_calc_dias(r.FECHA);
                totalImporte += importe;
                totalAbonos += abonos;
                totalSaldo += saldo;

                const vencimiento = r.VENCIMIENTO ? F.convertDateNormal(r.VENCIMIENTO) : '—';

                str += `
                <tr class="hand" onclick="cxp_abrir_opciones(${idx})" title="Ver opciones">
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

            container.innerHTML = str || `<tr><td colspan="9" class="text-center text-muted py-4">No hay compras al crédito con saldo pendiente</td></tr>`;

            const lbDocs = document.getElementById('lbCxpTotalDocs');
            if (lbDocs) lbDocs.innerText = `Docs: ${contador}`;

            const totalBlock = document.getElementById('lbCxpTotalBlock');
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

            const txtBuscar = document.getElementById('txtBuscarCxp');
            if (txtBuscar?.value) F.FiltrarTabla('tblCxpDocumentos', 'txtBuscarCxp');
        })
        .catch(() => {
            cxp_rows_data = [];
            container.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">No se cargaron datos</td></tr>`;
            const lbDocs = document.getElementById('lbCxpTotalDocs');
            if (lbDocs) lbDocs.innerText = 'Docs: 0';
            const totalBlock = document.getElementById('lbCxpTotalBlock');
            if (totalBlock) totalBlock.innerHTML = '';
        });
}
