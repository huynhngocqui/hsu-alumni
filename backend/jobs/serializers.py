from rest_framework import serializers


class FlexibleIdField(serializers.Field):
    def to_representation(self, value):
        if isinstance(value, int):
            return value

        return str(value)


class JobListingSerializer(serializers.Serializer):
    id = FlexibleIdField()
    owner = FlexibleIdField()
    owner_name = serializers.CharField()
    company_name = serializers.CharField()
    job_name = serializers.CharField()
    job_position = serializers.CharField()
    job_description = serializers.CharField(allow_blank=True)
    category_tags = serializers.ListField(child=serializers.CharField())
    status = serializers.CharField()
    applications_count = serializers.IntegerField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()


class JobListingCreateSerializer(serializers.Serializer):
    job_name = serializers.CharField(max_length=180)
    job_position = serializers.CharField(max_length=180)
    job_description = serializers.CharField(allow_blank=True, required=False, default='')
    category_tags = serializers.ListField(child=serializers.CharField(), allow_empty=False)

    def validate_category_tags(self, value):
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError('At least one category tag is required.')
        return [str(item).strip() for item in value if str(item).strip()]


class JobApplicationCreateSerializer(serializers.Serializer):
    cv_file = serializers.FileField()
    cover_note = serializers.CharField(allow_blank=True, required=False, default='')


class JobApplicationSerializer(serializers.Serializer):
    id = FlexibleIdField()
    job_listing = FlexibleIdField()
    applicant = FlexibleIdField()
    cv_file = serializers.CharField(allow_blank=True)
    cover_note = serializers.CharField(allow_blank=True)
    created_at = serializers.DateTimeField()
