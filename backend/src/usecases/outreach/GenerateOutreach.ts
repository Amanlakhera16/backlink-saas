import { ProspectModel } from "../../infrastructure/database/ProspectModel";
import { CampaignModel } from "../../infrastructure/database/CampaignModel";
import { OpenAIService } from "../../infrastructure/ai/OpenAIService";
import { ensureAiAllowance, incrementAiUsage } from "../usage/UsageService";
import { getPlanForUser } from "../billing/PlanService";
import { env } from "../../config/env";
import { aiQueue } from "../../infrastructure/queue/queues";

export const generateOutreach = async (
  campaignId: string,
  userId: string,
  options: { useQueue?: boolean } = {}
) => {
  if (env.USE_QUEUES === "true" && options.useQueue !== false) {
    const job = await aiQueue.add("generate-outreach", { campaignId, userId });
    return { queued: true, jobId: job.id };
  }

  const campaign = await CampaignModel.findOne({ _id: campaignId, userId });
  if (!campaign) throw new Error("Campaign not found");

  const plan = await getPlanForUser(userId);
  const outreachLimit = Math.min(campaign.maxOutreach, plan.maxOutreach);

  const prospects = await ProspectModel.find({
    campaignId,
    userId,
    status: "scored"
  }).limit(outreachLimit);

  if (prospects.length === 0) return [];

  await ensureAiAllowance(userId, prospects.length);

  const ai = new OpenAIService();

  for (const prospect of prospects) {
    if (!prospect.website) continue;
    const email = await ai.generateOutreachEmail({
      website: prospect.website,
      niche: campaign.niche || "",
      userWebsite: campaign.websiteUrl || ""
    });

    prospect.status = "email_generated";
    prospect.set("emailSubject", email.subject);
    prospect.set("emailBody", email.body);

    await prospect.save();
  }

  await CampaignModel.findByIdAndUpdate(campaignId, {
    status: "outreach_generated"
  });

  await incrementAiUsage(userId, prospects.length);

  return prospects;
};
