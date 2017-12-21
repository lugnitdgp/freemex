# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_auto_20170115_0723'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='cash',
            field=models.DecimalField(default=500000.0, max_digits=19, decimal_places=2),
        ),
        migrations.AlterField(
            model_name='player',
            name='value_in_stocks',
            field=models.DecimalField(default=0.0, max_digits=19, decimal_places=2),
        ),
        migrations.AlterField(
            model_name='stock',
            name='diff',
            field=models.DecimalField(max_digits=19, decimal_places=2),
        ),
        migrations.AlterField(
            model_name='stock',
            name='price',
            field=models.DecimalField(max_digits=19, decimal_places=2),
        ),
    ]
