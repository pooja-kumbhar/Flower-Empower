from rest_framework import serializers

from user.serializers import UserSerializer
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'


class EventAdminSerializer(serializers.ModelSerializer):
    drivers = UserSerializer(many=True, read_only=True)
    bouquet_makers = UserSerializer(many=True, read_only=True)

    recipients_count = serializers.SerializerMethodField()

    def get_recipients_count(self, obj):
        return obj.recipients.count()

    class Meta:
        model = Event
        fields = ['id', 'drivers', 'bouquet_makers', 'group', 'recipients_count', 'date', 'bouquet_makers_needed',
                  'drivers_needed', 'bouquet_makers_attendees', 'drivers_attendees', 'closed']
