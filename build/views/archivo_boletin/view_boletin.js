'use strict';

function boletin_iconMeta(icono) {
    const k = String(icono || 'info').toLowerCase();
    if (k === 'success') return { cls: 'success', icon: 'fa-check-circle', label: 'Éxito' };
    if (k === 'warning') return { cls: 'warning', icon: 'fa-exclamation-triangle', label: 'Aviso' };
    if (k === 'danger') return { cls: 'danger', icon: 'fa-times-circle', label: 'Urgente' };
    return { cls: 'info', icon: 'fa-info-circle', label: 'Información' };
}

function boletin_esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function getView() {
    if (typeof spa_inyectarEstilosPos2 === 'function') spa_inyectarEstilosPos2();
    if (!document.getElementById('boletin-styles')) {
        const style = document.createElement('style');
        style.id = 'boletin-styles';
        style.textContent = `
        .boletin-list { padding: 0.75rem; }
        .boletin-card {
            display: flex; gap: 0.75rem; align-items: flex-start;
            padding: 0.85rem 0.95rem; margin-bottom: 0.65rem;
            border: 1px solid rgba(15,23,42,.08); border-radius: 12px;
            background: #fff; box-shadow: 0 4px 14px rgba(15,23,42,.04);
        }
        .boletin-card__icon {
            flex: 0 0 2.4rem; width: 2.4rem; height: 2.4rem; border-radius: 999px;
            display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.05rem;
        }
        .boletin-card__icon.info { background: #0ea5e9; }
        .boletin-card__icon.success { background: #16a34a; }
        .boletin-card__icon.warning { background: #d97706; }
        .boletin-card__icon.danger { background: #dc2626; }
        .boletin-card__body { flex: 1; min-width: 0; }
        .boletin-card__title { font-weight: 800; margin: 0 0 0.2rem; font-size: 0.92rem; }
        .boletin-card__msg { margin: 0; color: #475569; font-size: 0.82rem; white-space: pre-wrap; }
        .boletin-card__meta { display: block; margin-top: 0.35rem; font-size: 0.7rem; color: #94a3b8; }
        .boletin-card__actions { display:flex; flex-direction:column; gap:0.35rem; }
        .boletin-card__actions .btn { white-space:nowrap; }
        .boletin-icon-pick { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .boletin-icon-pick .btn { min-width: 6.2rem; }
        .boletin-icon-pick .btn.is-on { box-shadow: 0 0 0 2px currentColor; font-weight: 800; }
        body.sygma-dark .boletin-card { background: #152033; border-color: #243044; }
        body.sygma-dark .boletin-card__title { color: #e2e8f0; }
        body.sygma-dark .boletin-card__msg { color: #cbd5e1; }
        `;
        document.head.appendChild(style);
    }

    const view = {
        body: () => `
            <div class="pos2-wrap">
                <div class="pos2-totals-bar">
                    <div class="row align-items-center no-gutters">
                        <div class="col-md-8 col-7">
                            <div class="d-flex align-items-center">
                                <img src="./favicon.png" width="36" height="36" alt="" class="mr-2">
                                <div>
                                    <div class="negrita mb-0 pos2-bar-title" style="font-size:0.95rem">Boletín informativo</div>
                                    <div class="small" style="opacity:0.9" id="lbBoletinTotal">0 avisos</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-5">
                            <label class="small mb-1" style="opacity:0.9">Buscar</label>
                            <input type="text" class="form-control form-control-sm pos2-search-input"
                                id="txtBuscarBoletin" placeholder="Título o mensaje...">
                        </div>
                    </div>
                </div>
                <div class="pos2-panel-card">
                    <div class="pos2-panel-head">
                        <span class="negrita mb-0"><i class="fal fa-bullhorn mr-1"></i> Avisos de la empresa</span>
                    </div>
                    <div id="boletinLista" class="boletin-list"></div>
                </div>
                ${view.modal_nuevo()}
            </div>
            <button type="button" class="btn sygma-fab-nuevo btn-success btn-xl btn-circle shadow hand" id="btnBoletinNuevo" title="Nuevo aviso">
                <i class="fal fa-plus"></i>
            </button>
        `,
        modal_nuevo: () => `
            <div id="modal_boletin" class="modal fade modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-base text-white py-2">
                            <h5 class="modal-title mb-0">Nuevo aviso</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-4 pos2-doc-compact">
                            <div class="form-group">
                                <label>Título</label>
                                <input type="text" class="form-control negrita" id="txtBoletinTitulo" maxlength="200">
                            </div>
                            <div class="form-group">
                                <label>Mensaje</label>
                                <textarea class="form-control" id="txtBoletinMensaje" rows="4"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Icono</label>
                                <input type="hidden" id="txtBoletinIcono" value="info">
                                <div class="boletin-icon-pick" id="boletinIconPick">
                                    <button type="button" class="btn btn-info btn-sm is-on" data-icono="info"><i class="fal fa-info-circle mr-1"></i>Info</button>
                                    <button type="button" class="btn btn-success btn-sm" data-icono="success"><i class="fal fa-check-circle mr-1"></i>Éxito</button>
                                    <button type="button" class="btn btn-warning btn-sm" data-icono="warning"><i class="fal fa-exclamation-triangle mr-1"></i>Aviso</button>
                                    <button type="button" class="btn btn-danger btn-sm" data-icono="danger"><i class="fal fa-times-circle mr-1"></i>Urgente</button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Destinatario (no se muestra en el boletín)</label>
                                <select class="form-control" id="cmbBoletinCodemp">
                                    <option value="0">Todos los usuarios de la empresa</option>
                                </select>
                            </div>
                            <div class="row mt-3">
                                <div class="col-6">
                                    <button type="button" class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                        <i class="fal fa-arrow-left"></i>
                                    </button>
                                </div>
                                <div class="col-6 text-right">
                                    <button type="button" class="btn btn-base btn-circle btn-xl hand shadow" id="btnBoletinGuardar">
                                        <i class="fal fa-save"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    root = document.getElementById('root');
    root.innerHTML = view.body();
}

function boletin_setIcono(valor) {
    const v = String(valor || 'info');
    const hidden = document.getElementById('txtBoletinIcono');
    if (hidden) hidden.value = v;
    document.querySelectorAll('#boletinIconPick [data-icono]').forEach((btn) => {
        btn.classList.toggle('is-on', btn.getAttribute('data-icono') === v);
    });
}

function boletin_cargarEmpleados() {
    const cmb = document.getElementById('cmbBoletinCodemp');
    if (!cmb) return;
    cmb.innerHTML = '<option value="0">Todos los usuarios de la empresa</option>';
    if (typeof GF === 'undefined' || typeof GF.get_data_empleados_listado !== 'function') return;
    GF.get_data_empleados_listado(GlobalEmpnit, 'SI')
        .then((data) => {
            (data.recordset || []).forEach((r) => {
                cmb.innerHTML += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO || r.CODEMPLEADO}</option>`;
            });
        })
        .catch(() => {});
}

