import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { createCheckoutSession, createPortalSession } from "../controllers/billingController";
import { userRateLimiter } from "../middlewares/rateLimiters";

const router = Router();

router.post("/checkout", authenticate, userRateLimiter, createCheckoutSession);
router.post("/portal", authenticate, userRateLimiter, createPortalSession);

export default router;
