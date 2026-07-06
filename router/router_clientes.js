const execute = require('../connection');
const express = require('express');
const router = express.Router();

function esc(val) {
    if (val === null || val === undefined) return '';
    return String(val).replace(/'/g, "''");
}


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

    const { token, sucursal, descripcion, codemp} = req.body;
    const emp = esc(sucursal);

    let qry = `
           INSERT INTO RUTAS_CLIENTES
            (EMPNIT, DESRUTA, CODEMP)
            VALUES (
                '${emp}',
                '${esc(descripcion)}',
                ${Number(codemp) || 0}
            );
        `;

    execute.QueryToken(res,qry,token);

});

router.post("/update_ruta", async (req, res) => {
    const { token, sucursal, codigo, descripcion, codemp } = req.body;
    const emp = esc(sucursal);
    const codruta = Number(codigo) || 0;
    const codempNuevo = Number(codemp) || 0;

    // Si cambia el vendedor de la ruta, sincroniza CLIENTES.CODEMPLEADO (reportes usan ese campo)
    let qry = `
        DECLARE @CODEMP_ANTERIOR INT;
        SELECT @CODEMP_ANTERIOR = ISNULL(CODEMP, 0)
          FROM RUTAS_CLIENTES
         WHERE EMPNIT = '${emp}' AND CODRUTA = ${codruta};

        UPDATE RUTAS_CLIENTES SET
            DESRUTA = '${esc(descripcion)}',
            CODEMP = ${codempNuevo}
        WHERE EMPNIT = '${emp}' AND CODRUTA = ${codruta};

        IF ISNULL(@CODEMP_ANTERIOR, 0) <> ${codempNuevo}
        BEGIN
            UPDATE CLIENTES
               SET CODEMPLEADO = ${codempNuevo}
             WHERE EMPNIT = '${emp}'
               AND CODRUTA = ${codruta};
        END
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/delete_ruta", async (req, res) => {
    const { token, sucursal, codigo } = req.body;
    const cod = Number(codigo);
    const emp = esc(sucursal);

    let qry = `
        IF (
            (SELECT COUNT(*) FROM CLIENTES WHERE EMPNIT = '${emp}' AND CODRUTA = ${cod}) = 0
            AND (SELECT COUNT(*) FROM EMPLEADOS WHERE EMPNIT = '${emp}' AND CODRUTA = ${cod}) = 0
        )
        BEGIN
            DELETE FROM RUTAS_CLIENTES
            WHERE EMPNIT = '${emp}' AND CODRUTA = ${cod};
        END
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/select_rutas_mercaderistas", async (req, res) => {
    const { token, sucursal } = req.body;

    let qry = `
          SELECT RUTAS_MERCADERISTAS.CODRUTA,
                 RUTAS_MERCADERISTAS.DESRUTA AS RUTA,
                 RUTAS_MERCADERISTAS.CODEMP,
                 EMPLEADOS.NOMEMPLEADO AS EMPLEADO
            FROM RUTAS_MERCADERISTAS
            LEFT OUTER JOIN EMPLEADOS
                ON RUTAS_MERCADERISTAS.CODEMP = EMPLEADOS.CODEMPLEADO
               AND RUTAS_MERCADERISTAS.EMPNIT = EMPLEADOS.EMPNIT
           WHERE (RUTAS_MERCADERISTAS.EMPNIT = '${esc(sucursal)}')
           ORDER BY RUTAS_MERCADERISTAS.CODRUTA`;

    execute.QueryToken(res, qry, token);
});

router.post("/insert_ruta_mercaderista", async (req, res) => {
    const { token, sucursal, descripcion, codemp } = req.body;
    const emp = esc(sucursal);

    let qry = `
           INSERT INTO RUTAS_MERCADERISTAS
            (EMPNIT, DESRUTA, CODEMP)
            VALUES (
                '${emp}',
                '${esc(descripcion)}',
                ${Number(codemp) || 0}
            );
        `;

    execute.QueryToken(res, qry, token);
});

