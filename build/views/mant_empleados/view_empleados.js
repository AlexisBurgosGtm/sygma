
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
        modal:()=>{
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
                                <div class="card-body p-2">



                                </div>
                            </div>

                                
                            <div class="row">
                                <div class="col-6">
                                    <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                        <i class="fal fa-arrow-left"></i>
                                    </button>
                                </di>
                                <div class="col-6">
                                    <button class="btn btn-info btn-circle btn-xl hand shadow" id="btnGuardarEmpleado">
                                        <i class="fal fa-save"></i>
                                    </button>
                                </di>
                                
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



    tbl_empleados();




};

function initView(){

    getView();
    addListeners();

};



function tbl_empleados(){

    let container = document.getElementById('tblDataEmpleados');
    container.innerHTML = GlobalLoader;

    let st = document.getElementById('cmbStatus').value;
    let str = '';


    GF.get_data_empleados_listado(GlobalEmpnit,st)
    .then((data)=>{

        data.recordset.map((r)=>{
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
                        <small class="negrita text-info">Clave: ${r.CODDOC_ENV}</small>
                        <br>
                        <small class="negrita text-base">Clave: ${r.CODDOC_COT}</small>
                    </td>
                    <td>
                        <button class="btn btn-md btn-circle btn-info hand shadow"
                        onclick="">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-md btn-circle btn-success hand shadow"
                        onclick="">
                            <i class="fal fa-sync"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-md btn-circle btn-danger hand shadow"
                        onclick="">
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