function boletin_render(rows) {
    const box = document.getElementById('boletinLista');
    const lb = document.getElementById('lbBoletinTotal');
    const q = String(document.getElementById('txtBuscarBoletin')?.value || '').trim().toLowerCase();
    let list = rows || [];
    if (q) {
        list = list.filter((r) => {
            const t = String(r.TITULO || '').toLowerCase();
            const m = String(r.MENSAJE || '').toLowerCase();
            return t.indexOf(q) >= 0 || m.indexOf(q) >= 0;
        });
    }
    if (lb) lb.textContent = `${list.length} aviso${list.length === 1 ? '' : 's'}`;
    if (!box) return;
    if (!list.length) {
        box.innerHTML = '<div class="text-center text-muted py-4">No hay avisos.</div>';
        return;
    }
    box.innerHTML = list.map((r) => {
        const meta = boletin_iconMeta(r.ICONO);
        const when = [r.FECHA, r.HORA].filter(Boolean).join(' · ');
        return `
            <div class="boletin-card">
                <div class="boletin-card__icon ${meta.cls}" title="${meta.label}"><i class="fal ${meta.icon}"></i></div>
                <div class="boletin-card__body">
                    <h6 class="boletin-card__title">${boletin_esc(r.TITULO)}</h6>
                    <p class="boletin-card__msg">${boletin_esc(r.MENSAJE)}</p>
                    <small class="boletin-card__meta">${boletin_esc(when)}</small>
                </div>
                <div class="boletin-card__actions" onclick="event.stopPropagation()">
                    <button type="button" class="btn btn-sm btn-info hand negrita" title="Emitir noticia"
                        data-boletin-emit="${r.ID}"><i class="fal fa-bullhorn mr-1"></i>Emitir noticia</button>
                    <button type="button" class="btn btn-sm btn-circle btn-danger hand shadow" title="Eliminar"
                        data-boletin-del="${r.ID}"><i class="fal fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

function boletin_cargar() {
    const box = document.getElementById('boletinLista');
    if (box) box.innerHTML = `<div class="text-center py-4">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</div>`;
    axios.post(GlobalUrlCalls + '/boletin/list', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        codemp: Number(GlobalCodUsuario) || 0,
    })
        .then((res) => {
            if (res.data === 'error') throw new Error('error');
            window._cacheBoletin = res.data.recordset || [];
            boletin_render(window._cacheBoletin);
        })
        .catch(() => {
            window._cacheBoletin = [];
            const lista = document.getElementById('boletinLista');
            if (lista) lista.innerHTML = '<div class="text-center text-muted py-4">No se pudo cargar el boletín.</div>';
        });
}

function boletin_guardar() {
    const titulo = String(document.getElementById('txtBoletinTitulo')?.value || '').trim();
    const mensaje = String(document.getElementById('txtBoletinMensaje')?.value || '').trim();
    const icono = document.getElementById('txtBoletinIcono')?.value || 'info';
    const codemp = Number(document.getElementById('cmbBoletinCodemp')?.value) || 0;
    const btn = document.getElementById('btnBoletinGuardar');
    if (!titulo || !mensaje) {
        F.AvisoError('Escriba título y mensaje');
        return;
    }
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-save fa-spin"></i>';
    }
    axios.post(GlobalUrlCalls + '/boletin/insert', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        codemp,
        titulo,
        mensaje,
        icono,
    })
        .then((res) => {
            if (!res.data || res.data.ok !== true) throw new Error(res.data && res.data.error ? res.data.error : 'error');
            $('#modal_boletin').modal('hide');
            const n = Number(res.data.enviados) || 0;
            F.Aviso(n > 0 ? ('Aviso publicado y notificación enviada (' + n + ')') : 'Aviso publicado');
            boletin_cargar();
        })
        .catch((err) => {
            F.AvisoError((err && err.message) || 'No se pudo publicar el aviso');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fal fa-save"></i>';
            }
        });
}

function boletin_emitir(id, btn) {
    const nid = Number(id) || 0;
    if (!nid) return;
    const htmlOriginal = btn ? btn.innerHTML : '';
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-spinner fa-spin mr-1"></i>Emitiendo';
    }
    axios.post(GlobalUrlCalls + '/boletin/emitir', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        id: nid,
    })
        .then((res) => {
            if (!res.data || res.data.ok !== true) throw new Error((res.data && res.data.error) || 'error');
            const n = Number(res.data.enviados) || 0;
            F.Aviso(n > 0 ? ('Notificación enviada (' + n + ')') : 'Noticia emitida. No hay dispositivos suscritos.');
        })
        .catch((err) => {
            F.AvisoError((err && err.message && err.message !== 'error') ? err.message : 'No se pudo emitir la noticia');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = htmlOriginal || '<i class="fal fa-bullhorn mr-1"></i>Emitir noticia';
            }
        });
}

function boletin_eliminar(id, btn) {
    F.Confirmacion('¿Eliminar este aviso del boletín?')
        .then((ok) => {
            if (ok !== true) return;
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fal fa-trash fa-spin"></i>';
            }
            axios.post(GlobalUrlCalls + '/boletin/delete', {
                token: TOKEN,
                sucursal: GlobalEmpnit,
                id,
            })
                .then((res) => {
                    if (res.data === 'error') throw new Error('error');
                    F.Aviso('Aviso eliminado');
                    boletin_cargar();
                })
                .catch(() => {
                    F.AvisoError('No se pudo eliminar');
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = '<i class="fal fa-trash"></i>';
                    }
                });
        });
}

function addListeners() {
    document.title = 'Boletín informativo';
    document.getElementById('btnBoletinNuevo')?.addEventListener('click', () => {
        document.getElementById('txtBoletinTitulo').value = '';
        document.getElementById('txtBoletinMensaje').value = '';
        document.getElementById('cmbBoletinCodemp').value = '0';
        boletin_setIcono('info');
        $('#modal_boletin').modal('show');
    });
    document.getElementById('btnBoletinGuardar')?.addEventListener('click', boletin_guardar);
    document.getElementById('boletinIconPick')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-icono]');
        if (btn) boletin_setIcono(btn.getAttribute('data-icono'));
    });
    document.getElementById('txtBuscarBoletin')?.addEventListener('input', () => boletin_render(window._cacheBoletin || []));
    document.getElementById('boletinLista')?.addEventListener('click', (e) => {
        const emitBtn = e.target.closest('[data-boletin-emit]');
        if (emitBtn) {
            boletin_emitir(Number(emitBtn.getAttribute('data-boletin-emit')), emitBtn);
            return;
        }
        const btn = e.target.closest('[data-boletin-del]');
        if (!btn) return;
        boletin_eliminar(Number(btn.getAttribute('data-boletin-del')), btn);
    });
    boletin_cargarEmpleados();
    boletin_cargar();
    if (typeof sygma_push_subscribe === 'function') sygma_push_subscribe();
}

function initView() {
    getView();
    addListeners();
}
