const execute = require('./../connection');
const express = require('express');
const router = express.Router();



router.post("/listado_formatos", async(req,res)=>{
   
    const { token } = req.body;


    let qry = ``
    qry = `SELECT CODFORMATO, DESCRIPCION FROM CONTA_FORMATOS`
   

    execute.QueryToken(res,qry,token);
     
});











module.exports = router;

