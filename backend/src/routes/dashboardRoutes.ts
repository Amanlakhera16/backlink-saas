import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { userRateLimiter } from "../middlewares/rateLimiters";
import { getStats } from "../controllers/dashboardController";

const router = Router();

router.get("/stats", authenticate, userRateLimiter, getStats);

export default router;
