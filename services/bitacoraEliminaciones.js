const execute = require('../connection');

const DDL_BITACORA_ELIMINACIONES = `
IF OBJECT_ID('dbo.BITACORA_ELIMINACIONES', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.BITACORA_ELIMINACIONES (
        ID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        FECHA_HORA DATETIME NOT NULL CONSTRAINT DF_BITACORA_ELIM_FECHA DEFAULT (GETDATE()),
        FECHA AS (CONVERT(date, FECHA_HORA)) PERSISTED,
        HORA AS (CONVERT(time(0), FECHA_HORA)) PERSISTED,
        EMPNIT VARCHAR(50) NULL,
        USUARIO NVARCHAR(120) NOT NULL CONSTRAINT DF_BITACORA_ELIM_USR DEFAULT (N''),
        MODULO NVARCHAR(80) NOT NULL,
        DETALLE NVARCHAR(MAX) NOT NULL
    );
    CREATE INDEX IX_BITACORA_ELIM_FECHA ON dbo.BITACORA_ELIMINACIONES (FECHA_HORA DESC);
    CREATE INDEX IX_BITACORA_ELIM_MODULO ON dbo.BITACORA_ELIMINACIONES (MODULO, FECHA_HORA DESC);
END
`;

function escSql(val) {
    if (val === null || val === undefined) return '';
    return String(val).replace(/'/g, "''");
}

function pickUsuario(body) {
    const b = body || {};
    const u = b.usuario || b.nomusuario || b.USUARIO || b.user || b.GlobalUsuario || '';
    const s = String(u || '').trim();
    return s.slice(0, 120) || 'NO IDENTIFICADO';
}

function pickEmpnit(body, fallback) {
    const b = body || {};
    return String(b.sucursal || b.empnit || b.EMPNIT || fallback || '').trim();
}

let ensurePromise = null;

function ensureTable(token) {
    if (!ensurePromise) {
        ensurePromise = execute.get_data_qry(DDL_BITACORA_ELIMINACIONES, token).catch((e) => {
            ensurePromise = null;
            throw e;
        });
    }
    return ensurePromise;
}

/**
 * Registra eliminación en segundo plano (no bloquea la respuesta HTTP).
 */
function logEliminacionAsync(opts) {
    setImmediate(() => {
        logEliminacion(opts).catch((err) => {
            console.error('[bitacoraEliminaciones]', err && err.message ? err.message : err);
        });
    });
}

async function logEliminacion(opts) {
    const token = opts && opts.token;
    const modulo = escSql(String(opts && opts.modulo ? opts.modulo : 'GENERAL').slice(0, 80));
    const detalle = escSql(String(opts && opts.detalle ? opts.detalle : '').slice(0, 3800));
    const usuario = escSql(String(opts && opts.usuario ? opts.usuario : 'NO IDENTIFICADO').slice(0, 120));
    const empnit = escSql(String(opts && opts.empnit ? opts.empnit : '').slice(0, 50));
    if (!token) return;

    await ensureTable(token);
    const qry = `
        INSERT INTO BITACORA_ELIMINACIONES (EMPNIT, USUARIO, MODULO, DETALLE, FECHA_HORA)
        VALUES ('${empnit}', N'${usuario}', N'${modulo}', N'${detalle}', GETDATE());
    `;
    await execute.get_data_qry(qry, token);
}

function normalizeMesAnio(mes, anio) {
    const now = new Date();
    let m = parseInt(mes, 10);
    let y = parseInt(anio, 10);
    if (!Number.isFinite(m) || m < 1 || m > 12) m = now.getMonth() + 1;
    if (!Number.isFinite(y) || y < 2000 || y > 2100) y = now.getFullYear();
    return { mes: m, anio: y };
}

/** Rango [inicio, fin) sobre FECHA_HORA — incluye todo el mes sin depender de columnas calculadas. */
function sqlFiltroRangoMes(mes, anio) {
    const { mes: m, anio: y } = normalizeMesAnio(mes, anio);
    const pad = (n) => String(n).padStart(2, '0');
    const inicio = `${y}-${pad(m)}-01`;
    let nm = m + 1;
    let ny = y;
    if (nm > 12) {
        nm = 1;
        ny += 1;
    }
    const finExclusive = `${ny}-${pad(nm)}-01`;
    return {
        mes: m,
        anio: y,
        inicio,
        finExclusive,
        sql: `FECHA_HORA >= CAST('${inicio}' AS DATETIME) AND FECHA_HORA < CAST('${finExclusive}' AS DATETIME)`,
    };
}

async function listarBitacora(token, mes, anio, buscar) {
    await ensureTable(token);
    const rango = sqlFiltroRangoMes(mes, anio);
    const f = escSql(String(buscar || '').trim());
    let filtroBuscar = '';
    if (f) {
        filtroBuscar = `
            AND (
                DETALLE LIKE N'%${f}%'
                OR USUARIO LIKE N'%${f}%'
                OR MODULO LIKE N'%${f}%'
                OR EMPNIT LIKE N'%${f}%'
                OR CAST(ID AS VARCHAR(20)) = N'${f}'
            )`;
    }
    const qry = `
        SELECT
            ID,
            FECHA_HORA,
            CONVERT(varchar(10), FECHA_HORA, 103) AS FECHA_TXT,
            CONVERT(varchar(8), FECHA_HORA, 108) AS HORA_TXT,
            ISNULL(EMPNIT, '') AS EMPNIT,
            USUARIO,
            MODULO,
            DETALLE
        FROM BITACORA_ELIMINACIONES
        WHERE ${rango.sql}
        ${filtroBuscar}
        ORDER BY FECHA_HORA DESC, ID DESC
    `;
    const data = await execute.get_data_qry(qry, token);
    return {
        mes: rango.mes,
        anio: rango.anio,
        recordset: (data && data.recordset) ? data.recordset : [],
    };
}

async function eliminarRegistroBitacora(token, id) {
    const idNum = Number(id) || 0;
    if (!idNum) return { ok: false, error: 'ID inválido' };
    await ensureTable(token);
    const data = await execute.get_data_qry(
        `DELETE FROM BITACORA_ELIMINACIONES WHERE ID = ${idNum};`,
        token
    );
    const n = data && data.rowsAffected && data.rowsAffected[0] ? data.rowsAffected[0] : 0;
    if (!n) return { ok: false, error: 'Registro no encontrado' };
    return { ok: true };
}

module.exports = {
    logEliminacionAsync,
    logEliminacion,
    pickUsuario,
    pickEmpnit,
    escSql,
    ensureTable,
    normalizeMesAnio,
    sqlFiltroRangoMes,
    listarBitacora,
    eliminarRegistroBitacora,
};
