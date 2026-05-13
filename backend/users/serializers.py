from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'full_name',
            'last_name',
            'student_id',
            'phone_number',
            'major',
            'academic_degree',
            'mode_of_study',
            'intake_year',
            'graduation_year',
            'current_company',
            'position',
            'avatar_url',
            'interest_tags',
            'account_status',
            'job_seeking_status',
            'role',
        ]
        read_only_fields = ['id', 'account_status', 'role']


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'full_name',
            'last_name',
            'phone_number',
            'current_company',
            'position',
            'avatar_url',
            'interest_tags',
            'job_seeking_status',
        ]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(trim_whitespace=False)
    new_password = serializers.CharField(trim_whitespace=False, min_length=8)
    confirm_password = serializers.CharField(trim_whitespace=False, min_length=8)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return attrs
