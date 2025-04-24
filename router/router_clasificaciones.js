const execute = require('../connection');
const express = require('express');
const router = express.Router();



router.post("/listado", async(req,res)=>{
   
    const { token, sucursal, tipo} = req.body;

    let qry = '';

    switch (tipo) {
        case 'MARCA':
            qry = `
            SELECT 
                CODMARCA AS CODIGO, 
                DESMARCA AS DESCRIPCION, 
                PORCENTAJE, 
                ISNULL(OBJETIVO,0) AS OBJETIVO 
            FROM MARCAS;
            ` 
                
            break;
    
        default:
            qry = `
            SELECT 
                CODIGO, 
                DESCRIPCION, 
                0 AS OBJETIVO 
            FROM 
                CLASIFICACIONES_GENERALES WHERE TIPO='${tipo}';
            ` 
    
            break;
    }
    
    console.log(qry);
    
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



router.post("/insert_marca", async(req,res)=>{
   
    const {token,sucursal,descripcion,objetivo} = req.body;

   
    let qry = `
    INSERT INTO MARCAS (DESMARCA,PORCENTAJE,OBJETIVO) VALUES ('${descripcion}',0,${objetivo});
    `

    execute.QueryToken(res,qry,token);
     
});

router.post("/edit_marca", async(req,res)=>{
   
    const {token,sucursal,codigo,descripcion,objetivo} = req.body;

   
        let qry = `
        UPDATE MARCAS SET 
            DESMARCA='${descripcion}',
            OBJETIVO=${objetivo}
        WHERE CODMARCA=${codigo};
        `

    execute.QueryToken(res,qry,token);
     
});

router.post("/delete_marca", async(req,res)=>{
   
    const { token, sucursal, codigo} = req.body;

    let qry = `
        DELETE FROM MARCAS WHERE CODMARCA=${codigo};
        ` 

    execute.QueryToken(res,qry,token);
     
});




module.exports = router;

