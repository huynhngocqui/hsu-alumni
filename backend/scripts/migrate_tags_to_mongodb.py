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
from tags.models import Tag


def parse_args():
    parser = argparse.ArgumentParser(description='Migrate Django tags into MongoDB.')
    parser.add_argument('--dry-run', action='store_true', help='Preview the migration payload without writing to MongoDB.')
    parser.add_argument('--limit', type=int, default=0, help='Limit the number of tags processed for testing.')
    return parser.parse_args()


def build_document(tag):
    return {
        'legacy_id': tag.id,
        'name': tag.name,
        'slug': tag.slug,
        'created_at': tag.created_at,
        'updated_at': tag.updated_at,
        'migration_source': 'django.tags',
    }


def load_source_tags(limit=0):
    queryset = Tag.objects.all().order_by('id')

    if limit:
        queryset = queryset[:limit]

    return list(queryset)


def ensure_indexes(collection):
    collection.create_index('slug', unique=True)
    collection.create_index('legacy_id', unique=True, sparse=True)
    collection.create_index('name', unique=True)


def migrate_tags(tags):
    collection = get_mongo_collection(settings.MONGODB_TAGS_COLLECTION, require_enabled=False)
    ensure_indexes(collection)

    inserted = 0
    updated = 0

    for tag in tags:
        document = build_document(tag)
        result = collection.update_one(
            {'slug': tag.slug},
            {'$set': document},
            upsert=True,
        )

        if result.upserted_id is not None:
            inserted += 1
        elif result.modified_count > 0:
            updated += 1

    target_count = collection.count_documents({'legacy_id': {'$in': [tag.id for tag in tags]}})
    return {
        'collection': settings.MONGODB_TAGS_COLLECTION,
        'source_count': len(tags),
        'inserted': inserted,
        'updated': updated,
        'unchanged': len(tags) - inserted - updated,
        'target_count_for_legacy_ids': target_count,
    }


def main():
    args = parse_args()
    tags = load_source_tags(limit=args.limit)
    preview = [build_document(tag) for tag in tags[:5]]

    if args.dry_run:
        print(
            json.dumps(
                {
                    'mode': 'dry-run',
                    'collection': settings.MONGODB_TAGS_COLLECTION,
                    'source_count': len(tags),
                    'preview': preview,
                },
                default=str,
                indent=2,
            )
        )
        return

    result = migrate_tags(tags)
    print(json.dumps(result, default=str, indent=2))


if __name__ == '__main__':
    main()
