from django.urls import path

from .views import AdminUserDetailView, AdminUserListView

urlpatterns = [
    path('users', AdminUserListView.as_view(), name='admin-user-list'),
    path('users/<int:pk>', AdminUserDetailView.as_view(), name='admin-user-detail'),
]