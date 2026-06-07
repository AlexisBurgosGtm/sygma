'use strict';

function login_inyectarEstilos() {
    let style = document.getElementById('login-styles');
    const css = `
        body.login-active .page-header { display: none !important; }
        body.login-active #root_navbar { display: none !important; }
        body.login-active .page-content-wrapper { margin-left: 0 !important; }
        body.login-active #js-page-content { padding: 0 !important; }
        body.login-active main.page-content { min-height: 100vh; }
        body.login-active #root { min-height: 100vh; width: 100%; }

        .login-page {
            --login-primary: #0044a3;
            --login-primary-light: #3b7ddd;
            --login-glass: rgba(255, 255, 255, 0.14);
            --login-glass-border: rgba(255, 255, 255, 0.28);
            --login-text: #f8fafc;
            --login-muted: rgba(248, 250, 252, 0.72);
            position: relative;
            min-height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            overflow: hidden;
            background: linear-gradient(135deg, #0a1628 0%, #0d2847 35%, #0044a3 70%, #1a5fbf 100%);
            background-size: 200% 200%;
            animation: login-bg-shift 14s ease infinite;
        }

        @keyframes login-bg-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .login-page::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
                radial-gradient(ellipse 80% 50% at 20% 20%, rgba(96, 165, 250, 0.25), transparent 50%),
                radial-gradient(ellipse 60% 40% at 80% 80%, rgba(59, 125, 221, 0.2), transparent 45%);
            pointer-events: none;
        }

        .login-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(60px);
            opacity: 0.45;
            pointer-events: none;
            animation: login-orb-float 10s ease-in-out infinite;
        }
        .login-orb--1 {
            width: 280px; height: 280px;
            background: rgba(59, 125, 221, 0.5);
            top: -8%; left: -5%;
            animation-delay: 0s;
        }
        .login-orb--2 {
            width: 220px; height: 220px;
            background: rgba(0, 68, 163, 0.55);
            bottom: -5%; right: -3%;
            animation-delay: -3s;
        }
        .login-orb--3 {
            width: 160px; height: 160px;
            background: rgba(147, 197, 253, 0.35);
            top: 40%; right: 15%;
            animation-delay: -6s;
        }

        @keyframes login-orb-float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(12px, -18px) scale(1.05); }
            66% { transform: translate(-10px, 12px) scale(0.95); }
        }

        .login-shell {
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 420px;
            animation: login-card-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes login-card-in {
            from {
                opacity: 0;
                transform: translateY(24px) scale(0.96);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .login-glass-card {
            background: var(--login-glass);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--login-glass-border);
            border-radius: 24px;
            padding: 2rem 1.75rem 1.5rem;
            box-shadow:
                0 8px 32px rgba(0, 20, 60, 0.35),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .login-logo-wrap {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .login-logo-glow {
            position: absolute;
            inset: -12px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(147, 197, 253, 0.45) 0%, transparent 70%);
            animation: login-glow-pulse 3s ease-in-out infinite;
        }

        @keyframes login-glow-pulse {
            0%, 100% { opacity: 0.5; transform: scale(0.92); }
            50% { opacity: 1; transform: scale(1.08); }
        }

        .login-logo-ring {
            position: absolute;
            inset: -6px;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.25);
            animation: login-ring-spin 12s linear infinite;
        }

        @keyframes login-ring-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        #imgLogo.login-logo {
            position: relative;
            z-index: 2;
            width: 96px;
            height: 96px;
            border-radius: 22px;
            object-fit: contain;
            filter: drop-shadow(0 8px 24px rgba(0, 30, 80, 0.4));
            animation: login-logo-float 4s ease-in-out infinite;
            transition: transform 0.35s ease;
        }

        #imgLogo.login-logo:hover {
            transform: scale(1.06);
        }

        @keyframes login-logo-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }

        .login-brand-title {
            text-align: center;
            font-size: 1.35rem;
            font-weight: 600;
            color: var(--login-text);
            letter-spacing: -0.02em;
            margin: 0 0 0.2rem;
        }

        .login-brand-sub {
            text-align: center;
            font-size: 0.8125rem;
            color: var(--login-muted);
            margin: 0 0 1.5rem;
            font-weight: 400;
        }

        .login-glass-card label {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--login-muted);
            margin-bottom: 0.35rem;
        }

        .login-field {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 12px;
            color: var(--login-text);
            min-height: 46px;
            transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .login-field::placeholder {
            color: rgba(248, 250, 252, 0.4);
        }

        .login-field:focus {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(147, 197, 253, 0.65);
            box-shadow: 0 0 0 3px rgba(59, 125, 221, 0.25);
            color: var(--login-text);
        }

        .login-input-group .input-group-text {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-right: none;
            border-radius: 12px 0 0 12px;
            color: rgba(248, 250, 252, 0.75);
        }

        .login-input-group .login-field {
            border-left: none;
            border-radius: 0 12px 12px 0;
        }

        .login-input-group:focus-within .input-group-text {
            border-color: rgba(147, 197, 253, 0.65);
            color: var(--login-text);
        }

        .login-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 1.25rem;
            gap: 0.75rem;
        }

        .login-version-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: var(--login-muted);
            font-size: 0.7rem;
            border-radius: 999px;
            padding: 0.35rem 0.75rem;
            transition: background 0.2s, color 0.2s;
        }

        .login-version-btn:hover {
            background: rgba(255, 255, 255, 0.14);
            color: var(--login-text);
        }

        #btnIniciar {
            width: 52px;
            height: 52px;
            border: 2px solid rgba(255, 255, 255, 0.38);
            border-radius: 50%;
            background: linear-gradient(145deg, #0a2540 0%, #001433 100%);
            color: #f8fafc;
            box-shadow:
                0 4px 18px rgba(0, 0, 0, 0.38),
                inset 0 1px 0 rgba(255, 255, 255, 0.14);
            transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s, background 0.2s;
        }

        #btnIniciar i {
            color: #f8fafc;
            font-size: 1.1rem;
        }

        #btnIniciar:hover:not(:disabled) {
            transform: translateY(-2px) scale(1.04);
            background: linear-gradient(145deg, #0d3050 0%, #002055 100%);
            border-color: rgba(255, 255, 255, 0.55);
            box-shadow:
                0 8px 24px rgba(0, 0, 0, 0.42),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        #btnIniciar:disabled {
            opacity: 0.7;
            border-color: rgba(255, 255, 255, 0.22);
        }

        @media (max-width: 480px) {
            .login-glass-card { padding: 1.5rem 1.25rem 1.25rem; }
            .login-logo-wrap { width: 100px; height: 100px; }
            #imgLogo.login-logo { width: 80px; height: 80px; }
        }
    `;
    if (style) {
        style.textContent = css;
        return;
    }
    style = document.createElement('style');
    style.id = 'login-styles';
    style.textContent = css;
    document.head.appendChild(style);
}

