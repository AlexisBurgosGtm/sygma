
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white calculos-cargas-page">
                    <div class="row mb-3">
                        <div class="col-12">
                            <div class="card card-rounded shadow calculos-cargas-header">
                                <div class="card-body py-3 px-3">
                                    <div class="row align-items-end">
                                        <div class="col-12 col-md-8 mb-2 mb-md-0">
                                            <h5 class="negrita text-danger mb-0">CARGAS DEL MES</h5>
                                        </div>
                                        <div class="col-12 col-md-4">
                                            <div class="form-group mb-0">
                                                <label class="text-secondary small mb-1">Sucursal</label>
                                                <select class="form-control form-control-sm negrita text-secondary" id="cmbCargasSucursal">
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 col-md-6 col-lg-4 mb-3">
                            ${view.card_sellout()}
                        </div>
                        <div class="col-12 col-md-6 col-lg-4 mb-3">
                            ${view.card_obj_skus()}
                        </div>
                    </div>
                </div>

                <div id="cargasMesBusy" class="calculos-cargas-overlay hidden" aria-hidden="true">
                    ${typeof GlobalLoader !== 'undefined' ? GlobalLoader : '<div class="text-center text-white">Cargando...</div>'}
                </div>
            `
        },
        card_sellout:()=>{
            return `
                <div class="card card-rounded shadow col-12 proveedor-sellout-card calculos-cargas-card">
                    <div class="card-body">
                        <div class="proveedor-sellout-card__header mb-2">
                            <span class="proveedor-sellout-card__icon">
                                <i class="fal fa-chart-line"></i>
                            </span>
                            <div>
                                <h5 class="negrita mb-0">Promedio SellOut</h5>
                                <small class="text-muted">Configuración de promedio SellOut</small>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-4">
                                <div class="form-group mb-2">
                                    <label class="text-secondary">Mes inicial</label>
                                    <select class="form-control form-control-sm negrita" id="cmbSOMesInicial">
                                    </select>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group mb-2">
                                    <label class="text-secondary">Mes final</label>
                                    <select class="form-control form-control-sm negrita" id="cmbSOMesFinal">
                                    </select>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group mb-2">
                                    <label class="text-secondary">Año</label>
                                    <select class="form-control form-control-sm negrita" id="cmbSOAnio">
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-2">
                            <label class="text-secondary">Ultimo SellOut generado</label>
                            <input type="text" class="form-control form-control-sm negrita" id="txtSOObs" disabled="true">
                        </div>

                        <div class="text-right">
                            <button class="btn btn-info btn-circle hand shadow" id="btnConfigSellout" title="Generar SellOut">
                                <i class="fal fa-save"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `
        },
        card_obj_skus:()=>{
            return `
                <div class="card card-rounded shadow col-12 calculos-skus-card calculos-cargas-card">
                    <div class="card-body">
                        <div class="calculos-skus-card__header mb-2">
                            <span class="calculos-skus-card__icon">
                                <i class="fal fa-boxes"></i>
                            </span>
                            <div>
                                <h5 class="negrita mb-0">Objetivos skus cliente</h5>
                                <small class="text-muted">Promedio de SKUs y compra por cliente</small>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-4">
                                <div class="form-group mb-2">
                                    <label class="text-secondary">Mes inicial</label>
                                    <select class="form-control form-control-sm negrita" id="cmbCargasSkuMesInicial">
                                    </select>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group mb-2">
                                    <label class="text-secondary">Mes final</label>
                                    <select class="form-control form-control-sm negrita" id="cmbCargasSkuMesFinal">
                                    </select>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group mb-2">
                                    <label class="text-secondary">Año</label>
                                    <select class="form-control form-control-sm negrita" id="cmbCargasSkuAnio">
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button type="button" class="btn btn-info btn-md hand shadow w-100" id="btnCargasObjSkus">
                            <i class="fal fa-calculator mr-1"></i> Calcular
                        </button>
                    </div>
                </div>
            `
        }
    };

    root.innerHTML = view.body();
};

function addListeners(){

    document.getElementById('cmbSOMesInicial').innerHTML = F.ComboMeses();
    document.getElementById('cmbSOMesInicial').value = F.get_mes_curso();
    document.getElementById('cmbSOMesFinal').innerHTML = F.ComboMeses();
    document.getElementById('cmbSOMesFinal').value = F.get_mes_curso();
    document.getElementById('cmbSOAnio').innerHTML = F.ComboAnio();
    document.getElementById('cmbSOAnio').value = F.get_anio_curso();

    document.getElementById('cmbCargasSkuMesInicial').innerHTML = F.ComboMeses();
    document.getElementById('cmbCargasSkuMesInicial').value = F.get_mes_curso();
    document.getElementById('cmbCargasSkuMesFinal').innerHTML = F.ComboMeses();
    document.getElementById('cmbCargasSkuMesFinal').value = F.get_mes_curso();
    document.getElementById('cmbCargasSkuAnio').innerHTML = F.ComboAnio();
    document.getElementById('cmbCargasSkuAnio').value = F.get_anio_curso();

    cargas_get_config_obs_sellout();

    let cmbSucursal = document.getElementById('cmbCargasSucursal');
    GF.get_data_empresas()
        .then((data)=>{
            let str = `<option value="%">TODAS LAS SUCURSALES</option>`;
            data.recordset.map((r)=>{
                str += `<option value="${r.EMPNIT}">${r.NOMBRE}</option>`
            })
            cmbSucursal.innerHTML = str;
            if(GlobalEmpnit){
                cmbSucursal.value = GlobalEmpnit;
            }
        })
        .catch(()=>{
            cmbSucursal.innerHTML = `<option value="%">TODAS LAS SUCURSALES</option>`
        })

    document.getElementById('cmbSOAnio').addEventListener('change',()=>{
        cargas_get_config_obs_sellout();
    });
    document.getElementById('cmbSOMesInicial').addEventListener('change',()=>{
        cargas_get_config_obs_sellout();
    });
    document.getElementById('cmbSOMesFinal').addEventListener('change',()=>{
        cargas_get_config_obs_sellout();
    });

    let btnConfigSellout = document.getElementById('btnConfigSellout');
    btnConfigSellout.addEventListener('click',()=>{

        let sucursalSO = cargas_getSucursal();
        if(!sucursalSO){
            F.AvisoError('Seleccione una sede para configurar SELLOUT');
            return;
        }

        let mi = Number(document.getElementById('cmbSOMesInicial').value);
        let mf = Number(document.getElementById('cmbSOMesFinal').value);
        if(mi > mf){
            F.AvisoError('El mes inicial no puede ser mayor al mes final');
            return;
        }

        F.Confirmacion('¿Esta seguro que desea GENERAR el SellOut con estos parametros?')
        .then((value)=>{
            if(value==true){

                let anio = document.getElementById('cmbSOAnio').value;
                let obs = document.getElementById('txtSOObs').value;

                btnConfigSellout.disabled = true;
                btnConfigSellout.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                GF.get_data_inventarios_sellout_config(sucursalSO,mi,mf,anio,obs)
                .then(()=>{

                    F.Aviso('SellOut establecido exitosamente!!');

                    btnConfigSellout.disabled = false;
                    btnConfigSellout.innerHTML = `<i class="fal fa-save"></i>`;

                })
                .catch(()=>{

                    F.AvisoError('No se pudo generar el SellOut');
                    btnConfigSellout.disabled = false;
                    btnConfigSellout.innerHTML = `<i class="fal fa-save"></i>`;

                })

            }
        })

    });

    let btnCargasObjSkus = document.getElementById('btnCargasObjSkus');
    btnCargasObjSkus.addEventListener('click',()=>{

        let sucursal = cargas_getSucursal();
        if(!sucursal){
            F.AvisoError('Seleccione una sede para calcular objetivos');
            return;
        }

        let mi = Number(document.getElementById('cmbCargasSkuMesInicial').value);
        let mf = Number(document.getElementById('cmbCargasSkuMesFinal').value);
        let anio = document.getElementById('cmbCargasSkuAnio').value;
        if(mi > mf){
            F.AvisoError('El mes inicial no puede ser mayor al mes final');
            return;
        }

        F.Confirmacion('¿Está seguro que desea CALCULAR los objetivos de SKUs y compra por cliente?')
        .then((value)=>{
            if(value==true){

                cargas_setBusy(true);
                btnCargasObjSkus.disabled = true;
                btnCargasObjSkus.innerHTML = `<i class="fal fa-spinner fa-spin mr-1"></i> Calculando...`;

                GF.get_data_clientes_obj_skus_compra(sucursal, mi, mf, anio)
                .then(()=>{

                    F.Aviso('Objetivos de SKUs y compra actualizados');
                    cargas_setBusy(false);
                    btnCargasObjSkus.disabled = false;
                    btnCargasObjSkus.innerHTML = `<i class="fal fa-calculator mr-1"></i> Calcular`;

                })
                .catch(()=>{

                    F.AvisoError('No se pudieron actualizar los objetivos de SKUs');
                    cargas_setBusy(false);
                    btnCargasObjSkus.disabled = false;
                    btnCargasObjSkus.innerHTML = `<i class="fal fa-calculator mr-1"></i> Calcular`;

                })

            }
        })

    });

};

function cargas_getSucursal(){
    let cmb = document.getElementById('cmbCargasSucursal');
    return cmb ? cmb.value : '';
};

function cargas_get_config_obs_sellout(){

    let mes_inicial = document.getElementById('cmbSOMesInicial').value;
    let mes_final = document.getElementById('cmbSOMesFinal').value;
    let anio = document.getElementById('cmbSOAnio').value;

    document.getElementById('txtSOObs').value = `Sellout del mes ${mes_inicial} al mes ${mes_final} del año ${anio}`;

};

function cargas_setBusy(busy){
    let overlay = document.getElementById('cargasMesBusy');
    if(!overlay){ return; }
    if(busy){
        overlay.classList.remove('hidden');
        overlay.setAttribute('aria-hidden','false');
    }else{
        overlay.classList.add('hidden');
        overlay.setAttribute('aria-hidden','true');
    }
};

function initView(){
    getView();
    addListeners();
};
