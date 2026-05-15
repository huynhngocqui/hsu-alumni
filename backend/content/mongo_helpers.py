from django.conf import settings

from db.mongodb import get_mongo_collection

from .models import AlumniPost, AlumniStory, Article, Event, GalleryItem, NewsCategory, NewsPost


def _normalize_media_url(value):
    if not value:
        return value

    normalized = str(value).strip()
    if not normalized:
        return ''

    for prefix in (
        'http://backend:8000/media/',
        'https://backend:8000/media/',
        'http://localhost:8000/media/',
        'https://localhost:8000/media/',
        'http://127.0.0.1:8000/media/',
        'https://127.0.0.1:8000/media/',
    ):
        if normalized.startswith(prefix):
            return f"/media/{normalized[len(prefix):]}"

    return normalized


def _normalize_markdown_media_urls(value):
    if not value:
        return value

    normalized = str(value)
    for prefix in (
        'http://backend:8000/media/',
        'https://backend:8000/media/',
        'http://localhost:8000/media/',
        'https://localhost:8000/media/',
        'http://127.0.0.1:8000/media/',
        'https://127.0.0.1:8000/media/',
    ):
        normalized = normalized.replace(prefix, '/media/')

    return normalized


def build_article_document(article):
    return {
        'legacy_id': article.id,
        'title': article.title,
        'slug': article.slug,
        'excerpt': article.excerpt,
        'body': _normalize_markdown_media_urls(article.body),
        'article_type': article.article_type,
        'external_url': article.external_url,
        'status': article.status,
        'published_at': article.published_at,
        'created_at': article.created_at,
        'updated_at': article.updated_at,
    }


def build_gallery_item_document(item):
    return {
        'legacy_id': item.id,
        'title': item.title,
        'album_name': item.album_name,
        'description': item.description,
        'image_url': _normalize_media_url(item.image_url),
        'drive_url': item.drive_url,
        'contributor_name': item.contributor_name,
        'status': item.status,
        'published_at': item.published_at,
        'created_at': item.created_at,
        'updated_at': item.updated_at,
    }


def build_alumni_story_document(story):
    return {
        'legacy_id': story.id,
        'title': story.title,
        'slug': story.slug,
        'story_category': story.story_category,
        'alumni_name': story.alumni_name,
        'company_name': story.company_name,
        'role_title': story.role_title,
        'excerpt': story.excerpt,
        'body': _normalize_markdown_media_urls(story.body),
        'featured_image_url': _normalize_media_url(story.featured_image_url),
        'status': story.status,
        'published_at': story.published_at,
        'created_at': story.created_at,
        'updated_at': story.updated_at,
    }


def build_alumni_post_document(post):
    return {
        'legacy_id': post.id,
        'full_name': post.full_name,
        'slug': post.slug,
        'position': post.position,
        'short_description': post.short_description,
        'company': post.company,
        'education_level': post.education_level,
        'cohort': post.cohort,
        'field': post.field,
        'major': post.major,
        'avatar_url': _normalize_media_url(post.avatar_url),
        'content_vi': _normalize_markdown_media_urls(post.content_vi),
        'content_en': _normalize_markdown_media_urls(post.content_en),
        'gallery_images': [_normalize_media_url(image) for image in (post.gallery_images or [])],
        'status': post.status,
        'sort_order': post.sort_order,
        'seo_title': post.seo_title,
        'seo_description': post.seo_description,
        'published_at': post.published_at,
        'created_at': post.created_at,
        'updated_at': post.updated_at,
    }


def build_news_category_document(category):
    return {
        'legacy_id': category.id,
        'name': category.name,
        'slug': category.slug,
        'description': category.description,
        'sort_order': category.sort_order,
        'status': category.status,
        'created_at': category.created_at,
        'updated_at': category.updated_at,
    }


def build_news_post_document(post):
    return {
        'legacy_id': post.id,
        'title': post.title,
        'slug': post.slug,
        'category': {
            'legacy_id': post.category_id,
            'name': post.category.name,
            'slug': post.category.slug,
            'description': post.category.description,
            'sort_order': post.category.sort_order,
            'status': post.category.status,
        },
        'excerpt': post.excerpt,
        'thumbnail_url': _normalize_media_url(post.thumbnail_url),
        'content_vi': _normalize_markdown_media_urls(post.content_vi),
        'content_en': _normalize_markdown_media_urls(post.content_en),
        'gallery_images': [_normalize_media_url(image) for image in (post.gallery_images or [])],
        'status': post.status,
        'is_featured': post.is_featured,
        'sort_order': post.sort_order,
        'published_at': post.published_at,
        'seo_title': post.seo_title,
        'seo_description': post.seo_description,
        'og_image_url': _normalize_media_url(post.og_image_url),
        'created_at': post.created_at,
        'updated_at': post.updated_at,
    }


