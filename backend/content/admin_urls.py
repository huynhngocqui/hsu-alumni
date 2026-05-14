from django.urls import path

from .views import (
    AdminAlumniStoryDetailView,
    AdminAlumniStoryListCreateView,
    AdminArticleDetailView,
    AdminArticleListCreateView,
    AdminGalleryDetailView,
    AdminGalleryListCreateView,
)

urlpatterns = [
    path('content/articles', AdminArticleListCreateView.as_view(), name='admin-article-list'),
    path('content/articles/<int:pk>', AdminArticleDetailView.as_view(), name='admin-article-detail'),
    path('content/gallery', AdminGalleryListCreateView.as_view(), name='admin-gallery-list'),
    path('content/gallery/<int:pk>', AdminGalleryDetailView.as_view(), name='admin-gallery-detail'),
    path('content/stories', AdminAlumniStoryListCreateView.as_view(), name='admin-story-list'),
    path('content/stories/<int:pk>', AdminAlumniStoryDetailView.as_view(), name='admin-story-detail'),
]