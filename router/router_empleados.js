const execute = require('./../connection');
const express = require('express');
const router = express.Router();


router.post("/empleados_edit", async(req,res)=>{
   
    const { token, sucursal, codemp,codpuesto, nombre, direccion, telefono, clave,usuario,coddoc_env, coddoc_cot } = req.body;

    let qry = `
        UPDATE EMPLEADOS SET
            CODPUESTO=${codpuesto},
            NOMEMPLEADO='${nombre}',
            DIRECCION='${direccion}',
            TELEFONO='${telefono}',
            CLAVE='${clave}',
            USUARIO='${usuario}',
            CODDOC_ENV='${coddoc_env}',
            CODDOC_COT='${coddoc_cot}'
        WHERE EMPNIT='${sucursal}' 
            AND CODEMPLEADO=${codemp};
            `
    
    execute.QueryToken(res,qry,token); 
     
});


router.post("/empleados_insert", async(req,res)=>{
   
    const { token, sucursal, codpuesto, nombre, direccion, telefono, clave,usuario,coddoc_env, coddoc_cot } = req.body;

    let qry = `
        INSERT INTO EMPLEADOS 
            (EMPNIT,CODPUESTO,NOMEMPLEADO,DPI,IGSS,DIRECCION,TELEFONO,CLAVE,ACTIVO,USUARIO,CODDOC_ENV,CODDOC_COT)
        SELECT '${sucursal}' AS EMPNIT, 
                ${codpuesto} AS CODPUESTO,
                '${nombre}' AS NOMEMPLEADO,
                '' AS DPI,'' AS IGSS,
                '${direccion}' AS DIRECCION,
                '${telefono}' AS TELEFONO,
                '${clave}' AS CLAVE,
                'SI' AS ACTIVO,
                '${usuario}' AS USUARIO,
                '${coddoc_env}' AS CODDOC_ENV,
                '${coddoc_cot}' AS CODDOC_COT;
            `
    
    execute.QueryToken(res,qry,token); 
     
});


router.post("/empleados_listado", async(req,res)=>{
   
    const { token, sucursal,st } = req.body;

    let qry = `
        SELECT EMPLEADOS.CODEMPLEADO, 
                EMPLEADOS.CODPUESTO, 
                EMPLEADOS_PUESTOS.NOMPUESTO, 
                EMPLEADOS.NOMEMPLEADO, 
                EMPLEADOS.DPI, 
                EMPLEADOS.IGSS, 
                EMPLEADOS.DIRECCION, 
                EMPLEADOS.TELEFONO, 
                EMPLEADOS.CLAVE, 
                EMPLEADOS.ACTIVO, 
                EMPLEADOS.USUARIO, 
                EMPLEADOS.CODDOC_ENV, 
                EMPLEADOS.CODDOC_COT
        FROM    EMPLEADOS LEFT OUTER JOIN
                EMPLEADOS_PUESTOS ON EMPLEADOS.CODPUESTO = EMPLEADOS_PUESTOS.CODPUESTO
        WHERE  (EMPLEADOS.EMPNIT = '${sucursal}') 
        AND (EMPLEADOS.ACTIVO='${st}')
        ORDER BY EMPLEADOS_PUESTOS.NOMPUESTO;
            `
    
    execute.QueryToken(res,qry,token); 
     
});

router.post("/empleados_update_st", async(req,res)=>{
   
    const { token, sucursal,codigo,st } = req.body;

    let qry = `
        UPDATE EMPLEADOS SET ACTIVO='${st}'
        WHERE EMPNIT='${sucursal}' 
        AND CODEMPLEADO=${codigo};
            `
    
    execute.QueryToken(res,qry,token); 
     
});

router.post("/empleados_delete", async(req,res)=>{
   
    const { token, sucursal,codigo } = req.body;

    let qry = `
        DELETE FROM EMPLEADOS
        WHERE EMPNIT='${sucursal}' 
        AND CODEMPLEADO=${codigo};
            `
    
    execute.QueryToken(res,qry,token); 
     
});




router.post("/empleados_login", async(req,res)=>{
   
    const { token, sucursal, u, p } = req.body;


    let BACKUP_qry = `SELECT CODEMPLEADO AS CODIGO, CODPUESTO AS NIVEL, 
        NOMEMPLEADO AS NOMBRE, 
        ISNULL(CODDOC_ENV,'') AS CODDOC_ENV,
        ISNULL(CODDOC_COT,'') AS CODDOC_COT
         FROM EMPLEADOS 
        WHERE EMPNIT='${sucursal}' AND USUARIO='${u}' AND CLAVE='${p}';`
    


    let qry = `SELECT EMPLEADOS.EMPNIT, EMPLEADOS.CODEMPLEADO AS CODIGO, EMPLEADOS.CODPUESTO AS NIVEL, EMPLEADOS.NOMEMPLEADO AS NOMBRE, ISNULL(EMPLEADOS.CODDOC_ENV, '') AS CODDOC_ENV, 
                  ISNULL(EMPLEADOS.CODDOC_COT, '') AS CODDOC_COT, EMPRESAS.NOMBRE AS EMPRESA
FROM     EMPLEADOS LEFT OUTER JOIN
                  EMPRESAS ON EMPLEADOS.EMPNIT = EMPRESAS.EMPNIT
WHERE  (EMPLEADOS.USUARIO = '${u}') AND (EMPLEADOS.CLAVE = '${p}')`
    
    execute.QueryToken(res,qry,token); 
     
});

router.post("/empleados_tipo", async(req,res)=>{
   
    const { token, sucursal, tipo } = req.body;

    let qry = `SELECT CODEMPLEADO, CODPUESTO, NOMEMPLEADO,
        DIRECCION,CLAVE FROM EMPLEADOS 
        WHERE EMPNIT LIKE '%${sucursal}%' AND CODPUESTO=${tipo} AND ACTIVO='SI'
        ORDER BY NOMEMPLEADO;`
    
    execute.QueryToken(res,qry,token); 
     
});






module.exports = router;