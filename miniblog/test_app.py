from app import app 
def test_inicio(): cliente = app.test_client()
r = cliente.get('/') 
assert r.status_code == 200