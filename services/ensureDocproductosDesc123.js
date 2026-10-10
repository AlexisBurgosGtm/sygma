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

let docproductosDesc123Ready = null;

function ensureDocproductosDesc123(token) {
    if (!docproductosDesc123Ready) {
        docproductosDesc123Ready = Promise.all([
            execute.get_data_qry(DDL_DOCPRODUCTOS_DESC1, token),
            execute.get_data_qry(DDL_DOCPRODUCTOS_DESC2, token),
            execute.get_data_qry(DDL_DOCPRODUCTOS_DESC3, token)
        ]).catch((err) => {
            docproductosDesc123Ready = null;
            throw err;
        });
    }
    return docproductosDesc123Ready;
}

module.exports = { ensureDocproductosDesc123 };
