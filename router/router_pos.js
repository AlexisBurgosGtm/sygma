const execute = require('./../connection');
const express = require('express');
const router = express.Router();


router.post("/insertventa", async(req,res)=>{
   

    const { token,jsondocproductos,sucursal,
            coddoc,correlativo,anio,mes,fecha,fechaentrega,formaentrega,
            codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
            nitclie, dirclie, obs, direntrega, usuario,
            codven, lat, long, hora, tipo_pago, tipo_doc,
            entrega_contacto, entrega_telefono, entrega_direccion,
            entrega_referencia, entrega_lat, entrega_long,
            codcaja, iva, etiqueta } = req.body;

    let qryDocumentos = str_qry_documentos(jsondocproductos,sucursal,
        coddoc,correlativo,anio,mes,fecha,fechaentrega,formaentrega,
        codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
        nitclie, dirclie, obs, direntrega, usuario,
        codven, lat, long, hora, tipo_pago, tipo_doc,
        entrega_contacto, entrega_telefono, entrega_direccion,
        entrega_referencia, entrega_lat, entrega_long,
        codcaja, iva,etiqueta);

    let qryDocproductos = str_qry_docproductos(sucursal,coddoc,correlativo,anio,mes,iva,codbodega,fecha,jsondocproductos);
   
    let nuevoCorrelativo = Number(correlativo) + 1;
    let qryTipodocumentos = `UPDATE TIPODOCUMENTOS SET CORRELATIVO=${nuevoCorrelativo} WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}';`;
    
    let qry = qryDocumentos + qryDocproductos + qryTipodocumentos;

    
    execute.QueryToken(res,qry,token);
     
});


router.post("/insertcompra", async(req,res)=>{
   

    const { token,jsondocproductos,sucursal,
            coddoc,correlativo,anio,mes,fecha,fechaentrega,formaentrega,
            codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
            nitclie, dirclie, obs, direntrega, usuario,
            codven, lat, long, hora, tipo_pago, tipo_doc,
            entrega_contacto, entrega_telefono, entrega_direccion,
            entrega_referencia, entrega_lat, entrega_long,
            codcaja, iva, etiqueta } = req.body;

    let qryDocumentos = str_qry_documentos(jsondocproductos,sucursal,
        coddoc,correlativo,anio,mes,fecha,fechaentrega,formaentrega,
        codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
        nitclie, dirclie, obs, direntrega, usuario,
        codven, lat, long, hora, tipo_pago, tipo_doc,
        entrega_contacto, entrega_telefono, entrega_direccion,
        entrega_referencia, entrega_lat, entrega_long,
        codcaja, iva,etiqueta);

    let qryDocproductos = str_qry_docproductos(sucursal,coddoc,correlativo,anio,mes,iva,codbodega,fecha,jsondocproductos);
   
    let nuevoCorrelativo = Number(correlativo) + 1;
    let qryTipodocumentos = `UPDATE TIPODOCUMENTOS SET CORRELATIVO=${nuevoCorrelativo} WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}';`;
    
    let qry = qryDocumentos + qryDocproductos + qryTipodocumentos;

    
    execute.QueryToken(res,qry,token);
     
});


function str_qry_documentos(jsondocproductos,sucursal,
    coddoc,correlativo,anio,mes,fecha,fechaentrega,formaentrega,
    codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
    nitclie, dirclie, obs, direntrega, usuario,
    codven, lat, long, hora, tipo_pago, tipo_doc,
    entrega_contacto, entrega_telefono, entrega_direccion,
    entrega_referencia, entrega_lat, entrega_long,
    codcaja, iva, etiqueta){

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
            JSONDOCPRODUCTOS)
        SELECT
            '${sucursal}' AS EMPNIT,
            ${anio} AS ANIO, 
            ${mes} AS MES,
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
            '${coddoc}' AS SERIEFAC,
            '${correlativo}' AS NOFAC, 
            ${codven} AS CODEMP,
            '${obs}' AS OBS,
            0 AS DOC_SALDO, 
            0 AS DOC_ABONOS, 
            '${direntrega}' AS DIRENTREGA,
            0 AS TOTALEXENTO, 
            ${lat} AS LAT, 
            ${long} AS LONG,
            '${fecha}' AS VENCIMIENTO,
            'NO' AS ENTREGADO, 
            ${iva} POR_IVA,
            '${tipo_doc}' AS TIPO_VENTA,
            '${etiqueta}' AS ETIQUETA,            
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


    

    return qry;

};


router.post("/listado_colores", async(req,res)=>{
   
    const { token, sucursal} = req.body;

    let qry = `SELECT NF, NOMBRE, COLOR, DESCRIPCION FROM COLORES`
    
 

    execute.QueryToken(res,qry,token);
     
});


