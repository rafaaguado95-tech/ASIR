SELECT Ciudad, COUNT(Nombre), MIN(Edad)
FROM Persona
GROUP BY Ciudad;