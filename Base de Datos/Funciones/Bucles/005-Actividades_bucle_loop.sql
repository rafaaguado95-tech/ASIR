DELIMITER //

CREATE PROCEDURE suma_hasta_n_loop(IN n INT)
BEGIN
    DECLARE resultado  INT DEFAULT 0;
    DECLARE i INT DEFAULT 1;

    bucle:LOOP
        IF i > n THEN
            LEAVE bucle;
        END IF;

        SET resultado = resultado + i;
        SET i = i + 1;
    END LOOP;

    SELECT resultado AS suma_total;
END // 
DELIMITER ;

CALL suma_hasta_n_loop(1);