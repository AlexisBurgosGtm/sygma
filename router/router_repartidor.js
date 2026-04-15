const execute = require('../connection');
const express = require('express');
const router = express.Router();


// EMBARQUES DEL REPARTIDOR
router.post("/embarques_repartidor", async(req,res)=>{
    
    const { sucursal, codrep,token} = req.body;
            
    let qry ='';

    qry = `SELECT CODEMBARQUE, RUTEO AS RUTA, FECHA, FINALIZADO 
            FROM EMBARQUES 
            WHERE EMPNIT='${sucursal}' 
            AND CODEMPLEADO=${codrep}
            AND FINALIZADO='NO'
            `;     
  

    execute.QueryToken(res,qry,token);

});
router.post("/empleados_embarque", async(req,res)=>{
    
    const { sucursal, codembarque,token} = req.body;
            
    let qry ='';

    qry = `SELECT DOCUMENTOS.CODEMP AS CODEMPLEADO, EMPLEADOS.NOMEMPLEADO
FROM     DOCUMENTOS LEFT OUTER JOIN
                  EMPLEADOS ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO AND DOCUMENTOS.EMPNIT = EMPLEADOS.EMPNIT
WHERE  (DOCUMENTOS.CODEMBARQUE = '${codembarque}') AND (DOCUMENTOS.EMPNIT = '${sucursal}')
GROUP BY DOCUMENTOS.CODEMP, EMPLEADOS.NOMEMPLEADO
ORDER BY EMPLEADOS.NOMEMPLEADO
            `;     
  

    execute.QueryToken(res,qry,token);

});

