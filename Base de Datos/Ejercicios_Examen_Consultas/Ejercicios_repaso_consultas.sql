-- -----------------------------------------------------------------------
-- 1.Mostrar el identificador y el título de todos los videojuegos, usando alias para las columnas. Ordenar por título de forma ascendente
-- -----------------------------------------------------------------------

SELECT 
id_videojuego,
titulo
FROM videojuego
ORDER BY titulo ASC;

-- -----------------------------------------------------------------------
-- 2.Mostrar todos los datos de los estudios cuyo país sea “España”. Ordenar por ciudad y, dentro de la misma ciudad, por nombre.
-- -----------------------------------------------------------------------
SELECT 
ciudad,
nombre
FROM estudio
WHERE pais='España'
ORDER BY Ciudad,nombre ASC;

-- -----------------------------------------------------------------------
-- 3.Mostrar el nombre y el apellido de los desarrolladores activos, usando alias de tabla. Ordenar por apellido de forma ascendente.
-- -----------------------------------------------------------------------
SELECT
	d.nombre AS nombre,
	d.apellido AS apellido
FROM desarrollador AS D
WHERE d.activo =1
ORDER BY apellido ASC;

-- ------------------------------------------------------------------------
-- 4.Mostrar el TOP 5 de videojuegos más recientes, indicando su título y fecha de lanzamiento. Ordenar por fecha de lanzamiento descendente.
-- ------------------------------------------------------------------------
SELECT 
	v.titulo AS titulo,
	v.fecha_lanzamiento AS Fecha_lanzamiento
FROM videojuego AS v
WHERE v.fecha_lanzamiento
ORDER BY v.fecha_lanzamiento DESC
LIMIT 5;

-- -----------------------------------------------------------------------
-- 5.Mostrar la lista de motores sin repetidos de los videojuegos, excluyendo los motores NULL. Ordenar por motor
-- -----------------------------------------------------------------------
SELECT DISTINCT 
motor
FROM videojuego
WHERE motor IS NOT NULL
ORDER BY MOTOR;

-- ------------------------------------------------------------------------
-- 6.Mostrar el nombre, apellido y email de los desarrolladores cuyo email sea NULL. Ordenar por apellido.
-- ------------------------------------------------------------------------
SELECT
nombre,
apellido,
email
FROM desarrollador
WHERE email IS NULL
ORDER BY apellido;

-- ------------------------------------------------------------------------
-- 7.Mostrar el título y el precio base de los videojuegos cuyo precio base sea NULL. Ordenar por título.
-- ------------------------------------------------------------------------
SELECT
titulo,
precio_base
FROM videojuego
WHERE  precio_base IS NULL
ORDER BY titulo;

-- ------------------------------------------------------------------------
-- 8.Mostrar el título y el motor de los videojuegos cuyo motor no sea NULL. Ordenar por motor y después por título.
-- ------------------------------------------------------------------------
SELECT
motor,
titulo
FROM videojuego
WHERE motor IS NOT NULL
ORDER BY motor,titulo;

-- ------------------------------------------------------------------------
-- 9.Mostrar el nombre y la web de las tiendas cuya web no sea NULL. Ordenar por nombre.
-- ------------------------------------------------------------------------
SELECT
nombre,
web
FROM tienda
WHERE web IS NOT NULL
ORDER BY nombre;

-- -------------------------------------------------------------------------
-- 10.Mostrar el nombre de las plataformas cuyo tipo sea “Consola”. Ordenar por lanzamiento de más reciente a más antigua y después por nombre
-- -------------------------------------------------------------------------
SELECT
lanzamiento,
nombre
FROM plataforma
WHERE tipo ='consola'
ORDER BY lanzamiento DESC,nombre ASC;

-- --------------------------------------------------------------------------
-- 11.Mostrar el título y el precio base de los videojuegos cuyo precio base esté entre 20 y 60. Ordenar por precio base de menor a mayor.
-- --------------------------------------------------------------------------
SELECT 
titulo,
precio_base
FROM videojuego
WHERE precio_base BETWEEN 20 AND 60
ORDER BY precio_base ASC;

