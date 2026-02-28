import { Response } from "express";
import { CampaignModel } from "../infrastructure/database/CampaignModel";
import { ProspectModel } from "../infrastructure/database/ProspectModel";
import { AuthRequest } from "../middlewares/authMiddleware";

export const getStats = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const totalCampaigns = await CampaignModel.countDocuments({ userId });
  const totalOutreach = await ProspectModel.countDocuments({
    userId,
    status: { $in: ["sent", "responded", "backlink_secured"] }
  });

  const backlinksSecured = await ProspectModel.countDocuments({
    userId,
    status: "backlink_secured"
  });

  const totalProspects = await ProspectModel.countDocuments({ userId });
  const responded = await ProspectModel.countDocuments({
    userId,
    status: { $in: ["responded", "backlink_secured"] }
  });

  const responseRate = totalProspects === 0 ? 0 : (responded / totalProspects) * 100;

  res.json({
    totalCampaigns,
    totalOutreach,
    backlinksSecured,
    responseRate: Number(responseRate.toFixed(2))
  });
};
