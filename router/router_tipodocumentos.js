const execute = require('./../connection');
const express = require('express');
const router = express.Router();

router.post("/verify_movimientos", async(req,res)=>{
   
    const { token, sucursal, coddoc} = req.body;


    let qry = ``
    qry = `SELECT TOP 10 CODDOC FROM DOCUMENTOS
            WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}'
                `
   

    execute.QueryToken(res,qry,token);
     
});

router.post("/delete_tipodocumento", async(req,res)=>{
   
    const { token, sucursal, coddoc} = req.body;


    let qry = ``
    qry = `DELETE FROM TIPODOCUMENTOS
            WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}'
                `
   

    execute.QueryToken(res,qry,token);
     
});

router.post("/edit_tipodocumento", async(req,res)=>{
   
    const { token, sucursal, coddoc, correlativo, descripcion, fcontacon, fcontacre } = req.body;


    let qry = ``
    qry = `UPDATE TIPODOCUMENTOS
                SET DESCRIPCION='${descripcion}',
                    CORRELATIVO=${correlativo},
                    CONTA_CON='${fcontacon}',
                    CONTA_CRE='${fcontacre}'
                WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}'
                `
   

    execute.QueryToken(res,qry,token);
     
});


router.post("/insert_tipodocumento", async(req,res)=>{
   
    const { token, sucursal, tipodoc, coddoc, correlativo, descripcion, fcontacon, fcontacre } = req.body;


    let qry = ``
    qry = `INSERT INTO TIPODOCUMENTOS 
                (EMPNIT, TIPODOC, DESCRIPCION, CODDOC, CORRELATIVO, HABILITADO, CONTA_CON, CONTA_CRE)
            SELECT '${sucursal}' AS EMPNIT, '${tipodoc}' AS TIPODOC, '${descripcion}' AS DESCRIPCION, 
                '${coddoc}' AS CODDOC, ${correlativo} AS CORRELATIVO, 'SI' AS HABILITADO, 
                '${fcontacon}' AS CONTA_CON, '${fcontacre}' AS CONTA_CRE; `
   

    execute.QueryToken(res,qry,token);
     
});


router.post("/listado_tipos", async(req,res)=>{
   
    const { token } = req.body;


    let qry = ``
    qry = `SELECT TIPODOC, DESCRIPCION, INV 
            FROM CONFIG_TIPODOCUMENTOS`
   

    execute.QueryToken(res,qry,token);
     
});


router.post("/listado_general", async(req,res)=>{
   
    const { token, sucursal } = req.body;


    let qry = ``
    qry = `SELECT ID, TIPODOC, DESCRIPCION, CODDOC, CORRELATIVO, FORMATO, HABILITADO, CONTA_CON, CONTA_CRE
            FROM TIPODOCUMENTOS 
            WHERE EMPNIT='${sucursal}'
            ORDER BY TIPODOC, CODDOC;`
   

    execute.QueryToken(res,qry,token);
     
});

router.post("/update_status", async(req,res)=>{
   
    const { token, sucursal, coddoc,status } = req.body;


    let qry = ``
    qry = `UPDATE TIPODOCUMENTOS
            SET HABILITADO='${status}' 
            WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}';`
   

    execute.QueryToken(res,qry,token);
     
});

router.post("/coddoc", async(req,res)=>{
   
    const { token, sucursal, tipo } = req.body;


    let qry = ``
    
    switch (tipo.toString()) {
        case 'FAC':
            qry = `SELECT CODDOC FROM TIPODOCUMENTOS WHERE EMPNIT='${sucursal}' AND TIPODOC='FAC' AND HABILITADO='SI';`
            break;
        case 'FEL':
            qry = `SELECT CODDOC FROM TIPODOCUMENTOS WHERE EMPNIT='${sucursal}' AND TIPODOC IN('FEF','FEC') AND HABILITADO='SI';`
            break;

        default:
            qry = `SELECT CODDOC FROM TIPODOCUMENTOS WHERE EMPNIT='${sucursal}' AND TIPODOC='${tipo}' AND HABILITADO='SI';`
            break;
    }


    execute.QueryToken(res,qry,token);
     
});


router.post("/correlativo", async(req,res)=>{
   
    const { token, sucursal, coddoc } = req.body;


    let qry = ``
    
    qry = `SELECT CORRELATIVO FROM TIPODOCUMENTOS 
        WHERE    
        EMPNIT='${sucursal}' AND CODDOC='${coddoc}';`
    
    execute.QueryToken(res,qry,token);
     
});





module.exports = router;