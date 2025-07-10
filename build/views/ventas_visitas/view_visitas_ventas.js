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
                        <div class="col-sm-12 col-md-4 col-lg-6 col-xl-6">
                            <h3 class="negrita text-danger">CLIENTES NO VISITADOS</h3>
                            
                            <div class="form-group">
                                <label class="negrita text-secondary"></label>
                                <div class="input-group">
                                    <input type="date" class="form-control negrita text-danger" id="txtFechaInicial">
                                    <input type="date" class="form-control negrita text-danger" id="txtFechaFinal">
                                </div>
                            </div>

                        </div>
                        <div class="col-sm-12 col-md-8 col-lg-6 col-xl-6">
                            <div class="form-group">
                                <label class="negrita text-secondary">Seleccione Sucursal y Empleado</label>
                                <div class="input-group">
                                    <select class="negrita text-base form-control" id="cmbSucursal">
                                    </select>
                                    <select class="negrita text-base form-control" id="cmbEmpleados">
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-6">
                        </div>
                        <div class="col-6">
                            <h4 class="negrita text-danger" id="lbTotalClientes"></h4>
                        </div>
                    </div>

                    <div class="table-responsive col-12">
                        <table class="table table-responsive table-hover col-12" id="tblVisitas">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>FECHA</td>
                                    <td>CLIENTE</td>
                                    <td>MOTIVO</td>
                                    <td>UBIC.VISITA</td>
                                    <td>UBIC.CLIE</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataVisitas">
                            </tbody>
                        </table>
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
   
    document.title = `Clientes Visitados`;


    
    document.getElementById('txtFechaInicial').value = F.getFecha();
    document.getElementById('txtFechaFinal').value = F.getFecha();
    
    
    
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

             if(Number(GlobalNivelUsuario)==3){
                cmbSucursal.disabled = true;
                cmbSucursal.value = GlobalEmpnit;
            }

            get_empleados()
            .then(()=>{
                tbl_visitas();
            })
            .catch(()=>{
                F.Aviso('No se cargaron los Empleados')
            })
           
    })
    .catch(()=>{
        cmbSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
    })


    cmbSucursal.addEventListener('change',()=>{
         try {
                get_empleados()
                .then(()=>{
                    tbl_visitas();
                })
                .catch(()=>{
                    F.Aviso('No se cargaron los Empleados')
                })
         } catch (error) {
            
         }
    });
    document.getElementById('cmbEmpleados').addEventListener('change',()=>{
        tbl_visitas();
    });

    document.getElementById('txtFechaInicial').addEventListener('change',()=>{
        tbl_visitas();
    })
     document.getElementById('txtFechaFinal').addEventListener('change',()=>{
        tbl_visitas();
    })



};

function initView(){

    getView();
    addListeners();

};


function get_empleados(){

    return new Promise((resolve,reject)=>{

        let sucursal = document.getElementById('cmbSucursal').value;

        GF.get_data_empleados_tipo_emp(3,sucursal)
        .then((data)=>{
            let str = '';
            data.recordset.map((r)=>{
                str += `
                <option value='${r.CODEMPLEADO}'>${r.NOMEMPLEADO}</option>
                `
            })
            document.getElementById('cmbEmpleados').innerHTML = str;
            resolve();

        })
        .catch(()=>{
             document.getElementById('cmbEmpleados').innerHTML = `<option value=''>NO SE CARGARON EMPLEADOS</option>`;
             reject();
        })

    })



};



function tbl_visitas(){


        let container = document.getElementById('tblDataVisitas');
        container.innerHTML = GlobalLoader;


        let sucursal = document.getElementById('cmbSucursal').value;
        let codemp = document.getElementById('cmbEmpleados').value;
        let fi = F.devuelveFecha('txtFechaInicial');
        let ff = F.devuelveFecha('txtFechaFinal');
        
        let contador = 0;

        GF.data_clientes_visitados(sucursal,codemp,fi,ff)
        .then((data)=>{

            let str = '';
            data.recordset.map((r)=>{
                contador +=1;
                str += `
                    <tr>
                        <td>${F.convertDateNormal(r.FECHA)}
                            <br>
                            <small>Hora: ${r.HORA}</small>
                        </td>
                        <td>${r.TIPONEGOCIO}-${r.NEGOCIO}
                            <br>
                            ${r.CLIENTE}
                            <br>
                            <small>${r.DIRECCION}</small>
                            <br>
                            <small>${r.DESMUN},${r.DESDEPTO}</small>
                        </td>
                        <td>${r.MOTIVO}</td>
                        <td>
                            <button class="btn btn-circle btn-md btn-info hand shadow"
                            onclick="F.gotoGoogleMaps('${r.LATITUD}','${r.LONGITUD}')">
                                <i class="fal fa-map"></i>
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-circle btn-md btn-secondary hand shadow"
                            onclick="F.gotoGoogleMaps('${r.CLIENTE_LATITUD}','${r.CLIENTE_LONGITUD}')">
                                <i class="fal fa-map"></i>
                            </button>
                        </td>
                    </tr>
                `
            })
            container.innerHTML = str;
            document.getElementById('lbTotalClientes').innerText = `Total clientes: ${contador}`

        })
        .catch(()=>{
            container.innerHTML = 'No se cargaron datos...';
            document.getElementById('lbTotalClientes').innerText = '';

        })




};