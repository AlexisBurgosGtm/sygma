const execute = require('../connection');
const express = require('express');
const router = express.Router();


router.post("/ordenes_pendientes", async(req,res)=>{
   
    const { token, sucursal } = req.body;

    let qry = `
        SELECT  ORDENES_SOPORTE.NOORDEN, 
                ORDENES_SOPORTE.FECHA, 
                CLIENTES.NOMBRECLIENTE AS NOMCLIE, 
                CLIENTES.TELEFONOCLIENTE AS TELCLIE, 
                ORDENES_SOPORTE.CONTACTO, 
                EQUIPOS.CODEQUIPO,
                EQUIPOS.DESCRIPCION, 
                EQUIPOS.MARCA, 
                EQUIPOS.MODELO, 
                ORDENES_SOPORTE.ESTADO_EQUIPO AS ESTADO, 
                ORDENES_SOPORTE.DESCRIPCION_FALLA AS FALLA, 
                ORDENES_SOPORTE.ACCESORIOS, 
                ORDENES_SOPORTE.CLAVE, 
                ORDENES_SOPORTE.PATRON, 
                ORDENES_SOPORTE.FECHA_ENTREGA, 
                ORDENES_SOPORTE.STATUS, 
                ORDENES_SOPORTE.NOTAS_FINALES, 
                ORDENES_SOPORTE.COBRO_INSUMOS, 
                ORDENES_SOPORTE.COBRO_MANO_OBRA
        FROM ORDENES_SOPORTE LEFT OUTER JOIN
                EQUIPOS ON ORDENES_SOPORTE.EMPNIT = EQUIPOS.EMPNIT AND ORDENES_SOPORTE.CODEQUIPO = EQUIPOS.CODEQUIPO LEFT OUTER JOIN
                CLIENTES ON ORDENES_SOPORTE.EMPNIT = CLIENTES.EMPNIT AND ORDENES_SOPORTE.CODCLIENTE = CLIENTES.CODCLIENTE
        WHERE (ORDENES_SOPORTE.STATUS <> 'FINALIZADO') 
                AND (ORDENES_SOPORTE.EMPNIT = '${sucursal}');`;
    

    execute.QueryToken(res,qry,token);
     
});


router.post("/insert_orden", async(req,res)=>{
   
    const { token, sucursal, fecha, codcliente, contacto, codequipo, estado, falla, accesorios, clave, patron, fecha_entrega } = req.body;

    let qry = `
    INSERT INTO ORDENES_SOPORTE
        (EMPNIT,FECHA,CODCLIENTE,CONTACTO,CODEQUIPO,ESTADO_EQUIPO,DESCRIPCION_FALLA,
            ACCESORIOS,CLAVE,PATRON,FECHA_ENTREGA,STATUS,COBRO_INSUMOS,
            COBRO_MANO_OBRA)
    SELECT '${sucursal}' AS EMPNIT,'${fecha}' AS FECHA,${codcliente} AS CODCLIENTE,
        '${contacto}' AS CONTACTO,${codequipo} AS CODEQUIPO,
        '${estado}' AS ESTADO_EQUIPO,'${falla}' AS DESCRIPCION_FALLA,
        '${accesorios}' AS ACCESORIOS,
        '${clave}' AS CLAVE,'${patron}' AS PATRON,
        '${fecha_entrega}' AS FECHA_ENTREGA,
        'PENDIENTE' AS STATUS,
        0 AS COBRO_INSUMOS,0 AS COBRO_MANO_OBRA;
    SELECT IDENT_CURRENT('ORDENES_SOPORTE');     
    `;
    

    
    execute.QueryToken(res,qry,token);
     
});



router.post("/start_orden", async(req,res)=>{
   
    const { token, sucursal, noorden } = req.body;

    let qry = `UPDATE ORDENES_SOPORTE 
                    SET STATUS='PROCESO',
                    NOTAS_FINALES='',
                    COBRO_INSUMOS=0,
                    COBRO_MANO_OBRA=0
                WHERE EMPNIT='${sucursal}' AND NOORDEN=${noorden}`;
    
    
    execute.QueryToken(res,qry,token);
     
});

router.post("/delete_orden", async(req,res)=>{
   
    const { token, sucursal, noorden} = req.body;

    let qry = `DELETE FROM ORDENES_SOPORTE 
            WHERE EMPNIT='${sucursal}' AND NOORDEN=${noorden}`;
    
    
    execute.QueryToken(res,qry,token);
     
});

router.post("/finalizar_orden", async(req,res)=>{
   
    const { token, sucursal, noorden, cobro, insumos, diagnostico, fechafin } = req.body;

    let qry = `UPDATE ORDENES_SOPORTE 
                    SET NOTAS_FINALES='${diagnostico}',
                        STATUS='FINALIZADO',
                        COBRO_INSUMOS=${cobro},
                        COBRO_MANO_OBRA=${insumos},
                        FECHA_FINALIZADO='${fechafin}' 
                WHERE EMPNIT='${sucursal}' AND NOORDEN=${noorden}`;
    

    
    execute.QueryToken(res,qry,token);
     
});



router.post("/ordenes_finalizadas", async(req,res)=>{
   
    const { token, sucursal, mes, anio } = req.body;

    let qry = `
        SELECT  ORDENES_SOPORTE.NOORDEN, 
                ORDENES_SOPORTE.FECHA, 
                CLIENTES.NOMBRECLIENTE AS NOMCLIE, 
                CLIENTES.TELEFONOCLIENTE AS TELCLIE, 
                ORDENES_SOPORTE.CONTACTO, 
                EQUIPOS.CODEQUIPO,
                EQUIPOS.DESCRIPCION, 
                EQUIPOS.MARCA, 
                EQUIPOS.MODELO, 
                ORDENES_SOPORTE.ESTADO_EQUIPO AS ESTADO, 
                ORDENES_SOPORTE.DESCRIPCION_FALLA AS FALLA, 
                ORDENES_SOPORTE.ACCESORIOS, 
                ORDENES_SOPORTE.CLAVE, 
                ORDENES_SOPORTE.PATRON, 
                ORDENES_SOPORTE.FECHA_ENTREGA,
                ORDENES_SOPORTE.FECHA_FINALIZADO, 
                ORDENES_SOPORTE.STATUS, 
                ORDENES_SOPORTE.NOTAS_FINALES AS DIAGNOSTICO, 
                ORDENES_SOPORTE.COBRO_INSUMOS AS INSUMOS, 
                ORDENES_SOPORTE.COBRO_MANO_OBRA AS COBRO
        FROM ORDENES_SOPORTE LEFT OUTER JOIN
                EQUIPOS ON ORDENES_SOPORTE.EMPNIT = EQUIPOS.EMPNIT AND ORDENES_SOPORTE.CODEQUIPO = EQUIPOS.CODEQUIPO LEFT OUTER JOIN
                CLIENTES ON ORDENES_SOPORTE.EMPNIT = CLIENTES.EMPNIT AND ORDENES_SOPORTE.CODCLIENTE = CLIENTES.CODCLIENTE
        WHERE (ORDENES_SOPORTE.STATUS='FINALIZADO') 
                AND (ORDENES_SOPORTE.EMPNIT = '${sucursal}')
                AND (MONTH(ORDENES_SOPORTE.FECHA)=${mes})
                AND (YEAR(ORDENES_SOPORTE.FECHA)=${anio});`;
    

    execute.QueryToken(res,qry,token);
     
});



module.exports = router;


