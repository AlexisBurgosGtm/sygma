
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.panel()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_pedidos_pendientes() + view.vista_pedidos_modal_embarques()}

                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_relleno()}
                        </div>
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_embarques() + view.vista_embarques_modal_datos()}
                        </div>
                        <div class="tab-pane fade" id="cinco" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_revision_inventario_embarque()}
                        </div>
                        <div class="tab-pane fade" id="seis" role="tabpanel" aria-labelledby="home-tab">
                            
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
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-seis" data-toggle="tab" href="#seis" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>         
                    </ul>

                </div>
               
            `
        },
        panel:()=>{
            return `
            
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4 text-center">
                
                    <h1 class="text-base negrita">Inicio Digitador</h1>

                </div>
            </div>

            <br>

            <div class="row">
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                    
                    <div class="card card-rounded bg-white shadow col-12 hand"  onclick="document.getElementById('tab-dos').click()">
                        <div class="card-body p-4">
                            
                            <h4>PEDIDOS PENDIENTES</h4>
                            <h1 class="negrita text-danger" id="lbTotalMP"></h1>

                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-tasks negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    

                </div>
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6" >
                    
                    <div class="card card-rounded  bg-white shadow col-12 hand"  onclick="document.getElementById('tab-tres').click()">
                        <div class="card-body p-4">

                            <h4>RELLENO DE INVENTARIO</h4>
                            <h1 class="negrita text-danger" id="lbTotalMR"></h1>

                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-warehouse negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                    

                </div>
            </div>

            <br>

            <div class="row">

                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                    
                    <div class="card card-rounded  bg-white shadow col-12 hand" onclick="document.getElementById('tab-cuatro').click()">
                        <div class="card-body p-4">
                            
                            
                            <h4>EMBARQUES</h4>
                            <h1 class="negrita text-danger" id="lbTotalEmb"></h1>
                            
                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-truck negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    

                </div>
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6" >
                    
                    <div class="card card-rounded shadow hand col-12" onclick="document.getElementById('tab-cinco').click()">
                        <div class="card-body p-4">
                            
                            <h4>REVISION DE EXISTENCIA EN EMBARQUES</h4>
                            <h1 class="negrita text-danger" id="">Ajuste de inventario</h1>
                            
                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-box negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>
                           
                        </div>
                    </div>
                    

                </div>
            </div>


            
            `
        },
        vista_pedidos_pendientes:()=>{
            return `
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4 table-responsive">
                        
                            
                            <div class="row">
                                <div class="col-6">
                                    <h4>LISTADO DE PEDIDOS PENDIENTES</h4>
                                </div>
                                <div class="col-6">
                                    <label class="negrita text-danger" id="lbTotalP"></label>
                                </div>
                            </div>
                            

                            <table class="table h-full table-bordered col-12" id="tblPedidos">
                                <thead class="bg-base text-white negrita">
                                    <tr>
                                        <td class="text-left">EMBARQUE</td>
                                        <td>VENDEDOR</td>
                                        <td>FECHA</td>
                                        <td>CLIENTE</td>
                                        <td>MUNICIPIO</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataPedidos"></tbody>

                            </table>
                        

                        </div>
                    </div>

                    <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                        <i class="fal fa-arrow-left"></i>
                    </button>
            `
        },
        vista_pedidos_modal_embarques:()=>{
            return `
                <div id="modal_embarques_pendientes" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-body p-2">
                                
                                <div class="card card-rounded col-12">
                                    <div class="card-body p-4">

                                       
                                        <div class="table-responsive">
                            
                                            <table class="table col-12 h-full" id="tblMEmbarques">
                                                <thead class="bg-secondary text-white">
                                                    <tr>
                                                        <td>FECHA</td>
                                                        <td>EMBARQUE</td>
                                                        <td>REPARTIDOR</td>
                                                        <td></td>
                                                    </tr>
                                                </thead>
                                                <tbody id="tblDataMEmbarques">
                                                
                                                </tbody>

                                            </table>

                                        </div>

                                       

                                      
                                    
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            `

        },
        vista_relleno:()=>{
            return `
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4 table-responsive">
                        
                            <div class="row">
                                <div class="col-6">
                                    <h4>RELLENO DE INVENTARIO</h4>
                                </div>
                                <div class="col-6">
                                    <label class="negrita text-danger" id="lbTotal"></label>
                                </div>
                            </div>
                            

                             <table class="table h-full table-bordered col-12">
                                <thead class="bg-warning text-white negrita">
                                    <tr>
                                        <td>PRODUCTO</td>
                                        <td>MARCA</td>
                                        <td>EXISTENCIA</td>
                                        <td>MINIMO</td>
                                        <td>MAXIMO</td>
                                        <td>RELLENO</td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataRelleno"></tbody>

                            </table>
                        
                        </div>
                    </div>

                    <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                        <i class="fal fa-arrow-left"></i>
                    </button>
            `
        },
        vista_embarques:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                    <h4 class="negrita text-base">EMBARQUES - (GESTION DE PICKING)</h4>

                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label class="negrita text-secondary">Seleccione mes y año</label>
                                <div class="input-group">
                                    <select class="form-control negrita" id="cmbMes"></select>
                                    <select class="form-control negrita" id="cmbAnio"></select>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            
                            <div class="form-group">
                                <label class="negrita text-secondary">Filtrar por</label>
                                <div class="input-group">
                                    <select class="form-control negrita" id="cmbStatus">
                                        <option value="NO">PENDIENTES</option>
                                        <option value="SI">FINALIZADOS</option>
                                    </select>
                                    
                                </div>
                            </div>

                        </div>
                    </div>
                
                </div>
            </div>
            
            <br>

            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">

                    <div class="table-responsive">
                        
                        <table class="table col-12 h-full" id="tblEmbarques">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>FECHA</td>
                                    <td>EMBARQUE</td>
                                    <td>REPARTIDOR</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblDatalEmbarques">
                            
                            </tbody>

                        </table>

                    </div>
                           
                </div>
            </div>

            <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>

            <button class="btn btn-success btn-xl btn-circle hand shadow btn-bottom-r" id="btnEmbarquesNuevo">
                <i class="fal fa-plus"></i>
            </button>

            `

        },
        vista_embarques_modal_datos:()=>{
            return `
                <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" id="modal_embarques_nuevo">
                    <div class="modal-dialog modal-dialog-right modal-xl">
                        <div class="modal-content">
                            <div class="modal-body p-2">
                                
                                <div class="card card-rounded">
                                    <div class="card-body p-4">

                                        <div class="row">
                                            <div class="col-6">
                                                <h4 class="negrita text-danger">Datos del Embarque</h4>
                                            </div>
                                            <div class="col-6">
                                                <div class="form-group">
                                                    <label class="negrita text-secondary">Fecha</label>
                                                    <input type="date" class="form-control" id="txtEmbarqueFecha">
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <br>

                                        <div class="form-group">
                                            <label class="negrita text-secondary">Código Embarque</label>
                                            <div class="input-group">
                                                <input type="text" class="form-control"  id="txtEmbarqueCodigo">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="negrita text-secondary">Descripción</label>
                                            <input type="text" class="form-control" id="txtEmbarqueDescripcion">
                                        </div>

                                        <div class="form-group">
                                            <label class="negrita text-secondary">Ruteo</label>
                                            <input type="text" class="form-control" id="txtEmbarqueRuteo">
                                        </div>

                                        <div class="form-group">
                                            <label class="negrita text-secondary">Repartidor</label>
                                            <select class="form-control" id="cmbEmbarqueEmpleado">
                                            </select>
                                        </div>

                                        <br>
                                        <div class="row">
                                            <div class="col-6">
                                                 <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                                    <i class="fal fa-arrow-left"></i>
                                                </button>
                                            </div>
                                            <div class="col-6">
                                                 <button class="btn btn-info btn-circle btn-xl hand shadow" id="btnEmbarqueGuardar">
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
        vista_revision_inventario_embarque:()=>{
            return `
                <div class="card card-rounded shadow col-12">
                    <div class="card-body p-4 table-responsive">
                        
                            
                            <div class="row">
                                <div class="col-6">
                                    <h4>AJUSTE DE EXISTENCIAS EN EMBARQUE</h4>
                                </div>
                                <div class="col-6">
                                    <label class="negrita text-danger" id=""></label>
                                </div>
                            </div>
                            

                             <div class="row">
                                <div class="col-8">
                                    
                                    <table class="table h-full table-bordered col-12" id="tblPedidosExistencia">
                                        <thead class="bg-base text-white negrita">
                                            <tr>
                                                <td>PRODUCTO</td>
                                                <td>CODMEDIDA</td>
                                                <td>CANTIDAD</td>
                                                <td>TOTAL UNIDADES</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataPedidosExistencia"></tbody>

                                    </table>

                                </div>
                                <div class="col-4">
                                    <label class="negrita text-danger" id="">Facturas Producto</label>
                                
                                    <table class="table h-full table-bordered col-12" id="">
                                        <thead class="bg-secondary text-white negrita">
                                            <tr>
                                                <td>DOCUMENTO</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataFacturasProducto"></tbody>

                                    </table>
                                
                                </div>
                            </div>

                           
                        

                        </div>
                    </div>

                    <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                        <i class="fal fa-arrow-left"></i>
                    </button>
            `
        }
    }

    root.innerHTML = view.body();

};

function addListeners(){


    F.slideAnimationTabs();

  

    tbl_relleno_inventario('tblDataRelleno');


    listeners_pedidos_pendientes();

    listeners_embarques();


};

function initView(){

    getView();
    addListeners();

};




//------------------------
// PEDIDOS PENDIENTES
//------------------------

function listeners_pedidos_pendientes(){

    tbl_pedidos_pendientes('tblDataPedidos');

    tbl_modal_embarques();

    
    selected_ped_coddoc = '';
    selected_ped_correlativo = '';
    selected_ped_codembarque = '';


};

function tbl_pedidos_pendientes(idContainer){

    let container = document.getElementById(idContainer);

    container.innerHTML = GlobalLoader;
    let contador = 0;

    GF.get_data_pedidos_pendientes_vendedores()
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
            let idRowPedido = `idRowPedido${r.CODDOC}-${r.CORRELATIVO}`;
            contador +=1;
            str += `
                <tr>
                    <td class="text-left">
                    
                        <button class="btn btn-info btn-md btn-circle hand shadow"
                            onclick="get_embarques_pedido('${r.CODDOC}','${r.CORRELATIVO}','${idRowPedido}')">
                                <i class="fal fa-plus"></i>
                        </button>
                        
                        <b class="text-danger" id="${idRowPedido}">${r.CODEMBARQUE}</b>
 
                           
                    
                        
                    </td>
                    <td>${r.NOMEMPLEADO}
                        <button class="btn btn-info btn-circle btn-sm hand shadow"
                        onclick="F.gotoGoogleMaps('${r.LAT}','${r.LONG}')">
                            <i class="fal fa-map"></i>
                        </button>
                        <br>
                        <small class="negrita">${r.CODDOC}-${r.CORRELATIVO}</small>
                    </td>
                    <td>${F.convertDateNormal(r.FECHA)}
                        <br>
                        <small>Hora:${r.HORA}</small>
                    </td>
                    <td>${r.NOMCLIE}
                        <br>
                        <small>${r.DIRCLIE}</small>
                    </td>
                    <td>
                        ${r.DESMUN}
                    </td>
                    <td class="negrita text-danger text-right">${F.setMoneda(r.IMPORTE,'Q')}</td>
                    <td>
                    
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalP').innerText = `Pedidos pendientes: ${contador}`
        document.getElementById('lbTotalMP').innerText =`${contador} pedidos`

        new DataTable('#tblPedidos', {
            paging: false,
            scrollCollapse: true
        });
    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....'
        document.getElementById('lbTotalP').innerText = '---'
        document.getElementById('lbTotalMP').innerText = '---'
    })




};


