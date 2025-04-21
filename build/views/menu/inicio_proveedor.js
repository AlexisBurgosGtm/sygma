function getView(){
    let view = {
        body:()=>{
            return `
            <div class="card card-rounded shadow col-12 bg-base text-white">
                <div class="card-body p-4">
                   
                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-white text-center">INICIO RELOP</h4>
                        </div>
                        <div class="col-6">
                            <select class="form-control negrita" id="cmbSucursal">
                            </select>
                        </div>
                   </div>


                </div>
            </div>
            <br>
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.menu()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           ${view.vista_vendedores()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_marcas()}
                        </div>
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_sellout()}
                        </div>
                        <div class="tab-pane fade" id="cinco" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_inventarios()}
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
        menu:()=>{
            return `
            
            <div class="row">
                <div class="col-sm-12 col-md-3 col-xl-3 col-lg-3">
                    
                    <div class="card card-rounded border-info  bg-white shadow col-12 hand" id="btnMenuVentasVendedor">
                        <div class="card-body p-4">

                            <h4 class="text-info">VENTAS POR VENDEDOR</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-users negrita text-info" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
                <div class="col-sm-12 col-md-3 col-xl-3 col-lg-3">

                    <div class="card card-rounded border-secondary  bg-white shadow col-12 hand" id="btnMenuVentasMarcas">
                        <div class="card-body p-4">

                            <h4 class="text-secondary">VENTAS POR MARCA</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-box negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
                <div class="col-sm-12 col-md-3 col-xl-3 col-lg-3">
                
                    <div class="card card-rounded border-success  bg-white shadow col-12 hand" id="btnMenuVentasSellout">
                        <div class="card-body p-4">

                            <h4 class="text-success">SELL OUT</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-chart-pie negrita text-success" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                
                </div>

                <div class="col-sm-12 col-md-3 col-xl-3 col-lg-3">

                    <div class="card card-rounded   bg-white shadow col-12 hand" id="btnMenuRptInventario">
                        <div class="card-body p-4">

                            <h4 class="">INVENTARIO</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-warehouse negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
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
        },
        vista_vendedores:()=>{
            return `
             <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                   
                    <h3 class="negrita text-center text-info">VENTAS POR VENDEDOR</h3>

                    <br>
                    <div class="row">
                        <div class="col-sm-12 col-md-8 col-lg-8 col-xl-8">
                            
                            <div class="form-group">
                                <label class="negrita">Seleccione mes y año</label>
                                
                                <div class="input-group">
                                    <select class="negrita form-control" id="cmbVMes">
                                    </select>
                                    <select class="negrita form-control" id="cmbVAnio">
                                    </select>
                                </div>

                            </div>

                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">

                            <h1 class="negrita text-danger" id="lbTotalVImporte">--</h1>

                        </div>

                    </div>

                    

                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                    
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">

                            <div class="table-responsive">

                                <table class="table table-bordered h-full col-12" id="tblVendedores">
                                    <thead class="bg-info text-white negrita">
                                        <tr>
                                            <td>VENDEDOR</td>
                                            <td>TELEFONO</td>
                                            <td>PEDIDOS</td>
                                            <td>IMPORTE</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataVendedores"></tbody>
                                </table>

                            </div>

                        </div>
                    </div>

                </div>
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">

                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">

                            <h5 class="negrita text-info" id="lbVendedorMarcas"></h5>

                            <div class="table-responsive">
                                <table class="table h-full table-bordered col-12" id="tblVendedorMarcas">
                                    <thead class="bg-secondary text-white negrita">
                                        <tr>
                                            <td>MARCA</td>
                                            <td>IMPORTE</td>
                                          
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataVendedorMarcas"></tbody>
                                </table>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            


            <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        vista_marcas:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                   
                    <h3 class="negrita text-center text-secondary">VENTAS POR MARCAS</h3>

                                        <br>
                    <div class="row">
                        <div class="col-sm-12 col-md-8 col-lg-8 col-xl-8">
                            
                            <div class="form-group">
                                <label class="negrita">Seleccione mes y año</label>
                                
                                <div class="input-group">
                                    <select class="negrita form-control" id="cmbMMes">
                                    </select>
                                    <select class="negrita form-control" id="cmbMAnio">
                                    </select>
                                </div>

                            </div>

                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">

                            <h1 class="negrita text-danger" id="lbTotalMImporte">--</h1>

                        </div>

                    </div>



                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4">
                    
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">

                   

                            <div class="table-responsive">
                                <table class="table h-full table-bordered col-12" id="tblMarcas">
                                    <thead class="bg-secondary text-white negrita">
                                        <tr>
                                            <td>MARCA</td>
                                            <td>IMPORTE</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataMarcas"></tbody>
                                </table>
                            </div>
                        

                        </div>
                    </div>

                </div>
                <div class="col-sm-12 col-md-8 col-xl-8 col-lg-8">

                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">
                                
                            <h5 class="negrita text-secondary" id="lbMarcasProductos"></h5>

                            <div class="table-responsive">
                                <table class="table h-full table-bordered col-12" id="tblMarcasProductos">
                                    <thead class="bg-secondary text-white negrita">
                                        <tr>
                                            <td>CODIGO EAN</td>
                                            <td>PRODUCTO</td>
                                            <td>CAJAS</td>
                                            <td>IMPORTE</td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataMarcasProductos"></tbody>
                                </table>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
           

            
            <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        vista_sellout:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                   
                    <h3 class="negrita text-center text-base">SELL OUT</h3>

                    <br>
                    <div class="row">
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <div class="form-group">
                                <label class="negrita">Fecha Inicial</label>
                                <input type="date" class="negrita form-control" id="txtSFechaInicial">
                            </div>
                        </div>
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <div class="form-group">
                                <label class="negrita">Fecha Inicial</label>
                                <input type="date" class="negrita form-control" id="txtSFechaFinal">
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            <br>
                            <button class="btn btn-success btn-md hand shadow" onclick="F.exportTableToExcel('tblSellout','SellOut')">
                                <i class="fal fa-share"></i> Exportar Excel
                            </button>
                        </div>
                    </div>

                    

                </div>
            </div>
            <br>
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">

                        <div class="table-responsive">
                            <table class="table h-full table-bordered col-12" id="tblSellout">
                                <thead class="bg-success text-white negrita">
                                    <tr>
                                        <td>RELOP</td>
                                        <td>TRANSACCION</td>
                                        <td>FECHA</td>
                                        <td>CODIGO CLIENTE</td>
                                        <td>CLIENTE</td>
                                        <td>TIPO CLIENTE</td>
                                        <td>CODIGO VENDEDOR</td>
                                        <td>VENDEDOR</td>
                                        <td>CATEGORIA</td>
                                        <td>MARCA</td>
                                        <td>CODIGO RUTA</td>
                                        <td>GEO1-PAIS</td>
                                        <td>GEO2-DEPARTAMENTO</td>
                                        <td>GEO3-MUNICIPIO</td>
                                        <td>CEO4-ALDEA-CASERIO</td>
                                        <td>PRODUCTO</td>
                                        <td>CODIGO DUN</td>
                                        <td>CODIGO EAN</td>
                                        <td>DESCRIPCION</td>
                                        <td>VENTA EN CANTIDAD</td>
                                        <td>FACTOR</td>
                                        <td>UNIDADES POR CAJA</td>
                                        <td>MEDIDA</td>
                                        <td>VENTA EN QUETZALES</td>
                                        <td>FACTURA SAT</td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataSellout"></tbody>
                            </table>
                        </div>
                        
                </div>
            </div>
           

            
            <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        rpt_inventarios:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">
                    
                    <h3 class="negrita text-danger">INVENTARIO ACTUAL</h3>

                    <div class="row">
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <div class="input-group">
                                <select class="form-control negrita text-base" id="cmbSt">
                                    <option value="SI">PRODUCTOS HABILITADOS</option>
                                    <option value="NO">PRODUCTOS NO HABILITADOS</option>
                                </select>
                                <input type="text" class="form-control" placeholder="Escriba para buscar..." id="txtBuscarProductoInventario" oninput="F.FiltrarTabla('tblInventario','txtBuscarProductoInventario')">

                            </div>

                            
                        </div>
                        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <h5 id="lbTotalItems"></h5>
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
                                    <td>EXISTENCIA</td>
                                    <td></td>
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
    }

    root.innerHTML = view.body();

};

function addListeners(){


    F.slideAnimationTabs();
    
    document.title = `Proveedor - ${GlobalNomEmpresa}`;

  

    let cmbSucursal = document.getElementById('cmbSucursal');
    

    //bloqueo los controles para que no cargue nada
    document.getElementById('btnMenuVentasVendedor').disbled = true;
    document.getElementById('btnMenuVentasMarcas').disabled = true;
    document.getElementById('btnMenuVentasSellout').disabled = true;


    GF.get_data_empresas()
        .then((data)=>{
            let str = '<option value="%">TODAS LAS SEDES</option>';
            data.recordset.map((r)=>{
                str += `
                    <option value="${r.EMPNIT}">${r.NOMBRE}</option>
                `
            })
            cmbSucursal.innerHTML = str;
            document.getElementById('btnMenuVentasVendedor').disbled = false;
            document.getElementById('btnMenuVentasMarcas').disabled = false;
            document.getElementById('btnMenuVentasSellout').disabled = false;
            
            cmbSucursal.addEventListener('change',()=>{
                document.getElementById('tab-uno').click();
            })
        })
        .catch(()=>{
            cmbSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
        })
        
      

    //iniciales
    document.getElementById('cmbVMes').innerHTML = F.ComboMeses();  
    document.getElementById('cmbMMes').innerHTML = F.ComboMeses();
    document.getElementById('cmbVAnio').innerHTML = F.ComboAnio();
    document.getElementById('cmbMAnio').innerHTML = F.ComboAnio();
   
    document.getElementById('cmbVMes').value = F.get_mes_curso();  
    document.getElementById('cmbMMes').value = F.get_mes_curso();
    document.getElementById('cmbVAnio').value = F.get_anio_curso();
    document.getElementById('cmbMAnio').value = F.get_anio_curso();
   

    document.getElementById('txtSFechaInicial').value = F.getFecha();
    document.getElementById('txtSFechaFinal').value = F.getFecha();
    


    // inciales
    //----------------------------------


    



   


    //--------------------------------


    // ventas vendedor

    document.getElementById('btnMenuVentasVendedor').addEventListener('click',()=>{
        
        document.getElementById('tab-dos').click();

        tbl_rpt_vendedores();

    })

    document.getElementById('cmbVMes').addEventListener('change',()=>{
        tbl_rpt_vendedores();
    });

    document.getElementById('cmbVAnio').addEventListener('change',()=>{
        tbl_rpt_vendedores();
    });




    // ventas vendedor
    //---------------------------------


    // marcas

    document.getElementById('btnMenuVentasMarcas').addEventListener('click',()=>{

        document.getElementById('tab-tres').click();


        tbl_rpt_marcas();

    })


    document.getElementById('cmbMMes').addEventListener('change',()=>{
        tbl_rpt_marcas();
    });

    document.getElementById('cmbMAnio').addEventListener('change',()=>{
        tbl_rpt_marcas();
    });


    // marcas
    


    //sell out
    document.getElementById('btnMenuVentasSellout').addEventListener('click',()=>{

        document.getElementById('tab-cuatro').click();

        tbl_rpt_sellout();

    })


    document.getElementById('txtSFechaInicial').addEventListener('change',()=>{
        tbl_rpt_sellout();
    })
    document.getElementById('txtSFechaFinal').addEventListener('change',()=>{
        tbl_rpt_sellout();
    })

    //sell out



    // inventarios
    document.getElementById('btnMenuRptInventario').addEventListener('click',()=>{

        document.getElementById('tab-cinco').click();

        tbl_inventario();
    });


    document.getElementById('cmbSt').addEventListener('change',()=>{
        tbl_inventario();
    });


     // inventarios


};

function initView(){

    getView();
    addListeners();

};




function tbl_rpt_vendedores(){

    let mes = document.getElementById('cmbVMes').value;
    let anio = document.getElementById('cmbVAnio').value;

    let container = document.getElementById('tblDataVendedores');
    container.innerHTML = GlobalLoader;

    let sucursal = document.getElementById('cmbSucursal').value;

    let varTotal = 0;

    RPT.data_ventas_vendedor(sucursal,mes,anio)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            varTotal += Number(r.TOTALPRECIO);
            str += `
                <tr>
                    <td>${r.EMPLEADO}</td>
                    <td>${r.TELEFONO}</td>
                    <td>${r.CONTEO}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    <td>
                        <button class="btn btn-info btn-md hand shadow btn-circle"
                        onclick="get_rpt_marcas_vendedor('${r.CODEMP}', '${r.EMPLEADO}','${mes}', '${anio}')">
                            <i class="fal fa-arrow-right"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        
        container.innerHTML = str;
        document.getElementById('lbTotalVImporte').innerText = `Total: ${F.setMoneda(varTotal,'Q')}`;
    })
    .catch(()=>{
        
        container.innerHTML = 'No se cargaron datos...';
        document.getElementById('lbTotalVImporte').innerText = '';

    })


};