function login_setPageMode(active) {
    document.body.classList.toggle('login-active', !!active);
    if (active && typeof spa_quitarTemaPos2 === 'function') {
        spa_quitarTemaPos2();
    } else if (!active && typeof spa_inyectarEstilosPos2 === 'function') {
        spa_inyectarEstilosPos2();
    }
}

function destroyView() {
    login_setPageMode(false);
}

function getView() {
    login_inyectarEstilos();
    login_setPageMode(true);

    let view = {
        login: () => `
        <div class="login-page">
            <div class="login-orb login-orb--1" aria-hidden="true"></div>
            <div class="login-orb login-orb--2" aria-hidden="true"></div>
            <div class="login-orb login-orb--3" aria-hidden="true"></div>

            <div class="login-shell">
                <div class="login-glass-card">
                    <div class="login-logo-wrap" id="scene">
                        <div class="login-logo-glow" aria-hidden="true"></div>
                        <div class="login-logo-ring" aria-hidden="true"></div>
                        <img
                            class="login-logo"
                            id="imgLogo"
                            src="./favicon.png"
                            width="96"
                            height="96"
                            alt="Logo"
                            ondblclick="typeof send_test === 'function' && send_test()">
                    </div>

                    <h1 class="login-brand-title">Onne Business</h1>
                    <p class="login-brand-sub">Inicie sesión para continuar</p>

                    <div id="frmLogin" autocomplete="off">
                        <div class="form-group mb-3">
                            <label for="txtUser">Usuario</label>
                            <div class="input-group login-input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fal fa-user"></i></span>
                                </div>
                                <input class="form-control login-field" type="text" id="txtUser" placeholder="Escriba su usuario" required>
                            </div>
                        </div>

                        <div class="form-group mb-0">
                            <label for="txtPass">Clave</label>
                            <div class="input-group login-input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fal fa-lock"></i></span>
                                </div>
                                <input class="form-control login-field" type="password" id="txtPass" placeholder="Escriba su contraseña" required>
                            </div>
                        </div>

                        <div class="login-footer" id="scene2">
                            <button type="button" class="btn login-version-btn" id="btnChangelog" title="Registro de cambios del sistema" onclick="get_log(); $('#modal_log').modal('show')">
                                <i class="fal fa-clipboard-list mr-1"></i>${versionapp}
                            </button>
                            <button type="button" class="btn btn-circle shadow hand" id="btnIniciar" title="Iniciar sesión">
                                <i class="fal fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    };

    root.innerHTML = view.login();
}

function login_submit() {
    let btnIniciar = document.getElementById('btnIniciar');
    if (!btnIniciar || btnIniciar.disabled) return;

    let usuario = document.getElementById('txtUser').value || '';
    let clave = document.getElementById('txtPass').value || '';

    btnIniciar.disabled = true;
    btnIniciar.innerHTML = '<i class="fal fa-spinner fa-spin"></i>';

    GF.login_empleado('', usuario, clave)
        .then((data) => {
            data.recordset.map((r) => {
                GlobalEmpnit = r.EMPNIT;
                GlobalNomEmpresa = r.EMPRESA;
                GlobalUsuario = r.NOMBRE;
                GlobalNivelUsuario = Number(r.NIVEL);
                GlobalCodUsuario = Number(r.CODIGO);
                Selected_coddoc_env = r.CODDOC_ENV;
                Selected_coddoc_cot = r.CODDOC_COT;
            });

            GF.get_data_empresa_config(GlobalEmpnit)
                .then((data) => {
                    btnIniciar.disabled = false;
                    btnIniciar.innerHTML = '<i class="fal fa-arrow-right"></i>';

                    GF.get_data_config().then((data) => {
                        data_config_general = data.recordset;
                        global_var_dias_objetivo = Number(data_config_general[4].VALOR || 0);
                    }).catch(() => { data_config_general = []; });

                    data_empresa_config = data.recordset[0];
                    Navegar.inicio();
                })
                .catch(() => {
                    F.AvisoError('No se pudieron cargar los datos de la empresa');
                    btnIniciar.disabled = false;
                    btnIniciar.innerHTML = '<i class="fal fa-arrow-right"></i>';
                });

            F.ObtenerUbicacion()
                .then((location) => {
                    GF.update_ubicacion_empleado(GlobalEmpnit, GlobalCodUsuario, location.latitude, location.longitude);
                })
                .catch(() => {
                    GF.update_ubicacion_empleado(GlobalEmpnit, GlobalCodUsuario, 0, 0);
                });
        })
        .catch((error) => {
            console.log('login error:');
            console.log(error);
            F.AvisoError('Usuario o clave incorrecto');
            btnIniciar.disabled = false;
            btnIniciar.innerHTML = '<i class="fal fa-arrow-right"></i>';
        });
}

function addListeners() {
    document.title = 'Login';

    GlobalNivelUsuario = 0;

    const btnIniciar = document.getElementById('btnIniciar');
    if (btnIniciar) {
        btnIniciar.addEventListener('click', login_submit);
    }

    const txtPass = document.getElementById('txtPass');
    if (txtPass) {
        txtPass.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                login_submit();
            }
        });
    }

    const txtUser = document.getElementById('txtUser');
    if (txtUser) {
        setTimeout(() => txtUser.focus(), 400);
    }

    get_log();
}

function efecto_confeti() {
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

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
}

function efecto_fireworks() {
    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }
        var particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
}

function efecto_nieve() {
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
}

function initView() {
    getView();
    addListeners();
}

function login(u, p) {
    return new Promise((resolve, reject) => {
        axios.post(GlobalUrlCalls + '/general/login', {
            u: u,
            p: p,
            TOKEN: TOKEN
        })
            .then((response) => {
                if (response.status.toString() == '200') {
                    let data = response.data;
                    if (Number(data.rowsAffected[0]) > 0) {
                        resolve(data);
                    } else {
                        reject();
                    }
                } else {
                    reject();
                }
            }, () => {
                reject();
            });
    });
}
