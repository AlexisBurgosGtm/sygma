let botones_menu = {
    menu_principal: ()=>{
        return `
        <div class="sygma-nav-brand hidden-nav-function-minify">
            <div class="sygma-nav-brand__logo">
                <img src="./favicon.png" alt="SYGMA" width="34" height="34">
            </div>
            <div class="sygma-nav-brand__text">
                <span class="sygma-nav-brand__title">SYGMA</span>
                <span class="sygma-nav-brand__sub">Menú general</span>
            </div>
        </div>
        <ul id="js-nav-menu" class="nav-menu sygma-nav-menu">
                            <li>
                                <a href="#" class="text-base"  data-filter-tags="application intel" data-spa-action="inicio">
                                    <i class="fal fa-home"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">INICIO</span>
                                </a>
                            </li>

                            
                             <li>
                                <a title="Application Intel" data-filter-tags="application intel">
                                    <i class="fal fa-chart-pie"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">OPERACIONES</span>
                                </a>
                                
                                <ul>
                                   
                                    <li>
                                        <a title="Introduction" data-filter-tags="application intel introduction" href="#/ventas/pos2" data-spa-route="ventas/pos2">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">FACTURACION</span>
                                        </a>
                                    </li>  
                                    
                                    <li>
                                        <a title="Introduction" data-filter-tags="application intel introduction" href="#/transacciones/devoluciones" data-spa-route="transacciones/devoluciones">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">NOTAS DE CRÃ‰DITO CLIENTES</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a title="Introduction" data-filter-tags="application intel introduction" href="#/compras/compras" data-spa-route="compras/compras">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">COMPRAS</span>
                                        </a>
                                    </li>        
                                    
                                    <li>
                                        <a title="Introduction" data-filter-tags="application intel introduction notas credito proveedores" href="#/transacciones/devoluciones-proveedores" data-spa-route="transacciones/devoluciones-proveedores">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">NOTAS DE CRÃ‰DITO PROVEEDORES</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a title="Layout Options" data-filter-tags="theme settings layout options" href="#/bodega/movinv?tipodoc=ENT" data-spa-route="bodega/movinv" data-spa-params='{"tipodoc":"ENT"}'>
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">ENTRADAS INVENTARIO</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="Skin Options" data-filter-tags="theme settings skin options" href="#/bodega/movinv?tipodoc=SAL" data-spa-route="bodega/movinv" data-spa-params='{"tipodoc":"SAL"}'>
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">SALIDAS INVENTARIO</span>
                                        </a>
                                    </li>                                   
                                    
                                </ul>
                            </li>
                            
                            <li>
                                <a title="Application Intel" data-filter-tags="application intel">
                                    <i class="fal fa-warehouse"></i>
                                    <span class="nav-link-text" data-i18n="nav.application_intel">INVENTARIOS</span>
                                </a>
                                <ul>

                                    <li>
                                        <a title="Analytics Dashboard" data-filter-tags="application intel analytics dashboard" href="#/bodega/surtido" data-spa-route="bodega/surtido">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_analytics_dashboard">RELLENO A SUCURSALES</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a title="How it works" data-filter-tags="theme settings how it works" href="#/compras/productos" data-spa-route="compras/productos">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">PRODUCTOS Y PRECIOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="Introduction" data-filter-tags="application intel introduction" href="#/compras/gestion-precios" data-spa-route="compras/gestion-precios">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">GESTIÃ“N DE PRECIOS Y BONOS</span>
                                        </a>
                                    </li>
                                 
                                    <li>
                                        <a title="Introduction" data-filter-tags="application intel introduction" href="#/compras/gestion-minmax" data-spa-route="compras/gestion-minmax">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">MINIMOS Y MÃXIMOS</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a title="Introduction" data-filter-tags="application intel introduction" href="#/bodega/inv-fisico" data-spa-route="bodega/inv-fisico">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">INVENTARIO FISICO</span>
                                        </a>
                                    </li>
                                     <li>
                                        <a title="Introduction" data-filter-tags="application intel introduction" href="#/bodega/inv-retroactivo" data-spa-route="bodega/inv-retroactivo">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">INVENTARIO RETROACTIVO</span>
                                        </a>
                                    </li>
                                    
                                    <li>
                                        <a title="Introduction" data-filter-tags="application intel introduction" href="#/bodega/lista-precios" data-spa-route="bodega/lista-precios">
                                            <span class="nav-link-text" data-i18n="nav.application_intel_introduction">LISTA DE PRECIOS</span>
                                        </a>
                                    </li>
                                                                       
                                    
                                </ul>
                            </li>

                           
                            <li>
                                <a title="Theme Settings" data-filter-tags="theme settings">
                                    <i class="fal fa-chart-pie"></i>
                                    <span class="nav-link-text" data-i18n="nav.theme_settings">OBJETIVOS / REPORTES</span>
                                </a>
                                <ul>
                                    <li>
                                        <a title="Layout Options" data-filter-tags="theme settings layout options" href="#/bi/objetivos" data-spa-route="bi/objetivos">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">GESTION DE OBJETIVOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="How it works" data-filter-tags="theme settings how it works" href="#/bi/objetivos-dashboard" data-spa-route="bi/objetivos-dashboard">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">LOGRO DE OBJETIVOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="How it works" data-filter-tags="theme settings how it works" href="#/bi/goles" data-spa-route="bi/goles">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">GOLES P&G</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="How it works" data-filter-tags="theme settings how it works" href="#/bi/cobertura" data-spa-route="bi/cobertura">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">COBERTURA CLIENTES</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="How it works" data-filter-tags="theme settings how it works" href="#/bi/logro-procter" data-spa-route="bi/logro-procter">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">LOGRO P&G</span>
                                        </a>
                                    </li>
                                     <li>
                                        <a title="How it works" data-filter-tags="theme settings how it works" href="#/mant/empleados-gps" data-spa-route="mant/empleados-gps">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">UBICACIONES EMPLEADOS (GPS)</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="How it works" data-filter-tags="theme settings how it works" href="#/bi/visitas-gps" data-spa-route="bi/visitas-gps">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">VISITAS VENDEDORES GPS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="How it works" data-filter-tags="theme settings how it works" href="#/bi/cobertura-municipios" data-spa-route="bi/cobertura-municipios">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">COBERTURA MUNICIPIOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="Layout Options" data-filter-tags="theme settings layout options" href="#/bi/reporte-ventas-vendedor" data-spa-route="bi/reporte-ventas-vendedor">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">VENTAS VENDEDOR</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="Layout Options" data-filter-tags="theme settings layout options" href="#/bi/reporte-ventas-marcas" data-spa-route="bi/reporte-ventas-marcas">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">VENTAS POR MARCAS</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a title="Theme Settings" data-filter-tags="theme settings">
                                    <i class="fal fa-folder-open"></i>
                                    <span class="nav-link-text" data-i18n="nav.theme_settings">ARCHIVO</span>
                                </a>
                                <ul>
                                    <li>
                                        <a title="How it works" data-filter-tags="theme settings how it works" href="#/archivo/documentos" data-spa-route="archivo/documentos">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">DOCUMENTOS</span>
                                        </a>
                                    </li>
                                     <li>
                                        <a title="Layout Options" data-filter-tags="theme settings layout options" href="#/ventas/visitas" data-spa-route="ventas/visitas">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">CLIENTES NO VISITADOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="Layout Options" data-filter-tags="theme settings layout options" href="#/archivo/reporte-bonificaciones" data-spa-route="archivo/reporte-bonificaciones">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">REPORTE DE BONIFICACIONES ENTREGADAS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Skin Options" data-filter-tags="theme settings skin options" data-spa-action="pendiente">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">DOCUMENTOS ELIMINADOS</span>
                                        </a>
                                    </li>
                                    
                                </ul>
                            </li>
        
                            <li>
                                <a title="Theme Settings" data-filter-tags="theme settings">
                                    <i class="fal fa-expand"></i>
                                    <span class="nav-link-text" data-i18n="nav.theme_settings">MANTENIMIENTOS</span>
                                </a>
                                <ul>
                                    <li>
                                        <a title="Skin Options" data-filter-tags="theme settings skin options" href="#/mant/generales" data-spa-route="mant/generales">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">CLASIFICACIONES GENERALES</span>
                                        </a>
                                    </li>
                                    
                                    <li>
                                        <a title="How it works" data-filter-tags="theme settings how it works" href="#/mant/clientes" data-spa-route="mant/clientes">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">CLIENTES (CENSO)</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="How it works" data-filter-tags="theme settings how it works" href="#/mant/clientes-rutas" data-spa-route="mant/clientes-rutas">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">RUTAS CLIENTES</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="How it works" data-filter-tags="theme settings how it works" href="#/mant/municipios" data-spa-route="mant/municipios">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">MUNICIPIOS/DEPARTAMENTOS</span>
                                        </a>
                                    </li>
                                     <li>
                                        <a title="Layout Options" data-filter-tags="theme settings layout options" href="#/mant/empleados" data-spa-route="mant/empleados">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">EMPLEADOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="Layout Options" data-filter-tags="theme settings layout options" href="#/mant/proveedores" data-spa-route="mant/proveedores">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">PROVEEDORES</span>
                                        </a>
                                    </li>
                                    

                                    <li>
                                        <a title="Skin Options" data-filter-tags="theme settings skin options" href="#/mant/marcas" data-spa-route="mant/marcas">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">MEDIDAS</span>
                                        </a>
                                    </li>
                                   
                                </ul>
                            </li>

                            <li>
                                <a title="Theme Settings" data-filter-tags="theme settings">
                                    <i class="fal fa-cog"></i>
                                    <span class="nav-link-text" data-i18n="nav.theme_settings">CONFIGURACIONES</span>
                                </a>
                                <ul>
                                    <li>
                                        <a title="Configuraciones generales" data-filter-tags="theme settings how it works" href="#/config/general" data-spa-route="config/general">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_how_it_works">CONFIGURACIONES GENERALES</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="Skin Options" data-filter-tags="theme settings skin options" href="#/config/tipodocumentos" data-spa-route="config/tipodocumentos">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">TIPO DE DOCUMENTOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Layout Options" data-filter-tags="theme settings layout options" data-spa-action="pendiente">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_layout_options">USUARIOS</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a title="Skin Options" data-filter-tags="theme settings skin options" href="#/mant/empresas" data-spa-route="mant/empresas">
                                            <span class="nav-link-text" data-i18n="nav.theme_settings_skin_options">EMPRESAS</span>
                                        </a>
                                    </li>
                                    
                                </ul>
                            </li>
                            
        </ul>
                
        `
    },
    inicio_digitador: () => botones_menu.menu_principal(),
}
