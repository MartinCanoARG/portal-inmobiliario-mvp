from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets

from .filters import PropertyFilter
from .models import Property
from .serializers import DashboardPropertyWriteSerializer, PropertyDetailSerializer, PropertyListSerializer


class PublicPropertyViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = PropertyFilter
    ordering_fields = ["price", "published_at", "square_meters"]
    lookup_field = "slug"

    def get_queryset(self):
        return (
            Property.objects.select_related("advertiser", "advertiser__plan", "advertiser__user")
            .prefetch_related("images")
            .filter(
                advertiser__is_active=True,
                state__in=[Property.PublicationState.PUBLISHED, Property.PublicationState.RESERVED],
            )
            .order_by("-advertiser__plan__priority", "-published_at", "-created_at")
        )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return PropertyDetailSerializer
        return PropertyListSerializer


class IsAdvertiserOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and hasattr(request.user, "advertiser_profile"))

    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.advertiser_id == request.user.advertiser_profile.id


class DashboardPropertyViewSet(viewsets.ModelViewSet):
    serializer_class = DashboardPropertyWriteSerializer
    permission_classes = [IsAdvertiserOwner]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["created_at", "updated_at", "published_at", "price"]
    ordering = ["-updated_at"]

    def get_queryset(self):
        queryset = (
            Property.objects.select_related("advertiser", "advertiser__plan")
            .prefetch_related("images")
            .order_by("-updated_at")
        )
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(advertiser=self.request.user.advertiser_profile)
