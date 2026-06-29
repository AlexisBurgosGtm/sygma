function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 sygma-archivo-docs">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado() + view.modal_detalle_documento() + view.modal_opciones_documento()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab"></div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab"></div>
                    </div>
                    <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active negrita text-success" id="tab-uno" data-toggle="tab" href="#uno" role="tab" aria-controls="profile" aria-selected="false">
                                <i class="fal fa-list"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-dos" data-toggle="tab" href="#dos" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-tres" data-toggle="tab" href="#tres" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>
                    </ul>
                    <div id="archivo_docs_print_host" class="sygma-archivo-docs-print-host" aria-hidden="true"></div>
                </div>
            `
        },
        vista_listado:()=>{
            return `
            <div class="card card-rounded shadow col-12 sygma-archivo-docs__card">
                <div class="card-body p-2 p-md-3">
                    <div class="row sygma-archivo-docs__filters">
                        <div class="col-md-6">
                            <div class="form-group mb-2">
                                <label class="sygma-archivo-docs__label negrita text-base mb-1">Tipo documento</label>
                                <div class="input-group input-group-sm">
                                    <select class="form-control form-control-sm" id="cmbTipos"></select>
                                    <div class="input-group-append">
                                        <button class="btn btn-success btn-sm hand" id="btnRecargar" type="button">
                                            <i class="fal fa-sync"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group mb-2">
                                <label class="sygma-archivo-docs__label negrita text-base mb-1">Mes y año</label>
                                <div class="input-group input-group-sm">
                                    <select class="form-control form-control-sm" id="cmbMes"></select>
                                    <select class="form-control form-control-sm" id="cmbAnio"></select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="sygma-archivo-docs__toolbar d-flex flex-wrap align-items-center justify-content-between mb-2">
                        <input type="search"
                            class="form-control form-control-sm sygma-archivo-docs__search"
                            placeholder="Buscar documento, cliente, NIT..."
                            oninput="F.FiltrarTabla('tblDocumentos','txtBuscarDoc')"
                            id="txtBuscarDoc">
                        <span class="sygma-archivo-docs__count negrita text-danger small" id="lbTotalItems">Conteo: 0</span>
                    </div>
                    <div class="table-responsive sygma-archivo-docs__table-wrap">
                        <table class="table table-sm table-hover mb-0 sygma-archivo-docs__table" id="tblDocumentos">
                            <thead class="bg-base text-white">
                                <tr>
                                    <th>FECHA</th>
                                    <th>DOCUMENTO</th>
                                    <th>NIT</th>
                                    <th>CLIENTE</th>
                                    <th class="text-right">IMPORTE</th>
                                    <th>FPAGO</th>
                                    <th>ST</th>
                                    <th class="text-center sygma-archivo-docs__th-actions" colspan="5">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody id="tblDataDocumentos"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            `
        },
        modal_detalle_documento:()=>{
            return `
            <div id="modal_tomar_datos_detalle" class="modal fade sygma-archivo-docs-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2">
                            <h5 class="modal-title text-white negrita mb-0">Detalle del documento</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-3">
                            <div class="sygma-archivo-docs__det-head mb-2">
                                <div class="negrita text-info" id="lbDetalleTomarDatosNombre"></div>
                            </div>
                            <div class="table-responsive sygma-archivo-docs__det-table-wrap">
                                <table class="table table-sm table-striped mb-2 sygma-archivo-docs__det-table">
                                    <thead class="bg-secondary text-white">
                                        <tr>
                                            <th>COD</th>
                                            <th>PRODUCTO</th>
                                            <th>MARCA</th>
                                            <th>MED</th>
                                            <th class="text-right">CANT</th>
                                            <th class="text-right">PRECIO</th>
                                            <th class="text-right">IMPORTE</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataTomarDatosDetalle"></tbody>
                                </table>
                            </div>
                            <div class="form-group mb-0">
                                <label class="sygma-archivo-docs__label negrita small mb-1">Observaciones</label>
                                <textarea class="form-control form-control-sm" id="lbDetaleTomarDatosObs" rows="3" readonly></textarea>
                            </div>
                        </div>
                        <div class="modal-footer py-2">
                            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
                                <i class="fal fa-times mr-1"></i> Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `
        },
        modal_opciones_documento:()=>{
            return `
            <div id="modal_opciones_documento" class="modal fade sygma-archivo-docs-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-md">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-base py-2">
                            <h5 class="modal-title text-white negrita mb-0">Opciones del documento</h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar"><span>&times;</span></button>
                        </div>
                        <div class="modal-body p-3 sygma-archivo-docs-opt">
                            <p class="text-center text-muted small mb-3" id="lbDocumento"></p>

                            <div class="sygma-archivo-docs-opt__section">
                                <div class="sygma-archivo-docs-opt__title">Cambiar empleado</div>
                                <div class="input-group input-group-sm">
                                    <select class="form-control form-control-sm" id="cmbEmpleado"></select>
                                    <div class="input-group-append">
                                        <button class="btn btn-info btn-sm hand" id="btnOpcionesCambiarEmpleado" type="button">
                                            <i class="fal fa-save"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="sygma-archivo-docs-opt__section">
                                <div class="sygma-archivo-docs-opt__title">Cambiar fecha</div>
                                <div class="input-group input-group-sm">
                                    <input type="date" class="form-control form-control-sm" id="txtFechaDocumentoUpdate">
                                    <div class="input-group-append">
                                        <button class="btn btn-info btn-sm hand" id="btnOpcionesCambiarFecha" type="button">
                                            <i class="fal fa-save"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="sygma-archivo-docs-opt__section" id="btnCargarCostosDocumento">
                                <div class="sygma-archivo-docs-opt__title">Costos del documento</div>
                                <button type="button" class="btn btn-outline-info btn-sm btn-block hand sygma-archivo-docs-opt__action">
                                    <i class="fal fa-cog mr-1"></i> Cargar costos
                                </button>
                            </div>
                        </div>
                        <div class="modal-footer py-2">
                            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
                                <i class="fal fa-times mr-1"></i> Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `
        }
    }

    root.innerHTML = view.body();

};

function addListeners(){


        document.title = "Documentos";

    
        document.getElementById('cmbMes').innerHTML = F.ComboMeses();
        document.getElementById('cmbAnio').innerHTML = F.ComboAnio();

        let f = new Date();
        document.getElementById('cmbMes').value = f.getMonth()+1;
        document.getElementById('cmbAnio').value = f.getFullYear();


        // CARGA COMBO TIPO DOCUMENTOS
        classTipodocumentos.get_data_tipos()
        .then((data)=>{
            let str = '';
            data.recordset.map((r)=>{
                str += `
                    <option value="${r.TIPODOC}">(${r.TIPODOC}) ${r.DESCRIPCION}</option>
                `
            })
            document.getElementById('cmbTipos').innerHTML = str;
            //carga la lista de documentos
            get_documentos();

        })
        .catch(()=>{
            document.getElementById('cmbTipos').innerHTML = '';
        });


        document.getElementById('cmbTipos').addEventListener('change',()=>{
            get_documentos();
        });

        document.getElementById('cmbMes').addEventListener('change',()=>{
            get_documentos();
        });

        document.getElementById('cmbAnio').addEventListener('change',()=>{
            get_documentos();
        });

        document.getElementById('btnRecargar').addEventListener('click',()=>{
            F.showToast('Recargando lista...')
            get_documentos();
        });


        //-----------------------------------
        //opciones documento
        //-----------------------------------

        GF.get_data_empleados_tipo_emp(400,GlobalEmpnit)
        .then((data)=>{
                    
                        let str = '';
                        data.recordset.map((r)=>{
                            str += `<option value="${r.CODEMPLEADO}"><small>(${r.PUESTO})</small> ${r.NOMEMPLEADO}</option>`
                        })
                        document.getElementById('cmbEmpleado').innerHTML = str;
                    
        })
        .catch(()=>{
            document.getElementById('cmbEmpleado').innerHTML = `<option value='0'>SIN EMPLEADO</option>`
        });

        let btnOpcionesCambiarEmpleado = document.getElementById('btnOpcionesCambiarEmpleado');
        btnOpcionesCambiarEmpleado.addEventListener('click',()=>{

            let codemp = document.getElementById('cmbEmpleado').value;
            if(codemp=='0'){F.AvisoError('Seleccione un Empleado valido!!');return};

            F.Confirmacion('Esta seguro que desea cambiar el EMPLEADO a este documento?')
            .then((value)=>{
                if(value==true){

                    btnOpcionesCambiarEmpleado.disabled = true;
                    btnOpcionesCambiarEmpleado.innerHTML = `<i class="fal fa-save fa-spin"></i>`;


                        GF.documento_update_empleado(GlobalEmpnit,codemp,selected_coddoc,selected_correlativo)
                        .then(()=>{
                            F.Aviso('Empleado actualizado en documento!!, recargue la lista');

                            btnOpcionesCambiarEmpleado.disabled = false;
                            btnOpcionesCambiarEmpleado.innerHTML = `<i class="fal fa-save"></i>`;
                        })
                        .catch(()=>{
                            F.AvisoError('No se pudo actualizar al empleado');

                            btnOpcionesCambiarEmpleado.disabled = false;
                            btnOpcionesCambiarEmpleado.innerHTML = `<i class="fal fa-save"></i>`;
                        })

                }
            });


        });

        let btnOpcionesCambiarFecha = document.getElementById('btnOpcionesCambiarFecha');
        btnOpcionesCambiarFecha.addEventListener('click',()=>{

            F.Confirmacion('Esta seguro que desea cambiar la fecha de este documento?')
            .then((value)=>{
                if(value==true){

                    let nuevafecha = F.devuelveFecha('txtFechaDocumentoUpdate');

                    btnOpcionesCambiarFecha.disabled = true;
                    btnOpcionesCambiarFecha.innerHTML = `<i class="fal fa-save fa-spin"></i>`;


                    GF.update_fecha_documento(GlobalEmpnit,selected_coddoc,selected_correlativo,nuevafecha)
                    .then(()=>{

                        F.Aviso('Fecha cambiada exitosamente!!')
                        btnOpcionesCambiarFecha.disabled = false;
                        btnOpcionesCambiarFecha.innerHTML = `<i class="fal fa-save"></i>`;

                    })
                    .catch(()=>{
                        F.AvisoError('No se pudo cambiar la fecha')
                        btnOpcionesCambiarFecha.disabled = false;
                        btnOpcionesCambiarFecha.innerHTML = `<i class="fal fa-save"></i>`;
                    })


                }
            })

            

                     

        })

        let btnCargarCostosDocumento = document.getElementById('btnCargarCostosDocumento');
        btnCargarCostosDocumento?.addEventListener('click',()=>{

            F.Confirmacion('¿Está seguro que desea cargar los costos de este documento?')
            .then((value)=>{
                if(value==true){

                    F.showToast('Actualizando...');
                    btnCargarCostosDocumento.classList.add('sygma-archivo-docs-opt__section--busy');

                    GF.update_costos_documento(selected_coddoc,selected_correlativo)
                    .then(()=>{

                        btnCargarCostosDocumento.classList.remove('sygma-archivo-docs-opt__section--busy');
                        
                        F.Aviso('Costos actualizados exitosamente!!');


                    }) 
                    .catch(()=>{
                        F.AvisoError('No se pudo actualizar');
                        btnCargarCostosDocumento.classList.remove('sygma-archivo-docs-opt__section--busy');
                    })

                }
            })

        })

        //-----------------------------------
        //opciones documento
        //-----------------------------------




};

function initView(){

    getView();
    addListeners();

};



function get_documentos(){

    let tipo = document.getElementById('cmbTipos').value;
    let anio = document.getElementById('cmbAnio').value;
    let mes = document.getElementById('cmbMes').value;

    let container = document.getElementById('tblDataDocumentos')
    container.innerHTML = GlobalLoader;

    GlobalEntSal = get_tipo_movinv_documento(tipo);

    let varTotalItems = 0;

    GF.get_data_documentos(tipo,mes,anio)
    .then((data)=>{
        let str = '';
        (data.recordset || []).forEach((r)=>{
            varTotalItems+=1;
            const btnEliminar = `btnEliminar${r.CODDOC}-${r.CORRELATIVO}`;
            const btnPrint = `btnPrint${r.CODDOC}-${r.CORRELATIVO}`;
            const fpago = doc_archivo_label_concre(r.CONCRE);
            str += `
                <tr class="sygma-archivo-docs__row">
                    <td class="sygma-archivo-docs__cell-date">
                        <span class="sygma-archivo-docs__cell-main">${F.convertDateNormal(r.FECHA)}</span>
                        <span class="sygma-archivo-docs__cell-sub">Ed: ${F.convertDateNormal(r.LASTUPDATE)}</span>
                    </td>
                    <td class="negrita text-info">${r.CODDOC}-${r.CORRELATIVO}</td>
                    <td>${r.NIT || ''}</td>
                    <td class="sygma-archivo-docs__cell-client">
                        <span class="sygma-archivo-docs__cell-main">${r.NOMBRE || ''}</span>
                        <span class="sygma-archivo-docs__cell-sub">${r.EMPLEADO || ''}</span>
                    </td>
                    <td class="text-right negrita">${F.setMoneda(r.TOTALVENTA,'Q')}</td>
                    <td>${fpago}</td>
                    <td>${r.STATUS}</td>
                    <td class="text-center sygma-archivo-docs__actions">
                        <button type="button" class="btn btn-xs btn-circle hand shadow btn-base sygma-archivo-docs__btn"
                            title="Opciones" onclick="get_opciones('${r.CODDOC}','${r.CORRELATIVO}','${r.CODEMP}','${r.FECHA}')">
                            <i class="fal fa-cog"></i>
                        </button>
                    </td>
                    <td class="text-center sygma-archivo-docs__actions">
                        <button type="button" class="btn btn-xs btn-circle hand shadow btn-primary sygma-archivo-docs__btn" id="${btnPrint}"
                            title="Imprimir" onclick="doc_archivo_imprimir('${r.CODDOC}','${r.CORRELATIVO}','${btnPrint}')">
                            <i class="fal fa-print"></i>
                        </button>
                    </td>
                    <td class="text-center sygma-archivo-docs__actions">
                        <button type="button" class="btn btn-xs btn-circle hand shadow btn-warning sygma-archivo-docs__btn"
                            title="Detalle" onclick="get_detalle_tomar_datos('${r.CODDOC}','${r.CORRELATIVO}','${r.NOMBRE}','${r.ETIQUETA}','${r.OBS}')">
                            <i class="fal fa-list"></i>
                        </button>
                    </td>
                    <td class="text-center sygma-archivo-docs__actions">
                        <button type="button" class="btn btn-xs btn-circle hand shadow btn-info sygma-archivo-docs__btn"
                            title="Editar" onclick="fcn_editar_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.NOMBRE}','${r.DIRECCION}')">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td class="text-center sygma-archivo-docs__actions">
                        <button type="button" class="btn btn-xs btn-circle hand shadow btn-danger sygma-archivo-docs__btn" id="${btnEliminar}"
                            title="Eliminar" onclick="fcn_eliminar_factura('${r.CODDOC}','${r.CORRELATIVO}','${btnEliminar}')">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        container.innerHTML = str || '<tr><td colspan="12" class="text-center text-muted py-3">No hay documentos en el período seleccionado.</td></tr>';
        document.getElementById('lbTotalItems').innerText = `Conteo: ${varTotalItems}`;
    })
    .catch(()=>{
        container.innerHTML = '<tr><td colspan="12" class="text-center text-muted py-3">No se cargaron datos...</td></tr>';
        document.getElementById('lbTotalItems').innerText = 'Conteo: 0';
    })
};



