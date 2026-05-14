from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .repositories import get_user_repository
from .serializers import ChangePasswordSerializer, UserSerializer, UserUpdateSerializer


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_payload = get_user_repository().get_current_user(request.user)
        return Response(UserSerializer(user_payload).data)

    def patch(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_user = get_user_repository().update_profile(request.user, serializer.validated_data)
        return Response({'user': UserSerializer(updated_user).data})


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not request.user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'error': 'INVALID_PASSWORD', 'detail': 'Current password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save(update_fields=['password'])
        return Response({'detail': 'Password updated successfully.'})
