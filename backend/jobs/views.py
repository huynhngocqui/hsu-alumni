from rest_framework import parsers, permissions, status
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from engagement.services import notify_job_application_created, notify_job_listing_created

from .repositories import get_job_repository
from .serializers import (
    JobApplicationCreateSerializer,
    JobApplicationSerializer,
    JobListingCreateSerializer,
    JobListingUpdateSerializer,
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

        if str(listing['owner']) == str(request.user.id):
            raise ValidationError('You cannot apply to your own job posting.')

        if not request.user.job_seeking_status:
            raise ValidationError('You must enable job seeking status in your profile before applying.')

        existing_application = repository.get_application_for_user(listing, request.user.id)
        if existing_application is not None:
            output = JobApplicationSerializer(existing_application)
            return Response(output.data, status=status.HTTP_200_OK)

        application = repository.create_application(listing, request.user, serializer.validated_data)
        try:
            notify_job_application_created(listing, request.user, application)
        except Exception:
            pass
        output = JobApplicationSerializer(application)
        return Response(output.data, status=status.HTTP_201_CREATED)


class JobApplicationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        repository = get_job_repository()
        listing = repository.get_listing(pk)

        if listing is None:
            raise NotFound('Job listing not found.')

        applications = repository.list_applications(listing, request.user.id)
        if applications is None:
            raise PermissionDenied('You can only view applications for your own job postings.')

        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data)


class OwnerJobListingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        listings = get_job_repository().list_owner_listings(
            request.user.id,
            search=request.query_params.get('search', '').strip(),
            status_filter=request.query_params.get('status', '').strip().upper(),
            type_filter=request.query_params.get('type', '').strip().lower(),
        )
        return Response(JobListingSerializer(listings, many=True).data)


class OwnerJobListingDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        repository = get_job_repository()
        listing = repository.get_listing(pk)
        if listing is None:
            raise NotFound('Job listing not found.')

        serializer = JobListingUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = repository.update_listing(listing, request.user.id, serializer.validated_data)
        if updated is None:
            raise PermissionDenied('You can only update your own job postings.')
        return Response(JobListingSerializer(updated).data)

    def delete(self, request, pk):
        repository = get_job_repository()
        listing = repository.get_listing(pk)
        if listing is None:
            raise NotFound('Job listing not found.')
        if not repository.delete_listing(listing, request.user.id):
            raise PermissionDenied('You can only delete your own job postings.')
        return Response(status=status.HTTP_204_NO_CONTENT)


class OwnerJobListingCloseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        repository = get_job_repository()
        listing = repository.get_listing(pk)
        if listing is None:
            raise NotFound('Job listing not found.')
        updated = repository.close_listing(listing, request.user.id)
        if updated is None:
            raise PermissionDenied('You can only close your own job postings.')
        return Response(JobListingSerializer(updated).data)


class OwnerJobListingDuplicateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        repository = get_job_repository()
        listing = repository.get_listing(pk)
        if listing is None:
            raise NotFound('Job listing not found.')
        if str(listing['owner']) != str(request.user.id):
            raise PermissionDenied('You can only duplicate your own job postings.')
        duplicated = repository.duplicate_listing(listing, request.user)
        return Response(JobListingSerializer(duplicated).data, status=status.HTTP_201_CREATED)


class ApplicantApplicationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        applications = get_job_repository().list_applicant_applications(
            request.user.id,
            search=request.query_params.get('search', '').strip(),
            status_filter=request.query_params.get('status', '').strip().upper(),
        )
        return Response(JobApplicationSerializer(applications, many=True).data)


class ApplicantApplicationWithdrawView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        application = get_job_repository().withdraw_application(pk, request.user.id)
        if application is None:
            raise NotFound('Application not found.')
        return Response(JobApplicationSerializer(application).data)
