/*
  STOCK2 — Inventario materializado (paralelo a STOCK1 = view_invsaldo)

  Este script es referencia. En runtime SYGMA lo aplica vía:
    POST /inventarios/stock2_ensure
    POST /inventarios/stock2_rebuild

  Lógica de signo: CONFIG_TIPODOCUMENTOS.INV
    1  entrada | -1 salida | 0 no afecta (ej. ENV pedidos)
  Solo documentos STATUS <> 'A'

  Catálogo:
    - Al crear PRODUCTO → fila INV_STOCK (existencia 0) por cada EMPRESA
    - Al eliminar PRODUCTO → se borra INV_STOCK del CODPROD
*/

IF OBJECT_ID('dbo.INV_STOCK', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.INV_STOCK (
        EMPNIT      VARCHAR(50)  NOT NULL,
        CODPROD     VARCHAR(50)  NOT NULL,
        EXISTENCIA  DECIMAL(18, 4) NOT NULL CONSTRAINT DF_INV_STOCK_EXISTENCIA DEFAULT (0),
        LASTUPDATE  DATETIME     NULL,
        CONSTRAINT PK_INV_STOCK PRIMARY KEY CLUSTERED (EMPNIT, CODPROD)
    );
    CREATE NONCLUSTERED INDEX IX_INV_STOCK_CODPROD ON dbo.INV_STOCK (CODPROD);
END
GO
