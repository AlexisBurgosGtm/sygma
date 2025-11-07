const execute = require('./../connection');
const express = require('express');
const router = express.Router();



function str_qry_documentos(jsondocproductos,sucursal,codembarque,
    coddoc,correlativo,anio,mes,fecha,fechaentrega,formaentrega,
    codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
    nitclie, dirclie, obs, direntrega, usuario,
    codven, lat, long, hora, tipo_pago, tipo_doc,
    entrega_contacto, entrega_telefono, entrega_direccion,
    entrega_referencia, entrega_lat, entrega_long,
    codcaja, iva,serie_fac,numero_fac,etiqueta,coddoc_origen,correlativo_origen){

    let qry = `INSERT INTO DOCUMENTOS (
            EMPNIT,
            ANIO,
            MES,
            FECHA,
            HORA,
            CODDOC,
            CORRELATIVO,
            CODCLIENTE,
            DOC_NIT,
            DOC_NOMCLIE,
            DOC_DIRCLIE,
            TOTALCOSTO,
            TOTALVENTA,
            TOTALDESCUENTO,
            RECARGOTARJETA,
            TOTALPRECIO,
            PAGO,
            VUELTO,
            STATUS,
            TOTAL_EFECTIVO,
            TOTAL_TARJETA,
            TOTAL_DEPOSITOS,
            TOTAL_CHEQUES,
            USUARIO,
            CONCRE,
            CODCAJA,
            NOCORTE,
            SERIEFAC,
            NOFAC,
            CODEMP,
            OBS,
            DOC_SALDO,
            DOC_ABONOS,
            DIRENTREGA,
            TOTALEXENTO,
            LAT,LONG,
            VENCIMIENTO,
            ENTREGADO,
            POR_IVA,
            TIPO_VENTA,
            ETIQUETA,
            CODDOC_ORIGEN,
            CORRELATIVO_ORIGEN,
            CODEMBARQUE,
            JSONDOCPRODUCTOS)
        SELECT
            '${sucursal}' AS EMPNIT,
            YEAR('${fecha}') AS ANIO, 
            MONTH('${fecha}') AS MES,
            '${fecha}' AS FECHA, 
            '${hora}' AS HORA,
            '${coddoc}' AS CODDOC, 
            ${correlativo} AS CORRELATIVO,
            ${codcliente} AS CODCLIENTE, 
            '${nitclie}' AS DOC_NIT,
            '${nomclie}' AS DOC_NOMCLIE, 
            '${dirclie}' AS DOC_DIRCLIE,
            ${totalcosto} AS TOTALCOSTO, 
            ${totalprecio} AS TOTALVENTA,
            ${totaldescuento} AS TOTALDESCUENTO, 
            0 AS RECARGOTARJETA,
            ${(Number(totalprecio)-Number(totaldescuento))} AS TOTALPRECIO, 
            0 AS PAGO, 
            0 AS VUELTO,
            'O' AS STATUS,
            0 AS TOTAL_EFECTIVO, 
            0 AS TOTAL_TARJETA, 
            0 AS TOTAL_DEPOSITOS,
            0 AS TOTAL_CHEQUES,
            '${usuario}' AS USUARIO, 
            '${tipo_pago}' AS CONCRE,
            ${codcaja} AS CODCAJA, 
            0 AS NOCORTE, 
            '${serie_fac}' AS SERIEFAC,
            '${numero_fac}' AS NOFAC, 
            ${codven} AS CODEMP,
            '${obs}' AS OBS,
            0 AS DOC_SALDO, 
            0 AS DOC_ABONOS, 
            '${direntrega}' AS DIRENTREGA,
            0 AS TOTALEXENTO, 
            ${lat} AS LAT, 
            ${long} AS LONG,
            '${fechaentrega}' AS VENCIMIENTO,
            'NO' AS ENTREGADO, 
            ${iva} POR_IVA,
            '${tipo_doc}' AS TIPO_VENTA,
            '${etiqueta}' AS ETIQUETA,
            '${coddoc_origen}' AS CODDOC_ORIGEN,
            '${correlativo_origen}' AS CORRELATIVO_ORIGEN,
            '${codembarque}' AS CODEMBARQUE,
            '${jsondocproductos}' AS JSONDOCPRODUCTOS;
        `

    return qry;

};

