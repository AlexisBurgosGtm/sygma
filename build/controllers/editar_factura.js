
let GlobalEntSal = 0;

function fcn_editar_factura(coddoc,correlativo,nomclie,dirclie){

  


    F.Confirmacion('¿Está seguro que desea EDITAR este Documento?')
    .then((value)=>{
        if(value==true){

            
                $("#modal_editar_factura").modal('show');

                document.getElementById('EF_txtEditarFacturaNomclie').value = nomclie;
                document.getElementById('EF_txtEditarFacturaDirclie').value = dirclie;
                document.getElementById('EF_lbEditarFacturaCoddoc').innerText = `${coddoc}-${correlativo}`;

                document.getElementById('EF_txtEditarFacturaCoddoc').value = coddoc;
                document.getElementById('EF_txtEditarFacturaCorrelativo').value = correlativo;
                

                fcn_cargar_grid_factura(coddoc,correlativo);


        }
    })




};


function fcn_cargar_grid_factura(coddoc,correlativo){

    let container = document.getElementById('EF_tblDataEditarFactura');
                container.innerHTML = GlobalLoader;

                let varTotal = 0;
                let varTotalCosto = 0;
                let varTotalDescuento = 0;


                GF.get_data_detalle_documento(GlobalEmpnit, coddoc,correlativo)
                .then((data)=>{

                    let str = '';

                    data.recordset.map((r)=>{
                        let idBtnE = `idBtnE${r.ID}`;
                        
                        varTotal += Number(r.TOTALPRECIO);
                        varTotalCosto += Number(r.TOTALCOSTO);
                        varTotalDescuento += Number(r.DESCUENTO);

                        str += `
                        <tr>
                            <td>${r.DESPROD}
                                <br>
                                <small class="negrita">${r.CODPROD}</small>
                            </td>
                            <td>${r.CODMEDIDA}</td>
                            <td>${r.CANTIDAD}</td>
                            <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                            <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                            <td>
                                <button class="hidden btn btn-circle btn-info btn-md hand shadow"
                                onclick="fcn_editar_cantidad_producto_factura('${coddoc}','${correlativo}','${r.DESPROD}','${r.ID}','${r.CANTIDAD}','${r.COSTO}','${r.PRECIO}')"
                                >
                                    <i class="fal fa-edit"></i>
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-circle btn-danger btn-md hand shadow"
                                id='${idBtnE}'
                                onclick="fcn_eliminar_producto_factura('${r.ID}','${idBtnE}','${coddoc}','${correlativo}')"
                                >
                                    <i class="fal fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        `
                    })
                    
                    container.innerHTML = str;
                    document.getElementById('EF_lbEditarFacturaTotal').innerText = F.setMoneda(varTotal,'Q');

                    document.getElementById('EF_txtEditarFacturaTotalCosto').value = varTotalCosto;
                    document.getElementById('EF_txtEditarFacturaTotalDescuento').value = varTotalDescuento;
                    document.getElementById('EF_txtEditarFacturaTotalPrecio').value = varTotal;
                    
    
                    GF.get_documento_update_totales(coddoc,correlativo,varTotalCosto,varTotalDescuento,varTotal);
    
                })
                .catch(()=>{

                    container.innerHTML = 'No se cargaron datos...';
                    document.getElementById('EF_lbEditarFacturaTotal').innerText = '';

                    document.getElementById('EF_txtEditarFacturaTotalCosto').value = 0;
                    document.getElementById('EF_txtEditarFacturaTotalDescuento').value = 0;
                    document.getElementById('EF_txtEditarFacturaTotalPrecio').value = 0;

                })
};

function fcn_editar_cantidad_producto_factura(coddoc,correlativo,desprod,idprod,cantidad,costo,precio){


    $("#modal_editar_factura_cantidad").modal('show');

    let totalprecio = Number(precio) * Number(cantidad);
    let totalcosto = Number(costo) * Number(cantidad);
   
    console.log('total precio:')
    console.log(totalprecio);

    document.getElementById('EF_lbEditarFacturaDesprod').innerText = desprod;

    document.getElementById('EF_txtEditarFacturaCantidad').value = cantidad;
    document.getElementById('EF_txtEditarFacturaPrecio').value = precio;
    document.getElementById('EF_txtEditarFacturaTotalPrecio').value = totalprecio;

    document.getElementById('EF_txtEditarFacturaCosto').value = costo;
    document.getElementById('EF_txtEditarFacturaTotalCosto').value = totalcosto;


};

