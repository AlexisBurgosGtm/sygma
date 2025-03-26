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
            </div>

            `
        },
        rpt_ventas: ()=>{
            return `
            
            
                    <div class="row">
                        <div class="col-6">
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
                        <div class="col-6">
                            <label class="negrita text-info" id="lbFacTotalPedidos">Pedidos:</label>
                            <br>
                            <label class="negrita text-danger" id="lbFacTotalImporte">Importe:</label>
                        </div>
                    </div>
                    

                    <div class="table-responsive">

                         <table class="table h-full table-bordered col-12" id="tblFFacturas">
                                <thead class="bg-success text-white negrita">
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

        console.log('aqui 1...')
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
            varTotal += Number(r.IMPORTE);
            str += `

                <tr>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    <td>
                        <button class="btn btn-secondary btn-md btn-circle hand shadow"
                        onclick="">
                                <i class="fal fa-list"></i>
                        </button>
                    </td>
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



};