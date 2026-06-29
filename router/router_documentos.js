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
            DOCPRODUCTOS.EXISTENCIA,
            DOCUMENTOS.DOC_NOMCLIE AS NOMCLIE,
            DOCUMENTOS.DOC_DIRCLIE AS DIRCLIE,
            ISNULL(DOCUMENTOS.CODEMBARQUE, '') AS CODEMBARQUE,
            ISNULL(DOCUMENTOS.OBS, '') AS DOCOBS
        FROM PRODUCTOS INNER JOIN
                  MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA RIGHT OUTER JOIN
                  DOCPRODUCTOS ON PRODUCTOS.CODPROD = DOCPRODUCTOS.CODPROD INNER JOIN
                  DOCUMENTOS ON DOCPRODUCTOS.EMPNIT = DOCUMENTOS.EMPNIT
                      AND DOCPRODUCTOS.CODDOC = DOCUMENTOS.CODDOC
                      AND DOCPRODUCTOS.CORRELATIVO = DOCUMENTOS.CORRELATIVO
        WHERE  (DOCPRODUCTOS.EMPNIT = '${sucursal}') 
        AND (DOCPRODUCTOS.CODDOC = '${coddoc}') 
        AND (DOCPRODUCTOS.CORRELATIVO = ${correlativo})
    `
    
    execute.QueryToken(res,qry,token);
     
});

router.post("/encabezado_documento", async(req,res)=>{

    const { token, sucursal, coddoc, correlativo } = req.body;

    let qry = `
        SELECT
            DOCUMENTOS.CODDOC,
            DOCUMENTOS.CORRELATIVO,
            DOCUMENTOS.DOC_NIT AS NIT,
            DOCUMENTOS.DOC_NOMCLIE AS NOMCLIE,
            DOCUMENTOS.DOC_DIRCLIE AS DIRCLIE,
            DOCUMENTOS.FECHA,
            DOCUMENTOS.HORA,
            DOCUMENTOS.VENCIMIENTO,
            DOCUMENTOS.CONCRE,
            DOCUMENTOS.OBS,
            DOCUMENTOS.TOTALVENTA,
            DOCUMENTOS.TOTALPRECIO,
            DOCUMENTOS.STATUS AS ST,
            TIPODOCUMENTOS.TIPODOC,
            ISNULL(TIPODOCUMENTOS.DESCRIPCION, TIPODOCUMENTOS.TIPODOC) AS DESCTIPODOC,
            EMPLEADOS.NOMEMPLEADO
        FROM DOCUMENTOS LEFT OUTER JOIN
            TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT LEFT OUTER JOIN
            EMPLEADOS ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO AND DOCUMENTOS.EMPNIT = EMPLEADOS.EMPNIT
        WHERE DOCUMENTOS.EMPNIT='${sucursal}'
            AND DOCUMENTOS.CODDOC='${coddoc}'
            AND DOCUMENTOS.CORRELATIVO=${correlativo};
    `;

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
router.post("/update_fecha_documento", async(req,res)=>{
   
    const { token, sucursal, coddoc,correlativo,fecha} = req.body;

    let qry = `UPDATE DOCUMENTOS 
                    SET 
                        FECHA='${fecha}', 
                        LASTUPDATE='${fecha}',
                        MES=MONTH('${fecha}'),
                        ANIO=YEAR('${fecha}')
                    WHERE EMPNIT='${sucursal}' AND 
                        CODDOC='${coddoc}' AND 
                        CORRELATIVO=${correlativo};
                UPDATE DOCPRODUCTOS 
                    SET 
                        MES=MONTH('${fecha}'),
                        ANIO=YEAR('${fecha}')
                    WHERE EMPNIT='${sucursal}' AND 
                        CODDOC='${coddoc}' AND 
                        CORRELATIVO=${correlativo};
                `
    
    execute.QueryToken(res,qry,token);
     
});
router.post("/update_concre_documento", async(req,res)=>{
   
    const { token, sucursal, coddoc, correlativo, concre, fecha, diascredito, vencimiento, totaldescuento} = req.body;
    const tipoPago = (concre === 'CRE') ? 'CRE' : 'CON';
    const desc = Number(totaldescuento) || 0;

    let setSaldos = '';
    if (tipoPago === 'CRE') {
        setSaldos = `DOC_SALDO=CASE WHEN ISNULL(TOTALPRECIO, 0) - ${desc} < 0 THEN 0 ELSE ISNULL(TOTALPRECIO, 0) - ${desc} END, DOC_ABONOS=0, TOTALDESCUENTO=${desc}`;
    } else {
        setSaldos = `DOC_ABONOS=TOTALPRECIO, DOC_SALDO=0`;
    }

    let setCredito = '';
    if (tipoPago === 'CRE') {
        const dias = Number(diascredito) || 0;
        const venc = vencimiento || fecha;
        setCredito = `, DIASCREDITO=${dias}, VENCIMIENTO='${venc}'`;
    } else {
        setCredito = `, DIASCREDITO=0, VENCIMIENTO=FECHA`;
    }

    let qry = `UPDATE DOCUMENTOS 
                    SET CONCRE='${tipoPago}',
                        ${setSaldos},
                        LASTUPDATE='${fecha}'
                        ${setCredito}
                    WHERE EMPNIT='${sucursal}' AND 
                        CODDOC='${coddoc}' AND 
                        CORRELATIVO=${correlativo} AND
                        STATUS <> 'A';    
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
                    DOCUMENTOS.CODEMP, 
                    EMPLEADOS.NOMEMPLEADO AS EMPLEADO,
                    DOCUMENTOS.VENCIMIENTO,
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







