from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.urls import include, path


def healthcheck(_request):
    return JsonResponse({'status': 'ok', 'service': 'hsu-alumni-api'})


urlpatterns = [
    path('api/health/', healthcheck, name='healthcheck'),
    path('api/auth/', include('auth_api.urls')),
    path('api/', include('engagement.urls')),
    path('api/integrations/', include('integrations.urls')),
    path('api/admin/', include('content.admin_urls')),
    path('api/admin/', include('tags.admin_urls')),
    path('api/users/', include('users.urls')),
    path('api/tags/', include('tags.urls')),
    path('api/coop/', include('coop.urls')),
    path('api/jobs/', include('jobs.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
