
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
                            ${view.vista_facturacion()}
                        </div>
                        <div class="tab-pane fade" id="siete" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_sellout()}
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
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-siete" data-toggle="tab" href="#siete" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>         
                    </ul>

                </div>

                ${view.modal_detalle_documento()}
               
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

                    <div class="card card-rounded shadow hand col-12"  id="btnMenuFacturacion">
                        <div class="card-body p-4">
                            
                            <h4>ASIGNACION DE FACTURAS</h4>
                            <h1 class="negrita text-danger" id="">Armado de Embarques</h1>
                            
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
                    
                     
                    <div class="card card-rounded bg-white shadow col-12 hand" id="btnMenuSellout">
                        <div class="card-body p-4">
                            
                            <h4>SELL OUT</h4>
                            <h1 class="negrita text-danger" id="">Reporte SellOut</h1>

                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-folder negrita text-secondary" style="font-size:250%"></i>
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
                                    <h4>LISTADO DE FACTURAS PENDIENTES</h4>
                                    <div class="form-group">
                                        <input type="text" class="form-control negrita text-info" id="txtFPBuscar"
                                        placeholder="Escriba para buscar..."
                                        oninput="F.FiltrarTabla('tblPedidos','txtFPBuscar')">
                                    </div>
                                    <br>
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
                                        <td>ST</td>
                                        <td></td>
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
        vista_pedidos_pendientes_anulados:()=>{
            return `
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4 table-responsive">
                        
                            
                            <div class="row">
                                <div class="col-6">
                                    <h4>LISTADO DE FACTURAS PENDIENTES ANULADAS</h4>
                                    <div class="form-group">
                                        <input type="text" class="form-control negrita text-info" id="txtFPBuscarAnuladas"
                                        placeholder="Escriba para buscar..."
                                        oninput="F.FiltrarTabla('tblPedidosAnulados','txtFPBuscarAnuladas')">
                                    </div>
                                    <br>
                                </div>
                                <div class="col-6">
                                    <label class="negrita text-danger" id="lbTotalPA"></label>
                                </div>
                            </div>
                            

                            <table class="table h-full table-bordered col-12" id="tblPedidosAnulados">
                                <thead class="bg-base text-white negrita">
                                    <tr>
                                        <td class="text-left">EMBARQUE</td>
                                        <td>VENDEDOR</td>
                                        <td>FECHA</td>
                                        <td>CLIENTE</td>
                                        <td>MUNICIPIO</td>
                                        <td>IMPORTE</td>
                                        <td>ST</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataPedidosAnulados"></tbody>

                            </table>
                        

                        </div>
                    </div>

                    <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                        <i class="fal fa-arrow-left"></i>
                    </button>
            `
        },
        modal_detalle_documento:()=>{
            return `
            <div id="modal_detalle_pedido" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-base d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Detalle del Documento
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-2">

                                        <h4 class="negrita text-base" id="lbDetalleTomarDatosNombre"></h4>
                                        <br>

                                        <div class="table-responsive col-12">
                                            <table class="table table-responsive table-bordered table-hover">
                                                <thead class="bg-verde text-white">
                                                    <tr>
                                                        <td>CODIGO</td>
                                                        <td>PRODUCTO</td>
                                                        <td>TIPOP</td>
                                                        <td>MEDIDA</td>
                                                        <td>CANTIDAD</td>
                                                        <td>PRECIO</td>
                                                        <td>IMPORTE</td>
                                                    </tr>
                                                </thead>
                                                <tbody id="tblDataDetallePedido"></tbody>
                                                <tfoot class="bg-secondary negrita text-white">
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td id="lbFtotalCantidad"></td>
                                                        <td></td>
                                                        <td id="lbFtotalImporte"></td>
                                                    </tr>
                                                </tfoot>
                                            </table>

                                            <div class="form-group">
                                                <label class="negrita text-base">Observaciones</label>
                                                <textarea class="form-control negrita" id="txtDetallePedidoObs" rows="4"></textarea>
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
        },
        vista_facturacion:()=>{
            return `
             <div class="card card-rounded shadow col-12 oculto-impresion">
                <div class="card-body p-4">
                        
                    <div class="form-group">
                        <label class="negrita text-base">Pedidos asignados al Embarque</label>
                        <div class="input-group">
                            <select class="form-control negrita text-secondary" id="cmbFEmbarques">
                        
                            </select>
                            <input type="date" class="form-control negrita text-secondary" id="txtFFecha">
                            
                            <select class="form-control border-danger negrita text-danger" id="cmbFTipo">
                                <option value='PENDIENTES'>FACTURAS PENDIENTES</option>
                                <option value='FACTURAS'>FACTURAS EMBARQUE</option>
                                <option value='PRODUCTOS'>PRODUCTOS EMBARQUE</option>
                                <option value='BONIFICACIONES'>PRODUCTOS BONIFICADOS EMBARQUE</option>
                                <option value='VENDEDORES'>RESUMEN VENDEDOR</option>
                                <option value='ANULADAS'>FACTURAS ANULADAS</option>
                            </select>

                        </div>
                    </div>

                </div>
             </div>
             <div class="col-12 p-0">
                    <div class="tab-content" id="myTabHomeContent2">
                        <div class="tab-pane fade show active" id="Funo" role="tabpanel" aria-labelledby="receta-tab">
                          ${view.vista_pedidos_pendientes() + view.vista_pedidos_modal_embarques() }    
                            
                        </div>
                        <div class="tab-pane fade" id="Fdos" role="tabpanel" aria-labelledby="home-tab">
                            ${view.facturacion_embarque_facturas()}
                     
                        </div>
                        <div class="tab-pane fade" id="Ftres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.facturacion_embarque_productos()}
                        </div>
                        <div class="tab-pane fade" id="Fcuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.facturacion_vendedores()}
                        </div>
                        <div class="tab-pane fade" id="Fcinco" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_pedidos_pendientes_anulados()}
                        </div>
                        <div class="tab-pane fade" id="Fseis" role="tabpanel" aria-labelledby="home-tab">
                            ${view.facturacion_embarque_productos_bonif()}
                        </div>    
                    </div>

                    <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active negrita text-success" id="tab-Funo" data-toggle="tab" href="#Funo" role="tab" aria-controls="profile" aria-selected="false">
                                <i class="fal fa-list"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-Fdos" data-toggle="tab" href="#Fdos" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>  
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-Ftres" data-toggle="tab" href="#Ftres" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>  
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-Fcuatro" data-toggle="tab" href="#Fcuatro" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-Fcinco" data-toggle="tab" href="#Fcinco" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>  
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-Fseis" data-toggle="tab" href="#Fseis" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>           
                    </ul>

                </div>

                <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                    <i class="fal fa-arrow-left"></i>
                </button>
            
            `
        },
        facturacion_crear_facturas:()=>{
            return `
            <br>
            
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">


                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Facturar Pedidos Pendientes</h4>
                            
                            <div class="form-group">
                                <label class="negrita">Serie y Fecha de la Factura</label>
                                <div class="input-group">
                                    <select class="negrita text-info form-control" id="cmbFacCoddoc">
                                    </select>
                                    <input class="form-control negrita text-info" type="date" id="txtFacFecha">
                                </div>    
                            </div>
                            <br>
                        </div>
                        <div class="col-6">
                            <label class="negrita text-info" id="lbFTotalPedidos">Pedidos:</label>
                            <br>
                            <label class="negrita text-danger" id="lbFTotalImporte">Importe:</label>
                        </div>
                    </div>
                    

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblFPedidos">
                                <thead class="bg-base text-white negrita">
                                    <tr>
                                        <td>EMBARQUE</td>
                                        <td>VENDEDOR</td>
                                        <td>FECHA</td>
                                        <td>CLIENTE</td>
                                        <td>MUNICIPIO</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataFPedidos"></tbody>

                            </table>

                    </div>
                    
                </div>
            </div>



           

            `
        },
        facturacion_embarque_facturas:()=>{
            return `
            <br>
            
            <div class="card card-rounded shadow col-12" id="rpt_facturas_embarque">
                <div class="card-body p-4">

                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Facturas del Embarque</h4>
                            <h5 class="negrita" id="lbFacCodembarque"></h5>
                            <br>
                        </div>
                        <div class="col-6">
                            <label class="negrita text-info" id="lbFacTotalPedidos">Pedidos:</label>
                            <br>
                            <label class="negrita text-danger" id="lbFacTotalImporte">Importe:</label>
                        </div>
                    </div>
                    

                    <div class="table-responsive">
                        <div class="form-group">
                            <input type="text" class="form-control col-12 border-info text-info" 
                                id="txt_buscar_facturas_embarque" 
                                oninput="F.FiltrarTabla('tblFFacturas','txt_buscar_facturas_embarque')"
                                placeholder="Escriba para buscar..."
                            >
                        </div>

                         <table class="table h-full table-bordered col-12" id="tblFFacturas">
                                <thead class="bg-success text-white negrita">
                                    <tr>
                                        <td></td>
                                        <td>VENDEDOR</td>
                                        <td>FECHA</td>
                                        <td>CLIENTE</td>
                                        <td>MUNICIPIO</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataFFacturas"></tbody>

                            </table>

                    </div>
                    
                </div>
            </div>


            <button class="btn btn-info btn-xl btn-circle hand shadow btn-bottom-r" onclick="F.imprimirSelec('rpt_facturas_embarque')">
                <i class="fal fa-print"></i>
            </button>

           

            `
        },
        facturacion_embarque_productos:()=>{
            return `
            <br>

            <div class="card card-rounded shadow col-12" id="rpt_productos_embarque">
                <div class="card-body p-4">
            
                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Productos del Embarque</h4>
                            <h5 id="lbProdCodembarque"></h5>
                            <br>
                        </div>
                        <div class="col-6">
                            <label class="negrita text-info" id="lbProdTotalPedidos">Productos:</label>
                            <br>
                            <label class="negrita text-danger" id="lbProdTotalImporte">Importe:</label>
                        </div>
                    </div>

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblFProductos">
                                <thead class="bg-secondary text-white negrita">
                                    <tr>
                                        <td>CODIGO</td>
                                        <td>PRODUCTO</td>
                                        <td>UXC</td>
                                        <td>CAJAS</td>
                                        <td>UNIDADES</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataFProductos"></tbody>

                            </table>

                    </div>
            

                </div>
            </div>

            <button class="btn btn-info btn-xl btn-circle hand shadow btn-bottom-r" onclick="F.imprimirSelec('rpt_productos_embarque')">
                <i class="fal fa-print"></i>
            </button>
            `
        },
        facturacion_embarque_productos_bonif:()=>{
            return `
            <br>

            <div class="card card-rounded shadow col-12" id="rpt_productos_embarqueB">
                <div class="card-body p-4">
            
                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Productos Bonificados del Embarque</h4>
                            <h5 id="lbProdCodembarqueB"></h5>
                            <br>
                        </div>
                        <div class="col-6">
                            <label class="negrita text-info" id="lbProdTotalPedidosB">Productos:</label>
                            <br>
                            <label class="negrita text-danger" id="lbProdTotalImporteB">Importe:</label>
                        </div>
                    </div>

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblFProductosB">
                                <thead class="bg-secondary text-white negrita">
                                    <tr>
                                        <td>CODIGO</td>
                                        <td>PRODUCTO</td>
                                        <td>UXC</td>
                                        <td>CAJAS</td>
                                        <td>UNIDADES</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataFProductosB"></tbody>

                            </table>

                    </div>
            

                </div>
            </div>

            <button class="btn btn-info btn-xl btn-circle hand shadow btn-bottom-r" onclick="F.imprimirSelec('rpt_productos_embarqueB')">
                <i class="fal fa-print"></i>
            </button>
            `
        },
        facturacion_vendedores:()=>{
            return `
            <br>

            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
            
                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Resumen por Vendedor</h4>
                            <br>
                        </div>
                        <div class="col-6">
                        
                            <label class="negrita text-danger" id="lbFVImporte">Importe:</label>
                        </div>
                    </div>

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblVendedores">
                                <thead class="bg-secondary text-white negrita">
                                    <tr>
                                        <td>VENDEDOR</td>
                                        <td>PEDIDOS</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataVendedores"></tbody>

                            </table>

                    </div>
            

                </div>
            </div>

            <button class="btn btn-info btn-xl btn-circle hand shadow btn-bottom-r" onclick="F.imprimirSelec('rpt_productos_embarque')">
                <i class="fal fa-print"></i>
            </button>

            `
        },
        vista_sellout:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                   
                    <h3 class="negrita text-center text-base">SELL OUT</h3>

                    <br>
                    <div class="row">
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <div class="form-group">
                                <label class="negrita">Fecha Inicial</label>
                                <input type="date" class="negrita form-control" id="txtSFechaInicial">
                            </div>
                        </div>
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <div class="form-group">
                                <label class="negrita">Fecha Inicial</label>
                                <input type="date" class="negrita form-control" id="txtSFechaFinal">
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            <br>
                            <button class="btn btn-success btn-md hand shadow" id="btnExportarSellOut">
                                <i class="fal fa-share"></i> Exportar Excel
                            </button>
                        </div>
                    </div>

                    

                </div>
            </div>
            <br>
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">

                        <div class="table-responsive">
                            <table class="table h-full table-bordered col-12" id="tblSellout">
                                <thead class="bg-success text-white negrita">
                                    <tr>
                                        <td>RELOP</td>
                                        <td>TRANSACCION</td>
                                        <td>FECHA</td>
                                        <td>CODIGO CLIENTE</td>
                                        <td>CLIENTE</td>
                                        <td>TIPO CLIENTE</td>
                                        <td>CODIGO VENDEDOR</td>
                                        <td>VENDEDOR</td>
                                        <td>CATEGORIA</td>
                                        <td>MARCA</td>
                                        <td>CODIGO RUTA</td>
                                        <td>GEO1-PAIS</td>
                                        <td>GEO2-DEPARTAMENTO</td>
                                        <td>GEO3-MUNICIPIO</td>
                                        <td>CEO4-ALDEA-CASERIO</td>
                                        <td>PRODUCTO</td>
                                        <td>CODIGO DUN</td>
                                        <td>CODIGO EAN</td>
                                        <td>DESCRIPCION</td>
                                        <td>VENTA EN CANTIDAD</td>
                                        <td>FACTOR</td>
                                        <td>UNIDADES POR CAJA</td>
                                        <td>MEDIDA</td>
                                        <td>VENTA EN QUETZALES</td>
                                        <td>FACTURA SAT</td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataSellout"></tbody>
                            </table>
                        </div>
                        
                </div>
            </div>
           

            
            <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>

            
            `
        },
    }

    root.innerHTML = view.body();

};

