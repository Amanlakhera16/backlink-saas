import { Schema, model, Types } from "mongoose";

const CampaignSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, index: true, ref: "User" },
    websiteUrl: { type: String, required: true },
    niche: { type: String, required: true },
    region: { type: String, required: true },
    backlinkType: { type: String, required: true },
    authorityThreshold: { type: Number, required: true },
    maxOutreach: { type: Number, required: true },
    status: { type: String, default: "draft" }
  },
  { timestamps: true }
);

CampaignSchema.index({ userId: 1, status: 1 });

export const CampaignModel = model("Campaign", CampaignSchema);
