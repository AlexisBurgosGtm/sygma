
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

                                <div class="form-group">
                                    <label>Seleccione un Departamento</label>
                                    <div class="input-group">
                                        <select class="negrita form-control" id="cmbDepartamentos">
                                        </select>
                                        <button class="btn btn-success btn-md hand shadow" id="btnNuevoMunicipio">
                                            <i class="fal fa-plus"></i> Nuevo
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
                        
                            <div class="form-group">
                                <label>Seleccione un Municipio</label>
                                <div class="input-group">
                                    <select class="negrita form-control" id="cmbMunicipios">
                                    </select>
                                    <button class="btn btn-success btn-md hand shadow" id="btnNuevoSector">
                                        <i class="fal fa-plus"></i> Nuevo
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
                                DATOS DEL MUNICIPIO
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                    <label>Departamento:</label>
                                    <h5 class="negrita text-danger" id="lbDesDepto"></h5>

                                    <div class="form-group">
                                        <label>Codigo Municipio</label>
                                        <input type="text" class="form-control" id="txtCodMun" disabled="true">
                                    </div>
                                    <div class="form-group">
                                        <label>Nombre del Municipio</label>
                                        <input type="text" class="form-control" id="txtDesMun">
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
                                    <button class="btn btn-base btn-circle btn-xl hand shadow" id="btnGuardarMunicipio">
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
                                DATOS DEL SECTOR
                            </h4>
                        </div>
                        <div class="modal-body p-4">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-4">

                                    <label>Municipio:</label>
                                    <h5 class="negrita text-danger" id="lbDesMunicipio"></h5>

                                    <div class="form-group">
                                        <label>Codigo Sector</label>
                                        <input type="text" class="form-control" id="txtCodSector" disabled="true">
                                    </div>
                                    <div class="form-group">
                                        <label>Nombre del Sector</label>
                                        <input type="text" class="form-control" id="txtDesSector">
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
                                    <button class="btn btn-base btn-circle btn-xl hand shadow" id="btnGuardarSector">
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

        F.Confirmacion('Esta seguro que desea guardar estos datos?')
        .then((value)=>{
            if(value==true){

                let nombre = document.getElementById('txtDesDepto').value || '';
                if(nombre==''){F.AvisoError('Indique un nombre');return;}

                let codigo = document.getElementById('txtCodDepto').value || '';

                btnGuardarDepartamento.disabled = true;
                btnGuardarDepartamento.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                if(codigo==''){ // NUEVO
                        GF.insert_departamento(nombre)
                        .then(()=>{

                            btnGuardarDepartamento.disabled = false;
                            btnGuardarDepartamento.innerHTML = `<i class="fal fa-save"></i>`;
                            F.Aviso('Creado exitosamente!!');

                            $("#modal_departamento").modal('hide');

                            tbl_departamentos();

                        })
                        .catch(()=>{
                            F.AvisoError('No se pudo crear');
                            btnGuardarDepartamento.disabled = false;
                            btnGuardarDepartamento.innerHTML = `<i class="fal fa-save"></i>`;
        
                        })
                }else{ // EDICION
                        GF.edit_departamento(codigo,nombre)
                        .then(()=>{

                            btnGuardarDepartamento.disabled = false;
                            btnGuardarDepartamento.innerHTML = `<i class="fal fa-save"></i>`;
                            F.Aviso('Actualizado exitosamente!!');

                            $("#modal_departamento").modal('hide');

                            tbl_departamentos();

                        })
                        .catch(()=>{
                            F.AvisoError('No se pudo editar');
                            btnGuardarDepartamento.disabled = false;
                            btnGuardarDepartamento.innerHTML = `<i class="fal fa-save"></i>`;
        
                        })
                }

             


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
    document.getElementById('cmbDepartamentos').addEventListener('change',(e)=>{
        
        document.getElementById('lbDesDepto').innerText = e.target.options[e.target.selectedIndex].text;
   
        tbl_municipios(document.getElementById('cmbDepartamentos').value);  

    })
    
    let btnGuardarMunicipio = document.getElementById('btnGuardarMunicipio');
    btnGuardarMunicipio.addEventListener('click',()=>{

        F.Confirmacion('Esta seguro que desea guardar estos datos?')
        .then((value)=>{
            if(value==true){

                let coddepto = document.getElementById('cmbDepartamentos').value;

                let nombre = document.getElementById('txtDesMun').value || '';
                if(nombre==''){F.AvisoError('Indique un nombre');return;}

                let codigo = document.getElementById('txtCodMun').value || '';

                btnGuardarMunicipio.disabled = true;
                btnGuardarMunicipio.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                if(codigo==''){ // NUEVO
                        GF.insert_municipio(nombre,coddepto)
                        .then(()=>{

                            btnGuardarMunicipio.disabled = false;
                            btnGuardarMunicipio.innerHTML = `<i class="fal fa-save"></i>`;
                            F.Aviso('Creado exitosamente!!');

                            $("#modal_municipio").modal('hide');

                            tbl_municipios(document.getElementById('cmbDepartamentos').value);  

                        })
                        .catch(()=>{
                            F.AvisoError('No se pudo crear');
                            btnGuardarMunicipio.disabled = false;
                            btnGuardarMunicipio.innerHTML = `<i class="fal fa-save"></i>`;
        
                        })
                }else{ // EDICION
                        GF.edit_municipio(codigo,nombre)
                        .then(()=>{

                            btnGuardarMunicipio.disabled = false;
                            btnGuardarMunicipio.innerHTML = `<i class="fal fa-save"></i>`;
                            F.Aviso('Actualizado exitosamente!!');

                            $("#modal_municipio").modal('hide');

                            tbl_municipios(document.getElementById('cmbDepartamentos').value);  

                        })
                        .catch(()=>{
                            F.AvisoError('No se pudo editar');
                            btnGuardarMunicipio.disabled = false;
                            btnGuardarMunicipio.innerHTML = `<i class="fal fa-save"></i>`;
        
                        })
                }

             


            }
        })

    });


    //-------------------------------------------------------------



    document.getElementById('btnNuevoSector').addEventListener('click',()=>{
        clean_data();

        $("#modal_sector").modal('show');

    });
    document.getElementById('cmbMunicipios').addEventListener('change',(e)=>{

        document.getElementById('lbDesMunicipio').innerText = e.target.options[e.target.selectedIndex].text;
        tbl_sectores(document.getElementById('cmbMunicipios').value);

    });

    let btnGuardarSector = document.getElementById('btnGuardarSector');
    btnGuardarSector.addEventListener('click',()=>{

        F.Confirmacion('Esta seguro que desea guardar estos datos?')
        .then((value)=>{
            if(value==true){

                let codmun = document.getElementById('cmbMunicipios').value;

                let nombre = document.getElementById('txtDesSector').value || '';
                if(nombre==''){F.AvisoError('Indique un nombre');return;}

                let codigo = document.getElementById('txtCodSector').value || '';

                btnGuardarSector.disabled = true;
                btnGuardarSector.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                if(codigo==''){ // NUEVO
                        GF.insert_sector(nombre,codmun)
                        .then(()=>{

                            btnGuardarSector.disabled = false;
                            btnGuardarSector.innerHTML = `<i class="fal fa-save"></i>`;
                            F.Aviso('Creado exitosamente!!');

                            $("#modal_sector").modal('hide');

                            tbl_sectores(document.getElementById('cmbMunicipios').value);  

                        })
                        .catch(()=>{
                            F.AvisoError('No se pudo crear');
                            btnGuardarSector.disabled = false;
                            btnGuardarSector.innerHTML = `<i class="fal fa-save"></i>`;
        
                        })
                }else{ // EDICION
                        GF.edit_sector(codigo,nombre)
                        .then(()=>{

                            btnGuardarSector.disabled = false;
                            btnGuardarSector.innerHTML = `<i class="fal fa-save"></i>`;
                            F.Aviso('Actualizado exitosamente!!');

                            $("#modal_sector").modal('hide');

                            tbl_sectores(document.getElementById('cmbMunicipios').value);  

                        })
                        .catch(()=>{
                            F.AvisoError('No se pudo editar');
                            btnGuardarSector.disabled = false;
                            btnGuardarSector.innerHTML = `<i class="fal fa-save"></i>`;
        
                        })
                }

             


            }
        })

    });
        

  

};

function initView(){

    getView();
    addListeners();

};


function clean_data(){

    //limpia modal departamento
    document.getElementById('txtCodDepto').value = '';
    document.getElementById('txtDesDepto').value = '';

    //limpia modal municipios
    document.getElementById('txtCodMun').value = '';
    document.getElementById('txtDesMun').value = '';

    //limpia modal sectores
    document.getElementById('txtCodSector').value = '';
    document.getElementById('txtDesSector').value = '';

};





function tbl_departamentos(){

    let container = document.getElementById('tbl_data_departamentos');
    container.innerHTML = GlobalLoader;

    GF.data_departamentos()
    .then((data)=>{

        let str = ''; let strCombo = '';
        let conteo = 0; let primerdepartamento = '';

        data.recordset.map((r)=>{
            conteo+=1;
            if(Number(conteo)==1){primerdepartamento=r.DESCRIPCION};

            let idbtnE = `btnEDepto${r.CODIGO}`;
            str += `
                <tr>
                    <td>${r.CODIGO}</td>
                    <td>${r.DESCRIPCION}</td>
                    <td>
                        <button class="btn btn-md btn-circle btn-info hand shadow"
                        onclick="editar_departamento('${r.CODIGO}','${r.DESCRIPCION}')">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-md btn-circle btn-danger hand shadow"
                        id="${idbtnE}"
                        onclick="eliminar_departamento('${r.CODIGO}','${idbtnE}')">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>
                `
            strCombo += `<option value='${r.CODIGO}'>${r.DESCRIPCION}</option>`;
        })

        container.innerHTML = str;
        document.getElementById('cmbDepartamentos').innerHTML = strCombo;
        document.getElementById('lbDesDepto').innerText = primerdepartamento;

        tbl_municipios(document.getElementById('cmbDepartamentos').value);

    })
    .catch(()=>{
        document.getElementById('lbDesDepto').innerText = '';
        container.innerHTML = 'No se cargaron datos...';
    })
};
function eliminar_departamento(codigo,idbtn){

    let btn = document.getElementById(idbtn);
    
    F.Confirmacion('¿Está seguro que desea ELIMINAR este DEPARTAMENTO?')
    .then((value)=>{

        if(value==true){

            btn.disabled = true;
            btn.innerHTML = `<i class="fal fa-trash fa-spin"></i>`;

            GF.delete_departamento(codigo)
            .then(()=>{

                F.Aviso('Departamento Eliminado Exitosamente!!');

                tbl_departamentos();

            })
            .catch(()=>{
                F.AvisoError('No se pudo Eliminar. Revise si hay Clientes son este Departamento asignado');
                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-trash"></i>`;
            })

        }

    })

};
function editar_departamento(codigo,descripcion){

    clean_data();
    $("#modal_departamento").modal('show');

    document.getElementById('txtCodDepto').value = codigo;
    document.getElementById('txtDesDepto').value = descripcion;
    

};



function tbl_municipios(coddepto){
    
    let container = document.getElementById('tbl_data_municipios');
    container.innerHTML = GlobalLoader;

    GF.data_municipios(coddepto)
    .then((data)=>{

        let conteo = 0; let primernombre = '';

        let str = ''; let strCombo = '';
        data.recordset.map((r)=>{
            
            conteo+=1;
            if(Number(conteo)==1){primernombre=r.DESCRIPCION};

            let idbtnE = `btnEMuni${r.CODIGO}`;
            str += `
                <tr>
                    <td>${r.CODIGO}</td>
                    <td>${r.DESCRIPCION}</td>
                    <td>
                        <button class="btn btn-md btn-circle btn-info hand shadow"
                        onclick="editar_municipio('${r.CODIGO}','${r.DESCRIPCION}')">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-md btn-circle btn-danger hand shadow"
                        id="${idbtnE}"
                        onclick="eliminar_municipio('${r.CODIGO}','${idbtnE}')">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>
                `;
            strCombo += `<option value='${r.CODIGO}'>${r.DESCRIPCION}</option>`;
        })
        container.innerHTML = str;
        document.getElementById('cmbMunicipios').innerHTML = strCombo;
        document.getElementById('lbDesMunicipio').innerText = primernombre;
        tbl_sectores(document.getElementById('cmbMunicipios').value);

    })
    .catch(()=>{
        document.getElementById('lbDesMunicipio').innerText = '';
        container.innerHTML = 'No se cargaron datos...';
    })

};
function editar_municipio(codigo,descripcion){
    clean_data();
    $("#modal_municipio").modal('show');
    document.getElementById('txtCodMun').value = codigo;
    document.getElementById('txtDesMun').value = descripcion;
};
function eliminar_municipio(codigo,idbtn){

    let btn = document.getElementById(idbtn);
    
    F.Confirmacion('¿Está seguro que desea ELIMINAR este MUNICIPIO?')
    .then((value)=>{

        if(value==true){

            btn.disabled = true;
            btn.innerHTML = `<i class="fal fa-trash fa-spin"></i>`;

            GF.delete_municipio(codigo)
            .then(()=>{

                F.Aviso('Municipio Eliminado Exitosamente!!');

                    tbl_municipios(document.getElementById('cmbDepartamentos').value);  
                    

            })
            .catch(()=>{
                F.AvisoError('No se pudo Eliminar. Revise si hay Clientes son este Municipio asignado');
                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-trash"></i>`;
            })

        }

    })

};



function tbl_sectores(codmunicipio){

    let container = document.getElementById('tbl_data_sectores');
    container.innerHTML = GlobalLoader;

    GF.data_sectores(codmunicipio)
    .then((data)=>{

        let str = ''; let strCombo = '';
        data.recordset.map((r)=>{
            let idbtnE = `btnESector${r.CODIGO}`;
            str += `
                <tr>
                    <td>${r.CODIGO}</td>
                    <td>${r.DESCRIPCION}</td>
                    <td>
                        <button class="btn btn-md btn-circle btn-info hand shadow"
                        onclick="editar_sector('${r.CODIGO}','${r.DESCRIPCION}')">
                            <i class="fal fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-md btn-circle btn-danger hand shadow"
                        id="${idbtnE}"
                        onclick="eliminar_sector('${r.CODIGO}','${idbtnE}')">
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
function editar_sector(codigo,descripcion){
    clean_data();
    $("#modal_sector").modal('show');
    document.getElementById('txtCodSector').value = codigo;
    document.getElementById('txtDesSector').value = descripcion;
};
function eliminar_sector(codigo,idbtn){

    let btn = document.getElementById(idbtn);
    
    F.Confirmacion('¿Está seguro que desea ELIMINAR este SECTOR?')
    .then((value)=>{

        if(value==true){

            btn.disabled = true;
            btn.innerHTML = `<i class="fal fa-trash fa-spin"></i>`;

            GF.delete_sector(codigo)
            .then(()=>{

                F.Aviso('Sector Eliminado Exitosamente!!');

                tbl_sectores(document.getElementById('cmbMunicipios').value);

            })
            .catch(()=>{
                F.AvisoError('No se pudo Eliminar. Revise si hay Clientes son este Sector asignado');
                btn.disabled = false;
                btn.innerHTML = `<i class="fal fa-trash"></i>`;
            })

        }

    })

};



