import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./errorHandler";

export interface AuthRequest extends Request {
  user?: { id: string; role: string; tenantId: string };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header) return next(new AppError(401, "Unauthorized"));

  const token = header.split(" ")[1];
  if (!token) return next(new AppError(401, "Unauthorized"));

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE
    }) as any;

    req.user = { id: decoded.id, role: decoded.role, tenantId: decoded.id };
    next();
  } catch {
    return next(new AppError(401, "Invalid token"));
  }
};
