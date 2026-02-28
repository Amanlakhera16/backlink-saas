import { CampaignModel } from "../../infrastructure/database/CampaignModel";
import { AppError } from "../../middlewares/errorHandler";
import { getPlanForUser } from "../billing/PlanService";

export const createCampaign = async (data: {
  userId: string;
  websiteUrl: string;
  niche: string;
  region: string;
  backlinkType: string;
  authorityThreshold: number;
  maxOutreach: number;
}) => {
  const plan = await getPlanForUser(data.userId);
  const count = await CampaignModel.countDocuments({ userId: data.userId });

  if (count >= plan.maxCampaigns) {
    throw new AppError(402, "Campaign limit exceeded for current plan");
  }

  const campaign = await CampaignModel.create(data);
  return campaign;
};
