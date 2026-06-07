let cobertura_municipioActivo = null;
let cobertura_chartMarcasInstance = null;
const COBERTURA_MODO_VENTAS = 'bruta';

function getView(){

    let view = {
        body:()=>{
            return `
            <div class="panel-content proveedor-cobertura-municipios">
                
                <h3 class="text-base negrita mb-1">Análisis por municipio</h3>
                <small class="text-muted d-block proveedor-cobertura-subtitle mb-0">Ventas brutas (solo documentos de venta)</small>

                <div class="tab-content border border-top-0 border-bottom-0 border-right-0 border-left-0 px-3 pb-3 pt-0" id="coberturaTabContent">
                    <div class="tab-pane fade show active" id="cobertura-pane-mapa" role="tabpanel">
                       ${view.mapa()}
                    </div>
                    <div class="tab-pane fade" id="cobertura-pane-detalle" role="tabpanel">
                        ${view.detalles_municipio()}
                    </div>
                </div>
                <ul class="nav nav-tabs hidden" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link btn-md active" data-toggle="tab" href="#cobertura-pane-mapa" role="tab" id="cobertura-tab-mapa">
                            <i class="fal fa-home mr-1"></i>Mapa
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn-md" data-toggle="tab" href="#cobertura-pane-detalle" role="tab" id="cobertura-tab-detalle">
                            <i class="fal fa-map-marker-alt mr-1"></i>Detalle
                        </a>
                    </li>
                </ul>

            </div>
            `
        },
        mapa:()=>{
          return `
            <div class="card card-rounded col-12">
                <div class="card-body p-4">
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm-12 col-md-8 col-lg-8 col-xl-8">

                    <div class="card shadow card-rounded" id="mapContenedor">
                    </div>
                
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div class="table-responsive" id="containerMunicipios">
                        
                        <div class="form-group">
                            <input class="form-control border-danger text-danger" type="text" placeholder="Escriba para buscar..."
                            id="txtBuscarMunicipio"
                            oninput="F.FiltrarTabla('tblMunicipiosDep','txtBuscarMunicipio')">
                        </div>
                        <table class="sortable table table-sm table-bordered proveedor-rpt-marcas__table mb-0" id="tblMunicipiosDep">
                            <thead class="bg-primary text-white">
                                <tr>
                                    <td>Municipio</td>
                                    <td class="text-right">Importe</td>
                                    <td class="text-right">Part</td>
                                </tr>
                            </thead>
                            <tbody id="tbl_data_municipios"></tbody>
                            <tfoot class="bg-primary text-white negrita">
                                <tr>
                                    <td>TOTAL</td>
                                    <td class="text-right currSign" id="lbFootMunicipiosImporte">--</td>
                                    <td class="text-right">100%</td>
                                </tr>
                            </tfoot>
                        </table>

                    </div>
                </div>
            </div>
            
          `
        },
        detalles_municipio:()=>{
            return `
            <div class="proveedor-cobertura-detalle-header card card-rounded shadow-sm mb-2 mt-0">
                <div class="card-body py-2 px-3">
                    <div class="d-flex align-items-center">
                        <button type="button" class="btn btn-secondary btn-circle btn-sm shadow hand flex-shrink-0" id="btnCoberturaVolverMapa" title="Volver al mapa">
                            <i class="fal fa-arrow-left"></i>
                        </button>
                        <div class="ml-2 flex-grow-1 min-width-0">
                            <div class="negrita text-danger text-truncate" id="lbMunicipioDetalle">Municipio</div>
                            <div class="proveedor-cobertura-detalle-stats small">
                                <span class="text-muted" id="lbUniverso">Universo: 0</span>
                                <span class="text-muted mx-1">·</span>
                                <span class="text-success" id="lbVisitados">Visitados: 0</span>
                                <span class="text-muted mx-1">·</span>
                                <span class="negrita text-danger" id="lbTotalVenta">Q 0.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card col-12 card-rounded shadow">
                <div class="card-body p-2">
                    <div class="row">
                        <div class="col-12 col-lg-3 mb-2 mb-lg-0">
                            ${view.frag_grafica_marcas_municipio()}
                        </div>
                        <div class="col-12 col-lg-4 mb-2 mb-lg-0">
                            ${view.frag_rpt_ventas_marcas_municipio()}
                        </div>
                        <div class="col-12 col-lg-5">
                            ${view.frag_rpt_ventas_producto_municipio()}
                        </div>
                    </div>
                </div>
            </div>

            `
        },
        frag_rpt_ventas_marcas_municipio:()=>{
            return `
                <div class="table-responsive proveedor-rpt-marcas__scroll">
                <h5 class="text-base negrita mb-2">Ventas por marcas</h5>
                <table class="table table-sm table-bordered proveedor-rpt-marcas__table mb-0">
                    <thead class="bg-base text-white">
                        <tr>
                            <td>MARCA</td>
                            <td class="text-right">IMPORTE</td>
                            <td class="text-right">PART</td>
                        </tr>
                    </thead>
                    <tbody id="data_tbl_marcas_municipio"></tbody>
                    <tfoot class="bg-base text-white negrita">
                        <tr>
                            <td>TOTAL</td>
                            <td class="text-right" id="lbFootMarcasMunicipioImporte">--</td>
                            <td class="text-right">100%</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            `
        },
        frag_grafica_marcas_municipio:()=>{
            return `
            <div id="coberturaChartMarcas" class="proveedor-cobertura-chart"></div>
            `
        },
        frag_rpt_ventas_vendedor_municipio:()=>{
            return `
            <div class="table-responsive">
                <h5 class="text-secondary">VENTAS POR VENDEDOR</h5>
                <table class="table table-bordered h-full col-12">
                    <thead class="bg-secondary text-white">
                        <tr>
                            <td>VENDEDOR</td>
                            <td>CLIENTES</td>
                            <td>IMPORTE</td>
                        </tr>
                    </thead>
                    <tbody id=""></tbody>
                </table>
            </div>
            `
        },
        frag_rpt_ventas_producto_municipio:()=>{
            return `
                <div class="table-responsive proveedor-rpt-marcas__scroll">
                <h5 class="text-info negrita mb-2">Ventas por producto</h5>
                <table class="table table-sm table-bordered proveedor-rpt-marcas__table mb-0">
                    <thead class="bg-info text-white">
                        <tr>
                            <td>PRODUCTO</td>
                            <td class="text-right">UNIDADES</td>
                            <td class="text-right">IMPORTE</td>
                            <td class="text-right">PART</td>
                        </tr>
                    </thead>
                    <tbody id="data_tbl_productos"></tbody>
                    <tfoot class="bg-info text-white negrita">
                        <tr>
                            <td>TOTAL</td>
                            <td class="text-right" id="lbFootProductosMunicipioUnidades">--</td>
                            <td class="text-right" id="lbFootProductosMunicipioImporte">--</td>
                            <td class="text-right">100%</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            `
        },
        modalMunicipio:()=>{
            return `
                <div class="modal fade shadow card-rounded" id="modalResumenMunicipio" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-right modal-lg" role="document">
                        <div class="modal-content">
                    
                            <div class="modal-body p-2">
                                <div class="card card-rounded shadow">
                                    
                                    <div class="card-body">
                                        <h5 class="text-center text-secondary" id="lbMunicipio">Municipio</h5>
                                       
                                        <hr class="solid">
                                    </div>
                                    
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-6 col-lg-6 col-xl-6 col-sm-12">
                                                <div class="table-responsive"  id="containerTblMarcas">
                                                    
                                                </div>    
                                            </div>
                                            <div class="col-md-6 col-lg-6 col-xl-6 col-sm-12">
                                                <div class="card card-rounded shadow p2" id="coberturaModalChartMarcas"></div>
                                            </div>
                                        </div>
                                    

                                    
                                    </div>  
                                </div>                      
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-outline-secondary btn-xl btn-circle shadow" data-dismiss="modal">
                                    <i class="fal fa-arrow-right"></i>
                                </button>
                            
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    }


    root.innerHTML = view.body() + view.modalMunicipio();

};

function cobertura_refreshVista() {
    mapaCobertura('mapContenedor', 15.8037849, -89.8683734);
    if (cobertura_municipioActivo) {
        tbl_marcas_municipio(cobertura_municipioActivo.codmun);
        tbl_productos_municipio(cobertura_municipioActivo.codmun);
    }
}

function cobertura_mostrarMapa() {
    document.getElementById('cobertura-tab-mapa')?.click();
}

function addListeners(){
    F.slideAnimationTabs();

    document.getElementById('btnCoberturaVolverMapa')?.addEventListener('click', cobertura_mostrarMapa);

    document.getElementById('tblMunicipiosDep')?.addEventListener('click', (e) => {
        const row = e.target.closest('tr[data-codmun]');
        if (!row) return;
        getMenuMunicipio(
            row.dataset.codmun,
            row.dataset.municipio || '',
            row.dataset.venta,
            row.dataset.universo,
            row.dataset.visitados
        );
    });

    cobertura_refreshVista();
    window.proveedor_embedRefresh = cobertura_refreshVista;
};


function initView(){
    getView();
    addListeners();
};


function mapaCobertura(idContenedor, lt, lg){

    let container = document.getElementById(idContenedor);
    container.innerHTML = GlobalLoader;
    
    let tbl = `<div class="mapcontainer_localizaciones" id="mapcontainer"></div>`;  
    
    let containerTabla = document.getElementById('tbl_data_municipios');
    containerTabla.innerHTML = GlobalLoader;
    
    let str = '';
    
    container.innerHTML = tbl;
    
    let mapcargado = 0;
    var map;
    //map = F.Lmap(lt, lg);

      var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          osm = L.tileLayer(osmUrl, {center: [lt, lg],maxZoom: 20, attribution: osmAttrib});    
          map = L.map('mapcontainer').setView([lt, lg], 8).addLayer(osm);


    let sucursal = proveedor_getSucursal();
    let mes =  proveedor_getMes();
    let anio =  proveedor_getAnio();
    getDataCobertura(sucursal, mes, anio, COBERTURA_MODO_VENTAS)
    .then((datos) => {
        const data = Array.isArray(datos) ? datos : [];
        if (!data.length) {
            containerTabla.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Sin datos</td></tr>';
            const footImporte = document.getElementById('lbFootMunicipiosImporte');
            if (footImporte) footImporte.innerText = '--';
            return;
        }

        let totalventa = 0;
        data.forEach((r) => {
            totalventa += Number(r.TOTALPRECIO);
        });

        data.forEach((rows) => {
                //Carga el marker en el mapa
                L.marker([rows.LAT, rows.LONG])
                .addTo(map)
                .bindPopup(`${rows.MUNICIPIO} <br><small>Vendido: ${F.setMoneda(rows.TOTALPRECIO,'Q')}</small>`, {closeOnClick: true, autoClose: true})   
                .on('click', function(e){
                    console.log(e);
                    getMenuMunicipio(rows.CODMUNICIPIO, rows.MUNICIPIO, rows.TOTALPRECIO,rows.UNIVERSO,rows.CONTEO)
                   
                });
                //dibuja la table
                const munAttr = String(rows.MUNICIPIO || '').replace(/"/g, '&quot;');
                str += `<tr class="hand" data-codmun="${rows.CODMUNICIPIO}" data-municipio="${munAttr}" data-venta="${rows.TOTALPRECIO}" data-universo="${rows.UNIVERSO || 0}" data-visitados="${rows.CONTEO || 0}">
                            <td>${rows.MUNICIPIO}</td>
                            <td class="text-right currSign">${F.setMoneda(rows.TOTALPRECIO,'')}</td>
                            <td class="text-right">${F.getParticipacion(Number(rows.TOTALPRECIO), totalventa)}</td>
                        </tr>`;
        });

        containerTabla.innerHTML = str || '<tr><td colspan="3" class="text-center text-muted">Sin datos</td></tr>';
        const footImporte = document.getElementById('lbFootMunicipiosImporte');
        if (footImporte) footImporte.innerText = F.setMoneda(totalventa, '');

        //RE-AJUSTA EL MAPA A LA PANTALLA
        setTimeout(function () {
           
            try {
                map.invalidateSize();    
            } catch (error) {
                
            }
        }, 500);

    })
    .catch(() => {
        F.AvisoError('Error al cargar cobertura por municipio');
        container.innerHTML = '<p class="text-center text-muted p-3">No se cargó el mapa</p>';
        if (containerTabla) {
            containerTabla.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No se cargaron datos</td></tr>';
        }
        const footImporte = document.getElementById('lbFootMunicipiosImporte');
        if (footImporte) footImporte.innerText = '--';
    })
       
};

function getDataCobertura(sucursal,mes,anio,modo){

    return new Promise((resolve, reject)=>{
      
        axios.post(`/objetivos/get_cobertura`, {
            token: typeof TOKEN !== 'undefined' ? TOKEN : '',
            sucursal: sucursal,
            anio: anio,
            mes: mes,
            modo: COBERTURA_MODO_VENTAS
        })
        .then(res => {
            const data = res.data;
            if (!data || data.toString() === 'error' || !Array.isArray(data.recordset)) {
                reject();
                return;
            }
            resolve(data.recordset);
        })
        .catch(() => reject());
    });
};




function getMenuMunicipio(codmun, desmun, venta, universo, visitados){
    cobertura_municipioActivo = { codmun, desmun, venta, universo, visitados };

    const tabDetalle = document.getElementById('cobertura-tab-detalle');
    if (tabDetalle) {
        tabDetalle.click();
    } else {
        $('#cobertura-pane-mapa').removeClass('show active');
        $('#cobertura-pane-detalle').addClass('show active');
    }

    document.getElementById('lbMunicipioDetalle').innerText = desmun;
    document.getElementById('lbUniverso').innerText = `Universo: ${universo}`;
    document.getElementById('lbVisitados').innerText = `Visitados: ${visitados}`;
    document.getElementById('lbTotalVenta').innerText = F.setMoneda(venta, 'Q');

    tbl_marcas_municipio(Number(codmun));
    tbl_productos_municipio(Number(codmun));
};

window.getMenuMunicipio = getMenuMunicipio;


//marcas del municipio
function data_marcas_municipio(sucursal, codmun, mes, anio) {
    return new Promise((resolve, reject) => {
        axios.post(`/objetivos/get_marcas_municipio`, {
            token: typeof TOKEN !== 'undefined' ? TOKEN : '',
            sucursal: sucursal,
            anio: anio,
            mes: mes,
            codmun: codmun,
            modo: COBERTURA_MODO_VENTAS
        })
        .then(res => {
            const data = res.data;
            if (!data || data.toString() === 'error') {
                reject();
                return;
            }
            resolve(data);
        })
        .catch(() => reject())


    })
     

};
function tbl_marcas_municipio(codmun){
    const container = document.getElementById('data_tbl_marcas_municipio');
    if (!container) return;

    container.innerHTML = `<tr><td colspan="3" class="text-center">${GlobalLoader}</td></tr>`;

    let sucursal = proveedor_getSucursal();
    let mes =  proveedor_getMes();
    let anio = proveedor_getAnio();

    let str = '';
    let totalventa = 0;
    const footImporte = document.getElementById('lbFootMarcasMunicipioImporte');

    data_marcas_municipio(sucursal, Number(codmun), mes, anio)
    .then((data) => {
        const items = Array.isArray(data.recordset) ? data.recordset : [];
        items.forEach((r) => { totalventa += Number(r.TOTALPRECIO); });

        items.forEach((r) => {
            str += `
                    <tr>
                        <td>${r.DESMARCA}</td>
                        <td class="text-right">${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                        <td class="text-right">${F.getParticipacion(Number(r.TOTALPRECIO), totalventa)}</td>
                    </tr>`;
        });

        container.innerHTML = str || '<tr><td colspan="3" class="text-center text-muted">Sin datos</td></tr>';
        if (footImporte) footImporte.innerText = F.setMoneda(totalventa, 'Q');

        chart_marcas_municipio(items, totalventa);
    })
    .catch(() => {
        container.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No se cargaron datos</td></tr>';
        if (footImporte) footImporte.innerText = '--';
    })
       


};
function chart_marcas_municipio(data, totalPrecio) {
    const container = document.getElementById('coberturaChartMarcas');
    if (!container || !data?.length || typeof Chart === 'undefined') {
        if (cobertura_chartMarcasInstance) {
            cobertura_chartMarcasInstance.destroy();
            cobertura_chartMarcasInstance = null;
        }
        if (container) container.innerHTML = '<p class="text-muted text-center py-4">Sin datos para gráfica</p>';
        return;
    }

    const total = Number(totalPrecio) || data.reduce((acc, r) => acc + Number(r.TOTALPRECIO), 0);
    if (!total) {
        container.innerHTML = '<p class="text-muted text-center py-4">Sin datos para gráfica</p>';
        return;
    }

    const labels = [];
    const values = [];
    const bgColor = [];

    data.forEach((r) => {
        labels.push(r.DESMARCA);
        values.push(Number(r.TOTALPRECIO));
        bgColor.push(getRandomColor());
    });

    container.innerHTML = '<canvas id="coberturaChartMarcasCanvas"></canvas>';
    container.style.height = `${Math.min(420, Math.max(200, labels.length * 28))}px`;

    const canvas = document.getElementById('coberturaChartMarcasCanvas');
    if (!canvas) return;

    if (cobertura_chartMarcasInstance) {
        cobertura_chartMarcasInstance.destroy();
    }

    cobertura_chartMarcasInstance = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Importe',
                data: values,
                backgroundColor: bgColor,
                borderRadius: 4,
                maxBarThickness: 22
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: `Ventas por marca: ${F.setMoneda(total, 'Q')}`,
                    font: { size: 12 }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 68, 163, 0.08)' },
                    ticks: {
                        font: { size: 10 },
                        callback: (value) => F.setMoneda(value, 'Q')
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        font: { size: 10 },
                        autoSkip: false
                    }
                }
            }
        }
    });
};


//productos
function data_productos_municipio(sucursal, codmun, mes, anio) {
    return new Promise((resolve, reject) => {
        axios.post(`/objetivos/get_productos_municipio`, {
            token: typeof TOKEN !== 'undefined' ? TOKEN : '',
            sucursal: sucursal,
            anio: anio,
            mes: mes,
            codmun: codmun,
            modo: COBERTURA_MODO_VENTAS
        })
        .then(res => {
            const data = res.data;
            if (!data || data.toString() === 'error') {
                reject();
                return;
            }
            resolve(data);
        })
        .catch(() => reject())


    })
     

};
function tbl_productos_municipio(codmun){
    const container = document.getElementById('data_tbl_productos');
    if (!container) return;

    container.innerHTML = `<tr><td colspan="4" class="text-center">${GlobalLoader}</td></tr>`;

    let sucursal = proveedor_getSucursal();
    let mes =  proveedor_getMes();
    let anio = proveedor_getAnio();

    let str = '';
    let totalventa = 0;
    let totalUnidades = 0;
    const footImporte = document.getElementById('lbFootProductosMunicipioImporte');
    const footUnidades = document.getElementById('lbFootProductosMunicipioUnidades');

    data_productos_municipio(sucursal, Number(codmun), mes, anio)
    .then((data) => {
        const items = Array.isArray(data.recordset) ? data.recordset : [];
        items.forEach((r) => {
            totalventa += Number(r.TOTALPRECIO);
            totalUnidades += Number(r.TOTALUNIDADES);
        });

        items.forEach((r) => {
            str += `
                    <tr>
                        <td>${r.DESPROD}<br><small class="text-muted">${r.DUN || ''}</small></td>
                        <td class="text-right">${r.TOTALUNIDADES}</td>
                        <td class="text-right">${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                        <td class="text-right">${F.getParticipacion(Number(r.TOTALPRECIO), totalventa)}</td>
                    </tr>`;
        });

        container.innerHTML = str || '<tr><td colspan="4" class="text-center text-muted">Sin datos</td></tr>';
        if (footImporte) footImporte.innerText = F.setMoneda(totalventa, 'Q');
        if (footUnidades) footUnidades.innerText = String(totalUnidades);
    })
    .catch(() => {
        container.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No se cargaron datos</td></tr>';
        if (footImporte) footImporte.innerText = '--';
        if (footUnidades) footUnidades.innerText = '--';
    })
       


};




