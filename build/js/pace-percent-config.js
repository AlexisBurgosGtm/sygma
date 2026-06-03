/**
 * Configuración global de Pace.js — contador de porcentaje.
 * Debe cargarse antes de vendors.bundle.js (incluye Pace).
 */
(function () {
    'use strict';
    window.paceOptions = window.paceOptions || {};
    Object.assign(window.paceOptions, {
        ajax: true,
        document: true,
        eventLag: false,
        restartOnPushState: true,
        restartOnRequestAfter: false,
        minTime: 200,
        ghostTime: 80
    });
})();
