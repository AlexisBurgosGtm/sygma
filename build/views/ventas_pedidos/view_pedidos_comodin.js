function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="dias-tab">
                        
                            ${view.modal_lista_clientes() + view.modal_qr() + view.modal_camara()}
                        
                        </div> 
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="clientes-tab">
                        
                            ${view.pedido() + view.modal_lista_precios() + view.modal_cantidad() + view.modal_editar_cantidad()}

                        </div>

                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.documento()}
                        </div>

                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="clientes-tab">
                            ${view.modal_lista_documentos()}
                        </div>

                    </div>

                    <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active negrita text-success" id="tab-uno" data-toggle="tab" href="#uno" role="tab" aria-controls="profile" aria-selected="false">
                                <i class="fal fa-list"></i></a>Pedido
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-dos" data-toggle="tab" href="#dos" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>Precios
                        </li> 
                        <li class="nav-item">
                            <a class="nav-link negrita text-info" id="tab-tres" data-toggle="tab" href="#tres" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-edit"></i></a>Finalizar
                        </li> 
                        <li class="nav-item">
                            <a class="nav-link negrita text-info" id="tab-cuatro" data-toggle="tab" href="#cuatro" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-edit"></i></a>Finalizar
                        </li>                           
                    </ul>
                </div>
            `
        },
        pedido:()=>{
            return `
            <div class="row">
         
                    <div class="col-12">
                        
                        <div class="card border-base card-rounded shadow p-2 col-12">
                            <div class="row">

                                <div class="col-4 text-left">   
                                    <label class="text-base negrita h5" style="font-size:120%">Nuevo Pedido</label>
                                    <br>
                                    <label class="text-base negrita h5" style="font-size:120%" id="lbTotalItems">0 items</label>
                                </div>
                                
                                <div class="col-8 text-right">
                                    <h5 class="text-verde negrita" id="lbTotalVenta">Q 0.00</h5>
                                    <h5 class="text-danger negrita" id="lbTotalDescuento">Q 0.00</h5>
                                    <h1 class="text-base negrita" id="lbTotalVentaDescuento">Q 0.00</h1>
                                </div>
                            </div>
                        </div>

                    </div>
                    
            </div>
           
            <div class="row">

                <div class="col-12">

                                  
                   <div class="row">
                      
                        <div class="col-12">
                            <div class="card card-rounded shadow border-base col-12 p-2">
                                <div class="card-body">
                                    
                                    <div class="form-group">
                                        <div class="input-group">
                                           
                                            <input type="text" autocomplete="off" class="form-control border-base negrita col-12" placeholder='Escriba para buscar...' id="txtPosCodprod">
                                            <button class="btn btn-base hand col-1" id="btnBuscarProd">
                                                <i class="fal fa-search"></i>
                                            </button>
                                                                                    
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-12">
                                            <b class="text-base">Productos agregados a la Factura</b>
                                        </div>
                                    </div>
                                    <table class="table  table-hover col-12 h-full">
                                        <thead class="bg-verde text-white">
                                            <tr>
                                                <td>PRODUCTO</td>
                                                
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblPosPedido"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            <div class="row">


            </div>

            
            <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            
            <button class="btn btn-verde btn-xl btn-bottom-r btn-circle shadow hand" id="btnPosCobro">
                <i class="fal fa-arrow-right"></i>
            </button>
            `
        },
        modal_lista_precios:()=>{
            return `
            <div class="modal modal-with-scroll" id="modal_lista_precios" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl" role="document">
                    <div class="modal-content">
            
                        <div class="modal-body p-4">
                            <div class="row">
                                <div class="col-8">
                                    <label class="modal-title text-base h3" id="">Buscar producto</label>
                                </div>
                                <div class="col-4">
                                    <button class="btn btn-secondary btn-md  hand shadow waves-effect waves-themed" data-dismiss="modal" id="">
                                        <i class="fal fa-arrow-left"></i> Cerrar(x)
                                    </button>
                                </div>
                            </div>

                            
                            <div class="form-group">
                                
                                <input type="text" class="form-control border-danger negrita text-danger"
                                id="txtBuscarP"
                                placeholder="Escriba para filtrar"
                                oninput="F.FiltrarTabla('tblProductos','txtBuscarP')">
                            </div>

                                    <table class="table table-responsive  table-hover table-bordered h-full" id="tblProductos">
                                        <thead class="bg-base text-white">
                                            <tr>
                                                <td>PRODUCTO</td>
                                                <td>MEDIDA</td>
                                                <td>PRECIO</td>
                                                <td>EXISTENCIA</td>
                                                <td>MARCA</td>
                                                <td>TIPO</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataProductos"></tbody>
                                    </table>

                            <br>

                            <div class="row">
                                    <div class="text-left">
                                        <button class="btn btn-secondary btn-xl btn-circle hand shadow waves-effect waves-themed" data-dismiss="modal" id="">
                                            <i class="fal fa-arrow-left"></i>
                                        </button>                                
                                    </div>
        
                                   
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        },
        modal_cantidad:()=>{
            return `
            <div class="modal" id="modal_cantidad" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">

                        <div class="modal-header">
                            <label class="modal-title text-base h3" id="lbCantidadDesprod">Cantidad de producto</label>
                        </div>
            
                        <div class="modal-body p-4">
                            <div class="" id="container_precio">
                            </div>
                            <div class="row">
                                <div class="col-4 text-center">
                                    <img src="./favicon.png" width="120px" height="100px">
                                </div>
                                <div class="col-8">
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Cantidad:</label>
                                        <input type="number" style="font-size:140%" class="form-control negrita text-info border-base shadow col-10" id="txtMCCantidad">
                                    </div>   
                                    
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Precio ${GlobalSignoMoneda}:</label>
                                        <input disabled="true" type="number" style="font-size:140%" class="form-control negrita text-info border-base shadow col-10" id="txtMCPrecio">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Subtotal ${GlobalSignoMoneda}:</label>
                                        <input type="number" style="font-size:150%" class="form-control negrita text-danger border-base shadow col-10" id="txtMCTotalPrecio" disabled>
                                    </div>

                                    <div class="form-group hidden">
                                        <label class="negrita text-secondary">Descuento ${GlobalSignoMoneda}:</label>
                                        <input type="number" style="font-size:140%" class="form-control negrita text-info border-base shadow col-10" id="txtMCDescuento" oninput="calcular_descuento('txtMCDescuento','txtMCTotalPrecio','txtMCTotalPrecioDescuento')">
                                    </div>
                                    
                                    <div class="form-group hidden">
                                        <label class="negrita text-secondary">Importe ${GlobalSignoMoneda}:</label>
                                        <input type="number" style="font-size:150%" class="form-control negrita text-danger border-base shadow col-10" id="txtMCTotalPrecioDescuento" disabled>
                                    </div>


                                </div>            
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
                                        <button class="btn btn-base btn-xl btn-circle hand shadow waves-effect waves-themed" id="btnMCGuardar">
                                            <i class="fal fa-check mr-1"></i>
                                        </button>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        },
        modal_editar_cantidad:()=>{
            return `
            <div class="modal" id="modal_editar_cantidad" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">

                        <div class="modal-header bg-base">
                            <label class="modal-title text-white h3" id="lbCantidadDesprodE">Cantidad de producto</label>
                        </div>
            
                        <div class="modal-body p-4">
                            <div class="row">
                                <div class="col-4 text-center">
                                    <img src="./favicon.png" width="120px" height="100px">
                                </div>
                                <div class="col-8">
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Cantidad:</label>
                                        <input type="number" style="font-size:140%" class="form-control negrita text-info border-base shadow col-10" id="txtMCCantidadE">
                                    </div>   
                                    
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Precio ${GlobalSignoMoneda}:</label>
                                        <input disabled="true" type="number" style="font-size:140%" class="form-control negrita text-info border-base shadow col-10" id="txtMCPrecioE">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Subtotal ${GlobalSignoMoneda}:</label>
                                        <input type="number" style="font-size:150%" class="form-control negrita text-danger border-base shadow col-10" id="txtMCTotalPrecioE" disabled>
                                    </div>


                                    <div class="form-group hidden">
                                        <label class="negrita text-secondary">Descuento ${GlobalSignoMoneda}:</label>
                                        <input type="number" style="font-size:140%" class="form-control negrita text-info border-base shadow col-10" id="txtMCDescuentoE" oninput="calcular_descuento('txtMCDescuentoE','txtMCTotalPrecioE','txtMCTotalPrecioDescuentoE')">
                                    </div>
                                    
                                    <div class="form-group hidden">
                                        <label class="negrita text-secondary">Importe ${GlobalSignoMoneda}:</label>
                                        <input type="number" style="font-size:150%" class="form-control negrita text-danger border-base shadow col-10" id="txtMCTotalPrecioDescuentoE" disabled>
                                    </div>


                                </div>            
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
                                        <button class="btn btn-base btn-xl btn-circle hand shadow waves-effect waves-themed" id="btnMCGuardarE">
                                            <i class="fal fa-check mr-1"></i>
                                        </button>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        },
        documento:()=>{
            return `
            <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-4 col-xl-4">
                    ${view.documento_card_cliente()}
                </div>

                <div class="col-sm-12 col-md-6 col-lg-8 col-xl-8">
                    <div class="card card-rounded shadow col-12 border-base">
                        <div class="card-body">

                            <div class="row">
                                <div class="form-group">
                                    <label class="text-secondary">Tipo de Documento</label>
                                    <select class="form-control col-12 negrita text-danger" id="cmbTipoDocumento">
                                        <option value="FAC">FACTURAS NORMALES</option> 
                                
                                    </select>   
                                </div>
                                <div class="form-group text-left">
                                    <label class="text-secondary">Serie Documento</label>
                                    <div class="input-group">
                                        <select class="form-control col-12" id="cmbCoddoc">
                                        </select>
                                        <input type="number" id="txtCorrelativo" class="form-control" disabled="true" value=0>
                                    </div>    
                                </div>
                            </div>
                            <br>

                            <div class="row">
                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <div class="form-group text-left">
                                        <label class="text-secondary">Fecha</label>
                                        <div class="input-group">
                                            <input type="date" id="txtFecha" class="form-control text-base negrita border-base" disabled>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="text-secondary">Observaciones</label>
                                        <textarea class="form-control negrita" rows="3" id="txtObs"></textarea>
                                    </div>
                                    
                                 

                                    <div class="hidden">
                                        
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input hand" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="mostrador" checked>
                                            <label class="form-check-label negrita text-base hand" for="inlineRadio1">Mostrador  </label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input hand" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="domicilio">
                                            <label class="form-check-label negrita text-base hand" for="inlineRadio2">Domicilio  </label>
                                        </div>
                                         <div class="form-check form-check-inline">
                                            <input class="form-check-input hand" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="callcenter">
                                            <label class="form-check-label negrita text-base hand" for="inlineRadio3">Call Center</label>
                                        </div>

                                    </div>

                                </div>    
                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <div class="form-group text-right">
                                        <label class="negrita text-secondary h4">Total a Pagar</label>
                                        <h2 class="negrita text-danger" style="font-size:280%" id="lbPosCobroTotalPagar">Q 0.00</h2>
                                    </div>
                                </div>
                            </div>  
                            
                        </div>
                    </div>
                
                </div>
            </div>

            <button class="btn btn-secondary btn-xl btn-bottom-l btn-circle shadow hand" id="btnPosDocumentoAtras">
                <i class="fal fa-arrow-left"></i>
            </button>

            <button class="btn btn-info btn-xl btn-bottom-r btn-circle shadow" id="btnGuardarFactura">
                <i class="fal fa-save"></i>
            </button>
            `
        },
        documento_card_cliente:()=>{
            return `
            <div class="card card-rounded shadow border-base p-4"  style="font-size:80%">
                <div class="card-body">
                            

                            <div class="row">
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="negrita text-base">CÓDIGO CLIE</label>
                                        <input disabled type="text" class="form-control form-control-md border-base negrita text-verde" id="txtPosCobroNitclie" autocomplete="off">                            
                                    </div>
                                </div>
                                <div class="col-6">
                                   <div class="form-group">
                                        <label class="negrita text-base">NIT / DPI</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control form-control-md border-base negrita text-verde" id="txtPosCobroNit"  disabled="true">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <br>
                        
                            <div class="form-group">
                                <label class="negrita text-base">CLIENTE</label>
                                <input type="text" class="form-control form-control-md border-base negrita text-verde" id="txtPosCobroNombre" disabled="true">
                            </div>
                            
                            <div class="form-group">
                                <label class="negrita text-base">DIRECCIÓN</label>
                                <input type="text" class="form-control form-control-md border-base negrita text-verde" id="txtPosCobroDireccion" disabled="true">
                            </div>

                            <div class="form-group">
                                <label class="negrita text-base">TELÉFONO/S</label>
                                <input type="text" class="form-control form-control-md border-base negrita text-verde" id="txtPosCobroTelefono" disabled="true">
                            </div>

                            <div class="text-right hidden">
                                <button class="btn btn-verde hand text-white" id="btnNuevoCliente">
                                    <i class="fal fa-plus"></i> Crear Nuevo cliente
                                </button>
                            </div>

                            

                          

                                       


                        </div>
                    </div>
            `   
        },
        modal_lista_clientes:()=>{
            return `
                    <div class="card card-rounded col-12 shadow">            
                        <div class="card-body p-4">
                            <div class="row">
                                <select class="form-control negrita text-danger border-danger" id="cmbDiaCliente">
                                            <option value="LUNES">LUNES</option>
                                            <option value="MARTES">MARTES</option>
                                            <option value="MIERCOLES">MIERCOLES</option>
                                            <option value="JUEVES">JUEVES</option>
                                            <option value="VIERNES">VIERNES</option>
                                            <option value="SABADO">SABADO</option>
                                            <option value="DOMINGO">DOMINGO</option>
                                            <option value="OTROS">OTROS</option>
                                </select>
                                <div class="form-group col-12">
                                    <label class="text-secondary">Búsqueda de Clientes</label>
                                    <div class="input-group">
                                        <input type="search" autocomplete="off" class="form-control border-base negrita col-12" id="txtBuscarClie">
                                       
                                        <button class="btn btn-base hand text-white" id="btnBuscarClie">
                                            <i class="fal fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                               
                            </div>
                            <br>
                            <div class="row">
                                <table class="col-12 table table-hover table-border h-full">
                                    <thead class="bg-base text-white">
                                        <tr>
                                            <td>NIT / CÓDIGO</td>
                                            <td>CLIENTE / TELÉFONO</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataClientes"></tbody>
                                </table>
                            </div>
                          
                        </div>
                    </div>

                <button class="btn btn-warning btn-xl btn-bottom-l btn-circle shadow hand hidden" id="btnListadoDocumentos">
                    <i class="fal fa-folder"></i>  
                </button>


                <button class="btn btn-danger btn-xl btn-bottom-r btn-circle shadow hand" id="btnCameraQR">
                    <i class="fal fa-camera"></i>  
                </button>

                    `
        },
        modal_lista_documentos:()=>{
            return `
                    <div class="card card-rounded col-12 shadow">
                    
                        <div class="card-body p-4">

                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label class="negrita text-base">Filtrar documentos por...</label>
                                        <div class="input-group">
                                            <input type="date" class="negrita form-control" id="txtFechaDoc">
                                            <select class="form-control negrita" id="cmbTipoDoc">
                                                <option value="FACTURAS">FACTURAS</option>
                                                <option value="COT">COTIZACIONES</option>
                                            </select>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                            <br>
                            <div class="row" id="tblDocumentos">

                                
                            </div>
                            <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                                <i class="fal fa-arrow-left"></i>
                            </button>
                        </div>

                    </div>
                `
        },
        modal_qr:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" 
                role="dialog" aria-hidden="true" id="modal_qr">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-base d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Codigo QR del Cliente
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded" id="print_qr">
                                <div class="card-body p-4">

                                    <h3 class="negrita text-danger" id="lbNomclieQR"></h3>
                                    <h5 class="negrita text-danger" id="lbCodclieQR"></h5>

                                    <div id="container_qr">
                                    </div>

                                </div>

                                <br>
                                
                                <button class="btn btn-xl btn-secondary btn-circle hand shadow" data-dismiss="modal">
                                    <i class="fal fa-arrow-left"></i>
                                </button>
                            </div>                              

                        </div>
                    </div>
                </div>
            </div>

            
            `
        },
        modal_camara:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" 
                role="dialog" aria-hidden="true" id="modal_barcode">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-danger d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Lectura de Codigo QR
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded" id="">
                                <div class="card-body p-4">

                                   <div class="" id="root_barcode">
                                    </div>

                                </div>

                                <br>
                                
                                <button class="btn btn-xl btn-secondary btn-circle hand shadow" data-dismiss="modal">
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

    //document.title = "Ventas";
    document.title = `Vendedor - ${GlobalNomEmpresa}`;
    


    document.getElementById('tab-uno').click();

    F.slideAnimationTabs();


    let f = new Date();
    document.getElementById('cmbDiaCliente').value = F.getDiaSemana(f.getDay());


    //REINICIA EL HANDLE DE LA EMPRESA
    //cmbEmpresa.removeEventListener('change', handle_empresa_change)
    //cmbEmpresa.addEventListener('change', handle_empresa_change)



    // LISTENER DE LA VENTANA DE PEDIDOS
    listener_vista_pedido();

    listener_vista_cobro();

    listener_teclado();

    listener_listado_documentos();
    
    fcnNuevoPedido();

    //get_tbl_pedido();


    document.getElementById('txtFecha').value = F.getFecha();
    


    
    listener_coddoc();

   

    let btnGuardarFactura = document.getElementById('btnGuardarFactura');
    btnGuardarFactura.addEventListener('click',()=>{

       

        F.Confirmacion("¿Está seguro que desea Guardar esta Venta?")
        .then((value)=>{
            if(value==true){

                finalizar_pedido()
               
            }
        })
        

    });



    let btnCameraQR = document.getElementById('btnCameraQR');
    btnCameraQR.addEventListener('click',()=>{

        $("#modal_barcode").modal('show');
        iniciar_barcode();

    });

    

};



function listener_coddoc(){

    let cmbTipoDocumento = document.getElementById('cmbTipoDocumento')
    cmbTipoDocumento.addEventListener('change',()=>{
        get_coddoc(cmbTipoDocumento.value);
    })

    function get_coddoc(tipo){
        let container = document.getElementById('cmbCoddoc');
        container.innerHTML = '';

        let coddoc = ''
                
                if(tipo=='FAC'){coddoc = `<option value="${Selected_coddoc_env}">${Selected_coddoc_env}</option>`};
                if(tipo=='ENV'){coddoc = `<option value="${Selected_coddoc_env}">${Selected_coddoc_env}</option>`};
                if(tipo=='COT'){coddoc = `<option value="${Selected_coddoc_cot}">${Selected_coddoc_cot}</option>`};

                       
                container.innerHTML = coddoc;
 
                get_correlativo(container.value)
                .then((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
                .catch((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
                
    };

    let cmbCoddoc = document.getElementById('cmbCoddoc');
    cmbCoddoc.addEventListener('change',()=>{
        
        let tipo = document.getElementById('cmbTipoDocumento').value;
        let coddoc = ''
                
        if(tipo=='ENV'){coddoc = `<option value="${Selected_coddoc_env}">${Selected_coddoc_env}</option>`};
        if(tipo=='COT'){coddoc = `<option value="${Selected_coddoc_cot}">${Selected_coddoc_cot}</option>`};
        cmbCoddoc.innerHTML = coddoc;

        get_correlativo(cmbCoddoc.value)
        .then((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
        .catch((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
    })

    get_coddoc(cmbTipoDocumento.value);
};

function get_correlativo(coddoc){
      
    return new Promise((resolve,reject)=>{
        axios.post('/tipodocumentos/correlativo',{
            sucursal:GlobalEmpnit,
            coddoc:coddoc,
            token:TOKEN
        })
        .then((response) => {
            let data = response.data;
            if(Number(data.rowsAffected[0])>0){
                let correlativo = '';
                data.recordset.map((r)=>{
                    correlativo = r.CORRELATIVO
                })
                resolve(correlativo);             
            }else{
                reject('0');
            }                     
        }, (error) => {
            reject('0');
        });
    })

};


function listener_teclado(){
    //evitando errores
    Mousetrap.bind('f5', function(e) { e.preventDefault(); });
    Mousetrap.bind('f7', function(e) { e.preventDefault(); });

    Mousetrap.bind('f10', function(e) { e.preventDefault(); });
    Mousetrap.bind('f11', function(e) { e.preventDefault(); });
    Mousetrap.bind('f12', function(e) { e.preventDefault(); });
    
    //evitando errores

    Mousetrap.bind('ctrl+right', function() { document.getElementById('btnPosCobro').click() });
    Mousetrap.bind('ctrl+left', function() { document.getElementById('btnPosDocumentoAtras').click() });
    Mousetrap.bind('ctrl+g', function(e) { e.preventDefault(); document.getElementById('btnGuardarFactura').click() });
    


    Mousetrap.bind('f2', function() { 
        document.getElementById('txtPosCodprod').value='';
        document.getElementById('btnPosDocumentoAtras').click();
        document.getElementById('txtPosCodprod').focus();
    });

    
    

    Mousetrap.bind('f7', function(e) {
        e.preventDefault(); 
        document.getElementById('btnCobrarFel').click();
    });

    Mousetrap.bind('f8', function(e) {
        e.preventDefault(); 
        document.getElementById('btnCobrarFactura').click();
    });

    Mousetrap.bind('f9', function(e) {
        e.preventDefault(); 
        document.getElementById('btnCobrarCotizacion').click(); 
    });


};

function listener_vista_pedido(){


    document.getElementById('txtFechaDoc').value = F.getFecha();


    let txtPosCodprod = document.getElementById('txtPosCodprod');
    txtPosCodprod.addEventListener('keyup',(e)=>{

        txtPosCodprod.value = txtPosCodprod.value.toUpperCase();
        let filtro = txtPosCodprod.value || '';
        

        if(filtro==''){return;}

        if (e.code === 'Enter') { 
            document.getElementById('btnBuscarProd').click();
            //get_buscar_producto(filtro);
        };

        if (e.code === 13) { 
            document.getElementById('btnBuscarProd').click();
            //get_buscar_producto(filtro);
        };

        //if (e.keyCode === 13 && !e.shiftKey) {
            //get_buscar_producto(filtro);
        //};

    });

    document.getElementById('btnBuscarProd').addEventListener('click',()=>{
        txtPosCodprod.value = txtPosCodprod.value.toUpperCase();
        let filtro = txtPosCodprod.value || '';

        if(filtro==''){return;}

        get_buscar_producto(filtro);
        
    });
    


    //modal cantidad
    let btnMCGuardar = document.getElementById('btnMCGuardar');
    btnMCGuardar.addEventListener('click',()=>{

        let cantidad = Number(document.getElementById('txtMCCantidad').value || 1);
        let preciounitario = Number(document.getElementById('txtMCPrecio').value||0);
        let descuento = Number(document.getElementById('txtMCDescuento').value||0);

        if(preciounitario==0){
            F.AvisoError('Precio inválido');
            return;
        };

        if(Number(preciounitario)<Number(Selected_costo)){
            F.AvisoError('Precio menor al costo');
            return;
        };


        insert_producto_pedido(Selected_codprod,Selected_desprod,Selected_codmedida,Selected_equivale,Selected_costo,preciounitario,cantidad, Selected_exento, Selected_tipoprod, data_empresa_config.TIPO_PRECIO, Selected_existencia,Selected_bono,descuento)
        .then(()=>{
            
            $("#modal_cantidad").modal('hide');

            F.showToast('Producto agregado ' + Selected_desprod);
            get_tbl_pedido();
            
            document.getElementById('txtPosCodprod').focus();

        })
        .catch(()=>{
            F.AvisoError('No se pudo agregar');
        })

    });

    document.getElementById('txtMCCantidad').addEventListener('input',()=>{
        CalcularTotalPrecio();  
    });
    document.getElementById('txtMCCantidad').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            //document.getElementById('txtMCPrecio').focus();
            document.getElementById('btnMCGuardar').focus();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            //document.getElementById('txtMCPrecio').focus();
            document.getElementById('btnMCGuardar').focus();
        };  
    });
    document.getElementById('txtMCPrecio').addEventListener('input',()=>{
        CalcularTotalPrecio();  
    });
    document.getElementById('txtMCPrecio').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            document.getElementById('btnMCGuardar').focus();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            document.getElementById('btnMCGuardar').focus();
        };  
    });
        

    //modal editar cantidad
    let btnMCGuardarE = document.getElementById('btnMCGuardarE');
    btnMCGuardarE.addEventListener('click',()=>{

        let cantidad = Number(document.getElementById('txtMCCantidadE').value || 1);
        let preciounitario = Number(document.getElementById('txtMCPrecioE').value||0);
        let descuento =Number(document.getElementById('txtMCDescuentoE').value||0);

        if(preciounitario==0){
            F.AvisoError('Precio inválido');
            return;
        };

        if(Number(preciounitario)<Number(Selected_costo)){
            F.AvisoError('Precio menor al costo');
            return;
        };


        let nuevacantidad = Number(cantidad);
        selectDataRowVentaPOS(Number(Selected_id),nuevacantidad,preciounitario,descuento)
        .then(()=>{
            $("#modal_editar_cantidad").modal('hide');

            F.showToast('Producto agregado ' + Selected_desprod);
            get_tbl_pedido();
            document.getElementById('txtPosCodprod').focus();
        })
        .catch(()=>{
            F.AvisoError('No se pudo agregar');
        })



    });

    document.getElementById('txtMCCantidadE').addEventListener('input',()=>{
        CalcularTotalPrecioEditar();  
    });
    document.getElementById('txtMCCantidadE').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            //document.getElementById('txtMCPrecioE').focus();
            document.getElementById('btnMCGuardarE').focus();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            //document.getElementById('txtMCPrecioE').focus();
            document.getElementById('btnMCGuardarE').focus();
        };  
    });
    document.getElementById('txtMCPrecioE').addEventListener('input',()=>{
        CalcularTotalPrecioEditar();  
    });
    document.getElementById('txtMCPrecioE').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            document.getElementById('btnMCGuardarE').focus();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            document.getElementById('btnMCGuardarE').focus();
        };  
    });

    document.getElementById('txtMCDescuentoE').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            document.getElementById('btnMCGuardarE').focus();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            document.getElementById('btnMCGuardarE').focus();
        };  
    });



   
    
};

function listener_vista_cobro(){
    
    //document.getElementById('cmbPosCoddocFecha').value = F.getFecha();
    document.getElementById('txtPosCobroDireccion').value = "CIUDAD";

    document.getElementById('btnPosCobro').addEventListener('click',()=>{
        document.getElementById('tab-tres').click();
    });

    document.getElementById('btnPosDocumentoAtras').addEventListener('click',()=>{
        document.getElementById('tab-dos').click();
    });

    document.getElementById('txtPosCobroNit').addEventListener('keyup',(e)=>{
       
        let nit = document.getElementById('txtPosCobroNit').value.toUpperCase();

            if (e.code === 'Enter') {
                fcn_buscar_cliente(nit)
                .then(()=>{
                        
                })
                .catch(()=>{
                    nit = document.getElementById('txtPosCobroNit').value.replace('-','').replace(" ","");
                    F.GetDataNit(nit)
                    .then((json)=>{

                        document.getElementById('txtPosCobroNitclie').value = '';
                        document.getElementById('txtPosCobroNombre').value = json;
                        document.getElementById('txtPosCobroDireccion').value = "CIUDAD";
                        document.getElementById('txtPosCobroNombre').focus();
                    })
                })
            };
            if (e.keyCode === 13 && !e.shiftKey) {
                fcn_buscar_cliente(nit)
                .then(()=>{
                        
                })
                .catch(()=>{
                    nit = document.getElementById('txtPosCobroNit').value.replace('-','').replace(" ","");
                    F.GetDataNit(nit)
                    .then((json)=>{
                        document.getElementById('txtPosCobroNitclie').value = '';
                        document.getElementById('txtPosCobroNombre').value = json;
                        document.getElementById('txtPosCobroDireccion').value = "CIUDAD";
                        document.getElementById('txtPosCobroNombre').focus();
                    })
                })
            };
     

    });




    document.getElementById('txtBuscarClie').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            document.getElementById('btnBuscarClie').click();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            document.getElementById('btnBuscarClie').click();
        };  
    });

    document.getElementById('btnBuscarClie').addEventListener('click',(e)=>{  
        let filtro = document.getElementById('txtBuscarClie').value || '';
        tbl_clientes(filtro);
    });


    let btnNuevoCliente = document.getElementById('btnNuevoCliente');
    btnNuevoCliente.addEventListener('click',()=>{

            let nit = document.getElementById('txtPosCobroNit').value || 'CF';
            let nombre = document.getElementById('txtPosCobroNombre').value || 'SN';
            let direccion = document.getElementById('txtPosCobroDireccion').value || 'CIUDAD';
            let telefono = document.getElementById('txtPosCobroTelefono').value || '';

            if(nombre=='SN'){
                F.AvisoError('Nombre de cliente no es válido');
                return;
            }

            F.Confirmacion('¿Está seguro que desea crear este nuevo cliente?')
            .then((value)=>{
                if(value==true){
                    btnNuevoCliente.disabled = true;
                    btnNuevoCliente.innerHTML = get_button_loader('Creando cliente nuevo')

                    insert_cliente(nit,nombre,direccion, telefono)
                    .then((data)=>{

                        let codcli = ''
                        data.recordset.map((r)=>{
                            codcli = r.Current_Identity.toString();
                        })
                        document.getElementById('txtPosCobroNitclie').value = codcli;

                        F.Aviso('Cliente creado exitosamente!!');
                        btnNuevoCliente.disabled = false;
                        btnNuevoCliente.innerHTML = `<i class="fal fa-plus"></i> Crear Nuevo cliente`;
                    })
                    .catch(()=>{
                        F.AvisoError('No se pudo crear el cliente nuevo');
                        btnNuevoCliente.disabled = false;
                        btnNuevoCliente.innerHTML = `<i class="fal fa-plus"></i> Crear Nuevo cliente`;
                    })
        
                }
            })
   


    })



};



function listener_listado_documentos(){

    let btnListadoDocumentos = document.getElementById('btnListadoDocumentos');
    btnListadoDocumentos.addEventListener('click',()=>{
        //$("#modal_lista_documentos").modal('show');
        
        document.getElementById('tab-cuatro').click();

        tbl_lista_documentos('ENV');

    });

    document.getElementById('txtFechaDoc').addEventListener('change',()=>{
        tbl_lista_documentos();
    });
    document.getElementById('cmbTipoDoc').addEventListener('change',()=>{
        tbl_lista_documentos();
    });

};

function initView(){                                                                                                                                             
   
    getView();
    addListeners();

};




function tbl_clientes(filtro,qr){
   
  
    let url_clientes = '';

    if(qr=='SI'){
        url_clientes = '/clientes/buscar_cliente_vendedor_qr'
    }else{
        if(Number(GlobalNivelUsuario)==8){
            //es vendedor comodin
            url_clientes = '/clientes/buscar_cliente_vendedor_comodin'
        }else{
            //es vendedor normal
            url_clientes = '/clientes/buscar_cliente_vendedor'
        }
        
    };

    let container = document.getElementById('tblDataClientes');
    container.innerHTML = GlobalLoader;

    let str = '';

    let dia = document.getElementById('cmbDiaCliente').value;

    axios.post(url_clientes, {
        token:TOKEN,
        sucursal: GlobalEmpnit,
        filtro:filtro,
        codven:GlobalCodUsuario,
        dia:dia
    })
    .then((response) => {        
        if(response.data=='error'){
            F.AvisoError('Error en la solicitud');
            container.innerHTML = 'No day datos....';
        }else{
            const data = response.data.recordset;
            data.map((r)=>{
                str += `
                <tr class="hand">    
                    <td>
                        ${r.NIT} / ${r.CODCLIENTE}
                        <br>
                        
                        <small class="text-danger negrita">${r.VISITA}</small>
                        <br>

                        <button class="btn btn-md btn-circle btn-info hand shadow" onclick="F.gotoGoogleMaps('${r.LATITUD}','${r.LONGITUD}')">
                            <i class="fal fa-globe"></i>
                        </button>

                        <br><br>

                        <button class="btn btn-md btn-circle btn-warning hand shadow" onclick="create_qr_code('${r.CODCLIENTE}','${r.NOMBRE}')">
                            <i class="fal fa-barcode"></i>
                        </button>

                    </td>
                    <td>
                        <small class="text-info">${r.TIPONEGOCIO}-${r.NEGOCIO}</small>
                        <br>
                        ${r.NOMBRE}
                        <br>
                        <small>${r.DIRECCION}</small>
                        <br>
                        <small>Ref: ${r.REFERENCIA}</small>
                        <br>
                        <small>Tel: ${r.TELEFONO}</small>
                    </td>
                     
                    <td>
                        <button class="btn btn-circle btn-md btn-base hand shadow" 
                        onclick="get_datos_cliente('${r.CODCLIENTE}','${r.NIT}','${r.NOMBRE}','${r.DIRECCION}','${r.TELEFONO}')">
                            <i class="fal fa-shopping-cart"></i>
                        </button>
                    </td>
                </tr>
                `
            })
            container.innerHTML = str;
        }
    }, (error) => {
        F.AvisoError('Error en la solicitud');
        container.innerHTML = 'No day datos....';
    });



};


function create_qr_code(codigo,nomclie){


    $("#modal_qr").modal('show');

    document.getElementById('lbNomclieQR').innerText = nomclie;
    document.getElementById('lbCodclieQR').innerText = `Codigo: ${codigo}`

    F.create_qr_code(codigo,'container_qr');

}

async function iniciar_barcode() {

    let root_barcode = document.getElementById('root_barcode');

    try {
        let child = document.getElementById('barcode_video');
        root_barcode.removeChild(child)        
    } catch (error) {
        
    }
    
    let txtCodprod = document.getElementById('txtBuscarClie')
    

    if('BarcodeDetector' in window ){
        
    }else{
        root_barcode.innerHTML = 'No se puede usar Barcode en este dispositivo';
        return;
    };

    
    const barcodeDetector = new BarcodeDetector({
        formats: ["code_39", "codabar", "ean_13",'code_128','qr_code'],
    });

    
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
  
    const video = document.createElement("video");
    video.width=400;
    video.height=500;
    video.srcObject = mediaStream;
    video.autoplay = true;
    video.id = "barcode_video"
  
    //list.before(video);

    root_barcode.appendChild(video);
    let codproducto = '';

    let contador = 0;
    function render() {
      barcodeDetector
        .detect(video)
        .then((barcodes) => {
            
          barcodes.forEach((barcode) => {
                contador+=1;
                    if(contador==1){
                        codproducto = barcode.rawValue;
                        //esto para evitar que busque muchas veces el mismo código
                        txtCodprod.value = codproducto.replace('XELASOL-','');
                        $("#modal_barcode").modal('hide');
                        document.getElementById('btnBuscarClie').click();
                    }
                    
          });
        })
        .catch(console.error);
    }
  
    (function renderLoop() {
      requestAnimationFrame(renderLoop);
      render();
    })();
};



function insert_cliente(nit,nombre,direccion,telefono){

    return new Promise((resolve,reject)=>{
        axios.post('/clientes/insert_cliente',{
            fecha:F.getFecha(),
            sucursal: GlobalEmpnit,
            nit: nit,
            nombre: nombre,
            direccion: direccion,
            coddepto: '1',
            codmunicipio: '1',
            telefono: telefono,
            email: 'SN',
            lat: '0',
            long: '0'
        })
        .then((response) => {
            let data = response.data;
            if(Number(data.rowsAffected[0])>0){
                resolve(data);             
            }else{
                reject();
            }                     
        }, (error) => {
            reject();
        });
    })

};

function fcn_buscar_cliente(nit){
   
    return new Promise((resolve, reject)=>{
        if(nit==''){
            F.AvisoError('Escriba un nombre o nit válidos');
            reject();
            return;
        };
    
        axios.post('/pos/buscar_cliente_nit', {
            sucursal: GlobalEmpnit,
            nit:nit
        })
        .then((response) => {        
            if(response=='error'){
                F.AvisoError('Error en la solicitud');
                reject();
            }else{
                const data = response.data.recordset;
                if(response.data.rowsAffected[0].toString()=='0'){
                    reject();
                    return;
                }
                data.map((r)=>{
                    document.getElementById('txtPosCobroNit').value = r.NIT;
                    document.getElementById('txtPosCobroNitclie').value = r.NITCLIE;
                    document.getElementById('txtPosCobroNombre').value = r.NOMCLIE;
                    document.getElementById('txtPosCobroDireccion').value = r.DIRCLIE;
                })
                resolve();
            }
        }, (error) => {
            F.AvisoError('Error en la solicitud');
            reject();
        });
    
    })
    


};

function get_datos_cliente(nitclie,nit,nomclie,dirclie,telefono){

    //$("#modal_lista_clientes").modal('hide');

    document.getElementById('txtPosCobroNit').value = nit;
    document.getElementById('txtPosCobroNitclie').value = nitclie;
    document.getElementById('txtPosCobroNombre').value = nomclie;
    document.getElementById('txtPosCobroDireccion').value = dirclie;
    document.getElementById('txtPosCobroTelefono').value = telefono;
    
    
    document.getElementById('tab-dos').click();

    document.getElementById('txtPosCodprod').focus();


};

function CalcularTotalPrecio(){

    let cantidad = document.getElementById('txtMCCantidad').value || 1;
    let precio = document.getElementById('txtMCPrecio').value;
    
    document.getElementById('txtMCTotalPrecio').value = (Number(cantidad)*Number(precio));


};

function CalcularTotalPrecioEditar(){

    let cantidad = document.getElementById('txtMCCantidadE').value || 1;
    let precio = document.getElementById('txtMCPrecioE').value;
    
    document.getElementById('txtMCTotalPrecioE').value = (Number(cantidad)*Number(precio));

};

function get_buscar_producto(filtro){

    $("#modal_lista_precios").modal('show');

    let container = document.getElementById('tblDataProductos');
    container.innerHTML = GlobalLoader;

    document.getElementById('btnBuscarProd').innerHTML = '<i class="fal fa-sync fa-spin"></i>';
    document.getElementById('btnBuscarProd').disabled=true;

    let str = '';

    let idf = 'first-element'; let i =0;

    axios.post('/pos/productos_filtro', {
        sucursal: GlobalEmpnit,
        token:TOKEN,
        filtro:filtro,
        tipoprecio:data_empresa_config.TIPO_PRECIO
    })
    .then((response) => {        
        if(response=='error'){
            F.AvisoError('Error en la solicitud');
            container.innerHTML = 'No day datos....';
        }else{
            const data = response.data.recordset;
            data.map((r)=>{
                
                let EXISTENCIA = F.get_existencia(Number(r.EXISTENCIA),Number(r.EQUIVALE)); //r.EXISTENCIA


                let strClassIps = '';
                if(r.BONO.toString()=='0'){}else{}strClassIps = 'negrita text-base'
                let strClassExistencia = '';
                let existencia = Number(EXISTENCIA);
                if(existencia<=0){strClassExistencia='bg-danger text-white'};

                
                str += `
                    <tr class="hand" onclick="get_producto('${r.CODPROD}','${r.DESPROD}','${r.CODMEDIDA}','${r.EQUIVALE}','${r.COSTO}','${r.PRECIO}','${r.TIPOPROD}','${r.EXENTO}','${EXISTENCIA}','${r.BONO}')">
                        
                        <td><b style="color:${r.COLOR}">${r.DESPROD}</b>
                            <br>
                            <small class="negrita text-danger">Cód:${r.CODPROD}</small>
                        </td>
                        <td>${r.CODMEDIDA} (Eq:${r.EQUIVALE})</td>
                        <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                        <td class="negrita ${strClassExistencia}">${F.setMoneda(EXISTENCIA,'')}</td>
                        <td>${r.DESMARCA}</td>
                        <td>${r.TIPOPROD}</td>
                    </tr>
                `
            })
            container.innerHTML = str;
            
            document.getElementById('btnBuscarProd').innerHTML = '<i class="fal fa-search"></i>';
            document.getElementById('btnBuscarProd').disabled=false;

            //getMoveTable();
        }
    }, (error) => {
        F.AvisoError('Error en la solicitud');
        container.innerHTML = 'No day datos....';
        document.getElementById('btnBuscarProd').innerHTML = '<i class="fal fa-search"></i>';
        document.getElementById('btnBuscarProd').disabled=false;
    });



};





function getMoveTable(){

    return;

        let start = document.getElementById('first-element');
        start.focus();
        start.style.backgroundColor = '#50b988';
        start.style.color = 'white';

        const changeStyle = (sibling) => {
            if (sibling !== null) {
                start.focus();
                start.style.backgroundColor = '';
                start.style.color = '';
                sibling.focus();
                sibling.style.backgroundColor = '#50b988';
                sibling.style.color = 'white';
                start = sibling;
            }
        };

        const checkKey = (event) => {
            event = event || window.event;
            const idx = start.cellIndex;

            if (event.keyCode === 38) {
                // up arrow
                const previousSibling = start.previousElementSibling;
                changeStyle(previousSibling);
                
                //const previousRow = start.parentElement.previousElementSibling;
                //if (previousRow !== null) {
                //const previousSibling = previousRow.cells[idx];
                //changeStyle(previousSibling);
                //}

            } else if (event.keyCode === 40) {
                // down arrow
                const nextsibling = start.nextElementSibling;
                changeStyle(nextsibling);
                
                //const nextRow = start.parentElement.nextElementSibling;
                //if (nextRow !== null) {
                //const nextSibling = nextRow.cells[idx];
                //changeStyle(nextSibling); 
                //}

            } else if (event.keyCode === 37) {
                // left arrow
                //const previousSibling = start.previousElementSibling;
                //changeStyle(previousSibling);
            } else if (event.keyCode === 39) {
                // right arrow
                
                //const nextsibling = start.nextElementSibling;
                //changeStyle(nextsibling);
                
                
                console.log(start.onclick());

            }
        };

        document.onkeydown = checkKey;

};

function get_tbl_productos_clasificacion(codigo){

    let container = document.getElementById('tblPosProductosCategoria');
    container.innerHTML = GlobalLoader;

    let str = '';

    axios.post('/pos/productos_categoria', {
        sucursal: GlobalEmpnit,
        codigo:codigo
    })
    .then((response) => {        
        if(response=='error'){
            F.AvisoError('Error en la solicitud');
            container.innerHTML = 'No day datos....';
        }else{
            const data = response.data.recordset;
            data.map((r)=>{
                str += `
                <tr class="hand border-secondary border-top-0 border-left-0 border-right-0" onclick="get_data_producto_categoria('${r.CODPROD}','${r.DESPROD}','${r.CODMEDIDA}','${r.EQUIVALE}','${r.COSTO}','${r.PRECIO}')">
                    <td>
                        ${F.limpiarTexto(r.DESPROD)}
                        <br>
                        <small>Código: <b class="text-danger">${r.CODPROD}</b></small>
                        <br>
                        <small>Marca: <b class="text-secondary">${r.DESMARCA}</b></small>
                    </td>
                    <td>
                        ${r.CODMEDIDA} 
                        <br>
                        <small>Equivale: <b class="text-danger">${r.EQUIVALE}</b></small>
                    </td>
                    <td><b class="h4">${F.setMoneda(r.PRECIO ||0,'Q')}</b></td>
                </tr>
                `
            })
            container.innerHTML = str;
        }
    }, (error) => {
        F.AvisoError('Error en la solicitud');
        container.innerHTML = 'No day datos....';
    });


};


function get_producto(codprod,desprod,codmedida,equivale,costo,precio,tipoprod,exento,existencia,bono){

            //$("#modal_lista_precios").modal('hide');
            
            
   
            let container = document.getElementById('container_precio');
            container.innerHTML = GlobalLoader;

            document.getElementById('txtMCCantidad').value = '';
            document.getElementById('txtMCPrecio').value = 0;
            document.getElementById('btnMCGuardar').disabled = true;


            CalcularTotalPrecio();

            Selected_codprod = codprod;
            Selected_desprod = desprod;
            Selected_codmedida = codmedida;
            Selected_equivale = Number(equivale);
            Selected_costo = Number(costo);
            Selected_precio = Number(precio);
            Selected_tipoprod = tipoprod;
            Selected_exento = Number(exento);
            Selected_existencia = Number(existencia);
            Selected_bono = Number(bono);

            document.getElementById('lbCantidadDesprod').innerText = `${desprod} (${codmedida} - Eq: ${equivale})`;

            document.getElementById('txtMCCantidad').value = '';
            document.getElementById('txtMCPrecio').value = precio;
            //document.getElementById('txtMCBono').value = precio;

            CalcularTotalPrecio();

            document.getElementById('txtPosCodprod').value = '';

            
            container.innerHTML = '';

            document.getElementById('btnMCGuardar').disabled = false;

            $("#modal_cantidad").modal('show');
 

            document.getElementById('txtMCCantidad').focus();
   

};

function get_datos_precio(codprod,codmedida){

    return new Promise((resolve,reject)=>{

        axios.post('/pos/productos_precio', {
            sucursal: GlobalEmpnit,
            token:TOKEN,
            codprod:codprod,
            codmedida:codmedida
        })
        .then((response) => {
            if(response=='error'){
                F.AvisoError('Error en la solicitud');
            }else{
                const data = response.data;
                resolve(data);
            }
        }, (error) => {
            F.AvisoError('Error en la solicitud');
        });

    })

};


function calcular_descuento(idDescuento,idTotalPrecio,idTotalPrecioDescuento){

    try {
        let descuento = Number(document.getElementById(idDescuento).value || 0) ;
        let totalprecio = Number(document.getElementById(idTotalPrecio).value || 0);
        document.getElementById(idTotalPrecioDescuento).value = (totalprecio - descuento) 

    } catch (error) {
        document.getElementById(idTotalPrecioDescuento).value = totalprecio;
    }

};


function insert_producto_pedido(codprod,desprod,codmedida,equivale,costo,precio,cantidad,exento,tipoprod,tipoprecio,existencia,bono,descuento){
    

    //RUTINA QUE COMPARA EXISTENCIA CON CANTIDAD
   
  
    
        let varTotalUnidades = Number(cantidad * equivale);
        let varExistencia = Number(existencia * equivale);

        console.log(varTotalUnidades)
        console.log(varExistencia);
    
        if(varTotalUnidades > Number(varExistencia)){F.AvisoError('Existencia menor a la cantidad pedida');return;}
    

    let datos = 
        {
            CODSUCURSAL:GlobalEmpnit.toString(),
            EMPNIT:GlobalEmpnit.toString(),
            USUARIO:'',
            CODPROD:codprod.toString(),
            DESPROD:desprod.toString(),
            CODMEDIDA:codmedida.toString(),
            EQUIVALE:Number(equivale),
            COSTO:Number(costo),
            TOTALCOSTO:Number(costo)*Number(cantidad),
            PRECIO:Number(precio),
            CANTIDAD:Number(cantidad),
            TOTALUNIDADES: varTotalUnidades, //Number(cantidad * equivale),
            TOTALPRECIO:Number(precio)*Number(cantidad),
            EXENTO:Number(exento),
            TIPOPROD:tipoprod,
            TIPOPRECIO:tipoprecio,
            EXISTENCIA:Number(existencia),
            BONO:Number(bono),
            DESCUENTO:Number(descuento)
        };

    

    return new Promise((resolve,reject)=>{
        insertTempVentasPOS(datos)
        .then(()=>{
            resolve();
        }) 
        .catch(()=>{
            reject();
        }) 
    });

};



function get_tbl_pedido(){

    let container = document.getElementById('tblPosPedido');
    container.innerHTML = GlobalLoader;

    let str = '';
    let varTotalItems = 0;
    let varTotalVenta = 0;
    let varTotalCosto = 0;
    let varTotalDescuento = 0;

    selectTempVentasPOS(GlobalEmpnit)
    .then((data)=>{
        let datos = data.map((rows)=>{
            varTotalItems += 1;
            varTotalVenta = varTotalVenta + Number(rows.TOTALPRECIO);
            varTotalCosto = varTotalCosto + Number(rows.TOTALCOSTO);
            varTotalDescuento += Number(rows.DESCUENTO);
            return `
            <tr class="border-base border-left-0 border-right-0 border-top-0">
                <td class="text-left">
                    ${rows.DESPROD}
                    <br>
                    <small class="negrita"><b>${rows.CODPROD}</b></small>
                    <br>
                        ${rows.CODMEDIDA} (eq: ${rows.EQUIVALE})
                    <br>

                    <div class="row">
                        <div class="col-3">
                            <b class="text-info" style="font-size:140%">${rows.CANTIDAD}</b>
                        </div>
                        <div class="col-4">
                            <small class="negrita">${F.setMoneda(rows.PRECIO,'Q')}</small>
                        </div>
                        <div class="col-5">
                            <b class="negrita text-danger h5">${F.setMoneda(rows.TOTALPRECIO,'Q')}</b>
                        </div>
                       
                    </div>
                </td>
               
                <td>
                    <button class="btn btn-md btn-circle btn-info shadow hand" onclick="edit_item_pedido('${rows.ID}','${rows.CODPROD}','${rows.DESPROD}','${rows.CODMEDIDA}','${rows.EQUIVALE}','${rows.CANTIDAD}','${rows.COSTO}','${rows.PRECIO}','${rows.TIPOPROD}','${rows.EXENTO}','${rows.EXISTENCIA}','${rows.BONO}','${rows.DESCUENTO}')">
                        <i class="fal fa-edit"></i>
                    </button>
                </td> 
                <td>
                    <button class="btn btn-md btn-circle btn-danger shadow hand" onclick="delete_item_pedido('${rows.ID}')">
                        <i class="fal fa-trash"></i>
                    </button>
                </td>                            
            </tr>`
       }).join('\n');
        container.innerHTML = datos;

        GlobalTotalCostoDocumento = varTotalCosto;
        GlobalTotalDocumento = varTotalVenta;
        GlobalTotalDescuento = varTotalDescuento;

        document.getElementById('lbTotalItems').innerText = varTotalItems.toString() + ' items';
        document.getElementById('lbTotalVenta').innerText = F.setMoneda(varTotalVenta,'Q');
        document.getElementById('lbTotalDescuento').innerText = `- ${F.setMoneda(varTotalDescuento,'Q')}` ;
        document.getElementById('lbTotalVentaDescuento').innerText = F.setMoneda((varTotalVenta-varTotalDescuento),'Q');
        
        document.getElementById('lbPosCobroTotalPagar').innerText = F.setMoneda((varTotalVenta-varTotalDescuento),'Q');
    })
    .catch((error)=>{
        
        console.log(error)
        container.innerHTML = 'No hay datos...';
        GlobalTotalCostoDocumento = 0;
        GlobalTotalDocumento = 0;
        GlobalTotalDescuento = 0;

        document.getElementById('lbTotalItems').innerText = '---';
        document.getElementById('lbTotalVenta').innerText = 
        document.getElementById('lbTotalDescuento').innerText = '---';
        document.getElementById('lbTotalVentaDescuento').innerText = '---';
        document.getElementById('lbPosCobroTotalPagar').innerText = '---';
    })


};



function edit_item_pedido(id,codprod,desprod,codmedida,equivale,cantidad,costo,precio,tipoprod,exento,existencia,bono,descuento){

    $("#modal_editar_cantidad").modal('show');

    Selected_id = id;
    Selected_codprod = codprod;
    Selected_desprod = desprod;
    Selected_codmedida = codmedida;
    Selected_equivale = Number(equivale);
    Selected_costo = Number(costo);
    Selected_precio = Number(precio);
    Selected_tipoprod = tipoprod;
    Selected_exento = Number(exento);
    Selected_existencia = Number(existencia);
    Selected_bono = Number(bono)

    document.getElementById('lbCantidadDesprodE').innerText = `${desprod} (${codmedida} - Eq: ${equivale})`;

    document.getElementById('txtMCCantidadE').value = cantidad;
    document.getElementById('txtMCPrecioE').value = precio;
    document.getElementById('txtMCDescuentoE').value = descuento;

    CalcularTotalPrecioEditar();

    document.getElementById('txtMCCantidadE').focus();
};

function delete_item_pedido(id){

    F.Confirmacion('¿Está seguro que desea quitar este item?')
    .then((value)=>{
        if(value==true){
            deleteItemVentaPOS(id)
            .then(()=>{
                F.showToast('Item eliminado');
                get_tbl_pedido();
            })
            .catch(()=>{
                F.AvisoError('No se pudo quitar este item');
            })
        }
    })
    
};

function get_coddoc(tipo){
    return new Promise((resolve, reject)=>{
        axios.post('/tipodocumentos/series_doc', {
            sucursal: GlobalEmpnit,
            tipo:tipo
        })
        .then((response) => {
            if(response=='error'){
                F.AvisoError('Error en la solicitud');
            }else{
                const data = response.data;
                resolve(data);
            }
        }, (error) => {
            F.AvisoError('Error en la solicitud');
        });
    })
};

function get_correlativo_coddoc(coddoc){
    return new Promise((resolve,reject)=>{
        axios.post('/tipodocumentos/correlativo',{
            sucursal:GlobalEmpnit,
            coddoc:coddoc,
            token:TOKEN
        })
        .then((response) => {
            let data = response.data;
            if(Number(data.rowsAffected[0])>0){
                let correlativo = '';
                data.recordset.map((r)=>{
                    correlativo = r.CORRELATIVO
                })
                resolve(correlativo);             
            }else{
                reject('0');
            }                     
        }, (error) => {
            reject('0');
        });
    })
};



function finalizar_pedido(){


    let btnGuardarFactura = document.getElementById('btnGuardarFactura');
        

    let coddoc = document.getElementById('cmbCoddoc').value;
    let correlativoDoc = document.getElementById('txtCorrelativo').value;



    F.showToast('Obteniendo correlativo');

    btnGuardarFactura.disabled = true;
    btnGuardarFactura.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

    get_correlativo_coddoc(coddoc)
    .then((correlativo)=>{

        btnGuardarFactura.disabled = false;
        btnGuardarFactura.innerHTML = `<i class="fal fa-save"></i>`;

        document.getElementById('txtCorrelativo').value = correlativo;
        correlativoDoc = correlativo;


        let codcliente = document.getElementById('txtPosCobroNitclie').value || ''; //GlobalSelectedCodCliente;
        if(codcliente==''){
            F.AvisoError('Seleccione un cliente');
            return;
        };
    
        let nit = document.getElementById('txtPosCobroNit').value || 'CF';
        let ClienteNombre = document.getElementById('txtPosCobroNombre').value;
        GlobalSelectedNomCliente = ClienteNombre;
        let dirclie = document.getElementById('txtPosCobroDireccion').value;
        GlobalSelectedDirCliente = dirclie;
        let obs = F.limpiarTexto(document.getElementById('txtObs').value) || '';  
        let direntrega = "SN"; 
        let codbodega = GlobalCodBodega;
        let cmbTipoEntrega = ''; 
        
        let txtFecha = new Date(document.getElementById('txtFecha').value);
        let anio = txtFecha.getFullYear();
        let mes = txtFecha.getUTCMonth()+1;
        let dia = txtFecha.getUTCDate() 
        let fecha = F.devuelveFecha('txtFecha'); //F.getFecha() //anio + '-' + mes + '-' + d; 
        
        let hora = F.getHora();
    
       
    
       
        let latdoc = '0';
        let longdoc = '0';
    
        let tipo_pago = 'CON'; 
        let tipo_doc = '';
        
        let var_mostrador = document.getElementById('inlineRadio1').checked.toString();
        let var_domicilio = document.getElementById('inlineRadio2').checked.toString();
        let var_callcenter = document.getElementById('inlineRadio3').checked.toString();
        if(var_mostrador=="true"){tipo_doc='MOSTRADOR'};
        if(var_domicilio=="true"){tipo_doc='DOMICILIO'};
        if(var_callcenter=="true"){tipo_doc='CALLCENTER'};
    
    
        let entrega_contacto = ClienteNombre;
        let entrega_telefono = ''; 
        let entrega_direccion = ''; 
        let entrega_referencia = ''; 
        let entrega_lat = '0';
        let entrega_long = '0';
    
        
        get_tbl_pedido();
    
            //VERIFICACIONES
        if(Number(GlobalTotalDocumento)==0){F.AvisoError('No hay productos agregados');return;}
        
        btnGuardarFactura.disabled = true;
        btnGuardarFactura.innerHTML = `<i class="fal fa-save fa-spin"></i>`;
    
            gettempDocproductos_pos(GlobalUsuario)
            .then((response)=>{
                axios.post('/pos/insertventa_factura', {
                    jsondocproductos:JSON.stringify(response),
                    sucursal:GlobalEmpnit,
                    coddoc:coddoc,
                    correlativo: correlativoDoc,
                    anio:anio,
                    mes:mes,
                    fecha:fecha,
                    fechaentrega:fecha,
                    formaentrega:cmbTipoEntrega,
                    codbodega:codbodega,
                    codcaja: 0, //cmbCaja.value,
                    codcliente: codcliente, //x
                    nomclie:ClienteNombre,
                    totalcosto:GlobalTotalCostoDocumento,
                    totalprecio:GlobalTotalDocumento,
                    totaldescuento:GlobalTotalDescuento,
                    nitclie:nit,
                    dirclie:dirclie,
                    obs:obs,
                    direntrega:direntrega,
                    usuario:GlobalUsuario,
                    codven: GlobalCodUsuario, //cmbVendedor.value,
                    lat:latdoc,
                    long:longdoc,
                    hora:hora,
                    tipo_pago:tipo_pago,
                    tipo_doc:tipo_doc,
                    entrega_contacto:entrega_contacto,
                    entrega_telefono:entrega_telefono,
                    entrega_direccion:entrega_direccion,
                    entrega_referencia:entrega_referencia,
                    entrega_lat:entrega_lat,
                    entrega_long:entrega_long,
                    iva:GlobalConfigIVA
                })
                .then((response) => {
                    const data = response.data;
                    if (data=='error'){
                        F.AvisoError('No se pudo guardar');
                        btnGuardarFactura.disabled = false;
                        btnGuardarFactura.innerHTML = `<i class="fal fa-save"></i>`;
                    }else{
                        F.Aviso('Generado Exitosamente !!!')
                        btnGuardarFactura.disabled = false;
                        btnGuardarFactura.innerHTML = `<i class="fal fa-save"></i>`;
    
                        deleteTempVenta_pos(GlobalUsuario);
    
                        fcnNuevoPedido();
                    }
                }, (error) => {
                    console.log(error);
                    F.AvisoError('No se pudo guardar');
                    btnGuardarFactura.disabled = false;
                    btnGuardarFactura.innerHTML = `<i class="fal fa-save"></i>`;
                });        
            })
            .catch((error)=>{
                console.log(error);
                F.AvisoError('No se pudo guardar');
                btnGuardarFactura.disabled = false;
                btnGuardarFactura.innerHTML = `<i class="fal fa-save"></i>`;
            })
    

    })
    .catch(()=>{
        document.getElementById('txtCorrelativo').value = '0';
        F.AvisoError('No se pudo obtener el correlativo del documento... intentelo de nuevo');
        btnGuardarFactura.disabled = false;
        btnGuardarFactura.innerHTML = `<i class="fal fa-save"></i>`;
    })





            
};



function fcnNuevoPedido(){
  
        GlobalTotalDocumento =0;
        GlobalTotalDescuento =0;
        GlobalTotalCostoDocumento=0;
        
        
        document.getElementById('txtObs').value = '';
        
        document.getElementById('inlineRadio1').checked = true;

        document.getElementById('txtPosCobroNit').value = 'CF';
        document.getElementById('txtPosCobroNitclie').value = 0;
        document.getElementById('txtPosCobroNombre').value = 'CONSUMIDOR FINAL';
        document.getElementById('txtPosCobroDireccion').value = 'CIUDAD';
       
        //document.getElementById('btnPosDocumentoAtras').click();


        get_tbl_pedido();

        let cmbCoddoc = document.getElementById('cmbCoddoc');
        get_correlativo(cmbCoddoc.value)
        .then((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
        .catch((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
    
        document.getElementById('tab-uno').click();

};


//---------------------------
//editar pedido
//---------------------------
function tbl_lista_documentos(){

    let tipo = document.getElementById('cmbTipoDoc').value;
    let fecha = F.devuelveFecha('txtFechaDoc');

    let container = document.getElementById('tblDocumentos');
    container.innerHTML = GlobalLoader;
    

    let coddoc = document.getElementById('cmbCoddoc').value;
  
   
    let tableheader = `<table class="table table-responsive table-hover table-striped table-bordered h-full">
                        <thead class="bg-base text-white">
                            <tr>
                                <td>HORA</td>
                                <td>DOCUMENTO</td>
                                <td>CLIENTE</td>
                                <td>IMPORTE</td>
                                <td>ST</td>
                                <td>CERTIFICACION</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody id="tblListaPedidos">`;
    let tablefoooter ='</tbody></table>';

    let strdata = '';
    let totalpedidos = 0;
    
    axios.post('/pos/lista_documentos_temporales', {
        sucursal: GlobalEmpnit,
        tipo:tipo,
        fecha:fecha,
        coddoc:coddoc   
    })
    .then((response) => {
        const data = response.data.recordset;
        let total =0;
        data.map((rows)=>{
                let strClassAnulado = ''; if(rows.ST.toString()=='A'){strClassAnulado='text-danger'};
                let idBtnDownload = `btnDownload${rows.CODDOC + '-' + rows.CORRELATIVO}`
                let idBtnAnular = `btnAnular${rows.CODDOC + '-' + rows.CORRELATIVO}`
                total = total + Number(rows.TOTALPRECIO);
                totalpedidos = totalpedidos + 1;
                strdata = strdata + `
                        <tr>
                            <td>${rows.HORA}</td>
                            <td>
                                <b class="text-danger">${rows.CODDOC + '-' + rows.CORRELATIVO}</b>
                            </td>
                            <td>${rows.NOMCLIE}</td>
                            <td class="${strClassAnulado}"><b>${F.setMoneda(rows.TOTALPRECIO,'Q')}</b></td>
                            <td class="negrita ${strClassAnulado}">${rows.ST}</td>
                            <td>${rows.FEL_UUDI}</td>
                            <td>
                                <button class="btn btn-circle btn-verde btn-md hand shadow" id="${idBtnDownload}" onclick="get_pdf('${rows.CODDOC}','${rows.CORRELATIVO}','${idBtnDownload}')">
                                    <i class="fal fa-download"></i>
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-circle btn-danger btn-md hand shadow" id="${idBtnAnular}" onclick="anular_factura('${rows.CODDOC}','${rows.CORRELATIVO}','${rows.ST}','${idBtnAnular}')">
                                    <i class="fal fa-sync"></i>
                                </button>
                            </td>
                        </tr>`
        })
        container.innerHTML = tableheader + strdata + tablefoooter;
    }, (error) => {
        F.AvisoError('Error en la solicitud');
        strdata = '';
        container.innerHTML = '';
    });
    


};

function get_pdf(coddoc, correlativo, idbtn){

    let btn = document.getElementById(idbtn);
    
    btn.innerHTML = '<i class="fal fa-download fa-spin"></i>';
    btn.disabled = true;

    axios.post('/pdf',{
        sucursal:GlobalEmpnit,
        coddoc:coddoc,
        correlativo:correlativo
     })
     .then((response) => {
        let base = response.data;
        base = base.replace('data:application/pdf;base64,','');
        var link = document.createElement('a');
        link.innerHTML = 'Download PDF file';
        link.download ='DOCUMENTO_' + coddoc.toString() + correlativo.toString() + '.pdf';
        link.href = 'data:application/octet-stream;base64,' + base;
        //document.body.appendChild(link);
        link.click();
        link.remove();
        //desbloquea el botón para que deje de dar vueltas
        btn.innerHTML = '<i class="fal fa-download"></i>';
        btn.disabled = false;
        
     }, (error) => {
        console.log(error);
        
        btn.innerHTML = '<i class="fal fa-download"></i>';
        btn.disabled = false;

        F.AvisoError('No se logró crear el pdf')
     });     

};

function cargarPedidoEdicion(codclie,nit,nombre,direccion,coddoc,correlativo){

    $("#modal_lista_documentos").modal('hide');

    F.Confirmacion('¿Está seguro que desea EDITAR este documento, no se podrá deshacer lo que haga?')
    .then((value)=>{
        if(value==true){
            F.solicitarClave()
                    .then((clave)=>{
                        if(clave==GlobalPassUsuario){
        
                            F.showToast('Cargando Documento....');
    
                            document.getElementById('txtPosCobroNit').value = nit;
                            document.getElementById('txtPosCobroNitclie').value = codclie;
                            document.getElementById('txtPosCobroNombre').value = nombre;
                            document.getElementById('txtPosCobroDireccion').value = direccion;
                        
                                                    
                            deleteTempVenta_pos(GlobalUsuario)
                            .then(()=>{

                                //descarga el pedido y lo inserta en el indexed
                                loadDetallePedido(coddoc,correlativo)
                                .then(()=>{
                                    
                                    F.showToast('Documento cargado...');
                                    get_tbl_pedido();


                                    //ACTUALIZO EL DOC_ESTATUS=A PARA QUE YA NO SE PUEDA FACTURAR Y NO LO ELIMINO
                                    anular_pedido(coddoc,correlativo)
                                    .then(()=>{    
                                        F.showToast('Documento anterior eliminado con éxito!!');
                                    })
                                    .catch(()=>{
                                        F.AvisoError('No se pudo eliminar el pedido anterior');
                                    })

    
                                })
                                .catch((error)=>{
                                    F.AvisoError('No se pudo cargar el pedido. Error: ' + error);
                                })
                            })
                            .catch(()=>{
                                F.AvisoError('No se pudo limpiar el pedido')
                            })
                        }
                    })
        }
    })

};

//SELECCIONA EL DETALLE DEL PEDIDO Y LO CARGA
function loadDetallePedido(coddoc,correlativo){
    
    return new Promise((resolve,reject)=>{
        axios.post('/ventas/loadpedido_edicion', {
            sucursal:GlobalEmpnit,
            coddoc: coddoc,
            correlativo: correlativo,
            usuario:GlobalUsuario
        })
        .then((response) => {
            const data = response.data;
           data.recordset.map((rows)=>{
                insertTempVentasPOS(rows);
           })
            resolve();
        }, (error) => {
            //F.AvisoError('Error en la solicitud');
            reject('Error de solicitud');
        });

    })
    
    
};



//---------------------------
//editar pedido
//---------------------------



//OPCIONES DEL DOCUMENTO
function anular_factura(coddoc,correlativo,status,idbtn){


    F.Confirmacion("¿Está seguro que desea ANULAR/DESANULAR este documento?")
    
    .then((value)=>{
        if(value==true){

            GF.get_anulacion_documento(coddoc,correlativo,status)
            .then(()=>{
                F.Aviso('Documento anulado exitosamente!!');
                socket.emit('ANULACION',`Se ha anulado el documento: ${coddoc}-${correlativo} en la sede ${GlobalEmpnit}`);
                tbl_lista_documentos();
            })
            .catch(()=>{
                F.AvisoError('No se pudo anular')
            })

        }
    })
   

};
