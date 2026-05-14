from rest_framework import serializers


class FlexibleIdField(serializers.Field):
    def to_representation(self, value):
        if isinstance(value, int):
            return value

        return str(value)


class CoopListingSerializer(serializers.Serializer):
    id = FlexibleIdField()
    owner = FlexibleIdField()
    owner_name = serializers.CharField()
    business_name = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField(allow_blank=True)
    image_url = serializers.CharField(allow_blank=True)
    category_tags = serializers.ListField(child=serializers.CharField())
    status = serializers.CharField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()


class CoopListingCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=160)
    description = serializers.CharField(allow_blank=True, required=False, default='')
    image_url = serializers.URLField(allow_blank=True, required=False, default='')
    category_tags = serializers.ListField(child=serializers.CharField(), allow_empty=False)

    def validate_category_tags(self, value):
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError('At least one category tag is required.')
        return [str(item).strip() for item in value if str(item).strip()]
