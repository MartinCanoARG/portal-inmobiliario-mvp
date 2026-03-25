from rest_framework.routers import DefaultRouter

from .views import DashboardPropertyViewSet, PublicPropertyViewSet


router = DefaultRouter()
router.register("properties", PublicPropertyViewSet, basename="public-properties")
router.register("dashboard/properties", DashboardPropertyViewSet, basename="dashboard-properties")

urlpatterns = router.urls
