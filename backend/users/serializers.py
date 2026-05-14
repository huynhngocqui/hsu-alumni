from rest_framework import serializers

from .models import User


class FlexibleIdField(serializers.Field):
    def to_representation(self, value):
        if isinstance(value, int):
            return value

        return str(value)


class UserSerializer(serializers.Serializer):
    id = FlexibleIdField()
    email = serializers.EmailField()
    full_name = serializers.CharField()
    last_name = serializers.CharField(allow_blank=True)
    student_id = serializers.CharField(allow_blank=True)
    phone_number = serializers.CharField(allow_blank=True)
    major = serializers.CharField(allow_blank=True)
    academic_degree = serializers.CharField(allow_blank=True)
    mode_of_study = serializers.CharField(allow_blank=True)
    intake_year = serializers.IntegerField(allow_null=True)
    graduation_year = serializers.IntegerField(allow_null=True)
    current_company = serializers.CharField(allow_blank=True)
    position = serializers.CharField(allow_blank=True)
    avatar_url = serializers.CharField(allow_blank=True)
    interest_tags = serializers.ListField(child=serializers.CharField())
    account_status = serializers.CharField()
    job_seeking_status = serializers.BooleanField()
    role = serializers.CharField()


class AdminUserSerializer(UserSerializer):
    identity_id = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    is_active = serializers.BooleanField()
    is_staff = serializers.BooleanField()
    date_joined = serializers.DateTimeField()


class UserModerationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['account_status', 'role', 'is_active']


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
