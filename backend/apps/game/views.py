from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .serializers import (
    CategorySerializer,
    GameSerializer,
    WordSerializer,
    GuessSerializer,
    ChatMessageSerializer,
)
from apps.rooms.models import Room, Game, ChatMessage
from .serializers import CategorySerializer


@api_view(["POST"])
def select_category(request):
    serializer = CategorySerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    room_code = serializer.validated_data["room_code"]
    category = serializer.validated_data["category"]

    try:
        room = Room.objects.get(room_code=room_code)
        game = room.game
    except Room.DoesNotExist:
        return Response(
            {"error": "Room not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    game.category = category
    game.phase = "word_submission"
    game.save()
    serializer = GameSerializer(game)

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"room_{room.room_code}",
        {
            "type": "game_state",
            "game": serializer.data,
        },
    )

    return Response(serializer.data)

@api_view(["POST"])
def submit_word(request):
    serializer = WordSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    room_code = serializer.validated_data["room_code"]
    secret_word = serializer.validated_data["secret_word"]

    try:
        room = Room.objects.get(room_code=room_code)
        game = room.game
    except Room.DoesNotExist:
        return Response(
            {"error": "Room not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    secret_word = secret_word.upper()

    game.secret_word = secret_word

    # Create hidden version of the word
    game.revealed_word = "".join(
        "_" if char != " " else " "
        for char in secret_word
    )

    game.correct_letters = []
    game.wrong_letters = []
    game.remaining_lives = 6

    game.phase = "guessing"
    game.save()

    serializer = GameSerializer(game)

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"room_{room.room_code}",
        {
            "type": "game_state",
            "game": serializer.data,
        },
    )

    return Response(serializer.data)

@api_view(["POST"])
def guess_letter(request):
    serializer = GuessSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    room_code = serializer.validated_data["room_code"]
    letter = serializer.validated_data["letter"].upper()

    try:
        room = Room.objects.get(room_code=room_code)
        game = room.game
    except Room.DoesNotExist:
        return Response(
            {"error": "Room not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    game = room.game

    # Prevent duplicate guesses
    if letter in game.correct_letters or letter in game.wrong_letters:
        return Response(
            {"message": "Letter already guessed"}
        )

    secret = game.secret_word
    revealed = list(game.revealed_word)

    # Correct guess
    if letter in secret:

        game.correct_letters.append(letter)

        for i, ch in enumerate(secret):
            if ch == letter:
                revealed[i] = letter

        game.revealed_word = "".join(revealed)

    # Wrong guess
    else:

        game.wrong_letters.append(letter)
        game.remaining_lives -= 1
    # Check if guesser won
    # Check if guesser won
    if game.revealed_word == game.secret_word:
        game.status = "guesser_won"

        if game.host_role == "guesser":
            game.host_score += 1
        else:
            game.guest_score += 1

    # Check if setter won
    elif game.remaining_lives <= 0:
        game.status = "setter_won"

        if game.host_role == "setter":
            game.host_score += 1
        else:
            game.guest_score += 1
    
    if game.host_score >= game.winning_score:
        game.match_over = True
        game.match_winner = "host"

    elif game.guest_score >= game.winning_score:
        game.match_over = True
        game.match_winner = "guest"
    game.save()

    serializer = GameSerializer(game)

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"room_{room.room_code}",
        {
            "type": "game_state",
            "game": serializer.data,
        },
    )

    return Response(serializer.data)

@api_view(["POST"])
def next_round(request):
    room_code = request.data.get("room_code")

    try:
        room = Room.objects.get(room_code=room_code)
        game = room.game
    except Room.DoesNotExist:
        return Response(
            {"error": "Room not found"},
            status=404
        )


    if game.match_over:
        return Response(
            {"error": "Match is already over"},
            status=400,
        )
    
    # Increase round
    game.current_round += 1

    # Swap roles
    host_role = game.host_role
    game.host_role = game.guest_role
    game.guest_role = host_role

    # Reset game
    game.phase = "category_selection"
    game.status = "playing"

    game.category = ""
    game.secret_word = ""
    game.revealed_word = ""

    game.correct_letters = []
    game.wrong_letters = []

    game.remaining_lives = 6

    game.hint_1 = ""
    game.hint_2 = ""
    game.hint_3 = ""
    game.hint_count = 0

    game.save()

    serializer = GameSerializer(game)

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"room_{room.room_code}",
        {
            "type": "game_state",
            "game": serializer.data,
        },
    )

    return Response(serializer.data)

@api_view(["POST"])
def request_hint(request):
    room_code = request.data.get("room_code")

    try:
        room = Room.objects.get(room_code=room_code)
        game = room.game
    except Room.DoesNotExist:
        return Response(
            {"error": "Room not found"},
            status=404
        )

    print("Sending hint_requested to:", f"room_{room.room_code}")

    if game.hint_count >= 3:
        return Response(
            {"error": "No hints remaining"},
            status=400
        )

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"room_{room.room_code}",
        {
            "type": "hint_requested",
        },
    )

    print("group_send completed")

    return Response({
        "success": True,
        "message": "Hint request sent.",
    })

@api_view(["POST"])
def submit_hint(request):
    room_code = request.data.get("room_code")
    hint = request.data.get("hint", "").strip()

    try:
        room = Room.objects.get(room_code=room_code)
        game = room.game
    except Room.DoesNotExist:
        return Response({"error": "Room not found"}, status=404)

    if not hint:
        return Response({"error": "Hint cannot be empty"}, status=400)

    if game.hint_count >= 3:
        return Response({"error": "Maximum hints reached"}, status=400)

    if game.hint_count == 0:
        game.hint_1 = hint
    elif game.hint_count == 1:
        game.hint_2 = hint
    elif game.hint_count == 2:
        game.hint_3 = hint

    game.hint_count += 1
    game.save()

    serializer = GameSerializer(game)

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"room_{room.room_code}",
        {
            "type": "game_state",
            "game": serializer.data,
        },
    )

    return Response(serializer.data)

