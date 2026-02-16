SELECT E.Apellidos, E.ID_Dpto, D.ID_Dpto, D.Nombre_Dpto
FROM Empleado AS E
RIGHT JOIN departamento AS D ON e.id_Dpto = D.ID_Dpto
UNION ALL
SELECT E.Apellidos, E.ID_Dpto, D.ID_Dpto, D.Nombre_Dpto
FROM Empleado AS E
LEFT JOIN departamento AS D ON e.id_Dpto = D.ID_Dpto;