function str_qry_docproductos(sucursal,coddoc,correlativo,anio,mes,iva,codbodega,fecha,jsondocproductos){

    let qry = '';    

    let data = JSON.parse(jsondocproductos);
    data.map((r)=>{
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
            BONO
            )
        SELECT 
            '${sucursal}' AS EMPNIT,
            YEAR('${fecha}') AS ANIO, 
            MONTH('${fecha}') AS MES,
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
            ${r.BONO} AS BONO;
        `

    })


    

    return qry;

};


router.post("/insert_devolucion", async(req,res)=>{
   

    const { token,jsondocproductos,sucursal,codembarque,
            coddoc,correlativo,serie_fac,numero_fac,anio,mes,fecha,fechaentrega,formaentrega,
            codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
            nitclie, dirclie, obs, direntrega, usuario,
            codven, lat, long, hora, tipo_pago, tipo_doc,
            entrega_contacto, entrega_telefono, entrega_direccion,
            entrega_referencia, entrega_lat, entrega_long,
            codcaja, iva, etiqueta, coddoc_origen, correlativo_origen} = req.body;




    let qryDocumentos = str_qry_documentos(jsondocproductos,sucursal,codembarque,
        coddoc,correlativo,anio,mes,fecha,fechaentrega,formaentrega,
        codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
        nitclie, dirclie, obs, direntrega, usuario,
        codven, lat, long, hora, tipo_pago, tipo_doc,
        entrega_contacto, entrega_telefono, entrega_direccion,
        entrega_referencia, entrega_lat, entrega_long,
        codcaja, iva,serie_fac,numero_fac,etiqueta,coddoc_origen,correlativo_origen);

    let qryDocproductos = str_qry_docproductos(sucursal,coddoc,correlativo,anio,mes,iva,codbodega,fecha,jsondocproductos);
   
    let nuevoCorrelativo = Number(correlativo) + 1;
    let qryTipodocumentos = `UPDATE TIPODOCUMENTOS SET CORRELATIVO=${nuevoCorrelativo} WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}';`;
  
    let qry = qryDocumentos + qryDocproductos + qryTipodocumentos;

   
    
    execute.QueryToken(res,qry,token);
     
});



router.post("/insert_item_editar_factura", async(req,res)=>{
   
    const { token, sucursal, coddoc,correlativo,
        codprod, desprod, codmedida, cantidad, equivale,
        totalunidades,costo,precio,totalcosto,totalprecio,
        descuento,tipoprod,tipoprecio,lastupdate,por_iva,existencia,
        bono,exento
    } = req.body;


    let qry = `
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
            EMPNIT,
            ANIO,
            MES,
            CODDOC,
            CORRELATIVO,
            '${codprod}' AS CODPROD,
            '${desprod}' AS DESPROD,
            '${codmedida}' AS CODMEDIDA,
            ${cantidad} AS CANTIDAD,
            0 AS CANTIDADBONIF,
            ${equivale} AS EQUIVALE,
            ${totalunidades} AS TOTALUNIDADES,
            0 AS TOTALBONIF,
            ${costo} AS COSTO,
            ${precio} AS PRECIO,
            ${totalcosto} AS TOTALCOSTO,
            ${descuento} AS DESCUENTO,
            ${totalprecio} AS TOTALPRECIO,
            0 AS ENTREGADOS_TOTALUNIDADES,
            ${costo} AS COSTOANTERIOR,
            ${costo} AS COSTOPROMEDIO,
            0 AS CODBODEGA,
            '' AS NOSERIE,
            ${exento} AS EXENTO,
            '' AS OBS,
            '${tipoprod}' AS TIPOPROD,
            '${tipoprecio}' AS TIPOPRECIO,
            '${lastupdate}' AS LASTUPDATE,
            0 AS TOTALUNIDADES_DEVUELTAS,
            ${por_iva} AS POR_IVA,
            ${existencia} AS EXISTENCIA,
            ${bono} AS BONO,
            ${Number(bono) * Number(bono)} AS TOTALBONO
        FROM DOCUMENTOS
        WHERE EMPNIT='${sucursal}' 
            AND CODDOC='${coddoc}' 
            AND CORRELATIVO=${correlativo};     
    `

    execute.QueryToken(res,qry,token);
     
});

