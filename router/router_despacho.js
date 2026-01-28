const execute = require('./../connection');
const express = require('express');
const router = express.Router();
const helpers = require('./../helper');



router.post("/insert_visita", async(req,res)=>{
   
    const { token, sucursal, codemp, codclie, fecha,hora,motivo,lat,long } = req.body;

    let qry = `
        INSERT INTO CLIENTES_VISITAS (EMPNIT,CODCLIENTE,FECHA,HORA,CODEMP,MOTIVO,LATITUD,LONGITUD)
        SELECT '${sucursal}' AS EMPNIT, 
                ${codclie} AS CODCLIENTE, 
                '${fecha}' AS FECHA, 
                '${hora}' AS HORA, 
                ${codemp} AS CODEMP, 
                '${motivo}' AS MOTIVO, 
                ${lat} AS LATITUD,
                ${long} AS LONGITUD
            `;
    
          
    execute.QueryToken(res,qry,token);
     
});






router.post("/fix_documento", async(req,res)=>{
   
    const { token, sucursal, coddoc,correlativo } = req.body;

   


    let qrydel = ` DELETE FROM DOCPRODUCTOS 
            WHERE EMPNIT='${sucursal}' 
            AND CODDOC='${coddoc}' 
            AND CORRELATIVO=${correlativo};`
    execute.get_data_qry(qrydel,'')
    .then(()=>{

       
        let qry = `
        SELECT MES, ANIO, FECHA, JSONDOCPRODUCTOS FROM DOCUMENTOS 
             WHERE EMPNIT='${sucursal}' 
             AND CODDOC='${coddoc}' 
             AND CORRELATIVO=${correlativo};
       
        `;

        execute.get_data_qry(qry,'')
        .then((data)=>{
    

            let productos;
            let mes = 0; let anio = 0;

            let codbodega = '01';
            let fecha = helpers.getFecha();
            let iva = 1.12;

            data.recordset.map((r)=>{
                productos = JSON.parse(r.JSONDOCPRODUCTOS);
                mes = r.MES;
                anio = r.ANIO;
            })

            let qryDocproductos ='';

            productos.map((r)=>{
                qryDocproductos += `
                INSERT INTO DOCPRODUCTOS (
                    EMPNIT,
                    ANIO,
                    MES,
                    CODDOC,
                    CORRELATIVO,
                    CODPROD,
                    DESPROD,
                    CODMEDIDA,
                    CANTIDAD,
                    CANTIDADBONIF,
                    EQUIVALE,
                    TOTALUNIDADES,
                    TOTALBONIF,
                    COSTO,
                    PRECIO,
                    TOTALCOSTO,
                    DESCUENTO,
                    TOTALPRECIO,
                    ENTREGADOS_TOTALUNIDADES,
                    COSTOANTERIOR,
                    COSTOPROMEDIO,
                    CODBODEGA,
                    NOSERIE,
                    EXENTO,
                    OBS,
                    TIPOPROD,
                    TIPOPRECIO,
                    LASTUPDATE,
                    TOTALUNIDADES_DEVUELTAS,
                    POR_IVA,
                    EXISTENCIA,
                    BONO,
                    TOTALBONO
                    )
                SELECT 
                    '${sucursal}' AS EMPNIT,
                    ${anio} AS ANIO,
                    ${mes} AS MES,
                    '${coddoc}' AS CODDOC,
                    ${correlativo} AS CORRELATIVO,
                    '${r.CODPROD}' AS CODPROD,
                    '${r.DESPROD}' AS DESPROD,
                    '${r.CODMEDIDA}' AS CODMEDIDA,
                    ${r.CANTIDAD} AS CANTIDAD,
                    0 AS CANTIDADBONIF,
                    ${r.EQUIVALE} AS EQUIVALE,
                    ${r.TOTALUNIDADES} AS TOTALUNIDADES,
                    0 AS TOTALBONIF,
                    ${r.COSTO} AS COSTO,
                    ${r.PRECIO} AS PRECIO,
                    ${r.TOTALCOSTO} AS TOTALCOSTO,
                    ${r.DESCUENTO} AS DESCUENTO,
                    ${r.TOTALPRECIO} AS TOTALPRECIO,
                    0 AS ENTREGADOS_TOTALUNIDADES,
                    ${r.COSTO} AS COSTOANTERIOR,
                    ${r.COSTO} AS COSTOPROMEDIO,
                    ${codbodega} AS CODBODEGA,
                    '' AS NOSERIE,
                    ${r.EXENTO} AS EXENTO,
                    '' AS OBS,
                    '${r.TIPOPROD}' AS TIPOPROD,
                    '${r.TIPOPRECIO}' AS TIPOPRECIO,
                    '${fecha}' AS LASTUPDATE,
                    0 AS TOTALUNIDADES_DEVUELTAS,
                    ${iva} AS POR_IVA,
                    ${r.EXISTENCIA} AS EXISTENCIA,
                    ${r.BONO} AS BONO,
                    ${Number(r.BONO) * Number(r.CANTIDAD)} AS TOTALBONO;
                `
        
            })
        
            execute.QueryToken(res,qryDocproductos,token);
         
    
        })
        .catch((err)=>{
            console.log(err)
            res.send('error');
    
        })


    })
    .catch((err)=>{
        console.log(err)
        res.send('error');

    })

    
   
   

    
     
});



router.post("/pedidos_pendientes_facturar_pedido", async(req,res)=>{
   
        const { token, sucursal, coddoc, correlativo, coddoc_fac, correlativo_fac, fecha_fac, mes_fac, anio_fac } = req.body;

        let qry = '';
        let nuevoCorrelativo = Number(correlativo_fac)+1;

        let qryDocumentos = qry_documentos_facturar(sucursal, coddoc, correlativo, coddoc_fac, correlativo_fac, fecha_fac,mes_fac,anio_fac);
        let qryUpdateDocTemporal = `UPDATE DOCUMENTOS_TEMPORALES 
                                    SET SERIEFAC='', NOFAC='', STATUS='F'
                            WHERE EMPNIT='${sucursal}' 
                                    AND CODDOC='${coddoc}' 
                                    AND CORRELATIVO=${correlativo};`
        let qryTipodocumentos = `UPDATE TIPODOCUMENTOS 
                                    SET CORRELATIVO=${nuevoCorrelativo} 
                                WHERE EMPNIT='${sucursal}' 
                                    AND CODDOC='${coddoc_fac}';`;

    
        execute.QueryJsonDocproductos(token,sucursal,coddoc,correlativo)
        .then((data)=>{

            
            let datos = JSON.stringify(data);

         
         
            let qryDocproductos = str_qry_docproductos(sucursal,coddoc_fac,correlativo_fac,anio_fac,mes_fac,0,'01',fecha_fac,datos);

            
            qry = qryDocumentos + qryDocproductos + qryUpdateDocTemporal + qryTipodocumentos;

          
            execute.QueryToken(res,qry,token);


        })
        .catch((error)=>{

            console.log(error)

            res.send('error');

        })
  

})


