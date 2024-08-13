"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework_simplejwt import views as jwt_views
from event.views import ListCreateEventView, EventRetrieveUpdateDestroyView, ToggleEventParticipationView, \
    SendBouquetMakersEmailView, SendDriversEmailView, StatsView
from registration.views import RegistrationView, RegistrationValidationView, PasswordResetView, \
    PasswordResetValidationView, TokenUserObtainView
from user.views import MeView, ListCreateUserView, RetrieveUpdateDestroyUserView
from recipient.views import ListCreateRecipientView, RetrieveUpdateDestroyRecipientView

schema_view = get_schema_view(
   openapi.Info(
      title="Flower Empower API",
      default_version='v1',
      description="API Documentation for flower-empower volunteer portal",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="07jreckn@gmail.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('backend/admin/', admin.site.urls),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('backend/docs', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    # authentication
    path('backend/api/token/', TokenUserObtainView.as_view(), name='token_obtain_pair'),
    path('backend/api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('backend/api/token/verify/', jwt_views.TokenVerifyView.as_view(), name='token_refresh'),
    # registration
    path('backend/api/registration/', RegistrationView.as_view(), name='registration'),
    path('backend/api/registration/validation/', RegistrationValidationView.as_view(), name='registration_validation'),
    # password forget
    path('backend/api/password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('backend/api/password-reset/validate/', PasswordResetValidationView.as_view(), name='me'),
    # user
    path('backend/api/user/me/', MeView.as_view(), name='user_me'),
    path('backend/api/user/', ListCreateUserView.as_view(), name='list_users'),
    path('backend/api/user/<int:user_id>/', RetrieveUpdateDestroyUserView.as_view(), name='user'),
    # events
    path('backend/api/events/', ListCreateEventView.as_view(), name='list-events'),
    path('backend/api/events/<int:pk>/', EventRetrieveUpdateDestroyView.as_view(), name='get_events'),
    path('backend/api/events/toggle-participation/<int:pk>/', ToggleEventParticipationView.as_view(),
         name='toggle-event-participation'),
    path('backend/api/events/sendbouquetemail/<int:event_id>/', SendBouquetMakersEmailView.as_view(),
         name='send_bouquet_email'),
    path('backend/api/events/senddriveremail/<int:event_id>/', SendDriversEmailView.as_view(),
         name='send_bouquet_email'),
    # path('backend/api/events/toggle-attendance/<int:pk>/', ToggleEventAttendanceView.as_view(),
    #      name='toggle_attendance'),
    # recipients
    path('backend/api/recipients/', ListCreateRecipientView.as_view(), name='list_recipients'),
    path('backend/api/recipients/<int:recipient_id>/', RetrieveUpdateDestroyRecipientView.as_view(),
         name='update_recipient'),
    # home
    path('backend/api/home/', StatsView.as_view(), name='stats'),

]
