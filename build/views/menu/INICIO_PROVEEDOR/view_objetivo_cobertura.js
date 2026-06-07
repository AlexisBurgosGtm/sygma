
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 proveedor-cobertura-clientes proveedor-rpt-marcas">
                    <div class="tab-content" id="coberturaClientesTabContent">
                        <div class="tab-pane fade show active" id="cobertura-clientes-pane-listado" role="tabpanel">
                            ${view.vista_listado() + view.modal_cobertura_marca_empleados()}
                        </div>
                        <div class="tab-pane fade" id="cobertura-clientes-pane-empleado" role="tabpanel">
                            ${view.vista_empleado()}
                        </div>
                    </div>

                    <ul class="nav nav-tabs hidden" id="coberturaClientesTabNav" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="cobertura-clientes-tab-listado" data-toggle="tab" href="#cobertura-clientes-pane-listado" role="tab">
                                <i class="fal fa-list"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="cobertura-clientes-tab-empleado" data-toggle="tab" href="#cobertura-clientes-pane-empleado" role="tab">
                                <i class="fal fa-user"></i></a>
                        </li>
                    </ul>
                </div>
            `
        },
        vista_listado:()=>{
            return `
            <div class="proveedor-rpt-marcas__hero card shadow-sm mb-3">
                <div class="card-body py-3 px-4">
                    <h5 class="negrita text-secondary mb-1">Cobertura de clientes</h5>
                    <small class="text-muted">Mes y sede según filtros del encabezado</small>
                </div>
            </div>

            <div class="row">
                <div class="col-12 col-xl-6 mb-3 mb-xl-0">
                    <div class="proveedor-rpt-marcas__panel card shadow-sm h-100">
                        <div class="proveedor-rpt-marcas__panel-header">
                            <span class="negrita text-base">Vendedores</span>
                        </div>
                        <div class="card-body p-3">
                            <div class="table-responsive proveedor-rpt-marcas__scroll">
                                <table class="table table-sm table-bordered table-hover proveedor-rpt-marcas__table mb-0">
                                    <thead class="bg-base text-white">
                                        <tr>
                                            <td>VENDEDOR</td>
                                            <td class="text-right">UNIVERSO</td>
                                            <td class="text-right">VISITADOS</td>
                                            <td class="text-right">FALTAN</td>
                                            <td class="text-right" style="width:2.5rem;"></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataClientes"></tbody>
                                    <tfoot class="bg-base text-white negrita">
                                        <tr>
                                            <td>TOTAL</td>
                                            <td></td>
                                            <td class="text-right" id="lbTotalVendedorVisitados"></td>
                                            <td class="text-right" id="lbTotalVendedorFaltan"></td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="proveedor-rpt-marcas__panel card shadow-sm h-100">
                        <div class="proveedor-rpt-marcas__panel-header">
                            <span class="negrita text-primary">Marcas</span>
                        </div>
                        <div class="card-body p-3">
                            <div class="table-responsive proveedor-rpt-marcas__scroll">
                                <table class="table table-sm table-bordered table-hover proveedor-rpt-marcas__table mb-0">
                                    <thead class="bg-primary text-white">
                                        <tr>
                                            <td>MARCA</td>
                                            <td class="text-right">VISITADOS</td>
                                            <td class="text-right">IMPORTE</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataMarcas"></tbody>
                                    <tfoot class="bg-primary text-white negrita">
                                        <tr>
                                            <td>TOTAL</td>
                                            <td class="text-right" id="lbTotalMarcaVisitados"></td>
                                            <td class="text-right" id="lbTotalMarcaImporte"></td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        },
        vista_empleado:()=>{
            return `
            <div class="proveedor-cobertura-clientes-detalle-header card card-rounded shadow-sm mb-2">
                <div class="card-body py-2 px-3">
                    <div class="d-flex align-items-center">
                        <button type="button" class="btn btn-secondary btn-circle btn-sm shadow hand flex-shrink-0" id="btnAtrasEmpleado" title="Volver al listado">
                            <i class="fal fa-arrow-left"></i>
                        </button>
                        <div class="ml-2 flex-grow-1 min-width-0">
                            <div class="negrita text-danger text-truncate" id="lbEmpleado">Vendedor</div>
                            <div class="proveedor-cobertura-clientes-detalle-stats small">
                                <span class="negrita text-success" id="lbEmpleadoTotal">Visitados: 0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12 col-xl-6 mb-3 mb-xl-0">
                    <div class="proveedor-rpt-marcas__panel card shadow-sm h-100">
                        <div class="proveedor-rpt-marcas__panel-header">
                            <span class="negrita text-base">Clientes no visitados</span>
                        </div>
                        <div class="card-body p-3">
                            <input type="text"
                                id="txtBuscarEmpleado"
                                class="form-control form-control-sm mb-2"
                                placeholder="Escriba para buscar..."
                                oninput="F.FiltrarTabla('tblEmpleado','txtBuscarEmpleado')">

                            <div class="table-responsive proveedor-rpt-marcas__scroll proveedor-cobertura-clientes-nv-scroll">
                                <table class="table table-sm table-bordered table-hover proveedor-rpt-marcas__table proveedor-cobertura-clientes-nv mb-0" id="tblEmpleado">
                                    <colgroup>
                                        <col class="proveedor-cobertura-col-visita">
                                        <col class="proveedor-cobertura-col-cliente">
                                        <col class="proveedor-cobertura-col-direccion">
                                        <col class="proveedor-cobertura-col-fecha">
                                        <col class="proveedor-cobertura-col-action">
                                        <col class="proveedor-cobertura-col-action">
                                    </colgroup>
                                    <thead class="bg-base text-white">
                                        <tr>
                                            <td class="text-center">VISITA</td>
                                            <td>CLIENTE</td>
                                            <td>DIRECCION</td>
                                            <td class="text-center">ULTIMA_V</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataEmpleado"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="proveedor-rpt-marcas__panel card shadow-sm h-100">
                        <div class="proveedor-rpt-marcas__panel-header">
                            <span class="negrita text-primary">Marcas</span>
                        </div>
                        <div class="card-body p-3">
                            <div class="table-responsive proveedor-rpt-marcas__scroll">
                                <table class="table table-sm table-bordered table-hover proveedor-rpt-marcas__table mb-0">
                                    <thead class="bg-primary text-white">
                                        <tr>
                                            <td>MARCA</td>
                                            <td class="text-right">VISITADOS</td>
                                            <td class="text-right">IMPORTE</td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataMarcasEmpleado"></tbody>
                                    <tfoot class="bg-primary text-white negrita">
                                        <tr>
                                            <td>TOTAL</td>
                                            <td class="text-right" id="lbTotalMarcaVisitadosEmpleado"></td>
                                            <td class="text-right" id="lbTotalMarcaImporteEmpleado"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        },
        modal_cobertura_marca_empleados:()=>{
            return `
              <div id="modal_marca_empleados" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-primary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white">
                                Cobertura marca empleados
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            <div class="card card-rounded proveedor-rpt-marcas__panel">
                                <div class="card-body p-3">
                                    <h5 class="negrita text-danger mb-2" id="lbDesmarca"></h5>
                                    <div class="table-responsive proveedor-rpt-marcas__scroll">
                                        <table class="table table-sm table-bordered table-hover proveedor-rpt-marcas__table mb-0">
                                            <thead class="bg-primary text-white">
                                                <tr>
                                                    <td>EMPLEADO</td>
                                                    <td class="text-right">COBERTURA</td>
                                                    <td class="text-right">IMPORTE</td>
                                                </tr>
                                            </thead>
                                            <tbody id="data_tbl_empleados_marca"></tbody>
                                            <tfoot class="bg-primary text-white negrita">
                                                <tr>
                                                    <td>TOTAL</td>
                                                    <td class="text-right" id="lbTotalEmpMarcaCobertura"></td>
                                                    <td class="text-right" id="lbTotalEmpMarcaImporte"></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div class="row mt-3">
                                <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                    <i class="fal fa-arrow-left"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        }
    }

    root.innerHTML = view.body();

};

