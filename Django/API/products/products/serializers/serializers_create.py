from rest_framework import serializers
from ...models import Product, Attribute, Inventory, Category, ProductImage, ProductVariant, VariantAttribute, InventoryVariant, AttributeName
from django.db import models

class VariantAttributeCreateSerializer(serializers.Serializer):
    name = serializers.CharField()
    value = serializers.CharField()

class ProductVariantCreateSerializer(serializers.Serializer):
    attributes = VariantAttributeCreateSerializer(many=True)
    cantidad = serializers.FloatField()
    stock_minimo = serializers.FloatField()

class AttributeCreateSerializer(serializers.ModelSerializer):
    name = serializers.CharField() 

    class Meta:
        model = Attribute
        fields = ['name', 'value']

class InventoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['unidad_medida', 'cantidad', 'stock_minimo']

class ProductImageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['imagen']

class ProductCreateSerializer(serializers.ModelSerializer):
    attributes = AttributeCreateSerializer(many=True)
    inventario = InventoryCreateSerializer()
    category_ids = serializers.ListField(child=serializers.IntegerField(), required=False)
    variants = ProductVariantCreateSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = [
            'name', 'price_base', 'descripcion',
            'attributes', 'inventario', 'category_ids', 'variants'
        ]