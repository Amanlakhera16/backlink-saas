import { ProspectModel } from "../../infrastructure/database/ProspectModel";
import { CampaignModel } from "../../infrastructure/database/CampaignModel";
import { OpenAIService } from "../../infrastructure/ai/OpenAIService";

export const scoreProspects = async (campaignId: string) => {
  const campaign = await CampaignModel.findById(campaignId);
  if (!campaign) throw new Error("Campaign not found");

  const prospects = await ProspectModel.find({
    campaignId,
    status: "discovered"
  });

  const ai = new OpenAIService();

  await Promise.all(
    prospects.map(async (prospect) => {
      const result = await ai.scoreOpportunity(
        prospect.website,
        campaign.niche
      );

      prospect.score = result.score;
      prospect.aiReason = result.reason;
      prospect.status = "scored";

      await prospect.save();
    })
  );

  await CampaignModel.findByIdAndUpdate(campaignId, {
    status: "prospects_scored"
  });

  return prospects;
};