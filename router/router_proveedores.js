const execute = require('../connection');
const express = require('express');
const router = express.Router();



router.post("/buscar_proveedor", async(req,res)=>{
   
    const { token, sucursal, filtro} = req.body;

    let qry = `
        SELECT CODPROV AS CODCLIENTE, NIT, EMPRESA AS NOMBRE, RAZONSOCIAL, DIRECCION, TELEMPRESA AS TELEFONO, SALDO, TIPO_ORD_EXT AS TIPO
        FROM PROVEEDORES
        WHERE (EMPRESA LIKE '%${filtro}%') OR (NIT='${filtro}')
    `
    
 

    execute.QueryToken(res,qry,token);
     
});


router.post("/buscar_proveedor_nit", async(req,res)=>{
   
    const { token, sucursal, nit} = req.body;

    let qry = `
        SELECT CODPROV AS CODCLIENTE, NIT, EMPRESA AS NOMBRE, RAZONSOCIAL, DIRECCION, TELEMPRESA AS TELEFONO, SALDO, TIPO_ORD_EXT AS TIPO
        FROM PROVEEDORES
        WHERE NIT='${nit}'
    `
    
 

    execute.QueryToken(res,qry,token);
     
});










module.exports = router;
