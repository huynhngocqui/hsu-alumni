from bson import ObjectId
from django.conf import settings
from django.utils.text import slugify
from django.utils import timezone

from db.mongodb import get_mongo_collection

from .models import AlumniStory, Article, Event, NewsCategory, PublishableModel
from .mongo_helpers import ensure_content_indexes, get_content_collection_map


def _serialize_document(document):
    if document is None:
        return None

    payload = dict(document)
    payload['id'] = str(payload.pop('_id'))
    return payload


def _serialize_news_document(document):
    payload = _serialize_document(document)
    category = payload.get('category') or {}
    if category and 'id' not in category:
        category['id'] = str(category.get('legacy_id', ''))
    payload['category'] = category
    return payload


def _find_by_pk(collection, pk):
    document = None

    try:
        document = collection.find_one({'_id': ObjectId(str(pk))})
    except Exception:
        document = None

    if document is None and str(pk).isdigit():
        document = collection.find_one({'legacy_id': int(pk)})

    return document


def _paginate_documents(documents, page, limit):
    total_count = len(documents)
    total_pages = max((total_count + limit - 1) // limit, 1)
    safe_page = min(max(page, 1), total_pages)
    start_index = (safe_page - 1) * limit
    end_index = start_index + limit
    items = documents[start_index:end_index]
    return {
        'count': total_count,
        'page': safe_page,
        'limit': limit,
        'total_pages': total_pages,
        'results': [_serialize_document(item) for item in items],
    }


class MongoContentRepository:
    def __init__(self):
        self.collection_map = get_content_collection_map()
        ensure_content_indexes(self.collection_map)

    def summary_counts(self):
        now = timezone.now()
        return {
            'published_articles': self.collection_map['articles'].count_documents({
                'status': PublishableModel.Status.PUBLISHED,
                'article_type': {'$ne': Article.ArticleType.PAGE},
            }),
            'pending_gallery': self.collection_map['gallery_items'].count_documents({
                'status': {'$ne': PublishableModel.Status.PUBLISHED},
            }),
            'draft_stories': self.collection_map['alumni_stories'].count_documents({
                'status': {'$ne': PublishableModel.Status.PUBLISHED},
            }),
            'total_news': self.collection_map['news_posts'].count_documents({}),
            'published_news': self.collection_map['news_posts'].count_documents({'status': PublishableModel.Status.PUBLISHED}),
            'draft_news': self.collection_map['news_posts'].count_documents({'status': PublishableModel.Status.DRAFT}),
            'total_events': self.collection_map['events'].count_documents({}),
            'upcoming_events': self.collection_map['events'].count_documents({
                'status': PublishableModel.Status.PUBLISHED,
                'start_date_time': {'$gte': now},
            }),
            'past_events': self.collection_map['events'].count_documents({
                'status': PublishableModel.Status.PUBLISHED,
                'end_date_time': {'$lt': now},
            }),
            'total_alumni_posts': self.collection_map['alumni_posts'].count_documents({}),
        }

    def list_admin_articles(self):
        cursor = self.collection_map['articles'].find({}).sort([('published_at', -1), ('created_at', -1)])
        return [_serialize_document(document) for document in cursor]

    def get_article(self, pk):
        return _serialize_document(_find_by_pk(self.collection_map['articles'], pk))

    def create_article(self, payload, user=None):
        now = timezone.now()
        published_at = payload.get('published_at')
        if payload.get('status') == PublishableModel.Status.PUBLISHED and published_at is None:
            published_at = now
        document = {
            'legacy_id': self._next_legacy_id(self.collection_map['articles']),
            'title': payload['title'],
            'slug': payload.get('slug') or slugify(payload['title']),
            'excerpt': payload.get('excerpt', ''),
            'body': payload.get('body', ''),
            'article_type': payload.get('article_type') or Article.ArticleType.NEWS,
            'external_url': payload.get('external_url', ''),
            'status': payload.get('status') or PublishableModel.Status.DRAFT,
            'published_at': published_at,
            'author_legacy_id': getattr(user, 'id', None),
            'author_email': getattr(user, 'email', ''),
            'created_at': now,
            'updated_at': now,
        }
        result = self.collection_map['articles'].insert_one(document)
        document['_id'] = result.inserted_id
        return _serialize_document(document)

    def update_article(self, pk, payload):
        existing = _find_by_pk(self.collection_map['articles'], pk)
        if existing is None:
            return None
        published_at = payload.get('published_at', existing.get('published_at'))
        if payload.get('status') == PublishableModel.Status.PUBLISHED and published_at is None:
            published_at = timezone.now()
        next_document = {
            'title': payload['title'],
            'slug': payload.get('slug') or slugify(payload['title']),
            'excerpt': payload.get('excerpt', ''),
            'body': payload.get('body', ''),
            'article_type': payload.get('article_type') or existing.get('article_type') or Article.ArticleType.NEWS,
            'external_url': payload.get('external_url', ''),
            'status': payload.get('status') or existing.get('status') or PublishableModel.Status.DRAFT,
            'published_at': published_at,
            'updated_at': timezone.now(),
        }
        self.collection_map['articles'].update_one({'_id': existing['_id']}, {'$set': next_document})
        existing.update(next_document)
        return _serialize_document(existing)

    def delete_article(self, pk):
        existing = _find_by_pk(self.collection_map['articles'], pk)
        if existing is None:
            return False
        self.collection_map['articles'].delete_one({'_id': existing['_id']})
        return True

    def list_admin_gallery_items(self):
        cursor = self.collection_map['gallery_items'].find({}).sort([('published_at', -1), ('created_at', -1)])
        return [_serialize_document(document) for document in cursor]

    def get_gallery_item(self, pk):
        return _serialize_document(_find_by_pk(self.collection_map['gallery_items'], pk))

    def create_gallery_item(self, payload):
        now = timezone.now()
        published_at = payload.get('published_at')
        if payload.get('status') == PublishableModel.Status.PUBLISHED and published_at is None:
            published_at = now
        document = {
            'legacy_id': self._next_legacy_id(self.collection_map['gallery_items']),
            'title': payload['title'],
            'album_name': payload.get('album_name', ''),
            'description': payload.get('description', ''),
            'image_url': payload.get('image_url', ''),
            'drive_url': payload.get('drive_url', ''),
            'contributor_name': payload.get('contributor_name', ''),
            'status': payload.get('status') or PublishableModel.Status.DRAFT,
            'published_at': published_at,
            'created_at': now,
            'updated_at': now,
        }
        result = self.collection_map['gallery_items'].insert_one(document)
        document['_id'] = result.inserted_id
        return _serialize_document(document)

    def update_gallery_item(self, pk, payload):
        existing = _find_by_pk(self.collection_map['gallery_items'], pk)
        if existing is None:
            return None
        published_at = payload.get('published_at', existing.get('published_at'))
        if payload.get('status') == PublishableModel.Status.PUBLISHED and published_at is None:
            published_at = timezone.now()
        next_document = {
            'title': payload['title'],
            'album_name': payload.get('album_name', ''),
            'description': payload.get('description', ''),
            'image_url': payload.get('image_url', ''),
            'drive_url': payload.get('drive_url', ''),
            'contributor_name': payload.get('contributor_name', ''),
            'status': payload.get('status') or existing.get('status') or PublishableModel.Status.DRAFT,
            'published_at': published_at,
            'updated_at': timezone.now(),
        }
        self.collection_map['gallery_items'].update_one({'_id': existing['_id']}, {'$set': next_document})
        existing.update(next_document)
        return _serialize_document(existing)

    def delete_gallery_item(self, pk):
        existing = _find_by_pk(self.collection_map['gallery_items'], pk)
        if existing is None:
            return False
        self.collection_map['gallery_items'].delete_one({'_id': existing['_id']})
        return True

    def list_admin_alumni_stories(self):
        cursor = self.collection_map['alumni_stories'].find({}).sort([('published_at', -1), ('created_at', -1)])
        return [_serialize_document(document) for document in cursor]

    def get_alumni_story(self, pk):
        return _serialize_document(_find_by_pk(self.collection_map['alumni_stories'], pk))

    def create_alumni_story(self, payload):
        now = timezone.now()
        published_at = payload.get('published_at')
        if payload.get('status') == PublishableModel.Status.PUBLISHED and published_at is None:
            published_at = now
        document = {
            'legacy_id': self._next_legacy_id(self.collection_map['alumni_stories']),
            'title': payload['title'],
            'slug': payload.get('slug') or slugify(payload['title']),
            'story_category': payload.get('story_category') or AlumniStory.StoryCategory.SUCCESS,
            'alumni_name': payload['alumni_name'],
            'company_name': payload.get('company_name', ''),
            'role_title': payload.get('role_title', ''),
            'excerpt': payload.get('excerpt', ''),
            'body': payload.get('body', ''),
            'featured_image_url': payload.get('featured_image_url', ''),
            'status': payload.get('status') or PublishableModel.Status.DRAFT,
            'published_at': published_at,
            'created_at': now,
            'updated_at': now,
        }
        result = self.collection_map['alumni_stories'].insert_one(document)
        document['_id'] = result.inserted_id
        return _serialize_document(document)

    def update_alumni_story(self, pk, payload):
        existing = _find_by_pk(self.collection_map['alumni_stories'], pk)
        if existing is None:
            return None
        published_at = payload.get('published_at', existing.get('published_at'))
        if payload.get('status') == PublishableModel.Status.PUBLISHED and published_at is None:
            published_at = timezone.now()
        next_document = {
            'title': payload['title'],
            'slug': payload.get('slug') or slugify(payload['title']),
            'story_category': payload.get('story_category') or existing.get('story_category') or AlumniStory.StoryCategory.SUCCESS,
            'alumni_name': payload['alumni_name'],
            'company_name': payload.get('company_name', ''),
            'role_title': payload.get('role_title', ''),
            'excerpt': payload.get('excerpt', ''),
            'body': payload.get('body', ''),
            'featured_image_url': payload.get('featured_image_url', ''),
            'status': payload.get('status') or existing.get('status') or PublishableModel.Status.DRAFT,
            'published_at': published_at,
            'updated_at': timezone.now(),
        }
        self.collection_map['alumni_stories'].update_one({'_id': existing['_id']}, {'$set': next_document})
        existing.update(next_document)
        return _serialize_document(existing)

    def delete_alumni_story(self, pk):
        existing = _find_by_pk(self.collection_map['alumni_stories'], pk)
        if existing is None:
            return False
        self.collection_map['alumni_stories'].delete_one({'_id': existing['_id']})
        return True

    def list_admin_alumni_posts(self):
        cursor = self.collection_map['alumni_posts'].find({}).sort([('sort_order', 1), ('created_at', -1)])
        return [_serialize_document(document) for document in cursor]

    def get_alumni_post(self, pk):
        return _serialize_document(_find_by_pk(self.collection_map['alumni_posts'], pk))

    def create_alumni_post(self, payload):
        now = timezone.now()
        published_at = payload.get('published_at')
        if payload.get('status') == PublishableModel.Status.PUBLISHED and published_at is None:
            published_at = now
        document = {
            'legacy_id': self._next_legacy_id(self.collection_map['alumni_posts']),
            'full_name': payload['full_name'],
            'slug': payload.get('slug') or slugify(payload['full_name']),
            'position': payload['position'],
            'short_description': payload.get('short_description', ''),
            'company': payload.get('company', ''),
            'education_level': payload.get('education_level', ''),
            'cohort': payload.get('cohort', ''),
            'field': payload.get('field', ''),
            'major': payload.get('major', ''),
            'avatar_url': payload.get('avatar_url', ''),
            'content_vi': payload.get('content_vi', ''),
            'content_en': payload.get('content_en', ''),
            'gallery_images': payload.get('gallery_images', []),
            'status': payload.get('status') or PublishableModel.Status.DRAFT,
            'sort_order': int(payload.get('sort_order') or 0),
            'seo_title': payload.get('seo_title', ''),
            'seo_description': payload.get('seo_description', ''),
            'published_at': published_at,
            'created_at': now,
            'updated_at': now,
        }
        result = self.collection_map['alumni_posts'].insert_one(document)
        document['_id'] = result.inserted_id
        return _serialize_document(document)

    def update_alumni_post(self, pk, payload):
        existing = _find_by_pk(self.collection_map['alumni_posts'], pk)
        if existing is None:
            return None
        published_at = payload.get('published_at', existing.get('published_at'))
        if payload.get('status') == PublishableModel.Status.PUBLISHED and published_at is None:
            published_at = timezone.now()
        next_document = {
            'full_name': payload['full_name'],
            'slug': payload.get('slug') or slugify(payload['full_name']),
            'position': payload['position'],
            'short_description': payload.get('short_description', ''),
            'company': payload.get('company', ''),
            'education_level': payload.get('education_level', ''),
            'cohort': payload.get('cohort', ''),
            'field': payload.get('field', ''),
            'major': payload.get('major', ''),
            'avatar_url': payload.get('avatar_url', ''),
            'content_vi': payload.get('content_vi', ''),
            'content_en': payload.get('content_en', ''),
            'gallery_images': payload.get('gallery_images', []),
            'status': payload.get('status') or existing.get('status') or PublishableModel.Status.DRAFT,
            'sort_order': int(payload.get('sort_order') or 0),
            'seo_title': payload.get('seo_title', ''),
            'seo_description': payload.get('seo_description', ''),
            'published_at': published_at,
            'updated_at': timezone.now(),
        }
        self.collection_map['alumni_posts'].update_one({'_id': existing['_id']}, {'$set': next_document})
        existing.update(next_document)
        return _serialize_document(existing)

    def delete_alumni_post(self, pk):
        existing = _find_by_pk(self.collection_map['alumni_posts'], pk)
        if existing is None:
            return False
        self.collection_map['alumni_posts'].delete_one({'_id': existing['_id']})
        return True

    def get_page_by_slug(self, slug):
        return _serialize_document(self.collection_map['articles'].find_one({
            'article_type': Article.ArticleType.PAGE,
            'status': PublishableModel.Status.PUBLISHED,
            'slug': slug,
        }))

    def list_public_articles(self, article_type='', limit=0):
        query = {
            'status': PublishableModel.Status.PUBLISHED,
            'article_type': {'$ne': Article.ArticleType.PAGE},
        }
        if article_type in Article.ArticleType.values and article_type != Article.ArticleType.PAGE:
            query['article_type'] = article_type

        cursor = self.collection_map['articles'].find(query).sort([('published_at', -1), ('created_at', -1)])
        if limit:
            cursor = cursor.limit(limit)
        return [_serialize_document(document) for document in cursor]

    def get_public_article(self, slug):
        return _serialize_document(self.collection_map['articles'].find_one({
            'status': PublishableModel.Status.PUBLISHED,
            'article_type': {'$ne': Article.ArticleType.PAGE},
            'slug': slug,
        }))

    def list_public_gallery(self):
        cursor = self.collection_map['gallery_items'].find({'status': PublishableModel.Status.PUBLISHED}).sort([('published_at', -1), ('created_at', -1)])
        return [_serialize_document(document) for document in cursor]

    def create_gallery_contribution(self, payload):
        document = {
            'title': payload['title'],
            'album_name': payload.get('album_name', ''),
            'description': payload.get('description', ''),
            'image_url': payload.get('image_url', ''),
            'drive_url': payload.get('drive_url', ''),
            'contributor_name': payload.get('contributor_name', ''),
            'status': PublishableModel.Status.DRAFT,
            'published_at': None,
            'created_at': timezone.now(),
            'updated_at': timezone.now(),
        }
        result = self.collection_map['gallery_items'].insert_one(document)
        document['_id'] = result.inserted_id
        return _serialize_document(document)

    def list_public_stories(self, category=''):
        query = {'status': PublishableModel.Status.PUBLISHED}
        if category in AlumniStory.StoryCategory.values:
            query['story_category'] = category
        cursor = self.collection_map['alumni_stories'].find(query).sort([('published_at', -1), ('created_at', -1)])
        return [_serialize_document(document) for document in cursor]

    def get_public_story(self, slug):
        return _serialize_document(self.collection_map['alumni_stories'].find_one({
            'status': PublishableModel.Status.PUBLISHED,
            'slug': slug,
        }))

    def list_public_alumni_posts(self, *, search='', filters=None, page=1, page_size=12, paginate=False):
        filters = filters or {}
        query = {'status': PublishableModel.Status.PUBLISHED}

        if search:
            query['full_name'] = {'$regex': search, '$options': 'i'}

        for key, value in filters.items():
            if value:
                query[key] = value

        documents = list(self.collection_map['alumni_posts'].find(query).sort([('sort_order', 1), ('created_at', -1)]))
        if not paginate:
            return [_serialize_document(document) for document in documents]

        return {
            'count': len(documents),
            'page': min(max(page, 1), max((len(documents) + page_size - 1) // page_size, 1)),
            'page_size': page_size,
            'total_pages': max((len(documents) + page_size - 1) // page_size, 1),
            'results': [_serialize_document(document) for document in documents[(max(page, 1) - 1) * page_size: (max(page, 1) - 1) * page_size + page_size]],
        }

    def get_public_alumni_post(self, slug):
        return _serialize_document(self.collection_map['alumni_posts'].find_one({
            'status': PublishableModel.Status.PUBLISHED,
            'slug': slug,
        }))

    def list_public_news_categories(self):
        cursor = self.collection_map['news_categories'].find({'status': NewsCategory.Status.PUBLISHED}).sort([('sort_order', 1), ('name', 1)])
        return [_serialize_document(document) for document in cursor]

    def list_admin_news_categories(self):
        cursor = self.collection_map['news_categories'].find({}).sort([('sort_order', 1), ('name', 1)])
        return [_serialize_document(document) for document in cursor]

    def get_news_category(self, pk):
        return _serialize_document(_find_by_pk(self.collection_map['news_categories'], pk))

    def _next_legacy_id(self, collection):
        document = collection.find_one(sort=[('legacy_id', -1)], projection={'legacy_id': 1})
        return int(document.get('legacy_id', 0) or 0) + 1 if document else 1

    def create_news_category(self, payload):
        now = timezone.now()
        document = {
            'legacy_id': self._next_legacy_id(self.collection_map['news_categories']),
            'name': payload['name'],
            'slug': payload.get('slug') or slugify(payload['name']),
            'description': payload.get('description', ''),
            'sort_order': int(payload.get('sort_order') or 0),
            'status': payload.get('status') or NewsCategory.Status.PUBLISHED,
            'created_at': now,
            'updated_at': now,
        }
        result = self.collection_map['news_categories'].insert_one(document)
        document['_id'] = result.inserted_id
        return _serialize_document(document)

    def update_news_category(self, pk, payload):
        existing = _find_by_pk(self.collection_map['news_categories'], pk)
        if existing is None:
            return None
        next_document = {
            'name': payload['name'],
            'slug': payload.get('slug') or slugify(payload['name']),
            'description': payload.get('description', ''),
            'sort_order': int(payload.get('sort_order') or 0),
            'status': payload.get('status') or existing.get('status') or NewsCategory.Status.PUBLISHED,
            'updated_at': timezone.now(),
        }
        self.collection_map['news_categories'].update_one({'_id': existing['_id']}, {'$set': next_document})
        existing.update(next_document)
        return _serialize_document(existing)

    def delete_news_category(self, pk):
        existing = _find_by_pk(self.collection_map['news_categories'], pk)
        if existing is None:
            return False
        self.collection_map['news_categories'].delete_one({'_id': existing['_id']})
        return True

    def _get_embedded_category(self, category_pk):
        document = _find_by_pk(self.collection_map['news_categories'], category_pk)
        if document is None:
            return None
        payload = _serialize_document(document)
        payload['legacy_id'] = document.get('legacy_id')
        return {
            'id': payload['id'],
            'legacy_id': payload.get('legacy_id'),
            'name': payload.get('name', ''),
            'slug': payload.get('slug', ''),
            'description': payload.get('description', ''),
            'sort_order': payload.get('sort_order', 0),
            'status': payload.get('status', NewsCategory.Status.PUBLISHED),
        }

    def list_news_posts(self, *, search='', category='', requested_status='', is_admin=False, page=1, limit=9):
        query = {}
        if is_admin and requested_status in PublishableModel.Status.values:
            query['status'] = requested_status
        else:
            query['status'] = PublishableModel.Status.PUBLISHED

        if search:
            query['$or'] = [
                {'title': {'$regex': search, '$options': 'i'}},
                {'excerpt': {'$regex': search, '$options': 'i'}},
                {'content_vi': {'$regex': search, '$options': 'i'}},
                {'content_en': {'$regex': search, '$options': 'i'}},
            ]

        if category:
            if category.isdigit():
                query['category.legacy_id'] = int(category)
            else:
                query['category.slug'] = category

        documents = list(self.collection_map['news_posts'].find(query).sort([('sort_order', 1), ('published_at', -1), ('created_at', -1)]))
        total_count = len(documents)
        total_pages = max((total_count + limit - 1) // limit, 1)
        safe_page = min(max(page, 1), total_pages)
        start_index = (safe_page - 1) * limit
        end_index = start_index + limit
        items = documents[start_index:end_index]
        return {
            'count': total_count,
            'page': safe_page,
            'limit': limit,
            'total_pages': total_pages,
            'results': [_serialize_news_document(item) for item in items],
        }

    def list_admin_news_posts(self, *, search='', category='', status=''):
        payload = self.list_news_posts(
            search=search,
            category=category,
            requested_status=status,
            is_admin=True,
            page=1,
            limit=1000,
        )
        return payload['results']

    def get_news_post(self, pk):
        payload = _serialize_news_document(_find_by_pk(self.collection_map['news_posts'], pk))
        if payload and payload.get('category', {}).get('id'):
            payload['category_id'] = payload['category']['id']
        return payload

    def create_news_post(self, payload):
        category = self._get_embedded_category(payload['category_id'])
        if category is None:
            return None
        now = timezone.now()
        published_at = payload.get('published_at')
        if payload.get('status') == PublishableModel.Status.PUBLISHED and published_at is None:
            published_at = now
        document = {
            'legacy_id': self._next_legacy_id(self.collection_map['news_posts']),
            'title': payload['title'],
            'slug': payload.get('slug') or slugify(payload['title']),
            'category': category,
            'excerpt': payload.get('excerpt', ''),
            'thumbnail_url': payload.get('thumbnail_url', ''),
            'content_vi': payload.get('content_vi', ''),
            'content_en': payload.get('content_en', ''),
            'gallery_images': payload.get('gallery_images', []),
            'status': payload.get('status') or PublishableModel.Status.DRAFT,
            'is_featured': bool(payload.get('is_featured')),
            'sort_order': int(payload.get('sort_order') or 0),
            'published_at': published_at,
            'seo_title': payload.get('seo_title', ''),
            'seo_description': payload.get('seo_description', ''),
            'og_image_url': payload.get('og_image_url', ''),
            'created_at': now,
            'updated_at': now,
        }
        result = self.collection_map['news_posts'].insert_one(document)
        document['_id'] = result.inserted_id
        return _serialize_news_document(document)

    def update_news_post(self, pk, payload):
        existing = _find_by_pk(self.collection_map['news_posts'], pk)
        if existing is None:
            return None
        category = self._get_embedded_category(payload['category_id'])
        if category is None:
            return None
        published_at = payload.get('published_at', existing.get('published_at'))
        if payload.get('status') == PublishableModel.Status.PUBLISHED and published_at is None:
            published_at = timezone.now()
        next_document = {
            'title': payload['title'],
            'slug': payload.get('slug') or slugify(payload['title']),
            'category': category,
            'excerpt': payload.get('excerpt', ''),
            'thumbnail_url': payload.get('thumbnail_url', ''),
            'content_vi': payload.get('content_vi', ''),
            'content_en': payload.get('content_en', ''),
            'gallery_images': payload.get('gallery_images', []),
            'status': payload.get('status') or existing.get('status') or PublishableModel.Status.DRAFT,
            'is_featured': bool(payload.get('is_featured')),
            'sort_order': int(payload.get('sort_order') or 0),
            'published_at': published_at,
            'seo_title': payload.get('seo_title', ''),
            'seo_description': payload.get('seo_description', ''),
            'og_image_url': payload.get('og_image_url', ''),
            'updated_at': timezone.now(),
        }
        self.collection_map['news_posts'].update_one({'_id': existing['_id']}, {'$set': next_document})
        existing.update(next_document)
        return _serialize_news_document(existing)

    def delete_news_post(self, pk):
        existing = _find_by_pk(self.collection_map['news_posts'], pk)
        if existing is None:
            return False
        self.collection_map['news_posts'].delete_one({'_id': existing['_id']})
        return True

    def get_public_news_post(self, slug):
        document = self.collection_map['news_posts'].find_one({
            'status': PublishableModel.Status.PUBLISHED,
            'slug': slug,
        })
        if document is None:
            return None

        payload = _serialize_news_document(document)
        category_slug = payload.get('category', {}).get('slug')
        related_query = {'status': PublishableModel.Status.PUBLISHED, 'slug': {'$ne': slug}}
        if category_slug:
            related_query['category.slug'] = category_slug

        payload['related_news'] = [
            _serialize_news_document(item)
            for item in self.collection_map['news_posts'].find(related_query).sort([('sort_order', 1), ('published_at', -1)]).limit(8)
        ]
        payload['related_categories'] = self.list_public_news_categories()
        return payload

    def list_events(self, *, search='', requested_status='', is_admin=False, event_status='', page=1, limit=9):
        query = {}
        now = timezone.now()

        if is_admin and requested_status in PublishableModel.Status.values:
            query['status'] = requested_status
        else:
            query['status'] = PublishableModel.Status.PUBLISHED

        if search:
            query['$or'] = [
                {'title': {'$regex': search, '$options': 'i'}},
                {'excerpt': {'$regex': search, '$options': 'i'}},
                {'location': {'$regex': search, '$options': 'i'}},
                {'content_vi': {'$regex': search, '$options': 'i'}},
                {'content_en': {'$regex': search, '$options': 'i'}},
            ]

        normalized_event_status = (event_status or '').strip().upper()
        if normalized_event_status == 'UPCOMING':
            query['start_date_time'] = {'$gte': now}
        elif normalized_event_status == 'PAST':
            query['end_date_time'] = {'$lt': now}

        documents = list(self.collection_map['events'].find(query).sort([('sort_order', 1), ('start_date_time', 1), ('created_at', -1)]))
        return _paginate_documents(documents, page, limit)

    def list_admin_events(self, *, search='', status='', event_status=''):
        payload = self.list_events(
            search=search,
            requested_status=status,
            is_admin=True,
            event_status=event_status,
            page=1,
            limit=1000,
        )
        return payload['results']

    def get_event(self, pk):
        return _serialize_document(_find_by_pk(self.collection_map['events'], pk))

    def create_event(self, payload):
        now = timezone.now()
        published_at = payload.get('published_at')
        if payload.get('status') == PublishableModel.Status.PUBLISHED and published_at is None:
            published_at = now
        document = {
            'legacy_id': self._next_legacy_id(self.collection_map['events']),
            'title': payload['title'],
            'slug': payload.get('slug') or slugify(payload['title']),
            'excerpt': payload.get('excerpt', ''),
            'banner_url': payload.get('banner_url', ''),
            'start_date_time': payload['start_date_time'],
            'end_date_time': payload['end_date_time'],
            'location': payload.get('location', ''),
            'content_vi': payload.get('content_vi', ''),
            'content_en': payload.get('content_en', ''),
            'registration_url': payload.get('registration_url', ''),
            'gallery_images': payload.get('gallery_images', []),
            'status': payload.get('status') or PublishableModel.Status.DRAFT,
            'event_status': 'PAST' if payload['end_date_time'] < now else 'UPCOMING',
            'is_featured': bool(payload.get('is_featured')),
            'sort_order': int(payload.get('sort_order') or 0),
            'published_at': published_at,
            'seo_title': payload.get('seo_title', ''),
            'seo_description': payload.get('seo_description', ''),
            'og_image_url': payload.get('og_image_url', ''),
            'created_at': now,
            'updated_at': now,
        }
        result = self.collection_map['events'].insert_one(document)
        document['_id'] = result.inserted_id
        return _serialize_document(document)

    def update_event(self, pk, payload):
        existing = _find_by_pk(self.collection_map['events'], pk)
        if existing is None:
            return None
        now = timezone.now()
        published_at = payload.get('published_at', existing.get('published_at'))
        if payload.get('status') == PublishableModel.Status.PUBLISHED and published_at is None:
            published_at = now
        next_document = {
            'title': payload['title'],
            'slug': payload.get('slug') or slugify(payload['title']),
            'excerpt': payload.get('excerpt', ''),
            'banner_url': payload.get('banner_url', ''),
            'start_date_time': payload['start_date_time'],
            'end_date_time': payload['end_date_time'],
            'location': payload.get('location', ''),
            'content_vi': payload.get('content_vi', ''),
            'content_en': payload.get('content_en', ''),
            'registration_url': payload.get('registration_url', ''),
            'gallery_images': payload.get('gallery_images', []),
            'status': payload.get('status') or existing.get('status') or PublishableModel.Status.DRAFT,
            'event_status': 'PAST' if payload['end_date_time'] < now else 'UPCOMING',
            'is_featured': bool(payload.get('is_featured')),
            'sort_order': int(payload.get('sort_order') or 0),
            'published_at': published_at,
            'seo_title': payload.get('seo_title', ''),
            'seo_description': payload.get('seo_description', ''),
            'og_image_url': payload.get('og_image_url', ''),
            'updated_at': timezone.now(),
        }
        self.collection_map['events'].update_one({'_id': existing['_id']}, {'$set': next_document})
        existing.update(next_document)
        return _serialize_document(existing)

    def delete_event(self, pk):
        existing = _find_by_pk(self.collection_map['events'], pk)
        if existing is None:
            return False
        self.collection_map['events'].delete_one({'_id': existing['_id']})
        return True

    def get_public_event(self, slug):
        document = self.collection_map['events'].find_one({
            'status': PublishableModel.Status.PUBLISHED,
            'slug': slug,
        })
        if document is None:
            return None

        payload = _serialize_document(document)
        now = timezone.now()
        related_query = {
            'status': PublishableModel.Status.PUBLISHED,
            'slug': {'$ne': slug},
        }
        if payload.get('event_status') == 'PAST':
            related_query['end_date_time'] = {'$lt': now}
        else:
            related_query['start_date_time'] = {'$gte': now}

        payload['related_events'] = [
            _serialize_document(item)
            for item in self.collection_map['events'].find(related_query).sort([('sort_order', 1), ('start_date_time', 1)]).limit(6)
        ]
        return payload


def get_content_repository():
    if settings.MONGODB_ENABLED:
        return MongoContentRepository()
    raise NotImplementedError('SQLite-backed content repository path has not been implemented in this module.')