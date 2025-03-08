
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
                <div class="card-body p-2">

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
                                                <label class="negrita text-secondary">Serie Pedidos</label>
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

                            <br>
                                
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



    document.getElementById('cmbStatus').addEventListener('change',()=>{
        tbl_empleados();    
    });

    document.getElementById('btnNuevo').addEventListener('click',()=>{
        $("#modal_empleado").modal('show');
        clean_data();
    })


    tbl_empleados();




};

function initView(){

    getView();
    addListeners();

};

function clean_data(){

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
                        onclick="">
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
                        <button class="btn btn-md btn-circle btn-danger hand shadow"
                        onclick="F.AvisoError('No disponible')">
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





}