function cobertura_clientes_mostrarListado() {
    document.getElementById('cobertura-clientes-tab-listado')?.click();
}

function addListeners(){

    F.slideAnimationTabs();

    const cobertura_refresh = () => {
        rpt_cobertura_vendedores();
        rpt_cobertura_marcas();
    };

    cobertura_refresh();
    window.proveedor_embedRefresh = cobertura_refresh;

    document.getElementById('btnAtrasEmpleado')?.addEventListener('click', () => {
        cobertura_clientes_mostrarListado();
        document.getElementById('tblDataEmpleado').innerHTML = '';
    });

};

function initView(){

    getView();
    addListeners();

};



function rpt_cobertura_vendedores(){

    let sucursal = proveedor_getSucursal();
    let mes = proveedor_getMes();
    let anio = proveedor_getAnio();


    let container = document.getElementById('tblDataClientes');
    container.innerHTML = GlobalLoader;


    let varTotalConteo = 0;
    let varTotalFaltan = 0;

    GF.update_cobertura_empleados(sucursal,mes,anio)
    .then(()=>{

            GF.data_cobertura_empleados(sucursal)
            .then((data)=>{

                let str = '';
                data.recordset.map((r)=>{
                    let logrado = (Number(r.ALCANCE)/Number(r.UNIVERSO))*100;
                    let faltan = (Number(r.UNIVERSO)-Number(r.ALCANCE));

                    varTotalConteo += Number(r.ALCANCE);
                    varTotalFaltan += Number(faltan);
                    const pct = logrado.toFixed(2);
                    str+=`
                    <tr class="proveedor-cobertura-vendedor-row">
                        <td>${r.NOMEMPLEADO}</td>
                        <td class="text-right">${r.UNIVERSO}</td>
                        <td class="text-right">${r.ALCANCE}</td>
                        <td class="text-right">${faltan}</td>
                        <td class="text-right">
                            <button type="button" class="btn btn-sm btn-circle proveedor-cobertura-btn-detalle hand"
                            onclick="get_logro_empleado('${r.CODEMPLEADO}','${r.NOMEMPLEADO}')">
                                <i class="fal fa-list"></i>
                            </button>
                        </td>
                    </tr>
                    <tr class="proveedor-cobertura-vendedor-progress">
                        <td colspan="5" class="py-1 px-2">
                            <div class="proveedor-cobertura-progress-wrap">
                                <progress class="proveedor-cobertura-progress" value="${logrado}" max="100"></progress>
                                <span class="proveedor-cobertura-progress-pct text-success negrita">${pct}%</span>
                            </div>
                        </td>
                    </tr>
                    `
                })
                container.innerHTML = str;
                document.getElementById('lbTotalVendedorVisitados').innerText = varTotalConteo;
                document.getElementById('lbTotalVendedorFaltan').innerText = varTotalFaltan;
            })
            .catch(()=>{
                container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se cargaron datos</td></tr>';
                document.getElementById('lbTotalVendedorVisitados').innerText = '';
                document.getElementById('lbTotalVendedorFaltan').innerText = '';
            })
            
    })
    .catch(()=>{
        container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se cargaron datos</td></tr>';
    })


};
function get_logro_empleado(codemp,nombre){


    document.getElementById('lbEmpleado').innerText = nombre;

    document.getElementById('cobertura-clientes-tab-empleado').click();

    tbl_clientes_empleado(codemp);
    rpt_cobertura_marcas_empleado(codemp);


};
function tbl_clientes_empleado(codemp){

    let container = document.getElementById('tblDataEmpleado');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;

    GF.data_clientes_no_visitados_empleado('',codemp)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            varTotal+=1;
            str += `
                <tr>
                    <td class="text-center">${r.VISITA}</td>
                    <td class="proveedor-cobertura-cliente-cell">
                        <span class="proveedor-cobertura-cliente-tipo">${r.TIPONEGOCIO}-${r.NEGOCIO}</span>
                        <span class="proveedor-cobertura-cliente-nombre">${r.NOMBRE}</span>
                    </td>
                    <td class="proveedor-cobertura-cliente-dir">
                        <span class="proveedor-cobertura-cliente-dir-linea">${r.DIRECCION || ''}</span>
                        ${r.MUNICIPIO ? `<span class="proveedor-cobertura-cliente-dir-meta">${r.MUNICIPIO}</span>` : ''}
                        ${r.ALDEA ? `<span class="proveedor-cobertura-cliente-dir-meta">${r.ALDEA}</span>` : ''}
                    </td>
                    <td class="text-center text-nowrap">${F.convertDateNormal(r.LASTSALE)}</td>
                    <td class="text-center p-1">
                        <button type="button" class="btn btn-sm btn-circle btn-info hand shadow"
                        onclick="F.gotoGoogleMaps('${r.LATITUD}','${r.LONGITUD}')">
                            <i class="fal fa-map"></i>
                        </button>
                    </td>
                    <td class="text-center p-1">
                        <button type="button" class="btn btn-sm btn-circle btn-secondary hand shadow"
                        onclick="F.phone_call('${r.TELEFONO}')">
                            <i class="fal fa-phone"></i>
                        </button>
                    </td>
                </tr>
            `
        })
         container.innerHTML = str;
        document.getElementById('lbEmpleadoTotal').innerText = `Visitados: ${varTotal}`;
    })
    .catch(()=>{
        container.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No se cargaron datos</td></tr>';
        document.getElementById('lbEmpleadoTotal').innerText = '';
    })




};
function rpt_cobertura_marcas_empleado(codemp){

    let sucursal = proveedor_getSucursal();
    let mes = proveedor_getMes();
    let anio = proveedor_getAnio();


    let container = document.getElementById('tblDataMarcasEmpleado');
    container.innerHTML = GlobalLoader;

        let varTotalConteo = 0;
        let varTotalImporte = 0;

            GF.data_cobertura_marcas_empleado(sucursal,mes,anio,codemp)
            .then((data)=>{

                let str = '';
                data.recordset.map((r)=>{
                    varTotalConteo += Number(r.CONTEO);
                    varTotalImporte += Number(r.TOTALPRECIO);
                    str+=`
                    <tr>
                        <td>${r.DESMARCA}</td>
                        <td class="text-right">${r.CONTEO}</td>
                        <td class="text-right">${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    </tr>
                    `
                })
                container.innerHTML = str;
                document.getElementById('lbTotalMarcaVisitadosEmpleado').innerText = varTotalConteo;
                document.getElementById('lbTotalMarcaImporteEmpleado').innerText = F.setMoneda(varTotalImporte,'Q');
                
            })
            .catch(()=>{
                container.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No se cargaron datos</td></tr>';
                document.getElementById('lbTotalMarcaVisitadosEmpleado').innerText = '';
                document.getElementById('lbTotalMarcaImporteEmpleado').innerText = '';
            })

  
   

};


