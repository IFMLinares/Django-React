
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiResponse
from ...models import Product, AttributeName
from ..serializers.serializers_create import ProductCreateSerializer

from ...models import Business

@extend_schema(
	request=ProductCreateSerializer,
	responses={
		200: OpenApiResponse(description="Producto actualizado exitosamente."),
		400: OpenApiResponse(description="Errores de validación."),
		404: OpenApiResponse(description="Producto no encontrado."),
		403: OpenApiResponse(description="No autorizado."),
	},
	description="Edita un producto existente por ID. Requiere autenticación."
)
class ProductUpdateView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request, pk, *args, **kwargs):
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
			return Response({"error": "No autorizado para editar este producto."}, status=status.HTTP_403_FORBIDDEN)

		data = request.data.copy()
		# Convertir 'name' de cada atributo a su id
		if 'attributes' in data:
			for attr in data['attributes']:
				if isinstance(attr.get('name'), str):
					try:
						attr_name_obj = AttributeName.objects.get(name=attr['name'])
						attr['name'] = attr_name_obj.id
					except AttributeName.DoesNotExist:
						return Response({"error": f"El atributo '{attr['name']}' no existe."}, status=status.HTTP_400_BAD_REQUEST)

		serializer = ProductCreateSerializer(product, data=data, partial=True)
		if serializer.is_valid():
			serializer.save()
			return Response({"success": True, "product_id": product.id}, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
