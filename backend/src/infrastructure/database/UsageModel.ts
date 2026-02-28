import { Schema, model, Types } from "mongoose";

const UsageSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, index: true, ref: "User" },
    month: { type: String, required: true },
    aiCalls: { type: Number, default: 0 }
  },
  { timestamps: true }
);

UsageSchema.index({ userId: 1, month: 1 }, { unique: true });

export const UsageModel = model("Usage", UsageSchema);
