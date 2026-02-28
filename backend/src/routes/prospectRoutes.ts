import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { updateStatus } from "../controllers/aiController";
import { validate } from "../middlewares/validate";
import { statusSchema } from "../validators/statusValidator";
import { userRateLimiter } from "../middlewares/rateLimiters";

const router = Router();

router.patch("/:prospectId/status", authenticate, userRateLimiter, validate(statusSchema), updateStatus);

export default router;
