const execute = require('../connection');
const express = require('express');
const router = express.Router();


router.post("/historial_cliente", async(req,res)=>{
   
    const { token, sucursal , codclie, fi, ff} = req.body;

    let qry = `
        SELECT 
            DOCUMENTOS.EMPNIT, 
            DOCUMENTOS.FECHA, 
            DOCUMENTOS.CODDOC, 
            DOCUMENTOS.CORRELATIVO, 
            DOCPRODUCTOS.CODPROD, 
            DOCPRODUCTOS.DESPROD, 
            DOCPRODUCTOS.CODMEDIDA, 
            DOCPRODUCTOS.CANTIDAD, 
            DOCPRODUCTOS.PRECIO, 
            DOCPRODUCTOS.TOTALPRECIO
        FROM  DOCUMENTOS LEFT OUTER JOIN
            DOCPRODUCTOS ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO AND DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT
        WHERE  
            (DOCUMENTOS.EMPNIT = '${sucursal}') AND 
            (DOCUMENTOS.STATUS <> 'A') AND 
            (DOCUMENTOS.FECHA BETWEEN '${fi}' AND '${ff}') AND 
            (DOCUMENTOS.CODCLIENTE = ${codclie})
    `;
    

    execute.QueryToken(res,qry,token);
     
});
router.post("/historial_cliente_mes", async(req,res)=>{
   
    const { token, sucursal , codclie, mes, anio} = req.body;

    let qry = `
        SELECT 
            DOCUMENTOS.EMPNIT, 
            DOCUMENTOS.FECHA, 
            DOCUMENTOS.CODDOC, 
            DOCUMENTOS.CORRELATIVO, 
            DOCPRODUCTOS.CODPROD, 
            DOCPRODUCTOS.DESPROD, 
            DOCPRODUCTOS.CODMEDIDA, 
            DOCPRODUCTOS.CANTIDAD, 
            DOCPRODUCTOS.PRECIO, 
            DOCPRODUCTOS.TOTALPRECIO
        FROM  DOCUMENTOS LEFT OUTER JOIN
            DOCPRODUCTOS ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO AND 
            DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND 
            DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT
        WHERE  
            (DOCUMENTOS.EMPNIT = '${sucursal}') AND 
            (DOCUMENTOS.STATUS <> 'A') AND 
            (DOCUMENTOS.MES = ${mes}) AND
            (DOCUMENTOS.ANIO = ${anio}) AND 
            (DOCUMENTOS.CODCLIENTE = ${codclie})
    `;
    

    execute.QueryToken(res,qry,token);
     
});



router.post("/listado_clientes_visitados", async(req,res)=>{
   
    const { token, sucursal , codemp, fi, ff} = req.body;

    let qry = `
       SELECT CLIENTES_VISITAS.ID, 
                CLIENTES_VISITAS.EMPNIT, 
                EMPRESAS.NOMBRE AS EMPRESA, CLIENTES_VISITAS.CODEMP, EMPLEADOS.NOMEMPLEADO AS EMPLEADO, CLIENTES_VISITAS.CODCLIENTE, CLIENTES.TIPONEGOCIO, 
                  CLIENTES.NEGOCIO, CLIENTES.NOMBRE AS CLIENTE, 
				  ISNULL(CLIENTES.DIRECCION,'CIUDAD') AS DIRECCION, 
				  ISNULL(CLIENTES.REFERENCIA,'') AS REFERENCIA, 
				  MUNICIPIOS.DESMUN, 
				  DEPARTAMENTOS.DESDEPTO, 
				  CLIENTES.TELEFONO, 
				  CLIENTES_VISITAS.FECHA, 
                  CLIENTES_VISITAS.HORA, CLIENTES_VISITAS.MOTIVO, 
                  CLIENTES_VISITAS.LATITUD, CLIENTES_VISITAS.LONGITUD,
                   CLIENTES.LATITUD AS CLIENTE_LATITUD, CLIENTES.LONGITUD AS CLIENTE_LONGITUD
        FROM     DEPARTAMENTOS RIGHT OUTER JOIN
                  CLIENTES ON DEPARTAMENTOS.CODDEPTO = CLIENTES.CODDEPTO LEFT OUTER JOIN
                  MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN RIGHT OUTER JOIN
                  CLIENTES_VISITAS LEFT OUTER JOIN
                  EMPLEADOS ON CLIENTES_VISITAS.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
                  EMPRESAS ON CLIENTES_VISITAS.EMPNIT = EMPRESAS.EMPNIT ON CLIENTES.CODCLIENTE = CLIENTES_VISITAS.CODCLIENTE
        WHERE  (CLIENTES_VISITAS.EMPNIT LIKE '%${sucursal}%') AND 
                (CLIENTES_VISITAS.FECHA BETWEEN '${fi}' AND '${ff}') AND
                (CLIENTES_VISITAS.CODEMP=${codemp})
    `;
    

    execute.QueryToken(res,qry,token);
     
});




