from django.urls import path
from .views import CarListView, FavoriteListCreateView, FavoriteDeleteView, CartView, BespokeRequestCreateView, CheckoutView
urlpatterns = [
  path("cars/", CarListView.as_view()),
  path("favorites/", FavoriteListCreateView.as_view()),
  path("favorites/<int:car_id>/", FavoriteDeleteView.as_view()),
  path("cart/", CartView.as_view()),
  path("bespoke/", BespokeRequestCreateView.as_view()),
  path("checkout/", CheckoutView.as_view()),
]
