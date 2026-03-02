import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1),
  REDIS_ENABLED: z.string().default("true"),
  REDIS_URL: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_ISSUER: z.string().default("backlink-saas"),
  JWT_AUDIENCE: z.string().default("backlink-saas"),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL: z.string().default("7d"),
  OPENAI_API_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_PRICE_BASIC: z.string().min(1),
  STRIPE_PRICE_PRO: z.string().min(1),
  STRIPE_PRICE_ENTERPRISE: z.string().optional(),
  STRIPE_SUCCESS_URL: z.string().min(1),
  STRIPE_CANCEL_URL: z.string().min(1),
  CORS_ORIGIN: z.string().default(""),
  USE_QUEUES: z.string().default("false"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  AI_RATE_LIMIT_MAX: z.coerce.number().default(20)
}).superRefine((value, ctx) => {
  if (value.REDIS_ENABLED === "true" && !value.REDIS_URL) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["REDIS_URL"],
      message: "REDIS_URL is required when REDIS_ENABLED=true"
    });
  }
});

export const env = envSchema.parse(process.env);
