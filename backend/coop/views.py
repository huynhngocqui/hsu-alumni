from django.db.models import Q
from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import CoopListing
from .serializers import CoopListingCreateSerializer, CoopListingSerializer


class CoopListingListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = CoopListing.objects.filter(status=CoopListing.Status.PUBLISHED).select_related('owner')
        search = self.request.query_params.get('search', '').strip()
        tag = self.request.query_params.get('tag', '').strip().lower()

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
                | Q(business_name__icontains=search)
            )

        if tag:
            listing_ids = [
                listing.id
                for listing in queryset
                if any(str(item).strip().lower() == tag for item in listing.category_tags)
            ]
            queryset = queryset.filter(id__in=listing_ids)

        return queryset

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CoopListingCreateSerializer
        return CoopListingSerializer

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        listing = serializer.save()
        output = CoopListingSerializer(listing, context=self.get_serializer_context())
        return Response(output.data, status=201)


class CoopListingDetailView(generics.RetrieveAPIView):
    queryset = CoopListing.objects.select_related('owner').all()
    serializer_class = CoopListingSerializer
    permission_classes = [permissions.AllowAny]
