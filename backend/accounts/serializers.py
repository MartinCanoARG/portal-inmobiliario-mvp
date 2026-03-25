from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import AdvertiserProfile, Plan


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = (
            "id",
            "name",
            "slug",
            "priority",
            "max_properties",
            "max_images_per_property",
            "badge_label",
            "highlighted_home",
        )


class AdvertiserProfileSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)
    advertiser_type_label = serializers.CharField(source="get_advertiser_type_display", read_only=True)
    public_display_name = serializers.CharField(read_only=True)

    class Meta:
        model = AdvertiserProfile
        fields = (
            "id",
            "advertiser_type",
            "advertiser_type_label",
            "visible_name",
            "business_name",
            "public_display_name",
            "email",
            "phone",
            "whatsapp",
            "website",
            "license_number",
            "logo_url",
            "description",
            "plan",
            "is_active",
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        request = self.context.get("request")
        user = authenticate(request=request, username=attrs["username"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Credenciales inválidas.")
        if not user.is_active:
            raise serializers.ValidationError("La cuenta está desactivada.")
        attrs["user"] = user
        return attrs

    def create(self, validated_data):
        user = validated_data["user"]
        refresh = RefreshToken.for_user(user)
        profile = getattr(user, "advertiser_profile", None)
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "is_staff": user.is_staff,
            },
            "profile": AdvertiserProfileSerializer(profile).data if profile else None,
        }
