CREATE TABLE productos
(
    Identificador INT(10) NOT NULL AUTO_INCREMENT , 
    nombre VARCHAR(150) NOT NULL , 
    descripcion TEXT NOT NULL , 
    precio DECIMAL(10,2) NOT NULL , 
    categoria ENUM('fisico','virtual') NOT NULL , 
    peso DECIMAL(10,2) NOT NULL , 
    imagen VARCHAR(100) NOT NULL ,
    PRIMARY KEY (Identificador)
) 
ENGINE = InnoDB 
COMMENT = 'En esta tabla guardaremos los productos';