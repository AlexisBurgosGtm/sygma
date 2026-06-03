/**
 * Tema POS2 global — activa estilos en toda la aplicación SPA.
 * CSS principal: css/spa-pos2-theme.css (enlazado desde index.html)
 */
'use strict';

function spa_inyectarEstilosPos2() {
    document.body.classList.add('app-pos2-theme');

    if (!document.getElementById('spa-pos2-theme-css')) {
        const link = document.createElement('link');
        link.id = 'spa-pos2-theme-css';
        link.rel = 'stylesheet';
        link.href = './css/spa-pos2-theme.css';
        document.head.appendChild(link);
    }
}

function spa_quitarTemaPos2() {
    document.body.classList.remove('app-pos2-theme');
}

/** Llamada al cargar la app (antes del router) */
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', spa_inyectarEstilosPos2);
    } else {
        spa_inyectarEstilosPos2();
    }
}
