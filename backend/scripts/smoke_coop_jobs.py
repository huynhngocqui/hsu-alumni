import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hsu_alumni.settings.local')

import django

django.setup()

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient

from coop.models import CoopListing
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


def main():
    CoopListing.objects.filter(name='Smoke Coop Listing').delete()
    JobApplication.objects.all().delete()
    JobListing.objects.filter(job_name='Smoke Backend Developer').delete()

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

    print(
        {
            'coop_create': coop_response.status_code,
            'job_create': job_response.status_code,
            'job_apply': apply_response.status_code,
            'coop_list_items': len(coop_list_response.data),
            'job_list_items': len(job_list_response.data),
        }
    )


if __name__ == '__main__':
    main()
