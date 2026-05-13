from django.urls import path

from .views import CoopListingDetailView, CoopListingListCreateView

urlpatterns = [
    path('listings', CoopListingListCreateView.as_view(), name='coop-listings'),
    path('listings/<int:pk>', CoopListingDetailView.as_view(), name='coop-listing-detail'),
]
