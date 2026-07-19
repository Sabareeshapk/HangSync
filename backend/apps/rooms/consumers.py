import json

from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs

class RoomConsumer(AsyncWebsocketConsumer):

    

    async def connect(self):
        self.room_code = self.scope["url_route"]["kwargs"]["room_code"]
        self.room_group_name = f"room_{self.room_code}"

        query_params = parse_qs(self.scope["query_string"].decode())
        self.player = query_params.get("player", [""])[0]

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        message_type = data.get("type")

        if message_type == "chat_message":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": data,
                }
            )

        elif message_type == "leave_room":
            await self.leave_room(data)

    # async def chat_message(self, event):
    #     await self.send(
    #         text_data=json.dumps(event["message"])
    #     )

    async def player_joined(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "player_joined",
                    "guest_name": event["guest_name"],
                }
            )
        )
        
    async def game_started(self, event):

        await self.send(
            text_data=json.dumps(
                {
                    "type": "game_started",
                    "game": event["game"],
                }
            )
        )
    async def game_state(self, event):
        await self.send(text_data=json.dumps({
            "type": "game_state",
            "game": event["game"],
        }))
    
    async def hint_requested(self, event):
        print("hint_requested event received in consumer")

        await self.send(
            text_data=json.dumps({
                "type": "hint_requested",
            })
        )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps({
                "type": "chat_message",
                "message": event["message"],
            })
        )

    async def leave_room(self, data):
        player = data.get("player")

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "player_left",
                "player": player,
            }
        )

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

        await self.close()
    
    async def player_left(self, event):
        if self.player == event["player"]:
            return

        await self.send(
            text_data=json.dumps({
                "type": "player_left",
                "player": event["player"],
            })
        )