from rest_framework import serializers

from .models import JobApplication, JobListing


class JobListingSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.full_name', read_only=True)
    applications_count = serializers.IntegerField(source='applications.count', read_only=True)

    class Meta:
        model = JobListing
        fields = [
            'id',
            'owner',
            'owner_name',
            'company_name',
            'job_name',
            'job_position',
            'job_description',
            'category_tags',
            'status',
            'applications_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'owner',
            'owner_name',
            'company_name',
            'status',
            'applications_count',
            'created_at',
            'updated_at',
        ]


class JobListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListing
        fields = ['job_name', 'job_position', 'job_description', 'category_tags']

    def validate_category_tags(self, value):
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError('At least one category tag is required.')
        return [str(item).strip() for item in value if str(item).strip()]

    def create(self, validated_data):
        request = self.context['request']
        owner = request.user
        return JobListing.objects.create(
            owner=owner,
            company_name=owner.current_company or owner.full_name,
            **validated_data,
        )


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ['id', 'job_listing', 'applicant', 'cv_file', 'cover_note', 'created_at']
        read_only_fields = ['id', 'job_listing', 'applicant', 'created_at']

    def validate(self, attrs):
        request = self.context['request']
        job_listing = self.context['job_listing']

        if job_listing.owner_id == request.user.id:
            raise serializers.ValidationError('You cannot apply to your own job posting.')

        if not request.user.job_seeking_status:
            raise serializers.ValidationError('You must enable job seeking status in your profile before applying.')

        if JobApplication.objects.filter(job_listing=job_listing, applicant=request.user).exists():
            raise serializers.ValidationError('You have already applied to this job.')

        return attrs

    def create(self, validated_data):
        request = self.context['request']
        job_listing = self.context['job_listing']
        return JobApplication.objects.create(
            job_listing=job_listing,
            applicant=request.user,
            **validated_data,
        )
