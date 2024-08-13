from django.contrib import admin
from .models import Recipient
from import_export.admin import ImportExportModelAdmin


class RecipientAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'address', 'city', 'state', 'zip', 'lon', 'lat')


admin.site.register(Recipient, RecipientAdmin)
