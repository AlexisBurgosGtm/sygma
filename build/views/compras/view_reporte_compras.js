var rpt_compras_cache = [];

function rpt_compras_sucursal_param() {
    const v = document.getElementById('cmbRptComprasSucursal')?.value;
    if (!v || v === '%') return '%';
    return v;
}

function getView() {
    root = document.getElementById('root');
    if (!root) return;
    root.innerHTML = `
    <div class="card card-rounded shadow col-12">
        <div class="card-body p-3 p-md-4">
            <h3 class="negrita text-center text-info mb-3">REPORTE DE COMPRAS</h3>
            <div class="row align-items-end mb-3">
                <div class="col-md-8 col-lg-6">
                    <label class="negrita text-secondary mb-1">Sede, mes y año</label>
                    <div class="input-group">
                        <select class="form-control negrita" id="cmbRptComprasSucursal"></select>
                        <select class="form-control negrita" id="cmbRptComprasMes"></select>
                        <select class="form-control negrita" id="cmbRptComprasAnio"></select>
                    </div>
                </div>
                <div class="col-md-4 col-lg-6 text-md-right mt-2 mt-md-0">
                    <button type="button" class="btn btn-success negrita hand shadow mb-2 mb-md-0 mr-md-2" id="btnRptComprasExcel">
                        <i class="fal fa-file-excel mr-1"></i> Exportar Excel
                    </button>
                    <span class="negrita text-secondary d-block d-md-inline" id="lbRptComprasTotal">0 líneas</span>
                </div>
            </div>
            <input type="search" class="form-control mb-2" id="txtRptComprasBuscar"
                placeholder="Buscar sucursal, proveedor, producto, documento..."
                oninput="F.FiltrarTabla('tblRptCompras','txtRptComprasBuscar')">
            <div class="table-responsive">
                <table class="table table-bordered table-sm mb-0" id="tblRptCompras">
                    <thead class="bg-base text-white negrita">
                        <tr>
                            <th>SUCURSAL</th>
                            <th>FECHA</th>
                            <th>CODDOC</th>
                            <th>CORR.</th>
                            <th>PROVEEDOR</th>
                            <th>SERIE FAC.</th>
                            <th>NO. FAC.</th>
                            <th>CODPROD</th>
                            <th>DESPROD</th>
                            <th>MARCA</th>
                            <th>MED.</th>
                            <th class="text-right">CANT.</th>
                            <th class="text-right">COSTO</th>
                            <th class="text-right">TOTAL COSTO</th>
                            <th class="text-right">DESC1</th>
                            <th class="text-right">DESC2</th>
                            <th class="text-right">DESC3</th>
                        </tr>
                    </thead>
                    <tbody id="tblDataRptCompras"></tbody>
                </table>
            </div>
        </div>
    </div>
    <button type="button" class="btn btn-circle btn-xl btn-secondary btn-bottom-l hand shadow" data-spa-action="inicio">
        <i class="fal fa-home"></i>
    </button>`;
}

function rpt_compras_render_rows(rows) {
    const tbody = document.getElementById('tblDataRptCompras');
    const lbTotal = document.getElementById('lbRptComprasTotal');
    if (!tbody) return;
    rpt_compras_cache = rows || [];
    if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="17" class="text-center text-muted py-3">Sin datos para el periodo</td></tr>';
        if (lbTotal) lbTotal.innerText = '0 líneas';
        return;
    }
    let str = '';
    rows.forEach((r) => {
        str += `<tr>
            <td>${r.SUCURSAL || ''}</td>
            <td>${F.convertDateNormal(r.FECHA)}</td>
            <td>${r.CODDOC || ''}</td>
            <td>${r.CORRELATIVO || ''}</td>
            <td>${r.PROVEEDOR || ''}</td>
            <td>${r.SERIEFAC || ''}</td>
            <td>${r.NOFAC || ''}</td>
            <td>${r.CODPROD || ''}</td>
            <td>${r.DESPROD || ''}</td>
            <td>${r.MARCA || ''}</td>
            <td>${r.CODMEDIDA || ''}</td>
            <td class="text-right">${r.CANTIDAD ?? ''}</td>
            <td class="text-right">${F.setMoneda(r.COSTO, 'Q')}</td>
            <td class="text-right">${F.setMoneda(r.TOTALCOSTO, 'Q')}</td>
            <td class="text-right">${F.setMoneda(r.DESC1, 'Q')}</td>
            <td class="text-right">${F.setMoneda(r.DESC2, 'Q')}</td>
            <td class="text-right">${F.setMoneda(r.DESC3, 'Q')}</td>
        </tr>`;
    });
    tbody.innerHTML = str;
    if (lbTotal) lbTotal.innerText = `${rows.length} línea${rows.length === 1 ? '' : 's'}`;
    const txt = document.getElementById('txtRptComprasBuscar');
    if (txt?.value) F.FiltrarTabla('tblRptCompras', 'txtRptComprasBuscar');
}

