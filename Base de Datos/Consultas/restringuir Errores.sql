ALTER TABLE Empresa.Clientes
ADD CONSTRAINT ValorDeudaMaximo CHECK (deuda < 10);
