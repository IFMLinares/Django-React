
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiResponse
from ...models import Business, AttributeName
from ..serializers.serializers_create import ProductCreateSerializer

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

    def post(self, request, *args, **kwargs):
        print("Datos recibidos:", request.data)
        try:
            data = request.data.copy()
            # Buscar el negocio del usuario autenticado
            try:
                business_obj = Business.objects.get(user=request.user)
                data['business'] = business_obj.id
            except Business.DoesNotExist:
                return Response({"error": "El usuario no tiene un negocio asociado."}, status=status.HTTP_400_BAD_REQUEST)

            # Convertir 'name' de cada atributo a su id
            if 'attributes' in data:
                for attr in data['attributes']:
                    if isinstance(attr.get('name'), str):
                        try:
                            attr_name_obj = AttributeName.objects.get(name=attr['name'])
                            attr['name'] = attr_name_obj.id
                        except AttributeName.DoesNotExist:
                            return Response({"error": f"El atributo '{attr['name']}' no existe."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = ProductCreateSerializer(data=data)
            if serializer.is_valid():
                product = serializer.save()
                return Response({"success": True, "product_id": product.id}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Error al crear el producto:", str(e))
            return Response({"error": "Error al crear el producto"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
