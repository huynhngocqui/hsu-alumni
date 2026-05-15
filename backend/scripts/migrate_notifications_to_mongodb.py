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
from engagement.models import Notification
from engagement.repositories import build_notification_document, ensure_notification_indexes


def parse_args():
    parser = argparse.ArgumentParser(description='Migrate engagement notifications into MongoDB.')
    parser.add_argument('--dry-run', action='store_true', help='Preview migrated notification documents without writing to MongoDB.')
    return parser.parse_args()


def load_notifications():
    return list(Notification.objects.select_related('user').all().order_by('id'))


def migrate_notifications(items):
    collection = get_mongo_collection(settings.MONGODB_NOTIFICATIONS_COLLECTION, require_enabled=False)
    ensure_notification_indexes(collection)

    inserted = 0
    updated = 0

    for notification in items:
        result = collection.update_one(
            {'legacy_id': notification.id},
            {'$set': build_notification_document(notification)},
            upsert=True,
        )
        if result.upserted_id is not None:
            inserted += 1
        elif result.modified_count > 0:
            updated += 1

    return {
        'collection': settings.MONGODB_NOTIFICATIONS_COLLECTION,
        'source_count': len(items),
        'inserted': inserted,
        'updated': updated,
        'unchanged': len(items) - inserted - updated,
        'target_count_for_legacy_ids': collection.count_documents({'legacy_id': {'$in': [item.id for item in items]}}) if items else 0,
    }


def main():
    args = parse_args()
    notifications = load_notifications()

    if args.dry_run:
        print(json.dumps({'mode': 'dry-run', 'collection': settings.MONGODB_NOTIFICATIONS_COLLECTION, 'source_count': len(notifications), 'preview': [build_notification_document(item) for item in notifications[:3]]}, default=str, indent=2))
        return

    print(json.dumps(migrate_notifications(notifications), default=str, indent=2))


if __name__ == '__main__':
    main()