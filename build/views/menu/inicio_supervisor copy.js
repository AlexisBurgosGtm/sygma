
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.menu()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_marcas()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_facturas() + view.modal_detalle_documento()}
                        </div>
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_productos()}
                        </div>
                        <div class="tab-pane fade" id="cinco" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_vendedores()}
                        </div>  
                        <div class="tab-pane fade" id="seis" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_inventarios()}
                        </div>
                        <div class="tab-pane fade" id="siete" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_clientes()}
                        </div> 
                        <div class="tab-pane fade" id="ocho" role="tabpanel" aria-labelledby="home-tab">
                            ${view.objetivos() + view.modal_categorias_marca() + view.modal_categorias_vendedor()}
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
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-ocho" data-toggle="tab" href="#ocho" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>         
                    </ul>
                    
                </div>
               
            `
        },
        menu:()=>{
            return `
            <div class="card card-rounded shadow col-12 bg-danger">
                <div class="card-body p-4 text-center ">
                
                    <h5 class="text-white">Supervisor</h5>
                    <h2 class="text-white negrita">${GlobalUsuario}</h2>

                </div>
            </div>

            <br>

            
            <div class="row">
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                
                    <div class="card border-info card-rounded bg-white shadow col-12 hand"  
                        onclick="Menu.clientes()">
                        <div class="card-body p-4">
                            
                            <h4 class="text-info">CATALOGO CLIENTES</h4>

                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-user negrita text-info" style="font-size:250%"></i>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    <br>

                    <div class="card border-info card-rounded bg-white shadow col-12 hand"  
                    onclick="Menu.ventas_pedidos_comodin()">
                        <div class="card-body p-4">
                            
                            <h4 class="text-info">NUEVO PEDIDO</h4>

                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-shopping-cart negrita text-info" style="font-size:250%"></i>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    <br>

                    <div class="card border-info card-rounded  bg-white shadow col-12 hand"  
                    onclick="Menu.ventas_censo()">
                        <div class="card-body p-4">

                            <h4 class="text-info">CREAR CLIENTES (CENSO)</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-users negrita text-info" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>

                    <br>

                    <div class="card border-info card-rounded  bg-white shadow col-12 hand"  
                    id="btnMenuObjetivos">
                        <div class="card-body p-4">

                            <h4 class="text-info">OBJETIVOS</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-chart-pie negrita text-info" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>


                
                </div>
                
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">

                    <div class="card card-rounded   bg-white shadow col-12 hand" id="btnMenuRptInventario">
                        <div class="card-body p-4">

                            <h4 class="">INVENTARIO</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-warehouse negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                    <br>

                    <div class="card card-rounded   bg-white shadow col-12 hand" id="btnMenuRptVendedores">
                        <div class="card-body p-4">

                            <h4 class="">VENTAS VENDEDORES</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-chart-bar negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                    <br>
                    <div class="card card-rounded bg-white shadow col-12 hand" id="btnMenuRptMarcas">
                        <div class="card-body p-4">
                            
                            <h4>REPORTE MARCAS</h4>

                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-list negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <br>
                    <div class="card card-rounded bg-white shadow col-12 hand" id="btnMenuRptDocumentos">
                        <div class="card-body p-4">
                            
                            <h4>REPORTE DE FACTURAS</h4>

                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-chart-pie negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <br>
                    <div class="card card-rounded   bg-white shadow col-12 hand" id="btnMenuRptProductos">
                        <div class="card-body p-4">

                            <h4 class="">REPORTE PRODUCTOS</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-box negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                    <br>
                    <div class="card card-rounded   bg-white shadow col-12 hand" id="btnMenuRptClientesVendedor">
                        <div class="card-body p-4">

                            <h4 class="">CLIENTES POR VENDEDOR</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-map negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>

                
                </div>
            </div>
            
       

            `
        },
        vista_listado:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">
                    <div class="table-responsive col-12">
                        <table class="table table-responsive  col-12">
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
            `
        },
        modal:()=>{
            return `
              <div id="modal_" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                TITULO
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-2">

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
        rpt_marcas:()=>{
            return `

                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Reporte de Marcas</h4>
                            
                        </div>
                        <div class="col-6">
                         
                            <label class="negrita text-danger" id="lbMarcaTotalImporte">Importe:</label>
                        </div>
                    </div>

                    <br>

                    <div class="row">
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="negrita">Fecha inicio</label>
                                        <input type="date" class="form-control negrita text-danger" id="txtMarcaFechaInicial">
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="negrita">Fecha Final</label>
                                        <input type="date" class="form-control negrita text-danger" id="txtMarcaFechaFinal">
                                    </div>
                                </div>

                    </div>

                    <br>
                    

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblMarcas">
                                <thead class="bg-success text-white negrita">
                                    <tr>
                                        <td>MARCA</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataMarcas"></tbody>

                            </table>

                    </div>

            
            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        rpt_facturas:()=>{
            return `
            
            <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4 table-responsive">
                        
                            
                            <div class="row">
                                <div class="col-6">
                                    <h4>LISTADO DE FACTURAS (VENTAS)</h4>
                                  
                                </div>
                                <div class="col-6">
                                    <h3 class="negrita text-danger" id="lbTotalFacturasImporte"></h3>
                                    <h4 class="negrita text-info" id="lbTotalFacturasConteo"></h3>
                                    
                                </div>
                            </div>
                            <br>
                            <div class="row">
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label>Fecha Inicial</label>
                                                <input type="date" class="form-control negrita" id='txtRptFacturasFechaInicial'>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label>Fecha Final</label>
                                                <input type="date" class="form-control negrita" id='txtRptFacturasFechaFinal'>
                                            </div>
                                        </div>
                            </div>
                            <br>

                            <table class="table h-full table-bordered col-12" id="tblPedidos">
                                <thead class="bg-base text-white negrita">
                                    <tr>
                                        <td class="text-left">EMBARQUE</td>
                                        <td>VENDEDOR</td>
                                        <td>CLIENTE</td>
                                        <td>MUNICIPIO</td>
                                        <td>IMPORTE</td>
                                        <td>ST</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataPedidos"></tbody>

                            </table>
                        

                        </div>
                    </div>
            
            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
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
                                            <table class="table table-responsive table-bordered ">
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
        rpt_productos:()=>{
            return `
            <div class="card card-rounded shadow col-12" id="rpt_productos_embarque">
                <div class="card-body p-4">
            
                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Productos Vendidos</h4>
                            <h5 id="lbProdCodembarque"></h5>
                            <br>
                        </div>
                        <div class="col-6">
                            <label class="negrita text-info" id="lbProdTotalPedidos">Pedidos:</label>
                            <br>
                            <label class="negrita text-danger" id="lbProdTotalImporte">Importe:</label>
                        </div>
                    </div>

                    <br>
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label>Fecha Inicial</label>
                                    <input type="date" class="form-control negrita" id='txtRptProdFechaInicial'>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label>Fecha Final</label>
                                    <input type="date" class="form-control negrita" id='txtRptProdFechaFinal'>
                                </div>
                            </div>
                        </div>
                        <br>

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
            
            
            
            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        rpt_vendedores:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
            
                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Ventas por Vendedor</h4>
                            
                            <br>
                        </div>
                        <div class="col-6">
                            <br>
                            <label class="negrita text-info h5" id="lbVenTotalPedidos">Pedidos:</label>
                            
                            <br>
                            <label class="negrita text-danger h4" id="lbVenTotalImporte">Importe:</label>
                        </div>
                    </div>

                    <br>
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label>Fecha Inicial</label>
                                    <input type="date" class="form-control negrita" id='txtRptVenFechaInicial'>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label>Fecha Final</label>
                                    <input type="date" class="form-control negrita" id='txtRptVenFechaFinal'>
                                </div>
                            </div>
                        </div>
                        <br>

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblVendedores">
                                <thead class="bg-base text-white negrita">
                                    <tr>
                                        <td>VENDEDOR</td>
                                        <td>PEDIDOS</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataVendedores"></tbody>
                                <t>

                            </table>

                    </div>
            

                </div>
            </div>

            
            
            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        rpt_inventarios:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">
                    
                    <h3 class="negrita text-danger">INVENTARIO ACTUAL</h3>

                    <div class="row">
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                             <div class="input-group">
                                <select class="form-control negrita text-base" id="cmbSt">
                                    <option value="SI">PRODUCTOS HABILITADOS</option>
                                    <option value="NO">PRODUCTOS NO HABILITADOS</option>
                                </select>
                                <input type="text" class="form-control" placeholder="Escriba para buscar..." id="txtBuscarProductoInventario" oninput="F.FiltrarTabla('tblInventario','txtBuscarProductoInventario')">

                            </div>
                        </div>
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <h5 id="lbTotalItems"></h5>
                        </div>
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <button class="btn btn-success btn-md hand shadow" id="btnExportarInventario">
                                <i class="fal fa-share"></i> Exportar Excel
                            </button>
                        </div>
                    </div>

                    <div class="table-responsive col-12">
                        <table class="table h-full  col-12" id="tblInventario">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>CODIGO</td>
                                    <td>CODIGO 2</td>
                                    <td>CODIGO 3</td>
                                    <td>PRODUCTO</td>
                                    <td>MARCA</td>
                                    <td>TOTALCOSTO</td>
                                    <td>EXISTENCIA</td>
                                    <td>FARDOS</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataInventario">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>

            `
        },
        rpt_clientes:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                    
                    <h3 class="negrita text-secondary">CLIENTES POR VENDEDOR</h3>
                    <h3 class="negrita text-danger" id="lbTotalClientesVendedores"></h3>
                    

                    <div class="table-responsive col-12">
                        <table class="table h-full  col-12" id="">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <td>VENDEDOR</td>
                                    <td>LUNES</td>
                                    <td>MARTES</td>
                                   <td>MIERCOLES</td>
                                   <td>JUEVES</td>
                                   <td>VIERNES</td>
                                   <td>SABADO</td>
                                   <td>DOMINGO</td>
                                    <td>TOTAL</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataClientesVendedor">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>

            `
        },
        objetivos:()=>{
           return `
           ${view.frag_parametros()}
            <div class="row">
                <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                    ${view.frag_marcas()}
                </div>
                <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                    ${view.frag_vendedores()}
                </div>
            </div>

         

            <button class="btn btn-bottom-l btn-secondary btn-circle btn-xl hand shadow"
            onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        frag_parametros: ()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                    
                    <h3 class="negrita text-danger">Logro de Objetivos</h3>

                    <div class="row">
                        <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                            <div class="form-group">
                                <label class="negrita text-secondary">Sucursal</label>
                                <select class="form-control negrita" id="cmbSucursal">
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="negrita text-secondary">Seleccione mes y año</label>
                                <div class="input-group">
                                    <select class="form-control negrita" id="cmbMes">
                                    </select>
                                    <select class="form-control negrita" id="cmbAnio">
                                    </select>
                                </div>
                                    
                            </div>
                        </div>
                        <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                              <h5 class="text-info negrita">Objetivos</h5>
                            <small class="negrita text-secondary">Logrado:</small>
                            <div class="input-group" id="lbObjLogrado"></div>
                            <br>
                            <small class="negrita text-secondary">Faltan:</small>
                            <div class="input-group" id="lbObjLogradoFalta"></div>
                               
                        </div>
                    </div>
                
                </div>
            </div>
            <br>
            `
        },
        frag_marcas:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">

                    <h4 class="negrita text-base text-center">LOGRO DE MARCAS</h4>

                    <div class="table-responsive col-12">
                        <table class="table h-full  col-12">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>MARCA</td>
                                    <td>IMPORTE</td>
                                    <td>OBJETIVO</td>
                                    <td>FALTA</td>
                                    <td>ALCANCE</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataMarcas2">
                            </tbody>
                            <tfoot class="bg-base text-white negrita">
                                <tr>
                                    <td></td>
                                    <td id="lbTotalMarcasImporte"></td>
                                    <td id="lbTotalMarcasObjetivo"></td>
                                    <td id="lbTotalMarcasFalta"></td>
                                    <td id="lbTotalMarcasLogro"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            `
        },
        frag_vendedores:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">

                    <h4 class="negrita text-secondary text-center">LOGRO DE VENDEDORES</h4>

                    <div class="table-responsive col-12">
                        <table class="table h-full  col-12">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <td>VENDEDOR</td>
                                    <td>IMPORTE</td>
                                    <td>OBJETIVO</td>
                                    <td>FALTA</td>
                                    <td>ALCANCE</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataVendedores2">
                            </tbody>
                            <tfoot class="bg-secondary text-white negrita">
                                <tr>
                                    <td></td>
                                    <td id="lbTotalVendedoresImporte"></td>
                                    <td id="lbTotalVendedoresObjetivo"></td>
                                    <td id="lbTotalVendedoresFalta"></td>
                                    <td id="lbTotalVendedoresLogro"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            `
        },
        modal_categorias_marca:()=>{
            return `
              <div id="modal_categorias_marca" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="lbMarcasDescategoria">
                                
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                    <div class="table-responsive">
                                        <table class="table table-bordered h-full col-12">
                                            <thead class="bg-base text-white"> 
                                                <tr>
                                                    <td>CATEGORIA</td>
                                                    <td>LOGRO</td>
                                                    <td>OBJETIVO</td>
                                                    <td>FALTAN</td>
                                                    <td></td>
                                                </tr>
                                            </thead>
                                            
                                            <tbody id="tblDataCategoriasMarca">
                                            </tbody>
                                            
                                            <tfoot class="bg-base text-white"> 
                                                <tr>
                                                    <td></td>
                                                    <td id="lbTotalMarcaLogro"></td>
                                                    <td id="lbTotalMarcaObjetivo"></td>
                                                    <td  id="lbTotalMarcaFaltan"></td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>

                                        </table>
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
        modal_categorias_vendedor:()=>{
            return `
              <div id="modal_categorias_vendedor" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="lbVendedorCategorias">
                                
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                    <div class="table-responsive">
                                        <table class="table table-bordered h-full col-12">
                                            <thead class="bg-secondary text-white"> 
                                                <tr>
                                                    <td>CATEGORIA</td>
                                                     <td>VENTA</td>
                                                    <td>OBJETIVO</td>
                                                    <td>FALTAN</td>
                                                    <td></td>
                                                </tr>
                                            </thead>
                                            <tbody id="tblDataVendedorCategorias"></tbody>
                                            <tfoot class="bg-secondary text-white"> 
                                                <tr>
                                                    <td></td>
                                                    <td  id="lbTotalCategoriaVendedorLogro"></td>
                                                    <td id="lbTotalCategoriaVendedorObjetivo"></td>
                                                    <td  id="lbTotalCategoriaVendedorFaltan"></td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
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
    }

    root.innerHTML = view.body();

};

