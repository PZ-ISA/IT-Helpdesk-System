import express from "express";
import RequestWithApiKey from "./RequestApiKey";

type RequestTypes = express.Request | RequestWithApiKey;

interface IMiddleWare {
  handler(req: RequestTypes, res: express.Response, next?: express.NextFunction): void;
}

export { IMiddleWare };
