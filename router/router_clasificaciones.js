const execute = require('../connection');
const express = require('express');
const router = express.Router();



router.post("/listado", async(req,res)=>{
   
    const { token, sucursal, tipo} = req.body;

    let qry = `
        SELECT CODIGO, DESCRIPCION FROM CLASIFICACIONES_GENERALES WHERE TIPO='${tipo}';
        ` 

    execute.QueryToken(res,qry,token);
     
});


router.post("/insert_clasificacion", async(req,res)=>{
   
    const { token, sucursal, tipo, descripcion} = req.body;

    let qry = `
        INSERT INTO CLASIFICACIONES_GENERALES (TIPO, DESCRIPCION) VALUES ('${tipo}','${descripcion}');
        ` 

    execute.QueryToken(res,qry,token);
     
});


router.post("/edit_clasificacion", async(req,res)=>{
   
    const { token, sucursal, codigo, descripcion} = req.body;

    let qry = `
        UPDATE CLASIFICACIONES_GENERALES SET DESCRIPCION='${descripcion}'
        WHERE CODIGO=${codigo};
        ` 

    execute.QueryToken(res,qry,token);
     
});


router.post("/delete_clasificacion", async(req,res)=>{
   
    const { token, sucursal, codigo} = req.body;

    let qry = `
        DELETE FROM CLASIFICACIONES_GENERALES WHERE CODIGO=${codigo};
        ` 

    execute.QueryToken(res,qry,token);
     
});




module.exports = router;

