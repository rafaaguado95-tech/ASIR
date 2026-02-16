import sqlite3

# 1. Conectar (si no existe, la BD se crea automáticamente)
conexion = sqlite3.connect("clientes.db")
cursor = conexion.cursor() #Cursor necesario para movernos por la base de datos.

# 2. Crear tabla clientes (si no existe)
cursor.execute("""
CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT
)
""")

# 3. Insertar un cliente
cursor.execute("""
INSERT INTO clientes (nombre, email, telefono)
VALUES ("Juan Pérez", "juan.perez@example.com", "600123456")
""")

# Guardar cambios
conexion.commit()

# 4. Mostrar el cliente insertado
cursor.execute("SELECT * FROM clientes")
print(cursor.fetchall())

# Cerrar conexión
conexion.close()