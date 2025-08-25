from django.urls import path
from .views.sale import *

urlpatterns = [
    path('', SaleListView.as_view(), name='sale-list'),
]