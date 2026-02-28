import { Response, NextFunction } from "express";
import { generateCampaignSummary } from "../usecases/campaign/GenerateCampaignSummary";
import { estimateROI } from "../usecases/campaign/EstimateROI";
import { generateReadmeMarkdown } from "../utils/ReadmeGenerator";
import { AuthRequest } from "../middlewares/authMiddleware";

export const exportReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const campaignId = req.params.id;

    const summary = await generateCampaignSummary(campaignId, req.user!.id);
    const roi = await estimateROI(campaignId, req.user!.id);

    const markdown = generateReadmeMarkdown(summary, roi);

    res.setHeader("Content-Type", "text/markdown");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=campaign-${campaignId}.md`
    );

    res.send(markdown);
  } catch (error) {
    next(error);
  }
};
