const execute = require('./../connection');
const express = require('express');
const router = express.Router();


router.post("/empleados_login", async(req,res)=>{
   
    const { token, sucursal, u, p } = req.body;

    let qry = `SELECT CODEMPLEADO AS CODIGO, CODPUESTO AS NIVEL, 
        NOMEMPLEADO AS NOMBRE
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