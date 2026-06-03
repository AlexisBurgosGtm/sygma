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

const NAVEGAR_NAVBAR_POR_NIVEL = {
    1: ['GERENCIA', 'js-nav-menu_gerencia'],
    2: ['SUPERVISOR', 'js-nav-menu_supervisor'],
    3: ['VENDEDOR', 'js-nav-menu_vendedor'],
    4: ['REPARTIDOR', 'js-nav-menu_repartidor'],
    5: ['DIGITADOR', 'js-nav-menu_digitador'],
    7: ['PROVEEDOR', 'js-nav-menu_proveedor'],
    8: ['VENDEDOR', 'js-nav-menu_vendedor']
};

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
        const navbar = NAVEGAR_NAVBAR_POR_NIVEL[nivel];

        if (!ruta || !navbar) {
            return;
        }

        GF.fcn_load_navbar(navbar[0], navbar[1], 'js-primary-nav');
        return SpaRouter.navigate(ruta);
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
        return SpaRouter.navigate(ruta);
    }
};
