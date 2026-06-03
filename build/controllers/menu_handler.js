/**
 * Navegación de módulos — API Menu.* (compatibilidad) + delegación SPA.
 */
let Menu = {
    verify: () => Number(GlobalNivelUsuario) !== 0,

    pendiente: () => {
        if (Number(GlobalNivelUsuario) === 0) return false;
        F.AvisoError('Función no disponible');
        return true;
    },

    salidaMenu: () => {
        $('#modal_menu').modal('hide');
    },

    _go(route, params) {
        if (!Menu.verify()) {
            F.AvisoError('No tiene permitido entrar a esta sección');
            return Promise.resolve();
        }
        Menu.salidaMenu();
        return SpaRouter.navigate(route, { params: params || {} });
    }
};

Object.assign(Menu, SpaNav.buildMenuMethods());
