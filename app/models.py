from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save


# Create your models here.


class Player(models.Model):
    user = models.OneToOneField(User)
    cash = models.FloatField(default=500000)
    value_in_stocks = models.FloatField(default=0)

    def __str__(self):
        return self.user.username


class Stock(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20, db_index=True)
    price = models.FloatField()
    diff = models.FloatField(default=0)

    def __str__(self):
        return str(self.code)


class PlayerStock(models.Model):
    player = models.ForeignKey(Player)
    stock = models.ForeignKey(Stock)
    quantity = models.IntegerField(default=0)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Player.objects.create(user=instance)
        instance.player.save()
