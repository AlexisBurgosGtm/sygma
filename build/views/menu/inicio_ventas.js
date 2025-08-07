function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.menu()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_ventas()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_productos()}
                        </div>
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_marcas()}
                        </div>   
                        <div class="tab-pane fade" id="cinco" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_categorias()}
                        </div>
                        <div class="tab-pane fade" id="seis" role="tabpanel" aria-labelledby="home-tab">
                            ${view.rpt_goles()}
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
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-seis" data-toggle="tab" href="#seis" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>        
                    </ul>
                    
                </div>
               
            `
        },
        menu:()=>{
            return `
             <div class="card card-rounded shadow col-12 bg-base">
                <div class="card-body p-4 text-center ">
                
                    <h5 class="text-white">Bienvenido</h5>
                    <h2 class="text-white negrita">${GlobalUsuario}</h2>

                </div>
            </div>

            <br>

       

            <div class="row">
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6 p-2">
                    
                    <div class="card border-info card-rounded bg-white shadow col-12 hand"  
                    onclick="Menu.ventas_pedidos()">
                        <div class="card-body p-4">
                            
                            <h4 class="text-info">NUEVO PEDIDO</h4>

                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-shopping-cart negrita text-info" style="font-size:250%"></i>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    

                </div>
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6 p-2" >
                    
                    <div class="card border-info card-rounded  bg-white shadow col-12 hand"  
                    onclick="Menu.ventas_censo()">
                        <div class="card-body p-4">

                            <h4 class="text-info">CREAR CLIENTES (CENSO)</h4>
                          
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
            </div>

            <br>

            <div class="row">

                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4 p-2">
                    
                    <div class="card card-rounded bg-white shadow col-12 hand" id="btnMenuRptMarcas">
                        <div class="card-body p-4">
                            
                            <h4>REPORTE MARCAS</h4>

                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-list negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    

                </div>
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4 p-2">
                    
                    <div class="card card-rounded bg-white shadow col-12 hand" id="btnMenuRptCategorias">
                        <div class="card-body p-4">
                            
                            <h4>OBJETIVOS CATEGORIAS</h4>

                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-chart-bar negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    

                </div>
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4 p-2">
                    
                    <div class="card card-rounded bg-white shadow col-12 hand" id="btnMenuRptDocumentos">
                        <div class="card-body p-4">
                            
                            <h4>REPORTE DE FACTURAS</h4>

                            <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-chart-pie negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    

                </div>
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4 p-2">
                    
                    <div class="card card-rounded   bg-white shadow col-12 hand" id="btnMenuRptProductos">
                        <div class="card-body p-4">

                            <h4 class="">REPORTE PRODUCTOS</h4>
                          
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
                 <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4 p-2">
                    
                    <div class="card card-rounded   bg-white shadow col-12 hand" id="btnMenuRptGoles">
                        <div class="card-body p-4">

                            <h4 class="">REPORTE DE GOLES</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-futbol negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            `
        },
        rpt_ventas: ()=>{
            return `
            
            
                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <h4 class="negrita text-base">Listado de Facturas</h4>
                            <div class="row">
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="negrita">Fecha inicio</label>
                                        <input type="date" class="form-control negrita text-danger" id="txtDocFechaInicial">
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="negrita">Fecha Final</label>
                                        <input type="date" class="form-control negrita text-danger" id="txtDocFechaFinal">
                                    </div>
                                </div>
                               

                            </div>
                            <br>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <label class="negrita text-info" id="lbFacTotalPedidos">Pedidos:</label>
                            <br>
                            <label class="negrita text-danger h1" id="lbFacTotalImporte">Importe:</label>
                            <br>
                            <button class="btn btn-outline-secondary btn-md hand shadow" id="btnRecargarListaFacturas">
                                <i class="fal fa-sync"></i> Recargar Lista
                            </button>
                        </div>
                    </div>
                    

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblFFacturas">
                                <thead class="bg-secondary text-white negrita">
                                    <tr>
                                        <td>DOCUMENTO</td>
                                        <td>FECHA</td>
                                        <td>CLIENTE</td>
                                        <td>MUNICIPIO</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataFFacturas"></tbody>

                            </table>

                    </div>


            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        rpt_marcas:()=>{

            return `
                     <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Reporte de Marcas</h4>
                            <div class="row">
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="negrita">Fecha inicio</label>
                                        <input type="date" class="form-control negrita text-danger" id="txtMarcaFechaInicial">
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="negrita">Fecha Final</label>
                                        <input type="date" class="form-control negrita text-danger" id="txtMarcaFechaFinal">
                                    </div>
                                </div>

                            </div>
                            <br>
                        </div>
                        <div class="col-6">
                         
                            <label class="negrita text-danger" id="lbMarcaTotalImporte">Importe:</label>
                        </div>
                    </div>
                    

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblMarcas">
                                <thead class="bg-success text-white negrita">
                                    <tr>
                                        <td>MARCA</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataMarcas"></tbody>

                            </table>

                    </div>



            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `

        },
        rpt_categorias:()=>{

            return `
            <div class="card card-rounded col-12">
                <div class="card-body p-4">

                    <div class="row">
                        <div class="col-6">
                            <h4 class="negrita text-base">Logro por Categoria</h4>

                            <div class="form-group">
                                <label class="negrita">Seleccione Mes y Año</label>
                                <div class="input-group">
                                    <select class="form-control negrita text-base" id="cmbMes"></select>
                                    <select class="form-control negrita text-base" id="cmbAnio"></select>
                                </div>
                            </div>

                           
                            <br>
                        </div>
                        <div class="col-6">
                         
                            <label class="negrita text-danger" id="lbMarcaTotalImporte">Importe:</label>
                        </div>
                    </div>
                    

                    <div class="table-responsive">
                        <table class="table table-bordered h-full col-12">
                            <thead class="bg-base text-white"> 
                                <tr>
                                    <td>CATEGORIA</td>
                                    <td>VENTA</td>
                                    <td>OBJETIVO</td>
                                    <td>FALTAN</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblDataVendedorCategorias"></tbody>
                            <tfoot class="bg-base text-white"> 
                                <tr>
                                    <td></td>
                                    <td  id="lbTotalCategoriaVendedorLogro"></td>
                                    <td id="lbTotalCategoriaVendedorObjetivo"></td>
                                    <td  id="lbTotalCategoriaVendedorFaltan"></td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                </div>
            </div>
            


            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `

        },
        rpt_productos:()=>{
            return `
            
            <div class="row p-4">
                        <div class="col-6">
                            <h4 class="negrita text-base">Productos Vendidos</h4>
                            
                            <div class="row">
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="negrita">Fecha inicio</label>
                                        <input type="date" class="form-control negrita text-danger" id="txtProdFechaInicial">
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group">
                                        <label class="negrita">Fecha Final</label>
                                        <input type="date" class="form-control negrita text-danger" id="txtProdFechaFinal">
                                    </div>
                                </div>

                            </div>
                            
                            

                            <br>
                        </div>
                        <div class="col-6">
                            <label class="negrita text-info" id="lbProdTotalPedidos">Pedidos:</label>
                            <br>
                            <label class="negrita text-danger" id="lbProdTotalImporte">Importe:</label>
                        </div>
                    </div>

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblFProductos">
                                <thead class="bg-secondary text-white negrita">
                                    <tr>
                                        <td>CODIGO</td>
                                        <td>PRODUCTO</td>
                                        <td>UXC</td>
                                        <td>CAJAS</td>
                                        <td>UNIDADES</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataFProductos"></tbody>

                            </table>

                    </div>

            
            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
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
                            <h5>Universo Clientes:</h5>
                            <h1 class="negrita text-danger" id="lbUniversoGoles"></h1>
                        </div>
                    </div>

                       

                    <hr class="solid">

                    <div class="table-responsive">

                        <div class="form-group">
                            <input type="text" class="form-control border-info text-info"
                            id="txtBuscarGoles"
                            placeholder="Escriba para buscar..." 
                            oninput="F.FiltrarTabla('tblGoles','txtBuscarGoles')"
                            >
                        </div>

                        <table class="table h-full table-hover" id="tblGoles">
                            <thead class="bg-primary text-white">
                                <tr>
                                    <td>PRODUCTO</td>
                                    <td>ALCANZADOS</td>
                                    <td>UNIVERSO</td>
                                    <td>LOGRO</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataGoles">
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

    document.title = `Vendedor - ${GlobalNomEmpresa}`;
    

    document.getElementById('cmbMes').innerHTML = F.ComboMeses();
    document.getElementById('cmbMes').value = F.get_mes_curso();
    document.getElementById('cmbMes').addEventListener('change',()=>{
        tbl_detalle_vendedor(GlobalCodUsuario);
    });

    document.getElementById('cmbAnio').innerHTML = F.ComboAnio();
    document.getElementById('cmbAnio').value = F.get_anio_curso();
    document.getElementById('cmbAnio').addEventListener('change',()=>{
        tbl_detalle_vendedor(GlobalCodUsuario);
    });
    

    document.getElementById('btnMenuRptProductos').addEventListener('click',()=>{

            document.getElementById('tab-tres').click();
            rpt_tbl_productos_embarque();
    })

    document.getElementById('btnMenuRptDocumentos').addEventListener('click',()=>{

        document.getElementById('tab-dos').click();
        rpt_tbl_documentos_embarque();
    })

    
    document.getElementById('btnMenuRptMarcas').addEventListener('click',()=>{

        document.getElementById('tab-cuatro').click();
        rpt_tbl_marcas();
    })


    
    document.getElementById('btnMenuRptCategorias').addEventListener('click',()=>{

        document.getElementById('tab-cinco').click();
        tbl_detalle_vendedor(GlobalCodUsuario);
    })


    document.getElementById('txtProdFechaInicial').value = F.getFecha();
    document.getElementById('txtProdFechaFinal').value = F.getFecha();


    
    
    document.getElementById('txtProdFechaInicial').addEventListener('change',()=>{
        rpt_tbl_productos_embarque();
    });

    
    document.getElementById('txtProdFechaFinal').addEventListener('change',()=>{
        rpt_tbl_productos_embarque();
    });


    document.getElementById('txtDocFechaInicial').value = F.getFecha();
    document.getElementById('txtDocFechaFinal').value = F.getFecha();


    document.getElementById('btnRecargarListaFacturas').addEventListener('click',()=>{
        rpt_tbl_documentos_embarque();
    });
    
    document.getElementById('txtDocFechaInicial').addEventListener('change',()=>{
        rpt_tbl_documentos_embarque();
    });

    
    document.getElementById('txtDocFechaFinal').addEventListener('change',()=>{
        rpt_tbl_documentos_embarque();
    });


    document.getElementById('txtMarcaFechaInicial').value = F.getFecha();
    document.getElementById('txtMarcaFechaFinal').value = F.getFecha();


    document.getElementById('txtMarcaFechaInicial').addEventListener('change',()=>{
        rpt_tbl_marcas();
    });

    
    document.getElementById('txtMarcaFechaFinal').addEventListener('change',()=>{
        rpt_tbl_marcas();
    });



    // -------------------------------
    // GOLES 
    // -------------------------------
    document.getElementById('btnMenuRptGoles').addEventListener('click',()=>{
        
        document.getElementById('tab-seis').click();
        GF.get_data_universo_clientes_empleado(GlobalEmpnit,GlobalCodUsuario)
        .then((universo)=>{
            document.getElementById('lbUniversoGoles').innerText = universo.toString();
            rpt_goles_resumen(universo);
        })
        .catch((error)=>{
            document.getElementById('lbUniversoGoles').innerText = '';

            F.AvisoError('No se logro obtener el total de clientes del vendedor')
        })
        

    });
    document.getElementById('cmbMesGoles').innerHTML = F.ComboMeses();
    document.getElementById('cmbMesGoles').value = F.get_mes_curso();
    document.getElementById('cmbMesGoles').addEventListener('change',()=>{

        let universo = Number(document.getElementById('lbUniversoGoles').innerText);
        rpt_goles_resumen(universo);

    });

    document.getElementById('cmbAnioGoles').innerHTML = F.ComboAnio();
    document.getElementById('cmbAnioGoles').value = F.get_anio_curso();
    document.getElementById('cmbAnioGoles').addEventListener('change',()=>{
          
            let universo = Number(document.getElementById('lbUniversoGoles').innerText);
            rpt_goles_resumen(universo);
        
    });
    // -------------------------------
    // GOLES 
    // -------------------------------


};


function initView(){

    getView();
    addListeners();

};



function rpt_tbl_documentos_embarque(){
   

        let container = document.getElementById('tblDataFFacturas');
        container.innerHTML = GlobalLoader;

        let contador = 0;
        let varTotal = 0;
    
        let fi = F.devuelveFecha('txtDocFechaInicial');
        let ff = F.devuelveFecha('txtDocFechaFinal');

        GF.get_data_embarque_facturas_vendedor(GlobalEmpnit,fi,ff,GlobalCodUsuario)
        .then((data)=>{
    
       
            let str = '';
    
            data.recordset.map((r)=>{
            
                contador +=1;
                varTotal += Number(r.IMPORTE);
                str += `
                    <tr>
                        <td>${r.CODDOC}-${r.CORRELATIVO}
                            <small>Status: <b>${r.STATUS}</b></small>
                        </td>
                        <td>${F.convertDateNormal(r.FECHA)}
                            <br>
                            <small>Hora:${r.HORA}</small>
                        </td>
                        <td>${r.NOMCLIE}
                            <br>
                            <small>${r.DIRCLIE}</small>
                        </td>
                        <td>
                            ${r.DESMUN}
                        </td>
                        <td class="negrita text-danger text-right">${F.setMoneda(r.IMPORTE,'Q')}</td>
                        <td>
                            <button class="btn btn-info btn-md btn-circle hand shadow"
                            onclick="fcn_editar_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.NOMCLIE}','${r.DIRCLIE}')">
                                    <i class="fal fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `
            })
            container.innerHTML = str;
            document.getElementById('lbFacTotalPedidos').innerText = `Facturas: ${contador}`;
            document.getElementById('lbFacTotalImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;
    
        })
        .catch((err)=>{
            console.log('error:')
            console.log(err)

            container.innerHTML = 'No se cargaron datos....';
            document.getElementById('lbFacTotalPedidos').innerText = '';
            document.getElementById('lbFacTotalImporte').innerText = '';
        })
    
    
    


}


