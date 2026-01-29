const execute = require('./../connection');
const express = require('express');
const router = express.Router();


router.post("/empleados_localizacion", async(req,res)=>{
   
    const { token, sucursal } = req.body;


    let qry = `
        SELECT NOMEMPLEADO AS EMPLEADO, 
            ISNULL(TELEFONO,'') AS TELEFONO, 
            ISNULL(LATITUD,0) AS LATITUD, ISNULL(LONGITUD,0) AS LONGITUD
        FROM EMPLEADOS WHERE EMPNIT='${sucursal}' AND CODPUESTO=3 AND LATITUD<>0;   
    `
    
    execute.QueryToken(res,qry,token); 
     
});
router.post("/empleados_login_ubicacion", async(req,res)=>{
   
    const { token, sucursal, codemp,lat,long,fecha,hora } = req.body;


    let qry = `
        INSERT INTO EMPLEADOS_LOCALIZACIONES
            (EMPNIT,CODEMP,FECHA,HORA,LATITUD,LONGITUD)
        SELECT '${sucursal}' AS EMPNIT, ${codemp} AS CODEMP,
            '${fecha}' AS FECHA, '${hora}' AS HORA,
            ${lat} AS LATITUD, ${long} AS LONGITUD; `
    
    execute.QueryToken(res,qry,token); 
     
});


router.post("/empleados_edit", async(req,res)=>{
   
    const { token, sucursal, codemp,codpuesto, nombre, direccion, telefono, clave,usuario,coddoc_env, coddoc_cot } = req.body;

    let qry = `
        UPDATE EMPLEADOS SET
            CODPUESTO=${codpuesto},
            NOMEMPLEADO='${nombre}',
            DIRECCION='${direccion}',
            TELEFONO='${telefono}',
            CLAVE='${clave}',
            USUARIO='${usuario}',
            CODDOC_ENV='${coddoc_env}',
            CODDOC_COT='${coddoc_cot}'
        WHERE EMPNIT='${sucursal}' 
            AND CODEMPLEADO=${codemp};
            `
    
    execute.QueryToken(res,qry,token); 
     
});


router.post("/empleados_insert", async(req,res)=>{
   
    const { token, sucursal, codpuesto, nombre, direccion, telefono, clave,usuario,coddoc_env, coddoc_cot } = req.body;

    let qry = `
        INSERT INTO EMPLEADOS 
            (EMPNIT,CODPUESTO,NOMEMPLEADO,DPI,IGSS,DIRECCION,TELEFONO,CLAVE,ACTIVO,USUARIO,CODDOC_ENV,CODDOC_COT)
        SELECT '${sucursal}' AS EMPNIT, 
                ${codpuesto} AS CODPUESTO,
                '${nombre}' AS NOMEMPLEADO,
                '' AS DPI,'' AS IGSS,
                '${direccion}' AS DIRECCION,
                '${telefono}' AS TELEFONO,
                '${clave}' AS CLAVE,
                'SI' AS ACTIVO,
                '${usuario}' AS USUARIO,
                '${coddoc_env}' AS CODDOC_ENV,
                '${coddoc_cot}' AS CODDOC_COT;
            `
    
    execute.QueryToken(res,qry,token); 
     
});


router.post("/empleados_listado", async(req,res)=>{
   
    const { token, sucursal,st } = req.body;

    let qry = `
        SELECT EMPLEADOS.CODEMPLEADO, 
                EMPLEADOS.CODPUESTO, 
                EMPLEADOS_PUESTOS.NOMPUESTO, 
                EMPLEADOS.NOMEMPLEADO, 
                EMPLEADOS.DPI, 
                EMPLEADOS.IGSS, 
                EMPLEADOS.DIRECCION, 
                EMPLEADOS.TELEFONO, 
                EMPLEADOS.CLAVE, 
                EMPLEADOS.ACTIVO, 
                EMPLEADOS.USUARIO, 
                EMPLEADOS.CODDOC_ENV, 
                EMPLEADOS.CODDOC_COT
        FROM    EMPLEADOS LEFT OUTER JOIN
                EMPLEADOS_PUESTOS ON EMPLEADOS.CODPUESTO = EMPLEADOS_PUESTOS.CODPUESTO
        WHERE  (EMPLEADOS.EMPNIT = '${sucursal}') 
        AND (EMPLEADOS.ACTIVO='${st}')
        ORDER BY EMPLEADOS_PUESTOS.NOMPUESTO;
            `
    
    execute.QueryToken(res,qry,token); 
     
});

