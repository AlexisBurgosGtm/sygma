
//inicia las view transition
//document.startViewTransition(() => updateDOM());


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




let versionapp = "M.06.06.2026 18:32"
const CHANGELOG_JSON = './data/changelog.json';

function formatChangelogVersion(fecha, hora) {
    if (!fecha) return versionapp;
    const parts = String(fecha).trim().split('-');
    const datePart = parts.length === 3
        ? `${parts[0]}.${parts[1]}.${parts[2]}`
        : String(fecha).trim().replace(/-/g, '.');
    const timePart = hora && String(hora).trim() ? ` ${String(hora).trim()}` : '';
    return `M.${datePart}${timePart}`;
}

function applyChangelogVersion(data) {
    const entries = (data.entries || []).filter((r) => r.DESCRIPCION && String(r.DESCRIPCION).trim() !== '');
    let ver = data.version;
    if (!ver && entries.length) {
        const last = entries[entries.length - 1];
        ver = formatChangelogVersion(last.FECHA, last.HORA);
    }
    if (!ver) return;
    versionapp = ver;
    const btnChangelog = document.getElementById('btnChangelog');
    if (btnChangelog) {
        btnChangelog.innerHTML = `<i class="fal fa-clipboard-list mr-1"></i>${versionapp}`;
    }
}

function get_log() {
    const container = document.getElementById('root_log');
    if (!container) return;

    container.innerHTML = GlobalLoader;

    axios.get(CHANGELOG_JSON + '?_=' + Date.now())
        .then((response) => {
            const data = response.data || {};
            applyChangelogVersion(data);

            const log = (data.entries || []).filter((r) => r.DESCRIPCION && String(r.DESCRIPCION).trim() !== '');
            let str = '';

            [...log].reverse().forEach((r) => {
                str += `<tr>
                    <td>${r.FECHA || ''}</td>
                    <td>${r.HORA || ''}</td>
                    <td>${r.DESCRIPCION || ''}</td>
                </tr>`;
            });

            container.innerHTML = str || '<tr><td colspan="3" class="text-center text-muted">Sin registros</td></tr>';
        })
        .catch(() => {
            container.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No se pudo cargar el registro de cambios</td></tr>';
        });
}


SpaRouter.start('login');



//-------------------------------------------
// FUNCION PARA LAZY LOADING DE LAS TABLAS
//-------------------------------------------

/* 
let bufferRows = 50;

function lazyLoadNext(numRows,tableBody) {
    numRows = Math.min(numRows, tableBody.childNodes.length);

    let rowsLoaded = 0;
    for (let i = 0; i < tableBody.childNodes.length; i++) {
        if (tableBody.childNodes[i].style.display != "none")
            continue;

        tableBody.childNodes[i].style = "";

        rowsLoaded++;
        if (rowsLoaded >= numRows)
            break;
    }
}

function lazyLoadBuffer(tableBody) {
    for (let i = tableBody.childNodes.length - 1; i >= 0; i--) {
        if (tableBody.childNodes[i].style.display == "none")
            continue;

        let rect = tableBody.childNodes[i].getBoundingClientRect();
        let viewHeight = window.innerHeight || document.documentElement.clientHeight;

        // If we are within 3 screens of the viewport, lazy load more rows
        if (rect.bottom <= viewHeight * 3) {
            console.log(`Lazy loading ${bufferRows} more rows...`)
            lazyLoadNext(bufferRows,tableBody);
        }

        break;
    }
}

lazyLoadNext(bufferRows);
window.onscroll = lazyLoadBuffer; 
  */

//-------------------------------------------
// FUNCION PARA LAZY LOADING DE LAS TABLAS
//-------------------------------------------


let CHECKIN = {
    verificar: () => {
        return new Promise((resolve, reject) => {

      
            try {
                axios.post(GlobalUrlCalls + '/empleados/checkin_verify',
                {
                    token:TOKEN,
                    sucursal:GlobalEmpnit,
                    fecha:F.getFecha(),
                    codemp:GlobalCodUsuario
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
                    console.log('tres')
                    console.log(error)
                    reject();
                });
            } catch (error) {
                
                console.log('error verificando: ' + error.toString())
                reject();
            }

           

        })
    },
    iniciar: () => {
        return new Promise((resolve, reject) => {

               axios.post(GlobalUrlCalls + '/empleados/checkin_inicio',
                {
                    token:TOKEN,
                    sucursal:GlobalEmpnit,
                    fecha:F.getFecha(),
                    codemp:GlobalCodUsuario,
                    hora:F.getHora(),
                    lat:0,
                    long:0
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
    finalizar: () => {
        return new Promise((resolve, reject) => {

                axios.post(GlobalUrlCalls + '/empleados/checkin_final',
                {
                    token:TOKEN,
                    sucursal:GlobalEmpnit,
                    fecha:F.getFecha(),
                    codemp:GlobalCodUsuario,
                    hora:F.getHora(),
                    lat:0,
                    long:0
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
};


