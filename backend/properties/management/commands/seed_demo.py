from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from accounts.models import AdvertiserProfile, Plan
from properties.models import Property, PropertyImage


User = get_user_model()

PHOTO_SETS = {
    "apartment": [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    ],
    "house": [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
    ],
    "office": [
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    ],
    "land": [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    ],
    "shop": [
        "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
    ],
    "garage": [
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    ],
    "warehouse": [
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80",
    ],
}

PROPERTY_FIXTURES = [
    ("premium-agency", "Semipiso premium con vista al río", "sale", "apartment", "Rosario", "Pichincha", "Jujuy 2100", "245000", "USD", 132, 4, 3, 2, True, False, True, 6, "-32.936702", "-60.650244", "apartment"),
    ("premium-agency", "Casa con jardín y pileta en barrio residencial", "sale", "house", "Funes", "Kentucky Club de Campo", "Lote 58", "390000", "USD", 280, 6, 4, 4, True, True, True, 4, "-32.918111", "-60.809944", "house"),
    ("premium-agency", "Oficina corporativa en microcentro", "rent", "office", "Rosario", "Centro", "Córdoba 1200", "1800000", "ARS", 210, 5, 0, 2, False, False, False, 12, "-32.944241", "-60.644299", "office"),
    ("premium-agency", "Departamento a estrenar para renta temporaria", "rent", "apartment", "Rosario", "Puerto Norte", "Av. Carballo 580", "980000", "ARS", 58, 2, 1, 1, True, False, True, 1, "-32.919888", "-60.664661", "apartment"),
    ("basic-agency", "Local comercial sobre avenida principal", "rent", "shop", "San Lorenzo", "Centro", "Av. San Martín 1450", "650000", "ARS", 95, 1, 0, 1, False, False, False, 18, "-32.744861", "-60.736801", "shop"),
    ("basic-agency", "Terreno listo para desarrollo", "sale", "land", "Roldán", "Tierra de Sueños 3", "Manzana 22", "58000", "USD", 420, 0, 0, 0, False, False, False, 0, "-32.897510", "-60.918133", "land"),
    ("basic-agency", "Galpón con salida rápida a autopista", "rent", "warehouse", "Villa Gobernador Gálvez", "Parque Industrial", "Colectora 900", "3200000", "ARS", 560, 2, 0, 2, True, True, False, 15, "-33.023502", "-60.638630", "warehouse"),
    ("basic-agency", "Casa familiar reciclada cerca del centro", "sale", "house", "San Lorenzo", "Bouchard", "Bv. Urquiza 800", "128000", "USD", 146, 5, 3, 2, True, True, False, 22, "-32.745895", "-60.727997", "house"),
    ("particular-demo", "Departamento luminoso ideal primera vivienda", "sale", "apartment", "Rosario", "Echesortu", "Mendoza 4200", "76000", "USD", 52, 3, 2, 1, False, False, False, 28, "-32.938080", "-60.690193", "apartment"),
    ("particular-demo", "Cochera cubierta en edificio moderno", "rent", "garage", "Rosario", "Abasto", "Necochea 1800", "95000", "ARS", 12, 0, 0, 0, True, False, False, 8, "-32.955956", "-60.631306", "garage"),
    ("particular-demo", "Quinta para escapadas de fin de semana", "sale", "country_house", "Álvarez", "Zona rural", "Camino comunal km 3", "99000", "USD", 180, 4, 2, 2, True, True, True, 14, "-33.129574", "-60.808529", "house"),
    ("premium-agency", "Lote con financiación en barrio abierto", "sale", "land", "Ibarlucea", "Estancia La Rinconada", "Lote 14", "42000", "USD", 360, 0, 0, 0, False, False, False, 0, "-32.851223", "-60.785519", "land"),
]


