from django.conf import settings
from django.db import models
from django.utils.text import slugify
from django.utils import timezone


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
    image_url = models.CharField(max_length=500, blank=True)
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
    featured_image_url = models.CharField(max_length=500, blank=True)

    class Meta:
        ordering = ['-published_at', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class AlumniPost(PublishableModel):
    full_name = models.CharField(max_length=180)
    slug = models.SlugField(max_length=190, unique=True, blank=True)
    position = models.CharField(max_length=180)
    short_description = models.TextField(blank=True)
    company = models.CharField(max_length=180, blank=True)
    education_level = models.CharField(max_length=120, blank=True)
    cohort = models.CharField(max_length=120, blank=True)
    field = models.CharField(max_length=180, blank=True)
    major = models.CharField(max_length=180, blank=True)
    avatar_url = models.CharField(max_length=500, blank=True)
    content_vi = models.TextField(blank=True)
    content_en = models.TextField(blank=True)
    gallery_images = models.JSONField(default=list, blank=True)
    sort_order = models.IntegerField(default=0)
    seo_title = models.CharField(max_length=180, blank=True)
    seo_description = models.TextField(blank=True)

    class Meta:
        ordering = ['sort_order', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.full_name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name


class NewsCategory(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PUBLISHED = 'PUBLISHED', 'Published'

    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    description = models.TextField(blank=True)
    sort_order = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PUBLISHED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class NewsPost(PublishableModel):
    title = models.CharField(max_length=220)
    slug = models.SlugField(max_length=230, unique=True, blank=True)
    category = models.ForeignKey(
        NewsCategory,
        on_delete=models.PROTECT,
        related_name='news_posts',
    )
    excerpt = models.TextField(blank=True)
    thumbnail_url = models.CharField(max_length=500, blank=True)
    content_vi = models.TextField(blank=True)
    content_en = models.TextField(blank=True)
    gallery_images = models.JSONField(default=list, blank=True)
    is_featured = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)
    seo_title = models.CharField(max_length=220, blank=True)
    seo_description = models.TextField(blank=True)
    og_image_url = models.CharField(max_length=500, blank=True)

    class Meta:
        ordering = ['sort_order', '-published_at', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Event(PublishableModel):
    title = models.CharField(max_length=220)
    slug = models.SlugField(max_length=230, unique=True, blank=True)
    excerpt = models.TextField(blank=True)
    banner_url = models.CharField(max_length=500, blank=True)
    start_date_time = models.DateTimeField()
    end_date_time = models.DateTimeField()
    location = models.CharField(max_length=220, blank=True)
    content_vi = models.TextField(blank=True)
    content_en = models.TextField(blank=True)
    registration_url = models.URLField(blank=True)
    gallery_images = models.JSONField(default=list, blank=True)
    is_featured = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)
    seo_title = models.CharField(max_length=220, blank=True)
    seo_description = models.TextField(blank=True)
    og_image_url = models.CharField(max_length=500, blank=True)

    class Meta:
        ordering = ['sort_order', 'start_date_time', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def event_status(self):
        now = timezone.now()
        if self.end_date_time < now:
            return 'PAST'
        return 'UPCOMING'

    def __str__(self):
        return self.title