function fcn_eliminar_producto_factura(idprod,idbtn,coddoc,correlativo){

    let btn = document.getElementById(idbtn);

    F.Confirmacion('¿Está seguro que desea ELIMINAR este item del documento?')
    .then((value)=>{
        if(value==true){
            
            btn.disabled = true;
            btn.innerHTML = `<i class="fal fa-trash fa-spin"></i>`;

            GF.get_documento_eliminar_item(idprod)
            .then(()=>{
                F.Aviso('Item eliminado exitosamente!!');
                
                let totalcosto=document.getElementById('EF_txtEditarFacturaTotalCosto').value;
                let totaldescuento=document.getElementById('EF_txtEditarFacturaTotalDescuento').value;
                let totalprecio=document.getElementById('EF_txtEditarFacturaTotalPrecio').value;


                GF.get_documento_update_totales(coddoc,correlativo,totalcosto,totaldescuento,totalprecio);

                fcn_cargar_grid_factura(coddoc,correlativo);

            })
            .catch(()=>{
                F.AvisoError('No se pudo ELIMINAR este item');

            })

        

        }
    })

};

function fcn_get_buscar_producto(filtro,entsal){


    let container = document.getElementById('EF_tblDataEditarFacturaProductos');
    container.innerHTML = GlobalLoader;

    

    let str = '';


    axios.post('/pos/productos_filtro', {
        sucursal: GlobalEmpnit,
        token:TOKEN,
        filtro:filtro,
        tipoprecio:data_empresa_config.TIPO_PRECIO,
        entsal:GlobalEntSal
    })
    .then((response) => {        
        if(response=='error'){
            F.AvisoError('Error en la solicitud');
            container.innerHTML = 'No day datos....';
        }else{
            const data = response.data.recordset;
            data.map((r)=>{
                let strClassIps = '';
                if(r.BONO.toString()=='0'){}else{}strClassIps = 'negrita text-base'
                let strClassExistencia = '';
                let existencia = Number(r.EXISTENCIA);
                if(existencia<=0){strClassExistencia='bg-danger text-white'};

                str += `
                    <tr class="hand" 
                    onclick="get_producto('${r.CODPROD}','${r.DESPROD}','${r.CODMEDIDA}','${r.EQUIVALE}','${r.COSTO}','${r.PRECIO}','${r.TIPOPROD}','${r.EXENTO}','${r.EXISTENCIA}','${r.BONO}')"
                    >
                        <td>${r.DESMARCA}</td>
                        <td><b style="color:${r.COLOR}">${r.DESPROD}</b>
                            <br>
                            <small class="negrita text-danger">Cód:${r.CODPROD}</small>
                        </td>
                        <td>${r.CODMEDIDA} (Eq:${r.EQUIVALE})</td>
                        <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                        <td class="${strClassExistencia}">${r.EXISTENCIA}</td>
                        <td class='${strClassIps}'>${F.setMoneda(r.BONO,'Q')}</td>
                        <td>${r.TIPOPROD}</td>
                    </tr>
                `
            })
            container.innerHTML = str;
           

            //getMoveTable();
        }
    }, (error) => {
        F.AvisoError('Error en la solicitud');
        container.innerHTML = 'No day datos....';
       
    });



};


function get_producto(codprod,desprod,codmedida,equivale,costo,precio,tipoprod,exento,existencia,bono){

    $("#modal_editar_factura_lista_productos").modal('hide');

    $("#modal_editar_factura_cantidad").modal('show');


    //let container = document.getElementById('container_precio_');
    //container.innerHTML = GlobalLoader;

    document.getElementById('EF_txtEditarFacturaCantidad').value = '1';
    document.getElementById('EF_txtEditarFacturaPrecio').value = precio;
    document.getElementById('EF_txtEditarFacturaTotalPrecio').value = precio;
    //document.getElementById('btnMCGuardar').disabled = true;


    //fcn_CalcularTotalPrecio();

    Selected_codprod = codprod;
    Selected_desprod = desprod;
    Selected_codmedida = codmedida;
    Selected_equivale = Number(equivale);
    Selected_costo = Number(costo);
    Selected_precio = Number(precio);
    Selected_tipoprod = tipoprod;
    Selected_exento = Number(exento);
    Selected_existencia = Number(existencia);
    Selected_bono = Number(bono);

    document.getElementById('EF_lbEditarFacturaDesprod').innerText = `${desprod} (${codmedida} - Eq: ${equivale})`;


    fcn_CalcularTotalPrecio();

    document.getElementById('EF_txtEditarFacturaCantidad').focus();


};

function fcn_CalcularTotalPrecio(){

    let cantidad = document.getElementById('EF_txtEditarFacturaCantidad').value || 1;
    let precio = document.getElementById('EF_txtEditarFacturaPrecio').value;
    
    let total = Number(cantidad) * Number(precio)

    console.log('total item: ')
    console.log(total);

    document.getElementById('EF_txtEditarFacturaETotalPrecio').value = Number(total);


};



