var rpt_ofertas_cache = [];

function rpt_ofertas_sucursal_param() {
    const v = document.getElementById('cmbRptOfertasSucursal')?.value;
    if (!v || v === '%') return '%';
    return v;
}

function getView() {
    root = document.getElementById('root');
    if (!root) return;
    root.innerHTML = `
    <div class="card card-rounded shadow col-12">
        <div class="card-body p-3 p-md-4">
            <h3 class="negrita text-center text-info mb-3">REPORTE DE OFERTAS</h3>
            <div class="row align-items-end mb-3">
                <div class="col-md-8 col-lg-7">
                    <label class="negrita text-secondary mb-1">Sede y rango de fechas</label>
                    <div class="input-group flex-wrap">
                        <select class="form-control negrita mb-2 mb-md-0" id="cmbRptOfertasSucursal"></select>
                        <input type="date" class="form-control negrita" id="txtRptOfertasDel" title="Desde">
                        <input type="date" class="form-control negrita" id="txtRptOfertasAl" title="Hasta">
                    </div>
                </div>
                <div class="col-md-4 col-lg-5 text-md-right mt-2 mt-md-0">
                    <button type="button" class="btn btn-base negrita hand shadow mb-2 mb-md-0 mr-md-2" id="btnRptOfertasBuscar">
                        <i class="fal fa-search mr-1"></i> Buscar
                    </button>
                    <button type="button" class="btn btn-success negrita hand shadow mb-2 mb-md-0 mr-md-2" id="btnRptOfertasExcel">
                        <i class="fal fa-file-excel mr-1"></i> Exportar Excel
                    </button>
                    <span class="negrita text-secondary d-block d-md-inline" id="lbRptOfertasTotal">0 líneas</span>
                </div>
            </div>
            <input type="search" class="form-control mb-2" id="txtRptOfertasBuscar"
                placeholder="Buscar vendedor, documento, oferta, producto..."
                oninput="F.FiltrarTabla('tblRptOfertas','txtRptOfertasBuscar')">
            <div class="table-responsive">
                <table class="table table-bordered table-sm mb-0" id="tblRptOfertas">
                    <thead class="bg-base text-white negrita">
                        <tr>
                            <th>FECHA</th>
                            <th>VENDEDOR</th>
                            <th>CODDOC</th>
                            <th>CORR.</th>
                            <th>OFERTA</th>
                            <th>CODPROD</th>
                            <th>DESPROD</th>
                            <th class="text-right">TOTAL UNID.</th>
                            <th class="text-right">TOTAL PRECIO</th>
                        </tr>
                    </thead>
                    <tbody id="tblDataRptOfertas"></tbody>
                </table>
            </div>
        </div>
    </div>
    <button type="button" class="btn btn-circle btn-xl btn-secondary btn-bottom-l hand shadow" data-spa-action="inicio">
        <i class="fal fa-home"></i>
    </button>`;
}

function rpt_ofertas_render_rows(rows) {
    const tbody = document.getElementById('tblDataRptOfertas');
    const lbTotal = document.getElementById('lbRptOfertasTotal');
    if (!tbody) return;
    rpt_ofertas_cache = rows || [];
    if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted py-3">Sin datos en el rango</td></tr>';
        if (lbTotal) lbTotal.innerText = '0 líneas';
        return;
    }
    let str = '';
    rows.forEach((r) => {
        str += `<tr>
            <td>${F.convertDateNormal(r.FECHA)}</td>
            <td>${r.VENDEDOR || ''}</td>
            <td>${r.CODDOC || ''}</td>
            <td>${r.CORRELATIVO ?? ''}</td>
            <td>${r.OFERTA || ''}</td>
            <td>${r.CODPROD || ''}</td>
            <td>${r.DESPROD || ''}</td>
            <td class="text-right">${r.TOTALUNIDADES ?? ''}</td>
            <td class="text-right">${F.setMoneda(r.TOTALPRECIO, 'Q')}</td>
        </tr>`;
    });
    tbody.innerHTML = str;
    if (lbTotal) lbTotal.innerText = `${rows.length} línea${rows.length === 1 ? '' : 's'}`;
    const txt = document.getElementById('txtRptOfertasBuscar');
    if (txt?.value) F.FiltrarTabla('tblRptOfertas', 'txtRptOfertasBuscar');
}

function rpt_ofertas_cargar() {
    const tbody = document.getElementById('tblDataRptOfertas');
    const lbTotal = document.getElementById('lbRptOfertasTotal');
    if (!tbody) return;
    const del = document.getElementById('txtRptOfertasDel')?.value || '';
    const al = document.getElementById('txtRptOfertasAl')?.value || '';
    if (!del || !al) {
        F.AvisoError('Indique fecha inicial y final');
        return;
    }
    if (del > al) {
        F.AvisoError('La fecha inicial no puede ser mayor que la final');
        return;
    }
    const sucursal = rpt_ofertas_sucursal_param();
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-3">${GlobalLoader}</td></tr>`;
    axios.post('/ofertas/reporte_ofertas_detalle', {
        token: TOKEN,
        sucursal,
        fecha_del: del,
        fecha_al: al
    }).then((response) => {
        if (response.data === 'error') throw new Error('error');
        rpt_ofertas_render_rows(response.data.recordset || []);
    }).catch(() => {
        rpt_ofertas_cache = [];
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-danger py-3">No se pudo cargar el reporte</td></tr>';
        if (lbTotal) lbTotal.innerText = '—';
        F.AvisoError('No se pudo cargar el reporte de ofertas');
    });
}

function rpt_ofertas_export_excel() {
    if (!rpt_ofertas_cache.length) {
        F.AvisoError('No hay datos para exportar');
        return;
    }
    const del = document.getElementById('txtRptOfertasDel')?.value || '';
    const al = document.getElementById('txtRptOfertasAl')?.value || '';
    const name = `Reporte_ofertas_${del}_${al}`;
    F.exportTableToExcel('tblRptOfertas', name);
    F.showToast('Excel generado');
}

function rpt_ofertas_cargar_sedes() {
    const cmb = document.getElementById('cmbRptOfertasSucursal');
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
        })
        .catch(() => {
            cmb.innerHTML = '<option value="">No se cargaron las sedes</option>';
        });
}

function addListeners() {
    document.title = 'Reporte de ofertas';
    const txtDel = document.getElementById('txtRptOfertasDel');
    const txtAl = document.getElementById('txtRptOfertasAl');
    const hoy = F.getFecha();
    const d = new Date();
    d.setDate(1);
    const primerDia = d.toISOString().slice(0, 10);
    if (txtDel) txtDel.value = primerDia;
    if (txtAl) txtAl.value = hoy;
    document.getElementById('btnRptOfertasBuscar')?.addEventListener('click', rpt_ofertas_cargar);
    document.getElementById('btnRptOfertasExcel')?.addEventListener('click', rpt_ofertas_export_excel);
    rpt_ofertas_cargar_sedes();
}

function initView() {
    getView();
    addListeners();
}
