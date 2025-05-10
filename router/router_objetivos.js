const execute = require('../connection');
const express = require('express');
const router = express.Router();


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
        SELECT OBJETIVOS_GENERAL.EMPNIT, 
                OBJETIVOS_GENERAL.MES, 
                OBJETIVOS_GENERAL.ANIO, 
                OBJETIVOS_GENERAL.CODMARCA, 
                OBJETIVOS_GENERAL.OBJETIVO,
                MARCAS.DESMARCA
        FROM OBJETIVOS_GENERAL LEFT OUTER JOIN
                  MARCAS ON OBJETIVOS_GENERAL.CODMARCA = MARCAS.CODMARCA
            WHERE  OBJETIVOS_GENERAL.EMPNIT='${sucursal}' AND 
            OBJETIVOS_GENERAL.MES=${mes} AND 
            OBJETIVOS_GENERAL.ANIO=${anio};
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
        SELECT OBJETIVOS_EMPLEADO.ID, OBJETIVOS_EMPLEADO.CODEMP, 
        EMPLEADOS.NOMEMPLEADO AS NOMEMP, 
        OBJETIVOS_EMPLEADO.MES, 
        OBJETIVOS_EMPLEADO.ANIO, 
        OBJETIVOS_EMPLEADO.CODMARCA, 
        MARCAS.DESMARCA, 
        OBJETIVOS_EMPLEADO.OBJETIVO
FROM     OBJETIVOS_EMPLEADO LEFT OUTER JOIN
                  EMPLEADOS ON OBJETIVOS_EMPLEADO.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
                  MARCAS ON OBJETIVOS_EMPLEADO.CODMARCA = MARCAS.CODMARCA
WHERE  (OBJETIVOS_EMPLEADO.MES = ${mes}) AND (OBJETIVOS_EMPLEADO.ANIO = ${anio}) 
AND (OBJETIVOS_EMPLEADO.EMPNIT = '${sucursal}')
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
