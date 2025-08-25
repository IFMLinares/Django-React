import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DB_TYPE = os.getenv('DB_TYPE', 'SQLITE').upper()

if DB_TYPE == 'POSTGRESQL':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('POSTGRES_DB', 'django_db'),
            'USER': os.getenv('POSTGRES_USER', 'admin'),
            'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'admin'),
            'HOST': os.getenv('POSTGRES_HOST', 'db'),
            'PORT': int(os.getenv('POSTGRES_PORT', 5432)),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }
