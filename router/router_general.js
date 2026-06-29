const execute = require('./../connection');
const express = require('express');
const router = express.Router();


router.post("/login", async(req,res)=>{
   
    const { u,p,TOKEN } = req.body;

    let qry = `
        SELECT 
            USUARIO, 
            'LOCAL' AS TOKEN, 
            NIVEL
        FROM USUARIOS
        WHERE (USUARIO = '${u}') 
            AND (WEBPASS = '${p}')`
    
    execute.QueryToken(res,qry,TOKEN);
     
});


function esc(val) {
    if (val === null || val === undefined) return '';
    return String(val).replace(/'/g, "''");
}

router.post("/empresas", async(req,res)=>{
   
    const { TOKEN} = req.body;

    let qry = `
        SELECT 
            EMPNIT,NOMBRE,CODTIPOEMPRESA,TIPO_PRECIO,OBJETIVO_VENTAS,OBJETIVO_RENTABILIDAD 
        FROM EMPRESAS
         `
         //   WHERE NOSUCURSAL='SI';
    
    execute.QueryToken(res,qry,TOKEN);
     
});

router.post("/empresas_listado", async (req, res) => {
    const { TOKEN } = req.body;

    let qry = `
        SELECT
            EMPNIT,
            NOMBRE,
            ISNULL(DIRECCION, '') AS DIRECCION,
            ISNULL(TIPO_PRECIO, '') AS TIPO_PRECIO,
            ISNULL(OBJETIVO_VENTAS, 0) AS OBJETIVO_VENTAS,
            ISNULL(OBJETIVO_RENTABILIDAD, 0) AS OBJETIVO_RENTABILIDAD,
            ISNULL(CLAVE, '') AS CLAVE
        FROM EMPRESAS
        ORDER BY NOMBRE
    `;

    execute.QueryToken(res, qry, TOKEN);
});

router.post("/empresa_update", async (req, res) => {
    const {
        TOKEN,
        empnit,
        nombre,
        direccion,
        tipo_precio,
        objetivo_ventas,
        objetivo_rentabilidad,
        clave
    } = req.body;

    let qry = `
        UPDATE EMPRESAS SET
            NOMBRE = '${esc(nombre)}',
            DIRECCION = '${esc(direccion)}',
            TIPO_PRECIO = '${esc(tipo_precio)}',
            OBJETIVO_VENTAS = ${Number(objetivo_ventas) || 0},
            OBJETIVO_RENTABILIDAD = ${Number(objetivo_rentabilidad) || 0},
            CLAVE = '${esc(clave || '')}'
        WHERE EMPNIT = '${esc(empnit)}'
    `;

    execute.QueryToken(res, qry, TOKEN);
});

router.post("/empresa_verificar_clave", async (req, res) => {
    const { TOKEN, empnit, clave } = req.body;
    const emp = esc(empnit);
    const clv = esc(clave || '');

    let qry = `
        SELECT COUNT(*) AS OK
        FROM EMPRESAS
        WHERE EMPNIT = '${emp}'
            AND ISNULL(CLAVE, '') = '${clv}'
    `;

    execute.QueryToken(res, qry, TOKEN);
});

router.post("/empresa_delete", async (req, res) => {
    const { TOKEN, empnit } = req.body;
    const emp = esc(empnit);

    let qry = `
        IF (
            (SELECT COUNT(*) FROM DOCUMENTOS WHERE EMPNIT = '${emp}') = 0
            AND (SELECT COUNT(*) FROM EMPLEADOS WHERE EMPNIT = '${emp}') = 0
            AND (SELECT COUNT(*) FROM CLIENTES WHERE EMPNIT = '${emp}') = 0
        )
        BEGIN
            DELETE FROM EMPRESAS WHERE EMPNIT = '${emp}';
        END
    `;

    execute.QueryToken(res, qry, TOKEN);
});

module.exports = router;