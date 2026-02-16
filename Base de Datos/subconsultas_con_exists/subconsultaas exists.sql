-- ------------------------------------------------------------
-- 48..Mostrar el nombre de los estudios que tengan al menos un videojuego asociado. Ordenar por nombre
-- -------------------------------------------------------------
SELECT
e.nombre AS nombre
FROM videojuegos_asir.estudio AS e
WHERE EXISTS (
	SELECT v.id_estudio
    FROM videojuegos_asir.videojuego As v
    WHERE e.id_estudio = v.id_estudio
    )
ORDER BY nombre;

-- --------------------------------------------------------------
-- 49.Mostrar el título de los videojuegos que tengan al menos un DLC asociado. Ordenar por título. 
-- --------------------------------------------------------------
SELECT
v.titulo AS titulo
FROM videojuegos_asir.videojuego AS v
WHERE EXISTS (
	SELECT dl.id_videojuego
    FROM videojuegos_asir.dlc AS dl
    WHERE v.id_videojuego = dl.id_videojuego
    )
ORDER BY  v.titulo;

-- -----------------------------------------------------------------
-- 50..Mostrar el nombre y apellido de los desarrolladores que hayan participado en algún videojuego. Ordenar por apellido y nombre.
-- -----------------------------------------------------------------
SELECT
d.nombre AS nombre,
d.apellido AS apellido
FROM videojuegos_asir.desarrollador AS d
WHERE EXISTS (
	SELECT P.id_desarrollador
    FROM videojuegos_asir.participacion AS p
    WHERE p.id_desarrollador = d.id_desarrollador
    )
ORDER BY d.apellido, d.nombre;

