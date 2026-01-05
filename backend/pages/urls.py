from django.urls import path
from .views import PageDetailView
urlpatterns = [ path("pages/<slug:slug>/", PageDetailView.as_view()), ]
