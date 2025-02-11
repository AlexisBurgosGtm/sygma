function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado() + view.modal_nuevo()}
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
            <div class="card card-rounded shadow border-base">
                <div class="card-body p-4">
                    <div class="row">
                        <div class="col-6">
                            <br>
                            <h5 class="negrita text-base">Clasificaciones Generales</h5>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label class="negrita text-danger">Seleccione una Clasificación</label>
                                <select class="form-control negrita text-verde" id="cmbTipo">
                                    <option value="BI">TIPO DE RENTABILIDAD</option>
                                    <option value="TIPO">TIPO PRODUCTO</option>
                                    <option value="LABORATORIO">CLASIFICACION 2</option>
                                    <option value="IMPULSO">CLASIFICACION 3</option>
                                    <option value="PROGRAMA_SALUD">CLASIFICACION 4</option>
                                    <option value="RM_MR">CLASIFICACION 5</option>
                                    <option value="RELLENO">TIPO DE RELLENO</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

            <br>
            
            <div class="card card-rounded shadow">
                <div class="card-body p-2">
                    <div class="table-responsive col-12">
                        <table class="table table-responsive table-hover col-12" id="tblListado">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>CÓDIGO</td>
                                    <td>DESCRIPCIÓN</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblDataListado">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <button class="btn btn-success btn-xl hand shadow btn-circle btn-bottom-r" id="btnNuevo">
                <i class="fal fa-plus"></i>
            </button>
            `
        },
        modal_nuevo:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" id="modal_nuevo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">

                        <div class="modal-header">
                            <label class="modal-title text-base h3 negrita" id="lbTitulo"></label>
                        </div>
            
                        <div class="modal-body p-4">
                            
                            <div class="form-group">
                                <label>Descripción</label>
                                <input type="text" class="form-control negrita text-verde border-base" id="txtDescripcion">
                            </div>                      

                            <br>

                            <div class="row">
                                    <div class="col-5 text-right">
                                        <button class="btn btn-secondary btn-xl btn-circle hand shadow waves-effect waves-themed" data-dismiss="modal" id="">
                                            <i class="fal fa-arrow-left"></i>
                                        </button>                                
                                    </div>
        
                                    <div class="col-1"></div>
        
                                    <div class="col-5 text-right">
                                        <button class="btn btn-info btn-xl btn-circle hand shadow waves-effect waves-themed" id="btnGuardar">
                                            <i class="fal fa-save"></i>
                                        </button>
                                    </div>
                            </div>
                            
                            <div class="form-group hidden">
                                <label>Codigo</label>
                                <input type="text" class="form-control negrita text-verde" id="txtCodigo">
                            </div>

                        </div>
                    </div>
                </div>
            </div>`
        },
    }

    root.innerHTML = view.body();

};

