from django.utils import timezone
from rest_framework import generics, permissions

from hsu_alumni.permissions import IsAdminRole

from .models import AlumniStory, Article, GalleryItem, PublishableModel
from .serializers import AlumniStorySerializer, ArticleSerializer, GalleryItemSerializer


class AdminQuerysetMixin:
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def perform_create(self, serializer):
        payload = {}
        if 'author' in serializer.fields:
            payload['author'] = self.request.user

        status_value = serializer.validated_data.get('status')
        if status_value == PublishableModel.Status.PUBLISHED and serializer.validated_data.get('published_at') is None:
            payload['published_at'] = timezone.now()

        serializer.save(**payload)

    def perform_update(self, serializer):
        payload = {}
        status_value = serializer.validated_data.get('status')
        if status_value == PublishableModel.Status.PUBLISHED and serializer.instance.published_at is None:
            payload['published_at'] = timezone.now()
        serializer.save(**payload)


class AdminArticleListCreateView(AdminQuerysetMixin, generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer


class AdminArticleDetailView(AdminQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer


class AdminGalleryListCreateView(AdminQuerysetMixin, generics.ListCreateAPIView):
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemSerializer


class AdminGalleryDetailView(AdminQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemSerializer


class AdminAlumniStoryListCreateView(AdminQuerysetMixin, generics.ListCreateAPIView):
    queryset = AlumniStory.objects.all()
    serializer_class = AlumniStorySerializer


class AdminAlumniStoryDetailView(AdminQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = AlumniStory.objects.all()
    serializer_class = AlumniStorySerializer