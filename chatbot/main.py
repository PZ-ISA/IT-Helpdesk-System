import uvicorn
from fastapi import FastAPI
from chatbot_module import ChatbotClass
import logging
from models import MessageObject


class Main:
    def __init__(self):
        self.app = FastAPI()
        self.app.add_api_route("/", self.root, methods=["GET"])
        self.app.add_api_route("/api/send-user-message",
                               self.getUserMessage, methods=["POST"])
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger("chatbot")
        self.chatbot = ChatbotClass()

    async def root(self):
        return {"message": "Test"}

    async def getUserMessage(self, message: MessageObject):
        reply = await self.chatbot.main(message=message)
        return {"reply": reply}


main = Main()
app = main.app


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)