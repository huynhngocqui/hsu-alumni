from django.urls import path

from .views import PublicEventDetailView, PublicEventListView

urlpatterns = [
    path('', PublicEventListView.as_view(), name='event-list'),
    path('<slug:slug>', PublicEventDetailView.as_view(), name='event-detail'),
]