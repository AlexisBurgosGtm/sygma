'use strict';

const fs = require('fs');
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

const ddl = fs.readFileSync(
    path.join(__dirname, '..', 'sql', 'CONCURSOS_OBJETIVOS_PRODUCTOS.sql'),
    'utf8'
);

sql.connect(config)
    .then((pool) => pool.request().query(ddl))
    .then(() => {
        console.log('CONCURSOS_OBJETIVOS_PRODUCTOS OK');
        process.exit(0);
    })
    .catch((e) => {
        console.error(e && e.message ? e.message : e);
        process.exit(1);
    });
