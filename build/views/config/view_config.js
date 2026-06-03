'use strict';

/** ID en tabla CONFIG para “permite inventario negativo” (índice 0 en data_config_general). */
let ConfigInvNegativoId = null;

function config_inyectarEstilos() {
    if (document.getElementById('config-styles')) return;
    const style = document.createElement('style');
    style.id = 'config-styles';
    style.textContent = `
        .config-wrap { max-width: 100%; }
        .config-panel-head {
            background: linear-gradient(135deg, #f8f9fc 0%, #eef2f7 100%);
            border: 1px solid #dee2e6;
            border-radius: 10px 10px 0 0;
            padding: 0.45rem 0.85rem;
            margin: 0;
        }
        .config-panel-card {
            border: 1px solid #dee2e6;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,.06);
            margin-bottom: 0.75rem;
            height: 100%;
        }
        .config-panel-card > .card-body { padding: 0.85rem 1rem; }
        .config-placeholder {
            border: 1px dashed #dee2e6;
            border-radius: 10px;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6c757d;
            background: #fafbfc;
        }
    `;
    document.head.appendChild(style);
}

function getView() {
    config_inyectarEstilos();

    const view = {
        body: () => `
            <div class="config-wrap">
                <div class="row">
                    <div class="col-lg-6 col-12 mb-3">
                        ${view.card_inventario_negativo()}
                    </div>
                    <div class="col-lg-6 col-12 mb-3">
                        <div class="config-placeholder">
                            <span class="text-secondary">Espacio reservado para más configuraciones</span>
                        </div>
                    </div>
                </div>
            </div>
        `,
        card_inventario_negativo: () => `
            <div class="config-panel-card">
                <div class="config-panel-head">
                    <span class="negrita text-base mb-0"><i class="fal fa-sliders-h mr-1"></i> Inventario</span>
                </div>
                <div class="card-body">
                    <div class="form-group mb-3">
                        <label class="negrita text-secondary mb-1" for="cmbPermiteInvNegativo">Permite inventario negativo?</label>
                        <select class="form-control negrita border-base" id="cmbPermiteInvNegativo">
                            <option value="SI">SI</option>
                            <option value="NO">NO</option>
                        </select>
                        <small class="text-muted d-block mt-2" id="lbConfigInvNegDesc"></small>
                    </div>
                    <div class="text-right">
                        <button type="button" class="btn btn-base text-white hand" id="btnGuardarConfigInv">
                            <i class="fal fa-save mr-1"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        `
    };

    root.innerHTML = view.body();
}

function config_cargar_inventario_negativo() {
    const cmb = document.getElementById('cmbPermiteInvNegativo');
    const lbDesc = document.getElementById('lbConfigInvNegDesc');
    if (!cmb) return;

    const aplicar = (rows) => {
        const row = (rows && rows.length) ? rows[0] : null;
        if (!row) {
            cmb.value = 'NO';
            ConfigInvNegativoId = null;
            if (lbDesc) lbDesc.textContent = 'Sin configuración cargada.';
            return;
        }
        ConfigInvNegativoId = row.ID;
        const valor = String(row.VALOR || 'NO').toUpperCase();
        cmb.value = (valor === 'SI') ? 'SI' : 'NO';
        if (lbDesc) {
            lbDesc.textContent = row.DESCRIPCION ? String(row.DESCRIPCION) : '';
        }
    };

    if (data_config_general && data_config_general.length) {
        aplicar([data_config_general[0]]);
        return;
    }

    GF.get_data_config()
        .then((data) => {
            data_config_general = data.recordset || [];
            aplicar([data_config_general[0]]);
        })
        .catch(() => {
            cmb.value = 'NO';
            if (lbDesc) lbDesc.textContent = 'No se pudo cargar la configuración.';
        });
}

function config_guardar_inventario_negativo() {
    const cmb = document.getElementById('cmbPermiteInvNegativo');
    const btn = document.getElementById('btnGuardarConfigInv');
    if (!cmb || ConfigInvNegativoId == null) {
        F.AvisoError('Configuración no disponible');
        return;
    }

    const valor = cmb.value;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-sync fa-spin mr-1"></i> Guardando...';
    }

    axios.post(GlobalUrlCalls + '/config/update_valor', {
        token: TOKEN,
        id: ConfigInvNegativoId,
        valor: valor
    })
    .then((response) => {
        if (response.data === 'error') {
            F.AvisoError('No se pudo guardar');
            return;
        }
        if (data_config_general && data_config_general[0]) {
            data_config_general[0].VALOR = valor;
        }
        F.Aviso('Configuración guardada');
    })
    .catch(() => {
        F.AvisoError('No se pudo guardar');
    })
    .finally(() => {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fal fa-save mr-1"></i> Guardar';
        }
    });
}

function addListeners() {
    document.title = 'Configuraciones Generales';

    config_cargar_inventario_negativo();

    const btn = document.getElementById('btnGuardarConfigInv');
    if (btn) {
        btn.addEventListener('click', config_guardar_inventario_negativo);
    }
}

function destroyView() {
    ConfigInvNegativoId = null;
}

function initView() {
    getView();
    addListeners();
}
