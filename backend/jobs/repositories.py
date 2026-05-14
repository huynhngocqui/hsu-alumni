import re

from bson import ObjectId
from django.conf import settings
from django.core.files.storage import default_storage
from django.db.models import Q
from django.utils import timezone

from db.mongodb import get_mongo_collection

from .models import JobApplication, JobListing


def _safe_storage_url(path):
    try:
        return default_storage.url(path)
    except Exception:
        return path


def _serialize_orm_listing(listing):
    return {
        'id': listing.id,
        'legacy_id': listing.id,
        'owner': listing.owner_id,
        'owner_name': listing.owner.full_name,
        'company_name': listing.company_name,
        'job_name': listing.job_name,
        'job_position': listing.job_position,
        'job_description': listing.job_description,
        'category_tags': listing.category_tags,
        'status': listing.status,
        'applications_count': listing.applications.count(),
        'created_at': listing.created_at,
        'updated_at': listing.updated_at,
    }


def _serialize_listing_document(document, applications_count=0):
    return {
        'id': str(document.get('_id', document.get('id'))),
        'legacy_id': document.get('legacy_id'),
        'owner': document.get('owner_legacy_id', document.get('owner')),
        'owner_name': document.get('owner_name', ''),
        'company_name': document.get('company_name', ''),
        'job_name': document.get('job_name', ''),
        'job_position': document.get('job_position', ''),
        'job_description': document.get('job_description', ''),
        'category_tags': document.get('category_tags', []),
        'status': document.get('status', JobListing.Status.PUBLISHED),
        'applications_count': applications_count,
        'created_at': document.get('created_at'),
        'updated_at': document.get('updated_at'),
    }


def _serialize_orm_application(application):
    return {
        'id': application.id,
        'job_listing': application.job_listing_id,
        'applicant': application.applicant_id,
        'cv_file': application.cv_file.url if application.cv_file else '',
        'cover_note': application.cover_note,
        'created_at': application.created_at,
    }


def _serialize_application_document(document):
    return {
        'id': str(document.get('_id', document.get('id'))),
        'job_listing': document.get('job_listing_id', document.get('job_listing_legacy_id')),
        'applicant': document.get('applicant_legacy_id', document.get('applicant')),
        'cv_file': document.get('cv_file_url', document.get('cv_file_path', '')),
        'cover_note': document.get('cover_note', ''),
        'created_at': document.get('created_at'),
    }