function addListeners(){

    
    document.title = `Digitador - ${GlobalNomEmpresa}`;

    F.slideAnimationTabs();

  

    tbl_relleno_inventario('tblDataRelleno');


    listeners_pedidos_pendientes();

    listeners_embarques();



    //SELLOUT

    document.getElementById('txtSFechaInicial').value = F.getFecha();
    document.getElementById('txtSFechaFinal').value = F.getFecha();
    
    document.getElementById('txtSFechaInicial').addEventListener('change',()=>{
        tbl_rpt_sellout();
    })

    document.getElementById('txtSFechaFinal').addEventListener('change',()=>{
        tbl_rpt_sellout();
    })

    document.getElementById('btnMenuSellout').addEventListener('click',()=>{

        document.getElementById('tab-siete').click();
        tbl_rpt_sellout();

    });


    document.getElementById('btnExportarSellOut').addEventListener('click',()=>{

        F.showToast('Cargando datos...');

            let fi = F.devuelveFecha('txtSFechaInicial');
            let ff = F.devuelveFecha('txtSFechaFinal');


            let sucursal = GlobalEmpnit; //document.getElementById('cmbSucursal').value;


            document.getElementById('btnExportarSellOut').disabled = false;
            document.getElementById('btnExportarSellOut').innerHTML = `<i class="fal fa-share fa-spin"></i>`;

        
            RPT.data_sellout_export(sucursal,fi,ff)
            .then((data)=>{

                let datos = data.recordset;
                F.export_json_to_xlsx(datos,'SellOut');

                document.getElementById('btnExportarSellOut').disabled = false;
                document.getElementById('btnExportarSellOut').innerHTML = `<i class="fal fa-share"></i> Exportar Excel`;

            })
            .catch(()=>{
                F.AvisoError('No se pudo cargar');
                document.getElementById('btnExportarSellOut').disabled = false;
                document.getElementById('btnExportarSellOut').innerHTML = `<i class="fal fa-share"></i> Exportar Excel`;

            })

      
        

    });




};