function addListeners(){

    let tipo = document.getElementById('cmbTipo');
    tipo.addEventListener('change',()=>{
        get_listado(tipo.value);
    })


    let btnNuevo = document.getElementById('btnNuevo');
    btnNuevo.addEventListener('click',()=>{

        let strTitulo = '';
        switch (tipo.value) {
            case 'BI':
                strTitulo = `TIPO DE RENTABILIDAD`
                break;
            case 'TIPO':
                strTitulo = `TIPO DE PRODUCTO`
                break;
            case 'LABORATORIO':
                strTitulo = `TIPO DE LABORATORIO`
                break;       
         
            case 'IMPULSO':
                strTitulo = `TIPO DE IMPULSO`
                break;
            case 'PROGRAMA_SALUD':
                strTitulo = `TIPO PROGRAMA DE SALUD`
                break;
            case 'RM_MR':
                strTitulo = `CLASIFICACIÓN DE MEDIA ROTACIÓN Y RENTABILIDAD`
                break;
            case 'RELLENO':
                strTitulo = `TIPO DE PRODUCTOS PARA RELLENO`
                break;
            default:
                break;
        }

        document.getElementById('lbTitulo').innerText = strTitulo;

        document.getElementById('txtCodigo').value = '';
        document.getElementById('txtDescripcion').value = '';;

        $("#modal_nuevo").modal('show');

    })


    get_listado(tipo.value);


    let btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click',()=>{
    

        let codigo = document.getElementById('txtCodigo').value;
        let descripcion = document.getElementById('txtDescripcion').value || 'SN';
        if(descripcion=='SN'){F.AvisoError('Escriba una descripción de la clasificación a agregar');return;};

        F.Confirmacion('¿Está seguro que desea CREAR/EDITAR esta Clasificación?')
        .then((value)=>{
            if(value==true){

                btnGuardar.disabled = true;
                btnGuardar.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                descripcion = F.limpiarTexto(descripcion);

                if(document.getElementById('txtCodigo').value==''){
                    
                    insert_clasificacion(tipo.value,descripcion)
                    .then(()=>{
                        
                        F.Aviso('Clasificación agregada exitosamente!!');
                        
                        btnGuardar.disabled = false;
                        btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                    
                        $("#modal_nuevo").modal('hide');
            
                        get_listado(tipo.value);
            
                    })
                    .catch(()=>{
                        F.AvisoError('No se pudo crear la nueva clasificación');
                        btnGuardar.disabled = false;
                        btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                    
    
                    })  

                }else{

                    edit_clasificacion(codigo,descripcion)
                    .then(()=>{
                        
                        F.Aviso('Clasificación actualizada exitosamente!!');
                        
                        btnGuardar.disabled = false;
                        btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                    
                        $("#modal_nuevo").modal('hide');
            
                        get_listado(tipo.value);
            
                    })
                    .catch(()=>{
                        F.AvisoError('No se pudo actualizar la clasificación');
                        btnGuardar.disabled = false;
                        btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                    
    
                    })  

                }


               

            }
        })



    })





};


function initView(){

    getView();
    addListeners();

};


function get_listado(tipo){
    
    let container = document.getElementById('tblDataListado');
    container.innerHTML = GlobalLoader;


    GF.get_clasificaciones_listado(tipo)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            let btnE = 'btnE' + r.CODIGO.toString();
            str += `
            <tr>
                <td>${r.CODIGO}</td>
                <td>${r.DESCRIPCION}</td>
                <td>
                    <button class="btn btn-circle btn-info hand shadow" onclick="get_clasificacion('${r.CODIGO}','${r.DESCRIPCION}')">
                        <i class="fal fa-edit"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-circle btn-danger hand shadow" id='${btnE}' onclick="eliminar_clasificacion('${r.CODIGO}','${btnE}')">
                        <i class="fal fa-trash"></i>
                    </button>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
    })
    .catch(()=>{
        //F.AvisoError('No se pudo cargar la lista');
        container.innerHTML = 'No se cargaron datos..'
    })
};

function get_clasificacion(codigo,descripcion){

    document.getElementById('txtCodigo').value = codigo;
    document.getElementById('txtDescripcion').value = descripcion;

    $("#modal_nuevo").modal('show');

};

function insert_clasificacion(tipo,descripcion){

    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/clasificaciones/insert_clasificacion', {token:TOKEN,tipo:tipo,descripcion:descripcion})
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

};

function edit_clasificacion(codigo,descripcion){

    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/clasificaciones/edit_clasificacion', {token:TOKEN,
                                                                            codigo:codigo,
                                                                            descripcion:descripcion})
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

};

function eliminar_clasificacion(codigo,ibBtn){

    F.Confirmacion('¿Está seguro que desea ELIMINAR esta clasificación?')
    .then((value)=>{
        if(value==true){

            let btn = document.getElementById(ibBtn);
            
            btn.disabled = true;
            btn.innerHTML = `<i class="fal fa-trash fa-spin"></i>`;

            delete_clasificacion(codigo)
            .then(()=>{
                F.Aviso('Clasificación eliminada exitosamente!!');
                                
                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-trash"></i>`;

                get_listado(document.getElementById('cmbTipo').value);
                
            })
            .catch(()=>{
                F.AvisoError('No se pudo eliminar, verifique si no existen productos asociados a esta clasificación')
                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-trash"></i>`;
            })


        }
    })

};

function delete_clasificacion(codigo){

    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/clasificaciones/delete_clasificacion', {token:TOKEN,codigo:codigo})
        .then((response) => {
           
            if(response.data.toString()=='error'){
                reject();
            }else{
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
            }
                    
        }, (error) => {
            reject();
        });
    })

};


