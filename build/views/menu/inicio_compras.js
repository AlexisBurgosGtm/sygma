function getView(){
    let view = {
        body:()=>{
            return `
               <div id="compras_main_content">
               <div class="row">                
                    ${view.menu_superior()}            
                </div>
                <br>

                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active fixed" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_embarques() }
                            
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           ${view.productos_relleno() + view.modal_existencia_sucursales()}
                            
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                           
                        </div>  
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            
                        </div>  
                        <div class="tab-pane fade" id="cinco" role="tabpanel" aria-labelledby="home-tab">
                            
                        </div>    
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
                         <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-cuatro" data-toggle="tab" href="#cuatro" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>  
                         <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-cinco" data-toggle="tab" href="#cinco" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>           
                    </ul>
                </div>
               </div>

                <div id="sygma_embarque_print_host" class="sygma-embarque-print-host" aria-hidden="true"></div>
            `
        },
        vista_embarques:()=>{
            return `
            <div class="sygma-embarque-rpt card card-rounded shadow-sm col-12 border-0" id="rpt_embarques_picking">
                <div class="card-body sygma-embarque-rpt__body p-2">
                    <header class="sygma-embarque-rpt__header">
                        <div class="sygma-embarque-rpt__brand">
                            <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="40" height="40" alt="Logo">
                            <div class="sygma-embarque-rpt__brand-text">
                                <h4 class="sygma-embarque-rpt__title mb-0">Embarques</h4>
                                <span class="sygma-embarque-rpt__embarque-date">Gestión de picking</span>
                            </div>
                        </div>
                        <div class="sygma-embarque-rpt__detail oculto-impresion">
                            <span class="sygma-embarque-rpt__stat sygma-embarque-rpt__stat--items" id="lbEmbGridTotal"></span>
                            <span class="d-none" id="lbTotalEmb"></span>
                        </div>
                    </header>

                    <div class="sygma-embarque-rpt__toolbar sygma-embarques-filtros oculto-impresion">
                        <div class="sygma-embarques-filtros__row">
                            <input type="text" class="form-control sygma-embarque-rpt__search sygma-embarques-filtros__search" id="txtBuscarEmbarques"
                                placeholder="Buscar embarque, repartidor o descripción..."
                                oninput="F.FiltrarTabla('tblEmbarques','txtBuscarEmbarques')">
                           
                            <div class="sygma-embarques-filtros__field">
                                <label class="sygma-embarques-filtros__label" for="cmbStatus">Estado</label>
                                <select class="form-control sygma-embarques-filtros__select" id="cmbStatus">
                                    <option value="NO">Pendientes</option>
                                    <option value="SI">Finalizados</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive sygma-embarque-rpt__table-wrap">
                        <table class="table sygma-embarque-rpt__table mb-0" id="tblEmbarques">
                            <thead>
                                <tr>
                                    <th>FECHA</th>
                                    <th>EMBARQUE</th>
                                    <th>REPARTIDOR</th>
                                    <th class="text-right">IMPORTE</th>
                                    <th class="text-right">DEVOL.</th>
                                    <th class="sygma-embarque-rpt__col-action oculto-impresion text-center" title="Imprimir"></th>
                                </tr>
                            </thead>
                            <tbody id="tblDatalEmbarques"></tbody>
                        </table>
                    </div>
                    <div class="sygma-embarque-rpt__total-block" id="lbEmbGridTotalBlock"></div>
                </div>
            </div>

            <button type="button" class="btn btn-success btn-lg btn-circle hand shadow sygma-embarques-fab sygma-fab-nuevo oculto-impresion" id="btnEmbarquesNuevo" title="Nuevo embarque">
                <i class="fal fa-plus"></i>
            </button>
            `
        },
        menu_superior:()=>{
            return `
            <div class="card card-rounded col-12 border-base text-base">
                <div class="card-body">
                    <div class="row">
                        <div class="col-3">
                            <img src="./favicon.png" width="50" height="50">
                        </div>
                        <div class="col-9">
                            <h5 class="negrita">Inicio Bodega</h5>

                            <div class="sygma-embarques-filtros__row">
                                <div class="sygma-embarques-filtros__field">
                                    <label class="sygma-embarques-filtros__label" for="cmbSucursal">Sucursal</label>
                                    <select class="form-control sygma-embarques-filtros__select" id="cmbSucursal">
                                    </select>
                                </div>
                                <div class="sygma-embarques-filtros__field">
                                    <label class="sygma-embarques-filtros__label" for="cmbMes">Mes</label>
                                    <select class="form-control sygma-embarques-filtros__select" id="cmbMes"></select>
                                </div>
                                <div class="sygma-embarques-filtros__field">
                                    <label class="sygma-embarques-filtros__label" for="cmbAnio">Año</label>
                                    <select class="form-control sygma-embarques-filtros__select" id="cmbAnio"></select>
                                </div>

                            </div>

                        </div>
                    </div>
                    
                </div>
            </div>
            `;
        },
        panel_inicio:()=>{
            return `
            <div class="row p-4">
                <div class="col-4">

                    <div class="hand shadow p-3 bg-danger-300 rounded overflow-hidden position-relative text-white mb-g" onclick="document.getElementById('tab-dos').click()">
                        <div class="">
                            <h3 class="display-4 d-block l-h-n m-0 fw-500" id="lbTotalRelleno">
                                0
                                <small class="m-0 l-h-n">Productos en mínimo</small>
                            </h3>
                        </div>
                        <i class="fal fa-box position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" style="font-size:6rem"></i>
                    </div>

                </div>

                <div class="col-4">

                    <div class="hand shadow p-3 bg-info-300 rounded overflow-hidden position-relative text-white mb-g" onclick="document.getElementById('tab-tres').click()">
                        <div class="">
                            <h3 class="display-4 d-block l-h-n m-0 fw-500" id="lbTotalDocumentosPendientes">
                                0
                                <small class="m-0 l-h-n">Documentos pendientes</small>
                            </h3>
                        </div>
                        <i class="fal fa-list position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" style="font-size:6rem"></i>
                    </div>
                  
                </div>

                <div class="col-4">

                    
                    
                </div>
            </div>



             <div class="row hidden">
                <div class="col-4">

                    <div class="card border-base card-rounded shadow col-12">
                        <div class="card-body p-4">
                        </div>
                    </div>

                </div>

                <div class="col-4">

                    <div class="card border-base card-rounded shadow col-12">
                        <div class="card-body p-4">
                        </div>
                    </div>

                </div>

                <div class="col-4">

                    <div class="card border-base card-rounded shadow col-12">
                        <div class="card-body p-4">
                        </div>
                    </div>
                    
                </div>
            </div>
            `
        },
        productos_relleno:()=>{
            return `                   
                    <div class="card border-base card-rounded shadow col-12">
                        <div class="card-body p-2">
                               <h3 class="negrita text-base">Surtido pendiente por Sucursal</h3>
                               <div class="text-right">
                                    <h4 class="negrita text-danger" id="lbTotalPendientes"></h4>
                               </div>
                               <div class="form-group">
                                    <label class="negrita text-secondary">Seleccione la Sucursal a consultar</label>
                                    <div class="input-group">
                                     
                                        <select class="form-control negrita text-base border-base" id="cmbTipoRentabilidad">
                                        </select>
                                    </div>
                               </div>
                               
                               <div class="table-responsive">
                                    
                                    <div class="form-group">
                                        <label class="negrita text-base">Escriba para filtrar</label>
                                        <input type="text" id="txtBuscarSurtido" class="form-control negrita text-verde" oninput="F.FiltrarTabla('tblSurtido','txtBuscarSurtido')">
                                    </div>

                                    <table class="table h-full table-hove table-bordered h-full" id="tblSurtido">
                                        <thead class="bg-base text-white">
                                            <tr>
                                                <td>PRODUCTO</td>
                                                <td>MARCA</td>
                                                <td>MIN</td>
                                                <td>MAX</td>
                                                <td>EXISTENCIA</td>
                                                <td>RELLENO</td>
                                                <td>ULTIMO</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tblDataSurtido"></tbody>
                                    </table>
                               </div>
                                        
                        </div>
                    </div>
                

             


                    <button class="btn btn-secondary btn-circle btn-circle btn-bottom-l btn-xl hand shadow" onclick="document.getElementById('tab-uno').click()">
                        <i class="fal fa-arrow-left"></i>
                    </button>
            `;
        },
        modal_existencia_sucursales:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" id="modal_existencia_sucursales">
                <div class="modal-dialog modal-dialog-center modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-base d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Existencias en todas las sucursales
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="row">
                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    
                                    <div class="card card-rounded">
                                        <div class="card-body p-4">

                                            <h3 class="negrita text-verde" id="lbDesprodSucursales"></h3>
                                            <h5 class="negrita text-secondary" id="lbDesmarcaSucursales"></h5>
                                        
                                            <table class="table table-responsive h-full f-med" id="">
                                                <thead class="negrita bg-base text-white">
                                                    <tr>
                                                        <td>SUCURSAL</td>
                                                        <td>MINIMO</td>
                                                        <td>MAXIMO</td>
                                                        <td>EXISTENCIA</td>
                                                        <td>RELLENO</td>
                                                    </tr>
                                                </thead>
                                                <tbody id="tblDataSucursales">
                                                            
                                                </tbody>
                                                <tfoot id="tblFooterSucursales" class="border-base text-base negrita">
                                                
                                                </tfoot>
                                            </table>


                                        </div>
                                    </div>

                                </div>

                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    
                                    <div class="card card-rounded">
                                        <div class="card-body p-4">

                                            <h5 class="negrita text-ver">Documentos pendientes del producto</h5>
                                        
                                            <table class="table table-responsive h-full f-med" id="">
                                                <thead class="negrita bg-verde text-white">
                                                    <tr>
                                                        <td>FECHA</td>
                                                        <td>DOCUMENTO</td>
                                                        <td>CANTIDAD SOLICITADA</td>
                                                    </tr>
                                                </thead>
                                                <tbody id="tblDataDocumentosProducto">
                                                            
                                                </tbody>
                                               
                                            </table>

                                        </div>
                                    </div>

                                </div>
                            </div>

                     
                           
                                
                            <div class="row">
                                <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                    <i class="fal fa-arrow-left"></i>
                                </button>
                            </div>

                        </div>
                       
                    </div>
                </div>
            </div>

            
            `
        },
    }

    root.innerHTML = view.body();

};


var embarque_print_codembarque = '';
var embarque_print_fecha = '';


function addListeners(){

    
    document.title = "Inicio Compras";

    F.slideAnimationTabs();

    let cmbTipoDoc = document.getElementById('cmbTipoDoc');
    
    let cmdSucursal = document.getElementById('cmbSucursal');

   
    let cmbMesHeader = document.getElementById('cmbMes');
    let cmbAnioHeader = document.getElementById('cmbAnio');
   

    if (cmbMesHeader) {
        cmbMesHeader.innerHTML = F.ComboMeses();
        cmbMesHeader.value = F.get_mes_curso();
    }
    if (cmbAnioHeader) {
        cmbAnioHeader.innerHTML = F.ComboAnio();
        cmbAnioHeader.value = F.get_anio_curso();
    }


    GF.get_data_empresas()
    .then((data)=>{
        let str = '';//'<option value="TODAS">TODAS LAS SUCURSALES</option>';
        data.recordset.map((r)=>{
            str += `
                <option value="${r.EMPNIT}">${r.NOMBRE}</option>
            `
        })
        cmdSucursal.innerHTML = str;
        cmbSucursal.value = GlobalEmpnit;
        get_tbl_surtido(cmbSucursal.value); 
       
        cargar_grid_embarques();
    })
    .catch(()=>{
        cmdSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
    })
    


    cmdSucursal.addEventListener('change',()=>{
        get_tbl_surtido(cmbSucursal.value);
        cargar_grid_embarques();  
    })

 

    get_total_rellenos()
    .then((data)=>{
       document.getElementById('lbTotalRelleno').innerHTML = `${F.setMoneda(data.recordset[0].CONTEO,'').replace('.00','')}<small class="m-0 l-h-n">Productos en mínimo</small>` 
    })
    .catch(()=>{
        document.getElementById('lbTotalRelleno').innerText = '----'
    })

    GF.get_clasificaciones_listado('BI')
    .then((data)=>{

        let str = "<option value='0'>TODAS</option>";
        
        data.recordset.map((r)=>{
            str += `<option value='${r.CODIGO}'>${r.DESCRIPCION}</option>`
        })
        document.getElementById('cmbTipoRentabilidad').innerHTML = str;
    })
    .catch(()=>{
        document.getElementById('cmbTipoRentabilidad').innerHTML = '';
    })
 



    document.getElementById('cmbMes').addEventListener('change',()=>{
        cargar_grid_embarques();
    });

    document.getElementById('cmbAnio').addEventListener('change',()=>{
        cargar_grid_embarques();
    });

    document.getElementById('cmbStatus').addEventListener('change',()=>{
        cargar_grid_embarques();
    });


 
};

function initView(){

    getView();
    addListeners();

};





function cargar_grid_embarques(){

    let statusEmbarque = document.getElementById('cmbStatus').value;
    let mes =document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;

    tbl_embarques('tblDatalEmbarques',statusEmbarque,mes,anio);

};


function tbl_embarques(idContainer,status,mes,anio){

    let container = document.getElementById(idContainer);
    if (!container) return;
    container.innerHTML = GlobalLoader;

    let str = '';
    let conteo = 0;
    let totalImporte = 0;
    let totalDevol = 0;
    
    GF.get_data_embarques_listado(GlobalEmpnit,status,mes,anio)
    .then((data)=>{
        

        data.recordset.map((r)=>{
            conteo +=1;
            totalImporte += Number(r.IMPORTE) || 0;
            totalDevol += Number(r.DEVOLUCIONES) || 0;
            let idbtnE = `btnE${r.CODEMBARQUE}`;
            let idbtnF = `btnF${r.CODEMBARQUE}`;
            const btnFinalizarClass = status === 'NO' ? 'btn-success' : 'btn-warning';
            const btnFinalizarTitle = status === 'NO' ? 'Finalizar embarque' : 'Reactivar embarque';
            const btnFinalizarIcon = status === 'NO' ? 'fa-check' : 'fa-undo';
            str += `
                <tr>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main">${F.convertDateNormal(r.FECHA)}</span>
                    </td>
                    <td class="sygma-embarque-rpt__cell-stack">
                        <span class="sygma-embarque-rpt__cell-main text-danger">${r.CODEMBARQUE}</span>
                        <span class="sygma-embarque-rpt__cell-sub">${r.DESCRIPCION || ''}</span>
                        <span class="sygma-embarque-rpt__cell-sub">${r.RUTEO || ''}</span>
                    </td>
                    <td>${r.NOMEMPLEADO || ''}</td>
                    <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(r.IMPORTE,'Q')}</td>
                    <td class="text-right">${F.setMoneda(r.DEVOLUCIONES,'Q')}</td>
                 
                    <td class="sygma-embarque-rpt__col-action oculto-impresion text-center">
                        <button type="button" class="btn btn-outline-info btn-md btn-circle hand shadow sygma-embarques-btn-action"
                            onclick="embarque_imprimir_productos('${r.CODEMBARQUE}','${F.convertDateNormal(r.FECHA)}')" title="Imprimir ${GlobalRptPicking}">
                            <i class="fal fa-print"></i>
                        </button>
                    </td>
                
                </tr>
            `;
        });


        container.innerHTML = str || `<tr><td colspan="9" class="text-center text-muted py-3">No hay embarques en este periodo</td></tr>`;

        const lbGrid = document.getElementById('lbEmbGridTotal');
        const lbBadge = document.getElementById('lbTotalEmb');
        const estadoLabel = status === 'NO' ? 'Pendientes' : 'Finalizados';
        if (lbGrid) lbGrid.innerText = `${estadoLabel}: ${conteo}`;
        if (lbBadge) {
            lbBadge.innerText = status === 'NO' ? `Pendientes ${conteo}` : `${conteo}`;
        }

        const totalBlock = document.getElementById('lbEmbGridTotalBlock');
        if (totalBlock) {
            totalBlock.innerHTML = conteo ? `
                <div class="sygma-embarque-rpt__total-inner">
                    <span class="sygma-embarque-rpt__foot-label">TOTAL IMPORTE</span>
                    <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(totalImporte, 'Q')}</span>
                    <span class="sygma-embarque-rpt__foot-label">DEVOLUCIONES</span>
                    <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(totalDevol, 'Q')}</span>
                </div>` : '';
        }

        const txtBuscar = document.getElementById('txtBuscarEmbarques');
        if (txtBuscar?.value) F.FiltrarTabla('tblEmbarques', 'txtBuscarEmbarques');

        
    })
    .catch(()=>{
        const lbBadge = document.getElementById('lbTotalEmb');
        if (lbBadge) lbBadge.innerText = '---';
        const lbGrid = document.getElementById('lbEmbGridTotal');
        if (lbGrid) lbGrid.innerText = '---';
        const totalBlock = document.getElementById('lbEmbGridTotalBlock');
        if (totalBlock) totalBlock.innerHTML = '';
        container.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-3">No se cargaron datos</td></tr>`;
    })

};

