/* CREATE TABLE clientes
(
    Identificador INT(10) NOT NULL AUTO_INCREMENT , 
    nombre VARCHAR(150) NOT NULL , 
    idfiscal VARCHAR(50) NOT NULL , 
    direccion VARCHAR(250) NOT NULL , 
    codigopostal VARCHAR(20) NOT NULL , 
    nombrepersonacontacto VARCHAR(250) NOT NULL , 
    emailpersonacontacto VARCHAR(100) NOT NULL , 
    imagen VARCHAR(100) NOT NULL ,
    PRIMARY KEY (Identificador)
) 
ENGINE = InnoDB 
COMMENT = 'En esta tabla guardaremos los clientes';
*/

/*
ALTER TABLE clientes
MODIFY Identificador INT(10) NOT NULL;

ALTER TABLE clientes
DROP PRIMARY KEY;
*/
-- Añadir la clave primaria de nuevo

ALTER TABLE clientes
MODIFY identificador INT(10) NOT NULL AUTO_INCREMENT, 
ADD PRIMARY KEY (identificador);
