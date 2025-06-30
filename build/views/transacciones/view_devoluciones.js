
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
            
            ${view.frag_encabezado()}
            <br>
            ${view.frag_listado_productos()}


            ${view.modal_listado_facturas()}

            `
        },
        frag_encabezado:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">

                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <div class="form-group">
                                <label>Sucursal</label>
                                <select class="form-control negrita text-danger" id="cmbSucursal">
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <h3 class="negrita text-danger" id="lbNomclie"></h3>
                            <h5 class="text-secondary negrita" id="lbDocumento"></h5>
                            <select class="form-control negrita text-secondary" id="cmbEmpleados">
                            </select>
                        </div>
                    </div>
                                   
                </div>
            </div>
         
            `
        },
        frag_listado_productos:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">

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

            <button class="btn btn-bottom-r btn-success btn-circle btn-xl hand shadow" id="btnNuevo">
                <i class="fal fa-plus"></i>
            </button>
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
                                            <input type="text"
                                            class="border-danger text-danger form-control"
                                            placeholder="Escriba para buscar..."
                                            oninput="F.FiltrarTabla('tblFacturas','txtBuscarFac')"
                                            id="txtBuscarFac">
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
    })
    .catch(()=>{
        cmbSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
    })

    cmbSucursal.addEventListener('change',()=>{

        get_empleados();


    })


    
  

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
    })
     document.getElementById('txtFechaFinalFac').addEventListener('change',()=>{
        get_listado_factura();
    })





};

function initView(){

    getView();
    addListeners();

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
                onclick="get_datos_factura('${r.CODDOC}','${r.CORRELATIVO}','${F.limpiarTexto(r.NOMBRE)}','${r.CODEMP}')">
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


function get_datos_factura(coddoc,correlativo,nomclie,codemp){

    document.getElementById('lbNomclie').innerText = nomclie;
    document.getElementById('lbDocumento').innerText = `${coddoc}-${correlativo}`;
    
    
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

    db_devoluciones.selectTempVentasPOS()
    .then((datos)=>{

        let str = '';
        datos.map((r)=>{
            varTotal += Number(r.TOTALPRECIO);
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






function data_listado_factura(){
    
    return new Promise((resolve,reject)=>{

        
    })

};
