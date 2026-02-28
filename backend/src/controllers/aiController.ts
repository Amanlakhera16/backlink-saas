import { Response, NextFunction } from "express";
import { scoreProspects } from "../usecases/prospect/ScoreProspects";
import { generateOutreach } from "../usecases/outreach/GenerateOutreach";
import { updateProspectStatus } from "../usecases/outreach/UpdateProspectStatus";
import { CampaignModel } from "../infrastructure/database/CampaignModel";
import { AuthRequest } from "../middlewares/authMiddleware";
import { AppError } from "../middlewares/errorHandler";

export const score = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const campaign = await CampaignModel.findOne({
      _id: req.params.id,
      userId: req.user!.id
    }).lean();

    if (!campaign) {
      throw new AppError(403, "Forbidden");
    }

    const result = await scoreProspects(campaign._id.toString(), req.user!.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const generate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const campaign = await CampaignModel.findOne({
      _id: req.params.id,
      userId: req.user!.id
    }).lean();

    if (!campaign) {
      throw new AppError(403, "Forbidden");
    }

    const result = await generateOutreach(campaign._id.toString(), req.user!.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await updateProspectStatus(
      req.params.prospectId,
      req.body.status,
      req.user!.id
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};
