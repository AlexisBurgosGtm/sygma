function getView(){
    let view = {
        tabsClientes :()=>{
            return `
            <div class="panel-container show">
                <div class="panel-content">
                   
                    <div class="tab-content py-3">

                        <div class="tab-pane fade active show" id="uno" role="tabpanel">
                        
                           ${view.listado()}

                        </div>
                        
                        <div class="tab-pane fade" id="dos" role="tabpanel">
                             ${view.formNuevo()}

                        </div>

                        <div class="tab-pane fade" id="tres" role="tabpanel">
                            <div class="mapcontainer2 col-12" id="mapcontainer"></div>
                            <div class="shortcut-menu align-left">
                                <button class="btn btn-info btn-circle btn-xl" id="btnNuevoClienteUbicacion">
                                    <i class="fal fa-check"></i>
                                </button>
                            </div>
                        </div>
   
                    </div>

                    <ul class="nav nav-pills nav-justified" role="tablist">
                        <li class="nav-item hidden"><a class="nav-link active" data-toggle="tab" href="#uno" id="tab-uno"></a></li>
                        <li class="nav-item hidden"><a class="nav-link" data-toggle="tab" href="#dos" id="tab-dos"></a></li>
                        <li class="nav-item hidden"><a class="nav-link" data-toggle="tab" href="#tres" id="tab-tres"></a></li>
                    </ul>

                </div>
            </div>
            `
        },
        listado: ()=>{
            return `
            <div class="card card-rounded shadow col-12 p-4">
                <div class="card-body">
                
                        <div class="form-group">
                            <label class="negrita text-secondary">Filtros</label>
                            <div class="input-group">
                                <select class="form-control negrita" id="cmbVisita">
                                </select>
                                <select class="form-control negrita" id="cmbVendedor">
                                </select>
                            </div>
                        
                        </div>

                        <div class="form-group">
                            <label class="negrita text-secondary">Escriba para buscar</label>
                            <input type="text" class="negrita text-secondary form-control" id="txtBuscar">
                           
                        </div>

                        <div class="table-responsive">

                            <table class="table h-full col-12 table-striped" id="tblClientes">
                                <thead class="bg-secondary text-white negrita">
                                    <tr>
                                        <td>VENDEDOR</td>
                                        <td>CLIENTE / DIRECCION</td>
                                        <td>MUNICIPIO</td>
                                        <td>CREADO</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataClientes"></tbody>
                            
                            </table>

                        </div>
                
                </div>
            </div>

            <button class="btn btn-success btn-bottom-r btn-xl btn-circle hand shadow" id="btnNuevo">
                <i class="fal fa-plus"></i>
            </button>

            `
        },
        formNuevo:()=>{
            return `
                            <div class="card shadow col-sm-12 col-md-6 col-xl-5 col-lg-5 card-rounded p-4">
                                 
                                <div class="form-group">
                                    <label class="negrita text-secondary">VENDEDOR</label>
                                    <select id="cmbVendedorCliente" class="form-control"></select>
                                </div>

                                <div class="row">
                                    
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label class="negrita text-secondary">NIT:</label>
                                            <input id="txtNit" class="form-control" type="text" placeholder="Escriba el NIT ..."  maxlenght="20">
                                        </div>    
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label class="negrita text-secondary">Visita:</label>
                                            <select id="cmbVisitaCliente" class="form-control"></select>
                                        </div>    
                                    </div>   
                                    
                                </div>
                                <br>
                                
                                <div class="form-group">
                                    <label class="negrita text-secondary">Giro de Negocio:</label>
                                    <select id="cmbTipoNegocio" class="form-control"></select>    
                                </div>

                                <div class="form-group">
                                    <label class="negrita text-secondary">Nombre del Negocio:</label>
                                    <input id="txtNegocio" class="form-control" type="text" placeholder="nombre del negocio"  maxlenght="150">    
                                </div>
                   
                                <br>
                                <div class="form-group">
                                    <label class="negrita text-secondary">Nombre y Apellido:</label>
                                    <input id="txtNomcliente" class="form-control" type="text" maxlenght="200" placeholder="nombre completo">
                                </div>

                                <div class="form-group">
                                    <label class="negrita text-secondary">Dirección:</label>
                                    <input id="txtDircliente" class="form-control" type="text" maxlenght="250" placeholder="Dirección cliente...">
                                </div>
                                <br>
                                
                                <div class="form-group">
                                    <label class="negrita text-secondary">Referencia:</label>
                                    <input id="txtReferencia" class="form-control" type="text" maxlenght="250" placeholder="Referencia del cliente...">
                                </div>
                                <br>

                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label class="negrita text-secondary">Departamento:</label>
                                            <select id="cmbDepartamento" class="form-control">
                                            </select>
                                        </div>   

                                       
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label class="negrita text-secondary">Municipio:</label>
                                            <select id="cmbMunicipio" class="form-control">
                                            </select>
                                        </div>    
                                    </div>
                                </div>

                                <br>

                               <div class="form-group">
                                    <label class="negrita text-secondary">Sector / aldea:</label>
                                    <select id="cmbSector" class="form-control">
                                    </select>
                                </div> 
                                
                                <br>

                                <div class="row">
                                    <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    
                                        <div class="form-group">
                                            <label class="negrita text-secondary">Telefonos:</label>
                                            <input id="txtTelefono"  maxlength="8" class="form-control" type="number" placeholder="Telefono cliente">
                                        </div>
                                    
                                    </div>
                                </div>
                                

                                <br>

                                <div class="row">
                                    <div class="col-5">
                                        <div class="form-group">
                                            <label class="negrita text-secondary">Latitud:</label>
                                            <label class="text-info" id="txtLatitud">0</label>
                                        </div>
                                    </div>
                                    <div class="col-5">
                                        <div class="form-group">
                                            <label class="negrita text-secondary">Longitud:</label>
                                            <label class="text-info" id="txtLongitud">0</label>
                                        </div>
                                    </div>
                                    <div class="col-2">
                                        <div class="form-group">
                                            <button class="btn btn-circle btn-danger" id="btnUbicacion">
                                                <i class="fal fa-map-marker"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <br>
                                <br>
                                <div class="row">
                                    <div class="col-6" align="right">
                                       
                                    </div>
                                    <div class="col-6" align="right">
                                        <button id="btnGuardar" class="btn btn-info btn-xl btn-circle shadow">
                                            <i class="fal fa-save"></i>
                                        </button>
                                    </div>
                                </div>
                                <br><br>
                            </div>

                            <button class="btn btn-secondary btn-bottom-l btn-xl btn-circle hand shadow" onclick="document.getElementById('tab-uno').click()">
                                <i class="fal fa-arrow-left"></i>
                            </button>
            `
        },
    };

    root.innerHTML = view.tabsClientes();
    //document.getElementById('panelNuevo').innerHTML = view.formNuevo();
};

