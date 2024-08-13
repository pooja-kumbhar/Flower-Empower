from json import dumps
import requests
import math

from django.contrib.auth import get_user_model
from django.core.mail import send_mass_mail, send_mail
from django.template.loader import render_to_string
from django.utils.dateparse import parse_date
from django.utils.html import strip_tags
from rest_framework import status
from rest_framework.generics import GenericAPIView, ListCreateAPIView
from rest_framework.response import Response
from recipient.models import Recipient
from rest_framework.views import APIView

from user.models import User
from .models import Event
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from .serializers import EventSerializer, EventAdminSerializer


# 1
class ListCreateEventView(ListCreateAPIView):
    # View for listing all events and creating a new event.
    queryset = Event.objects.all().order_by('-date')
    permission_classes = [IsAuthenticated]  # Ensure all users must be authenticated

    def get_permissions(self):
        if self.request.method == "POST":
            self.permission_classes = [IsAdminUser]
        return super(ListCreateEventView, self).get_permissions()

    def get_serializer(self, *args, **kwargs):
        if self.request.user.is_superuser:
            serializer_class = EventAdminSerializer
        else:
            serializer_class = EventSerializer

        return serializer_class(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = request.data
        date = parse_date(data.get('date'))
        bouquet_makers_needed = data.get('bouquet_makers_needed')
        drivers_needed = data.get('drivers_needed')
        group = data.get('group')
        closed = data.get('closed', False)
        user = get_user_model()

        event = Event.objects.create(
            date=date,
            bouquet_makers_needed=bouquet_makers_needed,
            drivers_needed=drivers_needed,
            group=group,
            closed=closed
        )

        bouquet_makers_ids = data.get('bouquet_makers', [])
        bouquet_makers = user.objects.filter(id__in=bouquet_makers_ids)
        event.bouquet_makers.add(*bouquet_makers)

        drivers_ids = data.get('drivers', [])
        drivers = user.objects.filter(id__in=drivers_ids)
        event.drivers.add(*drivers)

        recipients_ids = data.get('recipients', [])
        recipients = Recipient.objects.filter(id__in=recipients_ids)
        event.recipients.add(*recipients)

        return Response({'message': 'Event created successfully'}, status=status.HTTP_201_CREATED)


class EventRetrieveUpdateDestroyView(GenericAPIView):
    queryset = Event.objects.all()
    serializer_class = EventAdminSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'pk'

    def get(self, request, *args, **kwargs):
        event = self.get_object()
        serializer = self.get_serializer(event)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        event = self.get_object()
        serializer = self.get_serializer(event, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        event = self.get_object()
        event.delete()
        return Response({'message': 'Event deleted'}, status=status.HTTP_204_NO_CONTENT)

    def close_event(self, request, *args, **kwargs):
        event = self.get_object()
        event.closed = True
        event.save()
        return Response({'message': 'Event closed'}, status=status.HTTP_200_OK)


class ToggleEventParticipationView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        event_id = self.kwargs.get(self.lookup_field)
        role = request.data.get('role')

        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user

        if role == 'bouquet_maker':
            if user in event.bouquet_makers.all():
                event.bouquet_makers.remove(user)
                message = 'You have unregistered as a bouquet maker for the event.'
            else:
                if user in event.drivers.all():
                    event.drivers.remove(user)
                event.bouquet_makers.add(user)
                message = 'You have registered as a bouquet maker for the event.'

        elif role == 'driver':
            if user in event.drivers.all():
                event.drivers.remove(user)
                message = 'You have unregistered as a driver for the event.'
            else:
                if user in event.bouquet_makers.all():
                    event.bouquet_makers.remove(user)
                event.drivers.add(user)
                message = 'You have registered as a driver for the event.'

        else:
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': message}, status=status.HTTP_200_OK)


# class ToggleEventAttendanceView(GenericAPIView):
#     queryset = Event.objects.all()
#     serializer_class = EventAdminSerializer
#     permission_classes = [IsAdminUser]
#     lookup_field = 'pk'
#
#     def patch(self, request, *args, **kwargs):
#         event_id = self.kwargs.get(self.lookup_field)
#
#         try:
#             event = Event.objects.get(pk=event_id)
#         except Event.DoesNotExist:
#             return Response({'error': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)
#
#         user_id = request.data.get('user_id')
#         if not user_id:
#             return Response({'error': 'User ID not provided.'}, status=status.HTTP_400_BAD_REQUEST)
#
#         try:
#             user = get_user_model().objects.get(pk=user_id)
#         except get_user_model().DoesNotExist:
#             return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
#
#         # Check if the user should be in bouquet_makers_attendees
#         if user in event.bouquet_makers.all():
#             if user not in event.bouquet_makers_attendees.all():
#                 event.bouquet_makers_attendees.add(user)
#                 message = 'Bouquet maker checked in'
#             else:
#                 message = 'User is already checked in'
#         # Check if the user should be in drivers_attendees
#         if user in event.drivers.all():
#             if user not in event.drivers_attendees.all():
#                 event.drivers_attendees.add(user)
#                 message = 'Driver checked in'
#             else:
#                 message = 'Volunteer is already checked in'
#         else:
#             message = 'User is not registered for this event'
#         # Save the event instance
#         event.save()
#
#         return Response({'message': message}, status=status.HTTP_200_OK)


class SendBouquetMakersEmailView(APIView):
    queryset = Event.objects.all()
    serializer_class = EventAdminSerializer
    permission_classes = [IsAdminUser]
    lookup_url_kwarg = "event_id"

    def get_object(self):
        # Override the get_object method to use the lookup_field
        return Event.objects.get(pk=self.kwargs.get(self.lookup_url_kwarg))

    def post(self, request, *args, **kwargs):
        event = self.get_object()
        subject = request.data.get('subject')
        body = request.data.get('body')

        if not subject or not body:
            return Response({'error': 'Subject and body are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve all bouquet makers for the event
        recipients = event.bouquet_makers.values_list('email', flat=True)

        if not recipients:
            return Response({'error': 'No bouquet makers found for this event.'}, status=status.HTTP_404_NOT_FOUND)

        messages = [
            (subject, body, 'flower.empower.management@gmail.com', [recipient])
            for recipient in recipients
        ]
        send_mass_mail(messages)

        return Response({'message': 'Emails sent.'}, status=status.HTTP_200_OK)


class SendDriversEmailView(APIView):
    queryset = Event.objects.all()
    serializer_class = EventAdminSerializer
    permission_classes = [IsAdminUser]
    lookup_url_kwarg = "event_id"

    def get_object(self):
        # Override the get_object method to use the lookup_field
        return Event.objects.get(pk=self.kwargs.get(self.lookup_url_kwarg))

    def post(self, request, *args, **kwargs):
        event = self.get_object()

        drivers = list(User.objects.filter(id__in=event.drivers.all()))
        group = event.group
        recipients = list(Recipient.objects.filter(group=group))

        list_of_locations = []

        # build location object for api request
        for recipient in recipients:
            location_object = {
                "location": [
                    recipient.lon, recipient.lat
                ],
                "duration": 300,
                "delivery_amount": 1,
                "description": str(
                    f'{recipient.first_name} {recipient.last_name}, {recipient.address}, {recipient.city}, {recipient.state}, {recipient.zip}'),
            }
            list_of_locations.append(location_object)

        # build final request object
        delivery_capacity_float = len(recipients) / len(drivers)
        delivery_capacity = math.ceil(delivery_capacity_float)
        amount_of_drivers = len(drivers)
        drivers_list = []
        driver = {
            "start_location": [
                -119.708527, 34.424501
            ],
            "delivery_capacity": delivery_capacity
        }

        for drivers in range(amount_of_drivers):
            drivers_list.append(driver)

        final_request_object = {
            "mode": "drive",
            "agents": drivers_list,
            "jobs": list_of_locations
        }

        apiKey = '33a37056031e4222b3e9b659704ea36f'
        url = f'https://api.geoapify.com/v1/routeplanner?&apiKey={apiKey}'
        data = dumps(final_request_object)
        data = data.encode('utf-8')
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, data=data, headers=headers)
        response = response.json()

        # building lists for drivers with the response

        # isolation of the features_list, which holds the actions. In these the mapping calculated by the API is stored

        features_list = response['features']

        # isolation the jobs_list, which holds the description value.
        # In this the address from the description variable is stored

        properties_object = response['properties']
        params_object = properties_object['params']
        jobs_list = params_object['jobs']

        # building the final routes per driver

        num = 0

        routes_list = []

        for item in features_list:
            num += 1

            # isolation of the actions_list which is the order of addresses to drive to

            properties_object = item['properties']
            time = int(properties_object['time'] / 60)
            actions_list = properties_object['actions']

            # iterating through the actions_list and find actions with a job_index. So a action,
            # which is connected to an address in the jobs_list

            # route_list = f'-----------DRIVER: {num}-------------APPROX. DRIVING TIME: {time} min-----------\n\n'

            route_list = [time]

            for action in actions_list:
                if 'job_index' in action.keys():
                    # take the job_index in the action and use this job_index to find the job in the jobs_list.
                    # In this job the description key holds the value with the address object from the Ex el at the beginning.

                    address_list = []

                    address_object = jobs_list[action['job_index']]
                    # route_list.append(f'{address_object['description']}')

                    address_text = f'{address_object['description']}'

                    # building the link
                    coordinates = address_object['location']
                    link = f'https://www.google.com/maps/search/?api=1&query={coordinates[1]}%2C{coordinates[0]}'

                    # building list of description and link

                    address_list.append(address_text)
                    address_list.append(link)

                    route_list.append(address_list)

            routes_list.append(route_list)

        if len(routes_list) == 0 or not routes_list:
            return Response({'message': 'Emails sent.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        for number_of_driver in range(len(routes_list)):
            context = {
                "content": routes_list[number_of_driver]
            }
            template_mail = "driver_email.html"
            convert_to_html_content = render_to_string(
                template_name=template_mail,
                context=context
            )
            plain_message = strip_tags(convert_to_html_content)

            send_mail(
                'See you Saturday for Deliveries! 🌸 – Your driving route',
                message=plain_message,
                # 'Here is your route for tomorrow:\n\n{}'.format(routes_list[number_of_driver]),
                from_email='flower.empower.management@gmail.com',
                recipient_list=[
                    '{}'.format(list(User.objects.filter(id__in=event.drivers.all()))[number_of_driver].email)],
                html_message=convert_to_html_content,
                fail_silently=False, )

        return Response({'message': 'Emails sent.'}, status=status.HTTP_200_OK)


class StatsView(GenericAPIView):
    # Queryset for the Event model, which will be used to retrieve event data
    queryset = Event.objects.all()
    # Permission class that allows any user (authenticated or not) to access this view
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        # Initialize sets to store unique volunteer and recipient IDs
        total_volunteers = set()
        total_recipients = set()
        # Initialize counters for total bouquets and total hours worked
        total_bouquets = 0
        total_hours = 0

        # Loop through all closed events to gather statistics
        for event in Event.objects.filter(closed=True):
            # Get all bouquet makers and drivers associated with the current event
            bouquet_makers = event.bouquet_makers.all()
            drivers = event.drivers.all()
            # Get all recipients associated with the current event
            recipients = event.recipients.all()

            # Count the total number of bouquets based on the number of recipients for the event
            total_bouquets += event.recipients.count()

            # Add unique IDs of bouquet makers and drivers to the total_volunteers set
            for volunteer in bouquet_makers.union(drivers):
                total_volunteers.add(volunteer.id)

            # Add unique recipient IDs to the total_recipients set
            for recipient in recipients:
                total_recipients.add(recipient.id)

            # Calculate the total hours worked by bouquet makers (assuming each works 2.5 hours)
            bouquet_makers_hours = event.bouquet_makers.count() * 2.5
            # Calculate the total hours worked by drivers (assuming each works 3 hours)
            drivers_hours = event.drivers.count() * 3
            # Add the hours from bouquet makers and drivers to the total hours counter
            total_hours += bouquet_makers_hours + drivers_hours

        # Calculate the count of unique volunteers and recipients
        total_volunteers_count = len(total_volunteers)
        total_recipients_count = len(total_recipients)

        # Return a JSON response containing the statistics
        return Response({
            'total_volunteers': total_volunteers_count,
            'total_recipients': total_recipients_count,
            'total_bouquets': total_bouquets,
            'total_hours': total_hours
        }, status=status.HTTP_200_OK)
