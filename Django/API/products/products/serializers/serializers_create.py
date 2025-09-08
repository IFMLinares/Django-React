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
    def update(self, instance, validated_data):
        # Actualiza campos simples
        instance.name = validated_data.get('name', instance.name)
        instance.price_base = validated_data.get('price_base', instance.price_base)
        instance.descripcion = validated_data.get('descripcion', instance.descripcion)
        instance.save()

        # Actualiza inventario
        inventario_data = validated_data.get('inventario')
        if inventario_data:
            if hasattr(instance, 'inventario'):
                for attr, value in inventario_data.items():
                    setattr(instance.inventario, attr, value)
                instance.inventario.save()
            else:
                Inventory.objects.create(product=instance, **inventario_data)

        # Actualiza atributos
        attributes_data = validated_data.get('attributes')
        if attributes_data is not None:
            instance.attributes.all().delete()
            for attr in attributes_data:
                # Si Attribute.name es FK a AttributeName
                if hasattr(Attribute, 'name') and isinstance(Attribute._meta.get_field('name'), models.ForeignKey):
                    attr_name_obj, _ = AttributeName.objects.get_or_create(name=attr['name'])
                    Attribute.objects.create(product=instance, name=attr_name_obj, value=attr['value'])
                else:
                    Attribute.objects.create(product=instance, **attr)

        # Actualiza variantes
        variants_data = validated_data.get('variants')
        if variants_data is not None:
            instance.variants.all().delete()
            for variant_data in variants_data:
                attributes = variant_data.pop('attributes', [])
                cantidad = variant_data.get('cantidad', 0)
                stock_minimo = variant_data.get('stock_minimo', 0)
                variant = ProductVariant.objects.create(product=instance)
                for attr in attributes:
                    if hasattr(VariantAttribute, 'name') and isinstance(VariantAttribute._meta.get_field('name'), models.ForeignKey):
                        attr_name_obj, _ = AttributeName.objects.get_or_create(name=attr['name'])
                        VariantAttribute.objects.create(variant=variant, name=attr_name_obj, value=attr['value'])
                    else:
                        VariantAttribute.objects.create(variant=variant, name=attr['name'], value=attr['value'])
                InventoryVariant.objects.create(variant=variant, cantidad=cantidad, stock_minimo=stock_minimo)

        return instance
    attributes = AttributeCreateSerializer(many=True)
    inventario = InventoryCreateSerializer()
    images = ProductImageCreateSerializer(many=True, required=False)
    category_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    variants = ProductVariantCreateSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = [
            'business', 'name', 'price_base', 'descripcion',
            'attributes', 'inventario', 'images', 'category_ids', 'variants'
        ]

    def create(self, validated_data):
        attributes_data = validated_data.pop('attributes', [])
        inventario_data = validated_data.pop('inventario', None)
        images_data = validated_data.pop('images', [])
        category_ids = validated_data.pop('category_ids', [])
        variants_data = validated_data.pop('variants', [])

        product = Product.objects.create(**validated_data)

        # Attributes
        for attr in attributes_data:
            # Si Attribute.name es FK a AttributeName
            if hasattr(Attribute, 'name') and isinstance(Attribute._meta.get_field('name'), models.ForeignKey):
                attr_name_obj, _ = AttributeName.objects.get_or_create(name=attr['name'])
                Attribute.objects.create(product=product, name=attr_name_obj, value=attr['value'])
            else:
                Attribute.objects.create(product=product, **attr)
        # Inventory
        if inventario_data:
            Inventory.objects.create(product=product, **inventario_data)
        # Images
        for img in images_data:
            ProductImage.objects.create(product=product, **img)
        # Categories
        if category_ids:
            product.category_set.set(Category.objects.filter(id__in=category_ids))

        # Variants
        for variant_data in variants_data:
            attributes_data = variant_data.pop('attributes', [])
            cantidad = variant_data.get('cantidad', 0)
            stock_minimo = variant_data.get('stock_minimo', 0)
            variant = ProductVariant.objects.create(product=product)
            for attr in attributes_data:
                # Si VariantAttribute.name es FK a AttributeName
                if hasattr(VariantAttribute, 'name') and isinstance(VariantAttribute._meta.get_field('name'), models.ForeignKey):
                    attr_name_obj, _ = AttributeName.objects.get_or_create(name=attr['name'])
                    VariantAttribute.objects.create(variant=variant, name=attr_name_obj, value=attr['value'])
                else:
                    VariantAttribute.objects.create(variant=variant, name=attr['name'], value=attr['value'])
            InventoryVariant.objects.create(variant=variant, cantidad=cantidad, stock_minimo=stock_minimo)

        return product
