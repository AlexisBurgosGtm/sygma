
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 visitas-mapa-root" id="visitasMapaRoot">
                    <div id="visitasMapaPaneMapa">
                        ${view.vista_inicio()}
                    </div>
                    <div id="visitasMapaPaneDetalle" class="d-none">
                        ${view.vista_datos_cliente()}
                    </div>
                </div>
            `
        },
        vista_inicio:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">
                    <div class="row">
                        <div class="col-6">
                            
                            <div class="form-group">
                                <label class="text-secondary">Sucursal</label>
                                <select class="form-control" id="cmbSucursal">
                                </select>
                            </div>

                        </div>
                        <div class="col-6">
                            <h5 class="negrita text-success" id="lbTVisitadosMapa"></h5>
                            <h5 class="negrita text-danger" id="lbTNoVisitadosMapa"></h5>
                        </div>
                    </div>
                    
                </div>
            </div>
            <br>
          
                ${view.frag_mapa_visitas_vendedor()}
            `
        },
        frag_mapa_visitas_vendedor:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-4">
                    
                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-3">
                            <div class="form-group">
                                <label class="text-secondary">Tipo de visita</label>
                                <select class="form-control negrita" id="cmbTipoVisitaMapa">
                                    <option value="actuales">Visitas actuales</option>
                                    <option value="no_efectivas">Visitas no efectivas</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-3">
                            <div class="form-group">
                                <label class="text-secondary">Vendedor</label>
                                <select class="form-control" id="cmbEmpleado">
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-3">
                            <div class="form-group">
                                <label class="text-secondary">Fecha</label>
                                <input type="date" class="form-control" id="txtFecha">
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-3" id="wrapDiaClienteMapa">
                            <div class="form-group">
                                <label class="text-secondary">Día de ruta</label>
                                <select class="form-control negrita text-danger border-danger" id="cmbDiaCliente">
                                            <option value="LUNES">LUNES</option>
                                            <option value="MARTES">MARTES</option>
                                            <option value="MIERCOLES">MIERCOLES</option>
                                            <option value="JUEVES">JUEVES</option>
                                            <option value="VIERNES">VIERNES</option>
                                            <option value="SABADO">SABADO</option>
                                            <option value="DOMINGO">DOMINGO</option>
                                            <option value="OTROS">OTROS</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <br>
                    <div id="container_mapa">
                    </div>

                    
                
                </div>
            </div>
            `
        },
        vista_datos_cliente:()=>{
            return `
            <div class="card card-rounded col-12">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center flex-wrap mb-3">
                        <button type="button" class="btn btn-secondary btn-sm negrita shadow-sm" id="btnVisitasMapaVolver" data-supervisor-keep="true" title="Regresar al mapa">
                            <i class="fal fa-arrow-left mr-1"></i> Volver al mapa
                        </button>
                    </div>

                    <h5 class="negrita text-danger" id="lbNomclieMarca"></h5>
                    <small>CODIGO CLIENTE: </small>
                    <h5 class="text-secondary" id="lbCodclieMarca"></h5>

                </div>
            </div>
            <button type="button" class="btn btn-secondary btn-bottom-l btn-xl btn-circle hand shadow" id="btnVisitasMapaVolverFab" data-supervisor-keep="true" title="Volver al mapa">
                <i class="fal fa-arrow-left"></i>
            </button>
            <br>
            <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    ${view.frag_rpt_marcas_cliente()}
                </div>
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    ${view.frag_rpt_productos_cliente()}
                </div>
            </div>
            
            
            `
        },
        frag_rpt_marcas_cliente:()=>{
            return `
            <div class="card card-rounded">
                <div class="card-body p-4">
                    
                    <h5 class="text-secondary">Marcas compradas por el cliente Mes en Curso</h5>

                    <div class="table-responsive">

                        <small>Total: </small>
                        <h5 class="text-danger negrita" id="lbTotalClienteMarca"></h5>

                        <table class="table table-bordered h-full col-12">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <td>MARCA</td>
                                    <td>TOTAL VENDIDO</td>
                                </tr>
                            </thead>
                            <tbody id="tbl_data_marcas_cliente">
                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
            `
        },
        frag_rpt_productos_cliente:()=>{
            return `
            <div class="card card-rounded">
                <div class="card-body p-4">
                    
                    <h5 class="text-secondary">Productos comprados por el cliente</h5>

                    <div class="table-responsive">

                        <small>Total: </small>
                        <h5 class="text-danger negrita" id="lbTotalClienteProductos"></h5>

                        <table class="table table-bordered h-full col-12">
                            <thead class="bg-primary text-white">
                                <tr>
                                    <td>PRODUCTO</td>
                                    <td>TOTALUNIDADES</td>
                                    <td>IMPORTE</td>
                                </tr>
                            </thead>
                            <tbody id="tbl_data_productos_cliente">
                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
            `
        },
        modal_marcas_cliente:()=>{
            return `
            <div class="modal fade js-modal-settings modal-backdrop-transparent modal-with-scroll" tabindex="-1" 
                role="dialog" aria-hidden="true" 
                id="modal_marcas_cliente">
                <div class="modal-dialog modal-dialog-right modal-xl">
                    <div class="modal-content">
                        <div class="dropdown-header bg-base d-flex justify-content-center align-items-center w-100">
                            <h4 class="m-0 text-center color-white" id="">
                                Marcas del Mes
                            </h4>
                        </div>
                        <div class="modal-body p-2">
                            
                            <div class="card card-rounded">
                                <div class="card-body p-2">

                                    <h5 class="text-danger" id="lbNomclieMarca"></h5>
                                    <h5 class="negrita text-danger" id="lbCodclieMarca"></h5>

                                    <h5 class="text-secondary">Marcas compradas por el cliente Mes en Curso</h5>

                                    <div class="table-responsive">

                                        <small>Total: </small>
                                        <h5 class="text-danger negrita" id="lbTotalClienteMarca"></h5>

                                        <table class="table table-bordered h-full col-12">
                                            <thead class="bg-secondary text-white">
                                                <tr>
                                                    <td>MARCA</td>
                                                    <td>TOTAL VENDIDO</td>
                                                </tr>
                                            </thead>
                                            <tbody id="tbl_data_marcas_cliente">
                                            </tbody>
                                        </table>

                                    </div>

                                </div>
                            </div>

                            <button class="btn btn-bottom-l btn-xl btn-secondary btn-circle hand shadow" data-dismiss="modal">
                                <i class="fal fa-arrow-left"></i>
                            </button>                              

                        </div>
                    </div>
                </div>
            </div>

            
            `
        }
    }

    root.innerHTML = view.body();

};

function addListeners(){

    F.slideAnimationTabs();


    let cmbSucursal = document.getElementById('cmbSucursal');
    let f = new Date();
    document.getElementById('cmbDiaCliente').value = F.getDiaSemana(f.getDay());

    GF.get_data_empresas()
    .then((data)=>{

        let str = ``;

        data.recordset.map((r)=>{
            str += `<option value="${r.EMPNIT}">${r.NOMBRE}</option>`;
        })
        cmbSucursal.innerHTML = str; 
        
        switch (Number(GlobalNivelUsuario)) {
            case 1: //gerente
                break;
            case 5: //digitador
                cmbSucursal.value = GlobalEmpnit;
                break;
            case 7: //proveedor
                break;
        
            default:
                cmbSucursal.value = GlobalEmpnit;
                cmbSucursal.disabled = true;
                break;
        }

        get_empleados()
        .then(()=>{
             get_reportes(); 
        })
        .catch(()=>{

        })
      

    })
    .catch(()=>{
        cmbSucursal.innerHTML = `<option value="%">No se cargaron las sedes</option>`
    })

    document.getElementById('txtFecha').value = F.getFecha();

    cmbSucursal.addEventListener('change',()=>{
         get_empleados()
        .then(()=>{
             get_reportes(); 
        })
        .catch(()=>{

        })
    });
    document.getElementById('cmbEmpleado').addEventListener('change',()=>{
        get_reportes();
    });
    document.getElementById('cmbDiaCliente').addEventListener('change',()=>{
        get_reportes();
    });

    document.getElementById('txtFecha').addEventListener('change',()=>{
        document.getElementById('cmbDiaCliente').value = F.devuelve_dia_semana('txtFecha');
        get_reportes();
    });

    document.getElementById('cmbTipoVisitaMapa')?.addEventListener('change', () => {
        visitasMapa_syncTipoVisitaUI();
        get_reportes();
    });
    document.getElementById('btnVisitasMapaVolver')?.addEventListener('click', visitasMapa_showMapa);
    document.getElementById('btnVisitasMapaVolverFab')?.addEventListener('click', visitasMapa_showMapa);

    visitasMapa_syncTipoVisitaUI();

};

function initView(){

    getView();
    addListeners();

};

function get_empleados(){

    return new Promise((resolve, reject) => {
        

            let sucursal = document.getElementById('cmbSucursal').value;

            GF.get_data_empleados_tipo_emp(3,sucursal)
            .then((data)=>{
                let str = `<option value='TODOS'>TODOS</option>`;
                data.recordset.map((r)=>{
                    str += `<option value='${r.CODEMPLEADO}'>${r.NOMEMPLEADO}</option>`
                })
                document.getElementById('cmbEmpleado').innerHTML = str;
                resolve();
            })
            .catch(()=>{
                document.getElementById('cmbEmpleado').innerHTML = '';
                reject();
            })


    })


};


function visitasMapa_tipo() {
    return document.getElementById('cmbTipoVisitaMapa')?.value || 'actuales';
}

function visitasMapa_syncTipoVisitaUI() {
    const noEfec = visitasMapa_tipo() === 'no_efectivas';
    const wrapDia = document.getElementById('wrapDiaClienteMapa');
    if (wrapDia) wrapDia.classList.toggle('d-none', noEfec);
}

function visitasMapa_showMapa() {
    document.getElementById('visitasMapaPaneDetalle')?.classList.add('d-none');
    document.getElementById('visitasMapaPaneMapa')?.classList.remove('d-none');
    const map = window._visitasMapaLeaflet;
    if (map && typeof map.invalidateSize === 'function') {
        setTimeout(() => {
            try { map.invalidateSize(); } catch (e) { /* mapa ya destruido */ }
        }, 200);
    }
}

function visitasMapa_showDetalle() {
    document.getElementById('visitasMapaPaneMapa')?.classList.add('d-none');
    document.getElementById('visitasMapaPaneDetalle')?.classList.remove('d-none');
}

function visitasMapa_coordsValidas(lat, lng) {
    const nlat = Number(lat);
    const nlng = Number(lng);
    return Number.isFinite(nlat) && Number.isFinite(nlng) && nlat !== 0 && nlng !== 0;
}

function visitasMapa_escHtml(v) {
    return String(v ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function get_reportes(){
    visitasMapa_showMapa();
    get_visitas_dia_vendedor();
};

function destroyView(){
    if (window._visitasMapaLeaflet) {
        try { window._visitasMapaLeaflet.remove(); } catch (e) { /* ignore */ }
        window._visitasMapaLeaflet = null;
    }
};


function visitasMapa_crearMapa(onReady) {
    if (window._visitasMapaLeaflet) {
        try { window._visitasMapaLeaflet.remove(); } catch (e) { /* ignore */ }
        window._visitasMapaLeaflet = null;
    }

    const crear = (lat, lng) => {
        const map = L.map('mapcontainer').setView([Number(lat), Number(lng)], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        window._visitasMapaLeaflet = map;
        onReady(map);
    };

    try {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (location) => crear(location.coords.latitude, location.coords.longitude),
                () => crear(14.6349, -90.5069),
                { timeout: 6000 }
            );
        } else {
            crear(14.6349, -90.5069);
        }
    } catch (error) {
        crear(14.6349, -90.5069);
    }
}

function get_visitas_dia_vendedor(){

    const container = document.getElementById('container_mapa');
    if (!container) return;
    container.innerHTML = `<div class="mapcontainer5" id="mapcontainer"></div>`;

    const tipo = visitasMapa_tipo();
    const dia = document.getElementById('cmbDiaCliente')?.value;
    const codemp = document.getElementById('cmbEmpleado')?.value;
    const fecha = F.devuelveFecha('txtFecha');
    const fechaIso = document.getElementById('txtFecha')?.value || fecha;

    const LeafIcon = L.Icon.extend({
        options: {
            shadowUrl: './libs/leaflet/images/marker-shadow.png',
            iconSize: [18, 35],
            shadowSize: [0, 0],
            iconAnchor: [20, 92],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76]
        }
    });
    const greenIcon = new LeafIcon({iconUrl: './libs/leaflet/images/marker-icon-green.png'});
    const redIcon = new LeafIcon({iconUrl: './libs/leaflet/images/marker-icon-red.png'});
    const blueIcon = new LeafIcon({iconUrl: './libs/leaflet/images/marker-icon.png'});

    visitasMapa_crearMapa((map) => {
        const loader = tipo === 'no_efectivas'
            ? data_visitas_no_efectivas(codemp, fechaIso)
            : data_visitas_vendedor(codemp, fecha, dia);

        loader
            .then((data) => {
                let varTotalVisitados = 0;
                let varTotalNoVisitados = 0;
                let latInicial = 0;
                let longInicial = 0;

                (data.recordset || []).forEach((r) => {
                    let latPin = r.LATITUD;
                    let lngPin = r.LONGITUD;
                    if (tipo === 'no_efectivas' && !visitasMapa_coordsValidas(latPin, lngPin)) {
                        latPin = r.CLIENTE_LATITUD;
                        lngPin = r.CLIENTE_LONGITUD;
                    }
                    if (!visitasMapa_coordsValidas(latPin, lngPin)) return;

                    if (!latInicial) {
                        latInicial = Number(latPin);
                        longInicial = Number(lngPin);
                    }

                    let icono = redIcon;
                    let popupExtra = '';
                    if (tipo === 'no_efectivas') {
                        varTotalNoVisitados += 1;
                        icono = blueIcon;
                        const motivo = visitasMapa_escHtml(r.MOTIVO || 'SIN MOTIVO');
                        const hora = visitasMapa_escHtml(r.HORA || '');
                        const emp = visitasMapa_escHtml(r.EMPLEADO || '');
                        popupExtra = `<br><small class="negrita">No efectiva · ${motivo}${hora ? ' · ' + hora : ''}</small>${emp ? `<br><small>${emp}</small>` : ''}`;
                    } else if (F.convertir_fecha(r.LASTSALE, '-').toString() == F.devuelveFecha2('txtFecha')) {
                        varTotalVisitados += 1;
                        icono = greenIcon;
                    } else {
                        varTotalNoVisitados += 1;
                    }

                    const nom = visitasMapa_escHtml(r.NOMBRE || '');
                    const negocio = visitasMapa_escHtml(`${r.TIPONEGOCIO || ''}-${r.NEGOCIO || ''}`);
                    const dir = visitasMapa_escHtml(typeof F.limpiarTexto === 'function' ? F.limpiarTexto(r.DIRECCION) : (r.DIRECCION || ''));

                    L.marker([Number(latPin), Number(lngPin)], { icon: icono })
                        .addTo(map)
                        .bindPopup(`${negocio}, ${nom}<br><small>${dir}</small>${popupExtra}`, { closeOnClick: false, autoClose: true })
                        .on('click', function () {
                            get_datos_cliente(r.CODCLIENTE, r.NOMBRE);
                        });
                });

                if (tipo === 'no_efectivas') {
                    document.getElementById('lbTVisitadosMapa').innerText = '';
                    document.getElementById('lbTNoVisitadosMapa').innerText = `No efectivas: ${varTotalNoVisitados}`;
                } else {
                    document.getElementById('lbTVisitadosMapa').innerText = `Vendido: ${varTotalVisitados}`;
                    document.getElementById('lbTNoVisitadosMapa').innerText = `No Vendido: ${varTotalNoVisitados}`;
                }

                setTimeout(function () {
                    map.invalidateSize();
                    if (latInicial) map.flyTo([latInicial, longInicial], 10);
                }, 400);
            })
            .catch(() => {
                container.innerHTML = tipo === 'no_efectivas'
                    ? 'No hay visitas no efectivas en esta fecha...'
                    : 'No se cargaron datos...';
                document.getElementById('lbTVisitadosMapa').innerText = '';
                document.getElementById('lbTNoVisitadosMapa').innerText = '';
            });
    });
};

function data_visitas_vendedor(codven,fecha,dia){

     let sucursal = document.getElementById('cmbSucursal').value;
   

    return new Promise((resolve, reject) => {
        

            axios.post('/clientes/buscar_cliente_vendedor_supervisor', {
                token:TOKEN,
                sucursal: sucursal,
                dia:dia,
                codven:codven,
                fecha:fecha
            })
             .then(res => {
                
                if(res.status.toString()=='200'){
                    let data = res.data;

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
            })
            .catch(()=>{
                reject();
            })
   

    })

};

function data_visitas_no_efectivas(codven, fecha) {
    const sucursal = document.getElementById('cmbSucursal').value;

    return new Promise((resolve, reject) => {
        axios.post('/clientes/visitas_no_efectivas_mapa', {
            token: TOKEN,
            sucursal: sucursal,
            codemp: codven,
            fecha: fecha
        })
        .then((res) => {
            if (res.status.toString() == '200') {
                const data = res.data;
                if (data.toString() == 'error') {
                    reject();
                } else if (Number(data.rowsAffected[0]) > 0) {
                    resolve(data);
                } else {
                    reject();
                }
            } else {
                reject();
            }
        })
        .catch(() => reject());
    });
}

function get_datos_cliente(codclie,nomclie){

    visitasMapa_showDetalle();
    get_marcas_cliente(codclie, nomclie);
    get_productos_clientes(codclie);

};
function get_marcas_cliente(codclie, nomclie){

    
    
    document.getElementById('lbNomclieMarca').innerText = nomclie;
    document.getElementById('lbCodclieMarca').innerText = codclie;
    

    let container = document.getElementById('tbl_data_marcas_cliente');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;

    let fecha = F.devuelveFecha('txtFecha');

    let sucursal = document.getElementById('cmbSucursal').value;
   

    GF.get_data_marcas_cliente(sucursal,codclie,fecha)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
            let strClass = '';
            if(Number(r.TOTALPRECIO)==0){strClass='bg-nologrado'}else{strClass='bg-logrado'};
            varTotal += Number(r.TOTALPRECIO);
            str += `
                <tr class="${strClass}">
                    <td>${r.DESMARCA}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalClienteMarca').innerText = F.setMoneda(varTotal,'Q');

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
        document.getElementById('lbTotalClienteMarca').innerText = 'Q 0.00';
    })

    



};

function get_productos_clientes(codclie){

    

    let container = document.getElementById('tbl_data_productos_cliente');
    container.innerHTML = GlobalLoader;

    let varTotal = 0;

    let fecha = F.devuelveFecha('txtFecha');

    let sucursal = document.getElementById('cmbSucursal').value;

    GF.get_data_productos_cliente(sucursal,codclie,fecha)
    .then((data)=>{

        let str = '';
        data.recordset.map((r)=>{
         
            varTotal += Number(r.TOTALPRECIO);
            str += `
                <tr>
                    <td>${r.DESPROD}</td>
                    <td>${r.TOTALUNIDADES}</td>
                    <td>${F.setMoneda(r.TOTALPRECIO,'Q')}</td>
                </tr>
            `
        })
        container.innerHTML = str;
        document.getElementById('lbTotalClienteProductos').innerText = F.setMoneda(varTotal,'Q');

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
        document.getElementById('lbTotalClienteProductos').innerText = 'Q 0.00';
    })

    

};