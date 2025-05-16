
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
                    
                    <h3 class="negrita text-danger">INVENTARIO ACTUAL</h3>

                    <div class="row">
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <select class="form-control negrita text-base" id="cmbSt">
                                <option value="SI">PRODUCTOS HABILITADOS</option>
                                <option value="NO">PRODUCTOS NO HABILITADOS</option>
                            </select>
                        </div>
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <h5 id="lbTotalItems"></h5>
                        </div>
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <button class="btn btn-success btn-md hand shadow" id="btnExportarInventario">
                                <i class="fal fa-share"></i> Exportar Excel
                            </button>
                        </div>
                    </div>

                    <div class="table-responsive col-12">
                        <table class="table h-full table-hover col-12" id="tblInventario">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>CODIGO</td>
                                    <td>CODIGO 2</td>
                                    <td>CODIGO 3</td>
                                    <td>PRODUCTO</td>
                                    <td>MARCA</td>
                                    <td>TOTALCOSTO</td>
                                    <td>EXISTENCIA(UNS)</td>
                                    <td>FARDOS</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataInventario">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <button class="btn btn-success btn-circle btn-xl btn-bottom-r hand shadow" id="btnNuevo">
                <i class="fal fa-plus"></i>
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
    

    document.getElementById('btnExportarInventario').addEventListener('click',()=>{

        F.exportTableToExcel('tblInventario','Inventario actual')

    });


    document.getElementById('cmbSt').addEventListener('change',()=>{

        tbl_inventario();
    

    })

    tbl_inventario();
    


};

function initView(){

    getView();
    addListeners();

};


function tbl_inventario(){

        let container = document.getElementById('tblDataInventario');
        container.innerHTML = GlobalLoader;

        let st = document.getElementById('cmbSt').value;

        GF.get_data_inventarios_general(GlobalEmpnit,st)
        .then((data)=>{

            let str = '';
            data.recordset.map((r)=>{
                let totalunidades = Number(r.TOTALUNIDADES);
                let cajas = totalunidades / Number(r.UXC);
                str += `
                <tr>
                    <td>${r.CODPROD}</td>
                    <td>${r.CODPROD2}</td>
                    <td>${r.DESPROD3}</td>
                    <td>${r.DESPROD}</td>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALCOSTO,'Q')}</td>
                    <td>${r.TOTALUNIDADES}</td>
                    <td>${F.setMoneda(cajas,'')}</td>
                </tr>
                `
            })
            container.innerHTML = str;

            F.initit_datatable('tblInventario', true);

        })
        .catch(()=>{

            container.innerHTML = 'No se cargaron datos...';
        })


        

};