function addListeners(){

    F.slideAnimationTabs();

   document.title = `Supervisor - ${GlobalNomEmpresa}`;

  


    //MENU

    //documentos
    document.getElementById('btnMenuRptDocumentos').addEventListener('click',()=>{

        document.getElementById('tab-tres').click();
        
        rpt_facturas('tblDataPedidos');

    })


    //marcas
    document.getElementById('btnMenuRptMarcas').addEventListener('click',()=>{

        document.getElementById('tab-dos').click();
        
        rpt_tbl_marcas();

    })

    document.getElementById('btnMenuRptProductos').addEventListener('click',()=>{
        document.getElementById('tab-cuatro').click();
        rpt_tbl_productos();

    })



    //MENU




    document.getElementById('txtRptFacturasFechaInicial').value = F.getFecha();
    document.getElementById('txtRptFacturasFechaFinal').value = F.getFecha();

    document.getElementById('txtRptFacturasFechaInicial').addEventListener('change',()=>{

        rpt_facturas('tblDataPedidos');

    });

    document.getElementById('txtRptFacturasFechaFinal').addEventListener('change',()=>{

        rpt_facturas('tblDataPedidos');

    });


    



    document.getElementById('txtMarcaFechaInicial').value = F.getFecha();

    document.getElementById('txtMarcaFechaInicial').addEventListener('change',()=>{
        rpt_tbl_marcas();
    });

    document.getElementById('txtMarcaFechaFinal').value = F.getFecha();

    document.getElementById('txtMarcaFechaFinal').addEventListener('change',()=>{
        rpt_tbl_marcas();
    });



    

    document.getElementById('txtRptProdFechaInicial').value = F.getFecha();

    document.getElementById('txtRptProdFechaInicial').addEventListener('change',()=>{
        rpt_tbl_productos();
    });

    document.getElementById('txtRptProdFechaFinal').value = F.getFecha();

    document.getElementById('txtRptProdFechaFinal').addEventListener('change',()=>{
        rpt_tbl_productos();
    });


    document.getElementById('btnMenuRptInventario').addEventListener('click',()=>{

        document.getElementById('tab-seis').click();

        tbl_inventario();

    });




    document.getElementById('btnMenuRptVendedores').addEventListener('click',()=>{

        document.getElementById('tab-cinco').click();

        rpt_tbl_vendedores();

    });

    document.getElementById('txtRptVenFechaInicial').value = F.getFecha();

    document.getElementById('txtRptVenFechaInicial').addEventListener('change',()=>{
        rpt_tbl_vendedores();
    });

    document.getElementById('txtRptVenFechaFinal').value = F.getFecha();

    document.getElementById('txtRptVenFechaFinal').addEventListener('change',()=>{
        rpt_tbl_vendedores();
    });




    document.getElementById('btnMenuRptClientesVendedor').addEventListener('click',()=>{

        document.getElementById('tab-siete').click();

        rpt_tbl_clientes_vendedores();

    });




    // OBJETIVOS

    listeners_objetivos();

    // OBJETIVOS


};

