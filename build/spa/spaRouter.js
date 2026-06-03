/**
 * Router SPA vanilla — hash routing (#/ruta) + carga dinámica de vistas.
 * Mantiene el patrón existente: script por vista + initView().
 */
'use strict';

const SpaRouter = {
    routes: Object.create(null),
    containerId: 'root',
    currentPath: null,
    _navigating: false,

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

        if (options.replace) {
            if (location.hash !== hash) {
                location.replace(hash);
            } else {
                return this._render(normalized, params, options);
            }
            return Promise.resolve();
        }

        if (location.hash !== hash) {
            location.hash = hash;
            return Promise.resolve();
        }

        return this._render(normalized, params, options);
    },

    start(defaultPath) {
        window.addEventListener('hashchange', () => this._onHashChange());
        document.addEventListener('click', (e) => this._onDocumentClick(e));

        if (!location.hash || location.hash === '#') {
            const initial = defaultPath || 'login';
            this.navigate(initial, { replace: true });
        } else {
            this._onHashChange();
        }
    },

    _onHashChange() {
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
        if (window.SpaNav) {
            SpaNav.navigateFromLink(link);
            return;
        }

        const route = link.getAttribute('data-spa-route');
        if (route) {
            this.navigate(route);
        }
    },

    async _render(path, params, options) {
        if (this._navigating) return;
        this._navigating = true;

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

            if (typeof destroyView === 'function') {
                try { destroyView(); } catch (e) { /* vista sin teardown */ }
            }

            await this._teardown();

            this._applyLayout(route);
            this.currentPath = path;

            if (route.title) {
                document.title = route.title;
            }

            const runInit = async () => {
                await this._loadClasses(route.classes);
                const initArgs = typeof route.initArgs === 'function'
                    ? route.initArgs(params)
                    : (route.initArgs || []);

                if (typeof initView === 'function') {
                    if (document.startViewTransition) {
                        await document.startViewTransition(() => {
                            initView.apply(null, initArgs);
                        }).finished;
                    } else {
                        initView.apply(null, initArgs);
                    }
                }
            };

            await this._loadScript(route.script, runInit);

            if (typeof options.onReady === 'function') {
                options.onReady();
            }
        } catch (err) {
            console.error('[SpaRouter] Error al cargar vista:', path, err);
            F.AvisoError('No se pudo cargar la pantalla.');
        } finally {
            this._navigating = false;
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

    _loadScript(url, onReady) {
        return new Promise((resolve, reject) => {
            const container = document.getElementById(this.containerId);
            if (!container) {
                reject(new Error('Contenedor #' + this.containerId + ' no encontrado'));
                return;
            }

            const separator = url.includes('?') ? '&' : '?';
            const script = document.createElement('script');
            script.src = url + separator + '_spa=' + Date.now();
            script.setAttribute('data-spa-view', 'true');

            script.onload = async () => {
                try {
                    if (typeof onReady === 'function') {
                        await onReady();
                    }
                    resolve();
                } catch (e) {
                    reject(e);
                }
            };
            script.onerror = () => reject(new Error('Error al cargar: ' + url));

            container.appendChild(script);
        });
    },

    async _loadClasses(classUrls) {
        if (!classUrls || !classUrls.length) return;

        for (const url of classUrls) {
            await F.loadClass(url, this.containerId);
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
