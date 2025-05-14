function getView(){
    let view = {
        body:()=>{
            return `
                ${view.frag_parametros()}
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_inicio()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           ${view.vista_detalle_marca()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_detalle_vendedor()}
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
        vista_inicio:()=>{
            return `
            <div class="row">
                <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                    ${view.frag_marcas()}
                </div>
                <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                    ${view.frag_vendedores()}
                </div>
            </div>
            
            
            `
        },
        frag_parametros: ()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                    
                    <h3 class="negrita text-danger">Logro de Objetivos</h3>

                    <div class="row">
                        <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                            <div class="form-group">
                                <label class="negrita text-secondary">Sucursal</label>
                                <select class="form-control negrita" id="cmbSucursal">
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                                <div class="form-group">
                                    <label class="negrita text-secondary">Seleccione mes y año</label>
                                    <div class="input-group">
                                        <select class="form-control negrita" id="cmbMes">
                                        </select>
                                        <select class="form-control negrita" id="cmbAnio">
                                        </select>
                                    </div>
                                    
                                </div>
                        </div>
                    </div>
                
                </div>
            </div>
            <br>
            `
        },
        frag_marcas:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">

                    <h4 class="negrita text-base text-center">LOGRO DE MARCAS</h4>

                    <div class="table-responsive col-12">
                        <table class="table h-full table-hover col-12">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>MARCA</td>
                                    <td>IMPORTE</td>
                                    <td>OBJETIVO</td>
                                    <td>FALTA</td>
                                    <td>ALCANCE</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataMarcas">
                            </tbody>
                            <tfoot class="bg-base text-white negrita">
                                <tr>
                                    <td></td>
                                    <td id="lbTotalMarcasImporte"></td>
                                    <td id="lbTotalMarcasObjetivo"></td>
                                    <td id="lbTotalMarcasFalta"></td>
                                    <td id="lbTotalMarcasLogro"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            `
        },
        frag_vendedores:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">

                    <h4 class="negrita text-secondary text-center">LOGRO DE VENDEDORES</h4>

                    <div class="table-responsive col-12">
                        <table class="table h-full table-hover col-12">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <td>VENDEDOR</td>
                                    <td>IMPORTE</td>
                                    <td>OBJETIVO</td>
                                    <td>FALTA</td>
                                    <td>ALCANCE</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataVendedores">
                            </tbody>
                            <tfoot class="bg-secondary text-white negrita">
                                <tr>
                                    <td></td>
                                    <td id="lbTotalVendedoresImporte"></td>
                                    <td id="lbTotalVendedoresObjetivo"></td>
                                    <td id="lbTotalVendedoresFalta"></td>
                                    <td id="lbTotalVendedoresLogro"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            `
        },
        vista_detalle_marca:()=>{
            return `
            




            <button class="btn btn-circle btn-bottom-l btn-secondary hand btn-xl shadow" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        vista_detalle_vendedor:()=>{
            return `
            <div class="card card-rounded col-12 shadow">
                <div class="card-body p-4">

                    <h3 class="negrita text-danger text-center" id="lbVendedorNombre"></h3>

                    <div class="table-responsive">
                        <table class="table h-full col-12 table-bordered" id="tblDetalleVendedor">
                            <thead class="bg-secondary text-white negrita" >
                                <tr>
                                    <td>MARCA</td>
                                    <td>IMPORTE</td>
                                    <td>OBJETIVO</td>
                                    <td>FALTA</td>
                                    <td>ALCANCE</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataDetalleVendedor"></tbody>
                        </table>
                    </div>
                
                </div>
            </div>
            

            <button class="btn btn-circle  btn-bottom-l btn-secondary hand btn-xl shadow" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
    }

    root.innerHTML = view.body();

};

function addListeners(){


    F.slideAnimationTabs();


    let cmbSucursal = document.getElementById('cmbSucursal');

    GF.get_data_empresas()
    .then((data)=>{

        let str = `<option value="%">TODAS</option>`;

        data.recordset.map((r)=>{
            str += `<option value="${r.EMPNIT}">${r.NOMBRE}</option>`;
        })
        cmbSucursal.innerHTML = str; 
        
        if(Number(GlobalNivelUsuario)==1){

        }else{
            cmbSucursal.value = GlobalEmpnit;
            cmbSucursal.disabled = true;
        };

        get_reportes();

    })
    .catch(()=>{
        cmbSucursal.innerHTML = `<option value="%">No se cargaron las sedes</option>`
    })



    document.getElementById('cmbMes').innerHTML = F.ComboMeses();
    document.getElementById('cmbMes').value = F.get_mes_curso();

    document.getElementById('cmbAnio').innerHTML = F.ComboAnio();
    document.getElementById('cmbAnio').value = F.get_anio_curso();



    cmbSucursal.addEventListener('change',()=>{ get_reportes(); });
    document.getElementById('cmbMes').addEventListener('change',()=>{ get_reportes(); });
    document.getElementById('cmbAnio').addEventListener('change',()=>{ get_reportes(); });


 


};

function initView(){

    getView();
    addListeners();

};


function get_reportes(){

    let sucursal = document.getElementById('cmbSucursal').value;
    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;


    tbl_logro_marcas(sucursal,mes,anio);
    
    tbl_logro_vendedores(sucursal,mes,anio);


};


