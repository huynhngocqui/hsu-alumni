import re

from bson import ObjectId
from django.conf import settings
from django.db.models import Q
from django.utils import timezone

from db.mongodb import get_mongo_collection

from .models import CoopListing


def _serialize_listing_document(document):
    return {
        'id': str(document.get('_id', document.get('id'))),
        'owner': document.get('owner_legacy_id', document.get('owner')),
        'owner_name': document.get('owner_name', ''),
        'business_name': document.get('business_name', ''),
        'name': document.get('name', ''),
        'description': document.get('description', ''),
        'image_url': document.get('image_url', ''),
        'category_tags': document.get('category_tags', []),
        'status': document.get('status', CoopListing.Status.PUBLISHED),
        'created_at': document.get('created_at'),
        'updated_at': document.get('updated_at'),
    }


def _serialize_orm_listing(listing):
    return {
        'id': listing.id,
        'owner': listing.owner_id,
        'owner_name': listing.owner.full_name,
        'business_name': listing.business_name,
        'name': listing.name,
        'description': listing.description,
        'image_url': listing.image_url,
        'category_tags': listing.category_tags,
        'status': listing.status,
        'created_at': listing.created_at,
        'updated_at': listing.updated_at,
    }


class DjangoOrmCoopRepository:
    def list_published(self, search='', tag=''):
        queryset = CoopListing.objects.filter(status=CoopListing.Status.PUBLISHED).select_related('owner')

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
                | Q(business_name__icontains=search)
            )

        if tag:
            listing_ids = [
                listing.id
                for listing in queryset
                if any(str(item).strip().lower() == tag for item in listing.category_tags)
            ]
            queryset = queryset.filter(id__in=listing_ids)

        return [_serialize_orm_listing(listing) for listing in queryset]

    def get_listing(self, pk):
        try:
            listing = CoopListing.objects.select_related('owner').get(pk=int(pk))
        except (CoopListing.DoesNotExist, TypeError, ValueError):
            return None

        return _serialize_orm_listing(listing)

    def create_listing(self, owner, payload):
        listing = CoopListing.objects.create(
            owner=owner,
            business_name=owner.current_company or owner.full_name,
            **payload,
        )
        listing.refresh_from_db(fields=[])
        return _serialize_orm_listing(CoopListing.objects.select_related('owner').get(pk=listing.pk))


class MongoCoopRepository:
    def __init__(self, collection_name):
        self.collection = get_mongo_collection(collection_name)

    def list_published(self, search='', tag=''):
        query = {'status': CoopListing.Status.PUBLISHED}

        if search:
            query['$or'] = [
                {'name': {'$regex': re.escape(search), '$options': 'i'}},
                {'description': {'$regex': re.escape(search), '$options': 'i'}},
                {'business_name': {'$regex': re.escape(search), '$options': 'i'}},
            ]

        if tag:
            query['category_tags'] = {'$regex': f'^{re.escape(tag)}$', '$options': 'i'}

        documents = self.collection.find(query).sort('created_at', -1)
        return [_serialize_listing_document(document) for document in documents]

    def get_listing(self, pk):
        document = None

        try:
            document = self.collection.find_one({'_id': ObjectId(str(pk))})
        except Exception:
            document = None

        if document is None and str(pk).isdigit():
            document = self.collection.find_one({'legacy_id': int(pk)})

        if document is None:
            return None

        return _serialize_listing_document(document)

    def create_listing(self, owner, payload):
        now = timezone.now()
        document = {
            'owner_legacy_id': owner.id,
            'owner_email': owner.email,
            'owner_name': owner.full_name,
            'business_name': owner.current_company or owner.full_name,
            'name': payload['name'],
            'description': payload.get('description', ''),
            'image_url': payload.get('image_url', ''),
            'category_tags': payload['category_tags'],
            'status': CoopListing.Status.PUBLISHED,
            'created_at': now,
            'updated_at': now,
        }
        result = self.collection.insert_one(document)
        document['_id'] = result.inserted_id
        return _serialize_listing_document(document)


def get_coop_repository():
    if settings.MONGODB_ENABLED:
        return MongoCoopRepository(settings.MONGODB_COOP_COLLECTION)

    return DjangoOrmCoopRepository()