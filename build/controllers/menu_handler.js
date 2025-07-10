let Menu = {
    verify:()=>{
        if(Number(GlobalNivelUsuario)==0){return false;}
        return true;
    },
    pendiente:()=>{
        
        if(Number(GlobalNivelUsuario)==0){return false;}
        
        F.AvisoError("Función no disponible");

        return true;
        
    },
    salidaMenu:()=>{
        $("#modal_menu").modal('hide');
    },
    inicio_admin:()=>{         
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/menu/menu.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    inicio_compras:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/menu/inicio_compras.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    inicio_compras_requisiones:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/menu/inicio_compras_requisiones.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    config_tipodocumentos:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/config_tipodocumentos/config_tipodocumentos.js','root')
            .then(async()=>{

                F.loadClass('../models/classTipodocumentos.js','root')
                .then(async()=>{

                    initView();

                  
                   
                })
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    productos:()=>{
        
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/compras_productos/view_productos.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
        
    },
    pos:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/ventas_pos/view_pos.js','root')
            .then(async()=>{ 
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    compras:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/compras/view_compras.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    compras_requisiciones:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/compras_cotizaciones/view_compras_requisiciones.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    compras_orden:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/compras_cotizaciones/view_compras_orden.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    compras_gestion_precios:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/compras_gestion_precios/view_compras_precios.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    compras_gestion_bonos:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/compras_gestion_bonos/view_compras_bonos.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    compras_gestion_minmax:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/compras_gestion_minmax/view_compras_minmax.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    bodega_surtido:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/bodega_surtido/view_bodega_surtido_sucursales.js','root')
            .then(async()=>{
                
                initView();
                  
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    bodega_surtido_traslado:(sucursal_destino)=>{
        if(Menu.verify()==true)
            {
                Menu.salidaMenu();
            F.loadScript('../views/bodega_surtido/view_traslados.js','root')
            .then(async()=>{
                
                initView('TSL',sucursal_destino);
                  
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    }, 
    bodega_traslados:(tipodoc)=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/bodega_traslados/view_traslados.js','root')
            .then(async()=>{
                initView(tipodoc);
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    bodega_movinv:(tipodoc)=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/bodega_movinv/view_movinv.js','root')
            .then(async()=>{
                initView(tipodoc);
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    bodega_inv_fisico:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/bodega_inv_fisico/view_inv_fisico.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    bodega_lista_precios:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/bodega_lista_precios/view_lista_precios.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    documentos:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/archivo_documentos/view_documentos.js','root')
            .then(async()=>{
                F.loadClass('../models/classTipodocumentos.js','root')
                .then(async()=>{

                    initView();
                   
                })
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    mantenimiento_generales:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/mant_clasificaciones_generales/view_mant_generales.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    clientes:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/mant_clientes/view_clientes.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        } 
    },
    clientes_rutas:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/mant_clientes/view_clientes_rutas.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        } 
    },
    empleados:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/mant_empleados/view_empleados.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        } 
    },
    bi_notificaciones:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/administracion/view_tablero_notificaciones.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    ventas_censo:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/ventas_censo/view_censo.js','root')
            .then(async()=>{
                    initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    ventas_pedidos:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/ventas_pedidos/view_pedidos.js','root')
            .then(async()=>{
                    initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    ventas_pedidos_comodin:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/ventas_pedidos/view_pedidos_comodin.js','root')
            .then(async()=>{
                    initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    ventas_visitas:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/ventas_visitas/view_visitas_ventas.js','root')
            .then(async()=>{
                    initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    devoluciones_clientes:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/transacciones/view_devoluciones.js','root')
            .then(async()=>{
                    initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        }
    },
    objetivos:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/bi_objetivos/view_objetivos.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        } 
    },
    objetivos_bi:()=>{
        if(Menu.verify()==true){
            Menu.salidaMenu();
            F.loadScript('../views/bi_objetivos/view_bi_objetivos.js','root')
            .then(async()=>{
                initView();
            })
        }else{
            F.AvisoError('No tiene permitido entrar a esta sección');
        } 
    },
}