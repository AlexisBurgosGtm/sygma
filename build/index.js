
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



function get_log(){

    let log = [
      {FECHA:'20-08-2025',DESCRIPCION:'AGREGADO INPUT BUSQUEDA DE DOCUMENTOS EN ARCHIVO/DOCUMENTOS'},
      {FECHA:'21-08-2025',DESCRIPCION:'AGREGADO CARGA DE COSTOS EN COMPRAS'},
      {FECHA:'21-08-2025',DESCRIPCION:'SE QUITO PROVISIONALMENTE LA EDICION DE CANTIDAD EN PEDIDOS VENDEDOR'},
      {FECHA:'21-08-2025',DESCRIPCION:'SE AGREGO LA VENTANA DE GOLES A MODULO GERENCIA EN INICIO'},
      {FECHA:'',DESCRIPCION:'EDITAR CANTIDAD EN NOTAS DE CREDITO / DEVOLUCIONES'},
      {FECHA:'',DESCRIPCION:'REVISION DE DUPLICIDAD AL CARGAR NOTA DE CREDITO / DEVOLUCION'},
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


  

