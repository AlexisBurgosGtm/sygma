const execute = require('./../connection');
const express = require('express');
const router = express.Router();


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





module.exports = router;