function initView(){

    getView();
    addListeners();

};



//------------------------
// PEDIDOS PENDIENTES
//------------------------

function listeners_pedidos_pendientes(){


    tbl_modal_embarques();

    
    selected_ped_coddoc = '';
    selected_ped_correlativo = '';
    selected_ped_codembarque = '';


    document.getElementById('btnMenuFacturacion').addEventListener('click',()=>{

        document.getElementById('tab-seis').click();
        
        get_combo_embarques();
        
        document.getElementById('tab-Funo').click();
        
        tbl_pedidos_pendientes('tblDataPedidos');

    
    });

    document.getElementById('txtFFecha').value = F.getFecha();

    document.getElementById('txtFFecha').addEventListener('change',()=>{
        get_combo_embarques();
        

    });

    document.getElementById('cmbFEmbarques').addEventListener('change',()=>{

        let tipo = document.getElementById('cmbFTipo').value;

        let codembarque = document.getElementById('cmbFEmbarques').value;

        switch (tipo) {
            
            case 'FACTURAS':
                document.getElementById('tab-Fdos').click();

                tbl_facturas_embarque(codembarque);
                document.getElementById('lbFacCodembarque').innerText = codembarque;

                break;
        
            case 'PRODUCTOS':
                document.getElementById('tab-Ftres').click();

                tbl_productos_embarque(codembarque);
                document.getElementById('lbProdCodembarque').innerText = codembarque;


                break;
            case 'BONIFICACIONES':
                document.getElementById('tab-Fseis').click();

                tbl_productos_embarque_bonif(codembarque);
                document.getElementById('lbProdCodembarqueB').innerText = codembarque;


                break;
                
            case 'VENDEDORES':
                document.getElementById('tab-Fcuatro').click();

                tbl_resumen_embarque(codembarque);

                break;
           
        
        }
        

    });



    document.getElementById('cmbFTipo').addEventListener('change',()=>{
        
        let tipo = document.getElementById('cmbFTipo').value;

        let codembarque = document.getElementById('cmbFEmbarques').value;

        switch (tipo) {
          
            case 'PENDIENTES':
                document.getElementById('tab-Funo').click();
                tbl_pedidos_pendientes('tblDataPedidos');

              
                break;

            case 'FACTURAS':
                document.getElementById('tab-Fdos').click();

                tbl_facturas_embarque(codembarque);
                document.getElementById('lbFacCodembarque').innerText = codembarque;

                break;
        
            case 'PRODUCTOS':
                document.getElementById('tab-Ftres').click();

                tbl_productos_embarque(codembarque);
                document.getElementById('lbProdCodembarque').innerText = codembarque;


                break;
            case 'BONIFICACIONES':
                document.getElementById('tab-Fseis').click();

                tbl_productos_embarque_bonif(codembarque);
                document.getElementById('lbProdCodembarqueB').innerText = codembarque;


                break;
            case 'VENDEDORES':
                    document.getElementById('tab-Fcuatro').click();
    
                    tbl_resumen_embarque(codembarque);
                    
                    break;
        
            case 'ANULADAS':
                document.getElementById('tab-Fcinco').click();
                tbl_pedidos_pendientes_anulados('tblDataPedidosAnulados');

                break;
        }

    });

    


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
            let idBtnEmbarque = `idBtnEmbarque${r.CODDOC}-${r.CORRELATIVO}`;
            contador +=1;
            let strClassSt = 'success'; if(r.STATUS.toString()=='A'){strClassSt='danger'};
            let idbtnAnular = `btnAnular${r.CODDOC}-${r.CORRELATIVO}`
            

            let strClassBtnFixEmb = ''; 
            if(r.TOTALPRECIOPROD.toFixed(2).toString()==r.IMPORTE.toFixed(2).toString()){
                strClassBtnFixEmb= ` `;
            }else{
              
                strClassBtnFixEmb=`
                        <button class="btn btn-danger btn-sm hand shadow" id="${idBtnEmbarque}"
                            onclick="get_fix_pedido('${r.CODDOC}','${r.CORRELATIVO}','${idBtnEmbarque}')">
                                <i class="fal fa-wrench"></i>&nbsp Reparar
                        </button>
                `;
            }


            str += `
                <tr>
                    <td class="text-left">

                        <button class="btn btn-base btn-md btn-circle hand shadow" id="${idBtnEmbarque}"
                        onclick="get_embarques_pedido('${r.CODDOC}','${r.CORRELATIVO}','${idRowPedido}')">
                                <i class="fal fa-plus"></i>
                        </button>
                        
                      
                    </td>
                    <td>${r.NOMEMPLEADO}
                        <button class="btn btn-outline-info btn-circle btn-sm hand shadow"
                        onclick="F.gotoGoogleMaps('${r.LAT}','${r.LONG}')">
                            <i class="fal fa-map"></i>
                        </button>
                        <br>
                        <small class="negrita">${r.CODDOC}-${r.CORRELATIVO}</small>
                        <br>
                        <b class="text-danger" id="${idRowPedido}">${r.CODEMBARQUE}</b>
                    </td>
                    <td>${F.convertDateNormal(r.FECHA)}
                        <br>
                        <small>Hora:${r.HORA}</small>
                        <br>
                        ${strClassBtnFixEmb}
                    </td>
                    <td>${r.NOMCLIE}
                        <br>
                        <small>${r.DIRCLIE}</small>
                    </td>
                    <td>
                        ${r.DESMUN}
                    </td>
                    <td class="negrita text-danger text-right">
                        ${F.setMoneda(r.IMPORTE,'Q')}
                        <br>
                        <small class="negrita text-base">${F.setMoneda(r.TOTALPRECIOPROD,'Q')}</small>
                    </td>
                    <td>
                        <button class="btn btn-${strClassSt} btn-md btn-circle hand shadow" id="${idbtnAnular}"
                            onclick="anular_pedido('${r.CODDOC}','${r.CORRELATIVO}','${r.STATUS}','${idbtnAnular}')">
                            ${r.STATUS}        
                        </button>
                        
                    </td>                    
                    <td>
                        <button class="btn btn-warning btn-md btn-circle hand shadow"
                            onclick="get_detalle_pedido('${r.CODDOC}','${r.CORRELATIVO}')">
                                <i class="fal fa-list"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-info btn-md btn-circle hand shadow"
                            onclick="fcn_editar_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.NOMCLIE}','${r.DIRCLIE}')">
                                <i class="fal fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalP').innerText = `Pendientes: ${contador}`
        //document.getElementById('lbTotalMP').innerText =`${contador} pedidos`


        //F.initit_datatable('tblPedidos',true);

    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....'
        document.getElementById('lbTotalP').innerText = '---'
        //document.getElementById('lbTotalMP').innerText = '---'
    })




};

function tbl_pedidos_pendientes_anulados(idContainer){

    let container = document.getElementById(idContainer);

    container.innerHTML = GlobalLoader;
    let contador = 0;

    GF.get_data_pedidos_pendientes_vendedores_anulados()
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
            let idRowPedido = `idRowPedido${r.CODDOC}-${r.CORRELATIVO}`;
            let idBtnEmbarque = `idBtnEmbarque${r.CODDOC}-${r.CORRELATIVO}`;
            contador +=1;
            let strClassSt = 'success'; if(r.STATUS.toString()=='A'){strClassSt='danger'};
            let idbtnAnular = `btnAnular${r.CODDOC}-${r.CORRELATIVO}`
            

            let strClassBtnFixEmb = ''; 
            if(r.TOTALPRECIOPROD.toFixed(2).toString()==r.IMPORTE.toFixed(2).toString()){
                strClassBtnFixEmb= ` `;
            }else{
              
                strClassBtnFixEmb=`
                        <button class="btn btn-danger btn-sm hand shadow" id="${idBtnEmbarque}"
                            onclick="get_fix_pedido('${r.CODDOC}','${r.CORRELATIVO}','${idBtnEmbarque}')">
                                <i class="fal fa-wrench"></i>&nbsp Reparar
                        </button>
                `;
            }


            str += `
                <tr>
                    <td class="text-left">

                        <button class="btn btn-base btn-md btn-circle hand shadow" id="${idBtnEmbarque}"
                        onclick="get_embarques_pedido('${r.CODDOC}','${r.CORRELATIVO}','${idRowPedido}')">
                                <i class="fal fa-plus"></i>
                        </button>
                        
                      
                    </td>
                    <td>${r.NOMEMPLEADO}
                        <button class="btn btn-outline-info btn-circle btn-sm hand shadow"
                        onclick="F.gotoGoogleMaps('${r.LAT}','${r.LONG}')">
                            <i class="fal fa-map"></i>
                        </button>
                        <br>
                        <small class="negrita">${r.CODDOC}-${r.CORRELATIVO}</small>
                        <br>
                        <b class="text-danger" id="${idRowPedido}">${r.CODEMBARQUE}</b>
                    </td>
                    <td>${F.convertDateNormal(r.FECHA)}
                        <br>
                        <small>Hora:${r.HORA}</small>
                        <br>
                        ${strClassBtnFixEmb}
                    </td>
                    <td>${r.NOMCLIE}
                        <br>
                        <small>${r.DIRCLIE}</small>
                    </td>
                    <td>
                        ${r.DESMUN}
                    </td>
                    <td class="negrita text-danger text-right">
                        ${F.setMoneda(r.IMPORTE,'Q')}
                        <br>
                        <small class="negrita text-base">${F.setMoneda(r.TOTALPRECIOPROD,'Q')}</small>
                    </td>
                    <td>
                        <button class="btn btn-${strClassSt} btn-md btn-circle hand shadow" id="${idbtnAnular}"
                            onclick="anular_pedido('${r.CODDOC}','${r.CORRELATIVO}','${r.STATUS}','${idbtnAnular}')">
                            ${r.STATUS}        
                        </button>
                        
                    </td>                    
                    <td>
                        <button class="btn btn-warning btn-md btn-circle hand shadow"
                            onclick="get_detalle_pedido('${r.CODDOC}','${r.CORRELATIVO}')">
                                <i class="fal fa-list"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-info btn-md btn-circle hand shadow"
                            onclick="fcn_editar_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.NOMCLIE}','${r.DIRCLIE}')">
                                <i class="fal fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalP').innerText = `Pendientes: ${contador}`
        //document.getElementById('lbTotalMP').innerText =`${contador} pedidos`


        //F.initit_datatable('tblPedidos',true);

    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....'
        document.getElementById('lbTotalP').innerText = '---'
        //document.getElementById('lbTotalMP').innerText = '---'
    })




};


