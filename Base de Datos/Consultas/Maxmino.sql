SELECT Ciudad, COUNT(Nombre), MAX(Edad)
FROM Persona
GROUP BY Ciudad;