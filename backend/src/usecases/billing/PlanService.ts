import { SubscriptionModel } from "../../infrastructure/database/SubscriptionModel";
import { plans, Plan } from "../../config/plans";

export const getPlanForUser = async (userId: string): Promise<Plan> => {
  const sub = await SubscriptionModel.findOne({
    userId,
    status: { $in: ["active", "trialing"] }
  }).lean();

  if (!sub) return plans.free;

  return plans[sub.planId] || plans.free;
};
