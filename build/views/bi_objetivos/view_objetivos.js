
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_objetivo_general() + view.modal_objetivo_general() + view.modal_objetivo_vendedor()}
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

                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                
                    ${view.frag_objetivo_marca()}

                </div>
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                
                    ${view.frag_objetivo_vendedores()}
                
                </div>
                 <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                
                    ${view.frag_objetivo_todos_vendedores()}
                
                </div>


            </div>

           
            `
        },
        frag_objetivo_marca:()=>{
            return `
            
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-2">

                            <h5 class="negrita text-base">OBJETIVO GENERAL</h5>

                            <div class="row">
                                <div class="col-6">
                                    <h5 class="negrita text-danger" id="lbTotalGeneral"></h5>
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
                    
            `
        },
        frag_objetivo_vendedores:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                        <div class="card-body p-2">

                            <h5 class="negrita text-secondary">OBJETIVOS VENDEDORES</h5>

                            <div class="row">
                                <div class="col-6">
                                    <h5 class="negrita text-danger" id="lbTotalVendedores"></h5>
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
            `
        },
        frag_objetivo_todos_vendedores:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                        <div class="card-body p-2">

                            <h5 class="negrita text-secondary">RESUMEN VENDEDORES</h5>

                            <div class="row">
                                <div class="col-6">
                                    <h5 class="negrita text-danger" id="lbTotalVendedoresTodos"></h5>
                                </div>
                                <div class="col-6 text-right">
                                    
                                </div>
                            </div>

                            <br>
                         
                            <div class="table-responsive col-12">
                                <table class="table table-hover h-full">
                                    <thead class="bg-secondary text-white">
                                        <tr>
                                            <td>VENDEDOR</td>
                                            <td>OBJETIVO</td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataVendedorTodos">
                                    </tbody>
                                </table>
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
                                        <label class="negrita">Categoría</label>
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
        modal_objetivo_vendedor:()=>{
            return `
              <div id="modal_vendedor" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                NUEVO OBJETIVO VENDEDOR
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded col-12">
                                <div class="card-body p-4">
                                
                                    <div class="form-group">
                                        <label class="negrita">Vendedor</label>
                                        <select class="negrita form-control" id="cmbVenVendedor">
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label class="negrita">Categoría</label>
                                        <select class="negrita form-control" id="cmbVenMarca">
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label class="negrita">Objetivo</label>
                                        <input type="number" class="negrita form-control text-danger" id="txtVenObjetivo">
                                    </div>


                                    <div class="row">
                                        <div class="col-6">
                                            <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                                <i class="fal fa-arrow-left"></i>
                                            </button>
                                        </div>
                                        <div class="col-6">
                                            <button class="btn btn-info btn-circle btn-xl hand shadow" id="btnVenGuardar">
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


    document.getElementById('cmbMes').addEventListener('change',()=>{
        tbl_objetivos_generales();
        tbl_objetivos_vendedores()
    });

    document.getElementById('cmbAnio').addEventListener('change',()=>{
        tbl_objetivos_generales();
        tbl_objetivos_vendedores()
    });


    let btnGenGuardar =document.getElementById('btnGenGuardar');
    btnGenGuardar.addEventListener('click',()=>{

        F.Confirmacion('¿Está seguro que desea guardar este nuevo objetivo?')
        .then((value)=>{
            if(value==true){

                btnGenGuardar.disabled = true;
                btnGenGuardar.innerHTML = `<i class="fal fa-spin fa-save"></i>`;

                insert_objetivo_general_marca()
                .then(()=>{

                    btnGenGuardar.disabled = false;
                    btnGenGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                    
                    F.Aviso('Objetivo agregado exitosamente!!');

                    tbl_objetivos_generales();

                    $("#modal_general").modal('hide');
     

                })
                .catch(()=>{
                  
                    F.AvisoError('No se pudo agregar el Objetivo');

                    btnGenGuardar.disabled = false;
                    btnGenGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                    

                })

            }
        })



    });

    tbl_objetivos_generales();



    document.getElementById('btnNuevoVendedor').addEventListener('click',()=>{
        $("#modal_vendedor").modal('show');
        limpiar_datos_general();
    });


    GF.get_data_empleados_tipo(3)
    .then((data)=>{
      
        let str = '';
        data.recordset.map((r)=>{
            str += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>`
        })
        document.getElementById('cmbVenVendedor').innerHTML = str;
    })
    .catch(()=>{

    })

    let btnVenGuardar =document.getElementById('btnVenGuardar');
    btnVenGuardar.addEventListener('click',()=>{

        F.Confirmacion('¿Está seguro que desea guardar este nuevo objetivo?')
        .then((value)=>{
            if(value==true){

                btnVenGuardar.disabled = true;
                btnVenGuardar.innerHTML = `<i class="fal fa-spin fa-save"></i>`;

                insert_objetivo_vendedor_marca()
                .then(()=>{

                    btnVenGuardar.disabled = false;
                    btnVenGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                    
                    F.Aviso('Objetivo agregado exitosamente!!');

                    tbl_objetivos_vendedores();

                    tbl_objetivos_vendedores_resumen();

                    $("#modal_vendedor").modal('hide');
     

                })
                .catch(()=>{
                  
                    F.AvisoError('No se pudo agregar el Objetivo');

                    btnVenGuardar.disabled = false;
                    btnVenGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                    

                })

            }
        })



    });


    tbl_objetivos_vendedores();


    tbl_objetivos_vendedores_resumen();


};

