-- --------------------------------------------------------
-- 29.Mostrar el título de cada videojuego junto con el nombre del estudio que lo desarrolla, incluyendo solo videojuegos con estudio. Ordenar por título.
-- --------------------------------------------------------

SELECT
v.titulo AS titulo,
e.nombre AS nombre
FROM videojuegos_asir.videojuego AS v
INNER JOIN videojuegos_asir.estudio AS e ON v.id_videojuego = e.id_estudio
ORDER BY titulo; 

-- ----------------------------------------------------------
-- 30.Mostrar el nombre y apellido de los desarrolladores junto con el nombre del estudio al que pertenecen, incluyendo también los desarrolladores sin estudio. Ordenar por apellido y nombre.
-- ----------------------------------------------------------
SELECT
d.apellido AS apellido,
d.nombre AS nombre,
e.nombre AS estudio
FROM videojuegos_asir.desarrollador AS d 
LEFT JOIN videojuegos_asir.estudio AS e ON d.id_estudio = e.id_estudio -- Tienes que poner la FK de cada tabla
ORDER BY apellido, nombre;

-- ------------------------------------------------------------
-- 31.Mostrar el título de los videojuegos y el nombre de las plataformas en las que están disponibles. Ordenar por título y plataforma
-- ------------------------------------------------------------
SELECT DISTINCT
v.titulo AS titulo,
p.nombre AS plataforma
FROM videojuegos_asir.videojuego AS v
INNER JOIN videojuegos_asir.videojuego_plataforma AS vp ON vp.id_videojuego = v.id_videojuego
INNER JOIN videojuegos_asir.plataforma AS p ON p.id_plataforma = v.id_videojuego
ORDER BY titulo, plataforma;

-- ------------------------------------------------------------
-- 32.Mostrar el nombre de cada tienda junto con el título de los videojuegos que vende y su precio. Ordenar por tienda y precio ascendente.
-- ------------------------------------------------------------
SELECT DISTINCT
t.nombre AS tienda,
v.titulo AS titulo,
v.precio_base AS precio
FROM videojuegos_asir.tienda AS t
INNER JOIN videojuegos_asir.disponibilidad AS ds ON ds.id_tienda = t.id_tienda
INNER JOIN videojuegos_asir.videojuego AS v ON t.id_tienda = v.id_videojuego
ORDER BY tienda, precio ASC;

-- -------------------------------------------------------------
-- 33.Mostrar el título de los videojuegos y el nombre del estudio, incluyendo también los videojuegos sin estudio asociado. Ordenar por título.
-- -------------------------------------------------------------
SELECT
v.titulo AS titulo,
e.nombre AS estudio
FROM videojuegos_asir.videojuego AS v
LEFT JOIN videojuegos_asir.estudio AS e ON e.id_estudio = v.id_estudio -- Poner la FK !!
ORDER BY titulo;