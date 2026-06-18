
function procter_getCodEmp() {
    return String(GlobalCodUsuario || document.getElementById('cmbEmpleado')?.value || '0');
}

function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 ventas-procter-panel">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_parametros_dias()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_listado()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
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
                    </ul>
                </div>

               <button type="button" class="btn btn-outline-primary btn-circle btn-xl btn-bottom-r hand shadow ventas-procter-print d-none d-md-inline-flex" onclick="window.print()" title="Imprimir">
                    <i class="fal fa-print"></i>
               </button>
            `
        },
        vista_parametros_dias:()=>{
            return `
            <div class="card ventas-procter-card shadow-sm mb-2">
                <div class="card-body py-2 px-2">
                    <div class="d-flex align-items-center mb-2">
                        <img src="./img/logopg.png" class="ventas-procter-logo mr-2" width="48" height="48" alt="P&G">
                        <div>
                            <h6 class="negrita text-info mb-0 ventas-procter-title">Avance P&amp;G</h6>
                            <small class="text-secondary">Configure los días del mes</small>
                        </div>
                    </div>
                    <div class="row no-gutters align-items-end ventas-procter-dias-form">
                        <div class="col-6 col-md-4 pr-1">
                            <label class="ventas-procter-label mb-0">Laborales</label>
                            <select class="form-control form-control-sm negrita text-base" id="cmbDiasLaborales"></select>
                        </div>
                        <div class="col-6 col-md-4 px-md-1">
                            <label class="ventas-procter-label mb-0">Trabajados</label>
                            <select class="form-control form-control-sm negrita text-base" id="cmbDiasTrabajados"></select>
                        </div>
                        <div class="col-12 col-md-4 mt-2 mt-md-0 pl-md-1">
                            <button type="button" class="btn btn-base btn-sm hand shadow ventas-procter-btn-report w-100" id="btnAceptarParametros">
                                <i class="fal fa-arrow-right mr-1"></i> Ver reporte
                            </button>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-2 pt-2 ventas-procter-resumen">
                        <small class="text-secondary">Faltan: <b class="text-danger" id="lbDiasFaltantes">0</b></small>
                        <small class="text-secondary">% necesario: <b class="text-success" id="lbPorcentajeNecesarioSetup">0%</b></small>
                    </div>
                </div>
            </div>
            `
        },
        vista_listado:()=>{
            return `
            <div class="card ventas-procter-card shadow-sm mb-2">
                <div class="card-body py-2 px-2">
                    <div class="row no-gutters align-items-center">
                        <div class="col-12 col-md-7 mb-1 mb-md-0">
                            <label class="ventas-procter-label mb-0">Vendedor</label>
                            <select class="form-control form-control-sm negrita" id="cmbEmpleado"></select>
                            <small class="negrita text-danger d-block mt-1" id="lbParametrosDias"></small>
                        </div>
                        <div class="col-12 col-md-5 text-md-right ventas-procter-pct">
                            <small class="text-secondary d-block">% necesario al día</small>
                            <span class="ventas-procter-pct__value text-success negrita" id="lbPorcentajeNecesario">0%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row no-gutters ventas-procter-report">
                <div class="col-12 col-lg-4 pr-lg-1 mb-2 mb-lg-0">
                    ${view.frag_logro_cobertura_goles()}
                </div>   
                <div class="col-12 col-lg-8 pl-lg-1">
                    ${view.frag_logro_marcas()}
                </div>
            </div>
            `
        },
        frag_parametros_mes:()=>{
            return ``;
        },
        frag_parametros_dias:()=>{
            return ``
        },
        frag_logro_cobertura_goles:()=>{
            return `
            <div class="card ventas-procter-card shadow-sm h-100">
                <div class="card-body py-2 px-2">
                    <h6 class="ventas-procter-section-title mb-2">Cobertura</h6>
                    <div class="ventas-procter-stats-grid ventas-procter-stats-grid--3 mb-2">
                        <div class="ventas-procter-stat">
                            <span class="ventas-procter-stat__label">Objetivo</span>
                            <span class="ventas-procter-stat__value text-danger" id="lbTotalClientesEmpleado">0</span>
                        </div>
                        <div class="ventas-procter-stat">
                            <span class="ventas-procter-stat__label">Logro</span>
                            <span class="ventas-procter-stat__value text-success" id="lbTotalClientesvisitado">0</span>
                        </div>
                        <div class="ventas-procter-stat">
                            <span class="ventas-procter-stat__label">Falta</span>
                            <span class="ventas-procter-stat__value text-base" id="lbTotalClientesFalta">0</span>
                        </div>
                    </div>
                    <h6 class="ventas-procter-section-title mb-2">Goles</h6>
                    <div class="ventas-procter-stats-grid ventas-procter-stats-grid--3 mb-2">
                        <div class="ventas-procter-stat">
                            <span class="ventas-procter-stat__label">Objetivo</span>
                            <span class="ventas-procter-stat__value text-danger" id="lbTotalClientesEmpleadoGoles">0</span>
                        </div>
                        <div class="ventas-procter-stat">
                            <span class="ventas-procter-stat__label">Logro</span>
                            <span class="ventas-procter-stat__value text-success" id="lbTotalClientesvisitadoGoles">0</span>
                        </div>
                        <div class="ventas-procter-stat">
                            <span class="ventas-procter-stat__label">Falta</span>
                            <span class="ventas-procter-stat__value text-base" id="lbTotalClientesFaltaGoles">0</span>
                        </div>
                    </div>
                    <h6 class="ventas-procter-section-title mb-2">SKUs por tienda</h6>
                    <div class="ventas-procter-stats-grid ventas-procter-stats-grid--3">
                        <div class="ventas-procter-stat">
                            <span class="ventas-procter-stat__label">Objetivo</span>
                            <span class="ventas-procter-stat__value text-danger" id="lbTotalSkusObjetivo">0</span>
                        </div>
                        <div class="ventas-procter-stat">
                            <span class="ventas-procter-stat__label">Logro</span>
                            <span class="ventas-procter-stat__value text-success" id="lbTotalSkusTienda">0</span>
                        </div>
                        <div class="ventas-procter-stat">
                            <span class="ventas-procter-stat__label">Falta</span>
                            <span class="ventas-procter-stat__value text-base" id="lbTotalSkusTiendaFaltan">0</span>
                        </div>
                    </div>
                </div>
            </div>
            `
        },
        frag_logro_marcas:()=>{
            return `
            <div class="card ventas-procter-card shadow-sm h-100">
                <div class="card-body py-2 px-2">
                    <h6 class="ventas-procter-section-title mb-2">Logro por marca</h6>
                    <div class="table-responsive sygma-ventas-procter-table">
                        <table class="table table-sm table-bordered mb-0 ventas-procter-table">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>MARCA</td>
                                    <td>OBJ.</td>
                                    <td>VENTA</td>
                                    <td>DEV.</td>
                                    <td>NETA</td>
                                    <td>FALTA</td>
                                    <td>%</td>
                                    <td>PROY.</td>
                                </tr>
                            </thead>
                            <tbody id="tbl_data_logro"></tbody>
                            <tfoot class="bg-base text-white negrita">
                                <tr>
                                    <td>TOTAL</td>
                                    <td id="lbTotalObjetivo"></td>
                                    <td id="lbTotalVenta"></td>
                                    <td id="lbTotalDevolucion"></td>
                                    <td id="lbTotalVentaNeta"></td>
                                    <td id="lbTotalFalta"></td>
                                    <td id="lbTotalObjetivoPorcentaje"></td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            `
        },
        modal:()=>{
            return `
              <div id="modal_" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                TITULO
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-2">

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
        }
    }

    root.innerHTML = view.body();

};

