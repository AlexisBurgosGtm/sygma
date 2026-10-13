function censo_getMount() {
    return window.__censoEmbedHost
        || document.getElementById('ventasPanelEmbed')
        || (typeof root !== 'undefined' && root ? root : null);
}

function censo_isActive() {
    const host = window.__censoEmbedHost;
    return !!(host && host.isConnected && document.getElementById('ventasPanelEmbed') === host);
}

/** Respuesta axios/SQL: acepta recordset o rowsAffected sin romper si falta rowsAffected. */
function censo_sqlHasData(data) {
    if (!data || data.toString() === 'error') return false;
    if (Array.isArray(data.recordset)) return true;
    const ra = data.rowsAffected;
    return Array.isArray(ra) && Number(ra[0]) > 0;
}

function censo_el(id) {
    const host = window.__censoEmbedHost || document.getElementById('ventasPanelEmbed');
    if (host) {
        try {
            const scoped = host.querySelector('#' + CSS.escape(String(id)));
            if (scoped) return scoped;
        } catch (e) { /* id inválido */ }
    }
    return document.getElementById(id);
}

function getView(mountEl){
    let view = {
        tabsClientes :()=>{
            return `
            <div class="panel-container show">
                <div class="panel-content">
                   
                    <div class="tab-content py-1 sygma-censo-tabs">

                        <div class="tab-pane fade active show" id="uno" role="tabpanel">
                        
                           ${view.listado()}

                        </div>
                        
                        <div class="tab-pane fade" id="dos" role="tabpanel">
                             ${view.formNuevo()}

                        </div>

                        <div class="tab-pane fade" id="tres" role="tabpanel">
                            <div class="mapcontainer2 col-12 sygma-censo-map" id="mapcontainer"></div>
                            <div class="sygma-censo-map-actions">
                                <button type="button" class="btn btn-secondary btn-circle btn-xl shadow hand" id="btnAtrasUbicacion" title="Atrás">
                                    <i class="fal fa-arrow-left"></i>
                                </button>
                                <button type="button" class="btn btn-info btn-circle btn-xl shadow hand" id="btnNuevoClienteUbicacion" title="Aceptar">
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
            <div class="sygma-censo-panel">
                <div class="d-flex flex-wrap align-items-center justify-content-between mb-1 sygma-censo-toolbar">
                    <h6 class="negrita text-base mb-0 sygma-censo-toolbar__title">Crear clientes</h6>
                </div>
                <div class="card card-rounded sygma-censo-card mb-0">
                    <div class="card-body py-2 px-2">
                        <div class="row no-gutters sygma-censo-filters mb-1">
                            <div class="col-6 pr-1">
                                <select class="form-control form-control-sm negrita" id="cmbVisita" title="Día de visita"></select>
                            </div>
                            <div class="col-6 pl-1">
                                <select class="form-control form-control-sm negrita" id="cmbVendedor" title="Vendedor"></select>
                            </div>
                        </div>
                        <div class="form-group mb-1">
                            <input type="text"
                                class="form-control form-control-sm border-info text-info"
                                id="txtBuscar"
                                placeholder="Buscar cliente..."
                                oninput="F.FiltrarTabla('tblClientes','txtBuscar')">
                        </div>
                        <div class="table-responsive sygma-ventas-censo-table">
                            <table class="table table-sm table-bordered table-hover mb-0 h-full col-12" id="tblClientes">
                                <thead class="bg-base text-white negrita">
                                    <tr>
                                        <td class="sygma-censo-col-nit">NIT / COD</td>
                                        <td class="d-none d-lg-table-cell">NEGOCIO</td>
                                        <td class="sygma-censo-col-cliente">CLIENTE</td>
                                        <td class="d-none d-md-table-cell">UBICACIÓN</td>
                                        <td class="d-none d-sm-table-cell text-nowrap">CREADO</td>
                                        <td class="sygma-censo-col-acc text-center"></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataClientes"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <button type="button" class="btn btn-secondary btn-bottom-r btn-xl btn-circle hand shadow" data-spa-action="inicio">
                <i class="fal fa-home"></i>
            </button>

            <button class="btn btn-success sygma-fab-nuevo btn-xl btn-circle hand shadow" id="btnNuevo">
                <i class="fal fa-plus"></i>
            </button>

            `
        },
        formNuevo:()=>{
            return `
                            <div class="card shadow col-12 col-md-8 col-lg-6 col-xl-5 card-rounded sygma-censo-form-card mb-0">
                                <div class="card-body py-2 px-2">
                                <div class="form-group mb-2">
                                    <label class="negrita text-secondary sygma-censo-form-label">VENDEDOR</label>
                                    <select id="cmbVendedorCliente" class="form-control form-control-sm"></select>
                                </div>

                                <div class="row no-gutters">
                                    <div class="col-6 pr-1">
                                        <div class="form-group mb-2">
                                            <label class="negrita text-secondary sygma-censo-form-label">NIT:</label>
                                            <input id="txtNit" class="form-control form-control-sm" type="text" placeholder="NIT..." maxlenght="20">
                                        </div>
                                    </div>
                                    <div class="col-6 pl-1">
                                        <div class="form-group mb-2">
                                            <label class="negrita text-secondary sygma-censo-form-label">Visita:</label>
                                            <select id="cmbVisitaCliente" class="form-control form-control-sm"></select>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group mb-2">
                                    <label class="negrita text-secondary sygma-censo-form-label">Giro / Categoría:</label>
                                    <div class="input-group input-group-sm">
                                        <select id="cmbTipoNegocio" class="form-control negrita"></select>
                                        <select id="cmbCategoria" class="form-control">
                                            <option value='A'>A</option>
                                            <option value='B'>B</option>
                                            <option value='C'>C</option>
                                            <option value='D'>D</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group mb-2">
                                    <label class="negrita text-secondary sygma-censo-form-label">Nombre del Negocio:</label>
                                    <input id="txtNegocio" class="form-control form-control-sm" type="text" placeholder="Nombre del negocio" maxlenght="150">
                                </div>

                                <div class="form-group mb-2">
                                    <label class="negrita text-secondary sygma-censo-form-label">Nombre y Apellido:</label>
                                    <input id="txtNomcliente" class="form-control form-control-sm" type="text" maxlenght="200" placeholder="Nombre completo">
                                </div>

                                <div class="form-group mb-2">
                                    <label class="negrita text-secondary sygma-censo-form-label">Dirección:</label>
                                    <input id="txtDircliente" class="form-control form-control-sm" type="text" maxlenght="250" placeholder="Dirección cliente...">
                                </div>

                                <div class="form-group mb-2">
                                    <label class="negrita text-secondary sygma-censo-form-label">Referencia:</label>
                                    <input id="txtReferencia" class="form-control form-control-sm" type="text" maxlenght="250" placeholder="Referencia del cliente...">
                                </div>

                                <div class="row no-gutters">
                                    <div class="col-6 pr-1">
                                        <div class="form-group mb-2">
                                            <label class="negrita text-secondary sygma-censo-form-label">Departamento:</label>
                                            <select id="cmbDepartamento" class="form-control form-control-sm"></select>
                                        </div>
                                    </div>
                                    <div class="col-6 pl-1">
                                        <div class="form-group mb-2">
                                            <label class="negrita text-secondary sygma-censo-form-label">Municipio:</label>
                                            <select id="cmbMunicipio" class="form-control form-control-sm"></select>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group mb-2">
                                    <label class="negrita text-secondary sygma-censo-form-label">Sector / aldea:</label>
                                    <select id="cmbSector" class="form-control form-control-sm"></select>
                                </div>

                                <div class="form-group mb-2">
                                    <label class="negrita text-secondary sygma-censo-form-label">Teléfono:</label>
                                    <input id="txtTelefono" maxlength="8" class="form-control form-control-sm" type="number" placeholder="Teléfono cliente">
                                </div>

                                <div class="d-flex flex-wrap align-items-center sygma-censo-coords mb-2">
                                    <div class="sygma-censo-coords__item">
                                        <span class="negrita text-secondary sygma-censo-form-label">Lat:</span>
                                        <span class="text-info" id="txtLatitud">0</span>
                                    </div>
                                    <div class="sygma-censo-coords__item">
                                        <span class="negrita text-secondary sygma-censo-form-label">Lng:</span>
                                        <span class="text-info" id="txtLongitud">0</span>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-circle btn-danger shadow hand" id="btnUbicacion" title="Ubicación en mapa">
                                        <i class="fal fa-map-marker"></i>
                                    </button>
                                </div>

                                <div class="d-flex justify-content-end align-items-center sygma-censo-form-actions">
                                    <button type="button" id="btnCancelarCliente" class="btn btn-secondary btn-sm mr-2">Cancelar</button>
                                    <button type="button" id="btnGuardar" class="btn btn-info btn-sm">
                                        <i class="fal fa-save"></i> Guardar
                                    </button>
                                </div>
                                </div>
                            </div>
            `
        },
    };

    const el = mountEl || censo_getMount();
    if (!el) {
        console.error('[view_censo] getView: contenedor no encontrado');
        return;
    }
    el.innerHTML = view.tabsClientes();
};

