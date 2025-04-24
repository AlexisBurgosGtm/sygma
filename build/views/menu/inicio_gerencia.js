function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            
                            <div class="row">
                                <div class="col-4">
                                    ${view.parametros()}
                                </div>
                                <div class="col-4">
                                    ${view.vista_grafica_dos()}
                                </div>
                                <div class="col-4">
                                    ${view.vista_grafica_tres()}
                                </div>
                            </div>
                            <br>
                            
                            <div class="row">
                                <div class="col-sm-12 col-md-8 col-lg-8 col-xl-8">
                                    ${view.vista_lista_fechas()}
                                </div>
                                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                    ${view.vista_lista_fechas_compras()}
                                </div>
                               
                            </div>
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
        vista_lista_fechas:()=>{
            return `
            <div class="card card-rounded col-12 p-2">
                <div class="card-body">
                    <h5 class="negrita text-base">Ventas por Fechas</h5>
                    <br>
                    <div class="table-responsive col-12">
                        <table class="table table-responsive col-12 h-full" id="tblFechas">
                            <thead class="bg-base text-white negrita">
                                <tr>
                                    <td>FECHA</td>
                                    <td>TOTAL COSTO</td>
                                    <td>TOTAL VENTA</td>
                                    <td>UTILIDAD</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataFechas">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            
            `
        },
        vista_lista_fechas_compras:()=>{
            return `
            <div class="card card-rounded col-12 p-2">
                <div class="card-body">
                

                    <h5 class="negrita text-info">Compras por Fechas</h5>
                    <br>
                    <div class="table-responsive col-12">
                        <table class="table table-responsive col-12 h-full" id="tblFechasC">
                            <thead class="bg-info text-white negrita">
                                <tr>
                                    <td>FECHA</td>
                                    <td>TOTAL COSTO</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataFechasC">
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>

           
            `
        },
        vista_lista_productos:()=>{
            return `
            <div class="table-responsive col-12">
                <table class="table table-responsive col-12" id="tblProductos">
                    <thead class="bg-personal text-warning negrita">
                        <tr>
                            <td>PRODUCTO</td>
                            <td>UNIDADES</td>
                            <td>TOTAL COSTO</td>
                            <td>TOTAL VENTA</td>
                            <td>UTILIDAD</td>
                        </tr>
                    </thead>
                    <tbody id="tblDataProductos">
                    </tbody>
                </table>
            </div>
            `
        },
        parametros:()=>{
            return `
            <div class="card card-rounded shadow hand col-12 border-personal">
                <div class="card-body">
                    <div class="form-group">
                        <label>Seleccione mes y año</label>
                        <select class="form-control negrita" id="cmbEmpresa">
                        </select>

                        <div class="input-group"> 
                            <select class="form-control negrita border-personal text-personal" id="cmbMes"></select>
                            <select class="form-control negrita border-personal text-personal" id="cmbAnio"></select>
                        </div>
                    </div>
                </div>
            </div>
            `
        },
        vista_grafica_dos:()=>{
            return `
            <div class="card card-rounded shadow hand col-12 border-personal">
                <div class="card-body">
                    <h5 class="text-personal negrita">VENTAS</h5>
                    <small class="negrita">Total Costo:</small>
                    <label id="lbTotalCosto" class="text-secondary negrita"></label>
                    <br>
                    <small class="negrita">Total Venta:</small>
                    <label id="lbTotalVenta" class="text-success negrita"></label>
                    <br>
                    <small class="negrita">Utilidad:</small>
                    <label id="lbTotalUtilidad" class="text-danger negrita"></label>
                </div>
            </div>
            `
        },
        vista_grafica_tres:()=>{
            return `
            <div class="card card-rounded shadow hand col-12 border-info">
                <div class="card-body">
                    <h5 class="text-info negrita">COMPRAS</h5>
                    <small class="negrita">Total Costo:</small>
                    <label id="lbTotalCostoC" class="text-secondary negrita"></label>
                    <br>
                    <small class="negrita">Total Venta:</small>
                    <label id="lbTotalVentaC" class="text-success negrita"></label>
                    <br>
                    <small class="negrita">Utilidad:</small>
                    <label id="lbTotalUtilidadC" class="text-danger negrita"></label>
                </div>
            </div>
            `
        }
    }

    root.innerHTML = view.body();

};


function addListeners(){

   
    document.title = `Gerencia`;


    let f = new Date();

    let mes = document.getElementById('cmbMes');
    let anio = document.getElementById('cmbAnio');
    mes.innerHTML = F.ComboMeses();
    anio.innerHTML = F.ComboAnio();

    mes.value = f.getMonth()+1;
    anio.value = f.getFullYear();

    let cmbEmpresa = document.getElementById('cmbEmpresa');

    GF.get_data_empresas()
    .then((data)=>{
            let str = '<option value="%">TODAS LAS SEDES</option>';
            data.recordset.map((r)=>{
                str += `
                    <option value="${r.EMPNIT}">${r.NOMBRE}</option>
                `
            })
            cmbEmpresa.innerHTML = str;

            get_rpt_fechas();
            get_rpt_fechas_compras();
            //get_rpt_productos();
        
           
    })
    .catch(()=>{
        cmbEmpresa.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
    })


    cmbEmpresa.addEventListener('change',()=>{
        try {
            get_rpt_fechas();
            get_rpt_fechas_compras();
            //get_rpt_productos();
        } catch (error) {
            
        }
    })

    mes.addEventListener('change',()=>{
        try {
            get_rpt_fechas();
            get_rpt_fechas_compras();
            //get_rpt_productos();
        } catch (error) {
            
        }
    })

    anio.addEventListener('change',()=>{
        try {
            get_rpt_fechas();
            get_rpt_fechas_compras();
            //get_rpt_productos();
        } catch (error) {
            
        }
    })
 
   
};

