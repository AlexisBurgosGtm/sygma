
function getView(){
    let view = {
        body:()=>{
            return `
                ${view.vista_encabezado()}
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado_productos()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           ${view.vista_listado_precios() + view.modal_codmedida()}
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
        vista_encabezado:()=>{
            return `
            <div class="row">
                    <div class="col-1 text-left">
                            <img src="./favicon.png" width="80px" height="80px">
                    </div>
                    <div class="card border-base card-rounded shadow col-11 p-2">
                        
                            <div class="row">
                                <div class="col-4 text-left">   
                                    <label class="text-verde negrita h5" style="font-size:120%">Gestor de cambio de Precios</label>
                                    
                                </div>
                                
                                <div class="col-8 text-right">
                                </div>
                            </div>
                        
                    </div>
                </div>
                <br>
            `
        },
        vista_listado_productos:()=>{
            return `      
                <div class="form-group">
                    <label class="negrita text-base">Escriba para buscar un Producto</label>
                    <div class="input-group">
                        <input type="text" id="txtBuscar" class="form-control negrita text-verde border-verde" placeholder="Escriba para buscar un Producto...">
                        <button class="btn btn-base btn-md hand shadow" id="btnBuscar">
                            <i class="fal fa-search"></i>
                        </button>
                    </div>
                </div>                    
                <div class="table-responsive">
                    <table class="table h-full table-hove table-bordered col-12" id="tblProductos">
                        <thead class="bg-base text-white">
                            <tr>
                                <td>CODIGOS</td>
                                <td>PRODUCTO</td>
                                <td>MARCA</td>
                                <td>MODIFICADO</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody id="tblDataProductos"></tbody>
                    </table>
                </div>
            `
        },
        vista_listado_precios:()=>{
            return `
                <div class="form-group">
                    <h2 class="negrita text-base" id="lbDesprod"></h2>
                    <h4 class="negrita text-danger" id="lbCodprod"></4>
                </div>
                              
                <div class="table-responsive">
                    <table style="font-size:85%" class="table h-full table-hove table-bordered table-striped col-12" id="tblPrecios">
                        <thead class="bg-verde text-white">
                            <tr class="f-med">
                                <td>MEDIDA</td>
                                <td>EQUIV</td>
                                <td>COSTO ULT</td>
                                <td>C.PROM</td>
                                <td class="bg-verde-claro">PRECIO</td>
                                <td class="bg-verde-claro">BONO</td>
                                <td>PRECIO_A</td>
                                <td>BONO_P_A</td>
                                <td class="bg-verde-claro">PRECIO_B</td>
                                <td class="bg-verde-claro">BONO_P_B</td>
                                <td>PRECIO_C</td>
                                <td>BONO_P_C</td>
                                <td class="bg-verde-claro">PRECIO_D</td>
                                <td class="bg-verde-claro">BONO_P_D</td>
                                <td>PRECIO_E</td>
                                <td>BONO_P_E</td>
                                <td class="bg-verde-claro">PRECIO_F</td>
                                <td class="bg-verde-claro">BONO_P_F</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody id="tblDataPrecios"></tbody>
                    </table>
                </div>


                <button class="btn btn-circle btn-bottom-l btn-secondary hand shadow btn-xl" onclick="document.getElementById('tab-uno').click()">
                    <i class="fal fa-arrow-left"></i>
                </button>
            `
        },
        modal_codmedida:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" id="modal_detalle_medida">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-verde d-flex justify-content-center align-items-center w-100">
                           
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                    <h3 class="negrita text-base" id="lbCodmedida">CODMEDIDA</h3>

                                    <div class="row">
                                        <div class="col-md-4 col-lg-3 col-xl-3 col-sm-6">
                                            <div class="form-group">
                                                <label class="negrita text-secondary">EQUIVALE:</label>
                                                <input type="number" class="negrita text-base form-control" id="txtEEquivale">
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-lg-4 col-xl-4 col-sm-6">
                                            <div class="form-group">
                                                <label class="negrita text-secondary">COSTO MEDIDA:</label>
                                                <input type="number" class="negrita text-base form-control" id="txtECosto" disabled="true">
                                            </div>
                                        </div>
                                    </div>
                                    <br>
                                     <table style="font-size:95%" class="table table-responsive h-full">
                                        <thead class="negrita bg-verde text-white">
                                            <tr class="text-center negrita">
                                                <td></td>
                                                <td>PRECIO</td>
                                                <td>BONO</td>
                                                <td>% MARGEN</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody id="">

                                            <tr>
                                                <td class="negrita text-verde-claro">PRECIO PUBLICO</td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-verde" id="txtEPrecioP" oninput="get_margen_medida('txtECosto','txtEPrecioP','txtEMargenP')"></td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-base" id="txtEBonoP"></td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-verde" id="txtEMargenP" disabled="true"></td>
                                                <td>
                                                    <button class="btn btn-circle btn-md btn-base hand shadow" onclick="update_precio_medida('P','txtEPrecioP','txtEBonoP','txtEMargenP','btnActualizarPrecioP')" id="btnActualizarPrecioP">
                                                        <i class="fal fa-sync"></i>
                                                    </button>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td class="negrita text-verde-claro">PRECIO A</td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-verde" id="txtEPrecioA" oninput="get_margen_medida('txtECosto','txtEPrecioA','txtEMargenA')"></td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-base" id="txtEBonoA"></td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-verde" id="txtEMargenA" disabled="true"></td>
                                                <td>
                                                    <button class="btn btn-circle btn-md btn-base hand shadow" onclick="update_precio_medida('A','txtEPrecioA','txtEBonoA','txtEMargenA','btnActualizarPrecioA')" id="btnActualizarPrecioA">
                                                        <i class="fal fa-sync"></i>
                                                    </button>
                                                </td>
                                            </tr>


                                            <tr>
                                                <td class="negrita text-verde-claro">PRECIO B</td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-verde" id="txtEPrecioB" oninput="get_margen_medida('txtECosto','txtEPrecioB','txtEMargenB')"></td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-base" id="txtEBonoB"></td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-verde" id="txtEMargenB" disabled="true"></td>
                                                <td>
                                                    <button class="btn btn-circle btn-md btn-base hand shadow" onclick="update_precio_medida('B','txtEPrecioB','txtEBonoB','txtEMargenB','btnActualizarPrecioB')" id="btnActualizarPrecioB">
                                                        <i class="fal fa-sync"></i>
                                                    </button>
                                                </td>
                                            </tr>

                                             <tr>
                                                <td class="negrita text-verde-claro">PRECIO C</td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-verde" id="txtEPrecioC" oninput="get_margen_medida('txtECosto','txtEPrecioC','txtEMargenC')"></td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-base" id="txtEBonoC"></td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-verde" id="txtEMargenC" disabled="true"></td>
                                                <td>
                                                    <button class="btn btn-circle btn-md btn-base hand shadow" onclick="update_precio_medida('C','txtEPrecioC','txtEBonoC','txtEMargenC','btnActualizarPrecioC')" id="btnActualizarPrecioC">
                                                        <i class="fal fa-sync"></i>
                                                    </button>
                                                </td>
                                            </tr>

                                             <tr>
                                                <td class="negrita text-verde-claro">PRECIO D</td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-verde" id="txtEPrecioD" oninput="get_margen_medida('txtECosto','txtEPrecioD','txtEMargenD')"></td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-base" id="txtEBonoD"></td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-verde" id="txtEMargenD" disabled="true"></td>
                                                <td>
                                                    <button class="btn btn-circle btn-md btn-base hand shadow" onclick="update_precio_medida('D','txtEPrecioD','txtEBonoD','txtEMargenD','btnActualizarPrecioD')" id="btnActualizarPrecioD">
                                                        <i class="fal fa-sync"></i>
                                                    </button>
                                                </td>
                                            </tr>

                                             <tr>
                                                <td class="negrita text-verde-claro">PRECIO E</td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-verde" id="txtEPrecioE" oninput="get_margen_medida('txtECosto','txtEPrecioE','txtEMargenE')"></td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-base" id="txtEBonoE"></td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-verde" id="txtEMargenE" disabled="true"></td>
                                                <td>
                                                    <button class="btn btn-circle btn-md btn-base hand shadow" onclick="update_precio_medida('E','txtEPrecioE','txtEBonoE','txtEMargenE','btnActualizarPrecioE')" id="btnActualizarPrecioE">
                                                        <i class="fal fa-sync"></i>
                                                    </button>
                                                </td>
                                            </tr>

                                             <tr>
                                                <td class="negrita text-verde-claro">PRECIO F</td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-verde" id="txtEPrecioF" oninput="get_margen_medida('txtECosto','txtEPrecioF','txtEMargenF')"></td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-base" id="txtEBonoF"></td>
                                                <td class="text-center"><input type="number" class="form-control negrita text-verde" id="txtEMargenF" disabled="true"></td>
                                                <td>
                                                    <button class="btn btn-circle btn-md btn-base hand shadow" onclick="update_precio_medida('F','txtEPrecioF','txtEBonoF','txtEMargenF','btnActualizarPrecioF')" id="btnActualizarPrecioF">
                                                        <i class="fal fa-sync"></i>
                                                    </button>
                                                </td>
                                            </tr>



                                        </tbody>
                                    </table>
                                
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
    }

    root.innerHTML = view.body();

};

function addListeners(){

    document.title = "Gestión de Precios";

    F.slideAnimationTabs();





    document.getElementById('btnBuscar').addEventListener('click',()=>{
        get_tbl_producto();
    });

    document.getElementById('txtBuscar').addEventListener('keyup',(e)=>{

        if (e.code === 'Enter') { 
            document.getElementById('btnBuscar').click();
        };
        if (e.code === 13) { 
            document.getElementById('btnBuscar').click();
           
        };



    })







};

function initView(){

    getView();
    addListeners();

};


function get_precios_producto(codprod,desprod){

    document.getElementById('tab-dos').click();

    document.getElementById('lbDesprod').innerText = desprod;
    document.getElementById('lbCodprod').innerText = codprod;

    get_tbl_precios(codprod);




}




function get_tbl_producto(){
    
    let filtro = document.getElementById('txtBuscar').value || '';

    if(filtro==''){F.AvisoError('Escriba una descripcion o codigo para buscar');return;}
    

    let container = document.getElementById('tblDataProductos');
    container.innerHTML = GlobalLoader;

    GF.get_data_buscar_producto(filtro)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `
            <tr >
                <td>${r.CODPROD}
                    <br>
                    <small class="negrita text-info">${r.CODPROD2}</small>
                </td>
                <td>${r.DESPROD}</td>
                <td>${r.DESMARCA}</td>
                <td>${F.convertDateNormal(r.LASTUPDATE)}</td>
                <td>
                    <button class="btn btn-circle btn-base btn-lg hand shadow" onclick="get_precios_producto('${r.CODPROD}','${r.DESPROD}')">
                        <i class="fal fa-arrow-right"></i>
                    </button>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron los datos....'
    })

};


