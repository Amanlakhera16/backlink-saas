import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { loginSchema, registerSchema } from "../validators/authValidator";
import { requireAllowedOrigin } from "../middlewares/requireOrigin";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", requireAllowedOrigin, refresh);
router.post("/logout", requireAllowedOrigin, logout);

export default router;
