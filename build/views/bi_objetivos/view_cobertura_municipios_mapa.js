function getView(){

    let view = {
        body:()=>{
            return `
            <div class="panel-content">
                
                <h3 class="text-base negrita">ANALISIS POR MUNICIPIO</h3>

                <div class="tab-content border border-top-0 border-bottom-0 border-right-0 border-left-0 p-3">
                    <div class="tab-pane fade show active"  id="uno"  role="tabpanel">
                       ${view.mapa()}
                    </div>
                    <div class="tab-pane fade" id="dos" role="tabpanel">            
                        ${view.detalles_municipio()}
                    </div>
                    <div class="tab-pane fade" id="tres" role="tabpanel">            
                        
                    </div>
                </div>
                <ul class="nav nav-tabs hidden" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link btn-md active" data-toggle="tab" href="#uno" role="tab" id="tab-uno">
                            <i class="fal fa-home mr-1"></i>Map
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn-md" data-toggle="tab" href="#dos" role="tab" id="tab-dos">
                            <i class="fal fa-calendar-alt mr-1"></i>2
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn-md" data-toggle="tab" href="#tres" role="tab"  id="tab-tres">
                            <i class="fal fa-chart-bar mr-1"></i>3
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
                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            
                            <div class="form-group">
                                <label class="text-secondary">Sucursal</label>
                                <select class="form-control negrita" id="cmbSucursal">
                                </select>
                            </div>

                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            
                            <div class="form-group">
                                <label class="text-secondary">Seleccione Mes y Año</label>
                                <div class="input-group">
                                    <select class="form-control negrita" id="cmbMes">
                                    </select>
                                    <select class="form-control negrita" id="cmbAnio">
                                    </select>
                                </div>
                            </div>

                        </div>
                    </div>
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
                        <table class="sortable table h-full col-12 table-bordered" id="tblMunicipiosDep">
                            <thead class="bg-primary text-white">
                                <tr>
                                    <td>Municipio</td>
                                    <td>Importe</td>
                                    <td>Part</td>
                                </tr>
                            </thead>
                            <tbody id="tbl_data_municipios"></tbody>
                        </table>

                    </div>
                </div>
            </div>                  
          `
        },
        detalles_municipio:()=>{
            return `
            
            <div class="row">
                <div class="col-6">
                    <h3 class="negrita text-danger" id="lbMunicipioDetalle"></h3>
                </div>
                <div class="col-2">
                    <h5 class="text-center text-danger negrita" id="lbUniverso">0</h5>
                    <h5 class="text-center text-success negrita" id="lbVisitados">0</h5>
                </div>
                 <div class="col-4">
                    <h3 class="text-center text-danger negrita" id="lbTotalVenta">0</h3>
                </div>
            </div>

            <br>
                                       

            <div class="card col-12 card-rounded shadow"> 
                <div class="card-body p-4">
            
                    <div class="row">
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            ${view.frag_rpt_ventas_marcas_municipio()}
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            ${view.frag_rpt_ventas_vendedor_municipio()}
                        </div>
                         <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            ${view.frag_rpt_ventas_producto_municipio()}
                        </div>
                    </div>

                </div>
            </div>

            <button class="btn btn-secondary btn-circle btn-xl btn-bottom-l hand shadow"
                onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        frag_rpt_ventas_marcas_municipio:()=>{
            return `
            <div class="table-responsive">
                <h5 class="text-base">VENTAS POR MARCAS</h5>
                <table class="table table-bordered h-full col-12">
                    <thead class="bg-base text-white">
                        <tr>
                            <td>MARCA</td>
                            <td>CLIENTES</td>
                            <td>IMPORTE</td>
                            <td>PART</td>
                        </tr>
                    </thead>
                    <tbody id="data_tbl_marcas_municipio"></tbody>
                </table>
            </div>
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
            <div class="table-responsive">
                <h5 class="text-info">VENTAS POR PRODUCTO</h5>
                <table class="table table-bordered h-full col-12">
                    <thead class="bg-info text-white">
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody id=""></tbody>
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
                                                <div class="card card-rounded shadow p2" id="containerGraf1">
                                                
                                                </div>
                                            
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

function addListeners(){

    F.slideAnimationTabs();

   
        document.getElementById('cmbMes').innerHTML = F.ComboMeses();
        document.getElementById('cmbMes').value = F.get_mes_curso();
        document.getElementById('cmbMes').addEventListener('change',()=>{
            //carga los datos con una latitud y longitud en el centro del mapa
            mapaCobertura('mapContenedor',15.8037849,-89.8683734);
        });

        document.getElementById('cmbAnio').innerHTML = F.ComboAnio();
        document.getElementById('cmbAnio').value = F.get_anio_curso();
        document.getElementById('cmbAnio').addEventListener('change',()=>{
                //carga los datos con una latitud y longitud en el centro del mapa
                mapaCobertura('mapContenedor',15.8037849,-89.8683734);
        });


   
    let cmbSucursal = document.getElementById('cmbSucursal');
        GF.get_data_empresas()
        .then((data)=>{
                let str = '';
                data.recordset.map((r)=>{
                    str += `
                        <option value="${r.EMPNIT}">${r.NOMBRE}</option>
                    `
                })
                cmbSucursal.innerHTML = str;
        
                if(Number(GlobalNivelUsuario)==2){
                    cmbSucursal.disabled = true;
                    cmbSucursal.value = GlobalEmpnit;
                };
                if(Number(GlobalNivelUsuario)==5){
                    cmbSucursal.value = GlobalEmpnit;
                };
        
                 //carga los datos con una latitud y longitud en el centro del mapa
                mapaCobertura('mapContenedor',15.8037849,-89.8683734);
        })
        .catch(()=>{
            cmbSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
        })

        cmbSucursal.addEventListener('change',()=>{
            //carga los datos con una latitud y longitud en el centro del mapa
            mapaCobertura('mapContenedor',15.8037849,-89.8683734);
        })

      

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


    let sucursal = document.getElementById('cmbSucursal').value;
    let mes =  document.getElementById('cmbMes').value;
    let anio =  document.getElementById('cmbAnio').value;


    getDataCobertura(sucursal,mes,anio)
    .then((datos) => {
        const data = datos;

        let totalventa = 0;
        data.map((r)=>{
            totalventa += Number(r.TOTALPRECIO);
        });

        data.map((rows)=>{
                //Carga el marker en el mapa
                L.marker([rows.LAT, rows.LONG])
                .addTo(map)
                .bindPopup(`${rows.MUNICIPIO} <br><small>Vendido: ${F.setMoneda(rows.TOTALPRECIO,'Q')}</small>`, {closeOnClick: true, autoClose: true})   
                .on('click', function(e){
                    console.log(e);
                    getMenuMunicipio(rows.CODMUNICIPIO, rows.MUNICIPIO, rows.TOTALPRECIO,rows.UNIVERSO,rows.CONTEO)
                   
                });
                //dibuja la table
                str += `<tr class="hand" onclick="getMenuMunicipio('${rows.CODMUNICIPIO}', '${rows.MUNICIPIO}', '${rows.TOTALPRECIO}','${rows.UNIVERSO}','${rows.CONTEO}')">
                            <td>${rows.MUNICIPIO}</td>
                            <td class="currSign">${F.setMoneda(rows.TOTALPRECIO,'')}</td>
                            <td>${F.getParticipacion(Number(rows.TOTALPRECIO), totalventa)}</td>
                        </tr>`
        })

        //carga la tabla
        containerTabla.innerHTML = str;
      
        

        //RE-AJUSTA EL MAPA A LA PANTALLA
        setTimeout(function () {
           
            try {
                map.invalidateSize();    
            } catch (error) {
                
            }
        }, 500);

    }, (error) => {
        F.AvisoError('Error en la solicitud');
        container.innerHTML = '';
    })
    .catch((error)=>{
        console.log('Error al cargar mapa..')
        console.log(error);
    })
       
};

function getDataCobertura(sucursal,mes,anio){

    return new Promise((resolve, reject)=>{
      
        axios.post(`/objetivos/get_cobertura`, {sucursal: sucursal, anio:anio, mes:mes})
        .then(res => {
            const datos = res.data.recordset;
            resolve(datos);
        })
        .catch(()=>{
            reject();
        })


    })
     

};




function getMenuMunicipio(codmun, desmun,venta,universo,visitados){


    document.getElementById('tab-dos').click();

    
   
    document.getElementById('lbMunicipioDetalle').innerText = `Resumen: ${desmun}` ;
    document.getElementById('lbUniverso').innerText = `Universo: ${universo}`;
    document.getElementById('lbVisitados').innerText = `Visitados: ${visitados}`;
    document.getElementById('lbTotalVenta').innerText = F.setMoneda(venta,'Q');


    tbl_marcas_municipio(codmun);

    

};


//marcas del municipio
function data_marcas_municipio(sucursal,codmun,mes,anio){

    return new Promise((resolve, reject)=>{
      
        axios.post(`/objetivos/get_marcas_municipio`, {
                                                        sucursal: sucursal, 
                                                        anio:anio, 
                                                        mes:mes,
                                                        codmun:codmun})
        .then(res => {
            const data = res.data;
            resolve(data);
        })
        .catch(()=>{
            reject();
        })


    })
     

};
function tbl_marcas_municipio(codmun){

    let container = document.getElementById('data_tbl_marcas_municipio');
    container.innerHTML = GlobalLoader;

    let sucursal = document.getElementById('cmbSucursal').value;
    let mes =  document.getElementById('cmbMes').value;
    let anio =  document.getElementById('cmbAnio').value;


    let str = '';
    
    let totalventa = 0;
   
    data_marcas_municipio(sucursal,codmun,mes,anio)
    .then((data)=>{
        

        data.recordset.map((r)=>{
            totalventa += Number(r.TOTALPRECIO);
        })

        data.recordset.map((r)=>{
            
            console.log(r)

            str += `
                    <tr class="">
                        <td>${r.DESMARCA}</td>
                        <td>${r.CONTEO}</td>
                        <td >${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                        <td>${F.getParticipacion(Number(r.TOTALPRECIO), totalventa)}</td>
                    </tr>
                    `
        })
      

        container.innerHTML = str;

    })
    .catch((err)=>{
        console.log(err)
        container.innerHTML = 'No se cargaron datos...';
    })
       

 

};

function getPieMarcasMunicipio(data){
   
    let container = document.getElementById('containerGraf1');
    container.innerHTML = '';
    container.innerHTML = '<canvas id="myChart" width="40" height="40"></canvas>';
  
    let label = []; let valor = []; let bgColor = [];
    let total = 0;
    data.map((r)=>{
        total = total + Number(r.TOTALPRECIO);
    });
   
    data.map((r)=>{
            label.push(r.DESMARCA);
            valor.push(Number(((Number(r.TOTALPRECIO)/total))*100).toFixed(2));
            bgColor.push(getRandomColor())
    })

  
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: 'doughnut',
        data: {
            labels: label,
            datasets: [{
                data:valor,
                borderColor: 'white',
                backgroundColor:bgColor
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Ventas por Marca: ' + F.setMoneda(total,'Q')
                  },
                // Change options for ALL labels of THIS CHART
                datalabels: {
                  anchor:'end',
                  align:'end',
                  listeners: {
                    click: function(context) {
                      // Receives `click` events only for labels of the first dataset.
                      // The clicked label index is available in `context.dataIndex`.
                      console.log(context);
                    }
                  },
                  formatter: function(value) {
                    return value + '%';
                    // eq. return ['line1', 'line2', value]
                  },
                  color: function(context) {
                    return context.dataset.backgroundColor;
                  },
                  borderColor: 'white',
                  borderRadius: 25,
                  borderWidth: 0,
                  font: {
                    weight: 'bold'
                  }
                }
            }
        }
    });


    

};






function BACKUP_mapaCobertura(idContenedor, lt, lg){

    let container = document.getElementById(idContenedor);
    container.innerHTML = GlobalLoader;
    
    let tbl = `<div class="mapcontainer4" id="mapcontainer"></div>`;  
    
    let containerTabla = document.getElementById('containerMunicipios');
    containerTabla.innerHTML = GlobalLoader;
    let str = '';
    
    container.innerHTML = tbl;
    
    let mapcargado = 0;
    var map;
    map = F.Lmap(lt, lg);

    getDataCobertura()
    .then((datos) => {
        const data = datos;

        let totalventa = 0;
        data.map((r)=>{
            totalventa += Number(r.TOTALPRECIO);
        });

        data.map((rows)=>{
                //Carga el marker en el mapa
                L.marker([rows.LAT, rows.LONG])
                .addTo(map)
                .bindPopup(`${rows.MUNICIPIO} <br><small>Vendido: ${F.setMoneda(rows.TOTALPRECIO,'Q')}</small>`, {closeOnClick: true, autoClose: true})   
                .on('click', function(e){
                    console.log(e);
                    getMenuMunicipio(rows.CODSUCURSAL.toString(),rows.CODMUNICIPIO, rows.MUNICIPIO, rows.CODDEPTO, rows.TOTALPRECIO)
                    //console.log(e.sourceTarget._leaflet_id);
                    //GlobalMarkerId = Number(e.sourceTarget._leaflet_id);
                    //getMenuCliente(rows.CODIGO,rows.NOMCLIE,rows.DIRCLIE,rows.TELEFONO,rows.LAT,rows.LONG,rows.NIT);
                });
                //dibuja la table
                str += `<tr class="hand" onclick="getMenuMunicipio('${rows.CODSUCURSAL}','${rows.CODMUNICIPIO}', '${rows.MUNICIPIO}', '${rows.CODDEPTO}', '${rows.TOTALPRECIO}')">
                            <td>${rows.MUNICIPIO}
                                <br>
                                <small class="negrita">${rows.DEPARTAMENTO}</small>
                            </td>
                            <td class="currSign">${F.setMoneda(rows.TOTALPRECIO,'')}</td>
                            <td>${F.getParticipacion(Number(rows.TOTALPRECIO), totalventa)}</td>
                        </tr>`
        })

        //carga la tabla
        let tablamun = `
                        <table class="table table-responsive table-hover" id="tblMunicipiosDep">
                            <thead>
                                <tr>
                                    <td>Municipio</td>
                                    <td>Importe</td>
                                    <td>Part</td>
                                </tr>
                            </thead>
                            <tbody id="">${str}</tbody>
                        </table>
        `
        containerTabla.innerHTML = tablamun;
        try {
            var table = $('#tblMunicipiosDep').DataTable({
                paging: false, 
                bFilter:true
            });    
        } catch (error) {
            
        }
        

        //RE-AJUSTA EL MAPA A LA PANTALLA
        setTimeout(function () {
            console.log('timer mapa 1')
            try {
                map.invalidateSize();    
            } catch (error) {
                
            }
        }, 500);

    }, (error) => {
        F.AvisoError('Error en la solicitud');
        container.innerHTML = '';
    })
    .catch((error)=>{
        console.log('Error al cargar mapa..')
        console.log(error);
    })
       
};


function BACKUP_getDataCobertura(){

    return new Promise((resolve, reject)=>{
      
        axios.post(`/objetivos/get_cobertura`, {empresas: parametrosEmpresas, anio:parametrosAnio, mes:parametrosMes})
        .then(res => {
            const datos = res.data.recordset;
            resolve(datos);
        })
        .catch(()=>{
            reject();
        })


    })
     

};