function addListeners(){

        F.slideAnimationTabs();

        document.getElementById('cmbDiasLaborales').innerHTML = F.get_combo_dias_30();
        document.getElementById('cmbDiasTrabajados').innerHTML = F.get_combo_dias_30();
        
         document.getElementById('cmbDiasLaborales').addEventListener('input',()=>{
            calcular_porcentaje();
        })

        document.getElementById('cmbDiasTrabajados').addEventListener('input',()=>{
            calcular_porcentaje();
        })

        get_parametros();
        calcular_porcentaje();

        let btnAceptarParametros = document.getElementById('btnAceptarParametros');
        btnAceptarParametros.addEventListener('click',()=>{

            document.getElementById('tab-dos').click();

            guardar_parametros();

            tbl_rpt_logro();
            rpt_cobertura();

        });


        btnAceptarParametros.disabled = true;
        btnAceptarParametros.innerHTML = `<i class="fal fa-spin fa-arrow-right mr-1"></i> Cargando...`;

        F.showToast('Cargando datos...');

        let cmbEmpleado = document.getElementById('cmbEmpleado');
        const procter_finishLoad = () => {
            btnAceptarParametros.disabled = false;
            btnAceptarParametros.innerHTML = `<i class="fal fa-arrow-right mr-1"></i> Ver reporte`;
        };

        if (cmbEmpleado) {
            cmbEmpleado.innerHTML = `<option value="${GlobalCodUsuario}">${GlobalUsuario}</option>`;
            cmbEmpleado.value = GlobalCodUsuario;
            cmbEmpleado.disabled = true;
        }
        procter_finishLoad();

        window.proveedor_embedRefresh = () => {
            if (document.getElementById('tab-dos')?.classList.contains('active')) {
                tbl_rpt_logro();
                rpt_cobertura();
            }
        };



       

        





};

