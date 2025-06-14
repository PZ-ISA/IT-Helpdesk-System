import Methods from "./methods";
import { Request, Response, NextFunction, Router } from "express";

interface IEndpoint {
  path: string;
  router: Router;
  Method: Methods;
  handler(req: Request, res: Response, next?: NextFunction): void;
  localMiddleware?: ((req: Request, res: Response, next: NextFunction) => void)[];
}

export default IEndpoint;
