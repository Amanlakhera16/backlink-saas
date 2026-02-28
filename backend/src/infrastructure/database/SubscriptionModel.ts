import { Schema, model, Types } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, unique: true, index: true, ref: "User" },
    stripeCustomerId: { type: String, required: true },
    stripeSubscriptionId: { type: String, required: true, unique: true },
    planId: { type: String, required: true },
    status: { type: String, required: true },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const SubscriptionModel = model("Subscription", SubscriptionSchema);
