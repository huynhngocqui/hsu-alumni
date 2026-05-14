from django.conf import settings
from django.db import models
from django.utils.text import slugify


class PublishableModel(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PUBLISHED = 'PUBLISHED', 'Published'
        ARCHIVED = 'ARCHIVED', 'Archived'

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True


class Article(PublishableModel):
    class ArticleType(models.TextChoices):
        NEWS = 'NEWS', 'News'
        EVENT = 'EVENT', 'Event'
        WEBINAR = 'WEBINAR', 'Career Webinar'
        PAGE = 'PAGE', 'Landing Page'

    title = models.CharField(max_length=180)
    slug = models.SlugField(max_length=190, unique=True, blank=True)
    excerpt = models.TextField(blank=True)
    body = models.TextField(blank=True)
    article_type = models.CharField(max_length=20, choices=ArticleType.choices, default=ArticleType.NEWS)
    external_url = models.URLField(blank=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='content_articles',
    )

    class Meta:
        ordering = ['-published_at', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class GalleryItem(PublishableModel):
    title = models.CharField(max_length=180)
    album_name = models.CharField(max_length=180, blank=True)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    drive_url = models.URLField(blank=True)
    contributor_name = models.CharField(max_length=150, blank=True)

    class Meta:
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title


class AlumniStory(PublishableModel):
    class StoryCategory(models.TextChoices):
        OUTSTANDING = 'OUTSTANDING', 'Outstanding Alumni'
        SUCCESS = 'SUCCESS', 'Success Story'

    title = models.CharField(max_length=180)
    slug = models.SlugField(max_length=190, unique=True, blank=True)
    story_category = models.CharField(max_length=20, choices=StoryCategory.choices, default=StoryCategory.SUCCESS)
    alumni_name = models.CharField(max_length=150)
    company_name = models.CharField(max_length=180, blank=True)
    role_title = models.CharField(max_length=180, blank=True)
    excerpt = models.TextField(blank=True)
    body = models.TextField(blank=True)
    featured_image_url = models.URLField(blank=True)

    class Meta:
        ordering = ['-published_at', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title