async function addListeners(){

    GlobalBool = false;

    //inicializa la animación en las tabs
    F.slideAnimationTabs();

    document.getElementById('cmbVendedor').disabled = true;
    document.getElementById('cmbVendedorCliente').disabled = true;
    
    
    let cmbVisita = document.getElementById('cmbVisita');
    cmbVisita.innerHTML = '<option value="TODOS">TODOS</option>' + F.ComboSemana("LETRAS");

    cmbVisita.addEventListener('change',()=>{

        tbl_clientes();

    });

        
    let cmbVisitaCliente = document.getElementById('cmbVisitaCliente');
    cmbVisitaCliente.innerHTML = F.ComboSemana("LETRAS");

    let cmbTipoNegocio = document.getElementById('cmbTipoNegocio')
    cmbTipoNegocio.innerHTML = F.getComboTipoClientes();

    let f = new Date();
    cmbVisitaCliente.value = F.getDiaSemana(f.getDay());
    cmbVisita.value = F.getDiaSemana(f.getDay());

    
    let btnUbicacion = document.getElementById('btnUbicacion');
    btnUbicacion.addEventListener('click',()=>{
        document.getElementById('tab-tres').click();
        //RE-AJUSTA EL MAPA A LA PANTALLA
        setTimeout(function () {
            try {
                map.invalidateSize();    
            } catch (error) {
                
            }
        }, 500);
    });


    document.getElementById('btnNuevoClienteUbicacion').addEventListener('click',()=>{

        document.getElementById('tab-dos').click();

    });




    //carga la ubicación actual y general el mapa
    showUbicacion()
    .then((location)=>{
            let lat = location.coords.latitude.toString();
            let longg = location.coords.longitude.toString();
            map = Lmap(Number(lat),Number(longg));
    });

    
    document.getElementById('btnNuevo').addEventListener('click',()=>{


        fcnCleanDataCliente();

        document.getElementById('tab-dos').click();



    });




    get_combos_mun_deptos('cmbMunicipio','cmbDepartamento','cmbSector');

    get_empleados();

    document.getElementById('change',()=>{
        tbl_clientes();
    })
    
    document.getElementById('cmbDepartamento').addEventListener('change',()=>{

    
        let contenedor = document.getElementById('cmbMunicipio');
        let strdata = '';
        
        let contenedor3 = document.getElementById('cmbSector');
        let strdata3 = '';


        get_municipios(document.getElementById('cmbDepartamento').value)
        .then((data)=>{
            data.recordset.map((rows)=>{
                    strdata = strdata + `<option value='${rows.CODIGO}'>${rows.DESCRIPCION}</option>`
            })
            contenedor.innerHTML = strdata;

                get_sectores(contenedor.value)
                .then((data)=>{
                    data.recordset.map((rows)=>{
                            strdata3 = strdata3 + `<option value='${rows.CODIGO}'>${rows.DESCRIPCION}</option>`
                    })
                    contenedor3.innerHTML = strdata3;
                })
                .catch(()=>{
                    contenedor3.innerHTML = `<option value='0'>NO SE CARGARON</option>`
                })
        })
        .catch(()=>{
            contenedor.innerHTML = `<option value='0'>NO SE CARGARON</option>`
        })


    });


    document.getElementById('cmbMunicipio').addEventListener('change',()=>{

        let contenedor3 = document.getElementById('cmbSector');
        let strdata3 = '';


        get_sectores(document.getElementById('cmbMunicipio').value)
        .then((data)=>{
            data.recordset.map((rows)=>{
                    strdata3 = strdata3 + `<option value='${rows.CODIGO}'>${rows.DESCRIPCION}</option>`
            })
            contenedor3.innerHTML = strdata3;
        })
        .catch(()=>{
            contenedor3.innerHTML = `<option value='0'>NO SE CARGARON</option>`
        })


    })


    
    
    let btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click',()=>{

     

            document.getElementById('btnGuardar').innerHTML = GlobalLoader; 

                
                document.getElementById('btnGuardar').innerHTML = '<i class="fal fa-save"></i>';

                F.Confirmacion('¿Está seguro que desea GUARDAR este Cliente?')
                .then((value)=>{
                    if(value==true){

                        document.getElementById('btnGuardar').disabled = true;
                        document.getElementById('btnGuardar').innerHTML = '<i class="fal fa-save fa-spin"></i>'; 
                        
                        fcnGuardarCliente()
                        .then(()=>{
                           
                           
                            F.Aviso('Cliente Creado exitosamente!!');

                            document.getElementById('btnGuardar').disabled = false;
                            document.getElementById('btnGuardar').innerHTML = '<i class="fal fa-save"></i>';


                            document.getElementById('tab-uno').click();

                            fcnCleanDataCliente();
                            
                            tbl_clientes();
                           

                        })
                        .catch(()=>{

                            F.AvisoError('Error al guardar el cliente');

                            document.getElementById('btnGuardar').disabled = false;
                            document.getElementById('btnGuardar').innerHTML = '<i class="fal fa-save"></i>';

                        })
                        
                    }
                })
        
    });





};



