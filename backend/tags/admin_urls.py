from django.urls import path

from .views import AdminTagDetailView, AdminTagListCreateView

urlpatterns = [
    path('tags', AdminTagListCreateView.as_view(), name='admin-tag-list'),
    path('tags/<str:pk>', AdminTagDetailView.as_view(), name='admin-tag-detail'),
]