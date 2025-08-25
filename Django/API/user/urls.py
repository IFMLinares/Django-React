from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, UserDetailView, LogoutView, SendResetCodeView, ValidateResetCodeView, RegisterClientView, CustomTokenRefreshView, LogoutCookieView

urlpatterns = [
    path('login/', LoginView.as_view(), name='user_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/refresh-cookie/', CustomTokenRefreshView.as_view(), name='token_refresh_cookie'),
    path('me/', UserDetailView.as_view(), name='user_me'),
    path('logout/', LogoutView.as_view(), name='user_logout'),
    path('logout-cookie/', LogoutCookieView.as_view(), name='user_logout_cookie'),
    path('send-reset-code/', SendResetCodeView.as_view(), name='user_send_reset_code'),
    path('validate-reset-code/', ValidateResetCodeView.as_view(), name='user_validate_reset_code'),
    path('register/', RegisterClientView.as_view(), name='user_register'),
]
