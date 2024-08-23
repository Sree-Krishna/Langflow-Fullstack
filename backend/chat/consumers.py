from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
from django.conf import settings
import requests
import json
import os

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract token from query parameters
        token = self.scope['query_string'].decode().split('=')[1]
        try:
            UntypedToken(token)  # Validate token
            self.user = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            await self.accept()
            # Send a message to the client indicating successful connection
            await self.send(text_data=json.dumps({
                'message': 'WebSocket connection accepted successfully!'
            }))
        except (InvalidToken, TokenError):
            await self.close()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        # Parse the received JSON data
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message', '')

        # Get the Langflow URL from environment variable
        langflow_url = os.getenv('LANGFLOW_URL', 'http://127.0.0.1:8501')
        response = requests.post(f"{langflow_url}/api/predict", json={'message': message})

        # Send the response back to the WebSocket client
        await self.send(text_data=json.dumps({
            'message': response.json().get('message', 'Error contacting Langflow')
        }))
