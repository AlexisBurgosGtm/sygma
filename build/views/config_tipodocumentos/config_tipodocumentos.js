
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
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-2">

                    <h1 class="text-base negrita">Documentos disponibles</h1>
                    
                    <br>
                    <div class="form-group">
                        <label class="negrita text-verde">Escriba para buscar</label>
                        <input type="search" class="form-control negrita text-base" placeholder="Escriba para buscar..." id="txtBuscar" 
                        oninput="F.FiltrarTabla('tblDocumentos','txtBuscar')">
                    </div>

                    <div class="table-responsive col-12">
                        <table class="table table-responsive table-hover h-full" id="tblDocumentos">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>TIPO</td>
                                    <td>CODDOC</td>
                                    <td>CORRELATIVO</td>
                                    <td>DESCRIPCION</td>
                                    <td>F.CONTA CON</td>
                                    <td>F.CONTA CRE</td>
                                    <td>UPD_CORREL</td>
                                    <td>STATUS</td>
                                    <td>EDITAR</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblDataListado">
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
        modal_nuevo:()=>{
            return `
              <div id="modal_nuevo" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-base d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                DATOS DEL DOCUMENTO
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded col-12">
                                <div class="card-body p-4">

                                    <div class="form-group">
                                        <label class="negrita text-base">Tipo de Documento</label>
                                        <select class="form-control negrita" id="cmbTipodocumento">
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="negrita text-base">Descripcion</label>
                                        <input type="text" class="form-control negrita" maxlength="250" id="txtDescripcion"/> 
                                    </div>

                                    <br>
                                    <div class="row">
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="negrita text-base">Serie / Coddoc</label>
                                                <input type="text" class="form-control negrita" maxlength="50" id="txtCoddoc" /> 
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="negrita text-base">Correlativo</label>
                                                <input type="number" class="form-control negrita" id="txtCorrelativo" /> 
                                            </div>
                                        </div>
                                    </div>

                                    <br>
                                    <div class="row">
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="negrita text-base">Formato Contable Contado</label>
                                                <select class="form-control negrita" id="cmbFContaCon">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="negrita text-base">Formato Contable Crédito</label>
                                                <select class="form-control negrita" id="cmbFContaCre">
                                                </select> 
                                            </div>
                                        </div>
                                    </div>

                                    <br>
                                    <div class="row">
                                        <div class="col-6">
                                            <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                                <i class="fal fa-arrow-left"></i>
                                            </button>
                                        </div>
                                        <div class="col-6">
                                            <button class="btn btn-info btn-circle btn-xl hand shadow" id="btnGuardar">
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
                        btnGuardar.innerHTML = `<i class="fal fa-save fa-spin"></i>`;
    
                        classTipodocumentos.edit_tipodocumento(txtCoddoc,txtCorrelativo,txtDescripcion,cmbFContaCon,cmbFContaCre)
                        .then(()=>{
                            
                           
                            F.Aviso("Documento actualizado exitosamente!!");
                            $("#modal_nuevo").modal("hide");

                            btnGuardar.disabled = false;
                            btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;

    
                            get_tbl_documentos();
                        })
                        .catch(()=>{
                            F.AvisoError("No se pudo actualizar");

                            btnGuardar.disabled = false;
                            btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;

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
                            btnGuardar.innerHTML = `<i class="fal fa-save fa-spin"></i>`;
    
                            classTipodocumentos.insert_tipodocumento(cmbTipodocumento,txtCoddoc,txtCorrelativo,txtDescripcion,cmbFContaCon,cmbFContaCre)
                            .then(()=>{
                                
                                F.Aviso("Documento generado exitosamente!!");
                                $("#modal_nuevo").modal("hide");

                                btnGuardar.disabled = false;
                                btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;

                                get_tbl_documentos();
                            })
                            .catch(()=>{
                                F.AvisoError("No se pudo guardar");

                                btnGuardar.disabled = false;
                                btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;
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

            let strClassHabilitado = ""; if(r.HABILITADO=='SI'){strClassHabilitado='btn-success'}else{strClassHabilitado='btn-danger'};
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
                        <td>
                            <button id="${idBtnCorrel}" class="btn btn-primary btn-circle btn-md hand shadow" 
                            onclick="update_correlativo('${r.CODDOC}','${idBtnCorrel}')">
                                <i class="fal fa-spinner"></i>
                            </button>
                        </td>
                        <td>
                            <button id='${idBtnStatus}' class="btn ${strClassHabilitado} btn-circle btn-md hand shadow" 
                                onclick="fcn_set_tipo_status('${r.CODDOC}','${r.HABILITADO}','${idBtnStatus}')">
                                <i class="fal fa-sync"></i>
                            </button>
                        </td>
                         <td>
                            <button class="btn btn-info btn-circle btn-md hand shadow" 
                            onclick="editar_documento('${r.TIPODOC}','${r.CODDOC}','${r.CORRELATIVO}','${r.DESCRIPCION}','${r.CONTA_CON}','${r.CONTA_CRE}')">
                                <i class="fal fa-edit"></i>
                            </button>
                        </td>
                        <td>
                            <button id="${idBtnEliminar}" class="btn btn-danger btn-circle btn-md hand shadow" 
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