-- ---------------------------------------------------------------------------
-- 12.Mostrar el título de los videojuegos cuyo título empiece por la letra “B”. Ordenar por título.
-- ---------------------------------------------------------------------------
SELECT
titulo
FROM videojuego
WHERE titulo LIKE 'b%'
ORDER BY titulo;

-- -----------------------------------------------------------------------------
-- 13.Mostrar el nombre y el apellido de los desarrolladores cuyo apellido contenga la letra “i”. Ordenar por apellido y nombre.
-- -----------------------------------------------------------------------------
SELECT
nombre,
apellido
FROM desarrollador
WHERE apellido LIKE '%i%'
ORDER BY apellido, nombre;

-- -----------------------------------------------------------------------------
-- 14.Mostrar el título y la descripción de los videojuegos cuya descripción contenga la cadena“RPG”. Ordenar por título.
-- ----------------------------------------------------------------------------
SELECT
titulo,
descripcion
FROM videojuego
WHERE descripcion LIKE '%rpg%'
ORDER BY titulo;

-- ------------------------------------------------------------------------------
-- 15.Mostrar el identificador, título y precio base de los videojuegos multijugador con PEGI 16 o 18 Ordenar por PEGI descendente y precio descendente.
-- ------------------------------------------------------------------------------
SELECT
id_videojuego,
titulo,
precio_base
es_multijugador
FROM videojuego
WHERE pegi IN (16,18) AND es_multijugador = 1
ORDER BY pegi DESC,precio_base DESC;

-- -------------------------------------------------------------------------------
-- 16.Mostrar el título y una columna generada precio_con_iva calculada como precio_base *1.21 para videojuegos con precio_base no nulo. Ordenar por precio_con_iva descendente.
-- -------------------------------------------------------------------------------
SELECT
titulo,
precio_base * 1.21 AS precio_con_iva
FROM videojuegos_asir.videojuego
WHERE precio_base IS NOT NULL
ORDER BY precio_con_iva DESC;

-- ------------------------------------------------------------------------------
-- 17.Mostrar el título y una columna generada precio_mostrado usando COALESCE para sustituir precios NULL por 0. Ordenar por precio_mostrado descendente y título.
-- ------------------------------------------------------------------------------
SELECT
titulo,
coalesce(precio_base,0) AS precio_mostrado
FROM videojuegos_asir.videojuego
ORDER BY precio_mostrado DESC, titulo;

-- -------------------------------------------------------------------------------
-- 18.Mostrar el título y una columna generada pegi_normalizado usando NULLIF para convertir PEGI 0 en NULL. Ordenar por pegi_normalizado y título.
-- -------------------------------------------------------------------------------
SELECT
titulo,
nullif(pegi,null) AS pegi_normalizado
FROM videojuegos_asir.videojuego
ORDER BY  pegi_normalizado, titulo;

-- --------------------------------------------------------------------------------
-- 19.Mostrar las ciudades distintas donde hay tiendas, excluyendo valores NULL. Ordenar por Ciudad.
-- --------------------------------------------------------------------------------
SELECT DISTINCT
ciudad
FROM videojuegos_asir.tienda
WHERE ciudad IS NOT NULL
ORDER BY ciudad;

-- --------------------------------------------------------------------------------
-- 20..Mostrar el TOP 5 de videojuegos con fecha de lanzamiento no nula, mostrando título, motor, una columna precio_con_iva y una columna pegi_limpio. Filtrar por motor no nulo y títulos que contengan la letra “a”. Ordenar por precio_con_iva descendente y título ascendente.
-- --------------------------------------------------------------------------------
SELECT
titulo,
motor,
fecha_lanzamiento,
precio_base *1.21 AS precio_con_iva,
pegi AS pegi_limpio
FROM videojuegos_asir.videojuego
WHERE motor IS NOT NULL
	AND titulo LIKE '%a%'
    AND fecha_lanzamiento IS NOT NULL
ORDER BY precio_con_iva DESC, titulo ASC
LIMIT 5;
