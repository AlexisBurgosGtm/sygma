const execute = require('./../connection');
const express = require('express');
const router = express.Router();











router.post("/rpt_ventas_fechas_compras", async(req,res)=>{

    const {token,sucursal,anio,mes} = req.body;

    let qry = `
        SELECT DOCUMENTOS.FECHA, 
                SUM(DOCUMENTOS.TOTALCOSTO) AS COSTO, 
                SUM(DOCUMENTOS.TOTALPRECIO) AS VENTA, 
                SUM(DOCUMENTOS.TOTALPRECIO) - SUM(DOCUMENTOS.TOTALCOSTO) AS UTILIDAD
        FROM  DOCUMENTOS LEFT OUTER JOIN TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
        WHERE 
            (DOCUMENTOS.EMPNIT = '${sucursal}') AND 
            (DOCUMENTOS.MES = ${mes}) AND 
            (DOCUMENTOS.ANIO = ${anio}) AND 
            (DOCUMENTOS.STATUS <> 'A') AND 
            (TIPODOCUMENTOS.TIPODOC IN('COM'))
        GROUP BY DOCUMENTOS.FECHA
        ORDER BY DOCUMENTOS.FECHA DESC
        `

     
  
    execute.QueryToken(res,qry,token)

});

router.post("/rpt_ventas_fechas", async(req,res)=>{

    const {token,sucursal,anio,mes} = req.body;

    let qry = `
        SELECT DOCUMENTOS.FECHA, 
                SUM(DOCUMENTOS.TOTALCOSTO) AS COSTO, 
                SUM(DOCUMENTOS.TOTALPRECIO) AS VENTA, 
                SUM(DOCUMENTOS.TOTALPRECIO) - SUM(DOCUMENTOS.TOTALCOSTO) AS UTILIDAD
        FROM  DOCUMENTOS LEFT OUTER JOIN TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
        WHERE 
            (DOCUMENTOS.EMPNIT = '${sucursal}') AND 
            (DOCUMENTOS.MES = ${mes}) AND 
            (DOCUMENTOS.ANIO = ${anio}) AND 
            (DOCUMENTOS.STATUS <> 'A') AND 
            (TIPODOCUMENTOS.TIPODOC IN('FAC','FPC','FCP','FEF','FEC','FES'))
        GROUP BY DOCUMENTOS.FECHA
        ORDER BY DOCUMENTOS.FECHA DESC
        `

     
  
    execute.QueryToken(res,qry,token)

});


router.post("/rpt_ventas_productos", async(req,res)=>{

    const {token,sucursal,anio,mes} = req.body;

    let qry = `
            SELECT DOCPRODUCTOS.CODPROD, 
                    DOCPRODUCTOS.DESPROD, 
                    SUM(DOCPRODUCTOS.TOTALUNIDADES) AS UNIDADES, 
                    SUM(DOCPRODUCTOS.TOTALCOSTO) AS COSTO, 
                    SUM(DOCPRODUCTOS.TOTALPRECIO) AS VENTA
            FROM  DOCUMENTOS LEFT OUTER JOIN
                  TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT LEFT OUTER JOIN
                  DOCPRODUCTOS ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO AND DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT
            WHERE 
                (DOCUMENTOS.ANIO = ${anio}) AND 
                (DOCUMENTOS.MES = ${mes}) AND 
                (DOCUMENTOS.EMPNIT = '${sucursal}') AND 
                (DOCUMENTOS.STATUS <> 'A') AND 
                (TIPODOCUMENTOS.TIPODOC  IN('FAC','FPC','FCP','FEF','FEC','FES'))
            GROUP BY DOCPRODUCTOS.CODPROD, DOCPRODUCTOS.DESPROD
            ORDER BY VENTA DESC
        `

    execute.QueryToken(res,qry,token)

});



module.exports = router;