import EndpointBase from "../core/route";
import HttpStatusCode from "../types/HttpStatusCodes";
import Methods from "../types/methods";
import { Request, Response } from "express";
import { auth } from "../middlewares/localMiddlewares";

class AuthEndpoint extends EndpointBase {
  path = "/chatbot";
  constructor() {
    super();
    this.routes = [
      {
        path: `${this.path}/auth`,
        router: this.router,
        Method: Methods.POST,
        handler: this.run.bind(this),
        localMiddleware: [auth],
      },
    ];
  }
  private async run(req: Request, res: Response) {
    return res.status(HttpStatusCode.Accepted).json({ content: "Authorized" });
  }
}

export default AuthEndpoint;
