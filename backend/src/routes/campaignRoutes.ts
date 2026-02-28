import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { create } from "../controllers/campaignController";
import { discover } from "../controllers/prospectController";
import { score, generate } from "../controllers/aiController";
import { exportReport } from "../controllers/reportController";
import { validate } from "../middlewares/validate";
import { campaignSchema } from "../validators/campaignValidator";
import { userRateLimiter, aiRateLimiter } from "../middlewares/rateLimiters";

const router = Router();

router.post("/", authenticate, userRateLimiter, validate(campaignSchema), create);
router.post("/:id/discover", authenticate, userRateLimiter, discover);
router.post("/:id/score", authenticate, aiRateLimiter, score);
router.post("/:id/generate-outreach", authenticate, aiRateLimiter, generate);
router.get("/:id/export-report", authenticate, userRateLimiter, exportReport);

export default router;
