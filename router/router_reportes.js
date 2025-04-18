const execute = require('./../connection');
const express = require('express');
const router = express.Router();




router.post("/rpt_sellout", async(req,res)=>{
   
    const { token, sucursal, fi, ff } = req.body;

    let qry = `
    SELECT EMPNIT,RELOP,ANIO,MES,FECHA,CODIGO_CLIENTE,
        TIPONEGOCIO,NEGOCIO,CLIENTE,DIRECCION,VISITA,
        CODIGO_VENDEDOR,VENDEDOR,CODIGO_CATEGORIA,
        CATEGORIA,CODIGO_MARCA,MARCA,CODIGO_RUTA,
        CODIGO_DEPARTAMENTO,GEO2_DEPARTAMENTO,
        CODIGO_MUNICIPIO,GEO3_MUNICIPIO,CODIGO_SECTOR,
        GEO4_ALDEA_CASERIO,PRODUCTO,CODIGO_DUN,CODIGO_BARRA_EAN,
        DESCRIPCION_PRODUCTO,VENTA_EN_CANTIDAD,FACTOR,
        UNIDADES_POR_CAJA,TOTALUNIDADES,MEDIDA,VENTA_EN_QUETZALES,
        ISNULL(FACTURA_SAT_SERIE,'') AS FACTURA_SAT_SERIE,
        ISNULL(FACTURA_SAT_NUMERO,'') AS FACTURA_SAT_NUMERO,
        ISNULL(FACTURA_SAT_UUDI,'') AS FACTURA_SAT_UUDI,
        TRANSACCION,LATITUD,LONGITUD,
        COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,TIPOPROD,INV
  FROM view_rpt_general
    WHERE (EMPNIT LIKE '${sucursal}') 
    AND (FECHA BETWEEN '${fi}' AND '${ff}')
    `;
    
   


    execute.QueryToken(res,qry,token);
     
});

router.post("/rpt_marcas", async(req,res)=>{
   
    const { token, sucursal, mes, anio } = req.body;

    let qry = `
        SELECT PRODUCTOS.CODMARCA, ISNULL(MARCAS.DESMARCA,'') AS DESMARCA, 
            SUM(ISNULL(DOCPRODUCTOS.TOTALUNIDADES,0)) AS TOTALUNIDADES, 
            SUM(ISNULL(DOCPRODUCTOS.TOTALCOSTO,0)) AS TOTALCOSTO, 
            SUM(ISNULL(DOCPRODUCTOS.TOTALPRECIO,0)) AS TOTALPRECIO
        FROM  DOCUMENTOS LEFT OUTER JOIN
            TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC 
            AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT LEFT OUTER JOIN
            DOCPRODUCTOS ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO 
            AND DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT LEFT OUTER JOIN
            PRODUCTOS LEFT OUTER JOIN
            MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA ON DOCPRODUCTOS.CODPROD = PRODUCTOS.CODPROD
        WHERE (DOCUMENTOS.EMPNIT LIKE '${sucursal}') 
        AND (DOCUMENTOS.MES = ${mes})
        AND (DOCUMENTOS.ANIO = ${anio}) 
        AND (DOCUMENTOS.STATUS <> 'A')
        AND (TIPODOCUMENTOS.TIPODOC IN('FAC','FEF','FEC','FCP','FES','FPC'))
        AND (MARCAS.DESMARCA IS NOT NULL)
        GROUP BY PRODUCTOS.CODMARCA,MARCAS.DESMARCA
    `;
    
   

    execute.QueryToken(res,qry,token);
     
});

router.post("/rpt_marcas_productos", async(req,res)=>{
   
    const { token, sucursal, codmarca, mes, anio } = req.body;

    let qry = `
        SELECT PRODUCTOS.DESPROD, 
SUM(ISNULL(DOCPRODUCTOS.TOTALUNIDADES, 0))  AS TOTALUNIDADES, 
SUM(ISNULL(DOCPRODUCTOS.TOTALUNIDADES, 0)) / PRODUCTOS.UXC AS CAJAS, 
SUM(ISNULL(DOCPRODUCTOS.TOTALCOSTO, 0)) AS TOTALCOSTO, SUM(ISNULL(DOCPRODUCTOS.TOTALPRECIO, 0)) 
                  AS TOTALPRECIO, PRODUCTOS.CODPROD, PRODUCTOS.CODPROD2, PRODUCTOS.DESPROD3 AS CODIGO_EAN
FROM     DOCUMENTOS LEFT OUTER JOIN
                  TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT LEFT OUTER JOIN
                  DOCPRODUCTOS ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO AND DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT LEFT OUTER JOIN
                  PRODUCTOS LEFT OUTER JOIN
                  MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA ON DOCPRODUCTOS.CODPROD = PRODUCTOS.CODPROD
WHERE  (DOCUMENTOS.EMPNIT LIKE '${sucursal}') 
        AND (DOCUMENTOS.MES = ${mes}) 
        AND (DOCUMENTOS.ANIO = ${anio}) 
        AND (DOCUMENTOS.STATUS <> 'A') 
        AND (TIPODOCUMENTOS.TIPODOC IN ('FAC', 'FEF', 'FEC', 'FCP', 'FES', 'FPC')) 
        AND (MARCAS.DESMARCA IS NOT NULL) 
        AND (PRODUCTOS.CODMARCA = ${codmarca})
GROUP BY MARCAS.DESMARCA, PRODUCTOS.DESPROD, PRODUCTOS.CODPROD, PRODUCTOS.CODPROD2, PRODUCTOS.DESPROD3,PRODUCTOS.UXC
ORDER BY PRODUCTOS.CODPROD
    `;
    
   

    execute.QueryToken(res,qry,token);
     
});

