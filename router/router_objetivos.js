const execute = require('../connection');
const express = require('express');
const router = express.Router();


// ----------------------
// GOLES P&G
// ----------------------
router.post("/goles_cliente", async(req,res)=>{
   
    const { token, sucursal,codclie, fecha} = req.body;

    let qry = `
        SELECT PRODUCTOS.CODPROD, PRODUCTOS.DESPROD, 
            (ISNULL(T.TOTALUNIDADES,0)*-1) AS TOTALUNIDADES,
            (ISNULL(T.TOTALPRECIO,0)*-1) AS TOTALPRECIO 
            FROM PRODUCTOS LEFT JOIN 
            (SELECT CODPROD, SUM(UNIDADES) AS TOTALUNIDADES, SUM(IMPORTE) AS TOTALPRECIO
            FROM     view_rpt_goles_productos_cliente
            WHERE  (EMPNIT = '${sucursal}') AND 
            (ANIO = YEAR('${fecha}')) AND 
            (MES = MONTH('${fecha}')) AND 
            (CODCLIENTE=${codclie})
            GROUP BY CODPROD) AS T ON PRODUCTOS.CODPROD=T.CODPROD 
            WHERE PRODUCTOS.HABILITADO='SI'
            ORDER BY T.TOTALUNIDADES ASC;
        `;
    

    execute.QueryToken(res,qry,token);
     
});
router.post("/goles_resumen_vendedor", async(req,res)=>{
   
    const { token, sucursal,codven, fecha} = req.body;

    let qry = `
        SELECT PRODUCTOS.CODPROD, PRODUCTOS.DESPROD, 
            (ISNULL(T.TOTALUNIDADES,0)*-1) AS TOTALUNIDADES,
            (ISNULL(T.TOTALPRECIO,0)*-1) AS TOTALPRECIO 
            FROM PRODUCTOS LEFT JOIN 
            (SELECT CODPROD, SUM(UNIDADES) AS TOTALUNIDADES, SUM(IMPORTE) AS TOTALPRECIO
            FROM     view_rpt_goles_productos_cliente
            WHERE  (EMPNIT = '${sucursal}') AND 
            (ANIO = YEAR('${fecha}')) AND 
            (MES = MONTH('${fecha}')) AND 
            (CODCLIENTE=${codclie})
            GROUP BY CODPROD) AS T ON PRODUCTOS.CODPROD=T.CODPROD 
            WHERE PRODUCTOS.HABILITADO='SI'
            ORDER BY T.TOTALUNIDADES ASC;
        `;
    

    execute.QueryToken(res,qry,token);
     
});

router.post("/universo_clientes_empleado", async(req,res)=>{
   
    const { token, sucursal,codemp} = req.body;

    let qry = `
       SELECT COUNT(CODCLIENTE) AS CONTEO
        FROM     CLIENTES
        WHERE  (HABILITADO = 'SI') AND 
            (EMPNIT = '${sucursal}') AND 
            (CODEMPLEADO = ${codemp})
        `;
    

    execute.QueryToken(res,qry,token);
     
});

// ----------------------
// GOLES P&G
// ----------------------


