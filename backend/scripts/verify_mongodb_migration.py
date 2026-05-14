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
from django.contrib.auth import get_user_model

from coop.models import CoopListing
from db.mongodb import get_mongo_collection
from jobs.models import JobApplication, JobListing
from tags.models import Tag

User = get_user_model()


def _verify_collection(label, queryset, collection_name):
    source_ids = list(queryset.values_list('id', flat=True).order_by('id'))
    collection = get_mongo_collection(collection_name, require_enabled=False)
    mongo_total_count = collection.count_documents({})

    if source_ids:
        mongo_legacy_ids = set(
            collection.find(
                {'legacy_id': {'$in': source_ids}},
                {'legacy_id': 1},
            ).distinct('legacy_id')
        )
    else:
        mongo_legacy_ids = set()

    missing_legacy_ids = [source_id for source_id in source_ids if source_id not in mongo_legacy_ids]

    return {
        'module': label,
        'collection': collection_name,
        'source_count': len(source_ids),
        'mongo_total_count': mongo_total_count,
        'mongo_legacy_count': len(mongo_legacy_ids),
        'missing_legacy_ids': missing_legacy_ids[:10],
        'status': 'ok' if len(mongo_legacy_ids) == len(source_ids) else 'mismatch',
    }


def main():
    results = [
        _verify_collection('users', User.objects.all(), settings.MONGODB_USERS_COLLECTION),
        _verify_collection('tags', Tag.objects.all(), settings.MONGODB_TAGS_COLLECTION),
        _verify_collection('coop', CoopListing.objects.all(), settings.MONGODB_COOP_COLLECTION),
        _verify_collection('job_listings', JobListing.objects.all(), settings.MONGODB_JOB_LISTINGS_COLLECTION),
        _verify_collection('job_applications', JobApplication.objects.all(), settings.MONGODB_JOB_APPLICATIONS_COLLECTION),
    ]

    print(json.dumps({'results': results}, indent=2))


if __name__ == '__main__':
    main()