import bcrypt from "bcrypt";
import { UserModel } from "../../infrastructure/database/UserModel";
import { AppError } from "../../middlewares/errorHandler";

export const registerUser = async (email: string, password: string) => {
  const existing = await UserModel.findOne({ email });
  if (existing) throw new AppError(400, "User already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    email,
    password: hashed
  });

  return user;
};