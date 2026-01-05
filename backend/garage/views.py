from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from .models import Car, Favorite, CartItem, BespokeRequest, Order, OrderItem
from .serializers import CarSerializer, FavoriteSerializer, CartItemSerializer, BespokeRequestSerializer

class CarListView(generics.ListAPIView):
    serializer_class = CarSerializer
    permission_classes = [permissions.AllowAny]
    def get_queryset(self):
        qs = Car.objects.all().order_by("id")
        featured = self.request.query_params.get("featured")
        if featured in ("1","true","yes"):
            qs = qs.filter(is_featured=True)
        return qs

class FavoriteListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        qs = Favorite.objects.filter(user=request.user).select_related("car").order_by("-created_at")
        return Response(FavoriteSerializer(qs, many=True).data)
    def post(self, request):
        serializer = FavoriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        car_id = serializer.validated_data["car_id"]
        car = Car.objects.filter(id=car_id).first()
        if not car:
            return Response({"detail":"Car not found"}, status=status.HTTP_404_NOT_FOUND)
        fav, _ = Favorite.objects.get_or_create(user=request.user, car=car)
        return Response(FavoriteSerializer(fav).data, status=status.HTTP_201_CREATED)

class FavoriteDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def delete(self, request, car_id: int):
        Favorite.objects.filter(user=request.user, car_id=car_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        items = CartItem.objects.filter(user=request.user).select_related("car").order_by("car_id")
        return Response(CartItemSerializer(items, many=True).data)

    @transaction.atomic
    def post(self, request):
        car_id = request.data.get("car_id")
        qty = int(request.data.get("quantity", 1))
        if not car_id:
            return Response({"detail":"car_id required"}, status=status.HTTP_400_BAD_REQUEST)
        car = Car.objects.filter(id=car_id).first()
        if not car:
            return Response({"detail":"Car not found"}, status=status.HTTP_404_NOT_FOUND)
        item, created = CartItem.objects.get_or_create(user=request.user, car=car, defaults={"quantity": max(qty,1)})
        if not created:
            item.quantity = max(1, item.quantity + qty)
            item.save()
        return Response(CartItemSerializer(item).data, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def patch(self, request):
        car_id = request.data.get("car_id")
        qty = request.data.get("quantity")
        if not car_id or qty is None:
            return Response({"detail":"car_id and quantity required"}, status=status.HTTP_400_BAD_REQUEST)
        qty = int(qty)
        item = CartItem.objects.filter(user=request.user, car_id=car_id).first()
        if not item:
            return Response({"detail":"Item not found"}, status=status.HTTP_404_NOT_FOUND)
        if qty <= 0:
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        item.quantity = qty
        item.save()
        return Response(CartItemSerializer(item).data)

    def delete(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class BespokeRequestCreateView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = BespokeRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save(user=request.user if request.user.is_authenticated else None)
        return Response(BespokeRequestSerializer(obj).data, status=status.HTTP_201_CREATED)


class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        full_name = (request.data.get("full_name") or "").strip()
        email = (request.data.get("email") or "").strip()
        phone = (request.data.get("phone") or "").strip()
        address = (request.data.get("address") or "").strip()

        if not full_name or not email or not address:
            return Response({"detail":"full_name, email and address are required"}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = CartItem.objects.filter(user=request.user).select_related("car")
        if not cart_items.exists():
            return Response({"detail":"Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        total = 0
        order = Order.objects.create(
            user=request.user,
            full_name=full_name,
            email=email,
            phone=phone,
            address=address,
            total_price=0,
        )

        for it in cart_items:
            unit = int(it.car.price)
            qty = int(it.quantity)
            total += unit * qty
            OrderItem.objects.create(order=order, car=it.car, quantity=qty, unit_price=unit)

        order.total_price = total
        order.save()
        cart_items.delete()

        return Response({"order_id": order.id, "total": total}, status=status.HTTP_201_CREATED)
