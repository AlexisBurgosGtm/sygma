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
            <div class="card card-rounded shadow col-12" id="">
                <div class="card-body p-4">
            
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label class="negrita text-base">Seleccione un Embarque</label>
                                <div class="input-group">
                                    <select class="form-control negrita text-danger negrita border-danger" id="cmbFEmbarques">
                            
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                        
                            <div class="form-group">
                                <label class="negrita text-base">Seleccione mes y año</label>
                                <div class="input-group">
                                    <select class="form-control negrita text-secondary" id="cmbMes">
                                    </select>
                                    <select class="form-control negrita text-secondary" id="cmbAnio">
                                    </select>
                                </div>
                            </div>

                        </div>
                    </div>

                    <br>

                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Productos Bonificados del Embarque</h4>
                            <h5 id="lbProdCodembarqueB"></h5>
                            <br>
                        </div>
                        <div class="col-6">
                            <label class="negrita text-info" id="lbProdTotalPedidosB">Productos:</label>
                            <br>
                            <label class="negrita text-danger" id="lbProdTotalImporteB">Importe:</label>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <div class="form-group">
                            <input type="text" class="form-control col-12 border-info text-info"
                            placeholder="Escriba para buscar..."
                            oninput="F.FiltrarTabla('tblFProductosB','txtBuscar')"
                            id="txtBuscar">
                        </div>

                         <table class="table h-full table-bordered col-12" id="tblFProductosB">
                                <thead class="bg-base text-white negrita">
                                    <tr>
                                        <td>CODIGO</td>
                                        <td>PRODUCTO</td>
                                        <td>UXC</td>
                                        <td>CAJAS</td>
                                        <td>UNIDADES</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataFProductosB"></tbody>

                            </table>

                    </div>

                </div>
            </div>

            <button class="btn btn-bottom-r btn-primary btn-xl btn-circle hand shadow"
            onclick="window.print()">
                <i class="fal fa-print"></i>
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


        document.getElementById('cmbMes').innerHTML = F.ComboMeses();
        document.getElementById('cmbAnio').innerHTML = F.ComboAnio();

        let f = new Date();
        document.getElementById('cmbMes').value = f.getMonth()+1;
        document.getElementById('cmbAnio').value = f.getFullYear();



        document.getElementById('cmbFEmbarques').addEventListener('change',()=>{
            let codembarque = document.getElementById('cmbFEmbarques').value;
            tbl_productos_embarque_bonif(codembarque);
        });

        document.getElementById('cmbMes').addEventListener('change',()=>{
            cargar_embarques();
        });

        document.getElementById('cmbAnio').addEventListener('change',()=>{
            cargar_embarques();
        });

        cargar_embarques();


};

function initView(){

    getView();
    addListeners();

};


function cargar_embarques(){


        let mes = document.getElementById('cmbMes').value;
        let anio = document.getElementById('cmbAnio').value;

        let container = document.getElementById('cmbFEmbarques');
        
        let str = ``;

        GF.get_data_embarques_listado(GlobalEmpnit,'%',mes,anio)
        .then((data)=>{

            data.recordset.map((r)=>{
                str += `
                    <option value='${r.CODEMBARQUE}'>
                        (F:${r.FINALIZADO}) ${r.CODEMBARQUE} <small>(${r.NOMEMPLEADO})</small>
                    </option>
                `
            })
            container.innerHTML = str;

            tbl_productos_embarque_bonif(container.value);

        })
        .catch((error)=>{
            
            container.innerHTML = `<option value='SN'>NO HAY EMBARQUES CON ESA FECHA</option>`;

        })
            


};


function tbl_productos_embarque_bonif(codembarque){

    let container = document.getElementById('tblDataFProductosB');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;

    GF.get_data_embarque_productos_bonif(GlobalEmpnit,codembarque)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
         
            contador +=1;
            varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td>${r.CODPROD}
                    <br>
                        <small>${r.TOTALUNIDADES}</small>
                    </td>
                    <td>${r.DESPROD}
                        <br>
                        <small>${r.DESMARCA}</small>
                    </td>
                    <td>${r.UXC}</td>
                    <td>${r.CAJAS}</td>
                    <td>${r.UNIDADES}</td>
                    <td>${F.setMoneda(r.IMPORTE,'Q')}</td>
                    <td></td>
                </tr>
                `
        })
        container.innerHTML = str;
        document.getElementById('lbProdTotalPedidosB').innerText = `Items: ${contador}`;
        document.getElementById('lbProdTotalImporteB').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbProdTotalPedidosB').innerText = '';
        document.getElementById('lbProdTotalImporteB').innerText = '';
    })


};