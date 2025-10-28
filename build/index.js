﻿
//inicia las view transition
document.startViewTransition(() => updateDOM());


function InicializarServiceWorkerNotif(){
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
   navigator.serviceWorker.register('./sw.js')
    .then(registration => console.log('Service Worker registered'))
    .catch(err => 'SW registration failed'));
  };

 
  requestPermission();
}

if ('Notification' in window) {};

function requestPermission() {
  if (!('Notification' in window)) {
    //alert('Notification API not supported!');
    return;
  }
  
  Notification.requestPermission(function (result) {
    //$status.innerText = result;
  });
}


InicializarServiceWorkerNotif();


Mousetrap.bind(['command+e', 'ctrl+e'], function(e) {
  $('#modalErrores').modal('show');
  
  return false;
});


//quita los alert de error en el plugin de las datatables
$.fn.dataTable.ext.errMode = 'none';


F.instalationHandlers('btnInstalarApp');




let versionapp = "M.28.10.2025:0"

function get_log(){

    let log = [
      {FECHA:'20-08-2025',DESCRIPCION:'AGREGADO INPUT BUSQUEDA DE DOCUMENTOS EN ARCHIVO/DOCUMENTOS'},
      {FECHA:'21-08-2025',DESCRIPCION:'AGREGADO CARGA DE COSTOS EN COMPRAS'},
      {FECHA:'21-08-2025',DESCRIPCION:'SE QUITO PROVISIONALMENTE LA EDICION DE CANTIDAD EN PEDIDOS VENDEDOR'},
      {FECHA:'21-08-2025',DESCRIPCION:'SE AGREGO LA VENTANA DE GOLES A MODULO GERENCIA EN INICIO'},
      {FECHA:'22-08-2025',DESCRIPCION:'EDITAR CANTIDAD EN NOTAS DE CREDITO / DEVOLUCIONES'},
      {FECHA:'22-08-2025',DESCRIPCION:'REVISION DE DUPLICIDAD AL CARGAR NOTA DE CREDITO / DEVOLUCION'},
      {FECHA:'02-09-2025',DESCRIPCION:'DESHABILITAR UNA MEDIDA DE PRECIOS POR SEDE'},
      {FECHA:'04-09-2025',DESCRIPCION:'CAJA DE BUSQUEDA EN FACTURAS ASIGNADAS A PICKING'},
      {FECHA:'09-09-2025',DESCRIPCION:'COLUMNA PARA BONI EN PICKING'},
      {FECHA:'22-09-2025',DESCRIPCION:'MODULO REPARTIDOR (V1)'},
      {FECHA:'23-09-2025',DESCRIPCION:'MODULO REPARTIDOR (V2)'},
      {FECHA:'25-09-2025',DESCRIPCION:'MODULO REPARTIDOR (V3)'},
      {FECHA:'26-09-2025',DESCRIPCION:'SE FILTRO EL COMBO EMPLEADOS PARA QUE APAREZCAN SOLO LOS DEL PICKING'},
      {FECHA:'26-09-2025',DESCRIPCION:'SE AGREGO RESUMEN DE DEVOLUCIONES EN MOD. REPARTIDOR'},
      {FECHA:'04-10-2025',DESCRIPCION:'SELLOUT Y CLIENTES EXPORTAR A XLSX'},
      {FECHA:'04-10-2025',DESCRIPCION:'RE-CREACION DE VENTANA DE LOGRO SEGUN P&G'},
      {FECHA:'10-10-2025',DESCRIPCION:'VENTANA DE LOGRO P&G V1'},
      {FECHA:'10-10-2025',DESCRIPCION:'DESCARGAR LISTA DE CLIENTES POR SEDE (EXCEL)'},
      {FECHA:'14-10-2025',DESCRIPCION:'SE AGREGO LOGRO PROCTER A SUPERVISOR Y PROVEEDOR'},
      {FECHA:'14-10-2025',DESCRIPCION:'VENTANA LOGRO P&G, OBJETIVOS GOLES Y PONER FALTANTES NEGATIVOS A CERO'},
      {FECHA:'15-10-2025',DESCRIPCION:'MODIFICACION DE GUARDADO DE DIAS LABORALES EN LOGRO P&G'},
      {FECHA:'15-10-2025',DESCRIPCION:'COLORES Y PROYECCION PORCENTUAL EN LOGRO P&G'},
      {FECHA:'17-10-2025',DESCRIPCION:'HISTORIAL DE CLIENTES CAMBIADO A MES'},
      {FECHA:'22-10-2025',DESCRIPCION:'SE AGREGARON TOTALES DE IMPORTE Y DEVOLUCION A LISTA DE EMBARQUES'},
      {FECHA:'28-10-2025',DESCRIPCION:'RESUMEN GENERAL EN LOGRO (TODOS)'},
      {FECHA:'',DESCRIPCION:'IMPEDIR QUE VENDEDORES PUEDAN EXCEDER EXISTENCIAS AL VENDER'},
      {FECHA:'',DESCRIPCION:'REVISION DE OBJETIVOS DE VENTAS VENDEDOR (SUMA DEVOLUCIONES)'},
      {FECHA:'',DESCRIPCION:''},
      {FECHA:'',DESCRIPCION:''},
      {FECHA:'',DESCRIPCION:''},
      {FECHA:'',DESCRIPCION:''},
      {FECHA:'',DESCRIPCION:''},
      {FECHA:'',DESCRIPCION:''},
    ]


    let container = document.getElementById('root_log');
    let str = '';

    log.map((r)=>{
        str+= `<tr>
                  <td>${r.FECHA}</td>
                  <td>${r.DESCRIPCION}</td>
              </tr>`
    })
    container.innerHTML = str;
    

};


Navegar.login();


  

