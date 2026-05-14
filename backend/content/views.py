from pathlib import Path
from uuid import uuid4

from django.core.files.storage import default_storage
from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from hsu_alumni.permissions import IsAdminRole

from .models import AlumniPost, AlumniStory, Article, Event, GalleryItem, NewsCategory, NewsPost, PublishableModel
from .serializers import (
    AlumniPostSerializer,
    AlumniStorySerializer,
    ArticleSerializer,
    EventSerializer,
    GalleryItemSerializer,
    NewsCategorySerializer,
    NewsPostSerializer,
    PublicAlumniPostSerializer,
    PublicAlumniStorySerializer,
    PublicArticleSerializer,
    PublicEventSerializer,
    PublicGalleryItemSerializer,
    PublicNewsCategorySerializer,
    PublicNewsPostSerializer,
)


def _parse_positive_int(value, default):
    return int(value) if str(value).isdigit() and int(value) > 0 else default


def _request_is_admin(request):
    return bool(getattr(request.user, 'is_authenticated', False) and getattr(request.user, 'role', '') == 'ADMIN')


def _build_paginated_payload(queryset, serializer_class, request, default_limit=9):
    page = _parse_positive_int(request.query_params.get('page', '').strip(), 1)
    limit = _parse_positive_int(request.query_params.get('limit', '').strip(), default_limit)
    limit = min(limit, 100)
    total_count = queryset.count()
    total_pages = max((total_count + limit - 1) // limit, 1)
    page = min(page, total_pages)
    start_index = (page - 1) * limit
    end_index = start_index + limit
    items = queryset[start_index:end_index]

    return {
        'count': total_count,
        'page': page,
        'limit': limit,
        'total_pages': total_pages,
        'results': serializer_class(items, many=True).data,
    }


def _event_status_queryset(queryset, event_status):
    now = timezone.now()
    normalized = (event_status or '').strip().upper()
    if normalized == 'UPCOMING':
        return queryset.filter(start_date_time__gte=now)
    if normalized == 'PAST':
        return queryset.filter(end_date_time__lt=now)
    return queryset


def _filter_news_queryset_by_category(queryset, category_value):
    normalized = (category_value or '').strip()
    if not normalized:
        return queryset

    if normalized.isdigit():
        return queryset.filter(category_id=int(normalized))

    return queryset.filter(category__slug=normalized)


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


class AdminAlumniPostListCreateView(AdminQuerysetMixin, generics.ListCreateAPIView):
    queryset = AlumniPost.objects.all()
    serializer_class = AlumniPostSerializer


class AdminAlumniPostDetailView(AdminQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = AlumniPost.objects.all()
    serializer_class = AlumniPostSerializer


class AdminNewsCategoryListCreateView(AdminQuerysetMixin, generics.ListCreateAPIView):
    queryset = NewsCategory.objects.all()
    serializer_class = NewsCategorySerializer


class AdminNewsCategoryDetailView(AdminQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = NewsCategory.objects.all()
    serializer_class = NewsCategorySerializer


class AdminNewsPostListCreateView(AdminQuerysetMixin, generics.ListCreateAPIView):
    serializer_class = NewsPostSerializer

    def get_queryset(self):
        queryset = NewsPost.objects.select_related('category').all()
        search_term = self.request.query_params.get('search', '').strip()
        category_value = self.request.query_params.get('category', '').strip()
        status_value = self.request.query_params.get('status', '').strip().upper()

        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term)
                | Q(excerpt__icontains=search_term)
                | Q(content_vi__icontains=search_term)
                | Q(content_en__icontains=search_term)
            )

        queryset = _filter_news_queryset_by_category(queryset, category_value)

        if status_value in PublishableModel.Status.values:
            queryset = queryset.filter(status=status_value)

        return queryset


class AdminNewsPostDetailView(AdminQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = NewsPost.objects.select_related('category').all()
    serializer_class = NewsPostSerializer


class AdminEventListCreateView(AdminQuerysetMixin, generics.ListCreateAPIView):
    serializer_class = EventSerializer

    def get_queryset(self):
        queryset = Event.objects.all()
        search_term = self.request.query_params.get('search', '').strip()
        status_value = self.request.query_params.get('status', '').strip().upper()
        event_status = self.request.query_params.get('event_status', '').strip().upper()

        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term)
                | Q(excerpt__icontains=search_term)
                | Q(location__icontains=search_term)
                | Q(content_vi__icontains=search_term)
                | Q(content_en__icontains=search_term)
            )

        if status_value in PublishableModel.Status.values:
            queryset = queryset.filter(status=status_value)

        queryset = _event_status_queryset(queryset, event_status)
        return queryset


