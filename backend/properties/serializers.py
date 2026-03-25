from rest_framework import serializers

from accounts.serializers import AdvertiserProfileSerializer, PlanSerializer

from .models import ContactClick, Property, PropertyImage


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ("id", "image_url", "caption", "position")


class PropertyListSerializer(serializers.ModelSerializer):
    advertiser = AdvertiserProfileSerializer(read_only=True)
    plan = PlanSerializer(source="advertiser.plan", read_only=True)
    cover_image_url = serializers.CharField(read_only=True)
    operation_label = serializers.CharField(source="get_operation_type_display", read_only=True)
    property_type_label = serializers.CharField(source="get_property_type_display", read_only=True)

    class Meta:
        model = Property
        fields = (
            "id",
            "slug",
            "title",
            "price",
            "currency",
            "operation_type",
            "operation_label",
            "property_type",
            "property_type_label",
            "city",
            "zone",
            "address",
            "square_meters",
            "rooms",
            "bedrooms",
            "bathrooms",
            "garage",
            "patio",
            "pool",
            "age",
            "state",
            "published_at",
            "cover_image_url",
            "advertiser",
            "plan",
            "latitude",
            "longitude",
        )


class PropertyDetailSerializer(PropertyListSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    state_label = serializers.CharField(source="get_state_display", read_only=True)

    class Meta(PropertyListSerializer.Meta):
        fields = PropertyListSerializer.Meta.fields + ("description", "images", "state_label")


class DashboardPropertyWriteSerializer(serializers.ModelSerializer):
    image_urls = serializers.ListField(
        child=serializers.URLField(),
        allow_empty=True,
        write_only=True,
        required=False,
    )
    advertiser = AdvertiserProfileSerializer(read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = (
            "id",
            "slug",
            "title",
            "description",
            "price",
            "currency",
            "operation_type",
            "property_type",
            "city",
            "zone",
            "address",
            "latitude",
            "longitude",
            "square_meters",
            "rooms",
            "bedrooms",
            "bathrooms",
            "garage",
            "patio",
            "pool",
            "age",
            "state",
            "published_at",
            "advertiser",
            "images",
            "image_urls",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("slug", "published_at", "created_at", "updated_at")

    def validate(self, attrs):
        request = self.context["request"]
        advertiser = request.user.advertiser_profile
        image_urls = attrs.get("image_urls")
        instance = getattr(self, "instance", None)
        active_states = {
            Property.PublicationState.PUBLISHED,
            Property.PublicationState.PAUSED,
            Property.PublicationState.RESERVED,
        }

        if instance is None and attrs.get("state", Property.PublicationState.DRAFT) in active_states:
            active_count = advertiser.properties.filter(state__in=active_states).count()
            if active_count >= advertiser.plan.max_properties:
                raise serializers.ValidationError(
                    f"Tu plan actual permite hasta {advertiser.plan.max_properties} propiedades activas."
                )

        if image_urls is not None and len(image_urls) > advertiser.plan.max_images_per_property:
            raise serializers.ValidationError(
                f"Tu plan actual permite hasta {advertiser.plan.max_images_per_property} imágenes por propiedad."
            )
        return attrs

    def create(self, validated_data):
        image_urls = validated_data.pop("image_urls", [])
        property_obj = Property.objects.create(
            advertiser=self.context["request"].user.advertiser_profile,
            **validated_data,
        )
        self._sync_images(property_obj, image_urls)
        return property_obj

    def update(self, instance, validated_data):
        image_urls = validated_data.pop("image_urls", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if image_urls is not None:
            self._sync_images(instance, image_urls)
        return instance

    def _sync_images(self, property_obj: Property, image_urls: list[str]) -> None:
        property_obj.images.all().delete()
        for index, image_url in enumerate(image_urls, start=1):
            PropertyImage.objects.create(
                property=property_obj,
                image_url=image_url,
                caption=f"Vista {index}",
                position=index,
            )


class ContactClickSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactClick
        fields = ("id", "property", "contact_type", "created_at")
