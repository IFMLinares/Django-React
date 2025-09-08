from django.contrib import admin
from .models import *

admin.site.register(Business)
admin.site.register(Product)
admin.site.register(Attribute)
admin.site.register(Inventory)
admin.site.register(Category)
admin.site.register(ProductImage)
admin.site.register(AttributeName)
# variantes 
admin.site.register(ProductVariant)
admin.site.register(VariantAttribute)
admin.site.register(InventoryVariant)

