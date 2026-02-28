import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { AppError } from "./errorHandler";

export const requireAllowedOrigin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!env.CORS_ORIGIN) return next();

  const allowed = env.CORS_ORIGIN.split(",").map(o => o.trim()).filter(Boolean);
  const origin = req.headers.origin || req.headers.referer || "";

  if (!origin) return next();

  if (!allowed.some(a => origin.startsWith(a))) {
    return next(new AppError(403, "Origin not allowed"));
  }

  next();
};
