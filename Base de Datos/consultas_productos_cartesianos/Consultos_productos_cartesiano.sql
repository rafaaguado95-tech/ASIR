-- --------------------------------------------------------
-- 26.Mostrar todas las combinaciones posibles entre plataformas y tiendas, mostrando sus nombres. Ordenar por plataforma y tienda.
-- --------------------------------------------------------

SELECT
p.nombre AS plataforma,
t.nombre AS tienda
FROM videojuegos_asir.plataforma AS P 
CROSS JOIN videojuegos_asir.tienda AS t
ORDER BY plataforma, tienda;

-- ----------------------------------------------------------
-- 27.Mostrar todas las combinaciones posibles entre videojuegos y géneros, mostrando el título del videojuego y el género. Ordenar por videojuego y género
-- ----------------------------------------------------------
SELECT 
v.titulo AS videojuego,
g.nombre AS genero
FROM videojuegos_asir.videojuego AS v
INNER JOIN videojuegos_asir.videojuego_genero AS vg ON vg.id_videojuego = v.id_videojuego
INNER JOIN videojuegos_asir.genero AS g ON vg.id_genero = g.id_genero 
ORDER BY videojuego, genero;

-- -----------------------------------------------------------
-- 28.Mostrar todas las combinaciones posibles entre estudios y plataformas, mostrando nombre del estudio, país y nombre de la plataforma. Ordenar por país, estudio y plataforma
-- -----------------------------------------------------------
SELECT
e.pais AS pais,
e.nombre AS estudio,
P.nombre AS plataforma
FROM videojuegos_asir.estudio AS e
CROSS JOIN videojuegos_asir.plataforma AS p
ORDER BY pais, estudio, plataforma;
