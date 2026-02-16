SELECT nombre, edad
FROM ejemplo.persona
WHERE edad > (SELECT AVG(edad) FROM ejemplo.personal);