import random

from django.conf import settings
from django.core.mail import send_mail
from django.utils.timezone import now, timedelta

from .models import User

def set_auth_cookies(response, access_token, refresh_token):
    """
    Inyecta las cookies de acceso y refresco en la respuesta
    usando la configuración global del proyecto.
    """
    cookie_params = {
        'httponly': True,
        'secure': settings.JWT_AUTH_SECURE,
        'samesite': settings.JWT_AUTH_SAMESITE,
        'path': '/api/', # Ojo: Asegúrate que esta ruta cubra todos tus endpoints
    }

    response.set_cookie(
        key=settings.JWT_AUTH_COOKIE,
        value=access_token,
        **cookie_params
    )
    
    response.set_cookie(
        key=settings.JWT_REFRESH_COOKIE,
        value=refresh_token,
        **cookie_params
    )
    
    return response

def clear_auth_cookies(response):
    """
    Elimina las cookies usando la misma configuración con la que se crearon.
    Es CRÍTICO que path y domain coincidan.
    """
    cookie_params = {
        'path': '/api/', 
        'samesite': settings.JWT_AUTH_SAMESITE,
        # 'domain': settings.JWT_AUTH_DOMAIN, # Si usas dominio explícito
    }

    response.delete_cookie(settings.JWT_AUTH_COOKIE, **cookie_params)
    response.delete_cookie(settings.JWT_REFRESH_COOKIE, **cookie_params)
    
    return response

class UserAuthService:
    @staticmethod
    def send_password_reset_code(email):
        """Genera un código, lo guarda y envía el email."""
        try:
            user = User.objects.get(email=email)
            reset_code = random.randint(100000, 999999)
            user.reset_code = reset_code
            user.reset_code_created_at = now()
            user.save()

            send_mail(
                'Código de restablecimiento',
                f'Tu código es: {reset_code}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
            )
            return True, "Código enviado al email"
        except User.DoesNotExist:
            return False, "No existe usuario con ese email"

    @staticmethod
    def validate_and_reset_password(email, reset_code, new_password):
        """Valida el código y actualiza la contraseña."""
        try:
            user = User.objects.get(email=email)
            
            # Validaciones de negocio
            if str(user.reset_code) != str(reset_code):
                return False, "Código incorrecto"
            
            if now() > user.reset_code_created_at + timedelta(minutes=10):
                return False, "Código expirado"
            
            # Ejecución del cambio
            user.set_password(new_password)
            user.reset_code = None
            user.reset_code_created_at = None
            user.save()
            return True, "Contraseña cambiada correctamente"
        except User.DoesNotExist:
            return False, "No existe usuario con ese email"
        
    @staticmethod
    def register_user(serializer):
        """Maneja la creación de usuario desde el serializer."""
        user = serializer.save()
        # Aquí podrías agregar: enviar correo de bienvenida
        return user
