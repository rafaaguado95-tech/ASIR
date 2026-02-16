DUSE videojuegos_asir
DELIMITER // 

CREATE PROCEDURE suma_hasta_n(IN n INT)
BEGIN
    DECLARE resultado INT DEFAULT 0;
    DECLARE I INT DEFAULT 1;

    WHILE I <= N DO
        SET resultado = resultado + i;
        SET i = i + 1;
    END WHILE;

-- mostrar resultados

    SELECT resultado AS suma_total;
END //

DELIMITER ;

CALL suma_hasta_n(1);