function get_rpt_marcas_vendedor(codemp,nombre,mes,anio){

    document.getElementById('lbVendedorMarcas').innerText = nombre;

    let container = document.getElementById('tblDataVendedorMarcas');
    container.innerHTML = GlobalLoader;
    
    let varTotal = 0;

    let sucursal = document.getElementById('cmbSucursal').value;


    RPT.data_ventas_vendedor_marcas(sucursal,codemp,mes,anio)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
        
            varTotal += Number(r.TOTALPRECIO);
            str += `
                <tr>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                
                </tr>
            `
        })
        container.innerHTML = str;
       
        //document.getElementById('lbTotalMImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((err)=>{
       console.log(err)

        container.innerHTML = 'No se cargaron datos....';
       
        //document.getElementById('lbTotalMImporte').innerText = '';
    })



};






function tbl_rpt_marcas(){


    let mes = document.getElementById('cmbMMes').value;
    let anio = document.getElementById('cmbMAnio').value;


    let container = document.getElementById('tblDataMarcas');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

    let sucursal = document.getElementById('cmbSucursal').value;

   
    RPT.data_marcas(sucursal,mes,anio)
    .then((data)=>{

   
        let str = '';

        data.recordset.map((r)=>{
        
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            str += `

                <tr>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    <td>
                        <button class="btn btn-secondary btn-md btn-circle hand shadow"
                        onclick="tbl_rpt_marcas_productos('${r.CODMARCA}','${r.DESMARCA}',${mes},${anio})">
                                <i class="fal fa-arrow-right"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
       
        document.getElementById('lbTotalMImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((err)=>{
       

        container.innerHTML = 'No se cargaron datos....';
       
        document.getElementById('lbTotalMImporte').innerText = '';
    })


};

function tbl_rpt_marcas_productos(codmarca,desmarca,mes,anio){



    let container = document.getElementById('tblDataMarcasProductos');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

   
    let sucursal = document.getElementById('cmbSucursal').value;


    RPT.data_marcas_productos(sucursal,codmarca,mes,anio)
    .then((data)=>{

   
        let str = '';

        data.recordset.map((r)=>{
        
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            str += `
                <tr>
                    <td>${r.CODIGO_EAN}</td>
                    <td>${r.DESPROD}</td>
                    <td>${F.setMoneda(r.CAJAS,'')}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'')}</td>
                </tr>
            `
        })
        container.innerHTML = str;
       
        //document.getElementById('lbTotalMImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((err)=>{
       

        container.innerHTML = 'No se cargaron datos....';
       
        //document.getElementById('lbTotalMImporte').innerText = '';
    })


};


function tbl_rpt_sellout(){

    let fi = F.devuelveFecha('txtSFechaInicial');
    let ff = F.devuelveFecha('txtSFechaFinal');


    let container = document.getElementById('tblDataSellout');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

    let sucursal = document.getElementById('cmbSucursal').value;

   
    RPT.data_sellout(sucursal,fi,ff)
    .then((data)=>{

   
        let str = '';

        data.recordset.map((r)=>{
        
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            str += `
                                    <tr>
                                        <td>${r.RELOP}</td>
                                        <td>${r.TRANSACCION}</td>
                                        <td>${F.convertDateNormal(r.FECHA)}</td>
                                        <td>${r.CODIGO_CLIENTE}</td>
                                        <td>${r.TIPONEGOCIO} ${r.NEGOCIO} - ${r.CLIENTE}</td>
                                        <td>DETALLE</td>
                                        <td>${r.CODIGO_VENDEDOR}</td>
                                        <td>${r.VENDEDOR}</td>
                                        <td>${r.CATEGORIA}</td>
                                        <td>${r.MARCA}</td>
                                        <td>${r.CODIGO_RUTA}</td>
                                        <td>GUATEMALA</td>
                                        <td>${r.GEO2_DEPARTAMENTO}</td>
                                        <td>${r.GEO3_MUNICIPIO}</td>
                                        <td>${r.GEO4_ALDEA_CASERIO}</td>
                                        <td>${r.PRODUCTO}</td>
                                        <td>${r.CODIGO_DUN}</td>
                                        <td>${r.CODIGO_BARRA_EAN}</td>
                                        <td>${r.DESCRIPCION_PRODUCTO}</td>
                                        <td>${r.VENTA_EN_CANTIDAD}</td>
                                        <td>${r.FACTOR}</td>
                                        <td>${r.UNIDADES_POR_CAJA}</td>
                                        <td>${r.MEDIDA}</td>
                                        <td>${F.setMoneda(r.VENTA_EN_QUETZALES,'Q')}</td>
                                        <td>${r.FACTURA_SAT_SERIE} - ${r.FACTURA_SAT_NUMERO}</td>
                                    </tr>
            `
        })
        container.innerHTML = str;
       
        //document.getElementById('lbTotalMImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((err)=>{
       

        container.innerHTML = 'No se cargaron datos....';
       
        //document.getElementById('lbTotalMImporte').innerText = '';
    })



};




function tbl_inventario(){

    let container = document.getElementById('tblDataInventario');
    container.innerHTML = GlobalLoader;

    let st = document.getElementById('cmbSt').value;

    let sucursal = document.getElementById('cmbSucursal').value;


    GF.get_data_inventarios_general(sucursal,st)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            str += `
            <tr>
                <td>${r.CODPROD}</td>
                <td>${r.CODPROD2}</td>
                <td>${r.DESPROD3}</td>
                <td>${r.DESPROD}</td>
                <td>${r.DESMARCA}</td>
                <td>${r.TOTALUNIDADES}</td>
                <td></td>
            </tr>
            `
        })
        container.innerHTML = str;

        //F.initit_datatable('tblInventario', true);

    })
    .catch(()=>{

        container.innerHTML = 'No se cargaron datos...';
    })


    

};