function get_embarques_pedido(coddoc,correlativo,idUpdate){



    $("#modal_embarques_pendientes").modal('show');


    selected_id_element = idUpdate;
    selected_ped_coddoc = coddoc;
    selected_ped_correlativo = correlativo.toString();



};

function tbl_modal_embarques(){


    let container = document.getElementById('tblDataMEmbarques');
    container.innerHTML = GlobalLoader;

    let str = '';

    GF.get_data_embarques_listado_activos(GlobalEmpnit)
    .then((data)=>{
        

        data.recordset.map((r)=>{
          
            let idbtnF = `btnMF${r.CODEMBARQUE}`;
            str += `
                <tr>
                    <td>${F.convertDateNormal(r.FECHA)}</td>
                    <td class="negrita text-danger">${r.CODEMBARQUE}
                        <br>
                        <small class="negrita text-secondary">${r.DESCRIPCION}</small>
                    </td>
                    <td>${r.NOMEMPLEADO}</td>
                    <td>
                        <buttton id="${idbtnF}" class="btn btn-md btn-circle hand shadow btn-success"
                        onclick="seleccionar_embarque('${r.CODEMBARQUE}')">
                            <i class="fal fa-check"></i>
                        </button>
                    </td>
                </tr>
            `
        })


        container.innerHTML = str;
        
        new DataTable('#tblMEmbarques', {
            paging: false,
            scrollCollapse: true
        });
    })
    .catch(()=>{
        document.getElementById('lbTotalEmb').innerText = '---'
        container.innerHTML = 'No se cargaron datos...';
    })

};

