const execute = require('../connection');

const DDL_DOCPRODUCTOS_DESC1 = `
IF COL_LENGTH('dbo.DOCPRODUCTOS', 'DESC1') IS NULL
BEGIN
    EXEC('ALTER TABLE dbo.DOCPRODUCTOS ADD DESC1 DECIMAL(18,4) NOT NULL CONSTRAINT DF_DOCPRODUCTOS_DESC1 DEFAULT (0)');
END
`;
const DDL_DOCPRODUCTOS_DESC2 = `
IF COL_LENGTH('dbo.DOCPRODUCTOS', 'DESC2') IS NULL
BEGIN
    EXEC('ALTER TABLE dbo.DOCPRODUCTOS ADD DESC2 DECIMAL(18,4) NOT NULL CONSTRAINT DF_DOCPRODUCTOS_DESC2 DEFAULT (0)');
END
`;
const DDL_DOCPRODUCTOS_DESC3 = `
IF COL_LENGTH('dbo.DOCPRODUCTOS', 'DESC3') IS NULL
BEGIN
    EXEC('ALTER TABLE dbo.DOCPRODUCTOS ADD DESC3 DECIMAL(18,4) NOT NULL CONSTRAINT DF_DOCPRODUCTOS_DESC3 DEFAULT (0)');
END
`;
const DDL_DOCPRODUCTOS_CODOFERTA = `
IF COL_LENGTH('dbo.DOCPRODUCTOS', 'CODOFERTA') IS NULL
BEGIN
    EXEC('ALTER TABLE dbo.DOCPRODUCTOS ADD CODOFERTA INT NOT NULL CONSTRAINT DF_DOCPRODUCTOS_CODOFERTA DEFAULT (0)');
END
`;

let docproductosColumnsReady = null;

function ensureDocproductosDesc123(token) {
    if (!docproductosColumnsReady) {
        docproductosColumnsReady = Promise.all([
            execute.get_data_qry(DDL_DOCPRODUCTOS_DESC1, token),
            execute.get_data_qry(DDL_DOCPRODUCTOS_DESC2, token),
            execute.get_data_qry(DDL_DOCPRODUCTOS_DESC3, token),
            execute.get_data_qry(DDL_DOCPRODUCTOS_CODOFERTA, token)
        ]).catch((err) => {
            docproductosColumnsReady = null;
            throw err;
        });
    }
    return docproductosColumnsReady;
}

module.exports = { ensureDocproductosDesc123 };
