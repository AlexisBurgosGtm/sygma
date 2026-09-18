const execute = require('./../connection');
const express = require('express');
const router = express.Router();



router.post("/lista_precios_general", async(req,res)=>{
   
    const {token,sucursal} = req.body;

   
    let qry = `
            SELECT
                CODIGO,CODIGO2,CODIGO3,PRODUCTO,
                COSTO_ULTIMO,HABILITADO,TIPOPROD,CODMARCA,
                MARCA,COD_TIPO,CLASIFICACION_TIPO,
                MEDIDA,EQUIVALE,ISNULL(COSTO,0) AS COSTO,
                ISNULL(PRECIO,0) AS PRECIO,
                ISNULL(PRECIO_A,0) AS PRECIO_A,
                ISNULL(PRECIO_B,0) AS PRECIO_B,
                ISNULL(PRECIO_C,0) AS PRECIO_C  
            FROM 
                view_lista_productos_precios 
            `

    execute.QueryToken(res,qry,token);
     
});





router.post("/update_codprod", async(req,res)=>{
   
    const {token,sucursal,codprod_old, codprod_new} = req.body;

   
    let qry = `
            UPDATE DOCPRODUCTOS SET CODPROD='${codprod_new}' WHERE CODPROD='${codprod_old}';
            UPDATE PRECIOS SET CODPROD='${codprod_new}' WHERE CODPROD='${codprod_old}';
            UPDATE INVSALDO SET CODPROD='${codprod_new}' WHERE CODPROD='${codprod_old}';
            IF OBJECT_ID('dbo.INV_STOCK', 'U') IS NOT NULL
                UPDATE INV_STOCK SET CODPROD='${codprod_new}', LASTUPDATE=GETDATE() WHERE CODPROD='${codprod_old}';
            UPDATE PRODUCTOS SET CODPROD='${codprod_new}' WHERE CODPROD='${codprod_old}';
    `

    execute.QueryToken(res,qry,token);
     
});




router.post("/movimientos_kardex", async(req,res)=>{
   
    const {token,sucursal,codprod} = req.body;

   
    let qry = `
        SELECT DOCUMENTOS.ID, DOCUMENTOS.FECHA, DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO, DOCPRODUCTOS.CODPROD, DOCPRODUCTOS.DESPROD, DOCPRODUCTOS.TOTALUNIDADES, DOCPRODUCTOS.COSTO, 
            DOCPRODUCTOS.PRECIO, DOCPRODUCTOS.TOTALCOSTO, DOCPRODUCTOS.DESCUENTO, 
            DOCPRODUCTOS.TOTALPRECIO, DOCPRODUCTOS.LASTUPDATE, DOCPRODUCTOS.TIPOPRECIO, CONFIG_TIPODOCUMENTOS.INV
        FROM     CONFIG_TIPODOCUMENTOS RIGHT OUTER JOIN
                        DOCPRODUCTOS RIGHT OUTER JOIN
                        DOCUMENTOS ON DOCPRODUCTOS.CORRELATIVO = DOCUMENTOS.CORRELATIVO AND DOCPRODUCTOS.CODDOC = DOCUMENTOS.CODDOC AND DOCPRODUCTOS.EMPNIT = DOCUMENTOS.EMPNIT LEFT OUTER JOIN
                        TIPODOCUMENTOS ON DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC AND DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT ON CONFIG_TIPODOCUMENTOS.TIPODOC = TIPODOCUMENTOS.TIPODOC
        WHERE  (DOCUMENTOS.EMPNIT = '${sucursal}') 
                AND (DOCUMENTOS.STATUS <> 'A') 
                AND (DOCPRODUCTOS.CODPROD = '${codprod}')
                AND (CONFIG_TIPODOCUMENTOS.INV IN(1,-1))
        ORDER BY DOCUMENTOS.ID
    `

    execute.QueryToken(res,qry,token);
     
});


