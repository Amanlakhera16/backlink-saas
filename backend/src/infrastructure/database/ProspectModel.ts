import { Schema, model, Types } from "mongoose";

const ProspectSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, index: true, ref: "User" },
    campaignId: { type: Types.ObjectId, required: true, index: true, ref: "Campaign" },
    website: String,
    contactEmail: String,
    domainAuthority: Number,
    spamScore: Number,
    score: Number,
    aiReason: String,
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
  },
  { timestamps: true }
);

ProspectSchema.index({ campaignId: 1, status: 1 });

export const ProspectModel = model("Prospect", ProspectSchema);
