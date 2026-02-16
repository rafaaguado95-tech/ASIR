from flask import Flask

app = Flask(__name__)

@app.get("/")
def index():
    return "Bienvenido al marcador online de la liga"

if __name__ == "__main__":
    app.run(debug=True)

