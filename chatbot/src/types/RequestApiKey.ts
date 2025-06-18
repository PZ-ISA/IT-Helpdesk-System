import { ChatCompletionMessageParam } from "openai/resources/index";
import { Request } from "express";

export default interface RequestWithApiKey extends Request<object, object, ChatCompletionMessageParam[]> {
  apiKey?: string;
}
