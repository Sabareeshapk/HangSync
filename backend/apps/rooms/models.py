from django.db import models


class Room(models.Model):
    STATUS_CHOICES = [
        ("waiting", "Waiting"),
        ("playing", "Playing"),
        ("finished", "Finished"),
    ]

    room_code = models.CharField(
        max_length=6,
        unique=True,
    )

    host_name = models.CharField(
        max_length=50,
    )

    guest_name = models.CharField(
        max_length=50,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="waiting",
    )

    current_round = models.PositiveIntegerField(
        default=1,
    )

    current_turn = models.CharField(
        max_length=10,
        default="host",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"{self.room_code} ({self.status})"
from django.db import models


class Game(models.Model):

    STATUS_CHOICES = [
        ("playing", "Playing"),
        ("finished", "Finished"),
    ]

    PHASE_CHOICES = [
        ("category_selection", "Category Selection"),
        ("word_submission", "Word Submission"),
        ("guessing", "Guessing"),
        ("round_over", "Round Over"),
        ("game_over", "Game Over"),
    ]

    ROLE_CHOICES = [
        ("guesser", "Guesser"),
        ("setter", "Setter"),
    ]

    room = models.OneToOneField(
        Room,
        on_delete=models.CASCADE,
        related_name="game",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="playing",
    )

    phase = models.CharField(
        max_length=30,
        choices=PHASE_CHOICES,
        default="category_selection",
    )

    current_round = models.PositiveIntegerField(
        default=1,
    )

    host_role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="guesser",
    )

    guest_role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="setter",
    )

    category = models.CharField(
    max_length=100,
    blank=True,
    default=""
    )

    secret_word = models.CharField(
        max_length=100,
        blank=True,
        default=""
    )

    revealed_word = models.CharField(
    max_length=200,
    default="",
    blank=True,
    )
    


    correct_letters = models.JSONField(default=list)

    wrong_letters = models.JSONField(default=list)

    remaining_lives = models.IntegerField(default=6)


 

    host_score = models.PositiveIntegerField(
        default=0,
    )

    guest_score = models.PositiveIntegerField(
        default=0,
    )

    hint_1 = models.TextField(blank=True, default="")
    hint_2 = models.TextField(blank=True, default="")
    hint_3 = models.TextField(blank=True, default="")

    hint_count = models.IntegerField(default=0)

    match_over = models.BooleanField(default=False)
    match_winner = models.CharField(max_length=20, blank=True, default="")
    winning_score = models.IntegerField(default=5)
    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"{self.room.room_code} - Round {self.current_round}"
    
class ChatMessage(models.Model):
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="messages"
    )

    sender = models.CharField(max_length=100)

    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender}: {self.message}"