class AdminEventDetailView(AdminQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class AdminMediaUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    parser_classes = [MultiPartParser, FormParser]
    max_file_size = 5 * 1024 * 1024

    def post(self, request):
        upload = request.FILES.get('file')
        if upload is None:
            return Response({'file': ['Vui long chon mot tep anh.']}, status=400)

        content_type = (upload.content_type or '').lower()
        if content_type not in {'image/jpeg', 'image/jpg', 'image/png', 'image/webp'}:
            return Response({'file': ['Chi ho tro dinh dang JPG, PNG hoac WEBP.']}, status=400)

        if upload.size > self.max_file_size:
            return Response({'file': ['Kich thuoc tep toi da la 5MB.']}, status=400)

        suffix = Path(upload.name).suffix or '.jpg'
        saved_path = default_storage.save(f'uploads/{uuid4().hex}{suffix}', upload)
        return Response({'url': default_storage.url(saved_path)}, status=201)


class AdminSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        from users.models import User

        now = timezone.now()

        return Response({
            'pending_users': User.objects.filter(account_status=User.AccountStatus.PENDING).count(),
            'published_articles': Article.objects.filter(status=PublishableModel.Status.PUBLISHED)
                .exclude(article_type=Article.ArticleType.PAGE)
                .count(),
            'pending_gallery': GalleryItem.objects.exclude(status=PublishableModel.Status.PUBLISHED).count(),
            'draft_stories': AlumniStory.objects.exclude(status=PublishableModel.Status.PUBLISHED).count(),
            'total_news': NewsPost.objects.count(),
            'published_news': NewsPost.objects.filter(status=PublishableModel.Status.PUBLISHED).count(),
            'draft_news': NewsPost.objects.filter(status=PublishableModel.Status.DRAFT).count(),
            'total_events': Event.objects.count(),
            'upcoming_events': Event.objects.filter(status=PublishableModel.Status.PUBLISHED, start_date_time__gte=now).count(),
            'past_events': Event.objects.filter(status=PublishableModel.Status.PUBLISHED, end_date_time__lt=now).count(),
            'total_alumni_posts': AlumniPost.objects.count(),
        })


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


class PublicArticleListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = Article.objects.filter(status=PublishableModel.Status.PUBLISHED).exclude(
            article_type=Article.ArticleType.PAGE
        )

        article_type = request.query_params.get('article_type', '').strip().upper()
        if article_type in Article.ArticleType.values:
            queryset = queryset.filter(article_type=article_type)

        limit = request.query_params.get('limit', '').strip()
        if limit.isdigit():
            queryset = queryset[: int(limit)]

        return Response(PublicArticleSerializer(queryset, many=True).data)


class PublicArticleDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        article = (
            Article.objects.filter(status=PublishableModel.Status.PUBLISHED, slug=slug)
            .exclude(article_type=Article.ArticleType.PAGE)
            .first()
        )
        if article is None:
            raise NotFound('Article not found.')
        return Response(PublicArticleSerializer(article).data)


class PublicGalleryListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = GalleryItem.objects.filter(status=PublishableModel.Status.PUBLISHED)
        return Response(PublicGalleryItemSerializer(queryset, many=True).data)


class GalleryContributeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        title = (request.data.get('title') or '').strip()
        if not title:
            return Response({'title': ['Tiêu đề không được để trống.']}, status=400)

        GalleryItem.objects.create(
            title=title,
            description=(request.data.get('description') or '').strip(),
            image_url=(request.data.get('image_url') or '').strip(),
            drive_url=(request.data.get('drive_url') or '').strip(),
            contributor_name=(request.data.get('contributor_name') or '').strip(),
            status=PublishableModel.Status.DRAFT,
        )
        return Response({'detail': 'Đóng góp đã được ghi nhận và đang chờ duyệt.'}, status=201)


class PublicAlumniStoryListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = AlumniStory.objects.filter(status=PublishableModel.Status.PUBLISHED)
        category = request.query_params.get('category', '').strip().upper()
        if category in AlumniStory.StoryCategory.values:
            queryset = queryset.filter(story_category=category)

        return Response(PublicAlumniStorySerializer(queryset, many=True).data)


class PublicAlumniStoryDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        story = AlumniStory.objects.filter(status=PublishableModel.Status.PUBLISHED, slug=slug).first()
        if story is None:
            raise NotFound('Story not found.')
        return Response(PublicAlumniStorySerializer(story).data)


class PublicAlumniPostListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = AlumniPost.objects.filter(status=PublishableModel.Status.PUBLISHED)

        search_term = request.query_params.get('search', '').strip()
        if search_term:
            queryset = queryset.filter(full_name__icontains=search_term)

        for param_name in ['education_level', 'cohort', 'field', 'major']:
            raw_value = request.query_params.get(param_name, '').strip()
            if raw_value:
                queryset = queryset.filter(**{param_name: raw_value})

        page = request.query_params.get('page', '').strip()
        page_size = request.query_params.get('page_size', '').strip()
        if not (page or page_size):
            return Response(PublicAlumniPostSerializer(queryset, many=True).data)

        safe_page = int(page) if page.isdigit() else 1
        safe_page_size = int(page_size) if page_size.isdigit() else 12
        safe_page = max(safe_page, 1)
        safe_page_size = max(min(safe_page_size, 100), 1)
        total_count = queryset.count()
        total_pages = max((total_count + safe_page_size - 1) // safe_page_size, 1)
        start_index = (safe_page - 1) * safe_page_size
        end_index = start_index + safe_page_size
        paged_queryset = queryset[start_index:end_index]

        return Response({
            'count': total_count,
            'page': min(safe_page, total_pages),
            'page_size': safe_page_size,
            'total_pages': total_pages,
            'results': PublicAlumniPostSerializer(paged_queryset, many=True).data,
        })


class PublicAlumniPostDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        post = AlumniPost.objects.filter(status=PublishableModel.Status.PUBLISHED, slug=slug).first()
        if post is None:
            raise NotFound('Alumni post not found.')
        return Response(PublicAlumniPostSerializer(post).data)


class PublicNewsCategoryListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = NewsCategory.objects.filter(status=NewsCategory.Status.PUBLISHED)
        return Response(PublicNewsCategorySerializer(queryset, many=True).data)


class PublicNewsPostListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        requested_status = request.query_params.get('status', '').strip().upper()
        queryset = NewsPost.objects.select_related('category').all()

        if _request_is_admin(request) and requested_status in PublishableModel.Status.values:
            queryset = queryset.filter(status=requested_status)
        else:
            queryset = queryset.filter(status=PublishableModel.Status.PUBLISHED)

        search_term = request.query_params.get('search', '').strip()
        category_value = request.query_params.get('category', '').strip()

        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term)
                | Q(excerpt__icontains=search_term)
                | Q(content_vi__icontains=search_term)
                | Q(content_en__icontains=search_term)
            )

        queryset = _filter_news_queryset_by_category(queryset, category_value)

        return Response(_build_paginated_payload(queryset, PublicNewsPostSerializer, request, default_limit=9))


class PublicNewsPostDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        post = NewsPost.objects.select_related('category').filter(status=PublishableModel.Status.PUBLISHED, slug=slug).first()
        if post is None:
            raise NotFound('News post not found.')

        related_queryset = NewsPost.objects.select_related('category').filter(
            status=PublishableModel.Status.PUBLISHED,
            category=post.category,
        ).exclude(pk=post.pk)[:8]

        payload = PublicNewsPostSerializer(post).data
        payload['related_news'] = PublicNewsPostSerializer(related_queryset, many=True).data
        payload['related_categories'] = PublicNewsCategorySerializer(
            NewsCategory.objects.filter(status=NewsCategory.Status.PUBLISHED),
            many=True,
        ).data
        return Response(payload)


class PublicEventListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        requested_status = request.query_params.get('status', '').strip().upper()
        queryset = Event.objects.all()

        if _request_is_admin(request) and requested_status in PublishableModel.Status.values:
            queryset = queryset.filter(status=requested_status)
        else:
            queryset = queryset.filter(status=PublishableModel.Status.PUBLISHED)

        search_term = request.query_params.get('search', '').strip()
        event_status = request.query_params.get('event_status', '').strip().upper()

        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term)
                | Q(excerpt__icontains=search_term)
                | Q(location__icontains=search_term)
                | Q(content_vi__icontains=search_term)
                | Q(content_en__icontains=search_term)
            )

        queryset = _event_status_queryset(queryset, event_status)
        return Response(_build_paginated_payload(queryset, PublicEventSerializer, request, default_limit=9))


class PublicEventDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        event = Event.objects.filter(status=PublishableModel.Status.PUBLISHED, slug=slug).first()
        if event is None:
            raise NotFound('Event not found.')

        related_queryset = _event_status_queryset(
            Event.objects.filter(status=PublishableModel.Status.PUBLISHED).exclude(pk=event.pk),
            event.event_status,
        )[:6]
        payload = PublicEventSerializer(event).data
        payload['related_events'] = PublicEventSerializer(related_queryset, many=True).data
        return Response(payload)