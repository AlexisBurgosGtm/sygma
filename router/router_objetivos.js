const execute = require('../connection');
const express = require('express');
const router = express.Router();




// se cambio marcas por clasificaion TIPO
router.post("/select_logro_vendedores_detalle", async(req,res)=>{
   
    const { token, sucursal, mes, anio, codemp} = req.body;

    let qry = `
       SELECT 
                view_rpt_objetivos_vendedores_categorias.VENDEDOR, 
                view_rpt_objetivos_vendedores_categorias.CODIGO_CATEGORIA, 
                view_rpt_objetivos_vendedores_categorias.CATEGORIA, 
                SUM(view_rpt_objetivos_vendedores_categorias.TOTALUNIDADES) AS TOTALUNIDADES, 
                SUM(view_rpt_objetivos_vendedores_categorias.TOTALCOSTO) AS TOTALCOSTO, 
                SUM(view_rpt_objetivos_vendedores_categorias.TOTALPRECIO) AS TOTALPRECIO, 
                ISNULL(OBJETIVOS_EMPLEADO.OBJETIVO,0) AS OBJETIVO
FROM     view_rpt_objetivos_vendedores_categorias LEFT OUTER JOIN
                  OBJETIVOS_EMPLEADO ON view_rpt_objetivos_vendedores_categorias.CODIGO_CATEGORIA = OBJETIVOS_EMPLEADO.CODMARCA AND view_rpt_objetivos_vendedores_categorias.ANIO = OBJETIVOS_EMPLEADO.ANIO AND 
                  view_rpt_objetivos_vendedores_categorias.MES = OBJETIVOS_EMPLEADO.MES AND view_rpt_objetivos_vendedores_categorias.EMPNIT = OBJETIVOS_EMPLEADO.EMPNIT
WHERE  (view_rpt_objetivos_vendedores_categorias.EMPNIT LIKE '${sucursal}') 
        AND (view_rpt_objetivos_vendedores_categorias.ANIO = ${anio}) 
        AND (view_rpt_objetivos_vendedores_categorias.MES = ${mes}) 
        AND (view_rpt_objetivos_vendedores_categorias.CODIGO_VENDEDOR = ${codemp})
GROUP BY view_rpt_objetivos_vendedores_categorias.VENDEDOR, view_rpt_objetivos_vendedores_categorias.CODIGO_CATEGORIA, view_rpt_objetivos_vendedores_categorias.CATEGORIA, OBJETIVOS_EMPLEADO.OBJETIVO
        `;
    

    execute.QueryToken(res,qry,token);
     
});



// se cambio marcas por clasificaion TIPO
router.post("/select_logro_marcas", async(req,res)=>{
   
    const { token, sucursal, mes, anio} = req.body;

    let qry = `
       SELECT view_rpt_objetivos_categorias.EMPNIT, 
                view_rpt_objetivos_categorias.RELOP, 
                view_rpt_objetivos_categorias.CODIGO_MARCA,
                view_rpt_objetivos_categorias.MARCA, 
                OBJETIVOS_GENERAL.OBJETIVO,
                SUM(view_rpt_objetivos_categorias.TOTALUNIDADES) * -1 AS TOTALUNIDADES, 
                SUM(view_rpt_objetivos_categorias.TOTALCOSTO) * - 1 AS TOTALCOSTO, 
                SUM(view_rpt_objetivos_categorias.TOTALPRECIO) * - 1 AS TOTALPRECIO
FROM     view_rpt_objetivos_categorias LEFT OUTER JOIN
                  OBJETIVOS_GENERAL ON view_rpt_objetivos_categorias.CODIGO_MARCA = OBJETIVOS_GENERAL.CODMARCA AND view_rpt_objetivos_categorias.MES = OBJETIVOS_GENERAL.MES AND 
                  view_rpt_objetivos_categorias.ANIO = OBJETIVOS_GENERAL.ANIO AND view_rpt_objetivos_categorias.EMPNIT = OBJETIVOS_GENERAL.EMPNIT
WHERE  (view_rpt_objetivos_categorias.ANIO = ${anio}) 
AND (view_rpt_objetivos_categorias.MES = ${mes}) 
AND (OBJETIVOS_GENERAL.OBJETIVO IS NOT NULL)
GROUP BY view_rpt_objetivos_categorias.EMPNIT, view_rpt_objetivos_categorias.RELOP, view_rpt_objetivos_categorias.CODIGO_MARCA, view_rpt_objetivos_categorias.MARCA, OBJETIVOS_GENERAL.OBJETIVO
HAVING (view_rpt_objetivos_categorias.EMPNIT like '${sucursal}')
        `;
    

    execute.QueryToken(res,qry,token);
     
});


