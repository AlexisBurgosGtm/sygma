const execute = require('../connection');
const express = require('express');
const router = express.Router();



router.post("/insert", async(req,res)=>{
   
    const { token, sucursal, descripcion, marca, modelo, creado } = req.body;   

    let qry = `
    INSERT INTO EQUIPOS
    (EMPNIT,DESCRIPCION,MARCA,MODELO,CREADO)
        VALUES
    ('${sucursal}','${descripcion}','${marca}','${modelo}','${creado}');
    `
    execute.QueryToken(res,qry,token);
     
});



router.post("/listado", async(req,res)=>{
   
    const { token, sucursal } = req.body;

    let qry = `
        SELECT CODEQUIPO,DESCRIPCION,MARCA,MODELO,CREADO 
        FROM EQUIPOS
        WHERE EMPNIT='${sucursal}';
    `;
    

    execute.QueryToken(res,qry,token);
     
});


router.post("/delete", async(req,res)=>{
   
    const { token, sucursal, codequipo } = req.body;

    let qry = `DELETE FROM EQUIPOS WHERE CODEQUIPO=${codequipo} AND EMPNIT='${sucursal}';`;
    
    execute.QueryToken(res,qry,token);
     
});


module.exports = router;


