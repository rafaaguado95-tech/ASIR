ALTER TABLE `empresa`.`clientes` 
ADD COLUMN `altura` INT NULL AFTER `TipoCliente`,
ADD COLUMN `anchura` INT NULL AFTER `altura`,
ADD COLUMN `area` INT GENERATED ALWAYS AS (anchura * altura) VIRTUAL AFTER `anchura`;
/* se calcula solo*/