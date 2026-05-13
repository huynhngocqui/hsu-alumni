import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hsu_alumni.settings.local')

app = Celery('hsu_alumni')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
