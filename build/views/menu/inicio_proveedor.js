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
                           ${view.vista_vendedores()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_marcas()}
                        </div>
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_sellout()}
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
                            <a class="nav-link negrita text-danger" id="tab-cinco" data-toggle="tab" href="#cincos" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>         
                    </ul>
                    
                </div>
               
            `
        },
        menu:()=>{
            return `
            <div class="card card-rounded shadow col-12 bg-base text-white">
                <div class="card-body p-4">
                   
                    <h1 class="negrita text-white text-center">INICIO RELOP</h1>

                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4">
                    
                    <div class="card card-rounded   bg-white shadow col-12 hand" id="btnMenuVentasVendedor">
                        <div class="card-body p-4">

                            <h4 class="">VENTAS POR VENDEDOR</h4>
                          
                             <div class="row">
                                <div class="col-6">
                                </div>
                                <div class="col-6 text-right">
                                    <i class="fal fa-users negrita text-secondary" style="font-size:250%"></i>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4">

                    <div class="card card-rounded   bg-white shadow col-12 hand" id="btnMenuVentasMarcas">
                        <div class="card-body p-4">

                            <h4 class="">VENTAS POR MARCA</h4>
                          
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
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4">
                
                    <div class="card card-rounded   bg-white shadow col-12 hand" id="btnMenuVentasSellout">
                        <div class="card-body p-4">

                            <h4 class="">SELL OUT</h4>
                          
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
                                    <thead class="bg-secondary text-white negrita">
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
            </div>
            <br>
            <div class="row">
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                    
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">

                        
                        </div>
                    </div>

                </div>
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">

                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">
                                

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
                    <div class="form-group">
                        <label class="negrita">Seleccione mes y año</label>
                        
                        <div class="input-group">
                            <select class="negrita form-control" id="cmbSMes">
                            </select>
                            <select class="negrita form-control" id="cmbSAnio">
                            </select>
                        </div>

                    </div>

                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                    
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">

                        
                        </div>
                    </div>

                </div>
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">

                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">
                                

                        </div>
                    </div>

                </div>
            </div>
           

            
            <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
    }

    root.innerHTML = view.body();

};

function addListeners(){


    F.slideAnimationTabs();


    //iniciales
    document.getElementById('cmbVMes').innerHTML = F.ComboMeses();  
    document.getElementById('cmbMMes').innerHTML = F.ComboMeses();
    document.getElementById('cmbSMes').innerHTML = F.ComboMeses();
    document.getElementById('cmbVAnio').innerHTML = F.ComboAnio();
    document.getElementById('cmbMAnio').innerHTML = F.ComboAnio();
    document.getElementById('cmbSAnio').innerHTML = F.ComboAnio();

    document.getElementById('cmbVMes').value = F.get_mes_curso();  
    document.getElementById('cmbMMes').value = F.get_mes_curso();
    document.getElementById('cmbSMes').value = F.get_mes_curso();
    document.getElementById('cmbVAnio').value = F.get_anio_curso();
    document.getElementById('cmbMAnio').value = F.get_anio_curso();
    document.getElementById('cmbSAnio').value = F.get_anio_curso();




    // inciales
    //----------------------------------


    


    document.getElementById('btnMenuVentasMarcas').addEventListener('click',()=>{

        document.getElementById('tab-tres').click();


    })

    document.getElementById('btnMenuVentasSellout').addEventListener('click',()=>{

        document.getElementById('tab-cuatro').click();


    })


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


    let varTotal = 0;

    RPT.data_ventas_vendedor(GlobalEmpnit,mes,anio)
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
                    <td></td>
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


