from rest_framework import serializers
from ...models import Product, ProductImage, Attribute, Inventory, ProductVariant, VariantAttribute, InventoryVariant

class AttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attribute
        fields = ['id', 'name', 'value']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'imagen']

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['id', 'unidad_medida', 'cantidad', 'stock_minimo']

class VariantAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VariantAttribute
        fields = ['id', 'name', 'value']

class InventoryVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryVariant
        fields = ['id', 'cantidad', 'stock_minimo']

class ProductVariantSerializer(serializers.ModelSerializer):
    variant_attributes = VariantAttributeSerializer(many=True, read_only=True)
    inventario_variante = InventoryVariantSerializer(read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'variant_attributes', 'inventario_variante']

class ProductSerializer(serializers.ModelSerializer):
    attributes = AttributeSerializer(many=True, read_only=True)
    images = ProductImageSerializer(source='productimage_set', many=True, read_only=True)
    inventario = InventorySerializer(read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'business', 'name', 'price_base', 'descripcion',
            'attributes', 'images', 'inventario', 'variants'
        ]