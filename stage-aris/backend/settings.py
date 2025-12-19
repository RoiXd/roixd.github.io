from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'change-me-in-production'
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'rest_framework',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'urls'

# Pas de base de données relationnelle
DATABASES = {}

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': ['rest_framework.renderers.JSONRenderer'],
    'UNAUTHENTICATED_USER': None,
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],
}

# Configuration MongoDB
MONGODB_SETTINGS = {
    'host': 'mongodb://admin:stage-aris-password@10.9.6.2:27017/',
    'database': 'stage-aris-db'
}

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [    'DELETE',    'GET',    'OPTIONS',    'PATCH',    'POST',    'PUT',]
CORS_ALLOW_HEADERS = [    'accept',    'accept-encoding',    'authorization',    'content-type',    
        'dnt',    'origin',    'user-agent',    'x-csrftoken',    'x-requested-with',]

CORS_ALLOW_ALL_ORIGINS = True