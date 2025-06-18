import { Router } from "express";
import { IMiddleWare } from "../types/IMiddleware";

abstract class MiddleWareBase {
  public router: Router = Router();
  protected globalMiddleWares: IMiddleWare[] = [];
  public setGlobalMiddleWares(): Router {
    for (const globalMw of this.globalMiddleWares) {
      this.router.use(globalMw.handler);
    }
    return this.router;
  }
}
export default MiddleWareBase;
