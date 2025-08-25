from django.urls import path, include


urlpatterns = [
    path('products/', include('API.products.products.urls')),
]
