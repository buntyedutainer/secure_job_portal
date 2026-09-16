import pytest 
from app import app, db 

@pytest.fixture 
def client(): 
    app.config['TESTING'] = True 
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' 
    with app.test_client() as client: 
        with app.app_context(): 
            db.create_all() 
        yield client


def test_home_route(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.get_json()['message'] == 'API is running'


def test_register_and_login(client): 
    register_response = client.post('/register', json={ 
        'name': 'Test User', 
        'email': 'pytest@example.com', 
        'password': 'testpass123', 
        'role': 'student' }) 
    assert register_response.status_code == 201 
    login_response = client.post('/login', json={ 
        'email': 'pytest@example.com', 
        'password': 'testpass123' })
    assert login_response.status_code == 200 
    assert 'access_token' in login_response.get_json()


def test_register_rejects_short_password(client): 
    response = client.post('/register', json={ 
        'name': 'Test User2', 
        'email': 'pytest2@example.com', 
        'password': '123', 
        'role': 'student' }) 
    assert response.status_code == 400