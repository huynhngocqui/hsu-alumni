from pathlib import Path
import os

from dotenv import dotenv_values

BASE_DIR = Path(__file__).resolve().parent.parent.parent

for env_values in (dotenv_values(BASE_DIR / '.env'), dotenv_values(BASE_DIR / '.env.local')):
    for key, value in env_values.items():
        if value is not None and key not in os.environ:
            os.environ[key] = value


def _is_windows_absolute_path(value):
    return len(value) >= 3 and value[1] == ':' and value[2] in {'/', '\\'}


def _resolve_sqlite_name(env_name, default_name='db.sqlite3'):
    raw_value = os.getenv(env_name)
    if not raw_value:
        return BASE_DIR / default_name

    if _is_windows_absolute_path(raw_value):
        if os.name == 'nt':
            return Path(raw_value)
        return BASE_DIR / Path(raw_value).name

    path_value = Path(raw_value).expanduser()
    if path_value.is_absolute():
        return path_value

    return BASE_DIR / path_value

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'unsafe-dev-secret-key')
DEBUG = False
ALLOWED_HOSTS = os.getenv('DJANGO_ALLOWED_HOSTS', '127.0.0.1,localhost').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'auth_api',
    'content',
    'engagement',
    'integrations',
    'users',
    'tags',
    'coop',
    'jobs',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'hsu_alumni.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'hsu_alumni.wsgi.application'
ASGI_APPLICATION = 'hsu_alumni.asgi.application'

DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': _resolve_sqlite_name('DB_NAME'),
    }
}

MONGODB_ENABLED = os.getenv('MONGODB_ENABLED', '0') == '1'
MONGODB_URI = os.getenv('MONGODB_URI', '')
MONGODB_DB_NAME = os.getenv('MONGODB_DB_NAME', '')
MONGODB_AUTH_SOURCE = os.getenv('MONGODB_AUTH_SOURCE', '')
MONGODB_USERNAME = os.getenv('MONGODB_USERNAME', '')
MONGODB_PASSWORD = os.getenv('MONGODB_PASSWORD', '')
MONGODB_TLS = os.getenv('MONGODB_TLS', '0') == '1'
MONGODB_TAGS_COLLECTION = os.getenv('MONGODB_TAGS_COLLECTION', 'tags')
MONGODB_COOP_COLLECTION = os.getenv('MONGODB_COOP_COLLECTION', 'coop_listings')
MONGODB_JOB_LISTINGS_COLLECTION = os.getenv('MONGODB_JOB_LISTINGS_COLLECTION', 'job_listings')
MONGODB_JOB_APPLICATIONS_COLLECTION = os.getenv('MONGODB_JOB_APPLICATIONS_COLLECTION', 'job_applications')
MONGODB_USERS_COLLECTION = os.getenv('MONGODB_USERS_COLLECTION', 'users')

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'vi'
TIME_ZONE = 'Asia/Ho_Chi_Minh'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'users.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        'CORS_ALLOWED_ORIGINS',
        'http://127.0.0.1:3456,http://localhost:3456,http://127.0.0.1:5173,http://localhost:5173',
    ).split(',')
    if origin.strip()
]

CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://127.0.0.1:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://127.0.0.1:6379/0')
