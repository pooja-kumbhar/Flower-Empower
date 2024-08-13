from django.db import models

from project import settings


class Registration(models.Model):
    code = models.IntegerField(null=True, blank=True)
    email = models.EmailField(unique=True)
    user = models.OneToOneField(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True,
                                related_name='registration_profile')

    def __str__(self):
        return f"registration with code {self.code}"