router.post("/select_rutas", async(req,res)=>{
   
    const { token, sucursal} = req.body;

    let qry = `
          SELECT RUTAS_CLIENTES.CODRUTA, RUTAS_CLIENTES.DESRUTA AS RUTA, RUTAS_CLIENTES.CODEMP, EMPLEADOS.NOMEMPLEADO AS EMPLEADO
            FROM  RUTAS_CLIENTES LEFT OUTER JOIN
                    EMPLEADOS ON RUTAS_CLIENTES.CODEMP = EMPLEADOS.CODEMPLEADO
            WHERE (RUTAS_CLIENTES.EMPNIT = '${sucursal}');  `

    execute.QueryToken(res,qry,token);
     
});



router.post("/insert_ruta", async(req,res)=>{
   
    const { token, sucursal, codigo, descripcion, codemp} = req.body;

    let qry = '';

        qry = `
           INSERT INTO RUTAS_CLIENTES
            (EMPNIT,CODRUTA,DESRUTA,CODEMP)
            SELECT '${sucursal}' AS EMPNIT, ${codigo} AS CODRUTA, '${descripcion}' AS DESRUTA, ${codemp} AS CODEMP;
        `

    execute.QueryToken(res,qry,token);
     
});





router.post("/lista_clientes_general", async(req,res)=>{
   
    const { token, sucursal, st} = req.body;

    let qry = '';
    qry = `
        SELECT 
                CLIENTES.CODEMPLEADO,
                CLIENTES.CODCLIENTE, 
                CLIENTES.NIT, 
                CLIENTES.NOMBRE, 
                CLIENTES.TIPONEGOCIO, 
                CLIENTES.NEGOCIO,
                CLIENTES.CATEGORIA,
                CLIENTES.DIRECCION, 
                CLIENTES.CODMUN, 
                MUNICIPIOS.DESMUN, 
                CLIENTES.CODDEPTO, 
                DEPARTAMENTOS.DESDEPTO,
                CLIENTES.CODSECTOR, 
                SECTORES.DESSECTOR, 
                CLIENTES.TELEFONO, 
                CLIENTES.LATITUD, CLIENTES.LONGITUD, 
                CLIENTES.SALDO, CLIENTES.HABILITADO, 
                CLIENTES.LASTSALE, CLIENTES.DIASCREDITO, 
                CLIENTES.REFERENCIA, EMPLEADOS.NOMEMPLEADO,
                CLIENTES.DIAVISITA AS VISITA
        FROM CLIENTES LEFT OUTER JOIN
               EMPLEADOS ON CLIENTES.CODEMPLEADO = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
               SECTORES ON CLIENTES.CODSECTOR = SECTORES.CODSECTOR LEFT OUTER JOIN
               DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
               MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
        WHERE (CLIENTES.EMPNIT = '${sucursal}')       
         AND (CLIENTES.HABILITADO='${st}')
        `



    execute.QueryToken(res,qry,token);
     
});
router.post("/lista_clientes_general_export", async(req,res)=>{
   
    const { token, sucursal, st} = req.body;

    let qry = '';

        qry = `
        SELECT 
                EMPLEADOS.NOMEMPLEADO AS EMPLEADO,
                CLIENTES.DIAVISITA AS VISITA,
                CLIENTES.CODCLIENTE, 
                CLIENTES.NIT, 
                CLIENTES.TIPONEGOCIO, 
                CLIENTES.NEGOCIO,
                CLIENTES.NOMBRE AS CLIENTE, 
                CLIENTES.DIRECCION,  
                MUNICIPIOS.DESMUN AS MUNICPIO,  
                DEPARTAMENTOS.DESDEPTO AS DEPARTAMENTO, 
                SECTORES.DESSECTOR AS SECTOR, 
                CLIENTES.TELEFONO, 
                CLIENTES.LATITUD, 
                CLIENTES.LONGITUD, 
                CLIENTES.REFERENCIA
        FROM CLIENTES LEFT OUTER JOIN
               EMPLEADOS ON CLIENTES.CODEMPLEADO = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
               SECTORES ON CLIENTES.CODSECTOR = SECTORES.CODSECTOR LEFT OUTER JOIN
               DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
               MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
        WHERE (CLIENTES.EMPNIT = '${sucursal}')       
         AND (CLIENTES.HABILITADO='${st}')
        `

 


    execute.QueryToken(res,qry,token);
     
});


router.post("/update_status_cliente", async(req,res)=>{
   
    const { token, sucursal, codclie, st} = req.body;

    let qry = '';


        qry = `
            UPDATE CLIENTES SET 
                HABILITADO='${st}'
            WHERE CODCLIENTE=${codclie} AND EMPNIT='${sucursal}'
        
        `

 


    execute.QueryToken(res,qry,token);
     
});



