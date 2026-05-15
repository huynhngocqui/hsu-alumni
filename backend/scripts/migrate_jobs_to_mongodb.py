import argparse
import json
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hsu_alumni.settings.local')

import django

django.setup()

from django.conf import settings

from db.mongodb import get_mongo_collection
from jobs.models import JobApplication, JobListing


def parse_args():
    parser = argparse.ArgumentParser(description='Migrate Django jobs data into MongoDB.')
    parser.add_argument('--dry-run', action='store_true', help='Preview the migration payload without writing to MongoDB.')
    parser.add_argument('--limit', type=int, default=0, help='Limit the number of job listings processed for testing.')
    return parser.parse_args()


def load_job_listings(limit=0):
    queryset = JobListing.objects.select_related('owner').all().order_by('id')

    if limit:
        queryset = queryset[:limit]

    return list(queryset)


def load_job_applications(job_listing_ids=None):
    queryset = JobApplication.objects.select_related('job_listing', 'applicant').all().order_by('id')

    if job_listing_ids is not None:
        queryset = queryset.filter(job_listing_id__in=job_listing_ids)

    return list(queryset)


def build_listing_document(listing):
    return {
        'legacy_id': listing.id,
        'owner_legacy_id': listing.owner_id,
        'owner_email': listing.owner.email,
        'owner_name': listing.owner.full_name,
        'company_name': listing.company_name,
        'job_name': listing.job_name,
        'job_position': listing.job_position,
        'employment_type': listing.employment_type,
        'work_location': listing.work_location,
        'job_description': listing.job_description,
        'category_tags': listing.category_tags,
        'status': listing.status,
        'created_at': listing.created_at,
        'updated_at': listing.updated_at,
        'migration_source': 'django.jobs.listings',
    }


def build_application_document(application, job_listing_object_id):
    return {
        'legacy_id': application.id,
        'job_listing_id': job_listing_object_id,
        'job_listing_legacy_id': application.job_listing_id,
        'applicant_legacy_id': application.applicant_id,
        'applicant_email': application.applicant.email,
        'applicant_name': application.applicant.full_name,
        'cv_file_path': application.cv_file.name,
        'cv_file_url': application.cv_file.url if application.cv_file else '',
        'cover_note': application.cover_note,
        'created_at': application.created_at,
        'migration_source': 'django.jobs.applications',
    }


def ensure_indexes(listings_collection, applications_collection):
    listings_collection.create_index('legacy_id', unique=True, sparse=True)
    listings_collection.create_index([('status', 1), ('created_at', -1)])
    listings_collection.create_index('owner_legacy_id')
    listings_collection.create_index('category_tags')
    applications_collection.create_index('legacy_id', unique=True, sparse=True)
    applications_collection.create_index([('job_listing_id', 1), ('applicant_legacy_id', 1)], unique=True)
    applications_collection.create_index('job_listing_legacy_id')
    applications_collection.create_index('created_at')


def migrate_jobs(job_listings, job_applications):
    listings_collection = get_mongo_collection(settings.MONGODB_JOB_LISTINGS_COLLECTION, require_enabled=False)
    applications_collection = get_mongo_collection(settings.MONGODB_JOB_APPLICATIONS_COLLECTION, require_enabled=False)
    ensure_indexes(listings_collection, applications_collection)

    listings_inserted = 0
    listings_updated = 0

    for listing in job_listings:
        result = listings_collection.update_one(
            {'legacy_id': listing.id},
            {'$set': build_listing_document(listing)},
            upsert=True,
        )

        if result.upserted_id is not None:
            listings_inserted += 1
        elif result.modified_count > 0:
            listings_updated += 1

    listing_map = {
        document['legacy_id']: str(document['_id'])
        for document in listings_collection.find(
            {'legacy_id': {'$in': [listing.id for listing in job_listings]}},
            {'legacy_id': 1},
        )
    }

    applications_inserted = 0
    applications_updated = 0

    for application in job_applications:
        job_listing_object_id = listing_map.get(application.job_listing_id)

        if not job_listing_object_id:
            continue

        result = applications_collection.update_one(
            {'legacy_id': application.id},
            {'$set': build_application_document(application, job_listing_object_id)},
            upsert=True,
        )

        if result.upserted_id is not None:
            applications_inserted += 1
        elif result.modified_count > 0:
            applications_updated += 1

    return {
        'listings_collection': settings.MONGODB_JOB_LISTINGS_COLLECTION,
        'applications_collection': settings.MONGODB_JOB_APPLICATIONS_COLLECTION,
        'source_listings_count': len(job_listings),
        'source_applications_count': len(job_applications),
        'listings_inserted': listings_inserted,
        'listings_updated': listings_updated,
        'listings_unchanged': len(job_listings) - listings_inserted - listings_updated,
        'applications_inserted': applications_inserted,
        'applications_updated': applications_updated,
        'applications_unchanged': len(job_applications) - applications_inserted - applications_updated,
        'target_listings_count_for_legacy_ids': listings_collection.count_documents({'legacy_id': {'$in': [listing.id for listing in job_listings]}}),
        'target_applications_count_for_legacy_ids': applications_collection.count_documents({'legacy_id': {'$in': [application.id for application in job_applications]}}),
    }


def main():
    args = parse_args()
    job_listings = load_job_listings(limit=args.limit)
    job_applications = load_job_applications([listing.id for listing in job_listings])

    if args.dry_run:
        print(
            json.dumps(
                {
                    'mode': 'dry-run',
                    'listings_collection': settings.MONGODB_JOB_LISTINGS_COLLECTION,
                    'applications_collection': settings.MONGODB_JOB_APPLICATIONS_COLLECTION,
                    'source_listings_count': len(job_listings),
                    'source_applications_count': len(job_applications),
                    'listings_preview': [build_listing_document(listing) for listing in job_listings[:3]],
                    'applications_preview': [
                        build_application_document(application, f'legacy:{application.job_listing_id}')
                        for application in job_applications[:3]
                    ],
                },
                default=str,
                indent=2,
            )
        )
        return

    result = migrate_jobs(job_listings, job_applications)
    print(json.dumps(result, default=str, indent=2))


if __name__ == '__main__':
    main()
