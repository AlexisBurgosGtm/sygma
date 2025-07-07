
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

let tipo_empleados = [
    {codigo:1,descripcion:"GERENCIA"},
    {codigo:2,descripcion:"SUPERVISION"},
    {codigo:3,descripcion:"VENDEDOR RUTERO"},
    {codigo:4,descripcion:"REPARTIDOR"},
    {codigo:5,descripcion:"DIGITADOR"},
    {codigo:6,descripcion:"BODEGA"},
    {codigo:7,descripcion:"PROVEEDOR"},
    {codigo:8,descripcion:"VENDEDOR COMODIN"}
]




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




let tipo_documentos = [
    {TIPO:"COM",DESCRIPCION:"	COMPRAS IVA NORMAL	",INV:1},
    {TIPO:"COP",DESCRIPCION:"	COMPRAS PEQUEÑO CONTRIBUYENTE	",INV:1},
    {TIPO:"COR",DESCRIPCION:"	CORTE DE CAJA	",INV:0},
    {TIPO:"COT",DESCRIPCION:"	COTIZACIONES HACIA CLIENTES	",INV:0},
    {TIPO:"DEV",DESCRIPCION:"	NOTA DE CREDITO  A CLIENTES (NO FISCAL)	",INV:1},
    {TIPO:"DPE",DESCRIPCION:"	DEPOSITOS ENTRADA BANCO	",INV:0},
    {TIPO:"DPS",DESCRIPCION:"	DEPOSITOS SALIDA BANCO	",INV:0},
    {TIPO:"DVP",DESCRIPCION:"	NOTA DE CREDITO A PROVEEDORES	",INV:-1},
    {TIPO:"ENT",DESCRIPCION:"	ENTRADAS DE INVENTARIO	",INV:1},
    {TIPO:"ENV",DESCRIPCION:"	ENVIOS / PEDIDOS	",INV:0},
    {TIPO:"FAC",DESCRIPCION:"	FACTURA NORMAL (NO FISCAL)	",INV:-1},
    {TIPO:"FCP",DESCRIPCION:"	FACTURA FEL CAMBIARIA PEQUEÑO CONTRIBUYENTE	",INV:-1},
    {TIPO:"FEC",DESCRIPCION:"	FACTURA FEL CAMBIARIA IVA	",INV:-1},
    {TIPO:"FEF",DESCRIPCION:"	FACTURA FEL NORMAL IVA	",INV:-1},
    {TIPO:"FES",DESCRIPCION:"	FACTURA FEL ESPECIAL IVA	",INV:-1},
    {TIPO:"FNC",DESCRIPCION:"	NOTA DE CREDITO FEL IVA	",INV:1},
    {TIPO:"FPC",DESCRIPCION:"	FACTURA FEL PEQUEÑO CONTRIBUYENTE	",INV:-1},
    {TIPO:"GAS",DESCRIPCION:"	GASTOS	",INV:0},
    {TIPO:"INF",DESCRIPCION:"	INVENTARIO FISICO	",INV:1},
    {TIPO:"OCM",DESCRIPCION:"	ORDEN DE COMPRA	",INV:0},
    {TIPO:"ORP",DESCRIPCION:"	ORDEN DE PRODUCCION	",INV:1},
    {TIPO:"ORT",DESCRIPCION:"	ORDEN DE TRABAJO	",INV:0},
    {TIPO:"RCC",DESCRIPCION:"	RECIBO DE PAGO DE CLIENTES	",INV:0},
    {TIPO:"RCP",DESCRIPCION:"	RECIBO PAGO PROVEEDORES	",INV:0},
    {TIPO:"REQ",DESCRIPCION:"	REQUISICIONES A PROVEEDORES	",INV:0},
    {TIPO:"RTI",DESCRIPCION:"	RETENCIONES ISR	",INV:0},
    {TIPO:"RTV",DESCRIPCION:"	RETENCIONES IVA	",INV:0},
    {TIPO:"SAL",DESCRIPCION:"	SALIDAS DE INVENTARIO	",INV:-1},
    {TIPO:"TES",DESCRIPCION:"	TRASLADOS ENTRADA SUCURSAL	",INV:1},
    {TIPO:"TIN",DESCRIPCION:"	TRASLADOS ENTRADA BODEGA	",INV:1},
    {TIPO:"TSL",DESCRIPCION:"	TRASLADOS SALIDA BODEGA	",INV:-1},
    {TIPO:"TSS",DESCRIPCION:"	TRASLADOS SALIDA SUCURSAL	",INV:-1}
]



function get_tipo_movinv_documento(tipodoc){
    
        let movinv = 0;

        tipo_documentos.map((r)=>{
            if(r.TIPO==tipodoc){
                movinv = Number(r.INV)
            }
        })

        return movinv;

};