function seleccionar_embarque(codembarque){


    
    selected_ped_codembarque = codembarque;

    $("#modal_embarques_pendientes").modal('hide');


    let valorAnterior = '';
    let valor = document.getElementById(selected_id_element);
    valorAnterior = valor.innerHTML;

    valor.innerHTML = 'Actualizando....';

    console.log('por aqui....')

    GF.get_data_pedidos_update_embarque(GlobalEmpnit,selected_ped_coddoc,selected_ped_correlativo,codembarque)
    .then((data)=>{

        valor.innerHTML = `${codembarque}`;
    })
    .catch(()=>{
        F.AvisoError('No se pudo actualizar el Embarque en el pedido')
        valor.innerHTML = valorAnterior;
    })


};


//------------------------
// PEDIDOS PENDIENTES
//------------------------




//------------------------
// RELLENO
//------------------------


function tbl_relleno_inventario(idContainer){

    let container = document.getElementById(idContainer);

    container.innerHTML = GlobalLoader;
    let lbTotal = document.getElementById('lbTotal');
    let contador = 0;

    GF.get_data_surtido(GlobalEmpnit)
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
                    <td class="negrita">${r.EXISTENCIA}</td>
                     <td>${r.MINIMO}</td>
                    <td>${r.MAXIMO}</td>
                    <td class="negrita text-danger">${r.RELLENO}</td>
                </tr>
            `
        })
        container.innerHTML = str;
        lbTotal.innerText = `Pendientes surtir ${contador}`;
        document.getElementById('lbTotalMR').innerText = `${contador} productos`;
        
    })
    .catch((error)=>{
        console.log(error)
        container.innerHTML = 'No se cargaron datos...'
        lbTotal.innerText = '---'
        document.getElementById('lbTotalMR').innerText = '---'
    })








};



//------------------------
// RELLENO
//------------------------


//------------------------
// EMBARQUES
//------------------------

function listeners_embarques(){

    //carga la lista de empleados
    GF.get_data_empleados_tipo(4)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>`
        });
        document.getElementById('cmbEmbarqueEmpleado').innerHTML = str;
    })
    .catch(()=>{
        F.AvisoError('No se cargaron los Repartidores');
        document.getElementById('cmbEmbarqueEmpleado').innerHTML ='<option value="1">SIN REPARTIDOR</option>';
    })



    //listeners
    document.getElementById('cmbMes').innerHTML = F.ComboMeses();
    document.getElementById('cmbAnio').innerHTML = F.ComboAnio();

    document.getElementById('cmbMes').value = F.get_mes_curso();
    document.getElementById('cmbAnio').value = F.get_anio_curso();

    document.getElementById('txtEmbarqueFecha').value = F.getFecha();

    document.getElementById('btnEmbarquesNuevo').addEventListener('click',()=>{
            
        clean_data_embarque();
        $("#modal_embarques_nuevo").modal('show');

    })


    cargar_grid_embarques();



    let btnEmbarqueGuardar = document.getElementById('btnEmbarqueGuardar');
    btnEmbarqueGuardar.addEventListener('click',()=>{


        let MesAnio = F.get_mes_anio_fecha('txtEmbarqueFecha');

        let fecha = F.devuelveFecha('txtEmbarqueFecha');
        let anio = MesAnio[1];
        let mes = MesAnio[0];
        
        let codembarque = F.limpiarTexto(document.getElementById('txtEmbarqueCodigo').value) || ''; 
        let descripcion = F.limpiarTexto(document.getElementById('txtEmbarqueDescripcion').value) || '';    
        let ruteo  = F.limpiarTexto(document.getElementById('txtEmbarqueRuteo').value) || '';
        let codempleado = document.getElementById('cmbEmbarqueEmpleado').value; 


            //let boleditar = document.getElementById('txtEmbarqueCodigo').disabled 
            //if(boleditar.toString() == 'false'){
            if(document.getElementById('txtEmbarqueCodigo').disabled==false){
                //si esta habilitado, es nuevo

             
                
                F.Confirmacion('¿Está seguro que desea CREAR este embarque?')
                .then((value)=>{
                    if(value==true){

                        btnEmbarqueGuardar.disabled=true;
                        btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                        GF.get_data_embarques_insert(GlobalEmpnit,fecha,mes,anio,codembarque,descripcion,ruteo,codempleado)
                        .then((data)=>{

                            btnEmbarqueGuardar.disabled=false;
                            btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                            
                            F.Aviso('Embarque creado exitosamente!!');

                            $("#modal_embarques_nuevo").modal('hide');

                            tbl_embarques('tblDatalEmbarques',statusEmbarque,mes,anio);

                        })
                        .catch(()=>{
                            F.AvisoError('No se pudo Guardar')
                            btnEmbarqueGuardar.disabled=false;
                            btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save"></i>`;

                        })

                    }
                })

            }else{
                //si esta deshabilitado, es edicion
               
                F.Confirmacion('¿Está seguro que desea EDITAR este embarque?')
                .then((value)=>{
                    if(value==true){

                        btnEmbarqueGuardar.disabled=true;
                        btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save fa-spin"></i>`;
    

                        GF.get_data_embarques_edit(GlobalEmpnit,fecha,mes,anio,codembarque,descripcion,ruteo,codempleado)
                        .then((data)=>{

                            btnEmbarqueGuardar.disabled=false;
                            btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save"></i>`;

                            F.Aviso('Embarque editado exitosamente!!');

                            
                            $("#modal_embarques_nuevo").modal('hide');

                            

                            tbl_embarques('tblDatalEmbarques',statusEmbarque,mes,anio);

                        })
                        .catch(()=>{
                                F.AvisoError('No se pudo Editar este embarque')
                                btnEmbarqueGuardar.disabled=false;
                                btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                            
                        })


                    }
                })

            }

        




    })

    document.getElementById('cmbMes').addEventListener('change',()=>{

        cargar_grid_embarques();

    });

    
    document.getElementById('cmbAnio').addEventListener('change',()=>{

        cargar_grid_embarques();

    });

    
    document.getElementById('cmbStatus').addEventListener('change',()=>{

        cargar_grid_embarques();

    });





};

