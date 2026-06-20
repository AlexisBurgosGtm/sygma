
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
            <div class="sygma-empleados-wrap">
            <div class="card card-rounded shadow sygma-empleados-card">
                <div class="card-body sygma-empleados-card__body">

                    <h3 class="sygma-empleados-title negrita text-base mb-2">LISTADO DE EMPLEADOS</h3>

                    <div class="row sygma-empleados-filtros mx-0">
                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 pl-0 pr-xl-2 pr-lg-2 pr-md-2 pr-sm-0">
                            <div class="form-group sygma-empleados-field mb-2">
                                <label class="sygma-empleados-label text-secondary mb-1">Sucursal / Tipo lista</label>
                                <div class="input-group input-group-sm">
                                    <select class="form-control form-control-sm negrita" id="cmbSucursal"></select>
                                    <select class="form-control form-control-sm negrita text-base" id="cmbStatus">
                                        <option value='SI'>ACTIVOS</option>
                                        <option value='NO'>DESACTIVADOS</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 pr-0 pl-xl-2 pl-lg-2 pl-md-2 pl-sm-0">
                            <div class="form-group sygma-empleados-field mb-2">
                                <label class="sygma-empleados-label text-secondary mb-1">Escriba para buscar:</label>
                                <input type="text"
                                    class="form-control form-control-sm negrita"
                                    id="txtBuscar"
                                    oninput="F.FiltrarTabla('tblEmpleados','txtBuscar')"
                                    placeholder="Escriba para buscar...">
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive sygma-empleados-table-wrap">
                        <table class="table table-bordered table-sm sygma-empleados-table mb-0" id="tblEmpleados">
                            <thead class="bg-base text-white">
                                <tr>
                                    <th>TIPO</th>
                                    <th>NOMBRE</th>
                                    <th>TELEFONO</th>
                                    <th>USUARIO</th>
                                    <th>DOCUMENTOS</th>
                                    <th>RUTA</th>
                                    <th class="sygma-empleados-col-action"></th>
                                    <th class="sygma-empleados-col-action"></th>
                                    <th class="sygma-empleados-col-action"></th>
                                </tr>
                            </thead>
                            <tbody id="tblDataEmpleados"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <button type="button" class="btn btn-success btn-xl btn-circle sygma-fab-nuevo hand shadow" id="btnNuevo" title="Nuevo empleado">
                <i class="fal fa-plus"></i>
            </button>
            </div>
            `
        },
        modal_datos_empleado:()=>{
            return `
              <div id="modal_empleado" class="modal fade sygma-empleados-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable" role="document">
                    <div class="modal-content sygma-empleados-modal__content">
                        <div class="sygma-empleados-modal__header">
                            <h4 class="sygma-empleados-modal__title mb-0">Datos del Empleado</h4>
                            <button type="button" class="sygma-empleados-modal__close" data-dismiss="modal" aria-label="Cerrar">
                                <i class="fal fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-body sygma-empleados-modal__body">

                            <div class="form-group sygma-empleados-field mb-2">
                                <label class="sygma-empleados-label negrita text-secondary mb-1">Puesto (Tipo Empleado)</label>
                                <select class="form-control form-control-sm negrita" id="cmbPuesto"></select>
                            </div>

                            <div class="form-group sygma-empleados-field mb-2">
                                <label class="sygma-empleados-label negrita text-secondary mb-1">Nombre Completo</label>
                                <input type="text" class="form-control form-control-sm negrita" id="txtNombre">
                            </div>

                            <div class="row mx-0">
                                <div class="col-md-8 pl-0 pr-md-2 pr-0">
                                    <div class="form-group sygma-empleados-field mb-2">
                                        <label class="sygma-empleados-label negrita text-secondary mb-1">Dirección</label>
                                        <input type="text" class="form-control form-control-sm negrita" id="txtDireccion">
                                    </div>
                                </div>
                                <div class="col-md-4 pl-md-2 pl-0 pr-0">
                                    <div class="form-group sygma-empleados-field mb-2">
                                        <label class="sygma-empleados-label negrita text-secondary mb-1">Teléfono</label>
                                        <input type="text" class="form-control form-control-sm negrita" id="txtTelefono">
                                    </div>
                                </div>
                            </div>

                            <div class="sygma-empleados-modal__section">
                                <div class="sygma-empleados-modal__section-title negrita text-danger">Acceso a la Plataforma</div>
                                <div class="row mx-0">
                                    <div class="col-md-6 pl-0 pr-md-2 pr-0">
                                        <div class="form-group sygma-empleados-field mb-2 mb-md-0">
                                            <label class="sygma-empleados-label negrita text-secondary mb-1">Usuario</label>
                                            <input type="text" class="form-control form-control-sm negrita" id="txtUsuario">
                                        </div>
                                    </div>
                                    <div class="col-md-6 pl-md-2 pl-0 pr-0">
                                        <div class="form-group sygma-empleados-field mb-0">
                                            <label class="sygma-empleados-label negrita text-secondary mb-1">Clave</label>
                                            <input type="text" class="form-control form-control-sm negrita" id="txtClave">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row mx-0">
                                <div class="col-md-6 pl-0 pr-md-2 pr-0">
                                    <div class="form-group sygma-empleados-field mb-0">
                                        <label class="sygma-empleados-label negrita text-secondary mb-1">Serie Facturas</label>
                                        <select class="form-control form-control-sm negrita" id="cmbCoddocEnv"></select>
                                    </div>
                                </div>
                                <div class="col-md-6 pl-md-2 pl-0 pr-0">
                                    <div class="form-group sygma-empleados-field mb-0">
                                        <label class="sygma-empleados-label negrita text-secondary mb-1">Serie Cotizaciones</label>
                                        <select class="form-control form-control-sm negrita" id="cmbCoddocCot"></select>
                                    </div>
                                </div>
                            </div>

                            <input type="text" id="txtCodEmp" class="hidden" disabled>
                        </div>

                        <div class="sygma-empleados-modal__footer">
                            <button type="button" class="btn btn-secondary btn-sm sygma-empleados-modal__btn hand shadow-sm" data-dismiss="modal">
                                <i class="fal fa-arrow-left mr-1"></i> Volver
                            </button>
                            <button type="button" class="btn btn-base btn-sm sygma-empleados-modal__btn hand shadow-sm" id="btnGuardarEmpleado">
                                <i class="fal fa-save mr-1"></i> Guardar
                            </button>
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
                    btnGuardarEmpleado.innerHTML = `<i class="fal fa-save fa-spin mr-1"></i> Guardando...`;

                    GF.get_data_empleados_insert(GlobalEmpnit,codtipo,nombre,direccion,telefono,usuario,clave,coddoc_env,coddoc_cot)
                    .then(()=>{
                        F.Aviso('Empleado creado exitosamente!!');
                        
                        btnGuardarEmpleado.disabled = false;
                        btnGuardarEmpleado.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar`;
        
                        $("#modal_empleado").modal('hide');
        
                        tbl_empleados();
                    })
                    .catch(()=>{
                        F.AvisoError('No se pudo crear el Empleado');
                        btnGuardarEmpleado.disabled = false;
                        btnGuardarEmpleado.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar`;
        
                    })

                }
            })

           

        }else{
            //EDICION DE EMPLEADO
            F.Confirmacion('¿Está seguro que desea EDITAR a este Empleado?')
            .then((value)=>{
                if(value==true){

                        btnGuardarEmpleado.disabled = true;
                        btnGuardarEmpleado.innerHTML = `<i class="fal fa-save fa-spin mr-1"></i> Guardando...`;
                        
                        GF.get_data_empleados_edit(GlobalEmpnit,codigo,codtipo,nombre,direccion,telefono,usuario,clave,coddoc_env,coddoc_cot)
                        .then(()=>{
                            F.Aviso('Empleado actualizado exitosamente!!');
                            btnGuardarEmpleado.disabled = false;
                            btnGuardarEmpleado.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar`;
            
                            $("#modal_empleado").modal('hide');
                            
                            tbl_empleados();
                        })
                        .catch(()=>{
                            F.AvisoError('No se pudo actualizar el Empleado');
                            btnGuardarEmpleado.disabled = false;
                            btnGuardarEmpleado.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar`;
        
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
                    <td>${r.DESRUTA}</td>
                    <td class="sygma-empleados-col-action text-center text-nowrap">
                        <button type="button"
                            title="Editar empleado"
                            class="sygma-empleados-action-btn sygma-empleados-action-btn--info hand"
                            onclick="datos_empleado('${r.CODEMPLEADO}','${r.CODPUESTO}','${r.NOMEMPLEADO}','${r.DIRECCION}','${r.TELEFONO}','${r.USUARIO}','${r.CLAVE}','${r.CODDOC_ENV}','${r.CODDOC_COT}')">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td class="sygma-empleados-col-action text-center text-nowrap">
                        <button type="button" id="${btnAct}"
                            title="Cambiar status (desactivar/activar)"
                            class="sygma-empleados-action-btn sygma-empleados-action-btn--outline-info hand"
                            onclick="update_status_empleado('${r.CODEMPLEADO}','${r.ACTIVO}','${btnAct}')">
                            <i class="fal fa-sync"></i>
                        </button>
                    </td>
                    <td class="sygma-empleados-col-action text-center text-nowrap">
                        <button type="button"
                            title="Eliminar empleado"
                            class="sygma-empleados-action-btn sygma-empleados-action-btn--danger hand" id="${btnE}"
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