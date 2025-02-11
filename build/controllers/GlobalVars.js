let versionapp = "M.11.02.2025:0"


let map; //mapa de leaflet


let GlobalUrlCalls = '';
let GlobalUrlServicioLocal = 'http://192.168.1.16:8080'
let GlobalUrlPrinter = 'http://192.168.0.250:9000'
let TOKEN = 'FSYA';
let GlobalEmpnitBodega = 'FSYA000';
let GlobalEmpnit ='';

let GlobalUsuario = '';
let GlobalPass = '';
let GlobalNivelUsuario = 0;
let GlobalCodUsuario = 0;

let GlobalBolEditando = false;
let GlobalSignoMoneda = 'Q'

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


let GlobalLoader = `<b class="negrita text-base">Cargando... </b> ${special_loader_puntos}`;


let GlobalLoaderX = `
                <div>
                    <div  class="spinner-border" role="status">
                        <img src="./favicon.png" width="40" height="40">
                    </div>
                    <div  class="spinner-border" role="status">
                        <img src="./favicon.png" width="40" height="40">
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
let GlobalSelectedNoOrden = 0;
let GlobalSelectedCodEquipo = 0;
let GlobalConfigIVA = 1.12;

let GlobalCodBodega  = 0;


let GlobalTotalDocumento = 0;
let GlobalTotalCostoDocumento = 0;
let GlobalTotalDescuento = 0;
let GlobalTotalItems = 0;

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

