
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
                            ${view.vista_empleado()}
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
                    
                    <h4 class="negrita text-base">COBERTURA DE CLIENTES</h4>
                    <br>
                    
                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            
                            <div class="form-group">
                                <label>Sucursal</label>
                                <select class="form-control negrita" id="cmbSucursal">
                                </select>
                            </div>

                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            
                            <div class="form-group">
                                <label>Seleccione Mes y Año</label>
                                <div class="input-group">
                                    <select class="form-control negrita" id="cmbMes">
                                    </select>
                                    <select class="form-control negrita" id="cmbAnio">
                                    </select>
                                </div>
                            </div>

                        </div>
                    </div>
                

                       

                    <hr class="solid">


                    <div class="table-responsive col-12">
                        <table class="table h-full table-bordered col-12">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>VENDEDOR</td>
                                    <td>UNIVERSO</td>
                                    <td>VISITADOS</td>
                                    <td>FALTAN</td>
                                    <td>LOGRADO</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblDataClientes">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            `
        },
        vista_empleado:()=>{
            return `
            <div class="card card-rounded col-12">
                <div class="card-body p-4">
                
                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <h3 class="negrita text-base" id="lbEmpleado"></h3>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <h2 class="negrita text-danger" id="lbEmpleadoTotal"></h2>
                        </div>
                    </div>

                    
                    <br>
                    <div class="form-group">
                        <input type="text"
                        id="txtBuscarEmpleado"
                        class="form-control border-info"
                        placeholder="Escriba para buscar..."
                        oninput="F.FiltrarTabla('tblEmpleado','txtBuscarEmpleado')">
                    </div>

                    <div class="table-responsive">
                        <table class="table table-bordered h-full col-12" id="tblEmpleado">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>VISITA</td>
                                    <td>CLIENTE</td>
                                    <td>DIRECCION</td>
                                    <td>ULTIMA_V</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblDataEmpleado"></tbody>
                        </table>
                    </div>
                
                </div>
            </div>


            <button class="btn btn-bottom-l btn-secondary btn-xl btn-circle hand shadow"
            id="btnAtrasEmpleado">
                <i class="fal fa-arrow-left"></i>
            </button>
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
        GF.get_data_empresas()
        .then((data)=>{
                let str = '';
                data.recordset.map((r)=>{
                    str += `
                        <option value="${r.EMPNIT}">${r.NOMBRE}</option>
                    `
                })
                cmbSucursal.innerHTML = str;
        
                if(Number(GlobalNivelUsuario)==2){
                    cmbSucursal.disabled = true;
                    cmbSucursal.value = GlobalEmpnit;
                };
        
                rpt_cobertura_vendedores();
        })
        .catch(()=>{
            cmbSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
        })

        document.getElementById('cmbMes').innerHTML = F.ComboMeses();
        document.getElementById('cmbMes').value = F.get_mes_curso();
        document.getElementById('cmbMes').addEventListener('change',()=>{
            rpt_cobertura_vendedores();
        });

        document.getElementById('cmbAnio').innerHTML = F.ComboAnio();
        document.getElementById('cmbAnio').value = F.get_anio_curso();
        document.getElementById('cmbAnio').addEventListener('change',()=>{
            rpt_cobertura_vendedores();        
        });


        document.getElementById('btnAtrasEmpleado').addEventListener('click',()=>{
            document.getElementById('tab-uno').click();
            document.getElementById('tblDataEmpleado').innerHTML = '';
        })

};

function initView(){

    getView();
    addListeners();

};



function rpt_cobertura_vendedores(){

    let sucursal = document.getElementById('cmbSucursal').value;
    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;


    let container = document.getElementById('tblDataClientes');
    container.innerHTML = GlobalLoader;


    GF.update_cobertura_empleados(sucursal,mes,anio)
    .then(()=>{

            GF.data_cobertura_empleados(sucursal)
            .then((data)=>{

                let str = '';
                data.recordset.map((r)=>{
                    let logrado = (Number(r.ALCANCE)/Number(r.UNIVERSO))*100;
                    str+=`
                    <tr>
                        <td>${r.NOMEMPLEADO}</td>
                        <td>${r.UNIVERSO}</td>
                        <td>${r.ALCANCE}</td>
                        <td>${Number(r.UNIVERSO)-Number(r.ALCANCE)}</td>
                        <td>
                            <progress class="form-control" value="${logrado}" max="100"></progress><b class="text-success">${logrado.toFixed(2)}%</b>
                        </td>
                        <td>
                            <button class="btn btn-md btn-circle btn-info hand shadow"
                            onclick="get_logro_empleado('${r.CODEMPLEADO}','${r.NOMEMPLEADO}')">
                                <i class="fal fa-list"></i>
                            </button>
                        </td>
                    </tr>
                    `
                })
                container.innerHTML = str;
            })
            .catch(()=>{
                container.innerHTML = 'No se cargaron datos...';
            })
            
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
    })


};


function get_logro_empleado(codemp,nombre){


    document.getElementById('lbEmpleado').innerText = nombre;

    document.getElementById('tab-dos').click();

    tbl_clientes_empleado(codemp);


};
function tbl_clientes_empleado(codemp){

    let container = document.getElementById('tblDataEmpleado');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;

    GF.data_clientes_no_visitados_empleado('',codemp)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            varTotal+=1;
            str += `
                <tr>
                    <td>${r.VISITA}</td>
                    <td>${r.TIPONEGOCIO}-${r.NEGOCIO}
                        <br>
                        ${r.NOMBRE}
                    </td>
                    <td>${r.DIRECCION}
                        <br>
                        <small>${r.MUNICIPIO}</small>
                        <br>
                        <small>${r.ALDEA}</small>
                    </td>
                    <td>${F.convertDateNormal(r.LASTSALE)}</td>
                    <td>
                        <button class="btn btn-md btn-circle btn-info hand shadow"
                        onclick="F.gotoGoogleMaps('${r.LATITUD}','${r.LONGITUD}')">
                            <i class="fal fa-map"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-md btn-circle btn-secondary hand shadow"
                        onclick="F.phone_call('${r.TELEFONO}')">
                            <i class="fal fa-phone"></i>
                        </button>
                    </td>
                </tr>
            `
        })
         container.innerHTML = str;
        document.getElementById('lbEmpleadoTotal').innerText = `Faltan: ${varTotal}`;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
        document.getElementById('lbEmpleadoTotal').innerText = '';
    })




};