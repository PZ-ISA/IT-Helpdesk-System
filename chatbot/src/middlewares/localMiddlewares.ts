import axios from "axios";
import { NextFunction, Request, Response } from "express";
import HttpStatusCode from "../types/HttpStatusCodes";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"] as string | undefined;

  if (!apiKey)
    return res.json({ content: "Unauthorized (missing x-api-key header)" }).status(HttpStatusCode.Unauthorized);

  try {
    await axios.get("https://openrouter.ai/api/v1/auth/key", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    next();
  } catch {
    return res.json({ content: "Invalid api key" }).status(HttpStatusCode.Unauthorized);
  }
};
