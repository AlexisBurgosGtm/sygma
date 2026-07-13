const execute = require('./../connection');
const express = require('express');
const router = express.Router();

function esc(val) {
    if (val === null || val === undefined) return '';
    return String(val).replace(/'/g, "''");
}

function num(val, fallback = 0) {
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
}

function wrapTransaction(qryBody) {
    return `
        BEGIN TRY
            BEGIN TRANSACTION;
            ${qryBody}
            COMMIT TRANSACTION;
        END TRY
        BEGIN CATCH
            IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
            THROW;
        END CATCH;
    `;
}

router.post("/insertventa_factura", async(req,res)=>{
   

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
    let qryTipodocumentos = `UPDATE TIPODOCUMENTOS SET CORRELATIVO=${nuevoCorrelativo} WHERE EMPNIT='${esc(sucursal)}' AND CODDOC='${esc(coddoc)}';`;
    let qry_last_sale_cliente = `UPDATE CLIENTES SET LASTSALE='${esc(fecha)}' WHERE CODCLIENTE=${num(codcliente)};`
    let qry_visita = `INSERT INTO CLIENTES_VISITAS (EMPNIT,CODCLIENTE,FECHA,HORA,CODEMP,MOTIVO,LATITUD,LONGITUD)
                    SELECT '${esc(sucursal)}' AS EMPNIT,${num(codcliente)} AS CODCLIENTE,
                    '${esc(fecha)}' AS FECHA,'${esc(hora)}' AS HORA,${num(codven)} AS CODEMP,
                    'VENTA' AS MOTIVO,${num(entrega_lat)} AS LATITUD,${num(entrega_long)} AS LONGITUD; `
    
    let qry = wrapTransaction(qryDocumentos + qryDocproductos + qryTipodocumentos + qry_last_sale_cliente + qry_visita);

    
    execute.QueryToken(res,qry,token);
     
});



router.post("/insertventa_pedido", async(req,res)=>{
   

    const { token,jsondocproductos,sucursal,
            coddoc,correlativo,anio,mes,fecha,fechaentrega,formaentrega,
            codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
            nitclie, dirclie, obs, direntrega, usuario,
            codven, lat, long, hora, tipo_pago, tipo_doc,
            entrega_contacto, entrega_telefono, entrega_direccion,
            entrega_referencia, entrega_lat, entrega_long,
            codcaja, iva, etiqueta } = req.body;

    let qryDocumentos = str_qry_documentos_temporal(jsondocproductos,sucursal,
        coddoc,correlativo,anio,mes,fecha,fechaentrega,formaentrega,
        codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
        nitclie, dirclie, obs, direntrega, usuario,
        codven, lat, long, hora, tipo_pago, tipo_doc,
        entrega_contacto, entrega_telefono, entrega_direccion,
        entrega_referencia, entrega_lat, entrega_long,
        codcaja, iva,etiqueta);

    let qryDocproductos = ''; //str_qry_docproductos_temporal(sucursal,coddoc,correlativo,anio,mes,iva,codbodega,fecha,jsondocproductos);
   
    let nuevoCorrelativo = Number(correlativo) + 1;
    let qryTipodocumentos = `UPDATE TIPODOCUMENTOS SET CORRELATIVO=${nuevoCorrelativo} WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}';`;
    
    let qry = qryDocumentos + qryDocproductos + qryTipodocumentos;

    
    execute.QueryToken(res,qry,token);
     
});



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
            CODEMBARQUE,
            JSONDOCPRODUCTOS)
        SELECT
            '${esc(sucursal)}' AS EMPNIT,
            ${num(anio)} AS ANIO, 
            ${num(mes)} AS MES,
            '${esc(fecha)}' AS FECHA, 
            '${esc(hora)}' AS HORA,
            '${esc(coddoc)}' AS CODDOC, 
            ${num(correlativo)} AS CORRELATIVO,
            ${num(codcliente)} AS CODCLIENTE, 
            '${esc(nitclie)}' AS DOC_NIT,
            '${esc(nomclie)}' AS DOC_NOMCLIE, 
            '${esc(dirclie)}' AS DOC_DIRCLIE,
            ${num(totalcosto)} AS TOTALCOSTO, 
            ${num(totalprecio)} AS TOTALVENTA,
            ${num(totaldescuento)} AS TOTALDESCUENTO, 
            0 AS RECARGOTARJETA,
            ${(num(totalprecio) - num(totaldescuento))} AS TOTALPRECIO, 
            0 AS PAGO, 
            0 AS VUELTO,
            'O' AS STATUS,
            0 AS TOTAL_EFECTIVO, 
            0 AS TOTAL_TARJETA, 
            0 AS TOTAL_DEPOSITOS,
            0 AS TOTAL_CHEQUES,
            '${esc(usuario)}' AS USUARIO, 
            '${esc(tipo_pago)}' AS CONCRE,
            ${num(codcaja)} AS CODCAJA, 
            0 AS NOCORTE, 
            '${esc(coddoc)}' AS SERIEFAC,
            '${esc(correlativo)}' AS NOFAC, 
            ${num(codven)} AS CODEMP,
            '${esc(obs)}' AS OBS,
            0 AS DOC_SALDO, 
            0 AS DOC_ABONOS, 
            '${esc(direntrega)}' AS DIRENTREGA,
            0 AS TOTALEXENTO, 
            ${num(lat)} AS LAT, 
            ${num(long)} AS LONG,
            '${esc(fecha)}' AS VENCIMIENTO,
            'NO' AS ENTREGADO, 
            ${num(iva)} AS POR_IVA,
            '${esc(tipo_doc)}' AS TIPO_VENTA,
            '${esc(etiqueta)}' AS ETIQUETA,
            '' AS CODEMBARQUE,            
            '${esc(jsondocproductos)}' AS JSONDOCPRODUCTOS;
        `

    return qry;

};

function str_qry_docproductos(sucursal,coddoc,correlativo,anio,mes,iva,codbodega,fecha,jsondocproductos){

    const jsonRaw = typeof jsondocproductos === 'string'
        ? jsondocproductos
        : JSON.stringify(jsondocproductos || []);
    let items = [];
    try {
        const parsed = JSON.parse(jsonRaw);
        items = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        items = [];
    }
    if (!items.length) return '';

    const jsonEsc = esc(jsonRaw);
    const emp = esc(sucursal);
    const doc = esc(coddoc);
    const fec = esc(fecha);
    const bod = esc(String(codbodega == null ? '' : codbodega));
    const corr = num(correlativo);
    const an = num(anio);
    const me = num(mes);
    const iv = num(iva);

    return `
        DECLARE @jsonDoc NVARCHAR(MAX) = N'${jsonEsc}';
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
            '${emp}' AS EMPNIT,
            ${an} AS ANIO,
            ${me} AS MES,
            '${doc}' AS CODDOC,
            ${corr} AS CORRELATIVO,
            LEFT(ISNULL(j.CODPROD, ''), 50) AS CODPROD,
            LEFT(ISNULL(j.DESPROD, ''), 500) AS DESPROD,
            LEFT(ISNULL(j.CODMEDIDA, ''), 20) AS CODMEDIDA,
            ISNULL(j.CANTIDAD, 0) AS CANTIDAD,
            0 AS CANTIDADBONIF,
            ISNULL(j.EQUIVALE, 0) AS EQUIVALE,
            ISNULL(j.TOTALUNIDADES, 0) AS TOTALUNIDADES,
            0 AS TOTALBONIF,
            ISNULL(j.COSTO, 0) AS COSTO,
            ISNULL(j.PRECIO, 0) AS PRECIO,
            ISNULL(j.TOTALCOSTO, 0) AS TOTALCOSTO,
            ISNULL(j.DESCUENTO, 0) AS DESCUENTO,
            ISNULL(j.TOTALPRECIO, 0) AS TOTALPRECIO,
            0 AS ENTREGADOS_TOTALUNIDADES,
            ISNULL(j.COSTO, 0) AS COSTOANTERIOR,
            ISNULL(j.COSTO, 0) AS COSTOPROMEDIO,
            '${bod}' AS CODBODEGA,
            '' AS NOSERIE,
            ISNULL(j.EXENTO, 0) AS EXENTO,
            '' AS OBS,
            LEFT(ISNULL(j.TIPOPROD, ''), 20) AS TIPOPROD,
            LEFT(ISNULL(j.TIPOPRECIO, ''), 20) AS TIPOPRECIO,
            '${fec}' AS LASTUPDATE,
            0 AS TOTALUNIDADES_DEVUELTAS,
            ${iv} AS POR_IVA,
            ISNULL(j.EXISTENCIA, 0) AS EXISTENCIA,
            ISNULL(j.BONO, 0) AS BONO,
            ISNULL(j.BONO, 0) * ISNULL(j.CANTIDAD, 0) AS TOTALBONO
        FROM OPENJSON(@jsonDoc)
        WITH (
            CODPROD NVARCHAR(100) '$.CODPROD',
            DESPROD NVARCHAR(500) '$.DESPROD',
            CODMEDIDA NVARCHAR(50) '$.CODMEDIDA',
            CANTIDAD FLOAT '$.CANTIDAD',
            EQUIVALE FLOAT '$.EQUIVALE',
            TOTALUNIDADES FLOAT '$.TOTALUNIDADES',
            COSTO FLOAT '$.COSTO',
            PRECIO FLOAT '$.PRECIO',
            TOTALCOSTO FLOAT '$.TOTALCOSTO',
            DESCUENTO FLOAT '$.DESCUENTO',
            TOTALPRECIO FLOAT '$.TOTALPRECIO',
            EXENTO FLOAT '$.EXENTO',
            TIPOPROD NVARCHAR(50) '$.TIPOPROD',
            TIPOPRECIO NVARCHAR(50) '$.TIPOPRECIO',
            EXISTENCIA FLOAT '$.EXISTENCIA',
            BONO FLOAT '$.BONO'
        ) j;
    `;

};


function str_qry_documentos_temporal(jsondocproductos,sucursal,
    coddoc,correlativo,anio,mes,fecha,fechaentrega,formaentrega,
    codbodega,codcliente,nomclie,totalcosto,totalprecio,totaldescuento,
    nitclie, dirclie, obs, direntrega, usuario,
    codven, lat, long, hora, tipo_pago, tipo_doc,
    entrega_contacto, entrega_telefono, entrega_direccion,
    entrega_referencia, entrega_lat, entrega_long,
    codcaja, iva, etiqueta){

    let qry = `INSERT INTO DOCUMENTOS_TEMPORALES (
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
            '' AS CODEMBARQUE,            
            '${jsondocproductos}' AS JSONDOCPRODUCTOS;
        `

    return qry;

};



router.post("/listado_colores", async(req,res)=>{
   
    const { token, sucursal} = req.body;

    let qry = `SELECT NF, NOMBRE, COLOR, DESCRIPCION FROM COLORES`
    
 

    execute.QueryToken(res,qry,token);
     
});


router.post("/productos_filtro", async(req,res)=>{
   
    const { token, sucursal, filtro, tipoprecio } = req.body;


        let qry = `SELECT TOP 150 PRODUCTOS.CODPROD, PRODUCTOS.CODPROD2, PRODUCTOS.DESPROD, 
                    PRODUCTOS.DESPROD2, PRODUCTOS.DESPROD3, PRODUCTOS.CODMARCA, 
                    MARCAS.DESMARCA, PRODUCTOS.TIPOPROD, 
                    PRECIOS.CODMEDIDA, PRECIOS.EQUIVALE, PRECIOS.COSTO, 
                    PRECIOS.${tipoprecio} AS PRECIO, view_invsaldo.EMPNIT, 
                    ISNULL(view_invsaldo.TOTALUNIDADES,0) AS EXISTENCIA, 
                    COLORES.COLOR, PRODUCTOS.EXENTO, 
                    ISNULL(PRECIOS.BONO_${tipoprecio}, 0) AS BONO,
                    ISNULL(view_invsaldo.CODMEDIDA_DESHABILITADA,'') AS CODMEDIDA_DESHABILITADA
                    FROM PRODUCTOS LEFT OUTER JOIN
                         COLORES ON PRODUCTOS.NF = COLORES.NF LEFT OUTER JOIN
                         view_invsaldo ON PRODUCTOS.CODPROD = view_invsaldo.CODPROD LEFT OUTER JOIN
                         MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA LEFT OUTER JOIN
                         PRECIOS ON PRODUCTOS.CODPROD = PRECIOS.CODPROD
                    WHERE 
                        (PRODUCTOS.HABILITADO = 'SI') AND 
                        (PRODUCTOS.DESPROD LIKE '%${filtro}%') AND 
                        (PRECIOS.CODMEDIDA IS NOT NULL) AND 
                        (view_invsaldo.EMPNIT = '${sucursal}') 
                            OR
                        (PRODUCTOS.HABILITADO = 'SI') AND 
                        (PRECIOS.CODMEDIDA IS NOT NULL) AND
                        (view_invsaldo.EMPNIT = '${sucursal}') AND 
                        (PRODUCTOS.CODPROD = '${filtro}')
                            OR
                        (PRODUCTOS.HABILITADO = 'SI') AND 
                        (PRECIOS.CODMEDIDA IS NOT NULL) AND
                        (view_invsaldo.EMPNIT = '${sucursal}') AND 
                        (PRODUCTOS.CODPROD2 = '${filtro}')
                    `
    
                

    execute.QueryToken(res,qry,token);
     
});
router.post("/productos_filtro_movinv", async(req,res)=>{
   
    const { token, sucursal, filtro, tipoprecio } = req.body;


        let qry = `SELECT TOP 70 PRODUCTOS.CODPROD, PRODUCTOS.CODPROD2, PRODUCTOS.DESPROD, 
                    PRODUCTOS.DESPROD2, PRODUCTOS.DESPROD3, PRODUCTOS.CODMARCA, 
                    MARCAS.DESMARCA, PRODUCTOS.TIPOPROD, 
                    PRECIOS.CODMEDIDA, PRECIOS.EQUIVALE, PRECIOS.COSTO, 
                    PRECIOS.${tipoprecio} AS PRECIO, view_invsaldo.EMPNIT, 
                    ISNULL(view_invsaldo.TOTALUNIDADES,0) AS EXISTENCIA, 
                    COLORES.COLOR, PRODUCTOS.EXENTO, 
                    ISNULL(PRECIOS.BONO_${tipoprecio}, 0) AS BONO,
                    ISNULL(view_invsaldo.CODMEDIDA_DESHABILITADA,'') AS CODMEDIDA_DESHABILITADA
                    FROM PRODUCTOS LEFT OUTER JOIN
                         COLORES ON PRODUCTOS.NF = COLORES.NF LEFT OUTER JOIN
                         view_invsaldo ON PRODUCTOS.CODPROD = view_invsaldo.CODPROD LEFT OUTER JOIN
                         MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA LEFT OUTER JOIN
                         PRECIOS ON PRODUCTOS.CODPROD = PRECIOS.CODPROD
                    WHERE 
                        (PRODUCTOS.HABILITADO = 'SI') AND 
                        (PRODUCTOS.DESPROD LIKE '%${filtro}%') AND
                        (PRECIOS.CODMEDIDA IS NOT NULL) AND 
                        (view_invsaldo.EMPNIT = '${sucursal}') 
                            OR
                        (PRODUCTOS.HABILITADO = 'SI') AND 
                        (PRODUCTOS.DESPROD2 LIKE '%${filtro}%') AND
                        (PRECIOS.CODMEDIDA IS NOT NULL) AND 
                        (view_invsaldo.EMPNIT = '${sucursal}') 
                            OR
                        (PRODUCTOS.HABILITADO = 'SI') AND 
                        (PRECIOS.CODMEDIDA IS NOT NULL) AND
                        (view_invsaldo.EMPNIT = '${sucursal}') AND 
                        (PRODUCTOS.CODPROD = '${filtro}')
                            OR
                        (PRODUCTOS.HABILITADO = 'SI') AND 
                        (PRECIOS.CODMEDIDA IS NOT NULL) AND
                        (view_invsaldo.EMPNIT = '${sucursal}') AND 
                        (PRODUCTOS.CODPROD2 = '${filtro}')
                    `
    
                

    execute.QueryToken(res,qry,token);
     
});




router.post("/BACKUP_CAMPO_HABILITADO_MEDIDA_GENERAL_productos_filtro", async(req,res)=>{
   
    const { token, sucursal, filtro, tipoprecio } = req.body;


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
                    WHERE 
                        (PRODUCTOS.HABILITADO = 'SI') AND 
                        (PRODUCTOS.DESPROD LIKE '%${filtro}%') AND 
                        (PRECIOS.CODMEDIDA IS NOT NULL) AND
                        (PRECIOS.HABILITADO<>'NO') AND 
                        (view_invsaldo.EMPNIT = '${sucursal}') 
                            OR
                        (PRODUCTOS.HABILITADO = 'SI') AND 
                        (PRECIOS.CODMEDIDA IS NOT NULL) AND
                        (PRECIOS.HABILITADO<>'NO') AND 
                        (view_invsaldo.EMPNIT = '${sucursal}') AND 
                        (PRODUCTOS.CODPROD = '${filtro}')
                            OR
                        (PRODUCTOS.HABILITADO = 'SI') AND 
                        (PRECIOS.CODMEDIDA IS NOT NULL) AND
                        (PRECIOS.HABILITADO<>'NO') AND 
                        (view_invsaldo.EMPNIT = '${sucursal}') AND 
                        (PRODUCTOS.CODPROD2 = '${filtro}')
                    `
    
                

    execute.QueryToken(res,qry,token);
     
});
router.post("/BACKUP_NORMAL_productos_filtro", async(req,res)=>{
   
    const { token, sucursal, filtro, tipoprecio } = req.body;


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
                         DOCUMENTOS.STATUS AS ST, ISNULL(DOCUMENTOS.CONCRE,'') AS CONCRE, ISNULL(DOCUMENTOS.FEL_UUDI,'') AS FEL_UUDI, DOCUMENTOS.ENTREGADO, DOCUMENTOS.TOTALVENTA, 
                         DOCUMENTOS.TOTALDESCUENTO, DOCUMENTOS.TOTALPRECIO
FROM            DOCUMENTOS LEFT OUTER JOIN
                         TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT
WHERE        (DOCUMENTOS.EMPNIT = '${sucursal}') AND (DOCUMENTOS.FECHA = '${fecha}') AND (TIPODOCUMENTOS.TIPODOC = '${tipo}')`
    
   

    execute.QueryToken(res,qry,token);
     
});


router.post("/lista_documentos_temporales", async(req,res)=>{
   
    const { token, sucursal, tipo, fecha } = req.body;

    let qry = `SELECT  
            DOCUMENTOS_TEMPORALES.EMPNIT, 
            TIPODOCUMENTOS.TIPODOC, 
            DOCUMENTOS_TEMPORALES.FECHA, 
            DOCUMENTOS_TEMPORALES.CODDOC, 
            DOCUMENTOS_TEMPORALES.CORRELATIVO, 
            DOCUMENTOS_TEMPORALES.HORA, 
            DOCUMENTOS_TEMPORALES.CODCLIENTE, 
            DOCUMENTOS_TEMPORALES.DOC_NIT, 
            DOCUMENTOS_TEMPORALES.DOC_NOMCLIE AS NOMCLIE, 
            DOCUMENTOS_TEMPORALES.DOC_DIRCLIE AS DIRCLIE, 
            DOCUMENTOS_TEMPORALES.STATUS AS ST, 
            ISNULL(DOCUMENTOS_TEMPORALES.FEL_UUDI,'') AS FEL_UUDI, 
            DOCUMENTOS_TEMPORALES.ENTREGADO, 
            DOCUMENTOS_TEMPORALES.TOTALVENTA, 
            DOCUMENTOS_TEMPORALES.TOTALDESCUENTO, 
            DOCUMENTOS_TEMPORALES.TOTALPRECIO
        FROM DOCUMENTOS_TEMPORALES LEFT OUTER JOIN
            TIPODOCUMENTOS ON DOCUMENTOS_TEMPORALES.CODDOC = TIPODOCUMENTOS.CODDOC 
            AND DOCUMENTOS_TEMPORALES.EMPNIT = TIPODOCUMENTOS.EMPNIT
        WHERE (DOCUMENTOS_TEMPORALES.EMPNIT = '${sucursal}') 
        AND (DOCUMENTOS_TEMPORALES.FECHA = '${fecha}') 
        AND (TIPODOCUMENTOS.TIPODOC = '${tipo}')`
    
   

    execute.QueryToken(res,qry,token);
     
});





router.post("/insert_documento_abierto", async(req,res)=>{

    const { token, sucursal,
        coddoc, correlativo, anio, mes, fecha, fechaentrega,
        codbodega, codcliente, nomclie, nitclie, dirclie, obs, usuario,
        codven, hora, tipo_pago, codcaja, iva, etiqueta, tipo_doc,
        lat, long, direntrega } = req.body;

    let qryDocumentos = str_qry_documentos('[]', sucursal,
        coddoc, correlativo, anio, mes, fecha, fechaentrega || fecha, '',
        codbodega, codcliente || 0, nomclie || '', 0, 0, 0,
        nitclie || '', dirclie || '', obs || '', direntrega || '', usuario,
        codven, lat || '0', long || '0', hora, tipo_pago || 'CON', tipo_doc || 'mostrador',
        '', '', '', '', '0', '0',
        codcaja, iva, etiqueta || 'MEDIA');

    let nuevoCorrelativo = Number(correlativo) + 1;
    let qryTipodocumentos = `UPDATE TIPODOCUMENTOS SET CORRELATIVO=${nuevoCorrelativo} WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}';`;
    execute.QueryToken(res, qryDocumentos + qryTipodocumentos, token);

});