router.post("/productos_filtro", async(req,res)=>{
   
    const { token, sucursal, filtro, tipoprecio } = req.body;

    let qryx = `SELECT TOP 70 PRODUCTOS.CODPROD, PRODUCTOS.CODPROD2, PRODUCTOS.DESPROD, 
                    PRODUCTOS.DESPROD2, PRODUCTOS.DESPROD3, PRODUCTOS.CODMARCA, 
                    MARCAS.DESMARCA, PRODUCTOS.TIPOPROD, 
                    PRECIOS.CODMEDIDA, PRECIOS.EQUIVALE, PRECIOS.COSTO, 
                    PRECIOS.${tipoprecio} AS PRECIO, INVSALDO.EMPNIT, INVSALDO.EXISTENCIA, 
                    COLORES.COLOR, PRODUCTOS.EXENTO, 
                    ISNULL(PRECIOS.BONO_${tipoprecio}, 0) AS BONO
                    FROM PRODUCTOS LEFT OUTER JOIN
                         COLORES ON PRODUCTOS.NF = COLORES.NF LEFT OUTER JOIN
                         INVSALDO ON PRODUCTOS.CODPROD = INVSALDO.CODPROD LEFT OUTER JOIN
                         MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA LEFT OUTER JOIN
                         PRECIOS ON PRODUCTOS.CODPROD = PRECIOS.CODPROD
                    WHERE (PRODUCTOS.HABILITADO = 'SI') AND (PRODUCTOS.DESPROD LIKE '%${filtro}%') 
                        AND (PRECIOS.CODMEDIDA IS NOT NULL) AND (INVSALDO.EMPNIT = '${sucursal}') 
                        OR
                        (PRODUCTOS.HABILITADO = 'SI') AND (PRECIOS.CODMEDIDA IS NOT NULL) 
                        AND (INVSALDO.EMPNIT = '${sucursal}') AND (PRODUCTOS.CODPROD = '${filtro}')
                        OR
                        (PRODUCTOS.HABILITADO = 'SI') AND (PRECIOS.CODMEDIDA IS NOT NULL) 
                        AND (INVSALDO.EMPNIT = '${sucursal}') AND (PRODUCTOS.CODPROD2 = '${filtro}')
                    `


        let qry = `SELECT TOP 70 PRODUCTOS.CODPROD, PRODUCTOS.CODPROD2, PRODUCTOS.DESPROD, 
                    PRODUCTOS.DESPROD2, PRODUCTOS.DESPROD3, PRODUCTOS.CODMARCA, 
                    MARCAS.DESMARCA, PRODUCTOS.TIPOPROD, 
                    PRECIOS.CODMEDIDA, PRECIOS.EQUIVALE, PRECIOS.COSTO, 
                    PRECIOS.${tipoprecio} AS PRECIO, view_invsaldo.EMPNIT, 
                    ISNULL(view_invsaldo.TOTALUNIDADES,0) AS EXISTENCIA, 
                    COLORES.COLOR, PRODUCTOS.EXENTO, 
                    ISNULL(PRECIOS.BONO_${tipoprecio}, 0) AS BONO
                    FROM PRODUCTOS LEFT OUTER JOIN
                         COLORES ON PRODUCTOS.NF = COLORES.NF LEFT OUTER JOIN
                         view_invsaldo ON PRODUCTOS.CODPROD = view_invsaldo.CODPROD LEFT OUTER JOIN
                         MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA LEFT OUTER JOIN
                         PRECIOS ON PRODUCTOS.CODPROD = PRECIOS.CODPROD
                    WHERE (PRODUCTOS.HABILITADO = 'SI') AND (PRODUCTOS.DESPROD LIKE '%${filtro}%') 
                        AND (PRECIOS.CODMEDIDA IS NOT NULL) AND (view_invsaldo.EMPNIT = '${sucursal}') 
                        OR
                        (PRODUCTOS.HABILITADO = 'SI') AND (PRECIOS.CODMEDIDA IS NOT NULL) 
                        AND (view_invsaldo.EMPNIT = '${sucursal}') AND (PRODUCTOS.CODPROD = '${filtro}')
                        OR
                        (PRODUCTOS.HABILITADO = 'SI') AND (PRECIOS.CODMEDIDA IS NOT NULL) 
                        AND (view_invsaldo.EMPNIT = '${sucursal}') AND (PRODUCTOS.CODPROD2 = '${filtro}')
                    `
    
                

    execute.QueryToken(res,qry,token);
     
});


router.post("/productos_precio", async(req,res)=>{
   
    const { token, sucursal, codprod, codmedida } = req.body;

    let qry = `SELECT CODPROD, CODMEDIDA, EQUIVALE, 
                COSTO, PRECIO, MAYOREOA,MAYOREOB,MAYOREOC 
                FROM PRECIOS 
                WHERE EMPNIT='${sucursal}' 
                AND CODPROD='${codprod}' 
                AND CODMEDIDA='${codmedida}';`
    
   
    execute.QueryToken(res,qry,token);
     
});

router.post("/lista_documentos", async(req,res)=>{
   
    const { token, sucursal, tipo, fecha } = req.body;

    let qry = `SELECT        DOCUMENTOS.EMPNIT, TIPODOCUMENTOS.TIPODOC, DOCUMENTOS.FECHA, DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO, DOCUMENTOS.HORA, DOCUMENTOS.CODCLIENTE, DOCUMENTOS.DOC_NIT, 
                         DOCUMENTOS.DOC_NOMCLIE AS NOMCLIE, DOCUMENTOS.DOC_DIRCLIE AS DIRCLIE, 
                         DOCUMENTOS.STATUS AS ST, ISNULL(DOCUMENTOS.FEL_UUDI,'') AS FEL_UUDI, DOCUMENTOS.ENTREGADO, DOCUMENTOS.TOTALVENTA, 
                         DOCUMENTOS.TOTALDESCUENTO, DOCUMENTOS.TOTALPRECIO
FROM            DOCUMENTOS LEFT OUTER JOIN
                         TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
WHERE        (DOCUMENTOS.EMPNIT = '${sucursal}') AND (DOCUMENTOS.FECHA = '${fecha}') AND (TIPODOCUMENTOS.TIPODOC = '${tipo}')`
    
   

    execute.QueryToken(res,qry,token);
     
});





module.exports = router;