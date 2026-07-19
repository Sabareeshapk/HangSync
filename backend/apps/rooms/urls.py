from django.urls import path

from .views import (
    create_room,
    join_room,
    get_room,
    start_game,
    leave_room
)

urlpatterns = [
    path("create/", create_room, name="create-room"),
    path("join/", join_room, name="join-room"),
    path("start/", start_game, name="start-game"),   # 👈 Move this up
    path("<str:room_code>/", get_room, name="get-room"),
    path("leave-room/", leave_room),
   
]