from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        ALUMNI = 'ALUMNI', 'Alumni'

    class AccountStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        ACTIVE = 'ACTIVE', 'Active'
        INACTIVE = 'INACTIVE', 'Inactive'

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=80, blank=True)
    student_id = models.CharField(max_length=32, blank=True)
    identity_id = models.CharField(max_length=32, unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    major = models.CharField(max_length=120, blank=True)
    academic_degree = models.CharField(max_length=120, blank=True)
    mode_of_study = models.CharField(max_length=120, blank=True)
    intake_year = models.PositiveIntegerField(null=True, blank=True)
    graduation_year = models.PositiveIntegerField(null=True, blank=True)
    current_company = models.CharField(max_length=255, blank=True)
    position = models.CharField(max_length=255, blank=True)
    avatar_url = models.URLField(blank=True)
    interest_tags = models.JSONField(default=list, blank=True)
    account_status = models.CharField(
        max_length=20,
        choices=AccountStatus.choices,
        default=AccountStatus.PENDING,
    )
    job_seeking_status = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.ALUMNI)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email
