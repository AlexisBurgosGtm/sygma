
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_objetivo_general() + view.modal_objetivo_GC() + view.modal_objetivo_vendedor()}
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
                            <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div class="form-group">
                                    <label>Sucursal</label>
                                    <select class="form-control negrita text-secondary" id="cmbSucursal">
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div class="form-group">
                                    <label>Mes</label>
                                    <select class="form-control negrita text-secondary" id="cmbMes">
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
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
                
                    ${view.frag_objetivo_vendedores()}
                
                </div>
                 <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  
                    ${view.frag_objetivo_vendedores_goles_cobertura()}
                
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                
                    ${view.frag_objetivo_marca()}
                    
                    <br>

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
                                <div class="col-6 text-right hidden">
                                   
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
                                
                                <div class="form-group">
                                    <input type="text" 
                                        class="form-control negrita"
                                        placeholder="Escriba para buscar..."
                                        id="txtBuscarVen"
                                        oninput="F.FiltrarTabla('tblObjetivoVendedores','txtBuscarVen')"
                                    >
                                </div>

                                <table class="table table-hover h-full" id="tblObjetivoVendedores">
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

                            <h5 class="negrita text-secondary">RESUMEN VENDEDORES CATEGORIAS</h5>

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
        frag_objetivo_vendedores_goles_cobertura:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                        <div class="card-body p-2">

                            <h5 class="negrita text-secondary">OBJETIVOS COBERTURA Y GOLES</h5>

                            <div class="row">
                                <div class="col-6">
                                    <h5 class="negrita text-danger" id="lbTotalVendedoresTodosGC"></h5>
                                </div>
                                <div class="col-6 text-right">
                                      <button class="btn btn-success hand shadow" id="btnNuevoObjetivoGC">
                                        <i class="fal fa-plus"></i> Agregar Nuevo
                                        </button>
                                </div>
                            </div>

                            <br>
                         
                            <div class="table-responsive col-12">
                                <table class="table table-hover h-full">
                                    <thead class="bg-primary text-white">
                                        <tr>
                                            <td>VENDEDOR</td>
                                            <td>OBJ_GOLES</td>
                                            <td>OBJ_COBERTURA</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataVendedorGC">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
            `
        },
        modal_objetivo_GC:()=>{
            return `
              <div id="modal_gc" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="dropdown-header bg-primary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                NUEVO OBJETIVO GOLES Y COBERTURA
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded col-12">
                                <div class="card-body p-4">
                                
                                    <div class="form-group">
                                        <label class="negrita">Vendedor</label>
                                        <select class="negrita form-control" id="cmbVendedorGC">
                                        </select>
                                    </div>

                                    <br>

                                    <div class="row">
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="negrita">Objetivo Goles</label>
                                                <input type="number" class="negrita form-control text-danger" id="txtObjGoles" value=0>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="negrita">Objetivo Clientes (cobertura)</label>
                                                <input type="number" class="negrita form-control text-danger" id="txtObjCobertura" value=0>
                                            </div>
                                        </div>
                                    </div>

                                    <br><br>
                                   


                                    <div class="row">
                                        <div class="col-6">
                                            <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                                <i class="fal fa-arrow-left"></i>
                                            </button>
                                        </div>
                                        <div class="col-6">
                                            <button class="btn btn-info btn-circle btn-xl hand shadow" id="btnGCGuardar">
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
            cmbSucursal.value = GlobalEmpnit;

            get_grid();
           
    })
    .catch(()=>{
        cmbSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
    })


    cmbSucursal.addEventListener('change',()=>{
        get_grid();
    });

    get_combo_marcas();


    document.getElementById('cmbMes').addEventListener('change',()=>{
         tbl_objetivos_generales();    
        tbl_objetivos_vendedores();
        tbl_objetivos_vendedores_resumen();
        tbl_objetivos_vendedores_gc();
    });

    document.getElementById('cmbAnio').addEventListener('change',()=>{

        tbl_objetivos_generales();    
        tbl_objetivos_vendedores();
        tbl_objetivos_vendedores_resumen();
        tbl_objetivos_vendedores_gc();

    });

    document.getElementById('btnNuevoVendedor').addEventListener('click',()=>{
        $("#modal_vendedor").modal('show');
       
    });

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

                    tbl_objetivos_generales();

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

    let btnNuevoObjetivoGC = document.getElementById('btnNuevoObjetivoGC');
    btnNuevoObjetivoGC.addEventListener('click',()=>{

        $("#modal_gc").modal('show');


        document.getElementById('txtObjGoles').value = '';
        document.getElementById('txtObjCobertura').value = '';



    });

    let btnGCGuardar = document.getElementById('btnGCGuardar');
    btnGCGuardar.addEventListener('click',()=>{

        F.Confirmacion('¿Está seguro que desea Guardar este objetivo?')
        .then((value)=>{
            if(value==true){

                let empleado = document.getElementById('cmbVendedorGC').value;
                let goles =  document.getElementById('txtObjGoles').value || '0';
                let cobertura = document.getElementById('txtObjCobertura').value || '0';


                btnGCGuardar.disabled = true;
                btnGCGuardar.innerHTML = `<i class="fal fa-spin fa-save"></i>`;

                insert_objetivo_general_gc(empleado,goles,cobertura)
                .then(()=>{

                    F.Aviso('Objetivo agregado!!');

                    btnGCGuardar.disabled = false;
                    btnGCGuardar.innerHTML = `<i class="fal fa-save"></i>`;

                    $("#modal_gc").modal('hide');

                    tbl_objetivos_vendedores_gc();



                })
                .catch(()=>{
                    F.AvisoError('No se pudo agregar este objetivo, revise que no exista con este empleado, mes y año')
                
                    btnGCGuardar.disabled = false;
                    btnGCGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                })


            }
        })

    });

};

