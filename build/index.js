
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


if (!window.SYGMA_IS_TAB_FRAME) {
  InicializarServiceWorkerNotif();
}


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

const SYGMA_DARK_KEY = 'sygmaDarkMode';

function sygma_isDarkMode() {
    return document.body.classList.contains('sygma-dark');
}

function sygma_syncDarkModeButton() {
    const btn = document.getElementById('btnSygmaDarkMode');
    if (!btn) return;
    const dark = sygma_isDarkMode();
    const icon = btn.querySelector('i');
    if (icon) {
        icon.className = dark ? 'fal fa-sun' : 'fal fa-moon';
    }
    btn.title = dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    btn.classList.toggle('is-on', dark);
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute('content', dark ? '#0b1220' : '#ffffff');
}

function sygma_applyDarkMode(on) {
    document.body.classList.toggle('sygma-dark', !!on);
    document.documentElement.classList.toggle('sygma-dark', !!on);
    document.documentElement.classList.toggle('dark', !!on);
    try {
        localStorage.setItem(SYGMA_DARK_KEY, on ? '1' : '0');
    } catch (e) {}
    sygma_syncDarkModeButton();
}

function sygma_toggleDarkMode() {
    sygma_applyDarkMode(!sygma_isDarkMode());
}

sygma_syncDarkModeButton();



let versionapp = "M.25.09.26 21:38"


if (!window.SYGMA_IS_TAB_FRAME) {
    Navegar.login();
}





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


