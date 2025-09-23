function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           ${view.vista_documentos()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_detalle()}
                        </div>  
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_mapa()}
                        </div>  
                        <div class="tab-pane fade" id="cinco" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_devolucion() + view.modal_editar_cantidad()}
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
        vista_listado:()=>{
            return `
            <div class="card card-rounded col-12 shadow">
                <div class="card-body p-4 text-center">
                        <h1 class="text-secondary negrita">Pickings Asignados</h1>
                        <h3 class="negrita text-danger">${GlobalUsuario}</h3>
                </div>
            </div>
            <br>
            <div class="card card-rounded col-12">
                <div class="card-body p-1" id="tblEmbarques">
                    
                    
                </div>
            </div>
            `
        },
        vista_documentos:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-2">
                    <h5 class="negrita text-danger" id="lbEmbarque"></h5>

                    <div class="form-group">
                        <input type="text" class="form-control negrita text-danger border-primary"
                        placeholder="Escriba para buscar..."
                        oninput="F.FiltrarTabla('tblDocumentos','txtBuscarDocumento')" id="txtBuscarDocumento">
                    </div>

                    <div class="table-responsive">
                        <table class="table h-full col-12 table-striped table-bordered" id="tblDocumentos">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>FACTURA</td>
                                    <td>IMPORTE</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataDocumentos"></tbody>
                        </table>
                    </div>
                    
                </div>
            </div>
            
            <button class="btn btn-secondary btn-bottom-l btn-xl btn-circle hand shadow"
            onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        vista_detalle:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">
                    
                        <table class="table table-responsive table-bordered table-hover">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <td>PRODUCTO</td>
                                    <td>MEDIDA</td>
                                    <td>CANTIDAD</td>
                                    <td>PRECIO</td>
                                    <td>IMPORTE</td>
                                </tr>
                            </thead>
                            <tbody id="tblDataDetalle"></tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="negrita text-danger"><b id="lbDetalleTotal"></b></td>
                                </tr>
                            </tfoot>
                        </table>
                    
                </div>
            </div>

            <button class="btn btn-secondary btn-bottom-l btn-xl btn-circle hand shadow"
            onclick="document.getElementById('tab-dos').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        vista_mapa:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-0">
                    <h5 class="negrita text-danger" id="lbEmbarqueMapa"></h5>

                    <div class="" id="container_mapa"></div>
                    
                    
                </div>
            </div>
            <button class="btn btn-secondary btn-bottom-l btn-xl btn-circle hand shadow"
            onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        vista_devolucion:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">
                
                            <div class="row">
                                <div class="col-6">
                                    <h5 class="negrita text-base">Productos devueltos</h5>
                        
                                </div>
                                <div class="col-6 text-right">
                                    <h2 class="negrita text-danger" id="lbTotal"></h2>
                                </div>

                            </div>

                             <div class="row">
                                <div class="col-6">
                                  
                        
                                </div>
                                <div class="col-6 text-right">
                                  

                                </div>

                            </div>

                        
                            <div class="table-responsive col-12">
                                <table class="table table-responsive table-hover h-full col-12">
                                    <thead class="bg-base text-white">
                                        <tr>
                                            <td>PRODUCTO</td>
                                            <td>MEDIDA</td>
                                            <td>CANTIDAD</td>
                                            <td>PRECIO</td>
                                            <td>IMPORTE</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataProductos">
                                    </tbody>
                                </table>
                            </div>

                    
                </div>
            </div>

            ${view.frag_encabezado()}

            <button class="btn btn-secondary btn-bottom-l btn-xl btn-circle hand shadow"
                onclick="document.getElementById('tab-dos').click()">
                <i class="fal fa-arrow-left"></i>
            </button>

            
            <button class="btn btn-bottom-r btn-info btn-circle btn-xl hand shadow" id="btnGuardar">
                <i class="fal fa-save"></i>
            </button>

            `
        },
        modal_editar_cantidad:()=>{
            return `
            <div class="modal" id="modal_editar_cantidad" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">

                        <div class="modal-header bg-base">
                            <label class="modal-title text-white h3" id="lbCantidadDesprodE">Cantidad de producto</label>
                        </div>
            
                        <div class="modal-body p-4">
                            <div class="row">
                                <div class="col-4 text-center">
                                    <img src="./favicon.png" width="120px" height="100px">
                                </div>
                                <div class="col-8">
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Cantidad:</label>
                                        <input type="number" style="font-size:140%" class="form-control negrita text-info border-base shadow col-10" id="txtMCCantidadE">
                                    </div>   
                                    
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Precio ${GlobalSignoMoneda}:</label>
                                        <input disabled="true" type="number" style="font-size:140%" class="form-control negrita text-info border-base shadow col-10" id="txtMCPrecioE">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="negrita text-secondary">Subtotal ${GlobalSignoMoneda}:</label>
                                        <input type="number" style="font-size:150%" class="form-control negrita text-danger border-base shadow col-10" id="txtMCTotalPrecioE" disabled>
                                    </div>


                                    <div class="form-group hidden">
                                        <label class="negrita text-secondary">Descuento ${GlobalSignoMoneda}:</label>
                                        <input type="number" style="font-size:140%" class="form-control negrita text-info border-base shadow col-10" id="txtMCDescuentoE" oninput="calcular_descuento('txtMCDescuentoE','txtMCTotalPrecioE','txtMCTotalPrecioDescuentoE')">
                                    </div>
                                    
                                    <div class="form-group hidden">
                                        <label class="negrita text-secondary">Importe ${GlobalSignoMoneda}:</label>
                                        <input type="number" style="font-size:150%" class="form-control negrita text-danger border-base shadow col-10" id="txtMCTotalPrecioDescuentoE" disabled>
                                    </div>


                                </div>            
                            </div>
                                
                            <br>
        
                            <div class="row">
                                    <div class="col-5 text-right">
                                        <button class="btn btn-secondary btn-xl btn-circle hand shadow waves-effect waves-themed" data-dismiss="modal" id="">
                                            <i class="fal fa-arrow-left"></i>
                                        </button>                                
                                    </div>
        
                                    <div class="col-1"></div>
        
                                    <div class="col-5 text-right">
                                        <button class="btn btn-base btn-xl btn-circle hand shadow waves-effect waves-themed" id="btnMCGuardarE">
                                            <i class="fal fa-check mr-1"></i>
                                        </button>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        },
        frag_encabezado:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">

                    <h3 class="negrita text-danger text-center">INGRESO DE DEVOLUCIONES</h3>

                    <div class="form-group">
                        <label class="negrita text-base">Sucursal</label>
                        <select class="form-control negrita text-danger" id="cmbSucursal">
                        </select>
                    </div>

                    <div class="form-group">
                        <div class="input-group">
                            <select class="form-control negrita text-danger" id="cmbCoddoc">
                            </select>
                            <input type="number" id="txtCorrelativo" class="form-control negrita text-secondary" disabled="true">
                            <input type="date" id="txtFecha" class="form-control negrita text-secondary">
                        </div>
                    </div>

                    <div class="form-group">
                        <select class="form-control negrita text-secondary" id="cmbCaja">
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="negrita text-base">Cliente</label>
                        <h5 class="negrita text-danger" id="lbNomclie">CLIENTE</h5>
                        <small class="negrita text-secondary" id="lbDirclie"></small>
                    </div>

                    <div class="form-group">
                        <label class="negrita text-base">Factura</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="cmbCoddocFac" disabled="true">
                            <input type="text" class="form-control" id="cmbCorrelativoFac" disabled="true">
                            <button class="btn btn-md btn-success shadow hand" id="btnNuevo">
                                <i class="fal fa-plus"></i>
                            </button>
                        </div>

                    </div>

                    <div class="form-group">
                        <label class="negrita text-base">Embarque / Picking</label>
                        <input type="text" class="form-control negrita text-secondary" id="txtCodembarque" disabled="true">
                    </div>

                    <div class="form-group">
                        <label class="negrita text-base">Vendedor</label>
                        <select class="form-control negrita text-secondary" id="cmbEmpleados">
                        </select>
                    </div>

                     <div class="form-group">
                        <label class="negrita text-base">Motivo</label>
                        <select class="form-control negrita text-secondary" id="cmbObs">
                            <option value='DEVOLUCION PARCIAL'>DEVOLUCION PARCIAL</option>
                            <option value='SIN DINERO'>SIN DINERO</option>
                            <option value='CERRADO'>CERRADO</option>
                            <option value='CLIENTE NO RECIBIO'>CLIENTE NO RECIBIO</option>
                            <option value='PASO BLOQUEADO'>PASO BLOQUEADO</option>
                            <option value='MALA NEGOCIACION'>MALA NEGOCIACION</option>
                            <option value='CLIENTE NUNCA RECIBE'>CLIENTE NUNCA RECIBE</option>
                        </select>
                    </div>



                    <input class="hidden" type="number" id="txtCodclie" disabled="true">  
                   
                    <input class="hidden" type="text" id="txtNit" disabled="true">  
                                      
                
                                  
                </div>
            </div>
         
            `
        },
    }

    root.innerHTML = view.body();

};

function addListeners(){

      
    get_tbl_embarques_pendientes();

    listeners_devolucion();


    F.slideAnimationTabs();
};

function initView(){

    getView();
    addListeners();

};

function listeners_devolucion(){



    GF.get_data_tipodoc_coddoc_sucursal(GlobalEmpnit,'DEV')
    .then((data)=>{

        let strCoddoc = ''
        data.recordset.map((r)=>{
            strCoddoc += `<option value="${r.CODDOC}">${r.CODDOC}</option>`
        })        
        document.getElementById('cmbCoddoc').innerHTML = strCoddoc;


        GF.get_data_coddoc_correlativo_sucursal(GlobalEmpnit,document.getElementById('cmbCoddoc').value)
        .then((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
        .catch((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})


    })
    .catch(()=>{

        document.getElementById('cmbCoddoc').innerHTML = `<option value=''></option>`;
        document.getElementById('txtCorrelativo').value = '0'
    
    })


    document.getElementById('cmbCoddoc').addEventListener('change',()=>{
        GF.get_data_coddoc_correlativo_sucursal(sucursal,document.getElementById('cmbCoddoc').value)
        .then((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
        .catch((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
    })

    
    //carga cajas
     GF.get_data_cajas_sucursal(GlobalEmpnit)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `<option value="${r.CODCAJA}">${r.DESCAJA}</option>`
        });
        document.getElementById('cmbCaja').innerHTML = str;
    })
    .catch(()=>{
        F.AvisoError('No se cargaron las cajas');
        document.getElementById('cmbCaja').innerHTML ='<option value="1">SIN CAJA</option>';
    })

    //carga empleados
     GF.get_data_empleados_tipo_emp(3,GlobalEmpnit)
    .then((data)=>{
            let str = '';
            data.recordset.map((r)=>{
                str += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>`
            });
            document.getElementById('cmbEmpleados').innerHTML = str;
        })
    .catch(()=>{
            F.AvisoError('No se cargaron los vendedores');
            document.getElementById('cmbEmpleados').innerHTML ='<option value="1">SIN VENDEDOR</option>';
    })


    document.getElementById('txtFecha').value = F.getFecha();


  

     //--------------------------------
    //modal editar cantidad
    //---------------------------
    let btnMCGuardarE = document.getElementById('btnMCGuardarE');
    btnMCGuardarE.addEventListener('click',()=>{

        let cantidad = Number(document.getElementById('txtMCCantidadE').value || 1);
        let preciounitario = Number(document.getElementById('txtMCPrecioE').value||0);
        let descuento =Number(document.getElementById('txtMCDescuentoE').value||0);

            


        let nuevacantidad = Number(cantidad);
        db_devoluciones.update_row(Number(Selected_id),nuevacantidad,preciounitario,descuento)
        .then(()=>{
            $("#modal_editar_cantidad").modal('hide');

            F.showToast('Producto agregado ' + Selected_desprod);
            get_grid_productos();

            
        })
        .catch(()=>{
            F.AvisoError('No se pudo agregar');
        })



    });
    document.getElementById('txtMCCantidadE').addEventListener('input',()=>{
        CalcularTotalPrecioEditar();  
    });
    document.getElementById('txtMCCantidadE').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            //document.getElementById('txtMCPrecioE').focus();
            document.getElementById('btnMCGuardarE').focus();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            //document.getElementById('txtMCPrecioE').focus();
            document.getElementById('btnMCGuardarE').focus();
        };  
    });
    document.getElementById('txtMCPrecioE').addEventListener('input',()=>{
        CalcularTotalPrecioEditar();  
    });
    document.getElementById('txtMCPrecioE').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            document.getElementById('btnMCGuardarE').focus();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            document.getElementById('btnMCGuardarE').focus();
        };  
    });
    document.getElementById('txtMCDescuentoE').addEventListener('keyup',(e)=>{
        if (e.code === 'Enter') { 
            document.getElementById('btnMCGuardarE').focus();
        };
        if (e.keyCode === 13 && !e.shiftKey) {
            document.getElementById('btnMCGuardarE').focus();
        };  
    });

    //--------------------------------
    //modal editar cantidad
    //--------------------------------


    let btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click',()=>{

        F.Aviso('esperameee...')
        return;

            get_grid_productos();
          

            F.Confirmacion('¿Está seguro que desea GUARDAR este Documento?')
            .then((value)=>{
                if(value==true){
                    
                    if(global_var_total_precio==0){F.AvisoError('Agregue productos al documento');return;};
                    let codclie = document.getElementById('txtCodclie').value || '';
                    if(codclie.toString()==''){F.AvisoError('No se selecciono una Factura');return;}

                    let sucursal = document.getElementById('cmbSucursal').value;
                    let coddoc = document.getElementById('cmbCoddoc').value;

                    btnGuardar.disabled = true;
                    btnGuardar.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                    F.showToast('Obteniendo el correlativo del documento a generar');

                    GF.get_data_coddoc_correlativo_sucursal(sucursal,coddoc)
                    .then((correlativo)=>{
        
                                document.getElementById('txtCorrelativo').value = correlativo;
                    
                                insert_documento()
                                .then(()=>{

                                    F.Aviso('Documento Creado Exitosamente!!');

                                    btnGuardar.disabled = false;
                                    btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;

                                    clean_data();

                                    
                                    get_grid_productos();

                                })
                                .catch((error)=>{
                                    
                                    console.log(error);

                                    F.AvisoError('No se pudo crear el documento');

                                    btnGuardar.disabled = false;
                                    btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;

                                })
                    })
                    .catch((correlativo)=>{

                        document.getElementById('txtCorrelativo').value = correlativo;
                        F.AvisoError('No se logro obtener el correlativo');

                        btnGuardar.disabled = false;
                        btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;

                    })

                  
                   
                   


                }
            })




    });


};


