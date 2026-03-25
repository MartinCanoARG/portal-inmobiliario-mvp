from django.contrib import admin

from .models import ContactClick, Property, PropertyImage


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "city",
        "zone",
        "operation_type",
        "property_type",
        "state",
        "advertiser",
        "published_at",
    )
    list_filter = ("state", "operation_type", "property_type", "city", "advertiser__plan")
    search_fields = ("title", "zone", "city", "advertiser__visible_name", "advertiser__business_name")
    list_select_related = ("advertiser", "advertiser__plan")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [PropertyImageInline]


@admin.register(ContactClick)
class ContactClickAdmin(admin.ModelAdmin):
    list_display = ("property", "contact_type", "created_at")
    list_filter = ("contact_type",)
    search_fields = ("property__title",)
