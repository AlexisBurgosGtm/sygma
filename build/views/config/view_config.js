(function () {
    'use strict';

    var ROUTE_ID = 'config/general';

    function config_inyectarEstilos() {
        if (document.getElementById('config-styles')) return;
        var style = document.createElement('style');
        style.id = 'config-styles';
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
        `;
        document.head.appendChild(style);
    }

    function config_icon_for(opcion) {
        var o = String(opcion || '').toUpperCase();
        if (o.indexOf('INVENTARIO') >= 0) return 'fa-boxes';
        if (o.indexOf('CLAVE') >= 0) return 'fa-key';
        if (o.indexOf('STOCK') >= 0) return 'fa-warehouse';
        return 'fa-sliders-h';
    }

    function config_editor_html(row, idx) {
        var opcion = String(row.OPCION || '');
        var valor = String(row.VALOR == null ? '' : row.VALOR);
        var up = opcion.toUpperCase();
        var id = 'cfgSetting_' + idx;

        if (up === 'PERMITE INVENTARIO NEGATIVO') {
            var selSi = valor.toUpperCase() === 'SI' ? 'selected' : '';
            var selNo = valor.toUpperCase() !== 'SI' ? 'selected' : '';
            return `
                <label for="${id}">Valor</label>
                <select class="form-control negrita border-base" id="${id}" data-opcion="${opcion.replace(/"/g, '&quot;')}">
                    <option value="SI" ${selSi}>SI</option>
                    <option value="NO" ${selNo}>NO</option>
                </select>
                <small class="text-muted d-block mt-2">Permite movimientos/ventas que dejen existencia por debajo de cero.</small>
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
            return `
                <div class="col-lg-4 col-md-6 col-12 mb-3">
                    <div class="config-panel-card">
                        <div class="config-panel-head">
                            <i class="fal ${icon} mr-1"></i> ${opcion}
                        </div>
                        <div class="card-body">
                            ${config_editor_html(row, idx)}
                            <div class="text-right mt-3">
                                <button type="button" class="btn btn-base text-white hand btn-config-save"
                                    data-idx="${idx}" data-opcion="${opcion.replace(/"/g, '&quot;')}">
                                    <i class="fal fa-save mr-1"></i> Guardar
                                </button>
                            </div>
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
    }

    function config_cargar_settings() {
        var grid = document.getElementById('configSettingsGrid');
        if (grid) grid.innerHTML = '<div class="col-12 text-center text-muted py-4">Cargando configuración...</div>';

        var loader = (typeof GF !== 'undefined' && typeof GF.get_data_settings === 'function')
            ? GF.get_data_settings()
            : axios.post(GlobalUrlCalls + '/config/settings_list', { token: TOKEN }).then(function (r) { return r.data; });

        loader
            .then(function (data) {
                data_settings = (data && data.recordset) ? data.recordset : [];
                if (typeof settings_aplicar_globales === 'function') settings_aplicar_globales();
                config_render_cards(data_settings);
            })
            .catch(function () {
                if (grid) {
                    grid.innerHTML = '<div class="col-12"><div class="alert alert-danger mb-0">No se pudo cargar SETTINGS.</div></div>';
                }
            });
    }

    function config_guardar_setting(opcion, valor, btn) {
        if (!opcion) {
            F.AvisoError('Opción no válida');
            return;
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

        saver
            .then(function () {
                if (typeof set_setting_local === 'function') set_setting_local(opcion, valor);
                F.Aviso('Configuración guardada');
            })
            .catch(function () {
                F.AvisoError('No se pudo guardar');
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
