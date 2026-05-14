from django.urls import path

from .views import PublicAlumniStoryListView, PublicGalleryListView, PublicPageDetailView

urlpatterns = [
    path('pages/<slug:slug>', PublicPageDetailView.as_view(), name='content-page-detail'),
    path('gallery', PublicGalleryListView.as_view(), name='content-gallery-list'),
    path('stories', PublicAlumniStoryListView.as_view(), name='content-story-list'),
]