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
                ISNULL(OBJETIVO,0) AS OBJETIVO,
                0 AS CODMARCA,
                '' AS DESMARCA 
            FROM MARCAS;
            ` 
                
            break;
    
        default:
            qry = `
           SELECT 
                CLASIFICACIONES_GENERALES.CODIGO, 
                CLASIFICACIONES_GENERALES.DESCRIPCION, 
                0 AS OBJETIVO, 
                isnull(CLASIFICACIONES_GENERALES.CODMARCA,0) AS CODMARCA, 
                ISNULL(MARCAS.DESMARCA,'') AS DESMARCA
            FROM CLASIFICACIONES_GENERALES LEFT OUTER JOIN
                MARCAS ON CLASIFICACIONES_GENERALES.CODMARCA = MARCAS.CODMARCA 
            WHERE CLASIFICACIONES_GENERALES.TIPO='${tipo}';
            ` 
    
            break;
    }
    
    console.log(qry);
    
    execute.QueryToken(res,qry,token);
     
});


router.post("/insert_clasificacion", async(req,res)=>{
   
        const { token, sucursal, tipo, descripcion,codmarca} = req.body;

        let qry = `
            INSERT INTO CLASIFICACIONES_GENERALES (TIPO, DESCRIPCION,CODMARCA) VALUES ('${tipo}','${descripcion}',${codmarca});
            ` 

        execute.QueryToken(res,qry,token);
     
});


router.post("/edit_clasificacion", async(req,res)=>{
   
    const { token, sucursal, codigo, descripcion,codmarca} = req.body;

    let qry = `
        UPDATE 
            CLASIFICACIONES_GENERALES 
        SET 
            DESCRIPCION='${descripcion}',
            CODMARCA=${codmarca}
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

