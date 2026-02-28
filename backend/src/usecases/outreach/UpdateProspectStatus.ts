import { ProspectModel } from "../../infrastructure/database/ProspectModel";

export const updateProspectStatus = async (
  prospectId: string,
  status: string
) => {
  const allowedStatuses = [
    "sent",
    "responded",
    "backlink_secured"
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const prospect = await ProspectModel.findByIdAndUpdate(
    prospectId,
    { status },
    { new: true }
  );

  return prospect;
};