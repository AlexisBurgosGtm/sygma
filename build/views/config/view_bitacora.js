(function () {
    'use strict';

    var ROUTE_ID = 'config/bitacora';
    var bitacora_cache = [];
    var bitacora_buscar_timer = null;

    function bitacora_inyectarEstilos() {
        var style = document.getElementById('bitacora-styles');
        if (!style) {
            style = document.createElement('style');
            style.id = 'bitacora-styles';
            document.head.appendChild(style);
        }
        style.textContent = `
        .bitacora-wrap {
            max-width: 100%;
            padding: 0.75rem 0.85rem 2rem;
            background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
            min-height: 65vh;
        }
        .bitacora-hero {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            padding: 0.85rem 1rem;
            margin-bottom: 0.85rem;
            border-radius: 14px;
            border: 1px solid rgba(15,23,42,.08);
            background: rgba(255,255,255,.9);
            box-shadow: 0 8px 24px rgba(15,23,42,.05);
        }
        .bitacora-hero h4 { margin: 0; font-size: 1.05rem; font-weight: 700; color: #0f172a; }
        .bitacora-filters .form-control { border-radius: 10px; min-height: 36px; font-size: 0.85rem; }
        .bitacora-table-wrap {
            border: 1px solid rgba(15,23,42,.08);
            border-radius: 14px;
            overflow: auto;
            max-height: calc(100vh - 280px);
            background: #fff;
            box-shadow: 0 8px 22px rgba(15,23,42,.05);
        }
        .bitacora-table { margin-bottom: 0; font-size: 0.82rem; }
        .bitacora-table thead td {
            position: sticky;
            top: 0;
            z-index: 2;
            background: #f1f5f9;
            font-weight: 700;
            border-bottom: 1px solid rgba(15,23,42,.1);
            white-space: nowrap;
        }
        .bitacora-table tbody tr:hover { background: rgba(59, 125, 221, 0.06); }
        .bitacora-detalle { max-width: 420px; white-space: normal; word-break: break-word; }
        .bitacora-modulo {
            display: inline-block;
            padding: 0.15rem 0.45rem;
            border-radius: 999px;
            font-size: 0.72rem;
            font-weight: 700;
            background: #eef2ff;
            color: #4338ca;
        }
        body.sygma-dark .bitacora-wrap { background: #0f172a; color: #e2e8f0; }
        body.sygma-dark .bitacora-hero,
        body.sygma-dark .bitacora-table-wrap { background: #152033; border-color: rgba(148,163,184,.2); }
        body.sygma-dark .bitacora-hero h4 { color: #e2e8f0; }
        body.sygma-dark .bitacora-table thead td { background: #1e293b; color: #e2e8f0; }
        `;
    }

    function bitacora_esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;');
    }

    function getView() {
        bitacora_inyectarEstilos();
        var f = new Date();
        var mesCurso = typeof F !== 'undefined' && F.get_mes_curso ? F.get_mes_curso() : String(f.getMonth() + 1);
        var anioCurso = typeof F !== 'undefined' && F.get_anio_curso ? F.get_anio_curso() : String(f.getFullYear());
        var comboMes = typeof F !== 'undefined' && F.ComboMeses ? F.ComboMeses() : '';
        var comboAnio = typeof F !== 'undefined' && F.ComboAnio ? F.ComboAnio() : '';

        var html = `
            <div class="bitacora-wrap">
                <div class="bitacora-hero">
                    <div>
                        <h4><i class="fal fa-clipboard-list mr-1"></i> Bitácora de eliminaciones</h4>
                        <small class="text-muted">Registro de borrados en productos, precios, marcas, documentos, pedidos y visitas</small>
                    </div>
                    <button type="button" class="btn btn-outline-secondary btn-sm hand" id="btnBitacoraReload">
                        <i class="fal fa-sync mr-1"></i> Recargar
                    </button>
                </div>
                <div class="bitacora-filters row mb-3">
                    <div class="col-6 col-md-2 form-group mb-2">
                        <label class="small text-muted mb-1">Mes</label>
                        <select class="form-control negrita" id="cmbBitacoraMes">${comboMes}</select>
                    </div>
                    <div class="col-6 col-md-2 form-group mb-2">
                        <label class="small text-muted mb-1">Año</label>
                        <select class="form-control negrita" id="cmbBitacoraAnio">${comboAnio}</select>
                    </div>
                    <div class="col-12 col-md-5 form-group mb-2">
                        <label class="small text-muted mb-1">Buscar</label>
                        <input type="search" class="form-control negrita" id="txtBitacoraBuscar"
                            placeholder="Usuario, módulo, detalle, sucursal o ID" autocomplete="off">
                    </div>
                    <div class="col-12 col-md-3 d-flex align-items-end mb-2">
                        <small class="text-muted" id="lbBitacoraResumen"></small>
                    </div>
                </div>
                <div class="bitacora-table-wrap">
                    <table class="table table-sm table-hover bitacora-table" id="tblBitacora">
                        <thead>
                            <tr>
                                <td>Fecha</td>
                                <td>Hora</td>
                                <td>Sucursal</td>
                                <td>Usuario</td>
                                <td>Módulo</td>
                                <td>Detalle</td>
                                <td class="text-center" style="width:56px"></td>
                            </tr>
                        </thead>
                        <tbody id="tblBitacoraBody">
                            <tr><td colspan="7" class="text-center text-muted py-4">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>`;

        var rootEl = document.getElementById('root');
        if (!rootEl) return;
        root = rootEl;
        rootEl.innerHTML = html;

        document.getElementById('cmbBitacoraMes').value = mesCurso;
        document.getElementById('cmbBitacoraAnio').value = anioCurso;
    }

    function bitacora_get_filtros() {
        return {
            mes: document.getElementById('cmbBitacoraMes')?.value,
            anio: document.getElementById('cmbBitacoraAnio')?.value,
            buscar: document.getElementById('txtBitacoraBuscar')?.value || '',
        };
    }

    function bitacora_render(rows) {
        var tbody = document.getElementById('tblBitacoraBody');
        var lb = document.getElementById('lbBitacoraResumen');
        if (!tbody) return;

        if (!rows || !rows.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">Sin registros en el periodo seleccionado</td></tr>';
            if (lb) lb.textContent = '0 registros';
            return;
        }

        var html = rows.map(function (r) {
            var id = r.ID;
            var btnId = 'btnBitDel' + id;
            return `
                <tr>
                    <td class="text-nowrap">${bitacora_esc(r.FECHA_TXT || '')}</td>
                    <td class="text-nowrap">${bitacora_esc(r.HORA_TXT || '')}</td>
                    <td>${bitacora_esc(r.EMPNIT || '')}</td>
                    <td class="negrita">${bitacora_esc(r.USUARIO || '')}</td>
                    <td><span class="bitacora-modulo">${bitacora_esc(r.MODULO || '')}</span></td>
                    <td class="bitacora-detalle"><small>${bitacora_esc(r.DETALLE || '')}</small></td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-outline-danger hand" id="${btnId}"
                            title="Eliminar registro de bitácora" data-bitacora-id="${id}">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
        }).join('');

        tbody.innerHTML = html;
        if (lb) lb.textContent = rows.length + ' registro(s)';

        tbody.querySelectorAll('[data-bitacora-id]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                bitacora_eliminar_registro(Number(btn.getAttribute('data-bitacora-id')), btn.id);
            });
        });
    }

    function bitacora_cargar() {
        var tbody = document.getElementById('tblBitacoraBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">Cargando...</td></tr>';

        var f = bitacora_get_filtros();
        axios.post((typeof GlobalUrlCalls !== 'undefined' ? GlobalUrlCalls : '') + '/config/bitacora_list', {
            token: TOKEN,
            mes: f.mes,
            anio: f.anio,
            buscar: String(f.buscar || '').trim()
        })
            .then(function (res) {
                var data = res.data || {};
                if (!data.ok) throw new Error('error');
                bitacora_cache = data.recordset || [];
                bitacora_render(bitacora_cache);
            })
            .catch(function () {
                bitacora_cache = [];
                if (tbody) {
                    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger py-4">No se pudo cargar la bitácora</td></tr>';
                }
            });
    }

    function bitacora_eliminar_registro(id, btnId) {
        if (!id) return;
        F.Confirmacion('¿Eliminar este registro de la bitácora?')
            .then(function (ok) {
                if (ok !== true) return;
                var btn = document.getElementById(btnId);
                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = '<i class="fal fa-spinner fa-spin"></i>';
                }
                axios.post((typeof GlobalUrlCalls !== 'undefined' ? GlobalUrlCalls : '') + '/config/bitacora_delete', {
                    token: TOKEN,
                    id: id
                })
                    .then(function (res) {
                        if (!res.data || res.data.ok !== true) throw new Error('error');
                        F.Aviso('Registro eliminado');
                        bitacora_cargar();
                    })
                    .catch(function () {
                        F.AvisoError('No se pudo eliminar');
                        if (btn) {
                            btn.disabled = false;
                            btn.innerHTML = '<i class="fal fa-trash"></i>';
                        }
                    });
            });
    }

    function addListeners() {
        document.title = 'Bitácora de eliminaciones';
        document.getElementById('btnBitacoraReload')?.addEventListener('click', bitacora_cargar);
        document.getElementById('cmbBitacoraMes')?.addEventListener('change', bitacora_cargar);
        document.getElementById('cmbBitacoraAnio')?.addEventListener('change', bitacora_cargar);
        document.getElementById('txtBitacoraBuscar')?.addEventListener('input', function () {
            clearTimeout(bitacora_buscar_timer);
            bitacora_buscar_timer = setTimeout(bitacora_cargar, 350);
        });
        bitacora_cargar();
    }

    function destroyView() {}

    function initView() {
        getView();
        addListeners();
    }

    window.initView = initView;
    window.destroyView = destroyView;

    if (typeof window !== 'undefined') {
        window.__spaViewHooks = window.__spaViewHooks || {};
        window.__spaViewHooks[ROUTE_ID] = { initView: initView, destroyView: destroyView };
    }
})();