router.post("/select_logro_vendedores", async(req,res)=>{
   
    const { token, sucursal, mes, anio} = req.body;

    let qry = `
      SELECT view_rpt_objetivos_vendedores_categorias.CODIGO_VENDEDOR, view_rpt_objetivos_vendedores_categorias.VENDEDOR, SUM(view_rpt_objetivos_vendedores_categorias.TOTALUNIDADES) AS TOTALUNIDADES, 
                  SUM(view_rpt_objetivos_vendedores_categorias.TOTALCOSTO) AS TOTALCOSTO, 
				  SUM(view_rpt_objetivos_vendedores_categorias.TOTALPRECIO) AS TOTALPRECIO, 
				  SUM(ISNULL(OBJETIVOS_EMPLEADO.OBJETIVO,0)) AS OBJETIVO
FROM     view_rpt_objetivos_vendedores_categorias LEFT OUTER JOIN
                  OBJETIVOS_EMPLEADO ON view_rpt_objetivos_vendedores_categorias.CODIGO_CATEGORIA = OBJETIVOS_EMPLEADO.CODMARCA AND view_rpt_objetivos_vendedores_categorias.MES = OBJETIVOS_EMPLEADO.MES AND 
                  view_rpt_objetivos_vendedores_categorias.ANIO = OBJETIVOS_EMPLEADO.ANIO AND view_rpt_objetivos_vendedores_categorias.CODIGO_VENDEDOR = OBJETIVOS_EMPLEADO.CODEMP AND 
                  view_rpt_objetivos_vendedores_categorias.EMPNIT = OBJETIVOS_EMPLEADO.EMPNIT
WHERE  (view_rpt_objetivos_vendedores_categorias.EMPNIT LIKE '${sucursal}') 
AND (view_rpt_objetivos_vendedores_categorias.ANIO = ${anio}) 
AND (view_rpt_objetivos_vendedores_categorias.MES = ${mes})
GROUP BY view_rpt_objetivos_vendedores_categorias.CODIGO_VENDEDOR, view_rpt_objetivos_vendedores_categorias.VENDEDOR
        `;
    

    execute.QueryToken(res,qry,token);
     
});







router.post("/insert_objetivo_general_marca", async(req,res)=>{
   
    const { token, sucursal, mes, anio, codmarca, objetivo } = req.body;

    let qry = `
        INSERT INTO OBJETIVOS_GENERAL 
            (EMPNIT,MES,ANIO,CODMARCA,OBJETIVO) 
        SELECT '${sucursal}' AS EMPNIT, ${mes} AS MES, ${anio} AS ANIO,
            ${codmarca} AS CODMARCA, ${objetivo} AS OBJETIVO;
    `;
    

    execute.QueryToken(res,qry,token);
     
});


router.post("/select_objetivo_general_marcas", async(req,res)=>{
   
    const { token, sucursal, mes, anio} = req.body;

    let qry = `
       SELECT OBJETIVOS_GENERAL.EMPNIT, OBJETIVOS_GENERAL.MES, OBJETIVOS_GENERAL.ANIO, OBJETIVOS_GENERAL.CODMARCA, OBJETIVOS_GENERAL.OBJETIVO, CLASIFICACIONES_GENERALES.DESCRIPCION AS DESMARCA
        FROM     OBJETIVOS_GENERAL LEFT OUTER JOIN
                  CLASIFICACIONES_GENERALES ON OBJETIVOS_GENERAL.CODMARCA = CLASIFICACIONES_GENERALES.CODIGO
        WHERE  (OBJETIVOS_GENERAL.EMPNIT = '${sucursal}') AND
            OBJETIVOS_GENERAL.MES=${mes} AND 
            OBJETIVOS_GENERAL.ANIO=${anio};
        `;
    

    execute.QueryToken(res,qry,token);
     
});

router.post("/select_objetivo_general_categorias", async(req,res)=>{
   
    const { token, sucursal, mes, anio} = req.body;

    let qry = `
        SELECT 
            EMPNIT, EMPRESA, 
            MES, ANIO, 
            OBJ_CODMARCA, OBJ_DESMARCA, 
            SUM(OBJETIVO) AS OBJETIVO
        FROM view_data_objetivos_vendedor
        GROUP BY EMPNIT, EMPRESA, MES, OBJ_CODMARCA, OBJ_DESMARCA, ANIO
        HAVING (EMPNIT = '${sucursal}') 
                AND (MES = ${mes}) 
                AND (ANIO = ${anio});

        `;
    

    execute.QueryToken(res,qry,token);
     
});