@api_view(["POST"])
def play_again(request):
    room_code = request.data.get("room_code")

    try:
        room = Room.objects.get(room_code=room_code)
        game = room.game
    except Room.DoesNotExist:
        return Response(
            {"error": "Room not found"},
            status=404,
        )

    # Reset match
    game.host_score = 0
    game.guest_score = 0

    game.match_over = False
    game.match_winner = ""

    game.current_round = 1

    # Reset round
    game.phase = "category_selection"
    game.status = "playing"

    game.category = ""
    game.secret_word = ""
    game.revealed_word = ""

    game.correct_letters = []
    game.wrong_letters = []

    game.remaining_lives = 6

    game.hint_1 = ""
    game.hint_2 = ""
    game.hint_3 = ""
    game.hint_count = 0

    # Optional: reset roles to default
    game.host_role = "guesser"
    game.guest_role = "setter"

    game.save()

    serializer = GameSerializer(game)

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"room_{room.room_code}",
        {
            "type": "game_state",
            "game": serializer.data,
        },
    )

    return Response(serializer.data)

@api_view(["POST"])
def send_message(request):
    room_code = request.data.get("room_code")
    sender = request.data.get("sender")
    message = request.data.get("message")

    if not message or not message.strip():
        return Response(
            {"error": "Message cannot be empty"},
            status=400,
        )

    try:
        room = Room.objects.get(room_code=room_code)
    except Room.DoesNotExist:
        return Response(
            {"error": "Room not found"},
            status=404,
        )

    chat = ChatMessage.objects.create(
        room=room,
        sender=sender,
        message=message.strip(),
    )

    serializer = ChatMessageSerializer(chat)

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"room_{room.room_code}",
        {
            "type": "chat_message",
            "message": serializer.data,
        },
    )

    return Response(serializer.data)

@api_view(["GET"])
def get_messages(request):
    room_code = request.GET.get("room_code")

    try:
        room = Room.objects.get(room_code=room_code)
    except Room.DoesNotExist:
        return Response(
            {"error": "Room not found"},
            status=404,
        )

    messages = ChatMessage.objects.filter(room=room)

    serializer = ChatMessageSerializer(messages, many=True)

    return Response(serializer.data)

@api_view(["GET"])
def get_game(request):
    room_code = request.GET.get("room_code")

    try:
        room = Room.objects.get(room_code=room_code)
        game = Game.objects.get(room=room)
    except (Room.DoesNotExist, Game.DoesNotExist):
        return Response(
            {"error": "Game not found"},
            status=404,
        )

    serializer = GameSerializer(game)

    return Response(serializer.data)