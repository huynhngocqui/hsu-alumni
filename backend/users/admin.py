from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'role', 'account_status', 'is_staff')
    list_filter = ('role', 'account_status', 'is_staff')
    search_fields = ('email', 'full_name', 'student_id', 'identity_id')
