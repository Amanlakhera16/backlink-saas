import { Request, Response, NextFunction } from "express";
import { generateCampaignSummary } from "../usecases/campaign/GenerateCampaignSummary";
import { estimateROI } from "../usecases/campaign/EstimateROI";
import { generateReadmeMarkdown } from "../utils/ReadmeGenerator";

export const exportReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const campaignId = req.params.id;

    const summary = await generateCampaignSummary(campaignId);
    const roi = await estimateROI(campaignId);

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