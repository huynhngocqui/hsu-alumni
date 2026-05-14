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
from django.contrib.auth import get_user_model

from db.mongodb import get_mongo_collection
from users.repositories import build_user_document, ensure_user_indexes

User = get_user_model()


def parse_args():
    parser = argparse.ArgumentParser(description='Migrate Django users profile data into MongoDB.')
    parser.add_argument('--dry-run', action='store_true', help='Preview the migration payload without writing to MongoDB.')
    parser.add_argument('--limit', type=int, default=0, help='Limit the number of users processed for testing.')
    return parser.parse_args()


def load_users(limit=0):
    queryset = User.objects.all().order_by('id')

    if limit:
        queryset = queryset[:limit]

    return list(queryset)


def build_document(user):
    document = build_user_document(user)
    document['migration_source'] = 'django.users'
    return document


def ensure_indexes(collection):
    ensure_user_indexes(collection)


def migrate_users(users):
    collection = get_mongo_collection(settings.MONGODB_USERS_COLLECTION, require_enabled=False)
    ensure_indexes(collection)

    inserted = 0
    updated = 0

    for user in users:
        result = collection.update_one(
            {'legacy_id': user.id},
            {'$set': build_document(user)},
            upsert=True,
        )

        if result.upserted_id is not None:
            inserted += 1
        elif result.modified_count > 0:
            updated += 1

    return {
        'collection': settings.MONGODB_USERS_COLLECTION,
        'source_count': len(users),
        'inserted': inserted,
        'updated': updated,
        'unchanged': len(users) - inserted - updated,
        'target_count_for_legacy_ids': collection.count_documents({'legacy_id': {'$in': [user.id for user in users]}}),
    }


def main():
    args = parse_args()
    users = load_users(limit=args.limit)

    if args.dry_run:
        print(
            json.dumps(
                {
                    'mode': 'dry-run',
                    'collection': settings.MONGODB_USERS_COLLECTION,
                    'source_count': len(users),
                    'preview': [build_document(user) for user in users[:3]],
                },
                default=str,
                indent=2,
            )
        )
        return

    result = migrate_users(users)
    print(json.dumps(result, default=str, indent=2))


if __name__ == '__main__':
    main()