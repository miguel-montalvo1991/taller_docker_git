from app import app

def test_inicio():
    cliente = app.test_client()   # Crea un cliente de pruebas para la app
    r = cliente.get('/')           # Simula una petición GET a la ruta "/"
    assert r.status_code == 200    # Verifica que la respuesta sea exitosa