function get_detalle_tomar_datos(coddoc,correlativo,nombre,prioridad,obs){

    $("#modal_tomar_datos_detalle").modal('show');

    document.getElementById('lbDetalleTomarDatosNombre').textContent = nombre;
    document.getElementById('lbDetaleTomarDatosObs').value = obs;

    let container = document.getElementById('tblDataTomarDatosDetalle');
    container.innerHTML = GlobalLoader;


    GF.get_data_detalle_documento(GlobalEmpnit,coddoc,correlativo)
    .then((data)=>{
        let str = "";

        data.recordset.map((r)=>{
            str += `
            <tr>
                <td>${r.CODPROD}</td>
                <td>${r.DESPROD}</td>
                <td>${r.DESMARCA}</td>
                <td>${r.CODMEDIDA}</td>
                <td>${r.CANTIDAD}</td>
                <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
            </tr>
            `
        })
        container.innerHTML = str;

    })
    .catch(()=>{
        container.innerHTML = 'No hay datos...'

    })






};


function fcn_eliminar_factura(coddoc,correlativo,idbtn){

    ClaveEmpresa()
    .then(() => F.Confirmacion(`¿Está seguro que desea ELIMINAR el documento ${coddoc}-${correlativo}?`))
    .then((value)=>{
        if(value!==true) return;

        let btn = document.getElementById(idbtn);
        btn.disabled = true;
        btn.innerHTML = `<i class="fal fa-trash fa-spin"></i>`;

        GF.get_data_eliminar_documento(GlobalEmpnit,coddoc,correlativo)
        .then(()=>{
            btn.disabled = false;
            btn.innerHTML = `<i class="fal fa-trash"></i>`;
            F.Aviso('Documento eliminado exitosamente!!');
            get_documentos();
        })
        .catch(()=>{
            btn.disabled = false;
            btn.innerHTML = `<i class="fal fa-trash"></i>`;
            F.AvisoError('No se pudo Eliminar este documento');
        });
    })
    .catch(() => {});
};


