from bson import ObjectId
from django.conf import settings
from django.utils import timezone

from db.mongodb import get_mongo_collection

from .models import Notification


def build_notification_document(notification):
    return {
        'legacy_id': notification.id,
        'user_legacy_id': notification.user_id,
        'notification_type': notification.notification_type,
        'title': notification.title,
        'message': notification.message,
        'url': notification.url,
        'payload': notification.payload,
        'read_at': notification.read_at,
        'created_at': notification.created_at,
    }


def ensure_notification_indexes(collection):
    collection.create_index('legacy_id', unique=True, sparse=True)
    collection.create_index([('user_legacy_id', 1), ('created_at', -1)])
    collection.create_index([('user_legacy_id', 1), ('read_at', 1)])


def _serialize_notification_document(document):
    return {
        'id': str(document.get('_id', document.get('id'))),
        'legacy_id': document.get('legacy_id'),
        'notification_type': document.get('notification_type', Notification.Type.SYSTEM),
        'title': document.get('title', ''),
        'message': document.get('message', ''),
        'url': document.get('url', ''),
        'payload': document.get('payload', {}),
        'read_at': document.get('read_at'),
        'created_at': document.get('created_at'),
        'read': document.get('read_at') is not None,
    }


class DjangoOrmNotificationRepository:
    def list_for_user(self, user_id, limit=20):
        return [build_notification_document(notification) | {'id': notification.id, 'read': notification.read_at is not None} for notification in Notification.objects.filter(user_id=user_id)[:limit]]

    def create_notification(self, user, notification_type, title, message, url='', payload=None):
        notification = Notification.objects.create(
            user=user,
            notification_type=notification_type,
            title=title,
            message=message,
            url=url,
            payload=payload or {},
        )
        return build_notification_document(notification) | {'id': notification.id, 'read': False}

    def mark_as_read(self, user_id, pk):
        notification = Notification.objects.filter(user_id=user_id, pk=pk).first()
        if notification is None:
            return None
        if notification.read_at is None:
            notification.read_at = timezone.now()
            notification.save(update_fields=['read_at'])
        return build_notification_document(notification) | {'id': notification.id, 'read': True}

    def mark_all_as_read(self, user_id):
        Notification.objects.filter(user_id=user_id, read_at__isnull=True).update(read_at=timezone.now())
        return self.list_for_user(user_id)


class MongoNotificationRepository:
    def __init__(self, collection_name):
        self.collection = get_mongo_collection(collection_name)
        ensure_notification_indexes(self.collection)

    def list_for_user(self, user_id, limit=20):
        documents = self.collection.find({'user_legacy_id': user_id}).sort('created_at', -1).limit(limit)
        return [_serialize_notification_document(document) for document in documents]

    def create_notification(self, user, notification_type, title, message, url='', payload=None):
        document = {
            'user_legacy_id': user.id,
            'user_email': user.email,
            'notification_type': notification_type,
            'title': title,
            'message': message,
            'url': url,
            'payload': payload or {},
            'read_at': None,
            'created_at': timezone.now(),
        }
        result = self.collection.insert_one(document)
        document['_id'] = result.inserted_id
        return _serialize_notification_document(document)

    def mark_as_read(self, user_id, pk):
        query = {'user_legacy_id': user_id}
        try:
            query['_id'] = ObjectId(str(pk))
        except Exception:
            if str(pk).isdigit():
                query['legacy_id'] = int(pk)
            else:
                return None

        document = self.collection.find_one(query)
        if document is None:
            return None

        if document.get('read_at') is None:
            document['read_at'] = timezone.now()
            self.collection.update_one({'_id': document['_id']}, {'$set': {'read_at': document['read_at']}})

        return _serialize_notification_document(document)

    def mark_all_as_read(self, user_id):
        now = timezone.now()
        self.collection.update_many({'user_legacy_id': user_id, 'read_at': None}, {'$set': {'read_at': now}})
        return self.list_for_user(user_id)


def get_notification_repository():
    if settings.MONGODB_ENABLED:
        return MongoNotificationRepository(settings.MONGODB_NOTIFICATIONS_COLLECTION)
    return DjangoOrmNotificationRepository()