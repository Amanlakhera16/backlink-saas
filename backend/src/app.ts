import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes";
import campaignRoutes from "./routes/campaignRoutes";
import prospectRoutes from "./routes/prospectRoutes";
import billingRoutes from "./routes/billingRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { stripeWebhook } from "./controllers/stripeWebhookController";
import { env } from "./config/env";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());

const origins = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(",").map(o => o.trim()).filter(Boolean)
  : [];

app.use(
  cors({
    origin: origins.length ? origins : false,
    credentials: true
  })
);

app.post(
  "/api/billing/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/prospects", prospectRoutes);
app.use("/api/billing", billingRoutes);

app.use(errorHandler);

export default app;
