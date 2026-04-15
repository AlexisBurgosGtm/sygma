const execute = require('./../connection');
const express = require('express');
const router = express.Router();



router.post("/login", async(req,res)=>{

    const {token,nombre,clave} = req.body;

    let qry = `
        SELECT TIPO, EMPNIT 
            FROM ACCESOS 
            WHERE U='${nombre}' AND P='${clave}';
        `     
  
    execute.QueryToken(res,qry,token)

});




module.exports = router;

