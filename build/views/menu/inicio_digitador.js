
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

                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">
                        
                            <h4>LISTADO DE PEDIDOS PENDIENTES</h4>

                            <table class="table h-full table-bordered col-12">
                                <thead class="bg-base text-white negrita">
                                    <tr>
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

                </div>
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">

                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">
                        
                            <h4>RELLENO - MINIMOS DE INVENTARIO</h4>

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
                                <tbody id="tblDataPedidos"></tbody>

                            </table>
                        
                        </div>
                    </div>

                </div>
            </div>


            
            `
        },
        vista_nuevo:()=>{

        }
    }

    root.innerHTML = view.body();

};

function addListeners(){




    tbl_pedidos_pendientes('tblDataPedidos');

    tbl_relleno_inventario('tblDataPedidos');

};

function initView(){

    getView();
    addListeners();

};



function tbl_pedidos_pendientes(idContainer){

    let container = document.getElementById(idContainer);

    container.innerHTML = GlobalLoader;

    GF.get_data_pedidos_pendientes_vendedores()
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
            str += `
                <tr>
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

    })
    .catch((error)=>{
        container.innerHTML = 'No se cargaron datos....'
    })




};

function tbl_relleno_inventario(idContainer){

    let container = document.getElementById(idContainer);

    container.innerHTML = GlobalLoader;


    get_data_surtido(empnit)
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
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...'
        lbTotal.innerText = '---'
    })








};
