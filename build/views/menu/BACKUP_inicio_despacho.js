function get_view(){

    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            <div class="row">
                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    ${view.vista_listado()}
                                </div>
                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    ${view.vista_detalle()}
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
        vista_listado:()=>{
            return `
            <h3 class="negrita text-danger">Lista de Pedidos Pendientes</h3>
            <table class="table table-responsive table-bordered col-12">
                <thead class="bg-primary text-white">
                    <tr>
                        <td>PEDIDO</td>
                        <td>CLIENTE</td>
                        <td>MONTO</td>
                    </tr>
                </thead>
                <tbody id="tblDataPendientes">
                </tbody>
            </table>
            `
        },
        vista_detalle:()=>{
            return `
            <h5 id="lbPedido" class="negrita text-danger"></h5>
            <h5 id="lbNomclie" class="negrita text-info"></h5>
            
            <table class="table table-responsive table-bordered col-12">
                <thead class="bg-secondary text-white">
                    <tr>
                        <td>PRODUCTO</td>
                        <td>CANTIDAD</td>
                        <td>IMPORTE</td>
                    </tr>
                </thead>
                <tbody id="tblDataPedido">
                </tbody>
            </table>
            `
        }
    }

    root.innerHTML = view.body();

};

function addListeners(){

    get_listado();

};

function initView(){
    get_view();
    addListeners();
};


function get_listado(){



    let container = document.getElementById('tblDataPendientes');
    container.innerHTML = GlobalLoader;

    let data = {
        sucursal:cmbEmpresa.value,
        token:TOKEN
    };

    GF.get_data_qry('/despacho/pedidos_pendientes',data)
    .then((datos)=>{
        let str = '';
        datos.recordset.map((r)=>{
            str += `
                    <tr class="hand" onclick="get_detalle_pedido('${r.CODDOC}','${r.CORRELATIVO}','${r.NOMCLIE}')">
                        <td>${r.CODDOC}-${r.CORRELATIVO}
                            <br>
                            <small class="negrita text-danger">${F.convertDateNormal(r.FECHA)}</small>
                        </td>
                        <td>${r.NOMCLIE}
                            <br>
                            <small>${r.DIRCLIE}</small>
                        </td>
                        <td>${F.setMoneda(r.TOTALVENTA,'Q')}</td>
                    </tr>
            `
        })
        container.innerHTML = str;
    })
    .catch(()=>{
        container.innerHTML = 'No hay datos para mostrar...';
    })


};

function get_detalle_pedido(coddoc,correlativo, nomclie){


    document.getElementById('lbPedido').innerText = `${coddoc}-${correlativo}`;
    document.getElementById('lbNomclie').innerText = `${nomclie}`;


    let container = document.getElementById('tblDataPedido');
    container.innerHTML = GlobalLoader;

    let data = {
        sucursal:cmbEmpresa.value,
        token:TOKEN,
        coddoc:coddoc,
        correlativo:correlativo
    };

    GF.get_data_qry('/despacho/detalle_pedido',data)
    .then((datos)=>{
        let str = '';
        datos.recordset.map((r)=>{
            str += `
                    <tr>
                        <td>${r.DESPROD}</td>
                        <td><b>${r.CANTIDAD}</b> ${r.CODMEDIDA}</td>
                        <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    </tr>
                    `
        })
        container.innerHTML = str;
    })
    .catch(()=>{
        container.innerHTML = 'No hay datos para mostrar...';
    })


};