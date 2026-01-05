from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
  path("admin/", admin.site.urls),
  path("api/auth/token/", TokenObtainPairView.as_view()),
  path("api/auth/token/refresh/", TokenRefreshView.as_view()),
  path("api/auth/", include("accounts.urls")),
  path("api/", include("garage.urls")),
  path("api/", include("pages.urls")),
]
