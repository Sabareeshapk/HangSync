from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/rooms/", include("apps.rooms.urls")),
    path("api/game/", include("apps.game.urls")),
]