import { ProspectModel } from "../../infrastructure/database/ProspectModel";
import { CampaignModel } from "../../infrastructure/database/CampaignModel";
import { OpenAIService } from "../../infrastructure/ai/OpenAIService";

export const generateOutreach = async (campaignId: string) => {
  const campaign = await CampaignModel.findById(campaignId);
  if (!campaign) throw new Error("Campaign not found");

  const prospects = await ProspectModel.find({
    campaignId,
    status: "scored"
  }).limit(campaign.maxOutreach);

  const ai = new OpenAIService();

  for (const prospect of prospects) {
    const email = await ai.generateOutreachEmail({
      website: prospect.website,
      niche: campaign.niche,
      userWebsite: campaign.websiteUrl
    });

    prospect.status = "email_generated";
    prospect.set("emailSubject", email.subject);
    prospect.set("emailBody", email.body);

    await prospect.save();
  }

  await CampaignModel.findByIdAndUpdate(campaignId, {
    status: "outreach_generated"
  });

  return prospects;
};