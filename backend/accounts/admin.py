from django.contrib import admin

from .models import AdvertiserProfile, Plan


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "priority",
        "max_properties",
        "max_images_per_property",
        "highlighted_home",
    )
    list_editable = ("priority", "highlighted_home")
    search_fields = ("name", "slug")


@admin.register(AdvertiserProfile)
class AdvertiserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "public_display_name",
        "advertiser_type",
        "plan",
        "phone",
        "email",
        "is_active",
    )
    list_filter = ("advertiser_type", "plan", "is_active")
    search_fields = (
        "visible_name",
        "business_name",
        "email",
        "phone",
        "license_number",
    )
    autocomplete_fields = ("user",)
