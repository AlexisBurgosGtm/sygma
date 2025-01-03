
function getView(){
    let view = {
        body:()=>{
            return `
                ${view.vista_encabezado()}
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado_productos()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           ${view.vista_listado_minmax() + view.modal_detalle()}
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
        vista_encabezado:()=>{
            return `
            <div class="row">
                    <div class="col-1 text-left">
                            <img src="./favicon.png" width="80px" height="80px">
                    </div>
                    <div class="card border-base card-rounded shadow col-11 p-2">
                        
                            <div class="row">
                                <div class="col-4 text-left">   
                                    <label class="text-verde negrita h5" style="font-size:120%">Gestión de Mínimos y Máximos</label>
                                    
                                </div>
                                
                                <div class="col-8 text-right">
                                </div>
                            </div>
                        
                    </div>
                </div>
                <br>
            `
        },
        vista_listado_productos:()=>{
            return `      
                <div class="form-group">
                    <label class="negrita text-base">Escriba para buscar un Producto</label>
                    <div class="input-group">
                        <input type="text" id="txtBuscar" class="form-control negrita text-verde border-verde" placeholder="Escriba para buscar un producto...">
                        <button class="btn btn-info btn-md hand shadow" id="btnBuscar">
                            <i class="fal fa-search"></i>
                        </button>
                    </div>
                </div>                    
                <div class="table-responsive">
                    <table class="table h-full table-hove table-bordered col-12" id="tblProductos">
                        <thead class="bg-base text-white">
                            <tr>
                                <td>CODIGOS</td>
                                <td>PRODUCTO</td>
                                <td>MARCA</td>
                                <td>MODIFICADO</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody id="tblDataProductos"></tbody>
                    </table>
                </div>
            `
        },
        vista_listado_minmax:()=>{
            return `
                <div class="form-group">
                    <h2 class="negrita text-base" id="lbDesprod"></h2>
                    <h4 class="negrita text-danger" id="lbCodprod"></4>
                </div>
                             
                <div class="table-responsive">
                    <table class="table h-full table-hove table-bordered col-12" id="">
                        <thead class="bg-verde text-white">
                            <tr>
                                <td>SUCURSAL</td>
                                <td>MINIMO</td>
                                <td>MAXIMO</td>
                                <td>HABILITADO</td>
                                <td>NOTAS</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody id="tblDataMinmax"></tbody>
                    </table>
                </div>


                <button class="btn btn-circle btn-bottom-l btn-secondary hand shadow btn-xl" onclick="document.getElementById('tab-uno').click()">
                    <i class="fal fa-arrow-left"></i>
                </button>
            `
        },
        modal_detalle:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" id="modal_detalle">
                <div class="modal-dialog modal-dialog-center modal-md">
                    <div class="modal-content">
                        <div class="dropdown-header bg-verde d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="lbEmpresa">
                                Mínimo y Máximo
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                    <div class="form-group">
                                        <label class="negrita text-secondary">Mínimo de Inventario</label>
                                        <input type="number" class="form-control negrita text-base" id="txtMinimo">
                                    </div>


                                     <div class="form-group">
                                        <label class="negrita text-secondary">Máximo de Inventario</label>
                                        <input type="number" class="form-control negrita text-base" id="txtMaximo">
                                    </div>

                                    <div class="form-group">
                                        <label class="negrita text-secondary">Notas</label>
                                        <input type="text" class="form-control negrita text-base" id="txtNotas">
                                    </div>

                                  
                                     <div class="row">
                                        <div class="col-6 text-left">
                                            <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                                <i class="fal fa-arrow-left"></i>
                                            </button>
                                        </div>
                                        <div class="col-6 text-right">
                                            <button class="btn btn-info btn-circle btn-xl hand shadow" id="btnGuardarMinmax">
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
    
    document.title = "Gestión de Mínimos y Máximo";

    F.slideAnimationTabs();





    document.getElementById('btnBuscar').addEventListener('click',()=>{
        get_tbl_producto();
    });

    document.getElementById('txtBuscar').addEventListener('keyup',(e)=>{

        if (e.code === 'Enter') { 
            document.getElementById('btnBuscar').click();
        };
        if (e.code === 13) { 
            document.getElementById('btnBuscar').click();
           
        };



    })




    let btnGuardarMinmax = document.getElementById('btnGuardarMinmax');
    btnGuardarMinmax.addEventListener('click',()=>{


        let minimo = Number(document.getElementById('txtMinimo').value || 0);
        let maximo = Number(document.getElementById('txtMaximo').value || 0);
        let notas = F.limpiarTexto(document.getElementById('txtNotas').value || '');


        F.Confirmacion('¿Está seguro que desea Actualizar estos Mínimos y Máximos?')
        .then((value)=>{
            if(value==true){


                update_minmax(GlobalSelected_empnit,GlobalSelected_Codprod,minimo,maximo,notas)
                .then(()=>{
                    
                    F.Aviso('Datos actualizados exitosamente!!');
                    
                    $("#modal_detalle").modal('hide');

                    get_tbl_minmax(GlobalSelected_Codprod);
                    
                    GlobalSelected_empnit ='';
                    GlobalSelected_Codprod='';
                })
                .catch(()=>{
                    F.AvisoError('No se pudo actualizar los datos')
                })

            }
        })

    })



};

function initView(){

    getView();
    addListeners();

};


function get_precios_producto(codprod,desprod){

    document.getElementById('tab-dos').click();

    document.getElementById('lbDesprod').innerText = desprod;
    document.getElementById('lbCodprod').innerText = codprod;

    get_tbl_minmax(codprod);




}




function get_tbl_producto(){
    
    let filtro = document.getElementById('txtBuscar').value || '';

    if(filtro==''){F.AvisoError('Escriba una descripcion o codigo para buscar');return;}
    

    let container = document.getElementById('tblDataProductos');
    container.innerHTML = GlobalLoader;

    GF.get_data_buscar_producto(filtro)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `
            <tr>
                <td>${r.CODPROD}
                    <br>
                    <small class="negrita text-info">${r.CODPROD2}</small>
                </td>
                <td>${r.DESPROD}</td>
                <td>${r.DESMARCA}</td>
                <td>${F.convertDateNormal(r.LASTUPDATE)}</td>
                <td>
                    <button class="btn btn-circle btn-base btn-md hand shadow" onclick="get_precios_producto('${r.CODPROD}','${r.DESPROD}')">
                        <i class="fal fa-arrow-right"></i>
                    </button>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron los datos....'
    })

};


