const execute = require('./../connection');
const express = require('express');
const router = express.Router();


router.post("/config_generales", async(req,res)=>{

        const {token} = req.body;

        let qry = `
        SELECT ID, DESCRIPCION, VALOR, OBS FROM CONFIG 
        `
    
        execute.QueryToken(res,qry,token)

});

router.post("/update_valor", async(req,res)=>{

        const {token, id, valor} = req.body;
        const idNum = Number(id);
        if (!idNum) {
            res.send('error');
            return;
        }
        const v = String(valor || '').replace(/'/g, "''");
        let qry = `UPDATE CONFIG SET VALOR='${v}' WHERE ID=${idNum}`;
        execute.QueryToken(res,qry,token);

});





module.exports = router;
