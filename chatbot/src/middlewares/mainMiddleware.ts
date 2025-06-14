import MiddleWare from "../core/middleware";
import express, { NextFunction } from "express";

class MainMiddleWare extends MiddleWare {
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
      ` [ EXPRESS API ] [ METHOD ${req.method} ] [ Client ip: ${req.socket.remoteAddress} ] [ Called API: ${req.path} ] [ DateTime - ${Date()}  ]  `,
    );
    next();
  }
}

export default MainMiddleWare;
