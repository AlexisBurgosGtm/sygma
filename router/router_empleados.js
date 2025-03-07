const execute = require('./../connection');
const express = require('express');
const router = express.Router();



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




router.post("/empleados_login", async(req,res)=>{
   
    const { token, sucursal, u, p } = req.body;

    let qry = `SELECT CODEMPLEADO AS CODIGO, CODPUESTO AS NIVEL, 
        NOMEMPLEADO AS NOMBRE, 
        ISNULL(CODDOC_ENV,'') AS CODDOC_ENV,
        ISNULL(CODDOC_COT,'') AS CODDOC_COT
         FROM EMPLEADOS 
        WHERE EMPNIT='${sucursal}' AND USUARIO='${u}' AND CLAVE='${p}';`
    
    execute.QueryToken(res,qry,token); 
     
});

router.post("/empleados_tipo", async(req,res)=>{
   
    const { token, sucursal, tipo } = req.body;

    let qry = `SELECT CODEMPLEADO, CODPUESTO, NOMEMPLEADO,
        DIRECCION,CLAVE FROM EMPLEADOS 
        WHERE EMPNIT='${sucursal}' AND CODPUESTO=${tipo}`
    
    execute.QueryToken(res,qry,token); 
     
});





module.exports = router;