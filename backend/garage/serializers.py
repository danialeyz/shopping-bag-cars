from rest_framework import serializers
from .models import Car, Favorite, CartItem, BespokeRequest

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = ("id","name","brand","image","price","category","power","zero_to_hundred","drivetrain","seats","origin","description","is_featured")

class FavoriteSerializer(serializers.ModelSerializer):
    car = CarSerializer(read_only=True)
    car_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Favorite
        fields = ("id","car","car_id","created_at")

class CartItemSerializer(serializers.ModelSerializer):
    car = CarSerializer(read_only=True)
    car_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = CartItem
        fields = ("id","car","car_id","quantity","updated_at")

class BespokeRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BespokeRequest
        fields = ("id","name","email","preferred_marque","budget","focus","notes","created_at")