router.post("/cobertura_categorias", async(req,res)=>{
   
    const { token, sucursal, mes, anio} = req.body;

    let qry = `
		
        `;
    

    execute.QueryToken(res,qry,token);
     
});




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
		SELECT 
            view_data_objetivos_marcas.MES, 
            view_data_objetivos_marcas.ANIO, 
            view_data_objetivos_marcas.OBJ_CODMARCA AS CODIGO_MARCA, 
            view_data_objetivos_marcas.OBJ_DESMARCA AS MARCA, 
            SUM(ISNULL(view_data_objetivos_marcas.OBJETIVO,0)) AS OBJETIVO, 
            SUM(ISNULL(view_rpt_objetivos_marca_resumen.TOTALUNIDADES,0)) AS TOTALUNIDADES, 
            SUM(ISNULL(view_rpt_objetivos_marca_resumen.TOTALCOSTO,0)) AS TOTALCOSTO, 
            SUM(ISNULL(view_rpt_objetivos_marca_resumen.TOTALPRECIO,0)) AS TOTALPRECIO
        FROM     view_rpt_objetivos_marca_resumen RIGHT OUTER JOIN
                  view_data_objetivos_marcas ON view_rpt_objetivos_marca_resumen.CODIGO_MARCA = view_data_objetivos_marcas.OBJ_CODMARCA AND view_rpt_objetivos_marca_resumen.ANIO = view_data_objetivos_marcas.ANIO AND 
                  view_rpt_objetivos_marca_resumen.MES = view_data_objetivos_marcas.MES AND view_rpt_objetivos_marca_resumen.EMPNIT = view_data_objetivos_marcas.EMPNIT
        WHERE  (view_data_objetivos_marcas.EMPNIT LIKE '%${sucursal}%')
        GROUP BY view_data_objetivos_marcas.MES, view_data_objetivos_marcas.ANIO, view_data_objetivos_marcas.OBJ_CODMARCA, view_data_objetivos_marcas.OBJ_DESMARCA
        HAVING (view_data_objetivos_marcas.MES = ${mes}) AND 
                (view_data_objetivos_marcas.ANIO = ${anio})

        `;
    

    execute.QueryToken(res,qry,token);
     
});




router.post("/select_logro_marcas_categorias", async(req,res)=>{
   
    const { token, codmarca, sucursal, mes, anio} = req.body;

    let qry = `
	SELECT view_data_objetivo_categorias.CODCATEGORIA, 
		view_data_objetivo_categorias.CATEGORIA, 
		SUM(ISNULL(view_data_objetivo_categorias.OBJETIVO,0)) AS OBJETIVO, 
        SUM(ISNULL(view_rpt_objetivos_categorias_resumen.TOTALUNIDADES,0)) AS TOTALUNIDADES, 
		SUM(ISNULL(view_rpt_objetivos_categorias_resumen.TOTALCOSTO,0)) AS TOTALCOSTO, 
		SUM(ISNULL(view_rpt_objetivos_categorias_resumen.TOTALPRECIO,0)) AS TOTALPRECIO
    FROM     view_data_objetivo_categorias LEFT OUTER JOIN
                  view_rpt_objetivos_categorias_resumen ON view_data_objetivo_categorias.OBJ_CODMARCA = view_rpt_objetivos_categorias_resumen.CODIGO_MARCA AND 
                  view_data_objetivo_categorias.CODCATEGORIA = view_rpt_objetivos_categorias_resumen.CODIGO_CATEGORIA AND view_data_objetivo_categorias.ANIO = view_rpt_objetivos_categorias_resumen.ANIO AND 
                  view_data_objetivo_categorias.MES = view_rpt_objetivos_categorias_resumen.MES AND view_data_objetivo_categorias.EMPNIT = view_rpt_objetivos_categorias_resumen.EMPNIT
    WHERE  (view_data_objetivo_categorias.OBJ_CODMARCA = ${codmarca}) 
        AND (view_data_objetivo_categorias.EMPNIT LIKE '%${sucursal}%')
    GROUP BY view_data_objetivo_categorias.MES, 
            view_data_objetivo_categorias.ANIO, 
            view_data_objetivo_categorias.CODCATEGORIA, view_data_objetivo_categorias.CATEGORIA
    HAVING (view_data_objetivo_categorias.MES = ${mes}) 
        AND (view_data_objetivo_categorias.ANIO = ${anio})
        `;
    

    execute.QueryToken(res,qry,token);
     
});


router.post("/select_logro_vendedores_categorias", async(req,res)=>{
   
    const { token, codemp, sucursal, mes, anio} = req.body;

    let qry = `
        SELECT SUM(ISNULL(view_rpt_objetivos_vendedores_categorias_resumen.TOTALUNIDADES, 0)) AS TOTALUNIDADES, SUM(ISNULL(view_rpt_objetivos_vendedores_categorias_resumen.TOTALCOSTO, 0)) AS TOTALCOSTO, 
                  SUM(ISNULL(view_rpt_objetivos_vendedores_categorias_resumen.TOTALPRECIO, 0)) AS LOGRO, 
                  view_data_objetivos_vendedor.EMPLEADO AS VENDEDOR, 
                  view_data_objetivos_vendedor.CODCATEGORIA AS CODIGO_CATEGORIA, 
                  view_data_objetivos_vendedor.CATEGORIA, ISNULL(view_data_objetivos_vendedor.OBJETIVO, 0) AS OBJETIVO, view_data_objetivos_vendedor.CODEMP AS CODIGO_VENDEDOR
