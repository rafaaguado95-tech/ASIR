-- bucle while 
--sintaxis basica

While condicion DO
    -- instrucciones a repetir
END WHILE;

-- ITREATE Y LEAVE en bucles

While condicion DO
    -- instrucciones a repetir
    ITERATE etiqueta; -- saltar a la siguiente iteracion del bucle
    LEAVE etiqueta; -- salir del bucle
END WHILE;

-- Bucle Repeat

Repeat
    -- instrucciones a repetir
Until condicion;
AND REPEAT;

-- bucle LOOP

LOOP
    -- instrucciones a repetir
    IF condiciion_de_salida THEN
        LEAVE Etiqueta; -- salir del bucle cuando se cumple la condicion
    END IF;
    -- mas insterucciones que se ejecutan su i se sale del bucle
END LOOP Etiqueta;