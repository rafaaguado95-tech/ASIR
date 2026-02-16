DELIMITER //
 
CREATE PROCEDURE estado_categoria(
 
IN p_id_categoria INT
 
)
 
BEGIN
 
  DECLARE v_tiene_juegos TINYINT;
  DECLARE v_nombre VARCHAR(50);
  DECLARE v_resultado VARCHAR(40);
 
  -- Obtener datos de la categoría
 
  SELECT nombre, num_juegos
  INTO v_nombre, v_num_juegos
  FROM categoria_juego
  WHERE id_categoria = p.id_categoria;
 
  -- IF ... ELSE
 
  IF v_num_juegos = 0 THEN
  SELECT v_resultado = 'Categoría vacía';
  ELSEIF v_num_juegos = 1 THEN
  SELECT v_resultado = 'Categoría con pocos juegos';
  ELSE
  SET v_resultado = 'Categoría con varios juegos';
 
  END IF;
 
  SELECT CONCAT('La categoría "', v_nombre, ' " tiene', v_num_juegos, 'juegos ', v_resultado) AS Resultado;
 
END //
 
 