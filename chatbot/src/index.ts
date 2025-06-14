import "dotenv/config";
import App from "./core/client";
import validateEnv from "./functions/validateEnv";

validateEnv();
const app = App.getInstance();

app.run();
