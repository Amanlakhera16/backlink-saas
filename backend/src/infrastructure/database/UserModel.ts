import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    stripeCustomerId: { type: String }
  },
  { timestamps: true }
);

export const UserModel = model("User", UserSchema);
