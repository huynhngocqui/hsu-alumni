from django.urls import path

from .views import (
    PublicAlumniStoryListView,
    PublicArticleDetailView,
    PublicArticleListView,
    PublicGalleryListView,
    PublicPageDetailView,
)

urlpatterns = [
    path('pages/<slug:slug>', PublicPageDetailView.as_view(), name='content-page-detail'),
    path('articles', PublicArticleListView.as_view(), name='content-article-list'),
    path('articles/<slug:slug>', PublicArticleDetailView.as_view(), name='content-article-detail'),
    path('gallery', PublicGalleryListView.as_view(), name='content-gallery-list'),
    path('stories', PublicAlumniStoryListView.as_view(), name='content-story-list'),
]