function getView(){
    let view = {
        login : ()=>{
            return `
        <div class="row">
     
            <div class="col-md-3 col-sm-0 col-lg-0 col-lx-0">
            </div>

            <div class="col-md-6 col-sm-12 col-lg-6 col-lx-6">
   
                <div  class="card shadow p-2 card-rounded border-base">
                    <div class="card-header text-center bg-white">
                        <div class="row" >
                            <div  id="scene" class="text-center">
                                <img data-depth="1.0" id="imgLogo" src="./favicon.png" width="110" height="110" ondblclick="send_test()">                            
                            </div>    
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="" id="frmLogin" autocomplete="off">
                           
                            <div class="form-group">
                                <label class="negrita text-base">Sucursal:</label>
                                <select class="form-control negrita text-base" id="cmbEmpresa"></select>
                            </div>

                            <div class="form-group">
                                <label class="negrita text-base">Usuario:</label>
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">
                                            <i class="fal fa-user"></i>
                                        </span>
                                    </div>
                                    <input class="form-control" type="text" id="txtUser" placeholder="Escriba su usuario" required="true">
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="negrita text-base">Clave:</label>
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">
                                            <i class="fal fa-lock"></i>
                                        </span>
                                    </div>
                                    <input class="form-control" type="password" id="txtPass" placeholder="Escriba su contraseña" required="true">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6" align="left" id="scene2">
                                
                                    <small data-depth="0.8" class="text-secondary negrita">${versionapp}</small>
                                </div>
                                <div class="col-6" align="right">
                                    <button class="btn btn-base btn-xl shadow btn-circle" id="btnIniciar">
                                        <i class="fal fa-unlock"></i>  
                                    </button>
                                </div>
                            </div>
                           
                        </div>
                    </div>
                </div>

            </div>

            <div class="col-md-3 col-sm-0 col-lg-3 col-lx-3">
            </div>
        </div>

      
            `
            
        }
    };

    root.innerHTML = view.login();
};


