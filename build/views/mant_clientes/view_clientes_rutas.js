
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado() + view.modal_datos()}
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
            <div class="card card-rounded shadow">
                <div class="card-body p-4">

                    <h5 class="negrita text-danger">Rutas de Cliente</h5>
                    <br>

                    <div class="table-responsive col-12">
                        <table class="table table-responsive table-hover col-12 h-full">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>CODIGO</td>
                                    <td>RUTA</td>
                                    <td>EMPLEADO</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblDataRutas">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            <button class="btn btn-bottom-r btn-circle btn-xl btn-success hand shadow" id="btnNuevo">
                <i class="fal fa-plus"></i>
            </button>

            `
        },
        modal_datos:()=>{
            return `
              <div id="modal_datos" class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Datos de la Ruta
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">


                                <div class="form-group">
                                    <label class="negrita">CODIGO</label>
                                    <input type="number" class="negrita form-control" id="txtCodRuta">
                                </div>


                                
                                <div class="form-group">
                                    <label class="negrita">RUTA</label>
                                    <input type="text" class="negrita form-control" id="txtDesRuta">
                                </div>

                                
                                <div class="form-group">
                                    <label class="negrita">VENDEDOR</label>
                                    <select class="negrita form-control" id="cmbEmpleado">
                                    </select>

                                </div>







                                <div class="row">
                                    <div class="col-6">
                                        <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                            <i class="fal fa-arrow-left"></i>
                                        </button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-info btn-circle btn-xl hand shadow" id="btnGuardar">
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


    document.getElementById('btnNuevo').addEventListener('click',()=>{

            $('#modal_datos').modal('show');

            document.getElementById('txtCodRuta').value = '0';
            document.getElementById('txtDesRuta').value = '';
        
    });




    GF.get_data_empleados_tipo(3)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `<option value="${r.CODEMPLEADO}">${r.NOMEMPLEADO}</option>`
        });
        document.getElementById('cmbEmpleado').innerHTML = str;
    })
    .catch(()=>{
        F.AvisoError('No se cargaron los vendedores');
        document.getElementById('cmbEmpleado').innerHTML ='<option value="0">SIN VENDEDOR</option>';
    })




    let btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click',()=>{

        let codigo = document.getElementById('txtCodRuta').value || '0';
        let ruta = document.getElementById('txtDesRuta').value || '';
        let codemp = document.getElementById('cmbEmpleado').value;

        if(codigo=='0'){F.AvisoError('Indique un codigo de ruta');return;};
        if(ruta==''){F.AvisoError('Escriba un nombre para la Ruta');return;};
        

        F.Confirmacion('¿Está seguro que desea CREAR esta ruta?')
        .then((value)=>{
            if(value==true){

                btnGuardar.disabled = true;
                btnGuardar.innerHTML = `<i class="fal fa-spin fa-save"></i>`;

                GF.get_data_rutas_insert(GlobalEmpnit,codigo,ruta,codemp)
                .then(()=>{

                    F.Aviso('Ruta creada exitosamente!!');

                    $('#modal_datos').modal('hide');

                    tbl_rutas();

                    btnGuardar.disabled = false;
                    btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;

                })
                .catch(()=>{

                    F.AvisoError('No se pudo crear, verifique si no esta usando un codigo repetido');

                    btnGuardar.disabled = false;
                    btnGuardar.innerHTML = `<i class="fal fa-save"></i>`;

                })


            }
        })

    });



    tbl_rutas();



};

function initView(){

    getView();
    addListeners();

};




function tbl_rutas(){


        let container = document.getElementById('tblDataRutas');
        container.innerHTML = GlobalLoader;
        

        GF.get_data_rutas_select(GlobalEmpnit)
        .then((data)=>{

            let str = '';
            data.recordset.map((r)=>{
                str += `
                <tr>
                    <td>${r.CODRUTA}</td>
                    <td>${r.RUTA}</td>
                    <td>${r.EMPLEADO}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                `
            })

            container.innerHTML = str;


        })
        .catch(()=>{
                container.innerHTML = 'No se cargaron datos...'

        })




}