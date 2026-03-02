import { generateOutreach } from "../../usecases/outreach/GenerateOutreach";
import { scoreProspects } from "../../usecases/prospect/ScoreProspects";

export type AiJobName = "score-prospects" | "generate-outreach";
export type AiJobData = { campaignId: string; userId: string };

export const processAiJob = async (name: AiJobName, data: AiJobData) => {
  if (name === "score-prospects") {
    await scoreProspects(data.campaignId, data.userId, { useQueue: false });
    return;
  }

  if (name === "generate-outreach") {
    await generateOutreach(data.campaignId, data.userId, { useQueue: false });
    return;
  }

  throw new Error(`Unknown AI job: ${name}`);
};
