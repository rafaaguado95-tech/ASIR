DELIMITER //

CREATE PROCEDURE while_leave_iterate (IN max INT)
BEGIN
    DECLARE iINT INT DEFAULT 0;

    bucle: WHILE i < max DO
        SET i = i +1;

    -- ITERATE: saltar a la siguiente iteracion del bucle
        IF i = 3 THEN
            ITERATE bucle;
        END IF;
    
    -- LEAVE: salir del bucle
        IF i = 5 THEN
            LEAVE bucle;
        END IF;

    -- Codigo que solo se ejecuta si no hay ITERATE o LEAVE
        SELECT CONCAT('Procesando numero', i) AS mensaje;
    END WHILE;
END //
DELIMITER ;

CALL while_leave_iterate(1);