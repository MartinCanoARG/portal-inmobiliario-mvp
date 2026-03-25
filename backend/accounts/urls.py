from django.urls import path

from .views import AdvertiserListView, LoginView, MeView, PlanListView


urlpatterns = [
    path("plans/", PlanListView.as_view(), name="plan-list"),
    path("advertisers/", AdvertiserListView.as_view(), name="advertiser-list"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
]
