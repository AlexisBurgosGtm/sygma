
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_devolucion()}
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
        vista_devolucion:()=>{
            return `
            
            <div class="row">
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                    ${view.frag_encabezado()}
                </div>
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                    ${view.frag_listado_productos()}
                </div>
            </div>

            
          
            

            <button class="hidden btn btn-bottom-l btn-success btn-circle btn-xl hand shadow">
                <i class="fal fa-plus"></i>
            </button>

             <button class="btn btn-bottom-r btn-info btn-circle btn-xl hand shadow" id="btnGuardar">
                <i class="fal fa-save"></i>
            </button>

            
            ${view.modal_listado_facturas()}

            `
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
        frag_listado_productos:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-2">

                    <div class="row">
                        <div class="col-6">
                            <h5 class="negrita text-base">Productos devueltos</h5>
                
                        </div>
                        <div class="col-6 text-right">
                            <h2 class="negrita text-danger" id="lbTotal"></h2>
                        </div>

                    </div>

                  
                    <div class="table-responsive col-12">
                        <table class="table table-responsive table-hover h-full col-12">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>CODIGO</td>
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

          
            `
        },
        modal_listado_facturas:()=>{
            return `
              <div id="modal_listado_facturas" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                SELECCIONE LA FACTURA
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                    <div class="row">
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="negrita text-secondary">Del</label>
                                                <input type="date" class="form-control" id="txtFechaInicialFac">
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-group">
                                                <label class="negrita text-secondary">Al</label>
                                                <input type="date" class="form-control" id="txtFechaFinalFac">
                                            </div>
                                        </div>
                                    </div>

                                    <br>
                                    <div class="row">
                                        
                                        <div class="form-group">
                                            <input type="text" class="border-danger text-danger form-control col-12" placeholder="Escriba para buscar..."
                                            oninput="F.FiltrarTabla('tblFacturas','txtBuscarFac')" id="txtBuscarFac">
                                        </div>

                                        <table class="col-12 h-full table table-bordered table-hover" id="tblFacturas">
                                            <thead class="bg-secondary text-white">
                                                <tr>
                                                    <td>FECHA</td>
                                                    <td>FACTURA</td>
                                                    <td>CLIENTE</td>
                                                    <td>VENDEDOR</td>
                                                    <td>IMPORTE</td>
                                                    <td></td>
                                                </tr>
                                            </thead>
                                            <tbody id="tblDataFacturas"></tbody>
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

    
    
    let cmbSucursal = document.getElementById('cmbSucursal');

    GF.get_data_empresas()
    .then((data)=>{
            let str = '';
            data.recordset.map((r)=>{
                str += `
                    <option value="${r.EMPNIT}">${r.NOMBRE}</option>
                `
            })
            cmbSucursal.innerHTML = str;
            cmbSucursal.value = GlobalEmpnit;

            get_empleados();

            get_coddoc();

            get_cajas();
    })
    .catch(()=>{
        cmbSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
    })

    cmbSucursal.addEventListener('change',()=>{

        get_empleados();
        get_coddoc();
        get_cajas();

    })

    document.getElementById('txtFecha').value = F.getFecha();


  
    db_devoluciones.deleteTempVenta_pos();
  

    document.getElementById('btnNuevo').addEventListener('click',()=>{
        
        if(cmbSucursal.value==''){
            F.AvisoError('No se ha cargardo la lista de Sucursales');
        }else{
            
            
            $('#modal_listado_facturas').modal('show');
            get_listado_factura();

        }

       
    });



    document.getElementById('txtFechaInicialFac').value = F.getFecha();
    document.getElementById('txtFechaFinalFac').value = F.getFecha();
    document.getElementById('txtFechaInicialFac').addEventListener('change',()=>{
        get_listado_factura();
    });
    document.getElementById('txtFechaFinalFac').addEventListener('change',()=>{
        get_listado_factura();
    });



    let btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click',()=>{

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




    })



};

function initView(){

    getView();
    addListeners();

};

function get_cajas(){

    let sucursal = document.getElementById('cmbSucursal').value;

    GF.get_data_cajas_sucursal(sucursal)
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

};

