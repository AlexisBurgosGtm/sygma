
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                        
                                ${view.vista_objetivo_general() + view.modal_objetivo_general()}

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
        vista_objetivo_general:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                        <h3 class="negrita text-danger text-center">GESTION DE OBJETIVOS</h3>

                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label>Mes</label>
                                    <select class="form-control negrita text-secondary" id="cmbMes">
                                    </select>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label>Año</label>
                                    <select class="form-control negrita text-secondary" id="cmbAnio">
                                    </select>
                                </div>
                            </div>
                        </div>

                </div>
            </div>

            <br>

            <div class="row">

                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-2">

                            <h5 class="negrita text-danger">OBJETIVO GENERAL</h5>

                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <button class="btn btn-success hand shadow" id="btnNuevoGeneral">
                                        <i class="fal fa-plus"></i> Agregar Nuevo
                                    </button>
                                </div>
                            </div>

                            <br>
                        

                            <div class="table-responsive col-12">
                                <table class="table table-hover h-full" id="tblGenerales">
                                    <thead class="bg-base text-white">
                                        <tr>
                                            <td>MARCA</td>
                                            <td>OBJETIVO</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataGenerales">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-2">

                            <h5 class="negrita text-secondary">OBJETIVOS VENDEDORES</h5>

                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <button class="btn btn-success hand shadow" id="btnNuevoVendedor">
                                        <i class="fal fa-plus"></i> Agregar Nuevo
                                    </button>
                                </div>
                            </div>

                            <br>
                         
                            <div class="table-responsive col-12">
                                <table class="table table-hover h-full">
                                    <thead class="bg-secondary text-white">
                                        <tr>
                                            <td>VENDEDOR</td>
                                            <td>MARCA</td>
                                            <td>OBJETIVO</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataVendedor">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
            
                
                </div>


            </div>

           
            `
        },
        modal_objetivo_general:()=>{
            return `
              <div id="modal_general" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="dropdown-header bg-danger d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                NUEVO OBJETIVO GENERAL
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded col-12">
                                <div class="card-body p-4">
                                
                                    <div class="form-group">
                                        <label class="negrita">Marca</label>
                                        <select class="negrita form-control" id="cmbGenMarca">
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label class="negrita">Objetivo</label>
                                        <input type="number" class="negrita form-control text-danger" id="txtGenObjetivo">
                                    </div>


                                    <div class="row">
                                        <div class="col-6">
                                            <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                                <i class="fal fa-arrow-left"></i>
                                            </button>
                                        </div>
                                        <div class="col-6">
                                            <button class="btn btn-info btn-circle btn-xl hand shadow" id="btnGenGuardar">
                                                <i class="fal fa-save"></i>
                                            </button>
                                        </div>
                                    </div>


                                </div>
                            </div>

                                
                           

                        </div>
                    
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

    
    document.getElementById('cmbMes').innerHTML = F.ComboMeses(); document.getElementById('cmbMes').value = F.get_mes_curso();
    document.getElementById('cmbAnio').innerHTML = F.ComboAnio(); document.getElementById('cmbAnio').value = F.get_anio_curso();
    
    get_combo_marcas();

    
    document.getElementById('btnNuevoGeneral').addEventListener('click',()=>{

        $("#modal_general").modal('show');
        limpiar_datos_general();

    });


     document.getElementById('btnGenGuardar').addEventListener('click',()=>{

        $("#modal_general").modal('hide');
     





    });







};

function initView(){

    getView();
    addListeners();

};


function limpiar_datos_general(){



};


function get_combo_marcas(){

        let container = document.getElementById('cmbGenMarca');
        
        axios.post(GlobalUrlCalls + '/productos/listado_marcas',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN
            })
        .then((response) => {
            if(response.status.toString()=='200'){
                let data = response.data;
                if(Number(data.rowsAffected[0])>0){
                    let str = '';
                    data.recordset.map((r)=>{
                        str += `<option value='${r.CODMARCA}'>${r.DESMARCA}</option>`
                    })
                    container.innerHTML = str;     
                }else{
                    container.innerHTML = `<option value='0'>No se cargó las Marcas</option>`;
                }            
            }else{
                container.innerHTML = `<option value='0'>No se cargó las Marcas</option>`;
            }             
        }, (error) => {
            container.innerHTML = `<option value='0'>No se cargó las Marcas</option>`;
        });

};



function insert_objetivo_general_marca(){

    return new Promise((resolve,reject)=>{


        let mes = 0;
        let anio = 0;
        let codmarca = 0;


        axios.post(GlobalUrlCalls + '/objetivos/insert_objetivo_general_marca',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                mes:mes,
                anio:anio,
                codmarca:codmarca
            })
        .then((response) => {
            if(response.status.toString()=='200'){
                let data = response.data;
                if(Number(data.rowsAffected[0])>0){
                      resolve(data);
                }else{
                    reject();
                }            
            }else{
             reject();
            }             
        }, (error) => {
             reject();
        });

    })

      
}