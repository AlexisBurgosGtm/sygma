function getView(){
    let view = {
        body:()=>{
            return `
                <div class="row">
                    <div class="col-sm-6 col-lg-3 col-xl-3 col-md-3">
                        ${view.parametros()}
                    </div>
                    <div class="col-sm-6 col-lg-3 col-xl-3 col-md-3">
                       ${view.menu_objetivos()}
                    </div>
                    <div class="col-sm-6 col-lg-3 col-xl-3 col-md-3">
                      
                         ${view.menu_ventas()}
                    </div>
                    <div class="col-sm-6 col-lg-3 col-xl-3 col-md-3">
                        ${view.menu_inventarios()}
                    </div>
                </div>
                <br>

                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.tab_objetivos()}
                        </div>                        
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                                                                                   
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.tab_inventario()}
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
               
            `
        },
        tab_inicio:()=>{
            return `
                <div class="row">
                    <div class="col-sm-12 col-md-8 col-lg-8 col-xl-8">
                        ${view.vista_lista_fechas()}
                    </div>
                    <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        ${view.vista_lista_fechas_compras()}
                    </div>       
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
                    <thead class="bg-base text-warning negrita">
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
            <div class="card card-rounded shadow hand col-12 border-base">
                <div class="card-body">
                    <div class="form-group">
                        <label class="text-secondary">Seleccione mes y año</label>
                        <select class="form-control negrita text-danger" id="cmbSucursal">
                        </select>

                        <div class="input-group"> 
                            <select class="form-control negrita border-base text-base" id="cmbMes"></select>
                            <select class="form-control negrita border-base text-base" id="cmbAnio"></select>
                        </div>
                    </div>
                </div>
            </div>
            `
        },
        menu_ventas:()=>{
            return `
            <div class="card card-rounded shadow hand col-12 border-success">
                <div class="card-body">
                    <h5 class="text-success negrita">VENTAS</h5>
                    <small class="negrita  text-secondary">Total Costo:</small>
                    <label id="lbTotalCosto" class="text-secondary negrita"></label>
                    <br>
                    <small class="negrita text-secondary">Total Venta:</small>
                    <label id="lbTotalVenta" class="text-success negrita"></label>
                    <br>
                    <small class="negrita text-secondary">Utilidad:</small>
                    <label id="lbTotalUtilidad" class="text-danger negrita"></label>
                </div>
            </div>
            `
        },
        menu_objetivos:()=>{
            return `
            <div class="card card-rounded shadow hand col-12 border-info" id="btnMenuObjetivos">
                <div class="card-body">
                    <h5 class="text-info negrita">Objetivos</h5>
                    <small class="negrita text-secondary">Logrado:</small>
                    <div id="lbObjLogrado"></div>
                    <br>
                    <small class="negrita text-secondary">Faltan:</small>
                    <div id="lbObjLogradoFalta"></div>
                </div>
            </div>
            `
        },
        menu_inventarios:()=>{
            return `
            <div class="card card-rounded shadow hand col-12 border-base" id="btnMenuInventarios">
                <div class="card-body">
                    <h5 class="text-base negrita">INVENTARIOS</h5>
                    <small class="negrita text-secondary">Total Costo:</small>
                    <label id="lbTotalCostoI" class="text-secondary negrita"></label>
                    <br>
                    <small class="negrita text-secondary">Total Items:</small>
                    <label id="lbTotalItemsI" class="text-success negrita"></label>
                   
                </div>
            </div>
            `
        },
        tab_inventario:()=>{
              return `
            <div class="card card-rounded shadow">
                <div class="card-body p-4">
                    
                    <h3 class="negrita text-danger">INVENTARIO ACTUAL</h3>

                    <div class="row">
                        <div class="col-sm-6 col-md-8 col-lg-8 col-xl-8">
                            <div class="input-group">
                                <select class="form-control negrita text-base" id="cmbSt">
                                    <option value="SI">PRODUCTOS HABILITADOS</option>
                                    <option value="NO">PRODUCTOS NO HABILITADOS</option>
                                </select>
                                <input type="text" class="form-control" placeholder="Escriba para buscar..." id="txtBuscarProductoInventario" oninput="F.FiltrarTabla('tblInventario','txtBuscarProductoInventario')">

                            </div>

                            
                        </div>
                        
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <button class="btn btn-success btn-md hand shadow" id="btnExportarInventario">
                                <i class="fal fa-share"></i> Exportar Excel
                            </button>
                        </div>
                    </div>

                    <br>

                    <div class="table-responsive col-12">
                        <table class="table h-full table-hover col-12" id="tblInventario">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>CODIGO</td>
                                    <td>CODIGO 2</td>
                                    <td>CODIGO 3</td>
                                    <td>PRODUCTO</td>
                                    <td>MARCA</td>
                                    <td>EXISTENCIA (CAJAS)</td>
                                    <td>TOTALCOSTO</td>
                                    <td>SELLOUT</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataInventario">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        tab_objetivos:()=>{
           return `
         
            <div class="row">
                <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                    ${view.frag_marcas()}
                </div>
                <div class="col-sm-12 col-xl-6 col-lg-6 col-md-6">
                    ${view.frag_vendedores()}
                </div>
            </div>

        

            ${view.modal_categorias_marca()}
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
                            <tbody id="tblDataMarcas2">
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
                            <tbody id="tblDataVendedores2">
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
        modal_categorias_marca:()=>{
            return `
              <div id="modal_categorias_marca" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="lbMarcasDescategoria">
                                
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                    <div class="table-responsive">
                                        <table class="table table-bordered h-full col-12">
                                            <thead class="bg-base text-white"> 
                                                <tr>
                                                    <td>CATEGORIA</td>
                                                    <td>OBJETIVO</td>
                                                    <td>LOGRO</td>
                                                    <td>FALTAN</td>
                                                    <td></td>
                                                </tr>
                                            </thead>
                                            <tbody id="tblDataCategoriasMarca"></tbody>
                                        </table>
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
        }
    }

    root.innerHTML = view.body();

};


function addListeners(){

    F.slideAnimationTabs();
   
    document.title = `Gerencia`;

    selected_tab = 'OBJETIVOS';

    let f = new Date();

    let mes = document.getElementById('cmbMes');
    let anio = document.getElementById('cmbAnio');
    mes.innerHTML = F.ComboMeses();
    anio.innerHTML = F.ComboAnio();

    mes.value = f.getMonth()+1;
    anio.value = f.getFullYear();

    let cmbSucursal = document.getElementById('cmbSucursal');

    GF.get_data_empresas()
    .then((data)=>{
            let str = '<option value="%">TODAS LAS SEDES</option>';
            data.recordset.map((r)=>{
                str += `
                    <option value="${r.EMPNIT}">${r.NOMBRE}</option>
                `
            })
            cmbSucursal.innerHTML = str;

            get_grid();
           
    })
    .catch(()=>{
        cmbSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
    })


    cmbSucursal.addEventListener('change',()=>{
        try {
           
            get_grid();

        } catch (error) {
            
        }
    })

    mes.addEventListener('change',()=>{
        try {
       
            get_grid();

        } catch (error) {
            
        }
    })

    anio.addEventListener('change',()=>{
        try {

           get_grid();

        } catch (error) {
            
        }
    })
 


    listeners_objetivos();
    listeners_inventario();



   
};

function get_grid(){

    switch (selected_tab) {
        case 'OBJETIVOS':
            
            get_reportes();
            break;
    
        case '':
            
            break;
    
        case 'INVENTARIOS':
            tbl_inventario();
            break;

        case '':
            
            break;
    
    
    }
};

function listeners_objetivos(){

    
    

     document.getElementById('btnMenuObjetivos').addEventListener('click',()=>{

        document.getElementById('tab-uno').click();

        selected_tab = 'OBJETIVOS';
        
        
        get_reportes();
    });


};


function listeners_inventario(){
    
    
    document.getElementById('btnMenuInventarios').addEventListener('click',()=>{

        document.getElementById('tab-tres').click();

        selected_tab = 'INVENTARIOS';
        
        tbl_inventario();
    });

    
    document.getElementById('btnExportarInventario').addEventListener('click',()=>{
        F.exportTableToExcel('tblInventario','Inventario');
    });

   


    document.getElementById('cmbSt').addEventListener('change',()=>{
        tbl_inventario();
    });

}

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

    let cmbSucursal = document.getElementById('cmbSucursal');


    let container = document.getElementById('tblDataFechas')
    container.innerHTML = GlobalLoader;


    let data = {sucursal:cmbSucursal.value,
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
    let cmbSucursal = document.getElementById('cmbSucursal');
    

    let container = document.getElementById('tblDataFechasC')
    container.innerHTML = GlobalLoader;

    let data = {sucursal:cmbSucursal.value,
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
    let cmbSucursal = document.getElementById('cmbSucursal');
    

    let container = document.getElementById('tblDataProductos')
    container.innerHTML = GlobalLoader;

    let data = {sucursal:cmbSucursal.value,
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




function tbl_inventario(){

    let container = document.getElementById('tblDataInventario');
    container.innerHTML = GlobalLoader;

    let st = document.getElementById('cmbSt').value;

    let sucursal = document.getElementById('cmbSucursal').value;


    let varTotalItems =0; let varTotalCosto = 0;

    GF.get_data_inventarios_general(sucursal,st)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            varTotalItems +=1;
            varTotalCosto += Number(r.TOTALCOSTO)
            str += `
            <tr>
                <td>${r.CODPROD}</td>
                <td>${r.CODPROD2}</td>
                <td>${r.DESPROD3}</td>
                <td>${r.DESPROD}</td>
                <td>${r.DESMARCA}</td>
                <td>${F.get_existencia(Number(r.TOTALUNIDADES),Number(r.UXC)).toFixed(2)}</td>
                <td>${ F.setMoneda(r.TOTALCOSTO,'Q')}</td>
                <td>${F.get_existencia(Number(r.SELLOUT),Number(r.UXC)).toFixed(2)}</td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalCostoI').innerText = F.setMoneda(varTotalCosto,'Q');
        document.getElementById('lbTotalItemsI').innerText = varTotalItems;

        //F.initit_datatable('tblInventario', true);

    })
    .catch(()=>{
        document.getElementById('lbTotalCostoI').innerText = '';
        document.getElementById('lbTotalItemsI').innerText = '';
        container.innerHTML = 'No se cargaron datos...';
    })


    

};



// OBJETIVOS
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


    let container = document.getElementById('tblDataMarcas2');
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
            <tr class="hand" onclick="get_detalle_marca('${r.CODIGO_MARCA}','${r.MARCA}')">
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

        let logrado = 0; let faltaLogro = 0;
        try {
           logrado = (Number(varTotalImporte)/Number(varTotalObjetivo))*100;
           faltaLogro = 100-Number(logrado);
        } catch (error) {
            logrado=0;
            faltaLogro=0;   
        }
        document.getElementById('lbObjLogrado').innerHTML = `<progress value="${logrado}" max="100"></progress>`;
        document.getElementById('lbObjLogradoFalta').innerHTML = `<progress class="progress-falta" value="${faltaLogro}" max="100"></progress>`;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';

        document.getElementById('lbTotalMarcasImporte').innerHTML = '';
        document.getElementById('lbTotalMarcasObjetivo').innerHTML =''; 
        document.getElementById('lbTotalMarcasFalta').innerHTML = '';
        document.getElementById('lbTotalMarcasLogro').innerHTML = '';

        document.getElementById('lbObjLogrado').innerHTML = `<progress value="0" max="100"></progress>`;
        document.getElementById('lbObjLogradoFalta').innerHTML = `<progress class="progress-falta" value="0" max="100"></progress>`;
    
    })



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


    let container = document.getElementById('tblDataVendedores2');
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
                <td>${r.VENDEDOR}
                    <br>
                    <small class="negrita text-info">${r.EMPRESA}</small>
                </td>
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



function get_detalle_marca(codmarca,desmarca){


    $("#modal_categorias_marca").modal('show');

    document.getElementById('lbMarcasDescategoria').innerText = desmarca;
    
    tbl_logro_categorias_marca(codmarca);



}


function get_data_logro_categorias_marcas(sucursal,codmarca,mes,anio){

     return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + '/objetivos/select_logro_marcas_categorias', {
                    token:TOKEN,
                    sucursal:sucursal,
                    codmarca:codmarca,
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

function tbl_logro_categorias_marca(codmarca){

    let container = document.getElementById('tblDataCategoriasMarca');
    container.innerHTML = GlobalLoader;


    let sucursal = document.getElementById('cmbSucursal').value;
    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;



    get_data_logro_categorias_marcas(sucursal,codmarca,mes,anio)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
           
            let varLOGRO = ((Number(r.TOTALPRECIO)/Number(r.OBJETIVO))*100);
           
            str += `
            <tr>
                <td>${r.CATEGORIA}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td>${F.setMoneda((Number(r.OBJETIVO)-Number(r.TOTALPRECIO)),'Q')}</td>
                <td>${varLOGRO.toFixed(2)}%</td>
            </tr>
            `
        })
        container.innerHTML = str;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
    })


};

// OBJETIVOS