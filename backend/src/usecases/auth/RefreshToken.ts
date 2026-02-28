import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../middlewares/errorHandler";

export const refreshAccessToken = (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as any;

    const accessToken = jwt.sign(
      { id: decoded.id },
      env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    return accessToken;
  } catch {
    throw new AppError(401, "Invalid refresh token");
  }
};