function qry_documentos_facturar(sucursal, coddoc, correlativo, coddoc_fac, correlativo_fac, fecha_fac,mes_fac,anio_fac){

    let qry = `
    INSERT INTO DOCUMENTOS (
                    EMPNIT, ANIO, MES, FECHA, HORA, CODDOC, CORRELATIVO, CODCLIENTE, DOC_NIT, DOC_NOMCLIE, DOC_DIRCLIE, TOTALCOSTO, TOTALVENTA, TOTALDESCUENTO, RECARGOTARJETA, TOTALPRECIO, PAGO, VUELTO, STATUS, 
                  TOTAL_EFECTIVO, TOTAL_TARJETA, TOTAL_DEPOSITOS, TOTAL_CHEQUES, USUARIO, CONCRE, CODCAJA, NOCORTE, SERIEFAC, NOFAC, CODEMP, OBS, DOC_SALDO, DOC_ABONOS, DIRENTREGA, TOTALEXENTO, 
                  CODEMBARQUE, LAT, LONG, VENCIMIENTO, FEL_UUDI, FEL_SERIE, FEL_NUMERO, FEL_FECHA, ENTREGADO, POR_IVA, TIPO_VENTA, ETIQUETA, EMPNIT_DESTINO, CODDOC_ORIGEN, CORRELATIVO_ORIGEN, 
                  JSONDOCPRODUCTOS
                ) SELECT 
                 EMPNIT, 
                 ${anio_fac} AS ANIO, 
                 ${mes_fac} AS MES, 
                 '${fecha_fac}' AS FECHA, HORA,
                 '${coddoc_fac}' AS CODDOC, 
                 ${correlativo_fac} AS CORRELATIVO, 
                 CODCLIENTE, DOC_NIT, DOC_NOMCLIE, DOC_DIRCLIE, TOTALCOSTO, TOTALVENTA, 
                 TOTALDESCUENTO, RECARGOTARJETA, TOTALPRECIO, PAGO, VUELTO, STATUS, 
                 TOTAL_EFECTIVO, TOTAL_TARJETA, TOTAL_DEPOSITOS, TOTAL_CHEQUES, USUARIO, CONCRE, CODCAJA, NOCORTE, SERIEFAC, NOFAC, CODEMP, OBS, DOC_SALDO, DOC_ABONOS, DIRENTREGA, TOTALEXENTO, 
                  CODEMBARQUE, LAT, LONG, VENCIMIENTO, FEL_UUDI, FEL_SERIE, FEL_NUMERO, FEL_FECHA, ENTREGADO, POR_IVA, TIPO_VENTA, ETIQUETA, EMPNIT_DESTINO, CODDOC_ORIGEN, CORRELATIVO_ORIGEN, 
                  JSONDOCPRODUCTOS
        FROM DOCUMENTOS_TEMPORALES
            WHERE EMPNIT='${sucursal}' 
            AND CODDOC='${coddoc}' 
            AND CORRELATIVO=${correlativo};
    `

    return qry;

};

function str_qry_docproductos(sucursal,coddoc,correlativo,anio,mes,iva,codbodega,fecha,jsondocproductos){

    let qry = '';    

  
    let strDatos = jsondocproductos

  

    let data = JSON.parse(strDatos);
    
    let json = []; json = data;
    let datos = JSON.parse(json);


   
    datos.map((r)=>{
        qry += `
        INSERT INTO DOCPRODUCTOS (
            EMPNIT,
            ANIO,
            MES,
            CODDOC,
            CORRELATIVO,
            CODPROD,
            DESPROD,
            CODMEDIDA,
            CANTIDAD,
            CANTIDADBONIF,
            EQUIVALE,
            TOTALUNIDADES,
            TOTALBONIF,
            COSTO,
            PRECIO,
            TOTALCOSTO,
            DESCUENTO,
            TOTALPRECIO,
            ENTREGADOS_TOTALUNIDADES,
            COSTOANTERIOR,
            COSTOPROMEDIO,
            CODBODEGA,
            NOSERIE,
            EXENTO,
            OBS,
            TIPOPROD,
            TIPOPRECIO,
            LASTUPDATE,
            TOTALUNIDADES_DEVUELTAS,
            POR_IVA,
            EXISTENCIA,
            BONO,
            TOTALBONO
            )
        SELECT 
            '${sucursal}' AS EMPNIT,
            ${anio} AS ANIO,
            ${mes} AS MES,
            '${coddoc}' AS CODDOC,
            ${correlativo} AS CORRELATIVO,
            '${r.CODPROD}' AS CODPROD,
            '${r.DESPROD}' AS DESPROD,
            '${r.CODMEDIDA}' AS CODMEDIDA,
            ${r.CANTIDAD} AS CANTIDAD,
            0 AS CANTIDADBONIF,
            ${r.EQUIVALE} AS EQUIVALE,
            ${r.TOTALUNIDADES} AS TOTALUNIDADES,
            0 AS TOTALBONIF,
            ${r.COSTO} AS COSTO,
            ${r.PRECIO} AS PRECIO,
            ${r.TOTALCOSTO} AS TOTALCOSTO,
            ${r.DESCUENTO} AS DESCUENTO,
            ${r.TOTALPRECIO} AS TOTALPRECIO,
            0 AS ENTREGADOS_TOTALUNIDADES,
            ${r.COSTO} AS COSTOANTERIOR,
            ${r.COSTO} AS COSTOPROMEDIO,
            ${codbodega} AS CODBODEGA,
            '' AS NOSERIE,
            ${r.EXENTO} AS EXENTO,
            '' AS OBS,
            '${r.TIPOPROD}' AS TIPOPROD,
            '${r.TIPOPRECIO}' AS TIPOPRECIO,
            '${fecha.toString().replace('T00:00:00.000Z','')}' AS LASTUPDATE,
            0 AS TOTALUNIDADES_DEVUELTAS,
            ${iva} AS POR_IVA,
            ${r.EXISTENCIA} AS EXISTENCIA,
            ${r.BONO} AS BONO,
            ${Number(r.BONO) * Number(r.CANTIDAD)} AS TOTALBONO;
        `

    })


    

    return qry;

};


router.post("/pedidos_marcas_vendedor", async(req,res)=>{
   
    const { token, sucursal, codven, fi, ff } = req.body;

    let qry = `
      SELECT EMPNIT, EMPRESA, CODEMP, NOMEMPLEADO, CODMARCA,DESMARCA, SUM(TOTALUNIDADES) AS TOTALUNIDADES, SUM(TOTALCOSTO) AS TOTALCOSTO, SUM(TOTALPRECIO) AS TOTALPRECIO
FROM     view_rpt_ventas_producto_marca_vendedor
WHERE  (TIPODOC IN ('FAC','FEF','FEC','FCP','FES','FPC')) 
AND (FECHA BETWEEN '${fi}' AND '${ff}') AND (CODMARCA IS NOT NULL)
GROUP BY EMPNIT, EMPRESA, CODEMP, NOMEMPLEADO, CODMARCA,DESMARCA
HAVING (CODEMP = ${codven})
    `;
    
   
     let XXqry = `
            SELECT MARCAS.DESMARCA, 
                    SUM(DOCPRODUCTOS.TOTALUNIDADES) AS TOTALUNIDADES, 
                    SUM(DOCPRODUCTOS.TOTALCOSTO) AS TOTALCOSTO, 
                    SUM(DOCPRODUCTOS.TOTALPRECIO) AS TOTALPRECIO, 
                    SUM(ISNULL(OBJETIVOS_EMPLEADO.OBJETIVO,0)) AS OBJETIVO
            FROM DOCPRODUCTOS FULL OUTER JOIN
                  TIPODOCUMENTOS RIGHT OUTER JOIN
                  PRODUCTOS LEFT OUTER JOIN
                  MARCAS LEFT OUTER JOIN
                  OBJETIVOS_EMPLEADO INNER JOIN
                  DOCUMENTOS ON OBJETIVOS_EMPLEADO.CODEMP = DOCUMENTOS.CODEMP ON MARCAS.CODMARCA = OBJETIVOS_EMPLEADO.CODMARCA ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA ON 
                  TIPODOCUMENTOS.CODDOC = DOCUMENTOS.CODDOC AND TIPODOCUMENTOS.EMPNIT = DOCUMENTOS.EMPNIT ON DOCPRODUCTOS.CORRELATIVO = DOCUMENTOS.CORRELATIVO AND 
                  DOCPRODUCTOS.CODDOC = DOCUMENTOS.CODDOC AND DOCPRODUCTOS.EMPNIT = DOCUMENTOS.EMPNIT AND DOCPRODUCTOS.CODPROD = PRODUCTOS.CODPROD
            WHERE  (DOCUMENTOS.CODEMP = ${codven}) AND 
                (DOCUMENTOS.EMPNIT = '${sucursal}') AND 
                (DOCUMENTOS.FECHA BETWEEN '${fi}' AND '${ff}') AND 
                (DOCUMENTOS.STATUS <> 'A') AND 
                (TIPODOCUMENTOS.TIPODOC IN ('FAC', 'FEF', 'FEC', 'FCP', 'FES', 'FPC')) AND 
				(OBJETIVOS_EMPLEADO.MES = MONTH('${fi}')) AND 
				(OBJETIVOS_EMPLEADO.ANIO = YEAR('${fi}'))
            GROUP BY MARCAS.DESMARCA
    `;

    console.log(qry)

    execute.QueryToken(res,qry,token);
     
});

