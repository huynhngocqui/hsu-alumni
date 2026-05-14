from django.conf import settings
from django.utils.text import slugify
from bson import ObjectId

from db.mongodb import get_mongo_collection

from .models import Tag


class DjangoOrmTagRepository:
    def list_tags(self):
        return list(Tag.objects.values('id', 'name', 'slug').order_by('name'))

    def get_tag(self, pk):
        try:
            return Tag.objects.values('id', 'name', 'slug').get(pk=int(pk))
        except (Tag.DoesNotExist, TypeError, ValueError):
            return None

    def create_tag(self, payload):
        tag = Tag.objects.create(name=payload['name'])
        return self.get_tag(tag.pk)

    def update_tag(self, pk, payload):
        try:
            tag = Tag.objects.get(pk=int(pk))
        except (Tag.DoesNotExist, TypeError, ValueError):
            return None

        tag.name = payload['name']
        tag.slug = slugify(payload['name'])
        tag.save(update_fields=['name', 'slug', 'updated_at'])
        return self.get_tag(tag.pk)

    def delete_tag(self, pk):
        try:
            tag = Tag.objects.get(pk=int(pk))
        except (Tag.DoesNotExist, TypeError, ValueError):
            return False

        tag.delete()
        return True


class MongoTagRepository:
    def __init__(self, collection_name):
        self.collection = get_mongo_collection(collection_name)
        self._ensure_indexes()

    def _ensure_indexes(self):
        indexes = self.collection.index_information()

        for index_name, field_name in (('name_1', 'name'), ('slug_1', 'slug')):
            index_spec = indexes.get(index_name)
            if index_spec and not index_spec.get('unique'):
                self.collection.drop_index(index_name)

            self.collection.create_index(field_name, unique=True)

    def list_tags(self):
        documents = self.collection.find({}, {'name': 1, 'slug': 1}).sort('name', 1)
        return [
            {
                'id': str(document.get('_id')),
                'name': document.get('name', ''),
                'slug': document.get('slug', ''),
            }
            for document in documents
        ]

    def get_tag(self, pk):
        document = None
        try:
            document = self.collection.find_one({'_id': ObjectId(str(pk))}, {'name': 1, 'slug': 1})
        except Exception:
            document = None

        if document is None and str(pk).isdigit():
            document = self.collection.find_one({'legacy_id': int(pk)}, {'name': 1, 'slug': 1})

        if document is None:
            return None

        return {
            'id': str(document.get('_id')),
            'name': document.get('name', ''),
            'slug': document.get('slug', ''),
        }

    def create_tag(self, payload):
        document = {'name': payload['name'], 'slug': slugify(payload['name'])}
        result = self.collection.insert_one(document)
        return {'id': str(result.inserted_id), 'name': document['name'], 'slug': document['slug']}

    def update_tag(self, pk, payload):
        tag = self.get_tag(pk)
        if tag is None:
            return None

        next_slug = slugify(payload['name'])
        self.collection.update_one(
            {'_id': ObjectId(str(tag['id']))},
            {'$set': {'name': payload['name'], 'slug': next_slug}},
        )
        return {'id': tag['id'], 'name': payload['name'], 'slug': next_slug}

    def delete_tag(self, pk):
        tag = self.get_tag(pk)
        if tag is None:
            return False

        self.collection.delete_one({'_id': ObjectId(str(tag['id']))})
        return True


def get_tag_repository():
    if settings.MONGODB_ENABLED:
        return MongoTagRepository(settings.MONGODB_TAGS_COLLECTION)

    return DjangoOrmTagRepository()