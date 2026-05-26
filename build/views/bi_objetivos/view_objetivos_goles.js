
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.rpt_goles()}
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
        },
        rpt_goles:()=>{
            return `
             <div class="card card-rounded col-12">
                <div class="card-body p-4">
            
                    <h4 class="negrita text-base">LOGRO DE GOLES POR MES</h4>
                    <br>
                    
                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <div class="form-group">
                                <label>Sucursal</label>
                                <select class="form-control negrita" id="cmbSucursal">
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <div class="form-group">
                                <label>Vendedor</label>
                                <select class="form-control negrita" id="cmbEmpleado">
                                </select>
                            </div>
                        </div>
                    </div>
                   
                    <br>
                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <div class="form-group">
                                <label>Seleccione Mes y Año</label>
                                <div class="input-group">
                                    <select class="form-control negrita" id="cmbMesGoles">
                                    </select>
                                    <select class="form-control negrita" id="cmbAnioGoles">
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <h5>Total Goles:</h5>
                            <h1 class="negrita text-danger" id="lbTotalGoles"></h1>
                        </div>
                    </div>

                       

                    <hr class="solid">

                    <div class="row">
                        <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                        
                            <div class="table-responsive">

                                <div class="form-group">
                                    <input type="text" class="form-control border-info text-info"
                                    id="txtBuscarGoles"
                                    placeholder="Escriba para buscar..." 
                                    oninput="F.FiltrarTabla('tblGoles','txtBuscarGoles')"
                                    >
                                </div>

                                <table class="table h-full table-hover table-bordered" id="tblGoles">
                                    <thead class="bg-primary text-white">
                                        <tr>
                                            <td>CODIGO DUN</td>
                                            <td>GOLES</td>
                                            <td>UNIVERSO</td>
                                            <td>OPORTUNIDAD</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataGoles">
                                    </tbody>
                                    <tfoot class="bg-primary text-white">
                                        <tr>
                                            <td></td>
                                            <td class="negrita" id="lbGolesListaConteo"></td>
                                            <td></td>
                                            <td class="negrita" id="lbGolesListaOportunidad"></td>
                                            <td></td>
                                        </tr>
                                    </tfoot>

                                </table>

                            </div>

                        </div>
                        <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">

                            <div class="table-responsive">

                              
                                <table class="table h-full table-hover table-bordered" id="tblGolesMarcas">
                                    <thead class="bg-secondary text-white">
                                        <tr>
                                            <td>MARCA</td>
                                            <td>GOLES</td>
                                            <td>IMPORTE</td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataGolesMarcas">
                                    </tbody>
                                     <tfoot class="bg-secondary text-white">
                                        <tr>
                                            <td></td>
                                            <td class="negrita" id="lbGolesMarcasConteo"></td>
                                            <td class="negrita" id="lbGolesMarcasImporte"></td>
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
    }

    root.innerHTML = view.body();

};

function addListeners(){

    let cmbSucursal = document.getElementById('cmbSucursal');

    GF.get_data_empresas()
    .then((data)=>{
            let str = '';
            data.recordset.map((r)=>{
                str += `
                    <option value="${r.EMPNIT}">${r.NOMBRE}</option>
                `
            })
            cmbSucursal.innerHTML = str;
            if(Number(GlobalNivelUsuario)==2){
                cmbSucursal.disabled = true;
                cmbSucursal.value = GlobalEmpnit;
            };
            if(Number(GlobalNivelUsuario)==5){
                cmbSucursal.value = GlobalEmpnit;
            };

                
                get_empleados()
                .then(()=>{
                    rpt_goles_resumen();
                })
                .catch(()=>{
                    F.AvisoError('No se cargaron los vendedores');
                });
            

            
    })
    .catch(()=>{
        cmbSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
    })


    cmbSucursal.addEventListener('change',()=>{
        try {
          
                get_empleados()
                .then(()=>{
                    rpt_goles_resumen();
                })
                .catch(()=>{
                    F.AvisoError('No se cargaron los vendedores');
                });
                
          

        } catch (error) {
            
        }
    })
    document.getElementById('cmbEmpleado').addEventListener('change',()=>{
        try {
            rpt_goles_resumen(selected_universo_clientes_sucursal);
        } catch (error) {
            
        }
    })

    document.getElementById('cmbMesGoles').innerHTML = F.ComboMeses();
    document.getElementById('cmbMesGoles').value = F.get_mes_curso();
    document.getElementById('cmbMesGoles').addEventListener('change',()=>{

        rpt_goles_resumen(selected_universo_clientes_sucursal);

    });

    document.getElementById('cmbAnioGoles').innerHTML = F.ComboAnio();
    document.getElementById('cmbAnioGoles').value = F.get_anio_curso();
    document.getElementById('cmbAnioGoles').addEventListener('change',()=>{
          
            rpt_goles_resumen(selected_universo_clientes_sucursal);
        
    });
};

function initView(){

    getView();
    addListeners();

};

function get_empleados(){

    return new Promise((resolve,reject)=>{

            let sucursal = document.getElementById('cmbSucursal').value;

            GF.get_data_empleados_tipo_emp(3,sucursal)
            .then((data)=>{
                let str = `<option value='TODOS'>TODOS</option>`;
                data.recordset.map((r)=>{
                    str += `<option value='${r.CODEMPLEADO}'>${r.NOMEMPLEADO}</option>`
                })
                document.getElementById('cmbEmpleado').innerHTML = str;
                resolve();
            })
            .catch(()=>{
                document.getElementById('cmbEmpleado').innerHTML = '';
                reject();
            })
            
    })

}


function rpt_goles_resumen(){

    let sucursal = document.getElementById('cmbSucursal').value;
    let codemp = document.getElementById('cmbEmpleado').value;
    let mes = document.getElementById('cmbMesGoles').value;
    let anio = document.getElementById('cmbAnioGoles').value;

    
    F.showToast('Cargando total universo clientes');
            

    if(codemp=='TODOS'){

            GF.get_data_universo_clientes_sucursal(sucursal)
            .then((universo)=>{
                rpt_tbl_goles_resumen(sucursal,codemp,mes,anio,universo);
                rpt_tbl_goles_resumen_marcas(sucursal,codemp,mes,anio,universo);
            })
            .catch(()=>{
                rpt_tbl_goles_resumen(sucursal,codemp,mes,anio,0);
                rpt_tbl_goles_resumen_marcas(sucursal,codemp,mes,anio,0);
            })
    }else{

            GF.get_data_universo_clientes_empleado(sucursal,codemp)
            .then((universo)=>{
                rpt_tbl_goles_resumen(sucursal,codemp,mes,anio,universo);
                rpt_tbl_goles_resumen_marcas(sucursal,codemp,mes,anio,universo);
            })
            .catch(()=>{
                rpt_tbl_goles_resumen(sucursal,codemp,mes,anio,0);
                rpt_tbl_goles_resumen_marcas(sucursal,codemp,mes,anio,0);
            })

    }


   




};
function rpt_tbl_goles_resumen(sucursal,codemp,mes,anio,universo){

    let container = document.getElementById('tblDataGoles');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;
    let varTotalOportunidad = 0;

    GF.get_data_goles_resumen_mes(sucursal,codemp,mes,anio)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            let oportunidad = (Number(universo)-Number(r.CONTEO));
            varTotal += Number(r.CONTEO);
            varTotalOportunidad += Number(oportunidad)
            str+= `
            <tr>
                <td>${r.CODPROD}</td>
                <td>${r.CONTEO}</td>
                <td>${universo}</td>
                <td>${oportunidad}</td>
                <td></td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalGoles').innerText = varTotal;
        document.getElementById('lbGolesListaConteo').innerText = varTotal;
        document.getElementById('lbGolesListaOportunidad').innerText = F.setMoneda(varTotalOportunidad,'Q');

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbTotalGoles').innerText = '';
        document.getElementById('lbGolesListaConteo').innerText = '';
        document.getElementById('lbGolesListaOportunidad').innerText = '';

    })
};
function rpt_tbl_goles_resumen_marcas(sucursal,codemp,mes,anio,universo){

    let container = document.getElementById('tblDataGolesMarcas');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;
    let varImporte = 0;

    GF.get_data_goles_marcas_resumen_mes(sucursal,codemp,mes,anio)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            varTotal += Number(r.CONTEO);
            varImporte += Number(r.IMPORTE);

            str+= `
            <tr>
                <td>${r.DESMARCA}</td>
                <td>${r.CONTEO}</td>
                <td>${F.setMoneda(r.IMPORTE,'Q')}</td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbGolesMarcasConteo').innerText = varTotal;
        document.getElementById('lbGolesMarcasImporte').innerText = F.setMoneda(varImporte,'Q');
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbGolesMarcasConteo').innerText = '';
        document.getElementById('lbGolesMarcasImporte').innerText = '';
    })
};


