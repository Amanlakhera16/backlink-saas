import bcrypt from "bcrypt";
import { UserModel } from "../../infrastructure/database/UserModel";
import { AppError } from "../../middlewares/errorHandler";
import { issueTokens } from "./tokenService";

export const loginUser = async (email: string, password: string, ip?: string) => {
  const normalized = email.trim().toLowerCase();
  const user = await UserModel.findOne({ email: normalized });
  if (!user) throw new AppError(400, "Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError(400, "Invalid credentials");

  const tokens = await issueTokens({ id: user._id.toString(), role: user.role }, ip);
  return { tokens, user };
};
