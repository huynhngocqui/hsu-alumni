from django.urls import path

from .views import (
    GalleryContributeView,
    PublicAlumniStoryDetailView,
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
    path('gallery/contribute', GalleryContributeView.as_view(), name='content-gallery-contribute'),
    path('stories', PublicAlumniStoryListView.as_view(), name='content-story-list'),
    path('stories/<slug:slug>', PublicAlumniStoryDetailView.as_view(), name='content-story-detail'),
]