router.post("/censo_lista_clientes", async(req,res)=>{
   
    const { token, sucursal,visita, codven} = req.body;

    let qry = '';


    if(visita=='TODOS'){
        qry = `
        SELECT CLIENTES.EMPNIT,CLIENTES.CODCLIENTE, CLIENTES.NIT, 
        CLIENTES.NOMBRE, 
        CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO,
        CLIENTES.CATEGORIA,
        CLIENTES.DIRECCION, 
        CLIENTES.CODMUN, MUNICIPIOS.DESMUN, 
        CLIENTES.CODDEPTO, DEPARTAMENTOS.DESDEPTO, 
        SECTORES.DESSECTOR, CLIENTES.TELEFONO, 
               CLIENTES.LATITUD, CLIENTES.LONGITUD, 
               CLIENTES.SALDO, CLIENTES.HABILITADO, 
               CLIENTES.LASTSALE, CLIENTES.DIASCREDITO, 
               CLIENTES.REFERENCIA, EMPLEADOS.NOMEMPLEADO,
               CLIENTES.DIAVISITA AS VISITA
         FROM     CLIENTES LEFT OUTER JOIN
               EMPLEADOS ON CLIENTES.CODEMPLEADO = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
               SECTORES ON CLIENTES.CODSECTOR = SECTORES.CODSECTOR LEFT OUTER JOIN
               DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
               MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
         WHERE (CLIENTES.EMPNIT = '${sucursal}')        
         AND (CLIENTES.CODEMPLEADO = ${codven})
         AND (CLIENTES.HABILITADO='NA')
        `

    }else{
        qry = `
        SELECT CLIENTES.EMPNIT,CLIENTES.CODCLIENTE, CLIENTES.NIT, 
        CLIENTES.NOMBRE, 
        CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO,
        CLIENTES.CATEGORIA,
        CLIENTES.DIRECCION, 
        CLIENTES.CODMUN, MUNICIPIOS.DESMUN, 
        CLIENTES.CODDEPTO, DEPARTAMENTOS.DESDEPTO, 
        SECTORES.DESSECTOR, CLIENTES.TELEFONO, 
               CLIENTES.LATITUD, CLIENTES.LONGITUD, 
               CLIENTES.SALDO, CLIENTES.HABILITADO, 
               CLIENTES.LASTSALE, CLIENTES.DIASCREDITO, 
               CLIENTES.REFERENCIA, EMPLEADOS.NOMEMPLEADO,
               CLIENTES.DIAVISITA AS VISITA
         FROM     CLIENTES LEFT OUTER JOIN
               EMPLEADOS ON CLIENTES.CODEMPLEADO = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
               SECTORES ON CLIENTES.CODSECTOR = SECTORES.CODSECTOR LEFT OUTER JOIN
               DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
               MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
         WHERE (CLIENTES.EMPNIT = '${sucursal}')  
         AND (CLIENTES.DIAVISITA = '${visita}') 
         AND (CLIENTES.CODEMPLEADO = ${codven})
         AND (CLIENTES.HABILITADO='NA')
        `

    }


 


    execute.QueryToken(res,qry,token);
     
});




router.post("/censo_insert", async(req,res)=>{

    const{sucursal,codven,fecha,nitclie,tiponegocio,negocio,categoria,nomclie,dirclie,codmun,coddepto,referencia,obs,telefono,visita,lat,long,sector} = req.body;

    let qry = `
        INSERT INTO CLIENTES (EMPNIT,CODEMPLEADO,DIAVISITA,DPI,NIT,TIPONEGOCIO,NEGOCIO,NOMBRE,DIRECCION,REFERENCIA,CODMUN,CODDEPTO,CODSECTOR,TELEFONO,
                    EMAIL,FECHANACIMIENTO,LATITUD,LONGITUD,CATEGORIA,CODRUTA,SALDO,FECHAINICIO,HABILITADO,LIMITECREDITO,DIASCREDITO,LASTSALE)
        SELECT '${sucursal}' AS EMPNIT,${codven} AS CODEMPLEADO,'${visita}' AS DIAVISITA,
                '' AS DPI, '${nitclie}' AS NIT, '${tiponegocio}' AS TIPONEGOCIO, '${negocio}' AS NEGOCIO, '${nomclie}' AS NOMBRE,'${dirclie}' AS DIRECCION,
                '${referencia}' AS REFERENCIA, ${codmun} AS CODMUN, ${coddepto} AS CODDEPTO, ${sector} AS CODSECTOR,
                '${telefono}' AS TELEFONO, '' AS EMAIL, '${fecha}' AS FECHANACIMIENTO,
                '${lat}' AS LATITUD, '${long}' AS LONGITUD, '${categoria}' AS CATEGORIA, 0 AS CODRUTA, 0 AS SALDO,
                '${fecha}' AS FECHAINICIO, 'NA' AS HABILITADO, 0 AS LIMITECREDITO, 0 AS DIASCREDITO,
                '${fecha}' AS LASTSALE
            `
    
     execute.QueryToken(res,qry,'');
     
});


router.post("/cliente_insert", async(req,res)=>{

    const{sucursal,codven,fecha,nitclie,tiponegocio,negocio,categoria,nomclie,dirclie,codmun,coddepto,referencia,obs,telefono,visita,lat,long,sector} = req.body;

    let qry = `
        INSERT INTO CLIENTES (EMPNIT,CODEMPLEADO,DIAVISITA,DPI,NIT,TIPONEGOCIO,NEGOCIO,NOMBRE,DIRECCION,REFERENCIA,CODMUN,CODDEPTO,CODSECTOR,TELEFONO,
                    EMAIL,FECHANACIMIENTO,LATITUD,LONGITUD,CATEGORIA,CODRUTA,SALDO,FECHAINICIO,HABILITADO,LIMITECREDITO,DIASCREDITO,LASTSALE)
        SELECT '${sucursal}' AS EMPNIT,${codven} AS CODEMPLEADO,'${visita}' AS DIAVISITA,
                '' AS DPI, '${nitclie}' AS NIT, '${tiponegocio}' AS TIPONEGOCIO, '${negocio}' AS NEGOCIO, '${nomclie}' AS NOMBRE,'${dirclie}' AS DIRECCION,
                '${referencia}' AS REFERENCIA, ${codmun} AS CODMUN, ${coddepto} AS CODDEPTO, ${sector} AS CODSECTOR,
                '${telefono}' AS TELEFONO, '' AS EMAIL, '${fecha}' AS FECHANACIMIENTO,
                '${lat}' AS LATITUD, '${long}' AS LONGITUD, '${categoria}' AS CATEGORIA, 0 AS CODRUTA, 0 AS SALDO,
                '${fecha}' AS FECHAINICIO, 'SI' AS HABILITADO, 0 AS LIMITECREDITO, 0 AS DIASCREDITO,
                '${fecha}' AS LASTSALE
            `
    
     execute.QueryToken(res,qry,'');
     
});