function addListeners_EF_Agregar_item(){

    
    document.getElementById('EF_txtEditarFacturaCantidad').addEventListener('input',()=>{
        fcn_CalcularTotalPrecio();  
    });

    document.getElementById('EF_btnEditarFacturaAgregar').addEventListener('click',()=>{

        $("#modal_editar_factura_lista_productos").modal('show');

    });

    let EF_btnEditarFacturaActualizar = document.getElementById('EF_btnEditarFacturaActualizar');
    EF_btnEditarFacturaActualizar.addEventListener('click',()=>{

        EF_btnEditarFacturaActualizar.disabled = true;
        EF_btnEditarFacturaActualizar.innerHTML = `<i class="fal fa-sync fa-spin"></i>`;


        let coddoc = document.getElementById('EF_txtEditarFacturaCoddoc').value;
        let correlativo = document.getElementById('EF_txtEditarFacturaCorrelativo').value;
        
        let totalcosto=document.getElementById('EF_txtEditarFacturaTotalCosto').value;
        let totaldescuento=document.getElementById('EF_txtEditarFacturaTotalDescuento').value;
        let totalprecio=document.getElementById('EF_txtEditarFacturaTotalPrecio').value;


        GF.get_documento_update_totales(coddoc,correlativo,totalcosto,totaldescuento,totalprecio)
        .then(()=>{
        
            EF_btnEditarFacturaActualizar.disabled = false;
            EF_btnEditarFacturaActualizar.innerHTML = `<i class="fal fa-sync"></i> Actualizar`;
        
        })
        .catch(()=>{
            EF_btnEditarFacturaActualizar.disabled = false;
            EF_btnEditarFacturaActualizar.innerHTML = `<i class="fal fa-sync"></i> Actualizar`;
        
        })

        

    });


    document.getElementById('txtEditarFacturaBuscarProducto').addEventListener('keyup',(e)=>{

            let filtro = document.getElementById('txtEditarFacturaBuscarProducto').value;

            if (e.code === 'Enter') { 
                fcn_get_buscar_producto(filtro);
            };
            if (e.keyCode === 13 && !e.shiftKey) {
                fcn_get_buscar_producto(filtro);
            };  


    });


    
    
    let EF_btnAgregarItem = document.getElementById('EF_btnAgregarItem');
    
    EF_btnAgregarItem.addEventListener('click',()=>{



        F.Confirmacion('¿Está seguro que desea AGREGAR este item al documento?')
        .then((value)=>{
            if(value==true){
                
                
                
                let coddoc = document.getElementById('EF_txtEditarFacturaCoddoc').value;;
                let correlativo = document.getElementById('EF_txtEditarFacturaCorrelativo').value;
                let codprod = Selected_codprod;
                let desprod = Selected_desprod;
                let codmedida = Selected_codmedida;
                let cantidad = document.getElementById('EF_txtEditarFacturaCantidad').value || '1';
                let equivale = Selected_equivale;
                let totalunidades = Number(cantidad) * Number(equivale);
                let costo = Selected_costo;
                let precio = Selected_precio;
                let totalcosto = Number(Selected_costo) * Number(cantidad);
                let totalprecio = Number(Selected_precio) * Number(cantidad);
                let descuento = 0;
                let tipoprod = Selected_tipoprod;
                let tipoprecio = data_empresa_config.TIPO_PRECIO;
                let lastupdate = F.getFecha();
                let por_iva = GlobalConfigIVA;
                let existencia = Selected_existencia;
                let bono = Selected_bono;
                let exento = Selected_exento;


                EF_btnAgregarItem.disabled = true;
                EF_btnAgregarItem.innerHTML = `<i class="fal fa-save fa-spin"></i>`;
    

                GF.get_documento_insert_item(coddoc,correlativo,codprod,desprod, 
                    codmedida,cantidad,equivale,totalunidades,costo,
                    precio,totalcosto,totalprecio,descuento,tipoprod,
                    tipoprecio,lastupdate, por_iva,existencia,bono,exento)
                .then(()=>{
                    F.Aviso('Item agregado exitosamente!!');
                   
                    fcn_cargar_grid_factura(coddoc,correlativo);
    

                    EF_btnAgregarItem.disabled = false;
                    EF_btnAgregarItem.innerHTML = `<i class="fal fa-save"></i>`;
    
                    $("#modal_editar_factura_cantidad").modal('hide');
    
                    
                })
                .catch(()=>{
                    
                    F.AvisoError('No se pudo AGREGAR este item');

                    EF_btnAgregarItem.disabled = false;
                    EF_btnAgregarItem.innerHTML = `<i class="fal fa-save"></i>`;
        
    
                })
    
            
    
            }
        })
    


    });


   


};



addListeners_EF_Agregar_item();