function cargar_grid_embarques(){

    let statusEmbarque = document.getElementById('cmbStatus').value;
    let mes =document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;

    tbl_embarques('tblDatalEmbarques',statusEmbarque,mes,anio);

};


function tbl_embarques(idContainer,status,mes,anio){

    let container = document.getElementById(idContainer);
    container.innerHTML = GlobalLoader;

    let str = '';

    let conteo = 0;
    
    GF.get_data_embarques_listado(GlobalEmpnit,status,mes,anio)
    .then((data)=>{
        

        data.recordset.map((r)=>{
            conteo +=1;
            let idbtnE = `btnE${r.CODEMBARQUE}`;
            let idbtnF = `btnF${r.CODEMBARQUE}`;
            str += `
                <tr>
                    <td>${F.convertDateNormal(r.FECHA)}</td>
                    <td class="negrita text-danger">${r.CODEMBARQUE}
                        <br>
                        <small class="negrita text-secondary">${r.DESCRIPCION}</small>
                        <br>
                        <small>${r.RUTEO}</small>
                    </td>
                    <td>${r.NOMEMPLEADO}</td>
                    <td>
                        <buttton id="${idbtnF}" class="btn btn-md btn-circle hand shadow btn-success"
                        onclick="finalizar_embarque('${r.CODEMBARQUE}','${idbtnF}')">
                            <i class="fal fa-check"></i>
                        </button>
                    </td>
                    <td>
                        <buttton class="btn btn-md btn-circle hand shadow btn-info" 
                            onclick="get_data_embarque('${r.FECHA}','${r.CODEMBARQUE}','${r.DESCRIPCION}','${r.RUTEO}','${r.CODEMPLEADO}')">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <buttton class="btn btn-md btn-circle hand shadow btn-outline-info">
                            <i class="fal fa-print"></i>
                        </button>
                    </td>
                    <td>
                        <buttton id="${idbtnE}" class="btn btn-md btn-circle hand shadow btn-danger"
                        onclick="eliminar_embarque('${r.CODEMBARQUE}','${idbtnE}')">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `
        })


        container.innerHTML = str;
        if(status=='NO'){document.getElementById('lbTotalEmb').innerText = `Pendientes ${conteo}`;};
        new DataTable('#tblEmbarques', {
            paging: false,
            scrollCollapse: true
        });
    })
    .catch(()=>{
        document.getElementById('lbTotalEmb').innerText = '---'
        container.innerHTML = 'No se cargaron datos...';
    })

};