function initView(){

    getView();
    addListeners();

};



function rpt_facturas(idContainer){

    let container = document.getElementById(idContainer);

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;

    let fi = F.devuelveFecha('txtRptFacturasFechaInicial');
    let ff = F.devuelveFecha('txtRptFacturasFechaFinal');
    

    GF.get_data_pedidos_pendientes_vendedores_fechas(fi,ff)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
            let idRowPedido = `idRowPedido${r.CODDOC}-${r.CORRELATIVO}`;
            contador +=1;
            varTotal += Number(r.IMPORTE);

            let importe = 0;
            if(r.STATUS=='A'){importe = 0}else{importe = r.IMPORTE};

            let strClassSt = 'info'; if(r.STATUS.toString()=='A'){strClassSt='danger'};
            let idbtnAnular = `btnAnular${r.CODDOC}-${r.CORRELATIVO}`
            str += `
                <tr>
                    <td class="text-left">
                        <b class="negrita">${r.CODDOC}-${r.CORRELATIVO}</b>
                        <br>
                        ${F.convertDateNormal(r.FECHA)}
                        <br>
                        <small>Hora:${r.HORA}</small>
                    </td>
                    <td>${r.NOMEMPLEADO}
                        <button class="btn btn-info btn-circle btn-sm hand shadow"
                        onclick="F.gotoGoogleMaps('${r.LAT}','${r.LONG}')">
                            <i class="fal fa-map"></i>
                        </button>
                        
                    </td>
                    <td>${r.NOMCLIE}
                        <br>
                        <small>${r.DIRCLIE}</small>
                    </td>
                    <td>
                        ${r.DESMUN}
                    </td>
                    <td class="negrita text-danger text-right">${F.setMoneda(importe,'Q')}</td>
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
                  
                </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalFacturasImporte').innerText = `Total: ${F.setMoneda(varTotal,'Q')}`
        document.getElementById('lbTotalFacturasConteo').innerText =`${contador} pedidos`


        F.initit_datatable('tblPedidos',true);

    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....'
        document.getElementById('lbTotalFacturasImporte').innerText = '---'
        document.getElementById('lbTotalFacturasConteo').innerText = '---'
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



function rpt_tbl_marcas(){

    let container = document.getElementById('tblDataMarcas');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

    let fi = F.devuelveFecha('txtMarcaFechaInicial');
    let ff = F.devuelveFecha('txtMarcaFechaFinal');

 
    GF.get_data_marcas_vendedor_todas(GlobalEmpnit,fi,ff)
    .then((data)=>{

   
        let str = '';

        data.recordset.map((r)=>{
        
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            str += `

                <tr>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    <td>
                        <button class="btn btn-secondary btn-md btn-circle hand shadow"
                        onclick="">
                                <i class="fal fa-list"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
       
        document.getElementById('lbMarcaTotalImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((err)=>{
        console.log('error:')
        console.log(err)

        container.innerHTML = 'No se cargaron datos....';
       
        document.getElementById('lbMarcaTotalImporte').innerText = '';
    })



};



