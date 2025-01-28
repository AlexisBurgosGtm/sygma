const execute = require('../connection');
const express = require('express');
const router = express.Router();





router.post("/censo_insert", async(req,res)=>{

    const{sucursal,codven,fecha,nitclie,tiponegocio,negocio,nomclie,dirclie,codmun,coddepto,referencia,obs,telefono,visita,lat,long,sector} = req.body;

    let qry = `
    INSERT INTO CLIENTES (
                    EMPNIT,DPI,NIT,NOMBRECLIENTE,DIRCLIENTE,CODMUNICIPIO,CODDEPARTAMENTO,TELEFONOCLIENTE,EMAILCLIENTE,ESTADOCIVIL,SEXO,
                    FECHANACIMIENTOCLIENTE,LATITUDCLIENTE,LONGITUDCLIENTE,CATEGORIA,CIUDADANIA,OCUPACION,CODRUTA,CALIFICACION,SALDO,FECHAINICIO,
                    HABILITADO,DIAVISITA,LIMITECREDITO,DIASCREDITO,PROVINCIA,TIPONEGOCIO,NEGOCIO,CODCLIE) 
        SELECT 
            '${sucursal}' AS EMPNIT,'SN' AS DPI,'${nitclie}' AS NIT, '${nomclie}' AS NOMBRECLIENTE,
                '${dirclie}' AS DIRCLIENTE, ${codmun} AS CODMUNICIPIO, ${coddepto} AS CODDEPARTAMENTO,
                '${telefono}' AS TELEFONOCLIENTE, '' AS EMAILCLIENTE, '' AS ESTADOCIVIL, '' AS SEXO,
                '${fecha}' AS FECHANACIMIENTOCLIENTE, '${lat}' AS LATITUDCLIENTE, '${long}' AS LONGITUDCLIENTE,
                'P' AS CATEGORIA, '' AS CIUDADANIA, '' AS OCUPACION, CODRUTA AS CODRUTA, 'REGULAR' AS CALIFICACION,
                0 AS SALDO, '${fecha}' AS FECHAINICIO, 'SI' AS HABILITADO, '${visita}' AS DIAVISITA,
                0 AS LIMITECREDITO, 0 AS DIASCREDITO, '${referencia}' AS PROVINCIA, '${tiponegocio}' AS TIPONEGOCIO,
                '${negocio}' AS NEGOCIO, '0' AS CODCLIE 
        FROM RUTAS WHERE  (EMPNIT = '${sucursal}') AND (CODEMPLEADO = ${codven});
    `
    
    console.log(qry);
    
     execute.Query(res,qry);
     
});


router.post("/municipios", async(req,res)=>{


    let qry = `SELECT CODMUNICIPIO AS CODIGO, DESMUNICIPIO AS DESCRIPCION
                FROM MUNICIPIOS; `

     execute.Query(res,qry);
     
});

router.post("/departamentos", async(req,res)=>{


    let qry = `SELECT CODDEPARTAMENTO AS CODIGO, 
                DESDEPARTAMENTO AS DESCRIPCION  
                FROM DEPARTAMENTOS; `

     execute.Query(res,qry);
     
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
            CLIENTES.DIASCREDITO, CLIENTES.REFERENCIA
        FROM CLIENTES LEFT OUTER JOIN
            DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
            MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
        WHERE (CLIENTES.NOMBRE LIKE '%${filtro}%') OR (CLIENTES.NIT='${filtro}')
    `
    
 

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

