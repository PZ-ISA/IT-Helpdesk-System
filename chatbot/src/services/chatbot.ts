import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index";
import { axiosClient } from "../functions/axios";

class ChatbotService {
  private static Instance: ChatbotService;
  private openai: OpenAI;
  private messages: ChatCompletionMessageParam[] = [{ role: "assistant", content: "Jesteś systemem asystującym." }];
  private headers: object;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    Promise.all([await this.connect(), await this.login(), await this.createSession()]);
  }

  static getInstance(): ChatbotService {
    if (!this.Instance) {
      this.Instance = new ChatbotService();
    }
    return this.Instance;
  }

  public async askAi(content: string): Promise<string> {
    try {
      this.pushMessage(content);
      const completion = await this.openai.chat.completions.create({
        model: "mistralai/devstral-small:free",
        messages: this.messages,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error(error);
    }
  }

  private async createSession(): Promise<void> {
    try {
      const response = await axiosClient.post(
        "/api/chatbot-sessions",
        {
          message: this.messages[1].content,
          date: new Date().toISOString(),
        },
        {
          headers: this.headers,
        },
      );
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }

  private async login(): Promise<void> {
    try {
      const response = await axiosClient.post(
        "/api/login",
        {
          email: process.env.BOT_EMAIL,
          password: process.env.BOT_PASSWORD,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.data.jwtToken || typeof response.data.jwtToken != "string") {
        console.error("no jwt token");
        process.exit(-1);
      }

      this.setHeaders(response.data.jwtToken);
      console.log("logged into bot account");
    } catch (err) {
      console.log(err);
    }
  }

  private setHeaders(token: string): void {
    this.headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  }
  private async pushMessage(content: string): Promise<void> {
    if (this.messages.length === 10) {
      this.messages.splice(1, 1);
    } else {
      await this.messages.push({ role: "user", content: content });
    }
  }

  private async connect(): Promise<OpenAI> {
    try {
      const openai = await new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.CHATBOT_API_KEY,
      });

      return openai;
    } catch (error) {
      console.error(error);
    }
  }
}

export default ChatbotService;
