var socket = io();

socket.on('MODO_SAT', function(clave){
  try {
      //Navegar.login();
     
      F.showToast('Modo Sat activado')
      location.reload();
  } catch (error) {
    
  }
});


socket.on('notificacion', function(tipo,msn){
  
      try {
         F.showToast(msn);
          
      } catch (error) {
        console.log('Previo: ' +  error);
      }
      
});



socket.on('nueva_cotizacion', function(tipo,msn){
  
  try {
      if(GlobalSelectedForm=='SUPERVISOR'){
        F.Aviso(`Nueva Cotización: Vendedor: ${tipo} ${msn}`);
      }
  } catch (error) {
    console.log('Previo: ' +  error);
  }
  
});


socket.on('nuevo_despacho', (empnit,coddoc,correlativo)=>{

  
    console.log(`Nuevo despacho ${empnit} - ${coddoc} - ${correlativo}`);
    try {
      //document.getElementById('lbResult').innerText = `Nuevo despacho ${empnit} - ${coddoc} - ${correlativo}`
      //recarga la lista en despachos pendientes
      F.hablar('Nuevo despacho');
      F.showToast(`Nuevo despacho ${coddoc}-${correlativo}`)
      get_listado();
      
    } catch (error) {
      
    }

});

socket.on('fin_despacho', (empnit,coddoc,correlativo)=>{

  
    console.log(`Fin despacho ${empnit} - ${coddoc} - ${correlativo}`);
    try {
      //document.getElementById('lbResult').innerText = `Nuevo despacho ${empnit} - ${coddoc} - ${correlativo}`
      //recarga la lista en despachos pendientes
      //get_listado();
      
    } catch (error) {
      
    }


});


