import IEndpoint from "../types/IEndpoint";
import Methods from "../types/methods";
import { Router } from "express";

abstract class EndpointBase {
  public router: Router = Router();
  public routes: IEndpoint[] = [];
  public abstract path: string;

  public registerRoutes() {
    for (const endpoint of this.routes) {
      if (endpoint.localMiddleware !== undefined) {
        for (const mw of endpoint.localMiddleware) {
          this.router.use(endpoint.path, mw);
        }
      }
      const register: Record<Methods, () => void> = {
        get: () => {
          this.router.get(endpoint.path, endpoint.handler);
        },
        post: () => {
          this.router.post(endpoint.path, endpoint.handler);
        },
      };
      register[endpoint.Method]();
    }

    return this.router;
  }
}

export default EndpointBase;
