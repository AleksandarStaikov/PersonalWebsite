from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save


class UserExtended(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='userextended')
    bio = models.TextField()
    birth_date = models.DateField(null=True, blank=True)
    birth_place = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20)


    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwars):
        if created:
            UserExtended.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, created, **kwargs):
        instance.userextended.save()

class LifeEvent(models.Model):
    EVENT_LINE_POSITION_OPTIONS= [
    ('T', 'Top'),
    ('B', 'Bot'),
    ('L', 'Left'),
    ('R', 'Rigth')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event_begin_date = models.DateTimeField(blank=False)
    event_end_date = models.DateTimeField(null=True, blank=True)
    name = models.CharField(max_length=80)
    location = models.CharField(max_length=200)
    description = models.TextField()
    hover_position =  models.CharField(max_length=2, choices=EVENT_LINE_POSITION_OPTIONS, default="T")