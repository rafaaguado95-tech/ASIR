from flask import Flask,render_template # NUEVO						

app = Flask(__name__)					

@app.get("/")										
def inicio():										
    return render_template("inicio.html") 

@app.get("/")										
def Sobremi():										
    return render_template("sobremi.html") 

@app.get("/")										
def Contacto():										
    return render_template("Contacto.html") 


if __name__ == "__main__":				
    app.run(debug=True)	