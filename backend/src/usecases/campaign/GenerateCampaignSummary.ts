import { CampaignModel } from "../../infrastructure/database/CampaignModel";
import { ProspectModel } from "../../infrastructure/database/ProspectModel";

export const generateCampaignSummary = async (campaignId: string) => {
  const campaign = await CampaignModel.findById(campaignId);
  if (!campaign) throw new Error("Campaign not found");

  const totalProspects = await ProspectModel.countDocuments({ campaignId });

  const scored = await ProspectModel.countDocuments({
    campaignId,
    status: { $in: ["scored", "email_generated", "sent", "responded", "backlink_secured"] }
  });

  const emailsGenerated = await ProspectModel.countDocuments({
    campaignId,
    status: { $in: ["email_generated", "sent", "responded", "backlink_secured"] }
  });

  const sent = await ProspectModel.countDocuments({
    campaignId,
    status: { $in: ["sent", "responded", "backlink_secured"] }
  });

  const responded = await ProspectModel.countDocuments({
    campaignId,
    status: { $in: ["responded", "backlink_secured"] }
  });

  const backlinks = await ProspectModel.countDocuments({
    campaignId,
    status: "backlink_secured"
  });

  const responseRate = sent === 0 ? 0 : (responded / sent) * 100;

  return {
    campaign,
    totalProspects,
    scored,
    emailsGenerated,
    sent,
    responded,
    backlinks,
    responseRate: Number(responseRate.toFixed(2))
  };
};