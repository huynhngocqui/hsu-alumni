from django.urls import path

from .views import (
    CoopListingDetailView,
    CoopListingListCreateView,
    OwnerCoopListingCloseView,
    OwnerCoopListingDetailView,
    OwnerCoopListingDuplicateView,
    OwnerCoopListingView,
)

urlpatterns = [
    path('listings', CoopListingListCreateView.as_view(), name='coop-listings'),
    path('listings/<str:pk>', CoopListingDetailView.as_view(), name='coop-listing-detail'),
    path('owner/listings', OwnerCoopListingView.as_view(), name='owner-coop-listings'),
    path('owner/listings/<str:pk>', OwnerCoopListingDetailView.as_view(), name='owner-coop-listing-detail'),
    path('owner/listings/<str:pk>/close', OwnerCoopListingCloseView.as_view(), name='owner-coop-listing-close'),
    path('owner/listings/<str:pk>/duplicate', OwnerCoopListingDuplicateView.as_view(), name='owner-coop-listing-duplicate'),
]
