from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()
# Create your models here.

class Business(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='businesses')
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Negocio"
        verbose_name_plural = "Negocios"

class Product(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=100)
    price_base = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"

class AttributeName(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Nombre de Atributo"
        verbose_name_plural = "Nombres de Atributos"

class Attribute(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='attributes')
    name = models.ForeignKey(AttributeName, on_delete=models.CASCADE, related_name='attributes')
    value = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name.name}: {self.value}"

    class Meta:
        verbose_name = "Atributo"
        verbose_name_plural = "Atributos"

class Inventory(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='inventario')
    unidad_medida = models.CharField(max_length=10, choices=[
        ('unidad', 'Unidad'),
        ('kg', 'Kilogramo'),
        ('litro', 'Litro'),
        ('docena', 'Docena'),
    ])
    cantidad = models.FloatField(default=0)
    stock_minimo = models.FloatField(default=5)

    class Meta:
        verbose_name = "Inventario"
        verbose_name_plural = "Inventarios"

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')

    def __str__(self):
        return f"Variante de {self.product.name}"

    class Meta:
        verbose_name = "Variante de Producto"
        verbose_name_plural = "Variantes de Producto"

class VariantAttribute(models.Model):
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='variant_attributes')
    name = models.ForeignKey(AttributeName, on_delete=models.CASCADE)
    value = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name.name}: {self.value}"

    class Meta:
        verbose_name = "Atributo de Variante"
        verbose_name_plural = "Atributos de Variante"

class InventoryVariant(models.Model):
    variant = models.OneToOneField(ProductVariant, on_delete=models.CASCADE, related_name='inventario_variante')
    cantidad = models.FloatField(default=0)
    stock_minimo = models.FloatField(default=5)

    def __str__(self):
        return f"Inventario de {self.variant}"

    class Meta:
        verbose_name = "Inventario de Variante"
        verbose_name_plural = "Inventarios de Variante"

class Category(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=50)
    productos = models.ManyToManyField(Product)

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='productos/')

    class Meta:
        verbose_name = "Imagen de Producto"
        verbose_name_plural = "Imágenes de Productos"

