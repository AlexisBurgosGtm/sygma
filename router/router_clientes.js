const execute = require('../connection');
const express = require('express');
const router = express.Router();
const storage = require('../services/webdavStorage');

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
    // CENSO (NA): siempre el 100% de clientes del filtro. Resto: TOP 50 si no hay vendedor/día.
    const topClause = (st === 'NA' || tieneFiltroVen || tieneFiltroDia) ? '' : 'TOP 50';

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
   
    const { token, sucursal, st, codven, dia } = req.body;
    const emp = esc(sucursal);
    const ven = Number(codven) || 0;
    const diaVal = esc((dia || '').trim());
    const tieneFiltroVen = ven > 0;
    const tieneFiltroDia = diaVal !== '' && diaVal !== 'TODOS';

    let whereSt = '';
    if (st === 'NOGPS') {
        whereSt = `AND (ISNULL(CLIENTES.LATITUD,'0')='0')`;
    } else {
        whereSt = `AND (CLIENTES.HABILITADO='${esc(st || 'SI')}')`;
    }

    const whereVen = tieneFiltroVen ? `AND (CLIENTES.CODEMPLEADO = ${ven})` : '';
    const whereDia = tieneFiltroDia ? `AND (CLIENTES.DIAVISITA = '${diaVal}')` : '';

    let qry = `
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
        WHERE (CLIENTES.EMPNIT = '${emp}')       
         ${whereSt}
         ${whereVen}
         ${whereDia}
        ORDER BY CLIENTES.NOMBRE
        `;

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
    const { token, sucursal, codemp, codruta, dia, fecha, estado, alcance, filtro } = req.body;
    const emp = esc(sucursal);
    const ven = Number(codemp) || 0;
    const rutaBody = Number(codruta) || 0;
    const diaVisita = esc(dia || '');
    const fechaVal = esc((fecha || '').trim());
    const estadoVal = String(estado || 'PENDIENTE').toUpperCase();
    const alcanceVal = String(alcance || 'PROPIOS').toUpperCase();
    const filtroVal = esc((filtro || '').trim());

    if (alcanceVal === 'AJENOS') {
        if (!filtroVal) {
            return res.json({ recordset: [], rowsAffected: [0] });
        }
        const qryAjenos = `
        SELECT TOP 100 CLIENTES.CODCLIENTE,
               CLIENTES.TIPONEGOCIO,
               CLIENTES.NEGOCIO,
               CLIENTES.NOMBRE,
               CLIENTES.DIRECCION,
               MUNICIPIOS.DESMUN,
               CLIENTES.LATITUD,
               CLIENTES.LONGITUD,
               ISNULL(CLIENTES.VISITAM, '') AS VISITAM,
               ISNULL(CLIENTES.CODRUTAM, 0) AS CODRUTAM,
               ISNULL((
                   SELECT TOP 1 MV2.HORA_INICIO
                     FROM MERCADERISTAS_VISITAS MV2
                    WHERE MV2.EMPNIT = CLIENTES.EMPNIT
                      AND MV2.CODCLIENTE = CLIENTES.CODCLIENTE
                      AND MV2.CODEMP = ${ven}
                      AND MV2.FECHA = '${fechaVal}'
               ), '') AS HORA_INICIO
          FROM CLIENTES
          LEFT OUTER JOIN MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
         WHERE (CLIENTES.EMPNIT = '${emp}')
           AND (CLIENTES.HABILITADO = 'SI')
           AND (
                CLIENTES.NOMBRE LIKE '%${filtroVal}%'
             OR CLIENTES.NEGOCIO LIKE '%${filtroVal}%'
             OR CLIENTES.DIRECCION LIKE '%${filtroVal}%'
             OR ISNULL(CLIENTES.NIT, '') LIKE '%${filtroVal}%'
             OR CAST(CLIENTES.CODCLIENTE AS VARCHAR(20)) LIKE '%${filtroVal}%'
           )
         ORDER BY CLIENTES.NOMBRE`;
        return execute.QueryToken(res, qryAjenos, token);
    }

    const filtroRuta = rutaBody > 0
        ? `(CLIENTES.CODRUTAM = ${rutaBody})`
        : `(CLIENTES.CODRUTAM = ISNULL((SELECT TOP 1 CODRUTA FROM RUTAS_MERCADERISTAS WHERE EMPNIT = '${emp}' AND CODEMP = ${ven}), -1))`;

    let filtroVisita = '';
    let joinVisita = '';
    let orderBy = 'CLIENTES.NOMBRE';

    if (fechaVal && ven > 0) {
        const existsBase = `
            SELECT 1 FROM MERCADERISTAS_VISITAS MV
             WHERE MV.EMPNIT = CLIENTES.EMPNIT
               AND MV.CODCLIENTE = CLIENTES.CODCLIENTE
               AND MV.CODEMP = ${ven}
               AND MV.FECHA = '${fechaVal}'`;

        if (estadoVal === 'VISITADO') {
            filtroVisita = `AND EXISTS (
                ${existsBase}
                   AND ISNULL(MV.HORA_FIN, '') <> ''
            )`;
            joinVisita = `
          LEFT OUTER JOIN MERCADERISTAS_VISITAS MV
            ON MV.EMPNIT = CLIENTES.EMPNIT
           AND MV.CODCLIENTE = CLIENTES.CODCLIENTE
           AND MV.CODEMP = ${ven}
           AND MV.FECHA = '${fechaVal}'`;
            orderBy = 'MV.HORA_FIN DESC, CLIENTES.NOMBRE';
        } else if (estadoVal === 'ENCURSO') {
            filtroVisita = `AND EXISTS (
                ${existsBase}
                   AND ISNULL(MV.HORA_INICIO, '') <> ''
                   AND ISNULL(MV.HORA_FIN, '') = ''
            )`;
            joinVisita = `
          INNER JOIN MERCADERISTAS_VISITAS MV
            ON MV.EMPNIT = CLIENTES.EMPNIT
           AND MV.CODCLIENTE = CLIENTES.CODCLIENTE
           AND MV.CODEMP = ${ven}
           AND MV.FECHA = '${fechaVal}'
           AND ISNULL(MV.HORA_INICIO, '') <> ''
           AND ISNULL(MV.HORA_FIN, '') = ''`;
            orderBy = 'MV.HORA_INICIO DESC, CLIENTES.NOMBRE';
        } else {
            filtroVisita = `AND NOT EXISTS (${existsBase})`;
        }
    }

    let qry = '';

    if (fechaVal && ven > 0 && (estadoVal === 'ENCURSO' || estadoVal === 'VISITADO')) {
        const filtroFin = estadoVal === 'VISITADO'
            ? `AND ISNULL(MV.HORA_FIN, '') <> ''`
            : `AND ISNULL(MV.HORA_INICIO, '') <> ''
               AND ISNULL(MV.HORA_FIN, '') = ''`;
        const orderVisita = estadoVal === 'VISITADO'
            ? 'MV.HORA_FIN DESC, CLIENTES.NOMBRE'
            : 'MV.HORA_INICIO DESC, CLIENTES.NOMBRE';

        qry = `
        SELECT CLIENTES.CODCLIENTE,
               CLIENTES.TIPONEGOCIO,
               CLIENTES.NEGOCIO,
               CLIENTES.NOMBRE,
               CLIENTES.DIRECCION,
               MUNICIPIOS.DESMUN,
               CLIENTES.LATITUD,
               CLIENTES.LONGITUD,
               ISNULL(CLIENTES.VISITAM, '') AS VISITAM,
               ISNULL(CLIENTES.CODRUTAM, 0) AS CODRUTAM,
               ISNULL(MV.HORA_INICIO, '') AS HORA_INICIO
          FROM MERCADERISTAS_VISITAS MV
          INNER JOIN CLIENTES
            ON CLIENTES.EMPNIT = MV.EMPNIT
           AND CLIENTES.CODCLIENTE = MV.CODCLIENTE
          LEFT OUTER JOIN MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
         WHERE MV.EMPNIT = '${emp}'
           AND MV.CODEMP = ${ven}
           AND MV.FECHA = '${fechaVal}'
           AND CLIENTES.HABILITADO = 'SI'
           ${filtroFin}
         ORDER BY ${orderVisita}`;
    } else {
        qry = `
        SELECT CLIENTES.CODCLIENTE,
               CLIENTES.TIPONEGOCIO,
               CLIENTES.NEGOCIO,
               CLIENTES.NOMBRE,
               CLIENTES.DIRECCION,
               MUNICIPIOS.DESMUN,
               CLIENTES.LATITUD,
               CLIENTES.LONGITUD,
               ISNULL(CLIENTES.VISITAM, '') AS VISITAM,
               ISNULL(CLIENTES.CODRUTAM, 0) AS CODRUTAM,
               ISNULL((
                   SELECT TOP 1 MV2.HORA_INICIO
                     FROM MERCADERISTAS_VISITAS MV2
                    WHERE MV2.EMPNIT = CLIENTES.EMPNIT
                      AND MV2.CODCLIENTE = CLIENTES.CODCLIENTE
                      AND MV2.CODEMP = ${ven}
                      AND MV2.FECHA = '${fechaVal}'
               ), '') AS HORA_INICIO
          FROM CLIENTES
          LEFT OUTER JOIN MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
          ${joinVisita}
         WHERE (CLIENTES.EMPNIT = '${emp}')
           AND ${filtroRuta}
           AND (CLIENTES.VISITAM = '${diaVisita}')
           AND (CLIENTES.HABILITADO = 'SI')
           ${filtroVisita}
         ORDER BY ${orderBy}`;
    }

    execute.QueryToken(res, qry, token);
});

