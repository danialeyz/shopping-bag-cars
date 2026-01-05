from django.db import models

class Page(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200, blank=True, default="")
    def __str__(self): return self.slug

class PageModule(models.Model):
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="modules")
    order = models.PositiveIntegerField(default=0)
    type = models.CharField(max_length=50)
    props = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ("order",)

    def __str__(self): return f"{self.page.slug}:{self.order}:{self.type}"
