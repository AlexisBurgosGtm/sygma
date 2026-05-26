function getView(){
    let view = {
        body:()=>{
            return `
               <div class="row">                
                    ${view.menu_superior()}            
                </div>
                <br>

                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active fixed" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.panel_inicio() }
                            
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           ${view.productos_relleno() + view.modal_existencia_sucursales()}
                            
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.documentos_pendientes() + view.modal_documento_detalle()}
                        </div>  
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            
                        </div>  
                        <div class="tab-pane fade" id="cinco" role="tabpanel" aria-labelledby="home-tab">
                            
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
                         <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-cuatro" data-toggle="tab" href="#cuatro" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>  
                         <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-cinco" data-toggle="tab" href="#cinco" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>           
                    </ul>
                </div>
               
            `
        },
        menu_superior:()=>{
            return `
            <div class="card card-rounded col-12 border-base text-base">
                <div class="card-body">
                    <div class="row">
                        <div class="col-3">
                            <img src="./favicon.png" width="50" height="50">
                        </div>
                        <div class="col-9">
                            <h5 class="negrita">Inicio Compras (Administracion)</h5>
                        </div>
                    </div>
                    
                </div>
            </div>
            `;
        },
        panel_inicio:()=>{
            return `
            <div class="row p-4">
                <div class="col-4">

                    <div class="hand shadow p-3 bg-danger-300 rounded overflow-hidden position-relative text-white mb-g" onclick="document.getElementById('tab-dos').click()">
                        <div class="">
                            <h3 class="display-4 d-block l-h-n m-0 fw-500" id="lbTotalRelleno">
                                0
                                <small class="m-0 l-h-n">Productos en mínimo</small>
                            </h3>
                        </div>
                        <i class="fal fa-box position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" style="font-size:6rem"></i>
                    </div>

                </div>

                <div class="col-4">

                    <div class="hand shadow p-3 bg-info-300 rounded overflow-hidden position-relative text-white mb-g" onclick="document.getElementById('tab-tres').click()">
                        <div class="">
                            <h3 class="display-4 d-block l-h-n m-0 fw-500" id="lbTotalDocumentosPendientes">
                                0
                                <small class="m-0 l-h-n">Documentos pendientes</small>
                            </h3>
                        </div>
                        <i class="fal fa-list position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" style="font-size:6rem"></i>
                    </div>
                  
                </div>

                <div class="col-4">

                    
                    
                </div>
            </div>



             <div class="row hidden">
                <div class="col-4">

                    <div class="card border-base card-rounded shadow col-12">
                        <div class="card-body p-4">
                        </div>
                    </div>

                </div>

                <div class="col-4">

                    <div class="card border-base card-rounded shadow col-12">
                        <div class="card-body p-4">
                        </div>
                    </div>

                </div>

                <div class="col-4">

                    <div class="card border-base card-rounded shadow col-12">
                        <div class="card-body p-4">
                        </div>
                    </div>
                    
                </div>
            </div>
            `
        },
        productos_relleno:()=>{
            return `                   
                    <div class="card border-base card-rounded shadow col-12">
                        <div class="card-body p-2">
                               <h3 class="negrita text-base">Surtido pendiente por Sucursal</h3>
                               <div class="text-right">
                                    <h4 class="negrita text-danger" id="lbTotalPendientes"></h4>
                               </div>
                               <div class="form-group">
                                    <label class="negrita text-secondary">Seleccione la Sucursal a consultar</label>
                                    <div class="input-group">
                                        <select class="form-control" id="cmbSucursal">
                                        </select>
                                        <select class="form-control negrita text-base border-base" id="cmbTipoRentabilidad">
                                        </select>
                                    </div>
                               </div>
                               
                               <div class="table-responsive">
                                    
                                    <div class="form-group">
                                        <label class="negrita text-base">Escriba para filtrar</label>
                                        <input type="text" id="txtBuscarSurtido" class="form-control negrita text-verde" oninput="F.FiltrarTabla('tblSurtido','txtBuscarSurtido')">
                                    </div>

                                    <table class="table h-full table-hove table-bordered h-full" id="tblSurtido">
                                        <thead class="bg-base text-white">
                                            <tr>
                                                <td>PRODUCTO</td>
                                                <td>MARCA</td>
                                                <td>MIN</td>
                                                <td>MAX</td>
                                                <td>EXISTENCIA</td>
                                                <td>RELLENO</td>
                                                <td>ULTIMO</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataSurtido"></tbody>
                                    </table>
                               </div>
                                        
                        </div>
                    </div>
                

             


                    <button class="btn btn-secondary btn-circle btn-circle btn-bottom-l btn-xl hand shadow" onclick="document.getElementById('tab-uno').click()">
                        <i class="fal fa-arrow-left"></i>
                    </button>
            `;
        },
        modal_existencia_sucursales:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" id="modal_existencia_sucursales">
                <div class="modal-dialog modal-dialog-center modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-base d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Existencias en todas las sucursales
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="row">
                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    
                                    <div class="card card-rounded">
                                        <div class="card-body p-4">

                                            <h3 class="negrita text-verde" id="lbDesprodSucursales"></h3>
                                            <h5 class="negrita text-secondary" id="lbDesmarcaSucursales"></h5>
                                        
                                            <table class="table table-responsive h-full f-med" id="">
                                                <thead class="negrita bg-base text-white">
                                                    <tr>
                                                        <td>SUCURSAL</td>
                                                        <td>MINIMO</td>
                                                        <td>MAXIMO</td>
                                                        <td>EXISTENCIA</td>
                                                        <td>RELLENO</td>
                                                    </tr>
                                                </thead>
                                                <tbody id="tblDataSucursales">
                                                            
                                                </tbody>
                                                <tfoot id="tblFooterSucursales" class="border-base text-base negrita">
                                                
                                                </tfoot>
                                            </table>


                                        </div>
                                    </div>

                                </div>

                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    
                                    <div class="card card-rounded">
                                        <div class="card-body p-4">

                                            <h5 class="negrita text-ver">Documentos pendientes del producto</h5>
                                        
                                            <table class="table table-responsive h-full f-med" id="">
                                                <thead class="negrita bg-verde text-white">
                                                    <tr>
                                                        <td>FECHA</td>
                                                        <td>DOCUMENTO</td>
                                                        <td>CANTIDAD SOLICITADA</td>
                                                    </tr>
                                                </thead>
                                                <tbody id="tblDataDocumentosProducto">
                                                            
                                                </tbody>
                                               
                                            </table>

                                        </div>
                                    </div>

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
        },
        documentos_pendientes:()=>{
            return `             
                    <div class="card border-base card-rounded shadow col-12">
                        <div class="card-body p-2">

                            <h2 class="text-verde negrita">Seguimiento de Documentos</h2>
                             <div class="text-right">
                                <h4 class="negrita text-danger" id="lbTotalDocumentos"></h4>
                            </div>

                            <div class="form-group">
                                <select class="negrita text-verde form-control" id="cmbTipoDoc">
                                    <option value="REQ">REQUISICIONES PENDIENTES</option>
                                    <option value="ORC">ORDENES DE COMPRA PENDIENTES</option>
                                </select>
                            </div>

                           

                                <div class="table-responsive">
                                    <table class="table h-full table-hove table-bordered h-full">
                                        <thead class="bg-verde text-white">
                                            <tr>
                                                <td>DOCUMENTO</td>
                                                <td>FECHA</td>
                                                <td>PROVEEDOR</td>
                                                <td>IMPORTE</td>
                                                <td>ETIQUETA</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataDocumentos"></tbody>
                                    </table>
                               </div>
                                            
                        </div>
                    </div>

                    <button class="btn btn-secondary btn-circle  btn-xl btn-bottom-l hand shadow" onclick="document.getElementById('tab-uno').click()">
                        <i class="fal fa-arrow-left"></i>
                    </button>
            `;
        },
        modal_documento_detalle:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" id="modal_detalle_documento">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Detalle del Documento
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-2">

                                    <h5 class="negrita text-secondary" id="lbProveedorDoc"></h5>
                                    <h5 class="negrita text-secondary" id="lbNitDoc"></h5>
                                    <h5 class="negrita text-base" id="lbDocumento"></h5>

                                    <table class="table table-responsive h-full f-med" id="">
                                        <thead class="negrita bg-secondary text-white">
                                            <tr>
                                                <td>PRODUCTO</td>
                                                <td>MARCA</td>
                                                <td>CANTIDAD</td>
                                                <td>COSTO</td>
                                                <td>SUBTOTAL</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataDetalleDocumento">
                                                    
                                        </tbody>
                                    </table>


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
        },
    }

    root.innerHTML = view.body();

};



function addListeners(){

    
    document.title = "Inicio Compras";

    F.slideAnimationTabs();

    let cmbTipoDoc = document.getElementById('cmbTipoDoc');
    
    let cmdSucursal = document.getElementById('cmbSucursal');

    GF.get_data_empresas()
    .then((data)=>{
        let str = '<option value="TODAS">TODAS LAS SUCURSALES</option>';
        data.recordset.map((r)=>{
            str += `
                <option value="${r.EMPNIT}">${r.NOMBRE}</option>
            `
        })
        cmdSucursal.innerHTML = str;
        get_tbl_surtido(cmbSucursal.value); 
        get_tbl_documentos(cmbSucursal.value,cmbTipoDoc.value) 
    })
    .catch(()=>{
        cmdSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
    })
    


    cmdSucursal.addEventListener('change',()=>{
        get_tbl_surtido(cmbSucursal.value);
        get_tbl_documentos(cmbSucursal.value,cmbTipoDoc.value)   
    })

    cmbTipoDoc.addEventListener('change',()=>{
        get_tbl_documentos(cmbSucursal.value,cmbTipoDoc.value)   
    })


    get_total_rellenos()
    .then((data)=>{
       document.getElementById('lbTotalRelleno').innerHTML = `${F.setMoneda(data.recordset[0].CONTEO,'').replace('.00','')}<small class="m-0 l-h-n">Productos en mínimo</small>` 
    })
    .catch(()=>{
        document.getElementById('lbTotalRelleno').innerText = '----'
    })

    GF.get_clasificaciones_listado('BI')
    .then((data)=>{

        let str = "<option value='0'>TODAS</option>";
        
        data.recordset.map((r)=>{
            str += `<option value='${r.CODIGO}'>${r.DESCRIPCION}</option>`
        })
        document.getElementById('cmbTipoRentabilidad').innerHTML = str;
    })
    .catch(()=>{
        document.getElementById('cmbTipoRentabilidad').innerHTML = '';
    })
 
   
};

function initView(){

    getView();
    addListeners();

};


function get_data_surtido(empnit,tipobi){
    return new Promise((resolve, reject)=>{
        
        let data = {
            token:TOKEN,
            sucursal:empnit,
            tipobi:tipobi
        };

        axios.post(`/compras/surtido_sucursales`, data)
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

function get_tbl_surtido(empnit){


    let container = document.getElementById('tblDataSurtido');
    container.innerHTML = GlobalLoader;
    let lbTotal = document.getElementById('lbTotalPendientes');
    lbTotal.innerText = '---'


    let tipobi = document.getElementById('cmbTipoRentabilidad').value;

    let contador = 0;

   

    get_data_surtido(empnit,tipobi)
    .then((data)=>{
        
        let str = '';
        data.recordset.map((r)=>{
            contador +=1;
          
            str +=`
                <tr>
                    <td>${r.DESPROD}
                        <br>
                        <small class="negrita text-base">${r.CODPROD}</small>
                    </td>
                    <td>${r.DESMARCA}</td>
                    <td>${r.MINIMO}</td>
                    <td>${r.MAXIMO}</td>
                    <td class="negrita">${r.EXISTENCIA}</td>
                    <td class="negrita text-danger">${r.RELLENO}</td>
                    <td>${F.convertDateNormal(r.LASTUPDATE)}</td>
                    <td>
                        <button class="btn btn-base btn-circle btn-md hand shadow" onclick="get_existencia_sucursales('${r.CODPROD}','${r.DESPROD}','${r.DESMARCA}')">
                            <i class="fal fa-box"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
        lbTotal.innerText = `Pendientes surtir ${contador}`;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...'
        lbTotal.innerText = '---'
    })


}





function get_data_documentos(empnit,tipo){

    return new Promise((resolve, reject)=>{
        
        let data = {
            sucursal:empnit,
            tipo:tipo,
            token:TOKEN
        };

        axios.post(`/compras/documentos_pendientes`, data)
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

function get_tbl_documentos(empnit,tipo){


    let container = document.getElementById('tblDataDocumentos');
    container.innerHTML = GlobalLoader;
    let lbTotal = document.getElementById('lbTotalDocumentos');
    lbTotal.innerText = '---'

    let contador = 0;

    get_data_documentos(empnit,tipo)
    .then((data)=>{  
        let str = '';
        data.recordset.map((r)=>{
            contador +=1;
            str +=`
                <tr>
                    <td>${r.CODDOC}-${r.CORRELATIVO}
                        <br>
                        <small class="negrita">${r.EMPNIT}</small>
                    </td>
                    <td>${F.convertDateNormal(r.FECHA)}
                        <br>
                        <small class="negrita text-verde">H: ${r.HORA}</small>
                    </td>
                    <td>${r.DOC_NOMCLIE}
                        <br>
                        <small class="negrita text-base">NIT: ${r.DOC_NIT}</small>
                    </td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    <td>${r.ETIQUETA}</td>
                    <td>
                        <button class="btn btn-verde btn-circle btn-md hand shadow" onclick="get_detalle_documento('${r.EMPNIT}','${r.CODDOC}','${r.CORRELATIVO}','${r.DOC_NIT}','${r.DOC_NOMCLIE}')">
                            <i class="fal fa-list"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
        lbTotal.innerText = `Documentos pendientes ${contador}`;
        document.getElementById('lbTotalDocumentosPendientes').innerHTML = `${contador}<small class="m-0 l-h-n">Documentos pendientes</small>`;
    })
    .catch((err)=>{
        console.log(err)
        container.innerHTML = 'No se cargaron datos...'
        lbTotal.innerText = '---'
        document.getElementById('lbTotalDocumentosPendientes').innerHTML = '----'
    })


}


function get_detalle_documento(empnit,coddoc,correlativo,nit,proveedor){

        $("#modal_detalle_documento").modal('show');

        document.getElementById('lbProveedorDoc').innerText = `${proveedor}`;
        document.getElementById('lbNitDoc').innerText = `${nit}`;
        document.getElementById('lbDocumento').innerText = `${coddoc}-${correlativo}`;

        let container = document.getElementById('tblDataDetalleDocumento');
        container.innerHTML = GlobalLoader;

       

        GF.get_data_detalle_documento(empnit,coddoc,correlativo)
        .then((data)=>{
            let str = '';
            data.recordset.map((r)=>{
                str += `
                    <tr>
                        <td>${r.DESPROD}
                            <br>
                            <small>${r.CODPROD}</small>
                        </td>
                        <td>${r.DESMARCA}</td>
                        <td>${r.CANTIDAD} ${r.CODMEDIDA}</td>
                        <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                        <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    </tr>
                `
            })
            container.innerHTML = str;
        })
        .catch(()=>{
            container.innerHTML = 'No day datos...';
           
        })



}




function get_total_rellenos(){

    return new Promise((resolve, reject)=>{
        
        let data = {
            token:TOKEN
        };

        axios.post(`/compras/total_rellenos`, data)
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



function get_existencia_sucursales(codprod,desprod,desmarca){

    $("#modal_existencia_sucursales").modal('show');

    document.getElementById('lbDesprodSucursales').innerText = desprod;
    document.getElementById('lbDesmarcaSucursales').innerText = desmarca;

    let container = document.getElementById('tblDataSucursales');
    container.innerHTML = GlobalLoader;

    GF.get_data_sucursales_existencia(codprod)
    .then((data)=>{
        let str = '';
        let strClassExist ='';
        let varMinimo =0; let varMaximo=0; let varExistencia =0; let varRelleno =0;
     
        data.recordset.map((r)=>{
            varMinimo += Number(r.MINIMO); 
            varMaximo += Number(r.MAXIMO); 
            varExistencia += Number(r.EXISTENCIA); 
            varRelleno += Number(r.RELLENO);
            if(Number(r.RELLENO)<0){strClassExist='text-success negrita'}else{strClassExist='text-danger negrita'}
            str += `
             <tr>
                <td>${r.NOMEMPRESA}</td>
                <td>${r.MINIMO}</td>
                <td>${r.MAXIMO}</td>
                <td>${r.EXISTENCIA}</td>
                <td class='${strClassExist}'>${r.RELLENO}</td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('tblFooterSucursales').innerHTML = ` <tr>
                                                                        <td></td>
                                                                        <td>${varMinimo}</td>
                                                                        <td>${varMaximo}</td>
                                                                        <td>${varExistencia}</td>
                                                                        <td>${varRelleno}</td>
                                                                    </tr>`
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('tblFooterSucursales').innerHTML = ` <tr>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                    </tr>`
    })


    let container2 = document.getElementById('tblDataDocumentosProducto');
    container2.innerHTML = GlobalLoader;

    GF.get_data_documentos_pendientes_producto(codprod)
    .then((data)=>{
        let str = '';
     
        data.recordset.map((r)=>{
            str += `
            <tr>
                <td>${F.convertDateNormal(r.FECHA)}
                    <br>
                    <small class="negrita text-danger">H:${r.HORA}</small>
                </td>
                <td>${r.CODDOC}-${r.CORRELATIVO}</td>
                <td>${r.CODMEDIDA} - ${r.CANTIDAD}</td>
            </tr>
            `
        })
        container2.innerHTML = str;
      
    })
    .catch(()=>{
        container2.innerHTML = 'No se cargaron datos....';
    })



}
















function get_data(){
    return new Promise((resolve, reject)=>{
        
        let data = {
            sucursal:GlobalEmpnit,
            anio:2024,
            mes:8
        };

        axios.post(`/bi/rpt_mapa`, data)
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


