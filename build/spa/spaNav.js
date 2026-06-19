'use strict';

/**
 * Mapa Menu.* → rutas SPA y utilidades de enlaces declarativos.
 */
const SpaNav = {
    /** @type {Record<string, string>} */
    MENU_ROUTES: {
        inicio_admin: 'inicio/admin',
        inicio_compras: 'inicio/compras',
        inicio_compras_requisiones: 'inicio/compras-requisiciones',
        config_tipodocumentos: 'config/tipodocumentos',
        productos: 'compras/productos',
        pos: 'ventas/pos2',
        compras: 'compras/compras',
        compras_requisiciones: 'compras/requisiciones',
        compras_orden: 'compras/orden',
        compras_gestion_precios: 'compras/gestion-precios',
        compras_gestion_minmax: 'compras/gestion-minmax',
        bodega_surtido: 'bodega/surtido',
        bodega_inv_fisico: 'bodega/inv-fisico',
        bodega_inv_retroactivo: 'bodega/inv-retroactivo',
        bodega_lista_precios: 'bodega/lista-precios',
        documentos: 'archivo/documentos',
        reporte_bonificaciones: 'archivo/reporte-bonificaciones',
        mantenimiento_generales: 'mant/generales',
        clientes: 'mant/clientes',
        clientes_rutas: 'mant/clientes-rutas',
        municipios_departamentos: 'mant/municipios',
        empleados: 'mant/empleados',
        empleados_gps: 'mant/empleados-gps',
        proveedores: 'mant/proveedores',
        empresas: 'mant/empresas',
        medidas: 'mant/marcas',
        bi_notificaciones: 'admin/notificaciones',
        ventas_censo: 'ventas/censo',
        ventas_pedidos: 'ventas/pedidos',
        ventas_pedidos_comodin: 'ventas/pedidos-comodin',
        ventas_visitas: 'ventas/visitas',
        devoluciones_clientes: 'transacciones/devoluciones',
        devoluciones_proveedores: 'transacciones/devoluciones-proveedores',
        objetivos: 'bi/objetivos',
        objetivos_bi: 'bi/objetivos-dashboard',
        objetivos_goles: 'bi/goles',
        objetivos_cobertura: 'bi/cobertura',
        objetivos_logro_procter: 'bi/logro-procter',
        objetivos_visitas_gps: 'bi/visitas-gps',
        objetivos_cobertura_municipios: 'bi/cobertura-municipios',
        report_ventas_vendedor: 'bi/reporte-ventas-vendedor',
        report_ventas_marcas: 'bi/reporte-ventas-marcas'
    },

    /** Métodos sin vista — muestran aviso pendiente */
    MENU_PENDING: [
        'documentos_eliminados',
        'configuraciones',
        'usuarios',
        'compras_gestion_bonos'
    ],

    hash(route, params) {
        const q = Object.keys(params || {})
            .filter((k) => params[k] != null && params[k] !== '')
            .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
        return '#/' + route + (q ? '?' + q : '');
    },

    linkAttrs(route, params) {
        const p = params || {};
        const paramsJson = Object.keys(p).length ? JSON.stringify(p) : '';
        let attrs = 'href="javascript:void(0)" data-spa-route="' + route + '"';
        if (paramsJson) {
            attrs += ' data-spa-params=\'' + paramsJson.replace(/'/g, '&#39;') + '\'';
        }
        return attrs;
    },

    actionAttrs(action) {
        return 'href="#" data-spa-action="' + action + '"';
    },

    buildMenuMethods() {
        const methods = {};

        Object.keys(this.MENU_ROUTES).forEach((name) => {
            const route = this.MENU_ROUTES[name];
            methods[name] = function () {
                return Menu._go(route);
            };
        });

        this.MENU_PENDING.forEach((name) => {
            methods[name] = function () {
                return Menu.pendiente();
            };
        });

        methods.bodega_movinv = function (tipodoc) {
            return Menu._go('bodega/movinv', { tipodoc });
        };
        methods.bodega_traslados = function (tipodoc) {
            return Menu._go('bodega/traslados', { tipodoc });
        };
        methods.bodega_surtido_traslado = function (sucursal_destino) {
            return Menu._go('bodega/surtido-traslado', { sucursal_destino });
        };

        return methods;
    },

    handleAction(action) {
        switch (action) {
            case 'inicio':
                if (Number(GlobalNivelUsuario) === 0) {
                    F.AvisoError('Debe iniciar sesión.');
                    return SpaRouter.goLogin();
                }
                return SpaRouter.goHome();
            case 'salir':
                return SpaRouter.requestLogout();
            case 'pendiente':
                return Menu.pendiente();
            case 'login':
                return SpaRouter.goLogin();
            default:
                console.warn('[SpaNav] Acción desconocida:', action);
        }
    },

    navigateFromLink(el) {
        const action = el.getAttribute('data-spa-action');
        if (action) {
            return this.handleAction(action);
        }

        let route = el.getAttribute('data-spa-route');
        if (!route) return;

        if (Number(GlobalNivelUsuario) === 0) {
            F.AvisoError('No tiene permitido entrar a esta sección');
            return;
        }

        let params = {};
        const raw = el.getAttribute('data-spa-params');
        if (raw) {
            try {
                params = JSON.parse(raw);
            } catch (e) {
                console.warn('[SpaNav] data-spa-params inválido', raw);
            }
        }

        if (typeof Menu !== 'undefined' && Menu.salidaMenu) {
            Menu.salidaMenu();
        }

        document.body.classList.remove('mobile-nav-on');
        return SpaRouter.loadView(route, params, {
            skipTransition: String(route).indexOf('inicio/') === 0
        });
    }
};

window.SpaNav = SpaNav;
