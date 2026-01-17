
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
                <div class="card-body p-3">
                    
                    <h3 class="negrita text-danger">INVENTARIO ACTUAL</h3>
                    <br>
                    <div class="row">
                        <div class="col-8">
                            <div class="input-group">
                                <select class="form-control negrita text-base" id="cmbSucursal">
                                </select>
                                <select class="form-control negrita text-danger" id="cmbSt">
                                    <option value="SI">PRODUCTOS HABILITADOS</option>
                                    <option value="NO">PRODUCTOS NO HABILITADOS</option>
                                </select>
                            </div>                            
                        </div>
                        <div class="col-4">
                            <button class="btn btn-success btn-md hand shadow" id="btnExportarInventario">
                                <i class="fal fa-share"></i> Exportar Excel
                            </button>
                        </div>
                    </div>
                    <br>

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


    let cmbSucursal = document.getElementById('cmbSucursal');
    GF.get_data_empresas()
    .then((data)=>{

            let str = `<option value="%">TODAS</option>`;

            data.recordset.map((r)=>{
                str += `<option value="${r.EMPNIT}">${r.NOMBRE}</option>`;
            })
            cmbSucursal.innerHTML = str; 
            
            if(Number(GlobalNivelUsuario)==1){

            }else{
                cmbSucursal.value = GlobalEmpnit;
                    
                if(Number(GlobalNivelUsuario)==5){

                }else{
                    cmbSucursal.disabled = true;
                };

            };

             tbl_inventario();

    })
    .catch(()=>{
        cmbSucursal.innerHTML = `<option value="%">No se cargaron las sedes</option>`
    })

    cmbSucursal.addEventListener('change',()=>{
        tbl_inventario();
    });
    

    let btnExportarInventario = document.getElementById('btnExportarInventario');
    btnExportarInventario.addEventListener('click',()=>{

        //F.exportTableToExcel('tblInventario','Inventario actual')

        let st = document.getElementById('cmbSt').value;
        let sucursal = document.getElementById('cmbSucursal').value;

        btnExportarInventario.disabled = true;
        btnExportarInventario.innerHTML = `<i class="fal fa-share fa-spin"></i>`;

        GF.data_inventarios_general_export(sucursal,st)
        .then((data)=>{

            btnExportarInventario.disabled = false;
            btnExportarInventario.innerHTML = `<i class="fal fa-share"></i> Exportar Excel`;
        
            let datos = data.recordset;
            F.export_json_to_xlsx(datos,`Inventario ${F.getFecha().replace('/','.')}`)

        })
        .catch(()=>{
            F.AvisoError('No se pudo exportar');
            btnExportarInventario.disabled = false;
            btnExportarInventario.innerHTML = `<i class="fal fa-share"></i> Exportar Excel`;
        })

        
    });


    document.getElementById('cmbSt').addEventListener('change',()=>{

        tbl_inventario();

    })

    


};

function initView(){

    getView();
    addListeners();

};


function tbl_inventario(){

        let container = document.getElementById('tblDataInventario');
        container.innerHTML = GlobalLoader;

        let sucursal = document.getElementById('cmbSucursal').value;
        let st = document.getElementById('cmbSt').value;

        GF.get_data_inventarios_general(sucursal,st)
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
                    <td>${F.setMoneda((Number(r.COSTO)*Number(r.TOTALUNIDADES)),'Q')}</td>
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