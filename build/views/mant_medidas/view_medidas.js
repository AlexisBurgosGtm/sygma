'use strict';

const MEDIDA_FIJA = 'BONI';
let medidasEditando = '';

function medidas_esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function medidas_esFija(cod) {
    return String(cod || '').trim().toUpperCase() === MEDIDA_FIJA;
}

function getView() {
    if (typeof spa_inyectarEstilosPos2 === 'function') spa_inyectarEstilosPos2();
    let st = document.getElementById('medidas-styles');
    if (!st) {
        st = document.createElement('style');
        st.id = 'medidas-styles';
        document.head.appendChild(st);
    }
    st.textContent = `
        .medidas-pill {
            font-size:0.68rem; font-weight:800; padding:0.12rem 0.5rem;
            border-radius:999px; background:#f1f5f9; color:#475569; letter-spacing:.02em;
        }
        .medidas-pill.is-fija { background:#ede9fe; color:#6d28d9; }
        #modal_medida .modal-content { border-radius:16px; overflow:hidden; }
        #modal_medida .modal-header { border:0; padding:0.85rem 1rem; }
        #modal_medida .modal-footer { border-top:1px solid rgba(15,23,42,.06); }
        body.sygma-dark .medidas-pill { background:#243044; color:#94a3b8; }
        body.sygma-dark .medidas-pill.is-fija { background:#2e1065; color:#c4b5fd; }
    `;

    const view = {
        body: () => `
            <div class="pos2-wrap">
                <div class="pos2-totals-bar">
                    <div class="row align-items-center no-gutters">
                        <div class="col-12 col-md-7 mb-2 mb-md-0">
                            <div class="d-flex align-items-center">
                                <img src="./favicon.png" width="36" height="36" alt="" class="mr-2">
                                <div>
                                    <div class="negrita mb-0 pos2-bar-title" style="font-size:0.95rem">Medidas</div>
                                    <div class="small" style="opacity:0.9" id="lbTotalMedidas">0 medidas</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-5">
                            <label class="small mb-1" style="opacity:0.9">Buscar</label>
                            <input type="text" class="form-control form-control-sm pos2-search-input"
                                id="txtBuscarMedida"
                                placeholder="Código o descripción..."
                                oninput="F.FiltrarTabla('tblMedidas','txtBuscarMedida')">
                        </div>
                    </div>
                </div>

                <div class="pos2-panel-card">
                    <div class="pos2-panel-head d-flex justify-content-between align-items-center">
                        <span class="negrita mb-0"><i class="fal fa-ruler-combined mr-1"></i> Catálogo de medidas</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="pos2-table-scroll table-responsive">
                            <table class="table table-sm table-hover mb-0 pos2-table-compact" id="tblMedidas">
                                <thead class="bg-base text-white">
                                    <tr>
                                        <th>CÓDIGO</th>
                                        <th>DESCRIPCIÓN</th>
                                        <th>TIPO</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="tblDataMedidas">
                                    <tr><td colspan="4" class="text-center text-muted">Cargando...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <button type="button" class="btn btn-success btn-xl hand shadow btn-circle sygma-fab-nuevo" id="btnMedidaNueva" title="Nueva medida">
                <i class="fal fa-plus"></i>
            </button>

            <div class="modal fade" tabindex="-1" role="dialog" id="modal_medida">
                <div class="modal-dialog modal-md modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-base text-white">
                            <h5 class="modal-title negrita mb-0" id="lbMedidaModalTitulo">Nueva medida</h5>
                        </div>
                        <div class="modal-body">
                            <label class="negrita small mb-1">Código</label>
                            <input type="text" class="form-control negrita text-uppercase" id="txtMedidaCod"
                                maxlength="30" placeholder="Ej. UND, CAJ, BONI">
                            <label class="negrita small mb-1 mt-3">Descripción</label>
                            <input type="text" class="form-control" id="txtMedidaDes"
                                maxlength="100" placeholder="Ej. Unidad, Caja">
                            <div class="small text-muted mt-2" id="lbMedidaHint"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-success" id="btnMedidaGuardar">
                                <i class="fal fa-save mr-1"></i> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    root = document.getElementById('root');
    root.innerHTML = view.body();
}

function medidas_abrirNueva() {
    medidasEditando = '';
    document.getElementById('lbMedidaModalTitulo').textContent = 'Nueva medida';
    const txtCod = document.getElementById('txtMedidaCod');
    const txtDes = document.getElementById('txtMedidaDes');
    txtCod.value = '';
    txtDes.value = '';
    txtCod.disabled = false;
    document.getElementById('btnMedidaGuardar').style.display = '';
    document.getElementById('lbMedidaHint').textContent = '';
    $('#modal_medida').modal('show');
    setTimeout(() => txtCod.focus(), 180);
}

function medidas_abrirEditar(cod, des) {
    if (medidas_esFija(cod)) {
        F.AvisoError('La medida BONI es fija y no se puede editar');
        return;
    }
    medidasEditando = String(cod || '').trim();
    document.getElementById('lbMedidaModalTitulo').textContent = 'Editar medida';
    const txtCod = document.getElementById('txtMedidaCod');
    const txtDes = document.getElementById('txtMedidaDes');
    txtCod.value = medidasEditando;
    txtDes.value = String(des || '');
    txtCod.disabled = true;
    document.getElementById('btnMedidaGuardar').style.display = '';
    document.getElementById('lbMedidaHint').textContent = 'El código no se modifica después de creada la medida.';
    $('#modal_medida').modal('show');
    setTimeout(() => txtDes.focus(), 180);
}

function medidas_cargarListado() {
    const container = document.getElementById('tblDataMedidas');
    const lb = document.getElementById('lbTotalMedidas');
    if (!container) return;
    container.innerHTML = `<tr><td colspan="4" class="text-center text-muted">${typeof GlobalLoader !== 'undefined' ? GlobalLoader : 'Cargando...'}</td></tr>`;
    if (lb) lb.textContent = 'Cargando...';

    axios.post(GlobalUrlCalls + '/medidas/listado', { token: TOKEN })
        .then((res) => {
            if (!res.data || res.data.ok === false) throw new Error('error');
            const rows = res.data.recordset || [];
            if (!rows.length) {
                container.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Sin medidas.</td></tr>';
                if (lb) lb.textContent = '0 medidas';
                return;
            }
            container.innerHTML = rows.map((r) => {
                const fija = Number(r.FIJA) === 1 || medidas_esFija(r.CODMEDIDA);
                const codJs = JSON.stringify(String(r.CODMEDIDA || ''));
                const desJs = JSON.stringify(String(r.DESMEDIDA || ''));
                const acciones = fija
                    ? `<span class="text-muted small"><i class="fal fa-lock mr-1"></i>Protegida</span>`
                    : `<button type="button" class="btn btn-sm btn-outline-info mr-1" title="Editar"
                            onclick='medidas_abrirEditar(${codJs}, ${desJs})'>
                            <i class="fal fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger" title="Eliminar"
                            onclick='medidas_eliminar(${codJs})'>
                            <i class="fal fa-trash"></i>
                        </button>`;
                return `
                    <tr>
                        <td class="negrita">${medidas_esc(r.CODMEDIDA)}</td>
                        <td>${medidas_esc(r.DESMEDIDA)}</td>
                        <td>
                            <span class="medidas-pill${fija ? ' is-fija' : ''}">${fija ? 'FIJA' : 'EDITABLE'}</span>
                        </td>
                        <td class="text-right">${acciones}</td>
                    </tr>`;
            }).join('');
            if (lb) lb.textContent = rows.length + (rows.length === 1 ? ' medida' : ' medidas');
            const buscar = document.getElementById('txtBuscarMedida');
            if (buscar) buscar.value = '';
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No se pudieron cargar las medidas.</td></tr>';
            if (lb) lb.textContent = '0 medidas';
        });
}

function medidas_guardar() {
    const txtCod = document.getElementById('txtMedidaCod');
    const txtDes = document.getElementById('txtMedidaDes');
    const btn = document.getElementById('btnMedidaGuardar');
    const codigo = String(txtCod.value || '').trim().toUpperCase();
    const descripcion = String(txtDes.value || '').trim() || codigo;

    if (!codigo) {
        F.AvisoError('Indique el código de la medida');
        txtCod.focus();
        return;
    }
    if (medidas_esFija(codigo) && !medidasEditando) {
        F.AvisoError('La medida BONI es fija y no se puede crear ni modificar');
        return;
    }
    if (medidas_esFija(medidasEditando)) {
        F.AvisoError('La medida BONI es fija y no se puede editar');
        return;
    }

    const editando = !!medidasEditando;
    const url = GlobalUrlCalls + (editando ? '/medidas/update' : '/medidas/insert');
    const payload = {
        token: TOKEN,
        codigo: editando ? medidasEditando : codigo,
        descripcion
    };

    btn.disabled = true;
    axios.post(url, payload)
        .then((res) => {
            btn.disabled = false;
            if (!res.data || res.data.ok === false) {
                F.AvisoError((res.data && res.data.error) || 'No se pudo guardar');
                return;
            }
            F.Aviso(editando ? 'Medida actualizada' : 'Medida creada');
            $('#modal_medida').modal('hide');
            medidas_cargarListado();
        })
        .catch(() => {
            btn.disabled = false;
            F.AvisoError('No se pudo guardar la medida');
        });
}

function medidas_eliminar(cod) {
    if (medidas_esFija(cod)) {
        F.AvisoError('La medida BONI es fija y no se puede eliminar');
        return;
    }
    F.Confirmacion('¿Eliminar la medida ' + String(cod || '') + '?')
        .then((ok) => {
            if (!ok) return;
            axios.post(GlobalUrlCalls + '/medidas/delete', { token: TOKEN, codigo: cod })
                .then((res) => {
                    if (!res.data || res.data.ok === false) {
                        F.AvisoError((res.data && res.data.error) || 'No se pudo eliminar');
                        return;
                    }
                    F.Aviso('Medida eliminada');
                    medidas_cargarListado();
                })
                .catch(() => F.AvisoError('No se pudo eliminar la medida'));
        });
}

function addListeners() {
    document.title = 'Medidas';
    document.getElementById('btnMedidaNueva')?.addEventListener('click', medidas_abrirNueva);
    document.getElementById('btnMedidaGuardar')?.addEventListener('click', medidas_guardar);
    document.getElementById('txtMedidaCod')?.addEventListener('input', function () {
        this.value = String(this.value || '').toUpperCase();
    });
    medidas_cargarListado();
}

function initView() {
    getView();
    addListeners();
}
