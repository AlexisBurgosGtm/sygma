const execute = require('./../connection');
const express = require('express');
const router = express.Router();




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


router.post("/listado_documentos", async(req,res)=>{
   
    const { token, sucursal, anio, mes, tipo} = req.body;

    let qry = `SELECT  DOCUMENTOS.FECHA, DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO, 
    DOCUMENTOS.DOC_NIT AS NIT, DOCUMENTOS.DOC_NOMCLIE AS NOMBRE, 
    DOCUMENTOS.DOC_DIRCLIE AS DIRECCION, 
                DOCUMENTOS.TOTALCOSTO, DOCUMENTOS.TOTALVENTA, DOCUMENTOS.STATUS, DOCUMENTOS.USUARIO, DOCUMENTOS.CONCRE, 
                DOCUMENTOS.CODCAJA, DOCUMENTOS.NOCORTE, DOCUMENTOS.LAT, 
                DOCUMENTOS.LONG, DOCUMENTOS.ENTREGADO, TIPODOCUMENTOS.TIPODOC,
                DOCUMENTOS.ETIQUETA, DOCUMENTOS.EMPNIT_DESTINO, DOCUMENTOS.OBS,
                DOCUMENTOS.CODDOC_ORIGEN, DOCUMENTOS.CORRELATIVO_ORIGEN
        FROM  DOCUMENTOS LEFT OUTER JOIN
                         TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
    WHERE (DOCUMENTOS.EMPNIT = '${sucursal}') AND (DOCUMENTOS.ANIO = ${anio}) AND (DOCUMENTOS.MES = ${mes}) 
    AND (TIPODOCUMENTOS.TIPODOC = '${tipo}')`
    
    execute.QueryToken(res,qry,token);
     
});






module.exports = router;