function get_fix_pedido(coddoc,correlativo,idbtn){

    let btn = document.getElementById(idbtn);
    
    btn.disabled = true;
    btn.innerHTML = `<i class="fal fa-spin fa-wrench"></i>`

    GF.update_fix_documento(coddoc,correlativo)
    .then((data)=>{
        F.Aviso('Documento corregido exitosamente!!');
        btn.disabled = false;
        btn.innerHTML = `<i class="fal fa-wrench"></i>&nbsp Reparar`
        tbl_pedidos_pendientes('tblDataPedidos');
        
    })
    .catch(()=>{
        F.AvisoError('No se pudo corregir el documento');
         btn.disabled = false;
        btn.innerHTML = `<i class="fal fa-wrench"></i>&nbsp Reparar`
    })

};


function anular_pedido(coddoc,correlativo,statusActual,idbtn){


    let btn = document.getElementById(idbtn);

    let newst = '';
    let msn = '';

    if(statusActual=='A'){
        newst = 'O';
        msn = 'RE-ACTIVAR';
    }else{
        newst = 'A';
        msn = 'ANULAR';
    }


    F.Confirmacion(`¿Está seguro que desea ${msn} este pedido?`)
    .then((value)=>{
        if(value==true){

            btn.disabled = true;
            btn.innerHTML = `<i class="fal fa-spin"></i>${statusActual}`;

            GF.get_data_pedidos_anular(GlobalEmpnit,coddoc,correlativo,newst)
            .then(()=>{
                
                tbl_pedidos_pendientes('tblDataPedidos');
                
            })
            .catch(()=>{
                F.AvisoError('No se pudo actualizar');
                btn.disabled = false;
                btn.innerHTML = statusActual;
            })


        }
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

function get_detalle_pedido(coddoc,correlativo){


    $("#modal_detalle_pedido").modal('show');


    let container = document.getElementById('tblDataDetallePedido');
    container.innerHTML = GlobalLoader;


    GF.get_data_detalle_documento(GlobalEmpnit,coddoc,correlativo)
    .then((data)=>{
        let str = "";
        
        
        //let json = JSON.parse(data.recordset[0].JSONDOCPRODUCTOS);
        let obs = '';//data.recordset[0].OBS;


        let contador = 0; let varImporte = 0;

        
        data.recordset.map((r)=>{
            contador += 1;
            varImporte += Number(r.TOTALPRECIO);
            str += `
            <tr>
                <td>${r.CODPROD}</td>
                <td>${r.DESPROD}</td>
                <td>${r.TIPOPRECIO}</td>
                <td>${r.CODMEDIDA}</td>
                <td>${r.CANTIDAD}</td>
                <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbFtotalCantidad').innerHTML = contador;
        document.getElementById('lbFtotalImporte').innerHTML = F.setMoneda(varImporte,'Q');
       
        document.getElementById('txtDetallePedidoObs').value = obs;
       


    })
    .catch(()=>{
        container.innerHTML = 'No hay datos...';
       
        document.getElementById('lbFtotalCantidad').innerHTML = '';
        document.getElementById('lbFtotalImporte').innerHTML = '';
       
        document.getElementById('txtDetallePedidoObs').value = '';

    })




};


function get_combo_embarques(){

    let container = document.getElementById('cmbFEmbarques');
    let fecha = F.devuelveFecha('txtFFecha');

    let str = ``;

    GF.get_data_embarques_listado_activos_fecha(GlobalEmpnit, fecha)
    .then((data)=>{

        data.recordset.map((r)=>{
            str += `
                <option value='${r.CODEMBARQUE}'>${r.CODEMBARQUE}<small>(${r.NOMEMPLEADO})</small></option>
            `
        })
        container.innerHTML = str;
    })
    .catch((error)=>{
        
        console.log(error);

        container.innerHTML = `<option value='SN'>NO HAY EMBARQUES CON ESA FECHA</option>`;

    })



};

function tbl_pedidos_embarque_facturar(codembarque){

        let container = document.getElementById('tblDataFPedidos');

        container.innerHTML = GlobalLoader;
        let contador = 0;
        let varTotal = 0;

        GF.get_data_pedidos_pendientes_vendedores_embarque(codembarque)
        .then((data)=>{

            let str = '';

            data.recordset.map((r)=>{
                let idRowPedido = `idRowPedidoF${r.CODDOC}-${r.CORRELATIVO}`;
                let idbtnFacturar = `btnFacturar${r.CODDOC}-${r.CORRELATIVO}`;
                contador +=1;
                varTotal += Number(r.IMPORTE);
                str += `
                    <tr>
                        <td class="text-left">
                          
                            <b class="text-danger" id="${idRowPedido}">${r.CODEMBARQUE}</b>
                        </td>
                        <td>${r.NOMEMPLEADO}
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
                            <button class="btn btn-base btn-md hand shadow" id="${idbtnFacturar}"
                            onclick="facturar_pedido('${r.CODDOC}','${r.CORRELATIVO}','${idbtnFacturar}')">
                                    <i class="fal fa-dollar-sign"></i>&nbsp FACTURAR
                            </button>
                        </td>
                    </tr>
                `
            })
            container.innerHTML = str;
            document.getElementById('lbFTotalPedidos').innerText = `Pedidos: ${contador}`;
            document.getElementById('lbFTotalImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

        })
        .catch((error)=>{
            container.innerHTML = 'No se cargaron datos....';
            document.getElementById('lbFTotalPedidos').innerText = '';
            document.getElementById('lbFTotalImporte').innerText = '';
        })



};

function facturar_pedido(coddoc,correlativo,idbtn){


    let btn = document.getElementById(idbtn);

    let coddoc_fac = document.getElementById('cmbFacCoddoc').value;
    if(coddoc_fac=='SN'){F.AvisoError('No se cargaron las series de facturacion');return;}
    let correlativo_fac = '0';    

    let fecha_fac = new Date(document.getElementById('txtFacFecha').value);

    let fFAC = new Date(fecha_fac);

    let mes_fac = fFAC.getUTCMonth()+1;
    let anio_fac = fFAC.getUTCFullYear();


    F.Confirmacion('¿Está seguro que desea FACTURAR este pedido?')
    .then((value)=>{
        if(value==true){

            btn.disabled = true;
            btn.innerHTML = `Cargando Correlativo ...`;

            GF.get_data_coddoc_correlativo(coddoc_fac)
            .then((correlativoFac)=>{
              
                    correlativo_fac = correlativoFac;

                    btn.disabled = true;
                    btn.innerHTML = `Facturando ...`;
        


                    GF.get_data_pedidos_facturar_pedido(GlobalEmpnit,coddoc,correlativo,coddoc_fac,correlativo_fac,fecha_fac,mes_fac,anio_fac)
                    .then(()=>{
                        
                        F.Aviso('Pedido Facturado Exitosamente!!');

                        let codembarque = document.getElementById('cmbFEmbarques').value;
                        tbl_pedidos_embarque_facturar(codembarque);
                    
                    })
                    .catch(()=>{
                    
                        F.AvisoError('No se pudo generar la Factura');
                        
                        btn.disabled = false;
                        btn.innerHTML = `<i class="fal fa-dollar-sign"></i>&nbsp FACTURAR`;
                        
                    })
            })
            .catch(()=>{

                F.AvisoError('No se pudo obtener el correlativo de la factura a crear, intentelo de nuevo');
                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-dollar-sign"></i>&nbsp FACTURAR`;

            })


           






        }
    })


};


function tbl_resumen_embarque(codembarque){

    let container = document.getElementById('tblDataVendedores');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;

    GF.get_data_embarque_resumen_vendedores(GlobalEmpnit,codembarque)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{

            
            varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td>${r.EMPLEADO}</td>
                    <td>${r.CONTEO}</td>
                    <td class="negrita text-danger text-right">${F.setMoneda(r.IMPORTE,'Q')}</td>
                    <td>
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbFVImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbFVImporte').innerText = '';
    })


};

function tbl_facturas_embarque(codembarque){

    let container = document.getElementById('tblDataFFacturas');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;

    GF.get_data_embarque_facturas(GlobalEmpnit,codembarque)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{

            let idBtnEmbarque = `btnDeleteEmbarque${r.CODDOC}-${r.CORRELATIVO}`;
            
            contador +=1;
            varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td>
                        <button class="btn btn-danger btn-md btn-circle hand shadow" id="${idBtnEmbarque}"
                        onclick="quitar_embarque_factura('${r.CODDOC}','${r.CORRELATIVO}','${idBtnEmbarque}')">
                                <i class="fal fa-unlink"></i>
                        </button>
                    </td>
                    <td>${r.NOMEMPLEADO}
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
                        <button class="btn btn-warning btn-md btn-circle hand shadow"
                            onclick="get_detalle_pedido('${r.CODDOC}','${r.CORRELATIVO}')">
                                <i class="fal fa-list"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-info btn-md btn-circle hand shadow"
                            onclick="fcn_editar_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.NOMCLIE}','${r.DIRCLIE}')">
                                <i class="fal fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbFacTotalPedidos').innerText = `Pedidos: ${contador}`;
        document.getElementById('lbFacTotalImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbFacTotalPedidos').innerText = '';
        document.getElementById('lbFacTotalImporte').innerText = '';
    })


};




