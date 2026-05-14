from django.core.validators import URLValidator
from django.utils import timezone
from rest_framework import serializers

from .models import AlumniPost, AlumniStory, Article, Event, GalleryItem, NewsCategory, NewsPost, PublishableModel


class RelativeMediaURLField(serializers.CharField):
    default_error_messages = {
        'invalid': 'Nhập một URL hợp lệ.',
    }

    def __init__(self, **kwargs):
        kwargs.setdefault('allow_blank', True)
        kwargs.setdefault('required', False)
        super().__init__(**kwargs)
        self.url_validator = URLValidator()

    def to_internal_value(self, data):
        value = super().to_internal_value(data).strip()
        if not value:
            return ''

        if value.startswith('/media/') or value.startswith('media/'):
            return value if value.startswith('/') else f'/{value}'

        try:
            self.url_validator(value)
        except Exception as exc:
            raise serializers.ValidationError(self.error_messages['invalid']) from exc

        return value


class PublishableModelSerializer(serializers.ModelSerializer):
    def validate_status(self, value):
        if value not in PublishableModel.Status.values:
            raise serializers.ValidationError('Invalid status value.')
        return value


class ArticleSerializer(PublishableModelSerializer):
    class Meta:
        model = Article
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'body',
            'article_type',
            'external_url',
            'status',
            'published_at',
            'created_at',
            'updated_at',
        ]


class PublicArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'body',
            'article_type',
            'external_url',
            'published_at',
        ]


class GalleryItemSerializer(PublishableModelSerializer):
    image_url = RelativeMediaURLField()

    class Meta:
        model = GalleryItem
        fields = [
            'id',
            'title',
            'album_name',
            'description',
            'image_url',
            'drive_url',
            'contributor_name',
            'status',
            'published_at',
            'created_at',
            'updated_at',
        ]


class PublicGalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = [
            'id',
            'title',
            'album_name',
            'description',
            'image_url',
            'drive_url',
            'contributor_name',
            'published_at',
        ]


class AlumniStorySerializer(PublishableModelSerializer):
    featured_image_url = RelativeMediaURLField()

    class Meta:
        model = AlumniStory
        fields = [
            'id',
            'title',
            'slug',
            'story_category',
            'alumni_name',
            'company_name',
            'role_title',
            'excerpt',
            'body',
            'featured_image_url',
            'status',
            'published_at',
            'created_at',
            'updated_at',
        ]


class PublicAlumniStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AlumniStory
        fields = [
            'id',
            'title',
            'slug',
            'story_category',
            'alumni_name',
            'company_name',
            'role_title',
            'excerpt',
            'body',
            'featured_image_url',
            'published_at',
        ]


class AlumniPostSerializer(PublishableModelSerializer):
    avatar_url = RelativeMediaURLField()
    gallery_images = serializers.ListField(
        child=RelativeMediaURLField(),
        required=False,
        allow_empty=True,
    )

    class Meta:
        model = AlumniPost
        fields = [
            'id',
            'full_name',
            'slug',
            'position',
            'short_description',
            'company',
            'education_level',
            'cohort',
            'field',
            'major',
            'avatar_url',
            'content_vi',
            'content_en',
            'gallery_images',
            'status',
            'sort_order',
            'seo_title',
            'seo_description',
            'published_at',
            'created_at',
            'updated_at',
        ]


class PublicAlumniPostSerializer(serializers.ModelSerializer):
    gallery_images = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
    )

    class Meta:
        model = AlumniPost
        fields = [
            'id',
            'full_name',
            'slug',
            'position',
            'short_description',
            'company',
            'education_level',
            'cohort',
            'field',
            'major',
            'avatar_url',
            'content_vi',
            'content_en',
            'gallery_images',
            'sort_order',
            'seo_title',
            'seo_description',
            'published_at',
            'created_at',
            'updated_at',
        ]


class NewsCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsCategory
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'sort_order',
            'status',
            'created_at',
            'updated_at',
        ]


class PublicNewsCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsCategory
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'sort_order',
        ]


class NewsPostSerializer(PublishableModelSerializer):
    thumbnail_url = RelativeMediaURLField()
    og_image_url = RelativeMediaURLField()
    category = PublicNewsCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=NewsCategory.objects.all(),
        source='category',
        write_only=True,
    )
    gallery_images = serializers.ListField(
        child=RelativeMediaURLField(),
        required=False,
        allow_empty=True,
    )

    class Meta:
        model = NewsPost
        fields = [
            'id',
            'title',
            'slug',
            'category',
            'category_id',
            'excerpt',
            'thumbnail_url',
            'content_vi',
            'content_en',
            'gallery_images',
            'status',
            'is_featured',
            'sort_order',
            'published_at',
            'seo_title',
            'seo_description',
            'og_image_url',
            'created_at',
            'updated_at',
        ]


class PublicNewsPostSerializer(serializers.ModelSerializer):
    category = PublicNewsCategorySerializer(read_only=True)
    gallery_images = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
    )

    class Meta:
        model = NewsPost
        fields = [
            'id',
            'title',
            'slug',
            'category',
            'excerpt',
            'thumbnail_url',
            'content_vi',
            'content_en',
            'gallery_images',
            'is_featured',
            'sort_order',
            'published_at',
            'seo_title',
            'seo_description',
            'og_image_url',
            'created_at',
            'updated_at',
        ]


class EventSerializer(PublishableModelSerializer):
    banner_url = RelativeMediaURLField()
    og_image_url = RelativeMediaURLField()
    gallery_images = serializers.ListField(
        child=RelativeMediaURLField(),
        required=False,
        allow_empty=True,
    )
    event_status = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'banner_url',
            'start_date_time',
            'end_date_time',
            'location',
            'content_vi',
            'content_en',
            'registration_url',
            'gallery_images',
            'status',
            'event_status',
            'is_featured',
            'sort_order',
            'published_at',
            'seo_title',
            'seo_description',
            'og_image_url',
            'created_at',
            'updated_at',
        ]

    def validate(self, attrs):
        start_date_time = attrs.get('start_date_time', getattr(self.instance, 'start_date_time', None))
        end_date_time = attrs.get('end_date_time', getattr(self.instance, 'end_date_time', None))
        if start_date_time and end_date_time and end_date_time < start_date_time:
            raise serializers.ValidationError({'end_date_time': ['Thời gian kết thúc phải sau thời gian bắt đầu.']})
        return attrs

    def get_event_status(self, obj):
        return obj.event_status


class PublicEventSerializer(serializers.ModelSerializer):
    gallery_images = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
    )
    event_status = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'banner_url',
            'start_date_time',
            'end_date_time',
            'location',
            'content_vi',
            'content_en',
            'registration_url',
            'gallery_images',
            'event_status',
            'is_featured',
            'sort_order',
            'published_at',
            'seo_title',
            'seo_description',
            'og_image_url',
            'created_at',
            'updated_at',
        ]

    def get_event_status(self, obj):
        return obj.event_status