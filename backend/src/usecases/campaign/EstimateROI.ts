import { ProspectModel } from "../../infrastructure/database/ProspectModel";

export const estimateROI = async (campaignId: string, userId: string) => {
  const backlinks = await ProspectModel.find({
    campaignId,
    userId,
    status: "backlink_secured"
  })
    .select("domainAuthority")
    .lean();

  if (backlinks.length === 0) {
    return {
      estimatedValue: 0,
      roiPercentage: 0
    };
  }

  const avgDA =
    backlinks.reduce((sum, p) => sum + (p.domainAuthority || 0), 0) /
    backlinks.length;

  const estimatedValue = avgDA * 10 * backlinks.length;
  const campaignCost = 100;

  const roiPercentage = ((estimatedValue - campaignCost) / campaignCost) * 100;

  return {
    estimatedValue: Number(estimatedValue.toFixed(2)),
    roiPercentage: Number(roiPercentage.toFixed(2))
  };
};
