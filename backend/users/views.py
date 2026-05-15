from django.db.models import Q
from rest_framework import permissions, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from hsu_alumni.permissions import IsAdminRole

from .models import User
from .repositories import get_user_repository, sync_user_document_if_enabled
from .serializers import (
    AdminUserSerializer,
    ChangePasswordSerializer,
    UserModerationSerializer,
    UserSerializer,
    UserUpdateSerializer,
)


class CurrentUserView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get(self, request):
        if not request.user.is_authenticated:
            return Response(None)

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


class AdminUserListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        queryset = User.objects.all().order_by('-date_joined')
        search = request.query_params.get('search', '').strip()
        account_status = request.query_params.get('account_status', '').strip().upper()

        if search:
            queryset = queryset.filter(
                Q(email__icontains=search)
                | Q(full_name__icontains=search)
                | Q(identity_id__icontains=search)
                | Q(student_id__icontains=search)
            )

        if account_status in User.AccountStatus.values:
            queryset = queryset.filter(account_status=account_status)

        serializer = AdminUserSerializer(queryset, many=True)
        return Response(serializer.data)


class AdminUserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=int(pk))
        except (User.DoesNotExist, TypeError, ValueError):
            raise NotFound('User not found.')

        serializer = UserModerationSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_user = serializer.save()

        if 'role' in serializer.validated_data:
            updated_user.is_staff = updated_user.role == User.Role.ADMIN or updated_user.is_superuser
            updated_user.save(update_fields=['is_staff'])

        sync_user_document_if_enabled(updated_user)
        return Response(AdminUserSerializer(updated_user).data)
