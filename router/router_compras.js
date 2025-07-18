const execute = require('./../connection');
const express = require('express');
const router = express.Router();



router.post("/update_sell_out_productos", async(req,res)=>{
   

    const { token,sucursal,mi,mf,anio,obs} = req.body;

    let promedio = (Number(mf)-Number(mi)) + 1;
    
    let qry_sellout ='';  



    qry_sellout = `
       UPDATE PRODUCTOS SET SELLOUT = T.TOTALUNIDADES FROM PRODUCTOS 
       INNER JOIN (
            SELECT DOCPRODUCTOS.CODPROD, 
            SUM(ISNULL(DOCPRODUCTOS.TOTALUNIDADES,0) / ${promedio}) AS TOTALUNIDADES, 
            SUM(DOCPRODUCTOS.TOTALPRECIO) AS TOTALPRECIO
            FROM     DOCUMENTOS LEFT OUTER JOIN
                DOCPRODUCTOS ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO AND 
                DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT LEFT OUTER JOIN
                TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
            WHERE  
                (DOCUMENTOS.STATUS <> 'A') AND 
                (DOCUMENTOS.ANIO = ${anio}) AND 
                (DOCUMENTOS.MES BETWEEN ${mi} AND ${mf}) AND 
                (TIPODOCUMENTOS.TIPODOC IN('FAC','FCP','FPC','FEC','FEF','FES')) AND
                (DOCPRODUCTOS.CODPROD IS NOT NULL)
            GROUP BY DOCPRODUCTOS.CODPROD) T ON PRODUCTOS.CODPROD= T.CODPROD;
        `



    let qry_update_config = `UPDATE CONFIG SET OBS='${obs}' WHERE ID=3;`


    let qry = qry_sellout + qry_update_config;

    
    execute.QueryToken(res,qry,token);
     
});





router.post("/select_inventario_general", async(req,res)=>{
   
    const {token,sucursal,st} = req.body;

    
    let qry = '';

    if(sucursal=='%'){
        qry = `
        SELECT  view_invsaldo.CODPROD, 
                view_invsaldo.CODPROD2, 
                view_invsaldo.DESPROD3, 
                view_invsaldo.DESPROD, 
                SUM(view_invsaldo.TOTALUNIDADES) AS TOTALUNIDADES, 
                SUM(view_invsaldo.TOTALCOSTO) AS TOTALCOSTO, 
                SUM(view_invsaldo.MINIMO) AS MINIMO, 
                SUM(view_invsaldo.MAXIMO) AS MAXIMO, 
                SUM(view_invsaldo.EXISTENCIA) AS EXISTENCIA, 
                view_invsaldo.HABILITADO, 
                view_invsaldo.COSTO_ULTIMO, 
                view_invsaldo.COSTO_ANTERIOR, 
                view_invsaldo.COSTO_PROMEDIO, 
                PRODUCTOS.CODMARCA, 
                MARCAS.DESMARCA, 
                PRODUCTOS.UXC,
                ISNULL(PRODUCTOS.SELLOUT,0) AS SELLOUT
        FROM     PRODUCTOS RIGHT OUTER JOIN
                  view_invsaldo ON PRODUCTOS.CODPROD = view_invsaldo.CODPROD LEFT OUTER JOIN
                  MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA
        GROUP BY view_invsaldo.CODPROD, view_invsaldo.CODPROD2, view_invsaldo.DESPROD3, view_invsaldo.DESPROD, view_invsaldo.HABILITADO, view_invsaldo.COSTO_ULTIMO, view_invsaldo.COSTO_ANTERIOR, 
                  view_invsaldo.COSTO_PROMEDIO, PRODUCTOS.CODMARCA, 
                  MARCAS.DESMARCA, PRODUCTOS.UXC,PRODUCTOS.SELLOUT
        HAVING (view_invsaldo.HABILITADO = '${st}')
        ORDER BY view_invsaldo.CODPROD
        `
    }else{
        qry = `
        SELECT view_invsaldo.CODPROD, view_invsaldo.CODPROD2, view_invsaldo.DESPROD3, 
                view_invsaldo.DESPROD, view_invsaldo.TOTALUNIDADES, view_invsaldo.TOTALCOSTO, view_invsaldo.MINIMO, view_invsaldo.MAXIMO, 
                view_invsaldo.EXISTENCIA, view_invsaldo.HABILITADO, view_invsaldo.COSTO_ULTIMO, 
                view_invsaldo.COSTO_ANTERIOR, view_invsaldo.COSTO_PROMEDIO, 
                PRODUCTOS.CODMARCA, MARCAS.DESMARCA,
                PRODUCTOS.UXC,
                ISNULL(PRODUCTOS.SELLOUT,0) AS SELLOUT
        FROM  PRODUCTOS RIGHT OUTER JOIN
                view_invsaldo ON PRODUCTOS.CODPROD = view_invsaldo.CODPROD LEFT OUTER JOIN
                MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA
        WHERE (view_invsaldo.EMPNIT = '${sucursal}') AND (view_invsaldo.HABILITADO='${st}')
        ORDER BY view_invsaldo.CODPROD;
        `

    }
   
    
    execute.QueryToken(res,qry,token);
     
});