router.post("/insert_producto", async(req,res)=>{
   
    const {token,sucursal,codprod,codprod2,
        desprod,desprod2,desprod3,uxc,costo,
        codmarca,lastupdate,tipoprod,exento,nf, bono,
        tipolaboratorio,tipoimpulso,tipoprogramasalud,tipormmr,tiporelleno,tiporentabilidad,tipotipo} = req.body;

    let qry = `
    INSERT INTO PRODUCTOS (CODPROD,CODPROD2,DESPROD,
        DESPROD2,DESPROD3,UXC,COSTO_ULTIMO,COSTO_ANTERIOR,
        CODMARCA,CLASIF_LABORATORIO,CLASIF_IMPULSO,CLASIF_PROGRAMA_SALUD,CLASIF_RM_MR,CLASIF_RELLENO,
        CLASIF_TIPO,CLASIF_BI,
        HABILITADO,EXENTO,
        NF,TIPOPROD,BONO,LASTUPDATE)
    SELECT '${codprod}' AS CODPROD,'${codprod2}' AS CODPROD2,
        '${desprod}' AS DESPROD,'${desprod2}' AS DESPROD2,
        '${desprod3}' AS DESPROD3,${uxc} AS UXC,    
        ${costo} AS COSTO_ULTIMO, ${costo} AS COSTO_ANTERIOR,
        ${codmarca} AS CODMARCA,
        ${tipolaboratorio} AS CLASIF_LABORATORIO,
        ${tipoimpulso} AS CLASIF_IMPULSO,
        ${tipoprogramasalud} AS CLASIF_PROGRAMA_SALUD,
        ${tipormmr} AS CLASIF_RM_MR,
        ${tiporelleno} AS CLASIF_RELLENO,
        ${tipotipo} AS CLASIF_TIPO,
        ${tiporentabilidad} AS CLASIF_BI,
        'SI' AS HABILITADO, ${exento} AS EXENTO,
        ${nf} AS NF,'${tipoprod}' AS TIPOPROD,
        ${bono} AS BONO,'${lastupdate}' AS LASTUPDATE;
    INSERT INTO PRECIOS 
        (CODPROD,CODMEDIDA,EQUIVALE,COSTO,PRECIO, PRECIO_A, PRECIO_B, PRECIO_C, 
        PRECIO_D, PRECIO_E, PRECIO_F, PESO, LASTUPDATE,HABILITADO)
    SELECT '${codprod}' AS CODPROD, CODMEDIDA, 
        EQUIVALE, COSTO, 
        PRECIO, PRECIO_A, PRECIO_B, 0, 0, 0, 0,
        PESO, '${lastupdate}' AS LASTUPDATE,'SI' AS HABILITADO
    FROM TEMP_PRECIOS;
    INSERT INTO INVSALDO (EMPNIT, CODPROD,
        ENTRADAS, SALIDAS,
        EXISTENCIA, FISICO,
        CODBODEGA, NOLOTE,
        MINIMO, MAXIMO,HABILITADO,SELLOUT) 
    SELECT EMPNIT, '${codprod}' AS CODPROD,
	    0 AS ENTRADAS, 0 AS SALIDAS,
	    0 AS EXISTENCIA, 0 AS FISICO,
	    1 AS CODBODEGA, '' AS NOLOTE,
	    0 AS MINIMO, 0 AS MAXIMO, 
        'SI' AS HABILITADO, 0 AS SELLOUT
    FROM EMPRESAS;
    IF OBJECT_ID('dbo.INV_STOCK', 'U') IS NOT NULL
    BEGIN
        INSERT INTO INV_STOCK (EMPNIT, CODPROD, EXISTENCIA, LASTUPDATE)
        SELECT E.EMPNIT, '${codprod}' AS CODPROD, 0 AS EXISTENCIA, GETDATE() AS LASTUPDATE
        FROM EMPRESAS E
        WHERE NOT EXISTS (
            SELECT 1 FROM INV_STOCK S
            WHERE S.EMPNIT = E.EMPNIT AND S.CODPROD = '${codprod}'
        );
    END
    `


    execute.QueryToken(res,qry,token);
     
});

