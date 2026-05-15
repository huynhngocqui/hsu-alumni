from django.conf import settings
from django.db import models


class JobListing(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PUBLISHED = 'PUBLISHED', 'Published'
        CLOSED = 'CLOSED', 'Closed'

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='job_listings',
    )
    company_name = models.CharField(max_length=255)
    job_name = models.CharField(max_length=180)
    job_position = models.CharField(max_length=180)
    employment_type = models.CharField(max_length=120, blank=True)
    work_location = models.CharField(max_length=255, blank=True)
    job_description = models.TextField(blank=True)
    category_tags = models.JSONField(default=list, blank=True)
    application_deadline = models.DateField(null=True, blank=True)
    views_count = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PUBLISHED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.job_name


class JobApplication(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        INTERVIEW = 'INTERVIEW', 'Interview'
        REJECTED = 'REJECTED', 'Rejected'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        WITHDRAWN = 'WITHDRAWN', 'Withdrawn'

    job_listing = models.ForeignKey(
        JobListing,
        on_delete=models.CASCADE,
        related_name='applications',
    )
    applicant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='job_applications',
    )
    cv_file = models.FileField(upload_to='job_applications/cvs/')
    portfolio_url = models.URLField(blank=True)
    cover_note = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['job_listing', 'applicant'], name='uniq_job_application_per_user')
        ]

    def __str__(self):
        return f'{self.applicant} -> {self.job_listing}'