async function addListeners(){

    GlobalBool = false;

    const censoHost = censo_getMount();
    F.slideAnimationTabs(censoHost || undefined);


    //cmbVendedor
    if(Number(GlobalNivelUsuario)==3){
        censo_el('cmbVendedor').disabled = true;
        censo_el('cmbVendedorCliente').disabled = true;
    }else{
        censo_el('cmbVendedor').disabled = false;
        censo_el('cmbVendedorCliente').disabled = false;
    };

    censo_el('cmbVendedor').addEventListener('change',()=>{
        tbl_clientes();
    })
    
    let cmbVisita = censo_el('cmbVisita');
    cmbVisita.innerHTML = '<option value="TODOS">TODOS</option>' + F.ComboSemana("LETRAS");

    cmbVisita.addEventListener('change',()=>{

        tbl_clientes();

    });

        
    let cmbVisitaCliente = censo_el('cmbVisitaCliente');
    cmbVisitaCliente.innerHTML = F.ComboSemana("LETRAS");

    let cmbTipoNegocio = censo_el('cmbTipoNegocio')
    cmbTipoNegocio.innerHTML = F.getComboTipoClientes();

    let f = new Date();
    cmbVisitaCliente.value = F.getDiaSemana(f.getDay());
    cmbVisita.value = F.getDiaSemana(f.getDay());

    
    let btnUbicacion = censo_el('btnUbicacion');
    btnUbicacion.addEventListener('click',()=>{
        censo_el('tab-tres').click();
        //RE-AJUSTA EL MAPA A LA PANTALLA
        setTimeout(function () {
            try {
                map.invalidateSize();    
            } catch (error) {
                
            }
        }, 500);
    });


    censo_el('btnNuevoClienteUbicacion').addEventListener('click',()=>{

        censo_el('tab-dos').click();

    });

    censo_el('btnAtrasUbicacion').addEventListener('click',()=>{
        censo_el('tab-dos').click();
    });

    censo_el('btnCancelarCliente').addEventListener('click',()=>{
        censo_el('tab-uno').click();
    });




    //carga la ubicación actual y general el mapa
    showUbicacion()
    .then((location)=>{
            let lat = location.coords.latitude.toString();
            let longg = location.coords.longitude.toString();
            map = Lmap(Number(lat),Number(longg));
    });

    
    censo_el('btnNuevo').addEventListener('click',()=>{


        fcnCleanDataCliente();

        censo_el('tab-dos').click();



    });




    get_combos_mun_deptos('cmbMunicipio','cmbDepartamento','cmbSector');

    get_empleados();

    /*
    censo_el('change',()=>{
        tbl_clientes();
    })*/
    
    censo_el('cmbDepartamento').addEventListener('change',()=>{

    
        let contenedor = censo_el('cmbMunicipio');
        let strdata = '';
        
        let contenedor3 = censo_el('cmbSector');
        let strdata3 = '';


        get_municipios(censo_el('cmbDepartamento').value)
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


    censo_el('cmbMunicipio').addEventListener('change',()=>{

        let contenedor3 = censo_el('cmbSector');
        let strdata3 = '';


        get_sectores(censo_el('cmbMunicipio').value)
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


    
    
    let btnGuardar = censo_el('btnGuardar');
    btnGuardar.addEventListener('click',()=>{

     

            censo_el('btnGuardar').innerHTML = GlobalLoader; 

                
                censo_el('btnGuardar').innerHTML = '<i class="fal fa-save"></i> Guardar';

                F.Confirmacion('¿Está seguro que desea GUARDAR este Cliente?')
                .then((value)=>{
                    if(value==true){

                        censo_el('btnGuardar').disabled = true;
                        censo_el('btnGuardar').innerHTML = '<i class="fal fa-save fa-spin"></i> Guardar'; 
                        
                        fcnGuardarCliente()
                        .then(()=>{
                           
                           
                            F.Aviso('Cliente Creado exitosamente!!');

                            censo_el('btnGuardar').disabled = false;
                            censo_el('btnGuardar').innerHTML = '<i class="fal fa-save"></i> Guardar';


                            censo_el('tab-uno').click();

                            fcnCleanDataCliente();
                            
                            tbl_clientes();
                           

                        })
                        .catch(()=>{

                            F.AvisoError('Error al guardar el cliente');

                            censo_el('btnGuardar').disabled = false;
                            censo_el('btnGuardar').innerHTML = '<i class="fal fa-save"></i> Guardar';

                        })
                        
                    }
                })
        
    });





};



//funcion para enviar el cliente online
function fcnGuardarCliente(){  
    
    return new Promise((resolve,reject)=>{

        let txtNit = censo_el('txtNit');
        let cmbTipoNegocio = censo_el('cmbTipoNegocio');
        let cmbVisitaCliente = censo_el('cmbVisitaCliente');
        let txtNegocio = censo_el('txtNegocio'); 
        let nomclie = censo_el('txtNomcliente').value || '';
        let dirclie = censo_el('txtDircliente').value || 'CIUDAD';
        let txtReferencia = censo_el('txtReferencia');
        let cmbMunicipio = censo_el('cmbMunicipio');
        let cmbDepartamento = censo_el('cmbDepartamento');
        let cmbSector = censo_el('cmbSector');
        let cmbVendedor = censo_el('cmbVendedorCliente');
        let txtTelefono = censo_el('txtTelefono');
        let txtLatitud = censo_el('txtLatitud');
        let txtLongitud = censo_el('txtLongitud');
        let categoria = censo_el('cmbCategoria').value;

        if(nomclie==''){F.AvisoError('Escriba un nombre de cliente');return;}

        const enviarCenso = (codruta) => axios.post('/clientes/censo_insert',{
            sucursal:GlobalEmpnit,
            codven:cmbVendedor.value,
            codruta:codruta,
            sector: cmbSector.value,
            categoria:categoria,
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
                        if (censo_sqlHasData(data)) {
                            resolve(data);
                        } else {
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

        const rutaSesion = (typeof GlobalCodRutaCliente !== 'undefined' ? Number(GlobalCodRutaCliente) : 0) || 0;
        if (rutaSesion > 0) {
            enviarCenso(rutaSesion);
            return;
        }

        const cargarRuta = (typeof cargar_ruta_vendedor_sesion === 'function')
            ? cargar_ruta_vendedor_sesion()
            : Promise.resolve(0);

        cargarRuta
            .then((ruta) => enviarCenso(Number(ruta) || 0))
            .catch(() => enviarCenso(0));
    });
};

function get_empleados(){

    
    GF.get_data_empleados_tipo(3)
    .then((data)=>{

        if (!censo_isActive()) return;

        let str = '';
        data.recordset.map((r)=>{
            str += `<option value='${r.CODEMPLEADO}'>${r.NOMEMPLEADO}</option>`
        })

        const cmbV = censo_el('cmbVendedor');
        const cmbVC = censo_el('cmbVendedorCliente');
        if (!cmbV || !cmbVC) return;

        cmbV.innerHTML = str;
        cmbVC.innerHTML = str;

        cmbV.value = GlobalCodUsuario;

        if(Number(GlobalNivelUsuario)==3){
            cmbVC.value = GlobalCodUsuario;
        }

        tbl_clientes();

    })
    .catch(()=>{

        if (!censo_isActive()) return;
        const cmbV = censo_el('cmbVendedor');
        const cmbVC = censo_el('cmbVendedorCliente');
        if (cmbV) cmbV.innerHTML = '';
        if (cmbVC) cmbVC.innerHTML = '';

    })




}



function fcnCleanDataCliente(){
    
            censo_el('txtNit').value = "CF";
            //censo_el('txtCodigo').value = "";
            //censo_el('cmbTipoNegocio').value = "TIENDITA";
            censo_el('txtNegocio').value = ""; 
            censo_el('txtNomcliente').value = "";
            censo_el('txtDircliente').value = "";
            censo_el('txtReferencia').value = "";
            censo_el('txtTelefono').value = "";
           // censo_el('txtObs').value = "SN";

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
            censo_el('txtLatitud').innerText = position.lat;
            censo_el('txtLongitud').innerText = position.lng;
           });
     
    //establece las coordenadas iniciales en los labels
    censo_el('txtLatitud').innerText = lat.toString();
    censo_el('txtLongitud').innerText = long.toString();
    
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



    let contenedor = censo_el(idContainerMun);
    let strdata = '';
    

    let contenedor2 = censo_el(idcontainerDep);
    let strdata2 = '';
   
    let contenedor3 = censo_el(idcontainerSec);
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
            if (!censo_sqlHasData(data)) {
                reject();
            } else {
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
            if (!censo_sqlHasData(data)) {
                reject();
            } else {
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
            if (!censo_sqlHasData(data)) {
                reject();
            } else {
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
            if (!censo_sqlHasData(data)) {
                reject();
            } else {
                resolve(data);
            }
        }, (error) => {
           reject();
        });

    })
}

function tbl_clientes(){

        if (!censo_isActive()) return;

        const cmbVen = censo_el('cmbVendedor');
        const cmbVis = censo_el('cmbVisita');
        let container = censo_el('tblDataClientes');
        if (!cmbVen || !cmbVis || !container) return;

        let codven = cmbVen.value;
        let visita = cmbVis.value;

        container.innerHTML = GlobalLoader;


        get_data_clientes(visita,codven)
        .then((data)=>{

            if (!censo_isActive()) return;
            container = censo_el('tblDataClientes');
            if (!container) return;

            let str = '';

          

            data.recordset.map((r)=>{
                let idbtn = 'btnE' + r.CODCLIENTE.toString()
                str += `
                        <tr>
                            <td class="sygma-censo-col-nit">
                                <span class="sygma-censo-nit">${r.NIT}</span>
                                <small class="d-block negrita text-danger">COD: ${r.EMPNIT}-${r.CODCLIENTE}</small>
                                <span class="d-inline-block d-md-none badge badge-secondary sygma-censo-visita-badge mt-1">${r.VISITA}</span>
                            </td>
                            <td class="d-none d-lg-table-cell">
                                ${r.TIPONEGOCIO} · Cat ${r.CATEGORIA}
                                <small class="d-block">${r.NEGOCIO}</small>
                            </td>
                            <td class="sygma-censo-col-cliente">
                                <span class="d-lg-none text-muted small">${r.TIPONEGOCIO} · Cat ${r.CATEGORIA}</span>
                                <span class="d-lg-none small d-block text-secondary">${r.NEGOCIO}</span>
                                <span class="sygma-censo-cliente-nombre">${r.NOMBRE}</span>
                                <small class="d-block sygma-censo-cliente-dir">${r.DIRECCION}</small>
                                <small class="d-block text-muted">${r.REFERENCIA}</small>
                                <small class="d-block">TEL: ${r.TELEFONO}</small>
                            </td>
                            <td class="d-none d-md-table-cell">
                                <small class="d-block">${r.DESSECTOR}</small>
                                <small class="d-block">${r.DESMUN}</small>
                                <small class="d-block">${r.DESDEPTO}</small>
                            </td>
                            <td class="d-none d-sm-table-cell text-nowrap">${F.convertDateNormal(r.LASTSALE)}</td>
                            <td class="text-center p-1 sygma-censo-col-acc">
                                <button id='${idbtn}' class="btn btn-sm btn-circle btn-danger hand shadow sygma-censo-acc-btn"
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
            if (!censo_isActive()) return;
            container = censo_el('tblDataClientes');
            if (!container) return;
            console.log(error);
            container.innerHTML = 'No hay datos...';
        })




};


function delete_cliente_censo(codclie,idbtn){

    let btn = censo_el(idbtn);
    

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
                    if (censo_sqlHasData(data)) {
                        resolve(data);
                    } else {
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

function censo_embed_leave() {
    try {
        if (typeof map !== 'undefined' && map && typeof map.remove === 'function') {
            map.remove();
        }
    } catch (e) { /* mapa */ }
    map = null;
    const host = window.__censoEmbedHost;
    if (host && typeof $ !== 'undefined') {
        try {
            $(host).find('a[data-toggle="tab"]').off('hide.bs.tab show.bs.tab shown.bs.tab');
        } catch (e) { /* jquery */ }
    }
    window.__censoEmbedHost = null;
}

function censo_embed_enter(embedHost) {
    const host = embedHost || document.getElementById('ventasPanelEmbed');
    if (!host) {
        console.error('[censo_embed_enter] sin contenedor');
        return;
    }
    window.__censoEmbedHost = host;
    getView(host);
    addListeners();
}

window.censo_embed_enter = censo_embed_enter;
window.censo_embed_leave = censo_embed_leave;

function initView(mountEl) {
    censo_embed_enter(mountEl || document.getElementById('ventasPanelEmbed'));
}

function destroyView() {
    censo_embed_leave();
}