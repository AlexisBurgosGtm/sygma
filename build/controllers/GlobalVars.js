let versionapp = "M.08.08.2025:0"
// &nbsp

let map; //mapa de leaflet


let GlobalUrlCalls = '';
let GlobalUrlServicioLocal = 'http://192.168.1.16:8080'
let GlobalUrlPrinter = 'http://192.168.0.250:9000'
let TOKEN = '';
let GlobalEmpnitBodega = '';


let GlobalEmpnit ='';
let GlobalNomEmpresa = '';


let GlobalUsuario = '';
let GlobalPass = '';
let GlobalNivelUsuario = 0;
let GlobalCodUsuario = 0;

let GlobalBolEditando = false;
let GlobalSignoMoneda = 'Q'

let data_config_general = [];
let data_empresa_config = [];
let data_usuario_config = [];

let tbl_etiquetas = [
    {valor:"BAJA",color:"bg-info"},
    {valor:"MEDIA",color:"bg-warning"},
    {valor:"ALTA",color:"bg-danger"},
]



let root = document.getElementById('root');
let rootErrores = document.getElementById('rootErrores');


let navmenu = document.getElementById('js-nav-menu');


//let GlobalLoader = special_loader_puntos_saltando; //`<b class="negrita text-base">Cargando... </b> ${special_loader_puntos}`;


let GlobalLoader = `
                <div>
                    <div  class="spinner-border" role="status">
                        <img src="./favicon.png" width="30" height="30">
                    </div>
                    <div  class="spinner-border" role="status">
                        <img src="./favicon.png" width="30" height="30">
                    </div>
                    <div class="spinner-border text-base" role="status"><span class="sr-only">Loading...</span></div>
                    <div class="spinner-border text-base" role="status"><span class="sr-only">Loading...</span></div>
                    <div class="spinner-border text-base" role="status"><span class="sr-only">Loading...</span></div>
                </div>
                `
               
function get_button_loader(texto){
    let str = '';

    str = `${texto}<div>
                <div class="spinner-grow text-base" role="status"><span class="sr-only">Loading...</span></div>
                <div class="spinner-grow text-base" role="status"><span class="sr-only">Loading...</span></div>
                <div class="spinner-grow text-base" role="status"><span class="sr-only">Loading...</span></div>
            </div>`


    return str;

}


// VARIABLES
let GlobalSelected_empnit = '';

let GlobalSelected_codmedida = '';
let GlobalSelected_Codprod = '';
let GlobalSelected_Desprod = '';
let GlobalSelected_Costo = 0;
let GlobalSelected_Status = '';

let Selected_exento =0; 
let Selected_tipoprod = '';
let Selected_existencia = 0;
let Selected_bono = 0;

let GlobalSelectedCodclie = 0;
let selected_cod_cliente = 0;
let GlobalSelectedNoOrden = 0;
let GlobalSelectedCodEquipo = 0;
let GlobalConfigIVA = 1.12;

let GlobalCodBodega  = 0;


let GlobalTotalDocumento = 0;
let GlobalTotalCostoDocumento = 0;
let GlobalTotalDescuento = 0;
let GlobalTotalItems = 0;

let Selected_coddoc_env = '';
let Selected_coddoc_cot = '';


let selected_ped_coddoc = '';
let selected_ped_correlativo = '';
let selected_ped_codembarque = '';

let selected_id_element = '';


let selected_universo_clientes_sucursal = 0;

let selected_tab = '';


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};



let global_var_total_costo = 0;
let global_var_total_precio = 0;
let global_var_dias_objetivo = 0;




function get_color_logro(porcentaje){

    let strClass = '';

    let f = new Date();
    let diastranscurridos = Number(f.getDate());
    let diasmes = global_var_dias_objetivo;

    let porcentaje_diario = (Number(porcentaje) / Number(diastranscurridos));
    
    console.log('diario:')
    console.log(porcentaje_diario);


    let proyeccion = (Number(diasmes)*Number(porcentaje_diario));

      
    console.log('proyeccion')
    console.log(proyeccion);



    if(Number(proyeccion)>=100){
        //console.log('verde');
        strClass = 'bg-logrado';
    }
    if(Number(proyeccion)>= 80 && Number(proyeccion) < 100){
        //console.log('amarillo');
        strClass='bg-falta';
    }
    if(Number(proyeccion)<90){
        //console.log('rojo');
        strClass = 'bg-nologrado';
    }
    

    return strClass;
    

}