router.post("/update_encabezado_venta", async(req,res)=>{

    const { token, sucursal, coddoc, correlativo,
        codcliente, nomclie, nitclie, dirclie, obs,
        codven, tipo_pago, codcaja, fecha, fechaentrega,
        etiqueta, tipo_doc, direntrega } = req.body;

    let qry = `
        UPDATE DOCUMENTOS SET
            CODCLIENTE=${codcliente || 0},
            DOC_NIT='${nitclie || ''}',
            DOC_NOMCLIE='${nomclie || ''}',
            DOC_DIRCLIE='${dirclie || ''}',
            OBS='${obs || ''}',
            CODEMP=${codven || 0},
            CONCRE='${tipo_pago || 'CON'}',
            CODCAJA=${codcaja || 0},
            FECHA='${fecha}',
            VENCIMIENTO='${fechaentrega || fecha}',
            ETIQUETA='${etiqueta || 'MEDIA'}',
            TIPO_VENTA='${tipo_doc || 'mostrador'}',
            DIRENTREGA='${direntrega || ''}',
            ANIO=YEAR('${fecha}'),
            MES=MONTH('${fecha}')
        WHERE EMPNIT='${sucursal}' AND CODDOC='${coddoc}' AND CORRELATIVO=${correlativo};
    `;

    execute.QueryToken(res, qry, token);

});