function initView(){

    getView();
    addListeners();

};

function get_grid(){

            GF.get_data_empleados_tipo_emp(300,cmbSucursal.value)
                .then((data)=>{
                
                    let str = '';
                    data.recordset.map((r)=>{
                        str += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>`
                    })
                    document.getElementById('cmbVenVendedor').innerHTML = str;
                    document.getElementById('cmbVendedorGC').innerHTML = str;

                })
                .catch(()=>{

                })

            tbl_objetivos_generales();
            
            tbl_objetivos_vendedores();

            tbl_objetivos_vendedores_resumen();

            tbl_objetivos_vendedores_gc();


};



//se cambio de marcas a clasificacions TIPO
function get_combo_marcas(){

        //let container = document.getElementById('cmbGenMarca');
        let container2 = document.getElementById('cmbVenMarca');
        

         GF.get_clasificaciones_listado('TIPO')
        .then((data)=>{
            let str = '';
            data.recordset.map((r)=>{
                str += `<option value='${r.CODIGO}'>${r.DESCRIPCION}</option>`
            })

           
            //container.innerHTML = str;
            container2.innerHTML = str;
        })
        .catch((error)=>{
            
            console.log(error)

            //container.innerHTML = `<option value='SN'>No se cargó la clasificacion</option>`;
            container2.innerHTML = `<option value='SN'>No se cargó la clasificacion</option>`;
        })
    

};











function data_objetivos_generales(){

    return new Promise((resolve,reject)=>{


        let mes = Number(document.getElementById('cmbMes').value);
        let anio = Number(document.getElementById('cmbAnio').value);
        let sucursal = document.getElementById('cmbSucursal').value;
       
        //se cambio de marcas a clasificaciones TIPO
        axios.post(GlobalUrlCalls + '/objetivos/select_objetivo_general_categorias',
            {
                sucursal:sucursal,
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
            str += `
            <tr>
                <td>${r.OBJ_DESMARCA}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>
                   
                </td>
            </tr>
            `
        })

        container.innerHTML = str;
        document.getElementById('lbTotalGeneral').innerText = `Total: ${F.setMoneda(varTotal, 'Q')}`;

    })
    .catch((error)=>{
        
        document.getElementById('lbTotalGeneral').innerText = '';
        container.innerHTML = 'No se cargaron datos... ';

    })


};


function data_delete_marca_general(codmarca,mes,anio){

    return new Promise((resolve,reject)=>{

        let sucursal = document.getElementById('cmbSucursal').value;

        axios.post(GlobalUrlCalls + '/objetivos/delete_objetivo_general_marca',
            {
                sucursal:sucursal,
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
        let sucursal = document.getElementById('cmbSucursal').value;
        


        axios.post(GlobalUrlCalls + '/objetivos/insert_objetivo_vendedor_marca',
            {
                sucursal:sucursal,
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
        let sucursal = document.getElementById('cmbSucursal').value;
        

        axios.post(GlobalUrlCalls + '/objetivos/select_objetivo_vendedores_marcas',
            {
                sucursal:sucursal,
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
                        onclick="eliminar_marca_vendedor('${r.ID}','${idbtnEliminar}','${r.NOMEMP}','${r.DESMARCA}')"
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



function data_objetivos_eliminar_id_vendedor(id){

    let sucursal = document.getElementById('cmbSucursal').value;
        

    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/objetivos/delete_objetivo_vendedor_marca',
            {
                sucursal:sucursal,
                token:TOKEN,
                id:id
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


function eliminar_marca_vendedor(id,idbtn,nomven,desmarca){


        let btn = document.getElementById(idbtn);

        F.Confirmacion(`¿Está seguro que desea ELIMINAR este objetivo (${nomven} - ${desmarca})`)
        .then((value)=>{
            if(value==true){

                btn.innerHTML = `<i class="fal fa-trash fa-spin"></i>`;
                btn.disabled = true;

                data_objetivos_eliminar_id_vendedor(id)
                .then(()=>{

                    F.Aviso('Objetivo eliminado exitosamente!!')
                    tbl_objetivos_vendedores();

                })
                .catch(()=>{
        
                    F.AvisoError('No se pudo eliminar este objetivo');

                    btn.innerHTML = `<i class="fal fa-trash"></i>`;
                    btn.disabled = false;

                })
                

            }
        })

};





function data_objetivos_empleado_resumen(){

    return new Promise((resolve,reject)=>{


        let mes = Number(document.getElementById('cmbMes').value);
        let anio = Number(document.getElementById('cmbAnio').value);
       
        let sucursal = document.getElementById('cmbSucursal').value;
        
        axios.post(GlobalUrlCalls + '/objetivos/select_objetivo_vendedores_marcas_resumen',
            {
                sucursal:sucursal,
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





function delete_objetivos_empleado_gc(id){

    return new Promise((resolve,reject)=>{


        let sucursal = document.getElementById('cmbSucursal').value;
        
        axios.post(GlobalUrlCalls + '/objetivos/delete_objetivo_vendedor_goles_cobertura',
            {
                sucursal:sucursal,
                token:TOKEN,
                id:id
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
function eliminar_objetivo_gc(idobjetivo,idbtn){

    let btn = document.getElementById(idbtn);

    F.Confirmacion('¿Está seguro que desea ELIMINAR este objetivo?')
    .then((value)=>{
        if(value==true){

            btn.disabled = true;
            btn.innerHTML = `<i class="fal fa-trash fa-spin"></i>`;

            
            delete_objetivos_empleado_gc(idobjetivo)
            .then(()=>{

                F.Aviso('Objetivo eliminado exitosamente!!');

                tbl_objetivos_vendedores_gc();

            })
            .catch(()=>{
                F.AvisoError('No se pudo eliminar');
                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-trash"></i>`;                
            })




        }
    })


};
function insert_objetivo_general_gc(codemp,goles,cobertura){

    return new Promise((resolve,reject)=>{


        let mes = Number(document.getElementById('cmbMes').value);
        let anio = Number(document.getElementById('cmbAnio').value);
        let sucursal = document.getElementById('cmbSucursal').value;
       
        //se cambio de marcas a clasificaciones TIPO
        axios.post(GlobalUrlCalls + '/objetivos/insert_objetivo_vendedor_goles_cobertura',
            {
                sucursal:sucursal,
                token:TOKEN,
                codemp:codemp,
                mes:mes,
                anio:anio,
                goles:goles,
                cobertura:cobertura
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
function data_objetivos_empleado_gc(){

    return new Promise((resolve,reject)=>{


        let mes = Number(document.getElementById('cmbMes').value);
        let anio = Number(document.getElementById('cmbAnio').value);
       
        let sucursal = document.getElementById('cmbSucursal').value;
        
        axios.post(GlobalUrlCalls + '/objetivos/select_objetivo_vendedor_goles_cobertura',
            {
                sucursal:sucursal,
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
function tbl_objetivos_vendedores_gc(){


    let container = document.getElementById('tblDataVendedorGC');
    container.innerHTML = GlobalLoader;

    let varTotalGoles = 0;
    let varTotalCobertura = 0;

    data_objetivos_empleado_gc()
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{

            
            let btnE = `btnE${r.ID}`;
            varTotalGoles += Number(r.GOLES);
            varTotalCobertura += Number(r.COBERTURA);
            
            str += `
            <tr>
                <td>${r.NOMBRE}</td>
                <td>${r.GOLES}</td>
                <td>${r.COBERTURA}</td>
                <td>
                    <button class="btn btn-md btn-circle btn-danger hand shadow"
                    id="${btnE}"
                    onclick="eliminar_objetivo_gc('${r.ID}','${btnE}')">
                        <i class="fal fa-trash"></i>
                    </button>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalVendedoresTodosGC').innerText = `Goles: ${varTotalGoles} - Cobertura: ${varTotalCobertura}`;
        
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';

        document.getElementById('lbTotalVendedoresTodosGC').innerText = '';

    })


};