// PEDIDOS EN EMBARQUE
router.post("/embarque_documentos", async(req,res)=>{
    
    const { sucursal, codembarque,codemp,token} = req.body;
            
    let qry ='';

    if(codemp=='TODOS'){
        qry = `
       SELECT 
            DOCUMENTOS.FECHA, 
            DOCUMENTOS.CODDOC, 
            DOCUMENTOS.CORRELATIVO, 
            DOCUMENTOS.CODCLIENTE, 
            DOCUMENTOS.DOC_NIT AS NIT, 
            CLIENTES.NOMBRE AS CLIENTE, 
            CLIENTES.TIPONEGOCIO, 
            CLIENTES.NEGOCIO, 
            DOCUMENTOS.DOC_DIRCLIE AS DIRECCION, 
            CLIENTES.REFERENCIA, 
            MUNICIPIOS.DESMUN AS MUNICIPIO, 
            CLIENTES.LATITUD AS LAT, 
            CLIENTES.LONGITUD AS LONG, 
            DOCUMENTOS.TOTALPRECIO AS IMPORTE, 
            DOCUMENTOS.DIRENTREGA,
            DOCUMENTOS.OBS, 
            DOCUMENTOS.CODEMP AS CODVEN, 
            EMPLEADOS.NOMEMPLEADO AS VENDEDOR, 
            DOCUMENTOS.STATUS AS ST, 
            ISNULL(view_rpt_devoluciones_embarque.DEVUELTO,0) AS DEVUELTO
        FROM     TIPODOCUMENTOS RIGHT OUTER JOIN
                  DOCUMENTOS LEFT OUTER JOIN
                  view_rpt_devoluciones_embarque ON DOCUMENTOS.EMPNIT = view_rpt_devoluciones_embarque.EMPNIT AND DOCUMENTOS.CORRELATIVO = view_rpt_devoluciones_embarque.CORRELATIVO_ORIGEN AND 
                  DOCUMENTOS.CODDOC = view_rpt_devoluciones_embarque.CODDOC_ORIGEN AND DOCUMENTOS.CODEMBARQUE = view_rpt_devoluciones_embarque.CODEMBARQUE ON 
                  TIPODOCUMENTOS.CODDOC = DOCUMENTOS.CODDOC AND TIPODOCUMENTOS.EMPNIT = DOCUMENTOS.EMPNIT LEFT OUTER JOIN
                  EMPLEADOS ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
                  MUNICIPIOS RIGHT OUTER JOIN
                  CLIENTES ON MUNICIPIOS.CODMUN = CLIENTES.CODMUN ON DOCUMENTOS.CODCLIENTE = CLIENTES.CODCLIENTE
        WHERE  (DOCUMENTOS.CODEMBARQUE = '${codembarque}') AND 
                (DOCUMENTOS.EMPNIT = '${sucursal}') AND 
                (TIPODOCUMENTOS.TIPODOC IN ('FAC', 'FCP', 'FEC', 'FEF', 'FES')) AND 
                (DOCUMENTOS.STATUS <> 'A')
        ORDER BY VENDEDOR
        `;    
    }else{
        qry = `
       SELECT 
            DOCUMENTOS.FECHA, 
            DOCUMENTOS.CODDOC, 
            DOCUMENTOS.CORRELATIVO, 
            DOCUMENTOS.CODCLIENTE, 
            DOCUMENTOS.DOC_NIT AS NIT, 
            CLIENTES.NOMBRE AS CLIENTE, 
            CLIENTES.TIPONEGOCIO, 
            CLIENTES.NEGOCIO, 
            DOCUMENTOS.DOC_DIRCLIE AS DIRECCION, 
            CLIENTES.REFERENCIA, 
            MUNICIPIOS.DESMUN AS MUNICIPIO, 
            CLIENTES.LATITUD AS LAT, 
            CLIENTES.LONGITUD AS LONG, 
            DOCUMENTOS.TOTALPRECIO AS IMPORTE, 
            DOCUMENTOS.DIRENTREGA,
            DOCUMENTOS.OBS, 
            DOCUMENTOS.CODEMP AS CODVEN, 
            EMPLEADOS.NOMEMPLEADO AS VENDEDOR, 
            DOCUMENTOS.STATUS AS ST, 
            ISNULL(view_rpt_devoluciones_embarque.DEVUELTO,0) AS DEVUELTO
        FROM     TIPODOCUMENTOS RIGHT OUTER JOIN
                  DOCUMENTOS LEFT OUTER JOIN
                  view_rpt_devoluciones_embarque ON DOCUMENTOS.EMPNIT = view_rpt_devoluciones_embarque.EMPNIT AND DOCUMENTOS.CORRELATIVO = view_rpt_devoluciones_embarque.CORRELATIVO_ORIGEN AND 
                  DOCUMENTOS.CODDOC = view_rpt_devoluciones_embarque.CODDOC_ORIGEN AND DOCUMENTOS.CODEMBARQUE = view_rpt_devoluciones_embarque.CODEMBARQUE ON 
                  TIPODOCUMENTOS.CODDOC = DOCUMENTOS.CODDOC AND TIPODOCUMENTOS.EMPNIT = DOCUMENTOS.EMPNIT LEFT OUTER JOIN
                  EMPLEADOS ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
                  MUNICIPIOS RIGHT OUTER JOIN
                  CLIENTES ON MUNICIPIOS.CODMUN = CLIENTES.CODMUN ON DOCUMENTOS.CODCLIENTE = CLIENTES.CODCLIENTE
        WHERE  (DOCUMENTOS.CODEMBARQUE = '${codembarque}') AND 
                (DOCUMENTOS.EMPNIT = '${sucursal}') AND 
                (TIPODOCUMENTOS.TIPODOC IN ('FAC', 'FCP', 'FEC', 'FEF', 'FES')) AND 
                (DOCUMENTOS.STATUS <> 'A') AND
                (DOCUMENTOS.CODEMP=${codemp})
        ORDER BY VENDEDOR
        `;    

    }
     
  
    execute.QueryToken(res,qry,token);
    
});
router.post("/embarque_documentos_devoluciones", async(req,res)=>{
    
    const { sucursal, codembarque,token} = req.body;
            
    let qry ='';

    qry = `
            SELECT DOCUMENTOS.FECHA, DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO, DOCUMENTOS.CODCLIENTE, DOCUMENTOS.DOC_NIT AS NIT, CLIENTES.NOMBRE AS CLIENTE, CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO, 
                  DOCUMENTOS.DOC_DIRCLIE AS DIRECCION, CLIENTES.REFERENCIA, MUNICIPIOS.DESMUN AS MUNICIPIO, CLIENTES.LATITUD AS LAT, CLIENTES.LONGITUD AS LONG, DOCUMENTOS.TOTALPRECIO AS IMPORTE, 
                  DOCUMENTOS.DIRENTREGA, DOCUMENTOS.OBS, DOCUMENTOS.CODEMP AS CODVEN, EMPLEADOS.NOMEMPLEADO AS VENDEDOR, DOCUMENTOS.STATUS AS ST
            FROM     TIPODOCUMENTOS RIGHT OUTER JOIN
                  DOCUMENTOS ON TIPODOCUMENTOS.CODDOC = DOCUMENTOS.CODDOC AND TIPODOCUMENTOS.EMPNIT = DOCUMENTOS.EMPNIT LEFT OUTER JOIN
                  EMPLEADOS ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
                  MUNICIPIOS RIGHT OUTER JOIN
                  CLIENTES ON MUNICIPIOS.CODMUN = CLIENTES.CODMUN ON DOCUMENTOS.CODCLIENTE = CLIENTES.CODCLIENTE
            WHERE  (DOCUMENTOS.CODEMBARQUE = '${codembarque}') AND 
                (DOCUMENTOS.EMPNIT = '${sucursal}') AND 
                (TIPODOCUMENTOS.TIPODOC IN ('DEV','FNC')) AND 
                (DOCUMENTOS.STATUS <> 'A')
            ORDER BY VENDEDOR`;     
  
    execute.QueryToken(res,qry,token);
    
});
router.post("/embarque_documentos_devoluciones_resumen", async(req,res)=>{
    
    const { sucursal, codembarque,token} = req.body;
            
    let qry ='';

    qry = `
            SELECT DOCUMENTOS.CODEMP, 
                EMPLEADOS.NOMEMPLEADO AS EMPLEADO, 
                COUNT(DOCUMENTOS.CODDOC) AS CONTEO, 
                SUM(DOCUMENTOS.TOTALPRECIO) AS IMPORTE
            FROM TIPODOCUMENTOS RIGHT OUTER JOIN
                DOCUMENTOS ON TIPODOCUMENTOS.CODDOC = DOCUMENTOS.CODDOC AND TIPODOCUMENTOS.EMPNIT = DOCUMENTOS.EMPNIT LEFT OUTER JOIN
                EMPLEADOS ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO
            WHERE  (DOCUMENTOS.CODEMBARQUE = '${codembarque}') AND 
                (DOCUMENTOS.EMPNIT = '${sucursal}') AND 
                (TIPODOCUMENTOS.TIPODOC IN ('DEV', 'FNC')) AND 
                (DOCUMENTOS.STATUS <> 'A')
            GROUP BY DOCUMENTOS.CODEMP, EMPLEADOS.NOMEMPLEADO
            ORDER BY EMPLEADO
            `;     
  
    execute.QueryToken(res,qry,token);
    
});

