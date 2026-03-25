import django_filters

from .models import Property


class PropertyFilter(django_filters.FilterSet):
    city = django_filters.CharFilter(field_name="city", lookup_expr="iexact")
    zone = django_filters.CharFilter(field_name="zone", lookup_expr="icontains")
    operation = django_filters.CharFilter(field_name="operation_type", lookup_expr="iexact")
    property_type = django_filters.CharFilter(field_name="property_type", lookup_expr="iexact")
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    min_rooms = django_filters.NumberFilter(field_name="rooms", lookup_expr="gte")
    min_bedrooms = django_filters.NumberFilter(field_name="bedrooms", lookup_expr="gte")
    min_bathrooms = django_filters.NumberFilter(field_name="bathrooms", lookup_expr="gte")
    garage = django_filters.BooleanFilter(field_name="garage")

    class Meta:
        model = Property
        fields = (
            "city",
            "zone",
            "operation",
            "property_type",
            "min_price",
            "max_price",
            "min_rooms",
            "min_bedrooms",
            "min_bathrooms",
            "garage",
        )
