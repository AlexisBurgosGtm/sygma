let lbForm = document.getElementById('lbForm');
let _sygmaSalirEnCurso = false;

let Navegar = {
    pendiente: () => {
        F.Aviso('Esta opción aún no está disponible, pronto lo estará!!');
    },

    salir: () => {
        if (_sygmaSalirEnCurso) return;
        _sygmaSalirEnCurso = true;

        F.Confirmacion('¿Está seguro que desea cerrar sesión y salir?')
            .then((value) => {
                _sygmaSalirEnCurso = false;
                if (value !== true) return;

                GlobalNivelUsuario = 0;
                if (typeof sygma_updateHeaderUsuario === 'function') {
                    sygma_updateHeaderUsuario();
                }
                Navegar.login();
            })
            .catch(() => {
                _sygmaSalirEnCurso = false;
            });
    },

    login: () => {
        GlobalNivelUsuario = 0;
        if (typeof sygma_updateHeaderUsuario === 'function') {
            sygma_updateHeaderUsuario();
        }

        F.loadScript('../views/general_login/view_login.js', 'root')
            .then(() => {
                Navegar.ocultarMenu();
                initView();
            });
    },

    ocultarMenu: () => {
        const nav = document.getElementById('js-primary-nav');
        const sidebar = document.getElementById('root_navbar');
        if (nav) {
            nav.innerHTML = '';
            nav.style.visibility = 'hidden';
        }
        if (sidebar) sidebar.style.display = 'none';
        document.body.classList.add('login-active', 'spa-nav-hidden');
    },

    enVistaPerfil: (containerId) => {
        return !!document.getElementById(containerId);
    },

    usaMenuSoloCards: () => {
        const nivel = Number(GlobalNivelUsuario);
        return nivel === 2 || nivel === 3 || nivel === 4 || nivel === 7 || nivel === 8;
    },

    getMenuRole: () => {
        switch (Number(GlobalNivelUsuario)) {
            case 1:
                return 'GERENCIA';
            case 3:
                return 'VENDEDOR';
            case 4:
                return 'REPARTIDOR';
            case 5:
                return 'DIGITADOR';
            case 8:
                return 'VENDEDOR_COMODIN';
            default:
                return 'DIGITADOR';
        }
    },

    getNavMenuId: (menuRole) => {
        switch (menuRole) {
            case 'GERENCIA':
                return 'js-nav-menu';
            case 'VENDEDOR':
            case 'VENDEDOR_COMODIN':
                return 'js-nav-menu_vendedor';
            case 'DIGITADOR':
                return 'js-nav-menu';
            default:
                return 'js-nav-menu';
        }
    },

    mostrarMenu: () => {
        document.body.classList.remove('login-active');
        if (typeof login_setPageMode === 'function') {
            login_setPageMode(false);
        }

        const nav = document.getElementById('js-primary-nav');
        const sidebar = document.getElementById('root_navbar');

        if (Navegar.usaMenuSoloCards()) {
            document.body.classList.add('spa-nav-hidden');
            if (sidebar) sidebar.style.display = 'none';
            if (nav) {
                nav.innerHTML = '';
                nav.style.visibility = 'hidden';
            }
            return;
        }

        document.body.classList.remove('spa-nav-hidden');
        if (sidebar) sidebar.style.display = '';
        if (nav) {
            nav.style.visibility = 'visible';
            nav.style.display = '';
        }

        const menuRole = Navegar.getMenuRole();
        if (typeof GF !== 'undefined' && GF.fcn_load_navbar) {
            GF.fcn_load_navbar(menuRole, Navegar.getNavMenuId(menuRole), 'js-primary-nav');
        }
    },

    /** Menú general INICIO y post-login — siempre F.loadScript legacy */
    inicio: () => {
        if (Number(GlobalNivelUsuario) === 0) return;
        Navegar.mostrarMenu();

        switch (Number(GlobalNivelUsuario)) {
            case 1:
                Navegar.inicio_gerencia();
                break;
            case 2:
                Navegar.inicio_supervisor();
                break;
            case 3:
                Navegar.inicio_vendedor();
                break;
            case 4:
                Navegar.inicio_despacho();
                break;
            case 5:
                Navegar.inicio_digitador();
                break;
            case 6:
                Navegar.inicio_compras();
                break;
            case 7:
                Navegar.inicio_proveedor();
                break;
            case 8:
                Navegar.inicio_vendedor();
                break;
            default:
                F.AvisoError('No hay inicio configurado para su perfil.');
        }
    },

    inicio_gerencia: () => {
        if (Number(GlobalNivelUsuario) === 0) return;
        F.loadScript('../views/menu/inicio_gerencia.js', 'root').then(() => initView());
    },

    inicio_supervisor: () => {
        if (Number(GlobalNivelUsuario) === 0) return;
        if (Navegar.enVistaPerfil('supervisorSidebar') && typeof supervisor_showHome === 'function') {
            if (typeof supervisor_teardownEmbed === 'function') {
                supervisor_teardownEmbed();
            }
            supervisor_showHome();
            return;
        }
        F.loadScript('../views/menu/INICIO_SUPERVISOR/inicio_supervisor.js', 'root').then(() => initView());
    },

    inicio_compras: () => {
        if (Number(GlobalNivelUsuario) === 0) return;
        F.loadScript('../views/menu/inicio_compras.js', 'root').then(() => initView());
    },

    inicio_ventas: () => {
        if (Number(GlobalNivelUsuario) === 0) return;
        F.loadScript('../views/menu/INICIO_VENTAS/inicio_ventas.js', 'root').then(() => initView());
    },

    inicio_vendedor: () => {
        if (Number(GlobalNivelUsuario) === 0) return;
        if (Navegar.enVistaPerfil('ventasSidebar') && typeof ventas_showHome === 'function') {
            if (typeof ventas_teardownEmbed === 'function') {
                ventas_teardownEmbed();
            }
            ventas_showHome();
            return;
        }
        F.loadScript('../views/menu/INICIO_VENTAS/inicio_ventas.js', 'root').then(() => initView());
    },

    inicio_digitador: () => {
        if (Number(GlobalNivelUsuario) === 0) return;
        F.loadScript('../views/menu/INICIO_DIGITADOR/inicio_digitador.js', 'root').then(() => initView());
    },

    inicio_despacho: () => {
        if (Number(GlobalNivelUsuario) === 0) return;
        F.loadScript('../views/menu/INICIO_DESPACHO/inicio_despacho.js', 'root').then(() => initView());
    },

    inicio_proveedor: () => {
        if (Number(GlobalNivelUsuario) === 0) return;
        if (Navegar.enVistaPerfil('proveedorSidebar') && typeof proveedor_showHome === 'function') {
            if (typeof proveedor_teardownEmbed === 'function') {
                proveedor_teardownEmbed();
            }
            proveedor_showHome();
            return;
        }
        F.loadScript('../views/menu/INICIO_PROVEEDOR/inicio_proveedor.js', 'root').then(() => initView());
    }
};

window.Navegar = Navegar;
window.sygmaGoInicio = function () { return Navegar.inicio(); };
window.sygmaCerrarSesion = function () { return Navegar.salir(); };

/** Botones flotantes en módulos (data-spa-action) — no afecta al menú lateral general */
document.addEventListener('click', function (e) {
    const inicio = e.target.closest('[data-spa-action="inicio"]');
    if (inicio) {
        e.preventDefault();
        Navegar.inicio();
        return;
    }
    const salir = e.target.closest('[data-spa-action="salir"]');
    if (salir) {
        e.preventDefault();
        Navegar.salir();
    }
}, true);
