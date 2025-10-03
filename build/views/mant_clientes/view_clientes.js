
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado() + view.modal_qr()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           ${view.vista_datos_cliente()}
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
        vista_listado:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-4">

                    <div class="row">
                        <div class="col-6">
                        
                            <h3 class="negrita text-base">Catálogo de Clientes</h3>
                            <h3 class="negrita text-danger" id="lbTotalClientes"></h3>
                        
                        </div>
                        <div class="col-6">
                        
                            <div class"form-group">
                                <label class="negrita text-secondary">Seleccione el Tipo de Lista</label>
                                <select class="form-control negrita text-base" id="cmbTipo">
                                    <option value="NA">CENSO</option>
                                    <option value="SI">ACTIVOS</option>
                                    <option value="NO">DESACTIVADOS</option>
                                    
                                </select>
                            </div>
                        
                        </div>
                    </div>

                    <br>

                    <div class="table-responsive col-12">
                        
                        <div class"form-group">
                                <label class="negrita text-secondary">Escriba para buscar...</label>
                                <div class="input-group">
                                    <input type="text" class="negrita text-info form-control" 
                                        placeholder="Escriba para filtrar..." 
                                        id="txtBuscar" 
                                        oninput="F.FiltrarTabla('tblClientes','txtBuscar')">
                                    <button class="btn btn-md btn-success hand"
                                        id="btnExportar">
                                        <i class="fal fa-share"></i>
                                    </button>
                                </div>
                        </div>

                        <br>

                        <table class="table table-bordered table-hover col-12" id="tblClientes">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>VENDEDOR</td>
                                    <td>NIT / CODIGO</td>
                                    <td>NEGOCIO</td>
                                    <td>NOMBRE</td>
                                    <td>DIRECCION/REF</td>
                                    <td>MUNICIPIO</td>
                                    <td>QR</td>
                                    <td>A/D</td>
                                    <td>E</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataClientes">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <button id="btnNuevo" class="btn btn-bottom-r btn-success btn-xl btn-circle shadow hand">
                <i class="fal fa-plus"></i>
            </button>
            `
        },
        vista_datos_cliente:()=>{
            return `
            <div class="row">
                <div class=" col-sm-12 col-md-12 col-xl-6 col-lg-6">
                     
                    <div class="card shadow card-rounded p-4">
                        <div class="card-body">
                        
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
                                    <label class="negrita text-secondary">Giro de Negocio  /  Tipo (Categoria):</label>
                                    <div class="input-group">
                                        <select id="cmbTipoNegocio" class="form-control negrita"></select>
                                        <select id="cmbCategoria" class="form-control">
                                            <option value='A'>A</option>
                                            <option value='B'>B</option>
                                            <option value='C'>C</option>
                                            <option value='D'>D</option>
                                        </select>
                                    </div>
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
                        
                        </div>
                     </div>

                </div>
                <div class=" col-sm-12 col-md-12 col-xl-6 col-lg-6">
              
                    <div class="card shadow card-rounded p-4">
                        <div class="card-body">
                        
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


                                <input type='text' id="txtCodclie" class="hidden" disabled>

                        
                        </div>
                     </div>
              
                </div>
            </div>
                          
            <button class="btn btn-secondary btn-bottom-l btn-xl btn-circle hand shadow" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>

            <button id="btnGuardar" class="btn btn-bottom-r btn-info btn-xl btn-circle shadow hand">
                <i class="fal fa-save"></i>
            </button>
            `


        },
        modal_qr:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" 
                role="dialog" aria-hidden="true" id="modal_qr">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-base d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Codigo QR del Cliente
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded" id="print_qr">
                                <div class="card-body p-4">

                                    <h3 class="negrita text-danger" id="lbNomclieQR"></h3>
                                    <h5 class="negrita text-danger" id="lbCodclieQR"></h5>

                                    <div id="container_qr">
                                    </div>

                                </div>

                                <br>
                                
                                <button class="btn btn-xl btn-secondary btn-circle hand shadow" data-dismiss="modal">
                                    <i class="fal fa-arrow-left"></i>
                                </button>
                            </div>                              

                        </div>
                    </div>
                </div>
            </div>

            
            `
        },
        modal_camara:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" 
                role="dialog" aria-hidden="true" id="modal_barcode">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-danger d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Lectura de Codigo QR
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded" id="">
                                <div class="card-body p-4">

                                   <div class="" id="root_barcode">
                                    </div>

                                </div>

                                <br>
                                
                                <button class="btn btn-xl btn-secondary btn-circle hand shadow" data-dismiss="modal">
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
    
        document.getElementById('cmbTipo').addEventListener('change',()=>{
            tbl_clientes();    
        });


        tbl_clientes();


        document.getElementById('btnExportar').addEventListener('click',()=>{

            F.showToast('Cargando datos...');

                let st = document.getElementById('cmbTipo').value;

                document.getElementById('btnExportar').disabled = true;
                document.getElementById('btnExportar').innerHTML = `<i class="fal fa-share fa-spin"></i>`;
         
                GF.get_data_clientes_listado_export(GlobalEmpnit,st)
                .then((data)=>{
                   
                    let datos = data.recordset;

                    F.export_json_to_xlsx(datos,'Lista_clientes')

                    document.getElementById('btnExportar').disabled = false;
                    document.getElementById('btnExportar').innerHTML = `<i class="fal fa-share"></i>`;

                })
                .catch(()=>{
                    F.AvisoError('No se pudo cargar')
                    document.getElementById('btnExportar').disabled = false;
                    document.getElementById('btnExportar').innerHTML = `<i class="fal fa-share"></i>`;

                })

        });


        document.getElementById('btnNuevo').addEventListener('click',()=>{

            document.getElementById('tab-dos').click();

            document.getElementById('txtCodclie').value ='';

            clean_data();

        });


        let cmbVisitaCliente = document.getElementById('cmbVisitaCliente');
        cmbVisitaCliente.innerHTML = F.ComboSemana("LETRAS");
    
        let cmbTipoNegocio = document.getElementById('cmbTipoNegocio')
        cmbTipoNegocio.innerHTML = F.getComboTipoClientes();
    
     
        

        get_combos_mun_deptos('cmbMunicipio','cmbDepartamento','cmbSector');

        get_empleados();
    
  
        
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
    
         
            let codclie = document.getElementById('txtCodclie').value || '';
            if(codclie==''){

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

                        
                            tbl_clientes();
                           

                        })
                        .catch(()=>{

                            F.AvisoError('Error al guardar el cliente');

                            document.getElementById('btnGuardar').disabled = false;
                            document.getElementById('btnGuardar').innerHTML = '<i class="fal fa-save"></i>';

                        })
                        
                    }
                })

            }else{

                F.Confirmacion('¿Está seguro que desea ACTUALIZAR este Cliente?')
                .then((value)=>{
                    if(value==true){

                        document.getElementById('btnGuardar').disabled = true;
                        document.getElementById('btnGuardar').innerHTML = '<i class="fal fa-save fa-spin"></i>'; 
                        
                        fcnEditarCliente()
                        .then(()=>{
                           
                           
                            F.Aviso('Cliente actualizado exitosamente!!');

                            document.getElementById('btnGuardar').disabled = false;
                            document.getElementById('btnGuardar').innerHTML = '<i class="fal fa-save"></i>';


                            document.getElementById('tab-uno').click();

                        
                            tbl_clientes();
                           

                        })
                        .catch(()=>{

                            F.AvisoError('Error al actualizar el cliente');

                            document.getElementById('btnGuardar').disabled = false;
                            document.getElementById('btnGuardar').innerHTML = '<i class="fal fa-save"></i>';

                        })
                        
                    }
                })

            }
    
             


                 
            
        });



};

