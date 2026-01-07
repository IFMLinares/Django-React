import pytest
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestRegistration:

    def test_register_client_success(self, api_client):
        """
        Prueba que un usuario se crea correctamente y se le asigna el rol CLIENTE automáticamente.
        """
        url = '/api/auth/register/'  # Tu URL real
        payload = {
            'username': 'nuevocliente',
            'email': 'cliente@test.com',
            'password': 'passwordseguro123'
        }

        response = api_client.post(url, payload)

        # 1. Verificar Status (201 CREATED es el estándar REST para creación)
        assert response.status_code == status.HTTP_201_CREATED
        
        # 2. VERIFICACIÓN CRÍTICA: ¿Se guardó en la DB?
        user_db = User.objects.get(username='nuevocliente')
        assert user_db.email == 'cliente@test.com'
        
        # 3. VERIFICACIÓN DE NEGOCIO: ¿Tiene el rol correcto?
        # Asumo que tu modelo tiene un campo 'role'
        assert user_db.role == 'client' 

    def test_register_duplicate_email_fails(self, api_client):
        """
        Prueba que no se puedan crear dos usuarios con el mismo email.
        Esto valida que tu Serializer esté haciendo su trabajo.
        """
        # Crear usuario previo
        User.objects.create_user(username='old', email='dup@test.com', password='123')
        
        url = '/api/auth/register/'
        payload = {
            'username': 'new',
            'email': 'dup@test.com', # Email repetido
            'password': '123'
        }

        response = api_client.post(url, payload)

        # Debe fallar con 400 Bad Request
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        # Verificar que el error sea sobre el email
        assert 'email' in response.data
