
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_inicio() + view.modal_marcas_cliente()}

                            
                            <button class="btn btn-bottom-l btn-xl btn-circle btn-primary hand shadow"
                            onclick="Navegar.inicio()">
                                <i class="fal fa-home"></i>
                            </button>
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
        vista_inicio:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">
                    <div class="row">
                        <div class="col-6">
                            
                            <div class="form-group">
                                <label>Sucursal</label>
                                <select class="form-control" id="cmbSucursal">
                                </select>
                            </div>

                        </div>
                        <div class="col-6">
                            <h5 class="negrita text-success" id="lbTVisitadosMapa"></h5>
                            <h5 class="negrita text-danger" id="lbTNoVisitadosMapa"></h5>
                        </div>
                    </div>
                    
                </div>
            </div>
            <br>
          
                ${view.frag_mapa_visitas_vendedor()}
            `
        },
        frag_mapa_visitas_vendedor:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-4">
                    
                    <div class="row">
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            
                            <div class="form-group">
                                <label>Vendedor</label>
                                <select class="form-control" id="cmbEmpleado">
                                </select>
                            </div>

                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">

                            <div class="form-group">
                                <label>Fecha</label>
                                <input type="date" class="form-control" id="txtFecha">
                            </div>

                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            <div class="form-group">
                                <label>Fecha</label>
                                <select class="form-control negrita text-danger border-danger" id="cmbDiaCliente">
                                            <option value="LUNES">LUNES</option>
                                            <option value="MARTES">MARTES</option>
                                            <option value="MIERCOLES">MIERCOLES</option>
                                            <option value="JUEVES">JUEVES</option>
                                            <option value="VIERNES">VIERNES</option>
                                            <option value="SABADO">SABADO</option>
                                            <option value="DOMINGO">DOMINGO</option>
                                            <option value="OTROS">OTROS</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <br>
                    <div id="container_mapa">
                    </div>

                    
                
                </div>
            </div>
            `
        },
        modal_marcas_cliente:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" 
                role="dialog" aria-hidden="true" 
                id="modal_marcas_cliente">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-base d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Marcas del Mes
                            </h4>
                        </div>
                        <div class="modal-body p-2">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-2">

                                    <h5 class="text-danger" id="lbNomclieMarca"></h5>
                                    <h5 class="negrita text-danger" id="lbCodclieMarca"></h5>

                                    <h5 class="text-secondary">Marcas compradas por el cliente Mes en Curso</h5>

                                    <div class="table-responsive">

                                        <small>Total: </small>
                                        <h5 class="text-danger negrita" id="lbTotalClienteMarca"></h5>

                                        <table class="table table-bordered h-full col-12">
                                            <thead class="bg-secondary text-white">
                                                <tr>
                                                    <td>MARCA</td>
                                                    <td>TOTAL VENDIDO</td>
                                                </tr>
                                            </thead>
                                            <tbody id="tbl_data_marcas_cliente">
                                            </tbody>
                                        </table>

                                    </div>

                                </div>
                            </div>

                            <button class="btn btn-bottom-l btn-xl btn-secondary btn-circle hand shadow" data-dismiss="modal">
                                <i class="fal fa-arrow-left"></i>
                            </button>                              

                        </div>
                    </div>
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

    F.slideAnimationTabs();


    let cmbSucursal = document.getElementById('cmbSucursal');
    let f = new Date();
    document.getElementById('cmbDiaCliente').value = F.getDiaSemana(f.getDay());

    GF.get_data_empresas()
    .then((data)=>{

        let str = ``;

        data.recordset.map((r)=>{
            str += `<option value="${r.EMPNIT}">${r.NOMBRE}</option>`;
        })
        cmbSucursal.innerHTML = str; 
        
        switch (Number(GlobalNivelUsuario)) {
            case 1: //gerente
                break;
            case 5: //digitador
                cmbSucursal.value = GlobalEmpnit;
                break;
            case 7: //proveedor
                break;
        
            default:
                cmbSucursal.value = GlobalEmpnit;
                cmbSucursal.disabled = true;
                break;
        }

        get_empleados()
        .then(()=>{
             get_reportes(); 
        })
        .catch(()=>{

        })
      

    })
    .catch(()=>{
        cmbSucursal.innerHTML = `<option value="%">No se cargaron las sedes</option>`
    })

    document.getElementById('txtFecha').value = F.getFecha();

    cmbSucursal.addEventListener('change',()=>{
         get_empleados()
        .then(()=>{
             get_reportes(); 
        })
        .catch(()=>{

        })
    });
    document.getElementById('cmbEmpleado').addEventListener('change',()=>{
        get_reportes();
    });
    document.getElementById('cmbDiaCliente').addEventListener('change',()=>{
        get_reportes();
    });

    document.getElementById('txtFecha').addEventListener('change',()=>{
        document.getElementById('cmbDiaCliente').value = F.devuelve_dia_semana('txtFecha');
        get_reportes();
    })

    

};

function initView(){

    getView();
    addListeners();

};

function get_empleados(){

    return new Promise((resolve, reject) => {
        

            let sucursal = document.getElementById('cmbSucursal').value;

            GF.get_data_empleados_tipo_emp(3,sucursal)
            .then((data)=>{
                let str = `<option value='TODOS'>TODOS</option>`;
                data.recordset.map((r)=>{
                    str += `<option value='${r.CODEMPLEADO}'>${r.NOMEMPLEADO}</option>`
                })
                document.getElementById('cmbEmpleado').innerHTML = str;
                resolve();
            })
            .catch(()=>{
                document.getElementById('cmbEmpleado').innerHTML = '';
                reject();
            })


    })


};


