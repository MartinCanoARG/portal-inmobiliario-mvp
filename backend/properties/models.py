from decimal import Decimal

from django.db import models
from django.template.defaultfilters import slugify
from django.utils import timezone

from accounts.models import AdvertiserProfile


class Property(models.Model):
    class Currency(models.TextChoices):
        USD = "USD", "USD"
        ARS = "ARS", "ARS"

    class OperationType(models.TextChoices):
        SALE = "sale", "Venta"
        RENT = "rent", "Alquiler"

    class PropertyType(models.TextChoices):
        HOUSE = "house", "Casa"
        APARTMENT = "apartment", "Departamento"
        LAND = "land", "Terreno"
        SHOP = "shop", "Local"
        OFFICE = "office", "Oficina"
        GARAGE = "garage", "Cochera"
        COUNTRY_HOUSE = "country_house", "Quinta"
        WAREHOUSE = "warehouse", "Galpón"

    class PublicationState(models.TextChoices):
        DRAFT = "draft", "Borrador"
        PUBLISHED = "published", "Publicada"
        PAUSED = "paused", "Pausada"
        RESERVED = "reserved", "Reservada"
        SOLD = "sold", "Vendida"
        RENTED = "rented", "Alquilada"

    slug = models.SlugField(unique=True, max_length=220, blank=True)
    title = models.CharField(max_length=180)
    description = models.TextField()
    price = models.DecimalField(max_digits=14, decimal_places=2)
    currency = models.CharField(max_length=3, choices=Currency.choices, default=Currency.USD)
    operation_type = models.CharField(max_length=10, choices=OperationType.choices)
    property_type = models.CharField(max_length=20, choices=PropertyType.choices)
    city = models.CharField(max_length=100)
    zone = models.CharField(max_length=100)
    address = models.CharField(max_length=180, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, default=Decimal("-34.603722"))
    longitude = models.DecimalField(max_digits=9, decimal_places=6, default=Decimal("-58.381592"))
    square_meters = models.PositiveIntegerField(default=0)
    rooms = models.PositiveIntegerField(default=0)
    bedrooms = models.PositiveIntegerField(default=0)
    bathrooms = models.PositiveIntegerField(default=0)
    garage = models.BooleanField(default=False)
    patio = models.BooleanField(default=False)
    pool = models.BooleanField(default=False)
    age = models.PositiveIntegerField(default=0)
    state = models.CharField(
        max_length=12,
        choices=PublicationState.choices,
        default=PublicationState.DRAFT,
    )
    advertiser = models.ForeignKey(
        AdvertiserProfile,
        on_delete=models.CASCADE,
        related_name="properties",
    )
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-advertiser__plan__priority", "-published_at", "-created_at"]
        indexes = [
            models.Index(fields=["city", "zone"]),
            models.Index(fields=["operation_type", "property_type"]),
            models.Index(fields=["state", "published_at"]),
        ]

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.title}-{self.zone}-{self.city}")[:190]
            slug = base_slug
            counter = 2
            while Property.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                slug = f"{base_slug[:180]}-{counter}"
                counter += 1
            self.slug = slug

        if self.state == self.PublicationState.PUBLISHED and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    @property
    def cover_image_url(self) -> str:
        first_image = self.images.order_by("position", "id").first()
        return first_image.image_url if first_image else ""


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="images")
    image_url = models.URLField()
    caption = models.CharField(max_length=120, blank=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]

    def __str__(self) -> str:
        return f"Imagen {self.position} - {self.property.title}"


class ContactClick(models.Model):
    class ContactType(models.TextChoices):
        WHATSAPP = "whatsapp", "WhatsApp"
        PHONE = "phone", "Teléfono"
        WEBSITE = "website", "Sitio web"

    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="contact_clicks")
    contact_type = models.CharField(max_length=20, choices=ContactType.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