router.post("/listado_cuentas_cobrar", async(req,res)=>{
   
    const { token, sucursal, mes, anio} = req.body;

    let filtroPeriodo = '';
    if (anio && String(anio) !== 'TODOS') {
        filtroPeriodo += ` AND (DOCUMENTOS.ANIO = ${Number(anio)})`;
    }
    if (mes && String(mes) !== 'TODOS') {
        filtroPeriodo += ` AND (DOCUMENTOS.MES = ${Number(mes)})`;
    }

    let qry = `SELECT 
                    DOCUMENTOS.FECHA, 
                    DOCUMENTOS.CODDOC, 
                    DOCUMENTOS.CORRELATIVO, 
                    DOCUMENTOS.DOC_NIT AS NIT, 
                    DOCUMENTOS.DOC_NOMCLIE AS NOMBRE, 
                    DOCUMENTOS.DOC_DIRCLIE AS DIRECCION, 
                    DOCUMENTOS.TOTALVENTA, 
                    DOCUMENTOS.TOTALPRECIO, 
                    ISNULL(DOCUMENTOS.TOTALDESCUENTO, 0) AS TOTALDESCUENTO,
                    ISNULL(DOCUMENTOS.DOC_SALDO, 0) AS DOC_SALDO, 
                    ISNULL(DOCUMENTOS.DOC_ABONOS, 0) AS DOC_ABONOS, 
                    DOCUMENTOS.STATUS, 
                    DOCUMENTOS.CONCRE, 
                    DOCUMENTOS.VENCIMIENTO, 
                    ISNULL(DOCUMENTOS.DIASCREDITO, 0) AS DIASCREDITO,
                    DOCUMENTOS.CODEMP, 
                    DOCUMENTOS.CODCLIENTE,
                    EMPLEADOS.NOMEMPLEADO AS EMPLEADO,
                    TIPODOCUMENTOS.TIPODOC
            FROM DOCUMENTOS 
            INNER JOIN TIPODOCUMENTOS 
                ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC 
                AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT 
            LEFT OUTER JOIN EMPLEADOS 
                ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO 
                AND DOCUMENTOS.EMPNIT = EMPLEADOS.EMPNIT
            WHERE (DOCUMENTOS.EMPNIT = '${sucursal}') 
                AND (TIPODOCUMENTOS.TIPODOC = 'FAC') 
                AND (DOCUMENTOS.CONCRE = 'CRE') 
                AND (ISNULL(DOCUMENTOS.DOC_SALDO, 0) > 0) 
                AND (DOCUMENTOS.STATUS <> 'A')
                ${filtroPeriodo}
            ORDER BY DOCUMENTOS.FECHA DESC, DOCUMENTOS.CORRELATIVO DESC`;
    
    execute.QueryToken(res,qry,token);
     
});

router.post("/historial_abonos_cxc", async(req,res)=>{
   
    const { token, sucursal, fac_coddoc, fac_correlativo} = req.body;

    let qry = `SELECT 
                    DOCUMENTOS.FECHA, 
                    DOCUMENTOS.CODDOC, 
                    DOCUMENTOS.CORRELATIVO, 
                    DOCUMENTOS.TOTALPRECIO, 
                    DOCUMENTOS.USUARIO, 
                    DOCUMENTOS.STATUS,
                    TIPODOCUMENTOS.TIPODOC,
                    ISNULL(DOCUMENTOS.FPAGO_TIPO, '') AS FPAGO_TIPO,
                    ISNULL(DOCUMENTOS.FPAGO_DETALLE, '') AS FPAGO_DETALLE
            FROM DOCUMENTOS 
            INNER JOIN TIPODOCUMENTOS 
                ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC 
                AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT 
            WHERE (DOCUMENTOS.EMPNIT = '${sucursal}') 
                AND (DOCUMENTOS.STATUS <> 'A')
                AND (
                    (
                        TIPODOCUMENTOS.TIPODOC = 'RCC'
                        AND DOCUMENTOS.SERIEFAC = '${fac_coddoc}'
                        AND DOCUMENTOS.NOFAC = '${fac_correlativo}'
                    )
                    OR (
                        TIPODOCUMENTOS.TIPODOC = 'DEV'
                        AND DOCUMENTOS.CODDOC_ORIGEN = '${fac_coddoc}'
                        AND DOCUMENTOS.CORRELATIVO_ORIGEN = '${fac_correlativo}'
                    )
                )
            ORDER BY DOCUMENTOS.FECHA DESC, DOCUMENTOS.CORRELATIVO DESC`;
    
    execute.QueryToken(res,qry,token);
     
});

