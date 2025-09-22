
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado() + view.modal_datos_empleado()}
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
        vista_listado:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-4">

                    <div class="row">
                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            <h3 class="negrita text-base">LISTADO DE EMPLEADOS</h3>
                            <div class="form-group">
                                <label>Escriba para buscar:</label>
                                <input type="text" 
                                    class="form-control negrita text-negrita" 
                                    id="txtBuscar" 
                                    oninput="F.FiltrarTabla('tblEmpleados','txtBuscar')"
                                    placeholder="Escriba para buscar...">
                            </div>
                        </div>
                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            
                            <div class="form-group">
                                <select class="form-control negrita" id="cmbSucursal">
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>Tipo lista</label>
                                <select class="form-control negrita text-base" id="cmbStatus">
                                    <option value='SI'>ACTIVOS</option>
                                    <option value='NO'>DESACTIVADOS</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <br>

                    <div class="table-responsive col-12">
                        <table class="table table-responsive table-hover col-12" id="tblEmpleados">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>TIPO</td>
                                    <td>NOMBRE</td>
                                    <td>TELEFONO</td>
                                    <td>USUARIO</td>
                                    <td>DOCUMENTOS</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblDataEmpleados">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <button class="btn btn-circle btn-success btn-xl btn-bottom-r hand shadow" id="btnNuevo">
                <i class="fal fa-plus"></i>
            </button>
            `
        },
        modal_datos_empleado:()=>{
            return `
              <div id="modal_empleado" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Datos del Empleado
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                    <div class="form-group">
                                        <label class="negrita text-secondary">Puesto (Tipo Empleado)</label>
                                        <select class="form-control negrita" id="cmbPuesto">
                                        
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label class="negrita text-secondary">Nombre Completo</label>
                                        <input type="text" class="form-control negrita" id="txtNombre">
                                    </div>

                                    <div class="form-group">
                                        <label class="negrita text-secondary">Dirección</label>
                                        <input type="text" class="form-control negrita" id="txtDireccion">
                                    </div>

                                    <div class="form-group">
                                        <label class="negrita text-secondary">Teléfono</label>
                                       <input type="text" class="form-control negrita" id="txtTelefono">
                                    </div>

                                    <div class="card card-rounded col-12">
                                        <div class="card-body p-4">
                                            <h5 class="negrita text-danger">Acceso a la Plataforma</h5>
                                            <div class="row">
                                                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                                                    <div class="form-group">
                                                        <label class="negrita text-secondary">Usuario</label>
                                                        <input type="text" class="form-control negrita" id="txtUsuario">
                                                    </div>
                                                </div>
                                                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                                                    <div class="form-group">
                                                        <label class="negrita text-secondary">Clave</label>
                                                        <input type="text" class="form-control negrita" id="txtClave">
                                                    </div>
                                                </div>
                                            </div>
                                        
                                        </div>
                                    </div>
                                    
                                    <br>

                                    <div class="row">
                                        <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                                            <div class="form-group">
                                                <label class="negrita text-secondary">Serie Facturas</label>
                                                <select class="form-control negrita" id="cmbCoddocEnv">
                                                
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                                            <div class="form-group">
                                                <label class="negrita text-secondary">Serie Cotizaciones</label>
                                                <select class="form-control negrita" id="cmbCoddocCot">
                                                
                                                </select>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>

                            <br><input type="text" id="txtCodEmp" class="hidden" disabled>
                                
                            <div class="row">
                                <div class="col-6">
                                    <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                        <i class="fal fa-arrow-left"></i>
                                    </button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-base btn-circle btn-xl hand shadow" id="btnGuardarEmpleado">
                                        <i class="fal fa-save"></i>
                                    </button>
                                </div>
                                
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


    let cmbSucursal = document.getElementById('cmbSucursal');

    GF.get_data_empresas()
    .then((data)=>{
            let str = ''; //'<option value="%">TODAS LAS SEDES</option>';
            data.recordset.map((r)=>{
                str += `
                    <option value="${r.EMPNIT}">${r.NOMBRE}</option>
                `
            })
            cmbSucursal.innerHTML = str;
            cmbSucursal.value = GlobalEmpnit;
           
    })
    .catch(()=>{
            cmbSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
    });

    
    
    cmbSucursal.addEventListener('change',()=>{
        GlobalEmpnit = cmbSucursal.value;
        get_coddoc();
        tbl_empleados();
    });



    //CARGA LOS TIPOS
    document.getElementById('cmbPuesto').innerHTML = tipo_empleados.map((r)=>{return `<option value='${r.codigo}'>${r.descripcion}</option>`}).join();

    //carga los coddocs
    get_coddoc();
        

    document.getElementById('cmbStatus').addEventListener('change',()=>{
        tbl_empleados();    
    });

    document.getElementById('btnNuevo').addEventListener('click',()=>{
        $("#modal_empleado").modal('show');
        document.getElementById('txtCodEmp').disabled = false;
        clean_data();
    })


    tbl_empleados();





    //GUARDAR
    let btnGuardarEmpleado = document.getElementById('btnGuardarEmpleado');
    btnGuardarEmpleado.addEventListener('click',()=>{


        let codigo = document.getElementById('txtCodEmp').value || '';

        let codtipo = document.getElementById('cmbPuesto').value;
        let nombre = document.getElementById('txtNombre').value || '';
        let direccion = document.getElementById('txtDireccion').value || 'CIUDAD';
        let telefono = document.getElementById('txtTelefono').value || '';
        let usuario = document.getElementById('txtUsuario').value || '.';
        let clave = document.getElementById('txtClave').value || '.';
        let coddoc_env = document.getElementById('cmbCoddocEnv').value;
        let coddoc_cot = document.getElementById('cmbCoddocCot').value;


        if(nombre==''){F.AvisoError('Escriba un nombre de Empleado');return;}
        if(direccion==''){F.AvisoError('Escriba un nombre de Empleado');return;}



        if(codigo==''){
            //EMPLEADO NUEVO
            F.Confirmacion('¿Está seguro que desea GUARDAR este nuevo Empleado?')
            .then((value)=>{
                if(value==true){

                    btnGuardarEmpleado.disabled = true;
                    btnGuardarEmpleado.innerHTML = `<i class="fal fa-save fa-spin"></i>;`

                    GF.get_data_empleados_insert(GlobalEmpnit,codtipo,nombre,direccion,telefono,usuario,clave,coddoc_env,coddoc_cot)
                    .then(()=>{
                        F.Aviso('Empleado creado exitosamente!!');
                        
                        btnGuardarEmpleado.disabled = false;
                        btnGuardarEmpleado.innerHTML = `<i class="fal fa-save"></i>`;
        
                        $("#modal_empleado").modal('hide');
        
                        tbl_empleados();
                    })
                    .catch(()=>{
                        F.AvisoError('No se pudo crear el Empleado');
                        btnGuardarEmpleado.disabled = false;
                        btnGuardarEmpleado.innerHTML = `<i class="fal fa-save"></i>`;
        
                    })

                }
            })

           

        }else{
            //EDICION DE EMPLEADO
            F.Confirmacion('¿Está seguro que desea EDITAR a este Empleado?')
            .then((value)=>{
                if(value==true){

                        btnGuardarEmpleado.disabled = true;
                        btnGuardarEmpleado.innerHTML = `<i class="fal fa-save fa-spin"></i>;`
                        
                        GF.get_data_empleados_edit(GlobalEmpnit,codigo,codtipo,nombre,direccion,telefono,usuario,clave,coddoc_env,coddoc_cot)
                        .then(()=>{
                            F.Aviso('Empleado actualizado exitosamente!!');
                            btnGuardarEmpleado.disabled = false;
                            btnGuardarEmpleado.innerHTML = `<i class="fal fa-save"></i>`;
            
                            $("#modal_empleado").modal('hide');
                            
                            tbl_empleados();
                        })
                        .catch(()=>{
                            F.AvisoError('No se pudo actualizar el Empleado');
                            btnGuardarEmpleado.disabled = false;
                            btnGuardarEmpleado.innerHTML = `<i class="fal fa-save"></i>`;
        
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

function get_coddoc(){

    GF.get_data_tipodoc_coddoc('FAC-DEV')
        .then((data)=>{
                    let coddoc = '<option value="">NO ASIGNADO</option>'
                    data.recordset.map((r)=>{
                        coddoc += `<option value="${r.CODDOC}">${r.CODDOC}</option>`
                    })        
                    document.getElementById('cmbCoddocEnv').innerHTML = coddoc;
        })
        .catch(()=>{
            document.getElementById('cmbCoddocEnv').innerHTML = `<option value="">NO SE CARGO...</option>`;
        })

        GF.get_data_tipodoc_coddoc('COT')
        .then((data)=>{
            let coddoc = '<option value="">NO ASIGNADO</option>'
            data.recordset.map((r)=>{
                coddoc += `<option value="${r.CODDOC}">${r.CODDOC}</option>`
            })        
            document.getElementById('cmbCoddocCot').innerHTML = coddoc;
        })
        .catch(()=>{
            document.getElementById('cmbCoddocCot').innerHTML = `<option value="">NO SE CARGO...</option>`;
        })


};



function clean_data(){

    document.getElementById('txtCodEmp').value = '';
    document.getElementById('txtNombre').value = '';
    document.getElementById('txtDireccion').value = '';
    document.getElementById('txtTelefono').value = '';
    document.getElementById('txtUsuario').value = '';
    document.getElementById('txtClave').value = '';
    
};



function tbl_empleados(){

    let container = document.getElementById('tblDataEmpleados');
    container.innerHTML = GlobalLoader;

    let st = document.getElementById('cmbStatus').value;
    let str = '';


    GF.get_data_empleados_listado(GlobalEmpnit,st)
    .then((data)=>{

        data.recordset.map((r)=>{
            let btnAct = `btnAct${r.CODEMPLEADO}`;
            let btnE = `btnE${r.CODEMPLEADO}`;
            str += `
                <tr>
                    <td>${r.NOMPUESTO}</td>
                    <td>${r.NOMEMPLEADO}</td>
                    <td>${r.TELEFONO}</td>
                    <td>${r.USUARIO}
                        <br>
                        <small class="negrita text-danger">Clave: ${r.CLAVE}</small>
                    </td>
                    <td>
                        <small class="negrita text-info">Ped: ${r.CODDOC_ENV}</small>
                        <br>
                        <small class="negrita text-base">Cot: ${r.CODDOC_COT}</small>
                    </td>
                    <td>
                        <button class="btn btn-md btn-circle btn-info hand shadow"
                        onclick="datos_empleado('${r.CODEMPLEADO}','${r.CODPUESTO}','${r.NOMEMPLEADO}','${r.DIRECCION}','${r.TELEFONO}','${r.USUARIO}','${r.CLAVE}','${r.CODDOC_ENV}','${r.CODDOC_COT}')">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <button id='${btnAct}' class="btn btn-md btn-circle btn-outline-info hand shadow"
                        onclick="update_status_empleado('${r.CODEMPLEADO}','${r.ACTIVO}','${btnAct}')">
                            <i class="fal fa-sync"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-md btn-circle btn-danger hand shadow" id="${btnE}"
                        onclick="eliminar_empleado('${r.CODEMPLEADO}','${r.NOMEMPLEADO}','${btnE}')">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `
        })

        container.innerHTML = str;

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos....';

    })


};



function update_status_empleado(codempleado,stActual,idbtn){

        let btn = document.getElementById(idbtn);

        let newSt = '';
        let msn = '';

        if(stActual=='SI'){
            msn = '¿Está seguro que desea DESACTIVAR este empleado?';
            newSt = 'NO';
        }else{
            msn = '¿Está seguro que desea ACTIVAR este empleado?'
            newSt='SI';
        };

        
        F.Confirmacion(msn)
        .then((value)=>{
            if(value==true){

                btn.disabled = true;
                btn.innerHTML = `<i class="fal fa-sync fa-spin"></i>`;

                GF.get_data_empleados_update_st(GlobalEmpnit,codempleado,newSt)
                .then(()=>{

                    btn.disabled = false;
                    btn.innerHTML = `<i class="fal fa-sync"></i>`;
    
                    tbl_empleados();

                })
                .catch(()=>{

                    btn.disabled = false;
                    btn.innerHTML = `<i class="fal fa-sync"></i>`;
    
                })


            }
        })





};

function datos_empleado(codigo,codtipo,nombre,direccion,telefono,usuario,clave,coddocenv,coddoccot){


    $("#modal_empleado").modal('show');


    document.getElementById('txtCodEmp').value = codigo;

    document.getElementById('cmbPuesto').value = codtipo;
    document.getElementById('txtNombre').value = nombre;
    document.getElementById('txtDireccion').value = direccion;
    document.getElementById('txtTelefono').value = telefono;
    document.getElementById('txtUsuario').value = usuario;
    document.getElementById('txtClave').value = clave;
    document.getElementById('cmbCoddocEnv').value = coddocenv;
    document.getElementById('cmbCoddocCot').value = coddoccot;
    



};

function eliminar_empleado(codigo,nombre,idbtn){

    let btn = document.getElementById(idbtn);

    F.Confirmacion(`¿Está seguro que desea ELIMINAR al empleado ${nombre} ?`)
    .then((value)=>{
        if(value==true){


            btn.disabled = true;
            btn.innerHTML = `<i class="fal fa-trash fa-spin"></i>`;

            GF.get_data_empleados_delete(GlobalEmpnit,codigo)
            .then(()=>{

                F.Aviso('Empleado eliminado exitosamente!!');
                tbl_empleados();
            })
            .catch(()=>{

                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-trash"></i>`;
      
            })


        }
    })

};