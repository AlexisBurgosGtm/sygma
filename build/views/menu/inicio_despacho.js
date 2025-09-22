function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           ${view.vista_documentos()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_detalle()}
                        </div>  
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_mapa()}
                        </div>  
                        <div class="tab-pane fade" id="cinco" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_devolucion()}
                        </div>    
                    </div>

                    <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active negrita text-success" id="tab-uno" data-toggle="tab" href="#uno" role="tab" aria-controls="profile" aria-selected="false">
                                <i class="fal fa-list"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-dos" data-toggle="tab" href="#dos" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>  
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-tres" data-toggle="tab" href="#tres" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-cuatro" data-toggle="tab" href="#cuatro" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-cinco" data-toggle="tab" href="#cinco" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>         
                    </ul>
                </div>
               
            `
        },
        vista_listado:()=>{
            return `
            <div class="card card-rounded col-12 shadow">
                <div class="card-body p-4 text-center">
                        <h1 class="text-secondary negrita">Pickings Asignados</h1>
                        <h3 class="negrita text-danger">${GlobalUsuario}</h3>
                </div>
            </div>
            <br>
            <div class="card card-rounded col-12">
                <div class="card-body p-1" id="tblEmbarques">
                    
                    
                </div>
            </div>
            `
        },
        vista_documentos:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-2">
                    <h5 class="negrita text-danger" id="lbEmbarque"></h5>

                    <div class="form-group">
                        <input type="text" class="form-control negrita text-danger border-primary"
                        placeholder="Escriba para buscar..."
                        oninput="F.FiltrarTabla('tblDocumentos','txtBuscarDocumento')" id="txtBuscarDocumento">
                    </div>

                    <div class="table-responsive">
                        <table class="table h-full col-12 table-striped table-bordered" id="tblDocumentos">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>FACTURA</td>
                                    <td>IMPORTE</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataDocumentos"></tbody>
                        </table>
                    </div>
                    
                </div>
            </div>
            
            <button class="btn btn-secondary btn-bottom-l btn-xl btn-circle hand shadow"
            onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        vista_detalle:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">
                    
                        <table class="table table-responsive table-bordered table-hover">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <td>PRODUCTO</td>
                                    <td>MEDIDA</td>
                                    <td>CANTIDAD</td>
                                    <td>PRECIO</td>
                                    <td>IMPORTE</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataDetalle"></tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="negrita text-danger"><b id="lbDetalleTotal"></b></td>
                                </tr>
                            </tfoot>
                        </table>
                    
                </div>
            </div>

            <button class="btn btn-secondary btn-bottom-l btn-xl btn-circle hand shadow"
            onclick="document.getElementById('tab-dos').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        vista_mapa:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-0">
                    <h5 class="negrita text-danger" id="lbEmbarqueMapa"></h5>

                    <div class="" id="container_mapa"></div>
                    
                    
                </div>
            </div>
            <button class="btn btn-secondary btn-bottom-l btn-xl btn-circle hand shadow"
            onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        vista_devolucion:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">
                    
                    
                </div>
            </div>

            <button class="btn btn-secondary btn-bottom-l btn-xl btn-circle hand shadow"
            onclick="document.getElementById('tab-dos').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
    }

    root.innerHTML = view.body();

};

function addListeners(){

      
    get_tbl_embarques_pendientes();


    F.slideAnimationTabs();
};

function initView(){

    getView();
    addListeners();

};



function get_data_embarques_pendientes(){


     return new Promise((resolve,reject)=>{

        console.log('intenta cargar...')

        axios.post(GlobalUrlCalls + '/repartidor/embarques_repartidor',{
            sucursal:GlobalEmpnit,
            codrep:GlobalCodUsuario
         })      
         .then((response) => {
                    if(response.status.toString()=='200'){
                        let data = response.data;
                        if(data.toString()=="error"){
                            reject();
                        }else{
                            if(Number(data.rowsAffected[0])>0){
                                resolve(data);             
                            }else{
                                reject();
                            } 
                        }       
                    }else{
                        reject();
                    }                   
                }, (error) => {
                    reject();
                });
            }) 


};

function get_tbl_embarques_pendientes(){

    let container = document.getElementById('tblEmbarques');
    container.innerHTML = GlobalLoader;

    get_data_embarques_pendientes()
    .then((data)=>{
        let str = ''; let strClassFinalizado = '';
        data.recordset.map((r)=>{
            if(r.FINALIZADO=='SI'){
                strClassFinalizado='border-danger bg-danger text-white'
            }else{
                strClassFinalizado='border-info'
            }
            str += `
            <div class="card card-rounded ${strClassFinalizado} col-12 hand shadow">
                <div class="card-body p-4 text-center" id="">
                    <h5 class="negrita text-info">${r.RUTA}</h5>    
                    <h5>${r.CODEMBARQUE}</h5>
                    <label class="negrita text-danger">Fecha: ${F.convertDateNormal(r.FECHA)}</label>
                    <div class="row">
                        <div class="col-6">
                            <button class="btn btn-secondary btn-lg hand shadow" onclick="get_mapa_embarque('${r.CODEMBARQUE}')">
                                <i class="fal fa-map"></i> Mapa
                            </button>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-info btn-lg hand shadow" onclick="get_data_embarque('${r.CODEMBARQUE}')">
                                <i class="fal fa-list"></i> Facturas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <br>
            `
        })
        container.innerHTML = str;
    })
    .catch((err)=>{
        console.log('embarque no cargados')
        console.log(err);
        container.innerHTML = 'No hay datos...';
    })

}


function get_data_embarque(codembarque){

    document.getElementById('tab-dos').click();

    document.getElementById('lbEmbarque').innerText = codembarque;


    get_tbl_documentos_embarque(codembarque);


};

function get_data_documentos_embarque(codembarque){

    return new Promise((resolve,reject)=>{
        console.log('intenta cargar...')

        axios.post('/repartidor/embarque_documentos',{
            sucursal:GlobalEmpnit,
            codembarque:codembarque
         })
         .then((response) => {
             console.log('pasa por aqui...')
             let data = response.data;
             /*
             if(Number(data.rowsAffected[0])>0){
                 resolve(data);             
             }else{
                 reject();
             } */            
             if(response=='error'){reject()}else{resolve(data)}
         }, (error) => {
            console.log('error en solicitud')
            console.log(error);
             reject();
         });


    })

};

function get_tbl_documentos_embarque(codembarque){

    let container = document.getElementById('tblDataDocumentos');
    container.innerHTML = GlobalLoader;


    get_data_documentos_embarque(codembarque)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `
            <tr>
                <td>
                    ${r.TIPONEGOCIO} ${r.NEGOCIO}
                    <br>
                    <small class="negrita text-info">${r.CLIENTE}</small>
                    <br>
                    <small>${r.DIRECCION},${r.MUNICIPIO}</small>
                    <br>
                    <small class="text-info">Doc:${r.CODDOC}-${r.CORRELATIVO}</small>
                    <br>
                    <small class="text-danger negrita">${r.VENDEDOR.toUpperCase()}</small>
                    <br>
                    <div class="row">
                        <div class="col-6">
                            <button class="btn btn-base btn-md hand shadow col-12"
                            onclick="get_detalle_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.TIPONEGOCIO}','${r.NEGOCIO}','${r.CLIENTE}')">
                                <i class="fal fa-list"></i>&nbsp Ver Detalle
                            </button>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-primary btn-md hand shadow col-12"
                            onclick="get_devolucion_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.TIPONEGOCIO}','${r.NEGOCIO}','${r.CLIENTE}')">
                                <i class="fal fa-download"></i>&nbsp Devolucion
                            </button>
                        </div>
                    </div>
                </td>
                <td>${F.setMoneda(r.IMPORTE,'Q')}
                    <br><br>
                    <button class="btn btn-circle btn-md hand shadow btn-info"
                    onclick="F.gotoGoogleMaps('${r.LAT}','${r.LONG}')">
                        <i class="fal fa-map-marker"></i>
                    </button>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
    })
    .catch(()=>{
        container.innerHTML = 'No hay datos...';
    })
};


