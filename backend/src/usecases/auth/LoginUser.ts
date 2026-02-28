import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../../infrastructure/database/UserModel";
import { env } from "../../config/env";
import { AppError } from "../../middlewares/errorHandler";

export const loginUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new AppError(400, "Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError(400, "Invalid credentials");

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};