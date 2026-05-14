from rest_framework import serializers

from .models import AlumniStory, Article, GalleryItem, PublishableModel


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


class GalleryItemSerializer(PublishableModelSerializer):
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


class AlumniStorySerializer(PublishableModelSerializer):
    class Meta:
        model = AlumniStory
        fields = [
            'id',
            'title',
            'slug',
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