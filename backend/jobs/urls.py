from django.urls import path

from .views import (
    ApplicantApplicationListView,
    ApplicantApplicationWithdrawView,
    JobApplicationCreateView,
    JobApplicationListView,
    JobListingDetailView,
    JobListingListCreateView,
    OwnerJobListingCloseView,
    OwnerJobListingDetailView,
    OwnerJobListingDuplicateView,
    OwnerJobListingView,
)

urlpatterns = [
    path('listings', JobListingListCreateView.as_view(), name='job-listings'),
    path('listings/<str:pk>', JobListingDetailView.as_view(), name='job-listing-detail'),
    path('listings/<str:pk>/apply', JobApplicationCreateView.as_view(), name='job-application-create'),
    path('listings/<str:pk>/applications', JobApplicationListView.as_view(), name='job-application-list'),
    path('owner/listings', OwnerJobListingView.as_view(), name='owner-job-listings'),
    path('owner/listings/<str:pk>', OwnerJobListingDetailView.as_view(), name='owner-job-listing-detail'),
    path('owner/listings/<str:pk>/close', OwnerJobListingCloseView.as_view(), name='owner-job-listing-close'),
    path('owner/listings/<str:pk>/duplicate', OwnerJobListingDuplicateView.as_view(), name='owner-job-listing-duplicate'),
    path('applications/me', ApplicantApplicationListView.as_view(), name='applicant-application-list'),
    path('applications/<str:pk>/withdraw', ApplicantApplicationWithdrawView.as_view(), name='applicant-application-withdraw'),
]
