-- --------------------------------------------------------------------------
-- 21.Mostrar una lista única de nombres formada por los nombres de los estudios y los nombres de las tiendas. Ordenar por nombre.
-- --------------------------------------------------------------------------
SELECT
nombre
FROM videojuegos_asir.estudio
UNION
SELECT
nombre
FROM videojuegos_asir.tienda
ORDER BY nombre;

-- ----------------------------------------------------------------------------
-- 22.Mostrar una lista única de países en los que existen estudios o tiendas. Ordenar por país.
-- ----------------------------------------------------------------------------
SELECT 
pais
FROM videojuegos_asir.estudio
UNION
SELECT
pais
FROM videojuegos_asir.tienda
ORDER BY pais;

-- -------------------------------------------------------------------------------
-- 23..Mostrar una lista única de ciudades donde haya estudios o desarrolladores, excluyendo valores NULL. Ordenar por ciudad.
-- -------------------------------------------------------------------------------
SELECT
ciudad
FROM videojuegos_asir.estudio
WHERE ciudad IS NOT NULL
UNION
SELECT
ciudad
FROM videojuegos_asir.desarrollador
WHERE ciudad IS NOT NULL
ORDER BY ciudad;

-- ---------------------------------------------------------------------------------
-- 24..Mostrar una lista única de nombres de videojuegos y nombres de plataformas, indicando mediante una columna el tipo de elemento. Ordenar por nombre
-- ---------------------------------------------------------------------------------
SELECT
v.titulo AS nombre,
'videojuego' AS tipo_elemento
FROM videojuegos_asir.videojuego AS v
UNION
SELECT
p.nombre AS nombre,
'plataforma' As tipo_elemento
FROM videojuegos_asir.plataforma AS p
ORDER BY nombre;

-- ----------------------------------------------------------------------------------
-- 25..Mostrar una lista única de títulos de videojuegos lanzados a partir de 2020 y nombres de estudios fundados a partir del año 2000. Ordenar por nombre.
-- ----------------------------------------------------------------------------------
SELECT
titulo AS nombre
FROM videojuegos_asir.videojuego
WHERE fecha_lanzamiento >=2020
UNION
SELECT
nombre AS nombre
FROM videojuegos_asir.estudio
WHERE fundado_en >=2000
ORDER BY nombre;