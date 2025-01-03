const execute = require('./../connection');
const express = require('express');
const router = express.Router();




router.post("/data_empresa_config", async(req,res)=>{

    const {token,sucursal} = req.body;

    let qry = `
        SELECT EMPNIT, NOMBRE, DIRECCION, TIPO_PRECIO,
            CODTIPOEMPRESA, DISTRITO, OBJETIVO_VENTAS, OBJETIVO_RENTABILIDAD,
            CERTIFICACION_USUARIO, CERTIFICACION_LLAVE, FIRMA_ALIAS,
            FIRMA_LLAVE, EMISOR_CODIGOESTABLECIMIENTO, EMISOR_CODIGOPOSTAL,
            EMISOR_DEPARTAMENTO, EMISOR_DIRECCION, EMISOR_MUNICIPIO,
            EMISOR_NOMBRE, EMISOR_NOMBRECOMECIAL, EMISOR_NIT,
            EMISOR_FRASE, EMISOR_ESCENARIO, EMISOR_FRASE2,
            EMISOR_ESCENARIO2, NIT_RESOLUCION, NIT_FECHA_RESOLUCION,
            ADENDA_VENDEDOR, ADENDA_TELSUCURSAL, ADENDA_SUPERVISOR, 
            EMP_LAT, EMP_LONG
        FROM EMPRESAS
        WHERE EMPNIT='${sucursal}';
        `     
  
    execute.QueryToken(res,qry,token)

});



router.post("/sucursales_precio", async(req,res)=>{

    const {token,precio} = req.body;

    let qry = `
        SELECT EMPNIT,NOMBRE, ISNULL(DISTRITO,0) AS DISTRITO 
        FROM EMPRESAS 
        WHERE TIPO_PRECIO='${precio}'
        `     
  
    execute.QueryToken(res,qry,token)

});


router.post("/sucursales_existencia_producto", async(req,res)=>{

    const {token,codprod} = req.body;

    let qry = `
       SELECT INVSALDO.EMPNIT, EMPRESAS.NOMBRE AS NOMEMPRESA, INVSALDO.CODPROD, 
			INVSALDO.MINIMO, INVSALDO.MAXIMO, INVSALDO.EXISTENCIA, (INVSALDO.MAXIMO - INVSALDO.EXISTENCIA) AS RELLENO 
        FROM     INVSALDO LEFT OUTER JOIN
                  EMPRESAS ON INVSALDO.EMPNIT = EMPRESAS.EMPNIT
        WHERE  (INVSALDO.CODPROD = '${codprod}')
        ORDER BY INVSALDO.EMPNIT
        `     
  
    execute.QueryToken(res,qry,token)

});



module.exports = router;