router.post("/pedidos_marcas_vendedor_todas", async(req,res)=>{
   
    const { token, sucursal, fi, ff } = req.body;

    let qry = `
        SELECT ISNULL(MARCAS.DESMARCA,'') AS DESMARCA, 
            SUM(ISNULL(DOCPRODUCTOS.TOTALUNIDADES,0)) AS TOTALUNIDADES, 
            SUM(ISNULL(DOCPRODUCTOS.TOTALCOSTO,0)) AS TOTALCOSTO, 
            SUM(ISNULL(DOCPRODUCTOS.TOTALPRECIO,0)) AS TOTALPRECIO
        FROM     DOCUMENTOS LEFT OUTER JOIN
                  TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT LEFT OUTER JOIN
                  DOCPRODUCTOS ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO AND DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT LEFT OUTER JOIN
                  PRODUCTOS LEFT OUTER JOIN
                  MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA ON DOCPRODUCTOS.CODPROD = PRODUCTOS.CODPROD
        WHERE (DOCUMENTOS.EMPNIT = '${sucursal}') 
        AND (DOCUMENTOS.FECHA BETWEEN '${fi}' AND '${ff}') 
        AND (DOCUMENTOS.STATUS <> 'A')
        AND (TIPODOCUMENTOS.TIPODOC IN('FAC','FEF','FEC','FCP','FES','FPC'))
        GROUP BY MARCAS.DESMARCA
    `;
    
   

    execute.QueryToken(res,qry,token);
     
});



router.post("/pedidos_pendientes_embarque_documentos", async(req,res)=>{
   
    const { token, sucursal, codembarque } = req.body;

    let qry = `
    SELECT DOCUMENTOS.FECHA, DOCUMENTOS.HORA, DOCUMENTOS.CODDOC, 
        DOCUMENTOS.CORRELATIVO, DOCUMENTOS.DOC_NIT AS NIT, 
        DOCUMENTOS.DOC_NOMCLIE AS NOMCLIE, DOCUMENTOS.DOC_DIRCLIE AS DIRCLIE, 
        DOCUMENTOS.TOTALPRECIO AS IMPORTE, DOCUMENTOS.STATUS, 
        DOCUMENTOS.DIRENTREGA, DOCUMENTOS.LAT, DOCUMENTOS.LONG, 
        EMPLEADOS.NOMEMPLEADO, ISNULL(DOCUMENTOS.CODEMBARQUE, '') AS CODEMBARQUE, 
        MUNICIPIOS.DESMUN, DEPARTAMENTOS.DESDEPTO
    FROM  MUNICIPIOS RIGHT OUTER JOIN
        CLIENTES ON MUNICIPIOS.CODMUN = CLIENTES.CODMUN LEFT OUTER JOIN
        DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO RIGHT OUTER JOIN
        DOCUMENTOS ON CLIENTES.CODCLIENTE = DOCUMENTOS.CODCLIENTE LEFT OUTER JOIN
        EMPLEADOS ON DOCUMENTOS.EMPNIT = EMPLEADOS.EMPNIT AND DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
        TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
    WHERE (DOCUMENTOS.EMPNIT = '${sucursal}')  
        AND (DOCUMENTOS.CODEMBARQUE = '${codembarque}')
        AND (DOCUMENTOS.STATUS <>'A')
         AND (TIPODOCUMENTOS.TIPODOC IN('FAC','FEF','FEC','FCP','FES','FPC'))
    ORDER BY EMPLEADOS.NOMEMPLEADO, DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO

    `;
    


    execute.QueryToken(res,qry,token);
     
});




router.post("/pedidos_pendientes_embarque_resumen_vendedores", async(req,res)=>{
   
    const { token, sucursal, codembarque } = req.body;

    let qry = `
    SELECT EMPLEADOS.NOMEMPLEADO AS EMPLEADO, 
    COUNT(DOCUMENTOS.CODDOC) AS CONTEO, 
    SUM(DOCUMENTOS.TOTALPRECIO) AS IMPORTE
FROM     DOCUMENTOS LEFT OUTER JOIN
                  EMPLEADOS ON DOCUMENTOS.EMPNIT = EMPLEADOS.EMPNIT AND DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
                  TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
WHERE  (DOCUMENTOS.EMPNIT = '${sucursal}') AND (DOCUMENTOS.CODEMBARQUE = '${codembarque}') AND (TIPODOCUMENTOS.TIPODOC IN ('FAC', 'FEF', 'FEC', 'FCP', 'FES', 'FPC')) AND (DOCUMENTOS.STATUS <> 'A')
GROUP BY EMPLEADOS.NOMEMPLEADO
ORDER BY EMPLEADO

    `;
    

    execute.QueryToken(res,qry,token);
     
});

router.post("/pedidos_pendientes_embarque_documentos_vendedor", async(req,res)=>{
   
    const { token, sucursal, codven, fi, ff } = req.body;

    let qry = `
    SELECT DOCUMENTOS.FECHA, DOCUMENTOS.HORA, DOCUMENTOS.CODDOC, 
        DOCUMENTOS.CORRELATIVO, DOCUMENTOS.DOC_NIT AS NIT, 
        DOCUMENTOS.DOC_NOMCLIE AS NOMCLIE, DOCUMENTOS.DOC_DIRCLIE AS DIRCLIE, 
        DOCUMENTOS.TOTALPRECIO AS IMPORTE, DOCUMENTOS.STATUS, 
        DOCUMENTOS.DIRENTREGA, DOCUMENTOS.LAT, DOCUMENTOS.LONG, 
        EMPLEADOS.NOMEMPLEADO, ISNULL(DOCUMENTOS.CODEMBARQUE, '') AS CODEMBARQUE, 
        MUNICIPIOS.DESMUN, DEPARTAMENTOS.DESDEPTO
    FROM  MUNICIPIOS RIGHT OUTER JOIN
        CLIENTES ON MUNICIPIOS.CODMUN = CLIENTES.CODMUN LEFT OUTER JOIN
        DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO RIGHT OUTER JOIN
        DOCUMENTOS ON CLIENTES.CODCLIENTE = DOCUMENTOS.CODCLIENTE LEFT OUTER JOIN
        EMPLEADOS ON DOCUMENTOS.EMPNIT = EMPLEADOS.EMPNIT AND DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
        TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
    WHERE (DOCUMENTOS.EMPNIT = '${sucursal}')
        AND (DOCUMENTOS.CODEMP=${codven})
        AND (DOCUMENTOS.FECHA BETWEEN '${fi}' AND '${ff}') 
         AND (TIPODOCUMENTOS.TIPODOC IN('FAC','FEF','FEC','FCP','FES','FPC')) 
    ORDER BY EMPLEADOS.NOMEMPLEADO, DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO

    `;
    
   

    execute.QueryToken(res,qry,token);
     
});

