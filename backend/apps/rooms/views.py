import random
import string

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Room
from .serializers import RoomSerializer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Room, Game
from .game_serializers import GameSerializer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.rooms.models import Room
def generate_room_code():
    characters = string.ascii_uppercase + string.digits

    while True:
        room_code = "".join(random.choices(characters, k=6))

        if not Room.objects.filter(room_code=room_code).exists():
            return room_code


@api_view(["POST"])
def create_room(request):
    host_name = request.data.get("host_name")

    if not host_name:
        return Response(
            {
                "success": False,
                "message": "Host name is required."
            },
            status=400
        )

    room = Room.objects.create(
        room_code=generate_room_code(),
        host_name=host_name,
    )

    serializer = RoomSerializer(room)

    return Response(
        {
            "success": True,
            "room": serializer.data,
        },
        status=201,
    )

@api_view(["GET"])
def get_room(request, room_code):
    room = get_object_or_404(Room, room_code=room_code)

    serializer = RoomSerializer(room)

    return Response(
        {
            "success": True,
            "room": serializer.data,
        }
    )
@api_view(["POST"])
def join_room(request):
    room_code = request.data.get("room_code")
    guest_name = request.data.get("guest_name")

    if not room_code or not guest_name:
        return Response(
            {
                "success": False,
                "message": "Room code and guest name are required.",
            },
            status=400,
        )

    room = Room.objects.filter(room_code=room_code).first()

    if not room:
        return Response(
            {
                "success": False,
                "message": "Room not found.",
            },
            status=404,
        )

    if room.guest_name:
        return Response(
            {
                "success": False,
                "message": "Room is already full.",
            },
            status=400,
        )

    room.guest_name = guest_name
    room.save()

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"room_{room.room_code}",
        {
            "type": "player_joined",
            "guest_name": room.guest_name,
        },
    )

    serializer = RoomSerializer(room)

    return Response(
        {
            "success": True,
            "room": serializer.data,
        }
    )
@api_view(["POST"])
def start_game(request):

    room_code = request.data.get("room_code")

    room = get_object_or_404(Room, room_code=room_code)

    if not room.guest_name:
        return Response(
            {
                "success": False,
                "message": "Waiting for another player.",
            },
            status=400,
        )

    room.status = "playing"
    room.save()

    game, created = Game.objects.get_or_create(
        room=room,
        defaults={
            "host_role": "guesser",
            "guest_role": "setter",
        },
    )

    serializer = GameSerializer(game)

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"room_{room.room_code}",
        {
            "type": "game_started",
            "game": serializer.data,
        },
    )

    return Response(
        {
            "success": True,
            "game": serializer.data,
        }
    )






@api_view(["POST"])
def leave_room(request):
    room_code = request.data.get("room_code")
    player = request.data.get("player")

    try:
        room = Room.objects.get(room_code=room_code)
    except Room.DoesNotExist:
        return Response(
            {"error": "Room not found"},
            status=404,
        )

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"room_{room.room_code}",
        {
            "type": "player_left",
            "player": player,
        },
    )

    room.delete()

    return Response(
        {"message": "Player left successfully"}
    )