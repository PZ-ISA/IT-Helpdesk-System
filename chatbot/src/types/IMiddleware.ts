import express from "express";

interface IMiddleWare {
  handler(req: express.Request, res: express.Response, next?: express.NextFunction): void;
}

export { IMiddleWare };
