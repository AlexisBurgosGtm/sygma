function getView(){
    let view = {
        body:()=>{
            return `
               <div class="row">                
                    ${view.menu_superior()}            
                </div>

                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active fixed" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            
                            <div class="row">
                                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                                    ${view.mapa()}    
                                </div>
                                <div class="col-sm-12 col-md-6 col-xl-6 col-lg-6">
                                    
                                    <div class="card border-base card-rounded shadow col-12">
                                        <div class="card-body p-2">
                                            ${view.datos()}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           
                            
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            
                        </div>    
                    </div>
                    <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active negrita text-success" id="tab-uno" data-toggle="tab" href="#uno" role="tab" aria-controls="profile" aria-selected="false">
                                <i class="fal fa-list"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-dos" data-toggle="tab" href="#dos" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>  
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-tres" data-toggle="tab" href="#tres" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>         
                    </ul>
                </div>
               
            `
        },
        menu_superior:()=>{
            return `
            <div class="card card-rounded col-12 border-base text-base">
                <div class="card-body">
                    <div class="row">
                        <div class="col-3">
                            <img src="./favicon.png" width="50" height="50">
                        </div>
                        <div class="col-9">
                            <h5 class="negrita">Datos del menú principal</h5>
                            <button class="btn btn-circle btn-danger hand shadow btn-xl" onclick="GF.modo_sat()">
                                <i class="fal fa-sync"></i>
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>
            `;
        },
        mapa:()=>{
            return `
            <div class="card shadow card-rounded" id="mapContenedor">
            </div>
                
            `;
        },
        datos:()=>{
            return `
            <div class="col-12" id="container_grafica">

            </div>
            `;
        }
    }

    root.innerHTML = view.body();

};



function addListeners(){

    
    document.title = "Inicio";

    Mousetrap.bind('ctrl+m', function() { document.getElementById('btnMenu').click() });

    //cmbEmpresa.removeEventListener('change', handle_empresa_change)
    //cmbEmpresa.addEventListener('change', handle_empresa_change)


    get_grafica();
   
    F.ObtenerUbicacion()
    .then((coords)=>{
        
        rpt_mapa_empresas('mapContenedor',coords.latitude.toString(),coords.longitude.toString());
    })
    
 
   
};

function initView(){

    getView();
    addListeners();

};



function get_grafica(){

    getDataEmpresaFechas()
    .then((data)=>{
        getLineChartFechasEmpresa(data)
    })
    .catch(()=>{
        //F.AvisoError('No se cargó los datos de la gráfica')
    })


}


function get_data_mapa(){
    return new Promise((resolve, reject)=>{
        
        let data = {
            sucursal:GlobalEmpnit,
            anio:2024,
            mes:8
        };

        axios.post(`/bi/rpt_mapa`, data)
        .then(res => {
            const datos = res.data.recordset;   
            resolve(datos);
        })
        .catch(()=>{
            reject();
        })

    })
};


function rpt_mapa_empresas(idContenedor,lt,lg){

    let container = document.getElementById(idContenedor);
    container.innerHTML = GlobalLoader;
    
    container.innerHTML = `<div class="mapcontainer" id="mapcontainer"></div>`;

    F.Lmap(lt, lg);
 

    get_data_mapa()
    .then((datos) => {

        const data = datos;
  
        data.map((r)=>{
          
                L.marker([r.LATITUD, r.LONGITUD])
                .addTo(map)
                .bindPopup(`${r.NOMBRE} <br><small>Vendido: ${F.setMoneda(r.TOTALPRECIO,'Q')}</small>`, {closeOnClick: false, autoClose: false})   
                .on('click', function(e){
                    console.log(e);
                    //getMenuCliente(rows.CODIGO,rows.NOMCLIE,rows.DIRCLIE,rows.TELEFONO,rows.LAT,rows.LONG,rows.NIT);
                })
                .openPopup();;
            
                
        })


        //RE-AJUSTA EL MAPA A LA PANTALLA
        setTimeout(function () {
            //console.log('timer mapa 1')
            try {
                map.invalidateSize();    
            } catch (error) {
                
            }
        }, 500);


    }, (error) => {
        F.AvisoError('Error en la solicitud');
        container.innerHTML = '';
    })
    .catch((error)=>{
        console.log('Error al cargar mapa..')
        console.log(error);
    })
       
};

function getDataEmpresaFechas(){
    return new Promise((resolve, reject)=>{
        
        let data = {
            sucursal:GlobalEmpnit,
            anio:2024,
            mes:8,
            tipo:'FAC'
        };

        axios.post(`/bi/empresa_ventas_fechas`, data)
        .then(res => {
            const datos = res.data.recordset;   
            resolve(datos);
        })
        .catch(()=>{
            reject();
        })

    })
};

function getLineChartFechasEmpresa(data){
   
    let container = document.getElementById('container_grafica');
    container.innerHTML = '';
    container.innerHTML = '<canvas id="myChart1" width="100" height="40"></canvas>';
  
    let label = []; let valor = []; let empresas = []; let bgColor = [];
    let total = 0;
    data.map((r)=>{
        total = total + Number(r.IMPORTE);
    });
   
    
    let NomEmpresa = '';
    data.map((r)=>{
            label.push(F.convertDateNormal(r.FECHA));
            empresas.push(r.NOMBRE);
            NomEmpresa = r.NOMBRE;
            valor.push(Number(r.IMPORTE.toFixed(2)));
            bgColor.push(getRandomColor())
    })
    

    
    /*
       labels: label,
            datasets: [
                {
                    label:"Ventas",
                    data:valor,
                    backgroundColor:bgColor
                },
                {
                    label:"Ventas2",
                    data:valor,
                    backgroundColor:bgColor
                }
            ]
    */


    var ctx = document.getElementById('myChart1').getContext('2d');
    var myChart = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: 'line',
        data: {
            labels: label,
            datasets: [
                {
                    label:NomEmpresa,
                    data:valor,
                    backgroundColor:bgColor
                }
            ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Ventas por Fecha. Total: ' + F.setMoneda(total,'Q'),
              font: {size: 30}
            },
            // Change options for ALL labels of THIS CHART
            datalabels: {
                anchor:'end',
                align:'end',
                listeners: {
                  click: function(context) {
                    // Receives `click` events only for labels of the first dataset.
                    // The clicked label index is available in `context.dataIndex`.
                    console.log(context);
                  }
                },
                formatter: function(value) {
                  return F.setMoneda(value,'Q');
                  // eq. return ['line1', 'line2', value]
                },
                color: function(context) {
                  return context.dataset.backgroundColor;
                },
                borderColor: 'white',
                borderRadius: 25,
                borderWidth: 0,
                font: {
                  weight: 'bold'
                }
            }
          }
        }
    });



};

