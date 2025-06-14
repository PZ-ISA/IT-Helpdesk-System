import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import EndpointBase from "./route";
import MainEndpoint from "../routes/main";
import MiddleWare from "./middleware";
import MainMiddleWare from "../middlewares/mainMiddleware";
import ChatbotEndpoint from "../routes/chatbot";
import AuthEndpoint from "../routes/auth";

class App {
  private static Instance: App;
  public client: Application;

  public endpoints: EndpointBase[] = [new MainEndpoint(), new ChatbotEndpoint(), new AuthEndpoint()];
  public middleWares: MiddleWare[] = [new MainMiddleWare()];

  public isAuthorizated = false;

  constructor() {
    this.client = express();
    this.init();
  }

  static getInstance(): App {
    if (!this.Instance) {
      this.Instance = new App();
    }
    return this.Instance;
  }

  private async init(): Promise<void> {
    this.client.use(
      cors({
        origin: "*", // tutaj jak cos powinno byc BACKEND_URL ale daje * zeby zadnych problemow nie bylo
        credentials: true,
        methods: ["GET", "POST"],
      }),
    );
    this.client.use(express.static("main"));
    this.client.use(bodyParser.json());
    this.client.use(express.json());
    this.client.use(express.urlencoded({ extended: true }));

    Promise.all([await this.initEndpointsAndMiddleWares()]);
  }

  private async initEndpointsAndMiddleWares(): Promise<void> {
    this.middleWares.forEach((middleWare: MiddleWare) => {
      this.client.use(middleWare.setGlobalMiddleWares());
    });
    this.endpoints.forEach((endpoint) => {
      this.client.use(endpoint.registerRoutes());
      console.log(`initialized: ${endpoint.path}`);
    });

    console.log("Middlewares initialized");
  }

  /**
   * run
   */
  public run() {
    this.client.listen(process.env.PORT, () => console.log(`listening on port: ${process.env.PORT}`));
  }
}

export default App;
