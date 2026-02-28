import { CampaignModel } from "../../infrastructure/database/CampaignModel";
import { ProspectModel } from "../../infrastructure/database/ProspectModel";

export const generateCampaignSummary = async (campaignId: string, userId: string) => {
  const campaign = await CampaignModel.findOne({ _id: campaignId, userId }).lean();
  if (!campaign) throw new Error("Campaign not found");

  const query = { campaignId, userId };

  const [
    totalProspects,
    scored,
    emailsGenerated,
    sent,
    responded,
    backlinks
  ] = await Promise.all([
    ProspectModel.countDocuments(query),
    ProspectModel.countDocuments({
      ...query,
      status: { $in: ["scored", "email_generated", "sent", "responded", "backlink_secured"] }
    }),
    ProspectModel.countDocuments({
      ...query,
      status: { $in: ["email_generated", "sent", "responded", "backlink_secured"] }
    }),
    ProspectModel.countDocuments({
      ...query,
      status: { $in: ["sent", "responded", "backlink_secured"] }
    }),
    ProspectModel.countDocuments({
      ...query,
      status: { $in: ["responded", "backlink_secured"] }
    }),
    ProspectModel.countDocuments({
      ...query,
      status: "backlink_secured"
    })
  ]);

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