function tbl_inventario(){

    let container = document.getElementById('tblDataInventario');
    container.innerHTML = GlobalLoader;

    let st = document.getElementById('cmbSt').value;

    GF.get_data_inventarios_general(GlobalEmpnit,st)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            let cajas = Number(r.TOTALUNIDADES)/Number(r.UXC);
            str += `
            <tr>
                <td>${r.CODPROD}</td>
                <td>${r.CODPROD2}</td>
                <td>${r.DESPROD3}</td>
                <td>${r.DESPROD}</td>
                <td>${r.DESMARCA}</td>
                <td>${F.setMoneda(r.TOTALCOSTO,'Q')}</td>
                <td>${r.TOTALUNIDADES}</td>
                <td>${F.setMoneda(cajas,'')}</td>
            </tr>
            `
        })
        container.innerHTML = str;

        F.initit_datatable('tblInventario', true);

    })
    .catch(()=>{

        container.innerHTML = 'No se cargaron datos...';
    })


    

};




function rpt_tbl_productos(){



    let container = document.getElementById('tblDataFProductos');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;


    let fi = F.devuelveFecha('txtRptProdFechaInicial');
    let ff = F.devuelveFecha('txtRptProdFechaFinal');

    GF.get_data_embarque_productos_vendedor_todos(GlobalEmpnit,fi,ff)
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
        document.getElementById('lbProdTotalPedidos').innerText = `Pedidos: ${contador}`;
        document.getElementById('lbProdTotalImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbProdTotalPedidos').innerText = '';
        document.getElementById('lbProdTotalImporte').innerText = '';
    })


};



