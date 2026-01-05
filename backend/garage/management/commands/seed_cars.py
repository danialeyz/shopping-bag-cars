from django.core.management.base import BaseCommand
from garage.models import Car

SEED = [
  {
    "id": 1,
    "name": "Ghost Black Badge",
    "brand": "Rolls-Royce",
    "image": "assets/1.png",
    "price": 420000,
    "category": "Sedan",
    "power": "592 hp",
    "zero_to_hundred": "4.6 s",
    "drivetrain": "V12 \u00b7 AWD",
    "seats": "4 seats",
    "origin": "Goodwood, UK",
    "description": "Understated presence with formidable torque, engineered for effortless cross\u2011continental cruising.",
    "is_featured": True
  },
  {
    "id": 2,
    "name": "Cullinan Black Badge",
    "brand": "Rolls-Royce",
    "image": "assets/2.png",
    "price": 450000,
    "category": "SUV",
    "power": "591 hp",
    "zero_to_hundred": "4.9 s",
    "drivetrain": "V12 \u00b7 AWD",
    "seats": "4\u20135 seats",
    "origin": "Goodwood, UK",
    "description": "A high\u2011riding Rolls\u2011Royce with genuine all\u2011terrain capability, finished in Black Badge form.",
    "is_featured": True
  },
  {
    "id": 3,
    "name": "AMG GT Black Series",
    "brand": "Mercedes\u2011AMG",
    "image": "assets/3.png",
    "price": 325000,
    "category": "Coupe",
    "power": "720 hp",
    "zero_to_hundred": "3.2 s",
    "drivetrain": "V8 \u00b7 RWD",
    "seats": "2 seats",
    "origin": "Affalterbach, DE",
    "description": "Track\u2011focused aero, handmade V8 and race\u2011derived suspension.",
    "is_featured": True
  },
  {
    "id": 4,
    "name": "Urus Performante",
    "brand": "Lamborghini",
    "image": "assets/4.png",
    "price": 260000,
    "category": "SUV",
    "power": "666 hp",
    "zero_to_hundred": "3.3 s",
    "drivetrain": "V8 \u00b7 AWD",
    "seats": "4\u20135 seats",
    "origin": "Sant\u2019Agata Bolognese, IT",
    "description": "Sharper, lighter and louder than the standard Urus.",
    "is_featured": True
  },
  {
    "id": 5,
    "name": "SF90 Stradale",
    "brand": "Ferrari",
    "image": "assets/5.png",
    "price": 507000,
    "category": "Hypercar",
    "power": "986 hp",
    "zero_to_hundred": "2.5 s",
    "drivetrain": "V8 Hybrid \u00b7 AWD",
    "seats": "2 seats",
    "origin": "Maranello, IT",
    "description": "Ferrari\u2019s plug\u2011in hybrid halo car with instant electric response.",
    "is_featured": True
  },
  {
    "id": 6,
    "name": "Continental GT Speed",
    "brand": "Bentley",
    "image": "assets/6.png",
    "price": 280000,
    "category": "Coupe",
    "power": "650 hp",
    "zero_to_hundred": "3.6 s",
    "drivetrain": "W12 \u00b7 AWD",
    "seats": "4 seats",
    "origin": "Crewe, UK",
    "description": "An opulent grand tourer with genuine continent\u2011crossing pace.",
    "is_featured": True
  },
  {
    "id": 7,
    "name": "Panamera Turbo S E\u2011Hybrid",
    "brand": "Porsche",
    "image": "assets/7.png",
    "price": 210000,
    "category": "Sedan",
    "power": "690 hp",
    "zero_to_hundred": "3.2 s",
    "drivetrain": "V8 Hybrid \u00b7 AWD",
    "seats": "4\u20135 seats",
    "origin": "Leipzig, DE",
    "description": "Four\u2011door practicality without sacrificing Porsche composure.",
    "is_featured": True
  },
  {
    "id": 8,
    "name": "DBX707",
    "brand": "Aston Martin",
    "image": "assets/8.png",
    "price": 235000,
    "category": "SUV",
    "power": "697 hp",
    "zero_to_hundred": "3.3 s",
    "drivetrain": "V8 \u00b7 AWD",
    "seats": "4\u20135 seats",
    "origin": "St Athan, UK",
    "description": "Design\u2011led luxury SUV with serious power.",
    "is_featured": True
  },
  {
    "id": 9,
    "name": "Hurac\u00e1n STO",
    "brand": "Lamborghini",
    "image": "assets/9.png",
    "price": 330000,
    "category": "Hypercar",
    "power": "640 hp",
    "zero_to_hundred": "3.0 s",
    "drivetrain": "V10 \u00b7 RWD",
    "seats": "2 seats",
    "origin": "Sant\u2019Agata Bolognese, IT",
    "description": "Road\u2011legal homologation special with extensive carbon and aero.",
    "is_featured": True
  }
]

class Command(BaseCommand):
    help = "Seed initial car catalog (safe to re-run)."

    def handle(self, *args, **options):
        created = 0
        updated = 0
        for item in SEED:
            car, was_created = Car.objects.update_or_create(
                id=item["id"],
                defaults={k: v for k, v in item.items() if k != "id"}
            )
            if was_created:
                created += 1
            else:
                updated += 1
        self.stdout.write(self.style.SUCCESS(f"Seed complete: created={created}, updated={updated}"))
