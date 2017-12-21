# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PlayerStock',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('quantity', models.IntegerField(default=0)),
                ('player', models.ForeignKey(to='core.Player', on_delete=models.CASCADE)),
            ],
        ),
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('code', models.CharField(db_index=True, max_length=20)),
                ('price', models.FloatField()),
                ('diff', models.FloatField(default=0)),
            ],
        ),
        migrations.AddField(
            model_name='playerstock',
            name='stock',
            field=models.ForeignKey(to='core.Stock', on_delete=models.CASCADE),
        ),
    ]
