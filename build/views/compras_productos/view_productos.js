function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado() + view.modal_opciones_producto() + view.modal_opciones_producto_deshabilitar_medidas()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_ficha_producto() + view.modal_nuevo_precio() + view.modal_medidas() + view.modal_sucursales_precio() + view.modal_marcas()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_movimientos_kardex()}
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
        vista_listado:()=>{
            return `
            <div class="card card-rounded col-12 border-base">
                <div class="card-body p-4">

                    <div class="row">
                        <div class="col-3">
                            <img src="./favicon.png" width="50px" height="50px">
                        </div>    
                        <div class="col-3">
                            <h5 class="text-base negrita">Catálogo de Productos</h5>
                            
                            <select class="form-control" id="cmbTipoLista">
                                <option value="SI" class="negrita text-info">HABILITADOS</option>
                                <option value="NO" class="negrita text-danger">DESHABILITADOS</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label>Total Productos</label>
                                <h4 class="negrita text-danger" id="lbTotalProductos"></h4>
                            </div>
                        </div>
                      
                    </div>    

                </div>
            </div>
            <br>
            <div class="card card-rounded col-12 border-base">
                <div class="card-body p-2">

                    <div class="form-group">
                        <label>Búsqueda de productos</label>
                        <div class="input-group">
                            <input type="text" class="form-control border-base negrita text-base" placeholder="Escriba para filtrar..." id="txtBuscar" autocomplete="off">
                            <button class="btn btn-success btn-md hand" id="btnExportar">
                                <i class="fal fa-share"></i>Excel
                            </button>
                        </div>
                    </div>
                    <table class="table table-responsive h-full" id="tblProductos">
                        <thead class="bg-base text-white f-med">
                            <tr>
                                <td>CÓDIGO</td>
                                 <td>CÓDIGO DUN</td>
                                <td>DESCRIPCIÓN</td>
                                <td>DESCRIPCIÓN 2</td>
                                <td>MARCA</td>
                                <td>TIPO PROD</td>
                                <td>COSTO ULTIMO/ANTERIOR</td>
                                <td>B/S</td>
                                <td>ACT</td>
                            </tr>
                        </thead>
                        <tbody id="tblDataProductos">

                        </tbody>
                    </table>
                
                </div>
            </div>

            <button class="btn btn-verde btn-bottom-r btn-circle btn-xl hand shadow" id="btnNuevoProducto">
                <i class="fal fa-plus"></i>
            </button>

         

            `
        },
        modal_opciones_producto:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" id="modal_menu_producto">
                <div class="modal-dialog modal-dialog-left modal-lg">
                    <div class="modal-content">
                        <div class="dropdown-header bg-base d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white">
                                 Opciones del Producto
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            <h3 id="lbDetDesprod">DESPROD</h3>
                            <small class="negrita text-danger" id="lbDetCodprod">0001</small>
                            
                            <hr class="solid">
                                <div class="row">

                                    <div class="col-6">
                                        
                                            <button class="btn btn-circle btn-outline-info" id="btnProdMenEditar">
                                                <i class="fal fa-edit"></i>
                                            </button>  <b class="text-info hand">Editar Producto</b>
                                        <hr class="solid">
                                            <button class="btn btn-circle btn-base" id="btnProdMenKardex">
                                                <i class="fal fa-list"></i>
                                            </button>  <b class="text-base hand">Kardex Movimientos</b>
                                        <hr class="solid">
                                        
                                            <button class="btn btn-circle btn-danger" id="btnProdMenEliminar">
                                                <i class="fal fa-trash"></i>
                                            </button>  <b class="text-danger hand">Eliminar</b>
                                        
                                    </div>

                                    <div class="col-6">
                                            <button class="btn btn-circle btn-base" id="btnProdMenVentas">
                                                <i class="fal fa-chart-pie"></i>
                                            </button>  <b class="text-base hand">Ventas por Fechas</b>
                                        
                                        <hr class="solid">
                                            <button class="btn btn-circle btn-outline-success" onclick="habilitar_medida_precio()">
                                                <i class="fal fa-dollar-sign"></i>
                                            </button>  <b class="text-success hand">Deshabilitar medidas Sucursales</b>
                                        
                                        <hr class="solid">
                                            <button class="btn btn-circle btn-warning" id="btnProdMenActivar">
                                                <i class="fal fa-sync"></i>
                                            </button>  <b class="text-warning hand">Activar/Desactivar</b>
                                        
                                    </div>

                                    
                                    
                                </div>
                                    
                            <br>

                            <div class="card card-rounded p-2">
                                <div class="card-body">

                                    <table class="table table-responsive h-full">
                                        <thead class="bg-base text-white">
                                            <tr>
                                                <td>MEDIDA</td>
                                                <td>EQ</td>
                                                <td>COSTO</td>
                                                <td>PÚBLICO</td>
                                                <td>PRECIO_A</td>
                                                <td>PRECIO_B</td>
                                                <td>PRECIO_C</td>
                                                <td>PRECIO_D</td>
                                                <td>PRECIO_E</td>
                                                <td>PRECIO_F</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataPreciosProd"></tbody>
                                    </table>

                                </div>
                            </div>

                           
                           
                        </div>
                        <div class="modal-footer text-left">

                            <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                <i class="fal fa-arrow-left"></i>
                            </button>

                        </div>
                       
                    </div>
                </div>
            </div>

            
            `
        },
        modal_opciones_producto_deshabilitar_medidas:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" 
                id="modal_menu_producto_deshabilitar_medida">
                <div class="modal-dialog modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="dropdown-header bg-success d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white">
                                 Medidas Deshabilitadas en otras Sedes
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                        

                            <div class="card card-rounded p-2">
                                <div class="card-body">

                                    <table class="table table-bordered h-full">
                                        <thead class="bg-success text-white">
                                            <tr>
                                                <td>SEDE</td>
                                                <td>ACTUAL</td>
                                                <td>CAMBIAR A</td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataDeshabilitarMedidas"></tbody>
                                    </table>

                                </div>
                            </div>

                           
                           
                        </div>
                        <div class="modal-footer text-left">

                            <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                <i class="fal fa-arrow-left"></i>
                            </button>

                        </div>
                       
                    </div>
                </div>
            </div>

            
            `
        },
        vista_ficha_producto:()=>{
            return `
            <h3 class="negrita text-danger">Datos del Producto</h3>
            <div class="row">

                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div class="card card-rounded col-12 border-base">
                            <div class="card-body p-4" style="font-size:80%">

                                    <div class="row">
                                        <div class="col-4">
                                            <label class="negrita text-base">Código Interno</label>
                                            <input type="text" class="form-control" id="txtCodprod" maxlength="50">
                                        </div>
                                        <div class="col-4">
                                           <label class="negrita text-base">Código Alterno (Barras)</label>
                                            <input type="text" class="form-control" id="txtCodprod2" maxlength="50">
                                        </div>
                                        <div class="col-4">
                                            <label class="negrita text-base">Codigo 3</label>
                                            <input type="text" class="form-control" id="txtDesprod3" maxlength="255">
                                        </div>
                                    </div>
                                                                       
                                    <br>
                                        <label class="negrita text-base">Descripción</label>
                                        <input type="text" class="form-control" id="txtDesprod" maxlength="255">
                                    <br>
                                        <label class="negrita text-base">Descripción 2</label>
                                        <input type="text" class="form-control" id="txtDesprod2" maxlength="255">
                                    
                                    <br>
                                     
                            </div>                   
                        </div>
                        
                        <br>

                <div class="row">
                    ${view.ficha_producto_clasificaciones()}
                </div>
            


                </div>
                
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        
                        ${view.ficha_producto_precios()}

                </div>
            </div>
            
         
           


            <button class="btn btn-secondary btn-bottom-l btn-xl btn-circle hand shadow" id="btnAtrasTabDos">
                <i class="fal fa-arrow-left"></i>
            </button>

            <button class="btn btn-info btn-bottom-r btn-xl btn-circle hand shadow" id="btnGuardarProducto">
                <i class="fal fa-save"></i>
            </button>

            <button class="btn btn-info btn-bottom-r btn-xl btn-circle hand shadow" id="btnGuardarProductoEditar">
                <i class="fal fa-save"></i>
            </button>

            
            `
        },
        ficha_producto_clasificaciones:()=>{
            return `
            <div class="card card-rounded col-12 border-base">
                <div class="card-body p-4" style="font-size:80%">

                    <label class="negrita text-base">Marca</label>
                    <div class="input-group">
                        <select class="form-control" id="cmbMarca">
                        </select>
                        <button class="btn btn-base hand" id="btnBuscarMarca">
                            <i class="fal fa-search"></i>
                        </button>
                    </div>

                    <br>
                    <label class="negrita text-base">Categoria (Tipo)</label>
                    <div class="input-group">
                        <select class="form-control" id="cmbTipoTipo">
                        </select>
                        
                    </div>
                   
                     <br>
                    <label class="negrita text-base">Tipo Rentabilidad</label>
                    <div class="input-group">
                        <select class="form-control" id="cmbTipoRentabilidad">
                        </select>
                      
                    </div>

                    

                    <br>
                    <label class="negrita text-base">Clasificación 2</label>
                    <div class="input-group">
                        <select class="form-control" id="cmbTipoLaboratorio">
                        </select>
                       
                    </div>
                                        
                    <br>
                    <label class="negrita text-base">Clasificación 3</label>
                    <div class="input-group">
                        <select class="form-control" id="cmbTipoImpulso">
                        </select>    
                        
                    </div>
                                        
                    <br>
                    <label class="negrita text-base">Clasificación 4</label>
                    <div class="input-group">
                        <select class="form-control" id="cmbTipoProgramaSalud">
                        </select>
                       
                    </div>

                    <br>
                    <label class="negrita text-base">Clasificación 5</label>
                    <div class="input-group">
                        <select class="form-control" id="cmbTipoRMMR">
                        </select>
                       
                    </div>

                    <br>
                    <label class="negrita text-base">Tipo Relleno</label>
                    <div class="input-group">
                        <select class="form-control" id="cmbTipoRelleno">
                        </select>
                       
                    </div>
                                        
                   
                </div>
            </div>
            `
        },
        ficha_producto_precios:()=>{
            return `
                        <div class="card card-rounded col-12 border-base">
                            <div class="card-body p-4"> 

                                
                                        <div class="row">
                                            <div class="col-sm-12 col-lg-4 col-xl-4 col-md-4">
                                                <label class="negrita text-base">Unidades por Caja (UxC)</label>
                                                <input type="number" class="form-control" id="txtUxc">
                                            </div>
                                            <div class="col-sm-12 col-lg-4 col-xl-4 col-md-4">
                                                <label class="negrita text-base">Tipo Contable</label>
                                                <select class="form-control" id="cmbTipoProd">
                                                    <option value="B">BIEN</option>
                                                    <option value="S">SERVICIO</option>
                                                </select>
                                            </div>
                                            <div class="col-sm-12 col-lg-4 col-xl-4 col-md-4">
                                                <label class="negrita text-base">Exento</label>
                                                <select class="form-control" id="cmbExento">
                                                    <option value="0">PAGA IVA (NO EXENTO)</option>
                                                    <option value="1">EXENTO (NO PAGA IVA)</option>
                                                </select>
                                            </div>
                                        </div>
                                                                                   
                                        <br><br>
                                            <label class="negrita text-base">Color Alerta</label>
                                            <select class="form-control" id="cmbColor">
                                                         
                                            </select>
                                        <br><br>


                                <h5 class="negrita text-danger">Gestión de Precios</h5>
                                <br>
                                <label class="negrita text-base">Costo Unitario</label>
                                <div class="input-group">
                                    <input type="number" class="form-control text-danger col-3 negrita" id="txtCosto">
                                    <button class="btn btn-success hand hidden" id="">
                                        <i class="fal fa-plus"></i>
                                    </button>
                                    <button class="btn btn-success hand" id="btnNuevoPrecio">
                                        <i class="fal fa-plus"></i> Nuevo Precio
                                    </button>
                                </div>
                                <br>

                                <table class="table table-responsive h-full">
                                    <thead class="bg-secondary text-white">
                                        <tr>
                                            <td>CODMEDIDA</td>
                                            <td>EQ</td>
                                            <td>COSTO</td>
                                            <td>PRECIO</td>
                                            <td>PRECIO_A</td>
                                            <td>PRECIO_B</td>
                                            <td>PRECIO_C</td>
                                            <td>PRECIO_D</td>
                                            <td>PRECIO_E</td>
                                            <td>PRECIO_F</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataPrecios"></tbody>
                                </table>

                            </div>
                        </div>
            `
        },
        modal_nuevo_precio:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" id="modal_nuevo_precio">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-base d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Nuevo Precio
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            <div class="row">
                                <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">

                                    <table class="table table-responsive h-full f-med">
                                        <thead class="negrita text-base">
                                            <tr>
                                                <td>MEDIDA_PRECIO</td>
                                                <td>EQUIVALE</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div class="input-group">
                                                        <select class="form-control bg-amarillo" id="cmbPreMedida">
                                                        </select>
                                                        <button class="btn btn-base hand" id="btnBuscarMedidas">
                                                            <i class="fal fa-search"></i>
                                                        </button>
                                                    </div>
                                                    
                                                </td>
                                                <td>
                                                    <input type="number" class="negrita form-control bg-amarillo" id="txtPreEquivale">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                                <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">

                                    <table class="table table-responsive h-full f-med">
                                        <thead class="negrita text-base">
                                            <tr>
                                                <td>COSTO UN.</td>
                                                <td>COSTO MEDIDA</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <input type="number" class="negrita text-danger form-control" disabled=true id="txtPreCosto">
                                                </td>
                                                <td>
                                                    <input type="number" class="negrita text-danger form-control" disabled=true id="txtPreTotalCosto">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                                
                                
                            </div>

                            <div class="row">

                                <table class="table table-responsive">
                                    <thead>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td class="negrita text-base">Utilidad</td>
                                            <td class="negrita text-base">Margen %</td>
                                            <td class="negrita text-base">Sucursales</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="negrita">Precio Público</td>
                                            <td>
                                                <input type="number" class="bg-amarillo form-control negrita text-danger" id="txtPrePublico">
                                            </td>
                                            <td>
                                                <input type="number" class="form-control negrita text-info" id="txtPreUtilidadPublico" disabled=true>
                                            </td>
                                            <td>
                                                <input type="number" class="form-control negrita text-info" id="txtPreMargenPublico" disabled=true>
                                            </td>
                                            <td>
                                                <button class="btn btn-circle btn-md btn-base hand shadow" onclick="get_lista_sucursales_precio('PRECIO')">
                                                    <i class="fal fa-list"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="negrita">Precio A</td>
                                            <td>
                                                <input type="number" class="bg-amarillo form-control negrita text-danger" id="txtPreMayoreoA">
                                            </td>
                                            <td>
                                                <input type="number" class="form-control negrita text-info" id="txtPreUtilidadMayoreoA" disabled=true>
                                            </td>
                                            <td>
                                                <input type="number" class="form-control negrita text-info" id="txtPreMargenMayoreoA" disabled=true>
                                            </td>
                                            <td>
                                                <button class="btn btn-circle btn-md btn-base hand shadow" onclick="get_lista_sucursales_precio('PRECIO_A')">
                                                    <i class="fal fa-list"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="negrita">Precio B</td>
                                            <td>
                                                <input type="number" class="bg-amarillo form-control negrita text-danger" id="txtPreMayoreoB">
                                            </td>
                                            <td>
                                                <input type="number" class="form-control negrita text-info" id="txtPreUtilidadMayoreoB" disabled=true>
                                            </td>
                                            <td>
                                                <input type="number" class="form-control negrita text-info" id="txtPreMargenMayoreoB" disabled=true>
                                            </td>
                                            <td>
                                                <button class="btn btn-circle btn-md btn-base hand shadow" onclick="get_lista_sucursales_precio('PRECIO_B')">
                                                    <i class="fal fa-list"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="negrita">Precio C</td>
                                            <td>
                                                <input type="number" class="bg-amarillo form-control negrita text-danger" id="txtPreMayoreoC">
                                            </td>
                                            <td>
                                                <input type="number" class="form-control negrita text-info" id="txtPreUtilidadMayoreoC" disabled=true>
                                            </td>
                                            <td>
                                                <input type="number" class="form-control negrita text-info" id="txtPreMargenMayoreoC" disabled=true>
                                            </td>
                                            <td>
                                                <button class="btn btn-circle btn-md btn-base hand shadow" onclick="get_lista_sucursales_precio('PRECIO_C')">
                                                    <i class="fal fa-list"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="negrita">Precio D</td>
                                            <td>
                                                <input type="number" class="bg-amarillo form-control negrita text-danger" id="txtPreMayoreoD">
                                            </td>
                                            <td>
                                                <input type="number" class="form-control negrita text-info" id="txtPreUtilidadMayoreoD" disabled=true>
                                            </td>
                                            <td>
                                                <input type="number" class="form-control negrita text-info" id="txtPreMargenMayoreoD" disabled=true>
                                            </td>
                                            <td>
                                                <button class="btn btn-circle btn-md btn-base hand shadow" onclick="get_lista_sucursales_precio('PRECIO_D')">
                                                    <i class="fal fa-list"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="negrita">Precio E</td>
                                            <td>
                                                <input type="number" class="bg-amarillo form-control negrita text-danger" id="txtPreMayoreoE">
                                            </td>
                                            <td>
                                                <input type="number" class="form-control negrita text-info" id="txtPreUtilidadMayoreoE" disabled=true>
                                            </td>
                                            <td>
                                                <input type="number" class="form-control negrita text-info" id="txtPreMargenMayoreoE" disabled=true>
                                            </td>
                                            <td>
                                                <button class="btn btn-circle btn-md btn-base hand shadow" onclick="get_lista_sucursales_precio('PRECIO_E')">
                                                    <i class="fal fa-list"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="negrita">Precio F</td>
                                            <td>
                                                <input type="number" class="bg-amarillo form-control negrita text-danger" id="txtPreMayoreoF">
                                            </td>
                                            <td>
                                                <input type="number" class="form-control negrita text-info" id="txtPreUtilidadMayoreoF" disabled=true>
                                            </td>
                                            <td>
                                                <input type="number" class="form-control negrita text-info" id="txtPreMargenMayoreoF" disabled=true>
                                            </td>
                                            <td>
                                                <button class="btn btn-circle btn-md btn-base hand shadow" onclick="get_lista_sucursales_precio('PRECIO_F')">
                                                    <i class="fal fa-list"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            
                            </div>

                            <div class="row">
                                <div class="col-6 text-left">
                                    <button class="btn btn-circle btn-secondary btn-xl hand shadow" data-dismiss="modal" id="">
                                        <i class="fal fa-arrow-left"></i>
                                    </button>
                                </div>
                                <div class="col-6 text-left">
                                    <button class="btn btn-circle btn-info btn-xl hand shadow" id="btnPreGuardar">
                                        <i class="fal fa-save"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                       
                    </div>
                </div>
            </div>

            
            `
        },
        modal_sucursales_precio:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" id="modal_sucursales_precio">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Sucursales con este catálogo de Precios
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">
                                        <h3 class="negrita text-base">Sucursales</h3>
                                        <table class="table table-responsive h-full" id="">
                                            <thead class="bg-base text-white">
                                                <tr>
                                                    <td>CODIGO</td>
                                                    <td>SUCURSAL</td>
                                                </tr>
                                            </thead>
                                            <tbody id="tblDataSucursalesPrecio">
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
        modal_medidas:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" id="modal_medidas">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Gestión de Medidas de Precio
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-2">
                                    <table class="table table-responsive">
                                        <thead class="negrita text-base">
                                            <tr>
                                                <td>MEDIDA</td>
                                                <td></td>    
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <input type="text" maxlength="30" class="border-base form-control negrita text-base" id="txtProdCodmedida"></td>
                                                <td>
                                                    <button class="btn btn-base hand shadow" id="btnProdAgregarMedida">
                                                        <i class="fal fa-plus"></i> Agregar
                                                    </button>
                                                </td>    
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            

                            <table class="table table-responsive h-full f-med" id="">
                                <thead class="negrita bg-base text-white">
                                    <tr>
                                        <td>MEDIDA</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataProdMedidas">
                                            
                                </tbody>
                            </table>
                                
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
        modal_marcas:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" id="modal_marcas">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Gestión de Marcas
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-2">
                                    <table class="table table-responsive">
                                        <thead class="negrita text-base">
                                            <tr>
                                                <td>CÓDIGO</td>
                                                <td>MARCA</td>
                                                <td></td>    
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <input type="number" class="border-base form-control negrita text-base" id="txtProdCodmarca"></td>
                                                <td>
                                                    <input type="text" class="border-base form-control negrita text-base" id="txtProdDesmarca"></td>
                                                <td>
                                                    <button class="btn btn-base hand shadow" id="btnProdAgregarMarca">
                                                        <i class="fal fa-plus"></i> Agregar
                                                    </button>
                                                </td>    
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Búsqueda de Marcas</label>
                                <input type="search" class="negrita text-base border-base form-control" id="txtBuscarProdMarcas" oninput="F.FiltrarTabla('tblProdMarcas','txtBuscarProdMarcas')">
                            </div>

                            <table class="table table-responsive h-full f-med" id="tblProdMarcas">
                                <thead class="negrita bg-base text-white">
                                    <tr>
                                        <td>CODIGO</td>
                                        <td>MARCA</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataProdMarcas">
                                            
                                </tbody>
                            </table>
                                
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
        modal_claseuno:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" id="modal_claseuno">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Gestión de Fabricantes (Clasificación Uno)
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-2">
                                    <table class="table table-responsive">
                                        <thead class="negrita text-base">
                                            <tr>
                                                <td>CÓDIGO</td>
                                                <td>FABRICANTE</td>
                                                <td></td>    
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <input type="number" class="border-base form-control negrita text-base" id="txtProdCodClaseuno"></td>
                                                <td>
                                                    <input type="text" class="border-base form-control negrita text-base" id="txtProdDesClaseuno"></td>
                                                <td>
                                                    <button class="btn btn-base hand shadow" id="btnProdAgregarClaseuno">
                                                        <i class="fal fa-plus"></i> Agregar
                                                    </button>
                                                </td>    
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Búsqueda de Fabricantes</label>
                                <input type="search" class="negrita text-base border-base form-control" id="txtBuscarProdClaseuno" oninput="F.FiltrarTabla('tblProdClaseuno','txtBuscarProdClaseuno')">
                            </div>

                            <table class="table table-responsive h-full f-med" id="tblProdClaseuno">
                                <thead class="negrita bg-base text-white">
                                    <tr>
                                        <td>CODIGO</td>
                                        <td>FABRICANTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataProdClaseuno">
                                            
                                </tbody>
                            </table>
                                
                           
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
        modal_proveedores:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" id="modal_proveedores">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Gestión de Proveedores
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-2">
                                    <table class="table table-responsive">
                                        <thead class="negrita text-base">
                                            <tr>
                                                <td>CODIGO</td>
                                                <td>PROVEEDOR</td>
                                                <td></td>    
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <input type="number" class="border-base form-control negrita text-base" id="txtProdCodProv"></td>
                                                <td>
                                                    <input type="text" class="border-base form-control negrita text-base" id="txtProdDesProv"></td>
                                                <td>
                                                    <button class="btn btn-base hand shadow" id="btnProdAgregarProv">
                                                        <i class="fal fa-plus"></i> Agregar
                                                    </button>
                                                </td>    
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Búsqueda de Fabricantes</label>
                                <input type="search" class="negrita text-base border-base form-control" id="txtBuscarProdProv" oninput="F.FiltrarTabla('tblProdProv','txtBuscarProdProv')">
                            </div>

                            <table class="table table-responsive h-full f-med" id="tblProdProv">
                                <thead class="negrita bg-base text-white">
                                    <tr>
                                        <td>CODIGO</td>
                                        <td>PROVEEDOR</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataProdProv">
                                            
                                </tbody>
                            </table>
                                
                           
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
        vista_movimientos_kardex:()=>{
            return `
            <div class="card card-rounded col-12 shadow">
                <div class="card-body p-4">

                    <h5 class="negrita text-secondary">Movimientos del producto</h5>
                    <h2 class="negrita text-base" id="lbMovimientosDesprod">PRODUCTO</h2>
                    
                    <div class="table-responsive">
                        <table class="table table-responsive h-full col-12 table-hover table-bordered" id="tblMovimientosProducto">
                            <thead class="bg-base text-white negrita">
                                <tr>
                                    <td>FECHA</td>
                                    <td>DOCUMENTO</td>
                                    <td>ENTRADA</td>
                                    <td>SALIDA</td>
                                    <td>SALDO</td>
                                    <td>PRECIO</td>
                                    <td>MODIFICADO</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataMovimientosProducto">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <button class="btn btn-secondary btn-bottom-l btn-xl btn-circle hand shadow" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>

            `
        }
    }
    

    root.innerHTML = view.body();

};

function addListeners(){

    document.title = "Lista Productos";
    
    GF.get_data_color()
    .then((data)=>{
        let strColores = '';
        data.recordset.map((r)=>{
            strColores +=`
            <option style='color:${r.COLOR}' value="${r.NF}">(${r.NOMBRE}) ${r.DESCRIPCION}</option>
            `
        })
        document.getElementById('cmbColor').innerHTML = strColores;
    })
    

   

    get_combos_producto();

    listeners_listado();

    listeners_precios();
    
    listeners_menu_productos();

    //LISTENERS DEL MENÚ PRODUCTOS
    F.slideAnimationTabs();

};

function listeners_menu_productos(){
  

        let btnNuevoProducto = document.getElementById('btnNuevoProducto');
        btnNuevoProducto.addEventListener('click',()=>{

            GlobalBolEditando = false;

            document.getElementById('txtCodprod2').value = '';
            document.getElementById('txtDesprod').value = '';
            document.getElementById('txtDesprod2').value = '';
            document.getElementById('txtDesprod3').value = '';
            document.getElementById('txtUxc').value = '1';
            //document.getElementById('txtBono').value = '0';
            document.getElementById('cmbTipoProd').value = 'B';
            document.getElementById('txtCosto').value = '0';

            document.getElementById('tab-dos').click();
            get_tbl_precios();

            document.getElementById('btnGuardarProducto').style = "visibility:visible";
            document.getElementById('btnGuardarProductoEditar').style = "visibility:hidden";
            document.getElementById('txtCodprod').disabled = false;

        });

        
        let btnGuardarProducto = document.getElementById('btnGuardarProducto');
        btnGuardarProducto.addEventListener('click',()=>{

            F.Confirmacion('¿Está seguro que desea CREAR este nuevo producto?')
            .then((value)=>{
                if(value==true){

                    
                    let txtCodprod = document.getElementById('txtCodprod');
                    if(txtCodprod.value==''){F.AvisoError('Escriba un código de producto');return;}
                    txtCodprod.focus();

                    let txtCodprod2 = document.getElementById('txtCodprod2');
                    if(txtCodprod2.value==''){txtCodprod2.value=txtCodprod.value};

                    let txtDesprod = document.getElementById('txtDesprod');
                    let txtDesprod2 = document.getElementById('txtDesprod2');
                    if(txtDesprod2.value==''){txtDesprod2.value=txtDesprod.value};

                    let txtDesprod3 = document.getElementById('txtDesprod3');
                    if(txtDesprod3.value==''){txtDesprod3.value=txtDesprod.value};

                    let txtUxc = document.getElementById('txtUxc');
                    if(txtUxc.value==''){txtUxc.value='1'};
                    if(txtUxc.value=='0'){txtUxc.value='1'};
                    
                    let txtBono = 0 //document.getElementById('txtBono');
                    //if(txtBono.value==''){txtBono.value='0'};

                    let txtCosto = document.getElementById('txtCosto');
                    let lastupdate = F.getFecha();
                    let exento = document.getElementById('cmbExento').value;

                    let cmbTipoProd = document.getElementById('cmbTipoProd');
                    let cmbColor = document.getElementById('cmbColor');
                    
                    let cmbMarca = document.getElementById('cmbMarca');

                    let cmbTipoLaboratorio = document.getElementById('cmbTipoLaboratorio');
                    let cmbTipoImpulso = document.getElementById('cmbTipoImpulso');
                    let cmbTipoProgramaSalud = document.getElementById('cmbTipoProgramaSalud');
                    let cmbTipoRMMR = document.getElementById('cmbTipoRMMR');
                    let cmbTipoRelleno = document.getElementById('cmbTipoRelleno');
                    let cmbTipoRentabilidad = document.getElementById('cmbTipoRentabilidad');
                    let cmbTipoTipo = document.getElementById('cmbTipoTipo');

                    

                    btnGuardarProducto.innerHTML = `<i class="fal fa-save fa-spin"></i>`;
                    btnGuardarProducto.disabled = true;

                    F.showToast('Verificando el código de producto');

                    GF.verify_codprod(txtCodprod.value)
                    .then(()=>{
                        F.AvisoError('Este código de producto ya existe, por favor, utilice otro');
                        
                        btnGuardarProducto.innerHTML = `<i class="fal fa-save"></i>`;
                        btnGuardarProducto.disabled = false;
                        return;
                    })
                    .catch(()=>{

                        F.showToast('Creando el nuevo producto');
                    

                        insert_producto(txtCodprod.value,txtCodprod2.value,txtDesprod.value,txtDesprod2.value,
                            txtDesprod3.value,txtUxc.value,txtCosto.value,
                            cmbMarca.value,lastupdate,cmbTipoProd.value,exento,cmbColor.value,txtBono,
                            cmbTipoLaboratorio.value,cmbTipoImpulso.value,cmbTipoProgramaSalud.value,cmbTipoRMMR.value,cmbTipoRelleno.value,
                            cmbTipoRentabilidad.value,cmbTipoTipo.value)
                            .then(()=>{

                                F.Aviso('Se ha creado un nuevo producto');


                                btnGuardarProducto.innerHTML = `<i class="fal fa-save"></i>`;
                                btnGuardarProducto.disabled = false;
                    
                                delete_lista_temp_precios();
                                document.getElementById('tab-uno').click();
                                get_tbl_productos();

                            })
                            .catch(()=>{
                        
                                btnGuardarProducto.innerHTML = `<i class="fal fa-save"></i>`;
                                btnGuardarProducto.disabled = false;

                            })

                        

                    })

                }
            })
            
        
        });

        let btnGuardarProductoEditar = document.getElementById('btnGuardarProductoEditar');
        btnGuardarProductoEditar.addEventListener('click',()=>{

            F.Confirmacion('¿Está seguro que desea ACTUALIZAR este producto?')
            .then((value)=>{
                if(value==true){

                    let txtCodprod = document.getElementById('txtCodprod');                  
                
                    let txtCodprod2 = document.getElementById('txtCodprod2');
                    if(txtCodprod2.value==''){txtCodprod2.value=txtCodprod.value};

                    let txtDesprod = document.getElementById('txtDesprod');
                    let txtDesprod2 = document.getElementById('txtDesprod2');
                    if(txtDesprod2.value==''){txtDesprod2.value=txtDesprod.value};

                    let txtDesprod3 = document.getElementById('txtDesprod3');
                    if(txtDesprod3.value==''){txtDesprod3.value=txtDesprod.value};

                    let txtUxc = document.getElementById('txtUxc');
                    if(txtUxc.value==''){txtUxc.value='1'};
                    if(txtUxc.value=='0'){txtUxc.value='1'};
                    
                    let txtBono = 0 //document.getElementById('txtBono');
                    //if(txtBono.value==''){txtBono.value='0'};

                    let cmbTipoProd = document.getElementById('cmbTipoProd');
                    let cmbColor = document.getElementById('cmbColor');
                    let cmbMarca = document.getElementById('cmbMarca');

                    let cmbTipoLaboratorio = document.getElementById('cmbTipoLaboratorio');
                    let cmbTipoImpulso = document.getElementById('cmbTipoImpulso');
                    let cmbTipoProgramaSalud = document.getElementById('cmbTipoProgramaSalud');
                    let cmbTipoRMMR = document.getElementById('cmbTipoRMMR');
                    let cmbTipoRelleno = document.getElementById('cmbTipoRelleno');
                    let cmbTipoRentabilidad = document.getElementById('cmbTipoRentabilidad');
                    let cmbTipoTipo = document.getElementById('cmbTipoTipo');
                   

                    let txtCosto = document.getElementById('txtCosto');
                    let lastupdate = F.getFecha();
                    let exento = document.getElementById('cmbExento').value;


                    btnGuardarProductoEditar.innerHTML = `<i class="fal fa-save fa-spin"></i>`;
                    btnGuardarProductoEditar.disabled = true;

                    
                        F.showToast('Actualizando datos del producto');
                    

                        edit_producto(txtCodprod.value,txtCodprod2.value,txtDesprod.value,txtDesprod2.value,
                            txtDesprod3.value,txtUxc.value,txtCosto.value,cmbMarca.value,
                            cmbTipoLaboratorio.value,cmbTipoImpulso.value,cmbTipoProgramaSalud.value,cmbTipoRMMR.value,cmbTipoRelleno.value,
                            lastupdate,cmbTipoProd.value,exento,cmbColor.value,txtBono,cmbTipoRentabilidad.value,cmbTipoTipo.value)
                            .then(()=>{

                                F.Aviso('Se ha actualizado el producto');


                                btnGuardarProductoEditar.innerHTML = `<i class="fal fa-save"></i>`;
                                btnGuardarProductoEditar.disabled = false;
                    
                                document.getElementById('tab-uno').click();
                                get_tbl_productos();

                            })
                            .catch(()=>{
                        
                                btnGuardarProductoEditar.innerHTML = `<i class="fal fa-save"></i>`;
                                btnGuardarProductoEditar.disabled = false;

                            })

                        


                }
            })

        });


        let btnProdMenEliminar = document.getElementById('btnProdMenEliminar');
        btnProdMenEliminar.addEventListener('click',()=>{

            F.Confirmacion('¿Está seguro que desea ELIMINAR este producto ' + GlobalSelected_Desprod + '?')
            .then((value)=>{
                if(value==true){

                    btnProdMenEliminar.innerHTML = '<i class="fal fa-trash fa-spin"></i>';
                    btnProdMenEliminar.disabled = true;
                
                    
                    GF.verify_codprod_movimientos(GlobalSelected_Codprod)
                    .then(()=>{

                        F.AvisoError('Este producto tiene movimientos, no se puede ELIMINAR');
                        btnProdMenEliminar.innerHTML = '<i class="fal fa-trash"></i>';
                        btnProdMenEliminar.disabled = false;
                        
                    })
                    .catch(()=>{
                   
                        delete_producto(GlobalSelected_Codprod)
                        .then(()=>{
                            F.Aviso('Producto eliminado exitosamente!!')
                            btnProdMenEliminar.innerHTML = '<i class="fal fa-trash"></i>';
                            btnProdMenEliminar.disabled = false;
                            $("#modal_menu_producto").modal('hide');
                            get_tbl_productos();
                        
                        })
                        .catch(()=>{
                            F.AvisoError('No se pudo eliminar');
                            btnProdMenEliminar.innerHTML = '<i class="fal fa-trash"></i>';
                            btnProdMenEliminar.disabled = false;
                            
                        })
                   
                    })


                        
        
                 
            

                }
            })


        });

        let btnProdMenActivar = document.getElementById('btnProdMenActivar');
        btnProdMenActivar.addEventListener('click',()=>{

            let habilitado = GlobalSelected_Status =='SI' ? 'DESHABILITAR' : 'HABILITAR';
            
            F.Confirmacion(`¿Está seguro que desea ${habilitado} el producto ${GlobalSelected_Desprod}`)
            .then((value)=>{
                if(value==true){

                    btnProdMenActivar.innerHTML = '<i class="fal fa-sync fa-spin"></i>';
                    btnProdMenActivar.disabled = false;


                    desactivar_producto(GlobalSelected_Codprod,GlobalSelected_Status)
                    .then(()=>{
                        
                        F.Aviso('Estado del Producto actualizado exitosamente!!')
                        
                        btnProdMenActivar.innerHTML = '<i class="fal fa-sync"></i>';
                        btnProdMenActivar.disabled = false;

                        $("#modal_menu_producto").modal('hide');
                        get_tbl_productos();

                    })
                    .catch(()=>{
                        F.AvisoError('No se pudo cambiar el Estado del Producto');
                        btnProdMenActivar.innerHTML = '<i class="fal fa-sync"></i>';
                        btnProdMenActivar.disabled = false;

                    })

                }
            })

        });


        let btnProdMenEditar = document.getElementById('btnProdMenEditar');
        btnProdMenEditar.addEventListener('click',()=>{

            F.Confirmacion('¿Está seguro que desea EDITAR este producto?')
            .then((value)=>{
                if(value==true){

                    GlobalBolEditando = true;

                    btnProdMenEditar.innerHTML = '<i class="fal fa-edit fa-spin"></i>';
                    btnProdMenEditar.disabled = true;

                    document.getElementById('btnGuardarProducto').style = "visibility:hidden";
                    document.getElementById('btnGuardarProductoEditar').style = "visibility:visible";
                    document.getElementById('txtCodprod').disabled = true;

                    get_detalle_producto_selecionado(GlobalSelected_Codprod)
                    .then((data)=>{

                        btnProdMenEditar.innerHTML = '<i class="fal fa-edit"></i>';
                        btnProdMenEditar.disabled = false;

                        $("#modal_menu_producto").modal('hide');

                            data.recordset.map((r)=>{
                                document.getElementById('txtCodprod').value = r.CODPROD;
                                document.getElementById('txtCodprod2').value = r.CODPROD2;
                                document.getElementById('txtDesprod').value = r.DESPROD;
                                document.getElementById('txtDesprod2').value = r.DESPROD2;
                                document.getElementById('txtDesprod3').value = r.DESPROD3;
                                document.getElementById('txtUxc').value = r.UXC;
                                //document.getElementById('txtBono').value = r.BONO;
                                document.getElementById('cmbTipoProd').value = r.TIPOPROD;
                                document.getElementById('cmbTipoTipo').value = r.CLASIF_TIPO;
                                document.getElementById('cmbColor').value = r.NF;
                                document.getElementById('cmbMarca').value = r.CODMARCA;

                                document.getElementById('cmbTipoLaboratorio').value = r.CLASIF_LABORATORIO;
                                document.getElementById('cmbTipoImpulso').value = r.CLASIF_IMPULSO;
                                document.getElementById('cmbTipoProgramaSalud').value = r.CLASIF_PROGRAMA_SALUD;
                                document.getElementById('cmbTipoRMMR').value = r.CLASIF_RM_MR;
                                document.getElementById('cmbTipoRelleno').value = r.CLASIF_RELLENO;
                                

                                document.getElementById('txtCosto').value = r.COSTO_ULTIMO;
                            })

                            document.getElementById('tab-dos').click();

                            get_tbl_precios_producto(document.getElementById('txtCodprod').value,'tblDataPrecios');
                    })
                    .catch(()=>{
                        F.AvisoError('No se pudieron cargar los datos del producto');
                        btnProdMenEditar.innerHTML = '<i class="fal fa-edit"></i>';
                        btnProdMenEditar.disabled = false;
                    })


                }
            })

        });

        let btnProdMenKardex = document.getElementById('btnProdMenKardex');
        btnProdMenKardex.addEventListener('click',()=>{

            $("#modal_menu_producto").modal('hide');

            document.getElementById('lbMovimientosDesprod').innerText = GlobalSelected_Desprod;
            document.getElementById('tab-tres').click();

            let container = document.getElementById('tblDataMovimientosProducto');
            container.innerHTML = GlobalLoader;


            GF.get_tbl_movimientos_producto(GlobalSelected_Codprod)
            .then((tbl)=>{
                container.innerHTML = tbl;    
            })
            .catch(()=>{
                container.innerHTML = 'No hay datos....';
            })

        })

};

function listeners_listado(){

    //cmbEmpresa.removeEventListener('change', handle_empresa_change)
    //cmbEmpresa.addEventListener('change', handle_empresa_change)
    document.getElementById('btnExportar').addEventListener('click',()=>{

                F.showToast('Cargando datos...');

                let st = 'SI' //document.getElementById('cmbTipo').value;

                document.getElementById('btnExportar').disabled = true;
                document.getElementById('btnExportar').innerHTML = `<i class="fal fa-share fa-spin"></i>`;
         
                GF.data_listado_productos_export(GlobalEmpnit,st)
                .then((data)=>{
                   
                    let datos = data.recordset;

                    F.export_json_to_xlsx(datos,'Lista_productos')

                    document.getElementById('btnExportar').disabled = false;
                    document.getElementById('btnExportar').innerHTML = `<i class="fal fa-share"></i>Excel`;

                })
                .catch(()=>{
                    F.AvisoError('No se pudo cargar')
                    document.getElementById('btnExportar').disabled = false;
                    document.getElementById('btnExportar').innerHTML = `<i class="fal fa-share"></i>Excel`;

                })

    });

    document.getElementById('cmbTipoLista').addEventListener('change',()=>{
        get_tbl_productos();
    })

    document.getElementById('btnAtrasTabDos').addEventListener('click',()=>{
        document.getElementById('tab-uno').click();
    });
    
    
    let txtBuscar = document.getElementById('txtBuscar');
    txtBuscar.addEventListener('keyup',(e)=>{
        if(e.keyCode == 13){
            get_tbl_productos();
        }
    })

    //LISTA DE PRODUCTOS (LOS PRIMEROS 50 NADA MAS)
    get_tbl_productos();
    //OBTIENE EL TOTAL DE PRODUCTOS
    


    // MARCAS ---------------------------
    let btnBuscarMarca = document.getElementById('btnBuscarMarca');
    btnBuscarMarca.addEventListener('click',()=>{

        $("#modal_marcas").modal('show');

        get_lista_marcas();

    });


    let btnProdAgregarMarca = document.getElementById('btnProdAgregarMarca');
    btnProdAgregarMarca.addEventListener('click',()=>{

        let codigo = document.getElementById('txtProdCodmarca').value || '0';
        if(codigo=='0'){F.AvisoError('Indique un código de marca válido');return;};

        let marca = document.getElementById('txtProdDesmarca').value || 'SN';
        if(marca=='SN'){F.AvisoError('Indique una descripción de marca válido');return;};
        

        F.Confirmacion('¿Está seguro que desea agregar esta nueva marca?')
        .then((value)=>{
            if(value==true){

                btnProdAgregarMarca.innerHTML = `<i class="fal fa-plus fa-spin"></i>`;
                btnProdAgregarMarca.disabled = true;

                insert_marca(codigo,marca)
                .then(()=>{

                    F.Aviso('Marca creada exitosamente!!');
                    get_lista_marcas();
                    get_combo_marcas();

                    document.getElementById('txtProdCodmarca').value ='';
                    document.getElementById('txtProdDesmarca').value ='';
                    
                    btnProdAgregarMarca.innerHTML = `<i class="fal fa-plus"></i> Agregar`;
                    btnProdAgregarMarca.disabled = false;

                })
                .catch(()=>{
                    F.AvisoError('No se pudo guardar esta marca');
                    
                    btnProdAgregarMarca.innerHTML = `<i class="fal fa-plus"></i> Agregar`;
                    btnProdAgregarMarca.disabled = false;
                })
            }
        })

        

    });

    // MARCAS ---------------------------


    
};

function listeners_precios(){

    let btnNuevoPrecio = document.getElementById('btnNuevoPrecio');
    btnNuevoPrecio.addEventListener('click',()=>{

            let codprod = document.getElementById('txtCodprod').value || '0';
            if(codprod=='0'){F.AvisoError('No puede agregar un precio sin un código');return;}

            let txtCosto = document.getElementById('txtCosto').value || '0';
            if(txtCosto=='0'){F.AvisoError('Indique un costo Unitario válido'); return;};

            document.getElementById('txtPrePublico').value = '';
            document.getElementById('txtPreMayoreoA').value = '';
            document.getElementById('txtPreMayoreoB').value = '';
            document.getElementById('txtPreMayoreoC').value = '';
            document.getElementById('txtPreMayoreoD').value = '';
            document.getElementById('txtPreMayoreoE').value = '';
            document.getElementById('txtPreMayoreoF').value = '';

            $("#modal_nuevo_precio").modal('show');

            document.getElementById('txtPreCosto').value = document.getElementById('txtCosto').value
            document.getElementById('txtPreEquivale').value = 1;

            calcular_costo_medida();


    });

    document.getElementById('txtPreEquivale').addEventListener('input',()=>{
        calcular_costo_medida();
        calcular_utilidad_precios('P');
        calcular_utilidad_precios('A');      
    });

    document.getElementById('txtPreMayoreoA').addEventListener('input',()=>{
        calcular_utilidad_precios('A');  
    });
    document.getElementById('txtPreMayoreoB').addEventListener('input',()=>{
        calcular_utilidad_precios('B');  
    });
    document.getElementById('txtPreMayoreoC').addEventListener('input',()=>{
        calcular_utilidad_precios('C');  
    });
    document.getElementById('txtPreMayoreoD').addEventListener('input',()=>{
        calcular_utilidad_precios('D');  
    });
    document.getElementById('txtPreMayoreoE').addEventListener('input',()=>{
        calcular_utilidad_precios('E');  
    });
    document.getElementById('txtPreMayoreoF').addEventListener('input',()=>{
        calcular_utilidad_precios('F');  
    });

    document.getElementById('txtPrePublico').addEventListener('input',()=>{
        calcular_utilidad_precios('P');  
    });

    let btnPreGuardar = document.getElementById('btnPreGuardar');
    btnPreGuardar.addEventListener('click',()=>{

        
        btnPreGuardar.innerHTML = `<i class="fal fa-save fa-spin"></i>`;
        btnPreGuardar.disabled = true;

        let codprod = document.getElementById('txtCodprod').value;

        let cmbPreMedida = document.getElementById('cmbPreMedida');
        let txtPreEquivale = document.getElementById('txtPreEquivale').value || '0';
        let txtPreTotalCosto = document.getElementById('txtPreTotalCosto').value || '0.01';
        let txtPrePublico = document.getElementById('txtPrePublico').value || '0';
        if(Number(txtPrePublico)<0){
            btnPreGuardar.innerHTML = `<i class="fal fa-save"></i>`;
            btnPreGuardar.disabled = false;
            F.AvisoError('Agregue un precio válido');
            return;
        };

        let txtPreMayoreoA = document.getElementById('txtPreMayoreoA').value || '0';
        if(Number(txtPreMayoreoA)<0){
            btnPreGuardar.innerHTML = `<i class="fal fa-save"></i>`;
            btnPreGuardar.disabled = false;
            F.AvisoError('Agregue un precio Mayoreo válido');
            return;
        };
        if(txtPreMayoreoA=='0'){
            txtPreMayoreoA = txtPrePublico
        };

        let txtPreMayoreoB = document.getElementById('txtPreMayoreoB').value || '0';
        let txtPreMayoreoC = document.getElementById('txtPreMayoreoC').value || '0';
        let txtPreMayoreoD = document.getElementById('txtPreMayoreoD').value || '0';
        let txtPreMayoreoE = document.getElementById('txtPreMayoreoE').value || '0';
        let txtPreMayoreoF = document.getElementById('txtPreMayoreoF').value || '0';

        if(txtPreEquivale.toString()=='0'){
            document.getElementById('txtPreEquivale').value='1';
            calcular_costo_medida();
            calcular_utilidad_precios('T');
        }else{
            txtPreEquivale=txtPreEquivale.replace('-','');
            calcular_costo_medida();
            calcular_utilidad_precios('T');
        }

        if(GlobalBolEditando==false){
            //se está creando un nuevo producto
            insert_temp_precio(codprod,cmbPreMedida.value,txtPreEquivale,'0',txtPreTotalCosto,txtPrePublico,txtPreMayoreoA,txtPreMayoreoB,txtPreMayoreoC,txtPreMayoreoD,txtPreMayoreoE,txtPreMayoreoF)
            .then(()=>{
    
                btnPreGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                btnPreGuardar.disabled = false;
        
                F.Aviso('Precio guardado exitosamente!!')
                $("#modal_nuevo_precio").modal('hide');
    
                get_tbl_precios();
            })
            .catch((err)=>{
                console.log(err);
                btnPreGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                btnPreGuardar.disabled = false;
    
                F.AvisoError('No se pudo guardar este precio');
            });

        }else{
            //se está editando el producto
            insert_precio(codprod,cmbPreMedida.value,txtPreEquivale,'0',txtPreTotalCosto,txtPrePublico,txtPreMayoreoA,txtPreMayoreoB,txtPreMayoreoC,txtPreMayoreoD,txtPreMayoreoE,txtPreMayoreoF)
            .then(()=>{
    
                btnPreGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                btnPreGuardar.disabled = false;
        
                F.Aviso('Precio guardado exitosamente!!')
                $("#modal_nuevo_precio").modal('hide');
    
                get_tbl_precios_producto(document.getElementById('txtCodprod').value,'tblDataPrecios');

            })
            .catch((err)=>{
                console.log(err);
                btnPreGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                btnPreGuardar.disabled = false;
    
                F.AvisoError('No se pudo guardar este precio');
            });

        }
        

        

        

    });

   

    // MEDIDAS -----------------------------
    let btnBuscarMedidas = document.getElementById('btnBuscarMedidas');
    btnBuscarMedidas.addEventListener('click',()=>{

        $("#modal_medidas").modal('show');
        get_lista_medidas();

    });

    let btnProdAgregarMedida = document.getElementById('btnProdAgregarMedida');
    btnProdAgregarMedida.addEventListener('click',()=>{

     
        let descripcion = document.getElementById('txtProdCodmedida').value || 'SN';
        if(descripcion=='SN'){F.AvisoError('Indique una descripción de medida válida');return;};
        

        F.Confirmacion('¿Está seguro que desea agregar esta Medida?')
        .then((value)=>{
            if(value==true){

                btnProdAgregarMedida.innerHTML = `<i class="fal fa-plus fa-spin"></i>`;
                btnProdAgregarMedida.disabled = true;

                insert_medida(descripcion,descripcion)
                .then(()=>{

                    F.Aviso('Medida creada exitosamente!!');
                    get_lista_medidas();
                    get_combo_medidas();

                    document.getElementById('txtProdCodmedida').value ='';
                    
                    btnProdAgregarMedida.innerHTML = `<i class="fal fa-plus"></i> Agregar`;
                    btnProdAgregarMedida.disabled = false;

                })
                .catch(()=>{
                    F.AvisoError('No se pudo guardar esta Medida');
                    
                    btnProdAgregarMedida.innerHTML = `<i class="fal fa-plus"></i> Agregar`;
                    btnProdAgregarMedida.disabled = false;
                })
            }
        })

        

    });
    // MEDIDAS -----------------------------


};

function get_lista_sucursales_precio(precio){

    $("#modal_sucursales_precio").modal('show');


    let container = document.getElementById('tblDataSucursalesPrecio');
    container.innerHTML = GlobalLoader;

    GF.get_data_sucursales_precios(precio)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `
            <tr>
                <td>${r.EMPNIT}</td>
                <td>${r.NOMBRE}</td>
            </tr>
            `
        })
        container.innerHTML = str;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos';
    })


};

function insert_temp_precio(codprod,codmedida,equivale,peso,costo,preciop,precioa,preciob,precioc,preciod,precioe,preciof){


    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/productos/insert_temp_precio',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                usuario:GlobalUsuario,
                codprod:codprod,
                codmedida:codmedida,
                equivale:equivale,
                peso:peso,
                costo:costo,
                preciop:preciop,
                precioa:precioa,
                preciob:preciob,
                precioc:precioc,
                preciod:preciod,
                precioe:precioe,
                preciof:preciof
            })
        .then((response) => {
            if(response.status.toString()=='200'){
                let data = response.data;
                if(Number(data.rowsAffected[0])>0){
                    resolve();             
                }else{
                    reject();
                }            
            }else{
                reject();
            }             
        }, (error) => {
            reject();
        });
    }) 

};

function calcular_costo_medida(){

    try {
        let costo = document.getElementById('txtCosto').value;
        let equivale = document.getElementById('txtPreEquivale').value || 1;
    
        document.getElementById('txtPreTotalCosto').value = Number(costo) * Number(equivale);
            
    } catch (error) {
        
    }

    
};

function calcular_utilidad_precios(tipoprecio){

    let costomedida = document.getElementById('txtPreTotalCosto').value;
    let pre_publico = document.getElementById('txtPrePublico').value || 0;
    let pre_mayoreoa = document.getElementById('txtPreMayoreoA').value || 0;
    let pre_mayoreob = document.getElementById('txtPreMayoreoB').value || 0;
    let pre_mayoreoc = document.getElementById('txtPreMayoreoC').value || 0;
    let pre_mayoreod = document.getElementById('txtPreMayoreoD').value || 0;
    let pre_mayoreoe = document.getElementById('txtPreMayoreoE').value || 0;
    let pre_mayoreof = document.getElementById('txtPreMayoreoF').value || 0;
    
    try {
        switch (tipoprecio) {
            case 'P':
                document.getElementById('txtPreUtilidadPublico').value = Number(pre_publico) - Number(costomedida);
                document.getElementById('txtPreMargenPublico').value =   (((Number(pre_publico) - Number(costomedida)) / Number(pre_publico)) * 100).toFixed(2);
                break;
            case 'A':
                document.getElementById('txtPreUtilidadMayoreoA').value = Number(pre_mayoreoa) - Number(costomedida);
                document.getElementById('txtPreMargenMayoreoA').value =   (((Number(pre_mayoreoa) - Number(costomedida)) / Number(pre_mayoreoa)) * 100).toFixed(2);
                break;
            case 'B':
                document.getElementById('txtPreUtilidadMayoreoB').value = Number(pre_mayoreob) - Number(costomedida);
                document.getElementById('txtPreMargenMayoreoB').value =   (((Number(pre_mayoreob) - Number(costomedida)) / Number(pre_mayoreob)) * 100).toFixed(2);
                break;
            case 'C':
                document.getElementById('txtPreUtilidadMayoreoC').value = Number(pre_mayoreoc) - Number(costomedida);
                document.getElementById('txtPreMargenMayoreoC').value =   (((Number(pre_mayoreoc) - Number(costomedida)) / Number(pre_mayoreoc)) * 100).toFixed(2);
                break;
            case 'D':
                document.getElementById('txtPreUtilidadMayoreoD').value = Number(pre_mayoreod) - Number(costomedida);
                document.getElementById('txtPreMargenMayoreoD').value =   (((Number(pre_mayoreod) - Number(costomedida)) / Number(pre_mayoreod)) * 100).toFixed(2);                   
                break;
            case 'E':
                document.getElementById('txtPreUtilidadMayoreoE').value = Number(pre_mayoreoe) - Number(costomedida);
                document.getElementById('txtPreMargenMayoreoE').value =   (((Number(pre_mayoreoe) - Number(costomedida)) / Number(pre_mayoreoe)) * 100).toFixed(2);    
                break;
            case 'F':
                document.getElementById('txtPreUtilidadMayoreoF').value = Number(pre_mayoreof) - Number(costomedida);
                document.getElementById('txtPreMargenMayoreoF').value =   (((Number(pre_mayoreof) - Number(costomedida)) / Number(pre_mayoreof)) * 100).toFixed(2);                    
                break;
            case 'T':
                calcular_utilidad_precios('P');
                calcular_utilidad_precios('A');
                calcular_utilidad_precios('B');
                calcular_utilidad_precios('C');
                calcular_utilidad_precios('D');
                calcular_utilidad_precios('E');
                calcular_utilidad_precios('F');
                
                break;
        }
    } catch (error) {
        
    }
   

};


function get_combo_marcas(){

        let container = document.getElementById('cmbMarca');
        
        axios.post(GlobalUrlCalls + '/productos/listado_marcas',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN
            })
        .then((response) => {
            if(response.status.toString()=='200'){
                let data = response.data;
                if(Number(data.rowsAffected[0])>0){
                    let str = '';
                    data.recordset.map((r)=>{
                        str += `<option value='${r.CODMARCA}'>${r.DESMARCA}</option>`
                    })
                    container.innerHTML = str;     
                }else{
                    container.innerHTML = `<option value='SN'>No se cargó las Marcas</option>`;
                }            
            }else{
                container.innerHTML = `<option value='SN'>No se cargó las Marcas</option>`;
            }             
        }, (error) => {
            container.innerHTML = `<option value='SN'>No se cargó las Marcas</option>`;
        });

};

function get_combo_clasificacion(tipo,idCmb){

    let container = document.getElementById(idCmb);


    GF.get_clasificaciones_listado(tipo)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `<option value='${r.CODIGO}'>${r.DESCRIPCION}</option>`
        })
        container.innerHTML = str
    })
    .catch(()=>{
        container.innerHTML = `<option value='SN'>No se cargó la clasificacion</option>`;
    })
    
   

};

function get_lista_marcas(){

    let container = document.getElementById('tblDataProdMarcas');
    container.innerHTML = GlobalLoader;

    axios.post(GlobalUrlCalls + '/productos/listado_marcas',
        {
            sucursal:GlobalEmpnit,
            token:TOKEN
        })
    .then((response) => {
        if(response.status.toString()=='200'){
            let data = response.data;
            if(Number(data.rowsAffected[0])>0){
                let str = '';
                data.recordset.map((r)=>{
                    str += `<tr>
                                <td>${r.CODMARCA}</td>
                                <td>${r.DESMARCA}</td>
                                <td></td>
                            </tr>`
                })
                container.innerHTML = str;     
            }else{
                container.innerHTML = `No se cargó las Marcas`;
            }            
        }else{
            container.innerHTML = `No se cargó las Marcas`;
        }             
    }, (error) => {
        container.innerHTML = `No se cargó las Marcas`;
    });

};

function insert_marca(codmarca,desmarca){
  
    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/productos/insert_marca',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                codmarca:codmarca,
                desmarca:desmarca
            })
        .then((response) => {
            if(response.status.toString()=='200'){
                if(response.data.toString()=='error'){
                    reject();
                }else{
                    let data = response.data;
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

function get_combo_fabricantes(){

    let container = document.getElementById('cmbClaseuno');
        
    axios.post(GlobalUrlCalls + '/productos/listado_claseuno',
        {
            sucursal:GlobalEmpnit,
            token:TOKEN
        })
    .then((response) => {
        if(response.status.toString()=='200'){
            let data = response.data;
            if(Number(data.rowsAffected[0])>0){
                let str = '';
                data.recordset.map((r)=>{
                    str += `<option value='${r.CODCLAUNO}'>${r.DESCLAUNO}</option>`
                })
                container.innerHTML = str;     
            }else{
                container.innerHTML = `<option value='SN'>No se cargó los fabricantes</option>`;
            }            
        }else{
            container.innerHTML = `<option value='SN'>No se cargó los fabricantes</option>`;
        }             
    }, (error) => {
        container.innerHTML = `<option value='SN'>No se cargó los fabricantes</option>`;
    });
};

function get_lista_fabricantes(){

    let container = document.getElementById('tblDataProdClaseuno');
    container.innerHTML = GlobalLoader;

    axios.post(GlobalUrlCalls + '/productos/listado_claseuno',
        {
            sucursal:GlobalEmpnit,
            token:TOKEN
        })
    .then((response) => {
        if(response.status.toString()=='200'){
            let data = response.data;
            if(Number(data.rowsAffected[0])>0){
                let str = '';
                data.recordset.map((r)=>{
                    str += `<tr>
                                <td>${r.CODCLAUNO}</td>
                                <td>${r.DESCLAUNO}</td>
                                <td></td>
                            </tr>`
                })
                container.innerHTML = str;     
            }else{
                container.innerHTML = `No se cargó los Fabricantes`;
            }            
        }else{
            container.innerHTML = `No se cargó los Fabricantes`;
        }             
    }, (error) => {
        container.innerHTML = `No se cargó los Fabricantes`;
    });

};

function insert_fabricante(codigo,descripcion){
  
    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/productos/insert_claseuno',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                codigo:codigo,
                descripcion:descripcion
            })
        .then((response) => {
            console.log(response);
            if(response.status.toString()=='200'){
                if(response.data.toString()=='error'){
                    reject();
                }else{
                    let data = response.data;
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

function get_combo_proveedores(){

    let container = document.getElementById('cmbProveedor');
        
    axios.post(GlobalUrlCalls + '/productos/listado_proveedores',
        {
            sucursal:GlobalEmpnit,
            token:TOKEN
        })
    .then((response) => {
        if(response.status.toString()=='200'){
            let data = response.data;
            if(Number(data.rowsAffected[0])>0){
                let str = '';
                data.recordset.map((r)=>{
                    str += `<option value='${r.CODPROV}'>${r.EMPRESA}</option>`
                })
                container.innerHTML = str;     
            }else{
                container.innerHTML = `<option value='SN'>No se cargó los proveedores</option>`;
            }            
        }else{
            container.innerHTML = `<option value='SN'>No se cargó los proveedores</option>`;
        }             
    }, (error) => {
        container.innerHTML = `<option value='SN'>No se cargó los proveedores</option>`;
    });
};

function get_lista_proveedores(){

    let container = document.getElementById('tblDataProdProv');
    container.innerHTML = GlobalLoader;

    axios.post(GlobalUrlCalls + '/productos/listado_proveedores',
        {
            sucursal:GlobalEmpnit,
            token:TOKEN
        })
    .then((response) => {
        if(response.status.toString()=='200'){
            let data = response.data;
            if(Number(data.rowsAffected[0])>0){
                let str = '';
                data.recordset.map((r)=>{
                    str += `<tr>
                                <td>${r.CODPROV}</td>
                                <td>${r.EMPRESA}</td>
                                <td></td>
                            </tr>`
                })
                container.innerHTML = str;     
            }else{
                container.innerHTML = `No se cargó los Proveedores`;
            }            
        }else{
            container.innerHTML = `No se cargó los Proveedores`;
        }             
    }, (error) => {
        container.innerHTML = `No se cargó los Proveedores`;
    });

};

function insert_proveedor(codigo,descripcion){
  
    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/productos/insert_proveedor',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                codigo:codigo,
                descripcion:descripcion
            })
        .then((response) => {
            console.log(response);
            if(response.status.toString()=='200'){
                if(response.data.toString()=='error'){
                    reject();
                }else{
                    let data = response.data;
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

function get_combo_clasedos(){
    let container = document.getElementById('cmbClasedos');
        
    axios.post(GlobalUrlCalls + '/productos/listado_clasedos',
        {
            sucursal:GlobalEmpnit,
            token:TOKEN
        })
    .then((response) => {
        if(response.status.toString()=='200'){
            let data = response.data;
            if(Number(data.rowsAffected[0])>0){
                let str = '';
                data.recordset.map((r)=>{
                    str += `<option value='${r.CODCLADOS}'>${r.DESCLADOS}</option>`
                })
                container.innerHTML = str;     
            }else{
                container.innerHTML = `<option value='SN'>No se cargó la clasificación</option>`;
            }            
        }else{
            container.innerHTML = `<option value='SN'>No se cargó la clasificación</option>`;
        }             
    }, (error) => {
        container.innerHTML = `<option value='SN'>No se cargó la clasificación</option>`;
    });

};


function get_combo_medidas(){
    let container = document.getElementById('cmbPreMedida');
        
    axios.post(GlobalUrlCalls + '/productos/listado_medidas',
        {
            sucursal:GlobalEmpnit,
            token:TOKEN
        })
    .then((response) => {
        if(response.status.toString()=='200'){
            let data = response.data;
            if(Number(data.rowsAffected[0])>0){
                let str = '';
                data.recordset.map((r)=>{
                    str += `<option value='${r.CODMEDIDA}'>${r.CODMEDIDA}</option>`
                })
                container.innerHTML = str;     
            }else{
                container.innerHTML = `<option value='SN'>No se cargó las Medidas de precio</option>`;
            }            
        }else{
            container.innerHTML = `<option value='SN'>No se cargó las Medidas de precio</option>`;
        }             
    }, (error) => {
        container.innerHTML = `<option value='SN'>No se cargó las Medidas de precio</option>`;
    });

};

function get_lista_medidas(){

    let container = document.getElementById('tblDataProdMedidas');
    container.innerHTML = GlobalLoader;

    axios.post(GlobalUrlCalls + '/productos/listado_medidas',
        {
            sucursal:GlobalEmpnit,
            token:TOKEN
        })
    .then((response) => {
        if(response.status.toString()=='200'){
            let data = response.data;
            if(Number(data.rowsAffected[0])>0){
                let str = '';
                data.recordset.map((r)=>{
                    let btnE = `btnE${r.CODMEDIDA}`;

                    str += `<tr>
                                <td>${r.CODMEDIDA}</td>
                                <td>
                                    <button class="btn btn-circle btn-md btn-danger hand shadow"
                                    onclick="delete_medida('${r.CODMEDIDA}','${btnE}')" id="${btnE}"
                                    >
                                        <i class="fal fa-trash"></i>
                                    </button>
                                </td>
                            </tr>`
                })
                container.innerHTML = str;     
            }else{
                container.innerHTML = `No se cargó las medidas`;
            }            
        }else{
            container.innerHTML = `No se cargó las medidas`;
        }             
    }, (error) => {
        container.innerHTML = `No se cargó las medidas`;
    });

};

function insert_medida(codigo,descripcion){
  
    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/productos/insert_medida',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                codigo:codigo,
                descripcion:descripcion
            })
        .then((response) => {
            console.log(response);
            if(response.status.toString()=='200'){
                if(response.data.toString()=='error'){
                    reject();
                }else{
                    let data = response.data;
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

function delete_medida(codmedida, idbtn){

    let btn = document.getElementById(idbtn);

    F.Confirmacion('¿Está seguro que desea ELIMINAR esta medida?')
    .then((value)=>{
        if(value==true){

            btn.disabled = true;
            btn.innerHTML = `<i class="fal fa-trash fa-spin"></i>`;

            data_delete_medida(codmedida)
            .then(()=>{

                get_lista_medidas();
                get_combo_medidas();

            })
            .catch(()=>{
                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-trash"></i>`;
            })


        }
    })



};


