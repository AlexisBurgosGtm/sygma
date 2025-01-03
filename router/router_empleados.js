const execute = require('./../connection');
const express = require('express');
const router = express.Router();


router.post("/empleados_tipo", async(req,res)=>{
   
    const { token, sucursal, tipo } = req.body;

    let qry = `SELECT CODEMPLEADO, CODPUESTO, NOMEMPLEADO,
        DIRECCION,CLAVE FROM EMPLEADOS 
        WHERE EMPNIT='${sucursal}' AND CODPUESTO=${tipo}`
    
    execute.QueryToken(res,qry,token); 
     
});





module.exports = router;