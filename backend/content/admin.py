from django.contrib import admin

from .models import AlumniStory, Article, GalleryItem


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'article_type', 'status', 'author', 'published_at')
    list_filter = ('article_type', 'status')
    search_fields = ('title', 'excerpt', 'author__email')


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'album_name', 'status', 'contributor_name', 'created_at')
    list_filter = ('status', 'album_name')
    search_fields = ('title', 'album_name', 'contributor_name')


@admin.register(AlumniStory)
class AlumniStoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'story_category', 'alumni_name', 'company_name', 'status', 'published_at')
    list_filter = ('story_category', 'status')
    search_fields = ('title', 'alumni_name', 'company_name')