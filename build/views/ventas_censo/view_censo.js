function getView(){
    let view = {
        tabsClientes :()=>{
            return `
            <div class="panel-container show">
                <div class="panel-content">
                   
                    <div class="tab-content py-3">

                        <div class="tab-pane fade active show" id="panelListado" role="tabpanel">
                        
                           ${view.listado()}

                        </div>
                        
                        <div class="tab-pane fade" id="panelNuevo" role="tabpanel">
                             ${view.formNuevo()}

                        </div>

                        <div class="tab-pane fade" id="panelUbicacion" role="tabpanel">
                            <div class="mapcontainer2 col-12" id="mapcontainer"></div>
                            <div class="shortcut-menu align-left">
                                <button class="btn btn-info btn-circle btn-xl" id="btnNuevoClienteUbicacion">
                                    <i class="fal fa-check"></i>
                                </button>
                            </div>
                        </div>
   
                    </div>

                    <ul class="nav nav-pills nav-justified" role="tablist">
                        <li class="nav-item hidden"><a class="nav-link active" data-toggle="tab" href="#panelListado" id="btnTabListado"></a></li>
                        <li class="nav-item hidden"><a class="nav-link" data-toggle="tab" href="#panelNuevo" id="btnTabNuevo"></a></li>
                        <li class="nav-item hidden"><a class="nav-link" data-toggle="tab" href="#panelUbicacion" id="btnTabUbicacion"></a></li>
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
                            <label class="negrita"></label>
                            <input type="text" class="negrita text-secondary" id="txtBuscar">
                        </div>

                        <div class="table-responsive">

                            <table class="table h-full col-12 table-striped">
                                <thead>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </thead>
                            
                            </table>

                        </div>
                
                </div>
            </div>
            `
        },
        formNuevo:()=>{
            return `
                            <div class="card shadow col-sm-12 col-md-6 col-xl-5 col-lg-5 card-rounded p-4">
                                 
                                <div class="row">
                                    
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label>NIT:</label>
                                            <input id="txtNit" class="form-control" type="text" placeholder="Escriba el NIT ..."  maxlenght="20">
                                        </div>    
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label>Visita:</label>
                                            <select id="cmbVisitaCliente" class="form-control"></select>
                                        </div>    
                                    </div>   
                                    
                                </div>
                                <br>
                                
                                <div class="form-group">
                                    <label>Giro de Negocio:</label>
                                    <select id="cmbTipoNegocio" class="form-control"></select>    
                                </div>

                                <div class="form-group">
                                    <label>Nombre del Negocio:</label>
                                    <input id="txtNegocio" class="form-control" type="text" placeholder="nombre del negocio"  maxlenght="150">    
                                </div>
                   
                                <br>
                                <div class="form-group">
                                    <label>Nombre y Apellido:</label>
                                    <input id="txtNomcliente" class="form-control" type="text" maxlenght="200" placeholder="nombre completo">
                                </div>

                                <div class="form-group">
                                    <label>Dirección:</label>
                                    <input id="txtDircliente" class="form-control" type="text" maxlenght="250" placeholder="Dirección cliente...">
                                </div>
                                <br>
                                
                                <div class="form-group">
                                    <label>Referencia:</label>
                                    <input id="txtReferencia" class="form-control" type="text" maxlenght="250" placeholder="Referencia del cliente...">
                                </div>
                                <br>

                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label>Municipio:</label>
                                            <select id="cmbMunicipio" class="form-control">
                                            </select>
                                        </div>    
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label>Departamento:</label>
                                            <select id="cmbDepartamento" class="form-control">
                                            </select>
                                        </div>    
                                    </div>
                                </div>

                                <br>

                                <div class="row">
                                    <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    
                                        <div class="form-group">
                                            <label>Telefonos:</label>
                                            <input id="txtTelefono"  maxlength="8" class="form-control" type="number" placeholder="Telefono cliente">
                                        </div>
                                    
                                    </div>
                                </div>
                                

                                <br>

                                <div class="row">
                                    <div class="col-5">
                                        <div class="form-group">
                                            <label>Latitud:</label>
                                            <label class="text-info" id="txtLatitud">0</label>
                                        </div>
                                    </div>
                                    <div class="col-5">
                                        <div class="form-group">
                                            <label>Longitud:</label>
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
            `
        },
    };

    root.innerHTML = view.tabsClientes();
    document.getElementById('panelNuevo').innerHTML = view.formNuevo();
};

