from django.db import models

GROUP_CHOICES = (
    (1, 'Group 1'),
    (2, 'Group 2'),
    # Add more groups as needed
)


class Recipient(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    # email = models.EmailField(unique=True, blank=True)
    # phone = models.CharField(max_length=20, unique=True, blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)
    state = models.CharField(max_length=255, blank=True)
    zip = models.CharField(max_length=255, blank=True)
    end_date = models.DateField(null=True, blank=True)
    group = models.IntegerField(choices=GROUP_CHOICES)
    lon = models.FloatField(null=True)
    lat = models.FloatField(null=True)