function get_data_embarques_pendientes(){


     return new Promise((resolve,reject)=>{

        console.log('intenta cargar...')

        axios.post(GlobalUrlCalls + '/repartidor/embarques_repartidor',{
            sucursal:GlobalEmpnit,
            codrep:GlobalCodUsuario
         })      
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

function get_tbl_embarques_pendientes(){

    let container = document.getElementById('tblEmbarques');
    container.innerHTML = GlobalLoader;

    get_data_embarques_pendientes()
    .then((data)=>{
        let str = ''; let strClassFinalizado = '';
        data.recordset.map((r)=>{
            if(r.FINALIZADO=='SI'){
                strClassFinalizado='border-danger bg-danger text-white'
            }else{
                strClassFinalizado='border-info'
            }
            str += `
            <div class="card card-rounded ${strClassFinalizado} col-12 hand shadow">
                <div class="card-body p-4 text-center" id="">
                    <h5 class="negrita text-info">${r.RUTA}</h5>    
                    <h5>${r.CODEMBARQUE}</h5>
                    <label class="negrita text-danger">Fecha: ${F.convertDateNormal(r.FECHA)}</label>
                    <div class="row">
                        <div class="col-6">
                            <button class="btn btn-secondary btn-lg hand shadow" onclick="get_mapa_embarque('${r.CODEMBARQUE}')">
                                <i class="fal fa-map"></i> Mapa
                            </button>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-info btn-lg hand shadow" onclick="get_data_embarque('${r.CODEMBARQUE}')">
                                <i class="fal fa-list"></i> Facturas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <br>
            `
        })
        container.innerHTML = str;
    })
    .catch((err)=>{
        console.log('embarque no cargados')
        console.log(err);
        container.innerHTML = 'No hay datos...';
    })

}


function get_data_embarque(codembarque){

    document.getElementById('tab-dos').click();

    document.getElementById('lbEmbarque').innerText = codembarque;


    get_tbl_documentos_embarque(codembarque);


};

function get_data_documentos_embarque(codembarque){

    return new Promise((resolve,reject)=>{
        console.log('intenta cargar...')

        axios.post('/repartidor/embarque_documentos',{
            sucursal:GlobalEmpnit,
            codembarque:codembarque
         })
         .then((response) => {
             console.log('pasa por aqui...')
             let data = response.data;
             /*
             if(Number(data.rowsAffected[0])>0){
                 resolve(data);             
             }else{
                 reject();
             } */            
             if(response=='error'){reject()}else{resolve(data)}
         }, (error) => {
            console.log('error en solicitud')
            console.log(error);
             reject();
         });


    })

};

function get_tbl_documentos_embarque(codembarque){

    let container = document.getElementById('tblDataDocumentos');
    container.innerHTML = GlobalLoader;


    get_data_documentos_embarque(codembarque)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `
            <tr>
                <td>
                    ${r.TIPONEGOCIO} ${r.NEGOCIO}
                    <br>
                    <small class="negrita text-info">${r.CLIENTE}</small>
                    <br>
                    <small>${r.DIRECCION},${r.MUNICIPIO}</small>
                    <br>
                    <small class="text-info">Doc:${r.CODDOC}-${r.CORRELATIVO}</small>
                    <br>
                    <small class="text-danger negrita">${r.VENDEDOR.toUpperCase()}</small>
                    <br>
                    <div class="row">
                        <div class="col-6">
                            <button class="btn btn-base btn-md hand shadow col-12"
                            onclick="get_detalle_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.TIPONEGOCIO}','${r.NEGOCIO}','${r.CLIENTE}')">
                                <i class="fal fa-list"></i>&nbsp Ver Detalle
                            </button>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-primary btn-md hand shadow col-12"
                            onclick="get_devolucion_factura('${codembarque}','${r.CODDOC}','${r.CORRELATIVO}','${r.TIPONEGOCIO}','${r.NEGOCIO}','${r.CLIENTE}')">
                                <i class="fal fa-download"></i>&nbsp Devolucion
                            </button>
                        </div>
                    </div>
                </td>
                <td>${F.setMoneda(r.IMPORTE,'Q')}
                    <br><br>
                    <button class="btn btn-circle btn-md hand shadow btn-info"
                    onclick="F.gotoGoogleMaps('${r.LAT}','${r.LONG}')">
                        <i class="fal fa-map-marker"></i>
                    </button>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
    })
    .catch(()=>{
        container.innerHTML = 'No hay datos...';
    })
};


function get_detalle_factura(coddoc,correlativo,tiponegocio,negocio,cliente){

    document.getElementById('tab-tres').click();


      let container = document.getElementById('tblDataDetalle');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;

    GF.get_data_detalle_documento(GlobalEmpnit,coddoc,correlativo)
    .then((data)=>{
        let str = "";

        data.recordset.map((r)=>{
            varTotal += Number(r.TOTALPRECIO);
            str += `
            <tr>
                <td>${r.DESPROD}
                    <br>
                    <small class="negrita text-danger">${r.CODPROD}</small>
                </td>
                <td>${r.CODMEDIDA}</td>
                <td>${r.CANTIDAD}</td>
                <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbDetalleTotal').innerHTML = F.setMoneda(varTotal,'Q');

    })
    .catch(()=>{
        container.innerHTML = 'No hay datos...';
        document.getElementById('lbDetalleTotal').innerHTML = '';

    })



};


function get_mapa_embarque(codembarque){

    document.getElementById('tab-cuatro').click();

    document.getElementById('lbEmbarqueMapa').innerText = codembarque;


    cargarMapaClientes(codembarque);


};

// mapa

function showUbicacion(){
    return new Promise((resolve,reject)=>{
        try {
            navigator.geolocation.getCurrentPosition(function (location) {
                console.log(location);
                resolve(location);
            })
        } catch (error) {
            reject();
        }
    })
};

function Lmap(lat,long){

    //INICIALIZACION DEL MAPA            
      var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(osmUrl, {center: [lat, long],maxZoom: 20, attribution: osmAttrib});    
      map = L.map('mapcontainer').setView([lat, long], 11).addLayer(osm);

      var userIcon = L.icon({
        iconUrl: '../img/userIcon.png',
        shadowUrl: '../img/marker-shadow.png',
    
        iconSize:     [30, 45], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

      L.marker([lat, long],{icon:userIcon})
        .addTo(map)
        .bindPopup('Mi Ubicación', {closeOnClick: true, autoClose: false})   
        .openPopup()
                
      return map;
};

function cargarMapaClientes(codembarque){

    document.getElementById('container_mapa').innerHTML = GlobalLoader;
    //carga la ubicación actual y general el mapa
    showUbicacion()
    .then((location)=>{
            let lat = location.coords.latitude.toString();
            let longg = location.coords.longitude.toString();
            //Number(lat),Number(longg));
            clientes_embarque(codembarque,'container_mapa',Number(lat),Number(longg))
            
    });

};


function clientes_embarque(codembarque,idContenedor, lt, lg){

    let container = document.getElementById(idContenedor);
    container.innerHTML = GlobalLoader;
    
    let tbl = `<div class="mapcontainer5" id="mapcontainer"></div>`;        
    
    container.innerHTML = tbl;
    
    let mapcargado = 0;
    var map;
    map = Lmap(lt, lg);

    get_data_documentos_embarque(codembarque)
    .then((response) => {
        const data = response.recordset;

        data.map((rows)=>{
           
                L.marker([rows.LAT, rows.LONG])
                .addTo(map)
                .bindPopup(`${rows.TIPONEGOCIO} ${rows.NEGOCIO}<br>${rows.CLIENTE}<br><small>${rows.DIRECCION}</small><br><small>${F.setMoneda(rows.IMPORTE,'Q')}</small>`, {closeOnClick: true, autoClose: true})   
                .on('click', function(e){
                    GlobalMarkerId = Number(e.sourceTarget._leaflet_id);
                    //agregar function 
                })
            
        })

        //RE-AJUSTA EL MAPA A LA PANTALLA
        setTimeout(function () {
            try {
                map.invalidateSize();    
            } catch (error) {
                
            }
        }, 500);

    }, (error) => {
        F.AvisoError('Error en la solicitud');
        container.innerHTML = '';
    });
       
};



function get_devolucion_factura(codembarque,coddoc,correlativo,tiponegocio,negocio,cliente){

    document.getElementById('tab-cinco').click();

    document.getElementById('txtCodembarque').value = codembarque;
    document.getElementById('cmbCoddocFac').value = coddoc;
    document.getElementById('cmbCorrelativoFac').value = correlativo;

    load_grid_productos(GlobalEmpnit,coddoc,correlativo)



};

function load_grid_productos(sucursal,codoc,correlativo){


    F.showToast('Eliminando datos anteriores');

    db_devoluciones.deleteTempVenta_pos()
    .then(()=>{

        GF.get_data_detalle_documento(sucursal,codoc,correlativo)
        .then((data)=>{
            
            F.showToast('Cargando datos...')

            data.recordset.map((r)=>{

                    let datos = 
                    {
                        CODSUCURSAL: sucursal.toString(),
                        EMPNIT: sucursal.toString(),
                        USUARIO:'',
                        CODPROD: r.CODPROD.toString(),
                        DESPROD: r.DESPROD.toString(),
                        CODMEDIDA: r.CODMEDIDA.toString(),
                        EQUIVALE: Number(r.EQUIVALE),
                        COSTO: Number(r.COSTO),
                        TOTALCOSTO: Number(r.TOTALCOSTO),
                        PRECIO: Number(r.PRECIO),
                        CANTIDAD: Number(r.CANTIDAD),
                        TOTALUNIDADES: Number(r.TOTALUNIDADES),
                        TOTALPRECIO: Number(r.TOTALPRECIO),
                        EXENTO: Number(0),
                        TIPOPROD: r.TIPOPROD,
                        TIPOPRECIO: r.TIPOPRECIO,
                        EXISTENCIA: Number(r.EXISTENCIA),
                        BONO: Number(0),
                        DESCUENTO: Number(r.DESCUENTO)
                    };


                    db_devoluciones.insertTempVentasPOS(datos);

            })

            get_grid_productos();

        })
        .catch(()=>{
            F.AvisoError('No se cargaron datos');
        })


    })

        


};

function get_grid_productos(){

    let container = document.getElementById('tblDataProductos');
    container.innerHTML = GlobalLoader;

    document.getElementById('lbTotal').innerText = '---';
    let varTotal = 0;
    let varTotalCosto = 0;

    db_devoluciones.selectTempVentasPOS()
    .then((datos)=>{

        let str = '';
        datos.map((r)=>{

            varTotal += Number(r.TOTALPRECIO);
            varTotalCosto += Number(r.TOTALCOSTO);
            str += `
            <tr>
                <td>${r.DESPROD}
                    <br>
                    <small class="negrita text-danger">${r.CODPROD}</small>
                </td>
                <td>${r.CODMEDIDA}</td>
                <td>${r.CANTIDAD}</td>
                <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td>
                    <button class="btn btn-info btn-md btn-circle hand shadow"
                    onclick="edit_item('${r.ID}','${r.CODPROD}','${r.DESPROD}','${r.CODMEDIDA}','${r.EQUIVALE}','${r.CANTIDAD}','${r.COSTO}','${r.PRECIO}','${r.TIPOPROD}','${r.EXENTO}','${r.EXISTENCIA}','${r.BONO}','${r.DESCUENTO}')">
                        <i class="fal fa-edit"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-danger btn-md btn-circle hand shadow"
                    onclick="delete_item('${r.ID}')">
                        <i class="fal fa-trash"></i>
                    </button>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotal').innerText = F.setMoneda(varTotal,'Q');
        global_var_total_costo = Number(varTotalCosto);
        global_var_total_precio = Number(varTotal);
    })

};
function delete_item(id){

    F.Confirmacion('¿Está seguro que desea Quitar este item?')
    .then((value)=>{
        if(value==true){

            db_devoluciones.deleteItemVentaPOS(id)
            .then(()=>{
                get_grid_productos();
            })

        }
    })

};
function edit_item(id,codprod,desprod,codmedida,equivale,cantidad,costo,precio,tipoprod,exento,existencia,bono,descuento){

    $("#modal_editar_cantidad").modal('show');

    Selected_id = id;
    Selected_codprod = codprod;
    Selected_desprod = desprod;
    Selected_codmedida = codmedida;
    Selected_equivale = Number(equivale);
    Selected_costo = Number(costo);
    Selected_precio = Number(precio);
    Selected_tipoprod = tipoprod;
    Selected_exento = Number(exento);
    Selected_existencia = Number(existencia);
    Selected_bono = Number(bono)

    document.getElementById('lbCantidadDesprodE').innerText = `${desprod} (${codmedida} - Eq: ${equivale})`;

    document.getElementById('txtMCCantidadE').value = cantidad;
    document.getElementById('txtMCPrecioE').value = precio;
    document.getElementById('txtMCDescuentoE').value = descuento;

    CalcularTotalPrecioEditar();

    document.getElementById('txtMCCantidadE').focus();
};
function CalcularTotalPrecioEditar(){

    let cantidad = document.getElementById('txtMCCantidadE').value || 1;
    let precio = document.getElementById('txtMCPrecioE').value;
    
    document.getElementById('txtMCTotalPrecioE').value = (Number(cantidad)*Number(precio));

};