router.post("/update_totales_documento", async(req,res)=>{
   
    const { token, sucursal, totalcosto,totaldescuento,totalprecio,coddoc,correlativo} = req.body;

    let qry = `
           UPDATE DOCUMENTOS SET
                TOTALCOSTO=${totalcosto},
                TOTALVENTA=${totalprecio},
                TOTALDESCUENTO=${totaldescuento},
                TOTALPRECIO=${totalprecio} 
           WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}' AND CORRELATIVO=${correlativo} ;  `

    execute.QueryToken(res,qry,token);
     
});


router.post("/eliminar_item_documento", async(req,res)=>{
   
    const { token, sucursal, id} = req.body;

    let qry = `
            DELETE FROM DOCPRODUCTOS WHERE ID=${id} AND EMPNIT='${sucursal}';  `

    execute.QueryToken(res,qry,token);
     
});




router.post("/documentos_pendientes", async(req,res)=>{
   
    const { token, sucursal, tipodoc} = req.body;

    let qry = `
        SELECT DOCUMENTOS.EMPNIT, DOCUMENTOS.FECHA, DOCUMENTOS.HORA, DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO, 
            DOCUMENTOS.CODCLIENTE, DOCUMENTOS.DOC_NIT AS NIT, DOCUMENTOS.DOC_NOMCLIE AS NOMBRE, 
            DOCUMENTOS.DOC_DIRCLIE AS DIRECCION, DOCUMENTOS.TOTALVENTA AS IMPORTE, DOCUMENTOS.STATUS, DOCUMENTOS.OBS, DOCUMENTOS.ETIQUETA
        FROM  DOCUMENTOS LEFT OUTER JOIN
                  TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
        WHERE (DOCUMENTOS.EMPNIT = '${sucursal}') 
            AND (TIPODOCUMENTOS.TIPODOC = '${tipodoc}') 
            AND (DOCUMENTOS.STATUS = 'O')
    `

    console.log(qry);
    
    execute.QueryToken(res,qry,token);
     
});


router.post("/detalle_documento", async(req,res)=>{
   
    const { token, sucursal, coddoc,correlativo} = req.body;

    let qry = `
        SELECT 
            DOCPRODUCTOS.ID, 
            DOCPRODUCTOS.CODPROD, 
            DOCPRODUCTOS.DESPROD, 
            MARCAS.DESMARCA,
            DOCPRODUCTOS.CODMEDIDA, 
            DOCPRODUCTOS.CANTIDAD, 
            DOCPRODUCTOS.CANTIDADBONIF, 
            DOCPRODUCTOS.EQUIVALE, 
            DOCPRODUCTOS.TOTALUNIDADES, 
            DOCPRODUCTOS.TOTALBONIF, 
            DOCPRODUCTOS.COSTO, 
            DOCPRODUCTOS.PRECIO, 
            DOCPRODUCTOS.TOTALCOSTO, 
            DOCPRODUCTOS.DESCUENTO, 
            DOCPRODUCTOS.TOTALPRECIO, 
            DOCPRODUCTOS.OBS, 
            DOCPRODUCTOS.EXENTO, 
            DOCPRODUCTOS.TIPOPROD, 
            DOCPRODUCTOS.TIPOPRECIO, 
            DOCPRODUCTOS.EXISTENCIA
        FROM PRODUCTOS INNER JOIN
                  MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA RIGHT OUTER JOIN
                  DOCPRODUCTOS ON PRODUCTOS.CODPROD = DOCPRODUCTOS.CODPROD
        WHERE  (DOCPRODUCTOS.EMPNIT = '${sucursal}') 
        AND (DOCPRODUCTOS.CODDOC = '${coddoc}') 
        AND (DOCPRODUCTOS.CORRELATIVO = ${correlativo})
    `
    
    execute.QueryToken(res,qry,token);
     
});


