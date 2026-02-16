Empezamos suave:

1.-Vamos a crear una base de datos
Pero de la forma más sencilla posible
Usando DB Browser (sqlitebrowser)

2.-Abrimos DB browse
(el progrmaa que descargamos ayer en clase)

3.-Creamos una nueva base de datos
Arriba a la izquierda: botón "Nueva base de datos"
Las extensiones en SQLite preferidas son
.db
.sqlite
.sqlite3
(blog.db)

4.-Nombre de la tabla: entradas
Campos:
    CREATE TABLE "Entradas" (
	"id"	INTEGER,
	"titulo"	TEXT,
	"fecha"	TEXT,
	"autor"	TEXT,
	"categoria"	TEXT,
	"contenido"	TEXT,
	"imagen"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
7
5- Cada operacion que hagamos le damos al boton "guardar cambios"