from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.timezone import now, timedelta
from django.core.mail import send_mail
from django.conf import settings
from .models import User
from .serializers import LoginSerializer, UserSerializer, RegisterClientSerializer
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from drf_spectacular.utils import extend_schema, OpenApiExample

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
        response = super().post(request, *args, **kwargs)
        tokens = response.data

        access_token = tokens['access']
        refresh_token = tokens['refresh']
        res = Response({
        'success': True,
                'access': access_token,
            'refresh': refresh_token
        })
        res.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=True,
            samesite=None,
            path='/api/',
        )
        res.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite=None,
            path='/api/',
        )
        return res

@extend_schema(
    responses={200: OpenApiExample('Logout ok', value={"message": "Logout exitoso"})},
    description="Logout para web: invalida el refresh token y elimina las cookies JWT."
)
class LogoutCookieView(APIView):
    def post(self, request):
        try:
            res = Response()
            res.data = {'success': True}
            # Usar el mismo path que en el login
            res.delete_cookie('access_token', path='/api/', samesite=None)
            res.delete_cookie('refresh_token', path='/api/', samesite=None)
            return res
        except Exception:
            return Response({'success': False})

@extend_schema(
    request={
        "type": "object",
        "properties": {
            "refresh": {"type": "string", "description": "Refresh token JWT"}
        },
        "required": ["refresh"]
    },
    responses={200: OpenApiExample('Logout ok', value={"message": "Logout exitoso"})},
    description="Invalida el refresh token JWT del usuario autenticado."
)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout exitoso'})
        except Exception:
            return Response({'error': 'Token inválido o ya fue deshabilitado'}, status=400)

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens['access']

            res = Response({
                'refreshed': True,
                'access': access_token
            })
            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite=None,
                path='/api/',
            )
            return res

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
            return Response({'error': 'Email requerido'}, status=400)
        try:
            user = User.objects.get(email=email)
            import random
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
            return Response({'message': 'Código enviado al email'})
        except User.DoesNotExist:
            return Response({'error': 'No existe usuario con ese email'}, status=404)

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
        email = request.data.get('email')
        reset_code = request.data.get('reset_code')
        new_password = request.data.get('new_password')
        if not all([email, reset_code, new_password]):
            return Response({'error': 'Email, código y nueva contraseña requeridos'}, status=400)
        try:
            user = User.objects.get(email=email)
            if str(user.reset_code) != str(reset_code):
                return Response({'error': 'Código incorrecto'}, status=400)
            if now() > user.reset_code_created_at + timedelta(minutes=10):
                return Response({'error': 'Código expirado'}, status=400)
            user.set_password(new_password)
            user.reset_code = None
            user.reset_code_created_at = None
            user.save()
            return Response({'message': 'Contraseña cambiada correctamente'})
        except User.DoesNotExist:
            return Response({'error': 'No existe usuario con ese email'}, status=404)

@extend_schema(
    request=RegisterClientSerializer,
    responses={200: UserSerializer},
    description="Registra un nuevo usuario con rol cliente. Solo los campos username, email y password son obligatorios. El resto son opcionales."
)
class RegisterClientView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterClientSerializer