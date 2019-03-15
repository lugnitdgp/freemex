from django.contrib import admin

from .models import *


# Register your models here

admin.site.register(Player)
admin.site.register(Stock)
admin.site.register(PlayerStock)
admin.site.register(Log)
