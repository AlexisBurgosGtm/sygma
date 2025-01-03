const execute = require('../connection');
const express = require('express');
const router = express.Router();



router.post("/listado", async(req,res)=>{
   
    const { token, sucursal } = req.body;   

    let qry = `
        SELECT CODCAJA, DESCAJA FROM CAJAS WHERE EMPNIT='${sucursal}'
    `
    execute.QueryToken(res,qry,token);
     
});







module.exports = router;

