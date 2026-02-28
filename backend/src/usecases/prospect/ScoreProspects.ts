import { ProspectModel } from "../../infrastructure/database/ProspectModel";
import { CampaignModel } from "../../infrastructure/database/CampaignModel";
import { OpenAIService } from "../../infrastructure/ai/OpenAIService";
import { ensureAiAllowance, incrementAiUsage } from "../usage/UsageService";
import { env } from "../../config/env";
import { aiQueue } from "../../infrastructure/queue/queues";

export const scoreProspects = async (
  campaignId: string,
  userId: string,
  options: { useQueue?: boolean } = {}
) => {
  if (env.USE_QUEUES === "true" && options.useQueue !== false) {
    const job = await aiQueue.add("score-prospects", { campaignId, userId });
    return { queued: true, jobId: job.id };
  }

  const campaign = await CampaignModel.findOne({ _id: campaignId, userId });
  if (!campaign) throw new Error("Campaign not found");

  const prospects = await ProspectModel.find({
    campaignId,
    userId,
    status: "discovered"
  });

  if (prospects.length === 0) return [];

  await ensureAiAllowance(userId, prospects.length);

  const ai = new OpenAIService();
  const niche = campaign.niche || "";

  for (const prospect of prospects) {
    if (!prospect.website) continue;
    const result = await ai.scoreOpportunity(prospect.website, niche);
    prospect.score = result.score;
    prospect.aiReason = result.reason;
    prospect.status = "scored";
    await prospect.save();
  }

  await CampaignModel.findByIdAndUpdate(campaignId, {
    status: "prospects_scored"
  });

  await incrementAiUsage(userId, prospects.length);

  return prospects;
};