function get_tbl_precios(codprod){

    let container = document.getElementById('tblDataPrecios');
    container.innerHTML = GlobalLoader;

    GlobalSelected_Codprod = codprod;

    GF.get_data_precios_producto(codprod)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `
            <tr class="f-med">
                <td>${r.CODMEDIDA}
                    <br>
                     <small>Mod:${F.convertDateNormal(r.LASTUPDATE)}</small>
                </td>
                <td>${r.EQUIVALE}</td>
                <td>${F.setMoneda(r.COSTO,'Q')}</td>
                <td>${F.setMoneda(r.COSTO_PROMEDIO,'Q')}</td>
                <td>${F.setMoneda(r.PRECIO,'Q')}
                    <br>
                    <small class="text-danger negrita">${get_margen(r.COSTO,r.PRECIO,0)}%</small>
                    <br>
                    <small class="text-base negrita">${get_margen_pventa(r.COSTO,r.PRECIO,0)}%</small>
                    <hr>
                    <small class="text-success negrita">${get_utilidad_dinero(r.COSTO,r.PRECIO,0)}</small>
                </td>
                <td class="text-base">${F.setMoneda(r.BONOPRECIO,'Q')}
                    <br>
                    <small class="text-danger negrita">${get_margen(r.COSTO,r.PRECIO,r.BONOPRECIO)}%</small>
                    <br>
                    <small class="text-base negrita">${get_margen_pventa(r.COSTO,r.PRECIO,r.BONOPRECIO)}%</small>
                    <hr>
                    <small class="text-info negrita">${get_utilidad_dinero(r.COSTO,r.PRECIO,r.BONOPRECIO)}</small>
                </td>
                <td>${F.setMoneda(r.PRECIO_A,'Q')}
                    <br>
                    <small class="text-danger negrita">${get_margen(r.COSTO,r.PRECIO_A,0)}%</small>
                    <br>
                    <small class="text-base negrita">${get_margen_pventa(r.COSTO,r.PRECIO_A,0)}%</small>
                    <hr>
                    <small class="text-success negrita">${get_utilidad_dinero(r.COSTO,r.PRECIO_A,0)}</small>
                </td>
                <td class="text-base">${F.setMoneda(r.BONOPRECIOA,'Q')}
                    <br>
                    <small class="text-danger negrita">${get_margen(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}%</small>
                    <br>
                    <small class="text-base negrita">${get_margen_pventa(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}%</small>
                    <hr>
                    <small class="text-info negrita">${get_utilidad_dinero(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}</small>
                </td>
                <td>${F.setMoneda(r.PRECIO_B,'Q')}
                    <br>
                    <small class="text-danger negrita">${get_margen(r.COSTO,r.PRECIO_B,0)}%</small>
                    <br>
                    <small class="text-base negrita">${get_margen_pventa(r.COSTO,r.PRECIO_B,0)}%</small>
                    <hr>
                    <small class="text-success negrita">${get_utilidad_dinero(r.COSTO,r.PRECIO_B,0)}</small>
                </td>
                <td class="text-base">${F.setMoneda(r.BONOPRECIOB,'Q')}
                    <br>
                    <small class="text-danger negrita">${get_margen(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}%</small>
                    <br>
                    <small class="text-base negrita">${get_margen_pventa(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}%</small>
                    <hr>
                    <small class="text-info negrita">${get_utilidad_dinero(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}</small>
                </td>
                <td>${F.setMoneda(r.PRECIO_C,'Q')}
                    <br>
                    <small class="text-danger negrita">${get_margen(r.COSTO,r.PRECIO_C,0)}%</small>
                    <br>
                    <small class="text-base negrita">${get_margen_pventa(r.COSTO,r.PRECIO_C,0)}%</small>
                    <hr>
                    <small class="text-success negrita">${get_utilidad_dinero(r.COSTO,r.PRECIO_C,0)}</small>
                </td>
                <td class="text-base">${F.setMoneda(r.BONOPRECIOC,'Q')}
                    <br>
                    <small class="text-danger negrita">${get_margen(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}%</small>
                    <br>
                    <small class="text-base negrita">${get_margen_pventa(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}%</small>
                    <hr>
                    <small class="text-info negrita">${get_utilidad_dinero(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}</small>
                </td>
                <td>${F.setMoneda(r.PRECIO_D,'Q')}
                    <br>
                    <small class="text-danger negrita">${get_margen(r.COSTO,r.PRECIO_D,0)}%</small>
                    <br>
                    <small class="text-base negrita">${get_margen_pventa(r.COSTO,r.PRECIO_D,0)}%</small>
                    <hr>
                    <small class="text-success negrita">${get_utilidad_dinero(r.COSTO,r.PRECIO_D,0)}</small>
                </td>
                <td class="text-base">${F.setMoneda(r.BONOPRECIOD,'Q')}
                    <br>
                    <small class="text-danger negrita">${get_margen(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}%</small>
                    <br>
                    <small class="text-base negrita">${get_margen_pventa(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}%</small>
                    <hr>
                    <small class="text-info negrita">${get_utilidad_dinero(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}</small>
                </td>
                <td>${F.setMoneda(r.PRECIO_E,'Q')}
                    <br>
                    <small class="text-danger negrita">${get_margen(r.COSTO,r.PRECIO_E,0)}%</small>
                    <br>
                    <small class="text-base negrita">${get_margen_pventa(r.COSTO,r.PRECIO_E,0)}%</small>
                      <hr>
                    <small class="text-success negrita">${get_utilidad_dinero(r.COSTO,r.PRECIO_E,0)}</small>
                </td>
                <td class="text-base">${F.setMoneda(r.BONOPRECIOE,'Q')}
                    <br>
                    <small class="text-danger negrita">${get_margen(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}%</small>
                    <br>
                    <small class="text-base negrita">${get_margen_pventa(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}%</small>
                     <hr>
                    <small class="text-info negrita">${get_utilidad_dinero(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}</small>
                </td>
                <td>${F.setMoneda(r.PRECIO_F,'Q')}
                    <br>
                    <small class="text-danger negrita">${get_margen(r.COSTO,r.PRECIO_F,0)}%</small>
                    <br>
                    <small class="text-base negrita">${get_margen_pventa(r.COSTO,r.PRECIO_F,0)}%</small>
                    <hr>
                    <small class="text-success negrita">${get_utilidad_dinero(r.COSTO,r.PRECIO_F,0)}</small>
                </td>
                <td class="text-base">${F.setMoneda(r.BONOPRECIOF,'Q')}
                    <br>
                    <small class="text-danger negrita">${get_margen(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}%</small>
                    <br>
                    <small class="text-base negrita">${get_margen_pventa(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}%</small>
                     <hr>
                    <small class="text-info negrita">${get_utilidad_dinero(r.COSTO,r.PRECIO_A,r.BONOPRECIOA)}</small>
                </td>
               
                <td>
                    <button class="btn btn-verde btn-circle btn-lg hand shadow" 
                        onclick="get_datos_codmedida('${r.CODMEDIDA}','${r.EQUIVALE}','${r.COSTO}',
                                                    '${r.PRECIO}','${r.BONOPRECIO}','${r.MARGEN}',
                                                    '${r.PRECIO_A}','${r.BONOPRECIOA}','${r.MARGENA}',
                                                    '${r.PRECIO_B}','${r.BONOPRECIOB}','${r.MARGENB}',
                                                    '${r.PRECIO_C}','${r.BONOPRECIOC}','${r.MARGENC}',
                                                    '${r.PRECIO_D}','${r.BONOPRECIOD}','${r.MARGEND}',
                                                    '${r.PRECIO_E}','${r.BONOPRECIOE}','${r.MARGENE}',
                                                    '${r.PRECIO_F}','${r.BONOPRECIOF}','${r.MARGENF}',)">
                        <i class="fal fa-edit"></i>
                    </button>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...'
    })

};



function get_margen(costo,precio,bono){

    let costoreal = (Number(costo)+Number(bono));
    let utilidad = (Number(precio) - costoreal);

    let porc = Number(utilidad) / Number(costoreal);
    porc = porc * 100

    return porc.toFixed(2)

};

function get_margen_pventa(costo,precio,bono){

    let costoreal = (Number(costo)+Number(bono));
    let utilidad = (Number(precio) - costoreal);

    let porc = Number(utilidad) / Number(precio);
    porc = porc * 100

    return porc.toFixed(2)

};

function get_utilidad_dinero(costo,precio,bono){

    let costoreal = (Number(costo)+Number(bono));
    let utilidad = (Number(precio) - costoreal);

    

    return F.setMoneda(utilidad,'Q');

};





function get_datos_codmedida(codmedida,equivale,costo,
                                    precio,bono,margen,
                                    precioa,bonoa,margena,
                                    preciob,bonob,margenb,
                                    precioc,bonoc,margenc,
                                    preciod,bonod,margend,
                                    precioe,bonoe,margene,
                                    preciof,bonof,margenf){

        $("#modal_detalle_medida").modal('show');

        GlobalSelected_codmedida = codmedida;
      
        document.getElementById('lbCodmedida').innerText = codmedida;
        document.getElementById('txtEEquivale').value = equivale;
        document.getElementById('txtECosto').value = costo;
        document.getElementById('txtEPrecioP').value = precio;
        document.getElementById('txtEBonoP').value = bono;
        document.getElementById('txtEMargenP').value = margen;
        document.getElementById('txtEPrecioA').value = precioa;
        document.getElementById('txtEBonoA').value = bonoa;
        document.getElementById('txtEMargenA').value = margena;
        document.getElementById('txtEPrecioB').value = preciob;
        document.getElementById('txtEBonoB').value = bonob;
        document.getElementById('txtEMargenB').value = margenb;
        document.getElementById('txtEPrecioC').value = precioc;
        document.getElementById('txtEBonoC').value = bonoc;
        document.getElementById('txtEMargenC').value = margenc;
        document.getElementById('txtEPrecioD').value = preciod;
        document.getElementById('txtEBonoD').value = bonod;
        document.getElementById('txtEMargenD').value = margend;
        document.getElementById('txtEPrecioE').value = precioe;
        document.getElementById('txtEBonoE').value = bonoe;
        document.getElementById('txtEMargenE').value = margene;
        document.getElementById('txtEPrecioF').value = preciof;
        document.getElementById('txtEBonoF').value = bonof;
        document.getElementById('txtEMargenF').value = margenf;
       

        //calcula los margenes
        //get_margen_medida('txtECosto','txtEPrecioP','txtEMargenP')
}


function get_margen_medida(idcosto,idprecio,idmargen){

    let costo = Number(document.getElementById(idcosto).value) || 0;
    let precio = Number(document.getElementById(idprecio).value) || 0;
    let utilidad = Number((precio-costo))

    try {
        document.getElementById(idmargen).value = ((utilidad / costo) * 100);

    } catch (error) {
        document.getElementById(idmargen).value = 0;
    }

};


function update_precio_medida(tipo,idprecio,idbono,idmargen,idbtn){


    //recalcula los margenes
    let idcosto = 'txtECosto';
    get_margen_medida(idcosto,idprecio,idmargen)




    let btn = document.getElementById(idbtn)
    btn.disabled = true;
    btn.innerHTML = `<i class="fal fa-spin fa-sync"></i>`

    let codmedida = document.getElementById('lbCodmedida').innerText;
    let equivale = 0;
    let precio = Number(document.getElementById(idprecio).value) || 0;
    let bono = Number(document.getElementById(idbono).value) || 0;
    let margen = Number(document.getElementById(idmargen).value) || 0;

    


    GF.update_precio_medida(GlobalSelected_Codprod,tipo,codmedida,equivale,precio,bono,margen)
    .then(()=>{
        F.Aviso('Precio actualizado exitosamente!!');
        btn.disabled = false;
        btn.innerHTML = `<i class="fal fa-sync"></i>`;
        get_tbl_precios(GlobalSelected_Codprod)
    })
    .catch(()=>{
        F.AvisoError('No se logro actualizar el precio');
        btn.disabled = false;
        btn.innerHTML = `<i class="fal fa-sync"></i>`;
    })


};

