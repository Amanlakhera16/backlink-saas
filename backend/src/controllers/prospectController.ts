import { Request, Response, NextFunction } from "express";
import { discoverProspects } from "../usecases/prospect/DiscoverProspects";
import { AppError } from "../middlewares/errorHandler";
import { CampaignModel } from "../infrastructure/database/CampaignModel";
import { AuthRequest } from "../middlewares/authMiddleware";

export const discover = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const campaign = await CampaignModel.findOne({
      _id: req.params.id,
      userId: req.user!.id
    });

    if (!campaign) {
      throw new AppError(403, "Forbidden");
    }

    const prospects = await discoverProspects(campaign._id.toString());

    res.json(prospects);
  } catch (error) {
    next(error);
  }
};