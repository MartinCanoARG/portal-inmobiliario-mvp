from django.conf import settings
from django.db import models


class Plan(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    priority = models.PositiveIntegerField(default=0)
    max_properties = models.PositiveIntegerField(default=3)
    max_images_per_property = models.PositiveIntegerField(default=5)
    badge_label = models.CharField(max_length=50)
    highlighted_home = models.BooleanField(default=False)

    class Meta:
        ordering = ["-priority", "name"]

    def __str__(self) -> str:
        return self.name


class AdvertiserProfile(models.Model):
    class AdvertiserType(models.TextChoices):
        AGENCY = "agency", "Inmobiliaria"
        OWNER = "owner", "Particular"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="advertiser_profile",
    )
    advertiser_type = models.CharField(
        max_length=20,
        choices=AdvertiserType.choices,
        default=AdvertiserType.OWNER,
    )
    visible_name = models.CharField(max_length=140)
    business_name = models.CharField(max_length=160, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    whatsapp = models.CharField(max_length=30, blank=True)
    website = models.URLField(blank=True)
    license_number = models.CharField(max_length=100, blank=True)
    logo_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT, related_name="advertisers")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-plan__priority", "visible_name"]

    def __str__(self) -> str:
        return self.public_display_name

    @property
    def is_agency(self) -> bool:
        return self.advertiser_type == self.AdvertiserType.AGENCY

    @property
    def public_display_name(self) -> str:
        if self.is_agency and self.business_name:
            return self.business_name
        return self.visible_name
