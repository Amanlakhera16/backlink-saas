import { Request, Response } from "express";
import { CampaignModel } from "../infrastructure/database/CampaignModel";
import { ProspectModel } from "../infrastructure/database/ProspectModel";

export const getStats = async (req: Request, res: Response) => {
  const totalCampaigns = await CampaignModel.countDocuments();
  const totalOutreach = await ProspectModel.countDocuments({
    status: { $in: ["sent", "responded", "backlink_secured"] }
  });

  const backlinksSecured = await ProspectModel.countDocuments({
    status: "backlink_secured"
  });

  const totalProspects = await ProspectModel.countDocuments();
  const responded = await ProspectModel.countDocuments({
    status: { $in: ["responded", "backlink_secured"] }
  });

  const responseRate =
    totalProspects === 0 ? 0 : (responded / totalProspects) * 100;

  res.json({
    totalCampaigns,
    totalOutreach,
    backlinksSecured,
    responseRate: Number(responseRate.toFixed(2))
  });
};