function clean_data_embarque(){


    document.getElementById('txtEmbarqueCodigo').disabled = false;

    document.getElementById('txtEmbarqueFecha').value = F.getFecha();
    document.getElementById('txtEmbarqueCodigo').value = '';
    document.getElementById('txtEmbarqueDescripcion').value ='';
    document.getElementById('txtEmbarqueRuteo').value ='';
    

}


function get_data_embarque(fecha,codembarque,descripcion,ruteo,codempleado){


    document.getElementById('txtEmbarqueCodigo').disabled = true;

    
    document.getElementById('txtEmbarqueCodigo').value = codembarque;
    document.getElementById('txtEmbarqueDescripcion').value =descripcion;
    document.getElementById('txtEmbarqueRuteo').value =ruteo;

    document.getElementById('cmbEmbarqueEmpleado').value = codempleado;


    document.getElementById('txtEmbarqueFecha').value = fecha.replace("T00:00:00.000Z","");

    $("#modal_embarques_nuevo").modal('show');

};

function eliminar_embarque(codembarque,idbtn){

        F.Confirmacion('¿Está seguro que desea ELIMINAR este Embarque?')
        .then((value)=>{
            if(value==true){

                let btn = document.getElementById(idbtn);

                btn.innerHTML = `<i class="fal fa-trash fa-spin"></i>`;
                btn.disabled = true;

                GF.get_data_embarques_delete(codembarque,GlobalEmpnit)
                .then((datos)=>{
                    F.Aviso('Embarque eliminado exitosamente!!');

                    cargar_grid_embarques();
            
            
                })
                .catch(()=>{
                    F.AvisoError('No se pudo ELIMINAR');

                    btn.innerHTML = `<i class="fal fa-trash"></i>`;
                    btn.disabled = true;
    
                })



            }
        })


};

function finalizar_embarque(codembarque,idbtn){


    let btn = document.getElementById(idbtn);

    let statusActual = document.getElementById('cmbStatus').value;
    let st = '';
    let strMsg = '';

    if(statusActual=='NO'){
        st = 'SI';
        strMsg = '¿Está seguro que desea FINALIZAR este Embarque?'
    }else{
        st = 'NO';
        strMsg = '¿Está seguro que desea VOLVER A ACTIVAR este Embarque?'
    }


    F.Confirmacion(strMsg)
    .then((value)=>{
        if(value==true){

            btn.disabled = true;
            btn.innerHTML = `<i class="fal fa-spin fa-check"></i>`;

            GF.get_data_embarques_finalizar(codembarque,GlobalEmpnit,st)
            .then((data)=>{
                F.Aviso('Embarque cambiado exitosamente!!');
                cargar_grid_embarques();
            })
            .catch(()=>{
                F.AvisoError('No se pudo actualizar');
                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-check"></i>`;
            })



        }
    })




};


//------------------------
// EMBARQUES
//------------------------