function get_parametros(){

    let diaslaborales = localStorage.getItem('dias_laborales');
    let diastrabajados = localStorage.getItem('dias_trabajados');

    document.getElementById('cmbDiasLaborales').value = diaslaborales;
    document.getElementById('cmbDiasTrabajados').value = diastrabajados;

};
function guardar_parametros(){

    let laborales = document.getElementById('cmbDiasLaborales').value;
    let trabajados = document.getElementById('cmbDiasTrabajados').value;

    F.localStorage_dias_trabajados(trabajados);
    F.localStorage_dias_laborales(laborales);

    document.getElementById('lbParametrosDias').innerText = `Laborales: ${laborales} - Trabajados: ${trabajados}`;

};


function initView(){

    getView();
    addListeners();

};

function calcular_porcentaje(){

    let dias_laborales = Number(document.getElementById('cmbDiasLaborales').value);
    let dias_trabajados = Number(document.getElementById('cmbDiasTrabajados').value);
    
    let varNecesario = 0;
    const pctText = (val) => `${val.toFixed(2)} %`;
    
    try {
        let faltan = dias_laborales-dias_trabajados;
        document.getElementById('lbDiasFaltantes').innerText = faltan;

        varNecesario = ((dias_trabajados / dias_laborales)*100);

        const elPct = document.getElementById('lbPorcentajeNecesario');
        if (elPct) elPct.innerText = pctText(varNecesario);
        const elPctSetup = document.getElementById('lbPorcentajeNecesarioSetup');
        if (elPctSetup) elPctSetup.innerText = pctText(varNecesario);
    } catch (error) {

        varNecesario = 0;
        document.getElementById('lbDiasFaltantes').innerText = '--';
        const elPct = document.getElementById('lbPorcentajeNecesario');
        if (elPct) elPct.innerText = '0 %';
        const elPctSetup = document.getElementById('lbPorcentajeNecesarioSetup');
        if (elPctSetup) elPctSetup.innerText = '0 %';
    }
    


};



function tbl_rpt_logro(){


        let container = document.getElementById('tbl_data_logro');
        container.innerHTML = GlobalLoader;

        let sucursal = proveedor_getSucursal();
        let mes = proveedor_getMes();
        let anio = proveedor_getAnio();
        let codemp = procter_getCodEmp();

        let laborales = document.getElementById('cmbDiasLaborales').value;
        let trabajados = document.getElementById('cmbDiasTrabajados').value;


        let varTotalObjetivo=0;
        let varTotalVenta=0;
        let varTotalDevolucion=0;
        let varTotalNeto=0;
        let varTotalFalta=0;
        let varTotalAlcance=0;
        let conteomarcas = 0;

        GF.get_data_logro_procter_vendedor(sucursal,codemp,mes,anio)
        .then((data)=>{
            
            let str = '';
            data.recordset.map((r)=>{
                
                let neto = Number(r.VENTA)-Number(r.DEVOLUCION);
                let objetivo = Number(r.OBJETIVO);
                let falta = Number(objetivo)-Number(neto);
                if(Number(falta)<0){falta=0};
                let alcance = (Number(neto)/Number(objetivo))*100;
                
                let porc_proyeccion = ((Number(alcance)/trabajados)*laborales);
                let strClassColor = get_color_logro_pg(Number(alcance),laborales,trabajados);

                conteomarcas += 1;
                varTotalObjetivo += Number(objetivo);
                varTotalVenta += Number(r.VENTA);
                varTotalDevolucion += Number(r.DEVOLUCION);
                varTotalNeto += Number(neto);
                varTotalFalta += Number(falta);
                varTotalAlcance += Number(alcance);

                str += `
                <tr class="${strClassColor}">
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                    <td>${F.setMoneda(r.VENTA,'Q')}</td>
                    <td>${F.setMoneda(r.DEVOLUCION,'Q')}</td>
                    <td>${F.setMoneda(neto,'Q')}</td>
                    <td>${F.setMoneda(falta,'Q')}</td>
                    <td>${alcance.toFixed(2)} %</td>
                    <td>${porc_proyeccion.toFixed(2)} %</td>
                </tr>
                `;

            })
            container.innerHTML = str;

            document.getElementById('lbTotalObjetivo').innerHTML = F.setMoneda(varTotalObjetivo,'Q');
            document.getElementById('lbTotalVenta').innerHTML = F.setMoneda(varTotalVenta,'Q');
            document.getElementById('lbTotalDevolucion').innerHTML = F.setMoneda(varTotalDevolucion,'Q');
            document.getElementById('lbTotalVentaNeta').innerHTML = F.setMoneda(varTotalNeto,'Q');
            document.getElementById('lbTotalFalta').innerHTML = F.setMoneda(varTotalFalta,'Q');
            document.getElementById('lbTotalObjetivoPorcentaje').innerHTML = `${((Number(varTotalNeto)/Number(varTotalObjetivo))*100).toFixed(2)} %<br><small>P:${(varTotalAlcance/conteomarcas).toFixed(2)}%</small>`


        })
        .catch((err)=>{

            container.innerHTML = 'No se cargaron datos. Error: ' + err.toString();

            document.getElementById('lbTotalObjetivo').innerHTML = '';
            document.getElementById('lbTotalVenta').innerHTML = '';
            document.getElementById('lbTotalDevolucion').innerHTML = '';
            document.getElementById('lbTotalVentaNeta').innerHTML = '';
            document.getElementById('lbTotalFalta').innerHTML = '';
            document.getElementById('lbTotalObjetivoPorcentaje').innerHTML = '';


        })


};


