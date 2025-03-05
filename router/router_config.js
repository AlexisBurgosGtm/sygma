const execute = require('./../connection');
const express = require('express');
const router = express.Router();


router.post("/config_generales", async(req,res)=>{

        const {token} = req.body;

        let qry = `
        SELECT ID, DESCRIPCION, VALOR FROM CONFIG 
        `
    
        execute.QueryToken(res,qry,token)

});





module.exports = router;
