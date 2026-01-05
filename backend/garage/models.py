from django.db import models
from django.contrib.auth.models import User

class Car(models.Model):
    name = models.CharField(max_length=120)
    brand = models.CharField(max_length=120)
    image = models.CharField(max_length=240, blank=True, default="")
    price = models.IntegerField()
    category = models.CharField(max_length=60)

    power = models.CharField(max_length=60, blank=True, default="")
    zero_to_hundred = models.CharField(max_length=60, blank=True, default="")
    drivetrain = models.CharField(max_length=60, blank=True, default="")
    seats = models.CharField(max_length=60, blank=True, default="")
    origin = models.CharField(max_length=120, blank=True, default="")
    description = models.TextField(blank=True, default="")
    is_featured = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.brand} {self.name}"

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name="favorited_by")
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ("user","car")

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_items")
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = ("user","car")

class BespokeRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=140)
    email = models.EmailField()
    preferred_marque = models.CharField(max_length=120, blank=True, default="")
    budget = models.CharField(max_length=80, blank=True, default="")
    focus = models.CharField(max_length=80, blank=True, default="")
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    full_name = models.CharField(max_length=180)
    email = models.EmailField()
    phone = models.CharField(max_length=60, blank=True, default="")
    address = models.TextField()
    total_price = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} ({self.user.username})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    car = models.ForeignKey(Car, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.IntegerField(default=0)

    def __str__(self):
        return f"OrderItem {self.order_id} - {self.car_id}"
