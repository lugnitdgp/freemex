from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save


# Create your models here.


class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cash = models.DecimalField(max_digits=19,
                               decimal_places=2,
                               default=500000.00)
    value_in_stocks = models.DecimalField(max_digits=19,
                                          decimal_places=2,
                                          default=0.00)

    def __str__(self):
        return self.user.username

    def total_value(self):
        return self.cash + self.value_in_stocks


class Stock(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20, db_index=True)
    price = models.DecimalField(max_digits=19,
                                decimal_places=2)

    diff = models.DecimalField(max_digits=19,
                               decimal_places=2)

    def __str__(self):
        return str(self.code)


class PlayerStock(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return str(str(self.player) + " - " + self.stock.code)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Player.objects.create(user=instance)
        instance.player.save()
