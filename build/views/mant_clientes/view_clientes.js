
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
                        <div class="col-6">
                        
                            <h3 class="negrita text-base">Catálogo de Clientes</h3>
                        
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
                                <input type="text" class="negrita text-info form-control" placeholder="Escriba para filtrar..." id="txtBuscar" oninput="F.FiltrarTabla('tblClientes','txtBuscar')">
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
                                    <td></td>
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

    
        document.getElementById('cmbTipo').addEventListener('change',()=>{
            tbl_clientes();    
        });


        tbl_clientes();



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
            if(st=='SI'){strClassBtn='btn-danger'}else{strClassBtn='btn-info'};

            contador +=1;
            str += `
            <tr>
                <td>${r.NOMEMPLEADO}</td>
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
                    <button class="btn ${strClassBtn} btn-md btn-circle hand shadow"
                    id="${idbtnE}"
                    onclick="update_status_cliente('${r.CODCLIENTE}','${st}','${idbtnE}')">
                        <i class="fal fa-sync"></i>
                    </button>
                </td>
                <td></td>
            </tr>
            `
        })
        container.innerHTML = str;

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';

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