async function addListeners(){

    GlobalBool = false;

    
    
    let cmbVisitaCliente = document.getElementById('cmbVisitaCliente');
    cmbVisitaCliente.innerHTML = funciones.ComboSemana("LETRAS");

   

    let cmbTipoNegocio = document.getElementById('cmbTipoNegocio')
    cmbTipoNegocio.innerHTML = funciones.getComboTipoClientes();

    let f = new Date();
    cmbVisitaCliente.value = funciones.getDiaSemana(f.getDay());


    
    let btnUbicacion = document.getElementById('btnUbicacion');
    btnUbicacion.addEventListener('click',()=>{
        document.getElementById('btnTabUbicacion').click();
        //RE-AJUSTA EL MAPA A LA PANTALLA
        setTimeout(function () {
            try {
                map.invalidateSize();    
            } catch (error) {
                
            }
        }, 500);
    });


    document.getElementById('btnNuevoClienteUbicacion').addEventListener('click',()=>{

        document.getElementById('btnTabListado').click();

    });


    //carga la ubicación actual y general el mapa
    showUbicacion()
    .then((location)=>{
            let lat = location.coords.latitude.toString();
            let longg = location.coords.longitude.toString();
            map = Lmap(Number(lat),Number(longg));
    });

    

    let btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click',()=>{

     

            document.getElementById('btnGuardar').innerHTML = GlobalLoader; //   <i class="fal fa-save"></i>Guardar
            //verifyCodigoCliente(txtCodigo.value)
            //.then(()=>{
                
                document.getElementById('btnGuardar').innerHTML = '<i class="fal fa-save"></i>';

                funciones.Confirmacion('¿Está seguro que desea GUARDAR este Cliente?')
                .then((value)=>{
                    if(value==true){

                        document.getElementById('btnGuardar').disabled = true;
                        document.getElementById('btnGuardar').innerHTML = '<i class="fal fa-save fa-spin"></i>'; //   <i class="fal fa-save"></i>Guardar
                        
                        fcnGuardarCliente()
                        .then(()=>{
                           
                            document.getElementById('btnTabListado').click();
                            fcnCleanDataCliente();
                            
                           
                            funciones.Aviso('Cliente Creado exitosamente!!');

                            document.getElementById('btnGuardar').disabled = false;
                            document.getElementById('btnGuardar').innerHTML = '<i class="fal fa-save"></i>';

                        })
                        .catch(()=>{
                            funciones.AvisoError('Error al guardar el cliente');
                            //se intenta guardar el cliente localmente dado que no hay conexión al host

                            document.getElementById('btnGuardar').disabled = false;
                            document.getElementById('btnGuardar').innerHTML = '<i class="fal fa-save"></i>';

                        })
                        
                    }
                })
        
    });


    get_combos_mun_deptos('cmbMunicipio','cmbDepartamento');

    //await apigen.comboVendedores(GlobalEmpnit,'cmbVendedor');
    
    //inicializa la animación en las tabs
    funciones.slideAnimationTabs();

};



//funcion para enviar el cliente online
function fcnGuardarCliente(){  
    
    return new Promise((resolve,reject)=>{

        let txtNit = document.getElementById('txtNit');
        let cmbTipoNegocio = document.getElementById('cmbTipoNegocio');
        let cmbVisitaCliente = document.getElementById('cmbVisitaCliente');
        let txtNegocio = document.getElementById('txtNegocio') || ''; 
        let nomclie = document.getElementById('txtNomcliente').value || '';
        let dirclie = document.getElementById('txtDircliente').value || 'CIUDAD';
        let txtReferencia = document.getElementById('txtReferencia');
        let cmbMunicipio = document.getElementById('cmbMunicipio');
        let cmbDepartamento = document.getElementById('cmbDepartamento');
        //let cmbVendedor = document.getElementById('cmbVendedor');
        let txtTelefono = document.getElementById('txtTelefono');
        let txtLatitud = document.getElementById('txtLatitud');
        let txtLongitud = document.getElementById('txtLongitud');
        let codruta = 1;


        if(nomclie==''){funciones.AvisoError('Escriba un nombre de cliente');return;}
       
       
        axios.post('/clientes/censo_insert',{
            sucursal:GlobalEmpnit,
            codven:GlobalCodUsuario,
            codruta:codruta,
            fecha:funciones.getFecha(),
            tiponegocio:cmbTipoNegocio.value,
            nitclie:txtNit.value,
            negocio: funciones.limpiarTexto(txtNegocio.value),
            nomclie: funciones.limpiarTexto(nomclie), 
            dirclie: funciones.limpiarTexto(dirclie), 
            codmun:cmbMunicipio.value,
            coddepto:cmbDepartamento.value,
            referencia: funciones.limpiarTexto(txtReferencia.value), 
            telefono:txtTelefono.value,
            visita:cmbVisitaCliente.value,
            lat:txtLatitud.innerText,
            long:txtLongitud.innerText
        })
        .then((response) => {
            
            let data = response.data;
            if(response=='error'){
                reject()
            }else{
                if(Number(data.rowsAffected[0])>0){
                    resolve();
                }else{
                    reject();
                };
            }
            
        }, (error) => {
            console.log(error);
            reject();
        });      


    });
};





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
        funciones.AvisoError(error.toString());
    }

    
    
};



function get_combos_mun_deptos(idContainerMun,idcontainerDep){



    let contenedor = document.getElementById(idContainerMun);
    let strdata = '';
    

    let contenedor2 = document.getElementById(idcontainerDep);
    let strdata2 = '';
   


    get_municipios()
    .then((data)=>{
        data.recordset.map((rows)=>{
                strdata = strdata + `<option value='${rows.CODIGO}'>${rows.DESCRIPCION}</option>`
        })
        contenedor.innerHTML = strdata;
    })
    .catch(()=>{
        contenedor.innerHTML = `<option value='0'>NO SE CARGARON</option>`
    })

    get_departamentos()
    .then((data)=>{
        data.recordset.map((rows)=>{
                strdata2 = strdata2 + `<option value='${rows.CODIGO}'>${rows.DESCRIPCION}</option>`
        })
        contenedor2.innerHTML = strdata2;
    })
    .catch(()=>{
        contenedor2.innerHTML = `<option value='0'>NO SE CARGARON</option>`
    })


  
  
};

function get_municipios(){
    return new Promise((resolve,reject)=>{

        axios.post('/clientes/municipios', {
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

