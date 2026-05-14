from django.urls import path

from .views import PublicAlumniPostDetailView, PublicAlumniPostListView

urlpatterns = [
    path('', PublicAlumniPostListView.as_view(), name='alumni-post-list'),
    path('<slug:slug>', PublicAlumniPostDetailView.as_view(), name='alumni-post-detail'),
]