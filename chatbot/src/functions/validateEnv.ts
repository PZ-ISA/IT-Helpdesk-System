import { z } from "zod";

function validateEnv(): void {
  const zodObject = z.object({
    PORT: z.number(),
    BACKEND_URL: z.string(),
    BOT_EMAIL: z.string(),
    BOT_PASSWORD: z.string(),
  });
  const parsed = zodObject.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 4));
    process.exit(1);
  }

  console.log("[CL] Successfully parsed env file");
}

export default validateEnv;
