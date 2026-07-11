var mercaderista_currentPane = 'uno';
var mercaderista_cliente_sel = null;
var mercaderista_detalle_actual = null;
var mercaderista_faltantes_productos = [];
var mercaderista_precios_cache = [];
var mercaderista_act_fotos = {
    ota_antes: null, ota_despues: null,
    vitrinas_antes: null, vitrinas_despues: null,
    pop_antes: null, pop_despues: null,
};
var mercaderista_barcode_stream = null;

function mercaderista_setActiveCard(cardId) {
    document.querySelectorAll('.proveedor-menu-card').forEach((el) => {
        el.classList.toggle('proveedor-menu-card--active', !!cardId && el.id === cardId);
    });
}

function mercaderista_toggleSidebar(forceOpen) {
    const sidebar = document.getElementById('mercaderistaSidebar');
    const backdrop = document.getElementById('mercaderistaSidebarBackdrop');
    if (!sidebar) return;
    const open = typeof forceOpen === 'boolean' ? forceOpen : !sidebar.classList.contains('proveedor-sidebar--open');
    sidebar.classList.toggle('proveedor-sidebar--open', open);
    backdrop?.classList.toggle('proveedor-sidebar-backdrop--visible', open);
    document.body.classList.toggle('proveedor-sidebar-open', open);
}

function mercaderista_closeSidebarMobile() {
    if (window.innerWidth < 768) mercaderista_toggleSidebar(false);
}

function mercaderista_showPanel(paneId, cardId, afterShow) {
    mercaderista_currentPane = paneId;
    mercaderista_closeSidebarMobile();
    document.querySelectorAll('#myTabHomeContent .tab-pane').forEach((p) => {
        p.classList.remove('show', 'active');
    });
    const pane = document.getElementById(paneId);
    if (pane) pane.classList.add('show', 'active');
    document.querySelectorAll('#myTabHome .nav-link').forEach((l) => {
        l.classList.remove('active');
        l.setAttribute('aria-selected', 'false');
    });
    const tabLink = document.querySelector(`#myTabHome a[href="#${paneId}"]`);
    if (tabLink) {
        tabLink.classList.add('active');
        tabLink.setAttribute('aria-selected', 'true');
    }
    mercaderista_setActiveCard(cardId);
    if (typeof afterShow === 'function') afterShow();
}

function mercaderista_showHome() {
    mercaderista_showPanel('uno', 'btnMenuMercHome', () => {
        mercaderista_toggle_qr_btn(true);
        mercaderista_cargar_clientes();
    });
}

function mercaderista_showPrecios() {
    mercaderista_showPanel('dos', 'btnMenuMercPrecios', () => {
        mercaderista_toggle_qr_btn(false);
        mercaderista_cargar_precios();
    });
}

function mercaderista_toggle_qr_btn(visible) {
    const btn = document.getElementById('btnMercaderistaCameraQR');
    if (btn) btn.style.display = visible ? '' : 'none';
}

