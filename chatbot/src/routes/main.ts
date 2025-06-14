import EndpointBase from "../core/route";
import HttpStatusCode from "../types/HttpStatusCodes";
import Methods from "../types/methods";
import { Request, Response } from "express";

class MainEndpoint extends EndpointBase {
  path = "/";
  constructor() {
    super();
    this.routes = [
      {
        path: this.path,
        router: this.router,
        Method: Methods.GET,
        handler: this.run.bind(this),
      },
    ];
  }
  private run(req: Request, res: Response) {
    return res.status(HttpStatusCode.Ok).json({ content: "all ok" });
  }
}

export default MainEndpoint;
