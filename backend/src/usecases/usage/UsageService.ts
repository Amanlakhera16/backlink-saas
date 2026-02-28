import { UsageModel } from "../../infrastructure/database/UsageModel";
import { getPlanForUser } from "../billing/PlanService";
import { AppError } from "../../middlewares/errorHandler";

const monthKey = () => new Date().toISOString().slice(0, 7);

export const ensureAiAllowance = async (userId: string, count: number) => {
  const plan = await getPlanForUser(userId);
  const key = monthKey();
  const usage = await UsageModel.findOne({ userId, month: key }).lean();
  const used = usage?.aiCalls || 0;

  if (used + count > plan.aiCallsPerMonth) {
    throw new AppError(402, "AI usage limit exceeded for current plan");
  }
};

export const incrementAiUsage = async (userId: string, count: number) => {
  const key = monthKey();
  await UsageModel.findOneAndUpdate(
    { userId, month: key },
    { $inc: { aiCalls: count } },
    { upsert: true, new: true }
  );
};
