import { z } from "zod";

export const campaignSchema = z.object({
  websiteUrl: z.string().url(),
  niche: z.string().min(2),
  region: z.string().min(2),
  backlinkType: z.string(),
  authorityThreshold: z.number().min(1).max(100),
  maxOutreach: z.number().min(1).max(100)
});