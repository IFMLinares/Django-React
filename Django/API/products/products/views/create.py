
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiResponse
from ...models import Business, AttributeName
from ..serializers.serializers_create import ProductCreateSerializer
from ...services import ProductService

@extend_schema(
    request=ProductCreateSerializer,
    responses={
        201: OpenApiResponse(description="Producto creado exitosamente. Retorna el ID del producto."),
        400: OpenApiResponse(description="Errores de validación en el producto."),
    },
    description="Registra un nuevo producto en el sistema. Requiere autenticación."
)
class ProductRegisterView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            business = Business.objects.get(user=request.user)
        except Business.DoesNotExist:
            return Response({"error": "Usuario sin negocio."}, status=403)

        serializer = ProductCreateSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # El servicio ahora orquesta TODO
                product = ProductService.create_product_with_details(
                    business=business, 
                    data=serializer.validated_data
                )
                return Response({"success": True, "product_id": product.id}, status=201)
            except Exception as e:
                # Capturamos errores de lógica de negocio o base de datos
                return Response({"error": str(e)}, status=400)
        
        return Response(serializer.errors, status=400)