function quitar_embarque_factura(coddoc,correlativo,idbtn){

    let btn = document.getElementById(idbtn);


    F.Confirmacion("¿Está seguro que desea Quitar este Embarque?")
    .then((value)=>{
        if(value==true){

                btn.disabled = true;
                btn.innerHTML = `<i class="fal fa-unlink fa-spin"></i>`;

                GF.get_data_pedidos_update_embarque(GlobalEmpnit,coddoc,correlativo,'')
                .then((data)=>{

                    btn.disabled = false;
                    btn.innerHTML = `<i class="fal fa-unlink"></i>`;

                    let codembarque = document.getElementById('cmbFEmbarques').value;
                    tbl_facturas_embarque(codembarque);

                    tbl_pedidos_pendientes('tblDataPedidos');


                })
                .catch(()=>{

                    F.AvisoError('No se pudo actualizar el Embarque')
                    btn.disabled = false;
                    btn.innerHTML = `<i class="fal fa-unlink"></i>`;
                })


        }
    })


    



};



function tbl_productos_embarque(codembarque){

    let container = document.getElementById('tblDataFProductos');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;

    GF.get_data_embarque_productos(GlobalEmpnit,codembarque)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
         
            contador +=1;
            varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td>${r.CODPROD}
                    <br>
                        <small>${r.TOTALUNIDADES}</small>
                    </td>
                    <td>${r.DESPROD}
                        <br>
                        <small>${r.DESMARCA}</small>
                    </td>
                    <td>${r.UXC}</td>
                    <td>${r.CAJAS}</td>
                    <td>${r.UNIDADES}</td>
                    <td>${F.setMoneda(r.IMPORTE,'Q')}</td>
                    <td></td>
                </tr>
                `
        })
        container.innerHTML = str;
        document.getElementById('lbProdTotalPedidos').innerText = `Items: ${contador}`;
        document.getElementById('lbProdTotalImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbProdTotalPedidos').innerText = '';
        document.getElementById('lbProdTotalImporte').innerText = '';
    })


};
function tbl_productos_embarque_bonif(codembarque){

    let container = document.getElementById('tblDataFProductosB');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;

    GF.get_data_embarque_productos_bonif(GlobalEmpnit,codembarque)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
         
            contador +=1;
            varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td>${r.CODPROD}
                    <br>
                        <small>${r.TOTALUNIDADES}</small>
                    </td>
                    <td>${r.DESPROD}
                        <br>
                        <small>${r.DESMARCA}</small>
                    </td>
                    <td>${r.UXC}</td>
                    <td>${r.CAJAS}</td>
                    <td>${r.UNIDADES}</td>
                    <td>${F.setMoneda(r.IMPORTE,'Q')}</td>
                    <td></td>
                </tr>
                `
        })
        container.innerHTML = str;
        document.getElementById('lbProdTotalPedidosB').innerText = `Items: ${contador}`;
        document.getElementById('lbProdTotalImporteB').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbProdTotalPedidosB').innerText = '';
        document.getElementById('lbProdTotalImporteB').innerText = '';
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


        if(codembarque==''){F.AvisoError('Debe indicar un código de Embarque');return;}


        let statusEmbarque = document.getElementById('cmbStatus').value;

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
                        .catch((error)=>{
                            console.log('error al crear embarque')
                            console.log(error);

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
        

        F.initit_datatable('tblEmbarques',true);


        
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



//------------
// SELL OUT
//------------


function tbl_rpt_sellout(){

    let fi = F.devuelveFecha('txtSFechaInicial');
    let ff = F.devuelveFecha('txtSFechaFinal');


    let container = document.getElementById('tblDataSellout');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

    let sucursal = GlobalEmpnit; //document.getElementById('cmbSucursal').value;

   
    RPT.data_sellout(sucursal,fi,ff)
    .then((data)=>{

   
        let str = '';

        data.recordset.map((r)=>{
        
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            str += `
                                    <tr>
                                        <td>${r.RELOP}</td>
                                        <td>${r.TRANSACCION}</td>
                                        <td>${F.convertDateNormal(r.FECHA)}</td>
                                        <td>${r.CODIGO_CLIENTE}</td>
                                        <td>${r.TIPONEGOCIO} ${F.limpiarTextoExport(r.NEGOCIO)} - ${F.limpiarTextoExport(r.CLIENTE)}</td>
                                        <td>DETALLE</td>
                                        <td>${r.CODIGO_VENDEDOR}</td>
                                        <td>${r.VENDEDOR}</td>
                                        <td>${r.CATEGORIA}</td>
                                        <td>${r.MARCA}</td>
                                        <td>${r.CODIGO_RUTA}</td>
                                        <td>GUATEMALA</td>
                                        <td>${r.GEO2_DEPARTAMENTO}</td>
                                        <td>${r.GEO3_MUNICIPIO}</td>
                                        <td>${r.GEO4_ALDEA_CASERIO}</td>
                                        <td>${F.limpiarTextoExport(r.PRODUCTO)}</td>
                                        <td>${r.CODIGO_DUN}</td>
                                        <td>${r.CODIGO_BARRA_EAN}</td>
                                        <td>${F.limpiarTextoExport(r.DESCRIPCION_PRODUCTO)}</td>
                                        <td>${r.VENTA_EN_CANTIDAD}</td>
                                        <td>${r.FACTOR}</td>
                                        <td>${r.UNIDADES_POR_CAJA}</td>
                                        <td>${r.MEDIDA}</td>
                                        <td>${F.setMoneda(r.VENTA_EN_QUETZALES,'Q')}</td>
                                        <td>${r.FACTURA_SAT_SERIE} - ${r.FACTURA_SAT_NUMERO}</td>
                                    </tr>
            `
        })
        container.innerHTML = str;
       
        //document.getElementById('lbTotalMImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((err)=>{
       

        container.innerHTML = 'No se cargaron datos....';
       
        //document.getElementById('lbTotalMImporte').innerText = '';
    })



};

//------------
// SELL OUT
//------------
