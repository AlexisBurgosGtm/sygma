
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado() + view.modal_departamento() + view.modal_municipio() + view.modal_sector()}
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
                <div class="card-body p-4">

                    <h3 class="negrita text-danger">GESTION DE DEPARTAMENTOS - MUNICIPIOS - SECTORES</h3>

                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    ${view.fram_departamentos()}
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    ${view.fram_municipios()}
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    ${view.fram_sectores()}
                </div>
            </div>
            `
        },
        fram_departamentos:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-2">

                    <h5 class="negrita text-base">DEPARTAMENTOS</h5>

                    <div class="table-responsive col-12">   
                        <div class="row">
                            <div class="col-6">
                            </div>
                            <div class="col-6">
                                <button class="btn btn-success btn-md col-12 hand shadow" id="btnNuevoDepartamento">
                                    <i class="fal fa-plus"></i> Nuevo
                                </button>
                            </div>
                        </div>
                        <br>
                        <table class="table h-full table-hover col-12">
                            <thead class="bg-base text-white">
                                <tr>
                                    <td>COD</td>
                                    <td>DEPARTAMENTO</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tbl_data_departamentos">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            `
        },
        fram_municipios:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-2">

                    <h5 class="negrita text-info">MUNICIPIOS</h5>

                    <div class="table-responsive col-12">
                        <div class="row">
                            <div class="col-8">
                                <div class="form-group">
                                    <label>Seleccione un Departamento</label>
                                    <select class="negrita form-control" id="cmbDepartamentos">
                                    </select>
                                </div>
                            </div>
                            <div class="col-4">
                                <button class="btn btn-success btn-xl btn-circle hand shadow" id="btnNuevoMunicipio">
                                    <i class="fal fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <br>
                        <table class="table h-full table-hover col-12">
                            <thead class="bg-info text-white">
                                <tr>
                                    <td>COD</td>
                                    <td>MUNICIPIO</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tbl_data_municipios">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            `
        },
        fram_sectores:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-2">

                    <h5 class="negrita text-secondary">SECTORES (ALDEAS)</h5>

                    <div class="table-responsive col-12">
                        <div class="row">
                            <div class="col-8">
                                <div class="form-group">
                                    <label>Seleccione un Municipio</label>
                                    <select class="negrita form-control" id="cmbMunicipios">
                                    </select>
                                </div>
                            </div>
                            <div class="col-4">
                                <button class="btn btn-success btn-xl btn-circle hand shadow" id="btnNuevoSector">
                                    <i class="fal fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <br>
                        <table class="table h-full table-hover col-12">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <td>COD</td>
                                    <td>SECTOR</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tbl_data_sectores">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            `
        },
        modal_departamento:()=>{
            return `
              <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true"
              id="modal_departamento">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div class="dropdown-header bg-base d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                DATOS DEL DEPARTAMENTO
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                    <div class="form-group">
                                        <label>Codigo Departamento</label>
                                        <input type="text" class="form-control" id="txtCodDepto" disabled="true">
                                    </div>
                                    <div class="form-group">
                                        <label>Nombre Departamento</label>
                                        <input type="text" class="form-control" id="txtDesDepto">
                                    </div>


                                </div>
                            </div>
                                
                            <div class="row">
                                <div class="col-6">
                                    <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                        <i class="fal fa-arrow-left"></i>
                                    </button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-base btn-circle btn-xl hand shadow" id="btnGuardarDepartamento">
                                        <i class="fal fa-save"></i>
                                    </button>
                                </div>

                                
                            </div>

                        </div>
                    
                    </div>
                </div>
            </div>
            `
        },
        modal_municipio:()=>{
            return `
              <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true"
              id="modal_municipio">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div class="dropdown-header bg-info d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                DATOS DEL DEPARTAMENTO
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                    <div class="form-group">
                                        <label></label>
                                        <input type="text" class="form-control" id="txtCodDepto">
                                    </div>
                                    <div class="form-group">
                                        <label></label>
                                        <input type="text" class="form-control" id="txtDesDepto">
                                    </div>


                                </div>
                            </div>
                                
                            <div class="row">
                                <div class="col-6">
                                    <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                        <i class="fal fa-arrow-left"></i>
                                    </button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-base btn-circle btn-xl hand shadow" id="btnGuardarDepartamento">
                                        <i class="fal fa-save"></i>
                                    </button>
                                </div>

                                
                            </div>

                        </div>
                    
                    </div>
                </div>
            </div>
            `
        },
        modal_sector:()=>{
            return `
              <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" role="dialog" aria-hidden="true"
              id="modal_sector">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div class="dropdown-header bg-secondary d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                DATOS DEL DEPARTAMENTO
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                    <div class="form-group">
                                        <label></label>
                                        <input type="text" class="form-control" id="txtCodDepto">
                                    </div>
                                    <div class="form-group">
                                        <label></label>
                                        <input type="text" class="form-control" id="txtDesDepto">
                                    </div>


                                </div>
                            </div>
                                
                            <div class="row">
                                <div class="col-6">
                                    <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                        <i class="fal fa-arrow-left"></i>
                                    </button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-base btn-circle btn-xl hand shadow" id="btnGuardarDepartamento">
                                        <i class="fal fa-save"></i>
                                    </button>
                                </div>

                                
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

    //-------------------------------------------------------------
    document.getElementById('btnNuevoDepartamento').addEventListener('click',()=>{
        clean_data();
        $("#modal_departamento").modal('show');
    });

    let btnGuardarDepartamento = document.getElementById('btnGuardarDepartamento');
    btnGuardarDepartamento.addEventListener('click',()=>{

        F.Confirmacion('Esta seguro que desea Crear este nuevo Departamento?')
        .then((value)=>{
            if(value==true){

                let nombre = document.getElementById('txtDesDepto').value || '';
                if(nombre==''){F.AvisoError('Indique un nombre');return;}

                btnGuardarDepartamento.disabled = true;
                btnGuardarDepartamento.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                GF.insert_departamento(nombre)
                .then(()=>{

                    btnGuardarDepartamento.disabled = false;
                    btnGuardarDepartamento.innerHTML = `<i class="fal fa-save"></i>`;
                    F.Aviso('Creado exitosamente!!');

                    tbl_departamentos();

                })
                .catch(()=>{
                    F.AvisoError('No se pudo crear');
                    btnGuardarDepartamento.disabled = false;
                    btnGuardarDepartamento.innerHTML = `<i class="fal fa-save"></i>`;
 
                })


            }
        })

    });

    tbl_departamentos();
    //-------------------------------------------------------------



    //-------------------------------------------------------------
    document.getElementById('btnNuevoMunicipio').addEventListener('click',()=>{
        clean_data();

        $("#modal_municipio").modal('show');

    });
    document.getElementById('cmbDepartamentos').addEventListener('change',()=>{
      tbl_municipios(document.getElementById('cmbDepartamentos').value);  
    })


    //-------------------------------------------------------------


    document.getElementById('btnNuevoSector').addEventListener('click',()=>{
        clean_data();

        $("#modal_sector").modal('show');


    });
    document.getElementById('cmbMunicipios').addEventListener('change',()=>{
        tbl_sectores(document.getElementById('cmbMunicipios').value);
    });
        


};

function initView(){

    getView();
    addListeners();

};


function clean_data(){

    
    document.getElementById('txtCodDepto').value = '';
    document.getElementById('txtDesDepto').value = '';



};





function tbl_departamentos(){

    let container = document.getElementById('tbl_data_departamentos');
    container.innerHTML = GlobalLoader;

    GF.data_departamentos()
    .then((data)=>{

        let str = ''; let strCombo = '';
        data.recordset.map((r)=>{
            str += `
                <tr>
                    <td>${r.CODIGO}</td>
                    <td>${r.DESCRIPCION}</td>
                    <td>
                        <button class="btn btn-md btn-circle btn-info hand shadow"
                        onclick="">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-md btn-circle btn-danger hand shadow"
                        onclick="">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>
                `
            strCombo += `<option value='${r.CODIGO}'>${r.DESCRIPCION}</option>`;
        })

        container.innerHTML = str;
        document.getElementById('cmbDepartamentos').innerHTML = strCombo;
        tbl_municipios(document.getElementById('cmbDepartamentos').value);

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
    })
};

function tbl_municipios(coddepto){
    
    let container = document.getElementById('tbl_data_municipios');
    container.innerHTML = GlobalLoader;

    GF.data_municipios(coddepto)
    .then((data)=>{

        let str = ''; let strCombo = '';
        data.recordset.map((r)=>{
            str += `
                <tr>
                    <td>${r.CODIGO}</td>
                    <td>${r.DESCRIPCION}</td>
                    <td>
                        <button class="btn btn-md btn-circle btn-info hand shadow"
                        onclick="">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-md btn-circle btn-danger hand shadow"
                        onclick="">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>
                `;
            strCombo += `<option value='${r.CODIGO}'>${r.DESCRIPCION}</option>`;
        })
        container.innerHTML = str;
        document.getElementById('cmbMunicipios').innerHTML = strCombo;
        tbl_sectores(document.getElementById('cmbMunicipios').value);

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
    })

};

function tbl_sectores(codmunicipio){

    let container = document.getElementById('tbl_data_sectores');
    container.innerHTML = GlobalLoader;

    GF.data_sectores(codmunicipio)
    .then((data)=>{

        let str = ''; let strCombo = '';
        data.recordset.map((r)=>{
            str += `
                <tr>
                    <td>${r.CODIGO}</td>
                    <td>${r.DESCRIPCION}</td>
                    <td>
                        <button class="btn btn-md btn-circle btn-info hand shadow"
                        onclick="">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-md btn-circle btn-danger hand shadow"
                        onclick="">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>
                `;
        })
        container.innerHTML = str;
      
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
    })
    
};