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
  STRIPE_SECRET_KEY: z.string().optional().default(""),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(""),
  STRIPE_PRICE_BASIC: z.string().optional().default(""),
  STRIPE_PRICE_PRO: z.string().optional().default(""),
  STRIPE_PRICE_ENTERPRISE: z.string().optional().default(""),
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

  if (value.NODE_ENV === "production") {
    if (!value.STRIPE_SECRET_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["STRIPE_SECRET_KEY"],
        message: "STRIPE_SECRET_KEY is required in production"
      });
    }
    if (!value.STRIPE_WEBHOOK_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["STRIPE_WEBHOOK_SECRET"],
        message: "STRIPE_WEBHOOK_SECRET is required in production"
      });
    }
    if (!value.STRIPE_PRICE_BASIC) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["STRIPE_PRICE_BASIC"],
        message: "STRIPE_PRICE_BASIC is required in production"
      });
    }
    if (!value.STRIPE_PRICE_PRO) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["STRIPE_PRICE_PRO"],
        message: "STRIPE_PRICE_PRO is required in production"
      });
    }
  }
});

export const env = envSchema.parse(process.env);
