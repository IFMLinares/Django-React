
# En products/views/unidad_medida.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse
from ...models import Inventory

@extend_schema(
    responses={200: OpenApiResponse(description="Retorna todas las unidades de medida disponibles como clave:valor.")},
    description="Obtiene todas las opciones de unidad de medida para productos. Requiere autenticación."
)
class UnidadMedidaListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        unidades = dict(Inventory._meta.get_field('unidad_medida').choices)
        return Response(unidades)