router.post("/update_precios_fila", async(req,res)=>{

    const {token, sucursal, id, codprod, codmedida, precio, precio_a, precio_b} = req.body || {};
    const idNum = Number(id) || 0;
    const prod = String(codprod == null ? '' : codprod).replace(/'/g, "''").trim();
    const med = String(codmedida == null ? '' : codmedida).replace(/'/g, "''").trim();
    const p = Number(precio);
    const pa = Number(precio_a);
    const pb = Number(precio_b);

    if (!prod || (!idNum && !med) || !isFinite(p) || !isFinite(pa) || !isFinite(pb) || p < 0 || pa < 0 || pb < 0) {
        res.send({ error: 'Precios inválidos', rowsAffected: [0], recordset: [] });
        return;
    }

    const where = idNum
        ? `ID=${idNum} AND CODPROD='${prod}'`
        : `CODPROD='${prod}' AND CODMEDIDA='${med}'`;

    const qry = `
        UPDATE PRECIOS SET
            PRECIO=${p},
            PRECIO_A=${pa},
            PRECIO_B=${pb},
            LASTUPDATE=GETDATE()
        WHERE ${where};
    `;

    execute.QueryToken(res, qry, token);

});

router.post("/update_precio_medida", async(req,res)=>{
   
    const {token,sucursal,codprod,tipo,codmedida,equivale,precio,bono,margen} = req.body;


    let qry = '';

    switch (tipo) {
        case 'P':
            qry = `UPDATE PRECIOS SET 
                        PRECIO=${precio},
                        BONO_PRECIO=${bono},
                        MARGEN=${margen}
                    WHERE CODMEDIDA='${codmedida}' AND CODPROD='${codprod}';`
            break;
        case 'A':
            qry = `UPDATE PRECIOS SET 
                        PRECIO_A=${precio},
                        BONO_PRECIO_A=${bono},
                        MARGEN_A=${margen}
                    WHERE CODMEDIDA='${codmedida}' AND CODPROD='${codprod}';`
            break;
        case 'B':
            qry = `UPDATE PRECIOS SET 
                        PRECIO_B=${precio},
                        BONO_PRECIO_B=${bono},
                        MARGEN_B=${margen}
                    WHERE CODMEDIDA='${codmedida}' AND CODPROD='${codprod}';`
            break;
        case 'C':
            qry = `UPDATE PRECIOS SET 
                        PRECIO_C=${precio},
                        BONO_PRECIO_C=${bono},
                        MARGEN_C=${margen}
                    WHERE CODMEDIDA='${codmedida}' AND CODPROD='${codprod}';`
            break;
        case 'D':
            qry = `UPDATE PRECIOS SET 
                        PRECIO_D=${precio},
                        BONO_PRECIO_D=${bono},
                        MARGEN_D=${margen}
                    WHERE CODMEDIDA='${codmedida}' AND CODPROD='${codprod}';`
            break;
        case 'E':
            qry = `UPDATE PRECIOS SET 
                        PRECIO_E=${precio},
                        BONO_PRECIO_E=${bono},
                        MARGEN_E=${margen}
                    WHERE CODMEDIDA='${codmedida}' AND CODPROD='${codprod}';`
            break;
        case 'F':
            qry = `UPDATE PRECIOS SET 
                        PRECIO_F=${precio},
                        BONO_PRECIO_F=${bono},
                        MARGEN_F=${margen}
                    WHERE CODMEDIDA='${codmedida}' AND CODPROD='${codprod}';`
            break;
    }
   
    
    execute.QueryToken(res,qry,token);
     
});


router.post("/delete_lista_temp_precio", async(req,res)=>{
   
    const {token,sucursal,usuario} = req.body;

   
    let qry = `
    DELETE FROM TEMP_PRECIOS WHERE USUARIO='${usuario}';
    `

    execute.QueryToken(res,qry,token);
     
});

router.post("/delete_temp_precio", async(req,res)=>{
   
    const {token,sucursal,id} = req.body;

   
    let qry = `
    DELETE FROM TEMP_PRECIOS WHERE ID=${id};
    `

    execute.QueryToken(res,qry,token);
     
});

router.post("/lista_precios_temp", async(req,res)=>{
   
    const {token,sucursal,usuario} = req.body;
   
    let qry = `
    SELECT ID,
    CODMEDIDA, EQUIVALE, COSTO,
    PRECIO, PRECIO_A, PRECIO_B, PESO
        FROM 
    TEMP_PRECIOS 
    ;
    `

    //WHERE USUARIO='${usuario}'

    execute.QueryToken(res,qry,token);
     
});

router.post("/insert_temp_precio", async(req,res)=>{
   
    const {token,sucursal,codprod,usuario,codmedida,equivale,peso,costo,preciop,precioa,preciob} = req.body;
    const p = Number(preciop) || 0;
    const pa = Number(precioa) || 0;
    const pb = Number(preciob) || 0;
    const eq = Number(equivale) || 0;
    const cst = Number(costo) || 0;
    const pe = Number(peso) || 0;
    const med = String(codmedida == null ? '' : codmedida).replace(/'/g, "''");
    const prod = String(codprod == null ? '' : codprod).replace(/'/g, "''");
    const usr = String(usuario == null ? '' : usuario).replace(/'/g, "''");

    let qry = `
    INSERT INTO TEMP_PRECIOS 
    (CODPROD,CODMEDIDA,EQUIVALE,COSTO,
    PRECIO,PRECIO_A,PRECIO_B,PRECIO_C,PRECIO_D,PRECIO_E,PRECIO_F,PESO,USUARIO) 
    VALUES 
    ('${prod}','${med}',${eq},${cst},
    ${p},${pa},${pb},0,0,0,0,${pe},'${usr}');
    `
    
    execute.QueryToken(res,qry,token);
     
});




router.post("/verify_codprod", async(req,res)=>{
   
    const { token, sucursal, codprod } = req.body;

    let qry = `
        SELECT CODPROD, DESPROD 
            FROM PRODUCTOS 
            WHERE CODPROD='${codprod}';
    `
    
  
    execute.QueryToken(res,qry,token);
     
});


router.post("/edit_producto", async(req,res)=>{

    const {token,sucursal,codprod,codprod2,
        desprod,desprod2,desprod3,uxc,costo,
        codmarca,lastupdate,tipoprod,exento,nf, bono,
        tipolaboratorio,tipoimpulso,tipoprogramasalud,tipormmr,tiporelleno,tiporentabilidad,tipotipo} = req.body;

    let qry = `
    UPDATE PRODUCTOS SET 
        CODPROD2='${codprod2}',
        DESPROD='${desprod}',
        DESPROD2='${desprod2}',
        DESPROD3='${desprod3}',
        UXC=${uxc},
        COSTO_ULTIMO=${costo},
        CODMARCA=${codmarca},
        CLASIF_BI=${tiporentabilidad},
        CLASIF_TIPO=${tipotipo},
        CLASIF_LABORATORIO=${tipolaboratorio},
        CLASIF_IMPULSO=${tipoimpulso},
        CLASIF_PROGRAMA_SALUD=${tipoprogramasalud},
        CLASIF_RM_MR=${tipormmr},
        CLASIF_RELLENO=${tiporelleno},
        EXENTO=${exento},
        NF=${nf},
        BONO=${bono},
        TIPOPROD='${tipoprod}',
        LASTUPDATE='${lastupdate}'
    WHERE CODPROD='${codprod}';
    `
    

    execute.QueryToken(res,qry,token);
     
});

router.post("/datos_producto", async(req,res)=>{
   
    const { token, sucursal, codprod } = req.body;

    let qry = `
        SELECT * FROM PRODUCTOS
        WHERE (CODPROD='${codprod}')
        `
  
    execute.QueryToken(res,qry,token);
     
});

router.post("/verify_codprod_movimientos", async(req,res)=>{
   
    const { token, sucursal, codprod } = req.body;

    let qry = `
        SELECT TOP 1 CODPROD 
            FROM DOCPRODUCTOS 
            WHERE EMPNIT='${sucursal}' AND CODPROD='${codprod}';
            `
    
  
    execute.QueryToken(res,qry,token);
     
});

router.post("/desactivar_producto", async(req,res)=>{
   
    const { token, sucursal, codprod, status } = req.body;

    let st = status=='SI' ? 'NO' : 'SI';

    //if(status=='SI'){st='NO'}else{st='SI'};



    let qry = `
        UPDATE PRODUCTOS
            SET HABILITADO='${st}' 
            WHERE CODPROD='${codprod}';
            `
    
  
    execute.QueryToken(res,qry,token);
     
});


router.post("/delete_producto", async(req,res)=>{
   
    const {token,sucursal,codprod} = req.body;

    let qry = `
    DELETE FROM PRODUCTOS WHERE CODPROD='${codprod}';
    DELETE FROM PRECIOS WHERE CODPROD='${codprod}';
    DELETE FROM INVSALDO WHERE CODPROD='${codprod}';
    IF OBJECT_ID('dbo.INV_STOCK', 'U') IS NOT NULL
        DELETE FROM INV_STOCK WHERE CODPROD='${codprod}';
    `

    execute.QueryToken(res,qry,token);
     
});

router.post("/insert_precio", async(req,res)=>{
   
    const {token,sucursal,codprod,codmedida,equivale,peso,costo,preciop,precioa,preciob,lastupdate} = req.body;
    const p = Number(preciop) || 0;
    const pa = Number(precioa) || 0;
    const pb = Number(preciob) || 0;
    const eq = Number(equivale) || 0;
    const cst = Number(costo) || 0;
    const pe = Number(peso) || 0;
    const med = String(codmedida == null ? '' : codmedida).replace(/'/g, "''");
    const prod = String(codprod == null ? '' : codprod).replace(/'/g, "''");
    const lu = String(lastupdate == null ? '' : lastupdate).replace(/'/g, "''");

    let qry = `
    INSERT INTO PRECIOS 
    (CODPROD,CODMEDIDA,EQUIVALE,COSTO,PRECIO,PRECIO_A,PRECIO_B,PRECIO_C,PRECIO_D,PRECIO_E,PRECIO_F,PESO,LASTUPDATE,HABILITADO) 
    VALUES 
    ('${prod}','${med}',${eq},${cst},${p},${pa},${pb},
    0,0,0,0,${pe},'${lu}','SI');
    `
   
    execute.QueryToken(res,qry,token);
     
});



router.post("/listado", async(req,res)=>{
   
    const { token, sucursal, filtro, habilitado } = req.body;

    let qry = `
        SELECT        TOP (70) PRODUCTOS.CODPROD, PRODUCTOS.CODPROD2, PRODUCTOS.DESPROD, PRODUCTOS.DESPROD2, PRODUCTOS.DESPROD3, PRODUCTOS.UXC, PRODUCTOS.COSTO_ULTIMO AS COSTO, 
                         PRODUCTOS.COSTO_ANTERIOR, PRODUCTOS.CODMARCA, MARCAS.DESMARCA, PRODUCTOS.TIPOPROD, ISNULL(PRODUCTOS.LASTUPDATE, '2020-01-01') AS LASTUPDATE, PRODUCTOS.HABILITADO, PRODUCTOS.BONO, 
                         CLASIFICACIONES_GENERALES.DESCRIPCION AS DESTIPO
FROM            PRODUCTOS INNER JOIN
                         CLASIFICACIONES_GENERALES ON PRODUCTOS.CLASIF_TIPO = CLASIFICACIONES_GENERALES.CODIGO LEFT OUTER JOIN
                         MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA
        WHERE (PRODUCTOS.CODPROD='${filtro}') 
            AND (PRODUCTOS.HABILITADO='${habilitado}')
            OR
            (PRODUCTOS.DESPROD LIKE '%${filtro}%') 
            AND (PRODUCTOS.HABILITADO='${habilitado}')
        ORDER BY PRODUCTOS.CODPROD
    `
  
    

    execute.QueryToken(res,qry,token);
     
});
router.post("/listado_filtro", async(req,res)=>{
   
    const { token, sucursal, filtro, habilitado, codmarca } = req.body;

    let qry = '';

    if(codmarca.toString()=='0'){
     qry = `
        SELECT   TOP (70) PRODUCTOS.CODPROD, PRODUCTOS.CODPROD2, PRODUCTOS.DESPROD, PRODUCTOS.DESPROD2, PRODUCTOS.DESPROD3, PRODUCTOS.UXC, PRODUCTOS.COSTO_ULTIMO AS COSTO, 
                         PRODUCTOS.COSTO_ANTERIOR, PRODUCTOS.CODMARCA, MARCAS.DESMARCA, PRODUCTOS.TIPOPROD, ISNULL(PRODUCTOS.LASTUPDATE, '2020-01-01') AS LASTUPDATE, PRODUCTOS.HABILITADO, PRODUCTOS.BONO, 
                         CLASIFICACIONES_GENERALES.DESCRIPCION AS DESTIPO
FROM            PRODUCTOS INNER JOIN
                         CLASIFICACIONES_GENERALES ON PRODUCTOS.CLASIF_TIPO = CLASIFICACIONES_GENERALES.CODIGO LEFT OUTER JOIN
                         MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA
        WHERE (PRODUCTOS.CODPROD='${filtro}') 
            AND (PRODUCTOS.HABILITADO='${habilitado}')
            OR
            (PRODUCTOS.DESPROD LIKE '%${filtro}%') 
            AND (PRODUCTOS.HABILITADO='${habilitado}')
        ORDER BY PRODUCTOS.CODPROD
    `
    }else{
         qry = `
        SELECT   TOP (70) PRODUCTOS.CODPROD, PRODUCTOS.CODPROD2, PRODUCTOS.DESPROD, PRODUCTOS.DESPROD2, PRODUCTOS.DESPROD3, PRODUCTOS.UXC, PRODUCTOS.COSTO_ULTIMO AS COSTO, 
                         PRODUCTOS.COSTO_ANTERIOR, PRODUCTOS.CODMARCA, MARCAS.DESMARCA, PRODUCTOS.TIPOPROD, ISNULL(PRODUCTOS.LASTUPDATE, '2020-01-01') AS LASTUPDATE, PRODUCTOS.HABILITADO, PRODUCTOS.BONO, 
                         CLASIFICACIONES_GENERALES.DESCRIPCION AS DESTIPO
FROM            PRODUCTOS INNER JOIN
                         CLASIFICACIONES_GENERALES ON PRODUCTOS.CLASIF_TIPO = CLASIFICACIONES_GENERALES.CODIGO LEFT OUTER JOIN
                         MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA
        WHERE (PRODUCTOS.CODPROD='${filtro}') 
            AND (PRODUCTOS.HABILITADO='${habilitado}')
            OR
            (PRODUCTOS.DESPROD LIKE '%${filtro}%') 
            AND (PRODUCTOS.HABILITADO='${habilitado}')
            AND (PRODUCTOS.CODMARCA = ${codmarca})
        ORDER BY PRODUCTOS.CODPROD
    `
    }


    
  
    

    execute.QueryToken(res,qry,token);
     
});

router.post("/listado_export", async(req,res)=>{
   
    const { token, sucursal, habilitado } = req.body;

    let qry = `
        SELECT PRODUCTOS.CODPROD, PRODUCTOS.CODPROD2,
            PRODUCTOS.DESPROD, PRODUCTOS.DESPROD2, PRODUCTOS.DESPROD3, 
            PRODUCTOS.UXC, 
            PRODUCTOS.COSTO_ULTIMO AS COSTO,
            PRODUCTOS.COSTO_ANTERIOR, 
            PRODUCTOS.CODMARCA, MARCAS.DESMARCA, 
            PRODUCTOS.TIPOPROD, 
            ISNULL(PRODUCTOS.LASTUPDATE,'2020-01-01') AS LASTUPDATE, 
            PRODUCTOS.HABILITADO,
            PRODUCTOS.BONO
        FROM PRODUCTOS LEFT OUTER JOIN
        MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA
        ORDER BY PRODUCTOS.CODPROD
    `
  
    

    execute.QueryToken(res,qry,token);
     
});


router.post("/listado_oferta", async(req,res)=>{

    const { token, clasif } = req.body || {};
    const cod = Number(clasif) || 0;
    if (!cod) {
        res.send('error');
        return;
    }

    const qry = `
        SELECT
            PRODUCTOS.CODPROD,
            PRODUCTOS.DESPROD,
            ISNULL(MARCAS.DESMARCA,'') AS DESMARCA
        FROM PRODUCTOS
        LEFT OUTER JOIN MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA
        WHERE PRODUCTOS.CLASIF_LABORATORIO = ${cod}
        ORDER BY PRODUCTOS.DESPROD
    `;

    execute.QueryToken(res, qry, token);

});


router.post("/get_cantidad_productos", async(req,res)=>{
   
    const { token, sucursal,  habilitado } = req.body;

    let qry = `
        SELECT  COUNT(CODPROD) AS CONTEO
            FROM PRODUCTOS
        WHERE (HABILITADO = '${habilitado}')
    `
  
    execute.QueryToken(res,qry,token);
     
});


router.post("/lista_precios", async(req,res)=>{
   
    const {token,sucursal,codprod} = req.body;

   
    let qry = `
    SELECT ID,  
    CODPROD,CODMEDIDA,EQUIVALE,
    COSTO, ISNULL(COSTO_PROMEDIO,COSTO) AS COSTO_PROMEDIO,
    PRECIO, ISNULL(MARGEN,0) AS MARGEN, ISNULL(BONO_PRECIO,0) AS BONOPRECIO,
    PRECIO_A, ISNULL(MARGEN_A,0) AS MARGENA, ISNULL(BONO_PRECIO_A,0) AS BONOPRECIOA,
    PRECIO_B, ISNULL(MARGEN_B,0) AS MARGENB, ISNULL(BONO_PRECIO_B,0) AS BONOPRECIOB,
    PRECIO_C, ISNULL(MARGEN_C,0) AS MARGENC, ISNULL(BONO_PRECIO_C,0) AS BONOPRECIOC,
    PRECIO_D, ISNULL(MARGEN_D,0) AS MARGEND, ISNULL(BONO_PRECIO_D,0) AS BONOPRECIOD,
    PRECIO_E, ISNULL(MARGEN_E,0) AS MARGENE, ISNULL(BONO_PRECIO_E,0) AS BONOPRECIOE,
    PRECIO_F, ISNULL(MARGEN_F,0) AS MARGENF, ISNULL(BONO_PRECIO_F,0) AS BONOPRECIOF,
	ISNULL(MAYORISTA,0) AS MAYORISTA, ISNULL(CRITERIO_MAYORISTA,0) AS CRITERIO_MAYORISTA,
    PESO,
    LASTUPDATE,
    ISNULL(HABILITADO,'SI') AS HABILITADO
    FROM
    PRECIOS WHERE CODPROD='${codprod}';
    `

    execute.QueryToken(res,qry,token);
     
});

router.post("/delete_precio", async(req,res)=>{
   
    const {token,sucursal,id} = req.body;

   
    let qry = `
    DELETE FROM PRECIOS WHERE ID=${id};
    `

    execute.QueryToken(res,qry,token);
     
});
router.post("/habilitar_precio", async(req,res)=>{
   
    const {token,sucursal,codprod,id,st} = req.body;

   
    let qry = `
    UPDATE PRECIOS SET HABILITADO='${st}' 
    WHERE ID=${id} AND CODPROD='${codprod}';
    `

    execute.QueryToken(res,qry,token);
     
});
router.post("/lista_precios_deshabilitados", async(req,res)=>{
   
    const {token,codprod} = req.body;

   
    let qry = `
        SELECT 
            EMPRESAS.EMPNIT,
            EMPRESAS.NOMBRE AS EMPRESA, 
            T.CODPROD, 
            T.CODMEDIDA_DESHABILITADA 
        FROM EMPRESAS INNER JOIN 
            (SELECT EMPNIT,CODPROD,
            ISNULL(CODMEDIDA_DESHABILITADA,'') AS CODMEDIDA_DESHABILITADA 
            FROM INVSALDO WHERE CODPROD='${codprod}') T 
            ON EMPRESAS.EMPNIT=T.EMPNIT;
        `

    execute.QueryToken(res,qry,token);
     
});
router.post("/habilitar_codmedida_empresa", async(req,res)=>{
   
    const {token,sucursal,codprod,codmedida} = req.body;
   
    let qry = `
    UPDATE INVSALDO 
        SET CODMEDIDA_DESHABILITADA='${codmedida}' 
    WHERE EMPNIT='${sucursal}' AND CODPROD='${codprod}';
    `

    execute.QueryToken(res,qry,token);
     
});









router.post("/listado_medidas", async(req,res)=>{
   
    const { token, sucursal } = req.body;

    let qry = `
        SET NOCOUNT ON;
        IF NOT EXISTS (
            SELECT 1 FROM MEDIDAS
            WHERE UPPER(LTRIM(RTRIM(CODMEDIDA))) = 'BONI'
        )
        BEGIN
            INSERT INTO MEDIDAS (CODMEDIDA, DESMEDIDA) VALUES ('BONI', 'BONIFICACION');
        END
        SELECT CODMEDIDA, DESMEDIDA FROM MEDIDAS
        ORDER BY CASE WHEN UPPER(LTRIM(RTRIM(CODMEDIDA))) = 'BONI' THEN 0 ELSE 1 END, CODMEDIDA
    `
    
  
    execute.QueryToken(res,qry,token);
     
});

router.post("/insert_medida", async(req,res)=>{
   
    const {token,sucursal,codigo,descripcion} = req.body;
    const cod = String(codigo == null ? '' : codigo).trim().toUpperCase();
    if (cod === 'BONI') {
        return res.send({ error: 'La medida BONI es fija y no se puede crear ni modificar', rowsAffected: [0], recordset: [] });
    }

   
    let qry = `
    INSERT INTO MEDIDAS (CODMEDIDA,DESMEDIDA) 
    VALUES ('${codigo}','${descripcion}');
    `

    execute.QueryToken(res,qry,token);
     
});


router.post("/delete_medida", async(req,res)=>{
   
    const {token,sucursal,codmedida} = req.body;
    if (String(codmedida == null ? '' : codmedida).trim().toUpperCase() === 'BONI') {
        return res.send({ error: 'La medida BONI es fija y no se puede eliminar', rowsAffected: [0], recordset: [] });
    }

   
    let qry = `
    DELETE FROM MEDIDAS 
    WHERE CODMEDIDA='${codmedida}'
      AND UPPER(LTRIM(RTRIM(CODMEDIDA))) <> 'BONI';
    `

    execute.QueryToken(res,qry,token);
     
});


router.post("/listado_marcas", async(req,res)=>{
   
    const { token, sucursal } = req.body;

    let qry = `
        SELECT CODMARCA, DESMARCA 
        FROM MARCAS 
        ORDER BY DESMARCA;
    `
    
  
    execute.QueryToken(res,qry,token);
     
});

router.post("/insert_marca", async(req,res)=>{
   
    const {token,sucursal,codmarca,desmarca} = req.body;

   
    let qry = `
    INSERT INTO MARCAS (CODMARCA,DESMARCA,PORCENTAJE,OBJETIVO) VALUES (${codmarca},'${desmarca}',0,0);
    `

    let qryxxx = `
    INSERT INTO MARCAS (CODMARCA,DESMARCA,PORCENTAJE) VALUES (${codmarca},'${desmarca}',0);
    `

    execute.QueryToken(res,qry,token);
     
});

router.post("/listado_claseuno", async(req,res)=>{
   
    const { token, sucursal } = req.body;

    let qry = `
        SELECT CODCLAUNO, DESCLAUNO FROM CLASIFICACIONUNO  
        ORDER BY DESCLAUNO;
    `
    
  
    execute.QueryToken(res,qry,token);
     
});

router.post("/insert_claseuno", async(req,res)=>{
   
    const {token,sucursal,codigo,descripcion} = req.body;

   
    let qry = `
    INSERT INTO CLASIFICACIONUNO (CODCLAUNO,DESCLAUNO) 
    VALUES (${codigo},'${descripcion}');
    `

    execute.QueryToken(res,qry,token);
     
});




router.post("/listado_proveedores", async(req,res)=>{
   
    const { token, sucursal } = req.body;

    let qry = `
        SELECT CODPROV, EMPRESA FROM PROVEEDORES  
        ORDER BY EMPRESA;
    `
    
  
    execute.QueryToken(res,qry,token);
     
});

router.post("/insert_proveedor", async(req,res)=>{
   
    const {token,sucursal,codigo,descripcion} = req.body;

   
    let qry = `
    INSERT INTO PROVEEDORES (EMPRESA,RAZONSOCIAL,DIRECCION,TELEMPRESA,CONTACTO,TELCONTACTO,NIT,SALDO) 
    VALUES ('${descripcion}','${descripcion}','CIUDAD','000','SN','SN','CF',0);
    `

    execute.QueryToken(res,qry,token);
     
});




router.post("/listado_clasedos", async(req,res)=>{
   
    const { token, sucursal } = req.body;

    let qry = `
        SELECT CODCLADOS, DESCLADOS FROM CLASIFICACIONDOS  
        ORDER BY DESCLADOS;
    `
    
  
    execute.QueryToken(res,qry,token);
     
});





module.exports = router;