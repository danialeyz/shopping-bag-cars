from django.core.management.base import BaseCommand
from pages.models import Page, PageModule

SEED = {
  "home": [
    {
      "order": 10,
      "type": "hero",
      "props": {
        "eyebrow": "Private Collection",
        "title": "Timeless Metal. Modern Power.",
        "subtitle": "Curated luxury performance vehicles, configured for the way you move.",
        "image": "assets/icon_DE.png",
        "primaryCta": {
          "label": "Explore collection",
          "to": "/"
        },
        "secondaryCta": {
          "label": "Bespoke request",
          "to": "/bespoke"
        }
      }
    },
    {
      "order": 20,
      "type": "inventory",
      "props": {
        "title": "Featured Inventory",
        "subtitle": "Flagship models available now",
        "endpoint": "/api/cars/?featured=1",
        "showFilters": True
      }
    }
  ],
  "garage": [
    {
      "order": 10,
      "type": "pageHeader",
      "props": {
        "eyebrow": "Member",
        "title": "My Garage",
        "subtitle": "Saved models and your shortlist cart."
      }
    },
    {
      "order": 20,
      "type": "garage",
      "props": {}
    }
  ],
  "bespoke": [
    {
      "order": 10,
      "type": "pageHeader",
      "props": {
        "eyebrow": "Concierge",
        "title": "Bespoke",
        "subtitle": "Tell us what you want. We’ll build it."
      }
    },
    {
      "order": 20,
      "type": "bespoke",
      "props": {}
    }
  ],
  "about": [
    {
      "order": 10,
      "type": "pageHeader",
      "props": {
        "eyebrow": "Studio",
        "title": "About Danial Garage",
        "subtitle": "A private collection with a concierge mindset."
      }
    },
    {
      "order": 20,
      "type": "text",
      "props": {
        "content": "We curate halo vehicles and limited builds, pairing design taste with performance engineering. Our workflow is simple: shortlist, enquire, and let our concierge handle the details."
      }
    },
    {
      "order": 30,
      "type": "text",
      "props": {
        "content": "This site is module-driven. An admin can edit products and rearrange page modules inside Django Admin — no coding required."
      }
    }
  ],
  "login": [
    {
      "order": 10,
      "type": "auth",
      "props": {
        "mode": "login",
        "title": "Sign in",
        "subtitle": "Access your favourites, cart and bespoke requests."
      }
    }
  ],
  "signup": [
    {
      "order": 10,
      "type": "auth",
      "props": {
        "mode": "signup",
        "title": "Create account",
        "subtitle": "Join to save models and manage your shortlist."
      }
    }
  ],
  "dashboard": [
    {
      "order": 10,
      "type": "dashboard",
      "props": {}
    }
  ],
  "compare": [
    {
      "order": 10,
      "type": "pageHeader",
      "props": {
        "eyebrow": "Tools",
        "title": "Compare",
        "subtitle": "Select up to four models to compare specs."
      }
    },
    {
      "order": 20,
      "type": "compare",
      "props": {}
    }
  ],
  "checkout": [
    {
      "order": 10,
      "type": "pageHeader",
      "props": {
        "eyebrow": "Order",
        "title": "Checkout",
        "subtitle": "Confirm details and submit your request."
      }
    },
    {
      "order": 20,
      "type": "checkout",
      "props": {}
    }
  ]
}

class Command(BaseCommand):
    help = "Seed module pages (safe to re-run)."

    def handle(self, *args, **options):
        for slug, modules in SEED.items():
            page, _ = Page.objects.update_or_create(slug=slug, defaults={"title": slug.title()})
            PageModule.objects.filter(page=page).delete()
            for m in modules:
                PageModule.objects.create(page=page, order=m["order"], type=m["type"], props=m.get("props", {}))
        self.stdout.write(self.style.SUCCESS("Pages seeded."))
