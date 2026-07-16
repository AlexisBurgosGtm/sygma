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

/** Limpia y normaliza el JSON de productos para evitar basura de IndexedDB y literales SQL truncados. */
function sanitizeDocProductosJson(jsondocproductos) {
    let items = [];
    try {
        const parsed = typeof jsondocproductos === 'string'
            ? JSON.parse(jsondocproductos)
            : jsondocproductos;
        items = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        items = [];
    }

    const clean = items.map((r) => ({
        CODPROD: String(r.CODPROD == null ? '' : r.CODPROD).trim(),
        DESPROD: String(r.DESPROD == null ? '' : r.DESPROD).replace(/[\u0000-\u001F]/g, ' ').trim(),
        CODMEDIDA: String(r.CODMEDIDA == null ? '' : r.CODMEDIDA).trim(),
        CANTIDAD: num(r.CANTIDAD),
        EQUIVALE: num(r.EQUIVALE),
        TOTALUNIDADES: num(r.TOTALUNIDADES),
        COSTO: num(r.COSTO),
        PRECIO: num(r.PRECIO),
        TOTALCOSTO: num(r.TOTALCOSTO),
        DESCUENTO: num(r.DESCUENTO),
        TOTALPRECIO: num(r.TOTALPRECIO),
        EXENTO: num(r.EXENTO),
        TIPOPROD: String(r.TIPOPROD == null ? '' : r.TIPOPROD).trim(),
        TIPOPRECIO: String(r.TIPOPRECIO == null ? '' : r.TIPOPRECIO).trim(),
        EXISTENCIA: num(r.EXISTENCIA),
        BONO: num(r.BONO),
    })).filter((r) => r.CODPROD !== '');

    return { json: JSON.stringify(clean), count: clean.length, items: clean };
}

