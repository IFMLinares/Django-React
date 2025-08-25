from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from ...models import Product, Business
from ..serializers.serializers import ProductSerializer

class ProductsByBusinessView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtra los productos por la empresa del usuario autenticado
        business_id = self.kwargs.get('business_id')
        # Opcional: solo permitir ver productos de empresas que pertenecen al usuario
        return Product.objects.filter(business__id=business_id, business__user=self.request.user)