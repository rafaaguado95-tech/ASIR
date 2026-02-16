SELECT ciudad, id, nombre
FROM persona
WHERE apellido='Martinez' 
UNION 
SELECT ciudad, id, Nombre
FROM ejemplo.empresa;