class DjangoOrmJobRepository:
    def list_published(self, search='', tag=''):
        queryset = JobListing.objects.filter(status=JobListing.Status.PUBLISHED).select_related('owner')

        if search:
            queryset = queryset.filter(
                Q(job_name__icontains=search)
                | Q(job_position__icontains=search)
                | Q(job_description__icontains=search)
                | Q(company_name__icontains=search)
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
            listing = JobListing.objects.select_related('owner').get(pk=int(pk))
        except (JobListing.DoesNotExist, TypeError, ValueError):
            return None

        return _serialize_orm_listing(listing)

    def create_listing(self, owner, payload):
        listing = JobListing.objects.create(
            owner=owner,
            company_name=owner.current_company or owner.full_name,
            **payload,
        )
        return _serialize_orm_listing(JobListing.objects.select_related('owner').get(pk=listing.pk))

    def application_exists(self, listing, applicant_id):
        return JobApplication.objects.filter(job_listing_id=listing['legacy_id'], applicant_id=applicant_id).exists()

    def create_application(self, listing, applicant, payload):
        application = JobApplication.objects.create(
            job_listing_id=listing['legacy_id'],
            applicant=applicant,
            cv_file=payload['cv_file'],
            cover_note=payload.get('cover_note', ''),
        )
        return _serialize_orm_application(application)


class MongoJobRepository:
    def __init__(self, listings_collection_name, applications_collection_name):
        self.listings_collection = get_mongo_collection(listings_collection_name)
        self.applications_collection = get_mongo_collection(applications_collection_name)
        self._ensure_indexes()

    def _ensure_indexes(self):
        self.listings_collection.create_index('legacy_id', unique=True, sparse=True)
        self.listings_collection.create_index([('status', 1), ('created_at', -1)])
        self.listings_collection.create_index('owner_legacy_id')
        self.listings_collection.create_index('category_tags')
        self.applications_collection.create_index('legacy_id', unique=True, sparse=True)
        self.applications_collection.create_index([('job_listing_id', 1), ('applicant_legacy_id', 1)], unique=True)
        self.applications_collection.create_index('job_listing_legacy_id')
        self.applications_collection.create_index('created_at')

    def _application_counts(self, listing_ids):
        if not listing_ids:
            return {}

        pipeline = [
            {'$match': {'job_listing_id': {'$in': listing_ids}}},
            {'$group': {'_id': '$job_listing_id', 'count': {'$sum': 1}}},
        ]
        return {
            document['_id']: document['count']
            for document in self.applications_collection.aggregate(pipeline)
        }

    def list_published(self, search='', tag=''):
        query = {'status': JobListing.Status.PUBLISHED}

        if search:
            query['$or'] = [
                {'job_name': {'$regex': re.escape(search), '$options': 'i'}},
                {'job_position': {'$regex': re.escape(search), '$options': 'i'}},
                {'job_description': {'$regex': re.escape(search), '$options': 'i'}},
                {'company_name': {'$regex': re.escape(search), '$options': 'i'}},
            ]

        if tag:
            query['category_tags'] = {'$regex': f'^{re.escape(tag)}$', '$options': 'i'}

        documents = list(self.listings_collection.find(query).sort('created_at', -1))
        counts = self._application_counts([str(document['_id']) for document in documents])
        return [
            _serialize_listing_document(document, counts.get(str(document['_id']), 0))
            for document in documents
        ]

    def get_listing(self, pk):
        document = None

        try:
            document = self.listings_collection.find_one({'_id': ObjectId(str(pk))})
        except Exception:
            document = None

        if document is None and str(pk).isdigit():
            document = self.listings_collection.find_one({'legacy_id': int(pk)})

        if document is None:
            return None

        applications_count = self.applications_collection.count_documents({'job_listing_id': str(document['_id'])})
        return _serialize_listing_document(document, applications_count)

    def create_listing(self, owner, payload):
        now = timezone.now()
        document = {
            'owner_legacy_id': owner.id,
            'owner_email': owner.email,
            'owner_name': owner.full_name,
            'company_name': owner.current_company or owner.full_name,
            'job_name': payload['job_name'],
            'job_position': payload['job_position'],
            'job_description': payload.get('job_description', ''),
            'category_tags': payload['category_tags'],
            'status': JobListing.Status.PUBLISHED,
            'created_at': now,
            'updated_at': now,
        }
        result = self.listings_collection.insert_one(document)
        document['_id'] = result.inserted_id
        return _serialize_listing_document(document, 0)

    def application_exists(self, listing, applicant_id):
        return self.applications_collection.find_one(
            {'job_listing_id': str(listing['id']), 'applicant_legacy_id': applicant_id},
            {'_id': 1},
        ) is not None

    def create_application(self, listing, applicant, payload):
        saved_path = default_storage.save(f"job_applications/cvs/{payload['cv_file'].name}", payload['cv_file'])
        document = {
            'job_listing_id': str(listing['id']),
            'job_listing_legacy_id': listing.get('legacy_id'),
            'applicant_legacy_id': applicant.id,
            'applicant_email': applicant.email,
            'applicant_name': applicant.full_name,
            'cv_file_path': saved_path,
            'cv_file_url': _safe_storage_url(saved_path),
            'cover_note': payload.get('cover_note', ''),
            'created_at': timezone.now(),
        }
        result = self.applications_collection.insert_one(document)
        document['_id'] = result.inserted_id
        return _serialize_application_document(document)


def get_job_repository():
    if settings.MONGODB_ENABLED:
        return MongoJobRepository(
            settings.MONGODB_JOB_LISTINGS_COLLECTION,
            settings.MONGODB_JOB_APPLICATIONS_COLLECTION,
        )

    return DjangoOrmJobRepository()