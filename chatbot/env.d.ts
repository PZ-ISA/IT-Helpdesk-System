declare namespace NodeJS {
  export interface ProcessEnv {
    CHATBOT_API_KEY: string;
    PORT: string;
    BACKEND_URL: string;
    BOT_EMAIL: string;
    BOT_PASSWORD: string;
  }
}
