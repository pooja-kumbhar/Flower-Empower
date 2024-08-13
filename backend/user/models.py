from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Field used for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    email = models.EmailField(unique=True)
    username = models.CharField(blank=True, unique=False, max_length=255)
    phone = models.CharField(max_length=20, blank=True)
    hours = models.IntegerField(default=0)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)
    state = models.CharField(max_length=255, blank=True)
    zip = models.CharField(max_length=255, blank=True)
    preferred_communication = models.CharField(max_length=20,
                                               choices=(('Phone', 'Phone'), ('Email', 'Email')),
                                               default='none')
    available_for_backup = models.BooleanField(default=True)