router.post("/detalle_documento_json", async(req,res)=>{
   
    const { token, sucursal, coddoc,correlativo} = req.body;

    let qry = `
        SELECT ISNULL(OBS,'') AS OBS, JSONDOCPRODUCTOS 
        FROM DOCUMENTOS
        WHERE (EMPNIT = '${sucursal}') 
        AND (CODDOC = '${coddoc}') 
        AND (CORRELATIVO = ${correlativo})
    `
    
    execute.QueryToken(res,qry,token);
     
});


router.post("/BACKUP_detalle_documento_json", async(req,res)=>{
   
    const { token, sucursal, coddoc,correlativo} = req.body;

    let qry = `
        SELECT ISNULL(OBS,'') AS OBS, JSONDOCPRODUCTOS 
        FROM DOCUMENTOS_TEMPORALES
        WHERE (EMPNIT = '${sucursal}') 
        AND (CODDOC = '${coddoc}') 
        AND (CORRELATIVO = ${correlativo})
    `
    
    execute.QueryToken(res,qry,token);
     
});


router.post("/eliminar_documento", async(req,res)=>{
   
    const { token, sucursal, coddoc,correlativo} = req.body;

    let qry = `DELETE FROM DOCUMENTOS 
                    WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}' AND CORRELATIVO=${correlativo};
                DELETE FROM DOCPRODUCTOS 
                    WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}' AND CORRELATIVO=${correlativo};    
                `
    
    execute.QueryToken(res,qry,token);
     
});
router.post("/anular_documento", async(req,res)=>{
   
    const { token, sucursal, coddoc,correlativo} = req.body;

    let qry = `UPDATE DOCUMENTOS SET STATUS='A' 
    WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}' AND CORRELATIVO=${correlativo};`
    
    execute.QueryToken(res,qry,token);
     
});
router.post("/desanular_documento", async(req,res)=>{
   
    const { token, sucursal, coddoc,correlativo} = req.body;

    let qry = `UPDATE DOCUMENTOS SET STATUS='O' 
    WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}' AND CORRELATIVO=${correlativo};`
    
    execute.QueryToken(res,qry,token);
     
});

router.post("/update_empleado_documento", async(req,res)=>{
   
    const { token, sucursal, coddoc,correlativo,codemp,fecha} = req.body;

    let qry = `UPDATE DOCUMENTOS 
                    SET CODEMP=${codemp}, LASTUPDATE='${fecha}'
                    WHERE EMPNIT='${sucursal}' AND 
                        CODDOC='${coddoc}' AND 
                        CORRELATIVO=${correlativo};    
                `
    
    execute.QueryToken(res,qry,token);
     
});