def build_event_document(event):
    return {
        'legacy_id': event.id,
        'title': event.title,
        'slug': event.slug,
        'excerpt': event.excerpt,
        'banner_url': _normalize_media_url(event.banner_url),
        'start_date_time': event.start_date_time,
        'end_date_time': event.end_date_time,
        'location': event.location,
        'content_vi': _normalize_markdown_media_urls(event.content_vi),
        'content_en': _normalize_markdown_media_urls(event.content_en),
        'registration_url': event.registration_url,
        'gallery_images': [_normalize_media_url(image) for image in (event.gallery_images or [])],
        'status': event.status,
        'event_status': event.event_status,
        'is_featured': event.is_featured,
        'sort_order': event.sort_order,
        'published_at': event.published_at,
        'seo_title': event.seo_title,
        'seo_description': event.seo_description,
        'og_image_url': _normalize_media_url(event.og_image_url),
        'created_at': event.created_at,
        'updated_at': event.updated_at,
    }


def get_content_collection_map(require_enabled=False):
    return {
        'articles': get_mongo_collection(settings.MONGODB_CONTENT_ARTICLES_COLLECTION, require_enabled=require_enabled),
        'gallery_items': get_mongo_collection(settings.MONGODB_CONTENT_GALLERY_COLLECTION, require_enabled=require_enabled),
        'alumni_stories': get_mongo_collection(settings.MONGODB_CONTENT_STORIES_COLLECTION, require_enabled=require_enabled),
        'alumni_posts': get_mongo_collection(settings.MONGODB_CONTENT_ALUMNI_POSTS_COLLECTION, require_enabled=require_enabled),
        'news_categories': get_mongo_collection(settings.MONGODB_CONTENT_NEWS_CATEGORIES_COLLECTION, require_enabled=require_enabled),
        'news_posts': get_mongo_collection(settings.MONGODB_CONTENT_NEWS_POSTS_COLLECTION, require_enabled=require_enabled),
        'events': get_mongo_collection(settings.MONGODB_CONTENT_EVENTS_COLLECTION, require_enabled=require_enabled),
    }


def ensure_content_indexes(collection_map):
    collection_map['articles'].create_index('legacy_id', unique=True, sparse=True)
    collection_map['articles'].create_index('slug', unique=True)
    collection_map['articles'].create_index([('article_type', 1), ('status', 1), ('published_at', -1)])

    collection_map['gallery_items'].create_index('legacy_id', unique=True, sparse=True)
    collection_map['gallery_items'].create_index([('status', 1), ('published_at', -1)])

    collection_map['alumni_stories'].create_index('legacy_id', unique=True, sparse=True)
    collection_map['alumni_stories'].create_index('slug', unique=True)
    collection_map['alumni_stories'].create_index([('story_category', 1), ('status', 1), ('published_at', -1)])

    collection_map['alumni_posts'].create_index('legacy_id', unique=True, sparse=True)
    collection_map['alumni_posts'].create_index('slug', unique=True)
    collection_map['alumni_posts'].create_index([('status', 1), ('sort_order', 1), ('created_at', -1)])

    collection_map['news_categories'].create_index('legacy_id', unique=True, sparse=True)
    collection_map['news_categories'].create_index('slug', unique=True)
    collection_map['news_categories'].create_index([('status', 1), ('sort_order', 1), ('name', 1)])

    collection_map['news_posts'].create_index('legacy_id', unique=True, sparse=True)
    collection_map['news_posts'].create_index('slug', unique=True)
    collection_map['news_posts'].create_index([('status', 1), ('sort_order', 1), ('published_at', -1)])
    collection_map['news_posts'].create_index('category.slug')

    collection_map['events'].create_index('legacy_id', unique=True, sparse=True)
    collection_map['events'].create_index('slug', unique=True)
    collection_map['events'].create_index([('status', 1), ('sort_order', 1), ('start_date_time', 1)])