router.post("/update_ruta_mercaderista", async (req, res) => {
    const { token, sucursal, codigo, descripcion, codemp } = req.body;

    let qry = `
        UPDATE RUTAS_MERCADERISTAS SET
            DESRUTA = '${esc(descripcion)}',
            CODEMP = ${Number(codemp) || 0}
        WHERE EMPNIT = '${esc(sucursal)}' AND CODRUTA = ${Number(codigo)}
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/delete_ruta_mercaderista", async (req, res) => {
    const { token, sucursal, codigo } = req.body;
    const cod = Number(codigo);
    const emp = esc(sucursal);

    let qry = `
        IF (
            (SELECT COUNT(*) FROM EMPLEADOS
              WHERE EMPNIT = '${emp}' AND CODRUTA = ${cod} AND CODPUESTO = 9) = 0
        )
        BEGIN
            DELETE FROM RUTAS_MERCADERISTAS
            WHERE EMPNIT = '${emp}' AND CODRUTA = ${cod};
        END
    `;

    execute.QueryToken(res, qry, token);
});





router.post("/lista_clientes_general", async(req,res)=>{
   
    const { token, sucursal, st} = req.body;

    let qry = '';

    if(st=='NOGPS'){
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
                CLIENTES.DIAVISITA AS VISITA,
                ISNULL(CLIENTES.VISITAM, '') AS VISITAM,
                ISNULL(CLIENTES.CODRUTA, 0) AS CODRUTA,
                ISNULL(CLIENTES.CODRUTAM, 0) AS CODRUTAM
        FROM CLIENTES LEFT OUTER JOIN
               EMPLEADOS ON CLIENTES.CODEMPLEADO = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
               SECTORES ON CLIENTES.CODSECTOR = SECTORES.CODSECTOR LEFT OUTER JOIN
               DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
               MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
        WHERE (CLIENTES.EMPNIT = '${sucursal}')       
         AND (ISNULL(CLIENTES.LATITUD,'0')='0');
            `
    }else{
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
                CLIENTES.DIAVISITA AS VISITA,
                ISNULL(CLIENTES.VISITAM, '') AS VISITAM,
                ISNULL(CLIENTES.CODRUTA, 0) AS CODRUTA,
                ISNULL(CLIENTES.CODRUTAM, 0) AS CODRUTAM
        FROM CLIENTES LEFT OUTER JOIN
               EMPLEADOS ON CLIENTES.CODEMPLEADO = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
               SECTORES ON CLIENTES.CODSECTOR = SECTORES.CODSECTOR LEFT OUTER JOIN
               DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
               MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
        WHERE (CLIENTES.EMPNIT = '${sucursal}')       
         AND (CLIENTES.HABILITADO='${st}')
        `
    }

    



    execute.QueryToken(res,qry,token);
     
});

router.post("/lista_clientes_supervisor_buscar", async (req, res) => {
    const { token, sucursal, st, codven, dia, filtro } = req.body;
    const emp = esc(sucursal);
    const ven = Number(codven) || 0;
    const diaVal = esc((dia || '').trim());
    const filtroText = esc((filtro || '').trim());
    const tieneFiltroVen = ven > 0;
    const tieneFiltroDia = diaVal !== '' && diaVal !== 'TODOS';
    const topClause = (tieneFiltroVen || tieneFiltroDia) ? '' : 'TOP 50';

    let whereSt = '';
    if (st === 'NOGPS') {
        whereSt = `AND (ISNULL(CLIENTES.LATITUD,'0')='0')`;
    } else {
        whereSt = `AND (CLIENTES.HABILITADO='${esc(st)}')`;
    }

    let whereVen = tieneFiltroVen ? `AND (CLIENTES.CODEMPLEADO = ${ven})` : '';
    let whereDia = tieneFiltroDia ? `AND (CLIENTES.DIAVISITA = '${diaVal}')` : '';

    let whereFiltro = '';
    if (filtroText) {
        if (isNaN(filtroText)) {
            whereFiltro = `
                AND (
                    CLIENTES.NOMBRE LIKE '%${filtroText}%'
                    OR CLIENTES.NEGOCIO LIKE '%${filtroText}%'
                    OR CLIENTES.NIT LIKE '%${filtroText}%'
                )`;
        } else {
            whereFiltro = `
                AND (
                    CLIENTES.NOMBRE LIKE '%${filtroText}%'
                    OR CLIENTES.NEGOCIO LIKE '%${filtroText}%'
                    OR CLIENTES.NIT = '${filtroText}'
                    OR CLIENTES.CODCLIENTE = ${Number(filtroText)}
                )`;
        }
    }

    const qry = `
        SELECT ${topClause}
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
                CLIENTES.DIAVISITA AS VISITA,
                ISNULL(CLIENTES.VISITAM, '') AS VISITAM,
                ISNULL(CLIENTES.CODRUTA, 0) AS CODRUTA,
                ISNULL(CLIENTES.CODRUTAM, 0) AS CODRUTAM,
                ISNULL(EMP_MERC.NOMEMPLEADO, '') AS NOMMERCADERISTA
        FROM CLIENTES LEFT OUTER JOIN
               EMPLEADOS ON CLIENTES.CODEMPLEADO = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
               RUTAS_MERCADERISTAS ON CLIENTES.CODRUTAM = RUTAS_MERCADERISTAS.CODRUTA
                AND CLIENTES.EMPNIT = RUTAS_MERCADERISTAS.EMPNIT LEFT OUTER JOIN
               EMPLEADOS AS EMP_MERC ON RUTAS_MERCADERISTAS.CODEMP = EMP_MERC.CODEMPLEADO
                AND RUTAS_MERCADERISTAS.EMPNIT = EMP_MERC.EMPNIT LEFT OUTER JOIN
               SECTORES ON CLIENTES.CODSECTOR = SECTORES.CODSECTOR LEFT OUTER JOIN
               DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO LEFT OUTER JOIN
               MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
        WHERE (CLIENTES.EMPNIT = '${emp}')
         ${whereSt}
         ${whereVen}
         ${whereDia}
         ${whereFiltro}
        ORDER BY CLIENTES.NOMBRE
    `;

    execute.QueryToken(res, qry, token);
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

    const{sucursal,codven,fecha,nitclie,tiponegocio,negocio,categoria,nomclie,dirclie,codmun,coddepto,referencia,obs,telefono,visita,lat,long,sector,codruta} = req.body;
    const emp = esc(sucursal);
    const ven = Number(codven) || 0;
    const rutaBody = Number(codruta) || 0;
    // Ruta del vendedor creador (RUTAS_CLIENTES.CODEMP); si no viene, se resuelve en BD
    const rutaSql = rutaBody > 0
        ? String(rutaBody)
        : `ISNULL((SELECT TOP 1 CODRUTA FROM RUTAS_CLIENTES WHERE EMPNIT = '${emp}' AND CODEMP = ${ven}), 0)`;

    let qry = `
        INSERT INTO CLIENTES (EMPNIT,CODEMPLEADO,DIAVISITA,DPI,NIT,TIPONEGOCIO,NEGOCIO,NOMBRE,DIRECCION,REFERENCIA,CODMUN,CODDEPTO,CODSECTOR,TELEFONO,
                    EMAIL,FECHANACIMIENTO,LATITUD,LONGITUD,CATEGORIA,CODRUTA,SALDO,FECHAINICIO,HABILITADO,LIMITECREDITO,DIASCREDITO,LASTSALE)
        SELECT '${emp}' AS EMPNIT,${ven} AS CODEMPLEADO,'${visita}' AS DIAVISITA,
                '' AS DPI, '${nitclie}' AS NIT, '${tiponegocio}' AS TIPONEGOCIO, '${negocio}' AS NEGOCIO, '${nomclie}' AS NOMBRE,'${dirclie}' AS DIRECCION,
                '${referencia}' AS REFERENCIA, ${codmun} AS CODMUN, ${coddepto} AS CODDEPTO, ${sector} AS CODSECTOR,
                '${telefono}' AS TELEFONO, '' AS EMAIL, '${fecha}' AS FECHANACIMIENTO,
                '${lat}' AS LATITUD, '${long}' AS LONGITUD, '${categoria}' AS CATEGORIA, ${rutaSql} AS CODRUTA, 0 AS SALDO,
                '${fecha}' AS FECHAINICIO, 'NA' AS HABILITADO, 0 AS LIMITECREDITO, 0 AS DIASCREDITO,
                '${fecha}' AS LASTSALE
            `
    
     execute.QueryToken(res,qry,'');
     
});


router.post("/cliente_insert", async(req,res)=>{

    const{sucursal,codven,fecha,nitclie,tiponegocio,negocio,categoria,nomclie,dirclie,codmun,coddepto,referencia,obs,telefono,visita,visitam,lat,long,sector,codruta,codrutam} = req.body;
    const ruta = Number(codruta) || 0;
    const rutam = Number(codrutam) || 0;

    let qry = `
        INSERT INTO CLIENTES (EMPNIT,CODEMPLEADO,DIAVISITA,VISITAM,DPI,NIT,TIPONEGOCIO,NEGOCIO,NOMBRE,DIRECCION,REFERENCIA,CODMUN,CODDEPTO,CODSECTOR,TELEFONO,
                    EMAIL,FECHANACIMIENTO,LATITUD,LONGITUD,CATEGORIA,CODRUTA,CODRUTAM,SALDO,FECHAINICIO,HABILITADO,LIMITECREDITO,DIASCREDITO,LASTSALE)
        SELECT '${sucursal}' AS EMPNIT,${codven} AS CODEMPLEADO,'${visita}' AS DIAVISITA,'${visitam || ''}' AS VISITAM,
                '' AS DPI, '${nitclie}' AS NIT, '${tiponegocio}' AS TIPONEGOCIO, '${negocio}' AS NEGOCIO, '${nomclie}' AS NOMBRE,'${dirclie}' AS DIRECCION,
                '${referencia}' AS REFERENCIA, ${codmun} AS CODMUN, ${coddepto} AS CODDEPTO, ${sector} AS CODSECTOR,
                '${telefono}' AS TELEFONO, '' AS EMAIL, '${fecha}' AS FECHANACIMIENTO,
                '${lat}' AS LATITUD, '${long}' AS LONGITUD, '${categoria}' AS CATEGORIA, ${ruta} AS CODRUTA, ${rutam} AS CODRUTAM, 0 AS SALDO,
                '${fecha}' AS FECHAINICIO, 'SI' AS HABILITADO, 0 AS LIMITECREDITO, 0 AS DIASCREDITO,
                '${fecha}' AS LASTSALE
            `
    
     execute.QueryToken(res,qry,'');
     
});


router.post("/cliente_edit", async(req,res)=>{

    const{sucursal,codclie,codven,fecha,nitclie,tiponegocio,negocio,categoria,nomclie,dirclie,codmun,coddepto,referencia,obs,telefono,visita,visitam,lat,long,sector,codruta,codrutam} = req.body;
    const ruta = Number(codruta) || 0;
    const rutam = Number(codrutam) || 0;

    let qry = `
        UPDATE CLIENTES SET
                CODEMPLEADO= ${codven},
                DIAVISITA='${visita}',
                VISITAM='${visitam || ''}',
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
                CODRUTA=${ruta},
                CODRUTAM=${rutam},
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

//----------------------
//municipios

router.post("/municipios", async(req,res)=>{

    const {coddepto} = req.body;


    let qry = `SELECT CODMUN AS CODIGO, DESMUN AS DESCRIPCION,
                ISNULL(LATITUD,0) AS LATITUD,
                ISNULL(LONGITUD,0) AS LONGITUD
                FROM MUNICIPIOS WHERE CODDEPTO=${coddepto}; `

     execute.QueryToken(res,qry,'');
     
});
router.post("/insert_municipio", async(req,res)=>{

    const {descripcion,coddepto} = req.body;

    let qry = `INSERT INTO MUNICIPIOS (DESMUN,CODDEPTO) 
        SELECT '${descripcion}' AS DESMUN, ${coddepto} AS CODDEPTO; `

     execute.QueryToken(res,qry,'');
     
});
router.post("/edit_municipio", async(req,res)=>{

    const {codigo,descripcion} = req.body;

    let qry = `UPDATE MUNICIPIOS SET DESMUN='${descripcion}' WHERE CODMUN=${codigo}; `

     execute.QueryToken(res,qry,'');
     
});
router.post("/delete_municipio", async(req,res)=>{

    const {codigo} = req.body;

    let qry = `DELETE FROM MUNICIPIOS WHERE CODMUN=${codigo}; `

     execute.QueryToken(res,qry,'');
     
});
router.post("/update_gps_municipio", async(req,res)=>{

    const {codigo,latitud,longitud} = req.body;

    let qry = `UPDATE MUNICIPIOS 
                    SET 
                        LATITUD=${latitud},
                        LONGITUD=${longitud} 
                WHERE 
                    CODMUN=${codigo}; `

     execute.QueryToken(res,qry,'');
     
});

//municipios
//----------------------



//----------------------
//departamentos

router.post("/departamentos", async(req,res)=>{

    let qry = `SELECT CODDEPTO AS CODIGO, 
                DESDEPTO AS DESCRIPCION  
                FROM DEPARTAMENTOS; `

     execute.QueryToken(res,qry,'');
     
});
router.post("/insert_departamento", async(req,res)=>{

    const {descripcion} = req.body;

    let qry = `INSERT INTO DEPARTAMENTOS (DESDEPTO) 
        SELECT '${descripcion}' AS DESDEPTO; `

     execute.QueryToken(res,qry,'');
     
});
router.post("/edit_departamento", async(req,res)=>{

    const {codigo,descripcion} = req.body;

    let qry = `UPDATE DEPARTAMENTOS SET DESDEPTO='${descripcion}' WHERE CODDEPTO=${codigo}; `

     execute.QueryToken(res,qry,'');
     
});
router.post("/delete_departamento", async(req,res)=>{

    const {codigo} = req.body;

    let qry = `DELETE FROM DEPARTAMENTOS WHERE CODDEPTO=${codigo}; `

     execute.QueryToken(res,qry,'');
     
});

//departamentos
//----------------------


router.post("/sectores", async(req,res)=>{

    const {codmun} = req.body;

    let qry = `SELECT CODSECTOR AS CODIGO, 
                DESSECTOR AS DESCRIPCION  
                FROM SECTORES WHERE CODMUN=${codmun}; `

     execute.QueryToken(res,qry,'');
     
});
router.post("/insert_sector", async(req,res)=>{

    const {descripcion,codmun} = req.body;

    let qry = `INSERT INTO SECTORES (DESSECTOR,CODMUN) 
        SELECT '${descripcion}' AS DESSECTOR, ${codmun} AS CODMUN; `

     execute.QueryToken(res,qry,'');
     
});
router.post("/edit_sector", async(req,res)=>{

    const {codigo,descripcion} = req.body;

    let qry = `UPDATE SECTORES SET DESSECTOR='${descripcion}' WHERE CODSECTOR=${codigo}; `

     execute.QueryToken(res,qry,'');
     
});
router.post("/delete_sector", async(req,res)=>{

    const {codigo} = req.body;

    let qry = `DELETE FROM SECTORES WHERE CODSECTOR=${codigo}; `

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
router.post("/ruta_por_empleado", async (req, res) => {
    const { token, sucursal, codemp } = req.body;
    const emp = esc(sucursal);
    const ven = Number(codemp) || 0;

    let qry = `
        SELECT TOP 1 CODRUTA
          FROM RUTAS_CLIENTES
         WHERE EMPNIT = '${emp}'
           AND CODEMP = ${ven}
         ORDER BY CODRUTA
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/ruta_mercaderista_por_empleado", async (req, res) => {
    const { token, sucursal, codemp } = req.body;
    const emp = esc(sucursal);
    const ven = Number(codemp) || 0;

    let qry = `
        SELECT TOP 1 CODRUTA, DESRUTA AS RUTA
          FROM RUTAS_MERCADERISTAS
         WHERE EMPNIT = '${emp}'
           AND CODEMP = ${ven}
         ORDER BY CODRUTA
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/buscar_cliente_mercaderista", async (req, res) => {
    const { token, sucursal, codemp, codruta, dia, fecha, estado } = req.body;
    const emp = esc(sucursal);
    const ven = Number(codemp) || 0;
    const rutaBody = Number(codruta) || 0;
    const diaVisita = esc(dia || '');
    const fechaVal = esc((fecha || '').trim());
    const estadoVal = String(estado || 'PENDIENTE').toUpperCase();

    const filtroRuta = rutaBody > 0
        ? `(CLIENTES.CODRUTAM = ${rutaBody})`
        : `(CLIENTES.CODRUTAM = ISNULL((SELECT TOP 1 CODRUTA FROM RUTAS_MERCADERISTAS WHERE EMPNIT = '${emp}' AND CODEMP = ${ven}), -1))`;

    let filtroVisita = '';
    if (fechaVal && ven > 0) {
        const existsVisita = `
            SELECT 1 FROM MERCADERISTAS_VISITAS MV
             WHERE MV.EMPNIT = CLIENTES.EMPNIT
               AND MV.CODCLIENTE = CLIENTES.CODCLIENTE
               AND MV.CODEMP = ${ven}
               AND MV.FECHA = '${fechaVal}'`;
        if (estadoVal === 'VISITADO') {
            filtroVisita = `AND EXISTS (${existsVisita})`;
        } else {
            filtroVisita = `AND NOT EXISTS (${existsVisita})`;
        }
    }

    let qry = `
        SELECT CLIENTES.CODCLIENTE,
               CLIENTES.TIPONEGOCIO,
               CLIENTES.NEGOCIO,
               CLIENTES.NOMBRE,
               CLIENTES.DIRECCION,
               MUNICIPIOS.DESMUN,
               CLIENTES.LATITUD,
               CLIENTES.LONGITUD,
               ISNULL(CLIENTES.VISITAM, '') AS VISITAM,
               ISNULL(CLIENTES.CODRUTAM, 0) AS CODRUTAM
          FROM CLIENTES
          LEFT OUTER JOIN MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
         WHERE (CLIENTES.EMPNIT = '${emp}')
           AND ${filtroRuta}
           AND (CLIENTES.VISITAM = '${diaVisita}')
           AND (CLIENTES.HABILITADO = 'SI')
           ${filtroVisita}
         ORDER BY CLIENTES.NOMBRE
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/mercaderista_visita_guardar", async (req, res) => {
    const {
        token, sucursal, codemp, codclie, fecha, mes, anio,
        hora_inicio, novisitado, ota, vitrinas, pop,
    } = req.body;

    const emp = esc(sucursal);
    const ven = Number(codemp) || 0;
    const clie = Number(codclie) || 0;
    const fechaVal = esc((fecha || '').trim());
    const mesVal = Number(mes) || 0;
    const anioVal = Number(anio) || 0;
    const horaVal = esc((hora_inicio || '').trim());
    const motivoVal = esc((novisitado || '').trim());
    const otaVal = Number(ota) ? 1 : 0;
    const vitVal = Number(vitrinas) ? 1 : 0;
    const popVal = Number(pop) ? 1 : 0;

    if (!fechaVal || ven <= 0 || clie <= 0) {
        return res.status(400).send('error');
    }

    const qry = `
        IF EXISTS (
            SELECT 1 FROM MERCADERISTAS_VISITAS
             WHERE EMPNIT = '${emp}'
               AND CODEMP = ${ven}
               AND CODCLIENTE = ${clie}
               AND FECHA = '${fechaVal}'
        )
        BEGIN
            UPDATE MERCADERISTAS_VISITAS SET
                MES = ${mesVal},
                ANIO = ${anioVal},
                HORA_INICIO = '${horaVal}',
                NOVISITADO = '${motivoVal}',
                OTA = ${otaVal},
                VITRINAS = ${vitVal},
                POP = ${popVal}
             WHERE EMPNIT = '${emp}'
               AND CODEMP = ${ven}
               AND CODCLIENTE = ${clie}
               AND FECHA = '${fechaVal}';
        END
        ELSE
        BEGIN
            INSERT INTO MERCADERISTAS_VISITAS
                (EMPNIT, CODEMP, CODCLIENTE, FECHA, MES, ANIO, HORA_INICIO, NOVISITADO, OTA, VITRINAS, POP)
            VALUES
                ('${emp}', ${ven}, ${clie}, '${fechaVal}', ${mesVal}, ${anioVal}, '${horaVal}', '${motivoVal}', ${otaVal}, ${vitVal}, ${popVal});
        END
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/buscar_cliente_vendedor", async(req,res)=>{
   
    const { token, sucursal, filtro, codven, codruta, dia, fecha} = req.body;
    const emp = esc(sucursal);
    const ven = Number(codven) || 0;
    const rutaBody = Number(codruta) || 0;
    // Filtra por ruta del vendedor en RUTAS_CLIENTES (CODEMP), no por CLIENTES.CODEMPLEADO
    const filtroRuta = rutaBody > 0
        ? `(CLIENTES.CODRUTA = ${rutaBody})`
        : `(CLIENTES.CODRUTA = ISNULL((SELECT TOP 1 CODRUTA FROM RUTAS_CLIENTES WHERE EMPNIT = '${emp}' AND CODEMP = ${ven}), -1))`;

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
            (CLIENTES.EMPNIT='${emp}') AND 
            ${filtroRuta} AND
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
                    (CLIENTES.EMPNIT='${emp}') AND 
                    (CLIENTES.NOMBRE LIKE '%${filtro}%') AND
                    ${filtroRuta} AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                OR 
                    (CLIENTES.EMPNIT='${emp}') AND 
                    (CLIENTES.NIT='${filtro}') AND
                    ${filtroRuta} AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                OR 
                    (CLIENTES.EMPNIT='${emp}') AND 
                    (CLIENTES.NEGOCIO LIKE '%${filtro}%') AND
                    ${filtroRuta} AND
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
                    (CLIENTES.EMPNIT='${emp}') AND 
                    (CLIENTES.NOMBRE LIKE '%${filtro}%') AND
                    ${filtroRuta} AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')

                OR 
                    (CLIENTES.EMPNIT='${emp}') AND 
                    (CLIENTES.NIT='${filtro}') AND
                    ${filtroRuta} AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                OR 
                    (CLIENTES.EMPNIT='${emp}') AND 
                    (CLIENTES.NEGOCIO='${filtro}') AND
                    ${filtroRuta} AND
                    (CLIENTES.DIAVISITA='${dia}') AND
                    (CLIENTES.HABILITADO='SI')
                OR 
                    (CLIENTES.EMPNIT='${emp}') AND 
                    (CLIENTES.CODCLIENTE=${filtro}) AND
                    ${filtroRuta} AND
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

