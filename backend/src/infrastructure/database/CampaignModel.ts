import { Schema, model } from "mongoose";

const CampaignSchema = new Schema({
  userId: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  niche: { type: String, required: true },
  region: { type: String, required: true },
  backlinkType: { type: String, required: true },
  authorityThreshold: { type: Number, required: true },
  maxOutreach: { type: Number, required: true },
  status: { type: String, default: "draft" },
  createdAt: { type: Date, default: Date.now }
});

export const CampaignModel = model("Campaign", CampaignSchema);