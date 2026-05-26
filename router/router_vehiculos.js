const execute = require('./../connection');
const express = require('express');
const router = express.Router();



router.post("/listado_vehiculos_todos", async(req,res)=>{

    const {token} = req.body;

    let qry = `
        SELECT
            EMPNIT, 
            CODVEHICULO, 
            DESVEHICULO, 
            PLACA, 
            CHASIS,
            MOTOR, 
            KMS_INICIAL, 
            KMS_ACTUAL,
            KMS_FECHA,
            ULTIMO_SERVICIO
        FROM VEHICULOS
        `     
  
    execute.QueryToken(res,qry,token)

});


router.post("/listado_vehiculos", async(req,res)=>{

    const {token,sucursal} = req.body;

    let qry = `
        SELECT
            EMPNIT, 
            CODVEHICULO, 
            DESVEHICULO, 
            PLACA, 
            CHASIS,
            MOTOR, 
            KMS_INICIAL, 
            KMS_ACTUAL,
            KMS_FECHA,
            ULTIMO_SERVICIO
        FROM VEHICULOS
        WHERE EMPNIT = '${sucursal}'
        `     
  
    execute.QueryToken(res,qry,token)

});


router.post("/insert_vehiculo", async(req,res)=>{

    const {token,sucursal,desvehiculo,placa,chasis,motor,kms_inicial,kms_actual,kms_fecha,ultimo_servicio} = req.body;

    let qry = `
            INSERT INTO VEHICULOS (EMPNIT,DESVEHICULO, PLACA, CHASIS, MOTOR, KMS_INICIAL, KMS_ACTUAL, KMS_FECHA, ULTIMO_SERVICIO)
        SELECT 
            '${sucursal}' AS EMPNIT,
            '${desvehiculo}' AS DESVEHICULO, 
            '${placa}' AS PLACA, 
            '${chasis}' AS CHASIS,
            '${motor}' AS MOTOR, 
            ${kms_inicial} AS KMS_INICIAL, 
            ${kms_actual} AS KMS_ACTUAL,
            '${kms_fecha}' AS KMS_FECHA,
            '${ultimo_servicio}' AS ULTIMO_SERVICIO;
        `     
  
    execute.QueryToken(res,qry,token)

});


router.post("/delete_vehiculo", async(req,res)=>{

    const {token,codvehiculo} = req.body;

    let qry = `
        DELETE FROM VEHICULOS WHERE CODVEHICULO = ${codvehiculo};
        `     
  
    execute.QueryToken(res,qry,token)

});



module.exports = router;

