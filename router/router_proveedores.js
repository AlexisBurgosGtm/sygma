const execute = require('../connection');
const express = require('express');
const router = express.Router();

function esc(val) {
    if (val === null || val === undefined) return '';
    return String(val).replace(/'/g, "''");
}

router.post("/buscar_proveedor", async (req, res) => {
    const { token, sucursal, filtro } = req.body;
    const f = esc(filtro);

    let qry = `
        SELECT CODPROV AS CODCLIENTE, NIT, EMPRESA AS NOMBRE, RAZONSOCIAL, DIRECCION, TELEMPRESA AS TELEFONO, SALDO, TIPO_ORD_EXT AS TIPO
        FROM PROVEEDORES
        WHERE (EMPRESA LIKE '%${f}%') OR (NIT='${f}')
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/buscar_proveedor_nit", async (req, res) => {
    const { token, sucursal, nit } = req.body;

    let qry = `
        SELECT CODPROV AS CODCLIENTE, NIT, EMPRESA AS NOMBRE, RAZONSOCIAL, DIRECCION, TELEMPRESA AS TELEFONO, SALDO, TIPO_ORD_EXT AS TIPO
        FROM PROVEEDORES
        WHERE NIT='${esc(nit)}'
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/listado", async (req, res) => {
    const { token } = req.body;

    let qry = `
        SELECT CODPROV, NIT, EMPRESA, RAZONSOCIAL, DIRECCION, TELEMPRESA, CONTACTO, TELCONTACTO, SALDO, TIPO_ORD_EXT
        FROM PROVEEDORES
        ORDER BY EMPRESA
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/insert", async (req, res) => {
    const { token, empresa, razonsocial, direccion, telempresa, contacto, telcontacto, nit, saldo, tipo_ord_ext } = req.body;

    let qry = `
        INSERT INTO PROVEEDORES (EMPRESA, RAZONSOCIAL, DIRECCION, TELEMPRESA, CONTACTO, TELCONTACTO, NIT, SALDO, TIPO_ORD_EXT)
        VALUES (
            '${esc(empresa)}',
            '${esc(razonsocial || empresa)}',
            '${esc(direccion || '')}',
            '${esc(telempresa || '')}',
            '${esc(contacto || 'SN')}',
            '${esc(telcontacto || '')}',
            '${esc(nit || 'CF')}',
            ${Number(saldo) || 0},
            '${esc(tipo_ord_ext || '')}'
        );
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/update", async (req, res) => {
    const { token, codprov, empresa, razonsocial, direccion, telempresa, contacto, telcontacto, nit, saldo, tipo_ord_ext } = req.body;

    let qry = `
        UPDATE PROVEEDORES SET
            EMPRESA = '${esc(empresa)}',
            RAZONSOCIAL = '${esc(razonsocial)}',
            DIRECCION = '${esc(direccion)}',
            TELEMPRESA = '${esc(telempresa)}',
            CONTACTO = '${esc(contacto)}',
            TELCONTACTO = '${esc(telcontacto)}',
            NIT = '${esc(nit)}',
            SALDO = ${Number(saldo) || 0},
            TIPO_ORD_EXT = '${esc(tipo_ord_ext)}'
        WHERE CODPROV = ${Number(codprov)}
    `;

    execute.QueryToken(res, qry, token);
});

router.post("/delete", async (req, res) => {
    const { token, codprov } = req.body;

    let qry = `
        DELETE FROM PROVEEDORES
        WHERE CODPROV = ${Number(codprov)}
    `;

    execute.QueryToken(res, qry, token);
});

module.exports = router;
