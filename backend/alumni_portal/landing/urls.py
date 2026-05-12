from django.urls import path

from .views import health, landing_page

urlpatterns = [
    path("health/", health, name="health"),
    path("landing-page/", landing_page, name="landing-page"),
]
