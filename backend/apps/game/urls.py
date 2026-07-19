from django.urls import path
from .views import select_category, submit_word, guess_letter, next_round, request_hint, submit_hint, play_again, send_message, get_messages, get_game

urlpatterns = [
    path("category/", select_category),
    path("word/", submit_word),
    path("guess/", guess_letter),
    path("next-round/", next_round),
    path("request-hint/", request_hint),
    path("submit-hint/", submit_hint),
    path("play-again/", play_again),
    path("send-message/", send_message), 
    path("messages/", get_messages),
    path("current-game/", get_game),
]