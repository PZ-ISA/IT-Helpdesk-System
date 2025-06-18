import EndpointBase from "../core/route";
import { auth } from "../middlewares/localMiddlewares";
import ChatbotService from "../services/chatbot";
import HttpStatusCode from "../types/HttpStatusCodes";
import Methods from "../types/methods";
import { Response } from "express";
import RequestWithApiKey from "../types/RequestApiKey";

class ChatbotEndpoint extends EndpointBase {
  path = "/chatbot";
  constructor() {
    super();
    this.routes = [
      {
        path: `${this.path}/ask`,
        router: this.router,
        Method: Methods.POST,
        handler: this.ask.bind(this),
        localMiddleware: [auth],
      },
    ];
  }

  private async ask(req: RequestWithApiKey, res: Response) {
    const conversation = req.body;
    const apiKey = req.apiKey;
    if (!conversation)
      return res.json({ content: "invalid body (missing content argument)" }).status(HttpStatusCode.BadRequest);

    const chatbot = await ChatbotService.initialize(apiKey);
    const response = await chatbot.askAi(conversation);

    return res.json({ content: response }).status(HttpStatusCode.Ok);
  }
}

export default ChatbotEndpoint;