function initView(){

    getView();
    addListeners();

};




function tbl_clientes(){

    let container = document.getElementById('tblDataClientes');
    container.innerHTML = GlobalLoader;

    let st = document.getElementById('cmbTipo').value;
    let contador = 0;
    let str = '';

    GF.get_data_clientes_listado(GlobalEmpnit,st)
    .then((data)=>{
        data.recordset.map((r)=>{
            
            let idbtnE = `btnE${r.CODCLIENTE}`;
            let strClassBtn = ``;
            if(st=='SI'){strClassBtn='btn-danger'}else{strClassBtn='btn-success'};

            contador +=1;
            str += `
            <tr>
                <td>${r.NOMEMPLEADO}
                    <br>
                    <small>${r.VISITA}</small>
                </td>
                <td>${r.NIT}
                    <br>
                    <small>Cod: ${r.CODCLIENTE}</small>
                </td>
                <td>${r.TIPONEGOCIO}
                    <br>
                    <small>${r.NEGOCIO}</small>
                </td>
                <td>${r.NOMBRE}</td>
                <td>${r.DIRECCION}
                    <br>
                    <small>${r.REFERENCIA}</small>
                </td>
                <td>${r.DESMUN}
                <br>
                <small>${r.DESDEPTO}</td>
                <td>
                    <button class="btn btn-md btn-warning btn-circle hand shadow"
                        onclick="create_qr_code('${r.CODCLIENTE}','${r.NOMBRE}')">
                        <i class="fal fa-barcode"></i>
                    </button>
                </td>
                <td>
                    <button class="btn ${strClassBtn} btn-md btn-circle hand shadow"
                    id="${idbtnE}"
                    onclick="update_status_cliente('${r.CODCLIENTE}','${st}','${idbtnE}')">
                        <i class="fal fa-sync"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-md btn-info btn-circle hand shadow"
                    onclick="edit_cliente('${r.CODCLIENTE}','${r.NIT}','${r.TIPONEGOCIO}','${r.NEGOCIO}','${r.VISITA}','${r.NOMBRE}','${r.DIRECCION}','${r.REFERENCIA}','${r.CODMUN}','${r.CODDEPTO}','${r.CODSECTOR}','${r.CODEMPLEADO}','${r.TELEFONO}','${r.LATITUD}','${r.LONGITUD}','${r.CATEGORIA}')">
                        <i class="fal fa-edit"></i>
                    </button>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalClientes').innerText = `Total: ${contador}`;
    })
    .catch((error)=>{
        console.log(error);

        container.innerHTML = 'No se cargaron datos...';
        document.getElementById('lbTotalClientes').innerText = '';

    })


}


function update_status_cliente(codclie,st,idbtn){

    let btn = document.getElementById(idbtn);

    let msn = '';
    let newSt = '';


    switch (st) {
        case 'NA':
            msn = `¿Está seguro que desea APROBAR a este cliente?`;      
            newSt = 'SI';

            break;
        case 'SI':
            msn = `¿Está seguro que desea DESACTIVAR a este cliente?`;  
            newSt = 'NO';
            
            break;
        case 'NO':
            msn = `¿Está seguro que desea ACTIVAR a este cliente?`;  
            newSt = 'SI';

            break;
    }



    F.Confirmacion(msn)
    .then((value)=>{
        if(value==true){

            btn.disabled = true;
            btn.innerHTML = `<i class="fal fa-sync fa-spin"></i>`;

            GF.get_data_clientes_update_st(GlobalEmpnit,codclie,newSt)
            .then(()=>{

                tbl_clientes();

            })
            .catch(()=>{
            
                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-sync"></i>`;
            
            })

        }
    })







};


