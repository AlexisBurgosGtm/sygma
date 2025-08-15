let F = {
      phone_call: (telefono)=>{
      
      let llamar = telefono.replace(" ","");
      llamar = llamar.replace("-","");
      llamar = llamar.replace("/","");
      llamar = llamar.replace("*","");
      llamar = llamar.replace("$","");
      llamar = llamar.replace("&","");
      llamar = llamar.replace("'","");
      llamar = llamar.replace('"',"");

      window.location.href = 'tel:' + llamar;
      
      },
      imprimirTicket2(coddoc,correlativo,fechaemision,nit,nombre,direccion,fel_uudi,fel_serie,fel_numero,fel_fecha){

            let container = document.getElementById('containerTicket');
            let strEncabezado = '';

            switch (GlobalCodSucursal) {
              case '8813591-8':
                strEncabezado = `
                <div class="row">
                  <div class="col-12 text-center">
                    <img src='./logos/santafe.png' width="150" height="100"></img>
                    <br>
                    <h1>GRANJA AVICOLA SANTA FE, S.A.</h1>
                    <h3>GRANJA AVICOLA SANTA FE</h3>
                    <h3>NIT: 8813591-8</h3>
                    <h3>ESTABLECIMIENTO No. 1</h3>
                    <h3>ALDEA DON GREGORIO ZONA 0</h3>
                    <h3>SANTA ROSA, SANTA CRUZ NARANJO</h3>
                    <h3>PBX: 77250279</h3>
                    <h3>41504806</h3>
                    <br>
                    <h3>FACTURA</h3>
                  </div>
                </div>
                <br>
                <div class="row">
                  <div class="col-6">
                      <h3>SERIE:</h3>
                      <h3>NUMERO:</h3>
                      <h3>DOC. REF:</h3>
                      <br>
                      <h3>FECHA:</h3>
                      <h3>CERTIFICACIÓN:</h3>
                      <br>
                      <h3>NIT:</h3>
                      <h3>NOMBRE:</h3>
                      <h3>DIRECCION</h3>
                  </div>
                  <div class="col-6">
                      <h3>${fel_serie}</h3>
                      <h3>${fel_numero}</h3>
                      <h3>${coddoc}-${correlativo}:</h3>
                      <br>
                      <h3>${fel_fecha}</h3>
                      <h3>${fel_uudi}</h3>
                      <br>
                      <h3>${nit}</h3>
                      <h3>${nombre}</h3>
                      <h3>${direccion}</h3>
                  </div>
                </div>
                
                <br>

                <div class="row">
                    <div class="col-3"><h3>DESCRIPCION</h3></div>
                    <div class="col-3"><h3>UNIDADES</h3></div>
                    <div class="col-3"><h3>PRECIO</h3></div>
                    <div class="col-3"><h3>TOTAL</h3></div>
                </div>            
              `;
                break;
            
              default:
                break;
            }

          

            let strdata = '';

            let footer = '';
            let msg = ''; 

            axios.post('/digitacion/detallepedido3', {
                sucursal: GlobalCodSucursal,
                coddoc:coddoc,
                correlativo:correlativo
            })
            .then((response) => {
                const data = response.data.recordset;
                let total =0;
                data.map((rows)=>{
                        total = total + Number(rows.IMPORTE);
                        strdata += `
                        <div class="row">
                            <div class="col-3"><h3>${rows.DESPROD}</h3></div>
                            <div class="col-3"><h3>${rows.CANTIDAD.toString()}</h3></div>
                            <div class="col-3"><h3>${F.setMoneda(rows.PRECIO,'Q')}</h3></div>
                            <div class="col-3"><h3>${F.setMoneda(rows.IMPORTE,'Q')}</h3></div>
                        </div>  
                        `;
                })
                footer = `
                          <br>
                          <h1>TOTAL: ${F.setMoneda(total,'Q')}</h1>
                          
                          <div class="row">
                              <div class="col-12 text-center">
                                  <h2>SUJETO A PAGOS TRIMESTRALES ISR</h2>
                                  <br>
                                  <h3>NO SE HACEN DEVOLUCIONES EN EFECTIVO</h3>
                                  <br>
                                  <h5>Para cualquier sugerencia o</h5>
                                  <h5>comentario comunicarse al correo</h5>
                                  <h5>correo: cobros@grupobuenavista.com.gt</h5>
                                  <h5>FECHA/HORA DE CERTIFICACION</h5>
                                  <h5>${fel_fecha}</h5>
                                  <h5>NUMERO DE AUTORIZACION:</h5>
                                  <h5>${fel_uudi}</h5>
                                  <h5>DOCUMENTO TRIBUTARIO ELECTRONICO</h5>
                                  <h5>CERTIFICADOR: INFILE, S.A.</h5>
                                  <h5>NIT: 12521337</h5>
                              </div>
                          </div>
                          `
                msg = strEncabezado + strdata + footer;
              
                container.innerHTML = msg;

                F.imprimirSelec('containerTicket');

                //msg = encodeURIComponent(msg);
                //window.open('https://api.whatsapp.com/send?phone='+numero+'&text='+msg);

            }, (error) => {
                //F.AvisoError('Error en la solicitud');
                strdata = '';
                container.innerHTML = '';

            });


      },
      imprimirTicket(coddoc,correlativo,fechaemision,nit,nombre,direccion,fel_uudi,fel_serie,fel_numero,fel_fecha){
          
          window.open(FEL.URL_REPORT_INFILE.toString() + fel_uudi)      
      
      },
      imprimirTicket_uudi(fel_uudi){
          
        window.open(FEL.URL_REPORT_INFILE.toString() + fel_uudi);      

      },
      convertDateNormal(date) {

            try {
              date = date.replace('T00:00:00.000Z', '');
              const [yy, mm, dd] = date.split(/-/g);
              return `${dd}/${mm}/${yy}`;
            } catch (error) {
              return '';
            };
          
      },
      shareAppWhatsapp: ()=>{
          let url= window.location.origin
          swal({
            text: 'Escriba el número a donde se enviará el link de la aplicación:',
            content: "input",
            button: {
              text: "Enviar Whatsapp",
              closeModal: true,
            },
          })
          .then(numero => {
            if (!numero) throw null;
              let stn = '502' + numero.toString();
              let msg = encodeURIComponent(`Aplicación Ventas Mercados Efectivos ${versionapp} `);
                  window.open('https://api.whatsapp.com/send?phone='+stn+'&text='+msg+url)
          })   

      },
      mostrarErrores: (deserror)=>{
        console.log('error:')
        console.log(deserror);
          rootErrores.innerHTML = deserror;
          $("#modalErrores").modal('show');
      },
      readContacts:(idResult)=>{

          let container = document.getElementById(idResult);

          var api = (navigator.contacts || navigator.mozContacts);
        
          if (api && !!apigen.select) { // new Chrome API
            apigen.select(['name', 'email', 'tel'], {multiple: false})
              .then(function (contacts) {
                console.log('Found ' + contacts.length + ' contacts.');
                if (contacts.length) {
                  
                  let numero = contacts[0].tel.toString()
                  numero = numero.replace('+502','');
                  let stn = '502' + numero.toString();
                  stn = stn.replace(' ','');
                  F.Aviso(stn);
                  container.innerHTML = JSON.stringify(contacts);
                  
                }
              })
              .catch(function (err) {
                console.log('Fetching contacts failed: ' + err.name);
                F.AvisoError('Fetching contacts failed: ' + err.name)
              });
              
          } else if (api && !!apigen.find) { // old Firefox OS API
            var criteria = {
              sortBy: 'familyName',
              sortOrder: 'ascending'
            };
        
            apigen.find(criteria)
              .then(function (contacts) {
                console.log('Found ' + contacts.length + ' contacts.');
                container.innerHTML = JSON.stringify(contacts);
                if (contacts.length) {
                  let numero = contacts[0].tel.toString()
                  numero = numero.replace('+502','');
                  let stn = '502' + numero.toString();
                  stn = stn.replace(' ','');
                  F.Aviso(stn);
                  container.innerHTML = JSON.stringify(contacts);
                  
              }
              })
              .catch(function (err) {
                console.log('Fetching contacts failed: ' + err.name);
                F.AvisoError('Fetching contacts failed: ' + err.name)
              });
              
          } else {
            console.log('Contacts API not supported.');
            container.innerHTML = 'Contacts API not supported.'
          }

      },
      get_data_nit: (nit)=>{

        return new Promise((resolve, reject) => {
                              
          let alias = FEL.ACCESO_REQ_NOMBRE;
          let llave = FEL.ACCESO_REQ_CLAVE;
          
          let url = `/datosnit?nit=${nit}&fel_alias=${alias}&fel_llave=${llave}`;
          
          axios.get(url)
          .then((response) => {
              let json = response.data;
              json = json.replace(","," ");
              json = json.replace(",,"," ");
              json = json.replace(","," ");
              console.log(response.data);

              resolve(json);
          }, (error) => {
              console.log(error);
              reject();
          });
    


        });

      },
      get_data_dpi: (dpi)=>{

        return new Promise((resolve, reject) => {
                              
          let alias = FEL.ACCESO_REQ_NOMBRE;
          let llave = FEL.ACCESO_REQ_CLAVE;

          let url = `/datosdpi?dpi=${dpi}&fel_alias=${alias}&fel_llave=${llave}`;
          
          axios.get(url)
          .then((response) => {
              let json = response.data;
              json = json.replace(","," ");
              json = json.replace(",,"," ");
              json = json.replace(","," ");
              console.log(response.data);

              resolve(json);
          }, (error) => {
              console.log(error);
              reject();
          });
    


        });

      },
      instalationHandlers: (idBtnInstall)=>{
          //INSTALACION APP
          let btnInstalarApp = document.getElementById(idBtnInstall);
          btnInstalarApp.hidden = true;

          let capturedInstallEvent;
          window.addEventListener('beforeinstallprompt',(e)=>{
            e.preventDefault();
            btnInstalarApp.hidden = false;
            capturedInstallEvent = e;
          });
          btnInstalarApp.addEventListener('click',(e)=>{
            capturedInstallEvent.prompt();
            capturedInstallEvent.userChoice.then((choice)=>{
                //solicita al usuario confirmacion para instalar
            })
          });
        //INSTALACION APP
      },
      instalationHandlers2: (idContainer,idBtnInstall)=>{
            //INSTALACION APP
            let btnInstalarApp = document.getElementById(idBtnInstall);
            btnInstalarApp.hidden = true;

            let container = document.getElementById(idContainer);

            let capturedInstallEvent;
            window.addEventListener('beforeinstallprompt',(e)=>{
              e.preventDefault();
              container.hidden = false;
              capturedInstallEvent = e;
            });
            btnInstalarApp.addEventListener('click',(e)=>{
                capturedInstallEvent.prompt();
                capturedInstallEvent.userChoice.then((choice)=>{
                  //solicita al usuario confirmacion para instalar
                });
            })
            //INSTALACION APP
      },
      Confirmacion: function(msn){
          return swal({
              title: 'Confirme',
              text: msn,
              icon: 'warning',
              buttons: {
                  cancel: true,
                  confirm: true,
                }})
      },
      Aviso: function(msn){
          swal(msn, {
              timer: 1500,
              icon: "success",
              buttons: false
              });

          try {
              navigator.vibrate(500);
          } catch (error) {
              
          }
      },
      AvisoError: function(msn){
          swal(msn, {
              timer: 1500,
              icon: "error",
              buttons: false
              });
          try {
              navigator.vibrate([100,200,500]);
          } catch (error) {
              
          }
      },
      FiltrarListaProductos: function(idTabla){
          swal({
            text: 'Escriba para buscar...',
            content: "input",
            button: {
              text: "Buscar",
              closeModal: true,
            },
          })
          .then(name => {
            if (!name) throw null;
              F.FiltrarTabla(idTabla,name);

              //'tblProductosVentas'
          })
      },
      solicitarClave: function(){
        return new Promise((resolve,reject)=>{
            swal({
              text: 'Escriba su contraseña de usuario',
              content: "input",
              button: {
                text: "Contraseña",
                closeModal: true,
              },
            })
            .then(name => {
              if (!name) throw null;
                  resolve(name);
            })
            .catch(()=>{
              reject('no');
            })
        })     
      },
      solicitarCantidad: function(){
        return new Promise((resolve,reject)=>{
            swal({
              text: 'Escriba la Cantidad de Producto',
              content: "input",
              button: {
                text: "Aceptar",
                closeModal: true,
              },
            })
            .then(name => {
              if (!name) throw null;
                  resolve(name);
            })
            .catch(()=>{
              reject('no');
            })
        })     
      },
      setMoneda: function(num,signo) {
          num = num.toString().replace(/\$|\,/g, '');
          if (isNaN(num)) num = "0";
          let sign = (num == (num = Math.abs(num)));
          num = Math.floor(num * 100 + 0.50000000001);
          let cents = num % 100;
          num = Math.floor(num / 100).toString();
          if (cents < 10) cents = "0" + cents;
          for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
              num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
          let resultado = ((((sign) ? '' : '-') + signo + ' ' + num + ((cents == "00") ? '' : '.' + cents)).toString());
          
          if(resultado.includes('.')){}else{resultado = resultado + ".00"}
          
          return resultado.replace('-','');
      },
      setMargen: function(num,signo) {
        
        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num)) num = "0";
        let sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        let cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10) cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
        return ( ((sign) ? '' : '-') +  num + ((cents == "00") ? '' : '.' + cents) + ' ' + signo  ).toString();
      },
      get_margen(costo,precio,bono){

          let costoreal = (Number(costo)+Number(bono));
          let utilidad = (Number(precio) - costoreal);
      
          let porc = Number(utilidad) / Number(costoreal);
          porc = porc * 100
      
          return porc.toFixed(2)
    
      },
      loadScript: function(url, idContainer) {
          return new Promise((resolve, reject) => {
            var script = document.createElement('script');
            script.src = url;
      
            script.onload = resolve;
            script.onerror = reject;
            document.getElementById(idContainer).innerHTML = '';   
            document.getElementById(idContainer).appendChild(script)
          });
      },
      loadClass: function(url, idContainer) {
        return new Promise((resolve, reject) => {
          var script = document.createElement('script');
          script.src = url;
    
          script.onload = resolve;
          script.onerror = reject;

          try {
            console.log('cargando clase...')
            document.getElementById(idContainer).appendChild(script)  
          } catch (error) {
            console.log('Clase registrada con anterioridad... ' + error)
          }
          

        });
      },
      hablar: function(msn){
          var utterance = new SpeechSynthesisUtterance(msn);
          return window.speechSynthesis.speak(utterance); 
      },
      get_prioridades: function(){
          let str = '';
          tbl_etiquetas.map((r)=>{
              str += `<option value="${r.valor}" class="${r.color}">${r.valor}</option>`
          })
          return str;
      },
      crearBusquedaTabla: function(idTabla,idBusqueda){
      var tableReg = document.getElementById(idTabla);
      var searchText = document.getElementById(idBusqueda).value.toLowerCase();
        var cellsOfRow="";
        var found=false;
        var compareWith="";
    
        // Recorremos todas las filas con contenido de la tabla
          for (var i = 1; i < tableReg.rows.length; i++)
                  {
                    cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
                      found = false;
                      // Recorremos todas las celdas
                      for (var j = 0; j < cellsOfRow.length && !found; j++)
                      {
                        compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                        // Buscamos el texto en el contenido de la celda
                        if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1))
                        {
                            found = true;
                        }
                    }
                    if(found)
                    {
                        tableReg.rows[i].style.display = '';
                    } else {
                        // si no ha encontrado ninguna coincidencia, esconde la
                        // fila de la tabla
                        tableReg.rows[i].style.display = 'none';
                    }
                }
      },
      FiltrarTabla: function(idTabla,idfiltro){
      var tableReg = document.getElementById(idTabla);
      let filtro = document.getElementById(idfiltro).value;

      var searchText = filtro.toLowerCase();
        var cellsOfRow="";
        var found=false;
        var compareWith="";
    
        // Recorremos todas las filas con contenido de la tabla
          for (var i = 1; i < tableReg.rows.length; i++)
                  {
                    cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
                      found = false;
                      // Recorremos todas las celdas
                      for (var j = 0; j < cellsOfRow.length && !found; j++)
                      {
                        compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                        // Buscamos el texto en el contenido de la celda
                        if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1))
                        {
                            found = true;
                        }
                    }
                    if(found)
                    {
                        tableReg.rows[i].style.display = '';
                    } else {
                        // si no ha encontrado ninguna coincidencia, esconde la
                        // fila de la tabla
                        tableReg.rows[i].style.display = 'none';
                    }
                }
          //F.scrollUp(1000, 'easing');
      },
      OcultarRows: function(idTabla){
      var tableReg = document.getElementById(idTabla);
          // Recorremos todas las filas con contenido de la tabla
          for (var i = 1; i < tableReg.rows.length; i++)
          {
              if(i>15){
                  tableReg.rows[i].style.display = 'none';
              }
          }
      },
      NotificacionPersistent : (titulo,msn)=>{

          function InicializarServiceWorkerNotif(){
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () =>
            navigator.serviceWorker.register('sw.js')
              .then(registration => console.log('Service Worker registered'))
              .catch(err => 'SW registration failed'));
            };
            
            requestPermission();
          }
          
          if ('Notification' in window) {};
      
          function requestPermission() {
            if (!('Notification' in window)) {
              F.Aviso('Notification API not supported!');
              return;
            }
            
            Notification.requestPermission(function (result) {
              //$status.innerText = result;
            });
          }

          InicializarServiceWorkerNotif();
      
          const options = {
              body : titulo,
              icon: "../favicon.png",
              vibrate: [1,2,3],
            }
            //image: "../favicon.png",
              if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
                console.log('Persistent Notification API not supported!');
                return;
              }
              
              try {
                navigator.serviceWorker.getRegistration()
                  .then(reg => 
                          reg.showNotification(msn, options)
                      )
                  .catch(err => console.log('Service Worker registration error: ' + err));
              } catch (err) {
                console.log('Notification API error: ' + err);
              }
        
      },
      ObtenerUbicacion: ()=>{
          let lat = ''; let long='';
          return new Promise((resolve, reject)=>{
              try {
                navigator.geolocation.getCurrentPosition(function (location) {
                    lat = location.coords.latitude.toString();
                    long = location.coords.longitude.toString();
                    resolve(location.coords)
                })
              } catch (error) {
                  reject();
              }  
          })
          
      },
      Lmap: (lat,long)=>{
        //INICIALIZACION DEL MAPA 

          var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          osm = L.tileLayer(osmUrl, {center: [lat, long],maxZoom: 20, attribution: osmAttrib});    
          map = L.map('mapcontainer').setView([lat, long], 7).addLayer(osm);
    
          var userIcon = L.icon({
            iconUrl: '../img/userIcon.png',
            shadowUrl: '../img/marker-shadow.png',
        
            iconSize:     [30, 45], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
          })
          
      
      },
      ComboSemana :(letnum)=>{
        let str = '';
        if(letnum=="LETRAS"){
          str =  `
                  <option value="LUNES">LUNES</option>
                  <option value="MARTES">MARTES</option>
                  <option value="MIERCOLES">MIERCOLES</option>
                  <option value="JUEVES">JUEVES</option>
                  <option value="VIERNES">VIERNES</option>
                  <option value="SABADO">SABADO</option>
                  <option value="DOMINGO">DOMINGO</option>
                  `
        }else{
          str =  `<option value="1">LUNES</option>
                  <option value="2">MARTES</option>
                  <option value="3">MIERCOLES</option>
                  <option value="4">JUEVES</option>
                  <option value="5">VIERNES</option>
                  <option value="6">SABADO</option>
                  <option value="7">DOMINGO</option>
                  `
        };

        return str;
        
      },
      getDiaSemana:(numdia)=>{
        switch (numdia) {
          case 0:
            return 'DOMINGO';
            break;
          case 1:
            return 'LUNES';
            break;
          case 2:
            return 'MARTES';
            break;
          case 3:
            return 'MIERCOLES';
            break;
          case 4:
            return 'JUEVES';
            break;
          case 5:
            return 'VIERNES';
            break;
          case 6:
            return 'SABADO';
            break;
        
          default:
            break;
        }
      },
      ComboMeses: ()=>{
      let str =`<option value='1'>Enero</option>
                <option value='2'>Febrero</option>
                <option value='3'>Marzo</option>
                <option value='4'>Abril</option>
                <option value='5'>Mayo</option>
                <option value='6'>Junio</option>
                <option value='7'>Julio</option>
                <option value='8'>Agosto</option>
                <option value='9'>Septiembre</option>
                <option value='10'>Octubre</option>
                <option value='11'>Noviembre</option>
                <option value='12'>Diciembre</option>`
      return str;
      },
      ComboAnio: ()=>{
      let str =`<option value='2017'>2017</option>
                <option value='2018'>2018</option>
                <option value='2019'>2019</option>
                <option value='2020'>2020</option>
                <option value='2021'>2021</option>
                <option value='2022'>2022</option>
                <option value='2023'>2023</option>
                <option value='2024'>2024</option>
                <option value='2025'>2025</option>
                <option value='2026'>2026</option>
                <option value='2027'>2027</option>
                <option value='2028'>2028</option>
                <option value='2029'>2029</option>
                <option value='2030'>2030</option>
                <option value='2031'>2031</option>
                <option value='2032'>2032</option>
                <option value='2033'>2033</option>
                <option value='2034'>2034</option>
                <option value='2035'>2035</option>
                <option value='2036'>2036</option>
                <option value='2037'>2037</option>
                <option value='2038'>2038</option>
                <option value='2039'>2039</option>
                <option value='2040'>2040</option>
                <option value='2041'>2041</option>
                <option value='2042'>2042</option>
                <option value='2043'>2043</option>
                <option value='2044'>2044</option>
                <option value='2045'>2045</option>`
      return str;
      },
      get_mes_curso:()=>{
        
        let mes = 0;
        let f = new Date();
        mes = f.getUTCMonth()+1;
        return mes;

      },
      get_anio_curso:()=>{
        
        let anio = 0;
        let f = new Date();
        anio = f.getFullYear();
        return anio;

      },
      get_mes_anio_fecha:(idFecha)=>{
        
          let txtFecha = new Date(document.getElementById(idFecha).value);
          let anio = txtFecha.getFullYear();
          let mes = txtFecha.getUTCMonth()+1

          return [mes,anio]
      },
      getComboTipoClientes : ()=>{
        let str = '';

        tipo_negocios.map((r)=>{
          str += `
                  <option value='${r.tipo}'>${r.descripcion}</option>
                `

        })
       
        return str;

      },
      getFecha(){
        let fecha
        let f = new Date(); 
        let d = f.getDate(); 
        let m = f.getUTCMonth()+1; 

        switch (d.toString()) {
          case '30':
            m = f.getMonth()+1; 
            break;
          case '31':
            m = f.getMonth()+1; 
              break;
        
          default:

            break;
        }

        
        let y = f.getFullYear();
      
        di = d;
        var D = '0' + di;
        let DDI 
        if(D.length==3){DDI=di}else{DDI=D}
        
        ma = m;
        var MA = '0' + ma;
        let DDM 
        if(MA.length==3){DDM=ma}else{DDM=MA}


        fecha = y + '-' + DDM + '-' + DDI;
        return fecha;
      },
      limpiarTexto: (texto) =>{

          let resultado = '';

          var ignorarMayMin = true;
          var reemplazarCon = "";
          var reemplazarQue = '"';
          reemplazarQue = reemplazarQue.replace(/[\\^$.|?*+()[{]/g, "\\$&"),
          reemplazarCon = reemplazarCon.replace(/\$(?=[$&`"'\d])/g, "$$$$"),
          modif = "g" + (ignorarMayMin ? "i" : ""),
          regex = new RegExp(reemplazarQue, modif);
          resultado = texto.replace(regex,reemplazarCon);
          resultado = resultado.replace('´','');
          resultado = resultado.replace("'","");
          resultado = resultado.replace(/(\r\n|\n|\r)/gm, ""); //quita el enter o salto de linea

          
          return resultado;

      },
      limpiarTextoExport: (texto) =>{

          let resultado = '';

          var ignorarMayMin = true;
          var reemplazarCon = "";
          var reemplazarQue = '"';
          reemplazarQue = reemplazarQue.replace(/[\\^$.|?*+()[{]/g, "\\$&"),
          reemplazarCon = reemplazarCon.replace(/\$(?=[$&`"'\d])/g, "$$$$"),
          modif = "g" + (ignorarMayMin ? "i" : ""),
          regex = new RegExp(reemplazarQue, modif);
          resultado = texto.replace(regex,reemplazarCon);
          resultado = resultado.replace('´','');
          resultado = resultado.replace("'","");
          resultado = resultado.replace("#","");
          resultado = resultado.replace("$","");
          resultado = resultado.replace("&","");
          resultado = resultado.replace("%","");
          
          
          resultado = resultado.replace(/(\r\n|\n|\r)/gm, ""); //quita el enter o salto de linea

          
          return resultado;

      },
      devuelveFecha: (idInputFecha)=>{
          let fe = new Date(document.getElementById(idInputFecha).value);
          let ae = fe.getFullYear();
          let me = fe.getUTCMonth()+1;
          let de = fe.getUTCDate() 
          let fret = ae + '-' + me + '-' + de;
          return fret;
      },
      devuelveFechaV: (idInputFecha)=>{
          let fe = new Date(document.getElementById(idInputFecha).value);
          let ae = fe.getFullYear();
          let me = fe.getUTCMonth()+1;
          let de = fe.getUTCDate() 
          let fret =  de + '/' + me + '/' + ae;
          return fret;
      },
      showToast: (text)=>{
          //depente de la libreria noty
          new Noty({
            type: 'info',
            layout: 'topRight',
            timeout: '500',
            theme: 'metroui',
            progressBar: false,
            text,
          }).show();
      },
      slideAnimationTabs: ()=>{
        //inicializa el slide de las tabs en censo
        $('a[data-toggle="tab"]').on('hide.bs.tab', function (e) {
            var $old_tab = $($(e.target).attr("href"));
            var $new_tab = $($(e.relatedTarget).attr("href"));
    
            if($new_tab.index() < $old_tab.index()){
                $old_tab.css('position', 'relative').css("right", "0").show();
                $old_tab.animate({"right":"-100%"}, 300, function () {
                    $old_tab.css("right", 0).removeAttr("style");
                });
            }
            else {
                $old_tab.css('position', 'relative').css("left", "0").show();
                $old_tab.animate({"left":"-100%"}, 300, function () {
                    $old_tab.css("left", 0).removeAttr("style");
                });
            }
        });
    
        $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
            var $new_tab = $($(e.target).attr("href"));
            var $old_tab = $($(e.relatedTarget).attr("href"));
    
            if($new_tab.index() > $old_tab.index()){
                $new_tab.css('position', 'relative').css("right", "-2500px");
                $new_tab.animate({"right":"0"}, 500);
            }
            else {
                $new_tab.css('position', 'relative').css("left", "-2500px");
                $new_tab.animate({"left":"0"}, 500);
            }
        });
    
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            // your code on active tab shown
        });
      },
      exportTableToExcel: (tableID, filename = '')=>{
        var downloadLink;
        var dataType = 'application/vnd.ms-excel;charset=UTF-8';
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        
        // Specify file name
        filename = filename?filename+'.xls':'excel_data.xlsx';
        
        // Create download link element
        downloadLink = document.createElement("a");
        
        document.body.appendChild(downloadLink);
        
        if(navigator.msSaveOrOpenBlob){
            var blob = new Blob(['ufeff', tableHTML], {
                type: "text/plain;charset=utf-8;"//dataType
            });
            navigator.msSaveOrOpenBlob( blob, filename);
        }else{
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
        
            // Setting the file name
            downloadLink.download = filename;
            
            //triggering the function
            downloadLink.click();
        }
      },
      BACKUP_exportTableToExcel: (tableID, filename)=>{

        const $tabla = document.querySelector("#" + tableID);

            let tableExport = new TableExport($tabla, {
              exportButtons: false, // No queremos botones
              filename: "Reporte de prueba", //Nombre del archivo de Excel
              sheetname: "Reporte de prueba", //Título de la hoja
          });
          let datos = tableExport.getExportData();
          let preferenciasDocumento = datos.tabla.xlsx;
          tableExport.export2file(preferenciasDocumento.data, preferenciasDocumento.mimeType, preferenciasDocumento.filename, preferenciasDocumento.fileExtension, preferenciasDocumento.merges, preferenciasDocumento.RTL, preferenciasDocumento.sheetname);
      


      },
      getHora:()=>{
        let hoy = new Date();
        let hora = hoy.getHours();
        let minuto = hoy.getMinutes();
        return `${hora.toString()}:${minuto.toString()}`;
      },
      getHora_SAT:()=>{

        let hoy = new Date();
        let hora = hoy.getHours();
        let minuto = hoy.getMinutes();

        if(hora.length=='1'){hora = '0' + hora.toString()}
        if(minuto.length=='1'){minuto = '0' + minuto.toString()}

        return `${hora.toString()}:${minuto.toString()}:00`;
      },
      gotoGoogleMaps:(lat,long)=>{
        window.open(`https://www.google.com/maps?q=${lat},${long}`);
      },
      imprimirSelec:(nombreDiv)=>{
        
        var contenido= document.getElementById(nombreDiv).innerHTML;
        
        //var contenidoOriginal= document.body.innerHTML;
    
        //document.body.innerHTML = contenido;
    
        /*
        setTimeout(() => {
          window.print();
          document.body.innerHTML = contenidoOriginal;    
        }, 3000);
        */

        window.print();
        //document.body.innerHTML = contenidoOriginal;
      
      },
      converFileBase64:(file)=>{
          return new Promise((resolve, reject)=>{
              var reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = function() {
                    //console.log(reader.result);
                    resolve(reader.result);
              };
              reader.onerror = function(e){
                    console.log('Error: ', e);
                    reject(e);
              };
          })

        //usage:
        /*

        let file = document.querySelector('#txtClienteFoto').files[0];
            F.converBase64(file)
            .then((valor)=>{
                document.getElementById('txtCliente64Foto').value = valor;
            })
            .catch((e)=>{
                document.getElementById('txtCliente64Foto').value = e.toString();    
            })
        
        */
      },
      converBase64:(xmlstring)=>{
          return new Promise((resolve, reject)=>{
              let str = btoa(xmlstring)
              resolve(str);
          })
      },
      revertBase64:(base64string)=>{
          return new Promise((resolve, reject)=>{

              let str = atob(base64string)
              resolve(str);
          })
      },
      get_color_prioridad(prioridad){

          let bg = '';

          tbl_etiquetas.map((r)=>{
              if(r.valor==prioridad){bg = r.color }       
          })
          /*
          let tbl_etiquetas = [
            {valor:"BAJA",color:"bg-info"},
            {valor:"MEDIA",color:"bg-warning"},
            {valor:"ALTA",color:"bg-danger"},
          ]
          */

          return bg;

      },
      detectarPc:()=>{
          let navegador = navigator.userAgent;
          if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
              //console.log("Estás usando un dispositivo móvil!!");
            return 'tel';
          } else {
              //console.log("No estás usando un móvil");
            return 'pc';
          }
      },
      initit_datatable: (idtbl,bol_busqueda)=>{

          return;

          
          let bol = false;
          if(bol_busqueda==true){bol=true}else{bol=false}


          try {
            
            //$('#' + idtbl).DataTable().clear();
            $('#' + idtbl).DataTable().destroy();

          } catch (error) {
            console.log('datatable:')
            console.log(error);
          }

          try {
              new DataTable('#' + idtbl, {
                  paging: false,
                  scrollCollapse: true,
                  searching: bol,
                  dom: 'Bfrtip',
                  buttons: [
                    'copy', 'csv', 'excel', 'pdf', 'print'
                  ]
              });    
          } catch (error) {
              
          }

      },
      animateCSS: (element, animation, prefix = 'animate__') =>
        //utiliza Animate.css
        // We create a Promise and return it
        new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = document.getElementById(element);

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, {once: true});
      }),
      localStorage: (tabinicio)=>{

        localStorage.setItem('lastTab', '#' + tabinicio.toString());

      },
      get_existencia:(totalunidades,equivale)=>{
         
          let saldo = 0;
          
          try {
            saldo = Number(totalunidades)/Number(equivale);
          } catch (error) {
            saldo=0;
          }
          
          return saldo;
          
      },
      get_logrado:(venta,objetivo)=>{
         
          let saldo = 0;
          
          try {
            saldo = Number(venta)/Number(objetivo);
            saldo = saldo * 100;
          } catch (error) {
            saldo=0;
          }
          
          return saldo.toFixed(2);
          
      },
      create_qr_code:(codigo,idcontainer)=>{

          let container = document.getElementById(idcontainer);
          container.innerHTML = '';

          let qrcodetext = `XELASOL-${codigo}`;
          new QRCode(container, qrcodetext);

      }
};