function embarque_imprimir_productos(embarque, fechaLabel){
    const codembarque = embarque;
    if (!codembarque) return;
    const host = document.getElementById('sygma_embarque_print_host');
    if (!host) return;
    embarque_print_codembarque = codembarque;
    embarque_print_fecha = fechaLabel || '';
    embarque_print_show_loader(`Generando ${GlobalRptPicking}...`);
    Promise.all([
        GF.get_data_embarque_productos(GlobalEmpnit, codembarque),
        embarque_fetch_resumen_vendedor(codembarque)
    ])
    .then(([prodData, resumenRows]) => {
        let contador = 0;
        let varTotal = 0;
        let strRows = '';
        (prodData.recordset || []).forEach((r) => {
            contador += 1;
            varTotal += Number(r.IMPORTE) || 0;
            strRows += `
                <tr>
                    <td><span class="sygma-embarque-rpt__cod-main">${r.CODPROD}</span></td>
                    <td><span class="sygma-embarque-rpt__prod-main">${r.DESPROD}</span></td>
                    <td class="text-center">${r.UXC}</td>
                    <td class="text-center">${r.CAJAS}</td>
                    <td class="text-center">${r.UNIDADES}</td>
                    <td class="text-center">${Number(r.BONI || 0)}</td>
                    <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(r.IMPORTE, 'Q')}</td>
                </tr>`;
        });
        if (!strRows) strRows = `<tr><td colspan="7" class="text-center text-muted py-2">Sin productos</td></tr>`;
        host.innerHTML = embarque_print_sheet_open(GlobalRptPicking) + `
            <div class="table-responsive sygma-embarque-rpt__table-wrap">
                <table class="table sygma-embarque-rpt__table mb-0">
                    <thead><tr>
                        <th>CODIGO</th><th>PRODUCTO</th>
                        <th class="text-center">UXC</th><th class="text-center">CAJAS</th><th class="text-center">UNIDADES</th>
                        <th class="text-center">BONI</th>
                        <th class="text-right">IMPORTE</th>
                    </tr></thead>
                    <tbody>${strRows}</tbody>
                </table>
            </div>
            <div class="sygma-embarque-rpt__total-block"><div class="sygma-embarque-rpt__total-inner">
                <span class="sygma-embarque-rpt__foot-label">ITEMS</span><span class="sygma-embarque-rpt__foot-total">${contador}</span>
                <span class="sygma-embarque-rpt__foot-label">TOTAL IMPORTE</span><span class="sygma-embarque-rpt__foot-total">${F.setMoneda(varTotal, 'Q')}</span>
            </div></div>
            ${embarque_build_resumen_vendedor_html(resumenRows)}
            ${embarque_print_sheet_close()}`;
        embarque_ejecutar_impresion();
        embarque_print_hide_loader(false);
    })
    .catch((error) => {
        console.log(error);
        embarque_print_hide_loader(true);
        F.AvisoError(`No se pudo generar el reporte ${GlobalRptPicking}`);
        host.innerHTML = '';
    });
};