function initView(){

    getView();
    addListeners();

};


function limpiar_datos_general(){


    //document.getElementById('cmbGenMarca').value
    document.getElementById('txtGenObjetivo').value = '0'
    document.getElementById('txtVenObjetivo').value = '0'

};


//se cambio de marcas a clasificacions TIPO
function get_combo_marcas(){

        let container = document.getElementById('cmbGenMarca');
        let container2 = document.getElementById('cmbVenMarca');
        

         GF.get_clasificaciones_listado('TIPO')
        .then((data)=>{
            let str = '';
            data.recordset.map((r)=>{
                str += `<option value='${r.CODIGO}'>${r.DESCRIPCION}</option>`
            })
            container.innerHTML = str;
            container2.innerHTML = str
        })
        .catch(()=>{
            container.innerHTML = `<option value='SN'>No se cargó la clasificacion</option>`;
            container2.innerHTML = `<option value='SN'>No se cargó la clasificacion</option>`;
        })
    

        return;

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
                    container2.innerHTML = str;     
                }else{
                    container.innerHTML = `<option value='0'>No se cargó las Marcas</option>`;
                    container2.innerHTML = `<option value='0'>No se cargó las Marcas</option>`;
                }            
            }else{
                container.innerHTML = `<option value='0'>No se cargó las Marcas</option>`;
                container2.innerHTML = `<option value='0'>No se cargó las Marcas</option>`;
            }             
        }, (error) => {
            container.innerHTML = `<option value='0'>No se cargó las Marcas</option>`;
            container2.innerHTML = `<option value='0'>No se cargó las Marcas</option>`;
        });

};



function insert_objetivo_general_marca(){

    return new Promise((resolve,reject)=>{


        let mes = Number(document.getElementById('cmbMes').value);
        let anio = Number(document.getElementById('cmbAnio').value);
        let codmarca = Number(document.getElementById('cmbGenMarca').value || 0);
        let objetivo = Number(document.getElementById('txtGenObjetivo').value || 0);

        axios.post(GlobalUrlCalls + '/objetivos/insert_objetivo_general_marca',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                mes:mes,
                anio:anio,
                codmarca:codmarca,
                objetivo:objetivo
            })
        .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }        
        }, (error) => {
             reject();
        });

    })

      
};



