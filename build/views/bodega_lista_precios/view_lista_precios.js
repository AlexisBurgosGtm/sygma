
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
                <div class="card-body p-4">
                    
                    <h3 class="negrita text-danger">LISTA DE PRECIOS</h3>

                    <div class="table-responsive col-12">
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label class="text-secondary">Escriba para Buscar</label>
                                    <input type="text" class="form-control negrita" placeholder="Escriba para filtrar...."
                                    oninput="F.FiltrarTabla('tblListaPrecios','txtBuscar')" id="txtBuscar">
                                </div>
                            </div>
                            <div class="col-6">
                                <br>
                                <button class="btn btn-success btn-md hand shadow" id="btnExportarInventario">
                                    <i class="fal fa-share"></i> Exportar Excel
                                </button>
                            </div>
                        </div>

                      

                        <table class="table table-hover h-full col-12" id="tblListaPrecios">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>CODIGO</td>
                                    <td>CODIGO2</td>
                                    <td>CODIGO3</td>
                                    <td>PRODUCTO</td>
                                    <td>HABILITADO</td>
                                    <td>TIPOPROD</td>
                                    <td>MARCA</td>
                                    <td>CLASIFICACION(TIPO)</td>
                                    <td>MEDIDA</td>
                                    <td>EQUIVALE</td>
                                    <td>COSTO</td>
                                    <td>PRECIO</td>
                                    <td>PRECIO_A</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblDataListaPrecios">

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

    document.getElementById('btnExportarInventario').addEventListener('click',()=>{

        F.exportTableToExcel('tblListaPrecios','Listado de Precios General')

    });

    tbl_lista_precios();

};

function initView(){

    getView();
    addListeners();

};



function tbl_lista_precios(){


    let container = document.getElementById('tblDataListaPrecios');
    container.innerHTML = GlobalLoader;


    GF.get_data_lista_precios(GlobalEmpnit)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
            str += `
            <tr>
                <td>${r.CODIGO}</td>
                <td>${r.CODIGO2}</td>
                <td>${r.CODIGO3}</td>
                <td>${r.PRODUCTO}</td>
                <td>${r.HABILITADO}</td>
                <td>${r.TIPOPROD}</td>
                <td>${r.MARCA}</td>
                <td>${r.CLASIFICACION_TIPO}</td>
                <td>${r.MEDIDA}</td>
                <td>${r.EQUIVALE}</td>
                <td>${F.setMoneda(r.COSTO,'Q')}</td>
                <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                <td>${F.setMoneda(r.PRECIO_A,'Q')}</td>
                <td></td>
            </tr>
            `
        })
        container.innerHTML = str;


    })
    .catch((error)=>{
        
        console.log(error);
        container.innerHTML = 'No se cargaron datos....'


    })




};