router.post("/listado_documentos", async(req,res)=>{
   
    const { token, sucursal, anio, mes, tipo} = req.body;

    let qry = `SELECT 
                    DOCUMENTOS.FECHA, 
                    DOCUMENTOS.CODDOC, 
                    DOCUMENTOS.CORRELATIVO, 
                    DOCUMENTOS.DOC_NIT AS NIT, 
                    DOCUMENTOS.DOC_NOMCLIE AS NOMBRE, 
                    DOCUMENTOS.DOC_DIRCLIE AS DIRECCION, 
                    DOCUMENTOS.TOTALCOSTO, 
                    DOCUMENTOS.TOTALVENTA, 
                    DOCUMENTOS.STATUS, 
                    DOCUMENTOS.USUARIO, 
                    DOCUMENTOS.CONCRE, 
                    DOCUMENTOS.CODCAJA, 
                    DOCUMENTOS.NOCORTE, 
                    DOCUMENTOS.LAT, 
                    DOCUMENTOS.LONG, 
                    DOCUMENTOS.ENTREGADO, 
                    TIPODOCUMENTOS.TIPODOC, 
                    DOCUMENTOS.ETIQUETA, 
                    DOCUMENTOS.EMPNIT_DESTINO, 
                    DOCUMENTOS.OBS, 
                    DOCUMENTOS.CODDOC_ORIGEN, 
                    DOCUMENTOS.CORRELATIVO_ORIGEN, 
                    EMPLEADOS.NOMEMPLEADO AS EMPLEADO,
                    ISNULL(DOCUMENTOS.LASTUPDATE,'2000-01-01') AS LASTUPDATE
            FROM  DOCUMENTOS LEFT OUTER JOIN
                  EMPLEADOS ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO AND DOCUMENTOS.EMPNIT = EMPLEADOS.EMPNIT LEFT OUTER JOIN
                  TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
            WHERE (DOCUMENTOS.EMPNIT = '${sucursal}') AND (DOCUMENTOS.ANIO = ${anio}) AND (DOCUMENTOS.MES = ${mes}) 
                    AND (TIPODOCUMENTOS.TIPODOC = '${tipo}')`
    
    execute.QueryToken(res,qry,token);
     
});

router.post("/listado_documentos_fechas", async(req,res)=>{
   
    const { token, sucursal, fi, ff, tipo} = req.body;

    let qry = `SELECT DOCUMENTOS.EMPNIT, DOCUMENTOS.FECHA, 
                DOCUMENTOS.CODDOC, 
                DOCUMENTOS.CORRELATIVO, 
                DOCUMENTOS.CODCLIENTE,
                DOCUMENTOS.DOC_NIT AS NIT, 
                DOCUMENTOS.DOC_NOMCLIE AS NOMBRE, 
                DOCUMENTOS.DOC_DIRCLIE AS DIRECCION, 
                  DOCUMENTOS.TOTALCOSTO, DOCUMENTOS.TOTALVENTA, 
                  DOCUMENTOS.STATUS, DOCUMENTOS.USUARIO, 
                  DOCUMENTOS.CONCRE, 
                  DOCUMENTOS.CODCAJA, 
                  DOCUMENTOS.NOCORTE, DOCUMENTOS.LAT, DOCUMENTOS.LONG, 
                  DOCUMENTOS.ENTREGADO, TIPODOCUMENTOS.TIPODOC, DOCUMENTOS.ETIQUETA, 
                  DOCUMENTOS.EMPNIT_DESTINO, 
                  DOCUMENTOS.OBS, 
                  DOCUMENTOS.CODDOC_ORIGEN, 
                  DOCUMENTOS.CORRELATIVO_ORIGEN, 
                  EMPRESAS.NOMBRE AS SUCURSAL, 
                  DOCUMENTOS.CODEMP,
                  EMPLEADOS.NOMEMPLEADO AS EMPLEADO,
                  DOCUMENTOS.CODEMBARQUE
FROM     DOCUMENTOS LEFT OUTER JOIN
                  EMPLEADOS ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO LEFT OUTER JOIN
                  EMPRESAS ON DOCUMENTOS.EMPNIT = EMPRESAS.EMPNIT LEFT OUTER JOIN
                  TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
    WHERE (DOCUMENTOS.EMPNIT LIKE '%${sucursal}%') AND (DOCUMENTOS.FECHA BETWEEN '${fi}' AND '${ff}')  
    AND (TIPODOCUMENTOS.TIPODOC = '${tipo}')`
    
    execute.QueryToken(res,qry,token);
     
});






module.exports = router;