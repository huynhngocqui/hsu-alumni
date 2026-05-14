from django.conf import settings

from db.mongodb import get_mongo_collection


PUBLIC_USER_FIELDS = [
    'id',
    'email',
    'full_name',
    'last_name',
    'student_id',
    'phone_number',
    'major',
    'academic_degree',
    'mode_of_study',
    'intake_year',
    'graduation_year',
    'current_company',
    'position',
    'avatar_url',
    'interest_tags',
    'account_status',
    'job_seeking_status',
    'role',
]


def serialize_user_model(user):
    return {
        'id': user.id,
        'email': user.email,
        'full_name': user.full_name,
        'last_name': user.last_name,
        'student_id': user.student_id,
        'identity_id': user.identity_id,
        'phone_number': user.phone_number,
        'major': user.major,
        'academic_degree': user.academic_degree,
        'mode_of_study': user.mode_of_study,
        'intake_year': user.intake_year,
        'graduation_year': user.graduation_year,
        'current_company': user.current_company,
        'position': user.position,
        'avatar_url': user.avatar_url,
        'interest_tags': user.interest_tags,
        'account_status': user.account_status,
        'job_seeking_status': user.job_seeking_status,
        'role': user.role,
        'is_staff': user.is_staff,
        'is_active': user.is_active,
        'date_joined': user.date_joined,
        'updated_at': user.updated_at,
    }


def build_user_document(user):
    document = serialize_user_model(user)
    document['legacy_id'] = user.id

    if not document.get('identity_id'):
        document.pop('identity_id', None)

    return document


def ensure_user_indexes(collection):
    collection.update_many({'identity_id': None}, {'$unset': {'identity_id': ''}})
    collection.update_many({'identity_id': ''}, {'$unset': {'identity_id': ''}})

    indexes = collection.index_information()
    if 'identity_id_1' in indexes:
        collection.drop_index('identity_id_1')

    collection.create_index('legacy_id', unique=True, sparse=True)
    collection.create_index('email', unique=True)
    collection.create_index('identity_id', unique=True, partialFilterExpression={'identity_id': {'$exists': True}})
    collection.create_index('role')
    collection.create_index('account_status')


def _public_user_payload(data):
    return {field: data.get(field) for field in PUBLIC_USER_FIELDS}


class DjangoOrmUserRepository:
    def get_current_user(self, user):
        return _public_user_payload(serialize_user_model(user))

    def update_profile(self, user, validated_data):
        update_fields = []
        for key, value in validated_data.items():
            setattr(user, key, value)
            update_fields.append(key)

        update_fields.append('updated_at')
        user.save(update_fields=update_fields)
        return _public_user_payload(serialize_user_model(user))

    def sync_user(self, user):
        return _public_user_payload(serialize_user_model(user))


class MongoUserRepository:
    def __init__(self, collection_name):
        self.collection = get_mongo_collection(collection_name)
        ensure_user_indexes(self.collection)

    def _build_document(self, user):
        return build_user_document(user)

    def _upsert_document(self, user):
        document = self._build_document(user)
        existing = self.collection.find_one(
            {
                '$or': [
                    {'legacy_id': user.id},
                    {'email': user.email},
                ]
            },
            {'_id': 1},
        )
        query = {'_id': existing['_id']} if existing else {'legacy_id': user.id}
        self.collection.update_one(
            query,
            {'$set': document},
            upsert=True,
        )
        return document

    def sync_user(self, user):
        return _public_user_payload(self._upsert_document(user))

    def get_current_user(self, user):
        document = self.collection.find_one({'legacy_id': user.id})

        if document is None:
            document = self._upsert_document(user)

        return _public_user_payload(document)

    def update_profile(self, user, validated_data):
        update_fields = []
        for key, value in validated_data.items():
            setattr(user, key, value)
            update_fields.append(key)

        update_fields.append('updated_at')
        user.save(update_fields=update_fields)
        document = self._upsert_document(user)
        return _public_user_payload(document)


def get_user_repository():
    if settings.MONGODB_ENABLED:
        return MongoUserRepository(settings.MONGODB_USERS_COLLECTION)

    return DjangoOrmUserRepository()


def sync_user_document_if_enabled(user):
    if settings.MONGODB_ENABLED:
        MongoUserRepository(settings.MONGODB_USERS_COLLECTION).sync_user(user)