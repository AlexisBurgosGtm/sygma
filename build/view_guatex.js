
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
                            ${view.vista_nuevo() + view.modal_destinos()}
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
            <div class="card card-rounded shadow">
                <div class="card-body p-2">
                    <div class="table-responsive col-12">
                        <table class="table table-responsive table-hover col-12">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblPedidos">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <button class="btn btn-success btn-xl btn-circle hand shadow btn-bottom-r" id="btnNuevo">
                <i class="fal fa-plus"></i>
            </button>

            `
        },
        vista_nuevo:()=>{
            return `   
            <div class="card card-rounded col-12">
                <div class="card-body p-4">
                    <h4 class="m-0 text-center text-secondary negrita">
                        NUEVA GUIA A GUATEX
                    </h4>
                    <br>
                    <div class="row">
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        
                            ${view.vista_seccion_receptor()}
                        
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        
                            ${view.vista_seccion_paquete()}
                        
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        
                            ${view.vista_seccion_items()}
                        
                        </div>
                    </div>
                

                </div>
            </div>

            <br>
            

            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            
            <button class="btn btn-info btn-circle btn-xl hand shadow btn-bottom-r" id="btnGuardar">
                <i class="fal fa-save"></i>
            </button>
            `
        },
        vista_seccion_receptor:()=>{
            return `
                            <div class="card card-rounded">
                                <div class="card-body p-4">
                                            
                                    <h5 class="negrita text-danger">Datos del Destinatario</h5>
                                    <br>

                                    <div class="form-group">
                                        <label class="negrita text-secondary">Nombre</label>
                                        <input type="text" class="form-control" id="txtRNombre">
                                    </div>

                                    <div class="form-group">
                                        <label class="negrita text-secondary">Telefono</label>
                                        <input type="number" class="form-control" maxlength="8" id="txtRTelefono">
                                    </div>

                                    <div class="form-group">
                                        <label class="negrita text-secondary">Direccion</label>
                                        <input type="text" class="form-control"  id="txtRDireccion">
                                    </div>

                                    
                         

                                </div>
                            </div>
            `
        },
        vista_seccion_paquete:()=>{
            return `
                            <div class="card card-rounded">
                                <div class="card-body p-4">
                                            
                                    <h5 class="negrita text-danger">Datos del Envio</h5>
                                    <br>
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Descripcion del Envio</label>
                                        <input type="text" class="form-control" id="txtRDescripcion">
                                    </div>

                                    
                                    
                                            <div class="form-group">
                                                <label class="negrita text-secondary">Municipio</label>
                                                <select class="form-control"  id="cmbRMunicipio" disabled>
                                                </select>
                                            </div>
                                    
                                            <div class="form-group">
                                                <label class="negrita text-secondary">Destino</label>
                                                <div class="input-group">
                                                    <select class="form-control" id="cmbRDestino" disabled>
                                                    </select>
                                                    <button class="btn btn-info btn-md hand shadow" id="btnBuscarDestino">
                                                        <i class="fal fa-search"></i>
                                                    </button>
                                                </div>
                                                
                                            </div>
                                    

                                    <br>
                                    <div class="row">
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="negrita text-secondary">Tipo de Cobro</label>
                                                <select class="form-control"  id="cmbRTipoCobro">
                                                    <option value="CON1289">CONTADO (CON1289)</option>
                                                    <option value="GUA4181">CREDITO (GUA4181)</option>
                                                    <option value="XCO1610">POR COBRAR (XCO1610)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="negrita text-secondary">Recoge Oficina</label>
                                                <select class="form-control" id="cmbRRecogeOficina">
                                                    <option value="N">NO</option>
                                                    <option value="S">SI</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                            
                                       

                                </div>
                            </div>
            `
        },
        vista_seccion_items:()=>{
            return `
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">

                            <h5 class="negrita text-danger">Piezas agregadas a la Guia</h5>
                            <br>

                            <div class="row">
                                <div class="col-4">
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Cantidad Piezas</label>
                                        <select class="form-control" id="cmbPCantidad">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Peso (Libras)</label>
                                        <select class="form-control" id="cmbPPeso">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Tipo Pieza</label>
                                        <select class="form-control" id="cmbPTipo">
                                            <option value='1'>SOBRE</option>
                                            <option value='2'>PAQUETE</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <br>
                            <div class="row align-items-right">
                                <button class="btn btn-info btn-md" id="btnAgregarItem">
                                    <i class="fal fa-plus"></i> Agregar item
                                </button>
                            </div>

                            <br>

                            <table class="table table-bordered h-full col-12">
                                <thead class="bg-secondary text-white">
                                    <tr>
                                        <td>CANTIDAD</td>
                                        <td>PESO</td>
                                        <td>TIPO</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataItems"></tbody>

                            </table>

                            
                        </div>
                    </div>
            `
        },
        modal_nuevo:()=>{
            return `
              <div id="modal_guatex" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                NUEVA GUIA A GUATEX
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-2">


                                    <div class="card card-rounded">
                                        <div class="card-body p-4">
                                    
                                            <h5 class="negrita text-danger">Datos del Destinatario</h5>
                                            <br>

                                            <div class="form-group">
                                                <label class="negrita text-secondary">Nombre</label>
                                                <input type="text" class="form-control" id="txtRNombre">
                                            </div>

                                            <div class="form-group">
                                                <label class="negrita text-secondary">Telefono</label>
                                                <input type="number" class="form-control" maxlength="8" id="txtRTelefono">
                                            </div>

                                            <div class="form-group">
                                                <label class="negrita text-secondary">Direccion</label>
                                                <input type="text" class="form-control"  id="txtRDireccion">
                                            </div>


                                            <br>
                                            <div class="row">
                                                <div class="col-5">
                                                    <div class="form-group">
                                                        <label class="negrita text-secondary">Municipio</label>
                                                        <select class="form-control"  id="cmbRMunicipio" disabled>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-5">
                                                    <div class="form-group">
                                                        <label class="negrita text-secondary">Destino</label>
                                                        <select class="form-control" id="cmbRDestino" disabled>
                                                            
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-2">
                                                    <div class="form-group">
                                                        <br>
                                                        <button class="btn btn-info btn-md hand shadow" id="btnBuscarDestino">
                                                            <i class="fal fa-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            
                                            <br>
                                            <div class="form-group">
                                                <label class="negrita text-secondary">Descripcion del Envio</label>
                                                <input type="text" class="form-control" id="txtRDescripcion">
                                            </div>

                                            <br>
                                            <div class="row">
                                                <div class="col-6">
                                                    <div class="form-group">
                                                        <label class="negrita text-secondary">Tipo de Cobro</label>
                                                        <select class="form-control"  id="cmbRTipoCobro">
                                                            <option value="CON1289">CONTADO (CON1289)</option>
                                                            <option value="GUA4181">CREDITO (GUA4181)</option>
                                                            <option value="XCO1610">POR COBRAR (XCO1610)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-6">
                                                    <div class="form-group">
                                                        <label class="negrita text-secondary">Recoge Oficina</label>
                                                        <select class="form-control" id="cmbRRecogeOficina">
                                                            <option value="N">NO</option>
                                                            <option value="S">SI</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>



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
        },
        modal_destinos:()=>{
            return `
              <div id="modal_destinos" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-info d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                LISTADO DE DESTINOS GUATEX
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                    <div class="table-responsive">
                                        <div class="form-group">
                                            <label class="negrita text-secondary">Escribe para buscar...</label>
                                            <input type="text" class="form-control negrita" placeholder="Escriba para buscar..." id="txtBuscarDestino" oninput="F.FiltrarTabla('tblDestinos','txtBuscarDestino')">
                                        </div>

                                        <table class="table table-bordered table-striped h-full col-12" id="tblDestinos">
                                            <thead class="bg-secondary text-white">
                                                <tr>
                                                    <td>AGENCIA</td>
                                                    <td>MUNICIPIO</td>
                                                    <td>DEPARTAMENTO</td>
                                                    <td></td>
                                                </tr>
                                            </thead>
                                            <tbody id="tblDataDestinos"></tbody>
                                        </table>

                                    </div>


                                        <div class="row">
                                            <div class="col-6">
                                                <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                                    <i class="fal fa-arrow-left"></i>
                                                </button>
                                            </div>
                                            <div class="col-6">
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


let json_tbl_items = [];
let json_index = 0;


function addListeners(){



    F.slideAnimationTabs();



    

    fcn_llenar_combo_cantidades('cmbPCantidad',50);
  
    fcn_llenar_combo_cantidades('cmbPPeso',500);
  

    document.getElementById('btnNuevo').addEventListener('click',()=>{

        //$("#modal_guatex").modal('show');
        
        document.getElementById('tab-dos').click();

        
        clean_data();

        json_tbl_items = [];
        json_index = 0;
      
        tbl_items();

    })


    document.getElementById('btnBuscarDestino').addEventListener('click',()=>{
    
        $("#modal_destinos").modal('show');
        
        tbl_destinos();

    })


    let btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click',()=>{

        F.Confirmacion('¿Está seguro que desea GENERAR esta nueva Guía?')
        .then((value)=>{
            if(value==true){

                    let nombre_destinatario = document.getElementById('txtRNombre').value || '';
                    let telefono_destinatario = document.getElementById('txtRTelefono').value  || '';
                    let direccion_destinatario = document.getElementById('txtRDireccion').value  || '';
                    let codmunicipio = document.getElementById('cmbRMunicipio').value  || '';
                    let descripcion = document.getElementById('txtRDescripcion').value  || '';
                    let recoge_oficina = document.getElementById('cmbRRecogeOficina').value; 
                    let codigo_cobro = document.getElementById('cmbRTipoCobro').value 
                    let codigo_destino = document.getElementById('cmbRDestino').value 

                    let json_items = JSON.stringify(json_tbl_items); 

                    if(nombre_destinatario==''){F.AvisoError('Indique un nombre de destinatario');return;}
                    if(telefono_destinatario==''){F.AvisoError('Indique un telefono de destinatario');return;}
                    if(direccion_destinatario==''){F.AvisoError('Indique la direccion de destinatario');return;}
                    if(codmunicipio==''){F.AvisoError('Indique un destinos');return;}


                    btnGuardar.disabled = true;
                    btnGuardar.innerHTML = `<i class="fal fa-spin fa-save"></i>`;

                    insert_data_guia(nombre_destinatario,telefono_destinatario,direccion_destinatario,codmunicipio,descripcion,recoge_oficina,
                        codigo_cobro,codigo_destino,json_items)
                    .then((data)=>{
                        
                

                        get_data_guia_pdf(data);

                        F.Aviso('Guia No. ' + data.replace('.pdf','') +  ' generada exitosamente!!');
                        F.showToast('Guia No. ' + data.replace('.pdf','') +  ' generada exitosamente!!');


                        //$("#modal_guatex").modal('hide');
                        document.getElementById('tab-uno').click();

                        btnGuardar.disabled = false;
                        btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                    
                    })
                    .catch(()=>{
                        F.AvisoError('Error al generar');
                        btnGuardar.disabled = false;
                        btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                    
                    })


            }
        })

        

    });


    document.getElementById('btnAgregarItem').addEventListener('click',()=>{

            let cantidad = document.getElementById('cmbPCantidad').value;
            let peso = document.getElementById('cmbPPeso').value;
            let tipo = document.getElementById('cmbPTipo').value;

            agregar_item(cantidad,peso,tipo);        

    });


    tbl_items();
};

function fcn_llenar_combo_cantidades(idContainer,cantidad){

    let strCombo = ''

    let n = 0;

    for (var i = 1; i < (Number(cantidad)+1); i++) {
        n += i;
        strCombo += `<option value='${i}'>${i}</option>`
    }

    document.getElementById(idContainer).innerHTML = strCombo;

}



function initView(){

    getView();
    addListeners();

};


function clean_data(){

    document.getElementById('txtRNombre').value = '';
    document.getElementById('txtRTelefono').value  = '';
    document.getElementById('txtRDireccion').value  = '';
    
    document.getElementById('txtRDescripcion').value  = '';
    document.getElementById('cmbRRecogeOficina').value = 'N'; 
    document.getElementById('cmbRTipoCobro').value = 'CON1289';

    document.getElementById('cmbRDestino').innerHTML = ''; 
    document.getElementById('cmbRMunicipio').innerHTML = '';


};

function insert_data_guia(nombre_destinatario,telefono_destinatario,direccion_destinatario,codmunicipio,descripcion,recoge_oficina,
    codigo_cobro,codigo_destino,json_items){


    return new Promise((resolve,reject)=>{


        let data = {
            nombre_destinatario:nombre_destinatario,
            telefono_destinatario:telefono_destinatario,
            direccion_destinatario:direccion_destinatario,
            codmunicipio:codmunicipio,
            descripcion:descripcion,
            recoge_oficina:recoge_oficina,
            codigo_cobro:codigo_cobro,
            codigo_destino:codigo_destino,
            json_items:json_items
        }


        axios.post('/guatex_guia', data
        )
        .then((response) => {
            if(response.status.toString()=='200'){
                 
            }else{
                reject();
            };
            if(response.data.toString()=="error"){
                reject();
            }else{
                resolve(response.data);              
            }                   
        }, (error) => {
            reject();
        });
    }) 

};

function get_data_destinos(){
    
    return new Promise((resolve,reject)=>{

        axios.post('/guatex_destinos')
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

function tbl_destinos(){


    let container = document.getElementById('tblDataDestinos');
    container.innerHTML = GlobalLoader;

    get_data_destinos()
    .then((data)=>{
        let str = '';

        data.recordset.map((r)=>{
            str += `<tr class="hand" onclick="select_destino_municipio('${r.CODIGO_DESTINO}','${r.NOM_DESTINO}','${r.COD_MUN}','${r.MUNICIPIO}')">
                        <td>${r.NOM_DESTINO}
                            <br>
                            <small>${r.DIR_AGENCIA}</small>
                        </td>
                        <td>${r.MUNICIPIO}</td>
                        <td>${r.DEPARTAMENTO}</td>
                        <td></td>
                    </tr>`

        })
        container.innerHTML = str;

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
    })

        
};

function select_destino_municipio(coddestino,desdestino,codmunicipio,desmunicipio){
    
    document.getElementById('cmbRDestino').innerHTML = `<option value='${coddestino}'>${desdestino}</option>`;
    document.getElementById('cmbRMunicipio').innerHTML = `<option value='${codmunicipio}'>${desmunicipio}</option>`;

    $("#modal_destinos").modal('hide');

};



function get_data_guia_pdf(filename){

        var downloadLink = document.createElement('a')
            downloadLink.target = '_blank'
            downloadLink.download = filename

            var URL = window.location.origin //window.URL || window.webkitURL
            
            var downloadUrl = URL + '/guatex_guia_pdf?filename=' + filename;
            downloadLink.href = downloadUrl
            document.body.append(downloadLink) // THIS LINE ISN'T NECESSARY
            downloadLink.click()
            document.body.removeChild(downloadLink);  // THIS LINE ISN'T NECESSARY
           

}

function agregar_item(cantidad,peso,tipo){

    json_index += 1;

    let newData = {
                        ID: Number(json_index),
                        PIEZAS: cantidad,
                        TIPO: tipo,
                        PESOLBS: peso
                    }

    json_tbl_items.push(newData);

    tbl_items();
}

function tbl_items(){

    let container = document.getElementById('tblDataItems');
    container.innerHTML = GlobalLoader;

    let str = '';
    json_tbl_items.map((r)=>{
        
        let tipo = ''; if(r.TIPO.toString()=='1'){tipo='SOBRE'}else{tipo='PAQUETE'}
        str += `
            <tr>
                <td>${r.PIEZAS}</td>
                <td>${r.PESOLBS}</td>
                <td>${tipo}</td>
                <td>
                    <button class='btn btn-danger btn-circle btn-md hand shadow'
                    onclick="delete_item('${r.ID}')">
                        <i class="fal fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
    })
    container.innerHTML = str;

};

function delete_item(iditem){

    json_tbl_items.forEach(function(currentValue, index, arr){
        if(json_tbl_items[index].ID==Number(iditem)){
          
            if(index==0){
                json_tbl_items.splice(0,1);
            }else{
                json_tbl_items.splice(index,1);
            }
               
         }
         
         
    })

    tbl_items();

};
