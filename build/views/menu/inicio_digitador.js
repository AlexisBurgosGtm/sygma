
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
                            ${view.vista_embarques() + view.vista_embarques_modal_datos()}
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

            <br>

            <div class="row">

                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                    
                    <div class="card card-rounded shadow col-12 hand"  onclick="document.getElementById('tab-cuatro').click()">
                        <div class="card-body p-4">
                            
                            <h4>EMBARQUES</h4>
                            <h1 class="negrita text-danger" id="lbTotalEP"></h1>
                            
                        </div>
                    </div>
                    

                </div>
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6" >
                    
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">

                           
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
        },
        vista_embarques:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                    <h4 class="negrita text-base">EMBARQUES - (GESTION DE PICKING)</h4>

                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label class="negrita text-secondary">Seleccione mes y año</label>
                                <div class="input-group">
                                    <select class="form-control negrita" id="cmbMes"></select>
                                    <select class="form-control negrita" id="cmbAnio"></select>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            
                            <div class="form-group">
                                <label class="negrita text-secondary">Filtrar por</label>
                                <div class="input-group">
                                    <select class="form-control negrita" id="cmbStatus">
                                        <option value="NO">PENDIENTES</option>
                                        <option value="SI">FINALIZADOS</option>
                                    </select>
                                    
                                </div>
                            </div>

                        </div>
                    </div>
                
                </div>
            </div>
            
            <br>

            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">

                    <div class="table-responsive">
                        
                        <table class="table col-12 h-full">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>FECHA</td>
                                    <td>EMBARQUE</td>
                                    <td>REPARTIDOR</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblDatalEmbarques">
                            
                            </tbody>

                        </table>

                    </div>
                           
                </div>
            </div>

            <button class="btn btn-secondary btn-xl btn-circle hand shadow btn-bottom-l" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>

            <button class="btn btn-success btn-xl btn-circle hand shadow btn-bottom-r" id="btnEmbarquesNuevo">
                <i class="fal fa-plus"></i>
            </button>

            `

        },
        vista_embarques_modal_datos:()=>{
            return `
                <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true" id="modal_embarques_nuevo">
                    <div class="modal-dialog modal-dialog-right modal-xl">
                        <div class="modal-content">
                            <div class="modal-body p-2">
                                
                                <div class="card card-rounded">
                                    <div class="card-body p-4">

                                        <div class="row">
                                            <div class="col-6">
                                                <h4 class="negrita text-danger">Datos del Embarque</h4>
                                            </div>
                                            <div class="col-6">
                                                <div class="form-group">
                                                    <label class="negrita text-secondary">Fecha</label>
                                                    <input type="date" class="form-control" id="txtEmbarqueFecha">
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <br>

                                        <div class="form-group">
                                            <label class="negrita text-secondary">Código Embarque</label>
                                            <div class="input-group">
                                                <input type="text" class="form-control"  id="txtEmbarqueCodigo">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="negrita text-secondary">Descripción</label>
                                            <input type="text" class="form-control" id="txtEmbarqueDescripcion">
                                        </div>

                                        <div class="form-group">
                                            <label class="negrita text-secondary">Ruteo</label>
                                            <input type="text" class="form-control" id="txtEmbarqueRuteo">
                                        </div>

                                        <div class="form-group">
                                            <label class="negrita text-secondary">Repartidor</label>
                                            <select class="form-control" id="cmbEmbarqueEmpleado">
                                            </select>
                                        </div>

                                        <br>
                                        <div class="row">
                                            <div class="col-6">
                                                 <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                                    <i class="fal fa-arrow-left"></i>
                                                </button>
                                            </div>
                                            <div class="col-6">
                                                 <button class="btn btn-info btn-circle btn-xl hand shadow" id="btnEmbarqueGuardar">
                                                    <i class="fal fa-save"></i>
                                                </button>
                                            </div>

                                        </div>

                                    
                                    </div>
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

    tbl_pedidos_pendientes('tblDataPedidos');

    tbl_relleno_inventario('tblDataRelleno');

    listeners_embarques();


};

function initView(){

    getView();
    addListeners();

};


