const execute = require('./../connection');
const express = require('express');
const router = express.Router();




router.post("/rpt_sellout", async(req,res)=>{
   
    const { token, sucursal, fi, ff } = req.body;

    let qry = `
    SELECT EMPNIT,RELOP,ANIO,MES,
        FECHA,
        ISNULL(CODIGO_CLIENTE,0) AS CODIGO_CLIENTE,
        ISNULL(TIPONEGOCIO,'SN') AS TIPONEGOCIO,
        ISNULL(NEGOCIO,'SN') AS NEGOCIO,
        ISNULL(CLIENTE,'SN') AS CLIENTE,
        ISNULL(DIRECCION,'') AS DIRECCION,
        ISNULL(VISITA,'OTROS') AS VISITA,
        CODIGO_VENDEDOR,VENDEDOR,CODIGO_CATEGORIA,
        CATEGORIA,CODIGO_MARCA,MARCA,
        ISNULL(CODIGO_RUTA,0) AS CODIGO_RUTA,
        ISNULL(CODIGO_DEPARTAMENTO,0) AS CODIGO_DEPARTAMENTO,
        ISNULL(GEO2_DEPARTAMENTO,'SN') AS GEO2_DEPARTAMENTO,
        ISNULL(CODIGO_MUNICIPIO,0) AS CODIGO_MUNICIPIO,
        ISNULL(GEO3_MUNICIPIO,'SN') AS GEO3_MUNICIPIO,
        ISNULL(CODIGO_SECTOR,'') AS CODIGO_SECTOR,
        ISNULL(GEO4_ALDEA_CASERIO,'') AS GEO4_ALDEA_CASERIO,
        PRODUCTO,CODIGO_DUN,CODIGO_BARRA_EAN,
        DESCRIPCION_PRODUCTO,VENTA_EN_CANTIDAD,FACTOR,
        UNIDADES_POR_CAJA,TOTALUNIDADES,MEDIDA,VENTA_EN_QUETZALES,
        ISNULL(FACTURA_SAT_SERIE,'') AS FACTURA_SAT_SERIE,
        ISNULL(FACTURA_SAT_NUMERO,'') AS FACTURA_SAT_NUMERO,
        ISNULL(FACTURA_SAT_UUDI,'') AS FACTURA_SAT_UUDI,
        TRANSACCION,
        ISNULL(LATITUD,0) AS LATITUD,
        ISNULL(LONGITUD,0) AS LONGITUD,
        COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,TIPOPROD,INV
  FROM view_rpt_general
    WHERE (EMPNIT LIKE '${sucursal}') 
    AND (FECHA BETWEEN '${fi}' AND '${ff}')
    `;
    
   


    execute.QueryToken(res,qry,token);
     
});
router.post("/rpt_sellout_export", async(req,res)=>{
   
    const { token, sucursal, fi, ff } = req.body;

    let qry = `
    SELECT 
        RELOP,
        TRANSACCION,
        convert(varchar, FECHA, 105) AS FECHA,
        ISNULL(CODIGO_CLIENTE,0) AS CODIGO_CLIENTE,
        CONCAT(ISNULL(TIPONEGOCIO,'SN'), ' ',  ISNULL(NEGOCIO,'SN'), ' - ', ISNULL(CLIENTE,'SN')) AS CLIENTE,
        'DETALLE' AS TIPO_CLIENTE,
        CODIGO_VENDEDOR,
        VENDEDOR,
        CATEGORIA,
        MARCA,
        ISNULL(CODIGO_RUTA,0) AS CODIGO_RUTA,
        'GUATEMALA' AS GEO1_PAIS,
        ISNULL(GEO2_DEPARTAMENTO,'SN') AS GEO2_DEPARTAMENTO,
        ISNULL(GEO3_MUNICIPIO,'SN') AS GEO3_MUNICIPIO,
        ISNULL(GEO4_ALDEA_CASERIO,'') AS GEO4_ALDEA_CASERIO,
        PRODUCTO,
        CODIGO_DUN,
        CODIGO_BARRA_EAN,
        DESCRIPCION_PRODUCTO AS DESCRIPCION,
        VENTA_EN_CANTIDAD,
        FACTOR,
        UNIDADES_POR_CAJA,
        MEDIDA,
        VENTA_EN_QUETZALES,
        CONCAT(ISNULL(FACTURA_SAT_SERIE,''), ' ', ISNULL(FACTURA_SAT_NUMERO,'')) AS FACTURA_SAT
  FROM view_rpt_general
    WHERE (EMPNIT LIKE '${sucursal}') 
    AND (FECHA BETWEEN '${fi}' AND '${ff}')
    `;
    
   /*
   ,
        ((ISNULL(VENTA_EN_CANTIDAD,0) * ISNULL(UNIDADES_POR_CAJA,1)) / UNIDADES_POR_CAJA) AS CANTIDAD_CAJAS
   */


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

router.post("/rpt_marcas_cliente_mes", async(req,res)=>{
   
    const { token, sucursal, codclie, fecha } = req.body;

    let qry = `    
            SELECT 
                MARCAS.CODMARCA, 
                MARCAS.DESMARCA, 
                ISNULL(B.TOTALUNIDADES,0) AS TOTALUNIDADES,
                ISNULL(B.TOTALPRECIO,0) AS TOTALPRECIO
            FROM  MARCAS LEFT OUTER JOIN
                (SELECT CODIGO_MARCA, ISNULL(TOTALUNIDADES,0) AS TOTALUNIDADES, 
                        ISNULL(TOTALPRECIO,0) AS TOTALPRECIO
                    FROM view_rpt_marcas_cliente_mes_data
                    WHERE 
                        (CODIGO_CLIENTE = ${codclie}) AND 
                        (MES = MONTH('${fecha}')) AND 
                        (ANIO = YEAR('${fecha}'))
                        ) AS B 
                    ON MARCAS.CODMARCA = B.CODIGO_MARCA
            ORDER BY B.TOTALPRECIO DESC; `;
    
  
    execute.QueryToken(res,qry,token);
     
});
router.post("/rpt_productos_cliente_mes", async(req,res)=>{
   
    const { token, sucursal, codclie, fecha } = req.body;

    let qry = `    
        SELECT 
            ANIO, MES, 
            PRODUCTO AS CODPROD, 
            DESCRIPCION_PRODUCTO AS DESPROD, 
            SUM((TOTALUNIDADES*(INV*-1))) AS TOTALUNIDADES, 
            SUM((TOTALPRECIO*(INV*-1))) AS TOTALPRECIO
        FROM  view_rpt_general
        WHERE
            (EMPNIT='${sucursal}') AND 
            (CODIGO_CLIENTE = ${codclie}) AND 
            (MES=MONTH('${fecha}')) AND 
            (ANIO=YEAR('${fecha}'))
        GROUP BY EMPNIT, ANIO, MES, PRODUCTO,DESCRIPCION_PRODUCTO
        ORDER BY SUM((TOTALPRECIO*(INV*-1))) DESC;   
        `;
    
  
    execute.QueryToken(res,qry,token);
     
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