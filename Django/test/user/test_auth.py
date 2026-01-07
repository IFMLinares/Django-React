import pytest
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestLoginFlow:
    
    # 1. Fixture local para crear un usuario rápido para estos tests
    @pytest.fixture
    def user(self):
        return User.objects.create_user(
            username='testuser', 
            password='testpassword123'
        )

    def test_login_success_sets_cookies(self, api_client, user):
        """
        Prueba el Camino Feliz (Happy Path):
        Login correcto -> Devuelve tokens -> Pone Cookies HttpOnly
        """
        url = '/api/auth/login/'  # Asegúrate que esta sea tu URL real
        payload = {
            'username': 'testuser',
            'password': 'testpassword123'
        }

        response = api_client.post(url, payload)

        # 1. Verifica estado 200 OK
        assert response.status_code == status.HTTP_200_OK

        # 2. Verifica que el JSON tenga los tokens
        assert 'access' in response.data
        assert 'refresh' in response.data

        # 3. LA PRUEBA DE ORO: Verifica tus Cookies personalizadas
        # response.cookies es un diccionario especial
        assert 'access_token' in response.cookies
        assert 'refresh_token' in response.cookies
        
        # 4. Verifica seguridad de la cookie (HttpOnly)
        access_cookie = response.cookies['access_token']
        assert access_cookie['httponly'] == True
        assert access_cookie['secure'] == True

    def test_login_failure_no_cookies(self, api_client, user):
        """
        Password mal -> Error 401 -> NO pone cookies
        """
        url = '/api/auth/login/'  # Asegúrate que esta sea tu URL real
        payload = {
            'username': 'testuser',
            'password': 'WRONGpassword'
        }

        response = api_client.post(url, payload)

        # Debería ser 401 Unauthorized (standard de DRF)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        
        # NO debería haber cookies
        assert 'access_token' not in response.cookies

