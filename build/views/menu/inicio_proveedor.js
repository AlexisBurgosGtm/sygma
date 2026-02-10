
function getView(){
    let view = {
        body:()=>{
            return `
            <div class="card card-rounded shadow col-12 bg-base text-white">
                <div class="card-body p-4">
                   
                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-white text-center">INICIO PROCTER</h4>
                        </div>
                        <div class="col-6">
                            <select class="form-control negrita" id="cmbSucursal">
                            </select>
                        </div>
                   </div>


                </div>
            </div>
            <br>
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.menu()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           ${view.vista_vendedores()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_marcas()}
                        </div>
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_sellout()}
                        </div>
                        <div class="tab-pane fade" id="cinco" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_inventarios() + view.modal_sellout_config()}
                        </div>
                        <div class="tab-pane fade" id="seis" role="tabpanel" aria-labelledby="home-tab">
                            ${view.objetivos()}
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
        menu:()=>{
            return `
            
            <div class="row">
                <div class="col-sm-12 col-md-3 col-xl-3 col-lg-3">
                    
                    <div class="card card-rounded border-info  bg-white shadow col-12 hand" id="btnMenuVentasVendedor">
                        <div class="card-body p-4">

                            <h4 class="text-info">VENTAS POR VENDEDOR</h4>
                          
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
                <div class="col-sm-12 col-md-3 col-xl-3 col-lg-3">

                    <div class="card card-rounded border-secondary  bg-white shadow col-12 hand" id="btnMenuVentasMarcas">
                        <div class="card-body p-4">

                            <h4 class="text-secondary">VENTAS POR MARCA</h4>
                          
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
                <div class="col-sm-12 col-md-3 col-xl-3 col-lg-3">
                
                    <div class="card card-rounded border-success  bg-white shadow col-12 hand" id="btnMenuVentasSellout">
                        <div class="card-body p-4">

                            <h4 class="text-success">SELL OUT</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-chart-pie negrita text-success" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                
                </div>

                <div class="col-sm-12 col-md-3 col-xl-3 col-lg-3">

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

                </div>
            </div>

            <br>

            <div class="row">
                <div class="col-sm-12 col-md-3 col-xl-3 col-lg-3">
                
                    <div class="card card-rounded border-danger  bg-white shadow col-12 hand" id="btnMenuObjetivosLogro">
                        <div class="card-body p-4">

                            <h4 class="text-danger">LOGRO P&G</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-chart-pie negrita text-danger" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                
                
                </div>
                <div class="col-sm-12 col-md-3 col-xl-3 col-lg-3">

                    <div class="card card-rounded   bg-white shadow col-12 hand" id="btnMenuRptVisitasMapa">
                        <div class="card-body p-4">

                            <h4 class="">VISITAS VENDEDOR MAPA</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-map-signs negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                <div class="col-sm-12 col-md-3 col-xl-3 col-lg-3">
                
                    <div class="card card-rounded border-base  bg-white shadow col-12 hand" id="btnMenuObjetivos">
                        <div class="card-body p-4">

                            <h4 class="text-base">OBJETIVOS</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-list negrita text-base" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                
                
                </div>
                <div class="col-sm-12 col-md-3 col-xl-3 col-lg-3">
                
                    <div class="card card-rounded border-secondary  bg-white shadow col-12 hand" id="btnMenuInventarioRetroactivo">
                        <div class="card-body p-4">

                            <h4 class="text-secondary">INVENTARIO RETROACTIVO</h4>
                          
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
                <div class="col-sm-12 col-md-3 col-xl-3 col-lg-3">
                
                    <div class="card card-rounded border-base  bg-white shadow col-12 hand" id="btnMenuGps">
                        <div class="card-body p-4">
                            <h4 class="text-base">LOCALIZACION VENDEDORES (GPS)</h4>
                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-map negrita text-base" style="font-size:250%"></i>
                                </div>
                            </div>
                        </div>
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
        vista_vendedores:()=>{
            return `
             <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                   
                    <h3 class="negrita text-center text-info">VENTAS POR VENDEDOR</h3>

                    <br>
                    <div class="row">
                        <div class="col-sm-12 col-md-8 col-lg-8 col-xl-8">
                            
                            <div class="form-group">
                                <label class="negrita">Seleccione mes y año</label>
                                
                                <div class="input-group">
                                    <select class="negrita form-control" id="cmbVMes">
                                    </select>
                                    <select class="negrita form-control" id="cmbVAnio">
                                    </select>
                                </div>

                            </div>

                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">

                            <h1 class="negrita text-danger" id="lbTotalVImporte">--</h1>

                        </div>

                    </div>

                    

                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                    
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">

                            <div class="table-responsive">

                                <table class="table table-bordered h-full col-12" id="tblVendedores">
                                    <thead class="bg-info text-white negrita">
                                        <tr>
                                            <td>VENDEDOR</td>
                                            <td>TELEFONO</td>
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

                </div>
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">

                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">

                            <h5 class="negrita text-info" id="lbVendedorMarcas"></h5>

                            <div class="table-responsive">
                                <table class="table h-full table-bordered col-12" id="tblVendedorMarcas">
                                    <thead class="bg-secondary text-white negrita">
                                        <tr>
                                            <td>MARCA</td>
                                            <td>IMPORTE</td>
                                          
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataVendedorMarcas"></tbody>
                                </table>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            


            <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        vista_marcas:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                   
                    <h3 class="negrita text-center text-secondary">VENTAS POR MARCAS</h3>

                                        <br>
                    <div class="row">
                        <div class="col-sm-12 col-md-8 col-lg-8 col-xl-8">
                            
                            <div class="form-group">
                                <label class="negrita">Seleccione mes y año</label>
                                
                                <div class="input-group">
                                    <select class="negrita form-control" id="cmbMMes">
                                    </select>
                                    <select class="negrita form-control" id="cmbMAnio">
                                    </select>
                                </div>

                            </div>

                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">

                            <h1 class="negrita text-danger" id="lbTotalMImporte">--</h1>

                        </div>

                    </div>



                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4">
                    
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">

                   

                            <div class="table-responsive">
                                <table class="table h-full table-bordered col-12" id="tblMarcas">
                                    <thead class="bg-secondary text-white negrita">
                                        <tr>
                                            <td>MARCA</td>
                                            <td>IMPORTE</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataMarcas"></tbody>
                                </table>
                            </div>
                        

                        </div>
                    </div>

                </div>
                <div class="col-sm-12 col-md-8 col-xl-8 col-lg-8">

                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">
                                
                            <div class="row">
                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <h2 class="negrita text-danger" id="lbMarcasProductos"></h2>
                                </div>
                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <div class="form-group">
                                        <input type="text" class="form-control negrita"
                                            placeholder="Escriba para buscar..."
                                            id="txtMarcasBuscarProd"
                                            oninput="F.FiltrarTabla('tblMarcasProductos','txtMarcasBuscarProd')"
                                        >
                                    </div>
                                    
                                </div>
                            </div>

                            <br>
                            <div class="table-responsive">
                                
                                <table class="table h-full table-bordered col-12" id="tblMarcasProductos">
                                    <thead class="bg-secondary text-white negrita">
                                        <tr>
                                            <td>CODIGO DUN</td>
                                            <td>CODIGO EAN</td>
                                            <td>PRODUCTO</td>
                                            <td>CAJAS</td>
                                            <td>IMPORTE</td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataMarcasProductos"></tbody>
                                </table>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
           

            
            <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
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
                            <button class="btn btn-success btn-md hand shadow" onclick="F.exportTableToExcel('tblSellout','SellOut')">
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
        rpt_inventarios:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-4">
                    
                    <h3 class="negrita text-danger">INVENTARIO ACTUAL</h3>

                    <div class="row">
                        <div class="col-sm-6 col-md-8 col-lg-8 col-xl-8">
                            <div class="input-group">
                                <select class="form-control negrita text-base" id="cmbSt">
                                    <option value="SI">PRODUCTOS HABILITADOS</option>
                                    <option value="NO">PRODUCTOS NO HABILITADOS</option>
                                </select>
                                <input type="text" class="form-control" placeholder="Escriba para buscar..." id="txtBuscarProductoInventario" oninput="F.FiltrarTabla('tblInventario','txtBuscarProductoInventario')">

                            </div>

                            
                        </div>
                        
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <button class="btn btn-success btn-md hand shadow" id="btnExportarInventario">
                                <i class="fal fa-share"></i> Exportar Excel
                            </button>
                        </div>
                    </div>

                    <br>

                    <div class="table-responsive col-12">
                        <table class="table h-full table-hover col-12" id="tblInventario">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>CODIGO</td>
                                    <td>CODIGO 2</td>
                                    <td>CODIGO 3</td>
                                    <td>PRODUCTO</td>
                                    <td>MARCA</td>
                                    <td>TOTALCOSTO</td>
                                    <td>EXISTENCIA (CAJAS)</td>
                                    <td>SELLOUT</td>
                                    <td>MESES_INV</td>
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

            <button class="btn btn-warning btn-xl btn-circle hand shadow btn-bottom-r" id="btnSOConfigModal">
                <i class="fal fa-cog"></i>
            </button>

            `
        },
        modal_sellout_config:()=>{
            return `
              <div id="modal_sellout_config" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Configuracion de Promedio SellOut
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                        <div class="form-group">
                                            <label>Seleccione el Año</label>
                                            <select class="form-control negrita" id="cmbSOAnio">
                                            </select>
                                        </div>

                                        <div class="form-group">
                                            <label>Seleccione el Mes Inicial</label>
                                            <select class="form-control negrita" id="cmbSOMesInicial">
                                            </select>
                                        </div>

                                        <div class="form-group">
                                            <label>Seleccione el Mes Final</label>
                                            <select class="form-control negrita" id="cmbSOMesFinal">
                                            </select>
                                        </div>

                                        <div class="form-group">
                                            <label>Ultimo SellOut generado</label>
                                            <input type="text" class="form-control negrita" id="txtSOObs" disabled="true">
                                        </div>

                                        <br>
                                        <div class="row">
                                            <div class="col-6">
                                                <button class="btn btn-secondary btn-xl btn-circle hand shadow" id="" data-dismiss="modal">
                                                    <i class="fal fa-arrow-left"></i>
                                                </button>
                                            </div>
                                            <div class="col-6">
                                                <button class="btn btn-xl btn-info btn-circle hand shadow" id="btnConfigSellout">
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

            
            <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>

            ${view.modal_categorias_marca()}
            `
        },
        frag_parametros: ()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                    
                    <h3 class="negrita text-danger">Logro de Objetivos</h3>

                    <div class="row">
                        <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                            
                        </div>
                        <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
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
                        <table class="table h-full table-hover col-12">
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
                        <table class="table h-full table-hover col-12">
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
                                                    <td>OBJETIVO</td>
                                                    <td>LOGRO</td>
                                                    <td>FALTAN</td>
                                                    <td></td>
                                                </tr>
                                            </thead>
                                            <tbody id="tblDataCategoriasMarca"></tbody>
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
    
    document.title = `Proveedor - ${GlobalNomEmpresa}`;

  
    selected_tab = ''; //VENTAS_VENDEDOR,VENTAS_MARCAS,SELLOUT,INVENTARIOS,OBJETIVOS

    let cmbSucursal = document.getElementById('cmbSucursal');
    

    //bloqueo los controles para que no cargue nada
    document.getElementById('btnMenuVentasVendedor').disbled = true;
    document.getElementById('btnMenuVentasMarcas').disabled = true;
    document.getElementById('btnMenuVentasSellout').disabled = true;


    GF.get_data_empresas()
        .then((data)=>{
            let str = '<option value="%">TODAS LAS SEDES</option>';
            data.recordset.map((r)=>{
                str += `
                    <option value="${r.EMPNIT}">${r.NOMBRE}</option>
                `
            })
            cmbSucursal.innerHTML = str;
            document.getElementById('btnMenuVentasVendedor').disbled = false;
            document.getElementById('btnMenuVentasMarcas').disabled = false;
            document.getElementById('btnMenuVentasSellout').disabled = false;
            
            cmbSucursal.addEventListener('change',()=>{
                //document.getElementById('tab-uno').click();
                get_grid_tab();
            })
        })
        .catch(()=>{
            cmbSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
        })
        
      

    //iniciales
    document.getElementById('cmbVMes').innerHTML = F.ComboMeses();  
    document.getElementById('cmbMMes').innerHTML = F.ComboMeses();
    document.getElementById('cmbVAnio').innerHTML = F.ComboAnio();
    document.getElementById('cmbMAnio').innerHTML = F.ComboAnio();
   
    document.getElementById('cmbVMes').value = F.get_mes_curso();  
    document.getElementById('cmbMMes').value = F.get_mes_curso();
    document.getElementById('cmbVAnio').value = F.get_anio_curso();
    document.getElementById('cmbMAnio').value = F.get_anio_curso();
   

    document.getElementById('txtSFechaInicial').value = F.getFecha();
    document.getElementById('txtSFechaFinal').value = F.getFecha();
    

    document.getElementById('cmbSOMesInicial').innerHTML = F.ComboMeses();document.getElementById('cmbSOMesInicial').value=F.get_mes_curso();
    document.getElementById('cmbSOMesFinal').innerHTML = F.ComboMeses();document.getElementById('cmbSOMesFinal').value=F.get_mes_curso();
    document.getElementById('cmbSOAnio').innerHTML = F.ComboAnio(); document.getElementById('cmbSOAnio').value = F.get_anio_curso();


    // inciales
    //----------------------------------


    

    document.getElementById('btnMenuRptVisitasMapa').addEventListener('click',()=>{

        Menu.objetivos_visitas_gps();

    });

   


    //--------------------------------


    // ventas vendedor

    document.getElementById('btnMenuVentasVendedor').addEventListener('click',()=>{
        
        document.getElementById('tab-dos').click();

        selected_tab = 'VENTAS_VENDEDOR';

        tbl_rpt_vendedores();

    })

    document.getElementById('cmbVMes').addEventListener('change',()=>{
        tbl_rpt_vendedores();
    });

    document.getElementById('cmbVAnio').addEventListener('change',()=>{
        tbl_rpt_vendedores();
    });




    // ventas vendedor
    //---------------------------------


    // marcas

    document.getElementById('btnMenuVentasMarcas').addEventListener('click',()=>{

        document.getElementById('tab-tres').click();

        selected_tab = 'VENTAS_MARCAS';
        
        tbl_rpt_marcas();

    })


    document.getElementById('cmbMMes').addEventListener('change',()=>{
        tbl_rpt_marcas();
    });

    document.getElementById('cmbMAnio').addEventListener('change',()=>{
        tbl_rpt_marcas();
    });


    // marcas
    


    //sell out
    document.getElementById('btnMenuVentasSellout').addEventListener('click',()=>{

        document.getElementById('tab-cuatro').click();

        selected_tab = 'SELLOUT';
        
        tbl_rpt_sellout();

    })


    document.getElementById('txtSFechaInicial').addEventListener('change',()=>{
        tbl_rpt_sellout();
    })
    document.getElementById('txtSFechaFinal').addEventListener('change',()=>{
        tbl_rpt_sellout();
    })

    //sell out



    // inventarios

    document.getElementById('btnExportarInventario').addEventListener('click',()=>{
        F.exportTableToExcel('tblInventario','Inventario');
    });

    document.getElementById('btnMenuRptInventario').addEventListener('click',()=>{

        document.getElementById('tab-cinco').click();

        selected_tab = 'INVENTARIOS';
        

        tbl_inventario();
    });


    document.getElementById('cmbSt').addEventListener('change',()=>{
        tbl_inventario();
    });


    document.getElementById('cmbSOAnio').addEventListener('change',()=>{
        get_config_obs_sellout();
    });
    document.getElementById('cmbSOMesInicial').addEventListener('change',()=>{
        get_config_obs_sellout();
    });
    document.getElementById('cmbSOMesFinal').addEventListener('change',()=>{
        get_config_obs_sellout();
    });


    document.getElementById('btnSOConfigModal').addEventListener('click',()=>{

        let sucursal = document.getElementById('cmbSucursal').value;
        if(sucursal=='%'){F.AvisoError('Seleccione una sede para configurar SELLOUT');return;}

        $('#modal_sellout_config').modal('show');
        
        document.getElementById('txtSOObs').value = data_config_general[2].OBS;

    })

    let btnConfigSellout = document.getElementById('btnConfigSellout');
    btnConfigSellout.addEventListener('click',()=>{

        F.Confirmacion('¿Esta seguro que desea GENERAR el SellOut con estos parametros?')
        .then((value)=>{
            if(value==true){

                let sucursalSO = document.getElementById('cmbSucursal').value;
                let mi = document.getElementById('cmbSOMesInicial').value;
                let mf = document.getElementById('cmbSOMesFinal').value;
                let anio = document.getElementById('cmbSOAnio').value;
                let obs = document.getElementById('txtSOObs').value;
                

                    btnConfigSellout.disabled = true;
                    btnConfigSellout.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                    GF.get_data_inventarios_sellout_config(sucursalSO,mi,mf,anio,obs)
                    .then(()=>{
                        
                        F.Aviso('SellOut establecido exitosamente!!');
                        
                        tbl_inventario();

                        btnConfigSellout.disabled = false;
                        btnConfigSellout.innerHTML = `<i class="fal fa-save"></i>`;
                    
                    })
                    .catch(()=>{
                      
                        btnConfigSellout.disabled = false;
                        btnConfigSellout.innerHTML = `<i class="fal fa-save"></i>`;

                    })




            }
        })
        
     





        



    });

     // inventarios

     document.getElementById('btnMenuObjetivosLogro').addEventListener('click',()=>{

        Menu.objetivos_logro_procter();

     })

     document.getElementById('btnMenuInventarioRetroactivo').addEventListener('click',()=>{
        Menu.bodega_inv_retroactivo();
     })


    // empleados gps
    document.getElementById('btnMenuGps').addEventListener('click',()=>{
        Menu.empleados_gps();
     })

     listeners_objetivos();

};

function get_grid_tab(){
  
        //selected_tab = ''; 
        //VENTAS_VENDEDOR,VENTAS_MARCAS,SELLOUT,INVENTARIOS,OBJETIVOS

    switch (selected_tab) {
        case 'VENTAS_VENDEDOR':
            tbl_rpt_vendedores();

            break;
        case 'VENTAS_MARCAS':
            tbl_rpt_marcas();

            break;
        case 'SELLOUT':
            tbl_rpt_sellout();

            break;
        case 'INVENTARIOS':
            tbl_inventario();

            break;
        case 'OBJETIVOS':
            get_reportes();

            break;

    }

};

function get_config_obs_sellout(){

    let mes_inicial = document.getElementById('cmbSOMesInicial').value;
    let mes_final = document.getElementById('cmbSOMesFinal').value;
    let anio = document.getElementById('cmbSOAnio').value;
    

    document.getElementById('txtSOObs').value = `Sellout del mes ${mes_inicial} al mes ${mes_final} del año ${anio}`;


};



function initView(){

    getView();
    addListeners();

};




function tbl_rpt_vendedores(){

    let mes = document.getElementById('cmbVMes').value;
    let anio = document.getElementById('cmbVAnio').value;

    let container = document.getElementById('tblDataVendedores');
    container.innerHTML = GlobalLoader;

    let sucursal = document.getElementById('cmbSucursal').value;

    let varTotal = 0;

    RPT.data_ventas_vendedor(sucursal,mes,anio)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            varTotal += Number(r.TOTALPRECIO);
            str += `
                <tr>
                    <td>${r.EMPLEADO}</td>
                    <td>${r.TELEFONO}</td>
                    <td>${r.CONTEO}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    <td>
                        <button class="btn btn-info btn-md hand shadow btn-circle"
                        onclick="get_rpt_marcas_vendedor('${r.CODEMP}', '${r.EMPLEADO}','${mes}', '${anio}')">
                            <i class="fal fa-arrow-right"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        
        container.innerHTML = str;
        document.getElementById('lbTotalVImporte').innerText = `Total: ${F.setMoneda(varTotal,'Q')}`;
    })
    .catch(()=>{
        
        container.innerHTML = 'No se cargaron datos...';
        document.getElementById('lbTotalVImporte').innerText = '';

    })


};


function get_rpt_marcas_vendedor(codemp,nombre,mes,anio){

    document.getElementById('lbVendedorMarcas').innerText = nombre;

    let container = document.getElementById('tblDataVendedorMarcas');
    container.innerHTML = GlobalLoader;
    
    let varTotal = 0;

    let sucursal = document.getElementById('cmbSucursal').value;


    RPT.data_ventas_vendedor_marcas(sucursal,codemp,mes,anio)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
        
            varTotal += Number(r.TOTALPRECIO);
            str += `
                <tr>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                
                </tr>
            `
        })
        container.innerHTML = str;
       
        //document.getElementById('lbTotalMImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((err)=>{
       console.log(err)

        container.innerHTML = 'No se cargaron datos....';
       
        //document.getElementById('lbTotalMImporte').innerText = '';
    })



};






function tbl_rpt_marcas(){


    let mes = document.getElementById('cmbMMes').value;
    let anio = document.getElementById('cmbMAnio').value;


    let container = document.getElementById('tblDataMarcas');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

    let sucursal = document.getElementById('cmbSucursal').value;

   
    RPT.data_marcas(sucursal,mes,anio)
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
                        onclick="tbl_rpt_marcas_productos('${r.CODMARCA}','${r.DESMARCA}',${mes},${anio})">
                                <i class="fal fa-arrow-right"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
       
        document.getElementById('lbTotalMImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((err)=>{
       

        container.innerHTML = 'No se cargaron datos....';
       
        document.getElementById('lbTotalMImporte').innerText = '';
    })


};

function tbl_rpt_marcas_productos(codmarca,desmarca,mes,anio){


    document.getElementById('lbMarcasProductos').innerText = desmarca;

    let container = document.getElementById('tblDataMarcasProductos');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

   
    let sucursal = document.getElementById('cmbSucursal').value;


    RPT.data_marcas_productos(sucursal,codmarca,mes,anio)
    .then((data)=>{

   
        let str = '';

        data.recordset.map((r)=>{
        
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            str += `
                <tr>
                    <td>${r.CODPROD2}</td>
                    <td>${r.CODIGO_EAN}</td>
                    <td>${r.DESPROD}</td>
                    <td>${F.setMoneda(r.CAJAS,'')}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'')}</td>
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


function tbl_rpt_sellout(){

    let fi = F.devuelveFecha('txtSFechaInicial');
    let ff = F.devuelveFecha('txtSFechaFinal');


    let container = document.getElementById('tblDataSellout');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

    let sucursal = document.getElementById('cmbSucursal').value;

   
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




function tbl_inventario(){

    let container = document.getElementById('tblDataInventario');
    container.innerHTML = GlobalLoader;

    let st = document.getElementById('cmbSt').value;

    let sucursal = document.getElementById('cmbSucursal').value;


    GF.get_data_inventarios_general(sucursal,st)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{

            let SELLOUT = F.get_existencia(Number(r.SELLOUT),Number(r.UXC)).toFixed(2);
            let CAJAS = F.get_existencia(Number(r.TOTALUNIDADES),Number(r.UXC)).toFixed(2);

            str += `
            <tr>
                <td>${r.CODPROD}</td>
                <td>${r.CODPROD2}</td>
                <td>${r.DESPROD3}</td>
                <td>${r.DESPROD}</td>
                <td>${r.DESMARCA}</td>
                <td>${F.setMoneda((Number(r.TOTALUNIDADES)*Number(r.COSTO)),'Q')}</td>
                <td>${CAJAS}</td>

                <td>${SELLOUT}</td>
                <td>${F.get_existencia(Number(CAJAS),Number(SELLOUT)).toFixed(2)}</td>
            </tr>
            `
        })
        container.innerHTML = str;

        //F.initit_datatable('tblInventario', true);

    })
    .catch(()=>{

        container.innerHTML = 'No se cargaron datos...';
    })


    

};








