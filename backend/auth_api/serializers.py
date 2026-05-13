from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'full_name',
            'last_name',
            'email',
            'phone_number',
            'academic_degree',
            'mode_of_study',
            'intake_year',
            'graduation_year',
            'major',
            'student_id',
            'identity_id',
        ]

    def validate(self, attrs):
        intake_year = attrs.get('intake_year')
        graduation_year = attrs.get('graduation_year')
        if intake_year and graduation_year and graduation_year < intake_year:
            raise serializers.ValidationError(
                {'graduation_year': 'Graduation year must be greater than or equal to intake year.'}
            )
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            password=None,
            role=User.Role.ALUMNI,
            account_status=User.AccountStatus.PENDING,
            **{key: value for key, value in validated_data.items() if key != 'email'},
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(trim_whitespace=False)


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(min_length=8, trim_whitespace=False)
