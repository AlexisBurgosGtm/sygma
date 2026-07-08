
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

function sygma_updateHeaderUsuario() {
    const el = document.getElementById('lbHeaderUsuario');
    if (!el) return;
    const textEl = el.querySelector('.header-user-badge__text');
    const loggedIn = Number(GlobalNivelUsuario) !== 0;
    const nombre = String(GlobalUsuario || '').trim();
    if (loggedIn && nombre) {
        if (textEl) textEl.textContent = nombre;
        el.title = 'Usuario: ' + nombre;
        el.classList.remove('d-none');
    } else {
        if (textEl) textEl.textContent = '';
        el.title = 'Usuario en sesión';
        el.classList.add('d-none');
    }
}



let versionapp = "M.08.07.26 13:45"
const CHANGELOG_JSON = './data/changelog.json';

function formatChangelogVersion(fecha, hora) {
    if (!fecha) return null;
    const parts = String(fecha).trim().split('-');
    if (parts.length !== 3) return null;
    const dd = parts[0];
    const mm = parts[1];
    const yy = parts[2].length >= 4 ? parts[2].slice(-2) : parts[2];
    const datePart = `${dd}.${mm}.${yy}`;
    const timePart = hora && String(hora).trim() ? ` ${String(hora).trim()}` : '';
    return `M.${datePart}${timePart}`;
}

function parseChangelogEntryTime(fecha, hora) {
    const parts = String(fecha || '').trim().split('-');
    if (parts.length !== 3) return 0;
    const dd = parseInt(parts[0], 10) || 1;
    const mm = parseInt(parts[1], 10) || 1;
    let yyyy = parseInt(parts[2], 10) || 2000;
    if (parts[2].length === 2) yyyy = 2000 + yyyy;
    const timeStr = hora && String(hora).trim() ? String(hora).trim() : '00:00';
    const timeParts = timeStr.split(':');
    const hh = parseInt(timeParts[0], 10) || 0;
    const min = parseInt(timeParts[1], 10) || 0;
    return new Date(yyyy, mm - 1, dd, hh, min).getTime();
}

function getLatestChangelogEntry(entries) {
    if (!entries.length) return null;
    let latest = entries[0];
    let latestTs = parseChangelogEntryTime(latest.FECHA, latest.HORA);
    for (let i = 1; i < entries.length; i++) {
        const entry = entries[i];
        const ts = parseChangelogEntryTime(entry.FECHA, entry.HORA);
        if (ts >= latestTs) {
            latestTs = ts;
            latest = entry;
        }
    }
    return latest;
}

function applyChangelogVersion(data) {
    const entries = (data.entries || []).filter((r) => r.DESCRIPCION && String(r.DESCRIPCION).trim() !== '');
    const latest = getLatestChangelogEntry(entries);
    const ver = latest
        ? formatChangelogVersion(latest.FECHA, latest.HORA)
        : (data.version || null);
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


Navegar.login();





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


