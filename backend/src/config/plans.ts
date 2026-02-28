import { env } from "./env";

export type Plan = {
  id: string;
  maxCampaigns: number;
  maxOutreach: number;
  aiCallsPerMonth: number;
};

export const plans: Record<string, Plan> = {
  free: { id: "free", maxCampaigns: 1, maxOutreach: 25, aiCallsPerMonth: 50 },
  basic: { id: "basic", maxCampaigns: 5, maxOutreach: 200, aiCallsPerMonth: 500 },
  pro: { id: "pro", maxCampaigns: 20, maxOutreach: 1000, aiCallsPerMonth: 3000 },
  enterprise: { id: "enterprise", maxCampaigns: 100, maxOutreach: 5000, aiCallsPerMonth: 20000 }
};

export const priceIdToPlanId = (priceId: string) => {
  if (priceId === env.STRIPE_PRICE_BASIC) return "basic";
  if (priceId === env.STRIPE_PRICE_PRO) return "pro";
  if (env.STRIPE_PRICE_ENTERPRISE && priceId === env.STRIPE_PRICE_ENTERPRISE) {
    return "enterprise";
  }
  return "free";
};
