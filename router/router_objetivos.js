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
        SELECT  EMPNIT,MES,ANIO,CODMARCA,OBJETIVO 
            FROM OBJETIVOS_GENERAL
            WHERE  EMPNIT='${sucursal}' AND MES=${mes} AND ANIO=${anio};
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






module.exports = router;
