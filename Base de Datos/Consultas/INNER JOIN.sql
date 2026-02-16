SELECT E.Apellidos, E.ID_Dpto, D.ID_Dpto, D.Nombre_Dpto
FROM Empleado AS E
INNER JOIN departamento AS D ON e.id_Dpto = D.ID_Dpto
WHERE D.Nombre_Dpto='INFORMATICA'
ORDER BY Apellidos ASC;