function data_objetivos_generales(){

    return new Promise((resolve,reject)=>{


        let mes = Number(document.getElementById('cmbMes').value);
        let anio = Number(document.getElementById('cmbAnio').value);
       
        //se cambio de marcas a clasificaciones TIPO
        axios.post(GlobalUrlCalls + '/objetivos/select_objetivo_general_marcas',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                mes:mes,
                anio:anio
            })
        .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }        
        }, (error) => {
             reject();
        });

    })

};
function tbl_objetivos_generales(){

    let container = document.getElementById('tblDataGenerales');
    container.innerHTML = GlobalLoader;

    document.getElementById('lbTotalGeneral').innerText = '';

    let varTotal = 0;

    data_objetivos_generales()
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            varTotal += Number(r.OBJETIVO);
            let idbtnEliminar = `btnEliminar${r.CODMARCA}`
            str += `
            <tr>
                <td>${r.DESMARCA}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>
                    <button class="btn btn-md btn-danger hand shadow btn-circle"
                        id="${idbtnEliminar}"
                        onclick="eliminar_marca_general('${r.CODMARCA}','${idbtnEliminar}')"
                    >
                        <i class="fal fa-trash"></i>
                    </button>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalGeneral').innerText = `Total: ${F.setMoneda(varTotal, 'Q')}`;

    })
    .catch((error)=>{
        console.log(error);
        document.getElementById('lbTotalGeneral').innerText = '';
        container.innerHTML = 'No se cargaron datos... ';
    })


};


function data_delete_marca_general(codmarca,mes,anio){

    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/objetivos/delete_objetivo_general_marca',
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
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }        
        }, (error) => {
             reject();
        });

    })

};
function eliminar_marca_general(codmarca,idbtn){

        let btn = document.getElementById(idbtn);

        let mes = Number(document.getElementById('cmbMes').value);
        let anio = Number(document.getElementById('cmbAnio').value);
       
        F.Confirmacion('¿Está seguro que desea ELIMINAR este objetivo?')
        .then((value)=>{
            if(value==true){

                btn.disabled = true;
                btn.innerHTML = `<i class="fal fa-spin fa-trash"></i>`;

                data_delete_marca_general(codmarca,mes,anio)
                .then(()=>{

                    F.Aviso('Objetivo eliminado exitosamente!!');
                    btn.disabled = false;
                    btn.innerHTML = `<i class="fal fa-trash"></i>`;

                    tbl_objetivos_generales();

                })
                .catch(()=>{

                    F.AvisoError('No se pudo eliminar este objetivo');
                    btn.disabled = false;
                    btn.innerHTML = `<i class="fal fa-trash"></i>`;

                })


            }
        })

        

};




function insert_objetivo_vendedor_marca(){

    return new Promise((resolve,reject)=>{


        let mes = Number(document.getElementById('cmbMes').value);
        let anio = Number(document.getElementById('cmbAnio').value);
        let codmarca = Number(document.getElementById('cmbVenMarca').value);
        let objetivo = Number(document.getElementById('txtVenObjetivo').value || 0);
        let codemp = document.getElementById('cmbVenVendedor').value;


        axios.post(GlobalUrlCalls + '/objetivos/insert_objetivo_vendedor_marca',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                mes:mes,
                anio:anio,
                codmarca:codmarca,
                objetivo:objetivo,
                codemp:codemp
            })
        .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }        
        }, (error) => {
             reject();
        });

    })

      
};



function data_objetivos_empleado(){

    return new Promise((resolve,reject)=>{


        let mes = Number(document.getElementById('cmbMes').value);
        let anio = Number(document.getElementById('cmbAnio').value);
       
        axios.post(GlobalUrlCalls + '/objetivos/select_objetivo_vendedores_marcas',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                mes:mes,
                anio:anio
            })
        .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }        
        }, (error) => {
             reject();
        });

    })

};
function tbl_objetivos_vendedores(){


    let container = document.getElementById('tblDataVendedor');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;

    data_objetivos_empleado()
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            varTotal += Number(r.OBJETIVO);
            let idbtnEliminar = `btnElimnVend${r.ID}`
            str += `
            <tr>
                <td>${r.NOMEMP}</td>
                <td>${r.DESMARCA}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>
                    <button class="btn btn-md btn-danger hand shadow btn-circle"
                        id="${idbtnEliminar}"
                        onclick="eliminar_marca_vendedor('${r.ID}','${idbtnEliminar}')"
                    >
                        <i class="fal fa-trash"></i>
                    </button>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalVendedores').innerText = `Total: ${F.setMoneda(varTotal,'Q')}`;
        
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';

        document.getElementById('lbTotalVendedores').innerText = '';

    })


};


function eliminar_marca_vendedor(id,ibtn){




};





function data_objetivos_empleado_resumen(){

    return new Promise((resolve,reject)=>{


        let mes = Number(document.getElementById('cmbMes').value);
        let anio = Number(document.getElementById('cmbAnio').value);
       
        axios.post(GlobalUrlCalls + '/objetivos/select_objetivo_vendedores_marcas_resumen',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                mes:mes,
                anio:anio
            })
        .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }        
        }, (error) => {
             reject();
        });

    })

};
function tbl_objetivos_vendedores_resumen(){


    let container = document.getElementById('tblDataVendedorTodos');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;

    data_objetivos_empleado_resumen()
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            varTotal += Number(r.OBJETIVO);
            str += `
            <tr>
                <td>${r.NOMEMP}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalVendedoresTodos').innerText = `Total: ${F.setMoneda(varTotal,'Q')}`;
        
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';

        document.getElementById('lbTotalVendedoresTodos').innerText = '';

    })


};