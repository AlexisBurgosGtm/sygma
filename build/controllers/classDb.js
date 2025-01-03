const DbName = "posdb_r6";

var tblDocumentos = {
    name: 'documentos',
    columns: {
        ID:{ primaryKey: true, autoIncrement: true },
        CODSUCURSAL:{dataType: "string"},
        EMPNIT:{dataType: "string"},
        CODDOC:{dataType: "string"},
        ANIO:{dataType: "number"},
        MES:{dataType: "number"},
        DIA:{dataType: "number"},
        FECHA:{dataType: "string"},
        FECHAENTREGA:{dataType: "string"},
        FORMAENTREGA:{dataType: "string"},
        NITCLIE:{dataType: "string"},
        CODCLIE:{dataType: "string"},
        NOMCLIE:{dataType: "string"},
        DIRCLIE:{dataType: "string"},
        TOTALCOSTO:{dataType: "number"},
        TOTALPRECIO:{dataType: "number"},
        DIRENTREGA:{dataType: "string"},
        OBS:{dataType: "string"},
        USUARIO:{dataType: "string"},
        CODVEN:{dataType: "number"},
        LAT:{dataType: "string"},
        LONG:{dataType: "string"},
        JSONPRODUCTOS:{dataType: "string"},
        tipo_pago:{dataType: "string"},
        tipo_doc:{dataType: "string"},
        entrega_contacto:{dataType: "string"},
        entrega_telefono:{dataType: "string"},
        entrega_direccion:{dataType: "string"},
        entrega_referencia:{dataType: "string"},
        entrega_lat:{dataType: "string"},
        entrega_long:{dataType: "string"},
        domicilio: {dataType: "string"}
    }
};



var tblTempventas = {
    name: 'tempventa',
    columns: {
        ID:{ primaryKey: true, autoIncrement: true },
        CODSUCURSAL:{dataType: "string"},
        EMPNIT:{dataType: "string"},
        CODDOC:{dataType: "string"},
        CODPROD:{dataType: "string"},
        DESPROD:{dataType: "string"},
        CODMEDIDA:{dataType: "string"},
        EQUIVALE:{dataType: "number"},
        CANTIDAD:{dataType: "number"},
        TOTALUNIDADES:{dataType: "number"},
        COSTO:{dataType: "number"},
        PRECIO:{dataType: "number"},
        TOTALCOSTO:{dataType: "number"},
        TOTALPRECIO:{dataType: "number"},       
        EXENTO:{dataType: "number"},
        USUARIO:{dataType: "string"},
        TIPOPRECIO:{dataType: "string"},
        EXISTENCIA:{dataType: "number"}
    }
};

var tblTempventasPos = {
    name: 'temp_pos',
    columns: {
        ID:{ primaryKey: true, autoIncrement: true },
        CODSUCURSAL:{dataType: "string"},
        EMPNIT:{dataType: "string"},
        CODDOC:{dataType: "string"},
        CODPROD:{dataType: "string"},
        DESPROD:{dataType: "string"},
        CODMEDIDA:{dataType: "string"},
        EQUIVALE:{dataType: "number"},
        CANTIDAD:{dataType: "number"},
        TOTALUNIDADES:{dataType: "number"},
        COSTO:{dataType: "number"},
        PRECIO:{dataType: "number"},
        DESCUENTO:{dataType: "number"},
        TOTALCOSTO:{dataType: "number"},
        TOTALPRECIO:{dataType: "number"},       
        EXENTO:{dataType: "number"},
        USUARIO:{dataType: "string"},
        TIPOPRECIO:{dataType: "string"},
        EXISTENCIA:{dataType: "number"},
        CODBODEGA:{dataType: "string"},
        NOLOTE:{dataType: "string"},
        TIPOPROD:{dataType: "string"},
        BONO:{dataType: "number"},
    }
};

