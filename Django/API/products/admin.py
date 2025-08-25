from django.contrib import admin
from .models import Business, Product, Attribute, Inventory, Category, ProductImage, AttributeName

admin.site.register(Business)
admin.site.register(Product)
admin.site.register(Attribute)
admin.site.register(Inventory)
admin.site.register(Category)
admin.site.register(ProductImage)
admin.site.register(AttributeName)
