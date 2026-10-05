const execute = require('./../connection');
const express = require('express');
const router = express.Router();
const bitacora = require('../services/bitacoraEliminaciones');

const OPCION_REASIGN_CLIENTE_PEDIDO = 'VENDEDOR REASIGNAR CLIENTE PEDIDO';

const DDL_SETTINGS_EMPRESA = `
IF OBJECT_ID('dbo.SETTINGS_EMPRESA', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.SETTINGS_EMPRESA (
        EMPNIT VARCHAR(50) NOT NULL,
        OPCION NVARCHAR(120) NOT NULL,
        VALOR NVARCHAR(20) NOT NULL CONSTRAINT DF_SETTINGS_EMPRESA_VALOR DEFAULT ('SI'),
        CONSTRAINT PK_SETTINGS_EMPRESA PRIMARY KEY (EMPNIT, OPCION)
    );
END
`;

function escConfig(val) {
    if (val === null || val === undefined) return '';
    return String(val).replace(/'/g, "''");
}

async function ensureSettingsEmpresa(token) {
    await execute.get_data_qry(DDL_SETTINGS_EMPRESA, token);
}


router.post("/config_generales", async(req,res)=>{

        const {token} = req.body;

        let qry = `
        SELECT ID, DESCRIPCION, VALOR, OBS FROM CONFIG 
        `
    
        execute.QueryToken(res,qry,token)

});

router.post("/update_valor", async(req,res)=>{

        const {token, id, valor} = req.body;
        const idNum = Number(id);
        if (!idNum) {
            res.send('error');
            return;
        }
        const v = String(valor || '').replace(/'/g, "''");
        let qry = `UPDATE CONFIG SET VALOR='${v}' WHERE ID=${idNum}`;
        execute.QueryToken(res,qry,token);

});

router.post("/settings_list", async (req, res) => {
    const { token } = req.body || {};
    try {
        await execute.get_data_qry(`
            IF NOT EXISTS (SELECT 1 FROM SETTINGS WHERE OPCION = N'PERMITE VISTA PESTAÑAS')
                INSERT INTO SETTINGS (OPCION, VALOR) VALUES (N'PERMITE VISTA PESTAÑAS', N'NO');
        `, token);
        await execute.get_data_qry(`
            IF NOT EXISTS (
                SELECT 1 FROM SETTINGS
                WHERE UPPER(LTRIM(RTRIM(OPCION))) = N'APLICA OFERTAS EN VENDEDORES'
            )
                INSERT INTO SETTINGS (OPCION, VALOR) VALUES (N'APLICA OFERTAS EN VENDEDORES', N'NO');
        `, token);
    } catch (e) {
        console.error('[config/settings_list] ensure PERMITE VISTA PESTAÑAS', e && e.message ? e.message : e);
    }
    const qry = `
        SELECT OPCION, VALOR
        FROM SETTINGS
        ORDER BY OPCION
    `;
    execute.QueryToken(res, qry, token);
});

router.post("/settings_update", async (req, res) => {
    const { token, opcion, valor } = req.body || {};
    const opc = String(opcion || '').trim().replace(/'/g, "''");
    const v = String(valor == null ? '' : valor).replace(/'/g, "''");
    if (!opc) {
        res.send('error');
        return;
    }
    const qry = `
        IF EXISTS (SELECT 1 FROM SETTINGS WHERE OPCION='${opc}')
            UPDATE SETTINGS SET VALOR='${v}' WHERE OPCION='${opc}'
        ELSE
            INSERT INTO SETTINGS (OPCION, VALOR) VALUES ('${opc}', '${v}');
    `;
    execute.QueryToken(res, qry, token);
});

/** Por empresa: botón buscar/reasignar cliente en pedido vendedor (default SI). */
router.post('/settings_empresa_reasign_list', async (req, res) => {
    const { token } = req.body || {};
    const opc = escConfig(OPCION_REASIGN_CLIENTE_PEDIDO);
    try {
        await ensureSettingsEmpresa(token);
        const qry = `
            SELECT
                E.EMPNIT,
                E.NOMBRE,
                ISNULL(S.VALOR, 'SI') AS VALOR
            FROM EMPRESAS E
            LEFT JOIN SETTINGS_EMPRESA S
                ON S.EMPNIT = E.EMPNIT
               AND S.OPCION = N'${opc}'
            ORDER BY E.NOMBRE
        `;
        execute.QueryToken(res, qry, token);
    } catch (e) {
        console.error('[config/settings_empresa_reasign_list]', e && e.message ? e.message : e);
        res.send('error');
    }
});

router.post('/settings_empresa_reasign_update', async (req, res) => {
    const { token, empnit, valor } = req.body || {};
    const emp = escConfig(String(empnit || '').trim());
    const v = String(valor || '').trim().toUpperCase() === 'NO' ? 'NO' : 'SI';
    const opc = escConfig(OPCION_REASIGN_CLIENTE_PEDIDO);
    if (!emp) {
        res.send('error');
        return;
    }
    try {
        await ensureSettingsEmpresa(token);
        const qry = `
            IF EXISTS (
                SELECT 1 FROM SETTINGS_EMPRESA
                WHERE EMPNIT = '${emp}' AND OPCION = N'${opc}'
            )
                UPDATE SETTINGS_EMPRESA SET VALOR = '${v}'
                WHERE EMPNIT = '${emp}' AND OPCION = N'${opc}'
            ELSE
                INSERT INTO SETTINGS_EMPRESA (EMPNIT, OPCION, VALOR)
                VALUES ('${emp}', N'${opc}', '${v}');
        `;
        execute.QueryToken(res, qry, token);
    } catch (e) {
        console.error('[config/settings_empresa_reasign_update]', e && e.message ? e.message : e);
        res.send('error');
    }
});

router.post('/bitacora_list', async (req, res) => {
    const { token, mes, anio, buscar } = req.body || {};
    try {
        const data = await bitacora.listarBitacora(token, mes, anio, buscar);
        res.send({ ok: true, mes: data.mes, anio: data.anio, recordset: data.recordset });
    } catch (e) {
        console.error('[config/bitacora_list]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo cargar la bitácora', recordset: [] });
    }
});

router.post('/bitacora_delete', async (req, res) => {
    const { token, id } = req.body || {};
    try {
        const result = await bitacora.eliminarRegistroBitacora(token, id);
        if (!result.ok) {
            res.send({ ok: false, error: result.error || 'No se pudo eliminar' });
            return;
        }
        res.send({ ok: true });
    } catch (e) {
        console.error('[config/bitacora_delete]', e && e.message ? e.message : e);
        res.send({ ok: false, error: 'No se pudo eliminar el registro' });
    }
});

module.exports = router;
