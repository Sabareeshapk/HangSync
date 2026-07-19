import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

from hangsync.routing import websocket_urlpatterns

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "hangsync.settings")

django_asgi_app = get_asgi_application()
print("ASGI Loaded Successfully")
application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AuthMiddlewareStack(
            URLRouter(
                websocket_urlpatterns,
            )
        ),
    }
)