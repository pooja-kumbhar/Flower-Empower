from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'hours', 'address', 'city', 'state',
                  'zip', 'preferred_communication', 'available_for_backup', 'is_superuser']
