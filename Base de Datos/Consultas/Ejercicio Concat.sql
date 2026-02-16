SELECT
	CONCAT(p.nombre,' ', p.apellido) AS Persona,
	e.Apellidos AS Empleado,
    p.ciudad
FROM persona p
INNER JOIN empresa emp
	ON p.ciudad = emp.ciudad    -- Coincidencia de ciudad
INNER JOIN departamento d
	ON d.ID_Empresa = emp.id    -- Departamento pertenece a esa empresa
INNER JOIN empleado e
	ON e.ID_Dpto = d.ID_Dpto    -- Empleado trabaja en ese departamento