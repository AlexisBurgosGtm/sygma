function clasif_titulo(tipo) {
    switch (tipo) {
        case 'MARCA':
            return 'MARCA';
        case 'BI':
            return 'TIPO DE RENTABILIDAD';
        case 'TIPO':
            return 'TIPO DE PRODUCTO';
        case 'LABORATORIO':
            return 'OFERTA DEL PRODUCTO';
        case 'IMPULSO':
            return 'TIPO DE IMPULSO';
        case 'PROGRAMA_SALUD':
            return 'TIPO PROGRAMA DE SALUD';
        case 'RM_MR':
            return 'CLASIFICACIÓN DE MEDIA ROTACIÓN Y RENTABILIDAD';
        case 'RELLENO':
            return 'TIPO DE PRODUCTOS PARA RELLENO';
        default:
            return 'CLASIFICACIÓN';
    }
}

function getView(){
    if (typeof spa_inyectarEstilosPos2 === 'function') spa_inyectarEstilosPos2();

    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado() + view.modal_nuevo() + view.modal_nuevo_marca()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab"></div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab"></div>
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
            <div class="pos2-wrap">
                <div class="pos2-totals-bar">
                    <div class="row align-items-center no-gutters">
                        <div class="col-12 col-lg-4 mb-2 mb-lg-0">
                            <div class="d-flex align-items-center">
                                <img src="./favicon.png" width="36" height="36" alt="" class="mr-2">
                                <div>
                                    <div class="negrita mb-0 pos2-bar-title" style="font-size:0.95rem">Clasificaciones Generales</div>
                                    <div class="small" style="opacity:0.9" id="lbTotalClasif">0 registros</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-4 px-lg-2 mb-2 mb-md-0">
                            <label class="small mb-1" style="opacity:0.9">Clasificación</label>
                            <select class="form-control form-control-sm pos2-search-input negrita" id="cmbTipo">
                                <option value="MARCA">MARCAS</option>
                                <option value="TIPO">TIPO PRODUCTO</option>
                                <option value="LABORATORIO">OFERTA DEL PRODUCTO</option>
                                <option value="IMPULSO">CLASIFICACION 3</option>
                                <option value="PROGRAMA_SALUD">CLASIFICACION 4</option>
                                <option value="RM_MR">CLASIFICACION 5</option>
                                <option value="RELLENO">TIPO DE RELLENO</option>
                                <option class="hidden" value="BI">TIPO DE RENTABILIDAD</option>
                            </select>
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <label class="small mb-1" style="opacity:0.9">Buscar</label>
                            <input type="text" class="form-control form-control-sm pos2-search-input"
                                id="txtBuscarClasif" placeholder="Código o descripción..."
                                oninput="F.FiltrarTabla('tblListado','txtBuscarClasif')">
                        </div>
                    </div>
                </div>

                <div class="pos2-panel-card">
                    <div class="pos2-panel-head">
                        <span class="negrita mb-0"><i class="fal fa-tags mr-1"></i> Catálogo</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="pos2-table-scroll table-responsive">
                            <table class="table table-sm table-hover mb-0 pos2-table-compact" id="tblListado">
                                <thead class="bg-base text-white">
                                    <tr>
                                        <th>CÓDIGO</th>
                                        <th>DESCRIPCIÓN</th>
                                        <th>MARCA ASOCIADA</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="tblDataListado"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <button type="button" class="btn btn-success btn-xl hand shadow btn-circle sygma-fab-nuevo" id="btnNuevo" title="Nuevo">
                <i class="fal fa-plus"></i>
            </button>
            `
        },
        modal_nuevo:()=>{
            return `
            <div class="modal fade modal-backdrop-transparent modal-with-scroll" id="modal_nuevo" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-base text-white py-2">
                            <h5 class="modal-title mb-0" id="lbTitulo">Clasificación</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-4 pos2-doc-compact">
                            <div class="form-group">
                                <label>Descripción</label>
                                <input type="text" class="form-control negrita" id="txtDescripcion">
                            </div>
                            <div class="form-group">
                                <label>Marca asociada</label>
                                <select class="form-control negrita" id="cmbCodMarca"></select>
                            </div>
                            <div class="form-group hidden">
                                <label>Codigo</label>
                                <input type="text" class="form-control negrita" id="txtCodigo">
                            </div>
                            <div class="row mt-3">
                                <div class="col-6">
                                    <button type="button" class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                        <i class="fal fa-arrow-left"></i>
                                    </button>
                                </div>
                                <div class="col-6 text-right">
                                    <button type="button" class="btn btn-base btn-circle btn-xl hand shadow" id="btnGuardar">
                                        <i class="fal fa-save"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        },
        modal_nuevo_marca:()=>{
            return `
            <div class="modal fade modal-backdrop-transparent modal-with-scroll" id="modal_nuevo_marca" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-base text-white py-2">
                            <h5 class="modal-title mb-0" id="lbTituloMarca">Marca</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-4 pos2-doc-compact">
                            <div class="form-group">
                                <label>Marca</label>
                                <input type="text" class="form-control negrita" id="txtDescripcionMarca">
                            </div>
                            <div class="form-group hidden">
                                <label>Objetivo</label>
                                <input type="number" class="form-control negrita" id="txtObjetivoMarca">
                            </div>
                            <div class="form-group hidden">
                                <label>Codigo</label>
                                <input type="text" class="form-control negrita" id="txtCodigoMarca">
                            </div>
                            <div class="row mt-3">
                                <div class="col-6">
                                    <button type="button" class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                        <i class="fal fa-arrow-left"></i>
                                    </button>
                                </div>
                                <div class="col-6 text-right">
                                    <button type="button" class="btn btn-base btn-circle btn-xl hand shadow" id="btnGuardarMarca">
                                        <i class="fal fa-save"></i>
                                    </button>
                                </div>
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

        const strTitulo = clasif_titulo(tipo.value);
        document.getElementById('lbTitulo').innerText = strTitulo;
        document.getElementById('lbTituloMarca').innerText = strTitulo;

        document.getElementById('txtCodigo').value = '';
        document.getElementById('txtDescripcion').value = '';

        if(tipo.value=='MARCA'){
            document.getElementById('txtCodigoMarca').value = '';
            document.getElementById('txtDescripcionMarca').value = '';
            document.getElementById('txtCodigo').value = '';
            document.getElementById('txtObjetivoMarca').value = '0';

            $("#modal_nuevo_marca").modal('show');
        }else{
            $("#modal_nuevo").modal('show');
        }
        

    })


    get_listado(tipo.value);


    let btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click',()=>{
    

        let codigo = document.getElementById('txtCodigo').value;
        let descripcion = document.getElementById('txtDescripcion').value || 'SN';
        let codmarca = document.getElementById('cmbCodMarca').value;


        if(descripcion=='SN'){F.AvisoError('Escriba una descripción de la clasificación a agregar');return;};

        F.Confirmacion('¿Está seguro que desea CREAR/EDITAR esta Clasificación?')
        .then((value)=>{
            if(value==true){

                btnGuardar.disabled = true;
                btnGuardar.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                descripcion = F.limpiarTexto(descripcion);

                if(document.getElementById('txtCodigo').value==''){
                    
                    insert_clasificacion(tipo.value,descripcion,codmarca)
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

                    edit_clasificacion(codigo,descripcion,codmarca)
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



    });


    //

    let btnGuardarMarca = document.getElementById('btnGuardarMarca');
    btnGuardarMarca.addEventListener('click',()=>{
    

        let codigo = document.getElementById('txtCodigoMarca').value;
        let descripcion = document.getElementById('txtDescripcionMarca').value || 'SN';
        let objetivo = document.getElementById('txtObjetivoMarca').value || '0';
       
        if(descripcion=='SN'){F.AvisoError('Escriba una descripción de la clasificación a agregar');return;};

        F.Confirmacion('¿Está seguro que desea CREAR/EDITAR esta Marca?')
        .then((value)=>{
            if(value==true){

                btnGuardarMarca.disabled = true;
                btnGuardarMarca.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                descripcion = F.limpiarTexto(descripcion);

                if(document.getElementById('txtCodigoMarca').value==''){
                    
                    insert_marca(tipo.value,descripcion,objetivo)
                    .then(()=>{
                        
                        F.Aviso('Marca agregada exitosamente!!');
                        
                        btnGuardarMarca.disabled = false;
                        btnGuardarMarca.innerHTML = `<i class="fal fa-save"></i>`;
                    
                        $("#modal_nuevo_marca").modal('hide');
            
                        get_listado(tipo.value);
            
                    })
                    .catch(()=>{
                        F.AvisoError('No se pudo crear la nueva marca');
                        btnGuardarMarca.disabled = false;
                        btnGuardarMarca.innerHTML = `<i class="fal fa-save"></i>`;
                    
    
                    })  

                }else{

                    edit_marca(codigo,descripcion,objetivo)
                    .then(()=>{
                        
                        F.Aviso('Marca actualizada exitosamente!!');
                        
                        btnGuardarMarca.disabled = false;
                        btnGuardarMarca.innerHTML = `<i class="fal fa-save"></i>`;
                    
                        $("#modal_nuevo_marca").modal('hide');
            
                        get_listado(tipo.value);
            
                    })
                    .catch(()=>{
                        F.AvisoError('No se pudo actualizar la marca');
                        btnGuardarMarca.disabled = false;
                        btnGuardarMarca.innerHTML = `<i class="fal fa-save"></i>`;
                    
    
                    })  

                }


               

            }
        })



    })



    GF.get_data_marcas()
    .then((data)=>{
        
        let str = '<option value="0">Sin Marca</option>';
        data.recordset.map((r)=>{
            str += `<option value='${r.CODMARCA}'>${r.DESMARCA}</option>`
        })
        document.getElementById('cmbCodMarca').innerHTML = str;

    })
    .catch(()=>{
        document.getElementById('cmbCodMarca').innerHTML = '<option value="0">Sin Marca</option>';
    })


};


function initView(){

    getView();
    addListeners();
    document.title = 'Clasificaciones Generales';

};


function get_listado(tipo){
    
    let container = document.getElementById('tblDataListado');
    container.innerHTML = `<tr><td colspan="5" class="text-center">${GlobalLoader}</td></tr>`;
    const lbTotal = document.getElementById('lbTotalClasif');
    if (lbTotal) lbTotal.innerText = 'Cargando...';


    GF.get_clasificaciones_listado(tipo)
    .then((data)=>{
        let str = '';
        const rows = (data && data.recordset) ? data.recordset : [];
        rows.forEach((r)=>{
            let btnE = 'btnE' + r.CODIGO.toString();
            const desc = String(r.DESCRIPCION || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            str += `
            <tr>
                <td>${r.CODIGO}</td>
                <td>${r.DESCRIPCION || ''}</td>
                <td>${r.DESMARCA || ''}</td>
                <td>
                    <button type="button" class="btn btn-md btn-circle btn-info hand shadow" title="Editar"
                        onclick="get_clasificacion('${r.CODIGO}','${desc}','${r.PORCENTAJE}','${r.CODMARCA}')">
                        <i class="fal fa-edit"></i>
                    </button>
                </td>
                <td>
                    <button type="button" class="btn btn-md btn-circle btn-danger hand shadow" title="Eliminar"
                        id='${btnE}' onclick="eliminar_clasificacion('${r.CODIGO}','${btnE}')">
                        <i class="fal fa-trash"></i>
                    </button>
                </td>
            </tr>
            `
        })
        container.innerHTML = str || '<tr><td colspan="5" class="text-center text-muted">No hay registros.</td></tr>';
        if (lbTotal) lbTotal.innerText = `${rows.length} registro${rows.length === 1 ? '' : 's'}`;
        const buscar = document.getElementById('txtBuscarClasif');
        if (buscar) buscar.value = '';
    })
    .catch(()=>{
        container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se cargaron datos.</td></tr>';
        if (lbTotal) lbTotal.innerText = '0 registros';
    })
};

function get_clasificacion(codigo,descripcion,objetivo,codmarca){


    let tipo = document.getElementById('cmbTipo').value;
    const strTitulo = clasif_titulo(tipo);

    switch (tipo) {
        case 'MARCA':
            
            document.getElementById('lbTituloMarca').innerText = strTitulo;
            document.getElementById('txtCodigoMarca').value = codigo;
            document.getElementById('txtDescripcionMarca').value = descripcion;
            document.getElementById('txtObjetivoMarca').value = objetivo;
        
            $("#modal_nuevo_marca").modal('show');
            
            break;
    
        default:

            document.getElementById('lbTitulo').innerText = strTitulo;
            document.getElementById('txtCodigo').value = codigo;
            document.getElementById('txtDescripcion').value = descripcion;
            document.getElementById('cmbCodMarca').value = codmarca;
        
            $("#modal_nuevo").modal('show');

            break;
    }

    


  

};

function insert_clasificacion(tipo,descripcion,codmarca){

    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/clasificaciones/insert_clasificacion', {token:TOKEN,tipo:tipo,descripcion:descripcion,codmarca:codmarca})
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

function edit_clasificacion(codigo,descripcion,codmarca){

    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/clasificaciones/edit_clasificacion', {token:TOKEN,
                                                                            codigo:codigo,
                                                                            descripcion:descripcion,
                                                                            codmarca:codmarca})
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


            let tipo = document.getElementById('cmbTipo').value;

            switch (tipo) {
                case 'MARCA':
                   
                delete_marca(codigo)
                .then(()=>{

                    F.Aviso('Marca eliminada exitosamente!!');
                                    
                    btn.disabled = false;
                    btn.innerHTML = `<i class="fal fa-trash"></i>`;
    
                    get_listado(document.getElementById('cmbTipo').value);
                    
                })
                .catch(()=>{
                    F.AvisoError('No se pudo eliminar, verifique si no existen productos asociados a esta marca')
                    btn.disabled = false;
                    btn.innerHTML = `<i class="fal fa-trash"></i>`;
                })

                    
                    break;
            
                default:
        
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
        
                    break;
            }
        
            


          


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


function insert_marca(tipo,descripcion,objetivo){

    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/clasificaciones/insert_marca', {token:TOKEN,descripcion:descripcion,objetivo:objetivo})
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

function edit_marca(codigo,descripcion,objetivo){

    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/clasificaciones/edit_marca', {token:TOKEN,
                                                                            codigo:codigo,
                                                                            descripcion:descripcion,
                                                                            objetivo:objetivo})
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

function delete_marca(codigo){

    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/clasificaciones/delete_marca', {token:TOKEN,codigo:codigo})
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


