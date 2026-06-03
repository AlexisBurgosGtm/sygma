function getView(){
    let view = {
        body:()=>{
            return `
            ${view.vista_vendedores()}

            <button type="button" class="btn btn-circle btn-xl btn-secondary btn-bottom-l hand shadow" data-spa-action="inicio">
                    <i class="fal fa-home"></i>
            </button>
            `
        },
        vista_vendedores:()=>{
            return `
             <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                   
                    <h3 class="negrita text-center text-info">VENTAS POR VENDEDOR</h3>

                    <br>
                    <div class="row">
                        <div class="col-sm-12 col-md-8 col-lg-8 col-xl-8">
                            
                            <div class="form-group">
                                <label class="negrita text-secondary">Seleccione Sucursal, mes y año</label>
                                
                                <div class="input-group">
                                    <select class="negrita form-control" id="cmbSucursal">
                                    </select>
                                    <select class="negrita form-control" id="cmbVMes">
                                    </select>
                                    <select class="negrita form-control" id="cmbVAnio">
                                    </select>
                                </div>

                            </div>

                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">

                            <h1 class="negrita text-danger" id="lbTotalVImporte">--</h1>

                        </div>

                    </div>

                    

                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                    
                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">

                            <div class="table-responsive">

                                <table class="table table-bordered h-full col-12" id="tblVendedores">
                                    <thead class="bg-info text-white negrita">
                                        <tr>
                                            <td>VENDEDOR</td>
                                            <td>TELEFONO</td>
                                            <td>PEDIDOS</td>
                                            <td>IMPORTE</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataVendedores"></tbody>
                                    <tfoot class="bg-info text-white negrita">
                                        <tr>
                                            <td>TOTALES</td>
                                            <td></td>
                                            <td id="lbFootTotalPedidos"></td>
                                            <td id="lbFootTotalPrecio"></td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>

                            </div>

                        </div>
                    </div>

                </div>
                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">

                    <div class="card card-rounded shadow col-12">
                        <div class="card-body p-4">

                            <h5 class="negrita text-info" id="lbVendedorMarcas"></h5>

                            <div class="table-responsive">
                                
                                <div class="form-group">
                                    <label class="text-secondary">Escriba para buscar...</label>
                                    <input type=""text" class="form-control negrita"
                                    placeholder="Escriba para buscar..."
                                    id="txtBuscarMarca"
                                    oninput="F.FiltrarTabla('tblVendedorMarcas','txtBuscarMarca')">
                                </div>

                                <table class="table h-full table-bordered col-12" id="tblVendedorMarcas">
                                    <thead class="bg-secondary text-white negrita">
                                        <tr>
                                            <td>MARCA</td>
                                            <td>IMPORTE</td>
                                          
                                        </tr>
                                    </thead>
                                    <tbody id="tblDataVendedorMarcas"></tbody>
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
    
    document.title = `Ventas por Vendedor`;


    let cmbSucursal = document.getElementById('cmbSucursal');

    GF.get_data_empresas()
    .then((data)=>{
            let str = ''//'<option value="%">TODAS LAS SEDES</option>';
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
                    tbl_rpt_vendedores();
            })

            tbl_rpt_vendedores();
    })
    .catch(()=>{
            cmbSucursal.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
    })


         //iniciales
    document.getElementById('cmbVMes').innerHTML = F.ComboMeses();  
    document.getElementById('cmbVAnio').innerHTML = F.ComboAnio();
   
    document.getElementById('cmbVMes').value = F.get_mes_curso();  
    document.getElementById('cmbVAnio').value = F.get_anio_curso();
  
     document.getElementById('cmbVMes').addEventListener('change',()=>{
        tbl_rpt_vendedores();
    });

    document.getElementById('cmbVAnio').addEventListener('change',()=>{
        tbl_rpt_vendedores();
    });

    


};

function initView(){

    getView();
    addListeners();

};

function tbl_rpt_vendedores(){

    let mes = document.getElementById('cmbVMes').value;
    let anio = document.getElementById('cmbVAnio').value;

    let container = document.getElementById('tblDataVendedores');
    container.innerHTML = GlobalLoader;

    document.getElementById('lbFootTotalPrecio').innerText = ``;
    document.getElementById('lbFootTotalPedidos').innerText = ``;

    let sucursal = document.getElementById('cmbSucursal').value;

    let varTotal = 0;
    let varPedidos = 0;

    RPT.data_ventas_vendedor(sucursal,mes,anio)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            varTotal += Number(r.TOTALPRECIO);
            varPedidos += Number(r.CONTEO);
            str += `
                <tr>
                    <td>${r.EMPLEADO}</td>
                    <td>${r.TELEFONO}</td>
                    <td>${r.CONTEO}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                    <td>
                        <button class="btn btn-info btn-md hand shadow btn-circle"
                        onclick="get_rpt_marcas_vendedor('${r.CODEMP}', '${r.EMPLEADO}','${mes}', '${anio}')">
                            <i class="fal fa-arrow-right"></i>
                        </button>
                    </td>
                </tr>
            `
        })
        
        container.innerHTML = str;
        document.getElementById('lbTotalVImporte').innerText = `Total: ${F.setMoneda(varTotal,'Q')}`;
        
        document.getElementById('lbFootTotalPrecio').innerText = `${F.setMoneda(varTotal,'Q')}`;
        document.getElementById('lbFootTotalPedidos').innerText = `${varPedidos}`;

    })
    .catch(()=>{
        
        container.innerHTML = 'No se cargaron datos...';
        document.getElementById('lbTotalVImporte').innerText = '';

        document.getElementById('lbFootTotalPrecio').innerText = ``;
        document.getElementById('lbFootTotalPedidos').innerText = ``;

    })


};


function get_rpt_marcas_vendedor(codemp,nombre,mes,anio){

    document.getElementById('lbVendedorMarcas').innerText = nombre;

    let container = document.getElementById('tblDataVendedorMarcas');
    container.innerHTML = GlobalLoader;
    
    let varTotal = 0;

    let sucursal = document.getElementById('cmbSucursal').value;


    RPT.data_ventas_vendedor_marcas(sucursal,codemp,mes,anio)
    .then((data)=>{

        let str = '';

        data.recordset.map((r)=>{
        
            varTotal += Number(r.TOTALPRECIO);
            str += `
                <tr>
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                
                </tr>
            `
        })
        container.innerHTML = str;
       

    })
    .catch((err)=>{
       console.log(err)

        container.innerHTML = 'No se cargaron datos....';
       
        //document.getElementById('lbTotalMImporte').innerText = '';
    })



};