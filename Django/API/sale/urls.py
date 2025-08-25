from django.urls import path, include


urlpatterns = [
    path('', include('API.sale.sale.urls')),
]