function embarque_fetch_resumen_vendedor(codembarque){
    return GF.get_data_embarque_resumen_vendedores(GlobalEmpnit, codembarque)
        .then((data) => data.recordset || [])
        .catch(() => []);
};

function embarque_print_show_loader(mensaje){
    const loader = document.getElementById('embPrintLoader');
    const actions = document.getElementById('embPrintActions');
    const footer = document.getElementById('embPrintFooter');
    const txt = loader?.querySelector('.sygma-embarque-print-modal__loader-text');
    if (txt) txt.textContent = mensaje || 'Generando imprimible...';
    loader?.classList.remove('d-none');
    actions?.classList.add('d-none');
    footer?.classList.add('d-none');
};
function embarque_print_hide_loader(keepModalOpen){
    document.getElementById('embPrintLoader')?.classList.add('d-none');
    document.getElementById('embPrintActions')?.classList.remove('d-none');
    document.getElementById('embPrintFooter')?.classList.remove('d-none');
    if (!keepModalOpen) $('#modal_embarque_imprimir').modal('hide');
};
function embarque_build_resumen_vendedor_html(rows){
    let varTotal = 0;
    let totalPedidos = 0;
    let strRows = '';
    rows.forEach((r) => {
        totalPedidos += Number(r.CONTEO) || 0;
        varTotal += Number(r.IMPORTE) || 0;
        strRows += `
            <tr>
                <td>${r.EMPLEADO || ''}</td>
                <td class="text-center">${r.CONTEO || 0}</td>
                <td class="text-right sygma-embarque-rpt__importe">${F.setMoneda(r.IMPORTE, 'Q')}</td>
            </tr>`;
    });
    if (!strRows) {
        strRows = `<tr><td colspan="3" class="text-center text-muted py-2">Sin datos de vendedores</td></tr>`;
    }
    return `
        <div class="sygma-embarque-print-section">
            <h5 class="sygma-embarque-print-section__title">Resumen por Vendedor</h5>
            <div class="table-responsive sygma-embarque-rpt__table-wrap">
                <table class="table sygma-embarque-rpt__table mb-0">
                    <thead>
                        <tr>
                            <th>VENDEDOR</th>
                            <th class="text-center">PEDIDOS</th>
                            <th class="text-right">IMPORTE</th>
                        </tr>
                    </thead>
                    <tbody>${strRows}</tbody>
                </table>
            </div>
            <div class="sygma-embarque-rpt__total-block">
                <div class="sygma-embarque-rpt__total-inner">
                    <span class="sygma-embarque-rpt__foot-label">PEDIDOS</span>
                    <span class="sygma-embarque-rpt__foot-total">${totalPedidos}</span>
                    <span class="sygma-embarque-rpt__foot-label">TOTAL IMPORTE</span>
                    <span class="sygma-embarque-rpt__foot-total">${F.setMoneda(varTotal, 'Q')}</span>
                </div>
            </div>
        </div>`;
};
function embarque_ejecutar_impresion(){
    document.body.classList.add('sygma-print-embarque-active');
    window.print();
    setTimeout(() => {
        document.body.classList.remove('sygma-print-embarque-active');
    }, 600);
};
function embarque_print_sheet_close(){
    return `</div></div>`;
};
function embarque_print_sheet_open(titulo){
    return `
    <div class="sygma-embarque-rpt sygma-embarque-print-sheet">
        <div class="sygma-embarque-rpt__body p-2">
            <header class="sygma-embarque-rpt__header">
                <div class="sygma-embarque-rpt__brand">
                    <img class="sygma-embarque-rpt__logo" src="./favicon.png" width="40" height="40" alt="Logo">
                    <div class="sygma-embarque-rpt__brand-text">
                        <h4 class="sygma-embarque-rpt__title mb-0">${titulo}</h4>
                        <div class="sygma-embarque-rpt__embarque-info">
                            <span class="sygma-embarque-rpt__embarque-code">Embarque: ${embarque_print_codembarque}</span>
                            <span class="sygma-embarque-rpt__embarque-date">Fecha: ${embarque_print_fecha || '—'}</span>
                        </div>
                    </div>
                </div>
            </header>`;
};




function get_data_surtido(empnit,tipobi){
    return new Promise((resolve, reject)=>{
        
        let data = {
            token:TOKEN,
            sucursal:empnit,
            tipobi:tipobi
        };

        axios.post(`/compras/surtido_sucursales`, data)
        .then(res => {
            
            if(res.status.toString()=='200'){
                let data = res.data;
                if(Number(data.rowsAffected[0])>0){
                    resolve(data);             
                }else{
                    reject();
                }            
            }else{
                reject();
            } 
        })
        .catch(()=>{
            reject();
        })

    })
};

function get_tbl_surtido(empnit){


    let container = document.getElementById('tblDataSurtido');
    container.innerHTML = GlobalLoader;
    let lbTotal = document.getElementById('lbTotalPendientes');
    lbTotal.innerText = '---'


    let tipobi = document.getElementById('cmbTipoRentabilidad').value;

    let contador = 0;

   

    get_data_surtido(empnit,tipobi)
    .then((data)=>{
        
        let str = '';
        data.recordset.map((r)=>{
            contador +=1;
          
            str +=`
                <tr>
                    <td>${r.DESPROD}
                        <br>
                        <small class="negrita text-base">${r.CODPROD}</small>
                    </td>
                    <td>${r.DESMARCA}</td>
                    <td>${r.MINIMO}</td>
                    <td>${r.MAXIMO}</td>
                    <td class="negrita">${r.EXISTENCIA}</td>
                    <td class="negrita text-danger">${r.RELLENO}</td>
                    <td>${F.convertDateNormal(r.LASTUPDATE)}</td>
                    <td>
                        <button class="btn btn-base btn-circle btn-md hand shadow" onclick="get_existencia_sucursales('${r.CODPROD}','${r.DESPROD}','${r.DESMARCA}')">
                            <i class="fal fa-box"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
        lbTotal.innerText = `Pendientes surtir ${contador}`;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...'
        lbTotal.innerText = '---'
    })


}







function get_total_rellenos(){

    return new Promise((resolve, reject)=>{
        
        let data = {
            token:TOKEN
        };

        axios.post(`/compras/total_rellenos`, data)
        .then(res => {
            if(res.status.toString()=='200'){
                let data = res.data;
                if(Number(data.rowsAffected[0])>0){
                    resolve(data);             
                }else{
                    reject();
                }            
            }else{
                reject();
            } 
        })
        .catch(()=>{
            reject();
        })

    })
};



function get_existencia_sucursales(codprod,desprod,desmarca){

    $("#modal_existencia_sucursales").modal('show');

    document.getElementById('lbDesprodSucursales').innerText = desprod;
    document.getElementById('lbDesmarcaSucursales').innerText = desmarca;

    let container = document.getElementById('tblDataSucursales');
    container.innerHTML = GlobalLoader;

    GF.get_data_sucursales_existencia(codprod)
    .then((data)=>{
        let str = '';
        let strClassExist ='';
        let varMinimo =0; let varMaximo=0; let varExistencia =0; let varRelleno =0;
     
        data.recordset.map((r)=>{
            varMinimo += Number(r.MINIMO); 
            varMaximo += Number(r.MAXIMO); 
            varExistencia += Number(r.EXISTENCIA); 
            varRelleno += Number(r.RELLENO);
            if(Number(r.RELLENO)<0){strClassExist='text-success negrita'}else{strClassExist='text-danger negrita'}
            str += `
             <tr>
                <td>${r.NOMEMPRESA}</td>
                <td>${r.MINIMO}</td>
                <td>${r.MAXIMO}</td>
                <td>${r.EXISTENCIA}</td>
                <td class='${strClassExist}'>${r.RELLENO}</td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('tblFooterSucursales').innerHTML = ` <tr>
                                                                        <td></td>
                                                                        <td>${varMinimo}</td>
                                                                        <td>${varMaximo}</td>
                                                                        <td>${varExistencia}</td>
                                                                        <td>${varRelleno}</td>
                                                                    </tr>`
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('tblFooterSucursales').innerHTML = ` <tr>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                    </tr>`
    })


    let container2 = document.getElementById('tblDataDocumentosProducto');
    container2.innerHTML = GlobalLoader;

    GF.get_data_documentos_pendientes_producto(codprod)
    .then((data)=>{
        let str = '';
     
        data.recordset.map((r)=>{
            str += `
            <tr>
                <td>${F.convertDateNormal(r.FECHA)}
                    <br>
                    <small class="negrita text-danger">H:${r.HORA}</small>
                </td>
                <td>${r.CODDOC}-${r.CORRELATIVO}</td>
                <td>${r.CODMEDIDA} - ${r.CANTIDAD}</td>
            </tr>
            `
        })
        container2.innerHTML = str;
      
    })
    .catch(()=>{
        container2.innerHTML = 'No se cargaron datos....';
    })



}


(function () {
    window.__spaViewHooks = window.__spaViewHooks || {};
    window.__spaViewHooks['inicio/compras'] = {
        initView: initView,
        destroyView: function () {}
    };
})();