router.post("/verificar_fpago_detalle_cxc", async(req,res)=>{
   
    const { token, sucursal, fpago_detalle } = req.body;
    const fpagoDetalle = (fpago_detalle || '').replace(/'/g, "''").trim();

    if (!fpagoDetalle) {
        res.send({ recordset: [{ CNT: 0 }] });
        return;
    }

    let qry = `SELECT COUNT(*) AS CNT
            FROM DOCUMENTOS 
            INNER JOIN TIPODOCUMENTOS 
                ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC 
                AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT 
            WHERE (DOCUMENTOS.EMPNIT = '${sucursal}') 
                AND (TIPODOCUMENTOS.TIPODOC = 'RCC')
                AND (DOCUMENTOS.STATUS <> 'A')
                AND (ISNULL(DOCUMENTOS.FPAGO_DETALLE, '') = '${fpagoDetalle}')`;

    execute.QueryToken(res,qry,token);
     
});

router.post("/insert_abono_cxc", async(req,res)=>{
   
    const { token, sucursal,
            coddoc, correlativo, fecha, monto,
            fac_coddoc, fac_correlativo,
            codcliente, nitclie, nomclie, dirclie, codven, usuario, hora, codcaja, iva,
            fpago_tipo, fpago_detalle} = req.body;

    const montoNum = Number(monto);
    if (!montoNum || montoNum <= 0) {
        res.send('error');
        return;
    }

    const nom = (nomclie || '').replace(/'/g, "''");
    const dir = (dirclie || '').replace(/'/g, "''");
    const nit = (nitclie || '').replace(/'/g, "''");
    const obs = `Abono factura ${fac_coddoc}-${fac_correlativo}`.replace(/'/g, "''");
    const fpagoTipo = (fpago_tipo || 'EFECTIVO').replace(/'/g, "''");
    const fpagoDetalle = (fpago_detalle || '').replace(/'/g, "''");

    let qryDocumentos = str_qry_documentos('[]',sucursal,'',
        coddoc,correlativo,0,0,fecha,fecha,'',
        '0',codcliente || 0,nom,0,montoNum,0,
        nit,dir,obs,'',usuario,
        codven || 0,'0','0',hora,'CON','RCC',
        '','','','','0','0',
        codcaja || 1,iva || 12,fac_coddoc,fac_correlativo,'MEDIA','','0');

    let nuevoCorrelativo = Number(correlativo) + 1;
    let qryTipodocumentos = `UPDATE TIPODOCUMENTOS SET CORRELATIVO=${nuevoCorrelativo} WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}';`;

    let qryUpdateFac = `UPDATE DOCUMENTOS 
                            SET DOC_ABONOS = ISNULL(DOC_ABONOS, 0) + ${montoNum},
                                DOC_SALDO = CASE 
                                    WHEN ISNULL(DOC_SALDO, 0) - ${montoNum} < 0 THEN 0 
                                    ELSE ISNULL(DOC_SALDO, 0) - ${montoNum} 
                                END,
                                LASTUPDATE='${fecha}'
                            WHERE EMPNIT='${sucursal}' 
                                AND CODDOC='${fac_coddoc}' 
                                AND CORRELATIVO=${fac_correlativo} 
                                AND STATUS <> 'A'
                                AND ISNULL(DOC_SALDO, 0) >= ${montoNum};`;

    let qryUpdateFpago = `UPDATE DOCUMENTOS 
                            SET FPAGO_TIPO='${fpagoTipo}',
                                FPAGO_DETALLE='${fpagoDetalle}'
                            WHERE EMPNIT='${sucursal}' 
                                AND CODDOC='${coddoc}' 
                                AND CORRELATIVO=${correlativo};`;

    let qry = qryDocumentos + qryUpdateFpago + qryTipodocumentos + qryUpdateFac;

    execute.QueryToken(res,qry,token);
     
});

router.post("/estado_cuenta_cliente", async(req,res)=>{
   
    const { token, sucursal, codcliente} = req.body;
    const codClie = Number(codcliente) || 0;
    if (!codClie) {
        res.send('error');
        return;
    }

    let qry = `
            SELECT 
                DOCUMENTOS.FECHA AS FECHA,
                0 AS ORDEN,
                CAST('CARGO' AS VARCHAR(10)) AS MOV_TIPO,
                CAST(TIPODOCUMENTOS.TIPODOC AS VARCHAR(10)) AS TIPODOC,
                CAST(DOCUMENTOS.CODDOC AS VARCHAR(20)) AS CODDOC,
                DOCUMENTOS.CORRELATIVO AS CORRELATIVO,
                CAST(ISNULL(DOCUMENTOS.TOTALPRECIO, 0) AS DECIMAL(18,2)) AS MONTO,
                CAST(RTRIM(DOCUMENTOS.CODDOC) + '-' + CAST(DOCUMENTOS.CORRELATIVO AS VARCHAR(20)) AS VARCHAR(60)) AS REFERENCIA,
                CAST(ISNULL(DOCUMENTOS.DOC_NOMCLIE, '') AS VARCHAR(200)) AS NOMBRE,
                CAST(ISNULL(DOCUMENTOS.DOC_NIT, '') AS VARCHAR(40)) AS NIT,
                CAST(ISNULL(DOCUMENTOS.FPAGO_TIPO, '') AS VARCHAR(40)) AS FPAGO_TIPO,
                CAST(ISNULL(DOCUMENTOS.FPAGO_DETALLE, '') AS VARCHAR(200)) AS FPAGO_DETALLE
            FROM DOCUMENTOS
            INNER JOIN TIPODOCUMENTOS
                ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC
                AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
            WHERE DOCUMENTOS.EMPNIT = '${sucursal}'
                AND DOCUMENTOS.CODCLIENTE = ${codClie}
                AND TIPODOCUMENTOS.TIPODOC = 'FAC'
                AND DOCUMENTOS.CONCRE = 'CRE'
                AND DOCUMENTOS.STATUS <> 'A'

            UNION ALL

            SELECT 
                DOCUMENTOS.FECHA AS FECHA,
                1 AS ORDEN,
                CAST('ABONO' AS VARCHAR(10)) AS MOV_TIPO,
                CAST(TIPODOCUMENTOS.TIPODOC AS VARCHAR(10)) AS TIPODOC,
                CAST(DOCUMENTOS.CODDOC AS VARCHAR(20)) AS CODDOC,
                DOCUMENTOS.CORRELATIVO AS CORRELATIVO,
                CAST(ISNULL(DOCUMENTOS.TOTALPRECIO, 0) AS DECIMAL(18,2)) AS MONTO,
                CAST(ISNULL(DOCUMENTOS.SERIEFAC, '') + CASE WHEN ISNULL(DOCUMENTOS.NOFAC, '') <> '' THEN '-' + DOCUMENTOS.NOFAC ELSE '' END AS VARCHAR(60)) AS REFERENCIA,
                CAST(ISNULL(DOCUMENTOS.DOC_NOMCLIE, '') AS VARCHAR(200)) AS NOMBRE,
                CAST(ISNULL(DOCUMENTOS.DOC_NIT, '') AS VARCHAR(40)) AS NIT,
                CAST(ISNULL(DOCUMENTOS.FPAGO_TIPO, '') AS VARCHAR(40)) AS FPAGO_TIPO,
                CAST(ISNULL(DOCUMENTOS.FPAGO_DETALLE, '') AS VARCHAR(200)) AS FPAGO_DETALLE
            FROM DOCUMENTOS
            INNER JOIN TIPODOCUMENTOS
                ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC
                AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
            WHERE DOCUMENTOS.EMPNIT = '${sucursal}'
                AND DOCUMENTOS.CODCLIENTE = ${codClie}
                AND TIPODOCUMENTOS.TIPODOC = 'RCC'
                AND DOCUMENTOS.STATUS <> 'A'

            UNION ALL

            SELECT 
                DOCUMENTOS.FECHA AS FECHA,
                1 AS ORDEN,
                CAST('ABONO' AS VARCHAR(10)) AS MOV_TIPO,
                CAST(TIPODOCUMENTOS.TIPODOC AS VARCHAR(10)) AS TIPODOC,
                CAST(DOCUMENTOS.CODDOC AS VARCHAR(20)) AS CODDOC,
                DOCUMENTOS.CORRELATIVO AS CORRELATIVO,
                CAST(ISNULL(DOCUMENTOS.TOTALPRECIO, 0) AS DECIMAL(18,2)) AS MONTO,
                CAST(ISNULL(DOCUMENTOS.CODDOC_ORIGEN, '') + CASE WHEN ISNULL(DOCUMENTOS.CORRELATIVO_ORIGEN, '') <> '' THEN '-' + DOCUMENTOS.CORRELATIVO_ORIGEN ELSE '' END AS VARCHAR(60)) AS REFERENCIA,
                CAST(ISNULL(DOCUMENTOS.DOC_NOMCLIE, '') AS VARCHAR(200)) AS NOMBRE,
                CAST(ISNULL(DOCUMENTOS.DOC_NIT, '') AS VARCHAR(40)) AS NIT,
                CAST(ISNULL(DOCUMENTOS.FPAGO_TIPO, '') AS VARCHAR(40)) AS FPAGO_TIPO,
                CAST(ISNULL(DOCUMENTOS.FPAGO_DETALLE, '') AS VARCHAR(200)) AS FPAGO_DETALLE
            FROM DOCUMENTOS
            INNER JOIN TIPODOCUMENTOS
                ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC
                AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
            WHERE DOCUMENTOS.EMPNIT = '${sucursal}'
                AND DOCUMENTOS.CODCLIENTE = ${codClie}
                AND TIPODOCUMENTOS.TIPODOC = 'DEV'
                AND DOCUMENTOS.STATUS <> 'A'

            ORDER BY FECHA ASC, ORDEN ASC, CODDOC ASC, CORRELATIVO ASC`;
    
    execute.QueryToken(res,qry,token);
     
});

router.post("/corregir_saldos_cxc", async(req,res)=>{
   
    const { token, sucursal, fecha} = req.body;
    const fechaUpd = fecha || new Date().toISOString().substring(0, 10);

    let qry = `;WITH AbonosCalc AS (
            SELECT 
                d.EMPNIT,
                d.CODDOC,
                d.CORRELATIVO,
                ISNULL(d.TOTALPRECIO, 0) AS TOTALPRECIO,
                ISNULL(d.TOTALDESCUENTO, 0) AS TOTALDESCUENTO,
                ISNULL(ab.SUMA_ABONOS, 0) AS SUMA_ABONOS
            FROM DOCUMENTOS d
            INNER JOIN TIPODOCUMENTOS tf
                ON d.CODDOC = tf.CODDOC
                AND d.EMPNIT = tf.EMPNIT
            OUTER APPLY (
                SELECT SUM(ISNULL(x.TOTALPRECIO, 0)) AS SUMA_ABONOS
                FROM (
                    SELECT r.TOTALPRECIO
                    FROM DOCUMENTOS r
                    INNER JOIN TIPODOCUMENTOS tr
                        ON r.CODDOC = tr.CODDOC
                        AND r.EMPNIT = tr.EMPNIT
                    WHERE r.EMPNIT = d.EMPNIT
                        AND tr.TIPODOC = 'RCC'
                        AND r.SERIEFAC = d.CODDOC
                        AND r.NOFAC = CAST(d.CORRELATIVO AS VARCHAR(20))
                        AND r.STATUS <> 'A'

                    UNION ALL

                    SELECT dev.TOTALPRECIO
                    FROM DOCUMENTOS dev
                    INNER JOIN TIPODOCUMENTOS td
                        ON dev.CODDOC = td.CODDOC
                        AND dev.EMPNIT = td.EMPNIT
                    WHERE dev.EMPNIT = d.EMPNIT
                        AND td.TIPODOC = 'DEV'
                        AND dev.CODDOC_ORIGEN = d.CODDOC
                        AND dev.CORRELATIVO_ORIGEN = CAST(d.CORRELATIVO AS VARCHAR(20))
                        AND dev.STATUS <> 'A'
                ) x
            ) ab
            WHERE d.EMPNIT = '${sucursal}'
                AND tf.TIPODOC = 'FAC'
                AND d.CONCRE = 'CRE'
                AND d.STATUS <> 'A'
        )
        UPDATE d
        SET d.DOC_ABONOS = a.SUMA_ABONOS,
            d.DOC_SALDO = CASE 
                WHEN (a.TOTALPRECIO - a.TOTALDESCUENTO) - a.SUMA_ABONOS < 0 THEN 0 
                ELSE (a.TOTALPRECIO - a.TOTALDESCUENTO) - a.SUMA_ABONOS 
            END,
            d.LASTUPDATE = '${fechaUpd}'
        FROM DOCUMENTOS d
        INNER JOIN AbonosCalc a
            ON d.EMPNIT = a.EMPNIT
            AND d.CODDOC = a.CODDOC
            AND d.CORRELATIVO = a.CORRELATIVO;`;

    execute.QueryToken(res,qry,token);
     
});

router.post("/listado_cuentas_pagar", async(req,res)=>{
   
    const { token, sucursal, mes, anio} = req.body;

    let filtroPeriodo = '';
    if (anio && String(anio) !== 'TODOS') {
        filtroPeriodo += ` AND (DOCUMENTOS.ANIO = ${Number(anio)})`;
    }
    if (mes && String(mes) !== 'TODOS') {
        filtroPeriodo += ` AND (DOCUMENTOS.MES = ${Number(mes)})`;
    }

    let qry = `SELECT 
                    DOCUMENTOS.FECHA, 
                    DOCUMENTOS.CODDOC, 
                    DOCUMENTOS.CORRELATIVO, 
                    DOCUMENTOS.DOC_NIT AS NIT, 
                    DOCUMENTOS.DOC_NOMCLIE AS NOMBRE, 
                    DOCUMENTOS.DOC_DIRCLIE AS DIRECCION, 
                    DOCUMENTOS.TOTALVENTA, 
                    DOCUMENTOS.TOTALPRECIO, 
                    ISNULL(DOCUMENTOS.DOC_SALDO, 0) AS DOC_SALDO, 
                    ISNULL(DOCUMENTOS.DOC_ABONOS, 0) AS DOC_ABONOS, 
                    DOCUMENTOS.STATUS, 
                    DOCUMENTOS.CONCRE, 
                    DOCUMENTOS.VENCIMIENTO, 
                    DOCUMENTOS.CODEMP, 
                    DOCUMENTOS.CODCLIENTE,
                    EMPLEADOS.NOMEMPLEADO AS EMPLEADO,
                    TIPODOCUMENTOS.TIPODOC
            FROM DOCUMENTOS 
            INNER JOIN TIPODOCUMENTOS 
                ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC 
                AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT 
            LEFT OUTER JOIN EMPLEADOS 
                ON DOCUMENTOS.CODEMP = EMPLEADOS.CODEMPLEADO 
                AND DOCUMENTOS.EMPNIT = EMPLEADOS.EMPNIT
            WHERE (DOCUMENTOS.EMPNIT = '${sucursal}') 
                AND (TIPODOCUMENTOS.TIPODOC = 'COM') 
                AND (DOCUMENTOS.CONCRE = 'CRE') 
                AND (ISNULL(DOCUMENTOS.DOC_SALDO, 0) > 0) 
                AND (DOCUMENTOS.STATUS <> 'A')
                ${filtroPeriodo}
            ORDER BY DOCUMENTOS.FECHA DESC, DOCUMENTOS.CORRELATIVO DESC`;
    
    execute.QueryToken(res,qry,token);
     
});

router.post("/historial_abonos_cxp", async(req,res)=>{
   
    const { token, sucursal, fac_coddoc, fac_correlativo} = req.body;

    let qry = `SELECT 
                    DOCUMENTOS.FECHA, 
                    DOCUMENTOS.CODDOC, 
                    DOCUMENTOS.CORRELATIVO, 
                    DOCUMENTOS.TOTALPRECIO, 
                    DOCUMENTOS.USUARIO, 
                    DOCUMENTOS.STATUS,
                    TIPODOCUMENTOS.TIPODOC,
                    ISNULL(DOCUMENTOS.FPAGO_TIPO, '') AS FPAGO_TIPO,
                    ISNULL(DOCUMENTOS.FPAGO_DETALLE, '') AS FPAGO_DETALLE
            FROM DOCUMENTOS 
            INNER JOIN TIPODOCUMENTOS 
                ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC 
                AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT 
            WHERE (DOCUMENTOS.EMPNIT = '${sucursal}') 
                AND (DOCUMENTOS.STATUS <> 'A')
                AND (
                    (
                        TIPODOCUMENTOS.TIPODOC = 'RCP'
                        AND DOCUMENTOS.SERIEFAC = '${fac_coddoc}'
                        AND DOCUMENTOS.NOFAC = '${fac_correlativo}'
                    )
                    OR (
                        TIPODOCUMENTOS.TIPODOC = 'DVP'
                        AND DOCUMENTOS.CODDOC_ORIGEN = '${fac_coddoc}'
                        AND DOCUMENTOS.CORRELATIVO_ORIGEN = '${fac_correlativo}'
                    )
                )
            ORDER BY DOCUMENTOS.FECHA DESC, DOCUMENTOS.CORRELATIVO DESC`;
    
    execute.QueryToken(res,qry,token);
     
});

router.post("/insert_abono_cxp", async(req,res)=>{
   
    const { token, sucursal,
            coddoc, correlativo, fecha, monto,
            fac_coddoc, fac_correlativo,
            codcliente, nitclie, nomclie, dirclie, codven, usuario, hora, codcaja, iva,
            fpago_tipo, fpago_detalle} = req.body;

    const montoNum = Number(monto);
    if (!montoNum || montoNum <= 0) {
        res.send('error');
        return;
    }

    const nom = (nomclie || '').replace(/'/g, "''");
    const dir = (dirclie || '').replace(/'/g, "''");
    const nit = (nitclie || '').replace(/'/g, "''");
    const obs = `Abono compra ${fac_coddoc}-${fac_correlativo}`.replace(/'/g, "''");
    const fpagoTipo = (fpago_tipo || 'EFECTIVO').replace(/'/g, "''");
    const fpagoDetalle = (fpago_detalle || '').replace(/'/g, "''");

    let qryDocumentos = str_qry_documentos('[]',sucursal,'',
        coddoc,correlativo,0,0,fecha,fecha,'',
        '0',codcliente || 0,nom,0,montoNum,0,
        nit,dir,obs,'',usuario,
        codven || 0,'0','0',hora,'CON','RCP',
        '','','','','0','0',
        codcaja || 1,iva || 12,fac_coddoc,fac_correlativo,'MEDIA','','0');

    let nuevoCorrelativo = Number(correlativo) + 1;
    let qryTipodocumentos = `UPDATE TIPODOCUMENTOS SET CORRELATIVO=${nuevoCorrelativo} WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}';`;

    let qryUpdateCom = `UPDATE DOCUMENTOS 
                            SET DOC_ABONOS = ISNULL(DOC_ABONOS, 0) + ${montoNum},
                                DOC_SALDO = CASE 
                                    WHEN ISNULL(DOC_SALDO, 0) - ${montoNum} < 0 THEN 0 
                                    ELSE ISNULL(DOC_SALDO, 0) - ${montoNum} 
                                END,
                                LASTUPDATE='${fecha}'
                            WHERE EMPNIT='${sucursal}' 
                                AND CODDOC='${fac_coddoc}' 
                                AND CORRELATIVO=${fac_correlativo} 
                                AND STATUS <> 'A'
                                AND ISNULL(DOC_SALDO, 0) >= ${montoNum};`;

    let qryUpdateFpago = `UPDATE DOCUMENTOS 
                            SET FPAGO_TIPO='${fpagoTipo}',
                                FPAGO_DETALLE='${fpagoDetalle}'
                            WHERE EMPNIT='${sucursal}' 
                                AND CODDOC='${coddoc}' 
                                AND CORRELATIVO=${correlativo};`;

    let qry = qryDocumentos + qryUpdateFpago + qryTipodocumentos + qryUpdateCom;

    execute.QueryToken(res,qry,token);
     
});

router.post("/estado_cuenta_proveedor", async(req,res)=>{
   
    const { token, sucursal, codcliente} = req.body;
    const codClie = Number(codcliente) || 0;
    if (!codClie) {
        res.send('error');
        return;
    }

    let qry = `
            SELECT 
                DOCUMENTOS.FECHA AS FECHA,
                0 AS ORDEN,
                CAST('CARGO' AS VARCHAR(10)) AS MOV_TIPO,
                CAST(TIPODOCUMENTOS.TIPODOC AS VARCHAR(10)) AS TIPODOC,
                CAST(DOCUMENTOS.CODDOC AS VARCHAR(20)) AS CODDOC,
                DOCUMENTOS.CORRELATIVO AS CORRELATIVO,
                CAST(ISNULL(DOCUMENTOS.TOTALPRECIO, 0) AS DECIMAL(18,2)) AS MONTO,
                CAST(RTRIM(DOCUMENTOS.CODDOC) + '-' + CAST(DOCUMENTOS.CORRELATIVO AS VARCHAR(20)) AS VARCHAR(60)) AS REFERENCIA,
                CAST(ISNULL(DOCUMENTOS.DOC_NOMCLIE, '') AS VARCHAR(200)) AS NOMBRE,
                CAST(ISNULL(DOCUMENTOS.DOC_NIT, '') AS VARCHAR(40)) AS NIT,
                CAST(ISNULL(DOCUMENTOS.FPAGO_TIPO, '') AS VARCHAR(40)) AS FPAGO_TIPO,
                CAST(ISNULL(DOCUMENTOS.FPAGO_DETALLE, '') AS VARCHAR(200)) AS FPAGO_DETALLE
            FROM DOCUMENTOS
            INNER JOIN TIPODOCUMENTOS
                ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC
                AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
            WHERE DOCUMENTOS.EMPNIT = '${sucursal}'
                AND DOCUMENTOS.CODCLIENTE = ${codClie}
                AND TIPODOCUMENTOS.TIPODOC = 'COM'
                AND DOCUMENTOS.CONCRE = 'CRE'
                AND DOCUMENTOS.STATUS <> 'A'

            UNION ALL

            SELECT 
                DOCUMENTOS.FECHA AS FECHA,
                1 AS ORDEN,
                CAST('ABONO' AS VARCHAR(10)) AS MOV_TIPO,
                CAST(TIPODOCUMENTOS.TIPODOC AS VARCHAR(10)) AS TIPODOC,
                CAST(DOCUMENTOS.CODDOC AS VARCHAR(20)) AS CODDOC,
                DOCUMENTOS.CORRELATIVO AS CORRELATIVO,
                CAST(ISNULL(DOCUMENTOS.TOTALPRECIO, 0) AS DECIMAL(18,2)) AS MONTO,
                CAST(ISNULL(DOCUMENTOS.SERIEFAC, '') + CASE WHEN ISNULL(DOCUMENTOS.NOFAC, '') <> '' THEN '-' + DOCUMENTOS.NOFAC ELSE '' END AS VARCHAR(60)) AS REFERENCIA,
                CAST(ISNULL(DOCUMENTOS.DOC_NOMCLIE, '') AS VARCHAR(200)) AS NOMBRE,
                CAST(ISNULL(DOCUMENTOS.DOC_NIT, '') AS VARCHAR(40)) AS NIT,
                CAST(ISNULL(DOCUMENTOS.FPAGO_TIPO, '') AS VARCHAR(40)) AS FPAGO_TIPO,
                CAST(ISNULL(DOCUMENTOS.FPAGO_DETALLE, '') AS VARCHAR(200)) AS FPAGO_DETALLE
            FROM DOCUMENTOS
            INNER JOIN TIPODOCUMENTOS
                ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC
                AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
            WHERE DOCUMENTOS.EMPNIT = '${sucursal}'
                AND DOCUMENTOS.CODCLIENTE = ${codClie}
                AND TIPODOCUMENTOS.TIPODOC = 'RCP'
                AND DOCUMENTOS.STATUS <> 'A'

            UNION ALL

            SELECT 
                DOCUMENTOS.FECHA AS FECHA,
                1 AS ORDEN,
                CAST('ABONO' AS VARCHAR(10)) AS MOV_TIPO,
                CAST(TIPODOCUMENTOS.TIPODOC AS VARCHAR(10)) AS TIPODOC,
                CAST(DOCUMENTOS.CODDOC AS VARCHAR(20)) AS CODDOC,
                DOCUMENTOS.CORRELATIVO AS CORRELATIVO,
                CAST(ISNULL(DOCUMENTOS.TOTALPRECIO, 0) AS DECIMAL(18,2)) AS MONTO,
                CAST(ISNULL(DOCUMENTOS.CODDOC_ORIGEN, '') + CASE WHEN ISNULL(DOCUMENTOS.CORRELATIVO_ORIGEN, '') <> '' THEN '-' + DOCUMENTOS.CORRELATIVO_ORIGEN ELSE '' END AS VARCHAR(60)) AS REFERENCIA,
                CAST(ISNULL(DOCUMENTOS.DOC_NOMCLIE, '') AS VARCHAR(200)) AS NOMBRE,
                CAST(ISNULL(DOCUMENTOS.DOC_NIT, '') AS VARCHAR(40)) AS NIT,
                CAST(ISNULL(DOCUMENTOS.FPAGO_TIPO, '') AS VARCHAR(40)) AS FPAGO_TIPO,
                CAST(ISNULL(DOCUMENTOS.FPAGO_DETALLE, '') AS VARCHAR(200)) AS FPAGO_DETALLE
            FROM DOCUMENTOS
            INNER JOIN TIPODOCUMENTOS
                ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC
                AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
            WHERE DOCUMENTOS.EMPNIT = '${sucursal}'
                AND DOCUMENTOS.CODCLIENTE = ${codClie}
                AND TIPODOCUMENTOS.TIPODOC = 'DVP'
                AND DOCUMENTOS.STATUS <> 'A'

            ORDER BY FECHA ASC, ORDEN ASC, CODDOC ASC, CORRELATIVO ASC`;
    
    execute.QueryToken(res,qry,token);
     
});

router.post("/corregir_saldos_cxp", async(req,res)=>{
   
    const { token, sucursal, fecha} = req.body;
    const fechaUpd = fecha || new Date().toISOString().substring(0, 10);

    let qry = `;WITH AbonosCalc AS (
            SELECT 
                d.EMPNIT,
                d.CODDOC,
                d.CORRELATIVO,
                ISNULL(d.TOTALPRECIO, 0) AS TOTALPRECIO,
                ISNULL(ab.SUMA_ABONOS, 0) AS SUMA_ABONOS
            FROM DOCUMENTOS d
            INNER JOIN TIPODOCUMENTOS tf
                ON d.CODDOC = tf.CODDOC
                AND d.EMPNIT = tf.EMPNIT
            OUTER APPLY (
                SELECT SUM(ISNULL(x.TOTALPRECIO, 0)) AS SUMA_ABONOS
                FROM (
                    SELECT r.TOTALPRECIO
                    FROM DOCUMENTOS r
                    INNER JOIN TIPODOCUMENTOS tr
                        ON r.CODDOC = tr.CODDOC
                        AND r.EMPNIT = tr.EMPNIT
                    WHERE r.EMPNIT = d.EMPNIT
                        AND tr.TIPODOC = 'RCP'
                        AND r.SERIEFAC = d.CODDOC
                        AND r.NOFAC = CAST(d.CORRELATIVO AS VARCHAR(20))
                        AND r.STATUS <> 'A'

                    UNION ALL

                    SELECT dev.TOTALPRECIO
                    FROM DOCUMENTOS dev
                    INNER JOIN TIPODOCUMENTOS td
                        ON dev.CODDOC = td.CODDOC
                        AND dev.EMPNIT = td.EMPNIT
                    WHERE dev.EMPNIT = d.EMPNIT
                        AND td.TIPODOC = 'DVP'
                        AND dev.CODDOC_ORIGEN = d.CODDOC
                        AND dev.CORRELATIVO_ORIGEN = CAST(d.CORRELATIVO AS VARCHAR(20))
                        AND dev.STATUS <> 'A'
                ) x
            ) ab
            WHERE d.EMPNIT = '${sucursal}'
                AND tf.TIPODOC = 'COM'
                AND d.CONCRE = 'CRE'
                AND d.STATUS <> 'A'
        )
        UPDATE d
        SET d.DOC_ABONOS = a.SUMA_ABONOS,
            d.DOC_SALDO = CASE 
                WHEN a.TOTALPRECIO - a.SUMA_ABONOS < 0 THEN 0 
                ELSE a.TOTALPRECIO - a.SUMA_ABONOS 
            END,
            d.LASTUPDATE = '${fechaUpd}'
        FROM DOCUMENTOS d
        INNER JOIN AbonosCalc a
            ON d.EMPNIT = a.EMPNIT
            AND d.CODDOC = a.CODDOC
            AND d.CORRELATIVO = a.CORRELATIVO;`;

    execute.QueryToken(res,qry,token);
     
});

module.exports = router;