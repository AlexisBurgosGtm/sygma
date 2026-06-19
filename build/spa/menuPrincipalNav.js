'use strict';

/** Montaje del menú lateral. Navegación: SpaRouter.loadView / goHome / goLogin */
const MenuPrincipal = {
    get HOME_BY_LEVEL() {
        return SpaRouter.HOME_BY_LEVEL;
    },

    resolveHomeRoute() {
        return SpaRouter.resolveHomeRoute();
    },

    irInicio() {
        return SpaRouter.goHome();
    },

    irLogin() {
        return SpaRouter.goLogin();
    },

    cerrarSesion() {
        return SpaRouter.requestLogout();
    },

    irRuta(route, params) {
        if (Number(GlobalNivelUsuario) === 0) {
            F.AvisoError('No tiene permitido entrar a esta sección');
            return Promise.resolve(false);
        }
        if (!route) return Promise.resolve(false);
        SpaRouter._beforeMainNav();
        return SpaRouter.loadView(route, params || {}, {
            skipTransition: String(route).indexOf('inicio/') === 0
        });
    },

    mountNav(containerId) {
        const container = document.getElementById(containerId || 'js-primary-nav');
        if (!container) return;

        if (typeof botones_menu === 'undefined' || !botones_menu.menu_principal) {
            return;
        }

        if (!container.querySelector('[data-mp-action="home"]')) {
            container.innerHTML = botones_menu.menu_principal();
        }

        container.style.visibility = 'visible';

        const menu = container.querySelector('#js-nav-menu');
        if (menu && window.$ && $.fn.navigation && !$(menu).hasClass('js-nav-built')) {
            $(menu).navigation({
                accordion: true,
                animate: 'easeOutExpo',
                speed: 200,
                closedSign: '+',
                openedSign: '-',
                initClass: 'js-nav-built'
            });
        }
    },

    bindHeaderLogout() {
        const btn = document.getElementById('btnMpLogout');
        if (!btn) return;
        btn.setAttribute('href', 'javascript:void(0)');
    }
};

window.MenuPrincipal = MenuPrincipal;