class Command(BaseCommand):
    help = "Carga planes, anunciantes y propiedades demo para el MVP."

    def handle(self, *args, **options):
        plans = self.create_plans()
        advertisers = self.create_users_and_profiles(plans)
        self.create_properties(advertisers)
        self.stdout.write(self.style.SUCCESS("Datos demo generados correctamente."))

    def create_plans(self):
        plan_data = [
            ("free", "Free", 1, 3, 4, "Free", False),
            ("basic", "Básico", 2, 15, 8, "Básico", False),
            ("premium", "Premium", 3, 999, 15, "Premium", True),
        ]
        plans = {}
        for slug, name, priority, max_props, max_images, badge, highlighted in plan_data:
            plan, _ = Plan.objects.update_or_create(
                slug=slug,
                defaults={
                    "name": name,
                    "priority": priority,
                    "max_properties": max_props,
                    "max_images_per_property": max_images,
                    "badge_label": badge,
                    "highlighted_home": highlighted,
                },
            )
            plans[slug] = plan
        return plans

    def create_users_and_profiles(self, plans):
        advertiser_specs = [
            {
                "username": "premium-agency",
                "password": "demo1234",
                "email": "premium@rioprop.com",
                "first_name": "Lucía",
                "last_name": "Molina",
                "profile": {
                    "advertiser_type": AdvertiserProfile.AdvertiserType.AGENCY,
                    "visible_name": "Lucía Molina",
                    "business_name": "Río Propiedades",
                    "phone": "+54 9 341 555 0101",
                    "whatsapp": "+5493415550101",
                    "website": "https://rioprop-demo.local",
                    "license_number": "Mat. COCIR 1842",
                    "logo_url": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80",
                    "description": "Especialistas en propiedades premium, inversión y renta corporativa.",
                    "plan": plans["premium"],
                    "is_active": True,
                },
            },
            {
                "username": "basic-agency",
                "password": "demo1234",
                "email": "contacto@corredornorte.com",
                "first_name": "Matías",
                "last_name": "Ruiz",
                "profile": {
                    "advertiser_type": AdvertiserProfile.AdvertiserType.AGENCY,
                    "visible_name": "Matías Ruiz",
                    "business_name": "Corredor Norte Inmuebles",
                    "phone": "+54 9 3476 55 2233",
                    "whatsapp": "+5493476552233",
                    "website": "https://corredornorte-demo.local",
                    "license_number": "Mat. COCIR 2280",
                    "logo_url": "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=300&q=80",
                    "description": "Cobertura regional para viviendas, locales y desarrollos del cordón industrial.",
                    "plan": plans["basic"],
                    "is_active": True,
                },
            },
            {
                "username": "particular-demo",
                "password": "demo1234",
                "email": "sofia.particular@example.com",
                "first_name": "Sofía",
                "last_name": "Martínez",
                "profile": {
                    "advertiser_type": AdvertiserProfile.AdvertiserType.OWNER,
                    "visible_name": "Sofía Martínez",
                    "business_name": "",
                    "phone": "+54 9 341 555 9821",
                    "whatsapp": "+5493415559821",
                    "website": "",
                    "license_number": "",
                    "logo_url": "",
                    "description": "Particular con propiedades propias para venta y alquiler.",
                    "plan": plans["free"],
                    "is_active": True,
                },
            },
        ]

        admin_user, _ = User.objects.get_or_create(
            username="admin",
            defaults={"email": "admin@local.demo", "is_staff": True, "is_superuser": True},
        )
        admin_user.set_password("admin1234")
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()

        advertisers = {}
        for spec in advertiser_specs:
            user, _ = User.objects.get_or_create(
                username=spec["username"],
                defaults={
                    "email": spec["email"],
                    "first_name": spec["first_name"],
                    "last_name": spec["last_name"],
                },
            )
            user.email = spec["email"]
            user.first_name = spec["first_name"]
            user.last_name = spec["last_name"]
            user.set_password(spec["password"])
            user.save()

            profile, _ = AdvertiserProfile.objects.update_or_create(
                user=user,
                defaults=spec["profile"] | {"email": spec["email"]},
            )
            advertisers[spec["username"]] = profile
        return advertisers

    def create_properties(self, advertisers):
        PropertyImage.objects.all().delete()
        Property.objects.all().delete()
        now = timezone.now()

        for offset, fixture in enumerate(PROPERTY_FIXTURES):
            (
                username,
                title,
                operation_type,
                property_type,
                city,
                zone,
                address,
                price,
                currency,
                square_meters,
                rooms,
                bedrooms,
                bathrooms,
                garage,
                patio,
                pool,
                age,
                latitude,
                longitude,
                photos_key,
            ) = fixture
            property_obj = Property.objects.create(
                advertiser=advertisers[username],
                title=title,
                description=(
                    f"{title} con excelente proyección comercial y buena conectividad. "
                    "El aviso se publica a modo demo para mostrar el MVP con datos realistas."
                ),
                price=Decimal(price),
                currency=currency,
                operation_type=operation_type,
                property_type=property_type,
                city=city,
                zone=zone,
                address=address,
                latitude=Decimal(latitude),
                longitude=Decimal(longitude),
                square_meters=square_meters,
                rooms=rooms,
                bedrooms=bedrooms,
                bathrooms=bathrooms,
                garage=garage,
                patio=patio,
                pool=pool,
                age=age,
                state=Property.PublicationState.PUBLISHED,
                published_at=now - timedelta(days=offset),
            )
            for position, image_url in enumerate(PHOTO_SETS[photos_key], start=1):
                PropertyImage.objects.create(
                    property=property_obj,
                    image_url=image_url,
                    caption=f"Imagen {position}",
                    position=position,
                )
