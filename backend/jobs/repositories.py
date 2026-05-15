import re

from bson import ObjectId
from django.conf import settings
from django.core.files.storage import default_storage
from django.db import IntegrityError
from django.db.models import Q
from django.utils import timezone

from db.mongodb import get_mongo_collection

from .models import JobApplication, JobListing


def _normalize_tag_list(value):
    raw_items = value.split(',') if isinstance(value, str) else value or []
    normalized = []
    for item in raw_items:
        if isinstance(item, dict):
            item = item.get('name') or item.get('slug') or item.get('label') or ''
        text = str(item).strip()
        if text and text not in normalized:
            normalized.append(text)
    return normalized


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
        'employment_type': listing.employment_type,
        'work_location': listing.work_location,
        'job_description': listing.job_description,
        'category_tags': _normalize_tag_list(listing.category_tags),
        'status': listing.status,
        'application_deadline': listing.application_deadline,
        'views_count': listing.views_count,
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
        'employment_type': document.get('employment_type', ''),
        'work_location': document.get('work_location', ''),
        'job_description': document.get('job_description', ''),
        'category_tags': _normalize_tag_list(document.get('category_tags', [])),
        'status': document.get('status', JobListing.Status.PUBLISHED),
        'application_deadline': document.get('application_deadline'),
        'views_count': document.get('views_count', 0),
        'applications_count': applications_count,
        'created_at': document.get('created_at'),
        'updated_at': document.get('updated_at'),
    }


def _serialize_orm_application(application):
    return {
        'id': application.id,
        'job_listing': application.job_listing_id,
        'applicant': application.applicant_id,
        'applicant_name': application.applicant.full_name,
        'applicant_email': application.applicant.email,
        'cv_file': application.cv_file.url if application.cv_file else '',
        'portfolio_url': application.portfolio_url,
        'cover_note': application.cover_note,
        'status': application.status,
        'timeline': _build_application_timeline(application.status, application.created_at, application.updated_at),
        'created_at': application.created_at,
        'updated_at': application.updated_at,
    }


def _serialize_application_document(document):
    return {
        'id': str(document.get('_id', document.get('id'))),
        'job_listing': document.get('job_listing_id', document.get('job_listing_legacy_id')),
        'applicant': document.get('applicant_legacy_id', document.get('applicant')),
        'applicant_name': document.get('applicant_name', ''),
        'applicant_email': document.get('applicant_email', ''),
        'cv_file': document.get('cv_file_url', document.get('cv_file_path', '')),
        'portfolio_url': document.get('portfolio_url', ''),
        'cover_note': document.get('cover_note', ''),
        'status': document.get('status', JobApplication.Status.PENDING),
        'timeline': _build_application_timeline(
            document.get('status', JobApplication.Status.PENDING),
            document.get('created_at'),
            document.get('updated_at', document.get('created_at')),
        ),
        'created_at': document.get('created_at'),
        'updated_at': document.get('updated_at', document.get('created_at')),
    }


def _build_application_timeline(application_status, created_at, updated_at=None):
    steps = [
        {'label': 'Đã gửi hồ sơ', 'status': 'DONE', 'date': created_at},
        {'label': 'Đang xem xét', 'status': 'CURRENT', 'date': None},
        {'label': 'Phỏng vấn', 'status': 'PENDING', 'date': None},
        {'label': 'Kết quả', 'status': 'PENDING', 'date': None},
    ]

    if application_status == JobApplication.Status.INTERVIEW:
        steps[1]['status'] = 'DONE'
        steps[2]['status'] = 'CURRENT'
        steps[2]['date'] = updated_at
    elif application_status in {JobApplication.Status.ACCEPTED, JobApplication.Status.REJECTED}:
        steps[1]['status'] = 'DONE'
        steps[2]['status'] = 'DONE'
        steps[3]['status'] = application_status
        steps[3]['date'] = updated_at
    elif application_status == JobApplication.Status.WITHDRAWN:
        steps.append({'label': 'Đã rút hồ sơ', 'status': 'WITHDRAWN', 'date': updated_at})

    return steps


