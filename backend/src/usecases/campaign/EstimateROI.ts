import { ProspectModel } from "../../infrastructure/database/ProspectModel";

export const estimateROI = async (campaignId: string) => {
  const backlinks = await ProspectModel.find({
    campaignId,
    status: "backlink_secured"
  });

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

  const campaignCost = 100; // baseline manual effort cost

  const roiPercentage =
    ((estimatedValue - campaignCost) / campaignCost) * 100;

  return {
    estimatedValue: Number(estimatedValue.toFixed(2)),
    roiPercentage: Number(roiPercentage.toFixed(2))
  };
};