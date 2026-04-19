let PRINT = {
    documento: function (tipo,sucursal,coddoc,correlativo) {
        
        let url = '';

        switch (tipo) {
            case 'FAC':

                url = `${window.location.origin.toString()}/print_factura?sucursal=${sucursal}&coddoc=${coddoc}&correlativo=${correlativo}`;
                window.open( url, '_blank');
                
                break;
        
            default:
                F.AvisoError('Documento no definido para impresión');
                break;
        }


       

    },
    factura_normal: function (sucursal,coddoc,correlativo) {
        
        let url = `${window.location.origin.toString()}/print_factura?sucursal=${sucursal}&coddoc=${coddoc}&correlativo=${correlativo}`;
   
        window.open( url, '_blank');

    },
}