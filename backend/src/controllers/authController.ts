import { Request, Response, NextFunction } from "express";
import { registerUser } from "../usecases/auth/RegisterUser";
import { loginUser } from "../usecases/auth/LoginUser";
import { AppError } from "../middlewares/errorHandler";
import { refreshAccessToken } from "../usecases/auth/RefreshToken";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await registerUser(req.body.email, req.body.password);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokens = await loginUser(req.body.email, req.body.password);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) throw new AppError(401, "No refresh token");

  const accessToken = refreshAccessToken(token);

  res.json({ accessToken });
};