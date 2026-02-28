import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { create } from "../controllers/campaignController";
import { discover } from "../controllers/prospectController";
import { score, generate } from "../controllers/aiController";
import { exportReport } from "../controllers/reportController";



const router = Router();

router.post("/", authenticate, create);
router.post("/:id/discover", authenticate, discover);
router.post("/:id/score", authenticate, score);
router.post("/:id/generate-outreach", authenticate, generate);
router.get("/:id/export-report", authenticate, exportReport);

export default router;