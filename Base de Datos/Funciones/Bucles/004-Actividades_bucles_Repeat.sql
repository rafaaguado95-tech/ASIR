DELIMITER //
CREATE PROCEDURE suma_hasta_n_repeat(IN n INT)
BEGIN
    DECLARE resultado INT DEFAULT 0;
    DECLARE i INT DEFAULT 1;

    REPEAT
        SET resultado = resultado + i;
        SET i = i + 1;
    UNTIL i > n END REPEAT;

    SELECT resultado AS suma_total;
END //
DELIMITER ;

CALL suma_hasta_n_repeat(1);