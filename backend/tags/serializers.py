from rest_framework import serializers


class FlexibleIdField(serializers.Field):
    def to_representation(self, value):
        if isinstance(value, int):
            return value

        return str(value)


class TagSerializer(serializers.Serializer):
    id = FlexibleIdField()
    name = serializers.CharField()
    slug = serializers.CharField()


class TagWriteSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)

    def validate_name(self, value):
        normalized = str(value).strip()
        if len(normalized) < 2:
            raise serializers.ValidationError('Tag name must contain at least 2 characters.')
        return normalized
