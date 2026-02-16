SELECT Ciudad, COUNT(id) AS Habitantes, AVG(Edad) AS Edad_Media,
	MIN(Edad) AS Edad_Minima, MAX(Edad) AS Edad_Maxima
FROM Persona
GROUP BY Ciudad
HAVING AVG(edad)>20;