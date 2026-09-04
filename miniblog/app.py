from flask import Flask

app = Flask(__name__)  # Crea la aplicación Flask

@app.route("/")
def hola():
    return "Hola desde miniblog"

# Este bloque solo se ejecuta si corres "python app.py" directamente.
# Al importar este archivo desde test_app.py (from app import app),
# Python NO entra aquí, así que no se levanta un servidor real
# y el test puede usar app.test_client() sin quedarse colgado.
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
