from rest_framework import serializers


class FlexibleIdField(serializers.Field):
    def to_representation(self, value):
        if isinstance(value, int):
            return value

        return str(value)


class JobListingSerializer(serializers.Serializer):
    id = FlexibleIdField()
    type = serializers.CharField(required=False)
    owner = FlexibleIdField()
    owner_name = serializers.CharField()
    company_name = serializers.CharField()
    job_name = serializers.CharField()
    job_position = serializers.CharField()
    employment_type = serializers.CharField(allow_blank=True)
    work_location = serializers.CharField(allow_blank=True)
    job_description = serializers.CharField(allow_blank=True)
    category_tags = serializers.ListField(child=serializers.CharField())
    status = serializers.CharField()
    application_deadline = serializers.DateField(allow_null=True, required=False)
    views_count = serializers.IntegerField(required=False)
    applications_count = serializers.IntegerField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()


class JobListingCreateSerializer(serializers.Serializer):
    job_name = serializers.CharField(max_length=180)
    job_position = serializers.CharField(max_length=180)
    employment_type = serializers.CharField(max_length=120, allow_blank=True, required=False, default='')
    work_location = serializers.CharField(max_length=255, allow_blank=True, required=False, default='')
    job_description = serializers.CharField(allow_blank=True, required=False, default='')
    application_deadline = serializers.DateField(allow_null=True, required=False, default=None)
    category_tags = serializers.JSONField()

    def validate_category_tags(self, value):
        if isinstance(value, str):
            raw_items = value.split(',')
        elif isinstance(value, list):
            raw_items = value
        else:
            raise serializers.ValidationError('Category tags must be a list or comma-separated string.')

        normalized = []
        for item in raw_items:
            if isinstance(item, dict):
                item = item.get('name') or item.get('slug') or item.get('label') or ''
            text = str(item).strip()
            if text and text not in normalized:
                normalized.append(text)

        if not normalized:
            raise serializers.ValidationError('At least one category tag is required.')

        return normalized


class JobApplicationCreateSerializer(serializers.Serializer):
    cv_file = serializers.FileField()
    portfolio_url = serializers.URLField(allow_blank=True, required=False, default='')
    cover_note = serializers.CharField(allow_blank=True, required=False, default='')


class JobApplicationSerializer(serializers.Serializer):
    id = FlexibleIdField()
    job_listing = FlexibleIdField()
    listing = serializers.DictField(required=False)
    company_name = serializers.CharField(allow_blank=True, required=False)
    job_name = serializers.CharField(allow_blank=True, required=False)
    job_position = serializers.CharField(allow_blank=True, required=False)
    employment_type = serializers.CharField(allow_blank=True, required=False)
    applicant = FlexibleIdField()
    applicant_name = serializers.CharField(allow_blank=True, required=False)
    applicant_email = serializers.EmailField(allow_blank=True, required=False)
    cv_file = serializers.CharField(allow_blank=True)
    portfolio_url = serializers.CharField(allow_blank=True, required=False)
    cover_note = serializers.CharField(allow_blank=True)
    status = serializers.CharField(required=False)
    timeline = serializers.ListField(child=serializers.DictField(), required=False)
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField(required=False)


class JobListingUpdateSerializer(JobListingCreateSerializer):
    status = serializers.ChoiceField(
        choices=['DRAFT', 'PUBLISHED', 'CLOSED'],
        required=False,
    )

    def validate_category_tags(self, value):
        if value in (None, ''):
            return []
        return super().validate_category_tags(value)
