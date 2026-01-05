from django.contrib import admin
from .models import Page, PageModule

class PageModuleInline(admin.TabularInline):
    model = PageModule
    extra = 0
    fields = ("order","type","props")
    ordering = ("order",)

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("slug","title")
    search_fields = ("slug","title")
    inlines = [PageModuleInline]
