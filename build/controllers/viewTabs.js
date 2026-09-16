'use strict';

/**
 * Vistas en pestañas aisladas (iframe same-origin).
 * Una pestaña por vista. Sin cruce de variables, DOM ni estado entre pestañas.
 */
(function () {
    var ORIGIN = window.location.origin;
    var SKIP_MENU = { verify: 1, salidaMenu: 1, pendiente: 1 };
    var SESSION_KEYS = [
        'TOKEN', 'GlobalUrlCalls', 'GlobalUrlServicioLocal', 'GlobalUrlPrinter',
        'GlobalEmpnit', 'GlobalNomEmpresa', 'GlobalEmpnitBodega',
        'GlobalUsuario', 'GlobalPass', 'GlobalNivelUsuario', 'GlobalCodUsuario',
        'GlobalSuperUsuario', 'GlobalSuperKey',
        'GlobalCodRutaCliente', 'GlobalCodRutaMercaderista',
        'GlobalSignoMoneda', 'GlobalStockProceso', 'GlobalBolEditando',
        'Global_latitud_empresa', 'Global_longitud_empresa',
        'selected_latitud', 'selected_longitud', 'selected_codigo',
        'data_settings', 'data_settings_map', 'data_empresa_config',
        'data_usuario_config', 'data_config_general', 'GlobalObjetivoSkus',
        'versionapp'
    ];
    var TITLE_FALLBACK = {
        productos: 'PRODUCTOS Y PRECIOS',
        pos: 'FACTURACION',
        compras: 'COMPRAS',
        compras2: 'COMPRAS',
        compras_requisiciones: 'REQUISICIONES',
        compras_orden: 'ORDEN DE COMPRA',
        compras_gestion_precios: 'GESTION DE PRECIOS',
        compras_gestion_bonos: 'BONOS',
        compras_gestion_minmax: 'MINIMOS Y MAXIMOS',
        devoluciones_clientes: 'NOTAS DE CREDITO CLIENTES',
        devoluciones_proveedores: 'NOTAS DE CREDITO PROVEEDORES',
        bodega_movinv: 'MOVIMIENTOS DE INVENTARIO',
        bodega_surtido: 'RELLENO A SUCURSALES',
        bodega_traslados: 'TRASLADOS',
        bodega_inv_fisico: 'INVENTARIO FISICO',
        bodega_inv_retroactivo: 'INVENTARIO RETROACTIVO',
        bodega_lista_precios: 'LISTA DE PRECIOS',
        cuentas_por_cobrar: 'CUENTAS POR COBRAR',
        cuentas_por_pagar: 'CUENTAS POR PAGAR',
        objetivos: 'GESTION DE OBJETIVOS',
        objetivos_bi: 'LOGRO DE OBJETIVOS',
        objetivos_goles: 'GOLES P&G',
        objetivos_cobertura: 'COBERTURA CLIENTES',
        objetivos_logro_procter: 'LOGRO P&G',
        empleados_gps: 'UBICACIONES EMPLEADOS (GPS)',
        objetivos_visitas_gps: 'VISITAS VENDEDORES GPS',
        objetivos_mercaderistas: 'VISITAS MERCADERISTAS',
        objetivos_cobertura_municipios: 'COBERTURA MUNICIPIOS',
        report_ventas_vendedor: 'VENTAS VENDEDOR',
        report_ventas_marcas: 'VENTAS POR MARCAS',
        calculos_cargas_mes: 'CARGAS DEL MES',
        documentos: 'DOCUMENTOS',
        ventas_visitas: 'CLIENTES NO VISITADOS',
        reporte_bonificaciones: 'BONIFICACIONES ENTREGADAS',
        mantenimiento_generales: 'CLASIFICACIONES GENERALES',
        clientes: 'CLIENTES (CENSO)',
        clientes_rutas: 'RUTAS CLIENTES',
        municipios_departamentos: 'MUNICIPIOS/DEPARTAMENTOS',
        empleados: 'EMPLEADOS',
        proveedores: 'PROVEEDORES',
        medidas: 'MEDIDAS',
        empresas: 'EMPRESAS',
        config_general: 'CONFIGURACIONES GENERALES',
        config_tipodocumentos: 'TIPO DE DOCUMENTOS',
        ventas_pedidos: 'PEDIDOS',
        ventas_pedidos_comodin: 'PEDIDOS 2',
        ventas_censo: 'CENSO'
    };

    var tabs = [];
    var activeId = 'home';
    var homeLoaded = false;
    var enabled = false;
    var wrapped = false;
    var opening = false;

    function isTabFrame() {
        return !!window.SYGMA_IS_TAB_FRAME;
    }

    function settingOn() {
        return typeof permite_vista_pestanas === 'function' && permite_vista_pestanas();
    }

    function loggedIn() {
        return Number(typeof GlobalNivelUsuario !== 'undefined' ? GlobalNivelUsuario : 0) !== 0;
    }

    function shouldIntercept() {
        return !isTabFrame() && enabled && settingOn() && loggedIn() && !opening;
    }

    function snapshotSession() {
        var snap = {};
        SESSION_KEYS.forEach(function (k) {
            try {
                snap[k] = eval(k);
            } catch (e) {}
        });
        return snap;
    }

    function applySnapshot(snap) {
        if (!snap) return;
        SESSION_KEYS.forEach(function (k) {
            if (!Object.prototype.hasOwnProperty.call(snap, k)) return;
            try {
                eval(k + ' = snap[k]');
            } catch (e) {}
        });
        if (typeof settings_aplicar_globales === 'function') settings_aplicar_globales();
        if (typeof sygma_updateHeaderUsuario === 'function') sygma_updateHeaderUsuario();
    }

    function tabKey(fn, args) {
        var extra = '';
        try {
            extra = args && args.length ? JSON.stringify(args) : '';
        } catch (e) {
            extra = String(args && args[0] != null ? args[0] : '');
        }
        return String(fn || '') + '::' + extra;
    }

    function titleFor(fn, args) {
        try {
            var nodes = document.querySelectorAll('a[onclick]');
            for (var i = 0; i < nodes.length; i++) {
                var oc = nodes[i].getAttribute('onclick') || '';
                if (oc.indexOf('Menu.' + fn + '(') === -1) continue;
                if (args && args.length && args[0] != null && String(args[0]) !== '' && oc.indexOf(String(args[0])) === -1) continue;
                var txt = nodes[i].querySelector('.nav-link-text');
                var label = (txt ? txt.textContent : (nodes[i].getAttribute('title') || '')).trim();
                if (label) return label;
            }
        } catch (e) {}
        var t = TITLE_FALLBACK[fn] || String(fn || 'VISTA').replace(/_/g, ' ').toUpperCase();
        if (args && args.length && args[0] != null && String(args[0]) !== '') t += ' ' + args[0];
        return t;
    }

    function elTabs() { return document.getElementById('sygmaViewTabs'); }
    function elHost() { return document.getElementById('sygmaTabHost'); }
    function elRoot() { return document.getElementById('root'); }

    function renderBar() {
        var bar = elTabs();
        if (!bar) return;
        if (!enabled || !loggedIn()) {
            bar.hidden = true;
            bar.innerHTML = '';
            document.body.classList.remove('sygma-tabs-enabled');
            return;
        }
        document.body.classList.add('sygma-tabs-enabled');
        bar.hidden = false;
        var html = '<button type="button" class="sygma-view-tab' + (activeId === 'home' ? ' is-active' : '') + '" data-tab-id="home" title="Inicio">Inicio</button>';
        tabs.forEach(function (t) {
            html += '<button type="button" class="sygma-view-tab' + (activeId === t.id ? ' is-active' : '') + '" data-tab-id="' + t.id + '" title="' + String(t.title).replace(/"/g, '&quot;') + '">' +
                '<span class="sygma-view-tab__label">' + t.title + '</span>' +
                '<span class="sygma-view-tab__close" data-tab-close="' + t.id + '" title="Cerrar">&times;</span>' +
                '</button>';
        });
        bar.innerHTML = html;
    }

    function showHome() {
        activeId = 'home';
        document.body.classList.remove('sygma-tab-view-active');
        var host = elHost();
        var root = elRoot();
        if (host) {
            host.hidden = true;
            host.querySelectorAll('iframe').forEach(function (f) { f.style.display = 'none'; });
        }
        if (root) root.style.display = '';
        renderBar();
        if (typeof Navegar !== 'undefined' && Navegar.mostrarMenu) Navegar.mostrarMenu();
    }

    function showTab(id) {
        if (id === 'home') {
            showHome();
            return;
        }
        var tab = tabs.find(function (t) { return t.id === id; });
        if (!tab) {
            showHome();
            return;
        }
        activeId = id;
        document.body.classList.add('sygma-tab-view-active');
        var host = elHost();
        var root = elRoot();
        if (root) root.style.display = 'none';
        if (host) {
            host.hidden = false;
            host.querySelectorAll('iframe').forEach(function (f) {
                f.style.display = f.getAttribute('data-tab-id') === id ? 'block' : 'none';
            });
        }
        renderBar();
        if (typeof Navegar !== 'undefined' && Navegar.mostrarMenu) Navegar.mostrarMenu();
    }

    function postToFrame(iframe, payload) {
        try {
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(payload, ORIGIN);
            }
        } catch (e) {}
    }

    function sendInit(tab) {
        if (!tab || !tab.iframe) return;
        postToFrame(tab.iframe, {
            type: 'sygma-tab-init',
            id: tab.id,
            fn: tab.fn,
            args: tab.args || [],
            session: snapshotSession()
        });
    }

    function openTab(fn, args) {
        args = args || [];
        var id = tabKey(fn, args);
        var existing = tabs.find(function (t) { return t.id === id; });
        if (existing) {
            showTab(existing.id);
            return;
        }
        var host = elHost();
        if (!host) return;

        var tab = {
            id: id,
            fn: fn,
            args: args,
            title: titleFor(fn, args),
            iframe: null,
            ready: false
        };

        var iframe = document.createElement('iframe');
        iframe.className = 'sygma-tab-frame';
        iframe.setAttribute('data-tab-id', id);
        iframe.setAttribute('title', tab.title);
        iframe.setAttribute('allow', 'geolocation; clipboard-read; clipboard-write');
        var url = new URL('index.html', window.location.href);
        url.searchParams.set('sygma_tab', '1');
        url.searchParams.set('view', fn);
        iframe.src = url.toString();
        iframe.addEventListener('load', function () {
            sendInit(tab);
        });
        tab.iframe = iframe;
        tabs.push(tab);
        host.appendChild(iframe);
        showTab(id);
    }

    function closeTab(id) {
        var idx = tabs.findIndex(function (t) { return t.id === id; });
        if (idx < 0) return;
        var tab = tabs[idx];
        if (tab.iframe) {
            try { tab.iframe.src = 'about:blank'; } catch (e) {}
            if (tab.iframe.parentNode) tab.iframe.parentNode.removeChild(tab.iframe);
        }
        tabs.splice(idx, 1);
        if (activeId === id) {
            showHome();
        } else {
            renderBar();
        }
    }

    function closeAll() {
        tabs.slice().forEach(function (t) { closeTab(t.id); });
        showHome();
    }

    function setEnabled(on) {
        enabled = !!on && loggedIn();
        document.body.classList.toggle('sygma-tabs-enabled', enabled);
        if (!enabled) {
            closeAll();
            var bar = elTabs();
            if (bar) {
                bar.hidden = true;
                bar.innerHTML = '';
            }
            var host = elHost();
            if (host) host.hidden = true;
            document.body.classList.remove('sygma-tab-view-active');
            var root = elRoot();
            if (root) root.style.display = '';
            return;
        }
        var rootEl = elRoot();
        if (enabled && rootEl && String(rootEl.innerHTML || '').trim() && !document.body.classList.contains('login-active')) {
            homeLoaded = true;
        }
        renderBar();
        if (activeId === 'home') showHome();
    }

    function syncEnabled() {
        setEnabled(settingOn());
    }

    function wrapMenuParent() {
        if (wrapped || typeof Menu === 'undefined') return;
        wrapped = true;
        Object.keys(Menu).forEach(function (key) {
            if (SKIP_MENU[key]) return;
            var orig = Menu[key];
            if (typeof orig !== 'function') return;
            Menu[key] = function () {
                var args = Array.prototype.slice.call(arguments);
                if (!shouldIntercept()) return orig.apply(this, args);
                openTab(key, args);
            };
        });
    }

    function wrapNavegarParent() {
        if (typeof Navegar === 'undefined') return;
        if (Navegar._sygmaTabsWrapped) return;
        Navegar._sygmaTabsWrapped = true;

        var origInicio = Navegar.inicio;
        Navegar.inicio = function () {
            if (shouldIntercept()) {
                showHome();
                if (!homeLoaded) {
                    homeLoaded = true;
                    return origInicio.apply(this, arguments);
                }
                if (typeof Navegar.mostrarMenu === 'function') Navegar.mostrarMenu();
                return;
            }
            return origInicio.apply(this, arguments);
        };

        var origLogin = Navegar.login;
        Navegar.login = function () {
            setEnabled(false);
            return origLogin.apply(this, arguments);
        };
    }

    function hookSettingsParent() {
        if (typeof settings_aplicar_globales === 'function' && !settings_aplicar_globales._sygmaTabsHooked) {
            var origApply = settings_aplicar_globales;
            var hooked = function () {
                origApply.apply(this, arguments);
                syncEnabled();
            };
            hooked._sygmaTabsHooked = true;
            settings_aplicar_globales = hooked;
        }
        if (typeof set_setting_local === 'function' && !set_setting_local._sygmaTabsHooked) {
            var origSet = set_setting_local;
            var hookedSet = function (opcion, valor) {
                origSet(opcion, valor);
                if (String(opcion || '').toUpperCase() === 'PERMITE VISTA PESTAÑAS') {
                    syncEnabled();
                }
            };
            hookedSet._sygmaTabsHooked = true;
            set_setting_local = hookedSet;
        }
        if (typeof sygma_applyDarkMode === 'function' && !sygma_applyDarkMode._sygmaTabsHooked) {
            var origDark = sygma_applyDarkMode;
            var hookedDark = function (on) {
                origDark.apply(this, arguments);
                tabs.forEach(function (t) {
                    postToFrame(t.iframe, { type: 'sygma-tab-dark', on: !!on });
                });
            };
            hookedDark._sygmaTabsHooked = true;
            sygma_applyDarkMode = hookedDark;
        }
    }

    function bindParentUi() {
        var bar = elTabs();
        if (bar && !bar._sygmaBound) {
            bar._sygmaBound = true;
            bar.addEventListener('click', function (e) {
                var closeBtn = e.target.closest('[data-tab-close]');
                if (closeBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeTab(closeBtn.getAttribute('data-tab-close'));
                    return;
                }
                var tabBtn = e.target.closest('[data-tab-id]');
                if (tabBtn) {
                    e.preventDefault();
                    showTab(tabBtn.getAttribute('data-tab-id'));
                }
            });
        }
        window.addEventListener('message', function (ev) {
            if (ev.origin !== ORIGIN) return;
            var data = ev.data || {};
            if (data.type === 'sygma-tab-ready') {
                var tab = tabs.find(function (t) { return t.iframe && t.iframe.contentWindow === ev.source; });
                if (tab) {
                    tab.ready = true;
                    sendInit(tab);
                }
                return;
            }
            if (data.type === 'sygma-tab-open') {
                if (shouldIntercept()) openTab(data.fn, data.args || []);
                return;
            }
            if (data.type === 'sygma-tab-home') {
                showHome();
                return;
            }
            if (data.type === 'sygma-tab-logout') {
                if (typeof Navegar !== 'undefined' && Navegar.salir) Navegar.salir();
                return;
            }
            if (data.type === 'sygma-tab-setting') {
                if (typeof set_setting_local === 'function') set_setting_local(data.opcion, data.valor);
            }
        });
    }

    function wrapMenuFrame() {
        var originals = {};
        if (typeof Menu === 'undefined') return originals;
        Object.keys(Menu).forEach(function (key) {
            if (SKIP_MENU[key]) return;
            var orig = Menu[key];
            if (typeof orig !== 'function') return;
            originals[key] = orig;
            Menu[key] = function () {
                var args = Array.prototype.slice.call(arguments);
                window.parent.postMessage({ type: 'sygma-tab-open', fn: key, args: args }, ORIGIN);
            };
        });
        return originals;
    }

    function bootFrame() {
        document.documentElement.classList.add('sygma-tab-frame');
        document.body.classList.add('sygma-tab-frame', 'spa-nav-hidden');
        var inited = false;

        function runInit(data) {
            if (inited) return;
            inited = true;
            applySnapshot(data.session);
            if (typeof Navegar !== 'undefined') {
                Navegar.mostrarMenu = function () {
                    document.body.classList.remove('login-active');
                    document.body.classList.add('sygma-tab-frame', 'spa-nav-hidden');
                    var sidebar = document.getElementById('root_navbar');
                    if (sidebar) sidebar.style.display = 'none';
                };
                Navegar.inicio = function () {
                    window.parent.postMessage({ type: 'sygma-tab-home' }, ORIGIN);
                };
                Navegar.salir = function () {
                    window.parent.postMessage({ type: 'sygma-tab-logout' }, ORIGIN);
                };
                Navegar.login = function () {
                    window.parent.postMessage({ type: 'sygma-tab-logout' }, ORIGIN);
                };
            }
            if (typeof set_setting_local === 'function') {
                var origSet = set_setting_local;
                set_setting_local = function (opcion, valor) {
                    origSet(opcion, valor);
                    window.parent.postMessage({ type: 'sygma-tab-setting', opcion: opcion, valor: valor }, ORIGIN);
                };
            }
            var originals = wrapMenuFrame();
            var fn = data.fn;
            var args = data.args || [];
            var runner = originals[fn] || (typeof Menu !== 'undefined' ? Menu[fn] : null);
            if (typeof runner === 'function') {
                runner.apply(Menu, args);
            }
        }

        window.addEventListener('message', function (ev) {
            if (ev.origin !== ORIGIN) return;
            var data = ev.data || {};
            if (data.type === 'sygma-tab-init') {
                runInit(data);
                return;
            }
            if (data.type === 'sygma-tab-dark' && typeof sygma_applyDarkMode === 'function') {
                sygma_applyDarkMode(!!data.on);
            }
        });

        window.parent.postMessage({ type: 'sygma-tab-ready' }, ORIGIN);
    }

    function bootParent() {
        wrapMenuParent();
        wrapNavegarParent();
        hookSettingsParent();
        bindParentUi();
        syncEnabled();
    }

    if (isTabFrame()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bootFrame);
        } else {
            bootFrame();
        }
    } else {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bootParent);
        } else {
            bootParent();
        }
    }
})();
