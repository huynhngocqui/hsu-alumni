#!/usr/bin/env python
import os
import sys
from pathlib import Path

from dotenv import dotenv_values


BASE_DIR = Path(__file__).resolve().parent


def _load_env_files():
    for env_values in (dotenv_values(BASE_DIR / '.env'), dotenv_values(BASE_DIR / '.env.local')):
        for key, value in env_values.items():
            if value is not None and key not in os.environ:
                os.environ[key] = value


def _with_configured_runserver_addrport(argv):
    if len(argv) < 2 or argv[1] != 'runserver':
        return argv

    has_explicit_addrport = any(
        not arg.startswith('-') and (arg.isdigit() or ':' in arg)
        for arg in argv[2:]
    )
    if has_explicit_addrport:
        return argv

    host = os.getenv('BACKEND_HOST', '127.0.0.1')
    port = os.getenv('BACKEND_PORT', '8000')
    if host == '0.0.0.0':
        host = '127.0.0.1'

    return [*argv, f'{host}:{port}']


def main():
    _load_env_files()
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hsu_alumni.settings.local')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and available on your "
            'PYTHONPATH environment variable? Did you forget to activate a virtual environment?'
        ) from exc
    execute_from_command_line(_with_configured_runserver_addrport(sys.argv))


if __name__ == '__main__':
    main()
