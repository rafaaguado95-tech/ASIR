-- -----------------------------------------------------------------
-- 45.Mostrar el título de los videojuegos desarrollados por estudios situados en España. Ordenar por título. 
-- -----------------------------------------------------------------
SELECT
v.titulo AS titulo
FROM videojuegos_asir.videojuego AS v
WHERE id_estudio IN (
	SELECT e.id_estudio
    FROM videojuegos_asir.estudio AS e
    WHERE e.pais = 'España'
    )
ORDER BY titulo;

-- --------------------------------------------------------------------
-- 46.Mostrar el nombre y apellido de los desarrolladores que trabajan en estudios que han desarrollado al menos un videojuego. Ordenar por apellido y nombre.
-- --------------------------------------------------------------------
SELECT
d.nombre AS nombre,
d.apellido AS apellido
FROM videojuegos_asir.desarrollador AS d
WHERE d.id_estudio IN (
	SELECT e.id_estudio
    FROM videojuegos_asir.estudio AS e
    INNER JOIN videojuegos_asir.videojuego AS v ON v.id_estudio = e.id_estudio
    )
ORDER BY d.apellido, d.nombre;

-- --------------------------------------------------------------------
-- 47.Mostrar el título de los videojuegos disponibles en tiendas situadas en España. Ordenar por titulo.
-- --------------------------------------------------------------------
SELECT
v.titulo AS titulo
FROM videojuegos_asir.videojuego AS v
WHERE id_videojuego IN (
	SELECT d.id_videojuego 
    FROM videojuegos_asir.disponibilidad AS d
    INNER JOIN videojuegos_asir.tienda AS t 
	ON t.id_tienda = d.id_tienda
    WHERE t.pais = 'España'
    )
ORDER BY v.titulo
