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

from content.models import AlumniPost, AlumniStory, Article, Event, GalleryItem, NewsCategory, NewsPost
from content.mongo_helpers import (
    build_alumni_post_document,
    build_alumni_story_document,
    build_article_document,
    build_event_document,
    build_gallery_item_document,
    build_news_category_document,
    build_news_post_document,
    ensure_content_indexes,
    get_content_collection_map,
)


def parse_args():
    parser = argparse.ArgumentParser(description='Migrate SQLite-backed content records into MongoDB collections.')
    parser.add_argument('--dry-run', action='store_true', help='Preview migrated documents without writing to MongoDB.')
    return parser.parse_args()


def build_batches():
    return [
        ('articles', Article.objects.all().order_by('id'), build_article_document),
        ('gallery_items', GalleryItem.objects.all().order_by('id'), build_gallery_item_document),
        ('alumni_stories', AlumniStory.objects.all().order_by('id'), build_alumni_story_document),
        ('alumni_posts', AlumniPost.objects.all().order_by('id'), build_alumni_post_document),
        ('news_categories', NewsCategory.objects.all().order_by('id'), build_news_category_document),
        ('news_posts', NewsPost.objects.select_related('category').all().order_by('id'), build_news_post_document),
        ('events', Event.objects.all().order_by('id'), build_event_document),
    ]


def migrate_content():
    collection_map = get_content_collection_map(require_enabled=False)
    ensure_content_indexes(collection_map)

    summary = {}

    for label, queryset, builder in build_batches():
        inserted = 0
        updated = 0
        items = list(queryset)
        collection = collection_map[label]

        for item in items:
            result = collection.update_one(
                {'legacy_id': item.id},
                {'$set': builder(item)},
                upsert=True,
            )
            if result.upserted_id is not None:
                inserted += 1
            elif result.modified_count > 0:
                updated += 1

        summary[label] = {
            'source_count': len(items),
            'inserted': inserted,
            'updated': updated,
            'unchanged': len(items) - inserted - updated,
            'mongo_legacy_count': collection.count_documents({'legacy_id': {'$in': [item.id for item in items]}}) if items else 0,
        }

    return summary


def main():
    args = parse_args()
    batches = build_batches()

    if args.dry_run:
        preview = {
            label: [builder(item) for item in list(queryset)[:2]]
            for label, queryset, builder in batches
        }
        print(json.dumps({'mode': 'dry-run', 'preview': preview}, default=str, indent=2))
        return

    print(json.dumps({'results': migrate_content()}, default=str, indent=2))


if __name__ == '__main__':
    main()