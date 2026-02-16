-- --------------------------------------------------------
-- 34.Mostrar cuántos videojuegos hay por cada valor de PEGI, excluyendo PEGI NULL. Ordenar por PEGI.
-- --------------------------------------------------------

SELECT
pegi AS valor_pegi,
COUNT(*) AS cantidad_videojuegos
FROM videojuegos_asir.videojuego
WHERE pegi IS NOT NULL
GROUP BY pegi
ORDER BY pegi;

-- ----------------------------------------------------------
-- 35.Mostrar el número de videojuegos desarrollados por cada estudio, incluyendo solo los estudios con videojuegos. Ordenar por número de videojuegos descendente.
-- ----------------------------------------------------------
SELECT 
e.nombre AS estudio,
COUNT(v.id_videojuego) AS num_videojuego
FROM videojuegos_asir.estudio AS e
INNER JOIN videojuegos_asir.videojuego AS v ON v.id_videojuego = e.id_estudio
GROUP BY e.id_estudio, e.nombre
ORDER BY COUNT(v.id_videojuego) DESC;

-- -------------------------------------------------------------
-- 36.Mostrar el precio medio de los videojuegos por plataforma, excluyendo precios NULL. Ordenar por precio medio descendente
-- -------------------------------------------------------------
SELECT
p.nombre AS plataforma,
AVG(v.precio_base) AS precio_medio
FROM videojuegos_asir.plataforma AS p
INNER JOIN videojuegos_asir.videojuego_plataforma AS vp ON vp.id_plataforma = p.id_plataforma
INNER JOIN videojuegos_asir.videojuego AS v ON vp.id_videojuego =  v.id_videojuego
WHERE v.precio_base IS NOT NULL
GROUP BY p.nombre
ORDER BY precio_medio DESC; 

-- ---------------------------------------------------------------
-- 37.Mostrar el número total de videojuegos disponibles en cada tienda y el precio medio por tienda. Ordenar por número de videojuegos y precio medio.
-- ---------------------------------------------------------------
SELECT
t.nombre AS tienda,
COUNT(d.id_videojuego) AS total_videojuego,
AVG(v.precio_base) AS precio_medio
FROM videojuegos_asir.tienda AS t
INNER JOIN videojuegos_asir.disponibilidad AS d ON d.id_tienda = t.id_tienda
INNER JOIN videojuegos_asir.videojuego AS v ON d.id_videojuego = v.id_videojuego
GROUP BY t.nombre
ORDER BY total_videojuego, precio_medio;

-- ---------------------------------------------------------
-- 38.Mostrar el total de horas trabajadas por cada desarrollador, incluyendo solo aquellos cuya suma de horas supere 500. Ordenar por total de horas descendente.
-- ---------------------------------------------------------
SELECT
d.nombre AS desarrollador,
SUM(p.horas) AS total_horas
FROM videojuegos_asir.participacion AS p
INNER JOIN videojuegos_asir.desarrollador AS d ON d.id_desarrollador = p.id_desarrollador
GROUP BY d.id_desarrollador, d.nombre
HAVING SUM(p.horas) >500
ORDER BY total_horas DESC;