router.post("/pedidos_pendientes_embarque_productos", async(req,res)=>{
   
    const { token, sucursal, codembarque } = req.body;

    let qry = `
            SELECT DOCPRODUCTOS.CODPROD, PRODUCTOS.DESPROD, 
                    PRODUCTOS.UXC, 
                    SUM(DOCPRODUCTOS.TOTALUNIDADES) AS TOTALUNIDADES, 
                    (SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC) AS FACTOR_CAJAS,
                    FLOOR((SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC)) AS CAJAS,
                    ROUND(((SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC) - FLOOR((SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC))) * PRODUCTOS.UXC,0) AS UNIDADES,
                    SUM(DOCPRODUCTOS.TOTALPRECIO) AS IMPORTE, 
                    MARCAS.DESMARCA
            FROM     TIPODOCUMENTOS RIGHT OUTER JOIN
                  DOCUMENTOS LEFT OUTER JOIN
                  PRODUCTOS LEFT OUTER JOIN
                  MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA RIGHT OUTER JOIN
                  DOCPRODUCTOS ON PRODUCTOS.CODPROD = DOCPRODUCTOS.CODPROD ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO AND DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND 
                  DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT ON TIPODOCUMENTOS.CODDOC = DOCUMENTOS.CODDOC AND TIPODOCUMENTOS.EMPNIT = DOCUMENTOS.EMPNIT
            WHERE  (DOCUMENTOS.EMPNIT = '${sucursal}')
            AND (DOCUMENTOS.CODEMBARQUE = '${codembarque}')
            AND (DOCUMENTOS.STATUS<>'A') 
            AND (TIPODOCUMENTOS.TIPODOC IN('FAC','FEF','FEC','FCP','FES','FPC'))
            GROUP BY DOCPRODUCTOS.CODPROD, PRODUCTOS.DESPROD, PRODUCTOS.UXC, MARCAS.DESMARCA
            ORDER BY MARCAS.DESMARCA, PRODUCTOS.DESPROD;
            `;
    
          
    execute.QueryToken(res,qry,token);
     
});
router.post("/pedidos_pendientes_embarque_productos_bonif", async(req,res)=>{
   
    const { token, sucursal, codembarque,codmedida } = req.body;

    let qry = `
            SELECT DOCPRODUCTOS.CODPROD, PRODUCTOS.DESPROD, 
                    PRODUCTOS.UXC, 
                    SUM(DOCPRODUCTOS.TOTALUNIDADES) AS TOTALUNIDADES, 
                    (SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC) AS FACTOR_CAJAS,
                    FLOOR((SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC)) AS CAJAS,
                    ROUND(((SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC) - FLOOR((SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC))) * PRODUCTOS.UXC,0) AS UNIDADES,
                    SUM(DOCPRODUCTOS.TOTALPRECIO) AS IMPORTE, 
                    MARCAS.DESMARCA
            FROM     TIPODOCUMENTOS RIGHT OUTER JOIN
                  DOCUMENTOS LEFT OUTER JOIN
                  PRODUCTOS LEFT OUTER JOIN
                  MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA RIGHT OUTER JOIN
                  DOCPRODUCTOS ON PRODUCTOS.CODPROD = DOCPRODUCTOS.CODPROD ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO AND DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND 
                  DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT ON TIPODOCUMENTOS.CODDOC = DOCUMENTOS.CODDOC AND TIPODOCUMENTOS.EMPNIT = DOCUMENTOS.EMPNIT
            WHERE  (DOCUMENTOS.EMPNIT = '${sucursal}')
            AND (DOCUMENTOS.CODEMBARQUE = '${codembarque}')
            AND (DOCPRODUCTOS.CODMEDIDA IN (${codmedida}))
            AND (DOCUMENTOS.STATUS<>'A') 
            AND (TIPODOCUMENTOS.TIPODOC IN('FAC','FEF','FEC','FCP','FES','FPC'))
            GROUP BY DOCPRODUCTOS.CODPROD, PRODUCTOS.DESPROD, PRODUCTOS.UXC, MARCAS.DESMARCA
            ORDER BY MARCAS.DESMARCA, PRODUCTOS.DESPROD;
            `;
    
        console.log(qry);


    execute.QueryToken(res,qry,token);
     
});
router.post("/pedidos_pendientes_embarque_productos_devueltos", async(req,res)=>{
   
    const { token, sucursal, codembarque } = req.body;

    let qry = `
            SELECT DOCPRODUCTOS.CODPROD, PRODUCTOS.DESPROD, 
                    PRODUCTOS.UXC, 
                    SUM(DOCPRODUCTOS.TOTALUNIDADES) AS TOTALUNIDADES, 
                    (SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC) AS FACTOR_CAJAS,
                    FLOOR((SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC)) AS CAJAS,
                    ROUND(((SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC) - FLOOR((SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC))) * PRODUCTOS.UXC,0) AS UNIDADES,
                    SUM(DOCPRODUCTOS.TOTALPRECIO) AS IMPORTE, 
                    MARCAS.DESMARCA
            FROM     TIPODOCUMENTOS RIGHT OUTER JOIN
                  DOCUMENTOS LEFT OUTER JOIN
                  PRODUCTOS LEFT OUTER JOIN
                  MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA RIGHT OUTER JOIN
                  DOCPRODUCTOS ON PRODUCTOS.CODPROD = DOCPRODUCTOS.CODPROD ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO AND DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND 
                  DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT ON TIPODOCUMENTOS.CODDOC = DOCUMENTOS.CODDOC AND TIPODOCUMENTOS.EMPNIT = DOCUMENTOS.EMPNIT
            WHERE  (DOCUMENTOS.EMPNIT = '${sucursal}')
            AND (DOCUMENTOS.CODEMBARQUE = '${codembarque}')
            AND (DOCUMENTOS.STATUS<>'A') 
            AND (TIPODOCUMENTOS.TIPODOC IN('DEV','FNC'))
            GROUP BY DOCPRODUCTOS.CODPROD, PRODUCTOS.DESPROD, PRODUCTOS.UXC, MARCAS.DESMARCA
            ORDER BY DOCPRODUCTOS.CODPROD, PRODUCTOS.DESPROD;
            `;
    
          
    execute.QueryToken(res,qry,token);
     
});