router.post("/empleados_update_st", async(req,res)=>{
   
    const { token, sucursal,codigo,st } = req.body;

    let qry = `
        UPDATE EMPLEADOS SET ACTIVO='${st}'
        WHERE EMPNIT='${sucursal}' 
        AND CODEMPLEADO=${codigo};
            `
    
    execute.QueryToken(res,qry,token); 
     
});

router.post("/empleados_delete", async(req,res)=>{
   
    const { token, sucursal,codigo } = req.body;

    let qry = `
        DELETE FROM EMPLEADOS
        WHERE EMPNIT='${sucursal}' 
        AND CODEMPLEADO=${codigo};
            `
    
    execute.QueryToken(res,qry,token); 
     
});




router.post("/empleados_login", async(req,res)=>{
   
    const { token, sucursal, u, p } = req.body;


    let BACKUP_qry = `SELECT CODEMPLEADO AS CODIGO, CODPUESTO AS NIVEL, 
        NOMEMPLEADO AS NOMBRE, 
        ISNULL(CODDOC_ENV,'') AS CODDOC_ENV,
        ISNULL(CODDOC_COT,'') AS CODDOC_COT
         FROM EMPLEADOS 
        WHERE EMPNIT='${sucursal}' AND USUARIO='${u}' AND CLAVE='${p}';`
    


    let qry = `SELECT EMPLEADOS.EMPNIT, EMPLEADOS.CODEMPLEADO AS CODIGO, EMPLEADOS.CODPUESTO AS NIVEL, EMPLEADOS.NOMEMPLEADO AS NOMBRE, ISNULL(EMPLEADOS.CODDOC_ENV, '') AS CODDOC_ENV, 
                  ISNULL(EMPLEADOS.CODDOC_COT, '') AS CODDOC_COT, EMPRESAS.NOMBRE AS EMPRESA
FROM     EMPLEADOS LEFT OUTER JOIN
                  EMPRESAS ON EMPLEADOS.EMPNIT = EMPRESAS.EMPNIT
WHERE  (EMPLEADOS.USUARIO = '${u}') AND (EMPLEADOS.CLAVE = '${p}')`
    
    execute.QueryToken(res,qry,token); 
     
});

router.post("/empleados_tipo", async(req,res)=>{
   
    const { token, sucursal, tipo } = req.body;

    let qry = '';

    switch (Number(tipo)) {
        case 300: //VENDEDOR, SUPERVISOR
            qry = `SELECT CODEMPLEADO, CODPUESTO, NOMEMPLEADO,
                        DIRECCION,CLAVE FROM EMPLEADOS 
                    WHERE EMPNIT LIKE '%${sucursal}%' AND CODPUESTO IN(2,3,8) AND ACTIVO='SI'
                    ORDER BY NOMEMPLEADO;`
          
            break;
        case 400: //VENDEDOR, SUPERVISOR, DIGITADOR, BODEGUERO
            qry = `SELECT EMPLEADOS.CODEMPLEADO, EMPLEADOS.CODPUESTO, EMPLEADOS.NOMEMPLEADO, EMPLEADOS.DIRECCION, EMPLEADOS.CLAVE, 
            EMPLEADOS_PUESTOS.NOMPUESTO AS PUESTO
                FROM  EMPLEADOS LEFT OUTER JOIN
                                EMPLEADOS_PUESTOS ON EMPLEADOS.CODPUESTO = EMPLEADOS_PUESTOS.CODPUESTO
                WHERE  (EMPLEADOS.EMPNIT LIKE '%${sucursal}%') AND (EMPLEADOS.CODPUESTO IN (2, 3, 4, 5, 8)) AND (EMPLEADOS.ACTIVO = 'SI')
                ORDER BY  EMPLEADOS_PUESTOS.NOMPUESTO,EMPLEADOS.NOMEMPLEADO;`

            break;
        default:
            qry = `SELECT CODEMPLEADO, CODPUESTO, NOMEMPLEADO,
                    DIRECCION,CLAVE FROM EMPLEADOS 
                    WHERE EMPNIT LIKE '%${sucursal}%' AND CODPUESTO=${tipo} AND ACTIVO='SI'
                    ORDER BY NOMEMPLEADO;`
  
        break;
    }

      
    execute.QueryToken(res,qry,token); 
     
});






module.exports = router;