import os

from django.http import JsonResponse
from pymongo import MongoClient

from .data import SEED_LANDING_PAGE


MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017/alumni_db")
MONGO_DB = os.getenv("MONGO_DB", "alumni_db")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION", "landing_pages")


def _get_collection():
    client = MongoClient(MONGO_URI)
    return client[MONGO_DB][MONGO_COLLECTION]


def _load_landing_page():
    collection = _get_collection()
    document = collection.find_one({"slug": "home"}, {"_id": 0})

    if document:
        return document

    seeded = {"slug": "home", **SEED_LANDING_PAGE}
    collection.insert_one(seeded)
    return seeded


def health(request):
    return JsonResponse({"status": "ok", "service": "alumni-backend"})


def landing_page(request):
    payload = _load_landing_page()
    return JsonResponse(payload)