function rpt_tbl_vendedores(){


    
    let container = document.getElementById('tblDataVendedores');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;
    let varTotalPedidos = 0;


    let fi = F.devuelveFecha('txtRptVenFechaInicial');
    let ff = F.devuelveFecha('txtRptVenFechaFinal');

    GF.get_data_ventas_vendedores_todos(GlobalEmpnit,fi,ff)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
         
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            varTotalPedidos += Number(r.PEDIDOS);
            str += `
                <tr>
                    <td>${r.EMPLEADO}
                        <br>
                        <small class="negrita text-info">Usuario: ${r.USUARIO}</small>
                        <br>
                        <small class="negrita text-danger">Clave: ${r.CLAVE}</small>
                    </td>
                    <td>${r.PEDIDOS}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    <td></td>
                </tr>
                `
        })
        container.innerHTML = str;
        document.getElementById('lbVenTotalImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;
        document.getElementById('lbVenTotalPedidos').innerText = `Pedidos: ${varTotalPedidos}`;
    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbVenTotalImporte').innerText = '';
        document.getElementById('lbVenTotalPedidos').innerText = ``
    })


};



function rpt_tbl_clientes_vendedores(){



    let container = document.getElementById('tblDataClientesVendedor');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;


    GF.get_data_ventas_vendedores_clientes_resumen(GlobalEmpnit)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
            
            contador +=Number(r.TOTAL);
            //varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td>${r.NOMEMP}
                    <td>${r.LUNES}</td>
                    <td>${r.MARTES}</td>
                    <td>${r.MIERCOLES}</td>
                    <td>${r.JUEVES}</td>
                    <td>${r.VIERNES}</td>
                    <td>${r.SABADO}</td>
                    <td>${r.DOMINGO}</td>
                    <td class="negrita text-danger">${r.TOTAL}</td>
                </tr>
                `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalClientesVendedores').innerText = `Total: ${contador}`;
      
    })
    .catch((error)=>{
        console.log(error);
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbTotalClientesVendedores').innerText = '';
       
    })


};











//OBJETIVOS

function listeners_objetivos(){


    document.getElementById('btnMenuObjetivos').addEventListener('click',()=>{

         document.getElementById('tab-ocho').click();
        get_reportes();
    });


    
    let cmbSucursal = document.getElementById('cmbSucursal');

    GF.get_data_empresas()
    .then((data)=>{

        let str = `<option value="%">TODAS</option>`;

        data.recordset.map((r)=>{
            str += `<option value="${r.EMPNIT}">${r.NOMBRE}</option>`;
        })
        cmbSucursal.innerHTML = str; 
        
        if(Number(GlobalNivelUsuario)==1){

        }else{
            cmbSucursal.value = GlobalEmpnit;
            cmbSucursal.disabled = true;
        };

        get_reportes();

    })
    .catch(()=>{
        cmbSucursal.innerHTML = `<option value="%">No se cargaron las sedes</option>`
    })



    document.getElementById('cmbMes').innerHTML = F.ComboMeses();
    document.getElementById('cmbMes').value = F.get_mes_curso();

    document.getElementById('cmbAnio').innerHTML = F.ComboAnio();
    document.getElementById('cmbAnio').value = F.get_anio_curso();



    cmbSucursal.addEventListener('change',()=>{ get_reportes(); });
    document.getElementById('cmbMes').addEventListener('change',()=>{ get_reportes(); });
    document.getElementById('cmbAnio').addEventListener('change',()=>{ get_reportes(); });



};

function get_reportes(){

    let sucursal = document.getElementById('cmbSucursal').value;
    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;


    tbl_logro_marcas(sucursal,mes,anio);
    
    tbl_logro_vendedores(sucursal,mes,anio);


};


function get_data_logro_marcas(sucursal,mes,anio){

     return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + '/objetivos/select_logro_marcas', {
                    token:TOKEN,
                    sucursal:sucursal,
                    mes:mes,
                    anio:anio})
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
function tbl_logro_marcas(sucursal,mes,anio){


    let container = document.getElementById('tblDataMarcas2');
    container.innerHTML = GlobalLoader;

    let conteo = 0;
    let varTotalObjetivo =0; let varTotalImporte = 0; 
    let varTotalFaltan = 0; let varTotalLogro = 0;

    get_data_logro_marcas(sucursal,mes,anio)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            conteo += 1;
            let varFaltan = (Number(r.OBJETIVO) - Number(r.TOTALPRECIO));
            let varLOGRO = ((Number(r.TOTALPRECIO)/Number(r.OBJETIVO))*100);

            let strLogro = get_color_logro(Number(varLOGRO));

            varTotalObjetivo += Number(r.OBJETIVO);
            varTotalImporte += Number(r.TOTALPRECIO);
            varTotalFaltan += Number(varFaltan);
            varTotalLogro += Number(varLOGRO);

            str += `
            <tr class="${strLogro} hand" onclick="get_detalle_marca('${r.CODIGO_MARCA}','${r.MARCA}')">
                <td>${r.MARCA}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>${F.setMoneda(varFaltan,'Q')}</td>
                <td>${varLOGRO.toFixed(2)} %</td>
            </tr>
            `
        })
        container.innerHTML = str;


        document.getElementById('lbTotalMarcasImporte').innerHTML = F.setMoneda(varTotalImporte,'Q');
        document.getElementById('lbTotalMarcasObjetivo').innerHTML = F.setMoneda(varTotalObjetivo,'Q');
        document.getElementById('lbTotalMarcasFalta').innerHTML = F.setMoneda(varTotalFaltan,'Q');
        document.getElementById('lbTotalMarcasLogro').innerHTML = `${F.setMoneda(varTotalLogro / conteo,'')} %`

        let logrado = 0; let faltaLogro = 0;
        try {
           logrado = (Number(varTotalImporte)/Number(varTotalObjetivo))*100;
           faltaLogro = 100-Number(logrado);
        } catch (error) {
            logrado=0;
            faltaLogro=0;   
        }
        document.getElementById('lbObjLogrado').innerHTML = `<progress class="form-control" value="${logrado}" max="100"></progress><b class="text-success">${logrado.toFixed(2)}%</b>`;
        document.getElementById('lbObjLogradoFalta').innerHTML = `<progress class="form-control progress-falta" value="${faltaLogro}" max="100"></progress><b class="text-danger">${faltaLogro.toFixed(2)}%</b>`;
    })
    .catch(()=>{

        container.innerHTML = 'No se cargaron datos...';

        document.getElementById('lbTotalMarcasImporte').innerHTML = '';
        document.getElementById('lbTotalMarcasObjetivo').innerHTML =''; 
        document.getElementById('lbTotalMarcasFalta').innerHTML = '';
        document.getElementById('lbTotalMarcasLogro').innerHTML = '';

        document.getElementById('lbObjLogrado').innerHTML = `<progress value="0" max="100"></progress>`;
        document.getElementById('lbObjLogradoFalta').innerHTML = `<progress class="progress-falta" value="0" max="100"></progress>`;
    
    })



};

function get_detalle_marca(codmarca,desmarca){


    $("#modal_categorias_marca").modal('show');

    document.getElementById('lbMarcasDescategoria').innerText = desmarca;
    
    tbl_logro_categorias_marca(codmarca);



}


function get_data_logro_categorias_marcas(sucursal,codmarca,mes,anio){

     return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + '/objetivos/select_logro_marcas_categorias', {
                    token:TOKEN,
                    sucursal:sucursal,
                    codmarca:codmarca,
                    mes:mes,
                    anio:anio})
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

function tbl_logro_categorias_marca(codmarca){

    let container = document.getElementById('tblDataCategoriasMarca');
    container.innerHTML = GlobalLoader;


    let sucursal = document.getElementById('cmbSucursal').value;
    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;



    let varTotalObjetivo = 0; let varTotalLogro = 0; let varTotalFaltan = 0;

    get_data_logro_categorias_marcas(sucursal,codmarca,mes,anio)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
           
            let varLOGRO = ((Number(r.TOTALPRECIO)/Number(r.OBJETIVO))*100);
          
            varTotalObjetivo += Number(r.OBJETIVO);
            varTotalLogro += Number(r.TOTALPRECIO);
            let faltan = (Number(r.OBJETIVO)-Number(r.TOTALPRECIO))
            varTotalFaltan += Number(faltan);

            let strLogro = get_color_logro(Number(varLOGRO));

            str += `
            <tr class="${strLogro}">
                <td>${r.CATEGORIA}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>${F.setMoneda(faltan,'Q')}</td>
                <td>${varLOGRO.toFixed(2)}%</td>
            </tr>
            `
        })
        container.innerHTML = str;

        document.getElementById('lbTotalMarcaObjetivo').innerHTML = F.setMoneda(varTotalObjetivo,'Q');
        document.getElementById('lbTotalMarcaLogro').innerHTML = F.setMoneda(varTotalLogro,'Q');
        document.getElementById('lbTotalMarcaFaltan').innerHTML = F.setMoneda(varTotalFaltan,'Q');
    })
    .catch(()=>{

        container.innerHTML = 'No se cargaron datos...';

        document.getElementById('lbTotalMarcaObjetivo').innerHTML = '';
        document.getElementById('lbTotalMarcaLogro').innerHTML = '';
        document.getElementById('lbTotalMarcaFaltan').innerHTML = '';
    })


};



function get_data_logro_vendedores(sucursal,mes,anio){

    return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + '/objetivos/select_logro_vendedores', {
                    token:TOKEN,
                    sucursal:sucursal,
                    mes:mes,
                    anio:anio})
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
function tbl_logro_vendedores(sucursal,mes,anio){


    let container = document.getElementById('tblDataVendedores2');
    container.innerHTML = GlobalLoader;

    let conteo = 0;
    let varTotalObjetivo =0; let varTotalImporte = 0; 
    let varTotalFaltan = 0; let varTotalLogro = 0;

    get_data_logro_vendedores(sucursal,mes,anio)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            conteo += 1;
            let varFaltan = (Number(r.OBJETIVO) - Number(r.TOTALPRECIO));
            let varLOGRO = ((Number(r.TOTALPRECIO)/Number(r.OBJETIVO))*100);

            let strLogro = get_color_logro(Number(varLOGRO));
            
            varTotalObjetivo += Number(r.OBJETIVO);
            varTotalImporte += Number(r.TOTALPRECIO);
            varTotalFaltan += Number(varFaltan);
            varTotalLogro += Number(varLOGRO);

            str += `
            <tr class="${strLogro} hand" onclick="get_detalle_vendedor('${r.CODIGO_VENDEDOR}','${r.VENDEDOR}')">
                <td>${r.VENDEDOR}
                    <br>
                    <small class="negrita text-info">${r.EMPRESA}</small>
                </td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>${F.setMoneda(varFaltan,'Q')}</td>
                <td>${varLOGRO.toFixed(2)} %</td>
            </tr>
            `
        })
        container.innerHTML = str;


        document.getElementById('lbTotalVendedoresImporte').innerHTML = F.setMoneda(varTotalImporte,'Q');
        document.getElementById('lbTotalVendedoresObjetivo').innerHTML = F.setMoneda(varTotalObjetivo,'Q');
        document.getElementById('lbTotalVendedoresFalta').innerHTML = F.setMoneda(varTotalFaltan,'Q');
        document.getElementById('lbTotalVendedoresLogro').innerHTML = `${F.setMoneda(varTotalLogro / conteo,'')} %`

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
        
        document.getElementById('lbTotalVendedoresImporte').innerHTML = '';
        document.getElementById('lbTotalVendedoresObjetivo').innerHTML =''; 
        document.getElementById('lbTotalVendedoresFalta').innerHTML = '';
        document.getElementById('lbTotalVendedoresLogro').innerHTML = '';
    })



};


function get_detalle_vendedor(codemp,nombre){


        $("#modal_categorias_vendedor").modal('show');

        document.getElementById('lbVendedorCategorias').innerText = nombre;

        tbl_detalle_vendedor(codemp);

};

function get_data_vendedor(codemp,mes,anio){

    return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + '/objetivos/select_logro_vendedores_categorias', {
                    token:TOKEN,
                    codemp:codemp,
                    mes:mes,
                    anio:anio})
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
function tbl_detalle_vendedor(codemp){

    let container = document.getElementById('tblDataVendedorCategorias');
    container.innerHTML = GlobalLoader;

    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;

    let varTObjetivo = 0; let varTLogro = 0; let varTFaltan = 0;

    get_data_vendedor(codemp,mes,anio)
    .then((data)=>{
        let str = '';

        data.recordset.map((r)=>{
            
            let logrado = F.get_logrado(Number(r.LOGRO),Number(r.OBJETIVO));
            let faltan = Number(r.OBJETIVO)-Number(r.LOGRO);
          
            let strLogro = get_color_logro(Number(logrado));

            varTObjetivo += Number(r.OBJETIVO);
            varTLogro += Number(r.LOGRO);
            varTFaltan += Number(faltan);

            str += `
            <tr class="${strLogro}">
                <td>${r.CATEGORIA}</td>
                <td>${F.setMoneda(r.LOGRO,'Q')}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>${F.setMoneda(faltan,'Q')}</td>
                <td>
                    <div class="input-group"><progress value="${logrado}" max="100"></progress>${logrado}%</div>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalCategoriaVendedorObjetivo').innerText = F.setMoneda(varTObjetivo,'Q');
        document.getElementById('lbTotalCategoriaVendedorLogro').innerText = F.setMoneda(varTLogro,'Q');
        document.getElementById('lbTotalCategoriaVendedorFaltan').innerText = F.setMoneda(varTFaltan,'Q');
        

    })
    .catch((error)=>{

        console.log(error);

        container.innerHTML = 'No se cargaron datos...';
        
        document.getElementById('lbTotalCategoriaVendedorObjetivo').innerText = '';
        document.getElementById('lbTotalCategoriaVendedorLogro').innerText = '';
        document.getElementById('lbTotalCategoriaVendedorFaltan').innerText = '';
        
    })


}

//OBJETIVOS