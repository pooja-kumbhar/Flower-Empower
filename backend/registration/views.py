from random import randint
from tokenize import TokenError

from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.views import TokenObtainPairView

from registration.models import Registration
from registration.serializers import RegistrationSerializer, RegistrationValidationSerializer, PasswordResetSerializer, \
    PasswordResetValidationSerializer
from user.serializers import UserSerializer

User = get_user_model()


class RegistrationView(GenericAPIView):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = []

    def post(self, request):
        code = randint(1000, 9999)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        send_mail(
            'Welcome to Flower Empower',
            'Here is your registration code: {}'.format(code),
            'flower.empower.management@gmail.com',
            ['{}'.format(request.data.get('email'))],
            fail_silently=False, )
        serializer.save(code=code)
        return Response(status=status.HTTP_201_CREATED)


class RegistrationValidationView(GenericAPIView):
    queryset = Registration.objects.all()
    serializer_class = RegistrationValidationSerializer
    permission_classes = []

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(serializer.validated_data)
        return Response(status=status.HTTP_201_CREATED)


class PasswordResetView(GenericAPIView):
    permission_classes = []
    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.send_password_reset_email()
        return Response(status=status.HTTP_200_OK)


class PasswordResetValidationView(GenericAPIView):
    permission_classes = []
    serializer_class = PasswordResetValidationSerializer

    def patch(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(serializer.validated_data)
        return Response(status=status.HTTP_200_OK)


class TokenUserObtainView(TokenObtainPairView):
    """
    post:
    Create a new session for a user. Sends back tokens and user.
    """

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        user = User.objects.get(email=request.data['email'])
        req = request
        req.user = user
        user_serializer = UserSerializer(instance=user, context={'request': req})
        res = {
            'user': user_serializer.data,
            **serializer.validated_data
        }

        return Response(res, status=status.HTTP_200_OK)
