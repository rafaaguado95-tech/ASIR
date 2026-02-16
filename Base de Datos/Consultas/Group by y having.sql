SELECT Ciudad, COUNT(Nombre), AVG(Edad)
FROM Persona
GROUP BY Ciudad;