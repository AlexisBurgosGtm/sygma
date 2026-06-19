'use strict';

/**
 * Navegación por clic — sin hashes.
 * Registro de rutas en routes.js. Cada vista expone initView (y opcional destroyView).
 */
const SpaRouter = {

    routes: Object.create(null),
    containerId: 'root',
    currentPath: null,
    _navQueue: Promise.resolve(),

    HOME_BY_LEVEL: {
        1: 'inicio/gerencia',
        2: 'inicio/supervisor',
        3: 'inicio/ventas',
        4: 'inicio/despacho',
        5: 'inicio/digitador',
        6: 'inicio/compras',
        7: 'inicio/proveedor',
        8: 'inicio/ventas'
    },

    HOME_PANEL_FN: {
        'inicio/digitador': 'digitador_showHome',
        'inicio/supervisor': 'supervisor_showHome',
        'inicio/proveedor': 'proveedor_showHome'
    },

    register(path, config) {
        const normalized = this._normalizePath(path);
        this.routes[normalized] = Object.assign(
            { requiresAuth: true, showNavbar: true, title: '' },
            config
        );
        return this;
    },

    registerMany(routeMap) {
        Object.keys(routeMap).forEach((path) => {
            this.register(path, routeMap[path]);
        });
        return this;
    },

    start() {
        document.addEventListener('click', (e) => this._onDocumentClick(e), true);
        this.goLogin();
    },

    resolveHomeRoute() {
        return this.HOME_BY_LEVEL[Number(GlobalNivelUsuario)] || null;
    },

    loadView(path, params, options) {
        params = params || {};
        options = options || {};
        const self = this;
        const task = () => self._loadViewNow(path, params, options);
        this._navQueue = this._navQueue.then(task, task);
        return this._navQueue;
    },

    showView(path, options) {
        options = options || {};
        return this.loadView(path, options.params || {}, {
            skipTransition: options.skipTransition !== false
        });
    },

    navigate(path, options) {
        options = options || {};
        return this.loadView(path, options.params || {}, {
            skipTransition: options.skipTransition !== false
        });
    },

    goHome() {
        if (Number(GlobalNivelUsuario) === 0) {
            return this.goLogin();
        }
        const route = this.resolveHomeRoute();
        if (!route) {
            if (window.F && F.AvisoError) {
                F.AvisoError('No hay inicio configurado para su perfil.');
            }
            return Promise.resolve(false);
        }
        this._beforeMainNav();
        return this.loadView(route, {}, { skipTransition: true }).then((ok) => {
            if (!ok) return ok;
            const panelFn = this.HOME_PANEL_FN[route];
            if (panelFn && typeof window[panelFn] === 'function') {
                window[panelFn]();
            }
            return ok;
        });
    },

    goLogin() {
        GlobalNivelUsuario = 0;
        if (typeof sygma_updateHeaderUsuario === 'function') {
            sygma_updateHeaderUsuario();
        }
        return this.loadView('login', {}, { skipTransition: true });
    },

    requestLogout() {
        if (!window.F || typeof F.Confirmacion !== 'function') {
            return this.goLogin();
        }
        return F.Confirmacion('¿Está seguro que desea cerrar sesión y salir?')
            .then((ok) => (ok === true ? this.goLogin() : undefined));
    },

    renderTo(path, options) {
        return this.showView(path, options);
    },

    _beforeMainNav() {
        document.body.classList.remove('mobile-nav-on');
        if (typeof Menu !== 'undefined' && Menu.salidaMenu) {
            Menu.salidaMenu();
        }
    },

    _onDocumentClick(event) {
        const home = event.target.closest('[data-mp-action="home"]');
        if (home) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.goHome();
            return;
        }

        const logout = event.target.closest('#btnMpLogout');
        if (logout) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.requestLogout();
            return;
        }

        const mpLink = event.target.closest('#js-primary-nav [data-mp-route]');
        if (mpLink) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this._openMenuRoute(mpLink);
            return;
        }

        const link = event.target.closest('[data-spa-route],[data-spa-action]');
        if (!link) return;

        event.preventDefault();
        event.stopPropagation();
        if (window.SpaNav) {
            SpaNav.navigateFromLink(link);
        }
    },

    _openMenuRoute(link) {
        if (Number(GlobalNivelUsuario) === 0) {
            if (window.F && F.AvisoError) {
                F.AvisoError('No tiene permitido entrar a esta sección');
            }
            return;
        }
        const route = link.getAttribute('data-mp-route');
        if (!route) return;

        let params = {};
        const raw = link.getAttribute('data-mp-params') || link.getAttribute('data-spa-params');
        if (raw) {
            try { params = JSON.parse(raw); } catch (e) { /* ignore */ }
        }

        this._beforeMainNav();
        this.loadView(route, params, {
            skipTransition: String(route).indexOf('inicio/') === 0
        });
    },

    async _loadViewNow(path, params, options) {
        options = options || {};
        const normalized = this._normalizePath(path);
        const route = this.routes[normalized];

        if (!route) {
            console.warn('[SpaRouter] Ruta no registrada:', normalized);
            if (window.F && F.AvisoError) {
                F.AvisoError('La sección solicitada no existe.');
            }
            return false;
        }

        if (route.requiresAuth && Number(GlobalNivelUsuario) === 0 && normalized !== 'login') {
            return this._loadViewNow('login', {}, { skipTransition: true });
        }

        try {
            if (this.currentPath) {
                this._runDestroy(this.currentPath);
            }

            await this._teardown();
            this._applyLayout(route);

            if (route.title) {
                document.title = route.title;
            }

            const initArgs = typeof route.initArgs === 'function'
                ? route.initArgs(params)
                : (route.initArgs || []);

            await this._loadClasses(route.classes);
            await this._ensureView(normalized, route.script, initArgs, options);

            this.currentPath = normalized;
            return true;
        } catch (err) {
            console.error('[SpaRouter] loadView:', normalized, err);
            if (normalized === 'login') {
                this._restoreMainLayout();
            }
            if (window.F && F.AvisoError) {
                F.AvisoError('No se pudo cargar la pantalla.');
            }
            return false;
        }
    },

    _resolveHooks(path) {
        if (window.__spaViewHooks && window.__spaViewHooks[path]) {
            return window.__spaViewHooks[path];
        }
        return null;
    },

    _runDestroy(path) {
        const hooks = this._resolveHooks(path);
        if (hooks && typeof hooks.destroyView === 'function') {
            try { hooks.destroyView(); } catch (e) { /* sin teardown */ }
        }
    },

    _runInit(path, initArgs, options) {
        options = options || {};
        const hooks = this._resolveHooks(path);
        if (!hooks || typeof hooks.initView !== 'function') {
            throw new Error('initView no disponible para: ' + path);
        }
        if (!options.skipTransition && document.startViewTransition) {
            try {
                return document.startViewTransition(function () {
                    hooks.initView.apply(null, initArgs);
                }).finished;
            } catch (e) {
                hooks.initView.apply(null, initArgs);
            }
            return;
        }
        hooks.initView.apply(null, initArgs);
    },

    _ensureView(path, scriptUrl, initArgs, options) {
        const cached = this._resolveHooks(path);
        if (cached && typeof cached.initView === 'function') {
            return Promise.resolve(this._runInit(path, initArgs, options));
        }

        return new Promise((resolve, reject) => {
            const separator = scriptUrl.includes('?') ? '&' : '?';
            const script = document.createElement('script');
            script.src = scriptUrl + separator + '_v=' + Date.now();
            script.setAttribute('data-spa-view', 'true');

            script.onload = () => {
                try {
                    window.__spaViewHooks = window.__spaViewHooks || {};
                    if (!window.__spaViewHooks[path] && typeof window.initView === 'function') {
                        window.__spaViewHooks[path] = {
                            initView: window.initView,
                            destroyView: typeof window.destroyView === 'function'
                                ? window.destroyView
                                : function () {}
                        };
                    }
                    if (!this._resolveHooks(path)) {
                        reject(new Error('initView no disponible para: ' + path));
                        return;
                    }
                    this._runInit(path, initArgs, options);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            };

            script.onerror = () => reject(new Error('Error al cargar: ' + scriptUrl));
            document.head.appendChild(script);
        });
    },

    _restoreMainLayout() {
        document.body.classList.remove('spa-nav-hidden', 'login-active');
        const sidebar = document.getElementById('root_navbar');
        const nav = document.getElementById('js-primary-nav');
        if (sidebar) sidebar.style.display = '';
        if (nav) nav.style.visibility = 'visible';
    },

    _applyLayout(route) {
        const sidebar = document.getElementById('root_navbar');
        const nav = document.getElementById('js-primary-nav');
        const hideNav = route.showNavbar === false;

        document.body.classList.toggle('spa-nav-hidden', hideNav);

        if (sidebar) {
            sidebar.style.display = hideNav ? 'none' : '';
        }
        if (nav) {
            nav.style.visibility = hideNav ? 'hidden' : 'visible';
        }

        if (typeof sygma_updateHeaderUsuario === 'function') {
            sygma_updateHeaderUsuario();
        }

        if (!hideNav && Number(GlobalNivelUsuario) !== 0 && window.MenuPrincipal) {
            MenuPrincipal.mountNav('js-primary-nav');
        }
    },

    async _teardown() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = '';
        }

        document.querySelectorAll('script[data-spa-view]').forEach((el) => el.remove());

        if ($ && $.fn && $.fn.DataTable) {
            try {
                $.fn.dataTable.tables({ visible: true, api: true }).destroy();
            } catch (e) { /* sin tablas activas */ }
        }
    },

    async _loadClasses(classUrls) {
        if (!classUrls || !classUrls.length) return;
        if (!this._loadedClassUrls) this._loadedClassUrls = new Set();

        for (const url of classUrls) {
            if (this._loadedClassUrls.has(url)) continue;
            await F.loadClass(url, this.containerId);
            this._loadedClassUrls.add(url);
        }
    },

    _normalizePath(path) {
        return String(path || '')
            .replace(/^#?\/?/, '')
            .replace(/\/+$/, '')
            .toLowerCase();
    }
};

window.SpaRouter = SpaRouter;
window.sygmaIrInicio = function () { return SpaRouter.goHome(); };
window.sygmaCerrarSesion = function () { return SpaRouter.requestLogout(); };
