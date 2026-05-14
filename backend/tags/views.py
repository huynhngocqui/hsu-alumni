from rest_framework import permissions, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from hsu_alumni.permissions import IsAdminRole

from .repositories import get_tag_repository
from .serializers import TagSerializer, TagWriteSerializer


class TagListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        repository = get_tag_repository()
        serializer = TagSerializer(repository.list_tags(), many=True)
        return Response(serializer.data)


class AdminTagListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        serializer = TagSerializer(get_tag_repository().list_tags(), many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TagWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tag = get_tag_repository().create_tag(serializer.validated_data)
        return Response(TagSerializer(tag).data, status=status.HTTP_201_CREATED)


class AdminTagDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def patch(self, request, pk):
        serializer = TagWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tag = get_tag_repository().update_tag(pk, serializer.validated_data)
        if tag is None:
            raise NotFound('Tag not found.')
        return Response(TagSerializer(tag).data)

    def delete(self, request, pk):
        deleted = get_tag_repository().delete_tag(pk)
        if not deleted:
            raise NotFound('Tag not found.')
        return Response(status=status.HTTP_204_NO_CONTENT)
