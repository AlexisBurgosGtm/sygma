let GF = {
    modo_sat:()=>{
        socket.emit('MODO_SAT')
    },
    fcn_load_navbar: (menu,idNavbar,idContainer)=>{

        
        let container = document.getElementById(idContainer);
        container.style = "visibility:visible";
        
        let strMenu = ''
        
        switch (menu) {
            case 'DIGITADOR':
               strMenu = botones_menu.inicio_digitador();
                break;
            case 'VENDEDOR':
                strMenu = botones_menu.inicio_vendedor();
                break;
            default:
                strMenu = '';
                break;
        }

        container.innerHTML = strMenu;
        

        $('#' + idNavbar).navigation({ 
            accordion: true,
            animate: 'easeOutExpo',
            speed: 200,
            closedSign: '+',
            openedSign: '-',
            initClass: 'js-nav-built'
        });

    },
    print_orden_soporte:(noorden)=>{
        return new Promise((resolve,reject)=>{

            axios.get(`http://192.168.0.250:9000/ticket_soporte?sucursal=${GlobalEmpnit}&correlativo=${noorden}`)
            .then((response) => {
                if(response.status.toString()=='200'){
                    if(response.status.toString()=='200'){
                        let data = response.data;
                        if(data.toString()=="error"){
                            reject();
                        }else{
                            if(Number(data.rowsAffected[0])>0){
                                resolve(data);             
                            }else{
                                reject();
                            } 
                        }       
                    }else{
                        reject();
                    }                  
                }else{
                    reject();
                }             
            }, (error) => {
                reject();
            });
        }) 
    
    },
    get_data_config:()=>{

            return new Promise((resolve,reject)=>{

                axios.post(GlobalUrlCalls + '/config/config_generales')
                .then((response) => {
                    if(response.status.toString()=='200'){
                        let data = response.data;
                        if(data.toString()=="error"){
                            reject();
                        }else{
                            if(Number(data.rowsAffected[0])>0){
                                resolve(data);             
                            }else{
                                reject();
                            } 
                        }       
                    }else{
                        reject();
                    }                   
                }, (error) => {
                    reject();
                });
            }) 
    

    },
    login_empleado:(sucursal,u,p)=>{
    
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/empleados/empleados_login',
                {
                    sucursal:sucursal,
                    token:TOKEN,
                    u:u,
                    p:p
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })   
    
    },
    get_data_qry:(url,data)=>{
        return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + url, data)
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        }) 
    
    },
    verify_codprod:(codprod)=>{
    
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/productos/verify_codprod',
                {
                    sucursal:GlobalEmpnit,
                    token:TOKEN,
                    codprod:codprod
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })   
    
    },
    verify_serie_compra_fel:(serie,numero)=>{
    
        return new Promise((resolve,reject)=>{
    
            if(serie==''){reject();return};
            
            axios.post(GlobalUrlCalls + '/compras/verify_factura_compra_fel',
                {
                    sucursal:GlobalEmpnit,
                    token:TOKEN,
                    seriefac:serie,
                    numerofac:numero
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })   
    
    },
    get_data_buscar_producto(filtro){
    
  
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/productos/listado',
                {
                    sucursal:GlobalEmpnit,
                    token:TOKEN,
                    habilitado:'SI',
                    filtro:filtro
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })   
        
    
    },
    get_data_precios_producto(codprod){
    
  
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/productos/lista_precios',
                {
                    sucursal:GlobalEmpnit,
                    token:TOKEN,
                    codprod:codprod
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })   
    
    },
    verify_codprod_movimientos:(codprod)=>{
    
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/productos/verify_codprod_movimientos',
                {
                    sucursal:GlobalEmpnit,
                    token:TOKEN,
                    codprod:codprod
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })   
    
    },
    get_data_empleados_tipo:(tipo)=>{
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/empleados/empleados_tipo',
                {
                    sucursal:GlobalEmpnit,
                    token:TOKEN,
                    tipo:tipo
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })     
    },
    get_data_cajas:()=>{
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/cajas/listado',
                {
                    sucursal:GlobalEmpnit,
                    token:TOKEN
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })     
    },
    get_data_empresas:()=>{
    return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + '/general/empresas',{TOKEN:TOKEN})
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        }) 
    },
    get_data_color:()=>{
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/pos/listado_colores',
                {
                    sucursal:GlobalEmpnit,
                    token:TOKEN
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })     
    },
    get_data_tipodoc_coddoc:(tipodoc)=>{

        return new Promise((resolve, reject)=>{
            axios.post('/tipodocumentos/coddoc', {
                sucursal: GlobalEmpnit,
                tipo:tipodoc
            })
            .then((response) => {
                if(response=='error'){
                    reject();
                }else{
                    const data = response.data;
                    resolve(data);
                }
            }, (error) => {
                reject();
            });
        })
   
    },
    get_data_coddoc_correlativo:(coddoc)=>{

        return new Promise((resolve, reject)=>{
            axios.post('/tipodocumentos/correlativo', {
                sucursal: GlobalEmpnit,
                coddoc:coddoc
            })
            .then((response) => {
                if(response=='error'){
                    reject('0');
                }else{
                    
                    const data = response.data;
                    let correlativo =data.recordset[0].CORRELATIVO;
                    resolve(correlativo);

                }
            }, (error) => {
                console.log(error)
                reject('0');
            });
        })
   
    },
    get_productos_totales:(habilitado)=>{
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/productos/get_cantidad_productos',
                {
                    sucursal:GlobalEmpnit,
                    token:TOKEN,
                    habilitado:habilitado
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })     
    },
    get_data_movimientos_producto:(codprod)=>{

        return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + '/productos/movimientos_kardex', {
                token:TOKEN,
                sucursal:GlobalEmpnit,
                codprod:codprod
            })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        }) 
    
    },
    get_tbl_movimientos_producto:(codprod)=>{

        return new Promise((resolve,reject)=>{
            GF.get_data_movimientos_producto(codprod)
            .then((data)=>{
                
                let str =''
                let saldo = 0;

                data.recordset.map((r)=>{
                    let entrada = 0;
                    let salida = 0;
                    let strSaldoClass = '';

                    if(Number(r.INV)==1){entrada=Number(r.TOTALUNIDADES);salida=0}else{entrada=0;salida=Number(r.TOTALUNIDADES)}
                    
                    saldo += Number(r.TOTALUNIDADES) * Number(r.INV);
                    if(saldo<0){strSaldoClass="negrita text-danger"}else{strSaldoClass="negrita text-info"}
                    
                    str += `
                        <tr>
                            <td>${F.convertDateNormal(r.FECHA)}</td>
                            <td>${r.CODDOC}-${r.CORRELATIVO}</td>
                            <td>${entrada}</td>
                            <td>${salida}</td>
                            <td class="${strSaldoClass}">${saldo}</td>
                            <td>${F.setMoneda(r.PRECIO,'Q')}</td>
                            <td>${F.convertDateNormal(r.LASTUPDATE)}</td>
                            <td></td>
                        </tr>
                        `
                })
                resolve(str);    
            })
            .catch(()=>{
                resolve('No hay datos....');
            })
        })

        

    },
    get_data_documentos:(tipo,mes,anio)=>{
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/documentos/listado_documentos',
                {
                    sucursal:GlobalEmpnit,
                    token:TOKEN,
                    tipo:tipo,
                    anio:anio,
                    mes:mes
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })     
    },
    get_anulacion_documento:(coddoc,correlativo,status)=>{
        return new Promise((resolve,reject)=>{
    
            let strcall = ''
            if(status=='A'){strcall='/documentos/desanular_documento'}else{strcall='/documentos/anular_documento'}
            axios.post(GlobalUrlCalls + strcall,
                {
                    sucursal:GlobalEmpnit,
                    token:TOKEN,
                    coddoc:coddoc,
                    correlativo:correlativo
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })     
    },
    get_clasificaciones_listado:(tipo)=>{
        return new Promise((resolve,reject)=>{

            axios.post(GlobalUrlCalls + '/clasificaciones/listado', {token:TOKEN,tipo:tipo})
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        }) 
    
    },
    get_data_detalle_documento: (empnit,coddoc,correlativo)=>{
        return new Promise((resolve, reject)=>{
            
            let data = {
                sucursal:empnit,
                token:TOKEN,
                coddoc:coddoc,
                correlativo:correlativo
            };
    
            axios.post(`/documentos/detalle_documento`, data)
            .then(response => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }       
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_detalle_documento_json: (empnit,coddoc,correlativo)=>{
        return new Promise((resolve, reject)=>{
            
            let data = {
                sucursal:empnit,
                token:TOKEN,
                coddoc:coddoc,
                correlativo:correlativo
            };
    
            axios.post(`/documentos/detalle_documento_json`, data)
            .then(response => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }       
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_empresa_config(sucursal){
    
  
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/sucursales/data_empresa_config',
                {
                    token:TOKEN,
                    sucursal:sucursal
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })   
    
    },
    get_data_sucursales_precios(precio){
    
  
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/sucursales/sucursales_precio',
                {
                    token:TOKEN,
                    precio:precio
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })   
    
    },
    get_data_sucursales_existencia(codprod){
    
  
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/sucursales/sucursales_existencia_producto',
                {
                    token:TOKEN,
                    codprod:codprod
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })   
    
    },
    get_data_documentos_pendientes_producto(codprod){
    
  
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/compras/documentos_pendientes_producto',
                {
                    token:TOKEN,
                    codprod:codprod
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })   
    
    },
    update_precio_medida(codprod,tipo,codmedida,equivale,precio,bono,margen){
    
  
        return new Promise((resolve,reject)=>{
    
            axios.post(GlobalUrlCalls + '/productos/update_precio_medida',
                {
                    token:TOKEN,
                    sucursal:GlobalEmpnit,
                    codprod:codprod,
                    tipo:tipo,
                    codmedida:codmedida,
                    equivale:equivale,
                    precio:precio,
                    bono:bono,
                    margen:margen
                })
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        })   
    
    },
    get_data_pedidos_pendientes_vendedores:()=>{
        
        return new Promise((resolve,reject)=>{

            let data = {sucursal:GlobalEmpnit}

            axios.post(GlobalUrlCalls + '/despacho/pedidos_pendientes_vendedores', data)
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        }) 
    
    },
    get_data_pedidos_pendientes_vendedores_embarque:(codembarque)=>{
        
        return new Promise((resolve,reject)=>{

            let data = {sucursal:GlobalEmpnit,codembarque:codembarque}

            axios.post(GlobalUrlCalls + '/despacho/pedidos_pendientes_vendedores_embarque', data)
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        }) 
    
    },
    get_data_pedidos_update_embarque: (empnit,coddoc,correlativo,codembarque)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                codembarque:codembarque,
                coddoc:coddoc,
                correlativo:correlativo
            };
    
            axios.post(`/despacho/pedido_update_embarque`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_pedidos_anular: (empnit,coddoc,correlativo,new_status)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                coddoc:coddoc,
                correlativo:correlativo,
                st:new_status
            };
    
            axios.post(`/despacho/pedidos_pendientes_anular`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_pedidos_facturar_pedido: (empnit,coddoc,correlativo,coddoc_fac,correlativo_fac,fecha_fac,mes_fac,anio_fac)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                coddoc:coddoc,
                correlativo:correlativo,
                coddoc_fac: coddoc_fac,
                correlativo_fac:correlativo_fac,
                fecha_fac: fecha_fac,
                mes_fac:mes_fac,
                anio_fac:anio_fac
            };
    
            axios.post(`/despacho/pedidos_pendientes_facturar_pedido`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_embarque_facturas: (empnit,codembarque)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                codembarque:codembarque
            };
    
            axios.post(`/despacho/pedidos_pendientes_embarque_documentos`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_embarque_productos: (empnit,codembarque)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                codembarque:codembarque
            };
    
            axios.post(`/despacho/pedidos_pendientes_embarque_productos`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_surtido: (empnit)=>{
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                
            };
    
            axios.post(`/compras/surtido_sucursales`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_embarques_listado: (empnit,status,mes,anio)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                status:status,
                mes:mes,
                anio:anio
            };
    
            axios.post(`/despacho/embarques_lista`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_embarques_listado_activos: (empnit)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit
            };
    
            axios.post(`/despacho/embarques_lista_activos`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_embarques_listado_activos_fecha: (empnit,fecha)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                fecha:fecha
            };
    
            axios.post(`/despacho/embarques_lista_activos_fecha`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_embarques_insert: (empnit,fecha,mes,anio,codembarque,descripcion,ruteo,codempleado)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                fecha:fecha,
                mes:mes,
                anio:anio,
                codembarque:codembarque,
                descripcion:descripcion,
                ruteo:ruteo,
                codempleado:codempleado
            };
    
            axios.post(`/despacho/embarques_insert`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_embarques_edit: (empnit,fecha,mes,anio,codembarque,descripcion,ruteo,codempleado)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                fecha:fecha,
                mes:mes,
                anio:anio,
                codembarque:codembarque,
                descripcion:descripcion,
                ruteo:ruteo,
                codempleado:codempleado
            };
    
            axios.post(`/despacho/embarques_edit`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_embarques_delete: (codembarque,empnit)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                codembarque:codembarque
            };
    
            axios.post(`/despacho/embarques_delete`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_embarques_finalizar: (codembarque,empnit,status)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                codembarque:codembarque,
                status:status
            };
    
            axios.post(`/despacho/embarques_status`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_clientes_listado:(empnit,st)=>{

        return new Promise((resolve,reject)=>{

            let data = {
                token:TOKEN,
                sucursal:empnit,
                st:st
            }

            axios.post(GlobalUrlCalls + '/clientes/lista_clientes_general', data)
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        }) 


    },
    get_data_clientes_update_st: (empnit,codclie,st)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                codclie:codclie,
                st:st
            };
    
            axios.post(`/clientes/update_status_cliente`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_empleados_listado:(empnit,st)=>{

        return new Promise((resolve,reject)=>{

            let data = {
                token:TOKEN,
                sucursal:empnit,
                st:st
            }

            axios.post(GlobalUrlCalls + '/empleados/empleados_listado', data)
            .then((response) => {
                if(response.status.toString()=='200'){
                    let data = response.data;
                    if(data.toString()=="error"){
                        reject();
                    }else{
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);             
                        }else{
                            reject();
                        } 
                    }       
                }else{
                    reject();
                }                   
            }, (error) => {
                reject();
            });
        }) 


    },
    get_data_empleados_update_st: (empnit,codigo,st)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                codigo:codigo,
                st:st
            };
    
            axios.post(`/empleados/empleados_update_st`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_empleados_insert: (empnit,codtipo,nombre,direccion,telefono,usuario,clave,coddoc_env,coddoc_cot)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                codpuesto:codtipo,
                nombre:nombre,
                direccion:direccion,
                telefono:telefono,
                usuario:usuario,
                clave:clave,
                coddoc_env:coddoc_env,
                coddoc_cot:coddoc_cot
            };
    
            axios.post(`/empleados/empleados_insert`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_empleados_edit: (empnit,codigo,codtipo,nombre,direccion,telefono,usuario,clave,coddoc_env,coddoc_cot)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                codemp:codigo,
                codpuesto:codtipo,
                nombre:nombre,
                direccion:direccion,
                telefono:telefono,
                usuario:usuario,
                clave:clave,
                coddoc_env:coddoc_env,
                coddoc_cot:coddoc_cot
            };
    
            axios.post(`/empleados/empleados_edit`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
    get_data_empleados_delete: (empnit,codigo)=>{
        
        return new Promise((resolve, reject)=>{
            
            let data = {
                token:TOKEN,
                sucursal:empnit,
                codigo:codigo
            };
    
            axios.post(`/empleados/empleados_delete`, data)
            .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;
                    if(Number(data.rowsAffected[0])>0){
                        resolve(data);             
                    }else{
                        reject();
                    }            
                }else{
                    reject();
                } 
            })
            .catch(()=>{
                reject();
            })
    
        })
    },
};

