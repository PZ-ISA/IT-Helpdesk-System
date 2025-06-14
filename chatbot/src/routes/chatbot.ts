import EndpointBase from "../core/route";
import { auth } from "../middlewares/localMiddlewares";
import ChatbotService from "../services/chatbot";
import HttpStatusCode from "../types/HttpStatusCodes";
import Methods from "../types/methods";
import { Request, Response } from "express";

class ChatbotEndpoint extends EndpointBase {
  path = "/chatbot";
  constructor() {
    super();
    this.routes = [
      {
        path: `${this.path}/ask`,
        router: this.router,
        Method: Methods.POST,
        handler: this.run.bind(this),
        localMiddleware: [auth],
      },
    ];
  }
  private run(req: Request, res: Response) {
    const { content } = req.body;

    if (!content)
      return res.json({ content: "invalid body (missing content argument)" }).status(HttpStatusCode.BadRequest);

    if (typeof content != "string")
      return res.json({ content: "invalid body (content must be string)" }).status(HttpStatusCode.BadRequest);

    const response = new ChatbotService().askAi(content);

    return res.json({ content: response }).status(HttpStatusCode.Ok);
  }
}

export default ChatbotEndpoint;