router.post("/delete_objetivo_general_marca", async(req,res)=>{
   
    const { token, sucursal, mes, anio, codmarca} = req.body;

    let qry = `
        DELETE FROM OBJETIVOS_GENERAL
            WHERE  EMPNIT='${sucursal}' 
                AND MES=${mes} 
                AND ANIO=${anio}
                AND CODMARCA=${codmarca};
        `;
    

    execute.QueryToken(res,qry,token);
     
});




router.post("/insert_objetivo_vendedor_marca", async(req,res)=>{
   
    const { token, sucursal, mes, anio, codmarca, objetivo, codemp } = req.body;

    let qry = `
        INSERT INTO OBJETIVOS_EMPLEADO 
            (EMPNIT,CODEMP,MES,ANIO,CODMARCA,OBJETIVO) 
        SELECT '${sucursal}' AS EMPNIT, ${codemp} AS CODEMP, ${mes} AS MES, ${anio} AS ANIO,
            ${codmarca} AS CODMARCA, ${objetivo} AS OBJETIVO;
    `;
    

    execute.QueryToken(res,qry,token);
     
});

router.post("/select_objetivo_vendedores_marcas", async(req,res)=>{
   
    const { token, sucursal, mes, anio} = req.body;

    let qry = `
    SELECT OBJETIVOS_EMPLEADO.ID, OBJETIVOS_EMPLEADO.CODEMP, EMPLEADOS.NOMEMPLEADO AS NOMEMP, OBJETIVOS_EMPLEADO.MES, OBJETIVOS_EMPLEADO.ANIO, OBJETIVOS_EMPLEADO.CODMARCA, 
                  OBJETIVOS_EMPLEADO.OBJETIVO, CLASIFICACIONES_GENERALES.DESCRIPCION AS DESMARCA
    FROM OBJETIVOS_EMPLEADO LEFT OUTER JOIN
                  CLASIFICACIONES_GENERALES ON OBJETIVOS_EMPLEADO.CODMARCA = CLASIFICACIONES_GENERALES.CODIGO LEFT OUTER JOIN
                  EMPLEADOS ON OBJETIVOS_EMPLEADO.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
                  MARCAS ON OBJETIVOS_EMPLEADO.CODMARCA = MARCAS.CODMARCA
    WHERE (OBJETIVOS_EMPLEADO.MES = ${mes}) AND 
        (OBJETIVOS_EMPLEADO.ANIO = ${anio}) AND 
        (OBJETIVOS_EMPLEADO.EMPNIT = '${sucursal}')
    ORDER BY NOMEMP
        `;
    

    execute.QueryToken(res,qry,token);
     
});

router.post("/select_objetivo_vendedores_marcas_resumen", async(req,res)=>{
   
    const { token, sucursal, mes, anio} = req.body;

    let qry = `
   SELECT OBJETIVOS_EMPLEADO.CODEMP, EMPLEADOS.NOMEMPLEADO AS NOMEMP, OBJETIVOS_EMPLEADO.MES, OBJETIVOS_EMPLEADO.ANIO, SUM(OBJETIVOS_EMPLEADO.OBJETIVO) AS OBJETIVO
FROM     OBJETIVOS_EMPLEADO LEFT OUTER JOIN
                  EMPLEADOS ON OBJETIVOS_EMPLEADO.CODEMP = EMPLEADOS.CODEMPLEADO
WHERE  (OBJETIVOS_EMPLEADO.EMPNIT = '${sucursal}')
GROUP BY OBJETIVOS_EMPLEADO.CODEMP, EMPLEADOS.NOMEMPLEADO, OBJETIVOS_EMPLEADO.MES, OBJETIVOS_EMPLEADO.ANIO
HAVING (OBJETIVOS_EMPLEADO.MES = ${mes}) 
        AND (OBJETIVOS_EMPLEADO.ANIO = ${anio})
ORDER BY NOMEMP
        `;
    

    execute.QueryToken(res,qry,token);
     
});


router.post("/delete_objetivo_vendedor_marca", async(req,res)=>{
   
    const { token, sucursal, id} = req.body;

    let qry = `
        DELETE FROM OBJETIVOS_EMPLEADO
            WHERE ID=${id};
        `;
    

    execute.QueryToken(res,qry,token);
     
});







module.exports = router;
