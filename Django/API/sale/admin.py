from django.contrib import admin
from .models import PaymentMethod, Sale, SaleItem

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
	list_display = ('name', 'is_active')
	search_fields = ('name',)
	list_filter = ('is_active',)

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
	list_display = ('id', 'business', 'seller', 'total_amount', 'payment_method', 'sale_date')
	search_fields = ('business__name', 'seller__username', 'payment_method__name')
	list_filter = ('payment_method', 'sale_date')

@admin.register(SaleItem)
class SaleItemAdmin(admin.ModelAdmin):
	list_display = ('id', 'sale', 'product', 'variant', 'quantity', 'unit_price', 'subtotal')
	search_fields = ('sale__id', 'product__name', 'variant__id')
	list_filter = ('product',)
