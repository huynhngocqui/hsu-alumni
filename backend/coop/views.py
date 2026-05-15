from rest_framework import permissions, status
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from engagement.services import notify_coop_listing_created

from .repositories import get_coop_repository
from .serializers import CoopListingCreateSerializer, CoopListingSerializer, CoopListingUpdateSerializer


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


class OwnerCoopListingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        listings = get_coop_repository().list_owner_listings(
            request.user.id,
            search=request.query_params.get('search', '').strip(),
            status_filter=request.query_params.get('status', '').strip().upper(),
            type_filter=request.query_params.get('type', '').strip().lower(),
        )
        return Response(CoopListingSerializer(listings, many=True).data)


class OwnerCoopListingDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        repository = get_coop_repository()
        listing = repository.get_listing(pk)
        if listing is None:
            raise NotFound('Co-op listing not found.')
        serializer = CoopListingUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = repository.update_listing(listing, request.user.id, serializer.validated_data)
        if updated is None:
            raise PermissionDenied('You can only update your own Co-op postings.')
        return Response(CoopListingSerializer(updated).data)

    def delete(self, request, pk):
        repository = get_coop_repository()
        listing = repository.get_listing(pk)
        if listing is None:
            raise NotFound('Co-op listing not found.')
        if not repository.delete_listing(listing, request.user.id):
            raise PermissionDenied('You can only delete your own Co-op postings.')
        return Response(status=status.HTTP_204_NO_CONTENT)


class OwnerCoopListingCloseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        repository = get_coop_repository()
        listing = repository.get_listing(pk)
        if listing is None:
            raise NotFound('Co-op listing not found.')
        updated = repository.close_listing(listing, request.user.id)
        if updated is None:
            raise PermissionDenied('You can only close your own Co-op postings.')
        return Response(CoopListingSerializer(updated).data)


class OwnerCoopListingDuplicateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        repository = get_coop_repository()
        listing = repository.get_listing(pk)
        if listing is None:
            raise NotFound('Co-op listing not found.')
        if str(listing['owner']) != str(request.user.id):
            raise PermissionDenied('You can only duplicate your own Co-op postings.')
        duplicated = repository.duplicate_listing(listing, request.user)
        return Response(CoopListingSerializer(duplicated).data, status=status.HTTP_201_CREATED)
