import MiddleWareBase from "../core/middleware";
import express, { NextFunction } from "express";

class MainMiddleWare extends MiddleWareBase {
  constructor() {
    super();
    this.globalMiddleWares = [
      {
        handler: this.handler,
      },
    ];
  }
  private handler(req: express.Request, res: express.Response, next: NextFunction): void {
    console.log(
      ` [ API ] [ METHOD ${req.method} ] [ Client ip: ${req.socket.remoteAddress} ] [ Called API: ${req.path} ] [ DateTime - ${Date()}  ] `,
    );
    next();
  }
}

export default MainMiddleWare;
