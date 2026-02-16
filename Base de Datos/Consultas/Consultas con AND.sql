SELECT nombre AS Nombre_propio, apellido As Primer_Apellido, ciudad, id
FROM ejemplo.persona
WHERE ciudad='Madrid' AND id>=3 AND apellido='Martinez'
ORDER BY nombre ASC;