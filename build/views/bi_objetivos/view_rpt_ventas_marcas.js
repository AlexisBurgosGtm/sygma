function getView(){
    let view = {
        body: ()=>{
            return `
            ${view.vista_marcas()}
            
            <button class="btn btn-circle btn-xl btn-secondary btn-bottom-l hand shadow"
                onclick="Navegar.inicio()">
                    <i class="fal fa-home"></i>
            </button>
            `;
        },
        vista_marcas:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                   
                    <h3 class="negrita text-center text-secondary">VENTAS POR MARCAS</h3>

                    <br>
                    <div class="row">
                        <div class="col-sm-12 col-md-8 col-lg-8 col-xl-8">
                            
                            <div class="form-group">
                                <label class="negrita text-secondary">Seleccione Sucursal, mes y año</label>
                                
                                <div class="input-group">
                                    <select class="form-control negrita" id="cmbSucursal">
                                    </select>
                                    <select class="negrita form-control" id="cmbMMes">
                                    </select>
                                    <select class="negrita form-control" id="cmbMAnio">
                                    </select>
                                </div>

                            </div>

                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">

                            <h1 class="negrita text-danger" id="lbTotalMImporte">--</h1>

                        </div>

                    </div>



                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4">
                    
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">

                   

                            <div class="table-responsive">
                                <table class="table h-full table-bordered col-12" id="tblMarcas">
                                    <thead class="bg-base text-white negrita">
                                        <tr>
                                            <td>MARCA</td>
                                            <td>IMPORTE</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataMarcas"></tbody>
                                </table>
                            </div>
                        

                        </div>
                    </div>

                </div>
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4">

                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">
                         
                            <h5 class="negrita text-secondary">Ventas de Marca por Vendedor</h5>
                             <h2 class="negrita text-danger" id="lbMarcasVendedor"></h2>
                         
                                    <div class="form-group">
                                        <input type="text" class="form-control negrita"
                                            placeholder="Escriba para buscar..."
                                            id="txtVendedoresBuscar"
                                            oninput="F.FiltrarTabla('tblVendedores','txtVendedoresBuscar')"
                                        >
                                    </div>
                                    
                            <div class="table-responsive">
                                
                                <table class="table h-full table-bordered col-12" id="tblVendedores">
                                    <thead class="bg-primary text-white negrita">
                                        <tr>
                                            <td>VENDEDOR</td>
                                            <td>IMPORTE</td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataVendedores"></tbody>
                                </table>
                            </div>

                        </div>
                    </div>

                </div>
                <div class="col-sm-12 col-md-4 col-xl-4 col-lg-4">

                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">
                                
                            <div class="row">
                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <h2 class="negrita text-danger" id="lbMarcasProductos"></h2>
                                </div>
                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <div class="form-group">
                                        <input type="text" class="form-control negrita"
                                            placeholder="Escriba para buscar..."
                                            id="txtMarcasBuscarProd"
                                            oninput="F.FiltrarTabla('tblMarcasProductos','txtMarcasBuscarProd')"
                                        >
                                    </div>
                                    
                                </div>
                            </div>

                            <br>
                            <div class="table-responsive">
                                
                                <table class="table h-full table-bordered col-12" id="tblMarcasProductos">
                                    <thead class="bg-secondary text-white negrita">
                                        <tr>
                                            <td>PRODUCTO / CODIGO EAN</td>
                                            <td>CAJAS</td>
                                            <td>IMPORTE</td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataMarcasProductos"></tbody>
                                </table>
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


    F.slideAnimationTabs();
    
    document.title = `Ventas por Marcas`;

  
    let cmbSucursal = document.getElementById('cmbSucursal');
    

    GF.get_data_empresas()
        .then((data)=>{
            let str = '<option value="%">TODAS LAS SEDES</option>';
            data.recordset.map((r)=>{
                str += `
                    <option value="${r.EMPNIT}">${r.NOMBRE}</option>
                `
            })
            
            cmbSucursal.innerHTML = str;
            if(Number(GlobalNivelUsuario)==2){
                cmbSucursal.disabled = true;
                cmbSucursal.value = GlobalEmpnit;
            };
            if(Number(GlobalNivelUsuario)==5){
                cmbSucursal.value = GlobalEmpnit;
            };
            
            cmbSucursal.addEventListener('change',()=>{
               tbl_rpt_marcas();
            });

            tbl_rpt_marcas();

        })
        .catch(()=>{
            cmbSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
        })

    document.getElementById('cmbMMes').innerHTML = F.ComboMeses();
    document.getElementById('cmbMAnio').innerHTML = F.ComboAnio();
     
    document.getElementById('cmbMMes').value = F.get_mes_curso();
    document.getElementById('cmbMAnio').value = F.get_anio_curso();

    document.getElementById('cmbMMes').addEventListener('change',()=>{
        tbl_rpt_marcas();
    });

    document.getElementById('cmbMAnio').addEventListener('change',()=>{
        tbl_rpt_marcas();
    });

};


function initView(){

    getView();
    addListeners();

};




function tbl_rpt_marcas(){


    let mes = document.getElementById('cmbMMes').value;
    let anio = document.getElementById('cmbMAnio').value;


    let container = document.getElementById('tblDataMarcas');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;

    let sucursal = document.getElementById('cmbSucursal').value;

    // LIMPIO LOS DATOS DE LOS OTROS TABLA Y LABELS
    document.getElementById('lbMarcasProductos').innerText = '';
    document.getElementById('lbMarcasVendedor').innerText = '';
    document.getElementById('tblDataMarcasProductos').innerHTML = '';
    document.getElementById('tblDataVendedores').innerHTML = '';


   
    RPT.data_marcas(sucursal,mes,anio)
    .then((data)=>{

   
        let str = '';

        data.recordset.map((r)=>{
        
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            str += `

                <tr>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    <td>
                        <button class="btn btn-secondary btn-md btn-circle hand shadow"
                        onclick="get_data_marca('${r.CODMARCA}','${r.DESMARCA}',${mes},${anio})">
                                <i class="fal fa-arrow-right"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        container.innerHTML = str;
       
        document.getElementById('lbTotalMImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((err)=>{
       

        container.innerHTML = 'No se cargaron datos....';
       
        document.getElementById('lbTotalMImporte').innerText = '';
    })


};


function get_data_marca(codmarca,desmarca,mes,anio){


    document.getElementById('lbMarcasProductos').innerText = desmarca;
    document.getElementById('lbMarcasVendedor').innerText = desmarca;

    let sucursal = document.getElementById('cmbSucursal').value;


    tbl_rpt_marcas_productos(sucursal,codmarca,mes,anio);
    tbl_rpt_vendedores(sucursal,codmarca,mes,anio);

};


function tbl_rpt_marcas_productos(sucursal,codmarca,mes,anio){


    let container = document.getElementById('tblDataMarcasProductos');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;


    RPT.data_marcas_productos(sucursal,codmarca,mes,anio)
    .then((data)=>{

   
        let str = '';

        data.recordset.map((r)=>{
        
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            str += `
                <tr>
                    <td>${r.DESPROD}
                        <br><small>${r.CODIGO_EAN}</small>
                    </td>
                    <td>${F.setMoneda(r.CAJAS,'')}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'')}</td>
                </tr>
            `
        })
        container.innerHTML = str;
       
        //document.getElementById('lbTotalMImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((err)=>{
       

        container.innerHTML = 'No se cargaron datos....';
       
        //document.getElementById('lbTotalMImporte').innerText = '';
    })


};

function tbl_rpt_vendedores(sucursal,codmarca,mes,anio){

     let container = document.getElementById('tblDataVendedores');
    container.innerHTML = GlobalLoader;

    let contador = 0;
    let varTotal = 0;


    RPT.data_marcas_vendedores(sucursal,codmarca,mes,anio)
    .then((data)=>{

   
        let str = '';

        data.recordset.map((r)=>{
        
            contador +=1;
            varTotal += Number(r.TOTALPRECIO);
            str += `
                <tr>
                    <td>${r.EMPLEADO}
                        <br><small>${r.EMPRESA}</small>
                    </td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'')}</td>
                </tr>
            `
        })
        container.innerHTML = str;
       
        //document.getElementById('lbTotalMImporte').innerText =`Total: ${F.setMoneda(varTotal,'Q')}`;

    })
    .catch((err)=>{
       

        container.innerHTML = 'No se cargaron datos....';
       
        //document.getElementById('lbTotalMImporte').innerText = '';
    })


};