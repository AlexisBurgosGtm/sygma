function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado() + view.modal_detalle_documento()}
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

            <div class="card card-rounded shadow col-12">
                <div class="card-body p-2">

                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label class="negrita text-base">Tipo Documento</label>
                                <select class="form-control" id="cmbTipos">
                                </select>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label class="negrita text-base">Selecciones Mes y Año</label>
                                <div class="input-group">
                                    <select class="form-control" id="cmbMes">
                                    </select>
                                    <select class="form-control" id="cmbAnio">
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr class="solid">

                    <div class="table-responsive col-12">
                        <table class="table table-hover col-12 h-full" id="tblDocumentos">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>FECHA</td>
                                    <td>DOCUMENTO</td>
                                    <td>NIT</td>
                                    <td>NOMBRE</td>
                                    <td>IMPORTE</td>
                                    <td>FPAGO</td>
                                    <td>ST</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblDataDocumentos">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            `
        },
        modal_detalle_documento:()=>{
            return `
            <div id="modal_tomar_datos_detalle" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-base d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Detalle del Documento
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-2">

                                        <h4 class="negrita text-base" id="lbDetalleTomarDatosNombre"></h4>
                                        <br>

                                        <div class="table-responsive col-12">
                                            <table class="table table-responsive table-bordered table-hover">
                                                <thead class="bg-verde text-white">
                                                    <tr>
                                                        <td>CODIGO</td>
                                                        <td>PRODUCTO</td>
                                                        <td>MARCA</td>
                                                        <td>MEDIDA</td>
                                                        <td>CANTIDAD</td>
                                                        <td>PRECIO</td>
                                                        <td>IMPORTE</td>
                                                    </tr>
                                                </thead>
                                                <tbody id="tblDataTomarDatosDetalle"></tbody>
                                            </table>

                                            <div class="form-group">
                                                <label class="negrita text-base">Observaciones</label>
                                                <textarea class="form-control negrita" id="lbDetaleTomarDatosObs" rows="4"></textarea>
                                            </div>

                                        
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
        }
    }

    root.innerHTML = view.body();

};

function addListeners(){

    document.title = "Documentos";

   
    document.getElementById('cmbMes').innerHTML = F.ComboMeses();
    document.getElementById('cmbAnio').innerHTML = F.ComboAnio();

    let f = new Date();
    document.getElementById('cmbMes').value = f.getMonth()+1;
    document.getElementById('cmbAnio').value = f.getFullYear();


     // CARGA COMBO TIPO DOCUMENTOS
     classTipodocumentos.get_data_tipos()
     .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
             str += `
                 <option value="${r.TIPODOC}">(${r.TIPODOC}) ${r.DESCRIPCION}</option>
             `
        })
        document.getElementById('cmbTipos').innerHTML = str;
        //carga la lista de documentos
        get_documentos();

     })
     .catch(()=>{
         document.getElementById('cmbTipos').innerHTML = '';
     })


   

    document.getElementById('cmbTipos').addEventListener('change',()=>{
        get_documentos();
    });

    document.getElementById('cmbMes').addEventListener('change',()=>{
        get_documentos();
    });

    document.getElementById('cmbAnio').addEventListener('change',()=>{
        get_documentos();
    });


};

function initView(){

    getView();
    addListeners();

};



function get_documentos(){

    let tipo = document.getElementById('cmbTipos').value;
    let anio = document.getElementById('cmbAnio').value;
    let mes = document.getElementById('cmbMes').value;

    let container = document.getElementById('tblDataDocumentos')
    container.innerHTML = GlobalLoader;


    GlobalEntSal = get_tipo_movinv_documento(tipo);



    GF.get_data_documentos(tipo,mes,anio)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `
                <tr class="hand">
                    <td>${F.convertDateNormal(r.FECHA)}</td>
                    <td>${r.CODDOC}-${r.CORRELATIVO}</td>
                    <td>${r.NIT}</td>
                    <td>${r.NOMBRE}</td>
                    <td>${F.setMoneda(r.TOTALVENTA,'Q')}</td>
                    <td>${r.CONCRE}</td>
                    <td>${r.STATUS}</td>
                    <td>
                        <button class="btn btn-md btn-circle hand shadow btn-warning" 
                            onclick="get_detalle_tomar_datos('${r.CODDOC}','${r.CORRELATIVO}','${r.NOMBRE}','${r.ETIQUETA}','${r.OBS}')">
                            <i class="fal fa-list"></i>
                        </button>
                    </td>
                    <td>
                       <button class="btn btn-info btn-md btn-circle hand shadow"
                            onclick="fcn_editar_factura('${r.CODDOC}','${r.CORRELATIVO}','${r.NOMBRE}','${r.DIRECCION}')">
                                <i class="fal fa-edit"></i>
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



   

}



function get_detalle_tomar_datos(coddoc,correlativo,nombre,prioridad,obs){

    $("#modal_tomar_datos_detalle").modal('show');

    document.getElementById('lbDetalleTomarDatosNombre').textContent = nombre;
    document.getElementById('lbDetaleTomarDatosObs').value = obs;

    let container = document.getElementById('tblDataTomarDatosDetalle');
    container.innerHTML = GlobalLoader;


    GF.get_data_detalle_documento(GlobalEmpnit,coddoc,correlativo)
    .then((data)=>{
        let str = "";

        data.recordset.map((r)=>{
            str += `
            <tr>
                <td>${r.CODPROD}</td>
                <td>${r.DESPROD}</td>
                <td>${r.DESMARCA}</td>
                <td>${r.CODMEDIDA}</td>
                <td>${r.CANTIDAD}</td>
                <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
            </tr>
            `
        })
        container.innerHTML = str;

    })
    .catch(()=>{
        container.innerHTML = 'No hay datos...'

    })






};