router.post("/pedidos_pendientes_embarque_productos_vendedor", async(req,res)=>{
   
    const { token, sucursal, fi, ff, codven } = req.body;

    let qry = `
            SELECT DOCPRODUCTOS.CODPROD, PRODUCTOS.DESPROD, 
                    PRODUCTOS.UXC, 
                    SUM(DOCPRODUCTOS.TOTALUNIDADES) AS TOTALUNIDADES, 
                    (SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC) AS FACTOR_CAJAS,
                    FLOOR((SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC)) AS CAJAS,
                    ROUND(((SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC) - FLOOR((SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC))) * PRODUCTOS.UXC,0) AS UNIDADES,
                    SUM(DOCPRODUCTOS.TOTALPRECIO) AS IMPORTE, 
                    MARCAS.DESMARCA
            FROM     TIPODOCUMENTOS RIGHT OUTER JOIN
                  DOCUMENTOS LEFT OUTER JOIN
                  PRODUCTOS LEFT OUTER JOIN
                  MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA RIGHT OUTER JOIN
                  DOCPRODUCTOS ON PRODUCTOS.CODPROD = DOCPRODUCTOS.CODPROD ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO AND DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND 
                  DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT ON TIPODOCUMENTOS.CODDOC = DOCUMENTOS.CODDOC AND TIPODOCUMENTOS.EMPNIT = DOCUMENTOS.EMPNIT
            WHERE  (DOCUMENTOS.EMPNIT = '${sucursal}')
            AND (DOCUMENTOS.FECHA BETWEEN '${fi}' AND '${ff}')
            AND (DOCUMENTOS.STATUS<>'A') 
            AND (TIPODOCUMENTOS.TIPODOC IN('FAC','FEF','FEC','FCP','FES','FPC'))
            AND (DOCUMENTOS.CODEMP=${codven})
            GROUP BY DOCPRODUCTOS.CODPROD, PRODUCTOS.DESPROD, PRODUCTOS.UXC, MARCAS.DESMARCA
            ORDER BY MARCAS.DESMARCA, PRODUCTOS.DESPROD;
            `;
    

    execute.QueryToken(res,qry,token);
     
});

router.post("/pedidos_pendientes_embarque_productos_vendedor_todos", async(req,res)=>{
   
    const { token, sucursal, fi, ff } = req.body;

    let qry = `
            SELECT DOCPRODUCTOS.CODPROD, PRODUCTOS.DESPROD, 
                    PRODUCTOS.UXC, 
                    SUM(DOCPRODUCTOS.TOTALUNIDADES) AS TOTALUNIDADES, 
                    (SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC) AS FACTOR_CAJAS,
                    FLOOR((SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC)) AS CAJAS,
                    ROUND(((SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC) - FLOOR((SUM(DOCPRODUCTOS.TOTALUNIDADES) /  PRODUCTOS.UXC))) * PRODUCTOS.UXC,0) AS UNIDADES,
                    SUM(DOCPRODUCTOS.TOTALPRECIO) AS IMPORTE, 
                    MARCAS.DESMARCA
            FROM     TIPODOCUMENTOS RIGHT OUTER JOIN
                  DOCUMENTOS LEFT OUTER JOIN
                  PRODUCTOS LEFT OUTER JOIN
                  MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA RIGHT OUTER JOIN
                  DOCPRODUCTOS ON PRODUCTOS.CODPROD = DOCPRODUCTOS.CODPROD ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO AND DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND 
                  DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT ON TIPODOCUMENTOS.CODDOC = DOCUMENTOS.CODDOC AND TIPODOCUMENTOS.EMPNIT = DOCUMENTOS.EMPNIT
            WHERE  (DOCUMENTOS.EMPNIT = '${sucursal}')
                    AND (DOCUMENTOS.FECHA BETWEEN '${fi}' AND '${ff}')
                    AND (DOCUMENTOS.STATUS<>'A') 
                    AND (TIPODOCUMENTOS.TIPODOC IN('FAC','FEF','FEC','FCP','FES','FPC'))
                    AND (PRODUCTOS.CODPROD IS NOT NULL)
            GROUP BY DOCPRODUCTOS.CODPROD, PRODUCTOS.DESPROD, 
                PRODUCTOS.UXC, MARCAS.DESMARCA
            ORDER BY MARCAS.DESMARCA, PRODUCTOS.DESPROD;
            `;
    

    execute.QueryToken(res,qry,token);
     
});


router.post("/ventas_vendedores_todos", async(req,res)=>{
   
    const { token, sucursal, fi, ff } = req.body;

    let qry = `
            SELECT EMPLEADOS.NOMEMPLEADO AS EMPLEADO, 
                    EMPLEADOS.TELEFONO, 
                    EMPLEADOS.USUARIO, 
                    EMPLEADOS.CLAVE, 
                    SUM(DOCUMENTOS.TOTALCOSTO) AS TOTALCOSTO, 
                    SUM(DOCUMENTOS.TOTALVENTA) AS TOTALVENTA, 
                    SUM(DOCUMENTOS.TOTALPRECIO) AS TOTALPRECIO,
                    COUNT(DOCUMENTOS.CODDOC) AS PEDIDOS
            FROM DOCUMENTOS LEFT OUTER JOIN
                  EMPLEADOS ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO AND DOCUMENTOS.EMPNIT = EMPLEADOS.EMPNIT LEFT OUTER JOIN
                  TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
            WHERE 
                (DOCUMENTOS.EMPNIT = '${sucursal}') 
                AND (DOCUMENTOS.FECHA BETWEEN '${fi}' AND '${ff}') 
                AND (DOCUMENTOS.STATUS <> 'A') 
                AND (TIPODOCUMENTOS.TIPODOC IN('FAC','FEF','FEC','FCP','FES','FPC'))
            GROUP BY EMPLEADOS.NOMEMPLEADO, 
                EMPLEADOS.TELEFONO, EMPLEADOS.USUARIO, EMPLEADOS.CLAVE
            ORDER BY EMPLEADOS.NOMEMPLEADO;
            `;
    

    execute.QueryToken(res,qry,token);
     
});


router.post("/clientes_vendedores_resumen", async(req,res)=>{
   
    const { token, sucursal } = req.body;

    let qry = `
             SELECT NOMEMP, 
                SUM(LUNES) AS LUNES, 
                SUM(MARTES) AS MARTES, 
                SUM(MIERCOLES) AS MIERCOLES, 
                SUM(JUEVES) AS JUEVES, 
                SUM(VIERNES) AS VIERNES, 
                SUM(SABADO) AS SABADO, 
                SUM(DOMINGO) AS DOMINGO,
                SUM(LUNES)+SUM(MARTES)+SUM(MIERCOLES)+SUM(JUEVES)+SUM(VIERNES)+SUM(SABADO)+SUM(DOMINGO) AS TOTAL
            FROM     view_clientes_resumen_dias
                WHERE  (EMPNIT = '${sucursal}')
            GROUP BY NOMEMP
            `;
    

    execute.QueryToken(res,qry,token);
     
});






