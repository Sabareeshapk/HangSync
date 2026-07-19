from rest_framework import serializers
from apps.rooms.models import Room, Game, ChatMessage


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = "__all__"


class CategorySerializer(serializers.Serializer):
    room_code = serializers.CharField(max_length=10)
    category = serializers.CharField(max_length=100)


class WordSerializer(serializers.Serializer):
    room_code = serializers.CharField()
    secret_word = serializers.CharField(max_length=200)

class GuessSerializer(serializers.Serializer):
    room_code = serializers.CharField()
    letter = serializers.CharField(max_length=1)

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = "__all__"