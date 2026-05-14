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
from coop.models import CoopListing


def parse_args():
    parser = argparse.ArgumentParser(description='Migrate Django coop listings into MongoDB.')
    parser.add_argument('--dry-run', action='store_true', help='Preview the migration payload without writing to MongoDB.')
    parser.add_argument('--limit', type=int, default=0, help='Limit the number of coop listings processed for testing.')
    return parser.parse_args()


def build_document(listing):
    return {
        'legacy_id': listing.id,
        'owner_legacy_id': listing.owner_id,
        'owner_email': listing.owner.email,
        'owner_name': listing.owner.full_name,
        'business_name': listing.business_name,
        'name': listing.name,
        'description': listing.description,
        'image_url': listing.image_url,
        'category_tags': listing.category_tags,
        'status': listing.status,
        'created_at': listing.created_at,
        'updated_at': listing.updated_at,
        'migration_source': 'django.coop',
    }


def load_source_listings(limit=0):
    queryset = CoopListing.objects.select_related('owner').all().order_by('id')

    if limit:
        queryset = queryset[:limit]

    return list(queryset)


def ensure_indexes(collection):
    collection.create_index('legacy_id', unique=True, sparse=True)
    collection.create_index([('status', 1), ('created_at', -1)])
    collection.create_index('owner_legacy_id')
    collection.create_index('category_tags')


def migrate_listings(listings):
    collection = get_mongo_collection(settings.MONGODB_COOP_COLLECTION, require_enabled=False)
    ensure_indexes(collection)

    inserted = 0
    updated = 0

    for listing in listings:
        document = build_document(listing)
        result = collection.update_one(
            {'legacy_id': listing.id},
            {'$set': document},
            upsert=True,
        )

        if result.upserted_id is not None:
            inserted += 1
        elif result.modified_count > 0:
            updated += 1

    target_count = collection.count_documents({'legacy_id': {'$in': [listing.id for listing in listings]}})
    return {
        'collection': settings.MONGODB_COOP_COLLECTION,
        'source_count': len(listings),
        'inserted': inserted,
        'updated': updated,
        'unchanged': len(listings) - inserted - updated,
        'target_count_for_legacy_ids': target_count,
    }


def main():
    args = parse_args()
    listings = load_source_listings(limit=args.limit)
    preview = [build_document(listing) for listing in listings[:3]]

    if args.dry_run:
        print(
            json.dumps(
                {
                    'mode': 'dry-run',
                    'collection': settings.MONGODB_COOP_COLLECTION,
                    'source_count': len(listings),
                    'preview': preview,
                },
                default=str,
                indent=2,
            )
        )
        return

    result = migrate_listings(listings)
    print(json.dumps(result, default=str, indent=2))


if __name__ == '__main__':
    main()