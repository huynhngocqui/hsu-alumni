from django.urls import path

from .views import DashboardMatchingView, NotificationListView, NotificationMarkAllReadView, NotificationReadView

urlpatterns = [
    path('notifications', NotificationListView.as_view(), name='notification-list'),
    path('notifications/read-all', NotificationMarkAllReadView.as_view(), name='notification-read-all'),
    path('notifications/<int:pk>/read', NotificationReadView.as_view(), name='notification-read'),
    path('matching/dashboard', DashboardMatchingView.as_view(), name='matching-dashboard'),
]