function get_detalle_factura(coddoc,correlativo,tiponegocio,negocio,cliente){

    document.getElementById('tab-tres').click();


      let container = document.getElementById('tblDataDetalle');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;

    GF.get_data_detalle_documento(GlobalEmpnit,coddoc,correlativo)
    .then((data)=>{
        let str = "";

        data.recordset.map((r)=>{
            varTotal += Number(r.TOTALPRECIO);
            str += `
            <tr>
                <td>${r.DESPROD}
                    <br>
                    <small class="negrita text-danger">${r.CODPROD}</small>
                </td>
                <td>${r.CODMEDIDA}</td>
                <td>${r.CANTIDAD}</td>
                <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbDetalleTotal').innerHTML = F.setMoneda(varTotal,'Q');

    })
    .catch(()=>{
        container.innerHTML = 'No hay datos...';
        document.getElementById('lbDetalleTotal').innerHTML = '';

    })



};


function get_mapa_embarque(codembarque){

    document.getElementById('tab-cuatro').click();

    document.getElementById('lbEmbarqueMapa').innerText = codembarque;


    cargarMapaClientes(codembarque);


};

// mapa

function showUbicacion(){
    return new Promise((resolve,reject)=>{
        try {
            navigator.geolocation.getCurrentPosition(function (location) {
                console.log(location);
                resolve(location);
            })
        } catch (error) {
            reject();
        }
    })
};

function Lmap(lat,long){

    //INICIALIZACION DEL MAPA            
      var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(osmUrl, {center: [lat, long],maxZoom: 20, attribution: osmAttrib});    
      map = L.map('mapcontainer').setView([lat, long], 11).addLayer(osm);

      var userIcon = L.icon({
        iconUrl: '../img/userIcon.png',
        shadowUrl: '../img/marker-shadow.png',
    
        iconSize:     [30, 45], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

      L.marker([lat, long],{icon:userIcon})
        .addTo(map)
        .bindPopup('Mi Ubicación', {closeOnClick: true, autoClose: false})   
        .openPopup()
                
      return map;
};

function cargarMapaClientes(codembarque){

    document.getElementById('container_mapa').innerHTML = GlobalLoader;
    //carga la ubicación actual y general el mapa
    showUbicacion()
    .then((location)=>{
            let lat = location.coords.latitude.toString();
            let longg = location.coords.longitude.toString();
            //Number(lat),Number(longg));
            clientes_embarque(codembarque,'container_mapa',Number(lat),Number(longg))
            
    });

};


function clientes_embarque(codembarque,idContenedor, lt, lg){

    let container = document.getElementById(idContenedor);
    container.innerHTML = GlobalLoader;
    
    let tbl = `<div class="mapcontainer5" id="mapcontainer"></div>`;        
    
    container.innerHTML = tbl;
    
    let mapcargado = 0;
    var map;
    map = Lmap(lt, lg);

    get_data_documentos_embarque(codembarque)
    .then((response) => {
        const data = response.recordset;

        data.map((rows)=>{
           
                L.marker([rows.LAT, rows.LONG])
                .addTo(map)
                .bindPopup(`${rows.TIPONEGOCIO} ${rows.NEGOCIO}<br>${rows.CLIENTE}<br><small>${rows.DIRECCION}</small><br><small>${F.setMoneda(rows.IMPORTE,'Q')}</small>`, {closeOnClick: true, autoClose: true})   
                .on('click', function(e){
                    GlobalMarkerId = Number(e.sourceTarget._leaflet_id);
                    //agregar function 
                })
            
        })

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
    });
       
};



function get_devolucion_factura(coddoc,correlativo,tiponegocio,negocio,cliente){

    F.Aviso('En proceso');

};