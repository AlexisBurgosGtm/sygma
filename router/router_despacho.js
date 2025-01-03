const execute = require('./../connection');
const express = require('express');
const router = express.Router();


router.post("/pedidos_pendientes", async(req,res)=>{
   
    const { token, sucursal } = req.body;

    let qry = `SELECT DOCUMENTOS.FECHA, 
                DOCUMENTOS.HORA, 
                DOCUMENTOS.MINUTO, 
                DOCUMENTOS.CODDOC, 
                DOCUMENTOS.CORRELATIVO, 
                DOCUMENTOS.DOC_NIT AS NIT, 
                DOCUMENTOS.DOC_NOMCLIE AS NOMCLIE, 
                DOCUMENTOS.DOC_DIRCLIE AS DIRCLIE, 
                DOCUMENTOS.TOTALPRECIO AS TOTALVENTA, 
                DOCUMENTOS.STATUS, 
                DOCUMENTOS.DIRENTREGA, 
                DOCUMENTOS.LAT, DOCUMENTOS.LONG
            FROM DOCUMENTOS LEFT OUTER JOIN
                TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
            WHERE (DOCUMENTOS.EMPNIT = '${sucursal}') 
            AND (DOCUMENTOS.CORTE = 'NO') 
            AND (TIPODOCUMENTOS.TIPODOC = 'ENV')`;
    

    execute.QueryToken(res,qry,token);
     
});


router.post("/detalle_pedido", async(req,res)=>{
   
    const { token, sucursal, coddoc, correlativo } = req.body;

    let qry = `
        SELECT CODPROD, DESPROD, CODMEDIDA, 
                CANTIDAD, EQUIVALE, TOTALUNIDADES, COSTO, PRECIO,
                TOTALCOSTO, TOTALPRECIO,ENTREGADOS_TOTALUNIDADES
        FROM DOCPRODUCTOS
        WHERE EMPNIT='${sucursal}'
            AND CODDOC='${coddoc}'
            AND CORRELATIVO=${correlativo}
                `;
    

    
    execute.QueryToken(res,qry,token);
     
});





module.exports = router;


