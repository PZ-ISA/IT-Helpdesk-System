from pydantic import BaseModel


class MessageObject(BaseModel):
    role: str
    content: str