function get_opciones(coddoc,correlativo,codemp,fecha){


    $("#modal_opciones_documento").modal('show');


    selected_coddoc = coddoc;
    selected_correlativo = Number(correlativo);

    document.getElementById('lbDocumento').innerText = `${coddoc}-${correlativo}`;

    let tipo = document.getElementById('cmbTipos').value;

    switch (tipo) {
        case 'COM':
            document.getElementById('btnCargarCostosDocumento').style.display = '';
            break;
        case 'COP':
            document.getElementById('btnCargarCostosDocumento').style.display = '';
            break;
        default:
            document.getElementById('btnCargarCostosDocumento').style.display = 'none';
            break;
    }


    
    document.getElementById('txtFechaDocumentoUpdate').value = fecha.replace('T00:00:00.000Z','');
    document.getElementById('cmbEmpleado').value = codemp;
};

function doc_archivo_label_concre(concre) {
    if (concre === 'CRE') return 'CRÉDITO';
    if (concre === 'CON') return 'CONTADO';
    return concre || '—';
}

function doc_archivo_build_print_html(enc, lineas, tipoLabel) {
    const nomEmpresa = (typeof GlobalNomEmpresa !== 'undefined' && GlobalNomEmpresa) ? GlobalNomEmpresa : 'SYGMA';
    const titulo = tipoLabel || enc.DESCTIPODOC || enc.TIPODOC || 'DOCUMENTO';
    const nomclie = (enc.NOMCLIE || '').trim();
    const direccion = F.limpiarTexto(enc.DIRCLIE || '');
    const obs = (enc.OBS || '').trim();
    let total = Number(enc.TOTALVENTA || enc.TOTALPRECIO || 0);
    let lineCount = 0;
    let rowsHtml = '';

    (lineas || []).forEach((l) => {
        lineCount += 1;
        const importe = Number(l.TOTALPRECIO || 0);
        if (!total && importe) total += importe;
        rowsHtml += `<tr>
            <td>${l.CODPROD || ''}</td>
            <td>${l.DESPROD || ''}</td>
            <td>${l.DESMARCA || ''}</td>
            <td class="text-center">${l.CODMEDIDA || ''}</td>
            <td class="text-right">${l.CANTIDAD || 0}</td>
            <td class="text-right">${F.setMoneda(l.PRECIO, 'Q')}</td>
            <td class="text-right">${F.setMoneda(importe, 'Q')}</td>
        </tr>`;
    });

    if (!rowsHtml) {
        rowsHtml = `<tr><td colspan="7" class="text-center text-muted">Sin líneas de detalle</td></tr>`;
    }

    const venc = enc.VENCIMIENTO ? F.convertDateNormal(enc.VENCIMIENTO) : '—';

    return `
        <div class="sygma-archivo-doc-print">
            <header class="sygma-archivo-doc-print__header">
                <div class="sygma-archivo-doc-print__brand">
                    <img class="sygma-archivo-doc-print__logo" src="./favicon.png" width="48" height="48" alt="Logo">
                    <div>
                        <h4 class="sygma-archivo-doc-print__title mb-0">${titulo}</h4>
                        <div class="sygma-archivo-doc-print__empresa">${nomEmpresa}</div>
                    </div>
                </div>
                <div class="sygma-archivo-doc-print__doc">${enc.CODDOC}-${enc.CORRELATIVO}</div>
            </header>
            <div class="sygma-archivo-doc-print__meta">
                <div><strong>Fecha documento:</strong> ${F.convertDateNormal(enc.FECHA)}</div>
                <div><strong>Fecha vencimiento:</strong> ${venc}</div>
                <div><strong>Forma de pago:</strong> ${doc_archivo_label_concre(enc.CONCRE)}</div>
                <div><strong>Nombre:</strong> ${nomclie || '—'}</div>
                <div><strong>Dirección:</strong> ${direccion || '—'}</div>
            </div>
            <table class="sygma-archivo-doc-print__table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Marca</th>
                        <th>Med.</th>
                        <th class="text-right">Cant.</th>
                        <th class="text-right">Precio</th>
                        <th class="text-right">Importe</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
            <div class="sygma-archivo-doc-print__total">
                <span>Líneas: ${lineCount}</span>
                <span class="sygma-archivo-doc-print__total-amount">TOTAL: ${F.setMoneda(total, 'Q')}</span>
            </div>
            ${obs ? `<div class="sygma-archivo-doc-print__obs"><strong>Observaciones:</strong> ${obs}</div>` : ''}
        </div>`;
}

