import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hsu_alumni.settings.local')

import django

django.setup()

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files.storage import default_storage
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient

from coop.models import CoopListing
from db.mongodb import get_mongo_collection
from engagement.models import Notification
from jobs.models import JobApplication, JobListing
from tags.models import Tag

User = get_user_model()


def ensure_user(email, full_name, current_company='', job_seeking_status=False):
    user, _ = User.objects.get_or_create(
        email=email,
        defaults={
            'full_name': full_name,
            'account_status': 'ACTIVE',
            'current_company': current_company,
            'job_seeking_status': job_seeking_status,
            'role': 'ALUMNI',
        },
    )
    user.full_name = full_name
    user.account_status = 'ACTIVE'
    user.current_company = current_company
    user.job_seeking_status = job_seeking_status
    user.set_password('Password123')
    user.save()
    return user


def cleanup_smoke_data():
    Notification.objects.filter(title__icontains='Smoke').delete()
    CoopListing.objects.filter(name='Smoke Coop Listing').delete()
    orm_applications = JobApplication.objects.filter(job_listing__job_name='Smoke Backend Developer')
    for path in orm_applications.values_list('cv_file', flat=True):
        if path and '/cv_' in f'/{path}':
            default_storage.delete(path)
    orm_applications.delete()
    JobListing.objects.filter(job_name='Smoke Backend Developer').delete()

    if settings.MONGODB_ENABLED:
        coop_collection = get_mongo_collection(settings.MONGODB_COOP_COLLECTION, require_enabled=False)
        job_collection = get_mongo_collection(settings.MONGODB_JOB_LISTINGS_COLLECTION, require_enabled=False)
        applications_collection = get_mongo_collection(settings.MONGODB_JOB_APPLICATIONS_COLLECTION, require_enabled=False)

        smoke_jobs = list(job_collection.find({'job_name': 'Smoke Backend Developer'}, {'_id': 1}))
        smoke_job_ids = [str(document['_id']) for document in smoke_jobs]
        if smoke_job_ids:
            for document in applications_collection.find({'job_listing_id': {'$in': smoke_job_ids}}, {'cv_file_path': 1}):
                path = document.get('cv_file_path', '')
                if path and '/cv_' in f'/{path}':
                    default_storage.delete(path)
            applications_collection.delete_many({'job_listing_id': {'$in': smoke_job_ids}})

        job_collection.delete_many({'job_name': 'Smoke Backend Developer'})
        coop_collection.delete_many({'name': 'Smoke Coop Listing'})


def main():
    cleanup_smoke_data()

    owner = ensure_user('owner@example.com', 'Owner Alumni', current_company='Owner Co')
    applicant = ensure_user(
        'applicant@example.com',
        'Applicant Alumni',
        current_company='Applicant Co',
        job_seeking_status=True,
    )

    Tag.objects.get_or_create(name='Technology')

    owner_client = APIClient()
    owner_client.force_authenticate(user=owner)
    coop_response = owner_client.post(
        '/api/coop/listings',
        {
            'name': 'Smoke Coop Listing',
            'description': 'Smoke test coop listing',
            'image_url': '',
            'category_tags': ['Technology'],
        },
        format='json',
    )
    job_response = owner_client.post(
        '/api/jobs/listings',
        {
            'job_name': 'Smoke Backend Developer',
            'job_position': 'Python Engineer',
            'employment_type': 'Full-time',
            'work_location': 'Ho Chi Minh City',
            'job_description': 'Smoke test job listing',
            'category_tags': ['Technology'],
        },
        format='json',
    )

    applicant_client = APIClient()
    applicant_client.force_authenticate(user=applicant)
    cv_file = SimpleUploadedFile('cv.pdf', b'%PDF-1.4 smoke test', content_type='application/pdf')
    apply_response = applicant_client.post(
        f"/api/jobs/listings/{job_response.data['id']}/apply",
        {
            'cv_file': cv_file,
            'cover_note': 'Interested in the opportunity.',
        },
        format='multipart',
    )

    public_client = APIClient()
    coop_list_response = public_client.get('/api/coop/listings', {'search': 'Smoke'})
    job_list_response = public_client.get('/api/jobs/listings', {'tag': 'Technology'})
    applications_response = owner_client.get(f"/api/jobs/listings/{job_response.data['id']}/applications")

    print(
        {
            'coop_create': coop_response.status_code,
            'job_create': job_response.status_code,
            'job_apply': apply_response.status_code,
            'job_applications': applications_response.status_code,
            'job_applications_items': len(applications_response.data),
            'coop_list_items': len(coop_list_response.data),
            'job_list_items': len(job_list_response.data),
        }
    )

    cleanup_smoke_data()


if __name__ == '__main__':
    main()
