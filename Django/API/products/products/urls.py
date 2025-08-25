from django.urls import path
from .views.list import *
from .views.create import ProductRegisterView
from .views.attributename import AttributeNameListView, AttributeNameCreateView
from .views.unidad_medida import UnidadMedidaListView

urlpatterns = [
    path('business/<int:business_id>/', ProductsByBusinessView.as_view(), name='business-products'),
    path('register/', ProductRegisterView.as_view(), name='product-register'),
    path('attribute-names/', AttributeNameListView.as_view(), name='attribute-names-list'),
    path('attribute-names/create/', AttributeNameCreateView.as_view(), name='attribute-names-create'),
    path('unidad-medida/', UnidadMedidaListView.as_view(), name='unidad-medida-list'),
]