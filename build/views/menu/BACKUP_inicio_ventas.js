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
                            ${view.rpt_ventas()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_productos()}
                        </div>
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_marcas()}
                        </div>   
                        <div class="tab-pane fade" id="cinco" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_categorias() + view.modal_categorias_marca()}
                        </div>
                        <div class="tab-pane fade" id="seis" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_goles()}
                        </div>
                        <div class="tab-pane fade" id="siete" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_cobertura()}
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
               
            `
        },
        menu:()=>{
            return `
             <div class="card card-rounded shadow col-12 bg-base">
                <div class="card-body p-4 text-center ">
                
                    <h5 class="text-white">Bienvenido</h5>
                    <h2 class="text-white negrita">${GlobalUsuario}</h2>

                </div>
            </div>

            <br>
                <div class="form-group">
                    <label class="negrita">Seleccione Mes y Año</label>
                    <div class="input-group">
                        <select class="form-control negrita border-base text-base" id="cmbMes"></select>
                        <select class="form-control negrita border-base text-base" id="cmbAnio"></select>
                    </div>
                </div>
            <br>

       

            <div class="row">

                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4 p-2">
                    
                    <div class="card border-danger card-rounded bg-white shadow col-12 hand"  
                    onclick="Menu.objetivos_logro_procter()">
                        <div class="card-body p-4">
                            
                            <h4 class="text-danger">AVANCE P&G</h4>

                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-folder-open negrita text-danger" style="font-size:250%"></i>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    

                </div>
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4 p-2">
                    
                    <div class="card border-info card-rounded bg-white shadow col-12 hand"  
                    onclick="Menu.ventas_pedidos()">
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
                    

                </div>
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4 p-2" >
                    
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
                    

                </div>
            </div>

            <br>

            <div class="row">

                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4 p-2">
                    
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
                    

                </div>
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4 p-2">
                    
                    <div class="card card-rounded bg-white shadow col-12 hand" id="btnMenuRptCategorias">
                        <div class="card-body p-4">
                            
                            <h4>OBJETIVOS CATEGORIAS</h4>

                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-chart-bar negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    

                </div>
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4 p-2">
                    
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
                    

                </div>
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4 p-2">
                    
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
                </div>
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4 p-2">
                    
                    <div class="card card-rounded   bg-white shadow col-12 hand" id="btnMenuRptGoles">
                        <div class="card-body p-4">

                            <h4 class="">REPORTE DE GOLES Y COBERTURA</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-futbol negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4 p-2">
                    
                    <div class="card card-rounded   bg-white shadow col-12 hand" id="btnMenuRptHistorial">
                        <div class="card-body p-4">

                            <h4 class="">REPORTE HISTORIAL CLIENTES</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-user negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            `
        },
        rpt_ventas: ()=>{
            return `
            
            
                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <h4 class="negrita text-base">Listado de Facturas</h4>
                            <div class="row">
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="negrita">Fecha inicio</label>
                                        <input type="date" class="form-control negrita text-danger" id="txtDocFechaInicial">
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="negrita">Fecha Final</label>
                                        <input type="date" class="form-control negrita text-danger" id="txtDocFechaFinal">
                                    </div>
                                </div>
                               

                            </div>
                            <br>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <label class="negrita text-info" id="lbFacTotalPedidos">Pedidos:</label>
                            <br>
                            <label class="negrita text-danger h1" id="lbFacTotalImporte">Importe:</label>
                            <br>
                            <button class="btn btn-outline-secondary btn-md hand shadow" id="btnRecargarListaFacturas">
                                <i class="fal fa-sync"></i> Recargar Lista
                            </button>
                        </div>
                    </div>
                    

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblFFacturas">
                                <thead class="bg-secondary text-white negrita">
                                    <tr>
                                        <td>DOCUMENTO</td>
                                        <td>FECHA</td>
                                        <td>CLIENTE</td>
                                        <td>MUNICIPIO</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataFFacturas"></tbody>

                            </table>

                    </div>


            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        rpt_marcas:()=>{

            return `
                     <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Reporte de Marcas</h4>
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
                        </div>
                        <div class="col-6">
                         
                            <label class="negrita text-danger" id="lbMarcaTotalImporte">Importe:</label>
                        </div>
                    </div>
                    

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblMarcas">
                                <thead class="bg-success text-white negrita">
                                    <tr>
                                        <td>MARCA</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                        <td></td>
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
        rpt_categorias:()=>{

            return `
            <div class="card card-rounded col-12">
                <div class="card-body p-4">

                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Logro por Categoria</h4>

                           

                           
                            <br>
                        </div>
                        <div class="col-6">
                            <h5 class="text-info negrita">Objetivos</h5>
                            <small class="negrita text-secondary">Logrado:</small>
                            <div class="input-group" id="lbObjLogrado"></div>
                            <br>
                            <small class="negrita text-secondary">Faltan:</small>
                            <div class="input-group" id="lbObjLogradoFalta"></div>
                            <br>
                            <label class="negrita text-danger" id="lbMarcaTotalImporte">Importe:</label>
                        </div>
                    </div>
                    



                    <div class="table-responsive col-12">
                        <table class="table h-full table-bordered col-12">
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
            


            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
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
        rpt_productos:()=>{
            return `
            
            <div class="row p-4">
                        <div class="col-6">
                            <h4 class="negrita text-base">Productos Vendidos</h4>
                            
                            <div class="row">
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="negrita">Fecha inicio</label>
                                        <input type="date" class="form-control negrita text-danger" id="txtProdFechaInicial">
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="negrita">Fecha Final</label>
                                        <input type="date" class="form-control negrita text-danger" id="txtProdFechaFinal">
                                    </div>
                                </div>

                            </div>
                            
                            

                            <br>
                        </div>
                        <div class="col-6">
                            <label class="negrita text-info" id="lbProdTotalPedidos">Pedidos:</label>
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

            
            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        rpt_goles:()=>{
            return `
             <div class="card card-rounded col-12">
                <div class="card-body p-4">
            
                    <h4 class="negrita text-base">LOGRO DE GOLES Y COBERTURA DEL MES</h4>
                   
                    <br>
                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                          
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <h5>Total Goles:</h5>
                            <h1 class="negrita text-danger" id="lbTotalGoles"></h1>
                        </div>
                    </div>

                       

                    <hr class="solid">

                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        
                            <div class="table-responsive col-12">
                                <table class="table h-full table-bordered col-12">
                                    <thead class="bg-primary text-white">
                                        <tr>
                                            <td>MARCA</td>
                                            <td>VISITADOS</td>
                                            <td>GOLES</td>
                                            <td>IMPORTE</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataMarcasEmpleadoCobertura">
                                    </tbody>
                                     <tfoot class="bg-primary text-white">
                                        <tr>
                                            <td></td>
                                            <td id="lbTotalMarcaVisitadosEmpleado"></td>
                                            <td id="lbTotalMarcaGolesEmpleado"></td>
                                            <td id="lbTotalMarcaImporteEmpleado"></td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        
                            <div class="table-responsive col-12">

                                <div class="form-group">
                                    <input type="text" class="form-control border-info text-info"
                                    id="txtBuscarGoles"
                                    placeholder="Escriba para buscar..." 
                                    oninput="F.FiltrarTabla('tblGoles','txtBuscarGoles')"
                                    >
                                </div>

                                <table class="table h-full table-hover table-bordered" id="tblGoles">
                                    <thead class="bg-primary text-white">
                                        <tr>
                                            <td>PRODUCTO</td>
                                            <td>GOLES</td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataGoles">
                                    </tbody>

                                </table>

                            </div>
                        
                        </div>
                    </div>

                            

                    
            
                </div>
            </div>

            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
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
        rpt_cobertura:()=>{
            return `
            <h4 class="negrita text-base">HISTORIAL DE CLIENTES VISITADOS MES</h4>
                   
                    <br>
                
            <div class="card card-rounded col-12">
                <div class="card-body p-4">
                
                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <h3 class="hidden negrita text-base" id="lbEmpleadox"></h3>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <h2 class="negrita text-danger" id="lbEmpleadoTotal"></h2>
                        </div>
                    </div>

                    <br>

                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        
                           

                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        
                              
                        
                        </div>
                      
                    </div>

                      <div class="form-group">
                                    <input type="text"
                                    id="txtBuscarEmpleado"
                                    class="form-control border-info"
                                    placeholder="Escriba para buscar..."
                                    oninput="F.FiltrarTabla('tblEmpleado','txtBuscarEmpleado')">
                                </div>

                                <div class="table-responsive">
                                    <table class="table table-bordered h-full col-12" id="tblEmpleado">
                                        <thead class="bg-base text-white">
                                            <tr>
                                                <td>VISITA</td>
                                                <td>CLIENTE</td>
                                                <td>DIRECCION</td>
                                                <td>ULTIMA_V</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataEmpleado"></tbody>
                                    </table>
                                </div>

                    
                    
                    
                
                </div>
            </div>


            <button class="btn btn-bottom-l btn-secondary btn-xl btn-circle hand shadow"
            id="btnAtrasCoberturaEmpleado">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        }
    }

    root.innerHTML = view.body();

};

function addListeners(){



    F.slideAnimationTabs();

    selected_tab = '';


    document.title = `Vendedor - ${GlobalNomEmpresa}`;
    

    document.getElementById('cmbMes').innerHTML = F.ComboMeses();
    document.getElementById('cmbMes').value = F.get_mes_curso();
   
    document.getElementById('cmbAnio').innerHTML = F.ComboAnio();
    document.getElementById('cmbAnio').value = F.get_anio_curso();

    

    document.getElementById('btnMenuRptProductos').addEventListener('click',()=>{

            document.getElementById('tab-tres').click();
            selected_tab = 'PRODUCTOS';
            cargar_grid();
    })

    document.getElementById('btnMenuRptDocumentos').addEventListener('click',()=>{

        document.getElementById('tab-dos').click();
        selected_tab = 'DOCUMENTOS';
        cargar_grid();
        
    })

    
    document.getElementById('btnMenuRptMarcas').addEventListener('click',()=>{


        document.getElementById('tab-cuatro').click();
        selected_tab = 'MARCAS';
        cargar_grid();
        
    })


    
    document.getElementById('btnMenuRptCategorias').addEventListener('click',()=>{

        document.getElementById('tab-cinco').click();
        selected_tab = 'CATEGORIAS';
        cargar_grid();

        
    })

    document.getElementById('btnMenuRptHistorial').addEventListener('click',()=>{

        document.getElementById('tab-siete').click();
        selected_tab = 'HISTORIAL';
        cargar_grid();
        
    });
    document.getElementById('btnAtrasCoberturaEmpleado').addEventListener('click',()=>{
        document.getElementById('tab-uno').click();

        document.getElementById('tblDataEmpleado').innerHTML = '';
        document.getElementById('tblDataMarcasEmpleadoCobertura').innerHTML = '';
        
    })


    document.getElementById('txtProdFechaInicial').value = F.getFecha();
    document.getElementById('txtProdFechaFinal').value = F.getFecha();


    
    
    document.getElementById('txtProdFechaInicial').addEventListener('change',()=>{
        rpt_tbl_productos_embarque();
    });

    
    document.getElementById('txtProdFechaFinal').addEventListener('change',()=>{
        rpt_tbl_productos_embarque();
    });


    document.getElementById('txtDocFechaInicial').value = F.getFecha();
    document.getElementById('txtDocFechaFinal').value = F.getFecha();


    document.getElementById('btnRecargarListaFacturas').addEventListener('click',()=>{
        rpt_tbl_documentos_embarque();
    });
    
    document.getElementById('txtDocFechaInicial').addEventListener('change',()=>{
        rpt_tbl_documentos_embarque();
    });

    
    document.getElementById('txtDocFechaFinal').addEventListener('change',()=>{
        rpt_tbl_documentos_embarque();
    });


    document.getElementById('txtMarcaFechaInicial').value = F.getFecha();
    document.getElementById('txtMarcaFechaFinal').value = F.getFecha();


    document.getElementById('txtMarcaFechaInicial').addEventListener('change',()=>{
        rpt_tbl_marcas();
    });

    
    document.getElementById('txtMarcaFechaFinal').addEventListener('change',()=>{
        rpt_tbl_marcas();
    });





    // -------------------------------
    // GOLES 
    // -------------------------------
    document.getElementById('btnMenuRptGoles').addEventListener('click',()=>{
        
        document.getElementById('tab-seis').click();
     
        selected_tab = 'GOLES-COBERTURA';
        cargar_grid();
        

    });
  
    // -------------------------------
    // GOLES 
    // -------------------------------

    

};


function initView(){

    getView();
    addListeners();

};


function cargar_grid(){

    switch (selected_tab) {
        case 'MARCAS':
            rpt_tbl_marcas();
            
            break;
        case 'CATEGORIAS':
             tbl_logro_marcas(GlobalEmpnit);
            
             break;
        case 'DOCUMENTOS':
            rpt_tbl_documentos_embarque();
            
            break;
        case 'PRODUCTOS':
            rpt_tbl_productos_embarque();
            
            break;
        case 'GOLES-COBERTURA':
            rpt_goles_resumen();
            rpt_cobertura_marcas_empleado(GlobalCodUsuario);

            break;
        case 'HISTORIAL':
            get_logro_empleado(GlobalCodUsuario,GlobalUsuario);

            break;
        default:
            document.getElementById('tab-uno').click();
            break;
    }
};

function rpt_tbl_documentos_embarque(){
   

        let container = document.getElementById('tblDataFFacturas');
        container.innerHTML = GlobalLoader;

        let contador = 0;
        let varTotal = 0;
    
        let fi = F.devuelveFecha('txtDocFechaInicial');
        let ff = F.devuelveFecha('txtDocFechaFinal');

        GF.get_data_embarque_facturas_vendedor(GlobalEmpnit,fi,ff,GlobalCodUsuario)
        .then((data)=>{
    
       
            let str = '';
    
            data.recordset.map((r)=>{
            
                contador +=1;
                varTotal += Number(r.IMPORTE);
                str += `
                    <tr>
                        <td>${r.CODDOC}-${r.CORRELATIVO}
                            <small>Status: <b>${r.STATUS}</b></small>
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
                            <button class="btn btn-info btn-md btn-circle hand shadow"
                            onclick="fcn_editar_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.NOMCLIE}','${r.DIRCLIE}')">
                                    <i class="fal fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `
            })
            container.innerHTML = str;
            document.getElementById('lbFacTotalPedidos').innerText = `Facturas: ${contador}`;
            document.getElementById('lbFacTotalImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;
    
        })
        .catch((err)=>{
            console.log('error:')
            console.log(err)

            container.innerHTML = 'No se cargaron datos....';
            document.getElementById('lbFacTotalPedidos').innerText = '';
            document.getElementById('lbFacTotalImporte').innerText = '';
        })
    
    
    


}


