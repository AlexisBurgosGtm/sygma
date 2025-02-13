
//data_empresa_config.TIPO_PRECIO


let tipo_precios =[
                {tipo:"PRECIO",nombre:"PUBLICO"},
                {tipo:"PRECIO_A",nombre:"PRECIO A"},
                {tipo:"PRECIO_B",nombre:"PRECIO B"},
                {tipo:"PRECIO_C",nombre:"PRECIO C"},
                {tipo:"PRECIO_D",nombre:"PRECIO D"},
                {tipo:"PRECIO_E",nombre:"PRECIO E"},
                {tipo:"PRECIO_F",nombre:"PRECIO F"}
            ];





let tipo_negocios = [
    { tipo: 'OTROS', descripcion: 'OTROS'},
    { tipo: 'TIENDA', descripcion: 'TIENDA'},
    { tipo: 'ABARROTERIA', descripcion: 'ABARROTERIA'},
    { tipo: 'DEPOSITO', descripcion: 'DEPOSITO'},
    { tipo: 'RESTAURANTE', descripcion: 'RESTAURANTE'},
    { tipo: 'ESCUELA', descripcion: 'ESCUELA'},
    { tipo: 'HOTEL', descripcion: 'HOTEL'},
    { tipo: 'FARMACIA', descripcion: 'FARMACIA'},
    { tipo: 'CERERIA', descripcion: 'CERERIA'},
    { tipo: 'CLINICA', descripcion: 'CLINICA'},
    { tipo: 'COMERCIAL', descripcion: 'COMERCIAL'},
    { tipo: 'CORPORACION', descripcion: 'CORPORACION'},
    { tipo: 'BOUTIQUE', descripcion: 'BOUTIQUE'},
    { tipo: 'DISTRIBUIDORA', descripcion: 'DISTRIBUIDORA'},
    { tipo: 'GASOLINERA', descripcion: 'GASOLINERA'},
    { tipo: 'MINIDESPENSA', descripcion: 'MINI DESPENSA'},
    { tipo: 'LIBRERIA', descripcion: 'LIBRERIA'},
    { tipo: 'MISCELANEA', descripcion: 'MISCELANEA'},
    { tipo: 'MUNDODE3', descripcion: 'MUNDO DE 3'},
    { tipo: 'TORTILLERIA', descripcion: 'TORTILLERIA'},
    { tipo: 'VARIEDADES', descripcion: 'VARIEDADES'}
]

function get_tipo_precios(){

    let str = '' //"<option value=''>Seleccione una sucursal</option>";
    tipo_precios.map((r)=>{
        str += `<option value='${r.tipo}'>${r.nombre}</option>`
    });
    return str;
}





