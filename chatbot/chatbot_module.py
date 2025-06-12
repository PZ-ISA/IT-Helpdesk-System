import requests
import asyncio
from openai import OpenAI
from datetime import datetime, timezone
from models import MessageObject
import logging
from typing import List
import json


API_KEY = ""
MODEL = "mistralai/devstral-small:free"
BACKEND_URL = "http://localhost:5000"
BACKEND_HEADERS = {}
SESSION = ""

messages_for_model: List[MessageObject] = [
    {"role": "system", "content": "Jesteś systemem asystującym."}
]

login_data = {
    "email": "chat@bot.com",
    "password": "x5!bIaW4@4"
}


class ChatbotClass:
    def __init__(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger("chatbot")
        asyncio.run(self._init_async())

    async def _init_async(self):
        await self.login(login_data)

    async def addTohistory(self, message: MessageObject):
        if len(messages_for_model) == 10:
            messages_for_model.pop(1)
        else:
            messages_for_model.append(message)
            print(messages_for_model)
        return None

    async def set_headers(self, token):
        global BACKEND_HEADERS
        BACKEND_HEADERS = {"Authorization": f"Bearer {token}"}
        return None

    async def login(self, payload):
        loop = asyncio.get_event_loop()
        try:
            resp = await loop.run_in_executor(
                None,
                lambda: requests.post(f"{BACKEND_URL}/api/login", json=payload)
            )
            if resp.status_code == 200:
                data = resp.json()

                await self.set_headers(data.get("jwtToken"))
                self.logger.info("logged into account.")
            else:
                self.logger.error(
                    f"Invalid email or password: {resp.status_code} {resp.text}")
            return resp
        except requests.RequestException as e:
            self.logger.exception("Internal server error")
            return None

    async def create_session(self, HEADERS):
        global SESSION
        loop = asyncio.get_event_loop()
        try:
            now = datetime.now(timezone.utc)
            formatted = now.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
            resp = await loop.run_in_executor(
                None,
                lambda: requests.post(
                    f"{BACKEND_URL}/api/chatbot-sessions", headers=HEADERS, json={"message": messages_for_model[1].content, "date": formatted})
            )
            if resp.status_code in (200,  201):
                data = resp.json()
                SESSION = data.get("sessionId")
                print(data)
                self.logger.info("created new session.")
            else:
                self.logger.error(
                    f"something went wrong: {resp.status_code} {resp.text}")
            return resp
        except requests.RequestException as e:
            self.logger.exception("Internal server error")
            return None

    async def request_openrouter_chat(self, payload):
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=API_KEY
        )
        completion = client.chat.completions.create(
            model=MODEL,
            messages=payload
        )

        return completion

    async def push_ai_messages(self, payload):
        loop = asyncio.get_event_loop()
        try:
            await self.addTohistory(message=payload)
            resp = await loop.run_in_executor(
                None,
                lambda: requests.post(f"{BACKEND_URL}/api/")
            )

        except requests.RequestException as e:
            self.logger.exception(e)
            return None

    async def main(self, message: MessageObject):
        await self.addTohistory(message=message)
        if len(messages_for_model) == 2:
            await self.create_session(HEADERS=BACKEND_HEADERS)

        reply = await self.request_openrouter_chat(payload=messages_for_model)

        return reply.choices[0].message.content
