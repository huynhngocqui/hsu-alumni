from django.urls import path

from .views import ChangePasswordView, CurrentUserView

urlpatterns = [
    path('me', CurrentUserView.as_view(), name='users-me'),
    path('me/password', ChangePasswordView.as_view(), name='users-change-password'),
]
