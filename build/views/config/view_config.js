(function () {
    'use strict';

    var ROUTE_ID = 'config/general';

    function config_inyectarEstilos() {
        var style = document.getElementById('config-styles');
        if (!style) {
            style = document.createElement('style');
            style.id = 'config-styles';
            document.head.appendChild(style);
        }
        style.textContent = `
        .config-wrap {
            max-width: 100%;
            padding: 0.75rem 0.85rem 2rem;
            background:
                radial-gradient(800px 240px at 0% -10%, rgba(14,165,233,.10), transparent 60%),
                radial-gradient(700px 220px at 100% 0%, rgba(34,197,94,.07), transparent 55%),
                linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
            min-height: 65vh;
        }
        .config-hero {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            padding: 0.85rem 1rem;
            margin-bottom: 0.85rem;
            border-radius: 14px;
            border: 1px solid rgba(15,23,42,.08);
            background: rgba(255,255,255,.82);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 8px 24px rgba(15,23,42,.05);
        }
        .config-hero h4 {
            margin: 0;
            font-size: 1.05rem;
            font-weight: 700;
            color: #0f172a;
        }
        .config-hero p {
            margin: 0;
            font-size: 0.75rem;
            color: #64748b;
        }
        .config-panel-card {
            border: 1px solid rgba(15,23,42,.08);
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 8px 22px rgba(15,23,42,.05);
            margin-bottom: 0;
            height: 100%;
            background: rgba(255,255,255,.94);
        }
        .config-panel-head {
            background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);
            border-bottom: 1px solid rgba(15,23,42,.06);
            padding: 0.55rem 0.85rem;
            margin: 0;
            font-size: 0.82rem;
            font-weight: 700;
            color: #0f172a;
        }
        .config-panel-card > .card-body { padding: 0.85rem 1rem; }
        .config-panel-card label {
            font-size: 0.72rem;
            color: #64748b;
            margin-bottom: 0.25rem;
        }
        .config-panel-card .form-control {
            font-size: 0.85rem;
            border-radius: 10px;
            min-height: 36px;
        }
        .config-panel-card .btn {
            border-radius: 10px;
            font-size: 0.78rem;
        }
        .config-stock2-box {
            border-top: 1px dashed #dee2e6;
            margin-top: 0.85rem;
            padding-top: 0.75rem;
        }
        .config-stock2-box .negrita { font-size: 0.8rem; }
        .config-clave-input {
            letter-spacing: 0.08em;
            font-weight: 700;
            color: #b45309;
            background: #fffbeb;
        }
        .config-sino-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 4.6rem;
            padding: 0.42rem 1.15rem;
            border: 0;
            border-radius: 999px;
            font-size: 0.82rem;
            font-weight: 800;
            letter-spacing: 0.08em;
            line-height: 1.2;
            color: #fff;
            cursor: pointer;
            box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
            transition: transform .15s ease, box-shadow .15s ease, background-color .15s ease;
        }
        .config-sino-badge:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 18px rgba(15, 23, 42, 0.16);
        }
        .config-sino-badge:active { transform: translateY(0); }
        .config-sino-badge:disabled { opacity: 0.7; cursor: wait; transform: none; }
        .config-sino-badge--si {
            background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
        }
        .config-sino-badge--no {
            background: linear-gradient(180deg, #f87171 0%, #dc2626 100%);
        }
        body.sygma-dark .config-wrap {
            background:
                radial-gradient(800px 240px at 0% -10%, rgba(14,165,233,.12), transparent 60%),
                radial-gradient(700px 220px at 100% 0%, rgba(34,197,94,.08), transparent 55%),
                linear-gradient(180deg, #0b1220 0%, #0f172a 100%);
            color: #e2e8f0;
        }
        body.sygma-dark .config-hero {
            background: rgba(21, 32, 51, 0.94);
            border-color: rgba(148, 163, 184, 0.18);
            box-shadow: none;
        }
        body.sygma-dark .config-hero h4 { color: #e2e8f0 !important; }
        body.sygma-dark .config-hero p { color: #94a3b8 !important; }
        body.sygma-dark .config-panel-card {
            background: #152033 !important;
            border-color: rgba(148, 163, 184, 0.18);
            box-shadow: none;
            color: #e2e8f0;
        }
        body.sygma-dark .config-panel-head {
            background: linear-gradient(135deg, #1e293b 0%, #152033 100%);
            border-color: rgba(148, 163, 184, 0.14);
            color: #e2e8f0 !important;
        }
        body.sygma-dark .config-panel-card label {
            color: #94a3b8 !important;
        }
        body.sygma-dark .config-panel-card .form-control {
            background-color: #0f172a !important;
            color: #f1f5f9 !important;
            border-color: rgba(148, 163, 184, 0.24) !important;
        }
        body.sygma-dark .config-clave-input {
            background: #1e293b !important;
            color: #fbbf24 !important;
        }
        body.sygma-dark .config-stock2-box {
            border-top-color: rgba(148, 163, 184, 0.22);
        }
        body.sygma-dark .config-wrap .text-muted,
        body.sygma-dark .config-panel-card .text-muted,
        body.sygma-dark .config-wrap small {
            color: #94a3b8 !important;
        }
        `;
    }

    function config_icon_for(opcion) {
        var o = String(opcion || '').toUpperCase();
        if (o.indexOf('PESTAÑ') >= 0 || o.indexOf('PESTAN') >= 0) return 'fa-clone';
        if (o.indexOf('INVENTARIO') >= 0) return 'fa-boxes';
        if (o.indexOf('CLAVE') >= 0) return 'fa-key';
        if (o.indexOf('STOCK') >= 0) return 'fa-warehouse';
        if (o.indexOf('OFERTA') >= 0) return 'fa-tags';
        if (o.indexOf('VENDEDOR') >= 0) return 'fa-user-tie';
        return 'fa-sliders-h';
    }

    function config_is_si_no(opcion, valor) {
        var v = String(valor || '').trim().toUpperCase();
        var o = String(opcion || '').trim().toUpperCase();
        if (v === 'SI' || v === 'NO') return true;
        if (o.indexOf('PERMITE ') === 0) return true;
        if (o.indexOf('APLICA ') === 0) return true;
        return false;
    }

    function config_hint_si_no(opcion) {
        var up = String(opcion || '').toUpperCase();
        if (up === 'PERMITE INVENTARIO NEGATIVO') {
            return 'Permite movimientos/ventas que dejen existencia por debajo de cero.';
        }
        if (up === 'PERMITE VISTA PESTAÑAS') {
            return 'Permite abrir vistas en pestañas internas (una pestaña por vista).';
        }
        if (up === 'APLICA OFERTAS EN VENDEDORES') {
            return 'Si está en SI, las ofertas se aplican en pedidos de vendedores.';
        }
        return 'Pulse el distintivo para cambiar entre SI y NO. El cambio se guarda al instante.';
    }

    function config_apply_sino_badge(btn, valor) {
        if (!btn) return;
        var isSi = String(valor || '').toUpperCase() === 'SI';
        btn.setAttribute('data-valor', isSi ? 'SI' : 'NO');
        btn.textContent = isSi ? 'SI' : 'NO';
        btn.classList.toggle('config-sino-badge--si', isSi);
        btn.classList.toggle('config-sino-badge--no', !isSi);
    }

    function config_editor_html(row, idx) {
        var opcion = String(row.OPCION || '');
        var valor = String(row.VALOR == null ? '' : row.VALOR);
        var up = opcion.toUpperCase();
        var id = 'cfgSetting_' + idx;
        var opcionAttr = opcion.replace(/"/g, '&quot;');

        if (config_is_si_no(opcion, valor)) {
            var isSi = valor.toUpperCase() === 'SI';
            return `
                <label>Valor</label>
                <div class="mt-1">
                    <button type="button"
                        class="config-sino-badge ${isSi ? 'config-sino-badge--si' : 'config-sino-badge--no'}"
                        id="${id}"
                        data-opcion="${opcionAttr}"
                        data-valor="${isSi ? 'SI' : 'NO'}">${isSi ? 'SI' : 'NO'}</button>
                </div>
                <small class="text-muted d-block mt-2">${config_hint_si_no(opcion)}</small>
            `;
        }

        if (up === 'TIPO DE STOCK A USAR EN REPORTES') {
            var s1 = valor.toUpperCase() === 'STOCK2' ? '' : 'selected';
            var s2 = valor.toUpperCase() === 'STOCK2' ? 'selected' : '';
            return `
                <label for="${id}">Valor</label>
                <select class="form-control negrita border-base" id="${id}" data-opcion="${opcion.replace(/"/g, '&quot;')}">
                    <option value="STOCK1" ${s1}>STOCK1 (view_invsaldo)</option>
                    <option value="STOCK2" ${s2}>STOCK2 (INV_STOCK)</option>
                </select>
                <small class="text-muted d-block mt-2">STOCK1 = saldo clásico. STOCK2 = inventario materializado.</small>
            `;
        }

        if (up.indexOf('CLAVE') >= 0) {
            return `
                <label for="${id}">Clave</label>
                <input type="text"
                    class="form-control config-clave-input"
                    id="${id}"
                    data-opcion="${opcion.replace(/"/g, '&quot;')}"
                    value="${String(valor).replace(/"/g, '&quot;')}"
                    autocomplete="off"
                    autocapitalize="off"
                    autocorrect="off"
                    spellcheck="false"
                    data-lpignore="true"
                    data-form-type="other"
                    readonly
                    onfocus="this.removeAttribute('readonly');">
                <small class="text-muted d-block mt-2">Se muestra en texto claro. No se solicita guardado de contraseñas del navegador.</small>
            `;
        }

        return `
            <label for="${id}">Valor</label>
            <input type="text" class="form-control" id="${id}"
                data-opcion="${opcion.replace(/"/g, '&quot;')}"
                value="${String(valor).replace(/"/g, '&quot;')}"
                autocomplete="off">
        `;
    }

    function getView() {
        config_inyectarEstilos();

        var view = {
            body: function () {
                return `
            <div class="config-wrap">
                <div class="config-hero">
                    <div>
                        <h4><i class="fal fa-cogs mr-1"></i> Configuraciones generales</h4>
                        <p>Opciones desde la tabla SETTINGS</p>
                    </div>
                    <button type="button" class="btn btn-outline-secondary btn-sm hand" id="btnConfigReload">
                        <i class="fal fa-sync mr-1"></i> Recargar
                    </button>
                </div>
                <div class="row" id="configSettingsGrid">
                    <div class="col-12 text-center text-muted py-4">Cargando configuración...</div>
                </div>

                <div class="row mt-2">
                    <div class="col-lg-6 col-12 mb-3">
                        <div class="config-panel-card">
                            <div class="config-panel-head">
                                <i class="fal fa-sync mr-1"></i> STOCK2 — Recalcular INV_STOCK
                            </div>
                            <div class="card-body">
                                <small class="text-muted d-block mb-2">
                                    Recalcula existencias materializadas desde documentos con impacto de inventario
                                    (INV 1/-1) y STATUS distinto de anulado.
                                </small>
                                <div class="d-flex align-items-center flex-wrap" style="gap:8px">
                                    <button type="button" class="btn btn-outline-primary hand" id="btnStock2Rebuild">
                                        <i class="fal fa-sync mr-1"></i> Recalcular INV_STOCK
                                    </button>
                                    <small class="text-muted" id="lbStock2RebuildStatus"></small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
            }
        };

        var rootEl = document.getElementById('root');
        if (!rootEl) return;
        root = rootEl;
        rootEl.innerHTML = view.body();
    }

    function config_merge_defaults(rows) {
        var list = Array.isArray(rows) ? rows.slice() : [];
        var defaults = [
            { OPCION: 'PERMITE VISTA PESTAÑAS', VALOR: 'NO' },
            { OPCION: 'APLICA OFERTAS EN VENDEDORES', VALOR: 'NO' }
        ];
        defaults.forEach(function (def) {
            var exists = list.some(function (r) {
                return String(r.OPCION || '').trim().toUpperCase() === def.OPCION;
            });
            if (!exists) list.push({ OPCION: def.OPCION, VALOR: def.VALOR });
        });
        return list;
    }

    function config_render_cards(rows) {
        var grid = document.getElementById('configSettingsGrid');
        if (!grid) return;

        if (!rows || !rows.length) {
            grid.innerHTML = '<div class="col-12"><div class="alert alert-warning mb-0">No hay filas en SETTINGS.</div></div>';
            return;
        }

        grid.innerHTML = rows.map(function (row, idx) {
            var opcion = String(row.OPCION || 'Opción');
            var icon = config_icon_for(opcion);
            var isSino = config_is_si_no(opcion, row.VALOR);
            return `
                <div class="col-lg-4 col-md-6 col-12 mb-3">
                    <div class="config-panel-card">
                        <div class="config-panel-head">
                            <i class="fal ${icon} mr-1"></i> ${opcion}
                        </div>
                        <div class="card-body">
                            ${config_editor_html(row, idx)}
                            ${isSino ? '' : `
                            <div class="text-right mt-3">
                                <button type="button" class="btn btn-base text-white hand btn-config-save"
                                    data-idx="${idx}" data-opcion="${opcion.replace(/"/g, '&quot;')}">
                                    <i class="fal fa-save mr-1"></i> Guardar
                                </button>
                            </div>`}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.btn-config-save').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var opcion = btn.getAttribute('data-opcion');
                var idx = btn.getAttribute('data-idx');
                var input = document.getElementById('cfgSetting_' + idx);
                if (!input) return;
                config_guardar_setting(opcion, input.value, btn);
            });
        });

        grid.querySelectorAll('.config-sino-badge').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (btn.disabled) return;
                var actual = String(btn.getAttribute('data-valor') || 'NO').toUpperCase() === 'SI';
                var next = actual ? 'NO' : 'SI';
                var opcion = btn.getAttribute('data-opcion');
                var prev = actual ? 'SI' : 'NO';
                config_apply_sino_badge(btn, next);
                btn.disabled = true;
                config_guardar_setting(opcion, next, null, true)
                    .then(function () {})
                    .catch(function () {
                        config_apply_sino_badge(btn, prev);
                    })
                    .finally(function () {
                        btn.disabled = false;
                    });
            });
        });
    }

    function config_cargar_settings() {
        var grid = document.getElementById('configSettingsGrid');
        if (grid) grid.innerHTML = '<div class="col-12 text-center text-muted py-4">Cargando configuración...</div>';

        var loader = (typeof GF !== 'undefined' && typeof GF.get_data_settings === 'function')
            ? GF.get_data_settings()
            : axios.post(GlobalUrlCalls + '/config/settings_list', { token: TOKEN }).then(function (r) { return r.data; });

        loader
            .then(function (data) {
                data_settings = config_merge_defaults((data && data.recordset) ? data.recordset : []);
                if (typeof settings_aplicar_globales === 'function') settings_aplicar_globales();
                config_render_cards(data_settings);
            })
            .catch(function () {
                if (grid) {
                    grid.innerHTML = '<div class="col-12"><div class="alert alert-danger mb-0">No se pudo cargar SETTINGS.</div></div>';
                }
            });
    }

    function config_guardar_setting(opcion, valor, btn, silencioso) {
        if (!opcion) {
            F.AvisoError('Opción no válida');
            return Promise.reject(new Error('opcion'));
        }
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fal fa-sync fa-spin mr-1"></i> Guardando...';
        }

        var saver = (typeof GF !== 'undefined' && typeof GF.update_setting === 'function')
            ? GF.update_setting(opcion, valor)
            : axios.post(GlobalUrlCalls + '/config/settings_update', {
                token: TOKEN,
                opcion: opcion,
                valor: valor
            }).then(function (r) {
                if (r.data === 'error') throw new Error('error');
                return r.data;
            });

        return saver
            .then(function () {
                if (typeof set_setting_local === 'function') set_setting_local(opcion, valor);
                if (!silencioso) F.Aviso('Configuración guardada');
            })
            .catch(function () {
                F.AvisoError('No se pudo guardar');
                throw new Error('save');
            })
            .finally(function () {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fal fa-save mr-1"></i> Guardar';
                }
            });
    }

    function config_stock2_rebuild() {
        var btn = document.getElementById('btnStock2Rebuild');
        var lb = document.getElementById('lbStock2RebuildStatus');

        F.Confirmacion('¿Recalcular INV_STOCK (STOCK2) desde todos los movimientos de inventario? Puede tardar varios minutos.')
            .then(function (ok) {
                if (ok !== true) return;

                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = '<i class="fal fa-sync fa-spin mr-1"></i> Recalculando...';
                }
                if (lb) lb.textContent = 'Procesando documentos...';

                axios.post(GlobalUrlCalls + '/inventarios/stock2_rebuild', {
                    token: TOKEN
                }, { timeout: 600000 })
                    .then(function (response) {
                        var data = response.data || {};
                        if (data.ok !== true) {
                            throw new Error(data.error || 'error');
                        }
                        var msg = 'STOCK2 listo: ' + (data.filas || 0) + ' productos actualizados';
                        if (lb) lb.textContent = msg;
                        F.Aviso(msg);
                    })
                    .catch(function (err) {
                        var apiMsg = (err && err.response && err.response.data && (err.response.data.error || err.response.data))
                            || (err && err.message)
                            || 'No se pudo recalcular INV_STOCK';
                        if (typeof apiMsg !== 'string') apiMsg = JSON.stringify(apiMsg);
                        if (lb) lb.textContent = 'Error: ' + apiMsg;
                        F.AvisoError(apiMsg);
                    })
                    .finally(function () {
                        if (btn) {
                            btn.disabled = false;
                            btn.innerHTML = '<i class="fal fa-sync mr-1"></i> Recalcular INV_STOCK';
                        }
                    });
            });
    }

    function addListeners() {
        document.title = 'Configuraciones Generales';
        config_cargar_settings();
        document.getElementById('btnConfigReload')?.addEventListener('click', config_cargar_settings);
        document.getElementById('btnStock2Rebuild')?.addEventListener('click', config_stock2_rebuild);
    }

    function destroyView() {}

    function initView() {
        getView();
        addListeners();
    }

    // Menu.config_general / SpaRouter esperan initView global
    window.initView = initView;
    window.destroyView = destroyView;

    if (typeof window !== 'undefined') {
        window.__spaViewHooks = window.__spaViewHooks || {};
        window.__spaViewHooks[ROUTE_ID] = { initView: initView, destroyView: destroyView };
    }
})();
