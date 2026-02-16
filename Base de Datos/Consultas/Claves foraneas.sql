USE Empresa;
CREATE TABLE pedidos 
(
    Identificador INT(10) NOT NULL AUTO_INCREMENT , 
    fecha DATE NOT NULL , 
    clientes_nombre INT(10) NOT NULL , 
    FOREIGN KEY (clientes_nombre) REFERENCES clientes(Identificador),
    PRIMARY KEY (`Identificador`)
) ENGINE = InnoDB;usuarios