FROM     view_rpt_objetivos_vendedores_categorias_resumen RIGHT OUTER JOIN
                  view_data_objetivos_vendedor ON view_rpt_objetivos_vendedores_categorias_resumen.MES = view_data_objetivos_vendedor.MES AND 
                  view_rpt_objetivos_vendedores_categorias_resumen.ANIO = view_data_objetivos_vendedor.ANIO AND 
                  view_rpt_objetivos_vendedores_categorias_resumen.CODIGO_CATEGORIA = view_data_objetivos_vendedor.CODCATEGORIA AND 
                  view_rpt_objetivos_vendedores_categorias_resumen.CODIGO_VENDEDOR = view_data_objetivos_vendedor.CODEMP
GROUP BY view_data_objetivos_vendedor.ANIO, view_data_objetivos_vendedor.MES, view_data_objetivos_vendedor.OBJETIVO, view_data_objetivos_vendedor.CATEGORIA, view_data_objetivos_vendedor.CODEMP, 
                  view_data_objetivos_vendedor.CODCATEGORIA, view_data_objetivos_vendedor.EMPLEADO
HAVING (view_data_objetivos_vendedor.CODEMP = ${codemp}) AND 
    (view_data_objetivos_vendedor.ANIO = ${anio}) AND 
    (view_data_objetivos_vendedor.MES = ${mes})
ORDER BY view_data_objetivos_vendedor.CODCATEGORIA
        `;

    let qryOLD = `
        SELECT 
            SUM(ISNULL(view_rpt_objetivos_vendedores_categorias.TOTALUNIDADES, 0)) AS TOTALUNIDADES, 
            SUM(ISNULL(view_rpt_objetivos_vendedores_categorias.TOTALCOSTO, 0)) AS TOTALCOSTO, 
            SUM(ISNULL(view_rpt_objetivos_vendedores_categorias.TOTALPRECIO, 0)) AS LOGRO, 
            view_rpt_objetivos_vendedores_categorias.CODIGO_VENDEDOR, 
            view_rpt_objetivos_vendedores_categorias.VENDEDOR, 
            view_rpt_objetivos_vendedores_categorias.CODIGO_CATEGORIA, 
            view_rpt_objetivos_vendedores_categorias.CATEGORIA, 
            ISNULL(view_data_objetivos_vendedor.OBJETIVO,0) AS OBJETIVO
        FROM  view_rpt_objetivos_vendedores_categorias LEFT OUTER JOIN
            view_data_objetivos_vendedor ON view_rpt_objetivos_vendedores_categorias.MES = view_data_objetivos_vendedor.MES AND 
            view_rpt_objetivos_vendedores_categorias.ANIO = view_data_objetivos_vendedor.ANIO AND 
            view_rpt_objetivos_vendedores_categorias.CODIGO_CATEGORIA = view_data_objetivos_vendedor.CODCATEGORIA AND 
            view_rpt_objetivos_vendedores_categorias.CODIGO_VENDEDOR = view_data_objetivos_vendedor.CODEMP
        GROUP BY view_rpt_objetivos_vendedores_categorias.CODIGO_VENDEDOR, view_rpt_objetivos_vendedores_categorias.VENDEDOR,
            view_rpt_objetivos_vendedores_categorias.ANIO, view_rpt_objetivos_vendedores_categorias.MES, 
            view_rpt_objetivos_vendedores_categorias.CODIGO_CATEGORIA, view_rpt_objetivos_vendedores_categorias.CATEGORIA, 
            view_data_objetivos_vendedor.OBJETIVO, view_data_objetivos_vendedor.CATEGORIA
        HAVING (view_rpt_objetivos_vendedores_categorias.ANIO = ${anio}) 
            AND (view_rpt_objetivos_vendedores_categorias.MES = ${mes}) 
            AND (view_rpt_objetivos_vendedores_categorias.CODIGO_VENDEDOR = ${codemp});
        `;
    

    execute.QueryToken(res,qry,token);
     
});

router.post("/BACKUP_select_logro_vendedores_categorias", async(req,res)=>{
   
    const { token, codemp, sucursal, mes, anio} = req.body;

    let qry = `
	SELECT view_data_objetivos_vendedor.EMPNIT, view_data_objetivos_vendedor.EMPRESA, 
				view_data_objetivos_vendedor.CODEMP, 
				view_data_objetivos_vendedor.EMPLEADO, 
				view_data_objetivos_vendedor.CODCATEGORIA, 
                 view_data_objetivos_vendedor.CATEGORIA, 
				 view_data_objetivos_vendedor.OBJETIVO, 
				 SUM(ISNULL(view_rpt_objetivos_vendedores_categorias.TOTALUNIDADES,0)) AS TOTALUNIDADES, 
                 SUM(ISNULL(view_rpt_objetivos_vendedores_categorias.TOTALCOSTO,0)) AS TOTALCOSTO, 
				 SUM(ISNULL(view_rpt_objetivos_vendedores_categorias.TOTALPRECIO,0)) AS LOGRO
