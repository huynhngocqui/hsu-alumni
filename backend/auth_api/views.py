from django.contrib.auth import authenticate, login, logout
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from users.repositories import sync_user_document_if_enabled
from users.serializers import UserSerializer

from .serializers import (
    ForgotPasswordSerializer,
    LoginSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        sync_user_document_if_enabled(user)
        return Response(
            {
                'detail': 'Registration submitted successfully. Account is pending verification.',
                'user': UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            request,
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password'],
        )

        if user is None:
            return Response(
                {'error': 'INVALID_CREDENTIALS', 'detail': 'Email or password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.account_status != user.AccountStatus.ACTIVE:
            return Response(
                {'error': 'ACCOUNT_PENDING', 'detail': 'Account has not been activated yet.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        login(request, user)
        sync_user_document_if_enabled(user)
        return Response({'detail': 'Login successful.', 'user': UserSerializer(user).data})


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            {'detail': 'If the email exists, reset instructions will be sent.'},
            status=status.HTTP_202_ACCEPTED,
        )


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            {'detail': 'Password reset workflow has been stubbed and will be completed with token persistence.'},
            status=status.HTTP_202_ACCEPTED,
        )