router.post("/cliente_edit", async(req,res)=>{

    const{sucursal,codclie,codven,fecha,nitclie,tiponegocio,negocio,categoria,nomclie,dirclie,codmun,coddepto,referencia,obs,telefono,visita,lat,long,sector} = req.body;

    let qry = `
        UPDATE CLIENTES SET
                CODEMPLEADO= ${codven},
                DIAVISITA='${visita}',
                NIT='${nitclie}',
                TIPONEGOCIO='${tiponegocio}',
                NEGOCIO='${negocio}',
                NOMBRE='${nomclie}',
                DIRECCION='${dirclie}',
                REFERENCIA='${referencia}',
                CODMUN=${codmun},
                CODDEPTO=${coddepto},
                CODSECTOR=${sector},
                TELEFONO='${telefono}',
                LATITUD='${lat}',
                LONGITUD='${long}',
                CATEGORIA='${categoria}',
                LASTSALE='${fecha}'
            WHERE CODCLIENTE=${codclie}
            `
    
     execute.QueryToken(res,qry,'');
     
});





router.post("/censo_delete_cliente", async(req,res)=>{

    const {codclie} = req.body;


    let qry = `DELETE FROM CLIENTES WHERE CODCLIENTE=${codclie}; `

     execute.QueryToken(res,qry,'');
     
});

router.post("/municipios", async(req,res)=>{

    const {coddepto} = req.body;


    let qry = `SELECT CODMUN AS CODIGO, DESMUN AS DESCRIPCION
                FROM MUNICIPIOS WHERE CODDEPTO=${coddepto}; `

     execute.QueryToken(res,qry,'');
     
});

router.post("/departamentos", async(req,res)=>{


    let qry = `SELECT CODDEPTO AS CODIGO, 
                DESDEPTO AS DESCRIPCION  
                FROM DEPARTAMENTOS; `

     execute.QueryToken(res,qry,'');
     
});

router.post("/sectores", async(req,res)=>{

    const {codmun} = req.body;

    let qry = `SELECT CODSECTOR AS CODIGO, 
                DESSECTOR AS DESCRIPCION  
                FROM SECTORES WHERE CODMUN=${codmun}; `

     execute.QueryToken(res,qry,'');
     
});



router.post("/buscar_cliente", async(req,res)=>{
   
    const { token, sucursal, filtro} = req.body;

    let qry = `
        SELECT CLIENTES.CODCLIENTE, CLIENTES.NIT, 
            CLIENTES.NOMBRE, CLIENTES.DIRECCION, 
            CLIENTES.CODMUN, MUNICIPIOS.DESMUN, 
            CLIENTES.CODDEPTO, DEPARTAMENTOS.DESDEPTO, 
            CLIENTES.TELEFONO, CLIENTES.LATITUD, 
            CLIENTES.LONGITUD, CLIENTES.SALDO, 
            CLIENTES.HABILITADO, CLIENTES.LASTSALE, 
            CLIENTES.DIASCREDITO, CLIENTES.REFERENCIA,
            CLIENTES.DIAVISITA AS VISITA
        FROM CLIENTES LEFT OUTER JOIN
            DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
            MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
        WHERE 
            (CLIENTES.NOMBRE LIKE '%${filtro}%') AND
            (CLIENTES.HABILITADO='SI') 
        OR 
            (CLIENTES.NIT='${filtro}') AND
            (CLIENTES.HABILITADO='SI')
    `
    
 

    execute.QueryToken(res,qry,token);
     
});




