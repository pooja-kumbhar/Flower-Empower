from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('date', 'bouquet_makers_needed', 'drivers_needed', 'group', 'closed')
    search_fields = ('date', 'group')
    list_filter = ('date', 'group', 'closed')
    ordering = ('date',)

    filter_horizontal = ('bouquet_makers', 'drivers', 'recipients')

    fieldsets = (
        (None, {
            'fields': ('date', 'group', 'closed')
        }),
        ('Needs', {
            'fields': ('bouquet_makers_needed', 'drivers_needed')
        }),
        ('Participants', {
            'fields': ('bouquet_makers', 'drivers', 'recipients')
        }),
    )