class DjangoOrmJobRepository:
    def list_published(self, search='', tag=''):
        queryset = JobListing.objects.filter(status=JobListing.Status.PUBLISHED).select_related('owner')

        if search:
            queryset = queryset.filter(
                Q(job_name__icontains=search)
                | Q(job_position__icontains=search)
                | Q(employment_type__icontains=search)
                | Q(work_location__icontains=search)
                | Q(job_description__icontains=search)
                | Q(company_name__icontains=search)
            )

        if tag:
            listing_ids = [
                listing.id
                for listing in queryset
                if any(item.lower() == tag for item in _normalize_tag_list(listing.category_tags))
            ]
            queryset = queryset.filter(id__in=listing_ids)

        return [_serialize_orm_listing(listing) for listing in queryset]

    def get_listing(self, pk):
        try:
            listing = JobListing.objects.select_related('owner').get(pk=int(pk))
        except (JobListing.DoesNotExist, TypeError, ValueError):
            return None

        return _serialize_orm_listing(listing)

    def list_owner_listings(self, owner_id, search='', status_filter='', type_filter=''):
        if type_filter and type_filter != 'job':
            return []

        queryset = JobListing.objects.filter(owner_id=owner_id).select_related('owner')

        if search:
            queryset = queryset.filter(
                Q(job_name__icontains=search)
                | Q(job_position__icontains=search)
                | Q(company_name__icontains=search)
            )

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return [_serialize_orm_listing(listing) | {'type': 'job'} for listing in queryset]

    def create_listing(self, owner, payload):
        listing = JobListing.objects.create(
            owner=owner,
            company_name=owner.current_company or owner.full_name,
            **payload,
        )
        return _serialize_orm_listing(JobListing.objects.select_related('owner').get(pk=listing.pk))

    def application_exists(self, listing, applicant_id):
        return JobApplication.objects.filter(job_listing_id=listing['legacy_id'], applicant_id=applicant_id).exists()

    def get_application_for_user(self, listing, applicant_id):
        application = (
            JobApplication.objects.filter(job_listing_id=listing['legacy_id'], applicant_id=applicant_id)
            .select_related('applicant')
            .first()
        )
        return _serialize_orm_application(application) if application else None

    def list_applications(self, listing, owner_id):
        if str(listing['owner']) != str(owner_id):
            return None

        applications = (
            JobApplication.objects.filter(job_listing_id=listing['legacy_id'])
            .select_related('applicant')
            .order_by('-created_at')
        )
        return [_serialize_orm_application(application) for application in applications]

    def create_application(self, listing, applicant, payload):
        try:
            application = JobApplication.objects.create(
                job_listing_id=listing['legacy_id'],
                applicant=applicant,
                cv_file=payload['cv_file'],
                portfolio_url=payload.get('portfolio_url', ''),
                cover_note=payload.get('cover_note', ''),
            )
        except IntegrityError:
            return self.get_application_for_user(listing, applicant.id)
        return _serialize_orm_application(application)

    def list_applicant_applications(self, applicant_id, search='', status_filter=''):
        queryset = (
            JobApplication.objects.filter(applicant_id=applicant_id)
            .select_related('job_listing', 'job_listing__owner', 'applicant')
            .order_by('-created_at')
        )
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if search:
            queryset = queryset.filter(
                Q(job_listing__job_name__icontains=search)
                | Q(job_listing__job_position__icontains=search)
                | Q(job_listing__company_name__icontains=search)
            )
        return [
            _serialize_orm_application(application)
            | {
                'listing': _serialize_orm_listing(application.job_listing),
                'company_name': application.job_listing.company_name,
                'job_name': application.job_listing.job_name,
                'job_position': application.job_listing.job_position,
                'employment_type': application.job_listing.employment_type,
            }
            for application in queryset
        ]

    def withdraw_application(self, application_id, applicant_id):
        application = JobApplication.objects.filter(pk=application_id, applicant_id=applicant_id).first()
        if application is None:
            return None
        if application.status in {JobApplication.Status.PENDING, JobApplication.Status.INTERVIEW}:
            application.status = JobApplication.Status.WITHDRAWN
            application.save(update_fields=['status', 'updated_at'])
        return _serialize_orm_application(application)

    def update_listing(self, listing, owner_id, payload):
        if str(listing['owner']) != str(owner_id):
            return None
        try:
            model = JobListing.objects.get(pk=listing['legacy_id'], owner_id=owner_id)
        except JobListing.DoesNotExist:
            return None
        for field in [
            'job_name',
            'job_position',
            'employment_type',
            'work_location',
            'job_description',
            'category_tags',
            'application_deadline',
            'status',
        ]:
            if field in payload:
                setattr(model, field, payload[field])
        model.save()
        return _serialize_orm_listing(JobListing.objects.select_related('owner').get(pk=model.pk))

    def close_listing(self, listing, owner_id):
        return self.update_listing(listing, owner_id, {'status': JobListing.Status.CLOSED})

    def delete_listing(self, listing, owner_id):
        if str(listing['owner']) != str(owner_id):
            return False
        JobListing.objects.filter(pk=listing['legacy_id'], owner_id=owner_id).delete()
        return True

    def duplicate_listing(self, listing, owner):
        payload = {
            'job_name': f"{listing['job_name']} (Copy)",
            'job_position': listing.get('job_position', ''),
            'employment_type': listing.get('employment_type', ''),
            'work_location': listing.get('work_location', ''),
            'job_description': listing.get('job_description', ''),
            'category_tags': listing.get('category_tags', []),
            'application_deadline': listing.get('application_deadline'),
        }
        created = self.create_listing(owner, payload)
        return self.update_listing(created, owner.id, {'status': JobListing.Status.DRAFT})


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
                {'employment_type': {'$regex': re.escape(search), '$options': 'i'}},
                {'work_location': {'$regex': re.escape(search), '$options': 'i'}},
                {'job_description': {'$regex': re.escape(search), '$options': 'i'}},
                {'company_name': {'$regex': re.escape(search), '$options': 'i'}},
            ]

        if tag:
            escaped_tag = re.escape(tag)
            query['category_tags'] = {'$regex': f'(^|,\\s*){escaped_tag}(\\s*,|$)', '$options': 'i'}

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
            'employment_type': payload.get('employment_type', ''),
            'work_location': payload.get('work_location', ''),
            'job_description': payload.get('job_description', ''),
            'category_tags': payload['category_tags'],
            'application_deadline': payload.get('application_deadline'),
            'views_count': 0,
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

    def get_application_for_user(self, listing, applicant_id):
        document = self.applications_collection.find_one(
            {'job_listing_id': str(listing['id']), 'applicant_legacy_id': applicant_id}
        )
        return _serialize_application_document(document) if document else None

    def list_applications(self, listing, owner_id):
        if str(listing['owner']) != str(owner_id):
            return None

        documents = self.applications_collection.find({'job_listing_id': str(listing['id'])}).sort('created_at', -1)
        return [_serialize_application_document(document) for document in documents]

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
            'portfolio_url': payload.get('portfolio_url', ''),
            'cover_note': payload.get('cover_note', ''),
            'status': JobApplication.Status.PENDING,
            'created_at': timezone.now(),
            'updated_at': timezone.now(),
        }
        try:
            result = self.applications_collection.insert_one(document)
        except Exception:
            existing = self.get_application_for_user(listing, applicant.id)
            if existing is not None:
                return existing
            raise
        document['_id'] = result.inserted_id
        return _serialize_application_document(document)

    def list_owner_listings(self, owner_id, search='', status_filter='', type_filter=''):
        if type_filter and type_filter != 'job':
            return []

        query = {'owner_legacy_id': owner_id}
        if status_filter:
            query['status'] = status_filter
        if search:
            query['$or'] = [
                {'job_name': {'$regex': re.escape(search), '$options': 'i'}},
                {'job_position': {'$regex': re.escape(search), '$options': 'i'}},
                {'company_name': {'$regex': re.escape(search), '$options': 'i'}},
            ]
        documents = list(self.listings_collection.find(query).sort('created_at', -1))
        counts = self._application_counts([str(document['_id']) for document in documents])
        return [
            _serialize_listing_document(document, counts.get(str(document['_id']), 0)) | {'type': 'job'}
            for document in documents
        ]

    def list_applicant_applications(self, applicant_id, search='', status_filter=''):
        query = {'applicant_legacy_id': applicant_id}
        if status_filter:
            query['status'] = status_filter
        documents = list(self.applications_collection.find(query).sort('created_at', -1))
        listing_ids = [document.get('job_listing_id') for document in documents if document.get('job_listing_id')]
        listings = {
            str(document['_id']): _serialize_listing_document(document, 0)
            for document in self.listings_collection.find({'_id': {'$in': [ObjectId(item) for item in listing_ids if ObjectId.is_valid(item)]}})
        }
        results = []
        for document in documents:
            listing = listings.get(str(document.get('job_listing_id')), {})
            if search and search.lower() not in ' '.join(
                [
                    listing.get('job_name', ''),
                    listing.get('job_position', ''),
                    listing.get('company_name', ''),
                ]
            ).lower():
                continue
            results.append(
                _serialize_application_document(document)
                | {
                    'listing': listing,
                    'company_name': listing.get('company_name', ''),
                    'job_name': listing.get('job_name', ''),
                    'job_position': listing.get('job_position', ''),
                    'employment_type': listing.get('employment_type', ''),
                }
            )
        return results

    def withdraw_application(self, application_id, applicant_id):
        query = {'applicant_legacy_id': applicant_id}
        try:
            query['_id'] = ObjectId(str(application_id))
        except Exception:
            return None
        document = self.applications_collection.find_one(query)
        if document is None:
            return None
        if document.get('status', JobApplication.Status.PENDING) in {
            JobApplication.Status.PENDING,
            JobApplication.Status.INTERVIEW,
        }:
            document['status'] = JobApplication.Status.WITHDRAWN
            document['updated_at'] = timezone.now()
            self.applications_collection.update_one(
                {'_id': document['_id']},
                {'$set': {'status': document['status'], 'updated_at': document['updated_at']}},
            )
        return _serialize_application_document(document)

    def update_listing(self, listing, owner_id, payload):
        if str(listing['owner']) != str(owner_id):
            return None
        updates = {
            field: payload[field]
            for field in [
                'job_name',
                'job_position',
                'employment_type',
                'work_location',
                'job_description',
                'category_tags',
                'application_deadline',
                'status',
            ]
            if field in payload
        }
        updates['updated_at'] = timezone.now()
        self.listings_collection.update_one({'_id': ObjectId(str(listing['id']))}, {'$set': updates})
        return self.get_listing(listing['id'])

    def close_listing(self, listing, owner_id):
        return self.update_listing(listing, owner_id, {'status': JobListing.Status.CLOSED})

    def delete_listing(self, listing, owner_id):
        if str(listing['owner']) != str(owner_id):
            return False
        self.listings_collection.delete_one({'_id': ObjectId(str(listing['id']))})
        self.applications_collection.delete_many({'job_listing_id': str(listing['id'])})
        return True

    def duplicate_listing(self, listing, owner):
        now = timezone.now()
        document = {
            'owner_legacy_id': owner.id,
            'owner_email': owner.email,
            'owner_name': owner.full_name,
            'company_name': listing.get('company_name') or owner.current_company or owner.full_name,
            'job_name': f"{listing['job_name']} (Copy)",
            'job_position': listing.get('job_position', ''),
            'employment_type': listing.get('employment_type', ''),
            'work_location': listing.get('work_location', ''),
            'job_description': listing.get('job_description', ''),
            'category_tags': listing.get('category_tags', []),
            'application_deadline': listing.get('application_deadline'),
            'views_count': 0,
            'status': JobListing.Status.DRAFT,
            'created_at': now,
            'updated_at': now,
        }
        result = self.listings_collection.insert_one(document)
        document['_id'] = result.inserted_id
        return _serialize_listing_document(document, 0)


def get_job_repository():
    if settings.MONGODB_ENABLED:
        return MongoJobRepository(
            settings.MONGODB_JOB_LISTINGS_COLLECTION,
            settings.MONGODB_JOB_APPLICATIONS_COLLECTION,
        )

    return DjangoOrmJobRepository()