router.post("/buscar_cliente_vendedor_comodin", async(req,res)=>{
   
    const { token, sucursal, filtro, codven, dia,fecha} = req.body;

    let qry = '';
    
    if(filtro==''){

        qry = `
        SELECT TOP 100 CLIENTES.CODCLIENTE, CLIENTES.NIT,
            CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO, 
            CLIENTES.NOMBRE, CLIENTES.DIRECCION, 
            CLIENTES.CODMUN, MUNICIPIOS.DESMUN, 
            CLIENTES.CODDEPTO, DEPARTAMENTOS.DESDEPTO, 
            CLIENTES.TELEFONO, CLIENTES.LATITUD, 
            CLIENTES.LONGITUD, CLIENTES.SALDO, 
            CLIENTES.HABILITADO, CLIENTES.LASTSALE,
            CONCAT(MONTH(CLIENTES.LASTSALE),'-',YEAR(CLIENTES.LASTSALE)) AS MES_ULTIMO,
            CONCAT(MONTH('${fecha}'),'-',YEAR('${fecha}')) AS MES_CURSO,
            CLIENTES.DIASCREDITO, CLIENTES.REFERENCIA,
            CLIENTES.DIAVISITA AS VISITA
        FROM CLIENTES LEFT OUTER JOIN
            DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
            MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
        WHERE
            (CLIENTES.EMPNIT='${sucursal}') AND 
            (CLIENTES.DIAVISITA='${dia}') AND
            (CLIENTES.HABILITADO='SI')
        ORDER BY CLIENTES.LASTSALE;
        `
    
    }else{
        if(isNaN(filtro)==true){
            
            console.log('el filtro NO es numero');

            qry = `
                SELECT TOP 100 CLIENTES.CODCLIENTE, CLIENTES.NIT,
                    CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO, 
                    CLIENTES.NOMBRE, CLIENTES.DIRECCION, 
                    CLIENTES.CODMUN, MUNICIPIOS.DESMUN, 
                    CLIENTES.CODDEPTO, DEPARTAMENTOS.DESDEPTO, 
                    CLIENTES.TELEFONO, CLIENTES.LATITUD, 
                    CLIENTES.LONGITUD, CLIENTES.SALDO, 
                    CLIENTES.HABILITADO, CLIENTES.LASTSALE,
                    CONCAT(MONTH(CLIENTES.LASTSALE),'-',YEAR(CLIENTES.LASTSALE)) AS MES_ULTIMO, 
                    CONCAT(MONTH('${fecha}'),'-',YEAR('${fecha}')) AS MES_CURSO,
                    CLIENTES.DIASCREDITO, CLIENTES.REFERENCIA,
                    CLIENTES.DIAVISITA AS VISITA
                FROM CLIENTES LEFT OUTER JOIN
                    DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
                    MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
                WHERE
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NOMBRE LIKE '%${filtro}%') AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                OR 
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NIT='${filtro}') AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                OR 
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NEGOCIO LIKE '%${filtro}%') AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                ORDER BY CLIENTES.LASTSALE;
                `
        
        }else{
             console.log('el filtro es numero');

            qry = `
                SELECT TOP 100 CLIENTES.CODCLIENTE, CLIENTES.NIT,
                    CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO, 
                    CLIENTES.NOMBRE, CLIENTES.DIRECCION, 
                    CLIENTES.CODMUN, MUNICIPIOS.DESMUN, 
                    CLIENTES.CODDEPTO, DEPARTAMENTOS.DESDEPTO, 
                    CLIENTES.TELEFONO, CLIENTES.LATITUD,
                    CONCAT(MONTH(CLIENTES.LASTSALE),'-',YEAR(CLIENTES.LASTSALE)) AS MES_ULTIMO,
                    CONCAT(MONTH('${fecha}'),'-',YEAR('${fecha}')) AS MES_CURSO,
                    CLIENTES.LONGITUD, CLIENTES.SALDO, 
                    CLIENTES.HABILITADO, CLIENTES.LASTSALE, 
                    CLIENTES.DIASCREDITO, CLIENTES.REFERENCIA,
                    CLIENTES.DIAVISITA AS VISITA
                FROM CLIENTES LEFT OUTER JOIN
                    DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
                    MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
                WHERE
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NOMBRE LIKE '%${filtro}%') AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')

                OR 
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NIT='${filtro}') AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                OR 
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NEGOCIO LIKE '%${filtro}%') AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                OR 
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.CODCLIENTE=${filtro}) AND
                    (CLIENTES.HABILITADO='SI')
                ORDER BY CLIENTES.LASTSALE;
            `
        }
    };



/*
    if(filtro==''){
        qry = `
        SELECT CLIENTES.CODCLIENTE, CLIENTES.NIT,
            CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO, 
            CLIENTES.NOMBRE, CLIENTES.DIRECCION, 
            CLIENTES.CODMUN, MUNICIPIOS.DESMUN, 
            CLIENTES.CODDEPTO, DEPARTAMENTOS.DESDEPTO, 
            CLIENTES.TELEFONO, CLIENTES.LATITUD, 
            CLIENTES.LONGITUD, CLIENTES.SALDO, 
            CLIENTES.HABILITADO, CLIENTES.LASTSALE,
            CONCAT(MONTH(CLIENTES.LASTSALE),'-',YEAR(CLIENTES.LASTSALE)) AS MES_ULTIMO, 
            CONCAT(MONTH('${fecha}'),'-',YEAR('${fecha}')) AS MES_CURSO, 
            CLIENTES.DIASCREDITO, CLIENTES.REFERENCIA,
            CLIENTES.DIAVISITA AS VISITA
        FROM CLIENTES LEFT OUTER JOIN
            DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
            MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
        WHERE
            (CLIENTES.EMPNIT='${sucursal}') AND 
            (CLIENTES.NOMBRE LIKE '%${filtro}%') AND
            (CLIENTES.DIAVISITA='${dia}') AND
            (CLIENTES.HABILITADO='SI')
        OR 
            (CLIENTES.EMPNIT='${sucursal}') AND 
            (CLIENTES.NIT='${filtro}') AND
            (CLIENTES.DIAVISITA='${dia}') AND
            (CLIENTES.HABILITADO='SI')
        OR 
            (CLIENTES.EMPNIT='${sucursal}') AND 
            (CLIENTES.NEGOCIO='${filtro}') AND
            (CLIENTES.DIAVISITA='${dia}') AND
            (CLIENTES.HABILITADO='SI')
        ORDER BY CLIENTES.LASTSALE;
        `
    
    }else{
        if(isNaN(filtro)==false){
            qry = `
                SELECT CLIENTES.CODCLIENTE, CLIENTES.NIT,
                    CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO, 
                    CLIENTES.NOMBRE, CLIENTES.DIRECCION, 
                    CLIENTES.CODMUN, MUNICIPIOS.DESMUN, 
                    CLIENTES.CODDEPTO, DEPARTAMENTOS.DESDEPTO, 
                    CLIENTES.TELEFONO, CLIENTES.LATITUD, 
                    CLIENTES.LONGITUD, CLIENTES.SALDO, 
                    CLIENTES.HABILITADO, CLIENTES.LASTSALE,
                     CONCAT(MONTH(CLIENTES.LASTSALE),'-',YEAR(CLIENTES.LASTSALE)) AS MES_ULTIMO, 
                    CONCAT(MONTH('${fecha}'),'-',YEAR('${fecha}')) AS MES_CURSO, 
                    CLIENTES.DIASCREDITO, CLIENTES.REFERENCIA,
                    CLIENTES.DIAVISITA AS VISITA
                FROM CLIENTES LEFT OUTER JOIN
                    DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
                    MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
                WHERE
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NOMBRE LIKE '%${filtro}%') AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')

                OR 
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NIT='${filtro}') AND
                    (CLIENTES.CODEMPLEADO=${codven}) AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                OR 
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NEGOCIO='${filtro}') AND
                    (CLIENTES.CODEMPLEADO=${codven}) AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                OR 
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.CODCLIENTE=${filtro}) AND
                    (CLIENTES.HABILITADO='SI')
                ORDER BY CLIENTES.LASTSALE;
                `
        
        }else{
        qry = `
                SELECT CLIENTES.CODCLIENTE, CLIENTES.NIT,
                    CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO, 
                    CLIENTES.NOMBRE, CLIENTES.DIRECCION, 
                    CLIENTES.CODMUN, MUNICIPIOS.DESMUN, 
                    CLIENTES.CODDEPTO, DEPARTAMENTOS.DESDEPTO, 
                    CLIENTES.TELEFONO, CLIENTES.LATITUD, 
                    CLIENTES.LONGITUD, CLIENTES.SALDO, 
                    CLIENTES.HABILITADO, CLIENTES.LASTSALE,
                     CONCAT(MONTH(CLIENTES.LASTSALE),'-',YEAR(CLIENTES.LASTSALE)) AS MES_ULTIMO, 
                    CONCAT(MONTH('${fecha}'),'-',YEAR('${fecha}')) AS MES_CURSO, 
                    CLIENTES.DIASCREDITO, CLIENTES.REFERENCIA,
                    CLIENTES.DIAVISITA AS VISITA
                FROM CLIENTES LEFT OUTER JOIN
                    DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
                    MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
                WHERE
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NOMBRE LIKE '%${filtro}%') AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')

                OR 
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NIT='${filtro}') AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                OR 
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NEGOCIO='${filtro}') AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                ORDER BY CLIENTES.LASTSALE;
            `
        }

        
    
    }
*/

    execute.QueryToken(res,qry,token);
     
});
router.post("/buscar_cliente_vendedor", async(req,res)=>{
   
    const { token, sucursal, filtro, codven, dia, fecha} = req.body;


    let qry = '';

    if(filtro==''){

        qry = `
        SELECT CLIENTES.CODCLIENTE, CLIENTES.NIT,
            CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO, 
            CLIENTES.NOMBRE, CLIENTES.DIRECCION, 
            CLIENTES.CODMUN, MUNICIPIOS.DESMUN, 
            CLIENTES.CODDEPTO, DEPARTAMENTOS.DESDEPTO, 
            CLIENTES.TELEFONO, CLIENTES.LATITUD, 
            CLIENTES.LONGITUD, CLIENTES.SALDO, 
            CLIENTES.HABILITADO, CLIENTES.LASTSALE,
            CONCAT(MONTH(CLIENTES.LASTSALE),'-',YEAR(CLIENTES.LASTSALE)) AS MES_ULTIMO,
            CONCAT(MONTH('${fecha}'),'-',YEAR('${fecha}')) AS MES_CURSO,
            CLIENTES.DIASCREDITO, CLIENTES.REFERENCIA,
            CLIENTES.DIAVISITA AS VISITA
        FROM CLIENTES LEFT OUTER JOIN
            DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
            MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
        WHERE
            (CLIENTES.EMPNIT='${sucursal}') AND 
            (CLIENTES.CODEMPLEADO=${codven}) AND
            (CLIENTES.DIAVISITA='${dia}') AND
            (CLIENTES.HABILITADO='SI')
        ORDER BY CLIENTES.LASTSALE;
        `
    
    }else{
        if(isNaN(filtro)==true){
            
            console.log('el filtro NO es numero');

            qry = `
                SELECT CLIENTES.CODCLIENTE, CLIENTES.NIT,
                    CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO, 
                    CLIENTES.NOMBRE, CLIENTES.DIRECCION, 
                    CLIENTES.CODMUN, MUNICIPIOS.DESMUN, 
                    CLIENTES.CODDEPTO, DEPARTAMENTOS.DESDEPTO, 
                    CLIENTES.TELEFONO, CLIENTES.LATITUD, 
                    CLIENTES.LONGITUD, CLIENTES.SALDO, 
                    CLIENTES.HABILITADO, CLIENTES.LASTSALE,
                    CONCAT(MONTH(CLIENTES.LASTSALE),'-',YEAR(CLIENTES.LASTSALE)) AS MES_ULTIMO, 
                    CONCAT(MONTH('${fecha}'),'-',YEAR('${fecha}')) AS MES_CURSO,
                    CLIENTES.DIASCREDITO, CLIENTES.REFERENCIA,
                    CLIENTES.DIAVISITA AS VISITA
                FROM CLIENTES LEFT OUTER JOIN
                    DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
                    MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
                WHERE
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NOMBRE LIKE '%${filtro}%') AND
                    (CLIENTES.CODEMPLEADO=${codven}) AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                OR 
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NIT='${filtro}') AND
                    (CLIENTES.CODEMPLEADO=${codven}) AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                OR 
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NEGOCIO LIKE '%${filtro}%') AND
                    (CLIENTES.CODEMPLEADO=${codven}) AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                ORDER BY CLIENTES.LASTSALE;
                `
        
        }else{
             console.log('el filtro es numero');

            qry = `
                SELECT CLIENTES.CODCLIENTE, CLIENTES.NIT,
                    CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO, 
                    CLIENTES.NOMBRE, CLIENTES.DIRECCION, 
                    CLIENTES.CODMUN, MUNICIPIOS.DESMUN, 
                    CLIENTES.CODDEPTO, DEPARTAMENTOS.DESDEPTO, 
                    CLIENTES.TELEFONO, CLIENTES.LATITUD,
                    CONCAT(MONTH(CLIENTES.LASTSALE),'-',YEAR(CLIENTES.LASTSALE)) AS MES_ULTIMO,
                    CONCAT(MONTH('${fecha}'),'-',YEAR('${fecha}')) AS MES_CURSO,
                    CLIENTES.LONGITUD, CLIENTES.SALDO, 
                    CLIENTES.HABILITADO, CLIENTES.LASTSALE, 
                    CLIENTES.DIASCREDITO, CLIENTES.REFERENCIA,
                    CLIENTES.DIAVISITA AS VISITA
                FROM CLIENTES LEFT OUTER JOIN
                    DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
                    MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
                WHERE
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NOMBRE LIKE '%${filtro}%') AND
                    (CLIENTES.CODEMPLEADO=${codven}) AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')

                OR 
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NIT='${filtro}') AND
                    (CLIENTES.CODEMPLEADO=${codven}) AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                OR 
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.NEGOCIO='${filtro}') AND
                    (CLIENTES.CODEMPLEADO=${codven}) AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                OR 
                    (CLIENTES.EMPNIT='${sucursal}') AND 
                    (CLIENTES.CODCLIENTE=${filtro}) AND
                    (CLIENTES.HABILITADO='SI')
                ORDER BY CLIENTES.LASTSALE;
            `
        }
    };


    execute.QueryToken(res,qry,token);
     
});
router.post("/buscar_cliente_vendedor_supervisor", async(req,res)=>{
   
    const { token, sucursal, codven, fecha,dia} = req.body;


    let qry = '';

  
    if(codven.toString()=='TODOS'){
    qry = `
        SELECT CLIENTES.CODCLIENTE, CLIENTES.NIT,
            CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO, 
            CLIENTES.NOMBRE, CLIENTES.DIRECCION, 
            CLIENTES.CODMUN, MUNICIPIOS.DESMUN, 
            CLIENTES.CODDEPTO, DEPARTAMENTOS.DESDEPTO, 
            CLIENTES.TELEFONO, CLIENTES.LATITUD, 
            CLIENTES.LONGITUD, CLIENTES.SALDO, 
            CLIENTES.HABILITADO, CLIENTES.LASTSALE,
            CONCAT(MONTH(CLIENTES.LASTSALE),'-',YEAR(CLIENTES.LASTSALE)) AS MES_ULTIMO,
            CONCAT(MONTH('${fecha}'),'-',YEAR('${fecha}')) AS MES_CURSO,
            CLIENTES.DIASCREDITO, CLIENTES.REFERENCIA,
            CLIENTES.DIAVISITA AS VISITA
        FROM CLIENTES LEFT OUTER JOIN
            DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
            MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
        WHERE
            (CLIENTES.EMPNIT='${sucursal}') AND 
            (CLIENTES.DIAVISITA='${dia}') AND
            (CLIENTES.HABILITADO='SI')
        ORDER BY CLIENTES.LASTSALE;
        `
    }else{
    qry = `
        SELECT CLIENTES.CODCLIENTE, CLIENTES.NIT,
            CLIENTES.TIPONEGOCIO, CLIENTES.NEGOCIO, 
            CLIENTES.NOMBRE, CLIENTES.DIRECCION, 
            CLIENTES.CODMUN, MUNICIPIOS.DESMUN, 
            CLIENTES.CODDEPTO, DEPARTAMENTOS.DESDEPTO, 
            CLIENTES.TELEFONO, CLIENTES.LATITUD, 
            CLIENTES.LONGITUD, CLIENTES.SALDO, 
            CLIENTES.HABILITADO, CLIENTES.LASTSALE,
            CONCAT(MONTH(CLIENTES.LASTSALE),'-',YEAR(CLIENTES.LASTSALE)) AS MES_ULTIMO,
            CONCAT(MONTH('${fecha}'),'-',YEAR('${fecha}')) AS MES_CURSO,
            CLIENTES.DIASCREDITO, CLIENTES.REFERENCIA,
            CLIENTES.DIAVISITA AS VISITA
        FROM CLIENTES LEFT OUTER JOIN
            DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
            MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
        WHERE
            (CLIENTES.EMPNIT='${sucursal}') AND 
            (CLIENTES.CODEMPLEADO=${codven}) AND
            (CLIENTES.DIAVISITA='${dia}') AND
            (CLIENTES.HABILITADO='SI')
        ORDER BY CLIENTES.LASTSALE;
        `
    }

      
    
   


    execute.QueryToken(res,qry,token);
     
});
router.post("/buscar_cliente_vendedor_qr", async(req,res)=>{
   
    const { token, sucursal, filtro,fecha} = req.body;

    let qry = `
        SELECT CLIENTES.CODCLIENTE, CLIENTES.NIT, 
            CLIENTES.NOMBRE, CLIENTES.DIRECCION, 
            CLIENTES.CODMUN, MUNICIPIOS.DESMUN, 
            CLIENTES.CODDEPTO, DEPARTAMENTOS.DESDEPTO, 
            CLIENTES.TELEFONO, CLIENTES.LATITUD, 
            CLIENTES.LONGITUD, CLIENTES.SALDO, 
            CLIENTES.HABILITADO, CLIENTES.LASTSALE,
             CONCAT(MONTH(CLIENTES.LASTSALE),'-',YEAR(CLIENTES.LASTSALE)) AS MES_ULTIMO, 
                    CONCAT(MONTH('${fecha}'),'-',YEAR('${fecha}')) AS MES_CURSO, 
            CLIENTES.DIASCREDITO, CLIENTES.REFERENCIA,
            CLIENTES.DIAVISITA AS VISITA
        FROM CLIENTES LEFT OUTER JOIN
            DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
            MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
        WHERE
            (CLIENTES.CODCLIENTE = ${filtro})
        ORDER BY CLIENTES.LASTSALE;
        `
    
 
        //  (CLIENTES.EMPNIT='${sucursal}') AND 
        

    execute.QueryToken(res,qry,token);
     
});