function edit_cliente(codclie,nit,tiponegocio,negocio,visita,nomclie,dirclie,referencia,municipio,departamento,sector,
                    codven,telefono,latitud,longitud,categoria
){


        document.getElementById('tab-dos').click();

        document.getElementById('txtCodclie').value = codclie;
        document.getElementById('txtNit').value = nit;
        document.getElementById('cmbTipoNegocio').value = tiponegocio;
        document.getElementById('cmbVisitaCliente').value = visita;
        document.getElementById('txtNegocio').value = negocio;
        document.getElementById('txtNomcliente').value= nomclie;
        document.getElementById('txtDircliente').value = dirclie;
        document.getElementById('txtReferencia').value = referencia;

        document.getElementById('cmbDepartamento').value = departamento;
        get_municipios(departamento)
        .then((data)=>{
            let strdata ='';
            data.recordset.map((rows)=>{
                strdata = strdata + `<option value='${rows.CODIGO}'>${rows.DESCRIPCION}</option>`
            })
            document.getElementById('cmbMunicipio').innerHTML = strdata;
            document.getElementById('cmbMunicipio').value = municipio;

            get_sectores(municipio)
            .then((data)=>{
                let strdata3 = '';
                data.recordset.map((rows)=>{
                        strdata3 = strdata3 + `<option value='${rows.CODIGO}'>${rows.DESCRIPCION}</option>`
                })
                document.getElementById('cmbSector').innerHTML = strdata3;
                document.getElementById('cmbSector').value = sector;
            })
            .catch(()=>{
                contenedor3.innerHTML = `<option value='0'>NO SE CARGARON</option>`
            })
        })

        
        document.getElementById('cmbSector').value = sector;
        
        document.getElementById('cmbVendedorCliente').value = codven;
        document.getElementById('txtTelefono').value = telefono;
        document.getElementById('txtLatitud').value = latitud;
        document.getElementById('txtLongitud').value = longitud;
        document.getElementById('cmbCategoria').value = categoria;


};



