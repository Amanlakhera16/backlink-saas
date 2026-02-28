import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { createCampaign } from "../usecases/campaign/CreateCampaign";

export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const campaign = await createCampaign({
      ...req.body,
      userId: req.user!.id
    });

    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
};