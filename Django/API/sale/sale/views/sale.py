from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from ...models import Sale, Business
from ..serializers.serializer_sale import SaleSerializer

# list de las ventas
class SaleListView(generics.ListAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        business_id = self.kwargs.get('business_id')
        return Sale.objects.filter(business__id=business_id)