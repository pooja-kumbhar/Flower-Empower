from random import randint

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from rest_framework import serializers, status
from rest_framework.response import Response

from registration.models import Registration

User = get_user_model()


def email_does_not_exist(email):
    try:
        User.objects.get(email=email)
        raise ValidationError(message='This email is taken')
    except User.DoesNotExist:
        return email


def email_does_exist(email):
    try:
        Registration.objects.get(email=email)
        return email
    except Registration.DoesNotExist:
        raise ValidationError(message='Registration does not exist!')


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ['email']


class RegistrationValidationSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=255)
    last_name = serializers.CharField(max_length=255)
    email = serializers.EmailField(label='Registration E-Mail Address', validators=[email_does_exist])
    code = serializers.CharField(label='Validation code', write_only=True)
    password = serializers.CharField(label='password', write_only=True)
    password_repeat = serializers.CharField(label='password_repeat', write_only=True)
    phone = serializers.CharField(max_length=50)

    def validate(self, data):
        code = data.get('code')
        email = data.get('email')
        reg_profile = Registration.objects.get(email=email)
        if str(reg_profile.code) != code:
            raise ValidationError(message='The code does not belong to this email!')
        if data.get('password') != data.get('password_repeat'):
            raise ValidationError(message='Passwords do not match!')
        return data

    def save(self, validated_data):
        first_name = validated_data.get('first_name')
        last_name = validated_data.get('last_name')
        email = validated_data.get('email')
        phone = validated_data.get('phone')
        new_user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            is_superuser=False,
            is_active=True,
        )
        new_user.set_password(validated_data.get('password'))
        new_user.save()
        registration_profile = Registration.objects.get(email=email)
        registration_profile.user = new_user
        registration_profile.save()

        return Response(status=status.HTTP_201_CREATED)


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(label='Password Reset E-Mail Address', validators=[email_does_exist])

    def send_password_reset_email(self):
        email = self.validated_data.get('email')
        user = User.objects.get(email=email)
        user.registration_profile.code = randint(1000, 9999)
        user.registration_profile.save()
        send_mail(
            'Password reset for Flower Empower',
            'Here is your reset code: {}'.format(user.registration_profile.code),
            'flower.empower.management@gmail.com',
            ['{}'.format(email)],
            fail_silently=False, )


class PasswordResetValidationSerializer(serializers.Serializer):
    code = serializers.CharField(label='Validation code', write_only=True)
    email = serializers.EmailField(label='Registration E-Mail Address', validators=[email_does_exist])
    password = serializers.CharField(label='password', write_only=True)
    password_repeat = serializers.CharField(label='password_repeat', write_only=True)

    def validate(self, data):
        code = data.get('code')
        email = data.get('email')
        user = User.objects.get(email=email)
        reg_profile = Registration.objects.get(code=code)
        if reg_profile != user.registration_profile:
            raise ValidationError(message='The code does not belong to this email!')
        if data.get('password') != data.get('password_repeat'):
            raise ValidationError(message='Passwords do not match!')
        return data

    def save(self, validated_data):
        email = validated_data.get('email')
        user = User.objects.get(email=email)
        user.set_password(validated_data.get('password'))
        user.save()
        return user
