from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import PeopleSoftLookupRequestSerializer
from .services import PeopleSoftLookupError, lookup_peoplesoft_profile


class PeopleSoftLookupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PeopleSoftLookupRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            profile = lookup_peoplesoft_profile(**serializer.validated_data)
        except PeopleSoftLookupError as exc:
            return Response({'error': exc.code, 'detail': exc.detail}, status=status.HTTP_404_NOT_FOUND)

        return Response({'profile': profile})