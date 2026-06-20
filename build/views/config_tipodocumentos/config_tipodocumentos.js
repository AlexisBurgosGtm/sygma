
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
            <div class="sygma-empleados-wrap">
            <div class="card card-rounded shadow sygma-empleados-card">
                <div class="card-body sygma-empleados-card__body">

                    <h3 class="sygma-empleados-title negrita text-base mb-2">Documentos disponibles</h3>

                    <div class="form-group sygma-empleados-field mb-2">
                        <label class="sygma-empleados-label negrita text-secondary mb-1">Escriba para buscar</label>
                        <input type="search"
                            class="form-control form-control-sm negrita"
                            placeholder="Escriba para buscar..."
                            id="txtBuscar"
                            oninput="F.FiltrarTabla('tblDocumentos','txtBuscar')">
                    </div>

                    <div class="table-responsive sygma-empleados-table-wrap">
                        <table class="table table-bordered table-sm sygma-empleados-table mb-0" id="tblDocumentos">
                            <thead class="bg-base text-white">
                                <tr>
                                    <th>TIPO</th>
                                    <th>CODDOC</th>
                                    <th>CORRELATIVO</th>
                                    <th>DESCRIPCION</th>
                                    <th>F.CONTA CON</th>
                                    <th>F.CONTA CRE</th>
                                    <th class="sygma-empleados-col-action text-center">UPD_CORREL</th>
                                    <th class="sygma-empleados-col-action text-center">STATUS</th>
                                    <th class="sygma-empleados-col-action text-center">EDITAR</th>
                                    <th class="sygma-empleados-col-action text-center"></th>
                                </tr>
                            </thead>
                            <tbody id="tblDataListado"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <button type="button" class="btn btn-success btn-xl btn-circle sygma-fab-nuevo hand shadow" id="btnNuevo" title="Nuevo documento">
                <i class="fal fa-plus"></i>
            </button>
            </div>
            `
        },
        modal_nuevo:()=>{
            return `
              <div id="modal_nuevo" class="modal fade sygma-empleados-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable" role="document">
                    <div class="modal-content sygma-empleados-modal__content">
                        <div class="sygma-empleados-modal__header">
                            <h4 class="sygma-empleados-modal__title mb-0">Datos del documento</h4>
                            <button type="button" class="sygma-empleados-modal__close" data-dismiss="modal" aria-label="Cerrar">
                                <i class="fal fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-body sygma-empleados-modal__body">

                            <div class="form-group sygma-empleados-field mb-2">
                                <label class="sygma-empleados-label negrita text-secondary mb-1">Tipo de documento</label>
                                <select class="form-control form-control-sm negrita" id="cmbTipodocumento"></select>
                            </div>

                            <div class="form-group sygma-empleados-field mb-2">
                                <label class="sygma-empleados-label negrita text-secondary mb-1">Descripción</label>
                                <input type="text" class="form-control form-control-sm negrita" maxlength="250" id="txtDescripcion">
                            </div>

                            <div class="row mx-0">
                                <div class="col-md-6 pl-0 pr-md-2 pr-0">
                                    <div class="form-group sygma-empleados-field mb-2">
                                        <label class="sygma-empleados-label negrita text-secondary mb-1">Serie / Coddoc</label>
                                        <input type="text" class="form-control form-control-sm negrita" maxlength="50" id="txtCoddoc">
                                    </div>
                                </div>
                                <div class="col-md-6 pl-md-2 pl-0 pr-0">
                                    <div class="form-group sygma-empleados-field mb-2">
                                        <label class="sygma-empleados-label negrita text-secondary mb-1">Correlativo</label>
                                        <input type="number" class="form-control form-control-sm negrita" id="txtCorrelativo">
                                    </div>
                                </div>
                            </div>

                            <div class="row mx-0">
                                <div class="col-md-6 pl-0 pr-md-2 pr-0">
                                    <div class="form-group sygma-empleados-field mb-0">
                                        <label class="sygma-empleados-label negrita text-secondary mb-1">Formato contable contado</label>
                                        <select class="form-control form-control-sm negrita" id="cmbFContaCon"></select>
                                    </div>
                                </div>
                                <div class="col-md-6 pl-md-2 pl-0 pr-0">
                                    <div class="form-group sygma-empleados-field mb-0">
                                        <label class="sygma-empleados-label negrita text-secondary mb-1">Formato contable crédito</label>
                                        <select class="form-control form-control-sm negrita" id="cmbFContaCre"></select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="sygma-empleados-modal__footer">
                            <button type="button" class="btn btn-secondary btn-sm sygma-empleados-modal__btn hand shadow-sm" data-dismiss="modal">
                                <i class="fal fa-arrow-left mr-1"></i> Volver
                            </button>
                            <button type="button" class="btn btn-base btn-sm sygma-empleados-modal__btn hand shadow-sm" id="btnGuardar">
                                <i class="fal fa-save mr-1"></i> Guardar
                            </button>
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

    document.title = "Tipo Documentos";


        F.slideAnimationTabs();


        document.getElementById('btnNuevo').addEventListener('click',()=>{
            //document.getElementById('tab-dos').click();
            $("#modal_nuevo").modal('show');
            fcn_limpiar_datos();
        })


        get_combos();
       
        get_tbl_documentos();


        let btnGuardar = document.getElementById('btnGuardar');
        btnGuardar.addEventListener('click',()=>{

            let coddoc = document.getElementById("txtCoddoc");
            if(coddoc.disabled.toString()=='true'){

                F.Confirmacion("¿Está seguro que desea EDITAR este nuevo Documento?")
                .then((value)=>{
                    if(value==true){
    
                        let txtCoddoc = document.getElementById('txtCoddoc').value || '';
                        let txtCorrelativo = document.getElementById('txtCorrelativo').value || '1';
                        let txtDescripcion = document.getElementById('txtDescripcion').value || 'SN';
                        let cmbFContaCon = document.getElementById('cmbFContaCon').value;
                        let cmbFContaCre = document.getElementById('cmbFContaCre').value;
    
                        btnGuardar.disabled = true;
                        btnGuardar.innerHTML = `<i class="fal fa-save fa-spin mr-1"></i> Guardando...`;
    
                        classTipodocumentos.edit_tipodocumento(txtCoddoc,txtCorrelativo,txtDescripcion,cmbFContaCon,cmbFContaCre)
                        .then(()=>{
                            
                           
                            F.Aviso("Documento actualizado exitosamente!!");
                            $("#modal_nuevo").modal("hide");

                            btnGuardar.disabled = false;
                            btnGuardar.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar`;

    
                            get_tbl_documentos();
                        })
                        .catch(()=>{
                            F.AvisoError("No se pudo actualizar");

                            btnGuardar.disabled = false;
                            btnGuardar.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar`;

                        })
    
                    }
                })

            }else{

                    F.Confirmacion("¿Está seguro que desea Crear este nuevo Documento?")
                    .then((value)=>{
                        if(value==true){



                            let cmbTipodocumento = document.getElementById('cmbTipodocumento').value;
                            let txtCoddoc = document.getElementById('txtCoddoc').value || '';
                            let txtCorrelativo = document.getElementById('txtCorrelativo').value || '1';
                            let txtDescripcion = document.getElementById('txtDescripcion').value || 'SN';
                            let cmbFContaCon = document.getElementById('cmbFContaCon').value;
                            let cmbFContaCre = document.getElementById('cmbFContaCre').value;

                            if(txtCoddoc==''){F.AvisoError("Escriba una serie válida");return;}
                            
                            btnGuardar.disabled = true;
                            btnGuardar.innerHTML = `<i class="fal fa-save fa-spin mr-1"></i> Guardando...`;
    
                            classTipodocumentos.insert_tipodocumento(cmbTipodocumento,txtCoddoc,txtCorrelativo,txtDescripcion,cmbFContaCon,cmbFContaCre)
                            .then(()=>{
                                
                                F.Aviso("Documento generado exitosamente!!");
                                $("#modal_nuevo").modal("hide");

                                btnGuardar.disabled = false;
                                btnGuardar.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar`;

                                get_tbl_documentos();
                            })
                            .catch(()=>{
                                F.AvisoError("No se pudo guardar");

                                btnGuardar.disabled = false;
                                btnGuardar.innerHTML = `<i class="fal fa-save mr-1"></i> Guardar`;
                            })

                        }
                    })

            }

            


        });


};

function initView(){

    getView();
    addListeners();

};


function get_combos(){

        //COMBO TIPO DE DOCUMENTOS
        classTipodocumentos.get_data_tipos()
        .then((data)=>{
            let str = '';
            data.recordset.map((r)=>{
                str += `
                    <option value="${r.TIPODOC}">(${r.TIPODOC}) ${r.DESCRIPCION}</option>
                `
            })
            document.getElementById('cmbTipodocumento').innerHTML = str;
        })
        .catch(()=>{
            document.getElementById('cmbTipodocumento').innerHTML = '';
        })


        F.loadClass('../models/classConta.js','root')
        .then(async()=>{
            //COMBO FORMATO CONTA CON CRE
            classConta.get_data_formatos()
            .then((data)=>{
                let str = '';
                data.recordset.map((r)=>{
                    str += `
                        <option value="${r.CODFORMATO}">${r.DESCRIPCION}</option>
                    `
                })
                document.getElementById('cmbFContaCon').innerHTML = str;
                document.getElementById('cmbFContaCre').innerHTML = str;
            })
            .catch(()=>{
                document.getElementById('cmbFContaCon').innerHTML = '';
                document.getElementById('cmbFContaCre').innerHTML = '';
            })
        })
        

     
        





};

function fcn_limpiar_datos(){
    
    document.getElementById('cmbTipodocumento').disabled = false;
    document.getElementById('txtCoddoc').disabled = false;

    document.getElementById('txtDescripcion').value = '';
    document.getElementById('txtCoddoc').value = '';
    document.getElementById('txtCorrelativo').value = '';


    document.getElementById('cmbFContaCon').value = 'SN';
    document.getElementById('cmbFContaCre').value = 'SN';


};


function get_tbl_documentos(){

    document.getElementById('tblDataListado').innerHTML = GlobalLoader;

    classTipodocumentos.get_tbl_documentos()
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{

            let btnStatusClass = (r.HABILITADO == 'SI') ? 'sygma-empleados-action-btn--success' : 'sygma-empleados-action-btn--danger';
            let idBtnStatus = `btnStatus${r.CODDOC}${r.TIPODOC}`;
            let idBtnEliminar = `btnEliminar${r.ID}`;
            let idBtnCorrel = `btnCorrel${r.ID}`;

            str += `
                    <tr>
                        <td>${r.TIPODOC}</td>
                        <td>${r.CODDOC}</td>
                        <td>${r.CORRELATIVO}</td>
                        <td>${r.DESCRIPCION}</td>
                        <td>${r.CONTA_CON}</td>
                        <td>${r.CONTA_CRE}</td>
                        <td class="sygma-empleados-col-action text-center text-nowrap">
                            <button type="button" id="${idBtnCorrel}" title="Actualizar correlativo"
                                class="sygma-empleados-action-btn sygma-empleados-action-btn--primary hand"
                                onclick="update_correlativo('${r.CODDOC}','${idBtnCorrel}')">
                                <i class="fal fa-spinner"></i>
                            </button>
                        </td>
                        <td class="sygma-empleados-col-action text-center text-nowrap">
                            <button type="button" id="${idBtnStatus}" title="Cambiar status"
                                class="sygma-empleados-action-btn ${btnStatusClass} hand"
                                onclick="fcn_set_tipo_status('${r.CODDOC}','${r.HABILITADO}','${idBtnStatus}')">
                                <i class="fal fa-sync"></i>
                            </button>
                        </td>
                        <td class="sygma-empleados-col-action text-center text-nowrap">
                            <button type="button" title="Editar documento"
                                class="sygma-empleados-action-btn sygma-empleados-action-btn--info hand"
                                onclick="editar_documento('${r.TIPODOC}','${r.CODDOC}','${r.CORRELATIVO}','${r.DESCRIPCION}','${r.CONTA_CON}','${r.CONTA_CRE}')">
                                <i class="fal fa-edit"></i>
                            </button>
                        </td>
                        <td class="sygma-empleados-col-action text-center text-nowrap">
                            <button type="button" id="${idBtnEliminar}" title="Eliminar documento"
                                class="sygma-empleados-action-btn sygma-empleados-action-btn--danger hand"
                                onclick="eliminar_documento('${r.CODDOC}','${idBtnEliminar}')">
                                <i class="fal fa-trash"></i>
                            </button>
                        </td>
                    </tr>
            `
        })

        document.getElementById('tblDataListado').innerHTML = str;
    
    })
    .catch(()=>{

        document.getElementById('tblDataListado').innerHTML = 'No hay datos para mostrar....'
    
    })

};

function fcn_set_tipo_status(coddoc,status,idBtn){

        let btn = document.getElementById(idBtn);

        
        F.Confirmacion('¿Está seguro que desea cambiar el estado actual del Documento?')
        .then((value)=>{
            if(value==true){

                btn.innerHTML = `<i class="fal fa-spin fa-sync">`;
                btn.disabled = true;

                let st = '';
                if(status=='SI'){st='NO'}else{st='SI'};
                
                classTipodocumentos.update_status_documento(coddoc,st)
                .then(()=>{

                    F.Aviso('Documento actualizado exitosamente!!');
    
                    btn.innerHTML = `<i class="fal fa-sync">`;
                    btn.disabled = false;

                    get_tbl_documentos();

                })
                .catch(()=>{

                    F.AvisoError('No se pudo actualizar');

                    btn.innerHTML = `<i class="fal fa-sync">`;
                    btn.disabled = false;
                    
                })

            }
        })

        
};

function eliminar_documento(coddoc,idbtn){

    let btn = document.getElementById(idbtn);

    F.Confirmacion("¿Está seguro que desea ELIMINAR este documento?")
    .then((value)=>{
        if(value==true){

            btn.disabled =true;
            btn.innerHTML = `<i class="fal fa-spin fa-trash"></i>`;
    
            F.showToast("Verificando movimientos del documento...")

            classTipodocumentos.verify_movimientos_tipodocumento(coddoc)
            .then(()=>{
                
                    F.AvisoError("Este documento ya tiene movimientos, no se puede eliminar, debe deshabilitarlo en su lugar");
                    btn.disabled =false;
                    btn.innerHTML = `<i class="fal fa-trash"></i>`;
            })
            .catch(()=>{
                classTipodocumentos.delete_tipodocumento(coddoc)
                .then(()=>{
                    F.Aviso("Documento eliminado exitosamente!!")
                    get_tbl_documentos();
                })
                .catch(()=>{
                    F.AvisoError("No se pudo eliminar el documento. Error en el servidor");
                    btn.disabled =false;
                    btn.innerHTML = `<i class="fal fa-trash"></i>`; 
                })
            })

        }
       
    })

};


function editar_documento(tipodoc,coddoc,correlativo,descripcion,contacon,contacre){


    document.getElementById('cmbTipodocumento').disabled = true;
    document.getElementById('txtCoddoc').disabled = true;

    document.getElementById('txtDescripcion').value = descripcion;
    document.getElementById('txtCoddoc').value = coddoc;
    document.getElementById('txtCorrelativo').value = correlativo;


    document.getElementById('cmbFContaCon').value = contacon;
    document.getElementById('cmbFContaCre').value = contacre;

    $("#modal_nuevo").modal("show");


};


function update_correlativo(coddoc,idbtn){

    F.showToast('Corrigiendo correlativo...');

    let btn = document.getElementById(idbtn);
    btn.disabled = true;
    btn.innerHTML = `<i class="fal fa-spin fa-spinner"></i>`;

    GF.corregir_correlativo_documento(GlobalEmpnit,coddoc)
    .then(()=>{
        F.Aviso('Correlativo corregido exitosamente!!');
        
        btn.disabled = false;
        btn.innerHTML = `<i class="fal fa-spinner"></i>`;
        
        get_tbl_documentos();

    })
    .catch(()=>{
        btn.disabled = false;
        btn.innerHTML = `<i class="fal fa-spinner"></i>`;
        F.AvisoError('No se logro corregir.. Intentelo de nuevo');

    })


};