function doc_archivo_ejecutar_impresion() {
    document.body.classList.add('sygma-print-archivo-docs-active');
    window.print();
    setTimeout(() => {
        document.body.classList.remove('sygma-print-archivo-docs-active');
        const host = document.getElementById('archivo_docs_print_host');
        if (host) host.innerHTML = '';
    }, 600);
}

function doc_archivo_imprimir(coddoc, correlativo, idbtn) {
    const btn = idbtn ? document.getElementById(idbtn) : null;
    const host = document.getElementById('archivo_docs_print_host');
    if (!host) return;

    const tipoLabel = document.getElementById('cmbTipos')?.selectedOptions?.[0]?.textContent?.trim() || 'DOCUMENTO';

    if (btn) {
        btn.innerHTML = '<i class="fal fa-print fa-spin"></i>';
        btn.disabled = true;
    }

    F.showToast('Generando imprimible...');

    Promise.all([
        GF.get_data_encabezado_documento(GlobalEmpnit, coddoc, correlativo),
        GF.get_data_detalle_documento(GlobalEmpnit, coddoc, correlativo)
            .then((data) => data.recordset || [])
            .catch(() => [])
    ])
        .then(([enc, lineas]) => {
            host.innerHTML = doc_archivo_build_print_html(enc, lineas, tipoLabel);
            doc_archivo_ejecutar_impresion();
        })
        .catch(() => {
            F.AvisoError('No se pudo generar el imprimible');
            host.innerHTML = '';
        })
        .finally(() => {
            if (btn) {
                btn.innerHTML = '<i class="fal fa-print"></i>';
                btn.disabled = false;
            }
        });
}

window.doc_archivo_imprimir = doc_archivo_imprimir;
