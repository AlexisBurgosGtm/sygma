let botones_menu = {
    backup_general: ()=>{
        return `
 
        <!-- HOME -->
                            <li>
                                <a href="#"  class="text-base"  data-filter-tags="application intel"  onclick="Navegar.inicio();">
                                    <i class="fal fa-home"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">INICIO</span>
                                </a>
                            </li>

                             <!-- BUSINESS INTELLIGENCE -->
                             <li>
                                <a href="#" title="Application Intel" data-filter-tags="application intel">
                                    <i class="fal fa-chart-pie"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">BUSINESS INTELLIGENCE</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="#" title="Analytics Dashboard" data-filter-tags="application intel analytics dashboard" onclick="Menu.bi_autorizaciones()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_analytics_dashboard">TABLERO DE AUTORIZACIONES</span>
                                        </a>
                                    </li>
                                   
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.bi_notificaciones()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">TABLERO DE NOTIFICACIONES</span>
                                        </a>
                                    </li>                                   
                                    
                                </ul>
                            </li>
                            
                            <!-- PUNTO DE VENTA -->
                            <li>
                                <a href="#" title="Application Intel" data-filter-tags="application intel">
                                    <i class="fal fa-shopping-cart"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">PUNTO DE VENTA</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="#" title="Analytics Dashboard" data-filter-tags="application intel analytics dashboard" onclick="Menu.pos()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_analytics_dashboard">PUNTO DE VENTA</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Analytics Dashboard" data-filter-tags="application intel analytics dashboard" onclick="Menu.pendiente()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_analytics_dashboard">TRASLADOS RECIBIDOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Privacy" data-filter-tags="application intel privacy"  onclick="Menu.pendiente()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_privacy">CORTE DE CAJA</span>
                                        </a>
                                    </li>
                                    
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.pendiente()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">NOTAS DE CRÉDITO CLIENTES</span>
                                        </a>
                                    </li>                                   
                                    
                                </ul>
                            </li>

                            <!-- COMPRAS -->
                            <li>
                                <a href="#" title="Application Intel" data-filter-tags="application intel">
                                    <i class="fal fa-warehouse"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">COMPRAS</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="theme settings how it works"  onclick="Menu.productos()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">PRODUCTOS Y PRECIOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.compras_gestion_precios()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">GESTIÓN DE PRECIOS E IPs</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.pendiente()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">GESTIÓN DE PRECIOS MAYORISTAS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.compras_gestion_minmax()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">MINIMOS Y MÁXIMOS</span>
                                        </a>
                                    </li>
                                   
                                    <li>
                                        <a href="#" title="Privacy" data-filter-tags="application intel privacy"  onclick="Menu.compras_requisiciones()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_privacy">REQUISICIONES</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Privacy" data-filter-tags="application intel privacy"  onclick="Menu.compras_orden()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_privacy">ORDEN DE COMPRA</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Marketing Dashboard" data-filter-tags="application intel marketing dashboard"  onclick="Menu.compras()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_marketing_dashboard">COMPRAS</span>
                                        </a>
                                    </li>
                                 
                                    <li>
                                        <a href="#" title="Privacy" data-filter-tags="application intel privacy"  onclick="Menu.pendiente()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_privacy">NOTAS DE CRÉDITO PROVEEDORES</span>
                                        </a>
                                    </li>
                                    
                                    
                                </ul>
                            </li>

                             <!-- BODEGA DESPACHO -->
                             <li>
                                <a href="#" title="Application Intel" data-filter-tags="application intel">
                                    <i class="fal fa-cubes"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">MODULO BODEGA</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="#" title="Analytics Dashboard" data-filter-tags="application intel analytics dashboard" onclick="Menu.bodega_surtido()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_analytics_dashboard">RELLENO A SUCURSALES</span>
                                        </a>
                                    </li>
                                    
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.pendiente()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">TRASLADO EXTRAORDINARIO</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.pendiente()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">TRASLADO EXTRAORDINARIO</span>
                                        </a>
                                    </li>                                   
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.pendiente()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">INVENTARIO FISICO</span>
                                        </a>
                                    </li>  
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.bodega_traslados('TIN')">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">TRASLADO DESDE SUCURSAL (ENTRADA)</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.bodega_traslados('TSL')">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">TRASLADO HACIA SUCURSAL (SALIDA)</span>
                                        </a>
                                    </li>                                 
                                    
                                </ul>
                            </li>

                            <!-- INVENTARIOS -->
                            <li>
                                <a href="#" title="Theme Settings" data-filter-tags="theme settings">
                                    <i class="fal fa-box"></i>
                                    <span class="nav-link-text" data-i18n="nav.theme_settings">INVENTARIOS</span>
                                </a>
                                <ul>
                                    
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="theme settings layout options"  onclick="Menu.bodega_movinv('ENT')">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">ENTRADAS INVENTARIO</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.bodega_movinv('SAL')">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">SALIDAS INVENTARIO</span>
                                        </a>
                                    </li>
                                    
                                </ul>
                            </li>

                            <!-- ARCHIVO -->
                            <li>
                                <a href="#" title="Theme Settings" data-filter-tags="theme settings">
                                    <i class="fal fa-folder-open"></i>
                                    <span class="nav-link-text" data-i18n="nav.theme_settings">ARCHIVO</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="theme settings how it works"  onclick="Menu.documentos()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">DOCUMENTOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="theme settings layout options"  onclick="Menu.reportes()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">REPORTES</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.documentos_eliminados()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">DOCUMENTOS ELIMINADOS</span>
                                        </a>
                                    </li>
                                    
                                </ul>
                            </li>
        
                            <!-- MANTENIMIENTOS -->
                            <li>
                                <a href="#" title="Theme Settings" data-filter-tags="theme settings">
                                    <i class="fal fa-expand"></i>
                                    <span class="nav-link-text" data-i18n="nav.theme_settings">MANTENIMIENTOS</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.mantenimiento_generales()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">CLASIFICACIONES GENERALES</span>
                                        </a>
                                    </li>
                                    
                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="theme settings how it works"  onclick="Menu.clientes()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">CLIENTES</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="theme settings layout options"  onclick="Menu.proveedores()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">PROVEEDORES</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.marcas()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">MARCAS</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.medidas()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">MEDIDAS</span>
                                        </a>
                                    </li>
                                   
                                </ul>
                            </li>

                            <!-- CONFIGURACIONES -->
                            <li>
                                <a href="#" title="Theme Settings" data-filter-tags="theme settings">
                                    <i class="fal fa-cog"></i>
                                    <span class="nav-link-text" data-i18n="nav.theme_settings">CONFIGURACIONES</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="theme settings how it works"  onclick="Menu.configuraciones()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">CONFIGURACIONES GENERALES</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.config_tipodocumentos()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">TIPO DE DOCUMENTOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="theme settings layout options"  onclick="Menu.usuarios()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">USUARIOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.empresas()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">EMPRESAS</span>
                                        </a>
                                    </li>
                                    
                                </ul>
                            </li>
                            
           

        `
    },
    inicio_digitador: ()=>{
        return `
        <ul id="js-nav-menu_digitador" class="nav-menu">
                            <li>
                                <a href="#"  class="text-base"  data-filter-tags="application intel"  onclick="Navegar.inicio();">
                                    <i class="fal fa-home"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">INICIO</span>
                                </a>
                            </li>

                            
                             <li>
                                <a href="#" title="Application Intel" data-filter-tags="application intel">
                                    <i class="fal fa-chart-pie"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">OPERACIONES</span>
                                </a>
                                
                                <ul>
                                   
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.pos()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">FACTURACION</span>
                                        </a>
                                    </li>  
                                    
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.pendiente()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">NOTAS DE CRÉDITO CLIENTES</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.compras()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">COMPRAS</span>
                                        </a>
                                    </li>        
                                    
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.pendiente()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">NOTAS DE CRÉDITO PROVEEDORES</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="theme settings layout options"  onclick="Menu.bodega_movinv('ENT')">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">ENTRADAS INVENTARIO</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.bodega_movinv('SAL')">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">SALIDAS INVENTARIO</span>
                                        </a>
                                    </li>                                   
                                    
                                </ul>
                            </li>
                            
                            <li>
                                <a href="#" title="Application Intel" data-filter-tags="application intel">
                                    <i class="fal fa-warehouse"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">INVENTARIOS</span>
                                </a>
                                <ul>

                                    <li>
                                        <a href="#" title="Analytics Dashboard" data-filter-tags="application intel analytics dashboard" onclick="Menu.bodega_surtido()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_analytics_dashboard">RELLENO A SUCURSALES</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="theme settings how it works"  onclick="Menu.productos()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">PRODUCTOS Y PRECIOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.compras_gestion_precios()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">GESTIÓN DE PRECIOS Y BONOS</span>
                                        </a>
                                    </li>
                                 
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.compras_gestion_minmax()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">MINIMOS Y MÁXIMOS</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.bodega_inv_fisico()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">INVENTARIO FISICO</span>
                                        </a>
                                    </li>
                                    
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.bodega_lista_precios()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">LISTA DE PRECIOS</span>
                                        </a>
                                    </li>
                                                                       
                                    
                                </ul>
                            </li>

                          

                            <li>
                                <a href="#" title="Theme Settings" data-filter-tags="theme settings">
                                    <i class="fal fa-folder-open"></i>
                                    <span class="nav-link-text" data-i18n="nav.theme_settings">ARCHIVO</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="theme settings how it works"  onclick="Menu.documentos()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">DOCUMENTOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="theme settings layout options"  onclick="Menu.reportes()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">REPORTES</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.documentos_eliminados()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">DOCUMENTOS ELIMINADOS</span>
                                        </a>
                                    </li>
                                    
                                </ul>
                            </li>
        
                            <li>
                                <a href="#" title="Theme Settings" data-filter-tags="theme settings">
                                    <i class="fal fa-expand"></i>
                                    <span class="nav-link-text" data-i18n="nav.theme_settings">MANTENIMIENTOS</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.mantenimiento_generales()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">CLASIFICACIONES GENERALES</span>
                                        </a>
                                    </li>
                                    
                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="theme settings how it works"  onclick="Menu.clientes()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">CLIENTES (CENSO)</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="theme settings how it works"  onclick="Menu.clientes_rutas()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">RUTAS CLIENTES</span>
                                        </a>
                                    </li>
                                     <li>
                                        <a href="#" title="Layout Options" data-filter-tags="theme settings layout options"  onclick="Menu.empleados()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">EMPLEADOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="theme settings layout options"  onclick="Menu.proveedores()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">PROVEEDORES</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options" onclick="Menu.marcas()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">MARCAS</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.medidas()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">MEDIDAS</span>
                                        </a>
                                    </li>
                                   
                                </ul>
                            </li>

                            <li>
                                <a href="#" title="Theme Settings" data-filter-tags="theme settings">
                                    <i class="fal fa-cog"></i>
                                    <span class="nav-link-text" data-i18n="nav.theme_settings">CONFIGURACIONES</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="theme settings how it works"  onclick="Menu.configuraciones()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">CONFIGURACIONES GENERALES</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.config_tipodocumentos()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">TIPO DE DOCUMENTOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="theme settings layout options"  onclick="Menu.usuarios()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">USUARIOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.empresas()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">EMPRESAS</span>
                                        </a>
                                    </li>
                                    
                                </ul>
                            </li>
                            
        </ul>
                
        `
    },
    inicio_vendedor: ()=>{
        return `
                        <ul id="js-nav-menu_vendedor" class="nav-menu">
                            <li>
                                <a href="#"  class="text-base"  data-filter-tags="application intel"  onclick="Navegar.inicio();">
                                    <i class="fal fa-home"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">INICIO</span>
                                </a>
                            </li>
                            <li>
                                <a href="#"  class="text-base"  data-filter-tags="application intel"  onclick="Menu.ventas_pedidos()">
                                    <i class="fal fa-shopping-cart"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">PEDIDOS</span>
                                </a>
                            </li>
                            <li>
                                <a href="#"  class="text-base"  data-filter-tags="application intel"  onclick="Menu.ventas_censo()">
                                    <i class="fal fa-users"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">CENSO</span>
                                </a>
                            </li>                            
                        </ul>
                
        `
    },
    inicio_supervisor: ()=>{
        return `
                        <ul id="js-nav-menu_supervisor" class="nav-menu">
                            <li>
                                <a href="#"  class="text-base"  data-filter-tags="application intel"  onclick="Navegar.inicio();">
                                    <i class="fal fa-home"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">INICIO</span>
                                </a>
                            </li>
                            <li>
                                <a href="#"  class="text-base"  data-filter-tags="application intel"  onclick="Menu.ventas_pedidos()">
                                    <i class="fal fa-shopping-cart"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">PEDIDOS</span>
                                </a>
                            </li>
                            <li>
                                <a href="#"  class="text-base"  data-filter-tags="application intel"  onclick="Menu.ventas_censo()">
                                    <i class="fal fa-users"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">CENSO</span>
                                </a>
                            </li>                            
                        </ul>
        `
    },
    inicio_gerente: ()=>{
        return `
        <ul id="js-nav-menu_gerencia" class="nav-menu">
                            <li>
                                <a href="#"  class="text-base"  data-filter-tags="application intel"  onclick="Navegar.inicio();">
                                    <i class="fal fa-home"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">INICIO</span>
                                </a>
                            </li>

                            
                             <li>
                                <a href="#" title="Application Intel" data-filter-tags="application intel">
                                    <i class="fal fa-chart-pie"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">OPERACIONES</span>
                                </a>
                                
                                <ul>
                                   
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.pos()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">FACTURACION</span>
                                        </a>
                                    </li>  
                                    
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.pendiente()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">NOTAS DE CRÉDITO CLIENTES</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.compras()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">COMPRAS</span>
                                        </a>
                                    </li>        
                                    
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.pendiente()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">NOTAS DE CRÉDITO PROVEEDORES</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="theme settings layout options"  onclick="Menu.bodega_movinv('ENT')">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">ENTRADAS INVENTARIO</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.bodega_movinv('SAL')">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">SALIDAS INVENTARIO</span>
                                        </a>
                                    </li>                                   
                                    
                                </ul>
                            </li>
                            
                            <li>
                                <a href="#" title="Application Intel" data-filter-tags="application intel">
                                    <i class="fal fa-warehouse"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">INVENTARIOS</span>
                                </a>
                                <ul>

                                    <li>
                                        <a href="#" title="Analytics Dashboard" data-filter-tags="application intel analytics dashboard" onclick="Menu.bodega_surtido()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_analytics_dashboard">RELLENO A SUCURSALES</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="theme settings how it works"  onclick="Menu.productos()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">PRODUCTOS Y PRECIOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.compras_gestion_precios()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">GESTIÓN DE PRECIOS Y BONOS</span>
                                        </a>
                                    </li>
                                 
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.compras_gestion_minmax()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">MINIMOS Y MÁXIMOS</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.bodega_inv_fisico()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">INVENTARIO FISICO</span>
                                        </a>
                                    </li>
                                    
                                    <li>
                                        <a href="#" title="Introduction" data-filter-tags="application intel introduction"  onclick="Menu.bodega_lista_precios()">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">LISTA DE PRECIOS</span>
                                        </a>
                                    </li>
                                                                       
                                    
                                </ul>
                            </li>

                          

                            <li>
                                <a href="#" title="Theme Settings" data-filter-tags="theme settings">
                                    <i class="fal fa-folder-open"></i>
                                    <span class="nav-link-text" data-i18n="nav.theme_settings">ARCHIVO</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="theme settings how it works"  onclick="Menu.documentos()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">DOCUMENTOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="theme settings layout options"  onclick="Menu.reportes()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">REPORTES</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.documentos_eliminados()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">DOCUMENTOS ELIMINADOS</span>
                                        </a>
                                    </li>
                                    
                                </ul>
                            </li>
        
                            <li>
                                <a href="#" title="Theme Settings" data-filter-tags="theme settings">
                                    <i class="fal fa-expand"></i>
                                    <span class="nav-link-text" data-i18n="nav.theme_settings">MANTENIMIENTOS</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.mantenimiento_generales()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">CLASIFICACIONES GENERALES</span>
                                        </a>
                                    </li>
                                    
                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="theme settings how it works"  onclick="Menu.clientes()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">CLIENTES (CENSO)</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="theme settings how it works"  onclick="Menu.clientes_rutas()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">RUTAS CLIENTES</span>
                                        </a>
                                    </li>
                                     <li>
                                        <a href="#" title="Layout Options" data-filter-tags="theme settings layout options"  onclick="Menu.empleados()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">EMPLEADOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="theme settings layout options"  onclick="Menu.proveedores()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">PROVEEDORES</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options" onclick="Menu.marcas()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">MARCAS</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.medidas()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">MEDIDAS</span>
                                        </a>
                                    </li>
                                   
                                </ul>
                            </li>

                            <li>
                                <a href="#" title="Theme Settings" data-filter-tags="theme settings">
                                    <i class="fal fa-cog"></i>
                                    <span class="nav-link-text" data-i18n="nav.theme_settings">CONFIGURACIONES</span>
                                </a>
                                <ul>
                                    <li>
                                        <a href="#" title="How it works" data-filter-tags="theme settings how it works"  onclick="Menu.configuraciones()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">CONFIGURACIONES GENERALES</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.config_tipodocumentos()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">TIPO DE DOCUMENTOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="theme settings layout options"  onclick="Menu.usuarios()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">USUARIOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options"  onclick="Menu.empresas()">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">EMPRESAS</span>
                                        </a>
                                    </li>
                                    
                                </ul>
                            </li>
                            
        </ul>
                
        `
    },
    
}

