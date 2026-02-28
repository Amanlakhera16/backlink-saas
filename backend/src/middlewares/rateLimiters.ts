import rateLimit from "express-rate-limit";
import { env } from "../config/env";
import { AuthRequest } from "./authMiddleware";

const keyGen = (req: AuthRequest) => req.user?.id ?? req.ip ?? "unknown";

export const userRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  keyGenerator: keyGen,
  standardHeaders: true,
  legacyHeaders: false
});

export const aiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AI_RATE_LIMIT_MAX,
  keyGenerator: keyGen,
  standardHeaders: true,
  legacyHeaders: false
});
