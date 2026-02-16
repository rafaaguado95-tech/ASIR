-- Borrar primero el hijo 
INSERT INTO parent_restrict (id,name) VALUES (1, 'parent A');
INSERT INTO child_restrict (id, parent_id, description) VALUES 	(101, 1, 'child of parent A');

-- Actualizacion y Eliminacion exitosas del padre
DELETE FROM child_restrict
WHERE parent_id = 1;

UPDATE parent_restrict
SET id = 10
WHERE id = 1;

-- ccreate de tabalas en CASCADE
CREATE TABLE parent_cascade (
	id INT PRIMARY KEY,alertas
	name VARCHAR(50)
);

CREATE TABLE child_cascade (
	child_id INT PRIMARY KEY,
    parent_id INT,
    DESCRIPTION VARCHAR (100),
    FOREIGN KEY (PARENT_ID) REFERENCES parent_restrict(id)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- insertado de datos de prueba , primero insertaremos un registro padre y varios registros hijos que referencian a este padre
INSERT INTO parent_cascade (id, name) VALUES (1, 'parent Original');

INSERT INTO child_cascade (child_id, parent_id, description)
VALUES (101, 1, 'child A of Parent 1'),(102, 1, 'Child B of Parent 1'),(103, 1, 'child C of Parent 1');

-- Aqui estan las sentencias  CREATE TABLE para configurar este comportamiento
CREATE TABLE parent_setnull (
	id INT PRIMARY KEY,
	name VARCHAR(50)
);

CREATE TABLE child_setnull (
	child_id INT PRIMARY KEY,
    parent_id INT, -- Debe ser NULLable para SET NULL
    DESCRIPTION VARCHAR (100),
    FOREIGN KEY (PARENT_ID)   REFERENCES parent_restrict(id)
		ON DELETE RESTRICT
        ON UPDATE RESTRICT
);

-- INSERTAR DATOS DE PRUEBA
-- Crear na tabla parent_setnull y child_setnull y luego insertamos algunos registros para comenzar la demostracion
INSERT INTO parent_setnull (id, name) VALUES (1, 'parent One');
INSERT INTO child_setnull (child_id, parent_id, description) VALUES (101, 1, 'Child of parent One');

 -- Actualizar la clave primaria del padre
 UPDATE parent_setnull SET id = 10  WHERE id = 1;
 
 -- Re-vincular los registros hijos 
 UPDATE child_setnull SET parent_id = 10 WHERE parent_id IS NULL;
 
 -- Eliminar un registro padre
 DELETE FROM parent_setnull WHERE ID = 10;