function listeners_embarques(){

        //carga la lista de empleados
        GF.get_data_empleados_tipo(4)
        .then((data)=>{
            let str = '';
            data.recordset.map((r)=>{
                str += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>`
            });
            document.getElementById('cmbEmbarqueEmpleado').innerHTML = str;
        })
        .catch(()=>{
            F.AvisoError('No se cargaron los Repartidores');
            document.getElementById('cmbEmbarqueEmpleado').innerHTML ='<option value="1">SIN REPARTIDOR</option>';
        })



        //listeners
        document.getElementById('cmbMes').innerHTML = F.ComboMeses();
        document.getElementById('cmbAnio').innerHTML = F.ComboAnio();

        document.getElementById('cmbMes').value = F.get_mes_curso();
        document.getElementById('cmbAnio').value = F.get_anio_curso();

        document.getElementById('txtEmbarqueFecha').value = F.getFecha();

        document.getElementById('btnEmbarquesNuevo').addEventListener('click',()=>{
                
            clean_data_embarque();
            $("#modal_embarques_nuevo").modal('show');

        })


        let statusEmbarque = document.getElementById('cmbStatus').value;
        let mes =document.getElementById('cmbMes').value;
        let anio = document.getElementById('cmbAnio').value;

        tbl_embarques('tblDatalEmbarques',statusEmbarque,mes,anio);



        let btnEmbarqueGuardar = document.getElementById('btnEmbarqueGuardar');
        btnEmbarqueGuardar.addEventListener('click',()=>{


            let MesAnio = F.get_mes_anio_fecha('txtEmbarqueFecha');

            let fecha = F.devuelveFecha('txtEmbarqueFecha');
            let anio = MesAnio[1];
            let mes = MesAnio[0];
            
            let codembarque = document.getElementById('txtEmbarqueCodigo').value || ''; 
            let descripcion = document.getElementById('txtEmbarqueDescripcion').value || '';    
            let ruteo  = document.getElementById('txtEmbarqueRuteo').value || '';
            let codempleado = document.getElementById('cmbEmbarqueEmpleado').value; 


                //let boleditar = document.getElementById('txtEmbarqueCodigo').disabled 
                //if(boleditar.toString() == 'false'){
                if(document.getElementById('txtEmbarqueCodigo').disabled==false){
                    //si esta habilitado, es nuevo

                 
                    
                    F.Confirmacion('¿Está seguro que desea CREAR este embarque?')
                    .then((value)=>{
                        if(value==true){

                            btnEmbarqueGuardar.disabled=true;
                            btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                            GF.get_data_embarques_insert(GlobalEmpnit,fecha,mes,anio,codembarque,descripcion,ruteo,codempleado)
                            .then((data)=>{

                                btnEmbarqueGuardar.disabled=false;
                                btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                                
                                F.Aviso('Embarque creado exitosamente!!');

                                $("#modal_embarques_nuevo").modal('hide');

                                tbl_embarques('tblDatalEmbarques',statusEmbarque,mes,anio);

                            })
                            .catch(()=>{
                                F.AvisoError('No se pudo Guardar')
                                btnEmbarqueGuardar.disabled=false;
                                btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save"></i>`;

                            })

                        }
                    })

                }else{
                    //si esta deshabilitado, es edicion
                   
                    F.Confirmacion('¿Está seguro que desea EDITAR este embarque?')
                    .then((value)=>{
                        if(value==true){

                            btnEmbarqueGuardar.disabled=true;
                            btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save fa-spin"></i>`;
        

                            GF.get_data_embarques_edit(GlobalEmpnit,fecha,mes,anio,codembarque,descripcion,ruteo,codempleado)
                            .then((data)=>{

                                btnEmbarqueGuardar.disabled=false;
                                btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save"></i>`;

                                F.Aviso('Embarque editado exitosamente!!');

                                
                                $("#modal_embarques_nuevo").modal('hide');

                                

                                tbl_embarques('tblDatalEmbarques',statusEmbarque,mes,anio);

                            })
                            .catch(()=>{
                                    F.AvisoError('No se pudo Editar este embarque')
                                    btnEmbarqueGuardar.disabled=false;
                                    btnEmbarqueGuardar.innerHTML = `<i class="fal fa-save"></i>`;
                                
                            })


                        }
                    })

                }

            




        })





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


function tbl_embarques(idContainer,status,mes,anio){

    let container = document.getElementById(idContainer);
    container.innerHTML = GlobalLoader;

    let str = '';
    
    GF.get_data_embarques_listado(GlobalEmpnit,status,mes,anio)
    .then((data)=>{
        

        data.recordset.map((r)=>{
            str += `
                <tr>
                    <td>${F.convertDateNormal(r.FECHA)}</td>
                    <td class="negrita text-danger">${r.CODEMBARQUE}
                        <br>
                        <small class="negrita text-secondary">${r.DESCRIPCION}</small>
                        <br>
                        <small>${r.RUTEO}</small>
                    </td>
                    <td>${r.NOMEMPLEADO}</td>
                    <td>
                        <buttton class="btn btn-md btn-circle hand shadow btn-info" 
                            onclick="get_data_embarque('${r.FECHA}','${r.CODEMBARQUE}','${r.DESCRIPCION}','${r.RUTEO}','${r.CODEMPLEADO}')">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <buttton class="btn btn-md btn-circle hand shadow btn-outline-info">
                            <i class="fal fa-print"></i>
                        </button>
                    </td>
                    <td>
                        <buttton class="btn btn-md btn-circle hand shadow btn-danger">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `
        })


        container.innerHTML = str;
    })
    .catch(()=>{

        container.innerHTML = 'No se cargaron datos...';
    })

};

function clean_data_embarque(){


    document.getElementById('txtEmbarqueCodigo').disabled = false;

    document.getElementById('txtEmbarqueFecha').value = F.getFecha();
    document.getElementById('txtEmbarqueCodigo').value = '';
    document.getElementById('txtEmbarqueDescripcion').value ='';
    document.getElementById('txtEmbarqueRuteo').value ='';
    

}


function get_data_embarque(fecha,codembarque,descripcion,ruteo,codempleado){


    document.getElementById('txtEmbarqueCodigo').disabled = true;

    
    document.getElementById('txtEmbarqueCodigo').value = codembarque;
    document.getElementById('txtEmbarqueDescripcion').value =descripcion;
    document.getElementById('txtEmbarqueRuteo').value =ruteo;

    document.getElementById('cmbEmbarqueEmpleado').value = codempleado;


    document.getElementById('txtEmbarqueFecha').value = fecha.replace("T00:00:00.000Z","");

    $("#modal_embarques_nuevo").modal('show');

};