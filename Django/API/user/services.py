from django.conf import settings

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