router.post("/mercaderista_productos_faltantes", async (req, res) => {
    const { token } = req.body;

    const qry = `
        SELECT PRODUCTOS.CODPROD,
               PRODUCTOS.DESPROD,
               ISNULL(MARCAS.DESMARCA, '') AS DESMARCA
          FROM PRODUCTOS
          LEFT OUTER JOIN MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA
         WHERE PRODUCTOS.CLASIF_BI = 78
           AND PRODUCTOS.HABILITADO = 'SI'
         ORDER BY PRODUCTOS.CODPROD
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/mercaderista_lista_precios", async (req, res) => {
    const { token } = req.body;

    const qry = `
        SELECT PRODUCTOS.CODPROD,
               PRODUCTOS.DESPROD,
               PRECIOS.CODMEDIDA,
               PRECIOS.EQUIVALE,
               ISNULL(PRECIOS.PRECIO, 0) AS PRECIO
          FROM PRODUCTOS
         INNER JOIN PRECIOS ON PRODUCTOS.CODPROD = PRECIOS.CODPROD
         WHERE PRODUCTOS.HABILITADO = 'SI'
           AND PRECIOS.HABILITADO = 'SI'
         ORDER BY PRODUCTOS.DESPROD, PRECIOS.CODMEDIDA
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/supervisor_mercaderistas_visitas", async (req, res) => {
    const { token, sucursal, fi, ff, codemp, tipo } = req.body;
    const emp = esc(sucursal);
    const fiVal = esc((fi || '').trim());
    const ffVal = esc((ff || '').trim());
    const merc = Number(codemp) || 0;
    const tipoVal = String(tipo || '').trim().toLowerCase();

    if (!fiVal || !ffVal) {
        return res.status(400).send('error');
    }

    const filtroEmp = (sucursal === '%' || !String(sucursal || '').trim())
        ? '1=1'
        : `MV.EMPNIT = '${emp}'`;
    const filtroMerc = merc > 0 ? `AND MV.CODEMP = ${merc}` : '';

    let filtroTipo = '';
    if (tipoVal === 'ota') {
        filtroTipo = 'AND ISNULL(MV.OTA, 0) = 1';
    } else if (tipoVal === 'vitrinas') {
        filtroTipo = 'AND ISNULL(MV.VITRINAS, 0) = 1';
    } else if (tipoVal === 'detergentes') {
        filtroTipo = 'AND ISNULL(MV.DETERGENTES, 0) = 1';
    } else if (tipoVal === 'pop') {
        filtroTipo = 'AND ISNULL(MV.POP, 0) = 1';
    } else if (tipoVal === 'faltante') {
        filtroTipo = `AND LTRIM(RTRIM(ISNULL(MV.FALTANTES, ''))) NOT IN ('', '[]', 'null', 'NULL')`;
    } else if (tipoVal === 'noatendidas') {
        filtroTipo = `AND LTRIM(RTRIM(ISNULL(MV.NOVISITADO, ''))) <> ''`;
    } else if (tipoVal === 'visitas') {
        filtroTipo = `AND LTRIM(RTRIM(ISNULL(MV.NOVISITADO, ''))) = ''`;
    } else if (tipoVal === 'horas') {
        filtroTipo = `AND LTRIM(RTRIM(ISNULL(MV.NOVISITADO, ''))) = ''
                      AND ISNULL(MV.HORA_INICIO, '') <> ''
                      AND ISNULL(MV.HORA_FIN, '') <> ''`;
    }

    const qry = `
        SELECT MV.EMPNIT,
               MV.CODEMP,
               MV.CODCLIENTE,
               MV.FECHA,
               ISNULL(MV.HORA_INICIO, '') AS HORA_INICIO,
               ISNULL(MV.HORA_FIN, '') AS HORA_FIN,
               ISNULL(MV.NOVISITADO, '') AS NOVISITADO,
               ISNULL(MV.OTA, 0) AS OTA,
               ISNULL(MV.VITRINAS, 0) AS VITRINAS,
               ISNULL(MV.DETERGENTES, 0) AS DETERGENTES,
               ISNULL(MV.POP, 0) AS POP,
               ISNULL(MV.FALTANTES, '') AS FALTANTES,
               ISNULL(E.NOMEMPLEADO, '') AS NOMMERCADERISTA,
               ISNULL(C.NOMBRE, '') AS NOMBRE_CLIENTE,
               ISNULL(C.NEGOCIO, '') AS NEGOCIO,
               ISNULL(EMP.NOMBRE, MV.EMPNIT) AS NOMEMPRESA
          FROM MERCADERISTAS_VISITAS MV
          LEFT OUTER JOIN EMPLEADOS E
            ON MV.EMPNIT = E.EMPNIT
           AND MV.CODEMP = E.CODEMPLEADO
          LEFT OUTER JOIN CLIENTES C
            ON MV.EMPNIT = C.EMPNIT
           AND MV.CODCLIENTE = C.CODCLIENTE
          LEFT OUTER JOIN EMPRESAS EMP
            ON MV.EMPNIT = EMP.EMPNIT
         WHERE ${filtroEmp}
           ${filtroMerc}
           ${filtroTipo}
           AND MV.FECHA >= '${fiVal}'
           AND MV.FECHA <= '${ffVal}'
         ORDER BY MV.FECHA DESC, MV.HORA_INICIO DESC, E.NOMEMPLEADO, C.NOMBRE
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/supervisor_mercaderistas_resumen", async (req, res) => {
    const { token, sucursal, fi, ff, codemp } = req.body;
    const emp = esc(sucursal);
    const fiVal = esc((fi || '').trim());
    const ffVal = esc((ff || '').trim());
    const merc = Number(codemp) || 0;

    if (!fiVal || !ffVal) {
        return res.status(400).send('error');
    }

    const filtroEmp = (sucursal === '%' || !String(sucursal || '').trim())
        ? '1=1'
        : `E.EMPNIT = '${emp}'`;
    const filtroMerc = merc > 0 ? `AND E.CODEMPLEADO = ${merc}` : '';

    const qry = `
        SELECT E.EMPNIT,
               E.CODEMPLEADO AS CODEMP,
               ISNULL(E.NOMEMPLEADO, '') AS NOMMERCADERISTA,
               ISNULL(EMP.NOMBRE, E.EMPNIT) AS NOMEMPRESA,
               ISNULL(V.TOTAL_VISITAS, 0) AS TOTAL_VISITAS,
               ISNULL(V.TOTAL_OTA, 0) AS TOTAL_OTA,
               ISNULL(V.TOTAL_VITRINAS, 0) AS TOTAL_VITRINAS,
               ISNULL(V.TOTAL_DETERGENTES, 0) AS TOTAL_DETERGENTES,
               ISNULL(V.TOTAL_POP, 0) AS TOTAL_POP,
               ISNULL(V.TOTAL_FALTANTE, 0) AS TOTAL_FALTANTE,
               ISNULL(V.TOTAL_NOVISITADO, 0) AS TOTAL_NOVISITADO,
               ISNULL(V.MINUTOS_VISITAS, 0) AS MINUTOS_VISITAS
          FROM EMPLEADOS E
          LEFT OUTER JOIN EMPRESAS EMP
            ON E.EMPNIT = EMP.EMPNIT
          LEFT OUTER JOIN (
                SELECT MV.EMPNIT,
                       MV.CODEMP,
                       SUM(CASE WHEN LTRIM(RTRIM(ISNULL(MV.NOVISITADO, ''))) = '' THEN 1 ELSE 0 END) AS TOTAL_VISITAS,
                       SUM(CASE WHEN ISNULL(MV.OTA, 0) = 1 THEN 1 ELSE 0 END) AS TOTAL_OTA,
                       SUM(CASE WHEN ISNULL(MV.VITRINAS, 0) = 1 THEN 1 ELSE 0 END) AS TOTAL_VITRINAS,
                       SUM(CASE WHEN ISNULL(MV.DETERGENTES, 0) = 1 THEN 1 ELSE 0 END) AS TOTAL_DETERGENTES,
                       SUM(CASE WHEN ISNULL(MV.POP, 0) = 1 THEN 1 ELSE 0 END) AS TOTAL_POP,
                       SUM(CASE WHEN LTRIM(RTRIM(ISNULL(MV.FALTANTES, ''))) NOT IN ('', '[]', 'null', 'NULL') THEN 1 ELSE 0 END) AS TOTAL_FALTANTE,
                       SUM(CASE WHEN LTRIM(RTRIM(ISNULL(MV.NOVISITADO, ''))) <> '' THEN 1 ELSE 0 END) AS TOTAL_NOVISITADO,
                       SUM(CASE
                             WHEN LTRIM(RTRIM(ISNULL(MV.NOVISITADO, ''))) = ''
                              AND ISNULL(MV.HORA_INICIO, '') <> ''
                              AND ISNULL(MV.HORA_FIN, '') <> ''
                              AND TRY_CAST(MV.HORA_INICIO AS TIME) IS NOT NULL
                              AND TRY_CAST(MV.HORA_FIN AS TIME) IS NOT NULL
                             THEN DATEDIFF(MINUTE, TRY_CAST(MV.HORA_INICIO AS TIME), TRY_CAST(MV.HORA_FIN AS TIME))
                             ELSE 0
                           END) AS MINUTOS_VISITAS
                  FROM MERCADERISTAS_VISITAS MV
                 WHERE MV.FECHA >= '${fiVal}'
                   AND MV.FECHA <= '${ffVal}'
                 GROUP BY MV.EMPNIT, MV.CODEMP
          ) V
            ON E.EMPNIT = V.EMPNIT
           AND E.CODEMPLEADO = V.CODEMP
         WHERE E.CODPUESTO = 9
           AND E.ACTIVO = 'SI'
           AND ${filtroEmp}
           ${filtroMerc}
         ORDER BY E.NOMEMPLEADO
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/mercaderista_visita_iniciar", async (req, res) => {
    const { token, sucursal, codemp, codclie, fecha, mes, anio, hora_inicio } = req.body;
    const emp = String(sucursal || '').trim();
    const ven = Number(codemp) || 0;
    const clie = Number(codclie) || 0;
    const fechaVal = String(fecha || '').trim().substring(0, 10);
    const mesVal = Number(mes) || 0;
    const anioVal = Number(anio) || 0;
    const horaVal = String(hora_inicio || '').trim();

    const sendResult = (RESULT, MENSAJE) => res.send({
        recordset: [{ RESULT, MENSAJE: MENSAJE || '' }],
        rowsAffected: [1],
    });

    if (!fechaVal || !horaVal || ven <= 0 || clie <= 0) {
        return sendResult('error', 'Faltan datos para iniciar la visita (fecha, hora, empleado o cliente)');
    }

    try {
        const result = await execute.TransactionToken(token, async (transaction, sql) => {
            const run = (text, inputs) => {
                const request = new sql.Request(transaction);
                (inputs || []).forEach(([name, type, value]) => request.input(name, type, value));
                return request.query(text);
            };

            const cli = await run(`
                SELECT TOP 1 CODCLIENTE, ISNULL(HABILITADO, '') AS HABILITADO
                  FROM CLIENTES
                 WHERE EMPNIT = @empnit
                   AND CODCLIENTE = @codclie
            `, [
                ['empnit', sql.VarChar(50), emp],
                ['codclie', sql.Int, clie],
            ]);

            if (!cli.recordset.length) {
                return {
                    RESULT: 'sin_cliente',
                    MENSAJE: `El cliente ${clie} no existe en la sucursal ${emp}`,
                };
            }
            if (String(cli.recordset[0].HABILITADO || '').toUpperCase() !== 'SI') {
                return {
                    RESULT: 'error',
                    MENSAJE: `El cliente ${clie} no está habilitado`,
                };
            }

            const exists = await run(`
                SELECT TOP 1 CODEMP, ISNULL(HORA_FIN, '') AS HORA_FIN
                  FROM MERCADERISTAS_VISITAS
                 WHERE EMPNIT = @empnit
                   AND CODEMP = @codemp
                   AND CODCLIENTE = @codclie
                   AND CONVERT(date, FECHA) = CONVERT(date, @fecha)
            `, [
                ['empnit', sql.VarChar(50), emp],
                ['codemp', sql.Int, ven],
                ['codclie', sql.Int, clie],
                ['fecha', sql.VarChar(10), fechaVal],
            ]);

            if (exists.recordset.length) {
                const fin = String(exists.recordset[0].HORA_FIN || '').trim();
                return {
                    RESULT: 'existe',
                    MENSAJE: fin
                        ? 'Esta visita ya fue finalizada en la fecha seleccionada'
                        : 'Ya hay una visita en curso para este cliente en la fecha seleccionada',
                };
            }

            await run(`
                INSERT INTO MERCADERISTAS_VISITAS
                    (EMPNIT, CODEMP, CODCLIENTE, FECHA, MES, ANIO, HORA_INICIO, HORA_FIN,
                     NOVISITADO, OTA, VITRINAS, DETERGENTES, POP,
                     OTA_F_ANTES, OTA_F_DESPUES, VITRINAS_F_ANTES, VITRINAS_F_DESPUES,
                     DETERGENTES_F_ANTES, DETERGENTES_F_DESPUES, POP_F_ANTES, POP_F_DESPUES, FALTANTES)
                VALUES
                    (@empnit, @codemp, @codclie, @fecha, @mes, @anio, @hora, '',
                     '', 0, 0, 0, 0, '', '', '', '', '', '', '', '', '')
            `, [
                ['empnit', sql.VarChar(50), emp],
                ['codemp', sql.Int, ven],
                ['codclie', sql.Int, clie],
                ['fecha', sql.VarChar(10), fechaVal],
                ['mes', sql.Int, mesVal],
                ['anio', sql.Int, anioVal],
                ['hora', sql.VarChar(20), horaVal],
            ]);

            return { RESULT: 'ok', MENSAJE: '' };
        });

        res.send({ recordset: [result], rowsAffected: [1] });
    } catch (err) {
        const msg = err && err.message ? String(err.message) : 'Error de base de datos al iniciar la visita';
        console.log('[mercaderista_visita_iniciar]', msg);
        sendResult('error', msg);
    }
});

