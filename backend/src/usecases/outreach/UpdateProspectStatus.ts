import { ProspectModel } from "../../infrastructure/database/ProspectModel";

export const updateProspectStatus = async (
  prospectId: string,
  status: string,
  userId: string
) => {
  const allowedStatuses = ["sent", "responded", "backlink_secured"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const prospect = await ProspectModel.findOneAndUpdate(
    { _id: prospectId, userId },
    { status },
    { new: true }
  );

  return prospect;
};
