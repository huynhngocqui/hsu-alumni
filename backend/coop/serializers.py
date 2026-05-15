from rest_framework import serializers


class FlexibleIdField(serializers.Field):
    def to_representation(self, value):
        if isinstance(value, int):
            return value

        return str(value)


class CoopListingSerializer(serializers.Serializer):
    id = FlexibleIdField()
    type = serializers.CharField(required=False)
    owner = FlexibleIdField()
    owner_name = serializers.CharField()
    business_name = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField(allow_blank=True)
    image_url = serializers.CharField(allow_blank=True)
    category_tags = serializers.ListField(child=serializers.CharField())
    status = serializers.CharField()
    views_count = serializers.IntegerField(required=False)
    applications_count = serializers.IntegerField(required=False)
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()


class CoopListingCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=160)
    description = serializers.CharField(allow_blank=True, required=False, default='')
    image_url = serializers.URLField(allow_blank=True, required=False, default='')
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


class CoopListingUpdateSerializer(CoopListingCreateSerializer):
    status = serializers.ChoiceField(
        choices=['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'],
        required=False,
    )

    def validate_category_tags(self, value):
        if value in (None, ''):
            return []
        return super().validate_category_tags(value)
