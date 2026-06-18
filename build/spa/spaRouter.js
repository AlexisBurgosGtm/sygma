/**

 * Router SPA vanilla — hash routing (#/ruta) + carga dinámica de vistas.

 * Mantiene el patrón existente: script por vista + initView().

 */

'use strict';



const SpaRouter = {

    routes: Object.create(null),

    containerId: 'root',

    currentPath: null,

    _navToken: 0,

    _skipHashChange: false,



    register(path, config) {

        const normalized = SpaRouter._normalizePath(path);

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



    navigate(path, options = {}) {

        const normalized = this._normalizePath(path);

        const params = options.params || {};

        const hash = this._buildHash(normalized, params);

        const force = options.force === true;



        if (options.replace) {

            if (location.hash !== hash) {

                location.replace(hash);

            } else if (force) {

                return this._render(normalized, params, Object.assign({}, options, { force: true }));

            }

            return Promise.resolve();

        }



        if (force) {

            this._skipHashChange = true;

            if (location.hash !== hash) {

                location.hash = hash;

            }

            return this._render(normalized, params, Object.assign({}, options, { force: true }));

        }



        if (location.hash !== hash) {

            location.hash = hash;

            return Promise.resolve();

        }



        return this._render(normalized, params, options);

    },



    start(defaultPath) {

        window.addEventListener('hashchange', () => this._onHashChange());

        document.addEventListener('click', (e) => this._onDocumentClick(e), true);



        if (!location.hash || location.hash === '#') {

            const initial = defaultPath || 'login';

            this.navigate(initial, { replace: true });

        } else {

            this._onHashChange();

        }

    },



    _onHashChange() {

        if (this._skipHashChange) {

            this._skipHashChange = false;

            return;

        }

        const { path, params } = this._parseHash(location.hash);

        if (!path) {

            this.navigate('login', { replace: true });

            return;

        }

        this._render(path, params, {});

    },



    _onDocumentClick(event) {

        const link = event.target.closest('[data-spa-route],[data-spa-action]');

        if (!link) return;



        event.preventDefault();

        event.stopPropagation();



        if (window.SpaNav) {

            SpaNav.navigateFromLink(link);

            return;

        }



        const route = link.getAttribute('data-spa-route');

        if (route) {

            this.navigate(route, { force: true });

        }

    },



    _resolveHooks(path) {

        if (window.__spaViewHooks && window.__spaViewHooks[path]) {

            return window.__spaViewHooks[path];

        }

        if (this._loadedViews) {

            return this._loadedViews.get(path) || null;

        }

        return null;

    },



    _persistViewHooks(path) {

        window.__spaViewHooks = window.__spaViewHooks || {};

        let hooks = window.__spaViewHooks[path];

        if (!hooks || typeof hooks.initView !== 'function') {

            if (typeof window.initView !== 'function') {

                return null;

            }

            hooks = {

                initView: window.initView,

                destroyView: typeof window.destroyView === 'function' ? window.destroyView : function () {}

            };

            window.__spaViewHooks[path] = hooks;

        }

        if (!this._loadedViews) {

            this._loadedViews = new Map();

        }

        this._loadedViews.set(path, hooks);

        return hooks;

    },



    _runDestroyForPath(path) {

        const hooks = this._resolveHooks(path);

        if (hooks && typeof hooks.destroyView === 'function') {

            try { hooks.destroyView(); } catch (e) { /* vista sin teardown */ }

            return;

        }

        if (typeof destroyView === 'function') {

            try { destroyView(); } catch (e) { /* vista sin teardown */ }

        }

    },



    _runInitForPath(path, initArgs) {

        const hooks = this._resolveHooks(path);

        const initFn = (hooks && hooks.initView) || window.initView;

        if (typeof initFn !== 'function') return;



        if (hooks) {

            window.initView = hooks.initView;

            window.destroyView = hooks.destroyView || function () {};

        }



        if (document.startViewTransition) {

            return document.startViewTransition(function () {

                initFn.apply(null, initArgs);

            }).finished;

        }

        initFn.apply(null, initArgs);

    },



    async _render(path, params, options) {

        const token = ++this._navToken;



        try {

            const route = this.routes[path];

            if (!route) {

                console.warn('[SpaRouter] Ruta no registrada:', path);

                F.AvisoError('La sección solicitada no existe.');

                return;

            }



            if (route.requiresAuth && Number(GlobalNivelUsuario) === 0 && path !== 'login') {

                this.navigate('login', { replace: true });

                return;

            }



            if (this.currentPath) {

                this._runDestroyForPath(this.currentPath);

            } else {

                this._runDestroyForPath(path);

            }



            await this._teardown();

            if (token !== this._navToken) return;



            this._applyLayout(route);

            this.currentPath = path;



            if (route.title) {

                document.title = route.title;

            }



            const initArgs = typeof route.initArgs === 'function'

                ? route.initArgs(params)

                : (route.initArgs || []);



            await this._loadClasses(route.classes);

            if (token !== this._navToken) return;



            const runInit = async () => {

                await this._runInitForPath(path, initArgs);

            };



            await this._loadScript(route.script, runInit, path);

            if (token !== this._navToken) return;



            if (typeof options.onReady === 'function') {

                options.onReady();

            }

        } catch (err) {

            console.error('[SpaRouter] Error al cargar vista:', path, err);

            F.AvisoError('No se pudo cargar la pantalla.');

        }

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



        if (!hideNav && Number(GlobalNivelUsuario) !== 0 && typeof GF !== 'undefined') {

            const menu = document.getElementById('js-nav-menu');

            if (!menu) {

                GF.fcn_load_navbar('js-nav-menu', 'js-primary-nav');

            }

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



    _loadScript(url, onReady, routePath) {

        return new Promise((resolve, reject) => {

            const container = document.getElementById(this.containerId);

            if (!container) {

                reject(new Error('Contenedor #' + this.containerId + ' no encontrado'));

                return;

            }



            const cacheKey = routePath || url.split('?')[0];

            const hooks = this._resolveHooks(cacheKey);

            if (hooks && typeof hooks.initView === 'function') {

                window.initView = hooks.initView;

                window.destroyView = hooks.destroyView || function () {};

                Promise.resolve()

                    .then(() => (typeof onReady === 'function' ? onReady() : undefined))

                    .then(() => resolve())

                    .catch(reject);

                return;

            }



            const separator = url.includes('?') ? '&' : '?';

            const script = document.createElement('script');

            script.src = url + separator + '_spa=' + Date.now();

            script.setAttribute('data-spa-view', 'true');



            script.onload = async () => {

                try {

                    const hooks = this._persistViewHooks(cacheKey);

                    if (hooks) {

                        window.initView = hooks.initView;

                        window.destroyView = hooks.destroyView || function () {};

                    }



                    if (typeof onReady === 'function') {

                        await onReady();

                    }

                    resolve();

                } catch (e) {

                    reject(e);

                }

            };

            script.onerror = () => reject(new Error('Error al cargar: ' + url));



            document.head.appendChild(script);

        });

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

    },



    _buildHash(path, params) {

        const query = Object.keys(params)

            .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')

            .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))

            .join('&');



        return '#/' + path + (query ? '?' + query : '');

    },



    _parseHash(hash) {

        const raw = (hash || '').replace(/^#\/?/, '');

        const [pathPart, queryPart] = raw.split('?');

        const path = this._normalizePath(pathPart || 'login');

        const params = {};



        if (queryPart) {

            queryPart.split('&').forEach((pair) => {

                const [key, val] = pair.split('=').map(decodeURIComponent);

                if (key) params[key] = val;

            });

        }



        return { path, params };

    }

};



window.SpaRouter = SpaRouter;


