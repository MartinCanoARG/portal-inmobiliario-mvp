from rest_framework import generics, permissions, response, status
from rest_framework.views import APIView

from .models import AdvertiserProfile, Plan
from .serializers import AdvertiserProfileSerializer, LoginSerializer, PlanSerializer


class PlanListView(generics.ListAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    permission_classes = [permissions.AllowAny]


class AdvertiserListView(generics.ListAPIView):
    serializer_class = AdvertiserProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return (
            AdvertiserProfile.objects.select_related("plan", "user")
            .filter(is_active=True)
            .order_by("-plan__priority", "visible_name")
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        return response.Response(serializer.save(), status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, "advertiser_profile", None)
        payload = {
            "id": request.user.id,
            "username": request.user.username,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "email": request.user.email,
            "is_staff": request.user.is_staff,
            "profile": AdvertiserProfileSerializer(profile).data if profile else None,
        }
        return response.Response(payload)
