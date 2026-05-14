from django.urls import path

from .views import PublicNewsCategoryListView, PublicNewsPostDetailView, PublicNewsPostListView

urlpatterns = [
    path('danh-muc', PublicNewsCategoryListView.as_view(), name='news-category-list'),
    path('', PublicNewsPostListView.as_view(), name='news-post-list'),
    path('<slug:slug>', PublicNewsPostDetailView.as_view(), name='news-post-detail'),
]