function get_reportes(){

    get_visitas_dia_vendedor();


};


function get_visitas_dia_vendedor(){

     let container = document.getElementById('container_mapa');
    container.innerHTML = '';
    container.innerHTML = `<div class="mapcontainer5" id="mapcontainer"></div>`;

    let dia = document.getElementById('cmbDiaCliente').value;

    let varTotalVisitados = 0;
    let varTotalNoVisitados = 0;
    let contador = 0;
    let latInicial =0, longInicial = 0;

    let codemp = document.getElementById('cmbEmpleado').value;
    let fecha = F.devuelveFecha('txtFecha');

    //-----------------------------------------------
    //personalizacion de marcadores
           
            //clase con opciones del icono
            var LeafIcon = L.Icon.extend({
                options: {
                        shadowUrl: './libs/leaflet/images/marker-shadow.png',
                        iconSize: [18, 35],
                        shadowSize: [0, 0],
                        iconAnchor: [20, 92],
                        shadowAnchor: [4, 62],
                        popupAnchor: [-3, -76]
                }
            });

            //iconSize: [38, 95]
            //iconAnchor: [22, 94]

            var greenIcon = new LeafIcon({iconUrl: './libs/leaflet/images/marker-icon-green.png'}),
                redIcon = new LeafIcon({iconUrl: './libs/leaflet/images/marker-icon-red.png'}),
                blueIcon = new LeafIcon({iconUrl: './libs/leaflet/images/marker-icon.png'}),
                userIcon = new LeafIcon({iconUrl: './libs/leaflet/images/marker-user.png'});
        
        //-----------------------------------------------
        //-----------------------------------------------


    try {
        navigator.geolocation.getCurrentPosition(function (location) {
            
            lat = location.coords.latitude.toString();
            long = location.coords.longitude.toString();

            var map = L.map('mapcontainer').setView([Number(lat), Number(long)], 10);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            //agrego la ubicacion del usuario
            //L.marker([Number(lat), Number(long)],{icon: userIcon})
                //.addTo(map)
                //.bindPopup(`${GlobalUsuario}`, {closeOnClick: false, autoClose: false})
                //.openPopup();


            //agrega los marcadores al mapa

            

            data_visitas_vendedor(codemp,fecha,dia)
            .then((data)=>{

                data.recordset.map((r)=>{
                    
                    contador+=1;
                    if(Number(contador)==1){latInicial = Number(r.LATITUD); longInicial=Number(r.LONGITUD)};
                    if(latInicial==0){contador= contador-1};

                    let icono;
                    
                    if(F.convertir_fecha(r.LASTSALE,'-').toString()==F.devuelveFecha2('txtFecha')){
                        varTotalVisitados+=1
                         icono = greenIcon;
                    }else{
                        varTotalNoVisitados +=1;
                        icono = redIcon;
                    };

                    
                         L.marker([Number(r.LATITUD), Number(r.LONGITUD)],{icon: icono})
                            .addTo(map)
                            .bindPopup(`${r.TIPONEGOCIO}-${r.NEGOCIO}, ${r.NOMBRE}<br><small>${F.limpiarTexto(r.DIRECCION)}</small>`, {closeOnClick: false, autoClose: true})
                            .on('click', function(e){
                                get_marcas_cliente(r.CODCLIENTE,r.NOMBRE)
                            })
                            //.openPopup();

                  

                })

                document.getElementById('lbTVisitadosMapa').innerText = `Vendido: ${varTotalVisitados}`;
                document.getElementById('lbTNoVisitadosMapa').innerText = `No Vendido: ${varTotalNoVisitados}`;


                

                //map.invalidateSize(true);
                setTimeout(function(){ map.invalidateSize();map.flyTo([latInicial,longInicial],10);}, 400)

            })
            .catch(()=>{
                container.innerHTML = 'No se cargaron datos...';
                 document.getElementById('lbTVisitadosMapa').innerText = ``;
                document.getElementById('lbTNoVisitadosMapa').innerText = ``;
            })


             

                               
        })
    } catch (error) {
            F.AvisoError(error.toString());
    };



};

function data_visitas_vendedor(codven,fecha,dia){

     let cmbSucursal = document.getElementById('cmbSucursal').value;
   

    return new Promise((resolve, reject) => {
        

            axios.post('/clientes/buscar_cliente_vendedor_supervisor', {
                token:TOKEN,
                sucursal: cmbSucursal,
                dia:dia,
                codven:codven,
                fecha:fecha
            })
             .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;

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
            })
            .catch(()=>{
                reject();
            })
   

    })

};

function get_marcas_cliente(codclie, nomclie){

    
    $("#modal_marcas_cliente").modal('show');

    document.getElementById('lbNomclieMarca').innerText = nomclie;
    document.getElementById('lbCodclieMarca').innerText = codclie;
    

    let container = document.getElementById('tbl_data_marcas_cliente');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;

    let fecha = F.devuelveFecha('txtFecha');

    GF.get_data_marcas_cliente(GlobalEmpnit,codclie,fecha)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            let strClass = '';
            if(Number(r.TOTALPRECIO)==0){strClass='bg-nologrado'}else{strClass='bg-logrado'};
            varTotal += Number(r.TOTALPRECIO);
            str += `
                <tr class="${strClass}">
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalClienteMarca').innerText = F.setMoneda(varTotal,'Q');

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
        document.getElementById('lbTotalClienteMarca').innerText = 'Q 0.00';
    })

    



};
