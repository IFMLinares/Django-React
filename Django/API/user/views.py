from django.conf import settings
from django.core.mail import send_mail
from django.utils.timezone import now, timedelta

from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiTypes, OpenApiResponse

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import User
from .serializers import LoginSerializer, RegisterClientSerializer, UserSerializer
from .services import clear_auth_cookies, set_auth_cookies, UserAuthService

@extend_schema(
    request=LoginSerializer,
    responses={200: UserSerializer},
    examples=[
        OpenApiExample(
            'Login Example',
            value={"username": "usuario", "password": "contraseña"},
            request_only=True,
        )
    ],
    description="Autenticación de usuario. Devuelve access y refresh token JWT. Funcional para web y movil"
)
class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
            try:
                response = super().post(request, *args, **kwargs)
                tokens = response.data
                response.data = {
                    'success': True,
                    'access': tokens['access'],
                    'refresh': tokens['refresh']
                }
                
                # 4. Inyectar cookies usando el servicio
                set_auth_cookies(
                    response, 
                    tokens['access'], 
                    tokens['refresh']
                )
            
                return response
            except Exception as e:
                return Response({'success': False, 'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

@extend_schema(
    responses={200: OpenApiExample('Logout ok', value={"message": "Logout exitoso"})},
    description="Logout para web: invalida el refresh token y elimina las cookies JWT."
)
class LogoutCookieView(APIView):
    def post(self, request):
        # 1. Recuperar el refresh token de la cookie
        refresh_token = request.COOKIES.get(settings.JWT_REFRESH_COOKIE)

        if refresh_token:
            # 2. Invalidación en el Servidor (Blacklist)
            try:
                token = RefreshToken(refresh_token)
                token.blacklist() # Esto marca el token como "muerto" en la DB
            except TokenError:
                # Si el token ya expiró o es inválido, no importa, 
                # igual queremos hacer logout en el cliente.
                pass
        
        # 3. Preparar respuesta
        response = Response({'success': True, 'message': 'Sesión cerrada correctamente'})
        
        # 4. Limpieza en el Cliente (Cookies)
        clear_auth_cookies(response)
        
        return response

@extend_schema(
    summary="Refrescar Access Token vía Cookies",
    description="Extrae el refresh token de las cookies, genera un nuevo access token y actualiza las cookies del navegador.",
    request=None, # No requiere cuerpo porque el refresh token está en la cookie
    responses={
        200: OpenApiResponse(
            description="Token refrescado exitosamente",
            response=OpenApiTypes.OBJECT,
            examples=[
                OpenApiExample(
                    'Refresh OK',
                    value={'refreshed': True, 'access': 'eyJhbGci...'}
                )
            ]
        ),
        401: OpenApiResponse(description="Token de refresco inválido o expirado")
    },
    tags=['Autenticación']
)
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get(settings.JWT_REFRESH_COOKIE)
            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens['access']

            res = Response({
                'refreshed': True,
                'access': access_token
            })
            return set_auth_cookies(res, access_token, refresh_token)

        except:
            return Response({'refreshed': False})

@extend_schema(
    responses=UserSerializer,
    description="Devuelve los datos del usuario autenticado. Requiere autenticación JWT."
)
class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return self.request.user

@extend_schema(
    request={
        "type": "object",
        "properties": {
            "email": {"type": "string", "format": "email", "description": "Email del usuario"}
        },
        "required": ["email"]
    },
    responses={200: OpenApiExample('Reset code sent', value={"message": "Código enviado al email"})},
    description="Envía un código de recuperación al email del usuario."
)
class SendResetCodeView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Llamada al servicio
        success, message = UserAuthService.send_password_reset_code(email)
        
        if success:
            return Response({'message': message}, status=status.HTTP_200_OK)
        return Response({'error': message}, status=status.HTTP_404_NOT_FOUND)

@extend_schema(
    request={
        "type": "object",
        "properties": {
            "email": {"type": "string", "format": "email", "description": "Email del usuario"},
            "reset_code": {"type": "string", "description": "Código recibido por email"},
            "new_password": {"type": "string", "description": "Nueva contraseña"}
        },
        "required": ["email", "reset_code", "new_password"]
    },
    responses={200: OpenApiExample('Password changed', value={"message": "Contraseña cambiada correctamente"})},
    description="Valida el código de recuperación y cambia la contraseña del usuario."
)
class ValidateResetCodeView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        data = request.data
        email = data.get('email')
        reset_code = data.get('reset_code')
        new_password = data.get('new_password')

        if not all([email, reset_code, new_password]):
            return Response({'error': 'Todos los campos son requeridos'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Llamada al servicio
        success, message = UserAuthService.validate_and_reset_password(email, reset_code, new_password)
        
        if success:
            return Response({'message': message}, status=status.HTTP_200_OK)
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    request=RegisterClientSerializer,
    responses={200: UserSerializer},
    description="Registra un nuevo usuario con rol cliente. Solo los campos username, email y password son obligatorios. El resto son opcionales."
)
class RegisterClientView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterClientSerializer

    def perform_create(self, serializer):
        # Usamos el servicio para crear el usuario
        UserAuthService.register_user(serializer)