router.post("/insert_cliente", async(req,res)=>{
   
    const { token, sucursal, nit, nombre, direccion, codmunicipio, coddepto, telefono, fecha, email, lat, long } = req.body;   

    let qry = `
        INSERT INTO CLIENTES(EMPNIT,DPI,NIT,
            NOMBRE,DIRECCION,CODMUN,CODDEPTO,
            TELEFONO,EMAIL,FECHANACIMIENTO,LATITUD,LONGITUD,CATEGORIA,
            SALDO,FECHAINICIO,HABILITADO,DIAVISITA,
            LIMITECREDITO,DIASCREDITO,REFERENCIA,LASTSALE)
        SELECT '${sucursal}' AS EMPNIT,'SN' AS DPI,
            '${nit}' AS NIT,
            '${nombre}' AS NOMBRE,
            '${direccion}' AS DIRECCION,
            ${codmunicipio} AS CODMUN,
            ${coddepto} AS CODDEPTO,
            '${telefono}' AS TELEFONO,
            '${email}' AS EMAIL,
            '2020-01-01' AS FECHANACIMIENTO,
            '${lat}' AS LATITUD,
            '${long}' AS LONGITUD,
            'P' AS CATEGORIA,
            0 AS SALDO,
            '${fecha}' AS FECHAINICIO,
            'SI' AS HABILITADO,
            'OTROS' AS DIAVISITA,
            0 AS LIMITECREDITO,
            0 AS DIASCREDITO,
            '' AS REFERENCIA,
            '${fecha}' AS LASTSALE;
            SELECT IDENT_CURRENT ('CLIENTES') AS Current_Identity;
    
    `
    execute.QueryToken(res,qry,token);
     
});



router.post("/listado", async(req,res)=>{
   
    const { token, sucursal } = req.body;

    let qry = `
        SELECT CODCLIENTE, 
            NOMBRECLIENTE AS NOMCLIE, 
            TELEFONOCLIENTE AS CONTACTO 
        FROM CLIENTES
        WHERE EMPNIT='${sucursal}';
    `;
    

    execute.QueryToken(res,qry,token);
     
});

router.post("/delete", async(req,res)=>{
   
    const { token, sucursal, codcliente } = req.body;

    let qry = `DELETE FROM CLIENTES WHERE CODCLIENTE=${codcliente} AND EMPNIT='${sucursal}';`;
    
    execute.QueryToken(res,qry,token);
     
});




module.exports = router;

