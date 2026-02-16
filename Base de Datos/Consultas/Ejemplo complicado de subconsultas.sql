SELECT
	e.Apellidos,
    d.Nombre_Dpto
FROM Empleado e
INNER JOIN Departamento d
	ON e.ID_Dpto
WHERE we.ID_Dpto = (
	SELECT ID_DPto
    FROM Empleado
    group by ID
    order by count(*) desc
    lIMIT 1
);