function get_coddoc(){

    let sucursal = document.getElementById('cmbSucursal').value;

    GF.get_data_tipodoc_coddoc_sucursal(sucursal,'DEV')
    .then((data)=>{

        let strCoddoc = ''
        data.recordset.map((r)=>{
            strCoddoc += `<option value="${r.CODDOC}">${r.CODDOC}</option>`
        })        
        document.getElementById('cmbCoddoc').innerHTML = strCoddoc;


        GF.get_data_coddoc_correlativo_sucursal(sucursal,document.getElementById('cmbCoddoc').value)
        .then((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
        .catch((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})


    })
    .catch(()=>{

        document.getElementById('cmbCoddoc').innerHTML = `<option value=''></option>`;
        document.getElementById('txtCorrelativo').value = '0'
    
    })


};



function get_empleados(){

        let sucursal = document.getElementById('cmbSucursal').value;

        GF.get_data_empleados_tipo_emp(3,sucursal)
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


};



function get_listado_factura(){


    let fi = F.devuelveFecha('txtFechaInicialFac');
    let ff = F.devuelveFecha('txtFechaFinalFac');
    let sucursal = document.getElementById('cmbSucursal').value;


    let container = document.getElementById('tblDataFacturas');
    container.innerHTML = GlobalLoader;


    GF.get_data_documentos_fechas(sucursal,'FAC',fi,ff)
    .then((data)=>{
        let str ='';
        data.recordset.map((r)=>{
            str+= `
            <tr class="hand"
                onclick="get_datos_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.CODCLIENTE}','${r.NIT}','${F.limpiarTexto(r.NOMBRE)}','${F.limpiarTexto(r.DIRECCION)}','${r.CODEMP}','${r.CODEMBARQUE}')">
                <td>${F.convertDateNormal(r.FECHA)}</td>
                <td>${r.CODDOC}-${r.CORRELATIVO}</td>
                <td>${F.limpiarTexto(r.NOMBRE)}</td>
                <td>${r.EMPLEADO}</td>
                <td>${F.setMoneda(r.TOTALVENTA,'Q')}</td>
                <td></td>
            </tr>
            `
        })
        container.innerHTML = str;

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
    })

};


function get_datos_factura(coddoc,correlativo,codclie,nit,nomclie,dirclie,codemp,codembarque){


    document.getElementById('lbNomclie').innerText = nomclie;
    document.getElementById('txtCodclie').value = codclie;
    document.getElementById('txtNit').value = nit;
    
    document.getElementById('lbDirclie').innerText = dirclie;
    

    document.getElementById('cmbCoddocFac').value = coddoc;
    document.getElementById('cmbCorrelativoFac').value = correlativo;
    document.getElementById('txtCodembarque').value = codembarque;
    
    
    
    let sucursal = document.getElementById('cmbSucursal').value;


    document.getElementById('cmbEmpleados').value = codemp;

     $('#modal_listado_facturas').modal('hide');


    load_grid_productos(sucursal,coddoc,correlativo)


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
                <td>${r.CODPROD}</td>
                <td>${r.DESPROD}</td>
                <td>${r.CODMEDIDA}</td>
                <td>${r.CANTIDAD}</td>
                <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                <td>
                    <button class="btn btn-info btn-md btn-circle hand shadow">
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

}




function insert_documento(){


        let sucursal = document.getElementById('cmbSucursal').value;
        let coddoc = document.getElementById('cmbCoddoc').value;
        let correlativo = document.getElementById('txtCorrelativo').value;
        let codemp = document.getElementById('cmbEmpleados').value;
        let caja = document.getElementById('cmbCaja').value;


        let codembarque = document.getElementById('txtCodembarque').value;
    
        let codclie = document.getElementById('txtCodclie').value || '';
        let nomclie = document.getElementById('lbNomclie').innerText;
        let nit = document.getElementById('txtNit').value;
        let dirclie = document.getElementById('lbDirclie').innerText;
        let obs = document.getElementById('cmbObs').value;


        let coddoc_origen = document.getElementById('cmbCoddocFac').value || '';
        let correlativo_origen = document.getElementById('cmbCorrelativoFac').value;

    
        let anio = 0;
        let mes = 0;
        let fecha = F.devuelveFecha('txtFecha');
        let hora = F.getHora();

        return new Promise((resolve, reject)=>{


                db_devoluciones.gettempDocproductos_pos(GlobalUsuario)
                .then((response)=>{
              
                        axios.post('/documentos/insert_devolucion', {
                                jsondocproductos:JSON.stringify(response),
                                sucursal:sucursal,
                                codembarque:codembarque,
                                coddoc:coddoc,
                                correlativo: correlativo,
                                serie_fac:coddoc,
                                numero_fac:correlativo,
                                coddoc_origen:coddoc_origen,
                                correlativo_origen:correlativo_origen,
                                anio:anio,
                                mes:mes,
                                fecha:fecha,
                                fechaentrega:fecha,
                                formaentrega:'',
                                codbodega:'0',
                                codcaja:caja,
                                codcliente: codclie, 
                                nomclie:nomclie,
                                totalcosto:global_var_total_costo,
                                totalprecio:global_var_total_precio,
                                totaldescuento:0,
                                nitclie:nit,
                                dirclie:dirclie,
                                obs:F.limpiarTexto(obs),
                                direntrega:'',
                                usuario:GlobalUsuario,
                                codven:codemp,
                                lat:'0',
                                long:'0',
                                hora:hora,
                                tipo_pago:'CON',
                                tipo_doc:'DEV',
                                entrega_contacto:'',
                                entrega_telefono:'',
                                entrega_direccion:'',
                                entrega_referencia:'',
                                entrega_lat:'0',
                                entrega_long:'0',
                                iva:GlobalConfigIVA,
                                etiqueta:'BAJA'
                        })
                        .then((response) => {

                                if(response.status.toString()=='200'){
                                    let data = response.data;
                                    if(data.toString()=="error"){
                                        reject('error');
                                    }else{
                                    
                                        if(data.rowsAffected[0].toString()=='0'){
                                            reject('sin filas');           
                                        }else{
                                            resolve();  
                                        } 
                                    }       
                                }else{
                                    reject('error');
                                }          
                                
                        }, (error) => {
                            reject(error);
                        });  
                })
            
        })

        




};

function clean_data(){


        let sucursal = document.getElementById('cmbSucursal').value;
        
        GF.get_data_coddoc_correlativo_sucursal(sucursal,document.getElementById('cmbCoddoc').value)
        .then((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})
        .catch((correlativo)=>{document.getElementById('txtCorrelativo').value = correlativo})



        document.getElementById('txtCodembarque').value='';
    
        document.getElementById('txtCodclie').value='';
        document.getElementById('lbNomclie').innerText='';
        document.getElementById('txtNit').value='';
        document.getElementById('lbDirclie').innerText='';
        
        document.getElementById('cmbCoddocFac').value='';
        document.getElementById('cmbCorrelativoFac').value='';



};