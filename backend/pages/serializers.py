from rest_framework import serializers
from .models import Page, PageModule

class PageModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageModule
        fields = ("order","type","props")

class PageSerializer(serializers.ModelSerializer):
    modules = PageModuleSerializer(many=True, read_only=True)
    class Meta:
        model = Page
        fields = ("slug","title","modules")
