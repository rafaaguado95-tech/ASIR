-- -------------------------------------------------------
-- 42.Mostrar el título y el precio base de los videojuegos cuyo precio sea mayor que el de algún videojuego PEGI 18. Ordenar por precio descendente.
-- ------------------------------------------------------

SELECT
titulo,
precio_base
FROM videojuegos_asir.videojuego
WHERE precio_base IS NOT NULL
	AND precio_base > ANY (
    SELECT precio_base 
    FROM videojuegos_asir.videojuego 
    WHERE pegi =18)
ORDER BY precio_base DESC;

-- --------------------------------------------------------
-- 43.Mostrar el título y el precio base de los videojuegos cuyo precio sea mayor que el de todos los videojuegos PEGI 7. Ordenar por precio descendente. 
-- --------------------------------------------------------
SELECT
titulo,
precio_base
FROM videojuegos_asir.videojuego
WHERE precio_base IS NOT NULL
	AND precio_base > ALL (
    SELECT precio_base 
    FROM videojuegos_asir.videojuego 
    WHERE pegi = 7)
ORDER BY precio_base DESC;

-- ----------------------------------------------------------
-- 44.Mostrar el nombre y apellido de los desarrolladores cuya suma de horas trabajadas sea mayor que la de algún otro desarrollador. Ordenar por apellido. 
-- ----------------------------------------------------------
SELECT
d.nombre AS nombre,
d.apellido AS apellido
FROM videojuegos_asir.desarrollador AS d
INNER JOIN videojuegos_asir.participacion AS p ON d.id_desarrollador = p.id_desarrollador
GROUP BY  d.id_desarrollador, d.nombre, d.apellido
HAVING SUM(p.horas) > ANY (
	SELECT SUM(p1.horas) 
    FROM videojuegos_asir.participacion AS p1
    GROUP BY p1.id_desarrollador
)
ORDER BY d.apellido;
