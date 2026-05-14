from rest_framework import parsers, permissions, status
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from engagement.services import notify_job_application_created, notify_job_listing_created

from .repositories import get_job_repository
from .serializers import (
    JobApplicationCreateSerializer,
    JobApplicationSerializer,
    JobListingCreateSerializer,
    JobListingSerializer,
)


class JobListingListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        repository = get_job_repository()
        listings = repository.list_published(
            search=request.query_params.get('search', '').strip(),
            tag=request.query_params.get('tag', '').strip().lower(),
        )
        serializer = JobListingSerializer(listings, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = JobListingCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        listing = get_job_repository().create_listing(request.user, serializer.validated_data)
        notify_job_listing_created(listing, request.user)
        output = JobListingSerializer(listing)
        return Response(output.data, status=status.HTTP_201_CREATED)


class JobListingDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        listing = get_job_repository().get_listing(pk)

        if listing is None:
            raise NotFound('Job listing not found.')

        serializer = JobListingSerializer(listing)
        return Response(serializer.data)


class JobApplicationCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request, pk):
        repository = get_job_repository()
        listing = repository.get_listing(pk)

        if listing is None:
            raise NotFound('Job listing not found.')

        serializer = JobApplicationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if listing['owner'] == request.user.id:
            raise ValidationError('You cannot apply to your own job posting.')

        if not request.user.job_seeking_status:
            raise ValidationError('You must enable job seeking status in your profile before applying.')

        if repository.application_exists(listing, request.user.id):
            raise ValidationError('You have already applied to this job.')

        application = repository.create_application(listing, request.user, serializer.validated_data)
        notify_job_application_created(listing, request.user, application)
        output = JobApplicationSerializer(application)
        return Response(output.data, status=status.HTTP_201_CREATED)
