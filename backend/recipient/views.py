from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser

from .models import Recipient
from .serializers import RecipientSerializer


class ListCreateRecipientView(ListCreateAPIView):
    # View for listing all recipients and creating a new recipient.
    queryset = Recipient.objects.all()
    serializer_class = RecipientSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        # Optionally filter recipients by group if 'group' parameter is provided in the request.
        queryset = Recipient.objects.all()
        group = self.request.query_params.get('group', None)
        if group:
            return Recipient.objects.filter(group=group)
        return queryset


class RetrieveUpdateDestroyRecipientView(RetrieveUpdateDestroyAPIView):
    # View for retrieving, updating, or deleting a specific recipient by ID.
    queryset = Recipient.objects.all()
    serializer_class = RecipientSerializer
    lookup_url_kwarg = "recipient_id"
    permission_classes = [IsAdminUser]
