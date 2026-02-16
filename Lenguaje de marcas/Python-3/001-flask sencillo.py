# pip install flask - Visual Studio

from flask import flask   #Importamos la libreria Flask
app = Flask(__name__)      #Creamos una  nueva aplicacion de Flask

@app.get('/')            #Escuchamos la raiz de la web
def index():            #creamos una entrada llamada index
    return "Hola Mundodesde flask"  #Devolvemos el texto  Hola Mundodesde flask

if __name__ == '__main__':  #Si estamos ejecutando este archivo
    app.run(debug=True)    #Ejecutamos la aplicacion en modo debug

# Primero navego a la carpeta indicada (o le dais a play los niños del Visual Studio)
# Si estais en linea de comandos, python3 "001-flask sencillo.py"
# Ahora abrimos un navegador web
# y entramos la url: http://127.0.0.1:5000