function rpt_cobertura_marcas(){

    let sucursal = proveedor_getSucursal();
    let mes = proveedor_getMes();
    let anio = proveedor_getAnio();


    let container = document.getElementById('tblDataMarcas');
    container.innerHTML = GlobalLoader;

        let varTotalConteo = 0;
        let varTotalImporte = 0;

            GF.data_cobertura_marcas(sucursal,mes,anio)
            .then((data)=>{

                let str = '';
                data.recordset.map((r)=>{
                    varTotalConteo += Number(r.CONTEO);
                    varTotalImporte += Number(r.TOTALPRECIO);
                    str+=`
                    <tr>
                        <td>${r.DESMARCA}</td>
                        <td class="text-right">${r.CONTEO}</td>
                        <td class="text-right">${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                        <td>
                            <button class="btn btn-sm btn-circle btn-primary hand shadow"
                            onclick="get_empleados_marca('${r.CODMARCA}','${r.DESMARCA}')">
                                <i class="fal fa-list"></i>
                            </button>
                        </td>
                    </tr>
                    `
                })
                container.innerHTML = str;
                document.getElementById('lbTotalMarcaVisitados').innerText = varTotalConteo;
                document.getElementById('lbTotalMarcaImporte').innerText = F.setMoneda(varTotalImporte,'Q');
                
            })
            .catch(()=>{
                container.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No se cargaron datos</td></tr>';
                document.getElementById('lbTotalMarcaVisitados').innerText = '';
                document.getElementById('lbTotalMarcaImporte').innerText = '';
            })

  
   

};
function get_empleados_marca(codmarca,desmarca){


    document.getElementById('lbDesmarca').innerText = desmarca;

    $("#modal_marca_empleados").modal('show');

    rpt_cobertura_empleados_marca(codmarca);


};
function rpt_cobertura_empleados_marca(codmarca){

    let sucursal = proveedor_getSucursal();
    let mes = proveedor_getMes();
    let anio = proveedor_getAnio();


    let container = document.getElementById('data_tbl_empleados_marca');
    container.innerHTML = GlobalLoader;

    document.getElementById('lbTotalEmpMarcaCobertura').innerHTML = '';
    document.getElementById('lbTotalEmpMarcaImporte').innerHTML = '';

        let varTotalConteo = 0;
        let varTotalImporte = 0;

            GF.data_cobertura_empleados_marca(sucursal,codmarca,mes,anio)
            .then((data)=>{

                let str = '';
                data.recordset.map((r)=>{
                    varTotalConteo += Number(r.CONTEO);
                    varTotalImporte += Number(r.TOTALPRECIO);
                    str+=`
                    <tr>
                        <td>${r.EMPLEADO}</td>
                        <td class="text-right">${r.CONTEO}</td>
                        <td class="text-right">${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    </tr>
                    `
                })
                container.innerHTML = str;

                document.getElementById('lbTotalEmpMarcaCobertura').innerHTML = varTotalConteo;
                document.getElementById('lbTotalEmpMarcaImporte').innerHTML = F.setMoneda(varTotalImporte,'Q');
                           
            })
            .catch(()=>{
                container.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No se cargaron datos</td></tr>';
                document.getElementById('lbTotalEmpMarcaCobertura').innerHTML = '';
                document.getElementById('lbTotalEmpMarcaImporte').innerHTML = '';
            })

  
   

};