router.post("/pedidos_pendientes_vendedores", async(req,res)=>{
   
    const { token, sucursal } = req.body;


    let qry = `
   SELECT DOCUMENTOS.FECHA, DOCUMENTOS.HORA, DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO, DOCUMENTOS.DOC_NIT AS NIT, DOCUMENTOS.DOC_NOMCLIE AS NOMCLIE, DOCUMENTOS.DOC_DIRCLIE AS DIRCLIE, 
                  DOCUMENTOS.TOTALPRECIO AS IMPORTE, DOCUMENTOS.STATUS, DOCUMENTOS.DIRENTREGA, DOCUMENTOS.LAT, DOCUMENTOS.LONG, EMPLEADOS.NOMEMPLEADO, ISNULL(DOCUMENTOS.CODEMBARQUE, '') 
                  AS CODEMBARQUE, MUNICIPIOS.DESMUN, DEPARTAMENTOS.DESDEPTO, SUM(ISNULL(DOCPRODUCTOS.TOTALPRECIO,0)) AS TOTALPRECIOPROD
FROM     DOCPRODUCTOS RIGHT OUTER JOIN
                  DOCUMENTOS ON DOCPRODUCTOS.CORRELATIVO = DOCUMENTOS.CORRELATIVO AND DOCPRODUCTOS.CODDOC = DOCUMENTOS.CODDOC AND DOCPRODUCTOS.EMPNIT = DOCUMENTOS.EMPNIT LEFT OUTER JOIN
                  MUNICIPIOS RIGHT OUTER JOIN
                  CLIENTES ON MUNICIPIOS.CODMUN = CLIENTES.CODMUN LEFT OUTER JOIN
                  DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO ON DOCUMENTOS.CODCLIENTE = CLIENTES.CODCLIENTE LEFT OUTER JOIN
                  EMPLEADOS ON DOCUMENTOS.EMPNIT = EMPLEADOS.EMPNIT AND DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
                  TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
        WHERE  (DOCUMENTOS.EMPNIT = '${sucursal}') AND (DOCUMENTOS.NOCORTE = 0) 
        AND (TIPODOCUMENTOS.TIPODOC IN ('FAC', 'FEF', 'FEC', 'FCP', 'FES', 'FPC', 'ENV'))
        AND (DOCUMENTOS.CODEMBARQUE='')
        AND (DOCUMENTOS.STATUS<>'A')
        GROUP BY DOCUMENTOS.FECHA, DOCUMENTOS.HORA, 
                DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO, 
                DOCUMENTOS.DOC_NIT, DOCUMENTOS.DOC_NOMCLIE, 
                DOCUMENTOS.DOC_DIRCLIE, DOCUMENTOS.TOTALPRECIO, 
                DOCUMENTOS.STATUS, DOCUMENTOS.DIRENTREGA, DOCUMENTOS.LAT, DOCUMENTOS.LONG, EMPLEADOS.NOMEMPLEADO, ISNULL(DOCUMENTOS.CODEMBARQUE, ''), MUNICIPIOS.DESMUN, 
                DEPARTAMENTOS.DESDEPTO
        ORDER BY DOCUMENTOS.FECHA, EMPLEADOS.NOMEMPLEADO
    `;
    

    execute.QueryToken(res,qry,token);
     
});
router.post("/pedidos_pendientes_vendedores_anulados", async(req,res)=>{
   
    const { token, sucursal } = req.body;


    let qry = `
   SELECT DOCUMENTOS.FECHA, DOCUMENTOS.HORA, DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO, DOCUMENTOS.DOC_NIT AS NIT, DOCUMENTOS.DOC_NOMCLIE AS NOMCLIE, DOCUMENTOS.DOC_DIRCLIE AS DIRCLIE, 
                  DOCUMENTOS.TOTALPRECIO AS IMPORTE, DOCUMENTOS.STATUS, DOCUMENTOS.DIRENTREGA, DOCUMENTOS.LAT, DOCUMENTOS.LONG, EMPLEADOS.NOMEMPLEADO, ISNULL(DOCUMENTOS.CODEMBARQUE, '') 
                  AS CODEMBARQUE, MUNICIPIOS.DESMUN, DEPARTAMENTOS.DESDEPTO, SUM(ISNULL(DOCPRODUCTOS.TOTALPRECIO,0)) AS TOTALPRECIOPROD
FROM     DOCPRODUCTOS RIGHT OUTER JOIN
                  DOCUMENTOS ON DOCPRODUCTOS.CORRELATIVO = DOCUMENTOS.CORRELATIVO AND DOCPRODUCTOS.CODDOC = DOCUMENTOS.CODDOC AND DOCPRODUCTOS.EMPNIT = DOCUMENTOS.EMPNIT LEFT OUTER JOIN
                  MUNICIPIOS RIGHT OUTER JOIN
                  CLIENTES ON MUNICIPIOS.CODMUN = CLIENTES.CODMUN LEFT OUTER JOIN
                  DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO ON DOCUMENTOS.CODCLIENTE = CLIENTES.CODCLIENTE LEFT OUTER JOIN
                  EMPLEADOS ON DOCUMENTOS.EMPNIT = EMPLEADOS.EMPNIT AND DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
                  TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
        WHERE  (DOCUMENTOS.EMPNIT = '${sucursal}') AND (DOCUMENTOS.NOCORTE = 0) 
        AND (TIPODOCUMENTOS.TIPODOC IN ('FAC', 'FEF', 'FEC', 'FCP', 'FES', 'FPC', 'ENV'))
        AND (DOCUMENTOS.CODEMBARQUE='')
        AND (DOCUMENTOS.STATUS='A')
        GROUP BY DOCUMENTOS.FECHA, DOCUMENTOS.HORA, 
                DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO, 
                DOCUMENTOS.DOC_NIT, DOCUMENTOS.DOC_NOMCLIE, 
                DOCUMENTOS.DOC_DIRCLIE, DOCUMENTOS.TOTALPRECIO, 
                DOCUMENTOS.STATUS, DOCUMENTOS.DIRENTREGA, DOCUMENTOS.LAT, DOCUMENTOS.LONG, EMPLEADOS.NOMEMPLEADO, ISNULL(DOCUMENTOS.CODEMBARQUE, ''), MUNICIPIOS.DESMUN, 
                DEPARTAMENTOS.DESDEPTO
        ORDER BY DOCUMENTOS.FECHA, EMPLEADOS.NOMEMPLEADO
    `;
    

    execute.QueryToken(res,qry,token);
     
});

router.post("/pedidos_pendientes_vendedores_fechas", async(req,res)=>{
   
    const { token, sucursal, fi, ff } = req.body;


    let qry = `
    SELECT DOCUMENTOS.FECHA, DOCUMENTOS.HORA, 
                    DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO, 
                    DOCUMENTOS.DOC_NIT AS NIT, 
                  DOCUMENTOS.DOC_NOMCLIE AS NOMCLIE, 
                  DOCUMENTOS.DOC_DIRCLIE AS DIRCLIE, 
                  DOCUMENTOS.TOTALPRECIO AS IMPORTE, 
                  DOCUMENTOS.STATUS, 
                  DOCUMENTOS.DIRENTREGA, DOCUMENTOS.LAT, DOCUMENTOS.LONG, 
                  EMPLEADOS.NOMEMPLEADO, ISNULL(DOCUMENTOS.CODEMBARQUE, '') AS CODEMBARQUE, 
                  MUNICIPIOS.DESMUN, DEPARTAMENTOS.DESDEPTO
    FROM     MUNICIPIOS RIGHT OUTER JOIN
                  CLIENTES ON MUNICIPIOS.CODMUN = CLIENTES.CODMUN LEFT OUTER JOIN
                  DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO RIGHT OUTER JOIN
                  DOCUMENTOS ON CLIENTES.CODCLIENTE = DOCUMENTOS.CODCLIENTE LEFT OUTER JOIN
                  EMPLEADOS ON DOCUMENTOS.EMPNIT = EMPLEADOS.EMPNIT AND DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
                  TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
    WHERE  (DOCUMENTOS.EMPNIT = '${sucursal}') 
        AND (DOCUMENTOS.STATUS<>'A')
        AND (DOCUMENTOS.FECHA BETWEEN '${fi}' AND '${ff}') 
        AND (TIPODOCUMENTOS.TIPODOC IN ('FAC','FEF','FEC','FCP','FES','FPC','ENV')) 
    ORDER BY EMPLEADOS.NOMEMPLEADO, DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO

    `;
    

    execute.QueryToken(res,qry,token);
     
});



