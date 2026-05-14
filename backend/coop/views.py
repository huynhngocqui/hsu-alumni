from rest_framework import permissions, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from engagement.services import notify_coop_listing_created

from .repositories import get_coop_repository
from .serializers import CoopListingCreateSerializer, CoopListingSerializer


class CoopListingListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        repository = get_coop_repository()
        listings = repository.list_published(
            search=request.query_params.get('search', '').strip(),
            tag=request.query_params.get('tag', '').strip().lower(),
        )
        serializer = CoopListingSerializer(listings, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CoopListingCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        listing = get_coop_repository().create_listing(request.user, serializer.validated_data)
        notify_coop_listing_created(listing, request.user)
        output = CoopListingSerializer(listing)
        return Response(output.data, status=status.HTTP_201_CREATED)


class CoopListingDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        listing = get_coop_repository().get_listing(pk)

        if listing is None:
            raise NotFound('Co-op listing not found.')

        serializer = CoopListingSerializer(listing)
        return Response(serializer.data)