function get_data_logro_marcas(sucursal,mes,anio){

     return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + '/objetivos/select_logro_marcas', {
                    token:TOKEN,
                    sucursal:sucursal,
                    mes:mes,
                    anio:anio})
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        }) 
    

};
function tbl_logro_marcas(sucursal,mes,anio){


    let container = document.getElementById('tblDataMarcas');
    container.innerHTML = GlobalLoader;

    let conteo = 0;
    let varTotalObjetivo =0; let varTotalImporte = 0; 
    let varTotalFaltan = 0; let varTotalLogro = 0;

    get_data_logro_marcas(sucursal,mes,anio)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            conteo += 1;
            let varFaltan = (Number(r.OBJETIVO) - Number(r.TOTALPRECIO));
            let varLOGRO = ((Number(r.TOTALPRECIO)/Number(r.OBJETIVO))*100);
            
            varTotalObjetivo += Number(r.OBJETIVO);
            varTotalImporte += Number(r.TOTALPRECIO);
            varTotalFaltan += Number(varFaltan);
            varTotalLogro += Number(varLOGRO);

            str += `
            <tr class="hand" onclick="get_detalle_marca('${r.CODIGO_MARCA}')">
                <td>${r.MARCA}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>${F.setMoneda(varFaltan,'Q')}</td>
                <td>${varLOGRO.toFixed(2)} %</td>
            </tr>
            `
        })
        container.innerHTML = str;


        document.getElementById('lbTotalMarcasImporte').innerHTML = F.setMoneda(varTotalImporte,'Q');
        document.getElementById('lbTotalMarcasObjetivo').innerHTML = F.setMoneda(varTotalObjetivo,'Q');
        document.getElementById('lbTotalMarcasFalta').innerHTML = F.setMoneda(varTotalFaltan,'Q');
        document.getElementById('lbTotalMarcasLogro').innerHTML = `${F.setMoneda(varTotalLogro / conteo,'')} %`

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';

        document.getElementById('lbTotalMarcasImporte').innerHTML = '';
        document.getElementById('lbTotalMarcasObjetivo').innerHTML =''; 
        document.getElementById('lbTotalMarcasFalta').innerHTML = '';
        document.getElementById('lbTotalMarcasLogro').innerHTML = '';
    })



};
function get_detalle_marca(codmarca){

    document.getElementById('tab-dos').click();




};


function get_data_logro_vendedores(sucursal,mes,anio){

     return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + '/objetivos/select_logro_vendedores', {
                    token:TOKEN,
                    sucursal:sucursal,
                    mes:mes,
                    anio:anio})
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        }) 
    

};
function tbl_logro_vendedores(sucursal,mes,anio){


    let container = document.getElementById('tblDataVendedores');
    container.innerHTML = GlobalLoader;

    let conteo = 0;
    let varTotalObjetivo =0; let varTotalImporte = 0; 
    let varTotalFaltan = 0; let varTotalLogro = 0;

    get_data_logro_vendedores(sucursal,mes,anio)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            conteo += 1;
            let varFaltan = (Number(r.OBJETIVO) - Number(r.TOTALPRECIO));
            let varLOGRO = ((Number(r.TOTALPRECIO)/Number(r.OBJETIVO))*100);
            
            varTotalObjetivo += Number(r.OBJETIVO);
            varTotalImporte += Number(r.TOTALPRECIO);
            varTotalFaltan += Number(varFaltan);
            varTotalLogro += Number(varLOGRO);

            str += `
            <tr class="hand" onclick="get_detalle_vendedor('${r.CODIGO_VENDEDOR}','${r.VENDEDOR}')">
                <td>${r.VENDEDOR}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>${F.setMoneda(varFaltan,'Q')}</td>
                <td>${varLOGRO.toFixed(2)} %</td>
            </tr>
            `
        })
        container.innerHTML = str;


        document.getElementById('lbTotalVendedoresImporte').innerHTML = F.setMoneda(varTotalImporte,'Q');
        document.getElementById('lbTotalVendedoresObjetivo').innerHTML = F.setMoneda(varTotalObjetivo,'Q');
        document.getElementById('lbTotalVendedoresFalta').innerHTML = F.setMoneda(varTotalFaltan,'Q');
        document.getElementById('lbTotalVendedoresLogro').innerHTML = `${F.setMoneda(varTotalLogro / conteo,'')} %`

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
        
        document.getElementById('lbTotalVendedoresImporte').innerHTML = '';
        document.getElementById('lbTotalVendedoresObjetivo').innerHTML =''; 
        document.getElementById('lbTotalVendedoresFalta').innerHTML = '';
        document.getElementById('lbTotalVendedoresLogro').innerHTML = '';
    })



};
function get_detalle_vendedor(codemp, nomemp){


    document.getElementById('tab-tres').click();
    
    let sucursal = document.getElementById('cmbSucursal').value;
    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;

    document.getElementById('lbVendedorNombre').innerText = nomemp;

    let container = document.getElementById('tblDataDetalleVendedor');
    container.innerHTML = GlobalLoader;


    get_data_detalle_vendedores(sucursal,mes,anio,codemp)
    .then((data)=>{
        let str = '';

        data.recordset.map((r)=>{
            let varFaltan = (Number(r.OBJETIVO)-Number(r.TOTALPRECIO));
            let varLOGRO = (Number(r.TOTALPRECIO)/Number(r.OBJETIVO)) * 100;
             str += `
            <tr>
                <td>${r.CATEGORIA}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>${F.setMoneda(varFaltan,'Q')}</td>
                <td>${varLOGRO.toFixed(2)} %</td>
            </tr>
            `
        })

        container.innerHTML = str;
    })
    .catch((error)=>{
        console.log(error)
        container.innerHTML = 'No se cargaron datos...';
    })


    
};




function get_data_detalle_vendedores(sucursal,mes,anio,codemp){

     return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + '/objetivos/select_logro_vendedores_detalle', {
                    token:TOKEN,
                    sucursal:sucursal,
                    mes:mes,
                    anio:anio,
                    codemp:codemp
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        }) 
    

};
