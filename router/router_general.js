const execute = require('./../connection');
const express = require('express');
const router = express.Router();


router.post("/login", async(req,res)=>{
   
    const { u,p,TOKEN } = req.body;

    let qry = `
        SELECT 
            USUARIO, 
            'LOCAL' AS TOKEN, 
            NIVEL
        FROM USUARIOS
        WHERE (USUARIO = '${u}') 
            AND (WEBPASS = '${p}')`
    
    execute.QueryToken(res,qry,TOKEN);
     
});


router.post("/empresas", async(req,res)=>{
   
    const { TOKEN} = req.body;

    let qry = `
        SELECT 
            EMPNIT,NOMBRE,CODTIPOEMPRESA,TIPO_PRECIO,OBJETIVO_VENTAS,OBJETIVO_RENTABILIDAD 
        FROM EMPRESAS
         `
         //   WHERE NOSUCURSAL='SI';
    
    execute.QueryToken(res,qry,TOKEN);
     
});





module.exports = router;