function sqlInsertDocproductosOpenJson() {
    return `
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
            @empnit AS EMPNIT,
            @anio AS ANIO,
            @mes AS MES,
            @coddoc AS CODDOC,
            @correlativo AS CORRELATIVO,
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
            @codbodega AS CODBODEGA,
            '' AS NOSERIE,
            ISNULL(j.EXENTO, 0) AS EXENTO,
            '' AS OBS,
            LEFT(ISNULL(j.TIPOPROD, ''), 20) AS TIPOPROD,
            LEFT(ISNULL(j.TIPOPRECIO, ''), 20) AS TIPOPRECIO,
            @fecha AS LASTUPDATE,
            0 AS TOTALUNIDADES_DEVUELTAS,
            @iva AS POR_IVA,
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
}

router.post("/insertventa_factura", async (req, res) => {
    const {
        token, jsondocproductos, sucursal,
        coddoc, correlativo, anio, mes, fecha, fechaentrega, formaentrega,
        codbodega, codcliente, nomclie, totalcosto, totalprecio, totaldescuento,
        nitclie, dirclie, obs, direntrega, usuario,
        codven, lat, long, hora, tipo_pago, tipo_doc,
        entrega_contacto, entrega_telefono, entrega_direccion,
        entrega_referencia, entrega_lat, entrega_long,
        codcaja, iva, etiqueta,
    } = req.body;

    let productos;
    try {
        productos = sanitizeDocProductosJson(jsondocproductos);
    } catch (e) {
        console.error('[insertventa_factura] JSON inválido', e.message || e);
        return res.send('error');
    }

    if (!productos.count) {
        console.error('[insertventa_factura] sin productos válidos');
        return res.send('error');
    }

    const emp = String(sucursal || '');
    const doc = String(coddoc || '');
    const corr = num(correlativo);
    const nuevoCorrelativo = corr + 1;
    const fec = String(fecha || '');
    const bod = num(codbodega, 0);

    try {
        const result = await execute.TransactionToken(token, async (transaction, sql) => {
            const reqDoc = new sql.Request(transaction);
            reqDoc.input('empnit', sql.VarChar(50), emp);
            reqDoc.input('anio', sql.Int, num(anio));
            reqDoc.input('mes', sql.Int, num(mes));
            reqDoc.input('fecha', sql.VarChar(20), fec);
            reqDoc.input('hora', sql.VarChar(20), String(hora || ''));
            reqDoc.input('coddoc', sql.VarChar(50), doc);
            reqDoc.input('correlativo', sql.Int, corr);
            reqDoc.input('codcliente', sql.Int, num(codcliente));
            reqDoc.input('nitclie', sql.NVarChar(50), String(nitclie || ''));
            reqDoc.input('nomclie', sql.NVarChar(250), String(nomclie || ''));
            reqDoc.input('dirclie', sql.NVarChar(250), String(dirclie || ''));
            reqDoc.input('totalcosto', sql.Float, num(totalcosto));
            reqDoc.input('totalprecio', sql.Float, num(totalprecio));
            reqDoc.input('totaldescuento', sql.Float, num(totaldescuento));
            reqDoc.input('totalneto', sql.Float, num(totalprecio) - num(totaldescuento));
            reqDoc.input('usuario', sql.NVarChar(100), String(usuario || ''));
            reqDoc.input('tipo_pago', sql.VarChar(20), String(tipo_pago || 'CON'));
            reqDoc.input('codcaja', sql.Int, num(codcaja));
            reqDoc.input('codven', sql.Int, num(codven));
            reqDoc.input('obs', sql.NVarChar(500), String(obs || ''));
            reqDoc.input('direntrega', sql.NVarChar(250), String(direntrega || ''));
            reqDoc.input('lat', sql.Float, num(lat));
            reqDoc.input('long', sql.Float, num(long));
            reqDoc.input('iva', sql.Float, num(iva));
            reqDoc.input('tipo_doc', sql.VarChar(50), String(tipo_doc || ''));
            reqDoc.input('etiqueta', sql.VarChar(50), String(etiqueta || ''));
            reqDoc.input('jsonDoc', sql.NVarChar(sql.MAX), productos.json);

            await reqDoc.query(`
                INSERT INTO DOCUMENTOS (
                    EMPNIT, ANIO, MES, FECHA, HORA, CODDOC, CORRELATIVO,
                    CODCLIENTE, DOC_NIT, DOC_NOMCLIE, DOC_DIRCLIE,
                    TOTALCOSTO, TOTALVENTA, TOTALDESCUENTO, RECARGOTARJETA, TOTALPRECIO,
                    PAGO, VUELTO, STATUS,
                    TOTAL_EFECTIVO, TOTAL_TARJETA, TOTAL_DEPOSITOS, TOTAL_CHEQUES,
                    USUARIO, CONCRE, CODCAJA, NOCORTE, SERIEFAC, NOFAC, CODEMP,
                    OBS, DOC_SALDO, DOC_ABONOS, DIRENTREGA, TOTALEXENTO,
                    LAT, LONG, VENCIMIENTO, ENTREGADO, POR_IVA, TIPO_VENTA, ETIQUETA,
                    CODEMBARQUE, JSONDOCPRODUCTOS
                )
                VALUES (
                    @empnit, @anio, @mes, @fecha, @hora, @coddoc, @correlativo,
                    @codcliente, @nitclie, @nomclie, @dirclie,
                    @totalcosto, @totalprecio, @totaldescuento, 0, @totalneto,
                    0, 0, 'O',
                    0, 0, 0, 0,
                    @usuario, @tipo_pago, @codcaja, 0, @coddoc, CAST(@correlativo AS VARCHAR(30)), @codven,
                    @obs, 0, 0, @direntrega, 0,
                    @lat, @long, @fecha, 'NO', @iva, @tipo_doc, @etiqueta,
                    '', @jsonDoc
                );
            `);

            const reqProd = new sql.Request(transaction);
            reqProd.input('empnit', sql.VarChar(50), emp);
            reqProd.input('anio', sql.Int, num(anio));
            reqProd.input('mes', sql.Int, num(mes));
            reqProd.input('coddoc', sql.VarChar(50), doc);
            reqProd.input('correlativo', sql.Int, corr);
            reqProd.input('codbodega', sql.Int, bod);
            reqProd.input('fecha', sql.VarChar(20), fec);
            reqProd.input('iva', sql.Float, num(iva));
            reqProd.input('jsonDoc', sql.NVarChar(sql.MAX), productos.json);
            await reqProd.query(sqlInsertDocproductosOpenJson());

            const reqChk = new sql.Request(transaction);
            reqChk.input('empnit', sql.VarChar(50), emp);
            reqChk.input('coddoc', sql.VarChar(50), doc);
            reqChk.input('correlativo', sql.Int, corr);
            reqChk.input('esperados', sql.Int, productos.count);
            reqChk.input('jsonDoc', sql.NVarChar(sql.MAX), productos.json);
            const chk = await reqChk.query(`
                DECLARE @cntDp INT = (
                    SELECT COUNT(*) FROM DOCPRODUCTOS
                     WHERE EMPNIT = @empnit AND CODDOC = @coddoc AND CORRELATIVO = @correlativo
                );
                DECLARE @cntJson INT = (SELECT COUNT(*) FROM OPENJSON(@jsonDoc));
                SELECT @cntDp AS CNT_DP, @cntJson AS CNT_JSON, @esperados AS CNT_ESPERADOS;
                IF (@cntDp = 0 OR @cntDp <> @cntJson OR @cntDp <> @esperados)
                BEGIN
                    THROW 50001, 'DOCPRODUCTOS incompleto respecto a JSONDOCPRODUCTOS', 1;
                END
            `);

            const reqExtra = new sql.Request(transaction);
            reqExtra.input('empnit', sql.VarChar(50), emp);
            reqExtra.input('coddoc', sql.VarChar(50), doc);
            reqExtra.input('nuevoCorr', sql.Int, nuevoCorrelativo);
            reqExtra.input('fecha', sql.VarChar(20), fec);
            reqExtra.input('codcliente', sql.Int, num(codcliente));
            reqExtra.input('hora', sql.VarChar(20), String(hora || ''));
            reqExtra.input('codven', sql.Int, num(codven));
            reqExtra.input('elat', sql.Float, num(entrega_lat));
            reqExtra.input('elong', sql.Float, num(entrega_long));
            await reqExtra.query(`
                UPDATE TIPODOCUMENTOS SET CORRELATIVO = @nuevoCorr
                 WHERE EMPNIT = @empnit AND CODDOC = @coddoc;
                UPDATE CLIENTES SET LASTSALE = @fecha WHERE CODCLIENTE = @codcliente;
                INSERT INTO CLIENTES_VISITAS (EMPNIT, CODCLIENTE, FECHA, HORA, CODEMP, MOTIVO, LATITUD, LONGITUD)
                VALUES (@empnit, @codcliente, @fecha, @hora, @codven, 'VENTA', @elat, @elong);
            `);

            return chk;
        });

        res.send(result);
    } catch (err) {
        console.error('[insertventa_factura]', err.message || err);
        res.send('error');
    }
});

/** Reconstruye DOCPRODUCTOS desde DOCUMENTOS.JSONDOCPRODUCTOS (pedidos dañados). */
router.post("/reparar_docproductos_json", async (req, res) => {
    const { token, sucursal, coddoc, correlativo, anio, mes, fecha, iva, codbodega } = req.body;
    const emp = String(sucursal || '');
    const doc = String(coddoc || '');
    const corr = num(correlativo);

    if (!emp || !doc || !corr) {
        return res.status(400).send('error');
    }

    try {
        const result = await execute.TransactionToken(token, async (transaction, sql) => {
            const reqGet = new sql.Request(transaction);
            reqGet.input('empnit', sql.VarChar(50), emp);
            reqGet.input('coddoc', sql.VarChar(50), doc);
            reqGet.input('correlativo', sql.Int, corr);
            const got = await reqGet.query(`
                SELECT TOP 1
                       ISNULL(JSONDOCPRODUCTOS, '[]') AS JSONDOCPRODUCTOS,
                       ANIO, MES, FECHA, ISNULL(POR_IVA, 0) AS POR_IVA
                  FROM DOCUMENTOS
                 WHERE EMPNIT = @empnit AND CODDOC = @coddoc AND CORRELATIVO = @correlativo;
            `);

            if (!got.recordset || !got.recordset.length) {
                throw new Error('documento no encontrado');
            }

            const row = got.recordset[0];
            const productos = sanitizeDocProductosJson(row.JSONDOCPRODUCTOS);
            if (!productos.count) {
                throw new Error('JSONDOCPRODUCTOS vacío o inválido');
            }

            // Actualiza JSON limpio en el encabezado
            const reqUpd = new sql.Request(transaction);
            reqUpd.input('empnit', sql.VarChar(50), emp);
            reqUpd.input('coddoc', sql.VarChar(50), doc);
            reqUpd.input('correlativo', sql.Int, corr);
            reqUpd.input('jsonDoc', sql.NVarChar(sql.MAX), productos.json);
            await reqUpd.query(`
                UPDATE DOCUMENTOS SET JSONDOCPRODUCTOS = @jsonDoc
                 WHERE EMPNIT = @empnit AND CODDOC = @coddoc AND CORRELATIVO = @correlativo;

                DELETE FROM DOCPRODUCTOS
                 WHERE EMPNIT = @empnit AND CODDOC = @coddoc AND CORRELATIVO = @correlativo;
            `);

            const rawFec = fecha || row.FECHA;
            const fec = rawFec instanceof Date
                ? rawFec.toISOString().slice(0, 10)
                : String(rawFec || '').substring(0, 10);
            const reqProd = new sql.Request(transaction);
            reqProd.input('empnit', sql.VarChar(50), emp);
            reqProd.input('anio', sql.Int, num(anio, row.ANIO));
            reqProd.input('mes', sql.Int, num(mes, row.MES));
            reqProd.input('coddoc', sql.VarChar(50), doc);
            reqProd.input('correlativo', sql.Int, corr);
            reqProd.input('codbodega', sql.Int, num(codbodega, 0));
            reqProd.input('fecha', sql.VarChar(20), fec);
            reqProd.input('iva', sql.Float, num(iva, row.POR_IVA));
            reqProd.input('jsonDoc', sql.NVarChar(sql.MAX), productos.json);
            await reqProd.query(sqlInsertDocproductosOpenJson());

            const reqChk = new sql.Request(transaction);
            reqChk.input('empnit', sql.VarChar(50), emp);
            reqChk.input('coddoc', sql.VarChar(50), doc);
            reqChk.input('correlativo', sql.Int, corr);
            reqChk.input('esperados', sql.Int, productos.count);
            const chk = await reqChk.query(`
                DECLARE @cntDp INT = (
                    SELECT COUNT(*) FROM DOCPRODUCTOS
                     WHERE EMPNIT = @empnit AND CODDOC = @coddoc AND CORRELATIVO = @correlativo
                );
                SELECT @cntDp AS CNT_DP, @esperados AS CNT_ESPERADOS;
                IF (@cntDp <> @esperados)
                BEGIN
                    THROW 50002, 'Reparación incompleta de DOCPRODUCTOS', 1;
                END
            `);

            return { ok: true, insertados: productos.count, check: chk.recordset?.[0] };
        });

        res.send(result);
    } catch (err) {
        console.error('[reparar_docproductos_json]', err.message || err);
        res.send('error');
    }
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