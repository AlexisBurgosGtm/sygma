const execute = require('./../connection');
const express = require('express');
const router = express.Router();


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
        PRECIO_D, PRECIO_E, PRECIO_F, PESO, LASTUPDATE)
    SELECT '${codprod}' AS CODPROD, CODMEDIDA, 
        EQUIVALE, COSTO, 
        PRECIO, PRECIO_A, PRECIO_B, PRECIO_C, 
        PRECIO_D, PRECIO_E, PRECIO_F,
        PESO, '${lastupdate}' AS LASTUPDATE
    FROM TEMP_PRECIOS;
    INSERT INTO INVSALDO (EMPNIT, CODPROD,
        ENTRADAS, SALIDAS,
        EXISTENCIA, FISICO,
        CODBODEGA, NOLOTE,
        MINIMO, MAXIMO) SELECT EMPNIT, '${codprod}' AS CODPROD,
	    0 AS ENTRADAS, 0 AS SALIDAS,
	    0 AS EXISTENCIA, 0 AS FISICO,
	    1 AS CODBODEGA, '' AS NOLOTE,
	    0 AS MINIMO, 0 AS MAXIMO
    FROM EMPRESAS; 
    `


    execute.QueryToken(res,qry,token);
     
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
    PRECIO, PRECIO_A, PRECIO_B, 
    PRECIO_C, PRECIO_D, PRECIO_E, PRECIO_F, PESO
        FROM 
    TEMP_PRECIOS 
    ;
    `

    //WHERE USUARIO='${usuario}'

    execute.QueryToken(res,qry,token);
     
});

router.post("/insert_temp_precio", async(req,res)=>{
   
    const {token,sucursal,codprod,usuario,codmedida,equivale,peso,costo,preciop,precioa,preciob,precioc,preciod,precioe,preciof} = req.body;

 

    let qry = `
    INSERT INTO TEMP_PRECIOS 
    (CODPROD,CODMEDIDA,EQUIVALE,COSTO,
    PRECIO,PRECIO_A,PRECIO_B,PRECIO_C,PRECIO_D,PRECIO_E,PRECIO_F,PESO,USUARIO) 
    VALUES 
    ('${codprod}','${codmedida}',${equivale},${costo},
    ${preciop},${precioa},${preciob},${precioc},${preciod},${precioe},${preciof},${peso},'${usuario}');
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
    `

    execute.QueryToken(res,qry,token);
     
});

router.post("/insert_precio", async(req,res)=>{
   
    const {token,sucursal,codprod,codmedida,equivale,peso,costo,preciop,precioa,preciob,precioc,preciod,precioe,preciof,lastupdate} = req.body;

    let qry = `
    INSERT INTO PRECIOS 
    (CODPROD,CODMEDIDA,EQUIVALE,COSTO,PRECIO,PRECIO_A,PRECIO_B,PRECIO_C,PRECIO_D,PRECIO_E,PRECIO_F,PESO,LASTUPDATE) 
    VALUES 
    ('${codprod}','${codmedida}',${equivale},${costo},${preciop},${precioa},${preciob},
    ${precioc},${preciod},${precioe},${preciof},${peso},'${lastupdate}');
    `
   
    execute.QueryToken(res,qry,token);
     
});



router.post("/listado", async(req,res)=>{
   
    const { token, sucursal, filtro, habilitado } = req.body;

    let qry = `
        SELECT TOP 50 PRODUCTOS.CODPROD, PRODUCTOS.CODPROD2,
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
        WHERE (PRODUCTOS.CODPROD='${filtro}') 
            AND (PRODUCTOS.HABILITADO='${habilitado}')
            OR
            (PRODUCTOS.DESPROD LIKE '%${filtro}%') 
            AND (PRODUCTOS.HABILITADO='${habilitado}')
        ORDER BY PRODUCTOS.DESPROD
    `
  
    

    execute.QueryToken(res,qry,token);
     
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
    LASTUPDATE
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






router.post("/listado_medidas", async(req,res)=>{
   
    const { token, sucursal } = req.body;

    let qry = `
        SELECT CODMEDIDA, DESMEDIDA FROM MEDIDAS  
    `
    
  
    execute.QueryToken(res,qry,token);
     
});
router.post("/insert_medida", async(req,res)=>{
   
    const {token,sucursal,codigo,descripcion} = req.body;

   
    let qry = `
    INSERT INTO MEDIDAS (CODMEDIDA,DESMEDIDA) 
    VALUES ('${codigo}','${descripcion}');
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