var tblTempCompras = {
    name: 'temp_compras',
    columns: {
        ID:{ primaryKey: true, autoIncrement: true },
        CODSUCURSAL:{dataType: "string"},
        EMPNIT:{dataType: "string"},
        CODDOC:{dataType: "string"},
        CODPROD:{dataType: "string"},
        DESPROD:{dataType: "string"},
        CODMEDIDA:{dataType: "string"},
        EQUIVALE:{dataType: "number"},
        CANTIDAD:{dataType: "number"},
        TOTALUNIDADES:{dataType: "number"},
        COSTO:{dataType: "number"},
        PRECIO:{dataType: "number"},
        DESCUENTO:{dataType: "number"},
        TOTALCOSTO:{dataType: "number"},
        TOTALPRECIO:{dataType: "number"},       
        EXENTO:{dataType: "number"},
        USUARIO:{dataType: "string"},
        TIPOPRECIO:{dataType: "string"},
        EXISTENCIA:{dataType: "number"},
        CODBODEGA:{dataType: "string"},
        NOLOTE:{dataType: "string"},
        TIPOPROD:{dataType: "string"},
        BONO:{dataType: "number"},
    }
};

var tblTempventasMovinv = {
    name: 'temp_pos_movinv',
    columns: {
        ID:{ primaryKey: true, autoIncrement: true },
        CODSUCURSAL:{dataType: "string"},
        EMPNIT:{dataType: "string"},
        CODDOC:{dataType: "string"},
        CODPROD:{dataType: "string"},
        DESPROD:{dataType: "string"},
        CODMEDIDA:{dataType: "string"},
        EQUIVALE:{dataType: "number"},
        CANTIDAD:{dataType: "number"},
        TOTALUNIDADES:{dataType: "number"},
        COSTO:{dataType: "number"},
        PRECIO:{dataType: "number"},
        DESCUENTO:{dataType: "number"},
        TOTALCOSTO:{dataType: "number"},
        TOTALPRECIO:{dataType: "number"},       
        EXENTO:{dataType: "number"},
        USUARIO:{dataType: "string"},
        TIPOPRECIO:{dataType: "string"},
        EXISTENCIA:{dataType: "number"},
        CODBODEGA:{dataType: "string"},
        NOLOTE:{dataType: "string"},
        TIPOPROD:{dataType: "string"},
        BONO:{dataType: "number"},
    }
};

var tblTempventasMovinvBod = {
    name: 'temp_pos_movinv_bod',
    columns: {
        ID:{ primaryKey: true, autoIncrement: true },
        CODSUCURSAL:{dataType: "string"},
        EMPNIT:{dataType: "string"},
        CODDOC:{dataType: "string"},
        CODPROD:{dataType: "string"},
        DESPROD:{dataType: "string"},
        CODMEDIDA:{dataType: "string"},
        EQUIVALE:{dataType: "number"},
        CANTIDAD:{dataType: "number"},
        TOTALUNIDADES:{dataType: "number"},
        COSTO:{dataType: "number"},
        PRECIO:{dataType: "number"},
        DESCUENTO:{dataType: "number"},
        TOTALCOSTO:{dataType: "number"},
        TOTALPRECIO:{dataType: "number"},       
        EXENTO:{dataType: "number"},
        USUARIO:{dataType: "string"},
        TIPOPRECIO:{dataType: "string"},
        EXISTENCIA:{dataType: "number"},
        CODBODEGA:{dataType: "string"},
        NOLOTE:{dataType: "string"},
        TIPOPROD:{dataType: "string"},
        BONO:{dataType: "number"},
    }
};

var tblCredenciales = {
    name: 'credenciales',
    columns: {
        ID:{ primaryKey: true, autoIncrement: true },
        CODSUCURSAL:{dataType: "string"},
        USUARIO:{dataType: "string"},
        PASS:{dataType: "string"},
        NIVEL:{dataType: "string"},
        DAYUPDATED:{dataType: "number"}
    }
};



var database = {
    name: DbName,
    tables: [tblDocumentos,tblTempventas,tblTempventasPos,tblTempCompras,tblTempventasMovinv,tblTempventasMovinvBod,tblCredenciales]
};
 
// initiate jsstore connection
var connection = new JsStore.Connection();

async function connectDb(){
   
        var isDbCreated = await connection.initDb(database);
        // isDbCreated will be true when database will be initiated for first time
        if(isDbCreated){
            //alert('Db Created & connection is opened');
           
        }
        else{
            //alert('Connection is opened');
          
        }
    
}
//inicia la conexión a la db
connectDb();