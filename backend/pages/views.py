from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Page
from .serializers import PageSerializer

class PageDetailView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, slug: str):
        page = Page.objects.filter(slug=slug).first()
        if not page:
            return Response({"detail":"Page not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(PageSerializer(page).data)
