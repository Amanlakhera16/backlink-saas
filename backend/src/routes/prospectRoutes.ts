import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { updateStatus } from "../controllers/aiController";

const router = Router();

router.patch("/:prospectId/status", authenticate, updateStatus);

export default router;