router.post("/mercaderista_visita_finalizar", async (req, res) => {
    const { token, sucursal, codemp, codclie, fecha, hora_fin } = req.body;
    const emp = esc(sucursal);
    const ven = Number(codemp) || 0;
    const clie = Number(codclie) || 0;
    const fechaVal = esc((fecha || '').trim());
    const horaFinVal = esc((hora_fin || '').trim());

    if (!fechaVal || !horaFinVal || ven <= 0 || clie <= 0) {
        return res.status(400).send('error');
    }

    const qry = `
        UPDATE MERCADERISTAS_VISITAS SET
            HORA_FIN = '${horaFinVal}'
         WHERE EMPNIT = '${emp}'
           AND CODEMP = ${ven}
           AND CODCLIENTE = ${clie}
           AND FECHA = '${fechaVal}'
           AND ISNULL(HORA_INICIO, '') <> ''
           AND ISNULL(HORA_FIN, '') = '';
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/mercaderista_visita_guardar", async (req, res) => {
    const {
        token, sucursal, codemp, codclie, fecha, mes, anio,
        hora_inicio, hora_fin, novisitado, ota, vitrinas, detergentes, pop,
        ota_f_antes, ota_f_despues,
        vitrinas_f_antes, vitrinas_f_despues,
        detergentes_f_antes, detergentes_f_despues,
        pop_f_antes, pop_f_despues,
        faltantes,
        actualizar_solo,
        modo,
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
    const detVal = Number(detergentes) ? 1 : 0;
    const popVal = Number(pop) ? 1 : 0;
    const otaFA = esc((ota_f_antes || '').trim());
    const otaFD = esc((ota_f_despues || '').trim());
    const vitFA = esc((vitrinas_f_antes || '').trim());
    const vitFD = esc((vitrinas_f_despues || '').trim());
    const detFA = esc((detergentes_f_antes || '').trim());
    const detFD = esc((detergentes_f_despues || '').trim());
    const popFA = esc((pop_f_antes || '').trim());
    const popFD = esc((pop_f_despues || '').trim());
    const faltantesVal = esc((faltantes || '').trim());
    const horaFinVal = esc((hora_fin || '').trim());
    const soloActualizar = actualizar_solo === true || actualizar_solo === 'true' || actualizar_solo === 1 || actualizar_solo === '1';
    const modoVal = esc((modo || '').trim().toLowerCase());

    if (!fechaVal || ven <= 0 || clie <= 0) {
        return res.status(400).send('error');
    }

    let setActualizar = '';
    if (modoVal === 'actividades') {
        setActualizar = `
            MES = ${mesVal},
            ANIO = ${anioVal},
            OTA = CASE WHEN ${otaVal} = 1 OR '${otaFA}' <> '' OR '${otaFD}' <> '' THEN 1 ELSE OTA END,
            VITRINAS = CASE WHEN ${vitVal} = 1 OR '${vitFA}' <> '' OR '${vitFD}' <> '' THEN 1 ELSE VITRINAS END,
            DETERGENTES = CASE WHEN ${detVal} = 1 OR '${detFA}' <> '' OR '${detFD}' <> '' THEN 1 ELSE DETERGENTES END,
            POP = CASE WHEN ${popVal} = 1 OR '${popFA}' <> '' OR '${popFD}' <> '' THEN 1 ELSE POP END,
            OTA_F_ANTES = CASE WHEN '${otaFA}' <> '' THEN '${otaFA}' ELSE OTA_F_ANTES END,
            OTA_F_DESPUES = CASE WHEN '${otaFD}' <> '' THEN '${otaFD}' ELSE OTA_F_DESPUES END,
            VITRINAS_F_ANTES = CASE WHEN '${vitFA}' <> '' THEN '${vitFA}' ELSE VITRINAS_F_ANTES END,
            VITRINAS_F_DESPUES = CASE WHEN '${vitFD}' <> '' THEN '${vitFD}' ELSE VITRINAS_F_DESPUES END,
            DETERGENTES_F_ANTES = CASE WHEN '${detFA}' <> '' THEN '${detFA}' ELSE DETERGENTES_F_ANTES END,
            DETERGENTES_F_DESPUES = CASE WHEN '${detFD}' <> '' THEN '${detFD}' ELSE DETERGENTES_F_DESPUES END,
            POP_F_ANTES = CASE WHEN '${popFA}' <> '' THEN '${popFA}' ELSE POP_F_ANTES END,
            POP_F_DESPUES = CASE WHEN '${popFD}' <> '' THEN '${popFD}' ELSE POP_F_DESPUES END`;
    } else if (modoVal === 'faltantes') {
        setActualizar = `
            MES = ${mesVal},
            ANIO = ${anioVal},
            FALTANTES = '${faltantesVal}'`;
    } else {
        setActualizar = `
            MES = ${mesVal},
            ANIO = ${anioVal},
            NOVISITADO = '${motivoVal}',
            OTA = ${otaVal},
            VITRINAS = ${vitVal},
            DETERGENTES = ${detVal},
            POP = ${popVal},
            OTA_F_ANTES = CASE WHEN '${otaFA}' <> '' THEN '${otaFA}' ELSE OTA_F_ANTES END,
            OTA_F_DESPUES = CASE WHEN '${otaFD}' <> '' THEN '${otaFD}' ELSE OTA_F_DESPUES END,
            VITRINAS_F_ANTES = CASE WHEN '${vitFA}' <> '' THEN '${vitFA}' ELSE VITRINAS_F_ANTES END,
            VITRINAS_F_DESPUES = CASE WHEN '${vitFD}' <> '' THEN '${vitFD}' ELSE VITRINAS_F_DESPUES END,
            DETERGENTES_F_ANTES = CASE WHEN '${detFA}' <> '' THEN '${detFA}' ELSE DETERGENTES_F_ANTES END,
            DETERGENTES_F_DESPUES = CASE WHEN '${detFD}' <> '' THEN '${detFD}' ELSE DETERGENTES_F_DESPUES END,
            POP_F_ANTES = CASE WHEN '${popFA}' <> '' THEN '${popFA}' ELSE POP_F_ANTES END,
            POP_F_DESPUES = CASE WHEN '${popFD}' <> '' THEN '${popFD}' ELSE POP_F_DESPUES END,
            FALTANTES = CASE WHEN '${faltantesVal}' <> '' THEN '${faltantesVal}' ELSE FALTANTES END`;
    }

    const qry = soloActualizar ? `
        UPDATE MERCADERISTAS_VISITAS SET
            ${setActualizar}
         WHERE EMPNIT = '${emp}'
           AND CODEMP = ${ven}
           AND CODCLIENTE = ${clie}
           AND FECHA = '${fechaVal}';
    ` : `
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
                HORA_INICIO = CASE WHEN '${horaVal}' <> '' THEN '${horaVal}' ELSE HORA_INICIO END,
                HORA_FIN = CASE WHEN '${horaFinVal}' <> '' THEN '${horaFinVal}' ELSE HORA_FIN END,
                NOVISITADO = '${motivoVal}',
                OTA = ${otaVal},
                VITRINAS = ${vitVal},
                DETERGENTES = ${detVal},
                POP = ${popVal},
                OTA_F_ANTES = '${otaFA}',
                OTA_F_DESPUES = '${otaFD}',
                VITRINAS_F_ANTES = '${vitFA}',
                VITRINAS_F_DESPUES = '${vitFD}',
                DETERGENTES_F_ANTES = '${detFA}',
                DETERGENTES_F_DESPUES = '${detFD}',
                POP_F_ANTES = '${popFA}',
                POP_F_DESPUES = '${popFD}',
                FALTANTES = '${faltantesVal}'
             WHERE EMPNIT = '${emp}'
               AND CODEMP = ${ven}
               AND CODCLIENTE = ${clie}
               AND FECHA = '${fechaVal}';
        END
        ELSE
        BEGIN
            INSERT INTO MERCADERISTAS_VISITAS
                (EMPNIT, CODEMP, CODCLIENTE, FECHA, MES, ANIO, HORA_INICIO, HORA_FIN, NOVISITADO, OTA, VITRINAS, DETERGENTES, POP,
                 OTA_F_ANTES, OTA_F_DESPUES, VITRINAS_F_ANTES, VITRINAS_F_DESPUES,
                 DETERGENTES_F_ANTES, DETERGENTES_F_DESPUES, POP_F_ANTES, POP_F_DESPUES, FALTANTES)
            VALUES
                ('${emp}', ${ven}, ${clie}, '${fechaVal}', ${mesVal}, ${anioVal}, '${horaVal}', ${horaFinVal ? `'${horaFinVal}'` : 'NULL'}, '${motivoVal}', ${otaVal}, ${vitVal}, ${detVal}, ${popVal},
                 '${otaFA}', '${otaFD}', '${vitFA}', '${vitFD}', '${detFA}', '${detFD}', '${popFA}', '${popFD}', '${faltantesVal}');
        END
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/mercaderista_visita_detalle", async (req, res) => {
    const { token, sucursal, codemp, codclie, fecha } = req.body;
    const emp = esc(sucursal);
    const ven = Number(codemp) || 0;
    const clie = Number(codclie) || 0;
    const fechaVal = esc((fecha || '').trim());

    if (!fechaVal || ven <= 0 || clie <= 0) {
        return res.status(400).send('error');
    }

    const qry = `
        SELECT TOP 1
               MV.EMPNIT,
               MV.CODEMP,
               MV.CODCLIENTE,
               CLIENTES.NOMBRE,
               CLIENTES.NEGOCIO,
               MV.FECHA,
               MV.MES,
               MV.ANIO,
               ISNULL(MV.HORA_INICIO, '') AS HORA_INICIO,
               ISNULL(MV.HORA_FIN, '') AS HORA_FIN,
               ISNULL(MV.NOVISITADO, '') AS NOVISITADO,
               ISNULL(MV.OTA, 0) AS OTA,
               ISNULL(MV.VITRINAS, 0) AS VITRINAS,
               ISNULL(MV.DETERGENTES, 0) AS DETERGENTES,
               ISNULL(MV.POP, 0) AS POP,
               ISNULL(MV.OTA_F_ANTES, '') AS OTA_F_ANTES,
               ISNULL(MV.OTA_F_DESPUES, '') AS OTA_F_DESPUES,
               ISNULL(MV.VITRINAS_F_ANTES, '') AS VITRINAS_F_ANTES,
               ISNULL(MV.VITRINAS_F_DESPUES, '') AS VITRINAS_F_DESPUES,
               ISNULL(MV.DETERGENTES_F_ANTES, '') AS DETERGENTES_F_ANTES,
               ISNULL(MV.DETERGENTES_F_DESPUES, '') AS DETERGENTES_F_DESPUES,
               ISNULL(MV.POP_F_ANTES, '') AS POP_F_ANTES,
               ISNULL(MV.POP_F_DESPUES, '') AS POP_F_DESPUES,
               ISNULL(MV.FALTANTES, '') AS FALTANTES
          FROM MERCADERISTAS_VISITAS MV
          LEFT OUTER JOIN CLIENTES
            ON CLIENTES.EMPNIT = MV.EMPNIT
           AND CLIENTES.CODCLIENTE = MV.CODCLIENTE
         WHERE MV.EMPNIT = '${emp}'
           AND MV.CODEMP = ${ven}
           AND MV.CODCLIENTE = ${clie}
           AND MV.FECHA = '${fechaVal}'
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/mercaderista_visita_eliminar", async (req, res) => {
    const { token, sucursal, codemp, codclie, fecha } = req.body;
    const emp = esc(sucursal);
    const ven = Number(codemp) || 0;
    const clie = Number(codclie) || 0;
    const fechaVal = esc((fecha || '').trim());
    const folder = '/XELASOL';

    if (!fechaVal || ven <= 0 || clie <= 0) {
        return res.status(400).send({ ok: false, error: 'datos incompletos' });
    }

    try {
        const qrySelect = `
            SELECT TOP 1
                   ISNULL(OTA_F_ANTES, '') AS OTA_F_ANTES,
                   ISNULL(OTA_F_DESPUES, '') AS OTA_F_DESPUES,
                   ISNULL(VITRINAS_F_ANTES, '') AS VITRINAS_F_ANTES,
                   ISNULL(VITRINAS_F_DESPUES, '') AS VITRINAS_F_DESPUES,
                   ISNULL(DETERGENTES_F_ANTES, '') AS DETERGENTES_F_ANTES,
                   ISNULL(DETERGENTES_F_DESPUES, '') AS DETERGENTES_F_DESPUES,
                   ISNULL(POP_F_ANTES, '') AS POP_F_ANTES,
                   ISNULL(POP_F_DESPUES, '') AS POP_F_DESPUES
              FROM MERCADERISTAS_VISITAS
             WHERE EMPNIT = '${emp}'
               AND CODEMP = ${ven}
               AND CODCLIENTE = ${clie}
               AND FECHA = '${fechaVal}'
        `;

        const data = await execute.get_data_qry(qrySelect, token);
        const row = (data && data.recordset && data.recordset[0]) ? data.recordset[0] : null;

        if (!row) {
            return res.status(404).send({ ok: false, error: 'Visita no encontrada' });
        }

        const fotos = [
            row.OTA_F_ANTES,
            row.OTA_F_DESPUES,
            row.VITRINAS_F_ANTES,
            row.VITRINAS_F_DESPUES,
            row.DETERGENTES_F_ANTES,
            row.DETERGENTES_F_DESPUES,
            row.POP_F_ANTES,
            row.POP_F_DESPUES,
        ].filter((n) => n && String(n).trim());

        const deletedFiles = [];
        for (const filename of fotos) {
            try {
                const result = await storage.deleteFile({ filename, folder });
                deletedFiles.push(result);
            } catch (fileErr) {
                console.error('[mercaderista_visita_eliminar] foto', filename, fileErr.message);
                deletedFiles.push({ ok: false, filename, error: fileErr.message });
            }
        }

        const qryDelete = `
            DELETE FROM MERCADERISTAS_VISITAS
             WHERE EMPNIT = '${emp}'
               AND CODEMP = ${ven}
               AND CODCLIENTE = ${clie}
               AND FECHA = '${fechaVal}'
        `;
        await execute.get_data_qry(qryDelete, token);

        res.send({
            ok: true,
            deleted_db: true,
            deleted_files: deletedFiles,
        });
    } catch (err) {
        console.error('[mercaderista_visita_eliminar]', err.message || err);
        res.status(500).send({ ok: false, error: 'No se pudo eliminar la visita' });
    }
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
router.post("/buscar_cliente_mercaderista_qr", async (req, res) => {
    const { token, sucursal, filtro } = req.body;
    const emp = esc(sucursal);
    const cod = Number(filtro) || 0;

    if (cod <= 0) {
        return res.status(400).send('error');
    }

    const qry = `
        SELECT CLIENTES.CODCLIENTE,
               CLIENTES.NOMBRE,
               CLIENTES.NEGOCIO,
               CLIENTES.TIPONEGOCIO,
               CLIENTES.DIRECCION,
               ISNULL(MUNICIPIOS.DESMUN, '') AS DESMUN,
               ISNULL(CLIENTES.VISITAM, '') AS VISITAM,
               ISNULL(CLIENTES.HABILITADO, '') AS HABILITADO
          FROM CLIENTES
          LEFT OUTER JOIN MUNICIPIOS ON CLIENTES.CODMUN = MUNICIPIOS.CODMUN
         WHERE CLIENTES.CODCLIENTE = ${cod}
           AND CLIENTES.EMPNIT = '${emp}'
           AND CLIENTES.HABILITADO = 'SI';
    `;

    execute.QueryToken(res, qry, token);
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

router.post("/solicitud_cambio_cliente", async (req, res) => {
    const { token, empnit, usuario, fecha, detalles } = req.body;
    const empVal = esc(empnit || '');
    const usuarioVal = esc(usuario || '');
    const fechaVal = esc((fecha || '').trim());
    const detallesVal = esc(typeof detalles === 'string' ? detalles : JSON.stringify(detalles || {}));

    if (!empVal || !usuarioVal || !fechaVal || !detallesVal) {
        return res.status(400).send('error');
    }

    const qry = `
        INSERT INTO SOLICITUDES (EMPNIT, TIPO, REALIZADA, USUARIO, FECHA, DETALLES)
        VALUES (
            '${empVal}',
            'CAMBIO DATOS CLIENTE',
            'NO',
            '${usuarioVal}',
            '${fechaVal}',
            '${detallesVal}'
        );
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/solicitudes_cambio_cliente_list", async (req, res) => {
    const { token, empnit, realizada } = req.body;
    const empVal = esc(empnit || '');
    const realizadaVal = esc(String(realizada || 'NO').toUpperCase() === 'SI' ? 'SI' : 'NO');

    if (!empVal) {
        return res.status(400).send('error');
    }

    const qry = `
        SELECT ID,
               EMPNIT,
               TIPO,
               REALIZADA,
               USUARIO,
               FECHA,
               DETALLES
          FROM SOLICITUDES
         WHERE EMPNIT = '${empVal}'
           AND TIPO = 'CAMBIO DATOS CLIENTE'
           AND REALIZADA = '${realizadaVal}'
         ORDER BY FECHA DESC, ID DESC;
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/solicitudes_cambio_cliente_aceptar", async (req, res) => {
    const { token, id, empnit } = req.body;
    const idVal = Number(id) || 0;
    const empFiltro = esc(empnit || '');

    if (idVal <= 0) {
        return res.status(400).send('error');
    }

    const filtroEmp = empFiltro ? `AND EMPNIT = '${empFiltro}'` : '';

    try {
        const sel = await execute.get_data_qry(`
            SELECT TOP 1 ID, EMPNIT, TIPO, REALIZADA, DETALLES
              FROM SOLICITUDES
             WHERE ID = ${idVal}
               AND TIPO = 'CAMBIO DATOS CLIENTE'
               ${filtroEmp};
        `, token);

        const row = sel?.recordset?.[0];
        if (!row) {
            return res.send('error');
        }
        if (String(row.REALIZADA || '').toUpperCase() === 'SI') {
            return res.send({ recordset: [{ RESULT: 'ok', MSG: 'ya_realizada' }], rowsAffected: [1] });
        }

        let det = {};
        try {
            det = typeof row.DETALLES === 'string' ? JSON.parse(row.DETALLES) : (row.DETALLES || {});
        } catch (e) {
            return res.send('error');
        }

        const empCliente = esc(det.empnit || row.EMPNIT || '');
        const codclie = Number(det.codcliente) || 0;
        if (!empCliente || codclie <= 0) {
            return res.send('error');
        }

        const nit = esc(det.nit || '');
        const nombre = esc(det.nombre || '');
        const negocio = esc(det.negocio || '');
        const direccion = esc(det.direccion || '');
        const referencia = esc(det.referencia || '');
        const tiponegocio = esc(det.tiponegocio || '');
        const codmun = Number(det.codmun) || 0;
        const coddepto = Number(det.coddepto) || 0;

        const setTipo = tiponegocio ? `, TIPONEGOCIO='${tiponegocio}'` : '';

        const qry = `
            UPDATE SOLICITUDES
               SET REALIZADA = 'SI'
             WHERE ID = ${idVal}
               AND TIPO = 'CAMBIO DATOS CLIENTE'
               AND ISNULL(REALIZADA, 'NO') <> 'SI';

            UPDATE CLIENTES
               SET NIT = '${nit}',
                   NOMBRE = '${nombre}',
                   NEGOCIO = '${negocio}',
                   DIRECCION = '${direccion}',
                   REFERENCIA = '${referencia}',
                   CODMUN = ${codmun},
                   CODDEPTO = ${coddepto}
                   ${setTipo}
             WHERE CODCLIENTE = ${codclie}
               AND EMPNIT = '${empCliente}';

            SELECT 'ok' AS RESULT;
        `;

        execute.QueryToken(res, qry, token);
    } catch (err) {
        console.log(err && err.message ? err.message : err);
        res.send('error');
    }
});

router.post("/vendedor_faltantes_mes", async (req, res) => {
    const { token, sucursal, codven, mes, anio } = req.body;
    const emp = esc(sucursal);
    const ven = Number(codven) || 0;
    const mesVal = Number(mes) || 0;
    const anioVal = Number(anio) || 0;

    if (!emp || ven <= 0 || mesVal <= 0 || anioVal <= 0) {
        return res.status(400).send('error');
    }

    const filtroRuta = `(C.CODRUTA = ISNULL((SELECT TOP 1 CODRUTA FROM RUTAS_CLIENTES WHERE EMPNIT = '${emp}' AND CODEMP = ${ven}), -1))`;

    const qry = `
        SELECT C.CODCLIENTE,
               ISNULL(C.NOMBRE, '') AS NOMBRE,
               ISNULL(C.DIRECCION, '') AS DIRECCION,
               ISNULL(C.NEGOCIO, '') AS NEGOCIO,
               ISNULL(C.TIPONEGOCIO, '') AS TIPONEGOCIO,
               CONVERT(varchar(10), MV.FECHA, 23) AS FECHA,
               MV.EMPNIT,
               ISNULL(E.NOMEMPLEADO, '') AS NOMMERCADERISTA
          FROM MERCADERISTAS_VISITAS MV
         INNER JOIN CLIENTES C
            ON MV.EMPNIT = C.EMPNIT
           AND MV.CODCLIENTE = C.CODCLIENTE
          LEFT OUTER JOIN EMPLEADOS E
            ON MV.EMPNIT = E.EMPNIT
           AND MV.CODEMP = E.CODEMPLEADO
         WHERE MV.EMPNIT = '${emp}'
           AND ${filtroRuta}
           AND (
                (ISNULL(MV.MES, 0) = ${mesVal} AND ISNULL(MV.ANIO, 0) = ${anioVal})
                OR (MONTH(MV.FECHA) = ${mesVal} AND YEAR(MV.FECHA) = ${anioVal})
           )
           AND LTRIM(RTRIM(ISNULL(MV.FALTANTES, ''))) NOT IN ('', '[]', 'null', 'NULL')
         ORDER BY MV.FECHA DESC, C.NOMBRE
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/vendedor_faltantes_clientes_mes", async (req, res) => {
    const { token, sucursal, codven, mes, anio } = req.body;
    const emp = esc(sucursal);
    const ven = Number(codven) || 0;
    const mesVal = Number(mes) || 0;
    const anioVal = Number(anio) || 0;

    if (!emp || ven <= 0 || mesVal <= 0 || anioVal <= 0) {
        return res.status(400).send('error');
    }

    const filtroRuta = `(C.CODRUTA = ISNULL((SELECT TOP 1 CODRUTA FROM RUTAS_CLIENTES WHERE EMPNIT = '${emp}' AND CODEMP = ${ven}), -1))`;

    const qry = `
        SELECT DISTINCT MV.CODCLIENTE
          FROM MERCADERISTAS_VISITAS MV
         INNER JOIN CLIENTES C
            ON MV.EMPNIT = C.EMPNIT
           AND MV.CODCLIENTE = C.CODCLIENTE
         WHERE MV.EMPNIT = '${emp}'
           AND ${filtroRuta}
           AND (
                (ISNULL(MV.MES, 0) = ${mesVal} AND ISNULL(MV.ANIO, 0) = ${anioVal})
                OR (MONTH(MV.FECHA) = ${mesVal} AND YEAR(MV.FECHA) = ${anioVal})
           )
           AND LTRIM(RTRIM(ISNULL(MV.FALTANTES, ''))) NOT IN ('', '[]', 'null', 'NULL')
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/vendedor_faltantes_visita", async (req, res) => {
    const { token, sucursal, codclie, fecha } = req.body;
    const emp = esc(sucursal);
    const clie = Number(codclie) || 0;
    const fechaVal = esc((fecha || '').trim()).substring(0, 10);

    if (!emp || clie <= 0) {
        return res.status(400).send('error');
    }

    const filtroFecha = fechaVal
        ? `AND CONVERT(varchar(10), MV.FECHA, 23) = '${fechaVal}'`
        : '';

    const qry = `
        SELECT TOP 1
               MV.EMPNIT,
               MV.CODCLIENTE,
               CONVERT(varchar(10), MV.FECHA, 23) AS FECHA,
               ISNULL(C.NOMBRE, '') AS NOMBRE,
               ISNULL(C.DIRECCION, '') AS DIRECCION,
               ISNULL(C.NEGOCIO, '') AS NEGOCIO,
               ISNULL(MV.FALTANTES, '') AS FALTANTES
          FROM MERCADERISTAS_VISITAS MV
          LEFT OUTER JOIN CLIENTES C
            ON MV.EMPNIT = C.EMPNIT
           AND MV.CODCLIENTE = C.CODCLIENTE
         WHERE MV.EMPNIT = '${emp}'
           AND MV.CODCLIENTE = ${clie}
           ${filtroFecha}
         ORDER BY MV.FECHA DESC, ISNULL(MV.HORA_INICIO, '') DESC
    `;

    execute.QueryToken(res, qry, token);
});




module.exports = router;