function data_delete_medida(codmedida){
  
    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/productos/delete_medida',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                codmedida:codmedida
            })
        .then((response) => {
            console.log(response);
            if(response.status.toString()=='200'){
                if(response.data.toString()=='error'){
                    reject();
                }else{
                    let data = response.data;
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


function initView(){

    getView();
    addListeners();

};

function get_combos_producto(){

    get_combo_marcas();
    
    get_combo_medidas();


    get_combo_clasificacion('LABORATORIO','cmbTipoLaboratorio');
    get_combo_clasificacion('IMPULSO','cmbTipoImpulso');
    get_combo_clasificacion('PROGRAMA_SALUD','cmbTipoProgramaSalud');
    get_combo_clasificacion('RM_MR','cmbTipoRMMR');
    get_combo_clasificacion('RELLENO','cmbTipoRelleno');
    get_combo_clasificacion('TIPO','cmbTipoTipo');
    get_combo_clasificacion('BI','cmbTipoRentabilidad');

 
};



function get_tbl_precios(){

        let container = document.getElementById('tblDataPrecios');

        axios.post(GlobalUrlCalls + '/productos/lista_precios_temp',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN
            })
        .then((response) => {
            if(response.status.toString()=='200'){
                let data = response.data;
                if(Number(data.rowsAffected[0])>0){
                    let str = '';
                    
                    data.recordset.map((r)=>{
                        let idbtnE = `btnE${r.ID}`;
                        str += `
                            <tr>
                                <td>${r.CODMEDIDA}</td>
                                <td>${r.EQUIVALE}</td>
                                <td>${F.setMoneda(r.COSTO,'Q')}</td>
                                <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                                <td>${F.setMoneda(r.PRECIO_A,'Q')}</td>
                                <td>${F.setMoneda(r.PRECIO_B,'Q')}</td>
                                <td>${F.setMoneda(r.PRECIO_C,'Q')}</td>
                                <td>${F.setMoneda(r.PRECIO_D,'Q')}</td>
                                <td>${F.setMoneda(r.PRECIO_E,'Q')}</td>
                                <td>${F.setMoneda(r.PRECIO_F,'Q')}</td>
                                <td>
                                    <button class="btn-md btn-circle btn-danger hand shadow" id="${idbtnE}" onclick="delete_temp_precio('${idbtnE}','${r.ID}')">
                                        <i class="fal fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `
                    })
                    container.innerHTML = str;             
                }else{
                    rootErrores.innerHTML = 'No hay filas para mostrar...';
                    container.innerHTML = 'No se cargaron datos...';
                }            
            }else{
                container.innerHTML = 'No se cargaron datos...';
            }             
        }, (error) => {
            rootErrores.innerHTML = error;
            container.innerHTML = 'No se cargaron datos...';
        });
     
};

function delete_temp_precio(idbtn,id){

    let btn = document.getElementById(idbtn);
    
    btn.innerHTML = `<i class="fal fa-trash fa-spin"></i>`;
    btn.disabled = true;

        axios.post(GlobalUrlCalls + '/productos/delete_temp_precio',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                id:id
            })
        .then((response) => {
            if(response.status.toString()=='200'){
                let data = response.data;
                if(Number(data.rowsAffected[0])>0){
                    F.Aviso('Precio eliminado exitosamente!!');
                    get_tbl_precios();           
                }else{
                    btn.innerHTML = `<i class="fal fa-trash"></i>`;
                    btn.disabled = false;
                }            
            }else{
                btn.innerHTML = `<i class="fal fa-trash"></i>`;
                btn.disabled = false;
            }             
        }, (error) => {
            btn.innerHTML = `<i class="fal fa-trash"></i>`;
            btn.disabled = false;
        });
      

};

function delete_lista_temp_precios(){
    
    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/productos/delete_lista_temp_precio',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                usuario:GlobalUsuario
            })
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

function data_productos_listado(filtro){
    
    
    let habilitado = document.getElementById('cmbTipoLista').value;

    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/productos/listado',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                habilitado:habilitado,
                filtro:filtro
            })
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