function rpt_tbl_productos_embarque(){

    let container = document.getElementById('tblDataFProductos');

    container.innerHTML = GlobalLoader;
    let contador = 0;
    let varTotal = 0;


    let fi = F.devuelveFecha('txtProdFechaInicial');
    let ff = F.devuelveFecha('txtProdFechaFinal');

    

    GF.get_data_embarque_productos_vendedor(GlobalEmpnit,fi,ff,GlobalCodUsuario)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
         
            contador +=1;
            varTotal += Number(r.IMPORTE);
            str += `
                <tr>
                    <td>${r.CODPROD}
                    <br>
                        <small class="hidden">${r.TOTALUNIDADES}</small>
                    </td>
                    <td>${r.DESPROD}
                        <br>
                        <small>${r.DESMARCA}</small>
                    </td>
                    <td>${r.UXC}</td>
                    <td>${r.CAJAS}</td>
                    <td>${r.UNIDADES}</td>
                    <td>${F.setMoneda(r.IMPORTE,'Q')}</td>
                    <td></td>
                </tr>
                `
        })
        container.innerHTML = str;
        document.getElementById('lbProdTotalPedidos').innerText = `Pedidos: ${contador}`;
        document.getElementById('lbProdTotalImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....';
        document.getElementById('lbProdTotalPedidos').innerText = '';
        document.getElementById('lbProdTotalImporte').innerText = '';
    })


};


