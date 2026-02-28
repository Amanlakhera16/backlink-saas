import { Request, Response, NextFunction } from "express";
import { registerUser } from "../usecases/auth/RegisterUser";
import { loginUser } from "../usecases/auth/LoginUser";
import { AppError } from "../middlewares/errorHandler";
import { refreshAccessToken, logoutRefreshToken } from "../usecases/auth/RefreshToken";
import { env } from "../config/env";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await registerUser(req.body.email, req.body.password);
    res.status(201).json({ id: user._id, email: user.email, role: user.role });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tokens } = await loginUser(req.body.email, req.body.password, req.ip);

    res.cookie("refreshToken", tokens.refreshToken, cookieOptions);
    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) throw new AppError(401, "No refresh token");

    const tokens = await refreshAccessToken(token, req.ip);
    res.cookie("refreshToken", tokens.refreshToken, cookieOptions);
    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) await logoutRefreshToken(token, req.ip);

    res.clearCookie("refreshToken", { path: "/api/auth" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
