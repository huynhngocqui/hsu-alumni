from django.contrib import admin

from .models import JobApplication, JobListing


@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
    list_display = ('job_name', 'job_position', 'company_name', 'owner', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('job_name', 'job_position', 'company_name', 'owner__email', 'owner__full_name')


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('job_listing', 'applicant', 'created_at')
    search_fields = ('job_listing__job_name', 'applicant__email', 'applicant__full_name')
