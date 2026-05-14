from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from hsu_alumni.permissions import IsAdminRole

from .models import AlumniStory, Article, GalleryItem, PublishableModel
from .serializers import (
    AlumniStorySerializer,
    ArticleSerializer,
    GalleryItemSerializer,
    PublicAlumniStorySerializer,
    PublicArticleSerializer,
    PublicGalleryItemSerializer,
)


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


class PublicPageDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        article = Article.objects.filter(
            article_type=Article.ArticleType.PAGE,
            status=PublishableModel.Status.PUBLISHED,
            slug=slug,
        ).first()
        if article is None:
            raise NotFound('Content page not found.')
        return Response(PublicArticleSerializer(article).data)


class PublicGalleryListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = GalleryItem.objects.filter(status=PublishableModel.Status.PUBLISHED)
        return Response(PublicGalleryItemSerializer(queryset, many=True).data)


class PublicAlumniStoryListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = AlumniStory.objects.filter(status=PublishableModel.Status.PUBLISHED)
        category = request.query_params.get('category', '').strip().upper()
        if category in AlumniStory.StoryCategory.values:
            queryset = queryset.filter(story_category=category)

        return Response(PublicAlumniStorySerializer(queryset, many=True).data)