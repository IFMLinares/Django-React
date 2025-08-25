
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiResponse
from ...models import Product
from ..serializers.serializer_view import ProductDetailSerializer

from rest_framework.permissions import IsAuthenticated
from ...models import Business

@extend_schema(
	responses={
		200: ProductDetailSerializer,
		404: OpenApiResponse(description="Producto no encontrado."),
		403: OpenApiResponse(description="No autorizado."),
	},
	description="Obtiene el detalle de un producto por ID. Requiere autenticación."
)
class ProductDetailView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, pk, *args, **kwargs):
		try:
			product = Product.objects.get(pk=pk)
		except Product.DoesNotExist:
			return Response({"error": "Producto no encontrado."}, status=status.HTTP_404_NOT_FOUND)

		# Validar que el producto pertenezca al negocio del usuario
		try:
			business_obj = Business.objects.get(user=request.user)
		except Business.DoesNotExist:
			return Response({"error": "El usuario no tiene un negocio asociado."}, status=status.HTTP_403_FORBIDDEN)

		if product.business_id != business_obj.id:
			return Response({"error": "No autorizado para ver este producto."}, status=status.HTTP_403_FORBIDDEN)

		serializer = ProductDetailSerializer(product, context={'request': request})
		return Response(serializer.data, status=status.HTTP_200_OK)