function rpt_tbl_marcas(){

    let container = document.getElementById('tblDataMarcas');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

    let fi = F.devuelveFecha('txtMarcaFechaInicial');
    let ff = F.devuelveFecha('txtMarcaFechaFinal');

 
    GF.get_data_marcas_vendedor(GlobalEmpnit,fi,ff,GlobalCodUsuario)
    .then((data)=>{

   
        let str = '';

        data.recordset.map((r)=>{
        
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            str += `
                <tr>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                </tr>
            `
        })
        container.innerHTML = str;
       
        document.getElementById('lbMarcaTotalImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((err)=>{
        console.log('error:')
        console.log(err)

        container.innerHTML = 'No se cargaron datos....';
       
        document.getElementById('lbMarcaTotalImporte').innerText = '';
    })


    /*
    str += `
                <tr>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                    <td>${F.setMoneda((Number(r.OBJETIVO)-Number(r.TOTALPRECIO)),'Q')}</td>
                    <td class="negrita">${F.setMoneda((Number(r.OBJETIVO)/Number(r.TOTALPRECIO)) * 100,'')}%</td>
                </tr>
            `
    */


};



function get_data_vendedor(codemp,mes,anio){

    return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + '/objetivos/select_logro_vendedores_categorias', {
                    token:TOKEN,
                    codemp:codemp,
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
function tbl_detalle_vendedor(codemp){

    let container = document.getElementById('tblDataVendedorCategorias');
    container.innerHTML = GlobalLoader;

    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;

    let varTObjetivo = 0; let varTLogro = 0; let varTFaltan = 0;

    get_data_vendedor(codemp,mes,anio)
    .then((data)=>{
        let str = '';

        data.recordset.map((r)=>{
            
            let logrado = F.get_logrado(Number(r.LOGRO),Number(r.OBJETIVO));
            let faltan = Number(r.OBJETIVO)-Number(r.LOGRO);
          
            varTObjetivo += Number(r.OBJETIVO);
            varTLogro += Number(r.LOGRO);
            varTFaltan += Number(faltan);

            str += `
            <tr>
                <td>${r.CATEGORIA}</td>
                <td>${F.setMoneda(r.LOGRO,'Q')}</td>
                <td>${F.setMoneda(r.OBJETIVO,'Q')}</td>
                <td>${F.setMoneda(faltan,'Q')}</td>
                <td>
                    <div class="input-group"><progress value="${logrado}" max="100"></progress>${logrado}%</div>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalCategoriaVendedorObjetivo').innerText = F.setMoneda(varTObjetivo,'Q');
        document.getElementById('lbTotalCategoriaVendedorLogro').innerText = F.setMoneda(varTLogro,'Q');
        document.getElementById('lbTotalCategoriaVendedorFaltan').innerText = F.setMoneda(varTFaltan,'Q');
        

    })
    .catch((error)=>{

        console.log(error);

        container.innerHTML = 'No se cargaron datos...';
        
        document.getElementById('lbTotalCategoriaVendedorObjetivo').innerText = '';
        document.getElementById('lbTotalCategoriaVendedorLogro').innerText = '';
        document.getElementById('lbTotalCategoriaVendedorFaltan').innerText = '';
        
    })


}



function rpt_goles_resumen(universo){


    let container = document.getElementById('tblDataGoles');
    container.innerHTML = GlobalLoader;


    





};