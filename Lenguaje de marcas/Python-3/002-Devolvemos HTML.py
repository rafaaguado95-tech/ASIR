from flask import Flask								# Importamos la libreria Flask

app = Flask(__name__)									# Creamos una nueva aplicación

@app.get("/")													# Escuchamos en la raiz de la web
def index():													# Creamos una entrada
    return "<h1>Hola mundo desde Flask</h1>"		# NUEVO ##############

if __name__ == "__main__":						# Si nos encontramos en el archivo principal
    app.run(debug=True)								# Ejecutamos la aplicación
    