from django.urls import path

from .views import PeopleSoftLookupView

urlpatterns = [
    path('peoplesoft/lookup', PeopleSoftLookupView.as_view(), name='peoplesoft-lookup'),
]