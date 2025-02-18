
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.panel()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_pedidos_pendientes()}

                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_relleno()}
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
        panel:()=>{
            return `
            
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4 text-center">
                
                    <h1 class="text-base negrita">Inicio Digitador</h1>

                </div>
            </div>

            <br>

            <div class="row">
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                    
                    <div class="card card-rounded shadow col-12 hand"  onclick="document.getElementById('tab-dos').click()">
                        <div class="card-body p-4">
                            
                            <h4>PEDIDOS PENDIENTES</h4>
                            <h1 class="negrita text-danger" id="lbTotalMP"></h1>
                            
                        </div>
                    </div>
                    

                </div>
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6" >
                    
                    <div class="card card-rounded shadow col-12 hand"  onclick="document.getElementById('tab-tres').click()">
                        <div class="card-body p-4">

                            <h4>RELLENO DE INVENTARIO</h4>
                            <h1 class="negrita text-danger" id="lbTotalMR"></h1>

                        </div>
                    </div>
                    

                </div>
            </div>


            
            `
        },
        vista_pedidos_pendientes:()=>{
            return `
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4 table-responsive">
                        
                            
                            <div class="row">
                                <div class="col-6">
                                    <h4>LISTADO DE PEDIDOS PENDIENTES</h4>
                                </div>
                                <div class="col-6">
                                    <label class="negrita text-danger" id="lbTotalP"></label>
                                </div>
                            </div>
                            

                            <table class="table h-full table-bordered col-12">
                                <thead class="bg-base text-white negrita">
                                    <tr>
                                        <td>EMBARQUE</td>
                                        <td>VENDEDOR</td>
                                        <td>FECHA</td>
                                        <td>CLIENTE</td>
                                        <td>IMPORTE</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataPedidos"></tbody>

                            </table>
                        

                        </div>
                    </div>

                    <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                        <i class="fal fa-arrow-left"></i>
                    </button>
            `
        },
        vista_relleno:()=>{
            return `
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4 table-responsive">
                        
                            <div class="row">
                                <div class="col-6">
                                    <h4>RELLENO DE INVENTARIO</h4>
                                </div>
                                <div class="col-6">
                                    <label class="negrita text-danger" id="lbTotal"></label>
                                </div>
                            </div>
                            

                             <table class="table h-full table-bordered col-12">
                                <thead class="bg-warning text-white negrita">
                                    <tr>
                                        <td>PRODUCTO</td>
                                        <td>MARCA</td>
                                        <td>EXISTENCIA</td>
                                        <td>MINIMO</td>
                                        <td>MAXIMO</td>
                                        <td>RELLENO</td>
                                    </tr>
                                </thead>
                                <tbody id="tblDataRelleno"></tbody>

                            </table>
                        
                        </div>
                    </div>

                    <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                        <i class="fal fa-arrow-left"></i>
                    </button>
            `
        }
    }

    root.innerHTML = view.body();

};

function addListeners(){


    F.slideAnimationTabs();

    tbl_pedidos_pendientes('tblDataPedidos');

    tbl_relleno_inventario('tblDataRelleno');

};

function initView(){

    getView();
    addListeners();

};



function tbl_pedidos_pendientes(idContainer){

    let container = document.getElementById(idContainer);

    container.innerHTML = GlobalLoader;
    let contador = 0;

    GF.get_data_pedidos_pendientes_vendedores()
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
            contador +=1;
            str += `
                <tr>
                    <td>${r.CODEMBARQUE}</td>
                    <td>${r.NOMEMPLEADO}
                        <br>
                        <button class="btn btn-info btn-sm hand shadow"
                        onclick="F.gotoGoogleMaps('${r.LAT}','${r.LONG}')">
                            <i class="fal fa-map"></i> Ver mapa
                        </button>
                    </td>
                    <td>${F.convertDateNormal(r.FECHA)}
                        <br>
                        <small>Hora:${r.HORA}</small>
                    </td>
                    <td>${r.NOMCLIE}
                        <br>
                        <small>${r.DIRCLIE}</small>
                    </td>
                    <td class="negrita text-danger text-right">${F.setMoneda(r.IMPORTE,'Q')}</td>
                    <td>
                    
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalP').innerText = `Pedidos pendientes: ${contador}`
        document.getElementById('lbTotalMP').innerText =`${contador} pedidos`
    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....'
        document.getElementById('lbTotalP').innerText = '---'
        document.getElementById('lbTotalMP').innerText = '---'
    })




};

function tbl_relleno_inventario(idContainer){

    let container = document.getElementById(idContainer);

    container.innerHTML = GlobalLoader;
    let lbTotal = document.getElementById('lbTotal');
    let contador = 0;

    GF.get_data_surtido(GlobalEmpnit)
    .then((data)=>{
        
        let str = '';
        data.recordset.map((r)=>{
            contador +=1;
          
            str +=`
                <tr>
                    <td>${r.DESPROD}
                        <br>
                        <small class="negrita text-base">${r.CODPROD}</small>
                    </td>
                     <td>${r.DESMARCA}</td>
                    <td class="negrita">${r.EXISTENCIA}</td>
                     <td>${r.MINIMO}</td>
                    <td>${r.MAXIMO}</td>
                    <td class="negrita text-danger">${r.RELLENO}</td>
                </tr>
            `
        })
        container.innerHTML = str;
        lbTotal.innerText = `Pendientes surtir ${contador}`;
        document.getElementById('lbTotalMR').innerText = `${contador} productos`;
        
    })
    .catch((error)=>{
        console.log(error)
        container.innerHTML = 'No se cargaron datos...'
        lbTotal.innerText = '---'
        document.getElementById('lbTotalMR').innerText = '---'
    })








};
