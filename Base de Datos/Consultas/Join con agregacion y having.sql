SELECT
	d.Nombre_Dpto,
	COUNT(E.id) AS Cantidad_Empleados,
FROM Departamento d
INNER JOIN Empeado e
	ON d_ID_Dpto = e.ID.Dpto
    
GROUP by 	d.nombre_Dpto
HAVING COUNT(E.id) > 1;