router.post("/mapaembarque", async(req,res)=>{
    
    const { sucursal, embarque,token} = req.body;
            
    let qry ='';

     qry = `SELECT DOCUMENTOS.FECHA, DOCUMENTOS.CODDOC, 
            DOCUMENTOS.CORRELATIVO, DOCUMENTOS.DOC_NIT AS NIT, 
            CLIENTES.NOMBRE AS CLIENTE,
            CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO, 
            DOCUMENTOS.DOC_DIRCLIE AS DIRECCION,
            CLIENTES.REFERENCIA, 
                  MUNICIPIOS.DESMUN AS MUNICIPIO, 
                  CLIENTES.LATITUD AS LAT, CLIENTES.LONGITUD AS LONG, DOCUMENTOS.TOTALPRECIO AS IMPORTE, DOCUMENTOS.DIRENTREGA, DOCUMENTOS.OBS, DOCUMENTOS.CODEMP AS CODVEN, 
                  EMPLEADOS.NOMEMPLEADO AS VENDEDOR, DOCUMENTOS.STATUS AS ST
          FROM MUNICIPIOS RIGHT OUTER JOIN
                  CLIENTES ON MUNICIPIOS.CODMUN = CLIENTES.CODMUN RIGHT OUTER JOIN
                  DOCUMENTOS LEFT OUTER JOIN
                  EMPLEADOS ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO ON CLIENTES.CODCLIENTE = DOCUMENTOS.CODCLIENTE
            WHERE (DOCUMENTOS.CODEMBARQUE = '${codembarque}') AND (DOCUMENTOS.EMPNIT = '${sucursal}')`;  
  
    execute.QueryToken(res,qry,token);
    

});
router.post("/BACKUP_mapaembarque", async(req,res)=>{
    
    const { sucursal, embarque,token} = req.body;
            
    let qry ='';

     qry = `SELECT DOCUMENTOS.FECHA, DOCUMENTOS.CODDOC, 
            DOCUMENTOS.CORRELATIVO, DOCUMENTOS.DOC_NIT AS NIT, 
            CLIENTES.NOMBRE AS CLIENTE,
            CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO, 
            DOCUMENTOS.DOC_DIRCLIE AS DIRECCION,
            CLIENTES.REFERENCIA, 
                  MUNICIPIOS.DESMUN AS MUNICIPIO, 
                  CLIENTES.LATITUD AS LAT, CLIENTES.LONGITUD AS LONG, DOCUMENTOS.TOTALPRECIO AS IMPORTE, DOCUMENTOS.DIRENTREGA, DOCUMENTOS.OBS, DOCUMENTOS.CODEMP AS CODVEN, 
                  EMPLEADOS.NOMEMPLEADO AS VENDEDOR, DOCUMENTOS.STATUS AS ST
          FROM MUNICIPIOS RIGHT OUTER JOIN
                  CLIENTES ON MUNICIPIOS.CODMUN = CLIENTES.CODMUN RIGHT OUTER JOIN
                  DOCUMENTOS LEFT OUTER JOIN
                  EMPLEADOS ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO ON CLIENTES.CODCLIENTE = DOCUMENTOS.CODCLIENTE
            WHERE (DOCUMENTOS.CODEMBARQUE = '${codembarque}') AND (DOCUMENTOS.EMPNIT = '${sucursal}')`;  
  
    execute.QueryToken(res,qry,token);
    

});
router.post("/BACKUP_embarque_documentos", async(req,res)=>{
    
    const { sucursal, codembarque,codemp,token} = req.body;
            
    let qry ='';

    qry = `
       SELECT 
            DOCUMENTOS.FECHA, 
            DOCUMENTOS.CODDOC, 
            DOCUMENTOS.CORRELATIVO, 
            DOCUMENTOS.CODCLIENTE, 
            DOCUMENTOS.DOC_NIT AS NIT, 
            CLIENTES.NOMBRE AS CLIENTE, 
            CLIENTES.TIPONEGOCIO, 
            CLIENTES.NEGOCIO, 
            DOCUMENTOS.DOC_DIRCLIE AS DIRECCION, 
            CLIENTES.REFERENCIA, 
            MUNICIPIOS.DESMUN AS MUNICIPIO, 
            CLIENTES.LATITUD AS LAT, 
            CLIENTES.LONGITUD AS LONG, 
            DOCUMENTOS.TOTALPRECIO AS IMPORTE, 
            DOCUMENTOS.DIRENTREGA,
            DOCUMENTOS.OBS, 
            DOCUMENTOS.CODEMP AS CODVEN, 
            EMPLEADOS.NOMEMPLEADO AS VENDEDOR, 
            DOCUMENTOS.STATUS AS ST, 
            ISNULL(view_rpt_devoluciones_embarque.DEVUELTO,0) AS DEVUELTO
        FROM     TIPODOCUMENTOS RIGHT OUTER JOIN
                  DOCUMENTOS LEFT OUTER JOIN
                  view_rpt_devoluciones_embarque ON DOCUMENTOS.EMPNIT = view_rpt_devoluciones_embarque.EMPNIT AND DOCUMENTOS.CORRELATIVO = view_rpt_devoluciones_embarque.CORRELATIVO_ORIGEN AND 
                  DOCUMENTOS.CODDOC = view_rpt_devoluciones_embarque.CODDOC_ORIGEN AND DOCUMENTOS.CODEMBARQUE = view_rpt_devoluciones_embarque.CODEMBARQUE ON 
                  TIPODOCUMENTOS.CODDOC = DOCUMENTOS.CODDOC AND TIPODOCUMENTOS.EMPNIT = DOCUMENTOS.EMPNIT LEFT OUTER JOIN
                  EMPLEADOS ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
                  MUNICIPIOS RIGHT OUTER JOIN
                  CLIENTES ON MUNICIPIOS.CODMUN = CLIENTES.CODMUN ON DOCUMENTOS.CODCLIENTE = CLIENTES.CODCLIENTE
        WHERE  (DOCUMENTOS.CODEMBARQUE = '${codembarque}') AND 
                (DOCUMENTOS.EMPNIT = '${sucursal}') AND 
                (TIPODOCUMENTOS.TIPODOC IN ('FAC', 'FCP', 'FEC', 'FEF', 'FES')) AND 
                (DOCUMENTOS.STATUS <> 'A')
        ORDER BY VENDEDOR
        `;     
  
    execute.QueryToken(res,qry,token);
    
});








