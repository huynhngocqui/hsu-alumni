from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, parsers, permissions
from rest_framework.response import Response

from .models import JobListing
from .serializers import JobApplicationSerializer, JobListingCreateSerializer, JobListingSerializer


class JobListingListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = JobListing.objects.filter(status=JobListing.Status.PUBLISHED).select_related('owner')
        search = self.request.query_params.get('search', '').strip()
        tag = self.request.query_params.get('tag', '').strip().lower()

        if search:
            queryset = queryset.filter(
                Q(job_name__icontains=search)
                | Q(job_position__icontains=search)
                | Q(job_description__icontains=search)
                | Q(company_name__icontains=search)
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
            return JobListingCreateSerializer
        return JobListingSerializer

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        listing = serializer.save()
        output = JobListingSerializer(listing, context=self.get_serializer_context())
        return Response(output.data, status=201)


class JobListingDetailView(generics.RetrieveAPIView):
    queryset = JobListing.objects.select_related('owner').all()
    serializer_class = JobListingSerializer
    permission_classes = [permissions.AllowAny]


class JobApplicationCreateView(generics.CreateAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['job_listing'] = self.get_job_listing()
        return context

    def get_job_listing(self):
        return get_object_or_404(JobListing, pk=self.kwargs['pk'])
