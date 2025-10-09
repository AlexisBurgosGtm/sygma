
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           
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

               
               
            `
        },
        vista_listado:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-4">

                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            ${view.frag_parametros_mes()}
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            ${view.frag_parametros_dias()}
                        </div>
                    </div>
                                              

                </div>
            </div>
            
            <br>

            <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    ${view.frag_logro_marcas()}
                </div>
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    ${view.frag_logro_cobertura_goles()}
                </div>
            </div>



            <button class="btn btn-circle btn-xl btn-secondary btn-bottom-l hand shadow"
                onclick="Navegar.inicio()">
                    <i class="fal fa-home"></i>
            </button>

            `
        },
        frag_parametros_mes:()=>{
            return `
                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <div class="form-group">
                                <label>Sucursal</label>
                                <div class="input-group">
                                    <select class="form-control negrita" id="cmbSucursal">
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <div class="form-group">
                                <label>Seleccione mes y año</label>
                                <div class="input-group">
                                    <select class="form-control negrita" id="cmbMes">
                                    </select>
                                    <select class="form-control negrita" id="cmbAnio">
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <br>
                    <h5 class="text-base negrita">% NECESARIO</h5>
                    <h1 class="text-success negrita">0%</h1>
            `
        },
        frag_parametros_dias:()=>{
            return `
            <table class="table table-responsive h-full col-12">
                <tbody>
                    <tr>
                        <td>DIAS LABORALES</td>
                        <td>
                            <select class="negrita text-danger form-control" id="cmbDiasLaborales">
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>DIAS TRABAJADOS</td>
                        <td>
                            <select class="negrita text-danger form-control" id="cmbDiasTrabajados">
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>DIAS FALTANTES</td>
                        <td id="lbDiasFaltantes">0</td>
                    </tr>
                </tbody>
            </table>
            `
        },
        frag_logro_cobertura_goles:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-4">

                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">

                            <h5 class="text-base negrita">COBERTURA</h5>
                            <table class="table table-responsive h-full col-12">
                                <tbody>
                                    <tr>
                                        <td>OBJETIVO</td>
                                        <td>0</td>
                                    </tr>
                                    <tr>
                                        <td>LOGRO</td>
                                        <td>0</td>
                                    </tr>
                                    <tr>
                                        <td>FALTA</td>
                                        <td>0</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">

                            <h5 class="text-base negrita">GOLES</h5>
                            <table class="table table-responsive h-full col-12">
                                <tbody>
                                    <tr>
                                        <td>OBJETIVO</td>
                                        <td>0</td>
                                    </tr>
                                    <tr>
                                        <td>LOGRO</td>
                                        <td>0</td>
                                    </tr>
                                    <tr>
                                        <td>FALTA</td>
                                        <td>0</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                      
                    </div>

                </div>
            </div>
            `
        },
        frag_logro_marcas:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">
                    <div class="table-responsive col-12">
                        <table class="table table-responsive table-hover col-12">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>MARCA</td>
                                    <td>OBJETIVO</td>
                                    <td>VENTA</td>
                                    <td>DEVOLUCION</td>
                                    <td>VENTA NETA</td>
                                    <td>FALTA</td>
                                    <td>ALCANCE</td>
                                </tr>
                            </thead>
                            <tbody id="tbl_data_logro">
                            </tbody>
                             
                            <tfoot class="bg-base text-white">
                                <tr>
                                    <td></td>
                                    <td id="lbTotalObjetivo"></td>
                                    <td id="lbTotalVenta"></td>
                                    <td id="lbTotalDevolucion"></td>
                                    <td id="lbTotalVentaNeta"></td>
                                    <td id="lbTotalFalta"></td>
                                    <td id="lbTotalObjetivoPorcentaje"></td>
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

        document.getElementById('cmbDiasLaborales').innerHTML = F.get_combo_dias_30();
        document.getElementById('cmbDiasTrabajados').innerHTML = F.get_combo_dias_30();
        

        let cmbMes = document.getElementById('cmbMes');
        cmbMes.innerHTML = F.ComboMeses(); cmbMes.value= F.get_mes_curso();

        cmbMes.addEventListener('change',()=>{
            tbl_rpt_logro();
        });

        let cmbAnio = document.getElementById('cmbAnio');
        cmbAnio.innerHTML = F.ComboAnio(); cmbAnio.value = F.get_anio_curso();

        cmbAnio.addEventListener('change',()=>{
            tbl_rpt_logro();
        });

        let cmbSucursal = document.getElementById('cmbSucursal');

        GF.get_data_empresas()
        .then((data)=>{
            let str = '';
            data.recordset.map((r)=>{
                str += `<option value='${r.EMPNIT}'>${r.NOMBRE}</option>`
            })
            cmbSucursal.innerHTML = str;

            if(Number(GlobalNivelUsuario)==1){
            }else{
                cmbSucursal.value = GlobalEmpnit;
                cmbSucursal.disabled = true;
            };

            tbl_rpt_logro();
        })
        .catch(()=>{
            cmbSucursal.innerHTML = `<option value=''>NO SE CARGARON</option>`
        })




};

function initView(){

    getView();
    addListeners();

};



function tbl_rpt_logro(){


        let container = document.getElementById('tbl_data_logro');
        container.innerHTML = GlobalLoader;

        let sucursal = document.getElementById('cmbSucursal').value;
        let mes = document.getElementById('cmbMes').value;
        let anio = document.getElementById('cmbAnio').value;
        let codemp = GlobalCodUsuario;

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
                let alcance = (Number(neto)/Number(objetivo))*100;

                conteomarcas += 1;
                varTotalObjetivo += Number(objetivo);
                varTotalVenta += Number(r.VENTA);
                varTotalDevolucion += Number(r.DEVOLUCION);
                varTotalNeto += Number(neto);
                varTotalFalta += Number(falta);
                varTotalAlcance += Number(alcance);

                str += `
                <tr>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                    <td>${F.setMoneda(r.VENTA,'Q')}</td>
                    <td>${F.setMoneda(r.DEVOLUCION,'Q')}</td>
                    <td>${F.setMoneda(neto,'Q')}</td>
                    <td>${F.setMoneda(falta,'Q')}</td>
                    <td>${alcance.toFixed(2)} %</td>
                </tr>
                `;

            })
            container.innerHTML = str;

            document.getElementById('lbTotalObjetivo').innerHTML = F.setMoneda(varTotalObjetivo,'Q');
            document.getElementById('lbTotalVenta').innerHTML = F.setMoneda(varTotalVenta,'Q');
            document.getElementById('lbTotalDevolucion').innerHTML = F.setMoneda(varTotalDevolucion,'Q');
            document.getElementById('lbTotalVentaNeta').innerHTML = F.setMoneda(varTotalNeto,'Q');
            document.getElementById('lbTotalFalta').innerHTML = F.setMoneda(varTotalFalta,'Q');
            document.getElementById('lbTotalObjetivoPorcentaje').innerHTML = `${(varTotalAlcance/conteomarcas).toFixed(2)} %`


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