// EMBARQUES DEL VENDEDOR
router.post("/embarquesvendedor", async(req,res)=>{
    
    const { sucursal, codvendedor} = req.body;
            
    let qry ='';

    qry = `SELECT ME_REPARTO_EMBARQUES.FECHA, ME_REPARTO_EMBARQUES.CODEMBARQUE AS CODIGO, ME_REPARTO_EMBARQUES.RUTA
                FROM ME_REPARTO_DOCUMENTOS LEFT OUTER JOIN
                     ME_REPARTO_EMBARQUES ON ME_REPARTO_DOCUMENTOS.CODEMBARQUE = ME_REPARTO_EMBARQUES.CODEMBARQUE AND 
                     ME_REPARTO_DOCUMENTOS.CODSUCURSAL = ME_REPARTO_EMBARQUES.CODSUCURSAL
                WHERE (ME_REPARTO_DOCUMENTOS.CODVEN = ${codvendedor}) AND (ME_REPARTO_DOCUMENTOS.CODSUCURSAL = '${sucursal}')
                GROUP BY ME_REPARTO_EMBARQUES.FECHA, ME_REPARTO_EMBARQUES.CODEMBARQUE, ME_REPARTO_EMBARQUES.RUTA`;     
  
    execute.Query(res,qry);

});

// PEDIDOS EN EMBARQUE DEL VENDEDOR
router.post("/facturasvendedor", async(req,res)=>{
    
    const { sucursal, codembarque, codven} = req.body;
            
    let qry ='';

    qry = `SELECT FECHA, CODDOC, CORRELATIVO, NIT, CLIENTE, DIRECCION, MUNICIPIO, ISNULL(LAT,0) AS LAT, ISNULL(LONG,0) AS LONG, IMPORTE, DIRENTREGA, OBS,CODVEN,VENDEDOR,ST
    FROM ME_REPARTO_DOCUMENTOS
    WHERE (CODEMBARQUE = '${codembarque}') AND (CODSUCURSAL = '${sucursal}') AND (CODVEN=${codven})`;     
  
    execute.Query(res,qry);

});



router.post("/detallepedido", async(req,res)=>{
    
    const { sucursal, coddoc,correlativo} = req.body;
            
    let qry ='';

    qry = `SELECT CODPROD,DESPROD,CODMEDIDA,CANTIDAD,EQUIVALE,TOTALUNIDADES,PRECIO,TOTALPRECIO AS IMPORTE FROM ME_REPARTO_DOCPRODUCTOS WHERE CODDOC='${coddoc}' AND CORRELATIVO=${correlativo} AND CODSUCURSAL='${sucursal}' `;     
  
    execute.Query(res,qry);

});


router.post("/marcarpedido", async(req,res)=>{
    
    const { sucursal, embarque, coddoc, correlativo, st} = req.body;
            
    let qry ='';

    qry = `UPDATE ME_REPARTO_DOCUMENTOS SET ST='${st}' 
            WHERE CODSUCURSAL='${sucursal}' AND CODEMBARQUE='${embarque}' AND CODDOC='${coddoc}' AND CORRELATIVO=${correlativo} `;     

    console.log(qry);


    execute.Query(res,qry);

});

module.exports = router;