function get_tbl_productos(){

    let filtro = document.getElementById('txtBuscar').value || '';

    let container = document.getElementById('tblDataProductos');
    container.innerHTML = GlobalLoader;

    let lbTotalProductos = document.getElementById('lbTotalProductos');
    lbTotalProductos.innerText = '-----'

    let str = '';


    data_productos_listado(filtro)
    .then((data)=>{
        
        data.recordset.map((r)=>{
            str += `
                <tr class="hand border-bottom border-base" 
                onclick="get_detalle_producto('${r.CODPROD}','${r.DESPROD}','${r.DESPROD2}','${F.setMoneda(r.COSTO,'Q')}','${F.convertDateNormal(r.LASTUPDATE)}','${r.HABILITADO}')">
                    <td>${r.CODPROD}</td>
                    <td>${r.CODPROD2}</td>
                    <td>${r.DESPROD}</td>
                    <td>${r.DESPROD2}</td>
                    <td>${r.DESMARCA}</td>
                    <td>${r.DESTIPO}</td>
                    <td>UN: ${F.setMoneda(r.COSTO,'Q')}
                        <br>
                        C: ${F.setMoneda((Number(r.COSTO)*Number(r.UXC)),'Q')}
                    </td>
                    <td>${r.TIPOPROD}</td>
                    <td>${F.convertDateNormal(r.LASTUPDATE)}</td>
                </tr>
            `
        })
        container.innerHTML = str;
        lbTotalProductos.innerText = '';

        //F.initit_datatable('tblProductos',false);
        

    })
    .catch((err)=>{
        console.log(err)
        container.innerHTML = 'No hay datos para mostrar...';
        lbTotalProductos.innerText = '';
    })


    GF.get_productos_totales(document.getElementById('cmbTipoLista').value)
    .then((data)=>{
        let total = 0;
        data.recordset.map((r)=>{
             total = Number(r.CONTEO);
        })
        document.getElementById('lbTotalProductos').innerText = total.toString();
    })
    .catch(()=>{
        document.getElementById('lbTotalProductos').innerText = '-----'
    })

};