function get_data_minmax(codprod){

    return new Promise((resolve, reject)=>{
            
        let data = {
            token:TOKEN,
            codprod:codprod
        };

        axios.post(`/inventarios/listado_minmax`, data)
        .then(res => {
            if(res.status.toString()=='200'){
                let data = res.data;
                if(Number(data.rowsAffected[0])>0){
                    resolve(data);             
                }else{
                    reject();
                }            
            }else{
                reject();
            } 
        })
        .catch(()=>{
            reject();
        })

    })

}


function get_tbl_minmax(codprod){

    let container = document.getElementById('tblDataMinmax');
    container.innerHTML = GlobalLoader;


    get_data_minmax(codprod)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            let idHabilitado = `btnHabilitado${r.SUCURSAL}-${r.CODPROD}`
            str += `
            <tr>
                <td>${r.SUCURSAL}</td>
                <td>${r.MINIMO}</td>
                <td>${r.MAXIMO}</td>
                <td>${r.HABILITADO}
                    <input class="hand" type="checkbox"  id="${idHabilitado}" data-on="HABILITADO" data-off="DESHABILITADO" 
                    checked data-toggle="toggle"  data-width="95" data-onstyle="success" data-offstyle="danger"></input>  
                </td>
                <td>${r.NOTAS}</td>

                <td>
                    <button class="btn btn-info btn-circle btn-lg hand shadow" 
                        onclick="get_datos_producto('${r.EMPNIT}','${r.SUCURSAL}','${r.CODPROD}','${r.MINIMO}','${r.MAXIMO}','${r.HABILITADO}','${r.NOTAS}')">
                        <i class="fal fa-edit"></i>
                    </button>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...'
    })

}


function get_datos_producto(empnit,sucursal,codprod,minimo,maximo,habilitado,notas){

    $("#modal_detalle").modal('show');


    GlobalSelected_empnit = empnit;
    GlobalSelected_Codprod = codprod;

    document.getElementById('lbEmpresa').innerText = sucursal;

    document.getElementById('txtMinimo').value = minimo;
    document.getElementById('txtMaximo').value = maximo;

    document.getElementById('txtNotas').value = notas;


};


function update_minmax(empnit,codprod,minimo,maximo,notas){

    return new Promise((resolve, reject)=>{
            
        let data = {
            token:TOKEN,
            codprod:codprod,
            sucursal:empnit,
            minimo:minimo,
            maximo:maximo,
            notas:notas
        };

        axios.post(`/inventarios/update_minmax`, data)
        .then(res => {
            if(res.status.toString()=='200'){
                let data = res.data;
                if(Number(data.rowsAffected[0])>0){
                    resolve(data);             
                }else{
                    reject();
                }            
            }else{
                reject();
            } 
        })
        .catch(()=>{
            reject();
        })

    })

};