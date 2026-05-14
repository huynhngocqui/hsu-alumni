from rest_framework import serializers


class PeopleSoftLookupRequestSerializer(serializers.Serializer):
    identity_id = serializers.CharField(required=False, allow_blank=True)
    student_id = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)

    def validate(self, attrs):
        if not any(str(attrs.get(field_name, '')).strip() for field_name in ('identity_id', 'student_id', 'email')):
            raise serializers.ValidationError('Provide at least one PeopleSoft identifier.')

        if attrs.get('identity_id'):
            attrs['identity_id'] = ''.join(character for character in attrs['identity_id'] if character.isdigit())

        if attrs.get('student_id'):
            attrs['student_id'] = str(attrs['student_id']).strip()

        if attrs.get('email'):
            attrs['email'] = attrs['email'].strip().lower()

        return attrs