from django.urls import path

from .views import JobApplicationCreateView, JobListingDetailView, JobListingListCreateView

urlpatterns = [
    path('listings', JobListingListCreateView.as_view(), name='job-listings'),
    path('listings/<int:pk>', JobListingDetailView.as_view(), name='job-listing-detail'),
    path('listings/<int:pk>/apply', JobApplicationCreateView.as_view(), name='job-application-create'),
]