FROM     view_rpt_objetivos_vendedores_categorias RIGHT OUTER JOIN
                  view_data_objetivos_vendedor ON view_rpt_objetivos_vendedores_categorias.CODIGO_CATEGORIA = view_data_objetivos_vendedor.CODCATEGORIA AND 
                  view_rpt_objetivos_vendedores_categorias.CODIGO_VENDEDOR = view_data_objetivos_vendedor.CODEMP AND view_rpt_objetivos_vendedores_categorias.EMPNIT = view_data_objetivos_vendedor.EMPNIT
WHERE  (view_data_objetivos_vendedor.MES = ${mes}) 
		AND (view_data_objetivos_vendedor.ANIO = ${anio})
GROUP BY view_data_objetivos_vendedor.EMPNIT, view_data_objetivos_vendedor.EMPRESA, view_data_objetivos_vendedor.CODEMP, view_data_objetivos_vendedor.EMPLEADO, view_data_objetivos_vendedor.CODCATEGORIA, 
                  view_data_objetivos_vendedor.CATEGORIA, view_data_objetivos_vendedor.OBJETIVO
HAVING (view_data_objetivos_vendedor.CODEMP = ${codemp})
        `;
    

    execute.QueryToken(res,qry,token);
     
});


router.post("/select_logro_vendedores", async(req,res)=>{
   
    const { token, sucursal, mes, anio} = req.body;

    let qry = `
        SELECT view_rpt_objetivos_vendedores_categorias.RELOP AS EMPRESA, 
					view_data_objetivos_empleado_resumen.CODEMP AS CODIGO_VENDEDOR, 
					view_data_objetivos_empleado_resumen.NOMEMPLEADO AS VENDEDOR, 
					SUM(ISNULL(view_rpt_objetivos_vendedores_categorias.TOTALUNIDADES,0)) AS TOTALUNIDADES, 
					SUM(ISNULL(view_rpt_objetivos_vendedores_categorias.TOTALCOSTO,0)) AS TOTALCOSTO, 
					SUM(ISNULL(view_rpt_objetivos_vendedores_categorias.TOTALPRECIO,0)) AS TOTALPRECIO, 
					view_data_objetivos_empleado_resumen.OBJETIVO
        FROM     view_rpt_objetivos_vendedores_categorias RIGHT OUTER JOIN
                  view_data_objetivos_empleado_resumen ON view_rpt_objetivos_vendedores_categorias.MES = view_data_objetivos_empleado_resumen.MES AND 
                  view_rpt_objetivos_vendedores_categorias.ANIO = view_data_objetivos_empleado_resumen.ANIO AND view_rpt_objetivos_vendedores_categorias.CODIGO_VENDEDOR = view_data_objetivos_empleado_resumen.CODEMP AND 
                  view_rpt_objetivos_vendedores_categorias.EMPNIT = view_data_objetivos_empleado_resumen.EMPNIT
        WHERE  (view_data_objetivos_empleado_resumen.EMPNIT LIKE '%${sucursal}%') AND 
                (view_data_objetivos_empleado_resumen.ANIO = ${anio}) AND 
                (view_data_objetivos_empleado_resumen.MES = ${mes})
        GROUP BY view_rpt_objetivos_vendedores_categorias.RELOP, 
                view_data_objetivos_empleado_resumen.OBJETIVO, 
                view_data_objetivos_empleado_resumen.NOMEMPLEADO, 
                view_data_objetivos_empleado_resumen.CODEMP
        ORDER BY view_data_objetivos_empleado_resumen.NOMEMPLEADO
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
