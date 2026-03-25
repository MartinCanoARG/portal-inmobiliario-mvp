from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import AdvertiserProfile, Plan


User = get_user_model()


@receiver(post_save, sender=User)
def ensure_advertiser_profile(sender, instance, created, **kwargs):
    if not created or hasattr(instance, "advertiser_profile"):
        return

    default_plan = Plan.objects.filter(slug="free").first() or Plan.objects.order_by("priority").first()
    if default_plan is None:
        return

    AdvertiserProfile.objects.create(
        user=instance,
        visible_name=instance.get_full_name() or instance.username,
        email=instance.email or f"{instance.username}@demo.local",
        phone="+54 9 0000 000000",
        plan=default_plan,
    )