function rpt_cobertura(){



    let sucursal = proveedor_getSucursal();
    let mes = proveedor_getMes();
    let anio = proveedor_getAnio();
    let codemp = procter_getCodEmp();


    //containers cobertura
    let container_objetivo = document.getElementById('lbTotalClientesEmpleado');
    let container_visitado = document.getElementById('lbTotalClientesvisitado');
    let container_falta = document.getElementById('lbTotalClientesFalta');

    //container goles
    let container_objetivo_goles = document.getElementById('lbTotalClientesEmpleadoGoles');
    let container_visitado_goles = document.getElementById('lbTotalClientesvisitadoGoles');
    let container_falta_goles = document.getElementById('lbTotalClientesFaltaGoles');


    let varObjetivoCobertura = 0; let varVisitados = 0;
    let varObjetivoGoles = 0; let varObjetivoGolesVisitados = 0;


    GF.get_data_logro_procter_objetivo_goles_cobertura(sucursal,codemp,mes,anio)
    .then((data)=>{

        data.recordset.map((r)=>{
            varObjetivoCobertura = Number(r.COBERTURA);
            varObjetivoGoles = Number(r.GOLES);
        })

        container_objetivo.innerHTML = F.setNumero(varObjetivoCobertura);
        container_objetivo_goles.innerHTML = F.setNumero(varObjetivoGoles);
        
        //------------------------
        // COBERTURA CLIENTES
        //------------------------
        GF.get_data_universo_clientes_empleado_visitado_mes(sucursal,codemp,mes,anio)
        .then((universo)=>{

            varVisitados = Number(universo);
            container_visitado.innerHTML = F.setNumero(varVisitados);

            container_falta.innerHTML = F.setNumero(Number(varObjetivoCobertura-varVisitados));

        })
        .catch(()=>{
            container_visitado.innerHTML = '0';
            container_falta.innerHTML = '---';
        });
        //------------------------
        // COBERTURA CLIENTES
        //------------------------

        //-------------------------
        // LOGRO GOLES MES
        //-------------------------
        GF.get_data_goles_total_mes_vendedor(sucursal,codemp,mes,anio)
        .then((conteo)=>{

            varObjetivoGolesVisitados = Number(conteo);
            container_visitado_goles.innerHTML = F.setNumero(varObjetivoGolesVisitados);

            container_falta_goles.innerHTML = F.setNumero(Number(varObjetivoGoles-varObjetivoGolesVisitados));

        })
        .catch(()=>{
            container_visitado_goles.innerHTML = '0';
            container_falta_goles.innerHTML = '---'

        })




        //-------------------------
        // LOGRO GOLES MES
        //-------------------------


    })
    .catch(()=>{
        //container_falta.innerHTML = 'No hay objetivos';
    })


    //-----------------------------
    //CARGA DE SKUS POR TIENDA
    //-----------------------------
    document.getElementById('lbTotalSkusObjetivo').innerText = data_objetivos.skus_tienda(sucursal);
    document.getElementById('lbTotalSkusTienda').innerText = '';
    document.getElementById('lbTotalSkusTiendaFaltan').innerText = '';

    GF.get_data_logro_procter_skus_tienda(sucursal,codemp,mes,anio)
    .then((data)=>{

        let logrado = 0;

        data.recordset.map((r)=>{
            logrado = Number(r.SKUS);
        })

        document.getElementById('lbTotalSkusTienda').innerText = F.setNumero(logrado.toFixed(2));
        let faltan = Number(data_objetivos.skus_tienda(sucursal)) - logrado;
        document.getElementById('lbTotalSkusTiendaFaltan').innerText = F.setNumero(faltan.toFixed(2)); 
        
    })
    .catch(()=>{
        //container_falta.innerHTML = 'No hay objetivos';
        document.getElementById('lbTotalSkusTienda').innerText = '';
        document.getElementById('lbTotalSkusTiendaFaltan').innerText = '';
    })
    

    //-----------------------------
    //CARGA DE SKUS POR TIENDA
    //-----------------------------
    


   




    

    

};
