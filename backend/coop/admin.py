from django.contrib import admin

from .models import CoopListing


@admin.register(CoopListing)
class CoopListingAdmin(admin.ModelAdmin):
    list_display = ('name', 'business_name', 'owner', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('name', 'business_name', 'owner__email', 'owner__full_name')