//----------------
//nuevo producto



function insert_producto(codprod,codprod2,desprod,desprod2,desprod3,
        uxc,costo,codmarca,lastupdate,tipoprod,exento,nf,bono,
        tipolaboratorio,tipoimpulso,tipoprogramasalud,tipormmr,tiporelleno,tipoRentabilidad,tipoTipo){
    

    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/productos/insert_producto',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                codprod:codprod,
                codprod2:codprod2,
                desprod:desprod,
                desprod2:desprod2,
                desprod3:desprod3,
                uxc:uxc,
                costo:costo,
                codmarca:codmarca,
                tipolaboratorio:tipolaboratorio,
                tipoimpulso:tipoimpulso,
                tipoprogramasalud:tipoprogramasalud,
                tipormmr:tipormmr,
                tiporelleno:tiporelleno,
                tiporentabilidad:tipoRentabilidad,
                tipotipo:tipoTipo,
                lastupdate:lastupdate,
                tipoprod:tipoprod,
                exento:exento,
                nf:nf,
                bono:bono
            })
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

function edit_producto(codprod,codprod2,desprod,desprod2,desprod3,
    uxc,costo,codmarca,tipolaboratorio,tipoimpulso,tipoprogramasalud,tipormmr,tiporelleno,
    lastupdate,tipoprod,exento,nf,bono,tipoRentabilidad,tipoTipo){


return new Promise((resolve,reject)=>{

    axios.post(GlobalUrlCalls + '/productos/edit_producto',
        {
            sucursal:GlobalEmpnit,
            token:TOKEN,
            codprod:codprod,
            codprod2:codprod2,
            desprod:desprod,
            desprod2:desprod2,
            desprod3:desprod3,
            uxc:uxc,
            costo:costo,
            codmarca:codmarca,
            tipolaboratorio:tipolaboratorio,
            tipoimpulso:tipoimpulso,
            tipoprogramasalud:tipoprogramasalud,
            tipormmr:tipormmr,
            tiporelleno:tiporelleno,
            tiporentabilidad:tipoRentabilidad,
            tipotipo:tipoTipo,
            lastupdate:lastupdate,
            tipoprod:tipoprod,
            exento:exento,
            nf:nf,
            bono:bono
        })
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

function get_detalle_producto_selecionado(codprod){

    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/productos/datos_producto',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                codprod:codprod
            })
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

//nuevo producto
//----------------


function get_detalle_producto(codprod,desprod,desprod2,costo,lastupdate,st){


        $("#modal_menu_producto").modal('show');

        GlobalBolEditando = false;

        GlobalSelected_Codprod = codprod;
        GlobalSelected_Desprod = desprod;
        GlobalSelected_Costo = Number(costo);
        GlobalSelected_Status = st;

        document.getElementById('lbDetDesprod').innerText = desprod;
        document.getElementById('lbDetCodprod').innerText = codprod;

        get_tbl_precios_producto(codprod,'tblDataPreciosProd');
    

};

function get_tbl_precios_producto(codprod,idcontainer){

    let container = document.getElementById(idcontainer);
    container.innerHTML = GlobalLoader;

    axios.post(GlobalUrlCalls + '/productos/lista_precios',
        {
            sucursal:GlobalEmpnit,
            token:TOKEN,
            codprod:codprod
        })
    .then((response) => {
        if(response.status.toString()=='200'){
            let data = response.data;
            if(Number(data.rowsAffected[0])>0){
                let str = '';
                
                data.recordset.map((r)=>{
                    let idbtnE = `btnE${r.ID}`;
                    let idbtnA = `btnA${r.ID}`;
                    let strClassHab = '';
                
                    if(r.HABILITADO=='SI'){strClassHab='btn-success';}else{strClassHab='btn-danger';};
                    
                    str += `
                        <tr>

                            <td>${r.CODMEDIDA}</td>
                            <td>${r.EQUIVALE}</td>
                            <td>${F.setMoneda(r.COSTO,'Q')}</td>
                            <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                            <td>${F.setMoneda(r.PRECIO_A,'Q')}</td>
                            <td>${F.setMoneda(r.PRECIO_B,'Q')}</td>
                            <td>${F.setMoneda(r.PRECIO_C,'Q')}</td>
                            <td>${F.setMoneda(r.PRECIO_D,'Q')}</td>
                            <td>${F.setMoneda(r.PRECIO_E,'Q')}</td>
                            <td>${F.setMoneda(r.PRECIO_F,'Q')}</td>
                            <td>
                                <button class="btn-md btn-circle btn-danger hand shadow" 
                                    id="${idbtnE}" 
                                    onclick="delete_precio('${idbtnE}','${r.ID}','${codprod}')">
                                    <i class="fal fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `
                })
                container.innerHTML = str;             
            }else{
                rootErrores.innerHTML = 'No hay filas para mostrar...';
                container.innerHTML = 'No se cargaron datos...';
            }            
        }else{
            container.innerHTML = 'No se cargaron datos...';
        }             
    }, (error) => {
        rootErrores.innerHTML = error;
        container.innerHTML = 'No se cargaron datos...';
    });
 
};
function habilitar_medida_precio(){

    
    $("#modal_menu_producto_deshabilitar_medida").modal('show');

    get_lista_medidas_deshabilitadas_empresas(GlobalSelected_Codprod);


};
function get_lista_medidas_deshabilitadas_empresas(codprod){

    let strCodmedidas = `<option value=''>Seleccione una...</option><option value=''>NINGUNA</option>`;

    document.getElementById('tblDataDeshabilitarMedidas').innerHTML = GlobalLoader;


    GF.get_data_precios_producto(codprod)
    .then((data)=>{

        data.recordset.map((r)=>{
            strCodmedidas += `<option value='${r.CODMEDIDA}'>${r.CODMEDIDA}</option>`
        });

            GF.data_medida_deshabilitada_empresas_producto(codprod)
            .then((data)=>{


                let str = '';
                data.recordset.map((r)=>{
                    let idcombocambiar = `idcombocambiar${r.EMPNIT}-${codprod}`;
                    str += `
                        <tr>
                            <td>${r.EMPRESA}</td>
                            <td>${r.CODMEDIDA_DESHABILITADA}</td>
                            <td>
                                <select class="form-control negrita text-danger" 
                                    value="${r.CODMEDIDA_DESHABILITADA}"
                                    id="${idcombocambiar}"
                                    onchange="deshabilitar_medida_empresa('${r.EMPNIT}','${codprod}','${idcombocambiar}')">
                                        ${strCodmedidas}
                                </select>
                            </td>
                            
                        </tr>
                    `
                })
                

                document.getElementById('tblDataDeshabilitarMedidas').innerHTML = str;

            })
            .catch(()=>{
                document.getElementById('tblDataDeshabilitarMedidas').innerHTML = 'No se cargaron datos...';
            })

    })
    .catch(()=>{
        document.getElementById('tblDataDeshabilitarMedidas').innerHTML = 'No se cargaron datos...';   
    });
}

function insert_precio(codprod,codmedida,equivale,peso,costo,preciop,precioa,preciob,precioc,preciod,precioe,preciof){


    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/productos/insert_precio',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                usuario:GlobalUsuario,
                codprod:codprod,
                codmedida:codmedida,
                equivale:equivale,
                peso:peso,
                costo:costo,
                preciop:preciop,
                precioa:precioa,
                preciob:preciob,
                precioc:precioc,
                preciod:preciod,
                precioe:precioe,
                preciof:preciof,
                lastupdate:F.getFecha()
            })
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
function delete_precio(idbtn,id,codprod){

    let btn = document.getElementById(idbtn);

    F.Confirmacion('¿Está seguro que desea ELIMINAR este precio?')
    .then((value)=>{
        if(value==true){

            btn.innerHTML = `<i class="fal fa-trash fa-spin"></i>`;
            btn.disabled = true;

                axios.post(GlobalUrlCalls + '/productos/delete_precio',
                    {
                        sucursal:GlobalEmpnit,
                        token:TOKEN,
                        id:id
                    })
                .then((response) => {
                    if(response.status.toString()=='200'){
                        let data = response.data;
                        if(Number(data.rowsAffected[0])>0){
                            F.Aviso('Precio eliminado exitosamente!!');
                            //if(GlobalBolEditando==false){
                                get_tbl_precios_producto(codprod,'tblDataPreciosProd');           
                            //}else{
                                get_tbl_precios_producto(codprod,'tblDataPrecios');           
                            //}
                            
                        }else{
                            btn.innerHTML = `<i class="fal fa-trash"></i>`;
                            btn.disabled = false;
                        }            
                    }else{
                        btn.innerHTML = `<i class="fal fa-trash"></i>`;
                        btn.disabled = false;
                    }             
                }, (error) => {
                    btn.innerHTML = `<i class="fal fa-trash"></i>`;
                    btn.disabled = false;
                });

        }
    })
    
    
      

};
function habilitar_precio(idbtn,precioId,codprod,st){

    let btn = document.getElementById(idbtn);

    let strMsn = '';
    let newSt = '';

    if(st=='SI'){
        //esta habilitado, entonces se deshabilita
        strMsn = "¿Está seguro que desea DESHABILITAR este precio?";
        newSt='NO';
    }else{
        //esta deshabilitado, entonces se habilita
     strMsn = "¿Está seguro que desea HABILITAR este precio?";
        newSt='SI';
    }

    F.Confirmacion(strMsn)
    .then((value)=>{
        if(value==true){

            btn.disabled = true;
            btn.innerHTML = `<i class="fal fa-spin fa-sync"></i>`;

            GF.update_status_precio(GlobalEmpnit,codprod,precioId,newSt)
            .then(()=>{
                    get_tbl_precios_producto(codprod,'tblDataPreciosProd');
   
            })
            .catch(()=>{
                F.AvisoError('No se pudo actualizar este precio');
                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-sync"></i>`;
            })


        }
    })





};
function deshabilitar_medida_empresa(empnit,codprod,idvalor){

    let btn = document.getElementById(idvalor);
    let valor = document.getElementById(idvalor).value;

    btn.disabled = true;
    F.showToast('Actualizando...');

    GF.update_codmedida_deshabilitada_empresa(empnit,codprod,valor)
    .then(()=>{

        F.Aviso('Medida actualizada');
        btn.disabled = false;

        get_lista_medidas_deshabilitadas_empresas(codprod);

    })
    .catch(()=>{
        F.AvisoError('No se pudo actualizar la medida')
        btn.disabled = false;
    })


};



function delete_producto(codprod){
    
    
    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/productos/delete_producto',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                codprod:codprod
            })
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

function desactivar_producto(codprod,st){
    
    
    return new Promise((resolve,reject)=>{

        axios.post(GlobalUrlCalls + '/productos/desactivar_producto',
            {
                sucursal:GlobalEmpnit,
                token:TOKEN,
                codprod:codprod,
                status:st
            })
        .then((response) => {
            if(response.status.toString()=='200'){
                let data = response.data;
                if(Number(data.rowsAffected[0])>0){
                    resolve(data);             
                }else{
                    reject();
                }            
            }else{
                reject();
            }             
        }, (error) => {
            reject();
        });
    })   

};