function clean_data(){

    document.getElementById('txtCodclie').value = "";
    
    document.getElementById('txtNit').value = "CF";
    //document.getElementById('cmbTipoNegocio').value = "TIENDITA";
    document.getElementById('txtNegocio').value = ""; 
    document.getElementById('txtNomcliente').value = "";
    document.getElementById('txtDircliente').value = "";
    document.getElementById('txtReferencia').value = "";
    document.getElementById('txtTelefono').value = "";
   // document.getElementById('txtObs').value = "SN";


};

function get_empleados(){

    
    GF.get_data_empleados_tipo(3)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            str += `<option value='${r.CODEMPLEADO}'>${r.NOMEMPLEADO}</option>`
        })

        //document.getElementById('cmbVendedor').innerHTML = str;
        document.getElementById('cmbVendedorCliente').innerHTML = str;

       
        //carga la lista de clientes luego de tener al primer vendedor
        tbl_clientes();


    })
    .catch(()=>{

        //document.getElementById('cmbVendedor').innerHTML = '';
        document.getElementById('cmbVendedorCliente').innerHTML = '';

    })




}



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
        let categoria = document.getElementById('cmbCategoria').value;


        if(nomclie==''){F.AvisoError('Escriba un nombre de cliente');return;}
       
   
        axios.post('/clientes/cliente_insert',{
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


function fcnEditarCliente(){  
    
    return new Promise((resolve,reject)=>{


        let codclie = document.getElementById('txtCodclie').value;
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
        let categoria = document.getElementById('cmbCategoria').value;

        if(nomclie==''){F.AvisoError('Escriba un nombre de cliente');return;}
       
   
        axios.post('/clientes/cliente_edit',{
            sucursal:GlobalEmpnit,
            codclie:codclie,
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




function create_qr_code(codigo,nomclie){


    $("#modal_qr").modal('show');

    document.getElementById('lbNomclieQR').innerText = nomclie;
    document.getElementById('lbCodclieQR').innerText = `Codigo: ${codigo}`

    F.create_qr_code(codigo,'container_qr');

};