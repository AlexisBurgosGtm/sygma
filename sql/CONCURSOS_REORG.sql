-- Reorganización concursos: productos y marca a nivel CONCURSOS.
-- Ejecutar con: node scripts/run_concursos_reorg.js
-- (El script corre cada paso en un batch aparte; no ejecutar este archivo entero de una vez en SSMS.)

-- 1) CONCURSOS.CODMARCA
-- 2) Tabla CONCURSOS_PRODUCTOS (IDCONCURSO, CODPROD)
-- 3) Migrar desde CONCURSOS_OBJETIVOS_PRODUCTOS y CONCURSOS_OBJETIVOS.CODPROD
-- 4) CONCURSOS.CODMARCA desde objetivos
-- 5) Unificar objetivos por (IDCONCURSO, CODEMP); eliminar CODMARCA y CODPROD de objetivos
