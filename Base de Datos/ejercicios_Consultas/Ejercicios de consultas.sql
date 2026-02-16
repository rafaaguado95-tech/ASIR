-- ---------------------------------------------
-- 20.Mostrar el TOP 5 de videojuegos con fecha de lanzamiento no nula, mostrando título, motor, una columna precio_con_iva y una columna pegi_limpio. Filtrar por motor no nulo y títulos que contengan la letra “a”. Ordenar por precio_con_iva descendente y título ascendente.
-- ---------------------------------------------
/*SELECT
fecha_lanzamiento,
titulo,
motor,
precio_base * 1.21 AS precio_con_iva,
pegi AS pegi_limpio 

FROM videojuego

WHERE fecha_lanzamiento is not null
	AND motor is not null 
    AND titulo LIKE '%a%'
ORDER  BY precio_con_iva DESC,
titulo ASC
LIMIT 5; 

-- ----------------------------------------------------
-- 25.Mostrar una lista única de títulos de videojuegos lanzados a partir de 2020 y nombres de estudios fundados a partir del año 2000. Ordenar por nombre
-- ----------------------------------------------------
SELECT
titulo AS nombre
FROM videojuego
WHERE fecha_lanzamiento >= '2020'

UNION

SELECT
nombre AS nombre
FROM estudio
WHERE fundado_en >= '2000'
ORDER BY nombre;

-- -----------------------------------------------------
-- 28.Mostrar todas las combinaciones posibles entre estudios y plataformas, mostrando nombre del estudio, país y nombre de la plataforma. Ordenar por país, estudio y plataforma.
-- -----------------------------------------------------
SELECT
	e.pais AS pais,
	e.nombre AS estudio,
    p.nombre AS plataforma
    
FROM estudio  e
CROSS JOIN plataforma  p
ORDER BY e.pais, e.nombre, p.nombre; 

-- -----------------------------------------------------
-- 33.Mostrar el título de los videojuegos y el nombre del estudio, incluyendo también los videojuegos sin estudio asociado. Ordenar por título.
-- -----------------------------------------------------
SELECT
	v.titulo AS titulo,
    e.nombre AS estudio
FROM Videojuego AS v
LEFT JOIN estudio AS e
		ON e.id_estudio = v.id_estudio
ORDER BY v.titulo;*/