function rpt_tbl_productos_embarque(){

    let container = document.getElementById('tblDataFProductos');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;


    let fi = F.devuelveFecha('txtProdFechaInicial');
    let ff = F.devuelveFecha('txtProdFechaFinal');

    

    GF.get_data_embarque_productos_vendedor(GlobalEmpnit,fi,ff,GlobalCodUsuario)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
         
            contador +=1;
            varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td>${r.CODPROD}
                    <br>
                        <small class="hidden">${r.TOTALUNIDADES}</small>
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


function rpt_tbl_marcas(){

    let container = document.getElementById('tblDataMarcas');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

    let fi = F.devuelveFecha('txtMarcaFechaInicial');
    let ff = F.devuelveFecha('txtMarcaFechaFinal');

 
    GF.get_data_marcas_vendedor(GlobalEmpnit,fi,ff,GlobalCodUsuario)
    .then((data)=>{

   
        let str = '';

        data.recordset.map((r)=>{
        
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            str += `
                <tr>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
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


    /*
    str += `
                <tr>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                    <td>${F.setMoneda((Number(r.OBJETIVO)-Number(r.TOTALPRECIO)),'Q')}</td>
                    <td class="negrita">${F.setMoneda((Number(r.OBJETIVO)/Number(r.TOTALPRECIO)) * 100,'')}%</td>
                </tr>
            `
    */


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



function rpt_goles_resumen(){

    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;

    let container = document.getElementById('tblDataGoles');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;


    GF.get_data_goles_resumen_mes(GlobalEmpnit,GlobalCodUsuario,mes,anio)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            varTotal += Number(r.CONTEO);
            str+= `
            <tr>
                <td>${r.DESPROD}
                    <br>
                    <small>${r.CODPROD}</small>
                </td>
                <td>${r.CONTEO}</td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalGoles').innerText = varTotal;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbTotalGoles').innerText = '';
    })




};







// ------------------------ logro marcas

function get_data_logro_marcas(sucursal,mes,anio,codemp){

     return new Promise((resolve,reject)=>{

            let url = '';
                url = '/objetivos/select_logro_marcas_vendedor'
            
            axios.post(GlobalUrlCalls + url, {
                    token:TOKEN,
                    sucursal:sucursal,
                    mes:mes,
                    anio:anio,
                    codemp:codemp})
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
function tbl_logro_marcas(sucursal){

    let empleado = GlobalCodUsuario;//document.getElementById('cmb_objetivos_vendedores').value;

    let container = document.getElementById('tblDataMarcas2');
    container.innerHTML = GlobalLoader;

    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;


    let conteo = 0;
    let varTotalObjetivo =0; let varTotalImporte = 0; 
    let varTotalFaltan = 0; let varTotalLogro = 0;


  
           get_data_logro_marcas(sucursal,mes,anio,empleado)
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
// ------------------------ logro marcas



// ------------------------------------------------
// ------------------------------------------------
//OBTIENE EL DETALLE DE CATEGORIAS DE LA MARCA

function get_detalle_marca(codmarca,desmarca){


    $("#modal_categorias_marca").modal('show');

    document.getElementById('lbMarcasDescategoria').innerText = desmarca;
    
    tbl_logro_categorias_marca(codmarca);



};
function get_data_logro_categorias_marcas(sucursal,codmarca,mes,anio){

    return new Promise((resolve,reject)=>{


        let url = '';
        let empleado = GlobalCodUsuario; //document.getElementById('cmb_objetivos_vendedores').value;
        
            url = '/objetivos/select_logro_vendedores_categorias';
        

            axios.post(GlobalUrlCalls + url, {
                    token:TOKEN,
                    sucursal:sucursal,
                    codmarca:codmarca,
                    mes:mes,
                    anio:anio,
                    codemp:empleado})
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


    let sucursal = GlobalEmpnit; //document.getElementById('cmbSucursal').value;
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
    .catch((err)=>{

        console.log(err);

        container.innerHTML = 'No se cargaron datos...';

        document.getElementById('lbTotalMarcaObjetivo').innerHTML = '';
        document.getElementById('lbTotalMarcaLogro').innerHTML = '';
        document.getElementById('lbTotalMarcaFaltan').innerHTML = '';
    })


};

//OBTIENE EL DETALLE DE CATEGORIAS DE LA MARCA
// ------------------------------------------------
// ------------------------------------------------





function get_logro_empleado(codemp,nombre){


   
    tbl_clientes_empleado(codemp);
    


};
function tbl_clientes_empleado(codemp){

    let container = document.getElementById('tblDataEmpleado');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;

    GF.data_clientes_no_visitados_empleado('',codemp)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            varTotal+=1;
            str += `
                <tr>
                    <td>${r.VISITA}</td>
                    <td>${r.TIPONEGOCIO}-${r.NEGOCIO}
                        <br>
                        ${r.NOMBRE}
                    </td>
                    <td>${r.DIRECCION}
                        <br>
                        <small>${r.MUNICIPIO}</small>
                        <br>
                        <small>${r.ALDEA}</small>
                    </td>
                    <td>${F.convertDateNormal(r.LASTSALE)}</td>
                    <td>
                        <button class="btn btn-md btn-circle btn-info hand shadow"
                        onclick="F.gotoGoogleMaps('${r.LATITUD}','${r.LONGITUD}')">
                            <i class="fal fa-map"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-md btn-circle btn-secondary hand shadow"
                        onclick="F.phone_call('${r.TELEFONO}')">
                            <i class="fal fa-phone"></i>
                        </button>
                    </td>
                </tr>
            `
        })
         container.innerHTML = str;
        document.getElementById('lbEmpleadoTotal').innerText = `Visitados: ${varTotal}`;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
        document.getElementById('lbEmpleadoTotal').innerText = '';
    })




};
function rpt_cobertura_marcas_empleado(codemp){

    let sucursal = GlobalEmpnit;
    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;


    let container = document.getElementById('tblDataMarcasEmpleadoCobertura');
    container.innerHTML = GlobalLoader;

        let varTotalConteo = 0;
        let varTotalImporte = 0;
        let varTotalGoles = 0;

            GF.data_cobertura_goles_marcas_empleado(sucursal,mes,anio,codemp)
            .then((data)=>{

                let str = '';
                data.recordset.map((r)=>{
                    varTotalConteo += Number(r.COBERTURA);
                    varTotalGoles += Number(r.GOLES);
                    varTotalImporte += Number(r.COBERTURA_IMPORTE);
                    str+=`
                    <tr>
                        <td>${r.DESMARCA}</td>
                        <td>${r.COBERTURA}</td>
                        <td>${r.GOLES}</td>
                        <td>${F.setMoneda(r.COBERTURA_IMPORTE,'Q')}</td>
                        <td>
                            <button class="hidden btn btn-md btn-circle btn-primary hand shadow"
                            onclick="">
                                <i class="fal fa-list"></i>
                            </button>
                        </td>
                    </tr>
                    `
                })
                container.innerHTML = str;
                document.getElementById('lbTotalMarcaVisitadosEmpleado').innerText = varTotalConteo;
                
                document.getElementById('lbTotalMarcaGolesEmpleado').innerText = varTotalGoles;
                
                document.getElementById('lbTotalMarcaImporteEmpleado').innerText = F.setMoneda(varTotalImporte,'Q');
                
            })
            .catch((err)=>{
                console.log(err);
                container.innerHTML = 'No se cargaron datos...';
                document.getElementById('lbTotalMarcaVisitadosEmpleado').innerText = '';
                document.getElementById('lbTotalMarcaGolesEmpleado').innerText = '';
                document.getElementById('lbTotalMarcaImporteEmpleado').innerText = '';
            })

  
   

};