router.post("/insertcompra", async(req,res)=>{
   

    const { token,jsondocproductos,sucursal,
            coddoc,correlativo,serie_fac,numero_fac,anio,mes,fecha,fechaentrega,formaentrega,
            codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
            nitclie, dirclie, obs, direntrega, usuario,
            codven, lat, long, hora, tipo_pago, tipo_doc,
            entrega_contacto, entrega_telefono, entrega_direccion,
            entrega_referencia, entrega_lat, entrega_long,
            codcaja, iva, etiqueta, coddoc_origen, correlativo_origen} = req.body;

    let qryDocumentos = str_qry_documentos(jsondocproductos,sucursal,
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
    let qryStatusDocCot = `UPDATE DOCUMENTOS SET STATUS='D' WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc_origen}' AND CORRELATIVO=${correlativo_origen};`

    let qry = qryDocumentos + qryDocproductos + qryStatusDocCot + qryTipodocumentos;

 console.log(qry)
 
    
    execute.QueryToken(res,qry,token);
     
});

router.post("/insertcompra_req", async(req,res)=>{
   

    const { token,jsondocproductos,sucursal,
            coddoc,correlativo,serie_fac,numero_fac,anio,mes,fecha,fechaentrega,formaentrega,
            codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
            nitclie, dirclie, obs, direntrega, usuario,
            codven, lat, long, hora, tipo_pago, tipo_doc,
            entrega_contacto, entrega_telefono, entrega_direccion,
            entrega_referencia, entrega_lat, entrega_long,
            codcaja, iva, etiqueta, coddoc_origen, correlativo_origen} = req.body;

    let qryDocumentos = str_qry_documentos(jsondocproductos,sucursal,
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

router.post("/insertcompra_cot", async(req,res)=>{
   

    const { token,jsondocproductos,sucursal,
            coddoc,correlativo,serie_fac,numero_fac,anio,mes,fecha,fechaentrega,formaentrega,
            codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
            nitclie, dirclie, obs, direntrega, usuario,
            codven, lat, long, hora, tipo_pago, tipo_doc,
            entrega_contacto, entrega_telefono, entrega_direccion,
            entrega_referencia, entrega_lat, entrega_long,
            codcaja, iva, etiqueta, coddoc_origen, correlativo_origen} = req.body;

    let qryDocumentos = str_qry_documentos(jsondocproductos,sucursal,
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
    let qryStatusDocCot = `UPDATE DOCUMENTOS SET STATUS='D' WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc_origen}' AND CORRELATIVO=${correlativo_origen};`

    let qry = qryDocumentos + qryDocproductos + qryStatusDocCot + qryTipodocumentos;

    
    execute.QueryToken(res,qry,token);
     
});






router.post("/insertventa", async(req,res)=>{
   

    const { token,jsondocproductos,sucursal,
            coddoc,correlativo,serie_fac,numero_fac,anio,mes,fecha,fechaentrega,formaentrega,
            codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
            nitclie, dirclie, obs, direntrega, usuario,
            codven, lat, long, hora, tipo_pago, tipo_doc,
            entrega_contacto, entrega_telefono, entrega_direccion,
            entrega_referencia, entrega_lat, entrega_long,
            codcaja, iva } = req.body;

    let qryDocumentos = str_qry_documentos(jsondocproductos,sucursal,
        coddoc,correlativo,anio,mes,fecha,fechaentrega,formaentrega,
        codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
        nitclie, dirclie, obs, direntrega, usuario,
        codven, lat, long, hora, tipo_pago, tipo_doc,
        entrega_contacto, entrega_telefono, entrega_direccion,
        entrega_referencia, entrega_lat, entrega_long,
        codcaja, iva,serie_fac,numero_fac);

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
            '' AS CODEMBARQUE,
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
            ${r.BONO} AS BONO;
        `

    })


    

    return qry;

};






router.post("/surtido_sucursales", async(req,res)=>{
   

    const { token,sucursal,tipobi} = req.body;

    let qry ='';

    if(sucursal=='TODAS'){
        qry = `
       SELECT view_invsaldo.CODPROD, PRODUCTOS.DESPROD, PRODUCTOS.TIPOPROD, 
			SUM(view_invsaldo.MINIMO) AS MINIMO, 
			SUM(view_invsaldo.MAXIMO) AS MAXIMO, 
			SUM(view_invsaldo.EXISTENCIA) AS EXISTENCIA, 
			MARCAS.DESMARCA,
            (SUM(view_invsaldo.MAXIMO) - SUM(view_invsaldo.EXISTENCIA)) AS RELLENO,
            view_invsaldo.COSTO_ULTIMO,view_invsaldo.COSTO_PROMEDIO
        FROM     view_invsaldo LEFT OUTER JOIN
                        PRODUCTOS ON view_invsaldo.CODPROD = PRODUCTOS.CODPROD LEFT OUTER JOIN
                        MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA
        WHERE  (view_invsaldo.HABILITADO = 'SI')
        GROUP BY view_invsaldo.CODPROD, PRODUCTOS.DESPROD, PRODUCTOS.TIPOPROD, MARCAS.DESMARCA,view_invsaldo.COSTO_ULTIMO,view_invsaldo.COSTO_PROMEDIO
        HAVING (PRODUCTOS.TIPOPROD = 'B') AND (SUM(view_invsaldo.EXISTENCIA) <= SUM(view_invsaldo.MINIMO))

        `
    }else{
        qry = `
        SELECT view_invsaldo.EMPNIT, view_invsaldo.CODPROD, PRODUCTOS.DESPROD, PRODUCTOS.TIPOPROD, view_invsaldo.MINIMO, 
            view_invsaldo.MAXIMO, view_invsaldo.EXISTENCIA, 
            MARCAS.DESMARCA,
            (view_invsaldo.MAXIMO - view_invsaldo.EXISTENCIA) AS RELLENO, 
            '2000-01-01' AS LASTUPDATE,
            view_invsaldo.COSTO_ULTIMO,view_invsaldo.COSTO_PROMEDIO
        FROM     view_invsaldo LEFT OUTER JOIN
                      PRODUCTOS ON view_invsaldo.CODPROD = PRODUCTOS.CODPROD LEFT OUTER JOIN
                      MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA
        WHERE  (view_invsaldo.EMPNIT = '${sucursal}') AND (PRODUCTOS.TIPOPROD = 'B') 
            AND (view_invsaldo.HABILITADO='SI') AND (view_invsaldo.EXISTENCIA<=view_invsaldo.MINIMO)
        `

    }

   



    execute.QueryToken(res,qry,token);
     
});

router.post("/BACKUP_ORIGINAL_surtido_sucursales", async(req,res)=>{
   

    const { token,sucursal,tipobi} = req.body;

    let qry ='';

    if(sucursal=='TODAS'){
        qry = `
       SELECT INVSALDO.CODPROD, PRODUCTOS.DESPROD, PRODUCTOS.TIPOPROD, 
			SUM(INVSALDO.MINIMO) AS MINIMO, 
			SUM(INVSALDO.MAXIMO) AS MAXIMO, 
			SUM(INVSALDO.EXISTENCIA) AS EXISTENCIA, 
			MARCAS.DESMARCA,
            (SUM(INVSALDO.MAXIMO) - SUM(INVSALDO.EXISTENCIA)) AS RELLENO
        FROM     INVSALDO LEFT OUTER JOIN
                        PRODUCTOS ON INVSALDO.CODPROD = PRODUCTOS.CODPROD LEFT OUTER JOIN
                        MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA
        WHERE  (INVSALDO.HABILITADO = 'SI')
        GROUP BY INVSALDO.CODPROD, PRODUCTOS.DESPROD, PRODUCTOS.TIPOPROD, MARCAS.DESMARCA
        HAVING (PRODUCTOS.TIPOPROD = 'B') AND (SUM(INVSALDO.EXISTENCIA) <= SUM(INVSALDO.MINIMO))

        `
    }else{
        qry = `
        SELECT INVSALDO.EMPNIT, INVSALDO.CODPROD, PRODUCTOS.DESPROD, PRODUCTOS.TIPOPROD, INVSALDO.MINIMO, 
            INVSALDO.MAXIMO, INVSALDO.EXISTENCIA, 
            MARCAS.DESMARCA,
            (INVSALDO.MAXIMO - INVSALDO.EXISTENCIA) AS RELLENO, '2000-01-01' AS LASTUPDATE
        FROM     INVSALDO LEFT OUTER JOIN
                      PRODUCTOS ON INVSALDO.CODPROD = PRODUCTOS.CODPROD LEFT OUTER JOIN
                      MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA
        WHERE  (INVSALDO.EMPNIT = '${sucursal}') AND (PRODUCTOS.TIPOPROD = 'B') 
            AND (INVSALDO.HABILITADO='SI') AND (INVSALDO.EXISTENCIA<=INVSALDO.MINIMO)
        `

    }

   



    execute.QueryToken(res,qry,token);
     
});


router.post("/documentos_pendientes", async(req,res)=>{
   

    const { token,sucursal,tipo} = req.body;

    let qry ='';
    
    switch (sucursal) {
        case 'TODAS':
            qry = `
            SELECT DOCUMENTOS.EMPNIT,DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO, DOCUMENTOS.FECHA, DOCUMENTOS.HORA, DOCUMENTOS.DOC_NIT, DOCUMENTOS.DOC_NOMCLIE, DOCUMENTOS.DOC_DIRCLIE, DOCUMENTOS.TOTALVENTA, 
                       DOCUMENTOS.TOTALDESCUENTO, DOCUMENTOS.TOTALPRECIO, DOCUMENTOS.STATUS, DOCUMENTOS.ETIQUETA
                 FROM     DOCUMENTOS LEFT OUTER JOIN
                       TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
                 WHERE  (DOCUMENTOS.STATUS = 'O') AND (TIPODOCUMENTOS.TIPODOC = '${tipo}')
                 ORDER BY DOCUMENTOS.FECHA, DOCUMENTOS.ID
             `
            break;
    
        default:
            qry = `
            SELECT DOCUMENTOS.EMPNIT,DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO, DOCUMENTOS.FECHA, DOCUMENTOS.HORA, DOCUMENTOS.DOC_NIT, DOCUMENTOS.DOC_NOMCLIE, DOCUMENTOS.DOC_DIRCLIE, DOCUMENTOS.TOTALVENTA, 
                       DOCUMENTOS.TOTALDESCUENTO, DOCUMENTOS.TOTALPRECIO, DOCUMENTOS.STATUS, DOCUMENTOS.ETIQUETA
                 FROM     DOCUMENTOS LEFT OUTER JOIN
                       TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
                 WHERE  (DOCUMENTOS.EMPNIT = '${sucursal}') AND (DOCUMENTOS.STATUS = 'O') AND (TIPODOCUMENTOS.TIPODOC = '${tipo}')
                 ORDER BY DOCUMENTOS.FECHA, DOCUMENTOS.ID
             `
            break;
    }

   

  
  

   



    execute.QueryToken(res,qry,token);
     
});

router.post("/documentos_pendientes_producto", async(req,res)=>{
   

    const { token,codprod} = req.body;

    let qry ='';  
    qry = `
    SELECT DOCUMENTOS.EMPNIT, EMPRESAS.NOMBRE AS NOMEMPRESA, 
            DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO, 
            DOCUMENTOS.FECHA, DOCUMENTOS.HORA, DOCUMENTOS.STATUS, 
            DOCPRODUCTOS.CODPROD, DOCPRODUCTOS.DESPROD, 
            DOCPRODUCTOS.CODMEDIDA, DOCPRODUCTOS.CANTIDAD, 
            DOCPRODUCTOS.COSTO, DOCPRODUCTOS.PRECIO, 
            DOCPRODUCTOS.TOTALCOSTO, DOCPRODUCTOS.TOTALPRECIO
    FROM  DOCUMENTOS LEFT OUTER JOIN
            EMPRESAS ON DOCUMENTOS.EMPNIT = EMPRESAS.EMPNIT LEFT OUTER JOIN
            TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT LEFT OUTER JOIN
            DOCPRODUCTOS ON DOCUMENTOS.CORRELATIVO = DOCPRODUCTOS.CORRELATIVO AND DOCUMENTOS.CODDOC = DOCPRODUCTOS.CODDOC AND DOCUMENTOS.EMPNIT = DOCPRODUCTOS.EMPNIT
    WHERE  (TIPODOCUMENTOS.TIPODOC  IN('REQ','ORC')) AND (DOCUMENTOS.STATUS = 'O') AND (DOCPRODUCTOS.CODPROD = '${codprod}')
    `


    execute.QueryToken(res,qry,token);
     
});



router.post("/total_rellenos", async(req,res)=>{
   

    const { token} = req.body;

    let qry ='';
    qry = `
           SELECT COUNT(CODPROD) AS CONTEO 
           FROM view_inventarios_relleno WHERE HABILITADO='SI' 
             `



    execute.QueryToken(res,qry,token);
     
});



router.post("/verify_factura_compra_fel", async(req,res)=>{
   

    const { token, sucursal, seriefac, numerofac} = req.body;

    let qry ='';
    qry = `SELECT CODDOC,CORRELATIVO, FECHA 
            FROM DOCUMENTOS 
            WHERE EMPNIT ='${sucursal}' AND SERIEFAC='${seriefac}' AND NOFAC='${numerofac}'
             `



    execute.QueryToken(res,qry,token);
     
});



module.exports = router;