router.post("/pedidos_pendientes_vendedores_embarque", async(req,res)=>{
   
    const { token, sucursal, codembarque } = req.body;

    let qry = `
    SELECT DOCUMENTOS_TEMPORALES.FECHA, DOCUMENTOS_TEMPORALES.HORA, DOCUMENTOS_TEMPORALES.CODDOC, 
        DOCUMENTOS_TEMPORALES.CORRELATIVO, DOCUMENTOS_TEMPORALES.DOC_NIT AS NIT, 
        DOCUMENTOS_TEMPORALES.DOC_NOMCLIE AS NOMCLIE, DOCUMENTOS_TEMPORALES.DOC_DIRCLIE AS DIRCLIE, 
        DOCUMENTOS_TEMPORALES.TOTALPRECIO AS IMPORTE, DOCUMENTOS_TEMPORALES.STATUS, 
        DOCUMENTOS_TEMPORALES.DIRENTREGA, DOCUMENTOS_TEMPORALES.LAT, DOCUMENTOS_TEMPORALES.LONG, 
        EMPLEADOS.NOMEMPLEADO, ISNULL(DOCUMENTOS_TEMPORALES.CODEMBARQUE, '') AS CODEMBARQUE, 
        MUNICIPIOS.DESMUN, DEPARTAMENTOS.DESDEPTO
    FROM  MUNICIPIOS RIGHT OUTER JOIN
        CLIENTES ON MUNICIPIOS.CODMUN = CLIENTES.CODMUN LEFT OUTER JOIN
        DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPTO RIGHT OUTER JOIN
        DOCUMENTOS_TEMPORALES ON CLIENTES.CODCLIENTE = DOCUMENTOS_TEMPORALES.CODCLIENTE LEFT OUTER JOIN
        EMPLEADOS ON DOCUMENTOS_TEMPORALES.EMPNIT = EMPLEADOS.EMPNIT AND DOCUMENTOS_TEMPORALES.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
        TIPODOCUMENTOS ON DOCUMENTOS_TEMPORALES.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS_TEMPORALES.EMPNIT = TIPODOCUMENTOS.EMPNIT
    WHERE (DOCUMENTOS_TEMPORALES.EMPNIT = '${sucursal}')  
        AND (DOCUMENTOS_TEMPORALES.CODEMBARQUE = '${codembarque}')
        AND (DOCUMENTOS_TEMPORALES.STATUS='O')
    ORDER BY EMPLEADOS.NOMEMPLEADO, DOCUMENTOS_TEMPORALES.CODDOC, DOCUMENTOS_TEMPORALES.CORRELATIVO

    `;
    

    execute.QueryToken(res,qry,token);
     
});


router.post("/pedidos_pendientes_anular", async(req,res)=>{
   
    const {  token,sucursal,coddoc,correlativo,st} = req.body;

    let qry = `

            UPDATE DOCUMENTOS 
            SET STATUS='${st}'
            WHERE EMPNIT='${sucursal}' 
            AND CODDOC='${coddoc}'
            AND CORRELATIVO=${correlativo};
            `;

       
            
    execute.QueryToken(res,qry,token);
     
});





router.post("/pedido_update_embarque", async(req,res)=>{
   
    const {  token,sucursal,codembarque,coddoc,correlativo} = req.body;


    let st = '';
    if(codembarque==''){st='O'}else{st='F'}

    let qry = `

            UPDATE DOCUMENTOS 
            SET CODEMBARQUE='${codembarque}',
                STATUS='${st}'
            WHERE EMPNIT='${sucursal}' 
            AND CODDOC='${coddoc}'
            AND CORRELATIVO=${correlativo};
            `;

       
            
    execute.QueryToken(res,qry,token);
     
});








router.post("/embarques_lista_activos", async(req,res)=>{
   
    const { token, sucursal } = req.body;

    let qry = `
            SELECT EMBARQUES.ID,
                EMBARQUES.FECHA, 
                EMBARQUES.CODEMBARQUE, 
                EMBARQUES.DESCRIPCION, 
                EMBARQUES.RUTEO, 
                EMBARQUES.CODEMPLEADO, 
                EMPLEADOS.NOMEMPLEADO, 
                EMBARQUES.F_TOTALCOSTO, 
                EMBARQUES.F_TOTALPRECIO, 
                EMBARQUES.F_DEVOLUCIONES, 
                EMBARQUES.F_REPORTADO
            FROM EMBARQUES LEFT OUTER JOIN
                EMPLEADOS ON EMBARQUES.EMPNIT = EMPLEADOS.EMPNIT 
                AND EMBARQUES.CODEMPLEADO = EMPLEADOS.CODEMPLEADO
            WHERE  (EMBARQUES.FINALIZADO = 'NO') 
            AND (EMBARQUES.EMPNIT = '${sucursal}');

            `;
    
          

    execute.QueryToken(res,qry,token);
     
});

router.post("/embarques_lista_activos_fecha", async(req,res)=>{
   
    const { token, sucursal, fecha } = req.body;

    let qry = `
            SELECT EMBARQUES.ID,
                EMBARQUES.FECHA, 
                EMBARQUES.CODEMBARQUE, 
                EMBARQUES.DESCRIPCION, 
                EMBARQUES.RUTEO, 
                EMBARQUES.CODEMPLEADO, 
                EMPLEADOS.NOMEMPLEADO, 
                EMBARQUES.F_TOTALCOSTO, 
                EMBARQUES.F_TOTALPRECIO, 
                EMBARQUES.F_DEVOLUCIONES, 
                EMBARQUES.F_REPORTADO
            FROM EMBARQUES LEFT OUTER JOIN
                EMPLEADOS ON EMBARQUES.EMPNIT = EMPLEADOS.EMPNIT 
                AND EMBARQUES.CODEMPLEADO = EMPLEADOS.CODEMPLEADO
            WHERE  (EMBARQUES.FINALIZADO = 'NO') 
            AND (EMBARQUES.EMPNIT = '${sucursal}')
            AND (EMBARQUES.FECHA='${fecha}');
            `;
    
          

    execute.QueryToken(res,qry,token);
     
});

router.post("/embarques_lista", async(req,res)=>{
   
    const { token, sucursal, status, mes, anio } = req.body;

    let qryx = `
            SELECT EMBARQUES.ID,
                EMBARQUES.FECHA, 
                EMBARQUES.CODEMBARQUE, 
                EMBARQUES.DESCRIPCION, 
                EMBARQUES.RUTEO, 
                EMBARQUES.CODEMPLEADO, 
                EMPLEADOS.NOMEMPLEADO, 
                EMBARQUES.F_TOTALCOSTO, 
                EMBARQUES.F_TOTALPRECIO, 
                EMBARQUES.F_DEVOLUCIONES, 
                EMBARQUES.F_REPORTADO,
                EMBARQUES.FINALIZADO
            FROM EMBARQUES LEFT OUTER JOIN
                EMPLEADOS ON EMBARQUES.EMPNIT = EMPLEADOS.EMPNIT 
                AND EMBARQUES.CODEMPLEADO = EMPLEADOS.CODEMPLEADO
            WHERE  (EMBARQUES.FINALIZADO LIKE '%${status}%') 
            AND (EMBARQUES.EMPNIT = '${sucursal}') 
            AND (EMBARQUES.MES=${mes}) 
            AND (EMBARQUES.ANIO=${anio})    
            `;

        let qry = `
            SELECT 
                EMBARQUES.ID, 
                EMBARQUES.FECHA, 
                EMBARQUES.CODEMBARQUE, 
                EMBARQUES.DESCRIPCION, 
                EMBARQUES.RUTEO, 
                EMBARQUES.CODEMPLEADO, 
                EMPLEADOS.NOMEMPLEADO, 
                EMBARQUES.F_TOTALCOSTO, 
                EMBARQUES.F_TOTALPRECIO, 
                EMBARQUES.F_DEVOLUCIONES, 
                EMBARQUES.F_REPORTADO, 
                EMBARQUES.FINALIZADO, 
                ISNULL(view_rpt_embarques_importes_resumen.IMPORTE,0) AS IMPORTE, 
                ISNULL(view_rpt_embarques_importes_resumen.DEVOLUCIONES,0) AS DEVOLUCIONES
FROM        EMBARQUES LEFT OUTER JOIN
                view_rpt_embarques_importes_resumen ON EMBARQUES.CODEMBARQUE = view_rpt_embarques_importes_resumen.CODEMBARQUE AND EMBARQUES.EMPNIT = view_rpt_embarques_importes_resumen.EMPNIT LEFT OUTER JOIN
                EMPLEADOS ON EMBARQUES.EMPNIT = EMPLEADOS.EMPNIT AND EMBARQUES.CODEMPLEADO = EMPLEADOS.CODEMPLEADO
            WHERE  (EMBARQUES.FINALIZADO LIKE '%${status}%') 
                AND (EMBARQUES.EMPNIT = '${sucursal}') 
                AND (EMBARQUES.MES=${mes}) 
                AND (EMBARQUES.ANIO=${anio})    
            `;
    
          

    execute.QueryToken(res,qry,token);
     
});

