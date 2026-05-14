from functools import lru_cache

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

try:
    from pymongo import MongoClient
except ImportError:  # pragma: no cover - optional dependency during rollout
    MongoClient = None


def _build_client_options():
    options = {}

    if settings.MONGODB_AUTH_SOURCE:
        options['authSource'] = settings.MONGODB_AUTH_SOURCE

    if settings.MONGODB_USERNAME:
        options['username'] = settings.MONGODB_USERNAME

    if settings.MONGODB_PASSWORD:
        options['password'] = settings.MONGODB_PASSWORD

    if settings.MONGODB_TLS:
        options['tls'] = True

    return options


@lru_cache(maxsize=2)
def get_mongo_client(require_enabled=True):
    if require_enabled and not settings.MONGODB_ENABLED:
        raise ImproperlyConfigured('MongoDB is disabled. Set MONGODB_ENABLED=1 to use MongoDB repositories.')

    if MongoClient is None:
        raise ImproperlyConfigured('pymongo is required when MongoDB repositories are enabled.')

    if not settings.MONGODB_URI:
        raise ImproperlyConfigured('MONGODB_URI must be configured when MongoDB repositories are enabled.')

    return MongoClient(settings.MONGODB_URI, **_build_client_options())


def get_mongo_database(require_enabled=True):
    if not settings.MONGODB_DB_NAME:
        raise ImproperlyConfigured('MONGODB_DB_NAME must be configured when MongoDB repositories are enabled.')

    return get_mongo_client(require_enabled=require_enabled)[settings.MONGODB_DB_NAME]


def get_mongo_collection(name, require_enabled=True):
    return get_mongo_database(require_enabled=require_enabled)[name]