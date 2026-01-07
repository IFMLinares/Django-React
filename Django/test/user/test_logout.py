import pytest
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestLogoutFlow:

    @pytest.fixture
    def user(self):
        return User.objects.create_user(
            username='testuser', 
            password='testpassword123'
        )
    
    def test_logout_invalidates_token_and_clears_cookies(self, api_client, user):
        """
        Prueba Integral de Logout:
        1. Login -> Recibe Cookies.
        2. Logout -> Limpia Cookies Y pone el token en lista negra.
        """
        # --- PASO 1: LOGIN ---
        login_url = '/api/auth/login/' # Ajusta a tu URL real
        login_payload = {
            'username': 'testuser',
            'password': 'testpassword123'
        }
        login_response = api_client.post(login_url, login_payload)
        assert login_response.status_code == status.HTTP_200_OK

        # CAPTURA CRÍTICA: Guardamos el token antes de que se "pierda"
        # Nota: .value es necesario para sacar el string de la cookie de Django
        refresh_token_string = login_response.cookies['refresh_token'].value
        
        # --- PASO 2: LOGOUT ---
        # Simulamos que el navegador envía las cookies de vuelta para el logout
        api_client.cookies = login_response.cookies 
        
        logout_url = '/api/auth/logout-cookie/' # Ajusta a tu URL real
        logout_response = api_client.post(logout_url)

        assert logout_response.status_code == status.HTTP_200_OK

        # --- PASO 3: VERIFICACIÓN DE COOKIES (Frontend) ---
        # delete_cookie pone el valor en vacío (''), no elimina la key.
        assert logout_response.cookies['access_token'].value == ''
        assert logout_response.cookies['refresh_token'].value == ''

        # --- PASO 4: VERIFICACIÓN DE INVALIDACIÓN (Backend) ---
        # Intentamos verificar el token manualmente contra la lista negra
        try:
            token = RefreshToken(refresh_token_string)
            token.check_blacklist() # Esto debería lanzar error si está en blacklist
            
            # Si llegamos aquí, el token SIGUE VIVO -> El test debe fallar
            pytest.fail("El refresh token debería estar en la lista negra, pero sigue activo.")
            
        except TokenError:
            # Si lanza TokenError diciendo "Token is blacklisted", ¡ES UN ÉXITO!
            pass