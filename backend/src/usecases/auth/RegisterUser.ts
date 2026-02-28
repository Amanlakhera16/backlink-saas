import bcrypt from "bcrypt";
import { UserModel } from "../../infrastructure/database/UserModel";
import { AppError } from "../../middlewares/errorHandler";

export const registerUser = async (email: string, password: string) => {
  const normalized = email.trim().toLowerCase();

  const existing = await UserModel.findOne({ email: normalized });
  if (existing) throw new AppError(400, "User already exists");

  const hashed = await bcrypt.hash(password, 12);

  const user = await UserModel.create({
    email: normalized,
    password: hashed
  });

  return user;
};
