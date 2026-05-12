FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY alumni_portal /app/alumni_portal

WORKDIR /app/alumni_portal
EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && gunicorn alumni_portal.wsgi:application --bind 0.0.0.0:8000"]
