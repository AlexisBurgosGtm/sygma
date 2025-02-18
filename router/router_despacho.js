const execute = require('./../connection');
const express = require('express');
const router = express.Router();



router.post("/pedidos_pendientes_vendedores", async(req,res)=>{
   
    const { token, sucursal } = req.body;

    let qry = `
        SELECT DOCUMENTOS_TEMPORALES.FECHA, 
                DOCUMENTOS_TEMPORALES.HORA, 
                DOCUMENTOS_TEMPORALES.CODDOC, 
                DOCUMENTOS_TEMPORALES.CORRELATIVO, 
                DOCUMENTOS_TEMPORALES.DOC_NIT AS NIT, 
                DOCUMENTOS_TEMPORALES.DOC_NOMCLIE AS NOMCLIE, 
                DOCUMENTOS_TEMPORALES.DOC_DIRCLIE AS DIRCLIE, 
                DOCUMENTOS_TEMPORALES.TOTALPRECIO AS IMPORTE, 
                DOCUMENTOS_TEMPORALES.STATUS, 
                DOCUMENTOS_TEMPORALES.DIRENTREGA, 
                DOCUMENTOS_TEMPORALES.LAT, 
                DOCUMENTOS_TEMPORALES.LONG, 
                EMPLEADOS.NOMEMPLEADO,
                ISNULL(DOCUMENTOS_TEMPORALES.CODEMBARQUE,'') AS CODEMBARQUE
        FROM DOCUMENTOS_TEMPORALES LEFT OUTER JOIN
                EMPLEADOS ON DOCUMENTOS_TEMPORALES.EMPNIT = EMPLEADOS.EMPNIT 
                AND DOCUMENTOS_TEMPORALES.CODEMP = EMPLEADOS.CODEMPLEADO 
                LEFT OUTER JOIN
                TIPODOCUMENTOS ON DOCUMENTOS_TEMPORALES.CODDOC = TIPODOCUMENTOS.CODDOC 
                AND DOCUMENTOS_TEMPORALES.EMPNIT = TIPODOCUMENTOS.EMPNIT
        WHERE  (DOCUMENTOS_TEMPORALES.EMPNIT = '${sucursal}') 
                AND (DOCUMENTOS_TEMPORALES.NOCORTE = 0) 
                AND (TIPODOCUMENTOS.TIPODOC = 'ENV')
            `;
    

    execute.QueryToken(res,qry,token);
     
});





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


