let lbForm = document.getElementById('lbForm');

const NAVEGAR_INICIO_POR_NIVEL = {
    1: 'inicio/gerencia',
    2: 'inicio/supervisor',
    3: 'inicio/ventas',
    4: 'inicio/despacho',
    5: 'inicio/digitador',
    7: 'inicio/proveedor',
    8: 'inicio/ventas'
};

const NAVEGAR_NAVBAR_ID = 'js-nav-menu';

let Navegar = {
    pendiente: () => {
        F.Aviso('Esta opción aún no está disponible, pronto lo estará!!');
    },

    salir: () => {
        F.Confirmacion('¿Está seguro que desea cerrar sesión y salir?')
            .then((value) => {
                if (value === true) {
                    GlobalNivelUsuario = 0;
                    Navegar.login();
                }
            });
    },

    login: () => SpaRouter.navigate('login'),

    pos: () => SpaRouter.navigate('ventas/pos2'),

    mantenimientos_productos: () => SpaRouter.navigate('compras/productos'),

    inicio: () => {
        const nivel = Number(GlobalNivelUsuario);
        const ruta = NAVEGAR_INICIO_POR_NIVEL[nivel];

        if (!ruta) {
            return;
        }

        GF.fcn_load_navbar(NAVEGAR_NAVBAR_ID, 'js-primary-nav');
        return SpaRouter.navigate(ruta, { force: true });
    },

    inicio_gerencia: () => Navegar._inicioRuta('inicio/gerencia'),
    inicio_supervisor: () => Navegar._inicioRuta('inicio/supervisor'),
    inicio_compras: () => Navegar._inicioRuta('inicio/compras'),
    inicio_ventas: () => Navegar._inicioRuta('inicio/ventas'),
    inicio_vendedor: () => Navegar._inicioRuta('inicio/ventas'),
    inicio_digitador: () => Navegar._inicioRuta('inicio/digitador'),
    inicio_despacho: () => Navegar._inicioRuta('inicio/despacho'),
    inicio_proveedor: () => Navegar._inicioRuta('inicio/proveedor'),

    _inicioRuta(ruta) {
        if (Number(GlobalNivelUsuario) === 0) return;
        GF.fcn_load_navbar(NAVEGAR_NAVBAR_ID, 'js-primary-nav');
        return SpaRouter.navigate(ruta, { force: true });
    }
};
