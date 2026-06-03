'use strict';

/**
 * Registro central de rutas SPA.
 * path → hash (#/path)
 */
SpaRouter.registerMany({
    login: {
        script: '../views/general_login/view_login.js',
        requiresAuth: false,
        showNavbar: false,
        title: 'Login'
    },

    'inicio/gerencia': {
        script: '../views/menu/inicio_gerencia.js',
        title: 'Inicio - Gerencia'
    },
    'inicio/supervisor': {
        script: '../views/menu/inicio_supervisor.js',
        title: 'Inicio - Supervisor'
    },
    'inicio/compras': {
        script: '../views/menu/inicio_compras.js',
        title: 'Inicio - Compras'
    },
    'inicio/compras-requisiciones': {
        script: '../views/menu/inicio_compras_requisiones.js',
        title: 'Inicio - Requisiciones'
    },
    'inicio/ventas': {
        script: '../views/menu/inicio_ventas.js',
        title: 'Inicio - Ventas'
    },
    'inicio/digitador': {
        script: '../views/menu/inicio_digitador.js',
        title: 'Inicio - Digitador'
    },
    'inicio/despacho': {
        script: '../views/menu/inicio_despacho.js',
        title: 'Inicio - Despacho'
    },
    'inicio/proveedor': {
        script: '../views/menu/inicio_proveedor.js',
        title: 'Inicio - Proveedor'
    },
    'inicio/admin': {
        script: '../views/menu/menu.js',
        title: 'Menú Administración'
    },

    'config/tipodocumentos': {
        script: '../views/config_tipodocumentos/config_tipodocumentos.js',
        classes: ['../models/classTipodocumentos.js'],
        title: 'Tipos de Documento'
    },
    'config/general': {
        script: '../views/config/view_config.js',
        title: 'Configuraciones Generales'
    },

    'compras/productos': {
        script: '../views/compras_productos/view_productos.js',
        title: 'Productos y Precios'
    },
    'ventas/pos': {
        script: '../views/ventas_pos/view_pos.js',
        title: 'Punto de Venta'
    },
    'ventas/pos2': {
        script: '../views/ventas_pos/view_pos2.js',
        title: 'Punto de Venta'
    },
    'compras/compras': {
        script: '../views/compras/view_compras.js',
        title: 'Compras'
    },
    'compras/requisiciones': {
        script: '../views/compras_cotizaciones/view_compras_requisiciones.js',
        title: 'Requisiciones'
    },
    'compras/orden': {
        script: '../views/compras_cotizaciones/view_compras_orden.js',
        title: 'Orden de Compra'
    },
    'compras/gestion-precios': {
        script: '../views/compras_gestion_precios/view_compras_precios.js',
        title: 'Gestión de Precios'
    },
    'compras/gestion-bonos': {
        script: '../views/compras_gestion_bonos/view_compras_bonos.js',
        title: 'Gestión de Bonos'
    },
    'compras/gestion-minmax': {
        script: '../views/compras_gestion_minmax/view_compras_minmax.js',
        title: 'Mínimos y Máximos'
    },

    'bodega/surtido': {
        script: '../views/bodega_surtido/view_bodega_surtido_sucursales.js',
        title: 'Relleno a Sucursales'
    },
    'bodega/surtido-traslado': {
        script: '../views/bodega_surtido/view_traslados.js',
        initArgs: (p) => ['TSL', p.sucursal_destino || p.sucursal],
        title: 'Traslado Surtido'
    },
    'bodega/traslados': {
        script: '../views/bodega_traslados/view_traslados.js',
        initArgs: (p) => [p.tipodoc],
        title: 'Traslados'
    },
    'bodega/movinv': {
        script: '../views/bodega_movinv/view_movinv.js',
        initArgs: (p) => [p.tipodoc],
        title: 'Movimiento Inventario'
    },
    'bodega/inv-fisico': {
        script: '../views/bodega_inv_fisico/view_inv_fisico.js',
        title: 'Inventario Físico'
    },
    'bodega/inv-retroactivo': {
        script: '../views/bodega_inv_fisico/view_inv_retroactivo.js',
        title: 'Inventario Retroactivo'
    },
    'bodega/lista-precios': {
        script: '../views/bodega_lista_precios/view_lista_precios.js',
        title: 'Lista de Precios'
    },

    'archivo/documentos': {
        script: '../views/archivo_documentos/view_documentos.js',
        classes: ['../models/classTipodocumentos.js'],
        title: 'Documentos'
    },
    'archivo/reporte-bonificaciones': {
        script: '../views/archivo_reportes/view_reporte_bonificaciones.js',
        classes: ['../models/classTipodocumentos.js'],
        title: 'Reporte Bonificaciones'
    },

    'mant/generales': {
        script: '../views/mant_clasificaciones_generales/view_mant_generales.js',
        title: 'Mantenimiento General'
    },
    'mant/clientes': {
        script: '../views/mant_clientes/view_clientes.js',
        title: 'Clientes'
    },
    'mant/clientes-rutas': {
        script: '../views/mant_clientes/view_clientes_rutas.js',
        title: 'Rutas de Clientes'
    },
    'mant/municipios': {
        script: '../views/mant_mundeptos/view_mun_deptos.js',
        title: 'Municipios y Departamentos'
    },
    'mant/empleados': {
        script: '../views/mant_empleados/view_empleados.js',
        title: 'Empleados'
    },
    'mant/empleados-gps': {
        script: '../views/mant_empleados/view_empleados_gps.js',
        title: 'Empleados GPS'
    },
    'mant/marcas': {
        script: '../views/mant_marcas/view_marcas.js',
        title: 'Marcas y Medidas'
    },
    'mant/proveedores': {
        script: '../views/mant_proveedores/view_proveedores.js',
        title: 'Proveedores'
    },
    'mant/empresas': {
        script: '../views/mant_empresas/view_empresas.js',
        title: 'Empresas'
    },

    'gerencia/autorizacion-precios': {
        script: '../views/gerencia_precios/autorizacion_precios.js',
        title: 'Autorización de Precios'
    },

    'admin/notificaciones': {
        script: '../views/administracion/view_tablero_notificaciones.js',
        title: 'Notificaciones'
    },

    'ventas/censo': {
        script: '../views/ventas_censo/view_censo.js',
        title: 'Censo'
    },
    'ventas/pedidos': {
        script: '../views/ventas_pedidos/view_pedidos.js',
        title: 'Pedidos'
    },
    'ventas/pedidos-comodin': {
        script: '../views/ventas_pedidos/view_pedidos_comodin.js',
        title: 'Pedidos Comodín'
    },
    'ventas/visitas': {
        script: '../views/ventas_visitas/view_visitas_ventas.js',
        title: 'Visitas de Venta'
    },

    'transacciones/devoluciones': {
        script: '../views/transacciones/view_devoluciones.js',
        title: 'Devoluciones'
    },
    'transacciones/devoluciones-proveedores': {
        script: '../views/transacciones/view_devoluciones_proveedores.js',
        title: 'Notas de credito a Proveedores'
    },

    'bi/objetivos': {
        script: '../views/bi_objetivos/view_objetivos.js',
        title: 'Objetivos'
    },
    'bi/objetivos-dashboard': {
        script: '../views/bi_objetivos/view_bi_objetivos.js',
        title: 'Objetivos BI'
    },
    'bi/goles': {
        script: '../views/bi_objetivos/view_objetivos_goles.js',
        title: 'Goles'
    },
    'bi/cobertura': {
        script: '../views/bi_objetivos/view_objetivo_cobertura.js',
        title: 'Cobertura'
    },
    'bi/logro-procter': {
        script: '../views/bi_objetivos/view_avance_procter_vendedor.js',
        title: 'Logro Procter'
    },
    'bi/visitas-gps': {
        script: '../views/bi_objetivos/view_visitas_vendedores_gps.js',
        title: 'Visitas GPS'
    },
    'bi/cobertura-municipios': {
        script: '../views/bi_objetivos/view_cobertura_municipios_mapa.js',
        title: 'Cobertura Municipios'
    },
    'bi/reporte-ventas-vendedor': {
        script: '../views/bi_objetivos/view_rpt_ventas_vendedor.js',
        title: 'Ventas por Vendedor'
    },
    'bi/reporte-ventas-marcas': {
        script: '../views/bi_objetivos/view_rpt_ventas_marcas.js',
        title: 'Ventas por Marca'
    }
});