router.post("/insert_item_venta", async(req,res)=>{

    const { token, sucursal, coddoc, correlativo, codbodega,
        codprod, desprod, codmedida, cantidad, equivale,
        totalunidades, costo, precio, totalcosto, totalprecio,
        descuento, tipoprod, tipoprecio, lastupdate, por_iva, existencia,
        bono, exento
    } = req.body;

    let qry = `
       INSERT INTO DOCPRODUCTOS (
            EMPNIT, ANIO, MES, CODDOC, CORRELATIVO,
            CODPROD, DESPROD, CODMEDIDA, CANTIDAD, CANTIDADBONIF,
            EQUIVALE, TOTALUNIDADES, TOTALBONIF, COSTO, PRECIO,
            TOTALCOSTO, DESCUENTO, TOTALPRECIO, ENTREGADOS_TOTALUNIDADES,
            COSTOANTERIOR, COSTOPROMEDIO, CODBODEGA, NOSERIE, EXENTO,
            OBS, TIPOPROD, TIPOPRECIO, LASTUPDATE, TOTALUNIDADES_DEVUELTAS,
            POR_IVA, EXISTENCIA, BONO, TOTALBONO
            )
        SELECT
            EMPNIT, ANIO, MES, CODDOC, CORRELATIVO,
            '${codprod}' AS CODPROD,
            '${esc(desprod)}' AS DESPROD,
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
            ${codbodega || 0} AS CODBODEGA,
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
            ${Number(bono) * Number(cantidad)} AS TOTALBONO
        FROM DOCUMENTOS
        WHERE EMPNIT='${sucursal}'
            AND CODDOC='${coddoc}'
            AND CORRELATIVO=${correlativo};
    `;

    execute.QueryToken(res, qry, token);

});

module.exports = router;