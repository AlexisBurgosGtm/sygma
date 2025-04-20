let lbForm = document.getElementById('lbForm');

let Navegar = {
    pendiente:()=>{
        F.Aviso('Esta opción aún no está disponible, pronto lo estará!!')
    },
    salir:()=>{
        F.Confirmacion('¿Está seguro que desea cerrar sesión y salir?')
        .then((value)=>{
            if(value==true){
                Navegar.login();
            }
        })
    },
    login:()=>{
    
        F.loadScript('../views/general_login/view_login.js','root')
        .then(async()=>{
            document.getElementById('js-primary-nav').style = "visibility:hidden";
            initView();
        })
    },
    inicio:()=>{
      
        //let rootMenu = document.getElementById('rootMenu');

        switch (Number(GlobalNivelUsuario)) {
            case 1: //GERENTE
                
                GF.fcn_load_navbar('GERENCIA','js-nav-menu_vendedor','js-primary-nav')
                
                Navegar.inicio_gerencia();

                break;

            case 2: //SUPERVISOR
                GF.fcn_load_navbar('SUPERVISOR','js-nav-menu_vendedor','js-primary-nav')
              
                Navegar.inicio_supervisor();
                break;
            case 3: //VENDEDOR
                
                GF.fcn_load_navbar('VENDEDOR','js-nav-menu_vendedor','js-primary-nav')
                
                Navegar.inicio_vendedor();
                break;
            case 4: //REPARTIDOR
                
                Navegar.inicio_despacho();
                break;
            case 5: //DIGITADOR
                
                GF.fcn_load_navbar('DIGITADOR','js-nav-menu_digitador','js-primary-nav')
                
                Navegar.inicio_digitador();


                break;
            case 6: //BODEGA
                
                break;
            case 7: //proveedor
                Navegar.inicio_proveedor();
                break;
        }
            
    },
    inicio_gerencia:()=>{
        if(Number(GlobalNivelUsuario)==0){return;}
        F.loadScript('../views/menu/inicio_gerencia.js','root')
        .then(async()=>{
            initView();
        })
    },
    inicio_supervisor:()=>{
        if(Number(GlobalNivelUsuario)==0){return;}
        F.loadScript('../views/menu/inicio_supervisor.js','root')
        .then(async()=>{
            initView();
        })
    },
    inicio_compras:()=>{
        if(Number(GlobalNivelUsuario)==0){return;}
        F.loadScript('../views/menu/inicio_compras.js','root')
        .then(async()=>{
            initView();
        })
    },
    inicio_ventas:()=>{
        if(Number(GlobalNivelUsuario)==0){return;}
        F.loadScript('../views/menu/inicio_ventas.js','root')
        .then(async()=>{
            initView();
        })
    },
    inicio_vendedor:()=>{
        if(Number(GlobalNivelUsuario)==0){return;}
        F.loadScript('../views/menu/inicio_ventas.js','root')
        .then(async()=>{
            initView();
        })
    },
    inicio_digitador:()=>{
        if(Number(GlobalNivelUsuario)==0){return;}
        F.loadScript('../views/menu/inicio_digitador.js','root')
        .then(async()=>{
            initView();
        })
    },
    inicio_despacho:()=>{
        if(Number(GlobalNivelUsuario)==0){return;}
        F.loadScript('../views/menu/inicio_despacho.js','root')
        .then(async()=>{
            initView();
        })
    },
    inicio_proveedor:()=>{
        if(Number(GlobalNivelUsuario)==0){return;}
        F.loadScript('../views/menu/inicio_proveedor.js','root')
        .then(async()=>{
            initView();
        })
    }
 
}