router.post("/embarques_insert", async(req,res)=>{
   
    const {  token,sucursal,fecha,mes,anio,codembarque,descripcion,ruteo,codempleado} = req.body;

    let qry = `
            INSERT INTO EMBARQUES (EMPNIT,FECHA,MES,ANIO,
                        CODEMBARQUE,DESCRIPCION,RUTEO,
                        CODEMPLEADO,FINALIZADO,F_TOTALCOSTO,
                        F_TOTALPRECIO,F_DEVOLUCIONES,F_REPORTADO)
            SELECT '${sucursal}' AS EMPNIT,
                    '${fecha}' AS FECHA,
                    ${mes} AS MES,
                    ${anio} AS ANIO,
                    '${codembarque}' AS CODEMBARQUE,
                    '${descripcion}' AS DESCRIPCION,
                    '${ruteo}' AS RUTEO,
                    ${codempleado} AS CODEMPLEADO,
                    'NO' AS FINALIZADO,
                    0 AS F_TOTALCOSTO,
                    0 AS F_TOTALPRECIO,
                    0 AS F_DEVOLUCIONES,
                    0 AS F_REPORTADO
            `;
    
            
    execute.QueryToken(res,qry,token);
     
});

router.post("/embarques_edit", async(req,res)=>{
   
    const {  token,sucursal,fecha,codembarque,descripcion,ruteo,codempleado} = req.body;

    let qry = `
            UPDATE EMBARQUES SET
                FECHA='${fecha}',
                DESCRIPCION='${descripcion}',
                RUTEO='${ruteo}',
                CODEMPLEADO=${codempleado}
            WHERE EMPNIT='${sucursal}' AND CODEMBARQUE='${codembarque}'
            `;
    
            
    execute.QueryToken(res,qry,token);
     
});

router.post("/embarques_delete", async(req,res)=>{
   
    const {  token,sucursal,codembarque} = req.body;

    let qry = `
            DELETE FROM EMBARQUES 
            WHERE EMPNIT='${sucursal}' 
            AND CODEMBARQUE='${codembarque}';
            `;

            
    execute.QueryToken(res,qry,token);
     
});

router.post("/embarques_status", async(req,res)=>{
   
    const {  token,sucursal,codembarque, status} = req.body;

    let qry = `
            UPDATE EMBARQUES
                SET FINALIZADO='${status}' 
            WHERE EMPNIT='${sucursal}' 
            AND CODEMBARQUE='${codembarque}';
            `;

            
    execute.QueryToken(res,qry,token);
     
});


router.post("/embarques_tipoprecio", async(req,res)=>{
   
    const {  token,sucursal,codembarque} = req.body;

    let qry = `
        SELECT  
            DOCUMENTOS.FECHA, 
            DOCUMENTOS.CODDOC, 
            DOCUMENTOS.CORRELATIVO, 
            DOCUMENTOS.DOC_NOMCLIE AS NOMCLIE,
            DOCUMENTOS.DOC_DIRCLIE AS DIRCLIE, 
            EMPLEADOS.NOMEMPLEADO, 
            DOCPRODUCTOS.CODPROD, 
            DOCPRODUCTOS.DESPROD, 
            DOCPRODUCTOS.CODMEDIDA, 
            DOCPRODUCTOS.CANTIDAD, 
            DOCPRODUCTOS.PRECIO, 
            DOCPRODUCTOS.TOTALPRECIO, 
            DOCPRODUCTOS.TIPOPRECIO
        FROM DOCUMENTOS LEFT OUTER JOIN
            EMPLEADOS ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
            DOCPRODUCTOS ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO AND DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT LEFT OUTER JOIN
            TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
        WHERE 
            (DOCUMENTOS.EMPNIT = '${sucursal}') AND 
            (TIPODOCUMENTOS.TIPODOC IN('FAC','FCP','FEC','FEF','FES','FPC')) AND 
            (DOCUMENTOS.STATUS <> 'A') AND 
            (DOCUMENTOS.CODEMBARQUE = '${codembarque}') AND
            (DOCPRODUCTOS.TIPOPRECIO<>'PRECIO')
            ;
            `;

            
    execute.QueryToken(res,qry,token);
     
});









router.post("/pedidos_pendientes", async(req,res)=>{
   
    const { token, sucursal } = req.body;

    let qry = `SELECT DOCUMENTOS.FECHA, 
                DOCUMENTOS.HORA, 
                DOCUMENTOS.MINUTO, 
                DOCUMENTOS.CODDOC, 
                DOCUMENTOS.CORRELATIVO, 
                DOCUMENTOS.DOC_NIT AS NIT, 
                DOCUMENTOS.DOC_NOMCLIE AS NOMCLIE, 
                DOCUMENTOS.DOC_DIRCLIE AS DIRCLIE, 
                DOCUMENTOS.TOTALPRECIO AS TOTALVENTA, 
                DOCUMENTOS.STATUS, 
                DOCUMENTOS.DIRENTREGA, 
                DOCUMENTOS.LAT, DOCUMENTOS.LONG
            FROM DOCUMENTOS LEFT OUTER JOIN
                TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
            WHERE (DOCUMENTOS.EMPNIT = '${sucursal}') 
            AND (DOCUMENTOS.CORTE = 'NO') 
            AND (TIPODOCUMENTOS.TIPODOC = 'ENV')`;
    

    execute.QueryToken(res,qry,token);
     
});


router.post("/detalle_pedido", async(req,res)=>{
   
    const { token, sucursal, coddoc, correlativo } = req.body;

    let qry = `
        SELECT CODPROD, DESPROD, CODMEDIDA, 
                CANTIDAD, EQUIVALE, TOTALUNIDADES, COSTO, PRECIO,
                TOTALCOSTO, TOTALPRECIO,ENTREGADOS_TOTALUNIDADES
        FROM DOCPRODUCTOS
        WHERE EMPNIT='${sucursal}'
            AND CODDOC='${coddoc}'
            AND CORRELATIVO=${correlativo}
                `;
    

    
    execute.QueryToken(res,qry,token);
     
});





module.exports = router;