//OBJETIVOS

function listeners_objetivos(){


    document.getElementById('btnMenuObjetivos').addEventListener('click',()=>{

        document.getElementById('tab-seis').click();

        selected_tab = 'OBJETIVOS';

        get_reportes();

    });


    
    let cmbSucursal = document.getElementById('cmbSucursal');

   
    document.getElementById('cmbMes').innerHTML = F.ComboMeses();
    document.getElementById('cmbMes').value = F.get_mes_curso();

    document.getElementById('cmbAnio').innerHTML = F.ComboAnio();
    document.getElementById('cmbAnio').value = F.get_anio_curso();



    //cmbSucursal.addEventListener('change',()=>{ get_reportes(); });
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
            
            varTotalObjetivo += Number(r.OBJETIVO);
            varTotalImporte += Number(r.TOTALPRECIO);
            varTotalFaltan += Number(varFaltan);
            varTotalLogro += Number(varLOGRO);

            str += `
            <tr class="hand" onclick="get_detalle_marca('${r.CODIGO_MARCA}','${r.MARCA}')">
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

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';

        document.getElementById('lbTotalMarcasImporte').innerHTML = '';
        document.getElementById('lbTotalMarcasObjetivo').innerHTML =''; 
        document.getElementById('lbTotalMarcasFalta').innerHTML = '';
        document.getElementById('lbTotalMarcasLogro').innerHTML = '';
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
            
            varTotalObjetivo += Number(r.OBJETIVO);
            varTotalImporte += Number(r.TOTALPRECIO);
            varTotalFaltan += Number(varFaltan);
            varTotalLogro += Number(varLOGRO);

            str += `
            <tr class="hand" onclick="get_detalle_vendedor('${r.CODIGO_VENDEDOR}','${r.VENDEDOR}')">
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

//OBJETIVOS


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



    get_data_logro_categorias_marcas(sucursal,codmarca,mes,anio)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
           
            let varLOGRO = ((Number(r.TOTALPRECIO)/Number(r.OBJETIVO))*100);
           
            str += `
            <tr>
                <td>${r.CATEGORIA}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td>${F.setMoneda((Number(r.OBJETIVO)-Number(r.TOTALPRECIO)),'Q')}</td>
                <td>${varLOGRO.toFixed(2)}%</td>
            </tr>
            `
        })
        container.innerHTML = str;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
    })


};