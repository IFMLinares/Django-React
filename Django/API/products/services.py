# products/services.py
from django.db import transaction
from .models import Product, Attribute, Inventory, AttributeName, ProductVariant, InventoryVariant, Category

class ProductService:
    @staticmethod
    @transaction.atomic
    def create_product_with_details(business, data):
        # Extraer datos de relaciones
        attributes_data = data.pop('attributes', [])
        inventario_data = data.pop('inventario', None)
        variants_data = data.pop('variants', [])
        category_ids = data.pop('category_ids', [])

        # 1. Crear producto base
        product = Product.objects.create(business=business, **data)

        # 2. Categorías
        if category_ids:
            product.productos.set(Category.objects.filter(id__in=category_ids, business=business))

        # 3. Inventario
        if inventario_data:
            Inventory.objects.create(product=product, **inventario_data)

        # 4. Atributos
        for attr in attributes_data:
            attr_name_obj, _ = AttributeName.objects.get_or_create(name=attr['name'])
            Attribute.objects.create(product=product, name=attr_name_obj, value=attr['value'])

        # 5. Variantes
        for var_data in variants_data:
            ProductService._create_variant(product, var_data)

        return product

    @staticmethod
    @transaction.atomic
    def update_product(product, data):
        """Mueve aquí la lógica que estaba en el update del serializer."""
        attributes_data = data.pop('attributes', None)
        inventario_data = data.pop('inventario', None)
        variants_data = data.pop('variants', None)
        
        # Actualizar campos básicos
        for attr, value in data.items():
            setattr(product, attr, value)
        product.save()

        # Actualizar Inventario
        if inventario_data:
            Inventory.objects.update_or_create(product=product, defaults=inventario_data)

        # Actualizar Atributos (Borrar y crear es lo más seguro para sincronizar)
        if attributes_data is not None:
            product.attributes.all().delete()
            for attr in attributes_data:
                name_obj, _ = AttributeName.objects.get_or_create(name=attr['name'])
                Attribute.objects.create(product=product, name=name_obj, value=attr['value'])

        # Actualizar Variantes
        if variants_data is not None:
            product.variants.all().delete()
            for var_data in variants_data:
                ProductService._create_variant(product, var_data)

        return product

    @staticmethod
    def _create_variant(product, variant_data):
        attrs = variant_data.pop('attributes', [])
        cantidad = variant_data.pop('cantidad', 0)
        stock_minimo = variant_data.pop('stock_minimo', 5)
        
        variant = ProductVariant.objects.create(product=product)
        for attr in attrs:
            name_obj, _ = AttributeName.objects.get_or_create(name=attr['name'])
            from .models import VariantAttribute
            VariantAttribute.objects.create(variant=variant, name=name_obj, value=attr['value'])
            
        InventoryVariant.objects.create(variant=variant, cantidad=cantidad, stock_minimo=stock_minimo)