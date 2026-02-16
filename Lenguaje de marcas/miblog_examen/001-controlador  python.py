import sqlite3                                           # Uso la librería SQLite3
from flask import Flask,render_template                  #Uso la libreria flask para crear web 


app = Flask(__name__)                                    #I Creo una aplicación web

@app.get("/")                                            #I Cuando alguien pida la raiz de la web  
def inicio():                                            #I Ejecuto esta funcion
    conexion = sqlite3.connect("miblog.db")              # Me conecto a la base de datos
    conexion.row_factory = sqlite3.Row                   # CONVIERTE EN DICCIONARIO
    curso = conexion.cursor()                            # Creo un cursor para pedirle cosas a la bd
    curso.execute("SELECT * FROM entrada")               # Le digo lo que quiero
    piezas = curso.fetchall()                            # Ejecuto la petición contra la base de datos

    lista = []                                           # Creo una lista vacía


    for pieza in piezas:                                 # Y para cada fila de la base de datos
        lista.append(dict(pieza))                        # Añado esa fila a la lista

    print(lista)                                         # Imprimo la lista

    return render_template("miblog.html", datos=lista)   #I renderizo la web

if __name__ == "__main__":                               #I Si estoy en el archivo principal   
    app.run(debug=True)                                  #I Pongo en marcha la web
