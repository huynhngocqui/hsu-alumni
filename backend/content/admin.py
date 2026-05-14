from django.contrib import admin

from .models import AlumniPost, AlumniStory, Article, Event, GalleryItem, NewsCategory, NewsPost


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


@admin.register(AlumniPost)
class AlumniPostAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'position', 'company', 'status', 'sort_order', 'published_at')
    list_filter = ('status', 'education_level', 'cohort', 'field', 'major')
    search_fields = ('full_name', 'position', 'company', 'major', 'slug')


@admin.register(NewsCategory)
class NewsCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'status', 'sort_order', 'updated_at')
    list_filter = ('status',)
    search_fields = ('name', 'slug', 'description')


@admin.register(NewsPost)
class NewsPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'is_featured', 'sort_order', 'published_at')
    list_filter = ('status', 'is_featured', 'category')
    search_fields = ('title', 'slug', 'excerpt')


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'start_date_time', 'end_date_time', 'is_featured', 'sort_order')
    list_filter = ('status', 'is_featured')
    search_fields = ('title', 'slug', 'excerpt', 'location')