//funcion para enviar el cliente online
function fcnGuardarCliente(){  
    
    return new Promise((resolve,reject)=>{

        let txtNit = document.getElementById('txtNit');
        let cmbTipoNegocio = document.getElementById('cmbTipoNegocio');
        let cmbVisitaCliente = document.getElementById('cmbVisitaCliente');
        let txtNegocio = document.getElementById('txtNegocio'); 
        let nomclie = document.getElementById('txtNomcliente').value || '';
        let dirclie = document.getElementById('txtDircliente').value || 'CIUDAD';
        let txtReferencia = document.getElementById('txtReferencia');
        let cmbMunicipio = document.getElementById('cmbMunicipio');
        let cmbDepartamento = document.getElementById('cmbDepartamento');
        let cmbSector = document.getElementById('cmbSector');
        let cmbVendedor = document.getElementById('cmbVendedorCliente');
        let txtTelefono = document.getElementById('txtTelefono');
        let txtLatitud = document.getElementById('txtLatitud');
        let txtLongitud = document.getElementById('txtLongitud');
        let codruta = 1;


        if(nomclie==''){F.AvisoError('Escriba un nombre de cliente');return;}
       
   
        axios.post('/clientes/censo_insert',{
            sucursal:GlobalEmpnit,
            codven:cmbVendedor.value,
            codruta:codruta,
            sector: cmbSector.value,
            fecha:F.getFecha(),
            tiponegocio:cmbTipoNegocio.value,
            nitclie:txtNit.value,
            negocio: F.limpiarTexto(txtNegocio.value),
            nomclie: F.limpiarTexto(nomclie), 
            dirclie: F.limpiarTexto(dirclie), 
            codmun:cmbMunicipio.value,
            coddepto:cmbDepartamento.value,
            referencia: F.limpiarTexto(txtReferencia.value), 
            telefono:txtTelefono.value,
            visita:cmbVisitaCliente.value,
            lat:txtLatitud.innerText,
            long:txtLongitud.innerText
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
            console.log(error);
            reject();
        });      


    });
};

