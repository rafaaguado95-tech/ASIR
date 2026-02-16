-- --------------------------------------------------------------
-- 39..Mostrar el título y el precio base de los videojuegos cuyo precio sea superior al precio medio de todos los videojuegos. Ordenar por precio descendente.
-- --------------------------------------------------------------

SELECT
titulo,
precio_base
FROM videojuegos_asir.videojuego
WHERE precio_base >(SELECT AVG (precio_base) FROM videojuegos_asir.videojuego)
ORDER BY precio_base DESC;

-- ------------------------------------------------------------
-- 40.Mostrar el nombre y apellido de los desarrolladores cuya fecha de alta sea posterior a la más antigua registrada. Ordenar por fecha de alta
-- ------------------------------------------------------------
SELECT
nombre,
apellido
FROM videojuegos_asir.desarrollador
WHERE fecha_alta > (SELECT MIN(fecha_alta) FROM videojuegos_asir.desarrollador)
ORDER BY fecha_alta;

-- -------------------------------------------------------------
-- 41.Mostrar el título y la fecha de lanzamiento de los videojuegos lanzados después del videojuego más antiguo registrado. Ordenar por fecha de lanzamiento.
-- -------------------------------------------------------------
SELECT
titulo,
fecha_lanzamiento
FROM videojuegos_asir.videojuego
WHERE fecha_lanzamiento > (SELECT MIN(fecha_lanzamiento) FROM videojuegos_asir.videojuego)
ORDER BY fecha_lanzamiento DESC;




