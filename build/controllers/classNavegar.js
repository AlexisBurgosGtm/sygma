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
            //btnMenu.style = "visibility:hidden";
            initView();
        })
    },
    inicio:()=>{
      
        let rootMenu = document.getElementById('rootMenu');

        switch (Number(GlobalNivelUsuario)) {
            case 1:
                rootMenu.innerHTML = Navegar.get_menu(1);
                Navegar.inicio_gerencia();
                break;
            case 2:
                rootMenu.innerHTML = Navegar.get_menu(2);
                Navegar.inicio_compras();
                break;
            case 3:
                rootMenu.innerHTML = Navegar.get_menu(3);
                Navegar.inicio_ventas();
                break;
            case 4:
                rootMenu.innerHTML = Navegar.get_menu(4);
                Navegar.inicio_despacho();
                break;
            case 5:
                
                break;
        }
            
    },
    get_menu:(nivel)=>{
        
        let strMenu = "";

        switch (nivel) {
            case 1:
            strMenu = `
            <div class="row">
                <div class="col-6">
                    
                    <div class="card col-12 card-rounded shadow hand" onclick="Menu.pos()">
                        <div class="card-body p-4">
                            <h4 class="negrita text-base">Facturacion</h4>
                        </div>
                    </div>
                    <br>

                    <div class="card col-12 card-rounded shadow hand" onclick="Menu.compras()">
                        <div class="card-body p-4">
                            <h4 class="negrita text-base">Compras</h4>
                        </div>
                    </div>
                    <br>

                    <div class="card col-12 card-rounded shadow hand" onclick="Menu.archivo()">
                        <div class="card-body p-4">
                            <h4 class="negrita text-base">Archivo</h4>
                        </div>
                    </div>
                    <br>


                </div>
                <div class="col-6">

                        <div class="card col-12 card-rounded shadow hand" onclick="Menu.productos()">
                            <div class="card-body p-4">
                                <h4 class="negrita text-base">Productos y Precios</h4>
                            </div>
                        </div>
                        <br>

                        <div class="card col-12 card-rounded shadow hand" onclick="Menu.mantenimiento_generales()">
                            <div class="card-body p-4">
                                <h4 class="negrita text-base">Clasificaciones</h4>
                            </div>
                        </div>
                        <br>

                </div>
            </div>
            `        
                break;
            case 2:
                strMenu = `
                <div class="row">
                    <div class="col-6">
                        
                        <div class="card col-12 card-rounded shadow hand" onclick="Menu.pos()">
                            <div class="card-body p-4">
                                <h4 class="negrita text-base">Facturacion</h4>
                            </div>
                        </div>
                        <br>
    
                        <div class="card col-12 card-rounded shadow hand" onclick="Menu.compras()">
                            <div class="card-body p-4">
                                <h4 class="negrita text-base">Compras</h4>
                            </div>
                        </div>
                        <br>
    
                        <div class="card col-12 card-rounded shadow hand" onclick="Menu.archivo()">
                            <div class="card-body p-4">
                                <h4 class="negrita text-base">Archivo</h4>
                            </div>
                        </div>
                        <br>
    
    
                    </div>
                    <div class="col-6">
    
                            <div class="card col-12 card-rounded shadow hand" onclick="Menu.productos()">
                                <div class="card-body p-4">
                                    <h4 class="negrita text-base">Productos y Precios</h4>
                                </div>
                            </div>
                            <br>
    
                            <div class="card col-12 card-rounded shadow hand" onclick="Menu.mantenimiento_generales()">
                                <div class="card-body p-4">
                                    <h4 class="negrita text-base">Clasificaciones</h4>
                                </div>
                            </div>
                            <br>
    
                    </div>
                </div>
                `   
                break;
            case 3:
                strMenu = `
                <div class="row">
                    <div class="col-6">
                        
                        <div class="card col-12 card-rounded shadow hand" onclick="Menu.pos()">
                            <div class="card-body p-4">
                                <h4 class="negrita text-base">Facturacion</h4>
                            </div>
                        </div>
                        <br>
    
                        <div class="card col-12 card-rounded shadow hand" onclick="Menu.compras()">
                            <div class="card-body p-4">
                                <h4 class="negrita text-base">Compras</h4>
                            </div>
                        </div>
                        <br>
    
                        <div class="card col-12 card-rounded shadow hand" onclick="Menu.archivo()">
                            <div class="card-body p-4">
                                <h4 class="negrita text-base">Archivo</h4>
                            </div>
                        </div>
                        <br>
    
    
                    </div>
                    <div class="col-6">
    
                            <div class="card col-12 card-rounded shadow hand" onclick="Menu.productos()">
                                <div class="card-body p-4">
                                    <h4 class="negrita text-base">Productos y Precios</h4>
                                </div>
                            </div>
                            <br>
    
                            <div class="card col-12 card-rounded shadow hand" onclick="Menu.mantenimiento_generales()">
                                <div class="card-body p-4">
                                    <h4 class="negrita text-base">Clasificaciones</h4>
                                </div>
                            </div>
                            <br>
    
                    </div>
                </div>
                `    
                break;
            case 4:
                strMenu = `
                <div class="row">
                    <div class="col-6">
                        
                        <div class="card col-12 card-rounded shadow hand" onclick="Menu.pos()">
                            <div class="card-body p-4">
                                <h4 class="negrita text-base">Facturacion</h4>
                            </div>
                        </div>
                        <br>
    
                        <div class="card col-12 card-rounded shadow hand" onclick="Menu.compras()">
                            <div class="card-body p-4">
                                <h4 class="negrita text-base">Compras</h4>
                            </div>
                        </div>
                        <br>
    
                        <div class="card col-12 card-rounded shadow hand" onclick="Menu.archivo()">
                            <div class="card-body p-4">
                                <h4 class="negrita text-base">Archivo</h4>
                            </div>
                        </div>
                        <br>
    
    
                    </div>
                    <div class="col-6">
    
                            <div class="card col-12 card-rounded shadow hand" onclick="Menu.productos()">
                                <div class="card-body p-4">
                                    <h4 class="negrita text-base">Productos y Precios</h4>
                                </div>
                            </div>
                            <br>
    
                            <div class="card col-12 card-rounded shadow hand" onclick="Menu.mantenimiento_generales()">
                                <div class="card-body p-4">
                                    <h4 class="negrita text-base">Clasificaciones</h4>
                                </div>
                            </div>
                            <br>
    
                    </div>
                </div>
                `   
                break;
            case 5:
                strMenu = `
                <div class="row">
                    <div class="col-6">
                        
                        <div class="card col-12 card-rounded shadow hand" onclick="Menu.pos()">
                            <div class="card-body p-4">
                                <h4 class="negrita text-base">Facturacion</h4>
                            </div>
                        </div>
                        <br>
    
                        <div class="card col-12 card-rounded shadow hand" onclick="Menu.compras()">
                            <div class="card-body p-4">
                                <h4 class="negrita text-base">Compras</h4>
                            </div>
                        </div>
                        <br>
    
                        <div class="card col-12 card-rounded shadow hand" onclick="Menu.archivo()">
                            <div class="card-body p-4">
                                <h4 class="negrita text-base">Archivo</h4>
                            </div>
                        </div>
                        <br>
    
    
                    </div>
                    <div class="col-6">
    
                            <div class="card col-12 card-rounded shadow hand" onclick="Menu.productos()">
                                <div class="card-body p-4">
                                    <h4 class="negrita text-base">Productos y Precios</h4>
                                </div>
                            </div>
                            <br>
    
                            <div class="card col-12 card-rounded shadow hand" onclick="Menu.mantenimiento_generales()">
                                <div class="card-body p-4">
                                    <h4 class="negrita text-base">Clasificaciones</h4>
                                </div>
                            </div>
                            <br>
    
                    </div>
                </div>
                `    
                break;
        
        }

        return strMenu;

    },
    inicio_gerencia:()=>{
        if(Number(GlobalNivelUsuario)==0){return;}
        F.loadScript('../views/menu/inicio_gerencia.js','root')
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
    inicio_despacho:()=>{
        if(Number(GlobalNivelUsuario)==0){return;}
        F.loadScript('../views/menu/inicio_despacho.js','root')
        .then(async()=>{
            initView();
        })
    }
 
}