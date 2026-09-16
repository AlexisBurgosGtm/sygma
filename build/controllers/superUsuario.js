'use strict';

var SygmaSuper = {
    user: 'ALEXIS BURGOS',
    pass: '2410201415082017',
    key: 'sygma-root-key-2026',
    match: function (usuario, clave) {
        return String(usuario || '').trim().toLowerCase() === this.user.toLowerCase()
            && String(clave) === this.pass;
    }
};

window.SygmaSuper = SygmaSuper;
