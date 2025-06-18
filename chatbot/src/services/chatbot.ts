import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index";
import { axiosClient } from "../functions/axios";

class ChatbotService {
  private static Instance: ChatbotService;
  private openai: OpenAI;
  private apiKey: string;
  private conversation: ChatCompletionMessageParam[] = [{ role: "system", content: "Jesteś systemem asystującym." }];

  private async init(): Promise<void> {
    this.openai = await this.connect();
    await this.login();
  }

  static async initialize(apiKey: string): Promise<ChatbotService> {
    if (!this.Instance) {
      const instance = new ChatbotService();

      this.Instance = instance;
      this.Instance.apiKey = apiKey;

      await instance.init();
    }
    return this.Instance;
  }

  public async askAi(conversation: ChatCompletionMessageParam[]): Promise<string> {
    try {
      this.conversation.push(...conversation);
      const completion = await this.openai.chat.completions.create({
        model: "mistralai/devstral-small:free",
        messages: this.conversation,
      });

      this.conversation = [{ role: "system", content: "Jesteś systemem asystującym." }];
      return completion.choices[0].message.content;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  private async login(): Promise<string> {
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
        throw new Error("no jwt token");
      }
      return response.data.jwtToken;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }
  // private pushMessage(content: string): void {
  //   if (this.messages.length === 10) {
  //     this.messages.splice(1, 1);
  //   }
  //   this.messages.push({ role: "user", content });
  // }

  private async connect(): Promise<OpenAI> {
    try {
      const openai = await new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: this.apiKey,
      });
      return openai;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }
}

export default ChatbotService;
