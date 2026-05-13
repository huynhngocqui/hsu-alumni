from rest_framework import serializers

from .models import CoopListing


class CoopListingSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.full_name', read_only=True)

    class Meta:
        model = CoopListing
        fields = [
            'id',
            'owner',
            'owner_name',
            'business_name',
            'name',
            'description',
            'image_url',
            'category_tags',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'owner_name', 'business_name', 'status', 'created_at', 'updated_at']


class CoopListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoopListing
        fields = ['name', 'description', 'image_url', 'category_tags']

    def validate_category_tags(self, value):
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError('At least one category tag is required.')
        return [str(item).strip() for item in value if str(item).strip()]

    def create(self, validated_data):
        request = self.context['request']
        owner = request.user
        return CoopListing.objects.create(
            owner=owner,
            business_name=owner.current_company or owner.full_name,
            **validated_data,
        )
