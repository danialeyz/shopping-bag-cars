from django.contrib import admin
from .models import Car, Favorite, CartItem, BespokeRequest, Order, OrderItem

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ("id","brand","name","category","price","is_featured")
    list_filter = ("category","brand","is_featured")
    search_fields = ("brand","name")

admin.site.register(Favorite)
admin.site.register(CartItem)
admin.site.register(BespokeRequest)

admin.site.register(Order)
admin.site.register(OrderItem)