router.post("/rpt_ventas_vendedor", async(req,res)=>{

    const {token,sucursal,anio,mes} = req.body;

    let qry = `
         SELECT EMPLEADOS.CODEMPLEADO AS CODEMP, EMPLEADOS.NOMEMPLEADO AS EMPLEADO, 
                    EMPLEADOS.TELEFONO, 
                    EMPLEADOS.USUARIO, 
                    EMPLEADOS.CLAVE, 
                    COUNT(DOCUMENTOS.CODDOC) AS CONTEO,
                    SUM(DOCUMENTOS.TOTALCOSTO) AS TOTALCOSTO, 
                    SUM(DOCUMENTOS.TOTALVENTA) AS TOTALVENTA, 
                    SUM(DOCUMENTOS.TOTALPRECIO) AS TOTALPRECIO
            FROM DOCUMENTOS LEFT OUTER JOIN
                  EMPLEADOS ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO AND DOCUMENTOS.EMPNIT = EMPLEADOS.EMPNIT LEFT OUTER JOIN
                  TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
            WHERE 
                (DOCUMENTOS.EMPNIT LIKE '${sucursal}') 
                AND (DOCUMENTOS.MES = ${mes})
                AND (DOCUMENTOS.ANIO = ${anio}) 
                AND (DOCUMENTOS.STATUS <> 'A') 
                AND (TIPODOCUMENTOS.TIPODOC IN('FAC','FEF','FEC','FCP','FES','FPC'))
            GROUP BY EMPLEADOS.CODEMPLEADO, EMPLEADOS.NOMEMPLEADO, 
                EMPLEADOS.TELEFONO, EMPLEADOS.USUARIO, EMPLEADOS.CLAVE, DOCUMENTOS.MES, DOCUMENTOS.ANIO
            ORDER BY EMPLEADOS.NOMEMPLEADO;
        `

     
  
    execute.QueryToken(res,qry,token)

});

router.post("/rpt_ventas_vendedor_marcas", async(req,res)=>{

    const {token,sucursal,codemp,anio,mes} = req.body;

    let qry = `
        SELECT ISNULL(MARCAS.DESMARCA, '') AS DESMARCA, SUM(ISNULL(DOCPRODUCTOS.TOTALUNIDADES, 0)) AS TOTALUNIDADES, SUM(ISNULL(DOCPRODUCTOS.TOTALCOSTO, 0)) AS TOTALCOSTO, 
                  SUM(ISNULL(DOCPRODUCTOS.TOTALPRECIO, 0)) AS TOTALPRECIO
        FROM     DOCUMENTOS LEFT OUTER JOIN
                  TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT LEFT OUTER JOIN
                  DOCPRODUCTOS ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO AND DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT LEFT OUTER JOIN
                  PRODUCTOS LEFT OUTER JOIN
                  MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA ON DOCPRODUCTOS.CODPROD = PRODUCTOS.CODPROD
        WHERE  (DOCUMENTOS.EMPNIT LIKE '${sucursal}') 
            AND (DOCUMENTOS.MES = ${mes}) 
            AND (DOCUMENTOS.ANIO = ${anio}) 
            AND (DOCUMENTOS.STATUS <> 'A') 
            AND (TIPODOCUMENTOS.TIPODOC IN ('FAC', 'FEF', 'FEC', 'FCP', 'FES', 'FPC')) 
            AND (DOCUMENTOS.CODEMP = ${codemp}) 
            AND (MARCAS.DESMARCA IS NOT NULL)
        GROUP BY MARCAS.DESMARCA
        `

     console.log(qry);
  
    execute.QueryToken(res,qry,token)

});
















//--------------------------------------------------------

router.post("/rpt_ventas_fechas_compras", async(req,res)=>{

    const {token,sucursal,anio,mes} = req.body;

    let qry = `
        SELECT DOCUMENTOS.FECHA, 
                SUM(DOCUMENTOS.TOTALCOSTO) AS COSTO, 
                SUM(DOCUMENTOS.TOTALPRECIO) AS VENTA, 
                SUM(DOCUMENTOS.TOTALPRECIO) - SUM(DOCUMENTOS.TOTALCOSTO) AS UTILIDAD
        FROM  DOCUMENTOS LEFT OUTER JOIN TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
        WHERE 
            (DOCUMENTOS.EMPNIT LIKE '${sucursal}') AND 
            (DOCUMENTOS.MES = ${mes}) AND 
            (DOCUMENTOS.ANIO = ${anio}) AND 
            (DOCUMENTOS.STATUS <> 'A') AND 
            (TIPODOCUMENTOS.TIPODOC IN('COM','COP'))
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
            (DOCUMENTOS.EMPNIT LIKE '${sucursal}') AND 
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