function initView(){

    getView();
    addListeners();

};



function get_rpt_fechas(){
    
    let varTotalCosto = 0;
    let varTotalVenta = 0;
    let varTotalUtilidad = 0;

    let anio = document.getElementById('cmbAnio').value;
    let mes = document.getElementById('cmbMes').value;

    let cmbEmpresa = document.getElementById('cmbEmpresa');


    let container = document.getElementById('tblDataFechas')
    container.innerHTML = GlobalLoader;


    let data = {sucursal:cmbEmpresa.value,
                token:TOKEN,
                anio:anio,
                mes:mes}

    GF.get_data_qry('/reportes/rpt_ventas_fechas',data)
    .then((datos)=>{
        let str = '';
        datos.recordset.map((r)=>{
            
            varTotalCosto += Number(r.COSTO);
            varTotalVenta += Number(r.VENTA);
            varTotalUtilidad += Number(r.UTILIDAD);

            let margen = F.setMoneda((Number(r.UTILIDAD)/Number(r.VENTA))*100,'')
            str += `
            <tr>
                <td>${F.convertDateNormal(r.FECHA)}</td>
                <td>${F.setMoneda(r.COSTO,'Q')}</td>
                <td>${F.setMoneda(r.VENTA,'Q')}</td>
                <td>${F.setMoneda(r.UTILIDAD,'Q')} <small class="text-danger">(${margen})%</small></td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalCosto').innerText = F.setMoneda(varTotalCosto,'Q');
        document.getElementById('lbTotalVenta').innerText = F.setMoneda(varTotalVenta,'Q');
        let margen = F.setMoneda((Number(varTotalUtilidad)/Number(varTotalVenta))*100,'')
        document.getElementById('lbTotalUtilidad').innerText = `${F.setMoneda(varTotalUtilidad,'Q')} (${margen}%)`;
    })
    .catch((error)=>{
        console.log(error);
        document.getElementById('lbTotalCosto').innerText = '---';
        document.getElementById('lbTotalVenta').innerText = '---';
        document.getElementById('lbTotalUtilidad').innerText = '---';
        container.innerHTML = 'No hay datos para mostrar...';
    })


};

function get_rpt_fechas_compras(){
    
    let varTotalCosto = 0;
    let varTotalVenta = 0;
    let varTotalUtilidad = 0;

    let anio = document.getElementById('cmbAnio').value;
    let mes = document.getElementById('cmbMes').value;
    let cmbEmpresa = document.getElementById('cmbEmpresa');
    

    let container = document.getElementById('tblDataFechasC')
    container.innerHTML = GlobalLoader;

    let data = {sucursal:cmbEmpresa.value,
                token:TOKEN,
                anio:anio,
                mes:mes}

    GF.get_data_qry('/reportes/rpt_ventas_fechas_compras',data)
    .then((datos)=>{
        let str = '';
        datos.recordset.map((r)=>{
            
            varTotalCosto += Number(r.COSTO);
            varTotalVenta += Number(r.VENTA);
            varTotalUtilidad += Number(r.UTILIDAD);

            let margen = F.setMoneda((Number(r.UTILIDAD)/Number(r.VENTA))*100,'')
            str += `
            <tr>
                <td>${F.convertDateNormal(r.FECHA)}</td>
                <td>${F.setMoneda(r.COSTO,'Q')}</td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalCostoC').innerText = F.setMoneda(varTotalCosto,'Q');
        document.getElementById('lbTotalVentaC').innerText = F.setMoneda(varTotalVenta,'Q');
        let margen = F.setMoneda((Number(varTotalUtilidad)/Number(varTotalVenta))*100,'')
        document.getElementById('lbTotalUtilidadC').innerText = `${F.setMoneda(varTotalUtilidad,'Q')} (${margen}%)`;
    })
    .catch((error)=>{
        console.log(error);
        document.getElementById('lbTotalCostoC').innerText = '---';
        document.getElementById('lbTotalVentaC').innerText = '---';
        document.getElementById('lbTotalUtilidadC').innerText = '---';
        container.innerHTML = 'No hay datos para mostrar...';
    })


};

function get_rpt_productos(){
    
    let anio = document.getElementById('cmbAnio').value;
    let mes = document.getElementById('cmbMes').value;
    let cmbEmpresa = document.getElementById('cmbEmpresa');
    

    let container = document.getElementById('tblDataProductos')
    container.innerHTML = GlobalLoader;

    let data = {sucursal:cmbEmpresa.value,
                token:TOKEN,
                anio:anio,
                mes:mes}

    GF.get_data_qry('/reportes/rpt_ventas_productos',data)
    .then((datos)=>{
        let str = '';
        datos.recordset.map((r)=>{
            
            let margen = F.setMoneda(((Number(r.VENTA)-Number(r.COSTO))/Number(r.VENTA))*100,'')
            str += `
            <tr>
                <td>${r.DESPROD}</td>
                <td>${r.UNIDADES}</td>
                <td>${F.setMoneda(r.COSTO,'Q')}</td>
                <td>${F.setMoneda(r.VENTA,'Q')}</td>
                <td>${F.setMoneda(Number(r.VENTA)-Number(r.COSTO),'Q')} <small class="text-danger">(${margen})%</small></td>
            </tr>
            `
        })
        container.innerHTML = str;
    })
    .catch((error)=>{
        container.innerHTML = 'No hay datos para mostrar...';
    })


};