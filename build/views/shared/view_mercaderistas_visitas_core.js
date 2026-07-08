window.MercVisitasCore = (function () {
    var visitasCache = [];
    var detalleActual = null;
    var cfg = null;
    var STORAGE_FOLDER = '/XELASOL';

    function P() { return cfg.prefix; }
    function el(suffix) { return document.getElementById(`${P()}${suffix}`); }

    function getSucursal() {
        return (typeof cfg.getSucursal === 'function' ? cfg.getSucursal() : '') || '%';
    }

    function esTodasSucursales() {
        const s = getSucursal();
        return s === '%' || s === '' || String(s).toUpperCase() === 'TODAS';
    }

    function fmtFecha(fecha) {
        if (!fecha) return '--';
        if (typeof fecha === 'string' && fecha.includes('-')) {
            const p = fecha.substring(0, 10).split('-');
            if (p.length === 3) return `${p[2]}/${p[1]}/${p[0]}`;
            return fecha.substring(0, 10);
        }
        try {
            const d = new Date(fecha);
            if (!isNaN(d.getTime())) {
                return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
            }
        } catch (e) { /* ignore */ }
        return String(fecha);
    }

    function fmtSiNoHtml(val) {
        const si = Number(val) ? true : false;
        const texto = si ? 'SI' : 'NO';
        const cls = si ? 'text-success negrita' : 'text-danger negrita';
        return `<span class="${cls}">${texto}</span>`;
    }

    function tieneFaltantes(val) {
        const s = (val || '').trim();
        if (!s) return false;
        try {
            const arr = JSON.parse(s);
            return Array.isArray(arr) && arr.length > 0;
        } catch (e) {
            return false;
        }
    }

    function parseFaltantes(val) {
        const s = (val || '').trim();
        if (!s) return [];
        try {
            const arr = JSON.parse(s);
            return Array.isArray(arr) ? arr : [];
        } catch (e) {
            return [];
        }
    }

    function sanitizeFilename(filename) {
        return String(filename || '')
            .replace(/[/\\]/g, '_')
            .replace(/\s+/g, '_')
            .trim();
    }

    function remotePath(filename) {
        const name = sanitizeFilename(filename);
        if (!name) return '';
        return `${STORAGE_FOLDER}/${name}`;
    }

    function cargarFotoPcloud(filename) {
        const rp = remotePath(filename);
        if (!rp) return Promise.resolve(null);
        return axios.post('/storage/file', { remote_path: rp, as_base64: true })
            .then((resp) => {
                if (!resp.data || resp.data.ok !== true || !resp.data.data_base64) return null;
                const mime = resp.data.mime_type || 'image/jpeg';
                return `data:${mime};base64,${resp.data.data_base64}`;
            })
            .catch(() => null);
    }

    function fotoBloqueHtml(label, dataUrl, filename) {
        if (!dataUrl) {
            const hint = String(filename || '').trim()
                ? `<small class="text-muted d-block mt-1">${String(filename).trim()}</small>`
                : '';
            return `
                <div class="col-6 mb-2">
                    <label class="small negrita text-secondary d-block mb-1">${label}</label>
                    <div class="border rounded text-center text-muted py-4 small">Sin foto en pCloud${hint}</div>
                </div>`;
        }
        return `
            <div class="col-6 mb-2">
                <label class="small negrita text-secondary d-block mb-1">${label}</label>
                <img src="${dataUrl}" alt="${label}" class="img-fluid rounded border shadow-sm" style="max-height:280px;object-fit:contain;width:100%">
            </div>`;
    }

    function celdaActividad(val, tipo, etiquetaBtn) {
        const si = Number(val) ? true : false;
        const btn = si
            ? `<button type="button" class="btn btn-outline-info btn-sm py-0 ml-2 merc-vis-btn-extra" data-tipo="${tipo}" title="${etiquetaBtn}">
                    <i class="fal fa-eye mr-1"></i> Ver
               </button>`
            : '';
        return `
            <div class="d-flex align-items-center flex-wrap">
                ${fmtSiNoHtml(si ? 1 : 0)}
                ${btn}
            </div>`;
    }

    function verFotosActividad(tipo) {
        const r = detalleActual;
        if (!r) return;
        const map = {
            ota: { titulo: 'Fotos OTA', antes: r.OTA_F_ANTES, despues: r.OTA_F_DESPUES },
            vitrinas: { titulo: 'Fotos Vitrinas', antes: r.VITRINAS_F_ANTES, despues: r.VITRINAS_F_DESPUES },
            pop: { titulo: 'Fotos POP', antes: r.POP_F_ANTES, despues: r.POP_F_DESPUES },
        };
        const c = map[tipo];
        if (!c) return;
        const lb = el('LbFotosTitulo');
        const body = el('BodyFotosActividad');
        if (lb) lb.innerText = c.titulo;
        if (body) body.innerHTML = `<div class="text-center py-4">${GlobalLoader}</div>`;
        $(`#${P()}ModalFotosActividad`).modal('show');
        Promise.all([cargarFotoPcloud(c.antes), cargarFotoPcloud(c.despues)])
            .then(([urlAntes, urlDespues]) => {
                if (body) {
                    body.innerHTML = `
                        <div class="row">
                            ${fotoBloqueHtml('Antes', urlAntes, c.antes)}
                            ${fotoBloqueHtml('Después', urlDespues, c.despues)}
                        </div>`;
                }
            });
    }

    function verFaltantesLista() {
        const r = detalleActual;
        if (!r) return;
        const items = parseFaltantes(r.FALTANTES);
        const body = el('BodyFaltantesLista');
        if (!items.length) {
            if (body) body.innerHTML = '<div class="text-center text-muted py-3">No hay faltantes registrados</div>';
        } else if (body) {
            body.innerHTML = `
                <div class="table-responsive" style="max-height:55vh;overflow-y:auto">
                    <table class="table table-sm table-bordered table-hover mb-0">
                        <thead class="bg-base text-white">
                            <tr><th>CÓDIGO</th><th>PRODUCTO</th></tr>
                        </thead>
                        <tbody>
                            ${items.map((p) => `<tr><td>${p.CODPROD || ''}</td><td>${p.DESPROD || ''}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>`;
        }
        $(`#${P()}ModalFaltantesLista`).modal('show');
    }

    function onDetalleExtraClick(e) {
        const btn = e.target.closest('.merc-vis-btn-extra');
        if (!btn) return;
        const tipo = btn.getAttribute('data-tipo');
        if (tipo === 'faltantes') verFaltantesLista();
        else if (tipo === 'ota' || tipo === 'vitrinas' || tipo === 'pop') verFotosActividad(tipo);
    }

    function verDetalle(codemp, codclie, fecha, empnit) {
        const body = el('BodyDetalleVisita');
        if (body) body.innerHTML = `<div class="text-center py-3">${GlobalLoader}</div>`;
        $(`#${P()}ModalDetalleVisita`).modal('show');
        const suc = (empnit || '').trim() || getSucursal();
        axios.post('/clientes/mercaderista_visita_detalle', {
            token: TOKEN,
            sucursal: suc,
            codemp,
            codclie,
            fecha: String(fecha || '').substring(0, 10),
        })
            .then((response) => {
                if (response.data === 'error' || !response.data?.recordset?.length) throw new Error('sin datos');
                const r = response.data.recordset[0];
                detalleActual = r;
                const nom = r.NOMBRE || `Cliente ${codclie}`;
                const motivo = (r.NOVISITADO || '').trim();
                const hayFaltantes = tieneFaltantes(r.FALTANTES);
                if (body) {
                    body.innerHTML = `
                        <div class="mb-2">
                            <div class="negrita text-base">${nom}</div>
                            <div class="small text-muted">${r.NEGOCIO || ''} · Cod ${r.CODCLIENTE || codclie}</div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-sm table-bordered mb-0">
                                <tbody>
                                    <tr><th class="bg-light" style="width:42%">Fecha</th><td>${fmtFecha(r.FECHA)}</td></tr>
                                    <tr><th class="bg-light">Mes / Año</th><td>${r.MES || '--'} / ${r.ANIO || '--'}</td></tr>
                                    <tr><th class="bg-light">Hora inicio</th><td>${r.HORA_INICIO || '--'}</td></tr>
                                    <tr><th class="bg-light">No visitado</th><td>${motivo || '—'}</td></tr>
                                    <tr><th class="bg-light">OTA</th><td>${celdaActividad(r.OTA, 'ota', 'Ver fotos OTA')}</td></tr>
                                    <tr><th class="bg-light">Vitrinas</th><td>${celdaActividad(r.VITRINAS, 'vitrinas', 'Ver fotos Vitrinas')}</td></tr>
                                    <tr><th class="bg-light">POP</th><td>${celdaActividad(r.POP, 'pop', 'Ver fotos POP')}</td></tr>
                                    <tr><th class="bg-light">Faltantes</th><td>${celdaActividad(hayFaltantes ? 1 : 0, 'faltantes', 'Ver faltantes')}</td></tr>
                                </tbody>
                            </table>
                        </div>`;
                }
            })
            .catch(() => {
                detalleActual = null;
                if (body) body.innerHTML = '<div class="text-center text-danger py-3">No se pudo cargar el detalle de la visita</div>';
            });
    }

    function visitaCardHtml(r) {
        const fechaVal = String(r.FECHA || '').substring(0, 10);
        const sucursalHtml = esTodasSucursales()
            ? `<div class="small text-secondary mb-1">${r.NOMEMPRESA || r.EMPNIT || ''}</div>`
            : '';
        return `
            <div class="card merc-visita-card shadow-sm mb-2 border hand merc-visita-row"
                data-codemp="${r.CODEMP}" data-codclie="${r.CODCLIENTE}" data-fecha="${fechaVal}" data-empnit="${r.EMPNIT || ''}">
                <div class="card-body p-2">
                    ${sucursalHtml}
                    <div class="small text-info negrita mb-1">${r.NOMMERCADERISTA || ''}</div>
                    <div class="negrita text-base">${r.NOMBRE_CLIENTE || ''}</div>
                    <small class="text-muted d-block mb-2">${r.NEGOCIO || ''}</small>
                    <div class="d-flex justify-content-between small">
                        <span><i class="fal fa-calendar-alt mr-1"></i>${fmtFecha(r.FECHA)}</span>
                        <span class="negrita">${r.HORA_INICIO || '--'}</span>
                    </div>
                </div>
            </div>`;
    }

    function renderVisitas(rows) {
        const tbody = el('TblDataVisitas');
        const cards = el('TblVisitasCards');
        const lbTotal = el('LbTotalVisitas');
        const todas = esTodasSucursales();
        const colspan = todas ? 5 : 4;

        if (!rows.length) {
            const msg = `<tr><td colspan="${colspan}" class="text-center text-muted py-3">No hay visitas en el rango seleccionado</td></tr>`;
            const msgCard = '<div class="text-center text-muted py-3">No hay visitas en el rango seleccionado</div>';
            if (tbody) tbody.innerHTML = msg;
            if (cards) cards.innerHTML = msgCard;
            if (lbTotal) lbTotal.innerText = '0 visitas';
            return;
        }

        if (tbody) {
            tbody.innerHTML = rows.map((r) => {
                const fechaVal = String(r.FECHA || '').substring(0, 10);
                const colSuc = todas ? `<td class="small">${r.NOMEMPRESA || r.EMPNIT || ''}</td>` : '';
                return `
                <tr class="hand merc-visita-row"
                    data-codemp="${r.CODEMP}" data-codclie="${r.CODCLIENTE}" data-fecha="${fechaVal}" data-empnit="${r.EMPNIT || ''}">
                    ${colSuc}
                    <td class="negrita">${r.NOMMERCADERISTA || ''}</td>
                    <td><div class="negrita">${r.NOMBRE_CLIENTE || ''}</div><small class="text-muted">${r.NEGOCIO || ''}</small></td>
                    <td>${fmtFecha(r.FECHA)}</td>
                    <td>${r.HORA_INICIO || '--'}</td>
                </tr>`;
            }).join('');
        }
        if (cards) cards.innerHTML = rows.map((r) => visitaCardHtml(r)).join('');
        if (lbTotal) lbTotal.innerText = `${rows.length} visita${rows.length === 1 ? '' : 's'}`;
    }

    function actualizarCabeceraTabla() {
        const thead = el('TblVisitasThead');
        if (!thead) return;
        const todas = esTodasSucursales();
        thead.innerHTML = todas
            ? `<tr><th>SUCURSAL</th><th>MERCADERISTA</th><th>CLIENTE</th><th>FECHA</th><th>HORA</th></tr>`
            : `<tr><th>MERCADERISTA</th><th>CLIENTE</th><th>FECHA</th><th>HORA</th></tr>`;
    }

    function cargarVisitas() {
        const fi = el('TxtFechaIni')?.value || '';
        const ff = el('TxtFechaFin')?.value || '';
        const tbody = el('TblDataVisitas');
        const cards = el('TblVisitasCards');
        const todas = esTodasSucursales();
        const colspan = todas ? 5 : 4;

        if (!fi || !ff) {
            F.AvisoError('Seleccione fecha inicial y final');
            return;
        }
        if (fi > ff) {
            F.AvisoError('La fecha inicial no puede ser mayor que la final');
            return;
        }

        actualizarCabeceraTabla();
        if (tbody) tbody.innerHTML = `<tr><td colspan="${colspan}" class="text-center py-3">${GlobalLoader}</td></tr>`;
        if (cards) cards.innerHTML = GlobalLoader;

        axios.post('/clientes/supervisor_mercaderistas_visitas', {
            token: TOKEN,
            sucursal: getSucursal(),
            fi,
            ff,
        })
            .then((response) => {
                if (response.data === 'error') throw new Error('error');
                visitasCache = response.data.recordset || [];
                renderVisitas(visitasCache);
            })
            .catch(() => {
                visitasCache = [];
                if (tbody) tbody.innerHTML = `<tr><td colspan="${colspan}" class="text-center text-danger py-3">No se pudieron cargar las visitas</td></tr>`;
                if (cards) cards.innerHTML = '<div class="text-center text-danger py-3">No se pudieron cargar las visitas</div>';
                const lb = el('LbTotalVisitas');
                if (lb) lb.innerText = '0 visitas';
            });
    }

    function onVisitaClick(e) {
        const row = e.target.closest('.merc-visita-row');
        if (!row) return;
        verDetalle(
            Number(row.dataset.codemp),
            Number(row.dataset.codclie),
            row.dataset.fecha || '',
            row.dataset.empnit || ''
        );
    }

    function getViewHtml() {
        const Pfx = P();
        return `
            <div class="col-12 p-0 bg-white">
                <div class="card card-rounded shadow border-0">
                    <div class="card-body p-2 p-md-3">
                        <h5 class="negrita text-base mb-3">Visitas de mercaderistas</h5>
                        <div class="row align-items-end mb-3">
                            <div class="col-6 col-md-3 mb-2 mb-md-0">
                                <label class="negrita text-secondary small mb-1" for="${Pfx}TxtFechaIni">Fecha inicial</label>
                                <input type="date" class="form-control negrita" id="${Pfx}TxtFechaIni">
                            </div>
                            <div class="col-6 col-md-3 mb-2 mb-md-0">
                                <label class="negrita text-secondary small mb-1" for="${Pfx}TxtFechaFin">Fecha final</label>
                                <input type="date" class="form-control negrita" id="${Pfx}TxtFechaFin">
                            </div>
                            <div class="col-12 col-md-3 mb-2 mb-md-0">
                                <button type="button" class="btn btn-info btn-sm negrita hand w-100" id="${Pfx}BtnBuscar">
                                    <i class="fal fa-search mr-1"></i> Buscar
                                </button>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6 class="negrita text-secondary mb-0" id="${Pfx}LbTotalVisitas">0 visitas</h6>
                            </div>
                        </div>
                        <div id="${Pfx}TblVisitasCards" class="d-md-none"></div>
                        <div class="table-responsive d-none d-md-block">
                            <table class="table table-sm table-bordered table-hover mb-0" style="min-width:720px">
                                <thead class="bg-base text-white" id="${Pfx}TblVisitasThead">
                                    <tr><th>MERCADERISTA</th><th>CLIENTE</th><th>FECHA</th><th>HORA</th></tr>
                                </thead>
                                <tbody id="${Pfx}TblDataVisitas">
                                    <tr><td colspan="4" class="text-center text-muted py-3">Seleccione rango y presione Buscar</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="${Pfx}ModalDetalleVisita" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content border-0 shadow">
                            <div class="modal-header bg-secondary py-2">
                                <h5 class="modal-title text-white negrita mb-0">Detalle de visita</h5>
                                <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                            </div>
                            <div class="modal-body p-3" id="${Pfx}BodyDetalleVisita"></div>
                            <div class="modal-footer py-2">
                                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="${Pfx}ModalFotosActividad" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div class="modal-content border-0 shadow">
                            <div class="modal-header bg-info py-2">
                                <h5 class="modal-title text-white negrita mb-0" id="${Pfx}LbFotosTitulo">Fotos</h5>
                                <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                            </div>
                            <div class="modal-body p-3" id="${Pfx}BodyFotosActividad"></div>
                            <div class="modal-footer py-2">
                                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="${Pfx}ModalFaltantesLista" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div class="modal-content border-0 shadow">
                            <div class="modal-header bg-primary py-2">
                                <h5 class="modal-title text-white negrita mb-0">Faltantes registrados</h5>
                                <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                            </div>
                            <div class="modal-body p-3" id="${Pfx}BodyFaltantesLista"></div>
                            <div class="modal-footer py-2">
                                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    function addListeners() {
        const hoy = F.getFecha();
        const txtIni = el('TxtFechaIni');
        const txtFin = el('TxtFechaFin');
        if (txtIni) txtIni.value = hoy;
        if (txtFin) txtFin.value = hoy;
        el('BtnBuscar')?.addEventListener('click', cargarVisitas);
        el('TblDataVisitas')?.addEventListener('click', onVisitaClick);
        el('TblVisitasCards')?.addEventListener('click', onVisitaClick);
        el('BodyDetalleVisita')?.addEventListener('click', onDetalleExtraClick);
    }

    return {
        init(options) {
            cfg = options || {};
            visitasCache = [];
            detalleActual = null;
            root.innerHTML = getViewHtml();
            addListeners();
            cargarVisitas();
            if (typeof cfg.registerRefresh === 'function') {
                cfg.registerRefresh(cargarVisitas);
            }
        },
        destroy() {
            const pfx = cfg ? cfg.prefix : null;
            visitasCache = [];
            detalleActual = null;
            if (pfx) {
                $(`#${pfx}ModalDetalleVisita`).modal('hide');
                $(`#${pfx}ModalFotosActividad`).modal('hide');
                $(`#${pfx}ModalFaltantesLista`).modal('hide');
            }
            cfg = null;
        },
        cargarVisitas,
    };
})();
