import { Schema, model } from "mongoose";

const ProspectSchema = new Schema({
  campaignId: { type: String, required: true },
  website: String,
  contactEmail: String,
  domainAuthority: Number,
  spamScore: Number,
  score: Number, // AI score (0–100)
  aiReason: String, // explanation
  emailSubject: String,
  emailBody: String,
  status: {
    type: String,
    enum: [
      "discovered",
      "scored",
      "email_generated",
      "sent",
      "responded",
      "backlink_secured"
    ],
    default: "discovered"
  }
});

export const ProspectModel = model("Prospect", ProspectSchema);