function rpt_compras_cargar() {
    const tbody = document.getElementById('tblDataRptCompras');
    const lbTotal = document.getElementById('lbRptComprasTotal');
    if (!tbody) return;
    const mes = document.getElementById('cmbRptComprasMes')?.value || F.get_mes_curso();
    const anio = document.getElementById('cmbRptComprasAnio')?.value || F.get_anio_curso();
    const sucursal = rpt_compras_sucursal_param();
    tbody.innerHTML = `<tr><td colspan="17" class="text-center py-3">${GlobalLoader}</td></tr>`;
    axios.post('/compras/reporte_compras_detalle', {
        token: TOKEN,
        sucursal: sucursal,
        mes: mes,
        anio: anio
    }).then((response) => {
        if (response.data === 'error') throw new Error('error');
        rpt_compras_render_rows(response.data.recordset || []);
    }).catch(() => {
        rpt_compras_cache = [];
        tbody.innerHTML = '<tr><td colspan="17" class="text-center text-danger py-3">No se pudo cargar el reporte</td></tr>';
        if (lbTotal) lbTotal.innerText = '—';
        F.AvisoError('No se pudo cargar el reporte de compras');
    });
}

function rpt_compras_export_excel() {
    const tbody = document.getElementById('tblDataRptCompras');
    if (!tbody || !rpt_compras_cache.length) {
        F.AvisoError('No hay datos para exportar');
        return;
    }
    const mes = document.getElementById('cmbRptComprasMes')?.value || '';
    const anio = document.getElementById('cmbRptComprasAnio')?.value || '';
    const sedeLabel = document.getElementById('cmbRptComprasSucursal')?.selectedOptions?.[0]?.text || 'Sede';
    const name = `Reporte_compras_${sedeLabel.replace(/\s+/g, '_')}_${mes}_${anio}`;
    F.exportTableToExcel('tblRptCompras', name);
    F.showToast('Excel generado');
}

function rpt_compras_cargar_sedes() {
    const cmb = document.getElementById('cmbRptComprasSucursal');
    if (!cmb) return Promise.resolve();
    cmb.innerHTML = `<option value="">${GlobalLoader}</option>`;
    return GF.get_data_empresas()
        .then((data) => {
            let str = '<option value="%">TODAS LAS SEDES</option>';
            (data.recordset || []).forEach((r) => {
                str += `<option value="${r.EMPNIT}">${r.NOMBRE}</option>`;
            });
            cmb.innerHTML = str;
            if (Number(typeof GlobalNivelUsuario !== 'undefined' ? GlobalNivelUsuario : 0) === 2) {
                cmb.disabled = true;
                cmb.value = GlobalEmpnit;
            } else if (Number(typeof GlobalNivelUsuario !== 'undefined' ? GlobalNivelUsuario : 0) === 5) {
                cmb.value = GlobalEmpnit;
            }
            cmb.addEventListener('change', rpt_compras_cargar);
        })
        .catch(() => {
            cmb.innerHTML = '<option value="">No se cargaron las sedes</option>';
        });
}

function addListeners() {
    document.title = 'Reporte de compras';
    const cmbMes = document.getElementById('cmbRptComprasMes');
    const cmbAnio = document.getElementById('cmbRptComprasAnio');
    if (cmbMes) {
        cmbMes.innerHTML = F.ComboMeses();
        cmbMes.value = F.get_mes_curso();
        cmbMes.addEventListener('change', rpt_compras_cargar);
    }
    if (cmbAnio) {
        cmbAnio.innerHTML = F.ComboAnio();
        cmbAnio.value = F.get_anio_curso();
        cmbAnio.addEventListener('change', rpt_compras_cargar);
    }
    document.getElementById('btnRptComprasExcel')?.addEventListener('click', rpt_compras_export_excel);
    rpt_compras_cargar_sedes().finally(() => rpt_compras_cargar());
}

function initView() {
    getView();
    addListeners();
}