function get_empleados(){

    
    GF.get_data_empleados_tipo(3)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            str += `<option value='${r.CODEMPLEADO}'>${r.NOMEMPLEADO}</option>`
        })

        document.getElementById('cmbVendedor').innerHTML = str;
        document.getElementById('cmbVendedorCliente').innerHTML = str;

        document.getElementById('cmbVendedor').value = GlobalCodUsuario;
        document.getElementById('cmbVendedorCliente').value = GlobalCodUsuario;

        //carga la lista de clientes luego de tener al primer vendedor
        tbl_clientes();


    })
    .catch(()=>{

        document.getElementById('cmbVendedor').innerHTML = '';
        document.getElementById('cmbVendedorCliente').innerHTML = '';

    })




}



function fcnCleanDataCliente(){
    
            document.getElementById('txtNit').value = "CF";
            //document.getElementById('txtCodigo').value = "";
            //document.getElementById('cmbTipoNegocio').value = "TIENDITA";
            document.getElementById('txtNegocio').value = ""; 
            document.getElementById('txtNomcliente').value = "";
            document.getElementById('txtDircliente').value = "";
            document.getElementById('txtReferencia').value = "";
            document.getElementById('txtTelefono').value = "";
           // document.getElementById('txtObs').value = "SN";

};

function showUbicacion(){
    //let lat ='0'; let longg = '0';
    return new Promise((resolve,reject)=>{
        try {
            navigator.geolocation.getCurrentPosition(function (location) {
                //lat = location.coords.latitude.toString();
                //longg = location.coords.longitude.toString();
                resolve(location);
                //map = Lmap(Number(lat),Number(long));
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
      let mapa = L.map('mapcontainer').setView([lat, long], 18).addLayer(osm);

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
  
};

function InicializarVista(){
    getView();
    addListeners();
};

function iniciarMapa(){
    
    try {
        navigator.geolocation.getCurrentPosition(function (location) {
            lat = location.coords.latitude.toString();
            long = location.coords.longitude.toString();
            var map = L.map('map').setView([Number(lat), Number(long)], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            L.marker([51.5, -0.09]).addTo(map)
                .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
                .openPopup();
        })
    } catch (error) {
        F.AvisoError(error.toString());
    }

    
    
};



function get_combos_mun_deptos(idContainerMun,idcontainerDep,idcontainerSec){



    let contenedor = document.getElementById(idContainerMun);
    let strdata = '';
    

    let contenedor2 = document.getElementById(idcontainerDep);
    let strdata2 = '';
   
    let contenedor3 = document.getElementById(idcontainerSec);
    let strdata3 = '';


    

    get_departamentos()
    .then((data)=>{
        data.recordset.map((rows)=>{
                strdata2 = strdata2 + `<option value='${rows.CODIGO}'>${rows.DESCRIPCION}</option>`
        })
        contenedor2.innerHTML = strdata2;

        get_municipios(contenedor2.value)
        .then((data)=>{
            data.recordset.map((rows)=>{
                    strdata = strdata + `<option value='${rows.CODIGO}'>${rows.DESCRIPCION}</option>`
            })
            contenedor.innerHTML = strdata;

                get_sectores(contenedor.value)
                .then((data)=>{
                    data.recordset.map((rows)=>{
                            strdata3 = strdata3 + `<option value='${rows.CODIGO}'>${rows.DESCRIPCION}</option>`
                    })
                    contenedor3.innerHTML = strdata3;
                })
                .catch(()=>{
                    contenedor3.innerHTML = `<option value='0'>NO SE CARGARON</option>`
                })
        })
        .catch(()=>{
            contenedor.innerHTML = `<option value='0'>NO SE CARGARON</option>`
        })
        
    })
    .catch(()=>{
        contenedor2.innerHTML = `<option value='0'>NO SE CARGARON</option>`
    })


  
  
};

function get_municipios(coddepto){
    return new Promise((resolve,reject)=>{

        axios.post('/clientes/municipios', {
            sucursal: GlobalEmpnit,
            coddepto: coddepto
        })  
        .then(async(response) => {
            const data = response.data;
            if(Number(data.rowsAffected[0])==0){
                reject();
            }else{  
                resolve(data);
            }
        }, (error) => {
           reject();
        });

    })
}

function get_sectores(codmun){
    return new Promise((resolve,reject)=>{

        axios.post('/clientes/sectores', {
            sucursal: GlobalEmpnit,
            codmun: codmun
        })  
        .then(async(response) => {
            const data = response.data;
            if(Number(data.rowsAffected[0])==0){
                reject();
            }else{  
                resolve(data);
            }
        }, (error) => {
           reject();
        });

    })
}

function get_departamentos(){
    return new Promise((resolve,reject)=>{

        axios.post('/clientes/departamentos', {
            sucursal: GlobalEmpnit
        })  
        .then(async(response) => {
            const data = response.data;
            if(Number(data.rowsAffected[0])==0){
                reject();
            }else{  
                resolve(data);
            }
        }, (error) => {
           reject();
        });

    })
}


function get_data_clientes(visita,codven){
    return new Promise((resolve,reject)=>{

        axios.post('/clientes/censo_lista_clientes', {
            sucursal: GlobalEmpnit,
            codven: codven,
            visita:visita
        })  
        .then(async(response) => {
            const data = response.data;
            if(Number(data.rowsAffected[0])==0){
                reject();
            }else{  
                resolve(data);
            }
        }, (error) => {
           reject();
        });

    })
}

function tbl_clientes(){


        let codven = document.getElementById('cmbVendedor').value;
        let visita = document.getElementById('cmbVisita').value;

        let container = document.getElementById('tblDataClientes');
        container.innerHTML = GlobalLoader;


        get_data_clientes(visita,codven)
        .then((data)=>{

            let str = '';

          

            data.recordset.map((r)=>{
                let idbtn = 'btnE' + r.CODCLIENTE.toString()
                str += `
                        <tr>
                            <td>${r.NIT}
                            <br>
                                <small class='negrita'>${r.VISITA}</small>
                            </td>
                            <td>${r.NOMBRE}
                                <br>
                                <small>${r.DIRECCION}</small>
                                <br>
                                <small>${r.REFERENCIA}</small>
                                <br>
                                <small>TEL: ${r.TELEFONO}</small>
                            </td>
                            <td>
                                <small>${r.DESSECTOR}</small>
                                <br>
                                <small>${r.DESMUN}</small>
                                <br>
                                <small>${r.DESDEPTO}</small>
                            </td>
                            <td>${F.convertDateNormal(r.LASTSALE)}</td>
                            <td>
                                <button id='${idbtn}' class="btn btn-circle btn-md btn-danger hand shadow" 
                                    onclick="delete_cliente_censo('${r.CODCLIENTE}','${idbtn}')">
                                    <i class="fal fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        `
            })

            container.innerHTML = str;


        })
        .catch((error)=>{
            console.log(error)
            container.innerHTML = 'No hay datos...';
        })




};


function delete_cliente_censo(codclie,idbtn){

    let btn = document.getElementById(idbtn);
    

    F.Confirmacion('¿Está seguro que desea ELIMINAR este cliente?')
    .then((value)=>{
        if(value==true){

            btn.innerHTML = `<i class="fal fa-trash fa-spin"></i>`;
            btn.disabled = true;

            
            delete_clientes(codclie)
            .then(()=>{
                F.Aviso('Cliente eliminado exitosamente!!');
                tbl_clientes();
            })
            .catch(()=>{
                F.AvisoError('No se pudo eliminar');
                btn.innerHTML = `<i class="fal fa-trash"></i>`;
                btn.disabled = false;
            })


        }
    })


};


function delete_clientes(codcliente){
    return new Promise((resolve,reject)=>{

        axios.post('/clientes/censo_delete_cliente', {
            sucursal: GlobalEmpnit,
            codclie: codcliente
        })  
        .then(async(response) => {
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
}