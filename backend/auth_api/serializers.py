from django.contrib.auth import get_user_model
from rest_framework import serializers
import unicodedata

from integrations.services import PeopleSoftLookupError, lookup_peoplesoft_profile

User = get_user_model()


def _normalize_match_value(value):
    if value is None:
        return ''

    text = ' '.join(str(value).strip().split())
    normalized = unicodedata.normalize('NFKD', text)
    without_marks = ''.join(character for character in normalized if not unicodedata.combining(character))
    return without_marks.casefold()


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[])
    identity_id = serializers.CharField(validators=[])

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

    def validate_email(self, value):
        normalized = str(value).strip().lower()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError('Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.')
        return normalized

    def validate_identity_id(self, value):
        normalized = ''.join(character for character in str(value) if character.isdigit())
        if len(normalized) not in {9, 12}:
            raise serializers.ValidationError('Identity ID must contain 9 or 12 digits.')
        if User.objects.filter(identity_id=normalized).exists():
            raise serializers.ValidationError('CCCD/CMND này đã được đăng ký.')
        return normalized

    def validate_phone_number(self, value):
        normalized = ''.join(character for character in str(value) if character.isdigit())
        if len(normalized) < 10 or len(normalized) > 11:
            raise serializers.ValidationError('Phone number must contain 10 to 11 digits.')
        return normalized

    def validate_student_id(self, value):
        normalized = str(value).strip()
        if normalized and len(normalized) < 6:
            raise serializers.ValidationError('Student ID must contain at least 6 characters.')
        return normalized

    def validate(self, attrs):
        intake_year = attrs.get('intake_year')
        graduation_year = attrs.get('graduation_year')
        if intake_year and graduation_year and graduation_year < intake_year:
            raise serializers.ValidationError(
                {'graduation_year': 'Graduation year must be greater than or equal to intake year.'}
            )

        try:
            peoplesoft_profile = lookup_peoplesoft_profile(
                identity_id=attrs.get('identity_id', ''),
                student_id=attrs.get('student_id', ''),
                email=attrs.get('email', ''),
            )
        except PeopleSoftLookupError as exc:
            raise serializers.ValidationError(exc.as_serializer_error()) from exc

        mismatches = {}
        field_labels = {
            'full_name': 'full name',
            'last_name': 'last name',
            'student_id': 'student ID',
            'major': 'major',
            'academic_degree': 'academic degree',
            'mode_of_study': 'mode of study',
            'intake_year': 'intake year',
            'graduation_year': 'graduation year',
        }

        for field_name, label in field_labels.items():
            expected = peoplesoft_profile.get(field_name)
            current = attrs.get(field_name)

            if current in (None, '') or expected in (None, ''):
                continue

            if _normalize_match_value(current) != _normalize_match_value(expected):
                mismatches[field_name] = f'{label.capitalize()} does not match the PeopleSoft record.'

        if mismatches:
            raise serializers.ValidationError(mismatches)

        attrs['peoplesoft_profile'] = peoplesoft_profile
        return attrs

    def create(self, validated_data):
        peoplesoft_profile = validated_data.pop('peoplesoft_profile', None) or {}
        authoritative_fields = {
            field_name: peoplesoft_profile[field_name]
            for field_name in (
                'full_name',
                'last_name',
                'student_id',
                'identity_id',
                'major',
                'academic_degree',
                'mode_of_study',
                'intake_year',
                'graduation_year',
            )
            if peoplesoft_profile.get(field_name) not in (None, '')
        }
        user_payload = {key: value for key, value in validated_data.items() if key != 'email'}
        user_payload.update(authoritative_fields)

        return User.objects.create_user(
            email=validated_data['email'],
            password=None,
            role=User.Role.ALUMNI,
            account_status=User.AccountStatus.PENDING,
            **user_payload,
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(trim_whitespace=False)


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(min_length=8, trim_whitespace=False)
