from rest_framework import serializers
from ...models import Product, Attribute, Inventory, Category, ProductImage, ProductVariant, VariantAttribute, InventoryVariant, AttributeName

class AttributeDetailSerializer(serializers.ModelSerializer):
	class Meta:
		model = Attribute
		fields = ['name', 'value']

	def to_representation(self, instance):
		data = super().to_representation(instance)
		# Mostrar el nombre del atributo
		data['name'] = instance.name.name if hasattr(instance.name, 'name') else instance.name
		return data

class InventoryDetailSerializer(serializers.ModelSerializer):
	class Meta:
		model = Inventory
		fields = ['unidad_medida', 'cantidad', 'stock_minimo']

class CategoryDetailSerializer(serializers.ModelSerializer):
	class Meta:
		model = Category
		fields = ['nombre']

class ProductImageDetailSerializer(serializers.ModelSerializer):

	imagen = serializers.SerializerMethodField()

	class Meta:
		model = ProductImage
		fields = ['imagen']

	def get_imagen(self, obj):
		request = self.context.get('request')
		if request:
			return request.build_absolute_uri(obj.imagen.url)
		return obj.imagen.url

class VariantAttributeDetailSerializer(serializers.ModelSerializer):
	class Meta:
		model = VariantAttribute
		fields = ['name', 'value']

	def to_representation(self, instance):
		data = super().to_representation(instance)
		data['name'] = instance.name.name if hasattr(instance.name, 'name') else instance.name
		return data

class InventoryVariantDetailSerializer(serializers.ModelSerializer):
	class Meta:
		model = InventoryVariant
		fields = ['cantidad', 'stock_minimo']

class ProductVariantDetailSerializer(serializers.ModelSerializer):
	variant_attributes = VariantAttributeDetailSerializer(many=True, source='variant_attributes')
	inventario_variante = InventoryVariantDetailSerializer(source='inventario_variante', read_only=True)

	class Meta:
		model = ProductVariant
		fields = ['variant_attributes', 'inventario_variante']

class ProductDetailSerializer(serializers.ModelSerializer):
	attributes = AttributeDetailSerializer(many=True, read_only=True)
	inventario = InventoryDetailSerializer(read_only=True)
	categories = CategoryDetailSerializer(many=True, source='category_set', read_only=True)
	images = serializers.SerializerMethodField()
	variants = ProductVariantDetailSerializer(many=True, read_only=True)

	class Meta:
		model = Product
		fields = [
			'name', 'price_base', 'descripcion',
			'attributes', 'inventario', 'categories', 'images', 'variants'
		]

	def get_images(self, obj):
		images = obj.productimage_set.all()
		serializer = ProductImageDetailSerializer(images, many=True, context=self.context)
		return serializer.data