function addListeners(){
    
    document.title = "Login";

    let cmbEmpresa = document.getElementById('cmbEmpresa');
    //cmbEmpresa.innerHTML = get_empresas();
    document.getElementById('btnIniciar').style="visibility:hidden";
    
        GF.get_data_empresas()
        .then((data)=>{
            let str = '';
            data.recordset.map((r)=>{
                str += `
                    <option value="${r.EMPNIT}">${r.NOMBRE}</option>
                `
            })
            cmbEmpresa.innerHTML = str;
            document.getElementById('btnIniciar').style="visibility:visible";
        })
        .catch(()=>{
            cmbEmpresa.innerHTML = "<option value=''>NO SE CARGARON LAS SEDES</option>"
        })
        
      

        GlobalNivelUsuario = 0;
    
        let btnIniciar = document.getElementById('btnIniciar');
        btnIniciar.addEventListener('click',()=>{
            
            let usuario = document.getElementById('txtUser').value || '';
            let clave = document.getElementById('txtPass').value || '';


            btnIniciar.disabled = true;
            btnIniciar.innerHTML = `<i class="fal fa-unlock fa-spin"></i>`;

            GF.login_empleado(cmbEmpresa.value,usuario,clave)
            .then((data)=>{
                
                GlobalEmpnit = cmbEmpresa.value;
                

                data.recordset.map((r)=>{
                    GlobalUsuario = r.NOMBRE;
                    GlobalNivelUsuario = Number(r.NIVEL);
                    GlobalCodUsuario = Number(r.CODIGO);
                    Selected_coddoc_env = r.CODDOC_ENV;
                    Selected_coddoc_cot = r.CODDOC_COT;
                })
                
                GF.get_data_empresa_config(GlobalEmpnit)
                .then((data)=>{
                    
                    btnIniciar.disabled = false;
                    btnIniciar.innerHTML = `<i class="fal fa-lock"></i>`;

                    GF.get_data_config().then((data)=>{data_config_general = data.recordset[0]}).catch(()=>{data_config_general = []})

                    data_empresa_config = data.recordset[0];
                    Navegar.inicio();
    
                })
                .catch(()=>{
                    F.AvisoError('No se pudieron cargar los datos de la empresa');
                    btnIniciar.disabled = false;
                    btnIniciar.innerHTML = `<i class="fal fa-lock"></i>`;
                })

            })
            .catch(()=>{
                
                F.AvisoError('Usuario o clave incorrecto');

                btnIniciar.disabled = false;
                btnIniciar.innerHTML = `<i class="fal fa-lock"></i>`;
            })



            

            
            return;


            let u = document.getElementById('txtUser').value || '';
            let p = document.getElementById('txtPass').value || '';

            btnIniciar.innerHTML = `<i class="fal fa-unlock fa-spin"></i>`;
            btnIniciar.disabled = true;

            
            login(u,p)
            .then((data)=>{
                
                btnIniciar.innerHTML = `<i class="fal fa-lock"></i>`;
                btnIniciar.disabled = false;

                //data_empresas = data.recordset;

                //btnMenu.style = "visibility:visible";
                GlobalEmpnit = cmbEmpresa.value;
                GlobalUsuario = u;

                let str = '';
               
                data.recordset.map((r)=>{
                    //TOKEN = r.TOKEN;
                    GlobalNivelUsuario = Number(r.NIVEL);
                    //str += `<option value='${r.EMPNIT}'>${r.EMPNOMBRE}</option>`
                });
               
                console.log('por aca...');

                Navegar.inicio();
                

            })
            .catch((error)=>{
                console.log('error en el login:')
                console.log(error)

                btnIniciar.innerHTML = `<i class="fal fa-lock"></i>`;
                btnIniciar.disabled = false;

                GlobalEmpnit='';
                F.AvisoError('No se pudo iniciar sesión');
            })
        })


        var scene = document.getElementById('scene');
        var scene2 = document.getElementById('scene2');
        var parallaxInstance = new Parallax(scene);
        var parallaxInstance2 = new Parallax(scene2);


        //efecto_nieve();

};


function efecto_confeti(){
        var count = 200;
        var defaults = {
        origin: { y: 0.7 }
        };

        function fire(particleRatio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
        });
        }

        fire(0.25, {
        spread: 26,
        startVelocity: 55,
        });
        fire(0.2, {
        spread: 60,
        });
        fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
        });
        fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
        });
        fire(0.1, {
        spread: 120,
        startVelocity: 45,
        });
};

function efecto_fireworks(){
    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
    
    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
    
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
    
      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
};


function efecto_nieve(){
    var duration = 20 * 1000;
    var animationEnd = Date.now() + duration;
    var skew = 1;

    function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
    }

    (function frame() {
    var timeLeft = animationEnd - Date.now();
    var ticks = Math.max(200, 500 * (timeLeft / duration));
    skew = Math.max(0.8, skew - 0.001);

    confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: ticks,
        origin: {
        x: Math.random(),
        // since particles fall down, skew start toward the top
        y: (Math.random() * skew) - 0.2
        },
        colors: ['#ffffff'],
        shapes: ['circle'],
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.4, 1),
        drift: randomInRange(-0.4, 0.4)
    });

    if (timeLeft > 0) {
        requestAnimationFrame(frame);
    }
    }());

};

function initView(){
   getView();
   addListeners();

};




function login(u,p){
    
    
    return new Promise((resolve,reject)=>{

     
        //resolve(data);
        //return;

        axios.post(GlobalUrlCalls + '/general/login',
            {
                u:u,
                p:p,
                TOKEN:TOKEN
            })
        .then((response) => {
            if(response.status.toString()=='200'){
                let data = response.data;
                if(Number(data.rowsAffected[0])>0){
                    resolve(data);             
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

};
