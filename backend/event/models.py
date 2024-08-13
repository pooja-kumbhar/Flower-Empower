from django.db import models
from project import settings
from recipient.models import Recipient

GROUP_CHOICES = (
    (1, 'Group 1'),
    (2, 'Group 2'),
    # Add more groups as needed
)


class Event(models.Model):
    date = models.DateField()
    bouquet_makers_needed = models.IntegerField()
    drivers_needed = models.IntegerField()
    group = models.IntegerField(choices=GROUP_CHOICES)
    closed = models.BooleanField(default=False)
    bouquet_makers = models.ManyToManyField(to=settings.AUTH_USER_MODEL, blank=True, related_name="bouquet_makers")
    drivers = models.ManyToManyField(to=settings.AUTH_USER_MODEL, blank=True, related_name="drivers")
    bouquet_makers_attendees = models.ManyToManyField(to=settings.AUTH_USER_MODEL, blank=True, related_name="bouquet_makers_attendees")
    drivers_attendees = models.ManyToManyField(to=settings.AUTH_USER_MODEL, blank=True, related_name="drivers_attendees")
    recipients = models.ManyToManyField(to=Recipient, blank=True, related_name="recipients")

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # First save the event instance to ensure it has an ID
        # Get all recipients in the same group
        group_recipients = Recipient.objects.filter(group=self.group)
        # Add these recipients to the event's recipients
        self.recipients.set(group_recipients)
