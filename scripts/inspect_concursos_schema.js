'use strict';
const path = require('path');
const sql = require('mssql');
process.loadEnvFile(path.join(__dirname, '..', '.env'));
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    server: process.env.DB_HOST,
    database: process.env.DB_DB,
    options: { encrypt: false, trustServerCertificate: true }
};
sql.connect(config)
    .then((pool) =>
        pool.request().query(`
SELECT t.name AS tbl, c.name AS col
FROM sys.columns c
JOIN sys.tables t ON t.object_id = c.object_id
WHERE t.name IN ('CONCURSOS','CONCURSOS_OBJETIVOS','CONCURSOS_OBJETIVOS_PRODUCTOS','CONCURSOS_PRODUCTOS')
ORDER BY t.name, c.column_id
`)
    )
    .then((r) => {
        console.log(JSON.stringify(r.recordset, null, 2));
        process.exit(0);
    })
    .catch((e) => {
        console.error(e.message);
        process.exit(1);
    });