function getView() {
    const view = {
        body: () => `
            <div class="proveedor-layout">
                <div class="proveedor-header-card card shadow-sm mb-3">
                    <div class="card-body py-2 px-3">
                        <div class="row align-items-center no-gutters">
                            <div class="col-auto pr-2">
                                <img src="./favicon.png" width="50" height="50" alt="Logo">
                            </div>
                            <div class="col">
                                <h5 class="negrita text-white mb-0">INICIO MERCADERISTA</h5>
                                <small class="text-white-50 negrita d-block" id="lbMercaderistaEmpresa"></small>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn proveedor-menu-toggle d-md-none" id="btnMercaderistaMenuToggle" title="Menú de opciones">
                    <i class="fal fa-bars"></i><span>Menú</span>
                </button>
                <div class="proveedor-sidebar-backdrop d-md-none" id="mercaderistaSidebarBackdrop"></div>

                <div class="row proveedor-main-row">
                    <div class="col-12 col-md-2 proveedor-sidebar" id="mercaderistaSidebar">
                        <div class="proveedor-sidebar__scroll">
                            ${view.menu()}
                        </div>
                    </div>
                    <div class="col-12 col-md-10 proveedor-tab-area">
                        <div class="tab-content" id="myTabHomeContent">
                            <div class="tab-pane fade show active" id="uno" role="tabpanel">
                                ${view.vista_inicio()}
                            </div>
                            <div class="tab-pane fade" id="dos" role="tabpanel">
                                ${view.vista_precios()}
                            </div>
                        </div>
                    </div>
                </div>

                <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                    <li class="nav-item"><a class="nav-link active" id="tab-uno" data-toggle="tab" href="#uno"></a></li>
                    <li class="nav-item"><a class="nav-link" id="tab-dos" data-toggle="tab" href="#dos"></a></li>
                </ul>

                ${view.modal_actividades()}
                ${view.modal_no_visitado()}
                ${view.modal_faltantes()}
                ${view.modal_detalle_visita()}
                ${view.modal_fotos_actividad()}
                ${view.modal_faltantes_lista()}
                ${view.modal_camara_qr()}

                <button type="button" class="btn btn-danger btn-xl btn-bottom-middle btn-circle shadow hand"
                    id="btnMercaderistaCameraQR" title="Buscar cliente por QR">
                    <i class="fal fa-camera"></i>
                </button>
            </div>
        `,
        menu: () => {
            const items = [
                { id: 'btnMenuMercHome', label: 'Inicio', icon: 'fa-home', color: 'primary' },
                { id: 'btnMenuMercPrecios', label: 'Precios', icon: 'fa-tags', color: 'success' },
            ];
            return items.map((item) => `
                <div class="card proveedor-menu-card hand" id="${item.id}">
                    <div class="card-body d-flex align-items-center flex-wrap">
                        <i class="fal ${item.icon} text-${item.color} mr-2 proveedor-menu-icon"></i>
                        <span class="negrita proveedor-menu-label">${item.label}</span>
                    </div>
                </div>
            `).join('');
        },
        vista_inicio: () => `
            <div class="row mb-2">
                <div class="col-6 mb-2">
                    <div class="card card-rounded shadow h-100 border-0">
                        <div class="card-body p-3">
                            <label class="negrita text-secondary small mb-1" for="txtMercaderistaFecha">Fecha del día</label>
                            <input type="date" class="form-control negrita text-base border-base" id="txtMercaderistaFecha">
                        </div>
                    </div>
                </div>
                <div class="col-6 mb-2">
                    <div class="card card-rounded shadow h-100 border-0 bg-base">
                        <div class="card-body p-3 text-white">
                            <h6 class="negrita text-secondary mb-1">Clientes del día</h6>
                            <h3 class="negrita text-secondary mb-0" id="lbMercaderistaTotalClientes">0</h3>
                            <small class="text-info-50 text-info" id="lbMercaderistaDiaLabel">--</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card card-rounded shadow border-0">
                <div class="card-body p-2 p-md-3">

                    <div class="row align-items-end mb-2">
                        <div class="col-6">
                            <label class="negrita text-secondary small mb-1" for="cmbMercaderistaDia">Día de visita</label>
                            <select class="form-control negrita text-danger border-danger" id="cmbMercaderistaDia">
                                <option value="LUNES">LUNES</option>
                                <option value="MARTES">MARTES</option>
                                <option value="MIERCOLES">MIERCOLES</option>
                                <option value="JUEVES">JUEVES</option>
                                <option value="VIERNES">VIERNES</option>
                                <option value="SABADO">SABADO</option>
                                <option value="DOMINGO">DOMINGO</option>
                                <option value="OTROS">OTROS</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="negrita text-secondary small mb-1" for="cmbMercaderistaEstadoVisita">Estado</label>
                            <select class="form-control negrita text-base" id="cmbMercaderistaEstadoVisita">
                                <option value="PENDIENTE" selected>PENDIENTE</option>
                                <option value="ENCURSO">EN CURSO</option>
                                <option value="VISITADO">FINALIZADO</option>
                            </select>
                        </div>
                   
                    </div>

                    <div class="row align-items-end mb-2">
                        <div class="col-12">
                            <label class="negrita text-secondary small mb-1" for="txtMercaderistaBuscar">Buscar</label>
                            <input type="search" class="form-control" id="txtMercaderistaBuscar"
                                placeholder="Buscar por código, cliente, negocio o dirección..."
                                oninput="mercaderista_filtrar_clientes()">
                        </div>
                    </div>

                    <div id="tblMercaderistaClientesCards" class="d-md-none"></div>

                    <div class="table-responsive d-none d-md-block">
                        <table class="table table-sm table-bordered table-hover mb-0" id="tblMercaderistaClientes" style="min-width:720px">
                            <thead class="bg-base text-white">
                                <tr>
                                    <th>TIPO</th>
                                    <th>NEGOCIO</th>
                                    <th>CLIENTE</th>
                                    <th>DIRECCIÓN</th>
                                    <th>MUNICIPIO</th>
                                    <th class="text-center">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataMercaderistaClientes"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,
        vista_precios: () => `
            <div class="card card-rounded shadow border-0">
                <div class="card-body p-2 p-md-3">
                    <div class="row align-items-end mb-2">
                        <div class="col-12">
                            <label class="negrita text-secondary small mb-1" for="txtMercaderistaBuscarPrecios">Buscar</label>
                            <input type="search" class="form-control" id="txtMercaderistaBuscarPrecios"
                                placeholder="Buscar por código, producto o medida..."
                                oninput="mercaderista_filtrar_precios()">
                        </div>
                    </div>
                    <div id="tblMercaderistaPreciosCards" class="d-md-none"></div>

                    <div class="table-responsive d-none d-md-block">
                        <table class="table table-sm table-bordered table-hover mb-0" id="tblMercaderistaPrecios" style="min-width:640px">
                            <thead class="bg-base text-white">
                                <tr>
                                    <th>PRODUCTO</th>
                                    <th>MEDIDA</th>
                                    <th class="text-center">EQUIVALE</th>
                                    <th class="text-right">PRECIO</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataMercaderistaPrecios">
                                <tr><td colspan="4" class="text-center text-muted py-3">Cargando precios...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,
        modal_actividades: () => `
            <div class="modal fade" id="modalMercaderistaActividades" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-info py-2">
                            <h5 class="modal-title text-white negrita mb-0">Actividades</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-3">
                            <p class="negrita mb-3" id="lbMercActividadesCliente"></p>

                            <div class="card border shadow-sm mb-3">
                                <div class="card-body p-2">
                                    <div class="d-flex align-items-center mb-2">
                                        <i class="fal fa-warehouse fa-2x text-info mr-2"></i>
                                        <span class="negrita text-base">OTA</span>
                                    </div>
                                    <div class="row">
                                        <div class="col-6">
                                            <label class="small negrita text-secondary">Foto antes</label>
                                            <input type="file" accept="image/*" class="form-control-file" id="fileMercOtaAntes"
                                                onchange="mercaderista_act_foto_change('ota_antes', this)">
                                            <small class="text-muted" id="lblMercOtaAntes"></small>
                                        </div>
                                        <div class="col-6">
                                            <label class="small negrita text-secondary">Foto después</label>
                                            <input type="file" accept="image/*" class="form-control-file" id="fileMercOtaDespues"
                                                onchange="mercaderista_act_foto_change('ota_despues', this)">
                                            <small class="text-muted" id="lblMercOtaDespues"></small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card border shadow-sm mb-3">
                                <div class="card-body p-2">
                                    <div class="d-flex align-items-center mb-2">
                                        <i class="fal fa-window-maximize fa-2x text-success mr-2"></i>
                                        <span class="negrita text-base">VITRINAS</span>
                                    </div>
                                    <div class="row">
                                        <div class="col-6">
                                            <label class="small negrita text-secondary">Foto antes</label>
                                            <input type="file" accept="image/*" class="form-control-file" id="fileMercVitrinasAntes"
                                                onchange="mercaderista_act_foto_change('vitrinas_antes', this)">
                                            <small class="text-muted" id="lblMercVitrinasAntes"></small>
                                        </div>
                                        <div class="col-6">
                                            <label class="small negrita text-secondary">Foto después</label>
                                            <input type="file" accept="image/*" class="form-control-file" id="fileMercVitrinasDespues"
                                                onchange="mercaderista_act_foto_change('vitrinas_despues', this)">
                                            <small class="text-muted" id="lblMercVitrinasDespues"></small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card border shadow-sm mb-2">
                                <div class="card-body p-2">
                                    <div class="d-flex align-items-center mb-2">
                                        <i class="fal fa-bullhorn fa-2x text-warning mr-2"></i>
                                        <span class="negrita text-base">POP</span>
                                    </div>
                                    <div class="row">
                                        <div class="col-6">
                                            <label class="small negrita text-secondary">Foto antes</label>
                                            <input type="file" accept="image/*" class="form-control-file" id="fileMercPopAntes"
                                                onchange="mercaderista_act_foto_change('pop_antes', this)">
                                            <small class="text-muted" id="lblMercPopAntes"></small>
                                        </div>
                                        <div class="col-6">
                                            <label class="small negrita text-secondary">Foto después</label>
                                            <input type="file" accept="image/*" class="form-control-file" id="fileMercPopDespues"
                                                onchange="mercaderista_act_foto_change('pop_despues', this)">
                                            <small class="text-muted" id="lblMercPopDespues"></small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer py-2 d-flex justify-content-between">
                            <button type="button" class="btn btn-secondary btn-sm" id="btnMercaderistaCancelarActividades">Cancelar</button>
                            <button type="button" class="btn btn-info btn-sm hand" id="btnMercaderistaGuardarActividades">
                                <i class="fal fa-save mr-1"></i> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        modal_no_visitado: () => `
            <div class="modal fade" id="modalMercaderistaNoVisitado" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-warning py-2">
                            <h5 class="modal-title negrita mb-0">No visitado</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-3">
                            <p class="negrita mb-2" id="lbMercNoVisitadoCliente"></p>
                            <div class="form-group mb-0">
                                <label class="negrita text-secondary" for="cmbMercaderistaMotivoNoVisita">Motivo por el que no se visitó</label>
                                <select class="form-control negrita" id="cmbMercaderistaMotivoNoVisita">
                                    <option value="TIENDA CERRADA">TIENDA CERRADA</option>
                                    <option value="NO ESTA EL ENCARGADO">NO ESTA EL ENCARGADO</option>
                                    <option value="PASO BLOQUEADO">PASO BLOQUEADO</option>
                                    <option value="CLIENTE NO PERMITIO">CLIENTE NO PERMITIO</option>
                                    <option value="NO SE LLEGO">NO SE LLEGO</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer py-2">
                            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-warning btn-sm hand" id="btnMercaderistaGuardarNoVisita">
                                <i class="fal fa-check mr-1"></i> Registrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        modal_faltantes: () => `
            <div class="modal fade" id="modalMercaderistaFaltantes" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-primary py-2">
                            <h5 class="modal-title text-white negrita mb-0">Faltantes</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-3">
                            <p class="negrita mb-2" id="lbMercFaltantesCliente"></p>
                            <p class="text-muted small mb-3">Marque los productos faltantes del cliente.</p>
                            <div class="table-responsive" style="max-height:55vh;overflow-y:auto">
                                <table class="table table-sm table-bordered table-hover mb-0">
                                    <thead class="bg-base text-white">
                                        <tr>
                                            <th class="text-center" style="width:48px"></th>
                                            <th>CÓDIGO</th>
                                            <th>PRODUCTO</th>
                                            <th>MARCA</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tblMercaderistaFaltantes">
                                        <tr><td colspan="4" class="text-center text-muted py-4">Cargando productos...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer py-2 d-flex justify-content-between">
                            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary btn-sm hand" id="btnMercaderistaGuardarFaltantes">
                                <i class="fal fa-save mr-1"></i> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        modal_detalle_visita: () => `
            <div class="modal fade" id="modalMercaderistaDetalleVisita" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-secondary py-2">
                            <h5 class="modal-title text-white negrita mb-0">Detalle de visita</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-3" id="bodyMercaderistaDetalleVisita">
                            <div class="text-center text-muted py-3">Cargando...</div>
                        </div>
                        <div class="modal-footer py-2">
                            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        modal_fotos_actividad: () => `
            <div class="modal fade" id="modalMercaderistaFotosActividad" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-info py-2">
                            <h5 class="modal-title text-white negrita mb-0" id="lbMercaderistaFotosTitulo">Fotos</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-3" id="bodyMercaderistaFotosActividad"></div>
                        <div class="modal-footer py-2">
                            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        modal_faltantes_lista: () => `
            <div class="modal fade" id="modalMercaderistaFaltantesLista" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-primary py-2">
                            <h5 class="modal-title text-white negrita mb-0">Faltantes registrados</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-3" id="bodyMercaderistaFaltantesLista"></div>
                        <div class="modal-footer py-2">
                            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        modal_camara_qr: () => `
            <div class="modal fade" id="modalMercaderistaBarcode" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-danger py-2">
                            <h5 class="modal-title text-white negrita mb-0">Lectura de código QR</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-3">
                            <div id="rootMercaderistaBarcode" class="text-center"></div>
                        </div>
                        <div class="modal-footer py-2">
                            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
    };

    const root = document.getElementById('root');
    root.innerHTML = view.body();
}

function mercaderista_esc(val) {
    return String(val == null ? '' : val)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'");
}

function mercaderista_hora_actual() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function mercaderista_fecha_partes() {
    const fecha = document.getElementById('txtMercaderistaFecha')?.value || F.getFecha();
    const p = fecha.split('-');
    return {
        fecha,
        mes: Number(p[1]) || 0,
        anio: Number(p[0]) || 0,
    };
}

function mercaderista_limpiar_fotos_actividades() {
    mercaderista_act_fotos = {
        ota_antes: null, ota_despues: null,
        vitrinas_antes: null, vitrinas_despues: null,
        pop_antes: null, pop_despues: null,
    };
    ['fileMercOtaAntes', 'fileMercOtaDespues', 'fileMercVitrinasAntes', 'fileMercVitrinasDespues', 'fileMercPopAntes', 'fileMercPopDespues']
        .forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    ['lblMercOtaAntes', 'lblMercOtaDespues', 'lblMercVitrinasAntes', 'lblMercVitrinasDespues', 'lblMercPopAntes', 'lblMercPopDespues']
        .forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.innerText = '';
        });
}

function mercaderista_act_foto_change(key, input) {
    const file = input?.files?.[0] || null;
    mercaderista_act_fotos[key] = file;
    const lblMap = {
        ota_antes: 'lblMercOtaAntes',
        ota_despues: 'lblMercOtaDespues',
        vitrinas_antes: 'lblMercVitrinasAntes',
        vitrinas_despues: 'lblMercVitrinasDespues',
        pop_antes: 'lblMercPopAntes',
        pop_despues: 'lblMercPopDespues',
    };
    const lbl = document.getElementById(lblMap[key]);
    if (lbl) lbl.innerText = file ? file.name : '';
}

function mercaderista_actividad_tiene_foto(prefijo) {
    return !!(mercaderista_act_fotos[`${prefijo}_antes`] || mercaderista_act_fotos[`${prefijo}_despues`]);
}

// Carpeta destino en pCloud (webdav) para las fotos del mercaderista
var MERCADERISTA_STORAGE_FOLDER = '/XELASOL';

function mercaderista_fecha_ddmmyy(fecha) {
    // fecha llega como YYYY-MM-DD
    const p = String(fecha || '').split('-');
    if (p.length < 3) return String(fecha || '');
    const yy = String(p[0]).slice(-2);
    return `${p[2]}-${p[1]}-${yy}`;
}

function mercaderista_file_ext(file) {
    const name = (file && file.name) || '';
    const dot = name.lastIndexOf('.');
    let ext = dot >= 0 ? name.slice(dot).toLowerCase() : '';
    if (!ext) ext = '.jpg';
    return ext;
}

function mercaderista_file_to_hex(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const bytes = new Uint8Array(reader.result);
            const hexParts = new Array(bytes.length);
            for (let i = 0; i < bytes.length; i++) {
                hexParts[i] = bytes[i].toString(16).padStart(2, '0');
            }
            resolve(hexParts.join(''));
        };
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(file);
    });
}

function mercaderista_subir_foto(file, filename) {
    return mercaderista_file_to_hex(file).then((hex) => axios.post('/storage/upload', {
        hex,
        filename,
        folder: MERCADERISTA_STORAGE_FOLDER,
        overwrite: true,
    })).then((resp) => {
        if (!resp.data || resp.data.ok !== true) throw new Error('upload');
        return filename;
    });
}

function mercaderista_guardar_visita(payload) {
    return axios.post('/clientes/mercaderista_visita_guardar', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        codemp: GlobalCodUsuario,
        ...payload,
    });
}

function mercaderista_iniciar_visita_api(payload) {
    return axios.post('/clientes/mercaderista_visita_iniciar', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        codemp: GlobalCodUsuario,
        ...payload,
    });
}

function mercaderista_finalizar_visita_api(payload) {
    return axios.post('/clientes/mercaderista_visita_finalizar', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        codemp: GlobalCodUsuario,
        ...payload,
    });
}

function mercaderista_sanitize_filename(filename) {
    return String(filename || '')
        .replace(/[/\\]/g, '_')
        .replace(/\s+/g, '_')
        .trim();
}

function mercaderista_remote_path(filename) {
    const name = mercaderista_sanitize_filename(filename);
    if (!name) return '';
    return `${MERCADERISTA_STORAGE_FOLDER}/${name}`;
}

function mercaderista_cargar_foto_pcloud(filename) {
    const rp = mercaderista_remote_path(filename);
    if (!rp) return Promise.resolve(null);
    return axios.post('/storage/file', { remote_path: rp, as_base64: true })
        .then((resp) => {
            if (!resp.data || resp.data.ok !== true || !resp.data.data_base64) return null;
            const mime = resp.data.mime_type || 'image/jpeg';
            return `data:${mime};base64,${resp.data.data_base64}`;
        })
        .catch(() => null);
}

function mercaderista_foto_bloque_html(label, dataUrl, filename) {
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

function mercaderista_celda_actividad_detalle(val, tipo, etiquetaBtn) {
    const si = Number(val) ? true : false;
    const btn = si
        ? `<button type="button" class="btn btn-outline-info btn-sm py-0 ml-2 merc-merc-btn-extra" data-tipo="${tipo}" title="${etiquetaBtn}">
                <i class="fal fa-eye mr-1"></i> Ver
           </button>`
        : '';
    return `
        <div class="d-flex align-items-center flex-wrap">
            ${mercaderista_fmt_si_no_html(si ? 1 : 0)}
            ${btn}
        </div>`;
}

function mercaderista_parse_faltantes_json(val) {
    const s = (val || '').trim();
    if (!s) return [];
    try {
        const arr = JSON.parse(s);
        return Array.isArray(arr) ? arr : [];
    } catch (e) {
        return [];
    }
}

function mercaderista_ver_fotos_actividad(tipo) {
    const r = mercaderista_detalle_actual;
    if (!r) return;
    const map = {
        ota: { titulo: 'Fotos OTA', antes: r.OTA_F_ANTES, despues: r.OTA_F_DESPUES },
        vitrinas: { titulo: 'Fotos Vitrinas', antes: r.VITRINAS_F_ANTES, despues: r.VITRINAS_F_DESPUES },
        pop: { titulo: 'Fotos POP', antes: r.POP_F_ANTES, despues: r.POP_F_DESPUES },
    };
    const c = map[tipo];
    if (!c) return;
    const lb = document.getElementById('lbMercaderistaFotosTitulo');
    const body = document.getElementById('bodyMercaderistaFotosActividad');
    if (lb) lb.innerText = c.titulo;
    if (body) body.innerHTML = `<div class="text-center py-4">${GlobalLoader}</div>`;
    $('#modalMercaderistaFotosActividad').modal('show');
    Promise.all([mercaderista_cargar_foto_pcloud(c.antes), mercaderista_cargar_foto_pcloud(c.despues)])
        .then(([urlAntes, urlDespues]) => {
            if (body) {
                body.innerHTML = `
                    <div class="row">
                        ${mercaderista_foto_bloque_html('Antes', urlAntes, c.antes)}
                        ${mercaderista_foto_bloque_html('Después', urlDespues, c.despues)}
                    </div>`;
            }
        });
}

function mercaderista_ver_faltantes_lista() {
    const r = mercaderista_detalle_actual;
    if (!r) return;
    const items = mercaderista_parse_faltantes_json(r.FALTANTES);
    const body = document.getElementById('bodyMercaderistaFaltantesLista');
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
    $('#modalMercaderistaFaltantesLista').modal('show');
}

function mercaderista_on_detalle_extra_click(e) {
    const btn = e.target.closest('.merc-merc-btn-extra');
    if (!btn) return;
    const tipo = btn.getAttribute('data-tipo');
    if (tipo === 'faltantes') mercaderista_ver_faltantes_lista();
    else if (tipo === 'ota' || tipo === 'vitrinas' || tipo === 'pop') mercaderista_ver_fotos_actividad(tipo);
}

function mercaderista_filtrar_clientes() {
    const q = (document.getElementById('txtMercaderistaBuscar')?.value || '').toLowerCase().trim();
    document.querySelectorAll('#tblDataMercaderistaClientes tr').forEach((tr) => {
        tr.style.display = !q || tr.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
    document.querySelectorAll('#tblMercaderistaClientesCards .merc-cliente-card').forEach((card) => {
        card.style.display = !q || card.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
}

function mercaderista_detener_barcode() {
    if (mercaderista_barcode_stream) {
        mercaderista_barcode_stream.getTracks().forEach((track) => track.stop());
        mercaderista_barcode_stream = null;
    }
    const root = document.getElementById('rootMercaderistaBarcode');
    if (root) root.innerHTML = '';
}

function mercaderista_abrir_camara_qr() {
    $('#modalMercaderistaBarcode').modal('show');
    mercaderista_iniciar_barcode();
}

async function mercaderista_iniciar_barcode() {
    const root = document.getElementById('rootMercaderistaBarcode');
    if (!root) return;

    mercaderista_detener_barcode();

    if (!('BarcodeDetector' in window)) {
        root.innerHTML = '<div class="text-danger py-3">No se puede usar el lector QR en este dispositivo</div>';
        return;
    }

    root.innerHTML = GlobalLoader;

    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
        });
        mercaderista_barcode_stream = mediaStream;

        const barcodeDetector = new BarcodeDetector({
            formats: ['code_39', 'codabar', 'ean_13', 'code_128', 'qr_code'],
        });

        const video = document.createElement('video');
        video.width = 400;
        video.height = 500;
        video.srcObject = mediaStream;
        video.autoplay = true;
        video.id = 'mercaderista_barcode_video';
        video.className = 'img-fluid rounded border shadow-sm';
        root.innerHTML = '';
        root.appendChild(video);

        let leido = false;
        const render = () => {
            if (leido) return;
            barcodeDetector.detect(video)
                .then((barcodes) => {
                    if (!barcodes.length || leido) return;
                    leido = true;
                    const cod = String(barcodes[0].rawValue || '').replace(/XELASOL-/gi, '').trim();
                    $('#modalMercaderistaBarcode').modal('hide');
                    mercaderista_detener_barcode();
                    mercaderista_procesar_qr_codigo(cod);
                })
                .catch(() => {});
        };

        const renderLoop = () => {
            if (!leido && mercaderista_barcode_stream) {
                requestAnimationFrame(renderLoop);
                render();
            }
        };
        renderLoop();
    } catch (e) {
        root.innerHTML = '<div class="text-danger py-3">No se pudo acceder a la cámara</div>';
    }
}

function mercaderista_procesar_qr_codigo(codStr) {
    const cod = Number(String(codStr || '').replace(/XELASOL-/gi, '').trim());
    if (!cod) {
        F.AvisoError('Código QR no válido');
        return;
    }

    F.showToast('Buscando cliente...');

    axios.post('/clientes/buscar_cliente_mercaderista_qr', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        filtro: cod,
    })
        .then((response) => {
            if (response.data === 'error' || !response.data?.recordset?.length) {
                throw new Error('no encontrado');
            }
            const r = response.data.recordset[0];
            mercaderista_qr_iniciar_visita(r.CODCLIENTE, r.NOMBRE);
        })
        .catch(() => {
            F.AvisoError('Cliente no encontrado');
        });
}

function mercaderista_qr_iniciar_visita(codclie, nombre) {
    const { fecha, mes, anio } = mercaderista_fecha_partes();
    const hora = mercaderista_hora_actual();
    const label = nombre || `Cliente ${codclie}`;

    axios.post('/clientes/mercaderista_visita_detalle', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        codemp: GlobalCodUsuario,
        codclie,
        fecha,
    })
        .then((det) => {
            const visita = det.data?.recordset?.[0];
            if (visita) {
                const fin = (visita.HORA_FIN || '').trim();
                if (fin) {
                    F.AvisoError(`La visita de ${label} ya fue finalizada hoy`);
                    return null;
                }
                return 'encurso';
            }
            return mercaderista_iniciar_visita_api({
                codclie,
                fecha,
                mes,
                anio,
                hora_inicio: hora,
            }).then((response) => {
                const rs = response.data?.recordset?.[0];
                if (response.data === 'error' || (rs && rs.RESULT === 'error')) return 'encurso';
                return 'iniciada';
            });
        })
        .then((result) => {
            if (!result) return;
            F.Aviso(result === 'iniciada' ? `Visita iniciada: ${label}` : `Cliente en curso: ${label}`);
            const cmbEstado = document.getElementById('cmbMercaderistaEstadoVisita');
            if (cmbEstado) cmbEstado.value = 'ENCURSO';
            const txtBuscar = document.getElementById('txtMercaderistaBuscar');
            if (txtBuscar) txtBuscar.value = String(codclie);
            mercaderista_cargar_clientes();
        })
        .catch(() => {
            F.AvisoError('No se pudo iniciar la visita');
        });
}

function mercaderista_cliente_celda_html(r) {
    return `
        <div class="negrita text-base">${r.NOMBRE || ''}</div>
        <small class="text-muted">Cód. ${r.CODCLIENTE || ''}</small>`;
}

function mercaderista_precio_card_html(r) {
    return `
        <div class="card merc-precio-card shadow-sm mb-2 border">
            <div class="card-body p-2">
                <div class="negrita text-base">${r.DESPROD || ''}</div>
                <small class="text-muted d-block mb-1">${r.CODPROD || ''}</small>
                <div class="d-flex justify-content-between align-items-center small">
                    <span>${r.CODMEDIDA || ''} · Eq. ${r.EQUIVALE != null ? r.EQUIVALE : ''}</span>
                    <span class="negrita text-success">${F.setMoneda(r.PRECIO, 'Q')}</span>
                </div>
            </div>
        </div>`;
}

function mercaderista_render_precios(rows) {
    const tbody = document.getElementById('tblDataMercaderistaPrecios');
    const cards = document.getElementById('tblMercaderistaPreciosCards');

    if (!rows.length) {
        const msg = '<tr><td colspan="4" class="text-center text-muted py-3">No hay precios para mostrar</td></tr>';
        const msgCard = '<div class="text-center text-muted py-3">No hay precios para mostrar</div>';
        if (tbody) tbody.innerHTML = msg;
        if (cards) cards.innerHTML = msgCard;
        return;
    }

    if (tbody) {
        tbody.innerHTML = rows.map((r) => `
            <tr>
                <td>
                    <div class="negrita text-base">${r.DESPROD || ''}</div>
                    <small class="text-muted">${r.CODPROD || ''}</small>
                </td>
                <td class="align-middle">${r.CODMEDIDA || ''}</td>
                <td class="text-center align-middle">${r.EQUIVALE != null ? r.EQUIVALE : ''}</td>
                <td class="text-right align-middle negrita">${F.setMoneda(r.PRECIO, 'Q')}</td>
            </tr>
        `).join('');
    }

    if (cards) {
        cards.innerHTML = rows.map((r) => mercaderista_precio_card_html(r)).join('');
    }
}

function mercaderista_filtrar_precios() {
    const q = (document.getElementById('txtMercaderistaBuscarPrecios')?.value || '').toLowerCase().trim();
    const filtrados = !q
        ? mercaderista_precios_cache
        : mercaderista_precios_cache.filter((r) => {
            const txt = `${r.CODPROD || ''} ${r.DESPROD || ''} ${r.CODMEDIDA || ''}`.toLowerCase();
            return txt.includes(q);
        });
    mercaderista_render_precios(filtrados);
}

function mercaderista_cargar_precios() {
    const tbody = document.getElementById('tblDataMercaderistaPrecios');
    const cards = document.getElementById('tblMercaderistaPreciosCards');
    if (tbody) tbody.innerHTML = `<tr><td colspan="4" class="text-center py-3">${GlobalLoader}</td></tr>`;
    if (cards) cards.innerHTML = GlobalLoader;
    mercaderista_precios_cache = [];

    axios.post('/clientes/mercaderista_lista_precios', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
    })
        .then((response) => {
            if (response.data === 'error') throw new Error('error');
            mercaderista_precios_cache = response.data.recordset || [];
            mercaderista_filtrar_precios();
        })
        .catch(() => {
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger py-3">No se pudieron cargar los precios</td></tr>';
            }
            if (cards) {
                cards.innerHTML = '<div class="text-center text-danger py-3">No se pudieron cargar los precios</div>';
            }
        });
}

function mercaderista_acciones(r) {
    const lat = r.LATITUD || '0';
    const lng = r.LONGITUD || '0';
    const cod = r.CODCLIENTE;
    const nombre = mercaderista_esc(r.NOMBRE || '');
    const estado = (document.getElementById('cmbMercaderistaEstadoVisita')?.value || 'PENDIENTE').toUpperCase();
    const mapaBtn = `
            <button type="button" class="btn btn-sm btn-secondary hand shadow w-100"
                title="Ubicación"
                onclick="mercaderista_abrir_ubicacion('${mercaderista_esc(lat)}','${mercaderista_esc(lng)}')">
                <i class="fal fa-map-marker-alt mr-1"></i> Mapa
            </button>`;

    if (estado === 'VISITADO') {
        return `
        <div class="merc-cliente-acciones merc-cliente-acciones--visitado w-100">
            <button type="button" class="btn btn-sm btn-info hand shadow w-100"
                title="Ver detalles"
                onclick="mercaderista_ver_detalle_visita(${cod},'${nombre}')">
                <i class="fal fa-eye mr-1"></i> Ver detalles
            </button>
            <button type="button" class="btn btn-sm btn-danger hand shadow w-100"
                id="btnMercEliminarVisita${cod}"
                title="Eliminar visita"
                onclick="mercaderista_eliminar_visita(${cod},'${nombre}', this)">
                <i class="fal fa-trash mr-1"></i> Eliminar visita
            </button>
        </div>`;
    }

    if (estado === 'ENCURSO') {
        return `
        <div class="merc-cliente-acciones w-100">
            <button type="button" class="btn btn-sm btn-info hand shadow w-100"
                title="Actividades"
                onclick="mercaderista_abrir_actividades(${cod},'${nombre}')">
                <i class="fal fa-tasks mr-1"></i> Actividades
            </button>
            <button type="button" class="btn btn-sm btn-primary hand shadow w-100"
                title="Faltantes"
                onclick="mercaderista_abrir_faltantes(${cod},'${nombre}')">
                <i class="fal fa-clipboard-list mr-1"></i> Faltantes
            </button>
            <button type="button" class="btn btn-sm btn-success hand shadow w-100"
                id="btnMercFinalizarVisita${cod}"
                title="Finalizar visita"
                onclick="mercaderista_finalizar_visita(${cod},'${nombre}', this)">
                <i class="fal fa-flag-checkered mr-1"></i> Finalizar visita
            </button>
        </div>`;
    }

    return `
        <div class="merc-cliente-acciones w-100">
            <button type="button" class="btn btn-sm btn-success hand shadow w-100"
                id="btnMercIniciarVisita${cod}"
                title="Iniciar visita"
                onclick="mercaderista_iniciar_visita(${cod},'${nombre}', this)">
                <i class="fal fa-play mr-1"></i> Iniciar visita
            </button>
            <button type="button" class="btn btn-sm btn-warning hand shadow w-100"
                title="No visitado"
                onclick="mercaderista_abrir_no_visitado(${cod},'${nombre}')">
                <i class="fal fa-times-circle mr-1"></i> No visitado
            </button>
            ${mapaBtn}
        </div>
    `;
}

function mercaderista_iniciar_visita(codclie, nombre, btnEl) {
    const label = nombre || `Cliente ${codclie}`;
    const btn = btnEl || document.getElementById(`btnMercIniciarVisita${codclie}`);
    const btnHtmlOriginal = btn ? btn.innerHTML : '';

    F.Confirmacion(`¿Desea INICIAR la visita de ${label}?`)
        .then((ok) => {
            if (!ok) return;

            const { fecha, mes, anio } = mercaderista_fecha_partes();
            const hora = mercaderista_hora_actual();

            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fal fa-spinner fa-spin mr-1"></i> Iniciando...';
            }

            mercaderista_iniciar_visita_api({ codclie, fecha, mes, anio, hora_inicio: hora })
                .then((response) => {
                    const rs = response.data?.recordset?.[0];
                    if (response.data === 'error' || (rs && rs.RESULT === 'error')) throw new Error('error');
                    F.Aviso('Visita iniciada correctamente');
                    const cmbEstado = document.getElementById('cmbMercaderistaEstadoVisita');
                    if (cmbEstado) cmbEstado.value = 'ENCURSO';
                    mercaderista_cargar_clientes();
                })
                .catch(() => {
                    F.AvisoError('No se pudo iniciar la visita');
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = btnHtmlOriginal || '<i class="fal fa-play mr-1"></i> Iniciar visita';
                    }
                });
        });
}

function mercaderista_finalizar_visita(codclie, nombre, btnEl) {
    const label = nombre || `Cliente ${codclie}`;
    const btn = btnEl || document.getElementById(`btnMercFinalizarVisita${codclie}`);
    const btnHtmlOriginal = btn ? btn.innerHTML : '';

    F.Confirmacion(`¿Desea FINALIZAR la visita de ${label}?`)
        .then((ok) => {
            if (!ok) return;

            const { fecha } = mercaderista_fecha_partes();
            const hora = mercaderista_hora_actual();

            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fal fa-spinner fa-spin mr-1"></i> Finalizando...';
            }

            mercaderista_finalizar_visita_api({ codclie, fecha, hora_fin: hora })
                .then((response) => {
                    if (response.data === 'error') throw new Error('error');
                    F.Aviso('Visita finalizada correctamente');
                    mercaderista_cargar_clientes();
                })
                .catch(() => {
                    F.AvisoError('No se pudo finalizar la visita');
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = btnHtmlOriginal || '<i class="fal fa-flag-checkered mr-1"></i> Finalizar visita';
                    }
                });
        });
}

function mercaderista_abrir_actividades(codclie, nombre) {
    mercaderista_cliente_sel = { codclie, nombre };
    mercaderista_limpiar_fotos_actividades();
    const lb = document.getElementById('lbMercActividadesCliente');
    if (lb) lb.innerText = nombre || `Cliente ${codclie}`;
    $('#modalMercaderistaActividades').modal('show');
}

function mercaderista_limpiar_campo_faltante(val) {
    return String(val == null ? '' : val)
        .replace(/[\u0000-\u001F\u007F-\u009F"\\']/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function mercaderista_render_faltantes(productos) {
    const tbody = document.getElementById('tblMercaderistaFaltantes');
    if (!tbody) return;

    if (!productos.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-4">No hay productos configurados</td></tr>';
        return;
    }

    tbody.innerHTML = productos.map((p, idx) => `
        <tr>
            <td class="text-center align-middle">
                <input type="checkbox" class="merc-faltante-chk" data-idx="${idx}">
            </td>
            <td class="align-middle">${p.CODPROD || ''}</td>
            <td class="align-middle">${p.DESPROD || ''}</td>
            <td class="align-middle">${p.DESMARCA || ''}</td>
        </tr>
    `).join('');
}

function mercaderista_cargar_productos_faltantes() {
    const tbody = document.getElementById('tblMercaderistaFaltantes');
    if (tbody) tbody.innerHTML = `<tr><td colspan="4" class="text-center py-3">${GlobalLoader}</td></tr>`;
    mercaderista_faltantes_productos = [];

    return axios.post('/clientes/mercaderista_productos_faltantes', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
    })
        .then((response) => {
            if (response.data === 'error') throw new Error('error');
            mercaderista_faltantes_productos = response.data.recordset || [];
            mercaderista_render_faltantes(mercaderista_faltantes_productos);
        })
        .catch(() => {
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger py-4">No se pudo cargar el catálogo de productos</td></tr>';
            }
        });
}

function mercaderista_abrir_faltantes(codclie, nombre) {
    mercaderista_cliente_sel = { codclie, nombre };
    const lb = document.getElementById('lbMercFaltantesCliente');
    if (lb) lb.innerText = nombre || `Cliente ${codclie}`;
    $('#modalMercaderistaFaltantes').modal('show');
    mercaderista_cargar_productos_faltantes();
}

function mercaderista_abrir_no_visitado(codclie, nombre) {
    mercaderista_cliente_sel = { codclie, nombre };
    const lb = document.getElementById('lbMercNoVisitadoCliente');
    if (lb) lb.innerText = nombre || `Cliente ${codclie}`;
    const cmb = document.getElementById('cmbMercaderistaMotivoNoVisita');
    if (cmb) cmb.selectedIndex = 0;
    $('#modalMercaderistaNoVisitado').modal('show');
}

function mercaderista_abrir_ubicacion(lat, lng) {
    const la = Number(lat);
    const lo = Number(lng);
    if (!la && !lo) {
        F.AvisoError('Este cliente no tiene ubicación GPS registrada.');
        return;
    }
    F.gotoGoogleMaps(la, lo);
}

function mercaderista_fmt_si_no(val) {
    return Number(val) ? 'SI' : 'NO';
}

function mercaderista_fmt_si_no_html(val) {
    const si = Number(val) ? true : false;
    const texto = si ? 'SI' : 'NO';
    const cls = si ? 'text-success negrita' : 'text-danger negrita';
    return `<span class="${cls}">${texto}</span>`;
}

function mercaderista_tiene_faltantes(val) {
    const s = (val || '').trim();
    if (!s) return false;
    try {
        const arr = JSON.parse(s);
        return Array.isArray(arr) && arr.length > 0;
    } catch (e) {
        return false;
    }
}

function mercaderista_fmt_fecha_detalle(fecha) {
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

function mercaderista_ver_detalle_visita(codclie, nombre) {
    const { fecha } = mercaderista_fecha_partes();
    const body = document.getElementById('bodyMercaderistaDetalleVisita');
    if (body) body.innerHTML = `<div class="text-center py-3">${GlobalLoader}</div>`;
    mercaderista_detalle_actual = null;
    $('#modalMercaderistaDetalleVisita').modal('show');

    axios.post('/clientes/mercaderista_visita_detalle', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        codemp: GlobalCodUsuario,
        codclie,
        fecha,
    })
        .then((response) => {
            if (response.data === 'error' || !response.data?.recordset?.length) {
                throw new Error('sin datos');
            }
            const r = response.data.recordset[0];
            mercaderista_detalle_actual = r;
            const nom = r.NOMBRE || nombre || `Cliente ${codclie}`;
            const motivo = (r.NOVISITADO || '').trim();
            const hayFaltantes = mercaderista_tiene_faltantes(r.FALTANTES);
            if (body) {
                body.innerHTML = `
                    <div class="mb-2">
                        <div class="negrita text-base">${nom}</div>
                        <div class="small text-muted">${r.NEGOCIO || ''} · Cod ${r.CODCLIENTE || codclie}</div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm table-bordered mb-0">
                            <tbody>
                                <tr><th class="bg-light" style="width:42%">Fecha</th><td>${mercaderista_fmt_fecha_detalle(r.FECHA)}</td></tr>
                                <tr><th class="bg-light">Mes / Año</th><td>${r.MES || '--'} / ${r.ANIO || '--'}</td></tr>
                                <tr><th class="bg-light">Hora inicio</th><td>${r.HORA_INICIO || '--'}</td></tr>
                                <tr><th class="bg-light">Hora fin</th><td>${r.HORA_FIN || '--'}</td></tr>
                                <tr><th class="bg-light">No visitado</th><td>${motivo || '—'}</td></tr>
                                <tr><th class="bg-light">OTA</th><td>${mercaderista_celda_actividad_detalle(r.OTA, 'ota', 'Ver fotos OTA')}</td></tr>
                                <tr><th class="bg-light">Vitrinas</th><td>${mercaderista_celda_actividad_detalle(r.VITRINAS, 'vitrinas', 'Ver fotos Vitrinas')}</td></tr>
                                <tr><th class="bg-light">POP</th><td>${mercaderista_celda_actividad_detalle(r.POP, 'pop', 'Ver fotos POP')}</td></tr>
                                <tr><th class="bg-light">Faltantes</th><td>${mercaderista_celda_actividad_detalle(hayFaltantes ? 1 : 0, 'faltantes', 'Ver faltantes')}</td></tr>
                            </tbody>
                        </table>
                    </div>
                `;
            }
        })
        .catch(() => {
            mercaderista_detalle_actual = null;
            if (body) {
                body.innerHTML = '<div class="text-center text-danger py-3">No se pudo cargar el detalle de la visita</div>';
            }
        });
}

function mercaderista_eliminar_visita(codclie, nombre, btnEl) {
    const { fecha } = mercaderista_fecha_partes();
    const label = nombre || `Cliente ${codclie}`;
    const btn = btnEl || document.getElementById(`btnMercEliminarVisita${codclie}`);
    const btnHtmlOriginal = btn ? btn.innerHTML : '';

    F.Confirmacion(`¿Está seguro que desea ELIMINAR la visita de ${label}? Se borrarán también las fotos asociadas.`)
        .then((ok) => {
            if (!ok) return;

            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fal fa-spinner fa-spin mr-1"></i> Eliminando...';
            }
            F.showToast('Eliminando visita y fotos...');

            axios.post('/clientes/mercaderista_visita_eliminar', {
                token: TOKEN,
                sucursal: GlobalEmpnit,
                codemp: GlobalCodUsuario,
                codclie,
                fecha,
            })
                .then((response) => {
                    if (!response.data || response.data.ok !== true) throw new Error('error');
                    F.Aviso('Visita eliminada correctamente');
                    mercaderista_cargar_clientes();
                })
                .catch(() => {
                    F.AvisoError('No se pudo eliminar la visita');
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = btnHtmlOriginal || '<i class="fal fa-trash mr-1"></i> Eliminar visita';
                    }
                });
        });
}

function mercaderista_registrar_no_visita() {
    if (!mercaderista_cliente_sel) return;
    const motivo = document.getElementById('cmbMercaderistaMotivoNoVisita')?.value || '';
    if (!motivo) {
        F.AvisoError('Seleccione un motivo');
        return;
    }

    const btn = document.getElementById('btnMercaderistaGuardarNoVisita');
    const { fecha, mes, anio } = mercaderista_fecha_partes();
    const hora = mercaderista_hora_actual();

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-spinner fa-spin"></i>';
    }

    mercaderista_guardar_visita({
        codclie: mercaderista_cliente_sel.codclie,
        fecha,
        mes,
        anio,
        hora_inicio: hora,
        hora_fin: hora,
        novisitado: motivo,
        ota: 0,
        vitrinas: 0,
        pop: 0,
    })
        .then((response) => {
            if (response.data === 'error') throw new Error('error');
            F.Aviso('No visitado registrado correctamente');
            $('#modalMercaderistaNoVisitado').modal('hide');
            mercaderista_cliente_sel = null;
            mercaderista_cargar_clientes();
        })
        .catch(() => {
            F.AvisoError('No se pudo registrar la visita');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fal fa-check mr-1"></i> Registrar';
            }
        });
}

function mercaderista_registrar_actividades() {
    if (!mercaderista_cliente_sel) return;

    // [key en mercaderista_act_fotos, grupo, momento]
    const fotosOpcionales = [
        ['ota_antes', 'ota', 'antes'],
        ['ota_despues', 'ota', 'despues'],
        ['vitrinas_antes', 'vitrinas', 'antes'],
        ['vitrinas_despues', 'vitrinas', 'despues'],
        ['pop_antes', 'pop', 'antes'],
        ['pop_despues', 'pop', 'despues'],
    ];

    const conFoto = fotosOpcionales.filter(([key]) => mercaderista_act_fotos[key]);
    if (!conFoto.length) {
        F.AvisoError('Debe agregar al menos una foto.');
        return;
    }

    const { fecha, mes, anio } = mercaderista_fecha_partes();
    const cod = mercaderista_cliente_sel.codclie;
    const ddmmyy = mercaderista_fecha_ddmmyy(fecha);

    F.Confirmacion('¿Está seguro que desea enviar la información?')
        .then((ok) => {
            if (!ok) return;

            const btn = document.getElementById('btnMercaderistaGuardarActividades');
            const cancelarBtn = document.getElementById('btnMercaderistaCancelarActividades');
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fal fa-spinner fa-spin mr-1"></i> Subiendo fotos...';
            }
            if (cancelarBtn) cancelarBtn.disabled = true;
            F.showToast('Subiendo las fotos, espere por favor...');

            const nombres = {};
            const subidas = conFoto.map(([key, grupo, momento]) => {
                const file = mercaderista_act_fotos[key];
                const ext = mercaderista_file_ext(file);
                const filename = `${cod} - ${ddmmyy} - ${grupo} - ${momento}${ext}`;
                return mercaderista_subir_foto(file, filename).then((nombre) => {
                    nombres[`${grupo}_${momento}`] = nombre;
                });
            });

            Promise.all(subidas)
                .then(() => mercaderista_guardar_visita({
                    codclie: cod,
                    fecha,
                    mes,
                    anio,
                    novisitado: '',
                    ota: mercaderista_actividad_tiene_foto('ota') ? 1 : 0,
                    vitrinas: mercaderista_actividad_tiene_foto('vitrinas') ? 1 : 0,
                    pop: mercaderista_actividad_tiene_foto('pop') ? 1 : 0,
                    ota_f_antes: nombres['ota_antes'] || '',
                    ota_f_despues: nombres['ota_despues'] || '',
                    vitrinas_f_antes: nombres['vitrinas_antes'] || '',
                    vitrinas_f_despues: nombres['vitrinas_despues'] || '',
                    pop_f_antes: nombres['pop_antes'] || '',
                    pop_f_despues: nombres['pop_despues'] || '',
                    actualizar_solo: true,
                    modo: 'actividades',
                }))
                .then((response) => {
                    if (response.data === 'error') throw new Error('error');
                    F.Aviso('Actividades registradas correctamente');
                    mercaderista_limpiar_fotos_actividades();
                    $('#modalMercaderistaActividades').modal('hide');
                    mercaderista_cliente_sel = null;
                })
                .catch(() => {
                    F.AvisoError('No se pudo subir las fotos o guardar la información');
                })
                .finally(() => {
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = '<i class="fal fa-save mr-1"></i> Guardar';
                    }
                    if (cancelarBtn) cancelarBtn.disabled = false;
                });
        });
}

function mercaderista_cancelar_actividades() {
    mercaderista_limpiar_fotos_actividades();
    $('#modalMercaderistaActividades').modal('hide');
}

function mercaderista_guardar_faltantes() {
    if (!mercaderista_cliente_sel) return;

    const seleccionados = [];
    document.querySelectorAll('#tblMercaderistaFaltantes .merc-faltante-chk:checked').forEach((chk) => {
        const idx = Number(chk.getAttribute('data-idx'));
        const prod = mercaderista_faltantes_productos[idx];
        if (!prod) return;
        seleccionados.push({
            CODPROD: mercaderista_limpiar_campo_faltante(prod.CODPROD),
            DESPROD: mercaderista_limpiar_campo_faltante(prod.DESPROD),
        });
    });

    if (!seleccionados.length) {
        F.AvisoError('Seleccione al menos un producto faltante');
        return;
    }

    const btn = document.getElementById('btnMercaderistaGuardarFaltantes');
    const { fecha, mes, anio } = mercaderista_fecha_partes();
    const faltantesJson = JSON.stringify(seleccionados);

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fal fa-spinner fa-spin mr-1"></i> Guardando...';
    }

    mercaderista_guardar_visita({
        codclie: mercaderista_cliente_sel.codclie,
        fecha,
        mes,
        anio,
        faltantes: faltantesJson,
        actualizar_solo: true,
        modo: 'faltantes',
    })
        .then((response) => {
            if (response.data === 'error') throw new Error('error');
            F.Aviso('Faltantes registrados correctamente');
            $('#modalMercaderistaFaltantes').modal('hide');
            mercaderista_cliente_sel = null;
        })
        .catch(() => {
            F.AvisoError('No se pudo registrar los faltantes');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fal fa-save mr-1"></i> Guardar';
            }
        });
}

function mercaderista_cargar_clientes() {
    const container = document.getElementById('tblDataMercaderistaClientes');
    const cards = document.getElementById('tblMercaderistaClientesCards');
    const dia = document.getElementById('cmbMercaderistaDia')?.value || '';
    const estado = document.getElementById('cmbMercaderistaEstadoVisita')?.value || 'PENDIENTE';
    const { fecha } = mercaderista_fecha_partes();
    const lbTotal = document.getElementById('lbMercaderistaTotalClientes');
    const lbDia = document.getElementById('lbMercaderistaDiaLabel');

    if (lbDia) lbDia.innerText = `${dia || '--'} · ${estado}`;

    if (container) container.innerHTML = `<tr><td colspan="6" class="text-center py-3">${GlobalLoader}</td></tr>`;
    if (cards) cards.innerHTML = GlobalLoader;

    axios.post('/clientes/buscar_cliente_mercaderista', {
        token: TOKEN,
        sucursal: GlobalEmpnit,
        codemp: GlobalCodUsuario,
        codruta: (typeof GlobalCodRutaMercaderista !== 'undefined' ? GlobalCodRutaMercaderista : 0),
        dia,
        fecha,
        estado,
    })
        .then((response) => {
            if (response.data === 'error') {
                if (container) container.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">Error al cargar</td></tr>';
                if (cards) cards.innerHTML = '<div class="text-center text-muted py-3">Error al cargar</div>';
                if (lbTotal) lbTotal.innerText = '0';
                return;
            }

            const rows = response.data.recordset || [];
            let str = '';
            let strCards = '';

            rows.forEach((r) => {
                const acciones = mercaderista_acciones(r);
                const horaInicio = (estado === 'ENCURSO' && r.HORA_INICIO)
                    ? `<div class="small text-info negrita mb-1"><i class="fal fa-clock mr-1"></i>Inicio ${r.HORA_INICIO}</div>`
                    : '';
                const clienteHtml = mercaderista_cliente_celda_html(r);
                const codCard = `<div class="small text-muted mb-1">Cód. ${r.CODCLIENTE || ''}</div>`;
                str += `
                <tr>
                    <td>${r.TIPONEGOCIO || ''}</td>
                    <td>${r.NEGOCIO || ''}</td>
                    <td>${clienteHtml}</td>
                    <td>${r.DIRECCION || ''}</td>
                    <td>${r.DESMUN || ''}</td>
                    <td class="text-center">${acciones}</td>
                </tr>`;

                strCards += `
                <div class="card merc-cliente-card shadow-sm mb-2 border">
                    <div class="card-body p-2">
                        <div class="negrita text-base">${r.NOMBRE || ''}</div>
                        ${codCard}
                        <div class="small text-muted">${r.TIPONEGOCIO || ''} · ${r.NEGOCIO || ''}</div>
                        <div class="small">${r.DIRECCION || ''}</div>
                        <div class="small text-muted mb-2">${r.DESMUN || ''}</div>
                        ${horaInicio}
                        ${acciones}
                    </div>
                </div>`;
            });

            if (container) {
                container.innerHTML = str || '<tr><td colspan="6" class="text-center text-muted py-3">No hay clientes para este día</td></tr>';
            }
            if (cards) {
                cards.innerHTML = strCards || '<div class="text-center text-muted py-3">No hay clientes para este día</div>';
            }
            if (lbTotal) lbTotal.innerText = String(rows.length);
            mercaderista_filtrar_clientes();
        })
        .catch(() => {
            if (container) container.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">No se cargaron datos</td></tr>';
            if (cards) cards.innerHTML = '<div class="text-center text-muted py-3">No se cargaron datos</div>';
            if (lbTotal) lbTotal.innerText = '0';
        });
}

function addListeners() {
    document.getElementById('btnMercaderistaMenuToggle')?.addEventListener('click', () => {
        mercaderista_toggleSidebar();
    });
    document.getElementById('mercaderistaSidebarBackdrop')?.addEventListener('click', () => {
        mercaderista_toggleSidebar(false);
    });
    document.getElementById('mercaderistaSidebar')?.addEventListener('click', (e) => {
        if (e.target.closest('.proveedor-menu-card')) mercaderista_closeSidebarMobile();
    });

    document.title = `Mercaderista - ${GlobalNomEmpresa || ''}`;
    const lbEmpresa = document.getElementById('lbMercaderistaEmpresa');
    if (lbEmpresa) lbEmpresa.innerText = GlobalNomEmpresa || '';

    const txtFecha = document.getElementById('txtMercaderistaFecha');
    if (txtFecha) {
        txtFecha.value = F.getFecha();
        txtFecha.addEventListener('change', () => mercaderista_cargar_clientes());
    }

    const cmbDia = document.getElementById('cmbMercaderistaDia');
    if (cmbDia) {
        cmbDia.value = F.getDiaSemana(new Date().getDay());
        cmbDia.addEventListener('change', () => mercaderista_cargar_clientes());
    }

    document.getElementById('cmbMercaderistaEstadoVisita')?.addEventListener('change', () => mercaderista_cargar_clientes());

    document.getElementById('btnMenuMercHome')?.addEventListener('click', () => mercaderista_showHome());
    document.getElementById('btnMenuMercPrecios')?.addEventListener('click', () => mercaderista_showPrecios());

    document.getElementById('btnMercaderistaGuardarNoVisita')?.addEventListener('click', mercaderista_registrar_no_visita);
    document.getElementById('btnMercaderistaGuardarActividades')?.addEventListener('click', mercaderista_registrar_actividades);
    document.getElementById('btnMercaderistaCancelarActividades')?.addEventListener('click', mercaderista_cancelar_actividades);
    document.getElementById('btnMercaderistaGuardarFaltantes')?.addEventListener('click', mercaderista_guardar_faltantes);
    document.getElementById('bodyMercaderistaDetalleVisita')?.addEventListener('click', mercaderista_on_detalle_extra_click);

    document.getElementById('btnMercaderistaCameraQR')?.addEventListener('click', mercaderista_abrir_camara_qr);
    $('#modalMercaderistaBarcode').on('hidden.bs.modal', mercaderista_detener_barcode);

    mercaderista_toggle_qr_btn(true);
    mercaderista_setActiveCard('btnMenuMercHome');
}

function initView() {
    document.getElementById('js-page-content')?.classList.add('proveedor-page');
    getView();
    addListeners();

    const cargarRuta = (typeof cargar_ruta_mercaderista_sesion === 'function')
        ? cargar_ruta_mercaderista_sesion()
        : Promise.resolve(0);

    cargarRuta.finally(() => mercaderista_cargar_clientes());
}

function destroyView() {
    mercaderista_toggleSidebar(false);
    document.body.classList.remove('proveedor-sidebar-open');
    document.getElementById('js-page-content')?.classList.remove('proveedor-page');
    mercaderista_detalle_actual = null;
    mercaderista_detener_barcode();
    $('#modalMercaderistaDetalleVisita').modal('hide');
    $('#modalMercaderistaFotosActividad').modal('hide');
    $('#modalMercaderistaFaltantesLista').modal('hide');
    $('#modalMercaderistaBarcode').modal('hide');
}

window._mercaderistaCore = { initView, destroyView, getView, addListeners };
