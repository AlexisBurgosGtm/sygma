
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.inicio()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            
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
                    </ul>
                    
                </div>
               
            `
        },
        inicio:()=>{
            return `
            <div class="row">
                ${view.partial_encabezado()}
            </div>
            
            <br>
            
            <div class="row">
                <div class="col-sm-12 col-md-7 col-lg-7 col-xl-7">
                    ${view.partial_mapa()}
                </div>
                <div class="col-sm-12 col-md-5 col-lg-5 col-xl-5">
                    ${view.partial_detalle()}
                </div>
            </div>



            <button class="btn btn-bottom-l btn-secondary btn-circle btn-xl hand shadow" 
            onclick="Navegar.inicio()">
                <i class="fal fa-home"></i>
            </button>

            `
        },
        partial_encabezado:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-2">

                    <div class="form-group">
                        <label>Seleccione sede y mes</label>
                        <div class="input-group">
                            <select class="form-control" id="cmbSucursal">
                            </select>
                            <select class="form-control" id="cmbMes">
                            </select>
                            <select class="form-control" id="cmbAnio">
                            </select>
                        </div>
                    </div>

                </div>
            </div>
            `
        },
        partial_mapa:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-2">

                    <div class="" id="mapa"></div>

                </div>
            </div>
            `
        },
        partial_detalle:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-2">
                
                

                </div>
            </div>
            `
        },
        modal:()=>{
            return `
              <div id="modal_" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                TITULO
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-2">

                                </div>
                            </div>

                                
                            <div class="row">
                                <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                    <i class="fal fa-arrow-left"></i>
                                </button>
                            </div>

                        </div>
                    
                    </div>
                </div>
            </div>
            `
        }
    }

    root.innerHTML = view.body();

};

function addListeners(){



    // -------------------
    // parametros
    // -------------------
    document.getElementById('cmbMes').innerHTML = F.ComboMeses(); document.getElementById('cmbMes').value = F.get_mes_curso();
    document.getElementById('cmbAnio').innerHTML = F.ComboAnio(); document.getElementById('cmbAnio').value = F.get_anio_curso();

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
            cmbSucursal.value = GlobalEmpnit;

            get_grid();
           
    })
    .catch(()=>{
        cmbSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
    });

    cmbSucursal.addEventListener('change',()=>{
        get_grid();
    });

    document.getElementById('cmbMes').addEventListener('change',()=>{
        get_grid();
    });
    document.getElementById('cmbAnio').addEventListener('change',()=>{
        get_grid();
    });

    // -------------------
    // parametros
    // -------------------



};

function initView(){

    getView();
    addListeners();

};

function get_grid(){

    get_empleados();

};


// mapa

function Lmap(lat,long){
    //INICIALIZACION DEL MAPA            
      var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(osmUrl, {center: [lat, long],maxZoom: 20, attribution: osmAttrib});    
      let mapa = L.map('mapcontainer').setView([lat, long], 18).addLayer(osm);

    return mapa;

    /*
      L.marker([lat, long], {draggable:'true'})
        .addTo(mapa)
        .bindPopup(`Marque la posición GPS del cliente nuevo`, {closeOnClick: false, autoClose: false})
        .openPopup()
        .on("dragend",function(e) {
            this.openPopup();
            var position = e.target._latlng;
            //console.log(e.target._latlng);
            //obtiene la posición del evento
            document.getElementById('txtLatitud').innerText = position.lat;
            document.getElementById('txtLongitud').innerText = position.lng;
           });
     
    //establece las coordenadas iniciales en los labels
    document.getElementById('txtLatitud').innerText = lat.toString();
    document.getElementById('txtLongitud').innerText = long.toString();
    
    return mapa;
    */

};

function get_empleados(){

    document.getElementById('mapa').innerHTML = '';

    document.getElementById('mapa').innerHTML = `<div class="mapcontainer_localizaciones" id="mapcontainer"></div>`;
    
    try {
        navigator.geolocation.getCurrentPosition(function (location) {
            lat = location.coords.latitude.toString();
            long = location.coords.longitude.toString();

            var map = L.map('mapcontainer').setView([Number(lat), Number(long)], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            let sucursal = document.getElementById('cmbSucursal').value;

            GF.get_data_empleados_localizacion(sucursal)
            .then((data)=>{

                data.recordset.map((r)=>{

                L.marker([Number(r.LATITUD), Number(r.LONGITUD)])
                    .addTo(map)
                    .bindPopup(`${r.EMPLEADO} - HORA: ${r.HORA} FECHA: ${F.convertir_fecha(r.FECHA,'/')}`, {closeOnClick: false, autoClose: false})
                    .openPopup();

                })
             

            })
            .catch(()=>{


            })

            


        })
    } catch (error) {
        F.AvisoError(error.toString());
    }
    
    
};

// mapa

