from django.conf import settings
from django.db import models


class Notification(models.Model):
    class Type(models.TextChoices):
        JOB_MATCH = 'JOB_MATCH', 'Job Match'
        COOP_MATCH = 'COOP_MATCH', 'Co-op Match'
        JOB_APPLICATION = 'JOB_APPLICATION', 'Job Application'
        SYSTEM = 'SYSTEM', 'System'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    notification_type = models.CharField(max_length=32, choices=Type.choices)
    title = models.CharField(max_length=180)
    message = models.TextField()
    url = models.CharField(max_length=255, blank=True)
    payload = models.JSONField(default=dict, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.email}: {self.title}'